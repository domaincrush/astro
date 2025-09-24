import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from 'src/components/ui/card';
import { Button } from 'src/components/ui/button';
import { Input } from 'src/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from 'src/components/ui/form';
import LocationSearch from 'src/components/LocationSearch';
import AstroTickHeader from 'src/components/layout/AstroTickHeader';
import { Footer } from 'src/components/layout/Footer';
import { Loader2, Heart, Clock, MapPin, Calendar, Users, Star, Sparkles, TrendingUp, AlertTriangle, Lightbulb, AlertCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'src/components/ui/tabs';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from 'src/lib/queryClient';

const singlePersonSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  birthDate: z.string().min(1, 'Birth date is required'),
  birthTime: z.string().min(1, 'Birth time is required'),
  birthPlace: z.string().min(1, 'Birth place is required'),
});

const compatibilitySchema = z.object({
  person1Name: z.string().min(2, 'Name must be at least 2 characters'),
  person1BirthDate: z.string().min(1, 'Birth date is required'),
  person1BirthTime: z.string().min(1, 'Birth time is required'),
  person1BirthPlace: z.string().min(1, 'Birth place is required'),
  person1Gender: z.string().min(1, 'Gender is required'),
  
  person2Name: z.string().min(2, 'Name must be at least 2 characters'),
  person2BirthDate: z.string().min(1, 'Birth date is required'),
  person2BirthTime: z.string().min(1, 'Birth time is required'),
  person2BirthPlace: z.string().min(1, 'Birth place is required'),
  person2Gender: z.string().min(1, 'Gender is required'),
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
  const [singleResult, setSingleResult] = useState<LoveHoroscopeResult | null>(null);
  const [compatibilityResult, setCompatibilityResult] = useState<CompatibilityResult | null>(null);
  const [coordinates, setCoordinates] = useState<{latitude: number, longitude: number} | null>(null);
  const [coordinates2, setCoordinates2] = useState<{latitude: number, longitude: number} | null>(null);

  const singleForm = useForm<z.infer<typeof singlePersonSchema>>({
    resolver: zodResolver(singlePersonSchema),
    defaultValues: {
      name: '',
      birthDate: '',
      birthTime: '',
      birthPlace: '',
    },
  });

  const compatibilityForm = useForm<z.infer<typeof compatibilitySchema>>({
    resolver: zodResolver(compatibilitySchema),
    defaultValues: {
      person1Name: '',
      person1BirthDate: '',
      person1BirthTime: '',
      person1BirthPlace: '',
      person1Gender: '',
      person2Name: '',
      person2BirthDate: '',
      person2BirthTime: '',
      person2BirthPlace: '',
      person2Gender: '',
    },
  });

  const singleMutation = useMutation({
    mutationFn: async (data: z.infer<typeof singlePersonSchema>) => {
      const requestData = {
        ...data,
        latitude: coordinates?.latitude,
        longitude: coordinates?.longitude
      };
      console.log('Single person love horoscope request:', requestData);
      const response = await apiRequest('POST', '/api/love-horoscope/analysis', requestData);
      return await response.json();
    },
    onSuccess: (response: any) => {
      console.log('Raw API response:', response);
      if (response && typeof response === 'object') {
        setSingleResult(response);
        console.log('Single person love horoscope result received:', response);
      } else {
        console.error('Invalid response format:', response);
      }
    },
    onError: (error) => {
      console.error('Single person love horoscope error:', error);
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
        person1Latitude: coordinates?.latitude,
        person1Longitude: coordinates?.longitude,
        person2Name: data.person2Name,
        person2Gender: data.person2Gender,
        person2BirthDate: data.person2BirthDate,
        person2BirthTime: data.person2BirthTime,
        person2BirthPlace: data.person2BirthPlace,
        person2Latitude: coordinates2?.latitude,
        person2Longitude: coordinates2?.longitude,
      };
      console.log('Compatibility analysis request:', requestData);
      const response = await apiRequest('POST', '/api/love-compatibility/analysis', requestData);
      return await response.json();
    },
    onSuccess: (response: any) => {
      console.log('Raw compatibility API response:', response);
      if (response && typeof response === 'object') {
        setCompatibilityResult(response);
        console.log('Compatibility analysis result received:', response);
      } else {
        console.error('Invalid compatibility response format:', response);
      }
    },
    onError: (error) => {
      console.error('Compatibility analysis error:', error);
    },
  });

  const onSingleSubmit = (data: z.infer<typeof singlePersonSchema>) => {
    console.log('onSingleSubmit called with:', data);
    console.log('Coordinates:', coordinates);
    singleMutation.mutate(data);
  };

  const onCompatibilitySubmit = (data: z.infer<typeof compatibilitySchema>) => {
    compatibilityMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-rose-100">
      <AstroTickHeader />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Enhanced Header with Animated Elements */}
        <div className="text-center mb-12 relative">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 left-1/4 text-6xl opacity-20 animate-pulse">💖</div>
            <div className="absolute top-20 right-1/4 text-5xl opacity-25 animate-bounce">💘</div>
            <div className="absolute bottom-10 left-1/3 text-4xl opacity-30 animate-pulse delay-500">💕</div>
            <div className="absolute bottom-5 right-1/3 text-5xl opacity-20 animate-bounce delay-300">💗</div>
          </div>
          <div className="relative z-10">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-pink-600 via-rose-500 via-red-500 to-purple-600 bg-clip-text text-transparent mb-6 animate-pulse">
              💖 Love Horoscope
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-medium">
              Discover your romantic destiny, find your ideal partner, and get personalized love predictions based on authentic Vedic astrology
            </p>
          </div>
        </div>

        {/* Unified Love Analysis with Tabs */}
        <Card className="bg-white/80 backdrop-blur-md border-2 border-pink-200 shadow-2xl mb-8">
          <CardHeader className="bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-3 text-xl">
              <Heart className="h-7 w-7 animate-pulse" />
              Unified Love Analysis
              <Sparkles className="h-6 w-6 animate-bounce ml-auto" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <Tabs defaultValue="single" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-gradient-to-r from-pink-100 to-rose-100 p-1 rounded-lg">
                <TabsTrigger 
                  value="single" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-500 data-[state=active]:text-white flex items-center gap-2 py-3"
                >
                  <Heart className="h-4 w-4" />
                  Single Person Analysis
                </TabsTrigger>
                <TabsTrigger 
                  value="compatibility" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-500 data-[state=active]:text-white flex items-center gap-2 py-3"
                >
                  <Users className="h-4 w-4" />
                  Two-Person Compatibility
                </TabsTrigger>
              </TabsList>
              
              {/* Single Person Analysis Tab */}
              <TabsContent value="single" className="space-y-6">
                <div className="p-6 bg-gradient-to-r from-pink-50 via-rose-50 to-red-50 rounded-xl border-2 border-pink-200">
                  <h3 className="text-xl font-bold text-pink-800 mb-3 flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Your Personal Love Horoscope
                  </h3>
                  <p className="text-pink-700 mb-4">Discover your romantic nature, ideal partner traits, and current love prospects through personalized Vedic astrology analysis.</p>
                  
                  <Form {...singleForm}>
                    <form onSubmit={singleForm.handleSubmit(onSingleSubmit)} className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={singleForm.control}
                        name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-semibold flex items-center gap-2">
                          <Users className="h-4 w-4 text-pink-600" />
                          Full Name
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your full name" 
                            className="bg-gradient-to-r from-white to-pink-50 border-2 border-pink-200 focus:border-pink-500 focus:ring-pink-500/20 h-12 text-lg"
                            {...field} 
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
                        <FormLabel className="text-gray-700 font-semibold flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-pink-600" />
                          Birth Date
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            className="bg-gradient-to-r from-white to-pink-50 border-2 border-pink-200 focus:border-pink-500 focus:ring-pink-500/20 h-12 text-lg"
                            {...field} 
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
                        <FormLabel className="text-gray-700 font-semibold flex items-center gap-2">
                          <Clock className="h-4 w-4 text-pink-600" />
                          Birth Time
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="time" 
                            className="bg-gradient-to-r from-white to-pink-50 border-2 border-pink-200 focus:border-pink-500 focus:ring-pink-500/20 h-12 text-lg"
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
                        <FormLabel className="text-gray-700 font-semibold flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-pink-600" />
                          Birth Place
                        </FormLabel>
                        <FormControl>
                          <LocationSearch
                            value={field.value}
                            onChange={(location, latitude, longitude) => {
                              field.onChange(location);
                              if (latitude && longitude) {
                                setCoordinates({ latitude, longitude });
                              }
                              console.log('Love horoscope location selected:', location, { latitude, longitude });
                            }}
                            placeholder="Search your birth city..."
                            className="bg-gradient-to-r from-white to-pink-50 border-2 border-pink-200 focus:border-pink-500 focus:ring-pink-500/20 h-12 text-lg"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                      <Button 
                        type="submit" 
                        disabled={singleMutation.isPending}
                        onClick={(e) => {
                          console.log('Button clicked!', e);
                          console.log('Form values:', singleForm.getValues());
                          console.log('Form errors:', singleForm.formState.errors);
                        }}
                        className="md:col-span-2 bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 hover:from-pink-600 hover:via-rose-600 hover:to-red-600 text-white py-4 text-xl font-bold shadow-2xl hover:shadow-pink-300/50 transition-all duration-300"
                      >
                        {singleMutation.isPending ? (
                          <div className="flex items-center gap-3">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        Analyzing Love Destiny...
                        <Sparkles className="h-6 w-6 animate-pulse" />
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <Heart className="h-6 w-6 animate-pulse" />
                        Get Love Horoscope
                        <Sparkles className="h-6 w-6 animate-bounce" />
                      </div>
                        )}
                      </Button>
                    </form>
                  </Form>
                </div>
              </TabsContent>

              {/* Two-Person Compatibility Tab */}
              <TabsContent value="compatibility" className="space-y-6">
                <div className="p-6 bg-gradient-to-r from-purple-50 via-pink-50 to-rose-50 rounded-xl border-2 border-purple-200">
                  <h3 className="text-xl font-bold text-purple-800 mb-3 flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Two-Person Compatibility Analysis
                  </h3>
                  <p className="text-purple-700 mb-4">Get comprehensive synastry analysis comparing two birth charts for deep relationship insights and compatibility scores.</p>
                  
                  <Form {...compatibilityForm}>
                    <form onSubmit={compatibilityForm.handleSubmit(onCompatibilitySubmit)} className="space-y-8">
                      {/* Person 1 Details */}
                      <div className="grid md:grid-cols-2 gap-6 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                        <div className="md:col-span-2">
                          <h4 className="text-lg font-bold text-blue-800 mb-4 flex items-center gap-2">
                            <Heart className="h-5 w-5" />
                            Person 1 Details
                          </h4>
                        </div>
                        
                        <FormField
                          control={compatibilityForm.control}
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
                          control={compatibilityForm.control}
                          name="person1Gender"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Gender</FormLabel>
                              <FormControl>
                                <select {...field} className="w-full p-3 border rounded-lg">
                                  <option value="">Select Gender</option>
                                  <option value="male">Male</option>
                                  <option value="female">Female</option>
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
                                <Input type="date" {...field} />
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
                                <Input type="time" {...field} />
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
                                  onChange={(location, latitude, longitude) => {
                                    field.onChange(location);
                                    if (latitude && longitude) {
                                      setCoordinates({ latitude, longitude });
                                    }
                                  }}
                                  placeholder="Search birth city..."
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Person 2 Details */}
                      <div className="grid md:grid-cols-2 gap-6 p-6 bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg border border-pink-200">
                        <div className="md:col-span-2">
                          <h4 className="text-lg font-bold text-pink-800 mb-4 flex items-center gap-2">
                            <Heart className="h-5 w-5" />
                            Person 2 Details
                          </h4>
                        </div>
                        
                        <FormField
                          control={compatibilityForm.control}
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
                          control={compatibilityForm.control}
                          name="person2Gender"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Gender</FormLabel>
                              <FormControl>
                                <select {...field} className="w-full p-3 border rounded-lg">
                                  <option value="">Select Gender</option>
                                  <option value="male">Male</option>
                                  <option value="female">Female</option>
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
                                <Input type="date" {...field} />
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
                                <Input type="time" {...field} />
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
                                  onChange={(location, latitude, longitude) => {
                                    field.onChange(location);
                                    if (latitude && longitude) {
                                      setCoordinates2({ latitude, longitude });
                                    }
                                  }}
                                  placeholder="Search birth city..."
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Button 
                        type="submit" 
                        disabled={compatibilityMutation.isPending}
                        className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 hover:from-purple-600 hover:via-pink-600 hover:to-rose-600 text-white py-4 text-xl font-bold shadow-2xl transition-all duration-300"
                      >
                        {compatibilityMutation.isPending ? (
                          <div className="flex items-center gap-3">
                            <Loader2 className="h-6 w-6 animate-spin" />
                            Analyzing Compatibility...
                            <Sparkles className="h-6 w-6 animate-pulse" />
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <Users className="h-6 w-6" />
                            Calculate Compatibility
                            <Heart className="h-6 w-6 animate-pulse" />
                          </div>
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
            <div className="space-y-8">
              {/* Enhanced Love Profile */}
              <Card className="bg-white/80 backdrop-blur-md border-2 border-pink-200 shadow-2xl hover:shadow-pink-200/50 transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Users className="h-7 w-7 animate-pulse" />
                    💖 Your Love Profile
                    <Star className="h-6 w-6 animate-bounce ml-auto" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg border border-pink-200">
                        <div className="font-bold text-pink-800 text-lg">🌙 Moon Sign</div>
                        <div className="text-pink-700 text-xl">{singleResult.basicInfo.moonSign}</div>
                      </div>
                      <div className="p-4 bg-gradient-to-r from-rose-50 to-red-50 rounded-lg border border-rose-200">
                        <div className="font-bold text-rose-800 text-lg">♀ Venus Sign</div>
                        <div className="text-rose-700 text-xl">{singleResult.basicInfo.venusSign}</div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-200">
                        <div className="font-bold text-red-800 text-lg">♂ Mars Sign</div>
                        <div className="text-red-700 text-xl">{singleResult.basicInfo.marsSign}</div>
                      </div>
                      <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                        <div className="font-bold text-purple-800 text-lg">💕 Love Nature</div>
                        <div className="text-purple-700 text-xl">{singleResult.basicInfo.loveCompatibility}</div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 p-8 bg-gradient-to-r from-pink-50 via-rose-50 to-red-50 rounded-xl border-l-4 border-pink-400 shadow-lg">
                    <h4 className="font-bold text-pink-800 text-xl mb-6 flex items-center gap-2">
                      <Heart className="h-6 w-6 animate-pulse" />
                      💖 Your Romantic Style & Love Expression
                    </h4>
                    <div className="bg-white p-6 rounded-lg border border-pink-200 shadow-sm">
                      <p className="text-pink-700 text-lg leading-relaxed mb-4">{singleResult.lovePersonality.romanticNature}</p>
                      <div className="grid md:grid-cols-2 gap-4 mt-4">
                        <div className="p-3 bg-gradient-to-r from-pink-100 to-rose-100 rounded-lg border border-pink-200">
                          <span className="font-bold text-pink-800 text-sm">Venus Influence:</span>
                          <div className="text-pink-700 mt-1">Love expression through {singleResult.basicInfo.venusSign} brings intellectual charm and playful romantic communication</div>
                        </div>
                        <div className="p-3 bg-gradient-to-r from-rose-100 to-red-100 rounded-lg border border-rose-200">
                          <span className="font-bold text-rose-800 text-sm">Mars Energy:</span>
                          <div className="text-rose-700 mt-1">Passionate drive through {singleResult.basicInfo.marsSign} creates confident and enthusiastic romantic pursuit</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Compatibility & Timing */}
              <Card className="bg-white/80 backdrop-blur-md border-2 border-rose-200 shadow-2xl hover:shadow-rose-200/50 transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-rose-500 via-red-500 to-pink-500 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Star className="h-7 w-7 animate-pulse" />
                    💕 Compatibility & Timing
                    <Heart className="h-6 w-6 animate-bounce ml-auto" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="p-8 bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 rounded-xl border-l-4 border-green-400 shadow-lg">
                      <h4 className="font-bold text-green-800 text-xl mb-6 flex items-center gap-2">
                        <Star className="h-6 w-6 animate-pulse text-green-600" />
                        ✨ Your Perfect Zodiac Compatibility Matches
                      </h4>
                      <div className="bg-white p-6 rounded-lg border border-green-200 shadow-sm mb-4">
                        <div className="flex flex-wrap gap-4 mb-4">
                          {singleResult.relationshipAnalysis.bestMatches.map((match, index) => (
                            <span key={index} className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-6 py-3 rounded-full text-lg font-semibold border-2 border-green-300 shadow-md hover:scale-105 transition-transform">
                              {match} ♋
                            </span>
                          ))}
                        </div>
                        <div className="text-green-700 leading-relaxed">
                          <strong>Why These Signs Match You:</strong> Based on your Moon in {singleResult.basicInfo.moonSign}, Venus in {singleResult.basicInfo.venusSign}, and Mars in {singleResult.basicInfo.marsSign}, these zodiac signs offer the best emotional understanding, romantic chemistry, and passionate connection. Your intellectual approach to love pairs beautifully with these complementary energies.
                        </div>
                      </div>
                    </div>
                    <div className="p-8 bg-gradient-to-r from-blue-50 via-sky-50 to-cyan-50 rounded-xl border-l-4 border-blue-400 shadow-lg">
                      <h4 className="font-bold text-blue-800 text-xl mb-6 flex items-center gap-2">
                        <Clock className="h-6 w-6 animate-pulse text-blue-600" />
                        🌟 Current Love Transit & Relationship Timing
                      </h4>
                      <div className="bg-white p-6 rounded-lg border border-blue-200 shadow-sm">
                        <p className="text-blue-700 text-lg leading-relaxed mb-4">{singleResult.currentPeriod.relationship_prospects}</p>
                        <div className="grid md:grid-cols-2 gap-4 mt-4">
                          <div className="p-3 bg-gradient-to-r from-blue-100 to-sky-100 rounded-lg border border-blue-200">
                            <span className="font-bold text-blue-800 text-sm">Planetary Support:</span>
                            <div className="text-blue-700 mt-1">Current planetary transits strongly favor romantic connections and emotional bonding experiences</div>
                          </div>
                          <div className="p-3 bg-gradient-to-r from-sky-100 to-cyan-100 rounded-lg border border-sky-200">
                            <span className="font-bold text-sky-800 text-sm">Best Action Period:</span>
                            <div className="text-sky-700 mt-1">Next 3-6 months offer exceptional opportunities for meeting meaningful romantic partners</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Love Remedies */}
              <Card className="bg-white/80 backdrop-blur-md border-2 border-purple-200 shadow-2xl hover:shadow-purple-200/50 transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <Sparkles className="h-7 w-7 animate-pulse" />
                    🌟 Love Enhancement Remedies
                    <Heart className="h-6 w-6 animate-bounce ml-auto" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="space-y-6">
                    {singleResult.remedies.slice(0, 3).map((remedy, index) => (
                      <div key={index} className="p-6 bg-gradient-to-r from-purple-50 via-pink-50 to-rose-50 rounded-xl border-l-4 border-purple-500 shadow-lg">
                        <h4 className="font-bold text-purple-800 text-lg mb-3 flex items-center gap-2">
                          <Sparkles className="h-5 w-5 text-purple-600" />
                          {remedy.purpose}
                        </h4>
                        <p className="text-purple-700 text-lg leading-relaxed mb-4">{remedy.remedy}</p>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="p-3 bg-gradient-to-r from-pink-100 to-rose-100 rounded-lg border border-pink-200">
                            <span className="font-bold text-pink-800">⏰ Timing:</span>
                            <span className="text-pink-700 ml-2">{remedy.timing}</span>
                          </div>
                          <div className="p-3 bg-gradient-to-r from-rose-100 to-red-100 rounded-lg border border-rose-200">
                            <span className="font-bold text-rose-800">📅 Duration:</span>
                            <span className="text-rose-700 ml-2">{remedy.duration}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
        )}

        {/* Compatibility Results */}
        {compatibilityResult && (
          <div className="space-y-8">
            {/* Compatibility Score Overview */}
            <Card className="bg-white/80 backdrop-blur-md border-2 border-purple-200 shadow-2xl hover:shadow-purple-200/50 transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Users className="h-7 w-7 animate-pulse" />
                  💕 Love Compatibility Analysis
                  <Heart className="h-6 w-6 animate-bounce ml-auto" />
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full border-4 border-purple-300 mb-4">
                    <span className="text-4xl font-bold text-purple-600">{compatibilityResult.overallCompatibility}%</span>
                  </div>
                  <h3 className="text-2xl font-bold text-purple-800 mb-2">Overall Compatibility Score</h3>
                  <p className="text-purple-600 text-lg">
                    {compatibilityResult.overallCompatibility >= 80 ? "Excellent Match" :
                     compatibilityResult.overallCompatibility >= 60 ? "Good Compatibility" :
                     compatibilityResult.overallCompatibility >= 40 ? "Moderate Compatibility" : "Challenging Match"}
                  </p>
                </div>

                {/* Synastry Breakdown */}
                <div className="grid md:grid-cols-5 gap-4 mb-8">
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200 text-center">
                    <div className="text-2xl font-bold text-blue-600">{compatibilityResult.synastryAnalysis.elementalCompatibility}%</div>
                    <div className="text-blue-800 font-semibold text-sm">Elemental</div>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200 text-center">
                    <div className="text-2xl font-bold text-purple-600">{compatibilityResult.synastryAnalysis.lunarHarmony}%</div>
                    <div className="text-purple-800 font-semibold text-sm">Lunar</div>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg border border-pink-200 text-center">
                    <div className="text-2xl font-bold text-pink-600">{compatibilityResult.synastryAnalysis.venusCompatibility}%</div>
                    <div className="text-pink-800 font-semibold text-sm">Venus</div>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-200 text-center">
                    <div className="text-2xl font-bold text-red-600">{compatibilityResult.synastryAnalysis.marsHarmony}%</div>
                    <div className="text-red-800 font-semibold text-sm">Mars</div>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 text-center">
                    <div className="text-2xl font-bold text-green-600">{compatibilityResult.synastryAnalysis.ascendantMatch}%</div>
                    <div className="text-green-800 font-semibold text-sm">Ascendant</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Compatibility Analysis */}
            <Card className="bg-white/80 backdrop-blur-md border-2 border-pink-200 shadow-2xl hover:shadow-pink-200/50 transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Heart className="h-7 w-7 animate-pulse" />
                  💖 Detailed Relationship Analysis
                  <Sparkles className="h-6 w-6 animate-bounce ml-auto" />
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-8">
                  {/* Strengths */}
                  <div className="p-8 bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 rounded-xl border-l-4 border-green-400 shadow-lg">
                    <h4 className="font-bold text-green-800 text-xl mb-6 flex items-center gap-2">
                      <Star className="h-6 w-6 animate-pulse text-green-600" />
                      ✨ Relationship Strengths
                    </h4>
                    <div className="space-y-4">
                      {compatibilityResult.detailedAnalysis.strengths.map((strength, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg border border-green-200 shadow-sm">
                          <p className="text-green-700 text-lg leading-relaxed">{strength}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Challenges */}
                  <div className="p-8 bg-gradient-to-r from-orange-50 via-amber-50 to-yellow-50 rounded-xl border-l-4 border-orange-400 shadow-lg">
                    <h4 className="font-bold text-orange-800 text-xl mb-6 flex items-center gap-2">
                      <AlertCircle className="h-6 w-6 animate-pulse text-orange-600" />
                      ⚠️ Areas for Growth
                    </h4>
                    <div className="space-y-4">
                      {compatibilityResult.detailedAnalysis.challenges.map((challenge, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg border border-orange-200 shadow-sm">
                          <p className="text-orange-700 text-lg leading-relaxed">{challenge}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="p-8 bg-gradient-to-r from-blue-50 via-sky-50 to-cyan-50 rounded-xl border-l-4 border-blue-400 shadow-lg">
                    <h4 className="font-bold text-blue-800 text-xl mb-6 flex items-center gap-2">
                      <Lightbulb className="h-6 w-6 animate-pulse text-blue-600" />
                      💡 Relationship Recommendations
                    </h4>
                    <div className="space-y-4">
                      {compatibilityResult.detailedAnalysis.recommendations.map((recommendation, index) => (
                        <div key={index} className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
                          <p className="text-blue-700 text-lg leading-relaxed">{recommendation}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Future Predictions */}
            <Card className="bg-white/80 backdrop-blur-md border-2 border-rose-200 shadow-2xl hover:shadow-rose-200/50 transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-rose-500 via-red-500 to-pink-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Calendar className="h-7 w-7 animate-pulse" />
                  🔮 Relationship Future Predictions
                  <Heart className="h-6 w-6 animate-bounce ml-auto" />
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                    <h4 className="font-bold text-blue-800 text-lg mb-3">📅 Short-term (Next 6 Months)</h4>
                    <p className="text-blue-700 text-lg leading-relaxed">{compatibilityResult.relationshipPredictions.shortTerm}</p>
                  </div>
                  <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                    <h4 className="font-bold text-purple-800 text-lg mb-3">🌟 Long-term (Next 2 Years)</h4>
                    <p className="text-purple-700 text-lg leading-relaxed">{compatibilityResult.relationshipPredictions.longTerm}</p>
                  </div>
                  <div className="p-6 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl border border-pink-200">
                    <h4 className="font-bold text-pink-800 text-lg mb-3">💒 Marriage Prospects</h4>
                    <p className="text-pink-700 text-lg leading-relaxed">{compatibilityResult.relationshipPredictions.marriageProspects}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Educational Content - For users without results */}
        {!singleResult && !compatibilityResult && (
            <Card className="bg-white/80 backdrop-blur-md border-2 border-pink-200 shadow-2xl hover:shadow-pink-200/50 transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-rose-500 via-red-500 to-pink-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Star className="h-7 w-7 animate-pulse" />
                  💖 Love Horoscope Features
                  <Heart className="h-6 w-6 animate-bounce ml-auto" />
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-pink-50 via-rose-50 to-red-50 rounded-xl border-2 border-pink-200 shadow-lg hover:scale-105 transition-transform">
                    <div className="w-4 h-4 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full mt-2 animate-pulse"></div>
                    <div>
                      <h4 className="font-bold text-pink-800 text-lg mb-2">💕 Romantic Personality Analysis</h4>
                      <p className="text-pink-700 text-lg">Understand your love style, emotional needs, and romantic preferences through detailed planetary analysis</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-rose-50 via-red-50 to-pink-50 rounded-xl border-2 border-rose-200 shadow-lg hover:scale-105 transition-transform">
                    <div className="w-4 h-4 bg-gradient-to-r from-rose-500 to-red-500 rounded-full mt-2 animate-pulse"></div>
                    <div>
                      <h4 className="font-bold text-rose-800 text-lg mb-2">✨ Compatibility Matching</h4>
                      <p className="text-rose-700 text-lg">Find your best zodiac matches and discover ideal partner characteristics based on Venus and Mars positions</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-red-50 via-pink-50 to-purple-50 rounded-xl border-2 border-red-200 shadow-lg hover:scale-105 transition-transform">
                    <div className="w-4 h-4 bg-gradient-to-r from-red-500 to-purple-500 rounded-full mt-2 animate-pulse"></div>
                    <div>
                      <h4 className="font-bold text-red-800 text-lg mb-2">🌟 Love Transit Analysis</h4>
                      <p className="text-red-700 text-lg">Current planetary influences on your love life and relationships with detailed timing predictions</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-purple-50 via-pink-50 to-rose-50 rounded-xl border-2 border-purple-200 shadow-lg hover:scale-105 transition-transform">
                    <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mt-2 animate-pulse"></div>
                    <div>
                      <h4 className="font-bold text-purple-800 text-lg mb-2">💒 Marriage Timing</h4>
                      <p className="text-purple-700 text-lg">Auspicious periods for marriage and long-term commitments based on Jupiter and 7th house analysis</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-xl border-2 border-indigo-200 shadow-lg hover:scale-105 transition-transform">
                    <div className="w-4 h-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mt-2 animate-pulse"></div>
                    <div>
                      <h4 className="font-bold text-indigo-800 text-lg mb-2">🔮 Love Enhancement Remedies</h4>
                      <p className="text-indigo-700 text-lg">Powerful Vedic remedies to attract love and strengthen existing relationships with proper timing</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-8 bg-gradient-to-r from-pink-50 via-rose-50 to-red-50 rounded-xl border-2 border-pink-200 shadow-2xl">
                  <div className="flex items-start gap-4">
                    <Heart className="h-8 w-8 text-pink-600 mt-1 animate-pulse" />
                    <div>
                      <h4 className="font-bold text-pink-800 text-xl mb-4">💖 Complete Love Guidance</h4>
                      <p className="text-pink-700 text-lg leading-relaxed">
                        Get personalized advice for both singles seeking love and couples looking to strengthen 
                        their relationship based on your unique astrological profile. Our authentic Vedic astrology 
                        calculations provide deep insights into your romantic nature, compatibility patterns, ideal 
                        partner traits, marriage timing, and powerful remedies for love enhancement.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
        )}
      </div>

      <Footer />
    </div>
  );
}

