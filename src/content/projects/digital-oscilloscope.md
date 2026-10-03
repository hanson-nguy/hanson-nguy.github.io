---
title: Zynq Ultrascale Plus Data Acquisition Platform
description: An FPGA data acquisition stack on the Zynq Ultrascale+ MPSoC — SNSPD-like signal generation, 14-bit serialization over LVDS, and DMA streaming into Linux userspace via Petalinux.
image: /images/zynq_daq_architecture.png
tags: ["data acquisition", "System on a chip", "analog-to-digital", "FPGA"]
parts: ["Zynq Ultrascale Plus (ZCU102)"]
year: 2026
status: completed
category: hobby
featured: true
---

# Zynq Ultrascale Plus Data Acquisition Platform

## Overview

This project implements a full data acquisition stack on the Zynq Ultrascale+ MPSoC, a 16nm FPGA multi-processor system on a chip. The design spans both halves of the chip: programmable logic (PL) for the signal path, and a processing system (PS) running Linux for data access.

## Design

- **Signal generation**: a linear feedback shift register generates pseudo-random pulses, thresholded into Poissonian SNSPD-like signals that decay exponentially — mimicking the LR behavior of real superconducting nanowire single-photon detectors.
- **Serialization**: 14-bit samples move through a custom gearbox into 8-bit words, then OSERDES/ISERDES blocks transmit them over LVDS differential pairs through FMC connectors at DDR rates.
- **System integration**: the RTL is packaged as an IP block and wired to an AXI DMA that streams data from the PL into PS memory.
- **Software**: a Petalinux image with a u-dma-buf driver exposes the DMA buffer to userspace as `/dev/udmabuf0`, readable from Python.

## What works

The serialization path was verified with testbenches and a system ILA, and DMA captures were read back into Python and plotted. The ZCU102 boots the Petalinux image and streams data end to end.

## Next steps

The deserializer needs stronger bit-alignment infrastructure for reliable high-speed transfer, and the single AXI DMA produces discontinuous captures — scatter-gather or cyclic mode would enable continuous streaming from any ADC front end.
