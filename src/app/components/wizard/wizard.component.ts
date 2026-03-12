import { Component, signal, computed, effect, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TtsIconComponent } from '../tts-icon/tts-icon.component';
import { MapPreviewComponent } from '../map-preview/map-preview.component';
import { TtsService } from '../../services/tts.service';

// Import der Konfigurationsdaten und Typen
import { DATA_CONFIG, TEXTS, ProfileType } from '../../app.config.data';

@Component({
  selector: 'app-wizard',
  standalone: true,
  imports: [CommonModule, FormsModule, TtsIconComponent, MapPreviewComponent],
  template: `
    <div class="min-h-screen bg-slate-50 font-sans text-slate-800 pb-28 relative overflow-hidden flex flex-col">
      
      <!-- Top Bar -->
      <header class="bg-white sticky top-0 z-30 shadow-sm safe-area-top" role="banner">
        <div class="px-4 py-3 flex items-center justify-between">
          <h1 class="text-lg font-bold text-slate-900 truncate flex-1" [attr.aria-label]="t().ui.appTitle">
            {{ t().ui.appTitle }}
            <app-tts-icon [text]="t().ui.appTitle"></app-tts-icon>
          </h1>
          <div class="flex items-center gap-2">
            <!-- TTS Settings Toggle -->
            <div class="relative">
              <button 
                (click)="goToTtsSettings()" 
                class="p-2 rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
                [class.bg-emerald-500]="ttsService.isTtsActive()"
                [class.text-white]="ttsService.isTtsActive()"
                [class.bg-white]="!ttsService.isTtsActive()"
                [class.text-slate-600]="!ttsService.isTtsActive()"
                title="Vorleseeinstellungen"
              >
                <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20" fill="currentColor">
                  <path d="M560-131v-82q90-26 145-100t55-167q0-93-55-167T560-747v-82q123 28 201.5 125.5T840-480q0 127-78.5 224.5T560-131ZM120-360v-240h160l200-200v640L280-360H120Zm440 40v-320q47 15 73.5 56.5T660-480q0 47-26.5 88.5T560-320ZM400-606l-86 86H200v80h114l86 86v-252ZM300-480Z"/>
                </svg>
              </button>
            </div>

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
            {{ t().ui.stepIndicator }} {{ currentStep() + 1 }} {{ t().ui.stepIndicatorSeparator }} {{ steps.length }}
            <app-tts-icon [text]="t().ui.stepIndicator + ' ' + (currentStep() + 1) + ' ' + t().ui.stepIndicatorSeparator + ' ' + steps.length"></app-tts-icon>
          </span>
          <h2 class="text-2xl font-bold mb-2 text-slate-900 leading-tight">
            {{ t().steps[currentStep()].title }}
            <app-tts-icon [text]="t().steps[currentStep()].title"></app-tts-icon>
          </h2>
          <p *ngIf="t().steps[currentStep()].description" class="text-slate-500 text-base md:text-lg max-w-lg mx-auto">
            {{ t().steps[currentStep()].description }}
            <app-tts-icon [text]="t().steps[currentStep()].description"></app-tts-icon>
          </p>
        </div>

        <div [ngSwitch]="currentStep()">

        <!-- STEP 0: BEREICH (War Step 2 im Original-Code, aber Case 0 hier) -->
          <div *ngSwitchCase="0" class="max-w-lg mx-auto">
            
            <div class="flex rounded-xl bg-slate-100 p-1 mb-6 shadow-inner">
              
              <button (click)="activateAreaTab('selection')"
                class="flex-1 py-2.5 px-4 rounded-lg text-sm font-bold transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500"
                [class.bg-white]="activeAreaTab === 'selection'" [class.text-slate-900]="activeAreaTab === 'selection'" [class.shadow-sm]="activeAreaTab === 'selection'" [class.text-slate-500]="activeAreaTab !== 'selection'" [class.hover:text-slate-700]="activeAreaTab !== 'selection'">
                <span class="flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="data.icons.tabList" /></svg>
                  <span class="hidden sm:inline">{{ t().areas.tabSelection }}</span>
                  <app-tts-icon [text]="t().areas.tabSelection"></app-tts-icon>
                </span>
              </button>
              <button *ngIf="geolocationAvailable" (click)="activateAreaTab('location')"
                class="flex-1 py-2.5 px-4 rounded-lg text-sm font-bold transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500"
                [class.bg-white]="activeAreaTab === 'location'" [class.text-slate-900]="activeAreaTab === 'location'" [class.shadow-sm]="activeAreaTab === 'location'" [class.text-slate-500]="activeAreaTab !== 'location'" [class.hover:text-slate-700]="activeAreaTab !== 'location'">
                <span class="flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="data.icons.tabLocation" /></svg>
                  <span class="hidden sm:inline">{{ t().areas.tabLocation }}</span>
                  <app-tts-icon [text]="t().areas.tabLocation"></app-tts-icon>
                </span>
              </button>
              <button (click)="activateAreaTab('search')"
                class="flex-1 py-2.5 px-4 rounded-lg text-sm font-bold transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500"
                [class.bg-white]="activeAreaTab === 'search'" [class.text-slate-900]="activeAreaTab === 'search'" [class.shadow-sm]="activeAreaTab === 'search'" [class.text-slate-500]="activeAreaTab !== 'search'" [class.hover:text-slate-700]="activeAreaTab !== 'search'">
                <span class="flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="data.icons.tabSearch" /></svg>
                  <span class="hidden sm:inline">{{ t().areas.tabSearch }}</span>
                  <app-tts-icon [text]="t().areas.tabSearch"></app-tts-icon>
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
                  <h3 class="text-xl font-bold text-blue-900 mb-2">
                    {{ t().areas.locationBtnStart }}
                    <app-tts-icon [text]="t().areas.locationBtnStart"></app-tts-icon>
                  </h3>
                  <p class="text-blue-700/80 mb-6">
                    {{ t().areas.locationDesc }}
                    <app-tts-icon [text]="t().areas.locationDesc"></app-tts-icon>
                  </p>
                  <button (click)="detectLocation()" [disabled]="isDetectingLocation" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                    <span>{{ t().areas.locationBtnStart }}</span>
                    <app-tts-icon [text]="t().areas.locationBtnStart"></app-tts-icon>
                  </button>
                  <p *ngIf="locationError" class="text-red-500 text-sm mt-3 font-medium bg-red-50 p-2 rounded border border-red-100">
                    {{ locationError }}
                    <app-tts-icon [text]="locationError"></app-tts-icon>
                  </p>
                </div>
                <div *ngIf="detectedLocation" class="animate-scale-in">
                  <h3 class="text-xl font-bold text-emerald-800 mb-1">
                    {{ t().ui.locationFound }}
                    <app-tts-icon [text]="t().ui.locationFound"></app-tts-icon>
                  </h3>
                  <p class="text-blue-900/70 mb-4 text-sm font-medium">
                    {{ detectedLocation.address || (detectedLocation.coords.latitude.toFixed(4) + ', ' + detectedLocation.coords.longitude.toFixed(4)) }}
                    <app-tts-icon [text]="detectedLocation.address || t().ui.coordinatesFound"></app-tts-icon>
                  </p>
                  <button (click)="useLocation()" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2 mb-4">
                    <span>{{ t().areas.locationBtnConfirm }}</span>
                    <app-tts-icon [text]="t().areas.locationBtnConfirm"></app-tts-icon>
                    <svg *ngIf="config.area.includes('Standort') || config.area.includes(detectedLocation.address || '')" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
                  </button>
                  <button (click)="toggleLocationDetails()" class="text-blue-600 text-sm font-semibold hover:underline flex items-center justify-center gap-1 mx-auto">
                    {{ showLocationDetails ? t().areas.hideDetails : t().areas.showDetails }}
                    <app-tts-icon [text]="showLocationDetails ? t().areas.hideDetails : t().areas.showDetails"></app-tts-icon>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform duration-200" [class.rotate-180]="showLocationDetails" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- Tab Content Selection -->
            <div *ngIf="activeAreaTab === 'selection'" class="animate-fade-in">
               <div *ngIf="profile() === 'expert'" class="flex items-center space-x-2 border-b border-slate-200 mb-4">
                 <button (click)="expertSelectionTab = 'favorites'" class="pb-2 px-1 text-sm font-medium transition-colors border-b-2"
                   [class.border-emerald-500]="expertSelectionTab === 'favorites'" [class.text-emerald-700]="expertSelectionTab === 'favorites'" [class.border-transparent]="expertSelectionTab !== 'favorites'" [class.text-slate-500]="expertSelectionTab !== 'favorites'">{{ t().areas.subTabFavorites }}</button>
                 <app-tts-icon [text]="t().areas.subTabFavorites"></app-tts-icon>
                 
                 <button (click)="expertSelectionTab = 'hierarchy'" class="pb-2 px-1 text-sm font-medium transition-colors border-b-2"
                   [class.border-emerald-500]="expertSelectionTab === 'hierarchy'" [class.text-emerald-700]="expertSelectionTab === 'hierarchy'" [class.border-transparent]="expertSelectionTab !== 'hierarchy'" [class.text-slate-500]="expertSelectionTab !== 'hierarchy'">{{ t().areas.subTabAdmin }}</button>
                 <app-tts-icon [text]="t().areas.subTabAdmin"></app-tts-icon>
               </div>
               <h3 *ngIf="profile() === 'simple'" class="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4" id="area-label">
                 {{ t().areas.manualSelectionTitle }}
                 <app-tts-icon [text]="t().areas.manualSelectionTitle"></app-tts-icon>
               </h3>
               
               <div *ngIf="profile() === 'simple' || (profile() === 'expert' && expertSelectionTab === 'favorites')" class="grid grid-cols-1 gap-4">
                  <div *ngFor="let place of data.simplePlaces" class="relative group">
                    <button (click)="toggleArea(place.name)" [attr.aria-pressed]="config.area === place.name"
                      class="w-full relative h-40 rounded-xl overflow-hidden border-2 text-left transition-all focus:outline-none focus:ring-4 focus:ring-emerald-500/50"
                      [class.border-emerald-500]="config.area === place.name" [class.border-transparent]="config.area !== place.name">
                      <div class="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" [style.background-image]="'url(' + place.image + ')'"><div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div></div>
                      <div class="absolute bottom-0 left-0 p-4 z-10 w-full flex justify-between items-end">
                        <span class="text-white font-bold text-xl">{{ place.name }}</span>
                        <div *ngIf="config.area === place.name" class="bg-emerald-500 text-white rounded-full p-1 animate-scale-in"><svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg></div>
                      </div>
                    </button>
                    <div class="absolute top-2 right-2 z-20 bg-white/80 rounded-full">
                      <app-tts-icon [text]="place.ttsText || place.name"></app-tts-icon>
                    </div>
                  </div>
               </div>

               <div *ngIf="profile() === 'expert' && expertSelectionTab === 'hierarchy'" class="space-y-4 bg-white p-4 rounded-xl border border-slate-200">
                  <div>
                    <label class="block text-xs font-semibold text-slate-500 mb-1">
                      {{ t().areas.spatialLevelLabel }}
                      <app-tts-icon *ngIf="t().areas.spatialLevelLabel" [text]="t().areas.spatialLevelLabel || ''"></app-tts-icon>
                    </label>
                    <div class="flex flex-wrap gap-2">
                      <div *ngFor="let level of data.expertSpatialUnits" class="flex items-center gap-1">
                        <button (click)="expertSelectedLevel = level.id"
                          class="px-3 py-2 rounded-lg text-sm font-medium border transition-colors"
                          [class.bg-slate-800]="expertSelectedLevel === level.id" [class.text-white]="expertSelectedLevel === level.id" [class.border-slate-800]="expertSelectedLevel === level.id" [class.bg-white]="expertSelectedLevel !== level.id" [class.text-slate-600]="expertSelectedLevel !== level.id" [class.border-slate-300]="expertSelectedLevel !== level.id">{{ level.name }}</button>
                        <app-tts-icon [text]="level.name"></app-tts-icon>
                      </div>
                    </div>
                  </div>
                  <div class="max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                    <div class="grid grid-cols-2 gap-2">
                       <div *ngFor="let feat of getExpertFeatures()" class="flex items-center gap-1 bg-white border border-slate-200 p-1 rounded">
                         <button (click)="toggleArea(feat)" class="flex-1 p-2 text-sm text-left border-0 transition-colors hover:bg-slate-50 focus:ring-2 focus:ring-emerald-500"
                            [class.bg-emerald-50]="config.area === feat" [class.text-emerald-800]="config.area === feat">
                            {{ feat }}
                         </button>
                         <app-tts-icon [text]="feat"></app-tts-icon>
                       </div>
                    </div>
                  </div>
               </div>
            </div>

            <!-- Tab Content Search -->
            <div *ngIf="activeAreaTab === 'search'" class="animate-fade-in space-y-4">
              <div class="relative flex items-center gap-2">
                <div class="relative flex-1">
                  <input type="text" [(ngModel)]="searchTerm" (input)="onSearchInput()" [placeholder]="t().areas.searchPlaceholder"
                    class="w-full pl-4 pr-12 py-4 rounded-xl border-2 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-lg shadow-sm bg-white transition-all"
                    [class.border-emerald-500]="config.area === searchTerm && searchTerm.length > 0" [class.border-slate-300]="config.area !== searchTerm">
                  <div class="absolute right-4 top-1/2 transform -translate-y-1/2">
                     <div *ngIf="isSearching" class="animate-spin h-5 w-5 border-2 border-emerald-500 border-t-transparent rounded-full"></div>
                     <svg *ngIf="!isSearching" class="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="data.icons.tabSearch" /></svg>
                  </div>
                </div>
                <app-tts-icon [text]="t().areas.searchPlaceholder"></app-tts-icon>
              </div>
              <div *ngIf="searchResults.length > 0" class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                 <div class="bg-slate-50 px-4 py-2 text-xs font-bold text-slate-500 border-b border-slate-100 uppercase tracking-wider flex justify-between items-center">
                   <span>{{ t().areas.searchResultLabel }}</span>
                   <app-tts-icon [text]="t().areas.searchResultLabel"></app-tts-icon>
                 </div>
                 <div class="divide-y divide-slate-100">
                   <div *ngFor="let result of searchResults" class="flex items-center gap-2 p-2 hover:bg-emerald-50 transition-colors" [class.bg-emerald-50]="config.area === result.display_name">
                     <button (click)="selectSearchResult(result)" class="flex-1 text-left p-2 flex items-start gap-3 group">
                       <div class="mt-0.5 text-slate-400 group-hover:text-emerald-600">
                          <svg *ngIf="result.class === 'place' || result.type === 'administrative'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="data.icons.searchResultPlace" /></svg>
                          <svg *ngIf="result.class === 'building' || result.type === 'house'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="data.icons.searchResultBuilding" /></svg>
                          <svg *ngIf="result.class !== 'place' && result.class !== 'building' && result.type !== 'administrative'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="data.icons.searchResultGeneric" /></svg>
                       </div>
                       <div><span class="block font-medium text-slate-900 text-sm leading-tight">{{ result.display_name }}</span><span class="text-xs text-slate-500">{{ result.type }}</span></div>
                       <div *ngIf="config.area === result.display_name" class="ml-auto text-emerald-600"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg></div>
                     </button>
                     <app-tts-icon [text]="result.display_name"></app-tts-icon>
                   </div>
                 </div>
              </div>
            </div>
          </div>

          <!-- STEP 1: BASIS KARTE -->
          <fieldset *ngSwitchCase="1" class="border-0 m-0 p-0">
            <legend class="sr-only">{{ t().steps[0].title }}</legend>
            <div class="grid gap-4" 
                 [ngClass]="{
                   'grid-cols-1 md:grid-cols-3': profile() === 'expert',
                   'grid-cols-1 md:grid-cols-2': profile() === 'simple'
                 }">
              <div *ngFor="let map of data.mapStyles" class="relative group">
                <button 
                  type="button"
                  (click)="selectMapStyle(map.id)"
                  [attr.aria-pressed]="config.mapStyle === map.id"
                  class="relative overflow-hidden rounded-2xl border-2 transition-all duration-200 text-left w-full shadow-sm hover:shadow-md focus:outline-none focus:ring-4 focus:ring-emerald-500/50"
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
                <div class="absolute top-2 right-2 z-20 bg-white/80 rounded-full">
                  <app-tts-icon [text]="map.ttsText || t().mapStyles[map.id].name + (t().mapStyles[map.id].description ? '. ' + t().mapStyles[map.id].description : '')"></app-tts-icon>
                </div>
              </div>
            </div>
          </fieldset>

          <!-- STEP 2: Ansicht -->
          <fieldset *ngSwitchCase="2" class="space-y-6 border-0 p-0 m-0">
             <legend class="sr-only">{{ t().steps[2].title }}</legend>
             <div *ngFor="let mode of viewModeKeys" 
                  class="rounded-xl border-2 overflow-hidden transition-all bg-white" 
                  [class.border-emerald-500]="config.viewMode === mode" 
                  [class.ring-2]="config.viewMode === mode" 
                  [class.ring-emerald-100]="config.viewMode === mode" 
                  [class.border-slate-200]="config.viewMode !== mode"
                  [class.opacity-60]="t().viewModes[mode].disabled"
                  [class.grayscale]="t().viewModes[mode].disabled">
               
               <div class="relative w-full p-4 text-left flex items-center justify-between bg-slate-50 border-b border-slate-100"
                    [class.bg-slate-200]="t().viewModes[mode].disabled">
                 <button type="button" (click)="onViewModeClick(mode)" class="flex-1 text-left focus:outline-none" [attr.aria-disabled]="t().viewModes[mode].disabled">
                   <div>
                     <span class="font-bold text-lg text-slate-900 block flex items-center gap-2">
                       {{ t().viewModes[mode].name }}
                       <span *ngIf="t().viewModes[mode].disabled" class="text-xs bg-slate-500 text-white px-2 py-0.5 rounded-full uppercase">{{ t().ui.notAvailableBadge }}</span>
                     </span>
                     <span *ngIf="t().viewModes[mode].description" class="text-sm text-slate-500">{{ t().viewModes[mode].description }}</span>
                     <span *ngIf="t().viewModes[mode].disabled && t().viewModes[mode].disabledText" class="text-sm text-red-600 font-bold block mt-1">{{ t().viewModes[mode].disabledText }}</span>
                   </div>
                 </button>
                 <div class="flex items-center gap-4">
                   <app-tts-icon [text]="t().viewModes[mode].name + (t().viewModes[mode].description ? '. ' + t().viewModes[mode].description : '') + (t().viewModes[mode].disabled ? '. ' + t().viewModes[mode].disabledText : '')"></app-tts-icon>
                   <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center bg-white border-slate-300" [class.border-emerald-500]="config.viewMode === mode && !t().viewModes[mode].disabled">
                     <div class="w-3 h-3 rounded-full bg-emerald-500" *ngIf="config.viewMode === mode && !t().viewModes[mode].disabled"></div>
                   </div>
                 </div>
               </div>
               <div class="h-32 md:h-48 w-full bg-slate-100 relative"><img [src]="data.viewModeImages[mode]" class="w-full h-full object-cover" alt="" aria-hidden="true"></div>
             </div>
          </fieldset>

          <!-- STEP 3: Wichtige Orte -->
          <div *ngSwitchCase="3" class="space-y-6">
            <!-- Bedienhinweis Landmarken -->
            <div class="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-4 items-start animate-fade-in shadow-sm">
               <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white shrink-0 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
               </div>
               <div>
                 <p class="text-blue-900 font-bold leading-tight">
                    {{ t().landmarks.instruction }}
                    <app-tts-icon [text]="t().landmarks.instruction"></app-tts-icon>
                 </p>
               </div>
            </div>

            <h3 class="text-sm font-bold text-slate-500 uppercase tracking-wider text-center mb-4">
              {{ profile() === 'simple' ? t().landmarks.title : t().landmarks.expertTitle }}
              <app-tts-icon [text]="profile() === 'simple' ? t().landmarks.title : t().landmarks.expertTitle || ''"></app-tts-icon>
            </h3>

            <div *ngIf="profile() === 'expert'" class="flex items-center space-x-2 border-b border-slate-200 mb-4">
               <button (click)="expertLandmarkTab = 'visual'" class="pb-2 px-1 text-sm font-medium transition-colors border-b-2" [class.border-emerald-500]="expertLandmarkTab === 'visual'" [class.text-emerald-700]="expertLandmarkTab === 'visual'" [class.border-transparent]="expertLandmarkTab !== 'visual'" [class.text-slate-500]="expertLandmarkTab !== 'visual'">{{ t().landmarks.subTabVisual }}</button>
               <app-tts-icon [text]="t().landmarks.subTabVisual"></app-tts-icon>
               
               <button (click)="expertLandmarkTab = 'catalog'" class="pb-2 px-1 text-sm font-medium transition-colors border-b-2" [class.border-emerald-500]="expertLandmarkTab === 'catalog'" [class.text-emerald-700]="expertLandmarkTab === 'catalog'" [class.border-transparent]="expertLandmarkTab !== 'catalog'" [class.text-slate-500]="expertLandmarkTab !== 'catalog'">{{ t().landmarks.subTabCatalog }}</button>
               <app-tts-icon [text]="t().landmarks.subTabCatalog"></app-tts-icon>
            </div>

            <!-- SIMPLE MODE CATEGORIZED VIEW -->
            <div *ngIf="profile() === 'simple'" class="space-y-12 pb-10">
              <div *ngFor="let cat of data.simpleLandmarkCategories; let i = index; let last = last" 
                   class="bg-white rounded-[2rem] border-2 border-slate-200 shadow-xl overflow-hidden animate-fade-in relative">
                
                <!-- Kategorie-Nummer (Index) als Orientierungshilfe -->
                <div class="absolute top-0 right-0 bg-slate-100 text-slate-400 text-[10px] font-black px-3 py-1 rounded-bl-xl border-l border-b border-slate-200 uppercase tracking-widest">
                  {{ i + 1 }} / {{ data.simpleLandmarkCategories.length }}
                </div>

                <!-- Kategorie Header -->
                <div class="p-6 border-b-2 border-slate-100 bg-slate-50/50">
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div class="flex items-center gap-4">
                      <div class="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-md border border-emerald-100 shrink-0">
                         <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="cat.icon" /></svg>
                      </div>
                      <div>
                        <span class="font-black text-2xl text-slate-900 block leading-tight">
                          {{ cat.name }}
                          <app-tts-icon [text]="(cat.ttsText || cat.name) + '. ' + getSelectedCountInCategory(cat.id) + ' ' + t().landmarks.itemsSelectedSuffix"></app-tts-icon>
                        </span>
                        <span class="text-sm font-bold text-emerald-600 uppercase tracking-wide">
                          {{ getSelectedCountInCategory(cat.id) }} {{ t().landmarks.itemsSelectedSuffix }}
                        </span>
                      </div>
                    </div>
                    
                    <button (click)="toggleLandmarkCategory(cat.id)" 
                      class="w-full sm:w-auto px-6 py-3 rounded-xl text-base font-black transition-all shadow-md active:scale-95 border-3"
                      [class.bg-emerald-600]="isCategoryFullySelected(cat.id)" [class.text-white]="isCategoryFullySelected(cat.id)" [class.border-emerald-700]="isCategoryFullySelected(cat.id)"
                      [class.bg-white]="!isCategoryFullySelected(cat.id)" [class.text-emerald-700]="!isCategoryFullySelected(cat.id)" [class.border-emerald-500]="!isCategoryFullySelected(cat.id)">
                      <span class="flex items-center justify-center gap-2">
                        <svg *ngIf="isCategoryFullySelected(cat.id)" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
                        {{ isCategoryFullySelected(cat.id) ? t().landmarks.deselectAll : t().landmarks.selectAll }}
                      </span>
                    </button>
                  </div>
                </div>

                <!-- Unterkategorien Grid -->
                <div class="p-4 sm:p-6 bg-white">
                  <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div *ngFor="let key of cat.items" class="relative group">
                      <button (click)="toggleLandmark(key)" 
                        class="w-full relative h-44 rounded-2xl overflow-hidden border-3 text-left transition-all focus:outline-none focus:ring-4 focus:ring-emerald-500/50" 
                        [class.border-emerald-500]="config.landmarks.includes(key)" 
                        [class.border-slate-100]="!config.landmarks.includes(key)"
                        [class.shadow-inner]="config.landmarks.includes(key)">
                        <div class="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" [style.background-image]="'url(' + getLandmarkData(key).image + ')'">
                          <div class="absolute inset-0 transition-colors duration-300" 
                               [ngClass]="{'bg-emerald-600/40': config.landmarks.includes(key), 'bg-black/20': !config.landmarks.includes(key)}">
                          </div>
                        </div>
                        <div class="absolute inset-0 z-10 flex flex-col items-center justify-center p-3 text-center">
                          <span class="text-white font-black text-lg leading-tight drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">{{ t().landmarks.items[key] }}</span>
                        </div>
                        <div *ngIf="config.landmarks.includes(key)" class="absolute top-2 right-2 bg-emerald-500 text-white rounded-full p-1.5 z-20 shadow-lg border-2 border-white animate-scale-in">
                          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M5 13l4 4L19 7" /></svg>
                        </div>
                      </button>
                      <div class="absolute bottom-2 left-2 z-20">
                        <app-tts-icon [text]="(getLandmarkData(key).ttsText || t().landmarks.items[key])"></app-tts-icon>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- EXPERT MODE VISUAL TAB (Original style) -->
            <div *ngIf="profile() === 'expert' && expertLandmarkTab === 'visual'" class="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div *ngFor="let key of landmarkKeys" class="relative group">
                <button (click)="toggleLandmark(key)" class="w-full relative h-60 rounded-xl overflow-hidden border-2 text-left transition-all focus:outline-none focus:ring-4 focus:ring-emerald-500/50" [class.border-emerald-500]="config.landmarks.includes(key)" [class.border-slate-200]="!config.landmarks.includes(key)">
                  <div class="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" [style.background-image]="'url(' + data.landmarks[key].image + ')'"><div class="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" [ngClass]="{'bg-emerald-900/60': config.landmarks.includes(key), 'bg-black/40': !config.landmarks.includes(key)}"></div></div>
                  <div class="absolute inset-0 z-10 flex flex-col items-center justify-center p-2 text-center">
                    <span class="text-white font-bold text-sm md:text-base leading-tight drop-shadow-md">{{ t().landmarks.items[key] }}</span>
                  </div>
                  <div *ngIf="config.landmarks.includes(key)" class="absolute top-2 right-2 bg-emerald-500 rounded-full p-1 z-20 shadow-md animate-scale-in"><svg class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg></div>
                </button>
                <div class="absolute top-2 left-2 z-20 bg-white/80 rounded-full">
                  <app-tts-icon [text]="(data.landmarks[key].ttsText || t().landmarks.items[key])"></app-tts-icon>
                </div>
              </div>
            </div>
            <div *ngIf="profile() === 'expert' && expertLandmarkTab === 'catalog'" class="space-y-4">
              <div *ngFor="let cat of data.expertLandmarkResources" class="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div class="bg-slate-50 px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                  <h4 class="font-bold text-slate-700">
                    {{ cat.category }}
                    <app-tts-icon [text]="cat.category"></app-tts-icon>
                  </h4>
                  <span class="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">{{ cat.resources.length }} Layer</span>
                </div>
                <div class="divide-y divide-slate-100">
                  <div *ngFor="let res of cat.resources" class="flex items-center p-4 hover:bg-slate-50 transition-colors">
                    <label class="flex-1 flex items-center cursor-pointer">
                      <div class="relative flex items-center"><input type="checkbox" [checked]="config.landmarks.includes(res.id)" (change)="toggleLandmark(res.id)" class="w-5 h-5 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"></div>
                      <div class="ml-3 text-sm"><span class="block font-medium text-slate-900" [class.text-emerald-900]="config.landmarks.includes(res.id)">{{ res.name }}</span><span class="block text-slate-500 text-xs mt-0.5" *ngIf="res.description">{{ res.description }}</span></div>
                    </label>
                    <app-tts-icon [text]="res.name + (res.description ? '. ' + res.description : '')"></app-tts-icon>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- STEP 4: Aussehen -->
          <div *ngSwitchCase="4" class="space-y-8">
            <fieldset class="border-0 p-0 m-0">
              <legend class="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 block">
                {{ t().visuals.title }}
                <app-tts-icon [text]="t().visuals.title"></app-tts-icon>
              </legend>
              <div *ngIf="profile() === 'simple'" class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div *ngFor="let opt of ['symbols', 'symbols_labels', 'photos']" class="relative group"
                     [class.opacity-60]="t().visuals.options[opt].disabled"
                     [class.grayscale]="t().visuals.options[opt].disabled">
                  <button type="button" (click)="selectSymbolStyle(opt)" [attr.aria-pressed]="config.symbolStyle === opt" 
                    class="w-full relative h-48 rounded-2xl border-2 overflow-hidden text-left transition-all focus:outline-none focus:ring-4 focus:ring-emerald-500/50 flex flex-col" 
                    [class.border-emerald-500]="config.symbolStyle === opt" 
                    [class.border-slate-200]="config.symbolStyle !== opt"
                    [class.cursor-not-allowed]="t().visuals.options[opt].disabled">
                    <div class="flex-1 bg-slate-100 relative overflow-hidden">
                      <div class="absolute inset-0 opacity-30" style="background-image: radial-gradient(#94a3b8 1px, transparent 1px); background-size: 10px 10px;"></div>
                      
                      <!-- Preview logic matching Step 6 -->
                      <div *ngIf="opt === 'symbols'" class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 scale-75">
                        <div class="marker-pin !static" style="background: #3b82f6;">
                          <div class="marker-pin-inner">
                             <img [src]="getPreviewImage()" style="padding: 5px;">
                          </div>
                        </div>
                      </div>
                      <div *ngIf="opt === 'symbols_labels'" class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 scale-75">
                        <div class="marker-pin !static" style="background: #3b82f6;">
                          <div class="marker-pin-inner">
                             <img [src]="getPreviewImage()" style="padding: 5px;">
                          </div>
                          <div class="marker-label">{{ t().landmarks.items[data.previewExampleLandmarkId] }}</div>
                        </div>
                      </div>
                      <div *ngIf="opt === 'photos'" class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 scale-75">
                        <div class="marker-pin !static">
                          <div class="marker-pin-inner">
                             <img [src]="data.assets.visualPreviewPhoto" class="w-full h-full object-cover">
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="p-3 bg-white border-t border-slate-100 flex justify-between items-center">
                      <div>
                        <span class="font-bold text-slate-900 text-sm block">{{ t().visuals.options[opt].name }}</span>
                        <span *ngIf="t().visuals.options[opt].disabled" class="text-[10px] bg-slate-500 text-white px-1.5 py-0.5 rounded uppercase mt-1 inline-block">{{ t().ui.notAvailableBadge }}</span>
                      </div>
                      <div *ngIf="config.symbolStyle === opt" class="bg-emerald-500 text-white rounded-full p-1"><svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg></div>
                    </div>
                  </button>
                  <div class="absolute top-2 right-2 z-20 bg-white/80 rounded-full">
                    <app-tts-icon [text]="t().visuals.options[opt].name + (t().visuals.options[opt].disabled ? '. ' + t().visuals.options[opt].disabledText : '')"></app-tts-icon>
                  </div>
                </div>
              </div>
              <div *ngIf="profile() === 'expert'" class="space-y-3">
                <div *ngFor="let opt of ['symbols', 'symbols_labels', 'photos']" class="flex items-center gap-2"
                     [class.opacity-60]="t().visuals.options[opt].disabled"
                     [class.grayscale]="t().visuals.options[opt].disabled">
                  <button type="button" (click)="selectSymbolStyle(opt)" 
                    class="flex-1 p-4 rounded-xl border-2 flex items-center gap-4 text-left transition-all bg-white hover:border-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/50" 
                    [class.border-emerald-500]="config.symbolStyle === opt" 
                    [class.border-slate-200]="config.symbolStyle !== opt"
                    [class.cursor-not-allowed]="t().visuals.options[opt].disabled">
                    <div class="w-16 h-12 bg-white rounded border border-slate-200 flex items-center justify-center shadow-sm relative overflow-hidden shrink-0">
                       <ng-container *ngIf="opt === 'photos'"><img [src]="data.assets.visualPreviewPhoto" class="w-full h-full object-cover opacity-80" alt=""></ng-container>
                       <ng-container *ngIf="opt !== 'photos'"><div class="bg-slate-100 absolute inset-0"></div><div class="w-3 h-3 rounded-full bg-blue-500 border border-white relative z-10 shadow-sm"></div><div *ngIf="opt === 'symbols_labels'" class="ml-1 h-2 w-6 bg-white border border-slate-300 rounded shadow-sm relative z-10"></div></ng-container>
                    </div>
                    <div class="flex-1">
                      <span class="font-bold text-slate-900 block flex items-center gap-2">
                        {{ t().visuals.options[opt].name }}
                        <span *ngIf="t().visuals.options[opt].disabled" class="text-[10px] bg-slate-500 text-white px-2 py-0.5 rounded-full uppercase">{{ t().ui.notAvailableBadge }}</span>
                      </span>
                      <span *ngIf="t().visuals.options[opt].description" class="text-sm text-slate-500">{{ t().visuals.options[opt].description }}</span>
                      <span *ngIf="t().visuals.options[opt].disabled && t().visuals.options[opt].disabledText" class="text-xs text-red-600 font-bold block mt-1">{{ t().visuals.options[opt].disabledText }}</span>
                    </div>
                    <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 border-slate-300" [class.border-emerald-500]="config.symbolStyle === opt && !t().visuals.options[opt].disabled">
                      <div class="w-3 h-3 rounded-full bg-emerald-500" *ngIf="config.symbolStyle === opt && !t().visuals.options[opt].disabled"></div>
                    </div>
                  </button>
                  <app-tts-icon [text]="t().visuals.options[opt].name + (t().visuals.options[opt].description ? '. ' + t().visuals.options[opt].description : '') + (t().visuals.options[opt].disabled ? '. ' + t().visuals.options[opt].disabledText : '')"></app-tts-icon>
                </div>
              </div>
              <div *ngIf="config.symbolStyle === 'photos'" class="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-lg flex gap-3 animate-fade-in" role="alert">
                <svg class="w-5 h-5 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <p class="text-xs text-amber-800 leading-tight">
                  {{ t().visuals.photoWarning }}
                  <app-tts-icon [text]="t().visuals.photoWarning"></app-tts-icon>
                </p>
              </div>
            </fieldset>
            <hr class="border-slate-200" />
            <section>
              <h3 class="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">
                {{ t().audio.title }}
                <app-tts-icon [text]="t().audio.title"></app-tts-icon>
              </h3>
              <div class="flex items-center gap-2">
                <button type="button" (click)="toggleSpeech()" [attr.aria-pressed]="config.speechOutput" class="flex-1 p-4 rounded-xl border-2 flex items-center gap-4 text-left transition-all active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-blue-500/50" [class.border-blue-400]="config.speechOutput" [class.bg-blue-50]="config.speechOutput" [class.border-slate-200]="!config.speechOutput" [class.bg-white]="!config.speechOutput">
                  <div class="w-12 h-12 rounded-full flex items-center justify-center shrink-0" [class.bg-blue-200]="config.speechOutput" [class.bg-slate-100]="!config.speechOutput" [class.text-blue-700]="config.speechOutput" [class.text-slate-500]="!config.speechOutput" aria-hidden="true"><svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg></div>
                  <div class="flex-1">
                    <div class="flex items-center justify-between"><span class="font-bold text-lg text-slate-900">{{ t().audio.btnTitle }}</span><div class="w-12 h-7 rounded-full p-1 transition-colors duration-200 ease-in-out" [class.bg-blue-500]="config.speechOutput" [class.bg-slate-300]="!config.speechOutput" aria-hidden="true"><div class="bg-white w-5 h-5 rounded-full shadow-sm transform transition-transform duration-200 ease-in-out" [class.translate-x-5]="config.speechOutput" [class.translate-x-0]="!config.speechOutput"></div></div></div>
                    <p *ngIf="t().audio.btnDesc" class="text-sm text-slate-500 mt-1">{{ t().audio.btnDesc }}</p>
                  </div>
                </button>
                <app-tts-icon [text]="t().audio.btnTitle + (t().audio.btnDesc ? '. ' + t().audio.btnDesc : '')"></app-tts-icon>
              </div>
              <div class="mt-4" *ngIf="getGermanVoices().length > 0">
                <label class="block text-sm font-bold text-slate-700 mb-4">Bevorzugte Stimme:</label>
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                  <button 
                    *ngFor="let voice of getGermanVoices()" 
                    (click)="ttsService.setVoice(voice)"
                    class="flex flex-col items-center p-3 rounded-xl border-2 transition-all"
                    [class.border-emerald-500]="getSelectedVoiceName() === voice.name"
                    [class.bg-emerald-50]="getSelectedVoiceName() === voice.name"
                    [class.border-slate-200]="getSelectedVoiceName() !== voice.name"
                    [class.bg-white]="getSelectedVoiceName() !== voice.name"
                  >
                    <div class="w-12 h-12 mb-2 bg-white rounded-full p-1 border shadow-sm" [class.border-emerald-500]="getSelectedVoiceName() === voice.name" [class.border-slate-200]="getSelectedVoiceName() !== voice.name">
                      <img [src]="getAvatarUrl(voice.name)" [alt]="getFriendlyName(voice.name)" class="w-full h-full object-contain">
                    </div>
                    <span class="text-xs font-bold truncate w-full text-center">{{ getFriendlyName(voice.name) }}</span>
                  </button>
                </div>
                <button (click)="ttsService.speak('Stimme wurde gewechselt.')" class="w-full py-2 bg-slate-100 rounded-lg border border-slate-300 hover:bg-slate-200 font-bold text-sm">Auswahl testen</button>
              </div>
            </section>
          </div>

          <!-- STEP 5: Zusammenfassung -->
          <div *ngSwitchCase="5" class="text-center py-6">
            <div class="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600 animate-bounce" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
            </div>
            
            <h2 class="text-4xl font-black text-slate-900 mb-2 drop-shadow-sm">
              {{ t().summary.congratsTitle }}
              <app-tts-icon [text]="t().summary.congratsTitle"></app-tts-icon>
            </h2>
            
            <p class="text-xl text-emerald-700 font-bold mb-8 max-w-md mx-auto leading-tight">
              {{ t().summary.congratsMessage }}
              <app-tts-icon [text]="t().summary.congratsMessage"></app-tts-icon>
            </p>

            <div class="h-px w-full bg-slate-200 mb-8"></div>

            <div class="mb-8 space-y-6">
              <div class="text-left">
                <h3 class="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  {{ t().ui.previewLabel }}
                  <app-tts-icon [text]="t().ui.previewLabel"></app-tts-icon>
                </h3>
                <p class="text-sm text-slate-500 mb-4">{{ t().ui.mapInstructions }}
                  <app-tts-icon [text]="t().ui.mapInstructions"></app-tts-icon>
                  
                </p>
              </div>

              <app-map-preview [config]="config" [profile]="profile()" [animationEnabled]="data.mapAnimationEnabled"></app-map-preview>

              <!-- map animation control switch -->
              <!-- <div class="flex items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <label class="font-bold text-slate-700 cursor-pointer flex items-center gap-2" (click)="data.mapAnimationEnabled = !data.mapAnimationEnabled">
                  <div class="w-12 h-7 rounded-full p-1 transition-colors duration-200 ease-in-out" [class.bg-emerald-500]="data.mapAnimationEnabled" [class.bg-slate-300]="!data.mapAnimationEnabled">
                    <div class="bg-white w-5 h-5 rounded-full shadow-sm transform transition-transform duration-200 ease-in-out" [class.translate-x-5]="data.mapAnimationEnabled" [class.translate-x-0]="!data.mapAnimationEnabled"></div>
                  </div>
                  <span>{{ t().ui.mapAnimationLabel }}</span>
                </label>
                <app-tts-icon [text]="t().ui.mapAnimationLabel"></app-tts-icon>
              </div> -->
            </div>

            <div class="bg-emerald-50 border-2 border-emerald-100 rounded-2xl p-6 mb-8 animate-pulse">
               <p class="text-emerald-900 font-black text-lg mb-4">
                 {{ t().ui.startAppHint }}
                 <app-tts-icon [text]="t().ui.startAppHint"></app-tts-icon>
               </p>
               <div class="flex items-center gap-2">
                 <button (click)="openExternalApp()" class="flex-1 bg-emerald-600 hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-500/50 text-white font-black text-xl py-5 px-8 rounded-2xl shadow-xl shadow-emerald-200 transform transition hover:scale-105 active:scale-95 outline-none flex items-center justify-center gap-3">
                   <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
                   {{ t().ui.finishBtn }}
                 </button>
                 <app-tts-icon [text]="t().ui.finishBtn"></app-tts-icon>
               </div>
            </div>
          </div>

        </div>
      </main>

      <footer class="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 z-40 flex gap-4 justify-between items-center safe-area-bottom" role="contentinfo">
        <div class="flex items-center gap-2">
          <button (click)="prevStep()" [disabled]="currentStep() === 0" [class.invisible]="currentStep() === 0" class="flex items-center text-slate-600 font-bold px-4 py-3 rounded-lg hover:bg-slate-50 focus:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 transition-all min-h-[48px]" [attr.aria-label]="t().ui.prevBtn"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg><span class="text-base">{{ t().ui.prevBtn }}</span></button>
          <app-tts-icon *ngIf="currentStep() > 0" [text]="t().ui.prevBtn"></app-tts-icon>
        </div>
        
        <div class="flex items-center gap-2">
          <button *ngIf="currentStep() < steps.length - 1" (click)="nextStep()" class="bg-slate-900 text-white font-bold px-6 py-3 rounded-xl shadow-md flex items-center gap-2 hover:bg-slate-800 active:bg-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-500 transition-all min-h-[48px]"><span class="text-base">{{ t().ui.nextBtn }}</span><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg></button>
          <app-tts-icon *ngIf="currentStep() < steps.length - 1" [text]="t().ui.nextBtn"></app-tts-icon>
        </div>
      </footer>
    </div>
  `
})
export class WizardComponent implements OnInit {
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

