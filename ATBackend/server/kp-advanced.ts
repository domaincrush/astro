// Advanced Stellar System Implementation
// Based on traditional stellar astrology principles
// Implements authentic stellar influence and sub-lord significance theory

interface KPSignificatorAnalysis {
  planet: string;
  starLord: string;
  subLord: string;
  houses: number[];
  significance: string;
  strength: number;
  resultType: 'beneficial' | 'harmful' | 'mixed';
}

interface KPEventPrediction {
  eventType: string;
  significators: KPSignificatorAnalysis[];
  timing: {
    dasha: string;
    bhukti: string;
    antardasha: string;
  };
  probability: number;
  description: string;
}

export class AdvancedKPAnalyzer {
  
  // Authentic stellar astrology principles from traditional sources
  // Implementing Panchanga theory: Five planetary bodies work together
  // Based on established stellar calculation methods
  
  // Cuspal significance levels: No Vessel, Mug, Bucket, Barrel (wealth levels)
  private static readonly WEALTH_LEVELS = {
    NO_VESSEL: 0,    // Beggar level (5-8-12 houses)
    MUG: 1,          // Above poverty (5-8-12 + 2-11 houses)
    BUCKET: 2,       // Middle level (2-10-11 houses)
    BARREL: 3        // Enormous wealth (2-6-10-11 houses)
  };

  // Authentic KP Sub-lord proportions based on Vimshottari Dasha periods
  private static readonly SUB_LORD_PROPORTIONS = [
    { planet: 'Ketu', years: 7, arcMinutes: 0 },
    { planet: 'Venus', years: 20, arcMinutes: 0 },
    { planet: 'Sun', years: 6, arcMinutes: 0 },
    { planet: 'Moon', years: 10, arcMinutes: 0 },
    { planet: 'Mars', years: 7, arcMinutes: 0 },
    { planet: 'Rahu', years: 18, arcMinutes: 0 },
    { planet: 'Jupiter', years: 16, arcMinutes: 0 },
    { planet: 'Saturn', years: 19, arcMinutes: 0 },
    { planet: 'Mercury', years: 17, arcMinutes: 0 }
  ];

  // Cuspal Wealth Level Analysis from original texts
  static analyzeCuspalWealth(chartData: any): { level: number; description: string } {
    const secondHouseCusp = chartData.cusps[1]; // 2nd house cusp
    const houses = this.getHouseConnections(secondHouseCusp);
    
    // Check house connections for wealth levels
    const has5_8_12 = houses.some((h: number) => [5, 8, 12].includes(h));
    const has2_11 = houses.some((h: number) => [2, 11].includes(h));
    const has10 = houses.includes(10);
    const has6 = houses.includes(6);
    
    if (has5_8_12 && !has2_11) {
      return { level: this.WEALTH_LEVELS.NO_VESSEL, description: "Beggar level - financial struggles" };
    } else if (has5_8_12 && has2_11) {
      return { level: this.WEALTH_LEVELS.MUG, description: "Above poverty line - modest income" };
    } else if (!has5_8_12 && has2_11 && has10) {
      return { level: this.WEALTH_LEVELS.BUCKET, description: "Middle class - comfortable earnings" };
    } else if (!has5_8_12 && has2_11 && has10 && has6) {
      return { level: this.WEALTH_LEVELS.BARREL, description: "Enormous wealth - millionaire potential" };
    }
    
    return { level: this.WEALTH_LEVELS.MUG, description: "Moderate financial status" };
  }

