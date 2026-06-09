// ╔══════════════════════════════════════════════════════════════════════════╗
// ║  pages/news.js — JGamerz News Page                                      ║
// ║  Vanilla JS · SPA compatible · No frameworks · No backend               ║
// ║                                                                          ║
// ║  EXPORTS:                                                                ║
// ║    News()      → returns full page HTML string                           ║
// ║    initNews()  → wires up all interactivity after HTML is injected       ║
// ╚══════════════════════════════════════════════════════════════════════════╝


// ─────────────────────────────────────────────────────────────────────────────
// FONT INJECTION  (Orbitron + Rajdhani + Inter)
// ─────────────────────────────────────────────────────────────────────────────
(function injectFonts() {
    if (document.getElementById("jg-news-fonts")) return;
    const link = document.createElement("link");
    link.id = "jg-news-fonts";
    link.rel = "stylesheet";
    link.href =
        "https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&family=Rajdhani:wght@400;500;600;700&family=Inter:wght@300;400;500&display=swap";
    document.head.appendChild(link);
})();

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║  NEWS DATA                                                               ║
// ║  ─────────────────────────────────────────────────────────────────────── ║
// ║  Edit this array to add / remove / update news articles.                ║
// ║  Each object supports:                                                   ║
// ║    id             → unique identifier (number)                           ║
// ║    title          → article headline (string)                            ║
// ║    category       → one of: Games | Hardware | Esports | Consoles |     ║
// ║                             Gaming Gear | Industry | Reviews | Events    ║
// ║    image          → URL to cover image (string)                          ║
// ║    shortDesc      → 1–2 sentence teaser (string)                         ║
// ║    content        → full article text shown in the modal (string)        ║
// ║    type           → "article" | "video"                                  ║
// ║    trending       → true | false  (shows in Trending section)            ║
// ║    youtubeEmbed   → YouTube embed URL (string, only for type:"video")    ║
// ╚══════════════════════════════════════════════════════════════════════════╝

