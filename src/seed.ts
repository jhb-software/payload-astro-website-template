import { getPayload } from "payload";

import config from "@payload-config";
import type { Locale } from "@/lib/preview";

const pageContent = {
  nl: [
    [
      "home",
      "Home",
      "home",
      "Welkom bij De Fryhof",
      "Een sfeervolle groepsaccommodatie in het hart van Friesland.",
    ],
    [
      "accommodation",
      "Accommodatie",
      "accommodatie",
      "Samen genieten",
      "Alle ruimte en voorzieningen voor een ontspannen verblijf.",
    ],
    [
      "rooms",
      "Kamers",
      "kamers",
      "Onze kamers",
      "Zeven comfortabele kamers voor een goede nachtrust.",
    ],
    [
      "business",
      "Zakelijke bijeenkomsten",
      "zakelijk",
      "Zakelijk samenkomen",
      "Een inspirerende plek voor teams en bijeenkomsten.",
    ],
    [
      "surroundings",
      "Omgeving",
      "omgeving",
      "Ontdek de omgeving",
      "Water, natuur en Friese dorpen liggen binnen handbereik.",
    ],
    [
      "availability",
      "Beschikbaarheid",
      "beschikbaarheid",
      "Beschikbaarheid",
      "Bekijk de actuele beschikbaarheid bij onze boekingspartner.",
    ],
    [
      "aboutContact",
      "Over ons en contact",
      "contact",
      "Neem contact op",
      "We helpen graag bij het plannen van jullie verblijf.",
    ],
    [
      "privacy",
      "Privacy",
      "privacy",
      "Privacy",
      "Lees hoe De Fryhof zorgvuldig met persoonsgegevens omgaat.",
    ],
  ],
  en: [
    [
      "home",
      "Home",
      "home",
      "Welcome to De Fryhof",
      "An inviting group accommodation in the heart of Friesland.",
    ],
    [
      "accommodation",
      "Accommodation",
      "accommodation",
      "Enjoy time together",
      "Space and amenities for a relaxing stay.",
    ],
    ["rooms", "Rooms", "rooms", "Our rooms", "Seven comfortable rooms for a restful night."],
    [
      "business",
      "Business meetings",
      "business",
      "Meet with focus",
      "An inspiring place for teams and meetings.",
    ],
    [
      "surroundings",
      "Surroundings",
      "surroundings",
      "Explore the area",
      "Water, nature and Frisian villages are close by.",
    ],
    [
      "availability",
      "Availability",
      "availability",
      "Availability",
      "View current availability with our booking partner.",
    ],
    [
      "aboutContact",
      "About and contact",
      "contact",
      "Get in touch",
      "We are happy to help plan your stay.",
    ],
    [
      "privacy",
      "Privacy",
      "privacy",
      "Privacy",
      "Read how De Fryhof handles personal data with care.",
    ],
  ],
  de: [
    [
      "home",
      "Start",
      "home",
      "Willkommen bei De Fryhof",
      "Eine stimmungsvolle Gruppenunterkunft im Herzen Frieslands.",
    ],
    [
      "accommodation",
      "Unterkunft",
      "unterkunft",
      "Gemeinsam genießen",
      "Viel Platz und Komfort für einen entspannten Aufenthalt.",
    ],
    [
      "rooms",
      "Zimmer",
      "zimmer",
      "Unsere Zimmer",
      "Sieben komfortable Zimmer für eine erholsame Nacht.",
    ],
    [
      "business",
      "Geschäftliche Treffen",
      "tagungen",
      "Konzentriert tagen",
      "Ein inspirierender Ort für Teams und Tagungen.",
    ],
    [
      "surroundings",
      "Umgebung",
      "umgebung",
      "Die Umgebung entdecken",
      "Wasser, Natur und friesische Dörfer liegen ganz in der Nähe.",
    ],
    [
      "availability",
      "Verfügbarkeit",
      "verfuegbarkeit",
      "Verfügbarkeit",
      "Aktuelle Verfügbarkeit bei unserem Buchungspartner ansehen.",
    ],
    [
      "aboutContact",
      "Über uns und Kontakt",
      "kontakt",
      "Kontakt aufnehmen",
      "Wir helfen gerne bei der Planung Ihres Aufenthalts.",
    ],
    [
      "privacy",
      "Datenschutz",
      "datenschutz",
      "Datenschutz",
      "Lesen Sie, wie De Fryhof sorgfältig mit personenbezogenen Daten umgeht.",
    ],
  ],
} as const;

const accommodationFeatures = {
  nl: [
    "Woonkamer en keuken",
    "Zwembad",
    "Hottub, sauna en gym",
    "Bioscoop",
    "Vuurplaats en BBQ",
    "Parkeren, wifi en extra’s",
  ],
  en: [
    "Living room and kitchen",
    "Pool",
    "Hot tub, sauna and gym",
    "Cinema",
    "Firepit and BBQ",
    "Parking, Wi-Fi and extras",
  ],
  de: [
    "Wohnzimmer und Küche",
    "Pool",
    "Whirlpool, Sauna und Fitness",
    "Kino",
    "Feuerstelle und Grill",
    "Parken, WLAN und Extras",
  ],
};

const paragraph = (text: string) => ({
  root: {
    type: "root",
    children: [{ type: "paragraph", version: 1, children: [{ type: "text", text, version: 1 }] }],
    direction: null,
    format: "" as const,
    indent: 0,
    version: 1,
  },
});

