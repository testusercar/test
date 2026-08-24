/**
 * The DJT Wire — the /truth-live route.
 *
 * GENERATED FILE. Built from TruthLive.jsx + wire.js + styles.js by
 * truth-live/build-single.mjs. Edit those, not this.
 *
 * Self-contained: React is the only import. Polls /api/truth-posts-live
 * every 30s. See truth-live/README.md for what it does and why.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/* ------------------------------------------------------------------ styles */
const CSS = `
.tl-root{
  --tl-ground:#EEF1F5; --tl-panel:#FFFFFF; --tl-panel2:#E4E9F0; --tl-sunk:#DCE2EA;
  --tl-line:#CCD5E0; --tl-line-soft:#DFE5EC;
  --tl-ink:#121821; --tl-ink2:#3A4553; --tl-muted:#5D6878;
  --tl-accent:#9A5A00; --tl-accent-ink:#FFFFFF; --tl-glow:rgba(154,90,0,.16);
  --tl-hot:#B33C26; --tl-hot-soft:rgba(179,60,38,.10);
  --tl-cool:#25627F;
  --tl-shadow:0 1px 2px rgba(18,24,33,.07), 0 8px 24px -12px rgba(18,24,33,.22);
  color-scheme:light;
}
@media (prefers-color-scheme:dark){
  .tl-root:not([data-tl-theme="light"]){
    --tl-ground:#0D1117; --tl-panel:#151B24; --tl-panel2:#1A222C; --tl-sunk:#0A0E13;
    --tl-line:#28323F; --tl-line-soft:#1F2732;
    --tl-ink:#E7EBF1; --tl-ink2:#C2CAD6; --tl-muted:#8A94A4;
    --tl-accent:#FFB020; --tl-accent-ink:#1A1206; --tl-glow:rgba(255,176,32,.15);
    --tl-hot:#E4644A; --tl-hot-soft:rgba(228,100,74,.13);
    --tl-cool:#79ADCB;
    --tl-shadow:0 1px 2px rgba(0,0,0,.4), 0 10px 30px -14px rgba(0,0,0,.7);
    color-scheme:dark;
  }
}
.tl-root[data-tl-theme="dark"]{
  --tl-ground:#0D1117; --tl-panel:#151B24; --tl-panel2:#1A222C; --tl-sunk:#0A0E13;
  --tl-line:#28323F; --tl-line-soft:#1F2732;
  --tl-ink:#E7EBF1; --tl-ink2:#C2CAD6; --tl-muted:#8A94A4;
  --tl-accent:#FFB020; --tl-accent-ink:#1A1206; --tl-glow:rgba(255,176,32,.15);
  --tl-hot:#E4644A; --tl-hot-soft:rgba(228,100,74,.13);
  --tl-cool:#79ADCB;
  --tl-shadow:0 1px 2px rgba(0,0,0,.4), 0 10px 30px -14px rgba(0,0,0,.7);
  color-scheme:dark;
}

.tl-root, .tl-root *{box-sizing:border-box}
.tl-root{
  min-height:100vh; background:var(--tl-ground); color:var(--tl-ink);
  font-family:"IBM Plex Sans Condensed","Helvetica Neue",Arial,sans-serif;
  -webkit-font-smoothing:antialiased;
}
.tl-root button{font:inherit;color:inherit;background:none;border:none;padding:0;margin:0;cursor:pointer;-webkit-appearance:none;appearance:none}
.tl-root :focus-visible{outline:2px solid var(--tl-accent); outline-offset:2px; border-radius:3px}
.tl-mono{font-family:"IBM Plex Mono",ui-monospace,SFMono-Regular,Menlo,monospace}
.tl-tnum{font-variant-numeric:tabular-nums}
.tl-only-mobile{display:none}

/* ---- status bar ---- */
.tl-bar{
  position:sticky; top:0; z-index:50;
  background:color-mix(in srgb, var(--tl-panel) 92%, transparent);
  backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px);
  border-bottom:1px solid var(--tl-line);
  display:flex; align-items:center; gap:18px; padding:0 18px; height:56px;
}
.tl-brand{display:flex; align-items:baseline; gap:9px; flex-shrink:0}
.tl-lamp{width:9px;height:9px;border-radius:50%;background:var(--tl-accent);align-self:center;animation:tl-pulse 2.6s ease-out infinite}
.tl-lamp[data-state="error"]{background:var(--tl-hot); animation:none}
.tl-lamp[data-state="loading"]{opacity:.5}
@keyframes tl-pulse{0%{box-shadow:0 0 0 0 var(--tl-glow)}70%{box-shadow:0 0 0 9px transparent}100%{box-shadow:0 0 0 0 transparent}}
.tl-brand h1{margin:0; font-size:16px; font-weight:700; letter-spacing:.16em; text-transform:uppercase}
.tl-src{font-size:10.5px; letter-spacing:.13em; text-transform:uppercase; color:var(--tl-muted); border-left:1px solid var(--tl-line); padding-left:9px}
.tl-readouts{display:flex; align-items:center; margin-left:auto; flex-shrink:0}
.tl-readout{display:flex; flex-direction:column; gap:1px; padding:0 14px; border-left:1px solid var(--tl-line-soft)}
.tl-readout .k{font-size:9px; letter-spacing:.14em; text-transform:uppercase; color:var(--tl-muted)}
.tl-readout .v{font-size:13px; font-weight:500; line-height:1.15}
.tl-readout .v.hot{color:var(--tl-hot)}
.tl-poll{display:flex; align-items:center; gap:8px; padding-left:14px; border-left:1px solid var(--tl-line-soft)}
.tl-poll svg{display:block; transform:rotate(-90deg)}
.tl-ring-bg{stroke:var(--tl-line); fill:none; stroke-width:2.5}
.tl-ring-fg{stroke:var(--tl-accent); fill:none; stroke-width:2.5; stroke-linecap:round; transition:stroke-dashoffset .95s linear}
.tl-poll .lbl{font-size:9px; letter-spacing:.14em; text-transform:uppercase; color:var(--tl-muted)}
.tl-poll .num{font-size:13px; font-weight:500}
.tl-iconbtn{width:32px;height:32px;border-radius:6px;border:1px solid var(--tl-line);display:grid;place-items:center;color:var(--tl-muted);margin-left:12px;flex-shrink:0}
.tl-iconbtn:hover{color:var(--tl-ink); border-color:var(--tl-muted); background:var(--tl-panel2)}
.tl-iconbtn.sm{width:30px;height:30px;margin-left:0}

/* ---- shell ---- */
.tl-shell{display:grid; grid-template-columns:236px minmax(0,1fr); max-width:1240px; margin:0 auto; align-items:start}
.tl-rail{
  position:sticky; top:56px; padding:22px 20px 40px; border-right:1px solid var(--tl-line-soft);
  max-height:calc(100vh - 56px); overflow-y:auto; display:flex; flex-direction:column; gap:26px;
}
.tl-feedcol{min-width:0; padding:22px 26px 120px}
.tl-railhead{font-size:9.5px; letter-spacing:.16em; text-transform:uppercase; color:var(--tl-muted); margin:0 0 11px}

/* ---- volume ---- */
.tl-volday{margin-bottom:12px}
.tl-volday .d{font-size:10px; letter-spacing:.1em; text-transform:uppercase; color:var(--tl-muted); display:flex; justify-content:space-between; margin-bottom:5px}
.tl-volday .d b{color:var(--tl-ink2); font-weight:500}
.tl-bars{display:grid; grid-template-columns:repeat(24,1fr); gap:1px; align-items:end; height:38px}
.tl-bar{background:var(--tl-sunk); border-radius:1px; min-height:2px; min-width:0; transition:background .12s; cursor:pointer}
.tl-bar[data-n]:not([data-n="0"]){background:var(--tl-cool)}
.tl-bar[data-n].is-burst{background:var(--tl-hot)}
.tl-bar:hover{background:var(--tl-accent)}
.tl-bar[data-n="0"]{cursor:default}
.tl-bar[data-n="0"]:hover{background:var(--tl-sunk)}
.tl-volaxis{display:flex; justify-content:space-between; font-size:8.5px; color:var(--tl-muted); letter-spacing:.08em; margin-top:3px}

/* ---- controls ---- */
.tl-chips{display:flex; flex-wrap:wrap; gap:6px}
.tl-chip{
  font-size:10.5px; letter-spacing:.1em; text-transform:uppercase; font-weight:500;
  padding:5px 9px; border:1px solid var(--tl-line); border-radius:4px; color:var(--tl-muted);
  display:flex; align-items:center; gap:6px; transition:.12s;
}
.tl-chip:hover{color:var(--tl-ink); border-color:var(--tl-muted)}
.tl-chip:not(.tl-switch)[aria-pressed="true"]{background:var(--tl-accent); border-color:var(--tl-accent); color:var(--tl-accent-ink); font-weight:600}
.tl-chip .n{font-family:"IBM Plex Mono",monospace; font-size:9.5px; opacity:.72}
.tl-switch{gap:7px; border-style:dashed}
.tl-switch[aria-pressed="true"]{border-style:solid; border-color:var(--tl-accent); color:var(--tl-ink)}
.tl-switch .dot{width:22px;height:12px;border-radius:99px;background:var(--tl-line);position:relative;flex-shrink:0;transition:background .15s}
.tl-switch .dot::after{content:"";position:absolute;top:2px;left:2px;width:8px;height:8px;border-radius:50%;background:var(--tl-muted);transition:left .15s,background .15s}
.tl-switch[aria-pressed="true"] .dot{background:var(--tl-accent)}
.tl-switch[aria-pressed="true"] .dot::after{left:12px;background:var(--tl-accent-ink)}
.tl-search{position:relative}
.tl-search input{width:100%;background:var(--tl-sunk);border:1px solid var(--tl-line);border-radius:5px;padding:8px 10px 8px 28px;color:var(--tl-ink);font-size:12.5px;font-family:"IBM Plex Mono",monospace}
.tl-search input::placeholder{color:var(--tl-muted); letter-spacing:.06em}
.tl-search input:focus{outline:none;border-color:var(--tl-accent);background:var(--tl-panel)}
.tl-search svg{position:absolute;left:8px;top:50%;transform:translateY(-50%);color:var(--tl-muted)}

/* ---- feed ---- */
.tl-dayrule{display:flex; align-items:center; gap:12px; margin:26px 0 14px; position:sticky; top:56px; background:linear-gradient(var(--tl-ground) 82%, transparent); padding:10px 0 8px; z-index:20}
.tl-dayrule:first-child{margin-top:0}
.tl-dayrule .lbl{font-size:11px; font-weight:700; letter-spacing:.18em; text-transform:uppercase; color:var(--tl-ink2)}
.tl-dayrule .ct{font-size:10px; letter-spacing:.1em; color:var(--tl-muted)}
.tl-dayrule hr{flex:1; height:0; border:0; border-top:1px solid var(--tl-line); margin:0}

.tl-dispatch{background:var(--tl-panel); border:1px solid var(--tl-line-soft); border-radius:7px; padding:14px 16px 13px 15px; margin-bottom:8px; border-left:2px solid var(--tl-line); box-shadow:var(--tl-shadow)}
.tl-dispatch.is-new{border-left-color:var(--tl-accent); animation:tl-arrive .5s cubic-bezier(.2,.7,.3,1)}
@keyframes tl-arrive{from{opacity:0;transform:translateY(-7px)}to{opacity:1;transform:none}}
.tl-dispatch.has-media{border-left-color:var(--tl-cool)}
.tl-slug{display:flex; align-items:center; flex-wrap:wrap; margin-bottom:9px; font-family:"IBM Plex Mono",monospace; font-size:10.5px; color:var(--tl-muted)}
.tl-slug > *{padding-right:9px; margin-right:9px; border-right:1px solid var(--tl-line)}
.tl-slug > *:last-child{border-right:0; margin-right:0; padding-right:0}
.tl-slug .time{color:var(--tl-ink2); font-weight:500}
.tl-tag{letter-spacing:.1em; text-transform:uppercase; font-size:9.5px; font-weight:500}
.tl-tag.new{color:var(--tl-accent-ink); background:var(--tl-accent); padding:2px 6px; border-radius:3px; border-right:0}
.tl-tag.media{color:var(--tl-cool)}
.tl-id{opacity:.5; font-size:9.5px}
.tl-body{font-family:"Newsreader",Georgia,serif; font-size:16.5px; line-height:1.5; color:var(--tl-ink); margin:0; white-space:pre-wrap; overflow-wrap:anywhere; max-width:66ch}
.tl-body.clamped{display:-webkit-box; -webkit-line-clamp:6; -webkit-box-orient:vertical; overflow:hidden}
.tl-link{color:var(--tl-cool); text-decoration:none; border-bottom:1px solid color-mix(in srgb,var(--tl-cool) 40%, transparent)}
.tl-link:hover{border-bottom-color:currentColor}
.tl-expand{font-family:"IBM Plex Mono",monospace; font-size:10px; letter-spacing:.12em; text-transform:uppercase; color:var(--tl-accent); margin-top:7px; display:inline-block}
.tl-expand:hover{text-decoration:underline}
.tl-dfoot{margin-top:11px; display:flex; align-items:center; gap:14px; flex-wrap:wrap}
.tl-srclink{font-family:"IBM Plex Mono",monospace; font-size:10px; letter-spacing:.11em; text-transform:uppercase; color:var(--tl-muted); text-decoration:none}
.tl-srclink:hover{color:var(--tl-accent)}
.tl-echo{font-family:"IBM Plex Mono",monospace; font-size:10px; letter-spacing:.07em; color:var(--tl-muted); display:inline-flex; align-items:center; gap:5px}
.tl-echo b{font-weight:500; color:var(--tl-ink2)}

/* ---- media ---- */
.tl-assets{display:grid; gap:6px; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); margin-top:11px; max-width:560px}
.tl-shot{display:block; width:100%; border:1px solid var(--tl-line); border-radius:6px; overflow:hidden; background:var(--tl-panel2); max-height:420px; cursor:zoom-in; position:relative; min-height:90px}
.tl-shot img{display:block; width:100%; height:100%; object-fit:cover; object-position:top; opacity:0; transition:opacity .25s}
.tl-shot img.loaded{opacity:1}
.tl-shot:hover{border-color:var(--tl-cool)}
.tl-shot::after{content:"Expand"; position:absolute; right:7px; bottom:7px; font-family:"IBM Plex Mono",monospace; font-size:9px; letter-spacing:.12em; text-transform:uppercase; background:color-mix(in srgb,var(--tl-sunk) 82%,transparent); color:var(--tl-ink); padding:3px 7px; border-radius:3px; opacity:0; transition:opacity .15s}
.tl-shot:hover::after,.tl-shot:focus-visible::after{opacity:1}
.tl-mtile{
  display:flex; flex-direction:column; justify-content:space-between; gap:8px;
  border:1px solid var(--tl-line); border-radius:5px; padding:11px 12px; min-height:74px; text-decoration:none;
  background-color:var(--tl-panel2);
  background-image:repeating-linear-gradient(135deg,transparent 0 7px,color-mix(in srgb,var(--tl-line) 55%,transparent) 7px 8px);
}
.tl-mtile:hover{border-color:var(--tl-cool)}
.tl-mtile .ext{font-family:"IBM Plex Mono",monospace; font-size:9.5px; letter-spacing:.14em; text-transform:uppercase; color:var(--tl-cool); font-weight:600}
.tl-mtile .fn{font-family:"IBM Plex Mono",monospace; font-size:10px; color:var(--tl-muted); overflow:hidden; text-overflow:ellipsis; white-space:nowrap}

.tl-lightbox{position:fixed; inset:0; z-index:200; background:rgba(0,0,0,.86); display:flex; align-items:center; justify-content:center; padding:24px; -webkit-backdrop-filter:blur(4px); backdrop-filter:blur(4px)}
.tl-lightbox img{max-width:100%; max-height:100%; border-radius:6px; object-fit:contain}
.tl-lb-close{position:absolute; top:14px; right:16px; width:36px; height:36px; border-radius:50%; background:rgba(255,255,255,.12); color:#fff; font-size:15px; line-height:1}
.tl-lb-close:hover{background:rgba(255,255,255,.24)}

/* ---- burst ---- */
.tl-burst{border:1px solid var(--tl-line); border-left:2px solid var(--tl-hot); border-radius:7px; margin-bottom:8px; background:var(--tl-panel); overflow:hidden; box-shadow:var(--tl-shadow)}
.tl-bursthead{width:100%; display:flex; align-items:center; gap:12px; padding:13px 15px; text-align:left}
.tl-bursthead:hover{background:var(--tl-panel2)}
.tl-badge{font-family:"IBM Plex Mono",monospace; font-size:9.5px; letter-spacing:.14em; text-transform:uppercase; color:var(--tl-hot); border:1px solid var(--tl-hot); border-radius:3px; padding:3px 7px; font-weight:600; background:var(--tl-hot-soft); flex-shrink:0}
.tl-bursttxt{display:flex; flex-direction:column; gap:2px; min-width:0}
.tl-bursttxt .a{font-size:13.5px; font-weight:600}
.tl-bursttxt .b{font-family:"IBM Plex Mono",monospace; font-size:10.5px; color:var(--tl-muted)}
.tl-spark{display:flex; align-items:flex-end; gap:1.5px; height:22px; margin-left:auto; flex-shrink:0}
.tl-spark i{width:3px; background:var(--tl-hot); opacity:.55; border-radius:1px; display:block}
.tl-caret{color:var(--tl-muted); flex-shrink:0; transition:transform .18s}
.tl-burst[open] .tl-caret{transform:rotate(180deg)}
.tl-burstbody{padding:0 12px 12px; border-top:1px solid var(--tl-line-soft)}
.tl-burstbody .tl-dispatch{margin-top:8px; margin-bottom:0; box-shadow:none; background:var(--tl-panel2)}

/* ---- misc ---- */
.tl-newpill{position:fixed; left:50%; bottom:26px; transform:translateX(-50%) translateY(90px); background:var(--tl-accent); color:var(--tl-accent-ink); border-radius:999px; padding:9px 18px; font-size:11.5px; font-weight:600; letter-spacing:.12em; text-transform:uppercase; box-shadow:0 8px 26px -8px rgba(0,0,0,.5); z-index:60; transition:transform .28s cubic-bezier(.2,.8,.3,1); display:flex; align-items:center; gap:8px}
.tl-newpill.show{transform:translateX(-50%) translateY(0)}
.tl-empty{border:1px dashed var(--tl-line); border-radius:7px; padding:34px 20px; text-align:center; color:var(--tl-muted); font-size:13px}
.tl-empty b{display:block; color:var(--tl-ink2); font-size:14px; margin-bottom:5px; font-weight:600}
.tl-error{border:1px solid var(--tl-hot); background:var(--tl-hot-soft); color:var(--tl-ink); border-radius:7px; padding:12px 14px; margin-bottom:14px; font-size:13px; display:flex; gap:12px; align-items:center; justify-content:space-between; flex-wrap:wrap}
.tl-retry{font-family:"IBM Plex Mono",monospace; font-size:10px; letter-spacing:.12em; text-transform:uppercase; border:1px solid var(--tl-hot); color:var(--tl-hot); border-radius:4px; padding:5px 10px}
.tl-retry:hover{background:var(--tl-hot); color:var(--tl-panel)}
.tl-foot{margin-top:34px; padding-top:16px; border-top:1px solid var(--tl-line-soft); font-family:"IBM Plex Mono",monospace; font-size:10px; color:var(--tl-muted); line-height:1.7; letter-spacing:.04em}
.tl-skel{height:74px; border-radius:7px; background:linear-gradient(90deg,var(--tl-panel) 25%,var(--tl-panel2) 37%,var(--tl-panel) 63%); background-size:400% 100%; animation:tl-shimmer 1.4s ease-in-out infinite; margin-bottom:8px}
@keyframes tl-shimmer{0%{background-position:100% 0}100%{background-position:0 0}}

/* ---- responsive: collapse chrome so the first dispatch is on the opening screen ---- */
@media (max-width:900px){
  .tl-only-mobile{display:grid}
  .tl-shell{grid-template-columns:1fr}
  .tl-bar{height:auto; min-height:52px; flex-wrap:wrap; padding:8px 14px; gap:9px}
  .tl-brand{flex:1 1 auto; min-width:0; flex-wrap:wrap; row-gap:2px}
  .tl-brand h1{font-size:15px}
  .tl-src{display:none}
  .tl-root.stats-open .tl-src{display:block; flex-basis:100%; width:100%; border-left:0; padding-left:18px; font-size:10px; overflow-wrap:anywhere}
  .tl-poll{padding-left:0; border-left:0; margin-left:auto; flex-shrink:0}
  .tl-poll .lbl{display:none}
  .tl-iconbtn{margin-left:4px}
  .tl-readouts{display:none}
  .tl-root.stats-open .tl-readouts{display:flex; order:9; flex-basis:100%; width:100%; margin-left:0; overflow-x:auto; scrollbar-width:none; padding-top:7px; border-top:1px solid var(--tl-line-soft)}
  .tl-root.stats-open .tl-readouts::-webkit-scrollbar{display:none}
  .tl-readout{flex-shrink:0; white-space:nowrap}
  .tl-readout:first-child{padding-left:0; border-left:0}

  .tl-rail{
    position:sticky; top:var(--tl-barh,52px); z-index:40;
    display:flex; flex-direction:row; flex-wrap:wrap; align-items:center; gap:8px;
    /* grid items default to min-width:auto, which would let the chip row widen
       the page instead of scrolling inside itself */
    min-width:0; max-height:none; overflow:visible; border-right:0;
    border-bottom:1px solid var(--tl-line); background:var(--tl-panel); padding:7px 12px;
  }
  .tl-rail .tl-railhead{display:none}
  .tl-railtools{order:0; flex-shrink:0}
  .tl-sec-filter{order:1; flex:1 1 0; min-width:0}
  .tl-sec-filter .tl-chips{flex-wrap:nowrap; overflow-x:auto; scrollbar-width:none; -ms-overflow-style:none}
  .tl-sec-filter .tl-chips::-webkit-scrollbar{display:none}
  .tl-chip{flex-shrink:0}
  .tl-sec-search{order:2; flex-basis:100%; display:none}
  .tl-rail.q-open .tl-sec-search{display:block}
  .tl-sec-vol{order:3; flex-basis:100%; display:none}
  .tl-root.stats-open .tl-sec-vol{display:block}
  .tl-feedcol{padding:16px 16px 110px}
  .tl-dayrule{position:static; margin-top:20px}
}
@media (max-width:620px){
  .tl-sec-filter .tl-chips{-webkit-mask-image:linear-gradient(to right,#000 calc(100% - 24px),transparent); mask-image:linear-gradient(to right,#000 calc(100% - 24px),transparent)}
  .tl-body{font-size:16px}
  .tl-slug{font-size:10px}
  .tl-dispatch{padding:12px 13px 11px 12px}
  .tl-assets{max-width:none}
  .tl-lightbox{padding:12px}
  .tl-bar{padding:8px 12px}
}
@media (prefers-reduced-motion:reduce){
  .tl-root *,.tl-root *::before,.tl-root *::after{animation-duration:.001ms !important; animation-iteration-count:1 !important; transition-duration:.001ms !important}
}
`;


