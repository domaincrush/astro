import { Request, Response } from "express";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface DrikBirthData {
  name: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  latitude: number;
  longitude: number;
  timezone?: string;
}

export interface DrikPlanet {
  name: string;
  longitude: number;
  latitude: number;
  distance: number;
  speed: number;
  rashi: string;
  rashi_num: number;
  degree_in_rashi: number;
  retrograde: boolean;
}

export interface DrikPanchanga {
  tithi: {
    number: number;
    name: string;
    end_time?: number[];
  };
  nakshatra: {
    number: number;
    name: string;
    end_time?: number[];
  };
  yoga: {
    number: number;
    name: string;
    end_time?: number[];
  };
  karana: {
    number: number;
    name: string;
  };
  vara: {
    number: number;
    name: string;
  };
  sunrise?: number[];
  sunset?: number[];
}

export interface DrikBirthChartResult {
  success: boolean;
  calculation_engine: string;
  name: string;
  birth_details: {
    date: string;
    time: string;
    location: {
      latitude: number;
      longitude: number;
      timezone: string;
    };
  };
  julian_day: number;
  ayanamsa: number;
  planets: DrikPlanet[];
  ascendant: {
    longitude: number;
    rashi: string;
    rashi_num: number;
    degree_in_rashi: number;
  };
  houses: Array<{
    house_num: number;
    cusp_longitude: number;
    rashi: string;
    rashi_num: number;
    degree_in_rashi: number;
  }>;
  panchanga: DrikPanchanga;
  planet_nakshatras: Array<{
    planet: string;
    nakshatra: string;
    nakshatra_num: number;
    pada: number;
    longitude: number;
  }>;
  dasha: {
    starting_lord: string;
    moon_nakshatra: string;
    periods: Array<{
      lord: string;
      start_date: string;
      end_date: string;
      duration_years: number;
    }>;
  };
  vedic_attributes: {
    nakshatra: string;
    pada: number;
    gana: string;
    nadi: string;
    yoni: string;
    varna: string;
    tatva: string;
    calculation_method: string;
  };
  error?: string;
}

export class DrikPanchangaInterface {
  private static readonly PYTHON_ENGINE_PATH = path.join(__dirname, 'drik-birth-chart-engine.py');

  static async calculateBirthChart(birthData: DrikBirthData): Promise<DrikBirthChartResult> {
    return new Promise((resolve, reject) => {
      try {
        // Prepare birth data for Python script
        const inputData = JSON.stringify({
          name: birthData.name,
          date: birthData.date,
          time: birthData.time,
          latitude: birthData.latitude,
          longitude: birthData.longitude,
          timezone: birthData.timezone || 'Asia/Kolkata'
        });

        // Spawn Python process
        const pythonProcess = spawn('python3', [this.PYTHON_ENGINE_PATH, inputData]);

        let stdout = '';
        let stderr = '';

        pythonProcess.stdout.on('data', (data) => {
          stdout += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
          stderr += data.toString();
        });

        pythonProcess.on('close', (code) => {
          if (code !== 0) {
            console.error('Python process error:', stderr);
            resolve({
              success: false,
              calculation_engine: 'Drik-Panchanga',
              error: `Python calculation failed: ${stderr}`,
              name: birthData.name,
              birth_details: {
                date: birthData.date,
                time: birthData.time,
                location: {
                  latitude: birthData.latitude,
                  longitude: birthData.longitude,
                  timezone: birthData.timezone || 'Asia/Kolkata'
                }
              },
              julian_day: 0,
              ayanamsa: 0,
              planets: [],
              ascendant: { longitude: 0, rashi: '', rashi_num: 0, degree_in_rashi: 0 },
              houses: [],
              panchanga: {
                tithi: { number: 0, name: '' },
                nakshatra: { number: 0, name: '' },
                yoga: { number: 0, name: '' },
                karana: { number: 0, name: '' },
                vara: { number: 0, name: '' }
              },
              planet_nakshatras: [],
              dasha: {
                starting_lord: '',
                moon_nakshatra: '',
                periods: []
              },
              vedic_attributes: {
                nakshatra: '',
                pada: 0,
                gana: '',
                nadi: '',
                yoni: '',
                varna: '',
                tatva: '',
                calculation_method: 'Drik-Panchanga'
              }
            });
            return;
          }

          try {
            const result = JSON.parse(stdout);
            resolve(result);
          } catch (parseError) {
            console.error('JSON parse error:', parseError);
            console.error('Raw output:', stdout);
            resolve({
              success: false,
              calculation_engine: 'Drik-Panchanga',
              error: `Failed to parse calculation results: ${parseError}`,
              name: birthData.name,
              birth_details: {
                date: birthData.date,
                time: birthData.time,
                location: {
                  latitude: birthData.latitude,
                  longitude: birthData.longitude,
                  timezone: birthData.timezone || 'Asia/Kolkata'
                }
              },
              julian_day: 0,
              ayanamsa: 0,
              planets: [],
              ascendant: { longitude: 0, rashi: '', rashi_num: 0, degree_in_rashi: 0 },
              houses: [],
              panchanga: {
                tithi: { number: 0, name: '' },
                nakshatra: { number: 0, name: '' },
                yoga: { number: 0, name: '' },
                karana: { number: 0, name: '' },
                vara: { number: 0, name: '' }
              },
              planet_nakshatras: [],
              dasha: {
                starting_lord: '',
                moon_nakshatra: '',
                periods: []
              },
              vedic_attributes: {
                nakshatra: '',
                pada: 0,
                gana: '',
                nadi: '',
                yoni: '',
                varna: '',
                tatva: '',
                calculation_method: 'Drik-Panchanga'
              }
            });
          }
        });

        pythonProcess.on('error', (error) => {
          console.error('Failed to spawn Python process:', error);
          resolve({
            success: false,
            calculation_engine: 'Drik-Panchanga',
            error: `Failed to start calculation engine: ${error.message}`,
            name: birthData.name,
            birth_details: {
              date: birthData.date,
              time: birthData.time,
              location: {
                latitude: birthData.latitude,
                longitude: birthData.longitude,
                timezone: birthData.timezone || 'Asia/Kolkata'
              }
            },
            julian_day: 0,
            ayanamsa: 0,
            planets: [],
            ascendant: { longitude: 0, rashi: '', rashi_num: 0, degree_in_rashi: 0 },
            houses: [],
            panchanga: {
              tithi: { number: 0, name: '' },
              nakshatra: { number: 0, name: '' },
              yoga: { number: 0, name: '' },
              karana: { number: 0, name: '' },
              vara: { number: 0, name: '' }
            },
            planet_nakshatras: [],
            dasha: {
              starting_lord: '',
              moon_nakshatra: '',
              periods: []
            },
            vedic_attributes: {
              nakshatra: '',
              pada: 0,
              gana: '',
              nadi: '',
              yoni: '',
              varna: '',
              tatva: '',
              calculation_method: 'Drik-Panchanga'
            }
          });
        });

      } catch (error) {
        console.error('Drik Panchanga calculation error:', error);
        resolve({
          success: false,
          calculation_engine: 'Drik-Panchanga',
          error: `Calculation setup failed: ${error}`,
          name: birthData.name,
          birth_details: {
            date: birthData.date,
            time: birthData.time,
            location: {
              latitude: birthData.latitude,
              longitude: birthData.longitude,
              timezone: birthData.timezone || 'Asia/Kolkata'
            }
          },
          julian_day: 0,
          ayanamsa: 0,
          planets: [],
          ascendant: { longitude: 0, rashi: '', rashi_num: 0, degree_in_rashi: 0 },
          houses: [],
          panchanga: {
            tithi: { number: 0, name: '' },
            nakshatra: { number: 0, name: '' },
            yoga: { number: 0, name: '' },
            karana: { number: 0, name: '' },
            vara: { number: 0, name: '' }
          },
          planet_nakshatras: [],
          dasha: {
            starting_lord: '',
            moon_nakshatra: '',
            periods: []
          },
          vedic_attributes: {
            nakshatra: '',
            pada: 0,
            gana: '',
            nadi: '',
            yoni: '',
            varna: '',
            tatva: '',
            calculation_method: 'Drik-Panchanga'
          }
        });
      }
    });
  }

