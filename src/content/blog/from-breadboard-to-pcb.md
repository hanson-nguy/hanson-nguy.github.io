---
title: "From Breadboard to PCB: What I Learned on My First Board"
date: 2025-04-02
description: What changed when I stopped prototyping on a breadboard and sent my first PCB to fab — layout rules of thumb, ordering gotchas, and why you should expect a rev 2.
image: /images/pcb.svg
tags: ["PCB", "KiCad", "design", "manufacturing"]
---

# From Breadboard to PCB: What I Learned on My First Board

## Why make the jump

Breadboards are fine for verifying that a circuit *can* work. They're terrible at answering whether it works *reliably* — dodgy connections, parasitic capacitance, and flying wires that change resistance every time you bump them. Moving to a real PCB fixed all three.

## Layout rules of thumb

- **Decouple aggressively**: a 100nF capacitor within a few mm of every IC's power pin. This is the highest-value habit on the list.
- **Ground is your friend**: use a ground pour on both layers and stitch it with vias. Chasing a floating ground through a dead board teaches this faster than any guide.
- **Thicken power traces** until they feel silly. A 1oz copper trace's current limit is lower than you think.

## Ordering gotchas

- Check your fab's **minimum trace/space** before designing, not after.
- Order the **cheapest options for the first run** — prototype boards exist to be scrapped.
- Include a **silkscreen label of the board revision**; otherwise you can't tell rev 1 from rev 2 sitting in a drawer.

## Expect rev 2

My first board worked, then didn't. The I²C pull-up rail issue (written up in the weather station build log) meant a respin. That's normal. Budget for it emotionally and financially: the second board is always the good one.

## Tools

KiCad is free, has no license nonsense, and its community libraries cover almost every part you'll use. Start there.
