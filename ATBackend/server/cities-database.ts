
/**
 * Enhanced Cities Database with Global Coordinate Support
 * Provides accurate latitude, longitude, and timezone data for worldwide locations
 */

export interface CityData {
  id: string;
  name: string;
  country: string;
  state?: string;
  latitude: number;
  longitude: number;
  timezone: string;
  population?: number;
  elevation?: number;
  region: string;
  aliases?: string[];
}

export class EnhancedCitiesDatabase {
  private cities: Map<string, CityData> = new Map();
  
  constructor() {
    this.initializeCitiesDatabase();
  }

  private initializeCitiesDatabase() {
    const citiesData: CityData[] = [
      // India - Major Cities
      {
        id: 'chennai_in',
        name: 'Chennai',
        country: 'India',
        state: 'Tamil Nadu',
        latitude: 13.0827,
        longitude: 80.2707,
        timezone: 'Asia/Kolkata',
        population: 7088000,
        elevation: 6,
        region: 'South Asia',
        aliases: ['Madras']
      },
      {
        id: 'mumbai_in',
        name: 'Mumbai',
        country: 'India',
        state: 'Maharashtra',
        latitude: 19.0760,
        longitude: 72.8777,
        timezone: 'Asia/Kolkata',
        population: 12478447,
        elevation: 14,
        region: 'South Asia',
        aliases: ['Bombay']
      },
      {
        id: 'delhi_in',
        name: 'New Delhi',
        country: 'India',
        state: 'Delhi',
        latitude: 28.6139,
        longitude: 77.2090,
        timezone: 'Asia/Kolkata',
        population: 11034555,
        elevation: 216,
        region: 'South Asia',
        aliases: ['Delhi']
      },
      {
        id: 'bangalore_in',
        name: 'Bangalore',
        country: 'India',
        state: 'Karnataka',
        latitude: 12.9716,
        longitude: 77.5946,
        timezone: 'Asia/Kolkata',
        population: 8443675,
        elevation: 920,
        region: 'South Asia',
        aliases: ['Bengaluru']
      },
      {
        id: 'hyderabad_in',
        name: 'Hyderabad',
        country: 'India',
        state: 'Telangana',
        latitude: 17.3850,
        longitude: 78.4867,
        timezone: 'Asia/Kolkata',
        population: 6993262,
        elevation: 542,
        region: 'South Asia'
      },
      {
        id: 'kolkata_in',
        name: 'Kolkata',
        country: 'India',
        state: 'West Bengal',
        latitude: 22.5726,
        longitude: 88.3639,
        timezone: 'Asia/Kolkata',
        population: 4496694,
        elevation: 17,
        region: 'South Asia',
        aliases: ['Calcutta']
      },
      {
        id: 'pune_in',
        name: 'Pune',
        country: 'India',
        state: 'Maharashtra',
        latitude: 18.5204,
        longitude: 73.8567,
        timezone: 'Asia/Kolkata',
        population: 3124458,
        elevation: 560,
        region: 'South Asia'
      },
      {
        id: 'ahmedabad_in',
        name: 'Ahmedabad',
        country: 'India',
        state: 'Gujarat',
        latitude: 23.0225,
        longitude: 72.5714,
        timezone: 'Asia/Kolkata',
        population: 5633927,
        elevation: 53,
        region: 'South Asia'
      },
      {
        id: 'jaipur_in',
        name: 'Jaipur',
        country: 'India',
        state: 'Rajasthan',
        latitude: 26.9124,
        longitude: 75.7873,
        timezone: 'Asia/Kolkata',
        population: 3046163,
        elevation: 431,
        region: 'South Asia'
      },
      {
        id: 'surat_in',
        name: 'Surat',
        country: 'India',
        state: 'Gujarat',
        latitude: 21.1702,
        longitude: 72.8311,
        timezone: 'Asia/Kolkata',
        population: 4466826,
        elevation: 13,
        region: 'South Asia'
      },

      // USA - Major Cities
      {
        id: 'new_york_us',
        name: 'New York',
        country: 'United States',
        state: 'New York',
        latitude: 40.7128,
        longitude: -74.0060,
        timezone: 'America/New_York',
        population: 8336817,
        elevation: 10,
        region: 'North America',
        aliases: ['NYC', 'New York City']
      },
      {
        id: 'los_angeles_us',
        name: 'Los Angeles',
        country: 'United States',
        state: 'California',
        latitude: 34.0522,
        longitude: -118.2437,
        timezone: 'America/Los_Angeles',
        population: 3898747,
        elevation: 71,
        region: 'North America',
        aliases: ['LA']
      },
      {
        id: 'chicago_us',
        name: 'Chicago',
        country: 'United States',
        state: 'Illinois',
        latitude: 41.8781,
        longitude: -87.6298,
        timezone: 'America/Chicago',
        population: 2693976,
        elevation: 181,
        region: 'North America'
      },
      {
        id: 'houston_us',
        name: 'Houston',
        country: 'United States',
        state: 'Texas',
        latitude: 29.7604,
        longitude: -95.3698,
        timezone: 'America/Chicago',
        population: 2320268,
        elevation: 13,
        region: 'North America'
      },
      {
        id: 'phoenix_us',
        name: 'Phoenix',
        country: 'United States',
        state: 'Arizona',
        latitude: 33.4484,
        longitude: -112.0740,
        timezone: 'America/Phoenix',
        population: 1680992,
        elevation: 331,
        region: 'North America'
      },

      // UK
      {
        id: 'london_uk',
        name: 'London',
        country: 'United Kingdom',
        latitude: 51.5074,
        longitude: -0.1278,
        timezone: 'Europe/London',
        population: 9648110,
        elevation: 11,
        region: 'Europe'
      },
      {
        id: 'manchester_uk',
        name: 'Manchester',
        country: 'United Kingdom',
        latitude: 53.4808,
        longitude: -2.2426,
        timezone: 'Europe/London',
        population: 547899,
        elevation: 38,
        region: 'Europe'
      },

      // Canada
      {
        id: 'toronto_ca',
        name: 'Toronto',
        country: 'Canada',
        state: 'Ontario',
        latitude: 43.6532,
        longitude: -79.3832,
        timezone: 'America/Toronto',
        population: 2930000,
        elevation: 76,
        region: 'North America'
      },
      {
        id: 'vancouver_ca',
        name: 'Vancouver',
        country: 'Canada',
        state: 'British Columbia',
        latitude: 49.2827,
        longitude: -123.1207,
        timezone: 'America/Vancouver',
        population: 675218,
        elevation: 70,
        region: 'North America'
      },

      // Australia
      {
        id: 'sydney_au',
        name: 'Sydney',
        country: 'Australia',
        state: 'New South Wales',
        latitude: -33.8688,
        longitude: 151.2093,
        timezone: 'Australia/Sydney',
        population: 5312163,
        elevation: 3,
        region: 'Oceania'
      },
      {
        id: 'melbourne_au',
        name: 'Melbourne',
        country: 'Australia',
        state: 'Victoria',
        latitude: -37.8136,
        longitude: 144.9631,
        timezone: 'Australia/Melbourne',
        population: 5078193,
        elevation: 31,
        region: 'Oceania'
      },

      // Germany
      {
        id: 'berlin_de',
        name: 'Berlin',
        country: 'Germany',
        latitude: 52.5200,
        longitude: 13.4050,
        timezone: 'Europe/Berlin',
        population: 3669491,
        elevation: 34,
        region: 'Europe'
      },
      {
        id: 'munich_de',
        name: 'Munich',
        country: 'Germany',
        latitude: 48.1351,
        longitude: 11.5820,
        timezone: 'Europe/Berlin',
        population: 1484226,
        elevation: 519,
        region: 'Europe',
        aliases: ['München']
      },

      // France
      {
        id: 'paris_fr',
        name: 'Paris',
        country: 'France',
        latitude: 48.8566,
        longitude: 2.3522,
        timezone: 'Europe/Paris',
        population: 2165423,
        elevation: 35,
        region: 'Europe'
      },

      // Japan
      {
        id: 'tokyo_jp',
        name: 'Tokyo',
        country: 'Japan',
        latitude: 35.6762,
        longitude: 139.6503,
        timezone: 'Asia/Tokyo',
        population: 37435191,
        elevation: 40,
        region: 'East Asia'
      },
      {
        id: 'osaka_jp',
        name: 'Osaka',
        country: 'Japan',
        latitude: 34.6937,
        longitude: 135.5023,
        timezone: 'Asia/Tokyo',
        population: 2691185,
        elevation: 5,
        region: 'East Asia'
      },

      // China
      {
        id: 'beijing_cn',
        name: 'Beijing',
        country: 'China',
        latitude: 39.9042,
        longitude: 116.4074,
        timezone: 'Asia/Shanghai',
        population: 21540000,
        elevation: 43,
        region: 'East Asia'
      },
      {
        id: 'shanghai_cn',
        name: 'Shanghai',
        country: 'China',
        latitude: 31.2304,
        longitude: 121.4737,
        timezone: 'Asia/Shanghai',
        population: 24870895,
        elevation: 4,
        region: 'East Asia'
      },

      // Singapore
      {
        id: 'singapore_sg',
        name: 'Singapore',
        country: 'Singapore',
        latitude: 1.3521,
        longitude: 103.8198,
        timezone: 'Asia/Singapore',
        population: 5685807,
        elevation: 15,
        region: 'Southeast Asia'
      },

      // UAE
      {
        id: 'dubai_ae',
        name: 'Dubai',
        country: 'United Arab Emirates',
        latitude: 25.2048,
        longitude: 55.2708,
        timezone: 'Asia/Dubai',
        population: 3331420,
        elevation: 16,
        region: 'Middle East'
      },

      // Brazil
      {
        id: 'sao_paulo_br',
        name: 'São Paulo',
        country: 'Brazil',
        latitude: -23.5505,
        longitude: -46.6333,
        timezone: 'America/Sao_Paulo',
        population: 12325232,
        elevation: 760,
        region: 'South America'
      },

      // Additional Indian Cities for comprehensive coverage
      {
        id: 'lucknow_in',
        name: 'Lucknow',
        country: 'India',
        state: 'Uttar Pradesh',
        latitude: 26.8467,
        longitude: 80.9462,
        timezone: 'Asia/Kolkata',
        population: 2901474,
        elevation: 123,
        region: 'South Asia'
      },
      {
        id: 'kanpur_in',
        name: 'Kanpur',
        country: 'India',
        state: 'Uttar Pradesh',
        latitude: 26.4499,
        longitude: 80.3319,
        timezone: 'Asia/Kolkata',
        population: 2767031,
        elevation: 126,
        region: 'South Asia'
      },
      {
        id: 'nagpur_in',
        name: 'Nagpur',
        country: 'India',
        state: 'Maharashtra',
        latitude: 21.1458,
        longitude: 79.0882,
        timezone: 'Asia/Kolkata',
        population: 2405421,
        elevation: 310,
        region: 'South Asia'
      },
      {
        id: 'indore_in',
        name: 'Indore',
        country: 'India',
        state: 'Madhya Pradesh',
        latitude: 22.7196,
        longitude: 75.8577,
        timezone: 'Asia/Kolkata',
        population: 1994397,
        elevation: 553,
        region: 'South Asia'
      },
      {
        id: 'thane_in',
        name: 'Thane',
        country: 'India',
        state: 'Maharashtra',
        latitude: 19.2183,
        longitude: 72.9781,
        timezone: 'Asia/Kolkata',
        population: 1890000,
        elevation: 7,
        region: 'South Asia'
      },
      {
        id: 'bhopal_in',
        name: 'Bhopal',
        country: 'India',
        state: 'Madhya Pradesh',
        latitude: 23.2599,
        longitude: 77.4126,
        timezone: 'Asia/Kolkata',
        population: 1883381,
        elevation: 500,
        region: 'South Asia'
      },
      {
        id: 'visakhapatnam_in',
        name: 'Visakhapatnam',
        country: 'India',
        state: 'Andhra Pradesh',
        latitude: 17.6868,
        longitude: 83.2185,
        timezone: 'Asia/Kolkata',
        population: 1730320,
        elevation: 45,
        region: 'South Asia',
        aliases: ['Vizag']
      },
      {
        id: 'patna_in',
        name: 'Patna',
        country: 'India',
        state: 'Bihar',
        latitude: 25.5941,
        longitude: 85.1376,
        timezone: 'Asia/Kolkata',
        population: 1684222,
        elevation: 53,
        region: 'South Asia'
      }
    ];

    // Initialize the cities map
    citiesData.forEach(city => {
      this.cities.set(city.id, city);
      
      // Add entries for city names and aliases
      this.cities.set(city.name.toLowerCase(), city);
      if (city.aliases) {
        city.aliases.forEach(alias => {
          this.cities.set(alias.toLowerCase(), city);
        });
      }
    });
  }

