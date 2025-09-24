import { motion } from "framer-motion";
import {
  Star,
  TrendingUp,
  Heart,
  Shield,
  Calendar,
  Crown,
  Zap,
} from "lucide-react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { Button } from "src/components/ui/button";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";

export default function Horoscope2025() {
  const zodiacPredictions = [
    {
      name: "Aries",
      symbol: "♈",
      color: "from-red-400 to-orange-500",
      highlights: [
        "Career breakthrough",
        "New relationships",
        "Financial gains",
      ],
      luckyMonths: ["March", "July", "November"],
      challenges: ["May might bring stress", "August requires patience"],
      overall:
        "A transformative year with major opportunities for growth and success.",
    },
    {
      name: "Taurus",
      symbol: "♉",
      color: "from-green-400 to-teal-500",
      highlights: [
        "Property investments",
        "Stable relationships",
        "Health improvements",
      ],
      luckyMonths: ["April", "August", "December"],
      challenges: ["June financial decisions", "September work pressure"],
      overall:
        "Steady progress with focus on building long-term security and stability.",
    },
    {
      name: "Gemini",
      symbol: "♊",
      color: "from-yellow-400 to-orange-500",
      highlights: [
        "Communication skills",
        "Learning opportunities",
        "Travel adventures",
      ],
      luckyMonths: ["May", "September", "January"],
      challenges: ["July indecision", "October relationship tests"],
      overall:
        "A year of intellectual growth and expanding your social network.",
    },
    {
      name: "Cancer",
      symbol: "♋",
      color: "from-blue-400 to-purple-500",
      highlights: ["Family harmony", "Emotional healing", "Creative projects"],
      luckyMonths: ["June", "October", "February"],
      challenges: ["April mood swings", "November financial strain"],
      overall: "Focus on emotional well-being and strengthening family bonds.",
    },
    {
      name: "Leo",
      symbol: "♌",
      color: "from-orange-400 to-red-500",
      highlights: ["Leadership roles", "Recognition", "Creative success"],
      luckyMonths: ["July", "November", "March"],
      challenges: ["May ego clashes", "September health issues"],
      overall:
        "Shine bright with opportunities for leadership and creative expression.",
    },
    {
      name: "Virgo",
      symbol: "♍",
      color: "from-green-400 to-blue-500",
      highlights: [
        "Health improvements",
        "Work efficiency",
        "Detail-oriented success",
      ],
      luckyMonths: ["August", "December", "April"],
      challenges: ["June perfectionism", "October overthinking"],
      overall: "Perfect time to organize life and achieve practical goals.",
    },
    {
      name: "Libra",
      symbol: "♎",
      color: "from-pink-400 to-purple-500",
      highlights: [
        "Partnership opportunities",
        "Aesthetic pursuits",
        "Legal victories",
      ],
      luckyMonths: ["September", "January", "May"],
      challenges: ["July indecision", "November relationship conflicts"],
      overall:
        "Balance and harmony lead to significant partnerships and collaborations.",
    },
    {
      name: "Scorpio",
      symbol: "♏",
      color: "from-purple-400 to-red-500",
      highlights: ["Transformation", "Hidden talents", "Spiritual growth"],
      luckyMonths: ["October", "February", "June"],
      challenges: ["August intensity", "December secrets revealed"],
      overall:
        "Deep transformation and uncovering hidden potentials for success.",
    },
    {
      name: "Sagittarius",
      symbol: "♐",
      color: "from-blue-400 to-green-500",
      highlights: [
        "Higher education",
        "International connections",
        "Philosophy",
      ],
      luckyMonths: ["November", "March", "July"],
      challenges: ["September overconfidence", "January travel delays"],
      overall:
        "Expand horizons through education, travel, and philosophical pursuits.",
    },
    {
      name: "Capricorn",
      symbol: "♑",
      color: "from-gray-400 to-blue-500",
      highlights: [
        "Career advancement",
        "Authority positions",
        "Long-term planning",
      ],
      luckyMonths: ["December", "April", "August"],
      challenges: ["June work pressure", "February relationship strain"],
      overall:
        "Climb the ladder of success with determination and strategic planning.",
    },
    {
      name: "Aquarius",
      symbol: "♒",
      color: "from-cyan-400 to-blue-500",
      highlights: ["Innovation", "Social causes", "Technology gains"],
      luckyMonths: ["January", "May", "September"],
      challenges: ["July rebellious phase", "March friendship issues"],
      overall:
        "Revolutionary year with focus on innovation and humanitarian causes.",
    },
    {
      name: "Pisces",
      symbol: "♓",
      color: "from-purple-400 to-pink-500",
      highlights: [
        "Intuitive abilities",
        "Artistic success",
        "Spiritual awakening",
      ],
      luckyMonths: ["February", "June", "October"],
      challenges: ["April confusion", "August emotional turmoil"],
      overall:
        "Trust your intuition and embrace your creative and spiritual gifts.",
    },
  ];

  const majorTransits = [
    {
      planet: "Jupiter",
      sign: "Gemini → Cancer",
      period: "May 2025",
      impact:
        "Expansion in communication, family matters, and emotional growth",
      icon: Crown,
      color: "from-yellow-400 to-orange-500",
    },
    {
      planet: "Saturn",
      sign: "Pisces",
      period: "Entire 2025",
      impact: "Spiritual discipline, creative structure, and karmic lessons",
      icon: Shield,
      color: "from-blue-400 to-purple-500",
    },
    {
      planet: "Rahu",
      sign: "Pisces → Aquarius",
      period: "May 2025",
      impact: "Innovation, technology, and humanitarian focus shifts",
      icon: Zap,
      color: "from-cyan-400 to-blue-500",
    },
    {
      planet: "Ketu",
      sign: "Virgo → Leo",
      period: "May 2025",
      impact: "Creative detachment, spiritual perfectionism, and ego release",
      icon: Star,
      color: "from-orange-400 to-red-500",
    },
  ];

  const monthlyHighlights = [
    { month: "January", theme: "New Beginnings", key: "Set ambitious goals" },
    {
      month: "February",
      theme: "Love & Romance",
      key: "Strengthen relationships",
    },
    {
      month: "March",
      theme: "Career Focus",
      key: "Professional opportunities",
    },
    {
      month: "April",
      theme: "Financial Growth",
      key: "Investment opportunities",
    },
    { month: "May", theme: "Major Transits", key: "Planetary shifts impact" },
    { month: "June", theme: "Health & Wellness", key: "Focus on well-being" },
    { month: "July", theme: "Creative Expression", key: "Artistic pursuits" },
    { month: "August", theme: "Family Harmony", key: "Strengthen bonds" },
    {
      month: "September",
      theme: "Learning & Growth",
      key: "Educational opportunities",
    },
    { month: "October", theme: "Transformation", key: "Personal evolution" },
    { month: "November", theme: "Spiritual Growth", key: "Inner development" },
    {
      month: "December",
      theme: "Reflection & Planning",
      key: "Prepare for 2026",
    },
  ];

  return (
    <>
      <AstroTickHeader />
      <main className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        {/* Hero Section */}
        <section className="relative py-20 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600">
                2025
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-800">
                Horoscope Predictions
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto">
                Discover what the stars have in store for you in 2025. Complete
                yearly predictions, major planetary transits, and monthly
                guidance for all zodiac signs.
              </p>

              {/* Animated Year Badge */}
              <div className="relative inline-block">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotateY: [0, 180, 360],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500"
                >
                  ✨
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Major Planetary Transits */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4 text-gray-800">
                Major Planetary Transits 2025
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                The most significant planetary movements that will shape your
                year
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {majorTransits.map((transit, index) => (
                <motion.div
                  key={transit.planet}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 border-2 hover:border-purple-300">
                    <CardHeader className="text-center">
                      <div
                        className={`w-16 h-16 rounded-full bg-gradient-to-br ${transit.color} flex items-center justify-center text-white mb-4 mx-auto`}
                      >
                        <transit.icon className="w-8 h-8" />
                      </div>
                      <CardTitle className="text-xl font-bold text-gray-800">
                        {transit.planet}
                      </CardTitle>
                      <p className="text-sm text-purple-600 font-semibold">
                        {transit.sign}
                      </p>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-sm text-gray-600 mb-2">
                        {transit.period}
                      </p>
                      <p className="text-sm text-gray-700">{transit.impact}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Zodiac Predictions */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4 text-gray-800">
                2025 Predictions by Zodiac Sign
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Detailed yearly predictions for each zodiac sign with highlights
                and challenges
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {zodiacPredictions.map((sign, index) => (
                <motion.div
                  key={sign.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 border-2 hover:border-purple-300">
                    <CardHeader className="text-center">
                      <div
                        className={`w-16 h-16 rounded-full bg-gradient-to-br ${sign.color} flex items-center justify-center text-white text-3xl font-bold mb-4 mx-auto`}
                      >
                        {sign.symbol}
                      </div>
                      <CardTitle className="text-2xl font-bold text-gray-800">
                        {sign.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-gray-700 text-center italic">
                        {sign.overall}
                      </p>

                      <div>
                        <h4 className="font-semibold text-green-600 mb-2">
                          ✨ Highlights
                        </h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {sign.highlights.map((highlight, i) => (
                            <li key={i} className="flex items-center">
                              <Star className="w-3 h-3 text-yellow-400 mr-2" />
                              {highlight}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-blue-600 mb-2">
                          🌟 Lucky Months
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {sign.luckyMonths.map((month, i) => (
                            <span
                              key={i}
                              className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                            >
                              {month}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-orange-600 mb-2">
                          ⚠️ Challenges
                        </h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {sign.challenges.map((challenge, i) => (
                            <li key={i} className="flex items-start">
                              <Shield className="w-3 h-3 text-orange-400 mr-2 mt-1 flex-shrink-0" />
                              {challenge}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Monthly Overview */}
        <section className="py-16 px-4 bg-gradient-to-r from-purple-100 via-pink-100 to-orange-100">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4 text-gray-800">
                Monthly Themes 2025
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Each month brings unique cosmic energies and opportunities
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {monthlyHighlights.map((month, index) => (
                <motion.div
                  key={month.month}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 bg-white border-2 hover:border-purple-300">
                    <CardHeader className="text-center pb-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-lg mb-3 mx-auto">
                        {month.month.slice(0, 3)}
                      </div>
                      <CardTitle className="text-lg font-bold text-gray-800">
                        {month.month}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center pt-0">
                      <p className="text-sm font-semibold text-purple-600 mb-2">
                        {month.theme}
                      </p>
                      <p className="text-xs text-gray-600">{month.key}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold mb-6 text-white">
                Ready to Unlock Your 2025 Potential?
              </h2>
              <p className="text-xl text-white mb-8 opacity-90">
                Get personalized predictions and detailed analysis for your
                zodiac sign
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/kundli">
                  <Button
                    size="lg"
                    className="bg-white text-purple-600 hover:bg-gray-100 font-bold px-8 py-4 text-lg"
                  >
                    <Star className="w-5 h-5 mr-2" />
                    Get Personal Horoscope
                  </Button>
                </Link>
                <Link href="/astrologers">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-purple-600 hover:bg-white hover:text-purple-600 font-bold px-8 py-4 text-lg"
                  >
                    Consult Expert Astrologer
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
