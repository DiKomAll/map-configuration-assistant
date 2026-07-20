import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { TtsService } from '../../services/tts.service';
import { AccessibilityService } from '../../services/accessibility.service';
import { TEXTS, ProfileType, DATA_CONFIG } from '../../app.config.data';

@Component({
  selector: 'app-tts-consent',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="consent-container">
      <div class="card">
        <h1>Willkommen beim Map Konfigurations Assistenten</h1>
        <p class="instruction">
          Möchten Sie, dass Ihnen die Texte in dieser App vorgelesen werden?
        </p>
        
        <div class="options" *ngIf="!showStartButton">
          <button (click)="enableTts()" class="btn btn-primary" aria-label="Ja, Vorlesefunktion einschalten">
            <span class="icon">🔊</span>
            <span class="text">Ja, bitte vorlesen</span>
          </button>

          <button (click)="disableTts()" class="btn btn-secondary" aria-label="Nein, ohne Vorlesefunktion fortfahren">
            <span class="icon">🔇</span>
            <span class="text">Nein, danke</span>
          </button>
        </div>

        <!-- TTS Status Indicator (visible after clicking "Nein, danke") -->
        <div *ngIf="ttsChoiceMade && !ttsService.isTtsActive()" class="tts-status-indicator" style="margin-top: 20px; padding: 15px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px;">
          <span class="switch-title" style="color: #dc2626;">🔇 Vorlesefunktion ist deaktiviert</span>
        </div>

        <div *ngIf="showStartButton" class="settings-active animate-fade-in">
          <button (click)="resetTts()" class="status-badge-btn" title="Vorlesefunktion wieder ausschalten">
             <span class="icon">✅</span>
             <span class="text">{{ t().ui.ttsEnabledFeedback }}</span>
             <span class="change-label">{{ t().ui.changeLabel }}</span>
          </button>

          <div class="confirm-selection-toggle">
            <label class="switch-container">
              <div class="switch-text">
                <span class="switch-title">{{ t().ui.confirmSelectionLabel }}</span>
                <p class="switch-desc">{{ t().ui.confirmSelectionDesc }}</p>
              </div>
              <div class="switch-action">
                <button (click)="toggleConfirmSelection()" class="relative inline-flex h-10 w-16 items-center rounded-full transition-colors focus:outline-none" [style.background-color]="ttsService.isConfirmSelectionActive() ? '#10b981' : '#cbd5e1'">
                  <span class="inline-block h-8 w-8 transform rounded-full bg-white shadow-md transition-transform" [style.transform]="ttsService.isConfirmSelectionActive() ? 'translateX(28px)' : 'translateX(4px)'"></span>
                </button>
              </div>
            </label>
          </div>

          <!-- Volume and Rate Controls -->
          <div class="tts-controls-container" *ngIf="getGermanVoices().length > 0">
            <div class="tts-control">
              <span class="switch-title">🔊 Lautstärke</span>
              <div class="tts-preset-buttons">
                <button (click)="setVolumePresetAndTest('quiet')" [class.active]="isVolumeActive('quiet')" class="tts-preset-btn">
                  <span class="text-lg mb-1 block">🔈</span>
                  {{ data.ttsLabels.volume.quiet }}
                </button>
                <button (click)="setVolumePresetAndTest('medium')" [class.active]="isVolumeActive('medium')" class="tts-preset-btn">
                  <span class="text-lg mb-1 block">🔉</span>
                  {{ data.ttsLabels.volume.medium }}
                </button>
                <button (click)="setVolumePresetAndTest('loud')" [class.active]="isVolumeActive('loud')" class="tts-preset-btn">
                  <span class="text-lg mb-1 block">🔊</span>
                  {{ data.ttsLabels.volume.loud }}
                </button>
              </div>
            </div>
            <div class="tts-control">
              <span class="switch-title">⚡ Geschwindigkeit</span>
              <div class="tts-preset-buttons">
                <button (click)="setRatePresetAndTest('slow')" [class.active]="isRateActive('slow')" class="tts-preset-btn">
                  <span class="text-lg mb-1 block">🐢</span>
                  {{ data.ttsLabels.rate.slow }}
                </button>
                <button (click)="setRatePresetAndTest('normal')" [class.active]="isRateActive('normal')" class="tts-preset-btn">
                  <span class="text-lg mb-1 block">⚡</span>
                  {{ data.ttsLabels.rate.normal }}
                </button>
                <button (click)="setRatePresetAndTest('fast')" [class.active]="isRateActive('fast')" class="tts-preset-btn">
                  <span class="text-lg mb-1 block">🐇</span>
                  {{ data.ttsLabels.rate.fast }}
                </button>
              </div>
            </div>
          </div>

          <div class="voice-selection-container" *ngIf="getGermanVoices().length > 0">
            <p class="subtitle">{{ t().ui.companionLabel }}</p>
            <div class="voice-grid">
              <button
                *ngFor="let voice of getGermanVoices()"
                (click)="selectVoice(voice)"
                class="voice-tile"
                [class.active]="getSelectedVoiceName() === voice.name"
                [attr.aria-label]="t().ui.companionLabel + ' ' + getFriendlyName(voice.name)"
              >
                <div class="avatar-container">
                  <img [src]="getAvatarUrl(voice.name)" [alt]="getFriendlyName(voice.name)" class="avatar-img">
                </div>
                <span class="voice-name">{{ getFriendlyName(voice.name) }}</span>
                <div class="check-icon" *ngIf="getSelectedVoiceName() === voice.name">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>

        <!-- Separator -->
        <hr class="border-slate-200 my-6" />

        <!-- Font Settings (always visible) -->
        <div class="accessibility-container" style="margin-top: 20px; padding-top: 20px;">
          <p class="subtitle">Barrierefreiheit</p>

          <div class="accessibility-section">
            <span class="accessibility-label">Schriftart</span>
            <div class="accessibility-options">
              <button (click)="setFontFamily('open-dyslexic')" [class.active]="getFontFamily() === 'open-dyslexic'" class="accessibility-btn">OpenDyslexic</button>
              <button (click)="setFontFamily('default')" [class.active]="getFontFamily() === 'default'" class="accessibility-btn">Standard</button>
            </div>
          </div>

          <div class="accessibility-section">
            <span class="accessibility-label">Schriftgröße</span>
            <div class="accessibility-options">
              <button (click)="setFontSize('small')" [class.active]="getFontSize() === 'small'" class="accessibility-btn">A</button>
              <button (click)="setFontSize('normal')" [class.active]="getFontSize() === 'normal'" class="accessibility-btn">A</button>
              <button (click)="setFontSize('large')" [class.active]="getFontSize() === 'large'" class="accessibility-btn">A</button>
              <button (click)="setFontSize('x-large')" [class.active]="getFontSize() === 'x-large'" class="accessibility-btn">A</button>
            </div>
          </div>
        </div>

        <p class="accessibility-note">
          Diese Einstellung kannst du später jederzeit ändern.
        </p>

        <!-- Start App Button (always visible) -->
        <div class="navigation-action" style="margin-top: 20px;">
          <button (click)="startApp()" class="btn btn-start-app">
            {{ t().ui.startAppBtn }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .consent-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #f5f5f5;
      padding: 20px;
      font-family: var(--font-family-body);
    }
    .card {
      background: white;
      padding: 40px;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      max-width: 600px;
      width: 100%;
      text-align: center;
      font-family: var(--font-family-body);
    }
    h1 {
      color: #333;
      margin-bottom: 24px;
      font-size: 2rem;
    }
    .instruction {
      font-size: 1.25rem;
      margin-bottom: 40px;
      color: #555;
      line-height: 1.5;
    }
    .options {
      display: flex;
      flex-direction: column;
      gap: 20px;
      margin-bottom: 30px;
    }
    .btn {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      border: none;
      border-radius: 8px;
      font-size: 1.25rem;
      font-weight: bold;
      cursor: pointer;
      transition: transform 0.2s, background-color 0.2s;
    }
    .btn:hover {
      transform: translateY(-2px);
    }
    .btn:active {
      transform: translateY(0);
    }
    .btn-primary {
      background-color: #007bff;
      color: white;
    }
    .btn-primary:hover {
      background-color: #0056b3;
    }
    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }
    .btn-secondary:hover {
      background-color: #5a6268;
    }
    .status-badge-btn {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      padding: 12px 20px;
      background: #ecfdf5;
      color: #065f46;
      border: 2px solid #10b981;
      border-radius: 16px;
      font-weight: bold;
      font-size: 1rem;
      margin-bottom: 24px;
      cursor: pointer;
      transition: all 0.2s;
      width: 100%;
    }
    .status-badge-btn:hover {
      background: #d1fae5;
      transform: scale(1.02);
    }
    .status-badge-btn .text {
      font-size: 1.1rem;
    }
    .change-label {
      font-size: 0.8rem;
      color: #047857;
      font-weight: normal;
      text-decoration: underline;
    }
    .btn-start-app {
      background-color: #059669;
      color: white;
      width: 100%;
      margin-top: 30px;
      padding: 25px !important;
      font-size: 1.5rem !important;
      box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);
    }
    .btn-start-app:hover {
      background-color: #047857;
    }
    .navigation-action {
      margin-top: 20px;
    }
    .animate-fade-in {
      animation: fadeIn 0.4s ease-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .confirm-selection-toggle {
      margin-top: 20px;
      padding: 15px;
      background: #f0fdf4;
      border: 1px solid #dcfce7;
      border-radius: 12px;
      text-align: left;
    }
    .switch-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 15px;
      cursor: pointer;
    }
    .switch-title {
      display: block;
      font-weight: bold;
      color: #065f46;
      font-size: 1.1rem;
    }
    .switch-desc {
      margin: 4px 0 0 0;
      font-size: 0.9rem;
      color: #047857;
      line-height: 1.3;
    }
    .switch-action {
      flex-shrink: 0;
    }
    .icon {
      font-size: 2rem;
      margin-right: 15px;
    }
    .voice-selection-container {
      margin-top: 40px;
      padding-top: 30px;
      border-top: 2px solid #f0f0f0;
    }
    .subtitle {
      font-weight: bold;
      color: #666;
      margin-bottom: 20px;
      font-size: 1.1rem;
    }
    .voice-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
      margin-bottom: 25px;
    }
    .voice-tile {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 15px;
      background: #f9f9f9;
      border: 3px solid transparent;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
    }
    .voice-tile:hover {
      background: #f0f0f0;
      transform: translateY(-2px);
    }
    .voice-tile.active {
      background: #f0fdf4;
      border-color: #10b981;
      transform: scale(1.05);
      box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.2);
    }
    .avatar-container {
      width: 80px;
      height: 80px;
      margin-bottom: 12px;
      background: white;
      border-radius: 50%;
      padding: 5px;
      box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
      border: 2px solid #f1f5f9;
      transition: all 0.2s;
    }
    .active .avatar-container {
      border-color: #10b981;
      transform: rotate(5deg);
    }
    .avatar-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    .voice-name {
      font-weight: bold;
      font-size: 1rem;
      color: #333;
    }
    .check-icon {
      position: absolute;
      top: 5px;
      right: 5px;
      width: 20px;
      height: 20px;
      color: #007bff;
    }
    .btn-test-large {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      width: 100%;
      padding: 12px;
      background: white;
      border: 2px solid #ddd;
      border-radius: 8px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-test-large:hover:not(:disabled) {
      background: #f8f8f8;
      border-color: #bbb;
    }
    .btn-test-large:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .accessibility-note {
      font-size: 0.9rem;
      color: #777;
    }
    @media (min-width: 480px) {
      .options {
        flex-direction: row;
      }
      .btn {
        flex: 1;
      }
    }

    /* TTS Controls */
    .tts-controls-container {
      margin-top: 20px;
      padding: 15px;
      background: #fefefe;
      border: 1px solid #e0e0e0;
      border-radius: 12px;
    }
    .tts-control {
      margin-bottom: 15px;
    }
    .tts-control:last-child {
      margin-bottom: 0;
    }
    .tts-control-label {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    .tts-slider {
      width: 100%;
      height: 6px;
      border-radius: 3px;
      background: #e0e0e0;
      outline: none;
      -webkit-appearance: none;
    }
    .tts-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #10b981;
      cursor: pointer;
    }
    .tts-value {
      font-size: 0.85rem;
      color: #666;
      font-weight: bold;
    }

    /* TTS Preset Buttons */
    .tts-preset-buttons {
      display: flex;
      gap: 6px;
      margin-top: 8px;
    }
    .tts-preset-btn {
      flex: 1;
      padding: 8px 12px;
      border-radius: 8px;
      border: 2px solid #ddd;
      background: white;
      font-weight: bold;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.2s;
    }
    .tts-preset-btn:hover {
      background: #f0f0f0;
    }
    .tts-preset-btn.active {
      background: #10b981;
      color: white;
      border-color: #059669;
    }

    /* Accessibility Settings */
    .accessibility-container {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 2px solid #f0f0f0;
    }
    .accessibility-section {
      margin-bottom: 20px;
    }
    .accessibility-label {
      display: block;
      font-weight: bold;
      color: #666;
      margin-bottom: 10px;
      font-size: 0.95rem;
    }
    .accessibility-options {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .accessibility-btn {
      padding: 8px 16px;
      border-radius: 8px;
      border: 2px solid #ddd;
      background: white;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.2s;
      min-width: 60px;
    }
    .accessibility-btn:hover {
      background: #f5f5f5;
    }
    .accessibility-btn.active {
      background: #10b981;
      color: white;
      border-color: #059669;
    }
  `]
})
export class TtsConsentComponent implements OnInit {
  showStartButton = false;
  ttsChoiceMade = false; // Track if user made a TTS choice (yes/no)
  returnStep: string | null = null;
  profile = signal<ProfileType>('simple');
  t = computed(() => TEXTS[this.profile()]);
  data = DATA_CONFIG;

  // Accessibility settings (using AccessibilityService)
  private accessibilityService = inject(AccessibilityService);

  // Local signals removed - now using AccessibilityService

  constructor(
    public ttsService: TtsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Falls TTS bereits aktiv ist (z.B. Rückkehr aus dem Wizard), direkt Einstellungen zeigen
    if (this.ttsService.isTtsActive()) {
      this.showStartButton = true;
      // Kurze Verzögerung, damit die Stimmen geladen sind
      setTimeout(() => this.greet(), 500);
    }

    // Merken, zu welchem Schritt wir zurückkehren müssen
    this.returnStep = this.route.snapshot.queryParamMap.get('returnStep');
  }

  // Methods moved to use AccessibilityService
  getGermanVoices(): SpeechSynthesisVoice[] {
    return this.ttsService.getVoices().filter(v => v.lang.startsWith('de'));
  }

  getSelectedVoiceName(): string {
    return this.ttsService.getSelectedVoice()?.name || '';
  }

  getAvatarUrl(voiceName: string): string {
    // Wir nutzen freundliche Emojis als Avatare, basierend auf dem Namen der Stimme
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

  selectVoice(voice: SpeechSynthesisVoice) {
    this.ttsService.setVoice(voice);
    this.greet();
  }

  private greet() {
    if (this.ttsService.isTtsActive()) {
      this.ttsService.speak(this.t().ui.ttsGreeting);
    }
  }

  toggleConfirmSelection() {
    if (this.ttsService.isConfirmSelectionActive()) {
      this.ttsService.disableConfirmSelection();
    } else {
      this.ttsService.enableConfirmSelection();
      this.ttsService.speak(this.t().ui.confirmSelectionLabel + " " + this.t().ui.audioConfirmOn);
    }
  }

  // Volume and rate controls with presets
  setVolume(event: Event) {
    const input = event.target as HTMLInputElement;
    const volume = parseFloat(input.value);
    this.ttsService.setVolume(volume);
  }

  setRate(event: Event) {
    const input = event.target as HTMLInputElement;
    const rate = parseFloat(input.value);
    this.ttsService.setRate(rate);
  }

  setVolumePreset(preset: 'quiet' | 'medium' | 'loud') {
    const volume = this.data.ttsPresets.volume[preset];
    this.ttsService.setVolume(volume);
  }

  setRatePreset(preset: 'slow' | 'normal' | 'fast') {
    const rate = this.data.ttsPresets.rate[preset];
    this.ttsService.setRate(rate);
  }

  setVolumePresetAndTest(preset: 'quiet' | 'medium' | 'loud') {
    this.setVolumePreset(preset);
    if (this.ttsService.isTtsActive()) {
      this.ttsService.speak(this.data.ttsTestMessage);
    }
  }

  setRatePresetAndTest(preset: 'slow' | 'normal' | 'fast') {
    this.setRatePreset(preset);
    if (this.ttsService.isTtsActive()) {
      this.ttsService.speak(this.data.ttsTestMessage);
    }
  }

  // Helper methods for determining active state and labels
  isVolumeActive(preset: 'quiet' | 'medium' | 'loud'): boolean {
    const vol = this.ttsService.getVolume();
    const thresholds = this.data.ttsThresholds.volume;
    if (preset === 'quiet') return vol <= thresholds.quiet;
    if (preset === 'medium') return vol > thresholds.quiet && vol <= thresholds.medium;
    return vol > thresholds.medium;
  }

  isRateActive(preset: 'slow' | 'normal' | 'fast'): boolean {
    const rate = this.ttsService.getRate();
    const thresholds = this.data.ttsThresholds.rate;
    if (preset === 'slow') return rate < thresholds.slow;
    if (preset === 'normal') return rate >= thresholds.slow && rate <= thresholds.normalUpper;
    return rate > thresholds.normalUpper;
  }

  getVolumeLabel(preset: 'quiet' | 'medium' | 'loud'): string {
    return this.data.ttsLabels.volume[preset];
  }

  getRateLabel(preset: 'slow' | 'normal' | 'fast'): string {
    return this.data.ttsLabels.rate[preset];
  }

  getVolume(): number {
    return this.ttsService.getVolume();
  }

  getRate(): number {
    return this.ttsService.getRate();
  }

  // Accessibility settings (using AccessibilityService)
  setFontSize(size: any) {
    this.accessibilityService.setFontSize(size);
  }

  setFontFamily(family: any) {
    this.accessibilityService.setFontFamily(family);
  }

  getFontSize(): string {
    return this.accessibilityService.getFontSize();
  }

  getFontFamily(): string {
    return this.accessibilityService.getFontFamily();
  }

  enableTts() {
    this.ttsService.enableTts();
    this.showStartButton = true;
    this.ttsChoiceMade = true;
    // Begrüßung erfolgt automatisch
    setTimeout(() => this.greet(), 100);
  }

  resetTts() {
    this.ttsService.disableTts();
    this.showStartButton = false;
  }

  disableTts() {
    // Disable TTS but stay on page to let user adjust font settings
    this.ttsService.disableTts();
    this.ttsChoiceMade = true;
    this.showStartButton = false;
  }

  startApp() {
    this.navigateToApp();
  }

  private navigateToApp() {
    const queryParams = this.returnStep ? { step: this.returnStep } : {};
    this.router.navigate(['/wizard'], { queryParams });
  }
}
