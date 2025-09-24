import { useState, useEffect } from "react";
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
import { Hash, Calendar, Clock, User, MapPin, Users, Star } from "lucide-react";
import { useRef } from "react";

export default function LuckyNumbers() {
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

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest(
        "POST",
        "/api/calculate-lucky-numbers",
        data,
      );
      return response;
    },
    onSuccess: (data) => {
      if (data.success) {
        setResult(data.data);
        toast({
          title: "Lucky Numbers Generated",
          description: "Your personalized lucky numbers are ready",
        });
      } else {
        toast({
          title: "Generation Failed",
          description: data.message || "Unable to generate lucky numbers",
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate lucky numbers. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleLocationSelect = (location: any) => {
    console.log("LuckyNumbers location selected:", location);

    setFormData({
      ...formData,
      birthPlace:
        location.display ||
        location.name ||
        location.place_name ||
        location.display_name,
      latitude: location.latitude?.toString() || "",
      longitude: location.longitude?.toString() || "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.gender ||
      !formData.birthDate ||
      !formData.birthTime ||
      !formData.birthPlace
    ) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    mutation.mutate(formData);
  };
  useEffect(() => {
    if (result && window.innerWidth < 768 && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [result]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <AstroTickHeader />
      <main className="container mx-auto px-4 py-12 pt-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-amber-500 to-orange-500  rounded-full mb-8 shadow-lg">
              <Star className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-2xl md:text-5xl font-bold text-gray-900 mb-6">
              Lucky Numbers Calculator
            </h1>
            <p className="md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover your personalized lucky numbers, colors, and days based
              on authentic Vedic numerology and planetary influences.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
            {/* Form Column */}
            <div className="lg:col-span-3">
              <Card className="shadow-2xl border-amber-500 bg-white/90 backdrop-blur-sm sticky top-28">
                <CardHeader className="pb-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-t-lg mb-5">
                  <CardTitle className="text-xl text-center text-white font-bold">
                    Enter Birth Details
                  </CardTitle>
                  <p className="text-center text-gray-600 text-sm text-white mt-1">
                    All fields are required for accurate calculation
                  </p>
                </CardHeader>
                <CardContent className="pt-0">
                  <form onSubmit={handleSubmit} className="space-y-4 ">
                    <div className="space-y-2">
                      <Label
                        htmlFor="name"
                        className="flex items-center md:mt-5 gap-2"
                      >
                        <User className="h-4 w-4" />
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        data-testid="input-fullName"
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="Enter your full name"
                        required
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
                        data-testid="select-gender"
                        onValueChange={(value) =>
                          setFormData({ ...formData, gender: value })
                        }
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
                        className="flex items-center gap-2"
                      >
                        <Calendar className="h-4 w-4" />
                        Birth Date
                      </Label>
                      <div className="grid grid-cols-3 gap-2">
                        {/* Day */}
                        <Select
                          value={formData.birthDate.split("-")[2] || ""}
                          onValueChange={(day) => {
                            const [y, m] = formData.birthDate.split("-") || [
                              "",
                              "",
                            ];
                            setFormData({
                              ...formData,
                              birthDate: `${y || "2000"}-${m || "01"}-${day}`,
                            });
                          }}
                        >
                          <SelectTrigger>
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
                          value={formData.birthDate.split("-")[1] || ""}
                          onValueChange={(month) => {
                            const [y, , d] = formData.birthDate.split("-") || [
                              "",
                              "",
                              "",
                            ];
                            setFormData({
                              ...formData,
                              birthDate: `${y || "2000"}-${month}-${d || "01"}`,
                            });
                          }}
                        >
                          <SelectTrigger>
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
                          value={formData.birthDate.split("-")[0] || ""}
                          onValueChange={(year) => {
                            const [, m, d] = formData.birthDate.split("-") || [
                              "",
                              "",
                              "",
                            ];
                            setFormData({
                              ...formData,
                              birthDate: `${year}-${m || "01"}-${d || "01"}`,
                            });
                          }}
                        >
                          <SelectTrigger>
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
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="birthTime"
                        className="flex items-center gap-2"
                      >
                        <Clock className="h-4 w-4" />
                        Birth Time
                      </Label>
                      <div className="grid grid-cols-2 gap-2">
                        {/* Hour */}
                        <Select
                          value={formData.birthTime.split(":")[0] || ""}
                          onValueChange={(hour) => {
                            const [, m] = formData.birthTime.split(":") || [
                              "",
                              "",
                            ];
                            setFormData({
                              ...formData,
                              birthTime: `${hour}:${m || "00"}`,
                            });
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Hour" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 24 }, (_, i) => (
                              <SelectItem
                                key={i}
                                value={String(i).padStart(2, "0")}
                              >
                                {i}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {/* Minute */}
                        <Select
                          value={formData.birthTime.split(":")[1] || ""}
                          onValueChange={(minute) => {
                            const [h] = formData.birthTime.split(":") || [
                              "",
                              "",
                            ];
                            setFormData({
                              ...formData,
                              birthTime: `${h || "00"}:${minute}`,
                            });
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Minute" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 60 }, (_, i) => (
                              <SelectItem
                                key={i}
                                value={String(i).padStart(2, "0")}
                              >
                                {String(i).padStart(2, "0")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                        data-testid="input-birthPlace"
                        onLocationSelect={handleLocationSelect}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 md:col-span-2"
                      disabled={mutation.isPending}
                    >
                      {mutation.isPending
                        ? "Generating..."
                        : "Generate Lucky Numbers"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Results Column */}
            <div className="lg:col-span-3" ref={resultRef}>
              <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl text-center text-mystical-blue font-bold">
                    Your Lucky Numbers Report
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {result ? (
                    <div className="space-y-6">
                      {/* Personal Information Header */}
                      <div className="bg-gradient-to-r from-violet-100 to-purple-100 rounded-lg p-6 text-center shadow-lg">
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                          Lucky Numbers Report
                        </h3>
                        <div className="text-gray-700 space-y-2">
                          <p className="text-lg font-semibold">
                            {result.birthDetails.name}
                          </p>
                          <p className="text-base">
                            Born on{" "}
                            {new Date(formData.birthDate).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              },
                            )}
                          </p>
                          <p className="text-base text-gray-600">
                            {result.birthDetails.birthPlace}
                          </p>
                        </div>
                      </div>

                      {/* Primary Lucky Numbers */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="text-center p-6 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg border shadow-md">
                          <h4 className="text-lg font-semibold text-gray-900 mb-3">
                            Primary Lucky Number
                          </h4>
                          <div className="text-5xl font-bold text-mystical-blue mb-2">
                            {result.primaryLuckyNumber}
                          </div>
                          <p className="text-gray-600 text-sm">
                            Life Path Power
                          </p>
                        </div>
                        <div className="text-center p-6 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg border shadow-md">
                          <h4 className="text-lg font-semibold text-gray-900 mb-3">
                            Secondary Lucky Number
                          </h4>
                          <div className="text-5xl font-bold text-mystical-blue mb-2">
                            {result.secondaryLuckyNumber}
                          </div>
                          <p className="text-gray-600 text-sm">
                            Name Vibration
                          </p>
                        </div>
                      </div>

                      {/* Life Path & Destiny Numbers */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="text-center p-6 bg-gradient-to-r from-purple-100 to-violet-100 rounded-lg border shadow-md">
                          <h4 className="text-lg font-semibold text-gray-900 mb-3">
                            Life Path Number
                          </h4>
                          <div className="text-5xl font-bold text-mystical-blue mb-2">
                            {result.lifePathNumber}
                          </div>
                          <p className="text-gray-600 text-sm">
                            Your spiritual journey
                          </p>
                        </div>
                        <div className="text-center p-6 bg-gradient-to-r from-rose-100 to-pink-100 rounded-lg border shadow-md">
                          <h4 className="text-lg font-semibold text-gray-900 mb-3">
                            Destiny Number
                          </h4>
                          <div className="text-5xl font-bold text-mystical-blue mb-2">
                            {result.destinyNumber}
                          </div>
                          <p className="text-gray-600 text-sm">
                            Your life mission
                          </p>
                        </div>
                      </div>

                      {/* All Lucky Numbers */}
                      <div className="space-y-4">
                        <h4 className="text-xl font-semibold text-gray-900 text-center">
                          All Lucky Numbers
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {result.allLuckyNumbers.map(
                            (number: number, index: number) => (
                              <div
                                key={index}
                                className="text-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 shadow-sm"
                              >
                                <div className="text-xl font-bold text-mystical-blue">
                                  {number}
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      </div>

                      {/* Lucky Colors */}
                      <div className="space-y-4">
                        <h4 className="text-xl font-semibold text-gray-900 text-center">
                          Lucky Colors
                        </h4>
                        <div className="flex flex-wrap justify-center gap-3">
                          {result.luckyColors.map(
                            (color: string, index: number) => (
                              <div
                                key={index}
                                className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full text-base font-medium text-gray-800 shadow-sm border border-purple-200"
                              >
                                {color}
                              </div>
                            ),
                          )}
                        </div>
                      </div>

                      {/* Lucky Days */}
                      <div className="space-y-4">
                        <h4 className="text-xl font-semibold text-gray-900 text-center">
                          Lucky Days
                        </h4>
                        <div className="flex flex-wrap justify-center gap-3">
                          {result.luckyDays.map(
                            (day: string, index: number) => (
                              <div
                                key={index}
                                className="px-4 py-2 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-full text-base font-medium text-gray-800 shadow-sm border border-orange-200"
                              >
                                {day}
                              </div>
                            ),
                          )}
                        </div>
                      </div>

                      {/* Number Meanings */}
                      <div className="space-y-4">
                        <h4 className="text-xl font-semibold text-gray-900 text-center">
                          Number Meanings
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200 shadow-sm">
                            <h5 className="text-base font-semibold text-gray-900 mb-3">
                              Primary Number Meaning
                            </h5>
                            <p className="text-sm text-gray-700">
                              {result.numberMeanings.primary}
                            </p>
                          </div>
                          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200 shadow-sm">
                            <h5 className="text-base font-semibold text-gray-900 mb-3">
                              Secondary Number Meaning
                            </h5>
                            <p className="text-sm text-gray-700">
                              {result.numberMeanings.secondary}
                            </p>
                          </div>
                          <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg p-4 border border-purple-200 shadow-sm">
                            <h5 className="text-base font-semibold text-gray-900 mb-3">
                              Life Path Number Meaning
                            </h5>
                            <p className="text-sm text-gray-700">
                              {result.numberMeanings.lifePathMeaning}
                            </p>
                          </div>
                          <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg p-4 border border-rose-200 shadow-sm">
                            <h5 className="text-base font-semibold text-gray-900 mb-3">
                              Destiny Number Meaning
                            </h5>
                            <p className="text-sm text-gray-700">
                              {result.numberMeanings.destinyMeaning}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Numerology Insights */}
                      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 border border-indigo-200 shadow-sm">
                        <h4 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                          Numerology Insights
                        </h4>
                        <div className="space-y-4">
                          <div className="bg-white/50 rounded p-4">
                            <p className="text-sm text-gray-700">
                              {result.numerologyInsights.lifePathMeaning}
                            </p>
                          </div>
                          <div className="bg-white/50 rounded p-4">
                            <p className="text-sm text-gray-700">
                              {result.numerologyInsights.nameMeaning}
                            </p>
                          </div>
                          <div className="bg-white/50 rounded p-4">
                            <p className="text-sm text-gray-700">
                              {result.numerologyInsights.compatibility}
                            </p>
                          </div>
                          {result.numerologyInsights.nakshatraInfluence && (
                            <div className="bg-green-100/50 rounded p-4 border-l-4 border-green-500">
                              <p className="text-sm text-gray-800 font-medium">
                                {result.numerologyInsights.nakshatraInfluence}
                              </p>
                            </div>
                          )}
                          {result.numerologyInsights.lunarConnection && (
                            <div className="bg-blue-100/50 rounded p-4 border-l-4 border-blue-500">
                              <p className="text-sm text-gray-800 font-medium">
                                {result.numerologyInsights.lunarConnection}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Calculation Details */}
                      {result.calculation_details && (
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-6 border border-amber-200 shadow-sm">
                          <h4 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                            Calculation Details
                          </h4>
                          <div className="space-y-4">
                            <div className="bg-white/50 rounded p-4">
                              <p className="text-sm text-gray-700">
                                <span className="font-semibold">Method:</span>{" "}
                                {result.calculation_details.method
                                  .replace(/_/g, " ")
                                  .replace(/\b\w/g, (letter: string) =>
                                    letter.toUpperCase(),
                                  )}
                              </p>
                            </div>
                            {result.calculation_details.jyotisha_enhanced && (
                              <div className="bg-green-100/50 rounded p-4 border-l-4 border-green-500">
                                <p className="text-sm text-green-800 font-semibold">
                                  ✅ Enhanced with authentic Jyotisha
                                  astronomical calculations
                                </p>
                              </div>
                            )}
                            {result.calculation_details.nakshatra_used && (
                              <div className="bg-white/50 rounded p-4">
                                <p className="text-sm text-gray-700">
                                  <span className="font-semibold">
                                    Nakshatra:
                                  </span>{" "}
                                  {result.calculation_details.nakshatra_used}
                                </p>
                              </div>
                            )}
                            {result.calculation_details.moon_sign_used && (
                              <div className="bg-white/50 rounded p-4">
                                <p className="text-sm text-gray-700">
                                  <span className="font-semibold">
                                    Moon Sign:
                                  </span>{" "}
                                  {result.calculation_details.moon_sign_used}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Star className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">
                        Enter your birth details to generate personalized lucky
                        numbers
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Three Vertical Sections */}
          <div className="mt-16 space-y-8">
            {/* Understanding Lucky Numbers */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-lg">
              <h3 className="text-3xl font-bold text-center text-gray-900 mb-8">
                Understanding Lucky Numbers
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <h4 className="text-xl font-semibold text-mystical-blue mb-4">
                    What are Lucky Numbers?
                  </h4>
                  <p className="text-gray-700 text-base leading-relaxed">
                    Lucky numbers are calculated based on your birth date and
                    name using ancient numerological principles. These numbers
                    carry special vibrations that can enhance your fortune and
                    success.
                  </p>
                </div>
                <div className="text-center">
                  <h4 className="text-xl font-semibold text-mystical-blue mb-4">
                    How to Use Them?
                  </h4>
                  <p className="text-gray-700 text-base leading-relaxed">
                    Use your lucky numbers for important decisions, lottery
                    tickets, house numbers, phone numbers, or any significant
                    choices. They align with your personal energy patterns.
                  </p>
                </div>
                <div className="text-center">
                  <h4 className="text-xl font-semibold text-mystical-blue mb-4">
                    Scientific Approach
                  </h4>
                  <p className="text-gray-700 text-base leading-relaxed">
                    Our calculations combine Pythagorean numerology with Vedic
                    principles, analyzing name vibrations and birth date
                    patterns to reveal your most harmonious numbers.
                  </p>
                </div>
              </div>
            </div>

            {/* Premium Features */}
            <div className="bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-xl p-8 shadow-lg">
              <h3 className="text-3xl font-bold text-center text-gray-900 mb-8">
                Premium Features
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mb-4 shadow-lg">
                    <Star className="h-10 w-10 text-white" />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-4">
                    Jyotisha Integration
                  </h4>
                  <p className="text-gray-700 text-base leading-relaxed">
                    Enhanced with authentic Vedic astronomical calculations for
                    precise numerological insights
                  </p>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full mb-4 shadow-lg">
                    <Hash className="h-10 w-10 text-white" />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-4">
                    Comprehensive Analysis
                  </h4>
                  <p className="text-gray-700 text-base leading-relaxed">
                    Complete numerological profile including colors, days,
                    meanings, and compatibility
                  </p>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full mb-4 shadow-lg">
                    <Calendar className="h-10 w-10 text-white" />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-4">
                    Personal Guidance
                  </h4>
                  <p className="text-gray-700 text-base leading-relaxed">
                    Personalized insights based on your unique birth chart and
                    planetary positions
                  </p>
                </div>
              </div>
            </div>

            {/* How to Use Your Lucky Numbers */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-8 shadow-lg">
              <h3 className="text-3xl font-bold text-center text-gray-900 mb-8">
                How to Use Your Lucky Numbers
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-4">
                    Daily Applications
                  </h4>
                  <ul className="space-y-3 text-gray-700 text-base">
                    <li className="flex items-start">
                      <span className="text-green-600 mr-3 text-xl">•</span>
                      <span>
                        Use lucky numbers for important phone numbers and
                        addresses
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-3 text-xl">•</span>
                      <span>
                        Choose these numbers for lottery tickets and games
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-3 text-xl">•</span>
                      <span>Schedule important events on your lucky days</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-3 text-xl">•</span>
                      <span>
                        Wear your lucky colors during important occasions
                      </span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-4">
                    Business & Finance
                  </h4>
                  <ul className="space-y-3 text-gray-700 text-base">
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-3 text-xl">•</span>
                      <span>
                        Incorporate lucky numbers in business names and branding
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-3 text-xl">•</span>
                      <span>
                        Choose account numbers and PINs with lucky digits
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-3 text-xl">•</span>
                      <span>Launch new ventures on favorable days</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-3 text-xl">•</span>
                      <span>Use lucky numbers for investment decisions</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Need More Detailed Analysis Card */}
          <div className="mt-12 bg-gradient-to-r from-violet-100 to-purple-100 rounded-xl p-6 sm:p-8 shadow-lg border border-purple-200">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-violet-600 rounded-full mb-6 shadow-lg">
                <Star className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Need More Detailed Analysis?
              </h3>
              <p className="text-gray-700 text-lg mb-6 max-w-2xl mx-auto">
                Get a comprehensive premium report with detailed birth chart
                analysis, planetary influences, and personalized predictions for
                your life path.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => (window.location.href = "/premium-report")}
                  className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-purple-600 to-violet-700 text-white font-semibold rounded-lg shadow-lg hover:from-purple-700 hover:to-violet-800 transition-all duration-300 transform hover:scale-105"
                >
                  Get Premium Report
                </button>
                <button
                  onClick={() => (window.location.href = "/astrologers")}
                  className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-semibold rounded-lg shadow-lg hover:from-emerald-700 hover:to-teal-800 transition-all duration-300 transform hover:scale-105"
                >
                  Chat with Expert
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
