// Diese Datei enthält ALLE anpassbaren Inhalte, Texte und Bild-Pfade.
// Sie ist getrennt von der Programmierlogik.

export type ProfileType = 'simple' | 'expert';

export interface TranslationResource {
  ui: {
    appTitle: string;
    stepIndicator: string;
    nextBtn: string;
    prevBtn: string;
    finishBtn: string;
    profileLabel: string;
  };
  steps: {
    title: string;
    description: string;
  }[];
  mapStyles: Record<string, { name: string; description: string }>;
  areas: {
    tabLocation: string;
    tabSearch: string;
    tabSelection: string;
    subTabFavorites: string;
    subTabAdmin: string;
    locationBtnStart: string;
    locationBtnConfirm: string;
    locationDesc: string;
    locationError: string;
    showDetails: string;
    hideDetails: string;
    searchPlaceholder: string;
    searchResultLabel: string;
    manualSelectionTitle: string;
    spatialLevelLabel?: string;
    orLabel?: string; 
  };
  viewModes: Record<string, { name: string; description: string }>;
  landmarks: {
    title: string;
    expertTitle?: string;
    subTabVisual: string;
    subTabCatalog: string;
    items: Record<string, string>;
  };
  visuals: {
    title: string;
    options: Record<string, { name: string; description: string }>;
    photoWarning: string;
  };
  audio: {
    title: string;
    btnTitle: string;
    btnDesc: string;
  };
  summary: {
    title: string;
    intro: string;
    labels: { location: string; style: string; view: string; orientation: string; visual: string; audio: string; };
    values: { pointsSelected: string; noPoints: string; active: string; inactive: string; };
  };
}

// --- DATEN-KONFIGURATION (Integriert) ---

export const DATA_CONFIG = {
  defaultAreaTab: 'selection',
  previewExampleLandmarkId: 'church', 

  geocoder: {
    searchUrl: 'https://geocoder.fbg-hsbo.de/nominatim/search',
    reverseUrl: 'https://geocoder.fbg-hsbo.de/nominatim/reverse',
    limit: 5, 
    debounceMs: 600
  },

  assets: {
    locationMapPlaceholder: 'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?auto=format&fit=crop&q=80&w=600',
    visualPreviewPhoto: 'assets/sankt_bonifacius.jpg'
  },

  icons: {
    searchResultPlace: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z',
    searchResultBuilding: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    searchResultGeneric: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z',
    tabLocation: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z',
    tabSearch: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
    tabList: 'M4 6h16M4 12h16M4 18h16'
  },

  mapStyles: [
    { id: 'osm', image: 'assets/farbkarte.png' },
    { id: 'grey', image: 'assets/graukarte.png' },
    { id: 'ortho', image: 'assets/luftbildkarte.png' }
  ],

  simplePlaces: [
    { name: 'KIZ Herne', image: 'assets/KIZ_herne.png' },
    { name: 'Emma the Mu', image: 'assets/emma_the_muh.png' }
  ],

  expertSpatialUnits: [
    { 
      id: 'bezirke', 
      name: 'Stadtbezirke', 
      features: ['Bezirk Eickel', 'Bezirk Herne-Mitte', 'Bezirk Sodingen', 'Bezirk Wanne'] 
    },
    { 
      id: 'stadtteile', 
      name: 'Stadtteile', 
      features: ['Baukau', 'Baukau-Ost', 'Eickel', 'Herne-Mitte', 'Holsterhausen', 'Horsthausen', 'Röhlinghausen', 'Sodingen', 'Unser Fritz', 'Wanne'] 
    }
  ],

  viewModeImages: {
    twodimensional: 'assets/viewmode-2d.png',
    twoandhalfdimensional: 'assets/viewmode-2.5d.png',
    threedimensional: 'assets/viewmode-3d.png'
  },

  landmarks: {
    bank: { 
      image: 'assets/metacom/bank2.jpeg', 
      icon: 'M3 21h18M5 21v-8M9 21v-8M13 21v-8M17 21v-8M3 10h18M5 6l7-3 7 3M4 10h16v11H4V10z' 
    },
    pharmacy: { 
      image: 'assets/metacom/apotheke.jpg', 
      icon: 'M12 2v20M2 12h20M9 9h6v6H9z' 
    },
    stops: { 
      image: 'assets/metacom/haltestelle.jpeg', 
      icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' 
    },
    church: { 
      image: 'assets/metacom/kirche2.png', 
      icon: 'M12 3v18M8 8h8M12 3l-4 4h8l-4-4' 
    },
    restaurant: { 
      image: 'assets/metacom/restaurant2orange.jpeg', 
      icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' 
    },
    icecream: { 
      image: 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?auto=format&fit=crop&q=80&w=400', 
      icon: 'M12 22l-6-9.5c0-3.5 2.5-6.5 6-6.5s6 3 6 6.5L12 22z M12 6a3 3 0 100-6 3 3 0 000 6z' 
    },
    meeting: { 
      image: 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?auto=format&fit=crop&q=80&w=400', 
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' 
    }
  },

  expertLandmarkResources: [
    { 
      category: 'Bildung & Soziales', 
      resources: [
         { id: 'schulen', name: 'Schulen', description: 'Primar- und Sekundarstufe' },
         { id: 'kitas', name: 'Kitas', description: 'Kindertagesstätten' },
         { id: 'jugend', name: 'Jugendfreizeit', description: 'Angebote für Jugendliche' }
      ]
    },
    { 
      category: 'Gesundheit', 
      resources: [
         { id: 'pharmacy', name: 'Apotheken', description: 'Standorte im Stadtgebiet' },
         { id: 'doctors', name: 'Ärzte', description: 'Niedergelassene Ärzte' }
      ]
    },
    {
      category: 'Verkehr',
      resources: [
         { id: 'stops', name: 'Haltestellen', description: 'ÖPNV Netz' },
         { id: 'charging', name: 'Ladesäulen', description: 'E-Mobilität' }
      ]
    }
  ]
};

