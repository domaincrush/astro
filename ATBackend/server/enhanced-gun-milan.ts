/**
 * Enhanced Gun Milan Calculator using Jyotisha Engine
 * Implements authentic Ashta Koot (8 Guna) Milan system with traditional Vedic rules
 * Based on Brihat Parashara Hora Shastra (BPHS) and classical astrology texts
 */

// Enhanced Nakshatra properties with complete attributes
export const NAKSHATRA_PROPERTIES = {
  'Ashwini': { varna: 'Brahmin', vashya: 'Chatushpada', gana: 'Deva', yoni: 'Ashwa', nadi: 'Adi', pada: [1, 2, 3, 4] },
  'Bharani': { varna: 'Kshatriya', vashya: 'Manushya', gana: 'Manushya', yoni: 'Gaja', nadi: 'Madhya', pada: [1, 2, 3, 4] },
  'Krittika': { varna: 'Vaishya', vashya: 'Vanachara', gana: 'Rakshasa', yoni: 'Mesha', nadi: 'Antya', pada: [1, 2, 3, 4] },
  'Rohini': { varna: 'Shudra', vashya: 'Jalochara', gana: 'Manushya', yoni: 'Sarpa', nadi: 'Adi', pada: [1, 2, 3, 4] },
  'Mrigashirsha': { varna: 'Shudra', vashya: 'Chatushpada', gana: 'Deva', yoni: 'Sarpa', nadi: 'Madhya', pada: [1, 2, 3, 4] },
  'Ardra': { varna: 'Shudra', vashya: 'Manushya', gana: 'Manushya', yoni: 'Shwan', nadi: 'Antya', pada: [1, 2, 3, 4] },
  'Punarvasu': { varna: 'Vaishya', vashya: 'Chatushpada', gana: 'Deva', yoni: 'Marjara', nadi: 'Adi', pada: [1, 2, 3, 4] },
  'Pushya': { varna: 'Kshatriya', vashya: 'Vanachara', gana: 'Deva', yoni: 'Mesha', nadi: 'Madhya', pada: [1, 2, 3, 4] },
  'Ashlesha': { varna: 'Kshatriya', vashya: 'Jalochara', gana: 'Rakshasa', yoni: 'Marjara', nadi: 'Antya', pada: [1, 2, 3, 4] },
  'Magha': { varna: 'Brahmin', vashya: 'Chatushpada', gana: 'Rakshasa', yoni: 'Mushika', nadi: 'Adi', pada: [1, 2, 3, 4] },
  'Purva Phalguni': { varna: 'Kshatriya', vashya: 'Manushya', gana: 'Manushya', yoni: 'Mushika', nadi: 'Madhya', pada: [1, 2, 3, 4] },
  'Uttara Phalguni': { varna: 'Vaishya', vashya: 'Vanachara', gana: 'Manushya', yoni: 'Gau', nadi: 'Antya', pada: [1, 2, 3, 4] },
  'Hasta': { varna: 'Shudra', vashya: 'Jalochara', gana: 'Deva', yoni: 'Mahisha', nadi: 'Adi', pada: [1, 2, 3, 4] },
  'Chitra': { varna: 'Shudra', vashya: 'Chatushpada', gana: 'Rakshasa', yoni: 'Vyaghra', nadi: 'Madhya', pada: [1, 2, 3, 4] },
  'Swati': { varna: 'Shudra', vashya: 'Manushya', gana: 'Deva', yoni: 'Mahisha', nadi: 'Antya', pada: [1, 2, 3, 4] },
  'Vishakha': { varna: 'Vaishya', vashya: 'Vanachara', gana: 'Rakshasa', yoni: 'Vyaghra', nadi: 'Adi', pada: [1, 2, 3, 4] },
  'Anuradha': { varna: 'Kshatriya', vashya: 'Jalochara', gana: 'Deva', yoni: 'Mriga', nadi: 'Madhya', pada: [1, 2, 3, 4] },
  'Jyeshtha': { varna: 'Kshatriya', vashya: 'Chatushpada', gana: 'Rakshasa', yoni: 'Mriga', nadi: 'Antya', pada: [1, 2, 3, 4] },
  'Mula': { varna: 'Brahmin', vashya: 'Manushya', gana: 'Rakshasa', yoni: 'Shwan', nadi: 'Adi', pada: [1, 2, 3, 4] },
  'Purva Ashadha': { varna: 'Kshatriya', vashya: 'Vanachara', gana: 'Manushya', yoni: 'Vanak', nadi: 'Madhya', pada: [1, 2, 3, 4] },
  'Uttara Ashadha': { varna: 'Vaishya', vashya: 'Jalochara', gana: 'Manushya', yoni: 'Nakul', nadi: 'Antya', pada: [1, 2, 3, 4] },
  'Shravana': { varna: 'Shudra', vashya: 'Chatushpada', gana: 'Deva', yoni: 'Vanak', nadi: 'Adi', pada: [1, 2, 3, 4] },
  'Dhanishta': { varna: 'Shudra', vashya: 'Manushya', gana: 'Rakshasa', yoni: 'Simha', nadi: 'Madhya', pada: [1, 2, 3, 4] },
  'Shatabhisha': { varna: 'Shudra', vashya: 'Vanachara', gana: 'Rakshasa', yoni: 'Ashwa', nadi: 'Antya', pada: [1, 2, 3, 4] },
  'Purva Bhadrapada': { varna: 'Vaishya', vashya: 'Jalochara', gana: 'Manushya', yoni: 'Simha', nadi: 'Adi', pada: [1, 2, 3, 4] },
  'Uttara Bhadrapada': { varna: 'Kshatriya', vashya: 'Chatushpada', gana: 'Manushya', yoni: 'Gau', nadi: 'Madhya', pada: [1, 2, 3, 4] },
  'Revati': { varna: 'Shudra', vashya: 'Manushya', gana: 'Deva', yoni: 'Gaja', nadi: 'Antya', pada: [1, 2, 3, 4] }
};

