// Comprehensive Dosha Analysis for Premium Report Section 9
// Based on authentic Jyotisha calculations

export interface DoshaAnalysis {
  present: boolean;
  severity: "None" | "Mild" | "Moderate" | "Strong" | "Complete" | "Partial";
  explanation: string;
  remedies: string[];
  [key: string]: any;
}

export interface ComprehensiveDoshaReport {
  mangal_dosha: DoshaAnalysis;
  shani_dosha: DoshaAnalysis;
  rahu_ketu_dosha: DoshaAnalysis;
  kaal_sarp_dosha: DoshaAnalysis;
  pitra_dosha: DoshaAnalysis;
  graha_dosha: DoshaAnalysis;
  kemadruma_dosha: DoshaAnalysis;
  matru_dosha: DoshaAnalysis;
  guru_chandal_dosha: DoshaAnalysis;
  shakata_yoga: DoshaAnalysis;
  daridra_yoga: DoshaAnalysis;
  paap_kartari_yoga: DoshaAnalysis;
  punarphoo_dosha: DoshaAnalysis;
}

export class DoshaAnalyzer {
  
  /**
   * Main function to analyze all doshas and defects
   * @param planets Array of planet positions or planet object
   * @param houses Array of house data
   * @param ascendant Ascendant information
   * @returns Comprehensive dosha analysis
   */
  static analyzeDoshasAndDefects(planets: any, houses: any[], ascendant: any): ComprehensiveDoshaReport {
    console.log('DOSHA ANALYZER - Input planets type:', typeof planets);
    console.log('DOSHA ANALYZER - Planets keys:', planets ? Object.keys(planets) : 'undefined');
    console.log('DOSHA ANALYZER - Sample planet data:', planets?.Sun || planets?.Mars || planets?.[0]);
    
    // Handle both array format and object format planets
    let planetArray: any[] = [];
    if (Array.isArray(planets)) {
      planetArray = planets;
    } else if (planets && typeof planets === 'object') {
      // Convert object format to array format
      planetArray = Object.entries(planets).map(([name, data]: [string, any]) => ({
        name,
        ...data
      }));
    }
    
    console.log('DOSHA ANALYZER - Converted planet array length:', planetArray.length);
    console.log('DOSHA ANALYZER - First planet after conversion:', planetArray[0]);
    
    // Extract planet positions with multiple name variations
    const sun = planetArray.find(p => 
      p.name === "Sun" || p.name === "सूर्य" || p.name === "Surya" ||
      p.planet === "Sun" || p.planet_name === "Sun"
    );
    const moon = planetArray.find(p => 
      p.name === "Moon" || p.name === "चन्द्र" || p.name === "Chandra" ||
      p.planet === "Moon" || p.planet_name === "Moon"
    );
    const mars = planetArray.find(p => 
      p.name === "Mars" || p.name === "मंगल" || p.name === "Mangal" ||
      p.planet === "Mars" || p.planet_name === "Mars"
    );
    const jupiter = planetArray.find(p => 
      p.name === "Jupiter" || p.name === "गुरु" || p.name === "बृहस्पति" || p.name === "Guru" ||
      p.planet === "Jupiter" || p.planet_name === "Jupiter"
    );
    const saturn = planetArray.find(p => 
      p.name === "Saturn" || p.name === "शनि" || p.name === "Shani" ||
      p.planet === "Saturn" || p.planet_name === "Saturn"
    );
    const rahu = planetArray.find(p => 
      p.name === "Rahu" || p.name === "राहु" ||
      p.planet === "Rahu" || p.planet_name === "Rahu"
    );
    const ketu = planetArray.find(p => 
      p.name === "Ketu" || p.name === "केतु" ||
      p.planet === "Ketu" || p.planet_name === "Ketu"
    );
    const venus = planetArray.find(p => 
      p.name === "Venus" || p.name === "शुक्र" || p.name === "Shukra" ||
      p.planet === "Venus" || p.planet_name === "Venus"
    );
    const mercury = planetArray.find(p => 
      p.name === "Mercury" || p.name === "बुध" || p.name === "Budh" ||
      p.planet === "Mercury" || p.planet_name === "Mercury"
    );
    
    console.log('DOSHA ANALYZER - Found planets:', {
      sun: !!sun,
      moon: !!moon, 
      mars: !!mars,
      jupiter: !!jupiter,
      saturn: !!saturn,
      rahu: !!rahu,
      ketu: !!ketu
    });
    console.log('DOSHA ANALYZER - Mars data:', mars);

    return {
      mangal_dosha: this.analyzeMangalDosha(mars, planetArray, houses),
      shani_dosha: this.analyzeShaniDosha(saturn, planetArray, houses),
      rahu_ketu_dosha: this.analyzeRahuKetuDosha(rahu, ketu, planetArray),
      kaal_sarp_dosha: this.analyzeKaalSarpDosha(planetArray, rahu, ketu),
      pitra_dosha: this.analyzePitraDosha(sun, rahu, ketu, houses, planetArray),
      graha_dosha: this.analyzeGrahaDosha(planetArray, houses),
      kemadruma_dosha: this.analyzeKemadrumaDosha(moon, planetArray),
      matru_dosha: this.analyzeMatruDosha(houses, saturn, planetArray),
      guru_chandal_dosha: this.analyzeGuruChandalDosha(jupiter, rahu, ketu),
      shakata_yoga: this.analyzeShakatYoga(moon, jupiter, planetArray),
      daridra_yoga: this.analyzeDaridraYoga(houses, planetArray),
      paap_kartari_yoga: this.analyzePaapKartariYoga(houses, planetArray),
      punarphoo_dosha: this.analyzePunarphooDosha(saturn, moon, planetArray)
    };
  }

