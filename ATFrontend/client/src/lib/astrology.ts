// Astrology calculation utilities
export interface BirthData {
  date: string;
  time: string;
  location: string;
  latitude: number;
  longitude: number;
}

export interface PlanetPosition {
  name: string;
  sign: string;
  degree: number;
  house: number;
  retrograde: boolean;
}

export interface BirthChart {
  planets: PlanetPosition[];
  houses: number[];
  ascendant: string;
  midheaven: string;
  aspects: Aspect[];
}

export interface Aspect {
  planet1: string;
  planet2: string;
  type: string;
  orb: number;
  exact: boolean;
}

export interface ZodiacSign {
  name: string;
  element: string;
  quality: string;
  ruler: string;
  symbol: string;
  dates: string;
  traits: string[];
}

// Vedic Astrology Zodiac Signs (Rashis)
export const ZODIAC_SIGNS: ZodiacSign[] = [
  {
    name: "Mesha (Aries)",
    element: "Fire",
    quality: "Movable",
    ruler: "Mars (Mangal)",
    symbol: "♈",
    dates: "March 21 - April 19",
    traits: ["Energetic", "Pioneering", "Confident", "Impulsive", "Independent"]
  },
  {
    name: "Taurus",
    element: "Earth",
    quality: "Fixed",
    ruler: "Venus",
    symbol: "♉",
    dates: "April 20 - May 20",
    traits: ["Stable", "Practical", "Sensual", "Stubborn", "Reliable"]
  },
  {
    name: "Gemini",
    element: "Air",
    quality: "Mutable",
    ruler: "Mercury",
    symbol: "♊",
    dates: "May 21 - June 20",
    traits: ["Curious", "Adaptable", "Communicative", "Restless", "Intellectual"]
  },
  {
    name: "Cancer",
    element: "Water",
    quality: "Cardinal",
    ruler: "Moon",
    symbol: "♋",
    dates: "June 21 - July 22",
    traits: ["Nurturing", "Emotional", "Intuitive", "Protective", "Sensitive"]
  },
  {
    name: "Leo",
    element: "Fire",
    quality: "Fixed",
    ruler: "Sun",
    symbol: "♌",
    dates: "July 23 - August 22",
    traits: ["Creative", "Generous", "Dramatic", "Proud", "Confident"]
  },
  {
    name: "Virgo",
    element: "Earth",
    quality: "Mutable",
    ruler: "Mercury",
    symbol: "♍",
    dates: "August 23 - September 22",
    traits: ["Analytical", "Perfectionist", "Helpful", "Critical", "Practical"]
  },
  {
    name: "Libra",
    element: "Air",
    quality: "Cardinal",
    ruler: "Venus",
    symbol: "♎",
    dates: "September 23 - October 22",
    traits: ["Diplomatic", "Harmonious", "Social", "Indecisive", "Balanced"]
  },
  {
    name: "Scorpio",
    element: "Water",
    quality: "Fixed",
    ruler: "Pluto",
    symbol: "♏",
    dates: "October 23 - November 21",
    traits: ["Intense", "Mysterious", "Passionate", "Transformative", "Secretive"]
  },
  {
    name: "Sagittarius",
    element: "Fire",
    quality: "Mutable",
    ruler: "Jupiter",
    symbol: "♐",
    dates: "November 22 - December 21",
    traits: ["Adventurous", "Philosophical", "Optimistic", "Blunt", "Freedom-loving"]
  },
  {
    name: "Capricorn",
    element: "Earth",
    quality: "Cardinal",
    ruler: "Saturn",
    symbol: "♑",
    dates: "December 22 - January 19",
    traits: ["Ambitious", "Disciplined", "Responsible", "Conservative", "Practical"]
  },
  {
    name: "Aquarius",
    element: "Air",
    quality: "Fixed",
    ruler: "Uranus",
    symbol: "♒",
    dates: "January 20 - February 18",
    traits: ["Independent", "Innovative", "Humanitarian", "Detached", "Rebellious"]
  },
  {
    name: "Pisces",
    element: "Water",
    quality: "Mutable",
    ruler: "Neptune",
    symbol: "♓",
    dates: "February 19 - March 20",
    traits: ["Compassionate", "Intuitive", "Artistic", "Escapist", "Spiritual"]
  }
];

