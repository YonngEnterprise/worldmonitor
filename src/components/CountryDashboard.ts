/**
 * Country Dashboard Component - Production Ready
 * Simplified implementation with visible sidebar and working country selector
 * Enhanced with mobile optimization and additional features
 */

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
  private panelsContainer: HTMLElement | null = null;
  private sidebarOpen: boolean = true;
  private isMobile: boolean = false;

  constructor(container: HTMLElement, options: { defaultCountry: string; favoriteCountries: string[] }) {
    this.container = container;
    this.options = options;
    this.favorites = new Set(options.favoriteCountries);
    this.isMobile = window.innerWidth < 768;
    this.sidebarOpen = !this.isMobile; // Sidebar closed by default on mobile
  }

  public render(): void {
    // Build the complete HTML structure with mobile responsiveness
    const html = `
      <div style="width: 100%; height: 100%; display: flex; flex-direction: column; background: #0a0a0a; color: #e5e5e5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; position: relative;">
        <!-- Header -->
        <div style="display: flex; align-items: center; justify-content: space-between; height: 56px; padding: 0 16px; background: #141414; border-bottom: 1px solid #2a2a2a; flex-shrink: 0; z-index: 100; gap: 12px;">
          <h1 style="margin: 0; font-size: 18px; font-weight: 600; color: #e5e5e5; letter-spacing: -0.5px; flex-shrink: 0;">Country Dashboard</h1>
          <button id="sidebar-toggle" style="display: none; background: #1a1a1a; border: 1px solid #2a2a2a; color: #e5e5e5; width: 32px; height: 32px; border-radius: 4px; cursor: pointer; font-size: 16px; flex-shrink: 0;">☰</button>
          <input type="text" id="country-search" placeholder="Search countries..." style="flex: 1; min-width: 0; height: 32px; padding: 0 12px; background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 4px; color: #e5e5e5; font-size: 13px; font-family: inherit; outline: none; box-sizing: border-box;">
        </div>
        
        <!-- Main Content -->
        <div style="flex: 1; display: flex; gap: 16px; padding: 16px; overflow: hidden; position: relative;">
          <!-- Sidebar Overlay (Mobile) -->
          <div id="sidebar-overlay" style="display: none; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.5); z-index: 99;"></div>
          
          <!-- Sidebar -->
          <div id="sidebar" style="width: 280px; display: flex; flex-direction: column; gap: 12px; overflow: hidden; flex-shrink: 0; position: relative; z-index: 100;">
            <!-- Favorites Section -->
            <div style="flex: 0 0 auto;">
              <div style="font-size: 11px; color: #999; text-transform: uppercase; letter-spacing: 0.5px; padding: 0 4px; margin-bottom: 8px;">⭐ Favorites</div>
              <div id="favorites-list" style="display: flex; flex-direction: column; gap: 4px; max-height: 120px; overflow-y: auto;"></div>
            </div>
            
            <!-- All Countries Section -->
            <div style="flex: 1; display: flex; flex-direction: column; overflow: hidden; min-height: 0;">
              <div style="font-size: 11px; color: #999; text-transform: uppercase; letter-spacing: 0.5px; padding: 0 4px; margin-bottom: 8px;">🌍 All Countries</div>
              <div id="countries-list" style="display: flex; flex-direction: column; gap: 4px; overflow-y: auto; flex: 1;"></div>
            </div>
          </div>
          
          <!-- Main Area -->
          <div style="flex: 1; display: flex; flex-direction: column; gap: 16px; overflow: hidden;">
            <!-- Map -->
            <div id="country-dashboard-map" style="flex: 0 0 40%; background: #141414; border: 1px solid #2a2a2a; border-radius: 4px; overflow: hidden; display: flex; align-items: center; justify-content: center; color: #666; font-size: 14px;">🗺️ Map will be rendered here</div>
            
            <!-- Panels -->
            <div id="country-dashboard-panels" style="flex: 1; display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 12px; overflow-y: auto; padding-right: 8px;">📊 Select a country to view intelligence panels</div>
          </div>
        </div>
      </div>
      
      <style>
        @media (max-width: 768px) {
          #sidebar {
            position: absolute !important;
            left: 0 !important;
            top: 56px !important;
            bottom: 0 !important;
            width: 280px !important;
            background: #0a0a0a !important;
            border-right: 1px solid #2a2a2a !important;
            z-index: 101 !important;
            transform: translateX(-100%) !important;
            transition: transform 0.3s ease !important;
          }
          
          #sidebar.open {
            transform: translateX(0) !important;
          }
          
          #sidebar-overlay {
            display: block !important;
          }
          
          #sidebar-overlay.hidden {
            display: none !important;
          }
          
          #sidebar-toggle {
            display: flex !important;
            align-items: center;
            justify-content: center;
          }
          
          #country-dashboard-panels {
            grid-template-columns: 1fr !important;
          }
        }
        
        @media (max-width: 480px) {
          #country-dashboard-map {
            flex: 0 0 30% !important;
          }
          
          #country-search {
            font-size: 12px !important;
          }
        }
      </style>
    `;
    
    this.container.innerHTML = html;
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Populate country lists
    this.populateCountryLists();
    
    // Get panels container reference
    this.panelsContainer = this.container.querySelector('#country-dashboard-panels') as HTMLElement;
    
    // Setup mobile sidebar
    this.setupMobileSidebar();
  }

  private setupEventListeners(): void {
    const searchInput = this.container.querySelector('#country-search') as HTMLInputElement;
    if (searchInput) {
      searchInput.addEventListener('input', () => this.filterCountries());
    }
  }

  private setupMobileSidebar(): void {
    if (!this.isMobile) return;

    const toggleBtn = this.container.querySelector('#sidebar-toggle') as HTMLButtonElement;
    const sidebar = this.container.querySelector('#sidebar') as HTMLElement;
    const overlay = this.container.querySelector('#sidebar-overlay') as HTMLElement;

    if (!toggleBtn || !sidebar || !overlay) return;

    toggleBtn.addEventListener('click', () => {
      this.sidebarOpen = !this.sidebarOpen;
      if (this.sidebarOpen) {
        sidebar.classList.add('open');
        overlay.classList.remove('hidden');
      } else {
        sidebar.classList.remove('open');
        overlay.classList.add('hidden');
      }
    });

    overlay.addEventListener('click', () => {
      this.sidebarOpen = false;
      sidebar.classList.remove('open');
      overlay.classList.add('hidden');
    });
  }

  private populateCountryLists(): void {
    const favoritesList = this.container.querySelector('#favorites-list') as HTMLElement;
    const countriesList = this.container.querySelector('#countries-list') as HTMLElement;
    
    if (!favoritesList || !countriesList) return;
    
    // Clear existing content
    favoritesList.innerHTML = '';
    countriesList.innerHTML = '';
    
    // Add favorites
    let hasFavorites = false;
    COUNTRIES.forEach(country => {
      if (this.favorites.has(country.code)) {
        favoritesList.appendChild(this.createCountryButton(country, true));
        hasFavorites = true;
      }
    });
    
    if (!hasFavorites) {
      const empty = document.createElement('div');
      empty.style.cssText = 'font-size: 12px; color: #666; padding: 8px 4px;';
      empty.textContent = 'No favorites yet - click ☆ to add';
      favoritesList.appendChild(empty);
    }
    
    // Add all countries
    COUNTRIES.forEach(country => {
      countriesList.appendChild(this.createCountryButton(country, false));
    });
  }

  private createCountryButton(country: { code: string; name: string }, isFavorite: boolean): HTMLElement {
    const btn = document.createElement('button');
    const flag = this.getFlagEmoji(country.code);
    const isFav = this.favorites.has(country.code);
    
    btn.className = `country-btn-${country.code}`;
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
    starSpan.style.cssText = 'font-size: 14px; margin-left: 8px; flex-shrink: 0; cursor: pointer;';
    
    btn.appendChild(nameSpan);
    btn.appendChild(starSpan);
    
    // Click to select country
    btn.addEventListener('click', () => {
      this.selectCountry(country.code, country.name);
    });
    
    // Hover effects
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
      
      // Refresh the lists
      this.populateCountryLists();
    });
    
    return btn;
  }

  private filterCountries(): void {
    const searchInput = this.container.querySelector('#country-search') as HTMLInputElement;
    if (!searchInput) return;
    
    const query = searchInput.value.toLowerCase();
    const buttons = this.container.querySelectorAll('button[class*="country-btn"]');
    
    buttons.forEach(btn => {
      const text = btn.textContent?.toLowerCase() || '';
      const matches = text.includes(query);
      btn.style.display = matches ? 'flex' : 'none';
    });
  }

  private selectCountry(code: string, name: string): void {
    const searchInput = this.container.querySelector('#country-search') as HTMLInputElement;
    if (searchInput) {
      searchInput.value = '';
    }
    
    // Clear filter
    this.filterCountries();
    
    // Close sidebar on mobile after selection
    if (this.isMobile) {
      this.sidebarOpen = false;
      const sidebar = this.container.querySelector('#sidebar') as HTMLElement;
      const overlay = this.container.querySelector('#sidebar-overlay') as HTMLElement;
      if (sidebar) sidebar.classList.remove('open');
      if (overlay) overlay.classList.add('hidden');
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
