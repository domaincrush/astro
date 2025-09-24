import { useState, useEffect, lazy, Suspense } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Helmet } from "react-helmet-async";
import AstroTickHeader from "@/components/layout/AstroTickHeader";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LocationSearch } from "@/components/LocationSearch";
import { toast } from "@/hooks/use-toast";
import {
  Loader2,
  Download,
  Star,
  Clock,
  FileText,
  Users,
  Heart,
  Briefcase,
  BarChart,
  TrendingUp,
  Target,
  Mail,
  Lock,
  BookOpen,
  CheckCircle,
  AlertTriangle,
  Grid,
  User,
  DollarSign,
  Baby,
  Globe,
  Activity,
  Compass,
  Calendar,
  Zap,
  ArrowRight,
} from "lucide-react";
import PanchangDropdown from "@/components/astrology/PanchangDropdown";
import {
  initPerformanceOptimizations,
  inlineCriticalCSS,
} from "@/utils/performance";
import {
  ComponentLoader,
  ChartLoader,
  ReportLoader,
} from "@/components/PerformanceOptimizedLoader";

// Lazy load heavy components to improve initial load time
const ProfessionalReportHeader = lazy(() =>
  import("@/components/ProfessionalReportHeader").then((module) => ({
    default: module.ProfessionalReportHeader,
  })),
);
const ExecutiveDashboard = lazy(() =>
  import("@/components/ExecutiveDashboard").then((module) => ({
    default: module.ExecutiveDashboard,
  })),
);
const DataVisualizations = lazy(() =>
  import("@/components/DataVisualizations").then((module) => ({
    default: module.DataVisualizations,
  })),
);

const SidebarCallouts = lazy(() =>
  import("@/components/SidebarCallouts").then((module) => ({
    default: module.SidebarCallouts,
  })),
);
const DeferredSection = lazy(() => import("@/components/DeferredSection"));
const LazyImage = lazy(() => import("@/components/LazyImage"));
const Section1PersonalDetails = lazy(
  () => import("@/components/Section1PersonalDetails"),
);

interface BirthFormData {
  name: string;
  gender: string;
  date: string;
  time: string;
  place: string;
  latitude: number;
  longitude: number;
}

interface ReportTemplate {
  name: string;
  description: string;
  sections: string[];
  estimated_pages: number;
  calculation_time: string;
}

