import { motion } from "framer-motion";
import {
  Calendar,
  Star,
  Heart,
  Crown,
  Sun,
  Moon,
  Zap,
  Gift,
} from "lucide-react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { Button } from "src/components/ui/button";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";

export default function Festivals2025() {
  const majorFestivals = [
    {
      name: "Makar Sankranti",
      date: "January 14, 2025",
      significance: "Sun enters Capricorn, harvest festival",
      rituals: ["Kite flying", "Til-gul distribution", "Holy bath"],
      astrological: "Sun's transition brings new energy and prosperity",
      color: "from-yellow-400 to-orange-500",
      icon: Sun,
    },
    {
      name: "Maha Shivratri",
      date: "February 26, 2025",
      significance: "Great night of Lord Shiva",
      rituals: ["Night vigil", "Shiva puja", "Fasting"],
      astrological: "Powerful spiritual energy for meditation and prayers",
      color: "from-blue-400 to-purple-500",
      icon: Moon,
    },
    {
      name: "Holi",
      date: "March 14, 2025",
      significance: "Festival of colors and love",
      rituals: ["Color play", "Bonfire", "Sweets sharing"],
      astrological: "Spring equinox brings joy and new relationships",
      color: "from-pink-400 to-red-500",
      icon: Heart,
    },
    {
      name: "Navratri",
      date: "September 22 - October 1, 2025",
      significance: "Nine nights of Divine Mother",
      rituals: ["Durga puja", "Fasting", "Dance ceremonies"],
      astrological: "Powerful time for spiritual transformation",
      color: "from-orange-400 to-red-500",
      icon: Crown,
    },
    {
      name: "Diwali",
      date: "October 20, 2025",
      significance: "Festival of lights",
      rituals: ["Lakshmi puja", "Lighting diyas", "Fireworks"],
      astrological: "New moon brings wealth and prosperity",
      color: "from-yellow-400 to-orange-500",
      icon: Star,
    },
    {
      name: "Karva Chauth",
      date: "October 16, 2025",
      significance: "Wives fast for husband's longevity",
      rituals: ["Moon sighting", "Fasting", "Prayers"],
      astrological: "Strengthens marital bonds and love",
      color: "from-purple-400 to-pink-500",
      icon: Heart,
    },
  ];

  const monthlyFestivals = [
    {
      month: "January",
      festivals: [
        { name: "Makar Sankranti", date: "14th", type: "Solar" },
        { name: "Vasant Panchami", date: "22nd", type: "Knowledge" },
        { name: "Thaipusam", date: "23rd", type: "Devotion" },
      ],
    },
    {
      month: "February",
      festivals: [
        { name: "Maha Shivratri", date: "26th", type: "Spiritual" },
        { name: "Magha Purnima", date: "12th", type: "Purification" },
        { name: "Ratha Saptami", date: "5th", type: "Solar" },
      ],
    },
    {
      month: "March",
      festivals: [
        { name: "Holi", date: "14th", type: "Joy" },
        { name: "Ugadi", date: "30th", type: "New Year" },
        { name: "Chaitra Navratri", date: "22nd-30th", type: "Devotion" },
      ],
    },
    {
      month: "April",
      festivals: [
        { name: "Ram Navami", date: "6th", type: "Devotion" },
        { name: "Hanuman Jayanti", date: "13th", type: "Strength" },
        { name: "Gudi Padwa", date: "30th", type: "New Year" },
      ],
    },
    {
      month: "May",
      festivals: [
        { name: "Akshaya Tritiya", date: "10th", type: "Prosperity" },
        { name: "Buddha Purnima", date: "12th", type: "Enlightenment" },
        { name: "Ganga Dussehra", date: "6th", type: "Purification" },
      ],
    },
    {
      month: "June",
      festivals: [
        { name: "Rath Yatra", date: "29th", type: "Devotion" },
        { name: "Vat Purnima", date: "11th", type: "Marital" },
        { name: "Nirjala Ekadashi", date: "8th", type: "Fasting" },
      ],
    },
    {
      month: "July",
      festivals: [
        { name: "Guru Purnima", date: "13th", type: "Gratitude" },
        { name: "Hariyali Teej", date: "18th", type: "Monsoon" },
        { name: "Nag Panchami", date: "9th", type: "Serpent" },
      ],
    },
    {
      month: "August",
      festivals: [
        { name: "Raksha Bandhan", date: "9th", type: "Sibling" },
        { name: "Krishna Janmashtami", date: "16th", type: "Devotion" },
        { name: "Hartalika Teej", date: "30th", type: "Marital" },
      ],
    },
    {
      month: "September",
      festivals: [
        {
          name: "Ganesh Chaturthi",
          date: "29th",
          type: "Removal of Obstacles",
        },
        { name: "Pitru Paksha", date: "16th-30th", type: "Ancestral" },
        { name: "Navratri Begins", date: "22nd", type: "Divine Mother" },
      ],
    },
    {
      month: "October",
      festivals: [
        { name: "Dussehra", date: "2nd", type: "Victory" },
        { name: "Karva Chauth", date: "16th", type: "Marital" },
        { name: "Diwali", date: "20th", type: "Light" },
      ],
    },
    {
      month: "November",
      festivals: [
        { name: "Bhai Dooj", date: "3rd", type: "Sibling" },
        { name: "Govardhan Puja", date: "21st", type: "Gratitude" },
        { name: "Tulsi Vivah", date: "12th", type: "Devotion" },
      ],
    },
    {
      month: "December",
      festivals: [
        { name: "Dhanu Sankranti", date: "15th", type: "Solar" },
        { name: "Dattatreya Jayanti", date: "14th", type: "Spiritual" },
        { name: "Margashirsha Purnima", date: "15th", type: "Purification" },
      ],
    },
  ];

  const auspiciousPeriods = [
    {
      name: "Shubh Muhurat Days",
      description: "Most auspicious days for new beginnings",
      dates: ["Jan 14", "Mar 30", "May 10", "Oct 20", "Nov 12"],
      purpose: "Weddings, business launch, property purchase",
      color: "from-green-400 to-teal-500",
    },
    {
      name: "Ekadashi Dates",
      description: "Spiritual fasting days for purification",
      dates: ["11th of each lunar month", "Special: Nirjala Ekadashi"],
      purpose: "Spiritual growth, meditation, prayers",
      color: "from-blue-400 to-purple-500",
    },
    {
      name: "Purnima (Full Moon)",
      description: "Monthly full moon for maximum spiritual energy",
      dates: ["Monthly on full moon night", "Special: Guru Purnima"],
      purpose: "Meditation, prayers, spiritual practices",
      color: "from-yellow-400 to-orange-500",
    },
    {
      name: "Amavasya (New Moon)",
      description: "Monthly new moon for introspection",
      dates: ["Monthly on new moon night", "Special: Diwali Amavasya"],
      purpose: "Ancestor worship, new beginnings, reflection",
      color: "from-purple-400 to-indigo-500",
    },
  ];

  return (
    <>
      <AstroTickHeader />
      <main className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50">
        {/* Hero Section */}
        <section className="relative py-20 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-red-600 to-pink-600">
                2025
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-800">
                Festival Calendar
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto">
                Complete guide to Hindu festivals, auspicious dates, and
                spiritual celebrations in 2025. Plan your year with authentic
                festival timings and muhurat guidance.
              </p>

              {/* Animated Festival Icons */}
              <div className="flex justify-center space-x-6 mb-8">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white"
                >
                  <Star className="w-8 h-8" />
                </motion.div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-white"
                >
                  <Crown className="w-8 h-8" />
                </motion.div>
                <motion.div
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center text-white"
                >
                  <Gift className="w-8 h-8" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Major Festivals */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4 text-gray-800">
                Major Festivals 2025
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                The most significant Hindu festivals with dates, rituals, and
                astrological significance
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {majorFestivals.map((festival, index) => (
                <motion.div
                  key={festival.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 border-2 hover:border-orange-300 group">
                    <CardHeader className="text-center">
                      <div
                        className={`w-16 h-16 rounded-full bg-gradient-to-br ${festival.color} flex items-center justify-center text-white mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}
                      >
                        <festival.icon className="w-8 h-8" />
                      </div>
                      <CardTitle className="text-xl font-bold text-gray-800">
                        {festival.name}
                      </CardTitle>
                      <p className="text-sm text-orange-600 font-semibold">
                        {festival.date}
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-gray-700 font-medium">
                        {festival.significance}
                      </p>

                      <div>
                        <h4 className="font-semibold text-purple-600 mb-2">
                          🎯 Rituals:
                        </h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {festival.rituals.map((ritual, i) => (
                            <li key={i} className="flex items-center">
                              <Star className="w-3 h-3 text-yellow-400 mr-2" />
                              {ritual}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-orange-50 p-3 rounded-lg">
                        <h4 className="font-semibold text-orange-600 mb-1">
                          ✨ Astrological Significance:
                        </h4>
                        <p className="text-sm text-orange-800">
                          {festival.astrological}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Monthly Festival Calendar */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4 text-gray-800">
                Monthly Festival Calendar
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Complete month-wise festival guide for 2025
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {monthlyFestivals.map((month, index) => (
                <motion.div
                  key={month.month}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 border-2 hover:border-orange-300">
                    <CardHeader className="text-center">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center text-white font-bold text-sm mb-3 mx-auto">
                        {month.month.slice(0, 3)}
                      </div>
                      <CardTitle className="text-lg font-bold text-gray-800">
                        {month.month}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {month.festivals.map((festival, i) => (
                        <div key={i} className="bg-orange-50 p-2 rounded-lg">
                          <p className="text-sm font-semibold text-orange-800">
                            {festival.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            {festival.date} | {festival.type}
                          </p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Auspicious Periods */}
        <section className="py-16 px-4 bg-gradient-to-r from-orange-100 via-yellow-100 to-red-100">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4 text-gray-800">
                Auspicious Periods 2025
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Special spiritual periods and muhurat dates for important
                ceremonies
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {auspiciousPeriods.map((period, index) => (
                <motion.div
                  key={period.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 border-2 hover:border-orange-300 bg-white">
                    <CardHeader className="text-center">
                      <div
                        className={`w-16 h-16 rounded-full bg-gradient-to-br ${period.color} flex items-center justify-center text-white mb-4 mx-auto`}
                      >
                        <Calendar className="w-8 h-8" />
                      </div>
                      <CardTitle className="text-lg font-bold text-gray-800">
                        {period.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-gray-700">
                        {period.description}
                      </p>

                      <div>
                        <h4 className="font-semibold text-purple-600 mb-2">
                          📅 Key Dates:
                        </h4>
                        <div className="space-y-1">
                          {period.dates.map((date, i) => (
                            <span
                              key={i}
                              className="block text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded"
                            >
                              {date}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="bg-orange-50 p-3 rounded-lg">
                        <h4 className="font-semibold text-orange-600 mb-1">
                          🎯 Best For:
                        </h4>
                        <p className="text-sm text-orange-800">
                          {period.purpose}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold mb-6 text-white">
                Plan Your Sacred Year with Perfect Timing
              </h2>
              <p className="text-xl text-white mb-8 opacity-90">
                Get personalized muhurat timings and festival guidance for your
                important ceremonies
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/panchang">
                  <Button
                    size="lg"
                    className="bg-white text-orange-600 hover:bg-gray-100 font-bold px-8 py-4 text-lg"
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    Get Muhurat Timing
                  </Button>
                </Link>
                <Link href="/astrologers">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-orange-600 hover:bg-white hover:text-orange-600 font-bold px-8 py-4 text-lg"
                  >
                    Consult Astrologer
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
