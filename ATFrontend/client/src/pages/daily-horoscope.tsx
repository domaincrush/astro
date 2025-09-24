import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
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
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";
import DeferredSection from "src/components/DeferredSection";
import LazyImage from "src/components/LazyImage";

interface HoroscopeData {
  sign: string;
  sanskritName?: string;
  tamilName?: string;
  symbol?: string;
  period: "daily" | "weekly" | "monthly";
  date: string;
  prediction: string;
  luckyNumbers: number[];
  luckyColors: string[];
  favorableTime: string;
  avoidTime: string;
  generalAdvice: string;
  loveLife: string;
  career: string;
  health: string;
  finances: string;
  spirituality: string;
}

import { preloadZodiacImages } from "src/utils/imageOptimizations";

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

const zodiacColors = {
  Aries: "bg-red-500",
  Taurus: "bg-green-500",
  Gemini: "bg-yellow-500",
  Cancer: "bg-blue-300",
  Leo: "bg-orange-500",
  Virgo: "bg-green-600",
  Libra: "bg-pink-500",
  Scorpio: "bg-red-800",
  Sagittarius: "bg-purple-500",
  Capricorn: "bg-gray-700",
  Aquarius: "bg-cyan-500",
  Pisces: "bg-blue-500",
};

export default function DailyHoroscope() {
  const [selectedSign, setSelectedSign] = useState<string>("Aries");
  const [location] = useLocation();

  // Preload zodiac images for better performance
  useEffect(() => {
    preloadZodiacImages();
  }, []);

  // Extract sign parameter from URL and set selected sign
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const signParam = urlParams.get("sign");

    if (signParam) {
      // Convert sign parameter to proper case (e.g., 'aries' -> 'Aries')
      const formattedSign =
        signParam.charAt(0).toUpperCase() + signParam.slice(1).toLowerCase();

      // Check if it's a valid zodiac sign
      const validSign = zodiacSigns.find((sign) => sign.name === formattedSign);
      if (validSign) {
        setSelectedSign(formattedSign);
      }
    }
  }, [location]);

  const { data: dailyHoroscopes, isLoading } = useQuery<{
    success: boolean;
    date: string;
    horoscopes: HoroscopeData[];
  }>({
    queryKey: ["/api/horoscopes/daily"],
    retry: false,
  });

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const currentHoroscope = dailyHoroscopes?.horoscopes?.find(
    (h: HoroscopeData) => h.sign === selectedSign,
  );

  const selectedSignData = zodiacSigns.find((s) => s.name === selectedSign);

  return (
    <>
      <Helmet>
        <title>
          Daily Horoscope - {currentDate} | Vedic Astrology Predictions
        </title>
        <meta
          name="description"
          content={`Get your daily horoscope for ${currentDate}. Authentic Vedic astrology predictions with Sanskrit names, love, career, health, and finance insights for all zodiac signs.`}
        />
        <meta
          name="keywords"
          content="daily horoscope, vedic astrology, daily predictions, zodiac signs, sanskrit names, astrology today"
        />
        <link rel="canonical" href="/daily-horoscope" />
      </Helmet>

      <AstroTickHeader />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 p-4">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
              Daily Horoscope
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {currentDate} - Authentic Vedic astrology predictions for today
            </p>
          </div>

          {/* Zodiac Sign Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 mb-8">
            {zodiacSigns.map((sign) => {
              const vedicData =
                vedicSignData[sign.name as keyof typeof vedicSignData];
              return (
                <Link
                  key={sign.name}
                  href={`/daily-horoscope/${sign.name.toLowerCase()}`}
                >
                  <div
                    className={`group cursor-pointer transition-all duration-300 ${
                      selectedSign === sign.name
                        ? "transform scale-105"
                        : "hover:transform hover:scale-102"
                    }`}
                  >
                    <div
                      className={`relative bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border-2 transition-all duration-300 ${
                        selectedSign === sign.name
                          ? "border-orange-400 shadow-orange-200 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-900/20 dark:to-amber-900/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-orange-300 hover:shadow-md"
                      }`}
                    >
                      {/* Selection Indicator */}
                      {selectedSign === sign.name && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}

                      {/* Zodiac Symbol */}
                      <div
                        className={`w-16 h-16 mx-auto mb-3 rounded-full border-2 border-orange-200 shadow-md flex items-center justify-center text-white text-xl font-bold transition-transform duration-300 group-hover:scale-110 ${zodiacColors[sign.name as keyof typeof zodiacColors]}`}
                      >
                        <img
                          src={`/api/zodiac-image/${sign.image}`}
                          alt={sign.name}
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>

                      {/* Text Content */}
                      <div className="text-center space-y-1">
                        <div className="font-bold text-sm text-gray-900 dark:text-white">
                          {vedicData.sanskrit}
                        </div>
                        <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                          {vedicData.hindi}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {vedicData.tamil}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Horoscope Content */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Loading today's predictions...
              </p>
            </div>
          ) : currentHoroscope ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Prediction */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-4">
                      <div className="relative">
                        <div
                          className={`w-20 h-20 rounded-full border-4 border-orange-300 shadow-lg flex items-center justify-center text-white text-2xl font-bold ${zodiacColors[selectedSign as keyof typeof zodiacColors]}`}
                        >
                          <img
                            src={`/api/zodiac-image/${selectedSign}.jpg`}
                            alt={selectedSign}
                            className="w-full h-full object-cover rounded-full"
                          />
                        </div>
                        {/* Cosmic Glow Effect */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-400/20 to-amber-400/20 blur-sm"></div>
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                          {
                            vedicSignData[
                              selectedSign as keyof typeof vedicSignData
                            ].sanskrit
                          }
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">
                          {
                            vedicSignData[
                              selectedSign as keyof typeof vedicSignData
                            ].tamil
                          }
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {selectedSign} • Daily Prediction for{" "}
                          {currentDate.split(",")[0]}
                        </p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg leading-relaxed text-gray-800 dark:text-gray-200">
                      {currentHoroscope.prediction}
                    </p>
                    <div className="mt-6">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                        General Advice
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300">
                        {currentHoroscope.generalAdvice}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Detailed Predictions */}
                <DeferredSection>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Heart className="w-5 h-5 text-red-500" />
                          Love & Relationships
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 dark:text-gray-300">
                          {currentHoroscope.loveLife}
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Briefcase className="w-5 h-5 text-blue-500" />
                          Career & Work
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 dark:text-gray-300">
                          {currentHoroscope.career}
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Activity className="w-5 h-5 text-green-500" />
                          Health & Wellness
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 dark:text-gray-300">
                          {currentHoroscope.health}
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <DollarSign className="w-5 h-5 text-yellow-500" />
                          Finance & Money
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 dark:text-gray-300">
                          {currentHoroscope.finances}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </DeferredSection>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-500" />
                      Lucky Elements
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Lucky Numbers</h4>
                      <div className="flex gap-2 flex-wrap">
                        {currentHoroscope.luckyNumbers?.map(
                          (num: number, index: number) => (
                            <Badge key={index} variant="secondary">
                              {num}
                            </Badge>
                          ),
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Lucky Colors</h4>
                      <div className="flex gap-2 flex-wrap">
                        {currentHoroscope.luckyColors?.map(
                          (color: string, index: number) => (
                            <Badge key={index} variant="outline">
                              {color}
                            </Badge>
                          ),
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Favorable Time</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {currentHoroscope.favorableTime}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Time to Avoid</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {currentHoroscope.avoidTime}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-500" />
                      Spiritual Guidance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 dark:text-gray-300">
                      {currentHoroscope.spirituality}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">
                No horoscope data available for today.
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
