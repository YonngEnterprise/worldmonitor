# Country Dashboard Feature

## Overview

The Country Dashboard is a new feature that provides a **country-specific intelligence dashboard** for the World Monitor application. It allows users to focus on a single country with:

- **Country-scoped map** showing the selected country and nearby infrastructure
- **Searchable country selector** with favorites support
- **Intelligence panels** displaying country-specific data:
  - Country Instability Index (CII)
  - Strategic Risk Overview
  - Live News (country-filtered)
  - Economic indicators
  - Military activity
  - Infrastructure (bases, ports, cables, pipelines)
  - Natural events & disaster risk
  - And more...

## Architecture

### Components

#### `CountryDashboard` (`src/components/CountryDashboard.ts`)
Main UI component that manages:
- Country selector with searchable dropdown
- Favorite countries list
- Country change callbacks
- Map integration

**Key Methods:**
- `render()` - Renders the dashboard UI
- `setCountryChangeHandler()` - Sets callback for country selection
- `setMap()` - Connects to the map container
- `getCurrentCountry()` - Returns current country code and name

#### `CountryDashboardPage` (`src/pages/country-dashboard.ts`)
Page controller that orchestrates:
- Dashboard initialization
- Country brief loading via `CountryIntelManager`
- Map fitting and highlighting
- URL state management

### Styling

**File:** `src/styles/country-dashboard.css`

Provides:
- Header layout with country selector
- Searchable dropdown styling
- Responsive grid layout for panels
- Dark theme support
- Scrollbar customization

### Integration Points

1. **Country Selection** - Uses `getCountryNameByCode()` and `getAllCountryCodes()` from `country-geometry` service
2. **Map Operations** - Calls `map.fitCountry()` and `map.highlightCountry()` to zoom and highlight
3. **Intelligence Data** - Uses `CountryIntelManager.openCountryBriefByCode()` to load country data
4. **URL State** - Updates URL with `?country=CODE` parameter for deep linking

## Usage

### Basic Setup

```typescript
import { CountryDashboard } from '@/components/CountryDashboard';
import { CountryDashboardPage } from '@/pages/country-dashboard';

// Create dashboard
const container = document.getElementById('dashboard-container');
const dashboard = new CountryDashboard(container, {
  defaultCountry: 'ID', // Indonesia
  favoriteCountries: ['US', 'CN', 'RU']
});

// Render UI
dashboard.render();

// Set country change handler
dashboard.setCountryChangeHandler((code, name) => {
  console.log(`Selected: ${name} (${code})`);
});

// Connect map
dashboard.setMap(mapContainer);
```

### URL Deep Linking

Users can access a specific country dashboard via:
```
https://worldmonitor.app/dashboard?country=ID
```

### Favorites

Favorites are persisted in localStorage under the key `country-dashboard-favorites`.

## Default Country

**Indonesia (ID)** is set as the default country for the initial demo mockup.

## Features

### Country Selector
- **Searchable dropdown** - Filter countries by name or code
- **Favorites list** - Quick access to frequently viewed countries
- **Flag emojis** - Visual country identification
- **Keyboard navigation** - Full accessibility support

### Map Integration
- **Country-scoped zoom** - Map automatically fits to country bounds
- **Infrastructure highlighting** - Shows nearby bases, ports, cables, pipelines
- **Dynamic layer filtering** - Displays relevant data layers for the country

### Intelligence Panels
The dashboard displays all available intelligence panels with emphasis on:
- Infrastructure and economic indicators
- Natural events and disaster risk
- Military activity
- News and signals
- Country facts and timeline

## Responsive Design

- **Desktop (1024px+)** - Full 3-column grid layout
- **Tablet (768-1024px)** - 2-column layout with adjusted map height
- **Mobile (<768px)** - Single column layout with stacked header

## Performance Considerations

1. **Lazy loading** - Panels load data only when visible
2. **Favorites caching** - Stored in localStorage for instant access
3. **Country list indexing** - Pre-built for fast searching
4. **Map optimization** - Reuses existing map infrastructure

## Future Enhancements

- [ ] Custom panel layouts per country
- [ ] Country comparison view
- [ ] Historical data trends
- [ ] Alert notifications for country-specific events
- [ ] Export country intelligence reports
- [ ] Custom thresholds and risk scoring

## Testing

To test the country dashboard:

1. Navigate to `http://localhost:5173/?dashboard=country`
2. Or directly to `http://localhost:5173/?dashboard=country&country=ID`
3. Use the country selector to switch between countries
4. Add countries to favorites by clicking the star icon
5. Verify map zooms to country bounds
6. Check that intelligence panels load country-specific data

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Accessibility

- Full keyboard navigation
- ARIA labels on interactive elements
- Semantic HTML structure
- High contrast dark theme
- Focus indicators on all interactive elements
