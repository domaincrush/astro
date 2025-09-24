import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "src/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "src/components/ui/card";
import { Badge } from "src/components/ui/badge";
import { Input } from "src/components/ui/input";
import { Textarea } from "src/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "src/components/ui/form";
import { Clock, Star, Languages, Award, ArrowLeft, User, Calendar, MapPin, MessageCircle } from "lucide-react";
import { useAuth } from "src/hooks/useAuth";
import { formatPrice } from "src/lib/utils";
import { apiRequest, queryClient } from "src/lib/queryClient";
import { Astrologer } from "@shared/schema";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";

interface Package {
  duration: number;
  price: number;
  savings?: number;
  popular?: boolean;
}

const birthDetailsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  timeOfBirth: z.string().min(1, "Time of birth is required"),
  placeOfBirth: z.string().min(1, "Place of birth is required"),
  question: z.string().min(1, "Please tell us what you'd like to know"),
});

type BirthDetailsForm = z.infer<typeof birthDetailsSchema>;

export default function Packages() {
  const [, params] = useRoute("/packages/:astrologerId");
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [showBirthDetailsForm, setShowBirthDetailsForm] = useState(false);
  const [isCreatingConsultation, setIsCreatingConsultation] = useState(false);

  const astrologerId = params?.astrologerId ? parseInt(params.astrologerId) : null;
  
  // Redirect to new astrologer profile page using useEffect
  useEffect(() => {
    if (astrologerId) {
      setLocation(`/astrologer/${astrologerId}`);
    }
  }, [astrologerId, setLocation]);

  const { data: astrologers, isLoading } = useQuery<Astrologer[]>({
    queryKey: ["/api/astrologers"],
  });

  const { data: userProfile } = useQuery<{ balance?: number; username?: string }>({
    queryKey: ["/api/auth/user"],
    enabled: !!user?.id,
  });

  const astrologer = astrologers?.find(a => a.id === astrologerId);
  const userBalance = ((userProfile?.balance || 0) / 100); // Convert paise to rupees

  // Birth details form
  const form = useForm<BirthDetailsForm>({
    resolver: zodResolver(birthDetailsSchema),
    defaultValues: {
      name: userProfile?.username ?? "",
      dateOfBirth: "",
      timeOfBirth: "",
      placeOfBirth: "",
      question: "",
    },
  });

  // Debug logging
  console.log("🔍 Packages page - astrologerId:", astrologerId);
  console.log("🔍 Packages page - astrologers:", astrologers);
  console.log("🔍 Packages page - found astrologer:", astrologer);

  if (!astrologerId) {
    console.log("❌ No astrologerId provided, redirecting to astrologers");
    setLocation("/astrologers");
    return null;
  }

  if (isLoading || !astrologers) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AstroTickHeader />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  if (!astrologer) {
    console.log("❌ Astrologer not found, redirecting to astrologers");
    setLocation("/astrologers");
    return null;
  }

  const packages: Package[] = [
    {
      duration: 10,
      price: astrologer.ratePerMinute * 10 * 100, // Convert rupees to paise
    },
    {
      duration: 15,
      price: astrologer.ratePerMinute * 15 * 100, // Convert rupees to paise
      savings: astrologer.ratePerMinute * 1 * 100, // 1 minute free
      popular: true,
    },
    {
      duration: 30,
      price: astrologer.ratePerMinute * 30 * 100, // Convert rupees to paise
      savings: astrologer.ratePerMinute * 5 * 100, // 5 minutes free
    },
    {
      duration: 60,
      price: astrologer.ratePerMinute * 60 * 100, // Convert rupees to paise
      savings: astrologer.ratePerMinute * 10 * 100, // 10 minutes free
    },
  ];

  const handlePackageSelect = (pkg: Package) => {
    console.log("📦 Package selected:", pkg);
    
    if (!user?.id) {
      console.log("❌ No user, redirecting to login");
      setLocation("/login");
      return;
    }
    
    // Industry standard: Always collect birth details first (like AstroTalk/AstroYogi)
    setSelectedPackage(pkg);
    setShowBirthDetailsForm(true);
  };

  const handleWalletRecharge = async (amount: number) => {
    try {
      const response = await fetch("/api/payment/wallet/recharge", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ amount })
      });
      
      if (!response.ok) {
        throw new Error('Failed to initiate payment');
      }
      
      const data = await response.json();
      
      if (data.success && data.paymentForm) {
        // Create a temporary div to hold the form
        const tempDiv = document.createElement('div');
        // Enhanced security: Use safe DOM manipulation instead of innerHTML
        tempDiv.textContent = ''; // Clear any existing content safely
        // Create form elements safely using DOM methods
        const parser = new DOMParser();
        const doc = parser.parseFromString(data.paymentForm, 'text/html');
        const formElement = doc.querySelector('form');
        if (formElement) {
          tempDiv.appendChild(formElement.cloneNode(true));
        } else {
          // Fallback: create a safe error message
          const errorDiv = document.createElement('div');
          errorDiv.textContent = 'Payment form could not be loaded safely';
          tempDiv.appendChild(errorDiv);
        }
        document.body.appendChild(tempDiv);
        
        // Submit the form to redirect to PayU
        const form = tempDiv.querySelector('form');
        if (form) {
          form.submit();
        }
      }
    } catch (error) {
      console.error('Payment initiation error:', error);
      alert("Failed to initiate payment. Please try again.");
    }
  };

  const onSubmit = async (data: BirthDetailsForm) => {
    if (!selectedPackage || !user?.id || !astrologer?.id) {
      console.error("Missing required data:", { selectedPackage, userId: user?.id, astrologerId: astrologer?.id });
      return;
    }
    
    setIsCreatingConsultation(true);
    
    // Check if user has sufficient balance after collecting birth details
    const userWalletBalance = (userProfile?.balance || 0);
    
    if (userWalletBalance < selectedPackage.price) {
      // Store birth details in sessionStorage and redirect to payment
      sessionStorage.setItem('pendingBirthDetails', JSON.stringify(data));
      sessionStorage.setItem('pendingPackage', JSON.stringify(selectedPackage));
      
      setIsCreatingConsultation(false);
      setShowBirthDetailsForm(false);
      
      const priceInRupees = Math.round(selectedPackage.price / 100);
      const paymentUrl = `/payment?astrologer=${astrologer.id}&duration=${selectedPackage.duration}&price=${selectedPackage.price}&amount=${priceInRupees}&description=${selectedPackage.duration} minute consultation with ${astrologer.name}`;
      setLocation(paymentUrl);
      return;
    }
    
    const consultationData = {
      userId: user.id,
      astrologerId: astrologer.id,
      topic: data.question || "General Consultation",
      duration: selectedPackage.duration,
      cost: selectedPackage.price,
      status: "active",
      paymentStatus: "completed",
      userDetails: data
    };
    
    console.log("Sending consultation data:", consultationData);
    
    try {
      const response = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(consultationData)
      });

      if (response.ok) {
        // Clear consultation cache to ensure fresh data
        queryClient.removeQueries({ queryKey: ["/api/consultations/active"] });
        queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
        
        setLocation("/chat");
      } else {
        const error = await response.json();
        console.error("Failed to create consultation:", error);
        alert("Failed to create consultation. Please try again.");
      }
    } catch (error) {
      console.error("Error starting consultation:", error);
      alert("Error starting consultation. Please try again.");
    } finally {
      setIsCreatingConsultation(false);
      setShowBirthDetailsForm(false);
      setSelectedPackage(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AstroTickHeader />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-600 via-amber-600 to-yellow-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            className="text-white hover:bg-white/20 mb-6"
            onClick={() => setLocation("/astrologers")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Astrologers
          </Button>
          
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <img
                src={astrologer.image}
                alt={astrologer.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-white/30"
              />
            </div>
            
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-bold mb-2">{astrologer.name}</h1>
              <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{astrologer.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Award className="w-5 h-5" />
                  <span>{astrologer.experience} years</span>
                </div>
                <div className="flex items-center gap-1">
                  <Languages className="w-5 h-5" />
                  <span>{astrologer.languages}</span>
                </div>
              </div>
              <p className="text-lg opacity-90 mb-4">{astrologer.description}</p>
              <div className="flex flex-wrap gap-2">
                {astrologer.specializations 
                  ? (Array.isArray(astrologer.specializations) 
                      ? astrologer.specializations
                      : String(astrologer.specializations).split(',')
                    ).map((spec, index) => (
                      <Badge key={index} variant="secondary" className="bg-white/20 text-white">
                        {String(spec).trim()}
                      </Badge>
                    ))
                  : <Badge variant="secondary" className="bg-white/20 text-white">General Astrology</Badge>
                }
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Consultation Packages Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Live Consultation with {astrologer.name}</h2>
            <p className="text-xl text-gray-600 mb-4">
              Select the perfect duration for your personal astrological consultation
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
              <div className="inline-flex items-center gap-2 bg-emerald-green/10 text-emerald-green px-4 py-2 rounded-full font-medium">
                <div className="w-2 h-2 bg-emerald-green rounded-full"></div>
                Wallet Balance: ₹{(userBalance / 100).toFixed(2)}
              </div>
              
              {userBalance < 50000 && (
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleWalletRecharge(50000)}
                    className="border-purple-300 text-purple-700 hover:bg-purple-50"
                  >
                    Add ₹500
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleWalletRecharge(100000)}
                    className="border-purple-300 text-purple-700 hover:bg-purple-50"
                  >
                    Add ₹1000
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleWalletRecharge(200000)}
                    className="border-purple-300 text-purple-700 hover:bg-purple-50"
                  >
                    Add ₹2000
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {packages.map((pkg) => (
              <Card
                key={pkg.duration}
                className={`relative cursor-pointer transition-all hover:shadow-lg ${
                  pkg.popular 
                    ? 'ring-2 ring-primary border-primary' 
                    : 'hover:border-primary/50'
                }`}
                onClick={() => handlePackageSelect(pkg)}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-white px-4 py-1">Most Popular</Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-primary" />
                    <CardTitle className="text-2xl">{pkg.duration} Minutes</CardTitle>
                  </div>
                  <div className="text-3xl font-bold text-primary">
                    {formatPrice(pkg.price)}
                  </div>
                  {pkg.savings && (
                    <div className="text-sm text-emerald-green font-medium">
                      Save {formatPrice(pkg.savings)}
                    </div>
                  )}
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Real-time chat consultation</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Personalized astrological insights</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Birth chart analysis</span>
                    </div>
                    {pkg.savings && (
                      <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Bonus consultation time</span>
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    className="w-full"
                    variant={pkg.popular ? "default" : "outline"}
                    onClick={() => handlePackageSelect(pkg)}
                  >
                    Select Package
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Birth Details Form Section */}
      {showBirthDetailsForm && selectedPackage && (
        <section className="py-8 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Share Your Birth Details
                </h2>
                <p className="text-gray-600">
                  To provide accurate insights, we need your birth information for consultation with {astrologer?.name}
                </p>
                <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-amber-600" />
                    <span className="text-amber-800 font-medium">
                      Selected: {selectedPackage.duration} minutes - ₹{(selectedPackage.price / 100).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Birth Information
                  </CardTitle>
                  <CardDescription>
                    All fields are required for accurate astrological analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              Full Name
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your full name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="dateOfBirth"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Date of Birth
                              </FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="timeOfBirth"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                Time of Birth
                              </FormLabel>
                              <FormControl>
                                <Input type="time" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="placeOfBirth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              Place of Birth
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="City, State, Country" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="question"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <MessageCircle className="w-4 h-4" />
                              What would you like to know?
                            </FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Describe your specific questions or areas of concern..."
                                className="min-h-[100px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex gap-4 pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          className="flex-1"
                          onClick={() => setShowBirthDetailsForm(false)}
                        >
                          Back to Packages
                        </Button>
                        <Button
                          type="submit"
                          className="flex-1"
                          disabled={isCreatingConsultation}
                        >
                          {isCreatingConsultation ? "Processing..." : "Start Consultation"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}
      
      <Footer />
    </div>
  );
}