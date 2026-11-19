import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";

const html = readFileSync("index.html", "utf8");
const css = readFileSync("css/styles.css", "utf8");
const js = readFileSync("js/site.js", "utf8");

test("all local images, script, stylesheet and favicon files exist", () => {
  const refs = [...html.matchAll(/\b(?:src|href)="\.\/([^"#?]+)"/g)].map(match => match[1]);
  assert.ok(refs.length >= 10, "Expected original project imagery");
  for (const asset of refs) assert.ok(existsSync(asset), "Missing asset " + asset);
  assert.ok([...html.matchAll(/<img\b[^>]*src="([^"]+)"/g)].length >= 8);
});

test("all navigation anchors point to valid, uniquely identified sections", () => {
  const found = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  const ids = new Set(found);
  assert.equal(ids.size, found.length, "IDs must be unique");
  for (const [, id] of html.matchAll(/\bhref="#([^"]+)"/g))
    assert.ok(ids.has(id), "Broken anchor #" + id);
});

test("six original portfolio concepts have functional filters and details", () => {
  const cards = [...html.matchAll(/class="project-card[^"]*" data-category="([^"]+)"/g)];
  assert.equal(cards.length, 6);
  const ids = [...html.matchAll(/data-project="([^"]+)"/g)].map(match => match[1]);
  assert.deepEqual(ids.sort(), ["banking", "cashless", "courses", "illustration", "meditation", "taxi"].sort());
  assert.deepEqual([...new Set(cards.map(match => match[1]))].sort(), ["app", "creative", "web"].sort());
  for (const filter of ["all", "app", "creative", "web"])
    assert.ok(html.includes('data-filter="' + filter + '"'));
  for (const id of ids) assert.ok(js.includes(id + ": {"), "No details for " + id);
  assert.match(js, /projectDialog\.showModal\(\)/);
});

test("project brief builder prepares a local copy/download without false sending claims", () => {
  assert.match(html, /id="brief-form"/);
  for (const field of ["name", "email", "service", "message"])
    assert.ok(html.includes('name="' + field + '"'));
  assert.match(html, /nothing is submitted automatically/i);
  assert.match(js, /preventDefault\(\)/);
  assert.match(js, /new Blob\(/);
  assert.match(js, /navigator\.clipboard/);
  assert.doesNotMatch(js, /\bfetch\s*\(|XMLHttpRequest|navigator\.sendBeacon/);
  assert.match(js, /briefDialog\.showModal\(\)/);
});

test("responsive, keyboard and reduced-motion design are included", () => {
  for (const width of ["1000px", "760px", "490px"])
    assert.ok(css.includes("max-width:" + width));
  assert.match(css, /prefers-reduced-motion/);
  assert.match(html, /class="skip-link"/);
  assert.match(html, /aria-expanded="false"/);
  assert.match(js, /event\.key === "Escape"/);
  assert.match(css, /:focus-visible/);
  assert.ok(!html.includes('href=""'));
});