/* ------------------------------------------------------------- feed rules */

const POLL_MS      = 30_000;   // matches the existing route's refresh cadence
const BURST_MIN    = 5;        // dispatches needed before a run is called a burst
const BURST_GAP_MS = 15 * 60_000;
const CLAMP_CHARS  = 420;      // body length that earns a "read full dispatch"
const DUP_MIN_LEN  = 40;       // a shorter original is too weak to match a repost against

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

const pad2 = (n) => String(n).padStart(2, '0');

const clock = (ts) => {
  const d = new Date(ts);
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
};

const dayKey = (ts) => {
  const d = new Date(ts);
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
};

function dayLabel(ts, now = Date.now()) {
  const d = new Date(ts);
  if (dayKey(ts) === dayKey(now)) return 'Today';
  if (dayKey(ts) === dayKey(now - 86_400_000)) return 'Yesterday';
  return `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

function relative(ts, now = Date.now()) {
  const secs = Math.abs(Math.round((now - ts) / 1000));
  if (secs < 60)      return 'just now';
  if (secs < 3600)    return `${Math.round(secs / 60)}m ago`;
  if (secs < 172_800) return `${Math.round(secs / 3600)}h ago`;
  return `${Math.round(secs / 86_400)}d ago`;
}

/** The feed sometimes carries bare hostnames rather than absolute URLs. */
function absoluteUrl(raw) {
  const t = (raw || '').trim();
  if (!t) return '';
  if (/^https?:\/\//i.test(t)) return t;
  if (/^\/\//.test(t)) return `https:${t}`;
  if (/^[A-Za-z0-9.-]+\.[A-Za-z]{2,}/.test(t)) return `https://${t}`;
  return '';
}

