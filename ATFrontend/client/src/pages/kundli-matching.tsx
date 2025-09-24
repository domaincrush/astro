import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { Button } from "src/components/ui/button";
import { Badge } from "src/components/ui/badge";
import { Progress } from "src/components/ui/progress";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "src/components/ui/form";
import { Input } from "src/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "src/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import {
  Heart,
  Star,
  ArrowLeft,
  Users,
  Calendar,
  Clock,
  MapPin,
  MessageCircle,
  Crown,
  CheckCircle,
  TrendingUp,
} from "lucide-react";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "src/hooks/use-toast";
import LocationSearch from "src/components/LocationSearch";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";
import { Helmet } from "react-helmet-async";

// Form schema for Kundli Matching
const kundliMatchingSchema = z.object({
  boyName: z.string().min(1, "Boy's name is required"),
  boyBirthDate: z.string().min(1, "Boy's birth date is required"),
  boyBirthTime: z.string().min(1, "Boy's birth time is required"),
  boyBirthPlace: z.string().min(1, "Boy's birth place is required"),
  girlName: z.string().min(1, "Girl's name is required"),
  girlBirthDate: z.string().min(1, "Girl's birth date is required"),
  girlBirthTime: z.string().min(1, "Girl's birth time is required"),
  girlBirthPlace: z.string().min(1, "Girl's birth place is required"),
});

type KundliMatchingFormData = z.infer<typeof kundliMatchingSchema>;

interface CompatibilityData {
  totalScore: number;
  maxScore: number;
  percentage: number;
  varna: { score: number; max: number; description: string };
  vashya: { score: number; max: number; description: string };
  tara: { score: number; max: number; description: string };
  yoni: { score: number; max: number; description: string };
  graha: { score: number; max: number; description: string };
  gana: { score: number; max: number; description: string };
  rashi: { score: number; max: number; description: string };
  nadi: { score: number; max: number; description: string };
  recommendation: string;
  remedies?: string[];
  calculationEngine?: string;
  mangalDosha: {
    boy: boolean;
    girl: boolean;
    cancellation: boolean;
    severity: string;
  };
  boyDetails: {
    name: string;
    moonSign: string;
    nakshatra: string;
    gana: string;
  };
  girlDetails: {
    name: string;
    moonSign: string;
    nakshatra: string;
    gana: string;
  };
}

