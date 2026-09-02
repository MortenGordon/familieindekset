/* ---------------------------------------------
   Eksempeldata
   Vises indtil FEEDS i feeds.js er udfyldt med
   rigtige kilder. Erstattes automatisk derefter.
--------------------------------------------- */
const SAMPLE_ARTICLES = [
  {
    headline: "Sådan får du styr på ugens madpakker uden aftenpanik",
    dek: "Fem forældre deler deres faste system til at planlægge madpakker for en hel uge ad gangen.",
    kilde: "Eksempeldata",
    kategori: "hverdagslogistik",
    url: "#",
    dato: daysAgo(1),
  },
  {
    headline: "Ny SFO-reform: det betyder ændringerne for jeres hverdag",
    dek: "Overblik over, hvad de kommende regler for pasningstilbud kommer til at ændre for børnefamilier.",
    kilde: "Eksempeldata",
    kategori: "skole-pasning",
    url: "#",
    dato: daysAgo(3),
  },
  {
    headline: "Sådan planlægger I en sommerferie, hvor ingen bliver skuffede",
    dek: "En simpel model til at fordele ønsker, når hele familien skal blive enige om ferien.",
    kilde: "Eksempeldata",
    kategori: "ferie-fritid",
    url: "#",
    dato: daysAgo(5),
  },
  {
    headline: "Børnelæge: Det er tegnene på, at dit barn sover for lidt",
    dek: "Søvnmangel hos børn kan vise sig på måder, mange forældre ikke genkender med det samme.",
    kilde: "Eksempeldata",
    kategori: "sundhed-trivsel",
    url: "#",
    dato: daysAgo(6),
  },
  {
    headline: "Hvorfor 'fordi jeg siger det' sjældent virker efter treårsalderen",
    dek: "Familieterapeut om, hvordan man sætter grænser, børn faktisk forstår og respekterer.",
    kilde: "Eksempeldata",
    kategori: "opdragelse",
    url: "#",
    dato: daysAgo(8),
  },
  {
    headline: "Kalenderen der samler to forældres skemaer i ét overblik",
    dek: "Tre digitale værktøjer, forældre i delt bopæl bruger til at holde styr på hentninger og aflevering.",
    kilde: "Eksempeldata",
    kategori: "hverdagslogistik",
    url: "#",
    dato: daysAgo(9),
  },
  {
    headline: "Fritidsaktiviteter: sådan undgår I at booke jer selv fast hver dag",
    dek: "En håndfuld familier fortæller, hvordan de har skåret ned uden at børnene keder sig.",
    kilde: "Eksempeldata",
    kategori: "ferie-fritid",
    url: "#",
    dato: daysAgo(11),
  },
  {
    headline: "Det skal en god forældresamtale indeholde, mener skolelærere",
    dek: "Lærere peger på de spørgsmål, forældre med fordel kan stille til skole-hjem-samtalen.",
    kilde: "Eksempeldata",
    kategori: "skole-pasning",
    url: "#",
    dato: daysAgo(13),
  },
];

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

const CATEGORY_LABELS = {
  "hverdagslogistik": "Hverdagslogistik",
  "skole-pasning": "Skole & pasning",
  "ferie-fritid": "Ferie & fritid",
  "sundhed-trivsel": "Sundhed & trivsel",
  "opdragelse": "Opdragelse",
};

let ALL_ARTICLES = [];
let activeCategory = "alle";
let activeQuery = "";

/* ---------------------------------------------
   Hentning fra RSS (bruges når FEEDS er udfyldt)
--------------------------------------------- */
async function fetchFromFeeds(feeds) {
  const requests = feeds.map(async (feed) => {
    const endpoint = new URL("https://api.rss2json.com/v1/api.json");
    endpoint.searchParams.set("rss_url", feed.url);
    if (typeof RSS2JSON_API_KEY === "string" && RSS2JSON_API_KEY) {
      endpoint.searchParams.set("api_key", RSS2JSON_API_KEY);
    }
    try {
      const res = await fetch(endpoint.toString());
      const data = await res.json();
      if (data.status !== "ok") return [];
      return data.items.map((item) => ({
        headline: item.title,
        dek: stripHtml(item.description || "").slice(0, 160),
        kilde: feed.kilde,
        kategori: feed.kategori,
        url: item.link,
        dato: new Date(item.pubDate),
      }));
    } catch (err) {
      console.warn("Kunne ikke hente feed:", feed.url, err);
      return [];
    }
  });

  const results = await Promise.all(requests);
  return results.flat();
}

