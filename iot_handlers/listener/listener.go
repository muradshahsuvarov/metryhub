package main

import (
	"bytes"
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"metryhub"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	mqtt "github.com/eclipse/paho.mqtt.golang"
	"google.golang.org/protobuf/proto"
)

var deviceToken string

const unsentMessagesFile = "unsent_messages.txt"

type DeviceData struct {
	DeviceToken string `json:"deviceToken"`
	DataKey     string `json:"dataKey"`
	DataValue   string `json:"dataValue"`
}

func main() {
	var clientId string
	var topic string

	flag.StringVar(&clientId, "client_id", "myclientlistener", "Client id for the listener")
	flag.StringVar(&topic, "topic", "iot_device", "IoT device topic to listen to")
	flag.StringVar(&deviceToken, "device_token", "", "Device token for authentication")
	flag.Parse()

	if deviceToken == "" {
		log.Fatal("Device token is required")
	}

	// MQTT broker setup
	opts := mqtt.NewClientOptions().AddBroker("tcp://localhost:1883")
	opts.SetClientID(clientId)

	// Define the message handler
	opts.SetDefaultPublishHandler(func(client mqtt.Client, msg mqtt.Message) {
		data := &metryhub.IotData{}
		err := proto.Unmarshal(msg.Payload(), data)
		if err != nil {
			log.Printf("Error unmarshalling message: %s", err)
			return
		}

		postDataToServer(data)
	})

	opts.SetCleanSession(false)

	// Create and start a client using the above options
	client := mqtt.NewClient(opts)
	if token := client.Connect(); token.Wait() && token.Error() != nil {
		log.Fatal(token.Error())
	}

	// Subscribe to the topic
	if token := client.Subscribe(topic, 1, nil); token.Wait() && token.Error() != nil {
		log.Fatal(token.Error())
	}

	fmt.Printf("Subscribed to topic %s\n", topic)

	// Handle unsent messages
	handleUnsentMessages()

	// Wait for SIGINT (Ctrl+C) to exit
	signalCh := make(chan os.Signal, 1)
	signal.Notify(signalCh, os.Interrupt, syscall.SIGTERM)
	<-signalCh

	// Clean disconnect
	client.Disconnect(250)
	fmt.Println("Listener disconnected")
}

func postDataToServer(data *metryhub.IotData) {
	deviceData := DeviceData{
		DeviceToken: deviceToken,
		DataKey:     "Temperature",
		DataValue:   fmt.Sprintf("%.2f", data.GetData().Temperature),
	}

	dataBytes, err := json.Marshal(deviceData)
	if err != nil {
		log.Printf("Error marshalling data: %v", err)
		saveUnsentMessage(dataBytes)
		return
	}

	resp, err := http.Post("http://localhost:8080/device-data", "application/json", bytes.NewBuffer(dataBytes))
	if err != nil || resp.StatusCode != http.StatusOK {
		log.Printf("Failed to send data to server: %v", err)
		saveUnsentMessage(dataBytes)
		return
	}

	fmt.Println("Data sent successfully")
}

func saveUnsentMessage(data []byte) {
	file, err := os.OpenFile(unsentMessagesFile, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		log.Printf("Error opening file to save unsent message: %v", err)
		return
	}
	defer file.Close()

	if _, err := file.Write(append(data, '\n')); err != nil {
		log.Printf("Error writing unsent message to file: %v", err)
	}
}

func handleUnsentMessages() {
	data, err := os.ReadFile(unsentMessagesFile)
	if err != nil {
		log.Printf("Error reading unsent messages file: %v", err)
		return
	}

	messages := bytes.Split(data, []byte{'\n'})
	for _, msg := range messages {
		if len(msg) > 0 {
			resp, err := http.Post("http://localhost:8080/device-data", "application/json", bytes.NewBuffer(msg))
			if err != nil || resp.StatusCode != http.StatusOK {
				log.Printf("Failed to resend unsent data: %v", err)
				return
			}
		}
	}

	// Clear the file after successfully sending all messages
	if err := os.Truncate(unsentMessagesFile, 0); err != nil {
		log.Printf("Error clearing unsent messages file: %v", err)
	}
}
