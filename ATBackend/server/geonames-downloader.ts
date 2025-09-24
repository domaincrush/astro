// Download authentic city data from GeoNames - the official geographical database
import https from 'https';
import fs from 'fs';
import path from 'path';
import yauzl from 'yauzl';
import csv from 'csv-parser';

interface GeoNamesCity {
  geonameid: string;
  name: string;
  asciiname: string;
  alternatenames: string;
  latitude: string;
  longitude: string;
  feature_class: string;
  feature_code: string;
  country_code: string;
  cc2: string;
  admin1_code: string;
  admin2_code: string;
  admin3_code: string;
  admin4_code: string;
  population: string;
  elevation: string;
  dem: string;
  timezone: string;
  modification_date: string;
}

interface AuthenticCity {
  name: string;
  country: string;
  state?: string;
  latitude: number;
  longitude: number;
  timezone: string;
  population: number;
  display: string;
  source: 'geonames';
}

export class GeoNamesDownloader {
  private static readonly CITIES_URL = 'https://download.geonames.org/export/dump/cities15000.zip';
  private static readonly COUNTRY_INFO_URL = 'https://download.geonames.org/export/dump/countryInfo.txt';
  private static readonly ADMIN1_URL = 'https://download.geonames.org/export/dump/admin1CodesASCII.txt';
  
  private static countryNames: Map<string, string> = new Map();
  private static stateNames: Map<string, string> = new Map();

  // Download and extract GeoNames cities data
  static async downloadCitiesDatabase(): Promise<AuthenticCity[]> {
    console.log('Downloading authentic cities data from GeoNames...');
    
    try {
      // Download supporting data first
      await this.downloadCountryInfo();
      await this.downloadStateInfo();
      
      // Download main cities database
      const cities = await this.downloadAndParseCities();
      
      console.log(`Successfully downloaded ${cities.length} authentic cities from GeoNames`);
      return cities;
    } catch (error) {
      console.error('Failed to download GeoNames data:', error);
      throw error;
    }
  }

  // Download country code mappings
  private static async downloadCountryInfo(): Promise<void> {
    return new Promise((resolve, reject) => {
      const filePath = path.join(__dirname, 'temp_country_info.txt');
      const file = fs.createWriteStream(filePath);
      
      https.get(this.COUNTRY_INFO_URL, (response) => {
        response.pipe(file);
        
        file.on('finish', () => {
          file.close();
          this.parseCountryInfo(filePath).then(() => {
            fs.unlinkSync(filePath); // Clean up temp file
            resolve();
          }).catch(reject);
        });
      }).on('error', reject);
    });
  }

  // Parse country information
  private static async parseCountryInfo(filePath: string): Promise<void> {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    for (const line of lines) {
      if (line.startsWith('#') || !line.trim()) continue;
      
      const parts = line.split('\t');
      if (parts.length >= 5) {
        const countryCode = parts[0];
        const countryName = parts[4];
        this.countryNames.set(countryCode, countryName);
      }
    }
  }

  // Download state/admin1 code mappings
  private static async downloadStateInfo(): Promise<void> {
    return new Promise((resolve, reject) => {
      const filePath = path.join(__dirname, 'temp_admin1.txt');
      const file = fs.createWriteStream(filePath);
      
      https.get(this.ADMIN1_URL, (response) => {
        response.pipe(file);
        
        file.on('finish', () => {
          file.close();
          this.parseStateInfo(filePath).then(() => {
            fs.unlinkSync(filePath); // Clean up temp file
            resolve();
          }).catch(reject);
        });
      }).on('error', reject);
    });
  }

  // Parse state/admin1 information
  private static async parseStateInfo(filePath: string): Promise<void> {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    for (const line of lines) {
      if (!line.trim()) continue;
      
      const parts = line.split('\t');
      if (parts.length >= 2) {
        const adminCode = parts[0];
        const adminName = parts[1];
        this.stateNames.set(adminCode, adminName);
      }
    }
  }

  // Download and parse main cities database
  private static async downloadAndParseCities(): Promise<AuthenticCity[]> {
    return new Promise((resolve, reject) => {
      const zipPath = path.join(__dirname, 'temp_cities.zip');
      const file = fs.createWriteStream(zipPath);
      
      https.get(this.CITIES_URL, (response) => {
        response.pipe(file);
        
        file.on('finish', () => {
          file.close();
          this.extractAndParseCities(zipPath).then((cities) => {
            fs.unlinkSync(zipPath); // Clean up temp file
            resolve(cities);
          }).catch(reject);
        });
      }).on('error', reject);
    });
  }

