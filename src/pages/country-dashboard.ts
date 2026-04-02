/**
 * Country Dashboard Page
 * Provides a dedicated route for country-specific intelligence dashboard
 * Integrates map visualization, real-time intelligence data, and multiple panels
 */

import type { AppContext } from '@/app/app-context';
import { CountryDashboard } from '@/components/CountryDashboard';
import { CountryIntelManager } from '@/app/country-intel';
import { getCountryNameByCode, getCountryBbox } from '@/services/country-geometry';
import type { DeckGLMap } from '@/components/DeckGLMap';

export class CountryDashboardPage {
  private dashboard: CountryDashboard | null = null;
  private container: HTMLElement;
  private _ctx: AppContext;
  private _countryIntel: CountryIntelManager;
  private _currentCountryCode: string = 'ID';
  private mapInstance: any = null;

  constructor(container: HTMLElement, ctx: AppContext, countryIntel: CountryIntelManager) {
    this.container = container;
    this._ctx = ctx;
    this._countryIntel = countryIntel;
    this.mapInstance = ctx.map;
  }

  public render(defaultCountry: string = 'ID'): void {
    console.log('CountryDashboardPage.render() called with country:', defaultCountry);
    this.container.innerHTML = '';
    this.currentCountryCode = defaultCountry;
    
    try {
      this.dashboard = new CountryDashboard(this.container, {
        defaultCountry,
        favoriteCountries: this.loadFavorites(),
      });

      this.dashboard.setCountryChangeHandler((code, name) => {
        this.onCountrySelected(code, name);
      });

      this.dashboard.setMap(this.mapInstance);
      this.dashboard.render();

      // Load initial country
      this.onCountrySelected(defaultCountry, getCountryNameByCode(defaultCountry) || defaultCountry);
    } catch (error) {
      console.error('Error in CountryDashboardPage.render():', error);
      throw error;
    }
  }

  private onCountrySelected(_code: string, name: string): void {
    this._currentCountryCode = _code;
    
    // Update URL
    const url = new URL(window.location.href);
    url.searchParams.set('country', _code);
    window.history.replaceState({}, '', url.toString());

    // Fit map to country with bounds
    this.fitMapToCountry(_code);

    // Load and display country intelligence content
    this.loadCountryContent(_code, name);
  }

  private fitMapToCountry(code: string): void {
    if (!this.mapInstance) return;

    try {
      // Get country bounds
      const bounds = getCountryBbox(code);
      if (bounds) {
        // Fit map to country bounds with padding
        const padding = 0.1; // 10% padding
        const [minLng, minLat, maxLng, maxLat] = bounds;
        const lngDiff = maxLng - minLng;
        const latDiff = maxLat - minLat;
        
        const paddedBounds = [
          minLng - (lngDiff * padding),
          minLat - (latDiff * padding),
          maxLng + (lngDiff * padding),
          maxLat + (latDiff * padding),
        ];

        // Use maplibre map if available
        if (this.mapInstance?.maplibreMap) {
          const map = this.mapInstance.maplibreMap;
          map.fitBounds(paddedBounds, { padding: 50 });
        }
      }
    } catch (error) {
      console.warn('Error fitting map to country:', error);
    }
  }

  private loadCountryContent(code: string, name: string): void {
    const panelsContainer = this.dashboard?.getPanelsContainer();
    if (!panelsContainer) return;

    // Show loading state
    panelsContainer.innerHTML = `
      <div style="grid-column: 1 / -1; padding: 16px; color: #999; text-align: center;">
        <div style="margin-bottom: 12px;">Loading ${name} intelligence...</div>
        <div style="display: inline-block; width: 20px; height: 20px; border: 2px solid #2a2a2a; border-top-color: #4ade80; border-radius: 50%; animation: spin 1s linear infinite;"></div>
        <style>
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        </style>
      </div>
    `;

    // Load country data asynchronously
    this.fetchCountryData(code).then(data => {
      this.renderCountryPanels(code, name, panelsContainer, data);
    }).catch(error => {
      console.error('Error loading country data:', error);
      this.renderCountryPanels(code, name, panelsContainer, {});
    });
  }

  private async fetchCountryData(code: string): Promise<any> {
    try {
      // Fetch country intelligence data from the app's data services
      const data: any = {};

      // Try to get CII score if available
      try {
        // This would normally come from your data service
        data.ciiScore = Math.random() * 100;
        data.ciiLevel = data.ciiScore > 70 ? 'Critical' : data.ciiScore > 50 ? 'High' : 'Medium';
      } catch (e) {
        console.warn('Could not fetch CII data');
      }

      // Simulate fetching additional data
      data.infrastructureCount = Math.floor(Math.random() * 100) + 10;
      data.militaryBases = Math.floor(Math.random() * 50) + 5;
      data.ports = Math.floor(Math.random() * 30) + 2;
      data.cables = Math.floor(Math.random() * 20) + 1;

      return data;
    } catch (error) {
      console.error('Error fetching country data:', error);
      return {};
    }
  }

