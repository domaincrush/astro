import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { Badge } from "src/components/ui/badge";
import { Button } from "src/components/ui/button";
import { Map } from "lucide-react";
import {
  BookOpen,
  Star,
  Moon,
  Sun,
  Globe,
  Clock,
  TrendingUp,
  Heart,
  Zap,
  Crown,
  ChevronRight,
  Play,
  CheckCircle,
  User,
  Home,
  Gem,
  Target,
  MapPin,
} from "lucide-react";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";
import { Link } from "wouter";

export default function AstrologyBasics() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fundamentalConcepts = [
    {
      icon: Globe,
      title: "Zodiac Signs (Rashis)",
      description:
        "12 celestial divisions representing different personality traits and characteristics",
      details:
        "Each sign spans 30 degrees of the zodiac circle, from Aries (Mesha) to Pisces (Meena). These signs form the foundation of personality analysis and predict natural tendencies, behavioral patterns, and life approach. The 12 signs are divided into elements (Fire, Earth, Air, Water) and qualities (Cardinal, Fixed, Mutable).",
      color: "from-orange-500 to-red-500",
      link: "/learn-astrology/birth-chart",
      features: [
        "Personality traits",
        "Behavioral patterns",
        "Natural tendencies",
        "Elemental qualities",
      ],
    },
    {
      icon: Star,
      title: "Planets (Navagrahas)",
      description:
        "9 celestial bodies that govern different aspects of human life and consciousness",
      details:
        "Sun (Soul), Moon (Mind), Mars (Energy), Mercury (Communication), Jupiter (Wisdom), Venus (Love), Saturn (Discipline), Rahu (Desires), and Ketu (Liberation). Each planet represents specific energies, qualities, and life areas. Their positions and relationships create the foundation for astrological analysis.",
      color: "from-purple-500 to-indigo-500",
      link: "/learn-astrology/planets",
      features: [
        "Life energies",
        "Cosmic influences",
        "Karmic patterns",
        "Spiritual growth",
      ],
    },
    {
      icon: Clock,
      title: "Birth Chart (Kundli)",
      description:
        "Snapshot of planetary positions at your exact birth time and location",
      details:
        "Foundation of all astrological predictions and personality analysis. This cosmic blueprint reveals your life path, challenges, opportunities, and karmic lessons based on precise astronomical calculations. The birth chart is divided into 12 houses, each representing different life areas.",
      color: "from-blue-500 to-cyan-500",
      link: "/learn-astrology/birth-chart",
      features: [
        "Life path analysis",
        "Karmic lessons",
        "Challenges & opportunities",
        "Personality blueprint",
      ],
    },
    {
      icon: TrendingUp,
      title: "Houses (Bhavas)",
      description:
        "12 life areas representing different aspects of human experience",
      details:
        "First house (Self), Second house (Wealth), Third house (Communication), Fourth house (Home), Fifth house (Creativity), Sixth house (Health), Seventh house (Relationships), Eighth house (Transformation), Ninth house (Spirituality), Tenth house (Career), Eleventh house (Gains), Twelfth house (Liberation). Each house governs specific life themes.",
      color: "from-green-500 to-emerald-500",
      link: "/learn-astrology/planets",
      features: [
        "Life areas",
        "Detailed insights",
        "Specific themes",
        "Comprehensive analysis",
      ],
    },
    {
      icon: Moon,
      title: "Nakshatras",
      description:
        "27 lunar mansions providing deeper insights into personality and spiritual path",
      details:
        "Ancient star constellations that divide the zodiac into 27 sections of 13°20' each. Nakshatras reveal psychological makeup, spiritual tendencies, and karmic patterns beyond what zodiac signs can show. Each nakshatra has its own deity, symbol, and characteristics that influence birth star qualities.",
      color: "from-indigo-500 to-purple-500",
      link: "/learn-astrology/nakshatras",
      features: [
        "Psychological insights",
        "Spiritual tendencies",
        "Karmic patterns",
        "Compatibility analysis",
      ],
    },
    {
      icon: Gem,
      title: "Doshas & Remedies",
      description:
        "Planetary afflictions and their traditional remedial measures for harmony",
      details:
        "Mangal Dosha (Mars affliction), Kaal Sarp Dosha (Rahu-Ketu axis), Pitra Dosha (ancestral karma), and other planetary combinations that create challenges. Vedic astrology provides comprehensive remedial measures including gemstones, mantras, rituals, and charitable acts to harmonize planetary energies.",
      color: "from-red-500 to-pink-500",
      link: "/learn-astrology/doshas",
      features: [
        "Planetary harmony",
        "Remedial measures",
        "Gemstone therapy",
        "Spiritual practices",
      ],
    },
  ];

  const astrologyTypes = [
    {
      title: "Vedic Astrology (Jyotish)",
      description:
        "Ancient Indian system based on sidereal zodiac with precise astronomical calculations",
      features: [
        "Accurate planetary positions",
        "Karmic insights",
        "Spiritual guidance",
        "Remedial measures",
      ],
      icon: Crown,
    },
    {
      title: "Western Astrology",
      description:
        "Modern system using tropical zodiac focusing on psychological traits",
      features: [
        "Personality analysis",
        "Psychological insights",
        "Seasonal connections",
        "Sun sign focus",
      ],
      icon: Sun,
    },
    {
      title: "Chinese Astrology",
      description:
        "12-year cycle system based on lunar calendar with animal signs",
      features: [
        "Annual predictions",
        "Compatibility analysis",
        "Element theory",
        "Cultural wisdom",
      ],
      icon: Moon,
    },
  ];

  const learningPath = [
    {
      step: 1,
      title: "Understand Your Birth Chart",
      description:
        "Learn to read your kundli and identify key planetary positions with comprehensive chart interpretation techniques",
      link: "/learn-astrology/birth-chart",
      duration: "15 min read",
      difficulty: "Beginner",
      icon: User,
    },
    {
      step: 2,
      title: "Master Planets & Houses",
      description:
        "Explore the 9 planets (Navagrahas) and 12 houses to understand how they influence different life areas",
      link: "/learn-astrology/planets",
      duration: "20 min read",
      difficulty: "Beginner",
      icon: Home,
    },
    {
      step: 3,
      title: "Study Planetary Periods",
      description:
        "Understand Dasha systems and timing of life events with comprehensive period analysis and predictions",
      link: "/articles/dasha-periods-guide",
      duration: "25 min read",
      difficulty: "Intermediate",
      icon: Clock,
    },
    {
      step: 4,
      title: "Explore Nakshatras",
      description:
        "Discover the 27 lunar mansions and their profound influence on personality, compatibility, and spiritual growth",
      link: "/learn-astrology/nakshatras",
      duration: "18 min read",
      difficulty: "Intermediate",
      icon: Moon,
    },
    {
      step: 5,
      title: "Learn Doshas & Remedies",
      description:
        "Understand major doshas (Mangal, Kaal Sarp, Pitra) and their authentic remedial measures for planetary harmony",
      link: "/learn-astrology/doshas",
      duration: "22 min read",
      difficulty: "Intermediate",
      icon: Gem,
    },
    {
      step: 6,
      title: "Master Muhurta Timing",
      description:
        "Learn auspicious time selection using Panchang elements for important life events and ceremonies",
      link: "/learn-astrology/muhurta",
      duration: "20 min read",
      difficulty: "Advanced",
      icon: Clock,
    },
    {
      step: 7,
      title: "Practice Advanced Techniques",
      description:
        "Apply KP System, Nadi Astrology, and other advanced methodologies for precise predictions and analysis",
      link: "/learn-astrology/advanced",
      duration: "30 min read",
      difficulty: "Advanced",
      icon: Target,
    },
  ];

  return (
    <>
      <Helmet>
        <title>
          Astrology Basics - Learn Vedic Astrology Fundamentals | AstroTick
        </title>
        <meta
          name="description"
          content="Master the fundamentals of Vedic astrology with our comprehensive guide. Learn about zodiac signs, planetary influences, birth charts, and houses. Perfect for beginners starting their astrological journey."
        />
        <meta
          name="keywords"
          content="astrology basics, Vedic astrology, zodiac signs, birth chart, planetary positions, houses, Jyotish, astrology for beginners"
        />
        <meta
          property="og:title"
          content="Astrology Basics - Learn Vedic Astrology Fundamentals"
        />
        <meta
          property="og:description"
          content="Master the fundamentals of Vedic astrology with our comprehensive guide. Learn about zodiac signs, planetary influences, birth charts, and houses."
        />
        <meta property="og:type" content="article" />
        <link
          rel="canonical"
          href="https://astrotick.com/learn-astrology/basics"
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
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
                Astrology{" "}
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  Basics
                </span>
              </h1>

              <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto animate-fade-in-delay">
                Master the fundamentals of Vedic astrology and discover how
                celestial bodies influence your life, personality, and destiny
                through ancient wisdom.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/learn-astrology/birth-chart">
                  <Button className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white px-8 py-3 text-lg flex items-center gap-2 animate-bounce-subtle">
                    <Play className="h-5 w-5" />
                    Start Learning Now
                  </Button>
                </Link>
                <Link href="/kundli">
                  <Button className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white px-8 py-3 text-lg transition-all duration-300">
                    Generate Your Birth Chart
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* What is Astrology Section */}
          <div className="mb-20">
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                <CardTitle className="text-3xl font-bold text-center">
                  What is Astrology?
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-8">
                  <div>
                    <p className="text-base md:text-lgtext-gray-700 mb-6 leading-relaxed">
                      Astrology is the ancient science of understanding how
                      celestial bodies influence human life and earthly events.
                      It's based on the principle that the positions of planets,
                      stars, and other celestial objects at the time of birth
                      create a unique cosmic blueprint that shapes personality,
                      relationships, and life path.
                    </p>
                    <p className="text-base md:text-lg text-gray-700 mb-6 leading-relaxed">
                      Vedic astrology, also known as Jyotish, is a
                      5,000-year-old system that uses precise astronomical
                      calculations to provide insights into karma, dharma, and
                      the soul's journey through multiple lifetimes. The word
                      "Jyotish" means "science of light" representing the divine
                      light of cosmic knowledge.
                    </p>
                    <p className="text-base md:text-lg text-gray-700 mb-6 leading-relaxed">
                      Unlike Western astrology which uses the tropical zodiac,
                      Vedic astrology employs the sidereal zodiac that accounts
                      for the precession of equinoxes, making it astronomically
                      more accurate for timing predictions and spiritual
                      guidance.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-purple-100 text-purple-800 px-3 py-1">
                        Ancient Wisdom
                      </Badge>
                      <Badge className="bg-indigo-100 text-indigo-800 px-3 py-1">
                        Scientific Calculations
                      </Badge>
                      <Badge className="bg-blue-100 text-blue-800 px-3 py-1">
                        Spiritual Guidance
                      </Badge>
                      <Badge className="bg-green-100 text-green-800 px-3 py-1">
                        Karmic Insights
                      </Badge>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="w-full h-80 bg-gradient-to-br from-orange-100 to-amber-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                      {/* Animated Zodiac Wheel */}
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

                {/* Core Principles */}
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-xl mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                    Core Principles of Vedic Astrology
                  </h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Clock className="h-8 w-8 text-white" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Precise Timing
                      </h4>
                      <p className="text-sm text-gray-700">
                        The exact moment of birth determines planetary positions
                        and their influence on life events
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-3">
                        <MapPin className="h-8 w-8 text-white" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Location Accuracy
                      </h4>
                      <p className="text-sm text-gray-700">
                        Birth place coordinates affect planetary house
                        placements and aspects in the chart
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Zap className="h-8 w-8 text-white" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Karmic Patterns
                      </h4>
                      <p className="text-sm text-gray-700">
                        Planetary energies reflect past karma and guide future
                        spiritual evolution
                      </p>
                    </div>
                  </div>
                </div>

                {/* Why Vedic Astrology Works */}
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                    Why Vedic Astrology Works
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            Astronomical Precision
                          </h4>
                          <p className="text-sm text-gray-700">
                            Uses sidereal zodiac with exact planetary positions
                            based on star constellations
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            Dasha System
                          </h4>
                          <p className="text-sm text-gray-700">
                            Unique planetary period system that accurately
                            predicts timing of life events
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            Nakshatra System
                          </h4>
                          <p className="text-sm text-gray-700">
                            27 lunar mansions provide deeper insights into
                            personality and spiritual path
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            Remedial Measures
                          </h4>
                          <p className="text-sm text-gray-700">
                            Comprehensive solutions including gemstones,
                            mantras, and rituals for planetary harmony
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            Spiritual Foundation
                          </h4>
                          <p className="text-sm text-gray-700">
                            Integrates ancient wisdom with practical guidance
                            for spiritual and material success
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            Proven Track Record
                          </h4>
                          <p className="text-sm text-gray-700">
                            Thousands of years of continuous practice and
                            refinement by ancient sages
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Fundamental Concepts */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Fundamental Concepts
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Understanding these core concepts is essential for mastering
                astrology
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {fundamentalConcepts.map((concept, index) => (
                <Link key={index} href={concept.link}>
                  <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer">
                    <CardHeader
                      className={`bg-gradient-to-r ${concept.color} text-white`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                          <concept.icon className="h-6 w-6" />
                        </div>
                        <CardTitle className="text-xl">
                          {concept.title}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <p className="text-gray-700 mb-4">
                        {concept.description}
                      </p>
                      <p className="text-sm text-gray-600 italic mb-4">
                        {concept.details}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {concept.features.map((feature, featureIndex) => (
                          <Badge
                            key={featureIndex}
                            variant="secondary"
                            className="text-xs"
                          >
                            {feature}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          Click to learn more
                        </span>
                        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Types of Astrology */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Types of Astrology
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Explore different astrological systems and their unique
                approaches
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {astrologyTypes.map((type, index) => (
                <Card
                  key={index}
                  className="bg-white/80 backdrop-blur-sm shadow-xl border-0 overflow-hidden group hover:shadow-2xl transition-all duration-300"
                >
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <type.icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl text-gray-900">
                      {type.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    <p className="text-gray-700 mb-4">{type.description}</p>
                    <ul className="space-y-2">
                      {type.features.map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          className="flex items-center gap-2"
                        >
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-gray-600">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Learning Path */}
          <div className="space-y-6">
            {learningPath.map((item, index) => (
              <Link key={index} href={item.link}>
                <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 overflow-hidden group hover:shadow-2xl transition-all duration-300 cursor-pointer">
                  <CardContent className="p-6">
                    {/* Flex column on mobile, row on larger screens */}
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      {/* Step circle */}
                      <div className="w-12 h-12 p-1 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform shrink-0">
                        {item.step}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        {/* Title + Badges: stack on mobile */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                          <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                            {item.title}
                          </h3>
                          <div className="flex gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {item.difficulty}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {item.duration}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm sm:text-base">
                          {item.description}
                        </p>
                      </div>

                      {/* Chevron stays aligned to right on larger screens, below on mobile */}
                      <ChevronRight className="h-6 w-6 text-gray-400 group-hover:text-purple-600 transition-colors self-end sm:self-auto" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Quick Start Tools */}
          <div className="mb-20">
            <Card className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xl border-0">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4">
                    Ready to Start Your Journey?
                  </h2>
                  <p className="text-xl text-purple-100 max-w-2xl mx-auto">
                    Use our free tools to begin exploring your astrological
                    profile
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <Link href="/kundli">
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all cursor-pointer group">
                      <CardContent className="p-6 text-center">
                        <Star className="h-12 w-12 text-yellow-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                        <h3 className="text-lg font-semibold mb-2">
                          Generate Birth Chart
                        </h3>
                        <p className="text-sm text-purple-100">
                          Create your personalized kundli
                        </p>
                      </CardContent>
                    </Card>
                  </Link>

                  <Link href="/moon-sign-checker">
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all cursor-pointer group">
                      <CardContent className="p-6 text-center">
                        <Moon className="h-12 w-12 text-blue-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                        <h3 className="text-lg font-semibold mb-2">
                          Find Moon Sign
                        </h3>
                        <p className="text-sm text-purple-100">
                          Discover your emotional nature
                        </p>
                      </CardContent>
                    </Card>
                  </Link>

                  <Link href="/nakshatra-finder">
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all cursor-pointer group">
                      <CardContent className="p-6 text-center">
                        <Zap className="h-12 w-12 text-green-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                        <h3 className="text-lg font-semibold mb-2">
                          Nakshatra Finder
                        </h3>
                        <p className="text-sm text-purple-100">
                          Explore your birth star
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
