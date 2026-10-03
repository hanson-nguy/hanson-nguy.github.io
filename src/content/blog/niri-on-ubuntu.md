---
title: Niri on Ubuntu — my scrollable-tiling setup
description: Swapping classic grid tiling for niri's scrollable workspace model on Ubuntu 26.04 — install, layout, keybindings, and the window rules that keep Firefox PiP, WezTerm and PlanAhead behaving.
date: 2026-09-07
image: /images/niri-setup.png
tags: ["niri", "wayland", "linux", "tiling", "rice"]
category: hobby
---

# Niri on Ubuntu — my scrollable-tiling setup

I finally moved off the classic grid model and onto [niri](https://yalter.github.io/niri/), a scrollable-tiling Wayland compositor, on Ubuntu 26.04. This isn't a deep dive — just why I switched, what my config looks like, and the few things that make it feel right to me.

## Why niri

Traditional tilers fit windows into a fixed grid on each workspace. niri throws that out: every workspace is an infinite column of windows that you scroll through vertically with the wheel. Your workspace grows as you open things instead of squeezing windows into smaller tiles. For a single 14" laptop screen, that's exactly the model I wanted — no more juggling monitor 1/2/3 layouts for windows that don't fit.

The catch is it's still fairly young, so expect to hand-write some window rules. The payoff is a compositor that's coherent top to bottom rather than session-variables stitched together.

## Install

On Ubuntu 26.04 it's just the packaged `niri`. Confirming the version:

```
hansonng@blade:~$ niri msg version
Compositor version: 26.04 (unknown commit)
CLI version:        26.04 (unknown commit)
```

Pick it from your display manager (or start it manually), and you're in. The config is KDL, not TOML — nodes, not key-value soup.

## The config at a glance

The whole thing lives in `~/.config/niri/config.kdl` and is intentionally split up with `include` so I don't have one monster file:

```
include "dms/cursor.kdl"
include "dms/outputs.kdl"
include "dms/binds.kdl"
include "dms/windowrules.kdl"
```

Layout is minimal — 16px gaps and new windows default to half the screen:

```
layout {
    gaps 16
    default-column-width { proportion 0.5; }
    focus-ring {
        width 4
        active-color "#7fc8ff"
        inactive-color "#505050"
    }
}
```

I run the focus ring and leave the border disabled, so the active window glows blue without everything looking boxed in. Mouse is set to a flat acceleration curve to keep pointer motion predictable:

```
mouse {
    accel-speed -0.5
    accel-profile "flat"
}
```

The laptop screen is set to its 144Hz mode (`1920x1080@143.999`), which keeps the scroll animation buttery.

## Keybindings I actually use

The full `binds` block is long, but the ones I hit every day:

```
Mod+T                           { spawn "alacritty"; }
Mod+D                           { spawn "fuzzel"; }
Super+Alt+L                     { spawn "swaylock"; }

Mod+H/J/K/L                     { focus-column/window; }
Mod+C                           { center-column; }
Mod+F                           { maximize-column; }
Mod+R                           { switch-preset-column-width; }
Mod+V                           { toggle-window-floating; }
Mod+W                           { toggle-column-tabbed-display; }

Mod+WheelScrollDown cooldown-ms=150 { focus-workspace-down; }
Mod+WheelScrollUp   cooldown-ms=150 { focus-workspace-up; }

Mod+1..9                        { focus-workspace; }

Print                           { screenshot; }
Ctrl+Print                      { screenshot-screen; }
Alt+Print                       { screenshot-window; }
```

The scroll-to-switch-workspace binding is the whole point of the compositor — hold Mod, spin the wheel, glide between workspaces. The `cooldown-ms=150` stops one flick of the wheel from flying through five workspaces.

Volume, brightness and media keys go through `wpctl`, `playerctl` and `brightnessctl`, all with `allow-when-locked=true` so they work on the lock screen.

## Window rules

A few apps need a nudge to behave. Firefox's picture-in-picture gets floated, and WezTerm's initial-configure quirk is worked around with an empty column width:

```
window-rule {
    match app-id=r#"firefox$"# title="^Picture-in-Picture$"
    open-floating true
}

window-rule {
    match app-id=r#"^org\.wezfurlong\.wezterm$"#
    default-column-width {}
}

window-rule {
    match app-id="ui-PlanAhead"
    open-floating true
}
```

## Gripes / next

A couple of rough edges: some apps assume a grid tiler and need hand-written rules, and niri is young enough that you'll occasionally find a quirk worth reporting upstream. Still, for a scrollable workflow on a single screen, it's the most comfortable setup I've had in a while. Next up: a proper status bar and sorting out the hot-corner overview to my taste.
