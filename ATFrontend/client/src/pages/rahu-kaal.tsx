import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { Button } from "src/components/ui/button";
import { Badge } from "src/components/ui/badge";
import {
  AlertTriangle,
  Clock,
  Calendar,
  MapPin,
  Sun,
  Moon,
  Star,
  Shield,
  X,
  CheckCircle,
} from "lucide-react";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";
import { LocationSearch } from "src/components/LocationSearch";

export default function RahuKaal() {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [location, setLocation] = useState<string>("");
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [rahuKaalData, setRahuKaalData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const weeklyRahuKaal = [
    {
      day: "Monday",
      time: "7:30 AM - 9:00 AM",
      duration: "1h 30m",
      color: "from-red-400 to-pink-500",
    },
    {
      day: "Tuesday",
      time: "3:00 PM - 4:30 PM",
      duration: "1h 30m",
      color: "from-orange-400 to-red-500",
    },
    {
      day: "Wednesday",
      time: "12:00 PM - 1:30 PM",
      duration: "1h 30m",
      color: "from-yellow-400 to-orange-500",
    },
    {
      day: "Thursday",
      time: "1:30 PM - 3:00 PM",
      duration: "1h 30m",
      color: "from-green-400 to-teal-500",
    },
    {
      day: "Friday",
      time: "10:30 AM - 12:00 PM",
      duration: "1h 30m",
      color: "from-blue-400 to-indigo-500",
    },
    {
      day: "Saturday",
      time: "9:00 AM - 10:30 AM",
      duration: "1h 30m",
      color: "from-purple-400 to-pink-500",
    },
    {
      day: "Sunday",
      time: "4:30 PM - 6:00 PM",
      duration: "1h 30m",
      color: "from-indigo-400 to-purple-500",
    },
  ];

  const avoidActivities = [
    { activity: "Starting new ventures", icon: Star, severity: "high" },
    { activity: "Important meetings", icon: Clock, severity: "high" },
    { activity: "Travel and journeys", icon: MapPin, severity: "high" },
    { activity: "Financial transactions", icon: Shield, severity: "high" },
    { activity: "Job interviews", icon: CheckCircle, severity: "medium" },
    { activity: "Medical procedures", icon: AlertTriangle, severity: "medium" },
    { activity: "House warming", icon: Sun, severity: "medium" },
    { activity: "Marriage ceremonies", icon: Moon, severity: "high" },
  ];

  const allowedActivities = [
    { activity: "Routine office work", icon: Clock },
    { activity: "Household chores", icon: Sun },
    { activity: "Reading and studying", icon: Star },
    { activity: "Meditation and prayer", icon: Moon },
    { activity: "Rest and relaxation", icon: Shield },
    { activity: "Emergency situations", icon: AlertTriangle },
  ];

  const handleLocationSelect = (locationData: any) => {
    setLocation(locationData.place_name || locationData.display);
    setCoordinates({ lat: locationData.latitude, lng: locationData.longitude });
  };

  const getRahuKaal = async () => {
    if (!location || !coordinates) return;

    setLoading(true);
    try {
      const response = await fetch("/api/panchang/rahu-kaal", {
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
        setRahuKaalData(data);
      }
    } catch (error) {
      console.error("Error fetching Rahu Kaal:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentDayRahuKaal = () => {
    const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
    return weeklyRahuKaal.find((day) => day.day === today);
  };

  const currentDayRahuKaal = getCurrentDayRahuKaal();

  const isCurrentlyRahuKaal = () => {
    if (!currentDayRahuKaal) return false;
    const now = currentTime.toTimeString().slice(0, 5);
    const [startTime, endTime] = currentDayRahuKaal.time.split(" - ");
    return now >= startTime && now <= endTime;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      <AstroTickHeader />

      <main className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-red-500 to-orange-600 rounded-full mb-6 shadow-2xl">
              <AlertTriangle className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Rahu Kaal Calculator
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Find daily Rahu Kaal timings - the inauspicious period to avoid
              for important activities
            </p>
            <div className="flex items-center justify-center gap-2 text-2xl font-bold text-red-600">
              <Clock className="h-6 w-6" />
              {currentTime.toLocaleTimeString()}
            </div>
          </motion.div>

          {/* Current Status Alert */}
          {isCurrentlyRahuKaal() && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-12"
            >
              <div className="max-w-2xl mx-auto">
                <div className="bg-gradient-to-r from-red-500 to-orange-600 text-white p-6 rounded-xl shadow-2xl border border-red-200">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <AlertTriangle className="h-8 w-8 animate-pulse" />
                    <h2 className="text-2xl font-bold">RAHU KAAL ACTIVE</h2>
                  </div>
                  <p className="text-center text-lg mb-4">
                    Current time is within Rahu Kaal period. Avoid starting
                    important activities.
                  </p>
                  <div className="text-center">
                    <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 text-lg">
                      {currentDayRahuKaal?.time}
                    </Badge>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Today's Rahu Kaal */}
          {currentDayRahuKaal && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-12"
            >
              <Card className="max-w-2xl mx-auto shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl text-center text-red-600 flex items-center justify-center gap-2">
                    <Sun className="h-6 w-6" />
                    Today's Rahu Kaal
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div
                    className={`inline-block px-8 py-4 rounded-xl bg-gradient-to-r ${currentDayRahuKaal.color} text-white shadow-lg`}
                  >
                    <div className="text-2xl font-bold mb-2">
                      {currentDayRahuKaal.day}
                    </div>
                    <div className="text-xl">{currentDayRahuKaal.time}</div>
                    <div className="text-sm opacity-90">
                      Duration: {currentDayRahuKaal.duration}
                    </div>
                  </div>
                  <Badge
                    className={`${
                      isCurrentlyRahuKaal() ? "bg-red-500" : "bg-green-500"
                    } text-white px-4 py-2 text-lg`}
                  >
                    {isCurrentlyRahuKaal() ? "Currently Active" : "Not Active"}
                  </Badge>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Input Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-12"
          >
            <Card className="max-w-2xl mx-auto shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-center text-red-600 flex items-center justify-center gap-2">
                  <Calendar className="h-6 w-6" />
                  Get Rahu Kaal Timing
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
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
                  onClick={getRahuKaal}
                  disabled={!location || loading}
                  className="w-full bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white font-semibold py-3 text-lg"
                >
                  {loading ? "Calculating..." : "Get Rahu Kaal Timing"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* API Results Display */}
          {rahuKaalData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-12"
            >
              <Card className="max-w-3xl mx-auto shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl text-center text-red-600 flex items-center justify-center gap-2">
                    <AlertTriangle className="h-6 w-6" />
                    Rahu Kaal Timing for {rahuKaalData.data?.date}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-6">
                  <div className="inline-block px-8 py-6 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg">
                    <div className="text-3xl font-bold mb-2">
                      {rahuKaalData.data?.rahu_kaal?.start} -{" "}
                      {rahuKaalData.data?.rahu_kaal?.end}
                    </div>
                    <div className="text-lg mb-2">
                      Duration:{" "}
                      {rahuKaalData.data?.duration || "Calculated duration"}
                    </div>
                    <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
                      Avoid Important Activities
                    </Badge>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-lg font-semibold text-red-600">
                    <MapPin className="h-5 w-5" />
                    {location}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Weekly Rahu Kaal Schedule */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
              Weekly Rahu Kaal Schedule
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {weeklyRahuKaal.map((day, index) => (
                <motion.div
                  key={day.day}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.05 }}
                  className={`relative overflow-hidden rounded-xl shadow-lg ${
                    currentDayRahuKaal?.day === day.day
                      ? "ring-4 ring-red-400"
                      : ""
                  }`}
                >
                  <div
                    className={`bg-gradient-to-r ${day.color} p-6 text-white`}
                  >
                    <div className="text-center">
                      <h3 className="text-xl font-bold mb-2">{day.day}</h3>
                      <div className="text-lg font-semibold mb-1">
                        {day.time}
                      </div>
                      <div className="text-sm opacity-90">{day.duration}</div>
                      {currentDayRahuKaal?.day === day.day && (
                        <Badge className="mt-2 bg-white/20 text-white border-white/30">
                          Today
                        </Badge>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Activities to Avoid and Allow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="mb-12"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Avoid Activities */}
              <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl text-center text-red-600 flex items-center justify-center gap-2">
                    <X className="h-6 w-6" />
                    Avoid During Rahu Kaal
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {avoidActivities.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-3 bg-red-50 rounded-lg border border-red-200"
                      >
                        <div className="flex-shrink-0">
                          <Icon className="h-6 w-6 text-red-600" />
                        </div>
                        <div className="flex-1">
                          <span className="font-medium text-gray-900">
                            {item.activity}
                          </span>
                        </div>
                        <Badge
                          className={`${
                            item.severity === "high"
                              ? "bg-red-500"
                              : "bg-orange-500"
                          } text-white`}
                        >
                          {item.severity}
                        </Badge>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Allowed Activities */}
              <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl text-center text-green-600 flex items-center justify-center gap-2">
                    <CheckCircle className="h-6 w-6" />
                    Allowed During Rahu Kaal
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {allowedActivities.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-3 bg-green-50 rounded-lg border border-green-200"
                      >
                        <div className="flex-shrink-0">
                          <Icon className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <span className="font-medium text-gray-900">
                            {item.activity}
                          </span>
                        </div>
                        <Badge className="bg-green-500 text-white">Safe</Badge>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
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
                <CardTitle className="text-xl text-red-600 flex items-center gap-2">
                  <AlertTriangle className="h-6 w-6" />
                  What is Rahu Kaal?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  Rahu Kaal is an inauspicious period in Hindu astrology ruled
                  by the shadow planet Rahu. It's calculated based on sunrise
                  and sunset times, varying daily by location.
                </p>
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900">
                    Key Characteristics:
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    <li>Duration: Approximately 1.5 hours daily</li>
                    <li>Timing varies by day of the week</li>
                    <li>Location-specific calculations</li>
                    <li>Considered inauspicious for new ventures</li>
                    <li>Based on planetary positions</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-red-600 flex items-center gap-2">
                  <Shield className="h-6 w-6" />
                  Traditional Beliefs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Star className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">
                        Astronomical Basis
                      </p>
                      <p className="text-sm text-gray-600">
                        Based on the position of Rahu, the ascending lunar node
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">
                        Daily Variation
                      </p>
                      <p className="text-sm text-gray-600">
                        Each day has different Rahu Kaal timing based on weekday
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Moon className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">
                        Cultural Impact
                      </p>
                      <p className="text-sm text-gray-600">
                        Widely observed in Indian culture for timing activities
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
