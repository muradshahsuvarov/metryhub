package main

import (
	"flag"
	"fmt"
	"log"
	"metryhub"
	"os"
	"os/signal"
	"syscall"

	mqtt "github.com/eclipse/paho.mqtt.golang"
	"google.golang.org/protobuf/proto"
)

func main() {
	var clientId string
	var topic string

	flag.StringVar(&clientId, "client_id", "myclientlistener", "Client id for the listener")
	flag.StringVar(&topic, "topic", "iot_device", "IoT device topic to listen to")
	flag.Parse()

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

		timestamp := data.Timestamp.AsTime()
		fmt.Printf("Received message on topic %s: Temp = %.2f, Humidity = %.2f, Timestamp = %s\n",
			msg.Topic(), data.GetData().Temperature, data.GetData().Humidity, timestamp.Format("2006-01-02 15:04:05.000000"))
	})

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

	// Wait for SIGINT (Ctrl+C) to exit
	signalCh := make(chan os.Signal, 1)
	signal.Notify(signalCh, os.Interrupt, syscall.SIGTERM)
	<-signalCh

	// Clean disconnect
	client.Disconnect(250)
	fmt.Println("Listener disconnected")
}
