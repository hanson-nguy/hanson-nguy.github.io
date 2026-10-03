---
title: SNSPD Electrothermal Feedback in SPICE
description: A compact thermal model for superconducting nanowire single-photon detectors in SPICE, capturing residual heating effects for fast circuit design.
image: /images/snspd-cover.jpg
tags: ["superconducting detectors", "SPICE", "electrothermal modeling", "SNSPD"]
parts: ["SPICE simulator", "compact thermal model", "SNSPD devices", "finite-element validation"]
year: 2025
status: completed
category: academic
featured: true
---

# SNSPD Electrothermal Feedback in SPICE

## Overview

Superconducting nanowire single-photon detectors (SNSPDs) show complex switching behavior driven by electrothermal feedback during detection. Modeling this is essential for designing detectors, but most models trade accuracy for computational speed and design-time integration.

## Approach

Built upon the growing ecosystem of SPICE tools for superconducting nanowire devices by capturing **complex residual heating effects** in a compact thermal model of an SNSPD.

## Results

The model is comparable to far more expensive thermal models — including finite-element simulations — while remaining fast and easy to integrate for circuit designers. Published in *IEEE Transactions on Applied Superconductivity* (2025). See [publications](/hansonswebsite/publications) for the abstract. For the companion stimulus-generation tool, see the [SPICE Photon Daemon](/hansonswebsite/projects/spice-photon-daemon).