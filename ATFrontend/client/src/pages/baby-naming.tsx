import { useState, useEffect } from "react";
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
import { LocationSearch } from "src/components/LocationSearch";
import { Baby, Calendar, Clock, MapPin } from "lucide-react";
import { useRef } from "react";

export default function BabyNaming() {
  const [birthDate, setBirthDate] = useState("");
  const resultRef = useRef<HTMLDivElement | null>(null);
  const [birthTime, setBirthTime] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [gender, setGender] = useState("");
  const [result, setResult] = useState<any>(null);
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
      const response = await apiRequest(
        "POST",
        "/api/suggest-baby-names",
        data,
      );
      return response;
    },
    onSuccess: (data) => {
      if (data.success) {
        setResult(data.data);
        toast({
          title: "Names Generated",
          description: "Auspicious baby names have been suggested for you",
        });
      } else {
        toast({
          title: "Generation Failed",
          description: data.message || "Unable to suggest names",
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate names. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleLocationSelect = (location: any) => {
    console.log("Baby naming location selected:", location);

    const place =
      location.place ||
      location.place_name ||
      location.display ||
      location.display_name ||
      location.name;

    setBirthPlace(place);
    setLatitude(location.latitude || location.lat);
    setLongitude(location.longitude || location.lng);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Baby naming form submission:", {
      birthDate,
      birthTime,
      birthPlace,
      gender,
      latitude,
      longitude,
    });

    // Basic field validation
    if (!birthDate || !birthTime || !birthPlace || !gender) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Coordinate validation
    if (!latitude || !longitude) {
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
      latitude,
      longitude,
      gender,
    });
  };
  useEffect(() => {
    if (result && window.innerWidth < 768 && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [result]);

  return (
    <>
      <Helmet>
        <title>
          Free Baby Name Suggester | Vedic Astrology Based Baby Names -
          AstroTick
        </title>
        <meta
          name="description"
          content="Free Baby Name Suggester - Get auspicious baby names based on nakshatra, numerology, and Vedic astrology principles. 27 Nakshatra database with Sanskrit meanings."
        />
        <meta
          name="keywords"
          content="free baby names, nakshatra baby names, Vedic baby names, auspicious baby names, Sanskrit baby names, numerology baby names"
        />
        <link rel="canonical" href="https://astrotick.com/baby-naming" />

        {/* Open Graph */}
        <meta
          property="og:title"
          content="Free Baby Name Suggester - AstroTick"
        />
        <meta
          property="og:description"
          content="Free Baby Name Suggester - Get auspicious baby names based on nakshatra, numerology, and Vedic astrology principles."
        />
        <meta property="og:url" content="https://astrotick.com/baby-naming" />
        <meta property="og:type" content="website" />

        {/* Twitter */}
        <meta
          name="twitter:title"
          content="Free Baby Name Suggester - AstroTick"
        />
        <meta
          name="twitter:description"
          content="Free Baby Name Suggester - Get auspicious baby names based on nakshatra and Vedic astrology."
        />

        {/* Schema.org structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Free Baby Name Suggester",
            description:
              "Get auspicious baby names based on nakshatra, numerology, and Vedic astrology",
            url: "https://astrotick.com/baby-naming",
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
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full mb-6 shadow-2xl">
                <Baby className="h-12 w-12 text-white" />
              </div>
              <h1 className="text-2xl md:text-5xl font-bold text-gray-900 mb-4">
                Free Baby Name Suggester
              </h1>
              <p className="md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Get auspicious baby names based on nakshatra, numerology, and
                Vedic astrology principles.
              </p>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 justify-center text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Authentic Vedic Calculations</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>27 Nakshatra Database</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Sanskrit Meanings</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Baby Details Form */}
              <div className="lg:col-span-1">
                <Card className="shadow-xl border-amber-500 bg-white/80 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500  mb-5 rounded-t-lg">
                    <CardTitle className="text-2xl text-center text-white">
                      Enter Baby Details
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
                          value={birthPlace}
                          data-testid="input-birthPlace"
                          onChange={(location) => setBirthPlace(location)}
                          onLocationSelect={handleLocationSelect}
                          placeholder="Start typing city name..."
                          className="w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Gender</Label>
                        <Select
                          value={gender}
                          data-testid="select-gender"
                          onValueChange={setGender}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Boy</SelectItem>
                            <SelectItem value="female">Girl</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700"
                        disabled={mutation.isPending}
                      >
                        {mutation.isPending ? "Generating..." : "Suggest Names"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Middle Column - Astrological Analysis */}
              <div className="lg:col-span-1" ref={resultRef}>
                <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-2xl text-center text-mystical-blue">
                      Astrological Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {result ? (
                      <div className="space-y-6">
                        {/* Nakshatra Information */}
                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg border">
                          <h4 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                            Birth Nakshatra
                          </h4>
                          <div className="text-center">
                            <span className="text-2xl font-bold text-mystical-blue">
                              {result.nakshatra}
                            </span>
                            <p className="text-gray-600 mt-2 text-lg">
                              {result.nakshatraMeaning}
                            </p>
                          </div>
                        </div>

                        {/* Name Syllables */}
                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-lg border">
                          <h4 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                            Auspicious Name Syllables
                          </h4>
                          <p className="text-sm text-gray-600 text-center mb-4">
                            Names starting with these syllables are considered
                            auspicious for your birth nakshatra
                          </p>
                          <div className="flex flex-wrap gap-3 justify-center">
                            {result.nameSyllables?.map(
                              (syllable: string, index: number) => (
                                <span
                                  key={index}
                                  className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-medium text-lg"
                                >
                                  {syllable}
                                </span>
                              ),
                            )}
                          </div>
                        </div>

                        {/* Naming Guidance */}
                        {result.namingGuidance && (
                          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border">
                            <h4 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                              Naming Guidance
                            </h4>
                            <p className="text-gray-700 mb-3 text-center">
                              {result.namingGuidance.principle}
                            </p>
                            <p className="text-gray-600 text-sm text-center">
                              {result.namingGuidance.benefits}
                            </p>
                          </div>
                        )}

                        {/* Astrological Insights */}
                        {result.astrologyInsights && (
                          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border">
                            <h4 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                              Astrological Insights
                            </h4>
                            <p className="text-gray-700 mb-3 text-center">
                              {result.astrologyInsights.spiritualBenefits}
                            </p>
                            <p className="text-gray-600 text-sm italic text-center">
                              {
                                result.astrologyInsights
                                  .traditionalRecommendation
                              }
                            </p>
                          </div>
                        )}

                        {/* Names Display - 2 Column Layout */}
                        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-6 rounded-lg border">
                          <h4 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                            All Suggested Names (
                            {result.suggestedNames?.length || 0})
                          </h4>
                          <div className="grid grid-cols-1 gap-3">
                            {result.suggestedNames?.map(
                              (nameData: any, index: number) => (
                                <div
                                  key={index}
                                  className="p-4 bg-white rounded-lg border hover:shadow-md transition-shadow"
                                >
                                  <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                      <span className="font-bold text-mystical-blue text-lg">
                                        {nameData.name}
                                      </span>
                                      <p className="text-gray-700 text-sm mt-1">
                                        {nameData.meaning}
                                      </p>
                                      <div className="flex gap-3 mt-2 text-xs text-gray-500">
                                        <span>
                                          Numerology: {nameData.numerology}
                                        </span>
                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                                          {nameData.syllable}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="text-right ml-2">
                                      <div className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                        Auspicious
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-24">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-full blur-xl opacity-30 animate-pulse"></div>
                          <div className="relative bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full p-8 mx-auto w-fit">
                            <Baby className="h-20 w-20 text-mystical-blue mx-auto" />
                          </div>
                        </div>
                        <p className="text-gray-500 text-xl mt-8">
                          Enter baby's birth details to get name suggestions
                        </p>
                        <p className="text-gray-400 text-sm mt-2">
                          Astrological analysis will appear here
                        </p>

                        {/* Fun Facts */}
                        <div className="mt-12 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 max-w-md mx-auto">
                          <h4 className="text-lg font-semibold text-gray-900 mb-4">
                            Did You Know?
                          </h4>
                          <div className="space-y-3 text-sm text-gray-600">
                            <div className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span>
                                There are 27 nakshatras, each with unique
                                syllables for naming
                              </span>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span>
                                Each nakshatra influences personality traits and
                                life path
                              </span>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span>
                                Proper naming can enhance positive planetary
                                influences
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Educational Content */}
              <div className="lg:col-span-1">
                <div className="space-y-6">
                  {/* Why Nakshatra-Based Naming */}
                  <Card className="shadow-xl border-0 bg-gradient-to-r from-blue-50 to-indigo-50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-xl text-center text-mystical-blue">
                        Why Nakshatra-Based Naming?
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
                              Cosmic Harmony
                            </h5>
                            <p className="text-gray-600 text-sm">
                              Names aligned with birth nakshatra create harmony
                              between the child and cosmic energies
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
                              Positive Vibrations
                            </h5>
                            <p className="text-gray-600 text-sm">
                              Sacred syllables enhance positive planetary
                              influences and spiritual growth
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
                              Traditional Wisdom
                            </h5>
                            <p className="text-gray-600 text-sm">
                              Based on thousands of years of Vedic knowledge and
                              astronomical observations
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Naming Tips */}
                  <Card className="shadow-xl border-0 bg-gradient-to-r from-amber-50 to-orange-50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-xl text-center text-mystical-blue">
                        Naming Tips
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <span className="text-gray-700 text-sm">
                            Birth time accuracy is crucial for precise nakshatra
                            calculation
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <span className="text-gray-700 text-sm">
                            Consider family traditions while choosing from
                            suggestions
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <span className="text-gray-700 text-sm">
                            Consult with elders for final name selection
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <span className="text-gray-700 text-sm">
                            Each suggested name includes meaning and numerology
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
                Need More Detailed Analysis?
              </h3>
              <p className="text-lg mb-6 opacity-90">
                Get comprehensive birth chart analysis and detailed predictions
                for your baby's future
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="/premium-report"
                  className="bg-white text-mystical-blue px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Premium Birth Chart
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