export default function KundliMatching() {
  const [, setLocation] = useLocation();
  const [urlParams, setUrlParams] = useState<URLSearchParams | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [boyCoordinates, setBoyCoordinates] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [girlCoordinates, setGirlCoordinates] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const { toast } = useToast();

  const form = useForm<KundliMatchingFormData>({
    resolver: zodResolver(kundliMatchingSchema),
    defaultValues: {
      boyName: "",
      boyBirthDate: "",
      boyBirthTime: "",
      boyBirthPlace: "",
      girlName: "",
      girlBirthDate: "",
      girlBirthTime: "",
      girlBirthPlace: "",
    },
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    console.log("URL params from window.location.search:", params.toString());
    console.log("All parameters:", Object.fromEntries(params.entries()));

    // If URL has parameters, show results directly
    if (params.has("boyName") && params.has("girlName")) {
      setShowResults(true);
    }

    setUrlParams(params);
  }, []);

  const onSubmit = async (data: KundliMatchingFormData) => {
    // Use fallback coordinates if not selected - ensure we have valid numbers
    const boyCoords =
      boyCoordinates && boyCoordinates.latitude && boyCoordinates.longitude
        ? boyCoordinates
        : { latitude: 28.6139, longitude: 77.209 }; // Delhi as fallback

    const girlCoords =
      girlCoordinates && girlCoordinates.latitude && girlCoordinates.longitude
        ? girlCoordinates
        : { latitude: 28.6139, longitude: 77.209 }; // Delhi as fallback

    console.log("Form submitted with data:", data);
    console.log("Boy coordinates:", boyCoords);
    console.log("Girl coordinates:", girlCoords);

    // Ensure coordinates are numbers and valid
    const boyLat =
      typeof boyCoords.latitude === "number" ? boyCoords.latitude : 28.6139;
    const boyLng =
      typeof boyCoords.longitude === "number" ? boyCoords.longitude : 77.209;
    const girlLat =
      typeof girlCoords.latitude === "number" ? girlCoords.latitude : 28.6139;
    const girlLng =
      typeof girlCoords.longitude === "number" ? girlCoords.longitude : 77.209;

    // Create URL parameters for the query
    const params = new URLSearchParams({
      boyName: data.boyName,
      boyBirthDate: data.boyBirthDate,
      boyBirthTime: data.boyBirthTime,
      boyBirthPlace: data.boyBirthPlace,
      boyLatitude: boyLat.toString(),
      boyLongitude: boyLng.toString(),
      girlName: data.girlName,
      girlBirthDate: data.girlBirthDate,
      girlBirthTime: data.girlBirthTime,
      girlBirthPlace: data.girlBirthPlace,
      girlLatitude: girlLat.toString(),
      girlLongitude: girlLng.toString(),
    });

    setUrlParams(params);
    setShowResults(true);
  };

  const {
    data: compatibility,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["/api/kundli-matching", urlParams?.toString()],
    enabled:
      showResults &&
      !!urlParams &&
      !!urlParams.get("boyName") &&
      !!urlParams.get("boyBirthDate") &&
      !!urlParams.get("boyBirthTime") &&
      !!urlParams.get("girlName") &&
      !!urlParams.get("girlBirthDate") &&
      !!urlParams.get("girlBirthTime"),
    queryFn: async () => {
      if (!urlParams) return null;

      // Extract birth details from URL parameters with coordinates
      const boyDetails = {
        name: urlParams.get("boyName") || "",
        dateOfBirth: urlParams.get("boyBirthDate") || "",
        timeOfBirth: urlParams.get("boyBirthTime") || "",
        placeOfBirth: urlParams.get("boyBirthPlace") || "",
        latitude: parseFloat(urlParams.get("boyLatitude") || "13.0827"), // Use captured coordinates or default to Chennai
        longitude: parseFloat(urlParams.get("boyLongitude") || "80.2707"),
      };

      const girlDetails = {
        name: urlParams.get("girlName") || "",
        dateOfBirth: urlParams.get("girlBirthDate") || "",
        timeOfBirth: urlParams.get("girlBirthTime") || "",
        placeOfBirth: urlParams.get("girlBirthPlace") || "",
        latitude: parseFloat(urlParams.get("girlLatitude") || "13.0827"), // Use captured coordinates or default to Chennai
        longitude: parseFloat(urlParams.get("girlLongitude") || "80.2707"),
      };

      console.log("Sending API request with:", { boyDetails, girlDetails });

      const response = await fetch("/api/kundli-matching", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ boyDetails, girlDetails }),
      });

      console.log("API Response status:", response.status);
      console.log("API Response ok:", response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        throw new Error(
          `Failed to calculate compatibility: ${response.status} ${errorText}`,
        );
      }

      const result = await response.json();
      console.log("API Response data:", result);

      if (!result.success) {
        throw new Error(result.message || "API returned failure status");
      }

      if (!result.data) {
        throw new Error("No compatibility data returned from API");
      }

      return result.data as CompatibilityData;
    },
  });

  const getScoreColor = (score: number, max: number) => {
    const percentage = (score / max) * 100;
    if (percentage >= 75) return "text-green-600";
    if (percentage >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getOverallColor = (percentage: number) => {
    if (percentage >= 75) return "from-green-500 to-green-600";
    if (percentage >= 50) return "from-yellow-500 to-yellow-600";
    return "from-red-500 to-red-600";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Analyzing Compatibility
            </h3>
            <p className="text-gray-600">
              Calculating Gun Milan scores using authentic Vedic astrology...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showResults && (error || !compatibility)) {
    console.log("Error or no compatibility data:", {
      error,
      compatibility,
      urlParams: urlParams?.toString(),
    });
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Analysis Failed
            </h3>
            <p className="text-gray-600 mb-4">
              Unable to calculate compatibility. Please check the birth details
              and try again.
            </p>
            <div className="text-xs text-gray-500 mb-4">
              Debug info:{" "}
              {error?.message || "No URL parameters or compatibility data"}
            </div>
            <div className="space-y-2">
              <Button
                onClick={() => setShowResults(false)}
                className="bg-purple-600 hover:bg-purple-700 w-full"
              >
                Try Again
              </Button>
              <Link href="/">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go Back
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>
          Free Kundli Matching | Gun Milan Calculator Online - AstroTick
        </title>
        <meta
          name="description"
          content="Free Kundli Matching - Check marriage compatibility with free Kundli matching (Gun Milan). Get detailed Ashtakoot Milan analysis for boy and girl with authentic Vedic astrology calculations."
        />
        <meta
          name="keywords"
          content="kundli matching, gun milan, marriage compatibility, ashtakoot milan, kundali matching, horoscope matching, vedic marriage compatibility, guna milan calculator"
        />
        <link rel="canonical" href="https://astrotick.com/kundli-matching" />

        {/* Open Graph */}
        <meta
          property="og:title"
          content="Free Kundli Matching - Gun Milan Calculator | AstroTick"
        />
        <meta
          property="og:description"
          content="Check marriage compatibility with authentic Gun Milan analysis. Detailed Ashtakoot matching for perfect matrimonial harmony."
        />
        <meta
          property="og:url"
          content="https://astrotick.com/kundli-matching"
        />
        <meta property="og:type" content="website" />

        {/* Twitter */}
        <meta
          property="twitter:title"
          content="Free Kundli Matching - Gun Milan Calculator | AstroTick"
        />
        <meta
          property="twitter:description"
          content="Check marriage compatibility with authentic Gun Milan analysis. Detailed Ashtakoot matching for perfect matrimonial harmony."
        />

        {/* Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Kundli Matching",
            description:
              "Marriage compatibility calculator using Vedic astrology Gun Milan method",
            url: "https://astrotick.com/kundli-matching",
            applicationCategory: "Lifestyle",
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <AstroTickHeader />
        <div className="pt-4">
          <div className="container mx-auto px-4 py-1">
            {!showResults && (
              <>
                {/* Title and Features Header */}
                <div className="text-center mb-12">
                  <h1 className="text-2xl md:text-5xl font-bold text-purple-800 mb-8">
                    Cosmic Love & Marriage Compatibility
                  </h1>
                  <div className="flex flex-wrap justify-center gap-8 text-purple-700">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 mr-2 text-yellow-500" />
                      <span className="font-medium">36 Guna Analysis</span>
                    </div>
                    <div className="flex items-center">
                      <Heart className="w-5 h-5 mr-2 text-pink-500" />
                      <span className="font-medium">
                        Marriage Compatibility
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-5 h-5 mr-2 text-blue-500" />
                      <span className="font-medium">Ashtakoot Milan</span>
                    </div>
                  </div>
                </div>

                {/* Two Column Layout - Image Left, Tool Right */}
                <div className="max-w-7xl mx-auto">
                  <div className="flex flex-col lg:grid lg:grid-cols-2 gap-12 items-start">
                    {/* Mobile: Form appears first, Desktop: Image on left */}
                    <div className="lg:order-1 order-2 hidden lg:block">
                      <div className="sticky top-8">
                        <img
                          src="/images/kundli-matching-couple.jpg"
                          alt="Celestial couple under starry sky representing cosmic love and marriage compatibility"
                          className="w-full h-96 object-cover rounded-2xl shadow-2xl"
                        />
                        <div className="mt-6 text-center">
                          <p className="text-gray-600 leading-relaxed">
                            Discover your celestial connection through authentic
                            Vedic Gun Milan analysis. Find harmony in the stars
                            with our traditional compatibility system.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Mobile: Form appears after title, Desktop: Form on right */}
                    <div className="lg:order-2 order-1 w-full">
                      <Card className="bg-white shadow-xl border-0">
                        <CardHeader className="bg-gradient-to-r from-pink-500 to-rose-500 text-white text-center">
                          <CardTitle className="text-2xl font-bold flex items-center justify-center">
                            <Heart className="w-6 h-6 mr-3" />
                            Enter Birth Details
                          </CardTitle>
                          <p className="text-pink-100 mt-2">
                            Provide accurate birth information for both partners
                          </p>
                        </CardHeader>

                        <CardContent className="p-6 sm:p-8">
                          <Form {...form}>
                            <form
                              onSubmit={form.handleSubmit(onSubmit)}
                              className="space-y-8"
                            >
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                                {/* Boy's Details */}
                                <div className="space-y-6">
                                  <h3 className="text-lg sm:text-xl font-semibold text-blue-600 flex items-center">
                                    <Users className="w-5 h-5 mr-2" />
                                    Boy's Details
                                  </h3>

                                  {/* Name */}
                                  <FormField
                                    control={form.control}
                                    name="boyName"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                          <Input
                                            placeholder="Enter boy's name"
                                            {...field}
                                            data-testid="boyNameInput"
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  {/* Birth Date & Time */}
                                  <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                                    <FormField
                                      control={form.control}
                                      name="boyBirthDate"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Birth Date</FormLabel>
                                          <FormControl>
                                            <div className="grid grid-cols-3 gap-2">
                                              {/* Day */}
                                              <Select
                                                value={
                                                  field.value?.split("-")[2] ||
                                                  ""
                                                }
                                                onValueChange={(day) =>
                                                  field.onChange(
                                                    `${field.value?.split("-")[0] || "2000"}-${field.value?.split("-")[1] || "01"}-${day}`,
                                                  )
                                                }
                                              >
                                                <SelectTrigger>
                                                  <SelectValue placeholder="Day" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  {Array.from(
                                                    { length: 31 },
                                                    (_, i) => (
                                                      <SelectItem
                                                        key={i + 1}
                                                        value={String(
                                                          i + 1,
                                                        ).padStart(2, "0")}
                                                      >
                                                        {i + 1}
                                                      </SelectItem>
                                                    ),
                                                  )}
                                                </SelectContent>
                                              </Select>

                                              {/* Month */}
                                              <Select
                                                value={
                                                  field.value?.split("-")[1] ||
                                                  ""
                                                }
                                                onValueChange={(month) =>
                                                  field.onChange(
                                                    `${field.value?.split("-")[0] || "2000"}-${month}-${field.value?.split("-")[2] || "01"}`,
                                                  )
                                                }
                                              >
                                                <SelectTrigger>
                                                  <SelectValue placeholder="Month" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  {Array.from(
                                                    { length: 12 },
                                                    (_, i) => (
                                                      <SelectItem
                                                        key={i + 1}
                                                        value={String(
                                                          i + 1,
                                                        ).padStart(2, "0")}
                                                      >
                                                        {i + 1}
                                                      </SelectItem>
                                                    ),
                                                  )}
                                                </SelectContent>
                                              </Select>

                                              {/* Year */}
                                              <Select
                                                value={
                                                  field.value?.split("-")[0] ||
                                                  ""
                                                }
                                                onValueChange={(year) =>
                                                  field.onChange(
                                                    `${year}-${field.value?.split("-")[1] || "01"}-${field.value?.split("-")[2] || "01"}`,
                                                  )
                                                }
                                              >
                                                <SelectTrigger>
                                                  <SelectValue placeholder="Year" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  {Array.from(
                                                    { length: 120 },
                                                    (_, i) => {
                                                      const year =
                                                        new Date().getFullYear() -
                                                        i;
                                                      return (
                                                        <SelectItem
                                                          key={year}
                                                          value={String(year)}
                                                        >
                                                          {year}
                                                        </SelectItem>
                                                      );
                                                    },
                                                  )}
                                                </SelectContent>
                                              </Select>
                                            </div>
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <FormField
                                      control={form.control}
                                      name="boyBirthTime"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Birth Time</FormLabel>
                                          <FormControl>
                                            <div className="grid grid-cols-2 gap-2">
                                              {/* Hour */}
                                              <Select
                                                value={
                                                  field.value?.split(":")[0] ||
                                                  ""
                                                }
                                                onValueChange={(hour) =>
                                                  field.onChange(
                                                    `${hour}:${field.value?.split(":")[1] || "00"}`,
                                                  )
                                                }
                                              >
                                                <SelectTrigger>
                                                  <SelectValue placeholder="Hour" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  {Array.from(
                                                    { length: 24 },
                                                    (_, i) => (
                                                      <SelectItem
                                                        key={i}
                                                        value={String(
                                                          i,
                                                        ).padStart(2, "0")}
                                                      >
                                                        {i}
                                                      </SelectItem>
                                                    ),
                                                  )}
                                                </SelectContent>
                                              </Select>

                                              {/* Minute */}
                                              <Select
                                                value={
                                                  field.value?.split(":")[1] ||
                                                  ""
                                                }
                                                onValueChange={(minute) =>
                                                  field.onChange(
                                                    `${field.value?.split(":")[0] || "00"}:${minute}`,
                                                  )
                                                }
                                              >
                                                <SelectTrigger>
                                                  <SelectValue placeholder="Minute" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  {Array.from(
                                                    { length: 60 },
                                                    (_, i) => (
                                                      <SelectItem
                                                        key={i}
                                                        value={String(
                                                          i,
                                                        ).padStart(2, "0")}
                                                      >
                                                        {String(i).padStart(
                                                          2,
                                                          "0",
                                                        )}
                                                      </SelectItem>
                                                    ),
                                                  )}
                                                </SelectContent>
                                              </Select>
                                            </div>
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div>

                                  {/* Birth Place */}
                                  <FormField
                                    control={form.control}
                                    name="boyBirthPlace"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Birth Place</FormLabel>
                                        <FormControl>
                                          <LocationSearch
                                            value={field.value}
                                            onChange={field.onChange}
                                            onLocationSelect={(
                                              locationName,
                                              coords,
                                            ) => {
                                              if (coords) {
                                                setBoyCoordinates({
                                                  latitude:
                                                    coords.lat ||
                                                    coords.latitude,
                                                  longitude:
                                                    coords.lng ||
                                                    coords.longitude,
                                                });
                                              }
                                            }}
                                            data-testid="boyBirthPlaceInput"
                                            placeholder="Enter birth place"
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>

                                {/* Girl's Details */}
                                <div className="space-y-6">
                                  <h3 className="text-lg sm:text-xl font-semibold text-pink-600 flex items-center">
                                    <Heart className="w-5 h-5 mr-2" />
                                    Girl's Details
                                  </h3>

                                  {/* Name */}
                                  <FormField
                                    control={form.control}
                                    name="girlName"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                          <Input
                                            placeholder="Enter girl's name"
                                            data-testid="girlNameInput"
                                            {...field}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />

                                  {/* Birth Date & Time */}
                                  <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                                    <FormField
                                      control={form.control}
                                      name="girlBirthDate"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Birth Date</FormLabel>
                                          <FormControl>
                                            <div className="grid grid-cols-3 gap-2">
                                              {/* Day */}
                                              <Select
                                                value={
                                                  field.value?.split("-")[2] ||
                                                  ""
                                                }
                                                onValueChange={(day) =>
                                                  field.onChange(
                                                    `${field.value?.split("-")[0] || "2000"}-${field.value?.split("-")[1] || "01"}-${day}`,
                                                  )
                                                }
                                              >
                                                <SelectTrigger>
                                                  <SelectValue placeholder="Day" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  {Array.from(
                                                    { length: 31 },
                                                    (_, i) => (
                                                      <SelectItem
                                                        key={i + 1}
                                                        value={String(
                                                          i + 1,
                                                        ).padStart(2, "0")}
                                                      >
                                                        {i + 1}
                                                      </SelectItem>
                                                    ),
                                                  )}
                                                </SelectContent>
                                              </Select>

                                              {/* Month */}
                                              <Select
                                                value={
                                                  field.value?.split("-")[1] ||
                                                  ""
                                                }
                                                onValueChange={(month) =>
                                                  field.onChange(
                                                    `${field.value?.split("-")[0] || "2000"}-${month}-${field.value?.split("-")[2] || "01"}`,
                                                  )
                                                }
                                              >
                                                <SelectTrigger>
                                                  <SelectValue placeholder="Month" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  {Array.from(
                                                    { length: 12 },
                                                    (_, i) => (
                                                      <SelectItem
                                                        key={i + 1}
                                                        value={String(
                                                          i + 1,
                                                        ).padStart(2, "0")}
                                                      >
                                                        {i + 1}
                                                      </SelectItem>
                                                    ),
                                                  )}
                                                </SelectContent>
                                              </Select>

                                              {/* Year */}
                                              <Select
                                                value={
                                                  field.value?.split("-")[0] ||
                                                  ""
                                                }
                                                onValueChange={(year) =>
                                                  field.onChange(
                                                    `${year}-${field.value?.split("-")[1] || "01"}-${field.value?.split("-")[2] || "01"}`,
                                                  )
                                                }
                                              >
                                                <SelectTrigger>
                                                  <SelectValue placeholder="Year" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  {Array.from(
                                                    { length: 120 },
                                                    (_, i) => {
                                                      const year =
                                                        new Date().getFullYear() -
                                                        i;
                                                      return (
                                                        <SelectItem
                                                          key={year}
                                                          value={String(year)}
                                                        >
                                                          {year}
                                                        </SelectItem>
                                                      );
                                                    },
                                                  )}
                                                </SelectContent>
                                              </Select>
                                            </div>
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <FormField
                                      control={form.control}
                                      name="girlBirthTime"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Birth Time</FormLabel>
                                          <FormControl>
                                            <div className="grid grid-cols-2 gap-2">
                                              {/* Hour */}
                                              <Select
                                                value={
                                                  field.value?.split(":")[0] ||
                                                  ""
                                                }
                                                onValueChange={(hour) =>
                                                  field.onChange(
                                                    `${hour}:${field.value?.split(":")[1] || "00"}`,
                                                  )
                                                }
                                              >
                                                <SelectTrigger>
                                                  <SelectValue placeholder="Hour" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  {Array.from(
                                                    { length: 24 },
                                                    (_, i) => (
                                                      <SelectItem
                                                        key={i}
                                                        value={String(
                                                          i,
                                                        ).padStart(2, "0")}
                                                      >
                                                        {i}
                                                      </SelectItem>
                                                    ),
                                                  )}
                                                </SelectContent>
                                              </Select>

                                              {/* Minute */}
                                              <Select
                                                value={
                                                  field.value?.split(":")[1] ||
                                                  ""
                                                }
                                                onValueChange={(minute) =>
                                                  field.onChange(
                                                    `${field.value?.split(":")[0] || "00"}:${minute}`,
                                                  )
                                                }
                                              >
                                                <SelectTrigger>
                                                  <SelectValue placeholder="Minute" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                  {Array.from(
                                                    { length: 60 },
                                                    (_, i) => (
                                                      <SelectItem
                                                        key={i}
                                                        value={String(
                                                          i,
                                                        ).padStart(2, "0")}
                                                      >
                                                        {String(i).padStart(
                                                          2,
                                                          "0",
                                                        )}
                                                      </SelectItem>
                                                    ),
                                                  )}
                                                </SelectContent>
                                              </Select>
                                            </div>
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div>

                                  {/* Birth Place */}
                                  <FormField
                                    control={form.control}
                                    name="girlBirthPlace"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Birth Place</FormLabel>
                                        <FormControl>
                                          <LocationSearch
                                            value={field.value}
                                            onChange={field.onChange}
                                            onLocationSelect={(
                                              locationName,
                                              coords,
                                            ) => {
                                              if (coords) {
                                                setGirlCoordinates({
                                                  latitude:
                                                    coords.lat ||
                                                    coords.latitude,
                                                  longitude:
                                                    coords.lng ||
                                                    coords.longitude,
                                                });
                                              }
                                            }}
                                            data-testid="girlBirthPlaceInput"
                                            placeholder="Enter birth place"
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                              </div>

                              {/* Submit Button */}
                              <div className="text-center">
                                <Button
                                  type="submit"
                                  className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-8 py-3 text-lg font-semibold w-full sm:w-auto"
                                  disabled={form.formState.isSubmitting}
                                >
                                  {form.formState.isSubmitting ? (
                                    <>
                                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2" />
                                      Calculating...
                                    </>
                                  ) : (
                                    <>
                                      Check Compatibility
                                      <Heart className="w-5 h-5 ml-2" />
                                    </>
                                  )}
                                </Button>
                              </div>
                            </form>
                          </Form>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </>
            )}

            {showResults && (
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
                {/* Header */}
                <div className="text-center mb-4">
                  <h1 className="text-4xl font-bold text-purple-800 mb-1">
                    Kundli Matching Report
                  </h1>
                  <p className="text-gray-600">
                    Gun Milan Compatibility Analysis
                  </p>
                </div>

                {/* Overall Score */}
                <Card className="mb-8 bg-white/90 backdrop-blur-sm">
                  <CardContent className="p-8">
                    <div className="text-center">
                      <div
                        className={`inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-r ${getOverallColor(compatibility?.percentage || 0)} text-white mb-4`}
                      >
                        <div className="text-center">
                          <div className="text-3xl font-bold">
                            {compatibility?.totalScore || 0}
                          </div>
                          <div className="text-sm">
                            out of {compatibility?.maxScore || 36}
                          </div>
                        </div>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        {compatibility?.percentage || 0}% Compatible
                      </h2>
                      <p className="text-lg text-gray-600 mb-4">
                        {compatibility?.recommendation ||
                          "Calculating compatibility..."}
                      </p>
                      <Progress
                        value={compatibility?.percentage || 0}
                        className="w-64 mx-auto"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Couple Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Boy's Details */}
                  <Card className="bg-blue-50/90 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-blue-800 flex items-center">
                        <Users className="w-5 h-5 mr-2" />
                        {compatibility?.boyDetails?.name || "Boy"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center text-blue-700">
                          <Star className="w-4 h-4 mr-2" />
                          <span className="font-medium">Moon Sign:</span>
                          <span className="ml-2">
                            {compatibility?.boyDetails?.moonSign || "-"}
                          </span>
                        </div>
                        <div className="flex items-center text-blue-700">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span className="font-medium">Nakshatra:</span>
                          <span className="ml-2">
                            {compatibility?.boyDetails?.nakshatra || "-"}
                          </span>
                        </div>
                        <div className="flex items-center text-blue-700">
                          <Clock className="w-4 h-4 mr-2" />
                          <span className="font-medium">Gana:</span>
                          <span className="ml-2">
                            {compatibility?.boyDetails?.gana || "-"}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Girl's Details */}
                  <Card className="bg-pink-50/90 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-pink-800 flex items-center">
                        <Users className="w-5 h-5 mr-2" />
                        {compatibility?.girlDetails?.name || "Girl"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center text-pink-700">
                          <Star className="w-4 h-4 mr-2" />
                          <span className="font-medium">Moon Sign:</span>
                          <span className="ml-2">
                            {compatibility?.girlDetails?.moonSign || "-"}
                          </span>
                        </div>
                        <div className="flex items-center text-pink-700">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span className="font-medium">Nakshatra:</span>
                          <span className="ml-2">
                            {compatibility?.girlDetails?.nakshatra || "-"}
                          </span>
                        </div>
                        <div className="flex items-center text-pink-700">
                          <Clock className="w-4 h-4 mr-2" />
                          <span className="font-medium">Gana:</span>
                          <span className="ml-2">
                            {compatibility?.girlDetails?.gana || "-"}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Mangal Dosha Analysis */}
                <Card className="mb-8 bg-white/90 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-orange-800">
                      Mangal Dosha Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <Badge
                          variant={
                            compatibility?.mangalDosha?.boy
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          Boy:{" "}
                          {compatibility?.mangalDosha?.boy
                            ? "Manglik"
                            : "Non-Manglik"}
                        </Badge>
                      </div>
                      <div className="text-center">
                        <Badge
                          variant={
                            compatibility?.mangalDosha?.girl
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          Girl:{" "}
                          {compatibility?.mangalDosha?.girl
                            ? "Manglik"
                            : "Non-Manglik"}
                        </Badge>
                      </div>
                      <div className="text-center">
                        <Badge
                          variant={
                            compatibility?.mangalDosha?.cancellation
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {compatibility?.mangalDosha?.cancellation
                            ? "Dosha Cancelled"
                            : compatibility?.mangalDosha?.severity}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Remedies Section */}
                {compatibility?.remedies &&
                  compatibility.remedies.length > 0 && (
                    <Card className="mb-8 bg-gradient-to-r from-orange-50 to-red-50/90 backdrop-blur-sm border-orange-200">
                      <CardHeader>
                        <CardTitle className="text-orange-800 flex items-center">
                          <Star className="w-5 h-5 mr-2" />
                          Recommended Remedies
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {compatibility.remedies.map((remedy, index) => (
                            <div
                              key={index}
                              className="flex items-start space-x-3 p-3 bg-white/60 rounded-lg"
                            >
                              <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center mt-0.5">
                                <span className="text-orange-600 text-sm font-semibold">
                                  {index + 1}
                                </span>
                              </div>
                              <p className="text-gray-700 text-sm">{remedy}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                {/* Detailed Gun Milan Scores */}
                <Card className="bg-white/90 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-purple-800 flex items-center">
                      <Heart className="w-5 h-5 mr-2" />
                      Detailed Gun Milan Analysis
                      {compatibility?.calculationEngine && (
                        <Badge variant="outline" className="ml-2 text-xs">
                          {compatibility.calculationEngine}
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Varna */}
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-semibold text-gray-800">
                            Varna (Caste)
                          </h4>
                          <p className="text-sm text-gray-600">
                            {compatibility?.varna?.description || "-"}
                          </p>
                        </div>
                        <div className="text-right">
                          <div
                            className={`font-bold ${getScoreColor(compatibility?.varna?.score || 0, compatibility?.varna?.max || 1)}`}
                          >
                            {compatibility?.varna?.score || 0}/
                            {compatibility?.varna?.max || 1}
                          </div>
                        </div>
                      </div>

                      {/* Vashya */}
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-semibold text-gray-800">
                            Vashya (Mutual Attraction)
                          </h4>
                          <p className="text-sm text-gray-600">
                            {compatibility?.vashya?.description || "-"}
                          </p>
                        </div>
                        <div className="text-right">
                          <div
                            className={`font-bold ${getScoreColor(compatibility?.vashya?.score || 0, compatibility?.vashya?.max || 2)}`}
                          >
                            {compatibility?.vashya?.score || 0}/
                            {compatibility?.vashya?.max || 2}
                          </div>
                        </div>
                      </div>

                      {/* Tara */}
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-semibold text-gray-800">
                            Tara (Destiny)
                          </h4>
                          <p className="text-sm text-gray-600">
                            {compatibility?.tara?.description || "-"}
                          </p>
                        </div>
                        <div className="text-right">
                          <div
                            className={`font-bold ${getScoreColor(compatibility?.tara?.score || 0, compatibility?.tara?.max || 3)}`}
                          >
                            {compatibility?.tara?.score || 0}/
                            {compatibility?.tara?.max || 3}
                          </div>
                        </div>
                      </div>

                      {/* Yoni */}
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-semibold text-gray-800">
                            Yoni (Sexual Compatibility)
                          </h4>
                          <p className="text-sm text-gray-600">
                            {compatibility?.yoni?.description || "-"}
                          </p>
                        </div>
                        <div className="text-right">
                          <div
                            className={`font-bold ${getScoreColor(compatibility?.yoni?.score || 0, compatibility?.yoni?.max || 4)}`}
                          >
                            {compatibility?.yoni?.score || 0}/
                            {compatibility?.yoni?.max || 4}
                          </div>
                        </div>
                      </div>

                      {/* Graha */}
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-semibold text-gray-800">
                            Graha Maitri (Mental Compatibility)
                          </h4>
                          <p className="text-sm text-gray-600">
                            {compatibility?.graha?.description || "-"}
                          </p>
                        </div>
                        <div className="text-right">
                          <div
                            className={`font-bold ${getScoreColor(compatibility?.graha?.score || 0, compatibility?.graha?.max || 5)}`}
                          >
                            {compatibility?.graha?.score || 0}/
                            {compatibility?.graha?.max || 5}
                          </div>
                        </div>
                      </div>

                      {/* Gana */}
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-semibold text-gray-800">
                            Gana (Temperament)
                          </h4>
                          <p className="text-sm text-gray-600">
                            {compatibility?.gana?.description || "-"}
                          </p>
                        </div>
                        <div className="text-right">
                          <div
                            className={`font-bold ${getScoreColor(compatibility?.gana?.score || 0, compatibility?.gana?.max || 6)}`}
                          >
                            {compatibility?.gana?.score || 0}/
                            {compatibility?.gana?.max || 6}
                          </div>
                        </div>
                      </div>

                      {/* Rashi */}
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-semibold text-gray-800">
                            Rashi (Zodiac Sign)
                          </h4>
                          <p className="text-sm text-gray-600">
                            {compatibility?.rashi?.description || "-"}
                          </p>
                        </div>
                        <div className="text-right">
                          <div
                            className={`font-bold ${getScoreColor(compatibility?.rashi?.score || 0, compatibility?.rashi?.max || 7)}`}
                          >
                            {compatibility?.rashi?.score || 0}/
                            {compatibility?.rashi?.max || 7}
                          </div>
                        </div>
                      </div>

                      {/* Nadi */}
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-semibold text-gray-800">
                            Nadi (Health & Genes)
                          </h4>
                          <p className="text-sm text-gray-600">
                            {compatibility?.nadi?.description || "-"}
                          </p>
                        </div>
                        <div className="text-right">
                          <div
                            className={`font-bold ${getScoreColor(compatibility?.nadi?.score || 0, compatibility?.nadi?.max || 8)}`}
                          >
                            {compatibility?.nadi?.score || 0}/
                            {compatibility?.nadi?.max || 8}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Comprehensive Analysis Summary */}
                <Card className="bg-gradient-to-r from-purple-50 to-indigo-50/90 backdrop-blur-sm border-purple-200">
                  <CardHeader>
                    <CardTitle className="text-purple-800 flex items-center">
                      <Users className="w-5 h-5 mr-2" />
                      Comprehensive Marriage Compatibility Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Marriage Suitability Summary */}
                      <div className="bg-white/60 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-800 mb-2">
                          Marriage Suitability
                        </h4>
                        <div className="flex flex-col md:flex md:flex-row items-center space-x-4 mb-3">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">
                              {compatibility?.totalScore || 0}
                            </div>
                            <div className="text-sm text-gray-600">
                              Points out of 36
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">
                              {compatibility?.percentage || 0}%
                            </div>
                            <div className="text-sm text-gray-600">
                              Compatibility
                            </div>
                          </div>
                          <div className="text-center">
                            <Badge
                              variant={
                                compatibility?.percentage >= 50
                                  ? "default"
                                  : "destructive"
                              }
                            >
                              {compatibility?.percentage >= 50
                                ? "Suitable"
                                : "Consult Expert"}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-gray-700 mb-3">
                          {compatibility?.recommendation ||
                            "Analysis in progress..."}
                        </p>

                        {/* Verdict Classification */}
                        {compatibility?.summary?.verdict && (
                          <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg p-3 mb-2">
                            <h5 className="font-semibold text-purple-800 mb-1">
                              Traditional Verdict
                            </h5>
                            <p className="text-purple-700 text-sm">
                              {compatibility.summary.verdict}
                            </p>
                          </div>
                        )}

                        {/* Marriage Recommendation */}
                        {compatibility?.summary?.marriageRecommendation && (
                          <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg p-3">
                            <h5 className="font-semibold text-blue-800 mb-1">
                              Marriage Recommendation
                            </h5>
                            <p className="text-blue-700 text-sm">
                              {compatibility.summary.marriageRecommendation}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Key Strengths */}
                      <div className="bg-white/60 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-800 mb-2">
                          Key Compatibility Strengths
                        </h4>
                        {compatibility?.summary?.keyStrengths?.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {compatibility.summary.keyStrengths.map(
                              (strength, index) => (
                                <div
                                  key={index}
                                  className="flex items-center space-x-2"
                                >
                                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                  <span className="text-sm text-gray-700">
                                    {typeof strength === "object"
                                      ? `${strength.koota} (${strength.score}) - ${strength.description}`
                                      : strength}
                                  </span>
                                </div>
                              ),
                            )}
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {[
                              {
                                guna: "Varna",
                                score: compatibility?.varna?.score || 0,
                                max: compatibility?.varna?.max || 1,
                              },
                              {
                                guna: "Vashya",
                                score: compatibility?.vashya?.score || 0,
                                max: compatibility?.vashya?.max || 2,
                              },
                              {
                                guna: "Tara",
                                score: compatibility?.tara?.score || 0,
                                max: compatibility?.tara?.max || 3,
                              },
                              {
                                guna: "Yoni",
                                score: compatibility?.yoni?.score || 0,
                                max: compatibility?.yoni?.max || 4,
                              },
                              {
                                guna: "Graha",
                                score: compatibility?.graha?.score || 0,
                                max: compatibility?.graha?.max || 5,
                              },
                              {
                                guna: "Gana",
                                score: compatibility?.gana?.score || 0,
                                max: compatibility?.gana?.max || 6,
                              },
                              {
                                guna: "Rashi",
                                score: compatibility?.rashi?.score || 0,
                                max: compatibility?.rashi?.max || 7,
                              },
                              {
                                guna: "Nadi",
                                score: compatibility?.nadi?.score || 0,
                                max: compatibility?.nadi?.max || 8,
                              },
                            ]
                              .filter((item) => item.score === item.max)
                              .map((item, index) => (
                                <div
                                  key={index}
                                  className="flex items-center space-x-2"
                                >
                                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                  <span className="text-sm text-gray-700">
                                    {item.guna} ({item.score}/{item.max})
                                  </span>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>

                      {/* Areas for Attention */}
                      <div className="bg-white/60 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-800 mb-2">
                          Areas Requiring Attention
                        </h4>
                        {compatibility?.summary?.weakAreas?.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {compatibility.summary.weakAreas.map(
                              (weakness, index) => (
                                <div
                                  key={index}
                                  className="flex items-center space-x-2"
                                >
                                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                  <span className="text-sm text-gray-700">
                                    {typeof weakness === "object"
                                      ? `${weakness.koota} (${weakness.score}) - ${weakness.description}`
                                      : weakness}
                                  </span>
                                </div>
                              ),
                            )}
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {[
                              {
                                guna: "Varna",
                                score: compatibility?.varna?.score || 0,
                                max: compatibility?.varna?.max || 1,
                              },
                              {
                                guna: "Vashya",
                                score: compatibility?.vashya?.score || 0,
                                max: compatibility?.vashya?.max || 2,
                              },
                              {
                                guna: "Tara",
                                score: compatibility?.tara?.score || 0,
                                max: compatibility?.tara?.max || 3,
                              },
                              {
                                guna: "Yoni",
                                score: compatibility?.yoni?.score || 0,
                                max: compatibility?.yoni?.max || 4,
                              },
                              {
                                guna: "Graha",
                                score: compatibility?.graha?.score || 0,
                                max: compatibility?.graha?.max || 5,
                              },
                              {
                                guna: "Gana",
                                score: compatibility?.gana?.score || 0,
                                max: compatibility?.gana?.max || 6,
                              },
                              {
                                guna: "Rashi",
                                score: compatibility?.rashi?.score || 0,
                                max: compatibility?.rashi?.max || 7,
                              },
                              {
                                guna: "Nadi",
                                score: compatibility?.nadi?.score || 0,
                                max: compatibility?.nadi?.max || 8,
                              },
                            ]
                              .filter((item) => item.score < item.max)
                              .map((item, index) => (
                                <div
                                  key={index}
                                  className="flex items-center space-x-2"
                                >
                                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                  <span className="text-sm text-gray-700">
                                    {item.guna} ({item.score}/{item.max})
                                  </span>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>

                      {/* Natural Language Summary */}
                      {compatibility?.summaryText && (
                        <div className="bg-white/60 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-800 mb-2">
                            Detailed Analysis Summary
                          </h4>
                          <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                            {compatibility.summaryText}
                          </div>
                        </div>
                      )}

                      {/* Relationship Insights */}
                      {compatibility?.summary?.relationshipInsights && (
                        <div className="bg-white/60 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-800 mb-2">
                            Relationship Insights
                          </h4>
                          <div className="space-y-2">
                            {compatibility.summary.relationshipInsights.map(
                              (insight, index) => (
                                <div
                                  key={index}
                                  className="flex items-start space-x-2"
                                >
                                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                                  <span className="text-sm text-gray-700">
                                    {insight}
                                  </span>
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="text-center mt-6 space-x-4">
                  <Link href="/">
                    <Button variant="outline">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Check Another Match
                    </Button>
                  </Link>
                  <Button
                    onClick={() => window.print()}
                    className="bg-purple-600 hover:bg-purple-700 mt-3"
                  >
                    Print Report
                  </Button>
                  <Link href="/astrologers">
                    <Button className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white mt-3">
                      <Heart className="w-4 h-4 mr-2" />
                      Chat with Marriage Astrologer
                    </Button>
                  </Link>
                </div>

                {/* Marketing Card for Comprehensive Report */}
                <div className="mt-6">
                  <Card className="bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 shadow-lg">
                    <CardContent className="p-8">
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full mb-4">
                          <Crown className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-orange-800 mb-3">
                          Get a Comprehensive Kundli Matching Report
                        </h3>
                        <p className="text-orange-700 mb-6 max-w-3xl mx-auto leading-relaxed">
                          Unlock deeper insights into your marriage
                          compatibility with our premium detailed report. Get
                          personalized remedies, auspicious wedding dates,
                          post-marriage predictions, and much more.
                        </p>

                        {/* Benefits Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                          <div className="bg-white/60 rounded-lg p-4">
                            <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                            <h4 className="font-semibold text-orange-800 mb-1">
                              Detailed Remedies
                            </h4>
                            <p className="text-sm text-orange-700">
                              Personalized solutions for compatibility issues
                            </p>
                          </div>
                          <div className="bg-white/60 rounded-lg p-4">
                            <Calendar className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                            <h4 className="font-semibold text-orange-800 mb-1">
                              Auspicious Dates
                            </h4>
                            <p className="text-sm text-orange-700">
                              Best wedding dates and timing recommendations
                            </p>
                          </div>
                          <div className="bg-white/60 rounded-lg p-4">
                            <TrendingUp className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                            <h4 className="font-semibold text-orange-800 mb-1">
                              Future Predictions
                            </h4>
                            <p className="text-sm text-orange-700">
                              Post-marriage life insights and guidance
                            </p>
                          </div>
                        </div>

                        <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-10 py-3 text-xs md:text-lg font-semibold w-full lg:w-auto">
                          Get Premium Detailed Report - ₹499
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Chat with Astrologer Card */}
                <div className="mt-4">
                  <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                        {/* Text Content */}
                        <div className="flex-1">
                          <div className="flex items-center mb-3">
                            <MessageCircle className="w-6 h-6 text-blue-600 mr-3" />
                            <h3 className="text-xl font-bold text-blue-800">
                              Consult Expert Astrologer
                            </h3>
                          </div>
                          <p className="text-blue-700 mb-3 leading-relaxed">
                            Marriage is a sacred bond. While our automated Gun
                            Milan analysis provides valuable insights,
                            consulting with an experienced astrologer ensures
                            deeper understanding of your compatibility, timing
                            considerations, and personalized guidance for a
                            blessed marriage.
                          </p>
                          <div className="text-sm text-blue-600 font-medium">
                            ✨ Get personalized advice • Clarify doubts •
                            Discuss remedies • Plan your future together
                          </div>
                        </div>

                        {/* Button */}
                        <div className="w-full lg:w-auto">
                          <Link href="/astrologers">
                            <Button className="w-full lg:w-auto bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-6 py-3 flex items-center justify-center">
                              <MessageCircle className="w-4 h-4 mr-2" />
                              Chat with Expert
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
