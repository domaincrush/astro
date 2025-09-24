import { motion } from "framer-motion";
import { Star, Calendar, Heart, TrendingUp, Shield, Crown } from "lucide-react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { Button } from "src/components/ui/button";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";
import DeferredSection from "src/components/DeferredSection";
import LazyImage from "src/components/LazyImage";

export default function Horoscopes() {
  const zodiacSigns = [
    {
      name: "Aries",
      image: "Aries.jpg",
      sanskrit: "Mesha",
      dates: "21 Mar - 19 Apr",
      element: "Fire",
      ruling: "Mars",
      symbol: "♈",
      description: "Bold, energetic, and pioneering spirit",
      color: "from-red-400 to-orange-500",
    },
    {
      name: "Taurus",
      sanskrit: "Vrishabha",
      image: "Taurus.jpg",
      dates: "20 Apr - 20 May",
      element: "Earth",
      ruling: "Venus",
      symbol: "♉",
      description: "Stable, reliable, and luxury-loving",
      color: "from-green-400 to-teal-500",
    },
    {
      name: "Gemini",
      sanskrit: "Mithuna",
      image: "Gemini.jpg",
      dates: "21 May - 20 Jun",
      element: "Air",
      ruling: "Mercury",
      symbol: "♊",
      description: "Curious, adaptable, and communicative",
      color: "from-yellow-400 to-orange-500",
    },
    {
      name: "Cancer",
      sanskrit: "Karka",
      image: "Cancer.jpg",
      dates: "21 Jun - 22 Jul",
      element: "Water",
      ruling: "Moon",
      symbol: "♋",
      description: "Nurturing, emotional, and protective",
      color: "from-blue-400 to-purple-500",
    },
    {
      name: "Leo",
      sanskrit: "Simha",
      image: "Leo.jpg",
      dates: "23 Jul - 22 Aug",
      element: "Fire",
      ruling: "Sun",
      symbol: "♌",
      description: "Confident, generous, and dramatic",
      color: "from-orange-400 to-red-500",
    },
    {
      name: "Virgo",
      sanskrit: "Kanya",
      image: "Virgo.jpg",
      dates: "23 Aug - 22 Sep",
      element: "Earth",
      ruling: "Mercury",
      symbol: "♍",
      description: "Analytical, practical, and perfectionist",
      color: "from-green-400 to-blue-500",
    },
    {
      name: "Libra",
      sanskrit: "Tula",
      image: "Libra.jpg",
      dates: "23 Sep - 22 Oct",
      element: "Air",
      ruling: "Venus",
      symbol: "♎",
      description: "Balanced, harmonious, and diplomatic",
      color: "from-pink-400 to-purple-500",
    },
    {
      name: "Scorpio",
      sanskrit: "Vrishchika",
      image: "Scorpio.jpg",
      dates: "23 Oct - 21 Nov",
      element: "Water",
      ruling: "Mars",
      symbol: "♏",
      description: "Intense, mysterious, and transformative",
      color: "from-purple-400 to-red-500",
    },
    {
      name: "Sagittarius",
      sanskrit: "Dhanu",
      image: "Sagittarius.jpg",
      dates: "22 Nov - 21 Dec",
      element: "Fire",
      ruling: "Jupiter",
      symbol: "♐",
      description: "Adventurous, optimistic, and philosophical",
      color: "from-blue-400 to-green-500",
    },
    {
      name: "Capricorn",
      sanskrit: "Makara",
      image: "Capricorn.jpg",
      dates: "22 Dec - 19 Jan",
      element: "Earth",
      ruling: "Saturn",
      symbol: "♑",
      description: "Ambitious, disciplined, and responsible",
      color: "from-gray-400 to-blue-500",
    },
    {
      name: "Aquarius",
      sanskrit: "Kumbha",
      image: "Aquarius.jpg",
      dates: "20 Jan - 18 Feb",
      element: "Air",
      ruling: "Saturn",
      symbol: "♒",
      description: "Innovative, humanitarian, and independent",
      color: "from-cyan-400 to-blue-500",
    },
    {
      name: "Pisces",
      sanskrit: "Meena",
      image: "Pisces.jpg",
      dates: "19 Feb - 20 Mar",
      element: "Water",
      ruling: "Jupiter",
      symbol: "♓",
      description: "Intuitive, compassionate, and artistic",
      color: "from-purple-400 to-pink-500",
    },
  ];

  const horoscopeTypes = [
    {
      title: "Daily Horoscope",
      href: "/daily-horoscope",
      icon: Star,
      description: "Get fresh insights every day",
      color: "from-yellow-400 to-orange-500",
    },
    {
      title: "Weekly Horoscope",
      href: "/weekly-horoscope",
      icon: Calendar,
      description: "Plan your week with cosmic guidance",
      color: "from-blue-400 to-purple-500",
    },
    {
      title: "Monthly Horoscope",
      href: "/monthly-horoscope",
      icon: Calendar,
      description: "Monthly predictions and trends",
      color: "from-green-400 to-teal-500",
    },
    {
      title: "Love Horoscope",
      href: "/love-horoscope",
      icon: Heart,
      description: "Romance and relationship insights",
      color: "from-pink-400 to-red-500",
    },
    {
      title: "Career Horoscope",
      href: "/career-horoscope",
      icon: TrendingUp,
      description: "Professional growth predictions",
      color: "from-indigo-400 to-blue-500",
    },
    {
      title: "Health Horoscope",
      href: "/health-horoscope",
      icon: Shield,
      description: "Wellness and health guidance",
      color: "from-emerald-400 to-green-500",
    },
  ];

  return (
    <>
      <AstroTickHeader />
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Hero Section */}
        <section className="relative py-20 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Free Horoscopes
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Get your free horoscope and online horoscope predictions for all
                zodiac signs. Explore horoscope dates, daily horoscopes, and
                discover your cosmic destiny!
              </p>

              {/* Cosmic Animation */}
              <div className="relative w-32 h-32 mx-auto mb-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute inset-0 border-4 border-purple-300 rounded-full"
                >
                  <div className="w-4 h-4 bg-yellow-400 rounded-full absolute -top-2 left-1/2 transform -translate-x-1/2"></div>
                  <div className="w-3 h-3 bg-blue-400 rounded-full absolute -right-1 top-1/2 transform -translate-y-1/2"></div>
                  <div className="w-2 h-2 bg-pink-400 rounded-full absolute -bottom-1 left-1/2 transform -translate-x-1/2"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full absolute -left-1 top-1/2 transform -translate-y-1/2"></div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Zodiac Signs Grid */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4 text-gray-800">
                Choose Your Zodiac Sign
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Click on your zodiac sign to get personalized horoscope
                predictions
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {zodiacSigns.map((sign, index) => (
                <motion.div
                  key={sign.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                >
                  <Link href={`/daily-horoscope/${sign.name.toLowerCase()}`}>
                    <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer border-2 hover:border-orange-400">
                      <CardContent className="p-6 text-center">
                        <div
                          className={`w-16 h-16 rounded-full bg-gradient-to-br ${sign.color} flex items-center justify-center text-white text-3xl font-bold mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}
                        >
                          <img
                            src={`/api/zodiac-image/${sign.image}`}
                            alt={sign.name}
                            className="w-full h-full object-cover rounded-full"
                          />
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-gray-800">
                          {sign.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-1">
                          {sign.sanskrit}
                        </p>
                        <p className="text-sm text-orange-600 font-semibold mb-2">
                          {sign.dates}
                        </p>
                        <p className="text-xs text-gray-500">
                          {sign.description}
                        </p>
                        <div className="mt-3 flex justify-center space-x-4 text-xs">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {sign.element}
                          </span>
                          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                            {sign.ruling}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Horoscope Types */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4 text-gray-800">
                More Horoscopes for You
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Explore different types of horoscope readings for comprehensive
                guidance
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {horoscopeTypes.map((type, index) => (
                <motion.div
                  key={type.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                >
                  <Link href={type.href}>
                    <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer h-full">
                      <CardHeader className="text-center">
                        <div
                          className={`w-16 h-16 rounded-full bg-gradient-to-br ${type.color} flex items-center justify-center text-white mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}
                        >
                          <type.icon className="w-8 h-8" />
                        </div>
                        <CardTitle className="text-xl font-bold text-gray-800">
                          {type.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-center pb-6">
                        <p className="text-gray-600 mb-4">{type.description}</p>
                        <Button
                          variant="outline"
                          className="group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300"
                        >
                          Read Now
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* What is Horoscope Section */}
        <section className="py-16 px-4 bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-8 text-gray-800">
                What is a Horoscope?
              </h2>

              <div className="bg-white rounded-2xl shadow-xl p-8 text-left">
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  A horoscope is an astrological chart created based on the
                  positions of the Sun, Moon, and other celestial bodies at the
                  time of a person's birth. It provides insights into an
                  individual's personality, likes, dislikes, thoughts, love
                  life, career, health, and more.
                </p>

                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  Horoscopes offer a glimpse into future events and can be used
                  to make informed decisions. By reading your daily horoscope,
                  weekly horoscope, monthly horoscope, or yearly horoscope, you
                  can gain valuable insights into various aspects of your life.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div className="bg-blue-50 rounded-lg p-6">
                    <h3 className="text-xl font-bold mb-3 text-blue-800">
                      Western Astrology
                    </h3>
                    <p className="text-gray-700">
                      Uses tropical zodiac based on Sun's position at birth.
                      Focuses on personality traits and general predictions.
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-6">
                    <h3 className="text-xl font-bold mb-3 text-purple-800">
                      Vedic Astrology
                    </h3>
                    <p className="text-gray-700">
                      Uses sidereal zodiac with precise calculations. Creates
                      detailed Kundali (birth chart) for accurate predictions.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold mb-6 text-white">
                Ready to Discover Your Cosmic Destiny?
              </h2>
              <p className="text-xl text-white mb-8 opacity-90">
                Get personalized horoscope readings and astrological guidance
                from our expert astrologers
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/kundli">
                  <Button
                    size="lg"
                    className="bg-white text-purple-600 hover:bg-gray-100 font-bold px-8 py-4 text-lg hover:text-pink-500"
                  >
                    <Crown className="w-5 h-5 mr-2" />
                    Get Free Kundli
                  </Button>
                </Link>
                <Link href="/astrologers">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-purple-600 hover:bg-white hover:text-pink-600 font-bold px-8 py-4 text-lg"
                  >
                    Talk to Astrologer
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
