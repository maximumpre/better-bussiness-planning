#!/usr/bin/env node
/**
 * Mandatory keyword-preservation check (Step 5 Absolute Keyword Preservation Rule).
 *
 * Enforces: every entry of `LEGACY_SITE_KEYWORDS` (the frozen baseline in
 * `lib/seo-keywords.ts`) must survive verbatim — same string, same order, same casing —
 * as the leading entries of the final `SITE_KEYWORDS` list. New research may only be appended.
 *
 * Also guards the content surfaces every keyword must reach:
 *   - layout `<meta name="keywords">` (app/layout.tsx `keywords: SITE_KEYWORDS`) — the FULL list
 *   - the visible `Related searches:` block on components/CrawlerSeoPage.tsx — the body-safe
 *     `SITE_VISIBLE_KEYWORDS` subset (host tokens filtered out, never display:none / sr-only)
 *
 * The keyword module is evaluated (TypeScript transpile + a shim for `@/lib/site-url`), so the
 * check judges the real runtime list rather than a regex approximation of it.
 *
 * Usage: node scripts/verify-keyword-preservation.mjs
 * Exit 1 if any baseline keyword was lost, reordered, or re-cased, or a surface is missing.
 */

import fs from "node:fs"
import path from "node:path"
import { createRequire } from "node:module"

const ROOT = path.resolve(process.argv[2] ?? process.cwd())
const require = createRequire(import.meta.url)
const failures = []

const read = (rel) => {
  const full = path.join(ROOT, rel)
  if (!fs.existsSync(full)) {
    console.error(`Keyword preservation check failed: missing ${rel}`)
    process.exit(1)
  }
  return fs.readFileSync(full, "utf8")
}

// ── 1. Evaluate lib/seo-keywords.ts (and its @/ imports) at runtime ──────────
let ts
try {
  ts = require(path.join(ROOT, "node_modules", "typescript"))
} catch {
  console.error("Keyword preservation check failed: typescript not installed (npm install)")
  process.exit(1)
}

const SITE_URL_SHIM = {
  // Mirrors lib/site-url.ts identity constants without importing the Next.js graph.
  CANONICAL_HOST: new URL(
    (/SITE_ORIGIN\s*=\s*"([^"]+)"/.exec(read("lib/site-url.ts")) ?? [])[1] ?? "https://localhost",
  ).hostname,
  SITE_DISPLAY_NAME: (/SITE_DISPLAY_NAME\s*=\s*"([^"]+)"/.exec(read("lib/site-url.ts")) ?? [])[1] ?? "",
}

const cache = new Map()
function loadModule(spec) {
  if (spec === "@/lib/site-url") return SITE_URL_SHIM
  const file = path.join(ROOT, `${spec.replace(/^@\//, "")}.ts`)
  if (cache.has(file)) return cache.get(file).exports
  const source = read(path.relative(ROOT, file))
  const out = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText
  const mod = { exports: {} }
  cache.set(file, mod)
  new Function("require", "module", "exports", out)(
    (s) => (s.startsWith("@/") ? loadModule(s) : require(s)),
    mod,
    mod.exports,
  )
  return mod.exports
}

let keywordsModule
try {
  keywordsModule = loadModule("@/lib/seo-keywords")
} catch (err) {
  console.error(`Keyword preservation check failed: cannot evaluate lib/seo-keywords.ts — ${err.message}`)
  process.exit(1)
}

const baseline = [...(keywordsModule.LEGACY_SITE_KEYWORDS ?? [])]
const finalList = [...(keywordsModule.SITE_KEYWORDS ?? [])]

if (baseline.length === 0) {
  console.error("Keyword preservation check failed: LEGACY_SITE_KEYWORDS is missing or empty")
  process.exit(1)
}
if (finalList.length === 0) {
  console.error("Keyword preservation check failed: SITE_KEYWORDS is empty")
  process.exit(1)
}

// ── 2. Verbatim, ordered, leading-head preservation ─────────────────────────
const finalSet = new Set(finalList)
const missing = baseline.filter((kw) => !finalSet.has(kw))
if (missing.length > 0) {
  failures.push(`baseline keywords dropped: ${missing.map((k) => `"${k}"`).join(", ")}`)
}
const head = finalList.slice(0, baseline.length)
if (head.join("\x00") !== baseline.join("\x00")) {
  failures.push("baseline keywords are not the leading entries of SITE_KEYWORDS (order or casing changed)")
}