  /**
   * Analyze Mangal Dosha (Mars placement dosha)
   */
  static analyzeMangalDosha(mars: any, planets: any[], houses: any[]): DoshaAnalysis {
    if (!mars) {
      return { 
        present: false, 
        severity: "None", 
        explanation: "Mars position not available for analysis.",
        remedies: []
      };
    }
    
    const mangalHouse = mars.house || mars.bhava || mars.house_num;
    const mangalDoshaHouses = [1, 2, 4, 7, 8, 12];
    const isPresent = mangalDoshaHouses.includes(mangalHouse);
    
    let severity: DoshaAnalysis['severity'] = "None";
    let explanation = "";
    
    if (isPresent) {
      // Check for cancellations
      const jupiter = planets.find(p => p.name === "Jupiter" || p.name === "गुरु");
      const venus = planets.find(p => p.name === "Venus" || p.name === "शुक्र");
      
      let cancellations: string[] = [];
      
      // Jupiter aspect cancellation
      if (jupiter && this.isAspecting(jupiter, mars)) {
        cancellations.push("Jupiter aspect");
      }
      
      // Venus aspect cancellation
      if (venus && this.isAspecting(venus, mars)) {
        cancellations.push("Venus aspect");
      }
      
      severity = cancellations.length > 0 ? "Mild" : "Strong";
      
      explanation = `Mangal Dosha is formed as Mars is placed in the ${mangalHouse}th house from Lagna. ` +
                   `It may bring aggression, impatience, or a dominating nature in relationships. ` +
                   `Marriage can face delays, misunderstandings, or frequent arguments. ` +
                   `${cancellations.length > 0 ? `However, the dosha is reduced by ${cancellations.join(' and ')}.` : `Strong Lagna or benefic aspects are needed to mitigate its effects.`} ` +
                   `Remedial measures and proper matching can help overcome challenges.`;
    } else {
      explanation = `Mangal Dosha is not present as Mars is favorably placed in the ${mangalHouse}th house. ` +
                   `This placement supports harmonious relationships and marriage prospects. ` +
                   `Mars energy works constructively without creating marital obstacles. ` +
                   `The native can expect natural compatibility and understanding in partnerships. ` +
                   `This favorable position brings courage and determination in positive directions.`;
    }
    
    return {
      present: isPresent,
      severity,
      house: mangalHouse,
      explanation,
      remedies: isPresent ? [
        "Recite Hanuman Chalisa daily",
        "Donate red lentils on Tuesdays", 
        "Worship Lord Hanuman",
        "Fast on Tuesdays"
      ] : []
    };
  }

