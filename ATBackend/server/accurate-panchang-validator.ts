
import { spawn } from 'child_process';

interface PanchangValidationResult {
  success: boolean;
  accuracy: number;
  mismatches: string[];
  recommendations: string[];
}

interface PanchangComparison {
  date: string;
  location: string;
  astroTick: any;
  prokerala: any;
  drikPanchang: any;
  differences: string[];
}

export class AccuratePanchangValidator {
  private static readonly TOLERANCE_MINUTES = 2; // 2-minute tolerance for timing
  private static readonly TRUSTED_SOURCES = ['prokerala', 'drik', 'pyjhora'];

  /**
   * Comprehensive Panchang validation following the recommendation
   */
  static async validatePanchangAccuracy(
    date: string,
    latitude: number,
    longitude: number,
    timezone: string = 'Asia/Kolkata'
  ): Promise<PanchangValidationResult> {
    const result: PanchangValidationResult = {
      success: true,
      accuracy: 0,
      mismatches: [],
      recommendations: []
    };

    try {
      // 1. Generate our Panchang data
      const ourPanchang = await this.calculateOurPanchang(date, latitude, longitude, timezone);
      
      // 2. Get reference data from trusted sources
      const referencePanchang = await this.getReferenceData(date, latitude, longitude);
      
      // 3. Validate core elements
      const validationChecks = [
        this.validateTimezone(ourPanchang, date, timezone),
        this.validateSiderealCalculations(ourPanchang),
        this.validateTithiCalculation(ourPanchang, referencePanchang),
        this.validateNakshatraAccuracy(ourPanchang, referencePanchang),
        this.validateYogaKarana(ourPanchang, referencePanchang),
        this.validateAstronomicalTimings(ourPanchang, referencePanchang),
        this.validateCornerCases(ourPanchang, date)
      ];

      // Process validation results
      let totalChecks = validationChecks.length;
      let passedChecks = validationChecks.filter(check => check.passed).length;
      
      result.accuracy = (passedChecks / totalChecks) * 100;
      result.mismatches = validationChecks
        .filter(check => !check.passed)
        .map(check => check.error);
      
      result.recommendations = this.generateRecommendations(validationChecks);
      result.success = result.accuracy >= 85; // 85% accuracy threshold

      return result;
    } catch (error) {
      console.error('Panchang validation error:', error);
      result.success = false;
      result.mismatches.push(`Validation failed: ${error.message}`);
      return result;
    }
  }

  /**
   * 1. Correct Timezone Handling Validation
   */
  private static validateTimezone(panchang: any, date: string, timezone: string) {
    const dateObj = new Date(date + 'T00:00:00');
    const expectedJD = this.dateToJulianDay(dateObj, timezone);
    const actualJD = panchang.julianDay;
    
    const difference = Math.abs(expectedJD - actualJD);
    const isValid = difference < 0.5; // Half day tolerance
    
    return {
      passed: isValid,
      error: isValid ? null : `Timezone conversion error: JD difference ${difference.toFixed(4)}`
    };
  }

  /**
   * 2. Sidereal Calculations with Ayanamsa
   */
  private static validateSiderealCalculations(panchang: any) {
    const { sunLongitude, moonLongitude, ayanamsa } = panchang;
    
    // Check if ayanamsa is applied correctly
    const expectedAyanamsa = this.calculateLahiriAyanamsa(panchang.julianDay);
    const ayanamsaDiff = Math.abs(ayanamsa - expectedAyanamsa);
    
    const isValid = ayanamsaDiff < 0.1; // 0.1 degree tolerance
    
    return {
      passed: isValid,
      error: isValid ? null : `Ayanamsa error: Expected ${expectedAyanamsa.toFixed(4)}, got ${ayanamsa.toFixed(4)}`
    };
  }

  /**
   * 3. Tithi Calculation Validation
   */
  private static validateTithiCalculation(ourPanchang: any, reference: any) {
    const { tithi: ourTithi } = ourPanchang;
    const referenceTithi = reference?.tithi;
    
    if (!referenceTithi) {
      return { passed: false, error: 'No reference Tithi data available' };
    }
    
    // Tithi should match or be within 1 index
    const tithiDiff = Math.abs(ourTithi.index - referenceTithi.index);
    const isValid = tithiDiff <= 1;
    
    return {
      passed: isValid,
      error: isValid ? null : `Tithi mismatch: Our ${ourTithi.name}, Reference ${referenceTithi.name}`
    };
  }

  /**
   * 4. Nakshatra Accuracy Validation
   */
  private static validateNakshatraAccuracy(ourPanchang: any, reference: any) {
    const { nakshatra: ourNakshatra } = ourPanchang;
    const referenceNakshatra = reference?.nakshatra;
    
    if (!referenceNakshatra) {
      return { passed: false, error: 'No reference Nakshatra data available' };
    }
    
    const nakshatraMatch = ourNakshatra.index === referenceNakshatra.index;
    
    return {
      passed: nakshatraMatch,
      error: nakshatraMatch ? null : `Nakshatra mismatch: Our ${ourNakshatra.name}, Reference ${referenceNakshatra.name}`
    };
  }

