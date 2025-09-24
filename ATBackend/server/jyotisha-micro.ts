/**
 * JEMicro (Jyotisha Engine Micro) Interface
 * Cloned from primary Jyotisha Engine for enhanced redundancy
 * Third-tier calculation engine in the multi-engine architecture
 */

import { spawn } from 'child_process';
import { Request, Response } from 'express';
import axios from 'axios';

export interface BirthData {
  name: string;
  date: string;
  time: string;
  latitude: number;
  longitude: number;
  place: string;
}

export interface JyotishaMicroResult {
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

export class JEMicro {
  private static failedAttempts = 0;
  private static readonly MAX_RETRIES = 3;
  private static lastFailureTime = 0;
  private static readonly MICRO_TIMEOUT = 8000; // 8 seconds timeout for micro engine
  
  // Microservice configuration
  private static readonly MICROSERVICE_URL = process.env.JEMICRO_SERVICE_URL || 'http://localhost:3001';
  private static readonly USE_MICROSERVICE = process.env.JEMICRO_USE_MICROSERVICE === 'true' || false;
  private static readonly MICROSERVICE_TIMEOUT = 10000; // 10 seconds for microservice calls

  /**
   * Calculate birth chart using JEMicro engine
   */
  static async calculateBirthChart(birthData: BirthData): Promise<JyotishaMicroResult> {
    const startTime = Date.now();
    
    try {
      console.log(`🔬 [JEMICRO] Attempting JEMicro calculation`);
      
      // Try microservice first if enabled, then fallback to integrated engine
      let microResult: JyotishaMicroResult;
      
      if (this.USE_MICROSERVICE) {
        try {
          console.log(`🌐 [JEMICRO] Using microservice at ${this.MICROSERVICE_URL}`);
          microResult = await this.calculateWithMicroservice(birthData);
          console.log(`✅ [JEMICRO] Microservice calculation successful in ${Date.now() - startTime}ms`);
        } catch (microserviceError) {
          const errorMessage = microserviceError instanceof Error ? microserviceError.message : String(microserviceError);
          console.log(`❌ [JEMICRO] Microservice failed, falling back to integrated engine: ${errorMessage}`);
          microResult = await this.calculateWithMicroEngine(birthData);
          console.log(`✅ [JEMICRO] Integrated engine calculation successful in ${Date.now() - startTime}ms`);
        }
      } else {
        microResult = await this.calculateWithMicroEngine(birthData);
        console.log(`✅ [JEMICRO] Calculation successful in ${Date.now() - startTime}ms`);
      }
      
      // Reset failure counter on success
      this.failedAttempts = 0;
      
      return microResult;
      
    } catch (microError) {
      this.failedAttempts++;
      this.lastFailureTime = Date.now();
      
      const errorMessage = microError instanceof Error ? microError.message : String(microError);
      console.log(`❌ [JEMICRO] Engine failed (attempt ${this.failedAttempts}/${this.MAX_RETRIES}): ${errorMessage}`);
      
      throw new Error(`JEMicro calculation failed: ${errorMessage}`);
    }
  }

  /**
   * Calculate birth chart using JEMicro microservice
   */
  private static async calculateWithMicroservice(birthData: BirthData): Promise<JyotishaMicroResult> {
    try {
      const response = await axios.post(`${this.MICROSERVICE_URL}/api/calculate`, birthData, {
        timeout: this.MICROSERVICE_TIMEOUT,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'AstroTick-JEMicro-Client/1.0.0'
        }
      });

      if (response.data.success) {
        return {
          ...response.data,
          calculation_engine: 'JEMicro-Microservice',
          microservice_architecture: true
        };
      } else {
        throw new Error(response.data.error || 'Microservice calculation failed');
      }

    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED') {
          throw new Error('JEMicro microservice is not available');
        } else if (error.code === 'ECONNABORTED') {
          throw new Error('JEMicro microservice timeout');
        } else {
          throw new Error(`JEMicro microservice error: ${error.message}`);
        }
      }
      throw error;
    }
  }

  /**
   * Micro engine calculation method
   */
  private static async calculateWithMicroEngine(birthData: BirthData): Promise<JyotishaMicroResult> {
    return new Promise((resolve, reject) => {
      const pythonProcess = spawn('python3', ['server/jyotisha-micro-engine.py']);

      let stdout = '';
      let stderr = '';

      pythonProcess.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      pythonProcess.on('close', (code) => {
        if (code === 0) {
          try {
            const result = JSON.parse(stdout);
            result.calculation_engine = 'JEMicro-Jyotisha-Engine';
            resolve(result);
          } catch (parseError) {
            const errorMessage = parseError instanceof Error ? parseError.message : String(parseError);
            reject(new Error(`Failed to parse JEMicro result: ${errorMessage}`));
          }
        } else {
          reject(new Error(`JEMicro engine process failed with code ${code}: ${stderr}`));
        }
      });

      pythonProcess.on('error', (error) => {
        const errorMessage = error instanceof Error ? error.message : String(error);
        reject(new Error(`Failed to start JEMicro engine: ${errorMessage}`));
      });

      // Set timeout for micro engine
      const timeout = setTimeout(() => {
        pythonProcess.kill('SIGTERM');
        reject(new Error('JEMicro engine timeout after 8 seconds'));
      }, this.MICRO_TIMEOUT);

      pythonProcess.on('close', () => {
        clearTimeout(timeout);
      });

      // Send birth data to Python process
      try {
        pythonProcess.stdin.write(JSON.stringify(birthData));
        pythonProcess.stdin.end();
      } catch (error) {
        clearTimeout(timeout);
        reject(new Error(`Failed to send data to JEMicro engine: ${error.message}`));
      }
    });
  }

  /**
   * Get engine status
   */
  static getEngineStatus() {
    return {
      engine: 'JEMicro-Jyotisha-Engine',
      version: '0.1.9-micro',
      description: 'Micro Vedic astrology calculations using Jyotisha library for tertiary redundancy',
      features: [
        'Sidereal planetary positions',
        'Nakshatra calculations',
        'Vimshottari Dasha system',
        'Swiss Ephemeris integration',
        'Lahiri Ayanamsa',
        'Whole sign houses',
        'Micro-optimized calculations',
        'Tertiary engine redundancy'
      ],
      purpose: 'Third-tier engine for ultra-high availability astrology calculations',
      timeout_ms: this.MICRO_TIMEOUT,
      failed_attempts: this.failedAttempts,
      last_failure: this.lastFailureTime > 0 ? new Date(this.lastFailureTime).toISOString() : null
    };
  }

  /**
   * Test engine functionality
   */
  static async testEngine(): Promise<{ success: boolean; response_time_ms: number; error?: string }> {
    const testData: BirthData = {
      name: 'Test',
      date: '1980-09-09',
      time: '19:15:00',
      latitude: 13.0827,
      longitude: 80.2707,
      place: 'Chennai, India'
    };

    const startTime = Date.now();

    try {
      const result = await this.calculateBirthChart(testData);
      const responseTime = Date.now() - startTime;

      return {
        success: result.success,
        response_time_ms: responseTime
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        success: false,
        response_time_ms: Date.now() - startTime,
        error: errorMessage
      };
    }
  }
}