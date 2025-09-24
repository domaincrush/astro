import React, { useState, useEffect } from 'react';
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import { Label } from "src/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "src/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "src/components/ui/tabs";
import { Badge } from "src/components/ui/badge";
import { apiRequest } from "src/lib/queryClient";
import { useToast } from "src/hooks/use-toast";
import { Calendar, Clock, Sun, Moon, Star, Sunrise, Sunset, AlertTriangle, Globe } from "lucide-react";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";
import CitySelector from "src/components/astrology/CitySelector";
import PanchangComparison from "src/components/astrology/PanchangComparison";

interface PanchangData {
  success: boolean;
  data: {
    date: string;
    location: string;
    tithi: {
      name: string;
      percentage: number;
      endTime: string;
    };
    nakshatra: {
      name: string;
      percentage: number;
      endTime: string;
    };
    karana: {
      current: string;
      next: string;
      currentEndTime: string;
      nextEndTime: string;
    };
    paksha: string;
    yoga: {
      name: string;
      percentage: number;
      endTime: string;
    };
    vara: string;
    sunrise: string;
    sunset: string;
    moonSign: string;
    moonrise: string;
    moonset: string;
    ritu: string;
    dayDuration: string;
    vikramSamvat: number;
    shakaSamvat: number;
    kaliSamvat: number;
    pravishte: number;
    monthPurnimanta: string;
    monthAmanta: string;
    auspiciousTimes: {
      abhijit: {
        start: string;
        end: string;
      };
    };
    inauspiciousTimes: {
      dushtaMuhurtas: Array<{start: string; end: string}>;
      kulika: {start: string; end: string};
      kantakaMrityu: {start: string; end: string};
      rahuKaal: {start: string; end: string};
      kalavela: {start: string; end: string};
      yamaghanta: {start: string; end: string};
      yamaganda: {start: string; end: string};
      gulikaKaal: {start: string; end: string};
    };
    dishaShool: string;
    taraBalas: string[];
    chandraBalas: string[];
  };
  source: string;
  method: string;
  calculatedAt: string;
}