function hostOf(url) {
  try { return new URL(url).host.replace(/^www\./, ''); } catch { return url; }
}

const fileName = (url) => (url || '').split('/').pop() || 'file';
const fileExt  = (name) => ((name || '').split('.').pop() || 'img').slice(0, 4);

const isRepost  = (p) => /^RT\b|^RT:/.test((p.content || '').trim());
const hasMedia  = (p) => Array.isArray(p.media) && p.media.length > 0;
const hasLink   = (p) => /https?:\/\//i.test(p.content || '');

const RT_AT  = /^RT\s*@\s*/i;
const RT_URL = /^RT[:\s]+\s*(https?:\/\/\S+)\s*$/i;
const tidy   = (t) => (t || '').replace(/\s+/g, ' ').trim().toLowerCase();

/**
 * Fold reposts that duplicate a dispatch already on the wire.
 *
 * Two shapes get folded:
 *   1. a bare "RT @handle" carrying no body at all;
 *   2. "RT @handle<body>" whose body is another dispatch in the window. The feed
 *      concatenates handle and body with no separator, so the original shows up
 *      as a SUFFIX of everything after "RT @" rather than an exact match.
 *
 * Never folded: reposts of other accounts (real content), and "RT: <url>"
 * pointing at a status outside the held window — those carry their own media.
 *
 * Returns { folded, echoes }. Folded posts are hidden, not discarded: the
 * dispatch each one duplicated reports when it was echoed.
 */
