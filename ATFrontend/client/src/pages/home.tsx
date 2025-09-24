import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import { Label } from "src/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "src/components/ui/tabs";
import { Badge } from "src/components/ui/badge";
import { useToast } from "src/hooks/use-toast";
import { useAuth } from "src/hooks/useAuth";
import { useLocation, Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Star, 
  Users, 
  Moon, 
  Calendar, 
  Heart, 
  Clock, 
  TrendingUp, 
  Shield,
  Crown,
  Sparkles,
  ChevronRight,
  Award,
  MessageCircle,
  BookOpen,
  Gift,
  Target,
  Zap,
  Globe,
  CheckCircle,
  ArrowRight,
  Play,
  BarChart3,
  Compass,
  Sun,
  MapPin,
  Timer,
  PhoneCall,
  Video,
  Lightbulb,
  Gem,
  TrendingDown,
  AlertCircle,
  Info,
  Hand,
  Hash,
  Home,
  Calculator,
  Building,
  DollarSign,
  Plane,
  FileSpreadsheet
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "src/components/ui/avatar";
import LocationSearch from "src/components/LocationSearch";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";
import LatestAstrologyTopics from "src/components/LatestAstrologyTopics";
import LazyImage from "src/components/ui/enhanced-lazy-image";
import SEOHead from "src/components/seo/SEOHead";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "src/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "src/components/ui/select";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useClickTracking, usePageTracking, useAstrologyAnalytics } from "src/hooks/useAnalytics";
import { useLanguage } from "src/contexts/LanguageContext";

// Enhanced form schemas
const kundliSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  birthDate: z.string().min(1, "Birth date is required"),
  birthTime: z.string().min(1, "Birth time is required"),
  birthPlace: z.string().min(1, "Birth place is required"),
  gender: z.enum(["male", "female"]),
});

const kundliMatchingSchema = z.object({
  boyName: z.string().min(2, "Boy's name is required"),
  boyBirthDate: z.string().min(1, "Boy's birth date is required"),
  boyBirthTime: z.string().min(1, "Boy's birth time is required"),
  boyBirthPlace: z.string().min(1, "Boy's birth place is required"),
  girlName: z.string().min(2, "Girl's name is required"),
  girlBirthDate: z.string().min(1, "Girl's birth date is required"),
  girlBirthTime: z.string().min(1, "Girl's birth time is required"),
  girlBirthPlace: z.string().min(1, "Girl's birth place is required"),
});

type KundliFormData = z.infer<typeof kundliSchema>;
type KundliMatchingFormData = z.infer<typeof kundliMatchingSchema>;

