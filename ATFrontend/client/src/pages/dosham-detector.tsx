import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import { Label } from "src/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "src/components/ui/select";
import { useToast } from "src/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "src/lib/queryClient";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";
import LocationSearch from "src/components/LocationSearch";
import { useRef } from "react";
import {
  AlertTriangle,
  Calendar,
  Clock,
  User,
  MapPin,
  Users,
} from "lucide-react";

export default function DoshamDetector() {
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    birthDate: "",
    birthTime: "",
    birthPlace: "",
    latitude: "",
    longitude: "",
  });
  const [result, setResult] = useState<any>(null);
  const resultRef = useRef<HTMLDivElement | null>(null);
  const { toast } = useToast();

  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [birthDateError, setBirthDateError] = useState("");
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [ampm, setAmPm] = useState("");
  const [birthTimeError, setBirthTimeError] = useState("");

  const validateAndSetDate = (d: string, m: string, y: string) => {
    if (d && m && y) {
      const formatted = `${y}-${m}-${d}`;
      const dateObj = new Date(formatted);

      if (
        dateObj &&
        dateObj.getFullYear().toString() === y &&
        (dateObj.getMonth() + 1).toString().padStart(2, "0") === m &&
        dateObj.getDate().toString().padStart(2, "0") === d
      ) {
        setBirthDateError("");
        setBirthDate(formatted); // local state
        setFormData((prev) => ({ ...prev, birthDate: formatted })); // ✅ sync with formData
      } else {
        setBirthDateError("Please select a valid date");
        setBirthDate("");
        setFormData((prev) => ({ ...prev, birthDate: "" }));
      }
    }
  };

  const validateAndSetTime = (h: string, min: string) => {
    if (h && min) {
      const hh = parseInt(h, 10);
      const mm = parseInt(min, 10);

      if (hh >= 0 && hh <= 23 && mm >= 0 && mm <= 59) {
        const formatted = `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
        setBirthTimeError("");
        setBirthTime(formatted); // local state
        setFormData((prev) => ({ ...prev, birthTime: formatted })); // ✅ sync with formData
      } else {
        setBirthTimeError("Please select a valid time");
        setBirthTime("");
        setFormData((prev) => ({ ...prev, birthTime: "" }));
      }
    }
  };

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/detect-dosham", data);
      return response;
    },
    onSuccess: (data) => {
      if (data.success) {
        setResult(data.data);
        toast({
          title: "Dosham Analysis Complete",
          description: "Your dosha analysis has been completed successfully",
        });
        if (window.innerWidth < 768 && resultRef.current) {
          setTimeout(() => {
            resultRef.current?.scrollIntoView({ behavior: "smooth" });
          }, 300);
        }
      } else {
        toast({
          title: "Analysis Failed",
          description: data.message || "Unable to detect dosham",
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to detect dosham. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleLocationSelect = (location: any, coords: any) => {
    console.log("Dosham location selected:", location, "Coordinates:", coords);
    setFormData({
      ...formData,
      birthPlace:
        location.display || location.place || location.place_name || "",
      latitude: location.latitude ? location.latitude.toString() : "",
      longitude: location.longitude ? location.longitude.toString() : "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Debug logging
    console.log("Form data:", formData);
    console.log("Validation check:", {
      name: formData.name,
      gender: formData.gender,
      birthDate: formData.birthDate,
      birthTime: formData.birthTime,
      birthPlace: formData.birthPlace,
    });

    if (
      !formData.name ||
      !formData.gender ||
      !formData.birthDate ||
      !formData.birthTime ||
      !formData.birthPlace
    ) {
      console.log("Validation failed - missing fields");
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Ensure latitude and longitude are provided
    if (!formData.latitude || !formData.longitude) {
      console.log("Validation failed - missing coordinates");
      toast({
        title: "Location Required",
        description: "Please select a valid location from the dropdown",
        variant: "destructive",
      });
      return;
    }

    console.log("Validation passed - submitting form");
    mutation.mutate(formData);
  };

  return (
    <>
      <Helmet>
        <title>
          Free Dosham Detector | Mangal Dosha & Kaal Sarp Dosha Checker -
          AstroTick
        </title>
        <meta
          name="description"
          content="Free Dosham Detector - Check for Mangal Dosha, Kaal Sarp Dosha, and other important doshas in your birth chart. Authentic Vedic astrology calculations with personalized remedies."
        />
        <meta
          name="keywords"
          content="free dosham detector, mangal dosha checker, kaal sarp dosha, free dosha analysis, Vedic astrology doshas, manglik calculator"
        />
        <link rel="canonical" href="https://astrotick.com/dosham-detector" />

        {/* Open Graph */}
        <meta property="og:title" content="Free Dosham Detector - AstroTick" />
        <meta
          property="og:description"
          content="Free Dosham Detector - Check for Mangal Dosha, Kaal Sarp Dosha, and other important doshas with authentic Vedic calculations."
        />
        <meta
          property="og:url"
          content="https://astrotick.com/dosham-detector"
        />
        <meta property="og:type" content="website" />

        {/* Twitter */}
        <meta name="twitter:title" content="Free Dosham Detector - AstroTick" />
        <meta
          name="twitter:description"
          content="Free Dosham Detector - Check for Mangal Dosha, Kaal Sarp Dosha, and other important doshas in your birth chart."
        />

        {/* Schema.org structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Free Dosham Detector",
            description:
              "Check for Mangal Dosha, Kaal Sarp Dosha, and other doshas in birth chart",
            url: "https://astrotick.com/dosham-detector",
            applicationCategory: "LifestyleApplication",
            operatingSystem: "Web Browser",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <AstroTickHeader />
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-500 to-red-600 rounded-full mb-6">
                <AlertTriangle className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
                Free Dosham Detector
              </h1>
              <p className="md:text-xl text-gray-600 max-w-2xl mx-auto">
                Check for Mangal Dosha, Kaal Sarp Dosha, and other important
                doshas in your birth chart.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Form Column */}
              <div className="lg:col-span-2 ">
                <Card className="shadow-xl border-amber-400 bg-white/80 backdrop-blur-sm ">
                  <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500  rounded-t-lg ">
                    <CardTitle className="text-2xl  text-center text-white ">
                      Enter Birth Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2 mt-5">
                        <Label
                          htmlFor="name"
                          className="flex items-center gap-2"
                        >
                          <User className="h-4 w-4" />
                          Full Name
                        </Label>
                        <Input
                          id="name"
                          type="text"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          placeholder="Enter your full name"
                          required
                          data-testid="input-name"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="gender"
                          className="flex items-center gap-2"
                        >
                          <Users className="h-4 w-4" />
                          Gender
                        </Label>
                        <Select
                          value={formData.gender}
                          onValueChange={(value) =>
                            setFormData({ ...formData, gender: value })
                          }
                          required
                          data-testid="input-gender"
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="birthDate"
                          className="flex flex-wrap  items-center gap-2"
                        >
                          <Calendar className="h-4 w-4" />
                          Birth Date
                        </Label>

                        {birthDateError && (
                          <p className="text-red-500 text-sm">
                            {birthDateError}
                          </p>
                        )}

                        <div className="flex gap-2">
                          {/* Day */}
                          <select
                            value={day}
                            onChange={(e) => {
                              setDay(e.target.value);
                              validateAndSetDate(e.target.value, month, year);
                            }}
                            className="border rounded p-2"
                          >
                            <option value="">Day</option>
                            {Array.from({ length: 31 }, (_, i) => (
                              <option
                                key={i + 1}
                                value={String(i + 1).padStart(2, "0")}
                              >
                                {i + 1}
                              </option>
                            ))}
                          </select>

                          {/* Month */}
                          <select
                            value={month}
                            onChange={(e) => {
                              setMonth(e.target.value);
                              validateAndSetDate(day, e.target.value, year);
                            }}
                            className="border rounded p-2"
                          >
                            <option value="">Month</option>
                            {Array.from({ length: 12 }, (_, i) => (
                              <option
                                key={i + 1}
                                value={String(i + 1).padStart(2, "0")}
                              >
                                {new Date(0, i).toLocaleString("default", {
                                  month: "long",
                                })}
                              </option>
                            ))}
                          </select>

                          {/* Year */}
                          <select
                            value={year}
                            onChange={(e) => {
                              setYear(e.target.value);
                              validateAndSetDate(day, month, e.target.value);
                            }}
                            className="border rounded p-2"
                          >
                            <option value="">Year</option>
                            {Array.from({ length: 120 }, (_, i) => {
                              const y = new Date().getFullYear() - i;
                              return (
                                <option key={y} value={y.toString()}>
                                  {y}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      </div>

                      {/* Birth Time */}
                      <div className="space-y-2">
                        <label
                          htmlFor="birthTime"
                          className="flex items-center gap-2 font-medium"
                        >
                          <Clock className="h-4 w-4" />
                          Birth Time
                        </label>

                        {birthTimeError && (
                          <p className="text-red-500 text-sm">
                            {birthTimeError}
                          </p>
                        )}

                        <div className="flex gap-2">
                          {/* Hour */}
                          <select
                            value={hour}
                            onChange={(e) => {
                              setHour(e.target.value);
                              validateAndSetTime(e.target.value, minute);
                            }}
                            className="border rounded p-2"
                          >
                            <option value="">Hour</option>
                            {Array.from({ length: 24 }, (_, i) => (
                              <option key={i + 1} value={String(i + 1)}>
                                {i + 1}
                              </option>
                            ))}
                          </select>

                          {/* Minute */}
                          <select
                            value={minute}
                            onChange={(e) => {
                              setMinute(e.target.value);
                              validateAndSetTime(hour, e.target.value);
                            }}
                            className="border rounded p-2"
                          >
                            <option value="">Minute</option>
                            {Array.from({ length: 60 }, (_, i) => (
                              <option
                                key={i}
                                value={String(i).padStart(2, "0")}
                              >
                                {i.toString().padStart(2, "0")}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="birthPlace"
                          className="flex items-center gap-2"
                        >
                          <MapPin className="h-4 w-4" />
                          Birth Place
                        </Label>
                        <LocationSearch
                          onLocationSelect={handleLocationSelect}
                          placeholder="Enter your birth city..."
                          data-testid="input-birthPlace"
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 md:col-span-2"
                        disabled={mutation.isPending}
                      >
                        {mutation.isPending ? "Analyzing..." : "Detect Dosham"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Results Column */}
              <div className="lg:col-span-2" ref={resultRef}>
                <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-2xl text-center text-mystical-blue">
                      Dosham Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {result ? (
                      <div className="space-y-6">
                        {/* Personal Information */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border">
                          <h4 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                            Personal Information
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <span className="text-sm text-gray-600">
                                Name:
                              </span>
                              <p className="font-medium">
                                {result.personalInfo?.name || formData.name}
                              </p>
                            </div>
                            <div>
                              <span className="text-sm text-gray-600">
                                Gender:
                              </span>
                              <p className="font-medium capitalize">
                                {result.personalInfo?.gender || formData.gender}
                              </p>
                            </div>
                            <div>
                              <span className="text-sm text-gray-600">
                                Birth Date:
                              </span>
                              <p className="font-medium">
                                {result.personalInfo?.birthDate ||
                                  formData.birthDate}
                              </p>
                            </div>
                            <div>
                              <span className="text-sm text-gray-600">
                                Birth Time:
                              </span>
                              <p className="font-medium">
                                {result.personalInfo?.birthTime ||
                                  formData.birthTime}
                              </p>
                            </div>
                            <div className="md:col-span-2">
                              <span className="text-sm text-gray-600">
                                Birth Place:
                              </span>
                              <p className="font-medium">
                                {typeof (
                                  result.personalInfo?.birthPlace ||
                                  formData.birthPlace
                                ) === "object"
                                  ? result.personalInfo?.birthPlace?.display ||
                                    formData.birthPlace?.display ||
                                    ""
                                  : result.personalInfo?.birthPlace ||
                                    formData.birthPlace}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Doshas Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {result.doshas?.map((dosha: any, index: number) => (
                            <div
                              key={index}
                              className={`p-6 rounded-lg border ${dosha.present ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"}`}
                            >
                              <div className="flex items-center justify-between mb-3">
                                <h4
                                  className={`font-bold text-lg ${dosha.present ? "text-red-700" : "text-green-700"}`}
                                >
                                  {dosha.name}
                                </h4>
                                <div
                                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    dosha.present
                                      ? "bg-red-100 text-red-800"
                                      : "bg-green-100 text-green-800"
                                  }`}
                                >
                                  {dosha.present ? "Present" : "Not Present"}
                                </div>
                              </div>

                              {dosha.present && (
                                <div className="space-y-3">
                                  <p className="text-sm text-gray-700">
                                    {dosha.description}
                                  </p>

                                  {dosha.severity && (
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm font-medium text-gray-600">
                                        Severity:
                                      </span>
                                      <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                                          dosha.severity === "Very High"
                                            ? "bg-red-200 text-red-900"
                                            : dosha.severity === "High"
                                              ? "bg-red-100 text-red-800"
                                              : dosha.severity === "Moderate"
                                                ? "bg-yellow-100 text-yellow-800"
                                                : "bg-green-100 text-green-800"
                                        }`}
                                      >
                                        {dosha.severity}
                                      </span>
                                    </div>
                                  )}

                                  {dosha.effect && (
                                    <div>
                                      <span className="text-sm font-medium text-gray-600">
                                        Effects:
                                      </span>
                                      <p className="text-sm text-gray-700 mt-1">
                                        {dosha.effect}
                                      </p>
                                    </div>
                                  )}

                                  {dosha.remedies &&
                                    dosha.remedies.length > 0 && (
                                      <div>
                                        <span className="text-sm font-medium text-gray-600">
                                          Quick Remedies:
                                        </span>
                                        <ul className="text-sm text-gray-700 mt-1 space-y-1">
                                          {dosha.remedies
                                            .slice(0, 3)
                                            .map(
                                              (remedy: string, idx: number) => (
                                                <li
                                                  key={idx}
                                                  className="flex items-start gap-2"
                                                >
                                                  <span className="text-gray-400">
                                                    •
                                                  </span>
                                                  <span>{remedy}</span>
                                                </li>
                                              ),
                                            )}
                                          {dosha.remedies.length > 3 && (
                                            <li className="text-xs text-mystical-blue font-medium mt-2">
                                              +{dosha.remedies.length - 3} more
                                              remedies in detailed report
                                            </li>
                                          )}
                                        </ul>
                                      </div>
                                    )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Summary */}
                        {result.summary && (
                          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border">
                            <h4 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                              Dosha Analysis Summary
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                              <div className="bg-white/50 p-4 rounded-lg">
                                <p className="text-3xl font-bold text-mystical-blue">
                                  {result.summary.totalDoshas || 0}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Total Doshas Detected
                                </p>
                              </div>
                              <div className="bg-white/50 p-4 rounded-lg">
                                <p
                                  className={`text-3xl font-bold ${
                                    result.summary.severityLevel === "High"
                                      ? "text-red-600"
                                      : result.summary.severityLevel ===
                                          "Moderate"
                                        ? "text-yellow-600"
                                        : "text-green-600"
                                  }`}
                                >
                                  {result.summary.severityLevel || "Low"}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Severity Level
                                </p>
                              </div>
                              <div className="bg-white/50 p-4 rounded-lg">
                                <p
                                  className={`text-3xl font-bold ${
                                    (result.summary.overallScore || 85) >= 70
                                      ? "text-green-600"
                                      : (result.summary.overallScore || 85) >=
                                          50
                                        ? "text-yellow-600"
                                        : "text-red-600"
                                  }`}
                                >
                                  {result.summary.overallScore || 85}/100
                                </p>
                                <p className="text-sm text-gray-600">
                                  Life Harmony Score
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Premium Features Teaser */}
                        {result && (
                          <div className="bg-gradient-to-r from-mystical-blue to-purple-600 p-6 rounded-lg text-white">
                            <h4 className="text-xl font-semibold mb-4 text-center">
                              Unlock Complete Dosha Analysis
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                <span>
                                  Detailed planetary positions and degrees
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                <span>Personalized timing for remedies</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                <span>Marriage compatibility analysis</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                <span>Career impact assessment</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                <span>Health predictions & precautions</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                <span>Wealth & prosperity guidance</span>
                              </div>
                            </div>
                            <div className="text-center mt-6">
                              <a
                                href="/premium-report"
                                className="bg-white text-mystical-blue px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                              >
                                Get Premium Report
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-24">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-red-200 to-pink-200 rounded-full blur-xl opacity-30 animate-pulse"></div>
                          <div className="relative bg-gradient-to-r from-red-100 to-pink-100 rounded-full p-8 mx-auto w-fit">
                            <AlertTriangle className="h-20 w-20 text-red-500 mx-auto" />
                          </div>
                        </div>
                        <p className="text-gray-500 text-xl mt-8">
                          Enter your birth details to detect doshas
                        </p>
                        <p className="text-gray-400 text-sm mt-2">
                          Comprehensive dosha analysis will appear here
                        </p>

                        {/* Info Cards */}
                        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-6">
                            <h5 className="font-semibold text-gray-900 mb-2">
                              Mangal Dosha
                            </h5>
                            <p className="text-sm text-gray-600">
                              Mars placement affecting marriage and
                              relationships
                            </p>
                          </div>
                          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-6">
                            <h5 className="font-semibold text-gray-900 mb-2">
                              Kaal Sarp Dosha
                            </h5>
                            <p className="text-sm text-gray-600">
                              Rahu-Ketu planetary alignment creating obstacles
                            </p>
                          </div>
                          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-6">
                            <h5 className="font-semibold text-gray-900 mb-2">
                              Pitra Dosha
                            </h5>
                            <p className="text-sm text-gray-600">
                              Ancestral karmic influences and spiritual blocks
                            </p>
                          </div>
                          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6">
                            <h5 className="font-semibold text-gray-900 mb-2">
                              Shani Dosha
                            </h5>
                            <p className="text-sm text-gray-600">
                              Saturn placement causing delays and challenges
                            </p>
                          </div>
                          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6">
                            <h5 className="font-semibold text-gray-900 mb-2">
                              Rahu Dosha
                            </h5>
                            <p className="text-sm text-gray-600">
                              Rahu placement creating confusion and illusions
                            </p>
                          </div>
                          <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg p-6">
                            <h5 className="font-semibold text-gray-900 mb-2">
                              Grahan Dosha
                            </h5>
                            <p className="text-sm text-gray-600">
                              Eclipse combinations affecting mental clarity
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Educational Content Column */}
              <div className="lg:col-span-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Understanding Doshas */}
                  <Card className="shadow-xl border-0 bg-gradient-to-r from-blue-50 to-indigo-50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-xl text-center text-mystical-blue">
                        Understanding Doshas
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-blue-600 font-bold text-sm">
                              1
                            </span>
                          </div>
                          <div>
                            <h5 className="font-semibold text-gray-900">
                              Astrological Flaws
                            </h5>
                            <p className="text-gray-600 text-sm">
                              Doshas are planetary combinations that create
                              challenges in different life areas
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-green-600 font-bold text-sm">
                              2
                            </span>
                          </div>
                          <div>
                            <h5 className="font-semibold text-gray-900">
                              Karmic Influences
                            </h5>
                            <p className="text-gray-600 text-sm">
                              They represent past-life karma and lessons to be
                              learned in this lifetime
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-purple-600 font-bold text-sm">
                              3
                            </span>
                          </div>
                          <div>
                            <h5 className="font-semibold text-gray-900">
                              Remedial Solutions
                            </h5>
                            <p className="text-gray-600 text-sm">
                              Traditional Vedic remedies can neutralize negative
                              effects and enhance positive outcomes
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Dosha Remedies */}
                  <Card className="shadow-xl border-0 bg-gradient-to-r from-amber-50 to-orange-50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-xl text-center text-mystical-blue">
                        Authentic Remedies
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <span className="text-gray-700 text-sm">
                            Accurate birth time is crucial for precise dosha
                            detection
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <span className="text-gray-700 text-sm">
                            Specific mantras and prayers neutralize negative
                            planetary effects
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <span className="text-gray-700 text-sm">
                            Gemstones and fasting enhance positive planetary
                            influences
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <span className="text-gray-700 text-sm">
                            Donations and charitable acts create positive karmic
                            balance
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action Section */}
          <div className="mt-20 text-center">
            <div className="bg-gradient-to-r from-mystical-blue to-purple-600 rounded-xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">
                Need Detailed Dosha Analysis & Remedies?
              </h3>
              <p className="text-lg mb-6 opacity-90">
                Get comprehensive birth chart analysis with personalized
                remedies and timing guidance from expert astrologers
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="/premium-report"
                  className="bg-white text-mystical-blue px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Premium Life Report
                </a>
                <a
                  href="/astrologers"
                  className="bg-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors backdrop-blur-sm"
                >
                  Consult Expert
                </a>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