// Rashi (Moon Sign) properties
export const RASHI_PROPERTIES = {
  'Mesha': { lord: 'Mars', element: 'Fire', nature: 'Movable', number: 1 },
  'Vrishabha': { lord: 'Venus', element: 'Earth', nature: 'Fixed', number: 2 },
  'Mithuna': { lord: 'Mercury', element: 'Air', nature: 'Dual', number: 3 },
  'Karka': { lord: 'Moon', element: 'Water', nature: 'Movable', number: 4 },
  'Simha': { lord: 'Sun', element: 'Fire', nature: 'Fixed', number: 5 },
  'Kanya': { lord: 'Mercury', element: 'Earth', nature: 'Dual', number: 6 },
  'Tula': { lord: 'Venus', element: 'Air', nature: 'Movable', number: 7 },
  'Vrishchika': { lord: 'Mars', element: 'Water', nature: 'Fixed', number: 8 },
  'Dhanu': { lord: 'Jupiter', element: 'Fire', nature: 'Dual', number: 9 },
  'Makara': { lord: 'Saturn', element: 'Earth', nature: 'Movable', number: 10 },
  'Kumbha': { lord: 'Saturn', element: 'Air', nature: 'Fixed', number: 11 },
  'Meena': { lord: 'Jupiter', element: 'Water', nature: 'Dual', number: 12 }
};

// Planetary friendship matrix for Graha Maitri
export const PLANETARY_FRIENDSHIP = {
  'Sun': { friends: ['Moon', 'Mars', 'Jupiter'], neutral: ['Mercury'], enemies: ['Venus', 'Saturn'] },
  'Moon': { friends: ['Sun', 'Mercury'], neutral: ['Mars', 'Jupiter', 'Venus', 'Saturn'], enemies: [] },
  'Mars': { friends: ['Sun', 'Moon', 'Jupiter'], neutral: ['Venus', 'Saturn'], enemies: ['Mercury'] },
  'Mercury': { friends: ['Sun', 'Venus'], neutral: ['Mars', 'Jupiter', 'Saturn'], enemies: ['Moon'] },
  'Jupiter': { friends: ['Sun', 'Moon', 'Mars'], neutral: ['Saturn'], enemies: ['Mercury', 'Venus'] },
  'Venus': { friends: ['Mercury', 'Saturn'], neutral: ['Mars', 'Jupiter'], enemies: ['Sun', 'Moon'] },
  'Saturn': { friends: ['Mercury', 'Venus'], neutral: ['Jupiter'], enemies: ['Sun', 'Moon', 'Mars'] }
};

