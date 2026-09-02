// Henter alle feeds i kilder.json, filtrerer, og skriver data/artikler.json.
// Koeres af GitHub Actions - ikke i browseren. Derfor ingen CORS og ingen
// rate limit fra tredjepart: vi henter direkte fra medierne.
//
// Arkivet vokser: nye artikler laegges til, gamle bliver liggende indtil
// MAKS_DAGE er passeret. Koer lokalt med:  node scripts/hent.mjs

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";

const MAKS_DAGE = 180;
const MAKS_ANTAL = 3000;
const UD = "data/artikler.json";

const cfg = JSON.parse(readFileSync("kilder.json", "utf8"));

function afkod(s) {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]*>/g, "")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n))
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function felt(blok, navne) {
  for (const n of navne) {
    const m = blok.match(new RegExp(`<${n}[^>]*>([\\s\\S]*?)</${n}>`, "i"));
    if (m && afkod(m[1])) return afkod(m[1]);
    const l = blok.match(new RegExp(`<${n}[^>]*href="([^"]+)"`, "i"));
    if (l) return l[1];
  }
  return "";
}

function parse(xml) {
  const blokke = xml.match(/<(item|entry)[\s>][\s\S]*?<\/\1>/gi) || [];
  return blokke.map((b) => ({
    titel: felt(b, ["title"]),
    resume: felt(b, ["description", "summary", "content:encoded"]).slice(0, 200),
    url: felt(b, ["link", "guid"]),
    dato: felt(b, ["pubDate", "published", "updated", "dc:date"]),
  })).filter((a) => a.titel && a.url);
}

function rammer(tekst, cfg) {
  const t = tekst.toLowerCase();
  // Start-ord: matcher fra ordets begyndelse, saa sammensatte ord som
  // "skolereform" og "boernefamilier" ogsaa taeller med.
  const start = (cfg.noegleord_start || []).some((o) =>
    new RegExp(`(^|[^a-zæøå])${o.toLowerCase()}`, "i").test(t));
  if (start) return true;
  // Helord: skal staa alene, saa "faedre" ikke rammer "forfaedre"
  // og "elev" ikke rammer "relevant".
  return (cfg.noegleord_helord || []).some((o) =>
    new RegExp(`(^|[^a-zæøå])${o.toLowerCase()}([^a-zæøå]|$)`, "i").test(t));
}

const nu = Date.now();
const fundet = [];

for (const feed of cfg.feeds) {
  try {
    const r = await fetch(feed.url, {
      headers: { "User-Agent": "Familieindekset/1.0 (+https://github.com/MortenGordon/familieindekset)" },
      signal: AbortSignal.timeout(20000),
    });
    if (!r.ok) { console.warn(`! ${feed.kilde}: HTTP ${r.status}`); continue; }
    const poster = parse(await r.text());
    let n = 0;
    for (const p of poster) {
      const d = new Date(p.dato);
      const tekst = p.titel + " " + p.resume;
      if (feed.filtrer && !rammer(tekst, cfg)) continue;
      fundet.push({
        titel: p.titel,
        resume: p.resume,
        url: p.url,
        kilde: feed.kilde,
        kategori: feed.kategori,
        dato: isNaN(d) ? new Date().toISOString() : d.toISOString(),
      });
      n++;
    }
    console.log(`${feed.kilde}: ${poster.length} hentet, ${n} beholdt`);
  } catch (e) {
    console.warn(`! ${feed.kilde}: ${e.message}`);
  }
}

let arkiv = [];
if (existsSync(UD)) {
  try { arkiv = JSON.parse(readFileSync(UD, "utf8")).artikler || []; } catch {}
}

const setet = new Map();
for (const a of [...arkiv, ...fundet]) setet.set(a.url, a);

const alle = [...setet.values()]
  .filter((a) => nu - new Date(a.dato).getTime() < MAKS_DAGE * 864e5)
  .sort((a, b) => new Date(b.dato) - new Date(a.dato))
  .slice(0, MAKS_ANTAL);

mkdirSync("data", { recursive: true });
writeFileSync(UD, JSON.stringify({ opdateret: new Date().toISOString(), artikler: alle }, null, 1));
console.log(`I alt ${alle.length} artikler (${alle.length - arkiv.length} nye)`);
