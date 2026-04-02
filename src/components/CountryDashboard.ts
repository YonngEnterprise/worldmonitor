/**
 * CountryDashboard - Country-specific dashboard page
 * Provides a focused view of a single country with:
 * - Country-scoped map with nearby infrastructure
 * - Country selector (searchable dropdown + favorites)
 * - Country brief panel
 */

export interface CountryDashboardConfig {
  defaultCountry?: string;
  favoriteCountries?: string[];
}

// Hardcoded list of countries
const COUNTRIES = [
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
  { code: 'MA', name: 'Morocco' },
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
  { code: 'IE', name: 'Ireland' },
  { code: 'IS', name: 'Iceland' },
  { code: 'LT', name: 'Lithuania' },
  { code: 'LV', name: 'Latvia' },
  { code: 'EE', name: 'Estonia' },
  { code: 'BY', name: 'Belarus' },
  { code: 'MD', name: 'Moldova' },
  { code: 'AM', name: 'Armenia' },
  { code: 'AZ', name: 'Azerbaijan' },
].sort((a, b) => a.name.localeCompare(b.name));

export class CountryDashboard {
  private container: HTMLElement;
  private currentCountryCode: string = 'ID';
  private favoriteCountries: Set<string> = new Set();
  private onCountryChange: ((code: string, name: string) => void) | null = null;
  private mapContainer: HTMLElement | null = null;
  private panelsContainer: HTMLElement | null = null;
  private searchInput: HTMLInputElement | null = null;
  private dropdownList: HTMLElement | null = null;

  constructor(container: HTMLElement, config?: CountryDashboardConfig) {
    this.container = container;
    this.currentCountryCode = config?.defaultCountry || 'ID';
    if (config?.favoriteCountries) {
      this.favoriteCountries = new Set(config.favoriteCountries);
    }
    this.loadFavoritesFromStorage();
  }

  public render(): void {
    this.container.innerHTML = '';
    this.container.style.cssText = 'display: flex; flex-direction: column; width: 100%; height: 100%; overflow: hidden; background: #0a0a0a;';
    
    this.createHeader();
    this.createMainContent();
    this.attachEventListeners();
    this.updateCountryList('');
  }

  private createHeader(): void {
    const header = document.createElement('div');
    header.className = 'country-dashboard-header';
    header.style.cssText = `
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 56px;
      padding: 0 16px;
      background: #141414;
      border-bottom: 1px solid #2a2a2a;
      gap: 16px;
      flex-shrink: 0;
      z-index: 100;
      width: 100%;
    `;

    const titleDiv = document.createElement('div');
    titleDiv.style.cssText = 'flex: 1;';
    const title = document.createElement('h1');
    title.textContent = 'Country Dashboard';
    title.style.cssText = `
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #e5e5e5;
      letter-spacing: -0.5px;
    `;
    titleDiv.appendChild(title);
    header.appendChild(titleDiv);

    const selectorDiv = document.createElement('div');
    selectorDiv.style.cssText = 'position: relative; width: 280px; z-index: 10000;';

    this.searchInput = document.createElement('input');
    this.searchInput.type = 'text';
    this.searchInput.placeholder = 'Search countries...';
    this.searchInput.style.cssText = `
      width: 100%;
      height: 32px;
      padding: 0 12px;
      background: #1a1a1a;
      border: 1px solid #2a2a2a;
      border-radius: 4px;
      color: #e5e5e5;
      font-size: 13px;
      font-family: inherit;
      transition: all 0.2s ease;
      outline: none;
      box-sizing: border-box;
    `;

    this.dropdownList = document.createElement('div');
    this.dropdownList.style.cssText = `
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      margin-top: 4px;
      background: #1a1a1a;
      border: 1px solid #2a2a2a;
      border-radius: 4px;
      max-height: 400px;
      overflow-y: auto;
      z-index: 1000;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
      display: block;
    `;

    selectorDiv.appendChild(this.searchInput);
    selectorDiv.appendChild(this.dropdownList);
    header.appendChild(selectorDiv);

    this.container.appendChild(header);
  }

  private createMainContent(): void {
    const main = document.createElement('div');
    main.style.cssText = 'display: flex; flex-direction: column; flex: 1; width: 100%; overflow: hidden;';

    this.mapContainer = document.createElement('div');
    this.mapContainer.id = 'country-dashboard-map';
    this.mapContainer.style.cssText = `
      height: 50vh;
      flex-shrink: 0;
      width: 100%;
      overflow: hidden;
      background: #020a08;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #666;
      font-size: 14px;
    `;
    this.mapContainer.textContent = 'Map will be rendered here';
    main.appendChild(this.mapContainer);

    this.panelsContainer = document.createElement('div');
    this.panelsContainer.style.cssText = `
      flex: 1;
      overflow-y: auto;
      width: 100%;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 4px;
      padding: 4px;
      align-content: start;
    `;
    this.panelsContainer.innerHTML = '<div style="grid-column: 1 / -1; padding: 16px; color: #999; text-align: center;">Select a country to view intelligence panels</div>';
    main.appendChild(this.panelsContainer);

    this.container.appendChild(main);
  }

