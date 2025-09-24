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
  Lightbulb,
  Book,
} from "lucide-react";

interface SuperHoroscopeDashboardProps {
  reportData: any;
}

// Universal safe renderer to prevent object rendering errors
const safeRender = (value: any): string => {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean")
    return String(value);
  if (Array.isArray(value)) {
    return value.map(safeRender).join(", ");
  }
  if (typeof value === "object") {
    // Handle specific object structures that might cause rendering issues
    if (
      value.nature ||
      value.profession_likely ||
      value.appearance ||
      value.compatibility_level
    ) {
      const parts = [];
      if (value.nature) parts.push(`Nature: ${value.nature}`);
      if (value.profession_likely)
        parts.push(`Profession: ${value.profession_likely}`);
      if (value.appearance) parts.push(`Appearance: ${value.appearance}`);
      if (value.compatibility_level)
        parts.push(`Compatibility: ${value.compatibility_level}`);
      return parts.join(" | ");
    }

    // Handle specific object structures
    if (value.action) return value.action;
    if (value.gemstone) return value.gemstone;
    if (value.planet) return value.planet;
    if (value.weight) return `${value.weight}`;
    if (value.metal) return value.metal;
    if (value.reason) return value.reason;

    // For other objects, extract readable values safely
    const entries = Object.entries(value)
      .map(([key, val]) => {
        if (val && typeof val !== "object") {
          return `${key.replace(/_/g, " ")}: ${val}`;
        }
        return null;
      })
      .filter((entry) => entry !== null);

    return entries.length > 0 ? entries.join(", ") : "";
  }
  return String(value);
};

// Helper functions from ExecutiveDashboard
const calculatePadaFromLongitude = (longitude: number): number => {
  const nakshatraLength = 13.333333;
  const pada =
    Math.floor(((longitude % nakshatraLength) / nakshatraLength) * 4) + 1;
  return Math.min(pada, 4);
};

const getMoonSignEmotionalNature = (moonSign: string): string => {
  const emotionalProfiles: { [key: string]: string } = {
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
};

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
    Jyeshtha: "Scorpion",
    Mula: "Bunch of roots",
    "Purva Ashadha": "Fan/Winnowing Basket",
    "Uttara Ashadha": "Elephant Tusk",
    Shravana: "Three Footprints",
    Dhanishta: "Drum",
    Shatabhisha: "Empty Circle",
    "Purva Bhadrapada": "Front legs of funeral cot",
    "Uttara Bhadrapada": "Back legs of funeral cot",
    Revati: "Fish",
  };
  return nakshatraSymbols[nakshatra] || "Unknown";
};

