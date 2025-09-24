import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import { Label } from "src/components/ui/label";
import { Badge } from "src/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "src/components/ui/select";
import { Moon, Star, Sun, Clock, Calendar, Globe, AlertTriangle, Sunrise, MapPin } from "lucide-react";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import { Footer } from "src/components/layout/Footer";
import { Helmet } from "react-helmet-async";

// Same interfaces and city data as original panchang
interface PanchangData {
  date: string;
  location: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  tithi: {
    name: string;
    english: string;
    end_time: string;
    description: string;
    deity: string;
    quality: string;
  };
  nakshatra: {
    name: string;
    english: string;
    end_time: string;
    pada: number;
    deity: string;
    characteristics: string;
  };
  yoga: {
    name: string;
    english: string;
    end_time: string;
    description: string;
    effects: string;
  };
  first_karana: {
    name: string;
    start_time: string;
    description: string;
  };
  second_karana: {
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
  { name: "दिल्ली", lat: 28.6139, lng: 77.2090, timezone: "Asia/Kolkata" },
  { name: "मुंबई", lat: 19.0760, lng: 72.8777, timezone: "Asia/Kolkata" },
  { name: "चेन्नई", lat: 13.0827, lng: 80.2707, timezone: "Asia/Kolkata" },
  { name: "कोलकाता", lat: 22.5726, lng: 88.3639, timezone: "Asia/Kolkata" },
  { name: "बैंगलोर", lat: 12.9716, lng: 77.5946, timezone: "Asia/Kolkata" },
  { name: "हैदराबाद", lat: 17.3850, lng: 78.4867, timezone: "Asia/Kolkata" },
  { name: "पुणे", lat: 18.5204, lng: 73.8567, timezone: "Asia/Kolkata" },
  { name: "अहमदाबाद", lat: 23.0225, lng: 72.5714, timezone: "Asia/Kolkata" },
  { name: "जयपुर", lat: 26.9124, lng: 75.7873, timezone: "Asia/Kolkata" },
  { name: "लखनऊ", lat: 26.8467, lng: 80.9462, timezone: "Asia/Kolkata" },
  { name: "कानपुर", lat: 26.4499, lng: 80.3319, timezone: "Asia/Kolkata" },
  { name: "नागपुर", lat: 21.1458, lng: 79.0882, timezone: "Asia/Kolkata" },
  { name: "इंदौर", lat: 22.7196, lng: 75.8577, timezone: "Asia/Kolkata" },
  { name: "पटना", lat: 25.5941, lng: 85.1376, timezone: "Asia/Kolkata" },
  { name: "भोपाल", lat: 23.2599, lng: 77.4126, timezone: "Asia/Kolkata" },
  { name: "वाराणसी", lat: 25.3176, lng: 82.9739, timezone: "Asia/Kolkata" },
  { name: "अमृतसर", lat: 31.6340, lng: 74.8723, timezone: "Asia/Kolkata" },
  { name: "हरिद्वार", lat: 29.9457, lng: 78.1642, timezone: "Asia/Kolkata" },
  { name: "ऋषिकेश", lat: 30.0869, lng: 78.2676, timezone: "Asia/Kolkata" },
  { name: "मथुरा", lat: 27.4924, lng: 77.6737, timezone: "Asia/Kolkata" },
  { name: "वृंदावन", lat: 27.5800, lng: 77.7000, timezone: "Asia/Kolkata" },
  { name: "तिरुपति", lat: 13.6288, lng: 79.4192, timezone: "Asia/Kolkata" },
  { name: "उज्जैन", lat: 23.1765, lng: 75.7885, timezone: "Asia/Kolkata" },
  { name: "द्वारका", lat: 22.2394, lng: 68.9678, timezone: "Asia/Kolkata" },
  { name: "अयोध्या", lat: 26.7922, lng: 82.1998, timezone: "Asia/Kolkata" }
];

// Timezone data
const timezones = [
  { name: "IST (भारतीय मानक समय)", value: "Asia/Kolkata", offset: 5.5 },
  { name: "UTC (समन्वित सार्वभौमिक समय)", value: "UTC", offset: 0 },
  { name: "EST (पूर्वी मानक समय)", value: "America/New_York", offset: -5 },
  { name: "PST (प्रशांत मानक समय)", value: "America/Los_Angeles", offset: -8 },
  { name: "GMT (ग्रीनविच मीन टाइम)", value: "Europe/London", offset: 0 },
  { name: "CST (केंद्रीय मानक समय)", value: "America/Chicago", offset: -6 },
  { name: "JST (जापान मानक समय)", value: "Asia/Tokyo", offset: 9 },
  { name: "AEST (ऑस्ट्रेलियाई पूर्वी मानक समय)", value: "Australia/Sydney", offset: 10 }
];

export default function HindiPanchang() {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    city: "दिल्ली",
    timezone: "Asia/Kolkata"
  });
  const [panchangData, setPanchangData] = useState<PanchangData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-detect user's location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Find closest city based on coordinates
          const closestCity = cities.reduce((prev, curr) => {
            const prevDistance = Math.sqrt(
              Math.pow(prev.lat - latitude, 2) + Math.pow(prev.lng - longitude, 2)
            );
            const currDistance = Math.sqrt(
              Math.pow(curr.lat - latitude, 2) + Math.pow(curr.lng - longitude, 2)
            );
            return currDistance < prevDistance ? curr : prev;
          });
          
          setFormData(prev => ({
            ...prev,
            city: closestCity.name,
            timezone: closestCity.timezone
          }));
        },
        (error) => {
          console.error("Geolocation error:", error);
          // Keep default Delhi - user can manually select city
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    }
  }, []);

  const calculatePanchang = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get coordinates from selected city
      const selectedCity = cities.find(city => city.name === formData.city);
      if (!selectedCity) {
        throw new Error('चयनित शहर नहीं मिला');
      }

      const response = await fetch('/api/panchang', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: formData.date,
          latitude: parseFloat(selectedCity.lat.toString()),
          longitude: parseFloat(selectedCity.lng.toString()),
          timezone: formData.timezone
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setPanchangData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'पंचांग गणना में विफल');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>आज का पंचांग | हिंदू कैलेंडर - AstroTick</title>
        <meta name="description" content="आज का पूरा पंचांग देखें - तिथि, नक्षत्र, योग, करण और शुभ मुहूर्त।" />
        <meta name="keywords" content="वैदिक पंचांग, दैनिक पंचांग, तिथि कैलकुलेटर, नक्षत्र कैलकुलेटर, योग करण, सूर्योदय सूर्यास्त समय, शुभ समय, हिंदू कैलेंडर, द्रिक पंचांग, वैदिक खगोल विज्ञान" />
        <meta name="author" content="AstroTick" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://astrotick.com/hindi/panchang" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://astrotick.com/hindi/panchang" />
        <meta property="og:title" content="आज का पंचांग | हिंदू कैलेंडर - AstroTick" />
        <meta property="og:description" content="आज का पूरा पंचांग देखें - तिथि, नक्षत्र, योग, करण और शुभ मुहूर्त।" />
        <meta property="og:image" content="https://astrotick.com/panchang-og-image.jpg" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://astrotick.com/hindi/panchang" />
        <meta property="twitter:title" content="आज का पंचांग | हिंदू कैलेंडर - AstroTick" />
        <meta property="twitter:description" content="आज का पूरा पंचांग देखें - तिथि, नक्षत्र, योग, करण और शुभ मुहूर्त।" />
        <meta property="twitter:image" content="https://astrotick.com/panchang-og-image.jpg" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-indigo-100">
        <AstroTickHeader />
        
        <div className="container mx-auto p-6 space-y-6">
          <div className="text-center space-y-4 py-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full mb-6 animate-pulse">
              <Star className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              आज का पंचांग
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              द्रिक पंचांग का उपयोग करके प्रामाणिक खगोलीय गणनाओं के माध्यम से दैनिक ब्रह्मांडीय ऊर्जाओं की खोज करें
            </p>
          </div>

      {/* Input Form */}
      <Card className="border-2 border-purple-200 shadow-2xl bg-white/90 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Calendar className="h-6 w-6" />
            आज का पंचांग गणना करें
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="date">तारीख</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="city">शहर</Label>
              <Select value={formData.city} onValueChange={(value) => setFormData({ ...formData, city: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="शहर चुनें">
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
              <Label htmlFor="timezone">समय क्षेत्र</Label>
              <Select value={formData.timezone} onValueChange={(value) => setFormData({ ...formData, timezone: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="समय क्षेत्र चुनें">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      {timezones.find(tz => tz.value === formData.timezone)?.name || "IST"}
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
            className="w-full mt-4 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
          >
            {loading ? "गणना हो रही है..." : "पंचांग गणना करें"}
          </Button>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Display - Only show if we have panchang data */}
      {panchangData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Panchang Elements */}
          <Card className="border-purple-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-100 to-blue-100">
              <CardTitle className="flex items-center gap-2">
                <Moon className="h-5 w-5 text-purple-600" />
                मुख्य पंचांग तत्व
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="font-medium">तिथि:</span>
                  <Badge variant="secondary">{panchangData.tithi.name}</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="font-medium">नक्षत्र:</span>
                  <Badge variant="secondary">{panchangData.nakshatra.name}</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-lg">
                  <span className="font-medium">योग:</span>
                  <Badge variant="secondary">{panchangData.yoga.name}</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-pink-50 rounded-lg">
                  <span className="font-medium">वार:</span>
                  <Badge variant="secondary">{panchangData.vara.name}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sunrise/Sunset Times */}
          <Card className="border-orange-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-orange-100 to-yellow-100">
              <CardTitle className="flex items-center gap-2">
                <Sunrise className="h-5 w-5 text-orange-600" />
                सूर्य और चंद्र समय
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <span className="font-medium">सूर्योदय:</span>
                  <Badge variant="outline">{panchangData.sunrise}</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                  <span className="font-medium">सूर्यास्त:</span>
                  <Badge variant="outline">{panchangData.sunset}</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="font-medium">चंद्रोदय:</span>
                  <Badge variant="outline">{panchangData.moonrise}</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-lg">
                  <span className="font-medium">चंद्रास्त:</span>
                  <Badge variant="outline">{panchangData.moonset}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
        </div>
        
        <Footer />
      </div>
    </>
  );
}