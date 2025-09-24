/**
 * Jyotisha Official Fallback Engine - TypeScript Interface
 * Provides redundant calculation capability for enhanced reliability
 */

import { spawn, ChildProcess } from 'child_process';
import { Request, Response } from 'express';

// Interfaces (shared with primary engine)
export interface BirthData {
  name: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM or HH:MM:SS
  latitude: number;
  longitude: number;
  place?: string;
}

export interface PlanetData {
  name: string;
  longitude: number;
  latitude: number;
  house: number;
  sign: string;
  sign_english: string;
  sign_num: number;
  degree: number;
  speed: number;
  nakshatra?: {
    number: number;
    name: string;
    pada: number;
    gana: string;
    nadi: string;
    varna: string;
    yoni: string;
    tatva: string;
    paya: string;
  };
}

export interface JyotishaResultFallback {
  success: boolean;
  calculation_engine: string;
  engine_instance: string;
  calculation_time_ms: number;
  name: string;
  birth_details: {
    date: string;
    time: string;
    place: string;
    latitude: number;
    longitude: number;
  };
  julian_day: number;
  ayanamsa: number;
  planets: PlanetData[];
  ascendant: {
    longitude: number;
    sign_num: number;
    sign: string;
    sign_english: string;
    degree: number;
  };
  houses: Array<{
    house_num: number;
    sign_num: number;
    sign: string;
    sign_english: string;
  }>;
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

export class JyotishaOfficialFallback {
  private static readonly ENGINE_PATH = 'server/jyotisha-engine-fallback.py';
  private static readonly TIMEOUT_MS = 7000; // Slightly longer timeout for fallback
  private static instanceCount = 0;

  /**
   * Calculate birth chart using fallback Jyotisha engine
   */
  static async calculateBirthChart(birthData: BirthData): Promise<JyotishaResultFallback> {
    const instanceId = ++this.instanceCount;
    console.log(`🔄 [FALLBACK-${instanceId}] Starting fallback Jyotisha calculation`);
    
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      const pythonProcess = spawn('python3', [this.ENGINE_PATH]);

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
        const elapsedTime = Date.now() - startTime;
        console.log(`⏱️ [FALLBACK-${instanceId}] Timeout after ${elapsedTime}ms`);
        reject(new Error(`Jyotisha fallback calculation timeout after ${this.TIMEOUT_MS/1000} seconds`));
      }, this.TIMEOUT_MS);

      pythonProcess.on('close', (code) => {
        clearTimeout(timeout);
        const elapsedTime = Date.now() - startTime;
        
        if (code !== 0) {
          console.log(`❌ [FALLBACK-${instanceId}] Process failed with code ${code} after ${elapsedTime}ms`);
          console.log(`❌ [FALLBACK-${instanceId}] Stderr: ${stderr}`);
          reject(new Error(`Jyotisha fallback engine failed with code ${code}: ${stderr}`));
          return;
        }

        try {
          const result: JyotishaResultFallback = JSON.parse(stdout);
          console.log(`✅ [FALLBACK-${instanceId}] Calculation completed in ${elapsedTime}ms`);
          console.log(`🔧 [FALLBACK-${instanceId}] Engine: ${result.calculation_engine}`);
          resolve(result);
        } catch (error) {
          console.log(`❌ [FALLBACK-${instanceId}] JSON parse error after ${elapsedTime}ms: ${error}`);
          reject(new Error(`Failed to parse Jyotisha fallback output: ${error}`));
        }
      });

      pythonProcess.on('error', (error) => {
        clearTimeout(timeout);
        const elapsedTime = Date.now() - startTime;
        console.log(`❌ [FALLBACK-${instanceId}] Process error after ${elapsedTime}ms: ${error.message}`);
        reject(new Error(`Failed to start Jyotisha fallback process: ${error.message}`));
      });
    });
  }

  /**
   * Get fallback engine status and version info
   */
  static getEngineInfo(): any {
    return {
      engine: 'Jyotisha-Official-Fallback',
      version: '0.1.9-fallback',
      description: 'Fallback Vedic astrology calculations using Jyotisha library for enhanced reliability',
      features: [
        'Sidereal planetary positions',
        'Nakshatra calculations', 
        'Vimshottari Dasha system',
        'Swiss Ephemeris integration',
        'Lahiri Ayanamsa',
        'Whole sign houses',
        'Redundant calculation capability',
        'Enhanced timeout handling'
      ],
      purpose: 'Fallback engine for high availability astrology calculations',
      timeout_ms: this.TIMEOUT_MS
    };
  }

  /**
   * Test fallback engine connectivity
   */
  static async testEngine(): Promise<{ success: boolean; response_time_ms: number; error?: string }> {
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
      const result = await this.calculateBirthChart(testData);
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
}

/**
 * HTTP endpoint for fallback Jyotisha calculations
 */
export async function calculateOfficialJyotishaFallback(req: Request, res: Response) {
  try {
    const birthData: BirthData = req.body;

    // Validate required fields
    if (!birthData.name || !birthData.date || !birthData.time || 
        !birthData.latitude || !birthData.longitude) {
      return res.status(400).json({
        success: false,
        error: 'Missing required birth data fields',
        calculation_engine: 'Jyotisha-Fallback-Validation-Error'
      });
    }

    const result = await JyotishaOfficialFallback.calculateBirthChart(birthData);
    res.json(result);
  } catch (error) {
    console.error('Jyotisha fallback calculation error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      calculation_engine: 'Jyotisha-Fallback-Server-Error'
    });
  }
}

/**
 * HTTP endpoint for fallback engine info
 */
export async function getOfficialJyotishaFallbackInfo(req: Request, res: Response) {
  try {
    const info = JyotishaOfficialFallback.getEngineInfo();
    res.json(info);
  } catch (error) {
    console.error('Jyotisha fallback info error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
}

/**
 * HTTP endpoint for fallback engine testing
 */
export async function testOfficialJyotishaFallback(req: Request, res: Response) {
  try {
    const testResult = await JyotishaOfficialFallback.testEngine();
    res.json({
      engine: 'Jyotisha-Official-Fallback',
      test_result: testResult,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Jyotisha fallback test error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      engine: 'Jyotisha-Official-Fallback'
    });
  }
}