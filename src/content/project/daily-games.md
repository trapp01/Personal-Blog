---
title: Daily Games
description: A shared engine for 5 minute daily puzzle games, with 3 games running on it.
status: building
repo: https://github.com/trapp01/Daily-Games
stack: ["TypeScript", "React", "Tailwind", "zod", "vitest"]
publishDate: "2026-08-22"
draft: false
---

A shared engine for 5 minute daily puzzle games, the NYT Games shape. One platform owns the calendar, the saving, the streaks, the stats and the share grid. A game is a folder that implements a small typed contract, and that's it.

Two reasons I wanted this. The only games I play every day are the NYT ones, and I wanted more games of that shape that aren't word puzzles, made for me. And I wanted a place to find out how fast an AI can get a small game right when the ground under it is solid, so my time goes into ideas instead of plumbing. It's an experiment and it's still running.

The shape is mine. I'm really inspired by what Capcom did with the RE Engine: they consolidated onto one in-house engine and then shipped survival horror, character action, fighting and monster hunting on top of it, faster and more consistently than they had before. The engine is where the leverage is. So the engine is the product, a game is a small folder that plugs into it, and the bet is that adding the 10th game costs about what adding the 2nd did. That's as far as my design goes.

Everything inside that shape is Claude's, the same split I wrote about in [Getting Out of the AI's Way](/posts/getting-out-of-the-ais-way/). I typed the vision and what building a game should feel like. Claude wrote its own [CLAUDE.md](https://github.com/trapp01/Daily-Games/blob/main/CLAUDE.md) off that and worked backwards into the rules: a game can't touch the date, localStorage, Math.random or fetch; the engine persists the action log rather than the state and rebuilds a board by replaying it; a conformance suite plays every game headless through the real engine before it counts as done. I review every diff and I play every game by hand, because no suite tells you whether a game feels right.

The reason those rules hold up, in Claude's reasoning rather than mine, is that the hard parts of a daily game aren't the puzzles. They're which day it is for someone 2 timezones over at 11:58pm during a DST shift, whether you get your board back when you refresh halfway through, whether playing the same day twice double counts your streak, whether the share grid quietly leaks the answer. The engine answers all of them once and a game doesn't get a vote.

3 games run on it right now, behind 290 tests. Wordwheel puts seven letters on a wheel with a crossword above it, and valid words that aren't on the board bank as bonus finds. Bridge asks for the one word that sits between two compounds, FIRE __ HOLE is MAN, five a day with the hardest last. Overlap shows four photos that share exactly one word, spelled from a tray salted with decoys that also spell real words.

The one-shot test has worked once. A fresh session got four sentences and the repo and came back with a whole game, rules, screen, home-page art and tests, all green. That game has since been pulled, and a lot of how the contract looks comes from what happened during that run.

It's early. The engine, the kit, the conformance suite, the scaffolder, the content pipeline and a per-game archive are built and under test. There's no settings screen, no accounts and no native shell, and it isn't online yet.
