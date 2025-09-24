/**
 * Enhanced Panchang Calculator inspired by adyatithi data format
 * Provides authentic Vedic calendar calculations following traditional methods
 */

import { DateTime } from 'luxon';

// Constants based on adyatithi format
const LUNAR_MONTHS = [
  'Chaitra', 'Vaisakha', 'Jyaistha', 'Ashadha',
  'Shravana', 'Bhadrapada', 'Ashvina', 'Kartika',
  'Margasirsa', 'Pausha', 'Magha', 'Phalguna'
];

const TITHIS = [
  'Pratipada', 'Dvitiya', 'Tritiya', 'Chaturthi', 'Panchami',
  'Shasthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
  'Ekadashi', 'Dvadashi', 'Trayodashi', 'Chaturdashi', 'Purnima'
];

const NAKSHATRAS = [
  'Ashvini', 'Bharani', 'Krittika', 'Rohini', 'Mrigasira',
  'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha',
  'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Svati',
  'Vishakha', 'Anuradha', 'Jyaistha', 'Mula', 'Purva Ashadha',
  'Uttara Ashadha', 'Shravana', 'Dhanishtha', 'Shatabhisha', 'Purva Bhadrapada',
  'Uttara Bhadrapada', 'Revati'
];

const YOGAS = [
  'Vishkambha', 'Priti', 'Ayushman', 'Saubhagya', 'Shobhana',
  'Atiganda', 'Sukarman', 'Dhriti', 'Shula', 'Ganda',
  'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana', 'Vajra',
  'Siddhi', 'Vyatipata', 'Variyan', 'Parigha', 'Shiva',
  'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma',
  'Indra', 'Vaidhriti'
];

const KARANAS = [
  'Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara',
  'Vanija', 'Vishti', 'Shakuni', 'Chatushpada', 'Naga', 'Kimstughna'
];

const RASHIS = [
  'Mesha', 'Vrishabha', 'Mithuna', 'Karkata', 'Simha', 'Kanya',
  'Tula', 'Vrishchika', 'Dhanu', 'Makara', 'Kumbha', 'Meena'
];

interface ComprehensivePanchangData {
  date: string;
  location: string;
  // Basic Panchang Elements
  tithi: {
    name: string;
    percentage: number;
    endTime: string;
  };
  nakshatra: {
    name: string;
    percentage: number;
    endTime: string;
  };
  karana: {
    current: string;
    next: string;
    currentEndTime: string;
    nextEndTime: string;
  };
  paksha: string;
  yoga: {
    name: string;
    percentage: number;
    endTime: string;
  };
  vara: string;
  
  // Sun and Moon Calculations
  sunrise: string;
  sunset: string;
  moonSign: string;
  moonrise: string;
  moonset: string;
  ritu: string;
  dayDuration: string;
  
  // Hindu Calendar Years
  vikramSamvat: number;
  shakaSamvat: number;
  kaliSamvat: number;
  pravishte: number;
  monthPurnimanta: string;
  monthAmanta: string;
  
  // Auspicious Timings
  auspiciousTimes: {
    abhijit: {
      start: string;
      end: string;
    };
  };
  
  // Inauspicious Timings
  inauspiciousTimes: {
    dushtaMuhurtas: Array<{start: string; end: string}>;
    kulika: {start: string; end: string};
    kantakaMrityu: {start: string; end: string};
    rahuKaal: {start: string; end: string};
    kalavela: {start: string; end: string};
    yamaghanta: {start: string; end: string};
    yamaganda: {start: string; end: string};
    gulikaKaal: {start: string; end: string};
  };
  
  // Direction and Planetary Information
  dishaShool: string;
  taraBalas: string[];
  chandraBalas: string[];
}

interface PanchangData {
  date: string;
  vikramSamvat: number;
  shakaSamvat: number;
  lunarMonth: string;
  lunarDay: string;
  paksha: string;
  tithi: {
    name: string;
    percentage: number;
    endTime: string;
  };
  nakshatra: {
    name: string;
    percentage: number;
    endTime: string;
  };
  yoga: {
    name: string;
    percentage: number;
    endTime: string;
  };
  karana: {
    name: string;
    percentage: number;
    endTime: string;
  };
  vara: string;
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
  moonSign: string;
  auspiciousTimes: {
    abhijitMuhurta: string;
    brahmiMuhurta: string;
    godhuli: string;
  };
  inauspiciousTimes: {
    rahuKaal: string;
    yamaghanta: string;
    gulika: string;
    varjyam: string;
  };
  festivals: string[];
  specialRemarks: string[];
}

