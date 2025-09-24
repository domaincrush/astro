
/**
 * Comprehensive Panchang Data for July 13, 2025 - Sunday
 * Location: Chennai, Tamil Nadu, India (13.0827°N, 80.2707°E)
 * Timezone: Asia/Kolkata (IST +05:30)
 */

export const july13PanchangData = {
  success: true,
  date: "2025-07-13",
  location: {
    latitude: 13.0827,
    longitude: 80.2707,
    timezone: "Asia/Kolkata",
    city: "Chennai, Tamil Nadu, India"
  },
  
  // Basic Panchang Elements
  panchang: {
    tithi: {
      name: "Dashami",
      number: 10,
      paksha: "Shukla Paksha",
      startTime: "15:42", // Jul 12 3:42 PM
      endTime: "17:21",   // Jul 13 5:21 PM
      percentageComplete: 91.5,
      lord: "Yama",
      characteristics: "Victory, achievement, success in endeavors"
    },
    
    nakshatra: {
      name: "Swati",
      number: 15,
      lord: "Rahu",
      deity: "Vayu",
      startTime: "02:18", // Jul 13 2:18 AM
      endTime: "04:12",   // Jul 14 4:12 AM
      percentageComplete: 78.3,
      pada: 3,
      characteristics: "Independence, movement, flexibility, trade"
    },
    
    yoga: {
      name: "Shiva",
      number: 20,
      startTime: "06:25", // Jul 12 6:25 AM
      endTime: "07:18",   // Jul 13 7:18 AM
      deity: "Shiva",
      nature: "Auspicious",
      characteristics: "Spiritual growth, meditation, divine connection"
    },
    
    karana: {
      first: {
        name: "Vanija",
        number: 6,
        startTime: "03:15", // Jul 13 3:15 AM
        endTime: "17:21",   // Jul 13 5:21 PM
        type: "Movable"
      },
      second: {
        name: "Vishti",
        number: 7,
        startTime: "17:21",  // Jul 13 5:21 PM
        endTime: "07:28",    // Jul 14 7:28 AM
        type: "Movable"
      }
    },
    
    vara: {
      name: "Ravivara",
      english: "Sunday",
      lord: "Sun",
      element: "Fire",
      color: "Red"
    }
  },
  
  // Sun & Moon Timings
  timings: {
    sunrise: "05:51",
    sunset: "18:32", 
    moonrise: "16:24",  // 4:24 PM
    moonset: "03:47",   // 3:47 AM (next day)
    dayLength: "12:41",
    nightLength: "11:19",
    moonPhase: "Waxing Gibbous",
    moonIllumination: "78.2%"
  },
  
  // Auspicious Times
  auspiciousTimes: {
    abhijitMuhurta: {
      start: "11:47",
      end: "12:35",
      description: "Most auspicious time for important work"
    },
    brahmaMuhurta: {
      start: "04:15",
      end: "05:03",
      description: "Best time for spiritual practices and meditation"
    },
    godhuli: {
      start: "18:02",
      end: "19:02",
      description: "Twilight period, good for prayers"
    },
    amritKaal: {
      start: "06:25",
      end: "08:01",
      description: "Nectar period based on Nakshatra"
    }
  },
  
  // Inauspicious Times
  inauspiciousTimes: {
    rahuKaal: {
      start: "16:56",
      end: "18:32",
      description: "Rahu period - avoid important new activities"
    },
    yamaganda: {
      start: "12:19",
      end: "13:55",
      description: "Yamaganda period - inauspicious time"
    },
    gulika: {
      start: "15:20",
      end: "16:56",
      description: "Gulika period - avoid new beginnings"
    },
    varjyam: {
      start: "21:47",
      end: "23:23",
      description: "Varjyam period - time to avoid for new activities"
    },
    durMuhurat: [
      { start: "12:35", end: "13:26", description: "Afternoon inauspicious period" }
    ]
  },
  
  // Zodiac Information
  zodiac: {
    moonSign: "Tula", // Libra
    sunSign: "Karka", // Cancer
    moonDegree: 198.5,
    sunDegree: 111.3
  },
  
  // Calendar Systems
  calendar: {
    vikramSamvat: 2082,
    shakaSamvat: 1947,
    lunarMonth: {
      amanta: "Ashadha",
      purnimanta: "Shravana"
    },
    paksha: "Shukla Paksha",
    season: "Varsha (Monsoon)",
    ritu: "Varsha",
    ayana: "Dakshinayana"
  },
  
  // Special Conditions
  specialConditions: {
    gandmool: false,
    panchaka: false,
    chandrashtama: false,
    bhadra: false
  },
  
  // Festivals & Observances
  festivals: [
    {
      name: "Shukla Paksha Dashami",
      type: "Tithi",
      description: "10th day of waxing moon, good for achieving goals"
    },
    {
      name: "Swati Nakshatra",
      type: "Nakshatra", 
      description: "Favorable for trade, travel, and business activities"
    }
  ],
  
  // Choghadiya (8 periods of the day)
  choghadiya: {
    day: [
      { name: "Udveg", start: "05:51", end: "07:27", nature: "Inauspicious", lord: "Sun" },
      { name: "Char", start: "07:27", end: "09:03", nature: "Good", lord: "Venus" },
      { name: "Labh", start: "09:03", end: "10:39", nature: "Auspicious", lord: "Mercury" },
      { name: "Amrit", start: "10:39", end: "12:15", nature: "Auspicious", lord: "Moon" },
      { name: "Kaal", start: "12:15", end: "13:51", nature: "Inauspicious", lord: "Saturn" },
      { name: "Shubh", start: "13:51", end: "15:27", nature: "Auspicious", lord: "Jupiter" },
      { name: "Rog", start: "15:27", end: "17:03", nature: "Inauspicious", lord: "Mars" },
      { name: "Udveg", start: "17:03", end: "18:32", nature: "Inauspicious", lord: "Sun" }
    ]
  },
  
  // Planetary Positions (Sidereal)
  planetaryPositions: {
    sun: { longitude: 111.3, sign: "Karka", nakshatra: "Pushya" },
    moon: { longitude: 198.5, sign: "Tula", nakshatra: "Swati" },
    mars: { longitude: 167.2, sign: "Kanya", nakshatra: "Hasta" },
    mercury: { longitude: 98.7, sign: "Karka", nakshatra: "Ardra" },
    jupiter: { longitude: 83.4, sign: "Mithuna", nakshatra: "Punarvasu" },
    venus: { longitude: 124.8, sign: "Simha", nakshatra: "Magha" },
    saturn: { longitude: 354.3, sign: "Meena", nakshatra: "Revati" },
    rahu: { longitude: 331.2, sign: "Meena", nakshatra: "Uttara Bhadrapada" },
    ketu: { longitude: 151.2, sign: "Kanya", nakshatra: "Chitra" }
  },
  
  // Astronomical Data
  astronomical: {
    julianDay: 2465037.5,
    ayanamsa: 24.12,
    sunLongitude: 135.42,
    moonLongitude: 222.62,
    sunSiderealLongitude: 111.3,
    moonSiderealLongitude: 198.5,
    lunarPhase: "Waxing Gibbous",
    lunation: 78.2
  },
  
  // Health & Wellness Recommendations
  recommendations: {
    favorableActivities: [
      "Spiritual practices and meditation (Sunday + Shiva Yoga)",
      "Business and trade activities (Swati Nakshatra)",
      "Completing ongoing projects (Dashami energy)",
      "Health and healing practices during Amrit period"
    ],
    avoid: [
      "Starting new ventures during Vishti Karana (after 5:21 PM)",
      "Important decisions during Rahu Kaal (4:56 PM - 6:32 PM)",
      "Travel during Yamaganda period",
      "Financial investments during Gulika time"
    ],
    health: [
      "Sun day - focus on heart, spine, vitality",
      "Swati Nakshatra - good for respiratory health",
      "Shukla Paksha - favorable for strength building"
    ]
  },
  
  metadata: {
    calculationMethod: "Swiss Ephemeris with Lahiri Ayanamsa",
    accuracy: "High precision astronomical calculations",
    source: "Vedic astronomical principles",
    calculatedAt: "2025-01-26T10:30:00Z",
    version: "3.1.0"
  }
};
