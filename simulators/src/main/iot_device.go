package main

import (
	"flag"
	"log"
	"math/rand"
	"metryhub"
	"time"

	mqtt "github.com/eclipse/paho.mqtt.golang"
	"google.golang.org/protobuf/proto"
	"google.golang.org/protobuf/types/known/timestamppb"
)

func main() {

	var clientId string
	var deviceToken string
	var topic string

	flag.StringVar(&clientId, "client_id", "myclient", "Client id")
	flag.StringVar(&deviceToken, "device_token", "devicetoken", "Unique device name")
	flag.StringVar(&topic, "topic", "iot_device", "IoT device topic")
	flag.Parse()

	// MQTT broker setup
	opts := mqtt.NewClientOptions().AddBroker("tcp://localhost:1883")
	opts.SetClientID(clientId)
	client := mqtt.NewClient(opts)
	if token := client.Connect(); token.Wait() && token.Error() != nil {
		log.Fatal(token.Error())
	}

	// Data generation and publishing loop
	ticker := time.NewTicker(1 * time.Millisecond)
	for range ticker.C {
		// Generate simulated IoT data
		data := metryhub.IotData{
			DeviceToken: deviceToken,
			Data: &metryhub.IotData_DeviceData{
				Temperature: rand.Float32() * 100,
				Humidity:    rand.Float32() * 100,
			},
			Timestamp: timestamppb.Now(),
		}

		// Serialize the data to Protobuf
		serializedData, err := proto.Marshal(&data)
		if err != nil {
			log.Fatal("Failed to serialize data: ", err)
		}

		// Publish the serialized data
		token := client.Publish(topic, 0, false, serializedData)
		token.Wait()
		if token.Error() != nil {
			log.Println("Publish error:", token.Error())
		}
	}
}
