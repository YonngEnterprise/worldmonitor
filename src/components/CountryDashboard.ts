/**
 * CountryDashboard - Country-specific dashboard page
 * Provides a focused view of a single country with:
 * - Country-scoped map with nearby infrastructure
 * - Country selector (searchable dropdown + favorites)
 * - Intelligence panels (CII, Risk, News, Economic, Infrastructure, etc.)
 * - Similar 3-column grid layout as world view
 */

import type { MapContainer } from '@/components';
import { getCountryNameByCode, getAllCountryCodes } from '@/services/country-geometry';
import { toFlagEmoji } from '@/utils/country-flag';

export interface CountryDashboardConfig {
  defaultCountry?: string;
  favoriteCountries?: string[];
}

export class CountryDashboard {
  private container: HTMLElement;
  private currentCountryCode: string = 'ID'; // Default to Indonesia
  private favoriteCountries: Set<string> = new Set();
  private searchInput: HTMLInputElement | null = null;
  private suggestionsDropdown: HTMLElement | null = null;
  private allCountries: Array<{ code: string; name: string }> = [];
  private onCountryChange: ((code: string, name: string) => void) | null = null;

  constructor(container: HTMLElement, config?: CountryDashboardConfig) {
    this.container = container;
    this.currentCountryCode = config?.defaultCountry || 'ID';
    if (config?.favoriteCountries) {
      this.favoriteCountries = new Set(config.favoriteCountries);
    }
    this.initializeCountryList();
    this.loadFavoritesFromStorage();
  }

  private initializeCountryList(): void {
    const codes = getAllCountryCodes();
    this.allCountries = codes
      .map((code) => ({
        code,
        name: getCountryNameByCode(code) || code,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  public render(): void {
    this.container.innerHTML = '';
    this.createHeader();
    this.createMainContent();
  }

  private createHeader(): void {
    const header = document.createElement('div');
    header.className = 'country-dashboard-header';
    header.innerHTML = `
      <div class="header-left">
        <h1 class="dashboard-title">Country Dashboard</h1>
      </div>
      <div class="header-right">
        <div class="country-selector-wrapper">
          <input 
            type="text" 
            class="country-search-input" 
            placeholder="Search countries..." 
            aria-label="Search countries"
          />
          <div class="country-suggestions-dropdown hidden"></div>
        </div>
      </div>
    `;
    this.container.appendChild(header);

    this.searchInput = header.querySelector('.country-search-input') as HTMLInputElement;
    this.suggestionsDropdown = header.querySelector('.country-suggestions-dropdown') as HTMLElement;

    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => this.handleSearchInput(e));
      this.searchInput.addEventListener('focus', () => this.showSuggestions());
      this.searchInput.addEventListener('blur', () => setTimeout(() => this.hideSuggestions(), 200));
    }
  }

  private createMainContent(): void {
    const main = document.createElement('div');
    main.className = 'country-dashboard-main';

    // Create map container
    const mapContainer = document.createElement('div');
    mapContainer.className = 'country-dashboard-map';
    mapContainer.id = 'country-dashboard-map';
    main.appendChild(mapContainer);

    // Create panels grid
    const panelsGrid = document.createElement('div');
    panelsGrid.className = 'country-dashboard-panels';
    main.appendChild(panelsGrid);

    this.container.appendChild(main);
  }

  private handleSearchInput(e: Event): void {
    const input = e.target as HTMLInputElement;
    const query = input.value.toLowerCase().trim();

    if (query.length === 0) {
      this.showFavorites();
      return;
    }

    this.filterAndShowSuggestions(query);
  }

  private filterAndShowSuggestions(query: string): void {
    const filtered = this.allCountries.filter(
      (country) =>
        country.name.toLowerCase().includes(query) ||
        country.code.toLowerCase().includes(query)
    );

    this.renderSuggestions(filtered);
    this.showSuggestions();
  }

  private showFavorites(): void {
    if (this.favoriteCountries.size === 0) {
      this.renderSuggestions(this.allCountries.slice(0, 20));
    } else {
      const favorites = this.allCountries.filter((c) => this.favoriteCountries.has(c.code));
      this.renderSuggestions(favorites);
    }
    this.showSuggestions();
  }

  private renderSuggestions(countries: Array<{ code: string; name: string }>): void {
    if (!this.suggestionsDropdown) return;

    this.suggestionsDropdown.innerHTML = '';

    countries.forEach((country) => {
      const item = document.createElement('div');
      item.className = 'country-suggestion-item';
      if (country.code === this.currentCountryCode) {
        item.classList.add('active');
      }

      const isFavorite = this.favoriteCountries.has(country.code);
      const flag = toFlagEmoji(country.code, '🌍');

      item.innerHTML = `
        <span class="flag">${flag}</span>
        <span class="name">${country.name}</span>
        <span class="code">${country.code}</span>
        <button class="favorite-btn ${isFavorite ? 'active' : ''}" 
                aria-label="Toggle favorite" 
                data-country="${country.code}">
          ${isFavorite ? '★' : '☆'}
        </button>
      `;

      item.addEventListener('click', (e) => {
        if ((e.target as HTMLElement).classList.contains('favorite-btn')) {
          e.stopPropagation();
          this.toggleFavorite(country.code);
          this.renderSuggestions(countries);
        } else {
          this.selectCountry(country.code, country.name);
        }
      });

      if (this.suggestionsDropdown) {
        this.suggestionsDropdown.appendChild(item);
      }
    });
  }

  private showSuggestions(): void {
    if (this.suggestionsDropdown) {
      this.suggestionsDropdown.classList.remove('hidden');
    }
  }

  private hideSuggestions(): void {
    if (this.suggestionsDropdown) {
      this.suggestionsDropdown.classList.add('hidden');
    }
  }

  private toggleFavorite(code: string): void {
    if (this.favoriteCountries.has(code)) {
      this.favoriteCountries.delete(code);
    } else {
      this.favoriteCountries.add(code);
    }
    this.saveFavoritesToStorage();
  }

  private saveFavoritesToStorage(): void {
    const key = 'country-dashboard-favorites';
    localStorage.setItem(key, JSON.stringify([...this.favoriteCountries]));
  }

  private loadFavoritesFromStorage(): void {
    const key = 'country-dashboard-favorites';
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        this.favoriteCountries = new Set(JSON.parse(stored));
      } catch {
        // Ignore parse errors
      }
    }
  }

  private selectCountry(code: string, name: string): void {
    this.currentCountryCode = code;
    if (this.searchInput) {
      this.searchInput.value = `${toFlagEmoji(code, '🌍')} ${name}`;
    }
    this.hideSuggestions();
    if (this.onCountryChange) {
      this.onCountryChange(code, name);
    }
  }

  public setCountryChangeHandler(handler: (code: string, name: string) => void): void {
    this.onCountryChange = handler;
  }

  public getCurrentCountry(): { code: string; name: string } {
    const name = getCountryNameByCode(this.currentCountryCode) || this.currentCountryCode;
    return { code: this.currentCountryCode, name };
  }

  public setMap(_map: MapContainer): void {
    // Map is used by the page controller for fitting and highlighting
    // This method is kept for API compatibility
  }

  public destroy(): void {
    this.container.innerHTML = '';
    this.onCountryChange = null;
  }
}
