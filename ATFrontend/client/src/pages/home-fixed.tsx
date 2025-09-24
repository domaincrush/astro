import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "src/components/ui/card";
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "src/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormMessage } from "src/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Star, ChevronRight, MessageCircle, Phone, Heart, MapPin } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "src/components/ui/avatar";
import { LocationSearch } from "src/components/LocationSearch";
import { AstroTickHeader } from "src/components/layout/AstroTickHeader";
import { Footer } from "src/components/layout/Footer";
import { useToast } from "src/hooks/use-toast";
import { useAuth } from "src/hooks/useAuth";
import { queryClient } from "src/lib/queryClient";

const kundliSchema = z.object({
  name: z.string().min(1, "Name is required"),
  birthDate: z.string().min(1, "Birth date is required"),
  birthTime: z.string().min(1, "Birth time is required"),
  birthPlace: z.string().min(1, "Birth place is required"),
  gender: z.enum(["male", "female"], {
    required_error: "Please select gender",
  }),
});

const kundliMatchingSchema = z.object({
  boyName: z.string().min(1, "Boy's name is required"),
  boyBirthDate: z.string().min(1, "Boy's birth date is required"),
  boyBirthTime: z.string().min(1, "Boy's birth time is required"),
  boyBirthPlace: z.string().min(1, "Boy's birth place is required"),
  girlName: z.string().min(1, "Girl's name is required"),
  girlBirthDate: z.string().min(1, "Girl's birth date is required"),
  girlBirthTime: z.string().min(1, "Girl's birth time is required"),
  girlBirthPlace: z.string().min(1, "Girl's birth place is required"),
});

type KundliFormData = z.infer<typeof kundliSchema>;
type KundliMatchingFormData = z.infer<typeof kundliMatchingSchema>;

