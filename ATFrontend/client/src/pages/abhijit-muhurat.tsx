import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { Button } from "src/components/ui/button";
import { Badge } from "src/components/ui/badge";
import {
  Star,
  Clock,
  Calendar,
  MapPin,
  Sun,
  Zap,
  Target,
  CheckCircle,
  Crown,
  Gift,
  Briefcase,
  GraduationCap,
  Heart,
  Home,
} from "lucide-react";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";
import { LocationSearch } from "src/components/LocationSearch";

export default function AbhijitMuhurat() {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [location, setLocation] = useState<string>("");
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [abhijitData, setAbhijitData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const specialFeatures = [
    {
      title: "Supreme Auspiciousness",
      description: "Most powerful muhurat in the entire day",
      icon: Crown,
      color: "from-yellow-400 to-orange-500",
    },
    {
      title: "Nullifies Doshas",
      description: "Cancels all planetary doshas and negative influences",
      icon: CheckCircle,
      color: "from-green-400 to-teal-500",
    },
    {
      title: "Universal Success",
      description: "Ensures success in all types of activities",
      icon: Target,
      color: "from-blue-400 to-purple-500",
    },
    {
      title: "Divine Blessing",
      description: "Blessed by Lord Vishnu himself",
      icon: Star,
      color: "from-purple-400 to-pink-500",
    },
  ];

  const idealActivities = [
    {
      category: "Business & Career",
      activities: [
        "Business launch",
        "Job interviews",
        "Important meetings",
        "Contracts signing",
      ],
      icon: Briefcase,
      color: "from-orange-400 to-red-500",
    },
    {
      category: "Education & Learning",
      activities: [
        "Exam preparation",
        "New course start",
        "Study sessions",
        "Skill development",
      ],
      icon: GraduationCap,
      color: "from-blue-400 to-indigo-500",
    },
    {
      category: "Health & Wellness",
      activities: [
        "Medical treatments",
        "Surgery",
        "Health check-ups",
        "Recovery activities",
      ],
      icon: Heart,
      color: "from-green-400 to-teal-500",
    },
    {
      category: "Spiritual & Religious",
      activities: [
        "Prayers",
        "Meditation",
        "Religious ceremonies",
        "Mantra chanting",
      ],
      icon: Star,
      color: "from-purple-400 to-pink-500",
    },
    {
      category: "Personal & Family",
      activities: [
        "Important decisions",
        "Family planning",
        "Property purchase",
        "Vehicle buying",
      ],
      icon: Home,
      color: "from-pink-400 to-rose-500",
    },
    {
      category: "Creative & Arts",
      activities: [
        "Art creation",
        "Music recording",
        "Writing",
        "Creative projects",
      ],
      icon: Gift,
      color: "from-cyan-400 to-blue-500",
    },
  ];

  const handleLocationSelect = (locationData: any) => {
    console.log(locationData);
    setLocation(locationData.place_name);
    setCoordinates({ lat: locationData.latitude, lng: locationData.longitude });
  };

  const getAbhijitMuhurat = async () => {
    if (!location || !coordinates) return;

    setLoading(true);
    try {
      const response = await fetch("/api/panchang/abhijit-muhurat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: selectedDate,
          location: location,
          latitude: coordinates.lat,
          longitude: coordinates.lng,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAbhijitData(data);
      }
    } catch (error) {
      console.error("Error fetching Abhijit Muhurat:", error);
    } finally {
      setLoading(false);
    }
  };

  // Mock current Abhijit Muhurat for demonstration
  const getCurrentAbhijit = () => {
    const now = new Date();
    const midday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      12,
      0,
      0,
    );
    const start = new Date(midday.getTime() - 24 * 60 * 1000); // 24 minutes before noon
    const end = new Date(midday.getTime() + 24 * 60 * 1000); // 24 minutes after noon

    return {
      start: start.toTimeString().slice(0, 5),
      end: end.toTimeString().slice(0, 5),
      duration: "48 minutes",
      isActive: now >= start && now <= end,
    };
  };

  const currentAbhijit = getCurrentAbhijit();

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
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full mb-6 shadow-2xl">
              <Star className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Abhijit Muhurat
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              The most auspicious 48-minute window daily - Perfect for all
              important activities
            </p>
            <div className="flex items-center justify-center gap-2 text-2xl font-bold text-orange-600">
              <Crown className="h-6 w-6" />
              Supreme Auspicious Time
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
                <CardTitle className="text-2xl text-center text-orange-600 flex items-center justify-center gap-2">
                  <Zap className="h-6 w-6" />
                  Today's Abhijit Muhurat
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <div
                  className={`inline-block px-8 py-6 rounded-xl ${
                    currentAbhijit.isActive
                      ? "bg-gradient-to-r from-green-500 to-teal-600 animate-pulse"
                      : "bg-gradient-to-r from-yellow-500 to-orange-600"
                  } text-white shadow-lg`}
                >
                  <div className="text-3xl font-bold mb-2">
                    {currentAbhijit.start} - {currentAbhijit.end}
                  </div>
                  <div className="text-lg mb-2">
                    Duration: {currentAbhijit.duration}
                  </div>
                  <Badge
                    className={`${
                      currentAbhijit.isActive ? "bg-white/30" : "bg-white/20"
                    } text-white border-white/30 px-4 py-2`}
                  >
                    {currentAbhijit.isActive ? "ACTIVE NOW" : "Upcoming"}
                  </Badge>
                </div>

                <div className="flex items-center justify-center gap-2 text-lg font-semibold text-orange-600">
                  <Clock className="h-5 w-5" />
                  Current Time: {currentTime.toLocaleTimeString()}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* API Results Display */}
          {abhijitData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-12"
            >
              <Card className="max-w-3xl mx-auto shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl text-center text-orange-600 flex items-center justify-center gap-2">
                    <Star className="h-6 w-6" />
                    Abhijit Muhurat for {abhijitData.data?.date}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-6">
                  <div className="inline-block px-8 py-6 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-lg">
                    <div className="text-3xl font-bold mb-2">
                      {abhijitData.data?.abhijit_muhurat?.start} -{" "}
                      {abhijitData.data?.abhijit_muhurat?.end}
                    </div>
                    <div className="text-lg mb-2">
                      Duration:{" "}
                      {abhijitData.data?.duration || "Calculated duration"}
                    </div>
                    <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
                      Most Auspicious Time
                    </Badge>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-lg font-semibold text-orange-600">
                    <MapPin className="h-5 w-5" />
                    {location}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Input Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <Card className="max-w-2xl mx-auto shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-center text-orange-600 flex items-center justify-center gap-2">
                  <Calendar className="h-6 w-6" />
                  Get Abhijit Muhurat
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Date
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Location
                    </label>
                    <LocationSearch onLocationSelect={handleLocationSelect} />
                  </div>
                </div>

                <Button
                  onClick={getAbhijitMuhurat}
                  disabled={!location || loading}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-semibold py-3 text-lg"
                >
                  {loading ? "Calculating..." : "Get Abhijit Muhurat"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Special Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
              Why Abhijit Muhurat is Special
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {specialFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ scale: 1.05 }}
                    className="relative overflow-hidden rounded-xl shadow-lg"
                  >
                    <div
                      className={`bg-gradient-to-r ${feature.color} p-6 text-white h-full`}
                    >
                      <Icon className="h-10 w-10 mb-4" />
                      <h3 className="text-xl font-bold mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-sm opacity-90">
                        {feature.description}
                      </p>
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
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
              Ideal Activities During Abhijit Muhurat
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                      <CardHeader
                        className={`bg-gradient-to-r ${category.color} text-white`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="h-8 w-8" />
                          <CardTitle className="text-lg">
                            {category.category}
                          </CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="space-y-3">
                          {category.activities.map((activity, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg"
                            >
                              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                              <span className="text-sm font-medium text-gray-900">
                                {activity}
                              </span>
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

          {/* Knowledge Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-orange-600 flex items-center gap-2">
                  <Star className="h-6 w-6" />
                  About Abhijit Muhurat
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  Abhijit Muhurat is the most auspicious 48-minute period each
                  day, occurring around midday. It's considered so powerful that
                  it can overcome any doshas or negative planetary influences.
                </p>
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900">
                    Key Characteristics:
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    <li>Duration: Exactly 48 minutes</li>
                    <li>Timing: Around midday (noon)</li>
                    <li>Universal auspiciousness</li>
                    <li>Nullifies all doshas</li>
                    <li>Blessed by Lord Vishnu</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-orange-600 flex items-center gap-2">
                  <Crown className="h-6 w-6" />
                  Spiritual Significance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Star className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">
                        Divine Blessing
                      </p>
                      <p className="text-sm text-gray-600">
                        Blessed by Lord Vishnu and all celestial beings
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Zap className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Maximum Power</p>
                      <p className="text-sm text-gray-600">
                        Sun at its peak strength, providing maximum energy
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Target className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">
                        Guaranteed Success
                      </p>
                      <p className="text-sm text-gray-600">
                        All activities started during this time are blessed with
                        success
                      </p>
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
