/**
 * Country Dashboard Component
 * Provides a searchable country selector with favorites and map/panel integration
 */

export class CountryDashboard {
  private container: HTMLElement;
  private panelsContainer: HTMLElement | null = null;
  private isMobile: boolean = false;

  constructor(container: HTMLElement, _options: { defaultCountry: string; favoriteCountries: string[] }) {
    this.container = container;
    this.isMobile = window.innerWidth < 768;
  }

  public render(): void {
    // Build the complete HTML structure with mobile responsiveness
    const html = `
      <div style="display: flex; height: 100vh; background: #000; color: #e5e5e5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
        <!-- Header -->
        <div style="position: fixed; top: 0; left: 0; right: 0; height: 56px; background: #0a0a0a; border-bottom: 1px solid #2a2a2a; display: flex; align-items: center; justify-content: space-between; padding: 0 16px; z-index: 100;">
          <div style="font-size: 16px; font-weight: 600;">Country Dashboard</div>
          <input type="text" placeholder="Search countries..." style="flex: 1; margin: 0 16px; padding: 8px 12px; background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 4px; color: #e5e5e5; font-size: 13px;" />
        </div>
        
        <!-- Main Content -->
        <div style="display: flex; margin-top: 56px; flex: 1; width: 100%;">
          <!-- Map Container -->
          <div style="flex: 1; display: flex; flex-direction: column; background: #000;">
            <div style="flex: 1; display: flex; align-items: center; justify-content: center; color: #666; font-size: 14px;">
              Map will be rendered here
            </div>
          </div>
          
          <!-- Panels Container -->
          <div style="flex: 1; overflow-y: auto; padding: 16px; background: #0a0a0a; border-left: 1px solid #2a2a2a;">
            <div style="display: grid; grid-template-columns: 1fr; gap: 12px;">
              <div style="padding: 16px; background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 6px; color: #999; text-align: center; font-size: 13px;">
                Select a country to view intelligence panels
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.container.innerHTML = html;
    this.panelsContainer = this.container.querySelector('[style*="flex: 1; overflow-y: auto"]') as HTMLElement;
  }

  public setCountryChangeHandler(_handler: (code: string, name: string) => void): void {
    // Handler will be used for country selection
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