  config: {
    mapStyle: string;
    area: string;
    viewMode: string;
    landmarks: string[];
    symbolStyle: string;
    speechOutput: boolean;
    lat: number;
    lon: number;
  } = {
    mapStyle: 'color',
    area: DATA_CONFIG.simplePlaces && DATA_CONFIG.simplePlaces[0] ? DATA_CONFIG.simplePlaces[0].name : '', // Start with first simple place
    viewMode: 'twodimensional',
    landmarks: [] as string[],
    symbolStyle: 'symbols_labels', 
    speechOutput: false,
    lat: DATA_CONFIG.simplePlaces && DATA_CONFIG.simplePlaces[0] ? DATA_CONFIG.simplePlaces[0].lat : Number.NaN,
    lon: DATA_CONFIG.simplePlaces && DATA_CONFIG.simplePlaces[0] ? DATA_CONFIG.simplePlaces[0].lon : Number.NaN,
  };

  steps = new Array(6);
  expertSelectedLevel = 'bezirke';
  viewModeKeys = ['twodimensional', 'twoandhalfdimensional', 'threedimensional'] as const;

  landmarkKeys = ['restaurant', 'church', 'stops', 'pharmacy', 'bank', 'icecream', 'rewe', 'aldinord', 'aldisued', 'penny', 'edeka', 'tankstelle', 'polizeistation', 'krankenhaus', 'schule'] as const;

