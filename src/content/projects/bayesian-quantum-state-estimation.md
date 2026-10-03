---
title: Parallelized Bayesian Quantum State Estimation
description: A Bayesian quantum state tomography method that pools independent parallel Markov chains, achieving big speedups for reconstructing quantum states up to four qubits.
image: /images/quantum-state-cover.jpg
tags: ["quantum information", "Bayesian inference", "MCMC", "state tomography"]
parts: ["IBM Quantum systems", "pCN Metropolis–Hastings", "Bures parametrization", "64-bit MATLAB", "48-core workstation"]
year: 2025
status: completed
category: academic
featured: false
---

# Parallelized Bayesian Quantum State Estimation

## Overview

Quantum state tomography reconstructs quantum states from measurements. Bayesian inference does this with automatic uncertainty quantification, but is bottlenecked by long Markov chains. This project replaced slow serial chains with **many independent parallel chains**, pooled together.

## Method

- Parallelized preconditioned Crank–Nicholson Metropolis–Hastings (pCN) sampling.
- Unorthodox approach: directly pools independent chains rather than using coupled chains.
- Validated ex post facto with diagnostics like the intrachain autocorrelation time.

## Results

Demonstrated on simulated data and experimental runs from **IBM Quantum systems up to four qubits**, showing significant wall-clock speedups — roughly 100-fold lower estimation error at the same compute time with 1024 chains. The work was published in *New Journal of Physics* (2025). See [publications](/hansonswebsite/publications) for the abstract.