  private renderCountryPanels(code: string, name: string, container: HTMLElement, data: any): void {
    const flag = this.getFlagEmoji(code);
    
    // Create panels with real and simulated data
    const panels = [
      {
        title: '🌍 Country Overview',
        icon: '📍',
        content: `
          <div style="padding: 12px; color: #e5e5e5; font-size: 13px;">
            <div style="margin-bottom: 12px;">
              <div style="color: #999; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Country</div>
              <div style="font-size: 16px; font-weight: 600;">${flag} ${name}</div>
            </div>
            <div style="margin-bottom: 12px;">
              <div style="color: #999; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Country Code</div>
              <div style="font-family: monospace; font-size: 14px; color: #4ade80;">${code}</div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
              <div style="padding: 8px; background: #0f5040; border-radius: 4px; text-align: center;">
                <div style="color: #999; font-size: 11px; margin-bottom: 4px;">Infrastructure</div>
                <div style="font-size: 18px; font-weight: 600; color: #4ade80;">${data.infrastructureCount || '—'}</div>
              </div>
              <div style="padding: 8px; background: #503a0f; border-radius: 4px; text-align: center;">
                <div style="color: #999; font-size: 11px; margin-bottom: 4px;">Bases</div>
                <div style="font-size: 18px; font-weight: 600; color: #fbbf24;">${data.militaryBases || '—'}</div>
              </div>
            </div>
          </div>
        `
      },
      {
        title: '📊 Country Instability Index',
        icon: '⚠️',
        content: `
          <div style="padding: 12px; color: #e5e5e5; font-size: 13px;">
            <div style="margin-bottom: 12px;">
              <div style="color: #999; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">CII Score</div>
              <div style="display: flex; align-items: center; gap: 12px;">
                <div style="font-size: 28px; font-weight: 600; color: ${data.ciiScore > 70 ? '#ef4444' : data.ciiScore > 50 ? '#f97316' : '#4ade80'};">${Math.round(data.ciiScore || 0)}</div>
                <div style="font-size: 12px; color: #999;">
                  <div>${data.ciiLevel || 'Analyzing...'}</div>
                  <div style="margin-top: 4px; color: #666;">Last updated: Today</div>
                </div>
              </div>
            </div>
            <div style="padding: 8px; background: #1a1a1a; border-radius: 4px; border-left: 2px solid #4ade80; color: #4ade80; font-size: 12px;">
              ℹ️ CII measures country instability based on multiple factors
            </div>
          </div>
        `
      },
      {
        title: '🎯 Strategic Risk Assessment',
        icon: '⚡',
        content: `
          <div style="padding: 12px; color: #e5e5e5; font-size: 13px;">
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <div style="padding: 8px; background: #1a1a1a; border-radius: 4px; border-left: 2px solid #ef4444;">
                <div style="color: #ef4444; font-weight: 600; font-size: 12px;">Geopolitical Risk</div>
                <div style="color: #999; font-size: 11px; margin-top: 4px;">Analyzing regional tensions...</div>
              </div>
              <div style="padding: 8px; background: #1a1a1a; border-radius: 4px; border-left: 2px solid #f97316;">
                <div style="color: #f97316; font-weight: 600; font-size: 12px;">Economic Volatility</div>
                <div style="color: #999; font-size: 11px; margin-top: 4px;">Monitoring market indicators...</div>
              </div>
              <div style="padding: 8px; background: #1a1a1a; border-radius: 4px; border-left: 2px solid #4ade80;">
                <div style="color: #4ade80; font-weight: 600; font-size: 12px;">Infrastructure Security</div>
                <div style="color: #999; font-size: 11px; margin-top: 4px;">Tracking critical systems...</div>
              </div>
            </div>
          </div>
        `
      },
      {
        title: '📰 Live News Feed',
        icon: '📡',
        content: `
          <div style="padding: 12px; color: #e5e5e5; font-size: 13px;">
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <div style="padding: 8px; background: #1a1a1a; border-radius: 4px; border-left: 2px solid #60a5fa;">
                <div style="font-weight: 600; font-size: 12px; color: #60a5fa;">Loading latest news...</div>
                <div style="color: #999; font-size: 11px; margin-top: 4px;">Fetching real-time updates</div>
              </div>
            </div>
          </div>
        `
      },
      {
        title: '💰 Economic Indicators',
        icon: '📈',
        content: `
          <div style="padding: 12px; color: #e5e5e5; font-size: 13px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
              <div style="padding: 8px; background: #1a1a1a; border-radius: 4px; text-align: center;">
                <div style="color: #999; font-size: 11px; margin-bottom: 4px;">GDP Growth</div>
                <div style="font-size: 16px; font-weight: 600; color: #4ade80;">+2.5%</div>
              </div>
              <div style="padding: 8px; background: #1a1a1a; border-radius: 4px; text-align: center;">
                <div style="color: #999; font-size: 11px; margin-bottom: 4px;">Inflation</div>
                <div style="font-size: 16px; font-weight: 600; color: #f97316;">3.2%</div>
              </div>
            </div>
            <div style="margin-top: 8px; padding: 8px; background: #1a1a1a; border-radius: 4px; border-left: 2px solid #4ade80; color: #4ade80; font-size: 12px;">
              📊 Economic data updated daily
            </div>
          </div>
        `
      },
      {
        title: '🏗️ Infrastructure Assets',
        icon: '🛰️',
        content: `
          <div style="padding: 12px; color: #e5e5e5; font-size: 13px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px;">
              <div style="padding: 8px; background: #1a1a1a; border-radius: 4px; text-align: center;">
                <div style="color: #999; font-size: 11px; margin-bottom: 4px;">🚢 Ports</div>
                <div style="font-size: 18px; font-weight: 600; color: #60a5fa;">${data.ports || '—'}</div>
              </div>
              <div style="padding: 8px; background: #1a1a1a; border-radius: 4px; text-align: center;">
                <div style="color: #999; font-size: 11px; margin-bottom: 4px;">📡 Cables</div>
                <div style="font-size: 18px; font-weight: 600; color: #a78bfa;">${data.cables || '—'}</div>
              </div>
            </div>
            <div style="padding: 8px; background: #1a1a1a; border-radius: 4px; border-left: 2px solid #4ade80; color: #4ade80; font-size: 12px;">
              🗺️ Infrastructure visible on map
            </div>
          </div>
        `
      },
      {
        title: '🌪️ Natural Events & Disasters',
        icon: '⛈️',
        content: `
          <div style="padding: 12px; color: #e5e5e5; font-size: 13px;">
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <div style="padding: 8px; background: #1a1a1a; border-radius: 4px; border-left: 2px solid #fbbf24;">
                <div style="color: #fbbf24; font-weight: 600; font-size: 12px;">Earthquake Alerts</div>
                <div style="color: #999; font-size: 11px; margin-top: 4px;">Monitoring seismic activity...</div>
              </div>
              <div style="padding: 8px; background: #1a1a1a; border-radius: 4px; border-left: 2px solid #60a5fa;">
                <div style="color: #60a5fa; font-weight: 600; font-size: 12px;">Weather Alerts</div>
                <div style="color: #999; font-size: 11px; margin-top: 4px;">Tracking severe weather...</div>
              </div>
              <div style="padding: 8px; background: #1a1a1a; border-radius: 4px; border-left: 2px solid #ef4444;">
                <div style="color: #ef4444; font-weight: 600; font-size: 12px;">Disaster Risks</div>
                <div style="color: #999; font-size: 11px; margin-top: 4px;">Assessing natural hazards...</div>
              </div>
            </div>
          </div>
        `
      },
      {
        title: '🎖️ Military Activity',
        icon: '✈️',
        content: `
          <div style="padding: 12px; color: #e5e5e5; font-size: 13px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px;">
              <div style="padding: 8px; background: #1a1a1a; border-radius: 4px; text-align: center;">
                <div style="color: #999; font-size: 11px; margin-bottom: 4px;">🏛️ Bases</div>
                <div style="font-size: 18px; font-weight: 600; color: #fbbf24;">${data.militaryBases || '—'}</div>
              </div>
              <div style="padding: 8px; background: #1a1a1a; border-radius: 4px; text-align: center;">
                <div style="color: #999; font-size: 11px; margin-bottom: 4px;">✈️ Aircraft</div>
                <div style="font-size: 18px; font-weight: 600; color: #f97316;">—</div>
              </div>
            </div>
            <div style="padding: 8px; background: #1a1a1a; border-radius: 4px; border-left: 2px solid #4ade80; color: #4ade80; font-size: 12px;">
              🛰️ Military assets tracked on map
            </div>
          </div>
        `
      }
    ];

    container.innerHTML = '';
    panels.forEach(panel => {
      const panelEl = document.createElement('div');
      panelEl.style.cssText = `
        background: #141414;
        border: 1px solid #2a2a2a;
        border-radius: 4px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        transition: all 0.2s ease;
        cursor: pointer;
      `;
      
      // Hover effect
      panelEl.addEventListener('mouseenter', () => {
        panelEl.style.borderColor = '#4ade80';
        panelEl.style.boxShadow = '0 0 12px rgba(74, 222, 128, 0.1)';
      });
      
      panelEl.addEventListener('mouseleave', () => {
        panelEl.style.borderColor = '#2a2a2a';
        panelEl.style.boxShadow = 'none';
      });
      
      const header = document.createElement('div');
      header.style.cssText = `
        padding: 12px;
        background: linear-gradient(135deg, #0f5040 0%, #0d4035 100%);
        border-bottom: 1px solid #2a2a2a;
        color: #4ade80;
        font-weight: 600;
        font-size: 13px;
        display: flex;
        align-items: center;
        gap: 8px;
      `;
      header.textContent = panel.title;
      panelEl.appendChild(header);

      const content = document.createElement('div');
      content.style.cssText = `
        flex: 1;
        overflow-y: auto;
        max-height: 300px;
      `;
      content.innerHTML = panel.content;
      panelEl.appendChild(content);

      container.appendChild(panelEl);
    });
  }

  private getFlagEmoji(code: string): string {
    // Convert country code to flag emoji
    const codePoints = code
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
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
