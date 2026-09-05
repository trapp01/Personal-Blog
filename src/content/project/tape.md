---
title: Tape
description: A trading copilot for the terminal that journals every decision and grades itself.
status: building
repo: https://github.com/trapp01/Tape
stack: ["Go", "SQLite", "Alpaca"]
publishDate: "2026-08-30"
draft: false
---

A trading copilot that lives in the terminal. It reads the market in the morning, proposes trades you either confirm or veto, journals every decision including the ones you turned down, and grades itself later against what actually happened.

I wanted to find out whether I could trade, and I wanted the answer to be a number instead of a feeling. I went in thinking trading was an information problem, which is the kind of problem an AI looks good at, so the plan was to hook up an API and build myself a harness to learn inside of. It's an experiment and it's still running.

Before anything was built I had Claude go read the research, and it came back grim: every trade on the Taiwan Stock Exchange over 14 years, 19,646 new Brazilian futures traders followed session by session, under 1% predictably profitable. It also killed my premise. The papers that say a model can call where things are heading are short backtests on a handful of tech stocks it had already read the news about, and the edge disappears when someone redoes them properly across a couple of decades. So tape doesn't predict anything. It applies rules I wrote down, says which rule it applied, and gets scored on the result.

What's mine: the goal, the playbook, the ledger that starts at $5,000 because Alpaca's $100,000 of paper money says nothing about how I'd behave with an account I could actually fund, and the gate. It stays paper money until a bar I wrote down in advance opens, 3 months minimum and positive expectancy after costs. If that gate never opens, that's a result too.

Everything else is Claude's, the same split as [Getting Out of the AI's Way](/posts/getting-out-of-the-ais-way/). It wrote the design doc off the research and then the rules off the design doc, and it made the engineering calls: the journal as the source of truth with the model as a graded component inside it, every fill re-priced through a cost model before it lands, risk limits in Go rather than prompt text so a refusal names the rule and quotes the numbers, the replay conventions, and the statistics behind the gate. I review every diff. The README explains each of those decisions in Claude's reasoning, not mine.

Phases 0 through 3 are built: the config, the Alpaca paper adapter, the SQLite journal, the cost model, the model layer, manual orders end to end, the morning briefing, the co-pilot slate you take or pass, the nightly scoring and replay, the stats with the gate, and a weekly retro that proposes playbook edits. 886 tests, none of which touch the network.

What isn't done is the part that isn't code. It has never been run against a real Alpaca account, a real calendar or a real model. Next is 3 months of real mornings on paper, not more features.

There's no live broker code path in the repo at all, `tape mode live` is refused, and no flag or config value gets around that.
