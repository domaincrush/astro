import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLocation } from "wouter";
import { useAuth } from "src/hooks/useAuth";
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
  FileText,
  Clock,
  MapPin,
  Calendar,
  User,
  Heart,
  Briefcase,
  DollarSign,
  Activity,
  Star,
  Brain,
  Home,
  Sparkles,
  CheckCircle,
  TrendingUp,
  Shield,
  Target,
  Gift,
  Lightbulb,
  Download,
  Mail,
  CreditCard,
  AlertCircle,
  Lock,
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "src/lib/queryClient";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  birthDate: z.string().min(1, "Birth date is required"),
  birthTime: z.string().min(1, "Birth time is required"),
  birthPlace: z.string().min(1, "Birth place is required"),
});

interface LifeReportResult {
  success: boolean;
  calculationEngine: string;
  responseTime: string;
  basicInfo: {
    name: string;
    birthDate: string;
    birthTime: string;
    birthPlace: string;
    moonSign: string;
    ascendant: string;
    ascendantLord: string;
    sunSign: string;
    nakshatra: string;
    numerology: string;
    currentDasha: string;
    timezone: string;
  };
  birthDetails: {
    date: string;
    time: string;
    place: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  sections: {
    personalityTraits: {
      title: string;
      overview: string;
      strengths: string[];
      weaknesses: string[];
      characteristics: string[];
    };
    careerFinance: {
      title: string;
      overview: string;
      careerStrengths: string[];
      financialProspects: string[];
      businessSuitability: string[];
    };
    relationships: {
      title: string;
      overview: string;
      marriageProspects: string[];
      idealPartner: string[];
      familyLife: string[];
    };
    health: {
      title: string;
      overview: string;
      generalHealth: string[];
      vulnerableAreas: string[];
      precautions: string[];
    };
    lifePhases: {
      title: string;
      overview: string;
      earlyLife: string[];
      middleAge: string[];
      laterLife: string[];
    };
    luckyFactors: {
      title: string;
      overview: string;
      colors: string[];
      numbers: string[];
      gemstones: string[];
      directions: string[];
      days: string[];
    };
    remedies: {
      title: string;
      overview: string;
      dailyPractices: string[];
      planetaryRemedies: Array<{
        planet: string;
        remedy: string;
        mantra?: string;
        gemstone?: string;
        timing?: string;
      }>;
      gemstones: {
        primary: string;
        alternative: string;
      };
      luckyColors: string[];
    };
  };
}

export default function LifeReport() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [result, setResult] = useState<LifeReportResult | null>(null);
  const [coordinates, setCoordinates] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [pricing, setPricing] = useState<any>(null);
  const [emailAddress, setEmailAddress] = useState("");