function computeDupes(posts) {
  const folded = new Map();   // duplicate id -> canonical id (null for a bare stub)
  const echoes = new Map();   // canonical id -> duplicate posts

  for (const p of posts) {
    const content = (p.content || '').trim();
    if (RT_URL.test(content)) continue;

    const m = RT_AT.exec(content);
    if (!m) continue;

    const rest = tidy(content.slice(m[0].length));
    if (!rest || /^[a-z0-9_]+$/.test(rest)) {   // handle only, no body
      folded.set(p.id, null);
      continue;
    }

    for (const q of posts) {
      if (q.id === p.id) continue;
      const body = tidy(q.content);
      if (body.length >= DUP_MIN_LEN && rest.endsWith(body)) {
        folded.set(p.id, q.id);
        if (!echoes.has(q.id)) echoes.set(q.id, []);
        echoes.get(q.id).push(p);
        break;
      }
    }
  }
  return { folded, echoes };
}

/**
 * Group runs of rapid-fire dispatches. Input must be newest-first.
 * A run of BURST_MIN or more, each within BURST_GAP_MS of the next, becomes one
 * collapsible node. Anything containing a just-arrived dispatch stays expanded
 * as individual items so new content is never hidden behind a fold.
 */
function clusterBursts(list, isNew = () => false) {
  const out = [];
  let i = 0;
  while (i < list.length) {
    let j = i;
    while (j + 1 < list.length && list[j].ts - list[j + 1].ts <= BURST_GAP_MS) j++;
    const run = list.slice(i, j + 1);
    if (run.length >= BURST_MIN && !run.some(isNew)) out.push({ burst: true, items: run });
    else run.forEach((item) => out.push({ burst: false, item }));
    i = j + 1;
  }
  return out;
}

