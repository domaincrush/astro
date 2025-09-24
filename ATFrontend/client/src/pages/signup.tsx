import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "src/components/ui/card";
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
import { useLocation } from "wouter";
import { useToast } from "src/hooks/use-toast";
import { apiRequest } from "src/lib/queryClient";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Shield,
  Star,
  Users,
  Award,
  Zap,
} from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";
import { useAuth } from "src/hooks/useAuth";

const signupSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    pin: z.string().regex(/^\d{6}$/, "PIN must be exactly 6 digits"),
    confirmPin: z.string().regex(/^\d{6}$/, "PIN must be exactly 6 digits"),
  })
  .refine((data) => data.pin === data.confirmPin, {
    message: "PINs don't match",
    path: ["confirmPin"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export default function Signup() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { refreshAuth } = useAuth();

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      pin: "",
      confirmPin: "",
    },
  });

  const signupMutation = useMutation({
    mutationFn: async (data: SignupFormData) => {
      const { confirmPin, ...signupData } = data;
      const response = await apiRequest("POST", "/api/auth/signup", signupData);
      return response;
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "Account Created!",
          description:
            "Your account has been created successfully. Please log in to continue.",
        });

        // Get form data for email
        const formData = form.getValues();

        // Check for redirect parameter in URL
        const urlParams = new URLSearchParams(window.location.search);
        const redirect = urlParams.get("redirect") || "/dashboard";

        // Redirect to login page with email pre-filled and redirect parameter
        setLocation(
          "/login?email=" +
            encodeURIComponent(formData.email) +
            "&redirect=" +
            encodeURIComponent(redirect),
        );
      } else {
        toast({
          title: "Signup failed",
          description:
            data.message || "Please check your information and try again",
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Signup failed",
        description: error.message || "An error occurred during signup",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: SignupFormData) => {
    signupMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <AstroTickHeader />

      <main className="container mx-auto px-4 py-8">
        {/* Marketing Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Join AstroTick Today
          </h1>
          <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
            Connect with certified Vedic astrologers and unlock personalized
            insights about your future, relationships, career, and spiritual
            journey.
          </p>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-2xl mx-auto">
            <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm">
              <Users className="h-8 w-8 text-orange-600 mb-2" />
              <span className="text-sm font-medium">10,000+</span>
              <span className="text-xs text-gray-500">Happy Users</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm">
              <Award className="h-8 w-8 text-orange-600 mb-2" />
              <span className="text-sm font-medium">Certified</span>
              <span className="text-xs text-gray-500">Astrologers</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm">
              <Star className="h-8 w-8 text-orange-600 mb-2" />
              <span className="text-sm font-medium">4.8/5</span>
              <span className="text-xs text-gray-500">User Rating</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm">
              <Zap className="h-8 w-8 text-orange-600 mb-2" />
              <span className="text-sm font-medium">Instant</span>
              <span className="text-xs text-gray-500">Consultations</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <Card className="w-full max-w-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">
                Create Your Account
              </CardTitle>
              <CardDescription className="text-center">
                Start your personalized astrology journey in minutes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Google Login at the top */}
              <div className="mb-6">
                <button
                  onClick={() => {
                    // Get redirect parameter from URL for Google OAuth
                    const urlParams = new URLSearchParams(
                      window.location.search,
                    );
                    const redirect = urlParams.get("redirect") || "/dashboard";
                    window.location.href = `/auth/google?redirect=${encodeURIComponent(redirect)}`;
                  }}
                  className="inline-flex w-full justify-center items-center rounded-md border border-gray-300 bg-white py-3 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
                >
                  <FaGoogle className="h-4 w-4 text-red-500 mr-2" />
                  Continue with Google
                </button>
              </div>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">
                    Or create account with
                  </span>
                </div>
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              placeholder="Enter your email"
                              type="email"
                              autoComplete="username"
                              className="pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="pin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>6-Digit PIN</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Shield className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                placeholder="Create a 6-digit PIN"
                                type="password"
                                maxLength={6}
                                autoComplete="new-password"
                                className="pl-10 text-center text-lg tracking-widest font-mono"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="confirmPin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm PIN</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Shield className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                placeholder="Confirm your PIN"
                                type="password"
                                maxLength={6}
                                autoComplete="new-password"
                                className="pl-10 text-center text-lg tracking-widest font-mono"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={signupMutation.isPending}
                  >
                    {signupMutation.isPending
                      ? "Creating account..."
                      : "Create Account"}
                  </Button>
                </form>
              </Form>

              <div className="mt-6 text-center text-sm">
                <span className="text-gray-600">Already have an account? </span>
                <button
                  onClick={() => setLocation("/login")}
                  className="text-orange-600 hover:text-orange-700 font-medium"
                >
                  Sign in
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Benefits Section */}
        <div className="mt-12 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Why Choose AstroTick?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">
                Authentic Vedic Astrology
              </h3>
              <p className="text-gray-600 text-sm">
                Get accurate birth chart analysis using traditional Vedic
                methods and Swiss Ephemeris calculations.
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Expert Astrologers</h3>
              <p className="text-gray-600 text-sm">
                Connect with certified astrologers for personalized
                consultations and guidance.
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Secure & Private</h3>
              <p className="text-gray-600 text-sm">
                Your personal information and consultations are completely
                secure and confidential.
              </p>
            </div>
          </div>
        </div>

        {/* Features List */}
        <div className="mt-12 max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold text-center mb-6">
              What You Get With Your Account
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                <span className="text-sm">Free birth chart generation</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                <span className="text-sm">Daily Panchang access</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                <span className="text-sm">Personalized horoscopes</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                <span className="text-sm">Expert astrologer consultations</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                <span className="text-sm">Compatibility matching</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                <span className="text-sm">Astrological remedies</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
