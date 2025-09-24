import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { Button } from "src/components/ui/button";
import { Badge } from "src/components/ui/badge";
import {
  Clock,
  Sun,
  Moon,
  Star,
  CheckCircle,
  AlertCircle,
  Calendar,
  MapPin,
  Timer,
} from "lucide-react";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";
import { LocationSearch } from "src/components/LocationSearch";

export default function Choghadiya() {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [location, setLocation] = useState<string>("");
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [choghadiyaData, setChoghadiyaData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const choghadiyaTypes = [
    {
      name: "Amrit",
      quality: "Excellent",
      color: "from-green-400 to-emerald-500",
      description: "Nectar time - Best for all activities",
      activities: [
        "Marriage",
        "Business Start",
        "Medicine",
        "Important Meetings",
      ],
    },
    {
      name: "Shubh",
      quality: "Good",
      color: "from-blue-400 to-cyan-500",
      description: "Auspicious time - Good for positive activities",
      activities: ["Education", "Travel", "Shopping", "Social Events"],
    },
    {
      name: "Labh",
      quality: "Good",
      color: "from-purple-400 to-pink-500",
      description: "Profit time - Ideal for business and financial activities",
      activities: [
        "Business Deals",
        "Investments",
        "Property Purchase",
        "Job Interviews",
      ],
    },
    {
      name: "Char",
      quality: "Good",
      color: "from-orange-400 to-red-500",
      description: "Movable time - Good for travel and mobile activities",
      activities: ["Travel", "Vehicle Purchase", "Shifting", "Sports"],
    },
    {
      name: "Kaal",
      quality: "Avoid",
      color: "from-red-500 to-pink-600",
      description: "Death time - Avoid important activities",
      activities: ["Rest", "Meditation", "Routine Work", "Avoid New Ventures"],
    },
    {
      name: "Rog",
      quality: "Avoid",
      color: "from-gray-400 to-gray-600",
      description: "Disease time - Not suitable for important work",
      activities: [
        "Medical Treatment",
        "Rest",
        "Avoid Important Work",
        "Cleaning",
      ],
    },
    {
      name: "Udveg",
      quality: "Avoid",
      color: "from-yellow-500 to-orange-600",
      description: "Anxiety time - Creates restlessness",
      activities: [
        "Avoid Conflicts",
        "Meditation",
        "Avoid Important Decisions",
        "Routine Tasks",
      ],
    },
  ];

  const handleLocationSelect = (locationData: any) => {
    setLocation(locationData.place_name || locationData.display);
    setCoordinates({ lat: locationData.latitude, lng: locationData.longitude });
  };

  const getChoghadiya = async () => {
    if (!location || !coordinates) return;

    setLoading(true);
    try {
      const response = await fetch("/api/panchang/choghadiya", {
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
        setChoghadiyaData(data);
      }
    } catch (error) {
      console.error("Error fetching choghadiya:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentChoghadiya = () => {
    if (!choghadiyaData) return null;

    const now = currentTime.toTimeString().slice(0, 5);
    const currentPeriod =
      choghadiyaData.day_choghadiya?.find(
        (period: any) => now >= period.start && now <= period.end,
      ) ||
      choghadiyaData.night_choghadiya?.find(
        (period: any) => now >= period.start && now <= period.end,
      );

    return currentPeriod;
  };

  const currentChoghadiya = getCurrentChoghadiya();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50">
      <AstroTickHeader />

      <main className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-orange-500 to-red-600 rounded-full mb-6 shadow-2xl">
              <Clock className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Choghadiya Calculator
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Traditional 8-division time system for optimal activity planning
              based on Vedic astrology
            </p>
            <div className="flex items-center justify-center gap-2 text-2xl font-bold text-orange-600">
              <Timer className="h-6 w-6" />
              {currentTime.toLocaleTimeString()}
            </div>
          </motion.div>

          {/* Current Choghadiya Display */}
          {currentChoghadiya && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-12"
            >
              <Card className="max-w-2xl mx-auto shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl text-center text-orange-600 flex items-center justify-center gap-2">
                    <Star className="h-6 w-6" />
                    Current Choghadiya
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div
                    className={`inline-block px-8 py-4 rounded-xl bg-gradient-to-r ${
                      choghadiyaTypes.find(
                        (t) => t.name === currentChoghadiya.name,
                      )?.color
                    } text-white shadow-lg`}
                  >
                    <div className="text-3xl font-bold mb-2">
                      {currentChoghadiya.name}
                    </div>
                    <div className="text-lg">
                      {currentChoghadiya.start} - {currentChoghadiya.end}
                    </div>
                  </div>
                  <Badge
                    className={`${
                      currentChoghadiya.quality === "Excellent"
                        ? "bg-green-500"
                        : currentChoghadiya.quality === "Good"
                          ? "bg-blue-500"
                          : "bg-red-500"
                    } text-white px-4 py-2 text-lg`}
                  >
                    {
                      choghadiyaTypes.find(
                        (t) => t.name === currentChoghadiya.name,
                      )?.quality
                    }
                  </Badge>
                  <p className="text-gray-600 max-w-md mx-auto">
                    {
                      choghadiyaTypes.find(
                        (t) => t.name === currentChoghadiya.name,
                      )?.description
                    }
                  </p>
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
                  Get Choghadiya Times
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
                  onClick={getChoghadiya}
                  disabled={!location || loading}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold py-3 text-lg"
                >
                  {loading ? "Calculating..." : "Get Choghadiya Timings"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Choghadiya Types Guide */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
              Choghadiya Types Guide
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {choghadiyaTypes.map((type, index) => (
                <motion.div
                  key={type.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.05 }}
                  className="relative overflow-hidden rounded-xl shadow-lg"
                >
                  <div
                    className={`bg-gradient-to-r ${type.color} p-6 text-white h-full`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold">{type.name}</h3>
                      {type.quality === "Excellent" && (
                        <CheckCircle className="h-6 w-6" />
                      )}
                      {type.quality === "Good" && <Star className="h-6 w-6" />}
                      {type.quality === "Avoid" && (
                        <AlertCircle className="h-6 w-6" />
                      )}
                    </div>
                    <p className="text-sm opacity-90 mb-4">
                      {type.description}
                    </p>
                    <div className="space-y-2">
                      <p className="text-sm font-semibold">
                        Recommended Activities:
                      </p>
                      <ul className="text-xs space-y-1">
                        {type.activities.map((activity, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-white rounded-full"></div>
                            {activity}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Results Section */}
          {choghadiyaData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mb-12"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Day Choghadiya */}
                <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-2xl text-center text-orange-600 flex items-center justify-center gap-2">
                      <Sun className="h-6 w-6" />
                      Day Choghadiya
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {choghadiyaData.data?.day_choghadiya?.map(
                      (periodData: any, index: number) => {
                        const typeData = choghadiyaTypes.find(
                          (t) => t.name === periodData.period,
                        );
                        return (
                          <div
                            key={index}
                            className={`p-4 rounded-lg bg-gradient-to-r ${typeData?.color} bg-opacity-20 border border-opacity-30`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-bold text-lg">
                                {periodData.period}
                              </span>
                              <Badge
                                className={`${
                                  typeData?.quality === "Excellent"
                                    ? "bg-green-500"
                                    : typeData?.quality === "Good"
                                      ? "bg-blue-500"
                                      : "bg-red-500"
                                } text-white`}
                              >
                                {typeData?.quality}
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-600">
                              <div className="flex items-center justify-between">
                                <span>
                                  {periodData.start} - {periodData.end}
                                </span>
                                {periodData.duration && (
                                  <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                                    {periodData.duration}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      },
                    )}
                  </CardContent>
                </Card>

                {/* Night Choghadiya */}
                <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-2xl text-center text-orange-600 flex items-center justify-center gap-2">
                      <Moon className="h-6 w-6" />
                      Night Choghadiya
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {choghadiyaData.data?.night_choghadiya?.map(
                      (periodData: any, index: number) => {
                        const typeData = choghadiyaTypes.find(
                          (t) => t.name === periodData.period,
                        );
                        return (
                          <div
                            key={index}
                            className={`p-4 rounded-lg bg-gradient-to-r ${typeData?.color} bg-opacity-20 border border-opacity-30`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-bold text-lg">
                                {periodData.period}
                              </span>
                              <Badge
                                className={`${
                                  typeData?.quality === "Excellent"
                                    ? "bg-green-500"
                                    : typeData?.quality === "Good"
                                      ? "bg-blue-500"
                                      : "bg-red-500"
                                } text-white`}
                              >
                                {typeData?.quality}
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-600">
                              <div className="flex items-center justify-between">
                                <span>
                                  {periodData.start} - {periodData.end}
                                </span>
                                {periodData.duration && (
                                  <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                                    {periodData.duration}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      },
                    )}
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

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
                  <Clock className="h-6 w-6" />
                  About Choghadiya
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  Choghadiya is an ancient Vedic time division system that
                  divides day and night into 8 periods each. It helps determine
                  auspicious and inauspicious times for various activities.
                </p>
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900">Key Features:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    <li>8 periods each for day and night</li>
                    <li>Based on planetary rulers</li>
                    <li>Varies by location and date</li>
                    <li>Helps in daily activity planning</li>
                    <li>Traditional business planning tool</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-orange-600 flex items-center gap-2">
                  <Star className="h-6 w-6" />
                  Usage Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Best Times</p>
                      <p className="text-sm text-gray-600">
                        Amrit, Shubh, Labh, and Char are considered favorable
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">
                        Avoid These Times
                      </p>
                      <p className="text-sm text-gray-600">
                        Kaal, Rog, and Udveg periods should be avoided for
                        important work
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Timer className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">
                        Daily Planning
                      </p>
                      <p className="text-sm text-gray-600">
                        Use Choghadiya for timing meetings, travel, and business
                        activities
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
