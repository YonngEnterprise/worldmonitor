/**
 * CountryDashboard - Country-specific dashboard page
 * Provides a focused view of a single country with:
 * - Country-scoped map with nearby infrastructure
 * - Country selector (searchable dropdown + favorites)
 * - Country brief panel
 */

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
  private mapContainer: HTMLElement | null = null;
  private panelsContainer: HTMLElement | null = null;

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
    try {
      const codes = getAllCountryCodes();
      if (codes && codes.length > 0) {
        this.allCountries = codes
          .map((code) => ({
            code,
            name: getCountryNameByCode(code) || code,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        return;
      }
    } catch (e) {
      console.warn('Failed to get country codes:', e);
    }

    // Fallback: use a hardcoded list of major countries
    this.allCountries = [
      { code: 'ID', name: 'Indonesia' },
      { code: 'US', name: 'United States' },
      { code: 'CN', name: 'China' },
      { code: 'IN', name: 'India' },
      { code: 'BR', name: 'Brazil' },
      { code: 'RU', name: 'Russia' },
      { code: 'JP', name: 'Japan' },
      { code: 'DE', name: 'Germany' },
      { code: 'GB', name: 'United Kingdom' },
      { code: 'FR', name: 'France' },
      { code: 'IT', name: 'Italy' },
      { code: 'CA', name: 'Canada' },
      { code: 'AU', name: 'Australia' },
      { code: 'MX', name: 'Mexico' },
      { code: 'KR', name: 'South Korea' },
      { code: 'ES', name: 'Spain' },
      { code: 'NL', name: 'Netherlands' },
      { code: 'CH', name: 'Switzerland' },
      { code: 'SE', name: 'Sweden' },
      { code: 'NO', name: 'Norway' },
      { code: 'DK', name: 'Denmark' },
      { code: 'FI', name: 'Finland' },
      { code: 'PL', name: 'Poland' },
      { code: 'UA', name: 'Ukraine' },
      { code: 'TR', name: 'Turkey' },
      { code: 'SA', name: 'Saudi Arabia' },
      { code: 'AE', name: 'United Arab Emirates' },
      { code: 'IL', name: 'Israel' },
      { code: 'IR', name: 'Iran' },
      { code: 'IQ', name: 'Iraq' },
      { code: 'SY', name: 'Syria' },
      { code: 'EG', name: 'Egypt' },
      { code: 'ZA', name: 'South Africa' },
      { code: 'NG', name: 'Nigeria' },
      { code: 'KE', name: 'Kenya' },
      { code: 'TH', name: 'Thailand' },
      { code: 'VN', name: 'Vietnam' },
      { code: 'PH', name: 'Philippines' },
      { code: 'SG', name: 'Singapore' },
      { code: 'MY', name: 'Malaysia' },
      { code: 'PK', name: 'Pakistan' },
      { code: 'BD', name: 'Bangladesh' },
      { code: 'AR', name: 'Argentina' },
      { code: 'CL', name: 'Chile' },
      { code: 'CO', name: 'Colombia' },
      { code: 'PE', name: 'Peru' },
      { code: 'NZ', name: 'New Zealand' },
      { code: 'GR', name: 'Greece' },
      { code: 'PT', name: 'Portugal' },
      { code: 'BE', name: 'Belgium' },
      { code: 'AT', name: 'Austria' },
      { code: 'CZ', name: 'Czech Republic' },
      { code: 'HU', name: 'Hungary' },
      { code: 'RO', name: 'Romania' },
      { code: 'BG', name: 'Bulgaria' },
      { code: 'HR', name: 'Croatia' },
      { code: 'RS', name: 'Serbia' },
      { code: 'GE', name: 'Georgia' },
      { code: 'KZ', name: 'Kazakhstan' },
      { code: 'UZ', name: 'Uzbekistan' },
      { code: 'TM', name: 'Turkmenistan' },
      { code: 'KG', name: 'Kyrgyzstan' },
      { code: 'TJ', name: 'Tajikistan' },
      { code: 'AF', name: 'Afghanistan' },
      { code: 'NP', name: 'Nepal' },
      { code: 'LK', name: 'Sri Lanka' },
      { code: 'MM', name: 'Myanmar' },
      { code: 'LA', name: 'Laos' },
      { code: 'KH', name: 'Cambodia' },
      { code: 'BN', name: 'Brunei' },
      { code: 'TL', name: 'Timor-Leste' },
      { code: 'HK', name: 'Hong Kong' },
      { code: 'TW', name: 'Taiwan' },
      { code: 'MO', name: 'Macau' },
      { code: 'MN', name: 'Mongolia' },
      { code: 'KP', name: 'North Korea' },
      { code: 'JP', name: 'Japan' },
      { code: 'CU', name: 'Cuba' },
      { code: 'VE', name: 'Venezuela' },
      { code: 'EC', name: 'Ecuador' },
      { code: 'BO', name: 'Bolivia' },
      { code: 'PY', name: 'Paraguay' },
      { code: 'UY', name: 'Uruguay' },
      { code: 'CR', name: 'Costa Rica' },
      { code: 'PA', name: 'Panama' },
      { code: 'JM', name: 'Jamaica' },
      { code: 'DO', name: 'Dominican Republic' },
      { code: 'HT', name: 'Haiti' },
      { code: 'TT', name: 'Trinidad and Tobago' },
      { code: 'BS', name: 'Bahamas' },
      { code: 'BB', name: 'Barbados' },
      { code: 'BZ', name: 'Belize' },
      { code: 'SV', name: 'El Salvador' },
      { code: 'GT', name: 'Guatemala' },
      { code: 'HN', name: 'Honduras' },
      { code: 'NI', name: 'Nicaragua' },
      { code: 'MA', code: 'Morocco' },
      { code: 'DZ', name: 'Algeria' },
      { code: 'TN', name: 'Tunisia' },
      { code: 'LY', name: 'Libya' },
      { code: 'SD', name: 'Sudan' },
      { code: 'ET', name: 'Ethiopia' },
      { code: 'SO', name: 'Somalia' },
      { code: 'DJ', name: 'Djibouti' },
      { code: 'ER', name: 'Eritrea' },
      { code: 'UG', name: 'Uganda' },
      { code: 'TZ', name: 'Tanzania' },
      { code: 'MW', name: 'Malawi' },
      { code: 'ZM', name: 'Zambia' },
      { code: 'ZW', name: 'Zimbabwe' },
      { code: 'BW', name: 'Botswana' },
      { code: 'NA', name: 'Namibia' },
      { code: 'AO', name: 'Angola' },
      { code: 'MZ', name: 'Mozambique' },
      { code: 'MG', name: 'Madagascar' },
      { code: 'MU', name: 'Mauritius' },
      { code: 'SC', name: 'Seychelles' },
      { code: 'CM', name: 'Cameroon' },
      { code: 'GA', name: 'Gabon' },
      { code: 'CG', name: 'Congo' },
      { code: 'CD', name: 'Democratic Republic of Congo' },
      { code: 'AO', name: 'Angola' },
      { code: 'GH', name: 'Ghana' },
      { code: 'CI', name: 'Ivory Coast' },
      { code: 'SN', name: 'Senegal' },
      { code: 'ML', name: 'Mali' },
      { code: 'BF', name: 'Burkina Faso' },
      { code: 'NE', name: 'Niger' },
      { code: 'TD', name: 'Chad' },
      { code: 'CF', name: 'Central African Republic' },
      { code: 'LR', name: 'Liberia' },
      { code: 'SL', name: 'Sierra Leone' },
      { code: 'GN', name: 'Guinea' },
      { code: 'GW', name: 'Guinea-Bissau' },
      { code: 'CV', name: 'Cape Verde' },
      { code: 'GM', name: 'Gambia' },
      { code: 'BJ', name: 'Benin' },
      { code: 'TG', name: 'Togo' },
      { code: 'LS', name: 'Lesotho' },
      { code: 'SZ', name: 'Eswatini' },
      { code: 'MR', name: 'Mauritania' },
      { code: 'KM', name: 'Comoros' },
      { code: 'RE', name: 'Reunion' },
      { code: 'YT', name: 'Mayotte' },
      { code: 'MH', name: 'Marshall Islands' },
      { code: 'FM', name: 'Micronesia' },
      { code: 'PW', name: 'Palau' },
      { code: 'KI', name: 'Kiribati' },
      { code: 'TO', name: 'Tonga' },
      { code: 'TV', name: 'Tuvalu' },
      { code: 'WS', name: 'Samoa' },
      { code: 'VU', name: 'Vanuatu' },
      { code: 'FJ', name: 'Fiji' },
      { code: 'SB', name: 'Solomon Islands' },
      { code: 'PG', name: 'Papua New Guinea' },
      { code: 'NC', name: 'New Caledonia' },
      { code: 'PF', name: 'French Polynesia' },
      { code: 'GU', name: 'Guam' },
      { code: 'AS', name: 'American Samoa' },
      { code: 'MP', name: 'Northern Mariana Islands' },
      { code: 'VI', name: 'U.S. Virgin Islands' },
      { code: 'PR', name: 'Puerto Rico' },
      { code: 'GS', name: 'South Georgia' },
      { code: 'FK', name: 'Falkland Islands' },
      { code: 'AI', name: 'Anguilla' },
      { code: 'BM', name: 'Bermuda' },
      { code: 'KY', name: 'Cayman Islands' },
      { code: 'GI', name: 'Gibraltar' },
      { code: 'GG', name: 'Guernsey' },
      { code: 'JE', name: 'Jersey' },
      { code: 'IM', name: 'Isle of Man' },
      { code: 'MT', name: 'Malta' },
      { code: 'CY', name: 'Cyprus' },
      { code: 'LU', name: 'Luxembourg' },
      { code: 'IE', name: 'Ireland' },
      { code: 'IS', name: 'Iceland' },
      { code: 'LT', name: 'Lithuania' },
      { code: 'LV', name: 'Latvia' },
      { code: 'EE', name: 'Estonia' },
      { code: 'BY', name: 'Belarus' },
      { code: 'MD', name: 'Moldova' },
      { code: 'AM', name: 'Armenia' },
      { code: 'AZ', name: 'Azerbaijan' },
      { code: 'QA', name: 'Qatar' },
      { code: 'BH', name: 'Bahrain' },
      { code: 'KW', name: 'Kuwait' },
      { code: 'OM', name: 'Oman' },
      { code: 'YE', name: 'Yemen' },
      { code: 'JO', name: 'Jordan' },
      { code: 'LB', name: 'Lebanon' },
      { code: 'PS', name: 'Palestine' },
      { code: 'BT', name: 'Bhutan' },
      { code: 'MV', name: 'Maldives' },
      { code: 'SG', name: 'Singapore' },
    ].sort((a, b) => a.name.localeCompare(b.name));
  }

  public render(): void {
    this.container.innerHTML = '';
    this.container.style.cssText = 'display: flex; flex-direction: column; width: 100%; height: 100%; overflow: hidden; background: #0a0a0a;';
    
    this.createHeader();
    this.createMainContent();
    
    // Ensure suggestions dropdown is properly initialized
    setTimeout(() => {
      this.suggestionsDropdown = this.container.querySelector('.country-suggestions-dropdown') as HTMLElement;
      this.searchInput = this.container.querySelector('.country-search-input') as HTMLInputElement;
      this.showInitialSuggestions();
    }, 0);
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
            autocomplete="off"
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
      this.searchInput.addEventListener('focus', () => this.handleSearchFocus());
      this.searchInput.addEventListener('blur', () => setTimeout(() => this.hideSuggestions(), 200));
      this.searchInput.addEventListener('keydown', (e) => this.handleSearchKeydown(e));
    }
  }

  private createMainContent(): void {
    const main = document.createElement('div');
    main.className = 'country-dashboard-main';
    main.style.cssText = 'display: flex; flex-direction: column; flex: 1; width: 100%; overflow: hidden;';

    // Create map container
    this.mapContainer = document.createElement('div');
    this.mapContainer.className = 'country-dashboard-map';
    this.mapContainer.id = 'country-dashboard-map';
    this.mapContainer.style.cssText = 'height: 50vh; flex-shrink: 0; width: 100%; overflow: hidden; background: #020a08;';
    this.mapContainer.innerHTML = '<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: #666; font-size: 14px;">Map will be rendered here</div>';
    main.appendChild(this.mapContainer);

    // Create panels grid
    this.panelsContainer = document.createElement('div');
    this.panelsContainer.className = 'country-dashboard-panels';
    this.panelsContainer.style.cssText = 'flex: 1; overflow-y: auto; width: 100%; display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 4px; padding: 4px; align-content: start;';
    this.panelsContainer.innerHTML = '<div style="grid-column: 1 / -1; padding: 16px; color: #999; text-align: center;">Select a country to view intelligence panels</div>';
    main.appendChild(this.panelsContainer);

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

  private handleSearchFocus(): void {
    const query = this.searchInput?.value.toLowerCase().trim() || '';
    if (query.length === 0) {
      this.showFavorites();
    } else {
      this.filterAndShowSuggestions(query);
    }
  }

  private handleSearchKeydown(e: KeyboardEvent): void {
    if (e.key === 'Escape') {
      this.hideSuggestions();
    }
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

  private showInitialSuggestions(): void {
    if (!this.suggestionsDropdown) return;
    
    if (this.favoriteCountries.size > 0) {
      const favorites = this.allCountries.filter((c) => this.favoriteCountries.has(c.code));
      this.renderSuggestions(favorites);
    } else {
      this.renderSuggestions(this.allCountries.slice(0, 20));
    }
    
    // Show the dropdown initially
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

    if (countries.length === 0) {
      const noResults = document.createElement('div');
      noResults.style.cssText = 'padding: 12px; color: #666; text-align: center; font-size: 13px;';
      noResults.textContent = 'No countries found';
      this.suggestionsDropdown.appendChild(noResults);
      return;
    }

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
                data-country="${country.code}"
                type="button">
          ${isFavorite ? '★' : '☆'}
        </button>
      `;

      const favoriteBtn = item.querySelector('.favorite-btn') as HTMLButtonElement;
      if (favoriteBtn) {
        favoriteBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.toggleFavorite(country.code);
          this.renderSuggestions(countries);
        });
      }

      item.addEventListener('click', () => {
        this.selectCountry(country.code, country.name);
      });

      this.suggestionsDropdown?.appendChild(item);
    });
  }

  private showSuggestions(): void {
    // Ensure we have a reference to the dropdown
    if (!this.suggestionsDropdown) {
      this.suggestionsDropdown = this.container.querySelector('.country-suggestions-dropdown') as HTMLElement;
    }
    if (this.suggestionsDropdown) {
      this.suggestionsDropdown.classList.remove('hidden');
    }
  }

  private hideSuggestions(): void {
    // Ensure we have a reference to the dropdown
    if (!this.suggestionsDropdown) {
      this.suggestionsDropdown = this.container.querySelector('.country-suggestions-dropdown') as HTMLElement;
    }
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
      const flag = toFlagEmoji(code, '🌍');
      this.searchInput.value = `${flag} ${name}`;
    }
    this.hideSuggestions();
    
    // Update panels display
    if (this.panelsContainer) {
      this.panelsContainer.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 16px; color: #4ade80;">
          <strong>${toFlagEmoji(code, '🌍')} ${name}</strong> selected
          <p style="color: #999; font-size: 12px; margin-top: 8px;">Intelligence panels will load here...</p>
        </div>
      `;
    }
    
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

  public getMapContainer(): HTMLElement | null {
    return this.mapContainer;
  }

  public getPanelsContainer(): HTMLElement | null {
    return this.panelsContainer;
  }

  public setMap(_map: any): void {
    // Map is used by the page controller for fitting and highlighting
    // This method is kept for API compatibility
  }

  public destroy(): void {
    this.container.innerHTML = '';
    this.onCountryChange = null;
    this.mapContainer = null;
    this.panelsContainer = null;
  }
}