// Yoni compatibility matrix (4 points max)
export const YONI_COMPATIBILITY = {
  'Ashwa': { 'Ashwa': 4, 'Gaja': 2, 'Mesha': 2, 'Sarpa': 2, 'Shwan': 2, 'Marjara': 2, 'Mushika': 1, 'Gau': 2, 'Mahisha': 0, 'Vyaghra': 1, 'Mriga': 2, 'Vanak': 2, 'Nakul': 3, 'Simha': 1 },
  'Gaja': { 'Ashwa': 2, 'Gaja': 4, 'Mesha': 1, 'Sarpa': 3, 'Shwan': 2, 'Marjara': 2, 'Mushika': 2, 'Gau': 2, 'Mahisha': 3, 'Vyaghra': 2, 'Mriga': 2, 'Vanak': 2, 'Nakul': 2, 'Simha': 0 },
  'Mesha': { 'Ashwa': 2, 'Gaja': 1, 'Mesha': 4, 'Sarpa': 2, 'Shwan': 1, 'Marjara': 2, 'Mushika': 2, 'Gau': 3, 'Mahisha': 2, 'Vyaghra': 0, 'Mriga': 2, 'Vanak': 2, 'Nakul': 2, 'Simha': 2 },
  'Sarpa': { 'Ashwa': 2, 'Gaja': 3, 'Mesha': 2, 'Sarpa': 4, 'Shwan': 2, 'Marjara': 2, 'Mushika': 0, 'Gau': 2, 'Mahisha': 2, 'Vyaghra': 2, 'Mriga': 2, 'Vanak': 2, 'Nakul': 2, 'Simha': 2 },
  'Shwan': { 'Ashwa': 2, 'Gaja': 2, 'Mesha': 1, 'Sarpa': 2, 'Shwan': 4, 'Marjara': 1, 'Mushika': 2, 'Gau': 2, 'Mahisha': 0, 'Vyaghra': 2, 'Mriga': 2, 'Vanak': 2, 'Nakul': 2, 'Simha': 2 },
  'Marjara': { 'Ashwa': 2, 'Gaja': 2, 'Mesha': 2, 'Sarpa': 2, 'Shwan': 1, 'Marjara': 4, 'Mushika': 0, 'Gau': 2, 'Mahisha': 2, 'Vyaghra': 2, 'Mriga': 2, 'Vanak': 2, 'Nakul': 2, 'Simha': 2 },
  'Mushika': { 'Ashwa': 1, 'Gaja': 2, 'Mesha': 2, 'Sarpa': 0, 'Shwan': 2, 'Marjara': 0, 'Mushika': 4, 'Gau': 2, 'Mahisha': 2, 'Vyaghra': 2, 'Mriga': 2, 'Vanak': 2, 'Nakul': 2, 'Simha': 2 },
  'Gau': { 'Ashwa': 2, 'Gaja': 2, 'Mesha': 3, 'Sarpa': 2, 'Shwan': 2, 'Marjara': 2, 'Mushika': 2, 'Gau': 4, 'Mahisha': 0, 'Vyaghra': 1, 'Mriga': 2, 'Vanak': 2, 'Nakul': 2, 'Simha': 2 },
  'Mahisha': { 'Ashwa': 0, 'Gaja': 3, 'Mesha': 2, 'Sarpa': 2, 'Shwan': 0, 'Marjara': 2, 'Mushika': 2, 'Gau': 0, 'Mahisha': 4, 'Vyaghra': 2, 'Mriga': 2, 'Vanak': 2, 'Nakul': 2, 'Simha': 2 },
  'Vyaghra': { 'Ashwa': 1, 'Gaja': 2, 'Mesha': 0, 'Sarpa': 2, 'Shwan': 2, 'Marjara': 2, 'Mushika': 2, 'Gau': 1, 'Mahisha': 2, 'Vyaghra': 4, 'Mriga': 0, 'Vanak': 2, 'Nakul': 2, 'Simha': 2 },
  'Mriga': { 'Ashwa': 2, 'Gaja': 2, 'Mesha': 2, 'Sarpa': 2, 'Shwan': 2, 'Marjara': 2, 'Mushika': 2, 'Gau': 2, 'Mahisha': 2, 'Vyaghra': 0, 'Mriga': 4, 'Vanak': 2, 'Nakul': 2, 'Simha': 2 },
  'Vanak': { 'Ashwa': 2, 'Gaja': 2, 'Mesha': 2, 'Sarpa': 2, 'Shwan': 2, 'Marjara': 2, 'Mushika': 2, 'Gau': 2, 'Mahisha': 2, 'Vyaghra': 2, 'Mriga': 2, 'Vanak': 4, 'Nakul': 2, 'Simha': 2 },
  'Nakul': { 'Ashwa': 3, 'Gaja': 2, 'Mesha': 2, 'Sarpa': 2, 'Shwan': 2, 'Marjara': 2, 'Mushika': 2, 'Gau': 2, 'Mahisha': 2, 'Vyaghra': 2, 'Mriga': 2, 'Vanak': 2, 'Nakul': 4, 'Simha': 2 },
  'Simha': { 'Ashwa': 1, 'Gaja': 0, 'Mesha': 2, 'Sarpa': 2, 'Shwan': 2, 'Marjara': 2, 'Mushika': 2, 'Gau': 2, 'Mahisha': 2, 'Vyaghra': 2, 'Mriga': 2, 'Vanak': 2, 'Nakul': 2, 'Simha': 4 }
};

