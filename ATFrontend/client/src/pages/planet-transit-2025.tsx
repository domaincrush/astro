import { motion } from "framer-motion";
import {
  Sun,
  Moon,
  Star,
  Zap,
  Crown,
  Shield,
  TrendingUp,
  Heart,
} from "lucide-react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { Button } from "src/components/ui/button";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";

export default function PlanetTransit2025() {
  const majorTransits = [
    {
      planet: "Jupiter",
      transit: "Gemini → Cancer",
      date: "May 15, 2025",
      duration: "13 months",
      effects:
        "Expansion in communication, education, family matters, and emotional growth",
      benefits: [
        "Enhanced learning",
        "Family harmony",
        "Property gains",
        "Spiritual growth",
      ],
      challenges: [
        "Emotional sensitivity",
        "Family conflicts",
        "Over-spending",
      ],
      color: "from-yellow-400 to-orange-500",
      icon: Crown,
    },
    {
      planet: "Saturn",
      transit: "Pisces (continues)",
      date: "Throughout 2025",
      duration: "2.5 years cycle",
      effects:
        "Spiritual discipline, creative restrictions, karmic lessons in compassion",
      benefits: [
        "Spiritual growth",
        "Artistic abilities",
        "Compassion",
        "Healing powers",
      ],
      challenges: [
        "Confusion",
        "Addiction issues",
        "Spiritual tests",
        "Health concerns",
      ],
      color: "from-blue-400 to-purple-500",
      icon: Shield,
    },
    {
      planet: "Rahu",
      transit: "Pisces → Aquarius",
      date: "May 30, 2025",
      duration: "18 months",
      effects:
        "Shift from spirituality to innovation, technology, and humanitarian causes",
      benefits: [
        "Technical skills",
        "Innovation",
        "Social causes",
        "Networking",
      ],
      challenges: [
        "Technology addiction",
        "Rebel attitudes",
        "Friendship issues",
      ],
      color: "from-purple-400 to-indigo-500",
      icon: Zap,
    },
    {
      planet: "Ketu",
      transit: "Virgo → Leo",
      date: "May 30, 2025",
      duration: "18 months",
      effects: "From perfectionism to creative detachment, ego dissolution",
      benefits: [
        "Creative insights",
        "Spiritual creativity",
        "Leadership wisdom",
      ],
      challenges: ["Ego issues", "Authority problems", "Creative blocks"],
      color: "from-orange-400 to-red-500",
      icon: Star,
    },
  ];

  const monthlyTransits = [
    {
      month: "January",
      highlights: [
        "Mercury retrograde (1st-21st) - Communication delays",
        "Venus in Capricorn - Serious relationships",
        "Mars in Cancer - Home and family focus",
      ],
    },
    {
      month: "February",
      highlights: [
        "Sun in Aquarius - Innovation and friendship",
        "New Moon in Aquarius - Fresh start in social circles",
        "Mercury in Pisces - Intuitive communication",
      ],
    },
    {
      month: "March",
      highlights: [
        "Spring Equinox - Balance and new beginnings",
        "Venus in Aries - Bold romantic moves",
        "Full Moon in Libra - Relationship decisions",
      ],
    },
    {
      month: "April",
      highlights: [
        "Mercury in Aries - Direct communication",
        "Solar Eclipse in Aries - Major personal changes",
        "Jupiter aspecting Venus - Love and abundance",
      ],
    },
    {
      month: "May",
      highlights: [
        "Jupiter enters Cancer - Family expansion",
        "Rahu-Ketu axis shift - Major life changes",
        "Venus retrograde begins - Relationship reviews",
      ],
    },
    {
      month: "June",
      highlights: [
        "Mercury in Gemini - Enhanced communication",
        "Summer Solstice - Peak solar energy",
        "Mars in Leo - Creative and dramatic energy",
      ],
    },
    {
      month: "July",
      highlights: [
        "Venus retrograde continues - Past love returns",
        "New Moon in Cancer - Emotional new beginnings",
        "Mercury in Cancer - Family communications",
      ],
    },
    {
      month: "August",
      highlights: [
        "Venus direct - Relationship clarity",
        "Mars in Virgo - Practical action",
        "Full Moon in Aquarius - Friendship focus",
      ],
    },
    {
      month: "September",
      highlights: [
        "Mercury retrograde (9th-30th) - Review and revise",
        "Autumn Equinox - Balance and harvest",
        "Jupiter trine Venus - Lucky in love",
      ],
    },
    {
      month: "October",
      highlights: [
        "Solar Eclipse in Libra - Relationship changes",
        "Mars in Libra - Partnership actions",
        "Venus in Scorpio - Deep emotions",
      ],
    },
    {
      month: "November",
      highlights: [
        "Mercury in Scorpio - Deep investigations",
        "New Moon in Scorpio - Transformation",
        "Jupiter sextile Mars - Successful actions",
      ],
    },
    {
      month: "December",
      highlights: [
        "Winter Solstice - Spiritual renewal",
        "Venus in Sagittarius - Adventurous love",
        "Mercury retrograde begins - Year-end reviews",
      ],
    },
  ];

  const transitEffects = [
    {
      title: "Career & Business",
      description:
        "Major planetary transits influence professional growth and business ventures",
      keyPeriods: [
        "Jupiter in Cancer (May-Dec)",
        "Saturn in Pisces (All year)",
      ],
      advice:
        "Focus on family businesses, emotional intelligence in leadership, and spiritual approaches to work",
      color: "from-green-400 to-teal-500",
    },
    {
      title: "Relationships & Love",
      description:
        "Venus and Mars transits create dynamic relationship energies",
      keyPeriods: ["Venus retrograde (May-July)", "Mars in various signs"],
      advice:
        "Review past relationships, heal emotional wounds, and build deeper connections",
      color: "from-pink-400 to-red-500",
    },
    {
      title: "Health & Wellness",
      description:
        "Saturn in Pisces emphasizes mental health and spiritual wellness",
      keyPeriods: ["Saturn in Pisces (All year)", "Mercury retrogrades"],
      advice:
        "Focus on mental health, spiritual practices, and holistic healing approaches",
      color: "from-blue-400 to-purple-500",
    },
    {
      title: "Finance & Investments",
      description:
        "Jupiter's transit brings expansion opportunities in money matters",
      keyPeriods: ["Jupiter in Cancer (May-Dec)", "Eclipse seasons"],
      advice:
        "Invest in real estate, family businesses, and emotional security-focused ventures",
      color: "from-yellow-400 to-orange-500",
    },
  ];

  const eclipseSchedule = [
    {
      type: "Solar Eclipse",
      date: "April 8, 2025",
      sign: "Aries",
      effects: "New beginnings, leadership changes, personal transformation",
      duration: "6 months influence",
    },
    {
      type: "Lunar Eclipse",
      date: "September 18, 2025",
      sign: "Pisces",
      effects:
        "Emotional revelations, spiritual insights, relationship endings",
      duration: "6 months influence",
    },
    {
      type: "Solar Eclipse",
      date: "October 2, 2025",
      sign: "Libra",
      effects: "Partnership changes, legal matters, balance restoration",
      duration: "6 months influence",
    },
  ];

  return (
    <>
      <AstroTickHeader />
      <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50">
        {/* Hero Section */}
        <section className="relative py-20 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600">
                2025
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-800">
                Planetary Transits
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto">
                Navigate the cosmic shifts of 2025 with detailed planetary
                transit predictions. Understand how major planetary movements
                will influence your life and decisions.
              </p>

              {/* Animated Solar System */}
              <div className="relative w-64 h-64 mx-auto mb-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute inset-0"
                >
                  <div className="w-8 h-8 bg-yellow-400 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                  <div className="w-4 h-4 bg-blue-400 rounded-full absolute top-8 left-1/2 transform -translate-x-1/2"></div>
                  <div className="w-3 h-3 bg-red-400 rounded-full absolute bottom-8 left-1/2 transform -translate-x-1/2"></div>
                  <div className="w-5 h-5 bg-orange-400 rounded-full absolute left-8 top-1/2 transform -translate-y-1/2"></div>
                  <div className="w-6 h-6 bg-purple-400 rounded-full absolute right-8 top-1/2 transform -translate-y-1/2"></div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Major Transits */}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                      <CardTitle className="text-2xl font-bold text-gray-800">
                        {transit.planet}
                      </CardTitle>
                      <p className="text-lg text-purple-600 font-semibold">
                        {transit.transit}
                      </p>
                      <p className="text-sm text-gray-600">
                        {transit.date} | {transit.duration}
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-gray-700">{transit.effects}</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-green-600 mb-2">
                            ✨ Benefits:
                          </h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {transit.benefits.map((benefit, i) => (
                              <li key={i} className="flex items-start">
                                <Star className="w-3 h-3 text-green-400 mr-2 mt-1 flex-shrink-0" />
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold text-orange-600 mb-2">
                            ⚠️ Challenges:
                          </h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {transit.challenges.map((challenge, i) => (
                              <li key={i} className="flex items-start">
                                <Shield className="w-3 h-3 text-orange-400 mr-2 mt-1 flex-shrink-0" />
                                {challenge}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Monthly Transit Highlights */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4 text-gray-800">
                Monthly Transit Highlights
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Key planetary movements and their effects month by month
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {monthlyTransits.map((month, index) => (
                <motion.div
                  key={month.month}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 border-2 hover:border-purple-300">
                    <CardHeader className="text-center">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-indigo-400 flex items-center justify-center text-white font-bold text-sm mb-3 mx-auto">
                        {month.month.slice(0, 3)}
                      </div>
                      <CardTitle className="text-lg font-bold text-gray-800">
                        {month.month}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {month.highlights.map((highlight, i) => (
                        <div key={i} className="bg-purple-50 p-2 rounded-lg">
                          <p className="text-xs text-purple-800">{highlight}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Transit Effects by Life Area */}
        <section className="py-16 px-4 bg-gradient-to-r from-purple-100 via-blue-100 to-indigo-100">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4 text-gray-800">
                Transit Effects by Life Area
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                How planetary transits influence different aspects of your life
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {transitEffects.map((effect, index) => (
                <motion.div
                  key={effect.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 border-2 hover:border-purple-300 bg-white">
                    <CardHeader className="text-center">
                      <div
                        className={`w-16 h-16 rounded-full bg-gradient-to-br ${effect.color} flex items-center justify-center text-white mb-4 mx-auto`}
                      >
                        <TrendingUp className="w-8 h-8" />
                      </div>
                      <CardTitle className="text-xl font-bold text-gray-800">
                        {effect.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-gray-700">
                        {effect.description}
                      </p>

                      <div>
                        <h4 className="font-semibold text-purple-600 mb-2">
                          🌟 Key Periods:
                        </h4>
                        <div className="space-y-1">
                          {effect.keyPeriods.map((period, i) => (
                            <span
                              key={i}
                              className="block text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded"
                            >
                              {period}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="bg-purple-50 p-3 rounded-lg">
                        <h4 className="font-semibold text-purple-600 mb-1">
                          💡 Advice:
                        </h4>
                        <p className="text-sm text-purple-800">
                          {effect.advice}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Eclipse Schedule */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4 text-gray-800">
                Eclipse Schedule 2025
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Major eclipse events and their transformative effects
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {eclipseSchedule.map((eclipse, index) => (
                <motion.div
                  key={eclipse.date}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 border-2 hover:border-purple-300">
                    <CardHeader className="text-center">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-600 to-black flex items-center justify-center text-white mb-4 mx-auto">
                        {eclipse.type === "Solar Eclipse" ? (
                          <Sun className="w-8 h-8" />
                        ) : (
                          <Moon className="w-8 h-8" />
                        )}
                      </div>
                      <CardTitle className="text-xl font-bold text-gray-800">
                        {eclipse.type}
                      </CardTitle>
                      <p className="text-sm text-purple-600 font-semibold">
                        {eclipse.date}
                      </p>
                      <p className="text-sm text-gray-600">in {eclipse.sign}</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-gray-700">{eclipse.effects}</p>
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-purple-800">
                          Impact Duration: {eclipse.duration}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold mb-6 text-white">
                Navigate 2025 with Planetary Wisdom
              </h2>
              <p className="text-xl text-white mb-8 opacity-90">
                Get personalized transit predictions and guidance for your
                unique birth chart
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/kundli">
                  <Button
                    size="lg"
                    className="bg-white text-purple-600 hover:bg-gray-100 font-bold px-8 py-4 text-lg"
                  >
                    <Star className="w-5 h-5 mr-2" />
                    Get Personal Transit Report
                  </Button>
                </Link>
                <Link href="/astrologers">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-purple-600 hover:bg-white hover:text-purple-600 font-bold px-8 py-4 text-lg"
                  >
                    Consult Transit Expert
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
