import { Injectable, signal } from '@angular/core';

type FontSize = 'small' | 'normal' | 'large' | 'x-large';

@Injectable({
  providedIn: 'root'
})
export class AccessibilityService {
  fontSize = signal<FontSize>('normal');

  private loadSettings() {
    try {
      const savedFontSize = localStorage.getItem('fontSize') as FontSize;
      if (savedFontSize) {
        this.fontSize.set(savedFontSize);
      }
    } catch {}
  }

  constructor() {
    this.loadSettings();
    this.applySettings();
  }

  setFontSize(size: FontSize) {
    this.fontSize.set(size);
    localStorage.setItem('fontSize', size);
    this.applySettings();
  }

  private applySettings() {
    document.documentElement.setAttribute('data-font-size', this.fontSize());
  }

  getFontSize(): FontSize {
    return this.fontSize();
  }
}