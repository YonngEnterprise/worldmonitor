/**
 * Country Dashboard Component
 * Provides a country-specific intelligence dashboard with searchable country list
 */

// List of countries with codes
const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'FR', name: 'France' },
  { code: 'DE', name: 'Germany' },
  { code: 'JP', name: 'Japan' },
  { code: 'CN', name: 'China' },
  { code: 'IN', name: 'India' },
  { code: 'BR', name: 'Brazil' },
  { code: 'RU', name: 'Russia' },
  { code: 'ID', name: 'Indonesia' },
  { code: 'MX', name: 'Mexico' },
  { code: 'KR', name: 'South Korea' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'IT', name: 'Italy' },
  { code: 'ES', name: 'Spain' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'EG', name: 'Egypt' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'IL', name: 'Israel' },
  { code: 'IR', name: 'Iran' },
  { code: 'IQ', name: 'Iraq' },
  { code: 'SY', name: 'Syria' },
  { code: 'UA', name: 'Ukraine' },
  { code: 'PK', name: 'Pakistan' },
  { code: 'BD', name: 'Bangladesh' },
  { code: 'TH', name: 'Thailand' },
  { code: 'VN', name: 'Vietnam' },
  { code: 'PH', name: 'Philippines' },
  { code: 'MY', name: 'Malaysia' },
  { code: 'SG', name: 'Singapore' },
  { code: 'TW', name: 'Taiwan' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'SE', name: 'Sweden' },
  { code: 'NO', name: 'Norway' },
  { code: 'DK', name: 'Denmark' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'BE', name: 'Belgium' },
  { code: 'AT', name: 'Austria' },
  { code: 'PL', name: 'Poland' },
  { code: 'CZ', name: 'Czech Republic' },
  { code: 'TR', name: 'Turkey' },
  { code: 'GR', name: 'Greece' },
  { code: 'PT', name: 'Portugal' },
  { code: 'CL', name: 'Chile' },
  { code: 'AR', name: 'Argentina' },
  { code: 'CO', name: 'Colombia' },
  { code: 'PE', name: 'Peru' },
];

export class CountryDashboard {
  private container: HTMLElement;
  private options: { defaultCountry: string; favoriteCountries: string[] };
  private favorites: Set<string>;
  private map: any = null;
  private countryChangeHandler: ((code: string, name: string) => void) | null = null;
  private searchInput: HTMLInputElement | null = null;
  private countryList: HTMLElement | null = null;
  private panelsContainer: HTMLElement | null = null;

  constructor(container: HTMLElement, options: { defaultCountry: string; favoriteCountries: string[] }) {
    this.container = container;
    this.options = options;
    this.favorites = new Set(options.favoriteCountries);
  }

  public render(): void {
    this.container.innerHTML = '';
    this.container.style.cssText = `
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      background: #0a0a0a;
      color: #e5e5e5;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    // Create header
    const header = this.createHeader();
    this.container.appendChild(header);

    // Create main content area
    const mainContent = document.createElement('div');
    mainContent.style.cssText = `
      flex: 1;
      display: flex;
      gap: 16px;
      padding: 16px;
      overflow: hidden;
    `;

    // Create sidebar with country list
    const sidebar = this.createSidebar();
    mainContent.appendChild(sidebar);

    // Create main area (map + panels)
    const mainArea = document.createElement('div');
    mainArea.style.cssText = `
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 16px;
      overflow: hidden;
    `;

    // Create map container
    const mapContainer = document.createElement('div');
    mapContainer.id = 'country-dashboard-map';
    mapContainer.style.cssText = `
      flex: 0 0 40%;
      background: #141414;
      border: 1px solid #2a2a2a;
      border-radius: 4px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #666;
      font-size: 14px;
    `;
    mapContainer.textContent = 'Map will be rendered here';
    mainArea.appendChild(mapContainer);

    // Create panels container
    this.panelsContainer = document.createElement('div');
    this.panelsContainer.id = 'country-dashboard-panels';
    this.panelsContainer.style.cssText = `
      flex: 1;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 12px;
      overflow-y: auto;
      padding-right: 8px;
    `;
    this.panelsContainer.textContent = 'Select a country to view intelligence panels';
    mainArea.appendChild(this.panelsContainer);

    mainContent.appendChild(mainArea);
    this.container.appendChild(mainContent);
  }

  private createHeader(): HTMLElement {
    const header = document.createElement('div');
    header.style.cssText = `
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 56px;
      padding: 0 16px;
      background: #141414;
      border-bottom: 1px solid #2a2a2a;
      flex-shrink: 0;
      z-index: 100;
    `;

    const title = document.createElement('h1');
    title.style.cssText = `
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #e5e5e5;
      letter-spacing: -0.5px;
    `;
    title.textContent = 'Country Dashboard';
    header.appendChild(title);

    return header;
  }

  private createSidebar(): HTMLElement {
    const sidebar = document.createElement('div');
    sidebar.style.cssText = `
      width: 280px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      overflow: hidden;
    `;

    // Search input
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
      outline: none;
      box-sizing: border-box;
    `;

    this.searchInput.addEventListener('input', () => this.filterCountries());
    this.searchInput.addEventListener('focus', () => this.showCountryList());
    sidebar.appendChild(this.searchInput);

    // Favorites section
    const favoritesLabel = document.createElement('div');
    favoritesLabel.style.cssText = `
      font-size: 11px;
      color: #999;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 0 4px;
      margin-top: 4px;
    `;
    favoritesLabel.textContent = 'Favorites';
    sidebar.appendChild(favoritesLabel);

    // Favorites list
    const favoritesList = document.createElement('div');
    favoritesList.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 4px;
      max-height: 120px;
      overflow-y: auto;
    `;

    this.favorites.forEach(code => {
      const country = COUNTRIES.find(c => c.code === code);
      if (country) {
        const btn = this.createCountryButton(country, true);
        favoritesList.appendChild(btn);
      }
    });

    if (this.favorites.size === 0) {
      const empty = document.createElement('div');
      empty.style.cssText = `
        font-size: 12px;
        color: #666;
        padding: 8px 4px;
      `;
      empty.textContent = 'No favorites yet';
      favoritesList.appendChild(empty);
    }

    sidebar.appendChild(favoritesList);

    // All countries section
    const allLabel = document.createElement('div');
    allLabel.style.cssText = `
      font-size: 11px;
      color: #999;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 0 4px;
      margin-top: 12px;
    `;
    allLabel.textContent = 'All Countries';
    sidebar.appendChild(allLabel);

    // Countries list
    this.countryList = document.createElement('div');
    this.countryList.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 4px;
      overflow-y: auto;
      flex: 1;
    `;

    COUNTRIES.forEach(country => {
      const btn = this.createCountryButton(country, false);
      this.countryList!.appendChild(btn);
    });

    sidebar.appendChild(this.countryList);

    return sidebar;
  }

