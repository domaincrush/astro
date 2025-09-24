import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Calendar,
  Clock,
  Star,
  Compass,
  Shield,
  Route,
  Plane,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import { Label } from "src/components/ui/label";
import { LocationSearch } from "src/components/LocationSearch";

function JourneyStartMuhurat() {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [location, setLocation] = useState<string>("");
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [muhuratData, setMuhuratData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleLocationSelect = (locationData: any) => {
    setLocation(locationData.place_name || locationData.display);
    setCoordinates({ lat: locationData.latitude, lng: locationData.longitude });
  };

  const findMuhurat = async () => {
    if (!location || !coordinates) return;

    setLoading(true);
    try {
      const response = await fetch("/api/panchang/shubh-muhurat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activity: "journey_start",
          date: selectedDate,
          location: location,
          latitude: coordinates.lat,
          longitude: coordinates.lng,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMuhuratData(data.success ? data.data : data);
      }
    } catch (error) {
      console.error("Error fetching muhurat:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <Helmet>
        <title>Journey Start Muhurat - Travel Timing | AstroTick</title>
        <meta
          name="description"
          content="Find the most auspicious timing for starting your journey or travel with authentic Vedic calculations. Ensure safe and successful trips."
        />
        <meta
          name="keywords"
          content="journey start muhurat, travel timing, trip planning astrology, auspicious travel time, journey muhurat calculator"
        />
        <link
          rel="canonical"
          href="https://astrotick.com/muhurat/journey-start"
        />
      </Helmet>

      <AstroTickHeader />

      <main className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex justify-center items-center gap-3 mb-6">
              <Compass className="h-12 w-12 text-cyan-600" />
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900">
                Journey Start Muhurat
              </h1>
              <Compass className="h-12 w-12 text-cyan-600" />
            </div>
            <p className="md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Find the most auspicious timing for starting your journey or
              travel with authentic Vedic calculations. Ensure safe travels,
              successful outcomes, and pleasant experiences during your trips.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Muhurat Calculator */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Calendar className="h-6 w-6" />
                    Journey Start Calculator
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="date"
                      className="text-sm font-medium text-gray-700"
                    >
                      Select Journey Date
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full"
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Starting Location
                    </Label>
                    <LocationSearch onLocationSelect={handleLocationSelect} />
                    {location && (
                      <p className="text-sm text-green-600 flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {location}
                      </p>
                    )}
                  </div>

                  <Button
                    onClick={findMuhurat}
                    disabled={!location || loading}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white py-3 text-lg font-semibold rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Calculating...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5" />
                        Find Auspicious Time
                      </div>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Journey Start Significance */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm h-full">
                <CardHeader className="bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Route className="h-6 w-6" />
                    Significance of Journey Muhurat
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="flex items-start gap-3">
                      <Shield className="h-6 w-6 text-cyan-500 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">
                          Safe Travel
                        </h3>
                        <p className="text-gray-600">
                          Choosing the right muhurat ensures protection from
                          accidents and travel hazards.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Plane className="h-6 w-6 text-blue-500 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">
                          Smooth Journey
                        </h3>
                        <p className="text-gray-600">
                          An auspicious start time ensures minimal delays and
                          comfortable travel experiences.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Route className="h-6 w-6 text-orange-500 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">
                          Successful Outcomes
                        </h3>
                        <p className="text-gray-600">
                          Vedic timing helps achieve the purpose of your journey
                          successfully.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Results Display */}
          {muhuratData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-t-lg">
                  <CardTitle className="text-xl">
                    Your Journey Start Muhurat Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg text-gray-900">
                        Auspicious Journey Start Timings
                      </h3>
                      <div className="grid gap-4">
                        {muhuratData.muhurats?.map(
                          (muhurat: any, index: number) => (
                            <div
                              key={index}
                              className={`p-4 rounded-lg border ${
                                muhurat.quality === "Excellent"
                                  ? "bg-green-50 border-green-200"
                                  : muhurat.quality === "Good"
                                    ? "bg-blue-50 border-blue-200"
                                    : "bg-orange-50 border-orange-200"
                              }`}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <p
                                  className={`font-medium ${
                                    muhurat.quality === "Excellent"
                                      ? "text-green-800"
                                      : muhurat.quality === "Good"
                                        ? "text-blue-800"
                                        : "text-orange-800"
                                  }`}
                                >
                                  {muhurat.start} - {muhurat.end}
                                </p>
                                <span
                                  className={`px-2 py-1 text-xs rounded-full ${
                                    muhurat.quality === "Excellent"
                                      ? "bg-green-200 text-green-800"
                                      : muhurat.quality === "Good"
                                        ? "bg-blue-200 text-blue-800"
                                        : "bg-orange-200 text-orange-800"
                                  }`}
                                >
                                  {muhurat.quality}
                                </span>
                              </div>
                              <p
                                className={`text-sm ${
                                  muhurat.quality === "Excellent"
                                    ? "text-green-600"
                                    : muhurat.quality === "Good"
                                      ? "text-blue-600"
                                      : "text-orange-600"
                                }`}
                              >
                                Duration: {muhurat.duration}
                              </p>
                            </div>
                          ),
                        )}
                      </div>
                    </div>

                    <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                      <h4 className="font-medium text-amber-800 mb-2">
                        Calculation Method
                      </h4>
                      <p className="text-amber-700 text-sm">
                        {muhuratData.calculation_method}
                      </p>
                      <p className="text-amber-600 text-xs mt-1">
                        Date: {muhuratData.date} | Location:{" "}
                        {muhuratData.location}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Additional Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid md:grid-cols-3 gap-8"
          >
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="bg-cyan-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Compass className="h-8 w-8 text-cyan-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Perfect Direction
                </h3>
                <p className="text-gray-600 text-sm">
                  Start your journey with the best astrological guidance
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Safe Travels
                </h3>
                <p className="text-gray-600 text-sm">
                  Ensure protection and safety throughout your journey
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Route className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Success</h3>
                <p className="text-gray-600 text-sm">
                  Achieve your travel goals and objectives effectively
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default JourneyStartMuhurat;
