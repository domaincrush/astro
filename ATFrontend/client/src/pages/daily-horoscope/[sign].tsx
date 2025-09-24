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
  MessageCircle,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useParams } from "wouter";
import { Link } from "wouter";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";

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

export default function DailyHoroscopeSign() {
  const params = useParams();
  const signParam = params.sign as string;

  // Convert URL parameter to proper case (e.g., 'aries' -> 'Aries')
  const selectedSign = signParam
    ? signParam.charAt(0).toUpperCase() + signParam.slice(1).toLowerCase()
    : "Aries";

  // Validate if it's a valid zodiac sign
  const validSign = zodiacSigns.find((sign) => sign.name === selectedSign);
  const finalSign = validSign ? selectedSign : "Aries";

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
    (h: HoroscopeData) => h.sign === finalSign,
  );

  const selectedSignData = zodiacSigns.find((s) => s.name === finalSign);
  const vedicData = vedicSignData[finalSign as keyof typeof vedicSignData];

  if (isLoading) {
    return (
      <>
        <AstroTickHeader />
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 p-4">
          <div className="max-w-4xl mx-auto">
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
        <title>{`${finalSign} Daily Horoscope - ${currentDate} | Vedic Astrology Predictions`}</title>
        <meta
          name="description"
          content={`Get your ${finalSign} daily horoscope for ${currentDate}. Authentic Vedic astrology predictions with love, career, health, and finance insights. Sanskrit name: ${vedicData?.sanskrit || finalSign}.`}
        />
        <meta
          name="keywords"
          content={`${finalSign} horoscope, ${finalSign} daily predictions, ${vedicData?.sanskrit}, ${finalSign} astrology, daily horoscope ${finalSign.toLowerCase()}`}
        />
        <link
          rel="canonical"
          href={`/daily-horoscope/${finalSign.toLowerCase()}`}
        />
      </Helmet>

      <AstroTickHeader />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 p-4">
        <div className="max-w-6xl mx-auto space-y-8 ">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center">
                <img
                  src={`/api/zodiac-image/${finalSign}.jpg`}
                  alt={finalSign}
                  className="w-12 h-12 md:w-16 md:h-16 object-cover  border border-gray-300 dark:border-gray-600 rounded-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    target.parentElement!.innerHTML = `<span class="text-orange-600 text-xl font-bold">${vedicData?.symbol || "⭐"}</span>`;
                  }}
                />
              </div>
              <div>
                <h1 className="text-2xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent md:mb-2">
                  {finalSign} Daily Horoscope
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  {vedicData?.sanskrit} ({vedicData?.hindi}) - {currentDate}
                </p>
              </div>
            </div>
          </div>

          {/* Zodiac Sign Navigation */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Other Zodiac Signs
            </h3>
            <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-3">
              {zodiacSigns.map((sign) => (
                <Link
                  key={sign.name}
                  href={`/daily-horoscope/${sign.name.toLowerCase()}`}
                >
                  <div
                    className={`group cursor-pointer transition-all duration-300 p-2 rounded-lg text-center text-xs  ${
                      finalSign === sign.name
                        ? "bg-orange-100 dark:bg-orange-900/30 md:w-18 border-2 border-orange-400"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <img
                      src={`/api/zodiac-image/${sign.name}.jpg`}
                      alt={sign.name}
                      className="w-8 h-8 md:w-16 md:h-16 mx-auto mb-1 border border-gray-300 dark:border-gray-600 rounded-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        target.parentElement!.innerHTML = `<div class="w-8 h-8 mx-auto mb-1 flex items-center justify-center text-orange-600 text-sm font-bold">⭐</div>`;
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
                      {currentDate}
                    </span>
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                    Today's Prediction for {finalSign}
                  </CardTitle>
                  <CardDescription className="text-lg">
                    {vedicData?.sanskrit} | {vedicData?.symbol}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg">
                    <p className="md:text-lg text-left md:leading-relaxed text-gray-700 dark:text-gray-300">
                      {currentHoroscope.prediction}
                    </p>
                  </div>

                  {/* General Advice */}
                  <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border-l-4 border-amber-400">
                    <h4 className="font-semibold text-amber-800 dark:text-amber-400 mb-2">
                      General Advice
                    </h4>
                    <p className="text-amber-700 dark:text-amber-300">
                      {currentHoroscope.generalAdvice}
                    </p>
                  </div>

                  {/* Life Aspects Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="bg-rose-50 dark:bg-rose-900/20 p-4 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Heart className="h-5 w-5 text-rose-600" />
                          <h4 className="font-semibold text-rose-800 dark:text-rose-400">
                            Love Life
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
                            Career
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
                            Health
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
                            Finances
                          </h4>
                        </div>
                        <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                          {currentHoroscope.finances}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Spirituality */}
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Sparkles className="h-5 w-5 text-purple-600" />
                      <h4 className="font-semibold text-purple-800 dark:text-purple-400">
                        Spiritual Guidance
                      </h4>
                    </div>
                    <p className="text-purple-700 dark:text-purple-300 text-sm">
                      {currentHoroscope.spirituality}
                    </p>
                  </div>

                  {/* Lucky Elements */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
                      <h5 className="font-semibold text-green-800 dark:text-green-400 mb-2">
                        Lucky Numbers
                      </h5>
                      <div className="flex justify-center space-x-2">
                        {currentHoroscope.luckyNumbers.map((num, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-400"
                          >
                            {num}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg">
                      <h5 className="font-semibold text-blue-800 dark:text-blue-400 mb-2">
                        Lucky Colors
                      </h5>
                      <div className="flex justify-center space-x-1">
                        {currentHoroscope.luckyColors.map((color, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-400 text-xs"
                          >
                            {color}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="text-center p-4 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-lg">
                      <h5 className="font-semibold text-orange-800 dark:text-orange-400 mb-2">
                        Timing
                      </h5>
                      <div className="space-y-1 text-sm">
                        <div>
                          <span className="text-green-600 dark:text-green-400 font-medium">
                            Favorable:{" "}
                          </span>
                          <span className="text-gray-600 dark:text-gray-400">
                            {currentHoroscope.favorableTime}
                          </span>
                        </div>
                        <div>
                          <span className="text-red-600 dark:text-red-400 font-medium">
                            Avoid:{" "}
                          </span>
                          <span className="text-gray-600 dark:text-gray-400">
                            {currentHoroscope.avoidTime}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Navigation to Other Horoscope Types */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                <Link href={`/monthly-horoscope/${finalSign.toLowerCase()}`}>
                  <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300 cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <h3 className="text-xl font-bold mb-2">
                        Monthly Horoscope
                      </h3>
                      <p className="text-blue-100">
                        View {finalSign} monthly predictions
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </div>

              {/* Chat with Astrologer Button */}
              <div className="mt-6">
                <Link href="/astrologers">
                  <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 transition-all duration-300 cursor-pointer transform hover:scale-105 shadow-lg hover:shadow-xl">
                    <CardContent className="p-6 text-center">
                      <div className="flex items-center justify-center space-x-3">
                        <MessageCircle className="h-6 w-6" />
                        <div>
                          <h3 className="text-xl font-bold">
                            Chat with Astrologer
                          </h3>
                          <p className="text-green-100 mt-1">
                            Get personalized guidance for your {finalSign}{" "}
                            predictions
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </div>
          ) : (
            <Card className="bg-white dark:bg-gray-800 shadow-xl">
              <CardContent className="p-8 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  No horoscope data available for today.
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
