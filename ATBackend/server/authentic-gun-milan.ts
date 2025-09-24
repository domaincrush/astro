/**
 * Authentic Gun Milan (Ashtakoot Milan) Calculator
 * Based on traditional Vedic astrology principles using jyotisha library structure
 */

interface ChartData {
  moonSign: string;
  moonNakshatra: string;
  moonSignIndex: number;
  nakshatraIndex: number;
  varna: string;
  gana: string;
  yoni: string;
  nadi: string;
  moonRasiLord: string;
}

interface GunaResult {
  score: number;
  max: number;
  description: string;
}

interface GunMilanResult {
  totalScore: number;
  varna: GunaResult;
  vashya: GunaResult;
  tara: GunaResult;
  yoni: GunaResult;
  graha: GunaResult;
  gana: GunaResult;
  rashi: GunaResult;
  nadi: GunaResult;
}

// Varna hierarchy mapping
const VARNA_ORDER = ['Brahmin', 'Kshatriya', 'Vaishya', 'Shudra'];

// Gana classifications by nakshatra
const GANA_MAPPING: { [key: string]: string } = {
  'Ashwini': 'Deva', 'Bharani': 'Manushya', 'Krittika': 'Rakshasa',
  'Rohini': 'Manushya', 'Mrigashira': 'Deva', 'Ardra': 'Manushya',
  'Punarvasu': 'Deva', 'Pushya': 'Deva', 'Ashlesha': 'Rakshasa',
  'Magha': 'Rakshasa', 'Purva Phalguni': 'Manushya', 'Uttara Phalguni': 'Manushya',
  'Hasta': 'Deva', 'Chitra': 'Rakshasa', 'Swati': 'Deva',
  'Vishakha': 'Rakshasa', 'Anuradha': 'Deva', 'Jyeshtha': 'Rakshasa',
  'Mula': 'Rakshasa', 'Purva Ashadha': 'Manushya', 'Uttara Ashadha': 'Manushya',
  'Shravana': 'Deva', 'Dhanishta': 'Rakshasa', 'Shatabhisha': 'Rakshasa',
  'Purva Bhadrapada': 'Manushya', 'Uttara Bhadrapada': 'Manushya', 'Revati': 'Deva'
};

// Yoni animal mapping by nakshatra
const YONI_MAPPING: { [key: string]: string } = {
  'Ashwini': 'Horse', 'Bharani': 'Elephant', 'Krittika': 'Goat',
  'Rohini': 'Serpent', 'Mrigashira': 'Serpent', 'Ardra': 'Dog',
  'Punarvasu': 'Cat', 'Pushya': 'Goat', 'Ashlesha': 'Cat',
  'Magha': 'Rat', 'Purva Phalguni': 'Rat', 'Uttara Phalguni': 'Cow',
  'Hasta': 'Buffalo', 'Chitra': 'Tiger', 'Swati': 'Buffalo',
  'Vishakha': 'Tiger', 'Anuradha': 'Deer', 'Jyeshtha': 'Deer',
  'Mula': 'Dog', 'Purva Ashadha': 'Monkey', 'Uttara Ashadha': 'Mongoose',
  'Shravana': 'Monkey', 'Dhanishta': 'Lion', 'Shatabhisha': 'Horse',
  'Purva Bhadrapada': 'Lion', 'Uttara Bhadrapada': 'Cow', 'Revati': 'Elephant'
};

// Nadi classification by nakshatra
const NADI_MAPPING: { [key: string]: string } = {
  'Ashwini': 'Vata', 'Bharani': 'Pitta', 'Krittika': 'Kapha',
  'Rohini': 'Kapha', 'Mrigashira': 'Pitta', 'Ardra': 'Vata',
  'Punarvasu': 'Vata', 'Pushya': 'Pitta', 'Ashlesha': 'Kapha',
  'Magha': 'Kapha', 'Purva Phalguni': 'Pitta', 'Uttara Phalguni': 'Vata',
  'Hasta': 'Vata', 'Chitra': 'Pitta', 'Swati': 'Kapha',
  'Vishakha': 'Kapha', 'Anuradha': 'Pitta', 'Jyeshtha': 'Vata',
  'Mula': 'Vata', 'Purva Ashadha': 'Pitta', 'Uttara Ashadha': 'Kapha',
  'Shravana': 'Kapha', 'Dhanishta': 'Pitta', 'Shatabhisha': 'Vata',
  'Purva Bhadrapada': 'Vata', 'Uttara Bhadrapada': 'Pitta', 'Revati': 'Kapha'
};