// Gana compatibility matrix (6 points max)
export const GANA_COMPATIBILITY = {
  'Deva': { 'Deva': 6, 'Manushya': 6, 'Rakshasa': 0 },
  'Manushya': { 'Deva': 6, 'Manushya': 6, 'Rakshasa': 0 },
  'Rakshasa': { 'Deva': 0, 'Manushya': 0, 'Rakshasa': 6 }
};

// Vashya compatibility matrix (2 points max)
export const VASHYA_COMPATIBILITY = {
  'Chatushpada': { 'Chatushpada': 2, 'Vanachara': 2, 'Jalochara': 1, 'Manushya': 1, 'Keeta': 0 },
  'Vanachara': { 'Chatushpada': 2, 'Vanachara': 2, 'Jalochara': 1, 'Manushya': 1, 'Keeta': 0 },
  'Jalochara': { 'Chatushpada': 1, 'Vanachara': 1, 'Jalochara': 2, 'Manushya': 1, 'Keeta': 0 },
  'Manushya': { 'Chatushpada': 1, 'Vanachara': 1, 'Jalochara': 1, 'Manushya': 2, 'Keeta': 0 },
  'Keeta': { 'Chatushpada': 0, 'Vanachara': 0, 'Jalochara': 0, 'Manushya': 0, 'Keeta': 2 }
};

export class EnhancedGunMilan {
  /**
   * Calculate Mangal Dosha (Mars Dosha) from birth chart planets
   * Mangal Dosha occurs when Mars is placed in 1st, 2nd, 4th, 7th, 8th, or 12th house
   */
  static calculateMangalDosha(planets: any[]) {
    const mars = planets.find((p: any) => p.name === 'Mars');
    if (!mars) {
      return { hasDosha: false, affectedHouses: [], severity: 'None' };
    }

    const marsHouse = mars.house;
    const doshHouses = [1, 2, 4, 7, 8, 12];
    const hasDosha = doshHouses.includes(marsHouse);
    
    let severity = 'None';
    if (hasDosha) {
      // High severity houses: 1st, 4th, 7th, 8th
      if ([1, 4, 7, 8].includes(marsHouse)) {
        severity = 'High';
      } else {
        severity = 'Medium';
      }
    }

    return {
      hasDosha,
      affectedHouses: hasDosha ? [marsHouse] : [],
      severity,
      marsHouse,
      description: hasDosha ? 
        `Mars in ${marsHouse}th house creates Mangal Dosha` : 
        `Mars in ${marsHouse}th house - No Mangal Dosha`
    };
  }

