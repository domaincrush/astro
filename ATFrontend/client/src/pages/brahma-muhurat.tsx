import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from 'src/components/ui/card';
import { Button } from 'src/components/ui/button';
import { Badge } from 'src/components/ui/badge';
import { Sunrise, Clock, Calendar, MapPin, Star, Heart, Brain, Zap, Shield, Sun, Flower2 } from 'lucide-react';
import AstroTickHeader from 'src/components/layout/AstroTickHeader';
import Footer from 'src/components/layout/Footer';
import { LocationSearch } from 'src/components/LocationSearch';

export default function BrahmaMuhurat() {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [location, setLocation] = useState<string>('');
  const [coordinates, setCoordinates] = useState<{lat: number; lng: number} | null>(null);
  const [brahmaMuhuratData, setBrahmaMuhuratData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const spiritualBenefits = [
    { 
      title: 'Divine Connection', 
      description: 'Direct communion with the divine energy',
      icon: Star,
      color: 'from-purple-400 to-indigo-500'
    },
    { 
      title: 'Mental Clarity', 
      description: 'Enhanced focus and mental sharpness',
      icon: Brain,
      color: 'from-blue-400 to-cyan-500'
    },
    { 
      title: 'Spiritual Awakening', 
      description: 'Accelerated spiritual growth and awareness',
      icon: Flower2,
      color: 'from-pink-400 to-rose-500'
    },
    { 
      title: 'Inner Peace', 
      description: 'Deep tranquility and emotional balance',
      icon: Heart,
      color: 'from-green-400 to-teal-500'
    },
    { 
      title: 'Cosmic Energy', 
      description: 'Absorption of pure cosmic vibrations',
      icon: Star,
      color: 'from-yellow-400 to-orange-500'
    },
    { 
      title: 'Protection', 
      description: 'Divine protection throughout the day',
      icon: Shield,
      color: 'from-red-400 to-pink-500'
    }
  ];

  const idealActivities = [
    { 
      category: 'Meditation & Prayer', 
      activities: ['Dhyana (meditation)', 'Japa (chanting)', 'Prayer rituals', 'Spiritual reading'],
      icon: Star,
      color: 'from-purple-400 to-indigo-500'
    },
    { 
      category: 'Yoga & Pranayama', 
      activities: ['Asana practice', 'Pranayama breathing', 'Surya Namaskara', 'Kundalini yoga'],
      icon: Flower2,
      color: 'from-pink-400 to-rose-500'
    },
    { 
      category: 'Study & Learning', 
      activities: ['Vedic studies', 'Scripture reading', 'Spiritual texts', 'Philosophy'],
      icon: Brain,
      color: 'from-blue-400 to-cyan-500'
    },
    { 
      category: 'Purification', 
      activities: ['Sacred bath', 'Cleansing rituals', 'Fasting', 'Detoxification'],
      icon: Shield,
      color: 'from-green-400 to-teal-500'
    }
  ];

  const handleLocationSelect = (locationData: any) => {
    setLocation(locationData.display);
    setCoordinates({ lat: locationData.latitude, lng: locationData.longitude });
  };

  const getBrahmaMuhurat = async () => {
    if (!location || !coordinates) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/panchang/brahma-muhurat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: selectedDate,
          location: location,
          latitude: coordinates.lat,
          longitude: coordinates.lng
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setBrahmaMuhuratData(data);
      }
    } catch (error) {
      console.error('Error fetching Brahma Muhurat:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate current Brahma Muhurat
  const getCurrentBrahmaMuhurat = () => {
    const now = new Date();
    const sunrise = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 6, 0, 0);
    const brahmaMuhuratStart = new Date(sunrise.getTime() - 96 * 60 * 1000); // 96 minutes before sunrise
    const brahmaMuhuratEnd = new Date(sunrise.getTime() - 48 * 60 * 1000); // 48 minutes before sunrise
    
    return {
      start: brahmaMuhuratStart.toTimeString().slice(0, 5),
      end: brahmaMuhuratEnd.toTimeString().slice(0, 5),
      duration: '48 minutes',
      isActive: now >= brahmaMuhuratStart && now <= brahmaMuhuratEnd,
      timeToStart: brahmaMuhuratStart.getTime() - now.getTime()
    };
  };

  const currentBrahmaMuhurat = getCurrentBrahmaMuhurat();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <AstroTickHeader />
      
      <main className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full mb-6 shadow-2xl">
              <Sunrise className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Brahma Muhurat
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              The most sacred pre-dawn period (4:24 AM - 5:12 AM) ideal for spiritual practices and divine connection
            </p>
            <div className="flex items-center justify-center gap-2 text-2xl font-bold text-purple-600">
              <Star className="h-6 w-6" />
              Sacred Time of Creation
            </div>
          </motion.div>

          {/* Current Status */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <Card className="max-w-2xl mx-auto shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-center text-purple-600 flex items-center justify-center gap-2">
                  <Star className="h-6 w-6" />
                  Today's Brahma Muhurat
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <div className={`inline-block px-8 py-6 rounded-xl ${
                  currentBrahmaMuhurat.isActive 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-600 animate-pulse' 
                    : 'bg-gradient-to-r from-indigo-500 to-purple-600'
                } text-white shadow-lg`}>
                  <div className="text-3xl font-bold mb-2">
                    {currentBrahmaMuhurat.start} - {currentBrahmaMuhurat.end}
                  </div>
                  <div className="text-lg mb-2">Duration: {currentBrahmaMuhurat.duration}</div>
                  <Badge className={`${
                    currentBrahmaMuhurat.isActive ? 'bg-white/30' : 'bg-white/20'
                  } text-white border-white/30 px-4 py-2`}>
                    {currentBrahmaMuhurat.isActive ? 'ACTIVE NOW' : 'Next Period'}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2 text-lg font-semibold text-purple-600">
                    <Clock className="h-5 w-5" />
                    Current Time: {currentTime.toLocaleTimeString()}
                  </div>
                  
                  {!currentBrahmaMuhurat.isActive && currentBrahmaMuhurat.timeToStart > 0 && (
                    <div className="text-sm text-gray-600">
                      Next Brahma Muhurat in: {Math.floor(currentBrahmaMuhurat.timeToStart / (1000 * 60 * 60))} hours {Math.floor((currentBrahmaMuhurat.timeToStart % (1000 * 60 * 60)) / (1000 * 60))} minutes
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Input Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <Card className="max-w-2xl mx-auto shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-center text-purple-600 flex items-center justify-center gap-2">
                  <Calendar className="h-6 w-6" />
                  Calculate Brahma Muhurat
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Date</label>
                    <input 
                      type="date" 
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Location</label>
                    <LocationSearch onLocationSelect={handleLocationSelect} />
                  </div>
                </div>

                <Button 
                  onClick={getBrahmaMuhurat}
                  disabled={!location || loading}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold py-3 text-lg"
                >
                  {loading ? 'Calculating...' : 'Get Brahma Muhurat'}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Spiritual Benefits */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Spiritual Benefits</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {spiritualBenefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ scale: 1.05 }}
                    className="relative overflow-hidden rounded-xl shadow-lg"
                  >
                    <div className={`bg-gradient-to-r ${benefit.color} p-6 text-white h-full`}>
                      <Icon className="h-10 w-10 mb-4" />
                      <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                      <p className="text-sm opacity-90">{benefit.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Ideal Activities */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Ideal Activities During Brahma Muhurat</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {idealActivities.map((category, index) => {
                const Icon = category.icon;
                return (
                  <motion.div
                    key={category.category}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ scale: 1.02 }}
                    className="relative overflow-hidden rounded-xl shadow-lg"
                  >
                    <Card className="border-0 bg-white/90 backdrop-blur-sm h-full">
                      <CardHeader className={`bg-gradient-to-r ${category.color} text-white`}>
                        <div className="flex items-center gap-3">
                          <Icon className="h-8 w-8" />
                          <CardTitle className="text-lg">{category.category}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="space-y-3">
                          {category.activities.map((activity, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                              <Star className="h-4 w-4 text-purple-500 flex-shrink-0" />
                              <span className="text-sm font-medium text-gray-900">{activity}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Daily Schedule Guide */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="mb-12"
          >
            <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-center text-purple-600 flex items-center justify-center gap-2">
                  <Clock className="h-6 w-6" />
                  Daily Brahma Muhurat Practice Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mb-4">
                      <Clock className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">4:24 AM - 4:36 AM</h3>
                    <p className="text-gray-600">Preparation Phase</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Wake up naturally</li>
                      <li>• Light ablutions</li>
                      <li>• Set sacred intention</li>
                      <li>• Prepare meditation space</li>
                    </ul>
                  </div>
                  
                  <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full mb-4">
                      <Star className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">4:36 AM - 5:00 AM</h3>
                    <p className="text-gray-600">Core Practice</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Deep meditation</li>
                      <li>• Mantra chanting</li>
                      <li>• Pranayama breathing</li>
                      <li>• Spiritual reading</li>
                    </ul>
                  </div>
                  
                  <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-400 to-rose-500 rounded-full mb-4">
                      <Sun className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">5:00 AM - 5:12 AM</h3>
                    <p className="text-gray-600">Integration Phase</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Gratitude practice</li>
                      <li>• Set daily intentions</li>
                      <li>• Welcome sunrise</li>
                      <li>• Carry peace forward</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Knowledge Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-purple-600 flex items-center gap-2">
                  <Sunrise className="h-6 w-6" />
                  About Brahma Muhurat
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  Brahma Muhurat is the most sacred time of day, beginning approximately 96 minutes before sunrise. This is when the cosmic energy is at its purest and most conducive to spiritual practices.
                </p>
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900">Key Characteristics:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    <li>Duration: 48 minutes (4:24 AM - 5:12 AM)</li>
                    <li>Timing: 96 minutes before sunrise</li>
                    <li>Atmosphere: Pure, serene, and spiritually charged</li>
                    <li>Energy: Maximum sattva (purity)</li>
                    <li>Benefits: Accelerated spiritual growth</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-purple-600 flex items-center gap-2">
                  <Star className="h-6 w-6" />
                  Scientific & Spiritual Benefits
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Brain className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Enhanced Brain Function</p>
                      <p className="text-sm text-gray-600">Maximum melatonin and growth hormone production</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Heart className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Cardiovascular Health</p>
                      <p className="text-sm text-gray-600">Optimal heart rate variability and blood pressure</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Flower2 className="h-5 w-5 text-pink-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Spiritual Awakening</p>
                      <p className="text-sm text-gray-600">Deepest meditation states and divine connection</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}