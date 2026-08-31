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

::github{repo="trapp01/Tape"}

The whole thing is built on the premise that retail day traders lose. The population studies are blunt about it, every trade on the Taiwan Stock Exchange over 14 years and 19,646 new Brazilian futures traders followed session by session. Under 1% were predictably profitable. Nobody has shown that pointing an LLM at the problem changes that number. So tape doesn't predict anything. It applies rules I wrote down, says which rule it applied, and gets scored on the result.

I went in thinking trading was an information problem, which is the kind of problem an AI looks good at. That falls apart on the first real question. If it says buy NVDA and NVDA goes up, was it right, or was the whole market up that day? When a trade loses, was it the thesis, the entry, the size, or the fill? On a small account, how much of the move does a $1.00 minimum commission eat before I see any P&L at all? None of those get answered by a better model. All of them get answered by a record, as long as the record includes the trades you didn't take and prices the ones you did the way a broker actually would. So the journal is the product, and the model is a component inside it that gets graded like everything else.

The risk limits live in Go, not in prompt text. It refuses a buy the ledger can't pay for and a sell bigger than the ledger holds, and when it refuses it names the rule and quotes the numbers. The cost it quotes is the modelled cost, so slippage and commission are already in there and the check runs against what the fill would really do to the balance, not what the quote makes it look like.

Phase 0 is in: the config, the Alpaca paper adapter, the SQLite journal, the cost model, the model layer, and manual orders end to end, behind 135 tests that never touch the network. There's no morning briefing yet, which is sort of the main feature, so there's a way to go.

It's paper money and it stays paper money. There's no live broker code path in the repo at all, `tape mode live` is refused, and no flag or config value gets around that. It only moves to real money if a gate I wrote down in advance opens, 3 months minimum and positive expectancy after costs. If that gate never opens, that's a result too.