// Varna classification by nakshatra
const VARNA_MAPPING: { [key: string]: string } = {
  'Ashwini': 'Vaishya', 'Bharani': 'Manushya', 'Krittika': 'Brahmin',
  'Rohini': 'Shudra', 'Mrigashira': 'Vaishya', 'Ardra': 'Shudra',
  'Punarvasu': 'Vaishya', 'Pushya': 'Kshatriya', 'Ashlesha': 'Vaishya',
  'Magha': 'Shudra', 'Purva Phalguni': 'Brahmin', 'Uttara Phalguni': 'Kshatriya',
  'Hasta': 'Vaishya', 'Chitra': 'Shudra', 'Swati': 'Shudra',
  'Vishakha': 'Vaishya', 'Anuradha': 'Shudra', 'Jyeshtha': 'Vaishya',
  'Mula': 'Kshatriya', 'Purva Ashadha': 'Brahmin', 'Uttara Ashadha': 'Kshatriya',
  'Shravana': 'Vaishya', 'Dhanishta': 'Vaishya', 'Shatabhisha': 'Shudra',
  'Purva Bhadrapada': 'Kshatriya', 'Uttara Bhadrapada': 'Kshatriya', 'Revati': 'Vaishya'
};

// Planetary friendship matrix (Sanskrit names - Vedic astrology)
const PLANETARY_FRIENDSHIP: { [key: string]: string[] } = {
  'Surya': ['Chandra', 'Mangal', 'Guru'],
  'Chandra': ['Surya', 'Budh'],
  'Mangal': ['Surya', 'Chandra', 'Guru'],
  'Budh': ['Surya', 'Shukra'],
  'Guru': ['Surya', 'Chandra', 'Mangal'],
  'Shukra': ['Budh', 'Shani'],
  'Shani': ['Budh', 'Shukra']
};

// Rasi lord mapping (Sanskrit names only - Vedic astrology)
const RASI_LORDS: { [key: string]: string } = {
  'Mesha': 'Mangal',
  'Vrishabha': 'Shukra',
  'Mithuna': 'Budh',
  'Karka': 'Chandra',
  'Simha': 'Surya',
  'Kanya': 'Budh',
  'Tula': 'Shukra',
  'Vrishchika': 'Mangal',
  'Dhanu': 'Guru',
  'Makara': 'Shani',
  'Kumbha': 'Shani',
  'Meena': 'Guru'
};

// Vashya relationship mapping (Sanskrit names only - Vedic astrology)
const VASHYA_MAPPING: { [key: string]: string[] } = {
  'Mesha': ['Simha', 'Vrishchika'],
  'Vrishabha': ['Karka', 'Tula'],
  'Mithuna': ['Kanya'],
  'Karka': ['Vrishchika', 'Dhanu'],
  'Simha': ['Tula'],
  'Kanya': ['Meena', 'Mithuna'],
  'Tula': ['Makara', 'Kanya'],
  'Vrishchika': ['Karka'],
  'Dhanu': ['Meena'],
  'Makara': ['Mesha', 'Kumbha'],
  'Kumbha': ['Mesha'],
  'Meena': ['Karka']
};

export function calculateAuthenticGunMilan(boyChart: ChartData, girlChart: ChartData): GunMilanResult {
  const results: GunMilanResult = {
    totalScore: 0,
    varna: calculateVarna(boyChart, girlChart),
    vashya: calculateVashya(boyChart, girlChart),
    tara: calculateTara(boyChart, girlChart),
    yoni: calculateYoni(boyChart, girlChart),
    graha: calculateGraha(boyChart, girlChart),
    gana: calculateGana(boyChart, girlChart),
    rashi: calculateRashi(boyChart, girlChart),
    nadi: calculateNadi(boyChart, girlChart)
  };

  results.totalScore = results.varna.score + results.vashya.score + results.tara.score + 
                      results.yoni.score + results.graha.score + results.gana.score + 
                      results.rashi.score + results.nadi.score;

  return results;
}

