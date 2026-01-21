import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type ThemeMode = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly THEME_KEY = 'santander-theme';
  private themeSubject = new BehaviorSubject<ThemeMode>(this.getStoredTheme());

  theme$: Observable<ThemeMode> = this.themeSubject.asObservable();

  constructor() {
    this.applyTheme(this.themeSubject.value);
  }

  private getStoredTheme(): ThemeMode {
    const stored = localStorage.getItem(this.THEME_KEY) as ThemeMode | null;
    if (stored) return stored;
    
    // Detectar preferencia del sistema
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  toggleTheme(): void {
    const current = this.themeSubject.value;
    const newTheme: ThemeMode = current === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  setTheme(theme: ThemeMode): void {
    localStorage.setItem(this.THEME_KEY, theme);
    this.themeSubject.next(theme);
    this.applyTheme(theme);
  }

  private applyTheme(theme: ThemeMode): void {
    // Aplicar atributo data-theme para design tokens
    document.documentElement.setAttribute('data-theme', theme);
    // Material v16 detecta automáticamente con prefers-color-scheme media query
  }

  getCurrentTheme(): ThemeMode {
    return this.themeSubject.value;
  }
}


