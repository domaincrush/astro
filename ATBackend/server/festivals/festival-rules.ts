/**
 * Festival Rules and Detection System
 * Based on authentic Vedic calendar calculations
 */

export interface Festival {
  name: string;
  category: 'major' | 'minor' | 'fasting' | 'celebration' | 'regional';
  significance: string;
  observances: string[];
  restrictions?: string[];
}

export interface FestivalRule {
  name: string;
  type: 'tithi' | 'sankranti' | 'ekadashi' | 'combination' | 'lunar_eclipse' | 'solar_eclipse';
  condition: any;
  festival: Festival;
}

// Festival detection rules
export const FESTIVAL_RULES: FestivalRule[] = [
  // Ekadashi (11th Tithi)
  {
    name: 'Ekadashi',
    type: 'ekadashi',
    condition: { tithi: 11 },
    festival: {
      name: 'Ekadashi',
      category: 'fasting',
      significance: 'Fasting day dedicated to Lord Vishnu',
      observances: ['Fasting', 'Prayer', 'Meditation', 'Charity'],
      restrictions: ['Avoid grains', 'Avoid beans', 'Avoid heavy meals']
    }
  },
  
  // Amavasya (New Moon)
  {
    name: 'Amavasya',
    type: 'tithi',
    condition: { tithi: 30 },
    festival: {
      name: 'Amavasya',
      category: 'major',
      significance: 'New Moon day for ancestor worship',
      observances: ['Pitru Paksha rituals', 'Tarpanam', 'Charity'],
      restrictions: ['Avoid auspicious ceremonies', 'Avoid new ventures']
    }
  },
  
  // Purnima (Full Moon)
  {
    name: 'Purnima',
    type: 'tithi',
    condition: { tithi: 15 },
    festival: {
      name: 'Purnima',
      category: 'major',
      significance: 'Full Moon day for worship and celebration',
      observances: ['Satyanarayan Puja', 'Moon worship', 'Vratam'],
      restrictions: []
    }
  },
  
  // Pradosh Vrat (13th Tithi)
  {
    name: 'Pradosh',
    type: 'tithi',
    condition: { tithi: 13 },
    festival: {
      name: 'Pradosh Vrat',
      category: 'fasting',
      significance: 'Sacred to Lord Shiva',
      observances: ['Shiva worship', 'Evening prayers', 'Fasting'],
      restrictions: []
    }
  },
  
  // Chaturdashi (14th Tithi)
  {
    name: 'Chaturdashi',
    type: 'tithi',
    condition: { tithi: 14 },
    festival: {
      name: 'Chaturdashi',
      category: 'minor',
      significance: 'Preparatory day for major observances',
      observances: ['Preparation for next day', 'Light worship'],
      restrictions: []
    }
  },
  
  // Sankranti (Sun's transition)
  {
    name: 'Sankranti',
    type: 'sankranti',
    condition: { sun_transition: true },
    festival: {
      name: 'Sankranti',
      category: 'major',
      significance: 'Sun enters new zodiac sign',
      observances: ['Sun worship', 'Charity', 'Holy bath'],
      restrictions: []
    }
  },
  
  // Makar Sankranti (specific date)
  {
    name: 'Makar_Sankranti',
    type: 'combination',
    condition: { month: 1, date: 14 }, // January 14
    festival: {
      name: 'Makar Sankranti',
      category: 'major',
      significance: 'Sun enters Capricorn - harvest festival',
      observances: ['Kite flying', 'Til-gud distribution', 'Holy bath', 'Sun worship'],
      restrictions: []
    }
  },
  
  // Regional festivals based on lunar month and tithi combinations
  {
    name: 'Krishna_Janmashtami',
    type: 'combination',
    condition: { lunar_month: 'Bhadrapada', tithi: 8, paksha: 'Krishna' },
    festival: {
      name: 'Krishna Janmashtami',
      category: 'major',
      significance: 'Birth of Lord Krishna',
      observances: ['Fasting until midnight', 'Krishna worship', 'Devotional singing'],
      restrictions: ['Avoid non-vegetarian food', 'Avoid alcohol']
    }
  },
  
  {
    name: 'Ganesh_Chaturthi',
    type: 'combination',
    condition: { lunar_month: 'Bhadrapada', tithi: 4, paksha: 'Shukla' },
    festival: {
      name: 'Ganesh Chaturthi',
      category: 'major',
      significance: 'Birth of Lord Ganesha',
      observances: ['Ganesha worship', 'Modak offering', 'Community celebrations'],
      restrictions: []
    }
  },
  
  {
    name: 'Diwali',
    type: 'combination',
    condition: { lunar_month: 'Kartika', tithi: 30, paksha: 'Krishna' },
    festival: {
      name: 'Diwali',
      category: 'major',
      significance: 'Festival of Lights',
      observances: ['Lakshmi Puja', 'Light lamps', 'Fireworks', 'Sweets distribution'],
      restrictions: []
    }
  }
];

