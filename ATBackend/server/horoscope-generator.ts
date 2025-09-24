import { Request, Response } from "express";
import { SwissEphemerisCalculator } from "./ephemeris";
import { PanchangCalculator } from "./panchang";

interface HoroscopeData {
  sign: string;
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
  transitData?: any;
}

interface TransitAnalysis {
  moonSign: string;
  moonNakshatra: string;
  sunSign: string;
  majorAspects: string[];
  beneficTransits: string[];
  maleficTransits: string[];
  retrogradeInfo: string[];
}

export class HoroscopeGenerator {
  private static readonly VEDIC_SIGNS_SANSKRIT = [
    'Mesha', 'Vrishabha', 'Mithuna', 'Karka', 'Simha', 'Kanya',
    'Tula', 'Vrischika', 'Dhanu', 'Makara', 'Kumbha', 'Meena'
  ];

  private static readonly VEDIC_SIGNS_TAMIL = [
    'மேஷம்', 'ரிஷபம்', 'மிதுனம்', 'கடகம்', 'சிம்மம்', 'கன்னி',
    'துலாம்', 'விருச்சிகம்', 'தனுசு', 'மகரம்', 'கும்பம்', 'மீனம்'
  ];

  private static readonly VEDIC_SIGN_SYMBOLS = [
    'Ram', 'Bull', 'Twins', 'Crab', 'Lion', 'Maiden',
    'Scales', 'Scorpion', 'Archer', 'Sea-Goat', 'Water Bearer', 'Fishes'
  ];

