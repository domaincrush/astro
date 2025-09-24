import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import { Label } from "src/components/ui/label";
import { useToast } from "src/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "src/lib/queryClient";
import LocationSearch from "src/components/LocationSearch";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";
import {
  Star,
  Calendar,
  MapPin,
  Clock,
  Heart,
  Briefcase,
  Shield,
  Palette,
  Hash,
  Users,
  AlertTriangle,
  Gem,
  Zap,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useRef } from "react";

interface LagnaData {
  ascendant: string;
  ascendantLord: string;
  description: string;
  characteristics: string[];
  recommendations: string[];
  element: string;
  modality: string;
  bodyParts: string[];
  careerStrengths: string[];
  healthTendencies: string[];
  luckyColors: string[];
  luckyNumbers: number[];
  compatibleSigns: string[];
  challengingSigns: string[];
  gemstones: string[];
  remedies: string[];
  calculationEngine: string;
}

export default function LagnaCalculator() {
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const resultRef = useRef<HTMLDivElement | null>(null);
  const [birthPlace, setBirthPlace] = useState("");
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [result, setResult] = useState<LagnaData | null>(null);
  const { toast } = useToast();
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
        setBirthDate(formatted); // final YYYY-MM-DD value
      } else {
        setBirthDateError("Please select a valid date");
        setBirthDate("");
      }
    }
  };
  const validateAndSetTime = (h: string, min: string) => {
    if (h && min) {
      const hh = parseInt(h, 10);
      const mm = parseInt(min, 10);

      if (hh >= 1 && hh <= 24 && mm >= 0 && mm <= 59) {
        setBirthTimeError("");
        setBirthTime(`${h.padStart(2, "0")}:${min.padStart(2, "0")} `);
      } else {
        setBirthTimeError("Please select a valid time");
        setBirthTime("");
      }
    }
  };

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/calculate-lagna", data);
      return response;
    },
    onSuccess: (data) => {
      if (data.success) {
        setResult(data.data);
        toast({
          title: "Lagna Calculated",
          description: "Your ascendant sign has been calculated successfully",
        });
        if (window.innerWidth < 768 && resultRef.current) {
          setTimeout(() => {
            resultRef.current?.scrollIntoView({ behavior: "smooth" });
          }, 300);
        }
      } else {
        toast({
          title: "Calculation Failed",
          description: data.message || "Unable to calculate lagna",
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to calculate lagna. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Form submission debug:", {
      birthDate,
      birthTime,
      birthPlace,
      coordinates,
    });

    // Basic field validation
    if (!birthDate || !birthTime || !birthPlace) {
      console.log("Missing basic fields:", {
        birthDate: !!birthDate,
        birthTime: !!birthTime,
        birthPlace: !!birthPlace,
      });

      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Coordinate validation
    if (!coordinates || !coordinates.lat || !coordinates.lng) {
      console.log("Missing coordinates:", coordinates);
      toast({
        title: "Location Required",
        description: "Please select a valid location from the dropdown",
        variant: "destructive",
      });
      return;
    }

    mutation.mutate({
      birthDate,
      birthTime,
      birthPlace,
      latitude: coordinates.lat,
      longitude: coordinates.lng,
    });
  };

  return (
    <>
      <Helmet>
        <title>
          Free Lagna Calculator | Ascendant Sign Analysis - AstroTick
        </title>
        <meta
          name="description"
          content="Free Lagna Calculator - Calculate your ascendant sign (Lagna) with authentic Vedic astrology. Discover your personality insights and life path guidance."
        />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <AstroTickHeader />

        <main className="container mx-auto px-4 py-4">
          <div className="max-w-4xl mx-auto">
            {/* Header Section */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-500 to-red-600 rounded-full mb-6">
                <Star className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
                Lagna Calculator
              </h1>
              <p className="md:text-xl text-gray-600 max-w-2xl mx-auto">
                Discover your ascendant sign (Lagna) and unlock insights into
                your personality, appearance, and life path according to Vedic
                astrology.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Input Form */}
              <Card className="shadow-xl border-amber-400 bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 pb-4 mb-5 rounded-t-lg">
                  <CardTitle className="text-2xl  text-center text-white ">
                    Enter Birth Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="birthDate"
                        className="flex items-center gap-2"
                      >
                        <Calendar className="h-4 w-4" />
                        Birth Date
                      </Label>

                      {birthDateError && (
                        <p className="text-red-500 text-sm">{birthDateError}</p>
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
                        <p className="text-red-500 text-sm">{birthTimeError}</p>
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
                            <option key={i} value={String(i).padStart(2, "0")}>
                              {i.toString().padStart(2, "0")}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Birth Place
                      </Label>
                      <LocationSearch
                        value={birthPlace}
                        onChange={setBirthPlace}
                        data-testid="input-birthPlace"
                        onLocationSelect={(locationName, coords) => {
                          console.log(
                            "Location selected:",
                            locationName,
                            coords,
                          );
                          setBirthPlace(locationName.place);
                          if (locationName.latitude && locationName.longitude) {
                            setCoordinates({
                              lat: locationName.latitude,
                              lng: locationName.longitude,
                            });
                          }
                        }}
                        placeholder="Enter your birth city..."
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                      disabled={mutation.isPending}
                    >
                      {mutation.isPending
                        ? "Calculating..."
                        : "Calculate Lagna"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Results */}
              <Card
                className="shadow-xl border-0 bg-white/80 backdrop-blur-sm"
                ref={resultRef}
              >
                <CardHeader>
                  <CardTitle className="text-2xl text-center text-mystical-blue">
                    Your Lagna (Ascendant)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {result ? (
                    <div className="space-y-6">
                      <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                        <h3 className="text-3xl font-bold text-mystical-blue mb-2">
                          {result.ascendant}
                        </h3>
                        <p className="text-lg text-gray-600">
                          Ruled by {result.ascendantLord}
                        </p>
                        <div className="flex justify-center gap-4 mt-4">
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                            {result.element} Element
                          </span>
                          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                            {result.modality} Sign
                          </span>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">
                          Description
                        </h4>
                        <p className="text-gray-700 leading-relaxed">
                          {result.description}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">
                          Key Characteristics
                        </h4>
                        <ul className="space-y-2">
                          {result.characteristics.map((trait, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <Star className="h-4 w-4 text-mystical-gold mt-1 flex-shrink-0" />
                              <span className="text-gray-700">{trait}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">
                          Recommendations
                        </h4>
                        <ul className="space-y-2">
                          {result.recommendations.map((rec, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <Star className="h-4 w-4 text-mystical-gold mt-1 flex-shrink-0" />
                              <span className="text-gray-700">{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Star className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">
                        Enter your birth details to calculate your Lagna
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Comprehensive Analysis Sections */}
            {result && (
              <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Health & Body */}
                <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-xl text-mystical-blue flex items-center gap-2">
                      <Heart className="h-5 w-5" />
                      Health & Body
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Body Parts Ruled
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {result.bodyParts.map((part, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                            >
                              {part}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Health Tendencies
                        </h4>
                        <ul className="space-y-1">
                          {result.healthTendencies.map((tendency, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <AlertTriangle className="h-4 w-4 text-orange-500 mt-1 flex-shrink-0" />
                              <span className="text-gray-700 text-sm">
                                {tendency}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Career & Strengths */}
                <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-xl text-mystical-blue flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      Career & Strengths
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Career Fields
                      </h4>
                      <ul className="space-y-1">
                        {result.careerStrengths.map((career, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <Star className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                            <span className="text-gray-700 text-sm">
                              {career}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Lucky Elements */}
                <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-xl text-mystical-blue flex items-center gap-2">
                      <Palette className="h-5 w-5" />
                      Lucky Elements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Lucky Colors
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {result.luckyColors.map((color, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                            >
                              {color}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Lucky Numbers
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {result.luckyNumbers.map((number, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm"
                            >
                              {number}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Compatibility */}
                <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-xl text-mystical-blue flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Compatibility
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Compatible Signs
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {result.compatibleSigns.map((sign, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                            >
                              {sign}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Challenging Signs
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {result.challengingSigns.map((sign, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                            >
                              {sign}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Gemstones */}
                <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-xl text-mystical-blue flex items-center gap-2">
                      <Gem className="h-5 w-5" />
                      Gemstones
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Recommended Gemstones
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {result.gemstones.map((gem, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg"
                          >
                            <Gem className="h-4 w-4 text-purple-600" />
                            <span className="text-gray-700 text-sm">{gem}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Remedies */}
                <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-xl text-mystical-blue flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      Remedies
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Recommended Remedies
                      </h4>
                      <ul className="space-y-2">
                        {result.remedies.map((remedy, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <Zap className="h-4 w-4 text-orange-500 mt-1 flex-shrink-0" />
                            <span className="text-gray-700 text-sm">
                              {remedy}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Info Section */}
            <Card className="mt-12 shadow-xl border-0 bg-gradient-to-r from-blue-50 to-purple-50">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-mystical-blue mb-4 text-center">
                  About Lagna (Ascendant)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
                  <div>
                    <h4 className="font-semibold mb-2">What is Lagna?</h4>
                    <p>
                      Lagna or Ascendant is the zodiac sign that was rising on
                      the eastern horizon at the time of your birth. It
                      represents your outer personality, physical appearance,
                      and how others perceive you.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Why is it Important?</h4>
                    <p>
                      The Lagna is considered the most important factor in Vedic
                      astrology as it determines the placement of all houses in
                      your birth chart and influences your entire life path and
                      personality.
                    </p>
                  </div>
                </div>
                {result && (
                  <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                      Calculated using {result.calculationEngine} • Authentic
                      Vedic calculations
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
