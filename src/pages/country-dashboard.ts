/**
 * Country Dashboard Page
 * Provides a dedicated route for country-specific intelligence dashboard
 */

import type { AppContext } from '@/app/app-context';
import { CountryDashboard } from '@/components/CountryDashboard';
import { CountryIntelManager } from '@/app/country-intel';
import { getCountryNameByCode } from '@/services/country-geometry';

export class CountryDashboardPage {
  private dashboard: CountryDashboard | null = null;
  private container: HTMLElement;
  private ctx: AppContext;
  private countryIntel: CountryIntelManager;

  constructor(container: HTMLElement, ctx: AppContext, countryIntel: CountryIntelManager) {
    this.container = container;
    this.ctx = ctx;
    this.countryIntel = countryIntel;
  }

  public render(defaultCountry: string = 'ID'): void {
    this.container.innerHTML = '';
    this.dashboard = new CountryDashboard(this.container, {
      defaultCountry,
      favoriteCountries: this.loadFavorites(),
    });

    this.dashboard.setCountryChangeHandler((code, name) => {
      this.onCountrySelected(code, name);
    });

    this.dashboard.setMap(this.ctx.map!);
    this.dashboard.render();

    // Load initial country
    this.onCountrySelected(defaultCountry, getCountryNameByCode(defaultCountry) || defaultCountry);
  }

  private onCountrySelected(code: string, name: string): void {
    // Update URL
    const url = new URL(window.location.href);
    url.searchParams.set('country', code);
    window.history.replaceState({}, '', url.toString());

    // Open country brief
    this.countryIntel.openCountryBriefByCode(code, name);

    // Fit map to country
    this.ctx.map?.fitCountry(code);
    this.ctx.map?.highlightCountry(code);
  }

  private loadFavorites(): string[] {
    try {
      const stored = localStorage.getItem('country-dashboard-favorites');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  public destroy(): void {
    this.dashboard?.destroy();
    this.dashboard = null;
    this.container.innerHTML = '';
  }
}