export function SuperHoroscopeDashboard({
  reportData,
}: SuperHoroscopeDashboardProps) {
  console.log("SuperHoroscopeDashboard reportData:", reportData);
  console.log("SuperHoroscopeDashboard keys:", Object.keys(reportData || {}));
  console.log("Dasha Debug:", Object.keys(reportData || {}));
  console.log(
    "Full Dasha Data:",
    reportData?.dasha_periods,
    reportData?.mahadasha_timeline,
  );
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

  if (!reportData) {
    return (
      <div className="text-center py-12">
        <p className="text-purple-600">Loading Super Horoscope data...</p>
      </div>
    );
  }

  // Get data from the correct structure - the report might be nested
  const data = reportData.report || reportData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-50">
      {/* 🌟 COVER PAGE - Premium Report Header */}
      <div className="bg-gradient-to-br from-purple-800 via-indigo-800 to-purple-900 text-white min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-8xl">🕉️</div>
          <div className="absolute top-20 right-20 text-6xl">⭐</div>
          <div className="absolute bottom-20 left-20 text-7xl">🌙</div>
          <div className="absolute bottom-10 right-10 text-5xl">✨</div>
        </div>

        <div className="text-center z-10 max-w-4xl mx-auto px-8">
          <div className="mb-8">
            <Crown className="h-20 w-20 text-yellow-300 mx-auto mb-4" />
          </div>

          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-yellow-300 to-white bg-clip-text text-transparent">
            Super Horoscope Report
          </h1>

          <div className="text-2xl md:text-3xl font-light mb-8 text-yellow-100">
            Ancient Vedic Wisdom • Modern Precision
          </div>

          {data.birth_details && (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8">
              <div className="text-3xl font-bold mb-4">
                {data.birth_details.name || data.birth_details.full_name}
              </div>
              <div className="text-xl text-yellow-100">
                Born:{" "}
                {data.birth_details.date_of_birth || data.birth_details.date} at{" "}
                {data.birth_details.time_of_birth || data.birth_details.time}
              </div>
              <div className="text-lg text-purple-200 mt-2">
                📍{" "}
                {data.birth_details.place_of_birth || data.birth_details.place}
              </div>
            </div>
          )}

          <div className="bg-yellow-400/20 rounded-xl p-6 mb-8">
            <div className="text-sm font-medium text-yellow-100 mb-2">
              Prepared by
            </div>
            <div className="text-2xl font-bold text-white">AstroTick.com</div>
            <div className="text-sm text-purple-200 mt-2">
              Authentic Vedic Astrology • Professional Analysis
            </div>
          </div>

          <div className="text-xs text-purple-300">
            Generated on {new Date().toLocaleDateString()} • Report ID: SH
            {Date.now().toString().slice(-6)}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT - All ExecutiveDashboard sections */}
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
        {/* Section 1: Basic Birth Details */}
        <Card className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 border-2 border-orange-300 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-orange-600 to-amber-600 text-white p-6">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <User className="w-8 h-8 flex-shrink-0" />
              <span className="break-words">1. Basic Birth Details</span>
            </CardTitle>
            <CardDescription className="text-orange-100 text-lg">
              Name, Date, Time, Place of Birth - Timezone and DST corrections -
              Ayanamsa used
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-6 rounded-lg border border-orange-200">
              <h3 className="text-xl font-bold text-orange-800 mb-6">
                Complete Birth Information
              </h3>

              {/* Personal Birth Details */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
                <div className="bg-white/80 p-6 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-orange-700 mb-3 flex items-center gap-2 text-lg">
                    <User className="w-5 h-5" />
                    Personal Birth Details
                  </h4>
                  <div className="space-y-3 text-base">
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <span className="text-gray-600">Full Name:</span>
                      <span className="font-medium truncate max-w-[200px] sm:max-w-none text-right sm:text-left">
                        {data.birth_details?.full_name ||
                          data.birth_details?.name ||
                          "Unknown"}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <span className="text-gray-600">Date of Birth:</span>
                      <span className="font-medium text-right sm:text-left">
                        {data.birth_details?.date_of_birth ||
                          data.birth_details?.date ||
                          "Unknown"}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <span className="text-gray-600">Time of Birth:</span>
                      <span className="font-medium text-right sm:text-left">
                        {data.birth_details?.time_of_birth ||
                          data.birth_details?.time ||
                          "Unknown"}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <span className="text-gray-600">Place of Birth:</span>
                      <span className="font-medium text-right sm:text-left truncate">
                        {data.birth_details?.place_of_birth ||
                          data.birth_details?.place ||
                          "Unknown"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 p-6 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-orange-700 mb-3 flex items-center gap-2 text-lg">
                    <Star className="w-5 h-5" />
                    Astrological Identity
                  </h4>
                  <div className="space-y-3 text-base">
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <span className="text-gray-600">Moon Sign:</span>
                      <span className="font-medium text-right sm:text-left">
                        {data.moon_sign ||
                          data.chart_data?.moon_sign ||
                          "Unknown"}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <span className="text-gray-600">Nakshatra:</span>
                      <span className="font-medium text-right sm:text-left">
                        {data.chart_data?.birth_nakshatra ||
                          data.birth_details?.birth_star ||
                          "Unknown"}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <span className="text-gray-600">Ascendant:</span>
                      <span className="font-medium text-right sm:text-left">
                        {data.ascendant_sign ||
                          data.chart_data?.ascendant?.sign ||
                          "Unknown"}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <span className="text-gray-600">Zodiac Sun Sign:</span>
                      <span className="font-medium text-right sm:text-left">
                        {data.sun_sign ||
                          data.chart_data?.sun_sign ||
                          "Unknown"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 p-6 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-orange-700 mb-3 flex items-center gap-2 text-lg">
                    <Globe className="w-5 h-5" />
                    Technical Details
                  </h4>
                  <div className="space-y-3 text-base">
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <span className="text-gray-600">Coordinates:</span>
                      <span className="font-medium text-right sm:text-left text-xs">
                        {data.birth_details?.latitude || "0"}°N,{" "}
                        {data.birth_details?.longitude || "0"}°E
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <span className="text-gray-600">Timezone:</span>
                      <span className="font-medium text-right sm:text-left">
                        {data.birth_details?.timezone || "UTC+5:30"}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <span className="text-gray-600">Ayanamsa:</span>
                      <span className="font-medium text-right sm:text-left">
                        {data.technical_details?.ayanamsa || "Lahiri"}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <span className="text-gray-600">Calculation:</span>
                      <span className="font-medium text-right sm:text-left text-xs">
                        Swiss Ephemeris
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Planetary Positions & Nakshatras */}
        <Card className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-300 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Globe className="w-8 h-8 flex-shrink-0" />
              <span className="break-words">
                2. Planetary Positions & Nakshatras
              </span>
            </CardTitle>
            <CardDescription className="text-blue-100 text-lg">
              Exact planetary degrees, signs, houses, nakshatras, strengths, and
              effects
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
              <h4 className="text-xl font-bold text-blue-800 mb-6 flex items-center gap-2">
                <Globe className="w-6 h-6 flex-shrink-0" />
                Planetary Positions at Birth
              </h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {(() => {
                  const planetsData = data.planetary_results?.planets || {};

                  return Object.entries(planetsData).map(
                    ([planetName, planetInfo]: [string, any]) => {
                      const placement = planetInfo.placement || {};
                      const strength = planetInfo.strength_analysis || {};
                      const effects = planetInfo.effects?.combined_effects;

                      return (
                        <div
                          key={planetName}
                          className="bg-white/90 p-4 rounded-lg border border-blue-300 shadow-sm"
                        >
                          {/* Planet Header */}
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-white font-bold text-sm">
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
                                                  : planetName.charAt(0)}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-bold text-blue-800 text-lg truncate">
                                {planetName}
                              </div>
                              <div className="text-sm text-gray-600">
                                {placement.sign || "Unknown Sign"}
                              </div>
                            </div>
                          </div>

                          {/* Placement & Nakshatra */}
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">House:</span>
                              <Badge variant="outline" className="text-xs">
                                {placement.house_name ||
                                  placement.house_number ||
                                  "Unknown"}
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Degree:</span>
                              <span className="font-mono text-blue-700">
                                {typeof placement.degree === "number"
                                  ? `${placement.degree.toFixed(2)}°`
                                  : "Unknown"}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Nakshatra:</span>
                              <span className="font-medium text-purple-700 text-xs">
                                {placement.nakshatra || "Unknown"}
                              </span>
                            </div>
                            {placement.nakshatra_pada && (
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600">Pada:</span>
                                <span className="font-medium text-green-700">
                                  {placement.nakshatra_pada}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Strength Analysis */}
                          {strength && (
                            <div className="mt-3 p-2 bg-indigo-50 rounded border border-indigo-200">
                              <div className="text-indigo-800 font-medium">
                                Strength:
                              </div>
                              <div className="text-sm text-indigo-700">
                                Dignity:{" "}
                                {strength.dignity?.dignity_status || "Unknown"}{" "}
                                | Overall:{" "}
                                {strength.overall_strength || "Unknown"} |
                                Shadbala:{" "}
                                {strength.shadbala_strength || "Unknown"} |
                                Status: {strength.status || "Unknown"}
                              </div>
                            </div>
                          )}

                          {/* Effects Summary */}
                          {effects && (
                            <div className="mt-3 p-2 bg-purple-50 rounded border border-purple-200">
                              <div className="text-purple-800 font-medium">
                                Effects:
                              </div>
                              <div className="text-sm text-purple-700">
                                {effects}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    },
                  );
                })()}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Charts & Tables */}
        <Card className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 border-2 border-purple-300 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <BarChart className="w-8 h-8 flex-shrink-0" />
              <span className="break-words">3. Charts & Tables</span>
            </CardTitle>
            <CardDescription className="text-purple-100 text-lg">
              Vedic Birth Chart, Divisional Charts (D1 & D9), and Ashtakavarga
              Analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="text-center p-4 sm:p-6 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-base sm:text-lg text-blue-800 font-medium break-words">
                📊 Vedic Birth Chart and Divisional Charts are displayed below.
              </p>
              <p className="text-xs sm:text-sm text-blue-600 mt-2 break-words">
                The Ashtakavarga Strength Analysis has been moved to the end of
                this section for better organization.
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
                        {data.birth_details?.name || "Birth Chart"}
                      </div>
                      <div className="text-sm sm:text-base text-gray-600 mb-2 break-words">
                        {data.birth_details?.date} {data.birth_details?.time}
                        {data.birth_details?.place && (
                          <>
                            <br className="sm:hidden" />
                            <span className="hidden sm:inline"> | </span>
                            {data.birth_details?.place}
                          </>
                        )}
                      </div>
                      <div className="text-sm sm:text-base font-medium text-amber-700 break-words">
                        Lagna: {data.chart_data?.ascendant?.sign || "Unknown"}
                        <br className="sm:hidden" />
                        <span className="hidden sm:inline"> • </span>
                        Nakshatra: {data.birth_details?.birth_star || "Unknown"}
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
                      {data.divisional_charts?.d1_rasi?.north_indian_chart ? (
                        <div className="flex justify-center overflow-x-auto">
                          <div
                            className="border rounded-lg p-2 bg-white min-w-[280px] max-w-full"
                            dangerouslySetInnerHTML={{
                              __html:
                                data.divisional_charts.d1_rasi
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
                      {data.divisional_charts?.d1_rasi?.south_indian_chart ? (
                        <div className="flex justify-center">
                          <div
                            className="border rounded-lg p-2 bg-white"
                            dangerouslySetInnerHTML={{
                              __html:
                                data.divisional_charts.d1_rasi
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
                            Houses fixed, signs rotate • House 1 (ASC) at top
                            center
                          </p>
                        </div>
                        <div>
                          <p className="font-medium text-green-700">
                            South Indian Chart
                          </p>
                          <p>
                            Signs fixed, planets move • Traditional 4x4 grid
                            layout
                          </p>
                        </div>
                      </div>
                      <p className="text-xs mt-3">
                        Planet Abbreviations: Su-Sun, Mo-Moon, Ma-Mars,
                        Me-Mercury, Ju-Jupiter, Ve-Venus, Sa-Saturn, Ra-Rahu,
                        Ke-Ketu
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
                        D1 (Rasi) - Basic Life Chart • D9 (Navamsa) - Marriage &
                        Spiritual Chart
                      </div>
                      <div className="text-base font-medium text-emerald-700">
                        Authentic Jyotisha calculations with precise planetary
                        positions
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
                              Primary birth chart showing basic life themes
                            </p>
                          </div>
                          {/* Use authentic D1 South Indian chart from Jyotisha engine */}
                          {data.divisional_charts?.d1_rasi
                            ?.south_indian_chart ? (
                            <div className="flex justify-center  ">
                              <div
                                className="border rounded-lg p-2 bg-white md:w-[600px] md:h-[400px] md:pr-20   "
                                dangerouslySetInnerHTML={{
                                  __html:
                                    data.divisional_charts.d1_rasi
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
                              Marriage compatibility and spiritual potential
                            </p>
                          </div>
                          {/* Use authentic South Indian D9 chart from Jyotisha engine */}
                          {data.divisional_charts?.d9_navamsa
                            ?.south_indian_chart ? (
                            <div className="flex justify-center gap-6">
                              <div
                                className="border rounded-lg p-2 bg-white  md:h-[400px] md:w-[320px] "
                                dangerouslySetInnerHTML={{
                                  __html:
                                    data.divisional_charts.d9_navamsa
                                      .south_indian_chart,
                                }}
                              />
                            </div>
                          ) : data.divisional_charts?.d9_navamsha
                              ?.south_indian_chart ? (
                            <div className="flex justify-center">
                              <div
                                className="border rounded-lg p-2 bg-white inline-block overflow-hidden object-cover"
                                dangerouslySetInnerHTML={{
                                  __html:
                                    data.divisional_charts.d9_navamsha
                                      .south_indian_chart,
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
                          {data.divisional_charts?.d1_rasi
                            ?.north_indian_chart ? (
                            <div className="flex justify-center">
                              <div
                                className="border rounded-lg p-2 bg-white"
                                dangerouslySetInnerHTML={{
                                  __html:
                                    data.divisional_charts.d1_rasi
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
                          {data.divisional_charts?.d9_navamsa
                            ?.north_indian_chart ? (
                            <div className="flex justify-center">
                              <div
                                className="border rounded-lg p-2 bg-white"
                                dangerouslySetInnerHTML={{
                                  __html:
                                    data.divisional_charts.d9_navamsa
                                      .north_indian_chart,
                                }}
                              />
                            </div>
                          ) : data.divisional_charts?.d9_navamsha
                              ?.north_indian_chart ? (
                            <div className="flex justify-center">
                              <div
                                className="border rounded-lg p-2 bg-white"
                                dangerouslySetInnerHTML={{
                                  __html:
                                    data.divisional_charts.d9_navamsha
                                      .north_indian_chart,
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
                          <span className="text-gray-600">Ascendant:</span>
                          <span className="font-medium text-blue-700">
                            {data.ascendant_sign || "Kumbha"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Moon Sign:</span>
                          <span className="font-medium text-blue-700">
                            {data.moon_sign || "Vrishchika"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Sun Sign:</span>
                          <span className="font-medium text-blue-700">
                            {data.sun_sign || "Mithuna"}
                          </span>
                        </div>
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                          <p className="text-xs text-blue-800">
                            Primary chart showing basic life themes,
                            personality, health, career foundation, and general
                            life direction.
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
                          <span className="text-gray-600">Navamsa Lagna:</span>
                          <span className="font-medium text-rose-700">
                            {data.divisional_charts?.d9_navamsa?.ascendant ||
                              data.divisional_charts?.d9_navamsha?.ascendant ||
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
                            {data.divisional_charts?.d9_navamsa
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
                        Understanding Your Charts:
                      </h6>
                      <p className="text-sm text-gray-700">
                        The D1 Rasi chart is your primary birth chart, revealing
                        core personality, life path, and karmic patterns. The D9
                        Navamsa chart reveals deeper spiritual potential,
                        marriage compatibility, and dharmic evolution. Both
                        North and South Indian formats show the same planetary
                        positions but in different visual arrangements.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 4: Ascendant and Personality Analysis */}
        <Card className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 border-2 border-orange-300 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-orange-600 to-amber-600 text-white p-6">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <User className="w-8 h-8" />
              4. 👤 Ascendant and Personality Analysis
            </CardTitle>
            <CardDescription className="text-orange-100 text-lg">
              Lagna lord placement - Ascendant degree and nakshatra - Physical
              appearance and personality traits
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
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
                      {data.ascendant_sign || "Meena"} Ascendant Nature
                    </div>
                    <div className="text-blue-700">
                      {(() => {
                        // Look for personality data in multiple possible locations
                        const personalityData =
                          data.ascendant_analysis?.nature ||
                          data.ascendant_analysis?.ascendant_nature ||
                          data.personality_character_analysis?.nature ||
                          data.personality_character_analysis?.ascendant_nature;

                        if (personalityData) {
                          return personalityData;
                        }

                        // Fallback based on ascendant sign
                        const ascendantNatures: { [key: string]: string } = {
                          Mesha:
                            "Dynamic, ambitious, natural leader with pioneering spirit",
                          Vrishabha:
                            "Practical, stable, appreciation for beauty and comfort",
                          Mithuna:
                            "Curious, communicative, adaptable and intellectual",
                          Karkataka:
                            "Emotional, intuitive, protective and nurturing",
                          Simha:
                            "Confident, generous, natural performer with royal demeanor",
                          Kanya:
                            "Analytical, perfectionist, service-oriented and methodical",
                          Tula: "Harmonious, diplomatic, seeks balance and partnership",
                          Vrishchika:
                            "Intense, transformative, mysterious and resilient",
                          Dhanu:
                            "Philosophical, optimistic, love for freedom and adventure",
                          Makara:
                            "Disciplined, ambitious, practical and traditional",
                          Kumbha:
                            "Progressive, humanitarian, independent and innovative",
                          Meena:
                            "Compassionate, intuitive, spiritual and artistic",
                        };

                        return (
                          ascendantNatures[data.ascendant_sign || "Meena"] ||
                          "Compassionate and intuitive nature with strong spiritual inclinations."
                        );
                      })()}
                    </div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="font-medium text-green-800 mb-2">
                      Core Personality Traits
                    </div>
                    <div className="text-green-700">
                      {data.personality_traits ||
                        "Service-oriented, compassionate, naturally inclined towards helping others and spiritual pursuits."}
                    </div>
                  </div>
                </div>
              </div>

              {/* Physical Features */}
              <div className="bg-white/90 p-6 rounded-lg border border-green-200 shadow-sm">
                <h4 className="font-semibold text-green-700 text-lg mb-4 flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Physical Features
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="font-medium text-green-800 mb-2">
                      General Appearance
                    </div>
                    <div className="text-green-700">
                      {data.physical_features ||
                        "Medium height, well-proportioned body, expressive eyes with graceful movements and pleasant demeanor."}
                    </div>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <div className="font-medium text-orange-800 mb-2">
                      Distinctive Features
                    </div>
                    <div className="text-orange-700">
                      {data.distinctive_features ||
                        "Soft features, compassionate expression, often has a calming presence that others find soothing."}
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Behavior */}
              <div className="bg-white/90 p-6 rounded-lg border border-purple-200 shadow-sm">
                <h4 className="font-semibold text-purple-700 text-lg mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Social Behavior
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="font-medium text-purple-800 mb-2">
                      Social Interaction
                    </div>
                    <div className="text-purple-700">
                      {data.social_behavior ||
                        "Gentle and accommodating in social settings, prefers meaningful conversations over superficial interactions."}
                    </div>
                  </div>
                  <div className="p-3 bg-indigo-50 rounded-lg">
                    <div className="font-medium text-indigo-800 mb-2">
                      Mental Approach
                    </div>
                    <div className="text-indigo-700">
                      {data.mental_tendencies ||
                        "Intuitive decision-making, emotionally driven choices, seeks spiritual understanding."}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3. Ashtakavarga Strength Analysis (moved to end of section 4) */}
        <div className="mt-8">
          <div className="bg-gradient-to-br from-violet-50/90 via-purple-50/90 to-indigo-50/90 backdrop-blur-sm border-violet-300 shadow-lg rounded-lg">
            <div className="bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-t-lg p-4">
              <div className="flex items-center gap-2 text-xl font-semibold">
                <BarChart className="h-6 w-6" />
                Ashtakavarga Strength Analysis (12 Houses)
              </div>
              <div className="text-violet-100 text-base mt-1">
                Comprehensive house-wise strength distribution with planetary
                bindu counts and life area analysis
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
                          <div className="text-sm text-gray-600">Bindus</div>
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
                            {house.house === 1 && "Self & Personality"}
                            {house.house === 2 && "Wealth & Family"}
                            {house.house === 3 && "Siblings & Courage"}
                            {house.house === 4 && "Home & Mother"}
                            {house.house === 5 && "Children & Creativity"}
                            {house.house === 6 && "Health & Service"}
                            {house.house === 7 && "Marriage & Partnership"}
                            {house.house === 8 && "Transformation & Longevity"}
                            {house.house === 9 && "Fortune & Higher Learning"}
                            {house.house === 10 && "Career & Reputation"}
                            {house.house === 11 && "Gains & Friendships"}
                            {house.house === 12 && "Spirituality & Expenses"}
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
                                {house.house === 1 && "Self & Personality"}
                                {house.house === 2 && "Wealth & Family"}
                                {house.house === 3 && "Siblings & Courage"}
                                {house.house === 4 && "Home & Mother"}
                                {house.house === 5 && "Children & Creativity"}
                                {house.house === 6 && "Health & Service"}
                                {house.house === 7 && "Marriage & Partnership"}
                                {house.house === 8 &&
                                  "Transformation & Longevity"}
                                {house.house === 9 &&
                                  "Fortune & Higher Learning"}
                                {house.house === 10 && "Career & Reputation"}
                                {house.house === 11 && "Gains & Friendships"}
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
                      {bottom3Houses.map((house: any, index: number) => (
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
                                {house.house === 1 && "Self & Personality"}
                                {house.house === 2 && "Wealth & Family"}
                                {house.house === 3 && "Siblings & Courage"}
                                {house.house === 4 && "Home & Mother"}
                                {house.house === 5 && "Children & Creativity"}
                                {house.house === 6 && "Health & Service"}
                                {house.house === 7 && "Marriage & Partnership"}
                                {house.house === 8 &&
                                  "Transformation & Longevity"}
                                {house.house === 9 &&
                                  "Fortune & Higher Learning"}
                                {house.house === 10 && "Career & Reputation"}
                                {house.house === 11 && "Gains & Friendships"}
                                {house.house === 12 &&
                                  "Spirituality & Expenses"}
                              </div>
                            </div>
                          </div>
                          <Badge className="bg-red-500 text-white px-3 py-1">
                            {house.totalBindus} bindus
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 5: Moon Sign and Emotional Profile */}
        <Card className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 border-2 border-orange-300 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-orange-600 to-amber-600 text-white p-6">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Moon className="w-8 h-8" />
              5. 🌙 Moon Sign and Emotional Profile
            </CardTitle>
            <CardDescription className="text-orange-100 text-lg">
              Moon sign characteristics - Emotional nature and instincts -
              Mental strength and thought patterns
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
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
                      {data.moon_sign || "Simha"} Moon Sign
                    </div>
                    <div className="text-pink-700 text-sm">
                      {data.emotional_profile?.nature ||
                        getMoonSignEmotionalNature(data.moon_sign || "Simha")}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Emotional Strength:</span>
                      <span className="font-medium text-pink-700">
                        {data.emotional_profile?.strength || "High"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Stress Triggers:</span>
                      <span className="font-medium text-red-600">
                        {data.emotional_profile?.stress_triggers ||
                          "Criticism, Conflict"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mental Patterns */}
              <div className="bg-white/90 p-6 rounded-lg border border-blue-200 shadow-sm">
                <h4 className="font-semibold text-blue-700 text-lg mb-4 flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Mental Patterns
                </h4>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="font-medium text-blue-800 mb-2">
                      Thought Process
                    </div>
                    <div className="text-blue-700 text-sm">
                      {data.mental_patterns?.thought_process ||
                        "Creative and intuitive thinking, often guided by emotions and inner wisdom."}
                    </div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="font-medium text-green-800 mb-2">
                      Mother Relationship
                    </div>
                    <div className="text-green-700 text-sm">
                      {data.mental_patterns?.mother_relationship ||
                        "Strong bond with mother, likely to receive support and guidance from maternal figures."}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 6: Nakshatra Interpretation */}
        <Card className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 border-2 border-orange-300 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-orange-600 to-amber-600 text-white p-6">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Star className="w-8 h-8" />
              6. ⭐ Nakshatra Interpretation
            </CardTitle>
            <CardDescription className="text-orange-100 text-lg">
              Birth nakshatra characteristics - Nakshatra lord and deity - Pada
              analysis and effects
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
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
                      data.chart_data?.planetary_positions?.Moon?.nakshatra ||
                      data.birth_details?.nakshatra ||
                      "Anuradha"; // Default from server logs

                    const moonPada =
                      data.chart_data?.planetary_positions?.Moon?.pada ||
                      data.birth_details?.nakshatra_pada ||
                      calculatePadaFromLongitude(
                        data.chart_data?.planetary_positions?.Moon?.longitude ||
                          223.52,
                      );

                    return (
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-800 mb-1">
                          {moonNakshatra}
                        </div>
                        <div className="text-sm text-green-600 mb-3">
                          Pada {moonPada}
                        </div>
                        <div className="text-xs text-gray-600">
                          <div>Lord: {getNakshatraLord(moonNakshatra)}</div>
                          <div>Symbol: {getNakshatraSymbol(moonNakshatra)}</div>
                          <div>Deity: {getNakshatraDeity(moonNakshatra)}</div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Characteristics */}
              <div className="bg-white/90 p-6 rounded-lg border border-blue-200 shadow-sm">
                <h4 className="font-semibold text-blue-700 text-lg mb-4 flex items-center gap-2">
                  <Diamond className="h-5 w-5" />
                  Key Characteristics
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="font-medium text-blue-800 mb-2">
                      Nature & Traits
                    </div>
                    <div className="text-blue-700">
                      {data.nakshatra_analysis?.characteristics ||
                        "Devoted, loyal, disciplined, friendly nature with strong spiritual inclinations and ability to overcome obstacles."}
                    </div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="font-medium text-purple-800 mb-2">
                      Life Purpose
                    </div>
                    <div className="text-purple-700">
                      {data.nakshatra_analysis?.life_purpose ||
                        "To serve others, develop spiritual wisdom, and create harmony through friendship and devotion."}
                    </div>
                  </div>
                </div>
              </div>

              {/* Karmic Lessons */}
              <div className="bg-white/90 p-6 rounded-lg border border-orange-200 shadow-sm">
                <h4 className="font-semibold text-orange-700 text-lg mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Karmic Lessons
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <div className="font-medium text-orange-800 mb-2">
                      Lessons to Learn
                    </div>
                    <div className="text-orange-700">
                      {data.nakshatra_analysis?.karmic_lessons ||
                        "Learning patience, developing inner strength, balancing material and spiritual pursuits."}
                    </div>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-lg">
                    <div className="font-medium text-amber-800 mb-2">
                      Spiritual Growth
                    </div>
                    <div className="text-amber-700">
                      {data.nakshatra_analysis?.spiritual_growth ||
                        "Growth through service, meditation, and developing compassion for all beings."}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 7: Dasha Predictions */}
        <Card className="bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 border-2 border-indigo-300 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Clock className="w-8 h-8" />
              7. ⏰ Dasha Predictions
            </CardTitle>
            <CardDescription className="text-indigo-100 text-lg">
              Vimshottari Dasha Timeline - Current and upcoming planetary
              periods
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            {(() => {
              // Get Dasha data
              const dashaData =
                data.dasha_periods?.authentic_timeline?.dasha_timeline ||
                data.dasha_periods?.periods ||
                [];

              if (dashaData.length > 0) {
                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {dashaData.slice(0, 6).map((dasha: any, index: number) => (
                      <div
                        key={index}
                        className={`relative p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                          dasha.is_current || dasha.isCurrent
                            ? "bg-gradient-to-br from-yellow-100 via-orange-100 to-pink-100 border-2 border-yellow-400 shadow-2xl transform scale-105"
                            : "bg-gradient-to-br from-white via-gray-50 to-white border border-gray-200"
                        }`}
                      >
                        {(dasha.is_current || dasha.isCurrent) && (
                          <div className="absolute -top-3 -right-3">
                            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 text-sm font-bold shadow-lg">
                              Current
                            </Badge>
                          </div>
                        )}

                        <div className="flex items-center justify-between mb-4">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shadow-lg">
                            <span className="text-white text-lg font-bold drop-shadow-lg">
                              {(
                                dasha.planet ||
                                dasha.mahadasha ||
                                "Unknown"
                              ).charAt(0)}
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-800">
                              {dasha.duration_years || "Unknown"}
                            </div>
                            <div className="text-sm text-gray-500">years</div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h3 className="text-xl font-bold text-gray-800">
                            {dasha.planet || dasha.mahadasha || "Unknown"}{" "}
                            Mahadasha
                          </h3>

                          {dasha.periods && dasha.periods !== "unknown" && (
                            <div className="bg-gray-100 rounded-lg p-3">
                              <div className="text-sm text-gray-600 mb-1">
                                Period
                              </div>
                              <div className="font-semibold text-gray-800">
                                {(dasha.start_date || dasha.start_period) &&
                                  (dasha.end_date || dasha.end_period) && (
                                    <div className="bg-gray-100 rounded-lg p-3">
                                      <div className="text-sm text-gray-600 mb-1">
                                        Period
                                      </div>
                                      <div className="font-semibold text-gray-800">
                                        {dasha.start_date || dasha.start_period}{" "}
                                        - {dasha.end_date || dasha.end_period}
                                      </div>
                                    </div>
                                  )}
                              </div>
                            </div>
                          )}

                          <div className="text-sm text-gray-700 leading-relaxed">
                            {dasha.effects ||
                              dasha.description ||
                              `${dasha.planet || dasha.mahadasha} period influences your life journey with unique opportunities and challenges.`}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              } else {
                return (
                  <div className="text-center text-gray-600">
                    <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>
                      Dasha predictions are being calculated based on your birth
                      details...
                    </p>
                  </div>
                );
              }
            })()}
          </CardContent>
        </Card>

        {/* Section 8: Dosha Analysis */}
        <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-300 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-6">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Shield className="w-8 h-8" />
              8. 🛡️ Dosha Analysis
            </CardTitle>
            <CardDescription className="text-red-100 text-lg">
              Mangal Dosha, Kaal Sarp Dosh, and other planetary afflictions
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            {(() => {
              const doshas = data.analysis?.doshas || data.doshas || [];

              if (doshas.length > 0) {
                return (
                  <div className="space-y-4">
                    {doshas.map((dosha: any, index: number) => (
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

                        {dosha.remedies && dosha.remedies.length > 0 && (
                          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                            <h6 className="font-semibold text-green-800 mb-2">
                              🌿 Remedies:
                            </h6>
                            <ul className="text-sm text-green-700 space-y-1">
                              {dosha.remedies.map(
                                (remedy: string, idx: number) => (
                                  <li
                                    key={idx}
                                    className="flex items-start gap-2"
                                  >
                                    <span className="text-green-500 mt-1">
                                      •
                                    </span>
                                    <span>{remedy}</span>
                                  </li>
                                ),
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                );
              } else {
                return (
                  <div className="text-center text-gray-600">
                    <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No significant doshas detected in your birth chart.</p>
                    <p className="text-sm text-gray-500 mt-2">
                      This indicates a balanced chart without major planetary
                      afflictions.
                    </p>
                  </div>
                );
              }
            })()}
          </CardContent>
        </Card>

        {/* Section 9: Yoga Analysis */}
        <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-300 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Zap className="w-8 h-8" />
              9. ⚡ Yoga Analysis
            </CardTitle>
            <CardDescription className="text-purple-100 text-lg">
              Raj Yogas, Dhana Yogas, and special planetary combinations
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            {(() => {
              const yogas =
                data.yogas || data.raj_yoga_analysis?.present_yogas || [];

              if (yogas.length > 0) {
                return (
                  <div className="space-y-6">
                    <div className="mb-6">
                      <h5 className="text-lg font-semibold text-green-700 mb-4 flex items-center gap-2">
                        <Crown className="w-5 h-5" />
                        Detected Yogas ({yogas.length})
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {yogas.map((yoga: any, index: number) => (
                          <div
                            key={index}
                            className="bg-white/80 p-4 rounded-lg border border-green-300 shadow-sm"
                          >
                            <h6 className="font-semibold text-green-700 mb-2">
                              {yoga.name || yoga}
                            </h6>
                            {yoga.description && (
                              <div className="text-sm space-y-2">
                                <div className="p-2 bg-purple-50 rounded text-purple-800 text-xs">
                                  <strong>Formation:</strong> {yoga.description}
                                </div>
                              </div>
                            )}
                            {yoga.effect && (
                              <div className="p-2 bg-green-50 rounded text-green-800 text-xs mt-2">
                                <strong>Effects:</strong> {yoga.effect}
                              </div>
                            )}
                            {yoga.strength && (
                              <div className="flex justify-between items-center mt-2">
                                <span className="text-gray-600">Strength:</span>
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
                            )}
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
                        Your birth chart contains {yogas.length} significant
                        yoga
                        {yogas.length !== 1 ? "s" : ""}, indicating specific
                        planetary combinations that influence your life path.
                        Each yoga represents unique opportunities and should be
                        understood in the context of your overall chart.
                      </p>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 text-center">
                    <p className="text-gray-600">
                      No significant yogas detected in your current birth chart
                      analysis.
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      This indicates a balanced chart without extreme planetary
                      combinations.
                    </p>
                  </div>
                );
              }
            })()}
          </CardContent>
        </Card>

        {/* Section 10: House Analysis */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Target className="w-8 h-8" />
              10. 🏠 House Analysis (1st to 12th)
            </CardTitle>
            <CardDescription className="text-green-100 text-lg">
              Detailed analysis of each house with planetary influences and
              predictions
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            {(() => {
              const houseAnalysis =
                data.comprehensive_house_analysis ||
                data.bhava_predictions ||
                {};

              if (Object.keys(houseAnalysis).length > 0) {
                return (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {Object.entries(houseAnalysis).map(
                      ([houseKey, houseData]: [string, any]) => {
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
                              {houseData.name || `House ${houseNumber}`}
                            </h5>

                            <div className="space-y-3 text-sm">
                              {/* House Significations */}
                              {houseData.significations && (
                                <div className="bg-blue-50 p-3 rounded border border-blue-200">
                                  <p className="text-blue-800">
                                    <strong>Significations:</strong>{" "}
                                    {houseData.significations}
                                  </p>
                                </div>
                              )}

                              {/* House Lord */}
                              {houseData.lord && (
                                <div className="bg-purple-50 p-3 rounded border border-purple-200">
                                  <p className="text-purple-800">
                                    <strong>House Lord:</strong>{" "}
                                    {houseData.lord}
                                  </p>
                                </div>
                              )}

                              {/* Predictions */}
                              {houseData.predictions && (
                                <div className="bg-green-50 p-3 rounded border border-green-200">
                                  <p className="text-green-800">
                                    <strong>Predictions:</strong>{" "}
                                    {houseData.predictions}
                                  </p>
                                </div>
                              )}

                              {/* Strength */}
                              {houseData.strength && (
                                <div className="bg-amber-50 p-3 rounded border border-amber-200">
                                  <p className="text-amber-800">
                                    <strong>Strength:</strong>{" "}
                                    {houseData.strength}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      },
                    )}
                  </div>
                );
              } else {
                return (
                  <div className="text-center text-gray-600">
                    <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>House analysis data is being calculated...</p>
                  </div>
                );
              }
            })()}
          </CardContent>
        </Card>

        {/* Section 11: Remedies */}
        <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-300 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Lightbulb className="w-8 h-8" />
              11. 💡 Remedies & Recommendations
            </CardTitle>
            <CardDescription className="text-purple-100 text-lg">
              Personalized remedies for planetary afflictions and life
              enhancement
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            {(() => {
              const remedies =
                data.comprehensive_remedies || data.remedies || [];

              if (Array.isArray(remedies) && remedies.length > 0) {
                return (
                  <div className="space-y-4">
                    {remedies.map((remedy: any, index: number) => (
                      <div
                        key={index}
                        className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200 style-none"
                      >
                        <p className="text-gray-700">{safeRender(remedy)}</p>
                      </div>
                    ))}
                  </div>
                );
              } else if (
                typeof remedies === "object" &&
                remedies !== null &&
                Object.keys(remedies).length > 0
              ) {
                return (
                  <div className="space-y-6">
                    {Object.entries(remedies).map(
                      (
                        [category, categoryRemedies]: [string, any],
                        index: number,
                      ) => (
                        <div
                          key={index}
                          className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200"
                        >
                          <h4 className="font-semibold text-purple-800 capitalize mb-3">
                            {category.replace("_", " ")}
                          </h4>
                          {typeof categoryRemedies === "object" &&
                          !Array.isArray(categoryRemedies) ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {Object.entries(categoryRemedies).map(
                                ([key, value]) => (
                                  <div
                                    key={key}
                                    className="bg-white/50 p-3 rounded"
                                  >
                                    <span className="font-medium text-purple-700 capitalize">
                                      {key.replace("_", " ")}:
                                    </span>
                                    <span className="text-gray-700 ml-2">
                                      {safeRender(value)}
                                    </span>
                                  </div>
                                ),
                              )}
                            </div>
                          ) : (
                            <p className="text-gray-700">
                              {safeRender(categoryRemedies)}
                            </p>
                          )}
                        </div>
                      ),
                    )}
                  </div>
                );
              } else {
                return (
                  <div className="text-center text-gray-600">
                    <Lightbulb className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>
                      Personalized remedies are being calculated based on your
                      birth chart...
                    </p>
                  </div>
                );
              }
            })()}
          </CardContent>
        </Card>

        {/* Section 12: Career & Finance Predictions */}
        <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-300 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Briefcase className="w-8 h-8" />
              12. 💼 Career & Finance Predictions
            </CardTitle>
            <CardDescription className="text-indigo-100 text-lg">
              Professional path analysis - Financial prospects - Business vs Job
              indications
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            {(() => {
              const careerAnalysis =
                data.comprehensive_career_analysis ||
                data.career_finance_predictions ||
                {};

              if (Object.keys(careerAnalysis).length > 0) {
                return (
                  <div className="space-y-6">
                    {/* Career Foundation */}
                    {careerAnalysis.career_foundation && (
                      <div className="bg-white/80 p-6 rounded-lg border border-indigo-200 shadow-sm">
                        <h5 className="font-semibold text-indigo-700 mb-4 flex items-center gap-2">
                          <Building className="h-5 w-5" />
                          Career Foundation
                        </h5>
                        <div className="space-y-3">
                          <div className="p-3 bg-indigo-50 rounded-lg">
                            <div className="font-medium text-indigo-800 mb-1">
                              Foundation
                            </div>
                            <div className="text-indigo-700">
                              {careerAnalysis.career_foundation.foundation ||
                                "Dynamic leadership with strong initiative"}
                            </div>
                          </div>
                          <div className="p-3 bg-purple-50 rounded-lg">
                            <div className="font-medium text-purple-800 mb-1">
                              Work Style
                            </div>
                            <div className="text-purple-700">
                              {careerAnalysis.career_foundation.work_style ||
                                "Systematic approach with focus on growth"}
                            </div>
                          </div>
                          {careerAnalysis.career_foundation.suitable_fields && (
                            <div className="p-3 bg-green-50 rounded-lg">
                              <div className="font-medium text-green-800 mb-1">
                                Suitable Fields
                              </div>
                              <div className="text-green-700">
                                {Array.isArray(
                                  careerAnalysis.career_foundation
                                    .suitable_fields,
                                )
                                  ? careerAnalysis.career_foundation.suitable_fields.join(
                                      ", ",
                                    )
                                  : careerAnalysis.career_foundation
                                      .suitable_fields}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Business vs Job Analysis */}
                    {careerAnalysis.business_vs_job && (
                      <div className="bg-white/80 p-6 rounded-lg border border-yellow-300 shadow-sm">
                        <h5 className="font-semibold text-yellow-700 mb-4 flex items-center gap-2">
                          <TrendingUp className="h-5 w-5" />
                          Business vs Job
                        </h5>
                        <div className="space-y-2 text-yellow-800">
                          <div>
                            Business Score:{" "}
                            {careerAnalysis.business_vs_job.business_score}
                          </div>
                          <div>
                            Job Score:{" "}
                            {careerAnalysis.business_vs_job.job_score}
                          </div>
                          <div>
                            Recommendation:{" "}
                            {careerAnalysis.business_vs_job.recommendation}
                          </div>
                          <div>
                            Reason: {careerAnalysis.business_vs_job.reason}
                          </div>
                          <div>
                            Strengths (Business):{" "}
                            {careerAnalysis.business_vs_job.detailed_analysis.business_strengths?.join(
                              ", ",
                            )}
                          </div>
                          <div>
                            Strengths (Job):{" "}
                            {careerAnalysis.business_vs_job.detailed_analysis.job_strengths?.join(
                              ", ",
                            )}
                          </div>
                          <div>
                            Timing Advice:{" "}
                            {
                              careerAnalysis.business_vs_job.detailed_analysis
                                .timing_advice
                            }
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Career Timeline */}
                    {careerAnalysis.career_timeline && (
                      <div className="bg-white/80 p-6 rounded-lg border border-indigo-300 shadow-sm">
                        <h5 className="font-semibold text-indigo-700 mb-4 flex items-center gap-2">
                          <Clock className="h-5 w-5" />
                          Career Timeline
                        </h5>
                        <div className="space-y-2 text-indigo-700">
                          {careerAnalysis.career_timeline.map(
                            (event: any, idx: number) => (
                              <div
                                key={idx}
                                className="p-2 bg-indigo-50 rounded"
                              >
                                <span className="font-medium">
                                  {event.age_range}:
                                </span>{" "}
                                {event.event}
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    )}

                    {/* Career Yogas */}
                    {careerAnalysis.career_yogas && (
                      <div className="bg-white/80 p-6 rounded-lg border border-purple-200 shadow-sm">
                        <h5 className="font-semibold text-purple-700 mb-4 flex items-center gap-2">
                          <Star className="h-5 w-5" />
                          Career Yogas
                        </h5>
                        <ul className="list-disc list-inside text-purple-700">
                          {careerAnalysis.career_yogas.map(
                            (yoga: string, idx: number) => (
                              <li key={idx}>{yoga}</li>
                            ),
                          )}
                        </ul>
                      </div>
                    )}

                    {/* Planetary Strengths */}
                    {careerAnalysis.planetary_strengths && (
                      <div className="bg-white/80 p-6 rounded-lg border border-blue-200 shadow-sm">
                        <h5 className="font-semibold text-blue-700 mb-4 flex items-center gap-2">
                          <Sun className="h-5 w-5" />
                          Planetary Strengths
                        </h5>
                        <div className="space-y-1 text-blue-700">
                          {Object.entries(
                            careerAnalysis.planetary_strengths,
                          ).map(([planet, info]: any) => (
                            <div key={planet}>
                              <span className="font-medium">{planet}:</span>{" "}
                              Level - {info.level}, Score -{" "}
                              {info.strength_score}, Career Impact -{" "}
                              {info.career_impact}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Remedial Measures */}
                    {careerAnalysis.remedial_measures && (
                      <div className="bg-white/80 p-6 rounded-lg border border-green-200 shadow-sm">
                        <h5 className="font-semibold text-green-700 mb-4 flex items-center gap-2">
                          <Lightbulb className="h-5 w-5" />
                          Remedial Measures
                        </h5>
                        <ul className="list-disc list-inside text-green-700">
                          {careerAnalysis.remedial_measures.map(
                            (remedy: string, idx: number) => (
                              <li key={idx}>{remedy}</li>
                            ),
                          )}
                        </ul>
                      </div>
                    )}

                    {/* Tenth Lord & Tenth House */}
                    {careerAnalysis.tenth_lord_analysis && (
                      <div className="bg-white/80 p-6 rounded-lg border border-purple-300 shadow-sm">
                        <h5 className="font-semibold text-purple-700 mb-4 flex items-center gap-2">
                          <Crown className="h-5 w-5" />
                          Tenth Lord Analysis
                        </h5>
                        <div className="text-purple-700 space-y-1">
                          <div>
                            Lord:{" "}
                            {careerAnalysis.tenth_lord_analysis.tenth_lord}
                          </div>
                          <div>
                            Placement House:{" "}
                            {careerAnalysis.tenth_lord_analysis.placement_house}
                          </div>
                          <div>
                            Strength Level:{" "}
                            {careerAnalysis.tenth_lord_analysis.strength_level}
                          </div>
                          <div>
                            Interpretation:{" "}
                            {careerAnalysis.tenth_lord_analysis.interpretation}
                          </div>
                          <div>
                            Quote:{" "}
                            {careerAnalysis.tenth_lord_analysis.ancient_quote}
                          </div>
                          <div>
                            Meaning:{" "}
                            {careerAnalysis.tenth_lord_analysis.quote_meaning}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Top Career Options */}
                    {careerAnalysis.top_career_options && (
                      <div className="bg-white/80 p-6 rounded-lg border border-indigo-400 shadow-sm">
                        <h5 className="font-semibold text-indigo-700 mb-4 flex items-center gap-2">
                          <Briefcase className="h-5 w-5" />
                          Top Career Options
                        </h5>
                        <ul className="list-decimal list-inside text-indigo-700">
                          {careerAnalysis.top_career_options.map(
                            (option: any, idx: number) => (
                              <li key={idx}>
                                {option.profession} - Score: {option.score} (
                                {option.factors})
                              </li>
                            ),
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              } else {
                return (
                  <div className="text-center text-gray-600">
                    <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>
                      Career and finance analysis is being prepared based on
                      your birth chart...
                    </p>
                  </div>
                );
              }
            })()}
          </CardContent>
        </Card>

        {/* Section 13: Marriage Analysis */}
        <Card className="bg-gradient-to-br from-rose-50 to-pink-50 border-2 border-rose-300 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-rose-600 to-pink-600 text-white p-6">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Heart className="w-8 h-8" />
              13. 💕 Marriage Analysis
            </CardTitle>
            <CardDescription className="text-rose-100 text-lg">
              7th house insights - Spouse traits - Compatibility - Timing &
              Remedies
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            {(() => {
              const analysis =
                data.detailed_marriage_analysis ||
                data.comprehensive_marriage_analysis ||
                {};

              if (Object.keys(analysis).length > 0) {
                return (
                  <div className="space-y-6">
                    {/* Marriage Timing */}
                    {analysis.marriage_timing && (
                      <div className="bg-white/80 p-6 rounded-lg border border-rose-200 shadow-sm">
                        <h5 className="font-semibold text-rose-700 mb-4 flex items-center gap-2">
                          <Calendar className="h-5 w-5" />
                          Marriage Timing
                        </h5>
                        <div className="text-rose-700 space-y-1">
                          <div>
                            Best Years: {analysis.marriage_timing.best_years}
                          </div>
                          <div>
                            Ideal Age: {analysis.marriage_timing.ideal_age}
                          </div>
                          <div>
                            Status: {analysis.marriage_timing.current_status}
                          </div>
                          <div>
                            Analysis: {analysis.marriage_timing.timing_analysis}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Spouse Characteristics */}
                    {analysis.spouse_characteristics && (
                      <div className="bg-white/80 p-6 rounded-lg border border-pink-200 shadow-sm">
                        <h5 className="font-semibold text-pink-700 mb-4 flex items-center gap-2">
                          <User className="h-5 w-5" />
                          Spouse Characteristics
                        </h5>
                        <div className="text-pink-700 space-y-1">
                          <div>
                            Nature: {analysis.spouse_characteristics.nature}
                          </div>
                          <div>
                            Appearance:{" "}
                            {analysis.spouse_characteristics.appearance}
                          </div>
                          <div>
                            Profession Likely:{" "}
                            {analysis.spouse_characteristics.profession_likely}
                          </div>
                          <div>
                            Compatibility Level:{" "}
                            {
                              analysis.spouse_characteristics
                                .compatibility_level
                            }
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Compatibility */}
                    {analysis.marital_harmony && (
                      <div className="bg-white/80 p-6 rounded-lg border border-purple-200 shadow-sm">
                        <h5 className="font-semibold text-purple-700 mb-4 flex items-center gap-2">
                          <Heart className="h-5 w-5" />
                          Marital Harmony & Compatibility
                        </h5>
                        <div className="text-purple-700 space-y-1">
                          <div>
                            Love Compatibility:{" "}
                            {analysis.marital_harmony.love_compatibility}
                          </div>
                          <div>
                            Emotional Connection:{" "}
                            {analysis.marital_harmony.emotional_connection}
                          </div>
                          <div>
                            Overall Harmony:{" "}
                            {analysis.marital_harmony.overall_harmony}
                          </div>
                          <div>
                            Challenges: {analysis.marital_harmony.challenges}
                          </div>
                          <div>
                            Spiritual Bond:{" "}
                            {analysis.marital_harmony.spiritual_bond}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Children Prospects */}
                    {analysis.children_prospects && (
                      <div className="bg-white/80 p-6 rounded-lg border border-green-200 shadow-sm">
                        <h5 className="font-semibold text-green-700 mb-4 flex items-center gap-2">
                          <Users className="h-5 w-5" />
                          Children Prospects
                        </h5>
                        <div className="text-green-700 space-y-1">
                          <div>
                            Prospects: {analysis.children_prospects.prospects}
                          </div>
                          <div>
                            Nature:{" "}
                            {analysis.children_prospects.children_nature}
                          </div>
                          <div>
                            Jupiter Influence:{" "}
                            {analysis.children_prospects.jupiter_influence}
                          </div>
                          <div>
                            Timing: {analysis.children_prospects.timing}
                          </div>
                          <div>
                            House Analysis:{" "}
                            {analysis.children_prospects.fifth_house_analysis}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Manglik Dosha */}
                    {analysis.manglik_dosha && (
                      <div className="bg-white/80 p-6 rounded-lg border border-red-200 shadow-sm">
                        <h5 className="font-semibold text-red-700 mb-4 flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5" />
                          Manglik Dosha
                        </h5>
                        <div className="text-red-700 space-y-1">
                          <div>Impact: {analysis.manglik_dosha.impact}</div>
                          <div>
                            Mars Position:{" "}
                            {analysis.manglik_dosha.mars_position}
                          </div>
                          <div>Severity: {analysis.manglik_dosha.severity}</div>
                          <div>Remedies: {analysis.manglik_dosha.remedies}</div>
                        </div>
                      </div>
                    )}

                    {/* Remedial Suggestions */}
                    {analysis.remedial_suggestions && (
                      <div className="bg-white/80 p-6 rounded-lg border border-blue-200 shadow-sm">
                        <h5 className="font-semibold text-blue-700 mb-4 flex items-center gap-2">
                          <Lightbulb className="h-5 w-5" />
                          Remedial Suggestions
                        </h5>
                        <div className="text-blue-700 space-y-1">
                          <div>
                            Gemstones:{" "}
                            {analysis.remedial_suggestions.gemstone_suggestions}
                          </div>
                          <div>
                            General Guidance:{" "}
                            {analysis.remedial_suggestions.general_guidance?.join(
                              ", ",
                            )}
                          </div>
                          <div>
                            Mantra Recommendations:{" "}
                            {
                              analysis.remedial_suggestions
                                .mantra_recommendations
                            }
                          </div>
                          <div>
                            Specific Remedies:{" "}
                            {analysis.remedial_suggestions.specific_remedies?.join(
                              ", ",
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Seventh House Analysis */}
                    {analysis.seventh_house_analysis && (
                      <div className="bg-white/80 p-6 rounded-lg border border-indigo-200 shadow-sm">
                        <h5 className="font-semibold text-indigo-700 mb-4 flex items-center gap-2">
                          <Book className="h-5 w-5" />
                          Seventh House Insights
                        </h5>
                        <div className="text-indigo-700 space-y-1">
                          <div>
                            House Sign:{" "}
                            {analysis.seventh_house_analysis.house_sign}
                          </div>
                          <div>
                            Planets:{" "}
                            {analysis.seventh_house_analysis.planets_in_seventh?.join(
                              ", ",
                            )}
                          </div>
                          <div>
                            Seventh Lord Position:{" "}
                            {
                              analysis.seventh_house_analysis
                                .seventh_lord_position
                            }
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Venus Analysis */}
                    {analysis.venus_analysis && (
                      <div className="bg-white/80 p-6 rounded-lg border border-pink-300 shadow-sm">
                        <h5 className="font-semibold text-pink-700 mb-4 flex items-center gap-2">
                          <Star className="h-5 w-5" />
                          Venus Analysis
                        </h5>
                        <div className="text-pink-700 space-y-1">
                          <div>
                            House Position:{" "}
                            {analysis.venus_analysis.house_position}
                          </div>
                          <div>Effects: {analysis.venus_analysis.effects}</div>
                          <div>
                            Marriage Quality:{" "}
                            {analysis.venus_analysis.marriage_quality}
                          </div>
                          <div>
                            Romance Factor:{" "}
                            {analysis.venus_analysis.romance_factor}
                          </div>
                          <div>
                            Strength: {analysis.venus_analysis.strength}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              } else {
                return (
                  <div className="text-center text-gray-600">
                    <Heart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>
                      Marriage analysis is being prepared based on your 7th
                      house configuration...
                    </p>
                  </div>
                );
              }
            })()}
          </CardContent>
        </Card>

        {/* Section 14: Annual Forecast */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Calendar className="w-8 h-8" />
              14. 📅 Annual Forecast
            </CardTitle>
            <CardDescription className="text-green-100 text-lg">
              Year-wise predictions - Auspicious periods - Key advice for
              upcoming years
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            {(() => {
              const forecast =
                data.annual_forecast ||
                data.comprehensive_annual_predictions ||
                [];

              if (forecast.length > 0) {
                return (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {forecast.map((monthData: any, idx: number) => (
                        <div
                          key={idx}
                          className="bg-white/80 p-5 rounded-lg border border-green-200 shadow-sm"
                        >
                          <h5 className="font-semibold text-green-700 mb-3">
                            {monthData.month ||
                              monthData.period ||
                              `Month ${idx + 1}`}
                          </h5>
                          <ul className="text-green-700 text-sm space-y-1">
                            {monthData.career && (
                              <li>
                                <strong>Career:</strong> {monthData.career}
                              </li>
                            )}
                            {monthData.finance && (
                              <li>
                                <strong>Finance:</strong> {monthData.finance}
                              </li>
                            )}
                            {monthData.health && (
                              <li>
                                <strong>Health:</strong> {monthData.health}
                              </li>
                            )}
                            {monthData.relationships && (
                              <li>
                                <strong>Relationships:</strong>{" "}
                                {monthData.relationships}
                              </li>
                            )}
                          </ul>
                        </div>
                      ))}
                    </div>

                    {/* Optional Key Advice */}
                    {data.comprehensive_annual_predictions?.key_advice && (
                      <div className="bg-white/80 p-6 rounded-lg border border-blue-200 shadow-sm">
                        <h5 className="font-semibold text-blue-700 mb-4 flex items-center gap-2">
                          <Lightbulb className="h-5 w-5" />
                          Key Advice for the Year
                        </h5>
                        <div className="space-y-1 text-sm">
                          {data.comprehensive_annual_predictions.key_advice.map(
                            (advice: string, index: number) => (
                              <div key={index} className="text-blue-700">
                                • {advice}
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              } else {
                return (
                  <div className="text-center text-gray-600">
                    <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>
                      Annual forecast is being prepared based on your planetary
                      periods...
                    </p>
                  </div>
                );
              }
            })()}
          </CardContent>
        </Card>

        {/* Section 15: Psychological Analysis */}
        <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-300 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Eye className="w-8 h-8" />
              15. 🧠 Psychological Analysis
            </CardTitle>
            <CardDescription className="text-purple-100 text-lg">
              Mental characteristics - Emotional patterns - Psychological
              insights
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            {(() => {
              const psychAnalysis = data.psychological_analysis || {};
              const moonProfile = data.moon_emotional_profile || {};

              const renderValue = (val: any) => {
                if (!val) return null;
                if (typeof val === "string") return <p>{val}</p>;
                if (typeof val === "object") {
                  return (
                    <ul className="list-disc pl-5 space-y-1">
                      {Object.entries(val).map(([k, v]) => (
                        <li key={k}>
                          <span className="font-medium capitalize">{k}:</span>{" "}
                          {String(v)}
                        </li>
                      ))}
                    </ul>
                  );
                }
                return <p>{String(val)}</p>;
              };

              if (
                Object.keys(psychAnalysis).length > 0 ||
                Object.keys(moonProfile).length > 0
              ) {
                return (
                  <div className="space-y-6">
                    {/* Mental Characteristics */}
                    {psychAnalysis.mental_constitution && (
                      <div className="bg-white/80 p-6 rounded-lg border border-purple-200 shadow-sm">
                        <h5 className="font-semibold text-purple-700 mb-4 flex items-center gap-2">
                          <Eye className="h-5 w-5" />
                          Mental Characteristics
                        </h5>
                        <div className="text-purple-700">
                          {renderValue(psychAnalysis.mental_constitution)}
                        </div>
                      </div>
                    )}
                    {psychAnalysis.mental_health_recommendations && (
                      <div className="bg-white/80 p-6 rounded-lg border border-purple-200 shadow-sm">
                        <h5 className="font-semibold text-purple-700 mb-4 flex items-center gap-2">
                          <Eye className="h-5 w-5" />
                          Mental Health Recommendations
                        </h5>
                        <div className="text-purple-700">
                          {renderValue(
                            psychAnalysis.mental_health_recommendations,
                          )}
                        </div>
                      </div>
                    )}
                    {psychAnalysis.personality_traits && (
                      <div className="bg-white/80 p-6 rounded-lg border border-purple-200 shadow-sm">
                        <h5 className="font-semibold text-purple-700 mb-4 flex items-center gap-2">
                          <Eye className="h-5 w-5" />
                          Mental Personality Traits
                        </h5>
                        <div className="text-purple-700">
                          {renderValue(psychAnalysis.personality_traits)}
                        </div>
                      </div>
                    )}

                    {/* Emotional Patterns */}
                    {(moonProfile.emotional_temperament ||
                      moonProfile.nakshatra_emotional_pattern ||
                      moonProfile.emotional_growth_areas ||
                      moonProfile.emotional_strength_areas ||
                      moonProfile.emotional_healing_guidance ||
                      psychAnalysis.emotional_patterns) && (
                      <div className="bg-white/80 p-6 rounded-lg border border-indigo-200 shadow-sm">
                        <h5 className="font-semibold text-indigo-700 mb-4 flex items-center gap-2">
                          <Moon className="h-5 w-5" />
                          Emotional Nature
                        </h5>
                        <div className="text-indigo-700 space-y-3">
                          {/* Temperament */}
                          {moonProfile.emotional_temperament && (
                            <p>
                              <strong>Temperament:</strong>{" "}
                              {moonProfile.emotional_temperament}
                            </p>
                          )}

                          {/* Nakshatra Pattern */}
                          {moonProfile.nakshatra_emotional_pattern && (
                            <p>
                              <strong>Nakshatra Pattern:</strong>{" "}
                              {moonProfile.nakshatra_emotional_pattern}
                            </p>
                          )}

                          {/* Strength Areas */}
                          {Array.isArray(
                            moonProfile.emotional_strength_areas,
                          ) && (
                            <div>
                              <strong>Strengths:</strong>
                              <ul className="list-disc list-inside">
                                {moonProfile.emotional_strength_areas.map(
                                  (item, idx) => (
                                    <li key={idx}>{item}</li>
                                  ),
                                )}
                              </ul>
                            </div>
                          )}

                          {/* Growth Areas */}
                          {Array.isArray(
                            moonProfile.emotional_growth_areas,
                          ) && (
                            <div>
                              <strong>Growth Areas:</strong>
                              <ul className="list-disc list-inside">
                                {moonProfile.emotional_growth_areas.map(
                                  (item, idx) => (
                                    <li key={idx}>{item}</li>
                                  ),
                                )}
                              </ul>
                            </div>
                          )}

                          {/* Healing Guidance */}
                          {moonProfile.emotional_healing_guidance && (
                            <p>
                              <strong>Healing Guidance:</strong>{" "}
                              {moonProfile.emotional_healing_guidance}
                            </p>
                          )}

                          {/* Compatibility Style */}
                          {moonProfile.compatibility_emotional_style && (
                            <p>
                              <strong>Compatibility:</strong>{" "}
                              {moonProfile.compatibility_emotional_style}
                            </p>
                          )}

                          {/* Fallback: old analysis field */}
                          {psychAnalysis.emotional_patterns && (
                            <p>{psychAnalysis.emotional_patterns}</p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Decision Making Style */}
                    {psychAnalysis.behavioral_patterns && (
                      <div className="bg-white/80 p-6 rounded-lg border border-green-200 shadow-sm">
                        <h5 className="font-semibold text-green-700 mb-4 flex items-center gap-2">
                          <Target className="h-5 w-5" />
                          Decision Making Style
                        </h5>
                        <div className="text-green-700">
                          {renderValue(psychAnalysis.behavioral_patterns)}
                        </div>
                      </div>
                    )}
                  </div>
                );
              } else {
                return (
                  <div className="text-center text-gray-600">
                    <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>
                      Psychological analysis is being prepared based on your
                      Moon sign and Mercury placement...
                    </p>
                  </div>
                );
              }
            })()}
          </CardContent>
        </Card>

        {/* Section 16: Special Combinations */}
        <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-300 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-amber-600 to-yellow-600 text-white p-6">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Sparkles className="w-8 h-8" />
              16. ✨ Special Combinations
            </CardTitle>
            <CardDescription className="text-amber-100 text-lg">
              Rare planetary combinations - Special yogas - Unique astrological
              features
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            {(() => {
              const specialCombinations = data.yogas || [];

              if (specialCombinations.length > 0) {
                return (
                  <div className="space-y-6">
                    {specialCombinations.map(
                      (combination: any, index: number) => (
                        <div
                          key={index}
                          className="bg-white/80 p-6 rounded-lg border border-amber-200 shadow-sm"
                        >
                          {/* Title */}
                          <h5 className="font-semibold text-amber-700 mb-3 flex items-center gap-2">
                            <Sparkles className="h-5 w-5" />
                            {combination.name ||
                              `Special Combination ${index + 1}`}
                          </h5>

                          {/* Details */}
                          <div className="space-y-2 text-amber-700">
                            {combination.description && (
                              <p>
                                <strong>Description:</strong>{" "}
                                {combination.description}
                              </p>
                            )}
                            {combination.effect && (
                              <p>
                                <strong>Effect:</strong> {combination.effect}
                              </p>
                            )}
                            {combination.planets_involved && (
                              <p>
                                <strong>Planets Involved:</strong>{" "}
                                {combination.planets_involved.join(", ")}
                              </p>
                            )}
                            {combination.house_position && (
                              <p>
                                <strong>House Position:</strong>{" "}
                                {combination.house_position}
                              </p>
                            )}
                            {combination.strength && (
                              <p>
                                <strong>Strength:</strong>{" "}
                                {combination.strength}
                              </p>
                            )}
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                );
              } else {
                return (
                  <div className="text-center text-gray-600">
                    <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>
                      Special planetary combinations analysis in progress...
                    </p>
                  </div>
                );
              }
            })()}
          </CardContent>
        </Card>

        {/* Section 17: Bhava Predictions */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Home className="w-8 h-8" />
              17. 🏠 Bhava Predictions
            </CardTitle>
            <CardDescription className="text-green-100 text-lg">
              House-by-house life predictions - Detailed bhava analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            {(() => {
              const bhavaPredictions = data.bhava_chart_analysis?.houses || {};

              if (Object.keys(bhavaPredictions).length > 0) {
                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.entries(bhavaPredictions).map(
                      ([key, house]: [string, any]) => (
                        <div
                          key={key}
                          className="bg-white/80 p-5 rounded-lg border border-green-200 shadow-sm"
                        >
                          <h5 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                            <Home className="h-5 w-5" />
                            {house.name || key}
                          </h5>
                          <div className="text-sm text-green-700 space-y-1">
                            {house.analysis && (
                              <p>
                                <strong>Analysis:</strong> {house.analysis}
                              </p>
                            )}
                            {house.planets && house.planets.length > 0 && (
                              <p>
                                <strong>Planets:</strong>{" "}
                                {house.planets.join(", ")}
                              </p>
                            )}
                            {house.significance && (
                              <p>
                                <strong>Significance:</strong>{" "}
                                {house.significance}
                              </p>
                            )}
                            {house.strength && (
                              <p>
                                <strong>Strength:</strong> {house.strength}
                              </p>
                            )}
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                );
              } else {
                return (
                  <div className="text-center text-gray-600">
                    <Home className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>House-by-house predictions are being calculated...</p>
                  </div>
                );
              }
            })()}
          </CardContent>
        </Card>

        {/* Section 18: Arudha Lagna Analysis */}
        <Card className="bg-gradient-to-br from-violet-50 to-purple-50 border-2 border-violet-300 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-violet-600 to-purple-600 text-white p-6">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Target className="w-8 h-8" />
              18. 🎯 Arudha Lagna Analysis
            </CardTitle>
            <CardDescription className="text-violet-100 text-lg">
              Perception and image analysis - How others see you
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            {(() => {
              const arudha = data.arudha_lagna_analysis || {};

              if (Object.keys(arudha).length > 0) {
                return (
                  <div className="space-y-6">
                    {arudha.arudha_sign && (
                      <div className="bg-white/80 p-6 rounded-lg border border-violet-200 shadow-sm">
                        <h5 className="font-semibold text-violet-700 mb-4 flex items-center gap-2">
                          <Eye className="h-5 w-5" />
                          Arudha Sign
                        </h5>
                        <div className="text-violet-700">
                          {arudha.arudha_sign}
                        </div>
                      </div>
                    )}

                    {arudha.public_image && (
                      <div className="bg-white/80 p-6 rounded-lg border border-purple-200 shadow-sm">
                        <h5 className="font-semibold text-purple-700 mb-4 flex items-center gap-2">
                          <Users className="h-5 w-5" />
                          Public Image
                        </h5>
                        <div className="text-purple-700">
                          {arudha.public_image}
                        </div>
                      </div>
                    )}

                    {arudha.career_image && (
                      <div className="bg-white/80 p-6 rounded-lg border border-indigo-200 shadow-sm">
                        <h5 className="font-semibold text-indigo-700 mb-4 flex items-center gap-2">
                          <Target className="h-5 w-5" />
                          Career / Professional Image
                        </h5>
                        <div className="text-indigo-700">
                          {arudha.career_image}
                        </div>
                      </div>
                    )}

                    {arudha.maya_vs_reality && (
                      <div className="bg-white/80 p-6 rounded-lg border border-pink-200 shadow-sm">
                        <h5 className="font-semibold text-pink-700 mb-4 flex items-center gap-2">
                          <Crown className="h-5 w-5" />
                          Maya vs Reality
                        </h5>
                        <div className="text-pink-700 whitespace-pre-line">
                          {arudha.maya_vs_reality}
                        </div>
                      </div>
                    )}

                    {arudha.reputation && (
                      <div className="bg-white/80 p-6 rounded-lg border border-teal-200 shadow-sm">
                        <h5 className="font-semibold text-teal-700 mb-4 flex items-center gap-2">
                          <Crown className="h-5 w-5" />
                          Reputation Factors
                        </h5>
                        <div className="text-teal-700">{arudha.reputation}</div>
                      </div>
                    )}

                    {arudha.social_status && (
                      <div className="bg-white/80 p-6 rounded-lg border border-yellow-200 shadow-sm">
                        <h5 className="font-semibold text-yellow-700 mb-4 flex items-center gap-2">
                          <Users className="h-5 w-5" />
                          Social Status
                        </h5>
                        <div className="text-yellow-700">
                          {arudha.social_status}
                        </div>
                      </div>
                    )}
                  </div>
                );
              } else {
                return (
                  <div className="text-center text-gray-600">
                    <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>
                      Arudha Lagna analysis is being calculated based on your
                      chart...
                    </p>
                  </div>
                );
              }
            })()}
          </CardContent>
        </Card>

        {/* Section 19: Atma Karaka Analysis */}
        <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-300 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Sun className="w-8 h-8" />
              19. ☀️ Atma Karaka Analysis
            </CardTitle>
            <CardDescription className="text-orange-100 text-lg">
              Soul's purpose and karmic lessons - Spiritual evolution path
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            {(() => {
              const atma = data.atma_karaka_analysis || {};

              if (Object.keys(atma).length > 0) {
                return (
                  <div className="space-y-6">
                    {atma.planet && (
                      <div className="bg-white/80 p-6 rounded-lg border border-orange-200 shadow-sm">
                        <h5 className="font-semibold text-orange-700 mb-4 flex items-center gap-2">
                          <Sun className="h-5 w-5" />
                          Atma Karaka Planet
                        </h5>
                        <div className="text-orange-700">{atma.planet}</div>
                      </div>
                    )}

                    {atma.sign && (
                      <div className="bg-white/80 p-6 rounded-lg border border-red-200 shadow-sm">
                        <h5 className="font-semibold text-red-700 mb-4 flex items-center gap-2">
                          <BookOpen className="h-5 w-5" />
                          Zodiac Sign
                        </h5>
                        <div className="text-red-700">{atma.sign}</div>
                      </div>
                    )}

                    {atma.house && (
                      <div className="bg-white/80 p-6 rounded-lg border border-yellow-200 shadow-sm">
                        <h5 className="font-semibold text-yellow-700 mb-4 flex items-center gap-2">
                          <Target className="h-5 w-5" />
                          House Placement
                        </h5>
                        <div className="text-yellow-700">{`House ${atma.house}`}</div>
                      </div>
                    )}

                    {atma.soul_purpose && (
                      <div className="bg-white/80 p-6 rounded-lg border border-orange-200 shadow-sm">
                        <h5 className="font-semibold text-orange-700 mb-4 flex items-center gap-2">
                          <Sun className="h-5 w-5" />
                          Soul's Purpose
                        </h5>
                        <div className="text-orange-700">
                          {atma.soul_purpose}
                        </div>
                      </div>
                    )}

                    {atma.life_mission && (
                      <div className="bg-white/80 p-6 rounded-lg border border-red-200 shadow-sm">
                        <h5 className="font-semibold text-red-700 mb-4 flex items-center gap-2">
                          <BookOpen className="h-5 w-5" />
                          Life Mission
                        </h5>
                        <div className="text-red-700 whitespace-pre-line">
                          {atma.life_mission}
                        </div>
                      </div>
                    )}

                    {atma.karmic_lessons && (
                      <div className="bg-white/80 p-6 rounded-lg border border-purple-200 shadow-sm">
                        <h5 className="font-semibold text-purple-700 mb-4 flex items-center gap-2">
                          <Sparkles className="h-5 w-5" />
                          Karmic Lessons
                        </h5>
                        <div className="text-purple-700">
                          {atma.karmic_lessons}
                        </div>
                      </div>
                    )}

                    {atma.spiritual_development && (
                      <div className="bg-white/80 p-6 rounded-lg border border-teal-200 shadow-sm">
                        <h5 className="font-semibold text-teal-700 mb-4 flex items-center gap-2">
                          <Sparkles className="h-5 w-5" />
                          Spiritual Development
                        </h5>
                        <div className="text-teal-700">
                          {atma.spiritual_development}
                        </div>
                      </div>
                    )}

                    {atma.spiritual_evolution && (
                      <div className="bg-white/80 p-6 rounded-lg border border-pink-200 shadow-sm">
                        <h5 className="font-semibold text-pink-700 mb-4 flex items-center gap-2">
                          <Sparkles className="h-5 w-5" />
                          Spiritual Evolution
                        </h5>
                        <div className="text-pink-700">
                          {atma.spiritual_evolution}
                        </div>
                      </div>
                    )}
                  </div>
                );
              } else {
                return (
                  <div className="text-center text-gray-600">
                    <Sun className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>
                      Atma Karaka analysis is being prepared based on your
                      highest degree planet...
                    </p>
                  </div>
                );
              }
            })()}
          </CardContent>
        </Card>

        {/* Section 20: Accident Prone Periods */}
        <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-300 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-6">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <AlertTriangle className="w-8 h-8" />
              20. ⚠️ Accident Prone Periods
            </CardTitle>
            <CardDescription className="text-red-100 text-lg">
              Health precautions - Safety recommendations - Vulnerable periods
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            {(() => {
              const accidents = data.accident_prone_periods || {};

              if (Object.keys(accidents).length > 0) {
                return (
                  <div className="space-y-6">
                    {/* Summary */}
                    {accidents.summary && (
                      <div className="bg-white/80 p-6 rounded-lg border border-red-200 shadow-sm">
                        <h5 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5" />
                          Summary
                        </h5>
                        <div className="text-red-700">{accidents.summary}</div>
                      </div>
                    )}

                    {/* High-risk periods */}
                    {accidents.high_risk_periods && (
                      <div className="bg-white/80 p-6 rounded-lg border border-orange-200 shadow-sm">
                        <h5 className="font-semibold text-orange-700 mb-3 flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5" />
                          High-Risk Periods
                        </h5>
                        <div className="text-orange-700">
                          {Object.entries(accidents.high_risk_periods).map(
                            ([period, desc], idx) => (
                              <div key={idx} className="mb-2">
                                <strong>{period.replace(/_/g, " ")}:</strong>{" "}
                                {desc}
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    )}

                    {/* Preventive Measures */}
                    {accidents.preventive_measures && (
                      <div className="bg-white/80 p-6 rounded-lg border border-yellow-200 shadow-sm">
                        <h5 className="font-semibold text-yellow-700 mb-3 flex items-center gap-2">
                          <Shield className="h-5 w-5" />
                          Preventive Measures
                        </h5>
                        <div className="text-yellow-700">
                          {Object.entries(accidents.preventive_measures).map(
                            ([key, value], idx) => (
                              <div key={idx} className="mb-1">
                                <strong>{key.replace(/_/g, " ")}:</strong>{" "}
                                {value}
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    )}

                    {/* Remedial Actions */}
                    {accidents.remedial_actions &&
                      accidents.remedial_actions.length > 0 && (
                        <div className="bg-white/80 p-6 rounded-lg border border-green-200 shadow-sm">
                          <h5 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                            <Heart className="h-5 w-5" />
                            Remedial Actions
                          </h5>
                          <ul className="list-disc list-inside text-green-700">
                            {accidents.remedial_actions.map(
                              (action: string, idx: number) => (
                                <li key={idx}>{action}</li>
                              ),
                            )}
                          </ul>
                        </div>
                      )}

                    {/* Risk Factors */}
                    {accidents.risk_factors && (
                      <div className="bg-white/80 p-6 rounded-lg border border-red-300 shadow-sm">
                        <h5 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5" />
                          Risk Factors
                        </h5>
                        <div className="text-red-700">
                          {Object.entries(accidents.risk_factors).map(
                            ([key, value], idx) => (
                              <div key={idx} className="mb-1">
                                <strong>{key.replace(/_/g, " ")}:</strong>{" "}
                                {value}
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              } else {
                return (
                  <div className="text-center text-gray-600">
                    <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>
                      Analyzing planetary periods for health and safety
                      guidance...
                    </p>
                  </div>
                );
              }
            })()}
          </CardContent>
        </Card>

        {/* Section 21: Life Journey Analysis */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <TrendingUp className="w-8 h-8" />
              21. 🚀 Life Journey Analysis
            </CardTitle>
            <CardDescription className="text-blue-100 text-lg">
              Comprehensive life phases - Evolution timeline - Major life themes
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            {(() => {
              const journey = data.comprehensive_life_journey || {};
              const summary = data.life_summary || {};

              if (
                !Object.keys(journey).length &&
                !Object.keys(summary).length
              ) {
                return (
                  <div className="text-center text-gray-600">
                    <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Life journey analysis is being prepared...</p>
                  </div>
                );
              }

              return (
                <div className="space-y-6">
                  {/* Life Phases */}
                  {journey.life_phases && (
                    <div className="bg-white/80 p-6 rounded-lg border border-blue-200 shadow-sm">
                      <h5 className="font-semibold text-blue-700 mb-4 flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Life Phases
                      </h5>
                      <p className="text-blue-700">{journey.life_phases}</p>
                    </div>
                  )}

                  {/* Major Themes */}
                  {journey.major_themes && (
                    <div className="bg-white/80 p-6 rounded-lg border border-indigo-200 shadow-sm">
                      <h5 className="font-semibold text-indigo-700 mb-4 flex items-center gap-2">
                        <Star className="h-5 w-5" />
                        Major Life Themes
                      </h5>
                      <p className="text-indigo-700">{journey.major_themes}</p>
                    </div>
                  )}

                  {/* Evolution Path */}
                  {journey.evolution_path && (
                    <div className="bg-white/80 p-6 rounded-lg border border-purple-200 shadow-sm">
                      <h5 className="font-semibold text-purple-700 mb-4 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Evolution Path
                      </h5>
                      <p className="text-purple-700">
                        {journey.evolution_path}
                      </p>
                    </div>
                  )}

                  {/* Early Life */}
                  {summary.early_life && (
                    <div className="bg-white/80 p-6 rounded-lg border border-blue-200 shadow-sm">
                      <h5 className="font-semibold text-blue-700 mb-4 flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Early Life
                      </h5>
                      {Object.entries(summary.early_life).map(([k, v]) => (
                        <p key={k} className="text-blue-700 mb-2">
                          <strong>{k.replace(/_/g, " ")}:</strong> {v}
                        </p>
                      ))}
                    </div>
                  )}

                  {/* Later Life */}
                  {summary.later_life && (
                    <div className="bg-white/80 p-6 rounded-lg border border-indigo-200 shadow-sm">
                      <h5 className="font-semibold text-indigo-700 mb-4 flex items-center gap-2">
                        <Star className="h-5 w-5" />
                        Later Life
                      </h5>
                      {Object.entries(summary.later_life).map(([k, v]) => (
                        <p key={k} className="text-indigo-700 mb-2">
                          <strong>{k.replace(/_/g, " ")}:</strong> {v}
                        </p>
                      ))}
                    </div>
                  )}

                  {/* Life Pattern */}
                  {summary.life_pattern && (
                    <div className="bg-white/80 p-6 rounded-lg border border-purple-200 shadow-sm">
                      <h5 className="font-semibold text-purple-700 mb-4 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Life Pattern
                      </h5>
                      <p className="text-purple-700">{summary.life_pattern}</p>
                    </div>
                  )}

                  {/* Middle Life */}
                  {summary.middle_life && (
                    <div className="bg-white/80 p-6 rounded-lg border border-orange-300 shadow-sm">
                      <h5 className="font-semibold text-orange-700 mb-4 flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Middle Life
                      </h5>
                      {Object.entries(summary.middle_life).map(([k, v]) => (
                        <p key={k} className="text-orange-700 mb-2">
                          <strong>{k.replace(/_/g, " ")}:</strong> {v}
                        </p>
                      ))}
                    </div>
                  )}

                  {/* Overall Life Pattern */}
                  {summary.overall_life_pattern && (
                    <div className="bg-white/80 p-6 rounded-lg border border-green-300 shadow-sm">
                      <h5 className="font-semibold text-green-700 mb-4 flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Overall Life Pattern
                      </h5>
                      {Object.entries(summary.overall_life_pattern).map(
                        ([k, v]) => (
                          <p key={k} className="text-green-700 mb-2">
                            <strong>{k.replace(/_/g, " ")}:</strong>{" "}
                            {Array.isArray(v) ? v.join(", ") : v}
                          </p>
                        ),
                      )}
                    </div>
                  )}

                  {/* Key Strengths */}
                  {summary.key_strengths && (
                    <div className="bg-white/80 p-6 rounded-lg border border-blue-200 shadow-sm">
                      <h5 className="font-semibold text-blue-700 mb-4 flex items-center gap-2">
                        <Star className="h-5 w-5" />
                        Key Strengths
                      </h5>
                      <ul className="text-blue-700 list-disc list-inside">
                        {summary.key_strengths.map((strength, idx) => (
                          <li key={idx}>{strength}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Life Challenges */}
                  {summary.life_challenges && (
                    <div className="bg-white/80 p-6 rounded-lg border border-red-200 shadow-sm">
                      <h5 className="font-semibold text-red-700 mb-4 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        Life Challenges
                      </h5>
                      <ul className="text-red-700 list-disc list-inside">
                        {summary.life_challenges.map((challenge, idx) => (
                          <li key={idx}>{challenge}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Summary */}
                  {summary.summary && (
                    <div className="bg-white/80 p-6 rounded-lg border border-purple-200 shadow-sm">
                      <h5 className="font-semibold text-purple-700 mb-4 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Summary
                      </h5>
                      <p className="text-purple-700">{summary.summary}</p>
                    </div>
                  )}
                </div>
              );
            })()}
          </CardContent>
        </Card>

        {/* Final Certificate Section */}
        <div className="mt-16">
          <Card className="border-amber-200 shadow-2xl bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
            <CardContent className="p-12">
              <div className="text-center">
                <div className="mb-8">
                  <Crown className="h-16 w-16 text-amber-600 mx-auto mb-4" />
                  <div className="w-32 h-1 bg-gradient-to-r from-amber-400 to-orange-400 mx-auto mb-4"></div>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Certificate of Authenticity
                </h3>
                <p className="text-gray-700 mb-4">
                  This comprehensive Super Horoscope Report has been prepared
                  using authentic Vedic astrology principles and calculations
                  based on precise birth details.
                </p>
                <div className="border-t-2 border-gray-200 pt-4 mt-4">
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <strong>Prepared by:</strong>
                      <br />
                      AstroTick.com
                      <br />
                      Certified Vedic Astrologers
                    </div>
                    <div>
                      <strong>Report Date:</strong>
                      <br />
                      {new Date().toLocaleDateString()}
                      <br />
                      Premium Analysis
                    </div>
                  </div>
                  <div className="mt-4 text-xs text-gray-500">
                    This report contains comprehensive astrological insights
                    based on authentic Vedic calculations and Swiss Ephemeris
                    data.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