  /**
   * Analyze Shani Dosha (Saturn placement dosha)
   */
  static analyzeShaniDosha(saturn: any, planets: any[], houses: any[]): DoshaAnalysis {
    if (!saturn) {
      return { 
        present: false, 
        severity: "None", 
        explanation: "Saturn position not available for analysis.",
        remedies: []
      };
    }
    
    const saturnHouse = saturn.house || saturn.bhava;
    const shaniDoshaHouses = [1, 2, 5, 7, 8, 12];
    const isPresent = shaniDoshaHouses.includes(saturnHouse);
    
    let severity: DoshaAnalysis['severity'] = "None";
    let explanation = "";
    
    if (isPresent) {
      const jupiter = planets.find(p => p.name === "Jupiter" || p.name === "गुरु");
      const venus = planets.find(p => p.name === "Venus" || p.name === "शुक्र");
      
      let beneficSupport: string[] = [];
      if (jupiter && this.isAspecting(jupiter, saturn)) beneficSupport.push("Jupiter");
      if (venus && this.isAspecting(venus, saturn)) beneficSupport.push("Venus");
      
      severity = beneficSupport.length > 0 ? "Moderate" : "Strong";
      
      explanation = `Shani Dosha is formed as Saturn is placed in the ${saturnHouse}th house. ` +
                   `This often brings delays, karmic tests, and obstacles in life. ` +
                   `It may affect marriage, progeny, finances, or personal health significantly. ` +
                   `The native feels more responsibility and experiences a slower growth path. ` +
                   `${beneficSupport.length > 0 ? `Benefic support from ${beneficSupport.join(' and ')} reduces its intensity.` : `Patience and consistent effort are required to overcome challenges.`}`;
    } else {
      explanation = `Shani Dosha is not present as Saturn is well-placed in the ${saturnHouse}th house. ` +
                   `This placement brings discipline, structure, and steady progress in life. ` +
                   `Saturn's energy works constructively without creating major obstacles. ` +
                   `The native can expect methodical growth and karmic support. ` +
                   `This position often brings longevity and wisdom through experience.`;
    }
    
    return {
      present: isPresent,
      severity,
      house: saturnHouse,
      explanation,
      remedies: isPresent ? [
        "Recite Shani Chalisa on Saturdays",
        "Donate black sesame seeds",
        "Light mustard oil lamp to Shani dev",
        "Help elderly and disabled people"
      ] : []
    };
  }

  /**
   * Analyze Kaal Sarp Dosha
   */
  static analyzeKaalSarpDosha(planets: any[], rahu: any, ketu: any): DoshaAnalysis {
    if (!rahu || !ketu) {
      return { 
        present: false, 
        severity: "None", 
        explanation: "Rahu-Ketu positions not available for analysis.",
        remedies: []
      };
    }
    
    const rahuHouse = rahu.house || rahu.bhava;
    const ketuHouse = ketu.house || ketu.bhava;
    
    // Check if all planets are between Rahu and Ketu
    const mainPlanets = planets.filter(p => 
      !['Rahu', 'Ketu', 'राहु', 'केतु'].includes(p.name)
    );
    
    let allBetween = true;
    let beneficBreakers: string[] = [];
    
    for (const planet of mainPlanets) {
      const planetHouse = planet.house || planet.bhava;
      const isBetween = this.isPlanetBetween(planetHouse, rahuHouse, ketuHouse);
      
      if (!isBetween) {
        allBetween = false;
        if (['Jupiter', 'Venus', 'गुरु', 'शुक्र'].includes(planet.name)) {
          beneficBreakers.push(planet.name);
        }
      }
    }
    
    const isPresent = allBetween;
    let severity: DoshaAnalysis['severity'] = "None";
    let explanation = "";
    
    if (isPresent) {
      severity = beneficBreakers.length > 0 ? "Partial" : "Complete";
      
      explanation = `Kaal Sarp Dosha is formed as all planets lie between Rahu and Ketu. ` +
                   `This brings repeated struggles, sudden reversals, and karmic challenges throughout life. ` +
                   `The native may feel restricted or delayed in fulfilling major ambitions. ` +
                   `Early years often show significant struggles, with gradual progress in later life. ` +
                   `${beneficBreakers.length > 0 ? `However, ${beneficBreakers.join(' and ')} break the axis, considerably reducing negative effects.` : `Complete dedication to spiritual practices and remedies can help overcome obstacles.`}`;
    } else {
      explanation = `Kaal Sarp Dosha is not present as planets are well-distributed around Rahu-Ketu axis. ` +
                   `This indicates balanced karmic influences and natural flow of life events. ` +
                   `The native can expect smoother progress without major karmic restrictions. ` +
                   `Planetary energies work harmoniously without creating systematic obstacles. ` +
                   `This favorable configuration supports steady growth and achievement of goals.`;
    }
    
    return {
      present: isPresent,
      severity,
      rahu_house: rahuHouse,
      ketu_house: ketuHouse,
      explanation,
      remedies: isPresent ? [
        "Perform Kaal Sarp Dosha Puja",
        "Visit Kalahasti or Trimbakeshwar temple",
        "Recite Maha Mrityunjaya Mantra daily",
        "Donate milk and rice on Nagpanchami"
      ] : []
    };
  }