export default function Panchang() {
  const [panchangData, setPanchangData] = useState<PanchangData | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState<any>(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    latitude: '28.6139',
    longitude: '77.2090',
    timezone: 'Asia/Kolkata'
  });
  
  const { toast } = useToast();

  // Helper functions for data conversion
  const calculatePercentage = (start: string, end: string) => {
    // Simple percentage calculation - in a real implementation, this would be more complex
    const now = new Date();
    const startTime = new Date(start);
    const endTime = new Date(end);
    const total = endTime.getTime() - startTime.getTime();
    const elapsed = now.getTime() - startTime.getTime();
    return Math.max(0, Math.min(100, (elapsed / total) * 100)).toFixed(1);
  };

  const getCurrentVaraName = (date: string) => {
    const dayNames = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];
    const dayIndex = new Date(date).getDay();
    return dayNames[dayIndex];
  };

  const getCurrentVaraEnglish = (date: string) => {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayIndex = new Date(date).getDay();
    return dayNames[dayIndex];
  };

  const getCurrentVaraNumber = (date: string) => {
    return new Date(date).getDay() + 1;
  };

  const getCurrentVaraPlanet = (date: string) => {
    const planets = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
    const dayIndex = new Date(date).getDay();
    return planets[dayIndex];
  };

  const calculatePanchang = async () => {
    setLoading(true);
    try {
      const response = await apiRequest("POST", "/api/panchang", {
        date: formData.date,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        timezone: formData.timezone
      });

      const data = await response.json();

      if (data.success) {
        // Convert Drik Panchang format to frontend format
        const convertedData = {
          success: true,
          data: {
            date: data.date,
            location: data.location,
            tithi: {
              name: data.tithi?.name || "N/A",
              percentage: data.tithi?.percentage || "N/A",
              endTime: data.tithi?.end_time || "N/A",
              paksha: data.tithi?.name?.includes("Krishna") ? "Krishna" : "Shukla",
              description: "General activities and daily routines"
            },
            nakshatra: {
              name: data.nakshatra?.name || "N/A",
              percentage: data.nakshatra?.percentage || "N/A",
              endTime: data.nakshatra?.end_time || "N/A",
              lord: data.nakshatra?.lord || "N/A",
              description: "Favorable for spiritual activities"
            },
            yoga: {
              name: data.yoga?.name || "N/A",
              percentage: data.yoga?.percentage || "N/A",
              endTime: data.yoga?.end_time || "N/A",
              description: "Mixed results"
            },
            karana: {
              name: data.karana?.name || "N/A",
              percentage: data.karana?.percentage || "N/A",
              endTime: data.karana?.end_time || "N/A",
              description: "Strength and power"
            },
            vara: {
              name: getCurrentVaraName(data.date),
              english: getCurrentVaraEnglish(data.date),
              number: getCurrentVaraNumber(data.date),
              planet_lord: getCurrentVaraPlanet(data.date)
            },
            sunrise: data.sunrise || "N/A",
            sunset: data.sunset || "N/A",
            moonrise: data.moonrise || "N/A",
            moonset: data.moonset || "N/A",
            auspiciousTimes: {
              abhijit: {
                start: data.auspicious_times?.abhijit_muhurta?.start || "N/A",
                end: data.auspicious_times?.abhijit_muhurta?.end || "N/A"
              }
            },
            inauspiciousTimes: {
              rahuKaal: {
                start: data.inauspicious_times?.rahu_kaal?.start || "N/A",
                end: data.inauspicious_times?.rahu_kaal?.end || "N/A"
              }
            },
            calculations: {
              ayanamsa: data.calculations?.ayanamsa || "N/A",
              julian_day: data.calculations?.julian_day || "N/A",
              sidereal_time: data.calculations?.sidereal_time || "N/A",
              local_mean_time: data.calculations?.local_mean_time || "N/A",
              calculated_at: data.calculations?.calculated_at || "N/A",
              calculation_method: data.calculations?.calculation_method || "Drik Panchang Corrected"
            }
          },
          source: data.calculation_engine,
          method: "Drik Panchang Corrected",
          calculatedAt: new Date().toISOString()
        };
        
        setPanchangData(convertedData);
        toast({
          title: "Panchang Calculated",
          description: `Authentic Drik Panchang calculated for ${selectedCity ? selectedCity.name : 'selected location'}`,
        });
      } else {
        toast({
          title: "Calculation Failed",
          description: data.error || "Failed to calculate Panchang",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Panchang calculation error:", error);
      toast({
        title: "Error",
        description: "Failed to calculate Panchang. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCitySelect = (city: any) => {
    setSelectedCity(city);
    setFormData({
      ...formData,
      latitude: city.latitude.toString(),
      longitude: city.longitude.toString(),
      timezone: city.timezone
    });
  };

  useEffect(() => {
    calculatePanchang();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Daily Panchang
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Comprehensive Vedic Panchang calculations using Jyotisha engine
        </p>
      </div>

      {/* Input Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Calculate Panchang
          </CardTitle>
          <CardDescription>
            Enter date and location details for Panchang calculation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="city">Select City</Label>
              <CitySelector
                onCitySelect={handleCitySelect}
                selectedCity={selectedCity}
                placeholder="Search for a city..."
              />
            </div>
            <div>
              <Label htmlFor="timezone">Timezone</Label>
              <Input
                id="timezone"
                value={formData.timezone}
                onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                placeholder="Asia/Kolkata"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                type="number"
                step="0.0001"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                placeholder="28.6139"
              />
            </div>
            <div>
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                type="number"
                step="0.0001"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                placeholder="77.2090"
              />
            </div>
          </div>
          <Button onClick={calculatePanchang} disabled={loading} className="w-full">
            {loading ? "Calculating..." : "Calculate Panchang"}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {panchangData && panchangData.success && (
        <Tabs defaultValue="panchang" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="panchang">Panchang Elements</TabsTrigger>
            <TabsTrigger value="timings">Important Timings</TabsTrigger>
            <TabsTrigger value="planets">Planetary Positions</TabsTrigger>
            <TabsTrigger value="calculations">Calculations</TabsTrigger>
            <TabsTrigger value="comparison">Engine Comparison</TabsTrigger>
          </TabsList>

          {/* Summary Card */}
          <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-sm opacity-80">Date</p>
                  <p className="font-semibold">{panchangData.date}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm opacity-80">Vara (Day)</p>
                  <p className="font-semibold">{panchangData.vara?.english}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm opacity-80">Sunrise</p>
                  <p className="font-semibold">{panchangData.sunrise}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm opacity-80">Sunset</p>
                  <p className="font-semibold">{panchangData.sunset}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <TabsContent value="panchang">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Tithi */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Moon className="h-5 w-5" />
                    Tithi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">{panchangData.tithi?.name}</span>
                        <Badge variant="secondary">Running</Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Ends at {panchangData.tithi?.end_time}
                      </p>
                    </div>
                    
                    {panchangData.next_tithi && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">{panchangData.next_tithi?.name}</span>
                          <Badge variant="outline">Next</Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Starts at {panchangData.next_tithi?.start_time}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Nakshatra */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Nakshatra
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">{panchangData.nakshatra?.name}</span>
                        <Badge variant="secondary">Running</Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Ends at {panchangData.nakshatra?.end_time}
                      </p>
                    </div>
                    
                    {panchangData.next_nakshatra && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">{panchangData.next_nakshatra?.name}</span>
                          <Badge variant="outline">Next</Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Starts at {panchangData.next_nakshatra?.start_time}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Yoga */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sun className="h-5 w-5" />
                    Yoga
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">{panchangData.yoga?.name}</span>
                        <Badge variant="secondary">Running</Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Ends at {panchangData.yoga?.end_time}
                      </p>
                    </div>
                    
                    {panchangData.next_yoga && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">{panchangData.next_yoga?.name}</span>
                          <Badge variant="outline">Next</Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Starts at {panchangData.next_yoga?.start_time}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Karana */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Karana
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">{panchangData.karana?.name}</span>
                        <Badge variant="secondary">Running</Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Ends at {panchangData.karana?.end_time}
                      </p>
                    </div>
                    
                    {panchangData.next_karana && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">{panchangData.next_karana?.name}</span>
                          <Badge variant="outline">Next</Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Starts at {panchangData.next_karana?.start_time}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Vara */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Vara (Day)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-lg">{panchangData.vara?.name}</span>
                      <Badge variant="secondary">{panchangData.vara?.english}</Badge>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <p><span className="font-medium">Number:</span> {panchangData.vara?.number}</p>
                      <p><span className="font-medium">Planet Lord:</span> {panchangData.vara?.planet_lord}</p>
                      <p><span className="font-medium">Location:</span> {panchangData.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Timings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Auspicious Timings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <p><span className="font-medium">Abhijit Muhurta:</span> {panchangData.auspicious_timings?.abhijit_muhurta?.start} - {panchangData.auspicious_timings?.abhijit_muhurta?.end}</p>
                      <p><span className="font-medium">Brahma Muhurta:</span> {panchangData.auspicious_timings?.brahma_muhurta?.start} - {panchangData.auspicious_timings?.brahma_muhurta?.end}</p>
                      <p><span className="font-medium">Amrit Kaal:</span> {panchangData.auspicious_timings?.amrit_kaal?.start} - {panchangData.auspicious_timings?.amrit_kaal?.end}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Inauspicious Timings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Inauspicious Timings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <p><span className="font-medium">Rahu Kaal:</span> {panchangData.inauspicious_timings?.rahu_kaal?.start} - {panchangData.inauspicious_timings?.rahu_kaal?.end}</p>
                      <p><span className="font-medium">Yamaganda:</span> {panchangData.inauspicious_timings?.yamaganda?.start} - {panchangData.inauspicious_timings?.yamaganda?.end}</p>
                      <p><span className="font-medium">Gulikai:</span> {panchangData.inauspicious_timings?.gulikai?.start} - {panchangData.inauspicious_timings?.gulikai?.end}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Planetary Positions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Planetary Positions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <p><span className="font-medium">Sun:</span> {panchangData.planetary_positions?.sun?.sign} {panchangData.planetary_positions?.sun?.degrees?.toFixed(2)}°</p>
                      <p><span className="font-medium">Moon:</span> {panchangData.planetary_positions?.moon?.sign} {panchangData.planetary_positions?.moon?.degrees?.toFixed(2)}°</p>
                      <p><span className="font-medium">Mars:</span> {panchangData.planetary_positions?.mars?.sign} {panchangData.planetary_positions?.mars?.degrees?.toFixed(2)}°</p>
                      <p><span className="font-medium">Mercury:</span> {panchangData.planetary_positions?.mercury?.sign} {panchangData.planetary_positions?.mercury?.degrees?.toFixed(2)}°</p>
                      <p><span className="font-medium">Jupiter:</span> {panchangData.planetary_positions?.jupiter?.sign} {panchangData.planetary_positions?.jupiter?.degrees?.toFixed(2)}°</p>
                      <p><span className="font-medium">Venus:</span> {panchangData.planetary_positions?.venus?.sign} {panchangData.planetary_positions?.venus?.degrees?.toFixed(2)}°</p>
                      <p><span className="font-medium">Saturn:</span> {panchangData.planetary_positions?.saturn?.sign} {panchangData.planetary_positions?.saturn?.degrees?.toFixed(2)}°</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Calculation Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Calculation Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <p><span className="font-medium">Ayanamsa:</span> {panchangData.calculations?.ayanamsa?.toFixed(3)}°</p>
                      <p><span className="font-medium">Julian Day:</span> {panchangData.calculations?.julian_day}</p>
                      <p><span className="font-medium">Method:</span> {panchangData.calculations?.calculation_method}</p>
                      <p><span className="font-medium">Engine:</span> {panchangData.calculation_engine}</p>
                      <p><span className="font-medium">Calculated at:</span> {panchangData.calculations?.calculated_at}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="timings">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sun & Moon Timings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sunrise className="h-5 w-5" />
                    Sun & Moon Timings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Sunrise:</span>
                      <span className="font-semibold">{panchangData.sunrise}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunset:</span>
                      <span className="font-semibold">{panchangData.sunset}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Moonrise:</span>
                      <span className="font-semibold">{panchangData.moonrise}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Moonset:</span>
                      <span className="font-semibold">{panchangData.moonset}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Choghadiya:</span>
                      <span className="font-semibold">{panchangData.choghadiya?.[0]?.name}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Auspicious Times */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Auspicious Times
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Abhijit Muhurta:</span>
                      <span className="font-semibold text-green-600">
                        {panchangData.auspicious_timings?.abhijit_muhurta?.start} - {panchangData.auspicious_timings?.abhijit_muhurta?.end}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rahu Kaal:</span>
                      <span className="font-semibold text-red-600">
                        {panchangData.inauspicious_timings?.rahu_kaal?.start} - {panchangData.inauspicious_timings?.rahu_kaal?.end}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Gulika Kaal:</span>
                      <span className="font-semibold text-red-600">
                        {panchangData.inauspicious_timings?.gulikai?.start} - {panchangData.inauspicious_timings?.gulikai?.end}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Yamaghanta:</span>
                      <span className="font-semibold text-red-600">
                        {panchangData.inauspicious_timings?.yamaganda?.start} - {panchangData.inauspicious_timings?.yamaganda?.end}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Amrit Kaal:</span>
                      <span className="font-semibold text-green-600">
                        {panchangData.auspicious_timings?.amrit_kaal?.start} - {panchangData.auspicious_timings?.amrit_kaal?.end}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="planets">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Planetary Positions */}
              {panchangData.planetary_positions && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>Inner Planets</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Sun:</span>
                          <span className="font-semibold">{panchangData.planetary_positions.sun?.sign} {panchangData.planetary_positions.sun?.degrees?.toFixed(1)}°</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Moon:</span>
                          <span className="font-semibold">{panchangData.planetary_positions.moon?.sign} {panchangData.planetary_positions.moon?.degrees?.toFixed(1)}°</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Mars:</span>
                          <span className="font-semibold">{panchangData.planetary_positions.mars?.sign} {panchangData.planetary_positions.mars?.degrees?.toFixed(1)}°</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Mercury:</span>
                          <span className="font-semibold">{panchangData.planetary_positions.mercury?.sign} {panchangData.planetary_positions.mercury?.degrees?.toFixed(1)}°</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Outer Planets</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Jupiter:</span>
                          <span className="font-semibold">{panchangData.planetary_positions.jupiter?.sign} {panchangData.planetary_positions.jupiter?.degrees?.toFixed(1)}°</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Venus:</span>
                          <span className="font-semibold">{panchangData.planetary_positions.venus?.sign} {panchangData.planetary_positions.venus?.degrees?.toFixed(1)}°</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Saturn:</span>
                          <span className="font-semibold">{panchangData.planetary_positions.saturn?.sign} {panchangData.planetary_positions.saturn?.degrees?.toFixed(1)}°</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Lunar Nodes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Rahu:</span>
                          <span className="font-semibold">{panchangData.planetary_positions.rahu?.sign} {panchangData.planetary_positions.rahu?.degrees?.toFixed(1)}°</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Ketu:</span>
                          <span className="font-semibold">{panchangData.planetary_positions.ketu?.sign} {panchangData.planetary_positions.ketu?.degrees?.toFixed(1)}°</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
              
              {/* Choghadiya if no planetary positions */}
              {!panchangData.planetary_positions && panchangData.choghadiya && (
                <Card>
                  <CardHeader>
                    <CardTitle>Choghadiya Periods</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {panchangData.choghadiya?.slice(0, 6).map((period, index) => (
                        <div key={index} className="flex justify-between">
                          <span>{period.name}:</span>
                          <span className="font-semibold">{period.start} - {period.end}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="calculations">
            <Card>
              <CardHeader>
                <CardTitle>Technical Calculation Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <p className="font-medium">Calculation Method</p>
                    <p className="text-lg font-bold">{panchangData.calculations?.calculation_method}</p>
                  </div>
                  <div>
                    <p className="font-medium">Calculation Engine</p>
                    <p className="text-lg font-bold">{panchangData.calculation_engine}</p>
                  </div>
                  <div>
                    <p className="font-medium">Calculated At</p>
                    <p className="text-lg font-bold">{new Date(panchangData.calculations?.calculated_at).toLocaleTimeString()}</p>
                  </div>
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-lg font-bold">{panchangData.location}</p>
                  </div>
                  {panchangData.calculations && (
                    <>
                      <div>
                        <p className="font-medium">Ayanamsa</p>
                        <p className="text-lg font-bold">{panchangData.calculations.ayanamsa}°</p>
                      </div>
                      <div>
                        <p className="font-medium">Julian Day</p>
                        <p className="text-lg font-bold">{panchangData.calculations.julian_day}</p>
                      </div>
                      <div>
                        <p className="font-medium">Sidereal Time</p>
                        <p className="text-lg font-bold">{panchangData.calculations.sidereal_time}</p>
                      </div>
                      <div>
                        <p className="font-medium">Local Mean Time</p>
                        <p className="text-lg font-bold">{panchangData.calculations.local_mean_time}</p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="comparison">
            <Card>
              <CardHeader>
                <CardTitle>Engine Comparison</CardTitle>
                <CardDescription>
                  Compare calculations from different astronomical engines
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PanchangComparison 
                  selectedDate={formData.date}
                  latitude={parseFloat(formData.latitude)}
                  longitude={parseFloat(formData.longitude)}
                  locationName={selectedCity ? selectedCity.name : 'Selected Location'}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}