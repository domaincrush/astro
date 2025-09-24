/**
 * Jyotisha-Based Horoscope Generator
 * Uses authentic Vedic astrology calculations with automatic time-based updates
 */

import { Request, Response } from 'express';
import { spawn } from 'child_process';
import { DateTime } from 'luxon';

interface JyotishaHoroscopeData {
  sign: string;
  sanskritName: string;
  tamilName: string;
  symbol: string;
  period: 'daily' | 'weekly' | 'monthly';
  date: string;
  prediction: string;
  luckyNumbers: number[];
  luckyColors: string[];
  favorableTime: string;
  avoidTime: string;
  generalAdvice: string;
  loveLife: string;
  career: string;
  health: string;
  finances: string;
  spirituality: string;
  currentTransits: any;
  panchangData: any;
  nakshatraInsight: string;
  calculationEngine: string;
  lastUpdated: string;
}

interface JyotishaTransitData {
  planets: any[];
  moonSign: string;
  moonNakshatra: string;
  sunSign: string;
  ascendant: string;
  currentDasha: any;
  beneficTransits: string[];
  challengingTransits: string[];
  panchangElements: any;
  calculation_timestamp: string;
}

export class JyotishaHoroscopeGenerator {
  private static readonly VEDIC_SIGNS = [
    { english: 'Aries', sanskrit: 'मेष', tamil: 'மேஷம்', symbol: '♈' },
    { english: 'Taurus', sanskrit: 'वृषभ', tamil: 'ரிஷபம்', symbol: '♉' },
    { english: 'Gemini', sanskrit: 'मिथुन', tamil: 'மிதுனம்', symbol: '♊' },
    { english: 'Cancer', sanskrit: 'कर्क', tamil: 'கர்கம்', symbol: '♋' },
    { english: 'Leo', sanskrit: 'सिंह', tamil: 'சிம்மம்', symbol: '♌' },
    { english: 'Virgo', sanskrit: 'कन्या', tamil: 'கன்யா', symbol: '♍' },
    { english: 'Libra', sanskrit: 'तुला', tamil: 'துலாம்', symbol: '♎' },
    { english: 'Scorpio', sanskrit: 'वृश्चिक', tamil: 'விருச்சிகம்', symbol: '♏' },
    { english: 'Sagittarius', sanskrit: 'धनु', tamil: 'தனுசு', symbol: '♐' },
    { english: 'Capricorn', sanskrit: 'मकर', tamil: 'மகரम்', symbol: '♑' },
    { english: 'Aquarius', sanskrit: 'कुम्भ', tamil: 'கும்பம்', symbol: '♒' },
    { english: 'Pisces', sanskrit: 'मीन', tamil: 'மீனம்', symbol: '♓' }
  ];

  private static readonly CACHE_DURATION = {
    daily: 24 * 60 * 60 * 1000, // 24 hours
    weekly: 7 * 24 * 60 * 60 * 1000, // 7 days
    monthly: 30 * 24 * 60 * 60 * 1000 // 30 days
  };

  private static cache: Map<string, { data: JyotishaHoroscopeData[], timestamp: number }> = new Map();
  
  /**
   * Clear cache to force fresh calculations
   */
  static clearCache(): void {
    this.cache.clear();
    console.log('🔄 Horoscope cache cleared - fresh calculations will be used');
  }

