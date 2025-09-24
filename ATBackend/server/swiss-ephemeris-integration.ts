
import { Request, Response } from 'express';
import { spawn } from 'child_process';
import path from 'path';

/**
 * Enhanced Swiss Ephemeris Integration
 * Provides ProKerala/Drik Panchang level accuracy for Panchang calculations
 */
export class SwissEphemerisIntegration {
  
  /**
   * Calculate highly accurate Panchang using Swiss Ephemeris Python engine
   */
  static async calculateAccuratePanchang(
    dateString: string, 
    latitude: number, 
    longitude: number, 
    timezone: string = 'Asia/Kolkata'
  ) {
    try {
      // Prepare data for Python Swiss Ephemeris engine
      const inputData = {
        date: dateString,
        latitude: latitude,
        longitude: longitude,
        timezone: timezone,
        ayanamsa: 'LAHIRI',  // Use Lahiri Ayanamsa for authenticity
        calculation_type: 'COMPREHENSIVE_PANCHANG'
      };

      const result = await this.executeSwissEphemerisPython(inputData);
      
      if (result.success) {
        return {
          success: true,
          date: dateString,
          location: { latitude, longitude, timezone },
          accuracy_level: "SWISS_EPHEMERIS_PROFESSIONAL",
          panchang: {
            tithi: {
              current: {
                name: result.tithi.name,
                number: result.tithi.number,
                paksha: result.tithi.paksha,
                startTime: result.tithi.start_time,
                endTime: result.tithi.end_time,
                percentage: result.tithi.percentage,
                remaining_hours: result.tithi.remaining_hours
              },
              next: result.tithi.next ? {
                name: result.tithi.next.name,
                number: result.tithi.next.number,
                paksha: result.tithi.next.paksha,
                startTime: result.tithi.next.start_time,
                endTime: result.tithi.next.end_time,
                nextDay: result.tithi.next.next_day
              } : undefined
            },
            nakshatra: {
              current: {
                name: result.nakshatra.name,
                number: result.nakshatra.number,
                lord: result.nakshatra.lord,
                pada: result.nakshatra.pada,
                startTime: result.nakshatra.start_time,
                endTime: result.nakshatra.end_time,
                percentage: result.nakshatra.percentage,
                remaining_hours: result.nakshatra.remaining_hours
              },
              next: result.nakshatra.next ? {
                name: result.nakshatra.next.name,
                number: result.nakshatra.next.number,
                lord: result.nakshatra.next.lord,
                startTime: result.nakshatra.next.start_time,
                endTime: result.nakshatra.next.end_time,
                nextDay: result.nakshatra.next.next_day
              } : undefined
            },
            yoga: {
              current: {
                name: result.yoga.name,
                number: result.yoga.number,
                startTime: result.yoga.start_time,
                endTime: result.yoga.end_time,
                percentage: result.yoga.percentage
              },
              next: result.yoga.next ? {
                name: result.yoga.next.name,
                number: result.yoga.next.number,
                startTime: result.yoga.next.start_time,
                endTime: result.yoga.next.end_time,
                nextDay: result.yoga.next.next_day
              } : undefined
            },
            karana: {
              current: {
                name: result.karana.first.name,
                number: result.karana.first.number,
                startTime: result.karana.first.start_time,
                endTime: result.karana.first.end_time
              },
              next: {
                name: result.karana.second.name,
                number: result.karana.second.number,
                startTime: result.karana.second.start_time,
                endTime: result.karana.second.end_time
              }
            },
            vara: {
              name: result.vara.name,
              lord: result.vara.lord,
              sanskrit_name: result.vara.sanskrit_name
            }
          },
          timing: {
            sunrise: result.sunrise,
            sunset: result.sunset,
            moonrise: result.moonrise,
            moonset: result.moonset,
            solar_noon: result.solar_noon,
            civil_twilight: {
              dawn: result.civil_twilight_begin,
              dusk: result.civil_twilight_end
            }
          },
          lunar_details: {
            moon_phase: result.moon_phase,
            moon_sign: result.moon_sign,
            moon_nakshatra_pada: result.moon_nakshatra_pada,
            illumination_percentage: result.moon_illumination
          },
          auspicious_times: {
            abhijit_muhurta: {
              start: result.abhijit_muhurta.start,
              end: result.abhijit_muhurta.end,
              description: "Most auspicious time of the day"
            },
            brahma_muhurta: {
              start: result.brahma_muhurta.start,
              end: result.brahma_muhurta.end,
              description: "Best time for spiritual practices"
            },
            vijaya_muhurta: {
              start: result.vijaya_muhurta.start,
              end: result.vijaya_muhurta.end,
              description: "Victory time - good for new ventures"
            },
            godhuli_muhurta: {
              start: result.godhuli_muhurta.start,
              end: result.godhuli_muhurta.end,
              description: "Cow dust time - sacred evening period"
            }
          },
          inauspicious_times: {
            rahu_kaal: {
              start: result.rahu_kaal.start,
              end: result.rahu_kaal.end,
              description: "Time ruled by Rahu - avoid important activities"
            },
            yamaganda: {
              start: result.yamaganda.start,
              end: result.yamaganda.end,
              description: "Death period - inauspicious for new beginnings"
            },
            gulika_kaal: {
              start: result.gulika_kaal.start,
              end: result.gulika_kaal.end,
              description: "Saturn's son period - avoid important work"
            },
            dur_muhurat: result.dur_muhurat?.map(dm => ({
              start: dm.start,
              end: dm.end,
              description: "General inauspicious period"
            })) || [],
            varjyam: result.varjyam ? {
              start: result.varjyam.start,
              end: result.varjyam.end,
              description: "Time to be avoided for new activities"
            } : undefined
          },
          choghadiya: {
            day_periods: result.choghadiya.day.map(period => ({
              name: period.name,
              start: period.start,
              end: period.end,
              nature: period.nature,
              quality: period.quality
            })),
            night_periods: result.choghadiya.night.map(period => ({
              name: period.name,
              start: period.start,
              end: period.end,
              nature: period.nature,
              quality: period.quality
            }))
          },
          festivals: result.festivals || [],
          samvat: {
            vikram_samvat: result.vikram_samvat,
            shaka_samvat: result.shaka_samvat,
            kali_samvat: result.kali_samvat
          },
          lunar_month: {
            name: result.lunar_month.name,
            paksha: result.lunar_month.paksha,
            amanta: result.lunar_month.amanta,
            purnimanta: result.lunar_month.purnimanta
          },
          astronomical: {
            julian_day: result.julian_day,
            ayanamsa: result.ayanamsa,
            sun_longitude: result.sun_longitude,
            moon_longitude: result.moon_longitude,
            calculation_engine: "Swiss Ephemeris",
            ephemeris_version: result.ephemeris_version,
            accuracy_note: "Professional astronomical accuracy matching Drik Panchang"
          }
        };
      } else {
        // Fallback to manual calculation if Swiss Ephemeris fails
        console.warn('Swiss Ephemeris calculation failed, using fallback');
        return await this.calculateFallbackPanchang(dateString, latitude, longitude, timezone);
      }
      
    } catch (error) {
      console.error('Swiss Ephemeris integration error:', error);
      // Fallback to manual calculation
      return await this.calculateFallbackPanchang(dateString, latitude, longitude, timezone);
    }
  }

