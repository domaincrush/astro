import { Request, Response } from 'express';
import { getAuthenticCities } from './geonames-downloader';
import { WorldCitiesLoader, type WorldCity } from './world-cities-loader';

interface LocationData {
  name: string;
  country: string;
  state?: string;
  latitude: number;
  longitude: number;
  timezone: string;
  display: string;
}

// Cache for authentic cities data
let authenticCitiesCache: any[] = [];
let cacheInitialized = false;

// Initialize world cities database on module load
WorldCitiesLoader.loadCitiesDatabase().catch(console.error);

// Fallback cities database for immediate use (reduced since we have comprehensive world database)
const FALLBACK_CITIES = [
  { name: 'Chennai', country: 'India', state: 'Tamil Nadu', latitude: 13.0827, longitude: 80.2707, timezone: 'Asia/Kolkata', display: 'Chennai, Tamil Nadu, India', population: 4646732 },
  { name: 'Mumbai', country: 'India', state: 'Maharashtra', latitude: 19.0760, longitude: 72.8777, timezone: 'Asia/Kolkata', display: 'Mumbai, Maharashtra, India', population: 12442373 },
  { name: 'Delhi', country: 'India', state: 'Delhi', latitude: 28.7041, longitude: 77.1025, timezone: 'Asia/Kolkata', display: 'Delhi, India', population: 16753235 },
  { name: 'New York', country: 'United States', state: 'New York', latitude: 40.7128, longitude: -74.0060, timezone: 'America/New_York', display: 'New York, New York, United States', population: 8175133 },
  { name: 'London', country: 'United Kingdom', state: 'England', latitude: 51.5074, longitude: -0.1278, timezone: 'Europe/London', display: 'London, England, United Kingdom', population: 8982000 },
  { name: 'Tokyo', country: 'Japan', state: 'Tokyo', latitude: 35.6762, longitude: 139.6503, timezone: 'Asia/Tokyo', display: 'Tokyo, Japan', population: 13515271 }
];

export class GeocodingService {
  // Enhanced search using world cities database first, then fallbacks
  static searchLocalDatabase(query: string): LocationData[] {
    const results: LocationData[] = [];
    
    // Primary: Search comprehensive world cities database
    if (WorldCitiesLoader.isLoaded()) {
      const worldCities = WorldCitiesLoader.searchCities(query, 8);
      results.push(...worldCities.map((city: WorldCity) => ({
        name: city.name,
        country: city.country,
        latitude: city.latitude,
        longitude: city.longitude,
        timezone: city.timezone,
        display: city.display
      })));
    }
    
    // Secondary: Search fallback database for any missing results
    if (results.length < 5) {
      const searchTerm = query.toLowerCase();
      const fallbackResults = FALLBACK_CITIES.filter((city: any) => 
        city.name.toLowerCase().includes(searchTerm) ||
        city.display.toLowerCase().includes(searchTerm) ||
        (city.state && city.state.toLowerCase().includes(searchTerm))
      ).slice(0, 5 - results.length);
      
      // Add fallback results that aren't already present
      fallbackResults.forEach(city => {
        const isDuplicate = results.some(r => 
          Math.abs(r.latitude - city.latitude) < 0.01 && 
          Math.abs(r.longitude - city.longitude) < 0.01
        );
        if (!isDuplicate) {
          results.push({
            name: city.name,
            country: city.country,
            state: city.state,
            latitude: city.latitude,
            longitude: city.longitude,
            timezone: city.timezone,
            display: city.display
          });
        }
      });
    }
    
    return results.slice(0, 10);
  }

