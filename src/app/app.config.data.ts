// Diese Datei enthält ALLE anpassbaren Inhalte, Texte und Bild-Pfade.
// Sie ist getrennt von der Programmierlogik.

export type ProfileType = 'simple' | 'expert';

export type MapType = 'xyz' | 'wms';

export interface MapServiceConfig {
  type: MapType;
  url: string;
  layers?: string; // Für WMS
  styles?: string; // Für WMS
  format?: string; // Für WMS
  transparent?: boolean; // Für WMS
  version?: string; // Für WMS
  attribution?: string;
}

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
    mapInstructions: string;
    mapAnimationLabel: string;
    previewLabel: string;
    startAppHint: string;
    swipeHint: string;
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
    locationUnavailable: string;
    searchUnavailable: string;
    searchError: string;
    searchNoResults: string;
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
    options: Record<string, { name: string; description: string, disabled?: boolean; disabledText?: string }>;
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
    congratsTitle: string;
    congratsMessage: string;
    labels: { location: string; style: string; view: string; orientation: string; visual: string; audio: string; };
    values: { pointsSelected: string; noPoints: string; active: string; inactive: string; };
  };
}

// --- DATEN-KONFIGURATION (Integriert) ---

// Step indicator configuration for responsive display
export interface StepIndicatorConfig {
  icon?: string;       // SVG path for step icon
  shortLabel?: string; // Short label shown on medium screens when icon not available
}

// Default sizes for step indicators - edit these values to change sizes globally
// To customize sizes, modify the class values below (Tailwind CSS classes)
export const STEP_INDICATOR_SIZES = {
  number: 'w-5 h-5 text-[10px] sm:w-6 sm:h-6 sm:text-xs sm:font-bold md:w-7 md:h-7 md:text-sm',
  icon: 'w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5'
};

