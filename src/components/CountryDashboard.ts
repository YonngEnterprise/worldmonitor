/**
 * Country Dashboard Component
 * Provides a searchable country selector with retractable intelligence panel (slide-out)
 * matching the main dashboard's CountryDeepDivePanel style
 * Includes map layer controls for visualization
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

// Map layers configuration
const MAP_LAYERS = [
  { key: 'conflicts', icon: '⚔️', label: 'Conflict Zones', enabled: true },
  { key: 'bases', icon: '🏭', label: 'Military Bases', enabled: true },
  { key: 'hotspots', icon: '🔥', label: 'Intel Hotspots', enabled: false },
  { key: 'nuclear', icon: '☢️', label: 'Nuclear Sites', enabled: false },
  { key: 'sanctions', icon: '🚫', label: 'Sanctions', enabled: false },
  { key: 'weather', icon: '⛈️', label: 'Weather Alerts', enabled: false },
  { key: 'economic', icon: '💰', label: 'Economic Centers', enabled: false },
  { key: 'waterways', icon: '⚓', label: 'Strategic Waterways', enabled: false },
  { key: 'outages', icon: '📡', label: 'Internet Disruptions', enabled: false },
  { key: 'military', icon: '✈️', label: 'Military Activity', enabled: false },
  { key: 'natural', icon: '🌍', label: 'Natural Events', enabled: false },
  { key: 'iranAttacks', icon: '🎯', label: 'Iran Attacks', enabled: false },
];

export class CountryDashboard {
  private container: HTMLElement;
  private searchInput: HTMLInputElement | null = null;
  private suggestionsContainer: HTMLElement | null = null;
  private intelligencePanel: HTMLElement | null = null;
  private layersPanel: HTMLElement | null = null;
  private countryChangeHandler: ((code: string, name: string) => void) | null = null;
  private layerChangeHandler: ((layers: Record<string, boolean>) => void) | null = null;
  private enabledLayers: Record<string, boolean> = {};

  constructor(container: HTMLElement, _options: { defaultCountry: string; favoriteCountries: string[] }) {
    this.container = container;
    // Initialize enabled layers
    MAP_LAYERS.forEach(layer => {
      this.enabledLayers[layer.key] = layer.enabled;
    });
  }

  public render(): void {
    // Build the complete HTML structure with full-screen map and retractable panels
    const html = `
      <div style="display: flex; height: 100vh; background: #000; color: #e5e5e5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; flex-direction: column;">
        <!-- Header with Search -->
        <div style="position: fixed; top: 0; left: 0; right: 0; height: 56px; background: #0a0a0a; border-bottom: 1px solid #2a2a2a; display: flex; align-items: center; justify-content: space-between; padding: 0 16px; z-index: 100; gap: 16px;">
          <div style="font-size: 16px; font-weight: 600; white-space: nowrap;">Country Dashboard</div>
          <div style="position: relative; flex: 1; max-width: 300px;">
            <input type="text" placeholder="Search countries..." id="country-search" style="width: 100%; padding: 8px 12px; background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 4px; color: #e5e5e5; font-size: 13px;" />
            <div id="suggestions-container" style="position: absolute; top: 100%; left: 0; right: 0; background: #1a1a1a; border: 1px solid #2a2a2a; border-top: none; border-radius: 0 0 4px 4px; max-height: 300px; overflow-y: auto; display: none; z-index: 1000;"></div>
          </div>
          <button id="layers-toggle-btn" style="
            background: #1a1a1a;
            border: 1px solid #2a2a2a;
            color: #e5e5e5;
            padding: 8px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 13px;
            transition: all 0.2s;
          " onmouseover="this.style.background='#2a2a2a'" onmouseout="this.style.background='#1a1a1a'">🗺️ Layers</button>
        </div>
        
        <!-- Main Content Area (Map takes full width) -->
        <div style="display: flex; margin-top: 56px; flex: 1; width: 100%; overflow: hidden; position: relative;">
          <!-- Map Container (Full width) -->
          <div id="country-dashboard-map-container" style="flex: 1; display: flex; flex-direction: column; background: #000; width: 100%; height: 100%;">
            <div style="flex: 1; display: flex; align-items: center; justify-content: center; color: #666; font-size: 14px;">
              Map will be rendered here
            </div>
          </div>
        </div>
        
        <!-- Layers Panel (Slide from left) -->
        <aside id="layers-panel" style="
          position: fixed;
          top: 56px;
          left: -320px;
          width: 300px;
          height: calc(100vh - 56px);
          z-index: 4900;
          border-right: 1px solid #2a2a2a;
          background: #0a0a0a;
          box-shadow: 8px 0 32px rgba(0, 0, 0, 0.65);
          transition: left 0.28s ease;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        ">
          <!-- Layers Panel Header -->
          <div style="
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 16px;
            border-bottom: 1px solid #2a2a2a;
            flex-shrink: 0;
          ">
            <div style="
              font-size: 14px;
              font-weight: 600;
            ">Map Layers</div>
            <button id="layers-close-btn" style="
              background: none;
              border: none;
              color: #999;
              font-size: 24px;
              cursor: pointer;
              padding: 0;
              width: 32px;
              height: 32px;
              display: flex;
              align-items: center;
              justify-content: center;
              transition: color 0.2s;
            " onmouseover="this.style.color='#e5e5e5'" onmouseout="this.style.color='#999'">×</button>
          </div>
          
          <!-- Layers List -->
          <div id="layers-list" style="
            flex: 1;
            overflow-y: auto;
            padding: 12px;
            display: flex;
            flex-direction: column;
            gap: 8px;
          ">
            <!-- Layer toggles will be rendered here -->
          </div>
        </aside>
        
        <!-- Retractable Intelligence Panel (Slide from right) -->
        <aside id="country-intelligence-panel" style="
          position: fixed;
          top: 56px;
          right: -460px;
          width: 430px;
          height: calc(100vh - 56px);
          z-index: 5000;
          border-left: 1px solid #2a2a2a;
          background: #0a0a0a;
          box-shadow: -8px 0 32px rgba(0, 0, 0, 0.65);
          transition: right 0.28s ease;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        ">
          <!-- Panel Header -->
          <div style="
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 16px;
            border-bottom: 1px solid #2a2a2a;
            flex-shrink: 0;
          ">
            <div style="
              display: flex;
              align-items: center;
              gap: 8px;
              font-size: 14px;
              font-weight: 600;
            ">
              <span id="panel-country-flag" style="font-size: 20px;">🌍</span>
              <span id="panel-country-name">Select a country</span>
            </div>
            <button id="panel-close-btn" style="
              background: none;
              border: none;
              color: #999;
              font-size: 24px;
              cursor: pointer;
              padding: 0;
              width: 32px;
              height: 32px;
              display: flex;
              align-items: center;
              justify-content: center;
              transition: color 0.2s;
            " onmouseover="this.style.color='#e5e5e5'" onmouseout="this.style.color='#999'">×</button>
          </div>
          
          <!-- Panel Content (Scrollable) -->
          <div id="panel-content" style="
            flex: 1;
            overflow-y: auto;
            padding: 16px;
            display: flex;
            flex-direction: column;
            gap: 12px;
          ">
            <!-- Intelligence cards will be rendered here -->
            <div style="
              padding: 16px;
              background: #1a1a1a;
              border: 1px solid #2a2a2a;
              border-radius: 6px;
              color: #999;
              text-align: center;
              font-size: 13px;
            ">
              Select a country to view intelligence
            </div>
          </div>
        </aside>
      </div>
    `;

    this.container.innerHTML = html;
    this.searchInput = this.container.querySelector('#country-search') as HTMLInputElement;
    this.suggestionsContainer = this.container.querySelector('#suggestions-container') as HTMLElement;
    this.intelligencePanel = this.container.querySelector('#country-intelligence-panel') as HTMLElement;
    this.layersPanel = this.container.querySelector('#layers-panel') as HTMLElement;

    // Setup event listeners
    this.setupSearch();
    this.setupPanelClose();
    this.setupLayersToggle();
    this.renderLayerToggles();
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
        <div class="country-suggestion" data-code="${country.code}" data-name="${country.name}" style="
          padding: 10px 12px;
          border-bottom: 1px solid #2a2a2a;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          transition: background 0.2s;
        " onmouseover="this.style.background='#1a1a1a'" onmouseout="this.style.background='transparent'">
          <span style="font-size: 16px;">${country.flag}</span>
          <span>${country.name}</span>
          <span style="margin-left: auto; color: #666; font-size: 11px;">${country.code}</span>
        </div>
      `)
      .join('');

    this.suggestionsContainer.style.display = 'block';

    // Add click handlers to suggestions
    this.suggestionsContainer.querySelectorAll('.country-suggestion').forEach(el => {
      el.addEventListener('click', (e) => {
        const code = (e.currentTarget as HTMLElement).getAttribute('data-code');
        const name = (e.currentTarget as HTMLElement).getAttribute('data-name');
        if (code && name) {
          this.selectCountry(code, name);
        }
      });
    });
  }

  private selectCountry(code: string, name: string): void {
    if (this.searchInput) {
      this.searchInput.value = name;
    }
    if (this.suggestionsContainer) {
      this.suggestionsContainer.style.display = 'none';
    }
    this.openIntelligencePanel(code, name);
    this.countryChangeHandler?.(code, name);
  }

  private openIntelligencePanel(code: string, name: string): void {
    if (!this.intelligencePanel) return;

    // Update panel header
    const flagEl = this.container.querySelector('#panel-country-flag') as HTMLElement;
    const nameEl = this.container.querySelector('#panel-country-name') as HTMLElement;
    if (flagEl) flagEl.textContent = this.getCountryFlag(code);
    if (nameEl) nameEl.textContent = name;

    // Slide panel in
    this.intelligencePanel.style.right = '0';

    // Update panel content with intelligence cards
    this.updatePanelContent(code, name);
  }

  private closeIntelligencePanel(): void {
    if (!this.intelligencePanel) return;
    this.intelligencePanel.style.right = '-460px';
  }

  private setupPanelClose(): void {
    const closeBtn = this.container.querySelector('#panel-close-btn') as HTMLButtonElement;
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.closeIntelligencePanel();
      });
    }
  }

  private setupLayersToggle(): void {
    const toggleBtn = this.container.querySelector('#layers-toggle-btn') as HTMLButtonElement;
    const closeBtn = this.container.querySelector('#layers-close-btn') as HTMLButtonElement;
    
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        this.openLayersPanel();
      });
    }
    
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.closeLayersPanel();
      });
    }
  }

  private openLayersPanel(): void {
    if (!this.layersPanel) return;
    this.layersPanel.style.left = '0';
  }

  private closeLayersPanel(): void {
    if (!this.layersPanel) return;
    this.layersPanel.style.left = '-320px';
  }

  private renderLayerToggles(): void {
    const layersList = this.container.querySelector('#layers-list') as HTMLElement;
    if (!layersList) return;

    layersList.innerHTML = MAP_LAYERS.map(layer => `
      <label style="
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 12px;
        background: #1a1a1a;
        border: 1px solid #2a2a2a;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.2s;
      " onmouseover="this.style.background='#2a2a2a'" onmouseout="this.style.background='#1a1a1a'">
        <input type="checkbox" data-layer="${layer.key}" ${layer.enabled ? 'checked' : ''} style="
          cursor: pointer;
          width: 16px;
          height: 16px;
        " />
        <span style="font-size: 14px;">${layer.icon}</span>
        <span style="font-size: 12px; flex: 1;">${layer.label}</span>
      </label>
    `).join('');

    // Add change handlers
    layersList.querySelectorAll('input[type="checkbox"]').forEach(el => {
      el.addEventListener('change', (e) => {
        const layer = (e.target as HTMLInputElement).getAttribute('data-layer');
        const checked = (e.target as HTMLInputElement).checked;
        if (layer) {
          this.enabledLayers[layer] = checked;
          this.layerChangeHandler?.(this.enabledLayers);
        }
      });
    });
  }

  private getCountryFlag(code: string): string {
    const country = COUNTRIES_LIST.find(c => c.code === code);
    return country?.flag || '🌍';
  }

  private updatePanelContent(code: string, name: string): void {
    const contentEl = this.container.querySelector('#panel-content') as HTMLElement;
    if (!contentEl) return;

    // Generate mock intelligence data
    const data = this.generateCountryData(code);

    contentEl.innerHTML = `
      <!-- Country Overview Card -->
      <div style="
        padding: 12px;
        background: #1a1a1a;
        border: 1px solid #2a2a2a;
        border-radius: 6px;
      ">
        <div style="
          font-size: 12px;
          color: #999;
          text-transform: uppercase;
          margin-bottom: 8px;
          font-weight: 600;
        ">📍 Country Overview</div>
        <div style="
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        ">
          <div style="
            padding: 8px;
            background: #0a0a0a;
            border-radius: 4px;
            border: 1px solid #2a2a2a;
          ">
            <div style="font-size: 11px; color: #666; margin-bottom: 4px;">Country</div>
            <div style="font-size: 14px; font-weight: 600;">${name}</div>
          </div>
          <div style="
            padding: 8px;
            background: #0a0a0a;
            border-radius: 4px;
            border: 1px solid #2a2a2a;
          ">
            <div style="font-size: 11px; color: #666; margin-bottom: 4px;">Code</div>
            <div style="font-size: 14px; font-weight: 600;">${code}</div>
          </div>
          <div style="
            padding: 8px;
            background: #0a0a0a;
            border-radius: 4px;
            border: 1px solid #2a2a2a;
          ">
            <div style="font-size: 11px; color: #666; margin-bottom: 4px;">Infrastructure</div>
            <div style="font-size: 14px; font-weight: 600; color: #4ade80;">${data.infrastructure}</div>
          </div>
          <div style="
            padding: 8px;
            background: #0a0a0a;
            border-radius: 4px;
            border: 1px solid #2a2a2a;
          ">
            <div style="font-size: 11px; color: #666; margin-bottom: 4px;">Bases</div>
            <div style="font-size: 14px; font-weight: 600; color: #f59e0b;">${data.bases}</div>
          </div>
        </div>
      </div>

      <!-- Country Instability Index Card -->
      <div style="
        padding: 12px;
        background: #1a1a1a;
        border: 1px solid #2a2a2a;
        border-radius: 6px;
      ">
        <div style="
          font-size: 12px;
          color: #999;
          text-transform: uppercase;
          margin-bottom: 8px;
          font-weight: 600;
        ">⚠️ Country Instability Index</div>
        <div style="
          padding: 12px;
          background: #0a0a0a;
          border-radius: 4px;
          border: 1px solid #2a2a2a;
          display: flex;
          align-items: center;
          gap: 12px;
        ">
          <div style="
            font-size: 32px;
            font-weight: 700;
            color: ${data.ciiColor};
            min-width: 50px;
          ">${data.cii}</div>
          <div>
            <div style="font-size: 12px; color: #999;">CII Score</div>
            <div style="font-size: 13px; font-weight: 600; color: #e5e5e5;">${data.ciiLevel}</div>
            <div style="font-size: 11px; color: #666; margin-top: 2px;">Last updated: Today</div>
          </div>
        </div>
      </div>

      <!-- Infrastructure Card -->
      <div style="
        padding: 12px;
        background: #1a1a1a;
        border: 1px solid #2a2a2a;
        border-radius: 6px;
      ">
        <div style="
          font-size: 12px;
          color: #999;
          text-transform: uppercase;
          margin-bottom: 8px;
          font-weight: 600;
        ">🏗️ Infrastructure</div>
        <div style="
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        ">
          <div style="
            padding: 8px;
            background: #0a0a0a;
            border-radius: 4px;
            border: 1px solid #2a2a2a;
            text-align: center;
          ">
            <div style="font-size: 11px; color: #666; margin-bottom: 4px;">Ports</div>
            <div style="font-size: 16px; font-weight: 700; color: #60a5fa;">${data.ports}</div>
          </div>
          <div style="
            padding: 8px;
            background: #0a0a0a;
            border-radius: 4px;
            border: 1px solid #2a2a2a;
            text-align: center;
          ">
            <div style="font-size: 11px; color: #666; margin-bottom: 4px;">Cables</div>
            <div style="font-size: 16px; font-weight: 700; color: #60a5fa;">${data.cables}</div>
          </div>
        </div>
      </div>

      <!-- Economic Indicators Card -->
      <div style="
        padding: 12px;
        background: #1a1a1a;
        border: 1px solid #2a2a2a;
        border-radius: 6px;
      ">
        <div style="
          font-size: 12px;
          color: #999;
          text-transform: uppercase;
          margin-bottom: 8px;
          font-weight: 600;
        ">💰 Economic Indicators</div>
        <div style="
          padding: 12px;
          background: #0a0a0a;
          border-radius: 4px;
          border: 1px solid #2a2a2a;
        ">
          <div style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
          ">
            <span style="font-size: 12px; color: #999;">Economic Score</span>
            <span style="font-size: 14px; font-weight: 700; color: ${data.economicColor};">${data.economic}</span>
          </div>
          <div style="font-size: 11px; color: #666;">${data.economicStatus}</div>
        </div>
      </div>

      <!-- Military Activity Card -->
      <div style="
        padding: 12px;
        background: #1a1a1a;
        border: 1px solid #2a2a2a;
        border-radius: 6px;
      ">
        <div style="
          font-size: 12px;
          color: #999;
          text-transform: uppercase;
          margin-bottom: 8px;
          font-weight: 600;
        ">✈️ Military Activity</div>
        <div style="
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        ">
          <div style="
            padding: 8px;
            background: #0a0a0a;
            border-radius: 4px;
            border: 1px solid #2a2a2a;
            text-align: center;
          ">
            <div style="font-size: 11px; color: #666; margin-bottom: 4px;">Aircraft</div>
            <div style="font-size: 16px; font-weight: 700; color: #f59e0b;">${data.aircraft}</div>
          </div>
          <div style="
            padding: 8px;
            background: #0a0a0a;
            border-radius: 4px;
            border: 1px solid #2a2a2a;
            text-align: center;
          ">
            <div style="font-size: 11px; color: #666; margin-bottom: 4px;">Vessels</div>
            <div style="font-size: 16px; font-weight: 700; color: #f59e0b;">${data.vessels}</div>
          </div>
        </div>
      </div>

      <!-- Natural Disasters Card -->
      <div style="
        padding: 12px;
        background: #1a1a1a;
        border: 1px solid #2a2a2a;
        border-radius: 6px;
        margin-bottom: 12px;
      ">
        <div style="
          font-size: 12px;
          color: #999;
          text-transform: uppercase;
          margin-bottom: 8px;
          font-weight: 600;
        ">🌍 Natural Disasters</div>
        <div style="
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 8px;
        ">
          <div style="
            padding: 8px;
            background: #0a0a0a;
            border-radius: 4px;
            border: 1px solid #2a2a2a;
            text-align: center;
          ">
            <div style="font-size: 11px; color: #666; margin-bottom: 4px;">Earthquakes</div>
            <div style="font-size: 14px; font-weight: 700; color: #ef4444;">${data.earthquakes}</div>
          </div>
          <div style="
            padding: 8px;
            background: #0a0a0a;
            border-radius: 4px;
            border: 1px solid #2a2a2a;
            text-align: center;
          ">
            <div style="font-size: 11px; color: #666; margin-bottom: 4px;">Floods</div>
            <div style="font-size: 14px; font-weight: 700; color: #3b82f6;">${data.floods}</div>
          </div>
          <div style="
            padding: 8px;
            background: #0a0a0a;
            border-radius: 4px;
            border: 1px solid #2a2a2a;
            text-align: center;
          ">
            <div style="font-size: 11px; color: #666; margin-bottom: 4px;">Cyclones</div>
            <div style="font-size: 14px; font-weight: 700; color: #8b5cf6;">${data.cyclones}</div>
          </div>
        </div>
      </div>
    `;
  }

  private generateCountryData(code: string): any {
    // Generate consistent mock data based on country code
    const seed = code.charCodeAt(0) + code.charCodeAt(1);
    const random = (min: number, max: number) => Math.floor((seed * 7919 % (max - min + 1)) + min);

    const cii = random(5, 85);
    let ciiLevel = 'Stable';
    let ciiColor = '#10b981';
    if (cii > 60) {
      ciiLevel = 'Critical';
      ciiColor = '#dc2626';
    } else if (cii > 45) {
      ciiLevel = 'Unstable';
      ciiColor = '#ef4444';
    } else if (cii > 30) {
      ciiLevel = 'Moderate';
      ciiColor = '#f59e0b';
    }

    const economic = random(20, 85);
    let economicColor = '#4ade80';
    let economicStatus = 'Healthy';
    if (economic < 40) {
      economicColor = '#ef4444';
      economicStatus = 'Concerning';
    } else if (economic < 60) {
      economicColor = '#f59e0b';
      economicStatus = 'Moderate';
    }

    return {
      infrastructure: random(30, 120),
      bases: random(10, 60),
      cii,
      ciiLevel,
      ciiColor,
      ports: random(5, 40),
      cables: random(2, 25),
      economic,
      economicStatus,
      economicColor,
      aircraft: random(50, 500),
      vessels: random(10, 100),
      earthquakes: random(0, 15),
      floods: random(0, 20),
      cyclones: random(0, 8),
    };
  }

  public setCountryChangeHandler(handler: (code: string, name: string) => void): void {
    this.countryChangeHandler = handler;
  }

  public setLayerChangeHandler(handler: (layers: Record<string, boolean>) => void): void {
    this.layerChangeHandler = handler;
  }

  public getMapContainer(): HTMLElement | null {
    return this.container.querySelector('#country-dashboard-map-container') as HTMLElement;
  }

  public getPanelsContainer(): HTMLElement | null {
    return this.container.querySelector('#panel-content') as HTMLElement;
  }

  public getEnabledLayers(): Record<string, boolean> {
    return { ...this.enabledLayers };
  }

  public destroy(): void {
    this.closeIntelligencePanel();
    this.closeLayersPanel();
    this.container.innerHTML = '';
  }
}
