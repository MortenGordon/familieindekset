/*
  FEEDS — kilder til Familieindekset
  -----------------------------------------------------------
  Udfyld listen herunder med RSS-feeds fra de sider, I vil
  indeksere artikler fra. Så snart listen ikke er tom, forsøger
  siden automatisk at hente og vise rigtige artikler i stedet
  for eksempeldataen i app.js.

  Hvert element har:
    url        RSS-feedets adresse (skal starte med http/https)
    kilde      Navnet, der vises som kilde under overskriften
    kategori   Skal matche én af værdierne herunder:
               "hverdagslogistik" | "skole-pasning" |
               "ferie-fritid" | "sundhed-trivsel" | "opdragelse"

  Eksempel (fjern //-tegnene og indsæt en rigtig feed-adresse):

  { url: "https://www.eksempelmedie.dk/feed/boern", kilde: "Eksempelmedie", kategori: "hverdagslogistik" },

  -----------------------------------------------------------
  Teknik: siden bruger den gratis tjeneste rss2json.com til at
  omdanne RSS til JSON i browseren (nødvendigt fordi GitHub
  Pages ikke kan køre serverkode, og de fleste RSS-feeds ikke
  tillader direkte opslag fra browseren pga. CORS). Ved høj
  trafik kan I selv oprette en gratis API-nøgle på rss2json.com
  og sætte den i RSS2JSON_API_KEY nedenfor.
*/

const FEEDS = [
  // Tilføj jeres kilder her
];

const RSS2JSON_API_KEY = ""; // valgfri — se note ovenfor
