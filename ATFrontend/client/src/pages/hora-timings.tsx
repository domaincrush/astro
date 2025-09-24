import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { Button } from "src/components/ui/button";
import { Badge } from "src/components/ui/badge";
import {
  Clock,
  Calendar,
  MapPin,
  Sun,
  Moon,
  Star,
  Heart,
  Coins,
  Briefcase,
  GraduationCap,
  Shield,
} from "lucide-react";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";
import { LocationSearch } from "src/components/LocationSearch";

export default function HoraTimings() {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [location, setLocation] = useState<string>("");
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [horaData, setHoraData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const planetaryHoras = [
    {
      planet: "Sun",
      sanskrit: "Surya",
      color: "from-orange-400 to-red-500",
      icon: Sun,
      qualities: ["Leadership", "Authority", "Government"],
      activities: ["Meeting officials", "Government work", "Leadership roles"],
      avoid: ["Humility required tasks", "Subordinate work"],
      element: "Fire",
      nature: "Hot & Dry",
    },
    {
      planet: "Venus",
      sanskrit: "Shukra",
      color: "from-pink-400 to-purple-500",
      icon: Heart,
      qualities: ["Love", "Beauty", "Luxury"],
      activities: ["Romance", "Art", "Beauty treatments", "Shopping"],
      avoid: ["Harsh negotiations", "Conflicts"],
      element: "Water",
      nature: "Cool & Moist",
    },
    {
      planet: "Mercury",
      sanskrit: "Budha",
      color: "from-green-400 to-teal-500",
      icon: GraduationCap,
      qualities: ["Communication", "Learning", "Business"],
      activities: ["Study", "Writing", "Business deals", "Communication"],
      avoid: ["Long-term commitments", "Slow processes"],
      element: "Earth",
      nature: "Neutral",
    },
    {
      planet: "Moon",
      sanskrit: "Chandra",
      color: "from-blue-400 to-cyan-500",
      icon: Moon,
      qualities: ["Emotions", "Intuition", "Care"],
      activities: ["Family time", "Emotional healing", "Care activities"],
      avoid: ["Logical decisions", "Harsh actions"],
      element: "Water",
      nature: "Cool & Moist",
    },
    {
      planet: "Saturn",
      sanskrit: "Shani",
      color: "from-gray-400 to-slate-600",
      icon: Shield,
      qualities: ["Discipline", "Hard work", "Patience"],
      activities: ["Labor work", "Discipline", "Long-term planning"],
      avoid: ["Quick decisions", "Hasty actions"],
      element: "Earth",
      nature: "Cold & Dry",
    },
    {
      planet: "Jupiter",
      sanskrit: "Guru",
      color: "from-yellow-400 to-orange-500",
      icon: Star,
      qualities: ["Wisdom", "Knowledge", "Spirituality"],
      activities: ["Learning", "Teaching", "Spiritual practices", "Advice"],
      avoid: ["Materialistic pursuits", "Selfish acts"],
      element: "Fire",
      nature: "Hot & Moist",
    },
    {
      planet: "Mars",
      sanskrit: "Mangal",
      color: "from-red-400 to-pink-500",
      icon: Briefcase,
      qualities: ["Energy", "Action", "Courage"],
      activities: ["Sports", "Competition", "Action-oriented tasks"],
      avoid: ["Peaceful negotiations", "Calm activities"],
      element: "Fire",
      nature: "Hot & Dry",
    },
  ];

  const handleLocationSelect = (locationData: any) => {
    setLocation(locationData.place_name || locationData.display);
    setCoordinates({ lat: locationData.latitude, lng: locationData.longitude });
  };

  const getHoraTimings = async () => {
    if (!location || !coordinates) return;

    setLoading(true);
    try {
      const response = await fetch("/api/panchang/hora-timings", {
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
        setHoraData(data);
      }
    } catch (error) {
      console.error("Error fetching hora timings:", error);
    } finally {
      setLoading(false);
    }
  };

  // Mock current hora for demonstration
  const getCurrentHora = () => {
    const hour = currentTime.getHours();
    const planetIndex = hour % 7;
    return planetaryHoras[planetIndex];
  };

  const currentHora = getCurrentHora();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
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
              <Clock className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Hora Timings Calculator
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Planetary hour calculations for optimal timing based on ancient
              Vedic astrology
            </p>
            <div className="flex items-center justify-center gap-2 text-2xl font-bold text-purple-600">
              <Clock className="h-6 w-6" />
              {currentTime.toLocaleTimeString()}
            </div>
          </motion.div>

          {/* Current Hora Display */}
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
                  Current Planetary Hora
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <div
                  className={`inline-block px-8 py-6 rounded-xl bg-gradient-to-r ${currentHora.color} text-white shadow-lg`}
                >
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <currentHora.icon className="h-10 w-10" />
                    <div>
                      <div className="text-3xl font-bold">
                        {currentHora.planet}
                      </div>
                      <div className="text-lg opacity-90">
                        {currentHora.sanskrit}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-semibold">Element</p>
                      <p>{currentHora.element}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Nature</p>
                      <p>{currentHora.nature}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">Qualities</h4>
                    <div className="space-y-1">
                      {currentHora.qualities.map((quality, idx) => (
                        <Badge key={idx} variant="secondary">
                          {quality}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">
                      Favorable Activities
                    </h4>
                    <div className="space-y-1">
                      {currentHora.activities.map((activity, idx) => (
                        <div key={idx} className="text-xs text-gray-600">
                          • {activity}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">Avoid</h4>
                    <div className="space-y-1">
                      {currentHora.avoid.map((avoid, idx) => (
                        <div key={idx} className="text-xs text-gray-600">
                          • {avoid}
                        </div>
                      ))}
                    </div>
                  </div>
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
                  Get Daily Hora Timings
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                  onClick={getHoraTimings}
                  disabled={!location || loading}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold py-3 text-lg"
                >
                  {loading ? "Calculating..." : "Get Hora Timings"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Planetary Hora Guide */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
              Planetary Hora Guide
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {planetaryHoras.map((hora, index) => {
                const Icon = hora.icon;
                return (
                  <motion.div
                    key={hora.planet}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ scale: 1.05 }}
                    className="relative overflow-hidden rounded-xl shadow-lg"
                  >
                    <div
                      className={`bg-gradient-to-r ${hora.color} p-6 text-white h-full`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-2xl font-bold">{hora.planet}</h3>
                          <p className="text-sm opacity-90">{hora.sanskrit}</p>
                        </div>
                        <Icon className="h-10 w-10" />
                      </div>

                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-semibold mb-1">
                            Element & Nature
                          </p>
                          <p className="text-xs opacity-90">
                            {hora.element} • {hora.nature}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm font-semibold mb-1">
                            Key Qualities
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {hora.qualities.map((quality, idx) => (
                              <Badge
                                key={idx}
                                className="bg-white/20 text-white text-xs"
                              >
                                {quality}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-semibold mb-1">
                            Best Activities
                          </p>
                          <ul className="text-xs space-y-1">
                            {hora.activities
                              .slice(0, 3)
                              .map((activity, idx) => (
                                <li
                                  key={idx}
                                  className="flex items-center gap-1"
                                >
                                  <div className="w-1 h-1 bg-white rounded-full"></div>
                                  {activity}
                                </li>
                              ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* API Results Display */}
          {horaData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mb-12"
            >
              <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl text-center text-purple-600 flex items-center justify-center gap-2">
                    <Clock className="h-6 w-6" />
                    Planetary Hora Timings for {horaData.data?.date}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {horaData.data?.hora_timings?.map(
                      (horaItem: any, index: number) => {
                        const planetData =
                          planetaryHoras.find(
                            (p) => p.planet === horaItem.planet,
                          ) || planetaryHoras[0];
                        const Icon = planetData.icon;
                        return (
                          <div
                            key={index}
                            className={`p-4 rounded-lg bg-gradient-to-r ${planetData.color} bg-opacity-20 border border-opacity-30`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <Icon className="h-6 w-6" />
                                <div>
                                  <span className="font-bold text-lg">
                                    {horaItem.planet}
                                  </span>
                                  <span className="text-sm text-gray-600 ml-2">
                                    ({planetData.sanskrit})
                                  </span>
                                </div>
                              </div>
                              <Badge
                                className={`${
                                  horaItem.quality === "Excellent"
                                    ? "bg-green-500"
                                    : horaItem.quality === "Good"
                                      ? "bg-blue-500"
                                      : horaItem.quality === "Moderate"
                                        ? "bg-yellow-500"
                                        : "bg-gray-500"
                                } text-white`}
                              >
                                {horaItem.quality}
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-600">
                              <div className="flex items-center justify-between">
                                <span>
                                  {horaItem.start} - {horaItem.end}
                                </span>
                                {horaItem.duration && (
                                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                                    {horaItem.duration}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      },
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Hora Sequence Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mb-12"
          >
            <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-center text-purple-600 flex items-center justify-center gap-2">
                  <Clock className="h-6 w-6" />
                  Daily Hora Sequence Guide
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Sun className="h-5 w-5 text-yellow-500" />
                      Day Hours (Sunrise to Sunset)
                    </h3>
                    <div className="space-y-2">
                      {[0, 1, 2, 3, 4, 5].map((hour) => {
                        const planeta = planetaryHoras[hour % 7];
                        return (
                          <div
                            key={hour}
                            className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg"
                          >
                            <div className="w-8 h-8 bg-yellow-200 rounded-full flex items-center justify-center text-sm font-bold">
                              {hour + 1}
                            </div>
                            <div className="flex-1">
                              <span className="font-medium">
                                {planeta.planet}
                              </span>
                              <span className="text-sm text-gray-600 ml-2">
                                ({planeta.sanskrit})
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Moon className="h-5 w-5 text-blue-500" />
                      Night Hours (Sunset to Sunrise)
                    </h3>
                    <div className="space-y-2">
                      {[0, 1, 2, 3, 4, 5].map((hour) => {
                        const planeta = planetaryHoras[(hour + 5) % 7];
                        return (
                          <div
                            key={hour}
                            className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg"
                          >
                            <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center text-sm font-bold">
                              {hour + 1}
                            </div>
                            <div className="flex-1">
                              <span className="font-medium">
                                {planeta.planet}
                              </span>
                              <span className="text-sm text-gray-600 ml-2">
                                ({planeta.sanskrit})
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
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
                <CardTitle className="text-xl text-purple-600 flex items-center gap-2">
                  <Star className="h-6 w-6" />
                  About Hora System
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  The Hora system divides day and night into planetary hours,
                  each ruled by a specific planet. This ancient system helps
                  determine the best timing for various activities.
                </p>
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900">Key Features:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    <li>12 day hours and 12 night hours</li>
                    <li>Each hour ruled by a planet</li>
                    <li>Sequence changes daily</li>
                    <li>Based on sunrise and sunset</li>
                    <li>Influences activity outcomes</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-purple-600 flex items-center gap-2">
                  <Clock className="h-6 w-6" />
                  Practical Usage
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Sun className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">
                        Business Activities
                      </p>
                      <p className="text-sm text-gray-600">
                        Use Mercury or Jupiter hours for business meetings
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Heart className="h-5 w-5 text-pink-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">
                        Romantic Activities
                      </p>
                      <p className="text-sm text-gray-600">
                        Venus hours are ideal for love and relationships
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Briefcase className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">
                        Physical Activities
                      </p>
                      <p className="text-sm text-gray-600">
                        Mars hours are perfect for sports and competitions
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