  progressPercentage = computed(() => {
    return ((this.currentStep() + 1) / this.steps.length) * 100;
  });

  constructor(
    public ttsService: TtsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.checkGeolocation();
    
    // Aktuellen Schritt aus der URL laden, falls vorhanden (nach Rückkehr von Einstellungen)
    const stepParam = this.route.snapshot.queryParamMap.get('step');
    if (stepParam) {
      const stepIdx = parseInt(stepParam, 10);
      if (!isNaN(stepIdx) && stepIdx >= 0 && stepIdx < this.steps.length) {
        this.currentStep.set(stepIdx);
      }
    }

    // Beim ersten Laden den aktuellen Schritt vorlesen, wenn TTS aktiv ist
    if (this.ttsService.isTtsActive()) {
      const currentTitle = this.t().steps[this.currentStep()].title;
      this.ttsService.speak(currentTitle);
    }
  }

  getGermanVoices(): SpeechSynthesisVoice[] {
    return this.ttsService.getVoices().filter(v => v.lang.startsWith('de'));
  }

  getSelectedVoiceName(): string {
    return this.ttsService.getSelectedVoice()?.name || '';
  }

  getAvatarUrl(voiceName: string): string {
    const seed = encodeURIComponent(voiceName);
    return `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${seed}`;
  }

