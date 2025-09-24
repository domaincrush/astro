/**
 * Enhanced Karana Calculator with dual Karana support per Tithi
 * Based on authentic Vedic astronomy principles
 */

export interface KaranaInfo {
  name: string;
  number: number;
  type: 'movable' | 'fixed';
  deity: string;
  characteristics: string;
}

export interface KaranaPeriod {
  karana: KaranaInfo;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export interface EnhancedKaranaData {
  current: KaranaPeriod;
  next?: KaranaPeriod;
  third?: KaranaPeriod;
  sequence: KaranaPeriod[];
}

// 11 Karanas (7 movable + 4 fixed)
const KARANA_DATA: KaranaInfo[] = [
  { name: 'Bava', number: 1, type: 'movable', deity: 'Indra', characteristics: 'Favorable for travels and new ventures' },
  { name: 'Balava', number: 2, type: 'movable', deity: 'Brahma', characteristics: 'Good for learning and education' },
  { name: 'Kaulava', number: 3, type: 'movable', deity: 'Mitra', characteristics: 'Suitable for partnerships' },
  { name: 'Taitila', number: 4, type: 'movable', deity: 'Aryama', characteristics: 'Good for construction work' },
  { name: 'Gara', number: 5, type: 'movable', deity: 'Bhaga', characteristics: 'Favorable for agriculture' },
  { name: 'Vanija', number: 6, type: 'movable', deity: 'Twashta', characteristics: 'Good for business and trade' },
  { name: 'Vishti', number: 7, type: 'movable', deity: 'Vishnu', characteristics: 'Inauspicious, avoid important work' },
  { name: 'Shakuni', number: 8, type: 'fixed', deity: 'Kala', characteristics: 'Extremely inauspicious' },
  { name: 'Chatushpada', number: 9, type: 'fixed', deity: 'Twashta', characteristics: 'Inauspicious for most activities' },
  { name: 'Naga', number: 10, type: 'fixed', deity: 'Sarpa', characteristics: 'Dangerous, avoid travel' },
  { name: 'Kimstughna', number: 11, type: 'fixed', deity: 'Yama', characteristics: 'Very inauspicious' }
];

/**
 * Calculate Karana sequence with dual Karanas per Tithi
 * Each Tithi has 2 Karanas (except junction periods)
 */
export function calculateEnhancedKaranaData(
  currentTime: Date,
  moonLongitude: number,
  sunLongitude: number,
  moonRate: number,
  sunRate: number
): EnhancedKaranaData {
  
  // Calculate Moon-Sun angular difference
  let moonSunDiff = moonLongitude - sunLongitude;
  if (moonSunDiff < 0) moonSunDiff += 360;
  
  // Each Karana is 6 degrees (half a Tithi)
  const karanaAngle = 6;
  const currentKaranaIndex = Math.floor(moonSunDiff / karanaAngle);
  
  // Calculate which Karana in the cycle (60 Karanas total in lunar month)
  const cyclePosition = currentKaranaIndex % 60;
  
  // Determine actual Karana based on position
  let actualKaranaIndex: number;
  
  if (cyclePosition === 0) {
    // First Karana of month is always Kimstughna
    actualKaranaIndex = 10; // Kimstughna
  } else if (cyclePosition === 59) {
    // Last Karana of month is always Shakuni
    actualKaranaIndex = 7; // Shakuni
  } else {
    // Regular movable Karanas cycle through 1-7
    actualKaranaIndex = ((cyclePosition - 1) % 7);
  }
  
  const currentKarana = KARANA_DATA[actualKaranaIndex];
  
  // Calculate current Karana timing
  const karanaStartAngle = currentKaranaIndex * karanaAngle;
  const karanaEndAngle = karanaStartAngle + karanaAngle;
  
  // Calculate time boundaries
  const relativeRate = moonRate - sunRate; // Moon is faster
  const currentAngleInKarana = moonSunDiff - karanaStartAngle;
  const remainingAngle = karanaEndAngle - moonSunDiff;
  
  // Time calculations
  const timeToEnd = (remainingAngle / relativeRate) * 24 * 60; // minutes
  const timeFromStart = (currentAngleInKarana / relativeRate) * 24 * 60; // minutes
  
  const startTime = new Date(currentTime.getTime() - (timeFromStart * 60000));
  const endTime = new Date(currentTime.getTime() + (timeToEnd * 60000));
  
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-IN', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Kolkata'
    });
  };

  const currentKaranaPeriod: KaranaPeriod = {
    karana: currentKarana,
    startTime: formatTime(startTime),
    endTime: formatTime(endTime),
    isActive: true
  };

  // Calculate next Karana
  const nextKaranaIndex = (currentKaranaIndex + 1) % 60;
  let nextActualIndex: number;
  
  if (nextKaranaIndex === 0) {
    nextActualIndex = 10; // Kimstughna
  } else if (nextKaranaIndex === 59) {
    nextActualIndex = 7; // Shakuni
  } else {
    nextActualIndex = ((nextKaranaIndex - 1) % 7);
  }
  
  const nextKarana = KARANA_DATA[nextActualIndex];
  const nextStartTime = new Date(endTime.getTime());
  const nextEndTime = new Date(endTime.getTime() + (6 / relativeRate) * 24 * 60 * 60000);
  
  const nextKaranaPeriod: KaranaPeriod = {
    karana: nextKarana,
    startTime: formatTime(nextStartTime),
    endTime: formatTime(nextEndTime),
    isActive: false
  };

  // Calculate third Karana for better planning
  const thirdKaranaIndex = (currentKaranaIndex + 2) % 60;
  let thirdActualIndex: number;
  
  if (thirdKaranaIndex === 0) {
    thirdActualIndex = 10;
  } else if (thirdKaranaIndex === 59) {
    thirdActualIndex = 7;
  } else {
    thirdActualIndex = ((thirdKaranaIndex - 1) % 7);
  }
  
  const thirdKarana = KARANA_DATA[thirdActualIndex];
  const thirdStartTime = new Date(nextEndTime.getTime());
  const thirdEndTime = new Date(nextEndTime.getTime() + (6 / relativeRate) * 24 * 60 * 60000);
  
  const thirdKaranaPeriod: KaranaPeriod = {
    karana: thirdKarana,
    startTime: formatTime(thirdStartTime),
    endTime: formatTime(thirdEndTime),
    isActive: false
  };

  return {
    current: currentKaranaPeriod,
    next: nextKaranaPeriod,
    third: thirdKaranaPeriod,
    sequence: [currentKaranaPeriod, nextKaranaPeriod, thirdKaranaPeriod]
  };
}

/**
 * Check if current Karana is inauspicious
 */
export function isInauspiciousKarana(karanaName: string): boolean {
  const inauspiciousKaranas = ['Vishti', 'Shakuni', 'Chatushpada', 'Naga', 'Kimstughna'];
  return inauspiciousKaranas.includes(karanaName);
}