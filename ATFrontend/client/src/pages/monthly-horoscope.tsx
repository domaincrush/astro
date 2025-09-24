import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "src/components/ui/card";
import { Badge } from "src/components/ui/badge";
import { Button } from "src/components/ui/button";
import { Star, Heart, Briefcase, Activity, DollarSign, Sparkles, TrendingUp } from "lucide-react";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";

interface HoroscopeData {
  sign: string;
  sanskritName?: string;
  tamilName?: string;
  symbol?: string;
  period: 'daily' | 'weekly' | 'monthly';
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
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

const vedicSignData = {
  'Aries': { sanskrit: 'Mesha', hindi: 'मेष', tamil: 'மேஷம்', symbol: 'Ram' },
  'Taurus': { sanskrit: 'Vrishabha', hindi: 'वृषभ', tamil: 'ரிஷபம்', symbol: 'Bull' },
  'Gemini': { sanskrit: 'Mithuna', hindi: 'मिथुन', tamil: 'மிதுனம்', symbol: 'Twins' },
  'Cancer': { sanskrit: 'Karka', hindi: 'कर्क', tamil: 'கடகம்', symbol: 'Crab' },
  'Leo': { sanskrit: 'Simha', hindi: 'सिंह', tamil: 'சிம்மம்', symbol: 'Lion' },
  'Virgo': { sanskrit: 'Kanya', hindi: 'कन्या', tamil: 'கன்னி', symbol: 'Maiden' },
  'Libra': { sanskrit: 'Tula', hindi: 'तुला', tamil: 'துலாம்', symbol: 'Scales' },
  'Scorpio': { sanskrit: 'Vrischika', hindi: 'वृश्चिक', tamil: 'விருச்சிகம்', symbol: 'Scorpion' },
  'Sagittarius': { sanskrit: 'Dhanu', hindi: 'धनु', tamil: 'தனுசு', symbol: 'Archer' },
  'Capricorn': { sanskrit: 'Makara', hindi: 'मकर', tamil: 'மகரம்', symbol: 'Sea-Goat' },
  'Aquarius': { sanskrit: 'Kumbha', hindi: 'कुम्भ', tamil: 'கும்பம்', symbol: 'Water Bearer' },
  'Pisces': { sanskrit: 'Meena', hindi: 'मीन', tamil: 'மீனம்', symbol: 'Fishes' }
};

const zodiacColors = {
  'Aries': 'bg-red-500',
  'Taurus': 'bg-green-500',
  'Gemini': 'bg-yellow-500',
  'Cancer': 'bg-blue-300',
  'Leo': 'bg-orange-500',
  'Virgo': 'bg-green-600',
  'Libra': 'bg-pink-500',
  'Scorpio': 'bg-red-800',
  'Sagittarius': 'bg-purple-500',
  'Capricorn': 'bg-gray-700',
  'Aquarius': 'bg-cyan-500',
  'Pisces': 'bg-blue-500'
};

export default function MonthlyHoroscope() {
  const [selectedSign, setSelectedSign] = useState<string>('Aries');
  
  const { data: monthlyHoroscopes, isLoading } = useQuery<{
    success: boolean;
    month: number;
    year: number;
    horoscopes: HoroscopeData[];
  }>({
    queryKey: ['/api/horoscopes/monthly'],
    retry: false,
  });

  const getCurrentMonth = () => {
    const date = new Date();
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const currentHoroscope = monthlyHoroscopes?.horoscopes?.find(
    (h: HoroscopeData) => h.sign === selectedSign
  );

  return (
    <>
      <AstroTickHeader />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-orange-900 dark:to-amber-900 p-4">
        <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-rose-600 to-orange-600 dark:from-rose-400 dark:to-orange-400 bg-clip-text text-transparent">
            Monthly Horoscope
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {getCurrentMonth()} - In-depth Vedic astrology predictions for the month ahead
          </p>
        </div>

        {/* Zodiac Sign Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {zodiacSigns.map((sign) => {
            const vedicData = vedicSignData[sign as keyof typeof vedicSignData];
            return (
              <Button
                key={sign}
                variant={selectedSign === sign ? "default" : "outline"}
                className={`h-20 flex flex-col items-center justify-center text-xs font-medium p-2 ${
                  selectedSign === sign ? zodiacColors[sign as keyof typeof zodiacColors] : ''
                }`}
                onClick={() => setSelectedSign(sign)}
              >
                <div className="text-center">
                  <div className="font-bold text-sm">{vedicData.sanskrit}</div>
                  <div className="text-xs text-blue-600">{vedicData.hindi}</div>
                  <div className="text-xs opacity-75">{vedicData.tamil}</div>
                </div>
              </Button>
            );
          })}
        </div>

        {/* Horoscope Content */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading monthly predictions...</p>
          </div>
        ) : currentHoroscope ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Prediction */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full ${zodiacColors[selectedSign as keyof typeof zodiacColors]} flex items-center justify-center text-white text-xl font-bold`}>
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl">{vedicSignData[selectedSign as keyof typeof vedicSignData].sanskrit}</h2>
                      <p className="text-lg text-gray-600 dark:text-gray-300">{vedicSignData[selectedSign as keyof typeof vedicSignData].tamil}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{selectedSign} • Monthly Overview</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg leading-relaxed text-gray-800 dark:text-gray-200">
                    {currentHoroscope.prediction}
                  </p>
                  <div className="mt-6">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Monthly Guidance</h3>
                    <p className="text-gray-700 dark:text-gray-300">{currentHoroscope.generalAdvice}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Monthly Predictions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Heart className="w-5 h-5 text-red-500" />
                      Love & Relationships
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 dark:text-gray-300">{currentHoroscope.loveLife}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Briefcase className="w-5 h-5 text-blue-500" />
                      Career & Growth
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 dark:text-gray-300">{currentHoroscope.career}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Activity className="w-5 h-5 text-green-500" />
                      Health & Vitality
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 dark:text-gray-300">{currentHoroscope.health}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <DollarSign className="w-5 h-5 text-yellow-500" />
                      Wealth & Prosperity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 dark:text-gray-300">{currentHoroscope.finances}</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    Monthly Lucky Elements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Lucky Numbers</h4>
                    <div className="flex gap-2 flex-wrap">
                      {currentHoroscope.luckyNumbers?.map((num: number, index: number) => (
                        <Badge key={index} variant="secondary">{num}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Lucky Colors</h4>
                    <div className="flex gap-2 flex-wrap">
                      {currentHoroscope.luckyColors?.map((color: string, index: number) => (
                        <Badge key={index} variant="outline">{color}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Favorable Period</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{currentHoroscope.favorableTime}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Challenging Period</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{currentHoroscope.avoidTime}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-500" />
                    Spiritual Growth
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300">{currentHoroscope.spirituality}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Monthly Themes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span>Transformation and renewal</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Relationships take center stage</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Career advancement opportunities</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Spiritual awakening and growth</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span>Financial planning and investment</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Planetary Influences</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-600 dark:text-gray-400">
                      Major planetary transits this month influence your sign's natural characteristics and create opportunities for growth in key life areas.
                    </p>
                    <div className="mt-3 space-y-1">
                      <div className="text-xs text-gray-500">Transit highlights:</div>
                      <div className="text-xs">• Benefic influences in career sector</div>
                      <div className="text-xs">• Relationship harmony emphasized</div>
                      <div className="text-xs">• Health and vitality supported</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">No monthly horoscope data available.</p>
          </div>
        )}
        </div>
      </div>
      <Footer />
    </>
  );
}