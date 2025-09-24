import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { Badge } from "src/components/ui/badge";
import { Button } from "src/components/ui/button";
import {
  Clock,
  Calendar,
  TrendingUp,
  Users,
  Heart,
  Briefcase,
  Home,
  Star,
  ArrowRight,
  ChevronRight,
  Play,
  BookOpen,
} from "lucide-react";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";
import { Link } from "wouter";

export default function DashaPeriodsGuide() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const dashaSystemTypes = [
    {
      name: "Vimshottari Dasha",
      description:
        "Most popular 120-year cycle system based on Moon's nakshatra",
      duration: "120 years",
      planets: [
        "Sun",
        "Moon",
        "Mars",
        "Mercury",
        "Jupiter",
        "Venus",
        "Saturn",
        "Rahu",
        "Ketu",
      ],
      accuracy: "98%",
      color: "from-purple-500 to-indigo-500",
    },
    {
      name: "Ashtottari Dasha",
      description: "108-year cycle system for specific birth conditions",
      duration: "108 years",
      planets: [
        "Sun",
        "Moon",
        "Mars",
        "Mercury",
        "Jupiter",
        "Venus",
        "Saturn",
        "Rahu",
      ],
      accuracy: "92%",
      color: "from-blue-500 to-cyan-500",
    },
    {
      name: "Yogini Dasha",
      description: "36-year cycle based on weekday of birth",
      duration: "36 years",
      planets: [
        "Moon",
        "Sun",
        "Jupiter",
        "Mars",
        "Mercury",
        "Saturn",
        "Venus",
        "Rahu",
      ],
      accuracy: "85%",
      color: "from-green-500 to-emerald-500",
    },
  ];

  const vimshottariPeriods = [
    {
      planet: "Sun",
      years: 6,
      color: "from-yellow-400 to-orange-500",
      effects: ["Authority", "Leadership", "Government", "Fame"],
    },
    {
      planet: "Moon",
      years: 10,
      color: "from-blue-400 to-cyan-500",
      effects: ["Emotions", "Travel", "Water", "Public"],
    },
    {
      planet: "Mars",
      years: 7,
      color: "from-red-400 to-red-600",
      effects: ["Energy", "Courage", "Property", "Siblings"],
    },
    {
      planet: "Mercury",
      years: 17,
      color: "from-green-400 to-green-600",
      effects: ["Communication", "Business", "Learning", "Travel"],
    },
    {
      planet: "Jupiter",
      years: 16,
      color: "from-yellow-500 to-yellow-700",
      effects: ["Wisdom", "Spirituality", "Children", "Wealth"],
    },
    {
      planet: "Venus",
      years: 20,
      color: "from-pink-400 to-pink-600",
      effects: ["Love", "Luxury", "Arts", "Marriage"],
    },
    {
      planet: "Saturn",
      years: 19,
      color: "from-gray-600 to-gray-800",
      effects: ["Discipline", "Karma", "Delays", "Maturity"],
    },
    {
      planet: "Rahu",
      years: 18,
      color: "from-purple-600 to-purple-800",
      effects: ["Illusion", "Foreign", "Technology", "Sudden Events"],
    },
    {
      planet: "Ketu",
      years: 7,
      color: "from-indigo-600 to-indigo-800",
      effects: ["Spirituality", "Detachment", "Research", "Moksha"],
    },
  ];

  const lifePhases = [
    {
      phase: "Childhood (0-12 years)",
      characteristics: [
        "Formation of personality",
        "Basic education",
        "Family influence",
        "Health foundation",
      ],
      planets: ["Moon", "Mercury", "Jupiter"],
      icon: Users,
    },
    {
      phase: "Youth (13-25 years)",
      characteristics: [
        "Career beginning",
        "Higher education",
        "Relationships",
        "Independence",
      ],
      planets: ["Mercury", "Venus", "Mars"],
      icon: TrendingUp,
    },
    {
      phase: "Adulthood (26-45 years)",
      characteristics: [
        "Career peak",
        "Marriage",
        "Children",
        "Wealth accumulation",
      ],
      planets: ["Jupiter", "Venus", "Sun"],
      icon: Briefcase,
    },
    {
      phase: "Maturity (46-65 years)",
      characteristics: [
        "Wisdom",
        "Responsibility",
        "Stability",
        "Spiritual growth",
      ],
      planets: ["Saturn", "Jupiter", "Sun"],
      icon: Star,
    },
    {
      phase: "Old Age (65+ years)",
      characteristics: ["Detachment", "Spirituality", "Teaching", "Liberation"],
      planets: ["Saturn", "Rahu", "Ketu"],
      icon: BookOpen,
    },
  ];

  return (
    <>
      <Helmet>
        <title>
          Dasha Periods Complete Guide - Understand Planetary Periods in Vedic
          Astrology | AstroTick
        </title>
        <meta
          name="description"
          content="Master Dasha periods in Vedic astrology with our comprehensive guide. Learn about Vimshottari, Ashtottari, and Yogini Dasha systems. Understand timing of life events and planetary influences."
        />
        <meta
          name="keywords"
          content="dasha periods, Vimshottari dasha, planetary periods, Vedic astrology, life timing, astrological periods, Mahadasha, Antardasha"
        />
        <meta
          property="og:title"
          content="Dasha Periods Complete Guide - Understand Planetary Periods in Vedic Astrology"
        />
        <meta
          property="og:description"
          content="Master Dasha periods in Vedic astrology with our comprehensive guide. Learn about different dasha systems and timing of life events."
        />
        <meta property="og:type" content="article" />
        <link
          rel="canonical"
          href="https://astrotick.com/articles/dasha-periods-guide"
        />
      </Helmet>

      <AstroTickHeader />

      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900">
          {/* Animated Background */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-2000"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-spin-slow">
                  <Clock className="h-8 w-8 text-white" />
                </div>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
                Dasha{" "}
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  Periods
                </span>
              </h1>

              <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto animate-fade-in-delay">
                Master the art of timing in Vedic astrology. Understand how
                planetary periods shape your life journey and predict major life
                events with precision.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/dasha-calculator">
                  <Button className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white px-8 py-3 text-lg flex items-center gap-2 animate-bounce-subtle">
                    <Play className="h-5 w-5" />
                    Calculate Your Dasha
                  </Button>
                </Link>
                <Link href="/kundli">
                  <Button
                    variant="outline"
                    className="border-white text-orange-500 hover:bg-white hover:text-purple-900 px-8 py-3 text-lg"
                  >
                    Generate Birth Chart
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Introduction */}
          <div className="mb-20">
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                <CardTitle className="text-3xl font-bold text-center">
                  What are Dasha Periods?
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div>
                    <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                      Dasha periods are planetary time cycles that form the
                      backbone of Vedic astrology's predictive system. Each
                      planet governs specific periods of your life, influencing
                      different aspects of your personality, relationships,
                      career, and spiritual growth.
                    </p>
                    <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                      The most popular system is Vimshottari Dasha, which
                      divides a 120-year lifespan into periods ruled by nine
                      planets. These periods are further divided into
                      sub-periods (Antardasha) and sub-sub-periods
                      (Pratyantardasha) for precise timing of events.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-purple-100 text-purple-800 px-3 py-1">
                        Planetary Timing
                      </Badge>
                      <Badge className="bg-indigo-100 text-indigo-800 px-3 py-1">
                        Life Events
                      </Badge>
                      <Badge className="bg-blue-100 text-blue-800 px-3 py-1">
                        Predictive System
                      </Badge>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="w-full h-80 bg-gradient-to-br from-orange-100 to-amber-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                      {/* Animated Clock */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-60 h-60 border-4 border-purple-300 rounded-full animate-spin-slow relative">
                          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-1 h-20 bg-purple-500 rounded-full origin-bottom"></div>
                          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-1 h-16 bg-indigo-500 rounded-full origin-bottom"></div>
                        </div>
                        <div className="w-40 h-40 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
                          <Calendar className="h-16 w-16 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Dasha Systems */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Types of Dasha Systems
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Different dasha systems provide various perspectives on life
                timing
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {dashaSystemTypes.map((system, index) => (
                <Card
                  key={index}
                  className="bg-white/80 backdrop-blur-sm shadow-xl border-0 overflow-hidden group hover:shadow-2xl transition-all duration-300"
                >
                  <CardHeader
                    className={`bg-gradient-to-r ${system.color} text-white`}
                  >
                    <CardTitle className="text-xl text-center">
                      {system.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="text-center mb-4">
                      <div className="text-3xl font-bold text-gray-900 mb-2">
                        {system.duration}
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        {system.accuracy} Accuracy
                      </Badge>
                    </div>
                    <p className="text-gray-700 mb-4 text-center">
                      {system.description}
                    </p>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900">
                        Planets Involved:
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {system.planets.map((planet, planetIndex) => (
                          <Badge
                            key={planetIndex}
                            variant="outline"
                            className="text-xs"
                          >
                            {planet}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Vimshottari Dasha Periods */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Vimshottari Dasha Periods
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Understanding the 120-year cycle and planetary influences
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {vimshottariPeriods.map((period, index) => (
                <Card
                  key={index}
                  className="bg-white/80 backdrop-blur-sm shadow-xl border-0 overflow-hidden group hover:shadow-2xl transition-all duration-300"
                >
                  <CardHeader
                    className={`bg-gradient-to-r ${period.color} text-white`}
                  >
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{period.planet}</CardTitle>
                      <Badge className="bg-white/20 text-white">
                        {period.years} Years
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      {period.effects.map((effect, effectIndex) => (
                        <div
                          key={effectIndex}
                          className="flex items-center gap-2"
                        >
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span className="text-sm text-gray-700">
                            {effect}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Life Phases */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Life Phases and Planetary Influences
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                How different life stages are influenced by planetary periods
              </p>
            </div>

            <div className="space-y-6">
              {lifePhases.map((phase, index) => (
                <Card
                  key={index}
                  className="bg-white/80 backdrop-blur-sm shadow-xl border-0 overflow-hidden group hover:shadow-2xl transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
                        <phase.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {phase.phase}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">
                              Characteristics:
                            </h4>
                            <ul className="space-y-1">
                              {phase.characteristics.map((char, charIndex) => (
                                <li
                                  key={charIndex}
                                  className="text-sm text-gray-700 flex items-center gap-2"
                                >
                                  <div className="w-1 h-1 bg-purple-500 rounded-full"></div>
                                  {char}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">
                              Influential Planets:
                            </h4>
                            <div className="flex flex-wrap gap-1">
                              {phase.planets.map((planet, planetIndex) => (
                                <Badge
                                  key={planetIndex}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {planet}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="mb-20">
            <Card className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xl border-0">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4">
                    Ready to Explore Your Dasha Periods?
                  </h2>
                  <p className="text-xl text-purple-100 max-w-2xl mx-auto">
                    Calculate your current dasha periods and discover what the
                    stars have in store for you
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Link href="/dasha-calculator">
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all cursor-pointer group">
                      <CardContent className="p-6 text-center">
                        <Clock className="h-12 w-12 text-yellow-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                        <h3 className="text-lg font-semibold mb-2">
                          Calculate Dasha Periods
                        </h3>
                        <p className="text-sm text-purple-100">
                          Get your personalized dasha timeline
                        </p>
                      </CardContent>
                    </Card>
                  </Link>

                  <Link href="/learn-astrology/advanced">
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all cursor-pointer group">
                      <CardContent className="p-6 text-center">
                        <BookOpen className="h-12 w-12 text-blue-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                        <h3 className="text-lg font-semibold mb-2">
                          Advanced Techniques
                        </h3>
                        <p className="text-sm text-purple-100">
                          Learn more advanced astrology
                        </p>
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
