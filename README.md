# Familieindekset

Et statisk opslagsværktøj, der samler overskrifter og links til artikler om børn og familieliv. Bygget som ren HTML/CSS/JS, så det kan hostes direkte på GitHub Pages uden server.

## Filer
- `index.html` — sidens struktur
- `styles.css` — design
- `feeds.js` — jeres kilder (RSS-feeds) — tom som udgangspunkt
- `app.js` — logik: henter, søger, filtrerer og viser artikler

Indtil `feeds.js` er udfyldt, viser siden eksempeldata, så design og funktioner kan ses og testes med det samme.

## Sådan lægger du den op på GitHub Pages

1. Opret et nyt repository på GitHub, fx `familieindekset`.
2. Læg de fire filer (`index.html`, `styles.css`, `feeds.js`, `app.js`) i roden af repositoryet.
3. Gå til **Settings → Pages** i repositoryet.
4. Under **Build and deployment** vælges **Deploy from a branch**, branch `main` og mappe `/root`.
5. Gem — siden er typisk tilgængelig efter 1-2 minutter på `https://dit-brugernavn.github.io/familieindekset/`.
6. Har du et eget domæne, kan det tilknyttes under samme Pages-indstillinger ved at tilføje en `CNAME`-fil eller udfylde feltet **Custom domain**.

## Sådan tilslutter du rigtige artikler senere

Åbn `feeds.js` og tilføj jeres kilder, én pr. linje:

```js
const FEEDS = [
  { url: "https://eksempel.dk/feed", kilde: "Eksempel", kategori: "hverdagslogistik" },
];
```

`kategori` skal være én af: `hverdagslogistik`, `skole-pasning`, `ferie-fritid`, `sundhed-trivsel`, `opdragelse`.

Siden henter feeds via den gratis tjeneste [rss2json.com](https://rss2json.com), fordi GitHub Pages ikke kan køre serverkode, og de fleste RSS-feeds ikke kan hentes direkte fra en browser. Den gratis grænse er rigelig til få kilder og moderat trafik; ved behov kan I oprette en gratis API-nøgle på rss2json.com og indsætte den i `RSS2JSON_API_KEY` i `feeds.js`.

## Videre idéer
- Tilføj flere kategorier ved at udvide `CATEGORY_LABELS` i `app.js` og knapperne i `index.html`.
- Sortér eller vægt bestemte kilder højere ved at justere sorteringen i `init()` i `app.js`.
- Skift skrifttyper eller farver i toppen af `styles.css` under `:root`.
