import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from 'src/components/ui/card';
import { Button } from 'src/components/ui/button';
import { Input } from 'src/components/ui/input';
import { Label } from 'src/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'src/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from 'src/components/ui/form';
import { Loader2, Heart, Users, Calendar, Clock, MapPin, TrendingUp, AlertTriangle, Lightbulb, Star } from 'lucide-react';
import { apiRequest } from 'src/lib/queryClient';
import { LocationSearch } from 'src/components/LocationSearch';

const compatibilitySchema = z.object({
  // Person 1 data
  person1Name: z.string().min(1, 'Name is required'),
  person1Gender: z.enum(['male', 'female', 'other']),
  person1BirthDate: z.string().min(1, 'Birth date is required'),
  person1BirthTime: z.string().min(1, 'Birth time is required'),
  person1BirthPlace: z.string().min(1, 'Birth place is required'),
  person1Latitude: z.number().optional(),
  person1Longitude: z.number().optional(),
  
  // Person 2 data
  person2Name: z.string().min(1, 'Name is required'),
  person2Gender: z.enum(['male', 'female', 'other']),
  person2BirthDate: z.string().min(1, 'Birth date is required'),
  person2BirthTime: z.string().min(1, 'Birth time is required'),
  person2BirthPlace: z.string().min(1, 'Birth place is required'),
  person2Latitude: z.number().optional(),
  person2Longitude: z.number().optional(),
});

type CompatibilityForm = z.infer<typeof compatibilitySchema>;

interface CompatibilityResult {
  success: boolean;
  overallScore: number;
  calculationEngine: string;
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
    description: string;
    compatibility: string;
  };
  relationshipPredictions: {
    shortTerm: string;
    longTerm: string;
    marriageProspects: string;
  };
}