  /**
   * Calculate complete Gun Milan analysis with authentic Vedic principles
   */
  static calculateCompleteGunMilan(boyData: any, girlData: any) {
    console.log('🎯 Starting enhanced Gun Milan calculation...');
    console.log('Boy data:', boyData);
    console.log('Girl data:', girlData);

    // Get nakshatra properties
    const boyNakshatraProps = NAKSHATRA_PROPERTIES[boyData.nakshatra];
    const girlNakshatraProps = NAKSHATRA_PROPERTIES[girlData.nakshatra];

    if (!boyNakshatraProps || !girlNakshatraProps) {
      console.error('❌ Nakshatra not found in properties');
      throw new Error('Invalid nakshatra data');
    }

    // Calculate all 8 Gunas
    const varna = this.calculateVarna(boyNakshatraProps, girlNakshatraProps);
    const vashya = this.calculateVashya(boyNakshatraProps, girlNakshatraProps);
    const tara = this.calculateTara(boyData.nakshatra, girlData.nakshatra);
    const yoni = this.calculateYoni(boyNakshatraProps, girlNakshatraProps);
    const graha = this.calculateGrahaMaitri(boyData.moonSign, girlData.moonSign);
    const gana = this.calculateGana(boyNakshatraProps, girlNakshatraProps);
    const rashi = this.calculateRashi(boyData.moonSign, girlData.moonSign);
    const nadi = this.calculateNadi(boyNakshatraProps, girlNakshatraProps);

    // Calculate totals
    const totalScore = varna.score + vashya.score + tara.score + yoni.score + graha.score + gana.score + rashi.score + nadi.score;
    const maxScore = 36;
    const percentage = Math.round((totalScore / maxScore) * 100);

    console.log(`✅ Gun Milan calculation complete: ${totalScore}/${maxScore} (${percentage}%)`);

    return {
      varna,
      vashya,
      tara,
      yoni,
      graha,
      gana,
      rashi,
      nadi,
      totalScore,
      maxScore,
      percentage
    };
  }

  /**
   * Calculate Varna compatibility (1 point max)
   */
  static calculateVarna(boyProps: any, girlProps: any) {
    const boyVarna = boyProps.varna;
    const girlVarna = girlProps.varna;
    
    const varnaHierarchy = { 'Brahmin': 4, 'Kshatriya': 3, 'Vaishya': 2, 'Shudra': 1 };
    const score = varnaHierarchy[boyVarna] >= varnaHierarchy[girlVarna] ? 1 : 0;
    
    return {
      score,
      max: 1,
      description: score === 1 ? 'Compatible spiritual levels' : 'Spiritual mismatch'
    };
  }

  /**
   * Calculate Vashya compatibility (2 points max)
   */
  static calculateVashya(boyProps: any, girlProps: any) {
    const boyVashya = boyProps.vashya;
    const girlVashya = girlProps.vashya;
    
    const score = VASHYA_COMPATIBILITY[boyVashya]?.[girlVashya] || 0;
    
    return {
      score,
      max: 2,
      description: score === 2 ? 'Perfect mutual attraction' : score === 1 ? 'Good compatibility' : 'Compatibility issues'
    };
  }

  /**
   * Calculate Tara compatibility (3 points max)
   */
  static calculateTara(boyNakshatra: string, girlNakshatra: string) {
    const nakshatraList = Object.keys(NAKSHATRA_PROPERTIES);
    const boyIndex = nakshatraList.indexOf(boyNakshatra);
    const girlIndex = nakshatraList.indexOf(girlNakshatra);
    
    if (boyIndex === -1 || girlIndex === -1) {
      return { score: 0, max: 3, description: 'Unable to calculate Tara' };
    }

    // Calculate Tara from boy's nakshatra
    const taraFromBoy = ((girlIndex - boyIndex + 27) % 27) + 1;
    
    // Favorable Taras: 1, 3, 5, 7, 9 (odd numbers generally favorable)
    let score = 0;
    if ([1, 3, 5, 7, 9].includes(taraFromBoy)) {
      score = 3;
    } else if ([2, 4, 6, 8].includes(taraFromBoy)) {
      score = 1;
    } else {
      score = 0;
    }

    return {
      score,
      max: 3,
      description: score === 3 ? 'Excellent destiny match' : score === 1 ? 'Acceptable compatibility' : 'Destiny conflicts'
    };
  }

  /**
   * Calculate Yoni compatibility (4 points max)
   */
  static calculateYoni(boyProps: any, girlProps: any) {
    const boyYoni = boyProps.yoni;
    const girlYoni = girlProps.yoni;
    
    const score = YONI_COMPATIBILITY[boyYoni]?.[girlYoni] || 0;
    
    return {
      score,
      max: 4,
      description: score === 4 ? 'Perfect sexual compatibility' : score >= 2 ? 'Good biological match' : 'Sexual incompatibility'
    };
  }