  /**
   * Express route handler for Drik Panchanga birth chart calculation
   */
  static async calculateDrikChart(req: Request, res: Response) {
    try {
      const { name, date, time, latitude, longitude, timezone } = req.body;

      // Validate required fields
      if (!name || !date || !time || !latitude || !longitude) {
        return res.status(400).json({
          success: false,
          error: "Missing required fields: name, date, time, latitude, longitude"
        });
      }

      // Prepare birth data
      const birthData: DrikBirthData = {
        name,
        date,
        time,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        timezone: timezone || 'Asia/Kolkata'
      };

      // Calculate birth chart using Drik Panchanga
      const result = await this.calculateBirthChart(birthData);

      res.json(result);

    } catch (error) {
      console.error('Drik Panchanga API error:', error);
      res.status(500).json({
        success: false,
        error: `Internal server error: ${error}`
      });
    }
  }

  /**
   * Compare calculations between different engines
   */
  static async compareDrikWithJyotisha(req: Request, res: Response) {
    try {
      const { name, date, time, latitude, longitude, timezone } = req.body;

      if (!name || !date || !time || !latitude || !longitude) {
        return res.status(400).json({
          success: false,
          error: "Missing required fields"
        });
      }

      const birthData: DrikBirthData = {
        name,
        date,
        time,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        timezone: timezone || 'Asia/Kolkata'
      };

      // Calculate using Drik Panchanga
      const drikResult = await this.calculateBirthChart(birthData);

      // Calculate using Jyotisha engine for comparison
      let jyotishaResult;
      try {
        const { JyotishaOfficial } = await import('./jyotisha-official');
        const jyotishaBirthData = {
          name: birthData.name,
          date: birthData.date,
          time: birthData.time,
          latitude: birthData.latitude,
          longitude: birthData.longitude,
          place: 'Location'
        };
        jyotishaResult = await JyotishaOfficial.calculateBirthChart(jyotishaBirthData);
      } catch (error) {
        console.error('Jyotisha engine error:', error);
        jyotishaResult = {
          success: false,
          error: `Jyotisha engine failed: ${error.message}`
        };
      }

      res.json({
        success: true,
        comparison: {
          drik_panchanga: drikResult,
          jyotisha: jyotishaResult
        },
        birth_data: birthData
      });

    } catch (error) {
      console.error('Comparison API error:', error);
      res.status(500).json({
        success: false,
        error: `Comparison failed: ${error}`
      });
    }
  }
}

// Export the calculation functions
export async function calculateDrikChart(req: Request, res: Response) {
  return DrikPanchangaInterface.calculateDrikChart(req, res);
}

export async function compareDrikWithJyotisha(req: Request, res: Response) {
  return DrikPanchangaInterface.compareDrikWithJyotisha(req, res);
}