  // Enhanced geocoding with World Cities Database as primary, Nominatim as secondary
  static async searchMultipleSources(query: string): Promise<LocationData[]> {
    const results: LocationData[] = [];
    
    // Primary: World Cities Database + Fallback Cities
    const localResults = this.searchLocalDatabase(query);
    results.push(...localResults);
    
    // Secondary: OpenStreetMap Nominatim API (only if we need more results)
    if (results.length < 8) {
      try {
        const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&limit=${8 - results.length}&q=${encodeURIComponent(query)}&addressdetails=1&accept-language=en`;
        
        const nominatimResponse = await fetch(nominatimUrl, {
          headers: {
            'User-Agent': 'AstroTick/1.0 (contact@astrotick.com)',
            'Accept': 'application/json',
          }
        });
        
        if (nominatimResponse.ok) {
          const nominatimData = await nominatimResponse.json();
          
          nominatimData.forEach((item: any) => {
            if (item.lat && item.lon && item.display_name) {
              const lat = parseFloat(item.lat);
              const lon = parseFloat(item.lon);
              
              if (lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
                const name = item.address?.city || item.address?.town || item.address?.village || 
                            item.name || item.display_name.split(',')[0];
                
                const isDuplicate = results.some(r => 
                  Math.abs(r.latitude - lat) < 0.01 && Math.abs(r.longitude - lon) < 0.01
                );
                
                if (!isDuplicate) {
                  results.push({
                    name,
                    country: item.address?.country || '',
                    state: item.address?.state || item.address?.province || '',
                    latitude: lat,
                    longitude: lon,
                    timezone: this.getTimezoneFromCoordinates(lat, lon),
                    display: item.display_name
                  });
                }
              }
            }
          });
        }
      } catch (error) {
        console.error('[Nominatim] Secondary geocoding failed:', error);
      }
    }
    
    return results.slice(0, 10);
  }

  // Get timezone from coordinates (simplified mapping)
  static getTimezoneFromCoordinates(lat: number, lon: number): string {
    // India
    if (lat >= 6 && lat <= 37 && lon >= 68 && lon <= 97) {
      return 'Asia/Kolkata';
    }
    // USA
    if (lat >= 25 && lat <= 49 && lon >= -125 && lon <= -66) {
      if (lon >= -125 && lon <= -115) return 'America/Los_Angeles';
      if (lon >= -115 && lon <= -104) return 'America/Denver';
      if (lon >= -104 && lon <= -87) return 'America/Chicago';
      return 'America/New_York';
    }
    // UK
    if (lat >= 50 && lat <= 61 && lon >= -8 && lon <= 2) {
      return 'Europe/London';
    }
    // Europe
    if (lat >= 36 && lat <= 71 && lon >= -10 && lon <= 40) {
      return 'Europe/Paris';
    }
    // Australia
    if (lat >= -44 && lat <= -10 && lon >= 113 && lon <= 154) {
      return 'Australia/Sydney';
    }
    // Japan
    if (lat >= 30 && lat <= 46 && lon >= 129 && lon <= 146) {
      return 'Asia/Tokyo';
    }
    // Default to UTC
    return 'UTC';
  }
}

// API endpoint for location search with enhanced world cities database
export async function searchLocations(req: Request, res: Response) {
  try {
    const { query } = req.query;
    console.log(`[WorldCities] Route handler called with query: "${query}"`);
    const startTime = Date.now();
    
    if (!query || typeof query !== 'string' || query.length < 2) {
      return res.status(400).json({ 
        success: false, 
        error: 'Query parameter is required and must be at least 2 characters' 
      });
    }
    
    // Use enhanced search with world cities database
    console.log(`[WorldCities] Searching ${WorldCitiesLoader.getCitiesCount()} cities for: "${query}"`);
    const results = await GeocodingService.searchMultipleSources(query);
    
    const responseTime = Date.now() - startTime;
    console.log(`[WorldCities] Found ${results.length} results in ${responseTime}ms`);
    
    // Enhanced response with comprehensive metadata
    res.json({
      success: true,
      query: query,
      locations: results.map(location => ({
        name: location.name,
        display: location.display,
        latitude: location.latitude,
        longitude: location.longitude,
        country: location.country,
        state: location.state || '',
        timezone: location.timezone || 'UTC',
        coordinates: `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`
      })),
      metadata: {
        count: results.length,
        responseTime: `${responseTime}ms`,
        worldCitiesLoaded: WorldCitiesLoader.isLoaded(),
        totalCitiesInDatabase: WorldCitiesLoader.getCitiesCount(),
        sources: WorldCitiesLoader.isLoaded() 
          ? ['primary: world_cities_db', 'secondary: nominatim'] 
          : ['primary: fallback_cities', 'secondary: nominatim']
      }
    });
    
  } catch (error) {
    console.error('[WorldCities] Search error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search locations',
      metadata: {
        worldCitiesLoaded: WorldCitiesLoader.isLoaded(),
        totalCitiesInDatabase: WorldCitiesLoader.getCitiesCount()
      }
    });
  }
}