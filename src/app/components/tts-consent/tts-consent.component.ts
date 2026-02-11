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
