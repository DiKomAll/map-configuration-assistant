import { Component, Input, OnInit, OnChanges, SimpleChanges, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
// OSMBuildings is loaded via script tag, we declare it here for TypeScript to recognize it. Make sure to include the OSMBuildings script in your index.html or angular.json scripts array.
// import {OSMBuildings} from '../../../lib/OSMBuildings-Leaflet.js'; // This is just to satisfy TypeScript, the actual library is loaded globally.

import { DATA_CONFIG, TEXTS, ProfileType } from '../../app.config.data';

declare var OSMBuildings: any;

@Component({
  selector: 'app-map-preview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative w-full h-[35vh] max-h-[300px] md:h-[50vh] md:max-h-[500px] rounded-2xl overflow-hidden border-2 border-slate-200 shadow-lg">
      <div #mapContainer class="w-full h-full z-10"></div>
      
      <!-- Interaction Hint Overlay -->
      <div *ngIf="showInterationHint" class="absolute inset-0 z-20 bg-black/40 flex items-center justify-center pointer-events-none animate-fade-in">
        <div class="bg-white/90 p-6 rounded-2xl shadow-xl max-w-[280px] text-center">
          <div class="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0012 3c1.268 0 2.39.234 3.401.665M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11V5l2 2m-2-2l-2 2" />
             </svg>
          </div>
          <p class="font-bold text-slate-800 leading-tight">
            {{ t().ui.mapInstructions }}
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; width: 100%; }
    .animate-fade-in { animation: fadeIn 0.3s ease-out; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  `]
})
export class MapPreviewComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @Input() profile: ProfileType = 'simple';
  @Input() config: any;
  @Input() animationEnabled: boolean = true;

  @ViewChild('mapContainer') mapContainer!: ElementRef;

  private map?: L.Map;
  private baseLayer?: L.TileLayer | L.Layer;
  private marker?: L.Marker;
  private osmb?: any;
  private animationTimeout?: any;
  private userInteracted = false;
  
  showInterationHint = false;
  // animationEnabled = DATA_CONFIG.mapAnimationEnabled; // Removed local state

  constructor() {}

  t() {
    return TEXTS[this.profile];
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.initMap();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.map) {
      if (changes['config']) {
        this.updateMap();
      }
      if (changes['animationEnabled']) {
        if (this.animationEnabled) {
          this.startGentleAnimation();
        } else {
          this.stopAnimation();
        }
      }
    }
  }

  ngOnDestroy() {
    this.stopAnimation();
    if (this.map) {
      this.map.remove();
    }
  }

  private initMap() {
    const startLat = this.config.lat || 51.538957;
    const startLon = this.config.lon || 7.221126;
    const isMobile = L.Browser.mobile;

    this.map = L.map(this.mapContainer.nativeElement, {
      center: [startLat, startLon],
      zoom: 17,
      scrollWheelZoom: !isMobile,
      dragging: !isMobile,
      zoomDelta: 1,
      zoomSnap: 1,
    });

    // Handle two-finger interaction ONLY on mobile
    if (isMobile) {
      this.map.on('touchstart', (e: L.LeafletEvent) => {
        const originalEvent = (e as any).originalEvent;
        const touches = originalEvent ? originalEvent.touches : null;
        if (touches && touches.length < 2) {
          this.showInterationHint = true;
          setTimeout(() => this.showInterationHint = false, 2000);
        } else if (touches && touches.length >= 2) {
          this.showInterationHint = false;
          this.map?.dragging.enable();
        }
      });

      this.map.on('touchend', () => {
        this.map?.dragging.disable();
        this.showInterationHint = false;
      });
    }

    // Stop animation on any user interaction
    this.map.on('dragstart', () => this.handleUserInteraction());
    this.map.on('zoomstart', () => this.handleUserInteraction());
    this.map.on('mousedown', () => this.handleUserInteraction());

    this.updateMap();
    
    // Fix for "gray tiles" / shifted map on first render
    // We wait a bit to ensure the container dimensions are fully stable
    setTimeout(() => {
      if (this.map) {
        this.map.invalidateSize();
        // If we are at the target location, make sure it's centered again
        const lat = this.config.lat || 51.538957;
        const lon = this.config.lon || 7.221126;
        this.map.setView([lat, lon], this.map.getZoom());
      }
    }, 300);

    if (this.animationEnabled) {
      this.startGentleAnimation();
    }

    this.map.invalidateSize(true); // Fixes potential display issues when container size changes
  }

  private updateMap() {
    if (!this.map) return;

    // 1. Update Center & Marker
    const lat = this.config.lat || 51.538957;
    const lon = this.config.lon || 7.221126;
    
    this.map.setView([lat, lon], this.map.getZoom());

    this.updateMarker(lat, lon);

    // 2. Update Basemap
    this.updateBasemap();

    // 3. Update OSM Buildings
    this.updateBuildings();

    this.map.invalidateSize(true); // Fixes potential display issues when container size changes
  }

  private updateBasemap() {
    if (!this.map) return;

    if (this.baseLayer) {
      this.map.removeLayer(this.baseLayer);
    }

    const mapStyleId = this.config.mapStyle || 'color';
    const styleConfig = DATA_CONFIG.mapStyles.find(s => s.id === mapStyleId);

    if (styleConfig) {
      const mc = styleConfig.map;
      if (mc.type === 'xyz') {
        this.baseLayer = L.tileLayer(mc.url, {
          attribution: mc.attribution
        }).addTo(this.map);
      } else if (mc.type === 'wms') {
        this.baseLayer = L.tileLayer.wms(mc.url, {
          layers: mc.layers,
          format: mc.format,
          transparent: mc.transparent,
          version: mc.version,
          attribution: mc.attribution
        }).addTo(this.map);
      }
    }
  }

  private updateMarker(lat: number, lon: number) {
    if (!this.map) return;

    if (this.marker) {
      this.map.removeLayer(this.marker);
    }

    const place = DATA_CONFIG.simplePlaces.find(p => p.name === this.config.area);
    const iconUrl = place ? place.image : null;
    
    let icon: L.DivIcon | L.Icon;

    if (this.config.symbolStyle === 'photos' && iconUrl) {
        // Photo marker
        icon = L.divIcon({
            className: 'custom-div-icon',
            html: `
              <div class="marker-pin">
                <div class="marker-pin-inner">
                  <img src="${iconUrl}" alt="">
                </div>
              </div>
            `,
            iconSize: [80, 80],
            iconAnchor: [40, 80]
        });
    } else if (this.config.symbolStyle === 'symbols_labels') {
        // Icon + Label
        const sym = place ? place.image : 'assets/emma_the_muh.png'; // Fallback
        icon = L.divIcon({
            className: 'custom-div-icon',
            html: `
              <div class="marker-pin" style="background: #3b82f6;">
                <div class="marker-pin-inner">
                   <img src="${sym}" style="padding: 5px;">
                </div>
                <div class="marker-label">${this.config.area || 'Hier'}</div>
              </div>
            `,
            iconSize: [80, 80],
            iconAnchor: [40, 80]
        });
    } else {
        // Default / Symbol only
        const sym = place ? place.image : 'assets/emma_the_muh.png'; // Fallback
        icon = L.divIcon({
            className: 'custom-div-icon',
            html: `
              <div class="marker-pin" style="background: #3b82f6;">
                <div class="marker-pin-inner">
                   <img src="${sym}" style="padding: 5px;">
                </div>
              </div>
            `,
            iconSize: [80, 80],
            iconAnchor: [40, 80]
        });
    }

    this.marker = L.marker([lat, lon], { icon }).addTo(this.map);
    
    // Popup in simple language
    const popupContent = `
      <div class="p-2" style="font-family: var(--font-family-body);">
        <strong class="text-lg block mb-1">${this.config.area || 'Dein Ort'}</strong>
        <p class="text-slate-600">Das ist der Ort, den du ausgesucht hast.</p>
      </div>
    `;
    this.marker.bindPopup(popupContent);
  }

  private updateBuildings() {
    if (!this.map) return;

    const showBuildings = this.config.viewMode === 'twoandhalfdimensional' || this.config.viewMode === 'threedimensional';

    if (showBuildings) {
      if (!this.osmb) {
        // this.osmb = new OSMBuildings(this.map);
        // this.osmb.date(new Date());
        // this.osmb.load('https://{s}.data.osmbuildings.org/0.2/59f8ba24/tile/{z}/{x}/{y}.json');

        this.osmb = new OSMBuildings(this.map).load('https://{s}.data.osmbuildings.org/0.2/59fcc2e8/tile/{z}/{x}/{y}.json');
          this.osmb.date(new Date(2026, 2, 15, 10, 0)); // YYYY, MM-1, DD, hh, mm
      }
    } else {
      if (this.osmb) {
        // OSMBuildings doesn't have a simple remove, we might need to clear it or just hide
        // For Leaflet implementation it usually adds a layer
        this.map.eachLayer((layer: any) => {
           if (layer._container && layer._container.className && layer._container.className.includes('osmb')) {
              this.map?.removeLayer(layer);
           }
        });
        this.osmb = null;
      }
    }
  }

  private stopAnimation() {
    if (this.animationTimeout) {
      clearTimeout(this.animationTimeout);
      this.animationTimeout = undefined;
    }
  }

  private handleUserInteraction() {
    if (!this.userInteracted) {
      this.userInteracted = true;
      this.stopAnimation();
    }
  }

  private startGentleAnimation() {
    if (!this.map || !this.animationEnabled || this.userInteracted) return;

    const center = this.map.getCenter();

    const animate = () => {
      if (!this.animationEnabled || !this.map || this.userInteracted) return;

      // a) leichtes Verschieben nach schräg links (oben-links)
      this.map.panBy([-50, -30], { animate: true, duration: 3 });
      
      this.animationTimeout = setTimeout(() => {
        if (!this.animationEnabled || !this.map || this.userInteracted) return;
        
        // b) Verschieben zurück zur Startposition
        this.map.panTo(center, { animate: true, duration: 3 });

        this.animationTimeout = setTimeout(() => {
          if (this.animationEnabled && !this.userInteracted) animate();
        }, 4000);
      }, 4000);
    };

    animate();
  }
}