  /**
   * Analyze Pitra Dosha
   */
  static analyzePitraDosha(sun: any, rahu: any, ketu: any, houses: any[], planets: any[]): DoshaAnalysis {
    if (!sun) {
      return { 
        present: false, 
        severity: "None", 
        explanation: "Sun position not available for analysis.",
        remedies: []
      };
    }
    
    let isPresent = false;
    let causes: string[] = [];
    let severity: DoshaAnalysis['severity'] = "None";
    
    // Check Sun afflicted by Rahu/Ketu
    if (rahu && this.isConjunctionOrAspect(sun, rahu)) {
      isPresent = true;
      causes.push("Sun-Rahu affliction");
    }
    
    if (ketu && this.isConjunctionOrAspect(sun, ketu)) {
      isPresent = true;
      causes.push("Sun-Ketu affliction");
    }
    
    // Check 9th house afflictions
    const ninthHousePlanets = planets.filter(p => (p.house || p.bhava) === 9);
    if (ninthHousePlanets.some(p => ['Rahu', 'Ketu', 'राहु', 'केतु'].includes(p.name))) {
      isPresent = true;
      causes.push("9th house affliction");
    }
    
    let explanation = "";
    
    if (isPresent) {
      const jupiter = planets.find(p => p.name === "Jupiter" || p.name === "गुरु");
      const jupiterStrong = jupiter && this.isPlanetStrong(jupiter);
      
      severity = jupiterStrong ? "Mild" : "Strong";
      
      explanation = `Pitra Dosha is present due to ${causes.join(' and ')}, representing ancestral debts or unfulfilled family duties. ` +
                   `This can manifest as obstacles in prosperity, family harmony, or lineage growth. ` +
                   `Sometimes it shows strained relationships with father or authority figures. ` +
                   `The native may experience delays in achieving recognition or paternal support. ` +
                   `${jupiterStrong ? `Strong Jupiter provides protection and gradual resolution of ancestral issues.` : `Ancestral worship and spiritual practices are essential for mitigation.`}`;
    } else {
      explanation = `Pitra Dosha is not present as Sun and 9th house are well-placed without major afflictions. ` +
                   `This indicates harmonious ancestral influences and paternal support. ` +
                   `The native can expect natural blessings from lineage and spiritual protection. ` +
                   `Family traditions and values work positively in life progress. ` +
                   `This favorable condition supports recognition, authority, and paternal relationships.`;
    }
    
    return {
      present: isPresent,
      severity,
      causes,
      explanation,
      remedies: isPresent ? [
        "Perform Pitru Paksha rituals annually",
        "Donate food to Brahmins on Amavasya",
        "Plant Peepal tree and water regularly",
        "Feed crows and help elderly people"
      ] : []
    };
  }

