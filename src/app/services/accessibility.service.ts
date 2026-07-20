import { Injectable, signal } from '@angular/core';

type FontSize = 'small' | 'normal' | 'large' | 'x-large';
type FontFamily = 'default' | 'open-dyslexic';

@Injectable({
  providedIn: 'root'
})
export class AccessibilityService {
  fontSize = signal<FontSize>('normal');
  fontFamily = signal<FontFamily>('open-dyslexic');

  private loadSettings() {
    try {
      const savedFontSize = localStorage.getItem('fontSize') as FontSize;
      if (savedFontSize) {
        this.fontSize.set(savedFontSize);
      }
      const savedFontFamily = localStorage.getItem('fontFamily') as FontFamily;
      if (savedFontFamily) {
        this.fontFamily.set(savedFontFamily);
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

  setFontFamily(family: FontFamily) {
    this.fontFamily.set(family);
    localStorage.setItem('fontFamily', family);
    this.applySettings();
  }

  private applySettings() {
    document.documentElement.setAttribute('data-font-size', this.fontSize());
    document.documentElement.setAttribute('data-font-family', this.fontFamily());
  }

  getFontSize(): FontSize {
    return this.fontSize();
  }

  getFontFamily(): FontFamily {
    return this.fontFamily();
  }
}