/** Per-bucket density of a burst, for its sparkline. */
function burstDensity(items, buckets = 16) {
  const t0 = items[items.length - 1].ts;
  const span = Math.max(1, items[0].ts - t0);
  const counts = new Array(buckets).fill(0);
  for (const p of items) counts[Math.min(buckets - 1, Math.floor(((p.ts - t0) / span) * buckets))]++;
  return counts;
}

/** Hourly counts per day, newest day first, on one shared scale. */
function volumeByHour(posts, days = 3) {
  const keys = [...new Set(posts.map((p) => dayKey(p.ts)))].sort().reverse().slice(0, days);
  const rows = keys.map((key) => {
    const dayPosts = posts.filter((p) => dayKey(p.ts) === key);
    const counts = Array.from({ length: 24 }, (_, h) =>
      dayPosts.filter((p) => new Date(p.ts).getHours() === h).length);
    return { key, counts, total: dayPosts.length, ts: dayPosts[0].ts };
  });
  // One scale across every day, so a quiet day reads as quiet. sqrt keeps a
  // single post legible beside a 30-post hour without flattening the spike.
  const max = Math.max(1, ...rows.flatMap((r) => r.counts));
  for (const row of rows) {
    row.pct = row.counts.map((n) => (n ? Math.max(9, Math.round(Math.sqrt(n / max) * 100)) : 0));
  }
  return rows;
}

/** Normalise one API record into what the UI renders. */
function normalizePost(raw) {
  return {
    id: String(raw.id),
    ts: Date.parse(raw.created_at) || raw.created_ms || 0,
    content: raw.content || '',
    url: absoluteUrl(raw.url),
    media: (Array.isArray(raw.media) ? raw.media : []).map(absoluteUrl).filter(Boolean),
  };
}


