import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import { Label } from "src/components/ui/label";
import { Badge } from "src/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "src/components/ui/select";
import { Calendar, MapPin, Clock, Sun, Moon, Star, Search } from "lucide-react";
import { apiRequest } from "src/lib/queryClient";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "src/hooks/use-toast";

interface PanchangamData {
  success: boolean;
  date: string;
  time: string;
  location: {
    latitude: number;
    longitude: number;
    timezone: string;
  };
  panchangam: {
    tithi: {
      number: number;
      name: string;
      paksha: string;
      angle: number;
    };
    nakshatra: {
      number: number;
      name: string;
      pada: number;
      lord: string;
    };
    yoga: {
      number: number;
      name: string;
      angle: number;
    };
    karana: {
      number: number;
      name: string;
      angle: number;
    };
    vara: {
      number: number;
      name: string;
      english: string;
    };
  };
  sun_times: {
    sunrise: number | null;
    sunset: number | null;
    moonrise: number | null;
    moonset: number | null;
  };
  additional_info: {
    ayanam: string;
    ritu: string;
    lunar_phase: string;
    solar_month: number;
    sun_declination: number;
  };
  ayanamsa: number;
  calculation_method: string;
}

interface PanchangamWidgetProps {
  defaultLocation?: {
    name: string;
    latitude: number;
    longitude: number;
    timezone: string;
  };
}

