import { useState, useRef, useEffect } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "src/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "src/components/ui/dialog";
import {
  Calendar,
  MapPin,
  Clock,
  Star,
  Users,
  BookOpen,
  Download,
  Image as ImageIcon,
  Mail,
  Crown,
  TrendingUp,
  Globe,
} from "lucide-react";
import {
  VedicAstrologyCalculator,
  VedicBirthChart,
} from "src/lib/vedic-astrology";
import { ZODIAC_SIGNS, PLANETS, HOUSES } from "src/lib/astrology";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "src/lib/queryClient";
import ChartImageGenerator from "./ChartImageGenerator";
import VedicDetailsDisplay from "./VedicDetailsDisplay";
import { useLocation } from "wouter";

interface BirthChartGeneratorProps {
  onChartGenerated?: (chart: VedicBirthChart) => void;
  initialData?: {
    name?: string;
    birthDate?: string;
    birthTime?: string;
    birthPlace?: string;
    gender?: string;
    latitude?: number;
    longitude?: number;
  } | null;
}

interface LocationSuggestion {
  name: string;
  country: string;
  state?: string;
  latitude: number;
  longitude: number;
  display: string;
}

// Helper functions for house analysis
const getHouseName = (houseNumber: number): string => {
  const houseNames = [
    "Tanu Bhava",
    "Dhana Bhava",
    "Sahaja Bhava",
    "Sukha Bhava",
    "Putra Bhava",
    "Ripu Bhava",
    "Kalatra Bhava",
    "Ayur Bhava",
    "Dharma Bhava",
    "Karma Bhava",
    "Labha Bhava",
    "Vyaya Bhava",
  ];
  return houseNames[houseNumber - 1] || `House ${houseNumber}`;
};

const getOrdinal = (num: number): string => {
  const ordinals = [
    "st",
    "nd",
    "rd",
    "th",
    "th",
    "th",
    "th",
    "th",
    "th",
    "th",
    "th",
    "th",
  ];
  return ordinals[num - 1] || "th";
};

const getHouseSignificance = (houseNumber: number): string => {
  const significances = [
    "Self, personality, physical body, appearance",
    "Wealth, family, speech, food, values",
    "Siblings, courage, communication, short journeys",
    "Home, mother, happiness, property, education",
    "Children, creativity, intelligence, romance",
    "Enemies, diseases, debts, service, competition",
    "Marriage, partnerships, spouse, business",
    "Longevity, transformation, occult, inheritance",
    "Religion, philosophy, fortune, long journeys",
    "Career, reputation, authority, father",
    "Gains, income, friends, aspirations, elder siblings",
    "Losses, expenses, spirituality, foreign lands",
  ];
  return significances[houseNumber - 1] || "House significance";
};

const getPlanetStatus = (planet: any, allPlanets: any[]): string[] => {
  const status = [];

  // Check retrograde
  if (planet.retrograde) {
    status.push("Retrograde");
  } else {
    status.push("Direct");
  }

  // Check combustion (within 8° of Sun for most planets, 17° for Jupiter)
  const sun = allPlanets.find((p) => p.name === "Sun");
  if (sun && planet.name !== "Sun") {
    const diff = Math.abs(planet.longitude - sun.longitude);
    const adjustedDiff = Math.min(diff, 360 - diff);
    const combustionLimit = planet.name === "Jupiter" ? 17 : 8;

    if (adjustedDiff <= combustionLimit) {
      status.push("Combust");
    }
  }

  // Check exaltation/debilitation
  const exaltationSigns: { [key: string]: string } = {
    Sun: "Mesha",
    Moon: "Vrishabha",
    Mars: "Makara",
    Mercury: "Kanya",
    Jupiter: "Karka",
    Venus: "Meena",
    Saturn: "Tula",
  };

  const debilitationSigns: { [key: string]: string } = {
    Sun: "Tula",
    Moon: "Vrishchika",
    Mars: "Karka",
    Mercury: "Meena",
    Jupiter: "Makara",
    Venus: "Kanya",
    Saturn: "Mesha",
  };

  if (exaltationSigns[planet.name] === planet.sign) {
    status.push("Exalted");
  } else if (debilitationSigns[planet.name] === planet.sign) {
    status.push("Debilitated");
  }

  return status;
};

const getStatusVariant = (
  status: string,
): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "Exalted":
      return "default";
    case "Debilitated":
      return "destructive";
    case "Combust":
      return "destructive";
    case "Retrograde":
      return "secondary";
    case "Direct":
      return "outline";
    default:
      return "outline";
  }
};

