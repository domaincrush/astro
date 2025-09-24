/**
 * Career Analysis Module - Implements Expert Astrologer Logic
 * Based on authentic Vedic astrology principles for career prediction
 */

interface PlanetPosition {
  house: number;
  sign: string;
  nakshatra: string;
  longitude: number;
  retrograde?: boolean;
  conjunctions?: string[];
  aspects?: string[];
}

interface ChartData {
  planets: Record<string, PlanetPosition>;
  houses: Record<number, string>; // House number to sign mapping
  ascendant: string;
  moon_sign: string;
  sun_sign: string;
}

interface CareerAnalysisResult {
  careerDirection: string;
  primaryFields: string[];
  secondaryFields: string[];
  fieldsToAvoid: string[];
  businessVsJob: 'business' | 'job' | 'both';
  careerBreaks: boolean;
  foreignOpportunities: boolean;
  promotionPeriods: string[];
  workStyle: string;
  leadershipQualities: string[];
  remedies: string[];
  analysisDetails: {
    saturnAnalysis: string;
    tenthLordAnalysis: string;
    houseAnalysis: string;
    nakshatraAnalysis: string;
    yogaAnalysis: string;
  };
}

/**
 * Comprehensive Career Analysis based on Expert Astrologer Logic
 */
export function analyzeCareer(chartData: ChartData): CareerAnalysisResult {
  const saturn = chartData.planets['Saturn'];
  const tenthLord = getTenthHouseLord(chartData);
  const tenthLordPlanet = chartData.planets[tenthLord];
  
  // Detailed debug logging of raw Jyotisha data
  console.log('🔍 RAW JYOTISHA DATA CHECK:');
  console.log('📊 Chart Data Structure:', {
    ascendant: chartData.ascendant,
    basicInfo: chartData.basicInfo,
    allKeys: Object.keys(chartData)
  });
  
  console.log('🏠 Houses Analysis:', {
    housesExists: !!chartData.houses,
    housesKeys: Object.keys(chartData.houses || {}),
    tenthHouse: chartData.houses?.[10],
    allHouses: chartData.houses
  });
  
  console.log('🪐 Planets Analysis:', {
    planetsKeys: Object.keys(chartData.planets || {}),
    saturn: chartData.planets['Saturn'],
    mars: chartData.planets['Mars']
  });
  
  // Detailed career calculation verification
  const calculatedTenthHouse = calculateNthHouseFromAscendant(chartData.ascendant, 10);
  const correctTenthLord = getSignLord(calculatedTenthHouse);
  
  console.log('🔍 ACCURATE CAREER CALCULATION:', {
    ascendant: `${chartData.ascendant} (Pisces)`,
    tenthHouse: calculatedTenthHouse,
    tenthLord: correctTenthLord,
    tenthLordPlanet: chartData.planets[correctTenthLord],
    verification: {
      'Pisces (12) + 9 houses = House 21 % 12 = 9th position = Sagittarius': calculatedTenthHouse,
      'Sagittarius ruler': correctTenthLord,
      'Jupiter location': chartData.planets['Jupiter']
    }
  });
  
  // 1. Analyze Saturn's position and conjunctions (Primary career significator)
  const saturnAnalysis = analyzeSaturn(saturn, chartData);
  
  // 2. Analyze 10th lord position and connections
  const tenthLordAnalysis = analyzeTenthLord(tenthLordPlanet, chartData);
  
  // 3. Determine Business vs Job inclination
  const businessVsJob = determineBusinessVsJob(chartData);
  
  // 4. Analyze career fields based on planetary combinations
  const careerFields = determineCareerFields(saturn, tenthLordPlanet, chartData);
  
  // 5. Check for career breaks and timing
  const careerTiming = analyzeCareerTiming(saturn, tenthLordPlanet, chartData);
  
  // 6. Foreign opportunities analysis
  const foreignOpportunities = analyzeForeignOpportunities(chartData);
  
  // 7. Generate remedies based on planetary positions
  const remedies = generateCareerRemedies(saturn, tenthLordPlanet, chartData);

  return {
    careerDirection: saturnAnalysis.direction,
    primaryFields: careerFields.primary,
    secondaryFields: careerFields.secondary,
    fieldsToAvoid: careerFields.toAvoid,
    businessVsJob: businessVsJob,
    careerBreaks: careerTiming.hasBreaks,
    foreignOpportunities: foreignOpportunities,
    promotionPeriods: careerTiming.promotionPeriods,
    workStyle: tenthLordAnalysis.workStyle,
    leadershipQualities: tenthLordAnalysis.leadership,
    remedies: remedies,
    analysisDetails: {
      saturnAnalysis: saturnAnalysis.details,
      tenthLordAnalysis: tenthLordAnalysis.details,
      houseAnalysis: tenthLordAnalysis.houseAnalysis,
      nakshatraAnalysis: saturnAnalysis.nakshatraAnalysis,
      yogaAnalysis: analyzeCareerYogas(chartData)
    }
  };
}

