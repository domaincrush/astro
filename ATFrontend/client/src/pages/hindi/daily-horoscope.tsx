import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { motion } from "framer-motion";
import { Sun, Heart, TrendingUp, Shield, DollarSign, Sparkles, Clock, Star } from "lucide-react";
import { Link } from "wouter";
import { Helmet } from "react-helmet-async";

// Hindi zodiac signs data
const hindiZodiacSigns = [
  { name: "Aries", hindi: "मेष", sanskrit: "मेष राशि", element: "अग्नि", dates: "21 मार्च - 19 अप्रैल", icon: "♈", color: "from-red-500 to-orange-500" },
  { name: "Taurus", hindi: "वृषभ", sanskrit: "वृषभ राशि", element: "पृथ्वी", dates: "20 अप्रैल - 20 मई", icon: "♉", color: "from-green-500 to-emerald-500" },
  { name: "Gemini", hindi: "मिथुन", sanskrit: "मिथुन राशि", element: "वायु", dates: "21 मई - 20 जून", icon: "♊", color: "from-yellow-500 to-amber-500" },
  { name: "Cancer", hindi: "कर्क", sanskrit: "कर्क राशि", element: "जल", dates: "21 जून - 22 जुलाई", icon: "♋", color: "from-blue-500 to-cyan-500" },
  { name: "Leo", hindi: "सिंह", sanskrit: "सिंह राशि", element: "अग्नि", dates: "23 जुलाई - 22 अगस्त", icon: "♌", color: "from-orange-500 to-yellow-500" },
  { name: "Virgo", hindi: "कन्या", sanskrit: "कन्या राशि", element: "पृथ्वी", dates: "23 अगस्त - 22 सितंबर", icon: "♍", color: "from-teal-500 to-green-500" },
  { name: "Libra", hindi: "तुला", sanskrit: "तुला राशि", element: "वायु", dates: "23 सितंबर - 22 अक्टूबर", icon: "♎", color: "from-pink-500 to-purple-500" },
  { name: "Scorpio", hindi: "वृश्चिक", sanskrit: "वृश्चिक राशि", element: "जल", dates: "23 अक्टूबर - 21 नवंबर", icon: "♏", color: "from-purple-500 to-indigo-500" },
  { name: "Sagittarius", hindi: "धनु", sanskrit: "धनु राशि", element: "अग्नि", dates: "22 नवंबर - 21 दिसंबर", icon: "♐", color: "from-indigo-500 to-blue-500" },
  { name: "Capricorn", hindi: "मकर", sanskrit: "मकर राशि", element: "पृथ्वी", dates: "22 दिसंबर - 19 जनवरी", icon: "♑", color: "from-gray-500 to-slate-500" },
  { name: "Aquarius", hindi: "कुंभ", sanskrit: "कुंभ राशि", element: "वायु", dates: "20 जनवरी - 18 फरवरी", icon: "♒", color: "from-cyan-500 to-blue-500" },
  { name: "Pisces", hindi: "मीन", sanskrit: "मीन राशि", element: "जल", dates: "19 फरवरी - 20 मार्च", icon: "♓", color: "from-purple-500 to-pink-500" }
];

