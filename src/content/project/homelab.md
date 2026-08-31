---
title: Homelab
description: An N100 mini PC running Proxmox and most of the software I use at home.
status: ongoing
stack: ["Proxmox", "LXC", "Docker", "Tailscale", "Caddy"]
publishDate: "2025-11-01"
draft: false
---

An N100 Intel mini PC from Acemagic running Proxmox, and most of the software I use at home runs on it.

I started it in November 2025 because I wanted to own my own software. That was basically the whole reason, and it seemed like a fun thing to build too. It ran on a Raspberry Pi 4B at first and moved onto the mini PC in January.

The 2 things I actually wanted were Immich and Jellyfin. I had a huge amount of physical media at home and no good way to play any of it. The photos were the same problem in a different shape, floating around across phones and drives and whatever account I happened to be signed into. Both of those are consolidation jobs. Immich is holding about 13,000 photos now and Jellyfin plays the media.

Everything runs as LXC containers on the Proxmox host, 7 or so at the moment. Jellyfin, Immich, Miniflux for RSS, Samba for file shares, a Homepage dashboard to find it all, and a Docker media stack.

There are no inbound ports open on the host. Every service is reachable over a Tailscale mesh with MagicDNS, so it's just a name on the tailnet and nothing is sitting exposed on the internet waiting to be found. The few things that do need to be public go out through Caddy and a Cloudflare Tunnel.

It's taught me a ton. Networking, Linux, storage, Docker, all of it the way you learn when something breaks and you're the one who has to work out what broke.

There's no repo for this one, it's a box in my house. Ongoing mostly means I keep finding more things I want to move onto it.