function EnhancedHome() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const { t, currentLanguage } = useLanguage();
  
  // Analytics tracking hooks
  const { trackClick, trackCTA } = useClickTracking();
  const { trackKundli, trackCalculator, trackAstrologerProfile } = useAstrologyAnalytics();
  usePageTracking(); // Automatically track page views
  const [kundliCoordinates, setKundliCoordinates] = useState<{latitude: number, longitude: number} | null>(null);
  const [matchingCoordinates, setMatchingCoordinates] = useState<{
    boy: {latitude: number, longitude: number} | null,
    girl: {latitude: number, longitude: number} | null
  }>({ boy: null, girl: null });
  const [activeTab, setActiveTab] = useState("generate");
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  


  // Form setup
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

  // Fetch today's panchang for daily insights
  const { data: todaysPanchang } = useQuery({
    queryKey: ['/api/panchang/today'],
    // Removed auto-refresh to prevent unnecessary API calls
  });

  // Fetch live astrologer status
  const { data: astrologers } = useQuery({
    queryKey: ['/api/astrologers'],
    // Removed auto-refresh to prevent unnecessary API calls
  });

  // Enhanced testimonials
  const testimonials = [
    {
      name: "Priya Sharma",
      location: "Mumbai, India",
      rating: 5,
      text: "AstroTick's premium report predicted my career change with incredible accuracy. The detailed analysis helped me make the right decisions at the right time.",
      service: "Premium Life Report",
      verified: true
    },
    {
      name: "Raj Patel",
      location: "Delhi, India", 
      rating: 5,
      text: "The kundli matching for my marriage was spot on. Every aspect mentioned in the report matched our relationship perfectly. Highly recommended!",
      service: "Kundli Matching",
      verified: true
    },
    {
      name: "Anita Reddy",
      location: "Hyderabad, India",
      rating: 5,
      text: "Dr. Sharma's consultation changed my life. The remedies provided actually worked and I got my dream job within 3 months.",
      service: "Astrologer Consultation",
      verified: true
    }
  ];

  // Enhanced service cards with detailed information (AstroYogi/AstroSage inspired)
  const enhancedServices = [
    {
      icon: <Moon className="h-6 w-6" />,
      title: "Moon Sign Checker",
      description: "Discover your emotional nature and mental tendencies",
      path: "/moon-sign-checker",
      color: "bg-blue-500",
      features: ["Instant calculation", "Detailed personality analysis", "Compatibility insights"]
    },
    {
      icon: <Star className="h-6 w-6" />,
      title: "Lagna Calculator", 
      description: "Find your ascendant and life path direction",
      path: "/lagna-calculator",
      color: "bg-purple-500",
      features: ["Precise ascendant", "Life direction", "Strength analysis"]
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: "Nakshatra Finder",
      description: "Uncover your birth star's influence",
      path: "/nakshatra-finder", 
      color: "bg-pink-500",
      features: ["27 Nakshatras", "Deity connection", "Lucky elements"]
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Kundli Matching",
      description: "Complete compatibility analysis for marriage",
      path: "/kundli-matching",
      color: "bg-red-500",
      features: ["36 Guna matching", "Dosha analysis", "Compatibility score"]
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: "Daily Panchang",
      description: "Today's auspicious timings and festivals",
      path: "/panchang",
      color: "bg-green-500",
      features: ["Live timings", "Muhurat", "Festival alerts"]
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Dasha Calculator",
      description: "Planetary periods and their effects",
      path: "/dasha-calculator",
      color: "bg-orange-500",
      features: ["Mahadasha periods", "Predictions", "Remedies"]
    },
    {
      icon: <AlertCircle className="h-6 w-6" />,
      title: "Dosham Detector",
      description: "Detect and analyze doshas in your birth chart",
      path: "/dosham-detector",
      color: "bg-red-600",
      features: ["Manglik analysis", "Kaal Sarp dosha", "Remedial solutions"]
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Lucky Numbers",
      description: "Find your lucky numbers and dates",
      path: "/lucky-numbers",
      color: "bg-yellow-500",
      features: ["Personal numbers", "Lucky dates", "Color recommendations"]
    },
    {
      icon: <Gem className="h-6 w-6" />,
      title: "Baby Naming",
      description: "Choose auspicious names for your newborn",
      path: "/baby-naming",
      color: "bg-indigo-500",
      features: ["Nakshatra based", "Letter suggestions", "Meaning analysis"]
    },
    {
      icon: <Sun className="h-6 w-6" />,
      title: "Daily Horoscope",
      description: "Your personalized daily predictions",
      path: "/daily-horoscope",
      color: "bg-yellow-600",
      features: ["Daily insights", "Lucky hours", "Remedial tips"]
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Sade Sati",
      description: "Saturn's 7.5-year cycle analysis",
      path: "/sade-sati",
      color: "bg-gray-600",
      features: ["Current phase", "Effects analysis", "Remedial measures"]
    },
    {
      icon: <Lightbulb className="h-6 w-6" />,
      title: "Lal Kitab",
      description: "Unique remedies from Lal Kitab system",
      path: "/lal-kitab",
      color: "bg-red-700",
      features: ["Simple remedies", "Practical solutions", "Authentic methods"]
    }
  ];

  // Statistics - World-class numbers
  const stats = [
    { label: "Happy Customers", value: "2.5M+", icon: <Users className="h-5 w-5" /> },
    { label: "Reports Generated", value: "5.2M+", icon: <BookOpen className="h-5 w-5" /> },
    { label: "Expert Astrologers", value: "100+", icon: <Star className="h-5 w-5" /> },
    { label: "Years Experience", value: "20+", icon: <Award className="h-5 w-5" /> }
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);



  const onKundliSubmit = (data: KundliFormData) => {
    console.log("Form submitted with data:", data);
    console.log("Coordinates:", kundliCoordinates);
    
    // Track kundli generation
    trackKundli({ location: data.birthPlace, date: data.birthDate });
    trackCTA('Generate Kundli', 'homepage_form', 'kundli_generation');
    
    if (!kundliCoordinates || kundliCoordinates.latitude === 0 || kundliCoordinates.longitude === 0) {
      toast({
        title: "Location Required",
        description: "Please select your birth place from the suggestions",
        variant: "destructive"
      });
      return;
    }

    const params = new URLSearchParams({
      name: data.name,
      date: data.birthDate,
      time: data.birthTime,
      location: data.birthPlace,
      gender: data.gender,
      latitude: kundliCoordinates.latitude.toString(),
      longitude: kundliCoordinates.longitude.toString(),
    });
    
    console.log("Navigating to:", `/kundli?${params.toString()}`);
    setLocation(`/kundli?${params.toString()}`);
  };

  const onKundliMatchingSubmit = (data: KundliMatchingFormData) => {
    console.log("Kundli matching form submitted with data:", data);
    console.log("Matching coordinates:", matchingCoordinates);
    console.log("Form errors:", kundliMatchingForm.formState.errors);
    
    // Track kundli matching
    trackCalculator('kundli_matching', { 
      boyLocation: data.boyBirthPlace, 
      girlLocation: data.girlBirthPlace 
    });
    trackCTA('Check Compatibility', 'homepage_form', 'kundli_matching');
    
    if (!matchingCoordinates.boy || !matchingCoordinates.girl) {
      toast({
        title: "Locations Required",
        description: "Please select birth places for both partners",
        variant: "destructive"
      });
      return;
    }

    const params = new URLSearchParams({
      boyName: data.boyName,
      boyBirthDate: data.boyBirthDate,
      boyBirthTime: data.boyBirthTime,
      boyBirthPlace: data.boyBirthPlace,
      girlName: data.girlName,
      girlBirthDate: data.girlBirthDate,
      girlBirthTime: data.girlBirthTime,
      girlBirthPlace: data.girlBirthPlace,
      boyLatitude: matchingCoordinates.boy.latitude.toString(),
      boyLongitude: matchingCoordinates.boy.longitude.toString(),
      girlLatitude: matchingCoordinates.girl.latitude.toString(),
      girlLongitude: matchingCoordinates.girl.longitude.toString(),
    });
    
    console.log("Navigating to kundli-matching with params:", params.toString());
    setLocation(`/kundli-matching?${params.toString()}`);
  };

  const handleStartChat = async (astrologer?: any) => {
    // Track consultation start attempt
    trackCTA('Start Chat', 'homepage_banner', 'consultation_booking');
    
    if (!user?.id) {
      trackClick('login_redirect', 'authentication', { source: 'consultation_attempt' });
      setLocation("/login");
      return;
    }

    const targetAstrologer = astrologer || astrologers?.find((a: any) => a.isOnline);
    if (!targetAstrologer) return;

    // Track astrologer selection
    trackAstrologerProfile(targetAstrologer.id, targetAstrologer.name);

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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-orange-200 to-amber-200 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-full animate-bounce"></div>
          <div className="absolute bottom-20 left-40 w-20 h-20 bg-gradient-to-r from-amber-200 to-yellow-200 rounded-full animate-pulse"></div>
          <div className="absolute bottom-40 right-40 w-28 h-28 bg-gradient-to-r from-orange-200 to-red-200 rounded-full animate-bounce"></div>
        </div>
      <SEOHead 
        title="AstroTick - Free Kundli, Daily Horoscope & Professional Astrology Consultation"
        description="Get your free Kundli, daily horoscope, birth chart analysis, and authentic Vedic astrology predictions. Professional astrology consultation with certified expert astrologers."
        keywords="free kundli, daily horoscope, vedic astrology, birth chart, astrology consultation, online astrologer, kundli matching, astrological predictions"
        url="https://astrotick.com"
        type="website"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "AstroTick",
          "url": "https://astrotick.com",
          "description": "Professional Vedic astrology platform offering free Kundli generation, daily horoscopes, and expert consultations",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://astrotick.com/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        }}
      />
      <AstroTickHeader />
      


      {/* Free Premium Report Button - Above Hero */}
      <section className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 py-3 relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <Button
              onClick={() => {
                console.log('Free Premium Report button clicked');
                trackClick('free-premium-report-header');
                setLocation('/reports/premium');
              }}
              className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 text-lg font-bold rounded-full shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer relative z-50"
              style={{ pointerEvents: 'all' }}
            >
              <Crown className="h-5 w-5 mr-2" />
              🎉 Free Premium Report 🎉
            </Button>
          </div>
        </div>
      </section>
      
      {/* Enhanced Hero Section */}
      <section className="relative py-12 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-amber-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            
            {/* Left Content - Astrology Services */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:pr-8"
            >
              <div className="text-center lg:text-left mb-8">
                <h2 className="text-3xl font-bold text-orange-900 mb-4">
                  Free Astrology Services
                </h2>
                <p className="text-xl text-orange-700">
                  Comprehensive collection of Vedic astrology tools and services for all your spiritual needs
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {/* Free Services Quicklinks */}
                <div className="group">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 cursor-pointer"
                         onClick={() => setLocation('/kundli')}>
                      <Star className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-sm font-semibold text-orange-900 cursor-pointer" onClick={() => setLocation('/kundli')}>Free Kundli</h3>
                  </div>
                </div>

                <div className="group">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 cursor-pointer"
                         onClick={() => setLocation('/kundli-matching')}>
                      <Heart className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-sm font-semibold text-orange-900 cursor-pointer" onClick={() => setLocation('/kundli-matching')}>Kundli Matching</h3>
                  </div>
                </div>

                <div className="group">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 cursor-pointer"
                         onClick={() => setLocation('/panchang')}>
                      <Calendar className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-sm font-semibold text-orange-900 cursor-pointer" onClick={() => setLocation('/panchang')}>Daily Panchang</h3>
                  </div>
                </div>

                <div className="group">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 cursor-pointer"
                         onClick={() => setLocation('/daily-horoscope')}>
                      <Sun className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-sm font-semibold text-orange-900 cursor-pointer" onClick={() => setLocation('/daily-horoscope')}>Daily Horoscope</h3>
                  </div>
                </div>

                <div className="group">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 cursor-pointer"
                         onClick={() => setLocation('/moon-sign-checker')}>
                      <Moon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-sm font-semibold text-orange-900 cursor-pointer" onClick={() => setLocation('/moon-sign-checker')}>Moon Sign</h3>
                  </div>
                </div>

                <div className="group">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 cursor-pointer"
                         onClick={() => setLocation('/nakshatra-finder')}>
                      <Sparkles className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-sm font-semibold text-orange-900 cursor-pointer" onClick={() => setLocation('/nakshatra-finder')}>Nakshatra Finder</h3>
                  </div>
                </div>

                <div className="group">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 cursor-pointer"
                         onClick={() => setLocation('/dasha-calculator')}>
                      <Clock className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-sm font-semibold text-orange-900 cursor-pointer" onClick={() => setLocation('/dasha-calculator')}>Dasha Calculator</h3>
                  </div>
                </div>

                <div className="group">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-rose-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 cursor-pointer"
                         onClick={() => setLocation('/numerology')}>
                      <Hash className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-sm font-semibold text-orange-900 cursor-pointer" onClick={() => setLocation('/numerology')}>Numerology</h3>
                  </div>
                </div>

                <div className="group">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 cursor-pointer"
                         onClick={() => setLocation('/lagna-calculator')}>
                      <Star className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-sm font-semibold text-orange-900 cursor-pointer" onClick={() => setLocation('/lagna-calculator')}>Lagna Calculator</h3>
                  </div>
                </div>

                <div className="group">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 cursor-pointer"
                         onClick={() => setLocation('/dosham-detector')}>
                      <AlertCircle className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-sm font-semibold text-orange-900 cursor-pointer" onClick={() => setLocation('/dosham-detector')}>Dosham Detector</h3>
                  </div>
                </div>

                <div className="group">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-gray-500 to-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 cursor-pointer"
                         onClick={() => setLocation('/sade-sati')}>
                      <Clock className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-sm font-semibold text-orange-900 cursor-pointer" onClick={() => setLocation('/sade-sati')}>Sade Sati Calculator</h3>
                  </div>
                </div>

                <div className="group">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-red-700 to-red-800 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 cursor-pointer"
                         onClick={() => setLocation('/lal-kitab')}>
                      <Lightbulb className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-sm font-semibold text-orange-900 cursor-pointer" onClick={() => setLocation('/lal-kitab')}>Lal Kitab Status</h3>
                  </div>
                </div>

                <div className="group">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 cursor-pointer"
                         onClick={() => setLocation('/baby-naming')}>
                      <Users className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-sm font-semibold text-orange-900 cursor-pointer" onClick={() => setLocation('/baby-naming')}>Baby Name Generator</h3>
                  </div>
                </div>

                <div className="group">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 cursor-pointer"
                         onClick={() => setLocation('/lucky-numbers')}>
                      <Target className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-sm font-semibold text-orange-900 cursor-pointer" onClick={() => setLocation('/lucky-numbers')}>Lucky Numbers</h3>
                  </div>
                </div>



              </div>
            </motion.div>

            {/* Right Content - Enhanced Forms */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 rounded-3xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-orange-600 to-amber-600 text-white">
                  <CardTitle className="text-center text-2xl font-bold">
                    <Sparkles className="h-6 w-6 inline mr-2" />
                    Free Kundli
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-2 mb-8">
                      <TabsTrigger value="generate" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white">
                        <Star className="h-4 w-4 mr-2" />
                        Generate Kundli
                      </TabsTrigger>
                      <TabsTrigger value="matching" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white">
                        <Heart className="h-4 w-4 mr-2" />
                        Kundli Matching
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="generate">
                      <Form {...kundliForm}>
                        <form onSubmit={kundliForm.handleSubmit(onKundliSubmit)} className="space-y-6">
                          <FormField
                            control={kundliForm.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter your full name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={kundliForm.control}
                              name="birthDate"
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
                              control={kundliForm.control}
                              name="birthTime"
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
                          </div>

                          <FormField
                            control={kundliForm.control}
                            name="birthPlace"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Birth Place</FormLabel>
                                <FormControl>
                                  <LocationSearch
                                    value={field.value}
                                    onChange={(location, latitude, longitude) => {
                                      field.onChange(location);
                                      if (latitude && longitude) {
                                        setKundliCoordinates({
                                          latitude,
                                          longitude
                                        });
                                      }
                                    }}
                                    placeholder="Search your birth city..."
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
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <Button type="submit" className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white py-3 text-lg font-semibold">
                            <Sparkles className="h-5 w-5 mr-2" />
                            Generate My Kundli
                          </Button>
                        </form>
                      </Form>
                    </TabsContent>

                    <TabsContent value="matching">
                      <Form {...kundliMatchingForm}>
                        <form onSubmit={kundliMatchingForm.handleSubmit(onKundliMatchingSubmit)} className="space-y-6">
                          {/* Boy's Details */}
                          <div className="bg-blue-50 p-6 rounded-xl">
                            <h3 className="text-lg font-semibold text-blue-900 mb-4">Groom's Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={kundliMatchingForm.control}
                                name="boyName"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Groom's name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={kundliMatchingForm.control}
                                name="boyBirthDate"
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
                                control={kundliMatchingForm.control}
                                name="boyBirthTime"
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
                                control={kundliMatchingForm.control}
                                name="boyBirthPlace"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Birth Place</FormLabel>
                                    <FormControl>
                                      <LocationSearch
                                        value={field.value}
                                        onChange={(location, latitude, longitude) => {
                                          field.onChange(location);
                                          if (latitude && longitude) {
                                            setMatchingCoordinates(prev => ({
                                              ...prev,
                                              boy: {
                                                latitude,
                                                longitude
                                              }
                                            }));
                                          }
                                        }}
                                        placeholder="Groom's birth city..."
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>

                          {/* Girl's Details */}
                          <div className="bg-pink-50 p-6 rounded-xl">
                            <h3 className="text-lg font-semibold text-pink-900 mb-4">Bride's Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={kundliMatchingForm.control}
                                name="girlName"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Bride's name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={kundliMatchingForm.control}
                                name="girlBirthDate"
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
                                control={kundliMatchingForm.control}
                                name="girlBirthTime"
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
                                control={kundliMatchingForm.control}
                                name="girlBirthPlace"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Birth Place</FormLabel>
                                    <FormControl>
                                      <LocationSearch
                                        value={field.value}
                                        onChange={(location, latitude, longitude) => {
                                          field.onChange(location);
                                          if (latitude && longitude) {
                                            setMatchingCoordinates(prev => ({
                                              ...prev,
                                              girl: {
                                                latitude,
                                                longitude
                                              }
                                            }));
                                          }
                                        }}
                                        placeholder="Bride's birth city..."
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>

                          <Button type="submit" className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white py-3 text-lg font-semibold">
                            <Heart className="h-5 w-5 mr-2" />
                            Check Compatibility
                          </Button>
                        </form>
                      </Form>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Today's Astrology Prediction - Zodiac Section */}
      <section className="py-16 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-orange-900 mb-4">
              Today's Astrology Prediction
            </h2>
            <p className="text-xl text-orange-700">
              Discover what the stars have in store for your zodiac sign today
            </p>
          </div>

          {/* Zodiac Signs Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-8">
            {/* Aries */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="group cursor-pointer"
              onClick={() => setLocation('/daily-horoscope/aries')}
            >
              <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-amber-100 hover:border-amber-200 text-center">
                <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                  <img 
                    src="/api/zodiac-images/aries"
                    alt="Aries" 
                    className="w-12 h-12 opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                    onLoad={() => {}}
                    onError={(e) => {
                      // Zodiac images removed from production
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
                <h3 className="text-sm font-semibold text-amber-700 group-hover:text-amber-800">Aries</h3>
              </div>
            </motion.div>

            {/* Taurus */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="group cursor-pointer"
              onClick={() => setLocation('/daily-horoscope/taurus')}
            >
              <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-amber-100 hover:border-amber-200 text-center">
                <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                  <img 
                    src="/api/zodiac-images/taurus"
                    alt="Taurus" 
                    className="w-12 h-12 opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                    onLoad={() => {}}
                    onError={(e) => {
                      // Zodiac images removed from production
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
                <h3 className="text-sm font-semibold text-amber-700 group-hover:text-amber-800">Taurus</h3>
              </div>
            </motion.div>

            {/* Gemini */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="group cursor-pointer"
              onClick={() => setLocation('/daily-horoscope/gemini')}
            >
              <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-amber-100 hover:border-amber-200 text-center">
                <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                  <img 
                    src="/api/zodiac-images/gemini" 
                    alt="Gemini" 
                    className="w-12 h-12 opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
                <h3 className="text-sm font-semibold text-amber-700 group-hover:text-amber-800">Gemini</h3>
              </div>
            </motion.div>

            {/* Cancer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="group cursor-pointer"
              onClick={() => setLocation('/daily-horoscope/cancer')}
            >
              <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-amber-100 hover:border-amber-200 text-center">
                <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                  <img 
                    src="/api/zodiac-images/cancer" 
                    alt="Cancer" 
                    className="w-12 h-12 opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
                <h3 className="text-sm font-semibold text-amber-700 group-hover:text-amber-800">Cancer</h3>
              </div>
            </motion.div>

            {/* Leo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="group cursor-pointer"
              onClick={() => setLocation('/daily-horoscope/leo')}
            >
              <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-amber-100 hover:border-amber-200 text-center">
                <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                  <img 
                    src="/api/zodiac-images/leo" 
                    alt="Leo" 
                    className="w-12 h-12 opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
                <h3 className="text-sm font-semibold text-amber-700 group-hover:text-amber-800">Leo</h3>
              </div>
            </motion.div>

            {/* Virgo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="group cursor-pointer"
              onClick={() => setLocation('/daily-horoscope/virgo')}
            >
              <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-amber-100 hover:border-amber-200 text-center">
                <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                  <img 
                    src="/api/zodiac-images/virgo" 
                    alt="Virgo" 
                    className="w-12 h-12 opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
                <h3 className="text-sm font-semibold text-amber-700 group-hover:text-amber-800">Virgo</h3>
              </div>
            </motion.div>

            {/* Libra */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="group cursor-pointer"
              onClick={() => setLocation('/daily-horoscope/libra')}
            >
              <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-amber-100 hover:border-amber-200 text-center">
                <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                  <img 
                    src="/api/zodiac-images/libra" 
                    alt="Libra" 
                    className="w-12 h-12 opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
                <h3 className="text-sm font-semibold text-amber-700 group-hover:text-amber-800">Libra</h3>
              </div>
            </motion.div>

            {/* Scorpio */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="group cursor-pointer"
              onClick={() => setLocation('/daily-horoscope/scorpio')}
            >
              <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-amber-100 hover:border-amber-200 text-center">
                <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                  <img 
                    src="/api/zodiac-images/scorpio" 
                    alt="Scorpio" 
                    className="w-12 h-12 opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
                <h3 className="text-sm font-semibold text-amber-700 group-hover:text-amber-800">Scorpio</h3>
              </div>
            </motion.div>

            {/* Sagittarius */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="group cursor-pointer"
              onClick={() => setLocation('/daily-horoscope/sagittarius')}
            >
              <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-amber-100 hover:border-amber-200 text-center">
                <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                  <img 
                    src="/api/zodiac-images/sagittarius" 
                    alt="Sagittarius" 
                    className="w-12 h-12 opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
                <h3 className="text-sm font-semibold text-amber-700 group-hover:text-amber-800">Sagittarius</h3>
              </div>
            </motion.div>

            {/* Capricorn */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="group cursor-pointer"
              onClick={() => setLocation('/daily-horoscope/capricorn')}
            >
              <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-amber-100 hover:border-amber-200 text-center">
                <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                  <img 
                    src="/api/zodiac-images/capricorn" 
                    alt="Capricorn" 
                    className="w-12 h-12 opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
                <h3 className="text-sm font-semibold text-amber-700 group-hover:text-amber-800">Capricorn</h3>
              </div>
            </motion.div>

            {/* Aquarius */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
              className="group cursor-pointer"
              onClick={() => setLocation('/daily-horoscope/aquarius')}
            >
              <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-amber-100 hover:border-amber-200 text-center">
                <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                  <img 
                    src="/api/zodiac-images/aquarius" 
                    alt="Aquarius" 
                    className="w-12 h-12 opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
                <h3 className="text-sm font-semibold text-amber-700 group-hover:text-amber-800">Aquarius</h3>
              </div>
            </motion.div>

            {/* Pisces */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="group cursor-pointer"
              onClick={() => setLocation('/daily-horoscope/pisces')}
            >
              <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-amber-100 hover:border-amber-200 text-center">
                <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                  <img 
                    src="/api/zodiac-images/pisces" 
                    alt="Pisces" 
                    className="w-12 h-12 opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
                <h3 className="text-sm font-semibold text-amber-700 group-hover:text-amber-800">Pisces</h3>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Live Astrologers Section */}
      <section className="py-16 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-orange-900 mb-4">
              Chat with Expert Astrologers
            </h2>
            <p className="text-xl text-orange-700">
              Get personalized guidance from certified Vedic astrology experts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {astrologers?.slice(0, 3).map((astrologer: any, index: number) => {
              const astrologerNameSlug = astrologer.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
              return (
                <Card 
                  key={index} 
                  className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50 cursor-pointer"
                  onClick={() => setLocation(`/astrologer/${astrologerNameSlug}`)}
                >
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <Avatar className="w-16 h-16 border-2 border-amber-200">
                      <AvatarImage 
                        src={astrologer.image || `/astrologer-images/${astrologer.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}.jpg`} 
                        alt={astrologer.name}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-gradient-to-br from-amber-400 to-orange-400 text-white font-bold text-xl">
                        {astrologer.name?.charAt(0) || 'A'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${astrologer.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      <span className={`text-sm font-medium ${astrologer.isOnline ? 'text-green-600' : 'text-gray-500'}`}>
                        {astrologer.isOnline ? 'Online' : 'Offline'}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {astrologer.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {astrologer.experience} years experience
                  </p>

                  <div className="flex items-center mb-4">
                    <div className="flex items-center text-amber-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="ml-1 font-semibold">{astrologer.rating}</span>
                    </div>
                    <span className="text-gray-500 text-sm ml-2">
                      ({astrologer.reviews || 0} reviews)
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {astrologer.specialties?.map((specialty: string, specIndex: number) => (
                      <Badge key={specIndex} variant="secondary" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <span className="text-2xl font-bold text-amber-600">
                        ₹{astrologer.ratePerMinute}
                      </span>
                      <span className="text-gray-500 text-sm">/min</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Video className="h-4 w-4 text-gray-400" />
                      <PhoneCall className="h-4 w-4 text-gray-400" />
                      <MessageCircle className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartChat(astrologer);
                      }}
                      className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                      disabled={!astrologer.isOnline}
                    >
                      {astrologer.isOnline ? (
                        <>
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Start Chat
                        </>
                      ) : (
                        <>
                          <Clock className="h-4 w-4 mr-2" />
                          Offline
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        setLocation(`/astrologer/${astrologerNameSlug}`);
                      }}
                      className="border-amber-200 hover:bg-amber-50"
                    >
                      <Users className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Button
              onClick={() => setLocation("/astrologers")}
              size="lg"
              variant="outline"
              className="border-amber-500 text-amber-600 hover:bg-amber-50"
            >
              View All Astrologers
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>





      {/* Latest Astrology Topics Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest Astrology Topics</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stay updated with the latest astrological insights and planetary movements for August & September 2025
            </p>
          </div>
          <LatestAstrologyTopics />
        </div>
      </section>

      {/* Daily Insights Section */}
      {todaysPanchang?.data && (
        <section className="py-16 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-orange-900 mb-4">
                Today's Cosmic Insights
              </h2>
              <p className="text-xl text-orange-700">
                Live astrological data for better decision making
              </p>
            </div>

            {/* First Row - Five Elements of Panchang */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 h-full">
                <CardContent className="p-6 h-full flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4">
                    <Moon className="h-8 w-8 text-blue-600" />
                    <Badge className="bg-blue-600 text-white text-xs px-2 py-1">Live</Badge>
                  </div>
                  <div className="flex-1 text-center">
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">Tithi</h3>
                    <p className="text-xl font-bold text-blue-600 mb-1">{todaysPanchang.data.tithi?.name}</p>
                    <p className="text-sm text-blue-700">{todaysPanchang.data.tithi?.percentage}% complete</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 h-full">
                <CardContent className="p-6 h-full flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4">
                    <Star className="h-8 w-8 text-purple-600" />
                    <Badge className="bg-purple-600 text-white text-xs px-2 py-1">Live</Badge>
                  </div>
                  <div className="flex-1 text-center">
                    <h3 className="text-lg font-semibold text-purple-900 mb-2">Nakshatra</h3>
                    <p className="text-xl font-bold text-purple-600 mb-1">{todaysPanchang.data.nakshatra?.name}</p>
                    <p className="text-sm text-purple-700">{todaysPanchang.data.nakshatra?.percentage}% complete</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 h-full">
                <CardContent className="p-6 h-full flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4">
                    <Zap className="h-8 w-8 text-indigo-600" />
                    <Badge className="bg-indigo-600 text-white text-xs px-2 py-1">Live</Badge>
                  </div>
                  <div className="flex-1 text-center">
                    <h3 className="text-lg font-semibold text-indigo-900 mb-2">Yoga</h3>
                    <p className="text-xl font-bold text-indigo-600 mb-1">{todaysPanchang.data.yoga?.name}</p>
                    <p className="text-sm text-indigo-700">Until {todaysPanchang.data.yoga?.end_time}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200 h-full">
                <CardContent className="p-6 h-full flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4">
                    <Target className="h-8 w-8 text-teal-600" />
                    <Badge className="bg-teal-600 text-white text-xs px-2 py-1">Live</Badge>
                  </div>
                  <div className="flex-1 text-center">
                    <h3 className="text-lg font-semibold text-teal-900 mb-2">Karana</h3>
                    <p className="text-xl font-bold text-teal-600 mb-1">{todaysPanchang.data.karana?.name}</p>
                    <p className="text-sm text-teal-700">Until {todaysPanchang.data.karana?.end_time}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 h-full">
                <CardContent className="p-6 h-full flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4">
                    <Calendar className="h-8 w-8 text-amber-600" />
                    <Badge className="bg-amber-600 text-white text-xs px-2 py-1">Today</Badge>
                  </div>
                  <div className="flex-1 text-center">
                    <h3 className="text-lg font-semibold text-amber-900 mb-2">Vara</h3>
                    <p className="text-xl font-bold text-amber-600 mb-1">{todaysPanchang.data.vara?.english}</p>
                    <p className="text-sm text-amber-700">Lord: {todaysPanchang.data.vara?.planet_lord}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Second Row - Timing Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-rose-50 to-rose-100 border-rose-200 h-full">
                <CardContent className="p-6 h-full flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4">
                    <Sun className="h-8 w-8 text-rose-600" />
                    <Badge className="bg-rose-600 text-white text-xs px-2 py-1">Sunrise</Badge>
                  </div>
                  <div className="flex-1 text-center">
                    <h3 className="text-lg font-semibold text-rose-900 mb-2">Sunrise</h3>
                    <p className="text-xl font-bold text-rose-600 mb-1">{todaysPanchang.data.sunrise}</p>
                    <p className="text-sm text-rose-700">Day begins</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200 h-full">
                <CardContent className="p-6 h-full flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4">
                    <Moon className="h-8 w-8 text-slate-600" />
                    <Badge className="bg-slate-600 text-white text-xs px-2 py-1">Sunset</Badge>
                  </div>
                  <div className="flex-1 text-center">
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Sunset</h3>
                    <p className="text-xl font-bold text-slate-600 mb-1">{todaysPanchang.data.sunset}</p>
                    <p className="text-sm text-slate-700">Day ends</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 h-full">
                <CardContent className="p-6 h-full flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4">
                    <AlertCircle className="h-8 w-8 text-red-600" />
                    <Badge className="bg-red-600 text-white text-xs px-2 py-1">Avoid</Badge>
                  </div>
                  <div className="flex-1 text-center">
                    <h3 className="text-lg font-semibold text-red-900 mb-2">Rahu Kaal</h3>
                    <p className="text-xl font-bold text-red-600 mb-1">{todaysPanchang.data.inauspicious_timings?.rahu_kaal?.start}</p>
                    <p className="text-sm text-red-700">to {todaysPanchang.data.inauspicious_timings?.rahu_kaal?.end}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 h-full">
                <CardContent className="p-6 h-full flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                    <Badge className="bg-green-600 text-white text-xs px-2 py-1">Auspicious</Badge>
                  </div>
                  <div className="flex-1 text-center">
                    <h3 className="text-lg font-semibold text-green-900 mb-2">Abhijit Muhurta</h3>
                    <p className="text-xl font-bold text-green-600 mb-1">{todaysPanchang.data.auspicious_timings?.abhijit_muhurta?.start}</p>
                    <p className="text-sm text-green-700">to {todaysPanchang.data.auspicious_timings?.abhijit_muhurta?.end}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Third Row - Additional Timing Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200 h-full">
                <CardContent className="p-6 h-full flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4">
                    <Timer className="h-8 w-8 text-cyan-600" />
                    <Badge className="bg-cyan-600 text-white text-xs px-2 py-1">Sacred</Badge>
                  </div>
                  <div className="flex-1 text-center">
                    <h3 className="text-lg font-semibold text-cyan-900 mb-2">Brahma Muhurta</h3>
                    <p className="text-xl font-bold text-cyan-600 mb-1">{todaysPanchang.data.auspicious_timings?.brahma_muhurta?.start}</p>
                    <p className="text-sm text-cyan-700">to {todaysPanchang.data.auspicious_timings?.brahma_muhurta?.end}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 h-full">
                <CardContent className="p-6 h-full flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4">
                    <TrendingDown className="h-8 w-8 text-orange-600" />
                    <Badge className="bg-orange-600 text-white text-xs px-2 py-1">Avoid</Badge>
                  </div>
                  <div className="flex-1 text-center">
                    <h3 className="text-lg font-semibold text-orange-900 mb-2">Yamaganda</h3>
                    <p className="text-xl font-bold text-orange-600 mb-1">{todaysPanchang.data.inauspicious_timings?.yamaganda?.start}</p>
                    <p className="text-sm text-orange-700">to {todaysPanchang.data.inauspicious_timings?.yamaganda?.end}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-violet-50 to-violet-100 border-violet-200 h-full">
                <CardContent className="p-6 h-full flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4">
                    <Info className="h-8 w-8 text-violet-600" />
                    <Badge className="bg-violet-600 text-white text-xs px-2 py-1">Location</Badge>
                  </div>
                  <div className="flex-1 text-center">
                    <h3 className="text-lg font-semibold text-violet-900 mb-2">Location</h3>
                    <p className="text-xl font-bold text-violet-600 mb-1">Delhi</p>
                    <p className="text-sm text-violet-700">IST Timezone</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}





      {/* Premium Services Section */}
      <section className="py-16 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-orange-900 mb-4">
              Premium Astrology Reports
            </h2>
            <p className="text-xl text-orange-700">
              Unlock deeper insights with our comprehensive professional reports
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-8">
                <Crown className="h-12 w-12 mb-4" />
                <h3 className="text-2xl font-bold mb-4">Premium Life Report</h3>
                <p className="text-indigo-100 mb-6">
                  Complete 82-section analysis covering all life aspects with predictions and remedies
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-indigo-100">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Detailed planetary analysis
                  </div>
                  <div className="flex items-center text-indigo-100">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Career & finance predictions
                  </div>
                  <div className="flex items-center text-indigo-100">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Health & relationships
                  </div>
                  <div className="flex items-center text-indigo-100">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Remedial measures
                  </div>
                </div>
                <Button className="w-full bg-white text-indigo-600 hover:bg-indigo-50"
                        onClick={() => setLocation('/premium-report')}>
                  <Crown className="h-4 w-4 mr-2" />
                  Get Premium Report
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-600 to-cyan-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-8">
                <MessageCircle className="h-12 w-12 mb-4" />
                <h3 className="text-2xl font-bold mb-4">Expert Consultation</h3>
                <p className="text-blue-100 mb-6">
                  Personal 1-on-1 guidance from certified Vedic astrologers
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-blue-100">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Live chat & video calls
                  </div>
                  <div className="flex items-center text-blue-100">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Personalized solutions
                  </div>
                  <div className="flex items-center text-blue-100">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Multiple specializations
                  </div>
                  <div className="flex items-center text-blue-100">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    24/7 availability
                  </div>
                </div>
                <Button className="w-full bg-white text-blue-600 hover:bg-blue-50"
                        onClick={() => setLocation('/astrologers')}>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Chat with Expert
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-600 to-teal-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-8">
                <BarChart3 className="h-12 w-12 mb-4" />
                <h3 className="text-2xl font-bold mb-4">Yearly Predictions</h3>
                <p className="text-green-100 mb-6">
                  Annual forecast with monthly breakdowns and important dates
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-green-100">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    12-month detailed forecast
                  </div>
                  <div className="flex items-center text-green-100">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Important dates & events
                  </div>
                  <div className="flex items-center text-green-100">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Career & finance guidance
                  </div>
                  <div className="flex items-center text-green-100">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Monthly updates
                  </div>
                </div>
                <Button className="w-full bg-white text-green-600 hover:bg-green-50"
                        onClick={() => setLocation('/premium-report')}>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Yearly Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>



      {/* Enhanced Testimonials Section */}
      <section className="py-16 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-orange-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-orange-700">
              Trusted by thousands of satisfied customers worldwide
            </p>
          </div>

          <div className="relative">
            <Card className="bg-white border-0 shadow-2xl max-w-4xl mx-auto">
              <CardContent className="p-12">
                <div className="text-center">
                  <div className="flex justify-center mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-6 w-6 text-amber-500 fill-current" />
                    ))}
                  </div>
                  
                  <blockquote className="text-xl text-gray-700 mb-8 italic leading-relaxed">
                    "{testimonials[currentTestimonial].text}"
                  </blockquote>
                  
                  <div className="flex items-center justify-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center text-white font-bold">
                      {testimonials[currentTestimonial].name.charAt(0)}
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900">
                          {testimonials[currentTestimonial].name}
                        </p>
                        {testimonials[currentTestimonial].verified && (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                      <p className="text-gray-600 text-sm">
                        {testimonials[currentTestimonial].location}
                      </p>
                      <p className="text-amber-600 text-sm">
                        {testimonials[currentTestimonial].service}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial indicators */}
            <div className="flex justify-center mt-8 gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial ? 'bg-amber-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Comprehensive Astrology Guide Section */}
      <section className="py-20 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 relative overflow-hidden">
        {/* Background cosmic elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-96 h-96 border border-orange-200/20 rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 border border-orange-200/20 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-orange-200/10 rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Header */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-orange-900">
                🔮 Unlock Your Destiny with AstroTick
              </h2>
              <p className="text-xl md:text-2xl text-orange-700 max-w-4xl mx-auto leading-relaxed">
                Your Gateway to Vedic Astrology, Horoscopes & Expert Consultations
              </p>
              <p className="text-lg text-orange-600 max-w-5xl mx-auto mt-6 leading-relaxed">
                AstroTick is your one-stop destination for personalized astrology predictions, in-depth birth chart analysis, and transformative insights rooted in ancient Vedic wisdom. Whether you're seeking guidance in love, career, health, or spiritual growth, our expert astrologers are here to illuminate your path and help you make empowered decisions.
              </p>
            </motion.div>
          </div>

          {/* What is Astrology Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-16"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-orange-200/30">
              <h3 className="text-3xl font-bold mb-6 flex items-center text-orange-900">
                <Star className="h-8 w-8 mr-3 text-amber-500" />
                🌟 What Is Astrology?
              </h3>
              <p className="text-lg text-orange-700 leading-relaxed mb-4">
                Astrology is an ancient science that studies the influence of celestial bodies—planets, stars, and constellations—on human life. By analyzing your natal chart or kundli, astrologers interpret how planetary positions at the time of your birth shape your personality, behavior, relationships, and life events.
              </p>
              <p className="text-lg text-orange-700 leading-relaxed">
                There are several branches of astrology, with Vedic astrology (Jyotish Shastra) being one of the most accurate and time-tested systems. It includes concepts like dashas (planetary periods), nakshatras (constellations), and transits (Gochara)—each offering deep insight into your karmic blueprint.
              </p>
            </div>
          </motion.div>

          {/* Why Astrology Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-16"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-orange-200/30">
              <h3 className="text-3xl font-bold mb-6 flex items-center text-orange-900">
                <Shield className="h-8 w-8 mr-3 text-amber-500" />
                🧿 Why Astrology? The Need in Today's Modern World
              </h3>
              <p className="text-lg text-orange-700 leading-relaxed mb-6">
                In an age of uncertainty, astrology provides clarity and foresight. Here's why astrology matters more than ever:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-orange-100/50 rounded-2xl p-6 border border-orange-200/30">
                  <div className="flex items-center mb-3">
                    <Target className="h-6 w-6 text-amber-600 mr-3" />
                    <h4 className="text-xl font-semibold text-orange-900">🔍 Self-Discovery</h4>
                  </div>
                  <p className="text-orange-700">Understand your true nature, talents, and limitations.</p>
                </div>

                <div className="bg-orange-100/50 rounded-2xl p-6 border border-orange-200/30">
                  <div className="flex items-center mb-3">
                    <Heart className="h-6 w-6 text-amber-600 mr-3" />
                    <h4 className="text-xl font-semibold text-orange-900">💑 Relationship Compatibility</h4>
                  </div>
                  <p className="text-orange-700">Discover romantic compatibility through kundli matching and synastry.</p>
                </div>

                <div className="bg-orange-100/50 rounded-2xl p-6 border border-orange-200/30">
                  <div className="flex items-center mb-3">
                    <TrendingUp className="h-6 w-6 text-amber-600 mr-3" />
                    <h4 className="text-xl font-semibold text-orange-900">💼 Career Guidance</h4>
                  </div>
                  <p className="text-orange-700">Choose the right career path based on your planetary strengths.</p>
                </div>

                <div className="bg-orange-100/50 rounded-2xl p-6 border border-orange-200/30">
                  <div className="flex items-center mb-3">
                    <Clock className="h-6 w-6 text-amber-600 mr-3" />
                    <h4 className="text-xl font-semibold text-orange-900">⏳ Timing is Everything</h4>
                  </div>
                  <p className="text-orange-700">Leverage muhurats and favorable planetary periods for important decisions.</p>
                </div>

                <div className="bg-orange-100/50 rounded-2xl p-6 border border-orange-200/30">
                  <div className="flex items-center mb-3">
                    <Sparkles className="h-6 w-6 text-amber-600 mr-3" />
                    <h4 className="text-xl font-semibold text-orange-900">💫 Spiritual Growth</h4>
                  </div>
                  <p className="text-orange-700">Align with your soul's purpose and evolve spiritually.</p>
                </div>

                <div className="bg-orange-100/50 rounded-2xl p-6 border border-orange-200/30">
                  <div className="flex items-center mb-3">
                    <Shield className="h-6 w-6 text-amber-600 mr-3" />
                    <h4 className="text-xl font-semibold text-orange-900">🛡️ Remedial Measures</h4>
                  </div>
                  <p className="text-orange-700">Neutralize negative planetary effects with remedies like mantras, gemstones, and rituals.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Our Services Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-16"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-orange-200/30">
              <h3 className="text-3xl font-bold mb-8 flex items-center text-orange-900">
                <Globe className="h-8 w-8 mr-3 text-amber-500" />
                🗺️ Explore Our Astrology Services
              </h3>
              <p className="text-lg text-orange-700 leading-relaxed mb-8">
                AstroTick brings the power of astrology to your fingertips with real-time guidance, intelligent tools, and verified astrologers available 24/7.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl p-6 border border-blue-400/30">
                  <h4 className="text-xl font-bold mb-3 flex items-center">
                    <Sun className="h-6 w-6 mr-2 text-orange-400" />
                    🪐 Vedic Astrology (Jyotish)
                  </h4>
                  <p className="text-orange-700">Explore your dashas, nakshatras, yogas, and planetary placements to decode your destiny.</p>
                </div>

                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-purple-400/30">
                  <h4 className="text-xl font-bold mb-3 flex items-center">
                    <Globe className="h-6 w-6 mr-2 text-blue-400" />
                    🌍 Western Astrology
                  </h4>
                  <p className="text-orange-700">Understand your personality, life cycles, and transits based on the Sun sign system and psychological archetypes.</p>
                </div>

                <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-2xl p-6 border border-red-400/30">
                  <h4 className="text-xl font-bold mb-3 flex items-center">
                    <Hash className="h-6 w-6 mr-2 text-yellow-400" />
                    🧘 Chinese & Numerology Systems
                  </h4>
                  <p className="text-orange-700">Tap into ancient Chinese astrology, numerology, and elements to broaden your cosmic understanding.</p>
                </div>

                <div className="bg-gradient-to-br from-pink-500/20 to-rose-500/20 rounded-2xl p-6 border border-pink-400/30">
                  <h4 className="text-xl font-bold mb-3 flex items-center">
                    <Heart className="h-6 w-6 mr-2 text-pink-400" />
                    💕 Love & Marriage Compatibility
                  </h4>
                  <p className="text-orange-700">Get your kundli matched, find auspicious marriage dates, and gain insights into relationship harmony.</p>
                </div>

                <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl p-6 border border-green-400/30">
                  <h4 className="text-xl font-bold mb-3 flex items-center">
                    <TrendingUp className="h-6 w-6 mr-2 text-green-400" />
                    💼 Career & Finance Readings
                  </h4>
                  <p className="text-orange-700">Plan your career or business with precision using career astrology and financial forecasting.</p>
                </div>

                <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl p-6 border border-indigo-400/30">
                  <h4 className="text-xl font-bold mb-3 flex items-center">
                    <Lightbulb className="h-6 w-6 mr-2 text-yellow-400" />
                    🕉️ Remedies & Healing
                  </h4>
                  <p className="text-orange-700">Get personalized astrological remedies including gemstone suggestions, yantras, rituals, and spiritual practices.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Birth Chart Analysis Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mb-16"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-orange-200/30">
              <h3 className="text-3xl font-bold mb-6 flex items-center text-orange-900">
                <Target className="h-8 w-8 mr-3 text-amber-500" />
                🧭 Personalized Birth Chart (Kundli) Analysis
              </h3>
              <p className="text-lg text-orange-700 leading-relaxed mb-6">
                Your birth chart, or natal chart, is a cosmic map of your life. At AstroTick, our astrologers create detailed horoscope charts using your date, time, and place of birth to deliver:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                    <span className="text-orange-700">✅ Personality insights</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                    <span className="text-orange-700">✅ Strengths & weaknesses</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                    <span className="text-orange-700">✅ Timing for success</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                    <span className="text-orange-700">✅ Relationship insights</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                    <span className="text-orange-700">✅ Health and well-being trends</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                    <span className="text-orange-700">✅ Transit & dasha analysis</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                    <span className="text-orange-700">✅ Life purpose guidance</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Why Choose AstroTick Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="mb-16"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-orange-200/30">
              <h3 className="text-3xl font-bold mb-8 flex items-center text-orange-900">
                <Crown className="h-8 w-8 mr-3 text-amber-500" />
                💡 Why Choose AstroTick?
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-400 mt-1" />
                  <div>
                    <h4 className="font-semibold text-orange-900 mb-1">✅ Authentic Vedic Astrologers</h4>
                    <p className="text-orange-700 text-sm">with decades of experience</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-400 mt-1" />
                  <div>
                    <h4 className="font-semibold text-orange-900 mb-1">✅ Live Consultations</h4>
                    <p className="text-orange-700 text-sm">via Call, Chat, or Video</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-400 mt-1" />
                  <div>
                    <h4 className="font-semibold text-orange-900 mb-1">✅ Free Daily Horoscopes</h4>
                    <p className="text-orange-700 text-sm">& Panchang</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-400 mt-1" />
                  <div>
                    <h4 className="font-semibold text-orange-900 mb-1">✅ Accurate Predictions</h4>
                    <p className="text-orange-700 text-sm">& Customized Remedies</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-400 mt-1" />
                  <div>
                    <h4 className="font-semibold text-orange-900 mb-1">✅ Secure & Confidential</h4>
                    <p className="text-orange-700 text-sm">Platform</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-400 mt-1" />
                  <div>
                    <h4 className="font-semibold text-orange-900 mb-1">✅ Globally Accessible</h4>
                    <p className="text-orange-700 text-sm">India, USA, UK, UAE & More</p>
                  </div>
                </div>
              </div>

              <p className="text-lg text-orange-700 leading-relaxed mt-8">
                Whether you're searching for the best astrologer near you or exploring astrology for the first time, AstroTick combines tradition with technology to deliver trustworthy guidance—anytime, anywhere.
              </p>
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="text-center"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-orange-200/30">
              <h3 className="text-3xl font-bold mb-6 flex items-center justify-center text-orange-900">
                <Compass className="h-8 w-8 mr-3 text-amber-500" />
                🧭 Begin Your Astrological Journey Today
              </h3>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-0 hover:scale-105 transition-all duration-300"
                  onClick={() => setLocation('/kundli')}
                >
                  <Target className="h-5 w-5 mr-2" />
                  🔓 Get Your Free Birth Chart Now
                </Button>
                

              </div>

              <Button 
                size="lg" 
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white border-0 hover:scale-105 transition-all duration-300"
                onClick={() => setLocation('/premium-report')}
              >
                <Sparkles className="h-5 w-5 mr-2" />
                🔮 Discover Your Future with Personalized Readings
              </Button>

              <p className="text-lg text-orange-700 mt-8 leading-relaxed">
                Join the millions who trust astrology to align with their higher purpose. At AstroTick, your stars have stories to tell.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-orange-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-orange-700">
              Everything you need to know about our astrology services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  How accurate are your astrology predictions?
                </h3>
                <p className="text-gray-600">
                  Our predictions are based on authentic Vedic astrology principles using Swiss Ephemeris calculations. With over 20 years of experience and 100+ expert astrologers, we maintain high accuracy standards.
                </p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  What makes your kundli different from others?
                </h3>
                <p className="text-gray-600">
                  We use authentic Jyotisha calculations with zero hardcoded values. Our system processes real astronomical data to generate precise birth charts, dasha periods, and predictions.
                </p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Can I chat with astrologers anytime?
                </h3>
                <p className="text-gray-600">
                  Yes! Our platform has 100+ expert astrologers available 24/7. You can chat, call, or video call with certified Vedic astrology experts whenever you need guidance.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  How do I know which astrologer to choose?
                </h3>
                <p className="text-gray-600">
                  Each astrologer has detailed profiles showing their specializations, experience, ratings, and user reviews. You can filter by expertise areas like marriage, career, health, or finances.
                </p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  What's included in the Premium Life Report?
                </h3>
                <p className="text-gray-600">
                  Our Premium Life Report includes 82 comprehensive sections covering personality analysis, career predictions, health insights, relationship compatibility, remedial measures, and much more.
                </p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Is my personal information secure?
                </h3>
                <p className="text-gray-600">
                  Absolutely! We use industry-standard encryption and security measures to protect your personal data. Your birth details and consultations are kept completely confidential.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>



      <Footer />
    </div>
  );
}

export default EnhancedHome;