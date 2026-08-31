---
title: Long Distance Wrapped
description: A Spotify Wrapped style recap of 2 years of long distance, built as a birthday present and opened up for anyone to fork.
status: shipped
repo: https://github.com/trapp01/Long-Distance-Wrapped
link: https://demo.longdistancewrapped.com
stack: ["TypeScript", "React", "Tailwind", "motion", "DuckDB"]
publishDate: "2026-07-25"
draft: false
---

A Spotify Wrapped style recap for 2 people in 2 time zones. You tap through full-screen cards on your phone like Instagram stories, with music underneath. 18 cards in 4 chapters, and the chapters are times of day, so a chapter change is a sky change and a music change. There's a dot-rendered Earth with the real arc between the 2 cities, a quiz, and a share card at the end. It plays end to end on a fictional couple with nothing configured.

I built it as a birthday present for my girlfriend. The last 2 years of our relationship have been long distance, and the record of that is a Signal export, so it's built off our real texting and calling patterns. The bar was that it had to feel indistinguishable from the real Wrapped, on her phone, opened once. There's no second first impression, so every card shipped polished or it didn't ship.

The engine landed in a day and the 18 cards took the 2 days after it. It was built the same way as the projects in [the AI post](/posts/getting-out-of-the-ais-way/), parallel agents each owning their own files against a frozen `types.ts`, nothing merging until it cleared the full build and test run. Then I watched the finished deck on the phone it was built for, and that produced 19 fixes across 16 cards, all the same problem, a big number on screen with nothing saying what it was counting. The pacing was measured too, off a 41 second screen capture of the real thing, and the first draft's headline hold came out 5 times too fast.

The numbers come from the Signal backup flattened into DuckDB, and a local model writes the SQL. It gets the schema and never the messages, and nothing touches the network. Each card's stats are a typed module and the tests hold them to each other, so a figure 2 cards quote is one constant.

The public version is the same engine with the 2 of us taken out. The demo couple lives in Vancouver and Seoul, every figure, date and quoted message is invented and listed in one doc, and the visit photos are generated sky art so there are no faces anywhere. It's a fresh repo too, so none of the real data was ever in the history. To make it yours you swap in your 2 cities, your trips, your stats, 4 music beds and your photos, and then you rewrite the cards. The engine and the primitives you leave alone.

The private one landed at the end of July. The public one went up on August 30th with a live demo, MIT for the code and Creative Commons for the music. The honest caveat is that making it yours is a writing job, not a config file, because the copy lives in each card. And a Signal export only stores when a call started, not how long it ran, so there's no hours on the phone card.
