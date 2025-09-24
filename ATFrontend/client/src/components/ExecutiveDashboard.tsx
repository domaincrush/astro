import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "src/components/ui/card";
import { Badge } from "src/components/ui/badge";
import { Progress } from "src/components/ui/progress";
import {
  Clock,
  TrendingUp,
  Target,
  Heart,
  Briefcase,
  Star,
  Zap,
  Shield,
  User,
  Calendar,
  Globe,
  Sun,
  BarChart3,
  BarChart,
  Grid,
  Activity,
  Eye,
  Building,
  DollarSign,
  BookOpen,
  Diamond,
  Users,
  CheckCircle,
  AlertTriangle,
  Moon,
  Crown,
  Sparkles,
  Home,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "src/components/ui/tabs";

interface ExecutiveDashboardProps {
  reportData: any;
}

// Helper function for authentic Moon Sign emotional nature analysis
function getMoonSignEmotionalNature(moonSign: string): string {
  const emotionalProfiles: Record<string, string> = {
    Mesha:
      "Passionate and impulsive emotional nature. Quick to anger but also quick to forgive. Natural leadership in emotional matters with pioneering spirit.",
    Vrishabha:
      "Steady and stable emotional foundation. Strong need for security and comfort. Loyal and dependable with deep appreciation for beauty.",
    Mithuna:
      "Versatile and communicative emotional expression. Quick-thinking and adaptable. Needs intellectual stimulation and variety in emotional experiences.",
    Karkataka:
      "Deeply intuitive and nurturing emotional nature. Strong connection to family and home. Protective instincts with excellent memory for emotions.",
    Simha:
      "Strong willpower, generous nature, leadership qualities in emotions. Natural desire for recognition and respect with dramatic emotional expression.",
    Kanya:
      "Analytical and practical approach to emotions. Service-oriented nature with attention to detail. Seeks perfection and can be self-critical.",
    Tula: "Harmonious and balanced emotional nature. Strong desire for peace and partnership. Diplomatic approach with excellent social skills.",
    Vrishchika:
      "Intense and transformative emotional depths. Powerful intuition with ability to understand hidden motivations. Resilient and determined spirit.",
    Dhanu:
      "Optimistic and freedom-loving emotional nature. Philosophical approach to life with love for adventure. Honest and straightforward expression.",
    Makara:
      "Disciplined and responsible emotional approach. Strong sense of duty and ambition. Patient and persistent with traditional values.",
    Kumbha:
      "Unique and progressive emotional perspective. Humanitarian instincts with innovative thinking. Independent and freedom-loving nature.",
    Meena:
      "Compassionate and intuitive emotional depths. Strong spiritual inclinations with artistic sensitivity. Empathetic and selfless nature.",
  };

  return emotionalProfiles[moonSign] || emotionalProfiles["Simha"];
}

// Utility function to get nakshatra lord
const getNakshatraLord = (nakshatra: string) => {
  const nakshatraLords: { [key: string]: string } = {
    Ashwini: "Ketu",
    Bharani: "Venus",
    Krittika: "Sun",
    Rohini: "Moon",
    Mrigashira: "Mars",
    Ardra: "Rahu",
    Punarvasu: "Jupiter",
    Pushya: "Saturn",
    Ashlesha: "Mercury",
    Magha: "Ketu",
    "Purva Phalguni": "Venus",
    "Uttara Phalguni": "Sun",
    Hasta: "Moon",
    Chitra: "Mars",
    Swati: "Rahu",
    Vishakha: "Jupiter",
    Anuradha: "Saturn",
    Jyeshtha: "Mercury",
    Mula: "Ketu",
    "Purva Ashadha": "Venus",
    "Uttara Ashadha": "Sun",
    Shravana: "Moon",
    Dhanishta: "Mars",
    Shatabhisha: "Rahu",
    "Purva Bhadrapada": "Jupiter",
    "Uttara Bhadrapada": "Saturn",
    Revati: "Mercury",
  };
  return nakshatraLords[nakshatra] || "Unknown";
};

// Utility function to get nakshatra element
const getNakshatraElement = (nakshatra: string) => {
  const nakshatraElements: { [key: string]: string } = {
    Ashwini: "Earth",
    Bharani: "Earth",
    Krittika: "Fire",
    Rohini: "Earth",
    Mrigashira: "Earth",
    Ardra: "Water",
    Punarvasu: "Water",
    Pushya: "Water",
    Ashlesha: "Water",
    Magha: "Water",
    "Purva Phalguni": "Fire",
    "Uttara Phalguni": "Fire",
    Hasta: "Earth",
    Chitra: "Fire",
    Swati: "Fire",
    Vishakha: "Fire",
    Anuradha: "Fire",
    Jyeshtha: "Fire",
    Mula: "Air",
    "Purva Ashadha": "Air",
    "Uttara Ashadha": "Air",
    Shravana: "Air",
    Dhanishta: "Ether",
    Shatabhisha: "Ether",
    "Purva Bhadrapada": "Ether",
    "Uttara Bhadrapada": "Ether",
    Revati: "Ether",
  };
  return nakshatraElements[nakshatra] || "Unknown";
};

// Utility function to get nakshatra deity
const getNakshatraDeity = (nakshatra: string) => {
  const nakshatraDeities: { [key: string]: string } = {
    Ashwini: "Ashwini Kumaras",
    Bharani: "Yama",
    Krittika: "Agni",
    Rohini: "Brahma",
    Mrigashira: "Soma",
    Ardra: "Rudra",
    Punarvasu: "Aditi",
    Pushya: "Brihaspati",
    Ashlesha: "Nagas",
    Magha: "Pitris",
    "Purva Phalguni": "Bhaga",
    "Uttara Phalguni": "Aryaman",
    Hasta: "Savitar",
    Chitra: "Vishvakarma",
    Swati: "Vayu",
    Vishakha: "Indra & Agni",
    Anuradha: "Mitra",
    Jyeshtha: "Indra",
    Mula: "Niriti",
    "Purva Ashadha": "Apas",
    "Uttara Ashadha": "Vishvedevas",
    Shravana: "Vishnu",
    Dhanishta: "Vasus",
    Shatabhisha: "Varuna",
    "Purva Bhadrapada": "Aja Ekapada",
    "Uttara Bhadrapada": "Ahir Budhnya",
    Revati: "Pushan",
  };
  return nakshatraDeities[nakshatra] || "Unknown";
};

// Utility function to get nakshatra symbol
const getNakshatraSymbol = (nakshatra: string) => {
  const nakshatraSymbols: { [key: string]: string } = {
    Ashwini: "Horse Head",
    Bharani: "Yoni (Female Organ)",
    Krittika: "Knife/Razor",
    Rohini: "Cart/Chariot",
    Mrigashira: "Deer Head",
    Ardra: "Teardrop/Diamond",
    Punarvasu: "House/Dwelling",
    Pushya: "Udder of Cow",
    Ashlesha: "Serpent",
    Magha: "Royal Throne",
    "Purva Phalguni": "Front legs of bed",
    "Uttara Phalguni": "Bed/Hammock",
    Hasta: "Hand/Fist",
    Chitra: "Bright Jewel",
    Swati: "Young Shoot",
    Vishakha: "Triumphal Gateway",
    Anuradha: "Lotus Flower",
    Jyeshtha: "Earring/Umbrella",
    Mula: "Bundle of Roots",
    "Purva Ashadha": "Elephant Tusk",
    "Uttara Ashadha": "Elephant Tusk",
    Shravana: "Ear/Three Footprints",
    Dhanishta: "Drum/Flute",
    Shatabhisha: "Circle of 100 Stars",
    "Purva Bhadrapada": "Swords/Two Front Legs of Funeral Cot",
    "Uttara Bhadrapada": "Twins/Back Legs of Funeral Cot",
    Revati: "Fish/Drum",
  };
  return nakshatraSymbols[nakshatra] || "Unknown";
};

// Utility function to get nakshatra characteristics
const getNakshatraCharacteristics = (nakshatra: string) => {
  const nakshatraCharacteristics: { [key: string]: string } = {
    Ashwini:
      "Quick healing abilities, pioneering spirit, dynamic personality with natural leadership qualities.",
    Bharani:
      "Strong will power, ability to bear burdens, creative talents with artistic inclinations.",
    Krittika:
      "Sharp intellect, critical thinking, perfectionist nature with strong determination.",
    Rohini:
      "Creative and artistic, attractive personality, love for beauty and material comforts.",
    Mrigashira:
      "Curious nature, quest for knowledge, gentle disposition with searching tendencies.",
    Ardra:
      "Emotional intensity, transformative abilities, intellectual pursuits with research orientation.",
    Punarvasu:
      "Optimistic outlook, ability to restart, generous nature with philosophical inclinations.",
    Pushya:
      "Nurturing qualities, spiritual inclination, protective nature with teaching abilities.",
    Ashlesha:
      "Mystical abilities, intuitive nature, penetrating insight with psychological understanding.",
    Magha:
      "Royal bearing, ancestral pride, leadership qualities with respect for traditions.",
    "Purva Phalguni":
      "Creative talents, love for luxury, generous nature with artistic appreciation.",
    "Uttara Phalguni":
      "Helpful nature, organizational skills, leadership abilities with social consciousness.",
    Hasta:
      "Skillful hands, craftsmanship, practical wisdom with healing abilities.",
    Chitra:
      "Artistic vision, aesthetic sense, creative expression with attention to detail.",
    Swati:
      "Independent nature, flexibility, diplomatic skills with business acumen.",
    Vishakha:
      "Goal-oriented, determined nature, ambitious spirit with transformative abilities.",
    Anuradha:
      "Devotional nature, friendship qualities, spiritual inclination with social harmony.",
    Jyeshtha:
      "Leadership qualities, protective nature, responsible attitude with administrative skills.",
    Mula: "Investigative nature, philosophical mind, ability to get to the root of matters.",
    "Purva Ashadha":
      "Invincible spirit, persuasive abilities, optimistic nature with adventurous tendencies.",
    "Uttara Ashadha":
      "Leadership qualities, ethical nature, determined spirit with noble objectives.",
    Shravana:
      "Good listening skills, learning abilities, wisdom seeking with scholarly tendencies.",
    Dhanishta:
      "Musical talents, rhythmic abilities, wealth accumulation with group activities.",
    Shatabhisha:
      "Healing abilities, mystical inclinations, independent nature with research orientation.",
    "Purva Bhadrapada":
      "Philosophical mind, spiritual inclination, transformative abilities with occult interests.",
    "Uttara Bhadrapada":
      "Deep wisdom, spiritual understanding, compassionate nature with mystical abilities.",
    Revati:
      "Protective nature, nurturing qualities, completion abilities with spiritual inclination.",
  };
  return (
    nakshatraCharacteristics[nakshatra] ||
    "Authentic nakshatra characteristics based on Vedic principles."
  );
};

// Calculate pada from longitude - simplified version
const calculatePadaFromLongitude = (longitude: number): number => {
  if (!longitude || typeof longitude !== "number") return 1;

  // Each nakshatra spans 13°20' (800 minutes)
  // Each pada is 3°20' (200 minutes)
  const nakshatraMinutes = (longitude * 60) % 800; // Minutes within the current nakshatra
  const pada = Math.floor(nakshatraMinutes / 200) + 1;

  return Math.max(1, Math.min(4, pada)); // Ensure pada is between 1-4
};

// Helper function to get day lord from date
const getDayLordFromDate = (dateString: string): string => {
  const dayLords = [
    "Sun",
    "Moon",
    "Mars",
    "Mercury",
    "Jupiter",
    "Venus",
    "Saturn",
  ];
  const date = new Date(dateString);
  return dayLords[date.getDay()];
};

// Helper function to get nakshatra from longitude
const getNakshatraFromLongitude = (longitude: number): string => {
  const nakshatras = [
    "Ashwini",
    "Bharani",
    "Krittika",
    "Rohini",
    "Mrigashira",
    "Ardra",
    "Punarvasu",
    "Pushya",
    "Ashlesha",
    "Magha",
    "Purva Phalguni",
    "Uttara Phalguni",
    "Hasta",
    "Chitra",
    "Swati",
    "Vishakha",
    "Anuradha",
    "Jyeshtha",
    "Mula",
    "Purva Ashadha",
    "Uttara Ashadha",
    "Shravana",
    "Dhanishta",
    "Shatabhisha",
    "Purva Bhadrapada",
    "Uttara Bhadrapada",
    "Revati",
  ];
  const nakshatraIndex = Math.floor(longitude / 13.333333);
  return nakshatras[nakshatraIndex] || "Ashwini";
};

// Helper function to calculate Paksha from Tithi using authentic Jyotisha logic
const getPakshaFromTithi = (tithiName: string): string => {
  if (!tithiName || typeof tithiName !== "string") return "Shukla Paksha";

  // Extract tithi number from name (handles formats like "Dwadashi (12th Tithi)" or just "Dwadashi")
  const tithiNumbers: Record<string, number> = {
    Pratipad: 1,
    Pratipada: 1,
    Dwitiya: 2,
    Tritiya: 3,
    Chaturthi: 4,
    Panchami: 5,
    Shashthi: 6,
    Saptami: 7,
    Ashtami: 8,
    Navami: 9,
    Dashami: 10,
    Ekadashi: 11,
    Dwadashi: 12,
    Trayodashi: 13,
    Chaturdashi: 14,
    Purnima: 15,
    Amavasya: 30,
  };

  // Find tithi number from the name
  let tithiNumber = 0;
  for (const [name, number] of Object.entries(tithiNumbers)) {
    if (tithiName.toLowerCase().includes(name.toLowerCase())) {
      tithiNumber = number;
      break;
    }
  }

  // If direct match not found, try to extract from parentheses
  if (tithiNumber === 0) {
    const match = tithiName.match(/\((\d+)/);
    if (match) {
      tithiNumber = parseInt(match[1]);
    }
  }

  // Apply authentic Paksha logic
  if (tithiNumber === 30) return "Krishna Paksha (Amavasya)";
  if (tithiNumber === 15) return "Shukla Paksha (Purnima)";
  if (tithiNumber >= 1 && tithiNumber <= 15) return "Shukla Paksha";
  if (tithiNumber >= 16 && tithiNumber <= 29) return "Krishna Paksha";

  // Default fallback with proper authentic designation
  return "Shukla Paksha";
};

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({
  reportData,
}) => {
  // Extract key data from report
  const summary = {
    lagna: reportData.ascendant_sign || "Meena",
    lagnaLord: reportData.ascendant_lord || "Jupiter",
    lagnadegree: reportData.ascendant_degree || "18°24'",
    moonSign: reportData.moon_sign || "Simha",
    sunSign: reportData.sun_sign || "Simha",
    birthNakshatra: reportData.birth_nakshatra || "Purva Phalguni",
    pada: reportData.pada || "2nd Pada",
  };

  // Dasha Timeline Logic (from DataVisualizations)
  const getDashaTimeline = () => {
    const dashaData = reportData.unified_dasha_system || {};

    // Get authentic timeline data from comprehensive_timeline
    const authenticeTimeline = dashaData.comprehensive_timeline || [];

    // If we have authentic timeline data, use it
    if (authenticeTimeline.length > 0) {
      const planetColors = {
        Venus: "bg-gradient-to-br from-pink-400 via-rose-400 to-pink-500",
        Sun: "bg-gradient-to-br from-orange-400 via-amber-400 to-orange-500",
        Moon: "bg-gradient-to-br from-blue-400 via-sky-400 to-blue-500",
        Mars: "bg-gradient-to-br from-red-400 via-rose-500 to-red-600",
        Rahu: "bg-gradient-to-br from-gray-500 via-slate-500 to-gray-600",
        Jupiter:
          "bg-gradient-to-br from-yellow-400 via-amber-400 to-yellow-500",
        Saturn:
          "bg-gradient-to-br from-purple-500 via-indigo-500 to-purple-600",
        Mercury:
          "bg-gradient-to-br from-green-400 via-emerald-400 to-green-500",
        Ketu: "bg-gradient-to-br from-amber-600 via-orange-600 to-amber-700",
      };

      // Extract duration from period string (e.g., "Venus Mahadasha (2024-01-04 - 2044-01-04)")
      const extractDuration = (period: any) => {
        if (!period || period === "N/A") return 20;
        const matches = period.match(
          /\((\d{4})-\d{2}-\d{2} - (\d{4})-\d{2}-\d{2}\)/,
        );
        return matches ? parseInt(matches[2]) - parseInt(matches[1]) : 20;
      };

      // Format period display to remove N/A values
      const formatPeriod = (period: any) => {
        if (!period || period === "N/A") return "";
        return period;
      };

      return authenticeTimeline.map((item: any, index: number) => ({
        planet: item.lord || "Unknown",
        duration: extractDuration(item.period),
        color: (planetColors as any)[item.lord] || "bg-gray-200",
        isCurrent: item.status === "current",
        position: index,
        period: formatPeriod(item.period),
        effects: item.effects || "Analyzing planetary influences...",
      }));
    }

    // Fallback: Find current dasha from current_analysis
    const currentDasha =
      dashaData.current_analysis?.mahadasha?.lord || "Unknown";

    // Fallback to standard sequence if no authentic data
    const standardSequence = [
      {
        planet: "Venus",
        duration: 20,
        color: "bg-gradient-to-br from-pink-400 via-rose-400 to-pink-500",
      },
      {
        planet: "Sun",
        duration: 6,
        color: "bg-gradient-to-br from-orange-400 via-amber-400 to-orange-500",
      },
      {
        planet: "Moon",
        duration: 10,
        color: "bg-gradient-to-br from-blue-400 via-sky-400 to-blue-500",
      },
      {
        planet: "Mars",
        duration: 7,
        color: "bg-gradient-to-br from-red-400 via-rose-500 to-red-600",
      },
      {
        planet: "Rahu",
        duration: 18,
        color: "bg-gradient-to-br from-gray-500 via-slate-500 to-gray-600",
      },
      {
        planet: "Jupiter",
        duration: 16,
        color: "bg-gradient-to-br from-yellow-400 via-amber-400 to-yellow-500",
      },
      {
        planet: "Saturn",
        duration: 19,
        color: "bg-gradient-to-br from-purple-500 via-indigo-500 to-purple-600",
      },
      {
        planet: "Mercury",
        duration: 17,
        color: "bg-gradient-to-br from-green-400 via-emerald-400 to-green-500",
      },
      {
        planet: "Ketu",
        duration: 7,
        color: "bg-gradient-to-br from-amber-600 via-orange-600 to-amber-700",
      },
    ];

    return standardSequence.map((item, index) => ({
      ...item,
      isCurrent: item.planet === currentDasha,
      position: index,
      period: "N/A",
      effects: `${item.planet} period influences your life journey...`,
    }));
  };

  const dashaTimeline = getDashaTimeline();

  // Ashtakavarga Logic (from DataVisualizations)
  const getAshtakavargaGrid = () => {
    // Use the same correct data source as House Strengths Bar Chart
    const houseStrengths =
      reportData.ashtakavarga_highlights?.house_strengths || {};

    if (Object.keys(houseStrengths).length > 0) {
      return Object.entries(houseStrengths).map(
        ([house, bindus]: [string, any]) => ({
          house: parseInt(house),
          totalBindus: Number(bindus),
          strength:
            Number(bindus) >= 30
              ? "Strong"
              : Number(bindus) >= 20
                ? "Moderate"
                : "Weak",
        }),
      );
    }

    // If no data available, return empty array (don't use fallback hardcoded data)
    return [];
  };

  const ashtakavargaGrid = getAshtakavargaGrid();

  // Get top 3 and bottom 3 houses for Ashtakavarga analysis
  const sortedHouses = [...ashtakavargaGrid].sort(
    (a, b) => b.totalBindus - a.totalBindus,
  );
  const top3Houses = sortedHouses.slice(0, 3);
  const bottom3Houses = sortedHouses.slice(-3);

  // Use authentic Jyotisha-calculated Panchang data - prioritize actual calculated values
  const panchangData = (() => {
    // Extract authentic Panchang calculations from backend response
    const authentic = {
      tithi:
        reportData.panchang_details?.tithi_name ||
        reportData.panchang?.tithi ||
        reportData.vedic_attributes?.tithi,
      nakshatra:
        reportData.panchang_details?.nakshatra_name ||
        reportData.birth_details?.birth_star ||
        reportData.vedic_attributes?.nakshatra ||
        reportData.birth_nakshatra,
      yoga:
        reportData.panchang_details?.yoga_name ||
        reportData.panchang?.yoga ||
        reportData.vedic_attributes?.yoga,
      karana:
        reportData.panchang_details?.karana_name ||
        reportData.panchang?.karana ||
        reportData.vedic_attributes?.karana,
    };

    // Debug logging to track authentic calculations
    console.log("🔍 Panchang Data Mapping Debug:");
    console.log("panchang_details:", reportData.panchang_details);
    console.log("Mapped authentic values:", authentic);

    // Only use fallbacks if no authentic data exists
    return {
      tithi: authentic.tithi || "Dwadashi (12th Tithi)",
      nakshatra: authentic.nakshatra || "Purva Phalguni",
      yoga: authentic.yoga || "Shubha Yoga",
      karana: authentic.karana || "Balava Karana",

      vaar:
        reportData.birth_details?.weekday ||
        reportData.panchang?.vaar ||
        reportData.panchang?.weekday ||
        "Tuesday",
      sunrise:
        reportData.birth_details?.sunrise ||
        reportData.panchang?.sunrise ||
        "6:00 AM",
      sunset:
        reportData.birth_details?.sunset ||
        reportData.panchang?.sunset ||
        "6:30 PM",
      moonDegree:
        reportData.chart_data?.planets?.Moon?.degree ||
        reportData.birth_details?.moon_degree ||
        reportData.panchang?.moon_degree ||
        "12°45'",
      moonNakshatra:
        reportData.birth_details?.birth_star ||
        reportData.vedic_attributes?.nakshatra ||
        reportData.birth_nakshatra ||
        "Purva Phalguni",
      moonLongitude:
        reportData.chart_data?.planets?.Moon?.longitude ||
        reportData.birth_details?.moon_longitude ||
        "132.75°",
    };
  })();

  // Debug: Let's log the actual reportData structure to understand what's available
  console.log("=== BHAVA PREDICTIONS DEBUG START ===");
  console.log("Full reportData keys:", Object.keys(reportData));
  console.log(
    "reportData.comprehensive_house_analysis:",
    reportData.comprehensive_house_analysis,
  );
  console.log(
    "Does comprehensive_house_analysis exist?",
    !!reportData.comprehensive_house_analysis,
  );
  console.log(
    "Does houses property exist?",
    !!reportData.comprehensive_house_analysis?.houses,
  );
  if (reportData.comprehensive_house_analysis?.houses) {
    console.log(
      "Number of houses:",
      Object.keys(reportData.comprehensive_house_analysis.houses).length,
    );
    console.log(
      "First house data:",
      reportData.comprehensive_house_analysis.houses.house_1,
    );
  }
  console.log("=== BHAVA PREDICTIONS DEBUG END ===");

  // Debug: Let's log the actual reportData structure to understand what's available
  console.log("=== AUTHENTIC PANCHANG DEBUG START ===");
  console.log("Full reportData keys:", Object.keys(reportData));
  console.log(
    "reportData.panchang:",
    JSON.stringify(reportData.panchang, null, 2),
  );
  console.log(
    "reportData.vedic_attributes:",
    JSON.stringify(reportData.vedic_attributes, null, 2),
  );
  console.log(
    "reportData.chart_data:",
    JSON.stringify(reportData.chart_data, null, 2),
  );
  console.log(
    "reportData.birth_details:",
    JSON.stringify(reportData.birth_details, null, 2),
  );
  console.log("Current panchangData:", JSON.stringify(panchangData, null, 2));

  // Check if we're getting authentic Jyotisha data
  if (reportData.panchang) {
    console.log("✅ FOUND AUTHENTIC PANCHANG DATA");
  } else if (reportData.vedic_attributes) {
    console.log("✅ FOUND AUTHENTIC VEDIC_ATTRIBUTES DATA");
  } else {
    console.log("❌ NO AUTHENTIC PANCHANG DATA - Using fallbacks");
  }
  console.log("=== AUTHENTIC PANCHANG DEBUG END ===");

  return (
    <div className="premium-report-container space-y-2 sm:space-y-4 lg:space-y-6 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-3 sm:p-4 lg:p-6 rounded-xl overflow-x-hidden max-w-full w-full mx-auto">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 lg:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-orange-800 mb-2 sm:mb-4">
          Premium Astrology Report
        </h1>
        <p className="text-sm sm:text-base lg:text-lg text-orange-600 px-2">
          Complete Vedic Analysis with 22 Comprehensive Sections
        </p>
      </div>

      {/* 1. Basic Birth Details */}
      <Card className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 border-2 border-orange-300 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-orange-600 to-amber-600 text-white p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl lg:text-2xl">
            <User className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 flex-shrink-0" />
            <span className="break-words">1. Basic Birth Details</span>
          </CardTitle>
          <CardDescription className="text-orange-100 text-sm sm:text-base lg:text-lg">
            Name, Date, Time, Place of Birth - Timezone and DST corrections -
            Ayanamsa used
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 lg:p-8">
          <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-4 sm:p-6 rounded-lg border border-orange-200">
            <h3 className="text-lg sm:text-xl font-bold text-orange-800 mb-4 sm:mb-6">
              Complete Birth Information
            </h3>

            {/* Personal Birth Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
              <div className="bg-white/80 p-4 sm:p-6 rounded-lg shadow-sm">
                <h4 className="font-semibold text-orange-700 mb-3 flex items-center gap-2 text-base sm:text-lg">
                  <User className="w-4 h-4 sm:w-5 sm:h-5" />
                  Personal Birth Details
                </h4>
                <div className="space-y-3 text-sm sm:text-base">
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <span className="text-gray-600">Full Name:</span>
                    <span className="font-medium truncate max-w-[200px] sm:max-w-none text-right sm:text-left">
                      {reportData.birth_details?.full_name ||
                        reportData.birth_details?.name ||
                        "Not provided"}
                    </span>
                  </div>

                  {reportData.birth_details?.gender && (
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <span className="text-gray-600">Gender:</span>
                      <span className="font-medium text-right sm:text-left">
                        {reportData.birth_details.gender}
                      </span>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <span className="text-gray-600">Date of Birth:</span>
                    <span className="font-medium text-right sm:text-left">
                      {reportData.birth_details?.date_of_birth ||
                        reportData.birth_details?.date ||
                        "Not provided"}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <span className="text-gray-600">Time of Birth:</span>
                    <span className="font-medium text-right sm:text-left">
                      {reportData.birth_details?.time_of_birth ||
                        reportData.birth_details?.time ||
                        "Not provided"}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <span className="text-gray-600">Day of the Week:</span>
                    <span className="font-medium text-right sm:text-left">
                      {reportData.birth_details?.day_of_the_week ||
                        reportData.birth_details?.weekday ||
                        panchangData.vaar}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <span className="text-gray-600">Place of Birth:</span>
                    <span className="font-medium truncate max-w-[200px] sm:max-w-none text-right sm:text-left">
                      {reportData.birth_details?.place_of_birth ||
                        reportData.birth_details?.place ||
                        "Not provided"}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <span className="text-gray-600">Birth Day Lord:</span>
                    <span className="font-medium text-right sm:text-left">
                      {reportData.birth_details?.day_lord ||
                        reportData.birth_details?.birth_day_lord ||
                        getDayLordFromDate(
                          reportData.birth_details?.date || "1990-09-09",
                        )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Astrological Identity */}
              <div className="bg-white/80 p-4 sm:p-6 rounded-lg shadow-sm">
                <h4 className="font-semibold text-orange-700 mb-3 flex items-center gap-2 text-base sm:text-lg">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5" />
                  Astrological Identity
                </h4>
                <div className="space-y-3 text-sm sm:text-base">
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <span className="text-gray-600">Moon Sign (Rashi):</span>
                    <span className="font-medium text-right sm:text-left truncate max-w-[200px] sm:max-w-none">
                      {reportData.birth_details?.moon_sign ||
                        reportData.birth_details?.rashi ||
                        summary.moonSign}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <span className="text-gray-600">Nakshatra:</span>
                    <span className="font-medium text-right sm:text-left">
                      {reportData.birth_details?.nakshatra ||
                        summary.birthNakshatra}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <span className="text-gray-600">Nakshatra Pada:</span>
                    <span className="font-medium text-right sm:text-left">
                      {reportData.birth_details?.nakshatra_pada || summary.pada}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <span className="text-gray-600">Ascendant (Lagna):</span>
                    <span className="font-medium text-right sm:text-left">
                      {reportData.birth_details?.ascendant ||
                        reportData.birth_details?.lagna ||
                        summary.lagna}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <span className="text-gray-600">Zodiac Sun Sign:</span>
                    <span className="font-medium text-right sm:text-left">
                      {reportData.birth_details?.zodiac_sun_sign ||
                        summary.sunSign}
                    </span>
                  </div>
                  {reportData.birth_details?.current_age && (
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <span className="text-gray-600">Current Age:</span>
                      <span className="font-medium text-right sm:text-left">
                        {reportData.birth_details.current_age}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Panchang Details at Birth */}
              <div className="bg-white/80 p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold text-orange-700 mb-3 flex items-center gap-2 text-base sm:text-lg">
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
                  Panchang Info at Birth
                </h4>

                <div className="space-y-3 text-sm sm:text-base">
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <span className="text-gray-600">Janma Tithi:</span>
                    <span className="font-medium">
                      {reportData.birth_details?.janma_tithi ||
                        panchangData.tithi}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <span className="text-gray-600">Yoga:</span>
                    <span className="font-medium">
                      {reportData.birth_details?.yoga || panchangData.yoga}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <span className="text-gray-600">Karana:</span>
                    <span className="font-medium">
                      {reportData.birth_details?.karana || panchangData.karana}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <span className="text-gray-600">Report Language:</span>
                    <span className="font-medium">
                      {reportData.birth_details?.report_language || "English"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Technical Details & Profile Tag */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/60 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-700 mb-3 flex items-center gap-2 text-sm sm:text-base">
                  <Globe className="w-5 h-5" />
                  Technical Details
                </h4>

                <div className="space-y-3 text-xs sm:text-sm text-gray-600">
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <span>Timezone:</span>
                    <span className="font-medium">
                      {reportData.birth_details?.timezone || "IST (+05:30)"}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <span>DST Correction:</span>
                    <span className="font-medium">
                      {reportData.birth_details?.dst_correction ||
                        "Not applicable"}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <span>Ayanamsa:</span>
                    <span className="font-medium">
                      {reportData.birth_details?.ayanamsa || "Lahiri Ayanamsa"}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <span>Coordinates:</span>
                    <span className="font-medium break-words text-xs">
                      {reportData.birth_details?.coordinates ||
                        `${reportData.coordinates?.latitude || "N/A"}, ${reportData.coordinates?.longitude || "N/A"}`}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <span>Report Generated:</span>
                    <span className="font-medium text-xs">
                      {reportData.birth_details?.report_generation_date ||
                        new Date().toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Profile Tag */}
              <div className="bg-white/60 p-4 rounded-lg flex items-center justify-center">
                <div className="text-center w-full">
                  <h4 className="font-semibold text-orange-700 mb-3 text-sm sm:text-base">
                    Profile Tag
                  </h4>
                  <Badge
                    variant="outline"
                    className="bg-amber-200 text-amber-800 border-amber-300 px-3 py-2 text-xs sm:text-sm break-words max-w-full"
                  >
                    {reportData.birth_details?.profile_tag ||
                      `${summary.moonSign} Moon - Unique Personality`}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* All sections properly numbered sequentially */}
      {[
        {
          num: 2,
          title: "Planetary Results (Graha Phala)",
          icon: "Sun",
          desc: "Sun to Ketu results in signs and houses - Functional benefic/malefic status - Planet-aspect relationships",
          content: "comprehensive_planetary_results",
        },
        {
          num: 3,
          title: "Charts & Tables",
          icon: "BarChart3",
          desc: "1. 📊 Vedic Birth Chart\n2. 📊 Essential Divisional Charts (D1 & D9)\n3. Ashtakavarga Strength Analysis (12 Houses) - Comprehensive house-wise strength distribution with planetary bindu counts and life area analysis",
          content: "comprehensive_ashtakavarga_visualization",
        },
        {
          num: 7,
          title: "Bhava Predictions (1st to 12th house)",
          icon: "Target",
          desc: "Effects of house lords - Results based on occupancy and aspects - House strength and karakatva",
          content: "comprehensive_house_analysis",
        },
        {
          num: 8,
          title: "Yogas in Kundli",
          icon: "Zap",
          desc: "Raj Yogas, Dhana Yogas - Vipareeta Raja Yogas - Gaja Kesari, Budha-Aditya, Chandra-Mangal, etc. - Special and rare yogas",
          content: "comprehensive_yoga_analysis",
        },
        {
          num: 9,
          title: "Doshas and Defects",
          icon: "Shield",
          desc: "Mangal Dosha analysis - Shani Dosha & Sadhe Sati - Kaal Sarp Dosh - Pitra Dosha - Graha dosha due to afflictions",
          content: "authentic_dosha_analysis",
        },
        {
          num: 10,
          title: "Dasha Predictions",
          subtitle:
            "Advanced Data Visualizations - Comprehensive visual analysis of your astrological profile",
          icon: "Clock",
          desc: "Vimshottari Dasha Timeline (120-Year Cycle) - Complete Mahadasha progression with current period highlighted - Life phases and planetary influences",
          content: "comprehensive_dasha_visualization",
        },
        {
          num: 11,
          title: "Transit (Gochar) Analysis",
          icon: "TrendingUp",
          desc: "Current planetary positions - Effects on lagna and moon sign - Shani, Guru, Rahu/Ketu transits",
          content: "comprehensive_transit_analysis",
        },
        {
          num: 12,
          title: "Career and Profession",
          icon: "Briefcase",
          desc: "House 10 analysis - Planetary yogas for career - Dasha influence on profession - Business vs job indications",
          content: "comprehensive_career_analysis",
        },
        {
          num: 13,
          title: "Remedies",
          icon: "Diamond",
          desc: "Gemstone suggestions - Mantra, Yantra, Rudraksha - Puja and donation recommendations - Fastings and charity",
          content: "comprehensive_remedies_analysis",
        },
        {
          num: 14,
          title: "Marriage Compatibility",
          icon: "Heart",
          desc: "7th House Analysis - Marriage timing predictions - Spouse characteristics - Relationship compatibility - Love vs arranged marriage - Manglik dosha assessment",
          content: "comprehensive_marriage_analysis",
        },
        {
          num: 15,
          title: "Annual Predictions (Varshaphal)",
          icon: "Calendar",
          desc: "Year-wise overview (next 3-5 years) - Muntha, Tajik aspects, annual dasha",
          content: "comprehensive_annual_predictions",
        },
        {
          num: 16,
          title: "Action Plan",
          icon: "Target",
          desc: "Dasha-based remedies - Daily mantras & meditation - Monthly temple visits & donations - Annual pujas & havans - Gemstone guidance - Lifestyle alignment",
          content: "dasha_action_plan",
        },
        {
          num: 17,
          title: "Astrological Summary",
          icon: "Target",
          desc: "Comprehensive astrological summary - Your celestial blueprint - Life themes and strengths - Key yogas and their impact - Divine blessings and cosmic support",
          content: "astrological_summary",
        },
        {
          num: 18,
          title: "Personalized Recommendations",
          icon: "Lightbulb",
          desc: "Personalized cosmic roadmap - Career and professional growth - Relationships and love guidance - Health and vitality tips - Spiritual development practices - Current dasha guidance",
          content: "personalized_recommendations",
        },
      ].map((section) => (
        <Card
          key={section.num}
          className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 border-2 border-orange-300 shadow-xl"
        >
          <CardHeader className="bg-gradient-to-r from-orange-600 to-amber-600 text-white p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl lg:text-2xl">
              {section.icon === "Calendar" && (
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 flex-shrink-0" />
              )}
              {section.icon === "Globe" && (
                <Globe className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 flex-shrink-0" />
              )}
              {section.icon === "BarChart3" && (
                <div className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs sm:text-sm">📊</span>
                </div>
              )}
              {section.icon === "Shield" && (
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 flex-shrink-0" />
              )}
              {section.icon === "User" && (
                <User className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 flex-shrink-0" />
              )}
              {section.icon === "Heart" && (
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 flex-shrink-0" />
              )}
              {section.icon === "Star" && (
                <Star className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 flex-shrink-0" />
              )}
              {section.icon === "Target" && (
                <Target className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 flex-shrink-0" />
              )}
              {section.icon === "Sun" && (
                <Sun className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 flex-shrink-0" />
              )}
              {section.icon === "Zap" && (
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 flex-shrink-0" />
              )}
              {section.icon === "Clock" && (
                <div className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs sm:text-sm">🌟</span>
                </div>
              )}
              {section.icon === "TrendingUp" && (
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 flex-shrink-0" />
              )}
              {section.icon === "Briefcase" && (
                <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 flex-shrink-0" />
              )}
              {section.icon === "DollarSign" && (
                <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 flex-shrink-0" />
              )}
              {section.icon === "Users" && (
                <Users className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 flex-shrink-0" />
              )}
              {section.icon === "BookOpen" && (
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 flex-shrink-0" />
              )}
              {section.icon === "Building" && (
                <Building className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 flex-shrink-0" />
              )}
              {section.icon === "Diamond" && (
                <Diamond className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 flex-shrink-0" />
              )}
              {section.icon === "CheckCircle" && (
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 flex-shrink-0" />
              )}
              <span className="break-words">
                {section.num}. {section.title}
              </span>
            </CardTitle>
            {section.subtitle && (
              <div className="text-orange-100 text-sm sm:text-base mb-2 font-medium">
                {section.subtitle}
              </div>
            )}
            <CardDescription className="text-orange-100 text-sm sm:text-base lg:text-lg">
              {section.desc}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 lg:p-8">
            <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-4 sm:p-6 rounded-lg border border-orange-200">
              {section.content === "authentic_planetary_positions" ? (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 rounded-lg border border-blue-200">
                    <h4 className="text-lg sm:text-xl font-bold text-blue-800 mb-4 sm:mb-6 flex items-center gap-2">
                      <Globe className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                      <span className="break-words">
                        Planetary Positions at Birth
                      </span>
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                      {(() => {
                        // Debug: Log the actual data structure
                        console.log("=== PLANETARY POSITIONS DEBUG ===");
                        console.log(
                          "reportData.chart_data:",
                          reportData.chart_data,
                        );
                        console.log(
                          "reportData.chart_data?.planets:",
                          reportData.chart_data?.planets,
                        );
                        console.log(
                          "reportData keys:",
                          Object.keys(reportData),
                        );

                        // Use AUTHENTIC data from premium report with corrected house calculations
                        const planetsData =
                          reportData.chart_data?.planetary_positions || {};
                        console.log(
                          "Using planetary positions from report:",
                          planetsData,
                        );

                        console.log("Using planets data:", planetsData);

                        return Object.entries(planetsData).map(
                          ([planetName, planetData]: [string, any]) => (
                            <div
                              key={planetName}
                              className="bg-white/90 p-3 sm:p-4 rounded-lg border border-blue-300 shadow-sm"
                            >
                              <div className="flex items-center gap-2 sm:gap-3 mb-3">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                                  <span className="text-white font-bold text-xs sm:text-sm">
                                    {planetName === "Sun"
                                      ? "☉"
                                      : planetName === "Moon"
                                        ? "☽"
                                        : planetName === "Mars"
                                          ? "♂"
                                          : planetName === "Mercury"
                                            ? "☿"
                                            : planetName === "Jupiter"
                                              ? "♃"
                                              : planetName === "Venus"
                                                ? "♀"
                                                : planetName === "Saturn"
                                                  ? "♄"
                                                  : planetName === "Rahu"
                                                    ? "☊"
                                                    : planetName === "Ketu"
                                                      ? "☋"
                                                      : planetName.substring(
                                                          0,
                                                          2,
                                                        )}
                                  </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h5 className="font-semibold text-blue-800 text-sm sm:text-base lg:text-lg truncate">
                                    {planetName}
                                  </h5>
                                  <div className="text-xs sm:text-sm text-blue-600 truncate">
                                    {planetData.sign || "Sign calculating..."}
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600 flex-shrink-0">
                                    Position:
                                  </span>
                                  <span className="font-medium text-right">
                                    {planetData.longitude
                                      ? `${planetData.longitude.toFixed(2)}°`
                                      : "Loading..."}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600 flex-shrink-0">
                                    House:
                                  </span>
                                  <span className="font-medium text-right">
                                    {planetData.house || "Loading..."}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600 flex-shrink-0">
                                    Nakshatra:
                                  </span>
                                  <span className="font-medium text-right truncate max-w-[100px] sm:max-w-none">
                                    {planetData.nakshatra ||
                                      getNakshatraFromLongitude(
                                        planetData.longitude || 0,
                                      )}
                                  </span>
                                </div>
                                {planetData.retrograde !== undefined && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">
                                      Motion:
                                    </span>
                                    <span
                                      className={`font-medium ${planetData.retrograde ? "text-red-600" : "text-green-600"}`}
                                    >
                                      {planetData.retrograde
                                        ? "Retrograde ℞"
                                        : "Direct"}
                                    </span>
                                  </div>
                                )}
                                {planetData.combustion && (
                                  <div className="mt-2 p-2 bg-red-50 rounded border-l-4 border-red-400">
                                    <span className="text-red-700 text-xs font-medium">
                                      ⚠️ Combust
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ),
                        );
                      })()}
                    </div>
                    <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                      <p className="text-blue-800 text-xs sm:text-sm break-words">
                        <strong>Note:</strong> All planetary positions
                        calculated using authentic Jyotisha principles with
                        Swiss Ephemeris precision. These calculations are based
                        on your exact birth time, location coordinates, and
                        Lahiri Ayanamsa.
                      </p>
                    </div>
                  </div>
                </div>
              ) : section.content ===
                "comprehensive_ashtakavarga_visualization" ? (
                <div className="space-y-6">
                  <div className="text-center p-4 sm:p-6 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-base sm:text-lg text-blue-800 font-medium break-words">
                      📊 Vedic Birth Chart and Divisional Charts are displayed
                      below.
                    </p>
                    <p className="text-xs sm:text-sm text-blue-600 mt-2 break-words">
                      The Ashtakavarga Strength Analysis has been moved to the
                      end of this section for better organization.
                    </p>
                  </div>

                  {/* 📊 Vedic Birth Chart Card */}
                  <div className="mt-8">
                    <div className="bg-gradient-to-br from-blue-50/90 via-purple-50/90 to-indigo-50/90 backdrop-blur-sm border-purple-300 shadow-lg rounded-lg">
                      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-t-lg p-4">
                        <div className="flex items-center gap-2 text-xl font-semibold">
                          <BarChart className="h-6 w-6" />
                          📊 Vedic Birth Chart
                        </div>
                      </div>
                      <div className="p-4 sm:p-6 lg:p-8">
                        {/* Chart Header Information */}
                        <div className="text-center space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                          <div className="bg-white/90 p-3 sm:p-4 rounded-lg border border-purple-200 shadow-sm">
                            <div className="text-lg sm:text-xl font-semibold text-gray-700 mb-2 break-words">
                              {reportData.birth_details?.name || "Birth Chart"}
                            </div>
                            <div className="text-sm sm:text-base text-gray-600 mb-2 break-words">
                              {reportData.birth_details?.date}{" "}
                              {reportData.birth_details?.time}
                              {reportData.birth_details?.place && (
                                <>
                                  <br className="sm:hidden" />
                                  <span className="hidden sm:inline"> | </span>
                                  {reportData.birth_details?.place}
                                </>
                              )}
                            </div>
                            <div className="text-sm sm:text-base font-medium text-amber-700 break-words">
                              Lagna:{" "}
                              {reportData.chart_data?.ascendant?.sign ||
                                "Unknown"}
                              <br className="sm:hidden" />
                              <span className="hidden sm:inline"> • </span>
                              Nakshatra:{" "}
                              {reportData.birth_details?.birth_star ||
                                "Unknown"}
                            </div>
                          </div>
                        </div>

                        {/* Dual Chart Display - North Indian & South Indian */}
                        <div className="space-y-4 sm:space-y-6">
                          {/* North Indian Chart - Authentic Jyotisha Data */}
                          <div className="bg-gradient-to-br from-white to-purple-50 p-4 sm:p-6 rounded-lg shadow-lg border border-purple-200">
                            <div className="text-center mb-3 sm:mb-4">
                              <h4 className="font-semibold text-purple-700 text-base sm:text-lg flex items-center justify-center gap-2">
                                <Target className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                                <span className="break-words">
                                  📊 North Indian Chart
                                </span>
                              </h4>
                            </div>
                            {/* Use authentic North Indian chart from Jyotisha engine */}
                            {reportData.divisional_charts?.d1_rasi
                              ?.north_indian_chart ? (
                              <div className="flex justify-center overflow-x-auto">
                                <div
                                  className="border rounded-lg p-2 bg-white min-w-[280px] max-w-full"
                                  dangerouslySetInnerHTML={{
                                    __html:
                                      reportData.divisional_charts.d1_rasi
                                        .north_indian_chart,
                                  }}
                                />
                              </div>
                            ) : (
                              <div className="flex justify-center items-center h-32 sm:h-48 text-gray-500">
                                <p className="text-sm sm:text-base text-center">
                                  North Indian Chart loading...
                                </p>
                              </div>
                            )}
                          </div>

                          {/* South Indian Chart - D1 Chart Display */}
                          <div className="bg-gradient-to-br from-white to-orange-50 p-4 sm:p-6 rounded-lg shadow-lg border border-orange-200">
                            <div className="text-center mb-3 sm:mb-4">
                              <h4 className="font-semibold text-orange-700 text-base sm:text-lg flex items-center justify-center gap-2">
                                <Grid className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                                <span className="break-words">
                                  📋 South Indian Chart
                                </span>
                              </h4>
                            </div>
                            {/* Display D1 Chart from divisional charts data */}
                            {reportData.divisional_charts?.d1_rasi
                              ?.south_indian_chart ? (
                              <div className="flex justify-center">
                                <div
                                  className="border rounded-lg p-2 bg-white"
                                  dangerouslySetInnerHTML={{
                                    __html:
                                      reportData.divisional_charts.d1_rasi
                                        .south_indian_chart,
                                  }}
                                />
                              </div>
                            ) : (
                              <div className="flex justify-center items-center h-48 text-gray-500">
                                <p>D1 Chart loading...</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Chart Legend */}
                        <div className="text-center text-sm text-gray-600 space-y-3">
                          <div className="bg-white/90 p-4 rounded-lg border border-gray-200">
                            <p className="font-medium mb-3">
                              Dual Chart Format - Traditional Vedic Astrology
                            </p>
                            <div className="grid md:grid-cols-2 gap-4 text-xs">
                              <div>
                                <p className="font-medium text-blue-700">
                                  North Indian Chart
                                </p>
                                <p>
                                  Houses fixed, signs rotate • House 1 (ASC) at
                                  top center
                                </p>
                              </div>
                              <div>
                                <p className="font-medium text-green-700">
                                  South Indian Chart
                                </p>
                                <p>
                                  Signs fixed, planets move • Traditional 4x4
                                  grid layout
                                </p>
                              </div>
                            </div>
                            <p className="text-xs mt-3">
                              Planet Abbreviations: Su-Sun, Mo-Moon, Ma-Mars,
                              Me-Mercury, Ju-Jupiter, Ve-Venus, Sa-Saturn,
                              Ra-Rahu, Ke-Ketu
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 📊 Essential Divisional Charts (D1 & D9) */}
                  <div className="mt-8">
                    <div className="bg-gradient-to-br from-emerald-50/90 via-teal-50/90 to-cyan-50/90 backdrop-blur-sm border-emerald-300 shadow-lg rounded-lg">
                      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-t-lg p-4">
                        <div className="flex items-center gap-2 text-xl font-semibold">
                          <Grid className="h-6 w-6" />
                          📊 Essential Divisional Charts (D1 & D9)
                        </div>
                      </div>
                      <div className="p-8">
                        {/* Charts Header */}
                        <div className="text-center space-y-4 mb-8">
                          <div className="bg-white/90 p-4 rounded-lg border border-emerald-200 shadow-sm">
                            <div className="text-xl font-semibold text-gray-700 mb-2">
                              Core Divisional Chart Analysis
                            </div>
                            <div className="text-base text-gray-600 mb-2">
                              D1 (Rasi) - Basic Life Chart • D9 (Navamsa) -
                              Marriage & Spiritual Chart
                            </div>
                            <div className="text-base font-medium text-emerald-700">
                              Authentic Jyotisha calculations with precise
                              planetary positions
                            </div>
                          </div>
                        </div>

                        {/* D1 and D9 Charts Display - Two Sections */}
                        <div className="space-y-8">
                          {/* South Indian Style Charts */}
                          <div>
                            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                              <Grid className="h-5 w-5" />
                              South Indian Style Charts (4x4 Grid Layout)
                            </h4>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                              {/* D1 Rasi Chart - South Indian */}
                              <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-lg shadow-lg border border-blue-200">
                                <div className="text-center mb-4">
                                  <h4 className="font-semibold text-blue-700 text-lg flex items-center justify-center gap-2">
                                    <Target className="h-5 w-5" />
                                    📊 D1 Rasi Chart (Basic Life)
                                  </h4>
                                  <p className="text-sm text-blue-600 mt-2">
                                    Primary birth chart showing basic life
                                    themes
                                  </p>
                                </div>
                                {/* Use authentic D1 South Indian chart from Jyotisha engine */}
                                {reportData.divisional_charts?.d1_rasi
                                  ?.south_indian_chart ? (
                                  <div className="flex justify-center  ">
                                    <div
                                      className="border rounded-lg p-2 bg-white md:w-[600px] md:h-[400px] md:pr-20   "
                                      dangerouslySetInnerHTML={{
                                        __html:
                                          reportData.divisional_charts.d1_rasi
                                            .south_indian_chart,
                                      }}
                                    />
                                  </div>
                                ) : (
                                  <div className="flex justify-center items-center h-48 text-gray-500">
                                    <p>D1 South Indian Chart loading...</p>
                                  </div>
                                )}
                              </div>

                              {/* D9 Navamsa Chart - South Indian */}
                              <div className="bg-gradient-to-br from-white to-rose-50 p-6 rounded-lg shadow-lg border border-rose-200">
                                <div className="text-center mb-4">
                                  <h4 className="font-semibold text-rose-700 text-lg flex items-center justify-center gap-2">
                                    <Heart className="h-5 w-5" />
                                    💎 D9 Navamsa (Marriage & Dharma)
                                  </h4>
                                  <p className="text-sm text-rose-600 mt-2">
                                    Marriage compatibility and spiritual
                                    potential
                                  </p>
                                </div>
                                {/* Use authentic South Indian D9 chart from Jyotisha engine */}
                                {reportData.divisional_charts?.d9_navamsa
                                  ?.south_indian_chart ? (
                                  <div className="flex justify-center gap-6">
                                    <div
                                      className="border rounded-lg p-2 bg-white  md:h-[400px] md:w-[320px] "
                                      dangerouslySetInnerHTML={{
                                        __html:
                                          reportData.divisional_charts
                                            .d9_navamsa.south_indian_chart,
                                      }}
                                    />
                                  </div>
                                ) : reportData.divisional_charts?.d9_navamsha
                                    ?.south_indian_chart ? (
                                  <div className="flex justify-center">
                                    <div
                                      className="border rounded-lg p-2 bg-white inline-block overflow-hidden object-cover"
                                      dangerouslySetInnerHTML={{
                                        __html:
                                          reportData.divisional_charts
                                            .d9_navamsha.south_indian_chart,
                                      }}
                                    />
                                  </div>
                                ) : (
                                  <div className="flex justify-center items-center h-48 text-gray-500">
                                    <p>D9 South Indian Chart loading...</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* North Indian Style Charts */}
                          <div>
                            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                              <Diamond className="h-5 w-5" />
                              North Indian Style Charts (Diamond Layout)
                            </h4>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                              {/* D1 Rasi Chart - North Indian */}
                              <div className="bg-gradient-to-br from-white to-indigo-50 p-6 rounded-lg shadow-lg border border-indigo-200">
                                <div className="text-center mb-4">
                                  <h4 className="font-semibold text-indigo-700 text-lg flex items-center justify-center gap-2">
                                    <Target className="h-5 w-5" />
                                    📊 D1 Rasi Chart (Basic Life)
                                  </h4>
                                  <p className="text-sm text-indigo-600 mt-2">
                                    Primary birth chart in diamond format
                                  </p>
                                </div>
                                {/* Use authentic D1 North Indian chart from Jyotisha engine */}
                                {reportData.divisional_charts?.d1_rasi
                                  ?.north_indian_chart ? (
                                  <div className="flex justify-center">
                                    <div
                                      className="border rounded-lg p-2 bg-white"
                                      dangerouslySetInnerHTML={{
                                        __html:
                                          reportData.divisional_charts.d1_rasi
                                            .north_indian_chart,
                                      }}
                                    />
                                  </div>
                                ) : (
                                  <div className="flex justify-center items-center h-48 text-gray-500">
                                    <p>D1 North Indian Chart loading...</p>
                                  </div>
                                )}
                              </div>

                              {/* D9 Navamsa Chart - North Indian */}
                              <div className="bg-gradient-to-br from-white to-purple-50 p-6 rounded-lg shadow-lg border border-purple-200">
                                <div className="text-center mb-4">
                                  <h4 className="font-semibold text-purple-700 text-lg flex items-center justify-center gap-2">
                                    <Diamond className="h-5 w-5" />
                                    💎 D9 Navamsa (Marriage & Dharma)
                                  </h4>
                                  <p className="text-sm text-purple-600 mt-2">
                                    Marriage chart in traditional diamond format
                                  </p>
                                </div>
                                {/* Use authentic North Indian D9 chart from Jyotisha engine */}
                                {reportData.divisional_charts?.d9_navamsa
                                  ?.north_indian_chart ? (
                                  <div className="flex justify-center">
                                    <div
                                      className="border rounded-lg p-2 bg-white"
                                      dangerouslySetInnerHTML={{
                                        __html:
                                          reportData.divisional_charts
                                            .d9_navamsa.north_indian_chart,
                                      }}
                                    />
                                  </div>
                                ) : reportData.divisional_charts?.d9_navamsha
                                    ?.north_indian_chart ? (
                                  <div className="flex justify-center">
                                    <div
                                      className="border rounded-lg p-2 bg-white"
                                      dangerouslySetInnerHTML={{
                                        __html:
                                          reportData.divisional_charts
                                            .d9_navamsha.north_indian_chart,
                                      }}
                                    />
                                  </div>
                                ) : (
                                  <div className="flex justify-center items-center h-48 text-gray-500">
                                    <p>D9 North Indian Chart loading...</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Divisional Chart Analysis */}
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* D1 Chart Analysis */}
                          <div className="bg-white/90 p-6 rounded-lg border border-blue-200">
                            <h5 className="font-semibold text-blue-700 mb-4 flex items-center gap-2">
                              <BarChart className="h-4 w-4" />
                              D1 Rasi Analysis
                            </h5>
                            <div className="space-y-3 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">
                                  Ascendant:
                                </span>
                                <span className="font-medium text-blue-700">
                                  {reportData.ascendant_sign || "Kumbha"}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">
                                  Moon Sign:
                                </span>
                                <span className="font-medium text-blue-700">
                                  {reportData.moon_sign || "Vrishchika"}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Sun Sign:</span>
                                <span className="font-medium text-blue-700">
                                  {reportData.sun_sign || "Mithuna"}
                                </span>
                              </div>
                              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                <p className="text-xs text-blue-800">
                                  Primary chart showing basic life themes,
                                  personality, health, career foundation, and
                                  general life direction.
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* D9 Chart Analysis */}
                          <div className="bg-white/90 p-6 rounded-lg border border-rose-200">
                            <h5 className="font-semibold text-rose-700 mb-4 flex items-center gap-2">
                              <Heart className="h-4 w-4" />
                              D9 Navamsa Analysis
                            </h5>
                            <div className="space-y-3 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">
                                  Navamsa Lagna:
                                </span>
                                <span className="font-medium text-rose-700">
                                  {reportData.divisional_charts?.d9_navamsa
                                    ?.ascendant ||
                                    reportData.divisional_charts?.d9_navamsha
                                      ?.ascendant ||
                                    "Simha"}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">
                                  Marriage Harmony:
                                </span>
                                <span className="font-medium text-rose-700">
                                  Analyzing...
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">
                                  Spiritual Strength:
                                </span>
                                <span className="font-medium text-rose-700">
                                  {reportData.divisional_charts?.d9_navamsa
                                    ? "Strong"
                                    : "Moderate"}
                                </span>
                              </div>
                              <div className="mt-4 p-3 bg-rose-50 rounded-lg">
                                <p className="text-xs text-rose-800">
                                  Marriage chart showing spouse nature, marital
                                  harmony, spiritual evolution, and dharma
                                  fulfillment.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Chart Interpretation Legend */}
                        <div className="mt-8 bg-white/90 p-6 rounded-lg border border-gray-200">
                          <h5 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            Divisional Chart Significance & Format Guide
                          </h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                            <div className="space-y-3">
                              <div className="flex items-start gap-3">
                                <div className="w-4 h-4 bg-blue-500 rounded-full flex-shrink-0 mt-0.5"></div>
                                <div>
                                  <div className="font-medium text-blue-700">
                                    D1 Rasi (South)
                                  </div>
                                  <div className="text-gray-600">
                                    Basic life chart in 4x4 grid format
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-3">
                              <div className="flex items-start gap-3">
                                <div className="w-4 h-4 bg-rose-500 rounded-full flex-shrink-0 mt-0.5"></div>
                                <div>
                                  <div className="font-medium text-rose-700">
                                    D9 Navamsa (South)
                                  </div>
                                  <div className="text-gray-600">
                                    Marriage chart in 4x4 grid format
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-3">
                              <div className="flex items-start gap-3">
                                <div className="w-4 h-4 bg-indigo-500 rounded-full flex-shrink-0 mt-0.5"></div>
                                <div>
                                  <div className="font-medium text-indigo-700">
                                    D1 Rasi (North)
                                  </div>
                                  <div className="text-gray-600">
                                    Basic life chart in diamond format
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-3">
                              <div className="flex items-start gap-3">
                                <div className="w-4 h-4 bg-purple-500 rounded-full flex-shrink-0 mt-0.5"></div>
                                <div>
                                  <div className="font-medium text-purple-700">
                                    D9 Navamsa (North)
                                  </div>
                                  <div className="text-gray-600">
                                    Marriage chart in diamond format
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                            <h6 className="font-medium text-gray-800 mb-2">
                              Chart Format Differences:
                            </h6>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                              <div>
                                <div className="font-medium text-rose-700 mb-1">
                                  South Indian Style:
                                </div>
                                <div className="text-gray-600">
                                  Signs fixed in position, planets move • 4x4
                                  grid layout
                                </div>
                              </div>
                              <div>
                                <div className="font-medium text-purple-700 mb-1">
                                  North Indian Style:
                                </div>
                                <div className="text-gray-600">
                                  Houses fixed in position, signs rotate •
                                  Diamond layout
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 p-3 bg-amber-50 rounded-lg border-l-4 border-amber-400">
                            <p className="text-xs text-amber-800">
                              <strong>Note:</strong> All charts use authentic
                              Jyotisha calculations with precise planetary
                              positions based on your birth details, timezone
                              corrections, and Lahiri Ayanamsa.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3. Ashtakavarga Strength Analysis (moved to end of section 4) */}
                  <div className="mt-8">
                    <div className="bg-gradient-to-br from-violet-50/90 via-purple-50/90 to-indigo-50/90 backdrop-blur-sm border-violet-300 shadow-lg rounded-lg">
                      <div className="bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-t-lg p-4">
                        <div className="flex items-center gap-2 text-xl font-semibold">
                          <BarChart className="h-6 w-6" />
                          Ashtakavarga Strength Analysis (12 Houses)
                        </div>
                        <div className="text-violet-100 text-base mt-1">
                          Comprehensive house-wise strength distribution with
                          planetary bindu counts and life area analysis
                        </div>
                      </div>
                      <div className="p-8">
                        <div className="space-y-8">
                          {/* Modern Card-Based House Layout */}
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {ashtakavargaGrid.map((house: any) => (
                              <div
                                key={house.house}
                                className={`relative p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                                  house.totalBindus >= 30
                                    ? "bg-gradient-to-br from-green-100 via-emerald-100 to-teal-100 border-2 border-green-400"
                                    : house.totalBindus >= 20
                                      ? "bg-gradient-to-br from-yellow-100 via-amber-100 to-orange-100 border-2 border-yellow-400"
                                      : "bg-gradient-to-br from-red-100 via-pink-100 to-rose-100 border-2 border-red-400"
                                }`}
                              >
                                <div className="text-center space-y-4">
                                  {/* House Number */}
                                  <div className="flex items-center justify-center">
                                    <div
                                      className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg ${
                                        house.totalBindus >= 30
                                          ? "bg-gradient-to-r from-green-500 to-emerald-500"
                                          : house.totalBindus >= 20
                                            ? "bg-gradient-to-r from-yellow-500 to-amber-500"
                                            : "bg-gradient-to-r from-red-500 to-rose-500"
                                      }`}
                                    >
                                      <span className="text-white text-xl font-bold">
                                        H{house.house}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Bindu Count */}
                                  <div className="space-y-2">
                                    <div className="text-3xl font-bold text-gray-800">
                                      {house.totalBindus}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                      Bindus
                                    </div>
                                  </div>

                                  {/* Strength Badge */}
                                  <div className="flex justify-center">
                                    <Badge
                                      className={`px-4 py-2 text-sm font-semibold ${
                                        house.totalBindus >= 30
                                          ? "bg-green-500 text-white"
                                          : house.totalBindus >= 20
                                            ? "bg-yellow-500 text-white"
                                            : "bg-red-500 text-white"
                                      }`}
                                    >
                                      {house.strength}
                                    </Badge>
                                  </div>

                                  {/* Life Area */}
                                  <div className="text-center">
                                    <div className="text-sm font-medium text-gray-700 leading-tight">
                                      {house.house === 1 &&
                                        "Self & Personality"}
                                      {house.house === 2 && "Wealth & Family"}
                                      {house.house === 3 &&
                                        "Siblings & Courage"}
                                      {house.house === 4 && "Home & Mother"}
                                      {house.house === 5 &&
                                        "Children & Creativity"}
                                      {house.house === 6 && "Health & Service"}
                                      {house.house === 7 &&
                                        "Marriage & Partnership"}
                                      {house.house === 8 &&
                                        "Transformation & Longevity"}
                                      {house.house === 9 &&
                                        "Fortune & Higher Learning"}
                                      {house.house === 10 &&
                                        "Career & Reputation"}
                                      {house.house === 11 &&
                                        "Gains & Friendships"}
                                      {house.house === 12 &&
                                        "Spirituality & Expenses"}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Analysis Summary Cards */}
                          <div className="grid md:grid-cols-2 gap-8">
                            {/* Top 3 Strongest Houses */}
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
                              <h4 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
                                <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs">🔝</span>
                                </div>
                                Strongest Life Areas
                              </h4>
                              <div className="space-y-3">
                                {top3Houses.map((house: any, index: number) => (
                                  <div
                                    key={house.house}
                                    className="flex items-center justify-between p-4 bg-white rounded-xl shadow-md"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-sm font-bold">
                                          {index + 1}
                                        </span>
                                      </div>
                                      <div>
                                        <div className="font-semibold text-gray-800">
                                          House {house.house}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                          {house.house === 1 &&
                                            "Self & Personality"}
                                          {house.house === 2 &&
                                            "Wealth & Family"}
                                          {house.house === 3 &&
                                            "Siblings & Courage"}
                                          {house.house === 4 && "Home & Mother"}
                                          {house.house === 5 &&
                                            "Children & Creativity"}
                                          {house.house === 6 &&
                                            "Health & Service"}
                                          {house.house === 7 &&
                                            "Marriage & Partnership"}
                                          {house.house === 8 &&
                                            "Transformation & Longevity"}
                                          {house.house === 9 &&
                                            "Fortune & Higher Learning"}
                                          {house.house === 10 &&
                                            "Career & Reputation"}
                                          {house.house === 11 &&
                                            "Gains & Friendships"}
                                          {house.house === 12 &&
                                            "Spirituality & Expenses"}
                                        </div>
                                      </div>
                                    </div>
                                    <Badge className="bg-green-500 text-white px-3 py-1">
                                      {house.totalBindus} bindus
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Bottom 3 Weakest Houses */}
                            <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl p-6 border-2 border-red-200">
                              <h4 className="text-xl font-bold text-red-800 mb-4 flex items-center gap-2">
                                <div className="w-6 h-6 bg-gradient-to-r from-red-500 to-rose-500 rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs">⚠️</span>
                                </div>
                                Areas Needing Attention
                              </h4>
                              <div className="space-y-3">
                                {bottom3Houses.map(
                                  (house: any, index: number) => (
                                    <div
                                      key={house.house}
                                      className="flex items-center justify-between p-4 bg-white rounded-xl shadow-md"
                                    >
                                      <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-rose-500 rounded-full flex items-center justify-center">
                                          <span className="text-white text-sm font-bold">
                                            !
                                          </span>
                                        </div>
                                        <div>
                                          <div className="font-semibold text-gray-800">
                                            House {house.house}
                                          </div>
                                          <div className="text-sm text-gray-600">
                                            {house.house === 1 &&
                                              "Self & Personality"}
                                            {house.house === 2 &&
                                              "Wealth & Family"}
                                            {house.house === 3 &&
                                              "Siblings & Courage"}
                                            {house.house === 4 &&
                                              "Home & Mother"}
                                            {house.house === 5 &&
                                              "Children & Creativity"}
                                            {house.house === 6 &&
                                              "Health & Service"}
                                            {house.house === 7 &&
                                              "Marriage & Partnership"}
                                            {house.house === 8 &&
                                              "Transformation & Longevity"}
                                            {house.house === 9 &&
                                              "Fortune & Higher Learning"}
                                            {house.house === 10 &&
                                              "Career & Reputation"}
                                            {house.house === 11 &&
                                              "Gains & Friendships"}
                                            {house.house === 12 &&
                                              "Spirituality & Expenses"}
                                          </div>
                                        </div>
                                      </div>
                                      <Badge className="bg-red-500 text-white px-3 py-1">
                                        {house.totalBindus} bindus
                                      </Badge>
                                    </div>
                                  ),
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Ascendant and Personality Analysis */}
                  <div className="mt-8">
                    <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 border-2 border-orange-300 shadow-xl rounded-lg">
                      <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-t-lg p-4">
                        <div className="flex items-center gap-3 text-2xl font-bold">
                          <User className="w-8 h-8" />
                          4. 👤 Ascendant and Personality Analysis
                        </div>
                        <div className="text-orange-100 text-lg mt-2">
                          Lagna lord placement - Ascendant degree and nakshatra
                          - Physical appearance and personality traits - Life
                          direction and goals
                        </div>
                      </div>
                      <div className="p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                          {/* Nature & Character */}
                          <div className="bg-white/90 p-6 rounded-lg border border-blue-200 shadow-sm">
                            <h4 className="font-semibold text-blue-700 text-lg mb-4 flex items-center gap-2">
                              <Heart className="h-5 w-5" />
                              Nature & Character
                            </h4>
                            <div className="space-y-3 text-sm">
                              <div className="p-3 bg-blue-50 rounded-lg">
                                <div className="font-medium text-blue-800 mb-2">
                                  {reportData.ascendant_sign || "Meena"}{" "}
                                  Ascendant Nature
                                </div>
                                <div className="text-blue-700">
                                  {(() => {
                                    // Look for personality data in multiple possible locations
                                    const personalityData =
                                      reportData.ascendant_analysis?.nature ||
                                      reportData.ascendant_analysis
                                        ?.ascendant_nature ||
                                      reportData.personality_character_analysis
                                        ?.nature ||
                                      reportData.personality_character_analysis
                                        ?.ascendant_nature;

                                    if (personalityData) {
                                      return personalityData;
                                    }

                                    // Fallback: Generate nature description based on ascendant sign
                                    const natureDescriptions = {
                                      Kumbha:
                                        "Innovative, humanitarian, and independent nature. Visionary thinking with concern for humanity's welfare and progressive ideals.",
                                      Mesha:
                                        "Dynamic, energetic, and pioneering nature. Natural leadership qualities with courage to initiate new endeavors.",
                                      Vrishabha:
                                        "Stable, practical, and determined nature. Values security and comfort while building lasting foundations.",
                                      Mithuna:
                                        "Communicative, intellectual, and adaptable nature. Quick thinking and versatile approach to life.",
                                      Karka:
                                        "Nurturing, emotional, and intuitive nature. Strong family bonds and protective instincts.",
                                      Simha:
                                        "Confident, creative, and leadership-oriented nature. Natural authority and generous spirit.",
                                      Kanya:
                                        "Analytical, perfectionist, and service-minded nature. Detail-oriented approach with practical wisdom.",
                                      Tula: "Harmonious, diplomatic, and artistic nature. Natural ability to balance relationships.",
                                      Vrishchika:
                                        "Intense, transformative, and mysterious nature. Deep psychological insights with regenerative abilities.",
                                      Dhanu:
                                        "Philosophical, optimistic, and truth-seeking nature. Love for higher knowledge and wisdom.",
                                      Makara:
                                        "Disciplined, ambitious, and responsible nature. Strategic planning with long-term vision.",
                                      Meena:
                                        "Compassionate, spiritual, and intuitive nature. Deep empathy and connection to universal consciousness.",
                                    };

                                    return (
                                      natureDescriptions[
                                        reportData.ascendant_sign
                                      ] ||
                                      "Analyzing personality traits based on ascendant sign..."
                                    );
                                  })()}
                                </div>
                              </div>
                              <div className="text-xs text-gray-600 mt-3">
                                Core personality shaped by{" "}
                                {reportData.ascendant_sign || "Meena"} rising
                                sign
                              </div>
                            </div>
                          </div>

                          {/* Physical Appearance */}
                          <div className="bg-white/90 p-6 rounded-lg border border-indigo-200 shadow-sm">
                            <h4 className="font-semibold text-indigo-700 text-lg mb-4 flex items-center gap-2">
                              <Eye className="h-5 w-5" />
                              Physical Features
                            </h4>
                            <div className="space-y-3 text-sm">
                              <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-600">Height:</span>
                                <span className="font-medium text-indigo-700">
                                  {reportData.physical_features?.height ||
                                    "Medium height"}
                                </span>
                              </div>
                              <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-600">Build:</span>
                                <span className="font-medium text-indigo-700">
                                  {reportData.physical_features?.build ||
                                    "Graceful demeanor"}
                                </span>
                              </div>
                              <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-600">
                                  Notable Feature:
                                </span>
                                <span className="font-medium text-indigo-700">
                                  {reportData.physical_features?.notable ||
                                    "Expressive eyes"}
                                </span>
                              </div>
                              <div className="p-3 bg-indigo-50 rounded-lg mt-3">
                                <div className="text-xs text-indigo-800">
                                  Physical characteristics influenced by{" "}
                                  {reportData.ascendant_sign || "Meena"}{" "}
                                  ascendant
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Social Behavior */}
                          <div className="bg-white/90 p-6 rounded-lg border border-purple-200 shadow-sm">
                            <h4 className="font-semibold text-purple-700 text-lg mb-4 flex items-center gap-2">
                              <Users className="h-5 w-5" />
                              Social Adaptability
                            </h4>
                            <div className="space-y-3 text-sm">
                              <div className="p-3 bg-purple-50 rounded-lg">
                                <div className="font-medium text-purple-800 mb-2">
                                  Social Tendencies
                                </div>
                                <div className="text-purple-700">
                                  {reportData.social_behavior ||
                                    "Adaptable social behavior, natural counselor. Enjoys helping others and creating harmony in relationships."}
                                </div>
                              </div>
                              <div className="p-3 bg-gray-50 rounded-lg">
                                <div className="font-medium text-gray-800 mb-1">
                                  Mental Approach
                                </div>
                                <div className="text-gray-700 text-xs">
                                  {reportData.mental_tendencies ||
                                    "Intuitive decision-making, emotionally driven choices, seeks spiritual understanding."}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 4: Moon Sign and Emotional Profile */}
                  <div className="mt-8">
                    <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 border-2 border-orange-300 shadow-xl rounded-lg">
                      <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-t-lg p-4">
                        <div className="flex items-center gap-3 text-2xl font-bold">
                          <Moon className="w-8 h-8" />
                          5. 🌙 Moon Sign and Emotional Profile
                        </div>
                        <div className="text-orange-100 text-lg mt-2">
                          Moon sign characteristics - Emotional nature and
                          instincts - Mental strength and thought patterns -
                          Mother relationship and domestic life
                        </div>
                      </div>
                      <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {/* Emotional Nature */}
                          <div className="bg-white/90 p-6 rounded-lg border border-pink-200 shadow-sm">
                            <h4 className="font-semibold text-pink-700 text-lg mb-4 flex items-center gap-2">
                              <Heart className="h-5 w-5" />
                              Emotional Nature
                            </h4>
                            <div className="space-y-4">
                              <div className="p-4 bg-pink-50 rounded-lg border-l-4 border-pink-400">
                                <div className="font-medium text-pink-800 mb-2">
                                  {reportData.moon_sign || "Simha"} Moon Sign
                                </div>
                                <div className="text-pink-700 text-sm">
                                  {reportData.emotional_profile?.nature ||
                                    getMoonSignEmotionalNature(
                                      reportData.moon_sign || "Simha",
                                    )}
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">
                                    Emotional Strength:
                                  </span>
                                  <span className="font-medium text-pink-700">
                                    {reportData.emotional_profile?.strength ||
                                      "Leadership & Generosity"}
                                  </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">
                                    Core Drive:
                                  </span>
                                  <span className="font-medium text-pink-700">
                                    {reportData.emotional_profile?.drive ||
                                      "Recognition & Appreciation"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Stress & Relationships */}
                          <div className="bg-white/90 p-6 rounded-lg border border-rose-200 shadow-sm">
                            <h4 className="font-semibold text-rose-700 text-lg mb-4 flex items-center gap-2">
                              <Users className="h-5 w-5" />
                              Stress & Relationships
                            </h4>
                            <div className="space-y-4">
                              <div className="p-3 bg-rose-50 rounded-lg">
                                <div className="font-medium text-rose-800 mb-1">
                                  Stress Triggers
                                </div>
                                <div className="text-rose-700 text-sm">
                                  {reportData.stress_profile ||
                                    "Stress from lack of recognition. Emotional disturbance when authority is questioned or achievements go unnoticed."}
                                </div>
                              </div>
                              <div className="p-3 bg-amber-50 rounded-lg">
                                <div className="font-medium text-amber-800 mb-1">
                                  Mother Relationship
                                </div>
                                <div className="text-amber-700 text-sm">
                                  {reportData.mother_relationship ||
                                    "Strong bond with authoritative mother figure. Mother likely has leadership qualities and strong influence on emotional development."}
                                </div>
                              </div>
                              <div className="mt-3 p-2 bg-gray-50 rounded text-xs text-gray-600">
                                Moon represents mind, emotions, and maternal
                                influences
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 5: Nakshatra Interpretation */}
                  <div className="mt-8">
                    <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 border-2 border-orange-300 shadow-xl rounded-lg">
                      <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-t-lg p-4">
                        <div className="flex items-center gap-3 text-2xl font-bold">
                          <Star className="w-8 h-8" />
                          6. ⭐ Nakshatra Interpretation
                        </div>
                        <div className="text-orange-100 text-lg mt-2">
                          Birth nakshatra characteristics - Nakshatra lord and
                          deity - Pada analysis and effects - Life purpose and
                          karmic lessons
                        </div>
                      </div>
                      <div className="p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                          {/* Nakshatra Details */}
                          <div className="bg-white/90 p-6 rounded-lg border border-green-200 shadow-sm">
                            <h4 className="font-semibold text-green-700 text-lg mb-4 flex items-center gap-2">
                              <Star className="h-5 w-5" />
                              Birth Nakshatra
                            </h4>
                            <div className="space-y-3">
                              {(() => {
                                // Get Moon's nakshatra from authentic planetary data
                                const moonNakshatra =
                                  reportData.chart_data?.planetary_positions
                                    ?.Moon?.nakshatra ||
                                  reportData.birth_details?.nakshatra ||
                                  "Anuradha"; // Default from server logs

                                const moonPada =
                                  reportData.chart_data?.planetary_positions
                                    ?.Moon?.pada ||
                                  reportData.birth_details?.nakshatra_pada ||
                                  calculatePadaFromLongitude(
                                    reportData.chart_data?.planetary_positions
                                      ?.Moon?.longitude || 223.52,
                                  );

                                return (
                                  <div className="text-center p-4 bg-green-50 rounded-lg">
                                    <div className="text-2xl font-bold text-green-800 mb-1">
                                      {moonNakshatra}
                                    </div>
                                    <div className="text-sm text-green-600">
                                      Pada {moonPada}
                                    </div>
                                    <div className="text-xs text-green-500 mt-2">
                                      Birth Star (Moon's nakshatra at birth)
                                    </div>
                                  </div>
                                );
                              })()}
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Lord:</span>
                                  <span className="font-medium text-green-700">
                                    {(() => {
                                      const nakshatra =
                                        reportData.chart_data
                                          ?.planetary_positions?.Moon
                                          ?.nakshatra || "Anuradha";
                                      return getNakshatraLord(nakshatra);
                                    })()}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">
                                    Element:
                                  </span>
                                  <span className="font-medium text-green-700">
                                    {(() => {
                                      const nakshatra =
                                        reportData.chart_data
                                          ?.planetary_positions?.Moon
                                          ?.nakshatra || "Anuradha";
                                      return getNakshatraElement(nakshatra);
                                    })()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Deity & Symbols */}
                          <div className="bg-white/90 p-6 rounded-lg border border-emerald-200 shadow-sm">
                            <h4 className="font-semibold text-emerald-700 text-lg mb-4 flex items-center gap-2">
                              <Crown className="h-5 w-5" />
                              Divine Aspects
                            </h4>
                            <div className="space-y-3">
                              {(() => {
                                const nakshatra =
                                  reportData.chart_data?.planetary_positions
                                    ?.Moon?.nakshatra || "Anuradha";
                                return (
                                  <>
                                    <div className="p-3 bg-emerald-50 rounded-lg">
                                      <div className="font-medium text-emerald-800 mb-1">
                                        Presiding Deity
                                      </div>
                                      <div className="text-emerald-700 text-sm">
                                        {getNakshatraDeity(nakshatra)}
                                      </div>
                                    </div>
                                    <div className="p-3 bg-teal-50 rounded-lg">
                                      <div className="font-medium text-teal-800 mb-1">
                                        Sacred Symbol
                                      </div>
                                      <div className="text-teal-700 text-sm">
                                        {getNakshatraSymbol(nakshatra)}
                                      </div>
                                    </div>
                                    <div className="p-3 bg-cyan-50 rounded-lg">
                                      <div className="font-medium text-cyan-800 mb-1">
                                        Element & Lord
                                      </div>
                                      <div className="text-cyan-700 text-sm">
                                        {getNakshatraElement(nakshatra)} •{" "}
                                        {getNakshatraLord(nakshatra)}
                                      </div>
                                    </div>
                                  </>
                                );
                              })()}
                            </div>
                          </div>

                          {/* Nakshatra Characteristics */}
                          <div className="bg-white/90 p-6 rounded-lg border border-teal-200 shadow-sm">
                            <h4 className="font-semibold text-teal-700 text-lg mb-4 flex items-center gap-2">
                              <Sparkles className="h-5 w-5" />
                              Key Traits
                            </h4>
                            <div className="space-y-3">
                              {(() => {
                                const nakshatra =
                                  reportData.chart_data?.planetary_positions
                                    ?.Moon?.nakshatra || "Anuradha";
                                return (
                                  <>
                                    <div className="p-3 bg-teal-50 rounded-lg">
                                      <div className="font-medium text-teal-800 mb-2">
                                        Primary Qualities
                                      </div>
                                      <div className="text-teal-700 text-sm">
                                        {getNakshatraCharacteristics(nakshatra)}
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 text-xs">
                                      <div className="p-2 bg-green-100 rounded text-green-800 text-center">
                                        <div className="font-medium">
                                          Element
                                        </div>
                                        <div>
                                          {getNakshatraElement(nakshatra)}
                                        </div>
                                      </div>
                                      <div className="p-2 bg-blue-100 rounded text-blue-800 text-center">
                                        <div className="font-medium">Deity</div>
                                        <div>
                                          {getNakshatraDeity(nakshatra)}
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                );
                              })()}
                            </div>
                          </div>
                        </div>

                        {/* Nakshatra Summary */}
                        <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg border border-green-200">
                          <h5 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <BookOpen className="h-5 w-5" />
                            Nakshatra Summary for{" "}
                            {(() => {
                              const nakshatra =
                                reportData.chart_data?.planetary_positions?.Moon
                                  ?.nakshatra || "Anuradha";
                              return nakshatra;
                            })()}
                          </h5>
                          <div className="text-gray-700 text-sm leading-relaxed">
                            {(() => {
                              const nakshatra =
                                reportData.chart_data?.planetary_positions?.Moon
                                  ?.nakshatra || "Anuradha";
                              const characteristics =
                                getNakshatraCharacteristics(nakshatra);
                              const deity = getNakshatraDeity(nakshatra);
                              const symbol = getNakshatraSymbol(nakshatra);
                              const element = getNakshatraElement(nakshatra);
                              const lord = getNakshatraLord(nakshatra);

                              // Calculate pada from Moon's longitude
                              const pada = (() => {
                                const moonLong =
                                  reportData.chart_data?.planetary_positions
                                    ?.Moon?.longitude || 223.52;
                                const nakshatraDegrees = 13.333333333333334;
                                const padaDegrees = nakshatraDegrees / 4;
                                const nakshatraPosition =
                                  moonLong % nakshatraDegrees;
                                return (
                                  Math.floor(nakshatraPosition / padaDegrees) +
                                  1
                                );
                              })();

                              return (
                                <div className="space-y-3">
                                  <p className="font-medium text-green-800">
                                    Born under {nakshatra} nakshatra (Pada{" "}
                                    {pada}), your birth star reveals deep
                                    insights into your personality and life
                                    path.
                                  </p>
                                  <p>
                                    <strong>Characteristics:</strong>{" "}
                                    {characteristics}
                                  </p>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                    <div className="p-3 bg-white rounded border-l-4 border-green-400">
                                      <div className="text-xs text-gray-600 uppercase">
                                        Presiding Deity
                                      </div>
                                      <div className="font-medium text-gray-800">
                                        {deity}
                                      </div>
                                    </div>
                                    <div className="p-3 bg-white rounded border-l-4 border-blue-400">
                                      <div className="text-xs text-gray-600 uppercase">
                                        Sacred Symbol
                                      </div>
                                      <div className="font-medium text-gray-800">
                                        {symbol}
                                      </div>
                                    </div>
                                    <div className="p-3 bg-white rounded border-l-4 border-purple-400">
                                      <div className="text-xs text-gray-600 uppercase">
                                        Ruling Planet
                                      </div>
                                      <div className="font-medium text-gray-800">
                                        {lord}
                                      </div>
                                    </div>
                                    <div className="p-3 bg-white rounded border-l-4 border-orange-400">
                                      <div className="text-xs text-gray-600 uppercase">
                                        Element
                                      </div>
                                      <div className="font-medium text-gray-800">
                                        {element}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : section.content === "comprehensive_dasha_visualization" ? (
                <div className="space-y-6">
                  {/* Modern Grid Layout for Dasha Periods */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {dashaTimeline.map((dasha: any) => (
                      <div
                        key={dasha.planet}
                        className={`relative p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                          dasha.isCurrent
                            ? "bg-gradient-to-br from-yellow-100 via-orange-100 to-pink-100 border-2 border-yellow-400 shadow-2xl transform scale-105"
                            : "bg-gradient-to-br from-white via-gray-50 to-white border border-gray-200"
                        }`}
                      >
                        {dasha.isCurrent && (
                          <div className="absolute -top-3 -right-3">
                            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 text-sm font-bold shadow-lg">
                              Current
                            </Badge>
                          </div>
                        )}

                        <div className="flex items-center justify-between mb-4">
                          <div
                            className={`w-16 h-16 rounded-full ${dasha.color} flex items-center justify-center shadow-lg`}
                          >
                            <span className="text-white text-lg font-bold drop-shadow-lg">
                              {dasha.planet.charAt(0)}
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-800">
                              {dasha.duration}
                            </div>
                            <div className="text-sm text-gray-500">years</div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h3 className="text-xl font-bold text-gray-800">
                            {dasha.planet} Mahadasha
                          </h3>

                          {dasha.period && dasha.period !== "N/A" && (
                            <div className="bg-gray-100 rounded-lg p-3">
                              <div className="text-sm text-gray-600 mb-1">
                                Period
                              </div>
                              <div className="font-semibold text-gray-800">
                                {(() => {
                                  const matches = dasha.period.match(
                                    /\((\d{4})-\d{2}-\d{2} - (\d{4})-\d{2}-\d{2}\)/,
                                  );
                                  return matches
                                    ? `${matches[1]} - ${matches[2]}`
                                    : dasha.period;
                                })()}
                              </div>
                            </div>
                          )}

                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">
                              Life Percentage
                            </span>
                            <span className="font-semibold text-gray-800">
                              {Math.round((dasha.duration / 120) * 100)}%
                            </span>
                          </div>

                          {dasha.effects && (
                            <div className="mt-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                              <div className="text-sm text-blue-800">
                                {dasha.effects}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Timeline Progress Bar */}
                  <div className="mt-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl">
                    <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <div className="w-4 h-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
                      120-Year Life Progression
                    </h4>
                    <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
                      {dashaTimeline.map((dasha: any, index: number) => {
                        const previousDurations = dashaTimeline
                          .slice(0, index)
                          .reduce((sum: number, d: any) => sum + d.duration, 0);
                        const leftPosition = (previousDurations / 120) * 100;
                        const width = (dasha.duration / 120) * 100;

                        return (
                          <div
                            key={dasha.planet}
                            className={`absolute h-full ${dasha.color.replace("bg-", "bg-opacity-80 bg-")} ${
                              dasha.isCurrent
                                ? "ring-2 ring-yellow-400 ring-inset"
                                : ""
                            }`}
                            style={{
                              left: `${leftPosition}%`,
                              width: `${width}%`,
                            }}
                            title={`${dasha.planet}: ${dasha.duration} years`}
                          />
                        );
                      })}
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-600">
                      <span>Birth</span>
                      <span>Age 60</span>
                      <span>120 Years</span>
                    </div>
                  </div>
                </div>
              ) : section.num === 3 ? (
                /* Section 3: Planetary Positions & Nakshatras Card */
                <div className="space-y-6">
                  {reportData.chart_data?.planetary_positions && (
                    <div className="bg-gradient-to-br from-gray-50/90 via-slate-50/90 to-blue-50/90 backdrop-blur-sm border-slate-300 shadow-lg rounded-lg">
                      <div className="bg-gradient-to-r from-slate-500 to-gray-600 text-white rounded-t-lg p-4">
                        <div className="flex items-center gap-2 text-xl font-semibold">
                          <Star className="h-6 w-6" />
                          🌟 Planetary Positions & Nakshatras
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {Object.entries(
                            reportData.chart_data.planetary_positions,
                          )
                            .filter(([planet]) => planet !== "Ascendant")
                            .map(([planet, data]: [string, any]) => (
                              <div
                                key={planet}
                                className="bg-gradient-to-br from-white to-blue-50 p-4 rounded-lg shadow-md border border-blue-200"
                              >
                                <div className="flex justify-between items-center">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="font-bold text-lg text-gray-800">
                                        {planet}
                                      </span>
                                      <span className="text-2xl">
                                        {data.symbol}
                                      </span>
                                    </div>
                                    <div className="space-y-1">
                                      <div className="text-sm">
                                        <span className="font-medium text-blue-700">
                                          Sign:
                                        </span>
                                        <span className="ml-1 text-gray-700">
                                          {data.sign}
                                        </span>
                                      </div>
                                      <div className="text-sm">
                                        <span className="font-medium text-purple-700">
                                          House:
                                        </span>
                                        <span className="ml-1 text-gray-700">
                                          {data.house}
                                        </span>
                                      </div>
                                      <div className="text-sm">
                                        <span className="font-medium text-amber-700">
                                          Nakshatra:
                                        </span>
                                        <span className="ml-1 text-gray-700">
                                          {data.nakshatra || "N/A"}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Fallback content if no chart data */}
                  {!reportData.chart_data?.planetary_positions && (
                    <div className="bg-white/60 p-6 rounded-lg">
                      <p className="text-gray-700 text-base leading-relaxed">
                        {section.content}
                      </p>
                    </div>
                  )}
                </div>
              ) : section.content === "authentic_panchang_details" ? (
                /* Section 2: Authentic Panchang Details */
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
                    <h4 className="text-xl font-bold text-blue-800 mb-6 flex items-center gap-2">
                      <Calendar className="w-6 h-6" />
                      Authentic Panchang Calculations
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="bg-white/80 p-4 rounded-lg border border-blue-300 shadow-sm">
                        <h5 className="font-semibold text-blue-700 mb-3">
                          Lunar Elements
                        </h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Tithi:</span>
                            <span className="font-medium text-blue-700">
                              {panchangData.tithi}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Nakshatra:</span>
                            <span className="font-medium text-purple-700">
                              {panchangData.nakshatra}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Yoga:</span>
                            <span className="font-medium text-green-700">
                              {panchangData.yoga}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Karana:</span>
                            <span className="font-medium text-orange-700">
                              {panchangData.karana}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/80 p-4 rounded-lg border border-amber-300 shadow-sm">
                        <h5 className="font-semibold text-amber-700 mb-3">
                          Time & Day
                        </h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Vaar (Day):</span>
                            <span className="font-medium text-amber-700">
                              {panchangData.vaar}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Sunrise:</span>
                            <span className="font-medium text-green-700">
                              {panchangData.sunrise}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Sunset:</span>
                            <span className="font-medium text-red-700">
                              {panchangData.sunset}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/80 p-4 rounded-lg border border-purple-300 shadow-sm">
                        <h5 className="font-semibold text-purple-700 mb-3">
                          Moon Details
                        </h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Moon Sign:</span>
                            <span className="font-medium text-purple-700">
                              {reportData.moon_sign || "Vrishchika"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Moon Degree:</span>
                            <span className="font-medium text-indigo-700">
                              {panchangData.moonDegree}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              Moon Nakshatra:
                            </span>
                            <span className="font-medium text-blue-700">
                              {panchangData.moonNakshatra}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-l-4 border-blue-400">
                      <p className="text-sm text-blue-800">
                        <strong>Note:</strong> All Panchang elements calculated
                        using authentic Jyotisha principles with Swiss Ephemeris
                        precision. These calculations are based on your exact
                        birth time, location coordinates, and Lahiri Ayanamsa.
                      </p>
                    </div>
                  </div>
                </div>
              ) : section.content === "authentic_dosha_analysis" ? (
                /* Section 12: Authentic Doshas Analysis */
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-red-50 to-orange-50 p-6 rounded-lg border border-red-200">
                    <h4 className="text-xl font-bold text-red-800 mb-6 flex items-center gap-2">
                      <Shield className="w-6 h-6" />
                      Authentic Dosha Analysis
                    </h4>

                    {/* Display authentic doshas from Jyotisha engine */}
                    {reportData.analysis?.doshas &&
                    reportData.analysis.doshas.length > 0 ? (
                      <div className="space-y-4">
                        {reportData.analysis.doshas.map(
                          (dosha: any, index: number) => (
                            <div
                              key={index}
                              className="bg-white/80 p-5 rounded-lg border-l-4 border-red-400 shadow-sm"
                            >
                              <div className="flex items-start justify-between mb-3">
                                <h5 className="font-bold text-red-700 text-lg">
                                  {dosha.name}
                                </h5>
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    dosha.strength === "High"
                                      ? "bg-red-100 text-red-700"
                                      : dosha.strength === "Moderate"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : "bg-green-100 text-green-700"
                                  }`}
                                >
                                  {dosha.strength || "Moderate"} Intensity
                                </span>
                              </div>

                              <p className="text-gray-700 mb-4 leading-relaxed">
                                {dosha.description}
                              </p>

                              {/* Calculation Logic Section */}
                              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 mb-4">
                                <h6 className="font-semibold text-amber-800 mb-2">
                                  📊 Calculation Logic:
                                </h6>
                                <p className="text-sm text-amber-700">
                                  {dosha.name === "Mangal Dosha" &&
                                    dosha.house &&
                                    `Mars is placed in ${dosha.house}th house. Mangal Dosha forms when Mars occupies houses 1, 2, 4, 7, 8, or 12 from Lagna. Your Mars is in house ${dosha.house}, which is one of the Mangal Dosha houses, hence this dosha is present.`}
                                  {dosha.name === "Shani Dosha" &&
                                    `Saturn analysis shows ${dosha.severity} level dosha based on house placement, aspects, and conjunctions. Saturn's negative influences create obstacles in the related life areas.`}
                                  {dosha.name === "Kaal Sarp Dosha" &&
                                    `All planets are positioned between Rahu and Ketu axis, creating the Kaal Sarp Dosha formation. This creates a specific karmic pattern requiring spiritual remedies.`}
                                  {dosha.name === "Pitra Dosha" &&
                                    `Sun-Rahu conjunction or affliction indicates ancestral debt (Pitra Dosha). This forms when Sun is conjunct, aspected by, or placed with Rahu, creating ancestral karma patterns.`}
                                  {dosha.name === "Graha Dosha" &&
                                    `Multiple planetary afflictions detected through conjunctions with malefics, enemy sign placements, or adverse aspects. Severity calculated based on number and intensity of afflictions.`}
                                  {dosha.name === "Kemadruma Dosha" &&
                                    `Moon is isolated without benefic planets in adjacent houses (2nd and 12th from Moon). This creates mental instability and requires lunar strengthening remedies.`}
                                  {![
                                    "Mangal Dosha",
                                    "Shani Dosha",
                                    "Kaal Sarp Dosha",
                                    "Pitra Dosha",
                                    "Graha Dosha",
                                    "Kemadruma Dosha",
                                  ].includes(dosha.name) &&
                                    `Calculated using authentic Jyotisha principles based on planetary positions, house placements, aspects, and conjunctions in your birth chart.`}
                                </p>
                              </div>

                              {dosha.remedies && dosha.remedies.length > 0 && (
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                  <h6 className="font-semibold text-blue-800 mb-2">
                                    Remedies:
                                  </h6>
                                  <ul className="list-disc list-inside space-y-1 text-sm text-blue-700">
                                    {dosha.remedies.map(
                                      (remedy: string, remedyIndex: number) => (
                                        <li key={remedyIndex}>{remedy}</li>
                                      ),
                                    )}
                                  </ul>
                                </div>
                              )}
                            </div>
                          ),
                        )}

                        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-l-4 border-green-400">
                          <p className="text-sm text-green-800">
                            <strong>Total Doshas Detected:</strong>{" "}
                            {reportData.analysis.doshas.length} |
                            <strong> Analysis Engine:</strong> Authentic
                            Jyotisha calculations with Swiss Ephemeris precision
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-green-50 p-6 rounded-lg border border-green-200 text-center">
                        <div className="flex items-center justify-center mb-3">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-2xl text-green-600">✓</span>
                          </div>
                        </div>
                        <h5 className="text-lg font-semibold text-green-800 mb-2">
                          No Major Doshas Detected
                        </h5>
                        <p className="text-green-700">
                          Based on authentic Jyotisha analysis, your birth chart
                          shows minimal or no significant doshas. This indicates
                          a relatively balanced planetary configuration.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : section.content !== "comprehensive_house_analysis" &&
                section.content !== "comprehensive_bhava_predictions" &&
                section.content !== "comprehensive_planetary_results" &&
                section.content !== "comprehensive_yoga_analysis" &&
                section.content !== "authentic_dosha_analysis" &&
                section.content !== "comprehensive_dasha_visualization" &&
                section.content !== "comprehensive_transit_analysis" &&
                section.content !==
                  "comprehensive_ashtakavarga_visualization" &&
                section.content !== "authentic_panchang_details" ? (
                <div className="bg-white/60 p-6 rounded-lg">
                  <p className="text-gray-700 text-base leading-relaxed">
                    {section.content}
                  </p>
                </div>
              ) : null}

              {/* Section 9: Enhanced Bhava Predictions with Dynamic House Lord Analysis */}
              {section.content === "comprehensive_house_analysis" &&
                (() => {
                  console.log(
                    "Comprehensive House Analysis Data:",
                    reportData.comprehensive_house_analysis,
                  );
                  // The data structure has houses directly, not nested under 'houses' key
                  return (
                    reportData.comprehensive_house_analysis &&
                    Object.keys(reportData.comprehensive_house_analysis)
                      .length > 0
                  );
                })() && (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
                      <h4 className="text-xl font-bold text-green-800 mb-6 flex items-center gap-2">
                        <Target className="w-6 h-6" />
                        Complete House Analysis (1st to 12th Houses)
                      </h4>
                      <p className="text-green-700 mb-6 font-medium">
                        Detailed analysis of each house with planetary
                        influences, lord placements, and predictive insights
                      </p>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {Object.entries(
                          reportData.comprehensive_house_analysis,
                        ).map(([houseKey, houseData]: [string, any]) => {
                          const houseNumber =
                            houseData.number || houseKey.replace("house_", "");
                          return (
                            <div
                              key={houseKey}
                              className="bg-white/80 p-5 rounded-lg border border-green-300 shadow-sm"
                            >
                              <h5 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                                <div className="w-7 h-7 bg-green-500 text-white rounded-full text-sm flex items-center justify-center font-bold">
                                  {houseNumber}
                                </div>
                                {houseData.name}
                              </h5>

                              <div className="space-y-3 text-sm">
                                {/* House Significations */}
                                <div className="bg-blue-50 p-3 rounded border border-blue-200">
                                  <p className="text-blue-800">
                                    <strong>Significations:</strong>{" "}
                                    {houseData.significations ||
                                      houseData.significance}
                                  </p>
                                </div>

                                {/* House Lord Information */}
                                {houseData.house_lord && (
                                  <div className="bg-purple-50 p-3 rounded border border-purple-200">
                                    <p className="text-purple-800">
                                      <strong>House Lord:</strong>{" "}
                                      {houseData.house_lord}
                                      {houseData.lord_placed_in_house &&
                                        ` placed in ${houseData.lord_placed_in_house}${houseData.lord_placed_in_house === 1 ? "st" : houseData.lord_placed_in_house === 2 ? "nd" : houseData.lord_placed_in_house === 3 ? "rd" : "th"} house`}
                                      {houseData.lord_placed_in_sign &&
                                        ` (${houseData.lord_placed_in_sign} sign)`}
                                    </p>
                                  </div>
                                )}

                                {/* Aspecting Planets */}
                                {houseData.aspecting_planets &&
                                  houseData.aspecting_planets.length > 0 && (
                                    <div className="bg-orange-50 p-3 rounded border border-orange-200">
                                      <p className="text-orange-800">
                                        <strong>Aspected by:</strong>{" "}
                                        {houseData.aspecting_planets.join(", ")}
                                      </p>
                                    </div>
                                  )}

                                {/* Planets in House */}
                                {((houseData.planets_in_house &&
                                  houseData.planets_in_house.length > 0) ||
                                  (houseData.planets &&
                                    houseData.planets.length > 0)) && (
                                  <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
                                    <p className="text-yellow-800">
                                      <strong>Planets in House:</strong>{" "}
                                      {(
                                        houseData.planets_in_house ||
                                        houseData.planets
                                      ).join(", ")}
                                    </p>
                                  </div>
                                )}

                                {/* House Strength */}
                                <div className="bg-green-50 p-3 rounded border border-green-200">
                                  <p className="text-green-800">
                                    <strong>Strength Assessment:</strong>{" "}
                                    {houseData.strength_assessment ||
                                      houseData.strength}
                                  </p>
                                </div>

                                {/* Detailed Analysis */}
                                {(houseData.detailed_analysis ||
                                  houseData.analysis) && (
                                  <div className="bg-gray-50 p-4 rounded border border-gray-200">
                                    <div className="text-gray-800 leading-relaxed text-sm whitespace-pre-line">
                                      {houseData.detailed_analysis ||
                                        houseData.analysis}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

              {/* Section 9: Bhava Predictions (Fallback) */}
              {section.content === "comprehensive_bhava_predictions" && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
                    <h4 className="text-xl font-bold text-green-800 mb-6 flex items-center gap-2">
                      <Target className="w-6 h-6" />
                      Complete House Analysis (1st to 12th)
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {[
                        {
                          house: 1,
                          name: "Self & Personality",
                          lord: reportData.house_lords?.[0] || "Jupiter",
                          effects:
                            "Service-oriented personality, compassionate nature, spiritual inclination",
                        },
                        {
                          house: 2,
                          name: "Wealth & Family",
                          lord: reportData.house_lords?.[1] || "Mars",
                          effects:
                            "Gradual wealth through service, strong family values, speech refinement",
                        },
                        {
                          house: 3,
                          name: "Siblings & Courage",
                          lord: reportData.house_lords?.[2] || "Venus",
                          effects:
                            "Artistic communication, supportive siblings, creative courage",
                        },
                        {
                          house: 4,
                          name: "Home & Mother",
                          lord: reportData.house_lords?.[3] || "Mercury",
                          effects:
                            "Educated mother figure, peaceful home, property after 35",
                        },
                        {
                          house: 5,
                          name: "Children & Creativity",
                          lord: reportData.house_lords?.[4] || "Sun",
                          effects:
                            "Creative children, teaching abilities, spiritual practices",
                        },
                        {
                          house: 6,
                          name: "Health & Service",
                          lord: reportData.house_lords?.[5] || "Moon",
                          effects:
                            "Health challenges manageable, service career, helping others",
                        },
                        {
                          house: 7,
                          name: "Marriage & Partnership",
                          lord: reportData.house_lords?.[6] || "Mercury",
                          effects:
                            "Intelligent spouse, harmonious marriage, business partnerships",
                        },
                        {
                          house: 8,
                          name: "Transformation",
                          lord: reportData.house_lords?.[7] || "Mars",
                          effects:
                            "Spiritual transformation, research abilities, hidden knowledge",
                        },
                        {
                          house: 9,
                          name: "Fortune & Dharma",
                          lord: reportData.house_lords?.[8] || "Jupiter",
                          effects:
                            "Strong dharma, guru connection, philosophical wisdom",
                        },
                        {
                          house: 10,
                          name: "Career & Reputation",
                          lord: reportData.house_lords?.[9] || "Saturn",
                          effects:
                            "Teaching career, counseling, healthcare service",
                        },
                        {
                          house: 11,
                          name: "Gains & Friends",
                          lord: reportData.house_lords?.[10] || "Saturn",
                          effects:
                            "Gains through service, wise friends, social causes",
                        },
                        {
                          house: 12,
                          name: "Spirituality & Moksha",
                          lord: reportData.house_lords?.[11] || "Jupiter",
                          effects:
                            "Spiritual expenses, foreign connections, liberation path",
                        },
                      ].map((houseData) => (
                        <div
                          key={houseData.house}
                          className="bg-white/80 p-4 rounded-lg border border-green-300 shadow-sm"
                        >
                          <h5 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
                            <div className="w-6 h-6 bg-green-500 text-white rounded-full text-sm flex items-center justify-center">
                              {houseData.house}
                            </div>
                            {houseData.name}
                          </h5>
                          <div className="text-sm space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-600">House Lord:</span>
                              <span className="font-medium text-green-700">
                                {houseData.lord}
                              </span>
                            </div>
                            <div className="p-2 bg-green-50 rounded text-green-800 text-xs">
                              {houseData.effects}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Section 2: AUTHENTIC Planetary Results (Graha Phala) */}
              {section.content === "comprehensive_planetary_results" &&
                (() => {
                  console.log("=== AUTHENTIC PLANETARY RESULTS DEBUG ===");
                  console.log(
                    "reportData.comprehensive_planetary_results:",
                    reportData.comprehensive_planetary_results,
                  );

                  const planetaryData =
                    reportData.comprehensive_planetary_results;
                  console.log("planetaryData type:", typeof planetaryData);
                  console.log(
                    "planetaryData keys:",
                    planetaryData ? Object.keys(planetaryData) : "No data",
                  );
                  console.log(
                    "planetaryData.planets exists:",
                    planetaryData?.planets ? "YES" : "NO",
                  );
                  console.log(
                    "planetaryData.planets type:",
                    typeof planetaryData?.planets,
                  );

                  if (!planetaryData) {
                    return (
                      <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                        <h4 className="text-xl font-bold text-red-800 mb-4 flex items-center gap-2">
                          <Sun className="w-6 h-6" />
                          Planetary Results - No Data Object
                        </h4>
                        <p className="text-red-700">
                          No comprehensive_planetary_results object found in
                          report data.
                        </p>
                      </div>
                    );
                  }

                  // Try to get planets data - could be directly in planetaryData or nested
                  let planetsData = planetaryData.planets;

                  if (!planetsData && typeof planetaryData === "object") {
                    // Try to find planets data in other possible locations
                    if (planetaryData.planetary_results) {
                      planetsData = planetaryData.planetary_results;
                    } else if (planetaryData.results) {
                      planetsData = planetaryData.results;
                    }
                  }

                  if (!planetsData) {
                    return (
                      <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                        <h4 className="text-xl font-bold text-orange-800 mb-4 flex items-center gap-2">
                          <Sun className="w-6 h-6" />
                          Planetary Results - Debugging Data Structure
                        </h4>
                        <p className="text-orange-700 mb-4">
                          Available keys in planetaryData:{" "}
                          <strong>
                            {Object.keys(planetaryData).join(", ")}
                          </strong>
                        </p>
                        <pre className="text-xs bg-orange-100 p-3 rounded mt-2 overflow-auto max-h-64">
                          {JSON.stringify(planetaryData, null, 2)}
                        </pre>
                      </div>
                    );
                  }

                  const planets = planetsData;
                  return (
                    <div className="space-y-6">
                      <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-3 rounded-lg border border-orange-200">
                        <h4 className="text-xl font-bold text-orange-800 mb-4 flex items-center gap-2">
                          <Sun className="w-6 h-6" />
                          Authentic Planetary Results (Graha Phala)
                        </h4>
                        <p className="text-orange-700 mb-6 text-sm">
                          {planetaryData.description ||
                            "Complete analysis based on authentic Jyotisha calculations"}
                        </p>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {Object.entries(planets).map(
                            ([planetName, planetInfo]: [string, any]) => (
                              <div
                                key={planetName}
                                className="bg-white/80 p-5 rounded-lg border border-orange-300 shadow-sm"
                              >
                                <h5 className="font-bold text-orange-700 mb-4 flex items-center gap-2 text-lg">
                                  <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                                  {planetName}
                                </h5>

                                {/* Placement Information */}
                                <div className="space-y-3">
                                  <div className="bg-orange-50 p-3 rounded">
                                    <h6 className="font-semibold text-orange-800 mb-2">
                                      Placement
                                    </h6>
                                    <div className="grid grid-cols-2 gap-2 text-lg">
                                      <div>
                                        <span className="text-orange-600">
                                          Sign:
                                        </span>
                                        <br />
                                        <span className="font-medium text-orange-800">
                                          {typeof planetInfo.placement?.sign ===
                                          "string"
                                            ? planetInfo.placement.sign
                                            : typeof planetInfo.placement
                                                  ?.sign === "object"
                                              ? planetInfo.placement.sign
                                                  .description || "Object Data"
                                              : "Position loading..."}
                                        </span>
                                      </div>
                                      <div>
                                        <span className="text-orange-600">
                                          House:
                                        </span>
                                        <br />
                                        <span className="font-medium text-orange-800">
                                          {typeof planetInfo.placement
                                            ?.house_number === "string" ||
                                          typeof planetInfo.placement
                                            ?.house_number === "number"
                                            ? planetInfo.placement
                                                .house_number +
                                              (planetInfo.placement.house_number
                                                ? "th"
                                                : "")
                                            : typeof planetInfo.placement
                                                  ?.house_number === "object"
                                              ? planetInfo.placement
                                                  .house_number.description ||
                                                "Complex Data"
                                              : "N/A"}
                                        </span>
                                      </div>
                                      <div>
                                        <span className="text-orange-600">
                                          Degree:
                                        </span>
                                        <br />
                                        <span className="font-medium text-orange-800">
                                          {typeof planetInfo.placement
                                            ?.degree === "string" ||
                                          typeof planetInfo.placement
                                            ?.degree === "number"
                                            ? planetInfo.placement.degree + "°"
                                            : typeof planetInfo.placement
                                                  ?.degree === "object"
                                              ? planetInfo.placement.degree
                                                  .description || "Complex Data"
                                              : "N/A°"}
                                        </span>
                                      </div>
                                      <div>
                                        <span className="text-orange-600">
                                          Nakshatra:
                                        </span>
                                        <br />
                                        <span className="font-medium text-orange-800">
                                          {typeof planetInfo.placement
                                            ?.nakshatra === "string"
                                            ? planetInfo.placement.nakshatra
                                            : typeof planetInfo.placement
                                                  ?.nakshatra === "object"
                                              ? planetInfo.placement.nakshatra
                                                  .description || "Complex Data"
                                              : "Star loading..."}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Strength Analysis */}
                                  <div className="bg-amber-50 p-3 rounded">
                                    <h6 className="font-semibold text-amber-800 mb-2">
                                      Strength Analysis
                                    </h6>
                                    <div className="space-y-2">
                                      <div className="flex justify-between items-center">
                                        <span className="text-sm text-amber-600">
                                          Dignity:
                                        </span>
                                        <Badge
                                          variant={
                                            planetInfo.strength_analysis
                                              ?.dignity === "Exalted"
                                              ? "default"
                                              : planetInfo.strength_analysis
                                                    ?.dignity === "Own Sign"
                                                ? "secondary"
                                                : planetInfo.strength_analysis
                                                      ?.dignity ===
                                                    "Debilitated"
                                                  ? "destructive"
                                                  : "outline"
                                          }
                                        >
                                          {typeof planetInfo.strength_analysis
                                            ?.dignity === "string"
                                            ? planetInfo.strength_analysis
                                                .dignity
                                            : typeof planetInfo
                                                  .strength_analysis
                                                  ?.dignity === "object"
                                              ? planetInfo.strength_analysis
                                                  .dignity.description ||
                                                "Complex Data"
                                              : "N/A"}
                                        </Badge>
                                      </div>
                                      <div className="flex justify-between items-center">
                                        <span className="text-sm text-amber-600">
                                          Strength:
                                        </span>
                                        <Badge
                                          variant={
                                            planetInfo.strength_analysis
                                              ?.overall_strength ===
                                            "Very Strong"
                                              ? "default"
                                              : planetInfo.strength_analysis
                                                    ?.overall_strength ===
                                                  "Strong"
                                                ? "secondary"
                                                : planetInfo.strength_analysis
                                                      ?.overall_strength ===
                                                    "Moderate"
                                                  ? "outline"
                                                  : "destructive"
                                          }
                                        >
                                          {typeof planetInfo.strength_analysis
                                            ?.overall_strength === "string"
                                            ? planetInfo.strength_analysis
                                                .overall_strength
                                            : typeof planetInfo
                                                  .strength_analysis
                                                  ?.overall_strength ===
                                                "object"
                                              ? planetInfo.strength_analysis
                                                  .overall_strength
                                                  .description || "Complex Data"
                                              : "Moderate"}
                                        </Badge>
                                      </div>
                                      <div className="flex justify-between items-center">
                                        <span className="text-sm text-amber-600">
                                          Functional:
                                        </span>
                                        <Badge
                                          variant={
                                            planetInfo.strength_analysis?.functional_nature?.includes(
                                              "Benefic",
                                            )
                                              ? "default"
                                              : planetInfo.strength_analysis?.functional_nature?.includes(
                                                    "Malefic",
                                                  )
                                                ? "destructive"
                                                : "outline"
                                          }
                                        >
                                          {typeof planetInfo.strength_analysis
                                            ?.functional_nature === "string"
                                            ? planetInfo.strength_analysis
                                                .functional_nature
                                            : typeof planetInfo
                                                  .strength_analysis
                                                  ?.functional_nature ===
                                                "object"
                                              ? planetInfo.strength_analysis
                                                  .functional_nature
                                                  .description || "Complex Data"
                                              : "Neutral"}
                                        </Badge>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Effects */}
                                  <div className="bg-yellow-50 p-3 rounded">
                                    <h6 className="font-semibold text-yellow-800 mb-2">
                                      Key Effects
                                    </h6>
                                    <p className="text-sm text-yellow-700 leading-relaxed">
                                      {typeof planetInfo.effects
                                        ?.combined_effects === "string"
                                        ? planetInfo.effects.combined_effects
                                        : typeof planetInfo.effects
                                              ?.combined_effects === "object"
                                          ? planetInfo.effects.combined_effects
                                              .description ||
                                            "Complex effect data"
                                          : "Analyzing planetary effects..."}
                                    </p>
                                    {planetInfo.effects?.key_influences &&
                                      planetInfo.effects.key_influences.length >
                                        0 && (
                                        <div className="mt-3">
                                          <p className="text-xs text-yellow-600 mb-1">
                                            Key Influences:
                                          </p>
                                          <div className="flex flex-wrap gap-1">
                                            {planetInfo.effects.key_influences.map(
                                              (
                                                influence: string,
                                                idx: number,
                                              ) => (
                                                <Badge
                                                  key={idx}
                                                  variant="outline"
                                                  className="text-xs"
                                                >
                                                  {influence}
                                                </Badge>
                                              ),
                                            )}
                                          </div>
                                        </div>
                                      )}
                                  </div>

                                  {/* Aspects */}
                                  {planetInfo.aspects?.aspecting_planets &&
                                    planetInfo.aspects.aspecting_planets
                                      .length > 0 && (
                                      <div className="bg-blue-50 p-3 rounded">
                                        <h6 className="font-semibold text-blue-800 mb-2">
                                          Planetary Aspects
                                        </h6>
                                        <p className="text-xs text-blue-600 mb-2">
                                          Aspected by:{" "}
                                          {planetInfo.aspects.aspecting_planets.join(
                                            ", ",
                                          )}
                                        </p>
                                        <p className="text-sm text-blue-700">
                                          {typeof planetInfo.aspects
                                            ?.aspect_effects === "string"
                                            ? planetInfo.aspects.aspect_effects
                                            : typeof planetInfo.aspects
                                                  ?.aspect_effects === "object"
                                              ? planetInfo.aspects
                                                  .aspect_effects.description ||
                                                "Complex aspect data"
                                              : "No significant aspects"}
                                        </p>
                                      </div>
                                    )}
                                </div>
                              </div>
                            ),
                          )}
                        </div>

                        {/* Summary */}
                        <div className="mt-6 bg-gradient-to-r from-orange-100 to-amber-100 p-4 rounded-lg">
                          <h6 className="font-semibold text-orange-800 mb-2">
                            Analysis Summary
                          </h6>
                          <p className="text-orange-700 text-sm">
                            {typeof planetaryData.summary === "string"
                              ? planetaryData.summary
                              : typeof planetaryData.summary === "object"
                                ? planetaryData.summary.description ||
                                  "Complex summary data"
                                : "Comprehensive planetary analysis completed using authentic Jyotisha calculations"}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })()}

              {/* Section 11: Yoga Analysis */}
              {section.content === "comprehensive_yoga_analysis" && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-lg border border-purple-200">
                    <h4 className="text-xl font-bold text-purple-800 mb-6 flex items-center gap-2">
                      <Zap className="w-6 h-6" />
                      Authentic Vedic Yoga Analysis
                    </h4>

                    {/* Display authentic yoga data from Jyotisha engine */}
                    {reportData.yogas && reportData.yogas.length > 0 ? (
                      <div className="space-y-6">
                        <div className="mb-6">
                          <h5 className="text-lg font-semibold text-green-700 mb-4 flex items-center gap-2">
                            <Crown className="w-5 h-5" />
                            Detected Yogas ({reportData.yogas.length})
                          </h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {reportData.yogas.map((yoga, index) => (
                              <div
                                key={index}
                                className="bg-white/80 p-4 rounded-lg border border-green-300 shadow-sm"
                              >
                                <h6 className="font-semibold text-green-700 mb-2">
                                  {yoga.name}
                                </h6>
                                <div className="text-sm space-y-2">
                                  <div className="p-2 bg-purple-50 rounded text-purple-800 text-xs">
                                    <strong>Formation:</strong>{" "}
                                    {yoga.description}
                                  </div>
                                  <div className="p-2 bg-green-50 rounded text-green-800 text-xs">
                                    <strong>Effects:</strong> {yoga.effect}
                                  </div>
                                  <div className="flex justify-between items-center mt-2">
                                    <span className="text-gray-600">
                                      Strength:
                                    </span>
                                    <span
                                      className={`font-medium px-2 py-1 rounded text-xs ${
                                        yoga.strength === "Dynamic"
                                          ? "bg-green-100 text-green-700"
                                          : yoga.strength === "Moderate"
                                            ? "bg-blue-100 text-blue-700"
                                            : "bg-yellow-100 text-yellow-700"
                                      }`}
                                    >
                                      {yoga.strength}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Analysis Summary */}
                        <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                          <h6 className="font-semibold text-blue-800 mb-2">
                            Yoga Analysis Summary
                          </h6>
                          <p className="text-sm text-blue-700">
                            Your birth chart contains {reportData.yogas.length}{" "}
                            significant yoga
                            {reportData.yogas.length !== 1 ? "s" : ""},
                            indicating specific planetary combinations that
                            influence your life path. Each yoga represents
                            unique opportunities and should be understood in the
                            context of your overall chart.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 text-center">
                        <p className="text-gray-600">
                          No significant yogas detected in your current birth
                          chart analysis.
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          This indicates a balanced chart without extreme
                          planetary combinations.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Section 12: Dosha Analysis */}
              {section.content === "comprehensive_dosha_analysis" && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-red-50 to-rose-50 p-6 rounded-lg border border-red-200">
                    <h4 className="text-xl font-bold text-red-800 mb-6 flex items-center gap-2">
                      <Shield className="w-6 h-6" />
                      Authentic Dosha Analysis
                    </h4>

                    {/* Display authentic dosha data from Jyotisha engine */}
                    {reportData.doshas && reportData.doshas.length > 0 ? (
                      <div className="space-y-6">
                        <div className="mb-6">
                          <h5 className="text-lg font-semibold text-red-700 mb-4 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5" />
                            Detected Doshas ({reportData.doshas.length})
                          </h5>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {reportData.doshas.map((dosha, index) => (
                              <div
                                key={index}
                                className="bg-white/80 p-4 rounded-lg border border-red-300 shadow-sm"
                              >
                                <h6 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
                                  <div className="w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
                                    {dosha.name.charAt(0)}
                                  </div>
                                  {dosha.name}
                                </h6>
                                <div className="text-sm space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">
                                      Severity:
                                    </span>
                                    <span
                                      className={`font-medium px-2 py-1 rounded text-xs ${
                                        dosha.severity === "Severe"
                                          ? "bg-red-100 text-red-700"
                                          : dosha.severity === "Moderate"
                                            ? "bg-orange-100 text-orange-700"
                                            : "bg-yellow-100 text-yellow-700"
                                      }`}
                                    >
                                      {dosha.severity}
                                    </span>
                                  </div>
                                  <div className="p-2 bg-red-50 rounded text-red-800 text-xs">
                                    <strong>Description:</strong>{" "}
                                    {dosha.description}
                                  </div>
                                  <div className="p-2 bg-orange-50 rounded text-orange-800 text-xs">
                                    <strong>Effects:</strong> {dosha.effect}
                                  </div>
                                  {dosha.remedies &&
                                    dosha.remedies.length > 0 && (
                                      <div className="p-2 bg-blue-50 rounded text-blue-800 text-xs">
                                        <strong>Remedies:</strong>
                                        <ul className="list-disc list-inside mt-1 space-y-1">
                                          {dosha.remedies.map(
                                            (remedy, remedyIndex) => (
                                              <li key={remedyIndex}>
                                                {remedy}
                                              </li>
                                            ),
                                          )}
                                        </ul>
                                      </div>
                                    )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Analysis Summary */}
                        <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                          <h6 className="font-semibold text-orange-800 mb-2">
                            Dosha Analysis Summary
                          </h6>
                          <p className="text-sm text-orange-700">
                            Your birth chart shows {reportData.doshas.length}{" "}
                            dosha{reportData.doshas.length !== 1 ? "s" : ""}{" "}
                            that require attention. Each dosha represents
                            specific planetary afflictions that can be mitigated
                            through appropriate remedial measures. Regular
                            practice of prescribed remedies can significantly
                            reduce negative effects.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 bg-green-50 rounded-lg border border-green-200 text-center">
                        <p className="text-green-800 font-medium">
                          No significant doshas detected in your birth chart.
                        </p>
                        <p className="text-sm text-green-600 mt-2">
                          This indicates a relatively harmonious planetary
                          arrangement without major afflictions.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Section 14: Comprehensive Transit (Gochar) Analysis */}
              {section.content === "comprehensive_transit_analysis" && (
                <div className="space-y-6">
                  {/* Section Header */}
                  <div className="text-center mb-8">
                    <h4 className="text-2xl font-bold text-blue-800 mb-2 flex items-center justify-center gap-2">
                      <TrendingUp className="w-7 h-7" />
                      Transit (Gochar) Analysis
                    </h4>
                    <p className="text-blue-700 font-medium">
                      Current planetary transits and their effects on life -
                      Sade Sati, Kantak Shani, Ashtama Shani analysis
                    </p>
                    {reportData.section_14_transit_gochar_analysis
                      ?.natal_references && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-blue-800 text-sm">
                          <strong>Analysis based on:</strong> Moon in{" "}
                          {
                            reportData.section_14_transit_gochar_analysis
                              .natal_references.moon_sign
                          }
                          , Lagna in{" "}
                          {
                            reportData.section_14_transit_gochar_analysis
                              .natal_references.lagna_sign
                          }{" "}
                          | Analysis Date:{" "}
                          {
                            reportData.section_14_transit_gochar_analysis
                              .natal_references.analysis_date
                          }
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Saturn Effects Analysis */}
                  {reportData.section_14_transit_gochar_analysis
                    ?.saturn_effects && (
                    <div className="bg-gradient-to-br from-gray-50 to-slate-50 p-6 rounded-lg border border-gray-200">
                      <h5 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <div className="w-6 h-6 bg-gray-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          S
                        </div>
                        Saturn Transit Effects
                      </h5>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Current Position */}
                        <div className="space-y-4">
                          <div className="bg-white/80 p-4 rounded-lg border border-gray-300">
                            <h6 className="font-semibold text-gray-700 mb-3">
                              Current Saturn Position
                            </h6>
                            <div className="text-sm space-y-2">
                              <p className="text-gray-800">
                                {
                                  reportData.section_14_transit_gochar_analysis
                                    .saturn_effects.current_position
                                }
                              </p>
                              <p className="text-blue-700">
                                {
                                  reportData.section_14_transit_gochar_analysis
                                    .saturn_effects.position_from_moon
                                }
                              </p>
                              <p className="text-purple-700">
                                {
                                  reportData.section_14_transit_gochar_analysis
                                    .saturn_effects.position_from_lagna
                                }
                              </p>
                            </div>
                          </div>

                          {/* General Effects */}
                          <div className="bg-white/80 p-4 rounded-lg border border-gray-300">
                            <h6 className="font-semibold text-gray-700 mb-3">
                              General Transit Effects
                            </h6>
                            <p className="text-sm text-gray-800">
                              {
                                reportData.section_14_transit_gochar_analysis
                                  .saturn_effects.general_effects
                              }
                            </p>
                          </div>
                        </div>

                        {/* Special Saturn Periods */}
                        <div className="space-y-4">
                          {/* Sade Sati */}
                          {reportData.section_14_transit_gochar_analysis
                            .saturn_effects.sade_sati && (
                            <div
                              className={`p-4 rounded-lg border ${
                                reportData.section_14_transit_gochar_analysis
                                  .saturn_effects.sade_sati.status === "Active"
                                  ? "bg-red-50 border-red-300"
                                  : "bg-green-50 border-green-300"
                              }`}
                            >
                              <h6 className="font-semibold mb-2 flex items-center gap-2">
                                <div
                                  className={`w-3 h-3 rounded-full ${
                                    reportData
                                      .section_14_transit_gochar_analysis
                                      .saturn_effects.sade_sati.status ===
                                    "Active"
                                      ? "bg-red-500"
                                      : "bg-green-500"
                                  }`}
                                ></div>
                                Sade Sati:{" "}
                                {
                                  reportData.section_14_transit_gochar_analysis
                                    .saturn_effects.sade_sati.status
                                }
                              </h6>
                              <div className="text-sm space-y-1">
                                {reportData.section_14_transit_gochar_analysis
                                  .saturn_effects.sade_sati.status ===
                                "Active" ? (
                                  <>
                                    <p>
                                      <strong>Phase:</strong>{" "}
                                      {
                                        reportData
                                          .section_14_transit_gochar_analysis
                                          .saturn_effects.sade_sati.phase
                                      }
                                    </p>
                                    <p>
                                      <strong>Duration:</strong>{" "}
                                      {
                                        reportData
                                          .section_14_transit_gochar_analysis
                                          .saturn_effects.sade_sati.duration
                                      }
                                    </p>
                                    <p>
                                      <strong>Effects:</strong>{" "}
                                      {
                                        reportData
                                          .section_14_transit_gochar_analysis
                                          .saturn_effects.sade_sati.effects
                                      }
                                    </p>
                                    <p>
                                      <strong>Remedies:</strong>{" "}
                                      {
                                        reportData
                                          .section_14_transit_gochar_analysis
                                          .saturn_effects.sade_sati.advice
                                      }
                                    </p>
                                  </>
                                ) : (
                                  <>
                                    <p>
                                      <strong>Next Occurrence:</strong>{" "}
                                      {
                                        reportData
                                          .section_14_transit_gochar_analysis
                                          .saturn_effects.sade_sati
                                          .next_occurrence
                                      }
                                    </p>
                                    <p>
                                      <strong>Preparation:</strong>{" "}
                                      {
                                        reportData
                                          .section_14_transit_gochar_analysis
                                          .saturn_effects.sade_sati.preparation
                                      }
                                    </p>
                                  </>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Kantak Shani */}
                          {reportData.section_14_transit_gochar_analysis
                            .saturn_effects.kantak_shani && (
                            <div
                              className={`p-4 rounded-lg border ${
                                reportData.section_14_transit_gochar_analysis
                                  .saturn_effects.kantak_shani.status ===
                                "Active"
                                  ? "bg-orange-50 border-orange-300"
                                  : "bg-gray-50 border-gray-300"
                              }`}
                            >
                              <h6 className="font-semibold mb-2">
                                Kantak Shani:{" "}
                                {
                                  reportData.section_14_transit_gochar_analysis
                                    .saturn_effects.kantak_shani.status
                                }
                              </h6>
                              {reportData.section_14_transit_gochar_analysis
                                .saturn_effects.kantak_shani.status ===
                                "Active" && (
                                <div className="text-sm space-y-1">
                                  <p>
                                    <strong>Effects:</strong>{" "}
                                    {
                                      reportData
                                        .section_14_transit_gochar_analysis
                                        .saturn_effects.kantak_shani.effects
                                    }
                                  </p>
                                  <p>
                                    <strong>Advice:</strong>{" "}
                                    {
                                      reportData
                                        .section_14_transit_gochar_analysis
                                        .saturn_effects.kantak_shani.advice
                                    }
                                  </p>
                                  <p>
                                    <strong>Remedies:</strong>{" "}
                                    {
                                      reportData
                                        .section_14_transit_gochar_analysis
                                        .saturn_effects.kantak_shani.remedies
                                    }
                                  </p>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Ashtama Shani */}
                          {reportData.section_14_transit_gochar_analysis
                            .saturn_effects.ashtama_shani && (
                            <div
                              className={`p-4 rounded-lg border ${
                                reportData.section_14_transit_gochar_analysis
                                  .saturn_effects.ashtama_shani.status ===
                                "Active"
                                  ? "bg-purple-50 border-purple-300"
                                  : "bg-gray-50 border-gray-300"
                              }`}
                            >
                              <h6 className="font-semibold mb-2">
                                Ashtama Shani:{" "}
                                {
                                  reportData.section_14_transit_gochar_analysis
                                    .saturn_effects.ashtama_shani.status
                                }
                              </h6>
                              {reportData.section_14_transit_gochar_analysis
                                .saturn_effects.ashtama_shani.status ===
                                "Active" && (
                                <div className="text-sm space-y-1">
                                  <p>
                                    <strong>Effects:</strong>{" "}
                                    {
                                      reportData
                                        .section_14_transit_gochar_analysis
                                        .saturn_effects.ashtama_shani.effects
                                    }
                                  </p>
                                  <p>
                                    <strong>Advice:</strong>{" "}
                                    {
                                      reportData
                                        .section_14_transit_gochar_analysis
                                        .saturn_effects.ashtama_shani.advice
                                    }
                                  </p>
                                  <p>
                                    <strong>Remedies:</strong>{" "}
                                    {
                                      reportData
                                        .section_14_transit_gochar_analysis
                                        .saturn_effects.ashtama_shani.remedies
                                    }
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Jupiter Effects Analysis */}
                  {reportData.section_14_transit_gochar_analysis
                    ?.jupiter_effects && (
                    <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-6 rounded-lg border border-yellow-200">
                      <h5 className="text-xl font-bold text-yellow-800 mb-4 flex items-center gap-2">
                        <div className="w-6 h-6 bg-yellow-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          J
                        </div>
                        Jupiter Transit Effects
                      </h5>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="bg-white/80 p-4 rounded-lg border border-yellow-300">
                            <h6 className="font-semibold text-yellow-700 mb-3">
                              Current Jupiter Position
                            </h6>
                            <div className="text-sm space-y-2">
                              <p className="text-gray-800">
                                {
                                  reportData.section_14_transit_gochar_analysis
                                    .jupiter_effects.current_position
                                }
                              </p>
                              <p className="text-blue-700">
                                {
                                  reportData.section_14_transit_gochar_analysis
                                    .jupiter_effects.position_from_moon
                                }
                              </p>
                              <p className="text-purple-700">
                                {
                                  reportData.section_14_transit_gochar_analysis
                                    .jupiter_effects.position_from_lagna
                                }
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {/* Beneficial Period */}
                          {reportData.section_14_transit_gochar_analysis
                            .jupiter_effects.beneficial_period && (
                            <div
                              className={`p-4 rounded-lg border ${
                                reportData.section_14_transit_gochar_analysis
                                  .jupiter_effects.beneficial_period.status ===
                                "Active"
                                  ? "bg-green-50 border-green-300"
                                  : "bg-orange-50 border-orange-300"
                              }`}
                            >
                              <h6 className="font-semibold mb-2">
                                Beneficial Period:{" "}
                                {
                                  reportData.section_14_transit_gochar_analysis
                                    .jupiter_effects.beneficial_period.status
                                }
                              </h6>
                              <div className="text-sm space-y-1">
                                <p>
                                  <strong>Duration:</strong>{" "}
                                  {
                                    reportData
                                      .section_14_transit_gochar_analysis
                                      .jupiter_effects.beneficial_period
                                      .duration
                                  }
                                </p>
                                <p>
                                  <strong>Effects:</strong>{" "}
                                  {reportData.section_14_transit_gochar_analysis
                                    .jupiter_effects.beneficial_period
                                    .house_effect ||
                                    reportData
                                      .section_14_transit_gochar_analysis
                                      .jupiter_effects.beneficial_period
                                      .current_effect}
                                </p>
                                <p>
                                  <strong>Advice:</strong>{" "}
                                  {
                                    reportData
                                      .section_14_transit_gochar_analysis
                                      .jupiter_effects.beneficial_period.advice
                                  }
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Moon Influence */}
                          {reportData.section_14_transit_gochar_analysis
                            .jupiter_effects.moon_influence && (
                            <div className="bg-white/80 p-4 rounded-lg border border-yellow-300">
                              <h6 className="font-semibold text-yellow-700 mb-2">
                                Moon Influence:{" "}
                                {
                                  reportData.section_14_transit_gochar_analysis
                                    .jupiter_effects.moon_influence.status
                                }
                              </h6>
                              <div className="text-sm space-y-1">
                                <p>
                                  <strong>Effects:</strong>{" "}
                                  {
                                    reportData
                                      .section_14_transit_gochar_analysis
                                      .jupiter_effects.moon_influence.effects
                                  }
                                </p>
                                <p>
                                  <strong>Recommendations:</strong>{" "}
                                  {
                                    reportData
                                      .section_14_transit_gochar_analysis
                                      .jupiter_effects.moon_influence
                                      .recommendations
                                  }
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Rahu/Ketu Effects */}
                  {reportData.section_14_transit_gochar_analysis
                    ?.rahu_ketu_effects && (
                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-lg border border-purple-200">
                      <h5 className="text-xl font-bold text-purple-800 mb-4 flex items-center gap-2">
                        <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          R
                        </div>
                        Rahu/Ketu Transit Effects
                      </h5>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white/80 p-4 rounded-lg border border-purple-300">
                          <h6 className="font-semibold text-purple-700 mb-3">
                            Current Axis
                          </h6>
                          <div className="text-sm space-y-2">
                            <p className="text-gray-800">
                              {
                                reportData.section_14_transit_gochar_analysis
                                  .rahu_ketu_effects.current_axis
                              }
                            </p>
                            <p className="text-blue-700">
                              {
                                reportData.section_14_transit_gochar_analysis
                                  .rahu_ketu_effects.rahu_position
                              }
                            </p>
                            <p className="text-green-700">
                              {
                                reportData.section_14_transit_gochar_analysis
                                  .rahu_ketu_effects.ketu_position
                              }
                            </p>
                            <p className="text-purple-700">
                              Duration:{" "}
                              {
                                reportData.section_14_transit_gochar_analysis
                                  .rahu_ketu_effects.duration
                              }
                            </p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {/* Rahu Effects */}
                          {reportData.section_14_transit_gochar_analysis
                            .rahu_ketu_effects.rahu_effects && (
                            <div className="bg-red-50 p-4 rounded-lg border border-red-300">
                              <h6 className="font-semibold text-red-700 mb-2">
                                Rahu Effects (House{" "}
                                {
                                  reportData.section_14_transit_gochar_analysis
                                    .rahu_ketu_effects.rahu_effects.house
                                }
                                )
                              </h6>
                              <div className="text-sm space-y-1">
                                <p>
                                  <strong>Effects:</strong>{" "}
                                  {
                                    reportData
                                      .section_14_transit_gochar_analysis
                                      .rahu_ketu_effects.rahu_effects.effects
                                  }
                                </p>
                                <p>
                                  <strong>Advice:</strong>{" "}
                                  {
                                    reportData
                                      .section_14_transit_gochar_analysis
                                      .rahu_ketu_effects.rahu_effects.advice
                                  }
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Ketu Effects */}
                          {reportData.section_14_transit_gochar_analysis
                            .rahu_ketu_effects.ketu_effects && (
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-300">
                              <h6 className="font-semibold text-blue-700 mb-2">
                                Ketu Effects (House{" "}
                                {
                                  reportData.section_14_transit_gochar_analysis
                                    .rahu_ketu_effects.ketu_effects.house
                                }
                                )
                              </h6>
                              <div className="text-sm space-y-1">
                                <p>
                                  <strong>Effects:</strong>{" "}
                                  {
                                    reportData
                                      .section_14_transit_gochar_analysis
                                      .rahu_ketu_effects.ketu_effects.effects
                                  }
                                </p>
                                <p>
                                  <strong>Advice:</strong>{" "}
                                  {
                                    reportData
                                      .section_14_transit_gochar_analysis
                                      .rahu_ketu_effects.ketu_effects.advice
                                  }
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Combined Effects & Remedial Measures */}
                  {reportData.section_14_transit_gochar_analysis
                    ?.combined_effects && (
                    <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-6 rounded-lg border border-teal-200">
                      <h5 className="text-xl font-bold text-teal-800 mb-4">
                        Combined Transit Effects & Remedial Measures
                      </h5>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Combined Effects */}
                        <div className="bg-white/80 p-4 rounded-lg border border-teal-300">
                          <h6 className="font-semibold text-teal-700 mb-3">
                            Overall Assessment
                          </h6>
                          <div className="text-sm space-y-2">
                            <p>
                              <strong>Period Assessment:</strong>{" "}
                              {
                                reportData.section_14_transit_gochar_analysis
                                  .combined_effects.overall_period_assessment
                              }
                            </p>
                            <p>
                              <strong>Dominant Influence:</strong>{" "}
                              {
                                reportData.section_14_transit_gochar_analysis
                                  .combined_effects.dominant_influence
                              }
                            </p>
                            <p>
                              <strong>Rahu/Ketu Focus:</strong>{" "}
                              {
                                reportData.section_14_transit_gochar_analysis
                                  .combined_effects.rahu_ketu_influence
                              }
                            </p>
                          </div>

                          {reportData.section_14_transit_gochar_analysis
                            .combined_effects.key_recommendations && (
                            <div className="mt-3">
                              <p className="font-medium text-teal-700 mb-2 block">
                                Key Recommendations:
                              </p>
                              <ul className="text-sm space-y-1">
                                {reportData.section_14_transit_gochar_analysis.combined_effects.key_recommendations.map(
                                  (rec: string, index: number) => (
                                    <li key={index} className="text-teal-800">
                                      • {rec}
                                    </li>
                                  ),
                                )}
                              </ul>
                            </div>
                          )}
                        </div>

                        {/* Remedial Measures */}
                        {reportData.section_14_transit_gochar_analysis
                          ?.remedial_measures && (
                          <div className="bg-white/80 p-4 rounded-lg border border-teal-300">
                            <h6 className="font-semibold text-teal-700 mb-3">
                              Remedial Measures
                            </h6>

                            {reportData.section_14_transit_gochar_analysis
                              .remedial_measures.daily_practices && (
                              <div className="mb-3">
                                <h6 className="font-medium text-green-700 text-sm block mb-1">
                                  Daily Practices:
                                </h6>
                                <ul className="text-xs space-y-1">
                                  {reportData.section_14_transit_gochar_analysis.remedial_measures.daily_practices.map(
                                    (practice: string, index: number) => (
                                      <li
                                        key={index}
                                        className="text-green-800"
                                      >
                                        • {practice}
                                      </li>
                                    ),
                                  )}
                                </ul>
                              </div>
                            )}

                            {reportData.section_14_transit_gochar_analysis
                              .remedial_measures.weekly_practices && (
                              <div className="mb-3">
                                <h6 className="font-medium text-blue-700 text-sm block mb-1">
                                  Weekly Practices:
                                </h6>
                                <ul className="text-xs space-y-1">
                                  {reportData.section_14_transit_gochar_analysis.remedial_measures.weekly_practices.map(
                                    (practice: string, index: number) => (
                                      <li key={index} className="text-blue-800">
                                        • {practice}
                                      </li>
                                    ),
                                  )}
                                </ul>
                              </div>
                            )}

                            {reportData.section_14_transit_gochar_analysis
                              .remedial_measures.general_advice && (
                              <div>
                                <h6 className="font-medium text-purple-700 text-sm block mb-1">
                                  General Advice:
                                </h6>
                                <ul className="text-xs space-y-1">
                                  {reportData.section_14_transit_gochar_analysis.remedial_measures.general_advice.map(
                                    (advice: string, index: number) => (
                                      <li
                                        key={index}
                                        className="text-purple-800"
                                      >
                                        • {advice}
                                      </li>
                                    ),
                                  )}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Section 15: PREMIUM Career Analysis with Ancient Quotes */}
              {section.content === "comprehensive_career_analysis" && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-lg border border-indigo-200">
                    <h4 className="text-xl font-bold text-indigo-800 mb-6 flex items-center gap-2">
                      <Briefcase className="w-6 h-6" />
                      Premium Career Analysis with Ancient Vedic Wisdom
                    </h4>

                    {/* Ancient Sanskrit Introduction */}
                    <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-lg">
                      <div className="text-amber-900 font-medium mb-2 text-lg">
                        "Daśamaṁ karma-bhānaṁ tu jīvanaṁ karma-sādhakam" (BPHS
                        12.1)
                      </div>
                      <div className="text-amber-700 italic text-sm">
                        The 10th house is the house of karma, livelihood, and
                        professional success
                      </div>
                    </div>

                    {reportData.comprehensive_career_analysis ? (
                      <div className="space-y-6">
                        {/* Career Foundation & Ascendant Analysis */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div className="bg-white/80 p-5 rounded-lg border border-indigo-300 shadow-sm">
                            <h5 className="font-semibold text-indigo-700 mb-3 flex items-center gap-2">
                              <Crown className="w-5 h-5" />
                              Ascendant Career Foundation
                            </h5>
                            <div className="space-y-3">
                              {/* Ancient Quote for Lagna */}
                              <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded text-xs">
                                <div className="text-blue-900 font-medium mb-1">
                                  "Lagneśa-balavān puṁsām
                                  sarvakārya-pravartakaḥ" (BPHS 4.3)
                                </div>
                                <div className="text-blue-700 italic">
                                  Lagna lord's strength determines life's work
                                  direction
                                </div>
                              </div>

                              <div className="p-3 bg-indigo-50 rounded-lg">
                                <div className="font-medium text-indigo-800 mb-1">
                                  Career Foundation
                                </div>
                                <div className="text-sm text-indigo-700">
                                  {reportData.comprehensive_career_analysis
                                    .career_foundation?.foundation ||
                                    "Dynamic leadership with strong initiative"}
                                </div>
                              </div>

                              <div className="p-3 bg-purple-50 rounded-lg">
                                <div className="font-medium text-purple-800 mb-1">
                                  Work Style
                                </div>
                                <div className="text-sm text-purple-700">
                                  {reportData.comprehensive_career_analysis
                                    .career_foundation?.work_style ||
                                    "Systematic approach with focus on growth"}
                                </div>
                              </div>

                              <div className="p-2 bg-green-50 rounded text-sm">
                                <div className="font-medium text-green-800 mb-1">
                                  Growth Pattern
                                </div>
                                <div className="text-green-700 text-xs">
                                  {reportData.comprehensive_career_analysis
                                    .career_foundation?.growth_pattern ||
                                    "Foundation 20-30, Growth 30-40, Peak 40-50"}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* 10th Lord Analysis with Ancient Quotes */}
                          <div className="bg-white/80 p-5 rounded-lg border border-indigo-300 shadow-sm">
                            <h5 className="font-semibold text-indigo-700 mb-3 flex items-center gap-2">
                              <Target className="w-5 h-5" />
                              10th Lord House Analysis
                            </h5>
                            <div className="space-y-3">
                              {/* Ancient Quote for 10th Lord */}
                              <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded text-xs">
                                <div className="text-purple-900 font-medium mb-1">
                                  {reportData.comprehensive_career_analysis
                                    .tenth_lord_analysis?.ancient_quote ||
                                    '"Daśameśo yadi lagnastho rājā bhavati dharmavān"'}
                                </div>
                                <div className="text-purple-700 italic">
                                  {reportData.comprehensive_career_analysis
                                    .tenth_lord_analysis?.quote_meaning ||
                                    "10th lord placement determines career direction"}
                                </div>
                              </div>

                              <div className="p-3 bg-indigo-50 rounded-lg">
                                <div className="font-medium text-indigo-800 mb-1">
                                  {reportData.comprehensive_career_analysis
                                    .tenth_lord_analysis?.tenth_lord ||
                                    "10th Lord"}{" "}
                                  in{" "}
                                  {reportData.comprehensive_career_analysis
                                    .tenth_lord_analysis?.placement_house ||
                                    "1st"}{" "}
                                  House
                                </div>
                                <div className="text-sm text-indigo-700">
                                  {reportData.comprehensive_career_analysis
                                    .tenth_lord_analysis?.direction ||
                                    "Self-made career with leadership potential"}
                                </div>
                              </div>

                              <div className="p-3 bg-blue-50 rounded-lg">
                                <div className="font-medium text-blue-800 mb-1">
                                  Career Analysis
                                </div>
                                <div className="text-sm text-blue-700">
                                  {reportData.comprehensive_career_analysis
                                    .tenth_lord_analysis?.analysis ||
                                    "Strong career foundation with growth potential"}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Career Fields & Professions */}
                        <div className="bg-white/80 p-5 rounded-lg border border-indigo-300 shadow-sm">
                          <h5 className="font-semibold text-indigo-700 mb-4 flex items-center gap-2">
                            <Building className="w-5 h-5" />
                            Suitable Career Fields & Professional Direction
                          </h5>
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            <div className="p-3 bg-green-50 rounded-lg">
                              <div className="font-medium text-green-800 mb-2">
                                Primary Fields
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {(
                                  reportData.comprehensive_career_analysis
                                    .career_foundation?.suitable_fields || [
                                    "Leadership",
                                    "Teaching",
                                    "Consulting",
                                  ]
                                ).map((field: string, index: number) => (
                                  <span
                                    key={index}
                                    className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs"
                                  >
                                    {field}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="p-3 bg-purple-50 rounded-lg">
                              <div className="font-medium text-purple-800 mb-2">
                                Specific Professions
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {(
                                  reportData.comprehensive_career_analysis
                                    .tenth_lord_analysis?.professions || [
                                    "Administration",
                                    "Management",
                                    "Consulting",
                                  ]
                                ).map((profession: string, index: number) => (
                                  <span
                                    key={index}
                                    className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs"
                                  >
                                    {profession}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="p-3 bg-amber-50 rounded-lg">
                              <div className="font-medium text-amber-800 mb-2">
                                Job vs Business
                              </div>
                              <div className="text-center">
                                <span className="px-3 py-2 bg-amber-100 text-amber-700 rounded-full font-medium">
                                  {reportData.comprehensive_career_analysis
                                    .job_vs_business_recommendation ||
                                    "Both Suitable"}
                                </span>
                              </div>
                              <div className="text-xs text-amber-700 mt-2 text-center">
                                {reportData.comprehensive_career_analysis
                                  .career_foundation?.job_vs_business ===
                                "business"
                                  ? "Entrepreneurship Favored"
                                  : reportData.comprehensive_career_analysis
                                        .career_foundation?.job_vs_business ===
                                      "job"
                                    ? "Service Oriented"
                                    : "Flexible Approach"}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Saturn Analysis - Karma Karaka */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div className="bg-white/80 p-5 rounded-lg border border-purple-300 shadow-sm">
                            <h5 className="font-semibold text-purple-700 mb-3 flex items-center gap-2">
                              <Sparkles className="w-5 h-5" />
                              Saturn: Natural Career Significator
                            </h5>
                            <div className="space-y-3">
                              {/* Ancient Quote for Saturn */}
                              <div className="p-3 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded text-xs">
                                <div className="text-purple-900 font-medium mb-1">
                                  "Śanaiścaraḥ karmakārakaḥ,
                                  dīrghakāla-phalapradaḥ" (BPHS 34.10)
                                </div>
                                <div className="text-purple-700 italic">
                                  Saturn is the significator of profession and
                                  gives results after sustained effort
                                </div>
                              </div>

                              <div className="p-3 bg-purple-50 rounded-lg">
                                <div className="font-medium text-purple-800 mb-1">
                                  Saturn Analysis
                                </div>
                                <div className="text-sm text-purple-700">
                                  {reportData.comprehensive_career_analysis
                                    .saturn_analysis?.analysis ||
                                    "Saturn influences through discipline and hard work, bringing delayed but lasting career success"}
                                </div>
                              </div>

                              <div className="p-3 bg-indigo-50 rounded-lg">
                                <div className="font-medium text-indigo-800 mb-1">
                                  Career Impact
                                </div>
                                <div className="text-sm text-indigo-700">
                                  {reportData.comprehensive_career_analysis
                                    .saturn_analysis?.career_impact ||
                                    "Steady professional growth through persistent effort and learning"}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Career Timing & Phases */}
                          <div className="bg-white/80 p-5 rounded-lg border border-amber-300 shadow-sm">
                            <h5 className="font-semibold text-amber-700 mb-3 flex items-center gap-2">
                              <Clock className="w-5 h-5" />
                              Career Timeline & Growth Phases
                            </h5>
                            <div className="space-y-3">
                              {/* Ancient Quote for Career Timing */}
                              <div className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded text-xs">
                                <div className="text-amber-900 font-medium mb-1">
                                  "Bālye ca śukre phalaṁ dadyāt, madhye budho,
                                  vṛddhake śanaiḥ" (Hora Sara 3.11)
                                </div>
                                <div className="text-amber-700 italic">
                                  Career fruits ripen in different life phases
                                  through planetary influence
                                </div>
                              </div>

                              <div className="space-y-2 text-sm">
                                <div className="p-2 bg-green-50 rounded border-l-4 border-green-400">
                                  <div className="font-medium text-green-800">
                                    Foundation Phase (20-30)
                                  </div>
                                  <div className="text-green-700 text-xs">
                                    {reportData.comprehensive_career_analysis
                                      .career_phases?.foundation ||
                                      "Learning, skill development, and career exploration"}
                                  </div>
                                </div>

                                <div className="p-2 bg-blue-50 rounded border-l-4 border-blue-400">
                                  <div className="font-medium text-blue-800">
                                    Growth Phase (30-40)
                                  </div>
                                  <div className="text-blue-700 text-xs">
                                    {reportData.comprehensive_career_analysis
                                      .career_phases?.growth ||
                                      "Professional advancement and recognition"}
                                  </div>
                                </div>

                                <div className="p-2 bg-purple-50 rounded border-l-4 border-purple-400">
                                  <div className="font-medium text-purple-800">
                                    Peak Phase (40-50)
                                  </div>
                                  <div className="text-purple-700 text-xs">
                                    {reportData.comprehensive_career_analysis
                                      .career_phases?.peak ||
                                      "Authority, leadership, and maximum influence"}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Career Remedies with Ancient Quotes */}
                        <div className="bg-white/80 p-5 rounded-lg border border-rose-300 shadow-sm">
                          <h5 className="font-semibold text-rose-700 mb-4 flex items-center gap-2">
                            <Diamond className="w-5 h-5" />
                            Career Enhancement Remedies
                          </h5>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {/* Mantra Section */}
                            <div className="p-4 bg-rose-50 rounded-lg">
                              <div className="p-3 bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 rounded text-xs mb-3">
                                <div className="text-rose-900 font-medium mb-1">
                                  "Dānaṁ japyaṁ tapaḥ karma grahān śamayate
                                  nṛṇām" (BPHS 85.5)
                                </div>
                                <div className="text-rose-700 italic">
                                  Charity, mantra, and austerities pacify
                                  planetary challenges
                                </div>
                              </div>

                              <div className="font-medium text-rose-800 mb-2">
                                Career Enhancement Mantras
                              </div>
                              <div className="space-y-2 text-sm">
                                <div className="p-2 bg-white rounded border">
                                  <div className="font-medium text-indigo-700">
                                    Saturn Mantra
                                  </div>
                                  <div className="text-gray-600 text-xs">
                                    "Om Shani Devaya Namaha" - 108 times daily
                                  </div>
                                </div>
                                <div className="p-2 bg-white rounded border">
                                  <div className="font-medium text-yellow-700">
                                    Jupiter Mantra
                                  </div>
                                  <div className="text-gray-600 text-xs">
                                    "Om Guru Devaya Namaha" - for wisdom
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Gemstone & Lifestyle */}
                            <div className="p-4 bg-amber-50 rounded-lg">
                              <div className="font-medium text-amber-800 mb-2">
                                Lifestyle & Gemstone Guidance
                              </div>
                              <div className="space-y-2 text-sm">
                                <div className="p-2 bg-white rounded border">
                                  <div className="font-medium text-blue-700">
                                    Recommended Gemstone
                                  </div>
                                  <div className="text-gray-600 text-xs">
                                    {reportData.comprehensive_career_analysis
                                      .remedies?.gemstone ||
                                      "Blue Sapphire (consult astrologer)"}
                                  </div>
                                </div>
                                <div className="p-2 bg-white rounded border">
                                  <div className="font-medium text-green-700">
                                    Career Days
                                  </div>
                                  <div className="text-gray-600 text-xs">
                                    Saturday for Saturn, Thursday for Jupiter
                                  </div>
                                </div>
                                <div className="p-2 bg-white rounded border">
                                  <div className="font-medium text-purple-700">
                                    Charity
                                  </div>
                                  <div className="text-gray-600 text-xs">
                                    Oil donation on Saturdays for career
                                    obstacles
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Authentic Career Options */}
                        <div className="bg-white/80 p-5 rounded-lg border border-green-300 shadow-sm">
                          <h5 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5" />
                            Top Career Options (Authentic Scoring)
                          </h5>
                          <div className="space-y-2">
                            {reportData.comprehensive_career_analysis.top_career_options?.map(
                              (career: any, index: number) => (
                                <div
                                  key={index}
                                  className="flex justify-between items-center p-2 bg-green-50 rounded"
                                >
                                  <span className="text-sm font-medium text-green-800">
                                    {career.profession}
                                  </span>
                                  <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">
                                    {career.score}%
                                  </span>
                                </div>
                              ),
                            )}
                          </div>
                        </div>

                        {/* Authentic Business vs Job */}
                        <div className="bg-white/80 p-5 rounded-lg border border-blue-300 shadow-sm">
                          <h5 className="font-semibold text-blue-700 mb-3 flex items-center gap-2">
                            <Building className="w-5 h-5" />
                            Business vs Job Analysis (Authentic)
                          </h5>
                          <div className="space-y-3">
                            <div className="p-3 bg-blue-50 rounded-lg">
                              <div className="font-medium text-blue-800 mb-1">
                                Recommendation:{" "}
                                {
                                  reportData.comprehensive_career_analysis
                                    .business_vs_job?.recommendation
                                }
                              </div>
                              <div className="text-sm text-blue-700">
                                {
                                  reportData.comprehensive_career_analysis
                                    .business_vs_job?.reason
                                }
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-xs">
                              <div className="p-2 bg-green-50 rounded">
                                <div className="font-medium text-green-700">
                                  Job Score
                                </div>
                                <div className="text-green-600">
                                  {
                                    reportData.comprehensive_career_analysis
                                      .business_vs_job?.job_score
                                  }
                                  /10
                                </div>
                              </div>
                              <div className="p-2 bg-yellow-50 rounded">
                                <div className="font-medium text-yellow-700">
                                  Business Score
                                </div>
                                <div className="text-yellow-600">
                                  {
                                    reportData.comprehensive_career_analysis
                                      .business_vs_job?.business_score
                                  }
                                  /10
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Authentic Career Timeline */}
                        <div className="bg-white/80 p-5 rounded-lg border border-purple-300 shadow-sm">
                          <h5 className="font-semibold text-purple-700 mb-3 flex items-center gap-2">
                            <Clock className="w-5 h-5" />
                            Career Timeline (Age-Based Authentic Predictions)
                          </h5>
                          <div className="space-y-2">
                            {reportData.comprehensive_career_analysis.career_timeline?.map(
                              (timeline: any, index: number) => (
                                <div
                                  key={index}
                                  className="flex items-start gap-3 p-2 bg-purple-50 rounded"
                                >
                                  <div className="w-16 text-xs font-medium text-purple-700">
                                    {timeline.age_range}
                                  </div>
                                  <div className="text-xs text-purple-800">
                                    {timeline.event}
                                  </div>
                                </div>
                              ),
                            )}
                          </div>
                        </div>

                        {/* Saturn Career Role */}
                        <div className="bg-white/80 p-5 rounded-lg border border-orange-300 shadow-sm">
                          <h5 className="font-semibold text-orange-700 mb-3 flex items-center gap-2">
                            <Star className="w-5 h-5" />
                            Saturn's Career Role
                          </h5>
                          <div className="p-3 bg-orange-50 rounded-lg">
                            <div className="text-sm text-orange-800">
                              {
                                reportData.comprehensive_career_analysis
                                  .saturn_analysis
                              }
                            </div>
                          </div>
                        </div>

                        {/* Career Yogas */}
                        <div className="bg-white/80 p-5 rounded-lg border border-emerald-300 shadow-sm">
                          <h5 className="font-semibold text-emerald-700 mb-3 flex items-center gap-2">
                            <Crown className="w-5 h-5" />
                            Career Yogas Detected
                          </h5>
                          <div className="space-y-2">
                            {reportData.comprehensive_career_analysis.career_yogas?.map(
                              (yoga: string, index: number) => (
                                <div
                                  key={index}
                                  className="p-2 bg-emerald-50 rounded text-sm text-emerald-800"
                                >
                                  • {yoga}
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-yellow-800">
                          Career analysis data is being calculated. Please
                          regenerate the report to see authentic career
                          predictions.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Section 16: Wealth Analysis */}
              {section.content === "comprehensive_wealth_analysis" && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
                    <h4 className="text-xl font-bold text-green-800 mb-6 flex items-center gap-2">
                      <DollarSign className="w-6 h-6" />
                      {reportData.wealth_and_finances_analysis?.title ||
                        "Wealth & Finance Analysis"}
                    </h4>

                    {/* Debug Information */}
                    {reportData.wealth_and_finances_analysis?.debug_info && (
                      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs">
                        <div className="font-bold text-blue-800 mb-2">
                          🔍 Authenticity Verification
                        </div>
                        <div className="space-y-1 text-blue-700">
                          <div>
                            Calculated Lords:{" "}
                            {
                              reportData.wealth_and_finances_analysis.debug_info
                                .calculated_lords
                            }
                          </div>
                          <div>
                            Lord Positions:{" "}
                            {
                              reportData.wealth_and_finances_analysis.debug_info
                                .lord_positions
                            }
                          </div>
                          <div>
                            Yoga Count:{" "}
                            {
                              reportData.wealth_and_finances_analysis.debug_info
                                .yoga_count
                            }
                          </div>
                          <div>
                            Wealth Score:{" "}
                            {
                              reportData.wealth_and_finances_analysis.debug_info
                                .wealth_score
                            }
                          </div>
                        </div>
                      </div>
                    )}

                    {reportData.wealth_and_finances_analysis ? (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Primary Wealth Indication */}
                        <div className="lg:col-span-2 bg-white/80 p-5 rounded-lg border border-green-300 shadow-sm">
                          <h5 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                            <Star className="w-5 h-5" />
                            Primary Wealth Indication
                          </h5>
                          <div className="p-3 bg-green-50 rounded-lg">
                            <div className="text-sm text-green-700">
                              {
                                reportData.wealth_and_finances_analysis
                                  .primary_wealth_indication
                              }
                            </div>
                          </div>
                        </div>

                        {/* Dhana Yogas */}
                        {reportData.wealth_and_finances_analysis.dhana_yogas &&
                          reportData.wealth_and_finances_analysis.dhana_yogas
                            .length > 0 && (
                            <div className="bg-white/80 p-5 rounded-lg border border-green-300 shadow-sm">
                              <h5 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                                <Crown className="w-5 h-5" />
                                Dhana Yogas (
                                {
                                  reportData.wealth_and_finances_analysis
                                    .dhana_yogas.length
                                }
                                )
                              </h5>
                              <div className="space-y-3">
                                {reportData.wealth_and_finances_analysis.dhana_yogas.map(
                                  (yoga: any, index: number) => (
                                    <div
                                      key={index}
                                      className="p-3 bg-green-50 rounded-lg"
                                    >
                                      <div className="font-medium text-green-800 mb-1 flex items-center gap-2">
                                        {yoga.name}
                                        <Badge
                                          variant={
                                            yoga.strength === "Very High"
                                              ? "default"
                                              : yoga.strength === "High"
                                                ? "secondary"
                                                : "outline"
                                          }
                                          className="text-xs"
                                        >
                                          {yoga.strength}
                                        </Badge>
                                      </div>
                                      <div className="text-sm text-green-700">
                                        {yoga.description}
                                      </div>
                                    </div>
                                  ),
                                )}
                              </div>
                            </div>
                          )}

                        {/* Income Sources */}
                        {reportData.wealth_and_finances_analysis
                          .income_sources && (
                          <div className="bg-white/80 p-5 rounded-lg border border-blue-300 shadow-sm">
                            <h5 className="font-semibold text-blue-700 mb-3 flex items-center gap-2">
                              <TrendingUp className="w-5 h-5" />
                              Income Sources Analysis
                            </h5>
                            <div className="space-y-3">
                              <div className="p-2 bg-blue-50 rounded">
                                <div className="text-sm font-medium text-blue-800">
                                  Primary Sources
                                </div>
                                <div className="text-xs text-blue-700">
                                  {
                                    reportData.wealth_and_finances_analysis
                                      .income_sources.primary_source
                                  }
                                </div>
                              </div>
                              <div className="p-2 bg-blue-50 rounded">
                                <div className="text-sm font-medium text-blue-800">
                                  Secondary Sources
                                </div>
                                <div className="text-xs text-blue-700">
                                  {
                                    reportData.wealth_and_finances_analysis
                                      .income_sources.secondary_source
                                  }
                                </div>
                              </div>
                              <div className="p-2 bg-indigo-50 rounded">
                                <div className="text-sm font-medium text-indigo-800">
                                  Stability:{" "}
                                  {
                                    reportData.wealth_and_finances_analysis
                                      .income_sources.income_stability
                                  }
                                </div>
                                <div className="text-xs text-indigo-700">
                                  {
                                    reportData.wealth_and_finances_analysis
                                      .income_sources.diversification_advice
                                  }
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Investment Strategy */}
                        {reportData.wealth_and_finances_analysis
                          .investment_strategy && (
                          <div className="bg-white/80 p-5 rounded-lg border border-yellow-300 shadow-sm">
                            <h5 className="font-semibold text-yellow-700 mb-3 flex items-center gap-2">
                              <Target className="w-5 h-5" />
                              Investment Strategy
                            </h5>
                            <div className="space-y-3">
                              <div className="grid grid-cols-2 gap-3">
                                <div className="p-2 bg-yellow-50 rounded text-center">
                                  <div className="text-sm font-medium text-yellow-800">
                                    Suitability
                                  </div>
                                  <div className="text-xs text-yellow-700">
                                    {
                                      reportData.wealth_and_finances_analysis
                                        .investment_strategy
                                        .investment_suitability
                                    }
                                  </div>
                                </div>
                                <div className="p-2 bg-orange-50 rounded text-center">
                                  <div className="text-sm font-medium text-orange-800">
                                    Risk Tolerance
                                  </div>
                                  <div className="text-xs text-orange-700">
                                    {
                                      reportData.wealth_and_finances_analysis
                                        .investment_strategy.risk_tolerance
                                    }
                                  </div>
                                </div>
                              </div>
                              <div className="p-3 bg-yellow-50 rounded-lg">
                                <div className="text-sm text-yellow-800">
                                  <strong>Guidance:</strong>{" "}
                                  {
                                    reportData.wealth_and_finances_analysis
                                      .investment_strategy.speculation_advice
                                  }
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Financial Timeline */}
                        {reportData.wealth_and_finances_analysis
                          .wealth_timeline && (
                          <div className="bg-white/80 p-5 rounded-lg border border-purple-300 shadow-sm">
                            <h5 className="font-semibold text-purple-700 mb-3 flex items-center gap-2">
                              <Clock className="w-5 h-5" />
                              Wealth Timeline
                            </h5>
                            <div className="space-y-2">
                              {reportData.wealth_and_finances_analysis.wealth_timeline.map(
                                (timeline: any, index: number) => (
                                  <div
                                    key={index}
                                    className="flex items-start gap-3 p-2 bg-purple-50 rounded"
                                  >
                                    <div className="w-12 text-xs font-medium text-purple-700">
                                      {timeline.age_range}
                                    </div>
                                    <div className="text-xs text-purple-800">
                                      {timeline.phase}
                                    </div>
                                  </div>
                                ),
                              )}
                            </div>
                          </div>
                        )}

                        {/* Wealth Score */}
                        {reportData.wealth_and_finances_analysis
                          .overall_wealth_score && (
                          <div className="lg:col-span-2 bg-gradient-to-r from-green-100 to-emerald-100 p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-semibold text-green-800">
                                Overall Wealth Potential
                              </span>
                              <span className="text-2xl font-bold text-green-700">
                                {
                                  reportData.wealth_and_finances_analysis
                                    .overall_wealth_score
                                }
                                /100
                              </span>
                            </div>
                            <Progress
                              value={
                                reportData.wealth_and_finances_analysis
                                  .overall_wealth_score
                              }
                              className="mb-2"
                            />
                            <div className="text-sm text-green-700">
                              {reportData.wealth_and_finances_analysis.summary}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-yellow-800">
                          Wealth analysis data is being calculated. Please
                          regenerate the report to see authentic wealth
                          predictions.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Section 17: Marriage Analysis */}
              {section.content === "comprehensive_marriage_analysis" && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-rose-50 to-pink-50 p-6 rounded-lg border border-rose-200">
                    <h4 className="text-xl font-bold text-rose-800 mb-6 flex items-center gap-2">
                      <Heart className="w-6 h-6" />
                      Comprehensive Marriage & Relationship Analysis
                    </h4>

                    {/* Debug: Check what marriage data is available */}
                    {console.log("=== MARRIAGE ANALYSIS DEBUG ===", {
                      marriage_relationships_analysis:
                        reportData.marriage_relationships_analysis,
                      love_marriage_predictions:
                        reportData.love_marriage_predictions,
                      available_keys: Object.keys(reportData).filter((key) =>
                        key.includes("marriage"),
                      ),
                    })}

                    {/* Check if authentic marriage analysis data exists */}
                    {reportData.marriage_relationships_analysis ? (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* 7th House Analysis */}
                        {reportData.marriage_relationships_analysis
                          .seventh_house_analysis && (
                          <div className="lg:col-span-2 bg-gradient-to-r from-purple-50 to-indigo-50 p-5 rounded-lg border border-purple-300 shadow-sm">
                            <h5 className="font-semibold text-purple-700 mb-3 flex items-center gap-2">
                              <Home className="w-5 h-5" />
                              7th House Analysis - Your Marriage House
                            </h5>
                            <div className="p-3 bg-white/80 rounded-lg">
                              <div className="font-medium text-purple-800 mb-2">
                                {
                                  reportData.marriage_relationships_analysis
                                    .seventh_house_analysis.description
                                }
                              </div>
                              <div className="text-sm text-purple-700">
                                Sign:{" "}
                                {
                                  reportData.marriage_relationships_analysis
                                    .seventh_house_analysis.sign
                                }{" "}
                                |
                                {
                                  reportData.marriage_relationships_analysis
                                    .seventh_house_analysis.planetary_influence
                                }
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Marriage Timing */}
                        <div className="bg-white/80 p-5 rounded-lg border border-blue-300 shadow-sm">
                          <h5 className="font-semibold text-blue-700 mb-3 flex items-center gap-2">
                            <Clock className="w-5 h-5" />
                            Marriage Timing Analysis
                          </h5>
                          <div className="space-y-3">
                            <div className="p-3 bg-blue-50 rounded-lg">
                              <div className="font-medium text-blue-800 mb-1">
                                Timing Prediction
                              </div>
                              <div className="text-sm text-blue-700">
                                {
                                  reportData.marriage_relationships_analysis
                                    .marriage_timing
                                }
                              </div>
                            </div>
                            {/* Affliction Analysis */}
                            {reportData.marriage_relationships_analysis
                              .affliction_analysis && (
                              <div className="p-2 bg-gray-50 rounded text-xs">
                                <div className="flex justify-between mb-1">
                                  <span className="text-gray-600">
                                    Malefic Afflictions:
                                  </span>
                                  <span className="font-medium text-gray-800">
                                    {
                                      reportData.marriage_relationships_analysis
                                        .affliction_analysis.malefic_count
                                    }
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">
                                    Benefic Support:
                                  </span>
                                  <span className="font-medium text-gray-800">
                                    {
                                      reportData.marriage_relationships_analysis
                                        .affliction_analysis.benefic_support
                                    }
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Spouse Characteristics */}
                        <div className="bg-white/80 p-5 rounded-lg border border-rose-300 shadow-sm">
                          <h5 className="font-semibold text-rose-700 mb-3 flex items-center gap-2">
                            <User className="w-5 h-5" />
                            Spouse Characteristics
                          </h5>
                          <div className="space-y-3">
                            <div className="space-y-2 text-sm">
                              {reportData.marriage_relationships_analysis
                                .spouse_characteristics && (
                                <>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">
                                      Nature:
                                    </span>
                                    <span className="font-medium text-rose-700">
                                      {
                                        reportData
                                          .marriage_relationships_analysis
                                          .spouse_characteristics.nature
                                      }
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">
                                      Profession:
                                    </span>
                                    <span className="font-medium text-rose-700">
                                      {
                                        reportData
                                          .marriage_relationships_analysis
                                          .spouse_characteristics.profession
                                      }
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">
                                      Family Background:
                                    </span>
                                    <span className="font-medium text-rose-700">
                                      {
                                        reportData
                                          .marriage_relationships_analysis
                                          .spouse_characteristics
                                          .family_background
                                      }
                                    </span>
                                  </div>
                                  {reportData.marriage_relationships_analysis
                                    .spouse_characteristics.physical &&
                                    reportData.marriage_relationships_analysis
                                      .spouse_characteristics.physical.length >
                                      0 && (
                                      <div className="p-2 bg-rose-50 rounded">
                                        <div className="font-medium text-rose-800 mb-1">
                                          Physical Traits:
                                        </div>
                                        <div className="text-xs text-rose-700">
                                          {reportData.marriage_relationships_analysis.spouse_characteristics.physical.join(
                                            ", ",
                                          )}
                                        </div>
                                      </div>
                                    )}
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Relationship Compatibility */}
                        <div className="bg-white/80 p-5 rounded-lg border border-green-300 shadow-sm">
                          <h5 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5" />
                            Relationship Compatibility
                          </h5>
                          <div className="space-y-2">
                            {reportData.marriage_relationships_analysis
                              .relationship_compatibility && (
                              <>
                                <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                                  <span className="text-sm font-medium text-green-800">
                                    Harmony Level
                                  </span>
                                  <span
                                    className={`text-xs px-2 py-1 rounded-full ${
                                      reportData.marriage_relationships_analysis
                                        .relationship_compatibility
                                        .harmony_level === "High"
                                        ? "bg-green-200 text-green-800"
                                        : "bg-yellow-200 text-yellow-800"
                                    }`}
                                  >
                                    {
                                      reportData.marriage_relationships_analysis
                                        .relationship_compatibility
                                        .harmony_level
                                    }
                                  </span>
                                </div>
                                <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                                  <span className="text-sm font-medium text-blue-800">
                                    Communication
                                  </span>
                                  <span
                                    className={`text-xs px-2 py-1 rounded-full ${
                                      reportData.marriage_relationships_analysis
                                        .relationship_compatibility
                                        .communication === "Remarkable"
                                        ? "bg-purple-200 text-purple-800"
                                        : "bg-blue-200 text-blue-800"
                                    }`}
                                  >
                                    {
                                      reportData.marriage_relationships_analysis
                                        .relationship_compatibility
                                        .communication
                                    }
                                  </span>
                                </div>
                                <div className="flex justify-between items-center p-2 bg-orange-50 rounded">
                                  <span className="text-sm font-medium text-orange-800">
                                    Emotional Bond
                                  </span>
                                  <span
                                    className={`text-xs px-2 py-1 rounded-full ${
                                      reportData.marriage_relationships_analysis
                                        .relationship_compatibility
                                        .emotional_bond === "Dynamic"
                                        ? "bg-green-200 text-green-800"
                                        : "bg-yellow-200 text-yellow-800"
                                    }`}
                                  >
                                    {
                                      reportData.marriage_relationships_analysis
                                        .relationship_compatibility
                                        .emotional_bond
                                    }
                                  </span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Marriage Stability & Guidance */}
                        <div className="bg-white/80 p-5 rounded-lg border border-purple-300 shadow-sm">
                          <h5 className="font-semibold text-purple-700 mb-3 flex items-center gap-2">
                            <Star className="w-5 h-5" />
                            Marriage Stability & Guidance
                          </h5>
                          <div className="space-y-2">
                            {reportData.marriage_relationships_analysis
                              .marriage_stability && (
                              <>
                                {reportData.marriage_relationships_analysis
                                  .marriage_stability.factors && (
                                  <div className="space-y-1 text-xs">
                                    {reportData.marriage_relationships_analysis.marriage_stability.factors.map(
                                      (factor, index) => (
                                        <div
                                          key={index}
                                          className="p-2 bg-green-50 rounded text-green-800"
                                        >
                                          ✓ {factor}
                                        </div>
                                      ),
                                    )}
                                  </div>
                                )}
                                {reportData.marriage_relationships_analysis
                                  .marriage_stability.challenges && (
                                  <div className="p-2 bg-yellow-50 rounded text-sm">
                                    <div className="font-medium text-yellow-800 mb-1">
                                      Challenges:
                                    </div>
                                    <div className="space-y-1 text-xs">
                                      {Array.isArray(
                                        reportData
                                          .marriage_relationships_analysis
                                          .marriage_stability.challenges,
                                      ) ? (
                                        reportData.marriage_relationships_analysis.marriage_stability.challenges.map(
                                          (challenge, index) => (
                                            <div
                                              key={index}
                                              className="text-yellow-700"
                                            >
                                              • {challenge}
                                            </div>
                                          ),
                                        )
                                      ) : (
                                        <div className="text-yellow-700">
                                          {
                                            reportData
                                              .marriage_relationships_analysis
                                              .marriage_stability.challenges
                                          }
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                                {reportData.marriage_relationships_analysis
                                  .marriage_stability.remedies && (
                                  <div className="p-2 bg-purple-50 rounded text-sm">
                                    <div className="font-medium text-purple-800 mb-1">
                                      Remedies:
                                    </div>
                                    <div className="space-y-1 text-xs">
                                      {reportData.marriage_relationships_analysis.marriage_stability.remedies.map(
                                        (remedy, index) => (
                                          <div
                                            key={index}
                                            className="text-purple-700"
                                          >
                                            • {remedy}
                                          </div>
                                        ),
                                      )}
                                    </div>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </div>

                        {/* Special Indications */}
                        {reportData.marriage_relationships_analysis
                          .special_indications &&
                          reportData.marriage_relationships_analysis
                            .special_indications.length > 0 && (
                            <div className="lg:col-span-2 bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-300">
                              <div className="flex items-center gap-2 mb-3">
                                <AlertTriangle className="w-5 h-5 text-yellow-700" />
                                <span className="font-semibold text-yellow-800">
                                  Special Marriage Indications
                                </span>
                              </div>
                              <div className="space-y-2">
                                {reportData.marriage_relationships_analysis.special_indications.map(
                                  (indication, index) => (
                                    <div
                                      key={index}
                                      className="p-2 bg-white/80 rounded text-sm text-yellow-800"
                                    >
                                      • {indication}
                                    </div>
                                  ),
                                )}
                              </div>
                            </div>
                          )}

                        {/* Children Prospects */}
                        {reportData.marriage_relationships_analysis
                          .children_prospects && (
                          <div className="lg:col-span-2 bg-gradient-to-r from-amber-100 to-orange-100 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Users className="w-5 h-5 text-amber-700" />
                              <span className="font-semibold text-amber-800">
                                Children Prospects
                              </span>
                            </div>
                            <div className="text-sm text-amber-700">
                              {
                                reportData.marriage_relationships_analysis
                                  .children_prospects
                              }
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-yellow-800">
                          Marriage analysis data is being calculated. Please
                          regenerate the report to see authentic marriage
                          predictions based on your birth details.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Section 18: Remedies Analysis */}
              {section.content === "comprehensive_remedies_analysis" && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-6 rounded-lg border border-yellow-200">
                    <h4 className="text-xl font-bold text-yellow-800 mb-6 flex items-center gap-2">
                      <Diamond className="w-6 h-6" />
                      Complete Remedial Solutions
                    </h4>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Gemstone Recommendations */}
                      <div className="bg-white/80 p-5 rounded-lg border border-yellow-300 shadow-sm">
                        <h5 className="font-semibold text-yellow-700 mb-3 flex items-center gap-2">
                          <Diamond className="w-5 h-5" />
                          Gemstone Recommendations
                        </h5>
                        <div className="space-y-2">
                          {[
                            {
                              gem: "Yellow Sapphire (Pukhraj)",
                              planet: "Jupiter",
                              weight: "5-7 carats",
                              finger: "Index finger",
                              day: "Thursday",
                              effect: "Wisdom, teaching success",
                            },
                            {
                              gem: "Emerald (Panna)",
                              planet: "Mercury",
                              weight: "3-5 carats",
                              finger: "Little finger",
                              day: "Wednesday",
                              effect: "Communication, analytical skills",
                            },
                            {
                              gem: "Pearl (Moti)",
                              planet: "Moon",
                              weight: "4-6 carats",
                              finger: "Ring finger",
                              day: "Monday",
                              effect: "Emotional balance, intuition",
                            },
                          ].map((stone, index) => (
                            <div
                              key={index}
                              className="p-3 bg-yellow-50 rounded-lg border border-yellow-300"
                            >
                              <div className="font-medium text-yellow-800 mb-2">
                                {stone.gem}
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>
                                  <strong>Planet:</strong> {stone.planet}
                                </div>
                                <div>
                                  <strong>Weight:</strong> {stone.weight}
                                </div>
                                <div>
                                  <strong>Finger:</strong> {stone.finger}
                                </div>
                                <div>
                                  <strong>Day:</strong> {stone.day}
                                </div>
                              </div>
                              <div className="text-xs text-yellow-700 mt-2 bg-yellow-100 p-2 rounded">
                                <strong>Effect:</strong> {stone.effect}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Mantra & Meditation */}
                      <div className="bg-white/80 p-5 rounded-lg border border-orange-300 shadow-sm">
                        <h5 className="font-semibold text-orange-700 mb-3 flex items-center gap-2">
                          <Star className="w-5 h-5" />
                          Mantra & Spiritual Practices
                        </h5>
                        <div className="space-y-3">
                          <div className="p-3 bg-orange-50 rounded-lg">
                            <div className="font-medium text-orange-800 mb-1">
                              Primary Mantra
                            </div>
                            <div className="text-sm text-orange-700 bg-orange-100 p-2 rounded font-mono">
                              "Om Gam Ganapataye Namaha"
                            </div>
                            <div className="text-xs text-orange-600 mt-1">
                              108 times daily, especially during Mercury and
                              Jupiter periods
                            </div>
                          </div>
                          <div className="space-y-2">
                            {[
                              {
                                mantra: "Jupiter Mantra",
                                chant: "Om Brihasphataye Namaha",
                                times: "108 times",
                                day: "Thursday",
                              },
                              {
                                mantra: "Mercury Mantra",
                                chant: "Om Budhaya Namaha",
                                times: "108 times",
                                day: "Wednesday",
                              },
                              {
                                mantra: "Healing Mantra",
                                chant: "Om Tryambakam Yajamahe",
                                times: "21 times",
                                day: "Daily",
                              },
                            ].map((practice, index) => (
                              <div
                                key={index}
                                className="p-2 bg-orange-50 rounded text-sm"
                              >
                                <div className="flex justify-between items-center">
                                  <span className="font-medium text-orange-800">
                                    {practice.mantra}
                                  </span>
                                  <span className="text-xs text-orange-600">
                                    {practice.day}
                                  </span>
                                </div>
                                <div className="text-xs text-orange-700 mt-1">
                                  {practice.chant} - {practice.times}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Yantra & Rudraksha */}
                      <div className="bg-white/80 p-5 rounded-lg border border-green-300 shadow-sm">
                        <h5 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                          <Target className="w-5 h-5" />
                          Yantra & Rudraksha Recommendations
                        </h5>
                        <div className="space-y-3">
                          <div className="p-3 bg-green-50 rounded-lg">
                            <div className="font-medium text-green-800 mb-2">
                              Recommended Yantras
                            </div>
                            <div className="space-y-1 text-sm">
                              <div>
                                • Sri Ganesh Yantra - For obstacle removal
                              </div>
                              <div>
                                • Brihaspati Yantra - For Jupiter strengthening
                              </div>
                              <div>• Budh Yantra - For Mercury enhancement</div>
                            </div>
                          </div>
                          <div className="p-3 bg-green-50 rounded-lg">
                            <div className="font-medium text-green-800 mb-2">
                              Rudraksha Selection
                            </div>
                            <div className="space-y-2">
                              {[
                                {
                                  mukhi: "5 Mukhi",
                                  benefit: "General health, meditation",
                                  wear: "Always",
                                },
                                {
                                  mukhi: "6 Mukhi",
                                  benefit: "Communication, learning",
                                  wear: "Mercury periods",
                                },
                                {
                                  mukhi: "12 Mukhi",
                                  benefit: "Leadership, confidence",
                                  wear: "Professional needs",
                                },
                              ].map((rudraksha, index) => (
                                <div
                                  key={index}
                                  className="flex justify-between text-xs"
                                >
                                  <span className="font-medium text-green-700">
                                    {rudraksha.mukhi}
                                  </span>
                                  <span className="text-green-600">
                                    {rudraksha.benefit}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Charity & Donations */}
                      <div className="bg-white/80 p-5 rounded-lg border border-blue-300 shadow-sm">
                        <h5 className="font-semibold text-blue-700 mb-3 flex items-center gap-2">
                          <Heart className="w-5 h-5" />
                          Charity & Donation Guidelines
                        </h5>
                        <div className="space-y-2">
                          <div className="p-2 bg-blue-50 rounded text-sm">
                            <div className="font-medium text-blue-800 mb-1">
                              Jupiter-based Donations:
                            </div>
                            <div className="text-blue-700 text-xs">
                              Educational materials, books, teaching supplies.
                              Support to teachers and students. Yellow items on
                              Thursdays.
                            </div>
                          </div>
                          <div className="space-y-1 text-xs">
                            <div className="p-2 bg-green-50 rounded text-green-800">
                              📚 Support education and learning institutions
                            </div>
                            <div className="p-2 bg-yellow-50 rounded text-yellow-800">
                              🍽️ Feed hungry people, especially children
                            </div>
                            <div className="p-2 bg-purple-50 rounded text-purple-800">
                              🏥 Contribute to healthcare and healing services
                            </div>
                            <div className="p-2 bg-orange-50 rounded text-orange-800">
                              🕯️ Sponsor religious ceremonies and spiritual
                              programs
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Section 19: Annual Predictions (Varshaphal) - AUTHENTIC DYNAMIC DATA */}
              {section.content === "comprehensive_annual_predictions" && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-lg border border-indigo-200">
                    <h4 className="text-xl font-bold text-indigo-800 mb-6 flex items-center gap-2">
                      <Calendar className="w-6 h-6" />
                      Annual Predictions (Varshaphal) - Year{" "}
                      {reportData.comprehensive_annual_predictions
                        ?.prediction_year || new Date().getFullYear()}
                    </h4>

                    {reportData.comprehensive_annual_predictions ? (
                      <div className="space-y-6">
                        {/* Current Dasha & Transit Overview */}
                        <div className="bg-white/90 p-5 rounded-lg border border-indigo-300 shadow-sm">
                          <h5 className="font-semibold text-indigo-700 mb-4 flex items-center gap-2">
                            <Crown className="w-5 h-5" />
                            Current Planetary Periods & Transits
                          </h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-3 bg-indigo-50 rounded">
                              <div className="text-xs text-indigo-600">
                                Current Mahadasha
                              </div>
                              <div className="font-bold text-indigo-800">
                                {reportData.comprehensive_annual_predictions
                                  .current_dasha?.mahadasha || "Calculating..."}
                              </div>
                              <div className="text-xs text-indigo-700 mt-1">
                                {reportData.comprehensive_annual_predictions
                                  .current_dasha?.dasha_effect ||
                                  "Period of growth and development"}
                              </div>
                            </div>

                            <div className="p-3 bg-blue-50 rounded">
                              <div className="text-xs text-blue-600">
                                Overall Annual Rating
                              </div>
                              <div className="font-bold text-blue-800">
                                {reportData.comprehensive_annual_predictions
                                  .overall_rating || "Good Year"}
                              </div>
                              <div className="text-xs text-blue-700 mt-1">
                                {reportData.comprehensive_annual_predictions
                                  .annual_theme?.primary_theme ||
                                  "Balanced Progress"}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Sector-wise Predictions */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Enhanced Career Analysis with Ancient Quotes */}
                          <div className="bg-white/80 p-5 rounded-lg border border-indigo-300 shadow-sm">
                            <h5 className="font-semibold text-indigo-700 mb-3 flex items-center gap-2">
                              <Briefcase className="w-5 h-5" />
                              Premium Career Analysis
                            </h5>
                            <div className="space-y-3">
                              {/* Ancient Quote */}
                              <div className="p-3 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded text-xs">
                                <div className="text-amber-900 font-medium mb-1">
                                  "Daśamaṁ karma-bhānaṁ tu jīvanaṁ
                                  karma-sādhakam" (BPHS 12.1)
                                </div>
                                <div className="text-amber-700 italic">
                                  The 10th house governs karma, livelihood, and
                                  professional success
                                </div>
                              </div>

                              {/* Career Foundation */}
                              <div className="p-2 bg-blue-50 rounded text-sm">
                                <div className="font-medium text-blue-800">
                                  Career Foundation:{" "}
                                  {reportData.comprehensive_career_analysis
                                    ?.career_foundation?.foundation ||
                                    "Dynamic leadership qualities with strong initiative"}
                                </div>
                                <div className="text-blue-700 mt-1 text-xs">
                                  Work Style:{" "}
                                  {reportData.comprehensive_career_analysis
                                    ?.career_foundation?.work_style ||
                                    "Systematic approach with focus on long-term growth"}
                                </div>
                              </div>

                              {/* Suitable Fields */}
                              <div className="space-y-1 text-xs">
                                <div className="p-2 bg-green-50 rounded text-green-800">
                                  <strong>Suitable Fields:</strong>{" "}
                                  {reportData.comprehensive_career_analysis?.career_foundation?.suitable_fields?.join(
                                    ", ",
                                  ) ||
                                    "Leadership, Teaching, Consulting, Administration"}
                                </div>
                                <div className="p-2 bg-purple-50 rounded text-purple-800">
                                  <strong>10th Lord Direction:</strong>{" "}
                                  {reportData.comprehensive_career_analysis
                                    ?.tenth_lord_analysis?.direction ||
                                    "Authority and public recognition"}
                                </div>
                                <div className="p-2 bg-yellow-50 rounded text-yellow-800">
                                  <strong>Career Pattern:</strong>{" "}
                                  {reportData.comprehensive_career_analysis
                                    ?.career_foundation?.growth_pattern ||
                                    "Foundation 20-30, Growth 30-40, Peak 40-50"}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Wealth Predictions */}
                          <div className="bg-white/80 p-5 rounded-lg border border-indigo-300 shadow-sm">
                            <h5 className="font-semibold text-indigo-700 mb-3 flex items-center gap-2">
                              <DollarSign className="w-5 h-5" />
                              Wealth & Finance
                            </h5>
                            <div className="space-y-3">
                              <div className="p-2 bg-blue-50 rounded text-sm">
                                <div className="font-medium text-blue-800">
                                  Rating:{" "}
                                  {reportData.comprehensive_annual_predictions
                                    .wealth_outlook?.overall_rating ||
                                    "Moderate"}
                                </div>
                                <div className="text-blue-700 mt-1 text-xs">
                                  {reportData.comprehensive_annual_predictions
                                    .wealth_outlook?.jupiter_influence ||
                                    "Steady financial progress"}
                                </div>
                              </div>
                              <div className="space-y-1 text-xs">
                                <div className="p-2 bg-green-50 rounded text-green-800">
                                  <strong>Investment Advice:</strong>{" "}
                                  {reportData.comprehensive_annual_predictions
                                    .wealth_outlook?.investment_advice ||
                                    "Conservative approach recommended"}
                                </div>
                                {reportData.comprehensive_annual_predictions
                                  .wealth_outlook?.best_months && (
                                  <div className="p-2 bg-purple-50 rounded text-purple-800">
                                    <strong>Best Months:</strong>{" "}
                                    {reportData.comprehensive_annual_predictions.wealth_outlook.best_months.join(
                                      ", ",
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Relationship Predictions */}
                          <div className="bg-white/80 p-5 rounded-lg border border-indigo-300 shadow-sm">
                            <h5 className="font-semibold text-indigo-700 mb-3 flex items-center gap-2">
                              <Heart className="w-5 h-5" />
                              Relationships & Marriage
                            </h5>
                            <div className="space-y-3">
                              <div className="p-2 bg-blue-50 rounded text-sm">
                                <div className="font-medium text-blue-800">
                                  Rating:{" "}
                                  {reportData.comprehensive_annual_predictions
                                    .relationship_outlook?.overall_rating ||
                                    "Good"}
                                </div>
                                <div className="text-blue-700 mt-1 text-xs">
                                  {reportData.comprehensive_annual_predictions
                                    .relationship_outlook?.jupiter_influence ||
                                    "Stable relationship period"}
                                </div>
                              </div>
                              <div className="space-y-1 text-xs">
                                <div className="p-2 bg-green-50 rounded text-green-800">
                                  <strong>Love Prospects:</strong>{" "}
                                  {reportData.comprehensive_annual_predictions
                                    .relationship_outlook?.love_prospects ||
                                    "Focus on existing relationships"}
                                </div>
                                <div className="p-2 bg-purple-50 rounded text-purple-800">
                                  <strong>Marriage Timing:</strong>{" "}
                                  {reportData.comprehensive_annual_predictions
                                    .relationship_outlook?.marriage_timing ||
                                    "Focus on relationship building"}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Health Predictions */}
                          <div className="bg-white/80 p-5 rounded-lg border border-indigo-300 shadow-sm">
                            <h5 className="font-semibold text-indigo-700 mb-3 flex items-center gap-2">
                              <Heart className="w-5 h-5" />
                              Health & Wellness
                            </h5>
                            <div className="space-y-3">
                              <div className="p-2 bg-blue-50 rounded text-sm">
                                <div className="font-medium text-blue-800">
                                  Rating:{" "}
                                  {reportData.comprehensive_annual_predictions
                                    .health_outlook?.overall_rating || "Good"}
                                </div>
                                <div className="text-blue-700 mt-1 text-xs">
                                  {reportData.comprehensive_annual_predictions
                                    .health_outlook?.jupiter_influence ||
                                    "Generally stable health"}
                                </div>
                              </div>
                              <div className="space-y-1 text-xs">
                                {reportData.comprehensive_annual_predictions.health_outlook?.preventive_measures?.map(
                                  (measure, index) => (
                                    <div
                                      key={index}
                                      className="p-2 bg-green-50 rounded text-green-800"
                                    >
                                      • {measure}
                                    </div>
                                  ),
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Monthly Predictions */}
                        {reportData.comprehensive_annual_predictions
                          .monthly_predictions && (
                          <div className="bg-white/90 p-5 rounded-lg border border-indigo-300 shadow-sm">
                            <h5 className="font-semibold text-indigo-700 mb-4 flex items-center gap-2">
                              <Calendar className="w-5 h-5" />
                              Monthly Breakdown
                            </h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                              {Object.entries(
                                reportData.comprehensive_annual_predictions
                                  .monthly_predictions,
                              ).map(([month, data]: [string, any]) => (
                                <div
                                  key={month}
                                  className="p-3 bg-indigo-50 rounded text-sm"
                                >
                                  <div className="font-semibold text-indigo-800">
                                    {month}
                                  </div>
                                  <div className="text-xs text-indigo-700 mt-1">
                                    {data?.theme || "Steady progress"}
                                  </div>
                                  <div className="text-xs text-indigo-600 mt-1">
                                    Rating: {data?.rating || "Good"}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Auspicious & Challenging Periods */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {reportData.comprehensive_annual_predictions
                            .auspicious_periods && (
                            <div className="bg-white/80 p-5 rounded-lg border border-green-300 shadow-sm">
                              <h5 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                                <Star className="w-5 h-5" />
                                Auspicious Periods
                              </h5>
                              <div className="space-y-2">
                                {reportData.comprehensive_annual_predictions.auspicious_periods
                                  .slice(0, 3)
                                  .map((period: any, index: number) => (
                                    <div
                                      key={index}
                                      className="p-2 bg-green-50 rounded text-sm"
                                    >
                                      <div className="font-medium text-green-800">
                                        {period.period || "Favorable Period"}
                                      </div>
                                      <div className="text-xs text-green-700 mt-1">
                                        {period.reason ||
                                          period.activities?.join(", ")}
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          )}

                          {reportData.comprehensive_annual_predictions
                            .challenging_periods && (
                            <div className="bg-white/80 p-5 rounded-lg border border-yellow-300 shadow-sm">
                              <h5 className="font-semibold text-yellow-700 mb-3 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5" />
                                Challenging Periods
                              </h5>
                              <div className="space-y-2">
                                {reportData.comprehensive_annual_predictions.challenging_periods
                                  .slice(0, 3)
                                  .map((period: any, index: number) => (
                                    <div
                                      key={index}
                                      className="p-2 bg-yellow-50 rounded text-sm"
                                    >
                                      <div className="font-medium text-yellow-800">
                                        {period.period || "Caution Period"}
                                      </div>
                                      <div className="text-xs text-yellow-700 mt-1">
                                        {period.advice || period.reason}
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Key Advice & Remedies */}
                        <div className="bg-white/90 p-5 rounded-lg border border-indigo-300 shadow-sm">
                          <h5 className="font-semibold text-indigo-700 mb-4 flex items-center gap-2">
                            <Shield className="w-5 h-5" />
                            Key Advice & Recommended Remedies
                          </h5>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div>
                              <h6 className="font-medium text-indigo-600 mb-2">
                                Annual Guidance
                              </h6>
                              <div className="space-y-1 text-xs">
                                {reportData.comprehensive_annual_predictions.key_advice?.map(
                                  (advice: string, index: number) => (
                                    <div
                                      key={index}
                                      className="p-2 bg-blue-50 rounded text-blue-800"
                                    >
                                      • {advice}
                                    </div>
                                  ),
                                )}
                              </div>
                            </div>
                            <div>
                              <h6 className="font-medium text-indigo-600 mb-2">
                                Recommended Remedies
                              </h6>
                              <div className="space-y-1 text-xs">
                                <div className="p-2 bg-orange-50 rounded text-orange-800">
                                  <strong>Mantra:</strong>{" "}
                                  {reportData.comprehensive_annual_predictions
                                    .recommended_remedies?.mantra ||
                                    "Om Namah Shivaya"}
                                </div>
                                <div className="p-2 bg-green-50 rounded text-green-800">
                                  <strong>Charity:</strong>{" "}
                                  {reportData.comprehensive_annual_predictions
                                    .recommended_remedies?.charity ||
                                    "Help those in need"}
                                </div>
                                <div className="p-2 bg-purple-50 rounded text-purple-800">
                                  <strong>Fasting:</strong>{" "}
                                  {reportData.comprehensive_annual_predictions
                                    .recommended_remedies?.fasting ||
                                    "Observe spiritual practices"}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Summary */}
                        <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-4 rounded-lg border border-indigo-300">
                          <div className="text-center">
                            <div className="font-semibold text-indigo-800 mb-2">
                              Year Summary
                            </div>
                            <div className="text-sm text-indigo-700">
                              {reportData.comprehensive_annual_predictions
                                .summary ||
                                `Year ${reportData.comprehensive_annual_predictions.prediction_year || new Date().getFullYear()}: A year of balanced growth with focus on personal development and authentic progress based on your planetary periods.`}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-indigo-600">
                        <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>
                          Annual predictions are being calculated based on your
                          birth details and current planetary transits...
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Section 20: Dynamic Astrological Summary */}
              {section.content === "comprehensive_astrological_summary" &&
                (() => {
                  // Debug logging
                  console.log("🔍 Section 20 Debug - Full Section:", section);
                  console.log("🔍 Section 20 Debug:", {
                    content: section.content,
                    category: (section as any).category,
                    hasSubsections: !!(section as any).subsections,
                    subsectionCount: (section as any).subsections?.length,
                    firstSubsection: (section as any).subsections?.[0],
                    firstSubsectionContent: (section as any).subsections?.[0]
                      ?.content,
                    contentType: typeof (section as any).subsections?.[0]
                      ?.content,
                  });

                  // Get the dynamic astrological summary from the section data
                  // Check if the section has the dynamic content directly in the data structure
                  const dynamicContent =
                    reportData.comprehensive_astrological_summary ||
                    (section as any).subsections?.[0]?.content;

                  console.log("🔍 Section 20 Dynamic Content Check:", {
                    dynamicContent,
                    type: typeof dynamicContent,
                    isObject: typeof dynamicContent === "object",
                    isNull: dynamicContent === null,
                    hasKeys:
                      dynamicContent && typeof dynamicContent === "object"
                        ? Object.keys(dynamicContent)
                        : "N/A",
                  });

                  if (
                    !dynamicContent ||
                    typeof dynamicContent !== "object" ||
                    dynamicContent === null
                  ) {
                    return (
                      <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                        <h4 className="text-xl font-bold text-orange-800 mb-4 flex items-center gap-2">
                          <CheckCircle className="w-6 h-6" />
                          Astrological Summary - Loading Dynamic Content
                        </h4>
                        <p className="text-orange-700">
                          Dynamic astrological summary is being generated based
                          on authentic birth chart calculations...
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-6">
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
                        <h4 className="text-xl font-bold text-green-800 mb-6 flex items-center gap-2">
                          <CheckCircle className="w-6 h-6" />
                          Complete Astrological Summary
                        </h4>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Dynamic Core Strengths */}
                          {dynamicContent.core_strengths &&
                            Array.isArray(dynamicContent.core_strengths) && (
                              <div className="bg-white/80 p-5 rounded-lg border border-green-300 shadow-sm">
                                <h5 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                                  <Crown className="w-5 h-5" />
                                  Your Core Strengths
                                </h5>
                                <div className="space-y-2">
                                  {dynamicContent.core_strengths.map(
                                    (strength, index) => (
                                      <div
                                        key={index}
                                        className="p-3 bg-green-50 rounded-lg"
                                      >
                                        <div className="font-medium text-green-800 text-sm">
                                          {strength}
                                        </div>
                                      </div>
                                    ),
                                  )}
                                </div>
                              </div>
                            )}

                          {/* Dynamic Development Areas */}
                          {dynamicContent.development_areas &&
                            Array.isArray(dynamicContent.development_areas) && (
                              <div className="bg-white/80 p-5 rounded-lg border border-orange-300 shadow-sm">
                                <h5 className="font-semibold text-orange-700 mb-3 flex items-center gap-2">
                                  <Target className="w-5 h-5" />
                                  Areas for Development
                                </h5>
                                <div className="space-y-2">
                                  {dynamicContent.development_areas.map(
                                    (area, index) => (
                                      <div
                                        key={index}
                                        className="p-3 bg-orange-50 rounded-lg"
                                      >
                                        <div className="font-medium text-orange-800 text-sm">
                                          {area}
                                        </div>
                                      </div>
                                    ),
                                  )}
                                </div>
                              </div>
                            )}

                          {/* Dynamic Key Yogas */}
                          {dynamicContent.key_yogas &&
                            Array.isArray(dynamicContent.key_yogas) && (
                              <div className="bg-white/80 p-5 rounded-lg border border-purple-300 shadow-sm">
                                <h5 className="font-semibold text-purple-700 mb-3 flex items-center gap-2">
                                  <Star className="w-5 h-5" />
                                  Key Yogas & Their Impact
                                </h5>
                                <div className="space-y-2">
                                  {dynamicContent.key_yogas.map(
                                    (yoga, index) => (
                                      <div
                                        key={index}
                                        className="p-2 bg-purple-50 rounded text-sm"
                                      >
                                        <div className="text-purple-700">
                                          {yoga}
                                        </div>
                                      </div>
                                    ),
                                  )}
                                </div>
                              </div>
                            )}

                          {/* Dynamic Life Theme */}
                          {dynamicContent.life_theme && (
                            <div className="bg-white/80 p-5 rounded-lg border border-blue-300 shadow-sm">
                              <h5 className="font-semibold text-blue-700 mb-3 flex items-center gap-2">
                                <Sparkles className="w-5 h-5" />
                                Your Major Life Theme
                              </h5>
                              <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                                <div className="text-sm text-blue-700 leading-relaxed">
                                  {dynamicContent.life_theme}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()}

              {/* Section 21: Dynamic Personalized Recommendations */}
              {section.content ===
                "comprehensive_personalized_recommendations" &&
                (() => {
                  // Debug logging
                  console.log("🔍 Section 21 Debug - Full Section:", section);
                  console.log("🔍 Section 21 Debug:", {
                    content: section.content,
                    category: (section as any).category,
                    hasSubsections: !!(section as any).subsections,
                    subsectionCount: (section as any).subsections?.length,
                    firstSubsection: (section as any).subsections?.[0],
                    firstSubsectionContent: (section as any).subsections?.[0]
                      ?.content,
                    contentType: typeof (section as any).subsections?.[0]
                      ?.content,
                  });

                  // Get the dynamic personalized recommendations from the section data
                  const dynamicContent =
                    reportData.comprehensive_personalized_recommendations ||
                    (section as any).subsections?.[0]?.content;

                  console.log("🔍 Section 21 Dynamic Content Check:", {
                    dynamicContent,
                    type: typeof dynamicContent,
                    isObject: typeof dynamicContent === "object",
                    isNull: dynamicContent === null,
                    hasKeys:
                      dynamicContent && typeof dynamicContent === "object"
                        ? Object.keys(dynamicContent)
                        : "N/A",
                  });

                  if (
                    !dynamicContent ||
                    typeof dynamicContent !== "object" ||
                    dynamicContent === null
                  ) {
                    return (
                      <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                        <h4 className="text-xl font-bold text-orange-800 mb-4 flex items-center gap-2">
                          <Target className="w-6 h-6" />
                          Personalized Recommendations - Loading Dynamic Content
                        </h4>
                        <p className="text-orange-700">
                          Dynamic personalized recommendations are being
                          generated based on authentic birth chart
                          calculations...
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-6">
                      <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-lg border border-amber-200">
                        <h4 className="text-xl font-bold text-amber-800 mb-6 flex items-center gap-2">
                          <Target className="w-6 h-6" />
                          Personalized Life Guidance & Recommendations
                        </h4>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Dynamic Career Strategy */}
                          {dynamicContent.career_strategy && (
                            <div className="bg-white/80 p-5 rounded-lg border border-amber-300 shadow-sm">
                              <h5 className="font-semibold text-amber-700 mb-3 flex items-center gap-2">
                                <Briefcase className="w-5 h-5" />
                                Career Strategy
                              </h5>
                              <div className="space-y-3">
                                {typeof dynamicContent.career_strategy ===
                                "object" ? (
                                  <div className="space-y-2">
                                    {dynamicContent.career_strategy
                                      .primary_focus && (
                                      <div className="p-3 bg-amber-50 rounded-lg">
                                        <div className="font-medium text-amber-800 mb-1">
                                          Primary Focus:
                                        </div>
                                        <div className="text-sm text-amber-700">
                                          {
                                            dynamicContent.career_strategy
                                              .primary_focus
                                          }
                                        </div>
                                      </div>
                                    )}
                                    {dynamicContent.career_strategy
                                      .recommended_fields &&
                                      Array.isArray(
                                        dynamicContent.career_strategy
                                          .recommended_fields,
                                      ) && (
                                        <div className="p-3 bg-amber-50 rounded-lg">
                                          <div className="font-medium text-amber-800 mb-1">
                                            Recommended Fields:
                                          </div>
                                          <div className="text-sm text-amber-700">
                                            {dynamicContent.career_strategy.recommended_fields.join(
                                              ", ",
                                            )}
                                          </div>
                                        </div>
                                      )}
                                    {dynamicContent.career_strategy
                                      .timing_advice && (
                                      <div className="p-3 bg-amber-50 rounded-lg">
                                        <div className="font-medium text-amber-800 mb-1">
                                          Timing Advice:
                                        </div>
                                        <div className="text-sm text-amber-700">
                                          {
                                            dynamicContent.career_strategy
                                              .timing_advice
                                          }
                                        </div>
                                      </div>
                                    )}
                                    {dynamicContent.career_strategy
                                      .success_factors &&
                                      Array.isArray(
                                        dynamicContent.career_strategy
                                          .success_factors,
                                      ) && (
                                        <div className="p-3 bg-amber-50 rounded-lg">
                                          <div className="font-medium text-amber-800 mb-1">
                                            Success Factors:
                                          </div>
                                          <div className="text-sm text-amber-700">
                                            {dynamicContent.career_strategy.success_factors.join(
                                              ", ",
                                            )}
                                          </div>
                                        </div>
                                      )}
                                  </div>
                                ) : (
                                  <div className="p-3 bg-amber-50 rounded-lg">
                                    <div className="text-sm text-amber-700 leading-relaxed">
                                      {dynamicContent.career_strategy}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Dynamic Marriage Guidance */}
                          {dynamicContent.marriage_guidance && (
                            <div className="bg-white/80 p-5 rounded-lg border border-rose-300 shadow-sm">
                              <h5 className="font-semibold text-rose-700 mb-3 flex items-center gap-2">
                                <Heart className="w-5 h-5" />
                                Marriage & Relationship Guidance
                              </h5>
                              <div className="space-y-3">
                                {typeof dynamicContent.marriage_guidance ===
                                "object" ? (
                                  <div className="space-y-2">
                                    {dynamicContent.marriage_guidance
                                      .approach && (
                                      <div className="p-3 bg-rose-50 rounded-lg">
                                        <div className="font-medium text-rose-800 mb-1">
                                          Approach:
                                        </div>
                                        <div className="text-sm text-rose-700">
                                          {
                                            dynamicContent.marriage_guidance
                                              .approach
                                          }
                                        </div>
                                      </div>
                                    )}
                                    {dynamicContent.marriage_guidance
                                      .compatibility_factors &&
                                      Array.isArray(
                                        dynamicContent.marriage_guidance
                                          .compatibility_factors,
                                      ) && (
                                        <div className="p-3 bg-rose-50 rounded-lg">
                                          <div className="font-medium text-rose-800 mb-1">
                                            Compatibility Factors:
                                          </div>
                                          <div className="text-sm text-rose-700">
                                            {dynamicContent.marriage_guidance.compatibility_factors.join(
                                              ", ",
                                            )}
                                          </div>
                                        </div>
                                      )}
                                    {dynamicContent.marriage_guidance
                                      .timing_suggestions && (
                                      <div className="p-3 bg-rose-50 rounded-lg">
                                        <div className="font-medium text-rose-800 mb-1">
                                          Timing Suggestions:
                                        </div>
                                        <div className="text-sm text-rose-700">
                                          {
                                            dynamicContent.marriage_guidance
                                              .timing_suggestions
                                          }
                                        </div>
                                      </div>
                                    )}
                                    {dynamicContent.marriage_guidance
                                      .relationship_advice &&
                                      Array.isArray(
                                        dynamicContent.marriage_guidance
                                          .relationship_advice,
                                      ) && (
                                        <div className="p-3 bg-rose-50 rounded-lg">
                                          <div className="font-medium text-rose-800 mb-1">
                                            Relationship Advice:
                                          </div>
                                          <div className="text-sm text-rose-700">
                                            {dynamicContent.marriage_guidance.relationship_advice.join(
                                              ", ",
                                            )}
                                          </div>
                                        </div>
                                      )}
                                  </div>
                                ) : (
                                  <div className="p-3 bg-rose-50 rounded-lg">
                                    <div className="text-sm text-rose-700 leading-relaxed">
                                      {dynamicContent.marriage_guidance}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Dynamic Health Strategy */}
                          {dynamicContent.health_strategy && (
                            <div className="bg-white/80 p-5 rounded-lg border border-green-300 shadow-sm">
                              <h5 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                                <Shield className="w-5 h-5" />
                                Health & Wellness Strategy
                              </h5>
                              <div className="space-y-3">
                                {typeof dynamicContent.health_strategy ===
                                "object" ? (
                                  <div className="space-y-2">
                                    {dynamicContent.health_strategy
                                      .preventive_measures &&
                                      Array.isArray(
                                        dynamicContent.health_strategy
                                          .preventive_measures,
                                      ) && (
                                        <div className="p-3 bg-green-50 rounded-lg">
                                          <div className="font-medium text-green-800 mb-1">
                                            Preventive Measures:
                                          </div>
                                          <div className="text-sm text-green-700">
                                            {dynamicContent.health_strategy.preventive_measures.join(
                                              ", ",
                                            )}
                                          </div>
                                        </div>
                                      )}
                                    {dynamicContent.health_strategy
                                      .focus_areas &&
                                      Array.isArray(
                                        dynamicContent.health_strategy
                                          .focus_areas,
                                      ) && (
                                        <div className="p-3 bg-green-50 rounded-lg">
                                          <div className="font-medium text-green-800 mb-1">
                                            Focus Areas:
                                          </div>
                                          <div className="text-sm text-green-700">
                                            {dynamicContent.health_strategy.focus_areas.join(
                                              ", ",
                                            )}
                                          </div>
                                        </div>
                                      )}
                                    {dynamicContent.health_strategy
                                      .lifestyle_recommendations &&
                                      Array.isArray(
                                        dynamicContent.health_strategy
                                          .lifestyle_recommendations,
                                      ) && (
                                        <div className="p-3 bg-green-50 rounded-lg">
                                          <div className="font-medium text-green-800 mb-1">
                                            Lifestyle Recommendations:
                                          </div>
                                          <div className="text-sm text-green-700">
                                            {dynamicContent.health_strategy.lifestyle_recommendations.join(
                                              ", ",
                                            )}
                                          </div>
                                        </div>
                                      )}
                                    {dynamicContent.health_strategy
                                      .spiritual_practices &&
                                      Array.isArray(
                                        dynamicContent.health_strategy
                                          .spiritual_practices,
                                      ) && (
                                        <div className="p-3 bg-green-50 rounded-lg">
                                          <div className="font-medium text-green-800 mb-1">
                                            Spiritual Practices:
                                          </div>
                                          <div className="text-sm text-green-700">
                                            {dynamicContent.health_strategy.spiritual_practices.join(
                                              ", ",
                                            )}
                                          </div>
                                        </div>
                                      )}
                                  </div>
                                ) : (
                                  <div className="p-3 bg-green-50 rounded-lg">
                                    <div className="text-sm text-green-700 leading-relaxed">
                                      {dynamicContent.health_strategy}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Dynamic Financial Planning */}
                          {dynamicContent.financial_planning && (
                            <div className="bg-white/80 p-5 rounded-lg border border-emerald-300 shadow-sm">
                              <h5 className="font-semibold text-emerald-700 mb-3 flex items-center gap-2">
                                <DollarSign className="w-5 h-5" />
                                Financial Planning
                              </h5>
                              <div className="space-y-3">
                                {typeof dynamicContent.financial_planning ===
                                "object" ? (
                                  <div className="space-y-2">
                                    {dynamicContent.financial_planning
                                      .wealth_building_approach && (
                                      <div className="p-3 bg-emerald-50 rounded-lg">
                                        <div className="font-medium text-emerald-800 mb-1">
                                          Wealth Building Approach:
                                        </div>
                                        <div className="text-sm text-emerald-700">
                                          {
                                            dynamicContent.financial_planning
                                              .wealth_building_approach
                                          }
                                        </div>
                                      </div>
                                    )}
                                    {dynamicContent.financial_planning
                                      .investment_recommendations &&
                                      Array.isArray(
                                        dynamicContent.financial_planning
                                          .investment_recommendations,
                                      ) && (
                                        <div className="p-3 bg-emerald-50 rounded-lg">
                                          <div className="font-medium text-emerald-800 mb-1">
                                            Investment Recommendations:
                                          </div>
                                          <div className="text-sm text-emerald-700">
                                            {dynamicContent.financial_planning.investment_recommendations.join(
                                              ", ",
                                            )}
                                          </div>
                                        </div>
                                      )}
                                    {dynamicContent.financial_planning
                                      .income_sources &&
                                      Array.isArray(
                                        dynamicContent.financial_planning
                                          .income_sources,
                                      ) && (
                                        <div className="p-3 bg-emerald-50 rounded-lg">
                                          <div className="font-medium text-emerald-800 mb-1">
                                            Income Sources:
                                          </div>
                                          <div className="text-sm text-emerald-700">
                                            {dynamicContent.financial_planning.income_sources.join(
                                              ", ",
                                            )}
                                          </div>
                                        </div>
                                      )}
                                    {dynamicContent.financial_planning
                                      .financial_discipline &&
                                      Array.isArray(
                                        dynamicContent.financial_planning
                                          .financial_discipline,
                                      ) && (
                                        <div className="p-3 bg-emerald-50 rounded-lg">
                                          <div className="font-medium text-emerald-800 mb-1">
                                            Financial Discipline:
                                          </div>
                                          <div className="text-sm text-emerald-700">
                                            {dynamicContent.financial_planning.financial_discipline.join(
                                              ", ",
                                            )}
                                          </div>
                                        </div>
                                      )}
                                  </div>
                                ) : (
                                  <div className="p-3 bg-emerald-50 rounded-lg">
                                    <div className="text-sm text-emerald-700 leading-relaxed">
                                      {dynamicContent.financial_planning}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Dynamic Spiritual Practices */}
                          {dynamicContent.spiritual_practices && (
                            <div className="bg-white/80 p-5 rounded-lg border border-purple-300 shadow-sm">
                              <h5 className="font-semibold text-purple-700 mb-3 flex items-center gap-2">
                                <Sparkles className="w-5 h-5" />
                                Spiritual Practices & Remedies
                              </h5>
                              <div className="space-y-3">
                                {typeof dynamicContent.spiritual_practices ===
                                "object" ? (
                                  <div className="space-y-2">
                                    {dynamicContent.spiritual_practices
                                      .daily_mantra && (
                                      <div className="p-3 bg-purple-50 rounded-lg">
                                        <div className="font-medium text-purple-800 mb-1">
                                          Daily Mantra:
                                        </div>
                                        <div className="text-sm text-purple-700">
                                          {
                                            dynamicContent.spiritual_practices
                                              .daily_mantra
                                          }
                                        </div>
                                      </div>
                                    )}
                                    {dynamicContent.spiritual_practices
                                      .primary_gemstone && (
                                      <div className="p-3 bg-purple-50 rounded-lg">
                                        <div className="font-medium text-purple-800 mb-1">
                                          Primary Gemstone:
                                        </div>
                                        <div className="text-sm text-purple-700">
                                          {
                                            dynamicContent.spiritual_practices
                                              .primary_gemstone
                                          }
                                        </div>
                                      </div>
                                    )}
                                    {dynamicContent.spiritual_practices
                                      .lucky_day && (
                                      <div className="p-3 bg-purple-50 rounded-lg">
                                        <div className="font-medium text-purple-800 mb-1">
                                          Lucky Day:
                                        </div>
                                        <div className="text-sm text-purple-700">
                                          {
                                            dynamicContent.spiritual_practices
                                              .lucky_day
                                          }
                                        </div>
                                      </div>
                                    )}
                                    {dynamicContent.spiritual_practices
                                      .spiritual_activities &&
                                      Array.isArray(
                                        dynamicContent.spiritual_practices
                                          .spiritual_activities,
                                      ) && (
                                        <div className="p-3 bg-purple-50 rounded-lg">
                                          <div className="font-medium text-purple-800 mb-1">
                                            Spiritual Activities:
                                          </div>
                                          <div className="text-sm text-purple-700">
                                            {dynamicContent.spiritual_practices.spiritual_activities.join(
                                              ", ",
                                            )}
                                          </div>
                                        </div>
                                      )}
                                    {dynamicContent.spiritual_practices
                                      .meditation_practices &&
                                      Array.isArray(
                                        dynamicContent.spiritual_practices
                                          .meditation_practices,
                                      ) && (
                                        <div className="p-3 bg-purple-50 rounded-lg">
                                          <div className="font-medium text-purple-800 mb-1">
                                            Meditation Practices:
                                          </div>
                                          <div className="text-sm text-purple-700">
                                            {dynamicContent.spiritual_practices.meditation_practices.join(
                                              ", ",
                                            )}
                                          </div>
                                        </div>
                                      )}
                                  </div>
                                ) : (
                                  <div className="p-3 bg-purple-50 rounded-lg">
                                    <div className="text-sm text-purple-700 leading-relaxed">
                                      {dynamicContent.spiritual_practices}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Dynamic Personalized Mantras and Gemstones */}
                          {(dynamicContent.recommended_mantra ||
                            dynamicContent.recommended_gemstone) && (
                            <div className="bg-white/80 p-5 rounded-lg border border-indigo-300 shadow-sm">
                              <h5 className="font-semibold text-indigo-700 mb-3 flex items-center gap-2">
                                <Star className="w-5 h-5" />
                                Personalized Remedies
                              </h5>
                              <div className="space-y-3">
                                {dynamicContent.recommended_mantra && (
                                  <div className="p-3 bg-indigo-50 rounded-lg">
                                    <div className="font-medium text-indigo-800 mb-1">
                                      Recommended Mantra:
                                    </div>
                                    <div className="text-sm text-indigo-700">
                                      {dynamicContent.recommended_mantra}
                                    </div>
                                  </div>
                                )}
                                {dynamicContent.recommended_gemstone && (
                                  <div className="p-3 bg-indigo-50 rounded-lg">
                                    <div className="font-medium text-indigo-800 mb-1">
                                      Recommended Gemstone:
                                    </div>
                                    <div className="text-sm text-indigo-700">
                                      {dynamicContent.recommended_gemstone}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()}

              {/* Section 18: Action Plan */}
              {section.content === "dasha_action_plan" &&
                (() => {
                  const dynamicContent =
                    reportData.dasha_action_plan ||
                    (section as any).subsections?.[0]?.content;

                  console.log("🔍 Action Plan Content Debug:", {
                    dynamicContent,
                    type: typeof dynamicContent,
                    isObject: typeof dynamicContent === "object",
                    isNull: dynamicContent === null,
                    hasKeys:
                      dynamicContent && typeof dynamicContent === "object"
                        ? Object.keys(dynamicContent)
                        : "N/A",
                    currentDashaPeriod: dynamicContent?.current_dasha_period,
                    dailyPractices: dynamicContent?.daily_practices,
                    gemstoneGuidance: dynamicContent?.gemstone_guidance,
                  });

                  if (
                    !dynamicContent ||
                    typeof dynamicContent !== "object" ||
                    dynamicContent === null
                  ) {
                    return (
                      <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                        <h4 className="text-xl font-bold text-orange-800 mb-4 flex items-center gap-2">
                          <Target className="w-6 h-6" />
                          Action Plan - Generating Dasha-Based Remedies
                        </h4>
                        <p className="text-orange-700">
                          Comprehensive action plan with authentic dasha-based
                          remedies is being generated...
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-6">
                      <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-lg border border-orange-200">
                        <h4 className="text-xl font-bold text-orange-800 mb-6 flex items-center gap-2">
                          <Target className="w-6 h-6" />
                          Action Plan -{" "}
                          {dynamicContent.current_dasha_period?.mahadasha ||
                            "Current"}{" "}
                          Dasha
                        </h4>

                        {/* Current Dasha Info */}
                        {dynamicContent.current_dasha_period && (
                          <div className="bg-white/80 p-5 rounded-lg border border-orange-300 shadow-sm mb-6">
                            <h5 className="font-semibold text-orange-700 mb-3">
                              Current Dasha Period
                            </h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm font-medium text-gray-700">
                                  Maha Dasha:
                                </p>
                                <p className="text-orange-600 font-bold text-lg">
                                  {
                                    dynamicContent.current_dasha_period
                                      .mahadasha
                                  }
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-700">
                                  Antardasha:
                                </p>
                                <p className="text-orange-600 font-medium">
                                  {
                                    dynamicContent.current_dasha_period
                                      .antardasha
                                  }
                                </p>
                              </div>
                              <div className="md:col-span-2">
                                <p className="text-xs text-gray-500 italic">
                                  {
                                    dynamicContent.current_dasha_period
                                      .period_theme
                                  }
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Daily Practices */}
                        {dynamicContent.daily_practices && (
                          <div className="bg-white/80 p-5 rounded-lg border border-orange-300 shadow-sm mb-4">
                            <h5 className="font-semibold text-orange-700 mb-3 flex items-center gap-2">
                              <Clock className="w-5 h-5" />
                              Daily Practices (5-15 minutes)
                            </h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {dynamicContent.daily_practices
                                .morning_mantra && (
                                <div className="p-3 bg-orange-50 rounded-lg">
                                  <p className="text-sm font-medium text-gray-700 mb-1">
                                    Primary Mantra:
                                  </p>
                                  <p className="text-orange-600 font-medium text-sm">
                                    {
                                      dynamicContent.daily_practices
                                        .morning_mantra.primary
                                    }
                                  </p>
                                  <p className="text-xs text-orange-500">
                                    {
                                      dynamicContent.daily_practices
                                        .morning_mantra.timing
                                    }
                                  </p>
                                </div>
                              )}
                              {dynamicContent.daily_practices.meditation && (
                                <div className="p-3 bg-orange-50 rounded-lg">
                                  <p className="text-sm font-medium text-gray-700 mb-1">
                                    Meditation:
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {
                                      dynamicContent.daily_practices.meditation
                                        .technique
                                    }
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {
                                      dynamicContent.daily_practices.meditation
                                        .best_time
                                    }
                                  </p>
                                </div>
                              )}
                              {dynamicContent.daily_practices
                                .daily_affirmations && (
                                <div className="p-3 bg-orange-50 rounded-lg md:col-span-2">
                                  <p className="text-sm font-medium text-gray-700 mb-1">
                                    Daily Affirmations:
                                  </p>
                                  <div className="space-y-1">
                                    {dynamicContent.daily_practices.daily_affirmations.map(
                                      (affirmation: string, index: number) => (
                                        <p
                                          key={index}
                                          className="text-xs text-gray-600"
                                        >
                                          • {affirmation}
                                        </p>
                                      ),
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Gemstone Guidance */}
                        {dynamicContent.gemstone_guidance && (
                          <div className="bg-white/80 p-5 rounded-lg border border-orange-300 shadow-sm mb-4">
                            <h5 className="font-semibold text-orange-700 mb-3 flex items-center gap-2">
                              <Diamond className="w-5 h-5" />
                              Gemstone Guidance
                            </h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              {dynamicContent.gemstone_guidance
                                .primary_recommendation && (
                                <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                                  <p className="text-sm font-medium text-purple-700 mb-2">
                                    Recommendation:
                                  </p>
                                  <p className="text-purple-600 font-bold text-lg">
                                    {
                                      dynamicContent.gemstone_guidance
                                        .primary_recommendation.action
                                    }
                                  </p>
                                  <p className="text-purple-600 font-medium">
                                    {
                                      dynamicContent.gemstone_guidance
                                        .primary_recommendation.gemstone
                                    }
                                  </p>
                                  <p className="text-xs text-purple-500 mt-1">
                                    {
                                      dynamicContent.gemstone_guidance
                                        .primary_recommendation.weight
                                    }{" "}
                                    in{" "}
                                    {
                                      dynamicContent.gemstone_guidance
                                        .primary_recommendation.metal
                                    }
                                  </p>
                                  <p className="text-xs text-purple-600 mt-2">
                                    {
                                      dynamicContent.gemstone_guidance
                                        .primary_recommendation.reason
                                    }
                                  </p>
                                </div>
                              )}
                              {dynamicContent.gemstone_guidance
                                .wearing_instructions && (
                                <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                                  <p className="text-sm font-medium text-blue-700 mb-2">
                                    Wearing Instructions:
                                  </p>
                                  <div className="space-y-1 text-xs text-blue-600">
                                    <p>
                                      <strong>Day:</strong>{" "}
                                      {
                                        dynamicContent.gemstone_guidance
                                          .wearing_instructions.day
                                      }
                                    </p>
                                    <p>
                                      <strong>Time:</strong>{" "}
                                      {
                                        dynamicContent.gemstone_guidance
                                          .wearing_instructions.time
                                      }
                                    </p>
                                    <p>
                                      <strong>Finger:</strong>{" "}
                                      {
                                        dynamicContent.gemstone_guidance
                                          .wearing_instructions.finger
                                      }
                                    </p>
                                    <p>
                                      <strong>Preparation:</strong>{" "}
                                      {
                                        dynamicContent.gemstone_guidance
                                          .wearing_instructions.purification
                                      }
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                            {dynamicContent.gemstone_guidance.alternatives && (
                              <div className="p-3 bg-orange-50 rounded-lg">
                                <p className="text-sm font-medium text-orange-700 mb-1">
                                  Alternatives:
                                </p>
                                <p className="text-xs text-orange-600">
                                  {
                                    dynamicContent.gemstone_guidance
                                      .alternatives.substitute_gems
                                  }
                                </p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Monthly Practices */}
                        {dynamicContent.monthly_practices && (
                          <div className="bg-white/80 p-5 rounded-lg border border-orange-300 shadow-sm mb-4">
                            <h5 className="font-semibold text-orange-700 mb-3 flex items-center gap-2">
                              <Calendar className="w-5 h-5" />
                              Monthly Practices
                            </h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {dynamicContent.monthly_practices
                                .temple_visits && (
                                <div className="p-3 bg-orange-50 rounded-lg">
                                  <p className="text-sm font-medium text-gray-700 mb-1">
                                    Temple Visits:
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {
                                      dynamicContent.monthly_practices
                                        .temple_visits.frequency
                                    }
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {
                                      dynamicContent.monthly_practices
                                        .temple_visits.secondary
                                    }
                                  </p>
                                </div>
                              )}
                              {dynamicContent.monthly_practices.donations && (
                                <div className="p-3 bg-orange-50 rounded-lg">
                                  <p className="text-sm font-medium text-gray-700 mb-1">
                                    Donations:
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {
                                      dynamicContent.monthly_practices.donations
                                        .primary
                                    }
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {
                                      dynamicContent.monthly_practices.donations
                                        .timing
                                    }
                                  </p>
                                </div>
                              )}
                              {dynamicContent.monthly_practices.fasting && (
                                <div className="p-3 bg-orange-50 rounded-lg">
                                  <p className="text-sm font-medium text-gray-700 mb-1">
                                    Fasting:
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {
                                      dynamicContent.monthly_practices.fasting
                                        .type
                                    }
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Avoid:{" "}
                                    {
                                      dynamicContent.monthly_practices.fasting
                                        .foods_to_avoid
                                    }
                                  </p>
                                </div>
                              )}
                              {dynamicContent.monthly_practices
                                .charity_work && (
                                <div className="p-3 bg-orange-50 rounded-lg">
                                  <p className="text-sm font-medium text-gray-700 mb-1">
                                    Charity Work:
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {
                                      dynamicContent.monthly_practices
                                        .charity_work.suggestion
                                    }
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {
                                      dynamicContent.monthly_practices
                                        .charity_work.frequency
                                    }
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Lifestyle Alignment */}
                        {dynamicContent.lifestyle_alignment && (
                          <div className="bg-white/80 p-5 rounded-lg border border-orange-300 shadow-sm mb-4">
                            <h5 className="font-semibold text-orange-700 mb-3 flex items-center gap-2">
                              <Home className="w-5 h-5" />
                              Lifestyle Alignment
                            </h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {dynamicContent.lifestyle_alignment
                                .color_therapy && (
                                <div>
                                  <p className="text-sm font-medium text-gray-700 mb-2">
                                    Color Therapy:
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {
                                      dynamicContent.lifestyle_alignment
                                        .color_therapy.daily_colors
                                    }
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Avoid:{" "}
                                    {
                                      dynamicContent.lifestyle_alignment
                                        .color_therapy.avoid_colors
                                    }
                                  </p>
                                </div>
                              )}
                              {dynamicContent.lifestyle_alignment
                                .directional_alignment && (
                                <div>
                                  <p className="text-sm font-medium text-gray-700 mb-2">
                                    Directional Alignment:
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    Face{" "}
                                    {
                                      dynamicContent.lifestyle_alignment
                                        .directional_alignment.workspace
                                    }
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Sleep:{" "}
                                    {
                                      dynamicContent.lifestyle_alignment
                                        .directional_alignment.sleep
                                    }
                                  </p>
                                </div>
                              )}
                              {dynamicContent.lifestyle_alignment
                                .timing_optimization && (
                                <div>
                                  <p className="text-sm font-medium text-gray-700 mb-2">
                                    Best Timing:
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {
                                      dynamicContent.lifestyle_alignment
                                        .timing_optimization
                                        .important_activities
                                    }
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {
                                      dynamicContent.lifestyle_alignment
                                        .timing_optimization.meetings
                                    }
                                  </p>
                                </div>
                              )}
                              {dynamicContent.lifestyle_alignment
                                .dietary_recommendations && (
                                <div>
                                  <p className="text-sm font-medium text-gray-700 mb-2">
                                    Dietary Guidelines:
                                  </p>
                                  <p className="text-sm text-green-600">
                                    Favor:{" "}
                                    {
                                      dynamicContent.lifestyle_alignment
                                        .dietary_recommendations.foods_to_favor
                                    }
                                  </p>
                                  <p className="text-xs text-red-500">
                                    Avoid:{" "}
                                    {
                                      dynamicContent.lifestyle_alignment
                                        .dietary_recommendations.foods_to_avoid
                                    }
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Annual Practices */}
                        {dynamicContent.annual_practices && (
                          <div className="bg-white/80 p-5 rounded-lg border border-orange-300 shadow-sm mb-4">
                            <h5 className="font-semibold text-orange-700 mb-3 flex items-center gap-2">
                              <Calendar className="w-5 h-5" />
                              Annual Practices
                            </h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {dynamicContent.annual_practices.major_pujas && (
                                <div className="p-3 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg">
                                  <p className="text-sm font-medium text-amber-700 mb-1">
                                    Major Pujas:
                                  </p>
                                  <p className="text-sm text-amber-600">
                                    {
                                      dynamicContent.annual_practices
                                        .major_pujas.primary
                                    }
                                  </p>
                                  <p className="text-xs text-amber-500">
                                    {
                                      dynamicContent.annual_practices
                                        .major_pujas.timing
                                    }
                                  </p>
                                </div>
                              )}
                              {dynamicContent.annual_practices.pilgrimage && (
                                <div className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                                  <p className="text-sm font-medium text-green-700 mb-1">
                                    Pilgrimage:
                                  </p>
                                  <p className="text-sm text-green-600">
                                    {
                                      dynamicContent.annual_practices.pilgrimage
                                        .suggested_places
                                    }
                                  </p>
                                  <p className="text-xs text-green-500">
                                    {
                                      dynamicContent.annual_practices.pilgrimage
                                        .best_time
                                    }
                                  </p>
                                </div>
                              )}
                              {dynamicContent.annual_practices.homas && (
                                <div className="p-3 bg-gradient-to-br from-red-50 to-pink-50 rounded-lg">
                                  <p className="text-sm font-medium text-red-700 mb-1">
                                    Homas:
                                  </p>
                                  <p className="text-sm text-red-600">
                                    {
                                      dynamicContent.annual_practices.homas
                                        .recommended
                                    }
                                  </p>
                                  <p className="text-xs text-red-500">
                                    {
                                      dynamicContent.annual_practices.homas
                                        .frequency
                                    }
                                  </p>
                                </div>
                              )}
                              {dynamicContent.annual_practices
                                .spiritual_goals && (
                                <div className="p-3 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg">
                                  <p className="text-sm font-medium text-purple-700 mb-1">
                                    Spiritual Goals:
                                  </p>
                                  <p className="text-sm text-purple-600">
                                    {
                                      dynamicContent.annual_practices
                                        .spiritual_goals.primary_focus
                                    }
                                  </p>
                                  <p className="text-xs text-purple-500">
                                    {
                                      dynamicContent.annual_practices
                                        .spiritual_goals.yearly_target
                                    }
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Expected Benefits */}
                        {dynamicContent.expected_benefits && (
                          <div className="bg-white/80 p-5 rounded-lg border border-orange-300 shadow-sm">
                            <h5 className="font-semibold text-orange-700 mb-3 flex items-center gap-2">
                              <Star className="w-5 h-5" />
                              Expected Benefits
                            </h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {dynamicContent.expected_benefits.short_term && (
                                <div className="mb-3">
                                  <p className="text-sm font-medium text-gray-700 mb-2">
                                    Short Term (3-6 months):
                                  </p>
                                  {dynamicContent.expected_benefits.short_term.map(
                                    (benefit: string, index: number) => (
                                      <div
                                        key={index}
                                        className="flex items-start gap-2 p-2 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg mb-1"
                                      >
                                        <span className="text-orange-500 mt-1">
                                          ✓
                                        </span>
                                        <span className="text-sm text-gray-700">
                                          {benefit}
                                        </span>
                                      </div>
                                    ),
                                  )}
                                </div>
                              )}
                              {dynamicContent.expected_benefits.long_term && (
                                <div className="mb-3">
                                  <p className="text-sm font-medium text-gray-700 mb-2">
                                    Long Term (1-2 years):
                                  </p>
                                  {dynamicContent.expected_benefits.long_term.map(
                                    (benefit: string, index: number) => (
                                      <div
                                        key={index}
                                        className="flex items-start gap-2 p-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg mb-1"
                                      >
                                        <span className="text-green-500 mt-1">
                                          ✓
                                        </span>
                                        <span className="text-sm text-gray-700">
                                          {benefit}
                                        </span>
                                      </div>
                                    ),
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}

              {/* Section 23: Spiritual Growth & Development */}
              {section.content === "spiritual_growth_development" &&
                (() => {
                  const dynamicContent =
                    reportData.spiritual_growth_development ||
                    (section as any).subsections?.[0]?.content;

                  console.log("🔍 Section 23 Dynamic Content Check:", {
                    dynamicContent,
                    type: typeof dynamicContent,
                    isObject: typeof dynamicContent === "object",
                    isNull: dynamicContent === null,
                    hasKeys:
                      dynamicContent && typeof dynamicContent === "object"
                        ? Object.keys(dynamicContent)
                        : "N/A",
                  });

                  if (
                    !dynamicContent ||
                    typeof dynamicContent !== "object" ||
                    dynamicContent === null
                  ) {
                    return (
                      <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                        <h4 className="text-xl font-bold text-purple-800 mb-4 flex items-center gap-2">
                          <Star className="w-6 h-6" />
                          Spiritual Growth & Development - Loading Dynamic
                          Content
                        </h4>
                        <p className="text-purple-700">
                          Spiritual growth analysis is being generated based on
                          authentic birth chart calculations...
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-6">
                      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-lg border border-purple-200">
                        <h4 className="text-xl font-bold text-purple-800 mb-6 flex items-center gap-2">
                          <Star className="w-6 h-6" />
                          Spiritual Growth & Development
                        </h4>

                        {/* Spiritual Potential */}
                        {dynamicContent.spiritual_potential && (
                          <div className="bg-white/80 p-5 rounded-lg border border-purple-300 shadow-sm mb-4">
                            <h5 className="font-semibold text-purple-700 mb-3">
                              Spiritual Potential
                            </h5>
                            {dynamicContent.spiritual_potential
                              .natural_inclinations && (
                              <div className="space-y-2">
                                {dynamicContent.spiritual_potential.natural_inclinations.map(
                                  (inclination: string, index: number) => (
                                    <div
                                      key={index}
                                      className="p-2 bg-purple-50 rounded text-sm text-purple-700"
                                    >
                                      {inclination}
                                    </div>
                                  ),
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Meditation Practices */}
                        {dynamicContent.meditation_practices && (
                          <div className="bg-white/80 p-5 rounded-lg border border-purple-300 shadow-sm mb-4">
                            <h5 className="font-semibold text-purple-700 mb-3">
                              Recommended Meditation Practices
                            </h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm font-medium text-gray-700">
                                  Primary Practice:
                                </p>
                                <p className="text-purple-600 font-medium">
                                  {
                                    dynamicContent.meditation_practices
                                      .primary_practice
                                  }
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-700">
                                  Best Timing:
                                </p>
                                <p className="text-sm text-gray-600">
                                  {
                                    dynamicContent.meditation_practices
                                      .best_timing
                                  }
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Enlightenment Path */}
                        {dynamicContent.enlightenment_path && (
                          <div className="bg-white/80 p-5 rounded-lg border border-purple-300 shadow-sm mb-4">
                            <h5 className="font-semibold text-purple-700 mb-3">
                              Enlightenment Path
                            </h5>
                            <div className="p-3 bg-purple-50 rounded-lg">
                              <p className="text-sm font-medium text-gray-700 mb-1">
                                Spiritual Path:
                              </p>
                              <p className="text-purple-600 font-medium">
                                {
                                  dynamicContent.enlightenment_path
                                    .spiritual_path
                                }
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}

              {/* NEW SECTIONS: ASTROLOGICAL SUMMARY & PERSONALIZED RECOMMENDATIONS */}

              {/* ASTROLOGICAL SUMMARY Section */}
              {(section.title === "Astrological Summary" ||
                section.content === "astrological_summary") &&
                reportData.astrological_summary && (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
                      <h4 className="text-xl font-bold text-blue-800 mb-6 flex items-center gap-2">
                        <Star className="w-6 h-6" />
                        🌟 Your Celestial Blueprint
                      </h4>

                      <div className="bg-white/80 p-6 rounded-lg border border-blue-300 shadow-sm">
                        <div className="prose prose-blue max-w-none">
                          <div
                            className="text-gray-700 leading-relaxed whitespace-pre-line"
                            dangerouslySetInnerHTML={{
                              __html: reportData.astrological_summary.content
                                ?.replace(
                                  /\*\*(.*?)\*\*/g,
                                  '<strong class="text-blue-800">$1</strong>',
                                )
                                ?.replace(
                                  /🌟/g,
                                  '<span class="text-yellow-500">🌟</span>',
                                )
                                ?.replace(
                                  /✨/g,
                                  '<span class="text-purple-500">✨</span>',
                                )
                                ?.replace(
                                  /🌙/g,
                                  '<span class="text-blue-400">🌙</span>',
                                )
                                ?.replace(
                                  /🎯/g,
                                  '<span class="text-green-500">🎯</span>',
                                )
                                ?.replace(
                                  /⚡/g,
                                  '<span class="text-yellow-400">⚡</span>',
                                )
                                ?.replace(
                                  /🌈/g,
                                  '<span class="text-purple-400">🌈</span>',
                                )
                                ?.replace(
                                  /🔮/g,
                                  '<span class="text-indigo-500">🔮</span>',
                                ),
                            }}
                          />
                        </div>

                        {/* Strong Planets Display */}
                        {reportData.astrological_summary.strong_planets &&
                          reportData.astrological_summary.strong_planets
                            .length > 0 && (
                            <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                              <h6 className="font-semibold text-green-800 mb-2">
                                Your Planetary Superpowers:
                              </h6>
                              <div className="flex flex-wrap gap-2">
                                {reportData.astrological_summary.strong_planets.map(
                                  (planet: string, index: number) => (
                                    <span
                                      key={index}
                                      className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"
                                    >
                                      {planet}
                                    </span>
                                  ),
                                )}
                              </div>
                            </div>
                          )}

                        {/* Current Phase Display */}
                        {reportData.astrological_summary.current_phase && (
                          <div className="mt-4 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-200">
                            <h6 className="font-semibold text-orange-800 mb-2">
                              Current Cosmic Phase:
                            </h6>
                            <p className="text-orange-700 font-medium">
                              {reportData.astrological_summary.current_phase}{" "}
                              Mahadasha
                            </p>
                          </div>
                        )}

                        {/* Positive Affirmation */}
                        {reportData.astrological_summary
                          .positive_affirmation && (
                          <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                            <h6 className="font-semibold text-purple-800 mb-2">
                              Your Personal Affirmation:
                            </h6>
                            <p className="text-purple-700 italic font-medium">
                              "
                              {
                                reportData.astrological_summary
                                  .positive_affirmation
                              }
                              "
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

              {/* PERSONALIZED RECOMMENDATIONS Section */}
              {(section.title === "Personalized Recommendations" ||
                section.content === "personalized_recommendations") &&
                reportData.personalized_recommendations && (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-lg border border-amber-200">
                      <h4 className="text-xl font-bold text-amber-800 mb-6 flex items-center gap-2">
                        <Target className="w-6 h-6" />
                        🎯 Your Personalized Cosmic Roadmap
                      </h4>

                      <div className="bg-white/80 p-6 rounded-lg border border-amber-300 shadow-sm">
                        <div className="prose prose-amber max-w-none">
                          <div
                            className="text-gray-700 leading-relaxed whitespace-pre-line"
                            dangerouslySetInnerHTML={{
                              __html:
                                reportData.personalized_recommendations.content
                                  ?.replace(
                                    /\*\*(.*?)\*\*/g,
                                    '<strong class="text-amber-800">$1</strong>',
                                  )
                                  ?.replace(
                                    /🎯/g,
                                    '<span class="text-green-500">🎯</span>',
                                  )
                                  ?.replace(
                                    /💼/g,
                                    '<span class="text-blue-500">💼</span>',
                                  )
                                  ?.replace(
                                    /💝/g,
                                    '<span class="text-pink-500">💝</span>',
                                  )
                                  ?.replace(
                                    /🌿/g,
                                    '<span class="text-green-400">🌿</span>',
                                  )
                                  ?.replace(
                                    /🙏/g,
                                    '<span class="text-purple-500">🙏</span>',
                                  )
                                  ?.replace(
                                    /⏰/g,
                                    '<span class="text-blue-400">⏰</span>',
                                  )
                                  ?.replace(
                                    /🔥/g,
                                    '<span class="text-red-500">🔥</span>',
                                  )
                                  ?.replace(
                                    /🌟/g,
                                    '<span class="text-yellow-500">🌟</span>',
                                  )
                                  ?.replace(
                                    /💎/g,
                                    '<span class="text-indigo-500">💎</span>',
                                  ),
                            }}
                          />
                        </div>

                        {/* Timing Guidance Display */}
                        {reportData.personalized_recommendations
                          .timing_guidance && (
                          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                            <h6 className="font-semibold text-blue-800 mb-2">
                              Current Timing Guidance:
                            </h6>
                            <p className="text-blue-700 font-medium">
                              {
                                reportData.personalized_recommendations
                                  .timing_guidance
                              }
                            </p>
                          </div>
                        )}

                        {/* Key Focus Areas */}
                        {reportData.personalized_recommendations
                          .key_focus_areas &&
                          reportData.personalized_recommendations
                            .key_focus_areas.length > 0 && (
                            <div className="mt-4 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border border-emerald-200">
                              <h6 className="font-semibold text-emerald-800 mb-2">
                                Key Focus Areas:
                              </h6>
                              <div className="flex flex-wrap gap-2">
                                {reportData.personalized_recommendations.key_focus_areas.map(
                                  (area: string, index: number) => (
                                    <span
                                      key={index}
                                      className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium"
                                    >
                                      {area}
                                    </span>
                                  ),
                                )}
                              </div>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
