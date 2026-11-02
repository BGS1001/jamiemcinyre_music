// Site checks: accessibility, layout, tour-date logic, structured data, file links.
// Run with `npm test` (first: `npm install && npx playwright install chromium`).
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createServer } from 'node:http';
import path from 'node:path';
import { createRequire } from 'node:module';
import { chromium } from 'playwright';

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.xml': 'application/xml', '.txt': 'text/plain' };
let base;
const axeSource = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const VIEWPORTS = [[1280, 800], [390, 844]];

// Serve the site over HTTP, like GitHub Pages (file:// blocks some browser features).
const server = createServer((req, res) => {
  const rel = decodeURIComponent(new URL(req.url, 'http://x').pathname).replace(/^\/+/, '') || 'index.html';
  const file = path.join(root, rel);
  if (!file.startsWith(root) || !existsSync(file)) { res.writeHead(404); return res.end('not found'); }
  res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream' });
  res.end(readFileSync(file));
});

let browser;
before(async () => {
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  base = `http://127.0.0.1:${server.address().port}/`;
  browser = await chromium.launch();
});
after(async () => { await browser?.close(); server.close(); });
const url = (f) => base + f;

async function open(file, { width = 1280, height = 800, now, js = true } = {}) {
  const ctx = await browser.newContext({ viewport: { width, height }, javaScriptEnabled: js });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  if (now) await page.clock.setFixedTime(new Date(now));
  await page.goto(url(file));
  return { page, ctx, errors };
}

// Show list as authored in index.html (the single source of tour dates).
const html = readFileSync(path.join(root, 'index.html'), 'utf8');
const showDates = [...html.matchAll(/<li class="show[^"]*" data-date="([\d-]+)"/g)].map((m) => m[1]);
const lastShow = showDates.at(-1);
const dayAfter = (d) => { const x = new Date(d + 'T12:00:00'); x.setDate(x.getDate() + 1); return x; };

for (const file of ['index.html', '404.html']) {
  for (const [width, height] of VIEWPORTS) {
    test(`${file} @${width}px: no accessibility violations, errors or overflow`, async () => {
      // Pin the clock before the first show so the full list is rendered.
      const { page, ctx, errors } = await open(file, { width, height, now: showDates[0] + 'T09:00:00' });
      await page.evaluate(() => document.querySelectorAll('.reveal').forEach((e) => e.classList.add('is-in')));
      await page.waitForTimeout(900); // let fade-ins finish so contrast is measured on the final state
      await page.addScriptTag({ content: axeSource });
      const res = await page.evaluate(() => axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'] }));
      const summary = res.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`);
      assert.deepEqual(summary, [], 'axe violations');
      assert.deepEqual(errors, [], 'console/page errors');
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      assert.ok(overflow <= 0, `horizontal overflow of ${overflow}px`);
      await ctx.close();
    });
  }
}

test('static JSON-LD parses', () => {
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  assert.ok(blocks.length >= 1);
  for (const [, json] of blocks) JSON.parse(json);
});

test('tour: before the tour every show is listed with a calendar link and event data', async () => {
  const { page, ctx } = await open('index.html', { now: showDates[0] + 'T09:00:00' });
  assert.equal(await page.locator('#shows .show').count(), showDates.length);
  assert.equal(await page.locator('.show__cal').count(), showDates.length);
  const events = await page.evaluate(() => JSON.parse([...document.querySelectorAll('script[type="application/ld+json"]')].at(-1).textContent));
  assert.deepEqual(events.map((e) => e.startDate.slice(0, 10)), showDates);
  for (const e of events) {
    assert.equal(e['@type'], 'MusicEvent');
    assert.ok(e.location.name && e.location.address && e.offers.url, `incomplete event ${e.name}`);
  }
  await ctx.close();
});

test('tour: a show stays listed through its own day', async () => {
  const { page, ctx } = await open('index.html', { now: lastShow + 'T22:30:00' });
  assert.equal(await page.locator('#shows .show').count(), 1);
  await ctx.close();
});

test('tour: once every date has passed the fallback message shows', async () => {
  const { page, ctx } = await open('index.html', { now: dayAfter(lastShow) });
  assert.equal(await page.locator('#shows .show').count(), 0);
  assert.ok(await page.locator('#shows-empty').isVisible());
  await ctx.close();
});

test('tour: calendar files are valid iCalendar with CRLF line endings', async () => {
  const { page, ctx } = await open('index.html', { now: showDates[0] + 'T09:00:00' });
  const files = await page.$$eval('.show__cal', (as) => as.map((a) => decodeURIComponent(a.href.slice(a.href.indexOf(',') + 1))));
  for (const ics of files) {
    assert.match(ics, /^BEGIN:VCALENDAR\r\n/);
    assert.match(ics, /\r\nBEGIN:VEVENT\r\n[\s\S]*\r\nDTSTART[;:][\s\S]*\r\nEND:VEVENT\r\nEND:VCALENDAR$/);
    assert.ok(!/[^\r]\n/.test(ics), 'bare LF in ICS');
  }
  await ctx.close();
});

test('works without JavaScript: every show visible, nothing hidden by fade-ins', async () => {
  const { page, ctx } = await open('index.html', { js: false });
  assert.equal(await page.locator('#shows .show:visible').count(), showDates.length);
  assert.equal(await page.locator('.reveal').count(), 0);
  await ctx.close();
});

test('every local file referenced by the pages exists', () => {
  for (const file of ['index.html', '404.html']) {
    const src = readFileSync(path.join(root, file), 'utf8');
    const refs = [...src.matchAll(/(?:href|src)="([^"#:]+?)"/g)].map((m) => m[1]).filter((r) => r && r !== './');
    for (const ref of refs) assert.ok(existsSync(path.join(root, ref)), `${file} → missing ${ref}`);
  }
});
