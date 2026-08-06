---
title: Custom Mechanical Keyboard
description: A 60% hot-swap keyboard with a hand-wired matrix, custom laser-cut acrylic case, and QMK firmware mapped to my personal layout.
image: /images/keyboard.svg
tags: ["keyboard", "QMK", "soldering", "hand-wiring", "3D printing"]
parts: ["Pro Micro (ATmega32U4)", "Cherry MX switches x61", "1N4148 diodes", "acrylic plates", "M2 standoffs", "USB-C breakout"]
year: 2023
status: in-progress
featured: true
---

# Custom Mechanical Keyboard

## Overview

I wanted a keyboard that fits my desk, my layout, and my budget. Rather than buying a prebuilt, I designed a 60% layout, hand-wired the matrix, and sandwiched everything in a laser-cut acrylic case.

## The build

- **Matrix**: 5 columns × 14 rows, one diode per switch, all wired point-to-point.
- **Controller**: a Pro Micro running QMK, flashed to a custom keymap with layers for arrows and function keys.
- **Case**: three acrylic layers — top plate, mid, and base — cut locally and held together with M2 standoffs.

## Lessons

Hand-wiring 61 switches is therapeutic until you desolder a misplaced diode. Testing the matrix one row at a time with QMK's keyboard tester caught two shorts before the case went on.

## Current status

The build works, but I'm iterating on the case with a 3D-printed design to fix flex in the middle plate. Planning a v2 with a hot-swap PCB so future switches are a 30-second change.
