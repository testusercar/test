import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CSS } from './styles.js';
import {
  POLL_MS, CLAMP_CHARS,
  clock, dayKey, dayLabel, relative, pad2,
  hostOf, fileName, fileExt,
  isRepost, hasMedia, hasLink,
  computeDupes, clusterBursts, burstDensity, volumeByHour, normalizePost,
} from './wire.js';

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
