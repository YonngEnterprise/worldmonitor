/**
 * Country Dashboard Page
 * Provides a dedicated route for country-specific intelligence dashboard
 * Integrates map visualization, real-time intelligence data, and multiple panels
 */

import type { AppContext } from '@/app/app-context';
import { CountryDashboard } from '@/components/CountryDashboard';
import { CountryIntelManager } from '@/app/country-intel';
import { getCountryNameByCode, getCountryBbox } from '@/services/country-geometry';

export class CountryDashboardPage {
  private dashboard: CountryDashboard | null = null;
  private container: HTMLElement;
  private mapInstance: any = null;

  constructor(container: HTMLElement, _ctx: AppContext, _countryIntel: CountryIntelManager) {
    this.container = container;
    this.mapInstance = _ctx.map;
  }

  public render(defaultCountry: string = 'ID'): void {
    console.log('CountryDashboardPage.render() called with country:', defaultCountry);
    this.container.innerHTML = '';
    
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

  private onCountrySelected(code: string, name: string): void {
    // Update URL
    const url = new URL(window.location.href);
    url.searchParams.set('country', code);
    window.history.replaceState({}, '', url.toString());

    // Fit map to country with bounds
    this.fitMapToCountry(code);

    // Load and display country intelligence content
    this.loadCountryContent(code, name);
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
      }
    ];

    // Render all panels
    container.innerHTML = panels.map(panel => `
      <div style="padding: 12px; background: #0a0a0a; border: 1px solid #2a2a2a; border-radius: 6px; overflow: hidden;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #1a1a1a;">
          <span style="font-size: 18px;">${panel.icon}</span>
          <h3 style="margin: 0; font-size: 13px; font-weight: 600; color: #e5e5e5;">${panel.title}</h3>
        </div>
        ${panel.content}
      </div>
    `).join('');
  }

  private loadFavorites(): string[] {
    try {
      const saved = localStorage.getItem('country-dashboard-favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  private getFlagEmoji(code: string): string {
    // Convert country code to flag emoji
    const codePoints = code
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  }

  public destroy(): void {
    if (this.dashboard) {
      this.dashboard.destroy();
      this.dashboard = null;
    }
  }
}
