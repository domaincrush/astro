import { Request, Response } from 'express';
import { JyotishaOfficial } from './jyotisha-official';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Location lookup cache and utility functions
let citiesData: any = null;

function loadCitiesData() {
  if (!citiesData) {
    try {
      const citiesPath = path.join(__dirname, 'drik-panchanga', 'cities.json');
      citiesData = JSON.parse(fs.readFileSync(citiesPath, 'utf8'));
    } catch (error) {
      console.error('Failed to load cities data:', error);
      citiesData = {};
    }
  }
  return citiesData;
}

function findLocationCoordinates(placeName: string): { latitude: number; longitude: number; timezone: string } | null {
  const cities = loadCitiesData();
  
  // Normalize the place name for searching
  const normalizedPlace = placeName.trim().toLowerCase();
  
  // Try exact match first
  for (const [cityName, cityData] of Object.entries(cities)) {
    if (cityName.toLowerCase() === normalizedPlace) {
      return cityData as { latitude: number; longitude: number; timezone: string };
    }
  }
  
  // Try partial match for major cities
  for (const [cityName, cityData] of Object.entries(cities)) {
    if (cityName.toLowerCase().includes(normalizedPlace) || normalizedPlace.includes(cityName.toLowerCase())) {
      return cityData as { latitude: number; longitude: number; timezone: string };
    }
  }
  
  // Default to Mumbai coordinates if not found
  return {
    latitude: 19.0760,
    longitude: 72.8777,
    timezone: 'Asia/Kolkata'
  };
}

// Comprehensive Birth Chart Tools using Jyotisha Engine
export class BirthChartTools {
  