export const PLANETS = [
  { name: "Sun", symbol: "☉", keywords: ["Identity", "Ego", "Self-expression"] },
  { name: "Moon", symbol: "☽", keywords: ["Emotions", "Instincts", "Subconscious"] },
  { name: "Mercury", symbol: "☿", keywords: ["Communication", "Mind", "Learning"] },
  { name: "Venus", symbol: "♀", keywords: ["Love", "Beauty", "Harmony"] },
  { name: "Mars", symbol: "♂", keywords: ["Action", "Energy", "Passion"] },
  { name: "Jupiter", symbol: "♃", keywords: ["Expansion", "Wisdom", "Growth"] },
  { name: "Saturn", symbol: "♄", keywords: ["Structure", "Discipline", "Responsibility"] },
  { name: "Uranus", symbol: "♅", keywords: ["Innovation", "Revolution", "Independence"] },
  { name: "Neptune", symbol: "♆", keywords: ["Spirituality", "Dreams", "Illusion"] },
  { name: "Pluto", symbol: "♇", keywords: ["Transformation", "Power", "Rebirth"] }
];

export const HOUSES = [
  { number: 1, name: "House of Self", keywords: ["Identity", "Appearance", "First impressions"] },
  { number: 2, name: "House of Possessions", keywords: ["Money", "Values", "Material security"] },
  { number: 3, name: "House of Communication", keywords: ["Communication", "Siblings", "Short trips"] },
  { number: 4, name: "House of Home", keywords: ["Family", "Roots", "Private life"] },
  { number: 5, name: "House of Pleasure", keywords: ["Creativity", "Romance", "Children"] },
  { number: 6, name: "House of Health", keywords: ["Work", "Health", "Daily routines"] },
  { number: 7, name: "House of Partnership", keywords: ["Relationships", "Marriage", "Partnerships"] },
  { number: 8, name: "House of Transformation", keywords: ["Death", "Rebirth", "Shared resources"] },
  { number: 9, name: "House of Philosophy", keywords: ["Higher learning", "Travel", "Spirituality"] },
  { number: 10, name: "House of Career", keywords: ["Career", "Reputation", "Public image"] },
  { number: 11, name: "House of Friendship", keywords: ["Friends", "Groups", "Hopes"] },
  { number: 12, name: "House of Spirituality", keywords: ["Subconscious", "Karma", "Hidden things"] }
];

export class AstrologyCalculator {
  static getZodiacSign(birthDate: Date): ZodiacSign {
    const month = birthDate.getMonth() + 1;
    const day = birthDate.getDate();
    
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return ZODIAC_SIGNS[0]; // Aries
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return ZODIAC_SIGNS[1]; // Taurus
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return ZODIAC_SIGNS[2]; // Gemini
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return ZODIAC_SIGNS[3]; // Cancer
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return ZODIAC_SIGNS[4]; // Leo
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return ZODIAC_SIGNS[5]; // Virgo
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return ZODIAC_SIGNS[6]; // Libra
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return ZODIAC_SIGNS[7]; // Scorpio
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return ZODIAC_SIGNS[8]; // Sagittarius
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return ZODIAC_SIGNS[9]; // Capricorn
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return ZODIAC_SIGNS[10]; // Aquarius
    return ZODIAC_SIGNS[11]; // Pisces
  }

  static calculateCompatibility(sign1: string, sign2: string): number {
    const compatibilityMatrix: { [key: string]: { [key: string]: number } } = {
      "Aries": { "Leo": 95, "Sagittarius": 90, "Gemini": 85, "Aquarius": 80, "Aries": 75 },
      "Taurus": { "Virgo": 95, "Capricorn": 90, "Cancer": 85, "Pisces": 80, "Taurus": 75 },
      "Gemini": { "Libra": 95, "Aquarius": 90, "Aries": 85, "Leo": 80, "Gemini": 75 },
      "Cancer": { "Scorpio": 95, "Pisces": 90, "Taurus": 85, "Virgo": 80, "Cancer": 75 },
      "Leo": { "Aries": 95, "Sagittarius": 90, "Gemini": 85, "Libra": 80, "Leo": 75 },
      "Virgo": { "Taurus": 95, "Capricorn": 90, "Cancer": 85, "Scorpio": 80, "Virgo": 75 },
      "Libra": { "Gemini": 95, "Aquarius": 90, "Leo": 85, "Sagittarius": 80, "Libra": 75 },
      "Scorpio": { "Cancer": 95, "Pisces": 90, "Virgo": 85, "Capricorn": 80, "Scorpio": 75 },
      "Sagittarius": { "Leo": 95, "Aries": 90, "Libra": 85, "Aquarius": 80, "Sagittarius": 75 },
      "Capricorn": { "Virgo": 95, "Taurus": 90, "Scorpio": 85, "Pisces": 80, "Capricorn": 75 },
      "Aquarius": { "Libra": 95, "Gemini": 90, "Sagittarius": 85, "Aries": 80, "Aquarius": 75 },
      "Pisces": { "Scorpio": 95, "Cancer": 90, "Capricorn": 85, "Taurus": 80, "Pisces": 75 }
    };

    return compatibilityMatrix[sign1]?.[sign2] || 50;
  }

