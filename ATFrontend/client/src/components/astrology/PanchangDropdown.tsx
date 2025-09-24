import React, { useState, useEffect } from "react";
import { Button } from "src/components/ui/button";
import { Badge } from "src/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "src/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "src/components/ui/dropdown-menu";
import { apiRequest } from "src/lib/queryClient";
import { useToast } from "src/hooks/use-toast";
import {
  Calendar,
  Clock,
  Sun,
  Moon,
  Star,
  ChevronDown,
  MapPin,
  Timer,
  Activity,
} from "lucide-react";

interface PanchangData {
  date: string;
  location: string;
  tithi: {
    name: string;
    end_time: string;
    percentage: number;
    description: string;
  };
  nakshatra: {
    name: string;
    end_time: string;
    percentage: number;
    lord: string;
    characteristics: string;
  };
  yoga: {
    name: string;
    end_time: string;
    description: string;
  };
  karana: {
    name: string;
    end_time: string;
    description: string;
  };
  vara: {
    name: string;
    english: string;
    planet_lord: string;
  };
  sunrise: string;
  sunset: string;
  auspicious_timings: {
    abhijit_muhurta: {
      start: string;
      end: string;
    };
    amrit_kaal: {
      start: string;
      end: string;
    };
    brahma_muhurta: {
      start: string;
      end: string;
    };
  };
  inauspicious_timings: {
    rahu_kaal: {
      start: string;
      end: string;
    };
    yamaganda: {
      start: string;
      end: string;
    };
    gulikai: {
      start: string;
      end: string;
    };
  };
  choghadiya: Array<{
    period: string;
    start: string;
    end: string;
    type: string;
    description: string;
  }>;
}

interface PanchangDropdownProps {
  className?: string;
}