export const TEXTS: Record<ProfileType, TranslationResource> = {
  simple: {
    ui: {
      appTitle: 'Meine Karte',
      stepIndicator: 'Schritt',
      nextBtn: 'Weiter',
      prevBtn: 'Zurück',
      finishBtn: 'Karte starten',
      profileLabel: 'Modus: Einfach',
    },
    steps: [
      { title: 'Farben wählen', description: '' },
      { title: 'Ort wählen', description: '' },
      { title: 'Ansicht', description: '' },
      { title: 'Wichtige Orte', description: '' },
      { title: 'Aussehen', description: '' },
      { title: 'Fertig!', description: '' },
    ],
    mapStyles: {
      osm: { name: 'Bunt', description: '' },
      grey: { name: 'Grau', description: '' },
      ortho: { name: 'Luftbild', description: '' },
    },
    areas: {
      tabLocation: 'Standort',
      tabSelection: 'Beliebte Orte',
      tabSearch: 'Suche',
      subTabFavorites: 'Favoriten',
      subTabAdmin: 'Liste',
      locationBtnStart: 'Standort ermitteln',
      locationBtnConfirm: 'Diesen Standort nehmen',
      locationDesc: 'Wir suchen automatisch, wo du bist.',
      locationError: 'Standort konnte nicht gefunden werden.',
      showDetails: 'Karte anzeigen',
      hideDetails: 'Karte ausblenden',
      searchPlaceholder: 'Adresse eingeben...',
      searchResultLabel: 'Gefunden:',
      manualSelectionTitle: 'Beliebte Orte',
    },
    viewModes: {
      'twodimensional': { name: 'Von oben', description: '' },
      'twoandhalfdimensional': { name: 'Von oben mit Gebäuden', description: '' },
      'threedimensional': { name: 'Schrägansicht', description: '' },
    },
    landmarks: {
      title: 'Was ist wichtig?',
      expertTitle: '',
      subTabVisual: 'Bilder',
      subTabCatalog: 'Liste',
      items: {
        bank: 'Bank', pharmacy: 'Apotheke', stops: 'Bus & Bahn',
        church: 'Kirche', restaurant: 'Restaurant', icecream: 'Eis', meeting: 'Treffpunkt'
      }
    },
    visuals: {
      title: 'Wie sollen Orte aussehen?',
      options: {
        symbols: { name: 'Nur Bild', description: 'Ein einfaches Symbol auf der Karte.' },
        symbols_labels: { name: 'Bild & Text', description: 'Das Symbol und der Name stehen dabei.' },
        photos: { name: 'Echte Fotos', description: 'Wie es in Wirklichkeit aussieht.' },
      },
      photoWarning: 'Achtung: Nicht überall gibt es Fotos.',
    },
    audio: {
      title: 'Hilfe',
      btnTitle: 'Vorlesen',
      btnDesc: 'Text hören beim Antippen.',
    },
    summary: {
      title: 'Fertig',
      intro: 'Deine Einstellungen:',
      labels: {
        location: 'Wo:', style: 'Farbe:', view: 'Ansicht:', orientation: 'Orte:', visual: 'Symbole:', audio: 'Ton:',
      },
      values: {
        pointsSelected: 'gewählt', noPoints: 'keine', active: 'An', inactive: 'Aus',
      },
    },
  },
  expert: {
    ui: {
      appTitle: 'KomMonitor Bürger-Assistent',
      stepIndicator: 'Konfiguration',
      nextBtn: 'Nächster Schritt',
      prevBtn: 'Zurück',
      finishBtn: 'Anwendung starten',
      profileLabel: 'Modus: Experte',
    },
    steps: [
      { title: 'Basiskarte', description: 'Wählen Sie die Datengrundlage.' },
      { title: 'Raumbezug', description: 'Definieren Sie den Fokusbereich.' },
      { title: 'Perspektive', description: 'Bestimmen Sie den Detaillierungsgrad.' },
      { title: 'POI-Layer', description: 'Wählen Sie thematische Layer.' },
      { title: 'Visualisierung', description: 'Konfigurieren Sie die Darstellung.' },
      { title: 'Zusammenfassung', description: 'Prüfung der Konfiguration.' },
    ],
    mapStyles: {
      osm: { name: 'Stadtplan (OSM)', description: 'Standardansicht mit hoher Detaildichte.' },
      grey: { name: 'Graustufenkarte', description: 'Dezenter Plan, Fokus auf Fachdaten.' },
      ortho: { name: 'Orthophoto', description: 'Luftbildaufnahmen.' },
    },
    areas: {
      tabLocation: 'Standort (GPS)',
      tabSelection: 'Raumeinheiten',
      tabSearch: 'Adresssuche',
      subTabFavorites: 'Favoriten / POIs',
      subTabAdmin: 'Verwaltungseinheiten',
      locationBtnStart: 'Standortbestimmung starten',
      locationBtnConfirm: 'Aktuelle Position verwenden',
      locationDesc: 'Standort wird via Geolocation API ermittelt.',
      locationError: 'Zugriff verweigert oder Dienst nicht verfügbar.',
      showDetails: 'Details & Karte einblenden',
      hideDetails: 'Details ausblenden',
      searchPlaceholder: 'Suche nach Adresse oder POI...',
      searchResultLabel: 'Ergebnisse aus Nominatim:',
      manualSelectionTitle: 'Raumeinheit wählen',
      spatialLevelLabel: 'Raumebene wählen:',
    },
    viewModes: {
      'twodimensional': { name: '2D Karte', description: 'Klassische Draufsicht.' },
      'twoandhalfdimensional': { name: '2.5D Gebäude', description: 'Extrudierte Gebäudekörper.' },
      'threedimensional': { name: '3D Umgebung', description: 'Freie 3D-Navigation.' },
    },
    landmarks: {
      title: 'Kategorien',
      expertTitle: 'Fachdaten & POIs',
      subTabVisual: 'Visuelle Auswahl',
      subTabCatalog: 'KomMonitor Datenkatalog',
      items: {
        bank: 'Finanzwesen', pharmacy: 'Gesundheit', stops: 'Mobilität',
        church: 'Kultur', restaurant: 'Restaurant', icecream: 'Gastronomie', meeting: 'Soziales'
      }
    },
    visuals: {
      title: 'Darstellungsart',
      options: {
        symbols: { name: 'Piktogramme', description: 'Symbolhafte Darstellung.' },
        symbols_labels: { name: 'Piktogramme + Label', description: 'Symbol mit Beschriftung.' },
        photos: { name: 'Fotorealistisch', description: 'Objektfotos (falls vorhanden).' },
      },
      photoWarning: 'Fallback auf Symbole bei fehlenden Bilddaten.',
    },
    audio: {
      title: 'Barrierefreiheit',
      btnTitle: 'Text-to-Speech',
      btnDesc: 'Audio-Feedback bei Interaktion.',
    },
    summary: {
      title: 'Abschluss',
      intro: 'Gewählte Parameter:',
      labels: {
        location: 'Gebiet:', style: 'Karte:', view: 'Ansicht:', orientation: 'Layer:', visual: 'Stil:', audio: 'Audio:',
      },
      values: {
        pointsSelected: 'aktiv', noPoints: '-', active: 'Ja', inactive: 'Nein',
      },
    },
  }
};