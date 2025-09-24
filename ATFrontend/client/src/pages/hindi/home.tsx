import { useState, useEffect } from "react";
import { Star, ChevronRight, Clock, MapPin, Phone, Heart, Award, Users, Sparkles, Crown, MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { Button } from "src/components/ui/button";
import { Badge } from "src/components/ui/badge";
import { Separator } from "src/components/ui/separator";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";
import BirthChartGenerator from "src/components/astrology/BirthChartGenerator";
// import KundliMatchingForm from "@/components/astrology/KundliMatchingForm";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

// Zodiac signs in Hindi
const zodiacSigns = [
  { name: "मेष", english: "aries", color: "from-red-400 to-red-600" },
  { name: "वृषभ", english: "taurus", color: "from-green-400 to-green-600" },
  { name: "मिथुन", english: "gemini", color: "from-yellow-400 to-yellow-600" },
  { name: "कर्क", english: "cancer", color: "from-blue-400 to-blue-600" },
  { name: "सिंह", english: "leo", color: "from-orange-400 to-orange-600" },
  { name: "कन्या", english: "virgo", color: "from-purple-400 to-purple-600" },
  { name: "तुला", english: "libra", color: "from-pink-400 to-pink-600" },
  { name: "वृश्चिक", english: "scorpio", color: "from-red-500 to-red-700" },
  { name: "धनु", english: "sagittarius", color: "from-indigo-400 to-indigo-600" },
  { name: "मकर", english: "capricorn", color: "from-gray-400 to-gray-600" },
  { name: "कुंभ", english: "aquarius", color: "from-cyan-400 to-cyan-600" },
  { name: "मीन", english: "pisces", color: "from-teal-400 to-teal-600" }
];

// Free astrology tools in Hindi
const astrologyTools = [
  { name: "चंद्र राशि जांचकर्ता", link: "/hindi/moon-sign-checker", icon: "🌙", gradient: "from-blue-400 to-blue-600" },
  { name: "लग्न कैलकुलेटर", link: "/hindi/lagna-calculator", icon: "⭐", gradient: "from-purple-400 to-purple-600" },
  { name: "नक्षत्र खोजकर्ता", link: "/hindi/nakshatra-finder", icon: "✨", gradient: "from-pink-400 to-pink-600" },
  { name: "दशा कैलकुलेटर", link: "/hindi/dasha-calculator", icon: "🔮", gradient: "from-red-400 to-red-600" },
  { name: "अंकशास्त्र", link: "/hindi/numerology", icon: "🔢", gradient: "from-gray-400 to-gray-600" },
  { name: "हस्तरेखा", link: "/hindi/palmistry", icon: "🤚", gradient: "from-indigo-400 to-indigo-600" },
  { name: "वास्तु शास्त्र", link: "/hindi/vastu", icon: "🏠", gradient: "from-yellow-400 to-yellow-600" },
  { name: "रत्न विज्ञान", link: "/hindi/gemstones", icon: "💎", gradient: "from-teal-400 to-teal-600" }
];

export default function HindiHomePage() {
  const [activeTab, setActiveTab] = useState("kundli");

  // Get today's panchang data
  const { data: panchangData } = useQuery({
    queryKey: ["/api/panchang/today"],
  });

  // Get astrologers data
  const { data: astrologers = [] } = useQuery({
    queryKey: ["/api/astrologers"],
  });

  return (
    <>
      <Helmet>
        <title>AstroTick - निःशुल्क कुंडली, ज्योतिष परामर्श और पंचांग</title>
        <meta name="description" content="मुफ्त कुंडली बनाएं, विशेषज्ञ ज्योतिषियों से सलाह लें, और दैनिक पंचांग देखें। प्रामाणिक वैदिक ज्योतिष सेवाएं।" />
        <meta name="keywords" content="मुफ्त कुंडली, ज्योतिष परामर्श, पंचांग, राशिफल, वैदिक ज्योतिष, ऑनलाइन ज्योतिषी" />
        <link rel="canonical" href="https://astrotick.com/hindi" />
        
        <meta property="og:title" content="AstroTick - निःशुल्क कुंडली, ज्योतिष परामर्श और पंचांग" />
        <meta property="og:description" content="मुफ्त कुंडली बनाएं, विशेषज्ञ ज्योतिषियों से सलाह लें, और दैनिक पंचांग देखें।" />
        <meta property="og:url" content="https://astrotick.com/hindi" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-indigo-100">
        <AstroTickHeader />

        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-orange-600 via-amber-600 to-yellow-700 text-white py-20">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="mb-8"
              >
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                  <span className="text-yellow-400">🔮 AstroTick</span> के साथ<br />
                  अपना <span className="text-yellow-300">भाग्य</span> खोलें
                </h1>
                <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto leading-relaxed">
                  प्रामाणिक वैदिक ज्योतिष के माध्यम से अपने जीवन की दिशा खोजें। मुफ्त कुंडली, विशेषज्ञ परामर्श और दैनिक मार्गदर्शन प्राप्त करें।
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-purple-900 font-semibold px-8 py-3 text-lg">
                  मुफ्त जन्म कुंडली
                </Button>
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-purple-800 px-8 py-3 text-lg">
                  ज्योतिषी से बात करें
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Main Forms Section */}
        <section className="py-12 -mt-10 relative z-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
              <CardHeader>
                <div className="flex flex-wrap justify-center gap-2">
                  <Button
                    variant={activeTab === "kundli" ? "default" : "outline"}
                    onClick={() => setActiveTab("kundli")}
                    className={activeTab === "kundli" ? "bg-purple-600 hover:bg-purple-700" : ""}
                  >
                    मुफ्त कुंडली
                  </Button>
                  <Button
                    variant={activeTab === "matching" ? "default" : "outline"}
                    onClick={() => setActiveTab("matching")}
                    className={activeTab === "matching" ? "bg-purple-600 hover:bg-purple-700" : ""}
                  >
                    कुंडली मिलान
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {activeTab === "kundli" && <BirthChartGenerator />}
                {activeTab === "matching" && (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">कुंडली मिलान सेवा जल्द आ रही है</p>
                    <Button variant="outline">जल्द उपलब्ध</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Today's Panchang */}
        {panchangData && (
          <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">आज का पंचांग</h2>
                <p className="text-gray-600">दैनिक ब्रह्मांडीय ऊर्जाओं और शुभ समय की जानकारी</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="text-center">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-purple-600">तिथि</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{panchangData.data?.tithi?.name || "गणना हो रही है..."}</p>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-blue-600">नक्षत्र</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{panchangData.data?.nakshatra?.name || "गणना हो रही है..."}</p>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-green-600">सूर्योदय</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{panchangData.data?.sunrise || "गणना हो रही है..."}</p>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-orange-600">सूर्यास्त</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{panchangData.data?.sunset || "गणना हो रही है..."}</p>
                  </CardContent>
                </Card>
              </div>

              <div className="text-center mt-6">
                <Link href="/hindi/panchang">
                  <Button variant="outline" className="text-purple-600 border-purple-200 hover:bg-purple-50">
                    पूरा पंचांग देखें <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Today's Astrology Prediction */}
        <section className="py-12 bg-amber-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">आज की ज्योतिष भविष्यवाणी</h2>
              <p className="text-gray-600">अपनी राशि का दैनिक राशिफल देखें</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {zodiacSigns.map((sign, index) => (
                <motion.div
                  key={sign.english}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link href={`/hindi/daily-horoscope/${sign.english}`}>
                    <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 bg-white hover:bg-gradient-to-br hover:from-amber-50 hover:to-orange-50">
                      <CardContent className="p-4 text-center">
                        <div className={`w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-br ${sign.color} flex items-center justify-center text-white font-bold text-lg`}>
                          {sign.name.charAt(0)}
                        </div>
                        <p className="font-medium text-gray-800">{sign.name}</p>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Free Astrology Tools */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">🔮 AstroTick के साथ अपना भाग्य खोलें</h2>
              <p className="text-gray-600">निःशुल्क ज्योतिष उपकरण और कैलकुलेटर</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {astrologyTools.map((tool, index) => (
                <motion.div
                  key={tool.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link href={tool.link}>
                    <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 bg-white rounded-3xl">
                      <CardContent className="p-6 text-center">
                        <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center text-white text-2xl`}>
                          {tool.icon}
                        </div>
                        <h3 className="font-semibold text-gray-800 mb-2">{tool.name}</h3>
                        <Button size="sm" variant="outline" className="w-full">
                          अभी करें
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Expert Astrologers */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">विशेषज्ञ ज्योतिषी</h2>
              <p className="text-gray-600">प्रमाणित और अनुभवी ज्योतिषियों से परामर्श लें</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {astrologers.slice(0, 3).map((astrologer) => (
                <Card key={astrologer.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <img 
                        src={`/api/astrologer-image/${astrologer.name.toLowerCase().replace(/\s+/g, '-').replace(/\./g, '')}`}
                        alt={astrologer.name}
                        className="w-16 h-16 rounded-full object-cover mr-4"
                      />
                      <div>
                        <h3 className="font-bold text-lg">{astrologer.name}</h3>
                        <div className="flex items-center text-yellow-500">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-current" />
                          ))}
                          <span className="ml-2 text-gray-600">({astrologer.rating})</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">{astrologer.specializations.join(", ")}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-green-600">₹{astrologer.ratePerMinute}/मिनट</span>
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                        चैट करें
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link href="/hindi/astrologers">
                <Button variant="outline" className="text-purple-600 border-purple-200 hover:bg-purple-50">
                  सभी ज्योतिषी देखें <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Comprehensive Astrology Guide */}
        <section className="py-16 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                🔮 AstroTick के साथ अपना भाग्य खोलें
              </h2>
              <p className="text-xl text-purple-100 max-w-4xl mx-auto leading-relaxed">
                हजारों साल पुराने वैदिक ज्योतिष के ज्ञान के साथ अपने जीवन की सच्चाई को समझें और अपनी नियति को आकार दें।
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20"
              >
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-bold mb-3">आत्म-खोज</h3>
                <p className="text-purple-100">अपनी वास्तविक प्रकृति, शक्तियां और कमजोरियां जानें</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20"
              >
                <div className="text-4xl mb-4">💕</div>
                <h3 className="text-xl font-bold mb-3">रिश्ते की अनुकूलता</h3>
                <p className="text-purple-100">जीवनसाथी और व्यावसायिक भागीदारों के साथ तालमेल बिठाएं</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20"
              >
                <div className="text-4xl mb-4">💼</div>
                <h3 className="text-xl font-bold mb-3">करियर मार्गदर्शन</h3>
                <p className="text-purple-100">सही करियर पथ और व्यावसायिक सफलता की दिशा पाएं</p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-center"
            >
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button size="lg" className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-purple-900 font-bold px-8 py-3 text-lg">
                  मुफ्त जन्म कुंडली
                </Button>
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-purple-800 px-8 py-3 text-lg">
                  ज्योतिषी से बात करें
                </Button>
                <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 text-lg">
                  व्यक्तिगत रीडिंग
                </Button>
              </div>
              <p className="mt-6 text-lg text-purple-200">
                💎 <strong>50,000+</strong> संतुष्ट ग्राहकों के साथ जुड़ें जिन्होंने अपनी नियति खोजी है!
              </p>
            </motion.div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}