import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "src/components/ui/form";
import LocationSearch from "src/components/LocationSearch";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import { Footer } from "src/components/layout/Footer";
import {
  Loader2,
  BookOpen,
  Clock,
  MapPin,
  Calendar,
  AlertTriangle,
  Target,
  Shield,
  User,
  Star,
  Briefcase,
  Heart,
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "src/lib/queryClient";
import { useRef } from "react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  birthDate: z.string().min(1, "Birth date is required"),
  birthTime: z.string().min(1, "Birth time is required"),
  birthPlace: z.string().min(1, "Birth place is required"),
});

interface LalKitabResult {
  basicInfo: {
    name: string;
    birthDate: string;
    birthTime: string;
    birthPlace: string;
    moonSign: string;
    ascendant: string;
  };
  planetaryPositions: Array<{
    planet: string;
    house: number;
    sign: string;
    degree: string;
    lalKitabHouse: number;
    status: string;
    effects: string[];
  }>;
  lalKitabAnalysis: {
    strongPlanets: string[];
    weakPlanets: string[];
    beneficHouses: number[];
    maleficHouses: number[];
    karmaDebt: string[];
  };
  remedies: Array<{
    planet: string;
    issue: string;
    remedy: string;
    procedure: string;
    duration: string;
    cost: string;
  }>;
  predictions: {
    general: string;
    career: string;
    marriage: string;
    health: string;
    wealth: string;
    enemies: string;
  };
  totkas: Array<{
    purpose: string;
    procedure: string;
    materials: string[];
    timing: string;
    precautions: string[];
  }>;
}