async function seed() {
  const payload = await getPayload({ config });
  const pageIDs = new Map<string, number>();

  for (const [pageType, title, slug, heading, text] of pageContent.nl) {
    const existing = await payload.find({
      collection: "pages",
      limit: 1,
      where: { pageType: { equals: pageType } },
    });
    let id = existing.docs[0]?.id;
    if (!id) {
      const layout =
        pageType === "rooms"
          ? [
              { blockType: "hero" as const, heading, text, primaryLink: {} },
              { blockType: "roomList" as const, heading: "De zeven kamers" },
            ]
          : pageType === "accommodation"
            ? [
                { blockType: "hero" as const, heading, text, primaryLink: {} },
                {
                  blockType: "featureGrid" as const,
                  features: accommodationFeatures.nl.map((item) => ({ title: item })),
                },
              ]
            : [{ blockType: "hero" as const, heading, text, primaryLink: {} }];
      const page = await payload.create({
        collection: "pages",
        locale: "nl",
        data: {
          title,
          slug,
          pageType,
          layout,
          seo: { title, description: text },
          _status: "published",
        },
      });
      id = page.id;
      for (const locale of ["en", "de"] as Locale[]) {
        const translation = pageContent[locale].find(([type]) => type === pageType)!;
        const [, localTitle, localSlug, localHeading, localText] = translation;
        const localLayout =
          pageType === "rooms"
            ? [
                {
                  blockType: "hero" as const,
                  heading: localHeading,
                  text: localText,
                  primaryLink: {},
                },
                {
                  blockType: "roomList" as const,
                  heading: locale === "de" ? "Die sieben Zimmer" : "The seven rooms",
                },
              ]
            : pageType === "accommodation"
              ? [
                  {
                    blockType: "hero" as const,
                    heading: localHeading,
                    text: localText,
                    primaryLink: {},
                  },
                  {
                    blockType: "featureGrid" as const,
                    features: accommodationFeatures[locale].map((item) => ({ title: item })),
                  },
                ]
              : [
                  {
                    blockType: "hero" as const,
                    heading: localHeading,
                    text: localText,
                    primaryLink: {},
                  },
                ];
        await payload.update({
          collection: "pages",
          id,
          locale,
          data: {
            title: localTitle,
            slug: localSlug,
            layout: localLayout,
            seo: { title: localTitle, description: localText },
          },
        });
      }
    }
    pageIDs.set(pageType, id);
  }

  for (let sortOrder = 1; sortOrder <= 7; sortOrder++) {
    const existing = await payload.find({
      collection: "rooms",
      limit: 1,
      where: { sortOrder: { equals: sortOrder } },
    });
    if (existing.docs.length) continue;
    const room = await payload.create({
      collection: "rooms",
      locale: "nl",
      data: {
        name: `Kamer ${sortOrder}`,
        slug: `kamer-${sortOrder}`,
        summary: "Een comfortabele kamer met een rustige, warme sfeer.",
        description: paragraph(
          "Elke kamer heeft een eigen karakter en biedt alles voor een comfortabele overnachting.",
        ),
        capacity: sortOrder < 6 ? 2 : 3,
        bedType: "Comfortabele boxspringbedden",
        features: [{ item: "Bedlinnen inbegrepen" }, { item: "Handdoeken inbegrepen" }],
        sortOrder,
        _status: "published",
      },
    });
    await payload.update({
      collection: "rooms",
      id: room.id,
      locale: "en",
      data: {
        name: `Room ${sortOrder}`,
        slug: `room-${sortOrder}`,
        summary: "A comfortable room with a calm, warm atmosphere.",
        description: paragraph(
          "Each room has its own character and everything needed for a comfortable night.",
        ),
        bedType: "Comfortable box-spring beds",
        features: [{ item: "Bed linen included" }, { item: "Towels included" }],
      },
    });
    await payload.update({
      collection: "rooms",
      id: room.id,
      locale: "de",
      data: {
        name: `Zimmer ${sortOrder}`,
        slug: `zimmer-${sortOrder}`,
        summary: "Ein komfortables Zimmer mit ruhiger, warmer Atmosphäre.",
        description: paragraph(
          "Jedes Zimmer hat seinen eigenen Charakter und bietet alles für eine angenehme Nacht.",
        ),
        bedType: "Komfortable Boxspringbetten",
        features: [{ item: "Bettwäsche inklusive" }, { item: "Handtücher inklusive" }],
      },
    });
  }

  const navTypes = [
    "home",
    "accommodation",
    "rooms",
    "business",
    "surroundings",
    "availability",
    "aboutContact",
  ];
  for (const locale of ["nl", "en", "de"] as Locale[]) {
    const labels = Object.fromEntries(pageContent[locale].map(([type, title]) => [type, title]));
    await payload.updateGlobal({
      slug: "siteSettings",
      locale,
      data: {
        siteName: "De Fryhof",
        defaultSeo: { title: "De Fryhof", description: pageContent[locale][0][4] },
        navigation: navTypes.map((type) => ({ label: labels[type], page: pageIDs.get(type)! })),
        footerNavigation: ["aboutContact", "privacy"].map((type) => ({
          label: labels[type],
          page: pageIDs.get(type)!,
        })),
      },
    });
  }

  payload.logger.info("Seeded fixed pages, seven rooms, and site navigation.");
}

await seed();