  // Move all hooks to the top to prevent conditional hook calls
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      birthDate: "",
      birthTime: "",
      birthPlace: "",
    },
  });

  // Move ALL hooks (including useMutation) to the top before any conditional logic
  const calculateMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const payload = {
        ...data,
        latitude: coordinates?.latitude || 13.0827,
        longitude: coordinates?.longitude || 80.2707,
      };

      console.log("Life Report API call with payload:", payload);

      const response = await apiRequest(
        "POST",
        "/api/life-report/comprehensive",
        payload,
      );
      return response;
    },
    onSuccess: (data) => {
      console.log("Life Report API response:", data);
      setResult(data);

      // Fetch pricing after successful report generation
      fetchPricing();
    },
  });

  const pdfDownloadMutation = useMutation({
    mutationFn: async () => {
      const formData = form.getValues();
      const payload = {
        reportData: result,
        userInfo: {
          name: formData.name,
          birthDate: formData.birthDate,
          birthTime: formData.birthTime,
          birthPlace: formData.birthPlace,
        },
      };

      const response = await apiRequest(
        "POST",
        "/api/life-report/generate-pdf",
        payload,
      );
      return response.blob();
    },
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Life_Report_${form.getValues().name.replace(/\s+/g, "_")}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
  });

  const emailMutation = useMutation({
    mutationFn: async () => {
      const formData = form.getValues();
      const payload = {
        reportData: result,
        userInfo: {
          name: formData.name,
          birthDate: formData.birthDate,
          birthTime: formData.birthTime,
          birthPlace: formData.birthPlace,
        },
        emailAddress,
      };

      const response = await apiRequest(
        "POST",
        "/api/life-report/send-email",
        payload,
      );
      return response.json();
    },
  });

  // Define helper functions
  const fetchPricing = async () => {
    try {
      const response = await apiRequest("GET", "/api/pricing/life-report");
      const pricingData = await response.json();
      setPricing(pricingData);
    } catch (error) {
      console.error("Error fetching pricing:", error);
    }
  };

  const handleLocationSelect = (location: any) => {
    setCoordinates({
      latitude: location.lat,
      longitude: location.lon,
    });
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
        <AstroTickHeader />
        <div className="py-16">
          <div className="max-w-md mx-auto px-4">
            <Card className="text-center">
              <CardHeader>
                <Lock className="h-16 w-16 text-purple-600 mx-auto mb-4" />
                <CardTitle className="text-2xl font-bold text-gray-900">
                  🎉 FREE Life Report!
                </CardTitle>
                <p className="text-gray-600">
                  <span className="font-semibold text-purple-600">
                    Limited Time Offer:
                  </span>{" "}
                  Get your comprehensive life analysis absolutely FREE! Simply
                  create your account to claim this exclusive astrological
                  insight.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={() => setLocation("/signup")}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                >
                  Claim FREE Life Report
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setLocation("/login")}
                  className="w-full"
                >
                  Already have an account? Log In
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log("Form submitted with data:", data);
    console.log("Current coordinates:", coordinates);
    calculateMutation.mutate(data);
  };

  const reportSections = [
    { icon: User, title: "Personality", color: "from-blue-500 to-indigo-500" },
    { icon: Briefcase, title: "Career", color: "from-green-500 to-teal-500" },
    { icon: Heart, title: "Relationships", color: "from-pink-500 to-rose-500" },
    { icon: Activity, title: "Health", color: "from-red-500 to-orange-500" },
    {
      icon: DollarSign,
      title: "Finances",
      color: "from-yellow-500 to-amber-500",
    },
  ];

  // Helper function to get section color
  const getSectionColor = (index: number) => {
    const colors = [
      "from-purple-500 to-pink-500",
      "from-blue-500 to-indigo-500",
      "from-green-500 to-emerald-500",
      "from-pink-500 to-red-500",
      "from-yellow-500 to-orange-500",
      "from-indigo-500 to-purple-500",
      "from-teal-500 to-cyan-500",
      "from-rose-500 to-pink-500",
      "from-emerald-500 to-teal-500",
      "from-amber-500 to-yellow-500",
      "from-violet-500 to-purple-500",
      "from-cyan-500 to-blue-500",
    ];
    return colors[index % colors.length];
  };

  // Helper function to get section icon
  const getSectionIcon = (key: string) => {
    const iconMap: { [key: string]: any } = {
      ascendantOverview: <Star className="h-5 w-5" />,
      personalityTraits: <Brain className="h-5 w-5" />,
      navamsaSummary: <Sparkles className="h-5 w-5" />,
      yogas: <Target className="h-5 w-5" />,
      dashaSummary: <Clock className="h-5 w-5" />,
      career: <Briefcase className="h-5 w-5" />,
      relationships: <Heart className="h-5 w-5" />,
      wealth: <DollarSign className="h-5 w-5" />,
      health: <Activity className="h-5 w-5" />,
      lifePhases: <TrendingUp className="h-5 w-5" />,
      luckyFactors: <Gift className="h-5 w-5" />,
      remedies: <Lightbulb className="h-5 w-5" />,
    };
    return iconMap[key] || <Star className="h-5 w-5" />;
  };

  // Helper function to render section content
  const renderSectionContent = (key: string, section: any) => {
    if (!section) return null;

    switch (key) {
      case "ascendantOverview":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2">
                  Ascendant Analysis
                </h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Ascendant:</strong> {section.ascendant}
                  </div>
                  <div>
                    <strong>Ascendant Lord:</strong> {section.ascendantLord}
                  </div>
                </div>
              </div>
              <div className="p-4 bg-indigo-50 rounded-lg">
                <h4 className="font-semibold text-indigo-800 mb-2">Overview</h4>
                <p className="text-sm text-gray-700">{section.overview}</p>
              </div>
            </div>
          </div>
        );

      case "personalityTraits":
        return (
          <div className="space-y-6">
            {section.strengths && (
              <div>
                <h4 className="font-semibold text-green-700 mb-3">
                  Key Strengths
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {section.strengths.map((strength: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 p-2 bg-green-50 rounded-lg"
                    >
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{strength}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {section.weaknesses && (
              <div>
                <h4 className="font-semibold text-orange-700 mb-3">
                  Areas for Growth
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {section.weaknesses.map((weakness: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 p-2 bg-orange-50 rounded-lg"
                    >
                      <Target className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{weakness}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {section.characteristics && (
              <div>
                <h4 className="font-semibold text-blue-700 mb-3">
                  Core Characteristics
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {section.characteristics.map(
                    (char: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 p-2 bg-blue-50 rounded-lg"
                      >
                        <Star className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{char}</span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}
          </div>
        );

      case "remedies":
        return (
          <div className="space-y-6">
            {section.overview && (
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-700">{section.overview}</p>
              </div>
            )}

            {section.dailyPractices && (
              <div>
                <h4 className="font-semibold text-green-700 mb-3">
                  Daily Practices
                </h4>
                <div className="space-y-2">
                  {section.dailyPractices.map(
                    (practice: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 p-3 bg-green-50 rounded-lg"
                      >
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">
                          {practice}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}

            {section.planetaryRemedies && (
              <div>
                <h4 className="font-semibold text-blue-700 mb-3">
                  Planetary Remedies
                </h4>
                <div className="space-y-2">
                  {section.planetaryRemedies.map(
                    (remedy: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg"
                      >
                        <Star className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-gray-700">
                          <strong>{remedy.planet}:</strong> {remedy.remedy}
                          {remedy.mantra && (
                            <div className="mt-1 text-xs text-blue-600">
                              Mantra: {remedy.mantra}
                            </div>
                          )}
                          {remedy.timing && (
                            <div className="text-xs text-blue-600">
                              Best Time: {remedy.timing}
                            </div>
                          )}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}

            {section.gemstones && (
              <div>
                <h4 className="font-semibold text-purple-700 mb-3">
                  Gemstone Recommendations
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="font-semibold text-purple-800">
                      Primary Gemstone
                    </div>
                    <div className="text-sm text-gray-700 mt-1">
                      {section.gemstones.primary}
                    </div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="font-semibold text-purple-800">
                      Alternative
                    </div>
                    <div className="text-sm text-gray-700 mt-1">
                      {section.gemstones.alternative}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {section.luckyColors && (
              <div>
                <h4 className="font-semibold text-orange-700 mb-3">
                  Lucky Colors
                </h4>
                <div className="flex flex-wrap gap-2">
                  {section.luckyColors.map((color: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
                    >
                      {color}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            {Object.entries(section).map(([subKey, value]) => {
              if (subKey === "title") return null;

              if (Array.isArray(value)) {
                return (
                  <div key={subKey}>
                    <h4 className="font-semibold text-gray-800 mb-2 capitalize">
                      {subKey.replace(/([A-Z])/g, " $1").trim()}
                    </h4>
                    <div className="space-y-1">
                      {value.map((item: string, index: number) => (
                        <div
                          key={index}
                          className="flex items-start gap-2 p-2 bg-gray-50 rounded"
                        >
                          <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              } else if (typeof value === "string") {
                return (
                  <div key={subKey} className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2 capitalize">
                      {subKey.replace(/([A-Z])/g, " $1").trim()}
                    </h4>
                    <p className="text-sm text-gray-700">{value}</p>
                  </div>
                );
              }
              return null;
            })}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <AstroTickHeader />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Complete Life Report
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get a comprehensive analysis of your entire life journey including
            personality, career, relationships, health, and future predictions
          </p>
        </div>

        {/* Center-aligned Form Container */}
        <div className="max-w-2xl mx-auto mb-8">
          <Card className="bg-white/90 backdrop-blur-sm border-purple-200 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <FileText className="h-6 w-6" />
                Birth Details for Life Analysis
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
                            className="bg-white border-purple-200 focus:border-purple-500 focus:ring-purple-500/20"
                            {...field}
                          />
                        </FormControl>
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
                          <Input
                            type="date"
                            className="bg-white border-purple-200 focus:border-purple-500 focus:ring-purple-500/20"
                            {...field}
                          />
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
                          <Input
                            type="time"
                            className="bg-white border-purple-200 focus:border-purple-500 focus:ring-purple-500/20"
                            {...field}
                          />
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
                            onChange={(value, latitude, longitude) => {
                              field.onChange(value);
                              if (latitude && longitude) {
                                setCoordinates({ latitude, longitude });
                                console.log("Coordinates set:", {
                                  latitude,
                                  longitude,
                                });
                              }
                            }}
                            placeholder="Enter birth place"
                            className="bg-white border-purple-200 focus:border-purple-500 focus:ring-purple-500/20"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={calculateMutation.isPending}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white h-12 text-lg"
                  >
                    {calculateMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Generating Life Report...
                      </>
                    ) : (
                      <>
                        <FileText className="mr-2 h-5 w-5" />
                        Generate Complete Life Report
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Center-aligned Report Results */}
        {result ? (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Birth Details */}
            <Card className="bg-white/90 backdrop-blur-sm border-purple-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Birth Details & Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="font-semibold text-purple-800">
                      Personal Info
                    </div>
                    <div className="mt-2 space-y-1">
                      <div>
                        <strong>Name:</strong> {result.basicInfo?.name}
                      </div>
                      <div>
                        <strong>Birth Date:</strong>{" "}
                        {result.basicInfo?.birthDate ||
                          result.birthDetails?.date}
                      </div>
                      <div>
                        <strong>Birth Time:</strong>{" "}
                        {result.basicInfo?.birthTime ||
                          result.birthDetails?.time}
                      </div>
                      <div>
                        <strong>Birth Place:</strong>{" "}
                        {result.basicInfo?.birthPlace ||
                          result.birthDetails?.place}
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-indigo-50 rounded-lg">
                    <div className="font-semibold text-indigo-800">
                      Astrological Details
                    </div>
                    <div className="mt-2 space-y-1">
                      <div>
                        <strong>Ascendant:</strong>{" "}
                        {result.basicInfo?.ascendant}
                      </div>
                      <div>
                        <strong>Ascendant Lord:</strong>{" "}
                        {result.basicInfo?.ascendantLord}
                      </div>
                      <div>
                        <strong>Moon Sign:</strong> {result.basicInfo?.moonSign}
                      </div>
                      <div>
                        <strong>Sun Sign:</strong> {result.basicInfo?.sunSign}
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="font-semibold text-blue-800">
                      Current Period
                    </div>
                    <div className="mt-2 space-y-1">
                      <div>
                        <strong>Nakshatra:</strong>{" "}
                        {result.basicInfo?.nakshatra}
                      </div>
                      <div>
                        <strong>Current Dasha:</strong>{" "}
                        {result.basicInfo?.currentDasha}
                      </div>
                      <div>
                        <strong>Numerology:</strong>{" "}
                        {result.basicInfo?.numerology}
                      </div>
                      <div>
                        <strong>Engine:</strong> {result.calculationEngine}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comprehensive Report Sections */}
            {result.sections &&
              Object.entries(result.sections).map(
                ([key, section]: [string, any], index) => (
                  <Card
                    key={key}
                    className="bg-white/90 backdrop-blur-sm border-purple-200 shadow-xl"
                  >
                    <CardHeader
                      className={`bg-gradient-to-r ${getSectionColor(index)} text-white`}
                    >
                      <CardTitle className="flex items-center gap-2">
                        {getSectionIcon(key)}
                        {section.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      {renderSectionContent(key, section)}
                    </CardContent>
                  </Card>
                ),
              )}

            {/* Calculation Summary */}
            <Card className="bg-white/90 backdrop-blur-sm border-green-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Report Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-700">12</div>
                    <div className="text-sm text-green-600">
                      Complete Sections
                    </div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-700">
                      {result.calculationEngine}
                    </div>
                    <div className="text-sm text-blue-600">
                      Calculation Method
                    </div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-700">
                      {result.responseTime}
                    </div>
                    <div className="text-sm text-purple-600">
                      Processing Time
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pricing and Download Section */}
            {pricing && (
              <Card className="bg-white/90 backdrop-blur-sm border-yellow-200 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Download & Email Options
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {/* Pricing Display */}
                  <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                    <div className="text-center">
                      {pricing.promotionalOffer ? (
                        <div>
                          <div className="text-3xl font-bold text-green-600 mb-2">
                            FREE
                            <span className="text-lg ml-2 line-through text-gray-500">
                              ₹{pricing.originalPrice}
                            </span>
                          </div>
                          <div className="text-green-700 font-semibold mb-2">
                            {pricing.message}
                          </div>
                          <div className="text-sm text-green-600">
                            <AlertCircle className="inline h-4 w-4 mr-1" />
                            Offer valid until {pricing.promotionEndDate}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="text-3xl font-bold text-blue-600 mb-2">
                            ₹{pricing.currentPrice}
                            <span className="text-lg ml-2 line-through text-gray-500">
                              ₹{pricing.originalPrice}
                            </span>
                          </div>
                          <div className="text-blue-700 font-semibold">
                            {pricing.message}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Download and Email Options */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* PDF Download */}
                    <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                      <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                        <Download className="h-5 w-5" />
                        Download PDF Report
                      </h4>
                      <p className="text-sm text-blue-700 mb-4">
                        Get your complete life report in PDF format for offline
                        viewing and printing.
                      </p>
                      <Button
                        onClick={() => pdfDownloadMutation.mutate()}
                        disabled={pdfDownloadMutation.isPending}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {pdfDownloadMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating PDF...
                          </>
                        ) : (
                          <>
                            <Download className="mr-2 h-4 w-4" />
                            Download PDF
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Email Report */}
                    <div className="p-4 border border-purple-200 rounded-lg bg-purple-50">
                      <h4 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                        <Mail className="h-5 w-5" />
                        Email Report
                      </h4>
                      <p className="text-sm text-purple-700 mb-4">
                        Receive your complete life report directly in your email
                        inbox.
                      </p>
                      <div className="space-y-3">
                        <Input
                          type="email"
                          placeholder="Enter your email address"
                          value={emailAddress}
                          onChange={(e) => setEmailAddress(e.target.value)}
                          className="bg-white border-purple-200 focus:border-purple-500"
                        />
                        <Button
                          onClick={() => emailMutation.mutate()}
                          disabled={emailMutation.isPending || !emailAddress}
                          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                        >
                          {emailMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Sending Email...
                            </>
                          ) : (
                            <>
                              <Mail className="mr-2 h-4 w-4" />
                              Send to Email
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Features Included */}
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-3">
                      What's Included:
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Complete personality analysis
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Career and financial guidance
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Relationship and marriage insights
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Health and wellness analysis
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Life phases and timing
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Remedies and spiritual guidance
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white/90 backdrop-blur-sm border-purple-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                <CardTitle>Complete Life Report Features</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {reportSections.map((section, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div
                        className={`w-12 h-12 bg-gradient-to-r ${section.color} rounded-lg flex items-center justify-center text-white`}
                      >
                        <section.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 mb-1">
                          {section.title} Analysis
                        </h4>
                        <p className="text-sm text-gray-600">
                          {section.title === "Personality" &&
                            "Detailed personality traits, strengths, weaknesses, and mental makeup"}
                          {section.title === "Career" &&
                            "Suitable career fields, business prospects, and professional growth phases"}
                          {section.title === "Relationships" &&
                            "Marriage prospects, ideal partner qualities, and relationship guidance"}
                          {section.title === "Health" &&
                            "Health analysis, vulnerable areas, and wellness recommendations"}
                          {section.title === "Finances" &&
                            "Financial prospects, profitable periods, and wealth accumulation tips"}
                        </p>
                      </div>
                    </div>
                  ))}

                  <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
                    <h4 className="font-semibold text-purple-800 mb-2">
                      Additional Features
                    </h4>
                    <ul className="text-sm text-purple-700 space-y-1">
                      <li>• Life phase analysis (Childhood to Old Age)</li>
                      <li>• Lucky factors (Colors, Numbers, Gemstones)</li>
                      <li>• Major challenges and karmic lessons</li>
                      <li>• Remedial measures and suggestions</li>
                      <li>• Timing of important life events</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