const PanchangDropdown: React.FC<PanchangDropdownProps> = ({
  className = "",
}) => {
  const [panchangData, setPanchangData] = useState<PanchangData | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedEndpoint, setSelectedEndpoint] =
    useState<string>("comprehensive");
  const { toast } = useToast();

  // Default coordinates for Delhi
  const defaultLat = 28.6139;
  const defaultLng = 77.209;

  const panchangEndpoints = [
    {
      key: "comprehensive",
      label: "Complete Panchang",
      icon: <Calendar className="w-4 h-4" />,
      description: "All Panchang elements",
    },
    {
      key: "today",
      label: "Today's Panchang",
      icon: <Sun className="w-4 h-4" />,
      description: "Current day elements",
    },
    {
      key: "tithi",
      label: "Today's Tithi",
      icon: <Moon className="w-4 h-4" />,
      description: "Lunar day information",
    },
    {
      key: "nakshatra",
      label: "Today's Nakshatra",
      icon: <Star className="w-4 h-4" />,
      description: "Star constellation",
    },
    {
      key: "shubh-muhurat",
      label: "Shubh Muhurat",
      icon: <Clock className="w-4 h-4" />,
      description: "Auspicious timings",
    },
    {
      key: "choghadiya",
      label: "Today's Choghadiya",
      icon: <Timer className="w-4 h-4" />,
      description: "Day/night periods",
    },
    {
      key: "rahu-kaal",
      label: "Today's Rahu Kaal",
      icon: <Activity className="w-4 h-4" />,
      description: "Inauspicious timing",
    },
    {
      key: "calendar",
      label: "Panchang Calendar",
      icon: <Calendar className="w-4 h-4" />,
      description: "Specific date lookup",
    },
  ];

  const fetchPanchangData = async (
    endpoint: string,
    showToast: boolean = true,
  ) => {
    setLoading(true);
    try {
      let url = "";
      let response;

      if (endpoint === "comprehensive") {
        url = `/api/panchang/comprehensive?lat=${defaultLat}&lng=${defaultLng}`;
        response = await apiRequest("GET", url);
        const data = await response.json();
        setPanchangData(data.panchang);
      } else if (endpoint === "today") {
        url = `/api/panchang/today?lat=${defaultLat}&lng=${defaultLng}`;
        const data = await apiRequest("GET", url);
        setPanchangData(data);
      } else {
        url = `/api/panchang/today/${endpoint}?lat=${defaultLat}&lng=${defaultLng}`;
        const data = await apiRequest("GET", url);
        setPanchangData(data);
      }

      setSelectedEndpoint(endpoint);

      // Only show toast if explicitly requested (user interaction)
      if (showToast) {
        toast({
          title: "Panchang Data Loaded",
          description: `${panchangEndpoints.find((e) => e.key === endpoint)?.label} fetched successfully`,
        });
      }
    } catch (error: any) {
      console.error("Panchang fetch error:", error);
      // Always show error toasts
      toast({
        title: "Error",
        description: error.message || "Failed to fetch Panchang data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Load today's panchang on mount silently (without toast)
  useEffect(() => {
    fetchPanchangData("today", false);
  }, []);

  const getCurrentChoghadiya = () => {
    if (!panchangData?.choghadiya) return null;

    const now = new Date();
    const currentTime = now.toLocaleTimeString("en-IN", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });

    return panchangData.choghadiya.find((period) => {
      const startTime = period.start.replace(/\s*(AM|PM)/, "");
      const endTime = period.end.replace(/\s*(AM|PM)/, "");
      return currentTime >= startTime && currentTime <= endTime;
    });
  };

  const currentChoghadiya = getCurrentChoghadiya();

  const formatPercentage = (percentage: number) => {
    return `${Math.round(percentage)}%`;
  };

  const getStatusColor = (type: string) => {
    switch (type) {
      case "good":
        return "bg-green-100 text-green-800 border-green-200";
      case "bad":
        return "bg-red-100 text-red-800 border-red-200";
      case "neutral":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  return (
    <div className={`panchang-dropdown ${className}`}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="bg-gradient-to-r from-purple-50 to-orange-50 border-purple-200 hover:from-purple-100 hover:to-orange-100 text-purple-700 shadow-sm"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Panchang
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-96 max-h-[60vh] overflow-y-auto">
          <DropdownMenuLabel className="text-center py-3">
            <div className="flex items-center justify-center gap-2">
              <Sun className="w-5 h-5 text-orange-500" />
              <span className="font-bold text-purple-700">
                Today's Panchang
              </span>
              <Moon className="w-5 h-5 text-blue-500" />
            </div>
          </DropdownMenuLabel>

          {/* Quick Panchang Summary */}
          {panchangData && (
            <div className="px-3 py-2 bg-gradient-to-r from-purple-50 to-orange-50 mx-2 rounded-lg mb-2">
              <div className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {panchangData.location}
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <div className="font-medium text-purple-700">Tithi</div>
                  <div className="text-xs text-gray-600">
                    {panchangData.tithi?.name} (
                    {formatPercentage(panchangData.tithi?.percentage || 0)})
                  </div>
                </div>
                <div>
                  <div className="font-medium text-purple-700">Nakshatra</div>
                  <div className="text-xs text-gray-600">
                    {panchangData.nakshatra?.name} (
                    {formatPercentage(panchangData.nakshatra?.percentage || 0)})
                  </div>
                </div>
                <div>
                  <div className="font-medium text-purple-700">Yoga</div>
                  <div className="text-xs text-gray-600">
                    {panchangData.yoga?.name}
                  </div>
                </div>
                <div>
                  <div className="font-medium text-purple-700">Karana</div>
                  <div className="text-xs text-gray-600">
                    {panchangData.karana?.name}
                  </div>
                </div>
              </div>

              {/* Current Status */}
              {currentChoghadiya && (
                <div className="mt-2 pt-2 border-t border-purple-200">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Current Period:</span>
                    <Badge
                      variant="outline"
                      className={`text-xs ${getStatusColor(currentChoghadiya.type)}`}
                    >
                      {currentChoghadiya.period}
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          )}

          <DropdownMenuSeparator />

          {/* Panchang Options */}
          <DropdownMenuLabel className="text-sm font-medium text-gray-700 px-3">
            Panchang Options
          </DropdownMenuLabel>

          {panchangEndpoints.map((endpoint) => (
            <DropdownMenuItem
              key={endpoint.key}
              onClick={() => fetchPanchangData(endpoint.key, true)}
              className="px-3 py-2 cursor-pointer hover:bg-purple-50 focus:bg-purple-50"
              disabled={loading}
            >
              <div className="flex items-center gap-3 w-full">
                <div className="text-purple-600">{endpoint.icon}</div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    {endpoint.label}
                  </div>
                  <div className="text-xs text-gray-500">
                    {endpoint.description}
                  </div>
                </div>
                {selectedEndpoint === endpoint.key && (
                  <Badge
                    variant="outline"
                    className="text-xs bg-purple-100 text-purple-700 border-purple-200"
                  >
                    Active
                  </Badge>
                )}
              </div>
            </DropdownMenuItem>
          ))}

          {loading && (
            <div className="px-3 py-4 text-center">
              <div className="animate-spin w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full mx-auto mb-2"></div>
              <div className="text-sm text-gray-600">Loading Panchang...</div>
            </div>
          )}

          <DropdownMenuSeparator />

          {/* Quick Timings */}
          {panchangData && (
            <div className="px-3 py-2">
              <div className="text-sm font-medium text-gray-700 mb-2">
                Today's Timings
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sunrise:</span>
                  <span className="font-medium">{panchangData.sunrise}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sunset:</span>
                  <span className="font-medium">{panchangData.sunset}</span>
                </div>
                {panchangData.auspicious_timings?.abhijit_muhurta && (
                  <div className="flex justify-between col-span-2">
                    <span className="text-gray-600">Abhijit Muhurta:</span>
                    <span className="font-medium text-green-600">
                      {panchangData.auspicious_timings.abhijit_muhurta.start} -{" "}
                      {panchangData.auspicious_timings.abhijit_muhurta.end}
                    </span>
                  </div>
                )}
                {panchangData.inauspicious_timings?.rahu_kaal && (
                  <div className="flex justify-between col-span-2">
                    <span className="text-gray-600">Rahu Kaal:</span>
                    <span className="font-medium text-red-600">
                      {panchangData.inauspicious_timings.rahu_kaal.start} -{" "}
                      {panchangData.inauspicious_timings.rahu_kaal.end}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default PanchangDropdown;
