---
name: write-post
description: Draft a post or note for this site from Matt's rough bullet points, in his voice. Use whenever he asks to write, draft, start, or help with a post, an entry, or a writeup, or hands over brainstorming notes about something he's building. Covers thesis extraction, the pre-write checkpoint, and his voice rules.
---

# Writing a post as Matt

Matt writes his own posts eventually, but he wants the first draft off his bullet points to land
close enough that it takes one round of edits, not ten. This file exists because the last post took
ten. Every rule here is a specific mistake that cost a round.

The failure mode is never "the writing is bad." It is "this is well-written and it isn't me." Polish
is not the goal. Sounding like a 25 year old developer thinking out loud is the goal.

## Step 0: read before writing anything

1. **His notes.** These are the spine of the post. Read them twice.
2. **Every project he points at.** README, CLAUDE.md, docs/, any planning file, `git log --oneline`.
   The good concrete details live here and they beat anything you'd invent.
3. **His voice, from this repo.** Read `src/content/post/getting-out-of-the-ais-way.md` end to end,
   then 3 or 4 reviews in `src/content/media/`. The reviews are the purest sample, unedited and
   recent. `src/content/media/movie/spider-man-brand-new-day.md` and
   `src/content/media/show/monster.md` are the longest ones.
4. If `~/Documents/Blog Posts/` exists, his older drafts are there. Optional, the repo samples are
   more current.

## Step 1: stop and get the framing approved

**Do not write prose yet.** Writing 2,000 words before agreeing on the thesis is what caused most
of the rework last time. Come back with only:

- **The thesis**, in one or two sentences.
- **2 or 3 title options**, with a clear recommendation.
- **The section order**, as a short bullet list.
- **Anything in his notes you're planning to drop**, and why.

How to find the thesis: look for the idea he repeats across separate bullets without flagging it as
the point. In the harness post he wrote "harness" in three unrelated bullets, and that was the post.
A good thesis connects at least two of his bullets, ideally all of them. If you can only make it
work by inventing a link he didn't draw, it isn't the thesis.

Then sanity check the framing's connotation before proposing it. "Harness" was mechanically correct
and sounded restrictive, when the actual claim was the opposite. If the obvious word sells the wrong
feeling, say so and offer the alternate.

Default to his bullets' own order for the sections. He wrote them in the order he thinks about them.

## Step 2: the attribution rule

This is the one that matters most. **Every claim in the post traces to one of three sources:**

1. Something he said in his notes (rephrasable, not extendable)
2. A file in a repo he pointed at
3. Something already published on this site

Anything else is invented and gets cut. When you present the draft, list what came from source 2
separately, so he can check you didn't overstate where a project actually is.

Specific things that got flagged last time, all of which read as normal writing and all of which
were wrong:

- **Knowledge he doesn't have.** He said "I know the studies where only 1% of people make money."
  The draft turned that into named authors, institutions and date ranges. He hadn't read them, the
  AI had. If research came from a tool, the post says so.
- **Backstory he never gave.** "I'd wanted to build this for a long time." He hadn't. He thought it
  would be a fun project. Assume the shallower motivation unless he stated otherwise.
- **Realization narratives.** "It took me a while to notice", "and then it hit me", "I didn't see
  the connection until later." He didn't describe any of that. State what's true, skip the arc.
- **Feelings he didn't report.** Doubt, excitement, frustration. He'll volunteer these; he does it
  often in his own writing. You don't get to add them.

When in doubt, write the shallower version. He'll add depth in his edit pass. He can't easily
un-invent something that reads plausibly.

## Step 3: voice

**Never use an em dash.** He does not use them, anywhere, in any sample. Commas and full stops.
The exception is text quoted verbatim from a file.

**No section headers.** His long posts run as continuous prose. Paragraph breaks do the work.

**Canadian spelling.** favourite, behaviour, colour, theatre.

**Numerals for small numbers.** "2 of my favourite movies", "the last 30 minutes", "3 weeks",
"50 times". Not "two" or "fifty".

Do:

- Short declarative sentences. Light on subordinate clauses.
- Open a section with a short verdict, then unpack it. "Electric from start to finish."
  "The world built here is great." "Basically one shotted."
- Trailing "too" at the end of sentences. He does this constantly and it's the single most
  recognisable tic. "The scope of the show is impressive too."
- "I love how...", "I feel like it's because...", "such a", "so much", "really", "super",
  "basically", "honestly", "genuinely", "hey", occasionally "gonna".
- Admit ignorance in the open. "From what I understand", "which is genuinely all I can claim",
  "I'm not walking in expecting anything", "I don't have the background to poke holes in that."
- Undercut his own confidence when he's about to sound sure of himself.
- Sentence fragments as landings at the end of a paragraph. "So there it sat." "That was about it."
- Talk about feel in physical terms: weight, impact, whether something connects, whether it feels
  real. This is how he writes about movies and it's how he writes about software.

Don't:

- Write aphorisms or zingers. Anything that sounds quotable was almost certainly invented by the
  model and he cuts every one. Killed last time: "a paragraph is a prompt", "gambling with extra
  steps", "just how I work on a Tuesday", "which was a fun read".
- Add jokes. His humour is dry and rare and comes from self-deprecation, not wordplay.
- Use one-word paragraphs for effect.
- Lean on "Here's the thing", "It's not X, it's Y", or rule-of-three lists. One "not X, it's Y" per
  post at most.
- Sound like a conference talk, a LinkedIn post, or a technical explainer. He's telling someone
  what he's been up to.

Length: **1,200 to 1,800 words.** Under that reads thin. Over 2,000 and he starts cutting. A real
artifact quoted in full (a config file, a design doc excerpt) doesn't count against the budget and
is usually worth more than describing it.

Ending: where things actually stand, honestly, including what isn't done. Not a call to action, not
a summary of what he just said.

## Step 4: audit before showing him

Read the draft back and check:

- [ ] Zero em dashes outside quoted files
- [ ] Every claim traces to his notes, a repo file, or the site
- [ ] No invented motivation, realization moment, or feeling
- [ ] Research is attributed to whoever actually did it
- [ ] Canadian spelling, numerals for small numbers
- [ ] At least one trailing "too"
- [ ] No headers, no one-word paragraphs, no invented aphorisms
- [ ] Word count in range
- [ ] Read it out loud. Any sentence he wouldn't say to a friend gets rewritten.

## Mechanics

Posts go in `src/content/post/<kebab-title>.md`. Notes, for short thoughts, go in
`src/content/note/`. Frontmatter for a post:

```yaml
---
title: Sentence Case, 60 characters max
description: One plain sentence. Shows on the index and in RSS.
publishDate: "YYYY-MM-DD"
tags: ["lowercase", "short"]
draft: false
---
```

The full schema is in `src/content.config.ts`. Run `npx astro build` before presenting; the content
schema is enforced at build time and a bad date or an over-length title fails the build.

**Present the full post text in chat, not just the file path.** He reads it in the conversation and
edits by quoting sentences back. Follow it with the assumptions list from Step 2.

Never commit or push unless he asks. He reads diffs first.
