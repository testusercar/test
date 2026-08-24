/**
 * Styles for the Truth Live wire.
 *
 * Kept as a template string injected via a <style> tag inside the component —
 * the same pattern the current /truth-live route uses, so this drops in with no
 * build-config changes. Every class is `tl-` prefixed and every token is scoped
 * to `.tl-root` rather than `:root`, so nothing leaks into the host Space page.
 */
export const CSS = `
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
