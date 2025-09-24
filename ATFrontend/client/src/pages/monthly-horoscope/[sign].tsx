import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "src/components/ui/card";
import { Badge } from "src/components/ui/badge";
import { Button } from "src/components/ui/button";
import {
  Calendar,
  Star,
  Heart,
  Briefcase,
  Activity,
  DollarSign,
  Sparkles,
  ArrowLeft,
  TrendingUp,
  Target,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useParams } from "wouter";
import { Link } from "wouter";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";

interface MonthlyHoroscopeData {
  sign: string;
  sanskritName?: string;
  tamilName?: string;
  symbol?: string;
  period: "monthly";
  month: string;
  year: number;
  prediction: string;
  monthlyThemes: string[];
  majorTransits: string;
  opportunities: string;
  challenges: string;
  loveLife: string;
  career: string;
  health: string;
  finances: string;
  spirituality: string;
  advice: string;
  importantDates: string[];
}

const zodiacSigns = [
  { name: "Aries", image: "Aries.jpg" },
  { name: "Taurus", image: "Taurus.jpg" },
  { name: "Gemini", image: "Gemini.jpg" },
  { name: "Cancer", image: "Cancer.jpg" },
  { name: "Leo", image: "Leo.jpg" },
  { name: "Virgo", image: "Virgo.jpg" },
  { name: "Libra", image: "Libra.jpg" },
  { name: "Scorpio", image: "Scorpio.jpg" },
  { name: "Sagittarius", image: "Sagittarius.jpg" },
  { name: "Capricorn", image: "Capricorn.jpg" },
  { name: "Aquarius", image: "Aquarius.jpg" },
  { name: "Pisces", image: "Pisces.jpg" },
];

const vedicSignData = {
  Aries: { sanskrit: "Mesha", hindi: "मेष", tamil: "மேஷம்", symbol: "Ram" },
  Taurus: {
    sanskrit: "Vrishabha",
    hindi: "वृषभ",
    tamil: "ரிஷபம்",
    symbol: "Bull",
  },
  Gemini: {
    sanskrit: "Mithuna",
    hindi: "मिथुन",
    tamil: "மிதுனம்",
    symbol: "Twins",
  },
  Cancer: { sanskrit: "Karka", hindi: "कर्क", tamil: "கடகம்", symbol: "Crab" },
  Leo: { sanskrit: "Simha", hindi: "सिंह", tamil: "சிம்மம்", symbol: "Lion" },
  Virgo: {
    sanskrit: "Kanya",
    hindi: "कन्या",
    tamil: "கன்னி",
    symbol: "Maiden",
  },
  Libra: { sanskrit: "Tula", hindi: "तुला", tamil: "துலாம்", symbol: "Scales" },
  Scorpio: {
    sanskrit: "Vrischika",
    hindi: "वृश्चिक",
    tamil: "விருச்சிகம்",
    symbol: "Scorpion",
  },
  Sagittarius: {
    sanskrit: "Dhanu",
    hindi: "धनु",
    tamil: "தனுசு",
    symbol: "Archer",
  },
  Capricorn: {
    sanskrit: "Makara",
    hindi: "मकर",
    tamil: "மகரம்",
    symbol: "Sea-Goat",
  },
  Aquarius: {
    sanskrit: "Kumbha",
    hindi: "कुम्भ",
    tamil: "கும்பம்",
    symbol: "Water Bearer",
  },
  Pisces: { sanskrit: "Meena", hindi: "मीन", tamil: "மீனம்", symbol: "Fishes" },
};

