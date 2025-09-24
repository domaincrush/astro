import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface WorldCity {
  country: string;
  name: string;
  latitude: number;
  longitude: number;
  timezone: string;
  display: string;
}

class WorldCitiesLoader {
  private static cities: WorldCity[] = [];
  private static loaded = false;

  static async loadCitiesDatabase(): Promise<void> {
    if (this.loaded) return;

    try {
      const csvPath = path.join(__dirname, '../attached_assets/world_cities_db_1754765103364.csv');
      
      if (!fs.existsSync(csvPath)) {
        console.log('[WorldCities] CSV file not found, using fallback cities only');
        this.loaded = true;
        return;
      }

      const csvContent = fs.readFileSync(csvPath, 'utf-8');
      const lines = csvContent.split('\n').slice(1); // Skip header if present
      
      let processedCount = 0;
      
      for (const line of lines) {
        if (line.trim() === '') continue;
        
        try {
          // Parse CSV line (handle quoted values)
          const parts = this.parseCSVLine(line);
          
          if (parts.length >= 5) {
            const [country, name, latStr, lonStr, timezone] = parts;
            const latitude = parseFloat(latStr);
            const longitude = parseFloat(lonStr);
            
            // Validate coordinates
            if (!isNaN(latitude) && !isNaN(longitude) && 
                latitude >= -90 && latitude <= 90 && 
                longitude >= -180 && longitude <= 180) {
              
              this.cities.push({
                country: country.trim(),
                name: name.trim(),
                latitude,
                longitude,
                timezone: timezone.trim(),
                display: `${name.trim()}, ${country.trim()}`
              });
              
              processedCount++;
            }
          }
        } catch (error) {
          // Skip malformed lines
          continue;
        }
      }
      
      console.log(`[WorldCities] Loaded ${processedCount} cities from global database`);
      this.loaded = true;
      
    } catch (error) {
      console.error('[WorldCities] Error loading cities database:', error);
      this.loaded = true; // Mark as loaded to prevent retry loops
    }
  }

  private static parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current); // Add the last part
    return result;
  }

  static searchCities(query: string, limit: number = 10): WorldCity[] {
    if (!this.loaded) {
      console.log('[WorldCities] Database not loaded, returning empty results');
      return [];
    }

    const searchTerm = query.toLowerCase().trim();
    if (searchTerm.length < 2) return [];

    const results: WorldCity[] = [];
    const exactMatches: WorldCity[] = [];
    const startsWith: WorldCity[] = [];
    const contains: WorldCity[] = [];

    for (const city of this.cities) {
      const cityName = city.name.toLowerCase();
      const countryName = city.country.toLowerCase();
      const display = city.display.toLowerCase();

      // Exact match (highest priority)
      if (cityName === searchTerm) {
        exactMatches.push(city);
      }
      // Starts with query (high priority)
      else if (cityName.startsWith(searchTerm) || display.startsWith(searchTerm)) {
        startsWith.push(city);
      }
      // Contains query (lower priority)
      else if (cityName.includes(searchTerm) || countryName.includes(searchTerm) || display.includes(searchTerm)) {
        contains.push(city);
      }

      // Stop early if we have enough results
      if (exactMatches.length + startsWith.length + contains.length >= limit * 3) {
        break;
      }
    }

    // Combine results in priority order
    results.push(...exactMatches.slice(0, Math.ceil(limit / 3)));
    results.push(...startsWith.slice(0, Math.ceil(limit * 2 / 3)));
    results.push(...contains.slice(0, limit - results.length));

    return results.slice(0, limit);
  }

  static getCitiesCount(): number {
    return this.cities.length;
  }

  static isLoaded(): boolean {
    return this.loaded;
  }
}

export { WorldCitiesLoader, type WorldCity };