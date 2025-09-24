import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { Input } from "src/components/ui/input";
import { Textarea } from "src/components/ui/textarea";
import { CalendarIcon, Clock, MapPin, User, Star } from "lucide-react";
import { useAuth } from "src/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "src/lib/queryClient";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "src/components/ui/form";

const birthDetailsSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  timeOfBirth: z.string().min(1, "Time of birth is required"),
  placeOfBirth: z.string().min(2, "Place of birth is required"),
  question: z.string().optional(),
});

type BirthDetailsForm = z.infer<typeof birthDetailsSchema>;

export default function BirthDetails() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const astrologerId = urlParams.get('astrologer');
  const duration = urlParams.get('duration');
  const paymentSuccess = urlParams.get('payment') === 'success';
  
  // Load stored birth details from sessionStorage (if came from payment)
  const storedBirthDetails = sessionStorage.getItem('pendingBirthDetails');
  const storedPackage = sessionStorage.getItem('pendingPackage');

  const { data: astrologer } = useQuery({
    queryKey: [`/api/astrologer/${astrologerId}`],
    enabled: !!astrologerId,
  });

  const { data: userProfile } = useQuery({
    queryKey: ["/api/auth/user"],
    enabled: !!user?.id,
  });

  const form = useForm<BirthDetailsForm>({
    resolver: zodResolver(birthDetailsSchema),
    defaultValues: {
      name: userProfile?.username || "",
      dateOfBirth: storedBirthDetails ? JSON.parse(storedBirthDetails).dateOfBirth || "" : "",
      timeOfBirth: storedBirthDetails ? JSON.parse(storedBirthDetails).timeOfBirth || "" : "",
      placeOfBirth: storedBirthDetails ? JSON.parse(storedBirthDetails).placeOfBirth || "" : "",
      question: storedBirthDetails ? JSON.parse(storedBirthDetails).question || "" : "",
    },
  });

  useEffect(() => {
    if (!user) {
      setLocation("/login");
      return;
    }
  }, [user, setLocation]);

  const onSubmit = async (data: BirthDetailsForm) => {
    if (!user?.id) {
      setLocation("/login");
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Birth details submitted:", data);
      
      // If we have astrologer and duration (came from payment success), create consultation
      if (astrologerId && duration) {
        console.log("Creating consultation with astrologer:", astrologerId, "duration:", duration);
        
        // Get stored package data from sessionStorage
        const storedPackageData = sessionStorage.getItem('pendingPackage');
        let packageData = null;
        
        if (storedPackageData) {
          packageData = JSON.parse(storedPackageData);
        }
        
        // Create consultation with birth details
        const consultationData = {
          userId: user.id,
          astrologerId: Number(astrologerId),
          topic: data.question || "General Consultation",
          duration: Number(duration),
          cost: packageData ? packageData.price : 0,
          status: "active",
          paymentStatus: "completed",
          userDetails: data
        };
        
        const response = await fetch("/api/consultations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(consultationData)
        });

        if (response.ok) {
          const consultation = await response.json();
          console.log("Consultation created:", consultation);
          
          // Clear stored data
          sessionStorage.removeItem('pendingBirthDetails');
          sessionStorage.removeItem('pendingPackage');
          
          // Deduct amount from wallet
          if (packageData?.price) {
            await fetch("/api/auth/wallet/deduct", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ amount: packageData.price })
            });
          }
          
          setLocation(`/chat?consultation=${consultation.id}`);
        } else {
          const error = await response.json();
          console.error("Failed to create consultation:", error);
          alert("Failed to create consultation. Please try again.");
        }
      } else {
        // No consultation parameters, just save birth details
        alert("Birth details saved successfully!");
        setLocation("/");
      }
    } catch (error) {
      console.error("Error submitting birth details:", error);
      alert("Error submitting birth details. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <AstroTickHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {paymentSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-800">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <span className="font-medium">Payment Successful!</span>
              </div>
              <p className="text-green-600 mt-1">Your consultation has been booked. Please provide your birth details to begin.</p>
            </div>
          )}

          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Birth Details Required
              </CardTitle>
              {astrologer && (
                <p className="text-gray-600 mt-2">
                  For your {duration} minute consultation with <span className="font-semibold text-amber-600">{astrologer.name}</span>
                </p>
              )}
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h3 className="font-semibold text-amber-800 mb-2">Why do we need this information?</h3>
                <p className="text-amber-700 text-sm">
                  Your birth details are essential for creating an accurate astrological chart and providing personalized predictions. 
                  All information is kept confidential and secure.
                </p>
              </div>

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
                          <Input 
                            placeholder="Enter your full name" 
                            {...field} 
                            className="bg-white border-gray-300"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <CalendarIcon className="w-4 h-4" />
                          Date of Birth
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            {...field} 
                            className="bg-white border-gray-300"
                          />
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
                          <Input 
                            type="time" 
                            {...field} 
                            className="bg-white border-gray-300"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
                            placeholder="City, State, Country" 
                            {...field} 
                            className="bg-white border-gray-300"
                          />
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
                        <FormLabel>Specific Question or Area of Focus (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="What would you like to know about? (e.g., career, relationships, health, etc.)"
                            rows={3}
                            {...field} 
                            className="bg-white border-gray-300"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold py-3"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Starting Consultation..." : "Start My Consultation"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}