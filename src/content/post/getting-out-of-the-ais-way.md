---
title: Getting Out of the AI's Way
description: The two side projects I have going right now, and the one idea underneath both of them.
publishDate: "2026-08-30"
tags: ["ai", "projects"]
draft: false
---

I've got two side projects going right now. On paper they've got nothing to do with each other, one is a trading tool and the other is a website with daily puzzle games on it. But they're the same idea underneath. Both of them are me trying to build something solid enough underneath the AI that I can leave it alone and trust what comes out the other side.

The first one is called tape. Day trading has felt like an impenetrable fortress to me for the longest time. I know the studies where only 1% of people make money at it, so I'm not walking in expecting anything. But it looks like such a fun activity, and the thing that always stopped me is that the normal way in seems to be fumbling around losing money for a couple of years until it clicks.

AI is super good at compiling information and helping you make decisions, and from the outside that's most of what trading looks like. So I figured why not hook up an API and build myself a harness to learn inside of. That sounded like a way more exciting way to learn than reading about it, and if it actually works then hey, maybe I make some money out of it too.

Before I built anything I got Claude to go dig up what the research actually says. It came back grim, and it also killed the idea I walked in with, which was basically that an AI could tell me where things were heading. Turns out the papers that say it can are short backtests on a handful of tech stocks the model had already read the news about, and when people redo those properly across a couple decades the edge just disappears.

So tape doesn't predict anything. It reads rules I wrote down in a markdown file, applies them to today, tells me which rule it used, and proposes a trade with a stop and a size already attached to it. I take it or I pass on it. Everything goes into a journal including the passes, and every night the whole thing gets scored against what actually happened. The limits on how much I'm allowed to risk live in the Go code and not in the prompt, because a model can talk itself out of a prompt. Alpaca hands you a hundred grand of paper money, which tells me nothing about how I'd behave with an account I could really afford, so the ledger starts at five thousand and the broker's number gets ignored too.

It stays on paper money until it clears a bar I set before I started. And honestly if it never clears that bar I don't really care. I'm doing this without any expectation that it goes anywhere. I could lose constantly and I'd still count it as a success, because at least then I'd know. That's most of why I finally started.

The other one is Daily Games. I'm really inspired by what Capcom did with the RE Engine, and the only game I play every day is the NYT games, so it lands somewhere between those two.

The thought I kept coming back to is that the engine is the most important part for an agent to interact with. If the engine is airtight enough, and it gives good reinforcement about whether you're on the right track, then an agent can move on new ideas fast and what comes out the other side is already polished. Basically one shotted.

So the engine owns everything generic and a game is just a small folder that plugs into it. A game can't touch the date, or localStorage, or Math.random, or fetch, or any of it. The engine hands it a seed and a date and that's everything it knows about the outside world. Which sounds strict but it's the whole trick, because once the amount a new game is allowed to get wrong is that small, you can describe the entire job in a paragraph.

The other half is the check at the end. It can't just be me clicking around to see if it looks right. Every game has to get through a suite that plays it headless with the real engine underneath, wins, then restarts to make sure a refresh brings your finished board back, checks the puzzle-isn't-up-yet screen, and throws a pile of random moves at it to see if anything falls over. The failure messages are written for whoever broke them, which at this point is usually not a person. An agent that writes something subtly wrong doesn't hand me back a game that looks fine and breaks in 3 weeks. It hands me back a red test that says which rule it broke.

It's worked once so far, which is genuinely all I can claim. I gave a fresh session four sentences describing a game and pointed it at the repo, and it came back with the whole thing. The rules, the screen, the little bit of art for the home page, the tests. All green. I sat down and played it and it was a real game. I've since pulled that one out and the one actually shipping is called Lowball, but a lot of how the engine is built is because of what I watched during that run.

The point of all of it is to get the polish out of the way and get out of the AI's way, so my time goes into the ideas and the upkeep instead of into fighting with UI.

Both of these are basically the culmination of everything I've picked up about AI coding, which is mostly from using it every day since November for my job.

The big one is do not skimp on the planning. At all. Give it a real vision, hand typed, in your own words. Give it acceptance criteria specific enough that done isn't a matter of opinion, because if it's a matter of opinion the model will have one.

But the thing that's actually changed how I work is that I stopped writing the rules myself. On most of these projects I don't know the architecture well enough to write them, I'm starting from scratch on something I've never built before. What I do have is a really good vision for what I want. So I write that part, and then I get Claude to write its own CLAUDE.md off of it, and that file is what holds everything in check for the rest of the project. It's been working super well.

