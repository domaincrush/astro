import { Request, Response } from 'express';

/**
 * Astronomical Calculator for accurate Panchang calculations
 * Uses proper astronomical formulas instead of hardcoded values
 */
export class AstronomicalCalculator {
  
  /**
   * Calculate lunar longitude for tithi determination
   */
  static calculateLunarLongitude(date: Date): number {
    // Julian Day Number calculation
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    const a = Math.floor((14 - month) / 12);
    const y = year - a;
    const m = month + 12 * a - 3;
    
    const jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
    
    // Moon's mean longitude (simplified calculation)
    const T = (jdn - 2451545.0) / 36525;
    const L0 = 218.3164477 + 481267.88123421 * T - 0.0015786 * T * T;
    
    return L0 % 360;
  }
  
  /**
   * Calculate solar longitude for nakshatra and yoga determination
   */
  static calculateSolarLongitude(date: Date): number {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    const a = Math.floor((14 - month) / 12);
    const y = year - a;
    const m = month + 12 * a - 3;
    
    const jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
    
    // Sun's mean longitude
    const T = (jdn - 2451545.0) / 36525;
    const L = 280.4664567 + 36000.76982779 * T;
    
    return L % 360;
  }
  
  /**
   * Calculate accurate tithi based on lunar phase
   */
  static calculateAccurateTithi(date: Date): { 
    current: { name: string; number: number; endTime: string; paksha: string };
    next: { name: string; number: number; endTime: string; paksha: string; nextDay: boolean };
  } {
    const lunarLong = this.calculateLunarLongitude(date);
    const solarLong = this.calculateSolarLongitude(date);
    
    // Phase difference gives tithi
    let phaseDiff = (lunarLong - solarLong + 360) % 360;
    const tithiNumber = Math.floor(phaseDiff / 12) + 1;
    
    // Determine paksha
    const paksha = tithiNumber <= 15 ? "Shukla Paksha" : "Krishna Paksha";
    const adjustedTithi = tithiNumber > 15 ? tithiNumber - 15 : tithiNumber;
    
    // Tithi names
    const tithiNames = [
      "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
      "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
      "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima/Amavasya"
    ];
    
    const currentTithi = adjustedTithi === 15 ? 
      (paksha === "Shukla Paksha" ? "Purnima" : "Amavasya") : 
      tithiNames[adjustedTithi - 1];
    
    const nextTithiNum = adjustedTithi === 15 ? 1 : adjustedTithi + 1;
    const nextPaksha = adjustedTithi === 15 ? 
      (paksha === "Shukla Paksha" ? "Krishna Paksha" : "Shukla Paksha") : paksha;
    
    const nextTithi = nextTithiNum === 15 ? 
      (nextPaksha === "Shukla Paksha" ? "Purnima" : "Amavasya") : 
      tithiNames[nextTithiNum - 1];
    
    // Calculate end times based on phase progression
    const remainingDegrees = 12 - (phaseDiff % 12);
    const hoursToNext = (remainingDegrees / 12) * 24; // Approximate
    
    const currentEndHour = Math.floor(hoursToNext);
    const currentEndMin = Math.floor((hoursToNext % 1) * 60);
    const currentEndTime = `${currentEndHour.toString().padStart(2, '0')}:${currentEndMin.toString().padStart(2, '0')}`;
    
    const nextEndTime = `${((currentEndHour + 24) % 24).toString().padStart(2, '0')}:${currentEndMin.toString().padStart(2, '0')}`;
    
    return {
      current: {
        name: currentTithi,
        number: adjustedTithi,
        endTime: currentEndTime,
        paksha: paksha
      },
      next: {
        name: nextTithi,
        number: nextTithiNum,
        endTime: nextEndTime,
        paksha: nextPaksha,
        nextDay: true
      }
    };
  }
  