  /**
   * Find city by name (case-insensitive)
   */
  findCityByName(name: string): CityData | null {
    const normalized = name.toLowerCase().trim();
    return this.cities.get(normalized) || null;
  }

  /**
   * Find cities by country
   */
  findCitiesByCountry(country: string): CityData[] {
    const results: CityData[] = [];
    const normalizedCountry = country.toLowerCase();
    
    for (const city of this.cities.values()) {
      if (city.country.toLowerCase() === normalizedCountry) {
        // Avoid duplicates
        if (!results.find(c => c.id === city.id)) {
          results.push(city);
        }
      }
    }
    
    return results.sort((a, b) => (b.population || 0) - (a.population || 0));
  }

  /**
   * Find cities near given coordinates
   */
  findCitiesNearCoordinates(latitude: number, longitude: number, radiusKm: number = 100): CityData[] {
    const results: CityData[] = [];
    
    for (const city of this.cities.values()) {
      const distance = this.calculateDistance(latitude, longitude, city.latitude, city.longitude);
      if (distance <= radiusKm) {
        // Avoid duplicates
        if (!results.find(c => c.id === city.id)) {
          results.push({ ...city, distance });
        }
      }
    }
    
    return results.sort((a, b) => (a.distance || 0) - (b.distance || 0));
  }