/**
 * Detect festivals based on current Panchang data
 */
export function detectFestivals(
  tithiNumber: number,
  paksha: string,
  lunarMonth: string,
  currentDate: Date,
  sunLongitude: number,
  previousSunLongitude: number
): Festival[] {
  const festivals: Festival[] = [];
  
  // Check Tithi-based festivals
  FESTIVAL_RULES.forEach(rule => {
    if (rule.type === 'tithi' && rule.condition.tithi === tithiNumber) {
      festivals.push(rule.festival);
    }
    
    if (rule.type === 'ekadashi' && tithiNumber === 11) {
      // Distinguish between different Ekadashis
      const ekadashiName = getEkadashiName(lunarMonth, paksha);
      festivals.push({
        ...rule.festival,
        name: ekadashiName
      });
    }
    
    if (rule.type === 'combination') {
      // Check complex combinations
      if (rule.condition.lunar_month === lunarMonth && 
          rule.condition.tithi === tithiNumber && 
          rule.condition.paksha === paksha) {
        festivals.push(rule.festival);
      }
      
      // Check Gregorian date combinations
      if (rule.condition.month && rule.condition.date) {
        if (currentDate.getMonth() + 1 === rule.condition.month && 
            currentDate.getDate() === rule.condition.date) {
          festivals.push(rule.festival);
        }
      }
    }
    
    if (rule.type === 'sankranti') {
      // Check if Sun has changed zodiac sign
      const currentSign = Math.floor(sunLongitude / 30);
      const previousSign = Math.floor(previousSunLongitude / 30);
      
      if (currentSign !== previousSign) {
        const sankrantiName = getSankrantiName(currentSign);
        festivals.push({
          ...rule.festival,
          name: sankrantiName
        });
      }
    }
  });
  
  return festivals;
}

/**
 * Get specific Ekadashi name based on lunar month and paksha
 */
function getEkadashiName(lunarMonth: string, paksha: string): string {
  const ekadashiNames: Record<string, { shukla: string; krishna: string }> = {
    'Chaitra': { shukla: 'Kamada Ekadashi', krishna: 'Papmochani Ekadashi' },
    'Vaishakha': { shukla: 'Varuthini Ekadashi', krishna: 'Mohini Ekadashi' },
    'Jyeshta': { shukla: 'Apara Ekadashi', krishna: 'Nirjala Ekadashi' },
    'Ashadha': { shukla: 'Devshayani Ekadashi', krishna: 'Kamika Ekadashi' },
    'Shravana': { shukla: 'Putrada Ekadashi', krishna: 'Aja Ekadashi' },
    'Bhadrapada': { shukla: 'Parsva Ekadashi', krishna: 'Indira Ekadashi' },
    'Ashwina': { shukla: 'Papankusha Ekadashi', krishna: 'Rama Ekadashi' },
    'Kartika': { shukla: 'Devutthana Ekadashi', krishna: 'Utpanna Ekadashi' },
    'Margashirsha': { shukla: 'Mokshada Ekadashi', krishna: 'Sapala Ekadashi' },
    'Pausha': { shukla: 'Putrada Ekadashi', krishna: 'Shattila Ekadashi' },
    'Magha': { shukla: 'Jaya Ekadashi', krishna: 'Vijaya Ekadashi' },
    'Phalguna': { shukla: 'Amalaki Ekadashi', krishna: 'Papamochani Ekadashi' }
  };
  
  const monthNames = ekadashiNames[lunarMonth];
  if (monthNames) {
    return paksha === 'Shukla' ? monthNames.shukla : monthNames.krishna;
  }
  
  return `${paksha} Ekadashi`;
}

/**
 * Get Sankranti name based on zodiac sign
 */
function getSankrantiName(signNumber: number): string {
  const sankrantiNames = [
    'Mesha Sankranti', 'Vrishabha Sankranti', 'Mithuna Sankranti',
    'Karka Sankranti', 'Simha Sankranti', 'Kanya Sankranti',
    'Tula Sankranti', 'Vrischika Sankranti', 'Dhanu Sankranti',
    'Makar Sankranti', 'Kumbha Sankranti', 'Meena Sankranti'
  ];
  
  return sankrantiNames[signNumber] || 'Sankranti';
}

/**
 * Check if current day has any special restrictions
 */
export function getDayRestrictions(festivals: Festival[]): string[] {
  const restrictions: string[] = [];
  
  festivals.forEach(festival => {
    if (festival.restrictions) {
      restrictions.push(...festival.restrictions);
    }
  });
  
  return [...new Set(restrictions)]; // Remove duplicates
}

/**
 * Get recommended observances for the day
 */
export function getDayObservances(festivals: Festival[]): string[] {
  const observances: string[] = [];
  
  festivals.forEach(festival => {
    observances.push(...festival.observances);
  });
  
  return [...new Set(observances)]; // Remove duplicates
}