function stripHtml(html) {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || "";
}

/* ---------------------------------------------
   Visning
--------------------------------------------- */
function relativeTime(date) {
  const diffMs = Date.now() - date.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days <= 0) return "i dag";
  if (days === 1) return "i går";
  if (days < 30) return `${days} dage siden`;
  const months = Math.floor(days / 30);
  return months === 1 ? "1 måned siden" : `${months} måneder siden`;
}

function render() {
  const list = document.getElementById("article-list");
  const emptyState = document.getElementById("empty-state");
  const countEl = document.getElementById("result-count");

  const query = activeQuery.trim().toLowerCase();
  const filtered = ALL_ARTICLES.filter((a) => {
    const matchesCategory = activeCategory === "alle" || a.kategori === activeCategory;
    const matchesQuery = !query ||
      a.headline.toLowerCase().includes(query) ||
      (a.dek && a.dek.toLowerCase().includes(query));
    return matchesCategory && matchesQuery;
  });

  countEl.textContent = filtered.length === 1 ? "1 artikel" : `${filtered.length} artikler`;
  list.innerHTML = "";

  if (filtered.length === 0) {
    emptyState.hidden = false;
    return;
  }
  emptyState.hidden = true;

  for (const article of filtered) {
    const li = document.createElement("li");
    li.className = "article";
    li.innerHTML = `
      <a class="article__link" href="${article.url}" target="_blank" rel="noopener">
        <h3 class="article__headline">${escapeHtml(article.headline)}</h3>
        ${article.dek ? `<p class="article__dek">${escapeHtml(article.dek)}</p>` : ""}
        <p class="article__meta">
          <span>${escapeHtml(article.kilde)}</span>
          <span class="dot">${relativeTime(article.dato)}</span>
          <span class="dot category">${CATEGORY_LABELS[article.kategori] || article.kategori}</span>
        </p>
      </a>
    `;
    list.appendChild(li);
  }
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

/* ---------------------------------------------
   Opsætning
--------------------------------------------- */
function setupInteractions() {
  document.getElementById("search").addEventListener("input", (e) => {
    activeQuery = e.target.value;
    render();
  });

  document.getElementById("category-nav").addEventListener("click", (e) => {
    const btn = e.target.closest(".chip");
    if (!btn) return;
    document.querySelectorAll(".chip").forEach((c) => c.classList.remove("is-active"));
    btn.classList.add("is-active");
    activeCategory = btn.dataset.category;
    render();
  });
}

function setDate() {
  const el = document.getElementById("today-date");
  el.textContent = new Date().toLocaleDateString("da-DK", {
    weekday: "long", day: "numeric", month: "long",
  });
}

async function init() {
  setDate();
  setupInteractions();

  const notice = document.getElementById("data-notice");

  if (typeof FEEDS !== "undefined" && FEEDS.length > 0) {
    const fetched = await fetchFromFeeds(FEEDS);
    if (fetched.length > 0) {
      ALL_ARTICLES = fetched.sort((a, b) => b.dato - a.dato);
      notice.hidden = true;
    } else {
      ALL_ARTICLES = SAMPLE_ARTICLES;
      notice.hidden = false;
      notice.textContent = "Kunne ikke hente fra de konfigurerede kilder lige nu — viser eksempeldata i mellemtiden.";
    }
  } else {
    ALL_ARTICLES = SAMPLE_ARTICLES;
    notice.hidden = false;
    notice.textContent = "Viser eksempeldata. Tilføj jeres RSS-kilder i feeds.js for at hente rigtige artikler.";
  }

  render();
}

init();