function calculateVarna(boy: ChartData, girl: ChartData): GunaResult {
  const boyVarna = VARNA_MAPPING[boy.moonNakshatra] || 'Vaishya';
  const girlVarna = VARNA_MAPPING[girl.moonNakshatra] || 'Vaishya';

  const boyIndex = VARNA_ORDER.indexOf(boyVarna);
  const girlIndex = VARNA_ORDER.indexOf(girlVarna);

  // Boy's varna should be equal or higher than girl's
  const score = boyIndex <= girlIndex ? 1 : 0;

  return {
    score,
    max: 1,
    description: score === 1 ? 
      `Compatible varna: Boy ${boyVarna}, Girl ${girlVarna}` : 
      `Incompatible varna: Boy ${boyVarna}, Girl ${girlVarna}`
  };
}

function calculateVashya(boy: ChartData, girl: ChartData): GunaResult {
  const boySign = boy.moonSign;
  const girlSign = girl.moonSign;

  // Authentic Vashya calculation with traditional categories
  const vashyaCategories: { [key: string]: string } = {
    'Mesha': 'Chatushpad', 'Vrishabha': 'Chatushpad', 'Mithuna': 'Vanch',
    'Karka': 'Jalachara', 'Simha': 'Vanch', 'Kanya': 'Vanch',
    'Tula': 'Chatushpad', 'Vrishchika': 'Jalachara', 'Dhanu': 'Chatushpad',
    'Makara': 'Vanch', 'Kumbha': 'Vanch', 'Meena': 'Jalachara',
    // English fallbacks
    'Aries': 'Chatushpad', 'Taurus': 'Chatushpad', 'Gemini': 'Vanch',
    'Cancer': 'Jalachara', 'Leo': 'Vanch', 'Virgo': 'Vanch',
    'Libra': 'Chatushpad', 'Scorpio': 'Jalachara', 'Sagittarius': 'Chatushpad',
    'Capricorn': 'Vanch', 'Aquarius': 'Vanch', 'Pisces': 'Jalachara'
  };

  const boyCategory = vashyaCategories[boySign] || 'Vanch';
  const girlCategory = vashyaCategories[girlSign] || 'Vanch';

  let score = 0;

  // Traditional Vashya scoring with partial points
  if (boySign === girlSign) {
    score = 2; // Same sign - full compatibility
  } else if (boyCategory === girlCategory) {
    score = 2; // Same category - full compatibility
  } else if (
    (boyCategory === 'Vanch' && girlCategory === 'Chatushpad') ||
    (boyCategory === 'Chatushpad' && girlCategory === 'Vanch')
  ) {
    score = 0.5; // Partial compatibility between Vanch and Chatushpad
  } else {
    score = 0; // No compatibility
  }

  return {
    score,
    max: 2,
    description: `Vashya: ${boyCategory} & ${girlCategory} (${score}/2)`
  };
}

function calculateTara(boy: ChartData, girl: ChartData): GunaResult {
  const boyNak = boy.nakshatraIndex || 0;
  const girlNak = girl.nakshatraIndex || 0;

  // Calculate tara position from girl's nakshatra to boy's nakshatra
  const taraDistance = ((boyNak - girlNak + 27) % 27) + 1;
  
  // Traditional Tara scoring matrix (1-27 positions)
  // Auspicious positions get higher scores
  const taraScoreMatrix: { [key: number]: number } = {
    1: 0,   // Janma (Birth) - inauspicious
    2: 3,   // Sampat (Wealth) - very auspicious
    3: 1.5, // Vipat (Danger) - moderately inauspicious  
    4: 3,   // Kshema (Well-being) - very auspicious
    5: 1.5, // Pratyari (Enemy) - moderately inauspicious
    6: 3,   // Sadhaka (Accomplisher) - very auspicious
    7: 1,   // Vadha (Destroyer) - inauspicious
    8: 3,   // Mitra (Friend) - very auspicious
    9: 3,   // Atimitra (Best Friend) - very auspicious
  };

  // Map distance to 9-position cycle
  const taraPosition = ((taraDistance - 1) % 9) + 1;
  let score = taraScoreMatrix[taraPosition] || 0;

  return {
    score,
    max: 3,
    description: `Tara compatibility: ${score}/3 (Position ${taraPosition})`
  };
}

