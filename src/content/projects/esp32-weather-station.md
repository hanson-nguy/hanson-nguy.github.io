---
title: ESP32 Weather Station
description: A solar-powered weather station that logs temperature, humidity, and barometric pressure to an MQTT broker and displays live data on a web dashboard.
image: /images/esp32-weather.svg
tags: ["ESP32", "IoT", "MQTT", "sensors", "PCB"]
parts: ["ESP32-WROOM-32", "BME280 sensor", "0.96\" OLED", "TP4056 charger", "18650 battery", "4.7kΩ pull-up resistors"]
year: 2024
status: completed
featured: true
links:
  github: https://github.com/hanthemanson/esp32-weather-station
---

# ESP32 Weather Station

## Overview

This project started as a way to monitor the microclimate in my workshop. The station reads temperature, humidity, and barometric pressure every five minutes, publishes the readings over MQTT, and wakes only long enough to transmit before returning to deep sleep.

## Design choices

- **Deep sleep**: the ESP32 sleeps between reads, giving ~4 months of uptime on a single 18650 charge.
- **MQTT + ESPHome-compatible topics**: keeps the firmware tiny and lets Home Assistant pick up the data with zero glue code.
- **BME280 on I²C**: one sensor covers all three measurements with solid accuracy and a tiny footprint.

## Firmware

Written in Arduino C++ with the `PubSubClient` library. Config lives in a single header so building a second unit only means editing WiFi credentials and the MQTT topic prefix.

## Build log

I burned through two PCB revisions. Rev 1 had the I²C pull-ups connected to the wrong rail; the fix was a single trace reroute on rev 2. That mistake taught me to always read the regulator's pinout before laying out the power plane.

## Future work

- Add a rain gauge using pulse counting on a spare GPIO
- Replace the OLED with a second unit as an indoor receiver
