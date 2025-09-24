import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Clock, Sun, Moon, Star, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { Button } from "src/components/ui/button";
import { Badge } from "src/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "src/components/ui/select";
import AstroTickHeader from "src/components/layout/AstroTickHeader";

interface HoraPeriod {
  planet: string;
  start: string;
  end: string;
  effect: string;
  activities: string[];
  avoid: string[];
}

const HoraTimings: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState("Delhi");
  const [horaData, setHoraData] = useState<HoraPeriod[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentHora, setCurrentHora] = useState<HoraPeriod | null>(null);

  const cities = [
    "Delhi",
    "Mumbai",
    "Chennai",
    "Kolkata",
    "Bangalore",
    "Hyderabad",
    "Pune",
    "Ahmedabad",
    "Jaipur",
    "Lucknow",
    "Varanasi",
    "Rishikesh",
  ];

  const getPlanetColor = (planet: string) => {
    switch (planet.toLowerCase()) {
      case "sun":
        return "bg-orange-100 text-orange-800";
      case "moon":
        return "bg-blue-100 text-blue-800";
      case "mars":
        return "bg-red-100 text-red-800";
      case "mercury":
        return "bg-green-100 text-green-800";
      case "jupiter":
        return "bg-yellow-100 text-yellow-800";
      case "venus":
        return "bg-pink-100 text-pink-800";
      case "saturn":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCurrentHora = () => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    for (const period of horaData) {
      const [startHour, startMinute] = period.start.split(":").map(Number);
      const [endHour, endMinute] = period.end.split(":").map(Number);
      const startTime = startHour * 60 + startMinute;
      const endTime = endHour * 60 + endMinute;

      if (currentTime >= startTime && currentTime < endTime) {
        return period;
      }
    }

    return null;
  };

  const fetchHoraData = async () => {
    setLoading(true);
    try {
      // For demo purposes, providing sample hora data
      const sampleHora: HoraPeriod[] = [
        {
          planet: "Sun",
          start: "05:53",
          end: "06:53",
          effect: "Powerful and authoritative",
          activities: [
            "Government work",
            "Leadership decisions",
            "Father-related matters",
            "Health treatments",
          ],
          avoid: [
            "Starting new business",
            "Buying property",
            "Marriage ceremonies",
          ],
        },
        {
          planet: "Venus",
          start: "06:53",
          end: "07:53",
          effect: "Harmonious and creative",
          activities: [
            "Art and music",
            "Romance",
            "Beauty treatments",
            "Luxury purchases",
          ],
          avoid: ["Harsh decisions", "Conflicts", "Surgery"],
        },
        {
          planet: "Mercury",
          start: "07:53",
          end: "08:53",
          effect: "Intellectual and communicative",
          activities: [
            "Education",
            "Writing",
            "Business deals",
            "Travel",
            "Communication",
          ],
          avoid: ["Emotional decisions", "Spiritual practices", "Rest"],
        },
        {
          planet: "Moon",
          start: "08:53",
          end: "09:53",
          effect: "Emotional and nurturing",
          activities: [
            "Mother-related matters",
            "Water activities",
            "Emotional healing",
            "Cooking",
          ],
          avoid: ["Important decisions", "Signing contracts", "Surgery"],
        },
        {
          planet: "Saturn",
          start: "09:53",
          end: "10:53",
          effect: "Disciplined and restrictive",
          activities: [
            "Hard work",
            "Patience required tasks",
            "Spiritual practices",
            "Discipline",
          ],
          avoid: ["Celebrations", "New ventures", "Marriage", "Travel"],
        },
        {
          planet: "Jupiter",
          start: "10:53",
          end: "11:53",
          effect: "Auspicious and expansive",
          activities: [
            "Education",
            "Spiritual practices",
            "Religious ceremonies",
            "Wisdom seeking",
          ],
          avoid: ["Illegal activities", "Conflicts", "Negative thoughts"],
        },
        {
          planet: "Mars",
          start: "11:53",
          end: "12:53",
          effect: "Energetic and aggressive",
          activities: [
            "Physical exercise",
            "Competition",
            "Property matters",
            "Surgery",
          ],
          avoid: ["Peaceful negotiations", "Meditation", "Gentle activities"],
        },
        {
          planet: "Sun",
          start: "12:53",
          end: "13:53",
          effect: "Powerful and authoritative",
          activities: [
            "Government work",
            "Leadership decisions",
            "Father-related matters",
            "Health treatments",
          ],
          avoid: [
            "Starting new business",
            "Buying property",
            "Marriage ceremonies",
          ],
        },
        {
          planet: "Venus",
          start: "13:53",
          end: "14:53",
          effect: "Harmonious and creative",
          activities: [
            "Art and music",
            "Romance",
            "Beauty treatments",
            "Luxury purchases",
          ],
          avoid: ["Harsh decisions", "Conflicts", "Surgery"],
        },
        {
          planet: "Mercury",
          start: "14:53",
          end: "15:53",
          effect: "Intellectual and communicative",
          activities: [
            "Education",
            "Writing",
            "Business deals",
            "Travel",
            "Communication",
          ],
          avoid: ["Emotional decisions", "Spiritual practices", "Rest"],
        },
        {
          planet: "Moon",
          start: "15:53",
          end: "16:53",
          effect: "Emotional and nurturing",
          activities: [
            "Mother-related matters",
            "Water activities",
            "Emotional healing",
            "Cooking",
          ],
          avoid: ["Important decisions", "Signing contracts", "Surgery"],
        },
        {
          planet: "Saturn",
          start: "16:53",
          end: "17:53",
          effect: "Disciplined and restrictive",
          activities: [
            "Hard work",
            "Patience required tasks",
            "Spiritual practices",
            "Discipline",
          ],
          avoid: ["Celebrations", "New ventures", "Marriage", "Travel"],
        },
      ];

      setHoraData(sampleHora);
    } catch (error) {
      console.error("Error fetching hora data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHoraData();
  }, [selectedCity]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHora(getCurrentHora());
    }, 60000); // Update every minute

    setCurrentHora(getCurrentHora());
    return () => clearInterval(interval);
  }, [horaData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <Helmet>
        <title>Hora Timings - Planetary Hours | AstroTick</title>
        <meta
          name="description"
          content="Planetary hour calculations for Venus, Jupiter, Mercury effects on daily activities with authentic Vedic timing."
        />
        <meta
          name="keywords"
          content="hora timings, planetary hours, vedic time, sun hora, moon hora, mercury hora"
        />
      </Helmet>

      <AstroTickHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center items-center gap-3 mb-4">
              <Clock className="h-8 w-8 text-indigo-600" />
              <h1 className="text-4xl font-bold text-gray-900">Hora Timings</h1>
              <Star className="h-8 w-8 text-indigo-600" />
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Planetary hour calculations for Venus, Jupiter, Mercury effects on
              daily activities
            </p>
          </div>

          {/* City Selector */}
          <div className="flex justify-center mb-8">
            <Card className="w-full max-w-md">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>Select City</span>
                  </div>
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose city" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Current Hora Status */}
          {currentHora && (
            <div className="mb-8">
              <Card className="bg-gradient-to-r from-indigo-100 to-purple-100 border-indigo-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-indigo-800">
                        Current Hora
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getPlanetColor(currentHora.planet)}>
                          {currentHora.planet}
                        </Badge>
                        <span className="text-indigo-600">
                          {currentHora.start} - {currentHora.end}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <h3 className="text-lg font-semibold text-indigo-800">
                        Effect
                      </h3>
                      <p className="text-indigo-600">{currentHora.effect}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Hora Timeline */}
          <div className="grid gap-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600">Loading hora timings...</p>
              </div>
            ) : horaData.length > 0 ? (
              horaData.map((hora, index) => (
                <Card
                  key={index}
                  className={`hover:shadow-lg transition-shadow ${
                    currentHora?.planet === hora.planet &&
                    currentHora?.start === hora.start
                      ? "ring-2 ring-indigo-500 bg-indigo-50"
                      : ""
                  }`}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl text-gray-900 flex items-center gap-2">
                          {hora.planet} Hora
                          <Badge className={getPlanetColor(hora.planet)}>
                            {hora.planet}
                          </Badge>
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">
                            {hora.start} - {hora.end}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Effect
                        </h4>
                        <p className="text-gray-700">{hora.effect}</p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-green-800 mb-2">
                            Favorable Activities
                          </h4>
                          <ul className="space-y-1 text-sm text-gray-700">
                            {hora.activities.map((activity, idx) => (
                              <li key={idx} className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                {activity}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold text-red-800 mb-2">
                            Activities to Avoid
                          </h4>
                          <ul className="space-y-1 text-sm text-gray-700">
                            {hora.avoid.map((activity, idx) => (
                              <li key={idx} className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                                {activity}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No hora data available</p>
              </div>
            )}
          </div>

          {/* Educational Content */}
          <div className="mt-12">
            <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
              <CardHeader>
                <CardTitle className="text-xl text-indigo-800">
                  About Hora System
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-gray-700">
                  <p>
                    Hora is a traditional Vedic system that divides the day into
                    planetary hours, each ruled by a different planet. These
                    planetary influences affect the success of various
                    activities undertaken during their respective periods.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-indigo-800 mb-2">
                        Planetary Sequence
                      </h4>
                      <ul className="space-y-1 text-sm">
                        <li>
                          <strong>Sun:</strong> Authority, government, health
                        </li>
                        <li>
                          <strong>Venus:</strong> Love, beauty, arts, luxury
                        </li>
                        <li>
                          <strong>Mercury:</strong> Communication, trade,
                          education
                        </li>
                        <li>
                          <strong>Moon:</strong> Emotions, mother, water
                        </li>
                        <li>
                          <strong>Saturn:</strong> Discipline, hard work, delays
                        </li>
                        <li>
                          <strong>Jupiter:</strong> Wisdom, spirituality,
                          expansion
                        </li>
                        <li>
                          <strong>Mars:</strong> Energy, conflict, property
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-indigo-800 mb-2">
                        Usage Guidelines
                      </h4>
                      <ul className="space-y-1 text-sm">
                        <li>
                          Plan important activities during favorable horas
                        </li>
                        <li>
                          Avoid critical decisions during unfavorable periods
                        </li>
                        <li>Use planetary energies to enhance success</li>
                        <li>
                          Combine with other muhurat systems for best results
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HoraTimings;