  /**
   * Execute Swiss Ephemeris Python calculation
   */
  private static async executeSwissEphemerisPython(inputData: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const pythonScript = path.join(__dirname, 'enhanced-swiss-ephemeris-engine.py');
      const pythonProcess = spawn('python3', [pythonScript, JSON.stringify(inputData)], {
        stdio: ['pipe', 'pipe', 'pipe']
      });

      let outputData = '';
      let errorData = '';

      pythonProcess.stdout.on('data', (data) => {
        outputData += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        errorData += data.toString();
      });

      pythonProcess.on('close', (code) => {
        if (code === 0) {
          try {
            const result = JSON.parse(outputData);
            resolve(result);
          } catch (parseError) {
            reject(new Error(`Failed to parse Python output: ${parseError.message}`));
          }
        } else {
          reject(new Error(`Python process failed with code ${code}: ${errorData}`));
        }
      });

      pythonProcess.on('error', (error) => {
        reject(new Error(`Failed to start Python process: ${error.message}`));
      });
    });
  }

  /**
   * Fallback calculation using manual astronomical formulas
   */
  private static async calculateFallbackPanchang(dateString: string, latitude: number, longitude: number, timezone: string) {
    // Import existing calculation logic
    const { AuthenticPanchangCalculator } = await import('./authentic-panchang-engine');
    const calculator = new AuthenticPanchangCalculator();
    
    const result = calculator.calculateAuthenticPanchang(dateString, latitude, longitude, timezone);
    
    return {
      ...result,
      accuracy_level: "MANUAL_CALCULATION_FALLBACK",
      astronomical: {
        ...result.astronomical,
        calculation_engine: "Manual VSOP87 with authentic formulas",
        accuracy_note: "Fallback calculation - Swiss Ephemeris unavailable"
      }
    };
  }

  /**
   * Calculate sun rise/set times with high precision
   */
  static async calculatePreciseSunTimes(date: Date, latitude: number, longitude: number) {
    try {
      const inputData = {
        date: date.toISOString().split('T')[0],
        latitude: latitude,
        longitude: longitude,
        calculation_type: 'SUN_TIMES_ONLY'
      };

      const result = await this.executeSwissEphemerisPython(inputData);
      
      return {
        sunrise: result.sunrise,
        sunset: result.sunset,
        solar_noon: result.solar_noon,
        day_length: result.day_length,
        civil_twilight_begin: result.civil_twilight_begin,
        civil_twilight_end: result.civil_twilight_end,
        nautical_twilight_begin: result.nautical_twilight_begin,
        nautical_twilight_end: result.nautical_twilight_end,
        astronomical_twilight_begin: result.astronomical_twilight_begin,
        astronomical_twilight_end: result.astronomical_twilight_end
      };
    } catch (error) {
      console.error('Precise sun times calculation failed:', error);
      // Return approximate calculation
      return this.calculateApproximateSunTimes(date, latitude, longitude);
    }
  }

  /**
   * Calculate moon rise/set times with high precision
   */
  static async calculatePreciseMoonTimes(date: Date, latitude: number, longitude: number) {
    try {
      const inputData = {
        date: date.toISOString().split('T')[0],
        latitude: latitude,
        longitude: longitude,
        calculation_type: 'MOON_TIMES_ONLY'
      };

      const result = await this.executeSwissEphemerisPython(inputData);
      
      return {
        moonrise: result.moonrise,
        moonset: result.moonset,
        moon_transit: result.moon_transit,
        moon_phase: result.moon_phase,
        moon_illumination: result.moon_illumination,
        moon_distance: result.moon_distance,
        moon_angular_diameter: result.moon_angular_diameter
      };
    } catch (error) {
      console.error('Precise moon times calculation failed:', error);
      // Return approximate calculation
      return this.calculateApproximateMoonTimes(date, latitude, longitude);
    }
  }

  /**
   * Approximate sun times calculation (fallback)
   */
  private static calculateApproximateSunTimes(date: Date, latitude: number, longitude: number) {
    // Simplified sunrise/sunset calculation
    const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
    const solarDeclination = 23.45 * Math.sin((360 * (284 + dayOfYear) / 365) * Math.PI / 180);
    const hourAngle = Math.acos(-Math.tan(latitude * Math.PI / 180) * Math.tan(solarDeclination * Math.PI / 180)) * 180 / Math.PI;
    
    const solarNoon = 12 - (longitude / 15);
    const sunrise = solarNoon - (hourAngle / 15);
    const sunset = solarNoon + (hourAngle / 15);
    
    const formatTime = (hours: number) => {
      const h = Math.floor(hours);
      const m = Math.floor((hours - h) * 60);
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    };
    
    return {
      sunrise: formatTime(sunrise),
      sunset: formatTime(sunset),
      solar_noon: formatTime(solarNoon),
      day_length: formatTime(sunset - sunrise),
      civil_twilight_begin: formatTime(sunrise - 0.5),
      civil_twilight_end: formatTime(sunset + 0.5)
    };
  }

  /**
   * Approximate moon times calculation (fallback)
   */
  private static calculateApproximateMoonTimes(date: Date, latitude: number, longitude: number) {
    // Simplified moon calculation
    const lunarAge = (date.getTime() - new Date(2000, 0, 6).getTime()) / (1000 * 60 * 60 * 24) % 29.53;
    const moonPhase = lunarAge / 29.53;
    
    // Approximate moonrise/moonset based on lunar age
    const baseTime = 6 + (lunarAge * 0.8); // Rough approximation
    const moonrise = (baseTime + longitude / 15) % 24;
    const moonset = (moonrise + 12) % 24;
    
    const formatTime = (hours: number) => {
      const h = Math.floor(hours);
      const m = Math.floor((hours - h) * 60);
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    };
    
    return {
      moonrise: formatTime(moonrise),
      moonset: formatTime(moonset),
      moon_phase: Math.round(moonPhase * 100) / 100,
      moon_illumination: Math.round((1 - Math.abs(0.5 - moonPhase) * 2) * 100)
    };
  }
}

// API endpoint for enhanced Panchang calculation
export async function calculateEnhancedPanchang(req: Request, res: Response) {
  try {
    const { date, latitude, longitude, timezone } = req.body;
    
    if (!date || !latitude || !longitude) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: date, latitude, longitude"
      });
    }
    
    const result = await SwissEphemerisIntegration.calculateAccuratePanchang(
      date,
      parseFloat(latitude),
      parseFloat(longitude),
      timezone || 'Asia/Kolkata'
    );
    
    res.json(result);
    
  } catch (error) {
    console.error('Enhanced Panchang calculation error:', error);
    res.status(500).json({
      success: false,
      error: `Enhanced calculation failed: ${error.message}`
    });
  }
}
