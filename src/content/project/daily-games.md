---
title: Daily Games
description: A shared engine for 5 minute daily puzzle games, with 2 games running on it.
status: building
repo: https://github.com/trapp01/Daily-Games
stack: ["TypeScript", "React", "Tailwind", "zod", "vitest"]
publishDate: "2026-08-22"
draft: false
---

A shared engine for 5 minute daily puzzle games, the NYT Games shape. One platform owns the calendar, the saving, the streaks, the stats and the share grid. A game is a folder that implements a small typed contract, and that's it.

::github{repo="trapp01/Daily-Games"}

I built it that way because the hard parts of a daily game aren't the puzzles. They're things like which day it is for someone 2 timezones over at 11:58pm during a DST shift, or whether you get your board back when you refresh halfway through, or whether playing the same day twice double counts your streak, or whether the share grid quietly leaks the answer. Solve those once per game and you end up writing the same 5 bugs 5 times. So the engine answers all of them and a game doesn't get a vote.

The engineering model came from Capcom's RE Engine. They consolidated onto one in-house engine and then shipped survival horror, character action, fighting and monster hunting on top of it, faster and more consistently than they had before. The engine is where the leverage is. This is that at hobby scale, and the bet is that adding the 10th game costs about what adding the 2nd did.

The narrow contract makes a game safe to generate too. The surface a new game can get wrong is small enough to write down in a paragraph, and there's a conformance suite that runs a headless player through the real engine before anything counts as done. It passes or it doesn't.

2 games run on it right now. Lowball gives you 5 real things that sold online and asks what each one went for, scored on a log curve, with a Showcase round at the end where going over is worth nothing. Hot Take gives you 3 reviews of a movie and asks you to name it. Lowball sits behind 148 tests.

It's early. There's no settings screen, no archive and no native shell. What's there is the engine, the kit, the conformance suite, the scaffolder and the content pipeline, all under test, with 2 games on top proving they work.