export default function LoveCompatibility() {
  const [result, setResult] = useState<CompatibilityResult | null>(null);

  const form = useForm<CompatibilityForm>({
    resolver: zodResolver(compatibilitySchema),
    defaultValues: {
      person1Gender: 'male',
      person2Gender: 'female',
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: CompatibilityForm): Promise<CompatibilityResult> => {
      const response = await fetch('/api/love-compatibility/analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Analysis failed');
      }
      return result;
    },
    onSuccess: (data: CompatibilityResult) => {
      setResult(data);
    },
  });

  const onSubmit = (data: CompatibilityForm) => {
    mutation.mutate(data);
  };

  const handleLocationSelect = (field: string) => (location: string, coordinates?: { lat: number; lng: number }) => {
    const personField = field.includes('person1') ? 'person1' : 'person2';
    const baseField = field.includes('person1') ? 'person1BirthPlace' : 'person2BirthPlace';
    const latField = field.includes('person1') ? 'person1Latitude' : 'person2Latitude';
    const lngField = field.includes('person1') ? 'person1Longitude' : 'person2Longitude';
    
    form.setValue(baseField as keyof CompatibilityForm, location);
    if (coordinates) {
      form.setValue(latField as keyof CompatibilityForm, coordinates.lat);
      form.setValue(lngField as keyof CompatibilityForm, coordinates.lng);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Love Compatibility Calculator
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover your relationship compatibility through authentic Vedic astrology synastry analysis. 
            Compare both birth charts for accurate compatibility scoring and insights.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Form Section */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Users className="w-6 h-6" />
                Partner Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  {/* Person 1 */}
                  <div className="space-y-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-800 flex items-center gap-2">
                      <Heart className="w-5 h-5" />
                      Partner 1
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="person1Name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="person1Gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gender</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value || ""} defaultValue="">
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="person1BirthDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              Birth Date
                            </FormLabel>
                            <FormControl>
                              <div className="grid grid-cols-3 gap-2">
                                {/* Day */}
                                <Select
                                  value={field.value?.split("-")[2] || ""}
                                  onValueChange={(day) =>
                                    field.onChange(
                                      `${field.value?.split("-")[0] || "2000"}-${field.value?.split("-")[1] || "01"}-${day}`
                                    )
                                  }
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
                                  value={field.value?.split("-")[1] || ""}
                                  onValueChange={(month) =>
                                    field.onChange(
                                      `${field.value?.split("-")[0] || "2000"}-${month}-${field.value?.split("-")[2] || "01"}`
                                    )
                                  }
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
                                  value={field.value?.split("-")[0] || ""}
                                  onValueChange={(year) =>
                                    field.onChange(
                                      `${year}-${field.value?.split("-")[1] || "01"}-${field.value?.split("-")[2] || "01"}`
                                    )
                                  }
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
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="person1BirthTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              Birth Time
                            </FormLabel>
                            <FormControl>
                              <div className="grid grid-cols-2 gap-2">
                                {/* Hour */}
                                <Select
                                  value={field.value?.split(":")[0] || ""}
                                  onValueChange={(hour) =>
                                    field.onChange(
                                      `${hour}:${field.value?.split(":")[1] || "00"}`
                                    )
                                  }
                                >
                                  <SelectTrigger>
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
                                  value={field.value?.split(":")[1] || ""}
                                  onValueChange={(minute) =>
                                    field.onChange(
                                      `${field.value?.split(":")[0] || "00"}:${minute}`
                                    )
                                  }
                                >
                                  <SelectTrigger>
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
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="person1BirthPlace"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            Birth Place
                          </FormLabel>
                          <FormControl>
                            <LocationSearch
                              onLocationSelect={handleLocationSelect('person1BirthPlace')}
                              placeholder="Enter city name..."
                              value={field.value}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Person 2 */}
                  <div className="space-y-4 p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg border border-pink-200">
                    <h3 className="text-lg font-semibold text-pink-800 flex items-center gap-2">
                      <Heart className="w-5 h-5" />
                      Partner 2
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="person2Name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="person2Gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gender</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value || ""} defaultValue="">
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="person2BirthDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              Birth Date
                            </FormLabel>
                            <FormControl>
                              <div className="grid grid-cols-3 gap-2">
                                {/* Day */}
                                <Select
                                  value={field.value?.split("-")[2] || ""}
                                  onValueChange={(day) =>
                                    field.onChange(
                                      `${field.value?.split("-")[0] || "2000"}-${field.value?.split("-")[1] || "01"}-${day}`
                                    )
                                  }
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
                                  value={field.value?.split("-")[1] || ""}
                                  onValueChange={(month) =>
                                    field.onChange(
                                      `${field.value?.split("-")[0] || "2000"}-${month}-${field.value?.split("-")[2] || "01"}`
                                    )
                                  }
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
                                  value={field.value?.split("-")[0] || ""}
                                  onValueChange={(year) =>
                                    field.onChange(
                                      `${year}-${field.value?.split("-")[1] || "01"}-${field.value?.split("-")[2] || "01"}`
                                    )
                                  }
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
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="person2BirthTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              Birth Time
                            </FormLabel>
                            <FormControl>
                              <div className="grid grid-cols-2 gap-2">
                                {/* Hour */}
                                <Select
                                  value={field.value?.split(":")[0] || ""}
                                  onValueChange={(hour) =>
                                    field.onChange(
                                      `${hour}:${field.value?.split(":")[1] || "00"}`
                                    )
                                  }
                                >
                                  <SelectTrigger>
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
                                  value={field.value?.split(":")[1] || ""}
                                  onValueChange={(minute) =>
                                    field.onChange(
                                      `${field.value?.split(":")[0] || "00"}:${minute}`
                                    )
                                  }
                                >
                                  <SelectTrigger>
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
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="person2BirthPlace"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            Birth Place
                          </FormLabel>
                          <FormControl>
                            <LocationSearch
                              onLocationSelect={handleLocationSelect('person2BirthPlace')}
                              placeholder="Enter city name..."
                              value={field.value}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={mutation.isPending}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-3 text-lg font-semibold shadow-lg"
                  >
                    {mutation.isPending ? (
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    ) : (
                      <Heart className="w-5 h-5 mr-2" />
                    )}
                    {mutation.isPending ? 'Analyzing Compatibility...' : 'Calculate Love Compatibility'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Results Section */}
          {result && (
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-6 h-6" />
                  Compatibility Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Overall Score */}
                <div className="text-center p-6 bg-gradient-to-r from-pink-100 to-purple-100 rounded-lg">
                  <div className="text-4xl font-bold text-purple-600 mb-2">
                    {result.overallScore}%
                  </div>
                  <div className="text-lg text-gray-700">Overall Compatibility</div>
                  <div className="text-sm text-gray-500 mt-1">
                    Engine: {result.calculationEngine}
                  </div>
                </div>

                {/* Enhanced Synastry Analysis */}
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-purple-700 flex items-center gap-2">
                    <Star className="w-6 h-6" />
                    Detailed Synastry Analysis
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl border border-blue-200 shadow-md">
                      <div className="text-base font-semibold text-blue-700 mb-2 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Elemental Compatibility
                      </div>
                      <div className="text-3xl font-bold text-blue-600 mb-1">{result.synastryAnalysis.elementalCompatibility}%</div>
                      <div className="text-sm text-blue-600">Core personality & life approach harmony</div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-5 rounded-xl border border-indigo-200 shadow-md">
                      <div className="text-base font-semibold text-indigo-700 mb-2 flex items-center gap-2">
                        <Heart className="w-5 h-5" />
                        Lunar Harmony
                      </div>
                      <div className="text-3xl font-bold text-indigo-600 mb-1">{result.synastryAnalysis.lunarHarmony}%</div>
                      <div className="text-sm text-indigo-600">Emotional understanding & nurturing connection</div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-5 rounded-xl border border-pink-200 shadow-md">
                      <div className="text-base font-semibold text-pink-700 mb-2 flex items-center gap-2">
                        <Heart className="w-5 h-5" />
                        Venus Love Match
                      </div>
                      <div className="text-3xl font-bold text-pink-600 mb-1">{result.synastryAnalysis.venusCompatibility}%</div>
                      <div className="text-sm text-pink-600">Romance, affection & love expression styles</div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-red-50 to-red-100 p-5 rounded-xl border border-red-200 shadow-md">
                      <div className="text-base font-semibold text-red-700 mb-2 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Mars Passion Dynamics
                      </div>
                      <div className="text-3xl font-bold text-red-600 mb-1">{result.synastryAnalysis.marsHarmony}%</div>
                      <div className="text-sm text-red-600">Energy levels, drive & passionate connection</div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 p-5 rounded-xl border border-cyan-200 shadow-md md:col-span-2">
                      <div className="text-base font-semibold text-cyan-700 mb-2 flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Ascendant Match
                      </div>
                      <div className="text-3xl font-bold text-cyan-600 mb-1">{result.synastryAnalysis.ascendantMatch}%</div>
                      <div className="text-sm text-cyan-600">First impressions, outer personality & social compatibility</div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Detailed Analysis with Expanded Cards */}
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-purple-700 flex items-center gap-2">
                    <Heart className="w-6 h-6" />
                    Comprehensive Relationship Analysis
                  </h3>
                  
                  {/* Strengths Section - Expanded */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border-l-4 border-green-400 shadow-md">
                    <h4 className="font-bold text-green-700 mb-4 flex items-center gap-2 text-lg">
                      <TrendingUp className="w-6 h-6" />
                      Your Relationship Strengths
                    </h4>
                    <div className="space-y-4">
                      {result.detailedAnalysis.strengths.map((strength, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg border-l-3 border-green-300 shadow-sm">
                          <div className="text-green-800 leading-relaxed font-medium">
                            {strength}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Challenges Section - Expanded */}
                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-xl border-l-4 border-orange-400 shadow-md">
                    <h4 className="font-bold text-orange-700 mb-4 flex items-center gap-2 text-lg">
                      <AlertTriangle className="w-6 h-6" />
                      Growth Areas & Relationship Challenges
                    </h4>
                    <div className="space-y-4">
                      {result.detailedAnalysis.challenges.map((challenge, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg border-l-3 border-orange-300 shadow-sm">
                          <div className="text-orange-800 leading-relaxed font-medium">
                            {challenge}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommendations Section - Expanded */}
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-xl border-l-4 border-purple-400 shadow-md">
                    <h4 className="font-bold text-purple-700 mb-4 flex items-center gap-2 text-lg">
                      <Lightbulb className="w-6 h-6" />
                      Expert Relationship Recommendations
                    </h4>
                    <div className="space-y-4">
                      {result.detailedAnalysis.recommendations.map((recommendation, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg border-l-3 border-purple-300 shadow-sm">
                          <div className="text-purple-800 leading-relaxed font-medium">
                            {recommendation}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Personality Match Section - Enhanced */}
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl border-l-4 border-blue-400 shadow-md">
                    <h4 className="font-bold text-blue-700 mb-4 flex items-center gap-2 text-lg">
                      <Star className="w-6 h-6" />
                      Personality Compatibility Analysis
                    </h4>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                          {result.personalityMatch.compatibility} Match
                        </span>
                      </div>
                      <div className="text-blue-800 leading-relaxed font-medium">
                        {result.personalityMatch.description}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Relationship Predictions */}
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-purple-700 flex items-center gap-2">
                    <Calendar className="w-6 h-6" />
                    Future Relationship Outlook
                  </h3>
                  <div className="space-y-5">
                    <div className="bg-gradient-to-r from-blue-50 to-sky-50 p-6 rounded-xl border-l-4 border-blue-400 shadow-md">
                      <div className="font-bold text-blue-700 mb-3 text-lg flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        Short Term Prospects (Next 3 Months)
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="text-blue-800 leading-relaxed font-medium">
                          {result.relationshipPredictions.shortTerm}
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-indigo-50 to-violet-50 p-6 rounded-xl border-l-4 border-indigo-400 shadow-md">
                      <div className="font-bold text-indigo-700 mb-3 text-lg flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Long Term Future (1+ Years)
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="text-indigo-800 leading-relaxed font-medium">
                          {result.relationshipPredictions.longTerm}
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-6 rounded-xl border-l-4 border-pink-400 shadow-md">
                      <div className="font-bold text-pink-700 mb-3 text-lg flex items-center gap-2">
                        <Heart className="w-5 h-5" />
                        Marriage & Commitment Prospects
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="text-pink-800 leading-relaxed font-medium">
                          {result.relationshipPredictions.marriageProspects}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {mutation.isError && (
            <Card className="shadow-lg border-red-200">
              <CardContent className="p-6">
                <div className="text-red-600 text-center">
                  <p className="font-semibold">Analysis Failed</p>
                  <p className="text-sm">Please check your details and try again.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}