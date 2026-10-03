---
title: SPICE Photon Daemon
description: A compact SPICE thermal model for superconducting nanowire single-photon detectors, capturing electrothermal feedback for fast circuit design.
image: /images/pcb.svg
tags: []
parts: [LT Spice]
year: 2025
status: completed
category: academic
featured: false
---

# SPICE Photon Daemon

## Overview

A model used in spice

## How it works

The ESP8266 runs a tiny web server. Hit its IP, change the theme or the brightness, and it persists settings in flash. Time syncs over NTP; weather comes from a free API on startup and every hour.

## Powering the panel

P10 panels draw real current. I sized a 5V/10A supply, added 470µF of bulk capacitance at the panel input, and kept the ESP8266 on its own regulator branch to avoid brownouts during full-white frames.

## Takeaways

- The panel's refresh flickers in photos — run it at max brightness only in normal use.
- This was my first project with a real SMD driver IC (74HC245); soldering the TSSOP-20 package with a fine tip is very doable at home.
