import { useState, useEffect, useMemo, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import { Label } from "src/components/ui/label";
import { Textarea } from "src/components/ui/textarea";
import { Checkbox } from "src/components/ui/checkbox";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "src/components/ui/card";
import { Badge } from "src/components/ui/badge";
import { Separator } from "src/components/ui/separator";
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
import {
  Star,
  Gift,
  Clock,
  Mail,
  CheckCircle,
  AlertCircle,
  CreditCard,
  Loader2,
  MessageSquare,
  User,
  MapPin,
  Phone,
  Calendar,
} from "lucide-react";
import { useToast } from "src/hooks/use-toast";
import LocationSearch from "src/components/LocationSearch";
import { apiRequest } from "src/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
// Manual debounce implementation with cancel method
const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  const executedFunction = function (...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };

  executedFunction.cancel = () => {
    clearTimeout(timeout);
  };

  return executedFunction;
};

// Validation schema - will be created dynamically based on user type
const createFaqFormSchema = (isExistingUser: boolean) =>
  z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    gender: z.enum(["male", "female", "other"], {
      required_error: "Please select your gender",
    }),
    birthDate: z.string().min(1, "Birth date is required"),
    birthTime: z.string().min(1, "Birth time is required"),
    birthPlace: z
      .string()
      .min(2, "Birth place is required")
      .refine(
        (val) => {
          // Check if it's a valid place format (contains letters and possibly comma/spaces)
          const hasValidFormat = /^[a-zA-Z\s,.-]+$/.test(val);
          // Check if it has some substance (not just spaces or single characters)
          const hasSubstance = val.trim().length >= 3;
          return hasValidFormat && hasSubstance;
        },
        {
          message: "Please enter a valid birth place (e.g., Mumbai, India)",
        },
      ),
    freeQuestion: isExistingUser
      ? z.string().optional()
      : z.string().min(10, "Question must be at least 10 characters"),
    additionalQuestion1: z
      .string()
      .optional()
      .or(z.literal(""))
      .refine(
        (val) => {
          // If the field has content, it must be at least 10 characters
          return !val || val.trim().length === 0 || val.trim().length >= 10;
        },
        {
          message: "Question must be at least 10 characters if provided",
        },
      ),
    additionalQuestion2: z
      .string()
      .optional()
      .or(z.literal(""))
      .refine(
        (val) => {
          // If the field has content, it must be at least 10 characters
          return !val || val.trim().length === 0 || val.trim().length >= 10;
        },
        {
          message: "Question must be at least 10 characters if provided",
        },
      ),
  });

// Default schema for new users
const faqFormSchema = createFaqFormSchema(false);

type FaqFormData = z.infer<typeof faqFormSchema> & {
  latitude?: number;
  longitude?: number;
};

interface Question {
  id: number;
  name: string;
  email: string;
  phone: string;
  freeQuestion: string;
  additionalQuestion1?: string;
  additionalQuestion2?: string;
  status: "pending" | "answered";
  createdAt: string;
  answeredAt?: string;
}

