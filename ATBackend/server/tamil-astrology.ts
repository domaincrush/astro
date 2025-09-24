// Tamil Astrology Translation and Formatting
// Uses the same Swiss Ephemeris calculations with Tamil presentation

interface TamilPlanetaryPosition {
  name: string;
  tamilName: string;
  longitude: number;
  sign: string;
  tamilSign: string;
  nakshatra: string;
  tamilNakshatra: string;
  degree: string;
  house: number;
}

interface TamilBirthChart {
  basicDetails: {
    name: string;
    birthDate: string;
    birthTime: string;
    birthPlace: string;
    gender: string;
    ascendant: string;
    tamilAscendant: string;
    moonSign: string;
    tamilMoonSign: string;
    nakshatra: string;
    tamilNakshatra: string;
    nakshatraLord: string;
    tamilNakshatraLord: string;
  };
  planets: TamilPlanetaryPosition[];
  houses: Array<{
    number: number;
    sign: string;
    tamilSign: string;
    planets: string[];
  }>;
  ayanamsa: number;
}

export class TamilAstrologyFormatter {
  // Planet names in Tamil
  private static readonly TAMIL_PLANETS = {
    'Sun': 'சூரியன்',
    'Moon': 'சந்திரன்',
    'Mercury': 'புதன்',
    'Venus': 'சுக்கிரன்',
    'Mars': 'செவ்வாய்',
    'Jupiter': 'குரு',
    'Saturn': 'சனி',
    'Rahu': 'ராகு',
    'Ketu': 'கேது',
    'Ascendant': 'லக்னம்'
  };

  // Rashi (zodiac signs) in Tamil
  private static readonly TAMIL_SIGNS = {
    'Aries': 'மேஷம்',
    'Taurus': 'ரிஷபம்',
    'Gemini': 'மிதுனம்',
    'Cancer': 'கடகம்',
    'Leo': 'சிம்மம்',
    'Virgo': 'கன்னி',
    'Libra': 'துலாம்',
    'Scorpio': 'விருச்சிகம்',
    'Sagittarius': 'தனுசு',
    'Capricorn': 'மகரம்',
    'Aquarius': 'கும்பம்',
    'Pisces': 'மீனம்'
  };

  // Nakshatras in Tamil
  private static readonly TAMIL_NAKSHATRAS = {
    'Ashwini': 'அஸ்வினி',
    'Bharani': 'பரணி',
    'Krittika': 'கிருத்திகை',
    'Rohini': 'ரோகிணி',
    'Mrigashira': 'மிருகசீர்ஷம்',
    'Ardra': 'ஆர்த்ரா',
    'Punarvasu': 'புனர்வசு',
    'Pushya': 'பூசம்',
    'Ashlesha': 'ஆஸ்லேஷா',
    'Magha': 'மகம்',
    'Purva Phalguni': 'பூர்வ பல்குனி',
    'Uttara Phalguni': 'உத்தர பல்குனி',
    'Hasta': 'ஹஸ்தம்',
    'Chitra': 'சித்திரை',
    'Swati': 'ஸ்வாதி',
    'Vishakha': 'விசாகா',
    'Anuradha': 'அனுராதா',
    'Jyeshtha': 'கேட்டை',
    'Mula': 'மூலம்',
    'Purva Ashadha': 'பூர்வாஷாடா',
    'Uttara Ashadha': 'உத்தராஷாடா',
    'Shravana': 'திருவோணம்',
    'Dhanishta': 'அவிட்டம்',
    'Shatabhisha': 'சதயம்',
    'Purva Bhadrapada': 'பூர்வ பத்ரபதா',
    'Uttara Bhadrapada': 'உத்தர பத்ரபதா',
    'Revati': 'ரேவதி'
  };

  // Convert longitude to zodiac sign
  private static getZodiacSign(longitude: number): string {
    const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
                  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
    const signIndex = Math.floor(longitude / 30);
    return signs[signIndex];
  }

  // Calculate nakshatra from longitude
  private static getNakshatra(longitude: number): string {
    const nakshatras = [
      'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
      'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
      'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
      'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
      'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
    ];
    
    const nakshatraIndex = Math.floor(longitude / 13.333333);
    return nakshatras[nakshatraIndex % 27];
  }

  // Format degree within sign
  private static formatDegree(longitude: number): string {
    const degreeInSign = longitude % 30;
    const degrees = Math.floor(degreeInSign);
    const minutes = Math.floor((degreeInSign - degrees) * 60);
    return `${degrees}°${minutes}'`;
  }

  // Calculate house position
  private static calculateHouse(planetLongitude: number, ascendantLongitude: number): number {
    let houseLongitude = planetLongitude - ascendantLongitude;
    if (houseLongitude < 0) houseLongitude += 360;
    return Math.floor(houseLongitude / 30) + 1;
  }