function calculateYoni(boy: ChartData, girl: ChartData): GunaResult {
  const boyYoni = YONI_MAPPING[boy.moonNakshatra] || 'Horse';
  const girlYoni = YONI_MAPPING[girl.moonNakshatra] || 'Horse';

  // Yoni compatibility matrix
  const yoniCompatibility: { [key: string]: { [key: string]: number } } = {
    'Horse': { 'Horse': 4, 'Elephant': 2, 'Goat': 2, 'Serpent': 2, 'Dog': 2, 'Cat': 2, 'Rat': 2, 'Cow': 3, 'Buffalo': 2, 'Tiger': 1, 'Deer': 2, 'Monkey': 3, 'Mongoose': 2, 'Lion': 1 },
    'Elephant': { 'Elephant': 4, 'Horse': 2, 'Lion': 3, 'Monkey': 2, 'Rat': 0, 'others': 2 },
    'Goat': { 'Goat': 4, 'Monkey': 3, 'others': 2 },
    'Serpent': { 'Serpent': 4, 'Mongoose': 0, 'others': 2 },
    'Dog': { 'Dog': 4, 'Deer': 2, 'others': 2 },
    'Cat': { 'Cat': 4, 'Rat': 0, 'others': 2 },
    'Rat': { 'Rat': 4, 'Cat': 0, 'Elephant': 0, 'others': 2 },
    'Cow': { 'Cow': 4, 'Tiger': 0, 'others': 2 },
    'Buffalo': { 'Buffalo': 4, 'Tiger': 2, 'others': 2 },
    'Tiger': { 'Tiger': 4, 'Cow': 0, 'Deer': 1, 'others': 2 },
    'Deer': { 'Deer': 4, 'Tiger': 1, 'Dog': 2, 'others': 2 },
    'Monkey': { 'Monkey': 4, 'Goat': 3, 'others': 2 },
    'Mongoose': { 'Mongoose': 4, 'Serpent': 0, 'others': 2 },
    'Lion': { 'Lion': 4, 'Elephant': 3, 'Horse': 1, 'others': 2 }
  };

  const compatibility = yoniCompatibility[boyYoni]?.[girlYoni] ?? 
                       yoniCompatibility[boyYoni]?.['others'] ?? 2;

  return {
    score: compatibility,
    max: 4,
    description: `Yoni compatibility: ${boyYoni} & ${girlYoni} (${compatibility}/4)`
  };
}