  static generateBirthChart(birthData: BirthData): BirthChart {
    // Simplified birth chart generation
    // In a real implementation, this would use astronomical calculations
    const planets: PlanetPosition[] = PLANETS.map((planet, index) => ({
      name: planet.name,
      sign: ZODIAC_SIGNS[Math.floor(Math.random() * 12)].name,
      degree: Math.floor(Math.random() * 30),
      house: (index % 12) + 1,
      retrograde: Math.random() < 0.2
    }));

    const houses = Array.from({ length: 12 }, (_, i) => (i * 30) + Math.floor(Math.random() * 30));
    
    const aspects: Aspect[] = [];
    for (let i = 0; i < planets.length; i++) {
      for (let j = i + 1; j < planets.length; j++) {
        if (Math.random() < 0.3) { // 30% chance of aspect
          aspects.push({
            planet1: planets[i].name,
            planet2: planets[j].name,
            type: ["Conjunction", "Opposition", "Square", "Trine", "Sextile"][Math.floor(Math.random() * 5)],
            orb: Math.floor(Math.random() * 10),
            exact: Math.random() < 0.1
          });
        }
      }
    }

    return {
      planets,
      houses,
      ascendant: ZODIAC_SIGNS[Math.floor(Math.random() * 12)].name,
      midheaven: ZODIAC_SIGNS[Math.floor(Math.random() * 12)].name,
      aspects
    };
  }

  static interpretPlanetInSign(planet: string, sign: string): string {
    const interpretations: { [key: string]: { [key: string]: string } } = {
      "Sun": {
        "Aries": "Dynamic leadership, pioneering spirit, natural confidence",
        "Taurus": "Steady determination, practical approach, love of beauty",
        "Gemini": "Curious mind, versatile communication, adaptable nature"
        // Add more interpretations as needed
      },
      "Moon": {
        "Aries": "Emotional spontaneity, quick reactions, need for independence",
        "Taurus": "Emotional stability, comfort-seeking, sensual nature",
        "Gemini": "Changeable moods, intellectual emotions, need for variety"
        // Add more interpretations as needed
      }
      // Add more planets as needed
    };

    return interpretations[planet]?.[sign] || `${planet} in ${sign} brings unique qualities to your personality.`;
  }
}

export interface HoroscopeData {
  sign: string;
  date: string;
  general: string;
  love: string;
  career: string;
  health: string;
  lucky: {
    number: number;
    color: string;
    element: string;
  };
}

export class HoroscopeGenerator {
  static generateDailyHoroscope(sign: string, date: Date): HoroscopeData {
    const horoscopes = {
      general: [
        "Today brings new opportunities for growth and self-discovery.",
        "Your intuition is particularly strong today, trust your inner voice.",
        "A chance encounter may lead to unexpected possibilities.",
        "Focus on your goals and take practical steps toward achieving them.",
        "Communication flows easily today, making it perfect for important conversations."
      ],
      love: [
        "Romance is in the air, and your charm is irresistible today.",
        "Past relationships may come into focus, offering closure or renewal.",
        "Your emotional depth attracts others to you naturally.",
        "Express your feelings openly and honestly for the best results.",
        "Single? Keep your heart open to unexpected connections."
      ],
      career: [
        "Your professional skills shine brightly today.",
        "A new project or opportunity may present itself soon.",
        "Collaboration with colleagues brings positive results.",
        "Trust your expertise and take the lead when needed.",
        "Financial opportunities may arise through your network."
      ],
      health: [
        "Pay attention to your body's signals and rest when needed.",
        "Physical activity will boost your energy and mood today.",
        "Stress relief through meditation or nature walks is beneficial.",
        "Your vitality is strong, but don't overexert yourself.",
        "Mental clarity improves with proper nutrition and hydration."
      ]
    };

    const colors = ["Red", "Blue", "Green", "Yellow", "Purple", "Orange", "Pink", "Turquoise"];
    const elements = ["Fire", "Water", "Earth", "Air"];

    return {
      sign,
      date: date.toISOString().split('T')[0],
      general: horoscopes.general[Math.floor(Math.random() * horoscopes.general.length)],
      love: horoscopes.love[Math.floor(Math.random() * horoscopes.love.length)],
      career: horoscopes.career[Math.floor(Math.random() * horoscopes.career.length)],
      health: horoscopes.health[Math.floor(Math.random() * horoscopes.health.length)],
      lucky: {
        number: Math.floor(Math.random() * 99) + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        element: elements[Math.floor(Math.random() * elements.length)]
      }
    };
  }
}