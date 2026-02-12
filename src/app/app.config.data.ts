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
    confirmSelectionLabel: string;
    confirmSelectionDesc: string;
    selectionAdded: string;
    selectionRemoved: string;
    notAvailableBadge: string;
    notAvailableError: string;
    stepIndicatorSeparator: string;
    locationFound: string;
    coordinatesFound: string;
    ttsEnabledFeedback: string;
    ttsGreeting: string;
    companionLabel: string;
    voiceTestLabel: string;
    changeLabel: string;
    startAppBtn: string;
    audioConfirmOn: string;
    nextStepLabel: string;
    prevStepLabel: string;
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
  viewModes: Record<string, { name: string; description: string; disabled?: boolean; disabledText?: string }>;
  landmarks: {
    title: string;
    instruction: string;
    expertTitle?: string;
    subTabVisual: string;
    subTabCatalog: string;
    items: Record<string, string>;
    selectAll: string;
    deselectAll: string;
    itemsSelectedSuffix: string;
    categorySelectFeedback: string;
    categoryDeselectFeedback: string;
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
  externalAppUrl: "https://kommonitor.fbg-hsbo.de/#!/",
  // externalAppUrl: "http://localhost:8000/#!/",
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
    { id: 'color', image: 'assets/farbkarte.png', ttsText: 'Farbige Hintergrundkarte' },
    { id: 'grey', image: 'assets/graukarte.png', ttsText: 'Graue Hintergrundkarte' },
    { id: 'ortho', image: 'assets/luftbildkarte.png', ttsText: 'Luftbild Hintegrundkarte' }
  ],

  simplePlaces: [
    { name: 'KIZ Herne', image: 'assets/KIZ_herne.png', lat: 51.538957, lon: 7.221126, ttsText: 'KIZ Herne' },
    { name: 'Emma the Mu', image: 'assets/emma_the_muh.png' , lat: 51.539047, lon: 7.222529, ttsText: 'Eisdiele mit dem Namen Emma the Mu'}
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
      icon: 'M3 21h18M5 21v-8M9 21v-8M13 21v-8M17 21v-8M3 10h18M5 6l7-3 7 3M4 10h16v11H4V10z',
      ttsText: 'Bank oder Geldautomat'
    },
    pharmacy: { 
      image: 'assets/metacom/apotheke.jpg', 
      icon: 'M12 2v20M2 12h20M9 9h6v6H9z',
      ttsText: 'Apotheke'
    },
    stops: { 
      image: 'assets/metacom/haltestelle.jpeg', 
      icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4',
      ttsText: 'Haltestelle für Bus und Bahn'
    },
    church: { 
      image: 'assets/metacom/kirche2.png', 
      icon: 'M12 3v18M8 8h8M12 3l-4 4h8l-4-4',
      ttsText: 'Kirche'
    },
    restaurant: { 
      image: 'assets/metacom/restaurant2orange.jpeg', 
      icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',
      ttsText: 'Restaurant oder Gaststätte'
    },
    icecream: { 
      image: 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?auto=format&fit=crop&q=80&w=400', 
      icon: 'M12 22l-6-9.5c0-3.5 2.5-6.5 6-6.5s6 3 6 6.5L12 22z M12 6a3 3 0 100-6 3 3 0 000 6z',
      ttsText: 'Eisdiele'
    },
    meeting: { 
      image: 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?auto=format&fit=crop&q=80&w=400', 
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
      ttsText: 'Treffpunkt'
    },
    bakery: { image: 'assets/metacom/schule_inklusion2.jpeg', icon: 'M12 2L2 7l10 5 10-5-10-5z', ttsText: 'Bäckerei' },
    supermarket: { image: 'assets/metacom/bank2.jpeg', icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z', ttsText: 'Supermarkt' },
    cinema: { image: 'assets/metacom/kino.jpeg', icon: 'M7 4v16M17 4v16M3 8h4m10 0h4M3 12h4m10 0h4M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z', ttsText: 'Kino' },
    library: { image: 'assets/metacom/schule_inklusion2.jpeg', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', ttsText: 'Bücherei' },
    cafe: { image: 'assets/metacom/restaurant2orange.jpeg', icon: 'M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z', ttsText: 'Café' },
    pool: { image: 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?auto=format&fit=crop&q=80&w=400', icon: 'M2 6c.667-.333 1.333-.5 2-.5 1 0 2 .5 3 1.5s2 1.5 3 1.5 2-.5 3-1.5 2-1.5 3-1.5 1.333.167 2 .5', ttsText: 'Schwimmbad' },
    subway: { image: 'assets/metacom/bahnhof.jpeg', icon: 'M12 2v20M2 12h20M9 9h6v6H9z', ttsText: 'U-Bahn' },
    parking: { image: 'assets/metacom/parkplatz2.jpeg', icon: 'M12 2L2 7l10 5 10-5-10-5z', ttsText: 'Parkplatz' }
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
         { id: 'parking', name: 'Ladesäulen', description: 'E-Mobilität' }
      ]
    }
  ],

  simpleLandmarkCategories: [
    {
      id: 'cat_shopping',
      name: 'Einkaufen',
      icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z',
      items: ['pharmacy', 'bakery', 'supermarket'],
      ttsText: 'Dinge zum Einkaufen'
    },
    {
      id: 'cat_leisure',
      name: 'Freizeit',
      icon: 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      items: ['cinema', 'restaurant', 'library', 'cafe', 'icecream', 'pool'],
      ttsText: 'Dinge für die Freizeit'
    },
    {
      id: 'cat_traffic',
      name: 'Verkehr',
      icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4',
      items: ['stops', 'subway', 'parking'],
      ttsText: 'Dinge für den Verkehr'
    },
    {
      id: 'cat_culture',
      name: 'Kultur & Soziales',
      icon: 'M12 21v-82q90-26 145-100t55-167q0-93-55-167T560-747v-82q123 28 201.5 125.5T840-480q0 127-78.5 224.5T560-131ZM120-360v-240h160l200-200v640L280-360H120Zm440 40v-320q47 15 73.5 56.5T660-480q0 47-26.5 88.5T560-320ZM400-606l-86 86H200v80h114l86 86v-252ZM300-480Z',
      items: ['church', 'meeting'],
      ttsText: 'Dinge für Kultur und Soziales'
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
      finishBtn: 'zu deiner Karte',
      profileLabel: 'Modus: Einfach',
      confirmSelectionLabel: 'Auswahl bestätigen',
      confirmSelectionDesc: 'Die App sagt dir, was du angeklickt hast.',
      selectionAdded: 'Du hast ausgewählt:',
      selectionRemoved: 'Du hast abgewählt:',
      notAvailableBadge: 'Nicht möglich',
      notAvailableError: 'Diese Option ist nicht verfügbar.',
      stepIndicatorSeparator: 'von',
      locationFound: 'Standort gefunden!',
      coordinatesFound: 'Koordinaten gefunden',
      ttsEnabledFeedback: 'Die Vorlesefunktion ist jetzt eingeschaltet.',
      ttsGreeting: 'Hallo! Ich bin dein Begleiter und helfe dir bei deiner Karte. Gefällt dir meine Stimme?',
      companionLabel: 'Wähle deinen Begleiter:',
      voiceTestLabel: 'Stimme wurde gewechselt.',
      changeLabel: '(hier klicken zum Ändern)',
      startAppBtn: "Alles fertig. Los geht's!",
      audioConfirmOn: 'eingeschaltet.',
      nextStepLabel: 'Nächster Schritt:',
      prevStepLabel: 'Zurück zu:',
    },
    steps: [
      { title: 'Welchen Ort möchtest du sehen?', description: 'Wähle einen Ort aus der Liste oder suche nach einem bestimmten Ort.' },
      { title: 'Wie soll deine Karte aussehen?', description: 'Wähle einen Hintergrund aus den verfügbaren Karten.' },
      { title: 'Möchtest du Gebäude in der Karte anzeigen?', description: 'Wenn ja, werden Gebäude in der Karte angezeigt.' },
      { title: 'Wonach suchst du in der Karte?', description: 'Wähle aus, nach welchen Orten du suchst.' },
      { title: 'Wie sollen besondere Orte aussehen?', description: 'Wähle aus, wie besondere Orte in der Karte dargestellt werden sollen.' },
      { title: 'Super! Deine Karte ist bereit!', description: 'Das hast du toll gemacht. Hier kannst du deine Karte aufrufen.' },
    ],
    mapStyles: {
      color: { name: 'Bunt', description: 'Hintergrundkarte mit Farben' },
      grey: { name: 'Grau', description: 'Hintergrundkarte in Grautönen' },
      ortho: { name: 'Luftbild', description: 'Luftbild mit realistischer Darstellung' },
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
      'twodimensional': { name: 'Von oben ohne Gebäude', description: '', disabled: false },
      'twoandhalfdimensional': { name: 'Von oben mit Gebäuden', description: '', disabled: false },
      'threedimensional': { name: 'Schrägansicht mit Gebäuden', description: '', disabled: true, disabledText: 'Das geht leider gerade nicht.' },
    },
    landmarks: {
      title: 'Wonach suchst du in der Karte?',
      instruction: 'Hier kannst du Orte auswählen, die für dich wichtig sind. Diese werden dann als Symbole auf der Karte angezeigt.',
      expertTitle: '',
      subTabVisual: 'Bilder',
      subTabCatalog: 'Liste',
      items: {
        bank: 'Bank', pharmacy: 'Apotheke', stops: 'Bus & Bahn',
        church: 'Kirche', restaurant: 'Restaurant', icecream: 'Eis', meeting: 'Treffpunkt',
        bakery: 'Bäckerei', supermarket: 'Supermarkt', cinema: 'Kino', library: 'Bücherei',
        cafe: 'Café', pool: 'Schwimmbad', subway: 'U-Bahn', parking: 'Parkplatz'
      },
      selectAll: 'Alle auswählen',
      deselectAll: 'Alle abwählen',
      itemsSelectedSuffix: 'ausgewählt',
      categorySelectFeedback: 'Alle Orte ausgewählt in der Gruppe:',
      categoryDeselectFeedback: 'Alle Orte abgewählt in der Gruppe:',
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
      confirmSelectionLabel: 'Selektion akustisch bestätigen',
      confirmSelectionDesc: 'Gibt eine kurze Rückmeldung bei Auswahl eines Elements.',
      selectionAdded: 'Auswahl bestätigt:',
      selectionRemoved: 'Abgewählt:',
      notAvailableBadge: 'Nicht verfügbar',
      notAvailableError: 'Diese Option wird derzeit nicht unterstützt.',
      stepIndicatorSeparator: '/',
      locationFound: 'Standort ermittelt!',
      coordinatesFound: 'Koordinaten extrahiert',
      ttsEnabledFeedback: 'Vorlesefunktion aktiviert.',
      ttsGreeting: 'Guten Tag. Ich begleite Sie bei der Konfiguration der Anwendung. Ist diese Stimme für Sie angenehm?',
      companionLabel: 'Begleiter-Profil wählen:',
      voiceTestLabel: 'Stimme angepasst.',
      changeLabel: '(Klicken zum Ändern)',
      startAppBtn: 'Konfiguration abschließen',
      audioConfirmOn: 'aktiviert.',
      nextStepLabel: 'Nächster Schritt:',
      prevStepLabel: 'Vorheriger Schritt:',
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
      color: { name: 'Stadtplan als Farbkarte', description: 'Standardansicht mit hoher Detaildichte.' },
      grey: { name: 'Stadtplan als Graustufenkarte', description: 'Dezenter Plan, Fokus auf Fachdaten.' },
      ortho: { name: 'Orthophoto - Satellitenbild', description: 'Luftbildaufnahmen.' },
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
      'twodimensional': { name: '2D Karte', description: 'Klassische Draufsicht.', disabled: false },
      'twoandhalfdimensional': { name: '2.5D Gebäude', description: 'Extrudierte Gebäudekörper.', disabled: false },
      'threedimensional': { name: '3D Umgebung', description: 'Freie 3D-Navigation.', disabled: true, disabledText: 'Diese Option wird von der Zielanwendung derzeit nicht unterstützt.' },
    },
    landmarks: {
      title: 'Kategorien',
      instruction: 'Wählen Sie thematische POI-Layer aus, die als Orientierungspunkte in der Karte dienen sollen.',
      expertTitle: 'Fachdaten & POIs',
      subTabVisual: 'Visuelle Auswahl',
      subTabCatalog: 'KomMonitor Datenkatalog',
      items: {
        bank: 'Finanzwesen', pharmacy: 'Gesundheit', stops: 'Mobilität',
        church: 'Kultur', restaurant: 'Restaurant', icecream: 'Gastronomie', meeting: 'Soziales',
        bakery: 'Bäckereien', supermarket: 'Einzelhandel', cinema: 'Kultur & Freizeit', library: 'Bildung',
        cafe: 'Gastronomie', pool: 'Sport', subway: 'Schienenverkehr', parking: 'Parken'
      },
      selectAll: 'Alle Layer aktivieren',
      deselectAll: 'Alle Layer deaktivieren',
      itemsSelectedSuffix: 'aktiv',
      categorySelectFeedback: 'Kategorie aktiviert:',
      categoryDeselectFeedback: 'Kategorie deaktiviert:',
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