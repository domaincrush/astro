import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { Button } from "src/components/ui/button";
import { Badge } from "src/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "src/components/ui/avatar";
import { Input } from "src/components/ui/input";
import { Label } from "src/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "src/components/ui/form";
import { RadioGroup, RadioGroupItem } from "src/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "src/components/ui/select";
import { Star, Clock, ArrowLeft, User, Calendar, MapPin, Tag, Wallet } from "lucide-react";
import { useState } from "react";
import { useToast } from "src/hooks/use-toast";
import { useForm } from "react-hook-form";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "src/lib/queryClient";
import Footer from "src/components/layout/Footer";
import { useAuth } from "src/hooks/useAuth";

const birthDetailsSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  gender: z.enum(["male", "female", "other"]),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  timeOfBirth: z.string().min(1, "Time of birth is required"),
  placeOfBirth: z.string().min(2, "Place of birth is required"),
  couponCode: z.string().optional(),
});

type BirthDetailsFormData = z.infer<typeof birthDetailsSchema>;

interface AstrologerData {
  id: number;
  name: string;
  image: string;
  experience: number;
  rating: string;
  reviewCount: number;
  ratePerMinute: number;
  specializations: string[];
  isOnline: boolean;
  languages: string[];
  description: string;
  isApproved: boolean;
  isActive: boolean;
}