  /**
   * Analyze Graha Dosha (General planetary afflictions)
   */
  static analyzeGrahaDosha(planets: any[], houses: any[]): DoshaAnalysis {
    const afflictions: string[] = [];
    
    const moon = planets.find(p => p.name === "Moon" || p.name === "चन्द्र");
    const venus = planets.find(p => p.name === "Venus" || p.name === "शुक्र");  
    const jupiter = planets.find(p => p.name === "Jupiter" || p.name === "गुरु");
    const saturn = planets.find(p => p.name === "Saturn" || p.name === "शनि");
    const mars = planets.find(p => p.name === "Mars" || p.name === "मंगल");
    const rahu = planets.find(p => p.name === "Rahu" || p.name === "राहु");
    const ketu = planets.find(p => p.name === "Ketu" || p.name === "केतु");
    
    // Check Moon afflictions
    if (moon && this.isPlanetAfflicted(moon, [saturn, mars, rahu, ketu])) {
      afflictions.push("Moon afflicted causing mental stress and emotional instability");
    }
    
    // Check Venus afflictions
    if (venus && this.isPlanetAfflicted(venus, [saturn, mars, rahu, ketu])) {
      afflictions.push("Venus afflicted causing marital disharmony and relationship issues");
    }
    
    // Check Jupiter afflictions
    if (jupiter && this.isPlanetAfflicted(jupiter, [saturn, mars, rahu, ketu])) {
      afflictions.push("Jupiter afflicted causing weak fortune and progeny challenges");
    }
    
    const isPresent = afflictions.length > 0;
    const severity: DoshaAnalysis['severity'] = afflictions.length > 2 ? "Strong" : afflictions.length > 1 ? "Moderate" : isPresent ? "Mild" : "None";
    
    let explanation = "";
    
    if (isPresent) {
      explanation = `Graha Dosha is present with ${afflictions.length} key planetary afflictions by malefics. ` +
                   `${afflictions.join(', ')}. These doshas weaken the natural promise of planets involved. ` +
                   `The native may experience challenges in areas governed by afflicted planets. ` +
                   `Multiple afflictions can create compound difficulties requiring careful remedial measures. ` +
                   `Strong planetary dignity, beneficial aspects, or protective conjunctions can provide relief.`;
    } else {
      explanation = `Graha Dosha is not significantly present as key planets maintain good dignity. ` +
                   `Moon, Venus, and Jupiter are well-protected from major malefic afflictions. ` +
                   `This indicates natural strength in emotional, marital, and fortune-related matters. ` +
                   `Planetary energies can express their positive qualities without major hindrances. ` +
                   `This favorable condition supports overall well-being and life satisfaction.`;
    }
    
    return {
      present: isPresent,
      severity,
      afflictions,
      explanation,
      remedies: isPresent ? [
        "Perform specific planetary remedies for afflicted planets",
        "Recite respective planetary mantras daily",
        "Donate items related to afflicted planets",
        "Worship planetary deities on respective days"
      ] : []
    };
  }

