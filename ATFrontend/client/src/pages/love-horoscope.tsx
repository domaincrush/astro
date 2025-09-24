import { useState } from "react";
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
  Heart,
  Clock,
  MapPin,
  Calendar,
  Users,
  Star,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  AlertCircle,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "src/components/ui/tabs";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "src/lib/queryClient";

const singlePersonSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  birthDate: z.string().min(1, "Birth date is required"),
  birthTime: z.string().min(1, "Birth time is required"),
  birthPlace: z.string().min(1, "Birth place is required"),
});

const compatibilitySchema = z.object({
  person1Name: z.string().min(2, "Name must be at least 2 characters"),
  person1BirthDate: z.string().min(1, "Birth date is required"),
  person1BirthTime: z.string().min(1, "Birth time is required"),
  person1BirthPlace: z.string().min(1, "Birth place is required"),
  person1Gender: z.string().min(1, "Gender is required"),

  person2Name: z.string().min(2, "Name must be at least 2 characters"),
  person2BirthDate: z.string().min(1, "Birth date is required"),
  person2BirthTime: z.string().min(1, "Birth time is required"),
  person2BirthPlace: z.string().min(1, "Birth place is required"),
  person2Gender: z.string().min(1, "Gender is required"),
});

interface LoveHoroscopeResult {
  basicInfo: {
    name: string;
    birthDate: string;
    moonSign: string;
    venusSign: string;
    marsSign: string;
    loveCompatibility: string;
  };
  lovePersonality: {
    romanticNature: string;
    loveStyle: string;
    emotionalNeeds: string[];
    attractionFactors: string[];
    weaknesses: string[];
  };
  relationshipAnalysis: {
    bestMatches: string[];
    challengingMatches: string[];
    idealPartnerTraits: string[];
    relationshipTiming: string;
    marriageIndicators: string[];
  };
  currentPeriod: {
    loveTransit: string;
    favorableTime: string;
    relationship_prospects: string;
    singleAdvice: string;
    coupledAdvice: string;
  };
  predictions: {
    next3Months: string;
    next6Months: string;
    nextYear: string;
    marriageTiming: string;
  };
  remedies: Array<{
    purpose: string;
    remedy: string;
    timing: string;
    duration: string;
  }>;
}

interface CompatibilityResult {
  overallCompatibility: number;
  calculationEngine: string;
  responseTime: string;

  synastryAnalysis: {
    elementalCompatibility: number;
    lunarHarmony: number;
    venusCompatibility: number;
    marsHarmony: number;
    ascendantMatch: number;
  };

  detailedAnalysis: {
    strengths: string[];
    challenges: string[];
    recommendations: string[];
  };

  personalityMatch: {
    compatibility: string;
    description: string;
  };

  relationshipPredictions: {
    shortTerm: string;
    longTerm: string;
    marriageProspects: string;
  };
}