export default function AstrologerProfile() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedDuration, setSelectedDuration] = useState<string>("10");
  const [customDuration, setCustomDuration] = useState<string>("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);

  const { data: astrologers, isLoading } = useQuery<AstrologerData[]>({
    queryKey: ["/api/astrologers"],
  });

  const { data: userProfile } = useQuery({
    queryKey: ["/api/auth/user"],
    enabled: !!user?.id,
  });

  const astrologer = astrologers?.find(a => a.id === parseInt(id!));
  const userBalance = (userProfile?.balance || 0) / 100; // Convert paise to rupees

  const form = useForm<BirthDetailsFormData>({
    resolver: zodResolver(birthDetailsSchema),
    defaultValues: {
      name: userProfile?.username || "",
      gender: "male",
      dateOfBirth: "",
      timeOfBirth: "",
      placeOfBirth: "",
      couponCode: "",
    },
  });

  const timeOptions = [
    { value: "5", label: "5 Minutes", price: 225 },
    { value: "10", label: "10 Minutes", price: 450 },
    { value: "15", label: "15 Minutes", price: 675 },
    { value: "20", label: "20 Minutes", price: 900 },
    { value: "30", label: "30 Minutes", price: 1350 },
    { value: "45", label: "45 Minutes", price: 2025 },
    { value: "60", label: "1 Hour", price: 2700 },
    { value: "custom", label: "Custom (5-120 mins)", price: 0 },
  ];

  const getSelectedPrice = () => {
    if (selectedDuration === "custom") {
      const minutes = parseInt(customDuration) || 0;
      return minutes * ((astrologer as AstrologerData)?.ratePerMinute || 45);
    }
    const option = timeOptions.find(opt => opt.value === selectedDuration);
    return option?.price || 0;
  };

  const getFinalPrice = () => {
    const basePrice = getSelectedPrice();
    if (appliedCoupon) {
      const discount = appliedCoupon.type === 'percentage' 
        ? (basePrice * appliedCoupon.value) / 100
        : appliedCoupon.value;
      return Math.max(0, basePrice - discount);
    }
    return basePrice;
  };

  const getDurationInMinutes = () => {
    if (selectedDuration === "custom") {
      return parseInt(customDuration) || 0;
    }
    return parseInt(selectedDuration);
  };

  const couponMutation = useMutation({
    mutationFn: async (couponCode: string) => {
      const response = await apiRequest("POST", "/api/coupons/validate", { code: couponCode });
      return response.json();
    },
    onSuccess: (data) => {
      setAppliedCoupon(data);
      toast({
        title: "Coupon Applied",
        description: `${data.type === 'percentage' ? data.value + '%' : '₹' + data.value} discount applied!`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Invalid Coupon",
        description: error.message || "This coupon code is not valid",
        variant: "destructive",
      });
    },
  });

  const createConsultationMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/consultations/create", data);
      return response.json();
    },
    onSuccess: (consultation) => {
      // Check if payment gateway redirection is required
      if (consultation.paymentRequired && consultation.paymentGateway === "payu") {
        // Create PayU form and submit for payment
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = 'https://secure.payu.in/_payment'; // Production PayU URL
        form.style.display = 'none';

        // Add all PayU parameters as hidden inputs
        Object.entries(consultation.paymentData).forEach(([key, value]) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = value as string;
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
      } else {
        // Redirect to chat if wallet payment was successful
        setLocation(`/chat?consultation=${consultation.id}`);
        queryClient.invalidateQueries({ queryKey: ["/api/consultations/user"] });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create consultation",
        variant: "destructive",
      });
    },
  });

  const paymentMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/consultations/create", {
        ...data,
        paymentMethod: "payu"
      });
      return response.json();
    },
    onSuccess: (consultation) => {
      if (consultation.paymentRequired && consultation.paymentData) {
        // Create PayU form and submit
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = 'https://secure.payu.in/_payment';
        form.style.display = 'none';
        
        Object.entries(consultation.paymentData).forEach(([key, value]) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = value as string;
          form.appendChild(input);
        });
        
        document.body.appendChild(form);
        form.submit();
      }
    },
    onError: (error: any) => {
      toast({
        title: "Payment Error",
        description: error.message || "Failed to initiate payment",
        variant: "destructive",
      });
    },
  });

  const handleCouponApply = () => {
    const couponCode = form.getValues("couponCode");
    if (couponCode && couponCode.trim()) {
      couponMutation.mutate(couponCode.trim());
    }
  };

  const handlePayment = (data: BirthDetailsFormData) => {
    if (!user?.id) {
      setLocation("/login");
      return;
    }

    const duration = getDurationInMinutes();
    if (selectedDuration === "custom" && duration < 5) {
      toast({
        title: "Invalid Duration",
        description: "Custom duration must be at least 5 minutes",
        variant: "destructive",
      });
      return;
    }

    const finalPrice = getFinalPrice();
    
    // Check if user has sufficient wallet balance
    if (userBalance >= finalPrice) {
      // Direct consultation creation - deduct from wallet
      createConsultationMutation.mutate({
        astrologerId: parseInt(id!),
        duration,
        cost: finalPrice,
        paymentMethod: "wallet",
        userDetails: data,
        topic: "General Consultation",
        couponCode: appliedCoupon?.code || null,
      });
    } else {
      // Redirect to PayU payment
      paymentMutation.mutate({
        astrologerId: parseInt(id!),
        duration,
        cost: finalPrice,
        userDetails: data,
        topic: "General Consultation",
        couponCode: appliedCoupon?.code || null,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!astrologer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Astrologer not found</h2>
            <p className="text-gray-600">The astrologer you're looking for doesn't exist.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const astrologerData = astrologer as AstrologerData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <Header />
      
      {/* Astrologer Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setLocation("/astrologers")}
              className="flex items-center gap-2 text-white/80 hover:text-white mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Astrologers</span>
            </button>
          </div>
          
          <div className="flex items-center gap-6">
            <Avatar className="w-20 h-20 border-4 border-white/20">
              <AvatarImage src={astrologerData.image} alt={astrologerData.name} />
              <AvatarFallback className="text-xl bg-purple-500">
                {astrologerData.name.split(" ").map((n: string) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold">{astrologerData.name}</h1>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{astrologerData.rating}</span>
                </div>
                <span className="text-purple-200">({astrologerData.experience} years)</span>
                <Badge variant="secondary" className="bg-green-500 text-white text-xs">
                  {astrologerData.languages.join("/")}
                </Badge>
              </div>
              
              <p className="text-purple-100 text-sm mb-3">{astrologerData.description}</p>
              
              <div className="flex flex-wrap gap-2">
                {astrologerData.specializations?.slice(0, 3).map((spec: string) => (
                  <Badge key={spec} variant="outline" className="border-white/30 text-white text-xs">
                    {spec}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Live Consultation with {astrologerData.name}</h2>
          <p className="text-gray-600 text-sm">Choose your consultation duration and provide birth details for accurate readings</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Side - Duration & Birth Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Duration Selection with Radio Buttons */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Select Consultation Duration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={selectedDuration} onValueChange={setSelectedDuration} className="grid grid-cols-2 gap-4">
                  {timeOptions.filter(opt => opt.value !== "custom").map((option) => (
                    <div key={option.value} className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50">
                      <RadioGroupItem value={option.value} id={option.value} />
                      <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                        <div className="font-medium">{option.label}</div>
                        <div className="text-sm text-gray-500">₹{option.price}</div>
                      </Label>
                    </div>
                  ))}
                  
                  {/* Custom Duration Option */}
                  <div className="col-span-2 border rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <RadioGroupItem value="custom" id="custom" />
                      <Label htmlFor="custom" className="font-medium cursor-pointer">Custom Duration</Label>
                    </div>
                    {selectedDuration === "custom" && (
                      <div className="ml-6">
                        <Input
                          type="number"
                          min="5"
                          max="120"
                          placeholder="Enter minutes (5-120)"
                          value={customDuration}
                          onChange={(e) => setCustomDuration(e.target.value)}
                          className="w-32"
                        />
                        <p className="text-xs text-gray-500 mt-1">Minimum 5 minutes, maximum 120 minutes</p>
                        {customDuration && parseInt(customDuration) >= 5 && (
                          <p className="text-sm font-medium mt-1">₹{parseInt(customDuration) * astrologerData.ratePerMinute}</p>
                        )}
                      </div>
                    )}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Birth Details Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Birth Details for Accurate Reading
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handlePayment)} className="space-y-4">
                    <FormField
                      control={form.control}
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

                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
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

                    <div className="grid md:grid-cols-2 gap-4">
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
                            <FormLabel>Time of Birth</FormLabel>
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
                            <Input 
                              placeholder="Enter city, state, country" 
                              {...field}
                              list="cities"
                              autoComplete="address-level2"
                            />
                          </FormControl>
                          <datalist id="cities">
                            <option value="Mumbai, Maharashtra, India" />
                            <option value="Delhi, Delhi, India" />
                            <option value="Bangalore, Karnataka, India" />
                            <option value="Chennai, Tamil Nadu, India" />
                            <option value="Kolkata, West Bengal, India" />
                            <option value="Pune, Maharashtra, India" />
                            <option value="Hyderabad, Telangana, India" />
                          </datalist>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Coupon Code Section */}
                    <div className="border-t pt-4">
                      <FormField
                        control={form.control}
                        name="couponCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Tag className="w-4 h-4" />
                              Coupon Code (Optional)
                            </FormLabel>
                            <div className="flex gap-2">
                              <FormControl>
                                <Input 
                                  placeholder="Enter coupon code" 
                                  {...field}
                                  disabled={!!appliedCoupon}
                                />
                              </FormControl>
                              {!appliedCoupon && (
                                <Button 
                                  type="button" 
                                  variant="outline"
                                  onClick={handleCouponApply}
                                  disabled={couponMutation.isPending || !field.value}
                                >
                                  {couponMutation.isPending ? "Checking..." : "Apply"}
                                </Button>
                              )}
                              {appliedCoupon && (
                                <Button 
                                  type="button" 
                                  variant="outline"
                                  onClick={() => {
                                    setAppliedCoupon(null);
                                    form.setValue("couponCode", "");
                                  }}
                                >
                                  Remove
                                </Button>
                              )}
                            </div>
                            {appliedCoupon && (
                              <p className="text-sm text-green-600">
                                ✓ Coupon applied: {appliedCoupon.type === 'percentage' ? `${appliedCoupon.value}% off` : `₹${appliedCoupon.value} off`}
                              </p>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar - Payment Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Consultation Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Duration:</span>
                  <span className="font-medium">
                    {selectedDuration === "custom" ? `${customDuration || 0} min` : `${selectedDuration} min`}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span>Rate:</span>
                  <span className="font-medium">₹{astrologerData.ratePerMinute}/min</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span>Subtotal:</span>
                  <span className="font-medium">₹{getSelectedPrice()}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex items-center justify-between text-green-600">
                    <span>Discount:</span>
                    <span className="font-medium">
                      -₹{getSelectedPrice() - getFinalPrice()}
                    </span>
                  </div>
                )}
                
                <div className="border-t pt-2">
                  <div className="flex items-center justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>₹{getFinalPrice()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Wallet className="w-4 h-4" />
                  <span>Wallet Balance: ₹{userBalance}</span>
                </div>

                {userBalance >= getFinalPrice() && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-700 font-medium">
                      ✓ Sufficient wallet balance. You'll be redirected directly to chat after confirmation.
                    </p>
                  </div>
                )}

                <Button 
                  onClick={form.handleSubmit(handlePayment)}
                  className="w-full"
                  disabled={
                    createConsultationMutation.isPending || 
                    paymentMutation.isPending ||
                    (selectedDuration === "custom" && (!customDuration || parseInt(customDuration) < 5))
                  }
                >
                  {createConsultationMutation.isPending || paymentMutation.isPending 
                    ? "Processing..." 
                    : userBalance >= getFinalPrice() 
                      ? "Start Consultation" 
                      : "Continue to Pay"
                  }
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  By proceeding, you agree to our terms of service
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}