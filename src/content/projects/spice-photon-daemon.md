---
title: SPICE Photon Daemon
description: A Python tool that generates photon source components for SNSPD SPICE circuits — symbol, model, config, and pulse waveform files in one run.
image: /images/poissonian_source.png
tags: ["LTspice", "SPICE", "SNSPD", "photon source", "Python"]
parts: ["Python script", "LTspice symbol (.asy)", "SPICE model (.lib)", "photon_sources.yaml", "pulse waveform (.pwl)"]
year: 2026
status: completed
category: academic
featured: false
---

# SPICE Photon Daemon

## Overview

A tool that generates a **photon source component** for SNSPD SPICE circuits. One run produces the `.asy` symbol, `.lib` model, `.yaml` config, and `.pwl` pulse files in a `photon` folder next to your project — so LTspice simulations of superconducting nanowire detectors get realistic photon pulses without hand-drawing waveforms.

## What it generates

For a circuit named `<circuit_name>.asc`, running the daemon creates a `photon` folder containing:

- **`.asy`** — the LTspice symbol for the photon source
- **`.lib`** — the SPICE model definition
- **`photon_sources.yaml`** — editable source configuration
- **`.pwl`** — the generated pulse waveform files

## Setup

```sh
python spice_photon.py -s <circuit_name>.asc
```

Then, in LTspice: **Tools → Control Panel → Sym. & Lib. Search Paths**, and point both Symbol and Library search paths at the generated `photon` folder. On Linux/macOS, symlink the script onto the PATH (`sudo ln -s $PWD/spice_photon.py /usr/local/bin/spicephoton`) to run it from anywhere.

## Photon sources

Each source is a trapezoidal pulse defined by six parameters:

- **`t_start` / `t_stop`** — when the source is active
- **`rate`** — photons per second
- **`wavelength`** — pulse energy (near-infrared 1550 nm for most SNSPD work)
- **`t_on`** — pulse width
- **`t_edge`** — rise/fall time

Three source types are supported in `photon_sources.yaml`:

| Type | Behavior |
|---|---|
| `poisson` | Poissonian photon stream at the average `rate` |
| `ideal` | Sub-Poissonian, exact photon rate |
| `custom` | User-defined pulse times via `t_steps` |

Edit sources live with `spice_photon -r <circuit>.asc`, regenerate with `-g`, or just run `spice_photon <circuit>.asc` to do both at once.

## Why it matters

Modeling SNSPD behavior in SPICE needs realistic photon arrivals as stimulus. This daemon turns photon physics (rate, wavelength, pulse shape) into proper LTspice stimulus files, so detector circuit design — like the electrothermal modeling in my [SNSPD SPICE project](/hansonswebsite/projects/snspd-electrothermal-spice) — can iterate quickly.