function BirthChartGenerator({
  onChartGenerated,
  initialData,
}: BirthChartGeneratorProps) {
  const [, setLocation] = useLocation();
  const [birthData, setBirthData] = useState({
    name: initialData?.name || "",
    gender: initialData?.gender || "male",
    date: initialData?.birthDate || "",
    time: initialData?.birthTime || "",
    location: initialData?.birthPlace || "",
    latitude: initialData?.latitude || 0,
    longitude: initialData?.longitude || 0,
    timezone: "Asia/Kolkata",
  });

  // Update birthData when initialData changes
  useEffect(() => {
    if (initialData) {
      console.log("Initial data received:", initialData);
      // Keep DD-MM-YYYY format as requested by user
      let formattedDate = initialData.birthDate || "";
      
      setBirthData({
        name: initialData.name || "",
        gender: initialData.gender || "male",
        date: formattedDate,
        time: initialData.birthTime || "",
        location: initialData.birthPlace || "",
        latitude: initialData.latitude || 0,
        longitude: initialData.longitude || 0,
        timezone: "Asia/Kolkata",
      });
      
      console.log("Birth data updated:", {
        name: initialData.name || "",
        date: formattedDate,
        time: initialData.birthTime || "",
        location: initialData.birthPlace || "",
      });
      
      // Auto-generate chart if all required data is present
      if (initialData.name && initialData.birthDate && initialData.birthTime && 
          initialData.birthPlace && initialData.latitude && initialData.longitude) {
        console.log("Auto-generating chart with complete data...");
        setTimeout(() => {
          handleGenerateChart();
        }, 100); // Small delay to ensure state is updated
      }
    }
  }, [initialData]);
  const [validationErrors, setValidationErrors] = useState({
    name: "",
    date: "",
    time: "",
    location: "",
  });
  const [chart, setChart] = useState<VedicBirthChart | null>(null);
  const [kpData, setKpData] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState<
    LocationSuggestion[]
  >([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [lastSearchQuery, setLastSearchQuery] = useState("");
  const [chartStyle, setChartStyle] = useState<"north" | "south">("north");
  const [showChartImage, setShowChartImage] = useState(false);
  const locationInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Validation function
  const validateForm = () => {
    const errors = {
      name: "",
      date: "",
      time: "",
      location: "",
    };

    if (!birthData.name.trim()) {
      errors.name = "Name is required";
    }

    if (!birthData.date) {
      errors.date = "Birth date is required";
    }

    if (!birthData.time) {
      errors.time = "Birth time is required";
    }

    if (!birthData.location.trim()) {
      errors.location = "Birth location is required";
    }

    setValidationErrors(errors);
    return !Object.values(errors).some((error) => error !== "");
  };

  // Jyotisha Birth Chart calculation
  const jyotishaCalculation = useMutation({
    mutationFn: async (data: any) => {
      // Format time for Jyotisha (expects HH:MM format only, no seconds)
      let formattedTime = data.time;
      if (data.time.includes(":")) {
        const timeParts = data.time.split(":");
        if (timeParts.length >= 2) {
          formattedTime = `${timeParts[0]}:${timeParts[1]}`;
        }
      }

      // Ensure we have valid coordinates
      if (
        !data.latitude ||
        !data.longitude ||
        data.latitude === 0 ||
        data.longitude === 0
      ) {
        throw new Error("Valid coordinates are required for chart calculation");
      }

      // Convert date format for Jyotisha engine (expects DD/MM/YYYY)
      let jyotishaDate = data.date;
      if (data.date.includes("-")) {
        const parts = data.date.split("-");
        if (parts.length === 3) {
          if (parts[0].length === 4) {
            // YYYY-MM-DD format, convert to DD/MM/YYYY
            jyotishaDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
          } else if (parts[2].length === 4) {
            // DD-MM-YYYY format, convert to DD/MM/YYYY  
            jyotishaDate = `${parts[0]}/${parts[1]}/${parts[2]}`;
          } else {
            // Keep as is if format is unclear
            jyotishaDate = data.date.replace(/-/g, "/");
          }
        }
      }

      const response = await apiRequest("POST", "/api/generate-kundli", {
        name: data.name || "User",
        date: jyotishaDate,
        time: formattedTime,
        location: data.location,
        latitude: parseFloat(data.latitude.toString()),
        longitude: parseFloat(data.longitude.toString()),
        timezone: "Asia/Kolkata",
        gender: data.gender || "male",
      });
      return response;
    },
    onSuccess: (result) => {
      console.log("Chart generation successful:", result);

      // Convert Jyotisha result to VedicBirthChart format
      const convertedChart: VedicBirthChart = {
        ascendant: result.ascendant || { longitude: 0, sign: "Aries" },
        planets: result.planets || [],
        houses: Array.from({ length: 12 }, (_, i) => ({
          number: i + 1,
          sign: "",
          planets: (result.planets || [])
            .filter((p: any) => p.house === i + 1)
            .map((p: any) => p.name),
          significance: "",
        })),
        yogas: result.analysis?.yogas || [],
        dasha: result.dasha || {
          current: { lord: "Unknown", status: "unknown" },
          sequence: [],
        },
        ayanamsa: result.ayanamsa || 0,
        coordinates: result.coordinates || { latitude: 0, longitude: 0 },
        calculation_engine: "Jyotisha-Official",
        doshas: result.analysis?.doshas || [],
        remedies: result.analysis?.remedies || [],
        strengths: result.analysis?.strengths || [],
      };

      setChart(convertedChart);
      setKpData(result);
      setIsGenerating(false);

      onChartGenerated?.(convertedChart);

      // Auto-scroll to results section after chart is generated
      setTimeout(() => {
        if (resultsRef.current) {
          resultsRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 100);
    },
    onError: (error) => {
      console.error("Chart generation failed:", error);
      setIsGenerating(false);
    },
  });

  // Enhanced location search using server-side geocoding
  const searchLocations = async (query: string) => {
    if (query.length < 2) {
      setShowSuggestions(false);
      setLocationSuggestions([]);
      return;
    }

    // Prevent duplicate searches for the same query or if already searching
    if (query === lastSearchQuery || isSearchingLocation) {
      return;
    }

    // Only show suggestions if we have meaningful search query
    if (query.trim().length < 2) {
      return;
    }

    setLastSearchQuery(query);
    setIsSearchingLocation(true);
    // Clear existing suggestions while searching to prevent showing old results
    setShowSuggestions(false);
    try {
      // Use server-side geocoding API for more accurate results
      const response = await fetch(
        `/api/locations/search?query=${encodeURIComponent(query)}`,
      );
      const data = await response.json();

      if (data.success && data.locations) {
        const suggestions: LocationSuggestion[] = data.locations.map(
          (location: any) => ({
            name: location.name,
            country: location.country,
            state: location.state || "",
            latitude: location.latitude,
            longitude: location.longitude,
            display: location.display,
          }),
        );

        setLocationSuggestions(suggestions);
        setShowSuggestions(true);
      } else {
        setLocationSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error("Location search failed:", error);
      
      setLocationSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsSearchingLocation(false);
      // Reset last search query after a short delay to allow new searches
      setTimeout(() => setLastSearchQuery(""), 1000);
    }
  };

  // Handle location input change with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (birthData.location) {
        searchLocations(birthData.location);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [birthData.location]);

  // Handle location selection
  const handleLocationSelect = (suggestion: LocationSuggestion) => {
    setBirthData({
      ...birthData,
      location: suggestion.display,
      latitude: suggestion.latitude,
      longitude: suggestion.longitude,
    });
    // Immediately hide suggestions and clear state
    setShowSuggestions(false);
    setLocationSuggestions([]);
    setIsSearchingLocation(false);
    setValidationErrors({ ...validationErrors, location: "" });
    setLastSearchQuery(suggestion.display); // Set to selected location to prevent re-search
  };

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        locationInputRef.current &&
        !locationInputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto-generate chart when initial data is provided
  useEffect(() => {
    if (
      initialData &&
      initialData.name &&
      initialData.birthDate &&
      initialData.birthTime &&
      initialData.birthPlace
    ) {
      console.log("Auto-generating chart with initial data:", initialData);

      // If coordinates are provided via URL, use them directly
      if (initialData.latitude && initialData.longitude) {
        const updatedData = {
          name: initialData.name || "",
          date: initialData.birthDate || "",
          time: initialData.birthTime || "",
          location: initialData.birthPlace || "",
          latitude: initialData.latitude,
          longitude: initialData.longitude,
          timezone: "Asia/Kolkata",
          gender: initialData.gender || "male",
        };

        console.log("Using provided coordinates:", updatedData);
        setBirthData(updatedData);
        setIsGenerating(true);
        jyotishaCalculation.mutate(updatedData);
        return;
      }

      // Otherwise, search for coordinates
      const searchAndGenerate = async () => {
        try {
          setIsGenerating(true);

          // Search for location coordinates
          const response = await fetch(
            `/api/locations/search?query=${encodeURIComponent(initialData.birthPlace)}`,
          );
          const locationData = await response.json();

          let coordinates = { latitude: 28.6139, longitude: 77.209 }; // Default Delhi coordinates

          if (
            locationData.success &&
            locationData.locations &&
            locationData.locations.length > 0
          ) {
            coordinates = {
              latitude: locationData.locations[0].latitude,
              longitude: locationData.locations[0].longitude,
            };
          }

          const updatedData = {
            name: initialData.name || "",
            date: initialData.birthDate || "",
            time: initialData.birthTime || "",
            location: initialData.birthPlace || "",
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
            timezone: "Asia/Kolkata",
            gender: initialData.gender || "male",
          };

          console.log("Updated birth data with coordinates:", updatedData);
          setBirthData(updatedData);

          // Generate chart
          console.log("Calling jyotishaCalculation.mutate with:", updatedData);
          jyotishaCalculation.mutate(updatedData);
        } catch (error) {
          console.error("Error in auto-generation:", error);
          setIsGenerating(false);
        }
      };

      searchAndGenerate();
    }
  }, [initialData]);

  const handleGenerateChart = async () => {
    console.log("Generate chart button clicked!");
    console.log("Current birth data:", birthData);

    // Always validate form and show errors
    const isValid = validateForm();

    // If form is invalid, return early to show errors
    if (!isValid) {
      console.error("Form validation failed");
      return;
    }

    // If coordinates are missing, try to get them from location
    if (
      !birthData.latitude ||
      !birthData.longitude ||
      birthData.latitude === 0 ||
      birthData.longitude === 0
    ) {
      console.log("Coordinates missing, searching for location...");
      try {
        const response = await fetch(
          `/api/locations/search?query=${encodeURIComponent(birthData.location)}`,
        );
        const locationData = await response.json();

        if (
          locationData.success &&
          locationData.locations &&
          locationData.locations.length > 0
        ) {
          const coords = locationData.locations[0];
          setBirthData((prev) => ({
            ...prev,
            latitude: coords.latitude,
            longitude: coords.longitude,
          }));

          // Use updated data for chart generation
          const updatedData = {
            ...birthData,
            latitude: coords.latitude,
            longitude: coords.longitude,
          };

          console.log("Using coordinates:", coords.latitude, coords.longitude);
          setIsGenerating(true);
          jyotishaCalculation.mutate(updatedData);
        } else {
          console.error("Location not found, using default Delhi coordinates");
          const defaultData = {
            ...birthData,
            latitude: 28.6139,
            longitude: 77.209,
          };
          setIsGenerating(true);
          jyotishaCalculation.mutate(defaultData);
        }
      } catch (error) {
        console.error("Location search failed:", error);
        // Use default coordinates
        const defaultData = {
          ...birthData,
          latitude: 28.6139,
          longitude: 77.209,
        };
        setIsGenerating(true);
        jyotishaCalculation.mutate(defaultData);
      }
    } else {
      console.log(
        "Using existing coordinates:",
        birthData.latitude,
        birthData.longitude,
      );
      setIsGenerating(true);
      jyotishaCalculation.mutate(birthData);
    }
  };

  const getElementColor = (element: string) => {
    const colors = {
      Fire: "bg-red-100 text-red-800",
      Earth: "bg-green-100 text-green-800",
      Air: "bg-blue-100 text-blue-800",
      Water: "bg-purple-100 text-purple-800",
    };
    return (
      colors[element as keyof typeof colors] || "bg-gray-100 text-gray-800"
    );
  };

  // Download chart as SVG
  const downloadChartAsSVG = () => {
    const svgElement = document.querySelector("svg");
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });
    const svgUrl = URL.createObjectURL(svgBlob);

    const downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = `birth-chart-${chartStyle}-${birthData.name || "chart"}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(svgUrl);
  };

  // Download chart as PNG
  const downloadChartAsPNG = () => {
    const svgElement = document.querySelector("svg");
    if (!svgElement) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    // Set canvas size
    canvas.width = parseInt(svgElement.getAttribute("width") || "500");
    canvas.height = parseInt(svgElement.getAttribute("height") || "500");

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      ctx!.fillStyle = "white";
      ctx!.fillRect(0, 0, canvas.width, canvas.height);
      ctx!.drawImage(img, 0, 0);

      canvas.toBlob((blob) => {
        if (blob) {
          const pngUrl = URL.createObjectURL(blob);
          const downloadLink = document.createElement("a");
          downloadLink.href = pngUrl;
          downloadLink.download = `birth-chart-${chartStyle}-${birthData.name || "chart"}.png`;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
          URL.revokeObjectURL(pngUrl);
        }
      }, "image/png");

      URL.revokeObjectURL(url);
    };

    img.src = url;
  };

  // PDF download mutation
  const pdfDownloadMutation = useMutation({
    mutationFn: async (emailAddress?: string) => {
      if (!chart) throw new Error("No chart data available");

      const response = await apiRequest("POST", "/api/generate-pdf-report", {
        chartData: chart,
        personalInfo: {
          name: birthData.name,
          dateOfBirth: birthData.date,
          timeOfBirth: birthData.time,
          placeOfBirth: birthData.location,
        },
        reportType: "kundli",
        emailAddress,
      });

      if (emailAddress) {
        return response.json();
      } else {
        return response.blob();
      }
    },
    onSuccess: (result, emailAddress) => {
      if (emailAddress) {
        // Email sent successfully
        console.log("PDF report sent via email");
      } else {
        // Download PDF
        const blob = result as Blob;
        const url = URL.createObjectURL(blob);
        const downloadLink = document.createElement("a");
        downloadLink.href = url;
        downloadLink.download = `${birthData.name || "kundli"}-report.pdf`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(url);
      }
    },
    onError: (error) => {
      console.error("PDF generation error:", error);
    },
  });

  // Email modal state
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");

  return (
    <div className="space-y-6">
      {/* Birth Data Input */}
      <Card className="bg-white/95 backdrop-blur-sm border-orange-200 shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 backdrop-blur-sm">
          <CardTitle className="flex items-center gap-2 text-white">
            <Star className="h-5 w-5 text-white" />
            Vedic Birth Chart (Kundali) Generator
          </CardTitle>
          <p className="text-white text-sm">
            Enter your birth details for authentic Vedic calculations
          </p>
        </CardHeader>
        <CardContent className="space-y-4 bg-white/90 backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-5">
            <div className="space-y-2">
              <Label
                htmlFor="birth-name"
                className="text-orange-900 font-medium"
              >
                Name
              </Label>
              <Input
                id="birth-name"
                data-testid="kundli-name"
                placeholder="Enter your name"
                value={birthData.name}
                onChange={(e) => {
                  setBirthData({ ...birthData, name: e.target.value });
                  if (validationErrors.name) {
                    setValidationErrors({ ...validationErrors, name: "" });
                  }
                }}
                className={`bg-white border-orange-200 text-gray-900 placeholder-gray-500 focus:border-orange-400 focus:ring-orange-400 ${validationErrors.name ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
              />
              {validationErrors.name && (
                <p className="text-red-600 text-sm mt-1">
                  {validationErrors.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="birth-gender"
                className="text-orange-900 font-medium"
              >
                Gender
              </Label>
              <select
                id="birth-gender"
                data-testid="kundli-gender"
                value={birthData.gender}
                onChange={(e) =>
                  setBirthData({ ...birthData, gender: e.target.value })
                }
                className="w-full p-2 border border-orange-200 rounded-md bg-white text-gray-900 focus:border-orange-400 focus:ring-orange-400"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="birth-date"
                className="flex items-center gap-2 text-orange-900 font-medium"
              >
                <Calendar className="h-4 w-4 text-orange-600" />
                Birth Date
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {/* Day */}
                <Select
                  value={birthData.date?.split("-")[0] || ""}
                  onValueChange={(day) => {
                    setBirthData({
                      ...birthData,
                      date: `${day}-${birthData.date?.split("-")[1] || "01"}-${birthData.date?.split("-")[2] || "2000"}`,
                    });
                    if (validationErrors.date) {
                      setValidationErrors({ ...validationErrors, date: "" });
                    }
                  }}
                >
                  <SelectTrigger data-testid="kundli-date-day">
                    <SelectValue placeholder="Day" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 31 }, (_, i) => (
                      <SelectItem
                        key={i + 1}
                        value={String(i + 1).padStart(2, "0")}
                      >
                        {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Month */}
                <Select
                  value={birthData.date?.split("-")[1] || ""}
                  onValueChange={(month) => {
                    setBirthData({
                      ...birthData,
                      date: `${birthData.date?.split("-")[0] || "01"}-${month}-${birthData.date?.split("-")[2] || "2000"}`,
                    });
                    if (validationErrors.date) {
                      setValidationErrors({ ...validationErrors, date: "" });
                    }
                  }}
                >
                  <SelectTrigger data-testid="kundli-date-month">
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => (
                      <SelectItem
                        key={i + 1}
                        value={String(i + 1).padStart(2, "0")}
                      >
                        {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Year */}
                <Select
                  value={birthData.date?.split("-")[2] || ""}
                  onValueChange={(year) => {
                    setBirthData({
                      ...birthData,
                      date: `${birthData.date?.split("-")[0] || "01"}-${birthData.date?.split("-")[1] || "01"}-${year}`,
                    });
                    if (validationErrors.date) {
                      setValidationErrors({ ...validationErrors, date: "" });
                    }
                  }}
                >
                  <SelectTrigger data-testid="kundli-date-year">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 120 }, (_, i) => {
                      const year = new Date().getFullYear() - i;
                      return (
                        <SelectItem key={year} value={String(year)}>
                          {year}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              {validationErrors.date && (
                <p className="text-red-600 text-sm mt-1">
                  {validationErrors.date}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="birth-time"
                className="flex items-center gap-2 text-orange-900 font-medium"
              >
                <Clock className="h-4 w-4 text-orange-600" />
                Birth Time
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {/* Hour */}
                <Select
                  value={birthData.time?.split(":")[0] || ""}
                  onValueChange={(hour) => {
                    setBirthData({
                      ...birthData,
                      time: `${hour}:${birthData.time?.split(":")[1] || "00"}`,
                    });
                    if (validationErrors.time) {
                      setValidationErrors({ ...validationErrors, time: "" });
                    }
                  }}
                >
                  <SelectTrigger data-testid="kundli-time-hour">
                    <SelectValue placeholder="Hour" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => (
                      <SelectItem key={i} value={String(i).padStart(2, "0")}>
                        {i}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Minute */}
                <Select
                  value={birthData.time?.split(":")[1] || ""}
                  onValueChange={(minute) => {
                    setBirthData({
                      ...birthData,
                      time: `${birthData.time?.split(":")[0] || "00"}:${minute}`,
                    });
                    if (validationErrors.time) {
                      setValidationErrors({ ...validationErrors, time: "" });
                    }
                  }}
                >
                  <SelectTrigger data-testid="kundli-time-minute">
                    <SelectValue placeholder="Minute" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 60 }, (_, i) => (
                      <SelectItem key={i} value={String(i).padStart(2, "0")}>
                        {String(i).padStart(2, "0")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {validationErrors.time && (
                <p className="text-red-600 text-sm mt-1">
                  {validationErrors.time}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2 relative">
            <Label
              htmlFor="birth-location"
              className="flex items-center gap-2 text-orange-900 font-medium"
            >
              <MapPin className="h-4 w-4 text-orange-600" />
              Birth Location
            </Label>
            <div className="relative">
              <Input
                ref={locationInputRef}
                id="birth-location"
                data-testid="kundli-location"
                placeholder="Start typing city name..."
                value={birthData.location}
                onChange={(e) => {
                  setBirthData({ ...birthData, location: e.target.value });
                  if (validationErrors.location) {
                    setValidationErrors({ ...validationErrors, location: "" });
                  }
                }}
                onFocus={() => {
                  // Completely disable focus-triggered suggestions to prevent duplicates
                  // Suggestions will only show from typing/search
                }}
                className={`bg-white border-orange-200 text-gray-900 placeholder-gray-500 focus:border-orange-400 focus:ring-orange-400 ${validationErrors.location ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
              />
              {isSearchingLocation && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-400"></div>
                </div>
              )}
            </div>

            {showSuggestions && locationSuggestions.length > 0 && (
              <div
                ref={suggestionsRef}
                className="absolute top-full left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border border-orange-200 rounded-lg shadow-2xl max-h-60 overflow-y-auto"
              >
                {locationSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="p-3 hover:bg-orange-100 cursor-pointer border-b border-orange-100 last:border-b-0 transition-colors"
                    onClick={() => handleLocationSelect(suggestion)}
                  >
                    <div className="font-medium text-gray-900">
                      {suggestion.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {suggestion.state && `${suggestion.state}, `}
                      {suggestion.country}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {validationErrors.location && (
              <p className="text-red-600 text-sm mt-1">
                {validationErrors.location}
              </p>
            )}
          </div>

          <Button
            onClick={handleGenerateChart}
            disabled={isGenerating}
            data-testid="kundli-submit"
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-100 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Generating Chart...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Star className="h-5 w-5" />
                Generate Birth Chart
              </div>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Birth Chart Results */}
      {chart && (
        <div ref={resultsRef} className="space-y-6">
          {/* Success Message with Premium Teaser */}
          <Card className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-start md:items-center gap-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <Star className="h-5 w-5 md:h-6 md:w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base md:text-xl font-bold text-green-800">
                      Chart Generated Successfully!
                    </h3>
                    <p className="text-sm md:text-lg text-green-700">
                      Your authentic Vedic birth chart is ready with basic
                      insights
                    </p>
                  </div>
                </div>

                <Button
                  onClick={() => {
                    if (chart) {
                      localStorage.setItem(
                        "premiumReportData",
                        JSON.stringify({
                          birthData,
                          chart,
                          timestamp: Date.now(),
                        }),
                      );
                      setLocation("/premium-report");
                    } else {
                      alert("Please generate a birth chart first");
                    }
                  }}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 w-full md:w-auto mt-3 md:mt-0"
                >
                  Get Premium Report
                </Button>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid grid-cols-3 md:grid-cols-5 gap-2 h-20 md:h-auto w-full bg-orange-100 backdrop-blur-sm border-orange-200">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-orange-800 hover:text-orange-900"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="planets"
                className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-orange-800 hover:text-orange-900"
              >
                Grahas
              </TabsTrigger>
              <TabsTrigger
                value="houses"
                className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-orange-800 hover:text-orange-900"
              >
                Bhavas
              </TabsTrigger>
              <TabsTrigger
                value="navamsa"
                className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-orange-800 hover:text-orange-900"
              >
                Navamsa
              </TabsTrigger>
              <TabsTrigger
                value="dasha"
                className="data-[state=active]:bg-orange-500 data-[state=active]:text-white text-orange-800 hover:text-orange-900"
              >
                Dasha
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card className="bg-white/95 backdrop-blur-sm border-orange-200">
                <CardHeader className="bg-gradient-to-r from-orange-100 to-amber-100">
                  <CardTitle className="text-orange-900 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-orange-600" />
                    Chart Overview
                  </CardTitle>
                  <p className="text-orange-800 text-sm">
                    Basic birth chart analysis - upgrade for detailed insights
                  </p>
                </CardHeader>
                <CardContent className="space-y-6 bg-gradient-to-br from-orange-50 to-amber-50 backdrop-blur-md">
                  {/* Basic Details - Enhanced for readability */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg text-orange-900">
                      Basic Details
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-orange-300 text-sm bg-white/90 backdrop-blur-sm rounded-lg">
                        <thead>
                          <tr className="bg-gradient-to-r from-orange-200 to-amber-200">
                            <th className="border border-orange-300 px-4 py-3 text-left font-semibold text-orange-900">
                              Name
                            </th>
                            <th className="border border-orange-300 px-4 py-3 text-center font-semibold text-orange-900">
                              {birthData.name || "User"}
                            </th>
                            <th className="border border-orange-300 px-4 py-3 text-center font-semibold text-orange-900">
                              Nakshatra
                            </th>
                            <th className="border border-orange-300 px-4 py-3 text-center font-semibold text-orange-900">
                              {chart.planets.find((p) => p.name === "Moon")
                                ?.nakshatra || "N/A"}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="hover:bg-orange-100 transition-colors">
                            <td className="border border-orange-300 px-4 py-3 font-medium bg-orange-100 text-orange-900">
                              Birth Date & Time
                            </td>
                            <td className="border border-orange-300 px-4 py-3 text-gray-800">
                              {birthData.date} | {birthData.time}
                            </td>
                            <td className="border border-orange-300 px-4 py-3 font-medium bg-orange-100 text-orange-900">
                              Ascendant
                            </td>
                            <td className="border border-orange-300 px-4 py-3 text-gray-800">
                              {chart.ascendant?.sign || "N/A"}
                            </td>
                          </tr>
                          <tr className="hover:bg-orange-100 transition-colors">
                            <td className="border border-orange-300 px-4 py-3 font-medium bg-orange-100 text-orange-900">
                              Birth Place
                            </td>
                            <td className="border border-orange-300 px-4 py-3 text-gray-800">
                              {birthData.location}
                            </td>
                            <td className="border border-orange-300 px-4 py-3 font-medium bg-orange-100 text-orange-900">
                              Sign
                            </td>
                            <td className="border border-orange-300 px-4 py-3 text-gray-800">
                              {chart.planets.find((p) => p.name === "Moon")
                                ?.sign || "N/A"}
                            </td>
                          </tr>
                          <tr className="hover:bg-orange-100 transition-colors">
                            <td className="border border-orange-300 px-4 py-3 font-medium bg-orange-100 text-orange-900">
                              Gender
                            </td>
                            <td className="border border-orange-300 px-4 py-3 text-gray-800">
                              {birthData.gender
                                ? birthData.gender.charAt(0).toUpperCase() +
                                  birthData.gender.slice(1)
                                : "Not specified"}
                            </td>
                            <td className="border border-orange-300 px-4 py-3"></td>
                            <td className="border border-orange-300 px-4 py-3"></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Kundli Details - authentic Vedic calculations */}
                  <VedicDetailsDisplay
                    birthData={{
                      date: birthData.date,
                      time: birthData.time,
                      latitude: birthData.latitude,
                      longitude: birthData.longitude,
                      moonSign: chart.planets.find((p) => p.name === "Moon")
                        ?.sign,
                      nakshatra: chart.planets.find((p) => p.name === "Moon")
                        ?.nakshatra,
                    }}
                  />

                  {/* Chart Image Section - World Class Layout */}
                  <div className="space-y-6">
                    <div className="text-center space-y-3">
                      <h3 className=" text-md md:text-2xl font-bold text-orange-900 mb-1">
                        🔮 Your Birth Chart 🔮
                      </h3>
                      <p className="text-orange-800 text-sm">
                        Authentic Vedic Astrology Chart with Planetary Positions
                      </p>

                      {/* Chart Style Selection - Moved closer */}
                      <div className="mt-3">
                        <Label className="text-lg font-semibold text-orange-900 block mb-3">
                          Choose Chart Style
                        </Label>
                      </div>
                    </div>

                    {/* Chart Style Selection - Enhanced with Better States */}
                    <div className="space-y-2">
                      <div className="md:flex flex flex-col gap-6 justify-center ">
                        {[
                          {
                            value: "north",
                            label: "🏛️ North Indian",
                            desc: "Diamond format",
                          },
                          {
                            value: "south",
                            label: "🏺 South Indian",
                            desc: "Square format",
                          },
                        ].map((style) => (
                          <Button
                            key={style.value}
                            onClick={() =>
                              setChartStyle(style.value as "north" | "south")
                            }
                            className={`px-8 py-6 rounded-xl text-base font-bold transition-all duration-300 min-w-[180px] transform hover:scale-110 ${
                              chartStyle === style.value
                                ? "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white shadow-2xl scale-110 ring-4 ring-orange-400/50 border-2 border-orange-300"
                                : "bg-gradient-to-r from-white to-orange-50 hover:from-orange-100 hover:to-amber-100 text-orange-800 border-2 border-orange-200 hover:border-orange-400 backdrop-blur-sm hover:text-orange-900 shadow-lg"
                            }`}
                          >
                            <div className="flex flex-col items-center gap-2">
                              <span className="text-lg">{style.label}</span>
                              <span className="text-xs opacity-90 font-medium">
                                {style.desc}
                              </span>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Chart Image - World Class Centered Container */}
                    <div className="bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl p-8 border-2 border-orange-300 backdrop-blur-md shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105">
                      <div className="bg-white/90 rounded-xl p-8 border border-orange-200 shadow-inner hover:bg-white/95 transition-colors duration-300">
                        <div className="flex justify-center items-center min-h-[400px]">
                          <div className="max-w-full max-h-full flex justify-center items-center">
                            <ChartImageGenerator
                              chart={chart}
                              birthData={{
                                name: birthData.name,
                                date: birthData.date,
                                time: birthData.time,
                                location: birthData.location,
                              }}
                              style={chartStyle}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mt-6 text-center">
                        <div className="bg-gradient-to-r from-orange-200 to-amber-200 rounded-lg p-4 border-2 border-orange-300 backdrop-blur-sm">
                          <p className="text-orange-900 text-sm md:text-lg font-bold drop-shadow-lg">
                            ✨{" "}
                            {chartStyle === "north"
                              ? "North Indian"
                              : "South Indian"}{" "}
                            Style Chart ✨
                          </p>
                          <p className="text-orange-800 text-sm md:text-md text-base mt-2 font-semibold">
                            Switch styles to compare different traditional
                            layouts
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-gradient-to-r from-orange-100 to-amber-100 border-2 border-orange-300 rounded-xl p-4 md:p-6 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
                          <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center shadow-lg">
                            <Download className="h-6 w-6 md:h-7 md:w-7 text-white" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg md:text-xl text-orange-900">
                              📄 Free Basic Report
                            </h3>
                            <p className="text-sm text-orange-800">
                              Essential birth chart with planetary positions
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Button
                            onClick={() => pdfDownloadMutation.mutate()}
                            disabled={pdfDownloadMutation.isPending}
                            className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white font-bold py-3 md:py-4 px-4 md:px-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Download className="h-5 w-5 md:h-6 md:w-6" />
                            {pdfDownloadMutation.isPending
                              ? "Generating..."
                              : "Download PDF"}
                          </Button>

                          <Button
                            onClick={() => setShowEmailModal(true)}
                            disabled={pdfDownloadMutation.isPending}
                            className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold py-3 md:py-4 px-4 md:px-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Mail className="h-5 w-5 md:h-6 md:w-6" />
                            Email Report
                          </Button>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-orange-100 to-amber-100 border-2 border-orange-300 rounded-xl p-4 md:p-6 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
                          <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center shadow-lg">
                            <Crown className="h-6 w-6 md:h-7 md:w-7 text-white" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg md:text-xl text-orange-900">
                              👑 Premium Detailed Report
                            </h3>
                            <p className="text-sm text-orange-800">
                              82-section analysis with predictions & remedies
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="text-xs text-orange-800 space-y-1">
                            <div>✓ Career & Finance Analysis</div>
                            <div>✓ Marriage Compatibility</div>
                            <div>✓ Health & Wellness</div>
                          </div>
                          <div className="text-xs text-orange-800 space-y-1">
                            <div>✓ Dasha Period Predictions</div>
                            <div>✓ Personalized Remedies</div>
                            <div>✓ Gemstone Recommendations</div>
                          </div>
                        </div>

                        <Button className="w-full text-xs md:text-lg mt-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold">
                          <Crown className="h-4 w-4 mr-2" />
                          Get Premium Report - ₹999
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="planets" className="space-y-4">
              <Card className="bg-gradient-to-r from-orange-100 to-amber-100 border-orange-300 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="text-center space-y-3">
                    <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-orange-900">
                      Advanced Planetary Analysis
                    </h3>
                    <p className="text-orange-800 text-sm">
                      Detailed planetary strengths, weaknesses, and career
                      impacts in Premium Report
                    </p>
                    <Button
                      onClick={() => setLocation("/premium-report")}
                      className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-6 py-2 rounded-lg shadow-lg transition-all duration-300"
                    >
                      Unlock Detailed Analysis
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/95 backdrop-blur-sm border-orange-200">
                <CardHeader className="bg-gradient-to-r from-orange-100 to-amber-100">
                  <CardTitle className="text-orange-900 flex items-center gap-2">
                    <Globe className="h-5 w-5 text-orange-600" />
                    Graha Positions (Planetary Positions)
                  </CardTitle>
                  <p className="text-orange-800 text-sm">
                    Basic planetary positions - upgrade for detailed analysis
                  </p>
                </CardHeader>
                <CardContent className="bg-gradient-to-br from-orange-50 to-amber-50">
                  <div className="space-y-3">
                    {chart.planets.map((planet) => {
                      const planetInfo = PLANETS.find(
                        (p) => p.name === planet.name,
                      );
                      return (
                        <div
                          key={planet.name}
                          className="flex items-center justify-between p-4 bg-white border border-orange-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">
                              {planetInfo?.symbol || "🪐"}
                            </span>
                            <div>
                              <div className="font-semibold text-gray-900">
                                {planet.name}
                              </div>
                              <div className="text-sm text-gray-700">
                                {planet.sign} {planet.degree || "N/A"} • Bhava{" "}
                                {planet.house}
                                {planet.retrograde && " (Vakri)"}
                              </div>
                              <div className="text-xs text-orange-600">
                                {planet.nakshatra} Nakshatra -{" "}
                                {planet.nakshatraLord} Lord
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge
                              variant="secondary"
                              className="bg-orange-100 text-orange-800 border-orange-200"
                            >
                              Vedic Sign
                            </Badge>
                            {planet.retrograde && (
                              <Badge
                                variant="outline"
                                className="ml-2 border-orange-300 text-orange-800"
                              >
                                Vakri (Retrograde)
                              </Badge>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="houses" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-orange-900">
                    Bhava System (Houses)
                  </CardTitle>
                  <p className="text-sm text-orange-700">
                    Twelve life areas represented by houses based on authentic
                    Vedic calculations
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(
                      (houseNumber) => {
                        const houseName = getHouseName(houseNumber);
                        const houseDescription =
                          getBhavaDescription(houseNumber);
                        const planetsInHouse =
                          chart.planets?.filter(
                            (planet: any) => planet.house === houseNumber,
                          ) || [];

                        return (
                          <div
                            key={houseNumber}
                            className="p-4 border-2 border-orange-200 rounded-lg bg-gradient-to-br from-orange-50 to-amber-50"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <span className="font-bold text-xl text-orange-900">
                                  {houseNumber}. {houseName}
                                </span>
                              </div>
                              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-lg">
                                  {houseNumber}
                                </span>
                              </div>
                            </div>

                            <div className="text-sm text-orange-800 mb-4 bg-white/80 p-3 rounded-lg border border-orange-200">
                              <div className="font-semibold text-orange-900 mb-1">
                                Significance:
                              </div>
                              <div>{houseDescription}</div>
                            </div>

                            <div className="space-y-2">
                              <div className="text-sm font-semibold text-orange-900">
                                Planets in this Bhava:
                              </div>
                              {planetsInHouse.length > 0 ? (
                                <div className="space-y-2">
                                  {planetsInHouse.map(
                                    (planetData: any, idx: number) => {
                                      return (
                                        <div
                                          key={idx}
                                          className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-200 shadow-sm"
                                        >
                                          <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                                              <span className="text-white font-bold text-xs">
                                                {planetData.name.substring(
                                                  0,
                                                  2,
                                                )}
                                              </span>
                                            </div>
                                            <div>
                                              <span className="font-semibold text-orange-900">
                                                {planetData.name}
                                              </span>
                                              {planetData.retrograde && (
                                                <Badge
                                                  variant="destructive"
                                                  className="ml-2 text-xs"
                                                >
                                                  Retrograde
                                                </Badge>
                                              )}
                                            </div>
                                          </div>
                                          <div className="text-right text-sm">
                                            <div className="font-medium text-orange-800">
                                              {planetData.sign}
                                            </div>
                                            <div className="text-xs text-orange-600">
                                              {planetData.degree}
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    },
                                  )}
                                </div>
                              ) : (
                                <div className="p-3 bg-white/60 rounded-lg border border-orange-200 text-center">
                                  <div className="text-sm text-orange-700 italic">
                                    Empty house - natural flow of energies
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      },
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="dasha" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Vimshottari Dasha System</CardTitle>
                  <p className="text-sm text-gray-600">
                    Planetary periods based on Moon's nakshatra:{" "}
                    {chart.dasha?.moonNakshatra?.name}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Current Dasha */}
                    {chart.dasha?.current && (
                      <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border">
                        <h4 className="font-semibold text-lg mb-2 text-purple-800">
                          Current Mahadasha
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-2xl font-bold text-purple-700">
                              {chart.dasha.current.lord}
                            </div>
                            <div className="text-sm text-gray-600">
                              Planet Lord
                            </div>
                          </div>
                          <div>
                            <div className="text-lg font-semibold">
                              {chart.dasha.current.duration_years} years
                            </div>
                            <div className="text-sm text-gray-600">
                              Total Duration
                            </div>
                          </div>
                          <div>
                            <div className="text-sm">
                              {new Date(
                                chart.dasha.current.start_date,
                              ).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-gray-500">
                              Start Date
                            </div>
                          </div>
                          <div>
                            <div className="text-sm">
                              {new Date(
                                chart.dasha.current.end_date,
                              ).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-gray-500">
                              End Date
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Current Antardasha */}
                    {chart.dasha?.sub_periods?.current_antardasha && (
                      <div className="p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg border">
                        <h4 className="font-semibold text-lg mb-2 text-green-800">
                          Current Antardasha
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-xl font-bold text-green-700">
                              {chart.dasha.sub_periods.current_antardasha.lord}
                            </div>
                            <div className="text-sm text-gray-600">
                              Sub-period Lord
                            </div>
                          </div>
                          <div>
                            <div className="text-lg font-semibold">
                              {
                                chart.dasha.sub_periods.current_antardasha
                                  .duration_years
                              }{" "}
                              years
                            </div>
                            <div className="text-sm text-gray-600">
                              Duration
                            </div>
                          </div>
                          <div>
                            <div className="text-sm">
                              {new Date(
                                chart.dasha.sub_periods.current_antardasha.start_date,
                              ).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-gray-500">
                              Start Date
                            </div>
                          </div>
                          <div>
                            <div className="text-sm">
                              {new Date(
                                chart.dasha.sub_periods.current_antardasha.end_date,
                              ).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-gray-500">
                              End Date
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Antardasha Sequence */}
                    {chart.dasha?.sub_periods?.antardashas && (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-lg">
                          Antardasha Sequence in Current Mahadasha
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {chart.dasha.sub_periods.antardashas.map(
                            (antardasha: any, index: number) => (
                              <div
                                key={index}
                                className={`p-3 rounded-lg border ${
                                  antardasha.status === "current"
                                    ? "bg-green-50 border-green-200"
                                    : antardasha.status === "completed"
                                      ? "bg-gray-50 border-gray-200"
                                      : "bg-blue-50 border-blue-200"
                                }`}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-medium">
                                    {antardasha.lord}
                                  </span>
                                  <Badge
                                    variant={
                                      antardasha.status === "current"
                                        ? "default"
                                        : antardasha.status === "completed"
                                          ? "secondary"
                                          : "outline"
                                    }
                                  >
                                    {antardasha.status}
                                  </Badge>
                                </div>
                                <div className="text-xs text-gray-600">
                                  <div>{antardasha.duration_years} years</div>
                                  <div>
                                    {new Date(
                                      antardasha.start_date,
                                    ).toLocaleDateString()}{" "}
                                    -{" "}
                                    {new Date(
                                      antardasha.end_date,
                                    ).toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    )}

                    {/* Pratyantardasha */}
                    {chart.dasha?.sub_periods?.pratyantardashas &&
                      chart.dasha.sub_periods.pratyantardashas.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="font-semibold text-lg">
                            Pratyantardasha in Current Antardasha
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {chart.dasha.sub_periods.pratyantardashas.map(
                              (pratyantardasha: any, index: number) => (
                                <div
                                  key={index}
                                  className={`p-2 rounded border text-sm ${
                                    pratyantardasha.status === "current"
                                      ? "bg-orange-50 border-orange-200"
                                      : pratyantardasha.status === "completed"
                                        ? "bg-gray-50 border-gray-200"
                                        : "bg-blue-50 border-blue-200"
                                  }`}
                                >
                                  <div className="font-medium">
                                    {pratyantardasha.lord}
                                  </div>
                                  <div className="text-xs text-gray-600">
                                    {pratyantardasha.duration_days} days
                                  </div>
                                  <Badge variant="outline" className="text-xs">
                                    {pratyantardasha.status}
                                  </Badge>
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      )}

                    {/* Dasha Sequence */}
                    <div>
                      <h4 className="font-semibold mb-3">
                        Complete Dasha Sequence
                      </h4>
                      <div className="space-y-2">
                        {chart.dasha?.sequence?.map(
                          (period: any, index: number) => (
                            <div
                              key={index}
                              className={`p-3 rounded-lg border ${
                                period.status === "current"
                                  ? "bg-purple-50 border-purple-200"
                                  : period.status === "completed"
                                    ? "bg-gray-50 border-gray-200"
                                    : "bg-blue-50 border-blue-200"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <span className="font-semibold">
                                    {period.lord}
                                  </span>
                                  <Badge
                                    variant={
                                      period.status === "current"
                                        ? "default"
                                        : "secondary"
                                    }
                                    className="text-xs"
                                  >
                                    {period.status}
                                  </Badge>
                                </div>
                                <div className="text-right text-sm">
                                  <div>{period.duration_years} years</div>
                                  <div className="text-xs text-gray-500">
                                    {new Date(period.start_date).getFullYear()}{" "}
                                    - {new Date(period.end_date).getFullYear()}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ),
                        ) || []}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="navamsa" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-orange-900">
                    Navamsa Chart (D-9)
                  </CardTitle>
                  <p className="text-sm text-orange-700">
                    Marriage, dharma, and spiritual fortune analysis
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="text-sm text-purple-600 bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <strong>About Navamsa:</strong> The Navamsa chart divides
                      each zodiac sign into 9 parts (3°20' each). It reveals the
                      strength of planets, marriage prospects, spouse
                      characteristics, dharmic path, and spiritual evolution.
                    </div>

                    {/* Navamsa Chart Display */}
                    <div className="flex justify-center">
                      <ChartImageGenerator
                        chart={chart}
                        style="north"
                        chartType="navamsa"
                        birthData={{
                          name: birthData.name,
                          date: birthData.date,
                          time: birthData.time,
                          location: birthData.location,
                          latitude: birthData.latitude,
                          longitude: birthData.longitude,
                        }}
                      />
                    </div>

                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-lg border border-orange-200">
                      <h4 className="font-semibold text-orange-900 mb-3">
                        Why Navamsa is Important:
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-orange-800">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                            <span>
                              <strong>Marriage Analysis:</strong> Reveals spouse
                              nature and compatibility
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                            <span>
                              <strong>Planetary Strength:</strong> Shows true
                              power of planets
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                            <span>
                              <strong>Spiritual Path:</strong> Indicates dharmic
                              direction in life
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                            <span>
                              <strong>Fortune Analysis:</strong> Reveals hidden
                              luck patterns
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                            <span>
                              <strong>Life Purpose:</strong> Shows soul's
                              evolutionary journey
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                            <span>
                              <strong>Timing Events:</strong> Predicts marriage
                              and major life events
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-100 to-amber-100 border-2 border-orange-300 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <div className="space-y-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                      <Crown className="h-10 w-10 text-white" />
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold text-orange-900">
                        🔮 Unlock Your Marriage & Spiritual Destiny!
                      </h3>
                      <p className="text-lg text-orange-800 font-semibold">
                        Discover Your Navamsa Chart (D-9) Secrets
                      </p>
                    </div>

                    <div className="bg-white/80 rounded-xl p-6 border border-orange-200 shadow-inner">
                      <div className="space-y-4">
                        <p className="text-orange-900 font-medium text-lg">
                          💫{" "}
                          <strong>This is Part of Our Premium Report!</strong>{" "}
                          💫
                        </p>

                        <div className="text-left space-y-2 text-orange-800">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                            <span>
                              <strong>Marriage Compatibility</strong> - Find
                              your perfect life partner
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                            <span>
                              <strong>Spouse Characteristics</strong> - Detailed
                              partner analysis
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                            <span>
                              <strong>Spiritual Fortune</strong> - Your dharmic
                              path revealed
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                            <span>
                              <strong>Marriage Timing</strong> - When will you
                              get married?
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                            <span>
                              <strong>Relationship Harmony</strong> - Keys to
                              lasting love
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <p className="text-orange-700 font-medium">
                        ⚡ <strong>Limited Time Offer:</strong> Get 82+ detailed
                        sections for just ₹999!
                      </p>

                      <Button className="w-full py-4 text-lg bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                        <Crown className="h-5 w-5 mr-2" />
                        🚀 UNLOCK PREMIUM REPORT NOW - ₹999
                      </Button>

                      <p className="text-sm text-orange-600">
                        💎 Join 50,000+ satisfied customers who discovered their
                        destiny!
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* Email Modal */}
      <Dialog open={showEmailModal} onOpenChange={setShowEmailModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Email Kundli Report</DialogTitle>
            <DialogDescription>
              Enter your email address to receive a detailed Kundli report as
              PDF attachment.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowEmailModal(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (emailAddress.trim()) {
                    pdfDownloadMutation.mutate(emailAddress);
                    setShowEmailModal(false);
                    setEmailAddress("");
                  }
                }}
                disabled={!emailAddress.trim() || pdfDownloadMutation.isPending}
                className="flex-1"
              >
                {pdfDownloadMutation.isPending ? "Sending..." : "Send Email"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Vedic astrology helper functions
function getElementColor(element: string): string {
  const colors = {
    Fire: "text-red-600 bg-red-50",
    Earth: "text-green-600 bg-green-50",
    Air: "text-blue-600 bg-blue-50",
    Water: "text-purple-600 bg-purple-50",
  };
  return colors[element as keyof typeof colors] || "text-gray-600 bg-gray-50";
}

function getBhavaDescription(houseNumber: number): string {
  const descriptions = {
    1: "Self, personality, physical appearance, health, and overall life approach.\nRepresents your core identity, vitality, and how others perceive you.",
    2: "Wealth, family, speech, values, and material possessions.\nGoverns financial stability, family relationships, and personal resources.",
    3: "Siblings, courage, communication, short journeys, and personal efforts.\nInfluences your initiative, writing abilities, and relationship with brothers/sisters.",
    4: "Home, mother, emotional happiness, property, and education.\nRepresents domestic peace, real estate, vehicles, and maternal influences.",
    5: "Children, creativity, intelligence, romance, and spiritual practices.\nGoverns artistic talents, love affairs, progeny, and past-life merits.",
    6: "Enemies, diseases, debts, service, and daily work routines.\nInfluences health challenges, competition, legal disputes, and employment.",
    7: "Marriage, partnerships, spouse, business relationships, and public dealings.\nRepresents committed relationships, business partnerships, and life companion.",
    8: "Longevity, transformation, occult knowledge, inheritance, and sudden events.\nGoverns mysteries, research abilities, in-laws wealth, and major life changes.",
    9: "Fortune, religion, philosophy, higher learning, and long journeys.\nInfluences spiritual beliefs, guru relationships, luck, and father's influence.",
    10: "Career, reputation, authority, public image, and professional achievements.\nRepresents social status, government connections, and career success.",
    11: "Gains, income, friends, elder siblings, and fulfillment of desires.\nGoverns profits, social networks, aspirations, and financial gains from career.",
    12: "Losses, expenses, foreign lands, spirituality, and liberation (moksha).\nInfluences foreign travels, spiritual growth, hidden enemies, and final salvation.",
  };
  return (
    descriptions[houseNumber as keyof typeof descriptions] ||
    "House significance not available."
  );
}

export default BirthChartGenerator;