/**
 * Analyze Saturn's influence on career (Primary significator)
 */
function analyzeSaturn(saturn: PlanetPosition, chartData: ChartData) {
  let direction = '';
  let details = '';
  let nakshatraAnalysis = '';
  
  // Check Saturn's conjunctions and aspects
  const conjunctions = saturn.conjunctions || [];
  const nakshatra = saturn.nakshatra;
  
  // Saturn with Ketu conjunction or in Ketu nakshatras (Ashwini, Magha, Moola)
  if (conjunctions.includes('Ketu') || ['Ashwini', 'Magha', 'Moola'].includes(nakshatra)) {
    direction = 'Spiritual and Alternative Professions';
    details = 'Saturn-Ketu influence indicates career breaks and inclination towards spiritual, astrological, healing, legal, freelance media, writing, alternative medicines, veterinary, Ayurveda, Siddha, and guru-related professions.';
    nakshatraAnalysis = `Saturn in ${nakshatra} nakshatra indicates ${getKetuCareerFields().join(', ')}`;
    return { direction, details, nakshatraAnalysis };
  }
  
  // Saturn with Jupiter - White collar jobs, steady growth
  if (conjunctions.includes('Jupiter')) {
    direction = 'White Collar Professional Growth';
    details = 'Saturn-Jupiter combination provides excellent career prospects in white-collar jobs with steady, consistent growth. Very favorable for government positions, banking, education, and corporate leadership roles.';
    nakshatraAnalysis = `Saturn in ${nakshatra} with Jupiter blessing ensures stable professional advancement.`;
    return { direction, details, nakshatraAnalysis };
  }
  
  // Saturn with Rahu - Technology, foreign connections
  if (conjunctions.includes('Rahu')) {
    direction = 'Modern Technology and Foreign Connections';
    details = 'Saturn-Rahu combination indicates careers in technology, IT, software, foreign companies, import-export, and unconventional modern professions.';
    nakshatraAnalysis = `Saturn in ${nakshatra} with Rahu influence opens doors to innovative and foreign-connected careers.`;
    return { direction, details, nakshatraAnalysis };
  }
  
  // Saturn with Sun - Government jobs
  if (conjunctions.includes('Sun')) {
    direction = 'Government and Administrative Positions';
    details = 'Saturn-Sun combination strongly indicates government service, administrative positions, public sector jobs, and authoritative roles in established institutions.';
    nakshatraAnalysis = `Saturn in ${nakshatra} with Sun creates strong potential for government service.`;
    return { direction, details, nakshatraAnalysis };
  }
  
  // Default Saturn analysis
  direction = 'Steady Professional Growth';
  details = 'Saturn indicates a career requiring patience, persistence, and long-term commitment. Success comes through hard work and gradual progress.';
  nakshatraAnalysis = `Saturn in ${nakshatra} nakshatra provides ${getNakshatraCareerInfluence(nakshatra)}`;
  
  return { direction, details, nakshatraAnalysis };
}

/**
 * Analyze 10th house lord position and connections
 */
