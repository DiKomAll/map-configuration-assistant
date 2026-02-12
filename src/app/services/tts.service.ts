import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TtsService {
  private speechSynthesis: SpeechSynthesis;
  private utterance: SpeechSynthesisUtterance;
  private isTtsEnabled: boolean = false;
  private isConfirmSelectionEnabled: boolean = true; // Default to true if TTS is enabled

  // Signal for voices to ensure reactivity
  voices = signal<SpeechSynthesisVoice[]>([]);
  confirmSelection = signal<boolean>(true);

  constructor() {
    this.speechSynthesis = window.speechSynthesis;
    this.utterance = new SpeechSynthesisUtterance();
    this.utterance.lang = 'de-DE'; // Default to German

    // Set a default voice if available
    this.speechSynthesis.onvoiceschanged = () => {
      this.updateVoicesList();
    };
    
    // Initial attempt to set voice
    this.updateVoicesList();
  }

  private updateVoicesList(): void {
    const list = this.speechSynthesis.getVoices();
    if (list.length > 0) {
      this.voices.set(list);
      
      if (!this.utterance.voice) {
        const germanVoice = list.find(voice => voice.lang === 'de-DE' || voice.lang === 'de_DE' || voice.lang.startsWith('de'));
        if (germanVoice) {
          this.utterance.voice = germanVoice;
        } else {
          this.utterance.voice = list[0];
        }
      }
    }
  }

  getVoices(): SpeechSynthesisVoice[] {
    return this.voices();
  }

  setVoice(voice: SpeechSynthesisVoice): void {
    this.utterance.voice = voice;
    this.utterance.lang = voice.lang;
  }

  getSelectedVoice(): SpeechSynthesisVoice | null {
    return this.utterance.voice;
  }

  enableTts(): void {
    this.isTtsEnabled = true;
  }

  disableTts(): void {
    this.isTtsEnabled = false;
    this.stop();
  }

  isTtsActive(): boolean {
    return this.isTtsEnabled;
  }

  isConfirmSelectionActive(): boolean {
    return this.confirmSelection();
  }

  enableConfirmSelection(): void {
    this.confirmSelection.set(true);
  }

  disableConfirmSelection(): void {
    this.confirmSelection.set(false);
  }

  speak(text: string): void {
    if (this.isTtsEnabled && text) {
      this.stop(); 
      this.utterance.text = text;
      this.speechSynthesis.speak(this.utterance);
    }
  }

  stop(): void {
    if (this.speechSynthesis.speaking) {
      this.speechSynthesis.cancel();
    }
  }

  setLanguage(lang: string): void {
    this.utterance.lang = lang;
    this.updateVoicesList();
  }
}