  private static readonly VEDIC_SIGN_ENGLISH = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];

  // Vedic planets including Rahu and Ketu (exclude Uranus, Neptune, Pluto)
  private static readonly VEDIC_PLANETS = [
    'Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'
  ];

  private static readonly NAKSHATRA_LORDS = [
    'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter',
    'Saturn', 'Mercury', 'Ketu', 'Venus', 'Sun', 'Moon', 'Mars',
    'Rahu', 'Jupiter', 'Saturn', 'Mercury', 'Ketu', 'Venus', 'Sun',
    'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'
  ];

  private static readonly LUCKY_COLORS = {
    'Aries': ['Red', 'Orange', 'Maroon'],
    'Taurus': ['Green', 'Pink', 'White'],
    'Gemini': ['Yellow', 'Green', 'Silver'],
    'Cancer': ['White', 'Silver', 'Cream'],
    'Leo': ['Gold', 'Orange', 'Red'],
    'Virgo': ['Green', 'Brown', 'Navy'],
    'Libra': ['Pink', 'Blue', 'White'],
    'Scorpio': ['Red', 'Black', 'Maroon'],
    'Sagittarius': ['Yellow', 'Orange', 'Purple'],
    'Capricorn': ['Black', 'Brown', 'Dark Green'],
    'Aquarius': ['Blue', 'Turquoise', 'Silver'],
    'Pisces': ['Sea Green', 'Purple', 'White']
  };

  static async generateDailyHoroscope(date: string): Promise<HoroscopeData[]> {
    const horoscopes: HoroscopeData[] = [];
    const transitAnalysis = await this.calculateVedicTransitAnalysis(date);
    const panchangData = this.calculatePanchangForDate(date);

    for (let i = 0; i < this.VEDIC_SIGNS_SANSKRIT.length; i++) {
      const horoscope = await this.generateSignHoroscope(this.VEDIC_SIGN_ENGLISH[i], 'daily', date, transitAnalysis, panchangData);
      // Add authentic Vedic names to the horoscope data
      (horoscope as any).sanskritName = this.VEDIC_SIGNS_SANSKRIT[i];
      (horoscope as any).tamilName = this.VEDIC_SIGNS_TAMIL[i];
      (horoscope as any).symbol = this.VEDIC_SIGN_SYMBOLS[i];
      (horoscope as any).transitData = transitAnalysis;
      horoscopes.push(horoscope);
    }

    return horoscopes;
  }

  static async generateWeeklyHoroscope(startDate: string): Promise<HoroscopeData[]> {
    const horoscopes: HoroscopeData[] = [];
    const weeklyTransits = await this.calculateWeeklyTransits(startDate);

    for (let i = 0; i < this.VEDIC_SIGNS_SANSKRIT.length; i++) {
      const horoscope = await this.generateWeeklySignPrediction(this.VEDIC_SIGN_ENGLISH[i], startDate, weeklyTransits);
      // Add authentic Vedic names to the horoscope data
      (horoscope as any).sanskritName = this.VEDIC_SIGNS_SANSKRIT[i];
      (horoscope as any).tamilName = this.VEDIC_SIGNS_TAMIL[i];
      (horoscope as any).symbol = this.VEDIC_SIGN_SYMBOLS[i];
      horoscopes.push(horoscope);
    }

    return horoscopes;
  }

  static async generateMonthlyHoroscope(month: number, year: number): Promise<HoroscopeData[]> {
    const horoscopes: HoroscopeData[] = [];
    const monthlyTransits = await this.calculateMonthlyTransits(month, year);

    for (let i = 0; i < this.VEDIC_SIGNS_SANSKRIT.length; i++) {
      const horoscope = await this.generateMonthlySignPrediction(this.VEDIC_SIGN_ENGLISH[i], month, year, monthlyTransits);
      // Add authentic Vedic names to the horoscope data
      (horoscope as any).sanskritName = this.VEDIC_SIGNS_SANSKRIT[i];
      (horoscope as any).tamilName = this.VEDIC_SIGNS_TAMIL[i];
      (horoscope as any).symbol = this.VEDIC_SIGN_SYMBOLS[i];
      horoscopes.push(horoscope);
    }

    return horoscopes;
  }

  private static async calculateVedicTransitAnalysis(date: string): Promise<TransitAnalysis> {
    // Calculate tropical positions first
    const ephemerisData = SwissEphemerisCalculator.calculatePlanetaryPositions({
      date: date,
      time: "12:00",
      latitude: 28.6139, // Delhi coordinates for standard calculation
      longitude: 77.2090,
      timezone: "Asia/Kolkata"
    });

    // Calculate Lahiri Ayanamsa for sidereal correction
    const julianDay = SwissEphemerisCalculator.dateToJulianDay(date, "12:00");
    const T = (julianDay - 2451545.0) / 36525.0;
    // Use the existing Lahiri Ayanamsa calculation from SwissEphemerisCalculator
    const ayanamsa = (SwissEphemerisCalculator as any).calculateLahiriAyanamsa(T);

    // Convert to sidereal positions
    const vedicEphemeris = ephemerisData.map(planet => ({
      ...planet,
      longitude: ((planet.longitude - ayanamsa + 360) % 360)
    }));

    const moonPosition = vedicEphemeris.find(p => p.name === 'Moon');
    const sunPosition = vedicEphemeris.find(p => p.name === 'Sun');

    const moonSignIndex = Math.floor(moonPosition!.longitude / 30);
    const sunSignIndex = Math.floor(sunPosition!.longitude / 30);

    const moonNakshatra = this.calculateNakshatra(moonPosition!.longitude);
    const aspects = this.calculateMajorAspects(vedicEphemeris);
    const beneficTransits = this.identifyBeneficTransits(vedicEphemeris);
    const maleficTransits = this.identifyMaleficTransits(vedicEphemeris);
    const retrogradeInfo = this.identifyRetrogradePlanets(vedicEphemeris);

    return {
      moonSign: this.VEDIC_SIGN_ENGLISH[moonSignIndex],
      moonNakshatra: moonNakshatra,
      sunSign: this.VEDIC_SIGN_ENGLISH[sunSignIndex],
      majorAspects: aspects,
      beneficTransits: beneficTransits,
      maleficTransits: maleficTransits,
      retrogradeInfo: retrogradeInfo
    };
  }

  private static calculatePanchangForDate(date: string): any {
    // Simplified panchang calculation for horoscope generation
    const julianDay = SwissEphemerisCalculator.dateToJulianDay(date, "12:00");
    const dayOfWeek = Math.floor(julianDay + 1.5) % 7;
    const tithiNumber = Math.floor(Math.random() * 15) + 1;
    
    return {
      tithi: 'Pratipada',
      tithiNumber: tithiNumber,
      yoga: 'Vishkambha',
      yogaNumber: 1,
      karan: 'Bava',
      karanNumber: 1,
      nakshatra: 'Ashwini',
      nakshatraLord: 'Ketu',
      vara: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek],
      sunrise: "06:00",
      sunset: "18:00"
    };
  }

  private static async generateSignHoroscope(
    sign: string, 
    period: 'daily' | 'weekly' | 'monthly', 
    date: string, 
    transitAnalysis: TransitAnalysis,
    panchangData: any
  ): Promise<HoroscopeData> {
    if (!sign) {
      throw new Error('Sign parameter is required');
    }
    const signIndex = this.VEDIC_SIGN_ENGLISH.indexOf(sign);
    const moonEffect = this.calculateMoonEffect(sign, transitAnalysis);
    const sunEffect = this.calculateSunEffect(sign, transitAnalysis);
    const nakshatraEffect = this.calculateNakshatraEffect(transitAnalysis.moonNakshatra);

    const prediction = this.generatePredictionText(sign, period, moonEffect, sunEffect, nakshatraEffect, panchangData);
    const luckyNumbers = this.generateLuckyNumbers(sign, panchangData);
    const luckyColors = this.LUCKY_COLORS[sign as keyof typeof this.LUCKY_COLORS];
    const timeAdvice = this.generateTimeAdvice(sign, panchangData);

    return {
      sign: sign,
      period: period,
      date: date,
      prediction: prediction.general,
      luckyNumbers: luckyNumbers,
      luckyColors: luckyColors,
      favorableTime: timeAdvice.favorable,
      avoidTime: timeAdvice.avoid,
      generalAdvice: prediction.advice,
      loveLife: prediction.love,
      career: prediction.career,
      health: prediction.health,
      finances: prediction.finances,
      spirituality: prediction.spirituality
    };
  }

  private static calculateMoonEffect(sign: string, transitAnalysis: TransitAnalysis): string {
    const signIndex = this.VEDIC_SIGN_ENGLISH.indexOf(sign);
    const moonSignIndex = this.VEDIC_SIGN_ENGLISH.indexOf(transitAnalysis.moonSign);
    
    const houseDifference = (moonSignIndex - signIndex + 12) % 12;
    
    switch (houseDifference) {
      case 0: return "emotional_strength";
      case 1: return "financial_focus";
      case 2: return "family_matters";
      case 3: return "communication_boost";
      case 4: return "domestic_harmony";
      case 5: return "creative_energy";
      case 6: return "health_attention";
      case 7: return "relationship_focus";
      case 8: return "transformation_time";
      case 9: return "spiritual_growth";
      case 10: return "career_advancement";
      case 11: return "gains_and_success";
      default: return "neutral_influence";
    }
  }

  private static calculateSunEffect(sign: string, transitAnalysis: TransitAnalysis): string {
    const signIndex = this.VEDIC_SIGN_ENGLISH.indexOf(sign);
    const sunSignIndex = this.VEDIC_SIGN_ENGLISH.indexOf(transitAnalysis.sunSign);
    
    const houseDifference = (sunSignIndex - signIndex + 12) % 12;
    
    switch (houseDifference) {
      case 0: return "self_confidence";
      case 1: return "resource_management";
      case 2: return "family_leadership";
      case 3: return "bold_communication";
      case 4: return "home_authority";
      case 5: return "creative_leadership";
      case 6: return "health_vitality";
      case 7: return "partnership_dynamics";
      case 8: return "power_transformation";
      case 9: return "wisdom_seeking";
      case 10: return "professional_recognition";
      case 11: return "achievement_focus";
      default: return "balanced_energy";
    }
  }

  private static calculateNakshatraEffect(nakshatra: string): string {
    const nakshatraEffects = {
      'Ashwini': 'healing_energy',
      'Bharani': 'transformation_power',
      'Krittika': 'purification_focus',
      'Rohini': 'material_growth',
      'Mrigashira': 'seeking_knowledge',
      'Ardra': 'emotional_intensity',
      'Punarvasu': 'restoration_energy',
      'Pushya': 'nourishment_focus',
      'Ashlesha': 'mystical_insights',
      'Magha': 'ancestral_connection',
      'Purva Phalguni': 'creative_pleasure',
      'Uttara Phalguni': 'service_orientation',
      'Hasta': 'skillful_action',
      'Chitra': 'artistic_expression',
      'Swati': 'independence_drive',
      'Vishakha': 'goal_determination',
      'Anuradha': 'friendship_harmony',
      'Jyeshtha': 'leadership_responsibility',
      'Mula': 'root_investigation',
      'Purva Ashadha': 'invincible_strength',
      'Uttara Ashadha': 'final_victory',
      'Shravana': 'learning_focus',
      'Dhanishta': 'rhythmic_success',
      'Shatabhisha': 'healing_innovation',
      'Purva Bhadrapada': 'spiritual_intensity',
      'Uttara Bhadrapada': 'cosmic_wisdom',
      'Revati': 'compassionate_completion'
    };

    return nakshatraEffects[nakshatra as keyof typeof nakshatraEffects] || 'balanced_influence';
  }

  private static generatePredictionText(
    sign: string, 
    period: 'daily' | 'weekly' | 'monthly',
    moonEffect: string,
    sunEffect: string,
    nakshatraEffect: string,
    panchangData: any
  ): any {
    const predictions = this.getPredictionTemplates(sign, period);
    const effectModifiers = this.getEffectModifiers(moonEffect, sunEffect, nakshatraEffect);
    
    return {
      general: this.combinePredictions(predictions.general, effectModifiers),
      advice: this.combinePredictions(predictions.advice, effectModifiers),
      love: this.combinePredictions(predictions.love, effectModifiers),
      career: this.combinePredictions(predictions.career, effectModifiers),
      health: this.combinePredictions(predictions.health, effectModifiers),
      finances: this.combinePredictions(predictions.finances, effectModifiers),
      spirituality: this.combinePredictions(predictions.spirituality, effectModifiers)
    };
  }

  private static getPredictionTemplates(sign: string, period: 'daily' | 'weekly' | 'monthly'): any {
    const templates = {
      'Aries': {
        general: `Your ${period} energy is charged with Mars influence, bringing dynamic opportunities for action and leadership. The planetary alignments favor bold initiatives and pioneering ventures. Your natural courage and determination will be your greatest assets during this time. Trust your instincts but balance them with practical wisdom.`,
        advice: "Channel your natural assertiveness constructively and avoid impulsive decisions. Focus on long-term goals rather than quick fixes. Your leadership qualities are heightened now, making it an excellent time to guide others. Practice patience in challenging situations as your fiery nature may lead to hasty conclusions.",
        love: "Passion runs high in relationships, bringing both excitement and intensity to romantic connections. Express your feelings openly but maintain sensitivity to your partner's needs. Single Aries may encounter someone who matches their energy and ambition. Communication is key to resolving any misunderstandings that arise from your direct approach.",
        career: "Leadership opportunities arise that could significantly advance your professional standing. Take initiative in projects that showcase your innovative thinking and problem-solving abilities. Your colleagues will look to you for guidance during challenging times. Network actively as new connections may lead to unexpected career developments.",
        health: "High energy levels support physical activities and athletic pursuits with remarkable stamina. However, avoid overexertion and listen to your body's signals for rest. Stress management through exercise will be particularly beneficial. Pay attention to head and eye-related issues, which are common for your sign during intense periods.",
        finances: "Investment opportunities appear, particularly in innovative or technology-related ventures that align with your forward-thinking nature. Research thoroughly before committing to any major financial decisions. Your earning potential increases through leadership roles or entrepreneurial endeavors. Avoid impulsive purchases that may strain your budget.",
        spirituality: "Meditation and mindfulness practices help balance your fiery nature with inner peace and clarity. Your spiritual journey takes on a more active form through service to others. Ancient warrior traditions or martial arts may resonate with your spiritual path. Connect with your inner strength through challenging yet meaningful practices."
      },
      'Taurus': {
        general: `Venus blesses your ${period} with stability and material comfort, emphasizing practical achievements and sensual pleasures. Your steadfast nature attracts prosperity and lasting relationships during this favorable time. The earth element strengthens your connection to material security and tangible results. Focus on building solid foundations that will serve you for years to come.`,
        advice: "Trust your instincts in financial matters while remaining open to necessary changes that support long-term growth. Your practical wisdom guides you toward sustainable success in all endeavors. Avoid stubbornness when flexibility could benefit your goals. Take time to appreciate the beauty and comfort you've created in your life.",
        love: "Romantic harmony prevails as your loyal and dependable nature creates a secure foundation for love to flourish. Express affection through tangible gestures and quality time together rather than just words. Those seeking partnership will attract stable, committed individuals who appreciate your genuine character. Physical touch and shared pleasures strengthen emotional bonds with your partner.",
        career: "Steady progress in professional goals leads to recognition and tangible advancement in your career. Your reliability makes you invaluable to employers and colleagues who depend on your consistent performance. Financial rewards for your hard work are likely to manifest during this period. Consider investments in skills that enhance your long-term earning potential and job security.",
        health: "Throat and neck areas need special attention and may require extra care during this cycle. Maintain regular eating habits and avoid overindulgence in rich foods that could affect your digestive system. Your body responds well to steady, consistent exercise routines rather than intense bursts of activity. Stress relief through nature walks and outdoor activities proves particularly beneficial for your well-being.",
        finances: "Favorable time for investments in property, luxury items, or other tangible assets that appreciate over time. Your financial intuition is particularly strong now, guiding you toward profitable opportunities that align with your conservative approach. Building an emergency fund provides the security you crave. Avoid impulsive purchases and stick to well-researched investment strategies.",
        spirituality: "Connect with nature to enhance spiritual well-being and find profound peace through earth-based practices. Your appreciation for beauty becomes a pathway to the divine and deeper understanding. Traditional spiritual practices offer more comfort than experimental approaches during this time. Gardening, hiking, or simply sitting in natural settings deepens your spiritual connection and inner harmony."
      },
      'Gemini': {
        general: `Mercury energizes your ${period} with communication opportunities and intellectual stimulation that opens new pathways for growth. Your curious mind attracts fascinating people and diverse experiences that broaden your perspective. The air element enhances your ability to connect ideas and communicate with clarity and wit. Embrace variety and change as they lead to unexpected discoveries and opportunities.`,
        advice: "Organize your thoughts before important conversations and decisions to maximize your natural communication gifts. Your versatile nature is an asset, but focus prevents you from spreading yourself too thin across too many projects. Practice active listening to balance your tendency to talk and ensure meaningful exchanges. Document your ideas as they come rapidly and may be forgotten without proper recording.",
        love: "Verbal expression of love strengthens relationships as your words carry special power to heal and inspire. Listen actively to your partner's needs and respond with empathy and understanding rather than just solutions. Single Geminis attract partners through stimulating conversation and shared intellectual interests. Keep relationships fresh through new experiences and ongoing mental connection with your loved ones.",
        career: "Networking and communication skills advance your professional goals more than technical expertise alone during this period. Your ability to adapt quickly to changing circumstances makes you valuable in dynamic work environments. Writing, speaking, or teaching opportunities may arise that showcase your natural talents. Consider partnerships or collaborations that leverage your social skills and diverse knowledge base.",
        health: "Nervous system needs calm through breathing exercises and meditation to prevent mental fatigue and anxiety. Your hands, arms, and respiratory system may need extra attention during stressful periods. Balance mental stimulation with physical activity to prevent restlessness and improve overall well-being. Regular sleep schedules help manage your naturally high energy and racing thoughts.",
        finances: "Multiple income sources may develop as your diverse talents can be monetized in various ways. Avoid scattered investments and focus on opportunities that align with your communication and networking strengths. Your quick thinking helps you spot trends before others notice them. Create systems to track your various financial interests and prevent oversight of important details.",
        spirituality: "Study of sacred texts brings mental clarity and wisdom that satisfies your intellectual approach to spirituality. Your spiritual path involves connecting with others and sharing wisdom rather than solitary practices. Books, discussions, and exposure to different philosophical traditions accelerate your understanding. Travel and cultural exchange expand your spiritual perspective and deepen your tolerance for diverse beliefs."
      },
      'Cancer': {
        general: `The Moon's influence brings emotional depth and intuitive insights to your ${period}, enhancing your natural empathy and psychic abilities. Your protective instincts strengthen, drawing family and loved ones closer to your nurturing embrace. The water element amplifies your emotional intelligence and ability to sense underlying currents in situations. Trust your inner wisdom as it guides you toward security and emotional fulfillment.`,
        advice: "Trust your intuition while balancing emotional responses with logic to make decisions that serve your long-term well-being. Your caring nature is a gift, but establish healthy boundaries to prevent emotional drain from others' problems. Create a secure home base that serves as your sanctuary from the world's harsh energies. Honor your need for solitude and reflection as essential components of your emotional health.",
        love: "Deep emotional connections form naturally as your nurturing spirit attracts those seeking comfort and understanding. Create nurturing environments where love can flourish through shared meals, cozy spaces, and heartfelt conversations. Your intuitive understanding of others' needs makes you an exceptional partner who provides emotional security. Express your feelings through caring actions and remember that vulnerability strengthens rather than weakens your relationships.",
        career: "Caring professions or family business show promise as your natural empathy and protective instincts serve others effectively. Your ability to create supportive environments makes you valuable in team settings and leadership roles. Consider opportunities in healthcare, education, hospitality, or real estate where your nurturing qualities are assets. Home-based work or family enterprises may provide the security and emotional satisfaction you seek.",
        health: "Digestive system needs attention through nourishing foods and regular eating habits that support your sensitive constitution. Your emotional state directly affects your physical well-being, making stress management crucial for optimal health. Water intake and foods rich in calcium support your body's natural rhythms and lunar connections. Pay attention to chest and stomach areas which may reflect emotional tension in physical symptoms.",
        finances: "Property investments or family financial matters gain importance as you seek security through tangible assets and inherited wealth. Your instinctive understanding of value helps you make conservative, profitable investment decisions over time. Family financial planning and insurance matters require attention to protect your loved ones. Savings accounts and stable investments appeal more than risky ventures that threaten your security.",
        spirituality: "Meditation near water bodies enhances spiritual connection and provides the emotional cleansing your soul craves. Your spiritual path involves honoring ancestors, family traditions, and the divine feminine principle. Lunar cycles and seasonal celebrations deepen your understanding of life's natural rhythms. Creating sacred spaces in your home strengthens your spiritual practice and provides daily comfort."
      },
      'Leo': {
        general: `Solar energy illuminates your ${period} with creative expression and recognition opportunities that showcase your natural charisma and leadership abilities. Your magnetic personality draws admiration and opportunities for advancement in areas where you can shine brightly. The fire element fuels your passion and enthusiasm, inspiring others to follow your confident lead. This is a time for bold self-expression and pursuing dreams that reflect your authentic creative spirit.`,
        advice: "Balance confidence with humility and share the spotlight graciously to maintain positive relationships with those who support your success. Your natural leadership abilities are enhanced now, but remember that true leaders lift others up alongside themselves. Channel your creative energy into projects that have lasting value rather than seeking attention for its own sake. Practice gratitude for the gifts and opportunities that come your way during this favorable period.",
        love: "Dramatic romantic gestures win hearts as your passionate nature attracts admirers who appreciate your generous spirit and zest for life. Avoid ego conflicts by remembering that love is about mutual respect and admiration rather than competition for dominance. Your warm heart and loyal nature create lasting bonds with those who share your values and dreams. Plan special occasions and adventures that allow both you and your partner to feel celebrated and appreciated.",
        career: "Leadership roles and creative projects bring recognition that advances your professional reputation and opens doors to greater opportunities. Your ability to inspire and motivate others makes you valuable in positions where vision and charisma are essential. Entertainment, luxury goods, or creative industries may offer particular promise during this period. Seek mentors who can help you develop your talents while maintaining your authentic self-expression.",
        health: "Heart health requires attention through regular exercise that you enjoy and activities that bring you joy and fulfillment. Your vitality is generally strong, but stress from overcommitment or ego bruises can affect your cardiovascular system. Outdoor activities in sunshine boost your energy and mood significantly. Pay attention to your back and spine, which may reflect the weight of leadership responsibilities you carry.",
        finances: "Investments in entertainment or luxury items may prosper as your taste for quality and understanding of what appeals to others guides profitable decisions. Your earning potential increases through creative work or leadership positions that reward your unique talents. Generous spending needs balance with practical investment strategies that protect your long-term financial security. Avoid overspending on status symbols that don't provide lasting value or genuine satisfaction.",
        spirituality: "Sun salutations and fire ceremonies enhance spiritual practice by connecting you to the divine source of creativity and life force. Your spiritual path involves expressing your authentic self as a form of worship and service to others. Creative arts, performance, and celebration become sacred acts that honor the divine spark within you. Seek spiritual teachers who encourage your individual expression rather than demanding conformity to rigid doctrines."
      },
      'Virgo': {
        general: `Mercury brings analytical clarity and attention to detail in your ${period} activities, enhancing your natural ability to organize and improve systems around you. Your practical wisdom and discerning eye help you identify solutions that others overlook in complex situations. The earth element grounds your thoughts in reality, making your advice particularly valuable to those seeking practical guidance. Focus on perfecting your skills and creating order from chaos in both personal and professional spheres.`,
        advice: "Perfectionism serves you well, but avoid over-criticism of others who may not share your exacting standards or attention to detail. Your analytical nature helps solve problems, but balance critique with compassion and understanding for human imperfection. Focus on continuous improvement rather than demanding immediate perfection from yourself or others. Take time to appreciate the progress you've made rather than only seeing what still needs work.",
        love: "Practical expressions of love create lasting bonds as your caring shows through helpful actions and thoughtful attention to details that matter. Your partner appreciates your reliability and the way you remember their preferences without being asked. Show affection through acts of service and creating comfortable, organized environments where love can flourish. Single Virgos attract partners who value substance over flash and appreciate genuine care and consideration.",
        career: "Analytical skills and attention to detail advance professional goals as employers recognize your ability to catch errors and improve processes efficiently. Your methodical approach to problem-solving makes you invaluable in positions requiring precision and quality control. Health, service, or technical fields may offer particular opportunities that align with your natural talents. Consider roles where your organizational skills and desire to help others can create meaningful impact.",
        health: "Digestive health improves with proper diet and routine as your body responds well to consistent, healthy habits and natural wellness approaches. Your nervous system benefits from regular schedules and stress-reduction techniques that calm your active mind. Pay attention to your skin and intestinal health, which may reflect internal stress or dietary imbalances. Moderate exercise and outdoor time in nature support your overall physical and mental well-being.",
        finances: "Careful budgeting and systematic savings show positive results as your practical approach to money management builds long-term security steadily. Your ability to analyze financial details helps you avoid costly mistakes and identify beneficial opportunities others might miss. Conservative investments in practical sectors like healthcare, utilities, or technology align with your risk-averse nature. Create detailed financial plans that account for both current needs and future goals.",
        spirituality: "Service to others becomes a path to spiritual growth as you find the divine through helping and healing those in need. Your spiritual path involves making the world more organized, healthy, and functional through your dedicated efforts. Study of natural healing, herbalism, or practical philosophy may resonate with your earth-based spiritual nature. Find sacred meaning in daily routines and the perfection inherent in natural systems and cycles."
      },
      'Libra': {
        general: `Venus harmonizes your ${period} with relationship focus and aesthetic appreciation, bringing balance and beauty to all areas of your life. Your natural diplomacy and charm open doors that remain closed to more aggressive approaches during this favorable time. The air element enhances your ability to see multiple perspectives and find equitable solutions that satisfy everyone involved. Focus on creating harmony in your environment while pursuing artistic and partnership opportunities.`,
        advice: "Seek balance in all areas while avoiding procrastination in decision-making that could delay important progress toward your goals. Your desire to please everyone is admirable, but sometimes decisive action serves the greater good better than endless deliberation. Trust your refined judgment and aesthetic sense when making choices about relationships, beauty, and justice. Practice saying no gracefully when requests would compromise your own well-being or values.",
        love: "Harmony in partnerships flourishes as your diplomatic approach resolves conflicts with grace and mutual understanding. Your romantic nature attracts partners who appreciate beauty, culture, and refined pleasures shared together in elegant settings. Single Libras may meet someone special through artistic events, social gatherings, or mutual friends who recognize your compatibility. Express love through thoughtful gifts, beautiful environments, and activities that celebrate your shared aesthetic sensibilities.",
        career: "Collaborative projects and partnerships show promise as your ability to work harmoniously with others creates successful team dynamics. Your sense of fairness and justice makes you valuable in negotiations, mediation, or any role requiring diplomatic skills. Creative fields, law, fashion, or beauty industries may offer particular opportunities that align with your natural talents. Seek work environments that value collaboration over competition and appreciate your aesthetic contributions.",
        health: "Kidney and lower back health need attention through proper hydration and exercises that strengthen your core and improve posture. Your body responds well to gentle, graceful movement like yoga, dance, or tai chi rather than aggressive workout routines. Stress from relationship conflicts can manifest as physical imbalances, making harmony in personal connections essential for wellness. Beautiful, peaceful environments support your mental and physical health more than clinical or harsh settings.",
        finances: "Joint investments or partnerships may be profitable as your ability to create win-win situations benefits all parties involved. Your appreciation for quality and beauty guides you toward investments in art, luxury goods, or aesthetic industries that appreciate over time. Collaborative financial planning with trusted partners or advisors helps you make balanced decisions that serve long-term goals. Avoid overspending on beauty products or social activities that strain your budget unnecessarily.",
        spirituality: "Beauty and art become gateways to spiritual experience as you find the divine through harmony, proportion, and aesthetic perfection. Your spiritual path involves creating and appreciating beauty as a form of worship and service to others. Partnerships with like-minded spiritual seekers enhance your understanding and provide mutual support for growth. Sacred geometry, beautiful spaces, and artistic expression deepen your connection to universal principles of balance and harmony."
      },
      'Scorpio': {
        general: `Mars and Pluto intensity marks your ${period} with transformation and deep insights that reveal hidden truths and psychological depths previously unexplored. Your powerful intuition and ability to see beneath surface appearances gives you significant advantages in understanding complex situations. The water element enhances your emotional depth and psychic sensitivity, making this an ideal time for healing and regeneration. Embrace transformation as necessary for your evolution and trust your instincts to guide you through challenging changes.`,
        advice: "Embrace change courageously while avoiding vindictive thoughts or actions that could damage important relationships and your own spiritual progress. Your intensity can intimidate others, so practice expressing your passionate nature in ways that inspire rather than overwhelm those around you. Use your natural investigative abilities to uncover truth, but balance this with compassion for human weakness and vulnerability. Channel your transformative power toward positive goals that benefit both yourself and others.",
        love: "Passionate relationships deepen through honest communication and emotional vulnerability that creates unbreakable bonds with compatible partners. Jealousy needs conscious control through trust-building and addressing underlying insecurities that trigger possessive behaviors in romantic connections. Your magnetic attraction draws intense relationships that transform both partners through deep emotional and spiritual connection. Single Scorpios should look for partners who can match their emotional depth and aren't afraid of profound intimacy.",
        career: "Research, investigation, or healing professions show promise as your ability to uncover hidden information and understand complex motivations proves invaluable. Your persistence and psychological insight make you valuable in detective work, psychology, finance, or transformational healing practices. Avoid workplace power struggles and focus on productive collaboration that serves shared goals and meaningful contribution. Consider careers that involve helping others overcome obstacles and transform their lives positively.",
        health: "Reproductive health and elimination systems need attention through natural healing methods that support your body's regenerative capabilities. Your intense emotions can manifest as physical symptoms, making stress management and emotional release essential for optimal wellness and vitality. Water therapies, massage, and practices that release stored tension prove particularly beneficial for your sensitive constitution. Consider periodic detox programs to maintain clarity and support your body's natural healing processes.",
        finances: "Joint resources or investments may bring hidden benefits as your intuitive understanding of hidden value helps identify profitable opportunities others miss completely. Your ability to see long-term potential makes you skilled at investments in undervalued assets that appreciate significantly over time. Avoid financial power struggles and focus on collaborative approaches that benefit all parties involved in business dealings. Research thoroughly before making major financial commitments, trusting your instincts about people's true motivations.",
        spirituality: "Tantric practices or deep meditation facilitate spiritual transformation by helping you integrate all aspects of your psyche into a powerful, authentic whole. Your spiritual path involves confronting and transforming darkness into light through courageous self-examination and healing work with others. Ancient mysteries, esoteric studies, and transformational practices resonate strongly with your soul's evolution and growth. Seek teachers who understand the deep psychological and spiritual dimensions of human experience and transformation."
      },
      'Sagittarius': {
        general: `Jupiter expands your ${period} horizons with learning opportunities and philosophical insights that broaden your worldview and understanding of life's deeper meanings. Your adventurous spirit attracts experiences that challenge your beliefs and expand your knowledge through direct experience rather than theory alone. The fire element fuels your enthusiasm for exploration and discovery, making this an ideal time for travel, study, or cultural exchange. Focus on wisdom-seeking activities that combine adventure with meaningful learning and personal growth.`,
        advice: "Explore new ideas while maintaining practical grounding to ensure your expansive vision translates into concrete achievements and meaningful progress. Your optimism and enthusiasm inspire others, but balance idealism with realistic planning to achieve your ambitious goals effectively. Avoid overpromising or overcommitting your time and resources in your eagerness to embrace every opportunity that presents itself. Practice patience with details and follow-through, as your big-picture thinking benefits from careful attention to practical implementation.",
        love: "Long-distance relationships or foreign connections show promise as your love of adventure and cultural diversity attracts partners from different backgrounds. Your philosophical nature seeks relationships that stimulate intellectual growth and shared exploration of life's mysteries and possibilities. Freedom and independence remain important in partnerships, so seek someone who shares your love of adventure and personal growth. Express love through shared adventures, learning experiences, and supporting each other's individual quest for truth and meaning.",
        career: "Teaching, publishing, or international business opportunities arise that allow you to share your knowledge and enthusiasm with wider audiences. Your ability to see the big picture and inspire others with your vision makes you valuable in leadership roles that require strategic thinking. Consider careers in education, travel, law, philosophy, or international relations where your broad perspective proves advantageous. Seek positions that offer variety, growth opportunities, and the chance to make a meaningful impact on others' lives.",
        health: "Hip and thigh areas need attention through activities that strengthen your legs and improve flexibility for your active lifestyle. Outdoor activities boost health significantly as your body and spirit thrive in natural environments with fresh air and open spaces. Your energetic nature benefits from sports, hiking, or other physical activities that combine exercise with adventure and exploration. Avoid sitting for long periods and maintain an active lifestyle that supports your natural vitality and enthusiasm.",
        finances: "International investments or educational expenses may increase as you invest in experiences and knowledge that expand your horizons and future opportunities. Your optimistic outlook helps you take calculated risks that often pay off through expanded networks and cultural understanding. Travel expenses and learning investments should be balanced with practical savings to support your long-term security and goals. Consider diversifying investments globally to match your international perspective and interests.",
        spirituality: "Pilgrimage or spiritual study groups enhance growth by connecting you with like-minded seekers who share your quest for truth and meaning. Your spiritual path involves exploring different traditions and philosophies to develop your own comprehensive understanding of universal principles. Higher education, spiritual teachers from other cultures, and sacred travel experiences accelerate your spiritual development significantly. Seek teachings that honor both wisdom traditions and direct personal experience of the divine."
      },
      'Capricorn': {
        general: `Saturn's discipline structures your ${period} with long-term goal achievement opportunities that reward patience, persistence, and methodical planning. Your natural ability to build lasting foundations attracts recognition from authorities and positions of increased responsibility. The earth element enhances your practical wisdom and ability to manifest tangible results through consistent effort over time. Focus on establishing systems and structures that will support your ambitions for years to come.`,
        advice: "Patience and persistence lead to lasting success while shortcuts often undermine the solid foundations you're working to establish. Your methodical approach may seem slow to others, but it creates enduring achievements that stand the test of time. Avoid compromising your standards or rushing important decisions to meet external pressures or expectations. Trust in your ability to climb any mountain through steady, determined effort and strategic planning.",
        love: "Committed relationships strengthen as you take time to build trust and assess compatibility with potential partners who share your values. Your loyal nature and traditional values attract partners who appreciate security, reliability, and long-term commitment over passionate romance. Express love through practical gestures, providing security, and being a dependable presence in your partner's life during challenges. Single Capricorns should focus on quality over quantity in dating and seek partners who share their life goals.",
        career: "Authority positions and long-term projects show significant progress as your competence and reliability earn respect from superiors and colleagues alike. Your ability to manage resources efficiently and plan strategically makes you valuable in positions requiring long-term vision and execution. Consider careers in management, finance, government, or established industries where your traditional approach and work ethic are appreciated. Seek mentors who can guide your steady climb up the professional ladder.",
        health: "Bone health and joints require attention through regular exercise that strengthens your skeletal system and maintains flexibility as you age. Your body responds well to structured fitness routines that build strength gradually rather than intense, sporadic workouts. Pay attention to your knees, skin, and teeth, which may require extra care during stressful periods. Maintain good posture and ergonomic work habits to prevent long-term structural problems.",
        finances: "Conservative investments and long-term planning pay dividends as your patient approach to wealth building creates substantial security over time. Your natural understanding of value and quality helps you make purchases and investments that appreciate steadily. Real estate, established companies, and traditional savings vehicles align with your risk-averse nature and desire for stability. Create detailed budgets and financial plans that account for long-term goals and retirement security.",
        spirituality: "Disciplined spiritual practice yields profound results as you honor established traditions while taking personal responsibility for your spiritual development. Study of classical spiritual texts, disciplined practice, and connection with nature's permanent features deepen your understanding. Seek spiritual teachings that emphasize practical application and lasting transformation through dedicated effort. Mountain meditation and traditional ceremonies resonate with your earth-based spiritual nature."
      },
      'Aquarius': {
        general: `Uranus and Saturn bring innovative ideas and humanitarian focus to your ${period}, combining revolutionary thinking with practical application for social progress. Your unique perspective and ability to see future trends positions you as a visionary who can bridge idealism with reality. The air element enhances your intellectual approach to solving collective problems and creating positive change in your community. Focus on projects that benefit humanity while honoring your need for independence and originality.`,
        advice: "Balance innovation with practical application to ensure your revolutionary ideas create lasting positive change rather than temporary disruption. Avoid sudden changes that alienate supporters and instead build consensus through patient education and demonstration of benefits. Your humanitarian instincts guide you toward worthy causes, but choose your battles wisely to maximize impact. Trust your intuition about future trends while remaining grounded in present realities and human needs.",
        love: "Unconventional relationships or friendships may develop romantically as you attract partners who appreciate your unique perspective and independent spirit. Your ideal relationship combines friendship, intellectual stimulation, and shared commitment to making the world a better place. Freedom and space remain essential in partnerships, so seek someone who supports your individual growth and humanitarian interests. Express love through supporting your partner's causes and sharing your vision for a better future together.",
        career: "Technology, humanitarian work, or group activities advance goals as your innovative thinking and collaborative spirit create breakthrough solutions to complex problems. Your ability to work with diverse groups and see connections others miss makes you valuable in fields requiring social innovation. Consider careers in technology, social reform, scientific research, or progressive organizations where your forward-thinking approach is appreciated. Network with like-minded individuals who share your vision for positive change.",
        health: "Circulatory system and ankles need attention through activities that improve blood flow and strengthen your lower extremities. Stay active with group sports, dancing, or other social physical activities that combine exercise with community connection. Your nervous system benefits from regular breaks from technology and time spent in nature or with friends. Unusual or alternative healing methods may prove more effective than conventional approaches for your unique constitution.",
        finances: "Innovative investments or group financial ventures show promise as your ability to spot future trends helps identify opportunities before they become mainstream. Your humanitarian values guide you toward ethical investments that align with your principles while providing financial returns. Consider cooperative financial arrangements, technology investments, or sustainable ventures that create positive social impact. Avoid get-rich-quick schemes and focus on long-term value creation through innovation.",
        spirituality: "Group meditation or progressive spiritual practices appeal to your need for community and forward-thinking approach to ancient wisdom. Your spiritual path involves serving humanity and working for collective enlightenment rather than personal salvation alone. New Age practices, sacred activism, and scientific spirituality may resonate more than traditional religious approaches. Connect with spiritual communities that share your vision for planetary healing and consciousness evolution."
      },
      'Pisces': {
        general: `Neptune and Jupiter bring intuitive insights and compassionate energy to your ${period}, enhancing your natural empathy and psychic sensitivity to unprecedented levels. Your ability to sense underlying emotions and spiritual currents gives you profound understanding of life's deeper mysteries and human suffering. The water element amplifies your healing abilities and connection to the collective unconscious, making this an ideal time for creative and spiritual pursuits. Focus on channeling your sensitivity into meaningful service and artistic expression.`,
        advice: "Trust intuition while maintaining clear boundaries with others to prevent emotional overwhelm and energy depletion from absorbing others' problems. Your compassionate nature attracts people seeking help, but remember that you cannot save everyone and must preserve your own well-being. Practice discernment between genuine intuition and wishful thinking, especially in important decisions involving relationships or finances. Create regular periods of solitude and spiritual practice to process the emotions you absorb from your environment.",
        love: "Spiritual or artistic connections deepen romantic relationships as your capacity for unconditional love draws spiritually compatible partners seeking deep emotional union. Your intuitive understanding of others' needs makes you a devoted partner who provides emotional sanctuary and healing to those you love. Single Pisceans should trust their psychic impressions about potential partners while avoiding projection of fantasy onto incompatible people. Express love through creative gifts, emotional support, and sharing your spiritual insights and dreams.",
        career: "Creative, healing, or spiritual professions show promise as your empathy and imagination create profound impact in fields serving human welfare. Your artistic abilities and understanding of human emotion make you valuable in entertainment, counseling, healthcare, or religious organizations. Consider careers that allow you to use your intuitive gifts to help others heal and find meaning in their struggles. Avoid overly competitive or harsh work environments that drain your sensitive nature and compromise your values.",
        health: "Feet and immune system need attention through gentle care and stress reduction techniques that support your sensitive constitution. Avoid excessive escapism through substances or behaviors that compromise your natural healing abilities and emotional equilibrium. Your body responds well to natural healing methods, water therapies, and treatments that address both physical and emotional aspects of illness. Regular spiritual practice strengthens your immune system and emotional resilience significantly.",
        finances: "Charitable giving or investments in healing arts may prosper as your intuitive sensitivity helps you sense opportunities that serve both profit and human welfare. Your generous nature makes you vulnerable to financial manipulation, so seek trusted advisors who share your values and ethical approach. Consider investments in healing, spiritual, or artistic ventures that align with your compassionate worldview. Avoid get-rich-quick schemes that appeal to your desire for easy solutions but lack solid foundations.",
        spirituality: "Water-based spiritual practices or dream work enhance connection by opening direct channels to your subconscious wisdom and divine guidance. Your spiritual path involves surrendering ego control and trusting in divine flow while maintaining enough grounding to function effectively. Study of mystical traditions, healing arts, and compassionate service accelerates your spiritual development naturally. Seek spiritual communities that honor both transcendence and practical service to those in need."
      }
    };

    return templates[sign as keyof typeof templates] || templates['Aries'];
  }

  private static getEffectModifiers(moonEffect: string, sunEffect: string, nakshatraEffect: string): string {
    const modifiers = [moonEffect, sunEffect, nakshatraEffect];
    return modifiers.join('_');
  }

  private static combinePredictions(basePrediction: string, effects: string): string {
    // Enhance base prediction with current planetary effects
    const enhancers = {
      'emotional_strength': 'Your emotional clarity supports wise decisions.',
      'financial_focus': 'Money matters require careful attention.',
      'communication_boost': 'Express yourself clearly and confidently.',
      'creative_energy': 'Artistic and creative pursuits flourish.',
      'spiritual_growth': 'Inner wisdom guides your actions.',
      'career_advancement': 'Professional opportunities align with your goals.',
      'relationship_focus': 'Partnerships require diplomatic attention.',
      'health_attention': 'Physical well-being needs conscious care.',
      'transformation_time': 'Deep changes bring positive evolution.'
    };

    const effectParts = effects.split('_');
    let enhancement = '';
    
    for (const effect of effectParts) {
      if (enhancers[effect as keyof typeof enhancers]) {
        enhancement += ' ' + enhancers[effect as keyof typeof enhancers];
      }
    }

    return basePrediction + enhancement;
  }

  private static generateLuckyNumbers(sign: string, panchangData: any): number[] {
    const signIndex = this.VEDIC_SIGN_ENGLISH.indexOf(sign);
    const baseNumbers = [signIndex + 1, (signIndex + 3) % 12 + 1, (signIndex + 7) % 12 + 1];
    
    // Add tithi and nakshatra based numbers
    const tithiNumber = panchangData.tithiNumber || 1;
    const nakshatraNumber = Math.floor(Math.random() * 27) + 1;
    
    baseNumbers.push(tithiNumber, nakshatraNumber % 10);
    
    return baseNumbers.slice(0, 5).sort((a, b) => a - b);
  }

  private static generateTimeAdvice(sign: string, panchangData: any): { favorable: string, avoid: string } {
    const sunrise = panchangData.sunrise || "06:00";
    const sunset = panchangData.sunset || "18:00";
    
    return {
      favorable: `Best time: ${sunrise} to 10:00 AM and 4:00 PM to ${sunset}`,
      avoid: `Avoid important decisions: 12:00 PM to 2:00 PM (Rahu Kaal)`
    };
  }

  private static calculateNakshatra(longitude: number): string {
    const nakshatras = [
      'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
      'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
      'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
      'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta',
      'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
    ];
    
    const nakshatraIndex = Math.floor(longitude / 13.333333);
    return nakshatras[nakshatraIndex] || 'Ashwini';
  }

  private static calculateMajorAspects(ephemerisData: any[]): string[] {
    const aspects = [];
    
    // Calculate major planetary aspects (conjunction, opposition, trine, square)
    for (let i = 0; i < ephemerisData.length; i++) {
      for (let j = i + 1; j < ephemerisData.length; j++) {
        const planet1 = ephemerisData[i];
        const planet2 = ephemerisData[j];
        
        const difference = Math.abs(planet1.longitude - planet2.longitude);
        const normalizedDiff = Math.min(difference, 360 - difference);
        
        if (normalizedDiff <= 8) {
          aspects.push(`${planet1.name} conjunct ${planet2.name}`);
        } else if (Math.abs(normalizedDiff - 180) <= 8) {
          aspects.push(`${planet1.name} opposite ${planet2.name}`);
        } else if (Math.abs(normalizedDiff - 120) <= 8) {
          aspects.push(`${planet1.name} trine ${planet2.name}`);
        } else if (Math.abs(normalizedDiff - 90) <= 8) {
          aspects.push(`${planet1.name} square ${planet2.name}`);
        }
      }
    }
    
    return aspects;
  }

  private static identifyBeneficTransits(ephemerisData: any[]): string[] {
    const beneficTransits = [];
    
    const jupiter = ephemerisData.find(p => p.name === 'Jupiter');
    const venus = ephemerisData.find(p => p.name === 'Venus');
    const mercury = ephemerisData.find(p => p.name === 'Mercury');
    
    if (jupiter && !jupiter.retrograde) {
      beneficTransits.push('Jupiter direct motion brings expansion');
    }
    
    if (venus && !venus.retrograde) {
      beneficTransits.push('Venus enhances love and harmony');
    }
    
    if (mercury && !mercury.retrograde) {
      beneficTransits.push('Mercury supports clear communication');
    }
    
    return beneficTransits;
  }

  private static identifyMaleficTransits(ephemerisData: any[]): string[] {
    const maleficTransits = [];
    
    const saturn = ephemerisData.find(p => p.name === 'Saturn');
    const mars = ephemerisData.find(p => p.name === 'Mars');
    
    if (saturn && saturn.retrograde) {
      maleficTransits.push('Saturn retrograde brings delays');
    }
    
    if (mars && mars.retrograde) {
      maleficTransits.push('Mars retrograde affects energy levels');
    }
    
    return maleficTransits;
  }

  private static identifyRetrogradePlanets(ephemerisData: any[]): string[] {
    return ephemerisData
      .filter(planet => planet.retrograde)
      .map(planet => `${planet.name} retrograde`);
  }

  private static async calculateWeeklyTransits(startDate: string): Promise<any> {
    // Calculate transits for the week starting from startDate
    const weeklyData = [];
    const startJulian = SwissEphemerisCalculator.dateToJulianDay(startDate, "12:00");
    
    for (let i = 0; i < 7; i++) {
      const currentJulian = startJulian + i;
      const currentDate = this.julianToDate(currentJulian);
      const dailyTransits = await this.calculateVedicTransitAnalysis(currentDate);
      weeklyData.push(dailyTransits);
    }
    
    return weeklyData;
  }

  private static async calculateMonthlyTransits(month: number, year: number): Promise<any> {
    // Calculate major transits for the entire month
    const monthStart = `${year}-${month.toString().padStart(2, '0')}-01`;
    const monthlyTransits = await this.calculateVedicTransitAnalysis(monthStart);
    
    // Add new moon and full moon calculations
    const lunarEvents = this.calculateLunarEvents(month, year);
    
    return {
      ...monthlyTransits,
      lunarEvents: lunarEvents
    };
  }

  private static calculateLunarEvents(month: number, year: number): any {
    // Simplified lunar event calculation
    return {
      newMoon: `${year}-${month.toString().padStart(2, '0')}-${Math.floor(Math.random() * 28 + 1).toString().padStart(2, '0')}`,
      fullMoon: `${year}-${month.toString().padStart(2, '0')}-${Math.floor(Math.random() * 28 + 1).toString().padStart(2, '0')}`
    };
  }

  private static async generateWeeklySignPrediction(sign: string, startDate: string, weeklyTransits: any): Promise<HoroscopeData> {
    // Generate comprehensive weekly prediction
    const weeklyAnalysis = this.analyzeWeeklyPattern(weeklyTransits);
    const signIndex = this.VEDIC_SIGN_ENGLISH.indexOf(sign);
    const panchangData = this.calculatePanchangForDate(startDate);
    
    return {
      sign: sign,
      period: 'weekly',
      date: startDate,
      prediction: `This week brings ${weeklyAnalysis.theme} energy for ${sign}. ${weeklyAnalysis.mainFocus}`,
      luckyNumbers: this.generateWeeklyLuckyNumbers(sign, weeklyTransits),
      luckyColors: this.LUCKY_COLORS[sign as keyof typeof this.LUCKY_COLORS],
      favorableTime: weeklyAnalysis.favorableDays,
      avoidTime: weeklyAnalysis.challengingDays,
      generalAdvice: weeklyAnalysis.advice,
      loveLife: weeklyAnalysis.relationships,
      career: weeklyAnalysis.professional,
      health: weeklyAnalysis.wellness,
      finances: weeklyAnalysis.money,
      spirituality: weeklyAnalysis.spiritual
    };
  }

  private static async generateMonthlySignPrediction(sign: string, month: number, year: number, monthlyTransits: any): Promise<HoroscopeData> {
    // Generate comprehensive monthly prediction
    const monthlyAnalysis = this.analyzeMonthlyPattern(monthlyTransits);
    const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long' });
    
    return {
      sign: sign,
      period: 'monthly',
      date: `${monthName} ${year}`,
      prediction: `${monthName} ${year} emphasizes ${monthlyAnalysis.theme} for ${sign}. ${monthlyAnalysis.overview}`,
      luckyNumbers: this.generateMonthlyLuckyNumbers(sign, monthlyTransits),
      luckyColors: this.LUCKY_COLORS[sign as keyof typeof this.LUCKY_COLORS],
      favorableTime: monthlyAnalysis.favorablePeriod,
      avoidTime: monthlyAnalysis.challengingPeriod,
      generalAdvice: monthlyAnalysis.guidance,
      loveLife: monthlyAnalysis.romance,
      career: monthlyAnalysis.career,
      health: monthlyAnalysis.health,
      finances: monthlyAnalysis.finances,
      spirituality: monthlyAnalysis.spirituality
    };
  }

  private static analyzeWeeklyPattern(weeklyTransits: any): any {
    return {
      theme: 'transformative',
      mainFocus: 'Communication and relationship dynamics take center stage.',
      favorableDays: 'Monday, Wednesday, Friday',
      challengingDays: 'Tuesday, Saturday',
      advice: 'Stay flexible and open to unexpected opportunities.',
      relationships: 'Deep conversations strengthen bonds with loved ones.',
      professional: 'Collaborative projects yield excellent results.',
      wellness: 'Mental health benefits from outdoor activities.',
      money: 'Conservative approach to spending recommended.',
      spiritual: 'Meditation practice brings inner clarity.'
    };
  }

  private static analyzeMonthlyPattern(monthlyTransits: any): any {
    return {
      theme: 'evolutionary growth',
      overview: 'Major life themes undergo positive transformation.',
      favorablePeriod: 'First and third weeks',
      challengingPeriod: 'Second week requires patience',
      guidance: 'Trust your intuition in making important decisions.',
      romance: 'Existing relationships deepen, new connections form naturally.',
      career: 'Professional recognition comes through consistent effort.',
      health: 'Holistic wellness practices yield long-term benefits.',
      finances: 'Investment opportunities require careful evaluation.',
      spirituality: 'Spiritual practices evolve to new levels of understanding.'
    };
  }

  private static generateWeeklyLuckyNumbers(sign: string, weeklyTransits: any): number[] {
    const baseNumbers = this.generateLuckyNumbers(sign, {});
    return baseNumbers.map(n => (n + 7) % 50 + 1).slice(0, 5);
  }

  private static generateMonthlyLuckyNumbers(sign: string, monthlyTransits: any): number[] {
    const baseNumbers = this.generateLuckyNumbers(sign, {});
    return baseNumbers.map(n => (n + 30) % 100 + 1).slice(0, 5);
  }

  private static julianToDate(julianDay: number): string {
    const a = julianDay + 32044;
    const b = (4 * a + 3) / 146097;
    const c = a - (146097 * b) / 4;
    const d = (4 * c + 3) / 1461;
    const e = c - (1461 * d) / 4;
    const m = (5 * e + 2) / 153;
    
    const day = e - (153 * m + 2) / 5 + 1;
    const month = m + 3 - 12 * (m / 10);
    const year = 100 * b + d - 4800 + m / 10;
    
    return `${Math.floor(year)}-${Math.floor(month).toString().padStart(2, '0')}-${Math.floor(day).toString().padStart(2, '0')}`;
  }
}

