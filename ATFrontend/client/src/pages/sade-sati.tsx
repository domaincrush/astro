import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "src/components/ui/form";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";
import { LocationSearch } from "src/components/LocationSearch";
import { apiRequest } from "src/lib/queryClient";
import { useToast } from "src/hooks/use-toast";
import {
  User,
  MapPin,
  Clock,
  AlertTriangle,
  Star,
  TrendingUp,
  Shield,
  Calendar,
} from "lucide-react";
import { useRef } from "react";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  gender: z.enum(["male", "female"]),
  birthDate: z.string().min(1, "Birth date is required"),
  birthTime: z.string().min(1, "Birth time is required"),
  birthPlace: z.string().min(1, "Birth place is required"),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface SadeSatiResult {
  personalInfo: {
    name: string;
    gender: string;
    birthDate: string;
    birthTime: string;
    birthPlace: string;
  };
  moonSign: string;
  currentStatus: {
    isInSadeSati: boolean;
    currentPhase: string;
    phaseDescription: string;
    remainingDuration: string;
    intensityLevel: string;
  };
  sadeSatiPeriods: {
    phase: string;
    startDate: string;
    endDate: string;
    duration: string;
    description: string;
    effects: string[];
    remedies: string[];
  }[];
  overallAnalysis: {
    totalDuration: string;
    mostIntensePhase: string;
    generalEffects: string[];
    lifeAreas: string[];
  };
  remedies: {
    daily: string[];
    weekly: string[];
    special: string[];
    gemstones: string[];
    mantras: string[];
  };
  calculationDetails: {
    method: string;
    saturnPosition: string;
    moonPosition: string;
    ayanamsa: string;
  };
}

