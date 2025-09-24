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
import { Loader2, Star, Clock, MapPin, Calendar, Download, Eye } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from 'src/lib/queryClient';
import { Helmet } from "react-helmet-async";

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  birthDate: z.string().min(1, 'Birth date is required'),
  birthTime: z.string().min(1, 'Birth time is required'),
  birthPlace: z.string().min(1, 'Birth place is required'),
});

interface BrihatKundliResult {
  basicInfo: {
    name: string;
    birthDate: string;
    birthTime: string;
    birthPlace: string;
    moonSign: string;
    ascendant: string;
    sunSign: string;
    nakshatra: string;
  };
  planets: Array<{
    name: string;
    sign: string;
    house: number;
    degree: string;
    isRetrograde: boolean;
    status: string;
  }>;
  houses: Array<{
    number: number;
    sign: string;
    lord: string;
    planets: string[];
    significance: string;
  }>;
  dasha: {
    current: string;
    remaining: string;
    next: string;
  };
  yogas: Array<{
    name: string;
    description: string;
    strength: string;
  }>;
  doshas: Array<{
    name: string;
    status: string;
    description: string;
    remedies: string[];
  }>;
  predictions: {
    general: string;
    career: string;
    marriage: string;
    health: string;
    finance: string;
  };
}

export default function BrihatKundli() {
  const [result, setResult] = useState<BrihatKundliResult | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      birthDate: '',
      birthTime: '',
      birthPlace: '',
    },
  });

  const calculateMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const response = await apiRequest('POST', '/api/birth-chart/detailed', data);
      return response.json();
    },
    onSuccess: (data) => {
      setResult(data);
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    calculateMutation.mutate(data);
  };

  return (
    <>
      <Helmet>
        <title>Brihat Kundli | Detailed Birth Chart Analysis - AstroTick</title>
        <meta name="description" content="Get comprehensive Brihat Kundli with detailed planetary positions, houses analysis, and astrological predictions. Professional Vedic birth chart reading online." />
        <meta name="keywords" content="brihat kundli, detailed birth chart, vedic horoscope, planetary positions, houses analysis, astrological predictions, kundli analysis" />
        <link rel="canonical" href="https://astrotick.com/brihat-kundli" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Brihat Kundli - Detailed Birth Chart Analysis | AstroTick" />
        <meta property="og:description" content="Get comprehensive Brihat Kundli with detailed planetary analysis and predictions based on authentic Vedic astrology." />
        <meta property="og:url" content="https://astrotick.com/brihat-kundli" />
        <meta property="og:type" content="website" />
        
        {/* Twitter */}
        <meta property="twitter:title" content="Brihat Kundli - Detailed Birth Chart Analysis | AstroTick" />
        <meta property="twitter:description" content="Get comprehensive Brihat Kundli with detailed planetary analysis and predictions based on authentic Vedic astrology." />
        
        {/* Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Brihat Kundli Generator",
            "description": "Comprehensive birth chart analysis tool for detailed astrological insights",
            "url": "https://astrotick.com/brihat-kundli",
            "applicationCategory": "Lifestyle"
          })}
        </script>
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-purple-50">
        <AstroTickHeader />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Brihat Kundli (Detailed Birth Chart)
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get a comprehensive analysis of your birth chart with detailed planetary positions, houses, yogas, doshas, and life predictions
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="bg-white/90 backdrop-blur-sm border-orange-200 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Star className="h-6 w-6" />
                Birth Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your full name" 
                            className="bg-white border-orange-200 focus:border-orange-500 focus:ring-orange-500/20"
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
                            className="bg-white border-orange-200 focus:border-orange-500 focus:ring-orange-500/20"
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
                            className="bg-white border-orange-200 focus:border-orange-500 focus:ring-orange-500/20"
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
                            onChange={(value) => field.onChange(value)}
                            placeholder="Enter birth place"
                            className="bg-white border-orange-200 focus:border-orange-500 focus:ring-orange-500/20"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    disabled={calculateMutation.isPending}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white h-12 text-lg"
                  >
                    {calculateMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Generating Detailed Chart...
                      </>
                    ) : (
                      <>
                        <Star className="mr-2 h-5 w-5" />
                        Generate Brihat Kundli
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Results */}
          {result && (
            <div className="space-y-6">
              {/* Basic Information */}
              <Card className="bg-white/90 backdrop-blur-sm border-orange-200 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><strong>Name:</strong> {result.basicInfo.name}</div>
                    <div><strong>Birth Date:</strong> {result.basicInfo.birthDate}</div>
                    <div><strong>Birth Time:</strong> {result.basicInfo.birthTime}</div>
                    <div><strong>Birth Place:</strong> {result.basicInfo.birthPlace}</div>
                    <div><strong>Moon Sign:</strong> {result.basicInfo.moonSign}</div>
                    <div><strong>Ascendant:</strong> {result.basicInfo.ascendant}</div>
                    <div><strong>Sun Sign:</strong> {result.basicInfo.sunSign}</div>
                    <div><strong>Nakshatra:</strong> {result.basicInfo.nakshatra}</div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600">
                  <Eye className="mr-2 h-4 w-4" />
                  View Full Report
                </Button>
                <Button className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600">
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
              </div>
            </div>
          )}

          {/* Sample Report Preview */}
          {!result && (
            <Card className="bg-white/90 backdrop-blur-sm border-orange-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <CardTitle>Brihat Kundli Features</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Complete Planetary Analysis</h4>
                      <p className="text-sm text-gray-600">Detailed positions, strengths, and influences of all planets</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-gray-800">House-wise Predictions</h4>
                      <p className="text-sm text-gray-600">Comprehensive analysis of all 12 houses and their significance</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Yoga & Dosha Detection</h4>
                      <p className="text-sm text-gray-600">Identification of beneficial yogas and harmful doshas with remedies</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Dasha Periods</h4>
                      <p className="text-sm text-gray-600">Current and upcoming planetary periods with predictions</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Life Predictions</h4>
                      <p className="text-sm text-gray-600">Career, marriage, health, and financial prospects</p>
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
    </>
  );
}