  // Panchanga Group Analysis - Five planetary bodies working together
  static analyzePanchangaGroup(chartData: any): { 
    groupStrength: number; 
    cooperatingPlanets: string[];
    description: string;
  } {
    const cooperatingPlanets: string[] = [];
    let groupStrength = 0;
    
    // Check for planetary cooperation in favorable sub-lords
    for (const planet of chartData.planets) {
      const subLord = this.getAuthenticSubLord(planet.longitude);
      const starLord = this.getStarLord(planet.longitude);
      
      if (this.isPanchangaCooperative(planet.name, subLord, starLord, chartData)) {
        cooperatingPlanets.push(planet.name);
        groupStrength += this.calculatePlanetaryStrength(planet, starLord, subLord);
      }
    }
    
    const description = cooperatingPlanets.length >= 3 
      ? "Strong Panchanga cooperation - favorable results"
      : "Weak planetary cooperation - mixed results";
    
    return { groupStrength, cooperatingPlanets, description };
  }

  // Four-fold Significator Analysis as described in the book
  static analyzeSignificators(chartData: any, questionType: string): KPSignificatorAnalysis[] {
    const significators: KPSignificatorAnalysis[] = [];
    
    for (const planet of chartData.planets) {
      const analysis = this.getFourFoldSignification(planet, chartData);
      significators.push(analysis);
    }
    
    return significators.filter(sig => this.isRelevantForQuestion(sig, questionType));
  }

  // Implement the authentic four-fold significator theory from the book
  private static getFourFoldSignification(planet: any, chartData: any): KPSignificatorAnalysis {
    const starLord = this.getStarLord(planet.longitude);
    const subLord = this.getAuthenticSubLord(planet.longitude);
    
    // First Order: Star lord's occupation
    const firstOrder = this.getHouseOccupation(starLord, chartData);
    
    // Second Order: Star lord's ownership
    const secondOrder = this.getHouseOwnership(starLord, chartData);
    
    // Third Order: Planet's own occupation
    const thirdOrder = this.getHouseOccupation(planet.name, chartData);
    
    // Fourth Order: Planet's own ownership (only if no other planet in its stars)
    const fourthOrder = this.getHouseOwnership(planet.name, chartData);
    
    const allHouses = [...firstOrder, ...secondOrder, ...thirdOrder, ...fourthOrder];
    const uniqueHouses = Array.from(new Set(allHouses));
    
    return {
      planet: planet.name,
      starLord,
      subLord,
      houses: uniqueHouses,
      significance: this.determineSignificance(uniqueHouses),
      strength: this.calculatePlanetaryStrength(planet, starLord, subLord),
      resultType: this.determineResultType(uniqueHouses, planet.longitude)
    };
  }

  // Calculate authentic sub-lord using proportional divisions
  private static getAuthenticSubLord(longitude: number): string {
    const nakshatraArc = 360 / 27; // 13°20' per nakshatra
    const positionInNakshatra = longitude % nakshatraArc;
    const totalYears = this.SUB_LORD_PROPORTIONS.reduce((sum, sub) => sum + sub.years, 0);
    
    // Calculate position within sub-lord divisions
    const proportionInNakshatra = positionInNakshatra / nakshatraArc;
    const timePosition = proportionInNakshatra * totalYears;
    
    let cumulativeYears = 0;
    for (const subLord of this.SUB_LORD_PROPORTIONS) {
      cumulativeYears += subLord.years;
      if (timePosition <= cumulativeYears) {
        return subLord.planet;
      }
    }
    
    return 'Mercury'; // Fallback
  }

  // Get star lord based on nakshatra position
  private static getStarLord(longitude: number): string {
    const nakshatraLords = [
      'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury',
      'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury',
      'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'
    ];
    
    const nakshatraIndex = Math.floor(longitude / (360/27)) % 27;
    return nakshatraLords[nakshatraIndex];
  }

  // Determine house occupation for a planet
  private static getHouseOccupation(planetName: string, chartData: any): number[] {
    // Implementation would determine which houses the planet occupies
    // This is a simplified version - full implementation would analyze the chart
    return [1]; // Placeholder
  }