  private createCountryButton(country: { code: string; name: string }, isFavorite: boolean): HTMLElement {
    const btn = document.createElement('button');
    const flag = this.getFlagEmoji(country.code);
    const isFav = this.favorites.has(country.code);

    btn.style.cssText = `
      width: 100%;
      padding: 8px 12px;
      background: ${isFavorite ? '#0f5040' : '#1a1a1a'};
      border: 1px solid ${isFavorite ? '#2a6a5a' : '#2a2a2a'};
      border-radius: 4px;
      color: ${isFavorite ? '#4ade80' : '#e5e5e5'};
      font-size: 13px;
      font-family: inherit;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      transition: all 0.2s ease;
      text-align: left;
    `;

    const nameSpan = document.createElement('span');
    nameSpan.textContent = `${flag} ${country.name}`;

    const starSpan = document.createElement('span');
    starSpan.textContent = isFav ? '★' : '☆';
    starSpan.style.cssText = `
      font-size: 14px;
      margin-left: 8px;
      flex-shrink: 0;
    `;

    btn.appendChild(nameSpan);
    btn.appendChild(starSpan);

    btn.addEventListener('click', () => {
      this.selectCountry(country.code, country.name);
    });

    btn.addEventListener('mouseenter', () => {
      btn.style.background = isFavorite ? '#0f6050' : '#252525';
      btn.style.borderColor = isFavorite ? '#3a7a6a' : '#3a3a3a';
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.background = isFavorite ? '#0f5040' : '#1a1a1a';
      btn.style.borderColor = isFavorite ? '#2a6a5a' : '#2a2a2a';
    });

    // Toggle favorite on star click
    starSpan.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleFavorite(country.code);
      starSpan.textContent = this.favorites.has(country.code) ? '★' : '☆';
    });

    return btn;
  }

  private filterCountries(): void {
    if (!this.searchInput || !this.countryList) return;

    const query = this.searchInput.value.toLowerCase();
    const buttons = this.countryList.querySelectorAll('button');

    buttons.forEach(btn => {
      const text = btn.textContent?.toLowerCase() || '';
      const matches = text.includes(query);
      btn.style.display = matches ? 'flex' : 'none';
    });
  }

  private showCountryList(): void {
    if (this.countryList) {
      this.countryList.style.display = 'flex';
    }
  }

  private selectCountry(code: string, name: string): void {
    if (this.searchInput) {
      this.searchInput.value = '';
    }

    if (this.countryChangeHandler) {
      this.countryChangeHandler(code, name);
    }
  }

  private toggleFavorite(code: string): void {
    if (this.favorites.has(code)) {
      this.favorites.delete(code);
    } else {
      this.favorites.add(code);
    }

    this.saveFavorites();
  }

  private saveFavorites(): void {
    localStorage.setItem('country-dashboard-favorites', JSON.stringify(Array.from(this.favorites)));
  }

  private getFlagEmoji(code: string): string {
    const codePoints = code
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  }

  public setCountryChangeHandler(handler: (code: string, name: string) => void): void {
    this.countryChangeHandler = handler;
  }

  public setMap(map: any): void {
    this.map = map;
  }

  public getPanelsContainer(): HTMLElement | null {
    return this.panelsContainer;
  }

  public destroy(): void {
    this.container.innerHTML = '';
  }
}