  /**
   * Calculate Graha Maitri compatibility (5 points max)
   */
  static calculateGrahaMaitri(boyMoonSign: string, girlMoonSign: string) {
    const boyLord = RASHI_PROPERTIES[boyMoonSign]?.lord;
    const girlLord = RASHI_PROPERTIES[girlMoonSign]?.lord;
    
    if (!boyLord || !girlLord) {
      return { score: 0, max: 5, description: 'Unable to calculate planetary friendship' };
    }

    let score = 0;
    const boyFriendship = PLANETARY_FRIENDSHIP[boyLord];
    const girlFriendship = PLANETARY_FRIENDSHIP[girlLord];
    
    if (boyFriendship.friends.includes(girlLord) && girlFriendship.friends.includes(boyLord)) {
      score = 5;
    } else if (boyFriendship.friends.includes(girlLord) || girlFriendship.friends.includes(boyLord)) {
      score = 4;
    } else if (boyFriendship.neutral.includes(girlLord) && girlFriendship.neutral.includes(boyLord)) {
      score = 3;
    } else if (boyFriendship.neutral.includes(girlLord) || girlFriendship.neutral.includes(boyLord)) {
      score = 2;
    } else {
      score = 0;
    }

    return {
      score,
      max: 5,
      description: score >= 4 ? 'Excellent mental compatibility' : score >= 2 ? 'Good understanding' : 'Mental conflicts'
    };
  }

  /**
   * Calculate Gana compatibility (6 points max)
   */
  static calculateGana(boyProps: any, girlProps: any) {
    const boyGana = boyProps.gana;
    const girlGana = girlProps.gana;
    
    const score = GANA_COMPATIBILITY[boyGana]?.[girlGana] || 0;
    
    return {
      score,
      max: 6,
      description: score === 6 ? 'Perfect temperament match' : 'Temperament clashes expected'
    };
  }

  /**
   * Calculate Rashi (Bhakoot) compatibility (7 points max)
   */
  static calculateRashi(boyMoonSign: string, girlMoonSign: string) {
    const boyNumber = RASHI_PROPERTIES[boyMoonSign]?.number;
    const girlNumber = RASHI_PROPERTIES[girlMoonSign]?.number;
    
    if (!boyNumber || !girlNumber) {
      return { score: 0, max: 7, description: 'Unable to calculate Rashi compatibility' };
    }

    const difference = Math.abs(boyNumber - girlNumber);
    
    // Bhakoot Dosha: 6th and 8th positions are inauspicious
    if (difference === 6 || difference === 8) {
      return { score: 0, max: 7, description: 'Bhakoot Dosha present - family conflicts' };
    }

    // Other favorable combinations
    let score = 7;
    if (boyNumber === girlNumber) {
      score = 7; // Same sign
    } else if ([2, 12, 3, 11, 4, 10, 5, 9].includes(difference)) {
      score = 7; // Generally favorable
    } else {
      score = 3; // Average
    }

    return {
      score,
      max: 7,
      description: score === 7 ? 'Excellent family harmony' : score >= 3 ? 'Good family life' : 'Family problems'
    };
  }

  /**
   * Calculate Nadi compatibility (8 points max)
   */
  static calculateNadi(boyProps: any, girlProps: any) {
    const boyNadi = boyProps.nadi;
    const girlNadi = girlProps.nadi;
    
    // Nadi Dosha: Same Nadi is inauspicious
    const score = boyNadi !== girlNadi ? 8 : 0;
    
    return {
      score,
      max: 8,
      description: score === 8 ? 'Excellent genetic compatibility' : 'Nadi Dosha - health issues in offspring'
    };
  }

  /**
   * Calculate overall compatibility verdict
   */
  static getCompatibilityVerdict(totalScore: number, maxScore: number) {
    const percentage = (totalScore / maxScore) * 100;
    
    if (percentage >= 75) {
      return 'Excellent match - highly recommended for marriage';
    } else if (percentage >= 60) {
      return 'Good compatibility - suitable for marriage';
    } else if (percentage >= 50) {
      return 'Average compatibility - consult astrologer';
    } else if (percentage >= 32) {
      return 'Below average - detailed analysis needed';
    } else {
      return 'Poor compatibility - not recommended';
    }
  }

