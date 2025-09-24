import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "src/components/ui/card";
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "src/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "src/components/ui/tabs";
import { useLocation } from "wouter";
import { useToast } from "src/hooks/use-toast";
import { apiRequest } from "src/lib/queryClient";
import { User, Shield, Mail, KeyRound, Star, Users, Award } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";
import { useAuth } from "src/hooks/useAuth";
import DeferredSection from "src/components/DeferredSection";
import LazyImage from "src/components/LazyImage";

const pinLoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  pin: z.string().regex(/^\d{6}$/, "PIN must be exactly 6 digits")
});

const otpRequestSchema = z.object({
  email: z.string().email("Please enter a valid email address")
});

const otpLoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  otpCode: z.string().regex(/^\d{6}$/, "OTP must be exactly 6 digits")
});

type PinLoginFormData = z.infer<typeof pinLoginSchema>;
type OtpRequestFormData = z.infer<typeof otpRequestSchema>;
type OtpLoginFormData = z.infer<typeof otpLoginSchema>;

interface LoginResponse {
  success: boolean;
  token?: string;
  user?: {
    id: number;
    email: string;
    username: string;
    role: string;
  };
  message?: string;
}

interface OtpResponse {
  success: boolean;
  message?: string;
}

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { refreshAuth } = useAuth();
  const [activeTab, setActiveTab] = useState("pin");
  const [otpSent, setOtpSent] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");

  // Hard refresh function to ensure clean app state after login
  const performHardRefresh = () => {
    console.log("🔄 Performing hard refresh after successful login");
    // Clear any cached data and force complete page reload
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          caches.delete(name);
        });
      });
    }
    // Force hard refresh
    window.location.reload();
  };

  // Get redirect and email parameters from URL on component mount
  const urlParams = new URLSearchParams(window.location.search);
  const redirectParam = urlParams.get('redirect');
  const emailParam = urlParams.get('email');
  const pinParam = urlParams.get('pin');
  const autoLoginParam = urlParams.get('auto_login');
  
  // Store redirect parameter in localStorage if it exists
  if (redirectParam && !localStorage.getItem('auth_redirect')) {
    localStorage.setItem('auth_redirect', redirectParam);
    console.log("🔗 Storing redirect parameter from URL:", redirectParam);
  }

  const pinForm = useForm<PinLoginFormData>({
    resolver: zodResolver(pinLoginSchema),
    defaultValues: {
      email: emailParam || "",
      pin: pinParam || "",
    },
  });

  const otpRequestForm = useForm<OtpRequestFormData>({
    resolver: zodResolver(otpRequestSchema),
    defaultValues: {
      email: emailParam || "",
    },
  });

  const otpLoginForm = useForm<OtpLoginFormData>({
    resolver: zodResolver(otpLoginSchema),
    defaultValues: {
      email: emailParam || "",
      otpCode: "",
    },
  });

  const pinLoginMutation = useMutation<LoginResponse, Error, PinLoginFormData>({
    mutationFn: async (data: PinLoginFormData) => {
      const response = await apiRequest("POST", "/api/auth/login-pin", data);
      return response;
    },
    onSuccess: async (data) => {
      if (data.success && data.token && data.user) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        toast({
          title: "Welcome back!",
          description: "You have been logged in successfully.",
        });
        
        // Check for redirect parameter first, then role-based redirect
        const redirect = localStorage.getItem('auth_redirect');
        const userRole = data.user.role;
        
        console.log("🔍 PIN Login Success - User Role:", userRole, "Redirect:", redirect);
        
        // Force auth state refresh first, then navigate
        try {
          await refreshAuth();
          console.log("🔄 Auth state refreshed, waiting for router sync...");
          
          // Wait for auth state to propagate to router
          setTimeout(() => {
            if (redirect) {
              localStorage.removeItem('auth_redirect');
              console.log("🔄 Redirecting to stored redirect:", redirect);
              // Use window.location for external navigation to ensure proper redirect
              if (redirect.startsWith('http') || redirect.includes('/premium-report') || redirect.includes('/consultation')) {
                window.location.href = redirect;
              } else {
                setLocation(redirect);
              }
            } else if (userRole === 'admin') {
              console.log("🔄 Redirecting admin to dashboard");
              setLocation("/admin-dashboard");
            } else if (userRole === 'astrologer') {
              console.log("🔄 Redirecting astrologer to dashboard");
              setLocation("/astrologer-dashboard");
            } else {
              console.log("🔄 Redirecting user to home");
              setLocation("/");
            }
          }, 1200); // Increased delay for better auth state sync
        } catch (error) {
          console.error("Failed to refresh auth:", error);
          // Use hard refresh as fallback
          setTimeout(() => {
            performHardRefresh();
          }, 500);
        }
      } else {
        toast({
          title: "Login failed",
          description: data.message || "Invalid credentials",
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Login failed",
        description: error.message || "An error occurred during login",
        variant: "destructive",
      });
    },
  });

  const otpRequestMutation = useMutation<OtpResponse, Error, OtpRequestFormData>({
    mutationFn: async (data: OtpRequestFormData) => {
      const response = await apiRequest("POST", "/api/auth/request-login-otp", data);
      return response;
    },
    onSuccess: (data, variables) => {
      if (data.success) {
        setOtpSent(true);
        setOtpEmail(variables.email);
        otpLoginForm.setValue("email", variables.email);
        toast({
          title: "OTP Sent",
          description: "Check your email for the 6-digit login code.",
        });
      } else {
        toast({
          title: "Failed to send OTP",
          description: data.message || "Please try again",
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Failed to send OTP",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    },
  });

  const otpLoginMutation = useMutation<LoginResponse, Error, OtpLoginFormData>({
    mutationFn: async (data: OtpLoginFormData) => {
      const response = await apiRequest("POST", "/api/auth/login-otp", data);
      return response;
    },
    onSuccess: async (data) => {
      if (data.success && data.token && data.user) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        toast({
          title: "Welcome back!",
          description: "You have been logged in successfully.",
        });
        
        // Check for redirect parameter first, then role-based redirect
        const redirect = localStorage.getItem('auth_redirect');
        const userRole = data.user.role;
        
        console.log("🔍 OTP Login Success - User Role:", userRole, "Redirect:", redirect);
        
        // Force auth state refresh first, then navigate
        try {
          await refreshAuth();
          console.log("🔄 Auth state refreshed, waiting for router sync...");
          
          // Wait for auth state to propagate to router
          setTimeout(() => {
            if (redirect) {
              localStorage.removeItem('auth_redirect');
              console.log("🔄 Redirecting to stored redirect:", redirect);
              // Use window.location for external navigation to ensure proper redirect
              if (redirect.startsWith('http') || redirect.includes('/premium-report') || redirect.includes('/consultation')) {
                window.location.href = redirect;
              } else {
                setLocation(redirect);
              }
            } else if (userRole === 'admin') {
              console.log("🔄 Redirecting admin to dashboard");
              setLocation("/admin-dashboard");
            } else if (userRole === 'astrologer') {
              console.log("🔄 Redirecting astrologer to dashboard");
              setLocation("/astrologer-dashboard");
            } else {
              console.log("🔄 Redirecting user to home");
              setLocation("/");
            }
          }, 1200); // Increased delay for better auth state sync
        } catch (error) {
          console.error("Failed to refresh auth:", error);
          // Use hard refresh as fallback
          setTimeout(() => {
            performHardRefresh();
          }, 500);
        }
      } else {
        toast({
          title: "Login failed",
          description: data.message || "Invalid OTP code",
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Login failed",
        description: error.message || "An error occurred during login",
        variant: "destructive",
      });
    },
  });

  const onPinSubmit = (data: PinLoginFormData) => {
    pinLoginMutation.mutate(data);
  };

  const onOtpRequest = (data: OtpRequestFormData) => {
    otpRequestMutation.mutate(data);
  };

  const onOtpLogin = (data: OtpLoginFormData) => {
    otpLoginMutation.mutate(data);
  };

  // Auto-submit login when coming from email link
  useEffect(() => {
    if (autoLoginParam === 'true' && emailParam && pinParam) {
      console.log('🔄 [AUTO-LOGIN] Auto-submitting PIN login form with:', { email: emailParam, hasPin: !!pinParam });
      
      // Show loading message
      toast({
        title: "Logging you in...",
        description: "Please wait while we authenticate your credentials.",
      });
      
      // Auto-submit the PIN form after a short delay to ensure form is ready
      setTimeout(() => {
        const formData = {
          email: emailParam,
          pin: pinParam
        };
        pinLoginMutation.mutate(formData);
      }, 500);

      // Clean up URL parameters after auto-submit
      const url = new URL(window.location.href);
      url.searchParams.delete('auto_login');
      url.searchParams.delete('pin');
      window.history.replaceState({}, '', url.toString());
    }
  }, [autoLoginParam, emailParam, pinParam, pinLoginMutation, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <AstroTickHeader />

      <main className="container mx-auto px-4 py-8">
        {/* Marketing Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome Back to Astrotick
          </h1>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            Continue your astrological journey with personalized insights and expert guidance.
          </p>

          {/* Trust Indicators */}
          <div className="flex justify-center space-x-8 mb-8">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-orange-600" />
              <span className="text-sm text-gray-600">10,000+ Users</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-orange-600" />
              <span className="text-sm text-gray-600">Certified Experts</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-orange-600" />
              <span className="text-sm text-gray-600">4.8/5 Rating</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
          <CardDescription className="text-center">
            Sign in to your AstroTick account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Google Login at the top */}
          <div className="mb-6">
            <button
              onClick={() => {
                // Store current URL as redirect target
                const currentUrl = window.location.pathname + window.location.search;
                const redirectUrl = currentUrl === '/login' ? '/' : currentUrl;
                window.location.href = `/auth/google?redirect=${encodeURIComponent(redirectUrl)}`;
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
              <span className="bg-white px-2 text-gray-500">Or sign in with</span>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="pin">PIN Login</TabsTrigger>
              <TabsTrigger value="otp">Email OTP</TabsTrigger>
            </TabsList>

            <TabsContent value="pin" className="space-y-4 mt-6">
              <Form {...pinForm}>
                <form onSubmit={pinForm.handleSubmit(onPinSubmit)} className="space-y-4">
                  <FormField
                    control={pinForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
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

                  <FormField
                    control={pinForm.control}
                    name="pin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>6-Digit PIN</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Shield className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input 
                              placeholder="Enter your 6-digit PIN"
                              type="password"
                              maxLength={6}
                              autoComplete="current-password"
                              className="pl-10 text-center text-lg tracking-widest font-mono"
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={pinLoginMutation.isPending}
                  >
                    {pinLoginMutation.isPending ? "Signing in..." : "Sign In with PIN"}
                  </Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="otp" className="space-y-4 mt-6">
              {!otpSent ? (
                <Form {...otpRequestForm}>
                  <form onSubmit={otpRequestForm.handleSubmit(onOtpRequest)} className="space-y-4">
                    <FormField
                      control={otpRequestForm.control}
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

                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={otpRequestMutation.isPending}
                    >
                      {otpRequestMutation.isPending ? "Sending OTP..." : "Send Login Code"}
                    </Button>
                  </form>
                </Form>
              ) : (
                <Form {...otpLoginForm}>
                  <form onSubmit={otpLoginForm.handleSubmit(onOtpLogin)} className="space-y-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <Mail className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <p className="text-sm text-green-700">
                        We've sent a 6-digit code to<br />
                        <strong>{otpEmail}</strong>
                      </p>
                    </div>

                    <FormField
                      control={otpLoginForm.control}
                      name="otpCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>6-Digit Code</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <KeyRound className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input 
                                placeholder="Enter the 6-digit code"
                                type="text"
                                maxLength={6}
                                className="pl-10 text-center text-lg tracking-widest font-mono"
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={otpLoginMutation.isPending}
                    >
                      {otpLoginMutation.isPending ? "Verifying..." : "Verify & Sign In"}
                    </Button>

                    <Button 
                      type="button" 
                      variant="outline"
                      className="w-full" 
                      onClick={() => {
                        setOtpSent(false);
                        setOtpEmail("");
                        otpRequestForm.reset();
                        otpLoginForm.reset();
                      }}
                    >
                      Try Different Email
                    </Button>
                  </form>
                </Form>
              )}
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">Don't have an account? </span>
            <button 
              onClick={() => setLocation("/signup")}
              className="text-orange-600 hover:text-orange-700 font-medium"
            >
              Sign up
            </button>
          </div>

          <div className="mt-2 text-center">
            <button 
              onClick={() => setLocation("/reset-pin")}
              className="text-sm text-gray-500 hover:text-orange-600"
            >
              Forgot your PIN? Reset it here
            </button>
          </div>
        </CardContent>
      </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}