---
title: Home Automation Hub
description: A Raspberry Pi 5 hub running Home Assistant that bridges Zigbee sensors, an MQTT broker, and a custom dashboard for my workshop.
image: /images/Home_Assistant_Logo.svg
tags: ["Raspberry Pi", "Home Assistant", "Zigbee", "MQTT", "Docker", "Ollama"]
parts: ["Raspberry Pi 5", "Zigbee USB stick", "Aqara door sensors x3", "ESP32 relay board"]
year: 2025
status: in-progress
category: hobby
featured: true
---

# Home Automation Hub

## Overview

Raspberry pi 5, sensors, NAS, plex, home server

A low-power hub that ties together the sensors scattered around my workshop. Everything runs as Docker containers on a Pi Zero 2 W, so the whole stack is reproducible from a compose file.

## Architecture

- **Home Assistant** — the brain and dashboard.
- **Zigbee2MQTT** — bridges a USB Zigbee stick to MQTT.
- **Mosquitto** — the message broker that my ESP32 projects also publish to.
- **Node-RED** — light automation, e.g. turning on the workshop lights when the door sensor opens after dark.

## Ongoing work