/* ---------------------------------------------------------------- the route */

const ENDPOINT = '/api/truth-posts-live';
const FONTS = 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans+Condensed:wght@400;500;600;700&family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600&display=swap';
const NEW_FOR_MS = 90_000;   // how long a freshly polled dispatch keeps its marker

/** Render URLs inside a body as domain-labelled links. */
function linkify(text) {
  return text.split(/(https?:\/\/[^\s]+)/gi).map((part, i) =>
    /^https?:\/\//i.test(part)
      ? <a key={i} className="tl-link" href={part} target="_blank" rel="noreferrer" title={part}>{hostOf(part)}</a>
      : <span key={i}>{part}</span>,
  );
}

function Icon({ path, size = 15, width = 2 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth={width} strokeLinecap="round" aria-hidden="true">
      {path}
    </svg>
  );
}

/** One attached image. Falls back to a link tile if the CDN refuses the request. */
function Asset({ url, onOpen, label }) {
  const [state, setState] = useState('loading');   // loading | ok | failed
  const [ratio, setRatio] = useState(null);

  if (state === 'failed') {
    const name = fileName(url);
    return (
      <a className="tl-mtile" href={url} target="_blank" rel="noreferrer">
        <span className="ext">{fileExt(name)} · opens at source</span>
        <span className="fn">{name}</span>
      </a>
    );
  }
  return (
    <button className="tl-shot" style={ratio ? { aspectRatio: ratio } : undefined}
            onClick={() => onOpen(url)} aria-label="Expand attached image">
      <img src={url} alt={label} loading="lazy" decoding="async"
           className={state === 'ok' ? 'loaded' : ''}
           onLoad={(e) => {
             const { naturalWidth: w, naturalHeight: h } = e.currentTarget;
             if (w && h) setRatio(`${w} / ${h}`);
             setState('ok');
           }}
           onError={() => setState('failed')} />
    </button>
  );
}

