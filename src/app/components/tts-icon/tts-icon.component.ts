import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TtsService } from '../../services/tts.service';

@Component({
  selector: 'app-tts-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      *ngIf="ttsService.isTtsActive()"
      (click)="speak($event)" 
      class="tts-button" 
      [attr.aria-label]="'Text vorlesen: ' + text"
      type="button"
    >
      <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor">
        <path d="M560-131v-82q90-26 145-100t55-167q0-93-55-167T560-747v-82q123 28 201.5 125.5T840-480q0 127-78.5 224.5T560-131ZM120-360v-240h160l200-200v640L280-360H120Zm440 40v-320q47 15 73.5 56.5T660-480q0 47-26.5 88.5T560-320ZM400-606l-86 86H200v80h114l86 86v-252ZM300-480Z"/>
      </svg>
    </button>
  `,
  styles: [`
    .tts-button {
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: inherit;
      opacity: 0.7;
      transition: opacity 0.2s, transform 0.1s;
      vertical-align: middle;
      border-radius: 50%;
    }
    .tts-button:hover {
      opacity: 1;
      background-color: rgba(0,0,0,0.05);
    }
    .tts-button:active {
      transform: scale(0.9);
    }
  `]
})
export class TtsIconComponent {
  @Input() text: string = '';

  constructor(public ttsService: TtsService) {}

  speak(event: Event): void {
    event.stopPropagation();
    this.ttsService.speak(this.text);
  }
}