export default function LoveHoroscope() {
  const [singleResult, setSingleResult] = useState<LoveHoroscopeResult | null>(
    null,
  );
  const [compatibilityResult, setCompatibilityResult] =
    useState<CompatibilityResult | null>(null);
  const [coordinates, setCoordinates] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [coordinates2, setCoordinates2] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [singleCoordinates, setSingleCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [person1Coordinates, setPerson1Coordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [person2Coordinates, setPerson2Coordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const singleForm = useForm<z.infer<typeof singlePersonSchema>>({
    resolver: zodResolver(singlePersonSchema),
    defaultValues: {
      name: "",
      birthDate: "",
      birthTime: "",
      birthPlace: "",
    },
  });

  const compatibilityForm = useForm<z.infer<typeof compatibilitySchema>>({
    resolver: zodResolver(compatibilitySchema),
    defaultValues: {
      person1Name: "",
      person1BirthDate: "",
      person1BirthTime: "",
      person1BirthPlace: "",
      person1Gender: "",
      person2Name: "",
      person2BirthDate: "",
      person2BirthTime: "",
      person2BirthPlace: "",
      person2Gender: "",
    },
  });

  const singleMutation = useMutation({
    mutationFn: async (data: z.infer<typeof singlePersonSchema>) => {
      const requestData = {
        ...data,
        latitude: singleCoordinates?.lat || coordinates?.latitude,
        longitude: singleCoordinates?.lng || coordinates?.longitude,
      };
      console.log("Single person love horoscope request:", requestData);
      const response = await apiRequest(
        "POST",
        "/api/love-horoscope/analysis",
        requestData,
      );
      return await response;
    },
    onSuccess: (response: any) => {
      console.log("Raw API response:", response);
      if (response && typeof response === "object") {
        setSingleResult(response);
        console.log("Single person love horoscope result received:", response);
      } else {
        console.error("Invalid response format:", response);
      }
    },
    onError: (error) => {
      console.error("Single person love horoscope error:", error);
    },
  });

  const compatibilityMutation = useMutation({
    mutationFn: async (data: z.infer<typeof compatibilitySchema>) => {
      const requestData = {
        person1Name: data.person1Name,
        person1Gender: data.person1Gender,
        person1BirthDate: data.person1BirthDate,
        person1BirthTime: data.person1BirthTime,
        person1BirthPlace: data.person1BirthPlace,
        person1Latitude: person1Coordinates?.lat || coordinates?.latitude,
        person1Longitude: person1Coordinates?.lng || coordinates?.longitude,
        person2Name: data.person2Name,
        person2Gender: data.person2Gender,
        person2BirthDate: data.person2BirthDate,
        person2BirthTime: data.person2BirthTime,
        person2BirthPlace: data.person2BirthPlace,
        person2Latitude: person2Coordinates?.lat || coordinates2?.latitude,
        person2Longitude: person2Coordinates?.lng || coordinates2?.longitude,
      };
      console.log("Compatibility analysis request:", requestData);
      const response = await apiRequest(
        "POST",
        "/api/love-compatibility/analysis",
        requestData,
      );
      return await response;
    },
    onSuccess: (response: any) => {
      console.log("Raw compatibility API response:", response);
      if (response && typeof response === "object") {
        setCompatibilityResult(response);
        console.log("Compatibility analysis result received:", response);
      } else {
        console.error("Invalid compatibility response format:", response);
      }
    },
    onError: (error) => {
      console.error("Compatibility analysis error:", error);
    },
  });

  const onSingleSubmit = (data: z.infer<typeof singlePersonSchema>) => {
    console.log("onSingleSubmit called with:", data);
    console.log("Coordinates:", coordinates);
    singleMutation.mutate(data);
  };

  const onCompatibilitySubmit = (data: z.infer<typeof compatibilitySchema>) => {
    compatibilityMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-rose-100">
      <AstroTickHeader />

      <div className="w-full flex flex-col justify-center items-center mx-auto px-4 py-8">
        {/* Header */}
        <div className=" text-center space-y-4 mb-8">
          <h1 className="text-2xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent">
            💖 Love Horoscope & Compatibility
          </h1>
          <p className="md:text-lg text-gray-600 max-w-3xl mx-auto">
            Discover your romantic destiny through authentic Vedic astrology.
            Get personalized love insights or analyze compatibility between two
            people.
          </p>
        </div>

        {/* Main Form */}
        <Card className="bg-white/80 backdrop-blur-md border-2 border-purple-200  shadow-2xl mb-8">
          <CardContent className="p-6 ">
            <Tabs defaultValue="single" className="">
              <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 mb-6">
                <TabsTrigger
                  value="single"
                  className="text-purple-700 data-[state=active]:bg-purple-100"
                >
                  💝 Single Person Analysis
                </TabsTrigger>
                <TabsTrigger
                  value="compatibility"
                  className="text-pink-700 data-[state=active]:bg-pink-100"
                >
                  💕 Couple Compatibility
                </TabsTrigger>
              </TabsList>

              {/* Single Person Tab */}
              <TabsContent value="single">
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-purple-800 text-center">
                    Your Personal Love Analysis
                  </h3>
                  <Form {...singleForm}>
                    <form
                      onSubmit={singleForm.handleSubmit(onSingleSubmit)}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={singleForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
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
                          control={singleForm.control}
                          name="birthDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Birth Date</FormLabel>
                              <FormControl>
                                <Input
                                  type="date"
                                  {...field}
                                  data-testid="input-birthDate"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={singleForm.control}
                          name="birthTime"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Birth Time</FormLabel>
                              <FormControl>
                                <Input
                                  type="time"
                                  placeholder="HH:MM"
                                  data-testid="input-birthTime"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={singleForm.control}
                          name="birthPlace"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Birth Place</FormLabel>
                              <FormControl>
                                <LocationSearch
                                  value={field.value}
                                  onChange={(
                                    location: string,
                                    latitude?: number,
                                    longitude?: number,
                                  ) => {
                                    field.onChange(location);
                                    if (
                                      latitude !== undefined &&
                                      longitude !== undefined
                                    ) {
                                      setSingleCoordinates({
                                        lat: latitude,
                                        lng: longitude,
                                      });
                                    }
                                  }}
                                  data-testid="input-birthPlace"
                                  placeholder="Enter birth city"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 text-lg"
                        disabled={singleMutation.isPending}
                      >
                        {singleMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Analyzing Love Profile...
                          </>
                        ) : (
                          "Generate Love Analysis"
                        )}
                      </Button>
                    </form>
                  </Form>
                </div>
              </TabsContent>

              {/* Compatibility Tab */}
              <TabsContent value="compatibility">
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-pink-800 text-center">
                    Couple Compatibility Analysis
                  </h3>
                  <Form {...compatibilityForm}>
                    <form
                      onSubmit={compatibilityForm.handleSubmit(
                        onCompatibilitySubmit,
                      )}
                      className="space-y-8"
                    >
                      {/* Person 1 Section */}
                      <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                        <h4 className="text-xl font-bold text-blue-800 mb-4 text-center">
                          👨 Person 1 Details
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={compatibilityForm.control}
                            name="person1Name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                  <Input
                                    data-testid="input-fullName"
                                    placeholder="Enter name"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={compatibilityForm.control}
                            name="person1Gender"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Gender</FormLabel>
                                <FormControl>
                                  <select
                                    className="w-full p-2 border rounded-md"
                                    data-testid="input-gender"
                                    {...field}
                                  >
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                  </select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={compatibilityForm.control}
                            name="person1BirthDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Birth Date</FormLabel>
                                <FormControl>
                                  <Input
                                    data-testid="input-birthDate"
                                    type="date"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={compatibilityForm.control}
                            name="person1BirthTime"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Birth Time</FormLabel>
                                <FormControl>
                                  <Input
                                    type="time"
                                    data-testid="input-birthTime"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={compatibilityForm.control}
                            name="person1BirthPlace"
                            render={({ field }) => (
                              <FormItem className="md:col-span-2">
                                <FormLabel>Birth Place</FormLabel>
                                <FormControl>
                                  <LocationSearch
                                    value={field.value}
                                    onChange={(
                                      location: string,
                                      latitude?: number,
                                      longitude?: number,
                                    ) => {
                                      field.onChange(location);
                                      if (
                                        latitude !== undefined &&
                                        longitude !== undefined
                                      ) {
                                        setPerson1Coordinates({
                                          lat: latitude,
                                          lng: longitude,
                                        });
                                      }
                                    }}
                                    data-testid="input-birthPlace"
                                    placeholder="Enter birth city"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Person 2 Section */}
                      <div className="p-6 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl border border-pink-200">
                        <h4 className="text-xl font-bold text-pink-800 mb-4 text-center">
                          👩 Person 2 Details
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={compatibilityForm.control}
                            name="person2Name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                  <Input
                                    data-testid="input-fullName"
                                    placeholder="Enter name"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={compatibilityForm.control}
                            name="person2Gender"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Gender</FormLabel>
                                <FormControl>
                                  <select
                                    className="w-full p-2 border rounded-md"
                                    {...field}
                                    data-testid="input-gender"
                                  >
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                  </select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={compatibilityForm.control}
                            name="person2BirthDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Birth Date</FormLabel>
                                <FormControl>
                                  <Input
                                    data-testid="input-birthDate"
                                    type="date"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={compatibilityForm.control}
                            name="person2BirthTime"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Birth Time</FormLabel>
                                <FormControl>
                                  <Input
                                    data-testid="input-birthTime"
                                    type="time"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={compatibilityForm.control}
                            name="person2BirthPlace"
                            render={({ field }) => (
                              <FormItem className="md:col-span-2">
                                <FormLabel>Birth Place</FormLabel>
                                <FormControl>
                                  <LocationSearch
                                    value={field.value}
                                    onChange={(
                                      location: string,
                                      latitude?: number,
                                      longitude?: number,
                                    ) => {
                                      field.onChange(location);
                                      if (
                                        latitude !== undefined &&
                                        longitude !== undefined
                                      ) {
                                        setPerson2Coordinates({
                                          lat: latitude,
                                          lng: longitude,
                                        });
                                      }
                                    }}
                                    data-testid="input-birthPlace"
                                    placeholder="Enter birth city"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white py-3 text-lg"
                        disabled={compatibilityMutation.isPending}
                      >
                        {compatibilityMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Analyzing Compatibility...
                          </>
                        ) : (
                          "Generate Compatibility Report"
                        )}
                      </Button>
                    </form>
                  </Form>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Single Person Results */}
        {singleResult && (
          <div className="space-y-6 max-w-6xl">
            {/* Basic Info Card */}
            <Card className="bg-white/90 backdrop-blur-md border-2 border-purple-200 shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <CardTitle className="text-center text-2xl">
                  💖 Your Love Analysis
                </CardTitle>
                <p className="text-center text-purple-100">
                  Engine: {singleResult.calculationEngine} | Response:{" "}
                  {singleResult.responseTime}
                </p>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-bold text-lg mb-3 text-blue-800">
                      Basic Info
                    </h4>
                    <p>
                      <strong>Name:</strong> {singleResult.basicInfo.name}
                    </p>
                    <p>
                      <strong>Moon Sign:</strong>{" "}
                      {singleResult.basicInfo.moonSign}
                    </p>
                    <p>
                      <strong>Venus Sign:</strong>{" "}
                      {singleResult.basicInfo.venusSign}
                    </p>
                    <p>
                      <strong>Mars Sign:</strong>{" "}
                      {singleResult.basicInfo.marsSign}
                    </p>
                    <p>
                      <strong>Love Compatibility:</strong>{" "}
                      {singleResult.basicInfo.loveCompatibility}
                    </p>
                  </div>
                  <div className="bg-pink-50 p-4 rounded-lg">
                    <h4 className="font-bold text-lg mb-3 text-pink-800">
                      Love Personality
                    </h4>
                    <p className="text-sm mb-2">
                      <strong>Romantic Nature:</strong>{" "}
                      {singleResult.lovePersonality.romanticNature}
                    </p>
                    <p className="text-sm mb-2">
                      <strong>Love Style:</strong>{" "}
                      {singleResult.lovePersonality.loveStyle}
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-bold text-lg mb-3 text-green-800">
                      Current Period
                    </h4>
                    <p className="text-sm mb-2">
                      <strong>Love Transit:</strong>{" "}
                      {singleResult.currentPeriod.loveTransit}
                    </p>
                    <p className="text-sm mb-2">
                      <strong>Favorable Time:</strong>{" "}
                      {singleResult.currentPeriod.favorableTime}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emotional Needs & Attraction Factors */}
            <Card className="bg-white/90 backdrop-blur-md border-2 border-pink-200 shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-pink-500 to-rose-500 text-white">
                <CardTitle className="text-center text-xl">
                  💝 Love Traits & Attractions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-lg mb-3 text-pink-800">
                      Emotional Needs
                    </h4>
                    <ul className="space-y-2">
                      {singleResult.lovePersonality.emotionalNeeds?.map(
                        (need, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-pink-500">•</span>
                            <span className="text-sm">{need}</span>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-3 text-purple-800">
                      Attraction Factors
                    </h4>
                    <ul className="space-y-2">
                      {singleResult.lovePersonality.attractionFactors?.map(
                        (factor, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-purple-500">•</span>
                            <span className="text-sm">{factor}</span>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Relationship Analysis */}
            <Card className="bg-white/90 backdrop-blur-md border-2 border-indigo-200 shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                <CardTitle className="text-center text-xl">
                  🔮 Relationship Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-lg mb-3 text-green-800">
                      Best Matches
                    </h4>
                    <ul className="space-y-2">
                      {singleResult.relationshipAnalysis.bestMatches?.map(
                        (match, index) => (
                          <li
                            key={index}
                            className="bg-green-50 p-2 rounded text-sm"
                          >
                            {match}
                          </li>
                        ),
                      )}
                    </ul>
                    <h4 className="font-bold text-lg mb-3 mt-4 text-blue-800">
                      Ideal Partner Traits
                    </h4>
                    <ul className="space-y-2">
                      {singleResult.relationshipAnalysis.idealPartnerTraits?.map(
                        (trait, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-blue-500">•</span>
                            <span className="text-sm">{trait}</span>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-3 text-orange-800">
                      Challenging Matches
                    </h4>
                    <ul className="space-y-2">
                      {singleResult.relationshipAnalysis.challengingMatches?.map(
                        (match, index) => (
                          <li
                            key={index}
                            className="bg-orange-50 p-2 rounded text-sm"
                          >
                            {match}
                          </li>
                        ),
                      )}
                    </ul>
                    <h4 className="font-bold text-lg mb-3 mt-4 text-purple-800">
                      Marriage Indicators
                    </h4>
                    <ul className="space-y-2">
                      {singleResult.relationshipAnalysis.marriageIndicators?.map(
                        (indicator, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-purple-500">•</span>
                            <span className="text-sm">{indicator}</span>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Predictions */}
            <Card className="bg-white/90 backdrop-blur-md border-2 border-cyan-200 shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
                <CardTitle className="text-center text-xl">
                  🔮 Love Predictions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-cyan-50 p-4 rounded-lg">
                      <h5 className="font-semibold text-cyan-800 mb-2">
                        Next 3 Months
                      </h5>
                      <p className="text-sm">
                        {singleResult.predictions.next3Months}
                      </p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h5 className="font-semibold text-blue-800 mb-2">
                        Next 6 Months
                      </h5>
                      <p className="text-sm">
                        {singleResult.predictions.next6Months}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h5 className="font-semibold text-purple-800 mb-2">
                        Next Year
                      </h5>
                      <p className="text-sm">
                        {singleResult.predictions.nextYear}
                      </p>
                    </div>
                    <div className="bg-pink-50 p-4 rounded-lg">
                      <h5 className="font-semibold text-pink-800 mb-2">
                        Marriage Timing
                      </h5>
                      <p className="text-sm">
                        {singleResult.predictions.marriageTiming}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Remedies */}
            <Card className="bg-white/90 backdrop-blur-md border-2 border-amber-200 shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                <CardTitle className="text-center text-xl">
                  🕉️ Love Enhancement Remedies
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {singleResult.remedies?.map((remedy, index) => (
                    <div
                      key={index}
                      className="bg-amber-50 p-4 rounded-lg border border-amber-200"
                    >
                      <h5 className="font-semibold text-amber-800 mb-2">
                        {remedy.purpose}
                      </h5>
                      <p className="text-sm mb-2">
                        <strong>Remedy:</strong> {remedy.remedy}
                      </p>
                      <p className="text-sm mb-1">
                        <strong>Timing:</strong> {remedy.timing}
                      </p>
                      <p className="text-sm">
                        <strong>Duration:</strong> {remedy.duration}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Compatibility Results */}
        {compatibilityResult && (
          <div className="space-y-6">
            {/* Overall Compatibility Score */}
            <Card className="bg-white/90 backdrop-blur-md border-2 border-pink-200 shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-pink-500 to-rose-500 text-white">
                <CardTitle className="text-center text-2xl">
                  💕 Love Compatibility Analysis
                </CardTitle>
                <p className="text-center text-pink-100">
                  Engine: {compatibilityResult.calculationEngine} | Response:{" "}
                  {compatibilityResult.responseTime}
                </p>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-pink-600">
                    {compatibilityResult.overallScore}
                  </div>
                  <p className="text-lg">Overall Compatibility Score</p>
                </div>
                <div className="grid md:grid-cols-5 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-xl font-bold text-blue-600">
                      {
                        compatibilityResult.synastryAnalysis
                          ?.elementalCompatibility
                      }
                      %
                    </div>
                    <div className="text-sm">Elemental</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-xl font-bold text-purple-600">
                      {compatibilityResult.synastryAnalysis?.lunarHarmony}%
                    </div>
                    <div className="text-sm">Lunar</div>
                  </div>
                  <div className="text-center p-3 bg-pink-50 rounded-lg">
                    <div className="text-xl font-bold text-pink-600">
                      {compatibilityResult.synastryAnalysis?.venusCompatibility}
                      %
                    </div>
                    <div className="text-sm">Venus</div>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <div className="text-xl font-bold text-red-600">
                      {compatibilityResult.synastryAnalysis?.marsHarmony}%
                    </div>
                    <div className="text-sm">Mars</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-xl font-bold text-green-600">
                      {compatibilityResult.synastryAnalysis?.ascendantMatch}%
                    </div>
                    <div className="text-sm">Ascendant</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Analysis - Strengths */}
            <Card className="bg-white/90 backdrop-blur-md border-2 border-green-200 shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                <CardTitle className="text-center text-xl">
                  💚 Relationship Strengths
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {compatibilityResult.detailedAnalysis?.strengths?.map(
                    (strength, index) => (
                      <div
                        key={index}
                        className="bg-green-50 p-4 rounded-lg border border-green-200"
                      >
                        <p className="text-green-800 leading-relaxed">
                          {strength}
                        </p>
                      </div>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Detailed Analysis - Challenges */}
            <Card className="bg-white/90 backdrop-blur-md border-2 border-orange-200 shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-amber-500 text-white">
                <CardTitle className="text-center text-xl">
                  ⚠️ Growth Areas & Challenges
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {compatibilityResult.detailedAnalysis?.challenges?.map(
                    (challenge, index) => (
                      <div
                        key={index}
                        className="bg-orange-50 p-4 rounded-lg border border-orange-200"
                      >
                        <p className="text-orange-800 leading-relaxed">
                          {challenge}
                        </p>
                      </div>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Detailed Analysis - Recommendations */}
            <Card className="bg-white/90 backdrop-blur-md border-2 border-blue-200 shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                <CardTitle className="text-center text-xl">
                  💡 Relationship Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {compatibilityResult.detailedAnalysis?.recommendations?.map(
                    (recommendation, index) => (
                      <div
                        key={index}
                        className="bg-blue-50 p-4 rounded-lg border border-blue-200"
                      >
                        <p className="text-blue-800 leading-relaxed">
                          {recommendation}
                        </p>
                      </div>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Personality Match */}
            <Card className="bg-white/90 backdrop-blur-md border-2 border-purple-200 shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-violet-500 text-white">
                <CardTitle className="text-center text-xl">
                  🤝 Personality Compatibility
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <span className="inline-block bg-purple-100 text-purple-800 px-4 py-2 rounded-full font-semibold">
                    {compatibilityResult.personalityMatch?.compatibility} Match
                  </span>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-purple-800 leading-relaxed">
                    {compatibilityResult.personalityMatch?.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Future Predictions */}
            <Card className="bg-white/90 backdrop-blur-md border-2 border-cyan-200 shadow-2xl">
              <CardHeader className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white">
                <CardTitle className="text-center text-xl">
                  🔮 Relationship Predictions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-1 gap-6">
                  <div className="space-y-4">
                    <div className="bg-cyan-50 p-4 rounded-lg">
                      <h5 className="font-semibold text-cyan-800 mb-2">
                        Short-Term (Next 3 Months)
                      </h5>
                      <p className="text-sm">
                        {compatibilityResult.relationshipPredictions?.shortTerm}
                      </p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h5 className="font-semibold text-blue-800 mb-2">
                        Long-Term Prospects
                      </h5>
                      <p className="text-sm">
                        {compatibilityResult.relationshipPredictions?.longTerm}
                      </p>
                    </div>
                    <div className="bg-pink-50 p-4 rounded-lg">
                      <h5 className="font-semibold text-pink-800 mb-2">
                        Marriage Prospects
                      </h5>
                      <p className="text-sm">
                        {
                          compatibilityResult.relationshipPredictions
                            ?.marriageProspects
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Footer />
      </div>
    </div>
  );
}
