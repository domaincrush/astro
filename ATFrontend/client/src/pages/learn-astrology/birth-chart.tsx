import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { Badge } from "src/components/ui/badge";
import { Button } from "src/components/ui/button";
import {
  Star,
  Map,
  Clock,
  Globe,
  Eye,
  TrendingUp,
  Heart,
  Shield,
  Crown,
  Calculator,
  Compass,
  Target,
  Play,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";
import { Link } from "wouter";

export default function BirthChartReading() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const chartComponents = [
    {
      icon: Star,
      title: "Ascendant (Lagna)",
      description:
        "Your rising sign that determines personality and physical appearance",
      importance: "Most Important",
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: Globe,
      title: "12 Houses",
      description:
        "Life areas: career, relationships, health, wealth, spirituality",
      importance: "Foundation",
      color: "from-blue-500 to-indigo-500",
    },
    {
      icon: Target,
      title: "Planetary Positions",
      description: "Where each planet was located at your birth time",
      importance: "Core Elements",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Compass,
      title: "Aspects & Yogas",
      description: "Planetary relationships and special combinations",
      importance: "Advanced",
      color: "from-green-500 to-teal-500",
    },
  ];

  const houseSystem = [
    {
      house: 1,
      name: "Tanu Bhava",
      theme: "Self & Personality",
      keywords: [
        "Physical body",
        "Appearance",
        "Temperament",
        "General health",
      ],
    },
    {
      house: 2,
      name: "Dhana Bhava",
      theme: "Wealth & Family",
      keywords: ["Money", "Speech", "Food", "Family values"],
    },
    {
      house: 3,
      name: "Sahaja Bhava",
      theme: "Courage & Siblings",
      keywords: ["Communication", "Short travels", "Siblings", "Efforts"],
    },
    {
      house: 4,
      name: "Sukha Bhava",
      theme: "Home & Mother",
      keywords: ["Property", "Education", "Mother", "Mental peace"],
    },
    {
      house: 5,
      name: "Putra Bhava",
      theme: "Children & Creativity",
      keywords: ["Children", "Intelligence", "Romance", "Speculation"],
    },
    {
      house: 6,
      name: "Ripu Bhava",
      theme: "Health & Enemies",
      keywords: ["Diseases", "Debts", "Enemies", "Service"],
    },
    {
      house: 7,
      name: "Kalatra Bhava",
      theme: "Marriage & Partnership",
      keywords: ["Spouse", "Business", "Partnerships", "Legal matters"],
    },
    {
      house: 8,
      name: "Ayu Bhava",
      theme: "Longevity & Mysteries",
      keywords: ["Longevity", "Transformation", "Occult", "Inheritance"],
    },
    {
      house: 9,
      name: "Dharma Bhava",
      theme: "Fortune & Dharma",
      keywords: ["Luck", "Higher learning", "Spirituality", "Father"],
    },
    {
      house: 10,
      name: "Karma Bhava",
      theme: "Career & Status",
      keywords: ["Profession", "Reputation", "Authority", "Public image"],
    },
    {
      house: 11,
      name: "Labha Bhava",
      theme: "Gains & Friends",
      keywords: ["Income", "Friends", "Desires", "Elder siblings"],
    },
    {
      house: 12,
      name: "Vyaya Bhava",
      theme: "Losses & Liberation",
      keywords: ["Expenses", "Foreign lands", "Spirituality", "Moksha"],
    },
  ];

  const readingSteps = [
    {
      step: 1,
      title: "Identify Your Ascendant",
      description: "Find your rising sign and understand its characteristics",
    },
    {
      step: 2,
      title: "Locate Key Planets",
      description:
        "Find Sun, Moon, and Jupiter positions for primary influences",
    },
    {
      step: 3,
      title: "Analyze House Placements",
      description: "See which planets occupy which houses",
    },
    {
      step: 4,
      title: "Check Planetary Aspects",
      description: "Understand how planets influence each other",
    },
    {
      step: 5,
      title: "Identify Yogas",
      description: "Look for special planetary combinations",
    },
    {
      step: 6,
      title: "Study Dasha Periods",
      description: "Understand timing of planetary influences",
    },
  ];

  const planetarySignificance = [
    {
      planet: "Sun",
      significance: "Soul, father, authority, health",
      house: "Natural 5th house ruler",
    },
    {
      planet: "Moon",
      significance: "Mind, mother, emotions, fluids",
      house: "Natural 4th house ruler",
    },
    {
      planet: "Mars",
      significance: "Energy, brother, property, courage",
      house: "Natural 1st & 8th house ruler",
    },
    {
      planet: "Mercury",
      significance: "Intelligence, communication, business",
      house: "Natural 3rd & 6th house ruler",
    },
    {
      planet: "Jupiter",
      significance: "Wisdom, children, spirituality, wealth",
      house: "Natural 9th & 12th house ruler",
    },
    {
      planet: "Venus",
      significance: "Love, beauty, luxury, spouse",
      house: "Natural 2nd & 7th house ruler",
    },
    {
      planet: "Saturn",
      significance: "Discipline, delays, karma, longevity",
      house: "Natural 10th & 11th house ruler",
    },
    {
      planet: "Rahu",
      significance: "Obsessions, foreign, technology, illusions",
      house: "Shadow planet",
    },
    {
      planet: "Ketu",
      significance: "Detachment, spirituality, past life",
      house: "Shadow planet",
    },
  ];

  return (
    <>
      <Helmet>
        <title>
          Birth Chart Reading - Master Vedic Kundli Analysis | AstroTick
        </title>
        <meta
          name="description"
          content="Learn to read and analyze your birth chart (kundli) like a professional astrologer. Understand houses, planetary positions, aspects, and yogas in Vedic astrology."
        />
        <meta
          name="keywords"
          content="birth chart reading, kundli analysis, Vedic astrology, horoscope reading, planetary positions, houses, aspects, yogas"
        />
        <meta
          property="og:title"
          content="Birth Chart Reading - Master Vedic Kundli Analysis"
        />
        <meta
          property="og:description"
          content="Learn to read and analyze your birth chart (kundli) like a professional astrologer. Understand houses, planetary positions, aspects, and yogas."
        />
        <meta property="og:type" content="article" />
        <link
          rel="canonical"
          href="https://astrotick.com/learn-astrology/birth-chart"
        />
      </Helmet>

      <AstroTickHeader />

      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-1000"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <Star className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center animate-pulse">
                    <Eye className="h-3 w-3 text-white" />
                  </div>
                </div>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
                Birth Chart{" "}
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  Reading
                </span>
              </h1>

              <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto animate-fade-in-delay">
                Master the art of reading your birth chart (kundli) and unlock
                the secrets of your cosmic blueprint through ancient Vedic
                wisdom.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/kundli">
                  <Button className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white px-8 py-3 text-lg flex items-center gap-2 animate-bounce-subtle">
                    <Star className="h-5 w-5" />
                    Generate Your Chart
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="border-white text-orange-600 hover:bg-white hover:text-blue-900 px-8 py-3 text-lg"
                >
                  <Play className="h-5 w-5 mr-2" />
                  Interactive Tutorial
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* What is a Birth Chart */}
          <div className="mb-20">
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <CardTitle className="text-3xl font-bold text-center">
                  What is a Birth Chart?
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div>
                    <p className="text-base md:text-lg text-gray-700 mb-6 leading-relaxed">
                      A birth chart, also called a kundli or horoscope, is a
                      celestial snapshot of the sky at the exact moment and
                      location of your birth. It shows the positions of planets,
                      stars, and other celestial bodies as they appeared from
                      Earth at that specific time.
                    </p>
                    <p className="text-base md:text-lg text-gray-700 mb-6 leading-relaxed">
                      Think of it as your cosmic DNA - a unique blueprint that
                      reveals your personality, strengths, challenges,
                      relationships, career path, and life purpose. No two
                      people have identical birth charts, making each person's
                      astrological profile completely unique.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-gray-700">
                          Requires exact birth time and location
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-gray-700">
                          Shows planetary positions in 12 houses
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-gray-700">
                          Reveals personality and life path
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="w-full h-80 bg-gradient-to-br from-orange-100 to-amber-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                      {/* Animated Chart Visualization */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-60 h-60 relative">
                          {/* Outer ring */}
                          <div className="absolute inset-0 border-4 border-blue-300 rounded-full animate-spin-slow"></div>
                          {/* House divisions */}
                          <div className="absolute inset-4 border-2 border-purple-300 rounded-full"></div>
                          {/* Center */}
                          <div className="absolute inset-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                            <Map className="h-8 w-8 text-white" />
                          </div>
                          {/* Planetary positions */}
                          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-yellow-500 rounded-full animate-pulse"></div>
                          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-6 h-6 bg-blue-500 rounded-full animate-pulse animation-delay-1000"></div>
                          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-red-500 rounded-full animate-pulse animation-delay-2000"></div>
                          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 w-6 h-6 bg-green-500 rounded-full animate-pulse animation-delay-3000"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chart Components */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Essential Chart Components
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Understanding these key elements is crucial for accurate chart
                interpretation
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {chartComponents.map((component, index) => (
                <Card
                  key={index}
                  className="bg-white/80 backdrop-blur-sm shadow-xl border-0 overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                >
                  <CardHeader
                    className={`bg-gradient-to-r ${component.color} text-white`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <component.icon className="h-8 w-8" />
                        <CardTitle className="text-xl">
                          {component.title}
                        </CardTitle>
                      </div>
                      <Badge className="bg-white/20 text-white border-white/30">
                        {component.importance}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-gray-700 text-lg">
                      {component.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* 12 Houses System */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                The 12 Houses System
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Each house represents different aspects of life and human
                experience
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-6">
              {houseSystem.map((house, index) => (
                <Card
                  key={index}
                  className="bg-white/80 backdrop-blur-sm shadow-lg border-0 overflow-hidden group hover:shadow-xl transition-all duration-300"
                >
                  <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        House {house.house}
                      </CardTitle>
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold">{house.house}</span>
                      </div>
                    </div>
                    <div className="text-sm opacity-90">{house.name}</div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {house.theme}
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {house.keywords.map((keyword, keyIndex) => (
                        <Badge
                          key={keyIndex}
                          variant="secondary"
                          className="text-xs"
                        >
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Planetary Significance */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Planetary Significance
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Each planet represents different aspects of life and personality
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {planetarySignificance.map((planet, index) => (
                <Card
                  key={index}
                  className="bg-white/80 backdrop-blur-sm shadow-lg border-0 overflow-hidden group hover:shadow-xl transition-all duration-300"
                >
                  <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white pb-3">
                    <CardTitle className="text-lg">{planet.planet}</CardTitle>
                    <div className="text-sm opacity-90">{planet.house}</div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <p className="text-gray-700 text-sm">
                      {planet.significance}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Reading Steps */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                How to Read Your Chart
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Follow these steps to analyze your birth chart systematically
              </p>
            </div>

            <div className="space-y-6">
              {readingSteps.map((step, index) => (
                <Card
                  key={index}
                  className="bg-white/80 backdrop-blur-sm shadow-xl border-0 overflow-hidden group hover:shadow-2xl transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform">
                        {step.step}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {step.title}
                        </h3>
                        <p className="text-gray-700">{step.description}</p>
                      </div>
                      <ArrowRight className="h-6 w-6 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Interactive Tools */}
          <div className="mb-20">
            <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl border-0">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4">
                    Start Reading Your Chart
                  </h2>
                  <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                    Use our advanced tools to generate and analyze your birth
                    chart
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Link href="/kundli">
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all cursor-pointer group">
                      <CardContent className="p-8 text-center">
                        <Star className="h-16 w-16 text-yellow-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                        <h3 className="text-2xl font-bold mb-4">
                          Generate Birth Chart
                        </h3>
                        <p className="text-blue-100 mb-6">
                          Create your personalized Vedic birth chart with
                          detailed planetary positions and house placements
                        </p>
                        <Button className="bg-yellow-500 hover:bg-yellow-600 text-white">
                          Create Chart Now
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>

                  <Link href="/premium-report">
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all cursor-pointer group">
                      <CardContent className="p-8 text-center">
                        <Crown className="h-16 w-16 text-purple-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                        <h3 className="text-2xl font-bold mb-4">
                          Premium Analysis
                        </h3>
                        <p className="text-blue-100 mb-6">
                          Get detailed chart interpretation with predictions,
                          remedies, and personalized guidance
                        </p>
                        <Button className="bg-purple-500 hover:bg-purple-600 text-white">
                          Get Analysis
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