  // Standard birth chart calculation
  static async calculateBirthChart(req: Request, res: Response) {
    try {
      const { 
        name, 
        date, 
        time, 
        latitude, 
        longitude, 
        place,
        birthDate,
        birthTime,
        birthPlace
      } = req.body;
      
      // Support both parameter formats
      const finalDate = date || birthDate;
      const finalTime = time || birthTime;
      const finalPlace = place || birthPlace;
      let finalLatitude = latitude;
      let finalLongitude = longitude;
      
      if (!finalDate || !finalTime) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: date/birthDate and time/birthTime are required'
        });
      }
      
      // If coordinates not provided, try to get from place
      if (!finalLatitude || !finalLongitude) {
        if (finalPlace) {
          const coordinates = findLocationCoordinates(finalPlace);
          if (coordinates) {
            finalLatitude = coordinates.latitude;
            finalLongitude = coordinates.longitude;
          } else {
            finalLatitude = 28.6139;
            finalLongitude = 77.2090;
          }
        } else {
          finalLatitude = 28.6139;
          finalLongitude = 77.2090;
        }
      }

      const result = await JyotishaOfficial.calculateBirthChart({
        name: name || 'User',
        date: finalDate,
        time: finalTime,
        latitude: parseFloat(finalLatitude.toString()),
        longitude: parseFloat(finalLongitude.toString()),
        place: finalPlace || 'Unknown'
      });

      return res.json(result);
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Birth chart with detailed analysis
  static async calculateDetailedChart(req: Request, res: Response) {
    try {
      const { 
        name, 
        birthDate, 
        birthTime, 
        birthPlace, 
        date, 
        time, 
        place, 
        latitude, 
        longitude,
        gender
      } = req.body;
      
      // Support both parameter formats
      const finalDate = birthDate || date;
      const finalTime = birthTime || time;
      const finalPlace = birthPlace || place;
      const finalGender = gender || 'male';
      
      if (!finalDate || !finalTime) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: date/birthDate and time/birthTime are required'
        });
      }

      // Use provided coordinates or convert place name to coordinates
      let finalLatitude = latitude;
      let finalLongitude = longitude;
      
      if (!finalLatitude || !finalLongitude || finalLatitude === 0 || finalLongitude === 0) {
        if (finalPlace) {
          const coordinates = findLocationCoordinates(finalPlace);
          if (coordinates) {
            finalLatitude = coordinates.latitude;
            finalLongitude = coordinates.longitude;
          } else {
            // Default to Delhi coordinates if location not found
            finalLatitude = 28.6139;
            finalLongitude = 77.2090;
          }
        } else {
          // Default coordinates if no place specified
          finalLatitude = 28.6139;
          finalLongitude = 77.2090;
        }
      }

      // Validate coordinates
      const validLatitude = parseFloat(finalLatitude.toString());
      const validLongitude = parseFloat(finalLongitude.toString());
      
      if (isNaN(validLatitude) || isNaN(validLongitude)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid coordinates provided'
        });
      }
      
      // Prepare data for Jyotisha engine
      const birthData = {
        name: name || 'User',
        date: finalDate,
        time: finalTime,
        latitude: validLatitude,
        longitude: validLongitude,
        place: finalPlace || 'Unknown Location'
      };

      console.log('Calculating birth chart with data:', birthData);

      const result = await JyotishaOfficial.calculateBirthChart(birthData);
      
      if (!result.success) {
        console.error('Jyotisha calculation failed:', result.error);
        return res.status(400).json(result);
      }

      // Add comprehensive analysis
      const analysis = BirthChartTools.generateAnalysis(result);
      
      return res.json({
        success: true,
        ...result,
        basicInfo: {
          name: name || 'User',
          birthDate: finalDate,
          birthTime: finalTime,
          birthPlace: finalPlace,
          moonSign: result.moon_sign || result.planets?.find(p => p.name === 'Moon')?.sign || 'Unknown',
          ascendant: result.ascendant?.sign || 'Unknown',
          sunSign: result.sun_sign || result.planets?.find(p => p.name === 'Sun')?.sign || 'Unknown',
          nakshatra: result.nakshatra || result.planets?.find(p => p.name === 'Moon')?.nakshatra || 'Unknown'
        },
        analysis: analysis,
        coordinates: {
          latitude: validLatitude,
          longitude: validLongitude
        }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Compatibility analysis using birth charts
  static async calculateCompatibility(req: Request, res: Response) {
    try {
      const { person1, person2 } = req.body;
      
      if (!person1 || !person2) {
        return res.status(400).json({
          success: false,
          error: 'Both person1 and person2 data required'
        });
      }

      const chart1 = await JyotishaOfficial.calculateBirthChart(person1);
      const chart2 = await JyotishaOfficial.calculateBirthChart(person2);

      if (!chart1.success || !chart2.success) {
        return res.status(400).json({
          success: false,
          error: 'Failed to calculate one or both birth charts'
        });
      }

      const compatibility = BirthChartTools.analyzeCompatibility(chart1, chart2);

      return res.json({
        success: true,
        person1_chart: chart1,
        person2_chart: chart2,
        compatibility_analysis: compatibility
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Dasha predictions
  static async getDashaPredictions(req: Request, res: Response) {
    try {
      const result = await JyotishaOfficial.calculateBirthChart(req.body);
      
      if (!result.success) {
        return res.status(400).json(result);
      }

      const dashaPredictions = BirthChartTools.generateDashaPredictions(result.dasha);

      return res.json({
        success: true,
        current_dasha: result.dasha?.current,
        dasha_sequence: result.dasha?.sequence,
        predictions: dashaPredictions
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Transit analysis
  static async getTransitAnalysis(req: Request, res: Response) {
    try {
      const { birthData, transitDate } = req.body;
      
      const birthChart = await JyotishaOfficial.calculateBirthChart(birthData);
      const transitChart = await JyotishaOfficial.calculateBirthChart({
        ...birthData,
        date: transitDate || new Date().toISOString().split('T')[0]
      });

      if (!birthChart.success || !transitChart.success) {
        return res.status(400).json({
          success: false,
          error: 'Failed to calculate charts for transit analysis'
        });
      }

      const transitAnalysis = BirthChartTools.analyzeTransits(birthChart, transitChart);

      return res.json({
        success: true,
        birth_chart: birthChart,
        transit_chart: transitChart,
        transit_analysis: transitAnalysis
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Generate comprehensive analysis
  private static generateAnalysis(chartResult: any) {
    return {
      chart_strength: BirthChartTools.calculateChartStrength(chartResult),
      house_analysis: BirthChartTools.analyzeHouses(chartResult),
      planetary_aspects: BirthChartTools.analyzePlanetaryAspects(chartResult),
      yogas: BirthChartTools.identifyYogas(chartResult),
      career_indicators: BirthChartTools.analyzeCareerIndicators(chartResult),
      health_indicators: BirthChartTools.analyzeHealthIndicators(chartResult),
      relationship_indicators: BirthChartTools.analyzeRelationshipIndicators(chartResult)
    };
  }

  // Chart strength calculation
  private static calculateChartStrength(chartResult: any) {
    const planets = chartResult.planets || [];
    let totalStrength = 0;
    let planetCount = 0;

    planets.forEach((planet: any) => {
      if (planet.name !== 'Rahu' && planet.name !== 'Ketu') {
        // Basic strength calculation based on house position and sign
        let strength = 50; // Base strength
        
        // Exaltation/debilitation adjustments
        if (planet.house === 1 || planet.house === 5 || planet.house === 9) strength += 20;
        if (planet.house === 6 || planet.house === 8 || planet.house === 12) strength -= 15;
        
        totalStrength += Math.max(0, Math.min(100, strength));
        planetCount++;
      }
    });

    return {
      overall_strength: planetCount > 0 ? Math.round(totalStrength / planetCount) : 50,
      interpretation: BirthChartTools.getStrengthInterpretation(totalStrength / planetCount)
    };
  }

  // House analysis
  private static analyzeHouses(chartResult: any) {
    const houseNames = [
      'Tanu Bhava', 'Dhana Bhava', 'Sahaja Bhava', 'Sukha Bhava',
      'Putra Bhava', 'Ripu Bhava', 'Kalatra Bhava', 'Ayur Bhava',
      'Dharma Bhava', 'Karma Bhava', 'Labha Bhava', 'Vyaya Bhava'
    ];

    const houseSignificances = [
      'Self, personality, physical body, appearance',
      'Wealth, family, speech, food, values',
      'Siblings, courage, communication, short journeys',
      'Home, mother, happiness, property, education',
      'Children, creativity, intelligence, romance',
      'Enemies, diseases, debts, service, competition',
      'Marriage, partnerships, spouse, business',
      'Longevity, transformation, occult, inheritance',
      'Religion, philosophy, fortune, long journeys',
      'Career, reputation, authority, father',
      'Gains, income, friends, aspirations, elder siblings',
      'Losses, expenses, spirituality, foreign lands'
    ];

    const houses = Array.from({ length: 12 }, (_, i) => {
      const houseNumber = i + 1;
      const planetsInHouse = chartResult.planets?.filter((planet: any) => 
        planet.house === houseNumber
      ) || [];

      // Calculate house strength based on planets present
      let strength = 'Moderate';
      if (planetsInHouse.length === 0) {
        strength = 'Weak';
      } else if (planetsInHouse.length >= 2) {
        strength = 'Strong';
      } else if (planetsInHouse.some((p: any) => ['Sun', 'Jupiter', 'Venus'].includes(p.name))) {
        strength = 'Strong';
      }

      // Generate analysis based on planets and house significance
      let analysis = `This house represents ${houseSignificances[i].toLowerCase()}.`;
      
      if (planetsInHouse.length > 0) {
        const planetNames = planetsInHouse.map((p: any) => p.name).join(', ');
        analysis += ` Currently occupied by ${planetNames}, which influences the matters of this house.`;
        
        // Add specific planetary effects
        planetsInHouse.forEach((planet: any) => {
          switch (planet.name) {
            case 'Sun':
              analysis += ` Sun brings authority and leadership qualities to this area.`;
              break;
            case 'Moon':
              analysis += ` Moon brings emotional connection and intuitive approach.`;
              break;
            case 'Mars':
              analysis += ` Mars adds energy, courage, and dynamic action.`;
              break;
            case 'Mercury':
              analysis += ` Mercury enhances communication and analytical abilities.`;
              break;
            case 'Jupiter':
              analysis += ` Jupiter brings wisdom, expansion, and beneficial results.`;
              break;
            case 'Venus':
              analysis += ` Venus adds beauty, harmony, and material comforts.`;
              break;
            case 'Saturn':
              analysis += ` Saturn brings discipline, responsibility, and long-term focus.`;
              break;
            case 'Rahu':
              analysis += ` Rahu creates amplification and unconventional approaches.`;
              break;
            case 'Ketu':
              analysis += ` Ketu brings spiritual insight and detachment.`;
              break;
          }
        });
      } else {
        analysis += ` This house is currently unoccupied, suggesting natural development in these areas.`;
      }

      return {
        house: houseNumber,
        name: houseNames[i],
        planets: planetsInHouse.map((p: any) => p.name),
        planetDetails: planetsInHouse,
        significance: houseSignificances[i],
        strength: strength,
        analysis: analysis,
        lord: BirthChartTools.getHouseLord(houseNumber, chartResult),
        aspects: BirthChartTools.getHouseAspects(houseNumber, chartResult)
      };
    });

    return houses;
  }

  // Get house lord based on sign rulership
  private static getHouseLord(houseNumber: number, chartResult: any): string {
    const houseLords = [
      'Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury',
      'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter'
    ];
    
    // This is a simplified version - in real implementation, 
    // you'd calculate based on the actual sign in the house
    return houseLords[(houseNumber - 1) % 12];
  }

  // Get planetary aspects affecting the house
  private static getHouseAspects(houseNumber: number, chartResult: any): string[] {
    const aspects: string[] = [];
    const planets = chartResult.planets || [];
    
    planets.forEach((planet: any) => {
      // Simplified aspect calculation
      // In real implementation, you'd use proper Vedic aspect rules
      if (planet.house) {
        const aspectHouses = BirthChartTools.getAspectHouses(planet.house, planet.name);
        if (aspectHouses.includes(houseNumber)) {
          aspects.push(`${planet.name} aspects from house ${planet.house}`);
        }
      }
    });
    
    return aspects;
  }

  // Get houses that a planet aspects from its position
  private static getAspectHouses(fromHouse: number, planetName: string): number[] {
    const aspects: number[] = [];
    
    // All planets aspect the 7th house
    const seventhHouse = ((fromHouse + 6) % 12) + 1;
    aspects.push(seventhHouse);
    
    // Special aspects for outer planets
    switch (planetName) {
      case 'Mars':
        // Mars aspects 4th and 8th houses
        aspects.push(((fromHouse + 3) % 12) + 1); // 4th
        aspects.push(((fromHouse + 7) % 12) + 1); // 8th
        break;
      case 'Jupiter':
        // Jupiter aspects 5th and 9th houses
        aspects.push(((fromHouse + 4) % 12) + 1); // 5th
        aspects.push(((fromHouse + 8) % 12) + 1); // 9th
        break;
      case 'Saturn':
        // Saturn aspects 3rd and 10th houses
        aspects.push(((fromHouse + 2) % 12) + 1); // 3rd
        aspects.push(((fromHouse + 9) % 12) + 1); // 10th
        break;
    }
    
    return aspects;
  }

  // Planetary aspects analysis
  private static analyzePlanetaryAspects(chartResult: any) {
    const aspects = [];
    const planets = chartResult.planets || [];

    for (let i = 0; i < planets.length; i++) {
      for (let j = i + 1; j < planets.length; j++) {
        const planet1 = planets[i];
        const planet2 = planets[j];
        
        if (planet1.longitude !== undefined && planet2.longitude !== undefined) {
          const angle = Math.abs(planet1.longitude - planet2.longitude);
          const normalizedAngle = angle > 180 ? 360 - angle : angle;
          
          if (normalizedAngle < 10) {
            aspects.push({
              type: 'Conjunction',
              planets: [planet1.name, planet2.name],
              angle: normalizedAngle,
              strength: 'Strong'
            });
          } else if (Math.abs(normalizedAngle - 60) < 5) {
            aspects.push({
              type: 'Sextile',
              planets: [planet1.name, planet2.name],
              angle: normalizedAngle,
              strength: 'Moderate'
            });
          } else if (Math.abs(normalizedAngle - 90) < 5) {
            aspects.push({
              type: 'Square',
              planets: [planet1.name, planet2.name],
              angle: normalizedAngle,
              strength: 'Challenging'
            });
          } else if (Math.abs(normalizedAngle - 120) < 5) {
            aspects.push({
              type: 'Trine',
              planets: [planet1.name, planet2.name],
              angle: normalizedAngle,
              strength: 'Harmonious'
            });
          } else if (Math.abs(normalizedAngle - 180) < 5) {
            aspects.push({
              type: 'Opposition',
              planets: [planet1.name, planet2.name],
              angle: normalizedAngle,
              strength: 'Intense'
            });
          }
        }
      }
    }

    return aspects;
  }

  // Yoga identification
  private static identifyYogas(chartResult: any) {
    const yogas = [];
    const planets = chartResult.planets || [];
    
    // Raj Yoga detection (simplified)
    const kendraLords = planets.filter(p => [1, 4, 7, 10].includes(p.house));
    const trikonaLords = planets.filter(p => [1, 5, 9].includes(p.house));
    
    if (kendraLords.length > 0 && trikonaLords.length > 0) {
      yogas.push({
        name: 'Raj Yoga',
        description: 'Combination of Kendra and Trikona lords indicating royal status and success',
        strength: 'Strong'
      });
    }

    // Dhana Yoga detection
    const wealthHouses = planets.filter(p => [2, 11].includes(p.house));
    if (wealthHouses.length >= 2) {
      yogas.push({
        name: 'Dhana Yoga',
        description: 'Wealth-giving combination',
        strength: 'Moderate'
      });
    }

    return yogas;
  }

  // Career indicators analysis
  private static analyzeCareerIndicators(chartResult: any) {
    const planets = chartResult.planets || [];
    const tenthHousePlanets = planets.filter(p => p.house === 10);
    const sunPosition = planets.find(p => p.name === 'Sun');
    
    return {
      tenth_house_planets: tenthHousePlanets.map(p => p.name),
      sun_position: sunPosition ? `${sunPosition.sign} in ${sunPosition.house}th house` : 'Unknown',
      career_suggestions: BirthChartTools.getCareerSuggestions(tenthHousePlanets, sunPosition)
    };
  }

  // Health indicators analysis
  private static analyzeHealthIndicators(chartResult: any) {
    const planets = chartResult.planets || [];
    const sixthHousePlanets = planets.filter(p => p.house === 6);
    const ascendantLord = planets.find(p => p.house === 1);
    
    return {
      sixth_house_planets: sixthHousePlanets.map(p => p.name),
      ascendant_lord_position: ascendantLord ? `${ascendantLord.sign}` : 'Unknown',
      health_areas: BirthChartTools.getHealthAreas(sixthHousePlanets)
    };
  }

  // Relationship indicators analysis
  private static analyzeRelationshipIndicators(chartResult: any) {
    const planets = chartResult.planets || [];
    const seventhHousePlanets = planets.filter(p => p.house === 7);
    const venusPosition = planets.find(p => p.name === 'Venus');
    
    return {
      seventh_house_planets: seventhHousePlanets.map(p => p.name),
      venus_position: venusPosition ? `${venusPosition.sign} in ${venusPosition.house}th house` : 'Unknown',
      relationship_traits: BirthChartTools.getRelationshipTraits(seventhHousePlanets, venusPosition)
    };
  }

  // Compatibility analysis
  private static analyzeCompatibility(chart1: any, chart2: any) {
    const moon1 = chart1.planets?.find((p: any) => p.name === 'Moon');
    const moon2 = chart2.planets?.find((p: any) => p.name === 'Moon');
    
    let compatibility_score = 50; // Base score
    const factors = [];

    // Moon sign compatibility
    if (moon1 && moon2) {
      const moonCompatibility = BirthChartTools.calculateMoonCompatibility(moon1.sign, moon2.sign);
      compatibility_score += moonCompatibility;
      factors.push({
        factor: 'Moon Sign Compatibility',
        score: moonCompatibility,
        description: 'Emotional and mental compatibility'
      });
    }

    // Ascendant compatibility
    const asc1 = chart1.ascendant?.sign;
    const asc2 = chart2.ascendant?.sign;
    if (asc1 && asc2) {
      const ascCompatibility = BirthChartTools.calculateAscendantCompatibility(asc1, asc2);
      compatibility_score += ascCompatibility;
      factors.push({
        factor: 'Ascendant Compatibility',
        score: ascCompatibility,
        description: 'Physical and personality compatibility'
      });
    }

    return {
      overall_score: Math.max(0, Math.min(100, compatibility_score)),
      compatibility_factors: factors,
      interpretation: BirthChartTools.getCompatibilityInterpretation(compatibility_score)
    };
  }

  // Dasha predictions
  private static generateDashaPredictions(dasha: any) {
    if (!dasha?.current) return [];

    const currentLord = dasha.current.lord;
    return BirthChartTools.getDashaPredictionsByLord(currentLord);
  }

  // Transit analysis
  private static analyzeTransits(birthChart: any, transitChart: any) {
    const transits = [];
    const birthPlanets = birthChart.planets || [];
    const transitPlanets = transitChart.planets || [];

    transitPlanets.forEach((transitPlanet: any) => {
      const birthPlanet = birthPlanets.find((p: any) => p.name === transitPlanet.name);
      if (birthPlanet) {
        const influence = BirthChartTools.calculateTransitInfluence(birthPlanet, transitPlanet);
        transits.push({
          planet: transitPlanet.name,
          from_house: birthPlanet.house,
          to_house: transitPlanet.house,
          influence
        });
      }
    });

    return transits;
  }

  // Helper methods
  private static getStrengthInterpretation(strength: number): string {
    if (strength >= 80) return 'Very Strong';
    if (strength >= 60) return 'Strong';
    if (strength >= 40) return 'Moderate';
    if (strength >= 20) return 'Weak';
    return 'Very Weak';
  }

  private static getHouseSignificance(house: number): string {
    const significance = [
      'Self, personality, appearance',
      'Wealth, family, speech',
      'Siblings, courage, short travels',
      'Home, mother, happiness',
      'Children, education, creativity',
      'Health, enemies, service',
      'Partnership, marriage, business',
      'Longevity, transformation, hidden matters',
      'Higher learning, spirituality, fortune',
      'Career, reputation, father',
      'Gains, friends, aspirations',
      'Loss, expenses, liberation'
    ];
    return significance[house - 1] || 'Unknown';
  }

  private static getCareerSuggestions(tenthHousePlanets: any[], sunPosition: any): string[] {
    const suggestions = [];
    
    tenthHousePlanets.forEach(planet => {
      switch (planet.name) {
        case 'Sun':
          suggestions.push('Government service, administration, leadership roles');
          break;
        case 'Moon':
          suggestions.push('Public service, hospitality, healthcare');
          break;
        case 'Mars':
          suggestions.push('Military, sports, engineering, surgery');
          break;
        case 'Mercury':
          suggestions.push('Communication, writing, teaching, commerce');
          break;
        case 'Jupiter':
          suggestions.push('Education, law, spirituality, advisory roles');
          break;
        case 'Venus':
          suggestions.push('Arts, entertainment, beauty, luxury goods');
          break;
        case 'Saturn':
          suggestions.push('Construction, mining, agriculture, structured work');
          break;
      }
    });

    return suggestions.length > 0 ? suggestions : ['General business and professional work'];
  }

  private static getHealthAreas(sixthHousePlanets: any[]): string[] {
    if (sixthHousePlanets.length === 0) return ['Generally good health'];
    
    return ['Pay attention to digestive health', 'Regular health checkups recommended'];
  }

  private static getRelationshipTraits(seventhHousePlanets: any[], venusPosition: any): string[] {
    const traits = [];
    
    if (seventhHousePlanets.length > 0) {
      traits.push('Active approach to relationships');
    }
    
    if (venusPosition) {
      traits.push('Values harmony and beauty in relationships');
    }
    
    return traits.length > 0 ? traits : ['Balanced approach to relationships'];
  }

  private static calculateMoonCompatibility(sign1: string, sign2: string): number {
    // Simplified moon sign compatibility
    const compatibleSigns: { [key: string]: string[] } = {
      'Aries': ['Leo', 'Sagittarius', 'Gemini', 'Aquarius'],
      'Taurus': ['Virgo', 'Capricorn', 'Cancer', 'Pisces'],
      'Gemini': ['Libra', 'Aquarius', 'Aries', 'Leo'],
      'Cancer': ['Scorpio', 'Pisces', 'Taurus', 'Virgo'],
      'Leo': ['Aries', 'Sagittarius', 'Gemini', 'Libra'],
      'Virgo': ['Taurus', 'Capricorn', 'Cancer', 'Scorpio'],
      'Libra': ['Gemini', 'Aquarius', 'Leo', 'Sagittarius'],
      'Scorpio': ['Cancer', 'Pisces', 'Virgo', 'Capricorn'],
      'Sagittarius': ['Aries', 'Leo', 'Libra', 'Aquarius'],
      'Capricorn': ['Taurus', 'Virgo', 'Scorpio', 'Pisces'],
      'Aquarius': ['Gemini', 'Libra', 'Aries', 'Sagittarius'],
      'Pisces': ['Cancer', 'Scorpio', 'Taurus', 'Capricorn']
    };

    if (compatibleSigns[sign1]?.includes(sign2)) return 20;
    if (sign1 === sign2) return 10;
    return -5;
  }

  private static calculateAscendantCompatibility(asc1: string, asc2: string): number {
    // Similar logic for ascendant compatibility
    if (asc1 === asc2) return 15;
    return 0;
  }

  private static getCompatibilityInterpretation(score: number): string {
    if (score >= 80) return 'Excellent compatibility';
    if (score >= 60) return 'Good compatibility';
    if (score >= 40) return 'Average compatibility';
    if (score >= 20) return 'Below average compatibility';
    return 'Poor compatibility';
  }

  private static getDashaPredictionsByLord(lord: string): string[] {
    const predictions: { [key: string]: string[] } = {
      'Sun': ['Leadership opportunities', 'Government connections', 'Father-related matters'],
      'Moon': ['Emotional changes', 'Mother-related matters', 'Public recognition'],
      'Mars': ['Energy and action', 'Property matters', 'Sibling relationships'],
      'Mercury': ['Communication success', 'Learning opportunities', 'Business growth'],
      'Jupiter': ['Wisdom and knowledge', 'Spiritual growth', 'Teacher-student relationships'],
      'Venus': ['Relationship developments', 'Artistic pursuits', 'Material comforts'],
      'Saturn': ['Hard work and discipline', 'Delays but steady progress', 'Long-term commitments'],
      'Rahu': ['Unexpected changes', 'Foreign connections', 'Material desires'],
      'Ketu': ['Spiritual pursuits', 'Detachment', 'Past-life connections']
    };

    return predictions[lord] || ['General life developments'];
  }

  private static calculateTransitInfluence(birthPlanet: any, transitPlanet: any): string {
    const houseDifference = transitPlanet.house - birthPlanet.house;
    
    if (houseDifference === 0) return 'Same house - intensification of planetary energy';
    if (houseDifference === 6 || houseDifference === -6) return 'Challenging aspect - obstacles and conflicts';
    if (houseDifference === 8 || houseDifference === -8) return 'Transformative aspect - major changes';
    if (houseDifference === 3 || houseDifference === -3) return 'Growth aspect - expansion and opportunities';
    
    return 'Neutral influence';
  }
}