interface HoroscopeData {
  sign: string;
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

export default function HindiDailyHoroscope() {
  const [selectedSign, setSelectedSign] = useState<string>('Aries');

  // Extract sign parameter from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const signParam = urlParams.get('sign');
    
    if (signParam) {
      const formattedSign = signParam.charAt(0).toUpperCase() + signParam.slice(1).toLowerCase();
      const validSign = hindiZodiacSigns.find(sign => sign.name === formattedSign);
      if (validSign) {
        setSelectedSign(formattedSign);
      }
    }
  }, []);

  const { data: dailyHoroscopes, isLoading } = useQuery<{
    success: boolean;
    date: string;
    horoscopes: HoroscopeData[];
  }>({
    queryKey: ['/api/horoscopes/daily'],
    retry: false,
  });

  const currentDate = new Date().toLocaleDateString('hi-IN', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const currentHoroscope = dailyHoroscopes?.horoscopes?.find(
    (h: HoroscopeData) => h.sign === selectedSign
  );

  const selectedSignData = hindiZodiacSigns.find(s => s.name === selectedSign);

  return (
    <>
      <Helmet>
        <title>दैनिक राशिफल - {currentDate} | वैदिक ज्योतिष भविष्यवाणी</title>
        <meta name="description" content={`${currentDate} के लिए अपना दैनिक राशिफल प्राप्त करें। प्रामाणिक वैदिक ज्योतिष भविष्यवाणी के साथ संस्कृत नाम, प्रेम, करियर, स्वास्थ्य और वित्त की जानकारी।`} />
        <meta name="keywords" content="दैनिक राशिफल, वैदिक ज्योतिष, दैनिक भविष्यवाणी, राशि चक्र, संस्कृत नाम, आज का राशिफल" />
        <link rel="canonical" href="/hindi/daily-horoscope" />
      </Helmet>

      <AstroTickHeader />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 p-4">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
              दैनिक राशिफल
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {currentDate} - आज के लिए प्रामाणिक वैदिक ज्योतिष भविष्यवाणी
            </p>
          </div>

          {/* Zodiac Sign Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 mb-8">
            {hindiZodiacSigns.map((sign) => (
              <Link key={sign.name} href={`/hindi/daily-horoscope/${sign.name.toLowerCase()}`}>
                <div className={`group cursor-pointer transition-all duration-300 ${
                  selectedSign === sign.name ? 'transform scale-105' : 'hover:transform hover:scale-102'
                }`}>
                  <div className={`relative bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border-2 transition-all duration-300 ${
                    selectedSign === sign.name 
                      ? 'border-orange-400 shadow-orange-200 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-900/20 dark:to-amber-900/20' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-xl'
                  }`}>
                    <div className="text-center space-y-2">
                      <div className={`text-3xl font-bold bg-gradient-to-br ${sign.color} bg-clip-text text-transparent`}>
                        {sign.icon}
                      </div>
                      <h3 className={`font-bold text-sm ${
                        selectedSign === sign.name ? 'text-orange-700 dark:text-orange-300' : 'text-gray-800 dark:text-white'
                      }`}>
                        {sign.hindi}
                      </h3>
                      <p className={`text-xs font-medium ${
                        selectedSign === sign.name ? 'text-orange-600 dark:text-orange-400' : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        {sign.sanskrit}
                      </p>
                      <p className={`text-xs ${
                        selectedSign === sign.name ? 'text-orange-500 dark:text-orange-500' : 'text-gray-500 dark:text-gray-500'
                      }`}>
                        {sign.dates}
                      </p>
                      <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                        selectedSign === sign.name 
                          ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' 
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                      }`}>
                        {sign.element}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Main Horoscope Content */}
          {selectedSignData && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Main Prediction */}
              <div className="lg:col-span-2 space-y-6">
                {/* Selected Sign Header */}
                <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-xl">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-6">
                      <div className="text-6xl">
                        {selectedSignData.icon}
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold">{selectedSignData.hindi}</h2>
                        <p className="text-purple-100 text-lg">{selectedSignData.sanskrit}</p>
                        <p className="text-purple-200">{selectedSignData.dates}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                            तत्व: {selectedSignData.element}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Main Prediction */}
                {isLoading ? (
                  <Card>
                    <CardContent className="p-8">
                      <div className="animate-pulse space-y-4">
                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                      </div>
                    </CardContent>
                  </Card>
                ) : currentHoroscope ? (
                  <Card className="shadow-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-2xl">
                        <Sun className="w-6 h-6 text-yellow-500" />
                        आज की मुख्य भविष्यवाणी
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                        {currentHoroscope.prediction}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="bg-white dark:bg-gray-800 shadow-xl">
                    <CardContent className="p-8 text-center">
                      <Sun className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
                      <h3 className="text-xl font-semibold mb-2">आज का राशिफल</h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {selectedSignData.hindi} राशि के लिए आज की भविष्यवाणी लोड हो रही है...
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Life Aspects */}
                {currentHoroscope && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Heart className="w-5 h-5 text-pink-500" />
                          प्रेम और रिश्ते
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 dark:text-gray-300">{currentHoroscope.loveLife}</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-green-500" />
                          करियर और काम
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 dark:text-gray-300">{currentHoroscope.career}</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Shield className="w-5 h-5 text-blue-500" />
                          स्वास्थ्य और कल्याण
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 dark:text-gray-300">{currentHoroscope.health}</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <DollarSign className="w-5 h-5 text-yellow-500" />
                          वित्त और धन
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 dark:text-gray-300">{currentHoroscope.finances}</p>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>

              {/* Right Column - Additional Info */}
              <div className="space-y-6">
                {currentHoroscope && (
                  <>
                    {/* Lucky Elements */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Star className="w-5 h-5 text-yellow-500" />
                          भाग्यशाली तत्व
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">भाग्यशाली संख्याएं</h4>
                          <div className="flex flex-wrap gap-2">
                            {currentHoroscope.luckyNumbers.map((num) => (
                              <span key={num} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                                {num}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">भाग्यशाली रंग</h4>
                          <div className="flex flex-wrap gap-2">
                            {currentHoroscope.luckyColors.map((color) => (
                              <span key={color} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                                {color}
                              </span>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Timing */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-indigo-500" />
                          समय की जानकारी
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">अनुकूल समय</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{currentHoroscope.favorableTime}</p>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">बचने का समय</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{currentHoroscope.avoidTime}</p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Spiritual Guidance */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-purple-500" />
                          आध्यात्मिक मार्गदर्शन
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 dark:text-gray-300">{currentHoroscope.spirituality}</p>
                      </CardContent>
                    </Card>
                  </>
                )}

                {/* Navigation Cards */}
                <div className="space-y-4">
                  <Link href={`/hindi/weekly-horoscope/${selectedSign.toLowerCase()}`}>
                    <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 transition-all duration-300 cursor-pointer">
                      <CardContent className="p-6 text-center">
                        <h3 className="text-xl font-bold mb-2">साप्ताहिक राशिफल</h3>
                        <p className="text-green-100">{selectedSignData?.hindi} का साप्ताहिक भविष्यवाणी देखें</p>
                      </CardContent>
                    </Card>
                  </Link>

                  <Link href={`/hindi/monthly-horoscope/${selectedSign.toLowerCase()}`}>
                    <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300 cursor-pointer">
                      <CardContent className="p-6 text-center">
                        <h3 className="text-xl font-bold mb-2">मासिक राशिफल</h3>
                        <p className="text-blue-100">{selectedSignData?.hindi} का मासिक भविष्यवाणी देखें</p>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}