  /**
   * 5. Yoga and Karana Validation
   */
  private static validateYogaKarana(ourPanchang: any, reference: any) {
    const errors = [];
    
    // Validate Yoga
    if (reference?.yoga && ourPanchang.yoga.index !== reference.yoga.index) {
      errors.push(`Yoga mismatch: Our ${ourPanchang.yoga.name}, Reference ${reference.yoga.name}`);
    }
    
    // Validate Karana
    if (reference?.karana && ourPanchang.karana.index !== reference.karana.index) {
      errors.push(`Karana mismatch: Our ${ourPanchang.karana.name}, Reference ${reference.karana.name}`);
    }
    
    return {
      passed: errors.length === 0,
      error: errors.length > 0 ? errors.join('; ') : null
    };
  }

  /**
   * 6. Astronomical Timings Validation
   */
  private static validateAstronomicalTimings(ourPanchang: any, reference: any) {
    const errors = [];
    const tolerance = this.TOLERANCE_MINUTES;
    
    if (reference?.sunrise) {
      const sunriseDiff = this.getTimeDifferenceMinutes(ourPanchang.sunrise, reference.sunrise);
      if (sunriseDiff > tolerance) {
        errors.push(`Sunrise time off by ${sunriseDiff} minutes`);
      }
    }
    
    if (reference?.sunset) {
      const sunsetDiff = this.getTimeDifferenceMinutes(ourPanchang.sunset, reference.sunset);
      if (sunsetDiff > tolerance) {
        errors.push(`Sunset time off by ${sunsetDiff} minutes`);
      }
    }
    
    if (reference?.moonrise) {
      const moonriseDiff = this.getTimeDifferenceMinutes(ourPanchang.moonrise, reference.moonrise);
      if (moonriseDiff > tolerance) {
        errors.push(`Moonrise time off by ${moonriseDiff} minutes`);
      }
    }
    
    return {
      passed: errors.length === 0,
      error: errors.length > 0 ? errors.join('; ') : null
    };
  }

  /**
   * 7. Corner Cases Validation
   */
  private static validateCornerCases(panchang: any, date: string) {
    const dateObj = new Date(date);
    const errors = [];
    
    // Check for special days
    if (panchang.tithi?.name?.includes('Amavasya') || panchang.tithi?.name?.includes('Purnima')) {
      // Validate moon phase consistency
      const moonPhase = this.calculateMoonPhase(panchang.moonLongitude, panchang.sunLongitude);
      if (panchang.tithi.name.includes('Amavasya') && moonPhase > 15) {
        errors.push('Amavasya tithi but moon phase indicates otherwise');
      }
      if (panchang.tithi.name.includes('Purnima') && Math.abs(moonPhase - 15) > 2) {
        errors.push('Purnima tithi but moon phase indicates otherwise');
      }
    }
    
    // Validate seasonal changes (equinoxes/solstices)
    const month = dateObj.getMonth() + 1;
    if ([3, 6, 9, 12].includes(month)) {
      // Near equinoxes/solstices - validate Ayana
      const expectedAyana = this.calculateAyana(panchang.sunLongitude);
      if (panchang.ayana !== expectedAyana) {
        errors.push(`Ayana calculation error near seasonal change`);
      }
    }
    
    return {
      passed: errors.length === 0,
      error: errors.length > 0 ? errors.join('; ') : null
    };
  }

  /**
   * Generate improvement recommendations
   */
  private static generateRecommendations(validationChecks: any[]): string[] {
    const recommendations = [];
    
    validationChecks.forEach(check => {
      if (!check.passed) {
        if (check.error?.includes('Timezone')) {
          recommendations.push('Implement proper IST timezone conversion: JD = julday(year, month, day, (hour + minute/60) - 5.5)');
        }
        if (check.error?.includes('Ayanamsa')) {
          recommendations.push('Use accurate Lahiri Ayanamsa calculation and apply to sidereal positions');
        }
        if (check.error?.includes('Tithi')) {
          recommendations.push('Verify Tithi formula: floor((Moon - Sun) / 12) with proper sidereal positions');
        }
        if (check.error?.includes('Nakshatra')) {
          recommendations.push('Check Nakshatra calculation: (Moon Longitude) / 13.333... with 27 segments');
        }
        if (check.error?.includes('timing')) {
          recommendations.push('Use Swiss Ephemeris for high-precision astronomical timings');
        }
      }
    });
    
    return [...new Set(recommendations)]; // Remove duplicates
  }

