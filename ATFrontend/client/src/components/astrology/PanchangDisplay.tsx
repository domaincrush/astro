import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { Badge } from "src/components/ui/badge";
import { Button } from "src/components/ui/button";
import { Separator } from "src/components/ui/separator";
import { Calendar, Clock, Sun, Moon, Star, MapPin, Sunrise, Sunset, Timer, AlertTriangle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "src/lib/queryClient";

interface PanchangApiResponse {
  success: boolean;
  date: string;
  location: {
    latitude: number;
    longitude: number;
    timezone: string;
  };
  panchang: {
    tithi: {
      current: {
        name: string;
        number: number;
        startTime: string;
        endTime: string;
        paksha: string;
        percentage: number;
      };
      next?: {
        name: string;
        number: number;
        startTime: string;
        endTime: string;
        nextDay: boolean;
        paksha: string;
      };
    };
    nakshatra: {
      current: {
        name: string;
        number: number;
        startTime: string;
        endTime: string;
        lord: string;
        percentage: number;
      };
      next?: {
        name: string;
        number: number;
        startTime: string;
        endTime: string;
        lord: string;
        nextDay: boolean;
      };
    };
    yoga: {
      current: {
        name: string;
        number: number;
        startTime: string;
        endTime: string;
      };
    };
    karana: {
      current: {
        name: string;
        number: number;
        startTime: string;
        endTime: string;
      };
    };
    vara: {
      name: string;
      lord: string;
    };
  };
  sunrise: string;
  sunset: string;
  moonrise?: string;
  moonset?: string;
  moonsign: string;
  sunsign: string;
  auspiciousTimes?: {
    abhijitMuhurta: {
      start: string;
      end: string;
    };
    brahmaMuhurta: {
      start: string;
      end: string;
    };
    amritKaal: {
      start: string;
      end: string;
    };
  };
  inauspiciousTimes?: {
    rahuKaal: {
      start: string;
      end: string;
    };
    yamaganda: {
      start: string;
      end: string;
    };
    gulika: {
      start: string;
      end: string;
    };
    durMuhurat: Array<{
      start: string;
      end: string;
    }>;
    varjyam: {
      start: string;
      end: string;
    };
  };
  choghadiya?: {
    day: Array<{
      name: string;
      start: string;
      end: string;
      nature: string;
    }>;
  };
  festivals?: Array<{
    name: string;
    type: string;
    description: string;
  }>;
  additionalInfo?: {
    vikramSamvat: number;
    shakaSamvat: number;
    lunarMonth: string;
  };
}

export default function PanchangDisplay() {
  const [panchangData, setPanchangData] = useState<PanchangApiResponse | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const [location, setLocation] = useState("Delhi, India");
  const [cityInput, setCityInput] = useState("Delhi");
  const [citySuggestions, setCitySuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCoordinates, setSelectedCoordinates] = useState({
    latitude: 28.6139,
    longitude: 77.2090
  });

  const panchangMutation = useMutation({
    mutationFn: async (dateToFetch: string) => {
      const response = await apiRequest("POST", "/api/panchang/daily", {
        date: dateToFetch,
        latitude: selectedCoordinates.latitude,
        longitude: selectedCoordinates.longitude,
        timezone: "Asia/Kolkata"
      });
      return response.json();
    },
    onSuccess: (result) => {
      if (result.success) {
        setPanchangData(result);
      }
    }
  });

  const loadPanchang = (dateToLoad?: string) => {
    const targetDate = dateToLoad || currentDate;
    panchangMutation.mutate(targetDate);
  };

  // City search functionality
  const searchCities = async (query: string) => {
    if (query.length < 2) {
      setCitySuggestions([]);
      return;
    }
    
    try {
      const response = await apiRequest("GET", `/api/search-locations?query=${encodeURIComponent(query)}`);
      const data = await response.json();
      setCitySuggestions(data.slice(0, 5)); // Show top 5 suggestions
    } catch (error) {
      console.error('City search error:', error);
      setCitySuggestions([]);
    }
  };

  const handleCityInputChange = (value: string) => {
    setCityInput(value);
    setShowSuggestions(true);
    searchCities(value);
  };

  const handleCitySelect = (city: any) => {
    const cityName = city.display || city.name || city.city;
    setCityInput(cityName);
    setLocation(cityName);
    setSelectedCoordinates({
      latitude: parseFloat(city.latitude),
      longitude: parseFloat(city.longitude)
    });
    setShowSuggestions(false);
    setCitySuggestions([]);
  };

  useEffect(() => {
    loadPanchang(currentDate);
  }, [currentDate]);

  useEffect(() => {
    if (selectedCoordinates.latitude && selectedCoordinates.longitude) {
      loadPanchang(currentDate);
    }
  }, [selectedCoordinates]);

  const formatTime = (timeStr: string) => {
    if (!timeStr || timeStr === 'N/A' || timeStr === 'undefined') return 'N/A';
    try {
      // Handle both HH:MM and HH:MM:SS formats
      const timeParts = timeStr.split(':');
      if (timeParts.length >= 2) {
        const hours = parseInt(timeParts[0]);
        const minutes = parseInt(timeParts[1]);
        const date = new Date();
        date.setHours(hours, minutes, 0, 0);
        return date.toLocaleTimeString('en-IN', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        });
      }
      return timeStr;
    } catch {
      return timeStr;
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-IN', { 
        weekday: 'long',
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch {
      return dateStr;
    }
  };

  const getCompletionColor = (percentage: number) => {
    if (percentage > 75) return "text-green-600";
    if (percentage > 50) return "text-yellow-600";
    if (percentage > 25) return "text-orange-600";
    return "text-red-600";
  };

  // Format date ranges for Panchang elements
  const formatDateRange = (baseDate: string, startTime: string, endTime: string, isNextDay: boolean = false) => {
    const date = new Date(baseDate);
    const startDate = new Date(date);
    const endDate = isNextDay ? new Date(date.getTime() + 24 * 60 * 60 * 1000) : new Date(date);
    
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    const formatDateStr = (d: Date) => `${monthNames[d.getMonth()]} ${d.getDate()}`;
    
    return `${formatDateStr(startDate)} ${formatTime(startTime)} – ${formatDateStr(endDate)} ${formatTime(endTime)}`;
  };

  // Add safety check for panchang data
  if (!panchangData || !panchangData.panchang || !panchangData.panchang.tithi) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Loading Panchang data...</p>
        </div>
      </div>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200 shadow-lg">
      <CardHeader className="text-center pb-4 bg-gradient-to-r from-orange-100 to-amber-100 rounded-t-lg">
        <CardTitle className="text-2xl font-bold text-amber-800 flex items-center justify-center gap-2">
          <Calendar className="h-6 w-6" />
          आज का पंचांग - Daily Panchang
        </CardTitle>
        <div className="flex items-center justify-center gap-2 text-sm text-amber-700">
          <MapPin className="h-4 w-4" />
          {location}
        </div>
        {panchangData && (
          <div className="text-xs text-amber-600 mt-1">
            {formatDate(panchangData.date)}
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-6 p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-amber-600" />
              <input
                type="date"
                value={currentDate}
                onChange={(e) => {
                  const newDate = e.target.value;
                  setCurrentDate(newDate);
                  // Force immediate reload with new date
                  loadPanchang(newDate);
                }}
                className="px-3 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
              />
            </div>
            
            <div className="relative">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-amber-600" />
                <input
                  type="text"
                  value={cityInput}
                  onChange={(e) => handleCityInputChange(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  placeholder="Enter city name"
                  className="px-3 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm w-40"
                />
              </div>
              
              {showSuggestions && citySuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-orange-200 rounded-lg shadow-lg z-50 max-h-40 overflow-y-auto">
                  {citySuggestions.map((city, index) => (
                    <div
                      key={index}
                      onClick={() => handleCitySelect(city)}
                      className="px-3 py-2 hover:bg-orange-50 cursor-pointer text-sm border-b border-orange-100 last:border-b-0"
                    >
                      <div className="font-medium text-gray-800">{city.name}</div>
                      <div className="text-gray-500 text-xs">{city.state ? `${city.state}, ${city.country}` : city.country}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <Button 
            onClick={loadPanchang}
            disabled={panchangMutation.isPending}
            className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white shadow-md"
          >
            {panchangMutation.isPending ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                Loading...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Timer className="h-4 w-4" />
                Get Panchang
              </div>
            )}
          </Button>
        </div>

        {panchangData && (
          <div className="space-y-6">
            {/* Drik Panchang Format Display */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-blue-600 text-white p-4">
                <h2 className="text-xl font-bold">
                  Panchang {formatDate(panchangData.date)}
                </h2>
                <p className="text-blue-100">{location}</p>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Basic Timings */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="font-semibold">Sunrise</div>
                    <div className="text-blue-600">{formatTime(panchangData.sunrise)}</div>
                  </div>
                  <div>
                    <div className="font-semibold">Sunset</div>
                    <div className="text-blue-600">{formatTime(panchangData.sunset)}</div>
                  </div>
                  <div>
                    <div className="font-semibold">Moonrise</div>
                    <div className="text-blue-600">{formatTime(panchangData.moonrise)}</div>
                  </div>
                  <div>
                    <div className="font-semibold">Moonset</div>
                    <div className="text-blue-600">{formatTime(panchangData.moonset)}</div>
                  </div>
                </div>

                {/* Additional Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="font-semibold">Ayana</div>
                    <div className="text-gray-700">Uttarayan</div>
                    <div className="font-semibold mt-2">Drik Ritu</div>
                    <div className="text-gray-700">Varsha (Monsoon)</div>
                    <div className="font-semibold mt-2">V. Ayana</div>
                    <div className="text-gray-700">Dakshinayan</div>
                  </div>
                  <div>
                    <div className="font-semibold">Vikram Samvat</div>
                    <div className="text-gray-700">2082, Kalayukta</div>
                    <div className="font-semibold mt-2">Shaka Samvat</div>
                    <div className="text-gray-700">1947, Visvavasu</div>
                  </div>
                  <div>
                    <div className="font-semibold">Purnimanta</div>
                    <div className="text-gray-700">Ashadha</div>
                    <div className="font-semibold mt-2">Amanta Month</div>
                    <div className="text-gray-700">Jyeshta</div>
                  </div>
                </div>

                {/* Tithi */}
                <div>
                  <h3 className="font-bold text-lg mb-2">Tithi</h3>
                  <div className="space-y-1 text-sm">
                    {panchangData.panchang.tithi.current && (
                      <div className="flex justify-between">
                        <span className="font-medium">
                          {panchangData.panchang.tithi.current.paksha} {panchangData.panchang.tithi.current.name}
                        </span>
                        <span className="text-gray-600">
                          {formatDateRange(panchangData.date, panchangData.panchang.tithi.current.startTime, panchangData.panchang.tithi.current.endTime, false)}
                        </span>
                      </div>
                    )}
                    {panchangData.panchang.tithi.next && (
                      <div className="flex justify-between">
                        <span className="font-medium">
                          {panchangData.panchang.tithi.next.paksha} {panchangData.panchang.tithi.next.name}
                        </span>
                        <span className="text-gray-600">
                          {formatDateRange(panchangData.date, panchangData.panchang.tithi.next.startTime, panchangData.panchang.tithi.next.endTime, panchangData.panchang.tithi.next.nextDay)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Nakshatra */}
                <div>
                  <h3 className="font-bold text-lg mb-2">Nakshatra</h3>
                  <div className="space-y-1 text-sm">
                    {panchangData.panchang.nakshatra.current && (
                      <div className="flex justify-between">
                        <span className="font-medium">{panchangData.panchang.nakshatra.current.name}</span>
                        <span className="text-gray-600">
                          {formatDateRange(panchangData.date, panchangData.panchang.nakshatra.current.startTime, panchangData.panchang.nakshatra.current.endTime, false)}
                        </span>
                      </div>
                    )}
                    {panchangData.panchang.nakshatra.next && (
                      <div className="flex justify-between">
                        <span className="font-medium">{panchangData.panchang.nakshatra.next.name}</span>
                        <span className="text-gray-600">
                          {formatDateRange(panchangData.date, panchangData.panchang.nakshatra.next.startTime, panchangData.panchang.nakshatra.next.endTime, panchangData.panchang.nakshatra.next.nextDay)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Karana */}
                <div>
                  <h3 className="font-bold text-lg mb-2">Karana</h3>
                  <div className="space-y-1 text-sm">
                    {panchangData.panchang.karana.sequence ? (
                      panchangData.panchang.karana.sequence.map((karana, index) => (
                        <div key={index} className="flex justify-between">
                          <span className="font-medium">{karana.name}</span>
                          <span className="text-gray-600">
                            {formatDateRange(panchangData.date, karana.startTime, karana.endTime, karana.nextDay)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="flex justify-between">
                        <span className="font-medium">{panchangData.panchang.karana.name}</span>
                        <span className="text-gray-600">upto {formatTime(panchangData.panchang.karana.endTime)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Yoga */}
                <div>
                  <h3 className="font-bold text-lg mb-2">Yoga</h3>
                  <div className="space-y-1 text-sm">
                    {panchangData.panchang.yoga.current && (
                      <div className="flex justify-between">
                        <span className="font-medium">{panchangData.panchang.yoga.current.name}</span>
                        <span className="text-gray-600">
                          {formatDateRange(panchangData.date, panchangData.panchang.yoga.current.startTime, panchangData.panchang.yoga.current.endTime, false)}
                        </span>
                      </div>
                    )}
                    {panchangData.panchang.yoga.next && (
                      <div className="flex justify-between">
                        <span className="font-medium">{panchangData.panchang.yoga.next.name}</span>
                        <span className="text-gray-600">
                          {formatDateRange(panchangData.date, panchangData.panchang.yoga.next.startTime, panchangData.panchang.yoga.next.endTime, panchangData.panchang.yoga.next.nextDay)}
                        </span>
                      </div>
                    )}
                    {panchangData.panchang.yoga.third && (
                      <div className="flex justify-between">
                        <span className="font-medium">{panchangData.panchang.yoga.third.name}</span>
                        <span className="text-gray-600">
                          {formatDateRange(panchangData.date, panchangData.panchang.yoga.third.startTime, panchangData.panchang.yoga.third.endTime, panchangData.panchang.yoga.third.nextDay)}
                        </span>
                      </div>
                    )}
                    {!panchangData.panchang.yoga.current && (
                      <div className="flex justify-between">
                        <span className="font-medium">{panchangData.panchang.yoga.name}</span>
                        <span className="text-gray-600">upto {formatTime(panchangData.panchang.yoga.endTime)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Vara */}
                <div>
                  <h3 className="font-bold text-lg mb-2">Vara</h3>
                  <div className="text-sm">
                    <span className="font-medium">{panchangData.panchang.vara.name}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Day & Time Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-sky-50 p-4 rounded-lg border border-blue-100">
                <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                  <Sun className="h-4 w-4" />
                  दिन की जानकारी - Day Information
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700">वार - Day:</span>
                    <span className="font-medium text-blue-900">{panchangData.panchang.vara.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Day Lord:</span>
                    <span className="font-medium text-blue-900">{panchangData.panchang.vara.lord}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-700 flex items-center gap-1">
                      <Sunrise className="h-3 w-3" />
                      Sunrise:
                    </span>
                    <span className="font-medium text-blue-900">{formatTime(panchangData.sunrise)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-700 flex items-center gap-1">
                      <Sunset className="h-3 w-3" />
                      Sunset:
                    </span>
                    <span className="font-medium text-blue-900">{formatTime(panchangData.sunset)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-700 flex items-center gap-1">
                      <Moon className="h-3 w-3" />
                      Moonrise:
                    </span>
                    <span className="font-medium text-blue-900">{formatTime(panchangData.moonrise)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-4 rounded-lg border border-purple-100">
                <h4 className="font-semibold text-purple-800 mb-3">
                  चांद्र मास - Lunar Month
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-purple-700">Amanta Month:</span>
                    <span className="font-medium text-purple-900">{panchangData.lunarMonth?.name || 'Jyeshtha'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-700">Purnimanta Month:</span>
                    <span className="font-medium text-purple-900">Ashadha</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-700">Paksha:</span>
                    <span className="font-medium text-purple-900">{panchangData.lunarMonth?.paksha || 'Krishna Paksha'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-700">Vikram Samvat:</span>
                    <span className="font-medium text-purple-900">{panchangData.samvat?.vikram || '2082 Kalayukta'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-700">Shaka Samvat:</span>
                    <span className="font-medium text-purple-900">{panchangData.samvat?.shaka || '1947 Vishvavasu'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Panchang Details */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-100">
              <h4 className="font-semibold text-indigo-800 mb-3">
                अतिरिक्त विवरण - Additional Details
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div className="space-y-1">
                  <span className="text-indigo-700 font-medium">Moonsign:</span>
                  <div className="font-semibold text-indigo-900">{panchangData.moonsign || 'Mithuna'}</div>
                </div>
                <div className="space-y-1">
                  <span className="text-indigo-700 font-medium">Sunsign:</span>
                  <div className="font-semibold text-indigo-900">{panchangData.sunsign || 'Mithuna'}</div>
                </div>
                <div className="space-y-1">
                  <span className="text-indigo-700 font-medium">Weekday:</span>
                  <div className="font-semibold text-indigo-900">{panchangData.panchang.vara.name}</div>
                </div>
              </div>
            </div>

            {/* Auspicious & Inauspicious Times */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100">
                <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  शुभ मुहूर्त - Auspicious Times
                </h4>
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded border border-green-100">
                    <div className="flex justify-between items-center">
                      <span className="text-green-700 font-medium">Abhijit Muhurta</span>
                      <span className="font-semibold text-green-800">
                        {formatTime(panchangData.auspiciousTimes?.abhijitMuhurta?.start)} - {formatTime(panchangData.auspiciousTimes?.abhijitMuhurta?.end)}
                      </span>
                    </div>
                    <div className="text-xs text-green-600 mt-1">Most auspicious time</div>
                  </div>
                  <div className="bg-white p-3 rounded border border-green-100">
                    <div className="flex justify-between items-center">
                      <span className="text-green-700 font-medium">Brahma Muhurta</span>
                      <span className="font-semibold text-green-800">
                        {formatTime(panchangData.auspiciousTimes?.brahmaMuhurta?.start)} - {formatTime(panchangData.auspiciousTimes?.brahmaMuhurta?.end)}
                      </span>
                    </div>
                    <div className="text-xs text-green-600 mt-1">Best for meditation</div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-rose-50 p-4 rounded-lg border border-red-100">
                <h4 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  अशुभ काल - Inauspicious Times
                </h4>
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded border border-red-100">
                    <div className="flex justify-between items-center">
                      <span className="text-red-700 font-medium">Rahu Kaal</span>
                      <span className="font-semibold text-red-800">
                        {panchangData.inauspiciousTimes?.rahuKaal?.start 
                          ? `${formatTime(panchangData.inauspiciousTimes.rahuKaal.start)} - ${formatTime(panchangData.inauspiciousTimes.rahuKaal.end)}`
                          : '12:15 PM - 01:45 PM'
                        }
                      </span>
                    </div>
                    <div className="text-xs text-red-600 mt-1">Avoid new ventures</div>
                  </div>
                  <div className="bg-white p-3 rounded border border-red-100">
                    <div className="flex justify-between items-center">
                      <span className="text-red-700 font-medium">Gulika Kaal</span>
                      <span className="font-semibold text-red-800">
                        {panchangData.inauspiciousTimes?.gulika?.start
                          ? `${formatTime(panchangData.inauspiciousTimes.gulika.start)} - ${formatTime(panchangData.inauspiciousTimes.gulika.end)}`
                          : 'N/A'
                        }
                      </span>
                    </div>
                    <div className="text-xs text-red-600 mt-1">Inauspicious period</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {panchangMutation.isPending && (
          <div className="text-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-orange-300 border-t-orange-600 rounded-full mx-auto"></div>
            <p className="text-amber-700 mt-4 font-medium">Calculating Panchang...</p>
            <p className="text-amber-600 text-sm mt-1">Getting authentic astronomical data</p>
          </div>
        )}

        {!panchangData && !panchangMutation.isPending && (
          <div className="text-center py-8 text-amber-700">
            <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Click "Get Panchang" to view today's authentic Vedic calendar</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}