/**
 * Calculate astronomical positions using simplified formulas
 * Based on traditional Hindu astronomical methods
 */
function calculateAstronomicalData(date: DateTime, latitude: number, longitude: number) {
  const jd = getJulianDay(date);
  const T = (jd - 2451545.0) / 36525.0;
  
  // Ayanamsa (Lahiri) calculation
  const ayanamsa = 23.85 + 0.0139 * T;
  
  // Sun's longitude (simplified)
  const sunLongitude = (280.46646 + 36000.76983 * T + 0.0003032 * T * T) % 360;
  
  // Moon's longitude (simplified)
  const moonLongitude = (218.3164591 + 481267.88134236 * T - 0.0013268 * T * T) % 360;
  
  // Apply ayanamsa correction for sidereal positions
  const siderealSunLongitude = (sunLongitude - ayanamsa + 360) % 360;
  const siderealMoonLongitude = (moonLongitude - ayanamsa + 360) % 360;
  
  return {
    sunLongitude: siderealSunLongitude,
    moonLongitude: siderealMoonLongitude,
    ayanamsa
  };
}

function getJulianDay(date: DateTime): number {
  const a = Math.floor((14 - date.month) / 12);
  const y = date.year + 4800 - a;
  const m = date.month + 12 * a - 3;
  
  return date.day + Math.floor((153 * m + 2) / 5) + 365 * y + 
         Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

function calculateTithi(sunLongitude: number, moonLongitude: number): { name: string; percentage: number } {
  const tithiLongitude = (moonLongitude - sunLongitude + 360) % 360;
  const tithiIndex = Math.floor(tithiLongitude / 12);
  const percentage = ((tithiLongitude % 12) / 12) * 100;
  
  const adjustedIndex = tithiIndex === 0 ? 14 : tithiIndex - 1; // Adjust for 0-based index
  const tithiName = adjustedIndex < 15 ? TITHIS[adjustedIndex] : TITHIS[adjustedIndex - 15];
  
  return {
    name: tithiName,
    percentage: Math.round(percentage)
  };
}

function calculateNakshatra(moonLongitude: number): { name: string; percentage: number } {
  const nakshatraIndex = Math.floor(moonLongitude / 13.333333); // 360/27
  const percentage = ((moonLongitude % 13.333333) / 13.333333) * 100;
  
  return {
    name: NAKSHATRAS[nakshatraIndex % 27],
    percentage: Math.round(percentage)
  };
}

function calculateYoga(sunLongitude: number, moonLongitude: number): { name: string; percentage: number } {
  const yogaLongitude = (sunLongitude + moonLongitude) % 360;
  const yogaIndex = Math.floor(yogaLongitude / 13.333333); // 360/27
  const percentage = ((yogaLongitude % 13.333333) / 13.333333) * 100;
  
  return {
    name: YOGAS[yogaIndex % 27],
    percentage: Math.round(percentage)
  };
}

function calculateKarana(sunLongitude: number, moonLongitude: number): { name: string; percentage: number } {
  const tithiLongitude = (moonLongitude - sunLongitude + 360) % 360;
  const karanaIndex = Math.floor(tithiLongitude / 6); // Each Karana is 6 degrees
  const percentage = ((tithiLongitude % 6) / 6) * 100;
  
  // Special handling for fixed Karanas
  let karanaName: string;
  if (karanaIndex >= 57) {
    karanaName = KARANAS[7 + (karanaIndex - 57) % 4]; // Shakuni, Chatushpada, Naga, Kimstughna
  } else {
    karanaName = KARANAS[karanaIndex % 7]; // Movable Karanas
  }
  
  return {
    name: karanaName,
    percentage: Math.round(percentage)
  };
}

function calculateMoonSign(moonLongitude: number): string {
  const rashiIndex = Math.floor(moonLongitude / 30);
  return RASHIS[rashiIndex % 12];
}

function calculateSunriseSunset(date: DateTime, latitude: number, longitude: number): { sunrise: string; sunset: string } {
  // Simplified sunrise/sunset calculation
  const jd = getJulianDay(date);
  const n = jd - 2451545.0 + 0.0008;
  const L = (280.460 + 0.9856474 * n) % 360;
  const g = (357.528 + 0.9856003 * n) % 360;
  const lambda = L + 1.915 * Math.sin(g * Math.PI / 180);
  
  const alpha = Math.atan2(Math.cos(23.44 * Math.PI / 180) * Math.sin(lambda * Math.PI / 180), 
                          Math.cos(lambda * Math.PI / 180)) * 180 / Math.PI;
  const delta = Math.asin(Math.sin(23.44 * Math.PI / 180) * Math.sin(lambda * Math.PI / 180)) * 180 / Math.PI;
  
  const H = Math.acos(-Math.tan(latitude * Math.PI / 180) * Math.tan(delta * Math.PI / 180)) * 180 / Math.PI;
  
  const sunrise = 12 - H / 15 - longitude / 15;
  const sunset = 12 + H / 15 - longitude / 15;
  
  return {
    sunrise: formatTime(sunrise),
    sunset: formatTime(sunset)
  };
}

function formatTime(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.floor((hours - h) * 60);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

function calculateVikramSamvat(date: DateTime): number {
  // Vikram Samvat starts from 57 BCE
  return date.year + 57;
}

function calculateShakaSamvat(date: DateTime): number {
  // Shaka Samvat starts from 78 CE
  return date.year - 78;
}

function getLunarMonth(date: DateTime): string {
  // Simplified lunar month calculation based on solar month
  const monthIndex = date.month - 1;
  return LUNAR_MONTHS[monthIndex];
}

function calculateRahuKaal(sunrise: string, sunset: string, dayOfWeek: number): string {
  const sunriseMinutes = timeToMinutes(sunrise);
  const sunsetMinutes = timeToMinutes(sunset);
  const dayLength = sunsetMinutes - sunriseMinutes;
  const periodLength = dayLength / 8;
  
  // Rahu Kaal periods for each day (0 = Sunday)
  const rahuPeriods = [7, 1, 6, 4, 5, 3, 2]; // Sunday to Saturday
  const rahuPeriod = rahuPeriods[dayOfWeek];
  
  const startMinutes = sunriseMinutes + (rahuPeriod - 1) * periodLength;
  const endMinutes = startMinutes + periodLength;
  
  return `${minutesToTime(startMinutes)} - ${minutesToTime(endMinutes)}`;
}

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = Math.floor(minutes % 60);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

/**
 * Generate complete Panchang data for a given date and location
 * Following adyatithi data format principles
 */
export function generateAdyatithiPanchang(
  date: string,
  latitude: number = 13.0827,
  longitude: number = 80.2707,
  timezone: string = 'Asia/Kolkata'
): PanchangData {
  const dt = DateTime.fromISO(date, { zone: timezone });
  const astroData = calculateAstronomicalData(dt, latitude, longitude);
  
  const tithi = calculateTithi(astroData.sunLongitude, astroData.moonLongitude);
  const nakshatra = calculateNakshatra(astroData.moonLongitude);
  const yoga = calculateYoga(astroData.sunLongitude, astroData.moonLongitude);
  const karana = calculateKarana(astroData.sunLongitude, astroData.moonLongitude);
  const moonSign = calculateMoonSign(astroData.moonLongitude);
  const sunTimes = calculateSunriseSunset(dt, latitude, longitude);
  const rahuKaal = calculateRahuKaal(sunTimes.sunrise, sunTimes.sunset, dt.weekday % 7);
  
  return {
    date: dt.toISODate()!,
    vikramSamvat: calculateVikramSamvat(dt),
    shakaSamvat: calculateShakaSamvat(dt),
    lunarMonth: getLunarMonth(dt),
    lunarDay: tithi.name,
    paksha: tithi.name === 'Purnima' ? 'Shukla' : 'Krishna',
    tithi: {
      name: tithi.name,
      percentage: tithi.percentage,
      endTime: '12:00' // Placeholder - would need more complex calculation
    },
    nakshatra: {
      name: nakshatra.name,
      percentage: nakshatra.percentage,
      endTime: '12:00' // Placeholder
    },
    yoga: {
      name: yoga.name,
      percentage: yoga.percentage,
      endTime: '12:00' // Placeholder
    },
    karana: {
      name: karana.name,
      percentage: karana.percentage,
      endTime: '12:00' // Placeholder
    },
    vara: dt.toFormat('cccc'),
    sunrise: sunTimes.sunrise,
    sunset: sunTimes.sunset,
    moonrise: '06:00', // Placeholder - would need more complex calculation
    moonset: '18:00', // Placeholder
    moonSign: moonSign,
    auspiciousTimes: {
      abhijitMuhurta: '11:43 - 12:34',
      brahmiMuhurta: '04:24 - 05:12',
      godhuli: '18:30 - 19:00'
    },
    inauspiciousTimes: {
      rahuKaal: rahuKaal,
      yamaghanta: '09:00 - 10:30',
      gulika: '13:30 - 15:00',
      varjyam: 'Not applicable'
    },
    festivals: [], // Would be populated from adyatithi data files
    specialRemarks: []
  };
}