  /**
   * Search cities with fuzzy matching
   */
  searchCities(query: string, limit: number = 10): CityData[] {
    const normalizedQuery = query.toLowerCase().trim();
    const results: CityData[] = [];
    
    for (const city of this.cities.values()) {
      let score = 0;
      
      // Exact match gets highest score
      if (city.name.toLowerCase() === normalizedQuery) {
        score = 100;
      }
      // Starts with query
      else if (city.name.toLowerCase().startsWith(normalizedQuery)) {
        score = 80;
      }
      // Contains query
      else if (city.name.toLowerCase().includes(normalizedQuery)) {
        score = 60;
      }
      // Check aliases
      else if (city.aliases?.some(alias => 
        alias.toLowerCase().includes(normalizedQuery))) {
        score = 50;
      }
      // Check state/country
      else if (city.state?.toLowerCase().includes(normalizedQuery) ||
               city.country.toLowerCase().includes(normalizedQuery)) {
        score = 30;
      }
      
      if (score > 0) {
        // Avoid duplicates
        if (!results.find(c => c.id === city.id)) {
          results.push({ ...city, searchScore: score });
        }
      }
    }
    
    return results
      .sort((a, b) => (b.searchScore || 0) - (a.searchScore || 0))
      .slice(0, limit);
  }

