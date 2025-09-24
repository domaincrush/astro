import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import { Label } from "src/components/ui/label";
import { Badge } from "src/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "src/components/ui/select";
import {
  Moon,
  Star,
  Sun,
  Clock,
  Calendar,
  Globe,
  AlertTriangle,
  Sunrise,
  MapPin,
} from "lucide-react";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import { Footer } from "src/components/layout/Footer";
import { Helmet } from "react-helmet-async";
import { useLanguage } from "src/contexts/LanguageContext";
import DeferredSection from "src/components/DeferredSection";
import LazyImage from "src/components/LazyImage";

interface PanchangData {
  success: boolean;
  calculation_engine: string;
  date: string;
  location: string;
  tithi: {
    name: string;
    number: number;
    percentage: number;
    end_time: string;
    paksha: string;
    description: string;
  };
  next_tithi: {
    name: string;
    start_time: string;
    description: string;
  };
  third_tithi: {
    name: string;
    start_time: string;
    description: string;
  };
  nakshatra: {
    name: string;
    number: number;
    percentage: number;
    end_time: string;
    lord: string;
    description: string;
  };
  next_nakshatra: {
    name: string;
    start_time: string;
    lord: string;
    description: string;
  };
  yoga: {
    name: string;
    number: number;
    percentage: number;
    end_time: string;
    description: string;
  };
  next_yoga: {
    name: string;
    start_time: string;
    description: string;
  };
  karana: {
    name: string;
    number: number;
    percentage: number;
    end_time: string;
    description: string;
  };
  next_karana: {
    name: string;
    start_time: string;
    description: string;
  };
  third_karana: {
    name: string;
    start_time: string;
    description: string;
  };
  vara: {
    name: string;
    english: string;
    number: number;
    planet_lord: string;
  };
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
  auspicious_timings: {
    abhijit_muhurta: { start: string; end: string };
    brahma_muhurta: { start: string; end: string };
    amrit_kaal: { start: string; end: string };
  };
  inauspicious_timings: {
    rahu_kaal: { start: string; end: string };
    yamaganda: { start: string; end: string };
    gulikai: { start: string; end: string };
  };
  choghadiya: Array<{
    name: string;
    start: string;
    end: string;
    type: string;
  }>;
  planetary_positions: {
    sun: { sign: string; degrees: number; longitude: number };
    moon: { sign: string; degrees: number; longitude: number };
    mars: { sign: string; degrees: number; longitude: number };
    mercury: { sign: string; degrees: number; longitude: number };
    jupiter: { sign: string; degrees: number; longitude: number };
    venus: { sign: string; degrees: number; longitude: number };
    saturn: { sign: string; degrees: number; longitude: number };
    rahu: { sign: string; degrees: number; longitude: number };
    ketu: { sign: string; degrees: number; longitude: number };
  };
  calculations: {
    ayanamsa: number;
    julian_day: number;
    sidereal_time: string;
    local_mean_time: string;
    calculated_at: string;
    calculation_method: string;
    location: string;
  };
}