export default function LalKitab() {
  const [result, setResult] = useState<LalKitabResult | null>(null);
  const resultRef = useRef<HTMLDivElement | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      birthDate: "",
      birthTime: "",
      birthPlace: "",
    },
  });

  const calculateMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const response = await apiRequest(
        "POST",
        "/api/lal-kitab/analysis",
        data,
      );
      return response;
    },
    onSuccess: (data) => {
      setResult(data);
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    calculateMutation.mutate(data);
  };
  useEffect(() => {
    if (result && window.innerWidth < 768 && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [result]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <AstroTickHeader />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent mb-4">
            Lal Kitab Horoscope
          </h1>
          <p className="md:text-xl text-gray-600 max-w-3xl mx-auto">
            Discover your karmic debts and get practical remedies based on the
            ancient wisdom of Lal Kitab astrology
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Input Form */}
          <Card className="bg-white/90 backdrop-blur-sm border-amber-200 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-6 w-6" />
                Birth Details for Lal Kitab Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your full name"
                            className="bg-white border-amber-200 focus:border-amber-500 focus:ring-amber-500/20"
                            {...field}
                            data-testid="input-fullName"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="birthDate"
                    render={({ field }) => {
                      const [y, m, d] = field.value?.split("-") || ["", "", ""];

                      return (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Birth Date
                          </FormLabel>
                          <FormControl>
                            <div className="grid grid-cols-3 gap-2">
                              {/* Day */}
                              <select
                                className="border rounded p-2"
                                value={d}
                                onChange={(e) =>
                                  field.onChange(`${y}-${m}-${e.target.value}`)
                                }
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
                                className="border rounded p-2"
                                value={m}
                                onChange={(e) =>
                                  field.onChange(`${y}-${e.target.value}-${d}`)
                                }
                              >
                                <option value="">Month</option>
                                {Array.from({ length: 12 }, (_, i) => (
                                  <option
                                    key={i + 1}
                                    value={String(i + 1).padStart(2, "0")}
                                  >
                                    {i + 1}
                                  </option>
                                ))}
                              </select>

                              {/* Year */}
                              <select
                                className="border rounded p-2"
                                value={y}
                                onChange={(e) =>
                                  field.onChange(`${e.target.value}-${m}-${d}`)
                                }
                              >
                                <option value="">Year</option>
                                {Array.from({ length: 120 }, (_, i) => {
                                  const year = new Date().getFullYear() - i;
                                  return (
                                    <option key={year} value={year}>
                                      {year}
                                    </option>
                                  );
                                })}
                              </select>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />

                  <FormField
                    control={form.control}
                    name="birthTime"
                    render={({ field }) => {
                      const [h, m] = field.value?.split(":") || ["", ""];

                      return (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Birth Time
                          </FormLabel>
                          <FormControl>
                            <div className="grid grid-cols-2 gap-2">
                              {/* Hour */}
                              <select
                                className="border rounded p-2"
                                value={h}
                                onChange={(e) =>
                                  field.onChange(`${e.target.value}:${m}`)
                                }
                              >
                                <option value="">Hour</option>
                                {Array.from({ length: 24 }, (_, i) => (
                                  <option
                                    key={i}
                                    value={String(i).padStart(2, "0")}
                                  >
                                    {i}
                                  </option>
                                ))}
                              </select>

                              {/* Minute */}
                              <select
                                className="border rounded p-2"
                                value={m}
                                onChange={(e) =>
                                  field.onChange(`${h}:${e.target.value}`)
                                }
                              >
                                <option value="">Minute</option>
                                {Array.from({ length: 60 }, (_, i) => (
                                  <option
                                    key={i}
                                    value={String(i).padStart(2, "0")}
                                  >
                                    {String(i).padStart(2, "0")}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />

                  <FormField
                    control={form.control}
                    name="birthPlace"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Birth Place
                        </FormLabel>
                        <FormControl>
                          <LocationSearch
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                            placeholder="Enter birth place"
                            className="bg-white border-amber-200 focus:border-amber-500 focus:ring-amber-500/20"
                            data-testid="input-birthPlace"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={calculateMutation.isPending}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white h-12 text-lg"
                  >
                    {calculateMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Analyzing Lal Kitab Chart...
                      </>
                    ) : (
                      <>
                        <BookOpen className="mr-2 h-5 w-5" />
                        Generate Lal Kitab Report
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Results */}
          {result && (
            <div className="space-y-6" ref={resultRef}>
              {/* Basic Info */}
              <Card className="bg-white/90 backdrop-blur-sm border-amber-200 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-semibold">{result.basicInfo.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Birth Date</p>
                      <p className="font-semibold">
                        {result.basicInfo.birthDate}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Moon Sign</p>
                      <p className="font-semibold">
                        {result.basicInfo.moonSign}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Ascendant</p>
                      <p className="font-semibold">
                        {result.basicInfo.ascendant}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Planetary Positions */}
              <Card className="bg-white/90 backdrop-blur-sm border-amber-200 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Planetary Positions & Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Planet</th>
                          <th className="text-left p-2">House</th>
                          <th className="text-left p-2">Sign</th>
                          <th className="text-left p-2">Degree</th>
                          <th className="text-left p-2">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.planetaryPositions.map((planet, index) => (
                          <tr key={index} className="border-b">
                            <td className="p-2 font-medium">{planet.planet}</td>
                            <td className="p-2">{planet.house}</td>
                            <td className="p-2">{planet.sign}</td>
                            <td className="p-2">{planet.degree}</td>
                            <td className="p-2">
                              <span
                                className={`px-2 py-1 rounded text-xs ${
                                  planet.status === "Strong"
                                    ? "bg-green-100 text-green-800"
                                    : planet.status === "Karmic Debt"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {planet.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Basic Analysis */}
              <Card className="bg-white/90 backdrop-blur-sm border-amber-200 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Lal Kitab Analysis Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-green-700 mb-2">
                        Strong Planets
                      </h4>
                      <div className="space-y-1">
                        {result.lalKitabAnalysis.strongPlanets.map(
                          (planet, index) => (
                            <div
                              key={index}
                              className="text-sm bg-green-100 px-2 py-1 rounded"
                            >
                              {planet}
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-orange-700 mb-2">
                        Needs Attention
                      </h4>
                      <div className="space-y-1">
                        {result.lalKitabAnalysis.weakPlanets.map(
                          (planet, index) => (
                            <div
                              key={index}
                              className="text-sm bg-orange-100 px-2 py-1 rounded"
                            >
                              {planet}
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Doshas */}
              {result.doshas && result.doshas.length > 0 && (
                <Card className="bg-white/90 backdrop-blur-sm border-amber-200 shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-red-500 to-orange-500 text-white">
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Detected Doshas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid gap-4">
                      {result.doshas.map((dosha: any, index: number) => (
                        <div
                          key={index}
                          className="p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-200"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-semibold text-red-800">
                              {dosha.name}
                            </h4>
                            <span
                              className={`px-2 py-1 text-xs rounded ${
                                dosha.severity === "Very High"
                                  ? "bg-red-600 text-white"
                                  : dosha.severity === "High"
                                    ? "bg-red-500 text-white"
                                    : "bg-yellow-500 text-white"
                              }`}
                            >
                              {dosha.severity}
                            </span>
                          </div>
                          <p className="text-sm text-red-700 mb-2">
                            {dosha.description}
                          </p>
                          <div className="text-xs text-gray-600">
                            <p>
                              <span className="font-semibold">Causes:</span>{" "}
                              {dosha.causes.join(", ")}
                            </p>
                            <p>
                              <span className="font-semibold">Effects:</span>{" "}
                              {dosha.effects.join(", ")}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Remedies */}
              <Card className="bg-white/90 backdrop-blur-sm border-amber-200 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-green-500 to-teal-500 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Dosha-Specific Remedies
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {result.remedies.map((remedy: any, index: number) => (
                      <div
                        key={index}
                        className="border-l-4 border-green-500 pl-4"
                      >
                        <h4 className="font-semibold text-gray-800">
                          {remedy.dosha}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {remedy.remedy}
                        </p>
                        <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-gray-500">
                          <span>
                            <strong>Mantra:</strong> {remedy.mantra}
                          </span>
                          <span>
                            <strong>Duration:</strong> {remedy.duration}
                          </span>
                          <span>
                            <strong>Items:</strong> {remedy.items}
                          </span>
                          <span>
                            <strong>Cost:</strong> {remedy.cost}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Lal Kitab Analysis Summary */}
              <Card className="bg-white/90 backdrop-blur-sm border-amber-200 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Lal Kitab Summary Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {result.lalKitabAnalysis.summary.map(
                      (point: string, index: number) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2"></div>
                          <p className="text-sm text-gray-700">{point}</p>
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Lucky Elements */}
              <Card className="bg-white/90 backdrop-blur-sm border-amber-200 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Lucky Elements & Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-orange-700 mb-3">
                        Lucky Numbers
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {result.planetaryPositions
                          .slice(0, 5)
                          .map((planet: any, index: number) => (
                            <span
                              key={index}
                              className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm"
                            >
                              {planet.house}
                            </span>
                          ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-orange-700 mb-3">
                        Lucky Colors
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {result.lalKitabAnalysis.strongPlanets.map(
                          (planet: string, index: number) => {
                            const colors = [
                              "Yellow",
                              "Orange",
                              "Red",
                              "Green",
                              "Blue",
                              "Purple",
                              "Pink",
                            ];
                            return (
                              <span
                                key={index}
                                className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm"
                              >
                                {colors[index % colors.length]}
                              </span>
                            );
                          },
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-orange-700 mb-3">
                        Lucky Days
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                          Thursday
                        </span>
                        <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                          Friday
                        </span>
                        <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                          Sunday
                        </span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-orange-700 mb-3">
                        Lucky Metals
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                          Gold
                        </span>
                        <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                          Silver
                        </span>
                        <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                          Copper
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Career & Financial Guidance */}
              <Card className="bg-white/90 backdrop-blur-sm border-amber-200 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Career & Financial Guidance
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-emerald-700 mb-2">
                        Career Recommendations
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-emerald-50 p-4 rounded-lg">
                          <h5 className="font-medium text-emerald-800">
                            Favorable Fields
                          </h5>
                          <p className="text-sm text-emerald-700 mt-1">
                            Based on your strong planets:{" "}
                            {result.lalKitabAnalysis.strongPlanets.join(", ")},
                            consider careers in education, counseling, or
                            leadership roles.
                          </p>
                        </div>
                        <div className="bg-teal-50 p-4 rounded-lg">
                          <h5 className="font-medium text-teal-800">
                            Business Timing
                          </h5>
                          <p className="text-sm text-teal-700 mt-1">
                            Your planetary positions suggest favorable periods
                            for starting new ventures. Avoid major decisions
                            during challenging planetary phases.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-emerald-700 mb-2">
                        Financial Guidance
                      </h4>
                      <div className="bg-gradient-to-r from-emerald-100 to-teal-100 p-4 rounded-lg">
                        <p className="text-sm text-gray-700">
                          Your Lal Kitab analysis indicates specific houses
                          affecting wealth and prosperity. Follow the
                          recommended remedies to enhance financial stability
                          and remove obstacles to success.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Relationship & Compatibility */}
              <Card className="bg-white/90 backdrop-blur-sm border-amber-200 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-pink-500 to-rose-500 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Relationship & Compatibility
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-pink-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-pink-700 mb-2">
                          Marriage Timing
                        </h4>
                        <p className="text-sm text-pink-600">
                          Your planetary positions indicate optimal marriage
                          periods. Consider the remedies for any detected doshas
                          affecting relationships.
                        </p>
                      </div>
                      <div className="bg-rose-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-rose-700 mb-2">
                          Compatibility Factors
                        </h4>
                        <p className="text-sm text-rose-600">
                          Moon sign ({result.basicInfo.moonSign}) and ascendant
                          ({result.basicInfo.ascendant}) are key factors for
                          relationship harmony.
                        </p>
                      </div>
                    </div>
                    {result.doshas.some(
                      (dosha: any) => dosha.name === "Mangal Dosha",
                    ) && (
                      <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                        <h4 className="font-semibold text-red-700 mb-2">
                          Marriage Considerations
                        </h4>
                        <p className="text-sm text-red-600">
                          Mangal Dosha detected in your chart. Follow the
                          prescribed remedies and consider matching with
                          compatible partners for harmonious relationships.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Health & Wellness */}
              <Card className="bg-white/90 backdrop-blur-sm border-amber-200 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-violet-500 to-purple-500 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Health & Wellness Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-violet-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-violet-700 mb-2">
                          Health Considerations
                        </h4>
                        <p className="text-sm text-violet-600">
                          Based on your planetary positions, pay attention to
                          areas ruled by planets in challenging houses. Regular
                          health checkups recommended.
                        </p>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-purple-700 mb-2">
                          Wellness Remedies
                        </h4>
                        <p className="text-sm text-purple-600">
                          Follow the prescribed mantras and rituals for overall
                          well-being. Maintain regular spiritual practices for
                          mental peace.
                        </p>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-violet-100 to-purple-100 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-2">
                        Prevention Tips
                      </h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Perform daily meditation and yoga practices</li>
                        <li>
                          • Follow dietary guidelines based on your moon sign
                        </li>
                        <li>
                          • Maintain regular sleep schedule for better planetary
                          alignment
                        </li>
                        <li>
                          • Use recommended gemstones and metals for protection
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Need More Detailed Analysis */}
              <Card className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 border-2 border-amber-300 shadow-2xl">
                <CardHeader className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Target className="h-6 w-6" />
                    Need More Detailed Analysis?
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">
                        Get Premium Lal Kitab Report
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Unlock deeper insights with our comprehensive
                        professional analysis
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-lg border border-amber-200 shadow-sm">
                        <h4 className="font-semibold text-amber-700 mb-2 flex items-center gap-2">
                          <BookOpen className="h-4 w-4" />
                          Premium Features
                        </h4>
                        <ul className="text-sm text-gray-700 space-y-1">
                          <li>• 15+ page detailed Lal Kitab analysis</li>
                          <li>• Year-wise predictions and timing</li>
                          <li>• Advanced karma correction remedies</li>
                          <li>• Specific totkas for immediate results</li>
                          <li>• Marriage compatibility analysis</li>
                          <li>• Business and career guidance</li>
                        </ul>
                      </div>

                      <div className="bg-white p-4 rounded-lg border border-orange-200 shadow-sm">
                        <h4 className="font-semibold text-orange-700 mb-2 flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Expert Consultation
                        </h4>
                        <ul className="text-sm text-gray-700 space-y-1">
                          <li>
                            • Personal consultation with Lal Kitab experts
                          </li>
                          <li>• Customized remedy recommendations</li>
                          <li>• Question-answer session</li>
                          <li>• Follow-up guidance and support</li>
                          <li>• Timing for important decisions</li>
                          <li>• Dosha-specific detailed solutions</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-4 rounded-lg border border-amber-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-amber-800">
                            Special Offer
                          </h4>
                          <p className="text-sm text-amber-700">
                            Get 20% off on your first premium report
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-amber-700">
                            ₹999
                          </p>
                          <p className="text-sm text-amber-600 line-through">
                            ₹1,249
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white h-12 text-lg font-semibold"
                        onClick={() => window.open("/premium-report", "_blank")}
                      >
                        <BookOpen className="mr-2 h-5 w-5" />
                        Get Premium Report
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 border-2 border-amber-400 text-amber-700 hover:bg-amber-50 h-12 text-lg font-semibold"
                        onClick={() => window.open("/astrologers", "_blank")}
                      >
                        <User className="mr-2 h-5 w-5" />
                        Consult Expert
                      </Button>
                    </div>

                    <div className="text-center">
                      <p className="text-xs text-gray-500">
                        ✨ Trusted by 50,000+ users • 100% Authentic Lal Kitab
                        Analysis • Money-back guarantee
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Lal Kitab Features */}
          {!result && (
            <Card className="bg-white/90 backdrop-blur-sm border-amber-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-red-500 to-pink-500 text-white">
                <CardTitle>Lal Kitab Specialties</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        Karmic Debt Analysis
                      </h4>
                      <p className="text-sm text-gray-600">
                        Identify past life karmas affecting current life
                        situations
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        Practical Remedies
                      </h4>
                      <p className="text-sm text-gray-600">
                        Simple, cost-effective remedies using everyday items
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        Totkas & Upays
                      </h4>
                      <p className="text-sm text-gray-600">
                        Powerful rituals for immediate relief and protection
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        Enemy & Friend Analysis
                      </h4>
                      <p className="text-sm text-gray-600">
                        Identify hidden enemies and true well-wishers
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        House-based Predictions
                      </h4>
                      <p className="text-sm text-gray-600">
                        Unique Lal Kitab house system for accurate predictions
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-amber-800">
                        About Lal Kitab
                      </h4>
                      <p className="text-sm text-amber-700">
                        Lal Kitab is a unique system of Vedic astrology that
                        emphasizes practical remedies and karma correction. It
                        provides simple solutions for complex life problems
                        using everyday materials.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