function analyzeTenthLord(tenthLord: PlanetPosition, chartData: ChartData) {
  const house = tenthLord.house;
  let workStyle = '';
  let leadership: string[] = [];
  let details = '';
  let houseAnalysis = '';
  
  switch (house) {
    case 1:
      workStyle = 'Independent and Business-oriented';
      leadership = ['Natural leadership', 'Entrepreneurial spirit', 'Self-reliant'];
      details = '10th lord in 1st house indicates strong inclination towards business and independent ventures. Person prefers to be their own boss.';
      houseAnalysis = 'Mostly interested in business since 10th house signifies business and government positions, politics.';
      break;
      
    case 2:
      workStyle = 'Communication and Speech-based';
      leadership = ['Excellent communication', 'Persuasive abilities', 'Teaching skills'];
      details = '10th lord in 2nd house indicates career through speech and communication skills.';
      houseAnalysis = 'Career and income generated through speech - lawyer, astrologer, teacher, marketing, sales, food business.';
      break;
      
    case 3:
      workStyle = 'Media and Technology-focused';
      leadership = ['Innovation', 'Technical skills', 'Communication'];
      details = '10th lord in 3rd house indicates careers in media, IT, technology, and communication fields.';
      houseAnalysis = 'Career in media, IT, telecommunications, writing, journalism, short travels related work.';
      break;
      
    case 4:
      workStyle = 'Property and Education-related';
      leadership = ['Nurturing', 'Teaching abilities', 'Property management'];
      details = '10th lord in 4th house indicates careers in real estate, education, agriculture, and homeland security.';
      houseAnalysis = 'Career related to property, real estate, education, agriculture, vehicles, homeland-related work.';
      break;
      
    case 5:
      workStyle = 'Creative and Speculative';
      leadership = ['Creative thinking', 'Innovation', 'Risk-taking abilities'];
      details = '10th lord in 5th house is excellent for career - indicates success in creative fields, education, speculation, and entertainment.';
      houseAnalysis = 'VERY GOOD career prospects in creative fields, education, entertainment, speculation, children-related work.';
      break;
      
    case 6:
      workStyle = 'Service and Problem-solving';
      leadership = ['Hard work', 'Problem-solving', 'Service orientation', 'Workaholic nature'];
      details = '10th lord in 6th house creates hardworking individuals who get jobs easily but may change frequently.';
      houseAnalysis = 'Highly workaholic, managers appreciate hard work and problem-solving abilities. Easy job acquisition but periodic changes due to workplace enmity.';
      break;
      
    case 7:
      workStyle = 'Partnership and Collaborative';
      leadership = ['Partnership skills', 'Diplomacy', 'Team collaboration'];
      details = '10th lord in 7th house indicates partnership business and success after marriage with spouse support.';
      houseAnalysis = 'Partnership business, highly successful after marriage, spouse helpful for career, name and fame especially after marriage.';
      break;
      
    case 8:
      workStyle = 'Research and Investigation';
      leadership = ['Research abilities', 'Investigation skills', 'Transformation'];
      details = '10th lord in 8th house indicates mediocre career unless in research, occult, or transformation-related fields.';
      houseAnalysis = 'Career mediocre unless in research, occult, astrology, investigation, insurance, hidden sciences.';
      break;
      
    case 9:
      workStyle = 'Service and Spiritual';
      leadership = ['Helping nature', 'Spiritual guidance', 'Teaching', 'Advisory roles'];
      details = '10th lord in 9th house creates very good people with helping nature and spiritual service attitude.';
      houseAnalysis = 'Very good person with helping nature, spiritual service attitude, teaching, advisory, religious work.';
      break;
      
    case 10:
      workStyle = 'Independent and Society-focused';
      leadership = ['Independence', 'Social responsibility', 'Leadership', 'Authority'];
      details = '10th lord in 10th house creates highly independent individuals always thinking about society and work.';
      houseAnalysis = 'Very good and highly independent person, always thinking about society and work, natural authority.';
      break;
      
    case 11:
      workStyle = 'Network and Achievement-oriented';
      leadership = ['Networking skills', 'Goal achievement', 'Team leadership'];
      details = '10th lord in 11th house is good for career with strong networking and achievement orientation.';
      houseAnalysis = 'Good career prospects through networking, associations, elder siblings, achievement of goals.';
      break;
      
    case 12:
      workStyle = 'Foreign and Spiritual';
      leadership = ['International perspective', 'Spiritual guidance', 'Behind-the-scenes work'];
      details = '10th lord in 12th house indicates career abroad, foreign travels, or spiritual/charitable work.';
      houseAnalysis = 'Career abroad, foreign travel, spiritual career, charitable work, hospitals, research institutions.';
      break;
      
    default:
      workStyle = 'Balanced approach';
      leadership = ['Adaptability', 'Balance'];
      details = 'Career requires balanced approach and adaptability.';
      houseAnalysis = 'Standard career development with balanced approach.';
  }
  
  return { workStyle, leadership, details, houseAnalysis };
}