  // Format Tamil birth chart
  static formatTamilChart(ephemerisData: any, personalDetails: any): TamilBirthChart {
    const planets = ephemerisData.planets;
    const ascendant = planets.find((p: any) => p.name === 'Ascendant');
    const moon = planets.find((p: any) => p.name === 'Moon');
    
    const ascendantSign = this.getZodiacSign(ascendant.longitude);
    const moonSign = this.getZodiacSign(moon.longitude);
    const moonNakshatra = this.getNakshatra(moon.longitude);
    
    // Get nakshatra lord
    const nakshatraLords: { [key: string]: string } = {
      'Ashwini': 'Ketu', 'Bharani': 'Venus', 'Krittika': 'Sun', 'Rohini': 'Moon',
      'Mrigashira': 'Mars', 'Ardra': 'Rahu', 'Punarvasu': 'Jupiter', 'Pushya': 'Saturn',
      'Ashlesha': 'Mercury', 'Magha': 'Ketu', 'Purva Phalguni': 'Venus', 'Uttara Phalguni': 'Sun',
      'Hasta': 'Moon', 'Chitra': 'Mars', 'Swati': 'Rahu', 'Vishakha': 'Jupiter',
      'Anuradha': 'Saturn', 'Jyeshtha': 'Mercury', 'Mula': 'Ketu', 'Purva Ashadha': 'Venus',
      'Uttara Ashadha': 'Sun', 'Shravana': 'Moon', 'Dhanishta': 'Mars', 'Shatabhisha': 'Rahu',
      'Purva Bhadrapada': 'Jupiter', 'Uttara Bhadrapada': 'Saturn', 'Revati': 'Mercury'
    };
    
    const nakshatraLord = nakshatraLords[moonNakshatra] || 'Unknown';

    // Format planets with Tamil names
    const formattedPlanets: TamilPlanetaryPosition[] = planets
      .filter((p: any) => p.name !== 'Ascendant')
      .map((planet: any) => {
        const sign = this.getZodiacSign(planet.longitude);
        const nakshatra = this.getNakshatra(planet.longitude);
        const house = this.calculateHouse(planet.longitude, ascendant.longitude);
        
        return {
          name: planet.name,
          tamilName: this.TAMIL_PLANETS[planet.name as keyof typeof this.TAMIL_PLANETS] || planet.name,
          longitude: planet.longitude,
          sign: sign,
          tamilSign: this.TAMIL_SIGNS[sign as keyof typeof this.TAMIL_SIGNS] || sign,
          nakshatra: nakshatra,
          tamilNakshatra: this.TAMIL_NAKSHATRAS[nakshatra as keyof typeof this.TAMIL_NAKSHATRAS] || nakshatra,
          degree: this.formatDegree(planet.longitude),
          house: house
        };
      });

    // Generate house chart
    const houses = Array.from({ length: 12 }, (_, i) => {
      const houseNumber = i + 1;
      const houseLongitudeStart = (ascendant.longitude + (houseNumber - 1) * 30) % 360;
      const houseLongitudeEnd = (houseLongitudeStart + 30) % 360;
      const houseSign = this.getZodiacSign(houseLongitudeStart);
      
      const planetsInHouse = formattedPlanets
        .filter(p => p.house === houseNumber)
        .map(p => p.tamilName);
      
      return {
        number: houseNumber,
        sign: houseSign,
        tamilSign: this.TAMIL_SIGNS[houseSign as keyof typeof this.TAMIL_SIGNS] || houseSign,
        planets: planetsInHouse
      };
    });

    return {
      basicDetails: {
        name: personalDetails.name || 'பெயர் இல்லை',
        birthDate: personalDetails.birthDate || '',
        birthTime: personalDetails.birthTime || '',
        birthPlace: personalDetails.birthPlace || '',
        gender: personalDetails.gender === 'male' ? 'ஆண்' : personalDetails.gender === 'female' ? 'பெண்' : 'பாலினம் தெரியவில்லை',
        ascendant: ascendantSign,
        tamilAscendant: this.TAMIL_SIGNS[ascendantSign as keyof typeof this.TAMIL_SIGNS] || ascendantSign,
        moonSign: moonSign,
        tamilMoonSign: this.TAMIL_SIGNS[moonSign as keyof typeof this.TAMIL_SIGNS] || moonSign,
        nakshatra: moonNakshatra,
        tamilNakshatra: this.TAMIL_NAKSHATRAS[moonNakshatra as keyof typeof this.TAMIL_NAKSHATRAS] || moonNakshatra,
        nakshatraLord: nakshatraLord,
        tamilNakshatraLord: this.TAMIL_PLANETS[nakshatraLord as keyof typeof this.TAMIL_PLANETS] || nakshatraLord
      },
      planets: formattedPlanets,
      houses: houses,
      ayanamsa: ephemerisData.ayanamsa
    };
  }

  // Generate Tamil astrological summary
  static generateTamilSummary(chart: TamilBirthChart): string {
    const { basicDetails } = chart;
    
    return `
ஜாதக விவரங்கள்:
பெயர்: ${basicDetails.name}
பிறந்த தேதி: ${basicDetails.birthDate}
பிறந்த நேரம்: ${basicDetails.birthTime}
பிறந்த இடம்: ${basicDetails.birthPlace}
பாலினம்: ${basicDetails.gender}

முக்கிய கூறுகள்:
லக்னம்: ${basicDetails.tamilAscendant}
ராசி: ${basicDetails.tamilMoonSign}
நட்சத்திரம்: ${basicDetails.tamilNakshatra}
நட்சத்திர அதிபதி: ${basicDetails.tamilNakshatraLord}
அயனாம்சம்: ${chart.ayanamsa.toFixed(2)}°

கிரக நிலைகள்:
${chart.planets.map(p => `${p.tamilName}: ${p.tamilSign} ${p.degree} (${p.house}வது வீடு)`).join('\n')}
    `.trim();
  }
}