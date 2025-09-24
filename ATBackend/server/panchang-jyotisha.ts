/**
 * Panchang Calculator using Jyotisha Engine
 * Provides comprehensive daily Panchang calculations including Tithi, Nakshatra, Yoga, Karana, and Vara
 */

import { spawn } from 'child_process';
import { Request, Response } from 'express';

export interface PanchangData {
  date: string;
  latitude: number;
  longitude: number;
  timezone?: string;
}

export interface PanchangResult {
  success: boolean;
  date: string;
  location: {
    latitude: number;
    longitude: number;
    timezone: string;
  };
  panchang: {
    tithi: {
      name: string;
      number: number;
      percentage: number;
      endTime: string;
    };
    nakshatra: {
      name: string;
      number: number;
      percentage: number;
      endTime: string;
      lord: string;
    };
    yoga: {
      name: string;
      number: number;
      percentage: number;
      endTime: string;
    };
    karana: {
      name: string;
      number: number;
      percentage: number;
      endTime: string;
    };
    vara: {
      name: string;
      lord: string;
    };
  };
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
  auspiciousTimes: {
    abhijitMuhurta: {
      start: string;
      end: string;
    };
    brahmaUhurta: {
      start: string;
      end: string;
    };
    rahu_kaal: {
      start: string;
      end: string;
    };
    gulika_kaal: {
      start: string;
      end: string;
    };
  };
  planetaryPositions: Array<{
    name: string;
    longitude: number;
    sign: string;
    nakshatra: string;
  }>;
  lunarMonth: {
    name: string;
    paksha: string;
  };
  samvat: {
    vikram: number;
    shaka: number;
  };
  calculations: {
    ayanamsa: number;
    julianDay: number;
    engine: string;
  };
  error?: string;
}

export class JyotishaPanchangCalculator {
  /**
   * Calculate comprehensive Panchang using Jyotisha engine
   */
  static async calculatePanchang(panchangData: PanchangData): Promise<PanchangResult> {
    return new Promise((resolve, reject) => {
      const pythonProcess = spawn('python3', [
        'server/panchang-jyotisha-engine.py',
        JSON.stringify(panchangData)
      ]);

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
          resolve({
            success: false,
            date: panchangData.date,
            location: {
              latitude: panchangData.latitude,
              longitude: panchangData.longitude,
              timezone: panchangData.timezone || 'Asia/Kolkata'
            },
            error: `Panchang calculation failed: ${stderr}`,
            panchang: {} as any,
            sunrise: '',
            sunset: '',
            moonrise: '',
            moonset: '',
            auspiciousTimes: {} as any,
            planetaryPositions: [],
            lunarMonth: {} as any,
            samvat: {} as any,
            calculations: {} as any
          });
          return;
        }

        try {
          const result: PanchangResult = JSON.parse(stdout);
          resolve(result);
        } catch (error) {
          resolve({
            success: false,
            date: panchangData.date,
            location: {
              latitude: panchangData.latitude,
              longitude: panchangData.longitude,
              timezone: panchangData.timezone || 'Asia/Kolkata'
            },
            error: `Failed to parse Panchang output: ${error}`,
            panchang: {} as any,
            sunrise: '',
            sunset: '',
            moonrise: '',
            moonset: '',
            auspiciousTimes: {} as any,
            planetaryPositions: [],
            lunarMonth: {} as any,
            samvat: {} as any,
            calculations: {} as any
          });
        }
      });

      pythonProcess.on('error', (error) => {
        resolve({
          success: false,
          date: panchangData.date,
          location: {
            latitude: panchangData.latitude,
            longitude: panchangData.longitude,
            timezone: panchangData.timezone || 'Asia/Kolkata'
          },
          error: `Failed to start Panchang engine: ${error.message}`,
          panchang: {} as any,
          sunrise: '',
          sunset: '',
          moonrise: '',
          moonset: '',
          auspiciousTimes: {} as any,
          planetaryPositions: [],
          lunarMonth: {} as any,
          samvat: {} as any,
          calculations: {} as any
        });
      });
    });
  }

  /**
   * Express route handler for daily Panchang calculation
   */
  static async calculateDailyPanchang(req: Request, res: Response) {
    try {
      const { date, latitude, longitude, timezone } = req.body;

      // Validate required fields
      if (!date || !latitude || !longitude) {
        return res.status(400).json({
          success: false,
          error: "Missing required fields: date, latitude, longitude"
        });
      }

      // Prepare Panchang data
      const panchangData: PanchangData = {
        date,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        timezone: timezone || 'Asia/Kolkata'
      };

      // Calculate Panchang
      const result = await this.calculatePanchang(panchangData);

      res.json(result);

    } catch (error) {
      console.error('Panchang API error:', error);
      res.status(500).json({
        success: false,
        error: `Internal server error: ${error}`
      });
    }
  }

  /**
   * Get Panchang for multiple dates (weekly/monthly view)
   */
  static async calculateMultipleDaysPanchang(req: Request, res: Response) {
    try {
      const { startDate, endDate, latitude, longitude, timezone } = req.body;

      if (!startDate || !endDate || !latitude || !longitude) {
        return res.status(400).json({
          success: false,
          error: "Missing required fields: startDate, endDate, latitude, longitude"
        });
      }

      const start = new Date(startDate);
      const end = new Date(endDate);
      const results: PanchangResult[] = [];

      // Calculate Panchang for each day in the range
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        
        const panchangData: PanchangData = {
          date: dateStr,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          timezone: timezone || 'Asia/Kolkata'
        };

        const result = await this.calculatePanchang(panchangData);
        results.push(result);
      }

      res.json({
        success: true,
        dateRange: {
          start: startDate,
          end: endDate
        },
        location: {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          timezone: timezone || 'Asia/Kolkata'
        },
        panchangData: results
      });

    } catch (error) {
      console.error('Multiple days Panchang API error:', error);
      res.status(500).json({
        success: false,
        error: `Internal server error: ${error}`
      });
    }
  }
}

// Export the calculation functions
export async function calculateDailyPanchang(req: Request, res: Response) {
  return JyotishaPanchangCalculator.calculateDailyPanchang(req, res);
}

export async function calculateMultipleDaysPanchang(req: Request, res: Response) {
  return JyotishaPanchangCalculator.calculateMultipleDaysPanchang(req, res);
}