// City data with coordinates
const cities = [
  { name: "Delhi", lat: 28.6139, lng: 77.209, timezone: "Asia/Kolkata" },
  { name: "Mumbai", lat: 19.076, lng: 72.8777, timezone: "Asia/Kolkata" },
  { name: "Chennai", lat: 13.0827, lng: 80.2707, timezone: "Asia/Kolkata" },
  { name: "Kolkata", lat: 22.5726, lng: 88.3639, timezone: "Asia/Kolkata" },
  { name: "Bangalore", lat: 12.9716, lng: 77.5946, timezone: "Asia/Kolkata" },
  { name: "Hyderabad", lat: 17.385, lng: 78.4867, timezone: "Asia/Kolkata" },
  { name: "Pune", lat: 18.5204, lng: 73.8567, timezone: "Asia/Kolkata" },
  { name: "Ahmedabad", lat: 23.0225, lng: 72.5714, timezone: "Asia/Kolkata" },
  { name: "Jaipur", lat: 26.9124, lng: 75.7873, timezone: "Asia/Kolkata" },
  { name: "Lucknow", lat: 26.8467, lng: 80.9462, timezone: "Asia/Kolkata" },
  { name: "Kanpur", lat: 26.4499, lng: 80.3319, timezone: "Asia/Kolkata" },
  { name: "Nagpur", lat: 21.1458, lng: 79.0882, timezone: "Asia/Kolkata" },
  { name: "Indore", lat: 22.7196, lng: 75.8577, timezone: "Asia/Kolkata" },
  { name: "Patna", lat: 25.5941, lng: 85.1376, timezone: "Asia/Kolkata" },
  { name: "Bhopal", lat: 23.2599, lng: 77.4126, timezone: "Asia/Kolkata" },
  { name: "Varanasi", lat: 25.3176, lng: 82.9739, timezone: "Asia/Kolkata" },
  { name: "Amritsar", lat: 31.634, lng: 74.8723, timezone: "Asia/Kolkata" },
  { name: "Haridwar", lat: 29.9457, lng: 78.1642, timezone: "Asia/Kolkata" },
  { name: "Rishikesh", lat: 30.0869, lng: 78.2676, timezone: "Asia/Kolkata" },
  { name: "Mathura", lat: 27.4924, lng: 77.6737, timezone: "Asia/Kolkata" },
  { name: "Vrindavan", lat: 27.58, lng: 77.7, timezone: "Asia/Kolkata" },
  { name: "Tirupati", lat: 13.6288, lng: 79.4192, timezone: "Asia/Kolkata" },
  { name: "Ujjain", lat: 23.1765, lng: 75.7885, timezone: "Asia/Kolkata" },
  { name: "Dwarka", lat: 22.2394, lng: 68.9678, timezone: "Asia/Kolkata" },
  { name: "Ayodhya", lat: 26.7922, lng: 82.1998, timezone: "Asia/Kolkata" },
];

// Timezone data
const timezones = [
  { name: "IST (India Standard Time)", value: "Asia/Kolkata", offset: 5.5 },
  { name: "UTC (Coordinated Universal Time)", value: "UTC", offset: 0 },
  {
    name: "EST (Eastern Standard Time)",
    value: "America/New_York",
    offset: -5,
  },
  {
    name: "PST (Pacific Standard Time)",
    value: "America/Los_Angeles",
    offset: -8,
  },
  { name: "GMT (Greenwich Mean Time)", value: "Europe/London", offset: 0 },
  { name: "CST (Central Standard Time)", value: "America/Chicago", offset: -6 },
  { name: "JST (Japan Standard Time)", value: "Asia/Tokyo", offset: 9 },
  {
    name: "AEST (Australian Eastern Standard Time)",
    value: "Australia/Sydney",
    offset: 10,
  },
];

