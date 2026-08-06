---
title: Home Automation Hub
description: A Raspberry Pi Zero 2 W hub running Home Assistant that bridges Zigbee sensors, an MQTT broker, and a custom dashboard for my workshop.
image: /images/home-hub.svg
tags: ["Raspberry Pi", "Home Assistant", "Zigbee", "MQTT", "Docker"]
parts: ["Raspberry Pi Zero 2 W", "Zigbee USB stick", "Aqara door sensors x3", "ESP32 relay board"]
year: 2025
status: in-progress
featured: true
---

# Home Automation Hub

## Overview

A low-power hub that ties together the sensors scattered around my workshop. Everything runs as Docker containers on a Pi Zero 2 W, so the whole stack is reproducible from a compose file.

## Architecture

- **Home Assistant** — the brain and dashboard.
- **Zigbee2MQTT** — bridges a USB Zigbee stick to MQTT.
- **Mosquitto** — the message broker that my ESP32 projects also publish to.
- **Node-RED** — light automation, e.g. turning on the workshop lights when the door sensor opens after dark.

## Why the Pi Zero 2 W

It sips power and is cheap enough to be disposable. The USB host runs the Zigbee stick, and a fanless heatsink case keeps it below throttling even under load.

## Ongoing work

I'm replacing the SD card with USB boot from an external SSD — SD corruption after a power cut is my least favourite recurring fix.