  /**
   * Helper methods
   */
  private static async calculateOurPanchang(date: string, lat: number, lng: number, tz: string) {
    // Call our existing Panchang calculation system
    return new Promise((resolve, reject) => {
      const python = spawn('python3', [
        'server/panchang-jyotisha-engine.py',
        date,
        lat.toString(),
        lng.toString(),
        tz
      ]);
      
      let output = '';
      let error = '';
      
      python.stdout.on('data', (data) => {
        output += data.toString();
      });
      
      python.stderr.on('data', (data) => {
        error += data.toString();
      });
      
      python.on('close', (code) => {
        if (code === 0) {
          try {
            resolve(JSON.parse(output));
          } catch (e) {
            reject(new Error('Failed to parse Panchang result'));
          }
        } else {
          reject(new Error(`Panchang calculation failed: ${error}`));
        }
      });
    });
  }

  private static async getReferenceData(date: string, lat: number, lng: number) {
    // Mock reference data - in production, integrate with ProKerala/Drik APIs
    return {
      tithi: { index: 5, name: 'Shukla Panchami' },
      nakshatra: { index: 10, name: 'Magha' },
      yoga: { index: 12, name: 'Vyaghata' },
      karana: { index: 3, name: 'Bava' },
      sunrise: '06:15',
      sunset: '18:30',
      moonrise: '12:45',
      moonset: '23:20'
    };
  }

  private static dateToJulianDay(date: Date, timezone: string): number {
    // Convert date to Julian Day with timezone consideration
    const utcDate = new Date(date.getTime() - (5.5 * 60 * 60 * 1000)); // IST offset
    const year = utcDate.getFullYear();
    const month = utcDate.getMonth() + 1;
    const day = utcDate.getDate();
    const hour = utcDate.getHours() + (utcDate.getMinutes() / 60);
    
    // Julian Day calculation
    const a = Math.floor((14 - month) / 12);
    const y = year + 4800 - a;
    const m = month + 12 * a - 3;
    
    return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045 + hour / 24;
  }

  private static calculateLahiriAyanamsa(jd: number): number {
    // Lahiri Ayanamsa calculation
    const T = (jd - 2451545.0) / 36525.0;
    return 23.85 + 0.396 * T; // Simplified formula
  }

  private static getTimeDifferenceMinutes(time1: string, time2: string): number {
    const [h1, m1] = time1.split(':').map(Number);
    const [h2, m2] = time2.split(':').map(Number);
    
    const minutes1 = h1 * 60 + m1;
    const minutes2 = h2 * 60 + m2;
    
    return Math.abs(minutes1 - minutes2);
  }

  private static calculateMoonPhase(moonLong: number, sunLong: number): number {
    const difference = ((moonLong - sunLong + 360) % 360);
    return difference / 12; // Convert to Tithi
  }

  private static calculateAyana(sunLongitude: number): string {
    // Sun longitude determines Ayana
    if (sunLongitude >= 270 || sunLongitude < 90) {
      return 'Uttarayana';
    } else {
      return 'Dakshinayana';
    }
  }

  /**
   * Daily QA Validation System
   */
  static async runDailyQAValidation(cities: string[] = ['Chennai', 'Delhi', 'Mumbai', 'Kolkata', 'Bangalore']) {
    const results = [];
    const today = new Date().toISOString().split('T')[0];
    
    for (const city of cities) {
      const coordinates = this.getCityCoordinates(city);
      const validation = await this.validatePanchangAccuracy(
        today,
        coordinates.latitude,
        coordinates.longitude
      );
      
      results.push({
        city,
        date: today,
        accuracy: validation.accuracy,
        issues: validation.mismatches,
        recommendations: validation.recommendations
      });
    }
    
    // Log results for monitoring
    console.log('Daily Panchang QA Results:', JSON.stringify(results, null, 2));
    
    return results;
  }

  private static getCityCoordinates(city: string) {
    const coordinates = {
      'Chennai': { latitude: 13.0827, longitude: 80.2707 },
      'Delhi': { latitude: 28.7041, longitude: 77.1025 },
      'Mumbai': { latitude: 19.0760, longitude: 72.8777 },
      'Kolkata': { latitude: 22.5726, longitude: 88.3639 },
      'Bangalore': { latitude: 12.9716, longitude: 77.5946 }
    };
    
    return coordinates[city] || coordinates['Chennai'];
  }
}

// Export validation function for API endpoints
export async function validatePanchangAccuracy(req: any, res: any) {
  try {
    const { date, latitude, longitude, timezone } = req.body;
    
    if (!date || !latitude || !longitude) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: date, latitude, longitude'
      });
    }
    
    const validation = await AccuratePanchangValidator.validatePanchangAccuracy(
      date,
      parseFloat(latitude),
      parseFloat(longitude),
      timezone || 'Asia/Kolkata'
    );
    
    res.json({
      success: true,
      validation,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Validation API error:', error);
    res.status(500).json({
      success: false,
      error: 'Validation failed',
      message: error.message
    });
  }
}
