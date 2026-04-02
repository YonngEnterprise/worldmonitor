/**
 * Country Dashboard Component
 * Provides a searchable country selector with favorites and map/panel integration
 */

// Country list for search autocomplete
const COUNTRIES_LIST = [
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'CN', name: 'China', flag: '🇨🇳' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { code: 'RU', name: 'Russia', flag: '🇷🇺' },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦' },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪' },
  { code: 'IL', name: 'Israel', flag: '🇮🇱' },
  { code: 'IR', name: 'Iran', flag: '🇮🇷' },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭' },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳' },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭' },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰' },
  { code: 'BD', name: 'Bangladesh', flag: '🇧🇩' },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷' },
  { code: 'GR', name: 'Greece', flag: '🇬🇷' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹' },
  { code: 'CL', name: 'Chile', flag: '🇨🇱' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴' },
  { code: 'PE', name: 'Peru', flag: '🇵🇪' },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪' },
  { code: 'NO', name: 'Norway', flag: '🇳🇴' },
  { code: 'DK', name: 'Denmark', flag: '🇩🇰' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪' },
  { code: 'AT', name: 'Austria', flag: '🇦🇹' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭' },
  { code: 'PL', name: 'Poland', flag: '🇵🇱' },
  { code: 'CZ', name: 'Czech Republic', flag: '🇨🇿' },
  { code: 'HU', name: 'Hungary', flag: '🇭🇺' },
  { code: 'RO', name: 'Romania', flag: '🇷🇴' },
];

export class CountryDashboard {
  private container: HTMLElement;
  private panelsContainer: HTMLElement | null = null;
  private searchInput: HTMLInputElement | null = null;
  private suggestionsContainer: HTMLElement | null = null;
  private countryChangeHandler: ((code: string, name: string) => void) | null = null;

  constructor(container: HTMLElement, _options: { defaultCountry: string; favoriteCountries: string[] }) {
    this.container = container;
  }

  public render(): void {
    // Build the complete HTML structure with mobile responsiveness
    const html = `
      <div style="display: flex; height: 100vh; background: #000; color: #e5e5e5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; flex-direction: column;">
        <!-- Header -->
        <div style="position: fixed; top: 0; left: 0; right: 0; height: 56px; background: #0a0a0a; border-bottom: 1px solid #2a2a2a; display: flex; align-items: center; justify-content: space-between; padding: 0 16px; z-index: 100; gap: 16px;">
          <div style="font-size: 16px; font-weight: 600; white-space: nowrap;">Country Dashboard</div>
          <div style="position: relative; flex: 1; max-width: 300px;">
            <input type="text" placeholder="Search countries..." id="country-search" style="width: 100%; padding: 8px 12px; background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 4px; color: #e5e5e5; font-size: 13px;" />
            <div id="suggestions-container" style="position: absolute; top: 100%; left: 0; right: 0; background: #1a1a1a; border: 1px solid #2a2a2a; border-top: none; border-radius: 0 0 4px 4px; max-height: 300px; overflow-y: auto; display: none; z-index: 1000;"></div>
          </div>
        </div>
        
        <!-- Main Content -->
        <div style="display: flex; margin-top: 56px; flex: 1; width: 100%; overflow: hidden;">
          <!-- Map Container -->
          <div style="flex: 1; display: flex; flex-direction: column; background: #000;">
            <div style="flex: 1; display: flex; align-items: center; justify-content: center; color: #666; font-size: 14px;">
              Map will be rendered here
            </div>
          </div>
          
          <!-- Panels Container -->
          <div id="panels-container" style="width: 35%; overflow-y: auto; padding: 16px; background: #0a0a0a; border-left: 1px solid #2a2a2a; display: flex; flex-direction: column; gap: 12px;">
            <div style="padding: 16px; background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 6px; color: #999; text-align: center; font-size: 13px;">
              Select a country to view intelligence panels
            </div>
          </div>
        </div>
      </div>
    `;

    this.container.innerHTML = html;
    this.panelsContainer = this.container.querySelector('#panels-container') as HTMLElement;
    this.searchInput = this.container.querySelector('#country-search') as HTMLInputElement;
    this.suggestionsContainer = this.container.querySelector('#suggestions-container') as HTMLElement;

    // Setup search functionality
    this.setupSearch();
  }

  private setupSearch(): void {
    if (!this.searchInput || !this.suggestionsContainer) return;

    this.searchInput.addEventListener('focus', () => {
      this.showSuggestions('');
    });

    this.searchInput.addEventListener('input', (e) => {
      const query = (e.target as HTMLInputElement).value;
      this.showSuggestions(query);
    });

    this.searchInput.addEventListener('blur', () => {
      setTimeout(() => {
        if (this.suggestionsContainer) {
          this.suggestionsContainer.style.display = 'none';
        }
      }, 200);
    });
  }

  private showSuggestions(query: string): void {
    if (!this.suggestionsContainer) return;

    const filtered = COUNTRIES_LIST.filter(c => 
      c.name.toLowerCase().includes(query.toLowerCase()) || 
      c.code.toLowerCase().includes(query.toLowerCase())
    );

    if (filtered.length === 0) {
      this.suggestionsContainer.innerHTML = '<div style="padding: 8px 12px; color: #666; font-size: 12px;">No countries found</div>';
      this.suggestionsContainer.style.display = 'block';
      return;
    }

    this.suggestionsContainer.innerHTML = filtered
      .map(country => `
        <div class="country-suggestion" data-code="${country.code}" data-name="${country.name}" style="padding: 10px 12px; border-bottom: 1px solid #2a2a2a; cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 13px; transition: background 0.2s;">
          <span style="font-size: 16px;">${country.flag}</span>
          <span>${country.name}</span>
          <span style="color: #666; margin-left: auto;">${country.code}</span>
        </div>
      `)
      .join('');

    this.suggestionsContainer.style.display = 'block';

    // Add click handlers
    this.suggestionsContainer.querySelectorAll('.country-suggestion').forEach(el => {
      el.addEventListener('click', () => {
        const code = el.getAttribute('data-code');
        const name = el.getAttribute('data-name');
        if (code && name) {
          this.selectCountry(code, name);
        }
      });

      el.addEventListener('mouseenter', () => {
        (el as HTMLElement).style.background = '#2a2a2a';
      });

      el.addEventListener('mouseleave', () => {
        (el as HTMLElement).style.background = 'transparent';
      });
    });
  }

  private selectCountry(code: string, name: string): void {
    if (this.searchInput) {
      this.searchInput.value = `${name} (${code})`;
    }
    if (this.suggestionsContainer) {
      this.suggestionsContainer.style.display = 'none';
    }
    if (this.countryChangeHandler) {
      this.countryChangeHandler(code, name);
    }
  }

  public setCountryChangeHandler(handler: (code: string, name: string) => void): void {
    this.countryChangeHandler = handler;
  }

  public setMap(_map: any): void {
    // Map will be set here for future integration
  }

  public getPanelsContainer(): HTMLElement | null {
    return this.panelsContainer;
  }

  public destroy(): void {
    this.container.innerHTML = '';
  }
}