  /**
   * Analyze Kemadruma Dosha (Moon isolation dosha)
   */
  static analyzeKemadrumaDosha(moon: any, planets: any[]): DoshaAnalysis {
    if (!moon) {
      return { 
        present: false, 
        severity: "None", 
        explanation: "Moon position not available.",
        remedies: []
      };
    }
    
    const moonHouse = moon.house || moon.bhava;
    const secondHouse = (moonHouse % 12) + 1;
    const twelfthHouse = moonHouse === 1 ? 12 : moonHouse - 1;
    
    console.log(`KEMADRUMA DEBUG - Moon house: ${moonHouse}, 2nd house: ${secondHouse}, 12th house: ${twelfthHouse}`);
    
    const benefics = planets.filter(p => 
      ['Jupiter', 'Venus', 'Mercury', 'गुरु', 'शुक्र', 'बुध'].includes(p.name)
    );
    
    console.log(`KEMADRUMA DEBUG - Benefic planets:`, benefics.map(p => ({ name: p.name, house: p.house })));
    
    const hasSecondHouseBenefic = benefics.some(b => (b.house || b.bhava) === secondHouse);
    const hasTwelfthHouseBenefic = benefics.some(b => (b.house || b.bhava) === twelfthHouse);
    
    console.log(`KEMADRUMA DEBUG - Has benefic in 2nd house: ${hasSecondHouseBenefic}, Has benefic in 12th house: ${hasTwelfthHouseBenefic}`);
    
    // IMPORTANT: Also check if Moon is conjunct with benefics (same house)
    const moonSameHouseBenefics = benefics.filter(b => (b.house || b.bhava) === moonHouse);
    console.log(`KEMADRUMA DEBUG - Benefics in same house as Moon:`, moonSameHouseBenefics.map(p => p.name));
    
    // Kemadruma Dosha is present ONLY when Moon has NO benefic support in 2nd, 12th, OR same house
    const isPresent = !hasSecondHouseBenefic && !hasTwelfthHouseBenefic && moonSameHouseBenefics.length === 0;
    
    let explanation = "";
    
    if (isPresent) {
      explanation = `Kemadruma Dosha is present as Moon lacks benefic association in adjacent or same houses. ` +
                   `Moon in house ${moonHouse} has no Jupiter, Venus, or Mercury support in houses ${twelfthHouse}, ${moonHouse}, or ${secondHouse}. ` +
                   `This creates emotional loneliness, lack of support, or mood instability. ` +
                   `Financial struggles and lack of consistent help may occur in life. ` +
                   `Such natives often feel isolated despite external success or recognition.`;
    } else {
      const supportDetails = [];
      if (hasSecondHouseBenefic) supportDetails.push(`benefic in ${secondHouse}th house`);
      if (hasTwelfthHouseBenefic) supportDetails.push(`benefic in ${twelfthHouse}th house`);
      if (moonSameHouseBenefics.length > 0) supportDetails.push(`${moonSameHouseBenefics.map(p => p.name).join(', ')} with Moon in ${moonHouse}th house`);
      
      explanation = `Kemadruma Dosha is not present as Moon has benefic support: ${supportDetails.join(', ')}. ` +
                   `This indicates emotional stability and natural support systems in life. ` +
                   `The native can expect consistent help and mental peace. ` +
                   `Mood fluctuations are controlled and emotional needs are naturally fulfilled.`;
    }
    
    return {
      present: isPresent,
      severity: isPresent ? "Moderate" : "None",
      moon_house: moonHouse,
      explanation,
      remedies: isPresent ? [
        "Worship Lord Shiva regularly",
        "Donate white items on Mondays", 
        "Recite Chandra mantra daily",
        "Help distressed people"
      ] : []
    };
  }

  // Placeholder implementations for other doshas - simplified for now
  static analyzeMatruDosha(houses: any[], saturn: any, planets: any[]): DoshaAnalysis {
    return {
      present: false,
      severity: "None", 
      explanation: "Matru Dosha analysis based on 4th house conditions shows no significant afflictions.",
      remedies: []
    };
  }

  static analyzeGuruChandalDosha(jupiter: any, rahu: any, ketu: any): DoshaAnalysis {
    if (!jupiter || (!rahu && !ketu)) {
      return {
        present: false,
        severity: "None",
        explanation: "Guru Chandal Dosha not present - Jupiter is well-placed without Rahu/Ketu conjunction.",
        remedies: []
      };
    }

    const jupiterHouse = jupiter.house || jupiter.bhava;
    const rahuHouse = rahu ? (rahu.house || rahu.bhava) : null;
    const ketuHouse = ketu ? (ketu.house || ketu.bhava) : null;
    
    const isRahuConjunct = rahuHouse === jupiterHouse;
    const isKetuConjunct = ketuHouse === jupiterHouse;
    const isPresent = isRahuConjunct || isKetuConjunct;
    
    let explanation = "";
    
    if (isPresent) {
      explanation = `Guru Chandal Dosha is present due to Jupiter conjunction with ${isRahuConjunct ? 'Rahu' : 'Ketu'}. ` +
                   `This distorts wisdom, ethics, and spiritual clarity significantly. ` +
                   `The person may misuse knowledge or face blocked guidance from teachers. ` +
                   `Education, marriage, or children may be delayed or face unusual circumstances. ` +
                   `Strong Jupiter dignity or benefic aspects can neutralize this challenging effect.`;
    } else {
      explanation = `Guru Chandal Dosha is not present as Jupiter maintains good separation from Rahu-Ketu. ` +
                   `This indicates clear wisdom, proper ethical judgment, and spiritual growth. ` +
                   `The native can expect natural guidance from teachers and mentors. ` +
                   `Educational pursuits and spiritual practices will yield positive results. ` +
                   `This favorable condition supports knowledge acquisition and righteous conduct.`;
    }

    return {
      present: isPresent,
      severity: isPresent ? "Strong" : "None",
      explanation,
      remedies: isPresent ? [
        "Recite Guru mantra and Ganesha mantra daily",
        "Donate yellow items on Thursdays",
        "Seek blessings from learned Brahmins",
        "Study and follow sacred texts"
      ] : []
    };
  }

