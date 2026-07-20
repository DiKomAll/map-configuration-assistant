import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TtsService {
  private speechSynthesis: SpeechSynthesis;
  private utterance: SpeechSynthesisUtterance;
  private isTtsEnabled: boolean = false;
  private isConfirmSelectionEnabled: boolean = true; // Default to true if TTS is enabled

  // Volume and rate settings (with persistence)
  private volume: number = this.loadSetting('ttsVolume', 1);
  private rate: number = this.loadSetting('ttsRate', 1);

  // Debounce for smooth TTS
  private speakDebounceTimer?: any;
  private pendingSpeakText?: string;
  private DEBOUNCE_DELAY = 800; // ms

  // Signal for voices to ensure reactivity
  voices = signal<SpeechSynthesisVoice[]>([]);
  confirmSelection = signal<boolean>(true);

  constructor() {
    this.speechSynthesis = window.speechSynthesis;
    this.utterance = new SpeechSynthesisUtterance();
    this.utterance.lang = 'de-DE'; // Default to German

    // Apply saved volume and rate
    this.utterance.volume = this.volume;
    this.utterance.rate = this.rate;

    // Set a default voice if available
    this.speechSynthesis.onvoiceschanged = () => {
      this.updateVoicesList();
    };

    // Initial attempt to set voice
    this.updateVoicesList();
  }

  private loadSetting<T>(key: string, defaultValue: T): T {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private saveSetting(key: string, value: any) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
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

  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    this.utterance.volume = this.volume;
    this.saveSetting('ttsVolume', this.volume);
  }

  setRate(rate: number): void {
    this.rate = Math.max(0.1, Math.min(2, rate));
    this.utterance.rate = this.rate;
    this.saveSetting('ttsRate', this.rate);
  }

  getVolume(): number {
    return this.volume;
  }

  getRate(): number {
    return this.rate;
  }

  /** Get preferred German voices with fallback list */
  getPreferredVoices(): SpeechSynthesisVoice[] {
    const allVoices = this.voices();
    const germanVoices = allVoices.filter(v => v.lang.startsWith('de'));

    // If no German voices, provide helpful message
    if (germanVoices.length === 0) {
      return [];
    }

    // Sort by name for consistent ordering
    return germanVoices.sort((a, b) => a.name.localeCompare(b.name));
  }

  /** Stop any pending debounced speech and clear timer */
  cancelPendingSpeech(): void {
    if (this.speakDebounceTimer) {
      clearTimeout(this.speakDebounceTimer);
      this.speakDebounceTimer = undefined;
    }
    this.pendingSpeakText = undefined;
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
      // Debounce: cancel any pending speech and schedule new one
      if (this.speakDebounceTimer) {
        clearTimeout(this.speakDebounceTimer);
      }

      this.pendingSpeakText = text;
      this.speakDebounceTimer = setTimeout(() => {
        if (this.pendingSpeakText) {
          this.stop();
          this.utterance.text = this.pendingSpeakText;
          this.speechSynthesis.speak(this.utterance);
          this.pendingSpeakText = undefined;
          this.speakDebounceTimer = undefined;
        }
      }, this.DEBOUNCE_DELAY);
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
