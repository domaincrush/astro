import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { Button } from "src/components/ui/button";
import { motion } from "framer-motion";
import { Gem, Star, Shield, Heart, TrendingUp, Sun, Moon, Eye, Crown, Sparkles, Target, Gift, ArrowRight, ChevronRight } from "lucide-react";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";

export default function Gemstones() {
  const [selectedGem, setSelectedGem] = useState<string | null>(null);

  const gemstones = [
    {
      name: "Ruby",
      planet: "Sun",
      color: "Red",
      benefits: ["Leadership", "Confidence", "Vitality", "Success"],
      chakra: "Root Chakra",
      zodiac: "Leo",
      price: "₹5,000 - ₹50,000",
      description: "The king of gemstones, ruby enhances leadership qualities and brings success in career and personal life.",
      wearingDay: "Sunday",
      metal: "Gold",
      finger: "Ring Finger",
      mantra: "Om Suryaya Namaha",
      icon: Sun,
      gradient: "from-red-500 to-pink-500"
    },
    {
      name: "Pearl",
      planet: "Moon",
      color: "White",
      benefits: ["Peace", "Emotional Balance", "Intuition", "Fertility"],
      chakra: "Sacral Chakra",
      zodiac: "Cancer",
      price: "₹2,000 - ₹20,000",
      description: "Pearl brings emotional stability, peace of mind, and enhances intuitive abilities.",
      wearingDay: "Monday",
      metal: "Silver",
      finger: "Little Finger",
      mantra: "Om Chandraya Namaha",
      icon: Moon,
      gradient: "from-gray-400 to-gray-600"
    },
    {
      name: "Emerald",
      planet: "Mercury",
      color: "Green",
      benefits: ["Intelligence", "Communication", "Learning", "Business"],
      chakra: "Heart Chakra",
      zodiac: "Gemini, Virgo",
      price: "₹3,000 - ₹30,000",
      description: "Emerald enhances intellectual abilities, communication skills, and business acumen.",
      wearingDay: "Wednesday",
      metal: "Gold/Silver",
      finger: "Little Finger",
      mantra: "Om Budhaya Namaha",
      icon: Eye,
      gradient: "from-green-500 to-emerald-500"
    },
    {
      name: "Yellow Sapphire",
      planet: "Jupiter",
      color: "Yellow",
      benefits: ["Wisdom", "Prosperity", "Spirituality", "Knowledge"],
      chakra: "Solar Plexus Chakra",
      zodiac: "Sagittarius, Pisces",
      price: "₹4,000 - ₹40,000",
      description: "Yellow sapphire brings wisdom, prosperity, and spiritual growth to the wearer.",
      wearingDay: "Thursday",
      metal: "Gold",
      finger: "Index Finger",
      mantra: "Om Brihaspataye Namaha",
      icon: Crown,
      gradient: "from-yellow-500 to-amber-500"
    },
    {
      name: "Diamond",
      planet: "Venus",
      color: "Colorless",
      benefits: ["Love", "Beauty", "Luxury", "Artistic Abilities"],
      chakra: "Crown Chakra",
      zodiac: "Taurus, Libra",
      price: "₹10,000 - ₹1,00,000",
      description: "Diamond enhances love, beauty, artistic abilities, and brings luxury to life.",
      wearingDay: "Friday",
      metal: "Platinum/White Gold",
      finger: "Middle Finger",
      mantra: "Om Shukraya Namaha",
      icon: Sparkles,
      gradient: "from-gray-200 to-gray-400"
    },
    {
      name: "Blue Sapphire",
      planet: "Saturn",
      color: "Blue",
      benefits: ["Discipline", "Focus", "Longevity", "Spiritual Growth"],
      chakra: "Throat Chakra",
      zodiac: "Capricorn, Aquarius",
      price: "₹6,000 - ₹60,000",
      description: "Blue sapphire brings discipline, focus, and helps overcome obstacles in life.",
      wearingDay: "Saturday",
      metal: "Silver/Iron",
      finger: "Middle Finger",
      mantra: "Om Shanaye Namaha",
      icon: Shield,
      gradient: "from-blue-500 to-indigo-500"
    },
    {
      name: "Hessonite",
      planet: "Rahu",
      color: "Honey/Brown",
      benefits: ["Confidence", "Success", "Overcoming Fear", "Material Gains"],
      chakra: "Solar Plexus Chakra",
      zodiac: "All Signs",
      price: "₹2,500 - ₹25,000",
      description: "Hessonite helps overcome Rahu's negative effects and brings success in ventures.",
      wearingDay: "Saturday",
      metal: "Silver/Panchdhatu",
      finger: "Middle Finger",
      mantra: "Om Rahave Namaha",
      icon: Target,
      gradient: "from-amber-600 to-orange-600"
    },
    {
      name: "Cat's Eye",
      planet: "Ketu",
      color: "Greenish-Yellow",
      benefits: ["Spirituality", "Psychic Powers", "Protection", "Detachment"],
      chakra: "Third Eye Chakra",
      zodiac: "All Signs",
      price: "₹3,000 - ₹30,000",
      description: "Cat's eye enhances spiritual awareness and provides protection from negative energies.",
      wearingDay: "Tuesday",
      metal: "Silver/Panchdhatu",
      finger: "Ring Finger",
      mantra: "Om Ketave Namaha",
      icon: Eye,
      gradient: "from-yellow-600 to-green-600"
    },
    {
      name: "Red Coral",
      planet: "Mars",
      color: "Red",
      benefits: ["Courage", "Energy", "Passion", "Overcoming Obstacles"],
      chakra: "Root Chakra",
      zodiac: "Aries, Scorpio",
      price: "₹1,500 - ₹15,000",
      description: "Red coral enhances courage, energy, and helps overcome obstacles and enemies.",
      wearingDay: "Tuesday",
      metal: "Gold/Copper",
      finger: "Ring Finger",
      mantra: "Om Angarakaya Namaha",
      icon: Heart,
      gradient: "from-red-600 to-red-800"
    }
  ];

  const gemstoneTypes = [
    {
      category: "Precious Stones",
      stones: ["Ruby", "Emerald", "Blue Sapphire", "Diamond"],
      description: "The most valuable and powerful gemstones"
    },
    {
      category: "Semi-Precious",
      stones: ["Yellow Sapphire", "Pearl", "Red Coral"],
      description: "Highly effective stones with moderate pricing"
    },
    {
      category: "Shadow Planets",
      stones: ["Hessonite", "Cat's Eye"],
      description: "Stones for Rahu and Ketu effects"
    }
  ];

  const gemstoneGuide = [
    {
      title: "Choosing Your Gemstone",
      steps: [
        "Consult an astrologer for birth chart analysis",
        "Identify weak or afflicted planets",
        "Choose appropriate gemstone for the planet",
        "Verify gemstone quality and authenticity",
        "Wear on the recommended day and time"
      ]
    },
    {
      title: "Wearing Guidelines",
      steps: [
        "Purify the stone before wearing",
        "Wear on the correct finger and metal",
        "Chant the planetary mantra",
        "Wear during auspicious time",
        "Maintain the gemstone properly"
      ]
    },
    {
      title: "Quality Factors",
      steps: [
        "Color: Vibrant and natural color",
        "Clarity: Minimal inclusions",
        "Cut: Proper cutting for maximum effect",
        "Carat: Appropriate weight for your body",
        "Certificate: Authentic gemological certificate"
      ]
    }
  ];

  const contraindications = [
    {
      gemstone: "Blue Sapphire",
      warning: "Can cause severe negative effects if not suitable",
      trial: "Wear for 3 days before permanent use"
    },
    {
      gemstone: "Diamond",
      warning: "Not suitable for all zodiac signs",
      trial: "Consult astrologer before wearing"
    },
    {
      gemstone: "Hessonite",
      warning: "May cause confusion if worn incorrectly",
      trial: "Start with small stone and observe effects"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50">
      <AstroTickHeader />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Gem className="h-8 w-8 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Gemstones & Crystals
            </h1>
            
            <p className="text-xl max-w-3xl mx-auto mb-8 text-purple-100">
              Discover the power of gemstones and their astrological significance. Learn about planetary gemstones, their benefits, and how to choose the right stone for your needs.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gemstones Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Planetary Gemstones
            </h2>
            <p className="text-xl text-gray-600">
              Nine powerful gemstones for nine planets in Vedic astrology
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gemstones.map((gem, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="cursor-pointer"
                onClick={() => setSelectedGem(selectedGem === gem.name ? null : gem.name)}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl">
                      <div className={`w-10 h-10 bg-gradient-to-r ${gem.gradient} rounded-full flex items-center justify-center mr-3`}>
                        <gem.icon className="h-5 w-5 text-white" />
                      </div>
                      {gem.name}
                    </CardTitle>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">Planet: {gem.planet}</p>
                      <p className="text-sm text-gray-600">Color: {gem.color}</p>
                      <p className="text-sm text-gray-600">Zodiac: {gem.zodiac}</p>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-gray-700">{gem.description}</p>
                      <div>
                        <h4 className="font-semibold text-purple-700 mb-1">Benefits:</h4>
                        <div className="flex flex-wrap gap-1">
                          {gem.benefits.map((benefit, idx) => (
                            <span key={idx} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                              {benefit}
                            </span>
                          ))}
                        </div>
                      </div>
                      {selectedGem === gem.name && (
                        <div className="border-t pt-3 space-y-2">
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="font-semibold">Day:</span> {gem.wearingDay}
                            </div>
                            <div>
                              <span className="font-semibold">Metal:</span> {gem.metal}
                            </div>
                            <div>
                              <span className="font-semibold">Finger:</span> {gem.finger}
                            </div>
                            <div>
                              <span className="font-semibold">Chakra:</span> {gem.chakra}
                            </div>
                          </div>
                          <div>
                            <span className="font-semibold text-xs">Mantra:</span>
                            <p className="text-xs text-gray-600 italic">{gem.mantra}</p>
                          </div>
                          <div>
                            <span className="font-semibold text-xs">Price Range:</span>
                            <p className="text-xs text-green-600">{gem.price}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gemstone Categories */}
      <section className="py-16 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Gemstone Categories
            </h2>
            <p className="text-xl text-gray-600">
              Understanding different types of gemstones and their classifications
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {gemstoneTypes.map((type, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full text-center">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Gem className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{type.category}</h3>
                    <p className="text-gray-600 mb-4">{type.description}</p>
                    <div className="space-y-1">
                      {type.stones.map((stone, idx) => (
                        <div key={idx} className="text-sm bg-purple-100 text-purple-700 px-2 py-1 rounded inline-block mr-1">
                          {stone}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gemstone Guide */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Gemstone Selection Guide
            </h2>
            <p className="text-xl text-gray-600">
              Step-by-step guide to choosing and wearing gemstones
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {gemstoneGuide.map((guide, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-lg text-purple-700">{guide.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {guide.steps.map((step, idx) => (
                        <div key={idx} className="flex items-start">
                          <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs mr-3 mt-0.5 flex-shrink-0">
                            {idx + 1}
                          </div>
                          <span className="text-sm text-gray-700">{step}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contraindications */}
      <section className="py-16 bg-gradient-to-r from-red-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Important Warnings
            </h2>
            <p className="text-xl text-gray-600">
              Gemstones that require special care and consultation
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contraindications.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full border-red-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-red-700 flex items-center">
                      <Shield className="h-5 w-5 mr-2" />
                      {item.gemstone}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="bg-red-100 p-3 rounded-lg">
                        <h4 className="font-semibold text-red-700 mb-1">Warning:</h4>
                        <p className="text-sm text-red-600">{item.warning}</p>
                      </div>
                      <div className="bg-yellow-100 p-3 rounded-lg">
                        <h4 className="font-semibold text-yellow-700 mb-1">Recommendation:</h4>
                        <p className="text-sm text-yellow-600">{item.trial}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Find Your Perfect Gemstone
          </h2>
          <p className="text-xl mb-8">
            Get personalized gemstone recommendations based on your birth chart
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-purple-600 px-8 py-3 text-lg">
              <Star className="mr-2 h-5 w-5" />
              Get Consultation
            </Button>
            <Button variant="outline" className="border-white text-white px-8 py-3 text-lg">
              <Gem className="mr-2 h-5 w-5" />
              Shop Gemstones
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}