function calculateGraha(boy: ChartData, girl: ChartData): GunaResult {
  console.log('=== GRAHA DEBUG START ===');
  console.log('Input data:', {
    boyMoonSign: boy.moonSign,
    girlMoonSign: girl.moonSign,
    boyRasiLord: boy.moonRasiLord,
    girlRasiLord: girl.moonRasiLord
  });

  // Use pre-calculated rasi lords first
  let boyLord = boy.moonRasiLord;
  let girlLord = girl.moonRasiLord;

  // If lords are missing, calculate from moon signs
  if (!boyLord || boyLord === 'undefined') {
    const universalLordMapping: { [key: string]: string } = {
      'Mesha': 'Mangal', 'Vrishabha': 'Shukra', 'Mithuna': 'Budh',
      'Karka': 'Chandra', 'Simha': 'Surya', 'Kanya': 'Budh',
      'Tula': 'Shukra', 'Vrishchika': 'Mangal', 'Dhanu': 'Guru',
      'Makara': 'Shani', 'Kumbha': 'Shani', 'Meena': 'Guru',
      'Aries': 'Mangal', 'Taurus': 'Shukra', 'Gemini': 'Budh',
      'Cancer': 'Chandra', 'Leo': 'Surya', 'Virgo': 'Budh',
      'Libra': 'Shukra', 'Scorpio': 'Mangal', 'Sagittarius': 'Guru',
      'Capricorn': 'Shani', 'Aquarius': 'Shani', 'Pisces': 'Guru'
    };
    boyLord = universalLordMapping[boy.moonSign] || 'Surya';
  }

  if (!girlLord || girlLord === 'undefined') {
    const universalLordMapping: { [key: string]: string } = {
      'Mesha': 'Mangal', 'Vrishabha': 'Shukra', 'Mithuna': 'Budh',
      'Karka': 'Chandra', 'Simha': 'Surya', 'Kanya': 'Budh',
      'Tula': 'Shukra', 'Vrishchika': 'Mangal', 'Dhanu': 'Guru',
      'Makara': 'Shani', 'Kumbha': 'Shani', 'Meena': 'Guru',
      'Aries': 'Mangal', 'Taurus': 'Shukra', 'Gemini': 'Budh',
      'Cancer': 'Chandra', 'Leo': 'Surya', 'Virgo': 'Budh',
      'Libra': 'Shukra', 'Scorpio': 'Mangal', 'Sagittarius': 'Guru',
      'Capricorn': 'Shani', 'Aquarius': 'Shani', 'Pisces': 'Guru'
    };
    girlLord = universalLordMapping[girl.moonSign] || 'Chandra';
  }

  console.log('Final lords:', { boyLord, girlLord });

  // If no Sanskrit match, try English names directly
  if (!boyLord && boy.moonSign) {
    const englishLords: { [key: string]: string } = {
      'Aries': 'Mangal', 'Taurus': 'Shukra', 'Gemini': 'Budh',
      'Cancer': 'Chandra', 'Leo': 'Surya', 'Virgo': 'Budh',
      'Libra': 'Shukra', 'Scorpio': 'Mangal', 'Sagittarius': 'Guru',
      'Capricorn': 'Shani', 'Aquarius': 'Shani', 'Pisces': 'Guru'
    };
    boyLord = englishLords[boy.moonSign];
  }

  if (!girlLord && girl.moonSign) {
    const englishLords: { [key: string]: string } = {
      'Aries': 'Mangal', 'Taurus': 'Shukra', 'Gemini': 'Budh',
      'Cancer': 'Chandra', 'Leo': 'Surya', 'Virgo': 'Budh',
      'Libra': 'Shukra', 'Scorpio': 'Mangal', 'Sagittarius': 'Guru',
      'Capricorn': 'Shani', 'Aquarius': 'Shani', 'Pisces': 'Guru'
    };
    girlLord = englishLords[girl.moonSign];
  }

  // Final fallback
  boyLord = boyLord || 'Surya';
  girlLord = girlLord || 'Chandra';

  const boyFriends = PLANETARY_FRIENDSHIP[boyLord] || [];
  const girlFriends = PLANETARY_FRIENDSHIP[girlLord] || [];

  console.log('Planetary friendships:', {
    boyLord,
    girlLord,
    boyFriends,
    girlFriends,
    boyIncludesGirl: boyFriends.includes(girlLord),
    girlIncludesBoy: girlFriends.includes(boyLord)
  });

  let score = 0;

  if (boyLord === girlLord) {
    score = 5; // Same lord
    console.log('Same lord - score 5');
  } else if (boyFriends.includes(girlLord) && girlFriends.includes(boyLord)) {
    score = 5; // Mutual friends
    console.log('Mutual friends - score 5');
  } else if (boyFriends.includes(girlLord) || girlFriends.includes(boyLord)) {
    score = 4; // One-way friendship
    console.log('One-way friendship - score 4');
  } else {
    score = 0; // Neutral or enemy
    console.log('Neutral or enemy - score 0');
  }

  console.log('=== GRAHA DEBUG END ===');

  return {
    score,
    max: 5,
    description: `Graha Maitri: ${boyLord} & ${girlLord} (${score}/5)`
  };
}

function calculateGana(boy: ChartData, girl: ChartData): GunaResult {
  const boyGana = GANA_MAPPING[boy.moonNakshatra] || 'Manushya';
  const girlGana = GANA_MAPPING[girl.moonNakshatra] || 'Manushya';

  let score = 0;

  if (boyGana === girlGana) {
    score = 6; // Same gana
  } else if ((boyGana === 'Deva' && girlGana === 'Manushya') ||
             (boyGana === 'Manushya' && girlGana === 'Deva')) {
    score = 6; // Deva-Manushya compatibility
  } else if ((boyGana === 'Manushya' && girlGana === 'Rakshasa') ||
             (boyGana === 'Rakshasa' && girlGana === 'Manushya')) {
    score = 0; // Manushya-Rakshasa incompatibility
  } else if ((boyGana === 'Deva' && girlGana === 'Rakshasa') ||
             (boyGana === 'Rakshasa' && girlGana === 'Deva')) {
    score = 0; // Deva-Rakshasa incompatibility
  }

  return {
    score,
    max: 6,
    description: `Gana compatibility: ${boyGana} & ${girlGana} (${score}/6)`
  };
}

