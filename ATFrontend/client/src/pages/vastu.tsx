import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { Button } from "src/components/ui/button";
import { motion } from "framer-motion";
import { Home, Compass, Shield, TrendingUp, Sun, Moon, Star, Heart, Gift, Target, Crown, Eye, Sparkles, ArrowRight, ChevronRight } from "lucide-react";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";

export default function VastuShastra() {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  const vastuDirections = [
    {
      direction: "North",
      element: "Water",
      deity: "Kubera",
      color: "Blue/Green",
      benefits: ["Wealth", "Prosperity", "Career Growth"],
      ideal: "Cash locker, water features, entrance"
    },
    {
      direction: "Northeast",
      element: "Water",
      deity: "Ishaan",
      color: "Yellow/Cream",
      benefits: ["Spirituality", "Knowledge", "Peace"],
      ideal: "Puja room, study area, water tank"
    },
    {
      direction: "East",
      element: "Air",
      deity: "Indra",
      color: "White/Light Blue",
      benefits: ["Health", "Happiness", "Growth"],
      ideal: "Main entrance, windows, morning activities"
    },
    {
      direction: "Southeast",
      element: "Fire",
      deity: "Agni",
      color: "Red/Orange",
      benefits: ["Energy", "Vitality", "Relationships"],
      ideal: "Kitchen, electrical appliances, fire place"
    },
    {
      direction: "South",
      element: "Earth",
      deity: "Yama",
      color: "Red/Maroon",
      benefits: ["Fame", "Recognition", "Stability"],
      ideal: "Master bedroom, heavy furniture, storage"
    },
    {
      direction: "Southwest",
      element: "Earth",
      deity: "Nirrti",
      color: "Brown/Yellow",
      benefits: ["Stability", "Relationships", "Longevity"],
      ideal: "Master bedroom, heavy items, storeroom"
    },
    {
      direction: "West",
      element: "Air",
      deity: "Varuna",
      color: "Blue/Grey",
      benefits: ["Gains", "Profits", "Success"],
      ideal: "Dining room, safe, valuable items"
    },
    {
      direction: "Northwest",
      element: "Air",
      deity: "Vayu",
      color: "White/Silver",
      benefits: ["Movement", "Travel", "Communication"],
      ideal: "Guest room, bathroom, garage"
    }
  ];

  const roomVastu = [
    {
      room: "Living Room",
      direction: "North/East",
      tips: ["Keep northeast corner light", "Place TV in southeast", "Avoid dark colors", "Use light furniture"],
      avoid: ["Heavy furniture in northeast", "Dark/red colors", "Clutter", "Electronics in northeast"]
    },
    {
      room: "Kitchen",
      direction: "Southeast",
      tips: ["Cook facing east", "Gas stove in southeast", "Sink in northeast", "Light colors preferred"],
      avoid: ["Kitchen in northeast", "Cooking facing south", "Sink opposite stove", "Dark colors"]
    },
    {
      room: "Master Bedroom",
      direction: "Southwest",
      tips: ["Bed in southwest", "Head towards south/west", "Avoid mirrors opposite bed", "Use earth tones"],
      avoid: ["Bed in northeast", "Head towards north", "Mirrors facing bed", "Electronic items"]
    },
    {
      room: "Bathroom",
      direction: "West/Northwest",
      tips: ["Toilet seat facing north/south", "Exhaust fan in west", "Light colors", "Keep door closed"],
      avoid: ["Bathroom in northeast", "Toilet facing east", "Dark colors", "Keeping door open"]
    },
    {
      room: "Puja Room",
      direction: "Northeast",
      tips: ["Face east while praying", "Keep idols in northeast", "Use yellow/white colors", "Maintain cleanliness"],
      avoid: ["Puja room in south", "Idols facing south", "Dark colors", "Storing other items"]
    },
    {
      room: "Study Room",
      direction: "Northeast/East",
      tips: ["Study table in east", "Face east/north while studying", "Good lighting", "Light colors"],
      avoid: ["Study table in southwest", "Back to door", "Insufficient light", "Distractions"]
    }
  ];

  const vastuTips = [
    {
      category: "Entrance",
      icon: Home,
      tips: ["Main door should be larger than other doors", "Keep entrance well-lit and clean", "Avoid obstacles in front of door", "Place auspicious symbols"]
    },
    {
      category: "Colors",
      icon: Sun,
      tips: ["Use light colors for northeast", "Earth tones for southwest", "Avoid dark colors in northeast", "White/cream for overall positivity"]
    },
    {
      category: "Furniture",
      icon: Shield,
      tips: ["Heavy furniture in south/west", "Light furniture in north/east", "Avoid broken or damaged items", "Keep furniture organized"]
    },
    {
      category: "Plants",
      icon: Star,
      tips: ["Tulsi plant in northeast", "Money plant for prosperity", "Avoid cactus and thorny plants", "Fresh flowers for positive energy"]
    },
    {
      category: "Water",
      icon: Moon,
      tips: ["Water storage in northeast", "Avoid water in southeast", "Clean water sources", "Flowing water features"]
    },
    {
      category: "Lighting",
      icon: Sun,
      tips: ["Natural light in northeast", "Avoid dark corners", "Use warm lighting", "Bright entrance area"]
    }
  ];

  const vastuRemedies = [
    {
      problem: "Financial Issues",
      remedy: "Place a mirror on north wall of cash locker",
      description: "Reflects wealth and doubles prosperity"
    },
    {
      problem: "Health Problems",
      remedy: "Keep northeast corner clean and clutter-free",
      description: "Allows positive energy flow for better health"
    },
    {
      problem: "Relationship Issues",
      remedy: "Keep pairs of items in southwest bedroom",
      description: "Enhances harmony and understanding"
    },
    {
      problem: "Career Stagnation",
      remedy: "Place a small fountain in north direction",
      description: "Activates career growth and opportunities"
    },
    {
      problem: "Sleep Disturbance",
      remedy: "Sleep with head towards south or west",
      description: "Ensures peaceful sleep and good health"
    },
    {
      problem: "Study Concentration",
      remedy: "Study facing east with back to wall",
      description: "Improves focus and academic performance"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50">
      <AstroTickHeader />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 via-blue-600 to-yellow-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Compass className="h-8 w-8 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Vastu Shastra
            </h1>
            
            <p className="text-xl max-w-3xl mx-auto mb-8 text-green-100">
              Ancient science of architecture and space arrangement. Create harmony between your living space and natural forces for prosperity, health, and happiness.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Directions Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Vastu Directions & Elements
            </h2>
            <p className="text-xl text-gray-600">
              Understanding the significance of each direction in Vastu Shastra
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {vastuDirections.map((direction, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="text-lg text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Compass className="h-6 w-6 text-white" />
                      </div>
                      {direction.direction}
                    </CardTitle>
                    <div className="text-center space-y-1">
                      <p className="text-sm text-gray-600">Element: {direction.element}</p>
                      <p className="text-sm text-gray-600">Deity: {direction.deity}</p>
                      <p className="text-sm text-gray-600">Color: {direction.color}</p>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-green-700 mb-1">Benefits:</h4>
                        <ul className="text-sm space-y-1">
                          {direction.benefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-center">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-700 mb-1">Ideal For:</h4>
                        <p className="text-sm text-gray-700">{direction.ideal}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Room Vastu Section */}
      <section className="py-16 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Room-wise Vastu Guidelines
            </h2>
            <p className="text-xl text-gray-600">
              Specific Vastu principles for different rooms in your home
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roomVastu.map((room, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="cursor-pointer"
                onClick={() => setSelectedRoom(selectedRoom === room.room ? null : room.room)}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="text-lg text-green-700">{room.room}</CardTitle>
                    <p className="text-sm text-gray-600">Best Direction: {room.direction}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-green-700 mb-2">Tips:</h4>
                        <ul className="text-sm space-y-1">
                          {room.tips.slice(0, selectedRoom === room.room ? room.tips.length : 2).map((tip, idx) => (
                            <li key={idx} className="flex items-start">
                              <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                      {selectedRoom === room.room && (
                        <div>
                          <h4 className="font-semibold text-red-700 mb-2">Avoid:</h4>
                          <ul className="text-sm space-y-1">
                            {room.avoid.map((item, idx) => (
                              <li key={idx} className="flex items-start">
                                <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                                {item}
                              </li>
                            ))}
                          </ul>
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

      {/* Vastu Tips Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Essential Vastu Tips
            </h2>
            <p className="text-xl text-gray-600">
              Simple tips to enhance positive energy in your space
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vastuTips.map((tip, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <tip.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-center mb-4">{tip.category}</h3>
                    <ul className="space-y-2">
                      {tip.tips.map((item, idx) => (
                        <li key={idx} className="flex items-start">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-sm text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vastu Remedies Section */}
      <section className="py-16 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Vastu Remedies
            </h2>
            <p className="text-xl text-gray-600">
              Simple solutions for common Vastu problems
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {vastuRemedies.map((remedy, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-lg text-red-700">{remedy.problem}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="bg-green-50 p-3 rounded-lg">
                        <h4 className="font-semibold text-green-700 mb-1">Remedy:</h4>
                        <p className="text-sm text-green-600">{remedy.remedy}</p>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <h4 className="font-semibold text-blue-700 mb-1">How it helps:</h4>
                        <p className="text-sm text-blue-600">{remedy.description}</p>
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
      <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Transform Your Space with Vastu
          </h2>
          <p className="text-xl mb-8">
            Create a harmonious living environment that supports your goals and well-being
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-green-600 px-8 py-3 text-lg">
              <Home className="mr-2 h-5 w-5" />
              Get Vastu Consultation
            </Button>
            <Button variant="outline" className="border-white text-white px-8 py-3 text-lg">
              <Sparkles className="mr-2 h-5 w-5" />
              Learn More
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}