export default function PanchangNew() {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    city: "Delhi",
    timezone: "Asia/Kolkata",
  });
  const [panchangData, setPanchangData] = useState<PanchangData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();

  // Auto-detect user's location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Find closest city based on coordinates
          const closestCity = cities.reduce((prev, curr) => {
            const prevDistance = Math.sqrt(
              Math.pow(prev.lat - latitude, 2) +
                Math.pow(prev.lng - longitude, 2),
            );
            const currDistance = Math.sqrt(
              Math.pow(curr.lat - latitude, 2) +
                Math.pow(curr.lng - longitude, 2),
            );
            return currDistance < prevDistance ? curr : prev;
          });

          setFormData((prev) => ({
            ...prev,
            city: closestCity.name,
            timezone: closestCity.timezone,
          }));
        },
        (error) => {
          console.error("Geolocation error:", error);
          // Keep default Delhi - user can manually select city
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        },
      );
    }
  }, []);

  // Auto-calculate panchang for current day when component mounts
  useEffect(() => {
    const autoCalculatePanchang = async () => {
      if (!formData.date || !formData.city) return;

      setLoading(true);
      setError(null);

      try {
        const selectedCity =
          cities.find((city) => city.name === formData.city) || cities[0];

        const response = await fetch("/api/panchang", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            date: formData.date,
            latitude: selectedCity.lat,
            longitude: selectedCity.lng,
            timezone: formData.timezone,
          }),
        });

        const data = await response.json();

        if (data.success) {
          setPanchangData(data);
        } else {
          setError(data.message || "Failed to calculate panchang");
        }
      } catch (err) {
        setError("Network error. Please try again.");
        console.error("Panchang calculation error:", err);
      } finally {
        setLoading(false);
      }
    };

    // Wait a bit for location detection to complete, then calculate
    const timer = setTimeout(autoCalculatePanchang, 1000);
    return () => clearTimeout(timer);
  }, [formData.city, formData.timezone]); // Recalculate when city or timezone changes

  // Helper function to format date and time from backend datetime string
  const formatDateTime = (datetimeStr: string) => {
    if (!datetimeStr || datetimeStr === "N/A") return datetimeStr;

    // Check if it's already a full datetime string from backend
    if (datetimeStr.includes("-")) {
      // Format: "2025-07-12 02:08 AM"
      const [datePart, timePart] = datetimeStr.split(" ", 2);
      const timeWithPeriod = datetimeStr.substring(datePart.length + 1);
      const displayDate = new Date(datePart);

      const dateStr = displayDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      return `${dateStr} ${timeWithPeriod}`;
    } else {
      // Fallback for old format - just time
      if (!panchangData) return datetimeStr;

      const currentDate = new Date(panchangData.date);
      const isNextDay = isNextDayTime(datetimeStr);
      const displayDate = isNextDay
        ? new Date(currentDate.getTime() + 24 * 60 * 60 * 1000)
        : currentDate;

      const dateStr = displayDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      return `${dateStr} ${datetimeStr}`;
    }
  };

  // Helper function to determine if time is next day (fallback for old format)
  const isNextDayTime = (timeStr: string) => {
    if (!timeStr) return false;

    // Parse the time
    const [time, period] = timeStr.split(" ");
    const [hours, minutes] = time.split(":");
    let hour24 = parseInt(hours);

    if (period === "AM" && hour24 === 12) hour24 = 0;
    if (period === "PM" && hour24 !== 12) hour24 += 12;

    // If it's early morning (before 6 AM), likely next day
    return hour24 < 6;
  };

  // Helper function to check if the panchang data is for current date
  const isCurrentDate = () => {
    if (!panchangData) return false;

    try {
      const today = new Date();
      const todayDateString = today.toISOString().split("T")[0]; // YYYY-MM-DD format

      // Extract date from the panchang date string
      const panchangDate = panchangData.date.split("T")[0]; // Get just the date part

      return panchangDate === todayDateString;
    } catch (error) {
      console.error("Error comparing dates:", error);
      return false;
    }
  };

  // Helper function to check if an element is currently running
  const isCurrentlyRunning = (endTimeStr: string) => {
    if (!endTimeStr || !panchangData) return false;

    // Get current time
    const now = new Date();

    // Check if it's the new datetime format from backend
    if (endTimeStr.includes("-")) {
      // Format: "2025-07-12 02:08 AM"
      const [datePart, timePart] = endTimeStr.split(" ", 2);
      const timeWithPeriod = endTimeStr.substring(datePart.length + 1);

      // Parse the time
      const [time, period] = timeWithPeriod.split(" ");
      const [hours, minutes] = time.split(":");
      let hour24 = parseInt(hours);

      if (period === "AM" && hour24 === 12) hour24 = 0;
      if (period === "PM" && hour24 !== 12) hour24 += 12;

      // Create end datetime - assuming IST timezone since our data is from Chennai/India
      const endDateTime = new Date(
        datePart +
          "T" +
          hour24.toString().padStart(2, "0") +
          ":" +
          minutes.padStart(2, "0") +
          ":00+05:30",
      );

      // Compare current time with end time
      return now < endDateTime;
    } else {
      // Fallback for old format - just time
      const [time, period] = endTimeStr.split(" ");
      const [hours, minutes] = time.split(":");
      let hour24 = parseInt(hours);

      if (period === "AM" && hour24 === 12) hour24 = 0;
      if (period === "PM" && hour24 !== 12) hour24 += 12;

      // Create end time for today
      const currentDate = new Date(panchangData.date);
      const endTime = new Date(currentDate);
      endTime.setHours(hour24, parseInt(minutes), 0, 0);

      // If it's early morning (before 6 AM), it's likely next day
      if (hour24 < 6) {
        endTime.setDate(endTime.getDate() + 1);
      }

      // Compare current time with end time
      const currentTimeMinutes =
        currentTimeInTimezone.getHours() * 60 +
        currentTimeInTimezone.getMinutes();
      const endTimeMinutes = hour24 * 60 + parseInt(minutes);

      // Handle next day scenario
      if (hour24 < 6) {
        // Next day end time - always running for now
        return true;
      }

      // Same day comparison
      return currentTimeMinutes < endTimeMinutes;
    }
  };

  const calculatePanchang = async () => {
    setLoading(true);
    setError(null);

    try {
      // Get coordinates from selected city
      const selectedCity = cities.find((city) => city.name === formData.city);
      if (!selectedCity) {
        throw new Error("Selected city not found");
      }

      const response = await fetch("/api/panchang", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: formData.date,
          latitude: parseFloat(selectedCity.lat.toString()),
          longitude: parseFloat(selectedCity.lng.toString()),
          timezone: formData.timezone,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setPanchangData(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to calculate panchang",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>
          {t(
            "pages.panchang.pageTitle",
            "Vedic Panchang Calculator - Daily Astronomical Timings | AstroTick",
          )}
        </title>
        <meta
          name="description"
          content={t(
            "pages.panchang.description",
            "Calculate accurate Vedic Panchang with authentic astronomical data. Get daily Tithi, Nakshatra, Yoga, Karana, and auspicious timings based on Drik Panchang calculations.",
          )}
        />
        <meta
          name="keywords"
          content="vedic panchang, daily panchang, tithi calculator, nakshatra calculator, yoga karana, sunrise sunset times, auspicious timings, hindu calendar, drik panchang, vedic astronomy"
        />
        <meta name="author" content="AstroTick" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://astrotick.com/panchang" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://astrotick.com/panchang" />
        <meta
          property="og:title"
          content="Vedic Panchang Calculator - Daily Astronomical Timings"
        />
        <meta
          property="og:description"
          content="Calculate accurate Vedic Panchang with authentic astronomical data. Get daily Tithi, Nakshatra, Yoga, Karana, and auspicious timings."
        />
        <meta
          property="og:image"
          content="https://astrotick.com/panchang-og-image.jpg"
        />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://astrotick.com/panchang" />
        <meta
          property="twitter:title"
          content="Vedic Panchang Calculator - Daily Astronomical Timings"
        />
        <meta
          property="twitter:description"
          content="Calculate accurate Vedic Panchang with authentic astronomical data. Get daily Tithi, Nakshatra, Yoga, Karana, and auspicious timings."
        />
        <meta
          property="twitter:image"
          content="https://astrotick.com/panchang-og-image.jpg"
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-orange-200 to-amber-200 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-full animate-bounce"></div>
          <div className="absolute bottom-20 left-40 w-20 h-20 bg-gradient-to-r from-amber-200 to-yellow-200 rounded-full animate-pulse"></div>
          <div className="absolute bottom-40 right-40 w-28 h-28 bg-gradient-to-r from-orange-200 to-red-200 rounded-full animate-bounce"></div>
        </div>

        <AstroTickHeader />

        <div className="container mx-auto p-6 space-y-6 relative z-10">
          <div className="text-center space-y-4 py-8">
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-orange-200 shadow-sm">
                <span className="text-green-600 text-sm">●</span>
                <span className="text-orange-800 text-sm font-medium">
                  authentic vedic panchang calculations
                </span>
              </div>
            </div>
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-full mb-6 animate-pulse">
              <Star className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-orange-900 mb-6 leading-tight">
              Vedic{" "}
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Panchang
              </span>
            </h1>
            <p className="md:text-xl text-orange-800 max-w-4xl mx-auto leading-relaxed">
              {t(
                "pages.panchang.description",
                "Discover daily cosmic energies through authentic astronomical calculations using Drik Panchang",
              )}
            </p>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-8 mt-8">
              <div className="flex items-center gap-2 text-orange-700">
                <span className="text-2xl">⭐</span>
                <span className="text-sm font-medium">
                  100% Accurate Calculations
                </span>
              </div>
              <div className="flex items-center gap-2 text-orange-700">
                <span className="text-2xl">🌙</span>
                <span className="text-sm font-medium">
                  Real-time Astronomical Data
                </span>
              </div>
              <div className="flex items-center gap-2 text-orange-700">
                <span className="text-2xl">🕉️</span>
                <span className="text-sm font-medium">
                  Traditional Vedic Methods
                </span>
              </div>
            </div>
          </div>

          {/* Input Form */}
          <Card className="border-2 border-amber-400 shadow-2xl bg-white/90 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Calendar className="h-6 w-6" />
                {t("pages.panchang.title", "Calculate Today's Panchang")}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Select
                    value={formData.city}
                    onValueChange={(value) =>
                      setFormData({ ...formData, city: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a city">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {formData.city}
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city.name} value={city.name}>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {city.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={formData.timezone}
                    onValueChange={(value) =>
                      setFormData({ ...formData, timezone: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone">
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          {timezones.find(
                            (tz) => tz.value === formData.timezone,
                          )?.name || "IST"}
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {timezones.map((timezone) => (
                        <SelectItem key={timezone.value} value={timezone.value}>
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            {timezone.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button
                onClick={calculatePanchang}
                disabled={loading}
                className="w-full mt-6 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 text-lg font-semibold shadow-lg"
              >
                {loading ? (
                  <>
                    <Clock className="w-5 h-5 mr-2 animate-spin" />
                    Calculating Cosmic Energies...
                  </>
                ) : (
                  <>
                    <Star className="w-5 h-5 mr-2" />
                    Calculate Panchang
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {error && (
            <Card className="border-2 border-red-300 bg-gradient-to-r from-red-100 to-pink-100 shadow-xl">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results */}
          {panchangData && panchangData.success && (
            <>
              {/* Current Timezone Indicator */}
              <Card className="bg-gradient-to-r from-cyan-100 to-blue-100 border-2 border-cyan-200 shadow-xl">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-cyan-800">
                    <Clock className="h-5 w-5" />
                    <span className="font-semibold md:text-lg">
                      Status indicators shown in:{" "}
                      {timezones.find((tz) => tz.value === formData.timezone)
                        ?.name || "IST"}
                    </span>
                    <span className="text-sm bg-cyan-200 px-2 py-1 rounded-full">
                      {formData.city}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Summary Header */}
              <Card className="bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 text-white shadow-2xl border-0">
                <CardContent className="p-8">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    <div className="space-y-2">
                      <Calendar className="h-8 w-8 mx-auto opacity-90" />
                      <p className="text-sm opacity-90 font-medium">Date</p>
                      <p className="font-bold text-xl">{panchangData.date}</p>
                    </div>
                    <div className="space-y-2">
                      <Sun className="h-8 w-8 mx-auto opacity-90" />
                      <p className="text-sm opacity-90 font-medium">
                        Vara (Day)
                      </p>
                      <p className="font-bold text-xl">
                        {panchangData.vara.english}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Sunrise className="h-8 w-8 mx-auto opacity-90" />
                      <p className="text-sm opacity-90 font-medium">Sunrise</p>
                      <p className="font-bold text-xl">
                        {panchangData.sunrise || "N/A"}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Moon className="h-8 w-8 mx-auto opacity-90" />
                      <p className="text-sm opacity-90 font-medium">Sunset</p>
                      <p className="font-bold text-xl">
                        {panchangData.sunset || "N/A"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Panchang Elements */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Tithi */}
                  <Card className="border-2 border-blue-200 shadow-xl bg-white/95 backdrop-blur-sm">
                    <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Moon className="h-6 w-6" />
                        Tithi (Lunar Day)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Current Tithi */}
                        <div className="space-y-2 pb-3 border-b border-gray-200 dark:border-gray-700 mt-3">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-lg">
                              {panchangData.tithi.name}
                            </span>
                            {isCurrentDate() && (
                              <Badge
                                variant={
                                  isCurrentlyRunning(
                                    panchangData.tithi.end_time,
                                  )
                                    ? "secondary"
                                    : "destructive"
                                }
                              >
                                {isCurrentlyRunning(panchangData.tithi.end_time)
                                  ? "Running"
                                  : "Completed"}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Ends at{" "}
                            {formatDateTime(panchangData.tithi.end_time)}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            {panchangData.tithi.description}
                          </p>
                        </div>

                        {/* Next Tithi */}
                        <div className="space-y-2 pb-3 border-b border-gray-200 dark:border-gray-700">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold">
                              {panchangData.next_tithi.name}
                            </span>
                            {isCurrentDate() && (
                              <Badge variant="outline">Next</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Starts at{" "}
                            {formatDateTime(panchangData.next_tithi.start_time)}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            {panchangData.next_tithi.description}
                          </p>
                        </div>

                        {/* Third Tithi */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold">
                              {panchangData.third_tithi.name}
                            </span>
                            {isCurrentDate() && (
                              <Badge
                                variant="default"
                                className="bg-blue-100 text-blue-800 hover:bg-blue-200"
                              >
                                Following
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Starts at{" "}
                            {formatDateTime(
                              panchangData.third_tithi.start_time,
                            )}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            {panchangData.third_tithi.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Nakshatra */}
                  <Card className="border-2 border-indigo-200 shadow-xl bg-white/95 backdrop-blur-sm">
                    <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Star className="h-6 w-6" />
                        Nakshatra (Star)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center mt-3">
                            <span className="font-semibold">
                              {panchangData.nakshatra.name}
                            </span>
                            {isCurrentDate() && (
                              <Badge
                                variant={
                                  isCurrentlyRunning(
                                    panchangData.nakshatra.end_time,
                                  )
                                    ? "secondary"
                                    : "destructive"
                                }
                              >
                                {isCurrentlyRunning(
                                  panchangData.nakshatra.end_time,
                                )
                                  ? "Running"
                                  : "Completed"}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Ends at{" "}
                            {formatDateTime(panchangData.nakshatra.end_time)}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            Lord: {panchangData.nakshatra.lord} •{" "}
                            {panchangData.nakshatra.description}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold">
                              {panchangData.next_nakshatra.name}
                            </span>
                            {isCurrentDate() && (
                              <Badge variant="outline">Next</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Starts at{" "}
                            {formatDateTime(
                              panchangData.next_nakshatra.start_time,
                            )}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            Lord: {panchangData.next_nakshatra.lord} •{" "}
                            {panchangData.next_nakshatra.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Yoga */}
                  <Card className="border-2 border-yellow-200 shadow-xl bg-white/95 backdrop-blur-sm">
                    <CardHeader className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Sun className="h-6 w-6" />
                        Yoga (Combination)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center mt-3">
                            <span className="font-semibold">
                              {panchangData.yoga.name}
                            </span>
                            {isCurrentDate() && (
                              <Badge
                                variant={
                                  isCurrentlyRunning(panchangData.yoga.end_time)
                                    ? "secondary"
                                    : "destructive"
                                }
                              >
                                {isCurrentlyRunning(panchangData.yoga.end_time)
                                  ? "Running"
                                  : "Completed"}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Ends at {formatDateTime(panchangData.yoga.end_time)}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            {panchangData.yoga.description}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold">
                              {panchangData.next_yoga.name}
                            </span>
                            {isCurrentDate() && (
                              <Badge variant="outline">Next</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Starts at{" "}
                            {formatDateTime(panchangData.next_yoga.start_time)}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            {panchangData.next_yoga.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Karana */}
                  <Card className="border-2 border-green-200 shadow-xl bg-white/95 backdrop-blur-sm">
                    <CardHeader className="bg-gradient-to-r from-green-500 to-teal-500 text-white">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Clock className="h-6 w-6" />
                        Karana (Half Tithi)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Current Karana */}
                        <div className="space-y-2 pb-3 border-b border-gray-200 dark:border-gray-700">
                          <div className="flex justify-between items-center mt-3">
                            <span className="font-semibold text-lg">
                              {panchangData.karana.name}
                            </span>
                            {isCurrentDate() && (
                              <Badge
                                variant={
                                  isCurrentlyRunning(
                                    panchangData.karana.end_time,
                                  )
                                    ? "secondary"
                                    : "destructive"
                                }
                              >
                                {isCurrentlyRunning(
                                  panchangData.karana.end_time,
                                )
                                  ? "Running"
                                  : "Completed"}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Ends at{" "}
                            {formatDateTime(panchangData.karana.end_time)}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            {panchangData.karana.description}
                          </p>
                        </div>

                        {/* Next Karana */}
                        <div className="space-y-2 pb-3 border-b border-gray-200 dark:border-gray-700">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold">
                              {panchangData.next_karana.name}
                            </span>
                            {isCurrentDate() && (
                              <Badge variant="outline">Next</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Starts at{" "}
                            {formatDateTime(
                              panchangData.next_karana.start_time,
                            )}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            {panchangData.next_karana.description}
                          </p>
                        </div>

                        {/* Third Karana */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold">
                              {panchangData.third_karana.name}
                            </span>
                            {isCurrentDate() && (
                              <Badge
                                variant="outline"
                                className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-700"
                              >
                                Following
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Starts at{" "}
                            {formatDateTime(
                              panchangData.third_karana.start_time,
                            )}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            {panchangData.third_karana.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Vara */}
                  <Card className="border-2 border-pink-200 shadow-xl bg-white/95 backdrop-blur-sm">
                    <CardHeader className="bg-gradient-to-r from-pink-500 to-rose-500 text-white">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Calendar className="h-6 w-6" />
                        Vara (Weekday)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center mt-3">
                          <span className="font-semibold text-lg">
                            {panchangData.vara.name}
                          </span>
                          <Badge variant="secondary">
                            {panchangData.vara.english}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <p>
                            <span className="font-medium">Number:</span>{" "}
                            {panchangData.vara.number}
                          </p>
                          <p>
                            <span className="font-medium">Planet Lord:</span>{" "}
                            {panchangData.vara.planet_lord}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Daily Color Combinations Section */}
                <div className="mt-8">
                  <Card className="border-2 border-gradient-to-r from-purple-300 to-pink-300 shadow-2xl bg-white/95 backdrop-blur-sm">
                    <CardHeader className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white">
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <div className="p-2 bg-white/20 rounded-full">
                          <Star className="h-6 w-6" />
                        </div>
                        Auspicious Color Combinations for Today
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Based on Vara (Day) */}
                        <div className="bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 p-6 rounded-xl border-2 border-blue-300 shadow-lg">
                          <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Day Lord Colors ({panchangData.vara.planet_lord})
                          </h3>
                          <div className="space-y-2">
                            {panchangData.vara.planet_lord === "Sun" && (
                              <>
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                                  <span className="text-sm">
                                    Orange (Primary)
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                                  <span className="text-sm">
                                    Red (Secondary)
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                                  <span className="text-sm">Golden Yellow</span>
                                </div>
                              </>
                            )}
                            {panchangData.vara.planet_lord === "Moon" && (
                              <>
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 bg-white border border-gray-300 rounded-full"></div>
                                  <span className="text-sm">
                                    White (Primary)
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
                                  <span className="text-sm">
                                    Silver (Secondary)
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 bg-blue-200 rounded-full"></div>
                                  <span className="text-sm">Light Blue</span>
                                </div>
                              </>
                            )}
                            {panchangData.vara.planet_lord === "Mars" && (
                              <>
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 bg-red-600 rounded-full"></div>
                                  <span className="text-sm">Red (Primary)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 bg-orange-600 rounded-full"></div>
                                  <span className="text-sm">
                                    Coral (Secondary)
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 bg-pink-500 rounded-full"></div>
                                  <span className="text-sm">Pink</span>
                                </div>
                              </>
                            )}
                            {panchangData.vara.planet_lord === "Mercury" && (
                              <>
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                                  <span className="text-sm">
                                    Green (Primary)
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 bg-emerald-400 rounded-full"></div>
                                  <span className="text-sm">
                                    Emerald (Secondary)
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 bg-teal-400 rounded-full"></div>
                                  <span className="text-sm">Teal</span>
                                </div>
                              </>
                            )}
                            {panchangData.vara.planet_lord === "Jupiter" && (
                              <>
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                                  <span className="text-sm">
                                    Yellow (Primary)
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 bg-amber-500 rounded-full"></div>
                                  <span className="text-sm">
                                    Golden (Secondary)
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 bg-orange-300 rounded-full"></div>
                                  <span className="text-sm">Saffron</span>
                                </div>
                              </>
                            )}
                            {panchangData.vara.planet_lord === "Venus" && (
                              <>
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 bg-white border border-gray-300 rounded-full"></div>
                                  <span className="text-sm">
                                    White (Primary)
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 bg-pink-300 rounded-full"></div>
                                  <span className="text-sm">
                                    Light Pink (Secondary)
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 bg-blue-200 rounded-full"></div>
                                  <span className="text-sm">Light Blue</span>
                                </div>
                              </>
                            )}
                            {panchangData.vara.planet_lord === "Saturn" && (
                              <>
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 bg-black rounded-full"></div>
                                  <span className="text-sm">
                                    Black (Primary)
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 bg-blue-900 rounded-full"></div>
                                  <span className="text-sm">
                                    Dark Blue (Secondary)
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 bg-gray-600 rounded-full"></div>
                                  <span className="text-sm">Dark Grey</span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Based on Nakshatra */}
                        <div className="bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200 p-6 rounded-xl border-2 border-purple-300 shadow-lg">
                          <h3 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                            <Star className="h-4 w-4" />
                            Nakshatra Colors ({panchangData.nakshatra.name})
                          </h3>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"></div>
                              <span className="text-sm">Cosmic Blue</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full"></div>
                              <span className="text-sm">Royal Purple</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 bg-gradient-to-r from-blue-300 to-teal-300 rounded-full"></div>
                              <span className="text-sm">Celestial Teal</span>
                            </div>
                            <p className="text-xs text-purple-600 mt-2">
                              Based on {panchangData.nakshatra.name} star energy
                            </p>
                          </div>
                        </div>

                        {/* Based on Tithi */}
                        <div className="bg-gradient-to-br from-green-50 via-green-100 to-green-200 p-6 rounded-xl border-2 border-green-300 shadow-lg">
                          <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                            <Moon className="h-4 w-4" />
                            Lunar Colors ({panchangData.tithi.name})
                          </h3>
                          <div className="space-y-2">
                            {panchangData.tithi.paksha === "Shukla" ? (
                              <>
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 bg-white border border-gray-300 rounded-full"></div>
                                  <span className="text-sm">Pure White</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 bg-yellow-200 rounded-full"></div>
                                  <span className="text-sm">Light Yellow</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 bg-green-200 rounded-full"></div>
                                  <span className="text-sm">Mint Green</span>
                                </div>
                                <p className="text-xs text-green-600 mt-2">
                                  Bright Paksha - Growth energy
                                </p>
                              </>
                            ) : (
                              <>
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 bg-gray-700 rounded-full"></div>
                                  <span className="text-sm">Deep Grey</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 bg-blue-800 rounded-full"></div>
                                  <span className="text-sm">Navy Blue</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 bg-purple-700 rounded-full"></div>
                                  <span className="text-sm">Deep Purple</span>
                                </div>
                                <p className="text-xs text-green-600 mt-2">
                                  Dark Paksha - Reflection energy
                                </p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Color Combination Guidelines */}
                      <div className="mt-8 bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 p-6 rounded-xl border-2 border-amber-300 shadow-lg">
                        <h3 className="font-semibold text-amber-800 mb-3">
                          Today's Color Combination Guidelines
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <h4 className="font-medium text-amber-700 mb-2">
                              Best Combinations:
                            </h4>
                            <ul className="space-y-1 text-amber-600">
                              <li>• Primary + Secondary colors for harmony</li>
                              <li>• Day lord colors for general activities</li>
                              <li>• Nakshatra colors for spiritual work</li>
                              <li>
                                • White combinations during auspicious timings
                              </li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-medium text-amber-700 mb-2">
                              Usage Tips:
                            </h4>
                            <ul className="space-y-1 text-amber-600">
                              <li>• Wear primary colors during day time</li>
                              <li>• Use secondary colors for accessories</li>
                              <li>• Avoid conflicting planetary colors</li>
                              <li>
                                • Choose lighter shades during inauspicious
                                periods
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </>
          )}
        </div>

        <Footer />
      </div>
    </>
  );
}
