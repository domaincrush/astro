import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from 'src/components/ui/card';
import { Badge } from 'src/components/ui/badge';
import { Button } from 'src/components/ui/button';
import { Heart, Moon, Clock, Calendar, Star, Gift, Sparkles, Crown } from 'lucide-react';
import AstroTickHeader from 'src/components/layout/AstroTickHeader';
import Footer from 'src/components/layout/Footer';
import { Link } from 'wouter';

const KarvaChauth2025 = () => {
  const karvaChouthFeatures = [
    {
      icon: Heart,
      title: "Marital Devotion",
      description: "Sacred fast observed by married women for their husband's long life and prosperity",
      color: "from-red-500 to-pink-500"
    },
    {
      icon: Moon,
      title: "Moonrise Timing",
      description: "Complete the fast only after sighting the moon and performing traditional rituals",
      color: "from-blue-500 to-indigo-500"
    },
    {
      icon: Clock,
      title: "Sargi & Fasting",
      description: "Pre-dawn sargi meal and day-long fasting with traditional prayers and rituals",
      color: "from-orange-500 to-yellow-500"
    },
    {
      icon: Star,
      title: "Puja Vidhi",
      description: "Complete ritual procedures, mantras, and traditional ceremonies for the festival",
      color: "from-purple-500 to-pink-500"
    }
  ];

  const karvaChouth2025 = {
    date: "November 1, 2025",
    day: "Saturday",
    sargiTime: "5:15 AM - 6:00 AM",
    fastingStarts: "6:00 AM",
    moonriseTime: "8:15 PM",
    pujaTime: "6:00 PM - 8:00 PM",
    significance: "Kartik Krishna Chaturthi - Most auspicious day for married women's devotion"
  };

  const cityWiseMoonrise = [
    {
      city: "Delhi",
      moonrise: "8:15 PM",
      sargiTime: "5:15 AM",
      pujaTime: "6:00 PM"
    },
    {
      city: "Mumbai",
      moonrise: "8:25 PM",
      sargiTime: "5:25 AM",
      pujaTime: "6:10 PM"
    },
    {
      city: "Kolkata",
      moonrise: "7:45 PM",
      sargiTime: "4:45 AM",
      pujaTime: "5:30 PM"
    },
    {
      city: "Chennai",
      moonrise: "8:05 PM",
      sargiTime: "5:05 AM",
      pujaTime: "5:50 PM"
    },
    {
      city: "Bangalore",
      moonrise: "8:10 PM",
      sargiTime: "5:10 AM",
      pujaTime: "5:55 PM"
    },
    {
      city: "Hyderabad",
      moonrise: "8:08 PM",
      sargiTime: "5:08 AM",
      pujaTime: "5:53 PM"
    }
  ];

  const ritualProcedure = [
    {
      step: "Sargi Preparation",
      timing: "Before dawn (5:15 AM)",
      details: "Mother-in-law prepares special meal with fruits, sweets, and mathri"
    },
    {
      step: "Morning Bath",
      timing: "After sargi",
      details: "Ritualistic bath and wearing new or special clothes"
    },
    {
      step: "Puja Setup",
      timing: "Evening (6:00 PM)",
      details: "Arrange puja thali with diya, rice, vermillion, and sweets"
    },
    {
      step: "Karva Chauth Katha",
      timing: "Evening puja time",
      details: "Listen to traditional stories and perform group prayers"
    },
    {
      step: "Moon Sighting",
      timing: "After moonrise",
      details: "First look at moon through sieve, then at husband"
    },
    {
      step: "Fast Breaking",
      timing: "After moon ritual",
      details: "Husband gives first sip of water and first bite of food"
    }
  ];

  const sargiItems = [
    {
      category: "Essential Foods",
      items: [
        "Mathri (savory crackers)",
        "Fruits (apple, banana, pomegranate)",
        "Dry fruits and nuts",
        "Sweets (especially kheer)",
        "Feniya or vermicelli",
        "Coconut and dates"
      ]
    },
    {
      category: "Traditional Items",
      items: [
        "Mehendi (henna)",
        "Bangles and jewelry",
        "Sindoor and kumkum",
        "Small gift or money",
        "Traditional sweets",
        "Blessed items from mother-in-law"
      ]
    }
  ];

  const pujaItems = [
    "Karva (earthen pot) with water",
    "Diya (oil lamp) and incense",
    "Rice, roli, and kumkum",
    "Sweets and fruits as offerings",
    "Sieve for moon viewing",
    "Photo or idol of Gauri-Ganesh",
    "Red cloth and flowers",
    "Puja thali with all items"
  ];

  const karvaChouthStory = [
    {
      story: "Veeravati's Devotion",
      lesson: "The power of a wife's devotion and love for her husband",
      moral: "Patience and faith can overcome any obstacle"
    },
    {
      story: "Queen Draupadi's Fast",
      lesson: "Even during exile, Draupadi observed Karva Chauth",
      moral: "Devotion transcends all circumstances"
    },
    {
      story: "Savitri-Satyavan",
      lesson: "How Savitri's determination saved her husband from death",
      moral: "A devoted wife's prayer can change destiny"
    },
    {
      story: "Karva and Her Husband",
      lesson: "The original story of Karva who saved her husband",
      moral: "True love and devotion are rewarded by divine grace"
    }
  ];

  const regionalTraditions = [
    {
      region: "Punjab",
      tradition: "Elaborate sargi preparation by mother-in-law",
      speciality: "Traditional songs, mehendi ceremony, group celebrations"
    },
    {
      region: "Rajasthan",
      tradition: "Decorated karva pots, colorful attire",
      speciality: "Folk songs, traditional dances, community gatherings"
    },
    {
      region: "Uttar Pradesh",
      tradition: "Grand celebrations with extended family",
      speciality: "Traditional katha, elaborate puja, feast preparations"
    },
    {
      region: "Haryana",
      tradition: "Mother-in-law's special blessings and gifts",
      speciality: "Traditional sargi items, community prayers"
    }
  ];

  const benefits = [
    "Strengthens marital bond and understanding",
    "Brings prosperity and happiness to family",
    "Promotes spiritual discipline and devotion",
    "Ensures husband's long life and health",
    "Creates community bonding among women",
    "Preserves cultural traditions and values",
    "Develops patience and self-control",
    "Brings divine blessings to the household"
  ];

  const modernAdaptations = [
    {
      aspect: "Working Women",
      adaptation: "Flexible timings for sargi and puja rituals",
      solution: "Office-friendly arrangements and group celebrations"
    },
    {
      aspect: "Health Considerations",
      adaptation: "Modified fasting with medical consultation",
      solution: "Partial fasting or alternative spiritual practices"
    },
    {
      aspect: "Long Distance",
      adaptation: "Video calls for moon sighting with husband",
      solution: "Virtual participation in family rituals"
    },
    {
      aspect: "International Locations",
      adaptation: "Adjusted timings based on local moon phases",
      solution: "Community centers organizing group celebrations"
    }
  ];

  const nutritionalTips = [
    "Eat complex carbohydrates in sargi for sustained energy",
    "Include proteins like nuts and dairy products",
    "Stay hydrated before starting the fast",
    "Avoid excessive sugar and spicy foods",
    "Include fiber-rich fruits for better digestion",
    "Take adequate rest during fasting hours",
    "Break fast gradually with light foods",
    "Consult doctor if you have health conditions"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-50">
      <AstroTickHeader />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-40 h-40 bg-red-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-60 h-60 bg-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-6 py-3 text-lg font-semibold mb-8">
                <Heart className="mr-2 h-5 w-5" />
                Festival of Marital Devotion
              </Badge>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-red-600 via-pink-600 to-rose-600 bg-clip-text text-transparent">
                Karva Chauth 2025
              </h1>
              
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Celebrate the sacred festival of Karva Chauth on November 1, 2025. Discover the complete 
                ritual procedures, moonrise timings, and traditional significance of this beautiful festival.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/panchang">
                  <Button className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-8 py-3 text-lg">
                    <Calendar className="mr-2 h-5 w-5" />
                    Check Moonrise Time
                  </Button>
                </Link>
                <Link href="/astrology-tools">
                  <Button variant="outline" className="border-red-600 text-red-600 px-8 py-3 text-lg">
                    <Moon className="mr-2 h-5 w-5" />
                    Festival Panchang
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Karva Chauth 2025 Complete Guide
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about this sacred festival of love
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {karvaChouthFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center text-white mb-4`}>
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Karva Chauth 2025 Details Section */}
      <section className="py-16 bg-gradient-to-r from-red-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Karva Chauth 2025 Details
            </h2>
            <p className="text-xl text-gray-600">
              Complete schedule and timings for the sacred festival
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="text-center">
                  <CardTitle className="text-3xl text-red-700 mb-2">
                    {karvaChouth2025.date}
                  </CardTitle>
                  <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-lg px-4 py-2">
                    {karvaChouth2025.day}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="text-center">
                    <Badge className="bg-orange-100 text-orange-800 mb-2">Sargi Time</Badge>
                    <p className="text-lg font-semibold text-gray-700">{karvaChouth2025.sargiTime}</p>
                  </div>
                  <div className="text-center">
                    <Badge className="bg-blue-100 text-blue-800 mb-2">Moonrise</Badge>
                    <p className="text-lg font-semibold text-gray-700">{karvaChouth2025.moonriseTime}</p>
                  </div>
                  <div className="text-center">
                    <Badge className="bg-purple-100 text-purple-800 mb-2">Puja Time</Badge>
                    <p className="text-lg font-semibold text-gray-700">{karvaChouth2025.pujaTime}</p>
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <Badge className="bg-green-100 text-green-800 mb-2">Significance</Badge>
                  <p className="text-gray-600">{karvaChouth2025.significance}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* City-wise Moonrise Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              City-wise Moonrise Timings
            </h2>
            <p className="text-xl text-gray-600">
              Precise moonrise timings for major Indian cities
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cityWiseMoonrise.map((city, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="text-lg text-red-700">{city.city}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge className="bg-blue-100 text-blue-800">Moonrise</Badge>
                        <span className="text-sm font-medium text-gray-700">{city.moonrise}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge className="bg-orange-100 text-orange-800">Sargi Time</Badge>
                        <span className="text-sm text-gray-600">{city.sargiTime}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge className="bg-purple-100 text-purple-800">Puja Time</Badge>
                        <span className="text-sm text-gray-600">{city.pujaTime}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Ritual Procedure Section */}
      <section className="py-16 bg-gradient-to-r from-red-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Complete Ritual Procedure
            </h2>
            <p className="text-xl text-gray-600">
              Step-by-step guide to perform Karva Chauth rituals
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ritualProcedure.map((ritual, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-red-700">{ritual.step}</CardTitle>
                      <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center text-white">
                        <span className="text-xs font-bold">{index + 1}</span>
                      </div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">{ritual.timing}</Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{ritual.details}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sargi Items Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Sargi Essentials
            </h2>
            <p className="text-xl text-gray-600">
              Traditional items prepared by mother-in-law for sargi
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sargiItems.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="text-xl text-red-700">{category.category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {category.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center">
                          <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full mr-2"></div>
                          <span className="text-sm text-gray-700">{item}</span>
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

      {/* Traditional Stories Section */}
      <section className="py-16 bg-gradient-to-r from-red-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Traditional Karva Chauth Stories
            </h2>
            <p className="text-xl text-gray-600">
              Sacred stories that inspire devotion and faith
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {karvaChouthStory.map((story, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="text-lg text-red-700">{story.story}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <Badge variant="outline" className="mb-2">Lesson</Badge>
                        <p className="text-sm text-gray-600">{story.lesson}</p>
                      </div>
                      <div>
                        <Badge variant="outline" className="mb-2">Moral</Badge>
                        <p className="text-sm text-gray-600">{story.moral}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Benefits of Karva Chauth
            </h2>
            <p className="text-xl text-gray-600">
              Spiritual and emotional benefits of this sacred observance
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-4 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center text-white mr-3">
                      <Gift className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{benefit}</span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Celebrate Karva Chauth 2025 with Devotion
          </h2>
          <p className="text-xl mb-8">
            Get personalized guidance for your Karva Chauth celebration and rituals
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/panchang">
              <Button className="bg-white text-red-600 px-8 py-3 text-lg">
                <Calendar className="mr-2 h-5 w-5" />
                Check Moonrise Time
              </Button>
            </Link>
            <Link href="/astrologers">
              <Button variant="outline" className="border-white text-white px-8 py-3 text-lg">
                <Sparkles className="mr-2 h-5 w-5" />
                Consult Expert
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default KarvaChauth2025;