  getFriendlyName(fullName: string): string {
    // 1. Remove everything in brackets or after dash/comma
    let name = fullName.split('(')[0].split('-')[0].split(',')[0].trim();
    
    // 2. Remove common technical prefixes and language names
    const toRemove = [
      'Microsoft', 'Google', 'Apple', 'Android', 'Samsung', 
      'German', 'Deutsch', 'Germany', 'Deutschland',
      'Desktop', 'Natural', 'Online', 'Speech', 'Synthesis'
    ];
    
    // Iterate and remove (case-insensitive)
    for (const term of toRemove) {
      const regex = new RegExp(term, 'gi');
      name = name.replace(regex, '').trim();
    }

    // 3. Clean up potential leftover special characters
    name = name.replace(/[^a-zA-Z\u00C0-\u017F]/g, ' ').trim();

    // 4. Fallback if the name is empty or too generic
    if (!name || name.length < 2 || name.toLowerCase() === 'female' || name.toLowerCase() === 'male') {
      return 'Robin';
    }

    // Return the first word (usually the actual name)
    return name.split(' ')[0];
  }

  onVoiceChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const voice = this.getGermanVoices().find(v => v.name === select.value);
    if (voice) {
      this.ttsService.setVoice(voice);
      this.ttsService.speak(this.t().ui.voiceTestLabel);
    }
  }

  goToTtsSettings() {
    this.router.navigate(['/'], { queryParams: { returnStep: this.currentStep().toString() } });
  }

  toggleTts() {
    if (this.ttsService.isTtsActive()) {
      this.ttsService.disableTts();
    } else {
      this.ttsService.enableTts();
      this.ttsService.speak(this.t().ui.ttsEnabledFeedback);
    }
  }

  toggleConfirmSelection() {
    if (this.ttsService.isConfirmSelectionActive()) {
      this.ttsService.disableConfirmSelection();
    } else {
      this.ttsService.enableConfirmSelection();
      this.ttsService.speak(this.t().ui.confirmSelectionLabel + ' ' + this.t().ui.audioConfirmOn);
    }
  }

  private speakSelectionChange(name: string, isAdded: boolean, description?: string) {
    if (this.ttsService.isTtsActive() && this.ttsService.isConfirmSelectionActive()) {
      const prefix = isAdded ? this.t().ui.selectionAdded : this.t().ui.selectionRemoved;
      let text = `${prefix} ${name}`;
      if (isAdded && description) {
        text += `. ${description}`;
      }
      this.ttsService.speak(text);
    }
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
    const style = this.t().mapStyles[id];
    this.speakSelectionChange(style.name, true, style.description);
  }

  onViewModeClick(mode: string) {
    const viewMode = this.t().viewModes[mode];
    if (viewMode.disabled) {
      if (this.ttsService.isTtsActive()) {
        this.ttsService.speak(viewMode.disabledText || this.t().ui.notAvailableError);
      }
      return;
    }
    this.config.viewMode = mode;
    this.speakSelectionChange(viewMode.name, true, viewMode.description);
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
        
        if (this.ttsService.isTtsActive()) {
          this.ttsService.speak("Standort gefunden: " + (address || "Breitengrad " + coords.latitude.toFixed(2)));
        }
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
        if (this.ttsService.isTtsActive()) {
          this.ttsService.speak(this.locationError);
        }
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
    const place = this.data.simplePlaces.find(p => p.name === area);
    const description = place?.ttsText || '';

    if (this.config.area === area) {
      this.config.area = ''; 
      this.speakSelectionChange(area, false);
    } else {
      this.config.area = area;
      this.speakSelectionChange(area, true, description);
    }

    // set coordinates in config object from selected place
    if (place) {
      this.config.lat = place.lat;
      this.config.lon = place.lon;
    } else {
      this.config.lat = Number.NaN;
      this.config.lon = Number.NaN;
    }
  }

  // ------------------------------------------------

  // --- LANDMARK CATEGORY LOGIC ---

  toggleLandmarkCategory(categoryId: string) {
    const category = this.data.simpleLandmarkCategories.find(c => c.id === categoryId);
    if (!category) return;

    const allSelected = this.isCategoryFullySelected(categoryId);
    
    if (allSelected) {
      // Deselect all in this category
      category.items.forEach(id => {
        const idx = this.config.landmarks.indexOf(id);
        if (idx > -1) this.config.landmarks.splice(idx, 1);
      });
      this.ttsService.speak(this.t().landmarks.categoryDeselectFeedback + " " + category.name);
    } else {
      // Select all in this category (only those not already selected)
      category.items.forEach(id => {
        if (!this.config.landmarks.includes(id)) {
          this.config.landmarks.push(id);
        }
      });
      this.ttsService.speak(this.t().landmarks.categorySelectFeedback + " " + category.name);
    }
  }

  getSelectedCountInCategory(categoryId: string): number {
    const category = this.data.simpleLandmarkCategories.find(c => c.id === categoryId);
    if (!category) return 0;
    return category.items.filter(id => this.config.landmarks.includes(id)).length;
  }

  isCategoryFullySelected(categoryId: string): boolean {
    const category = this.data.simpleLandmarkCategories.find(c => c.id === categoryId);
    if (!category) return false;
    return category.items.every(id => this.config.landmarks.includes(id));
  }

  toggleLandmark(id: string) {
    const index = this.config.landmarks.indexOf(id);
    let name = this.t().landmarks.items[id] || id;
    let description = '';
    
    // In expert mode, the id might be from catalog resources
    if (this.profile() === 'expert' && !this.t().landmarks.items[id]) {
       for (const cat of this.data.expertLandmarkResources) {
         const res = cat.resources.find(r => r.id === id);
         if (res) { 
           name = res.name; 
           description = res.description || '';
           break; 
         }
       }
    }

    if (index > -1) {
      this.config.landmarks.splice(index, 1);
      this.speakSelectionChange(name, false);
    } else {
      this.config.landmarks.push(id);
      this.speakSelectionChange(name, true, description);
    }
  }

  toggleSpeech() {
    this.config.speechOutput = !this.config.speechOutput;
    const stateName = this.config.speechOutput ? this.t().summary.values.active : this.t().summary.values.inactive;
    this.speakSelectionChange(this.t().audio.btnTitle + ' ' + stateName, true);
  }

  selectSymbolStyle(style: string) {
    const opt = this.t().visuals.options[style];
    if (opt.disabled) {
      if (this.ttsService.isTtsActive()) {
        this.ttsService.speak(opt.disabledText || this.t().ui.notAvailableError);
      }
      return;
    }
    this.config.symbolStyle = style;
    this.speakSelectionChange(opt.name, true, opt.description);
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
      
      const isFinalStep = this.currentStep() === this.steps.length - 1;

      if (this.ttsService.isTtsActive()) {
        const nextTitle = this.t().steps[this.currentStep()].title;
        let speakText = this.t().ui.nextStepLabel + " " + nextTitle;
        
        // Bei Schritt 6 (Index 5) gratulieren
        if (isFinalStep) {
          speakText = this.t().summary.congratsTitle + ". " + this.t().summary.congratsMessage;
        }
        this.ttsService.speak(speakText);
      }

      if (isFinalStep && this.data.celebrateAnimation) {
        this.showConfetti();
      }
    }
  }

  showConfetti() {
    // Einfache CSS-basierte Konfetti-Animation
    const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];
    const container = document.body;
    
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti-piece';
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDelay = Math.random() * 2 + 's';
      confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
      container.appendChild(confetti);
      
      // Nach Animation entfernen
      setTimeout(() => confetti.remove(), 4000);
    }
  }

  prevStep() {
    if (this.currentStep() > 0) {
      this.currentStep.update(v => v - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      if (this.ttsService.isTtsActive()) {
        const prevTitle = this.t().steps[this.currentStep()].title;
        this.ttsService.speak(this.t().ui.prevStepLabel + " " + prevTitle);
      }
    }
  }

  getExpertFeatures() {
    return this.data.expertSpatialUnits.find(l => l.id === this.expertSelectedLevel)?.features || [];
  }

  // Build a query string from all summary values and open the target application in a new tab
  openExternalApp() {
    const base = this.data.externalAppUrl;
    const params = new URLSearchParams();

    // Location preference: if geolocation is present, include lat/lon + zoom
    if (this.detectedLocation?.coords) {
      params.set('lat', String(this.detectedLocation.coords.latitude));
      params.set('lon', String(this.detectedLocation.coords.longitude));
      params.set('zoom', '18');
    }

    // Fallback: include textual area/spu
    if (this.config.area) {
      params.set('lat', String(this.config.lat));
      params.set('lon', String(this.config.lon));
      params.set('zoom', '18');
    }

    // Map style & view
    if (this.config.mapStyle) params.set('mapStyle', this.config.mapStyle);
    if (this.config.viewMode) params.set('viewMode', this.config.viewMode);

    // Landmarks (comma separated list)
    if (this.config.landmarks && this.config.landmarks.length) params.set('landmarks', this.config.landmarks.join(','));

    // Visual style & audio
    params.set('symbolStyle', this.config.symbolStyle);
    params.set('speechOutput', this.config.speechOutput ? 'true' : 'false');

    params.set( 'application', 'dikomall' );
    params.set( 'ind', 'dikomall' );
    params.set( 'hideIndicator', 'true' );

    const url = `${base}?${params.toString()}`;
    window.open(url, '_blank');
  }

  getPreviewIcon() {
    // Return icon for the example landmark defined in config
    return (this.data.landmarks as any)[DATA_CONFIG.previewExampleLandmarkId].icon;
  }
  getPreviewImage() {
    // Return icon for the example landmark defined in config
    return (this.data.landmarks as any)[DATA_CONFIG.previewExampleLandmarkId].image;
  }

  getLandmarkData(key: string): any {
    return (this.data.landmarks as any)[key];
  }
}