function Dispatch({ post, compact, expanded, onToggle, echoes, onOpenImage, isNew }) {
  const long = post.content.length > CLAMP_CHARS;
  const open = expanded.has(post.id);
  const echoed = echoes.get(post.id);

  return (
    <article className={`tl-dispatch${isNew ? ' is-new' : ''}${hasMedia(post) ? ' has-media' : ''}`}
             id={`tl-d-${post.id}`}>
      <div className="tl-slug">
        {isNew && <span className="tl-tag new">New</span>}
        <span className="time tl-tnum">{clock(post.ts)}</span>
        <span>{relative(post.ts)}</span>
        {isRepost(post) && <span className="tl-tag">Repost</span>}
        {hasMedia(post) && <span className="tl-tag media">{post.media.length} media</span>}
        {!compact && <span className="tl-id">#{post.id.slice(-8)}</span>}
      </div>

      <p className={`tl-body${long && !open ? ' clamped' : ''}`}>{linkify(post.content)}</p>

      {long && (
        <button className="tl-expand" onClick={() => onToggle(post.id)}>
          {open ? '▲ Collapse' : `▼ Read full dispatch (${post.content.length} chars)`}
        </button>
      )}

      {hasMedia(post) && (
        <div className="tl-assets">
          {post.media.map((url) => (
            <Asset key={url} url={url} onOpen={onOpenImage}
                   label={`Image attached to the dispatch filed at ${clock(post.ts)}`} />
          ))}
        </div>
      )}

      <div className="tl-dfoot">
        {post.url && <a className="tl-srclink" href={post.url} target="_blank" rel="noreferrer">Source ↗</a>}
        {echoed && (
          <span className="tl-echo">↻ Reposted <b>{echoed.map((e) => clock(e.ts)).join(', ')}</b></span>
        )}
      </div>
    </article>
  );
}

function Burst({ node, ...rest }) {
  const { items } = node;
  const span = Math.max(1, Math.round((items[0].ts - items.at(-1).ts) / 60_000));
  const density = burstDensity(items);
  const peak = Math.max(...density, 1);

  return (
    <details className="tl-burst">
      <summary className="tl-bursthead">
        <span className="tl-badge">Burst</span>
        <span className="tl-bursttxt">
          <span className="a">{items.length} dispatches in {span} min</span>
          <span className="b tl-tnum">{clock(items.at(-1).ts)} → {clock(items[0].ts)}</span>
        </span>
        <span className="tl-spark">
          {density.map((n, i) => (
            <i key={i} style={{ height: n ? `${Math.max(3, Math.round((n / peak) * 22))}px` : '2px',
                                opacity: n ? undefined : 0.25 }} />
          ))}
        </span>
        <Icon path={<path d="M6 9l6 6 6-6" />} size={14} width={2.4} />
      </summary>
      <div className="tl-burstbody">
        {items.map((p) => <Dispatch key={p.id} post={p} compact {...rest} />)}
      </div>
    </details>
  );
}

export default function TruthLive() {
  const [posts, setPosts] = useState([]);
  const [status, setStatus] = useState('loading');    // loading | live | refreshing | error
  const [error, setError] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(POLL_MS / 1000);

  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [dedupe, setDedupe] = useState(true);
  const [expanded, setExpanded] = useState(() => new Set());
  const [newIds, setNewIds] = useState(() => new Set());
  const [unseen, setUnseen] = useState(0);

  const [theme, setTheme] = useState(null);           // null = follow the OS
  const [statsOpen, setStatsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [lightbox, setLightbox] = useState(null);

  const seenRef = useRef(null);                       // ids from the previous poll
  const barRef = useRef(null);
  const searchRef = useRef(null);

  /* ---------- polling ---------- */
  const load = useCallback(async (isRefresh) => {
    if (isRefresh) setStatus((s) => (s === 'error' ? s : 'refreshing'));
    try {
      const res = await fetch(ENDPOINT, { headers: { Accept: 'application/json' } });
      const body = await res.json();
      if (!res.ok || body.error) throw new Error(body.error || `Request failed (${res.status})`);

      const next = (Array.isArray(body.posts) ? body.posts : [])
        .map(normalizePost).filter((p) => p.ts).sort((a, b) => b.ts - a.ts);

      // Anything unseen since the last poll is new — but never on first paint.
      const ids = new Set(next.map((p) => p.id));
      if (seenRef.current) {
        const fresh = next.filter((p) => !seenRef.current.has(p.id)).map((p) => p.id);
        if (fresh.length) {
          setNewIds((prev) => new Set([...prev, ...fresh]));
          setUnseen((n) => n + fresh.length);
          fresh.forEach((id) => setTimeout(
            () => setNewIds((prev) => { const s = new Set(prev); s.delete(id); return s; }), NEW_FOR_MS));
        }
      }
      seenRef.current = ids;

      setPosts(next);
      setError(null);
      setStatus('live');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load the feed');
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    let alive = true;
    const tick = () => { if (alive) load(true); };
    load(false);
    const poll = setInterval(tick, POLL_MS);
    return () => { alive = false; clearInterval(poll); };
  }, [load]);

  // countdown to the next poll
  useEffect(() => {
    const t = setInterval(() => setSecondsLeft((s) => (s <= 1 ? POLL_MS / 1000 : s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  // relative timestamps drift; re-render once a minute
  const [, forceTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => forceTick((n) => n + 1), 60_000);
    return () => clearInterval(t);
  }, []);

  /* ---------- sticky offset for the collapsed mobile rail ---------- */
  useEffect(() => {
    const el = barRef.current;
    if (!el) return undefined;
    const measure = () => document.documentElement.style.setProperty('--tl-barh', `${el.offsetHeight}px`);
    measure();
    window.addEventListener('resize', measure);
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    ro?.observe(el);
    return () => { window.removeEventListener('resize', measure); ro?.disconnect(); };
  }, []);

  /* ---------- the new-dispatch pill only matters once scrolled away ---------- */
  useEffect(() => {
    const onScroll = () => { if (window.scrollY < 220) setUnseen(0); };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!lightbox) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setLightbox(null); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [lightbox]);

  /* ---------- derived ---------- */
  const { folded, echoes } = useMemo(() => computeDupes(posts), [posts]);
  const pool = useMemo(
    () => (dedupe ? posts.filter((p) => !folded.has(p.id)) : posts),
    [posts, dedupe, folded],
  );
  const counts = useMemo(() => ({
    all: pool.length,
    orig: pool.filter((p) => !isRepost(p)).length,
    media: pool.filter(hasMedia).length,
    links: pool.filter(hasLink).length,
  }), [pool]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return pool.filter((p) => {
      if (filter === 'orig' && isRepost(p)) return false;
      if (filter === 'media' && !hasMedia(p)) return false;
      if (filter === 'links' && !hasLink(p)) return false;
      if (q && !p.content.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [pool, filter, query]);

  const days = useMemo(() => {
    const map = new Map();
    for (const p of visible) {
      const k = dayKey(p.ts);
      if (!map.has(k)) map.set(k, []);
      map.get(k).push(p);
    }
    return [...map.entries()].sort((a, b) => b[0].localeCompare(a[0]));
  }, [visible]);

  const volume = useMemo(() => (pool.length ? volumeByHour(pool) : []), [pool]);
  const peak = useMemo(() => {
    let best = null;
    for (const row of volume) {
      row.counts.forEach((n, h) => { if (!best || n > best.n) best = { n, h }; });
    }
    return best;
  }, [volume]);
  const last24 = useMemo(
    () => pool.filter((p) => Date.now() - p.ts < 86_400_000).length, [pool]);

  /* ---------- actions ---------- */
  const toggleExpanded = useCallback((id) => setExpanded((prev) => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  }), []);

  const jumpToHour = useCallback((key, hour) => {
    const hit = pool.find((p) => dayKey(p.ts) === key && new Date(p.ts).getHours() === hour);
    if (!hit) return;
    setFilter('all'); setQuery('');
    requestAnimationFrame(() => {
      const el = document.getElementById(`tl-d-${hit.id}`);
      if (!el) return;
      el.closest('details')?.setAttribute('open', '');
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }, [pool]);

  const nodes = useMemo(
    () => new Map(days.map(([k, items]) => [k, clusterBursts(items, (p) => newIds.has(p.id))])),
    [days, newIds],
  );

  const statusLabel = status === 'error' ? 'Feed error'
    : status === 'loading' ? 'Loading' : status === 'refreshing' ? 'Refreshing' : 'Live';

  const shared = {
    expanded, onToggle: toggleExpanded, echoes: dedupe ? echoes : new Map(),
    onOpenImage: setLightbox,
  };

  return (
    <div className={`tl-root${statsOpen ? ' stats-open' : ''}`} data-tl-theme={theme || undefined}>
      <link rel="stylesheet" href={FONTS} />
      <style>{CSS}</style>

      <header className="tl-bar" ref={barRef}>
        <div className="tl-brand">
          <span className="tl-lamp" data-state={status} title={statusLabel} />
          <h1>The DJT Wire</h1>
          <span className="tl-src tl-mono">truthsocial · @realDonaldTrump</span>
        </div>

        <div className="tl-readouts tl-mono tl-tnum">
          <div className="tl-readout">
            <span className="k">Last filed</span>
            <span className="v">{posts.length ? relative(posts[0].ts).replace(' ago', '') : '—'}</span>
          </div>
          <div className="tl-readout">
            <span className="k">24h volume</span>
            <span className="v">{last24} posts</span>
          </div>
          <div className="tl-readout">
            <span className="k">Peak hour</span>
            <span className="v hot">{peak && peak.n ? `${peak.n} @ ${pad2(peak.h)}:00` : '—'}</span>
          </div>
        </div>

        <div className="tl-poll tl-mono tl-tnum">
          <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
            <circle className="tl-ring-bg" cx="13" cy="13" r="10.5" />
            <circle className="tl-ring-fg" cx="13" cy="13" r="10.5"
                    strokeDasharray="65.97"
                    strokeDashoffset={65.97 * (1 - secondsLeft / (POLL_MS / 1000))} />
          </svg>
          <div>
            <div className="lbl">Next poll</div>
            <div className="num">{secondsLeft}s</div>
          </div>
        </div>

        <button className="tl-iconbtn tl-only-mobile" onClick={() => setStatsOpen((v) => !v)}
                aria-expanded={statsOpen} aria-label="Show volume and readouts">
          <Icon path={<path d="M4 20V10M10 20V4M16 20v-7M22 20v-3" />} />
        </button>
        <button className="tl-iconbtn"
                onClick={() => setTheme((t) => {
                  const dark = t ? t === 'dark'
                    : window.matchMedia('(prefers-color-scheme: dark)').matches;
                  return dark ? 'light' : 'dark';
                })}
                aria-label="Switch theme">
          <Icon path={<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />} />
        </button>
      </header>

      <div className="tl-shell">
        <aside className={`tl-rail${searchOpen ? ' q-open' : ''}`}>
          <div className="tl-railtools tl-only-mobile">
            <button className="tl-iconbtn sm" aria-expanded={searchOpen} aria-label="Search dispatches"
                    onClick={() => { setSearchOpen((v) => !v); requestAnimationFrame(() => searchRef.current?.focus()); }}>
              <Icon path={<><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></>} size={14} width={2.4} />
            </button>
          </div>

          <section className="tl-sec-vol">
            <h2 className="tl-railhead">Volume · by hour</h2>
            {volume.map((row) => (
              <div className="tl-volday" key={row.key}>
                <div className="d">
                  <span>{dayLabel(row.ts)}</span>
                  <b className="tl-mono tl-tnum">{row.total}</b>
                </div>
                <div className="tl-bars">
                  {row.counts.map((n, h) => (
                    <button key={h} className={`tl-bar${n >= 5 ? ' is-burst' : ''}`} data-n={n}
                            style={{ height: `${row.pct[h]}%` }}
                            onClick={() => n && jumpToHour(row.key, h)}
                            title={`${pad2(h)}:00 — ${n} dispatch${n === 1 ? '' : 'es'}`}
                            aria-label={`${pad2(h)}:00, ${n} dispatches`} />
                  ))}
                </div>
              </div>
            ))}
            <div className="tl-volaxis tl-mono">
              <span>00</span><span>06</span><span>12</span><span>18</span><span>23</span>
            </div>
          </section>

          <section className="tl-sec-search">
            <h2 className="tl-railhead">Search</h2>
            <div className="tl-search">
              <Icon path={<><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></>} size={13} width={2.4} />
              <input ref={searchRef} type="search" value={query} placeholder="filter text…"
                     autoComplete="off" aria-label="Filter dispatches by text"
                     onChange={(e) => setQuery(e.target.value)} />
            </div>
          </section>

          <section className="tl-sec-filter">
            <h2 className="tl-railhead">Filter</h2>
            <div className="tl-chips">
              {[['all', 'All'], ['orig', 'Originals'], ['media', 'Media'], ['links', 'Links']].map(([key, label]) => (
                <button key={key} className="tl-chip" aria-pressed={filter === key}
                        onClick={() => setFilter(key)}>
                  {label} <span className="n">{counts[key]}</span>
                </button>
              ))}
              <button className="tl-chip tl-switch" aria-pressed={dedupe}
                      onClick={() => setDedupe((v) => !v)}
                      title="Hide reposts that duplicate a dispatch already on the wire">
                <span className="dot" aria-hidden="true" />
                Fold reposts <span className="n">{folded.size}</span>
              </button>
            </div>
          </section>
        </aside>

        <main className="tl-feedcol">
          {error && (
            <div className="tl-error" role="alert">
              <span>{error}{posts.length ? ' — showing the last dispatches that came through.' : '.'}</span>
              <button className="tl-retry" onClick={() => load(true)}>Retry now</button>
            </div>
          )}

          {status === 'loading' && !posts.length && (
            <div aria-busy="true" aria-label="Loading dispatches">
              {Array.from({ length: 6 }, (_, i) => <div className="tl-skel" key={i} />)}
            </div>
          )}

          {!!posts.length && !visible.length && (
            <div className="tl-empty">
              <b>No dispatches match</b>
              Clear the filter or search for different text.
            </div>
          )}

          {status === 'error' && !posts.length && (
            <div className="tl-empty">
              <b>Nothing on the wire yet</b>
              The feed could not be reached. The next poll runs automatically in {secondsLeft}s.
            </div>
          )}

          {days.map(([key, items]) => (
            <div key={key}>
              <div className="tl-dayrule">
                <span className="lbl">{dayLabel(items[0].ts)}</span>
                <span className="ct tl-mono tl-tnum">{items.length}</span>
                <hr />
              </div>
              {nodes.get(key).map((node, i) => node.burst
                ? <Burst key={`b-${node.items[0].id}`} node={node} isNew={false} {...shared} />
                : <Dispatch key={node.item.id} post={node.item} isNew={newIds.has(node.item.id)} {...shared} />)}
            </div>
          ))}

          {!!posts.length && (
            <p className="tl-foot">
              Wire polls <span style={{ color: 'var(--tl-ink2)' }}>{ENDPOINT}</span> every{' '}
              {POLL_MS / 1000}s · {posts.length} dispatches held · reposts that duplicate a dispatch
              already on the wire are folded into it — toggle “Fold reposts” to see the raw feed ·
              all text, images and links come from the source, which is linked on every item.
            </p>
          )}
        </main>
      </div>

      {unseen > 0 && (
        <button className="tl-newpill show"
                onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setUnseen(0); }}>
          {unseen} new dispatch{unseen === 1 ? '' : 'es'}
          <Icon path={<path d="M12 19V5M5 12l7-7 7 7" />} size={12} width={3} />
        </button>
      )}

      {lightbox && (
        <div className="tl-lightbox" onClick={(e) => { if (e.target === e.currentTarget) setLightbox(null); }}>
          <button className="tl-lb-close" onClick={() => setLightbox(null)} aria-label="Close image">✕</button>
          <img src={lightbox} alt="Attached media, full size" />
        </div>
      )}
    </div>
  );
}

