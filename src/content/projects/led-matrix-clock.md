---
title: LED Matrix Clock
description: A WiFi-connected RGB LED matrix clock with configurable brightness, a weather overlay, and a web interface for changing themes.
image: /images/led-matrix.svg
tags: ["ESP8266", "LED matrix", "WiFi", "web server", "P10 panel"]
parts: ["ESP8266 (NodeMCU)", "P10 32x16 RGB panel", "5V 10A supply", "74HC245 shifters", "capacitors 470µF"]
year: 2024
status: completed
featured: false
---

# LED Matrix Clock

## Overview

A P10 RGB panel driven by an ESP8266 that shows the time, date, and a scrolling weather line. Brightness auto-dims after midnight so it doesn't light up the whole bedroom.

## How it works

The ESP8266 runs a tiny web server. Hit its IP, change the theme or the brightness, and it persists settings in flash. Time syncs over NTP; weather comes from a free API on startup and every hour.

## Powering the panel

P10 panels draw real current. I sized a 5V/10A supply, added 470µF of bulk capacitance at the panel input, and kept the ESP8266 on its own regulator branch to avoid brownouts during full-white frames.

## Takeaways

- The panel's refresh flickers in photos — run it at max brightness only in normal use.
- This was my first project with a real SMD driver IC (74HC245); soldering the TSSOP-20 package with a fine tip is very doable at home.