export default function SadeSati() {
  const [result, setResult] = useState<SadeSatiResult | null>(null);
  const { toast } = useToast();
  const resultRef = useRef<HTMLDivElement | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    gender: "male",
    birthDate: "",
    birthTime: "",
    birthPlace: "",
    latitude: undefined,
    longitude: undefined,
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: formData,
  });

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      console.log("🔍 Sade Sati submission data:", data);
      const response = await apiRequest(
        "POST",
        "/api/calculate-sade-sati",
        data,
      );
      console.log("✅ Sade Sati API response:", response);
      return response;
    },
    onSuccess: (data) => {
      console.log("✅ Sade Sati mutation success:", data);
      setResult(data.data);
      toast({
        title: "Sade Sati Analysis Complete",
        description:
          "Your Saturn transit analysis has been calculated successfully",
      });
    },
    onError: (error) => {
      console.error("❌ Sade Sati mutation error:", error);
      toast({
        title: "Calculation Failed",
        description:
          "Failed to calculate Sade Sati analysis. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    // data.birthDate = "DD-MM-YYYY"
    let apiDate = data.birthDate;
    if (apiDate.includes("-")) {
      const [d, m, y] = apiDate.split("-");
      apiDate = `${y}-${m}-${d}`; // YYYY-MM-DD for backend
    }

    // data.birthTime = "HH:mm"
    let apiTime = data.birthTime;
    if (apiTime && apiTime.split(":").length === 2) {
      apiTime = `${apiTime}:00`; // add seconds
    }

    const completeData = {
      ...data,
      birthDate: apiDate,
      birthTime: apiTime,
      latitude: form.getValues("latitude"),
      longitude: form.getValues("longitude"),
    };

    console.log("📝 Final normalized submission:", completeData);
    mutation.mutate(completeData);
  };
  useEffect(() => {
    if (result && window.innerWidth < 768 && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [result]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <AstroTickHeader />
      <main className="pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-500 to-red-600 rounded-full mb-6 shadow-lg">
              <AlertTriangle className="h-10 w-10 text-white" />
            </div>
            <h1 className="md:text-4xl text-2xl md:text-5xl font-bold text-gray-900 mb-6">
              Sade Sati Calculator
            </h1>
            <p className="md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Discover your Saturn's 7.5-year transit period and understand its
              impact on your life with authentic Vedic calculations and
              personalized remedies.
            </p>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            {/* Form Column */}
            <Card className="lg:col-span-2 shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-4 bg-gradient-to-r from-amber-500 to-orange-500 mb-5 rounded-t-lg">
                <CardTitle className="text-xl text-center text-white font-bold ">
                  Enter Birth Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex md:mt-5 items-center gap-2">
                            <User className="h-4 w-4" />
                            Full Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your full name"
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
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem
                                value="female"
                                data-testid="select-gender"
                              >
                                Female
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="birthDate"
                      render={({ field }) => (
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
                                value={field.value?.split("-")[0] || ""}
                                onChange={(e) => {
                                  const [d, m, y] = field.value?.split("-") || [
                                    "",
                                    "",
                                    "",
                                  ];
                                  field.onChange(`${e.target.value}-${m}-${y}`);
                                }}
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
                                value={field.value?.split("-")[1] || ""}
                                onChange={(e) => {
                                  const [d, m, y] = field.value?.split("-") || [
                                    "",
                                    "",
                                    "",
                                  ];
                                  field.onChange(`${d}-${e.target.value}-${y}`);
                                }}
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
                                value={field.value?.split("-")[2] || ""}
                                onChange={(e) => {
                                  const [d, m, y] = field.value?.split("-") || [
                                    "",
                                    "",
                                    "",
                                  ];
                                  field.onChange(`${d}-${m}-${e.target.value}`);
                                }}
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
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="birthTime"
                      render={({ field }) => (
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
                                value={field.value?.split(":")[0] || ""}
                                onChange={(e) => {
                                  const [h, m] = field.value?.split(":") || [
                                    "",
                                    "",
                                  ];
                                  field.onChange(`${e.target.value}:${m}`);
                                }}
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
                                value={field.value?.split(":")[1] || ""}
                                onChange={(e) => {
                                  const [h, m] = field.value?.split(":") || [
                                    "",
                                    "",
                                  ];
                                  field.onChange(`${h}:${e.target.value}`);
                                }}
                              >
                                <option value="">Minute</option>
                                {Array.from({ length: 60 }, (_, i) => (
                                  <option
                                    key={i}
                                    value={String(i).padStart(2, "0")}
                                  >
                                    {i}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
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
                              onChange={(value) => {
                                field.onChange(value);
                                form.setValue("birthPlace", value);
                              }}
                              data-testid="input-birthPlace"
                              onLocationSelect={(location) => {
                                console.log(
                                  "Sade Sati location selected:",
                                  location,
                                );

                                const place =
                                  location.place ||
                                  location.place_name ||
                                  location.display ||
                                  location.display_name;

                                // update birthPlace
                                field.onChange(place);
                                form.setValue("birthPlace", place);

                                // update coordinates
                                if (location.latitude && location.longitude) {
                                  form.setValue(
                                    "latitude",
                                    String(location.latitude),
                                  );
                                  form.setValue(
                                    "longitude",
                                    String(location.longitude),
                                  );
                                }
                              }}
                              placeholder="Enter your birth city..."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 md:col-span-2"
                      disabled={mutation.isPending}
                    >
                      {mutation.isPending
                        ? "Calculating..."
                        : "Calculate Sade Sati"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Results Column */}
            <div className="lg:col-span-2">
              <Card
                className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm"
                ref={resultRef}
              >
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl text-center text-orange-600 font-bold">
                    Your Sade Sati Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {result ? (
                    <div className="space-y-6">
                      {/* Personal Information Header */}
                      <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-lg p-6 text-center shadow-lg">
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                          Sade Sati Analysis
                        </h3>
                        <div className="text-gray-700 space-y-2">
                          <p className="text-lg font-semibold">
                            {result.personalInfo?.name}
                          </p>
                          <p className="text-base">
                            Born on{" "}
                            {new Date(
                              result.personalInfo.birthDate,
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                          <p className="text-base text-gray-600">
                            {result.personalInfo.birthPlace}
                          </p>
                          <div className="mt-4 p-3 bg-white/50 rounded-lg">
                            <p className="text-base font-semibold">
                              Moon Sign: {result.moonSign}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Current Status */}
                      <div
                        className={`rounded-lg p-6 text-center shadow-lg ${
                          result.currentStatus.isInSadeSati
                            ? "bg-gradient-to-r from-red-100 to-pink-100 border-2 border-red-200"
                            : "bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-200"
                        }`}
                      >
                        <div className="flex items-center justify-center mb-4">
                          {result.currentStatus.isInSadeSati ? (
                            <AlertTriangle className="h-8 w-8 text-red-600" />
                          ) : (
                            <Shield className="h-8 w-8 text-green-600" />
                          )}
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 mb-3">
                          Current Status
                        </h4>
                        <div className="space-y-2">
                          <p
                            className={`text-lg font-semibold ${
                              result.currentStatus.isInSadeSati
                                ? "text-red-800"
                                : "text-green-800"
                            }`}
                          >
                            {result.currentStatus.isInSadeSati
                              ? "Currently in Sade Sati"
                              : "Not in Sade Sati"}
                          </p>
                          <p className="text-base text-gray-700">
                            {result.currentStatus.phaseDescription}
                          </p>
                          {result.currentStatus.remainingDuration && (
                            <p className="text-base text-gray-600">
                              <span className="font-semibold">
                                Remaining Duration:
                              </span>{" "}
                              {result.currentStatus.remainingDuration}
                            </p>
                          )}
                          <p className="text-base text-gray-600">
                            <span className="font-semibold">
                              Intensity Level:
                            </span>{" "}
                            {result.currentStatus.intensityLevel}
                          </p>
                        </div>
                      </div>

                      {/* Sade Sati Periods */}
                      <div className="space-y-4">
                        <h4 className="text-2xl font-semibold text-gray-900 text-center">
                          Sade Sati Periods
                        </h4>
                        <div className="space-y-4">
                          {result.sadeSatiPeriods.map((period, index) => (
                            <div
                              key={index}
                              className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-6 border border-orange-200 shadow-sm"
                            >
                              <div className="flex items-center justify-between mb-4">
                                <h5 className="text-lg font-semibold text-gray-900">
                                  {period.phase}
                                </h5>
                                <span className="text-sm text-gray-600 bg-white/50 px-3 py-1 rounded-full">
                                  {period.duration}
                                </span>
                              </div>
                              <div className="space-y-3">
                                <div className="flex justify-between text-sm text-gray-600">
                                  <span>Start: {period.startDate}</span>
                                  <span>End: {period.endDate}</span>
                                </div>
                                <p className="text-base text-gray-700">
                                  {period.description}
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <h6 className="font-semibold text-gray-900 mb-2">
                                      Effects:
                                    </h6>
                                    <ul className="space-y-1 text-sm text-gray-700">
                                      {period.effects.map((effect, i) => (
                                        <li
                                          key={i}
                                          className="flex items-start"
                                        >
                                          <span className="text-orange-600 mr-2">
                                            •
                                          </span>
                                          {effect}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                  <div>
                                    <h6 className="font-semibold text-gray-900 mb-2">
                                      Remedies:
                                    </h6>
                                    <ul className="space-y-1 text-sm text-gray-700">
                                      {period.remedies.map((remedy, i) => (
                                        <li
                                          key={i}
                                          className="flex items-start"
                                        >
                                          <span className="text-green-600 mr-2">
                                            •
                                          </span>
                                          {remedy}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Overall Analysis */}
                      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-6 border border-purple-200 shadow-sm">
                        <h4 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                          Overall Analysis
                        </h4>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white/50 rounded p-4">
                              <p className="text-sm text-gray-700">
                                <span className="font-semibold">
                                  Total Duration:
                                </span>{" "}
                                {result.overallAnalysis.totalDuration}
                              </p>
                            </div>
                            <div className="bg-white/50 rounded p-4">
                              <p className="text-sm text-gray-700">
                                <span className="font-semibold">
                                  Most Intense Phase:
                                </span>{" "}
                                {result.overallAnalysis.mostIntensePhase}
                              </p>
                            </div>
                          </div>
                          <div>
                            <h6 className="font-semibold text-gray-900 mb-2">
                              General Effects:
                            </h6>
                            <ul className="space-y-1 text-sm text-gray-700">
                              {result.overallAnalysis.generalEffects.map(
                                (effect, i) => (
                                  <li key={i} className="flex items-start">
                                    <span className="text-purple-600 mr-2">
                                      •
                                    </span>
                                    {effect}
                                  </li>
                                ),
                              )}
                            </ul>
                          </div>
                          <div>
                            <h6 className="font-semibold text-gray-900 mb-2">
                              Life Areas Affected:
                            </h6>
                            <div className="flex flex-wrap gap-2">
                              {result.overallAnalysis.lifeAreas.map(
                                (area, i) => (
                                  <span
                                    key={i}
                                    className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                                  >
                                    {area}
                                  </span>
                                ),
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Remedies */}
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200 shadow-sm">
                        <h4 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                          Remedial Measures
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h6 className="font-semibold text-gray-900 mb-3">
                              Daily Remedies:
                            </h6>
                            <ul className="space-y-2 text-sm text-gray-700">
                              {result.remedies.daily.map((remedy, i) => (
                                <li key={i} className="flex items-start">
                                  <span className="text-green-600 mr-2">•</span>
                                  {remedy}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h6 className="font-semibold text-gray-900 mb-3">
                              Weekly Remedies:
                            </h6>
                            <ul className="space-y-2 text-sm text-gray-700">
                              {result.remedies.weekly.map((remedy, i) => (
                                <li key={i} className="flex items-start">
                                  <span className="text-blue-600 mr-2">•</span>
                                  {remedy}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h6 className="font-semibold text-gray-900 mb-3">
                              Special Remedies:
                            </h6>
                            <ul className="space-y-2 text-sm text-gray-700">
                              {result.remedies.special.map((remedy, i) => (
                                <li key={i} className="flex items-start">
                                  <span className="text-purple-600 mr-2">
                                    •
                                  </span>
                                  {remedy}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h6 className="font-semibold text-gray-900 mb-3">
                              Gemstones & Mantras:
                            </h6>
                            <div className="space-y-2">
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  Gemstones:
                                </p>
                                <p className="text-sm text-gray-700">
                                  {result.remedies.gemstones.join(", ")}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  Mantras:
                                </p>
                                <ul className="space-y-1 text-sm text-gray-700">
                                  {result.remedies.mantras.map((mantra, i) => (
                                    <li key={i} className="italic">
                                      "{mantra}"
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Calculation Details */}
                      {result.calculationDetails && (
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-6 border border-amber-200 shadow-sm">
                          <h4 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                            Calculation Details
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white/50 rounded p-4">
                              <p className="text-sm text-gray-700">
                                <span className="font-semibold">Method:</span>{" "}
                                {result.calculationDetails.method}
                              </p>
                            </div>
                            <div className="bg-white/50 rounded p-4">
                              <p className="text-sm text-gray-700">
                                <span className="font-semibold">Ayanamsa:</span>{" "}
                                {result.calculationDetails.ayanamsa}
                              </p>
                            </div>
                            <div className="bg-white/50 rounded p-4">
                              <p className="text-sm text-gray-700">
                                <span className="font-semibold">
                                  Saturn Position:
                                </span>{" "}
                                {result.calculationDetails.saturnPosition}
                              </p>
                            </div>
                            <div className="bg-white/50 rounded p-4">
                              <p className="text-sm text-gray-700">
                                <span className="font-semibold">
                                  Moon Position:
                                </span>{" "}
                                {result.calculationDetails.moonPosition}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <AlertTriangle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">
                        Enter your birth details to analyze your Sade Sati
                        period
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Educational Sections */}
          <div className="mt-16 space-y-8">
            {/* Understanding Sade Sati */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-lg">
              <h3 className="text-3xl font-bold text-center text-gray-900 mb-8">
                Understanding Sade Sati
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <h4 className="text-xl font-semibold text-orange-600 mb-4">
                    What is Sade Sati?
                  </h4>
                  <p className="text-gray-700 text-base leading-relaxed">
                    Sade Sati is a 7.5-year period when Saturn transits over
                    your Moon sign and the signs immediately before and after
                    it. This is considered one of the most challenging periods
                    in Vedic astrology.
                  </p>
                </div>
                <div className="text-center">
                  <h4 className="text-xl font-semibold text-orange-600 mb-4">
                    Three Phases
                  </h4>
                  <p className="text-gray-700 text-base leading-relaxed">
                    Sade Sati consists of three phases: Rising (Emerging), Peak
                    (Peak intensity), and Setting (Departing). Each phase has
                    different effects and duration based on Saturn's movement.
                  </p>
                </div>
                <div className="text-center">
                  <h4 className="text-xl font-semibold text-orange-600 mb-4">
                    Purpose & Growth
                  </h4>
                  <p className="text-gray-700 text-base leading-relaxed">
                    While challenging, Sade Sati is designed to teach important
                    life lessons, build character, and remove obstacles that
                    prevent spiritual growth and material progress.
                  </p>
                </div>
              </div>
            </div>

            {/* Effects and Remedies */}
            <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-8 shadow-lg">
              <h3 className="text-3xl font-bold text-center text-gray-900 mb-8">
                Effects & Remedies
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-4">
                    Common Effects
                  </h4>
                  <ul className="space-y-3 text-gray-700 text-base">
                    <li className="flex items-start">
                      <span className="text-red-600 mr-3 text-xl">•</span>
                      <span>Delays and obstacles in career and business</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-600 mr-3 text-xl">•</span>
                      <span>Financial challenges and increased expenses</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-600 mr-3 text-xl">•</span>
                      <span>Health issues and mental stress</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-600 mr-3 text-xl">•</span>
                      <span>Relationship tensions and family problems</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-600 mr-3 text-xl">•</span>
                      <span>Spiritual awakening and life lessons</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-4">
                    Powerful Remedies
                  </h4>
                  <ul className="space-y-3 text-gray-700 text-base">
                    <li className="flex items-start">
                      <span className="text-green-600 mr-3 text-xl">•</span>
                      <span>Regular worship of Lord Shiva and Hanuman</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-3 text-xl">•</span>
                      <span>Chanting Saturn mantras and Hanuman Chalisa</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-3 text-xl">•</span>
                      <span>
                        Wearing blue sapphire or iron ring (after consultation)
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-3 text-xl">•</span>
                      <span>Charity to poor and elderly on Saturdays</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-3 text-xl">•</span>
                      <span>Meditation, yoga, and spiritual practices</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Need More Detailed Analysis Card */}
          <div className="mt-16 bg-gradient-to-r from-orange-100 to-red-100 rounded-xl p-8 shadow-lg border border-orange-200">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-500 to-red-600 rounded-full mb-6 shadow-lg">
                <Star className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Need More Detailed Analysis?
              </h3>
              <p className="text-gray-700 text-lg mb-6 max-w-2xl mx-auto">
                Get a comprehensive premium report with detailed planetary
                analysis, personalized predictions, and specific remedies for
                your Sade Sati period.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => (window.location.href = "/premium-report")}
                  className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-orange-600 to-red-700 text-white font-semibold rounded-lg shadow-lg hover:from-orange-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105"
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
