import React from 'react';
import { Helmet } from 'react-helmet-async';
import AstroTickHeader from 'src/components/layout/AstroTickHeader';
import { Heart, Star, Calendar, Users, Gem, Sparkles, Crown, Shield, Gift, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from 'src/components/ui/card';
import { Badge } from 'src/components/ui/badge';
import { Button } from 'src/components/ui/button';
import { Link } from 'wouter';
import { motion } from 'framer-motion';

const MarriageAstrology: React.FC = () => {
  const marriageFacts = [
    {
      icon: Heart,
      title: "7th House Significance",
      description: "The 7th house governs marriage, partnerships, and life companion relationships in Vedic astrology",
      gradient: "from-pink-500 to-rose-500"
    },
    {
      icon: Star,
      title: "Venus & Jupiter Role",
      description: "Venus represents love and beauty while Jupiter signifies wisdom and marital bliss",
      gradient: "from-purple-500 to-indigo-500"
    },
    {
      icon: Calendar,
      title: "Muhurat Timing",
      description: "Selecting auspicious timing ensures divine blessings and harmonious married life",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Users,
      title: "Guna Milan Matching",
      description: "36-point compatibility system ensuring mental, physical, and spiritual harmony",
      gradient: "from-green-500 to-teal-500"
    }
  ];

  const marriageYogas = [
    {
      name: "Raja Yoga",
      description: "Combination of benefic planets creating royal matrimonial bliss",
      effect: "Prosperous & Happy Marriage",
      color: "text-yellow-600 bg-yellow-50"
    },
    {
      name: "Dhana Yoga", 
      description: "Wealth-bringing planetary positions for financial stability",
      effect: "Financial Prosperity in Marriage",
      color: "text-green-600 bg-green-50"
    },
    {
      name: "Kalatra Yoga",
      description: "Special combinations for ideal spouse and marital harmony",
      effect: "Perfect Life Partner",
      color: "text-pink-600 bg-pink-50"
    },
    {
      name: "Subha Yoga",
      description: "Auspicious planetary arrangements for blessed married life",
      effect: "Divine Blessings & Happiness",
      color: "text-purple-600 bg-purple-50"
    }
  ];

  const marriageChallenges = [
    {
      dosha: "Mangal Dosha",
      description: "Mars placement in certain houses can cause delays or challenges",
      remedy: "Mangal Dosha Nivaran Puja, Coral gemstone, Tuesday fasting",
      severity: "High"
    },
    {
      dosha: "Shani Dosha",
      description: "Saturn's influence can bring delays and testing periods",
      remedy: "Shani Shanti Puja, Blue Sapphire, Oil donations on Saturday",
      severity: "Moderate"
    },
    {
      dosha: "Kaal Sarp Dosha",
      description: "Rahu-Ketu axis affecting marital harmony and timing",
      remedy: "Kaal Sarp Shanti Puja, Rudraksha wearing, Mantra chanting",
      severity: "High"
    },
    {
      dosha: "Late Marriage Yoga",
      description: "Planetary combinations indicating delayed marriage",
      remedy: "Venus strengthening rituals, Swayamvara Parvati Vratha",
      severity: "Moderate"
    }
  ];

  const marriageTraditions = [
    "North Indian Wedding Customs",
    "South Indian Marriage Rituals", 
    "Bengali Wedding Traditions",
    "Punjabi Marriage Ceremonies",
    "Gujarati Wedding Customs",
    "Maharashtrian Marriage Rituals",
    "Tamil Wedding Traditions",
    "Telugu Marriage Ceremonies",
    "Kerala Wedding Customs",
    "Rajasthani Marriage Rituals",
    "Kashmiri Wedding Traditions",
    "Assamese Marriage Ceremonies"
  ];

  const astrologyServices = [
    {
      icon: Heart,
      title: "Marriage Compatibility Analysis",
      description: "Detailed horoscope matching for perfect life partner selection",
      features: ["36-point Guna Milan", "Mangal Dosha Check", "Dasha Period Analysis"],
      link: "/kundli-matching"
    },
    {
      icon: Calendar,
      title: "Wedding Muhurat Selection", 
      description: "Find the most auspicious timing for your wedding ceremony",
      features: ["Panchang Analysis", "Nakshatra Selection", "Tithi Calculation"],
      link: "/shubh-muhurat"
    },
    {
      icon: Crown,
      title: "Marriage Report",
      description: "Comprehensive analysis of marriage timing and life partner traits",
      features: ["Marriage Timing", "Spouse Characteristics", "Marital Happiness"],
      link: "/reports/marriage"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50">
      <Helmet>
        <title>Marriage in Vedic Astrology - Wedding Traditions & Compatibility | AstroTick</title>
        <meta name="description" content="Explore marriage astrology, wedding traditions, compatibility analysis, and Vedic rituals for a blessed married life. Complete guide to Indian wedding customs." />
        <meta name="keywords" content="marriage astrology, wedding astrology, guna milan, kundli matching, marriage compatibility, wedding muhurat, indian wedding traditions" />
      </Helmet>
      
      <AstroTickHeader />

      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-600/10 via-rose-500/10 to-red-500/10"></div>
        <div className="relative container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex justify-center items-center gap-3 mb-6"
            >
              <Heart className="h-12 w-12 text-pink-600" />
              <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 bg-clip-text text-transparent">
                Marriage in Vedic Astrology
              </h1>
              <Sparkles className="h-12 w-12 text-pink-600" />
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-700 mb-8 leading-relaxed"
            >
              Discover the divine science of marriage compatibility, wedding traditions, and astrological guidance 
              for a blessed and harmonious married life through authentic Vedic wisdom.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            >
              <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-pink-600">5000+</div>
                <div className="text-sm text-gray-600">Years of Tradition</div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-rose-600">36</div>
                <div className="text-sm text-gray-600">Guna Milan Points</div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-red-600">12</div>
                <div className="text-sm text-gray-600">Regional Traditions</div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-pink-600">7th</div>
                <div className="text-sm text-gray-600">House of Marriage</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Marriage Astrology Fundamentals */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Marriage Astrology Fundamentals</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Understanding the cosmic principles that govern marital harmony and compatibility
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {marriageFacts.map((fact, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <CardHeader className="text-center">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${fact.gradient} flex items-center justify-center mx-auto mb-4`}>
                      <fact.icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-lg">{fact.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-center">{fact.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Beneficial Marriage Yogas */}
      <section className="py-16 bg-gradient-to-r from-pink-50 to-rose-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Beneficial Marriage Yogas</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Auspicious planetary combinations that bless marriages with happiness, prosperity, and harmony
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {marriageYogas.map((yoga, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{yoga.name}</CardTitle>
                      <Badge variant="outline" className={yoga.color}>
                        Beneficial
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-gray-600">{yoga.description}</p>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium text-green-700">{yoga.effect}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Marriage Challenges & Remedies */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Marriage Challenges & Vedic Remedies</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Understanding common doshas affecting marriage and their traditional remedial measures
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {marriageChallenges.map((challenge, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl text-red-700">{challenge.dosha}</CardTitle>
                      <Badge variant={challenge.severity === "High" ? "destructive" : "secondary"}>
                        {challenge.severity}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600">{challenge.description}</p>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Shield className="h-4 w-4 text-green-600 mt-0.5" />
                        <div>
                          <div className="font-medium text-green-800 mb-1">Vedic Remedies:</div>
                          <p className="text-green-700 text-sm">{challenge.remedy}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Indian Wedding Traditions */}
      <section className="py-16 bg-gradient-to-r from-orange-50 to-yellow-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Indian Wedding Traditions</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Explore diverse regional wedding customs and ceremonies across India
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {marriageTraditions.map((tradition, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white/70 backdrop-blur-sm rounded-lg p-4 text-center hover:shadow-md transition-all duration-300 hover:scale-105"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Gift className="h-4 w-4 text-white" />
                </div>
                <p className="text-sm font-medium text-gray-800">{tradition}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Astrology Services */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Marriage Astrology Services</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Professional astrological guidance for your marriage journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {astrologyServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <service.icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600 text-center">{service.description}</p>
                    <div className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm text-gray-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Link href={service.link}>
                      <Button className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700">
                        Explore Service
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-pink-600 to-rose-600">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Begin Your Sacred Marriage Journey
            </h2>
            <p className="text-xl text-pink-100 mb-8">
              Let Vedic astrology guide you to a blessed and harmonious married life filled with love, prosperity, and divine blessings
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/kundli-matching">
                <Button size="lg" variant="secondary" className="bg-white text-pink-600 hover:bg-gray-100">
                  <Heart className="h-5 w-5 mr-2" />
                  Check Compatibility
                </Button>
              </Link>
              <Link href="/astrologers">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-pink-600">
                  <Clock className="h-5 w-5 mr-2" />
                  Consult Expert
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default MarriageAstrology;