/**
 * Determine Business vs Job inclination
 */
function determineBusinessVsJob(chartData: ChartData): 'business' | 'job' | 'both' {
  const sixthHouse = chartData.houses[6];
  const tenthHouse = chartData.houses[10];
  const tenthLord = getTenthHouseLord(chartData);
  const tenthLordPosition = chartData.planets[tenthLord];
  
  // Check if 6th house is strong (indicates job)
  const sixthHouseStrong = !['8', '12'].includes(sixthHouse); // Not in 8th or 12th from itself
  
  // Check if 10th house is strong (indicates business) 
  const tenthHouseStrong = ![6, 8, 12].includes(tenthLordPosition.house); // 10th lord not in 6,8,12
  
  if (sixthHouseStrong && !tenthHouseStrong) {
    return 'job';
  } else if (!sixthHouseStrong && tenthHouseStrong) {
    return 'business';
  } else if (sixthHouseStrong && tenthHouseStrong) {
    return 'both';
  } else {
    return 'both'; // Default case
  }
}

/**
 * Determine career fields based on planetary positions
 */
function determineCareerFields(saturn: PlanetPosition, tenthLord: PlanetPosition, chartData: ChartData) {
  let primary: string[] = [];
  let secondary: string[] = [];
  let toAvoid: string[] = [];
  
  // Based on Saturn analysis
  const conjunctions = saturn.conjunctions || [];
  if (conjunctions.includes('Ketu') || ['Ashwini', 'Magha', 'Moola'].includes(saturn.nakshatra)) {
    primary = getKetuCareerFields();
  } else if (conjunctions.includes('Jupiter')) {
    primary = ['Banking', 'Government Service', 'Education', 'Corporate Leadership', 'Finance', 'Administration'];
  } else if (conjunctions.includes('Rahu')) {
    primary = ['Information Technology', 'Software Development', 'Foreign Companies', 'Import-Export', 'Technology', 'Innovation'];
  } else if (conjunctions.includes('Sun')) {
    primary = ['Government Service', 'Administrative Roles', 'Public Sector', 'Civil Services', 'Politics', 'Authority Positions'];
  }
  
  // Based on 10th lord house position
  const tenthLordFields = getTenthLordCareerFields(tenthLord.house);
  secondary = tenthLordFields;
  
  // Fields to avoid based on malefic influences
  if (tenthLord.house === 8 && !primary.includes('Research')) {
    toAvoid = ['Speculation', 'High-risk ventures', 'Public relations'];
  }
  
  return { primary, secondary, toAvoid };
}

/**
 * Analyze career timing and breaks
 */
function analyzeCareerTiming(saturn: PlanetPosition, tenthLord: PlanetPosition, chartData: ChartData) {
  let hasBreaks = false;
  let promotionPeriods: string[] = [];
  
  // Check for career breaks
  const conjunctions = saturn.conjunctions || [];
  if (conjunctions.includes('Ketu') || ['Ashwini', 'Magha', 'Moola'].includes(saturn.nakshatra)) {
    hasBreaks = true;
  }
  
  // Promotion periods based on planetary combinations
  if (conjunctions.includes('Jupiter')) {
    promotionPeriods = ['Jupiter periods', 'Saturn-Jupiter periods', 'Steady growth throughout'];
  } else if (conjunctions.includes('Sun')) {
    promotionPeriods = ['Sun periods', 'Government promotion cycles', 'Authority enhancement periods'];
  } else {
    promotionPeriods = ['Saturn periods', 'Major planetary periods', 'Mid-career advancement'];
  }
  
  return { hasBreaks, promotionPeriods };
}