export default function Home() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // State for storing coordinates from location search
  const [kundliCoordinates, setKundliCoordinates] = useState<{latitude: number, longitude: number} | null>(null);

  const kundliForm = useForm<KundliFormData>({
    resolver: zodResolver(kundliSchema),
    defaultValues: {
      name: "",
      birthDate: "",
      birthTime: "",
      birthPlace: "",
      gender: undefined,
    },
  });

  const kundliMatchingForm = useForm<KundliMatchingFormData>({
    resolver: zodResolver(kundliMatchingSchema),
    defaultValues: {
      boyName: "",
      boyBirthDate: "",
      boyBirthTime: "",
      boyBirthPlace: "",
      girlName: "",
      girlBirthDate: "",
      girlBirthTime: "",
      girlBirthPlace: "",
    },
  });

  // Mock astrologers data
  const astrologers = [
    {
      id: 1,
      name: "Dr. Rajesh Sharma",
      experience: 15,
      rating: 4.8,
      specialties: ["Marriage", "Career", "Health"],
      ratePerMinute: 45,
      isOnline: true,
      image: "/api/placeholder/100/100"
    },
    {
      id: 2,
      name: "Priya Devi",
      experience: 12,
      rating: 4.9,
      specialties: ["Love", "Relationships", "Finance"],
      ratePerMinute: 50,
      isOnline: true,
      image: "/api/placeholder/100/100"
    },
    {
      id: 3,
      name: "Pandit Arun Kumar",
      experience: 20,
      rating: 4.7,
      specialties: ["Spiritual", "Remedies", "Business"],
      ratePerMinute: 60,
      isOnline: false,
      image: "/api/placeholder/100/100"
    }
  ];

  const onKundliSubmit = (data: KundliFormData) => {
    const params = new URLSearchParams({
      name: data.name,
      birthDate: data.birthDate,
      birthTime: data.birthTime,
      birthPlace: data.birthPlace,
      gender: data.gender,
      ...(kundliCoordinates && {
        latitude: kundliCoordinates.latitude.toString(),
        longitude: kundliCoordinates.longitude.toString(),
      }),
    });
    setLocation(`/kundli?${params.toString()}`);
  };

  const onKundliMatchingSubmit = (data: KundliMatchingFormData) => {
    const params = new URLSearchParams(data as any);
    setLocation(`/kundli-matching?${params.toString()}`);
  };

  const handleStartChat = async (astrologer?: any) => {
    if (!user?.id) {
      setLocation("/login");
      return;
    }

    const targetAstrologer = astrologer || astrologers.find(a => a.isOnline);
    if (!targetAstrologer) return;

    // Redirect to payment page with consultation details
    const paymentParams = new URLSearchParams({
      astrologer: targetAstrologer.id.toString(),
      service: 'chat',
      duration: '20',
      price: Math.round(targetAstrologer.ratePerMinute * 20 * 0.85).toString(), // 15% discount
      originalPrice: (targetAstrologer.ratePerMinute * 20).toString(),
      type: 'consultation'
    });
    
    setLocation(`/payment?${paymentParams.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AstroTickHeader />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-50 py-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* Left Content - Generate Kundli Card */}
            <div className="lg:col-span-1">
              <Card className="bg-white shadow-xl border-0 overflow-hidden rounded-3xl">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                      <Star className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Generate Kundli</h2>
                    <p className="text-gray-600 text-sm">Get your authentic birth chart analysis with precise planetary positions</p>
                  </div>

                  <Form {...kundliForm}>
                    <form onSubmit={kundliForm.handleSubmit(onKundliSubmit)} className="space-y-4">
                      <FormField
                        control={kundliForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input 
                                placeholder="Enter your full name" 
                                className="bg-white border-amber-200 focus:border-amber-500 focus:ring-amber-500/20 h-11"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-3">
                        <FormField
                          control={kundliForm.control}
                          name="birthDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input 
                                  type="date"
                                  className="bg-white border-amber-200 focus:border-amber-500 focus:ring-amber-500/20 h-11"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={kundliForm.control}
                          name="birthTime"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input 
                                  type="time"
                                  className="bg-white border-amber-200 focus:border-amber-500 focus:ring-amber-500/20 h-11"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={kundliForm.control}
                        name="birthPlace"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <LocationSearch
                                onLocationSelect={(location, coords) => {
                                  field.onChange(location);
                                  if (coords) {
                                    setKundliCoordinates(coords);
                                  }
                                }}
                                placeholder="Search city for birth place"
                                className="bg-white border-amber-200 focus:border-amber-500 focus:ring-amber-500/20 h-11"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={kundliForm.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger className="bg-white border-amber-200 focus:border-amber-500 focus:ring-amber-500/20 h-11">
                                  <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="male">Male</SelectItem>
                                  <SelectItem value="female">Female</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button 
                        type="submit"
                        className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white h-12 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        Generate Birth Chart
                        <ChevronRight className="ml-2 h-5 w-5" />
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
            
            {/* Right Content - Calculator Grid */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { title: "Moon Sign Checker", icon: "🌙", href: "/moon-sign-checker", gradient: "from-blue-500 to-indigo-600" },
                  { title: "Lagna Calculator", icon: "⭐", href: "/lagna-calculator", gradient: "from-purple-500 to-pink-600" },
                  { title: "Nakshatra Finder", icon: "✨", href: "/nakshatra-finder", gradient: "from-green-500 to-teal-600" },
                  { title: "Kundli Matching", icon: "💕", href: "/kundli-matching", gradient: "from-red-500 to-rose-600" },
                  { title: "Daily Panchang", icon: "📅", href: "/panchang", gradient: "from-yellow-500 to-orange-600" },
                  { title: "Dasha Calculator", icon: "🔮", href: "/dasha-calculator", gradient: "from-cyan-500 to-blue-600" }
                ].map((tool, index) => (
                  <Card 
                    key={index}
                    className="group hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white border-0 shadow-md overflow-hidden cursor-pointer"
                    onClick={() => setLocation(tool.href)}
                  >
                    <CardContent className="p-6 text-center">
                      <div className={`w-12 h-12 bg-gradient-to-br ${tool.gradient} rounded-xl mx-auto mb-3 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300`}>
                        {tool.icon}
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-1">{tool.title}</h3>
                      <div className={`w-8 h-0.5 bg-gradient-to-r ${tool.gradient} mx-auto rounded-full`}></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vedic Astrology Tools Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Vedic Astrology Tools</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover your cosmic blueprint with our comprehensive collection of authentic Vedic astrology calculators
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Moon Sign Checker",
                description: "Find your Rashi (Moon sign) for accurate astrological readings",
                icon: "🌕",
                gradient: "from-blue-500 to-indigo-600",
                href: "/moon-sign-checker"
              },
              {
                title: "Lagna Calculator", 
                description: "Calculate your Ascendant sign for precise birth chart analysis",
                icon: "⭐",
                gradient: "from-purple-500 to-pink-600",
                href: "/lagna-calculator"
              },
              {
                title: "Nakshatra Finder",
                description: "Discover your birth star and its astrological significance",
                icon: "✨", 
                gradient: "from-green-500 to-teal-600",
                href: "/nakshatra-finder"
              }
            ].map((tool, index) => (
              <Card 
                key={index}
                className="group hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] bg-white border-0 shadow-lg overflow-hidden cursor-pointer"
                onClick={() => setLocation(tool.href)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-50/30 to-orange-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardContent className="p-8 relative">
                  <div className={`w-16 h-16 bg-gradient-to-br ${tool.gradient} rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 text-2xl`}>
                    {tool.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{tool.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-center mb-6">{tool.description}</p>
                  <div className="text-center">
                    <Button 
                      className={`bg-gradient-to-r ${tool.gradient} hover:opacity-90 text-white px-6 py-2 rounded-lg transition-all duration-300`}
                    >
                      Try Now
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Expert Consultations Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Expert Astrology Consultations</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connect with experienced Vedic astrologers for personalized guidance and authentic insights
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {astrologers.slice(0, 3).map((astrologer) => (
              <Card 
                key={astrologer.id}
                className="group hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] bg-white border-0 shadow-lg overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-50/30 to-orange-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardContent className="p-6 relative">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="relative">
                      <Avatar className="h-16 w-16 border-2 border-amber-200">
                        <AvatarImage src={astrologer.image} alt={astrologer.name} />
                        <AvatarFallback className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold">
                          {astrologer.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      {astrologer.isOnline && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900">{astrologer.name}</h3>
                      <p className="text-sm text-gray-600">{astrologer.experience} years experience</p>
                      <div className="flex items-center space-x-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(astrologer.rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="text-sm text-gray-600 ml-2">({astrologer.rating})</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex flex-wrap gap-2">
                      {astrologer.specialties.slice(0, 3).map((specialty, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-gray-900">₹{astrologer.ratePerMinute}/min</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        astrologer.isOnline
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {astrologer.isOnline ? 'Available Now' : 'Busy'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => handleStartChat(astrologer)}
                      disabled={!astrologer.isOnline}
                      className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Chat Now
                    </Button>
                    <Button
                      variant="outline"
                      className="px-3 border-amber-200 hover:bg-amber-50"
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center">
            <Button 
              onClick={() => setLocation("/astrologers")}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-3 text-lg"
            >
              View All Astrologers
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}