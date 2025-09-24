/**
 * Jyotisha Official Interface
 * TypeScript interface for the Jyotisha astrology engine
 */

import { spawn } from 'child_process';
import { Request, Response } from 'express';
import { JyotishaOfficialFallback } from './jyotisha-official-fallback';

export interface BirthData {
  name: string;
  date: string;
  time: string;
  latitude: number;
  longitude: number;
  place: string;
}

export interface JyotishaResult {
  success: boolean;
  planets?: Array<{
    name: string;
    longitude: number;
    sign: string;
    degree: string;
    nakshatra: string;
    nakshatraLord: string;
    house: number;
  }>;
  ascendant?: {
    longitude: number;
    sign: string;
  };
  dasha?: {
    current: {
      lord: string;
      start_date: string;
      end_date: string;
      duration_years: number;
      status: string;
    };
    sequence: Array<{
      lord: string;
      start_date: string;
      end_date: string;
      duration_years: number;
      status: string;
    }>;
    moonNakshatra: {
      name: string;
      number: number;
      pada: number;
      lord: string;
    };
  };
  ayanamsa?: number;
  julianDay?: number;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  calculation_engine?: string;
  error?: string;
}

export class JyotishaOfficial {
  private static failedAttempts = 0;
  private static readonly MAX_RETRIES = 3;
  private static lastFailureTime = 0;
  private static readonly FALLBACK_COOLDOWN = 30000; // 30 seconds

  /**
   * Calculate birth chart with automatic fallback support
   */
  static async calculateBirthChart(birthData: BirthData): Promise<JyotishaResult> {
    const startTime = Date.now();
    
    try {
      // Try primary engine first
      console.log(`🚀 [PRIMARY] Attempting primary Jyotisha calculation`);
      const primaryResult = await this.calculateWithPrimaryEngine(birthData);
      
      // Reset failure counter on success
      this.failedAttempts = 0;
      console.log(`✅ [PRIMARY] Calculation successful in ${Date.now() - startTime}ms`);
      
      return primaryResult;
      
    } catch (primaryError) {
      this.failedAttempts++;
      this.lastFailureTime = Date.now();
      
      console.log(`❌ [PRIMARY] Engine failed (attempt ${this.failedAttempts}/${this.MAX_RETRIES}): ${primaryError.message}`);
      
      // Try fallback engine
      try {
        console.log(`🔄 [FALLBACK] Switching to fallback Jyotisha engine`);
        const fallbackResult = await JyotishaOfficialFallback.calculateBirthChart(birthData);
        
        console.log(`✅ [FALLBACK] Calculation successful in ${Date.now() - startTime}ms`);
        
        // Convert fallback result to primary result format
        return this.convertFallbackResult(fallbackResult);
        
      } catch (fallbackError) {
        console.log(`❌ [FALLBACK] Both engines failed - Primary: ${primaryError.message}, Fallback: ${fallbackError.message}`);
        
        // Return structured error with both failure messages
        throw new Error(`All calculation engines failed. Primary: ${primaryError.message}. Fallback: ${fallbackError.message}`);
      }
    }
  }

  /**
   * Primary engine calculation method
   */
  private static async calculateWithPrimaryEngine(birthData: BirthData): Promise<JyotishaResult> {
    return new Promise((resolve, reject) => {
      const pythonProcess = spawn('python', ['server/jyotisha-engine.py']);

      let stdout = '';
      let stderr = '';

      pythonProcess.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      // Send JSON data to stdin
      pythonProcess.stdin.write(JSON.stringify(birthData));
      pythonProcess.stdin.end();

      // Add timeout to prevent hanging
      const timeout = setTimeout(() => {
        pythonProcess.kill();
        reject(new Error('Primary Jyotisha calculation timeout after 5 seconds'));
      }, 5000);

      pythonProcess.on('close', (code) => {
        clearTimeout(timeout);
        
        if (code !== 0) {
          reject(new Error(`Primary Jyotisha engine failed with code ${code}: ${stderr}`));
          return;
        }

        try {
          const result: JyotishaResult = JSON.parse(stdout);
          resolve(result);
        } catch (error) {
          reject(new Error(`Failed to parse primary Jyotisha output: ${error}`));
        }
      });

      pythonProcess.on('error', (error) => {
        clearTimeout(timeout);
        reject(new Error(`Failed to start primary Jyotisha process: ${error.message}`));
      });
    });
  }