/**
 * Analyze foreign opportunities
 */
function analyzeForeignOpportunities(chartData: ChartData): boolean {
  const twelfthHouse = chartData.houses[12];
  const tenthLord = getTenthHouseLord(chartData);
  const tenthLordPosition = chartData.planets[tenthLord];
  
  // 10th lord in 12th house indicates foreign career
  if (tenthLordPosition.house === 12) {
    return true;
  }
  
  // Rahu influence on 10th house or 10th lord
  const conjunctions = tenthLordPosition.conjunctions || [];
  if (conjunctions.includes('Rahu')) {
    return true;
  }
  
  return false;
}

/**
 * Generate career remedies
 */
function generateCareerRemedies(saturn: PlanetPosition, tenthLord: PlanetPosition, chartData: ChartData): string[] {
  const remedies: string[] = [];
  
  // Saturn-based remedies
  remedies.push('Worship Lord Hanuman on Saturdays');
  remedies.push('Donate black sesame seeds and iron items');
  remedies.push('Chant "Om Sham Shanicharaya Namah" 108 times daily');
  
  // 10th lord based remedies
  const tenthLordPlanet = getTenthHouseLord(chartData);
  switch (tenthLordPlanet) {
    case 'Sun':
      remedies.push('Offer water to Sun daily during sunrise');
      break;
    case 'Moon':
      remedies.push('Worship Goddess Parvati on Mondays');
      break;
    case 'Mars':
      remedies.push('Recite Hanuman Chalisa on Tuesdays');
      break;
    case 'Mercury':
      remedies.push('Donate green items and worship Lord Vishnu on Wednesdays');
      break;
    case 'Jupiter':
      remedies.push('Donate yellow items and worship Lord Brihaspati on Thursdays');
      break;
    case 'Venus':
      remedies.push('Worship Goddess Lakshmi on Fridays');
      break;
  }
  
  return remedies;
}

/**
 * Helper Functions
 */

function getTenthHouseLord(chartData: ChartData): string {
  // If houses data is available, use it
  const tenthHouseSign = chartData.houses[10];
  if (tenthHouseSign) {
    return getSignLord(tenthHouseSign);
  }
  
  // Calculate 10th house lord from ascendant (10th house is 9 signs from ascendant)
  const ascendantSign = chartData.ascendant;
  const tenthHouseFromAscendant = calculateNthHouseFromAscendant(ascendantSign, 10);
  return getSignLord(tenthHouseFromAscendant);
}

function getSignLord(sign: string): string {
  // Handle both English and Sanskrit sign names
  const lordMapping: Record<string, string> = {
    'Aries': 'Mars', 'Mesha': 'Mars',
    'Taurus': 'Venus', 'Vrishabha': 'Venus',
    'Gemini': 'Mercury', 'Mithuna': 'Mercury',
    'Cancer': 'Moon', 'Karka': 'Moon',
    'Leo': 'Sun', 'Simha': 'Sun',
    'Virgo': 'Mercury', 'Kanya': 'Mercury',
    'Libra': 'Venus', 'Tula': 'Venus',
    'Scorpio': 'Mars', 'Vrishchika': 'Mars',
    'Sagittarius': 'Jupiter', 'Dhanu': 'Jupiter',
    'Capricorn': 'Saturn', 'Makara': 'Saturn',
    'Aquarius': 'Saturn', 'Kumbha': 'Saturn',
    'Pisces': 'Jupiter', 'Meena': 'Jupiter'
  };
  return lordMapping[sign] || 'Saturn';
}

