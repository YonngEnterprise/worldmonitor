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
    console.log('CountryDashboardPage.render() called with country:', defaultCountry);
    this.container.innerHTML = '';
    console.log('Container cleared, creating dashboard...');
    
    try {
      this.dashboard = new CountryDashboard(this.container, {
        defaultCountry,
        favoriteCountries: this.loadFavorites(),
      });
      console.log('CountryDashboard instance created successfully');

      this.dashboard.setCountryChangeHandler((code, name) => {
        this.onCountrySelected(code, name);
      });
      console.log('Country change handler set');

      this.dashboard.setMap(this.ctx.map!);
      console.log('Map set, calling render()...');
      this.dashboard.render();
      console.log('Dashboard render() completed successfully');

      // Load initial country
      this.onCountrySelected(defaultCountry, getCountryNameByCode(defaultCountry) || defaultCountry);
      console.log('Initial country loaded');
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

    // Fit map to country
    this.ctx.map?.fitCountry(code);
    this.ctx.map?.highlightCountry(code);

    // Load and display country brief content
    this.loadCountryContent(code, name);
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

    // Simulate loading country data (in real app, this would fetch from API)
    setTimeout(() => {
      this.renderCountryPanels(code, name, panelsContainer);
    }, 500);
  }

  private renderCountryPanels(code: string, name: string, container: HTMLElement): void {
    const flag = this.getFlagEmoji(code);
    
    // Create basic country information panel
    const panels = [
      {
        title: 'Country Overview',
        content: `
          <div style="padding: 12px; color: #e5e5e5; font-size: 13px;">
            <div style="margin-bottom: 12px;">
              <div style="color: #999; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Country</div>
              <div style="font-size: 16px; font-weight: 600;">${flag} ${name}</div>
            </div>
            <div style="margin-bottom: 12px;">
              <div style="color: #999; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Code</div>
              <div style="font-family: monospace; font-size: 14px;">${code}</div>
            </div>
            <div style="padding: 8px; background: #1a1a1a; border-radius: 4px; border-left: 2px solid #4ade80; color: #4ade80; font-size: 12px;">
              Intelligence panels and data will load here
            </div>
          </div>
        `
      },
      {
        title: 'Country Instability Index',
        content: `
          <div style="padding: 12px; color: #e5e5e5; font-size: 13px;">
            <div style="color: #999; margin-bottom: 8px;">Loading CII score...</div>
          </div>
        `
      },
      {
        title: 'Strategic Risk',
        content: `
          <div style="padding: 12px; color: #e5e5e5; font-size: 13px;">
            <div style="color: #999; margin-bottom: 8px;">Loading risk assessment...</div>
          </div>
        `
      },
      {
        title: 'Live News',
        content: `
          <div style="padding: 12px; color: #e5e5e5; font-size: 13px;">
            <div style="color: #999; margin-bottom: 8px;">Loading news feed...</div>
          </div>
        `
      },
      {
        title: 'Economic Indicators',
        content: `
          <div style="padding: 12px; color: #e5e5e5; font-size: 13px;">
            <div style="color: #999; margin-bottom: 8px;">Loading economic data...</div>
          </div>
        `
      },
      {
        title: 'Infrastructure',
        content: `
          <div style="padding: 12px; color: #e5e5e5; font-size: 13px;">
            <div style="color: #999; margin-bottom: 8px;">Loading infrastructure data...</div>
          </div>
        `
      },
      {
        title: 'Natural Events & Disasters',
        content: `
          <div style="padding: 12px; color: #e5e5e5; font-size: 13px;">
            <div style="color: #999; margin-bottom: 8px;">Loading disaster alerts...</div>
          </div>
        `
      },
      {
        title: 'Military Activity',
        content: `
          <div style="padding: 12px; color: #e5e5e5; font-size: 13px;">
            <div style="color: #999; margin-bottom: 8px;">Loading military data...</div>
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
      `;
      
      const header = document.createElement('div');
      header.style.cssText = `
        padding: 12px;
        background: #0f5040;
        border-bottom: 1px solid #2a2a2a;
        color: #4ade80;
        font-weight: 600;
        font-size: 13px;
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
