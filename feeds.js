/*
  FEEDS — kilder til Familieindekset

  Hvert element:
    url        RSS-feedets adresse
    kilde      Navnet, der vises under overskriften
    kategori   "hverdagslogistik" | "skole-pasning" | "ferie-fritid"
               | "sundhed-trivsel" | "opdragelse"
    filtrer    true  = brede nyhedskilder, hvor kun artikler der
                       matcher NOEGLEORD nedenfor kommer med
               false = emnekilder, hvor alt slipper igennem

  Alle feeds herunder er testet og virker. Bemærk at de store
  danske foraeldremedier (ALT.dk, baby.dk m.fl.) ikke laengere
  udgiver RSS, saa listen bygger paa nichekilder plus filtrerede
  nyhedskilder.
*/

const FEEDS = [
  // Emnekilder — alt kommer med
  { url: "https://www.folkeskolen.dk/rss", kilde: "Folkeskolen", kategori: "skole-pasning", filtrer: false },
  { url: "https://skoleelever.dk/feed/", kilde: "Danske Skoleelever", kategori: "skole-pasning", filtrer: false },
  { url: "https://bornsvilkar.dk/feed/", kilde: "Børns Vilkår", kategori: "sundhed-trivsel", filtrer: false },
  { url: "https://min-mave.dk/feed/", kilde: "Min Mave", kategori: "sundhed-trivsel", filtrer: false },

  // Brede nyhedskilder — kun artikler der matcher NOEGLEORD
  { url: "https://www.dr.dk/nyheder/service/feeds/indland", kilde: "DR Indland", kategori: "hverdagslogistik", filtrer: true },
  { url: "https://www.dr.dk/nyheder/service/feeds/viden", kilde: "DR Viden", kategori: "sundhed-trivsel", filtrer: true },
  { url: "https://videnskab.dk/feed/", kilde: "Videnskab.dk", kategori: "sundhed-trivsel", filtrer: true },
  { url: "https://politiken.dk/rss/senestenyt.rss", kilde: "Politiken", kategori: "hverdagslogistik", filtrer: true },
];

// Rammer overskrift og manchet. Tilføj eller fjern frit.
const NOEGLEORD = [
  "børn", "barn", "barnet", "forældre", "familie", "familier",
  "mor ", "far ", "mødre", "fædre", "baby", "babyer", "spædbarn",
  "skole", "skolen", "elev", "elever", "lærer", "gymnasie",
  "vuggestue", "børnehave", "dagpleje", "daginstitution", "sfo",
  "barsel", "graviditet", "gravid", "fødsel",
  "teenager", "unge", "ungdom", "opdragelse", "trivsel",
];

const RSS2JSON_API_KEY = ""; // valgfri — se README
