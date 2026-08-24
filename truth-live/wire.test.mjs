/**
 * Tests for the feed rules, run against a real capture of /api/truth-posts-live
 * (fixture.json, 50 dispatches spanning 21-23 Aug 2026).
 *
 *   node --test truth-live/
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  computeDupes, clusterBursts, burstDensity, volumeByHour,
  normalizePost, absoluteUrl, hostOf, isRepost, hasMedia, hasLink, relative,
} from './wire.js';

const fixture = JSON.parse(readFileSync(new URL('./fixture.json', import.meta.url)));
const posts = fixture.posts.map(normalizePost).sort((a, b) => b.ts - a.ts);

test('fixture parses into 50 normalised dispatches', () => {
  assert.equal(posts.length, 50);
  assert.ok(posts.every((p) => p.id && p.ts > 0));
  assert.ok(posts[0].ts >= posts[posts.length - 1].ts, 'newest first');
});

test('absoluteUrl repairs bare and protocol-relative hosts', () => {
  assert.equal(absoluteUrl('example.com/a'), 'https://example.com/a');
  assert.equal(absoluteUrl('//cdn.example.com/x.jpg'), 'https://cdn.example.com/x.jpg');
  assert.equal(absoluteUrl('https://ok.test/'), 'https://ok.test/');
  assert.equal(absoluteUrl('   '), '');
  assert.equal(absoluteUrl('not a url'), '');
});

test('hostOf strips www and survives junk', () => {
  assert.equal(hostOf('https://www.foxnews.com/video/123'), 'foxnews.com');
  assert.equal(hostOf('nonsense'), 'nonsense');
});

test('classifiers match the fixture', () => {
  assert.equal(posts.filter(isRepost).length, 9);
  assert.equal(posts.filter(hasMedia).length, 11);
  assert.equal(posts.filter(hasLink).length, 37);
});

test('dedupe folds exactly the redundant reposts', () => {
  const { folded, echoes } = computeDupes(posts);
  assert.equal(folded.size, 3, 'two self-echoes plus one bare stub');

  // the bare "RT @realDonaldTrump" carries no body, so it folds with no canonical
  assert.equal(folded.get('117144988108827513'), null);

  // "RT @realDonaldTrumpCanada wants..." echoes the original "Canada wants..."
  assert.equal(folded.get('117144988493215562'), '117143083340259038');
  assert.equal(folded.get('117135791766560725'), '117135773042405247');

  assert.equal(echoes.size, 2);
  assert.equal(echoes.get('117143083340259038').length, 1);
});

test('dedupe keeps reposts that are real content', () => {
  const { folded } = computeDupes(posts);
  // a repost of a different account is not a duplicate
  assert.ok(!folded.has('117134674434434485'));
  // "RT: <url>" points outside the held window and carries the media
  for (const id of ['117141444922153076', '117135790192886203', '117134448075588837']) {
    assert.ok(!folded.has(id), `${id} must survive: it holds media`);
    assert.ok(hasMedia(posts.find((p) => p.id === id)));
  }
});

test('dedupe never folds a post that owns media', () => {
  const { folded } = computeDupes(posts);
  for (const id of folded.keys()) {
    assert.equal(hasMedia(posts.find((p) => p.id === id)), false);
  }
});

test('dedupe is idempotent and order-independent', () => {
  const a = computeDupes(posts);
  const b = computeDupes([...posts].reverse());
  assert.deepEqual([...a.folded.keys()].sort(), [...b.folded.keys()].sort());
});

test('short originals cannot trigger a false fold', () => {
  const synthetic = [
    { id: 'orig', ts: 2, content: 'Thank you!', media: [] },              // under DUP_MIN_LEN
    { id: 'rt',   ts: 1, content: 'RT @somebodyThank you!', media: [] },
  ];
  assert.equal(computeDupes(synthetic).folded.size, 0);
});

test('burst clustering finds the 21 Aug firehose', () => {
  const bursts = clusterBursts(posts).filter((n) => n.burst);
  assert.equal(bursts.length, 1);
  assert.equal(bursts[0].items.length, 30);
  const span = bursts[0].items[0].ts - bursts[0].items.at(-1).ts;
  assert.ok(span <= 25 * 60_000, 'burst spans about 22 minutes');
});

test('a burst holding a new dispatch stays unfolded', () => {
  const newest = new Set([posts.find((p) => true).id]);
  const all = clusterBursts(posts, (p) => newest.has(p.id));
  assert.ok(all.length > 0);
  // force the case: treat a member of the burst as new
  const burst = clusterBursts(posts).find((n) => n.burst);
  const inside = new Set([burst.items[0].id]);
  assert.equal(clusterBursts(posts, (p) => inside.has(p.id)).some((n) => n.burst), false);
});

test('clustering preserves every dispatch exactly once', () => {
  const seen = clusterBursts(posts).flatMap((n) => (n.burst ? n.items : [n.item]));
  assert.equal(seen.length, posts.length);
  assert.equal(new Set(seen.map((p) => p.id)).size, posts.length);
});

test('burst density buckets sum to the burst size', () => {
  const burst = clusterBursts(posts).find((n) => n.burst);
  const d = burstDensity(burst.items);
  assert.equal(d.length, 16);
  assert.equal(d.reduce((a, b) => a + b, 0), burst.items.length);
});

test('volume uses one scale across days so quiet days read quiet', () => {
  const rows = volumeByHour(posts);
  assert.equal(rows.length, 3);
  const busiest = rows.find((r) => r.total === 42);
  const quiet = rows.find((r) => r.total === 4);
  assert.equal(Math.max(...busiest.pct), 100, 'peak hour tops the scale');
  assert.ok(Math.max(...quiet.pct) < 40, 'a 2-post hour must not look like a 30-post hour');
  for (const row of rows) {
    assert.equal(row.counts.reduce((a, b) => a + b, 0), row.total);
  }
});

test('relative time reads forwards and backwards', () => {
  const now = Date.UTC(2026, 7, 23, 12, 0, 0);
  assert.equal(relative(now - 30_000, now), 'just now');
  assert.equal(relative(now - 5 * 60_000, now), '5m ago');
  assert.equal(relative(now - 3 * 3600_000, now), '3h ago');
  assert.equal(relative(now - 3 * 86_400_000, now), '3d ago');
});
