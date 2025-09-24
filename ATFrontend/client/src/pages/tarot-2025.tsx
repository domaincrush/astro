import { motion } from "framer-motion";
import { Zap, Star, Heart, Shield, Crown, Eye, Moon, Sun } from "lucide-react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { Button } from "src/components/ui/button";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";

export default function Tarot2025() {
  const majorArchanaCards = [
    {
      name: "The Fool",
      number: 0,
      theme: "New Beginnings",
      message: "2025 brings fresh starts and leap of faith opportunities",
      color: "from-yellow-400 to-orange-500",
      keywords: ["Adventure", "Freedom", "Spontaneity"],
    },
    {
      name: "The Magician",
      number: 1,
      theme: "Manifestation",
      message: "Your ability to manifest desires reaches its peak in 2025",
      color: "from-purple-400 to-pink-500",
      keywords: ["Power", "Focus", "Creation"],
    },
    {
      name: "The High Priestess",
      number: 2,
      theme: "Intuition",
      message: "Trust your inner wisdom and psychic abilities this year",
      color: "from-blue-400 to-purple-500",
      keywords: ["Intuition", "Mystery", "Wisdom"],
    },
    {
      name: "The Empress",
      number: 3,
      theme: "Creativity & Abundance",
      message: "Fertile ground for creative projects and material abundance",
      color: "from-green-400 to-teal-500",
      keywords: ["Creativity", "Abundance", "Nature"],
    },
    {
      name: "The Emperor",
      number: 4,
      theme: "Structure & Authority",
      message: "Leadership opportunities and need for structure in 2025",
      color: "from-red-400 to-orange-500",
      keywords: ["Authority", "Structure", "Leadership"],
    },
    {
      name: "The Hierophant",
      number: 5,
      theme: "Tradition & Learning",
      message: "Spiritual teachings and traditional wisdom guide your path",
      color: "from-gray-400 to-blue-500",
      keywords: ["Tradition", "Learning", "Spirituality"],
    },
    {
      name: "The Lovers",
      number: 6,
      theme: "Relationships & Choices",
      message: "Important relationship decisions and soul connections await",
      color: "from-pink-400 to-red-500",
      keywords: ["Love", "Choices", "Harmony"],
    },
    {
      name: "The Chariot",
      number: 7,
      theme: "Determination & Success",
      message: "Victory through determination and focused willpower",
      color: "from-blue-400 to-cyan-500",
      keywords: ["Victory", "Determination", "Control"],
    },
    {
      name: "Strength",
      number: 8,
      theme: "Inner Strength & Courage",
      message: "Your inner strength and gentle power overcome all obstacles",
      color: "from-orange-400 to-red-500",
      keywords: ["Courage", "Patience", "Inner Power"],
    },
  ];

  const seasonalTarotThemes = [
    {
      season: "Spring 2025",
      months: "March - May",
      theme: "The Empress Energy",
      focus: "Creativity, growth, and new beginnings flourish",
      cards: ["The Fool", "The Empress", "Three of Cups"],
      advice: "Plant seeds for future success and embrace creative projects",
      color: "from-green-400 to-teal-500",
    },
    {
      season: "Summer 2025",
      months: "June - August",
      theme: "The Sun's Radiance",
      focus: "Joy, success, and celebration of achievements",
      cards: ["The Sun", "The Magician", "Six of Wands"],
      advice: "Celebrate victories and share your light with others",
      color: "from-yellow-400 to-orange-500",
    },
    {
      season: "Autumn 2025",
      months: "September - November",
      theme: "The Hermit's Wisdom",
      focus: "Introspection, wisdom, and spiritual seeking",
      cards: ["The Hermit", "The High Priestess", "Four of Swords"],
      advice: "Turn inward for guidance and trust your inner wisdom",
      color: "from-purple-400 to-indigo-500",
    },
    {
      season: "Winter 2025",
      months: "December - February",
      theme: "The Star's Hope",
      focus: "Hope, healing, and preparation for new cycles",
      cards: ["The Star", "The Moon", "Ace of Cups"],
      advice: "Heal past wounds and prepare for new beginnings",
      color: "from-blue-400 to-purple-500",
    },
  ];

  const tarotSpreads2025 = [
    {
      name: "2025 Year Ahead Spread",
      description: "12-card spread revealing monthly themes and guidance",
      positions: 12,
      purpose: "Complete yearly overview with monthly insights",
      color: "from-purple-400 to-pink-500",
    },
    {
      name: "New Moon Manifestation",
      description: "5-card spread for each new moon to manifest desires",
      positions: 5,
      purpose: "Monthly goal setting and manifestation guidance",
      color: "from-blue-400 to-cyan-500",
    },
    {
      name: "Eclipse Transformation",
      description: "7-card spread for eclipse seasons and major changes",
      positions: 7,
      purpose: "Navigating transformative periods and shadow work",
      color: "from-orange-400 to-red-500",
    },
    {
      name: "Seasonal Wisdom Spread",
      description: "9-card spread for seasonal transitions and growth",
      positions: 9,
      purpose: "Quarterly guidance and seasonal alignment",
      color: "from-green-400 to-teal-500",
    },
  ];

  const psychicTrends2025 = [
    {
      title: "Heightened Intuition",
      description:
        "Universal energy amplifies psychic abilities and intuitive gifts",
      impact:
        "Trust your first instincts and pay attention to dreams and synchronicities",
      icon: Eye,
      color: "from-purple-400 to-pink-500",
    },
    {
      title: "Spiritual Awakening",
      description: "Mass spiritual awakening as humanity seeks deeper meaning",
      impact:
        "Explore spiritual practices, meditation, and connection with higher self",
      icon: Crown,
      color: "from-blue-400 to-purple-500",
    },
    {
      title: "Divination Renaissance",
      description: "Ancient divination practices gain mainstream acceptance",
      impact: "Learn tarot, astrology, and other divination tools for guidance",
      icon: Moon,
      color: "from-indigo-400 to-blue-500",
    },
  ];

  return (
    <>
      <AstroTickHeader />
      <main className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
        {/* Hero Section */}
        <section className="relative py-20 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600">
                2025
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-800">
                Tarot Predictions
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto">
                Unlock the mysteries of 2025 through ancient tarot wisdom.
                Seasonal spreads, major arcana guidance, and intuitive insights
                for your spiritual journey.
              </p>

              {/* Animated Tarot Cards */}
              <div className="flex justify-center space-x-4 mb-8">
                {[0, 1, 2].map((index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, rotateY: 180 }}
                    animate={{ opacity: 1, rotateY: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.2 }}
                    className="w-16 h-24 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg shadow-lg flex items-center justify-center text-white font-bold"
                  >
                    <Zap className="w-8 h-8" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* 2025 Psychic Trends */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4 text-gray-800">
                2025 Spiritual Trends
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Major spiritual and psychic trends shaping the year ahead
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {psychicTrends2025.map((trend, index) => (
                <motion.div
                  key={trend.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 border-2 hover:border-purple-300">
                    <CardHeader className="text-center">
                      <div
                        className={`w-16 h-16 rounded-full bg-gradient-to-br ${trend.color} flex items-center justify-center text-white mb-4 mx-auto`}
                      >
                        <trend.icon className="w-8 h-8" />
                      </div>
                      <CardTitle className="text-xl font-bold text-gray-800">
                        {trend.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                      <p className="text-sm text-gray-700">
                        {trend.description}
                      </p>
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-purple-800">
                          {trend.impact}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Major Arcana Guidance */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4 text-gray-800">
                Major Arcana Guidance for 2025
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Discover how the major arcana cards influence your journey in
                2025
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {majorArchanaCards.map((card, index) => (
                <motion.div
                  key={card.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 border-2 hover:border-purple-300 group">
                    <CardHeader className="text-center">
                      <div
                        className={`w-16 h-16 rounded-full bg-gradient-to-br ${card.color} flex items-center justify-center text-white text-2xl font-bold mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}
                      >
                        {card.number}
                      </div>
                      <CardTitle className="text-xl font-bold text-gray-800">
                        {card.name}
                      </CardTitle>
                      <p className="text-sm text-purple-600 font-semibold">
                        {card.theme}
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-gray-700 text-center italic">
                        {card.message}
                      </p>

                      <div className="flex flex-wrap gap-2 justify-center">
                        {card.keywords.map((keyword, i) => (
                          <span
                            key={i}
                            className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Seasonal Tarot Themes */}
        <section className="py-16 px-4 bg-gradient-to-r from-purple-100 via-pink-100 to-indigo-100">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4 text-gray-800">
                Seasonal Tarot Themes 2025
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Align with the natural cycles and seasonal energies throughout
                the year
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {seasonalTarotThemes.map((season, index) => (
                <motion.div
                  key={season.season}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 border-2 hover:border-purple-300 bg-white">
                    <CardHeader className="text-center">
                      <div
                        className={`w-16 h-16 rounded-full bg-gradient-to-br ${season.color} flex items-center justify-center text-white mb-4 mx-auto`}
                      >
                        <Sun className="w-8 h-8" />
                      </div>
                      <CardTitle className="text-xl font-bold text-gray-800">
                        {season.season}
                      </CardTitle>
                      <p className="text-sm text-purple-600 font-semibold">
                        {season.months}
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <h4 className="font-semibold text-gray-800">
                        {season.theme}
                      </h4>
                      <p className="text-sm text-gray-700">{season.focus}</p>

                      <div>
                        <h5 className="font-semibold text-purple-600 mb-2">
                          Key Cards:
                        </h5>
                        <div className="flex flex-wrap gap-1">
                          {season.cards.map((card, i) => (
                            <span
                              key={i}
                              className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs"
                            >
                              {card}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="bg-purple-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-purple-800">
                          {season.advice}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Tarot Spreads for 2025 */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4 text-gray-800">
                Special Tarot Spreads for 2025
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Unique spreads designed to harness 2025's transformative
                energies
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {tarotSpreads2025.map((spread, index) => (
                <motion.div
                  key={spread.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 border-2 hover:border-purple-300">
                    <CardHeader className="text-center">
                      <div
                        className={`w-16 h-16 rounded-full bg-gradient-to-br ${spread.color} flex items-center justify-center text-white text-xl font-bold mb-4 mx-auto`}
                      >
                        {spread.positions}
                      </div>
                      <CardTitle className="text-xl font-bold text-gray-800">
                        {spread.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-gray-700">
                        {spread.description}
                      </p>
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-purple-800">
                          {spread.purpose}
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
        <section className="py-16 px-4 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold mb-6 text-white">
                Ready to Unlock Your Tarot Wisdom for 2025?
              </h2>
              <p className="text-xl text-white mb-8 opacity-90">
                Get personalized tarot readings and discover the mystical
                guidance awaiting you
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/tarot">
                  <Button
                    size="lg"
                    className="bg-white text-purple-600 hover:bg-gray-100 font-bold px-8 py-4 text-lg"
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    Get Tarot Reading
                  </Button>
                </Link>
                <Link href="/astrologers">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text--purple-600 hover:bg-white hover:text-purple-600 font-bold px-8 py-4 text-lg"
                  >
                    Consult Tarot Expert
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