export default function PanchangamWidget({ defaultLocation }: PanchangamWidgetProps) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('06:00');
  const [location, setLocation] = useState(defaultLocation || {
    name: 'Chennai, India',
    latitude: 13.0827,
    longitude: 80.2707,
    timezone: 'Asia/Kolkata'
  });
  const [locationQuery, setLocationQuery] = useState('');
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const { toast } = useToast();

  // Location search functionality
  const locationSearchMutation = useMutation({
    mutationFn: async (query: string) => {
      console.log("Making API request for:", query);
      const response = await apiRequest('GET', `/api/locations/search?q=${encodeURIComponent(query)}`);
      const result = await response.json();
      console.log("API response:", result);
      return result;
    },
    onError: (error) => {
      console.error("Location search mutation error:", error);
    }
  });

  const handleLocationSearch = (query: string) => {
    setLocationQuery(query);
    if (query.length > 2) {
      console.log("Searching for location:", query);
      locationSearchMutation.mutate(query);
      setIsLocationDropdownOpen(true);
    } else {
      setIsLocationDropdownOpen(false);
    }
  };

  const selectLocation = (selectedLocation: any) => {
    setLocation({
      name: selectedLocation.display || selectedLocation.name,
      latitude: selectedLocation.latitude,
      longitude: selectedLocation.longitude,
      timezone: selectedLocation.timezone || 'Asia/Kolkata'
    });
    setLocationQuery(selectedLocation.display || selectedLocation.name);
    setIsLocationDropdownOpen(false);
  };

  const calculatePanchangamMutation = useMutation({
    mutationFn: async (data: {
      date: string;
      time: string;
      latitude: number;
      longitude: number;
      timezone: string;
    }) => {
      const response = await apiRequest('POST', '/api/panchangam/daily', data);
      return response.json();
    },
  });

  const handleCalculate = () => {
    calculatePanchangamMutation.mutate({
      date,
      time,
      latitude: location.latitude,
      longitude: location.longitude,
      timezone: location.timezone
    });
  };

  // Auto-calculate on component mount and location change
  useEffect(() => {
    handleCalculate();
  }, [location]);

  // Initialize location query
  useEffect(() => {
    setLocationQuery(location.name);
  }, []);

  const panchangamData = calculatePanchangamMutation.data as PanchangamData;

  const formatTime = (jd: number | null) => {
    if (!jd) return 'N/A';
    // Convert Julian Day to time string (simplified)
    const date = new Date((jd - 2440587.5) * 86400000);
    return date.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      timeZone: location.timezone 
    });
  };

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="h-5 w-5" />
            Jyotisha Panchangam Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Time
              </Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
            <div className="space-y-2 relative">
              <Label className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location
              </Label>
              <div className="relative">
                <Input
                  placeholder="Search for a city..."
                  value={locationQuery || location.name}
                  onChange={(e) => handleLocationSearch(e.target.value)}
                  className="pr-10"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                
                {/* Location Dropdown */}
                {isLocationDropdownOpen && locationSearchMutation.data?.success && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                    {locationSearchMutation.data.locations.map((loc: any, index: number) => (
                      <div
                        key={index}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                        onClick={() => selectLocation(loc)}
                      >
                        <div className="font-medium">{loc.name}</div>
                        <div className="text-gray-500 text-xs">
                          {loc.state && `${loc.state}, `}{loc.country}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Loading state */}
                {locationSearchMutation.isPending && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-4">
                    <div className="text-sm text-gray-500">Searching...</div>
                  </div>
                )}
                
                {/* Error state */}
                {locationSearchMutation.isError && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-4">
                    <div className="text-sm text-red-500">Search failed. Please try again.</div>
                  </div>
                )}
                
                {/* Debug info */}
                {locationQuery && locationQuery.length > 2 && (
                  <div className="absolute z-50 w-full mt-1 bg-yellow-50 border border-yellow-300 rounded-md shadow-lg p-2 text-xs">
                    <div>Query: "{locationQuery}" (length: {locationQuery.length})</div>
                    <div>Dropdown Open: {String(isLocationDropdownOpen)}</div>
                    <div>Pending: {String(locationSearchMutation.isPending)}</div>
                    <div>Has Data: {String(!!locationSearchMutation.data)}</div>
                    <div>Success: {String(locationSearchMutation.data?.success)}</div>
                    <div>Results: {locationSearchMutation.data?.locations?.length || 0}</div>
                    <div>Error: {String(locationSearchMutation.isError)}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <Button 
            onClick={handleCalculate}
            disabled={calculatePanchangamMutation.isPending}
            className="w-full"
          >
            {calculatePanchangamMutation.isPending ? "Calculating..." : "Calculate Panchangam"}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {panchangamData && panchangamData.success && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Tithi */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Moon className="h-5 w-5" />
                Tithi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-xl font-bold text-primary">
                  {panchangamData.panchangam.tithi.name}
                </div>
                <div className="text-sm text-gray-600">
                  {panchangamData.panchangam.tithi.paksha} Paksha
                </div>
                <Badge variant="secondary">
                  #{panchangamData.panchangam.tithi.number}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Nakshatra */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Star className="h-5 w-5" />
                Nakshatra
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-xl font-bold text-primary">
                  {panchangamData.panchangam.nakshatra.name}
                </div>
                <div className="text-sm text-gray-600">
                  Pada: {panchangamData.panchangam.nakshatra.pada}
                </div>
                <div className="text-sm text-gray-600">
                  Lord: {panchangamData.panchangam.nakshatra.lord}
                </div>
                <Badge variant="secondary">
                  #{panchangamData.panchangam.nakshatra.number}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Yoga */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sun className="h-5 w-5" />
                Yoga
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-xl font-bold text-primary">
                  {panchangamData.panchangam.yoga.name}
                </div>
                <Badge variant="secondary">
                  #{panchangamData.panchangam.yoga.number}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Karana */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5" />
                Karana
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-xl font-bold text-primary">
                  {panchangamData.panchangam.karana.name}
                </div>
                <Badge variant="secondary">
                  #{panchangamData.panchangam.karana.number}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Vara */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5" />
                Vara (Day)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-xl font-bold text-primary">
                  {panchangamData.panchangam.vara.name}
                </div>
                <div className="text-sm text-gray-600">
                  {panchangamData.panchangam.vara.english}
                </div>
                <Badge variant="secondary">
                  #{panchangamData.panchangam.vara.number}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Sun & Moon Times */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sun className="h-5 w-5" />
                Celestial Times
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Sunrise:</span>
                  <span className="font-medium">
                    {formatTime(panchangamData.sun_times.sunrise)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Sunset:</span>
                  <span className="font-medium">
                    {formatTime(panchangamData.sun_times.sunset)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Moonrise:</span>
                  <span className="font-medium">
                    {formatTime(panchangamData.sun_times.moonrise)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Moonset:</span>
                  <span className="font-medium">
                    {formatTime(panchangamData.sun_times.moonset)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Vedic Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Star className="h-5 w-5" />
                Vedic Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Ayanam:</span>
                  <span className="font-medium">
                    {panchangamData.additional_info.ayanam}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Ritu:</span>
                  <span className="font-medium">
                    {panchangamData.additional_info.ritu}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Lunar Phase:</span>
                  <span className="font-medium">
                    {panchangamData.additional_info.lunar_phase}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Calculation Info */}
      {panchangamData && panchangamData.success && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Calculation Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-gray-600">Method:</div>
                <div className="font-medium">{panchangamData.calculation_method}</div>
              </div>
              <div>
                <div className="text-gray-600">Ayanamsa:</div>
                <div className="font-medium">{panchangamData.ayanamsa.toFixed(4)}°</div>
              </div>
              <div>
                <div className="text-gray-600">Location:</div>
                <div className="font-medium">
                  {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                </div>
              </div>
              <div>
                <div className="text-gray-600">Timezone:</div>
                <div className="font-medium">{location.timezone}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {calculatePanchangamMutation.isError && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-red-600">
              Error calculating Panchangam: {calculatePanchangamMutation.error?.message}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}