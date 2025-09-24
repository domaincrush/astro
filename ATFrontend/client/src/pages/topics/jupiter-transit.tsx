import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from 'src/components/ui/card';
import { Badge } from 'src/components/ui/badge';
import { Button } from 'src/components/ui/button';
import { Star, TrendingUp, Calendar, Shield, Crown, Gift, Sparkles, Globe } from 'lucide-react';
import AstroTickHeader from 'src/components/layout/AstroTickHeader';
import Footer from 'src/components/layout/Footer';
import { Link } from 'wouter';

const JupiterTransit = () => {
  const transitFeatures = [
    {
      icon: Crown,
      title: "Guru Gochara Effects",
      description: "Understand how Jupiter's movement through zodiac signs affects your prosperity and wisdom",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: TrendingUp,
      title: "Career & Finance Growth",
      description: "Discover favorable periods for career advancement, business expansion, and financial gains",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Star,
      title: "Spiritual Development",
      description: "Enhance your spiritual journey, knowledge acquisition, and philosophical understanding",
      color: "from-blue-500 to-indigo-500"
    },
    {
      icon: Shield,
      title: "Protection & Blessings",
      description: "Receive divine protection and blessings through Jupiter's benevolent influence",
      color: "from-purple-500 to-pink-500"
    }
  ];

  const currentTransit = {
    sign: "Gemini",
    duration: "May 2025 - May 2026",
    status: "Current Active Transit",
    effects: "Focus on communication, learning, travel, and intellectual pursuits. This is an excellent time for education, writing, media ventures, and expanding social networks.",
    favorable: ["Communication & Media", "Education & Learning", "Writing & Publishing", "Technology", "Short Distance Travel", "Networking"],
    challenging: ["Information Overload", "Scattered Energy", "Superficial Learning", "Restlessness"]
  };

  const jupiterInGeminiEffects = [
    {
      lagna: "Aries",
      jupiterLordship: "9th & 12th Lord",
      transitHouse: "3rd House",
      effects: "Enhanced communication skills, courage, and short-distance travels. Spiritual growth through learning and teaching. Excellent for writing, media, and sibling relationships.",
      positiveResults: ["Communication skills", "Courage & initiative", "Short travels", "Sibling bonds", "Learning & teaching"],
      challenges: ["Spiritual confusion", "Over-expenses on travel", "Conflicts with siblings"],
      recommendations: "Focus on learning new skills, writing, and building communication networks"
    },
    {
      lagna: "Taurus",
      jupiterLordship: "8th & 11th Lord",
      transitHouse: "2nd House",
      effects: "Financial gains, family harmony, and speech improvements. Benefits from research, occult sciences, and transformation. Gains through elder siblings and networks.",
      positiveResults: ["Financial growth", "Family harmony", "Speech power", "Research abilities", "Network gains"],
      challenges: ["Hidden enemies", "Family disputes", "Occult interests"],
      recommendations: "Focus on family investments, speech training, and building financial security"
    },
    {
      lagna: "Gemini",
      jupiterLordship: "7th & 10th Lord",
      transitHouse: "1st House",
      effects: "Enhanced personality, leadership qualities, and career growth. Excellent for partnerships, marriage, and business ventures. Strong presence and authority.",
      positiveResults: ["Leadership qualities", "Career advancement", "Marriage prospects", "Business success", "Personality enhancement"],
      challenges: ["Ego issues", "Partnership conflicts", "Work pressure"],
      recommendations: "Focus on career development, partnership building, and personal growth"
    },
    {
      lagna: "Cancer",
      jupiterLordship: "6th & 9th Lord",
      transitHouse: "12th House",
      effects: "Spiritual awakening, foreign connections, and service to others. Victory over enemies but expenses on spiritual pursuits. Good for meditation and charitable work.",
      positiveResults: ["Spiritual growth", "Foreign connections", "Victory over enemies", "Charitable work", "Meditation"],
      challenges: ["Increased expenses", "Health issues", "Isolation"],
      recommendations: "Focus on spiritual practices, foreign business, and charitable activities"
    },
    {
      lagna: "Leo",
      jupiterLordship: "5th & 8th Lord",
      transitHouse: "11th House",
      effects: "Gains from children, creativity, and speculation. Research and transformation bring profits. Elder siblings and social circles expand. Excellent for investments.",
      positiveResults: ["Gains from children", "Creative profits", "Investment gains", "Social expansion", "Research success"],
      challenges: ["Speculative losses", "Transformation stress", "Children's health"],
      recommendations: "Focus on creative ventures, strategic investments, and building social networks"
    },
    {
      lagna: "Virgo",
      jupiterLordship: "4th & 7th Lord",
      transitHouse: "10th House",
      effects: "Career growth, property gains, and partnership success. Excellent for business expansion, real estate, and marriage. Strong reputation and government favors.",
      positiveResults: ["Career advancement", "Property gains", "Business success", "Marriage prospects", "Government favor"],
      challenges: ["Work-life balance", "Property disputes", "Partnership stress"],
      recommendations: "Focus on career development, property investments, and partnership building"
    },
    {
      lagna: "Libra",
      jupiterLordship: "3rd & 6th Lord",
      transitHouse: "9th House",
      effects: "Enhanced fortune, higher education, and spiritual growth. Victory over enemies through knowledge. Excellent for teaching, publishing, and long-distance travel.",
      positiveResults: ["Higher education", "Spiritual growth", "Teaching success", "Publishing gains", "Long travels"],
      challenges: ["Over-confidence", "Legal issues", "Guru conflicts"],
      recommendations: "Focus on higher learning, spiritual practices, and knowledge sharing"
    },
    {
      lagna: "Scorpio",
      jupiterLordship: "2nd & 5th Lord",
      transitHouse: "8th House",
      effects: "Transformation, research abilities, and occult knowledge. Family wealth through investments. Children's education and creativity flourish. Interest in mystical sciences.",
      positiveResults: ["Research abilities", "Occult knowledge", "Investment gains", "Children's success", "Mystical interests"],
      challenges: ["Family disputes", "Health issues", "Sudden changes"],
      recommendations: "Focus on research, occult studies, and children's education"
    },
    {
      lagna: "Sagittarius",
      jupiterLordship: "1st & 4th Lord",
      transitHouse: "7th House",
      effects: "Enhanced personality and partnerships. Property gains and home improvements. Excellent for marriage, business ventures, and public relations. Strong presence in partnerships.",
      positiveResults: ["Marriage prospects", "Business partnerships", "Property gains", "Home improvements", "Public relations"],
      challenges: ["Partnership conflicts", "Property disputes", "Ego clashes"],
      recommendations: "Focus on partnership building, property investments, and personal development"
    },
    {
      lagna: "Capricorn",
      jupiterLordship: "3rd & 12th Lord",
      transitHouse: "6th House",
      effects: "Victory over enemies, health improvements, and service opportunities. Communication skills help overcome obstacles. Spiritual expenses bring growth.",
      positiveResults: ["Victory over enemies", "Health improvements", "Service opportunities", "Communication skills", "Obstacle removal"],
      challenges: ["Workplace conflicts", "Health issues", "Spiritual confusion"],
      recommendations: "Focus on health management, service activities, and skill development"
    },
    {
      lagna: "Aquarius",
      jupiterLordship: "2nd & 11th Lord",
      transitHouse: "5th House",
      effects: "Children's prosperity, creative gains, and investment profits. Family wealth increases through speculation. Excellent for artistic pursuits and romantic relationships.",
      positiveResults: ["Children's success", "Creative profits", "Investment gains", "Family wealth", "Romantic relationships"],
      challenges: ["Speculative losses", "Children's health", "Over-indulgence"],
      recommendations: "Focus on creative investments, children's education, and artistic pursuits"
    },
    {
      lagna: "Pisces",
      jupiterLordship: "1st & 10th Lord",
      transitHouse: "4th House",
      effects: "Enhanced personality and career through family support. Property gains, home improvements, and emotional stability. Mother's health and happiness improve.",
      positiveResults: ["Career growth", "Property gains", "Family support", "Emotional stability", "Mother's health"],
      challenges: ["Family pressure", "Property disputes", "Emotional stress"],
      recommendations: "Focus on family business, property investments, and emotional well-being"
    }
  ];

  const remedies = [
    "Chant Guru Mantra 108 times daily",
    "Wear Yellow Sapphire (Pukhraj) after consultation",
    "Donate yellow items on Thursdays",
    "Visit Vishnu and Shiva temples",
    "Read sacred texts like Bhagavad Gita",
    "Feed Brahmins and teachers",
    "Plant banana trees",
    "Offer water to Peepal tree",
    "Practice meditation and yoga",
    "Seek blessings from elders and gurus"
  ];

  const beneficHouses = [
    { house: "1st House", effects: "Personality enhancement, leadership qualities, good health" },
    { house: "4th House", effects: "Property gains, family happiness, emotional stability" },
    { house: "5th House", effects: "Children, creativity, speculation gains, romance" },
    { house: "7th House", effects: "Marriage, partnerships, business success, travel" },
    { house: "9th House", effects: "Luck, higher education, spirituality, long journeys" },
    { house: "10th House", effects: "Career growth, reputation, government favors" },
    { house: "11th House", effects: "Income increase, wish fulfillment, social circle expansion" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
      <AstroTickHeader />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-40 h-40 bg-yellow-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-60 h-60 bg-orange-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white px-6 py-3 text-lg font-semibold mb-8">
                <Crown className="mr-2 h-5 w-5" />
                Guru Gochara Analysis
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
                Jupiter Transit
              </h1>
              
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
                Discover how Jupiter's transit through different zodiac signs brings prosperity, wisdom, and spiritual growth. 
                Understand the timing for major life decisions and harness the benevolent energy of the great benefic.
              </p>
              
              <div className="bg-gradient-to-r from-blue-100 to-cyan-100 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto mb-8">
                <div className="flex items-center justify-center mb-2">
                  <Sparkles className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-blue-800 font-semibold">Currently Active</span>
                </div>
                <p className="text-blue-700 text-lg font-medium">
                  Jupiter in Gemini (May 2025 - May 2026)
                </p>
                <p className="text-blue-600 text-sm mt-1">
                  Excellent time for communication, learning, writing, and expanding knowledge
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Jupiter Transit Benefits
            </h2>
            <p className="text-xl text-gray-600">
              Understanding the benevolent influence of Jupiter's movement
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {transitFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center text-white mb-4`}>
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Current Transit Section */}
      <section className="py-16 bg-gradient-to-r from-yellow-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 text-sm font-semibold mb-4">
              <Sparkles className="mr-2 h-4 w-4" />
              ACTIVE NOW
            </Badge>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Jupiter in Gemini Transit
            </h2>
            <p className="text-xl text-gray-600">
              May 2025 - May 2026 • Current Active Period
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-2xl text-center text-yellow-700">
                  Jupiter in {currentTransit.sign}
                </CardTitle>
                <p className="text-center text-gray-600">{currentTransit.duration}</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">General Effects</h4>
                    <p className="text-gray-600">{currentTransit.effects}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Favorable For</h4>
                    <ul className="space-y-1">
                      {currentTransit.favorable.map((item, index) => (
                        <li key={index} className="text-green-600 text-sm">• {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Challenges</h4>
                    <ul className="space-y-1">
                      {currentTransit.challenging.map((item, index) => (
                        <li key={index} className="text-red-600 text-sm">• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Jupiter in Gemini Effects by Lagna */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Jupiter in Gemini Transit Effects by Lagna
            </h2>
            <p className="text-xl text-gray-600">
              Personalized effects based on your ascendant sign (lagna)
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jupiterInGeminiEffects.map((lagna, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="text-lg text-blue-700">{lagna.lagna} Lagna</CardTitle>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm text-gray-600">Jupiter: {lagna.jupiterLordship}</p>
                      <p className="text-sm text-blue-600">Transit: {lagna.transitHouse}</p>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Badge variant="outline" className="mb-2">Effects</Badge>
                        <p className="text-sm text-gray-600">{lagna.effects}</p>
                      </div>
                      <div>
                        <Badge variant="outline" className="mb-2 bg-green-50 text-green-700">Positive Results</Badge>
                        <ul className="text-xs text-green-600 space-y-1">
                          {lagna.positiveResults.map((result, idx) => (
                            <li key={idx}>• {result}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <Badge variant="outline" className="mb-2 bg-red-50 text-red-700">Challenges</Badge>
                        <ul className="text-xs text-red-600 space-y-1">
                          {lagna.challenges.map((challenge, idx) => (
                            <li key={idx}>• {challenge}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <Badge variant="outline" className="mb-2 bg-blue-50 text-blue-700">Recommendations</Badge>
                        <p className="text-xs text-blue-600">{lagna.recommendations}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Know Your Lagna Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-cyan-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Don't Know Your Lagna?
            </h2>
            <p className="text-xl text-gray-600">
              Generate your birth chart to discover your ascendant sign and get personalized predictions
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Generate Your Birth Chart
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Your lagna (ascendant) is the zodiac sign rising on the eastern horizon at your birth time. 
                      It's the key to understanding how Jupiter's transit affects you personally.
                    </p>
                    <ul className="space-y-2 text-sm text-gray-600 mb-6">
                      <li className="flex items-center">
                        <Calendar className="h-4 w-4 text-blue-600 mr-2" />
                        Accurate birth date and time required
                      </li>
                      <li className="flex items-center">
                        <Globe className="h-4 w-4 text-blue-600 mr-2" />
                        Birth location (city) needed
                      </li>
                      <li className="flex items-center">
                        <Star className="h-4 w-4 text-blue-600 mr-2" />
                        Instant lagna calculation
                      </li>
                    </ul>
                    <Link href="/kundli">
                      <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-3 text-lg">
                        <Star className="mr-2 h-5 w-5" />
                        Generate Birth Chart
                      </Button>
                    </Link>
                  </div>
                  <div>
                    <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-800 mb-3">Example: Aries Lagna</h4>
                      <div className="space-y-2 text-sm">
                        <p><strong>Jupiter Lordship:</strong> 9th & 12th Lord</p>
                        <p><strong>Transit House:</strong> 3rd House (Communication)</p>
                        <p><strong>Key Effects:</strong> Enhanced communication, learning opportunities, spiritual growth</p>
                        <p><strong>Best For:</strong> Writing, teaching, short travels, skill development</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefic Houses Section */}
      <section className="py-16 bg-gradient-to-r from-yellow-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Benefic House Transits
            </h2>
            <p className="text-xl text-gray-600">
              Most favorable house positions for Jupiter transit
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {beneficHouses.map((house, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-4 hover:shadow-lg transition-shadow duration-300">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-white mx-auto mb-3">
                      <Crown className="h-6 w-6" />
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-2">{house.house}</h4>
                    <p className="text-sm text-gray-600">{house.effects}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Remedies Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Jupiter Transit Remedies
            </h2>
            <p className="text-xl text-gray-600">
              Enhance Jupiter's positive effects through traditional remedies
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {remedies.map((remedy, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-4 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-white mr-3">
                      <Gift className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{remedy}</span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-yellow-600 to-orange-600 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Maximize Jupiter's Blessings
          </h2>
          <div className="max-w-4xl mx-auto mb-8">
            <p className="text-xl mb-6">
              Jupiter transit is one of the most significant astrological events that can transform your life for 12 months. 
              As the planet of wisdom, prosperity, and divine blessings, Jupiter's movement through different houses brings unique opportunities and challenges.
            </p>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-left">
              <h3 className="text-lg font-semibold mb-4 text-center">Why Jupiter Transit Analysis is Crucial:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="mb-2">• <strong>Timing Major Decisions:</strong> Know when to start new ventures, investments, or marriages</p>
                  <p className="mb-2">• <strong>Career Growth:</strong> Identify periods of promotion, job changes, and business expansion</p>
                  <p className="mb-2">• <strong>Financial Prosperity:</strong> Understand when wealth and abundance flows into your life</p>
                </div>
                <div>
                  <p className="mb-2">• <strong>Spiritual Evolution:</strong> Recognize phases of wisdom, learning, and spiritual growth</p>
                  <p className="mb-2">• <strong>Relationship Harmony:</strong> Discover favorable periods for marriage and partnerships</p>
                  <p className="mb-2">• <strong>Health & Well-being:</strong> Understand Jupiter's protective influence on your vitality</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/premium-report">
              <Button className="bg-white text-yellow-600 px-8 py-3 text-lg">
                <Globe className="mr-2 h-5 w-5" />
                Check Premium Report to Know Your Transit
              </Button>
            </Link>
            <Link href="/astrologers">
              <Button variant="outline" className="border-white text-white px-8 py-3 text-lg">
                <Sparkles className="mr-2 h-5 w-5" />
                Consult Expert
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default JupiterTransit;