  /**
   * Get detailed remedies for doshas
   */
  static getRemedies(gunMilanResult: any) {
    const remedies = [];
    
    if (gunMilanResult.nadi.score === 0) {
      remedies.push('Nadi Dosha Remedy: Perform Mahamrityunjaya Puja and donate gold');
    }
    
    if (gunMilanResult.rashi.score === 0) {
      remedies.push('Bhakoot Dosha Remedy: Perform Kumbh Vivah and donate grains');
    }
    
    if (gunMilanResult.gana.score === 0) {
      remedies.push('Gana Dosha Remedy: Perform Gana Shanti Puja and donate clothes');
    }
    
    if (gunMilanResult.totalScore < 18) {
      remedies.push('General Remedy: Perform Vivah Badha Nivaran Puja before marriage');
    }
    
    return remedies;
  }

  /**
   * Generate comprehensive summary of horoscope matching results
   */
  static generateMatchSummary(gunMilanResult: any, doshaAnalysis: any) {
    console.log('🔍 Debug: Gun Milan result structure:', JSON.stringify(gunMilanResult, null, 2));
    
    try {
      const gunaScores = {
        varna: gunMilanResult.varna || { score: 0, description: 'Not calculated' },
        vashya: gunMilanResult.vashya || { score: 0, description: 'Not calculated' },
        tara: gunMilanResult.tara || { score: 0, description: 'Not calculated' },
        yoni: gunMilanResult.yoni || { score: 0, description: 'Not calculated' },
        graha: gunMilanResult.graha || { score: 0, description: 'Not calculated' },
        gana: gunMilanResult.gana || { score: 0, description: 'Not calculated' },
        rashi: gunMilanResult.rashi || { score: 0, description: 'Not calculated' },
        nadi: gunMilanResult.nadi || { score: 0, description: 'Not calculated' }
      };

      const gunaMaxScores = {
        varna: 1,
        vashya: 2,
        tara: 3,
        yoni: 4,
        graha: 5,
        gana: 6,
        rashi: 7,
        nadi: 8
      };

      const keyStrengths = [];
      const weakAreas = [];
      const criticalDoshas = [];

      // Analyze each guna for strengths and weaknesses
      Object.entries(gunaScores).forEach(([koota, result]: [string, any]) => {
        console.log(`🔍 Analyzing ${koota}:`, result);
        const maxScore = gunaMaxScores[koota as keyof typeof gunaMaxScores];
        const score = result?.score || 0;

        if (score === maxScore) {
          keyStrengths.push({
            koota: koota.charAt(0).toUpperCase() + koota.slice(1),
            score: `${score}/${maxScore}`,
            description: result?.description || 'Perfect match'
          });
        } else if (score < (maxScore / 2)) {
          weakAreas.push({
            koota: koota.charAt(0).toUpperCase() + koota.slice(1),
            score: `${score}/${maxScore}`,
            description: result?.description || 'Needs attention'
          });
        }

        // Check for critical doshas
        if (score === 0) {
          criticalDoshas.push({
            koota: koota.charAt(0).toUpperCase() + koota.slice(1),
            description: result?.description || 'Critical incompatibility'
          });
        }
      });

      // Generate verdict based on total score
      const totalScore = gunMilanResult.totalScore;
      const maxTotalScore = 36;
      const percentage = Math.round((totalScore / maxTotalScore) * 100);
    
    let verdict: string;
    let recommendation: string;
    let marriageAdvice: string;

    if (totalScore >= 28) {
      verdict = 'Excellent Compatibility';
      recommendation = 'Highly recommended for marriage';
      marriageAdvice = 'This is an exceptional match with strong compatibility across most aspects. Proceed with confidence.';
    } else if (totalScore >= 24) {
      verdict = 'Good Compatibility';
      recommendation = 'Suitable for marriage';
      marriageAdvice = 'This is a good match with solid compatibility. Minor adjustments may enhance harmony.';
    } else if (totalScore >= 18) {
      verdict = 'Moderate Compatibility';
      recommendation = 'Consult astrologer for guidance';
      marriageAdvice = 'This match has potential but requires careful consideration of weak areas and possible remedies.';
    } else if (totalScore >= 12) {
      verdict = 'Below Average Compatibility';
      recommendation = 'Detailed analysis and remedies needed';
      marriageAdvice = 'This match faces significant challenges. Strong commitment and appropriate remedies are essential.';
    } else {
      verdict = 'Poor Compatibility';
      recommendation = 'Not recommended without major remedies';
      marriageAdvice = 'This match has serious compatibility issues. Extensive remedies and expert guidance are crucial.';
    }

    // Generate dosha summary
    const doshaDetails = [];
    if (doshaAnalysis.mangalDosha.boy.present || doshaAnalysis.mangalDosha.girl.present) {
      const boyStatus = doshaAnalysis.mangalDosha.boy.present ? 'Manglik' : 'Non-Manglik';
      const girlStatus = doshaAnalysis.mangalDosha.girl.present ? 'Manglik' : 'Non-Manglik';
      doshaDetails.push(`Mangal Dosha: Boy - ${boyStatus}, Girl - ${girlStatus}`);
    }

    if (gunMilanResult.rashi.score === 0) {
      doshaDetails.push('Bhakoot Dosha: Present - may cause family conflicts');
    }

    if (gunMilanResult.nadi.score === 0) {
      doshaDetails.push('Nadi Dosha: Present - may affect health of offspring');
    }

    if (gunMilanResult.gana.score === 0) {
      doshaDetails.push('Gana Dosha: Present - temperament mismatch');
    }

    // Generate key insights
    const insights = [];
    if (keyStrengths.length > 0) {
      insights.push(`Strong compatibility in ${keyStrengths.length} areas: ${keyStrengths.map(s => s.koota).join(', ')}`);
    }
    if (weakAreas.length > 0) {
      insights.push(`Areas needing attention: ${weakAreas.map(w => w.koota).join(', ')}`);
    }
    if (criticalDoshas.length > 0) {
      insights.push(`Critical doshas present: ${criticalDoshas.map(d => d.koota).join(', ')}`);
    }

      return {
        totalScore,
        maxScore: maxTotalScore,
        percentage,
        verdict,
        recommendation,
        marriageAdvice,
        keyStrengths,
        weakAreas,
        criticalDoshas,
        doshaDetails,
        insights,
        remedies: this.getRemedies(gunMilanResult)
      };
    } catch (error) {
      console.error('❌ Error in generateMatchSummary:', error);
      // Return a fallback summary
      return {
        totalScore: gunMilanResult.totalScore || 0,
        maxScore: 36,
        percentage: Math.round(((gunMilanResult.totalScore || 0) / 36) * 100),
        verdict: 'Calculation Error',
        recommendation: 'Please try again or consult an expert',
        marriageAdvice: 'Unable to generate detailed analysis due to calculation error',
        keyStrengths: [],
        weakAreas: [],
        criticalDoshas: [],
        doshaDetails: [],
        insights: ['Analysis temporarily unavailable due to calculation error'],
        remedies: []
      };
    }
  }

