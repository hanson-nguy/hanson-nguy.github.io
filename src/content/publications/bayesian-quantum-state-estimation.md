---
title: "Unorthodox parallelization for Bayesian quantum state estimation"
authors: ["Hanson H Nguyen", "Kody J H Law", "Joseph M Lukens"]
venue: New Journal of Physics, 27 (5), 054507
year: 2025
citations: 6
link: https://iopscience.iop.org/article/10.1088/1367-2630/add618
---

Quantum state tomography (QST) allows for the reconstruction of quantum states through measurements and some inference technique under the assumption of repeated state preparations. Bayesian inference provides a promising platform to achieve both efficient QST and accurate uncertainty quantification, yet is generally plagued by the computational limitations associated with long Markov chains. In this work, we present a novel Bayesian QST approach that leverages modern distributed parallel computer architectures to efficiently sample a *D*-dimensional Hilbert space. Using a parallelized preconditioned Crank–Nicholson Metropolis–Hastings algorithm, we demonstrate our approach on simulated data and experimental results from IBM Quantum systems up to four qubits, showing significant speedups through parallelization. Although highly unorthodox in pooling independent Markov chains, our method proves remarkably practical, with validation ex post facto via diagnostics like the intrachain autocorrelation time. We conclude by discussing scalability to higher-dimensional systems, offering a path toward efficient and accurate Bayesian characterization of large quantum systems.