  /**
   * Generate authentic daily horoscope using Jyotisha calculations
   */
  static async generateDailyHoroscope(date?: string): Promise<JyotishaHoroscopeData[]> {
    const today = date || DateTime.now().setZone('Asia/Kolkata').toISODate();
    const cacheKey = `daily_${today}`;
    
    // Check cache validity
    const cached = this.cache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp) < this.CACHE_DURATION.daily) {
      return cached.data;
    }

    console.log(`🔄 Generating fresh daily horoscope for ${today} using Jyotisha`);

    // Calculate authentic transit data using Jyotisha
    const transitData = await this.calculateJyotishaTransits(today);
    
    // Generate horoscope for each sign
    const horoscopes: JyotishaHoroscopeData[] = [];
    
    for (const signData of this.VEDIC_SIGNS) {
      const horoscope = await this.generateSignHoroscope(
        signData, 
        'daily', 
        today, 
        transitData
      );
      horoscopes.push(horoscope);
    }

    // Cache the results
    this.cache.set(cacheKey, {
      data: horoscopes,
      timestamp: Date.now()
    });

    return horoscopes;
  }

  /**
   * Generate authentic weekly horoscope using Jyotisha calculations
   */
  static async generateWeeklyHoroscope(startDate?: string): Promise<JyotishaHoroscopeData[]> {
    const weekStart = startDate || DateTime.now().setZone('Asia/Kolkata').startOf('week').toISODate();
    const cacheKey = `weekly_${weekStart}`;
    
    // Check cache validity
    const cached = this.cache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp) < this.CACHE_DURATION.weekly) {
      return cached.data;
    }

    console.log(`🔄 Generating fresh weekly horoscope for week starting ${weekStart} using Jyotisha`);

    // Calculate weekly transit patterns
    const weeklyTransits = await this.calculateWeeklyTransitPattern(weekStart);
    
    // Generate horoscope for each sign
    const horoscopes: JyotishaHoroscopeData[] = [];
    
    for (const signData of this.VEDIC_SIGNS) {
      const horoscope = await this.generateSignHoroscope(
        signData, 
        'weekly', 
        weekStart, 
        weeklyTransits
      );
      horoscopes.push(horoscope);
    }

    // Cache the results
    this.cache.set(cacheKey, {
      data: horoscopes,
      timestamp: Date.now()
    });

    return horoscopes;
  }

  /**
   * Generate authentic monthly horoscope using Jyotisha calculations
   */
  static async generateMonthlyHoroscope(month?: number, year?: number): Promise<JyotishaHoroscopeData[]> {
    const now = DateTime.now().setZone('Asia/Kolkata');
    const targetMonth = month || now.month;
    const targetYear = year || now.year;
    const monthStart = DateTime.fromObject({ year: targetYear, month: targetMonth, day: 1 }).toISODate();
    const cacheKey = `monthly_${targetYear}_${targetMonth}`;
    
    // Check cache validity
    const cached = this.cache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp) < this.CACHE_DURATION.monthly) {
      return cached.data;
    }

    console.log(`🔄 Generating fresh monthly horoscope for ${DateTime.fromObject({ month: targetMonth, year: targetYear }).toLocaleString({ month: 'long', year: 'numeric' })} using Jyotisha`);

    // Calculate monthly transit patterns
    const monthlyTransits = await this.calculateMonthlyTransitPattern(targetMonth, targetYear);
    
    // Generate horoscope for each sign
    const horoscopes: JyotishaHoroscopeData[] = [];
    
    for (const signData of this.VEDIC_SIGNS) {
      const horoscope = await this.generateSignHoroscope(
        signData, 
        'monthly', 
        monthStart, 
        monthlyTransits
      );
      horoscopes.push(horoscope);
    }

    // Cache the results
    this.cache.set(cacheKey, {
      data: horoscopes,
      timestamp: Date.now()
    });

    return horoscopes;
  }

  /**
   * Calculate authentic transit data using Jyotisha engine
   */
  private static async calculateJyotishaTransits(date: string): Promise<JyotishaTransitData> {
    return new Promise((resolve, reject) => {
      const pythonProcess = spawn('python3', ['server/jyotisha-engine.py'], {
        stdio: ['pipe', 'pipe', 'pipe']
      });

      const transitInput = {
        action: 'calculate_transits',
        date: date,
        time: '12:00',
        latitude: 28.6139, // Delhi coordinates for standard calculation
        longitude: 77.2090,
        place: 'Delhi, India'
      };

      pythonProcess.stdin.write(JSON.stringify(transitInput));
      pythonProcess.stdin.end();

      let output = '';
      let error = '';

      pythonProcess.stdout.on('data', (data) => {
        output += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        error += data.toString();
      });

      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          console.error('Jyotisha transit calculation error:', error);
          reject(new Error(`Jyotisha process failed with code ${code}`));
          return;
        }

        try {
          const result = JSON.parse(output);
          if (result.success) {
            resolve(result.data);
          } else {
            reject(new Error(result.error || 'Unknown Jyotisha error'));
          }
        } catch (parseError) {
          reject(new Error('Failed to parse Jyotisha output'));
        }
      });
    });
  }

  /**
   * Calculate weekly transit patterns
   */
  private static async calculateWeeklyTransitPattern(startDate: string): Promise<JyotishaTransitData> {
    // Calculate transits for the middle of the week for weekly prediction
    const midWeek = DateTime.fromISO(startDate).plus({ days: 3 }).toISODate();
    const baseTransits = await this.calculateJyotishaTransits(midWeek);
    
    // Add weekly-specific analysis
    return {
      ...baseTransits,
      weeklyPattern: 'evolving',
      weeklyTheme: 'transformation and growth',
      favorableDays: ['Monday', 'Wednesday', 'Friday'],
      challengingDays: ['Tuesday', 'Saturday']
    };
  }

  /**
   * Calculate monthly transit patterns
   */
  private static async calculateMonthlyTransitPattern(month: number, year: number): Promise<JyotishaTransitData> {
    // Calculate transits for the middle of the month
    const midMonth = DateTime.fromObject({ year, month, day: 15 }).toISODate();
    const baseTransits = await this.calculateJyotishaTransits(midMonth);
    
    // Add monthly-specific analysis
    return {
      ...baseTransits,
      monthlyPattern: 'progressive',
      monthlyTheme: 'expansion and consolidation',
      favorablePeriods: ['First week', 'Third week'],
      challengingPeriods: ['Second week']
    };
  }

  /**
   * Generate comprehensive horoscope for a specific sign
   */
  private static async generateSignHoroscope(
    signData: any,
    period: 'daily' | 'weekly' | 'monthly',
    date: string,
    transitData: JyotishaTransitData
  ): Promise<JyotishaHoroscopeData> {
    const signIndex = this.VEDIC_SIGNS.findIndex(s => s.english === signData.english);
    
    // Calculate sign-specific effects from transits
    const signEffects = this.calculateSignEffects(signData.english, transitData);
    
    // Generate authentic predictions based on Jyotisha calculations
    const predictions = this.generateAuthenticPredictions(
      signData.english,
      period,
      signEffects,
      transitData
    );

    // Generate lucky elements based on planetary positions
    const luckyElements = this.generateLuckyElements(signData.english, transitData);

    return {
      sign: signData.english,
      sanskritName: signData.sanskrit,
      tamilName: signData.tamil,
      symbol: signData.symbol,
      period,
      date,
      prediction: predictions.general,
      luckyNumbers: luckyElements.numbers,
      luckyColors: luckyElements.colors,
      favorableTime: luckyElements.favorableTime,
      avoidTime: luckyElements.avoidTime,
      generalAdvice: predictions.advice,
      loveLife: predictions.love,
      career: predictions.career,
      health: predictions.health,
      finances: predictions.finances,
      spirituality: predictions.spirituality,
      currentTransits: transitData.planets,
      panchangData: transitData.panchangElements,
      nakshatraInsight: this.generateNakshatraInsight(transitData.moonNakshatra, signData.english),
      calculationEngine: 'Jyotisha-Official',
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Calculate sign-specific effects from current transits
   */
  private static calculateSignEffects(sign: string, transitData: JyotishaTransitData): any {
    const signIndex = this.VEDIC_SIGNS.findIndex(s => s.english === sign);
    const moonSignIndex = this.VEDIC_SIGNS.findIndex(s => s.english === transitData.moonSign);
    const sunSignIndex = this.VEDIC_SIGNS.findIndex(s => s.english === transitData.sunSign);

    // Calculate house positions for Moon and Sun relative to the sign
    const moonHouse = ((moonSignIndex - signIndex + 12) % 12) + 1;
    const sunHouse = ((sunSignIndex - signIndex + 12) % 12) + 1;

    return {
      moonEffect: this.getHouseEffect(moonHouse, 'Moon'),
      sunEffect: this.getHouseEffect(sunHouse, 'Sun'),
      nakshatraEffect: this.getNakshatraEffect(transitData.moonNakshatra),
      dashaEffect: transitData.currentDasha ? this.getDashaEffect(transitData.currentDasha) : null,
      beneficTransits: transitData.beneficTransits || [],
      challengingTransits: transitData.challengingTransits || []
    };
  }

  /**
   * Get house-specific effects for planetary transits
   */
  private static getHouseEffect(house: number, planet: string): string {
    const houseEffects = {
      1: `${planet} enhances self-confidence and personal magnetism`,
      2: `${planet} influences wealth and family matters positively`,
      3: `${planet} boosts communication and short travels`,
      4: `${planet} brings harmony to home and emotional well-being`,
      5: `${planet} favors creativity and romantic relationships`,
      6: `${planet} provides strength to overcome obstacles`,
      7: `${planet} influences partnerships and public relations`,
      8: `${planet} brings transformation and hidden opportunities`,
      9: `${planet} enhances luck and spiritual growth`,
      10: `${planet} advances career and public recognition`,
      11: `${planet} brings gains and fulfillment of desires`,
      12: `${planet} promotes spiritual practices and introspection`
    };
    
    return houseEffects[house] || `${planet} provides balanced influence`;
  }

  /**
   * Get Nakshatra-specific effects
   */
  private static getNakshatraEffect(nakshatra: string): string {
    const nakshatraEffects = {
      'Ashwini': 'healing and swift action',
      'Bharani': 'transformation and endurance',
      'Krittika': 'purification and sharp focus',
      'Rohini': 'material prosperity and beauty',
      'Mrigashira': 'seeking and exploration',
      'Ardra': 'emotional intensity and breakthroughs',
      'Punarvasu': 'renewal and restoration',
      'Pushya': 'nourishment and growth',
      'Ashlesha': 'mystical insights and wisdom',
      'Magha': 'ancestral connections and authority',
      'Purva Phalguni': 'creative pleasure and relationships',
      'Uttara Phalguni': 'service and partnership',
      'Hasta': 'skillful work and dexterity',
      'Chitra': 'artistic expression and beauty',
      'Swati': 'independence and flexibility',
      'Vishakha': 'determination and goal achievement',
      'Anuradha': 'friendship and devotion',
      'Jyeshtha': 'leadership and responsibility',
      'Mula': 'root investigation and transformation',
      'Purva Ashadha': 'invincible energy and victory',
      'Uttara Ashadha': 'ultimate success and dharma',
      'Shravana': 'learning and listening',
      'Dhanishta': 'wealth and rhythm',
      'Shatabhisha': 'healing and innovation',
      'Purva Bhadrapada': 'spiritual intensity and passion',
      'Uttara Bhadrapada': 'cosmic consciousness and depth',
      'Revati': 'completion and compassion'
    };
    
    return nakshatraEffects[nakshatra] || 'balanced cosmic influence';
  }

  /**
   * Get Dasha-specific effects
   */
  private static getDashaEffect(dasha: any): string {
    if (!dasha || !dasha.current_mahadasha) return 'balanced planetary period';
    
    const planet = dasha.current_mahadasha.planet;
    const dashaEffects = {
      'Sun': 'leadership and recognition',
      'Moon': 'emotional fulfillment and intuition',
      'Mars': 'energy and decisive action',
      'Mercury': 'communication and learning',
      'Jupiter': 'wisdom and expansion',
      'Venus': 'love and artistic expression',
      'Saturn': 'discipline and long-term rewards',
      'Rahu': 'material success and innovation',
      'Ketu': 'spiritual growth and detachment'
    };
    
    return dashaEffects[planet] || 'transformative planetary influence';
  }

  /**
   * Generate authentic predictions based on Jyotisha calculations
   */
  private static generateAuthenticPredictions(
    sign: string,
    period: 'daily' | 'weekly' | 'monthly',
    effects: any,
    transitData: JyotishaTransitData
  ): any {
    const periodText = period === 'daily' ? 'today' : period === 'weekly' ? 'this week' : 'this month';
    const signIndex = this.VEDIC_SIGNS.findIndex(s => s.english === sign);
    
    // Calculate unique house positions for this sign
    const moonSignIndex = this.VEDIC_SIGNS.findIndex(s => s.english === transitData.moonSign);
    const sunSignIndex = this.VEDIC_SIGNS.findIndex(s => s.english === transitData.sunSign);
    const moonHouse = ((moonSignIndex - signIndex + 12) % 12) + 1;
    const sunHouse = ((sunSignIndex - signIndex + 12) % 12) + 1;
    
    // Generate sign-specific planetary effects
    const signSpecificEffects = this.getSignSpecificEffects(sign, transitData, moonHouse, sunHouse);
    
    return {
      general: `For ${sign}, ${signSpecificEffects.primaryInfluence}. ${effects.moonEffect} (Moon in ${moonHouse}${this.getOrdinalSuffix(moonHouse)} house), while ${effects.sunEffect.toLowerCase()} (Sun in ${sunHouse}${this.getOrdinalSuffix(sunHouse)} house). The current Moon in ${transitData.moonNakshatra} Nakshatra brings ${effects.nakshatraEffect} to your ${period} experience.`,
      
      advice: `${signSpecificEffects.specificAdvice} ${periodText}. ${effects.beneficTransits.length > 0 ? `Favorable planetary influences include ${effects.beneficTransits.slice(0, 2).join(' and ')}.` : ''} ${effects.challengingTransits.length > 0 ? `Navigate challenges with patience as ${effects.challengingTransits.slice(0, 1).join('')}.` : ''}`,
      
      love: this.generateLovePrediction(sign, effects, transitData, period),
      career: this.generateCareerPrediction(sign, effects, transitData, period),
      health: this.generateHealthPrediction(sign, effects, transitData, period),
      finances: this.generateFinancesPrediction(sign, effects, transitData, period),
      spirituality: this.generateSpiritualityPrediction(sign, effects, transitData, period)
    };
  }

  /**
   * Get ordinal suffix for house numbers
   */
  private static getOrdinalSuffix(num: number): string {
    if (num >= 11 && num <= 13) return 'th';
    switch (num % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  }

  /**
   * Get sign-specific effects based on current planetary positions
   */
  private static getSignSpecificEffects(sign: string, transitData: JyotishaTransitData, moonHouse: number, sunHouse: number): any {
    const signEffects = {
      'Aries': {
        primaryInfluence: 'Mars energy drives your pioneering spirit forward with dynamic force',
        specificAdvice: 'Lead with courage and take calculated risks'
      },
      'Taurus': {
        primaryInfluence: 'Venus brings stability and material comfort to your steady nature',
        specificAdvice: 'Focus on building lasting value and enjoying sensual pleasures'
      },
      'Gemini': {
        primaryInfluence: 'Mercury enhances your communication and intellectual curiosity',
        specificAdvice: 'Engage in learning and expand your social connections'
      },
      'Cancer': {
        primaryInfluence: 'Moon\'s nurturing energy amplifies your emotional sensitivity',
        specificAdvice: 'Trust your intuition and care for family relationships'
      },
      'Leo': {
        primaryInfluence: 'Sun\'s radiant energy highlights your creative self-expression',
        specificAdvice: 'Shine your light and pursue creative endeavors boldly'
      },
      'Virgo': {
        primaryInfluence: 'Mercury brings analytical precision to your practical approach',
        specificAdvice: 'Perfect your skills and organize your environment methodically'
      },
      'Libra': {
        primaryInfluence: 'Venus creates harmony and balance in your relationships',
        specificAdvice: 'Seek diplomatic solutions and appreciate beauty in all forms'
      },
      'Scorpio': {
        primaryInfluence: 'Mars and Pluto intensify your transformative power',
        specificAdvice: 'Embrace deep changes and trust your psychological insights'
      },
      'Sagittarius': {
        primaryInfluence: 'Jupiter expands your philosophical understanding and adventure spirit',
        specificAdvice: 'Seek higher knowledge and explore new horizons'
      },
      'Capricorn': {
        primaryInfluence: 'Saturn provides structure and discipline for your ambitious goals',
        specificAdvice: 'Build methodically toward long-term success with patience'
      },
      'Aquarius': {
        primaryInfluence: 'Uranus brings innovation and humanitarian focus to your unique vision',
        specificAdvice: 'Embrace your individuality and contribute to collective progress'
      },
      'Pisces': {
        primaryInfluence: 'Neptune enhances your spiritual sensitivity and creative imagination',
        specificAdvice: 'Follow your intuition and express your compassionate nature'
      }
    };
    
    const baseEffect = signEffects[sign] || {
      primaryInfluence: 'Planetary energies bring balanced influences to your nature',
      specificAdvice: 'Maintain balance and authenticity in your actions'
    };
    
    // Add house-specific modifications
    const houseModifications = this.getHouseModifications(moonHouse, sunHouse);
    
    return {
      primaryInfluence: `${baseEffect.primaryInfluence}${houseModifications.moonMod}`,
      specificAdvice: `${baseEffect.specificAdvice}${houseModifications.sunMod}`
    };
  }

  /**
   * Get house-specific modifications for predictions
   */
  private static getHouseModifications(moonHouse: number, sunHouse: number): any {
    const moonMods = {
      1: ', energizing your personal identity',
      2: ', affecting your resources and values',
      3: ', stimulating communication and short journeys',
      4: ', influencing home and emotional security',
      5: ', enhancing creativity and romance',
      6: ', focusing on health and daily routines',
      7: ', impacting partnerships and public relations',
      8: ', bringing transformation and hidden matters',
      9: ', expanding philosophical and spiritual pursuits',
      10: ', highlighting career and public reputation',
      11: ', manifesting hopes and group associations',
      12: ', encouraging introspection and spiritual practices'
    };
    
    const sunMods = {
      1: ' while boosting your confidence and leadership',
      2: ' while strengthening your financial foundation',
      3: ' while improving your communication skills',
      4: ' while bringing focus to family matters',
      5: ' while inspiring creative self-expression',
      6: ' while emphasizing health and service',
      7: ' while enhancing partnership dynamics',
      8: ' while revealing hidden potentials',
      9: ' while expanding your worldview',
      10: ' while advancing your career prospects',
      11: ' while connecting you with influential networks',
      12: ' while deepening spiritual understanding'
    };
    
    return {
      moonMod: moonMods[moonHouse] || '',
      sunMod: sunMods[sunHouse] || ''
    };
  }

  /**
   * Generate love prediction based on authentic calculations
   */
  private static generateLovePrediction(sign: string, effects: any, transitData: JyotishaTransitData, period?: string): string {
    const venus = transitData.planets?.find(p => p.name === 'Venus');
    const venusSign = venus?.sign || 'current position';
    
    // Calculate Venus house position relative to this sign
    const signIndex = this.VEDIC_SIGNS.findIndex(s => s.english === sign);
    const venusSignIndex = this.VEDIC_SIGNS.findIndex(s => s.english === venusSign);
    const venusHouse = ((venusSignIndex - signIndex + 12) % 12) + 1;
    
    // House-based effects are more accurate than sign-based effects
    const venusHouseEffects = {
      1: 'enhances personal charm and attracts romantic opportunities directly to you',
      2: 'brings material comfort and sensual pleasures in relationships',
      3: 'improves romantic communication and connections with siblings/friends',
      4: 'deepens emotional security and domestic harmony in love',
      5: 'amplifies creative romance, dating, and passionate self-expression',
      6: 'focuses on daily romantic routines and service-oriented love',
      7: 'harmonizes partnerships and attracts committed relationships',
      8: 'intensifies emotional depth and transformative romantic experiences',
      9: 'expands romantic horizons through philosophy, travel, or higher learning',
      10: 'brings public recognition to relationships and professional romance',
      11: 'manifests romantic wishes and connects you with like-minded partners',
      12: 'encourages spiritual love connections and selfless romantic service'
    };
    
    const venusEffect = venusHouseEffects[venusHouse] || 'brings balanced romantic energy';
    
    // Add period-specific timing guidance
    const periodGuidance = period === 'weekly' ? 
      'Plan meaningful romantic gestures throughout the week.' :
      period === 'monthly' ? 
      'This month offers opportunities for deeper relationship development.' :
      'Focus on emotional authenticity in relationships.';
    
    return `Venus in ${venusSign} (${venusHouse}${this.getOrdinalSuffix(venusHouse)} house for ${sign}) ${venusEffect}. ${effects.nakshatraEffect?.includes('relationship') || effects.nakshatraEffect?.includes('pleasure') ? 'The current lunar mansion supports romantic connections.' : periodGuidance}`;
  }

  /**
   * Generate career prediction based on authentic calculations
   */
  private static generateCareerPrediction(sign: string, effects: any, transitData: JyotishaTransitData, period?: string): string {
    const jupiter = transitData.planets?.find(p => p.name === 'Jupiter');
    const saturn = transitData.planets?.find(p => p.name === 'Saturn');
    
    const careerPlanet = jupiter || saturn;
    const careerPlanetSign = careerPlanet?.sign || 'current position';
    
    // Calculate career planet house position relative to this sign
    const signIndex = this.VEDIC_SIGNS.findIndex(s => s.english === sign);
    const careerSignIndex = this.VEDIC_SIGNS.findIndex(s => s.english === careerPlanetSign);
    const careerHouse = ((careerSignIndex - signIndex + 12) % 12) + 1;
    
    // House-based career effects are more accurate than sign-based effects
    const careerHouseEffects = {
      1: 'enhances personal leadership abilities and career initiative',
      2: 'strengthens financial skills and value-based professional growth',
      3: 'improves communication, writing, and networking in your career',
      4: 'brings career opportunities through family connections or real estate',
      5: 'amplifies creative career pursuits and speculative professional gains',
      6: 'focuses on service-oriented work and daily professional routines',
      7: 'enhances business partnerships and client relationship management',
      8: 'brings transformative career changes and research-oriented opportunities',
      9: 'expands career through higher education, international connections, or teaching',
      10: 'directly boosts career status, reputation, and professional recognition',
      11: 'manifests career goals through networking and group professional activities',
      12: 'encourages foreign career opportunities and behind-the-scenes professional work'
    };
    
    const careerEffect = careerHouseEffects[careerHouse] || 'brings balanced professional energy';
    
    // Add period-specific career timing
    const periodCareerTiming = period === 'weekly' ? 
      'Key professional developments expected mid-week.' :
      period === 'monthly' ? 
      'Major career milestones possible in the second half of the month.' :
      'Focus on steady progress and professional relationships.';
    
    const planetName = careerPlanet?.name || 'Current planetary influence';
    return `${planetName} in ${careerPlanetSign} (${careerHouse}${this.getOrdinalSuffix(careerHouse)} house for ${sign}) ${careerEffect}. ${effects.dashaEffect ? `Your current planetary period of ${effects.dashaEffect} supports career advancement.` : periodCareerTiming}`;
  }

  /**
   * Generate health prediction based on authentic calculations
   */
  private static generateHealthPrediction(sign: string, effects: any, transitData: JyotishaTransitData, period?: string): string {
    const mars = transitData.planets?.find(p => p.name === 'Mars');
    const marsSign = mars?.sign || 'current position';
    
    // Calculate Mars house position relative to this sign
    const signIndex = this.VEDIC_SIGNS.findIndex(s => s.english === sign);
    const marsSignIndex = this.VEDIC_SIGNS.findIndex(s => s.english === marsSign);
    const marsHouse = ((marsSignIndex - signIndex + 12) % 12) + 1;
    
    // House-based health effects are more accurate than sign-based effects
    const marsHouseHealthEffects = {
      1: 'energizes your physical constitution and vitality, focus on head/brain health',
      2: 'affects speech and eating habits, pay attention to dental and throat health',
      3: 'influences energy levels and courage, watch for respiratory issues',
      4: 'impacts emotional well-being and chest area, focus on heart health',
      5: 'affects creative energy and stomach region, maintain digestive balance',
      6: 'directly influences health through disease/healing, emphasize preventive care',
      7: 'affects partnerships and kidney function, balance activity with rest',
      8: 'brings transformative health changes, focus on detoxification and regeneration',
      9: 'impacts liver and hips, maintain flexibility and avoid excessive indulgence',
      10: 'affects bones and joints, pay attention to structural body alignment',
      11: 'influences circulation and ankles, maintain regular exercise routines',
      12: 'affects feet and immune system, focus on spiritual healing and rest'
    };
    
    const healthEffect = marsHouseHealthEffects[marsHouse] || 'brings balanced energy to all body systems';
    
    // Add period-specific health guidance
    const periodHealthGuidance = period === 'weekly' ? 
      'Schedule health checkups and start new wellness routines this week.' :
      period === 'monthly' ? 
      'Ideal month for major health improvements and lifestyle changes.' :
      'Maintain regular exercise and proper rest cycles.';
    
    return `Mars in ${marsSign} (${marsHouse}${this.getOrdinalSuffix(marsHouse)} house for ${sign}) ${healthEffect}. ${effects.nakshatraEffect?.includes('healing') ? 'The current lunar mansion supports healing activities.' : periodHealthGuidance}`;
  }

  /**
   * Generate finances prediction based on authentic calculations
   */
  private static generateFinancesPrediction(sign: string, effects: any, transitData: JyotishaTransitData, period?: string): string {
    const jupiter = transitData.planets?.find(p => p.name === 'Jupiter');
    const mercury = transitData.planets?.find(p => p.name === 'Mercury');
    
    const wealthPlanet = jupiter || mercury;
    const wealthPlanetSign = wealthPlanet?.sign || 'current position';
    
    // Calculate wealth planet house position relative to this sign
    const signIndex = this.VEDIC_SIGNS.findIndex(s => s.english === sign);
    const wealthSignIndex = this.VEDIC_SIGNS.findIndex(s => s.english === wealthPlanetSign);
    const wealthHouse = ((wealthSignIndex - signIndex + 12) % 12) + 1;
    
    // House-based financial effects are more accurate than sign-based effects
    const financeHouseEffects = {
      1: 'enhances personal earning capacity and financial confidence',
      2: 'directly boosts income, savings, and material accumulation',
      3: 'improves financial communication and small business ventures',
      4: 'brings wealth through real estate, family assets, or domestic businesses',
      5: 'amplifies speculative gains, creative income, and entertainment investments',
      6: 'focuses on service-based income and health-related financial matters',
      7: 'enhances business partnerships and client-based financial growth',
      8: 'brings transformative financial changes and joint resource management',
      9: 'expands wealth through international business, publishing, or higher education',
      10: 'directly boosts career income, reputation-based earnings, and professional status',
      11: 'manifests financial goals through networking and large-scale group investments',
      12: 'encourages foreign income, charitable giving, and spiritual financial practices'
    };
    
    const financeEffect = financeHouseEffects[wealthHouse] || 'brings balanced financial energy';
    
    // Add period-specific financial timing
    const periodFinanceTiming = period === 'weekly' ? 
      'Mid-week favors important financial decisions and negotiations.' :
      period === 'monthly' ? 
      'Significant financial opportunities emerge in the final week of the month.' :
      'Focus on practical money management and avoid impulsive decisions.';
    
    const planetName = wealthPlanet?.name || 'Current planetary influence';
    return `${planetName} in ${wealthPlanetSign} (${wealthHouse}${this.getOrdinalSuffix(wealthHouse)} house for ${sign}) ${financeEffect}. ${effects.beneficTransits?.some(t => t.includes('Jupiter')) ? 'Jupiter\'s positive influence supports financial growth.' : periodFinanceTiming}`;
  }

  /**
   * Generate spirituality prediction based on authentic calculations
   */
  private static generateSpiritualityPrediction(sign: string, effects: any, transitData: JyotishaTransitData, period?: string): string {
    const ketu = transitData.planets?.find(p => p.name === 'Ketu');
    const jupiter = transitData.planets?.find(p => p.name === 'Jupiter');
    
    const spiritualPlanet = ketu || jupiter;
    const spiritualEffect = spiritualPlanet ? `${spiritualPlanet.name} in ${spiritualPlanet.sign} ` : '';
    
    const signSpiritualPaths = {
      'Aries': 'awakens warrior spirit and dynamic spiritual practices',
      'Taurus': 'grounds spiritual energy through nature and sensory practices',
      'Gemini': 'explores diverse spiritual teachings and intellectual understanding',
      'Cancer': 'nurtures spiritual growth through emotional and family connections',
      'Leo': 'expresses spiritual creativity and generous dharmic actions',
      'Virgo': 'perfects spiritual discipline through service and detailed practice',
      'Libra': 'harmonizes spiritual path with relationships and aesthetic beauty',
      'Scorpio': 'transforms through deep spiritual investigation and mystical practices',
      'Sagittarius': 'expands spiritual horizons through philosophy and pilgrimage',
      'Capricorn': 'builds spiritual authority through disciplined practice and tradition',
      'Aquarius': 'innovates spiritual understanding and contributes to collective consciousness',
      'Pisces': 'dissolves ego through compassionate service and intuitive wisdom'
    };
    
    const spiritualPath = signSpiritualPaths[sign] || 'brings balanced spiritual energy';
    
    // Add period-specific spiritual guidance
    const periodSpiritualGuidance = period === 'weekly' ? 
      'Dedicate time each day this week for spiritual practices and inner reflection.' :
      period === 'monthly' ? 
      'This month offers profound opportunities for spiritual awakening and growth.' :
      'Regular meditation and self-reflection bring clarity.';
    
    return `${spiritualEffect}${spiritualPath}. ${effects.dashaEffect && effects.dashaEffect.includes('spiritual') ? 'Your current planetary period supports spiritual growth.' : periodSpiritualGuidance}`;
  }

  /**
   * Generate lucky elements based on planetary positions
   */
  private static generateLuckyElements(sign: string, transitData: JyotishaTransitData): any {
    const signIndex = this.VEDIC_SIGNS.findIndex(s => s.english === sign);
    const moonPosition = transitData.planets?.find(p => p.name === 'Moon');
    
    // Generate numbers based on sign and Moon position
    const baseNumbers = [signIndex + 1, (signIndex + 3) % 12 + 1, (signIndex + 7) % 12 + 1];
    const moonNumbers = moonPosition ? [Math.floor(moonPosition.longitude / 30) + 1] : [];
    
    // Generate colors based on planetary influences
    const signColors = this.getSignColors(sign);
    const planetaryColors = this.getPlanetaryColors(transitData.planets || []);
    
    return {
      numbers: [...baseNumbers, ...moonNumbers].slice(0, 3),
      colors: [...signColors, ...planetaryColors].slice(0, 3),
      favorableTime: this.calculateFavorableTime(transitData),
      avoidTime: this.calculateAvoidTime(transitData)
    };
  }

  /**
   * Get sign-specific colors
   */
  private static getSignColors(sign: string): string[] {
    const signColors = {
      'Aries': ['Red', 'Orange', 'Maroon'],
      'Taurus': ['Green', 'Pink', 'White'],
      'Gemini': ['Yellow', 'Green', 'Silver'],
      'Cancer': ['White', 'Silver', 'Blue'],
      'Leo': ['Gold', 'Orange', 'Red'],
      'Virgo': ['Green', 'Brown', 'Navy'],
      'Libra': ['Pink', 'Blue', 'White'],
      'Scorpio': ['Red', 'Black', 'Maroon'],
      'Sagittarius': ['Yellow', 'Orange', 'Purple'],
      'Capricorn': ['Black', 'Brown', 'Gray'],
      'Aquarius': ['Blue', 'Turquoise', 'Silver'],
      'Pisces': ['Sea Green', 'Yellow', 'Pink']
    };
    
    return signColors[sign] || ['White', 'Silver', 'Gold'];
  }

  /**
   * Get planetary colors
   */
  private static getPlanetaryColors(planets: any[]): string[] {
    const planetColors = {
      'Sun': 'Gold',
      'Moon': 'Silver',
      'Mars': 'Red',
      'Mercury': 'Green',
      'Jupiter': 'Yellow',
      'Venus': 'Pink',
      'Saturn': 'Blue'
    };
    
    return planets.slice(0, 2).map(p => planetColors[p.name]).filter(Boolean);
  }

  /**
   * Calculate favorable time based on planetary positions
   */
  private static calculateFavorableTime(transitData: JyotishaTransitData): string {
    // Use Moon position to determine favorable time
    const moonPosition = transitData.planets?.find(p => p.name === 'Moon');
    if (!moonPosition) return '10:00 AM - 2:00 PM';
    
    const moonSign = Math.floor(moonPosition.longitude / 30);
    const favorableTimes = [
      '6:00 AM - 10:00 AM',
      '10:00 AM - 2:00 PM',
      '2:00 PM - 6:00 PM',
      '6:00 PM - 10:00 PM'
    ];
    
    return favorableTimes[moonSign % 4];
  }

  /**
   * Calculate avoid time based on planetary positions
   */
  private static calculateAvoidTime(transitData: JyotishaTransitData): string {
    // Use Saturn position to determine challenging time
    const saturn = transitData.planets?.find(p => p.name === 'Saturn');
    if (!saturn) return '6:00 PM - 8:00 PM';
    
    const saturnSign = Math.floor(saturn.longitude / 30);
    const avoidTimes = [
      '12:00 PM - 2:00 PM',
      '6:00 PM - 8:00 PM',
      '8:00 PM - 10:00 PM',
      '10:00 PM - 12:00 AM'
    ];
    
    return avoidTimes[saturnSign % 4];
  }

  /**
   * Generate Nakshatra-specific insight
   */
  private static generateNakshatraInsight(nakshatra: string, sign: string): string {
    const nakshatraInsights = {
      'Ashwini': 'Swift healing and new beginnings are favored',
      'Bharani': 'Transformation through patience and endurance',
      'Krittika': 'Sharp focus and purification of goals',
      'Rohini': 'Material beauty and creative expression flourish',
      'Mrigashira': 'Seeking new knowledge and exploration',
      'Ardra': 'Emotional breakthroughs and storm clearing',
      'Punarvasu': 'Renewal and return to prosperity',
      'Pushya': 'Nourishment and spiritual growth',
      'Ashlesha': 'Mystical insights and inner wisdom',
      'Magha': 'Ancestral connections and royal treatment',
      'Purva Phalguni': 'Creative pleasure and romantic success',
      'Uttara Phalguni': 'Service to others and partnership',
      'Hasta': 'Skilled work and manual dexterity',
      'Chitra': 'Artistic creation and beautiful appearance',
      'Swati': 'Independence and flexible adaptation',
      'Vishakha': 'Determined pursuit of goals',
      'Anuradha': 'Friendship and devotional practices',
      'Jyeshtha': 'Leadership and protective responsibility',
      'Mula': 'Root causes and fundamental investigation',
      'Purva Ashadha': 'Invincible strength and victory',
      'Uttara Ashadha': 'Ultimate success and dharmic path',
      'Shravana': 'Learning and careful listening',
      'Dhanishta': 'Wealth creation and rhythmic success',
      'Shatabhisha': 'Healing powers and innovative solutions',
      'Purva Bhadrapada': 'Spiritual intensity and passionate focus',
      'Uttara Bhadrapada': 'Cosmic consciousness and deep wisdom',
      'Revati': 'Completion and compassionate service'
    };
    
    return nakshatraInsights[nakshatra] || 'Balanced cosmic influence supports your journey';
  }



  /**
   * Get cache statistics
   */
  static getCacheStats(): any {
    return {
      entries: this.cache.size,
      keys: Array.from(this.cache.keys()),
      lastUpdated: Array.from(this.cache.values()).map(v => new Date(v.timestamp).toISOString())
    };
  }
}

/**
 * Express route handlers
 */
export async function generateJyotishaDailyHoroscopes(req: Request, res: Response) {
  try {
    const { date } = req.query;
    const horoscopes = await JyotishaHoroscopeGenerator.generateDailyHoroscope(date as string);
    
    res.json({
      success: true,
      date: date || DateTime.now().setZone('Asia/Kolkata').toISODate(),
      horoscopes: horoscopes,
      calculationEngine: 'Jyotisha-Official',
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Jyotisha daily horoscope error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate daily horoscope'
    });
  }
}

export async function generateJyotishaWeeklyHoroscopes(req: Request, res: Response) {
  try {
    const { startDate } = req.query;
    const horoscopes = await JyotishaHoroscopeGenerator.generateWeeklyHoroscope(startDate as string);
    
    res.json({
      success: true,
      startDate: startDate || DateTime.now().setZone('Asia/Kolkata').startOf('week').toISODate(),
      horoscopes: horoscopes,
      calculationEngine: 'Jyotisha-Official',
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Jyotisha weekly horoscope error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate weekly horoscope'
    });
  }
}

export async function generateJyotishaMonthlyHoroscopes(req: Request, res: Response) {
  try {
    const { month, year } = req.query;
    const horoscopes = await JyotishaHoroscopeGenerator.generateMonthlyHoroscope(
      month ? parseInt(month as string) : undefined,
      year ? parseInt(year as string) : undefined
    );
    
    res.json({
      success: true,
      month: month || DateTime.now().setZone('Asia/Kolkata').month,
      year: year || DateTime.now().setZone('Asia/Kolkata').year,
      horoscopes: horoscopes,
      calculationEngine: 'Jyotisha-Official',
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Jyotisha monthly horoscope error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate monthly horoscope'
    });
  }
}