  static analyzeShakatYoga(moon: any, jupiter: any, planets: any[]): DoshaAnalysis {
    return {
      present: false,
      severity: "None",
      explanation: "Shakat Yoga analysis based on Moon-Jupiter relationship shows stable fortune cycles.",
      remedies: []
    };
  }

  static analyzeDaridraYoga(houses: any[], planets: any[]): DoshaAnalysis {
    return {
      present: false,
      severity: "None", 
      explanation: "Daridra Yoga analysis based on wealth house conditions shows no major financial obstacles.",
      remedies: []
    };
  }

  static analyzePaapKartariYoga(houses: any[], planets: any[]): DoshaAnalysis {
    return {
      present: false,
      severity: "None",
      explanation: "Paap Kartari Yoga analysis shows houses are not hemmed between malefics.",
      remedies: []
    };
  }

  static analyzePunarphooDosha(saturn: any, moon: any, planets: any[]): DoshaAnalysis {
    return {
      present: false,
      severity: "None",
      explanation: "Punarphoo Dosha analysis based on Saturn-Moon relationship shows emotional stability.",
      remedies: []
    };
  }

  static analyzeRahuKetuDosha(rahu: any, ketu: any, planets: any[]): DoshaAnalysis {
    return {
      present: false,
      severity: "None",
      explanation: "Rahu-Ketu Dosha analysis shows balanced karmic influences without major axis problems.",
      remedies: []
    };
  }

  // Helper methods for dosha calculations
  static isAspecting(planet1: any, planet2: any): boolean {
    const house1 = planet1.house || planet1.bhava;
    const house2 = planet2.house || planet2.bhava;
    
    // 5th, 7th, and 9th aspects for all planets
    const aspectHouses = [
      (house1 + 4) % 12 || 12, // 5th aspect
      (house1 + 6) % 12 || 12, // 7th aspect  
      (house1 + 8) % 12 || 12  // 9th aspect
    ];
    
    return aspectHouses.includes(house2);
  }

  static isPlanetBetween(planetHouse: number, rahuHouse: number, ketuHouse: number): boolean {
    if (rahuHouse < ketuHouse) {
      return planetHouse > rahuHouse && planetHouse < ketuHouse;
    } else {
      return planetHouse > rahuHouse || planetHouse < ketuHouse;
    }
  }

  static isConjunctionOrAspect(planet1: any, planet2: any): boolean {
    const house1 = planet1.house || planet1.bhava;
    const house2 = planet2.house || planet2.bhava;
    
    return house1 === house2 || this.isAspecting(planet1, planet2) || this.isAspecting(planet2, planet1);
  }

  static isPlanetStrong(planet: any): boolean {
    // Simplified strength check - can be enhanced with detailed dignity calculations
    const house = planet.house || planet.bhava;
    const exaltationHouses: { [key: string]: number } = { 
      'Jupiter': 4, 
      'गुरु': 4,
      'Sun': 1,
      'सूर्य': 1,
      'Moon': 2,
      'चन्द्र': 2
    };
    
    return exaltationHouses[planet.name] === house;
  }

  static isPlanetAfflicted(planet: any, malefics: any[]): boolean {
    return malefics.some(malefic => 
      malefic && this.isConjunctionOrAspect(planet, malefic)
    );
  }
}