  /**
   * Generate natural language summary text
   */
  static generateSummaryText(summary: any) {
    const strengthsText = summary.keyStrengths.length > 0 
      ? `⭐ Key Strengths: ${summary.keyStrengths.map((s: any) => `${s.koota} (${s.score})`).join(', ')}`
      : '⭐ Key Strengths: Limited strong areas identified';

    const weaknessesText = summary.weakAreas.length > 0
      ? `⚠️ Areas for Attention: ${summary.weakAreas.map((w: any) => `${w.koota} (${w.score})`).join(', ')}`
      : '⚠️ Areas for Attention: No significant weak areas';

    const doshaText = summary.doshaDetails.length > 0
      ? `🔍 Dosha Analysis:\n${summary.doshaDetails.map((d: string) => `• ${d}`).join('\n')}`
      : '🔍 Dosha Analysis: No major doshas detected';

    const remediesText = summary.remedies.length > 0
      ? `🙏 Recommended Remedies:\n${summary.remedies.map((r: string) => `• ${r}`).join('\n')}`
      : '🙏 Recommended Remedies: No specific remedies required';

    return `✅ Compatibility Summary: ${summary.totalScore}/${summary.maxScore} (${summary.percentage}%) - ${summary.verdict}

${summary.marriageAdvice}

${strengthsText}

${weaknessesText}

${doshaText}

${remediesText}

📊 Final Recommendation: ${summary.recommendation}`;
  }
}