# The DJT Wire — `/truth-live`

A rebuild of the `/truth-live` route: a newswire-style live monitor for the
Truth Social feed, replacing the flat reverse-chronological card list.

```
TruthLive.jsx    the route component (default export, drop-in)
wire.js          pure feed rules — clustering, dedupe, volume, formatting
styles.js        the stylesheet, injected by the component
wire.test.mjs    tests for wire.js, run against a real API capture
fixture.json     50 real dispatches from /api/truth-posts-live (21–23 Aug 2026)
```

## Installing

Drop the four source files into the Space app beside the other route components
and point `/truth-live` at `TruthLive.jsx`. It keeps the same contract as the
route it replaces — a default-exported React component, hooks only, no
dependencies beyond React, polling `/api/truth-posts-live` every 30s.

Styles are injected from a `<style>` tag inside the component, matching the
existing route's pattern, so there is no build config to change. Every class is
`tl-` prefixed and every custom property is scoped to `.tl-root` rather than
`:root`, so nothing leaks into the rest of the Space.

Type comes from Google Fonts (IBM Plex Sans Condensed, IBM Plex Mono,
Newsreader) via a `<link>` in the component. Each family has a real fallback
stack, so a blocked font host degrades rather than breaks.

## Why it looks like this

Profiling the live feed turned up four things the old flat list handled badly:

- **It is extremely bursty.** 30 of 50 dispatches landed inside one hour, while
  other hours held one or none. A flat list turns that into a scroll wall with
  no signal that a firehose event happened.
- **Length varies ~80×** — 19 to 1,607 characters.
- **74% carry links**, rendered as raw URLs eating whole lines.
- **Reposts repeat content**, including a bare `RT @realDonaldTrump` with no body.

So: a **status strip** (last filed, 24h volume, peak hour, a ring counting down
to the next poll), a **volume rail** showing hour-by-hour density with burst
hours in red and click-to-jump, **burst clustering** that folds a rapid-fire run
into one expandable row with a real density sparkline, **clamping** on long
bodies, **domain-labelled links**, and **repost folding**.

## Feed rules

**Burst clustering** — a run of 5+ dispatches, each within 15 minutes of the
next, collapses into one row. A run containing a just-arrived dispatch stays
expanded, so new content is never hidden behind a fold.

**Repost dedupe** (on by default, toggleable) folds two shapes:

1. a bare `RT @handle` carrying no body;
2. `RT @handle<body>` whose body is a dispatch already in the window.

The feed concatenates handle and body with no separator — `RT @realDonaldTrump`
+ `Canada wants…` arrives as `RT @realDonaldTrumpCanada wants…` — so the
original is matched as a **suffix** of everything after `RT @`, not by equality.
Originals shorter than 40 characters are never matched against, so a short post
cannot be swallowed by a longer repost that happens to end the same way.

Never folded: reposts of *other* accounts, and `RT: <url>` pointing at a status
outside the held window — on the live feed those carry the media attachments.

Nothing is discarded. A folded repost leaves an `↻ Reposted 13:11` marker on the
dispatch it duplicated, and the switch restores the raw feed.

**Volume** is normalised on one scale across all days, not per day — per-day
normalisation made a 2-post hour look identical to a 30-post hour. A square-root
scale keeps a single post legible beside a 30-post spike without flattening it.

## Media

Images load straight from the CDN at their natural aspect ratio, computed from
`naturalWidth`/`naturalHeight` on load so there is no layout shift, capped at
420px tall, lazy-loaded, and click-to-expand into a lightbox (Escape or
backdrop to close).

If an image fails — the CDN sits behind a bot challenge that can return 403 —
that tile degrades to a labelled link to the source rather than a broken image.

## Mobile

The rail collapses into a single sticky control strip: filter chips in a
horizontal scroller plus a search toggle. Readouts, the volume histogram and the
source line move into a drawer behind the stats button. This puts the first
dispatch ~165px down the page instead of ~695px, so content is on the opening
screen. Day rules stop being sticky below 900px, since the status bar and
control strip are already pinned.

## Tests

```
npm test          # node --test truth-live/*.test.mjs
```

15 tests covering the feed rules against `fixture.json`, a real capture of the
endpoint. They assert the exact dedupe outcome (3 folded: 2 self-echoes and 1
bare stub), that no post owning media is ever folded, that dedupe is
order-independent, that clustering preserves every dispatch exactly once, and
that the volume scale keeps quiet days quiet.

`wire.js` is deliberately free of React so these run without a DOM.

## Verified

Built with Vite and driven in Chromium against a mock endpoint: renders at
390/768/1280 with zero horizontal overflow and no console errors; dedupe toggles
47↔50; the media filter, search, burst expansion and lightbox all work; and a
live poll adding two dispatches marks exactly those two as new and raises the
"2 new dispatches" pill. Nothing is marked new on first paint.
