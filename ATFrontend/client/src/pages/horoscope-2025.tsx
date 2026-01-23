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
import { openAstroWhatsApp } from "../utils/whatsapp";

export default function Horoscope2025() {
  const currentYear = new Date().getFullYear();
  const zodiacPredictions = [
  {
    name: "Aries",
    symbol: "♈",
    color: "from-red-400 to-orange-500",
    highlights: [
      "Personal reinvention",
      "Career visibility",
      "Leadership opportunities",
    ],
    luckyMonths: ["April", "July", "November"],
    challenges: ["August impatience", "October relationship pressure"],
    overall:
      "A year of bold self-growth and leadership, requiring patience in partnerships.",
  },
  {
    name: "Taurus",
    symbol: "♉",
    color: "from-green-400 to-teal-500",
    highlights: [
      "Financial planning",
      "Skill monetization",
      "Emotional stability",
    ],
    luckyMonths: ["May", "September", "December"],
    challenges: ["June expenses", "October stubbornness"],
    overall:
      "Focus on smart finances and building security through practical skills.",
  },
  {
    name: "Gemini",
    symbol: "♊",
    color: "from-yellow-400 to-orange-500",
    highlights: [
      "Major personal growth",
      "Communication success",
      "New opportunities",
    ],
    luckyMonths: ["May", "June", "October"],
    challenges: ["August overthinking", "December burnout"],
    overall:
      "A powerful year of expansion, learning, and personal breakthroughs.",
  },
  {
    name: "Cancer",
    symbol: "♋",
    color: "from-blue-400 to-purple-500",
    highlights: [
      "Emotional healing",
      "Inner strength",
      "Spiritual development",
    ],
    luckyMonths: ["February", "July", "November"],
    challenges: ["April emotional sensitivity", "September family stress"],
    overall:
      "An introspective year that strengthens emotional resilience and wisdom.",
  },
  {
    name: "Leo",
    symbol: "♌",
    color: "from-orange-400 to-red-500",
    highlights: [
      "Creative recognition",
      "Leadership growth",
      "Social influence",
    ],
    luckyMonths: ["March", "August", "December"],
    challenges: ["May ego clashes", "October authority tension"],
    overall:
      "Step into leadership with humility to maximize long-term success.",
  },
  {
    name: "Virgo",
    symbol: "♍",
    color: "from-green-400 to-blue-500",
    highlights: [
      "Career restructuring",
      "Health discipline",
      "Strategic planning",
    ],
    luckyMonths: ["January", "September", "December"],
    challenges: ["March overwork", "July self-criticism"],
    overall:
      "A year of disciplined progress through organization and self-care.",
  },
  {
    name: "Libra",
    symbol: "♎",
    color: "from-pink-400 to-purple-500",
    highlights: [
      "Relationship clarity",
      "Legal resolutions",
      "Personal balance",
    ],
    luckyMonths: ["February", "June", "October"],
    challenges: ["April indecision", "August emotional imbalance"],
    overall:
      "Partnerships evolve significantly, requiring honesty and balance.",
  },
  {
    name: "Scorpio",
    symbol: "♏",
    color: "from-purple-400 to-red-500",
    highlights: [
      "Deep transformation",
      "Career empowerment",
      "Psychological insight",
    ],
    luckyMonths: ["May", "July", "November"],
    challenges: ["September power struggles", "December emotional intensity"],
    overall:
      "Transformation brings strength—embrace change without control battles.",
  },
  {
    name: "Sagittarius",
    symbol: "♐",
    color: "from-blue-400 to-green-500",
    highlights: [
      "Relationship expansion",
      "Learning partnerships",
      "New perspectives",
    ],
    luckyMonths: ["January", "June", "October"],
    challenges: ["March impatience", "August commitment fears"],
    overall:
      "Growth comes through meaningful connections and shared knowledge.",
  },
  {
    name: "Capricorn",
    symbol: "♑",
    color: "from-gray-400 to-blue-500",
    highlights: [
      "Work-life restructuring",
      "Health awareness",
      "Career discipline",
    ],
    luckyMonths: ["April", "July", "December"],
    challenges: ["May exhaustion", "September rigidity"],
    overall:
      "Long-term success depends on balancing ambition with well-being.",
  },
  {
    name: "Aquarius",
    symbol: "♒",
    color: "from-cyan-400 to-blue-500",
    highlights: [
      "Creative innovation",
      "Social recognition",
      "Future-oriented projects",
    ],
    luckyMonths: ["February", "May", "August"],
    challenges: ["June unpredictability", "November authority issues"],
    overall:
      "A creative and innovative year that rewards originality with discipline.",
  },
  {
    name: "Pisces",
    symbol: "♓",
    color: "from-purple-400 to-pink-500",
    highlights: [
      "Personal responsibility",
      "Spiritual maturity",
      "Emotional grounding",
    ],
    luckyMonths: ["March", "June", "September"],
    challenges: ["January self-doubt", "October emotional fatigue"],
    overall:
      "A defining year of maturity, demanding structure alongside spirituality.",
  },
];

  const majorTransits = [
  {
    planet: "Jupiter",
    sign: "Taurus → Gemini",
    period: `May ${currentYear}`,
    impact:
      "Expansion in communication, learning, business growth, networking, and intellectual pursuits",
    icon: Crown,
    color: "from-yellow-400 to-orange-500",
  },
  {
    planet: "Saturn",
    sign: "Pisces",
    period: `Entire ${currentYear}`,
    impact:
      "Spiritual discipline, emotional maturity, karmic cleansing, and long-term responsibility",
    icon: Shield,
    color: "from-blue-400 to-purple-500",
  },
  {
    planet: "Rahu",
    sign: "Aquarius → Capricorn",
    period: `November ${currentYear}`,
    impact:
      "Shift from innovation to ambition, authority, structured growth, and career focus",
    icon: Zap,
    color: "from-cyan-400 to-blue-500",
  },
  {
    planet: "Ketu",
    sign: "Leo → Cancer",
    period: `November ${currentYear}`,
    impact:
      "Detachment from ego and recognition, emotional inward focus, and ancestral healing",
    icon: Star,
    color: "from-orange-400 to-red-500",
  },
];

  const monthlyHighlights = [
  { month: "January", theme: "New Beginnings", key: "Reset goals and priorities" },
  {
    month: "February",
    theme: "Love & Connection",
    key: "Strengthen emotional bonds",
  },
  {
    month: "March",
    theme: "Career Focus",
    key: "Skill-building and visibility at work",
  },
  {
    month: "April",
    theme: "Financial Awareness",
    key: "Plan budgets and long-term security",
  },
  {
    month: "May",
    theme: "Major Transits",
    key: "Jupiter shift brings new opportunities",
  },
  {
    month: "June",
    theme: "Health & Wellness",
    key: "Balance mental and physical well-being",
  },
  {
    month: "July",
    theme: "Self-Improvement",
    key: "Refine habits and personal routines",
  },
  {
    month: "August",
    theme: "Relationships Review",
    key: "Reassess commitments and expectations",
  },
  {
    month: "September",
    theme: "Learning & Growth",
    key: "Expand knowledge and communication skills",
  },
  {
    month: "October",
    theme: "Transformation",
    key: "Release old patterns and evolve",
  },
  {
    month: "November",
    theme: "Karmic Shifts",
    key: "Rahu–Ketu changes reshape life direction",
  },
  {
    month: "December",
    theme: "Reflection & Planning",
    key: "Prepare for 2027",
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
                {currentYear}
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-800">
                Horoscope Predictions
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto">
                Discover what the stars have in store for you in {currentYear}. Complete
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
                Major Planetary Transits {currentYear}
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
                {currentYear} Predictions by Zodiac Sign
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
                Monthly Themes {currentYear}
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
                Ready to Unlock Your {currentYear} Potential?
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
                {/* <Link href="/astrologers"> */}
                  <Button type="button"
                  onClick={openAstroWhatsApp}
                    size="lg"
                    variant="outline"
                    className="border-white text-purple-600 hover:bg-white hover:text-purple-600 font-bold px-8 py-4 text-lg"
                  >
                    Consult Expert Astrologer
                  </Button>
                {/* </Link> */}
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