  // Determine house ownership for a planet
  private static getHouseOwnership(planetName: string, chartData: any): number[] {
    const ownership: { [key: string]: number[] } = {
      'Sun': [5],
      'Moon': [4],
      'Mars': [1, 8],
      'Mercury': [3, 6],
      'Jupiter': [9, 12],
      'Venus': [2, 7],
      'Saturn': [10, 11],
      'Rahu': [],
      'Ketu': []
    };
    
    return ownership[planetName] || [];
  }

  // Calculate planetary strength based on KP principles
  private static calculatePlanetaryStrength(planet: any, starLord: string, subLord: string): number {
    let strength = 50; // Base strength
    
    // Sub-lord is most important in KP
    if (subLord === planet.name) {
      strength += 30; // Strong when in own sub
    }
    
    // Star lord influence
    if (starLord === planet.name) {
      strength += 20; // Good when in own star
    }
    
    // Exaltation/Debilitation effects
    if (this.isExalted(planet.name, planet.longitude)) {
      strength += 25;
    } else if (this.isDebilitated(planet.name, planet.longitude)) {
      strength -= 25;
    }
    
    return Math.max(0, Math.min(100, strength));
  }

  // Check if planet is exalted
  private static isExalted(planetName: string, longitude: number): boolean {
    const exaltationDegrees: { [key: string]: number } = {
      'Sun': 10,      // Aries 10°
      'Moon': 33,     // Taurus 3°
      'Mars': 298,    // Capricorn 28°
      'Mercury': 345, // Virgo 15°
      'Jupiter': 95,  // Cancer 5°
      'Venus': 357,   // Pisces 27°
      'Saturn': 200   // Libra 20°
    };
    
    const exaltDegree = exaltationDegrees[planetName];
    return exaltDegree !== undefined && Math.abs(longitude - exaltDegree) < 1;
  }

  // Check if planet is debilitated
  private static isDebilitated(planetName: string, longitude: number): boolean {
    const debilitationDegrees: { [key: string]: number } = {
      'Sun': 190,     // Libra 10°
      'Moon': 213,    // Scorpio 3°
      'Mars': 118,    // Cancer 28°
      'Mercury': 165, // Pisces 15°
      'Jupiter': 275, // Capricorn 5°
      'Venus': 177,   // Virgo 27°
      'Saturn': 20    // Aries 20°
    };
    
    const debilDegree = debilitationDegrees[planetName];
    return debilDegree !== undefined && Math.abs(longitude - debilDegree) < 1;
  }

  // Determine significance based on houses involved
  private static determineSignificance(houses: number[]): string {
    const significanceMap: { [key: number]: string } = {
      1: 'Self, Personality, Health',
      2: 'Wealth, Family, Speech',
      3: 'Siblings, Communication, Short Travel',
      4: 'Mother, Home, Education, Vehicles',
      5: 'Children, Education, Romance, Speculation',
      6: 'Health, Service, Enemies, Debts',
      7: 'Marriage, Partnership, Business',
      8: 'Longevity, Transformation, Hidden Things',
      9: 'Fortune, Religion, Higher Learning',
      10: 'Career, Fame, Authority',
      11: 'Gains, Friends, Aspirations',
      12: 'Loss, Spirituality, Foreign Travel'
    };
    
    return houses.map(h => significanceMap[h]).join(', ');
  }

  // Determine if result will be beneficial or harmful
  private static determineResultType(houses: number[], longitude: number): 'beneficial' | 'harmful' | 'mixed' {
    const beneficHouses = [1, 2, 3, 5, 9, 10, 11];
    const maleficHouses = [6, 8, 12];
    const neutralHouses = [4, 7];
    
    const beneficCount = houses.filter(h => beneficHouses.includes(h)).length;
    const maleficCount = houses.filter(h => maleficHouses.includes(h)).length;
    
    if (beneficCount > maleficCount) return 'beneficial';
    if (maleficCount > beneficCount) return 'harmful';
    return 'mixed';
  }

