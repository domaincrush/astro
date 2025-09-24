import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "src/components/ui/select";
import { Badge } from "src/components/ui/badge";
import {
  Sun,
  Clock,
  Heart,
  Home,
  Car,
  Building,
  Briefcase,
  MapPin,
  Calendar,
  Star,
  CheckCircle,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";
import { LocationSearch } from "src/components/LocationSearch";

export default function ShubhMuhurat() {
  const [selectedActivity, setSelectedActivity] = useState<string>("marriage");
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

  const activities = [
    {
      id: "marriage",
      name: "Marriage / Wedding",
      icon: Heart,
      color: "from-pink-400 to-red-500",
      description: "Find the most auspicious time for wedding ceremonies",
      link: "/shubh-muhurat/marriage",
    },
    {
      id: "griha_pravesh",
      name: "Griha Pravesh",
      icon: Home,
      color: "from-green-400 to-teal-500",
      description: "Auspicious timing for house warming ceremonies",
      link: "/shubh-muhurat/griha-pravesh",
    },
    {
      id: "vehicle_purchase",
      name: "Vehicle Purchase",
      icon: Car,
      color: "from-blue-400 to-indigo-500",
      description: "Best time to buy cars, bikes, or any vehicle",
      link: "/shubh-muhurat/vehicle-purchase",
    },
    {
      id: "property_purchase",
      name: "Property Purchase",
      icon: Building,
      color: "from-purple-400 to-pink-500",
      description: "Ideal muhurat for real estate transactions",
      link: "/shubh-muhurat/property-purchase",
    },
    {
      id: "business_start",
      name: "Business Launch",
      icon: Briefcase,
      color: "from-orange-400 to-red-500",
      description: "Perfect timing for starting new ventures",
      link: "/shubh-muhurat/business-launch",
    },
    {
      id: "journey_start",
      name: "Journey Start",
      icon: MapPin,
      color: "from-cyan-400 to-blue-500",
      description: "Auspicious time for important travels",
      link: "/shubh-muhurat/journey-start",
    },
  ];

  const handleLocationSelect = (locationData: any) => {
    console.log("Selected Location:", locationData);
    setLocation(locationData.display || locationData.place_name);
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
          activity: selectedActivity,
          date: selectedDate,
          location: location,
          latitude: coordinates.lat,
          longitude: coordinates.lng,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMuhuratData(data);
      }
    } catch (error) {
      console.error("Error fetching muhurat:", error);
    } finally {
      setLoading(false);
    }
  };

  const selectedActivityData = activities.find(
    (a) => a.id === selectedActivity,
  );

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
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full mb-6 shadow-2xl">
              <Sun className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-3xl md:text-6xl font-bold text-gray-900 mb-6">
              Shubh Muhurat Finder
            </h1>
            <p className="md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Find the most auspicious timing for your important life events
              with authentic Vedic calculations
            </p>
          </motion.div>

          {/* Activity Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-xl md:text-3xl font-bold text-center text-gray-900 mb-8">
              Choose Your Activity
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activities.map((activity) => {
                const Icon = activity.icon;
                return (
                  <motion.div
                    key={activity.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative cursor-pointer overflow-hidden rounded-xl shadow-lg transition-all duration-300 ${
                      selectedActivity === activity.id
                        ? "ring-4 ring-amber-400"
                        : "hover:shadow-xl"
                    }`}
                    onClick={() => setSelectedActivity(activity.id)}
                  >
                    <div
                      className={`bg-gradient-to-r ${activity.color} p-6 text-white h-full flex flex-col`}
                    >
                      <Icon className="h-12 w-12 mb-4" />
                      <h3 className="text-xl font-bold mb-2">
                        {activity.name}
                      </h3>
                      <p className="text-sm opacity-90 mb-4 flex-grow">
                        {activity.description}
                      </p>

                      {/* Link to Individual Page */}
                      <Link href={activity.link} className="inline-block">
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-white/20 hover:bg-white/30 text-white border-white/40 hover:border-white/60 transition-all"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Learn More <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      </Link>

                      {selectedActivity === activity.id && (
                        <div className="absolute top-4 right-4">
                          <CheckCircle className="h-6 w-6 text-white" />
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
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
                <CardTitle className="text-2xl text-center text-amber-600 flex items-center justify-center gap-2">
                  <Clock className="h-6 w-6" />
                  Find Your Muhurat
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Selected Activity
                  </label>
                  <div
                    className={`p-4 rounded-lg bg-gradient-to-r ${selectedActivityData?.color} text-white`}
                  >
                    <div className="flex items-center gap-3">
                      {selectedActivityData && (
                        <selectedActivityData.icon className="h-6 w-6" />
                      )}
                      <span className="font-semibold">
                        {selectedActivityData?.name}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Date
                  </label>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <LocationSearch onLocationSelect={handleLocationSelect} />
                </div>

                <Button
                  onClick={findMuhurat}
                  disabled={!location || loading}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold py-3 text-lg"
                >
                  {loading ? "Finding Muhurat..." : "Find Auspicious Time"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Results Section */}
          {muhuratData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-12"
            >
              <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-3xl text-center text-amber-600 flex items-center justify-center gap-2">
                    <Star className="h-8 w-8" />
                    Your Auspicious Timings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {muhuratData.data?.muhurats?.map(
                      (muhurat: any, index: number) => (
                        <div
                          key={index}
                          className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg p-6 border border-amber-200"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <Badge
                              className={`${
                                muhurat.quality === "Excellent"
                                  ? "bg-green-500"
                                  : muhurat.quality === "Good"
                                    ? "bg-blue-500"
                                    : "bg-orange-500"
                              } text-white px-3 py-1`}
                            >
                              {muhurat.quality}
                            </Badge>
                            <Clock className="h-5 w-5 text-amber-600" />
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900 mb-2">
                              {muhurat.start} - {muhurat.end}
                            </div>
                            <p className="text-sm text-gray-600">
                              Duration: {muhurat.duration || "N/A"}
                            </p>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Specialized Muhurat Pages Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mb-12"
          >
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-center text-amber-600 flex items-center justify-center gap-2">
                  <Star className="h-6 w-6" />
                  Explore Detailed Muhurat Pages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-600 mb-8">
                  Get specialized guidance for each type of ceremony with
                  detailed explanations, traditional significance, and
                  step-by-step timing calculations.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activities.map((activity) => {
                    const Icon = activity.icon;
                    return (
                      <Link key={activity.id} href={activity.link}>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="p-4 rounded-lg border border-gray-200 hover:border-amber-300 hover:shadow-md transition-all duration-200 bg-white"
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <div
                              className={`p-2 rounded-lg bg-gradient-to-r ${activity.color}`}
                            >
                              <Icon className="h-4 w-4 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 text-sm">
                                {activity.name}
                              </h3>
                            </div>
                            <ArrowRight className="h-4 w-4 text-gray-400" />
                          </div>
                          <p className="text-xs text-gray-600">
                            {activity.description}
                          </p>
                        </motion.div>
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Traditional Muhurat Knowledge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-amber-600 flex items-center gap-2">
                  <Sun className="h-6 w-6" />
                  What is Shubh Muhurat?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  Shubh Muhurat is the most auspicious time for performing
                  important activities according to Vedic astrology. It
                  considers planetary positions, tithis, nakshatras, and other
                  astronomical factors.
                </p>
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900">Key Factors:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                    <li>Tithi (Lunar Day)</li>
                    <li>Nakshatra (Star Constellation)</li>
                    <li>Yoga (Planetary Combination)</li>
                    <li>Karana (Half Lunar Day)</li>
                    <li>Planetary Positions</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-amber-600 flex items-center gap-2">
                  <AlertCircle className="h-6 w-6" />
                  Important Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">
                        Avoid Inauspicious Times
                      </p>
                      <p className="text-sm text-gray-600">
                        Never perform ceremonies during Rahu Kaal, Yamaganda, or
                        Gulika Kaal
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">
                        Consider Local Time
                      </p>
                      <p className="text-sm text-gray-600">
                        All timings are calculated based on your specific
                        location
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">
                        Consult Expert
                      </p>
                      <p className="text-sm text-gray-600">
                        For major events, consult with a qualified astrologer
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
