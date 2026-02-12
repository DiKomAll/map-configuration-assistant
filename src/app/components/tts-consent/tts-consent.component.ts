import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { TtsService } from '../../services/tts.service';
import { TEXTS, ProfileType } from '../../app.config.data';

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

          <div class="navigation-action">
            <button (click)="startApp()" class="btn btn-start-app">
               {{ t().ui.startAppBtn }}
            </button>
          </div>
        </div>

        <p class="accessibility-note" *ngIf="!showStartButton">
          Diese Einstellung kannst du später jederzeit ändern.
        </p>
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
      font-family: sans-serif;
    }
    .card {
      background: white;
      padding: 40px;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      max-width: 600px;
      width: 100%;
      text-align: center;
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
  `]
})
export class TtsConsentComponent implements OnInit {
  showStartButton = false;
  returnStep: string | null = null;
  profile = signal<ProfileType>('simple');
  t = computed(() => TEXTS[this.profile()]);

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
    // Extrahiert den Vornamen aus komplexen Bezeichnungen wie "Microsoft Hedda - German"
    // 1. Entfernt alles in Klammern oder nach Bindestrichen
    let name = fullName.split('(')[0].split('-')[0].trim();
    
    // 2. Entfernt bekannte Präfixe wie "Microsoft", "Google", "Apple"
    const prefixes = ['Microsoft', 'Google', 'Apple', 'Android'];
    for (const prefix of prefixes) {
      if (name.startsWith(prefix)) {
        name = name.replace(prefix, '').trim();
      }
    }

    // Falls nach dem Filtern nichts übrig bleibt oder nur "Deutsch", nutze einen Standardnamen
    if (!name || name.toLowerCase() === 'deutsch' || name.toLowerCase() === 'german') {
      return 'Robin'; // Ein neutraler, freundlicher Name als Fallback
    }

    return name;
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

  enableTts() {
    this.ttsService.enableTts();
    this.showStartButton = true;
    // Begrüßung erfolgt automatisch
    setTimeout(() => this.greet(), 100);
  }

  resetTts() {
    this.ttsService.disableTts();
    this.showStartButton = false;
  }

  disableTts() {
    this.ttsService.disableTts();
    this.navigateToApp();
  }

  startApp() {
    this.navigateToApp();
  }

  private navigateToApp() {
    const queryParams = this.returnStep ? { step: this.returnStep } : {};
    this.router.navigate(['/wizard'], { queryParams });
  }
}