  // Check if significator is relevant for the question type
  private static isRelevantForQuestion(significator: KPSignificatorAnalysis, questionType: string): boolean {
    const relevantHouses: { [key: string]: number[] } = {
      'marriage': [2, 7, 11],
      'career': [2, 6, 10, 11],
      'children': [2, 5, 11],
      'health': [1, 6, 8, 12],
      'wealth': [2, 11],
      'education': [4, 5, 9],
      'travel': [3, 9, 12]
    };
    
    const questionHouses = relevantHouses[questionType.toLowerCase()] || [];
    return significator.houses.some(house => questionHouses.includes(house));
  }

  // Predict event timing using KP principles
  static predictEventTiming(significators: KPSignificatorAnalysis[], eventType: string): KPEventPrediction {
    const strongestSignificator = significators.reduce((strongest, current) => 
      current.strength > strongest.strength ? current : strongest
    );
    
    return {
      eventType,
      significators,
      timing: {
        dasha: strongestSignificator.planet,
        bhukti: strongestSignificator.starLord,
        antardasha: strongestSignificator.subLord
      },
      probability: this.calculateEventProbability(significators),
      description: this.generateEventDescription(strongestSignificator, eventType)
    };
  }

  // Calculate probability of event occurrence
  private static calculateEventProbability(significators: KPSignificatorAnalysis[]): number {
    const totalStrength = significators.reduce((sum, sig) => sum + sig.strength, 0);
    const beneficStrength = significators
      .filter(sig => sig.resultType === 'beneficial')
      .reduce((sum, sig) => sum + sig.strength, 0);
    
    return Math.round((beneficStrength / totalStrength) * 100);
  }

  // Generate event description based on KP analysis
  private static generateEventDescription(significator: KPSignificatorAnalysis, eventType: string): string {
    const intensity = significator.strength > 70 ? 'strong' : significator.strength > 40 ? 'moderate' : 'weak';
    const outcome = significator.resultType === 'beneficial' ? 'favorable' : 
                   significator.resultType === 'harmful' ? 'challenging' : 'mixed';
    
    return `${eventType} shows ${intensity} indication with ${outcome} outcomes. ` +
           `Primary significator ${significator.planet} in ${significator.starLord} star, ` +
           `${significator.subLord} sub suggests ${significator.significance}.`;
  }

  // Helper method for cuspal house connections
  private static getHouseConnections(cuspLongitude: number): number[] {
    const subLord = this.getAuthenticSubLord(cuspLongitude);
    const starLord = this.getStarLord(cuspLongitude);
    
    // House connection logic based on star lord and sub lord positions
    const connections: number[] = [];
    
    // Add house numbers based on planetary positions
    const planetHouses: { [key: string]: number[] } = {
      'Sun': [1, 5, 9],
      'Moon': [2, 4, 7],
      'Mars': [3, 6, 8],
      'Mercury': [3, 6, 10],
      'Jupiter': [2, 5, 9, 11],
      'Venus': [2, 4, 7, 12],
      'Saturn': [6, 8, 10, 12],
      'Rahu': [6, 8, 11],
      'Ketu': [5, 8, 12]
    };
    
    if (planetHouses[starLord]) {
      connections.push(...planetHouses[starLord]);
    }
    if (planetHouses[subLord]) {
      connections.push(...planetHouses[subLord]);
    }
    
    // Remove duplicates using filter
    return connections.filter((value, index, array) => array.indexOf(value) === index);
  }

  // Helper method for Panchanga cooperation analysis
  private static isPanchangaCooperative(
    planet: string, 
    subLord: string, 
    starLord: string, 
    chartData: any
  ): boolean {
    // Check if planet, star lord, and sub lord are in harmony
    const beneficPlanets = ['Jupiter', 'Venus', 'Mercury', 'Moon'];
    
    // Panchanga cooperation logic from original texts
    if (beneficPlanets.includes(planet) && beneficPlanets.includes(subLord)) {
      return true;
    }
    
    if (beneficPlanets.includes(starLord) && beneficPlanets.includes(subLord)) {
      return true;
    }
    
    return false;
  }
}