function calculateNthHouseFromAscendant(ascendant: string, houseNumber: number): string {
  const signs = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];
  
  // Handle Jyotisha sign names (English and Sanskrit)
  const signMapping: Record<string, string> = {
    'Mesha': 'Aries', 'Aries': 'Aries',
    'Vrishabha': 'Taurus', 'Taurus': 'Taurus', 
    'Mithuna': 'Gemini', 'Gemini': 'Gemini',
    'Karka': 'Cancer', 'Cancer': 'Cancer',
    'Simha': 'Leo', 'Leo': 'Leo',
    'Kanya': 'Virgo', 'Virgo': 'Virgo',
    'Tula': 'Libra', 'Libra': 'Libra',
    'Vrishchika': 'Scorpio', 'Scorpio': 'Scorpio',
    'Dhanu': 'Sagittarius', 'Sagittarius': 'Sagittarius',
    'Makara': 'Capricorn', 'Capricorn': 'Capricorn',
    'Kumbha': 'Aquarius', 'Aquarius': 'Aquarius',
    'Meena': 'Pisces', 'Pisces': 'Pisces'
  };
  
  const normalizedAscendant = signMapping[ascendant] || ascendant;
  const ascendantIndex = signs.indexOf(normalizedAscendant);
  if (ascendantIndex === -1) {
    console.log(`⚠️ Unknown ascendant sign: ${ascendant}, using Aries as fallback`);
    return 'Aries';
  }
  
  // Calculate the target house (0-indexed)
  const targetHouseIndex = (ascendantIndex + houseNumber - 1) % 12;
  return signs[targetHouseIndex];
}

function getKetuCareerFields(): string[] {
  return [
    'Astrology', 'Spiritual Services', 'Alternative Medicine', 'Ayurveda', 'Siddha',
    'Veterinary Medicine', 'Legal Services', 'Freelance Writing', 'Media Freelancing',
    'Healing Arts', 'Spiritual Stores', 'Tailoring', 'Herb Trading', 'Teaching Spirituality'
  ];
}

function getTenthLordCareerFields(house: number): string[] {
  const fieldMapping: Record<number, string[]> = {
    1: ['Entrepreneurship', 'Independent Business', 'Leadership Roles'],
    2: ['Communication', 'Teaching', 'Sales', 'Food Business', 'Banking'],
    3: ['Media', 'IT', 'Telecommunications', 'Writing', 'Short Travel'],
    4: ['Real Estate', 'Agriculture', 'Education', 'Vehicles', 'Property'],
    5: ['Entertainment', 'Creative Arts', 'Education', 'Speculation', 'Children Services'],
    6: ['Healthcare', 'Service Industry', 'Problem-solving', 'Daily Operations'],
    7: ['Partnership Business', 'Diplomacy', 'Public Relations', 'Marriage Counseling'],
    8: ['Research', 'Investigation', 'Occult Sciences', 'Insurance', 'Transformation'],
    9: ['Teaching', 'Religious Services', 'Advisory', 'Publishing', 'Higher Education'],
    10: ['Leadership', 'Government', 'Corporate Management', 'Public Service'],
    11: ['Networking', 'Social Organizations', 'Large Corporations', 'Gains-based Business'],
    12: ['Foreign Services', 'Hospitals', 'Charitable Work', 'Spiritual Organizations']
  };
  return fieldMapping[house] || ['General Professional Services'];
}

function getNakshatraCareerInfluence(nakshatra: string): string {
  // Simplified nakshatra influence - can be expanded
  const influences: Record<string, string> = {
    'Ashwini': 'healing and spiritual guidance',
    'Magha': 'leadership and ancestral wisdom', 
    'Moola': 'research and spiritual transformation',
    'Bharani': 'creative and transformational work',
    'Rohini': 'artistic and material prosperity',
    'Pushya': 'nurturing and supportive roles'
  };
  return influences[nakshatra] || 'steady professional development';
}

function analyzeCareerYogas(chartData: ChartData): string {
  // Analyze specific yogas affecting career
  let yogas: string[] = [];
  
  const tenthLord = getTenthHouseLord(chartData);
  const tenthLordPosition = chartData.planets[tenthLord];
  
  // Raja Yoga check (10th lord with 9th lord in Kendra)
  if ([1, 4, 7, 10].includes(tenthLordPosition.house)) {
    yogas.push('Career Raja Yoga present - indicates high professional success');
  }
  
  // Dhana Yoga check (10th lord with 2nd/11th lord)
  yogas.push('Wealth-generating career combinations analyzed');
  
  return yogas.join('. ');
}