export const DATA_CONFIG = {
  // Step indicator icons/short labels for responsive navigation
  // Each step can have an icon (SVG path) and/or a short label
  // On screens >= sm: shows number + icon (or short label if no icon)
  // On screens < sm: shows only the number
  stepIndicators: [
    { icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z', shortLabel: 'Ort' },
    { icon: 'M4 6h16M4 12h16M4 18h16', shortLabel: 'Karte' },
    { icon: 'M12 2L2 7l10 5 10-5-10-5z', shortLabel: 'Ansicht' },
    { icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z', shortLabel: 'Orte' },
    { icon: 'M12 22l-6-9.5c0-3.5 2.5-6.5 6-6.5s6 3 6 6.5L12 22z', shortLabel: 'Optik' },
    { icon: 'M5 13l4 4L19 7', shortLabel: 'Fertig' }
  ] as StepIndicatorConfig[],

  // Responsive step indicator sizing (configurable)
  // Override these values to change sizes globally
  stepIndicatorSizes: STEP_INDICATOR_SIZES,

  // Font Settings (configurable)
  fontSettings: {
    label: 'Barrierefreiheit',
    fontFamilyLabel: 'Schriftart wechseln',
    fontSizeLabel: 'Schriftgröße anpassen',
    sampleText: 'gut lesbar',
    fontFamilyOptions: {
      lexendDeca: 'Lexend Deca',
      lexendExa: 'Lexend Exa',
      lexendGiga: 'Lexend Giga',
      openDyslexic: 'Lesehilfe',
      default: 'System Font'
    },
    fontSizeOptions: {
      small: 'A',
      normal: 'A',
      large: 'A',
      'x-large': 'A'
    },
    defaultFontFamily: 'lexend-deca',
    defaultFontSize: 'normal'
  },

  // TTS Preset Settings (configurable)
  ttsPresets: {
    volume: {
      quiet: 0.33,
      medium: 0.66,
      loud: 1
    },
    rate: {
      slow: 0.7,
      normal: 1,
      fast: 1.5
    }
  },
  // TTS Preset Labels (configurable)
  ttsLabels: {
    volume: {
      quiet: 'Leise',
      medium: 'Mittel',
      loud: 'Laut'
    },
    rate: {
      slow: 'Langsam',
      normal: 'Normal',
      fast: 'Schnell'
    }
  },
  // TTS Test message when changing presets
  ttsTestMessage: 'Du hast meine Stimmeneinstellung geändert. Gefällt es dir?',
  // TTS Preset Threshold values for active state detection
  ttsThresholds: {
    volume: {
      quiet: 0.33,
      medium: 0.66
    },
    rate: {
      slow: 0.9,
      normalUpper: 1.1
    }
  },
  externalAppUrl: "https://kommonitor.fbg-hsbo.de/#!/",
  // externalAppUrl: "http://localhost:8000/#!/",
  defaultAreaTab: 'selection',

  // Area tab enablement — set to false to deactivate a starting-place option
  // When deactivated, the tab remains visible but its content window shows
  // a configurable unavailable message instead of the feature UI
  areaOptions: {
    location: { enabled: false },  // device position (geolocation)
    search: { enabled: false },    // address search (Nominatim)
  },

  previewExampleLandmarkId: 'kirche',
  celebrateAnimation: true,
  mapAnimationEnabled: true,

  // Swipe gesture configuration
  swipeConfig: {
    enabled: false,                    // Enable/disable swipe gestures entirely
    threshold: 50,                    // Min px to trigger step change
    animationDuration: 300,           // CSS transition duration in ms
    animationEasing: 'ease-out',      // CSS timing function
    showSwipeHint: true,              // Show swipe hint on first visit
    swipeHintDelay: 1000,             // ms before hint appears
    swipeHintDuration: 4000,          // ms before hint auto-dismisses
    preventScroll: true,              // Prevent vertical scroll during horizontal swipe
    minSwipeVelocity: 0.3,            // Min velocity (px/ms) to trigger step change
  },

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
    { 
      id: 'color', 
      image: 'assets/farbkarte.png', 
      ttsText: 'Farbige Hintergrundkarte',
      map: {
        type: 'wms',
        url: 'https://sgx.geodatenzentrum.de/wms_basemapde',
        layers: 'de_basemapde_web_raster_farbe',
        format: 'image/png',
        transparent: true,
        version: '1.3.0',
        attribution: 'Basemap.de'
      }
      // map: {
      //   type: 'xyz',
      //   url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      //   attribution: '&copy; OpenStreetMap contributors'
      // }
    },
    { 
      id: 'grey', 
      image: 'assets/graukarte.png', 
      ttsText: 'Graue Hintergrundkarte',
      map: {
        type: 'wms',
        url: 'https://sgx.geodatenzentrum.de/wms_basemapde',
        layers: 'de_basemapde_web_raster_grau',
        format: 'image/png',
        transparent: true,
        version: '1.3.0',
        attribution: 'Basemap.de'
      }
      // map: {
      //   type: 'xyz',
      //   url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      //   attribution: '&copy; OpenStreetMap &copy; CARTO'
      // }
    },
    { 
      id: 'ortho', 
      image: 'assets/luftbildkarte.png', 
      ttsText: 'Luftbild Hintegrundkarte',
      map: {
        type: 'wms',
        url: 'https://www.wms.nrw.de/geobasis/wms_nw_dop',
        layers: 'nw_dop_rgb',
        format: 'image/png',
        transparent: true,
        version: '1.3.0',
        attribution: 'Geobasis NRW'
      }
    }
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
    apotheke: { 
      image: 'assets/metacom/apotheke.jpg', 
      icon: 'M12 2v20M2 12h20M9 9h6v6H9z',
      ttsText: 'Apotheke'
    },
    haltestelle: { 
      image: 'assets/metacom/haltestelle.jpeg', 
      icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4',
      ttsText: 'Haltestelle für Bus und Bahn'
    },
    kirche: { 
      image: 'assets/metacom/kirche2.png', 
      icon: 'M12 3v18M8 8h8M12 3l-4 4h8l-4-4',
      ttsText: 'Kirche'
    },
    restaurant: { 
      image: 'assets/metacom/restaurant2orange.jpeg', 
      icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',
      ttsText: 'Restaurant oder Gaststätte'
    },
    eis: { 
      image: 'assets/metacom/eiscafe.png', 
      icon: 'M12 22l-6-9.5c0-3.5 2.5-6.5 6-6.5s6 3 6 6.5L12 22z M12 6a3 3 0 100-6 3 3 0 000 6z',
      ttsText: 'Eisdiele'
    },
    bar: { image: 'assets/metacom/kneipe3.jpeg', icon: 'M12 2L2 7l10 5 10-5-10-5z', ttsText: 'Bar oder Kneipe' },    
    bakery: { image: 'assets/metacom/baeckerei.png', icon: 'M12 2L2 7l10 5 10-5-10-5z', ttsText: 'Bäckerei' },
    supermarkt: { image: 'assets/metacom/markt.png', icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z', ttsText: 'Supermarkt' },
    kino: { image: 'assets/metacom/kino.jpeg', icon: 'M7 4v16M17 4v16M3 8h4m10 0h4M3 12h4m10 0h4M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z', ttsText: 'Kino' },
    cafe: { image: 'assets/metacom/cafe.png', icon: 'M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z', ttsText: 'Café' },
    bahn: { image: 'assets/metacom/bahnhof.jpeg', icon: 'M12 2v20M2 12h20M9 9h6v6H9z', ttsText: 'U-Bahn' },
    parkplatz: { image: 'assets/metacom/parkplatz2.jpeg', icon: 'M12 2L2 7l10 5 10-5-10-5z', ttsText: 'Parkplatz' },
    rewe: { image: 'assets/logographeme/Rewe_Logo.png', icon: '', ttsText: 'Rewe Supermarkt' },
    aldinord: { image: 'assets/logographeme/ALDI_Nord_Logo_2015.png', icon: '', ttsText: 'ALDI Nord Supermarkt' },
    aldisued: { image: 'assets/logographeme/Aldi_Sued_2017_logo.svg.png', icon: '', ttsText: 'ALDI Süd Supermarkt' },
    penny: { image: 'assets/logographeme/Penny-Logo.svg.png', icon: '', ttsText: 'Penny Supermarkt' },
    edeka: { image: 'assets/logographeme/Logo_Edeka.svg.png', icon: '', ttsText: 'Edeka Supermarkt' },
    tankstelle: { image: 'assets/metacom/tankstelle.jpeg', icon: '', ttsText: 'Tankstelle' },
    polizeistation: { image: 'assets/metacom/polizeiwache.jpeg', icon: '', ttsText: 'Polizeiwachen' },
    krankenhaus: { image: 'assets/metacom/krankenhaus.jpeg', icon: '', ttsText: 'Krankenhaus' },
    schule: { image: 'assets/metacom/schule_inklusion2.jpeg', icon: '', ttsText: 'Schule' }
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
         { id: 'apotheke', name: 'Apotheken', description: 'Standorte im Stadtgebiet' },
         { id: 'doctors', name: 'Ärzte', description: 'Niedergelassene Ärzte' }
      ]
    },
    {
      category: 'Verkehr',
      resources: [
         { id: 'parkplatz', name: 'Ladesäulen', description: 'E-Mobilität' }
      ]
    }
  ],

  simpleLandmarkCategories: [
    {
      id: 'cat_shopping',
      name: 'Einkaufen',
      icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z',
      items: ['apotheke', 'bakery', 'supermarkt', 'rewe', 'aldinord', 'penny', 'edeka'],
      ttsText: 'Dinge zum Einkaufen'
    },
    {
      id: 'cat_leisure',
      name: 'Freizeit',
      icon: 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      items: ['kino', 'restaurant', 'cafe', 'eis','bar'],
      ttsText: 'Dinge für die Freizeit'
    },
    {
      id: 'cat_traffic',
      name: 'Verkehr',
      icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4',
      items: ['haltestelle', 'bahn', 'tankstelle'],
      ttsText: 'Dinge für den Verkehr'
    },
    {
      id: 'cat_culture',
      name: 'Öffentliche Orte',
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
      items: ['krankenhaus', 'polizeistation', 'schule'],
      ttsText: 'öffentliche Orte wie Schulen, Krankenhäuser und Polizeiwachen'
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
      mapInstructions: 'Du kannst die Karte mit zwei Fingern bewegen und vergrößern.',
      mapAnimationLabel: 'Soll die Karte sich automatisch bewegen?',
      previewLabel: 'Vorschau: So sieht deine Karte aus',
      startAppHint: 'Klicke auf den grünen Knopf unten, um deine richtige Karte zu öffnen.',
      swipeHint: 'Nach links oder rechts wischen, um zwischen den Schritten zu wechseln',
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
      locationUnavailable: 'Diese Option ist derzeit nicht verfügbar.',
      searchUnavailable: 'Diese Option ist derzeit nicht verfügbar.',
      searchError: 'Bei der Suche ist ein Fehler aufgetreten. Bitte versuche es später noch einmal.',
      searchNoResults: 'Keine Ergebnisse gefunden. Bitte suche mit anderen Begriffen.',
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
        bank: 'Bank', apotheke: 'Apotheke', haltestelle: 'Bus & Bahn',
        kirche: 'Kirche', restaurant: 'Restaurant', eis: 'Eis', 
        bakery: 'Bäckerei', supermarkt: 'Supermarkt', kino: 'Kino',
        cafe: 'Café',  bar: 'Bar', bahn: 'U-Bahn', parkplatz: 'Parkplatz',
        rewe: 'Rewe', aldinord: 'ALDI Nord', aldisued: 'ALDI Süd', penny: 'Penny', edeka: 'Edeka', 
        tankstelle: 'Tankstelle', polizeistation: 'Polizeistation', krankenhaus: 'Krankenhaus', schule: 'Schule',
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
        photos: { name: 'Echte Fotos', description: 'Wie es in Wirklichkeit aussieht.', disabled: true, disabledText: 'Das geht leider gerade nicht.' },
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
      congratsTitle: 'Super gemacht!',
      congratsMessage: 'Du hast alle Schritte geschafft. Deine eigene Karte ist jetzt fertig!',
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
      mapInstructions: 'Nutzen Sie zwei Finger zur Navigation in der Karte.',
      mapAnimationLabel: 'Automatische Karten-Animation aktivieren',
      previewLabel: 'Interaktive Vorschau Ihrer Konfiguration',
      startAppHint: 'Nutzen Sie die Schaltfläche unten, um die Anwendung mit diesen Parametern zu starten.',
      swipeHint: 'Wischen Sie nach links oder rechts, um zwischen den Schritten zu wechseln',
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
      locationUnavailable: 'Diese Option wird derzeit nicht unterstützt.',
      searchUnavailable: 'Diese Option wird derzeit nicht unterstützt.',
      searchError: 'Bei der Suche ist ein Fehler aufgetreten. Bitte versuchen Sie es später noch einmal.',
      searchNoResults: 'Keine Ergebnisse gefunden. Bitte suchen Sie mit anderen Begriffen.',
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
        bank: 'Finanzwesen', apotheke: 'Gesundheit', haltestelle: 'Mobilität',
        kirche: 'Kultur', restaurant: 'Restaurant', eis: 'Gastronomie', 
        bakery: 'Bäckereien', supermarkt: 'Einzelhandel', kino: 'Kultur & Freizeit', 
        cafe: 'Gastronomie',  bar: 'Bar', bahn: 'Schienenverkehr', parkplatz: 'Parken',
        rewe: 'Rewe', aldinord: 'ALDI Nord', aldisued: 'ALDI Süd', penny: 'Penny', edeka: 'Edeka'
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
        photos: { name: 'Fotorealistisch', description: 'Objektfotos (falls vorhanden).', disabled: true, disabledText: 'Das geht leider gerade nicht.' },
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
      congratsTitle: 'Konfiguration erfolgreich!',
      congratsMessage: 'Sie haben alle erforderlichen Schritte abgeschlossen. Ihre individuelle Kartenansicht wurde generiert.',
      labels: {
        location: 'Gebiet:', style: 'Karte:', view: 'Ansicht:', orientation: 'Layer:', visual: 'Stil:', audio: 'Audio:',
      },
      values: {
        pointsSelected: 'aktiv', noPoints: '-', active: 'Ja', inactive: 'Nein',
      },
    },
  }
};