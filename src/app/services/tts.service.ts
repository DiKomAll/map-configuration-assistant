import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TtsService {
  private speechSynthesis: SpeechSynthesis;
  private utterance: SpeechSynthesisUtterance;
  private isTtsEnabled: boolean = false;

  constructor() {
    this.speechSynthesis = window.speechSynthesis;
    this.utterance = new SpeechSynthesisUtterance();
    this.utterance.lang = 'de-DE'; // Default to German

    // Set a default voice if available
    this.speechSynthesis.onvoiceschanged = () => {
      this.updateVoice();
    };
    
    // Initial attempt to set voice
    this.updateVoice();
  }

  private updateVoice(): void {
    const voices = this.speechSynthesis.getVoices();
    const germanVoice = voices.find(voice => voice.lang === 'de-DE' || voice.lang === 'de_DE');
    if (germanVoice) {
      this.utterance.voice = germanVoice;
    } else if (voices.length > 0) {
      this.utterance.voice = voices[0];
    }
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
    this.updateVoice();
  }
}