export default function MonthlyHoroscopeSign() {
  const params = useParams();
  const signParam = params.sign as string;

  // Convert URL parameter to proper case (e.g., 'aries' -> 'Aries')
  const selectedSign = signParam
    ? signParam.charAt(0).toUpperCase() + signParam.slice(1).toLowerCase()
    : "Aries";

  // Validate if it's a valid zodiac sign
  const validSign = zodiacSigns.find((sign) => sign.name === selectedSign);
  const finalSign = validSign ? selectedSign : "Aries";

  const { data: monthlyHoroscopes, isLoading } = useQuery<{
    success: boolean;
    month: string;
    year: number;
    horoscopes: MonthlyHoroscopeData[];
  }>({
    queryKey: ["/api/horoscopes/monthly"],
    queryFn: async () => {
      const res = await fetch("/api/horoscopes/monthly");
      if (!res.ok) throw new Error("Failed to fetch horoscope data");
      return res.json();
    },
    retry: false,
  });

  const currentHoroscope = monthlyHoroscopes?.horoscopes?.find(
    (h: MonthlyHoroscopeData) => h.sign === finalSign,
  );
  const formatMonthYear = (month: string, year: number): string => {
    const safeDate = new Date(`${month} 1, ${year}`);
    if (isNaN(safeDate.getTime())) return `${month} ${year}`;
    return safeDate.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const selectedSignData = zodiacSigns.find((s) => s.name === finalSign);
  const vedicData = vedicSignData[finalSign as keyof typeof vedicSignData];

  if (isLoading) {
    return (
      <>
        <AstroTickHeader />
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 p-4">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto"></div>
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${finalSign} Monthly Horoscope - ${monthlyHoroscopes?.month || "July"} ${monthlyHoroscopes?.year || "2025"} | Vedic Astrology`}</title>
        <meta
          name="description"
          content={`Get your ${finalSign} monthly horoscope for ${monthlyHoroscopes?.month || "July"} ${monthlyHoroscopes?.year || "2025"}. Comprehensive Vedic astrology predictions for love, career, health, and finances. Sanskrit name: ${vedicData?.sanskrit || finalSign}.`}
        />
        <meta
          name="keywords"
          content={`${finalSign} monthly horoscope, ${finalSign} month predictions, ${vedicData?.sanskrit || finalSign}, ${finalSign} astrology, monthly horoscope ${finalSign.toLowerCase()}`}
        />
        <link
          rel="canonical"
          href={`/monthly-horoscope/${finalSign.toLowerCase()}`}
        />
      </Helmet>

      <AstroTickHeader />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 p-4">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Back Button */}
          <div className="flex items-center space-x-4 mb-2">
            <Link href="/monthly-horoscope">
              <Button
                variant="ghost"
                className="flex items-center space-x-2 text-gray-600 hover:text-purple-600"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to All Monthly Horoscopes</span>
              </Button>
            </Link>
          </div>

          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center">
                <img
                  src={`/api/zodiac-image/${finalSign}.jpg`}
                  alt={finalSign}
                  className=" md:w-16 md:h-16 w-12 h-12 object-cover border border-gray-300 dark:border-gray-600 rounded-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    if (target.parentElement) {
                      target.parentElement.innerHTML = `<span class="text-orange-600 text-xl font-bold">${vedicData?.symbol || "⭐"}</span>`;
                    }
                  }}
                />
              </div>
              <div>
                <h1 className="text-2xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                  {finalSign} Monthly Horoscope
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  {vedicData?.sanskrit} ({vedicData?.hindi}) -{" "}
                  {monthlyHoroscopes?.month} {monthlyHoroscopes?.year}
                </p>
              </div>
            </div>
          </div>

          {/* Zodiac Sign Navigation */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Other Zodiac Signs
            </h3>
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-3">
              {zodiacSigns.map((sign) => (
                <Link
                  key={sign.name}
                  href={`/monthly-horoscope/${sign.name.toLowerCase()}`}
                >
                  <div
                    className={`group cursor-pointer transition-all duration-300 p-2 rounded-lg text-center ${
                      finalSign === sign.name
                        ? "bg-orange-100 dark:bg-orange-900/30 border-2 border-orange-400"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <img
                      src={`/api/zodiac-image/${sign.name}.jpg`}
                      alt={sign.name}
                      className=" w-8 h-8 md:w-16 md:h-16 object-cover mx-auto mb-1 border rounded-full"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        if (target.parentElement) {
                          target.parentElement.innerHTML = `<div class="w-8 h-8 mx-auto mb-1 flex items-center justify-center text-orange-600 text-sm font-bold">⭐</div>`;
                        }
                      }}
                    />
                    <span className="text-xs text-gray-600 dark:text-gray-400 hidden md:block">
                      {sign.name}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Main Horoscope Content */}
          {currentHoroscope ? (
            <div className="space-y-6">
              {/* Main Prediction Card */}
              <Card className="bg-white dark:bg-gray-800 shadow-xl border-0">
                <CardHeader className="text-center">
                  <div className="flex justify-center items-center space-x-2 mb-2">
                    <Calendar className="h-5 w-5 text-purple-600" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {monthlyHoroscopes?.month} {monthlyHoroscopes?.year}
                    </span>
                  </div>
                  <CardTitle className="text-2xl  font-bold text-gray-800 dark:text-gray-200">
                    Monthly Forecast for {finalSign}
                  </CardTitle>
                  <CardDescription className="text-lg">
                    {vedicData?.sanskrit} | {vedicData?.symbol}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center p-3 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg">
                    <p className="md:text-lg text-left md:leading-relaxed text-gray-700 dark:text-gray-300">
                      {currentHoroscope.prediction}
                    </p>
                  </div>

                  {/* Monthly Themes */}
                  {currentHoroscope.monthlyThemes &&
                    currentHoroscope.monthlyThemes.length > 0 && (
                      <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
                        <h4 className="font-semibold text-indigo-800 dark:text-indigo-400 mb-3">
                          Monthly Themes
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {currentHoroscope.monthlyThemes.map(
                            (theme, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-400"
                              >
                                {theme}
                              </Badge>
                            ),
                          )}
                        </div>
                      </div>
                    )}

                  {/* Major Transits */}
                  {currentHoroscope.majorTransits && (
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Target className="h-5 w-5 text-purple-600" />
                        <h4 className="font-semibold text-purple-800 dark:text-purple-400">
                          Major Planetary Transits
                        </h4>
                      </div>
                      <p className="text-purple-700 dark:text-purple-300 text-sm">
                        {currentHoroscope.majorTransits}
                      </p>
                    </div>
                  )}

                  {/* Opportunities and Challenges */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                        <h4 className="font-semibold text-green-800 dark:text-green-400">
                          Opportunities
                        </h4>
                      </div>
                      <p className="text-green-700 dark:text-green-300 text-sm">
                        {currentHoroscope.opportunities}
                      </p>
                    </div>

                    <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Star className="h-5 w-5 text-orange-600" />
                        <h4 className="font-semibold text-orange-800 dark:text-orange-400">
                          Challenges
                        </h4>
                      </div>
                      <p className="text-orange-700 dark:text-orange-300 text-sm">
                        {currentHoroscope.challenges}
                      </p>
                    </div>
                  </div>

                  {/* Life Aspects Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="bg-rose-50 dark:bg-rose-900/20 p-4 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Heart className="h-5 w-5 text-rose-600" />
                          <h4 className="font-semibold text-rose-800 dark:text-rose-400">
                            Love & Relationships
                          </h4>
                        </div>
                        <p className="text-rose-700 dark:text-rose-300 text-sm">
                          {currentHoroscope.loveLife}
                        </p>
                      </div>

                      <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Briefcase className="h-5 w-5 text-emerald-600" />
                          <h4 className="font-semibold text-emerald-800 dark:text-emerald-400">
                            Career & Professional Life
                          </h4>
                        </div>
                        <p className="text-emerald-700 dark:text-emerald-300 text-sm">
                          {currentHoroscope.career}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Activity className="h-5 w-5 text-blue-600" />
                          <h4 className="font-semibold text-blue-800 dark:text-blue-400">
                            Health & Wellness
                          </h4>
                        </div>
                        <p className="text-blue-700 dark:text-blue-300 text-sm">
                          {currentHoroscope.health}
                        </p>
                      </div>

                      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <DollarSign className="h-5 w-5 text-yellow-600" />
                          <h4 className="font-semibold text-yellow-800 dark:text-yellow-400">
                            Money & Investments
                          </h4>
                        </div>
                        <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                          {currentHoroscope.finances}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Important Dates */}
                  {currentHoroscope.importantDates &&
                    currentHoroscope.importantDates.length > 0 && (
                      <div className="bg-cyan-50 dark:bg-cyan-900/20 p-4 rounded-lg">
                        <h4 className="font-semibold text-cyan-800 dark:text-cyan-400 mb-3">
                          Important Dates This Month
                        </h4>
                        <div className="grid md:grid-cols-2 gap-2">
                          {currentHoroscope.importantDates.map(
                            (date, index) => (
                              <div
                                key={index}
                                className="text-sm text-cyan-700 dark:text-cyan-300 bg-cyan-100 dark:bg-cyan-900 p-2 rounded"
                              >
                                {date}
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    )}

                  {/* Spirituality and Advice */}
                  <div className="space-y-4">
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Sparkles className="h-5 w-5 text-purple-600" />
                        <h4 className="font-semibold text-purple-800 dark:text-purple-400">
                          Spiritual Growth
                        </h4>
                      </div>
                      <p className="text-purple-700 dark:text-purple-300 text-sm">
                        {currentHoroscope.spirituality}
                      </p>
                    </div>

                    <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border-l-4 border-amber-400">
                      <h4 className="font-semibold text-amber-800 dark:text-amber-400 mb-2">
                        Monthly Guidance
                      </h4>
                      <p className="text-amber-700 dark:text-amber-300">
                        {currentHoroscope.advice}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Navigation to Other Horoscope Types */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href={`/daily-horoscope/${finalSign.toLowerCase()}`}>
                  <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 transition-all duration-300 cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <h3 className="text-xl font-bold mb-2">
                        Daily Horoscope
                      </h3>
                      <p className="text-green-100">
                        View {finalSign} daily predictions
                      </p>
                    </CardContent>
                  </Card>
                </Link>

                <Link href={`/weekly-horoscope/${finalSign.toLowerCase()}`}>
                  <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 transition-all duration-300 cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <h3 className="text-xl font-bold mb-2">
                        Weekly Horoscope
                      </h3>
                      <p className="text-purple-100">
                        View {finalSign} weekly predictions
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </div>
          ) : (
            <Card className="bg-white dark:bg-gray-800 shadow-xl">
              <CardContent className="p-8 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  No monthly horoscope data available.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
