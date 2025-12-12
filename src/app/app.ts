
import { Component, signal, computed, effect, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Import der Konfigurationsdaten und Typen
import { DATA_CONFIG, TEXTS, ProfileType } from './app.config.data';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-slate-50 font-sans text-slate-800 pb-28 relative overflow-hidden flex flex-col">
      
      <!-- Top Bar -->
      <header class="bg-white sticky top-0 z-30 shadow-sm safe-area-top" role="banner">
        <div class="px-4 py-3 flex items-center justify-between">
          <h1 class="text-lg font-bold text-slate-900 truncate flex-1" [attr.aria-label]="t().ui.appTitle">
            {{ t().ui.appTitle }}
          </h1>
          <button 
            (click)="toggleProfile()"
            class="ml-2 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
            [class.bg-slate-900]="profile() === 'expert'"
            [class.text-white]="profile() === 'expert'"
            [class.bg-emerald-100]="profile() === 'simple'"
            [class.text-emerald-800]="profile() === 'simple'"
            [class.border-transparent]="profile() === 'expert'"
            [class.border-emerald-200]="profile() === 'simple'"
          >
            {{ t().ui.profileLabel }}
          </button>
        </div>
        <div class="h-1.5 w-full bg-slate-100" role="progressbar">
          <div class="h-full bg-emerald-500 transition-all duration-500 ease-out" [style.width.%]="progressPercentage()"></div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="flex-1 container mx-auto max-w-4xl px-4 py-6 animate-fade-in focus:outline-none" role="main" id="main-content">
        
        <!-- Step Header -->
        <div class="mb-6 text-center">
          <span class="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1 block">
            {{ t().ui.stepIndicator }} {{ currentStep() + 1 }} / {{ steps.length }}
          </span>
          <h2 class="text-2xl font-bold mb-2 text-slate-900 leading-tight">
            {{ t().steps[currentStep()].title }}
          </h2>
          <p *ngIf="t().steps[currentStep()].description" class="text-slate-500 text-base md:text-lg max-w-lg mx-auto">
            {{ t().steps[currentStep()].description }}
          </p>
        </div>

        <div [ngSwitch]="currentStep()">

          <!-- STEP 1: BASIS KARTE -->
          <fieldset *ngSwitchCase="0" class="border-0 m-0 p-0">
            <legend class="sr-only">{{ t().steps[0].title }}</legend>
            <div class="grid gap-4" 
                 [ngClass]="{
                   'grid-cols-1 md:grid-cols-3': profile() === 'expert',
                   'grid-cols-1 md:grid-cols-2': profile() === 'simple'
                 }">
              <button 
                *ngFor="let map of data.mapStyles"
                type="button"
                (click)="selectMapStyle(map.id)"
                [attr.aria-pressed]="config.mapStyle === map.id"
                class="group relative overflow-hidden rounded-2xl border-2 transition-all duration-200 text-left w-full shadow-sm hover:shadow-md focus:outline-none focus:ring-4 focus:ring-emerald-500/50"
                [class.border-emerald-500]="config.mapStyle === map.id"
                [class.border-transparent]="config.mapStyle !== map.id"
                [ngClass]="{
                   'h-32 md:h-48': profile() === 'expert',
                   'h-64 md:h-96': profile() === 'simple'
                }"
              >
                <div class="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                     [style.background-image]="'url(' + map.image + ')'">
                     <div class="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors"></div>
                </div>
                <div class="absolute bottom-0 left-0 right-0 p-4 z-10 bg-gradient-to-t from-black/90 to-transparent">
                  <div class="flex items-end justify-between">
                    <div>
                      <span class="text-white font-bold block leading-tight"
                            [class.text-lg]="profile() === 'expert'"
                            [class.text-2xl]="profile() === 'simple'">
                        {{ t().mapStyles[map.id].name }}
                      </span>
                      <span *ngIf="t().mapStyles[map.id].description" class="text-white/80 text-xs block mt-1">
                        {{ t().mapStyles[map.id].description }}
                      </span>
                    </div>
                    <div *ngIf="config.mapStyle === map.id" class="bg-emerald-500 text-white rounded-full p-1 shadow-lg shrink-0 ml-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </fieldset>

          <!-- STEP 2: BEREICH -->
          <div *ngSwitchCase="1" class="max-w-lg mx-auto">
            
            <div class="flex rounded-xl bg-slate-100 p-1 mb-6 shadow-inner">
              
              <button (click)="activateAreaTab('selection')"
                class="flex-1 py-2.5 px-4 rounded-lg text-sm font-bold transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500"
                [class.bg-white]="activeAreaTab === 'selection'" [class.text-slate-900]="activeAreaTab === 'selection'" [class.shadow-sm]="activeAreaTab === 'selection'" [class.text-slate-500]="activeAreaTab !== 'selection'" [class.hover:text-slate-700]="activeAreaTab !== 'selection'">
                <span class="flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="data.icons.tabList" /></svg>
                  <span class="hidden sm:inline">{{ t().areas.tabSelection }}</span>
                </span>
              </button>
              <button *ngIf="geolocationAvailable" (click)="activateAreaTab('location')"
                class="flex-1 py-2.5 px-4 rounded-lg text-sm font-bold transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500"
                [class.bg-white]="activeAreaTab === 'location'" [class.text-slate-900]="activeAreaTab === 'location'" [class.shadow-sm]="activeAreaTab === 'location'" [class.text-slate-500]="activeAreaTab !== 'location'" [class.hover:text-slate-700]="activeAreaTab !== 'location'">
                <span class="flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="data.icons.tabLocation" /></svg>
                  <span class="hidden sm:inline">{{ t().areas.tabLocation }}</span>
                </span>
              </button>
              <button (click)="activateAreaTab('search')"
                class="flex-1 py-2.5 px-4 rounded-lg text-sm font-bold transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500"
                [class.bg-white]="activeAreaTab === 'search'" [class.text-slate-900]="activeAreaTab === 'search'" [class.shadow-sm]="activeAreaTab === 'search'" [class.text-slate-500]="activeAreaTab !== 'search'" [class.hover:text-slate-700]="activeAreaTab !== 'search'">
                <span class="flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="data.icons.tabSearch" /></svg>
                  <span class="hidden sm:inline">{{ t().areas.tabSearch }}</span>
                </span>
              </button>
            </div>

            <!-- Tab Content Location -->
            <div *ngIf="activeAreaTab === 'location' && geolocationAvailable" class="animate-fade-in">
              <div class="bg-blue-50 border border-blue-100 rounded-2xl p-6 text-center">
                <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600 relative">
                  <svg *ngIf="!isDetectingLocation" xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="data.icons.tabLocation" /></svg>
                  <div *ngIf="isDetectingLocation" class="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
                </div>
                <div *ngIf="!detectedLocation">
                  <h3 class="text-xl font-bold text-blue-900 mb-2">{{ t().areas.locationBtnStart }}</h3>
                  <p class="text-blue-700/80 mb-6">{{ t().areas.locationDesc }}</p>
                  <button (click)="detectLocation()" [disabled]="isDetectingLocation" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                    <span>{{ t().areas.locationBtnStart }}</span>
                  </button>
                  <p *ngIf="locationError" class="text-red-500 text-sm mt-3 font-medium bg-red-50 p-2 rounded border border-red-100">{{ locationError }}</p>
                </div>
                <div *ngIf="detectedLocation" class="animate-scale-in">
                  <h3 class="text-xl font-bold text-emerald-800 mb-1">Standort gefunden!</h3>
                  <p class="text-blue-900/70 mb-4 text-sm font-medium">{{ detectedLocation.address || (detectedLocation.coords.latitude.toFixed(4) + ', ' + detectedLocation.coords.longitude.toFixed(4)) }}</p>
                  <button (click)="useLocation()" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2 mb-4">
                    <span>{{ t().areas.locationBtnConfirm }}</span>
                    <svg *ngIf="config.area.includes('Standort') || config.area.includes(detectedLocation.address || '')" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
                  </button>
                  <button (click)="toggleLocationDetails()" class="text-blue-600 text-sm font-semibold hover:underline flex items-center justify-center gap-1 mx-auto">
                    {{ showLocationDetails ? t().areas.hideDetails : t().areas.showDetails }}
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform duration-200" [class.rotate-180]="showLocationDetails" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  <div *ngIf="showLocationDetails" class="mt-4 border-t border-blue-200 pt-4 animate-fade-in text-left">
                    <div class="relative h-40 bg-slate-200 rounded-lg overflow-hidden border border-blue-200">
                       <img [src]="data.assets.locationMapPlaceholder" class="w-full h-full object-cover opacity-60 grayscale" alt="Map">
                       <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                          <div class="relative">
                            <div class="w-4 h-4 bg-blue-500 rounded-full animate-ping absolute top-0 left-0"></div>
                            <svg class="w-10 h-10 text-blue-600 drop-shadow-lg relative z-10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                          </div>
                       </div>
                    </div>
                    <div *ngIf="profile() === 'expert'" class="mt-3 text-xs text-slate-500 space-y-1">
                      <div class="flex justify-between"><span>Latitude:</span> <span class="font-mono">{{ detectedLocation.coords.latitude }}</span></div>
                      <div class="flex justify-between"><span>Longitude:</span> <span class="font-mono">{{ detectedLocation.coords.longitude }}</span></div>
                      <div class="flex justify-between"><span>Accuracy:</span> <span class="font-mono">+/- {{ detectedLocation.coords.accuracy | number:'1.0-0' }}m</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Tab Content Selection -->
            <div *ngIf="activeAreaTab === 'selection'" class="animate-fade-in">
               <div *ngIf="profile() === 'expert'" class="flex space-x-2 border-b border-slate-200 mb-4">
                 <button (click)="expertSelectionTab = 'favorites'" class="pb-2 px-1 text-sm font-medium transition-colors border-b-2"
                   [class.border-emerald-500]="expertSelectionTab === 'favorites'" [class.text-emerald-700]="expertSelectionTab === 'favorites'" [class.border-transparent]="expertSelectionTab !== 'favorites'" [class.text-slate-500]="expertSelectionTab !== 'favorites'">{{ t().areas.subTabFavorites }}</button>
                 <button (click)="expertSelectionTab = 'hierarchy'" class="pb-2 px-1 text-sm font-medium transition-colors border-b-2"
                   [class.border-emerald-500]="expertSelectionTab === 'hierarchy'" [class.text-emerald-700]="expertSelectionTab === 'hierarchy'" [class.border-transparent]="expertSelectionTab !== 'hierarchy'" [class.text-slate-500]="expertSelectionTab !== 'hierarchy'">{{ t().areas.subTabAdmin }}</button>
               </div>
               <h3 *ngIf="profile() === 'simple'" class="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4" id="area-label">{{ t().areas.manualSelectionTitle }}</h3>
               
               <div *ngIf="profile() === 'simple' || (profile() === 'expert' && expertSelectionTab === 'favorites')" class="grid grid-cols-1 gap-4">
                  <button *ngFor="let place of data.simplePlaces" (click)="toggleArea(place.name)" [attr.aria-pressed]="config.area === place.name"
                    class="group relative h-40 rounded-xl overflow-hidden border-2 text-left transition-all focus:outline-none focus:ring-4 focus:ring-emerald-500/50"
                    [class.border-emerald-500]="config.area === place.name" [class.border-transparent]="config.area !== place.name">
                    <div class="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" [style.background-image]="'url(' + place.image + ')'"><div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div></div>
                    <div class="absolute bottom-0 left-0 p-4 z-10 w-full flex justify-between items-end">
                      <span class="text-white font-bold text-xl">{{ place.name }}</span>
                      <div *ngIf="config.area === place.name" class="bg-emerald-500 text-white rounded-full p-1 animate-scale-in"><svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg></div>
                    </div>
                  </button>
               </div>

               <div *ngIf="profile() === 'expert' && expertSelectionTab === 'hierarchy'" class="space-y-4 bg-white p-4 rounded-xl border border-slate-200">
                  <div>
                    <label class="block text-xs font-semibold text-slate-500 mb-1">{{ t().areas.spatialLevelLabel }}</label>
                    <div class="flex flex-wrap gap-2">
                      <button *ngFor="let level of data.expertSpatialUnits" (click)="expertSelectedLevel = level.id"
                        class="px-3 py-2 rounded-lg text-sm font-medium border transition-colors"
                        [class.bg-slate-800]="expertSelectedLevel === level.id" [class.text-white]="expertSelectedLevel === level.id" [class.border-slate-800]="expertSelectedLevel === level.id" [class.bg-white]="expertSelectedLevel !== level.id" [class.text-slate-600]="expertSelectedLevel !== level.id" [class.border-slate-300]="expertSelectedLevel !== level.id">{{ level.name }}</button>
                    </div>
                  </div>
                  <div class="max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                    <div class="grid grid-cols-2 gap-2">
                       <button *ngFor="let feat of getExpertFeatures()" (click)="toggleArea(feat)" class="p-2 text-sm text-left rounded border transition-colors hover:bg-slate-50 focus:ring-2 focus:ring-emerald-500"
                          [class.bg-emerald-50]="config.area === feat" [class.border-emerald-500]="config.area === feat" [class.text-emerald-800]="config.area === feat" [class.border-slate-200]="config.area !== feat">{{ feat }}</button>
                    </div>
                  </div>
               </div>
            </div>

            <!-- Tab Content Search -->
            <div *ngIf="activeAreaTab === 'search'" class="animate-fade-in space-y-4">
              <div class="relative">
                <input type="text" [(ngModel)]="searchTerm" (input)="onSearchInput()" [placeholder]="t().areas.searchPlaceholder"
                  class="w-full pl-4 pr-12 py-4 rounded-xl border-2 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-lg shadow-sm bg-white transition-all"
                  [class.border-emerald-500]="config.area === searchTerm && searchTerm.length > 0" [class.border-slate-300]="config.area !== searchTerm">
                <div class="absolute right-4 top-1/2 transform -translate-y-1/2">
                   <div *ngIf="isSearching" class="animate-spin h-5 w-5 border-2 border-emerald-500 border-t-transparent rounded-full"></div>
                   <svg *ngIf="!isSearching" class="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="data.icons.tabSearch" /></svg>
                </div>
              </div>
              <div *ngIf="searchResults.length > 0" class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                 <div class="bg-slate-50 px-4 py-2 text-xs font-bold text-slate-500 border-b border-slate-100 uppercase tracking-wider">{{ t().areas.searchResultLabel }}</div>
                 <div class="divide-y divide-slate-100">
                   <button *ngFor="let result of searchResults" (click)="selectSearchResult(result)" class="w-full text-left p-4 hover:bg-emerald-50 transition-colors flex items-start gap-3 group" [class.bg-emerald-50]="config.area === result.display_name">
                     <div class="mt-0.5 text-slate-400 group-hover:text-emerald-600">
                        <svg *ngIf="result.class === 'place' || result.type === 'administrative'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="data.icons.searchResultPlace" /></svg>
                        <svg *ngIf="result.class === 'building' || result.type === 'house'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="data.icons.searchResultBuilding" /></svg>
                        <svg *ngIf="result.class !== 'place' && result.class !== 'building' && result.type !== 'administrative'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="data.icons.searchResultGeneric" /></svg>
                     </div>
                     <div><span class="block font-medium text-slate-900 text-sm leading-tight">{{ result.display_name }}</span><span class="text-xs text-slate-500">{{ result.type }}</span></div>
                     <div *ngIf="config.area === result.display_name" class="ml-auto text-emerald-600"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg></div>
                   </button>
                 </div>
              </div>
            </div>
          </div>

          <!-- STEP 3, 4, 5, 6 bleiben identisch mit den Referenzen auf 'data' -->
          <fieldset *ngSwitchCase="2" class="space-y-6 border-0 p-0 m-0">
             <legend class="sr-only">{{ t().steps[2].title }}</legend>
             <div *ngFor="let mode of viewModeKeys" class="rounded-xl border-2 overflow-hidden transition-all bg-white hover:border-slate-400" [class.border-emerald-500]="config.viewMode === mode" [class.ring-2]="config.viewMode === mode" [class.ring-emerald-100]="config.viewMode === mode" [class.border-slate-200]="config.viewMode !== mode">
               <button type="button" (click)="config.viewMode = mode" class="w-full p-4 text-left flex items-center justify-between bg-slate-50 border-b border-slate-100 focus:outline-none focus:bg-emerald-50">
                 <div><span class="font-bold text-lg text-slate-900 block">{{ t().viewModes[mode].name }}</span><span *ngIf="t().viewModes[mode].description" class="text-sm text-slate-500">{{ t().viewModes[mode].description }}</span></div>
                 <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center bg-white border-slate-300" [class.border-emerald-500]="config.viewMode === mode"><div class="w-3 h-3 rounded-full bg-emerald-500" *ngIf="config.viewMode === mode"></div></div>
               </button>
               <div class="h-32 md:h-48 w-full bg-slate-100 relative"><img [src]="data.viewModeImages[mode]" class="w-full h-full object-cover" alt="" aria-hidden="true"></div>
             </div>
          </fieldset>

          <div *ngSwitchCase="3" class="space-y-4">
            <h3 class="text-sm font-bold text-slate-500 uppercase tracking-wider text-center mb-4">{{ profile() === 'simple' ? t().landmarks.title : t().landmarks.expertTitle }}</h3>
            <div *ngIf="profile() === 'expert'" class="flex space-x-2 border-b border-slate-200 mb-4">
               <button (click)="expertLandmarkTab = 'visual'" class="pb-2 px-1 text-sm font-medium transition-colors border-b-2" [class.border-emerald-500]="expertLandmarkTab === 'visual'" [class.text-emerald-700]="expertLandmarkTab === 'visual'" [class.border-transparent]="expertLandmarkTab !== 'visual'" [class.text-slate-500]="expertLandmarkTab !== 'visual'">{{ t().landmarks.subTabVisual }}</button>
               <button (click)="expertLandmarkTab = 'catalog'" class="pb-2 px-1 text-sm font-medium transition-colors border-b-2" [class.border-emerald-500]="expertLandmarkTab === 'catalog'" [class.text-emerald-700]="expertLandmarkTab === 'catalog'" [class.border-transparent]="expertLandmarkTab !== 'catalog'" [class.text-slate-500]="expertLandmarkTab !== 'catalog'">{{ t().landmarks.subTabCatalog }}</button>
            </div>
            <div *ngIf="profile() === 'simple' || (profile() === 'expert' && expertLandmarkTab === 'visual')" class="grid grid-cols-2 md:grid-cols-3 gap-3">
              <button *ngFor="let key of landmarkKeys" (click)="toggleLandmark(key)" class="group relative h-60 rounded-xl overflow-hidden border-2 text-left transition-all focus:outline-none focus:ring-4 focus:ring-emerald-500/50" [class.border-emerald-500]="config.landmarks.includes(key)" [class.border-slate-200]="!config.landmarks.includes(key)">
                <div class="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" [style.background-image]="'url(' + data.landmarks[key].image + ')'"><div class="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" [ngClass]="{'bg-emerald-900/60': config.landmarks.includes(key), 'bg-black/40': !config.landmarks.includes(key)}"></div></div>
                <div class="absolute inset-0 z-10 flex flex-col items-center justify-center p-2 text-center">
                  <!-- <div class="w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all" [class.bg-white]="!config.landmarks.includes(key)" [class.text-emerald-700]="!config.landmarks.includes(key)" [class.bg-emerald-500]="config.landmarks.includes(key)" [class.text-white]="config.landmarks.includes(key)">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="data.landmarks[key].icon" /></svg>
                  </div> -->
                  <span class="text-white font-bold text-sm md:text-base leading-tight drop-shadow-md">{{ t().landmarks.items[key] }}</span>
                </div>
                <div *ngIf="config.landmarks.includes(key)" class="absolute top-2 right-2 bg-emerald-500 rounded-full p-1 z-20 shadow-md animate-scale-in"><svg class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg></div>
              </button>
            </div>
            <div *ngIf="profile() === 'expert' && expertLandmarkTab === 'catalog'" class="space-y-4">
              <div *ngFor="let cat of data.expertLandmarkResources" class="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div class="bg-slate-50 px-4 py-3 border-b border-slate-100 flex items-center justify-between"><h4 class="font-bold text-slate-700">{{ cat.category }}</h4><span class="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">{{ cat.resources.length }} Layer</span></div>
                <div class="divide-y divide-slate-100">
                  <label *ngFor="let res of cat.resources" class="flex items-center p-4 hover:bg-slate-50 cursor-pointer transition-colors"><div class="relative flex items-center"><input type="checkbox" [checked]="config.landmarks.includes(res.id)" (change)="toggleLandmark(res.id)" class="w-5 h-5 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"></div><div class="ml-3 text-sm"><span class="block font-medium text-slate-900" [class.text-emerald-900]="config.landmarks.includes(res.id)">{{ res.name }}</span><span class="block text-slate-500 text-xs mt-0.5" *ngIf="res.description">{{ res.description }}</span></div></label>
                </div>
              </div>
            </div>
          </div>

          <div *ngSwitchCase="4" class="space-y-8">
            <fieldset class="border-0 p-0 m-0">
              <legend class="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 block">{{ t().visuals.title }}</legend>
              <div *ngIf="profile() === 'simple'" class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button type="button" (click)="config.symbolStyle = 'symbols'" [attr.aria-pressed]="config.symbolStyle === 'symbols'" class="group relative h-48 rounded-2xl border-2 overflow-hidden text-left transition-all focus:outline-none focus:ring-4 focus:ring-emerald-500/50 flex flex-col" [class.border-emerald-500]="config.symbolStyle === 'symbols'" [class.border-slate-200]="config.symbolStyle !== 'symbols'">
                  <div class="flex-1 bg-slate-100 relative overflow-hidden">
                    <div class="absolute inset-0 opacity-30" style="background-image: radial-gradient(#94a3b8 1px, transparent 1px); background-size: 10px 10px;"></div>


                    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div class="w-12 h-12 rounded-full bg-blue-600/60 border-2 border-white shadow-lg flex items-center justify-center text-white">
                        <!-- <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="getPreviewIcon()" /></svg> -->
                         <img [src]="getPreviewImage()" class="w-8 h-8" alt="Symbol">
                      </div>
                    </div>
                 
                 
                 
                  </div>
                  <div class="p-3 bg-white border-t border-slate-100 flex justify-between items-center"><span class="font-bold text-slate-900 text-sm">{{ t().visuals.options['symbols'].name }}</span><div *ngIf="config.symbolStyle === 'symbols'" class="bg-emerald-500 text-white rounded-full p-1"><svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg></div></div>
                </button>
                <button type="button" (click)="config.symbolStyle = 'symbols_labels'" [attr.aria-pressed]="config.symbolStyle === 'symbols_labels'" class="group relative h-48 rounded-2xl border-2 overflow-hidden text-left transition-all focus:outline-none focus:ring-4 focus:ring-emerald-500/50 flex flex-col" [class.border-emerald-500]="config.symbolStyle === 'symbols_labels'" [class.border-slate-200]="config.symbolStyle !== 'symbols_labels'">
                  <div class="flex-1 bg-slate-100 relative overflow-hidden">
                    <div class="absolute inset-0 opacity-30" style="background-image: radial-gradient(#94a3b8 1px, transparent 1px); background-size: 10px 10px;"></div>


                    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                      <div class="w-12 h-12 rounded-full bg-blue-600/60 border-2 border-white shadow-lg flex items-center justify-center text-white relative z-10">
                        <!-- <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="getPreviewIcon()" /></svg> -->
                        <img [src]="getPreviewImage()" class="w-8 h-8" alt="Symbol">
                      </div>
                      <div class="mt-1 bg-white border-2 border-slate-200 rounded-lg shadow-sm px-2 py-0.5 text-xs font-bold text-slate-800 whitespace-nowrap z-0 -translate-y-2 pt-2">{{ t().landmarks.items[data.previewExampleLandmarkId] }}</div></div>
                  </div>
                  <div class="p-3 bg-white border-t border-slate-100 flex justify-between items-center"><span class="font-bold text-slate-900 text-sm">{{ t().visuals.options['symbols_labels'].name }}</span><div *ngIf="config.symbolStyle === 'symbols_labels'" class="bg-emerald-500 text-white rounded-full p-1"><svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg></div></div>
                </button>
                <button type="button" (click)="config.symbolStyle = 'photos'" [attr.aria-pressed]="config.symbolStyle === 'photos'" class="group relative h-48 rounded-2xl border-2 overflow-hidden text-left transition-all focus:outline-none focus:ring-4 focus:ring-emerald-500/50 flex flex-col" [class.border-emerald-500]="config.symbolStyle === 'photos'" [class.border-slate-200]="config.symbolStyle !== 'photos'">
                  <div class="flex-1 relative overflow-hidden bg-slate-100"><img [src]="data.assets.visualPreviewPhoto" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt=""><div class="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm shadow-sm whitespace-nowrap">Foto</div></div>
                  <div class="p-3 bg-white border-t border-slate-100 flex justify-between items-center"><span class="font-bold text-slate-900 text-sm">{{ t().visuals.options['photos'].name }}</span><div *ngIf="config.symbolStyle === 'photos'" class="bg-emerald-500 text-white rounded-full p-1"><svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg></div></div>
                </button>
              </div>
              <div *ngIf="profile() === 'expert'" class="space-y-3">
                <button *ngFor="let opt of ['symbols', 'symbols_labels', 'photos']" type="button" (click)="config.symbolStyle = opt" class="w-full p-4 rounded-xl border-2 flex items-center gap-4 text-left transition-all bg-white hover:border-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/50" [class.border-emerald-500]="config.symbolStyle === opt" [class.border-slate-200]="config.symbolStyle !== opt">
                  <div class="w-16 h-12 bg-white rounded border border-slate-200 flex items-center justify-center shadow-sm relative overflow-hidden shrink-0">
                     <ng-container *ngIf="opt === 'photos'"><img [src]="data.assets.visualPreviewPhoto" class="w-full h-full object-cover opacity-80" alt=""></ng-container>
                     <ng-container *ngIf="opt !== 'photos'"><div class="bg-slate-100 absolute inset-0"></div><div class="w-3 h-3 rounded-full bg-blue-500 border border-white relative z-10 shadow-sm"></div><div *ngIf="opt === 'symbols_labels'" class="ml-1 h-2 w-6 bg-white border border-slate-300 rounded shadow-sm relative z-10"></div></ng-container>
                  </div>
                  <div class="flex-1"><span class="font-bold text-slate-900 block">{{ t().visuals.options[opt].name }}</span><span *ngIf="t().visuals.options[opt].description" class="text-sm text-slate-500">{{ t().visuals.options[opt].description }}</span></div>
                  <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 border-slate-300" [class.border-emerald-500]="config.symbolStyle === opt"><div class="w-3 h-3 rounded-full bg-emerald-500" *ngIf="config.symbolStyle === opt"></div></div>
                </button>
              </div>
              <div *ngIf="config.symbolStyle === 'photos'" class="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-lg flex gap-3 animate-fade-in" role="alert">
                <svg class="w-5 h-5 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <p class="text-xs text-amber-800 leading-tight">{{ t().visuals.photoWarning }}</p>
              </div>
            </fieldset>
            <hr class="border-slate-200" />
            <section>
              <h3 class="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">{{ t().audio.title }}</h3>
              <button type="button" (click)="toggleSpeech()" [attr.aria-pressed]="config.speechOutput" class="w-full p-4 rounded-xl border-2 flex items-center gap-4 text-left transition-all active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-blue-500/50" [class.border-blue-400]="config.speechOutput" [class.bg-blue-50]="config.speechOutput" [class.border-slate-200]="!config.speechOutput" [class.bg-white]="!config.speechOutput">
                <div class="w-12 h-12 rounded-full flex items-center justify-center shrink-0" [class.bg-blue-200]="config.speechOutput" [class.bg-slate-100]="!config.speechOutput" [class.text-blue-700]="config.speechOutput" [class.text-slate-500]="!config.speechOutput" aria-hidden="true"><svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg></div>
                <div class="flex-1">
                  <div class="flex items-center justify-between"><span class="font-bold text-lg text-slate-900">{{ t().audio.btnTitle }}</span><div class="w-12 h-7 rounded-full p-1 transition-colors duration-200 ease-in-out" [class.bg-blue-500]="config.speechOutput" [class.bg-slate-300]="!config.speechOutput" aria-hidden="true"><div class="bg-white w-5 h-5 rounded-full shadow-sm transform transition-transform duration-200 ease-in-out" [class.translate-x-5]="config.speechOutput" [class.translate-x-0]="!config.speechOutput"></div></div></div>
                  <p *ngIf="t().audio.btnDesc" class="text-sm text-slate-500 mt-1">{{ t().audio.btnDesc }}</p>
                </div>
              </button>
            </section>
          </div>

          <div *ngSwitchCase="5" class="text-center py-6">
            <div class="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg></div>
            <h2 class="text-3xl font-bold text-slate-900 mb-4">{{ t().summary.title }}</h2>
            <p class="text-lg text-slate-600 mb-8">{{ t().summary.intro }}</p>
            <dl class="bg-white rounded-xl shadow-sm border border-slate-100 p-6 text-left space-y-3 mb-8">
               <div class="flex justify-between items-center border-b border-slate-50 pb-2"><dt class="text-slate-500">{{ t().summary.labels.location }}</dt><dd class="font-medium text-slate-900">{{ config.area || t().areas.locationBtnStart }}</dd></div>
               <div class="flex justify-between items-center border-b border-slate-50 pb-2"><dt class="text-slate-500">{{ t().summary.labels.style }}</dt><dd class="font-medium text-slate-900">{{ t().mapStyles[config.mapStyle].name }}</dd></div>
               <div class="flex justify-between items-center border-b border-slate-50 pb-2"><dt class="text-slate-500">{{ t().summary.labels.view }}</dt><dd class="font-medium text-slate-900">{{ t().viewModes[config.viewMode].name }}</dd></div>
               <div class="flex justify-between items-center border-b border-slate-50 pb-2"><dt class="text-slate-500">{{ t().summary.labels.orientation }}</dt><dd class="font-medium text-right text-slate-900">{{ config.landmarks.length || t().summary.values.noPoints }}</dd></div>
               <div class="flex justify-between items-center border-b border-slate-50 pb-2"><dt class="text-slate-500">{{ t().summary.labels.visual }}</dt><dd class="font-medium text-slate-900">{{ t().visuals.options[config.symbolStyle].name }}</dd></div>
               <div class="flex justify-between items-center"><dt class="text-slate-500">{{ t().summary.labels.audio }}</dt><dd class="font-medium" [class.text-emerald-600]="config.speechOutput">{{ config.speechOutput ? t().summary.values.active : t().summary.values.inactive }}</dd></div>
            </dl>
            <button class="w-full bg-emerald-600 hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-500/50 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-emerald-200 transform transition hover:scale-105 focus:scale-105 outline-none">{{ t().ui.finishBtn }}</button>
          </div>

        </div>
      </main>

      <footer class="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 z-40 flex gap-4 justify-between items-center safe-area-bottom" role="contentinfo">
        <button (click)="prevStep()" [disabled]="currentStep() === 0" [class.invisible]="currentStep() === 0" class="flex items-center text-slate-600 font-bold px-4 py-3 rounded-lg hover:bg-slate-50 focus:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 transition-all min-h-[48px]" [attr.aria-label]="t().ui.prevBtn"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg><span class="text-base">{{ t().ui.prevBtn }}</span></button>
        <button *ngIf="currentStep() < steps.length - 1" (click)="nextStep()" class="bg-slate-900 text-white font-bold px-6 py-3 rounded-xl shadow-md flex items-center gap-2 hover:bg-slate-800 active:bg-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-500 transition-all min-h-[48px]"><span class="text-base">{{ t().ui.nextBtn }}</span><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg></button>
      </footer>
    </div>
  `
})
export class App implements OnInit {
  currentStep = signal(0);
  profile = signal<ProfileType>('simple');
  t = computed(() => TEXTS[this.profile()]);
  data = DATA_CONFIG;
  
  // Tab State
  activeAreaTab = DATA_CONFIG.defaultAreaTab; // Default: 'location'
  expertSelectionTab = 'favorites';
  expertLandmarkTab = 'visual';

  // Geolocation State
  geolocationAvailable = true; 
  isDetectingLocation = false;
  locationError = '';
  detectedLocation: any = null;
  showLocationDetails = false;

  // Search State
  searchTerm = '';
  isSearching = false;
  searchResults: any[] = [];
  searchTimeout: any;

  config = {
    mapStyle: 'osm',
    area: '', // Start empty to force user interaction
    viewMode: 'twodimensional',
    landmarks: [] as string[],
    symbolStyle: 'symbols', 
    speechOutput: false 
  };

  steps = new Array(6);
  expertSelectedLevel = 'bezirke';
  viewModeKeys = ['twodimensional', 'twoandhalfdimensional', 'threedimensional'] as const;

  landmarkKeys = ['restaurant', 'church', 'stops', 'pharmacy', 'bank'] as const;

  progressPercentage = computed(() => {
    return ((this.currentStep() + 1) / this.steps.length) * 100;
  });

  ngOnInit() {
    this.checkGeolocation();
  }

  checkGeolocation() {
    if (!navigator.geolocation) {
      this.geolocationAvailable = false;
      this.activeAreaTab = 'selection'; // Fallback to list
    } else {
      this.geolocationAvailable = true;
    }
  }

  selectMapStyle(id: string) {
    this.config.mapStyle = id;
  }

  // --- AREA SELECTION LOGIC ---

  activateAreaTab(tab: string) {
    this.activeAreaTab = tab;
  }

  // GEOLOCATION LOGIC
  detectLocation() {
    if (!this.geolocationAvailable) return;
    
    this.isDetectingLocation = true;
    this.locationError = '';
    
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords = pos.coords;
        let address = '';
        
        // Reverse Geocode
        try {
          const url = `${DATA_CONFIG.geocoder.reverseUrl}?lat=${coords.latitude}&lon=${coords.longitude}&format=json`;
          const res = await fetch(url);
          const data = await res.json();
          address = data.display_name || '';
        } catch(e) { console.warn('Reverse geocode failed', e); }

        this.detectedLocation = { coords, address };
        this.isDetectingLocation = false;
        this.showLocationDetails = true; // Auto-show details on find
      },
      (err) => {
        console.error(err);
        this.isDetectingLocation = false;
        let msg = 'Standort nicht abrufbar.';
        switch(err.code) {
          case 1: msg = 'Keine Berechtigung für Standortzugriff.'; break;
          case 2: msg = 'Position nicht verfügbar.'; break;
          case 3: msg = 'Zeitüberschreitung bei der Ermittlung.'; break;
        }
        this.locationError = `Fehler: ${msg} (${err.message})`;
      },
      { timeout: 10000, maximumAge: 60000, enableHighAccuracy: false }
    );
  }

  toggleLocationDetails() {
    this.showLocationDetails = !this.showLocationDetails;
  }

  useLocation() {
    if (!this.detectedLocation) return;
    // Set config area to address or generic label + coords
    const label = this.detectedLocation.address 
      ? this.detectedLocation.address 
      : `Standort (${this.detectedLocation.coords.latitude.toFixed(4)}, ${this.detectedLocation.coords.longitude.toFixed(4)})`;
    
    this.config.area = label;
  }

  // SEARCH LOGIC (Nominatim)
  onSearchInput() {
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => this.performSearch(), DATA_CONFIG.geocoder.debounceMs);
  }

  async performSearch() {
    if (this.searchTerm.length < 3) {
      this.searchResults = [];
      return;
    }
    
    this.isSearching = true;
    try {
      const url = `${DATA_CONFIG.geocoder.searchUrl}?q=${encodeURIComponent(this.searchTerm)}&format=json&limit=${DATA_CONFIG.geocoder.limit}&addressdetails=1`;
      const res = await fetch(url);
      const data = await res.json();
      this.searchResults = data;
    } catch (e) {
      console.error('Geocoding error', e);
      this.searchResults = [];
    } finally {
      this.isSearching = false;
    }
  }

  selectSearchResult(result: any) {
    this.config.area = result.display_name;
  }

  toggleArea(area: string) {
    if (this.config.area === area) {
      this.config.area = ''; 
    } else {
      this.config.area = area;
    }
  }

  // ------------------------------------------------

  toggleLandmark(id: string) {
    const index = this.config.landmarks.indexOf(id);
    if (index > -1) {
      this.config.landmarks.splice(index, 1);
    } else {
      this.config.landmarks.push(id);
    }
  }

  toggleSpeech() {
    this.config.speechOutput = !this.config.speechOutput;
  }

  toggleProfile() {
    this.profile.update(p => p === 'simple' ? 'expert' : 'simple');
    // Reset defaults
    this.activeAreaTab = this.geolocationAvailable ? 'location' : 'selection';
    this.config.area = '';
    this.searchTerm = '';
    this.searchResults = [];
    this.detectedLocation = null;
    this.showLocationDetails = false;
    this.config.landmarks = []; 
  }

  nextStep() {
    if (this.currentStep() < this.steps.length - 1) {
      this.currentStep.update(v => v + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => document.getElementById('main-content')?.focus(), 100);
    }
  }

  prevStep() {
    if (this.currentStep() > 0) {
      this.currentStep.update(v => v - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  getExpertFeatures() {
    return this.data.expertSpatialUnits.find(l => l.id === this.expertSelectedLevel)?.features || [];
  }

  getPreviewIcon() {
    // Return icon for the example landmark defined in config
    return this.data.landmarks[DATA_CONFIG.previewExampleLandmarkId as keyof typeof this.data.landmarks].icon;
  }
  getPreviewImage() {
    // Return icon for the example landmark defined in config
    return this.data.landmarks[DATA_CONFIG.previewExampleLandmarkId as keyof typeof this.data.landmarks].image;
  }
}