import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { Badge } from "src/components/ui/badge";
import { Button } from "src/components/ui/button";
import {
  Clock,
  Calendar,
  Star,
  Sun,
  Moon,
  Heart,
  Home,
  Briefcase,
  BookOpen,
  Target,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Sparkles,
  Crown,
  Gem,
  Play,
  Search,
} from "lucide-react";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";
import { Link } from "wouter";

export default function MuhurtaTiming() {
  const [activeTab, setActiveTab] = useState("basics");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const auspiciousTimes = [
    {
      name: "Brahma Muhurta",
      time: "1.5 hours before sunrise",
      purpose: "Meditation, spiritual practices",
      benefits: "Maximum spiritual energy, clear mind",
      icon: Crown,
      color: "from-purple-500 to-indigo-600",
    },
    {
      name: "Abhijit Muhurta",
      time: "Midday (11:48 AM - 12:36 PM)",
      purpose: "Important decisions, starting new ventures",
      benefits: "Success in all endeavors, victory",
      icon: Sun,
      color: "from-yellow-500 to-orange-600",
    },
    {
      name: "Godhuli Muhurta",
      time: "Sunset time",
      purpose: "Worship, family time, reflection",
      benefits: "Peace, harmony, spiritual growth",
      icon: Moon,
      color: "from-pink-500 to-rose-600",
    },
    {
      name: "Vijaya Muhurta",
      time: "2:24 PM - 3:12 PM",
      purpose: "Victory-related activities, competitions",
      benefits: "Success, triumph, achievement",
      icon: Target,
      color: "from-green-500 to-emerald-600",
    },
  ];

  const inauspiciousTimes = [
    {
      name: "Rahu Kaal",
      duration: "1.5 hours daily",
      timing: "Different for each day",
      avoid: "New ventures, travel, important decisions",
      description: "Time ruled by shadow planet Rahu",
      severity: "High",
    },
    {
      name: "Yamaganda",
      duration: "1.5 hours daily",
      timing: "Different for each day",
      avoid: "Auspicious ceremonies, marriage proposals",
      description: "Time associated with obstacles",
      severity: "Medium",
    },
    {
      name: "Gulikai",
      duration: "1.5 hours daily",
      timing: "Different for each day",
      avoid: "Health-related activities, medical procedures",
      description: "Time ruled by Saturn's influence",
      severity: "Medium",
    },
    {
      name: "Dur Muhurta",
      duration: "Various short periods",
      timing: "Calculated based on sunrise",
      avoid: "All auspicious activities",
      description: "Inauspicious micro-periods",
      severity: "Low",
    },
  ];

  const eventMuhurtas = [
    {
      event: "Marriage",
      icon: Heart,
      factors: [
        "Bride and groom's birth charts",
        "Auspicious nakshatras",
        "Strong Venus and Jupiter",
        "Avoid malefic planets",
      ],
      bestMonths: ["Nov-Dec", "Jan-Feb", "Apr-May"],
      avoid: ["Malmas", "Eclipse periods", "Pitra Paksha"],
    },
    {
      event: "Griha Pravesh",
      icon: Home,
      factors: [
        "Strong ascendant",
        "Benefic planets in 1st, 4th, 7th, 10th houses",
        "Avoid Mars and Saturn influence",
        "Auspicious tithi and nakshatra",
      ],
      bestMonths: ["Mar-Apr", "Sep-Oct", "Nov-Dec"],
      avoid: ["Bhadra periods", "Malefic transits"],
    },
    {
      event: "Business Launch",
      icon: Briefcase,
      factors: [
        "Strong 10th house",
        "Benefic Jupiter and Mercury",
        "Auspicious day of week",
        "Favorable planetary transits",
      ],
      bestMonths: ["Jan-Feb", "Apr-May", "Sep-Oct"],
      avoid: ["Retrograde periods", "Eclipse seasons"],
    },
    {
      event: "Education Start",
      icon: BookOpen,
      factors: [
        "Strong 5th house",
        "Benefic Mercury and Jupiter",
        "Auspicious nakshatra",
        "Avoid malefic influences",
      ],
      bestMonths: ["Jun-Jul", "Mar-Apr", "Oct-Nov"],
      avoid: ["Guru Chandal", "Mercury retrograde"],
    },
  ];

  const panchang = [
    {
      element: "Tithi",
      description: "Lunar day based on Moon's phase",
      count: 30,
      significance: "Determines auspiciousness of day",
      auspicious: [
        "Pratipada",
        "Tritiya",
        "Panchami",
        "Saptami",
        "Dashami",
        "Ekadashi",
      ],
      inauspicious: ["Chaturthi", "Navami", "Chaturdashi", "Amavasya"],
    },
    {
      element: "Nakshatra",
      description: "Lunar mansion where Moon is placed",
      count: 27,
      significance: "Affects quality of activities",
      auspicious: [
        "Rohini",
        "Mrigashira",
        "Pushya",
        "Hasta",
        "Swati",
        "Anuradha",
      ],
      inauspicious: [
        "Bharani",
        "Ardra",
        "Ashlesha",
        "Magha",
        "Jyeshtha",
        "Moola",
      ],
    },
    {
      element: "Yoga",
      description: "Combination of Sun and Moon positions",
      count: 27,
      significance: "Enhances or reduces activity success",
      auspicious: [
        "Vishkumbha",
        "Dhruva",
        "Vyaghata",
        "Harshana",
        "Vajra",
        "Siddhi",
      ],
      inauspicious: [
        "Vyatipata",
        "Vaidhriti",
        "Parigha",
        "Shiva",
        "Ganda",
        "Visha",
      ],
    },
    {
      element: "Karana",
      description: "Half of a tithi period",
      count: 11,
      significance: "Affects timing of activities",
      auspicious: ["Bava", "Balava", "Kaulava", "Taitila", "Gara", "Vanija"],
      inauspicious: ["Vishti", "Shakuni", "Chatushpada", "Naga", "Kimstughna"],
    },
    {
      element: "Vara",
      description: "Day of the week",
      count: 7,
      significance: "Planetary ruler influences activities",
      auspicious: ["Sunday (Sun)", "Thursday (Jupiter)", "Friday (Venus)"],
      inauspicious: ["Tuesday (Mars)", "Saturday (Saturn)"],
    },
  ];

  const muhurtaCalculation = [
    {
      step: 1,
      title: "Analyze Birth Chart",
      description:
        "Study the native's birth chart for planetary positions and strengths",
      factors: ["Ascendant lord", "Planetary periods", "Transit influences"],
    },
    {
      step: 2,
      title: "Check Panchang",
      description:
        "Verify all five elements are favorable for the intended activity",
      factors: ["Tithi compatibility", "Nakshatra suitability", "Yoga effects"],
    },
    {
      step: 3,
      title: "Avoid Inauspicious Times",
      description:
        "Ensure the time doesn't fall in Rahu Kaal or other negative periods",
      factors: ["Rahu Kaal", "Yamaganda", "Gulikai", "Dur Muhurta"],
    },
    {
      step: 4,
      title: "Select Optimal Window",
      description: "Choose the most auspicious time within available options",
      factors: [
        "Lagna strength",
        "Planetary aspects",
        "Seasonal considerations",
      ],
    },
  ];

  return (
    <>
      <Helmet>
        <title>
          Muhurta (Timing) - Auspicious Time Selection in Vedic Astrology |
          AstroTick
        </title>
        <meta
          name="description"
          content="Master the art of Muhurta - selecting auspicious times for important life events like marriage, business, and ceremonies using Vedic astrology principles."
        />
        <meta
          name="keywords"
          content="Muhurta, auspicious timing, Vedic astrology, marriage muhurta, business timing, Panchang, Rahu Kaal, electional astrology"
        />
        <meta
          property="og:title"
          content="Muhurta (Timing) - Auspicious Time Selection in Vedic Astrology"
        />
        <meta
          property="og:description"
          content="Master the art of Muhurta - selecting auspicious times for important life events using Vedic astrology principles."
        />
        <meta property="og:type" content="article" />
        <link
          rel="canonical"
          href="https://astrotick.com/learn-astrology/muhurta"
        />
      </Helmet>

      <AstroTickHeader />

      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-amber-900 via-orange-900 to-red-900">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-1000"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <Clock className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-amber-400 to-red-500 rounded-full animate-pulse">
                    <Calendar className="h-3 w-3 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
                Muhurta{" "}
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  (Timing)
                </span>
              </h1>

              <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto animate-fade-in-delay">
                Master the ancient art of selecting auspicious times for life's
                most important moments through precise Vedic timing
                calculations.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/panchang">
                  <Button className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white px-8 py-3 text-lg flex items-center gap-2 animate-bounce-subtle">
                    <Calendar className="h-5 w-5" />
                    Check Today's Panchang
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="border-white text-orange-500 hover:bg-white hover:text-orange-900 px-8 py-3 text-lg"
                  onClick={() => setActiveTab("events")}
                >
                  <Clock className="h-5 w-5 mr-2" />
                  Event Timing
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
                  variant={activeTab === "basics" ? "default" : "ghost"}
                  onClick={() => setActiveTab("basics")}
                  className="flex items-center gap-2"
                >
                  <Clock className="h-4 w-4" />
                  Time Basics
                </Button>
                <Button
                  variant={activeTab === "panchang" ? "default" : "ghost"}
                  onClick={() => setActiveTab("panchang")}
                  className="flex items-center gap-2"
                >
                  <Calendar className="h-4 w-4 " />
                  Panchang
                </Button>
                <Button
                  variant={activeTab === "events" ? "default" : "ghost"}
                  onClick={() => setActiveTab("events")}
                  className="flex items-center gap-2"
                >
                  <Heart className="h-4 w-4" />
                  Event Timing
                </Button>
                <Button
                  variant={activeTab === "calculation" ? "default" : "ghost"}
                  onClick={() => setActiveTab("calculation")}
                  className="flex items-center gap-2"
                >
                  <Target className="h-4 w-4" />
                  Calculation
                </Button>
              </div>
            </div>
          </div>

          {/* Time Basics Tab */}
          {activeTab === "basics" && (
            <div className="space-y-12">
              {/* Auspicious Times */}
              <div>
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">
                    Daily Auspicious Times
                  </h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Natural cycles that enhance success and spiritual growth
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {auspiciousTimes.map((time, index) => (
                    <Card
                      key={index}
                      className="bg-white/90 backdrop-blur-sm shadow-xl border-0 overflow-hidden group hover:shadow-2xl transition-all duration-300"
                    >
                      <CardHeader
                        className={`bg-gradient-to-r ${time.color} text-white`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                            <time.icon className="h-6 w-6" />
                          </div>
                          <div>
                            <CardTitle className="text-xl">
                              {time.name}
                            </CardTitle>
                            <p className="text-sm opacity-90">{time.time}</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6 space-y-4">
                        <div>
                          <h4 className="font-semibold text-green-700 mb-2">
                            Best For
                          </h4>
                          <p className="text-sm text-gray-700">
                            {time.purpose}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-blue-700 mb-2">
                            Benefits
                          </h4>
                          <p className="text-sm text-gray-600">
                            {time.benefits}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Inauspicious Times */}
              <div>
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">
                    Times to Avoid
                  </h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Periods with challenging energies that may hinder success
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {inauspiciousTimes.map((time, index) => (
                    <Card
                      key={index}
                      className="bg-white/90 backdrop-blur-sm shadow-xl border-0 overflow-hidden group hover:shadow-2xl transition-all duration-300"
                    >
                      <CardHeader className="bg-gradient-to-r from-red-600 to-orange-600 text-white">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                              <AlertTriangle className="h-6 w-6" />
                            </div>
                            <div>
                              <CardTitle className="text-xl">
                                {time.name}
                              </CardTitle>
                              <p className="text-sm opacity-90">
                                {time.duration}
                              </p>
                            </div>
                          </div>
                          <Badge className="bg-white/20 text-white border-white/30">
                            {time.severity}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6 space-y-4">
                        <div>
                          <h4 className="font-semibold text-red-700 mb-2">
                            Avoid
                          </h4>
                          <p className="text-sm text-gray-700">{time.avoid}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-orange-700 mb-2">
                            Description
                          </h4>
                          <p className="text-sm text-gray-600">
                            {time.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Panchang Tab */}
          {activeTab === "panchang" && (
            <div className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Panchang Elements
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  The five pillars of Vedic time calculation
                </p>
              </div>

              <div className="space-y-6">
                {panchang.map((element, index) => (
                  <Card
                    key={index}
                    className="bg-white/90 backdrop-blur-sm shadow-xl border-0 overflow-hidden group hover:shadow-2xl transition-all duration-300"
                  >
                    <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                            <Calendar className="h-6 w-6" />
                          </div>
                          <div>
                            <CardTitle className="text-xl">
                              {element.element}
                            </CardTitle>
                            <p className="text-sm opacity-90">
                              {element.description}
                            </p>
                          </div>
                        </div>
                        <Badge className="bg-white/20 text-white border-white/30">
                          {element.count} Types
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <div>
                        <h4 className="font-semibold text-indigo-700 mb-2">
                          Significance
                        </h4>
                        <p className="text-sm text-gray-700">
                          {element.significance}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            Auspicious
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {element.auspicious.map((item, i) => (
                              <Badge
                                key={i}
                                className="bg-green-100 text-green-800 text-xs"
                              >
                                {item}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-red-700 mb-2 flex items-center gap-2">
                            <XCircle className="h-4 w-4" />
                            Inauspicious
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {element.inauspicious.map((item, i) => (
                              <Badge
                                key={i}
                                className="bg-red-100 text-red-800 text-xs"
                              >
                                {item}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Events Tab */}
          {activeTab === "events" && (
            <div className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Event-Specific Timing
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Specialized muhurta considerations for life's important events
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {eventMuhurtas.map((event, index) => (
                  <Card
                    key={index}
                    className="bg-white/90 backdrop-blur-sm shadow-xl border-0 overflow-hidden group hover:shadow-2xl transition-all duration-300"
                  >
                    <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                          <event.icon className="h-6 w-6" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">
                            {event.event}
                          </CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <div>
                        <h4 className="font-semibold text-purple-700 mb-2">
                          Key Factors
                        </h4>
                        <ul className="space-y-1">
                          {event.factors.map((factor, i) => (
                            <li
                              key={i}
                              className="text-sm text-gray-600 flex items-center gap-2"
                            >
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              {factor}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-green-700 mb-2">
                            Best Months
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {event.bestMonths.map((month, i) => (
                              <Badge
                                key={i}
                                className="bg-green-100 text-green-800 text-xs"
                              >
                                {month}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-red-700 mb-2">
                            Avoid
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {event.avoid.map((item, i) => (
                              <Badge
                                key={i}
                                className="bg-red-100 text-red-800 text-xs"
                              >
                                {item}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Calculation Tab */}
          {activeTab === "calculation" && (
            <div className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Muhurta Calculation Process
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Step-by-step approach to selecting the perfect timing
                </p>
              </div>

              <div className="space-y-6">
                {muhurtaCalculation.map((step, index) => (
                  <Card
                    key={index}
                    className="bg-white/90 backdrop-blur-sm shadow-xl border-0 overflow-hidden group hover:shadow-2xl transition-all duration-300"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform">
                          {step.step}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {step.title}
                          </h3>
                          <p className="text-gray-700 mb-4">
                            {step.description}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {step.factors.map((factor, i) => (
                              <Badge
                                key={i}
                                variant="secondary"
                                className="text-xs"
                              >
                                {factor}
                              </Badge>
                            ))}
                          </div>
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
            <Card className="bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-xl border-0">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4">
                    Find Auspicious Times
                  </h2>
                  <p className="text-xl text-amber-100 max-w-2xl mx-auto">
                    Use our tools to discover the best timing for your important
                    events
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <Link href="/panchang">
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all cursor-pointer group">
                      <CardContent className="p-6 text-center">
                        <Calendar className="h-12 w-12 text-yellow-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                        <h3 className="text-lg font-semibold mb-2">
                          Daily Panchang
                        </h3>
                        <p className="text-sm text-amber-100">
                          Check today's auspicious times
                        </p>
                      </CardContent>
                    </Card>
                  </Link>

                  <Link href="/kundli">
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all cursor-pointer group">
                      <CardContent className="p-6 text-center">
                        <Star className="h-12 w-12 text-orange-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                        <h3 className="text-lg font-semibold mb-2">
                          Birth Chart
                        </h3>
                        <p className="text-sm text-amber-100">
                          Analyze your planetary periods
                        </p>
                      </CardContent>
                    </Card>
                  </Link>

                  <Link href="/premium-report">
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all cursor-pointer group">
                      <CardContent className="p-6 text-center">
                        <Crown className="h-12 w-12 text-red-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                        <h3 className="text-lg font-semibold mb-2">
                          Muhurta Report
                        </h3>
                        <p className="text-sm text-amber-100">
                          Personalized timing guidance
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