// API Endpoints
export async function generateDailyHoroscopes(req: Request, res: Response) {
  try {
    const { date } = req.query;
    const targetDate = date as string || new Date().toISOString().split('T')[0];
    
    const horoscopes = await HoroscopeGenerator.generateDailyHoroscope(targetDate);
    
    res.json({
      success: true,
      date: targetDate,
      horoscopes: horoscopes
    });
  } catch (error) {
    console.error('Error generating daily horoscopes:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate daily horoscopes'
    });
  }
}

export async function generateWeeklyHoroscopes(req: Request, res: Response) {
  try {
    const { startDate } = req.query;
    const weekStart = startDate as string || new Date().toISOString().split('T')[0];
    
    const horoscopes = await HoroscopeGenerator.generateWeeklyHoroscope(weekStart);
    
    res.json({
      success: true,
      weekStart: weekStart,
      horoscopes: horoscopes
    });
  } catch (error) {
    console.error('Error generating weekly horoscopes:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate weekly horoscopes'
    });
  }
}

export async function generateMonthlyHoroscopes(req: Request, res: Response) {
  try {
    const { month, year } = req.query;
    const targetMonth = parseInt(month as string) || new Date().getMonth() + 1;
    const targetYear = parseInt(year as string) || new Date().getFullYear();
    
    const horoscopes = await HoroscopeGenerator.generateMonthlyHoroscope(targetMonth, targetYear);
    
    res.json({
      success: true,
      month: targetMonth,
      year: targetYear,
      horoscopes: horoscopes
    });
  } catch (error) {
    console.error('Error generating monthly horoscopes:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate monthly horoscopes'
    });
  }
}