  /**
   * Get all cities for a region
   */
  getCitiesByRegion(region: string): CityData[] {
    const results: CityData[] = [];
    const normalizedRegion = region.toLowerCase();
    
    for (const city of this.cities.values()) {
      if (city.region.toLowerCase() === normalizedRegion) {
        // Avoid duplicates
        if (!results.find(c => c.id === city.id)) {
          results.push(city);
        }
      }
    }
    
    return results.sort((a, b) => (b.population || 0) - (a.population || 0));
  }

  /**
   * Get coordinate data for Panchang calculation
   */
  getCoordinateData(cityNameOrId: string): { latitude: number; longitude: number; timezone: string } | null {
    const city = this.findCityByName(cityNameOrId) || this.cities.get(cityNameOrId);
    
    if (city) {
      return {
        latitude: city.latitude,
        longitude: city.longitude,
        timezone: city.timezone
      };
    }
    
    return null;
  }

  /**
   * Calculate distance between two coordinates using Haversine formula
   */
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Get timezone for coordinates (fallback method)
   */
  getTimezoneForCoordinates(latitude: number, longitude: number): string {
    // Find nearest city to get timezone
    const nearestCities = this.findCitiesNearCoordinates(latitude, longitude, 500);
    
    if (nearestCities.length > 0) {
      return nearestCities[0].timezone;
    }
    
    // Rough timezone estimation based on longitude
    const timezoneOffset = Math.round(longitude / 15);
    const utcOffset = Math.max(-12, Math.min(12, timezoneOffset));
    
    // Map common timezone offsets
    const timezoneMap: { [key: number]: string } = {};
    timezoneMap[5.5] = 'Asia/Kolkata';
    timezoneMap[8] = 'Asia/Shanghai';
    timezoneMap[9] = 'Asia/Tokyo';
    timezoneMap[0] = 'Europe/London';
    timezoneMap[1] = 'Europe/Paris';
    timezoneMap[-5] = 'America/New_York';
    timezoneMap[-8] = 'America/Los_Angeles';
    timezoneMap[10] = 'Australia/Sydney';
    
    return timezoneMap[utcOffset] || 'UTC';
  }

  /**
   * Get all available cities (without duplicates)
   */
  getAllCities(): CityData[] {
    const uniqueCities = new Map<string, CityData>();
    
    for (const city of this.cities.values()) {
      if (!uniqueCities.has(city.id)) {
        uniqueCities.set(city.id, city);
      }
    }
    
    return Array.from(uniqueCities.values())
      .sort((a, b) => (b.population || 0) - (a.population || 0));
  }

  /**
   * Validate coordinates
   */
  isValidCoordinates(latitude: number, longitude: number): boolean {
    return latitude >= -90 && latitude <= 90 && 
           longitude >= -180 && longitude <= 180;
  }
}

// Singleton instance
export const citiesDatabase = new EnhancedCitiesDatabase();

// Helper function for easy access
export function getCityCoordinates(cityName: string) {
  return citiesDatabase.getCoordinateData(cityName);
}

export function searchCities(query: string, limit?: number) {
  return citiesDatabase.searchCities(query, limit);
}

export function findCitiesByCountry(country: string) {
  return citiesDatabase.findCitiesByCountry(country);
}
