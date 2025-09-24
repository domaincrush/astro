import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "src/components/ui/select";
import { useToast } from "src/hooks/use-toast";
import { LocationSearch } from "src/components/LocationSearch";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";
import { Loader2, Calendar, MapPin, Clock, User, Mail, Phone, CreditCard } from "lucide-react";

const bookingFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  gender: z.string().min(1, "Please select your gender"),
  birthDate: z.string().min(1, "Birth date is required"),
  birthTime: z.string().min(1, "Birth time is required"),
  birthPlace: z.string().min(2, "Birth place is required"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  bookingDate: z.string().min(1, "Booking date is required"),
  bookingTime: z.string().min(1, "Booking time is required"),
});

type BookingFormData = z.infer<typeof bookingFormSchema>;

export default function BookingPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [locationData, setLocationData] = useState<{
    place: string;
    latitude: number;
    longitude: number;
  } | null>(null);

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      gender: "",
      birthDate: "",
      birthTime: "",
      birthPlace: "",
      bookingDate: "",
      bookingTime: "",
    },
  });

  const selectedDate = form.watch("bookingDate");

  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots(selectedDate);
    }
  }, [selectedDate]);

  const fetchAvailableSlots = async (date: string) => {
    try {
      const response = await fetch(`/api/bookings/available-slots?date=${date}`);
      const data = await response.json();
      
      if (data.success) {
        setAvailableSlots(data.slots);
      } else {
        setAvailableSlots([]);
        toast({
          title: "Error",
          description: "Failed to fetch available slots",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching slots:", error);
      setAvailableSlots([]);
    }
  };

  const handleLocationSelect = (location: { place: string; latitude: number; longitude: number }) => {
    setLocationData(location);
    form.setValue("birthPlace", location.place);
    form.setValue("latitude", location.latitude);
    form.setValue("longitude", location.longitude);
  };

  const onSubmit = async (data: BookingFormData) => {
    try {
      setIsSubmitting(true);

      if (!locationData) {
        form.setError("birthPlace", {
          type: "manual",
          message: "Please select a location from the search results"
        });
        return;
      }

      const bookingData = {
        ...data,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
      };

      console.log("Submitting booking data:", bookingData);

      const response = await fetch("/api/bookings/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create booking");
      }

      toast({
        title: "Success!",
        description: "Your session has been booked. Redirecting to payment...",
      });

      // Initiate payment process
      setTimeout(async () => {
        try {
          const paymentResponse = await fetch("/api/bookings/payment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ bookingId: result.bookingId }),
          });

          const paymentData = await paymentResponse.json();
          
          if (paymentData.success) {
            // Create and submit PayU form
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = paymentData.paymentUrl;
            
            Object.keys(paymentData.paymentData).forEach(key => {
              const input = document.createElement('input');
              input.type = 'hidden';
              input.name = key;
              input.value = paymentData.paymentData[key];
              form.appendChild(input);
            });
            
            document.body.appendChild(form);
            form.submit();
          } else {
            throw new Error("Failed to initiate payment");
          }
        } catch (paymentError: any) {
          console.error("Payment error:", paymentError);
          toast({
            title: "Payment Error",
            description: paymentError.message || "Failed to initiate payment. Please try again.",
            variant: "destructive",
          });
        }
      }, 2000);

    } catch (error: any) {
      console.error("Booking error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate time slots for today and future dates
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 18; hour++) {
      for (let min = 0; min < 60; min += 30) {
        const timeStr = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
        slots.push(timeStr);
      }
    }
    return slots;
  };

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
      <AstroTickHeader />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Calendar className="h-12 w-12 text-purple-600 mr-3" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Book Your Consultation Session
              </h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Schedule a personalized consultation with our expert astrologers. Get detailed insights 
              and guidance for your life's important questions.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Info Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-6 border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50">
                <CardHeader>
                  <CardTitle className="text-purple-800">Session Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-blue-800">45 Minutes</h4>
                      <p className="text-sm text-gray-600">One-on-one consultation</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-green-800">Phone Call</h4>
                      <p className="text-sm text-gray-600">We'll call you at scheduled time</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-orange-800">Follow-up Report</h4>
                      <p className="text-sm text-gray-600">Detailed PDF sent via email</p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <p className="text-purple-800 font-semibold text-xl">₹150</p>
                      <p className="text-xs text-purple-700">All-inclusive fee</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Booking Form */}
            <div className="lg:col-span-2">
              <Card className="shadow-xl border-purple-200 bg-white/95 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-t-lg">
                  <CardTitle className="text-2xl text-center flex items-center justify-center">
                    <User className="h-6 w-6 mr-2" />
                    Booking Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      {/* Personal Information */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                          Personal Information
                        </h3>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Full Name *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter your full name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email Address *</FormLabel>
                                <FormControl>
                                  <Input type="email" placeholder="your@email.com" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number *</FormLabel>
                                <FormControl>
                                  <Input placeholder="+91 9876543210" {...field} />
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
                                <FormLabel>Gender *</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select your gender" />
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
                      </div>

                      {/* Birth Details */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 flex items-center">
                          <User className="h-5 w-5 mr-2" />
                          Birth Details
                        </h3>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="birthDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Birth Date *</FormLabel>
                                <FormControl>
                                  <Input type="date" {...field} />
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
                                <FormLabel>Birth Time *</FormLabel>
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
                          name="birthPlace"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center">
                                <MapPin className="h-4 w-4 mr-2" />
                                Birth Place *
                              </FormLabel>
                              <FormControl>
                                <LocationSearch
                                  onLocationSelect={handleLocationSelect}
                                  placeholder="Search for your birth city..."
                                  defaultValue={field.value}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Booking Details */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 flex items-center">
                          <Calendar className="h-5 w-5 mr-2" />
                          Session Booking
                        </h3>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="bookingDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Preferred Date *</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="date" 
                                    min={getMinDate()}
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="bookingTime"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Preferred Time *</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select time slot" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {availableSlots.length > 0 ? (
                                      availableSlots.map((time) => (
                                        <SelectItem key={time} value={time}>
                                          {time}
                                        </SelectItem>
                                      ))
                                    ) : (
                                      <div className="p-2 text-gray-500 text-center">
                                        {selectedDate ? 'No slots available' : 'Select a date first'}
                                      </div>
                                    )}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2">What to expect:</h4>
                          <ul className="space-y-1 text-sm text-gray-600">
                            <li>• Our astrologer will call you at the scheduled time</li>
                            <li>• Detailed birth chart analysis during the session</li>
                            <li>• Personalized insights and remedies</li>
                            <li>• Follow-up PDF report within 24 hours</li>
                          </ul>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white py-3 text-lg font-semibold"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Processing Booking...
                          </>
                        ) : (
                          <>
                            <CreditCard className="mr-2 h-5 w-5" />
                            Book Session & Pay ₹150
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}