export default function PremiumReport() {
  const { user, isAuthenticated, loading, refreshAuth } = useAuth();
  const [, setLocation] = useLocation();

  const [formData, setFormData] = useState<BirthFormData>({
    name: "",
    gender: "male",
    date: "",
    time: "",
    place: "",
    latitude: 0,
    longitude: 0,
  });

  const [generatedReport, setGeneratedReport] = useState<any>(null);
  const [emailAddress, setEmailAddress] = useState<string>("");

  // Initialize performance optimizations and preload Ganesha image
  useEffect(() => {
    inlineCriticalCSS();
    initPerformanceOptimizations();

    // Preload Ganesha image immediately
    const img = new Image();
    img.src = "/ganesha.jpg";
    img.onload = () => console.log("Ganesha image preloaded successfully");
    img.onerror = () => console.error("Failed to preload Ganesha image");
  }, []);

  // ALL HOOKS MOVED TO TOP BEFORE ANY CONDITIONAL RETURNS TO FIX REACT ERROR #310

  // Fetch available report templates
  const {
    data: templatesData,
    isLoading: templatesLoading,
    error: templatesError,
  } = useQuery({
    queryKey: ["/api/premium-report/templates"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/premium-report/templates", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch templates");
      return response.json();
    },
    enabled: !!isAuthenticated, // Only fetch if authenticated
  });

  // Fetch user's latest premium report
  const { data: latestReportData, isLoading: latestReportLoading } = useQuery({
    queryKey: ["/api/premium-report/latest", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/premium-report/latest/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          // No existing report found, return null
          return null;
        }
        throw new Error("Failed to fetch latest report");
      }
      return response.json();
    },
    enabled: !!isAuthenticated && !!user?.id, // Only fetch if authenticated and user ID available
  });

  // Don't auto-load existing reports - only show after explicit generation
  // This prevents the report from showing automatically when visiting the page

  // Function to format date input with slashes
  const formatDateInput = (value: string): string => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, "");

    // Add slashes at appropriate positions
    if (digits.length <= 2) {
      return digits;
    } else if (digits.length <= 4) {
      return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    } else {
      return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
    }
  };

  // Function to validate DD/MM/YYYY format
  const validateDate = (dateStr: string): boolean => {
    const pattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = dateStr.match(pattern);

    if (!match) return false;

    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const year = parseInt(match[3], 10);

    // Basic validation
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
    if (year < 1900 || year > new Date().getFullYear()) return false;

    // More specific month validation
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    // Check for leap year
    if (
      month === 2 &&
      ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0)
    ) {
      daysInMonth[1] = 29;
    }

    return day <= daysInMonth[month - 1];
  };

  // Function to convert DD/MM/YYYY to YYYY-MM-DD format
  const convertDateFormat = (ddmmyyyy: string): string => {
    if (!ddmmyyyy) return "";
    const parts = ddmmyyyy.split("/");
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
    return ddmmyyyy;
  };

  // Generate premium report mutation
  const generateReportMutation = useMutation({
    mutationFn: async (birthData: BirthFormData) => {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/premium-report/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...birthData,
          date: convertDateFormat(birthData.date), // Convert to YYYY-MM-DD format
          reportType: "super_horoscope", // Default report type
        }),
      });

      if (!response.ok) {
        let error;
        try {
          error = await response.json();
        } catch {
          throw new Error(`Request failed with status ${response.status}`);
        }

        // Handle hardcoded content errors specifically
        if (error?.error_type === "hardcoded_content_error") {
          throw new Error(
            `Data Integrity Error: ${error.message || error.error || "Invalid data detected"}`,
          );
        }
        // Handle authentication errors specifically
        if (
          error?.error_type === "authentication_error" ||
          response.status === 401
        ) {
          toast({
            title: "Authentication Required",
            description: "Please log in again to access premium reports.",
            variant: "destructive",
          });
          // Redirect to login with current page as redirect parameter
          setLocation(
            "/login?redirect=" + encodeURIComponent("/reports/premium"),
          );
          throw new Error(
            `Authentication Error: ${error.message || error.error || "Authentication failed"}`,
          );
        }

        const errorMessage =
          error?.message ||
          error?.error ||
          error?.details ||
          "Failed to generate report";
        throw new Error(
          typeof errorMessage === "string"
            ? errorMessage
            : "Unknown error occurred",
        );
      }

      const result = await response.json();
      console.log("Raw API response structure:", result);
      // Extract data from API response structure
      return result.success ? result.report : result;
    },
    onSuccess: (data) => {
      console.log("Premium report data received:", data);
      console.log("Available sections:", Object.keys(data));

      // Debug comprehensive sections specifically
      const comprehensiveSections = [
        "detailed_nakshatra_analysis",
        "house_lords_karakatva",
        "upagraha_calculations",
        "aspect_analysis",
        "unified_planetary_strength",
        "unified_dasha_system",
        "detailed_life_predictions",
      ];
      comprehensiveSections.forEach((section) => {
        if (data[section]) {
          console.log(`✅ ${section}:`, data[section]);
        } else {
          console.log(`❌ ${section}: Missing`);
        }
      });

      // The data is the report itself, not wrapped in a report property
      setGeneratedReport(data);
      toast({
        title: "Premium Report Generated!",
        description: "Your comprehensive astrology report is ready.",
      });

      // Auto-scroll to the generated report section after a short delay
      setTimeout(() => {
        const reportSection = document.querySelector("[data-generated-report]");
        if (reportSection) {
          reportSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 500);
    },
    onError: (error: Error) => {
      console.error("Premium report generation error:", error);

      // Handle authentication errors with specific messaging
      if (error.message.includes("Authentication Error")) {
        toast({
          title: "Data Authenticity Error",
          description:
            "Cannot generate premium report: Authentic astronomical data could not be calculated. Please verify birth details are accurate and try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Report Generation Failed",
          description:
            error.message || "Please check your birth details and try again.",
          variant: "destructive",
        });
      }
    },
  });

  // Direct signup mutation for premium report signup
  const signupMutation = useMutation({
    mutationFn: async (data: {
      email: string;
      pin: string;
      confirmPin: string;
      signupData: { email: string; pin: string };
    }) => {
      // First, create the account
      const signupResponse = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          pin: data.pin,
          confirmPin: data.confirmPin,
        }),
      });

      if (!signupResponse.ok) {
        let errorData;
        try {
          errorData = await signupResponse.json();
        } catch {
          throw new Error(`Signup failed with status ${signupResponse.status}`);
        }
        throw new Error(errorData.message || "Signup failed");
      }

      let signupResult;
      try {
        signupResult = await signupResponse.json();
      } catch {
        throw new Error("Invalid response format from signup");
      }

      // Immediately log the user in with PIN
      const loginResponse = await fetch("/api/auth/login-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          pin: data.pin,
        }),
      });

      if (!loginResponse.ok) {
        let errorData;
        try {
          errorData = await loginResponse.json();
        } catch {
          throw new Error(`Auto-login failed with status ${loginResponse.status}`);
        }
        throw new Error(errorData.message || "Auto-login failed");
      }

      let loginResult;
      try {
        loginResult = await loginResponse.json();
      } catch {
        throw new Error("Invalid response format from login");
      }
      return { ...loginResult, signupData: data.signupData };
    },
    onSuccess: async (data) => {
      // Store authentication data
      if (data.success && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Refresh auth state
        await refreshAuth();

        toast({
          title: "Welcome to AstroTick!",
          description:
            "Your account has been created and you're now logged in. Enjoy your premium report!",
        });

        // Stay on the same page - user is now logged in and can access premium features
        console.log(
          "✅ User successfully signed up and logged in, staying on premium report page",
        );
      } else {
        throw new Error("Authentication failed after signup");
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Signup Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Enhanced PDF Download mutation using comprehensive premium report data
  const downloadPDFMutation = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem("token");
      const headers = { "Content-Type": "application/json" };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      
      const response = await fetch("/api/generate-premium-pdf-report", {
        method: "POST",
        headers,
        body: JSON.stringify({
          birth_details: {
            name: formData.name,
            date: formData.date,
            time: formData.time,
            place: formData.place,
            latitude: formData.latitude,
            longitude: formData.longitude,
            gender: formData.gender,
          },
          reportType: "premium",
        }),
      });

      if (!response.ok) throw new Error("Failed to generate PDF");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${formData.name || "Report"}_Premium_Astrology_Report.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
    onSuccess: () => {
      toast({
        title: "PDF Downloaded!",
        description:
          "Your premium astrology report has been downloaded as PDF.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Download Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Enhanced Email PDF mutation using comprehensive premium report data
  const emailPDFMutation = useMutation({
    mutationFn: async (email: string) => {
      const token = localStorage.getItem("token");
      const headers = { "Content-Type": "application/json" };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      
      const response = await fetch("/api/generate-premium-pdf-report", {
        method: "POST",
        headers,
        body: JSON.stringify({
          birth_details: {
            name: formData.name,
            date: formData.date,
            time: formData.time,
            place: formData.place,
            latitude: formData.latitude,
            longitude: formData.longitude,
            gender: formData.gender,
          },
          reportType: "premium",
          emailAddress: email,
        }),
      });

      if (!response.ok) throw new Error("Failed to email PDF");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Email Sent!",
        description: `Your premium astrology report has been sent to ${emailAddress}.`,
      });
      setEmailAddress("");
    },
    onError: (error: Error) => {
      toast({
        title: "Email Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Now add conditional returns AFTER all hooks

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <>
        <Helmet>
          <title>
            Premium Astrology Report - Get Comprehensive Vedic Analysis |
            AstroTick
          </title>
          <meta
            name="description"
            content="Generate your detailed premium astrology report with complete birth chart analysis, Dasha predictions, career guidance, relationship insights, and health analysis. Authentic Vedic astrology calculations with Swiss Ephemeris data."
          />
          <meta
            name="keywords"
            content="premium astrology report, birth chart analysis, vedic astrology, horoscope report, dasha predictions, career astrology, relationship compatibility, health astrology"
          />
          <meta
            property="og:title"
            content="Premium Astrology Report - Comprehensive Vedic Analysis"
          />
          <meta
            property="og:description"
            content="Get your detailed premium astrology report with birth chart analysis, predictions, and personalized insights based on authentic Vedic calculations."
          />
          <meta property="og:type" content="website" />
          <meta
            property="og:url"
            content="https://astrotick.com/reports/premium"
          />
          <link rel="canonical" href="https://astrotick.com/reports/premium" />
        </Helmet>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
          <AstroTickHeader />
          <div className="py-16">
            <div className="max-w-md mx-auto px-4">
              <Card className="text-center">
                <CardHeader className="pb-4">
                  <Lock className="h-12 w-12 text-purple-600 mx-auto mb-3" />
                  <CardTitle className="text-xl font-bold text-gray-900 mb-2">
                    🎉 FREE Premium Report!
                  </CardTitle>
                  <CardDescription>
                    <div className="text-xs text-gray-500 italic">
                      Creating your account takes just 30 seconds and unlocks
                      exclusive astrology insights worth ₹2,499!
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-0">
                  {/* Signup Form */}
                  <div className="space-y-3">
                    <div className="text-center">
                      <h3 className="text-base font-semibold text-gray-900 mb-1">
                        Sign Up Now for Instant Access
                      </h3>
                    </div>

                    {/* Google Signup Button */}
                    <Button
                      onClick={() =>
                        (window.location.href =
                          "/auth/google?redirect=" +
                          encodeURIComponent("/reports/premium"))
                      }
                      className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 text-base py-3 font-medium shadow-sm"
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
                        <span>Continue with Google</span>
                      </div>
                    </Button>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">or</span>
                      </div>
                    </div>

                    {/* Email Signup Form */}
                    <form
                      className="space-y-2"
                      onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(
                          e.target as HTMLFormElement,
                        );
                        const email = formData.get("email") as string;
                        const pin = formData.get("pin") as string;

                        console.log("Premium report signup form submission:", {
                          email,
                          pin,
                        });

                        // Validate inputs
                        if (!email || !pin) {
                          toast({
                            title: "Missing Information",
                            description:
                              "Please fill in both email and PIN fields.",
                            variant: "destructive",
                          });
                          return;
                        }

                        if (pin.length !== 6 || !/^\d{6}$/.test(pin)) {
                          toast({
                            title: "Invalid PIN",
                            description: "PIN must be exactly 6 digits.",
                            variant: "destructive",
                          });
                          return;
                        }

                        // Handle direct signup here without extra fields
                        signupMutation.mutate({
                          email,
                          pin,
                          confirmPin: pin,
                          signupData: { email, pin },
                        });
                      }}
                    >
                      <div>
                        <Input
                          type="email"
                          name="email"
                          placeholder="Enter your email address"
                          required
                          autoComplete="username"
                          className="w-full"
                        />
                      </div>
                      <div>
                        <Input
                          type="password"
                          name="pin"
                          placeholder="Create a 6-digit PIN"
                          required
                          minLength={6}
                          maxLength={6}
                          pattern="[0-9]{6}"
                          autoComplete="new-password"
                          className="w-full text-center font-mono tracking-wider"
                        />
                      </div>
                      <Button
                        type="submit"
                        disabled={signupMutation.isPending}
                        className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-lg py-3 font-semibold shadow-lg disabled:opacity-50"
                      >
                        <div className="flex items-center justify-center space-x-2">
                          {signupMutation.isPending ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span>Creating Account...</span>
                            </>
                          ) : (
                            <>
                              <span className="text-2xl">🎁</span>
                              <span>Get FREE Premium Report</span>
                            </>
                          )}
                        </div>
                      </Button>
                    </form>
                  </div>

                  <div className="text-center space-y-3">
                    <div className="text-xs text-gray-500">
                      Join thousands of users who trust AstroTick for authentic
                      Vedic astrology insights!
                    </div>

                    <Button
                      variant="outline"
                      onClick={() =>
                        setLocation(
                          "/login?redirect=" +
                            encodeURIComponent("/reports/premium"),
                        )
                      }
                      className="w-full border-purple-200 text-purple-700 hover:bg-purple-50"
                    >
                      Already have an account? Log In
                    </Button>

                    <div className="text-xs text-gray-400">
                      Secure signup • No spam • Instant access • Worth ₹2,499
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          <Footer />
        </div>
      </>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Form submission - Current formData:", formData);

    if (!formData.name || !formData.date || !formData.time || !formData.place) {
      console.log("Missing basic fields:", {
        name: formData.name,
        date: formData.date,
        time: formData.time,
        place: formData.place,
      });
      toast({
        title: "Missing Information",
        description: "Please fill in all birth details.",
        variant: "destructive",
      });
      return;
    }

    if (!validateDate(formData.date)) {
      console.log("Invalid date format:", formData.date);
      toast({
        title: "Invalid Date",
        description: "Please enter a valid date in DD/MM/YYYY format.",
        variant: "destructive",
      });
      return;
    }

    if (
      !formData.latitude ||
      !formData.longitude ||
      formData.latitude === 0 ||
      formData.longitude === 0 ||
      typeof formData.latitude !== "number" ||
      typeof formData.longitude !== "number"
    ) {
      console.log("Invalid coordinates:", {
        latitude: formData.latitude,
        longitude: formData.longitude,
        latType: typeof formData.latitude,
        lonType: typeof formData.longitude,
      });
      toast({
        title: "Location Required",
        description:
          "Please select a city from the location suggestions dropdown.",
        variant: "destructive",
      });
      return;
    }

    console.log("Form validation passed, submitting:", formData);
    generateReportMutation.mutate(formData);
  };

  const templates = templatesData?.templates || {};

  return (
    <>
      <Helmet>
        <title>
          Premium Astrology Report - Generate Your Detailed Horoscope |
          AstroTick
        </title>
        <meta
          name="description"
          content="Create your comprehensive premium astrology report with detailed birth chart analysis, planetary positions, Dasha timeline, career predictions, relationship insights, and remedial measures. Authentic Vedic astrology calculations."
        />
        <meta
          name="keywords"
          content="premium horoscope, detailed astrology report, birth chart calculator, vedic predictions, dasha analysis, career astrology, marriage astrology, health predictions"
        />
        <meta
          property="og:title"
          content="Premium Astrology Report Generator - Detailed Horoscope Analysis"
        />
        <meta
          property="og:description"
          content="Generate your premium astrology report with comprehensive birth chart analysis, predictions, and personalized insights based on authentic Vedic calculations."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://astrotick.com/reports/premium"
        />
        <link rel="canonical" href="https://astrotick.com/reports/premium" />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <AstroTickHeader />

        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8 relative">
            <div className="absolute top-0 right-0">
              <PanchangDropdown />
            </div>
          </div>

          {/* Center-aligned Form Container */}
          <div className="max-w-2xl mx-auto mb-8">
            <Card className="bg-white/90 backdrop-blur-sm border-amber-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center justify-center gap-2">
                  <FileText className="h-6 w-6" />
                  Premium Astrology Report
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="Enter full name"
                        className="bg-white border-amber-200 focus:border-amber-500 focus:ring-amber-500/20"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="gender">Gender</Label>
                      <Select
                        value={formData.gender}
                        onValueChange={(value) =>
                          setFormData({ ...formData, gender: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="date">Date of Birth</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {/* Day */}
                        <Select
                          value={formData.date ? formData.date.split("/")[0] : ""}
                          onValueChange={(day) => {
                            const dateParts = formData.date ? formData.date.split("/") : ["", "", ""];
                            const newDate = `${day}/${dateParts[1] || "01"}/${dateParts[2] || "2000"}`;
                            setFormData({ ...formData, date: newDate });
                          }}
                        >
                          <SelectTrigger className="bg-white border-amber-200 focus:border-amber-500 focus:ring-amber-500/20">
                            <SelectValue placeholder="Day" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 31 }, (_, i) => (
                              <SelectItem
                                key={i + 1}
                                value={String(i + 1).padStart(2, "0")}
                              >
                                {i + 1}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {/* Month */}
                        <Select
                          value={formData.date ? formData.date.split("/")[1] : ""}
                          onValueChange={(month) => {
                            const dateParts = formData.date ? formData.date.split("/") : ["", "", ""];
                            const newDate = `${dateParts[0] || "01"}/${month}/${dateParts[2] || "2000"}`;
                            setFormData({ ...formData, date: newDate });
                          }}
                        >
                          <SelectTrigger className="bg-white border-amber-200 focus:border-amber-500 focus:ring-amber-500/20">
                            <SelectValue placeholder="Month" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 12 }, (_, i) => (
                              <SelectItem
                                key={i + 1}
                                value={String(i + 1).padStart(2, "0")}
                              >
                                {i + 1}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {/* Year */}
                        <Select
                          value={formData.date ? formData.date.split("/")[2] : ""}
                          onValueChange={(year) => {
                            const dateParts = formData.date ? formData.date.split("/") : ["", "", ""];
                            const newDate = `${dateParts[0] || "01"}/${dateParts[1] || "01"}/${year}`;
                            setFormData({ ...formData, date: newDate });
                          }}
                        >
                          <SelectTrigger className="bg-white border-amber-200 focus:border-amber-500 focus:ring-amber-500/20">
                            <SelectValue placeholder="Year" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 120 }, (_, i) => {
                              const year = new Date().getFullYear() - i;
                              return (
                                <SelectItem key={year} value={String(year)}>
                                  {year}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Format: DD/MM/YYYY (e.g., 15/08/1990)
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="time">Time of Birth</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {/* Hour */}
                        <Select
                          value={formData.time ? formData.time.split(":")[0] : ""}
                          onValueChange={(hour) => {
                            const timeParts = formData.time ? formData.time.split(":") : ["", ""];
                            const newTime = `${hour}:${timeParts[1] || "00"}`;
                            setFormData({ ...formData, time: newTime });
                          }}
                        >
                          <SelectTrigger className="bg-white border-amber-200 focus:border-amber-500 focus:ring-amber-500/20">
                            <SelectValue placeholder="Hour" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 24 }, (_, i) => (
                              <SelectItem key={i} value={String(i).padStart(2, "0")}>
                                {i}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {/* Minute */}
                        <Select
                          value={formData.time ? formData.time.split(":")[1] : ""}
                          onValueChange={(minute) => {
                            const timeParts = formData.time ? formData.time.split(":") : ["", ""];
                            const newTime = `${timeParts[0] || "00"}:${minute}`;
                            setFormData({ ...formData, time: newTime });
                          }}
                        >
                          <SelectTrigger className="bg-white border-amber-200 focus:border-amber-500 focus:ring-amber-500/20">
                            <SelectValue placeholder="Minute" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 60 }, (_, i) => (
                              <SelectItem key={i} value={String(i).padStart(2, "0")}>
                                {String(i).padStart(2, "0")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="place">Place of Birth</Label>
                      <LocationSearch
                        value={formData.place}
                        onChange={(displayName, latitude, longitude) => {
                          console.log(
                            "Location changed:",
                            displayName,
                            latitude,
                            longitude,
                          );
                          if (
                            latitude &&
                            longitude &&
                            typeof latitude === "number" &&
                            typeof longitude === "number"
                          ) {
                            console.log(
                              "Setting coordinates:",
                              latitude,
                              longitude,
                            );
                            setFormData({
                              ...formData,
                              place: displayName,
                              latitude: latitude,
                              longitude: longitude,
                            });
                          } else {
                            // User is typing, update place but keep existing coordinates if they exist
                            setFormData((prev) => ({
                              ...prev,
                              place: displayName,
                            }));
                          }
                        }}
                        onLocationSelect={(location) => {
                          console.log(
                            "Location selected:",
                            location,
                          );
                          if (location && location.latitude && location.longitude) {
                            console.log("Setting place to:", location.place);
                            setFormData({
                              ...formData,
                              place: location.place,
                              latitude: location.latitude,
                              longitude: location.longitude,
                            });
                          }
                        }}
                        placeholder="Enter birth city and select from dropdown"
                        className="bg-white border-amber-200 focus:border-amber-500 focus:ring-amber-500/20"
                      />
                      {formData.latitude !== 0 && formData.longitude !== 0 && (
                        <p className="text-sm text-green-600 mt-1">
                          ✓ Location confirmed: {formData.place}
                        </p>
                      )}
                      {formData.place &&
                        (formData.latitude === 0 ||
                          formData.longitude === 0) && (
                          <p className="text-sm text-orange-600 mt-1">
                            ⚠ Please select your city from the dropdown
                            suggestions
                          </p>
                        )}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white h-12 text-lg"
                    disabled={generateReportMutation.isPending}
                  >
                    {generateReportMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating Report...
                      </>
                    ) : (
                      "Generate Premium Report"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Ancient Manuscript Scroll Design */}
          {generatedReport && (
            <div
              className="max-w-6xl mx-auto mt-12 relative"
              data-generated-report
            >
              {/* Scroll Top Ornament - Enhanced */}
              <div className="flex justify-center mb-8">
                <div className="w-48 h-12 bg-gradient-to-r from-amber-900 via-yellow-800 to-amber-900 rounded-full shadow-xl scroll-ornament flex items-center justify-center border-2 border-amber-800">
                  <div className="w-40 h-6 bg-gradient-to-r from-yellow-700 via-amber-600 to-yellow-700 rounded-full shadow-inner"></div>
                </div>
              </div>

              {/* Main Manuscript Scroll Container - Enhanced */}
              <div className="relative">
                {/* Scroll Background with Authentic Parchment Texture */}
                <div
                  className="absolute inset-0 bg-gradient-to-br from-yellow-100 via-amber-50 to-orange-100 ancient-scroll-shadow parchment-texture border-8 border-amber-800/60"
                  style={{
                    background:
                      "linear-gradient(135deg, #fefce8 0%, #fef3c7 25%, #fed7aa 50%, #fbbf24 100%)",
                    borderImage:
                      "linear-gradient(45deg, #92400e, #d97706, #92400e) 1",
                  }}
                >
                  {/* Paper Texture Overlay */}
                  <div
                    className="absolute inset-0 opacity-20 bg-repeat"
                    style={{
                      backgroundImage: `radial-gradient(circle at 20% 80%, rgba(120, 53, 15, 0.3) 0%, transparent 50%),
                                   radial-gradient(circle at 80% 20%, rgba(120, 53, 15, 0.3) 0%, transparent 50%),
                                   radial-gradient(circle at 40% 40%, rgba(120, 53, 15, 0.2) 0%, transparent 50%)`,
                      backgroundSize: "30px 30px, 25px 25px, 40px 40px",
                    }}
                  ></div>

                  {/* Aged Paper Stains */}
                  <div className="absolute top-10 right-12 w-16 h-16 rounded-full bg-amber-200/40 blur-sm"></div>
                  <div className="absolute bottom-20 left-8 w-12 h-12 rounded-full bg-orange-200/30 blur-sm"></div>
                  <div className="absolute top-1/3 left-1/4 w-8 h-8 rounded-full bg-amber-300/20 blur-sm"></div>
                </div>

                {/* Scroll Side Ornaments */}
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-b from-amber-700 via-amber-600 to-amber-700 rounded-l-lg shadow-lg">
                  <div className="flex flex-col items-center justify-center h-full space-y-4">
                    <div className="w-4 h-4 bg-amber-400 rounded-full shadow-sm"></div>
                    <div className="w-3 h-16 bg-gradient-to-b from-amber-500 to-amber-700 rounded-full"></div>
                    <div className="w-4 h-4 bg-amber-400 rounded-full shadow-sm"></div>
                  </div>
                </div>

                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-b from-amber-700 via-amber-600 to-amber-700 rounded-r-lg shadow-lg">
                  <div className="flex flex-col items-center justify-center h-full space-y-4">
                    <div className="w-4 h-4 bg-amber-400 rounded-full shadow-sm"></div>
                    <div className="w-3 h-16 bg-gradient-to-b from-amber-500 to-amber-700 rounded-full"></div>
                    <div className="w-4 h-4 bg-amber-400 rounded-full shadow-sm"></div>
                  </div>
                </div>

                {/* Content Area with Manuscript Styling */}
                <div className="relative px-10 py-12 min-h-[800px]">
                  {/* Manuscript Header with Lord Ganesha */}
                  <div className="text-center mb-8 pb-6 border-b-2 border-amber-600/30">
                    {/* Preload Ganesha Image */}
                    <link rel="preload" as="image" href="/ganesha.jpg" />

                    {/* Centered Sanskrit Text */}
                    <div className="text-center mb-6">
                      <h1
                        className="text-3xl font-serif text-amber-900 mb-2 tracking-wide"
                        style={{ fontFamily: "serif" }}
                      >
                        ॐ Vedic Astrology Manuscript ॐ
                      </h1>
                      <div className="text-amber-700 text-sm font-medium tracking-widest uppercase">
                        Ancient Wisdom • Modern Precision
                      </div>
                    </div>

                    {/* Lord Ganesha Image - Centered */}
                    <div className="flex justify-center mb-4">
                      <div className="flex-shrink-0">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-amber-600/40 shadow-lg bg-gradient-to-br from-amber-100 to-orange-100">
                          <img
                            src="/ganesha.jpg"
                            alt="Lord Ganesha - Remover of Obstacles"
                            className="w-full h-full object-cover"
                            style={{
                              filter:
                                "sepia(10%) saturate(110%) brightness(105%)",
                            }}
                            loading="eager"
                            onLoad={() =>
                              console.log("Ganesha image loaded successfully")
                            }
                            onError={(e) => {
                              console.error("Failed to load Ganesha image");
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Centered decorative line */}
                    <div className="flex items-center justify-center">
                      <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-600 to-transparent"></div>
                      <div className="mx-3 w-2 h-2 bg-amber-600 rounded-full"></div>
                      <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-600 to-transparent"></div>
                    </div>
                  </div>

                  {/* Executive Dashboard Content */}
                  <div className="manuscript-content">
                    <Suspense
                      fallback={
                        <div className="flex items-center justify-center py-12">
                          <div className="text-center">
                            <div className="w-16 h-16 border-4 border-amber-600/30 border-t-amber-600 rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-amber-700 font-medium">
                              Consulting Ancient Texts...
                            </p>
                          </div>
                        </div>
                      }
                    >
                      <ExecutiveDashboard reportData={generatedReport} />
                    </Suspense>
                  </div>

                  {/* Enhanced PDF Download Message */}
                  <div className="text-center mt-6 pt-4 border-t border-amber-300/50">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200 mb-4">
                      <h4 className="text-sm font-medium text-green-800 mb-2">✅ Enhanced PDF System</h4>
                      <p className="text-xs text-green-700 leading-relaxed">
                        Your PDF downloads now include all 100+ sections with comprehensive data mapping, 
                        ExecutiveDashboard styling, nested sub-sections, and authentic astrological calculations.
                      </p>
                    </div>
                  </div>

                  {/* PDF Download Actions */}
                  <div className="text-center mt-8 pt-6 border-t-2 border-amber-600/30">
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-lg border border-amber-200 mb-6">
                      <h3 className="text-lg font-semibold text-amber-800 mb-4 flex items-center justify-center gap-2">
                        <Download className="w-5 h-5" />
                        Download Your Report
                      </h3>
                      <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                        <Button
                          onClick={() => downloadPDFMutation.mutate()}
                          disabled={downloadPDFMutation.isPending}
                          className="flex-1 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg disabled:opacity-50"
                        >
                          {downloadPDFMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Generating PDF...
                            </>
                          ) : (
                            <>
                              <Download className="mr-2 h-4 w-4" />
                              Download PDF
                            </>
                          )}
                        </Button>
                        <Button
                          onClick={() => {
                            const email = prompt("Enter your email address:");
                            if (email) {
                              setEmailAddress(email);
                              emailPDFMutation.mutate(email);
                            }
                          }}
                          disabled={emailPDFMutation.isPending}
                          variant="outline"
                          className="flex-1 border-amber-300 text-amber-700 hover:bg-amber-50 font-semibold py-3 px-6 rounded-lg shadow-lg disabled:opacity-50"
                        >
                          {emailPDFMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Sending Email...
                            </>
                          ) : (
                            <>
                              <Mail className="mr-2 h-4 w-4" />
                              Email PDF
                            </>
                          )}
                        </Button>
                      </div>
                      <p className="text-xs text-amber-600 mt-3">
                        Download as PDF or send to your email address
                      </p>
                    </div>
                  </div>

                  {/* Manuscript Footer */}
                  <div className="text-center mt-6 pt-6 border-t-2 border-amber-600/30">
                    <div className="text-xs text-amber-700 opacity-75 font-medium tracking-wide">
                      Generated with Authentic Jyotisha Calculations •{" "}
                      {new Date().toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                    <div className="flex items-center justify-center mt-2">
                      <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
                      <div className="mx-2 w-1 h-1 bg-amber-500 rounded-full"></div>
                      <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scroll Bottom Ornament - Enhanced */}
              <div className="flex justify-center mt-8">
                <div className="w-48 h-12 bg-gradient-to-r from-amber-900 via-yellow-800 to-amber-900 rounded-full shadow-xl scroll-ornament flex items-center justify-center border-2 border-amber-800">
                  <div className="w-40 h-6 bg-gradient-to-r from-yellow-700 via-amber-600 to-yellow-700 rounded-full shadow-inner"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <Footer />
      </div>
    </>
  );
}