  private attachEventListeners(): void {
    if (!this.searchInput || !this.dropdownList) return;

    this.searchInput.addEventListener('input', (e) => {
      const query = (e.target as HTMLInputElement).value;
      this.updateCountryList(query);
    });

    this.searchInput.addEventListener('focus', () => {
      if (this.dropdownList) {
        this.dropdownList.style.display = 'block';
      }
    });

    this.searchInput.addEventListener('blur', () => {
      setTimeout(() => {
        if (this.dropdownList) {
          this.dropdownList.style.display = 'none';
        }
      }, 200);
    });
  }

  private updateCountryList(query: string): void {
    if (!this.dropdownList) return;

    const filtered = query.trim().length === 0 
      ? COUNTRIES.slice(0, 20)
      : COUNTRIES.filter(c => 
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.code.toLowerCase().includes(query.toLowerCase())
        );

    this.dropdownList.innerHTML = '';

    if (filtered.length === 0) {
      const noResults = document.createElement('div');
      noResults.style.cssText = 'padding: 12px; color: #666; text-align: center; font-size: 13px;';
      noResults.textContent = 'No countries found';
      this.dropdownList.appendChild(noResults);
      return;
    }

    filtered.forEach(country => {
      const item = document.createElement('div');
      item.style.cssText = `
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        cursor: pointer;
        transition: background-color 0.15s ease;
        border-bottom: 1px solid #0a0a0a;
      `;

      if (country.code === this.currentCountryCode) {
        item.style.background = '#0f5040';
      }

      const isFavorite = this.favoriteCountries.has(country.code);
      const flag = this.getFlagEmoji(country.code);

      item.innerHTML = `
        <span style="font-size: 18px;">${flag}</span>
        <span style="flex: 1; color: #e5e5e5;">${country.name}</span>
        <span style="color: #999; font-size: 12px;">${country.code}</span>
        <button style="
          background: none;
          border: none;
          color: #4ade80;
          cursor: pointer;
          font-size: 14px;
          padding: 0;
          margin: 0;
        ">${isFavorite ? '★' : '☆'}</button>
      `;

      const btn = item.querySelector('button') as HTMLButtonElement;
      if (btn) {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.toggleFavorite(country.code);
          this.updateCountryList(this.searchInput?.value || '');
        });
      }

      item.addEventListener('click', () => {
        this.selectCountry(country.code, country.name);
      });

      item.addEventListener('mouseenter', () => {
        if (country.code !== this.currentCountryCode) {
          item.style.background = '#1a1a1a';
        }
      });

      item.addEventListener('mouseleave', () => {
        if (country.code !== this.currentCountryCode) {
          item.style.background = 'transparent';
        }
      });

      this.dropdownList?.appendChild(item);
    });
  }

  private selectCountry(code: string, name: string): void {
    this.currentCountryCode = code;
    if (this.searchInput) {
      const flag = this.getFlagEmoji(code);
      this.searchInput.value = `${flag} ${name}`;
    }
    if (this.dropdownList) {
      this.dropdownList.style.display = 'none';
    }

    if (this.panelsContainer) {
      this.panelsContainer.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 16px; color: #4ade80;">
          <strong>${this.getFlagEmoji(code)} ${name}</strong> selected
          <p style="color: #999; font-size: 12px; margin-top: 8px;">Intelligence panels will load here...</p>
        </div>
      `;
    }

    if (this.onCountryChange) {
      this.onCountryChange(code, name);
    }
  }

  private getFlagEmoji(code: string): string {
    const codePoints = code
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
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
    localStorage.setItem('country-dashboard-favorites', JSON.stringify([...this.favoriteCountries]));
  }

  private loadFavoritesFromStorage(): void {
    try {
      const stored = localStorage.getItem('country-dashboard-favorites');
      if (stored) {
        this.favoriteCountries = new Set(JSON.parse(stored));
      }
    } catch {
      // Ignore errors
    }
  }

  public setCountryChangeHandler(handler: (code: string, name: string) => void): void {
    this.onCountryChange = handler;
  }

  public getCurrentCountry(): { code: string; name: string } {
    const country = COUNTRIES.find(c => c.code === this.currentCountryCode);
    return country || { code: this.currentCountryCode, name: this.currentCountryCode };
  }

  public getMapContainer(): HTMLElement | null {
    return this.mapContainer;
  }

  public getPanelsContainer(): HTMLElement | null {
    return this.panelsContainer;
  }

  public setMap(_map: any): void {
    // Map is used by the page controller for fitting and highlighting
  }

  public destroy(): void {
    this.container.innerHTML = '';
    this.onCountryChange = null;
    this.mapContainer = null;
    this.panelsContainer = null;
  }
}