function calculateRashi(boy: ChartData, girl: ChartData): GunaResult {
  console.log('=== RASHI/BHAKOOT DEBUG START ===');
  console.log('Input signs:', { boySign: boy.moonSign, girlSign: girl.moonSign });
  
  // Ensure we have valid moon sign indices
  let boySignIndex = boy.moonSignIndex;
  let girlSignIndex = girl.moonSignIndex;
  
  console.log('Initial indices:', { boySignIndex, girlSignIndex });
  
  // Fallback calculation if indices are missing
  if (boySignIndex === undefined || boySignIndex < 0) {
    const sanskritSignNames = ['Mesha', 'Vrishabha', 'Mithuna', 'Karka', 'Simha', 'Kanya', 
                               'Tula', 'Vrishchika', 'Dhanu', 'Makara', 'Kumbha', 'Meena'];
    boySignIndex = sanskritSignNames.indexOf(boy.moonSign);
    if (boySignIndex < 0) {
      // Try English names
      const englishToIndex: { [key: string]: number } = {
        'Aries': 0, 'Taurus': 1, 'Gemini': 2, 'Cancer': 3, 'Leo': 4, 'Virgo': 5,
        'Libra': 6, 'Scorpio': 7, 'Sagittarius': 8, 'Capricorn': 9, 'Aquarius': 10, 'Pisces': 11
      };
      boySignIndex = englishToIndex[boy.moonSign] || 0;
    }
  }
  
  if (girlSignIndex === undefined || girlSignIndex < 0) {
    const sanskritSignNames = ['Mesha', 'Vrishabha', 'Mithuna', 'Karka', 'Simha', 'Kanya', 
                               'Tula', 'Vrishchika', 'Dhanu', 'Makara', 'Kumbha', 'Meena'];
    girlSignIndex = sanskritSignNames.indexOf(girl.moonSign);
    if (girlSignIndex < 0) {
      // Try English names
      const englishToIndex: { [key: string]: number } = {
        'Aries': 0, 'Taurus': 1, 'Gemini': 2, 'Cancer': 3, 'Leo': 4, 'Virgo': 5,
        'Libra': 6, 'Scorpio': 7, 'Sagittarius': 8, 'Capricorn': 9, 'Aquarius': 10, 'Pisces': 11
      };
      girlSignIndex = englishToIndex[girl.moonSign] || 0;
    }
  }

  const signDiff = Math.abs(boySignIndex - girlSignIndex);
  const minDiff = Math.min(signDiff, 12 - signDiff);

  console.log('Calculations:', { signDiff, minDiff });

  let score = 0;

  // Authentic Bhakoot dosha check - Leo (4) to Capricorn (9) = 5th position
  // Traditional inauspicious positions: 2nd-12th, 6th-8th axis most critical
  // For Leo-Capricorn (5th position), this should be 0 points per AstroSage
  if (boySignIndex === girlSignIndex) {
    score = 0; // Same rashi
    console.log('Same rashi - score: 0');
  } else if ([2, 5, 6, 8, 9, 12].includes(minDiff)) {
    score = 0; // Bhakoot dosha - inauspicious combinations including 5th position
    console.log(`Bhakoot dosha detected (position ${minDiff}) - score: 0`);
  } else {
    score = 7; // Good rashi compatibility
    console.log(`Good compatibility (position ${minDiff}) - score: 7`);
  }

  console.log('Final Rashi score:', score);
  console.log('=== RASHI/BHAKOOT DEBUG END ===');

  return {
    score,
    max: 7,
    description: `Rashi compatibility: ${boy.moonSign} & ${girl.moonSign} (${score}/7)`
  };
}

function calculateNadi(boy: ChartData, girl: ChartData): GunaResult {
  const boyNadi = NADI_MAPPING[boy.moonNakshatra] || 'Vata';
  const girlNadi = NADI_MAPPING[girl.moonNakshatra] || 'Vata';

  const score = boyNadi !== girlNadi ? 8 : 0;

  return {
    score,
    max: 8,
    description: `Nadi compatibility: ${boyNadi} & ${girlNadi} (${score}/8)`
  };
}

