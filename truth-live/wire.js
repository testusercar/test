/**
 * Pure helpers for the Truth Live wire.
 *
 * Kept free of React so the feed rules — burst clustering, repost dedupe,
 * link handling — can be unit-tested without a DOM. See wire.test.mjs.
 */

export const POLL_MS      = 30_000;   // matches the existing route's refresh cadence
export const BURST_MIN    = 5;        // dispatches needed before a run is called a burst
export const BURST_GAP_MS = 15 * 60_000;
export const CLAMP_CHARS  = 420;      // body length that earns a "read full dispatch"
export const DUP_MIN_LEN  = 40;       // a shorter original is too weak to match a repost against

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

export const pad2 = (n) => String(n).padStart(2, '0');

export const clock = (ts) => {
  const d = new Date(ts);
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
};

export const dayKey = (ts) => {
  const d = new Date(ts);
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
};

export function dayLabel(ts, now = Date.now()) {
  const d = new Date(ts);
  if (dayKey(ts) === dayKey(now)) return 'Today';
  if (dayKey(ts) === dayKey(now - 86_400_000)) return 'Yesterday';
  return `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

export function relative(ts, now = Date.now()) {
  const secs = Math.abs(Math.round((now - ts) / 1000));
  if (secs < 60)      return 'just now';
  if (secs < 3600)    return `${Math.round(secs / 60)}m ago`;
  if (secs < 172_800) return `${Math.round(secs / 3600)}h ago`;
  return `${Math.round(secs / 86_400)}d ago`;
}

/** The feed sometimes carries bare hostnames rather than absolute URLs. */
export function absoluteUrl(raw) {
  const t = (raw || '').trim();
  if (!t) return '';
  if (/^https?:\/\//i.test(t)) return t;
  if (/^\/\//.test(t)) return `https:${t}`;
  if (/^[A-Za-z0-9.-]+\.[A-Za-z]{2,}/.test(t)) return `https://${t}`;
  return '';
}

export function hostOf(url) {
  try { return new URL(url).host.replace(/^www\./, ''); } catch { return url; }
}

export const fileName = (url) => (url || '').split('/').pop() || 'file';
export const fileExt  = (name) => ((name || '').split('.').pop() || 'img').slice(0, 4);

export const isRepost  = (p) => /^RT\b|^RT:/.test((p.content || '').trim());
export const hasMedia  = (p) => Array.isArray(p.media) && p.media.length > 0;
export const hasLink   = (p) => /https?:\/\//i.test(p.content || '');

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
export function computeDupes(posts) {
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
export function clusterBursts(list, isNew = () => false) {
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
export function burstDensity(items, buckets = 16) {
  const t0 = items[items.length - 1].ts;
  const span = Math.max(1, items[0].ts - t0);
  const counts = new Array(buckets).fill(0);
  for (const p of items) counts[Math.min(buckets - 1, Math.floor(((p.ts - t0) / span) * buckets))]++;
  return counts;
}

/** Hourly counts per day, newest day first, on one shared scale. */
export function volumeByHour(posts, days = 3) {
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
export function normalizePost(raw) {
  return {
    id: String(raw.id),
    ts: Date.parse(raw.created_at) || raw.created_ms || 0,
    content: raw.content || '',
    url: absoluteUrl(raw.url),
    media: (Array.isArray(raw.media) ? raw.media : []).map(absoluteUrl).filter(Boolean),
  };
}
