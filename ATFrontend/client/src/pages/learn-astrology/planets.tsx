import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { Badge } from "src/components/ui/badge";
import { Button } from "src/components/ui/button";
import {
  Sun,
  Moon,
  Shield,
  MessageCircle,
  Crown,
  Heart,
  Clock,
  Eye,
  Zap,
  Home,
  Calculator,
  Target,
  TrendingUp,
  CheckCircle,
  Play,
  Star,
  Globe,
} from "lucide-react";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";
import { Link } from "wouter";

export default function PlanetsAndHouses() {
  const [activeTab, setActiveTab] = useState("planets");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const planets = [
    {
      name: "Sun (Surya)",
      icon: Sun,
      element: "Fire",
      day: "Sunday",
      color: "Orange/Gold",
      significance: "Soul, father, authority, government, health, vitality",
      positive: [
        "Leadership",
        "Confidence",
        "Vitality",
        "Authority",
        "Nobility",
      ],
      negative: ["Ego", "Arrogance", "Domination", "Pride", "Aggression"],
      houses: ["1st (Exalted)", "5th (Own)", "9th (Friendly)"],
      gradient: "from-orange-400 to-yellow-500",
      gemstone: "Ruby",
      mantra: "Om Suryaya Namaha",
    },
    {
      name: "Moon (Chandra)",
      icon: Moon,
      element: "Water",
      day: "Monday",
      color: "White/Silver",
      significance: "Mind, mother, emotions, memory, water, public",
      positive: [
        "Intuition",
        "Nurturing",
        "Creativity",
        "Emotional intelligence",
        "Memory",
      ],
      negative: [
        "Moodiness",
        "Instability",
        "Over-sensitivity",
        "Dependency",
        "Confusion",
      ],
      houses: ["2nd (Friendly)", "4th (Own)", "12th (Spiritual)"],
      gradient: "from-blue-400 to-indigo-500",
      gemstone: "Pearl",
      mantra: "Om Chandraya Namaha",
    },
    {
      name: "Mars (Mangal)",
      icon: Shield,
      element: "Fire",
      day: "Tuesday",
      color: "Red",
      significance: "Energy, brother, property, courage, accidents, surgery",
      positive: [
        "Courage",
        "Energy",
        "Determination",
        "Athletic ability",
        "Leadership",
      ],
      negative: ["Anger", "Aggression", "Impatience", "Violence", "Conflicts"],
      houses: ["1st (Own)", "8th (Own)", "10th (Exalted)"],
      gradient: "from-red-500 to-pink-600",
      gemstone: "Red Coral",
      mantra: "Om Mangalaya Namaha",
    },
    {
      name: "Mercury (Budha)",
      icon: MessageCircle,
      element: "Earth",
      day: "Wednesday",
      color: "Green",
      significance: "Intelligence, communication, business, education, skills",
      positive: [
        "Intelligence",
        "Communication",
        "Wit",
        "Adaptability",
        "Learning",
      ],
      negative: [
        "Nervousness",
        "Inconsistency",
        "Superficiality",
        "Restlessness",
        "Cunning",
      ],
      houses: ["3rd (Own)", "6th (Own)", "1st (Exalted)"],
      gradient: "from-green-400 to-emerald-500",
      gemstone: "Emerald",
      mantra: "Om Budhaya Namaha",
    },
    {
      name: "Jupiter (Guru)",
      icon: Crown,
      element: "Ether",
      day: "Thursday",
      color: "Yellow",
      significance: "Wisdom, children, spirituality, wealth, teacher, dharma",
      positive: [
        "Wisdom",
        "Spirituality",
        "Generosity",
        "Teaching",
        "Prosperity",
      ],
      negative: [
        "Over-indulgence",
        "Laziness",
        "Dogmatism",
        "Excess",
        "Superiority",
      ],
      houses: ["9th (Own)", "12th (Own)", "4th (Exalted)"],
      gradient: "from-yellow-400 to-amber-500",
      gemstone: "Yellow Sapphire",
      mantra: "Om Gurave Namaha",
    },
    {
      name: "Venus (Shukra)",
      icon: Heart,
      element: "Water",
      day: "Friday",
      color: "White/Pink",
      significance: "Love, beauty, luxury, spouse, arts, vehicles",
      positive: ["Love", "Beauty", "Harmony", "Artistic talent", "Luxury"],
      negative: [
        "Materialism",
        "Vanity",
        "Indulgence",
        "Laziness",
        "Superficiality",
      ],
      houses: ["2nd (Own)", "7th (Own)", "12th (Exalted)"],
      gradient: "from-pink-400 to-rose-500",
      gemstone: "Diamond",
      mantra: "Om Shukraya Namaha",
    },
    {
      name: "Saturn (Shani)",
      icon: Clock,
      element: "Air",
      day: "Saturday",
      color: "Black/Blue",
      significance: "Discipline, delays, karma, longevity, hardships, justice",
      positive: [
        "Discipline",
        "Patience",
        "Responsibility",
        "Endurance",
        "Justice",
      ],
      negative: [
        "Delays",
        "Obstacles",
        "Depression",
        "Restrictions",
        "Pessimism",
      ],
      houses: ["10th (Own)", "11th (Own)", "7th (Exalted)"],
      gradient: "from-gray-600 to-blue-800",
      gemstone: "Blue Sapphire",
      mantra: "Om Shanaye Namaha",
    },
    {
      name: "Rahu (North Node)",
      icon: Eye,
      element: "Air",
      day: "No specific day",
      color: "Smoke/Gray",
      significance: "Obsessions, foreign, technology, illusions, sudden gains",
      positive: [
        "Innovation",
        "Technology",
        "Foreign connections",
        "Sudden success",
        "Research",
      ],
      negative: [
        "Confusion",
        "Deception",
        "Obsession",
        "Illusion",
        "Addiction",
      ],
      houses: ["3rd, 6th, 11th (Favorable)", "Shadow planet"],
      gradient: "from-gray-500 to-slate-700",
      gemstone: "Hessonite",
      mantra: "Om Rahave Namaha",
    },
    {
      name: "Ketu (South Node)",
      icon: Zap,
      element: "Fire",
      day: "No specific day",
      color: "Brown/Gray",
      significance: "Detachment, spirituality, past life, moksha, intuition",
      positive: [
        "Spirituality",
        "Intuition",
        "Detachment",
        "Mysticism",
        "Liberation",
      ],
      negative: [
        "Confusion",
        "Lack of direction",
        "Isolation",
        "Withdrawal",
        "Instability",
      ],
      houses: ["3rd, 6th, 11th (Favorable)", "Shadow planet"],
      gradient: "from-amber-600 to-orange-800",
      gemstone: "Cat's Eye",
      mantra: "Om Ketave Namaha",
    },
  ];

  const houses = [
    {
      number: 1,
      name: "Tanu Bhava (Self)",
      ruler: "Mars",
      element: "Fire",
      significance:
        "Physical body, personality, appearance, health, general life approach",
      keywords: ["Self", "Body", "Personality", "Health", "First impressions"],
      lifeAreas: [
        "Physical appearance",
        "Health and vitality",
        "Personality traits",
        "Life direction",
        "Overall well-being",
      ],
      planetEffects: {
        Sun: "Strong personality, leadership qualities, good health",
        Moon: "Emotional nature, changeable personality, intuitive",
        Mars: "Energetic, courageous, athletic build, possible injuries",
        Mercury: "Intelligent, communicative, youthful appearance",
        Jupiter: "Optimistic, wise, well-built, spiritual inclination",
        Venus: "Attractive, artistic, harmonious personality",
        Saturn: "Serious, disciplined, possible health issues, delayed success",
        Rahu: "Unusual personality, foreign connections, innovative",
        Ketu: "Spiritual, detached, mysterious personality",
      },
    },
    {
      number: 2,
      name: "Dhana Bhava (Wealth)",
      ruler: "Venus",
      element: "Earth",
      significance: "Money, speech, food, family values, accumulated wealth",
      keywords: ["Wealth", "Speech", "Food", "Family", "Values"],
      lifeAreas: [
        "Financial resources",
        "Speech and communication",
        "Food and eating habits",
        "Family values",
        "Possessions",
      ],
      planetEffects: {
        Sun: "Government job, authoritative speech, good wealth",
        Moon: "Fluctuating finances, sweet speech, food business",
        Mars: "Harsh speech, wealth through property, family conflicts",
        Mercury: "Wealth through communication, business acumen",
        Jupiter: "Generous, wise speech, spiritual wealth",
        Venus: "Luxury, beautiful speech, artistic wealth",
        Saturn: "Slow accumulation, practical speech, hard-earned money",
        Rahu: "Sudden wealth, foreign money, deceptive speech",
        Ketu: "Detachment from wealth, spiritual speech",
      },
    },
    {
      number: 7,
      name: "Kalatra Bhava (Partnership)",
      ruler: "Venus",
      element: "Air",
      significance: "Marriage, spouse, business partnerships, legal matters",
      keywords: ["Marriage", "Spouse", "Partnership", "Legal", "Others"],
      lifeAreas: [
        "Marriage and spouse",
        "Business partnerships",
        "Legal matters",
        "Public relations",
        "Open enemies",
      ],
      planetEffects: {
        Sun: "Authoritative spouse, government partnerships, leadership in marriage",
        Moon: "Emotional spouse, caring partner, changeable relationships",
        Mars: "Energetic spouse, possible conflicts, passionate relationships",
        Mercury:
          "Intelligent spouse, communication in marriage, business partnerships",
        Jupiter: "Wise spouse, spiritual partner, fortunate marriage",
        Venus: "Beautiful spouse, harmonious marriage, artistic partnerships",
        Saturn: "Mature spouse, delayed marriage, serious partnerships",
        Rahu: "Foreign spouse, unusual partnerships, obsessive relationships",
        Ketu: "Spiritual spouse, detached partnerships, karmic relationships",
      },
    },
    {
      number: 10,
      name: "Karma Bhava (Career)",
      ruler: "Saturn",
      element: "Earth",
      significance: "Career, profession, reputation, authority, public image",
      keywords: ["Career", "Profession", "Reputation", "Authority", "Public"],
      lifeAreas: [
        "Professional life",
        "Public reputation",
        "Authority and status",
        "Government position",
        "Father's influence",
      ],
      planetEffects: {
        Sun: "Government job, authority, leadership roles, politics",
        Moon: "Public-related career, healthcare, hospitality",
        Mars: "Military, engineering, sports, surgery",
        Mercury: "Communication, media, teaching, business",
        Jupiter: "Teaching, spirituality, law, counseling",
        Venus: "Arts, entertainment, luxury goods, beauty",
        Saturn: "Service, hard work, mining, construction",
        Rahu: "Technology, foreign companies, research",
        Ketu: "Spirituality, occult, research, detachment",
      },
    },
  ];

  const planetaryAspects = [
    {
      planet: "Sun",
      aspects: ["7th house"],
      description: "Direct opposition aspect",
    },
    {
      planet: "Moon",
      aspects: ["7th house"],
      description: "Emotional influence aspect",
    },
    {
      planet: "Mars",
      aspects: ["4th, 7th, 8th houses"],
      description: "Aggressive energy aspects",
    },
    {
      planet: "Mercury",
      aspects: ["7th house"],
      description: "Communication aspect",
    },
    {
      planet: "Jupiter",
      aspects: ["5th, 7th, 9th houses"],
      description: "Wisdom and expansion aspects",
    },
    {
      planet: "Venus",
      aspects: ["7th house"],
      description: "Love and harmony aspect",
    },
    {
      planet: "Saturn",
      aspects: ["3rd, 7th, 10th houses"],
      description: "Discipline and restriction aspects",
    },
    {
      planet: "Rahu",
      aspects: ["5th, 7th, 9th houses"],
      description: "Obsessive influence aspects",
    },
    {
      planet: "Ketu",
      aspects: ["5th, 7th, 9th houses"],
      description: "Detachment aspects",
    },
  ];

  return (
    <>
      <Helmet>
        <title>
          Planets and Houses - Complete Guide to Vedic Astrology | AstroTick
        </title>
        <meta
          name="description"
          content="Master the planets and houses in Vedic astrology. Learn about the 9 planets (Navagrahas) and 12 houses, their meanings, influences, and effects on your life."
        />
        <meta
          name="keywords"
          content="planets astrology, houses astrology, Navagrahas, Vedic planets, astrological houses, planetary influences, house meanings"
        />
        <meta
          property="og:title"
          content="Planets and Houses - Complete Guide to Vedic Astrology"
        />
        <meta
          property="og:description"
          content="Master the planets and houses in Vedic astrology. Learn about the 9 planets and 12 houses, their meanings and influences."
        />
        <meta property="og:type" content="article" />
        <link
          rel="canonical"
          href="https://astrotick.com/learn-astrology/planets"
        />
      </Helmet>

      <AstroTickHeader />

      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-purple-900 via-pink-900 to-orange-900">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-1000"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
                    <Calculator className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full animate-spin-slow"></div>
                </div>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
                Planets &{" "}
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  Houses
                </span>
              </h1>

              <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto animate-fade-in-delay">
                Discover the cosmic forces that shape your destiny through the 9
                planets (Navagrahas) and 12 houses of Vedic astrology.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white px-8 py-3 text-lg flex items-center gap-2 animate-bounce-subtle"
                  onClick={() => setActiveTab("planets")}
                >
                  <Calculator className="h-5 w-5" />
                  Explore Planets
                </Button>
                <Button
                  variant="outline"
                  className="border-white text-orange-600 hover:bg-white hover:text-purple-900 px-8 py-3 text-lg"
                  onClick={() => setActiveTab("houses")}
                >
                  <Home className="h-5 w-5 mr-2" />
                  Study Houses
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-lg p-2 shadow-lg">
              <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                <Button
                  variant={activeTab === "planets" ? "default" : "ghost"}
                  onClick={() => setActiveTab("planets")}
                  className="flex items-center gap-2"
                >
                  <Calculator className="h-4 w-4" />
                  Planets (Navagrahas)
                </Button>
                <Button
                  variant={activeTab === "houses" ? "default" : "ghost"}
                  onClick={() => setActiveTab("houses")}
                  className="flex items-center gap-2"
                >
                  <Home className="h-4 w-4" />
                  Houses (Bhavas)
                </Button>
                <Button
                  variant={activeTab === "aspects" ? "default" : "ghost"}
                  onClick={() => setActiveTab("aspects")}
                  className="flex items-center gap-2"
                >
                  <Target className="h-4 w-4" />
                  Planetary Aspects
                </Button>
              </div>
            </div>
          </div>

          {/* Planets Tab */}
          {activeTab === "planets" && (
            <div className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  The Nine Planets (Navagrahas)
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Each planet represents specific energies and influences in
                  your life
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {planets.map((planet, index) => (
                  <Card
                    key={index}
                    className="bg-white/90 backdrop-blur-sm shadow-xl border-0 overflow-hidden group hover:shadow-2xl transition-all duration-300"
                  >
                    <CardHeader
                      className={`bg-gradient-to-r ${planet.gradient} text-white`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                            <planet.icon className="h-6 w-6" />
                          </div>
                          <div>
                            <CardTitle className="text-xl">
                              {planet.name}
                            </CardTitle>
                            <p className="text-sm opacity-90">
                              {planet.day} | {planet.color}
                            </p>
                          </div>
                        </div>
                        <Badge className="bg-white/20 text-white border-white/30">
                          {planet.element}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <p className="text-gray-700 text-sm">
                        {planet.significance}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-green-700 mb-2">
                            Positive Traits
                          </h4>
                          <ul className="space-y-1">
                            {planet.positive.map((trait, i) => (
                              <li
                                key={i}
                                className="text-sm text-gray-600 flex items-center gap-2"
                              >
                                <CheckCircle className="h-3 w-3 text-green-500" />
                                {trait}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-red-700 mb-2">
                            Challenging Traits
                          </h4>
                          <ul className="space-y-1">
                            {planet.negative.map((trait, i) => (
                              <li
                                key={i}
                                className="text-sm text-gray-600 flex items-center gap-2"
                              >
                                <div className="w-3 h-3 bg-red-500 rounded-full" />
                                {trait}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
                        <div>
                          <h4 className="font-semibold text-purple-700 mb-2">
                            Gemstone
                          </h4>
                          <p className="text-sm text-gray-600">
                            {planet.gemstone}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-blue-700 mb-2">
                            Mantra
                          </h4>
                          <p className="text-sm text-gray-600 font-mono">
                            {planet.mantra}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Houses Tab */}
          {activeTab === "houses" && (
            <div className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  The Twelve Houses (Bhavas)
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Each house represents different life areas and experiences
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {houses.map((house, index) => (
                  <Card
                    key={index}
                    className="bg-white/90 backdrop-blur-sm shadow-xl border-0 overflow-hidden group hover:shadow-2xl transition-all duration-300"
                  >
                    <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                            <span className="text-xl font-bold">
                              {house.number}
                            </span>
                          </div>
                          <div>
                            <CardTitle className="text-xl">
                              {house.name}
                            </CardTitle>
                            <p className="text-sm opacity-90">
                              Ruled by {house.ruler} | {house.element}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <p className="text-gray-700 text-sm">
                        {house.significance}
                      </p>

                      <div>
                        <h4 className="font-semibold text-indigo-700 mb-2">
                          Key Areas
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {house.lifeAreas.map((area, i) => (
                            <Badge
                              key={i}
                              variant="secondary"
                              className="text-xs"
                            >
                              {area}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-purple-700 mb-2">
                          Planetary Effects
                        </h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {Object.entries(house.planetEffects).map(
                            ([planet, effect], i) => (
                              <div key={i} className="text-sm">
                                <span className="font-medium text-gray-800">
                                  {planet}:
                                </span>
                                <span className="text-gray-600 ml-2">
                                  {effect}
                                </span>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Aspects Tab */}
          {activeTab === "aspects" && (
            <div className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Planetary Aspects (Drishti)
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  How planets influence houses and other planets through their
                  aspects
                </p>
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                {planetaryAspects.map((aspect, index) => (
                  <Card
                    key={index}
                    className="bg-white/90 backdrop-blur-sm shadow-xl border-0 overflow-hidden group hover:shadow-2xl transition-all duration-300"
                  >
                    <CardHeader className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white">
                      <CardTitle className="text-lg">{aspect.planet}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-semibold text-teal-700 mb-2">
                            Aspects
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {aspect.aspects.map((house, i) => (
                              <Badge
                                key={i}
                                className="bg-teal-100 text-teal-800"
                              >
                                {house}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-cyan-700 mb-2">
                            Description
                          </h4>
                          <p className="text-sm text-gray-600">
                            {aspect.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Tools */}
          <div className="mt-20">
            <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xl border-0">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4">
                    Apply Your Knowledge
                  </h2>
                  <p className="text-xl text-purple-100 max-w-2xl mx-auto">
                    Use our tools to see how planets and houses work in your
                    birth chart
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <Link href="/kundli">
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all cursor-pointer group">
                      <CardContent className="p-6 text-center">
                        <Star className="h-12 w-12 text-yellow-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                        <h3 className="text-lg font-semibold mb-2">
                          Your Birth Chart
                        </h3>
                        <p className="text-sm text-purple-100">
                          See planetary positions in your houses
                        </p>
                      </CardContent>
                    </Card>
                  </Link>

                  <Link href="/dasha-calculator">
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all cursor-pointer group">
                      <CardContent className="p-6 text-center">
                        <Clock className="h-12 w-12 text-blue-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                        <h3 className="text-lg font-semibold mb-2">
                          Dasha Calculator
                        </h3>
                        <p className="text-sm text-purple-100">
                          Understand planetary time periods
                        </p>
                      </CardContent>
                    </Card>
                  </Link>

                  <Link href="/premium-report">
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all cursor-pointer group">
                      <CardContent className="p-6 text-center">
                        <Crown className="h-12 w-12 text-purple-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                        <h3 className="text-lg font-semibold mb-2">
                          Detailed Analysis
                        </h3>
                        <p className="text-sm text-purple-100">
                          Get comprehensive planetary insights
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