export function getChartDataFromJyotisha(chart: any): ChartData {
  console.log('=== CHART DATA CONVERSION DEBUG ===');
  console.log('Input chart object:', {
    moonSign: chart.moonSign,
    moonNakshatra: chart.moonNakshatra,
    moonRasiLord: chart.moonRasiLord,
    gana: chart.gana
  });

  // Extract data from jyotisha chart object
  const moonSign = chart.moonSign || 'Mesha';
  const moonNakshatra = chart.moonNakshatra || 'Ashwini';

  // English to Sanskrit mapping for uniformity
  const englishToSanskrit: { [key: string]: string } = {
    'Aries': 'Mesha', 'Taurus': 'Vrishabha', 'Gemini': 'Mithuna',
    'Cancer': 'Karka', 'Leo': 'Simha', 'Virgo': 'Kanya',
    'Libra': 'Tula', 'Scorpio': 'Vrishchika', 'Sagittarius': 'Dhanu',
    'Capricorn': 'Makara', 'Aquarius': 'Kumbha', 'Pisces': 'Meena'
  };

  // Ensure we're using Sanskrit names
  const sanskritMoonSign = englishToSanskrit[moonSign] || moonSign;

  console.log('Converted moon sign:', moonSign, '->', sanskritMoonSign);

  // Convert Sanskrit sign name to index (0-11)
  const sanskritSignNames = ['Mesha', 'Vrishabha', 'Mithuna', 'Karka', 'Simha', 'Kanya', 
                             'Tula', 'Vrishchika', 'Dhanu', 'Makara', 'Kumbha', 'Meena'];
  const moonSignIndex = sanskritSignNames.indexOf(sanskritMoonSign);

  // Convert nakshatra to index (0-26)
  const nakshatraNames = [
    'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu',
    'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta',
    'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha',
    'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada',
    'Uttara Bhadrapada', 'Revati'
  ];
  const nakshatraIndex = nakshatraNames.indexOf(moonNakshatra);

  // Use pre-calculated rasi lord from Jyotisha if available
  let moonRasiLord = chart.moonRasiLord || RASI_LORDS[sanskritMoonSign];

  // Comprehensive fallback for moon rasi lord
  if (!moonRasiLord) {
    const universalLordMapping: { [key: string]: string } = {
      // Sanskrit names
      'Mesha': 'Mangal', 'Vrishabha': 'Shukra', 'Mithuna': 'Budh',
      'Karka': 'Chandra', 'Simha': 'Surya', 'Kanya': 'Budh',
      'Tula': 'Shukra', 'Vrishchika': 'Mangal', 'Dhanu': 'Guru',
      'Makara': 'Shani', 'Kumbha': 'Shani', 'Meena': 'Guru',
      // English names
      'Aries': 'Mangal', 'Taurus': 'Shukra', 'Gemini': 'Budh',
      'Cancer': 'Chandra', 'Leo': 'Surya', 'Virgo': 'Budh',
      'Libra': 'Shukra', 'Scorpio': 'Mangal', 'Sagittarius': 'Guru',
      'Capricorn': 'Shani', 'Aquarius': 'Shani', 'Pisces': 'Guru'
    };
    moonRasiLord = universalLordMapping[sanskritMoonSign] || universalLordMapping[moonSign] || 'Surya';
  }

  const finalChartData = {
    moonSign: sanskritMoonSign,
    moonNakshatra,
    moonSignIndex: moonSignIndex >= 0 ? moonSignIndex : 0,
    nakshatraIndex: nakshatraIndex >= 0 ? nakshatraIndex : 0,
    varna: VARNA_MAPPING[moonNakshatra] || 'Vaishya',
    gana: GANA_MAPPING[moonNakshatra] || 'Manushya',
    yoni: YONI_MAPPING[moonNakshatra] || 'Horse',
    nadi: NADI_MAPPING[moonNakshatra] || 'Vata',
    moonRasiLord
  };

  console.log('Final chart data output:', finalChartData);
  console.log('=== CHART DATA CONVERSION COMPLETE ===');

  return finalChartData;
}

function calculateGrahaMaitri(boyMoonSign: string, girlMoonSign: string): GunaResult {
  console.log(`🔍 Graha Maitri Debug: Boy=${boyMoonSign}, Girl=${girlMoonSign}`);

  // Convert English names to Sanskrit if needed
  const boySanskrit = convertToSanskritName(boyMoonSign);
  const girlSanskrit = convertToSanskritName(girlMoonSign);

  console.log(`🔍 Graha Maitri Sanskrit: Boy=${boySanskrit}, Girl=${girlSanskrit}`);

  if (!boySanskrit || !girlSanskrit) {
    console.log(`❌ Graha Maitri: Invalid moon sign data`);
    return {
      score: 0,
      max: 5,
      description: "Invalid moon sign data"
    };
  }

  // Get ruling planets for moon signs
  const boyPlanet = getMoonSignRuler(boySanskrit);
  const girlPlanet = getMoonSignRuler(girlSanskrit);

  // Planetary friendship logic remains the same...

  return {
    score: 0, // Replace with actual score calculation
    max: 5,
    description: "Graha Maitri calculation" // Replace with actual description
  };
}