  /**
   * Convert fallback result format to primary result format
   */
  private static convertFallbackResult(fallbackResult: any): JyotishaResult {
    try {
      // Extract planets data
      const planets = fallbackResult.planets?.map((planet: any) => ({
        name: planet.name,
        longitude: planet.longitude,
        sign: planet.sign,
        degree: planet.degree?.toString() || '0',
        nakshatra: planet.nakshatra?.name || '',
        nakshatraLord: '', // Would need additional mapping
        house: planet.house
      })) || [];

      // Extract dasha data if available
      const dasha = fallbackResult.dasha ? {
        current: fallbackResult.dasha.current || {
          lord: '',
          start_date: '',
          end_date: '',
          duration_years: 0,
          status: ''
        },
        sequence: fallbackResult.dasha.sequence || [],
        moonNakshatra: fallbackResult.dasha.moonNakshatra || {
          name: '',
          number: 0,
          pada: 0,
          lord: ''
        }
      } : undefined;

      return {
        success: fallbackResult.success,
        planets,
        ascendant: fallbackResult.ascendant ? {
          longitude: fallbackResult.ascendant.longitude,
          sign: fallbackResult.ascendant.sign
        } : undefined,
        dasha,
        ayanamsa: fallbackResult.ayanamsa,
        julianDay: fallbackResult.julian_day,
        coordinates: fallbackResult.birth_details ? {
          latitude: fallbackResult.birth_details.latitude,
          longitude: fallbackResult.birth_details.longitude
        } : undefined,
        calculation_engine: fallbackResult.calculation_engine + ' (via Fallback)',
        error: fallbackResult.error
      };
    } catch (conversionError) {
      throw new Error(`Failed to convert fallback result: ${conversionError.message}`);
    }
  }

  /**
   * Get system status with both engines
   */
  static async getSystemStatus(): Promise<any> {
    const status = {
      primary_engine: this.getEngineInfo(),
      fallback_engine: JyotishaOfficialFallback.getEngineInfo(),
      system_status: {
        failed_attempts: this.failedAttempts,
        last_failure_time: this.lastFailureTime ? new Date(this.lastFailureTime).toISOString() : null,
        fallback_cooldown_ms: this.FALLBACK_COOLDOWN,
        max_retries: this.MAX_RETRIES,
        health_status: this.failedAttempts < this.MAX_RETRIES ? 'healthy' : 'degraded'
      }
    };

    // Test both engines
    try {
      const primaryTest = await this.testPrimaryEngine();
      status.primary_engine.test_result = primaryTest;
    } catch (error) {
      status.primary_engine.test_result = { 
        success: false, 
        error: error.message,
        response_time_ms: 0
      };
    }

    try {
      const fallbackTest = await JyotishaOfficialFallback.testEngine();
      status.fallback_engine.test_result = fallbackTest;
    } catch (error) {
      status.fallback_engine.test_result = { 
        success: false, 
        error: error.message,
        response_time_ms: 0
      };
    }

    return status;
  }

  /**
   * Test primary engine
   */
  private static async testPrimaryEngine(): Promise<any> {
    const testData: BirthData = {
      name: 'Test User',
      date: '1990-01-15',
      time: '10:30',
      latitude: 13.0827,
      longitude: 80.2707,
      place: 'Chennai'
    };

    const startTime = Date.now();

    try {
      const result = await this.calculateWithPrimaryEngine(testData);
      const responseTime = Date.now() - startTime;
      
      return {
        success: result.success,
        response_time_ms: responseTime,
        error: result.error
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      return {
        success: false,
        response_time_ms: responseTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get engine status and version info
   */
  static getEngineInfo(): any {
    return {
      engine: 'Jyotisha-Official',
      version: '0.1.9',
      description: 'Advanced Vedic astrology calculations using Jyotisha library',
      features: [
        'Sidereal planetary positions',
        'Nakshatra calculations', 
        'Vimshottari Dasha system',
        'Swiss Ephemeris integration',
        'Lahiri Ayanamsa',
        'Whole sign houses'
      ]
    };
  }
}

export async function calculateOfficialJyotisha(req: Request, res: Response) {
  try {
    const birthData: BirthData = req.body;

    // Validate required fields
    if (!birthData.name || !birthData.date || !birthData.time || 
        !birthData.latitude || !birthData.longitude) {
      return res.status(400).json({
        success: false,
        error: 'Missing required birth data fields'
      });
    }

    const result = await JyotishaOfficial.calculateBirthChart(birthData);
    res.json(result);
  } catch (error) {
    console.error('Jyotisha calculation error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
}

export async function getOfficialJyotishaInfo(req: Request, res: Response) {
  try {
    const info = JyotishaOfficial.getEngineInfo();
    res.json(info);
  } catch (error) {
    console.error('Jyotisha info error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
}