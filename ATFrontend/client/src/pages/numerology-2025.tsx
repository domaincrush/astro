import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  Calculator,
  Star,
  TrendingUp,
  Heart,
  Shield,
  Crown,
} from "lucide-react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { Button } from "src/components/ui/button";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";

export default function Numerology2025() {
  const lifePathNumbers = [
    {
      number: 1,
      theme: "Leadership & Innovation",
      color: "from-red-400 to-orange-500",
      traits: ["Independent", "Ambitious", "Creative"],
      prediction:
        "2025 brings new leadership opportunities and innovative projects. Your pioneering spirit will be recognized.",
      luckyMonths: ["January", "March", "October"],
      challenges: [
        "Avoid being too dominating",
        "Balance work and personal life",
      ],
    },
    {
      number: 2,
      theme: "Cooperation & Harmony",
      color: "from-blue-400 to-cyan-500",
      traits: ["Diplomatic", "Sensitive", "Cooperative"],
      prediction:
        "Focus on partnerships and collaborations. Your diplomatic skills will help resolve conflicts.",
      luckyMonths: ["February", "June", "November"],
      challenges: ["Don't be overly dependent", "Trust your intuition"],
    },
    {
      number: 3,
      theme: "Creativity & Communication",
      color: "from-yellow-400 to-orange-500",
      traits: ["Artistic", "Expressive", "Optimistic"],
      prediction:
        "Creative projects flourish this year. Your communication skills open new doors.",
      luckyMonths: ["March", "July", "December"],
      challenges: ["Avoid scattering energy", "Focus on completion"],
    },
    {
      number: 4,
      theme: "Stability & Hard Work",
      color: "from-green-400 to-teal-500",
      traits: ["Practical", "Reliable", "Organized"],
      prediction:
        "Steady progress through consistent effort. Building solid foundations for future success.",
      luckyMonths: ["April", "August", "January"],
      challenges: ["Don't be too rigid", "Embrace necessary changes"],
    },
    {
      number: 5,
      theme: "Freedom & Adventure",
      color: "from-purple-400 to-pink-500",
      traits: ["Adventurous", "Versatile", "Curious"],
      prediction:
        "Travel and new experiences await. Your adaptability leads to exciting opportunities.",
      luckyMonths: ["May", "September", "February"],
      challenges: ["Avoid restlessness", "Complete what you start"],
    },
    {
      number: 6,
      theme: "Nurturing & Responsibility",
      color: "from-pink-400 to-red-500",
      traits: ["Caring", "Responsible", "Protective"],
      prediction:
        "Family and home take priority. Your nurturing nature brings harmony to relationships.",
      luckyMonths: ["June", "October", "March"],
      challenges: ["Don't sacrifice yourself", "Set healthy boundaries"],
    },
    {
      number: 7,
      theme: "Spiritual & Analytical",
      color: "from-indigo-400 to-purple-500",
      traits: ["Spiritual", "Analytical", "Introspective"],
      prediction:
        "Deep spiritual insights and research bring wisdom. Trust your inner guidance.",
      luckyMonths: ["July", "November", "April"],
      challenges: ["Avoid isolation", "Share your wisdom"],
    },
    {
      number: 8,
      theme: "Material Success & Power",
      color: "from-gray-400 to-blue-500",
      traits: ["Ambitious", "Practical", "Authoritative"],
      prediction:
        "Business and financial success peak this year. Your leadership skills are in demand.",
      luckyMonths: ["August", "December", "May"],
      challenges: ["Don't neglect relationships", "Use power wisely"],
    },
    {
      number: 9,
      theme: "Universal Love & Wisdom",
      color: "from-orange-400 to-red-500",
      traits: ["Compassionate", "Wise", "Generous"],
      prediction:
        "Humanitarian efforts and teaching opportunities arise. Your wisdom helps others.",
      luckyMonths: ["September", "January", "June"],
      challenges: ["Avoid martyrdom", "Focus on self-care"],
    },
  ];

  const personalYearNumbers = [
    {
      year: 1,
      theme: "New Beginnings",
      focus: "Start new projects and ventures",
    },
    {
      year: 2,
      theme: "Cooperation",
      focus: "Build relationships and partnerships",
    },
    { year: 3, theme: "Creativity", focus: "Express yourself and communicate" },
    { year: 4, theme: "Foundation", focus: "Build stability and work hard" },
    { year: 5, theme: "Change", focus: "Embrace freedom and adventure" },
    { year: 6, theme: "Responsibility", focus: "Focus on family and home" },
    { year: 7, theme: "Reflection", focus: "Seek wisdom and spiritual growth" },
    { year: 8, theme: "Achievement", focus: "Pursue material success" },
    { year: 9, theme: "Completion", focus: "Complete cycles and serve others" },
  ];

  const numerologyTrends2025 = [
    {
      title: "Universal Year 9 Energy",
      description:
        "2025 is a Universal Year 9 (2+0+2+5=9), bringing completion, wisdom, and humanitarian focus.",
      impact:
        "Global focus on healing, completion of cycles, and serving humanity",
      color: "from-orange-400 to-red-500",
    },
    {
      title: "Master Number 11 Influence",
      description:
        "Strong 11 energy throughout 2025 enhances intuition and spiritual awakening.",
      impact:
        "Increased psychic abilities, spiritual insights, and inspirational leadership",
      color: "from-purple-400 to-pink-500",
    },
    {
      title: "Completion & New Cycles",
      description:
        "9-year cycles ending, preparing for new beginnings in 2026 (Year 1).",
      impact:
        "Release old patterns, complete projects, and prepare for fresh starts",
      color: "from-blue-400 to-cyan-500",
    },
  ];

  return (
    <>
      <Helmet>
        <title>
          Free Numerology 2025 Predictions | Life Path & Personal Year
          Calculator - AstroTick
        </title>
        <meta
          name="description"
          content="Free Numerology 2025 Predictions - Discover the mystical power of numbers with personal year predictions, life path insights, and numerological guidance for success."
        />
        <meta
          name="keywords"
          content="free numerology 2025, numerology predictions, life path number, personal year calculator, free numerology reading, numerology forecast"
        />
        <link rel="canonical" href="https://astrotick.com/numerology-2025" />

        {/* Open Graph */}
        <meta
          property="og:title"
          content="Free Numerology 2025 Predictions - AstroTick"
        />
        <meta
          property="og:description"
          content="Free Numerology 2025 Predictions - Discover the mystical power of numbers with personal year predictions and life path insights."
        />
        <meta
          property="og:url"
          content="https://astrotick.com/numerology-2025"
        />
        <meta property="og:type" content="website" />

        {/* Twitter */}
        <meta
          name="twitter:title"
          content="Free Numerology 2025 Predictions - AstroTick"
        />
        <meta
          name="twitter:description"
          content="Free Numerology 2025 Predictions - Discover the mystical power of numbers with personal year predictions."
        />

        {/* Schema.org structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Free Numerology 2025 Predictions",
            description:
              "Personal year predictions, life path insights, and numerological guidance for 2025",
            url: "https://astrotick.com/numerology-2025",
            applicationCategory: "LifestyleApplication",
            operatingSystem: "Web Browser",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
          })}
        </script>
      </Helmet>

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
                Free Numerology Predictions
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto">
                Discover the mystical power of numbers in 2025. Personal year
                predictions, life path insights, and numerological guidance for
                success and fulfillment.
              </p>

              {/* Animated Numbers */}
              <div className="flex justify-center space-x-4 mb-8">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num, index) => (
                  <motion.div
                    key={num}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold text-lg"
                  >
                    {num}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* 2025 Numerology Trends */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4 text-gray-800">
                2025 Numerology Trends
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Understanding the universal energies shaping 2025
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {numerologyTrends2025.map((trend, index) => (
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
                        <Calculator className="w-8 h-8" />
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

        {/* Life Path Numbers */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4 text-gray-800">
                Life Path Number Predictions 2025
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Find your life path number and discover what 2025 holds for you
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {lifePathNumbers.map((path, index) => (
                <motion.div
                  key={path.number}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 border-2 hover:border-purple-300">
                    <CardHeader className="text-center">
                      <div
                        className={`w-16 h-16 rounded-full bg-gradient-to-br ${path.color} flex items-center justify-center text-white text-3xl font-bold mb-4 mx-auto`}
                      >
                        {path.number}
                      </div>
                      <CardTitle className="text-xl font-bold text-gray-800">
                        Life Path {path.number}
                      </CardTitle>
                      <p className="text-sm text-purple-600 font-semibold">
                        {path.theme}
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-wrap gap-2 justify-center">
                        {path.traits.map((trait, i) => (
                          <span
                            key={i}
                            className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                          >
                            {trait}
                          </span>
                        ))}
                      </div>

                      <p className="text-sm text-gray-700 text-center italic">
                        {path.prediction}
                      </p>

                      <div>
                        <h4 className="font-semibold text-green-600 mb-2 text-center">
                          🌟 Lucky Months
                        </h4>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {path.luckyMonths.map((month, i) => (
                            <span
                              key={i}
                              className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs"
                            >
                              {month}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-orange-600 mb-2 text-center">
                          ⚠️ Challenges
                        </h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {path.challenges.map((challenge, i) => (
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

        {/* Personal Year Numbers */}
        <section className="py-16 px-4 bg-gradient-to-r from-purple-100 via-pink-100 to-orange-100">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4 text-gray-800">
                Personal Year Numbers 2025
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Calculate your personal year number and discover your theme for
                2025
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {personalYearNumbers.map((year, index) => (
                <motion.div
                  key={year.year}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 bg-white border-2 hover:border-purple-300">
                    <CardHeader className="text-center">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-2xl font-bold mb-4 mx-auto">
                        {year.year}
                      </div>
                      <CardTitle className="text-xl font-bold text-gray-800">
                        Year {year.year}
                      </CardTitle>
                      <p className="text-sm text-purple-600 font-semibold">
                        {year.theme}
                      </p>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-sm text-gray-700">{year.focus}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Calculator Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4 text-gray-800">
                Calculate Your Numbers
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Use our numerology calculator to discover your personal numbers
              </p>
            </motion.div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-4 text-gray-800">
                  How to Calculate Your Life Path Number
                </h3>
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <p className="text-lg text-gray-700 mb-4">
                    Add all digits of your birth date until you get a single
                    digit.
                  </p>
                  <div className="bg-purple-100 p-4 rounded-lg">
                    <p className="font-semibold text-purple-800">
                      Example: Born on July 15, 1990
                    </p>
                    <p className="text-purple-700">
                      7 + 1 + 5 + 1 + 9 + 9 + 0 = 32
                    </p>
                    <p className="text-purple-700">3 + 2 = 5</p>
                    <p className="font-semibold text-purple-800">
                      Life Path Number = 5
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <Link href="/numerology">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold px-8 py-4 text-lg"
                  >
                    <Calculator className="w-5 h-5 mr-2" />
                    Calculate My Numbers
                  </Button>
                </Link>
              </div>
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
                Unlock Your Numerological Destiny in 2025
              </h2>
              <p className="text-xl text-white mb-8 opacity-90">
                Get personalized numerology readings and discover the power of
                numbers in your life
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/numerology">
                  <Button
                    size="lg"
                    className="bg-white text-purple-600 hover:bg-gray-100 font-bold px-8 py-4 text-lg"
                  >
                    <Star className="w-5 h-5 mr-2" />
                    Get Numerology Reading
                  </Button>
                </Link>
                <Link href="/astrologers">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-purple-600 hover:bg-white hover:text-purple-600 font-bold px-8 py-4 text-lg"
                  >
                    Consult Numerologist
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