// ── 3. Case-insensitive duplicates outside the baseline are a merge bug ─────
const baselineFolded = new Set(baseline.map((kw) => kw.toLowerCase()))
const counts = new Map()
for (const kw of finalList) counts.set(kw.toLowerCase(), (counts.get(kw.toLowerCase()) ?? 0) + 1)
const collapsed = [...counts.entries()].filter(([key, n]) => n > 1 && !baselineFolded.has(key))
if (collapsed.length > 0) {
  failures.push(`duplicate keywords outside the baseline: ${collapsed.map(([k]) => k).join(", ")}`)
}

// ── 4. Surfaces: meta carries the full list, body carries the visible subset ─
const metaSrc = read("lib/seo-metadata.ts")
if (!/SITE_KEYWORDS: string\[\]\s*=\s*buildSiteKeywords\(\)/.test(metaSrc)) {
  failures.push("lib/seo-metadata.ts: SITE_KEYWORDS must be buildSiteKeywords() (one shared list)")
}
if (!/export const SITE_VISIBLE_KEYWORDS\s*=/.test(metaSrc)) {
  failures.push("lib/seo-metadata.ts: missing SITE_VISIBLE_KEYWORDS (body-safe subset)")
}

const layoutSrc = read("app/layout.tsx")
if (!/keywords:\s*SITE_KEYWORDS/.test(layoutSrc)) {
  failures.push("app/layout.tsx: missing `keywords: SITE_KEYWORDS` in the metadata export")
}

// Prefer Astro twin after Hybrid conversion; fall back to React CrawlerSeoPage.
const crawlerRel = fs.existsSync(path.join(ROOT, "astro-src/pages/crawler-seo.astro"))
  ? "astro-src/pages/crawler-seo.astro"
  : "components/CrawlerSeoPage.tsx"
const crawlerSrc = read(crawlerRel)
const sectionStart = crawlerSrc.indexOf('aria-label="Related searches"')
const sectionEnd = crawlerSrc.indexOf("</section>", sectionStart)
const keywordBlock = sectionStart === -1 ? "" : crawlerSrc.slice(sectionStart, sectionEnd === -1 ? undefined : sectionEnd)
if (!keywordBlock) {
  failures.push(`${crawlerRel}: missing the \`aria-label="Related searches"\` section`)
} else {
  if (!/Related searches:/.test(keywordBlock)) failures.push(`${crawlerRel}: keyword block lacks \`Related searches:\``)
  if (/\bsr-only\b/.test(keywordBlock)) failures.push(`${crawlerRel}: keyword block must not use sr-only`)
  if (/display:\s*none/.test(keywordBlock)) failures.push(`${crawlerRel}: keyword block must not use display:none`)
  if (/opacity:\s*0\s*(;|\)|\}|\s|$)/m.test(keywordBlock)) failures.push(`${crawlerRel}: keyword block must not use zero opacity`)
  // Astro joins at frontmatter; React joins inline. Accept either.
  if (
    !/SITE_VISIBLE_KEYWORDS\.join\(/.test(crawlerSrc) &&
    !/visibleKeywords/.test(keywordBlock)
  ) {
    failures.push(`${crawlerRel}: keyword block must render SITE_VISIBLE_KEYWORDS`)
  }
}
const relatedIdx = crawlerSrc.indexOf("Related searches:")
const footerIdx = crawlerSrc.indexOf("<footer")
if (relatedIdx !== -1 && footerIdx !== -1 && relatedIdx > footerIdx) {
  failures.push(`${crawlerRel}: \`Related searches:\` must render BEFORE <footer>`)
}

// Body-safe subset (lib/seo-metadata.ts) must exist and contain no raw host or URL tokens.
let metaModule
try {
  metaModule = loadModule("@/lib/seo-metadata")
} catch (err) {
  console.error(`Keyword preservation check failed: cannot evaluate lib/seo-metadata.ts — ${err.message}`)
  process.exit(1)
}
const visibleSet = new Set(metaModule.SITE_VISIBLE_KEYWORDS ?? [])
if (visibleSet.size === 0) failures.push("SITE_VISIBLE_KEYWORDS is empty — crawler body has no related searches")
const hostLike = [...visibleSet].filter((k) => /https?:\/\/|\/|\b[a-z0-9-]+\.(com|net|org|io|co|app|dev)\b/i.test(k))
if (hostLike.length > 0) {
  failures.push(`SITE_VISIBLE_KEYWORDS contains host/URL tokens: ${hostLike.join(", ")}`)
}

if (failures.length) {
  console.error("FAIL keyword preservation")
  for (const f of failures) console.error(`  - ${f}`)
  process.exit(1)
}

console.log(
  `OK keyword preservation — ${baseline.length} baseline keywords intact (verbatim, in order), ` +
    `${finalList.length - baseline.length} research keywords appended, ${finalList.length} total, ` +
    `${visibleSet.size} body-visible.`,
)
