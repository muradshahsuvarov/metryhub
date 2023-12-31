# METRYHUB

### Description
Online market for iot device data exchange

### Install Mosquitto

[Mosquitto Download Page](https://mosquitto.org/download/)

### Generating proto go files for IoT Simulator

```
    protoc --go_out=. --go_opt=paths=source_relative --go-grpc_out=. --go-grpc_opt=paths=source_relative device.proto
```

### Run Local Listener

```
    go run listener.go -client_id "Client Name" -topic "Topic Name" -device_token "Device Token"
```

Example:

```
    go run listener.go -client_id Murad -topic iot_device_2 -device_token DqvdA5u-_QIQi7mGD094rtTX3xs=
```

### Run IoT Device Simulator

```
    go run .\iot_device.go -client_id <Client Name> -device_token <Device Name> -topic <Mosquitto topic>
```

Example:

```
    go run .\iot_device.go -client_id "MyClient" -device_token "HumidSense" -topic "iot_device_1"
```

### Run Mosquitto Subscriber

```
mosquitto_sub -h localhost -t <Mosquitto topic>
```

Example:

```
mosquitto_sub -h localhost -t "iot_device_1"
```