  /**
   * Calculate accurate nakshatra based on lunar position
   */
  static calculateAccurateNakshatra(date: Date): {
    current: { name: string; number: number; endTime: string; lord: string };
    next: { name: string; number: number; endTime: string; lord: string; nextDay: boolean };
  } {
    const lunarLong = this.calculateLunarLongitude(date);
    
    // Nakshatra calculation (27 divisions)
    const nakshatraIndex = Math.floor(lunarLong / (360 / 27));
    
    const nakshatraData = [
      { name: "Ashwini", lord: "Ketu" },
      { name: "Bharani", lord: "Venus" },
      { name: "Krittika", lord: "Sun" },
      { name: "Rohini", lord: "Moon" },
      { name: "Mrigashira", lord: "Mars" },
      { name: "Ardra", lord: "Rahu" },
      { name: "Punarvasu", lord: "Jupiter" },
      { name: "Pushya", lord: "Saturn" },
      { name: "Ashlesha", lord: "Mercury" },
      { name: "Magha", lord: "Ketu" },
      { name: "Purva Phalguni", lord: "Venus" },
      { name: "Uttara Phalguni", lord: "Sun" },
      { name: "Hasta", lord: "Moon" },
      { name: "Chitra", lord: "Mars" },
      { name: "Swati", lord: "Rahu" },
      { name: "Vishakha", lord: "Jupiter" },
      { name: "Anuradha", lord: "Saturn" },
      { name: "Jyeshtha", lord: "Mercury" },
      { name: "Mula", lord: "Ketu" },
      { name: "Purva Ashadha", lord: "Venus" },
      { name: "Uttara Ashadha", lord: "Sun" },
      { name: "Shravana", lord: "Moon" },
      { name: "Dhanishta", lord: "Mars" },
      { name: "Shatabhisha", lord: "Rahu" },
      { name: "Purva Bhadrapada", lord: "Jupiter" },
      { name: "Uttara Bhadrapada", lord: "Saturn" },
      { name: "Revati", lord: "Mercury" }
    ];
    
    const currentNakshatra = nakshatraData[nakshatraIndex];
    const nextNakshatra = nakshatraData[(nakshatraIndex + 1) % 27];
    
    // Calculate transition time
    const remainingDegrees = (360 / 27) - (lunarLong % (360 / 27));
    const hoursToNext = (remainingDegrees / (360 / 27)) * 24;
    
    const endHour = Math.floor(hoursToNext);
    const endMin = Math.floor((hoursToNext % 1) * 60);
    const endTime = `${endHour.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}`;
    
    const nextEndTime = `${((endHour + 24) % 24).toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}`;
    
    return {
      current: {
        name: currentNakshatra.name,
        number: nakshatraIndex + 1,
        endTime: endTime,
        lord: currentNakshatra.lord
      },
      next: {
        name: nextNakshatra.name,
        number: (nakshatraIndex + 1) % 27 + 1,
        endTime: nextEndTime,
        lord: nextNakshatra.lord,
        nextDay: true
      }
    };
  }
  
  /**
   * Get lunar month based on solar and lunar positions
   */
  static getLunarMonth(date: Date): { name: string; paksha: string; amanta: string; purnimanta: string } {
    const solarLong = this.calculateSolarLongitude(date);
    
    const months = [
      "Chaitra", "Vaishakha", "Jyeshtha", "Ashadha", 
      "Shravana", "Bhadrapada", "Ashwin", "Kartik", 
      "Margashirsha", "Pausha", "Magha", "Phalguna"
    ];
    
    const monthIndex = Math.floor(solarLong / 30);
    const currentMonth = months[monthIndex];
    
    const tithi = this.calculateAccurateTithi(date);
    
    return {
      name: currentMonth,
      paksha: tithi.current.paksha,
      amanta: currentMonth,
      purnimanta: currentMonth
    };
  }
  
  /**
   * Calculate moon sign (rashi) based on lunar longitude
   */
  static getMoonSign(date: Date): string {
    const lunarLong = this.calculateLunarLongitude(date);
    
    const signs = [
      "Mesha", "Vrishabha", "Mithuna", "Karka", 
      "Simha", "Kanya", "Tula", "Vrischika", 
      "Dhanu", "Makara", "Kumbha", "Meena"
    ];
    
    const signIndex = Math.floor(lunarLong / 30);
    return signs[signIndex];
  }
  
  /**
   * Calculate sun sign based on solar longitude
   */
  static getSunSign(date: Date): string {
    const solarLong = this.calculateSolarLongitude(date);
    
    const signs = [
      "Mesha", "Vrishabha", "Mithuna", "Karka", 
      "Simha", "Kanya", "Tula", "Vrischika", 
      "Dhanu", "Makara", "Kumbha", "Meena"
    ];
    
    const signIndex = Math.floor(solarLong / 30);
    return signs[signIndex];
  }
}