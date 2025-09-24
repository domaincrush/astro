import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { Badge } from "src/components/ui/badge";
import { Button } from "src/components/ui/button";
import {
  Heart,
  Shield,
  AlertTriangle,
  Sparkles,
  Crown,
  Gem,
  Clock,
  Sun,
  Moon,
  Target,
  CheckCircle,
  XCircle,
  Play,
  Search,
  Star,
  BookOpen,
  Zap,
} from "lucide-react";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";
import { Link } from "wouter";

export default function DoshasAndRemedies() {
  const [activeTab, setActiveTab] = useState("doshas");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const majorDoshas = [
    {
      name: "Mangal Dosha (Mars Dosha)",
      icon: Shield,
      severity: "High",
      description:
        "Caused by Mars placement in 1st, 2nd, 4th, 7th, 8th, or 12th houses",
      effects: [
        "Delays in marriage",
        "Conflicts in relationships",
        "Aggressive behavior",
        "Financial instability",
        "Health issues",
      ],
      remedies: [
        "Recite Hanuman Chalisa daily",
        "Fast on Tuesdays",
        "Wear red coral gemstone",
        "Donate red items (clothes, food)",
        "Perform Mars-related pujas",
      ],
      gemstone: "Red Coral",
      mantra: "Om Angarakaya Namaha",
      color: "from-red-500 to-pink-600",
    },
    {
      name: "Kaal Sarp Dosha",
      icon: AlertTriangle,
      severity: "Very High",
      description:
        "All planets positioned between Rahu and Ketu in birth chart",
      effects: [
        "Constant struggles in life",
        "Delayed success",
        "Mental stress and anxiety",
        "Relationship problems",
        "Career obstacles",
      ],
      remedies: [
        "Visit Kaal Sarp Dosha temples",
        "Recite Maha Mrityunjaya Mantra",
        "Perform Rudrabhishek",
        "Donate silver items",
        "Wear Gomed (Hessonite) gemstone",
      ],
      gemstone: "Hessonite (Gomed)",
      mantra: "Om Namah Shivaya",
      color: "from-gray-600 to-slate-700",
    },
    {
      name: "Pitra Dosha",
      icon: Crown,
      severity: "Medium",
      description: "Afflictions related to ancestors and family lineage",
      effects: [
        "Family discord",
        "Ancestral property disputes",
        "Childlessness",
        "Repeated misfortunes",
        "Spiritual blocks",
      ],
      remedies: [
        "Perform Pitra Paksha rituals",
        "Offer prayers to ancestors",
        "Donate food to Brahmins",
        "Plant trees in memory of ancestors",
        "Recite Vishnu Sahasranamam",
      ],
      gemstone: "Pearl",
      mantra: "Om Pitru Devaya Namaha",
      color: "from-indigo-500 to-purple-600",
    },
    {
      name: "Shani Dosha (Saturn Dosha)",
      icon: Clock,
      severity: "High",
      description: "Malefic effects of Saturn in birth chart",
      effects: [
        "Delays in all life areas",
        "Chronic health issues",
        "Financial problems",
        "Professional setbacks",
        "Depression and pessimism",
      ],
      remedies: [
        "Recite Shani Chalisa",
        "Donate black items on Saturdays",
        "Feed crows and dogs",
        "Wear Blue Sapphire (with caution)",
        "Perform charity work",
      ],
      gemstone: "Blue Sapphire",
      mantra: "Om Shanaischaraya Namaha",
      color: "from-blue-800 to-indigo-900",
    },
    {
      name: "Guru Chandal Dosha",
      icon: Sparkles,
      severity: "Medium",
      description: "Conjunction or aspect of Jupiter with Rahu",
      effects: [
        "Spiritual confusion",
        "Loss of wisdom",
        "Problems with teachers/gurus",
        "Educational obstacles",
        "Moral dilemmas",
      ],
      remedies: [
        "Recite Guru Mantra daily",
        "Donate yellow items on Thursdays",
        "Respect teachers and elders",
        "Wear Yellow Sapphire",
        "Study religious texts",
      ],
      gemstone: "Yellow Sapphire",
      mantra: "Om Brihaspataye Namaha",
      color: "from-yellow-500 to-amber-600",
    },
  ];

  const gemstones = [
    {
      name: "Ruby",
      planet: "Sun",
      benefits: ["Confidence", "Leadership", "Vitality", "Success"],
      precautions: "Avoid if Mars is strong",
      color: "Red",
      day: "Sunday",
    },
    {
      name: "Pearl",
      planet: "Moon",
      benefits: ["Emotional balance", "Intuition", "Peace", "Memory"],
      precautions: "Avoid during full moon",
      color: "White",
      day: "Monday",
    },
    {
      name: "Red Coral",
      planet: "Mars",
      benefits: ["Courage", "Energy", "Confidence", "Health"],
      precautions: "Check Mars placement first",
      color: "Red",
      day: "Tuesday",
    },
    {
      name: "Emerald",
      planet: "Mercury",
      benefits: ["Intelligence", "Communication", "Business", "Memory"],
      precautions: "Avoid if Mercury is debilitated",
      color: "Green",
      day: "Wednesday",
    },
    {
      name: "Yellow Sapphire",
      planet: "Jupiter",
      benefits: ["Wisdom", "Wealth", "Spirituality", "Children"],
      precautions: "Most beneficial gemstone",
      color: "Yellow",
      day: "Thursday",
    },
    {
      name: "Diamond",
      planet: "Venus",
      benefits: ["Love", "Beauty", "Luxury", "Harmony"],
      precautions: "Avoid if Venus is weak",
      color: "White",
      day: "Friday",
    },
    {
      name: "Blue Sapphire",
      planet: "Saturn",
      benefits: ["Discipline", "Focus", "Longevity", "Justice"],
      precautions: "Most powerful - use with caution",
      color: "Blue",
      day: "Saturday",
    },
  ];

  const mantras = [
    {
      deity: "Ganesha",
      mantra: "Om Gam Ganapataye Namaha",
      benefits: "Remove obstacles, new beginnings",
      chanting: "108 times daily",
    },
    {
      deity: "Shiva",
      mantra: "Om Namah Shivaya",
      benefits: "Spiritual growth, transformation",
      chanting: "108 times daily",
    },
    {
      deity: "Hanuman",
      mantra: "Om Hanumate Namaha",
      benefits: "Courage, strength, Mars-related issues",
      chanting: "108 times on Tuesdays",
    },
    {
      deity: "Lakshmi",
      mantra: "Om Shreem Mahalakshmiyei Namaha",
      benefits: "Wealth, prosperity, Venus-related issues",
      chanting: "108 times on Fridays",
    },
    {
      deity: "Saraswati",
      mantra: "Om Aim Saraswatyai Namaha",
      benefits: "Knowledge, wisdom, Mercury-related issues",
      chanting: "108 times on Wednesdays",
    },
  ];

  const rituals = [
    {
      name: "Rudrabhishek",
      purpose: "Shiva worship for spiritual cleansing",
      procedure: "Abhishek with water, milk, honey on Shiva Linga",
      frequency: "Every Monday or festival days",
      benefits: "Removes all doshas, spiritual growth",
    },
    {
      name: "Havan/Homa",
      purpose: "Fire rituals for planetary peace",
      procedure: "Offerings in sacred fire with mantras",
      frequency: "On specific planetary days",
      benefits: "Purifies environment, pleases planets",
    },
    {
      name: "Pitra Paksha",
      purpose: "Ancestral worship and appeasement",
      procedure: "Offerings to ancestors for 15 days",
      frequency: "Annual (September/October)",
      benefits: "Removes Pitra Dosha, family harmony",
    },
    {
      name: "Navgraha Puja",
      purpose: "Worship of all nine planets",
      procedure: "Systematic worship with offerings",
      frequency: "Monthly or on festivals",
      benefits: "Balances all planetary energies",
    },
  ];

  return (
    <>
      <Helmet>
        <title>
          Doshas and Remedies - Vedic Astrology Solutions | AstroTick
        </title>
        <meta
          name="description"
          content="Learn about major astrological doshas like Mangal Dosha, Kaal Sarp Dosha, and their effective remedies including gemstones, mantras, and rituals."
        />
        <meta
          name="keywords"
          content="doshas astrology, Mangal Dosha, Kaal Sarp Dosha, astrological remedies, gemstones, mantras, Vedic rituals"
        />
        <meta
          property="og:title"
          content="Doshas and Remedies - Vedic Astrology Solutions"
        />
        <meta
          property="og:description"
          content="Learn about major astrological doshas and their effective remedies including gemstones, mantras, and rituals."
        />
        <meta property="og:type" content="article" />
        <link
          rel="canonical"
          href="https://astrotick.com/learn-astrology/doshas"
        />
      </Helmet>

      <AstroTickHeader />

      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-rose-900 via-pink-900 to-purple-900">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-rose-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-1000"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <Heart className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full animate-pulse">
                    <Shield className="h-3 w-3 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
                Doshas &{" "}
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  Remedies
                </span>
              </h1>

              <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto animate-fade-in-delay">
                Identify and remedy planetary doshas through authentic Vedic
                solutions including gemstones, mantras, and spiritual practices.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/dosham-detector">
                  <Button className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white px-8 py-3 text-lg flex items-center gap-2 animate-bounce-subtle">
                    <Search className="h-5 w-5" />
                    Check Your Doshas
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="border-white text-orange-600 hover:bg-white hover:text-purple-900 px-8 py-3 text-lg"
                  onClick={() => setActiveTab("remedies")}
                >
                  <Gem className="h-5 w-5 mr-2" />
                  Explore Remedies
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-lg p-2 shadow-lg">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <Button
                  variant={activeTab === "doshas" ? "default" : "ghost"}
                  onClick={() => setActiveTab("doshas")}
                  className="flex items-center gap-2"
                >
                  <AlertTriangle className="h-4 w-4" />
                  Major Doshas
                </Button>
                <Button
                  variant={activeTab === "remedies" ? "default" : "ghost"}
                  onClick={() => setActiveTab("remedies")}
                  className="flex items-center gap-2"
                >
                  <Gem className="h-4 w-4" />
                  Gemstones
                </Button>
                <Button
                  variant={activeTab === "mantras" ? "default" : "ghost"}
                  onClick={() => setActiveTab("mantras")}
                  className="flex items-center gap-2"
                >
                  <BookOpen className="h-4 w-4" />
                  Mantras
                </Button>
                <Button
                  variant={activeTab === "rituals" ? "default" : "ghost"}
                  onClick={() => setActiveTab("rituals")}
                  className="flex items-center gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  Rituals
                </Button>
              </div>
            </div>
          </div>

          {/* Doshas Tab */}
          {activeTab === "doshas" && (
            <div className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Major Astrological Doshas
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Understanding and identifying planetary afflictions in your
                  birth chart
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {majorDoshas.map((dosha, index) => (
                  <Card
                    key={index}
                    className="bg-white/90 backdrop-blur-sm shadow-xl border-0 overflow-hidden group hover:shadow-2xl transition-all duration-300"
                  >
                    <CardHeader
                      className={`bg-gradient-to-r ${dosha.color} text-white`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                            <dosha.icon className="h-6 w-6" />
                          </div>
                          <div>
                            <CardTitle className="text-xl">
                              {dosha.name}
                            </CardTitle>
                            <Badge className="bg-white/20 text-white border-white/30 mt-1">
                              {dosha.severity} Severity
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <p className="text-gray-700 text-sm">
                        {dosha.description}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-red-700 mb-2 flex items-center gap-2">
                            <XCircle className="h-4 w-4" />
                            Effects
                          </h4>
                          <ul className="space-y-1">
                            {dosha.effects.map((effect, i) => (
                              <li key={i} className="text-sm text-gray-600">
                                • {effect}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            Remedies
                          </h4>
                          <ul className="space-y-1">
                            {dosha.remedies.slice(0, 3).map((remedy, i) => (
                              <li key={i} className="text-sm text-gray-600">
                                • {remedy}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
                        <div>
                          <h4 className="font-semibold text-purple-700 mb-2">
                            Recommended Gemstone
                          </h4>
                          <p className="text-sm text-gray-600">
                            {dosha.gemstone}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-blue-700 mb-2">
                            Healing Mantra
                          </h4>
                          <p className="text-sm text-gray-600 font-mono">
                            {dosha.mantra}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Gemstones Tab */}
          {activeTab === "remedies" && (
            <div className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Healing Gemstones
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Planetary gemstones for enhancing positive energies and
                  remedying doshas
                </p>
              </div>

              <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
                {gemstones.map((gem, index) => (
                  <Card
                    key={index}
                    className="bg-white/90 backdrop-blur-sm shadow-xl border-0 overflow-hidden group hover:shadow-2xl transition-all duration-300"
                  >
                    <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Gem className="h-6 w-6" />
                          <div>
                            <CardTitle className="text-lg">
                              {gem.name}
                            </CardTitle>
                            <p className="text-sm opacity-90">
                              {gem.planet} | {gem.day}
                            </p>
                          </div>
                        </div>
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: gem.color.toLowerCase() }}
                        ></div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <div>
                        <h4 className="font-semibold text-green-700 mb-2">
                          Benefits
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {gem.benefits.map((benefit, i) => (
                            <Badge
                              key={i}
                              variant="secondary"
                              className="text-xs"
                            >
                              {benefit}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-orange-700 mb-2">
                          Precautions
                        </h4>
                        <p className="text-sm text-gray-600">
                          {gem.precautions}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Mantras Tab */}
          {activeTab === "mantras" && (
            <div className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Healing Mantras
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Sacred sounds and vibrations for planetary healing and
                  spiritual growth
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {mantras.map((mantra, index) => (
                  <Card
                    key={index}
                    className="bg-white/90 backdrop-blur-sm shadow-xl border-0 overflow-hidden group hover:shadow-2xl transition-all duration-300"
                  >
                    <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                          <BookOpen className="h-6 w-6" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">
                            {mantra.deity} Mantra
                          </CardTitle>
                          <p className="text-sm opacity-90">
                            {mantra.chanting}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-lg font-mono text-center text-gray-800">
                          {mantra.mantra}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-orange-700 mb-2">
                          Benefits
                        </h4>
                        <p className="text-sm text-gray-600">
                          {mantra.benefits}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Rituals Tab */}
          {activeTab === "rituals" && (
            <div className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Vedic Rituals
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Sacred ceremonies and practices for planetary appeasement and
                  spiritual purification
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {rituals.map((ritual, index) => (
                  <Card
                    key={index}
                    className="bg-white/90 backdrop-blur-sm shadow-xl border-0 overflow-hidden group hover:shadow-2xl transition-all duration-300"
                  >
                    <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                          <Sparkles className="h-6 w-6" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">
                            {ritual.name}
                          </CardTitle>
                          <p className="text-sm opacity-90">
                            {ritual.frequency}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <div>
                        <h4 className="font-semibold text-indigo-700 mb-2">
                          Purpose
                        </h4>
                        <p className="text-sm text-gray-600">
                          {ritual.purpose}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-purple-700 mb-2">
                          Procedure
                        </h4>
                        <p className="text-sm text-gray-600">
                          {ritual.procedure}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-green-700 mb-2">
                          Benefits
                        </h4>
                        <p className="text-sm text-gray-600">
                          {ritual.benefits}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Tools */}
          <div className="mt-20">
            <Card className="bg-gradient-to-r from-rose-600 to-purple-600 text-white shadow-xl border-0">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4">
                    Identify Your Doshas
                  </h2>
                  <p className="text-xl text-rose-100 max-w-2xl mx-auto">
                    Use our advanced tools to detect doshas in your birth chart
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <Link href="/dosham-detector">
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all cursor-pointer group">
                      <CardContent className="p-6 text-center">
                        <Search className="h-12 w-12 text-yellow-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                        <h3 className="text-lg font-semibold mb-2">
                          Dosha Detector
                        </h3>
                        <p className="text-sm text-rose-100">
                          Comprehensive dosha analysis
                        </p>
                      </CardContent>
                    </Card>
                  </Link>

                  <Link href="/kundli">
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all cursor-pointer group">
                      <CardContent className="p-6 text-center">
                        <Star className="h-12 w-12 text-purple-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                        <h3 className="text-lg font-semibold mb-2">
                          Birth Chart
                        </h3>
                        <p className="text-sm text-rose-100">
                          See planetary positions
                        </p>
                      </CardContent>
                    </Card>
                  </Link>

                  <Link href="/premium-report">
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all cursor-pointer group">
                      <CardContent className="p-6 text-center">
                        <Crown className="h-12 w-12 text-amber-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                        <h3 className="text-lg font-semibold mb-2">
                          Remedy Report
                        </h3>
                        <p className="text-sm text-rose-100">
                          Personalized solutions
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
