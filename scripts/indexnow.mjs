import { readFile } from "node:fs/promises";

// This key proves control of public URLs. It is deliberately served by the site;
// it is not an account credential or an authenticated application endpoint.
const { keyFile } = JSON.parse(await readFile(new URL("./indexnow.json", import.meta.url), "utf8"));
const origin = "https://atd.lt";
if (!/^[a-f0-9]{32}\.txt$/.test(keyFile)) throw new Error("Invalid IndexNow key file configuration");
const key = (await readFile(new URL(`../public/${keyFile}`, import.meta.url), "utf8")).trim();
if (`${key}.txt` !== keyFile) throw new Error("IndexNow key file does not match its name");

async function get(path) {
  const response = await fetch(origin + path, { redirect: "error", signal: AbortSignal.timeout(30000) });
  if (response.status !== 200) throw new Error(`${path}: HTTP ${response.status}`);
  if (/noindex/i.test(response.headers.get("x-robots-tag") || "")) throw new Error(`${path}: noindex header`);
  return response.text();
}

const home = await get("/");
if (!/<meta\s+name="robots"\s+content="index,\s*follow"\s*\/?\s*>/i.test(home)) {
  throw new Error("Production homepage must explicitly allow indexing");
}
if (!home.includes('rel="canonical" href="https://atd.lt/"')) throw new Error("Unexpected production canonical");
if ((await get(`/${keyFile}`)).trim() !== key) throw new Error("Live IndexNow key has not been deployed");
const xml = await get("/sitemap.xml");
if (!xml.includes("<urlset")) throw new Error("Expected a URL sitemap");
const urls = [...new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1].replaceAll("&amp;", "&")))];
if (!urls.length || urls.length > 10000) throw new Error("Unexpected sitemap URL count");
for (const value of urls) {
  const url = new URL(value);
  if (url.origin !== origin || url.search || url.hash || url.username || url.password || url.pathname.startsWith("/api/") || url.pathname.endsWith("/patvirtinti")) {
    throw new Error("Sitemap contains a URL that must not be submitted");
  }
}

if (process.argv.includes("--dry-run")) {
  console.log(`IndexNow preflight passed: ${urls.length} public production URLs. Nothing submitted.`);
} else {
  const response = await fetch("https://www.bing.com/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: "atd.lt", key, keyLocation: `${origin}/${keyFile}`, urlList: urls }),
    signal: AbortSignal.timeout(30000),
  });
  if (![200, 202].includes(response.status)) throw new Error(`IndexNow submission failed: HTTP ${response.status}`);
  console.log(`IndexNow received ${urls.length} URLs: HTTP ${response.status}${response.status === 202 ? " (key validation pending)" : ""}. Receipt does not mean indexing.`);
}