const newsData = [
  // ── TRENDING / GAMES ─────────────────────────────────────────────────────

  {
    id: 1,
    title: "GTA VI Officially Confirmed for Fall 2025 — What We Know So Far",
    category: "Games",
    image: "./assets/News_img/GTAVI.jpg",
    shortDesc:
      "Rockstar Games breaks the internet again as Grand Theft Auto VI gets a confirmed release window and a jaw-dropping gameplay showcase.",
    content: `<p>After years of speculation and one of the most-viewed trailers in YouTube history, Rockstar Games has officially confirmed that Grand Theft Auto VI will launch in Fall 2025. The announcement came alongside an extended gameplay showcase that left the gaming community speechless.</p>

<p>The game is set in a fictional version of Miami and surrounding Florida, featuring the series' first female protagonist, Lucia, alongside co-protagonist Jason. The open world has been described as the most detailed and reactive environment Rockstar has ever built.</p>

<p>The showcase revealed several new mechanics: a fully simulated economy, destructible environments, improved AI behavior, and a narrative system that adapts based on player choices. The game is expected to launch first on PS5 and Xbox Series X|S, with a PC version following later.</p>

<p>Rockstar has confirmed online multiplayer will return in a new form, with what appears to be a persistent shared world that continues to evolve post-launch. Pre-orders are already live and have reportedly broken all-time records across digital storefronts.</p>`,
    type: "article",
    trending: true,
    youtubeEmbed: "",
  },

  {
    id: 2,
    title: "Elden Ring: Shadow of the Erdtree DLC — Full Review",
    category: "Reviews",
    image: "./assets/News_img/elden-ring.jpg",
    shortDesc:
      "FromSoftware's massive expansion delivers everything fans hoped for — brutal bosses, breathtaking landscapes, and a haunting new storyline.",
    content: `<p>Shadow of the Erdtree is not just a DLC — it is a full-scale expansion that rivals many complete games in scope and ambition. FromSoftware has managed to construct an entirely new world within the Land of Shadow, layered with secrets, interconnected zones, and lore that deepens the already complex Elden Ring mythology.</p>

<p>The expansion introduces over 100 new enemies, 30+ boss encounters, and dozens of weapons, spells, and armor sets. The landscape itself is a masterpiece — rolling golden hills give way to gothic dungeons, crystalline caves, and ancient ruins draped in melancholy.</p>

<p>Performance-wise, the DLC runs smoothly on PS5 and Xbox Series X. PC players have reported minor stutters in densely populated areas, though patches have largely addressed these. Difficulty is in line with the base game's most challenging moments, and the final boss is widely considered one of the best in FromSoftware's history.</p>

<p>Score: 9.8/10 — A stunning, essential expansion that cements Elden Ring as one of the greatest games ever made.</p>`,
    type: "article",
    trending: true,
    youtubeEmbed: "",
  },

  {
    id: 3,
    title: "NVIDIA GeForce RTX 5090 Review — A Generational Leap",
    category: "Hardware",
    image: "./assets/News_img/RTX5090.jpg",
    shortDesc:
      "NVIDIA's flagship GPU shatters performance benchmarks and redefines what's possible in real-time rendering — but at a steep price.",
    content: `<p>The RTX 5090 arrives as NVIDIA's most powerful consumer GPU ever, and it doesn't disappoint on raw performance. Built on the next-generation Blackwell architecture, it delivers roughly 60% uplift in rasterization over the already impressive RTX 4090.</p>

<p>DLSS 4 has been significantly improved, now using a neural rendering approach that produces near-native quality at a fraction of the computational cost. Frame Generation 2.0 eliminates much of the latency that plagued the previous version.</p>

<p>Thermal performance is impressive — the card runs cooler than expected for its power draw, though a 600W TDP means a robust PSU is mandatory. The card ships with a 16-pin adapter, and several AIB partners have designed elegant triple-fan cooling solutions.</p>

<p>The $1,999 MSRP is steep, and real-world availability at launch has been limited. For those who can get one at MSRP, this is the undisputed king of gaming GPUs. For everyone else, the RTX 5080 remains a more accessible beast.</p>`,
    type: "article",
    trending: true,
    youtubeEmbed: "",
  },

  {
    id: 4,
    title:
      "Sony Interactive Entertainment Announces Major Summer 2026 Update for PlayStation Plus",
    category: "Industry",
    image: "./assets/News_img/sony.jpg",
    shortDesc:
      " Sony reveals a massive update for PlayStation Plus, bringing new AAA titles, improved cloud gaming features, and a smarter personalized experience for players during Summer 2026.",
    content: `<p>Sony Interactive Entertainment has officially announced a major expansion update for its PlayStation Plus subscription service, planned for Summer 2026. According to the company, the upcoming update aims to significantly improve the overall player experience by adding a larger lineup of AAA games and introducing several quality-of-life enhancements for subscribers worldwide.

Reports suggest that the update will feature a collection of highly requested titles alongside expanded cloud gaming support and faster game streaming performance for PlayStation 5 users. In addition, Sony is reportedly working on a smarter recommendation system that analyzes player interests and playtime activity to provide more personalized game suggestions.

The announcement quickly gained attention across gaming communities and social media platforms, with many players expressing excitement about the future of the service. The update also comes at a time of strong competition between subscription platforms, especially against services like Xbox Game Pass.

Sony is expected to reveal the complete list of upcoming games and additional subscription details in the coming weeks. </p>`,
    type: "article",
    trending: true,
    youtubeEmbed: "",
  },

  {
    id: 5,
    title: "PlayStation 6 Developer Kits Spotted in the Wild",
    category: "Consoles",
    image: "./assets/News_img/ps6.jpg",
    shortDesc:
      "Leaked photographs of Sony's next-generation development hardware have surfaced, giving us our first glimpse at what PS6 could look like.",
    content: `<p>Photographs appearing to show PlayStation 6 developer kit units have surfaced online, sparking fierce debate among hardware analysts. The units show a distinctive angular design with expanded ventilation, and several USB-C ports alongside what appears to be a proprietary connector for development peripherals.</p>

<p>Specifications are not yet confirmed, but industry sources suggest the PS6 will use a custom AMD GPU chip built on a 3nm process, targeting 8K output capability and significantly improved ray tracing performance compared to PS5.</p>

<p>Sony has not commented on the leak, which is standard practice. However, the timing aligns with previous Sony dev kit leaks, which typically surface 18-24 months before a console's commercial launch. If accurate, a 2026-2027 release window appears plausible.</p>

<p>Game developers who have reportedly seen the hardware describe an architecture that makes PS5 development feel "like a warm-up." Several major studios are believed to have begun cross-gen projects targeting both PS5 and PS6.</p>`,
    type: "article",
    trending: true,
    youtubeEmbed: "",
  },

  {
    id: 6,
    title: "Razer Viper V3 HyperSpeed — The Perfect Competitive Mouse?",
    category: "Gaming Gear",
    image: "./assets/News_img/razar.png",
    shortDesc:
      "Razer's latest flagship wireless mouse combines a 35K DPI sensor, 90-hour battery, and an 80-gram shell that feels like nothing in your hand.",
    content: `<p>The Razer Viper V3 HyperSpeed arrives as the culmination of years of refinement in competitive wireless gaming mice. At exactly 80 grams, it feels whisper-light without the fragile construction that sometimes accompanies ultralight designs.</p>

<p>The Focus Pro 35K optical sensor is the standout feature — it delivers pixel-perfect tracking across all surfaces, including glass, and maintains perfect accuracy up to insane flick speeds. The 8000Hz polling rate via the included HyperPolling dongle reduces input latency below what most players can perceive.</p>

<p>Battery life is rated at 90 hours at standard polling rates, dropping to around 30 hours at 8000Hz. Charging via USB-C is fast — a 15-minute charge provides enough power for a full gaming session. The side buttons have been redesigned with a more satisfying click and reduced accidental activation.</p>

<p>At $159, it's priced competitively against the Logitech G Pro X Superlight 2 and the Finalmouse Starlight-12. For players who demand the absolute best in wireless performance, the Viper V3 HyperSpeed is an easy recommendation.</p>`,
    type: "article",
    trending: false,
    youtubeEmbed: "",
  },

  // ── HARDWARE ─────────────────────────────────────────────────────────────

  {
    id: 7,
    title: "Intel Arrow Lake CPUs Benchmarked — Should You Upgrade?",
    category: "Hardware",
    image: "./assets/News_img/intelcore.jpg",
    shortDesc:
      "Intel's 15th-generation Arrow Lake processors offer meaningful improvements in efficiency and multi-threaded performance, but gaming gains are modest.",
    content: `<p>Intel's Arrow Lake lineup represents the company's most significant architectural shift since Alder Lake. Built on Intel's own 20A process node with TSMC tiles for graphics and I/O, the hybrid architecture has been refined to address the gaming performance concerns that plagued Raptor Lake.</p>

<p>In productivity workmarks, the Core Ultra 9 285K scores impressive numbers in Cinebench and Blender, pulling ahead of AMD's Ryzen 9 9950X in specific multi-threaded scenarios. Single-threaded performance is competitive, sitting within 3-5% of AMD's best in most tests.</p>

<p>Gaming performance tells a different story. In CPU-bound titles, Arrow Lake slightly trails Raptor Lake Refresh, though memory tuning and BIOS updates are expected to close the gap. In GPU-limited scenarios at 1440p and 4K, the difference is negligible.</p>

<p>Power consumption is dramatically improved — the 285K can be power-limited to 125W with minimal performance loss. Thermals are manageable even with mid-range air coolers. Verdict: A solid platform for new builds, but not a compelling upgrade from Raptor Lake.</p>`,
    type: "article",
    trending: false,
    youtubeEmbed: "",
  },

  {
    id: 8,
    title: 'Samsung Odyssey Neo G9 57" — The Ultimate Gaming Monitor',
    category: "Hardware",
    image: "./assets/News_img/samsungNeo.jpg",
    shortDesc:
      "Samsung's mammoth 57-inch Dual UHD monitor with 240Hz refresh rate is either the greatest gaming display ever made or an absurd luxury — or both.",
    content: `<p>The Samsung Odyssey Neo G9 at 57 inches and Dual UHD resolution (7680x2160) is an experience that defies conventional monitor reviews. This is not just a monitor — it is a complete reimagining of how games are displayed.</p>

<p>The QLED MiniLED panel delivers a staggering 4,000 nits peak brightness with a 1,000,000:1 contrast ratio. HDR content looks cinematic, with highlights that punch through shadows in a way that no competitor has matched. Response time is rated at 1ms with 240Hz refresh rate.</p>

<p>The curved 1000R panel places every part of the screen at equal distance from your eyes, and at this size, the curve feels natural rather than extreme. Compatible games with ultra-wide support look transcendent — Cyberpunk 2077 and Starfield appear designed for this display.</p>

<p>The caveats: you need at minimum an RTX 5080 or RX 9900 XT to drive games at native resolution. At $2,499, it's an investment for enthusiasts only. But for those who can afford it, the Neo G9 is the definitive gaming monitor of 2025.</p>`,
    type: "article",
    trending: false,
    youtubeEmbed: "",
  },

  // ── ESPORTS ──────────────────────────────────────────────────────────────

  {
    id: 9,
    title:
      "ESL Announces Record-Breaking Prize Pool for 2026 International Championship",
    category: "Esports",
    image: "./assets/News_img/esl.jpg",
    shortDesc:
      "ESL reveals a massive prize pool and expanded global competition format for its upcoming 2026 international esports championship, attracting top teams from around the world.",
    content: `<p>ESL has officially announced its largest-ever international esports championship for 2026, featuring a record-breaking prize pool and a newly expanded tournament structure. The event is expected to bring together elite professional teams from multiple regions, including North America, Europe, Asia, and the Middle East.

According to tournament organizers, the championship will introduce a longer competitive season with additional qualification stages, allowing more emerging teams to participate on the global stage. The event will also feature upgraded live production, enhanced audience experiences, and new interactive broadcasts for online viewers.

Several major esports organizations have already confirmed their participation, while fans across social media platforms expressed excitement about the increased competition and larger rewards. Analysts believe the tournament could become one of the biggest esports events of the year, especially with the continued growth of competitive gaming worldwide.

The championship is expected to include multiple popular esports titles and will reportedly be hosted in a large international arena with thousands of live spectators attending the finals. Organizers are expected to reveal the full schedule, participating games, and final prize distribution details in the coming months.</p>`,
    type: "article",
    trending: true,
    youtubeEmbed: "",
  },

  {
    id: 10,
    title: "Valorant Masters 2025 — Team Sentinels Crowned Champions",
    category: "Esports",
    image: "./assets/News_img/es2.jpg",
    shortDesc:
      "Sentinels end a two-year title drought in spectacular fashion, defeating LOUD 3-1 in a grand final that will define the Valorant era.",
    content: `<p>Sentinels' journey to the Valorant Masters 2025 championship was supposed to be a rebuild year. Instead, it became the most dominant tournament performance the game has ever seen. Led by TenZ and a revitalized roster, Sentinels swept through the group stage and dismantled every opponent in the bracket without dropping a series until the grand final.</p>

<p>LOUD, representing Brazil and widely considered the strongest team entering the event, pushed Sentinels to four maps in a grand final that showcased everything that makes Valorant compelling: precise gunplay, creative utility usage, and clutch performances under pressure.</p>

<p>TenZ's performance in the final has already generated highlight compilations with tens of millions of views. His 40-kill showing on Bind was particularly stunning, including a five-player ace that closed out the tournament.</p>

<p>The $1 million prize pool was distributed, with Sentinels taking $400,000. Riot has announced that Masters prize pools will increase by 30% for 2026, following record-breaking viewership numbers that surpassed all previous Valorant events.</p>`,
    type: "article",
    trending: false,
    youtubeEmbed: "",
  },

  // ── CONSOLES ─────────────────────────────────────────────────────────────

  {
    id: 11,
    title: "Xbox Game Pass Ultimate Gets Day-One AAA Releases in 2025",
    category: "Consoles",
    image: "./assets/News_img/xboxpass.jpg",
    shortDesc:
      "Microsoft confirms that every first-party title releasing in 2025 will arrive on Game Pass Ultimate on day one, dramatically increasing the service's value proposition.",
    content: `<p>Microsoft has reaffirmed its commitment to Game Pass with an announcement that reinforces its value over all competing subscription services: every Xbox Game Studios and Bethesda title releasing in 2025 will be available on Game Pass Ultimate on launch day at no additional cost.</p>

<p>The lineup includes at least four major titles: Gears 7, the next Forza Motorsport entry, Fable (finally), and a new IP from Obsidian Entertainment. Combined with continued access to EA Play, over 500 games in the library, and cloud gaming improvements, this announcement has driven Game Pass subscriptions to an all-time high.</p>

<p>Microsoft reports that Game Pass now has over 34 million subscribers globally, a figure that has tripled since the acquisition of Activision Blizzard. The integration of Call of Duty into Game Pass has been cited as the single largest driver of new subscribers.</p>

<p>Sony, in response, has accelerated its own PlayStation Plus Premium tier improvements and has begun announcing more first-party day-one titles for the service — suggesting the subscription model is becoming the dominant business model for the console generation.</p>`,
    type: "article",
    trending: false,
    youtubeEmbed: "",
  },

  {
    id: 12,
    title: "Nintendo Switch 2 — Everything We Know After the Direct",
    category: "Consoles",
    image: "./assets/News_img/switch2.jpg",
    shortDesc:
      "Nintendo's long-awaited sequel to the Switch has been officially revealed with a bigger screen, magnetic Joy-Cons, and a mouse-click controller button.",
    content: `<p>The Nintendo Switch 2 is real, and it's more impressive than most analysts predicted. Nintendo's Direct showcase revealed a device with a 8-inch LCD screen, magnetic Joy-Con attachment, a new C button on the right Joy-Con that functions as a mouse when slid along a flat surface, and significantly improved processing power.</p>

<p>Launch titles confirmed include a new 3D Mario, a new Donkey Kong game developed by Donkey Kong Country Returns creator, and a version of The Legend of Zelda: Breath of the Wild rebuilt for the new hardware. Third-party support from Ubisoft, EA, and Capcom was also confirmed.</p>

<p>Backward compatibility with original Switch cartridges is confirmed, with some games receiving free performance upgrades. The original Switch library will continue to be supported via the Nintendo Online service.</p>

<p>Battery life is rated at 5-9 hours depending on the game, a substantial improvement over the original Switch. The dock has been redesigned with USB-C front-facing connectivity, and 4K output while docked is confirmed via NVIDIA DLSS integration. Pricing and a final release date are expected to be announced at the end of the month.</p>`,
    type: "article",
    trending: true,
    youtubeEmbed: "",
  },

  // ── GAMING GEAR ───────────────────────────────────────────────────────────

  {
    id: 13,
    title: "SteelSeries Arctis Nova Pro Wireless — Audiophile Gaming",
    category: "Gaming Gear",
    image: "./assets/News_img/Nova-Pro-Wireless.png",
    shortDesc:
      "SteelSeries pushes the boundaries of gaming audio with a headset that blurs the line between audiophile headphones and competitive gaming gear.",
    content: `<p>The SteelSeries Arctis Nova Pro Wireless has been a benchmark headset since its original release, and this updated revision cements that position. The primary improvements are a new acoustic driver design, improved wireless range, and an upgraded base station with more routing flexibility.</p>

<p>Sound quality is exceptional for a gaming headset. The soundstage is wide and accurately positioned, making footstep detection in competitive games precise and reliable. The low-end response is punchy without overwhelming mids and highs — music sounds genuinely great through these drivers.</p>

<p>The active noise cancellation system is the best in any gaming headset, approaching Sony WH-1000XM5 levels of isolation. The swappable battery system means zero downtime — charge one battery while using the other. Total wireless play time is theoretically infinite.</p>

<p>The companion software remains one of the most powerful equalizer and audio routing tools available. At $349, it's an investment — but for players who spend 6+ hours daily in headphones, it's the most comfortable and best-sounding gaming headset money can buy.</p>`,
    type: "article",
    trending: false,
    youtubeEmbed: "",
  },

  {
    id: 14,
    title: "Corsair K70 Max — Mechanical Keyboard Perfection",
    category: "Gaming Gear",
    image: "./assets/News_img/Corsair-K70.png",
    shortDesc:
      "Corsair's flagship mechanical keyboard gets a substantial refresh with magnetic Hall Effect switches, zero-debounce actuation, and stunning RGB lighting.",
    content: `<p>The Corsair K70 Max represents a generational leap in mechanical keyboard technology, thanks to its integration of magnetic Hall Effect switches instead of traditional mechanical contacts. The result is a switch that never needs replacing, never debounces, and offers adjustable actuation point — a feature that competitive players have long requested.</p>

<p>Actuation point can be set anywhere from 0.1mm to 4mm via the iCUE software, allowing players to configure ultra-responsive rapid trigger inputs or standard actuation depending on the game being played. Rapid trigger mode — where a key resets the moment it begins moving upward — is a significant competitive advantage in first-person shooters.</p>

<p>Build quality is exceptional: an aluminum top plate, removable cable with braided coating, and per-key RGB that remains one of the most vibrant in the industry. Macro keys on the left side and a dedicated media bar add utility for streaming setups.</p>

<p>The switches are rated for 100 million keystrokes, effectively eliminating the lifetime concern that affects traditional mechanical keyboards. At $199, it's positioned as a flagship product — and it absolutely delivers at that price point.</p>`,
    type: "article",
    trending: false,
    youtubeEmbed: "",
  },

  // ── INDUSTRY ─────────────────────────────────────────────────────────────

  {
    id: 15,
    title: "Microsoft Acquires Sega's Western Publishing Rights",
    category: "Industry",
    image: "./assets/News_img/sega.jpeg",
    shortDesc:
      "In a surprise strategic deal, Microsoft gains publishing rights for Sega's Western IP portfolio, including Sonic, Total War, and the Persona franchise.",
    content: `<p>The games industry woke up to a bombshell announcement: Microsoft has entered into a strategic publishing partnership with Sega, granting Microsoft first-look rights and Western publishing exclusivity for a curated selection of Sega's most valuable franchises over a 10-year term.</p>

<p>Franchises reportedly included in the deal span multiple genres: the Persona series, the Yakuza/Like a Dragon franchise, Total War, Sonic the Hedgehog, and the Atlus-developed SMT series. Sega retains full creative and development control in Japan, while Microsoft handles marketing, localization, and distribution in Western markets.</p>

<p>The deal does not constitute an acquisition — Sega remains an independent company. However, the agreement includes Game Pass day-one availability for all titles covered under the partnership, a significant value addition for Microsoft's subscription service.</p>

<p>Industry analysts have described the deal as "unconventional but strategically brilliant," giving Microsoft access to beloved Japanese IP without the regulatory complexity of a full acquisition. Sony has not yet responded publicly, but several PlayStation exclusivity announcements from Japan Studio partners are expected to follow.</p>`,
    type: "article",
    trending: true,
    youtubeEmbed: "",
  },

  {
    id: 16,
    title: "Epic Games Store Hits 300 Million Accounts — Fortnite Effect",
    category: "Industry",
    image: "./assets/News_img/epicgames.png",
    shortDesc:
      "Epic's storefront reports a milestone 300 million registered accounts, driven primarily by Fortnite's continued dominance and the weekly free game program.",
    content: `<p>Epic Games has announced that the Epic Games Store has surpassed 300 million registered accounts, a number that places it firmly as Steam's closest competitor in the PC gaming marketplace. The announcement came during Epic's annual State of the Store address, which also revealed a 40% increase in developer revenue share payouts compared to the previous year.</p>

<p>The weekly free game program remains the store's most effective user acquisition tool. Over the past three years, Epic has given away games with a combined retail value exceeding $15,000, attracting users who may otherwise never have created an account. Retention from these promotions has improved significantly.</p>

<p>Exclusive titles continue to draw controversy but also traffic. The recent Epic exclusivity period for several high-profile releases drove record-breaking sales on the platform. Epic confirmed that exclusivity windows are now being negotiated at shorter durations — typically 6 months rather than 12 — in response to community feedback.</p>

<p>Fortnite itself accounts for a significant portion of store activity, with hundreds of millions of players launching the game through the Epic launcher monthly. Epic's direct integration of Fortnite updates with the store ecosystem remains their most powerful competitive advantage.</p>`,
    type: "article",
    trending: false,
    youtubeEmbed: "",
  },

  // ── EVENTS ───────────────────────────────────────────────────────────────

  {
    id: 17,
    title: "Gamescom 2025 — The Biggest Announcements from Cologne",
    category: "Events",
    image: "./assets/News_img/gamescom.jpg",
    shortDesc:
      "Europe's largest gaming convention delivered surprise reveals, hands-on demos, and a show floor that felt like the industry's return to its pre-pandemic energy.",
    content: `<p>Gamescom 2025 set a new attendance record with over 400,000 visitors across five days in Cologne, Germany. The show floor spread across twelve halls, with major publishers and indie developers showcasing everything from blockbuster sequels to experimental new experiences.</p>

<p>The opening night show, hosted as always by Geoff Keighley, featured over 30 world premiere announcements. Highlights included the first gameplay footage of Ubisoft's Avatar: Frontiers of Pandora expansion, a surprise reveal of a new Witcher game developed by CD Projekt Red, and a stunning tech demo of Epic's Unreal Engine 6 running on next-generation hardware.</p>

<p>The indie showcase was particularly strong this year, with several titles already trending on Steam Wishlist charts. A roguelite dungeon crawler set in a procedurally generated Gothic cathedral received a standing ovation from the press area during its live demo.</p>

<p>Sony's presence was notably expanded compared to previous years, with a dedicated PlayStation pavilion that featured hands-on demos of four upcoming PS5 exclusives. Xbox's booth centered around Game Pass lifestyle marketing, with demo stations for 20+ game pass titles.</p>`,
    type: "article",
    trending: false,
    youtubeEmbed: "",
  },

  {
    id: 18,
    title: "The Game Awards 2025 — Full List of Winners",
    category: "Events",
    image: "./assets/News_img/gameoftheyear.jpg",
    shortDesc:
      "Elden Ring: Shadow of the Erdtree swept the major categories, while an indie title took everyone by surprise in the best narrative category.",
    content: `<p>The Game Awards 2025 aired live from the Peacock Theater in Los Angeles, drawing a record 16 million concurrent viewers across Twitch, YouTube, and Steam broadcast simultaneously. Host Geoff Keighley guided a four-hour show packed with world premieres, emotional awards moments, and surprise guest appearances.</p>

<p>Game of the Year: Elden Ring: Shadow of the Erdtree — The DLC was controversially allowed as a standalone GOTY candidate, and it won. The room went silent as Hidetaka Miyazaki accepted the award and quietly thanked "every player who persevered."</p>

<p>Best Narrative: Echoes of the Forgotten — A small indie studio from Portugal took the award with their memoir-inspired adventure game, receiving a standing ovation and immediate surge of sales that crashed their digital storefront servers.</p>

<p>Best Ongoing Game: Fortnite — Its fourth consecutive win in the category, driven by a year of collaboration events that brought in cultural icons from music, film, and sport.</p>

<p>Best Esports Athlete: s1mple — The CS2 veteran's return-from-retirement championship run made him the unanimous choice. He received the award via video call from Kyiv, to the loudest applause of the night.</p>`,
    type: "article",
    trending: false,
    youtubeEmbed: "",
  },

  // ── VIDEOS ───────────────────────────────────────────────────────────────

  {
    id: 101,
    title: "GTA VI — Official Gameplay Showcase (Extended Cut)",
    category: "Games",
    image: "",
    shortDesc:
      "Watch 20+ minutes of raw, unedited GTA VI gameplay footage captured on PS5 hardware.",
    content: `<p>The extended gameplay showcase for GTA VI offers our most detailed look yet at Rockstar's vision for the next generation of open-world games. This video captures over 20 minutes of unedited PS5 gameplay across three distinct regions of the game's setting.</p>`,
    type: "video",
    trending: true,
    youtubeEmbed:
      "https://www.youtube.com/embed/65Zg8sRYXLM?si=tZaPrGznP3pc_H06",
  },

  {
    id: 102,
    title: "RTX 5090 vs RTX 4090 — Ultimate Benchmark Battle",
    category: "Hardware",
    image: "",
    shortDesc:
      "We push both GPUs to their limits across 15 titles at 4K and 8K to find out if the 5090 is worth the upgrade.",
    content: `<p>This head-to-head benchmark video puts the RTX 5090 and the RTX 4090 through a comprehensive gauntlet of modern titles, testing at 4K native and 8K with DLSS enabled.</p>`,
    type: "video",
    trending: false,
    youtubeEmbed:
      "https://www.youtube.com/embed/3AKxbWgQDbY?si=bjCTEDru35ysFE26",
  },

  {
    id: 103,
    title: "CS2 World Championship — s1mple's 5-Man Ace (4K 60fps)",
    category: "Esports",
    image: "",
    shortDesc:
      "The shot heard 'round the world. Watch the clutch that won a championship in crystal clear 4K resolution.",
    content: `<p>This video captures s1mple's legendary five-player ace in the CS2 World Championship grand final, the moment that secured his team's championship victory and cemented his legacy as the greatest player in Counter-Strike history.</p>`,
    type: "video",
    trending: true,
    youtubeEmbed:
      "https://www.youtube.com/embed/dIKIThz6YVU?si=XzL25iiOv2uzr3nQ",
  },

  {
    id: 104,
    title: "Nintendo Switch 2 — Full Hardware Breakdown",
    category: "Consoles",
    image: "",
    shortDesc:
      "Every detail of the Nintendo Switch 2 analyzed: new Joy-Cons, the C button, screen quality, and performance targets.",
    content: `<p>Nintendo's Switch 2 reveal Direct covered a lot of ground quickly. This video breaks down every hardware detail revealed, analyzes the new Joy-Con magnetic system, explains what the mysterious C button actually does, and evaluates the new console's performance targets based on what we know.</p>`,
    type: "video",
    trending: false,
    youtubeEmbed:
      "https://www.youtube.com/embed/pB9jEYO2oaA?si=WY858GPl04c4qiY_",
  },

  {
    id: 105,
    title: "Marvel 1943: Rise of Hydra Reveals First Gameplay Trailer",
    category: "Events",
    image: "",
    shortDesc:
      "Marvel’s upcoming action game receives its first gameplay trailer, featuring Captain America and Black Panther in a cinematic World War II adventure.",
    content: `<p></p> `,
    trending: false,
    youtubeEmbed:
      "https://www.youtube.com/embed/Lb2wwEx6DVw?si=yjKeQy_mi2ONXtCd",
  },

  {
    id: 106,
    title: "Razer Viper V3 HyperSpeed — Hands-On Review",
    category: "Gaming Gear",
    image: "",
    shortDesc:
      "We spend two weeks gaming with Razer's new flagship wireless mouse. Here's the full verdict.",
    content: `<p>After two weeks of competitive FPS sessions, productivity use, and extensive testing on multiple mouse surfaces, we're ready to deliver our full verdict on the Razer Viper V3 HyperSpeed. Is it the best wireless gaming mouse ever made?</p>`,
    type: "video",
    trending: false,
    youtubeEmbed:
      "https://www.youtube.com/embed/ebc_ktGbEt0?si=6Hx5gIzli0PGura4",
  },
]; // ← end of newsData — add new articles above this line