// Paid Question Layout Component
function PaidQuestionLayout({
  submittedData,
  emailCheckResult,
  locationCoords,
  resetToMainForm,
}: {
  submittedData: FaqFormData | null;
  emailCheckResult: {
    hasExistingQuestions: boolean;
    canSubmitFree: boolean;
  } | null;
  locationCoords: { latitude: number; longitude: number } | null;
  resetToMainForm: () => void;
}) {
  const [paidQuestions, setPaidQuestions] = useState({
    additionalQuestion1: "",
    additionalQuestion2: "",
  });
  const [isSubmittingFree, setIsSubmittingFree] = useState(false);
  const [isSubmittingPaid, setIsSubmittingPaid] = useState(false);

  const { toast } = useToast();

  // Check if user is existing user who can't submit free questions
  const isExistingFreeUser =
    emailCheckResult?.hasExistingQuestions && !emailCheckResult?.canSubmitFree;

  const handleProceedWithFree = async () => {
    if (!submittedData) return;

    setIsSubmittingFree(true);
    try {
      // Submit only the free question
      await apiRequest("POST", "/api/faq/submit", {
        userInfo: {
          name: submittedData.name,
          email: submittedData.email,
          phone: submittedData.phone,
          gender: submittedData.gender,
          birthDate: submittedData.birthDate,
          birthTime: submittedData.birthTime,
          birthPlace: submittedData.birthPlace,
          latitude: locationCoords?.latitude || null,
          longitude: locationCoords?.longitude || null,
        },
        questions: {
          freeQuestion: submittedData.freeQuestion,
          hasPaidQuestions: false,
        },
      });

      toast({
        title: "Success!",
        description:
          "Your free question has been submitted. You'll receive an answer within 24-48 hours.",
      });

      // Reset form and go back to main view
      resetToMainForm();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit question.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingFree(false);
    }
  };

  const handlePaidSubmission = async () => {
    if (
      !submittedData ||
      !paidQuestions.additionalQuestion1 ||
      !paidQuestions.additionalQuestion2
    ) {
      toast({
        title: "Error",
        description: "Please fill in both paid questions before proceeding.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmittingPaid(true);
    try {
      // First, submit the paid questions data to be stored with pending payment status
      const questionsData = {
        ...submittedData,
        additionalQuestion1: paidQuestions.additionalQuestion1,
        additionalQuestion2: paidQuestions.additionalQuestion2,
        hasPaidQuestions: true,
      };

      console.log("🐛 Submitting paid questions (PII masked for privacy)");

      const submitResult = await apiRequest("POST", "/api/faq/submit", {
        userInfo: {
          name: questionsData.name,
          email: questionsData.email,
          phone: questionsData.phone,
          gender: questionsData.gender,
          birthDate: questionsData.birthDate,
          birthTime: questionsData.birthTime,
          birthPlace: questionsData.birthPlace,
          latitude: questionsData.latitude,
          longitude: questionsData.longitude,
        },
        questions: {
          freeQuestion: questionsData.freeQuestion || "Additional Questions",
          additionalQuestion1: paidQuestions.additionalQuestion1,
          additionalQuestion2: paidQuestions.additionalQuestion2,
          hasPaidQuestions: true,
        },
      });

      console.log(
        "🐛 Questions submitted, now processing payment for FAQ ID:",
        submitResult.faqId,
      );

      // Now process payment with the stored FAQ ID
      const paymentResponse = await apiRequest("POST", "/api/faq/payment", {
        amount: 50,
        faqId: submitResult.faqId, // Pass the FAQ ID for payment link generation
        userInfo: {
          name: questionsData.name,
          email: questionsData.email,
          phone: questionsData.phone,
        },
      });

      if (paymentResponse.paymentUrl) {
        // Store complete data for post-payment updates
        localStorage.setItem("pendingFaqData", JSON.stringify(questionsData));
        window.location.href = paymentResponse.paymentUrl;
        return;
      }

      toast({
        title: "Payment Failed",
        description: "Payment URL not received. Please try again.",
        variant: "destructive",
      });
    } catch (error: any) {
      console.error("Payment submission error:", error);

      // Extract user-friendly error message
      let errorMessage = "Payment could not be processed.";

      if (error.message && typeof error.message === "string") {
        errorMessage = error.message;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }

      toast({
        title: "Payment Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmittingPaid(false);
    }
  };

  return (
    <Card className="border-amber-300">
      <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-t-lg">
        <CardTitle className="text-center">
          Your Question Has Been Submitted!
        </CardTitle>
        <CardDescription className="text-white text-center">
          {isExistingFreeUser
            ? "You can only submit paid questions since you've already used your free question"
            : "Your free question is being reviewed by our expert astrologers. If you want to ask more questions, pay ₹50 for 2 additional questions"}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Show Free Question Summary for new users */}
          {submittedData?.freeQuestion && !isExistingFreeUser && (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Gift className="h-5 w-5 text-green-600" />
                <h4 className="font-semibold text-green-800">
                  Your Free Question Submitted !!
                </h4>
              </div>
              <p className="text-sm text-gray-700">
                {submittedData.freeQuestion}
              </p>
            </div>
          )}

          {/* Paid Questions Form */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800">
              {isExistingFreeUser
                ? "Ask Two Questions (₹50)"
                : "Want to Ask More Questions? (₹50 for 2 additional questions)"}
            </h4>

            <div className="space-y-4">
              <div>
                <Label htmlFor="q1" className="text-sm font-medium">
                  Additional Question 1 <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="q1"
                  placeholder="Your second astrological question..."
                  className="min-h-[80px] mt-2"
                  value={paidQuestions.additionalQuestion1}
                  onChange={(e) =>
                    setPaidQuestions((prev) => ({
                      ...prev,
                      additionalQuestion1: e.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <Label htmlFor="q2" className="text-sm font-medium">
                  Additional Question 2 <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="q2"
                  placeholder="Your third astrological question..."
                  className="min-h-[80px] mt-2"
                  value={paidQuestions.additionalQuestion2}
                  onChange={(e) =>
                    setPaidQuestions((prev) => ({
                      ...prev,
                      additionalQuestion2: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* Show success message instead of proceed button for new users who have already submitted */}
            {!isExistingFreeUser && submittedData?.freeQuestion && (
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg text-center">
                <div className="flex items-center justify-center gap-2 text-green-800 font-semibold mb-2">
                  <CheckCircle className="h-5 w-5" />
                  Question Submitted Successfully!
                </div>
                <p className="text-green-700 text-sm">
                  You'll receive your answer via email within 24-48 hours.
                </p>
              </div>
            )}

            {/* Paid Questions Button */}
            <Button
              onClick={handlePaidSubmission}
              disabled={
                isSubmittingPaid ||
                !paidQuestions.additionalQuestion1 ||
                !paidQuestions.additionalQuestion2
              }
              className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700"
            >
              {isSubmittingPaid ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  {isExistingFreeUser
                    ? "Pay ₹50 for Two Questions"
                    : "Pay ₹50 for Two More Questions"}
                </>
              )}
            </Button>

            {/* Cancel Button */}
            <Button
              type="button"
              variant="outline"
              onClick={() => resetToMainForm()}
              className="w-full"
              disabled={isSubmittingFree || isSubmittingPaid}
            >
              Back to Form
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function FAQPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPaymentMode, setIsPaymentMode] = useState(false);
  const [submittedData, setSubmittedData] = useState<FaqFormData | null>(null);
  const [userEmail, setUserEmail] = useState("");
  const [emailCheckResult, setEmailCheckResult] = useState<{
    hasExistingQuestions: boolean;
    canSubmitFree: boolean;
  } | null>(null);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [showAdditionalQuestions, setShowAdditionalQuestions] = useState(false);
  const [locationCoords, setLocationCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const { toast } = useToast();

  // Check for payment success on page load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get("payment");
    const faqId = urlParams.get("faq");

    if (paymentStatus === "success" && faqId) {
      // Get pending FAQ data from localStorage
      const pendingData = localStorage.getItem("pendingFaqData");
      if (pendingData) {
        const faqData = JSON.parse(pendingData);

        // Update FAQ with actual questions and trigger emails
        updateFaqAfterPayment(faqId, faqData);

        // Clean up localStorage
        localStorage.removeItem("pendingFaqData");
      }

      // Show success state directly instead of redirecting
      setIsPaymentMode(false);

      // Clear URL parameters after handling to prevent refresh loops
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (paymentStatus === "failed" && faqId) {
      toast({
        title: "Payment Failed",
        description: "Your payment could not be processed. Please try again.",
        variant: "destructive",
      });

      // Restore payment mode if there's pending data
      const pendingData = localStorage.getItem("pendingFaqData");
      if (pendingData) {
        const faqData = JSON.parse(pendingData);
        setSubmittedData(faqData);
        setIsPaymentMode(true);

        // Update the FAQ with user info even if payment failed to ensure phone number is saved
        updateFaqAfterPaymentFailure(faqId, faqData);
      }

      // Clear URL parameters after handling failed payment
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const updateFaqAfterPayment = async (faqId: string, faqData: FaqFormData) => {
    try {
      await apiRequest("POST", "/api/faq/update-questions", {
        faqId,
        userInfo: {
          name: faqData.name,
          email: faqData.email,
          phone: faqData.phone,
          gender: faqData.gender,
          birthDate: faqData.birthDate,
          birthTime: faqData.birthTime,
          birthPlace: faqData.birthPlace,
        },
        questions: {
          freeQuestion: faqData.freeQuestion,
          additionalQuestion1: faqData.additionalQuestion1,
          additionalQuestion2: faqData.additionalQuestion2,
          hasPaidQuestions: true,
        },
      });

      toast({
        title: "Payment Successful!",
        description:
          "All your questions have been submitted. You'll receive answers within 24-48 hours.",
      });

      // Refresh questions list
      refetchQuestions();
    } catch (error) {
      console.error("FAQ update error:", error);
      toast({
        title: "Error",
        description:
          "Payment was successful but failed to update questions. Please contact support.",
        variant: "destructive",
      });
    }
  };

  const updateFaqAfterPaymentFailure = async (
    faqId: string,
    faqData: FaqFormData,
  ) => {
    try {
      // Update user info even if payment failed to ensure phone number and other details are saved
      await apiRequest("POST", "/api/faq/update-user-info", {
        faqId,
        userInfo: {
          name: faqData.name,
          email: faqData.email,
          phone: faqData.phone,
          gender: faqData.gender,
          birthDate: faqData.birthDate,
          birthTime: faqData.birthTime,
          birthPlace: faqData.birthPlace,
          latitude: faqData.latitude,
          longitude: faqData.longitude,
        },
      });
    } catch (error) {
      console.error("Failed to update user info after payment failure:", error);
    }
  };

  const form = useForm<FaqFormData>({
    resolver: zodResolver(
      createFaqFormSchema(emailCheckResult?.hasExistingQuestions ?? false),
    ),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      gender: undefined,
      birthDate: "",
      birthTime: "",
      birthPlace: "",
      freeQuestion: "",
      additionalQuestion1: "",
      additionalQuestion2: "",
    },
  });

  const watchEmail = form.watch("email");
  const watchPhone = form.watch("phone");

  // Enhanced debounced user check with both email and phone validation
  const debouncedUserCheck = useCallback(
    debounce(async (email: string, phone: string) => {
      // Only check if we have valid email or phone (minimum length validation)
      const hasValidEmail =
        email && email.includes("@") && email.includes(".") && email.length > 5;
      const hasValidPhone = phone && phone.length >= 10;

      if (!hasValidEmail && !hasValidPhone) {
        setEmailCheckResult(null);
        return;
      }

      // Create cache key based on both email and phone
      const cacheKey = `user_check_${email}_${phone}`;
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        try {
          const cachedData = JSON.parse(cached);
          // Check if cache is still valid (10 minutes)
          if (
            cachedData.timestamp &&
            Date.now() - cachedData.timestamp < 10 * 60 * 1000
          ) {
            setEmailCheckResult(cachedData.data);
            return;
          }
        } catch (e) {
          // Invalid cache, clear it
          sessionStorage.removeItem(cacheKey);
        }
      }

      setIsCheckingEmail(true);
      try {
        const result = await apiRequest("POST", "/api/faq/check-user", {
          email: hasValidEmail ? email : "",
          phone: hasValidPhone ? phone : "",
        });
        setEmailCheckResult(result);

        // Cache result with timestamp for 10 minutes
        sessionStorage.setItem(
          cacheKey,
          JSON.stringify({
            data: result,
            timestamp: Date.now(),
          }),
        );

        console.log(
          "🔍 [USER CHECK] User eligibility check completed (PII masked for privacy)",
          {
            hasExistingQuestions: result.hasExistingQuestions,
            canSubmitFree: result.canSubmitFree,
          },
        );
      } catch (error) {
        console.error("Error checking user:", error);
        setEmailCheckResult(null);
      } finally {
        setIsCheckingEmail(false);
      }
    }, 400), // Increased debounce to 400ms for better performance
    [],
  );

  useEffect(() => {
    debouncedUserCheck(watchEmail, watchPhone);
    return () => debouncedUserCheck.cancel();
  }, [watchEmail, watchPhone, debouncedUserCheck]);

  // Update form validation schema and clear fields when user type changes
  useEffect(() => {
    if (emailCheckResult !== null) {
      const isExistingUser = emailCheckResult.hasExistingQuestions;

      // Update the resolver with new schema
      const newSchema = createFaqFormSchema(isExistingUser);
      form.clearErrors(); // Clear any existing validation errors

      // For existing users, clear the free question field and force paid questions
      if (isExistingUser && !emailCheckResult.canSubmitFree) {
        form.setValue("freeQuestion", ""); // Clear free question
      }

      // Re-validate the form with new schema
      form.trigger();
    }
  }, [emailCheckResult, form]);

  // Optimized user questions fetch with better caching
  const { data: userQuestions = [], refetch: refetchQuestions } = useQuery<
    Question[]
  >({
    queryKey: ["/api/faq", watchEmail],
    enabled: !!watchEmail && watchEmail.includes("@"),
    staleTime: 2 * 60 * 1000, // 2 minutes cache
    gcTime: 5 * 60 * 1000, // 5 minutes in memory (v5 syntax)
    retry: 1,
    refetchOnWindowFocus: false,
  });

  // Memoized data transformations for better performance
  const { pendingQuestions, answeredQuestions } = useMemo(() => {
    const questions = Array.isArray(userQuestions) ? userQuestions : [];
    return {
      pendingQuestions: questions.filter((q) => q.status === "pending"),
      answeredQuestions: questions.filter((q) => q.status === "answered"),
    };
  }, [userQuestions]);

  // Computed value for isExistingUser
  const isExistingUser = emailCheckResult?.hasExistingQuestions || false;

  const onSubmit = async (data: FaqFormData) => {
    // Additional validation: Check if location coordinates are available
    if (!locationCoords?.latitude || !locationCoords?.longitude) {
      form.setError("birthPlace", {
        type: "manual",
        message:
          "Please select a valid birth place from the dropdown suggestions to ensure accurate calculations.",
      });
      return;
    }

    console.log("🐛 Form submission data:", data);
    console.log("🐛 Phone field value:", data.phone);
    console.log("🐛 Location coords available:", locationCoords);
    console.log("🐛 Is existing user:", isExistingUser);
    console.log("🐛 Can submit free:", emailCheckResult?.canSubmitFree);

    // For existing users who can't submit free questions, skip submission and go to paid questions
    if (isExistingUser && !emailCheckResult?.canSubmitFree) {
      console.log(
        "🐛 [EXISTING USER] Skipping free question submission, going directly to paid questions",
      );
      setSubmittedData({
        ...data,
        latitude: locationCoords.latitude,
        longitude: locationCoords.longitude,
      });
      setIsPaymentMode(true);
      return;
    }

    // For new users or existing users who can submit free questions
    setIsSubmitting(true);
    try {
      console.log("🐛 Submitting free question data");

      const submitResult = await apiRequest("POST", "/api/faq/submit", {
        userInfo: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          gender: data.gender,
          birthDate: data.birthDate,
          birthTime: data.birthTime,
          birthPlace: data.birthPlace,
          latitude: locationCoords.latitude,
          longitude: locationCoords.longitude,
        },
        questions: {
          freeQuestion: data.freeQuestion,
          hasPaidQuestions: false, // This is only for free question submission
        },
      });

      // Show success message
      toast({
        title: "Success!",
        description: "Your free question has been submitted successfully!",
      });

      // Refresh questions list to show the newly submitted question
      refetchQuestions();

      // For new users who submitted free questions, switch to payment mode for additional questions
      console.log(
        "🐛 [NEW USER] Free question submitted, switching to payment mode for additional questions",
      );
      setSubmittedData({
        ...data,
        latitude: locationCoords.latitude,
        longitude: locationCoords.longitude,
      });
      setIsPaymentMode(true);
    } catch (error: any) {
      console.error("Submit error:", error);

      // Extract user-friendly error message
      let errorMessage = "Failed to process. Please try again.";

      if (error.message && typeof error.message === "string") {
        errorMessage = error.message;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 ">
      <AstroTickHeader />
      <div className="max-w-full container mx-auto">
        {/* Hero Section */}

        {/* Main Content */}
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {/* Benefits Card - Shows second on mobile, second on desktop */}
            <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 order-2 lg:order-1">
              {/* Header */}
              <div className="relative text-center px-4 py-6 sm:py-8 bg-gradient-to-b from-orange-50 via-amber-50 to-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-orange-600 drop-shadow-md animate-pulse">
                  ✨ Ask Our Expert Astrologers ✨
                </h1>
                <p className="mt-4 text-xs sm:text-sm md:text-md text-gray-700 max-w-xl mx-auto leading-relaxed">
                  Unlock clarity and guidance through{" "}
                  <span className="font-semibold text-orange-500">
                    personalized astrological insights
                  </span>
                  . Get <b>detailed written answers</b> crafted by trusted
                  astrologers, delivered straight to your inbox.
                </p>
              </div>

              {/* Image */}
              <div className="flex justify-center mt-6 ">
                <img
                  src="/api/zodiac-image/AstoFaq.jpg"
                  alt="AstroFaq"
                  className="rounded-full h-64 sm:h-72 md:h-80 object-cover shadow-lg transition-transform duration-300 hover:scale-105"
                />
              </div>

              {/* Benefits Card */}
              <Card className="mt-6 shadow-xl hover:shadow-2xl bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-3xl overflow-hidden transition-transform duration-300 hover:-translate-y-1">
                <CardHeader className="px-4 sm:px-6 pt-5">
                  <CardTitle className="flex items-center text-amber-900 text-lg sm:text-xl font-bold">
                    <Star className="h-6 w-6 sm:h-7 sm:w-7 mr-2 text-yellow-500 animate-bounce" />
                    🎁 What You’ll Receive
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-5 sm:space-y-6 px-4 sm:px-6 pb-6">
                  {/* Free Question */}
                  <div className="flex items-start space-x-3">
                    <Gift className="h-6 w-6 sm:h-7 sm:w-7 text-green-600 mt-1 flex-shrink-0 animate-pulse" />
                    <div>
                      <h4 className="font-semibold text-green-800 text-sm sm:text-base">
                        1 Free Question 🎉
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-700">
                        Your first personalized answer, absolutely free — no
                        strings attached.
                      </p>
                    </div>
                  </div>

                  {/* Quick Response */}
                  <div className="flex items-start space-x-3">
                    <Clock className="h-6 w-6 sm:h-7 sm:w-7 text-blue-600 mt-1 flex-shrink-0 animate-spin-slow" />
                    <div>
                      <h4 className="font-semibold text-blue-800 text-sm sm:text-base">
                        Lightning-Fast Answers ⚡
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-700">
                        Expert guidance delivered straight to you within{" "}
                        <b>24–48 hours</b>.
                      </p>
                    </div>
                  </div>

                  {/* Email Delivery */}
                  <div className="flex items-start space-x-3">
                    <Mail className="h-6 w-6 sm:h-7 sm:w-7 text-purple-600 mt-1 flex-shrink-0 animate-bounce" />
                    <div>
                      <h4 className="font-semibold text-purple-800 text-sm sm:text-base">
                        Seamless Email Delivery ✉️
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-700">
                        Receive detailed answers in your inbox — with secure
                        auto-login links.
                      </p>
                    </div>
                  </div>

                  <Separator className="my-2 sm:my-4" />

                  {/* Paid Add-on */}
                  <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-4 rounded-2xl border border-amber-200 text-center shadow-md hover:shadow-lg transition-shadow duration-300">
                    <h4 className="font-bold text-amber-900 mb-2 text-sm sm:text-base">
                      🔓 Unlock More Insights
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-700 mb-3">
                      Add <b>2 extra questions</b> for deeper, personalized
                      guidance.
                    </p>
                    <div className="bg-amber-200 px-4 py-2 rounded-lg inline-block shadow-sm hover:shadow-md transition-all duration-300">
                      <p className="text-amber-900 font-bold text-sm sm:text-base">
                        Only ₹50 ✨
                      </p>
                      <p className="text-[10px] sm:text-xs text-amber-800">
                        Best Value Deal 🔥
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* RIGHT: Form Card - Shows first on mobile, second on desktop */}
            <div className="space-y-6 order-1 lg:order-2">
              {!isPaymentMode ? (
                <Card className="border-amber-300">
                  <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-t-lg">
                    <CardTitle className="text-center">
                      Ask a Free Questions
                    </CardTitle>
                    <CardDescription className="text-white text-center">
                      Provide your birth details for accurate astrological
                      analysis
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                      >
                        {/* User Information Section */}
                        <div className="space-y-4">
                          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Personal Information
                          </h3>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Full Name</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Enter your full name"
                                      {...field}
                                    />
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
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select gender" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="male">Male</SelectItem>
                                      <SelectItem value="female">
                                        Female
                                      </SelectItem>
                                      <SelectItem value="other">
                                        Other
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>

                        <Separator />

                        {/* Birth Details Section */}
                        <div className="space-y-4">
                          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Birth Details
                          </h3>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="birthDate"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Birth Date</FormLabel>
                                  <FormControl>
                                    <div className="grid grid-cols-3 gap-2">
                                      {/* Day */}
                                      <Select
                                        value={field.value?.split("-")[2] || ""}
                                        onValueChange={(day) =>
                                          field.onChange(
                                            `${field.value?.split("-")[0] || "2000"}-${field.value?.split("-")[1] || "01"}-${day}`,
                                          )
                                        }
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Day" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {Array.from(
                                            { length: 31 },
                                            (_, i) => (
                                              <SelectItem
                                                key={i + 1}
                                                value={String(i + 1).padStart(
                                                  2,
                                                  "0",
                                                )}
                                              >
                                                {i + 1}
                                              </SelectItem>
                                            ),
                                          )}
                                        </SelectContent>
                                      </Select>

                                      {/* Month */}
                                      <Select
                                        value={field.value?.split("-")[1] || ""}
                                        onValueChange={(month) =>
                                          field.onChange(
                                            `${field.value?.split("-")[0] || "2000"}-${month}-${field.value?.split("-")[2] || "01"}`,
                                          )
                                        }
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Month" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {Array.from(
                                            { length: 12 },
                                            (_, i) => (
                                              <SelectItem
                                                key={i + 1}
                                                value={String(i + 1).padStart(
                                                  2,
                                                  "0",
                                                )}
                                              >
                                                {i + 1}
                                              </SelectItem>
                                            ),
                                          )}
                                        </SelectContent>
                                      </Select>

                                      {/* Year */}
                                      <Select
                                        value={field.value?.split("-")[0] || ""}
                                        onValueChange={(year) =>
                                          field.onChange(
                                            `${year}-${field.value?.split("-")[1] || "01"}-${field.value?.split("-")[2] || "01"}`,
                                          )
                                        }
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Year" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {Array.from(
                                            { length: 120 },
                                            (_, i) => {
                                              const year =
                                                new Date().getFullYear() - i;
                                              return (
                                                <SelectItem
                                                  key={year}
                                                  value={String(year)}
                                                >
                                                  {year}
                                                </SelectItem>
                                              );
                                            },
                                          )}
                                        </SelectContent>
                                      </Select>
                                    </div>
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
                                  <FormLabel>Birth Time</FormLabel>
                                  <FormControl>
                                    <div className="grid grid-cols-2 gap-2">
                                      {/* Hour */}
                                      <Select
                                        value={field.value?.split(":")[0] || ""}
                                        onValueChange={(hour) =>
                                          field.onChange(
                                            `${hour}:${field.value?.split(":")[1] || "00"}`,
                                          )
                                        }
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Hour" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {Array.from(
                                            { length: 24 },
                                            (_, i) => (
                                              <SelectItem
                                                key={i}
                                                value={String(i).padStart(
                                                  2,
                                                  "0",
                                                )}
                                              >
                                                {i}
                                              </SelectItem>
                                            ),
                                          )}
                                        </SelectContent>
                                      </Select>

                                      {/* Minute */}
                                      <Select
                                        value={field.value?.split(":")[1] || ""}
                                        onValueChange={(minute) =>
                                          field.onChange(
                                            `${field.value?.split(":")[0] || "00"}:${minute}`,
                                          )
                                        }
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Minute" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {Array.from(
                                            { length: 60 },
                                            (_, i) => (
                                              <SelectItem
                                                key={i}
                                                value={String(i).padStart(
                                                  2,
                                                  "0",
                                                )}
                                              >
                                                {String(i).padStart(2, "0")}
                                              </SelectItem>
                                            ),
                                          )}
                                        </SelectContent>
                                      </Select>
                                    </div>
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
                                <FormLabel>Birth Place</FormLabel>
                                <FormControl>
                                  <LocationSearch
                                    value={field.value}
                                    onChange={(val) => field.onChange(val)} // 🔑 keeps RHF updated
                                    onLocationSelect={(location) => {
                                      const placeString =
                                        location.place ||
                                        location.place_name ||
                                        "";
                                      field.onChange(placeString); // 🔑 update RHF form

                                      // Store coordinates for submission
                                      if (
                                        location.latitude &&
                                        location.longitude
                                      ) {
                                        setLocationCoords({
                                          latitude: location.latitude,
                                          longitude: location.longitude,
                                        });
                                      }
                                    }}
                                    placeholder="Enter your birth place (e.g., Mumbai, India)"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="email"
                                      placeholder="your.email@example.com"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="phone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Phone Number</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Enter your phone number"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>

                        <Separator />

                        {/* Questions Section */}
                        <div className="space-y-4">
                          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" />
                            Your Questions
                          </h3>

                          {/* Show user validation status */}
                          {isCheckingEmail && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Checking user eligibility...
                            </div>
                          )}

                          {emailCheckResult &&
                            emailCheckResult.hasExistingQuestions &&
                            !emailCheckResult.canSubmitFree && (
                              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-sm text-blue-800">
                                  <AlertCircle className="h-4 w-4 inline mr-1" />
                                  This email or phone number has already
                                  submitted a free question. You can only add
                                  paid questions.
                                </p>
                              </div>
                            )}

                          {/* Free Question - only show for new users */}
                          {(!emailCheckResult ||
                            emailCheckResult.canSubmitFree) && (
                            <FormField
                              control={form.control}
                              name="freeQuestion"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="flex items-center gap-2">
                                    Free Question{" "}
                                    <Badge variant="secondary">Included</Badge>
                                  </FormLabel>
                                  <FormControl>
                                    <div className="relative w-full">
                                      <Textarea
                                        placeholder="Ask your astrological question here..."
                                        className="min-h-[80px] pr-12"
                                        maxLength={100}
                                        {...field}
                                      />
                                      <span className="absolute bottom-2 right-2 text-xs text-gray-500">
                                        {field.value?.length || 0}/100
                                      </span>
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}
                        </div>

                        <Button
                          type="button"
                          className="w-full bg-gradient-to-r from-orange-600 to-amber-600"
                          disabled={isSubmitting}
                          onClick={form.handleSubmit(onSubmit)}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Submitting...
                            </>
                          ) : emailCheckResult &&
                            !emailCheckResult.canSubmitFree ? (
                            <>
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Continue to Paid Questions
                            </>
                          ) : (
                            <>
                              <Gift className="h-4 w-4 mr-2" />
                              Submit & Continue
                            </>
                          )}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              ) : (
                <PaidQuestionLayout
                  submittedData={submittedData}
                  emailCheckResult={emailCheckResult}
                  locationCoords={locationCoords}
                  resetToMainForm={() => {
                    setIsPaymentMode(false);
                    setSubmittedData(null);
                  }}
                />
              )}

              {/* User's Questions Section */}
              {watchEmail && watchEmail.includes("@") && (
                <div className="space-y-6">
                  {/* Pending Questions */}
                  {pendingQuestions.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-orange-600">
                          <AlertCircle className="h-5 w-5" />
                          Pending Questions ({pendingQuestions.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {pendingQuestions.map((question: Question) => (
                          <div
                            key={question.id}
                            className="p-3 bg-orange-50 rounded-lg border border-orange-200"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <Badge
                                variant="outline"
                                className="text-orange-600 border-orange-600"
                              >
                                Pending Response
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {new Date(
                                  question.createdAt,
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 mb-1">
                              <strong>Free Question:</strong>{" "}
                              {question.freeQuestion}
                            </p>
                            {question.additionalQuestion1 && (
                              <p className="text-sm text-gray-700 mb-1">
                                <strong>Additional Q1:</strong>{" "}
                                {question.additionalQuestion1}
                              </p>
                            )}
                            {question.additionalQuestion2 && (
                              <p className="text-sm text-gray-700">
                                <strong>Additional Q2:</strong>{" "}
                                {question.additionalQuestion2}
                              </p>
                            )}
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}

                  {/* Answered Questions */}
                  {answeredQuestions.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-green-600">
                          <CheckCircle className="h-5 w-5" />
                          Answered Questions ({answeredQuestions.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {answeredQuestions.map((question: Question) => (
                          <div
                            key={question.id}
                            className="p-3 bg-green-50 rounded-lg border border-green-200"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <Badge
                                variant="outline"
                                className="text-green-600 border-green-600"
                              >
                                Answered
                              </Badge>
                              <span className="text-xs text-gray-500">
                                Answered on{" "}
                                {question.answeredAt
                                  ? new Date(
                                      question.answeredAt,
                                    ).toLocaleDateString()
                                  : "N/A"}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 mb-1">
                              <strong>Question:</strong> {question.freeQuestion}
                            </p>
                            {question.additionalQuestion1 && (
                              <p className="text-sm text-gray-700 mb-1">
                                <strong>Additional Q1:</strong>{" "}
                                {question.additionalQuestion1}
                              </p>
                            )}
                            {question.additionalQuestion2 && (
                              <p className="text-sm text-gray-700 mb-2">
                                <strong>Additional Q2:</strong>{" "}
                                {question.additionalQuestion2}
                              </p>
                            )}
                            <div className="text-xs text-green-600 font-medium">
                              ✉️ Response sent to your email
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
