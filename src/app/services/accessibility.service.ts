import { Injectable, signal } from '@angular/core';

type ColorMode = 'default' | 'deuteranopia' | 'protanopia' | 'tritanopia' | 'high-contrast';
type FontSize = 'small' | 'normal' | 'large' | 'x-large';

@Injectable({
  providedIn: 'root'
})
export class AccessibilityService {
  colorMode = signal<ColorMode>('default');
  fontSize = signal<FontSize>('normal');

  private loadSettings() {
    try {
      const savedColorMode = localStorage.getItem('colorMode') as ColorMode;
      if (savedColorMode) {
        this.colorMode.set(savedColorMode);
      }
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

  setColorMode(mode: ColorMode) {
    this.colorMode.set(mode);
    localStorage.setItem('colorMode', mode);
    this.applySettings();
  }

  setFontSize(size: FontSize) {
    this.fontSize.set(size);
    localStorage.setItem('fontSize', size);
    this.applySettings();
  }

  private applySettings() {
    document.documentElement.setAttribute('data-color-mode', this.colorMode());
    document.documentElement.setAttribute('data-font-size', this.fontSize());
  }

  getColorMode(): ColorMode {
    return this.colorMode();
  }

  getFontSize(): FontSize {
    return this.fontSize();
  }
}