// ─────────────────────────────────────────────────────────────────────────────
// UTILITY HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/** HTML-encode a string to prevent XSS */
function esc(str = "") {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

/** Placeholder image for cards without a real URL */
function placeholderImg(title, w = 800, h = 500) {
    return `https://placehold.co/${w}x${h}/0d1b2a/ff6b00?text=${encodeURIComponent(title)}&font=orbitron`;
}

/** Category colour accent — extend as needed */
const CATEGORY_COLORS = {
    Games: "rgba(255,107,0,.2)",
    Hardware: "rgba(0,180,255,.15)",
    Esports: "rgba(0,255,120,.12)",
    Consoles: "rgba(200,0,255,.12)",
    "Gaming Gear": "rgba(255,220,0,.12)",
    Industry: "rgba(255,60,60,.12)",
    Reviews: "rgba(0,255,200,.12)",
    Events: "rgba(255,140,0,.16)",
};

// ─────────────────────────────────────────────────────────────────────────────
// HTML CARD BUILDERS
// All builders accept a news item object and return an HTML string.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Build a TRENDING card (large, with hover glow)
 * Used in the Trending section slider.
 */
function buildTrendCard(item) {
    const img = item.image || placeholderImg(item.title);
    const isHot = item.trending;
    return /* html */ `
    <article class="n-trend-card" data-id="${item.id}" role="button" tabindex="0"
      aria-label="Read: ${esc(item.title)}">

      <!-- ── Card Image & Overlays ── -->
      <div class="n-trend-card__media">
        <img
          class="n-trend-card__img"
          src="${esc(img)}"
          alt="${esc(item.title)}"
          loading="lazy"
        />
        <div class="n-trend-card__overlay"></div>
        <span class="n-trend-card__badge">${esc(item.category)}</span>
        ${isHot ? `<span class="n-trend-card__hot" title="Trending">🔥</span>` : ""}
      </div>

      <!-- ── Card Text ── -->
      <div class="n-trend-card__body">
        <h3 class="n-trend-card__title">${esc(item.title)}</h3>
        <p  class="n-trend-card__desc">${esc(item.shortDesc)}</p>
      </div>

    </article>
  `;
}

/**
 * Build a VIDEO card (YouTube embed + text)
 * Used in the Video News section slider.
 */
function buildVideoCard(item) {
    return /* html */ `
    <article class="n-video-card" data-id="${item.id}">

      <!-- ── YouTube Embed Frame ── -->
      <div class="n-video-card__frame">
        <iframe
          src="${esc(item.youtubeEmbed)}"
          title="${esc(item.title)}"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
          loading="lazy"
        ></iframe>
      </div>

      <!-- ── Video Text ── -->
      <div class="n-video-card__body">
        <h3 class="n-video-card__title">${esc(item.title)}</h3>
        <p  class="n-video-card__desc">${esc(item.shortDesc)}</p>
      </div>

    </article>
  `;
}

/**
 * Build a STANDARD NEWS card (category sections + search results)
 * @param {boolean} [compact=false] — use compact image height for search grid
 */
function buildNewsCard(item, compact = false) {
    const img = item.image || placeholderImg(item.title, 560, 320);
    return /* html */ `
    <article class="n-news-card" data-id="${item.id}" role="button" tabindex="0"
      aria-label="Read: ${esc(item.title)}">

      <!-- ── Card Image ── -->
      <div class="n-news-card__media" ${compact ? 'style="height:140px;"' : ""}>
        <img
          class="n-news-card__img"
          src="${esc(img)}"
          alt="${esc(item.title)}"
          loading="lazy"
        />
        <span class="n-news-card__badge">${esc(item.category)}</span>
      </div>

      <!-- ── Card Text ── -->
      <div class="n-news-card__body">
        <h3 class="n-news-card__title">${esc(item.title)}</h3>
        <p  class="n-news-card__desc">${esc(item.shortDesc)}</p>
      </div>

    </article>
  `;
}

/**
 * Build the MODAL inner HTML for a given article item.
 */
function buildModalContent(item) {
    const img = item.image || placeholderImg(item.title, 1200, 600);
    return /* html */ `

    <!-- ── Cover Image + Controls ── -->
    <div class="n-modal__cover">
      <img class="n-modal__cover-img" src="${esc(img)}" alt="${esc(item.title)}" />
      <div class="n-modal__cover-gradient"></div>
      <span class="n-modal__category">${esc(item.category)}</span>
      <button class="n-modal__close" id="n-modal-close-btn" aria-label="Close article">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2.5">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6"  y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>

    <!-- ── Article Body ── -->
    <div class="n-modal__body">
      <h2 class="n-modal__title">${esc(item.title)}</h2>
      <div class="n-modal__divider"></div>
      <div class="n-modal__content">${item.content || "<p>No content available.</p>"}</div>

      <!-- ── Optional: YouTube embed inside modal ── -->
      ${item.youtubeEmbed
            ? /* html */ `
        <p class="n-modal__media-title">📺 Video Coverage</p>
        <div class="n-modal__media">
          <iframe
            src="${esc(item.youtubeEmbed)}"
            title="${esc(item.title)}"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
      `
            : ""
        }
    </div>
  `;
}

/** Empty-state HTML */
function buildEmptyState(msg = "No results found.") {
    return /* html */ `
    <div class="n-state">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="1.3">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      <p>${esc(msg)}</p>
    </div>
  `;
}

/** Particle HTML (randomly sized/positioned via inline style) */
function buildParticles(count = 18) {
    let html = "";
    for (let i = 0; i < count; i++) {
        const size = Math.random() * 5 + 2;
        const left = Math.random() * 100;
        const delay = Math.random() * 8;
        const dur = Math.random() * 8 + 6;
        const top = Math.random() * 100;
        html += `<div class="n-particle" style="
      width:${size}px;height:${size}px;
      left:${left}%;top:${top}%;
      animation-duration:${dur}s;
      animation-delay:${delay}s;
    "></div>`;
    }
    return html;
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION BUILDERS
// Each returns a complete section HTML string.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Build a horizontal slider section.
 * @param {string}   sectionId    - unique suffix used for DOM IDs
 * @param {string}   titleHtml    - the title's inner HTML (can include <span class="accent">)
 * @param {string[]} cardsHtml    - array of card HTML strings
 */
function buildSliderSection(sectionId, titleHtml, cardsHtml) {
    const sliderId = `n-slider-${sectionId}`;
    return /* html */ `
    <section class="n-section" id="section-${sectionId}">

      <!-- ── Section Header ── -->
      <div class="n-section__header">
        <h2 class="n-section__title">${titleHtml}</h2>
        <div class="n-slider-nav">
          <button class="n-slider-btn" data-dir="left"  data-target="${sliderId}"
            aria-label="Scroll left">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2.5">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <button class="n-slider-btn" data-dir="right" data-target="${sliderId}"
            aria-label="Scroll right">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2.5">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- ── Slider ── -->
      <div class="n-slider" id="${sliderId}">
        ${cardsHtml.join("")}
      </div>

    </section>
  `;
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE HTML TEMPLATE
// ─────────────────────────────────────────────────────────────────────────────

export function News() {
    // ── Derived data sets ──────────────────────────────────────────────────────

    /** Articles only (no videos) */
    const articles = newsData.filter((n) => n.type === "article");

    /** Trending articles */
    const trending = articles.filter((n) => n.trending);

    /** Videos */
    const videos = newsData.filter((n) => n.type === "video");

    /** Category helpers */
    const byCategory = (cat) => articles.filter((n) => n.category === cat);

    // ── Build slider sections ──────────────────────────────────────────────────

    const trendingSection = buildSliderSection(
        "trending",
        `<span class="accent">Trending</span> Now`,
        trending.map(buildTrendCard),
    );

    const videoSection = buildSliderSection(
        "videos",
        ` <span class="accent">Video</span> News`,
        videos.map(buildVideoCard),
    );

    const gamesSection = buildSliderSection(
        "games",
        ` <span class="accent">Gaming</span> News`,
        byCategory("Games").map(buildNewsCard),
    );

    const hardwareSection = buildSliderSection(
        "hardware",
        ` <span class="accent">Hardware</span> News`,
        byCategory("Hardware").map(buildNewsCard),
    );

    const esportsSection = buildSliderSection(
        "esports",
        ` <span class="accent">Esports</span> News`,
        byCategory("Esports").map(buildNewsCard),
    );

    const consolesSection = buildSliderSection(
        "consoles",
        ` <span class="accent">Console</span> News`,
        byCategory("Consoles").map(buildNewsCard),
    );

    const gearSection = buildSliderSection(
        "gear",
        `<span class="accent">Gaming Gear</span>`,
        byCategory("Gaming Gear").map(buildNewsCard),
    );

    return /* html */ `
    <div class="news-page">

      <!-- ════════════════════════════════════════
           HERO SECTION
           Edit: headline, subtitle, stat numbers
      ════════════════════════════════════════ -->
      <header class="n-hero">

        <!-- Floating animated particles (pure CSS) -->
        <div class="n-hero-particles" aria-hidden="true">
          ${buildParticles(22)}
        </div>

        <!-- Hero text content -->
        <p class="n-hero__eyebrow">JGamerz · Gaming Intelligence</p>

        <h1 class="n-hero__title">
          <span class="line1">Stay In</span>
          <span class="line2">The Game</span>
        </h1>

        <p class="n-hero__sub">
          Breaking news · Hardware drops · Esports results ·
          Reviews from the frontline of gaming.
        </p>

        <!-- Quick-glance stats -->
        <div class="n-hero__stats">
          <div class="n-hero__stat">
            <div class="n-hero__stat-val">2,400+</div>
            <div class="n-hero__stat-label">Articles</div>
          </div>
          <div class="n-hero__divider" aria-hidden="true"></div>
          <div class="n-hero__stat">
            <div class="n-hero__stat-val">8</div>
            <div class="n-hero__stat-label">Categories</div>
          </div>
          <div class="n-hero__divider" aria-hidden="true"></div>
          <div class="n-hero__stat">
            <div class="n-hero__stat-val">Daily</div>
            <div class="n-hero__stat-label">Updates</div>
          </div>
        </div>

      </header>


      <!-- ════════════════════════════════════════
           SEARCH + CATEGORY FILTER
           Edit: category options (must match
           category values used in newsData)
      ════════════════════════════════════════ -->
      <div class="n-controls" id="n-controls">

        <!-- Search input -->
        <div class="n-search-wrap">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            id="n-search-input"
            class="n-search"
            type="text"
            placeholder="Search news, hardware, esports…"
            autocomplete="off"
            aria-label="Search news"
          />
        </div>

        <!-- Category dropdown -->
        <select id="n-category-select" class="n-category-select" aria-label="Filter by category">
          <option value="">All News</option>
          <option value="Games">Games</option>
          <option value="Hardware">Hardware</option>
          <option value="Esports">Esports</option>
          <option value="Consoles">Consoles</option>
          <option value="Gaming Gear">Gaming Gear</option>
          <option value="Industry">Industry</option>
          <option value="Reviews">Reviews</option>
          <option value="Events">Events</option>
        </select>

        <!-- Result count -->
        <span class="n-results-count" id="n-results-count"></span>

      </div>


      <!-- ════════════════════════════════════════
           SEARCH / FILTER RESULTS PANEL
           Hidden by default. Shown when user
           types in search or picks a category.
      ════════════════════════════════════════ -->
      <div id="n-search-panel" style="display:none;">
        <div class="n-results-section">
          <div id="n-results-grid" class="n-results-grid"></div>
        </div>
      </div>


      <!-- ════════════════════════════════════════
           DEFAULT CONTENT PANELS
           Hidden when search/filter is active.
      ════════════════════════════════════════ -->
      <div id="n-default-content">

        <!-- Trending / Featured -->
        ${trendingSection}

        <!-- Video News -->
        ${videoSection}

        <!-- Gaming News -->
        ${gamesSection}

        <!-- Hardware News -->
        ${hardwareSection}

        <!-- Esports News -->
        ${esportsSection}

        <!-- Console News -->
        ${consolesSection}

        <!-- Gaming Gear -->
        ${gearSection}

      </div>


      <!-- ════════════════════════════════════════
           NEWS MODAL
           Populated dynamically when a card
           is clicked. Do not edit markup here —
           edit buildModalContent() above instead.
      ════════════════════════════════════════ -->
      <div id="n-modal-overlay" class="n-modal-overlay" role="dialog"
        aria-modal="true" aria-label="News article">
        <div id="n-modal" class="n-modal">
          <!-- Content injected by openModal() -->
        </div>
      </div>

    </div>
  `;
}

// ─────────────────────────────────────────────────────────────────────────────
// INIT
// Call this after News() HTML has been injected into the DOM.
// ─────────────────────────────────────────────────────────────────────────────

export function initNews() {
    // ── Element references ─────────────────────────────────────────────────────
    const searchInput = document.getElementById("n-search-input");
    const categorySelect = document.getElementById("n-category-select");
    const resultsCount = document.getElementById("n-results-count");
    const searchPanel = document.getElementById("n-search-panel");
    const defaultContent = document.getElementById("n-default-content");
    const resultsGrid = document.getElementById("n-results-grid");
    const modalOverlay = document.getElementById("n-modal-overlay");
    const modal = document.getElementById("n-modal");

    // ── SEARCH & FILTER ────────────────────────────────────────────────────────

    let searchQuery = "";
    let activeCategory = "";

    function applyFilter() {
        const q = searchQuery.toLowerCase().trim();
        const cat = activeCategory;

        if (!q && !cat) {
            // Show default content, hide search panel
            searchPanel.style.display = "none";
            defaultContent.style.display = "";
            resultsCount.textContent = "";
            return;
        }

        // Filter articles (articles only — videos are not text-searchable here)
        const filtered = newsData
            .filter((item) => item.type === "article")
            .filter((item) => {
                const matchesCat = !cat || item.category === cat;
                const matchesQ =
                    !q ||
                    item.title.toLowerCase().includes(q) ||
                    item.category.toLowerCase().includes(q) ||
                    item.shortDesc.toLowerCase().includes(q) ||
                    (item.content || "").toLowerCase().includes(q);
                return matchesCat && matchesQ;
            });

        // Switch to search results view
        searchPanel.style.display = "";
        defaultContent.style.display = "none";

        if (filtered.length === 0) {
            resultsGrid.innerHTML = buildEmptyState(
                "No articles matched your search.",
            );
            resultsCount.textContent = "0 results";
        } else {
            resultsGrid.innerHTML = filtered
                .map((item) => buildNewsCard(item, true))
                .join("");
            resultsCount.textContent = `${filtered.length} result${filtered.length !== 1 ? "s" : ""}`;
        }
    }

    // Debounced search
    let searchTimer;
    searchInput.addEventListener("input", (e) => {
        clearTimeout(searchTimer);
        searchQuery = e.target.value;
        searchTimer = setTimeout(applyFilter, 260);
    });

    // Instant category filter
    categorySelect.addEventListener("change", (e) => {
        activeCategory = e.target.value;
        applyFilter();
    });

    // ── SLIDER NAV BUTTONS ─────────────────────────────────────────────────────
    // Uses event delegation on the whole page — works for all sliders.

    document.addEventListener("click", (e) => {
        const btn = e.target.closest(".n-slider-btn");
        if (!btn) return;

        const sliderId = btn.dataset.target;
        const dir = btn.dataset.dir;
        const slider = document.getElementById(sliderId);
        if (!slider) return;

        const scrollAmount = 320;
        slider.scrollBy({
            left: dir === "right" ? scrollAmount : -scrollAmount,
            behavior: "smooth",
        });
    });

    // ── MODAL OPEN / CLOSE ──────────────────────────────────────────────────────

    function openModal(itemId) {
        const item = newsData.find((n) => n.id === itemId);
        if (!item) return;

        modal.innerHTML = buildModalContent(item);
        modalOverlay.classList.add("open");
        document.body.style.overflow = "hidden";
        modal.scrollTop = 0;

        // Wire close button (freshly rendered)
        const closeBtn = document.getElementById("n-modal-close-btn");
        if (closeBtn) {
            closeBtn.addEventListener("click", closeModal, { once: true });
        }
    }

    function closeModal() {
        modalOverlay.classList.remove("open");
        document.body.style.overflow = "";
        // Clear after transition so iframe stops playing
        setTimeout(() => {
            modal.innerHTML = "";
        }, 350);
    }

    // Close on backdrop click
    modalOverlay.addEventListener("click", (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    // Close on ESC
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeModal();
    });

    // ── CARD CLICK — OPEN MODAL ────────────────────────────────────────────────
    // Delegated on the whole page. Matches trend cards AND standard news cards.

    document.addEventListener("click", (e) => {
        const card = e.target.closest("[data-id]");
        if (!card) return;
        // Don't fire inside the modal itself or on video cards (iframe handles those)
        if (card.closest(".n-modal")) return;
        if (card.classList.contains("n-video-card")) return;

        const id = parseInt(card.dataset.id, 10);
        if (!isNaN(id)) openModal(id);
    });

    // Keyboard accessibility on cards
    document.addEventListener("keydown", (e) => {
        if (e.key !== "Enter" && e.key !== " ") return;
        const card = e.target.closest("[data-id]");
        if (!card) return;
        if (card.closest(".n-modal")) return;
        if (card.classList.contains("n-video-card")) return;
        e.preventDefault();
        const id = parseInt(card.dataset.id, 10);
        if (!isNaN(id)) openModal(id);
    });

    // ── CARD HOVER TILT EFFECT ─────────────────────────────────────────────────
    // Subtle 3-D tilt on article cards using pointer position.

    function addTiltListeners(selector) {
        document.querySelectorAll(selector).forEach((card) => {
            card.addEventListener("mousemove", (e) => {
                const rect = card.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                const dx = (e.clientX - cx) / (rect.width / 2);
                const dy = (e.clientY - cy) / (rect.height / 2);
                const rotX = -dy * 5;
                const rotY = dx * 5;
                card.style.transform = `translateY(-5px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.01)`;
            });

            card.addEventListener("mouseleave", () => {
                card.style.transform = "";
            });
        });
    }

    addTiltListeners(".n-trend-card");
    addTiltListeners(".n-news-card");
}
