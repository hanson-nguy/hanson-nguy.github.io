---
title: Building the ESP32 Weather Station, Start to Finish
date: 2024-06-14
description: A full build log of my solar-powered weather station — from sensor choice and schematic to firmware and the two PCB revisions it took to get it right.
image: /images/build-log.svg
tags: ["build log", "ESP32", "sensors", "PCB"]
---

# Building the ESP32 Weather Station, Start to Finish

## Why a weather station

I needed temperature and humidity data for the workshop before adding a heater. The cheapest commercial sensors don't log anything, and I wanted the data wired into Home Assistant anyway. Building my own made the decision easy.

## Sensor choice

The **BME280** gives temperature, humidity, and barometric pressure from one chip on I²C. It's cheap, well-documented, and Adafruit's library abstracts the register plumbing. For indoor-ish measurement that's the sweet spot — no calibration gymnastics.

## Schematic thinking

Keep the power path boring: a TP4056 charging an 18650 through a protection board, feeding a low-dropout regulator for the 3.3V rail. The ESP32 pulls ~80mA average in deep-sleep duty cycling, so battery life measured in months comes almost for free.

## Firmware loop

The whole loop is:

1. Wake from deep sleep.
2. Read the BME280.
3. Connect to WiFi.
4. Publish to MQTT with a retained flag.
5. Sleep for five minutes.

That's it. Retained messages mean new dashboards always show the last reading even before the next cycle.

## The PCB mistake

Rev 1 placed the I²C pull-up resistors on the raw 3.3V rail that only exists when the USB is plugged in. On battery power the bus had no pull-ups and the bus deadlocks. Rev 2 rerouted them to the always-on rail. Reading the regulator datasheet first would have saved me a fab run.

## What I'd do differently

- Add a voltage divider on the battery so the firmware can report charge state.
- Design the case before the PCB so the mounting holes actually line up.

## Files

The KiCad sources, firmware, and print files live in the [project repo](https://github.com/hanthemanson/esp32-weather-station).