Here's the whole thing it wrote for Daily Games:

```md title="daily-games/CLAUDE.md"
# Daily Games

A shared engine for 5-minute daily games (NYT Games model). The engine owns everything generic;
each game is one folder under `games/` implementing the `GameModule` contract; daily content is
static per-date JSON produced by offline pipelines. The success bar for this repo: an agent team
can one-shot a complete new game from a one-paragraph spec.

## Commands

- `pnpm ladder` — format check + typecheck + all tests + build. Must pass before any work is
  called done.
- `pnpm format` / `pnpm typecheck` / `pnpm test` / `pnpm build` — the ladder's individual rungs.
- `pnpm dev` — run the shell at http://localhost:5173 (or the next free port — read the output).
- `pnpm new-game <slug>` — scaffold a game: typed stubs, failing conformance test, registry entry.
- `pnpm content:build` — validate `games/*/content/staging/*.json` against each game's schema and
  publish to `app/public/puzzles/<id>/<date>.json`, mirroring `content/assets/` into the same
  folder. Dates past tomorrow are held back, as are assets whose filename opens with such a date
  (`--all` publishes everything for local preview); `staging/` is the source of truth, not
  `public/`.

## Layout

- `packages/engine` — the platform: daily clock/puzzle numbers, seeded RNG, versioned storage,
  action-log persistence + replay, streaks/stats, share lines, content loading, `useDailyGame`.
- `packages/kit` — design tokens (`tokens.css`) and the component/motion kit games build screens from.
- `packages/conformance` — `describeGameConformance(module, fixtures)`: the parametrized suite
  every game must pass.
- `games/<slug>` — one vertical slice per game: manifest, zod content schema, pure reducer,
  Screen built from kit parts, probe, tests, `content/staging/*.json`.
- `app` — the shell: home, routing, results, settings. Registry in `app/src/registry.ts`.
- `tools` — scaffolder and content pipeline. Plain tsx scripts.

## Hard rules

- Games NEVER touch localStorage, dates, `Math.random`, `fetch`, or share APIs — that is engine
  territory. A game that needs something the contract lacks has found an engine gap: STOP and
  surface it; fix the engine, never hack the game.
- Reducers are pure and deterministic. The engine persists the action log and rebuilds state by
  replay; hidden randomness or clock reads break restore.
- The contract lives in `packages/engine/src/types.ts`. Changing it mid-flight breaks parallel
  work: STOP and surface before editing.
- No new dependencies without approval. Stack: TypeScript strict, React, Tailwind v4, motion
  (import from `"motion/react"`), zod, vitest, wouter.
- TypeScript strict; no `any`, no `@ts-ignore`. One sanctioned exception: `AnyGameModule` in the
  contract erases game type parameters for the registry. Files stay under 300 lines.
- Never commit; Matthew reviews diffs and asks for commits himself.

## Building a game

Read `games/CLAUDE.md` and copy the patterns of the golden game(s) already in `games/` — they are
the reference implementation of every convention. Scaffold with `pnpm new-game <slug>`, then make
the failing conformance test pass, then build the Screen, then run `pnpm ladder`.
```

I didn't come up with any of that. I told it what the site was and what I wanted building a game to feel like, and it worked backwards into the rules that would make that true. The only line in there that's mine is the one about never committing. Everything else is the model working out what it shouldn't be trusted with, then writing it down so the next session is held to it.

Same deal with the planning documents. Tape's design doc is mostly Claude working through the research and then writing rules off of what it found, and my favourite line in the whole thing is one it wrote for itself:

> If a prompt contains the words "you may override", it is wrong.

Management matters way more than it used to. I've got a Fable agent supervising Opus subagents working in parallel and validating what they hand back. But it only works because there's something real for the validating to happen against. That's the same idea again. The tests aren't there to make the numbers look good, they're there so somebody who wasn't watching can still tell the difference between working and looking like it works.

And taste matters more than ever. You need a strong grasp on your influences or you've got nothing to steer with.

The one thing none of this covers is feel. AI sucks at feel, and feel is the most important part of any good software, especially anything with a frontend. So everything gets tested by hand. No suite I write is going to tell me whether the reveal in Lowball is satisfying. Your guess gets crossed out, the real price rolls up on a tag, the gap meter drops, the points count up into your total. That's the whole game right there, and whether it works comes down to timing and weight. Get it wrong and there's no impact to any of it, stuff just happens on the screen and you don't feel anything. The only way I've found to answer that is to sit there and play it 50 times until it either feels right or it doesn't.

Both of these are going open source and neither one is close to done. I'll report back once they actually land.