  // Extract ZIP and parse cities data
  private static async extractAndParseCities(zipPath: string): Promise<AuthenticCity[]> {
    return new Promise((resolve, reject) => {
      const cities: AuthenticCity[] = [];
      
      yauzl.open(zipPath, { lazyEntries: true }, (err, zipfile) => {
        if (err) return reject(err);
        
        zipfile.readEntry();
        
        zipfile.on('entry', (entry) => {
          if (entry.fileName.endsWith('.txt')) {
            zipfile.openReadStream(entry, (err, readStream) => {
              if (err) return reject(err);
              
              const chunks: Buffer[] = [];
              readStream.on('data', (chunk) => chunks.push(chunk));
              readStream.on('end', () => {
                const content = Buffer.concat(chunks).toString('utf8');
                const parsedCities = this.parseCitiesContent(content);
                cities.push(...parsedCities);
                resolve(cities);
              });
            });
          } else {
            zipfile.readEntry();
          }
        });
        
        zipfile.on('end', () => {
          if (cities.length === 0) {
            reject(new Error('No cities data found in ZIP file'));
          }
        });
      });
    });
  }

  // Parse cities content from GeoNames format
  private static parseCitiesContent(content: string): AuthenticCity[] {
    const cities: AuthenticCity[] = [];
    const lines = content.split('\n');
    
    for (const line of lines) {
      if (!line.trim()) continue;
      
      const parts = line.split('\t');
      if (parts.length >= 19) {
        try {
          const geoCity: GeoNamesCity = {
            geonameid: parts[0],
            name: parts[1],
            asciiname: parts[2],
            alternatenames: parts[3],
            latitude: parts[4],
            longitude: parts[5],
            feature_class: parts[6],
            feature_code: parts[7],
            country_code: parts[8],
            cc2: parts[9],
            admin1_code: parts[10],
            admin2_code: parts[11],
            admin3_code: parts[12],
            admin4_code: parts[13],
            population: parts[14],
            elevation: parts[15],
            dem: parts[16],
            timezone: parts[17],
            modification_date: parts[18]
          };
          
          const city = this.convertToAuthenticCity(geoCity);
          if (city) {
            cities.push(city);
          }
        } catch (error) {
          // Skip malformed lines
          continue;
        }
      }
    }
    
    return cities;
  }

  // Convert GeoNames format to our format
  private static convertToAuthenticCity(geoCity: GeoNamesCity): AuthenticCity | null {
    const lat = parseFloat(geoCity.latitude);
    const lon = parseFloat(geoCity.longitude);
    const population = parseInt(geoCity.population) || 0;
    
    // Validate coordinates
    if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      return null;
    }
    
    // Filter for significant cities (population > 15000 or important places)
    if (population < 15000 && !['PPL', 'PPLA', 'PPLA2', 'PPLA3', 'PPLA4', 'PPLC'].includes(geoCity.feature_code)) {
      return null;
    }
    
    const countryName = this.countryNames.get(geoCity.country_code) || geoCity.country_code;
    const adminKey = `${geoCity.country_code}.${geoCity.admin1_code}`;
    const stateName = this.stateNames.get(adminKey);
    
    let display = geoCity.name;
    if (stateName) {
      display += `, ${stateName}`;
    }
    display += `, ${countryName}`;
    
    return {
      name: geoCity.name,
      country: countryName,
      state: stateName,
      latitude: lat,
      longitude: lon,
      timezone: geoCity.timezone || 'UTC',
      population: population,
      display: display,
      source: 'geonames'
    };
  }

  // Save processed cities to file
  static async saveCitiesData(cities: AuthenticCity[]): Promise<void> {
    const dataPath = path.join(__dirname, 'authentic-cities-data.json');
    const data = {
      generated: new Date().toISOString(),
      source: 'GeoNames Official Database',
      url: this.CITIES_URL,
      count: cities.length,
      cities: cities
    };

    await fs.promises.writeFile(dataPath, JSON.stringify(data, null, 2));
    console.log(`Saved ${cities.length} authentic cities to ${dataPath}`);
  }

  // Load cached authentic cities data
  static async loadAuthenticCities(): Promise<AuthenticCity[]> {
    try {
      const dataPath = path.join(__dirname, 'authentic-cities-data.json');
      const data = await fs.promises.readFile(dataPath, 'utf8');
      const parsed = JSON.parse(data);
      
      // Check if data is recent (less than 30 days old)
      const generated = new Date(parsed.generated);
      const daysSinceGenerated = (Date.now() - generated.getTime()) / (1000 * 60 * 60 * 24);
      
      if (daysSinceGenerated < 30) {
        console.log(`Loaded ${parsed.count} authentic cities from cache`);
        return parsed.cities;
      } else {
        console.log('Cached data is outdated, downloading fresh data...');
        throw new Error('Cache expired');
      }
    } catch (error) {
      console.log('Downloading fresh authentic cities data from GeoNames...');
      const cities = await this.downloadCitiesDatabase();
      await this.saveCitiesData(cities);
      return cities;
    }
  }

  // Initialize authentic cities database
  static async initializeDatabase(): Promise<AuthenticCity[]> {
    console.log('Initializing authentic cities database from GeoNames...');
    return await this.loadAuthenticCities();
  }
}

// Export for use in the application
export async function getAuthenticCities(): Promise<AuthenticCity[]> {
  return await GeoNamesDownloader.initializeDatabase();
}