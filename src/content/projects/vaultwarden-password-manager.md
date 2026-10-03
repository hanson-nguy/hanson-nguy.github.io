---
title: Self-Hosted Password Manager on a Raspberry Pi 4
description: Vaultwarden behind nginx in Docker, reachable only over the Tailscale VPN — a zero-public-exposure password manager for the family.
image: /images/vaultwarden.jpg
tags: ["Vaultwarden", "Raspberry Pi", "Docker", "Tailscale", "nginx", "self-hosting"]
parts: ["Vaultwarden", "Raspberry Pi 4", "Docker + docker-compose", "nginx reverse proxy", "Tailscale", "SQLite"]
year: 2026
status: completed
category: hobby
featured: false
---

# Self-Hosted Password Manager on a Raspberry Pi 4

## Overview

A self-hosted Vaultwarden password manager running on a Raspberry Pi 4 in Docker, fronted by nginx, and reachable only over my Tailscale VPN. All Bitwarden clients — browser extension, mobile apps, CLI — sync to it, while the server stays off the public internet entirely.

## Why Vaultwarden

The official Bitwarden server is Node-heavy and eats a couple GB of RAM — too much for a Pi 4 that also runs my hub. Vaultwarden is a Rust rewrite of the server that stays Bitwarden-compatible across clients while idling under 100MB. For single-user-plus-family, it's the whole server in one container.

## Architecture

Client → Tailscale wireguard → nginx inside Docker → Vaultwarden container. Everything lives behind the VPN; nothing is exposed to the public internet. nginx handles TLS, request logging, and redirecting root paths to `/vault`.

## Setup notes

- `docker-compose` with two services: `vaultwarden` and `nginx-proxy`.
- Vaultwarden runs with a SQLite database on a bind-mounted volume, so re-creating containers never touches the vault. Single-file storage also makes backups trivial — no separate database server to manage.
- HTTPS via a Tailscale MagicDNS certificate — valid over the tailnet without buying a domain.

## Security model

- **No port forwarding.** The Pi binds to the tailnet interface only, so the service is unreachable from the open internet.
- **App-level 2FA** (Bitwarden's own TOTP) stays on — defense in depth layered on top of VPN access.
- **Backup** = stop the container, `sqlite3 .backup` the database, copy the file to another machine, restart. Restore is dropping the file back in place.

## Lessons

The first lesson was port discipline: Vaultwarden wants port 80, and the hub was already on it, so the proxy splits TLS and vault detection across two containers on separate internal ports. Second, Tailscale certs have a 90-day TTL — the renewal timer is now part of my weekly check.