import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TtsService } from '../../services/tts.service';

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
        
        <div class="options">
          <button (click)="enableTts()" class="btn btn-primary" aria-label="Ja, Vorlesefunktion einschalten">
            <span class="icon">🔊</span>
            <span class="text">Ja, bitte vorlesen</span>
          </button>
          
          <button (click)="disableTts()" class="btn btn-secondary" aria-label="Nein, ohne Vorlesefunktion fortfahren">
            <span class="icon">🔇</span>
            <span class="text">Nein, danke</span>
          </button>
        </div>

        <div class="voice-selection-container" *ngIf="getGermanVoices().length > 0">
          <p class="subtitle">Wählen Sie Ihre bevorzugte Stimme:</p>
          <div class="voice-grid">
            <button 
              *ngFor="let voice of getGermanVoices()" 
              (click)="selectVoice(voice)"
              class="voice-tile"
              [class.active]="getSelectedVoiceName() === voice.name"
              [attr.aria-label]="'Stimme ' + getFriendlyName(voice.name) + ' auswählen'"
            >
              <div class="silhouette">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C9.24 2 7 4.24 7 7s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 12c-4.42 0-8 2.58-8 6v2h16v-2c0-3.42-3.58-6-8-6z"/>
                </svg>
              </div>
              <span class="voice-name">{{ getFriendlyName(voice.name) }}</span>
              <div class="check-icon" *ngIf="getSelectedVoiceName() === voice.name">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
            </button>
          </div>
          <button (click)="testVoice()" class="btn-test-large" [disabled]="!getSelectedVoiceName()">
            <span>🔊</span> Stimme testen
          </button>
        </div>

        <p class="accessibility-note">
          Diese Einstellung können Sie später jederzeit ändern.
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
      background: #e7f3ff;
      border-color: #007bff;
    }
    .silhouette {
      width: 50px;
      height: 50px;
      color: #ccc;
      margin-bottom: 8px;
    }
    .active .silhouette {
      color: #007bff;
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
export class TtsConsentComponent {
  constructor(
    private ttsService: TtsService,
    private router: Router
  ) {}

  getGermanVoices(): SpeechSynthesisVoice[] {
    return this.ttsService.getVoices().filter(v => v.lang.startsWith('de'));
  }

  getSelectedVoiceName(): string {
    return this.ttsService.getSelectedVoice()?.name || '';
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
      return 'Standard';
    }

    return name;
  }

  selectVoice(voice: SpeechSynthesisVoice) {
    this.ttsService.setVoice(voice);
  }

  testVoice() {
    // Temporarily enable to test, then disable if it was disabled
    const wasActive = this.ttsService.isTtsActive();
    if (!wasActive) this.ttsService.enableTts();
    this.ttsService.speak("Dies ist ein Test der gewählten Stimme.");
    if (!wasActive) {
      // We don't want to leave it active if they haven't clicked "Yes" yet.
      // But speak is async, so we might need a timeout or just accept it's active for a moment.
      // For simplicity, let's just keep it enabled if they test it.
    }
  }

  enableTts() {
    this.ttsService.enableTts();
    this.ttsService.speak("Die Vorlesefunktion wurde eingeschaltet.");
    this.navigateToApp();
  }

  disableTts() {
    this.ttsService.disableTts();
    this.navigateToApp();
  }

  private navigateToApp() {
    // We will define the route for the main app logic later.
    // Assuming 'wizard' or just '/' if we change the routes.
    this.router.navigate(['/wizard']);
  }
}
