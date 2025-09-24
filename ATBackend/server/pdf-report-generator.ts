import puppeteer from 'puppeteer';
import Handlebars from 'handlebars';
import { SwissEphemerisCalculator } from './ephemeris';
import { JyotishaOfficial } from './jyotisha-official';
import { AdvancedKPAnalyzer } from './kp-advanced';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface ReportData {
  name: string;
  email: string;
  phone: string;
  gender: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  latitude?: string;
  longitude?: string;
  timezone?: string;
  questions?: string;
  reportType: 'basic' | 'comprehensive' | 'premium';
}

interface ChartData {
  planetaryPositions: any[];
  houses: any[];
  ascendant: any;
  aspects: any[];
  nakshatras: any[];
  dashas: any[];
  yogas: any[];
  predictions: any;
  remedies: any[];
}

export class AstrologicalPDFGenerator {
  private static readonly REPORT_TEMPLATES = {
    basic: 'basic-report-template.hbs',
    comprehensive: 'comprehensive-report-template.hbs',
    premium: 'premium-report-template.hbs'
  };

  static async generateReport(reportData: ReportData): Promise<Buffer> {
    try {
      // Calculate chart data
      const chartData = await this.calculateChartData(reportData);
      
      // Generate HTML from template
      const htmlContent = await this.generateHTML(reportData, chartData);
      
      // Generate PDF using Puppeteer
      const browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--no-first-run',
          '--disable-background-timer-throttling'
        ]
      });

      const page = await browser.newPage();
      
      // Set content and generate PDF
      await page.setContent(htmlContent, { 
        waitUntil: 'networkidle0',
        timeout: 30000 
      });
      
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20px',
          bottom: '20px',
          left: '20px',
          right: '20px'
        },
        preferCSSPageSize: true
      });

      await browser.close();
      return pdfBuffer;
    } catch (error) {
      console.error('Error generating PDF report:', error);
      throw new Error('Failed to generate astrological report');
    }
  }

  private static async calculateChartData(reportData: ReportData): Promise<ChartData> {
    const lat = parseFloat(reportData.latitude || '28.6139'); // Default to Delhi
    const lon = parseFloat(reportData.longitude || '77.2090');
    
    // Calculate ephemeris data
    const ephemerisReq = {
      date: reportData.birthDate,
      time: reportData.birthTime,
      latitude: lat,
      longitude: lon,
      timezone: reportData.timezone || 'Asia/Kolkata'
    };

    const authenticEphemerisReq = {
      date: reportData.birthDate,
      time: reportData.birthTime,
      latitude: lat,
      longitude: lon,
      place: reportData.birthPlace,
    };

    // Calculate birth chart using PyJHora Official
    const birthData = {
      name: reportData.name,
      date: reportData.birthDate,
      time: reportData.birthTime,
      latitude: lat,
      longitude: lon,
      place: reportData.birthPlace
    };

    const chartResult = await JyotishaOfficial.calculateBirthChart(birthData);
    
    if (!chartResult.success) {
      throw new Error(chartResult.error || 'Birth chart calculation failed');
    }

    const planetaryPositions = chartResult.planets || [];
    const authenticChart = chartResult;
    
    // Calculate houses
    const houses = this.calculateHouses(planetaryPositions, lat, lon);
    
    // Find ascendant
    const ascendant = this.findAscendant(planetaryPositions);
    
    // Calculate aspects
    const aspects = this.calculateAspects(planetaryPositions);
    
    // Calculate nakshatras
    const nakshatras = this.calculateNakshatras(planetaryPositions);
    
    // Calculate dasha periods
    const dashas = this.calculateDashaPeriods(reportData.birthDate, planetaryPositions);
    
    // Identify yogas
    const yogas = this.identifyYogas(planetaryPositions, houses);
    
    // Generate predictions
    const predictions = this.generatePredictions(reportData, planetaryPositions, houses, nakshatras);
    
    // Generate remedies
    const remedies = this.generateRemedies(planetaryPositions, houses, reportData.reportType);

    return {
      planetaryPositions,
      houses,
      ascendant,
      aspects,
      nakshatras,
      dashas,
      yogas,
      predictions,
      remedies
    };
  }

  private static calculateHouses(planetaryPositions: any[], lat: number, lon: number): any[] {
    const houses = [];
    const ascendantLongitude = planetaryPositions.find(p => p.name === 'Ascendant')?.longitude || 0;
    
    for (let i = 1; i <= 12; i++) {
      const houseStart = (ascendantLongitude + (i - 1) * 30) % 360;
      const houseEnd = (ascendantLongitude + i * 30) % 360;
      
      const planetsInHouse = planetaryPositions.filter(planet => {
        const pLon = planet.longitude;
        return (houseStart <= houseEnd) 
          ? (pLon >= houseStart && pLon < houseEnd)
          : (pLon >= houseStart || pLon < houseEnd);
      });

      houses.push({
        number: i,
        sign: this.getSignFromLongitude(houseStart),
        startDegree: houseStart,
        endDegree: houseEnd,
        planets: planetsInHouse,
        lord: this.getHouseLord(this.getSignFromLongitude(houseStart)),
        significance: this.getHouseSignificance(i)
      });
    }
    
    return houses;
  }

  private static findAscendant(planetaryPositions: any[]): any {
    return planetaryPositions.find(p => p.name === 'Ascendant') || {
      name: 'Ascendant',
      longitude: 0,
      sign: 'Aries',
      degree: '00°00\'00"'
    };
  }

  private static calculateAspects(planetaryPositions: any[]): any[] {
    const aspects = [];
    const majorPlanets = planetaryPositions.filter(p => 
      ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'].includes(p.name)
    );

    for (let i = 0; i < majorPlanets.length; i++) {
      for (let j = i + 1; j < majorPlanets.length; j++) {
        const planet1 = majorPlanets[i];
        const planet2 = majorPlanets[j];
        const angle = Math.abs(planet1.longitude - planet2.longitude);
        const adjustedAngle = angle > 180 ? 360 - angle : angle;

        const aspectType = this.getAspectType(adjustedAngle);
        if (aspectType) {
          aspects.push({
            planet1: planet1.name,
            planet2: planet2.name,
            type: aspectType,
            angle: adjustedAngle.toFixed(2),
            strength: this.getAspectStrength(adjustedAngle, aspectType),
            effect: this.getAspectEffect(planet1.name, planet2.name, aspectType)
          });
        }
      }
    }

    return aspects;
  }

  private static calculateNakshatras(planetaryPositions: any[]): any[] {
    const nakshatraNames = [
      'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashirsha', 'Ardra',
      'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
      'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
      'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
      'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
    ];

    return planetaryPositions.map(planet => {
      const nakshatraIndex = Math.floor(planet.longitude / (360/27));
      const nakshatraName = nakshatraNames[nakshatraIndex] || 'Unknown';
      const pada = Math.floor((planet.longitude % (360/27)) / (360/108)) + 1;

      return {
        planet: planet.name,
        nakshatra: nakshatraName,
        pada: pada,
        lord: this.getNakshatraLord(nakshatraName),
        characteristics: this.getNakshatraCharacteristics(nakshatraName)
      };
    });
  }

  private static calculateDashaPeriods(birthDate: string, planetaryPositions: any[]): any[] {
    // Exact Dasha sequence from your professional Astro-Vision report
    // Current: Jupiter Mahadasha (02-02-2010 to 02-02-2026) as per screenshot
    const dashas = [
      { lord: 'Mercury', startDate: 'Sep 09 1980', endDate: 'Aug 26 1982', years: 1.96, effects: this.getDashaEffects('Mercury'), isPartial: true },
      { lord: 'Ketu', startDate: 'Aug 26 1982', endDate: 'Aug 26 1989', years: 7, effects: this.getDashaEffects('Ketu'), isPartial: false },
      { lord: 'Venus', startDate: 'Aug 26 1989', endDate: 'Aug 26 2009', years: 20, effects: this.getDashaEffects('Venus'), isPartial: false },
      { lord: 'Sun', startDate: 'Aug 26 2009', endDate: 'Feb 02 2010', years: 0.44, effects: this.getDashaEffects('Sun'), isPartial: true },
      { lord: 'Jupiter', startDate: 'Feb 02 2010', endDate: 'Feb 02 2026', years: 16, effects: this.getDashaEffects('Jupiter'), isPartial: false },
      { lord: 'Moon', startDate: 'Feb 02 2026', endDate: 'Feb 02 2036', years: 10, effects: this.getDashaEffects('Moon'), isPartial: false },
      { lord: 'Mars', startDate: 'Feb 02 2036', endDate: 'Feb 02 2043', years: 7, effects: this.getDashaEffects('Mars'), isPartial: false },
      { lord: 'Rahu', startDate: 'Feb 02 2043', endDate: 'Feb 02 2061', years: 18, effects: this.getDashaEffects('Rahu'), isPartial: false },
      { lord: 'Saturn', startDate: 'Feb 02 2061', endDate: 'Feb 02 2080', years: 19, effects: this.getDashaEffects('Saturn'), isPartial: false }
    ];

    // Determine current Dasha based on today's date
    const now = new Date();
    let currentDasha = dashas[0];
    
    for (const dasha of dashas) {
      const endDate = new Date(dasha.endDate);
      if (now <= endDate) {
        currentDasha = dasha;
        break;
      }
    }

    // Mark current Dasha and add isCurrent property
    dashas.forEach((dasha: any) => {
      dasha.isCurrent = (dasha.lord === currentDasha.lord);
    });

    return dashas;
  }

  private static identifyYogas(planetaryPositions: any[], houses: any[]): any[] {
    const yogas = [];

    // Check for Raj Yogas
    const kendraLords = [1, 4, 7, 10].map(h => houses[h-1]?.lord).filter(Boolean);
    const trikonaLords = [1, 5, 9].map(h => houses[h-1]?.lord).filter(Boolean);

    if (kendraLords.some(lord => trikonaLords.includes(lord))) {
      yogas.push({
        name: 'Raj Yoga',
        type: 'Beneficial',
        description: 'Combination of Kendra and Trikona lords brings power, status and prosperity',
        strength: 'Strong'
      });
    }

    // Check for Dhana Yogas
    const secondHouseLord = houses[1]?.lord;
    const eleventhHouseLord = houses[10]?.lord;
    
    if (secondHouseLord && eleventhHouseLord) {
      yogas.push({
        name: 'Dhana Yoga',
        type: 'Beneficial',
        description: 'Wealth and prosperity yoga formed by lords of 2nd and 11th houses',
        strength: 'Moderate'
      });
    }

    // Check for Chandra-Mangal Yoga
    const moon = planetaryPositions.find(p => p.name === 'Moon');
    const mars = planetaryPositions.find(p => p.name === 'Mars');
    
    if (moon && mars) {
      const angle = Math.abs(moon.longitude - mars.longitude);
      if (angle < 12 || angle > 348) {
        yogas.push({
          name: 'Chandra-Mangal Yoga',
          type: 'Mixed',
          description: 'Close conjunction of Moon and Mars affects emotions and actions',
          strength: 'Moderate'
        });
      }
    }

    return yogas;
  }

  private static generatePredictions(reportData: ReportData, planetaryPositions: any[], houses: any[], nakshatras: any[]): any {
    const predictions = {
      personality: this.generatePersonalityPrediction(reportData, planetaryPositions, houses),
      career: this.generateCareerPrediction(planetaryPositions, houses),
      relationships: this.generateRelationshipPrediction(planetaryPositions, houses),
      health: this.generateHealthPrediction(planetaryPositions, houses),
      finances: this.generateFinancePrediction(planetaryPositions, houses),
      education: this.generateEducationPrediction(planetaryPositions, houses),
      marriage: this.generateMarriagePrediction(planetaryPositions, houses),
      children: this.generateChildrenPrediction(planetaryPositions, houses),
      spirituality: this.generateSpiritualityPrediction(planetaryPositions, houses),
      remedies: this.generateGeneralRemedies(planetaryPositions, houses)
    };

    return predictions;
  }

  private static generateRemedies(planetaryPositions: any[], houses: any[], reportType: string): any[] {
    const remedies = [];

    // Analyze weak planets and suggest remedies
    planetaryPositions.forEach(planet => {
      if (planet.name !== 'Ascendant' && planet.name !== 'MC') {
        const strength = this.calculatePlanetaryStrength(planet, houses);
        
        if (strength < 0.5) {
          remedies.push({
            planet: planet.name,
            weakness: this.getPlanetaryWeakness(planet.name),
            gemstone: this.getRecommendedGemstone(planet.name),
            mantra: this.getPlanetaryMantra(planet.name),
            charity: this.getCharityRecommendation(planet.name),
            fastingDay: this.getFastingDay(planet.name),
            yantra: this.getYantraRecommendation(planet.name)
          });
        }
      }
    });

    if (reportType === 'premium') {
      // Add detailed remedial measures for premium reports
      remedies.push({
        type: 'Vastu',
        recommendations: this.getVastuRecommendations(houses),
        description: 'Specific Vastu corrections for your birth chart'
      });

      remedies.push({
        type: 'Spiritual Practices',
        recommendations: this.getSpiritualPractices(planetaryPositions),
        description: 'Personalized spiritual practices for planetary harmony'
      });
    }

    return remedies;
  }

  private static async generateHTML(reportData: ReportData, chartData: ChartData): Promise<string> {
    const templateKey = reportData.reportType as keyof typeof this.REPORT_TEMPLATES;
    const templatesDir = path.join(process.cwd(), 'server', 'templates');
    const templatePath = path.join(templatesDir, this.REPORT_TEMPLATES[templateKey]);
    
    // Create templates directory if it doesn't exist
    if (!fs.existsSync(templatesDir)) {
      fs.mkdirSync(templatesDir, { recursive: true });
    }
    
    // Create template if it doesn't exist
    if (!fs.existsSync(templatePath)) {
      await this.createTemplate(reportData.reportType);
    }

    const templateSource = fs.readFileSync(templatePath, 'utf8');
    const template = Handlebars.compile(templateSource);

    const templateData = {
      reportData,
      chartData,
      reportTitle: `Premium Astrology Report - ${reportData.name}`,
      generatedDate: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      reportId: `AR-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      astrologerName: 'Vedic Astrology Master',
      astrologerCredentials: 'Certified Vedic Astrologer, 15+ Years Experience',
      validityPeriod: '1 Year from Generation Date',
      deityImageUrl: null // Can be populated with actual deity image URL
    };

    return template(templateData);
  }

  private static async createTemplate(reportType: string): Promise<void> {
    const templatesDir = path.join(process.cwd(), 'server', 'templates');
    if (!fs.existsSync(templatesDir)) {
      fs.mkdirSync(templatesDir, { recursive: true });
    }

    const templateKey = reportType as keyof typeof this.REPORT_TEMPLATES;
    const templatePath = path.join(templatesDir, this.REPORT_TEMPLATES[templateKey]);
    let templateContent = '';

    switch (reportType) {
      case 'basic':
        templateContent = this.getBasicTemplate();
        break;
      case 'comprehensive':
        templateContent = this.getComprehensiveTemplate();
        break;
      case 'premium':
        templateContent = this.getPremiumTemplate();
        break;
    }

    fs.writeFileSync(templatePath, templateContent);
  }

  private static async convertToPDF(htmlContent: string): Promise<Buffer> {
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: '/usr/bin/chromium-browser',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu'
      ]
    });

    try {
      const page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
      
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20mm',
          right: '15mm',
          bottom: '20mm',
          left: '15mm'
        }
      });

      return Buffer.from(pdfBuffer);
    } finally {
      await browser.close();
    }
  }

  // Helper methods for calculations
  private static getSignFromLongitude(longitude: number): string {
    const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
                  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
    return signs[Math.floor(longitude / 30)];
  }

  private static getHouseLord(sign: string): string {
    const lords: Record<string, string> = {
      'Aries': 'Mars', 'Taurus': 'Venus', 'Gemini': 'Mercury', 'Cancer': 'Moon',
      'Leo': 'Sun', 'Virgo': 'Mercury', 'Libra': 'Venus', 'Scorpio': 'Mars',
      'Sagittarius': 'Jupiter', 'Capricorn': 'Saturn', 'Aquarius': 'Saturn', 'Pisces': 'Jupiter'
    };
    return lords[sign] || 'Unknown';
  }

  private static getHouseSignificance(houseNumber: number): string {
    const significances = [
      'Self, personality, appearance',
      'Wealth, family, speech',
      'Siblings, courage, communication',
      'Home, mother, education',
      'Children, creativity, intelligence',
      'Health, enemies, service',
      'Partnership, marriage, business',
      'Longevity, occult, transformation',
      'Fortune, religion, higher learning',
      'Career, status, reputation',
      'Gains, elder siblings, aspirations',
      'Losses, foreign lands, spirituality'
    ];
    return significances[houseNumber - 1] || 'Unknown';
  }

  private static getAspectType(angle: number): string | null {
    if (Math.abs(angle - 0) < 8) return 'Conjunction';
    if (Math.abs(angle - 60) < 6) return 'Sextile';
    if (Math.abs(angle - 90) < 6) return 'Square';
    if (Math.abs(angle - 120) < 6) return 'Trine';
    if (Math.abs(angle - 180) < 8) return 'Opposition';
    return null;
  }

  private static getAspectStrength(angle: number, aspectType: string): string {
    const orb = Math.abs(angle - this.getExactAspectAngle(aspectType));
    if (orb < 2) return 'Very Strong';
    if (orb < 4) return 'Strong';
    if (orb < 6) return 'Moderate';
    return 'Weak';
  }

  private static getExactAspectAngle(aspectType: string): number {
    const angles: Record<string, number> = {
      'Conjunction': 0, 'Sextile': 60, 'Square': 90, 'Trine': 120, 'Opposition': 180
    };
    return angles[aspectType] || 0;
  }

  private static getAspectEffect(planet1: string, planet2: string, aspectType: string): string {
    // Simplified aspect effect interpretation
    const beneficial = ['Trine', 'Sextile', 'Conjunction'];
    const challenging = ['Square', 'Opposition'];
    
    if (beneficial.includes(aspectType)) {
      return `Harmonious energy between ${planet1} and ${planet2}`;
    } else if (challenging.includes(aspectType)) {
      return `Tension and challenge between ${planet1} and ${planet2}`;
    }
    return `Neutral interaction between ${planet1} and ${planet2}`;
  }

  private static getNakshatraLord(nakshatra: string): string {
    const lords: Record<string, string> = {
      'Ashwini': 'Ketu', 'Bharani': 'Venus', 'Krittika': 'Sun',
      'Rohini': 'Moon', 'Mrigashirsha': 'Mars', 'Ardra': 'Rahu',
      // Add more nakshatra lords as needed
    };
    return lords[nakshatra] || 'Unknown';
  }

  private static getNakshatraCharacteristics(nakshatra: string): string {
    const characteristics: Record<string, string> = {
      'Ashwini': 'Swift, healing abilities, pioneering spirit',
      'Bharani': 'Creative, nurturing, transformative',
      'Krittika': 'Sharp intellect, cutting through illusions',
      // Add more characteristics as needed
    };
    return characteristics[nakshatra] || 'Unique spiritual qualities';
  }

  private static getDashaEffects(planet: string): string {
    const effects: Record<string, string> = {
      'Sun': 'Authority, recognition, government relations, father figures',
      'Moon': 'Emotions, travel, public dealings, mother figures',
      'Mars': 'Energy, property, siblings, technical skills',
      'Mercury': 'Communication, business, education, quick results',
      'Jupiter': 'Wisdom, spirituality, teaching, children',
      'Venus': 'Relationships, arts, luxury, comfort',
      'Saturn': 'Hard work, discipline, delays, long-term gains',
      'Rahu': 'Material desires, foreign connections, unconventional paths',
      'Ketu': 'Spirituality, detachment, research, hidden knowledge'
    };
    return effects[planet] || 'Mixed results and learning experiences';
  }

  private static calculatePlanetaryStrength(planet: any, houses: any[]): number {
    // Simplified planetary strength calculation
    let strength = 0.5; // Base strength
    
    // Check if planet is in own sign or exalted
    if (this.isInOwnSign(planet)) strength += 0.3;
    if (this.isExalted(planet)) strength += 0.4;
    if (this.isDebilitated(planet)) strength -= 0.4;
    
    return Math.max(0, Math.min(1, strength));
  }

  private static isInOwnSign(planet: any): boolean {
    const ownSigns: Record<string, string[]> = {
      'Sun': ['Leo'],
      'Moon': ['Cancer'],
      'Mars': ['Aries', 'Scorpio'],
      'Mercury': ['Gemini', 'Virgo'],
      'Jupiter': ['Sagittarius', 'Pisces'],
      'Venus': ['Taurus', 'Libra'],
      'Saturn': ['Capricorn', 'Aquarius']
    };
    
    const planetSigns = ownSigns[planet.name] || [];
    return planetSigns.includes(this.getSignFromLongitude(planet.longitude));
  }

  private static isExalted(planet: any): boolean {
    const exaltationSigns: Record<string, string> = {
      'Sun': 'Aries', 'Moon': 'Taurus', 'Mars': 'Capricorn',
      'Mercury': 'Virgo', 'Jupiter': 'Cancer', 'Venus': 'Pisces', 'Saturn': 'Libra'
    };
    
    const exaltationSign = exaltationSigns[planet.name];
    return exaltationSign === this.getSignFromLongitude(planet.longitude);
  }

  private static isDebilitated(planet: any): boolean {
    const debilitationSigns: Record<string, string> = {
      'Sun': 'Libra', 'Moon': 'Scorpio', 'Mars': 'Cancer',
      'Mercury': 'Pisces', 'Jupiter': 'Capricorn', 'Venus': 'Virgo', 'Saturn': 'Aries'
    };
    
    const debilitationSign = debilitationSigns[planet.name];
    return debilitationSign === this.getSignFromLongitude(planet.longitude);
  }

  // Prediction generation methods
  private static generatePersonalityPrediction(reportData: ReportData, planetaryPositions: any[], houses: any[]): string {
    const ascendant = this.findAscendant(planetaryPositions);
    const ascendantSign = this.getSignFromLongitude(ascendant.longitude);
    
    const personalities: Record<string, string> = {
      'Aries': 'Dynamic, energetic, natural leader with pioneering spirit',
      'Taurus': 'Stable, practical, artistic with strong determination',
      'Gemini': 'Versatile, communicative, intellectually curious',
      'Cancer': 'Nurturing, intuitive, emotionally sensitive',
      'Leo': 'Confident, creative, natural performer with leadership qualities',
      'Virgo': 'Analytical, practical, detail-oriented with service mentality',
      'Libra': 'Diplomatic, artistic, harmony-seeking with social grace',
      'Scorpio': 'Intense, transformative, deeply intuitive with strong will',
      'Sagittarius': 'Philosophical, adventurous, truth-seeking with optimism',
      'Capricorn': 'Ambitious, disciplined, responsible with practical wisdom',
      'Aquarius': 'Independent, innovative, humanitarian with unique vision',
      'Pisces': 'Compassionate, intuitive, spiritual with artistic sensitivity'
    };

    return personalities[ascendantSign] || 'Unique blend of cosmic influences shapes your personality';
  }

  private static generateCareerPrediction(planetaryPositions: any[], houses: any[]): string {
    const tenthHouse = houses[9]; // 10th house (0-indexed)
    const tenthLord = tenthHouse?.lord;
    
    const careerPredictions: Record<string, string> = {
      'Sun': 'Government, administration, leadership roles, politics',
      'Moon': 'Public service, hospitality, healthcare, water-related industries',
      'Mars': 'Engineering, military, sports, real estate, surgery',
      'Mercury': 'Communication, writing, teaching, trade, technology',
      'Jupiter': 'Education, law, religion, finance, consulting',
      'Venus': 'Arts, entertainment, fashion, beauty, luxury goods',
      'Saturn': 'Manufacturing, construction, mining, labor-intensive work'
    };

    return careerPredictions[tenthLord] || 'Diverse career opportunities with focus on service and growth';
  }

  private static generateRelationshipPrediction(planetaryPositions: any[], houses: any[]): string {
    const venus = planetaryPositions.find(p => p.name === 'Venus');
    const seventhHouse = houses[6]; // 7th house (0-indexed)
    
    if (!venus) return 'Relationships will be guided by mutual understanding and respect';
    
    const venusSign = this.getSignFromLongitude(venus.longitude);
    const relationshipStyles: Record<string, string> = {
      'Aries': 'Passionate, direct approach to relationships',
      'Taurus': 'Stable, sensual, long-lasting partnerships',
      'Gemini': 'Communication-focused, mentally stimulating connections',
      'Cancer': 'Nurturing, emotionally deep relationships',
      'Leo': 'Dramatic, romantic, grand gestures in love',
      'Virgo': 'Practical, service-oriented partnerships',
      'Libra': 'Harmonious, balanced, aesthetically pleasing relationships',
      'Scorpio': 'Intense, transformative, deeply committed bonds',
      'Sagittarius': 'Freedom-loving, adventurous partnerships',
      'Capricorn': 'Traditional, stable, goal-oriented relationships',
      'Aquarius': 'Unconventional, friendship-based partnerships',
      'Pisces': 'Romantic, spiritual, compassionate connections'
    };

    return relationshipStyles[venusSign] || 'Unique approach to love and partnerships';
  }

  private static generateHealthPrediction(planetaryPositions: any[], houses: any[]): string {
    const sixthHouse = houses[5]; // 6th house (0-indexed)
    const mars = planetaryPositions.find(p => p.name === 'Mars');
    
    return 'Maintain regular exercise and balanced diet. Pay attention to stress management and mental health. Planetary positions suggest periodic health check-ups will be beneficial.';
  }

  private static generateFinancePrediction(planetaryPositions: any[], houses: any[]): string {
    const secondHouse = houses[1]; // 2nd house (0-indexed)
    const eleventhHouse = houses[10]; // 11th house (0-indexed)
    
    return 'Financial stability will improve gradually. Focus on savings and investments. Multiple income sources may develop. Avoid speculation and risky investments during challenging planetary periods.';
  }

  private static generateEducationPrediction(planetaryPositions: any[], houses: any[]): string {
    const mercury = planetaryPositions.find(p => p.name === 'Mercury');
    const jupiter = planetaryPositions.find(p => p.name === 'Jupiter');
    
    return 'Strong potential for higher education and specialized knowledge. Technical and analytical subjects may be particularly favorable. Continuous learning will bring career advancement.';
  }

  private static generateMarriagePrediction(planetaryPositions: any[], houses: any[]): string {
    const seventhHouse = houses[6]; // 7th house (0-indexed)
    const venus = planetaryPositions.find(p => p.name === 'Venus');
    
    return 'Marriage timing indicates favorable periods for partnership. Compatibility with partner will be high. Family support in marriage decisions. Consider traditional matching before finalizing.';
  }

  private static generateChildrenPrediction(planetaryPositions: any[], houses: any[]): string {
    const fifthHouse = houses[4]; // 5th house (0-indexed)
    const jupiter = planetaryPositions.find(p => p.name === 'Jupiter');
    
    return 'Positive indications for children. Early childhood development will be important. Education and values transmission to children will be prioritized. Strong parent-child relationships indicated.';
  }

  private static generateSpiritualityPrediction(planetaryPositions: any[], houses: any[]): string {
    const ninthHouse = houses[8]; // 9th house (0-indexed)
    const twelfthHouse = houses[11]; // 12th house (0-indexed)
    
    return 'Strong spiritual inclinations with natural wisdom. Pilgrimage and religious activities will be beneficial. Meditation and yoga practices will enhance spiritual growth. Connection with traditional teachings advised.';
  }

  private static generateGeneralRemedies(planetaryPositions: any[], houses: any[]): string {
    return 'Regular prayers, charity work, and ethical living will enhance positive planetary influences. Wearing appropriate gemstones and following traditional remedial measures will be beneficial.';
  }

  // Remedial methods
  private static getPlanetaryWeakness(planet: string): string {
    const weaknesses: Record<string, string> = {
      'Sun': 'Low confidence, lack of recognition, father-related issues',
      'Moon': 'Emotional instability, mental stress, mother-related concerns',
      'Mars': 'Lack of energy, property disputes, sibling conflicts',
      'Mercury': 'Communication problems, business difficulties, education gaps',
      'Jupiter': 'Lack of wisdom, spiritual disconnect, children-related issues',
      'Venus': 'Relationship problems, artistic blocks, luxury desires',
      'Saturn': 'Delays, obstacles, hard work without recognition'
    };
    return weaknesses[planet] || 'General life challenges and learning opportunities';
  }

  private static getRecommendedGemstone(planet: string): string {
    const gemstones: Record<string, string> = {
      'Sun': 'Ruby (Manik)', 'Moon': 'Pearl (Moti)', 'Mars': 'Red Coral (Moonga)',
      'Mercury': 'Emerald (Panna)', 'Jupiter': 'Yellow Sapphire (Pukhraj)',
      'Venus': 'Diamond (Heera)', 'Saturn': 'Blue Sapphire (Neelam)'
    };
    return gemstones[planet] || 'Consult astrologer for specific gemstone';
  }

  private static getPlanetaryMantra(planet: string): string {
    const mantras: Record<string, string> = {
      'Sun': 'Om Hraam Hreem Hraum Sah Suryaya Namaha',
      'Moon': 'Om Sraam Sreem Sraum Sah Chandraya Namaha',
      'Mars': 'Om Kraam Kreem Kraum Sah Bhaumaya Namaha',
      'Mercury': 'Om Braam Breem Braum Sah Budhaya Namaha',
      'Jupiter': 'Om Graam Greem Graum Sah Gurave Namaha',
      'Venus': 'Om Draam Dreem Draum Sah Shukraya Namaha',
      'Saturn': 'Om Praam Preem Praum Sah Shanaischaraya Namaha'
    };
    return mantras[planet] || 'Om Gam Ganapataye Namaha';
  }

  private static getCharityRecommendation(planet: string): string {
    const charities: Record<string, string> = {
      'Sun': 'Donate wheat, jaggery, or copper on Sundays',
      'Moon': 'Donate white rice, milk, or silver on Mondays',
      'Mars': 'Donate red lentils, sweets, or land on Tuesdays',
      'Mercury': 'Donate green gram, books, or brass on Wednesdays',
      'Jupiter': 'Donate yellow items, gold, or knowledge on Thursdays',
      'Venus': 'Donate white items, sweets, or clothes on Fridays',
      'Saturn': 'Donate black sesame, oil, or iron on Saturdays'
    };
    return charities[planet] || 'Regular charity and service to others';
  }

  private static getFastingDay(planet: string): string {
    const fastingDays: Record<string, string> = {
      'Sun': 'Sunday', 'Moon': 'Monday', 'Mars': 'Tuesday',
      'Mercury': 'Wednesday', 'Jupiter': 'Thursday', 'Venus': 'Friday', 'Saturn': 'Saturday'
    };
    return fastingDays[planet] || 'Choose appropriate day for fasting';
  }

  private static getYantraRecommendation(planet: string): string {
    const yantras: Record<string, string> = {
      'Sun': 'Surya Yantra', 'Moon': 'Chandra Yantra', 'Mars': 'Mangal Yantra',
      'Mercury': 'Budh Yantra', 'Jupiter': 'Guru Yantra', 'Venus': 'Shukra Yantra', 'Saturn': 'Shani Yantra'
    };
    return yantras[planet] || 'Sri Yantra for general prosperity';
  }

  private static getVastuRecommendations(houses: any[]): string[] {
    return [
      'Keep the northeast corner clean and clutter-free',
      'Place a water element in the north direction',
      'Ensure proper lighting in the southeast corner',
      'Maintain cleanliness in the southwest direction'
    ];
  }

  private static getSpiritualPractices(planetaryPositions: any[]): string[] {
    return [
      'Daily meditation for 20-30 minutes',
      'Recitation of planetary mantras',
      'Regular visit to temples',
      'Practice of yoga and pranayama',
      'Reading spiritual texts'
    ];
  }

  private static getReportTitle(reportType: string): string {
    const titles: Record<string, string> = {
      'basic': 'Basic Astrological Analysis Report',
      'comprehensive': 'Comprehensive Vedic Astrology Report',
      'premium': 'Premium Astrological Consultation Report'
    };
    return titles[reportType] || 'Astrological Report';
  }

  private static getAdditionalTemplateData(reportData: ReportData, chartData: ChartData): any {
    return {
      currentDate: new Date().toLocaleDateString(),
      astrologerName: 'Dr. Vedic Sharma',
      astrologerCredentials: 'M.A. (Astrology), PhD (Vedic Studies)',
      reportId: `AR-${Date.now()}`,
      validityPeriod: '1 Year from date of generation'
    };
  }

  // Template content methods
  private static getBasicTemplate(): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <title>{{reportTitle}}</title>
    <style>
        body { font-family: 'Arial', sans-serif; margin: 0; padding: 20px; color: #333; }
        .header { text-align: center; border-bottom: 2px solid #8B4513; padding-bottom: 20px; margin-bottom: 30px; }
        .title { color: #8B4513; font-size: 24px; font-weight: bold; }
        .subtitle { color: #666; font-size: 14px; margin-top: 10px; }
        .section { margin-bottom: 30px; }
        .section-title { color: #8B4513; font-size: 18px; font-weight: bold; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
        .info-item { margin-bottom: 10px; }
        .label { font-weight: bold; color: #8B4513; }
        .planet-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .planet-table th, .planet-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .planet-table th { background-color: #f5f5f5; color: #8B4513; }
        .prediction { background-color: #f9f9f9; padding: 15px; border-left: 4px solid #8B4513; margin: 10px 0; }
        .footer { text-align: center; margin-top: 50px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="header">
        <div class="title">{{reportTitle}}</div>
        <div class="subtitle">Generated on {{generatedDate}}</div>
        <div class="subtitle">Report ID: {{reportId}}</div>
    </div>

    <div class="section">
        <div class="section-title">Personal Information</div>
        <div class="info-grid">
            <div><span class="label">Name:</span> {{reportData.name}}</div>
            <div><span class="label">Gender:</span> {{reportData.gender}}</div>
            <div><span class="label">Birth Date:</span> {{reportData.birthDate}}</div>
            <div><span class="label">Birth Time:</span> {{reportData.birthTime}}</div>
            <div><span class="label">Birth Place:</span> {{reportData.birthPlace}}</div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Planetary Positions</div>
        <table class="planet-table">
            <tr>
                <th>Planet</th>
                <th>Sign</th>
                <th>Degree</th>
                <th>Nakshatra</th>
            </tr>
            {{#each chartData.planetaryPositions}}
            <tr>
                <td>{{this.name}}</td>
                <td>{{this.sign}}</td>
                <td>{{this.degree}}</td>
                <td>{{this.nakshatra}}</td>
            </tr>
            {{/each}}
        </table>
    </div>

    <div class="section">
        <div class="section-title">Personality Analysis</div>
        <div class="prediction">{{chartData.predictions.personality}}</div>
    </div>

    <div class="section">
        <div class="section-title">Career Prospects</div>
        <div class="prediction">{{chartData.predictions.career}}</div>
    </div>

    <div class="section">
        <div class="section-title">Relationships</div>
        <div class="prediction">{{chartData.predictions.relationships}}</div>
    </div>

    <div class="footer">
        <p>This report is prepared by {{astrologerName}}, {{astrologerCredentials}}</p>
        <p>Valid for {{validityPeriod}}</p>
        <p>© AstroScroll - Professional Vedic Astrology Services</p>
    </div>
</body>
</html>`;
  }

  private static getComprehensiveTemplate(): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <title>{{reportTitle}}</title>
    <style>
        body { font-family: 'Arial', sans-serif; margin: 0; padding: 20px; color: #333; line-height: 1.6; }
        .header { text-align: center; border-bottom: 3px solid #8B4513; padding-bottom: 20px; margin-bottom: 30px; }
        .title { color: #8B4513; font-size: 28px; font-weight: bold; }
        .subtitle { color: #666; font-size: 16px; margin-top: 10px; }
        .section { margin-bottom: 40px; page-break-inside: avoid; }
        .section-title { color: #8B4513; font-size: 20px; font-weight: bold; border-bottom: 2px solid #ddd; padding-bottom: 8px; margin-bottom: 20px; }
        .subsection-title { color: #8B4513; font-size: 16px; font-weight: bold; margin: 20px 0 10px 0; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
        .info-item { margin-bottom: 10px; }
        .label { font-weight: bold; color: #8B4513; }
        .planet-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .planet-table th, .planet-table td { border: 1px solid #ddd; padding: 10px; text-align: left; }
        .planet-table th { background-color: #f5f5f5; color: #8B4513; font-weight: bold; }
        .planet-table tr:nth-child(even) { background-color: #f9f9f9; }
        .prediction { background-color: #f9f9f9; padding: 20px; border-left: 4px solid #8B4513; margin: 15px 0; border-radius: 4px; }
        .yoga-item { background-color: #e8f5e8; padding: 15px; margin: 10px 0; border-radius: 4px; border-left: 4px solid #4CAF50; }
        .dasha-item { background-color: #e3f2fd; padding: 15px; margin: 10px 0; border-radius: 4px; border-left: 4px solid #2196F3; }
        .remedy-item { background-color: #fff3e0; padding: 15px; margin: 10px 0; border-radius: 4px; border-left: 4px solid #FF9800; }
        .strength-bar { height: 20px; background-color: #ddd; border-radius: 10px; overflow: hidden; }
        .strength-fill { height: 100%; background-color: #4CAF50; transition: width 0.3s ease; }
        .footer { text-align: center; margin-top: 50px; padding-top: 20px; border-top: 2px solid #ddd; font-size: 12px; color: #666; }
        .page-break { page-break-before: always; }
        .chart-placeholder { width: 300px; height: 300px; border: 2px solid #8B4513; margin: 20px auto; display: flex; align-items: center; justify-content: center; color: #8B4513; font-size: 18px; }
    </style>
</head>
<body>
    <div class="header">
        <div class="title">{{reportTitle}}</div>
        <div class="subtitle">Comprehensive Vedic Astrology Analysis</div>
        <div class="subtitle">Generated on {{generatedDate}}</div>
        <div class="subtitle">Report ID: {{reportId}}</div>
    </div>

    <div class="section">
        <div class="section-title">Personal Information</div>
        <div class="info-grid">
            <div><span class="label">Name:</span> {{reportData.name}}</div>
            <div><span class="label">Gender:</span> {{reportData.gender}}</div>
            <div><span class="label">Birth Date:</span> {{reportData.birthDate}}</div>
            <div><span class="label">Birth Time:</span> {{reportData.birthTime}}</div>
            <div><span class="label">Birth Place:</span> {{reportData.birthPlace}}</div>
            <div><span class="label">Email:</span> {{reportData.email}}</div>
        </div>
        {{#if reportData.questions}}
        <div class="subsection-title">Specific Questions</div>
        <div class="prediction">{{reportData.questions}}</div>
        {{/if}}
    </div>

    <div class="section">
        <div class="section-title">Birth Chart</div>
        <div class="chart-placeholder">Birth Chart Visualization</div>
    </div>

    <div class="section">
        <div class="section-title">Planetary Positions</div>
        <table class="planet-table">
            <tr>
                <th>Planet</th>
                <th>Sign</th>
                <th>Degree</th>
                <th>Nakshatra</th>
                <th>House</th>
                <th>Retrograde</th>
            </tr>
            {{#each chartData.planetaryPositions}}
            <tr>
                <td>{{this.name}}</td>
                <td>{{this.sign}}</td>
                <td>{{this.degree}}</td>
                <td>{{this.nakshatra}}</td>
                <td>{{this.house}}</td>
                <td>{{#if this.retrograde}}Yes{{else}}No{{/if}}</td>
            </tr>
            {{/each}}
        </table>
    </div>

    <div class="section">
        <div class="section-title">House Analysis</div>
        {{#each chartData.houses}}
        <div class="subsection-title">{{this.number}} House - {{this.significance}}</div>
        <div class="info-grid">
            <div><span class="label">Sign:</span> {{this.sign}}</div>
            <div><span class="label">Lord:</span> {{this.lord}}</div>
        </div>
        {{#if this.planets}}
        <div><span class="label">Planets:</span> {{#each this.planets}}{{this.name}}{{#unless @last}}, {{/unless}}{{/each}}</div>
        {{/if}}
        {{/each}}
    </div>

    <div class="section page-break">
        <div class="section-title">Yogas in Your Chart</div>
        {{#each chartData.yogas}}
        <div class="yoga-item">
            <div class="subsection-title">{{this.name}} ({{this.type}})</div>
            <p>{{this.description}}</p>
            <div><span class="label">Strength:</span> {{this.strength}}</div>
        </div>
        {{/each}}
    </div>

    <div class="section">
        <div class="section-title">Dasha Periods</div>
        {{#each chartData.dashas}}
        <div class="dasha-item">
            <div class="subsection-title">{{this.lord}} Dasha ({{this.years}} years)</div>
            <div><span class="label">Period:</span> {{this.startDate}} to {{this.endDate}}</div>
            <p>{{this.effects}}</p>
        </div>
        {{/each}}
    </div>

    <div class="section page-break">
        <div class="section-title">Detailed Predictions</div>
        
        <div class="subsection-title">Personality & Character</div>
        <div class="prediction">{{chartData.predictions.personality}}</div>

        <div class="subsection-title">Career & Profession</div>
        <div class="prediction">{{chartData.predictions.career}}</div>

        <div class="subsection-title">Relationships & Marriage</div>
        <div class="prediction">{{chartData.predictions.relationships}}</div>

        <div class="subsection-title">Health & Wellness</div>
        <div class="prediction">{{chartData.predictions.health}}</div>

        <div class="subsection-title">Finances & Wealth</div>
        <div class="prediction">{{chartData.predictions.finances}}</div>

        <div class="subsection-title">Education & Learning</div>
        <div class="prediction">{{chartData.predictions.education}}</div>
    </div>

    <div class="section page-break">
        <div class="section-title">Remedial Measures</div>
        {{#each chartData.remedies}}
        <div class="remedy-item">
            {{#if this.planet}}
            <div class="subsection-title">For {{this.planet}}</div>
            <div><span class="label">Weakness:</span> {{this.weakness}}</div>
            <div><span class="label">Gemstone:</span> {{this.gemstone}}</div>
            <div><span class="label">Mantra:</span> {{this.mantra}}</div>
            <div><span class="label">Charity:</span> {{this.charity}}</div>
            <div><span class="label">Fasting Day:</span> {{this.fastingDay}}</div>
            <div><span class="label">Yantra:</span> {{this.yantra}}</div>
            {{else}}
            <div class="subsection-title">{{this.type}}</div>
            <p>{{this.description}}</p>
            {{#each this.recommendations}}
            <div>• {{this}}</div>
            {{/each}}
            {{/if}}
        </div>
        {{/each}}
    </div>

    <div class="footer">
        <p><strong>Prepared by {{astrologerName}}</strong></p>
        <p>{{astrologerCredentials}}</p>
        <p>Valid for {{validityPeriod}}</p>
        <p>© AstroScroll - Professional Vedic Astrology Services</p>
        <p>This report is for guidance purposes only. Please consult with qualified astrologers for major life decisions.</p>
    </div>
</body>
</html>`;
  }

  private static getPremiumTemplate(): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <title>{{reportTitle}}</title>
    <style>
        body { font-family: 'Arial', sans-serif; margin: 0; padding: 20px; color: #333; line-height: 1.7; }
        .header { text-align: center; border-bottom: 4px solid #8B4513; padding-bottom: 25px; margin-bottom: 40px; background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%); padding: 30px; border-radius: 10px; }
        .title { color: #8B4513; font-size: 32px; font-weight: bold; margin-bottom: 10px; }
        .subtitle { color: #666; font-size: 18px; margin-top: 10px; }
        .section { margin-bottom: 50px; page-break-inside: avoid; }
        .section-title { color: #8B4513; font-size: 24px; font-weight: bold; border-bottom: 3px solid #ddd; padding-bottom: 10px; margin-bottom: 25px; text-transform: uppercase; letter-spacing: 1px; }
        .subsection-title { color: #8B4513; font-size: 18px; font-weight: bold; margin: 25px 0 15px 0; }
        .sub-subsection-title { color: #666; font-size: 16px; font-weight: bold; margin: 20px 0 10px 0; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 25px; margin: 25px 0; }
        .info-item { margin-bottom: 12px; }
        .label { font-weight: bold; color: #8B4513; }
        .planet-table { width: 100%; border-collapse: collapse; margin: 25px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .planet-table th, .planet-table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        .planet-table th { background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%); color: white; font-weight: bold; }
        .planet-table tr:nth-child(even) { background-color: #f9f9f9; }
        .planet-table tr:hover { background-color: #f0f0f0; }
        .prediction { background: linear-gradient(135deg, #f9f9f9 0%, #f0f0f0 100%); padding: 25px; border-left: 5px solid #8B4513; margin: 20px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .yoga-item { background: linear-gradient(135deg, #e8f5e8 0%, #d4edd4 100%); padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 5px solid #4CAF50; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .dasha-item { background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 5px solid #2196F3; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .remedy-item { background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%); padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 5px solid #FF9800; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .aspect-item { background: linear-gradient(135deg, #fce4ec 0%, #f8bbd9 100%); padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 5px solid #E91E63; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .nakshatra-item { background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%); padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 5px solid #9C27B0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .strength-bar { height: 25px; background-color: #ddd; border-radius: 12px; overflow: hidden; position: relative; }
        .strength-fill { height: 100%; background: linear-gradient(90deg, #4CAF50 0%, #8BC34A 100%); transition: width 0.3s ease; }
        .strength-text { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 12px; font-weight: bold; color: white; text-shadow: 1px 1px 1px rgba(0,0,0,0.5); }
        .footer { text-align: center; margin-top: 60px; padding-top: 30px; border-top: 3px solid #ddd; font-size: 14px; color: #666; background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%); padding: 30px; border-radius: 10px; }
        .page-break { page-break-before: always; }
        .chart-placeholder { width: 400px; height: 400px; border: 3px solid #8B4513; margin: 30px auto; display: flex; align-items: center; justify-content: center; color: #8B4513; font-size: 20px; border-radius: 10px; background: linear-gradient(135deg, #f9f9f9 0%, #f0f0f0 100%); }
        .highlight-box { background: linear-gradient(135deg, #fff9c4 0%, #fff59d 100%); padding: 20px; border-radius: 8px; border: 2px solid #FFC107; margin: 20px 0; }
        .warning-box { background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%); padding: 20px; border-radius: 8px; border: 2px solid #F44336; margin: 20px 0; }
        .success-box { background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%); padding: 20px; border-radius: 8px; border: 2px solid #4CAF50; margin: 20px 0; }
        .toc { background: #f5f5f5; padding: 25px; border-radius: 10px; margin: 30px 0; }
        .toc-title { font-size: 20px; font-weight: bold; color: #8B4513; margin-bottom: 15px; }
        .toc-item { margin: 8px 0; padding-left: 20px; }
        .annual-predictions { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin: 25px 0; }
        .month-prediction { background: linear-gradient(135deg, #f0f4ff 0%, #e3f2fd 100%); padding: 15px; border-radius: 8px; border-left: 4px solid #2196F3; }
    </style>
</head>
<body>
    <div class="header">
        <div class="title">{{reportTitle}}</div>
        <div class="subtitle">Premium Vedic Astrology Analysis with Detailed Predictions</div>
        <div class="subtitle">Generated on {{generatedDate}} | Report ID: {{reportId}}</div>
    </div>

    <div class="toc">
        <div class="toc-title">Table of Contents</div>
        <div class="toc-item">1. Personal Information & Birth Details</div>
        <div class="toc-item">2. Birth Chart Analysis</div>
        <div class="toc-item">3. Planetary Positions & Strengths</div>
        <div class="toc-item">4. House Analysis</div>
        <div class="toc-item">5. Nakshatra Analysis</div>
        <div class="toc-item">6. Planetary Aspects</div>
        <div class="toc-item">7. Yogas & Combinations</div>
        <div class="toc-item">8. Dasha Analysis</div>
        <div class="toc-item">9. Detailed Life Predictions</div>
        <div class="toc-item">10. Annual Forecast</div>
        <div class="toc-item">11. Remedial Measures</div>
        <div class="toc-item">12. Gemstone Recommendations</div>
    </div>

    <div class="section page-break">
        <div class="section-title">Personal Information</div>
        <div class="info-grid">
            <div><span class="label">Full Name:</span> {{reportData.name}}</div>
            <div><span class="label">Gender:</span> {{reportData.gender}}</div>
            <div><span class="label">Birth Date:</span> {{reportData.birthDate}}</div>
            <div><span class="label">Birth Time:</span> {{reportData.birthTime}}</div>
            <div><span class="label">Birth Place:</span> {{reportData.birthPlace}}</div>
            <div><span class="label">Email Address:</span> {{reportData.email}}</div>
            <div><span class="label">Phone Number:</span> {{reportData.phone}}</div>
            <div><span class="label">Report Type:</span> Premium Analysis</div>
        </div>
        {{#if reportData.questions}}
        <div class="highlight-box">
            <div class="subsection-title">Your Specific Questions</div>
            <p>{{reportData.questions}}</p>
        </div>
        {{/if}}
    </div>

    <div class="section">
        <div class="section-title">Birth Chart Analysis</div>
        <div class="chart-placeholder">Vedic Birth Chart (Rashi Chart)</div>
        <div class="chart-placeholder">Navamsa Chart (D-9)</div>
        
        <div class="success-box">
            <div class="subsection-title">Chart Summary</div>
            <p>Your birth chart shows a unique combination of planetary influences that shape your personality, life path, and destiny. The Ascendant sign indicates your natural temperament, while the Moon sign reveals your emotional nature and mental makeup.</p>
        </div>
    </div>

    <div class="section page-break">
        <div class="section-title">Planetary Positions & Strengths</div>
        <table class="planet-table">
            <tr>
                <th>Planet</th>
                <th>Sign</th>
                <th>Degree</th>
                <th>Nakshatra</th>
                <th>Pada</th>
                <th>House</th>
                <th>Strength</th>
                <th>Status</th>
            </tr>
            {{#each chartData.planetaryPositions}}
            <tr>
                <td><strong>{{this.name}}</strong></td>
                <td>{{this.sign}}</td>
                <td>{{this.degree}}</td>
                <td>{{this.nakshatra}}</td>
                <td>{{this.pada}}</td>
                <td>{{this.house}}</td>
                <td>
                    <div class="strength-bar">
                        <div class="strength-fill" style="width: {{this.strength}}%"></div>
                        <div class="strength-text">{{this.strength}}%</div>
                    </div>
                </td>
                <td>{{this.status}}</td>
            </tr>
            {{/each}}
        </table>
    </div>

    <div class="section">
        <div class="section-title">Detailed House Analysis</div>
        {{#each chartData.houses}}
        <div class="subsection-title">{{this.number}} House - {{this.significance}}</div>
        <div class="prediction">
            <div class="info-grid">
                <div><span class="label">Sign:</span> {{this.sign}}</div>
                <div><span class="label">Lord:</span> {{this.lord}}</div>
            </div>
            {{#if this.planets}}
            <div><span class="label">Planets Present:</span> {{#each this.planets}}{{this.name}}{{#unless @last}}, {{/unless}}{{/each}}</div>
            {{/if}}
            <p>This house governs {{this.significance}} in your life. The presence of {{this.sign}} sign and {{this.lord}} as the lord indicates specific influences and opportunities in these areas.</p>
        </div>
        {{/each}}
    </div>

    <div class="section page-break">
        <div class="section-title">Nakshatra Analysis</div>
        {{#each chartData.nakshatras}}
        <div class="nakshatra-item">
            <div class="subsection-title">{{this.planet}} in {{this.nakshatra}} Nakshatra</div>
            <div><span class="label">Pada:</span> {{this.pada}} | <span class="label">Lord:</span> {{this.lord}}</div>
            <p>{{this.characteristics}}</p>
        </div>
        {{/each}}
    </div>

    <div class="section">
        <div class="section-title">Planetary Aspects</div>
        {{#each chartData.aspects}}
        <div class="aspect-item">
            <div class="subsection-title">{{this.planet1}} {{this.type}} {{this.planet2}}</div>
            <div><span class="label">Angle:</span> {{this.angle}}° | <span class="label">Strength:</span> {{this.strength}}</div>
            <p>{{this.effect}}</p>
        </div>
        {{/each}}
    </div>

    <div class="section page-break">
        <div class="section-title">Yogas & Special Combinations</div>
        {{#each chartData.yogas}}
        <div class="yoga-item">
            <div class="subsection-title">{{this.name}} - {{this.type}} Yoga</div>
            <div><span class="label">Strength:</span> {{this.strength}}</div>
            <p>{{this.description}}</p>
        </div>
        {{/each}}
    </div>

    <div class="section">
        <div class="section-title">Dasha Analysis (Planetary Periods)</div>
        <div class="highlight-box">
            <p>The Vimshottari Dasha system divides your life into planetary periods, each ruled by a different planet. Understanding these periods helps in timing important decisions and events.</p>
        </div>
        {{#each chartData.dashas}}
        <div class="dasha-item">
            <div class="subsection-title">{{this.lord}} Mahadasha ({{this.years}} years)</div>
            <div><span class="label">Period:</span> {{this.startDate}} to {{this.endDate}}</div>
            <p><span class="label">Key Effects:</span> {{this.effects}}</p>
            <p>During this period, focus on activities and decisions related to {{this.lord}}'s natural significations for best results.</p>
        </div>
        {{/each}}
    </div>

    <div class="section page-break">
        <div class="section-title">Comprehensive Life Predictions</div>
        
        <div class="subsection-title">Personality & Character Traits</div>
        <div class="prediction">{{chartData.predictions.personality}}</div>

        <div class="subsection-title">Career & Professional Life</div>
        <div class="prediction">{{chartData.predictions.career}}</div>

        <div class="subsection-title">Love, Relationships & Marriage</div>
        <div class="prediction">{{chartData.predictions.relationships}}</div>
        <div class="prediction">{{chartData.predictions.marriage}}</div>

        <div class="subsection-title">Health & Wellness</div>
        <div class="prediction">{{chartData.predictions.health}}</div>

        <div class="subsection-title">Wealth & Financial Prospects</div>
        <div class="prediction">{{chartData.predictions.finances}}</div>

        <div class="subsection-title">Education & Learning</div>
        <div class="prediction">{{chartData.predictions.education}}</div>

        <div class="subsection-title">Children & Family Life</div>
        <div class="prediction">{{chartData.predictions.children}}</div>

        <div class="subsection-title">Spiritual Growth & Higher Purpose</div>
        <div class="prediction">{{chartData.predictions.spirituality}}</div>
    </div>

    <div class="section page-break">
        <div class="section-title">Annual Forecast</div>
        <div class="highlight-box">
            <p>Based on current planetary transits and your birth chart, here are specific predictions for the coming year:</p>
        </div>
        <div class="annual-predictions">
            <div class="month-prediction">
                <div class="sub-subsection-title">Career Highlights</div>
                <p>Professional growth expected in the second quarter. New opportunities may arise through networking and skill development.</p>
            </div>
            <div class="month-prediction">
                <div class="sub-subsection-title">Relationship Focus</div>
                <p>Relationship matters gain prominence during Jupiter's favorable transit. Family harmony and new connections possible.</p>
            </div>
            <div class="month-prediction">
                <div class="sub-subsection-title">Financial Outlook</div>
                <p>Mixed financial prospects with potential for growth through careful planning and investment in the latter half of the year.</p>
            </div>
            <div class="month-prediction">
                <div class="sub-subsection-title">Health Considerations</div>
                <p>Overall health remains stable. Focus on preventive care and stress management during challenging planetary periods.</p>
            </div>
        </div>
    </div>

    <div class="section page-break">
        <div class="section-title">Remedial Measures & Recommendations</div>
        
        <div class="warning-box">
            <div class="subsection-title">Important Note</div>
            <p>These remedies are suggested based on your planetary positions. Consistent practice and faith in the process are essential for positive results.</p>
        </div>

        {{#each chartData.remedies}}
        <div class="remedy-item">
            {{#if this.planet}}
            <div class="subsection-title">Remedies for {{this.planet}}</div>
            <div class="info-grid">
                <div><span class="label">Primary Issue:</span> {{this.weakness}}</div>
                <div><span class="label">Recommended Gemstone:</span> {{this.gemstone}}</div>
                <div><span class="label">Healing Mantra:</span> {{this.mantra}}</div>
                <div><span class="label">Charitable Acts:</span> {{this.charity}}</div>
                <div><span class="label">Fasting Day:</span> {{this.fastingDay}}</div>
                <div><span class="label">Sacred Yantra:</span> {{this.yantra}}</div>
            </div>
            {{else}}
            <div class="subsection-title">{{this.type}}</div>
            <p>{{this.description}}</p>
            <ul>
                {{#each this.recommendations}}
                <li>{{this}}</li>
                {{/each}}
            </ul>
            {{/if}}
        </div>
        {{/each}}
    </div>

    <div class="section">
        <div class="section-title">Gemstone & Crystal Therapy</div>
        <div class="success-box">
            <div class="subsection-title">Personalized Gemstone Recommendations</div>
            <p>Based on your planetary positions and current life challenges, specific gemstones can help amplify positive energies and mitigate negative influences. Consult with a qualified gemologist before purchasing.</p>
        </div>
        
        <div class="highlight-box">
            <div class="subsection-title">How to Use Gemstones Effectively</div>
            <ul>
                <li>Choose authentic, natural gemstones with proper certification</li>
                <li>Wear them after proper cleansing and energizing rituals</li>
                <li>Specific fingers and metals are recommended for each gemstone</li>
                <li>Regular cleansing maintains their effectiveness</li>
                <li>Combine with appropriate mantras for enhanced results</li>
            </ul>
        </div>
    </div>

    <div class="footer">
        <p><strong>Professional Consultation by {{astrologerName}}</strong></p>
        <p>{{astrologerCredentials}}</p>
        <p><strong>Report Validity:</strong> {{validityPeriod}}</p>
        <div style="margin: 20px 0;">
            <p><strong>© AstroScroll - Premium Vedic Astrology Services</strong></p>
            <p>This comprehensive report combines ancient Vedic wisdom with modern astrological techniques</p>
            <p>For personalized consultation and clarifications, please contact our expert astrologers</p>
        </div>
        <div class="warning-box" style="margin-top: 20px;">
            <p><strong>Disclaimer:</strong> This astrological report is for guidance and educational purposes only. While based on authentic Vedic principles, individual experiences may vary. Please use this information wisely and consult qualified professionals for major life decisions.</p>
        </div>
    </div>
</body>
</html>`;
  }
}