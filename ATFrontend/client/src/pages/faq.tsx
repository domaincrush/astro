import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import { Label } from "src/components/ui/label";
import { Textarea } from "src/components/ui/textarea";
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
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  UserIcon,
  CreditCardIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  Star,
  Mail,
  Gift,
  Clock,
} from "lucide-react";
import { useToast } from "src/hooks/use-toast";
import LocationSearch from "src/components/LocationSearch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "src/components/ui/select";
import { format } from "date-fns";
import { apiRequest } from "src/lib/queryClient";
import { analytics } from "src/lib/advanced-analytics";

// Validation schemas
const userInfoSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  gender: z.enum(["male", "female", "other"], {
    required_error: "Please select your gender",
  }),
  birthDate: z.string().min(1, "Birth date is required"),
  birthTime: z.string().min(1, "Birth time is required"),
  birthPlace: z.string().min(1, "Birth place is required"),
});

const questionSchema = z.object({
  freeQuestion: z.string().min(10, "Question must be at least 10 characters"),
  additionalQuestion1: z.string().optional(),
  additionalQuestion2: z.string().optional(),
});

const bookingSchema = z.object({
  bookingDate: z.string().min(1, "Booking date is required"),
  bookingTime: z.string().min(1, "Booking time is required"),
});

type UserInfo = z.infer<typeof userInfoSchema>;
type QuestionForm = z.infer<typeof questionSchema>;
type BookingForm = z.infer<typeof bookingSchema>;

export default function FAQ() {
  const { toast } = useToast();
  const [step, setStep] = useState<
    "info" | "questions" | "booking" | "payment" | "success"
  >("info");
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [serviceType, setServiceType] = useState<"faq" | "session">("faq");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string>("");
  const [paymentData, setPaymentData] = useState<any>(null);
  const [showPaidQuestions, setShowPaidQuestions] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null);

  // Check URL parameters for payment success/failure
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    const faqId = urlParams.get('faq');
    
    if (paymentStatus === 'success' && faqId) {
      console.log(`🎉 Payment success detected for FAQ ID: ${faqId}`);
      setSubmissionResult({
        success: true,
        message: "Payment successful! Your additional questions have been submitted. We'll send detailed answers to your email within 24-48 hours.",
        type: 'faq',
        hasPaidQuestions: true,
        faqId: faqId
      });
      setStep("success");
      
      // Clear URL parameters after handling
      window.history.replaceState({}, document.title, window.location.pathname);
      
      toast({
        title: "Payment Successful!",
        description: "Your additional questions have been submitted successfully.",
      });
    } else if (paymentStatus === 'failed' && faqId) {
      console.log(`❌ Payment failed detected for FAQ ID: ${faqId}`);
      
      // Clear URL parameters after handling
      window.history.replaceState({}, document.title, window.location.pathname);
      
      toast({
        title: "Payment Failed",
        description: "Your payment was not successful. Please try again.",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Form hooks
  const userForm = useForm<UserInfo>({
    resolver: zodResolver(userInfoSchema),
  });

  const questionForm = useForm<QuestionForm>({
    resolver: zodResolver(questionSchema),
  });

  const bookingForm = useForm<BookingForm>({
    resolver: zodResolver(bookingSchema),
  });

  // Generate time slots (9 AM to 6 PM)
  const timeSlots = [
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
  ];

  // Get available slots for selected date
  const fetchAvailableSlots = async (date: string) => {
    if (!date) return;

    setLoadingSlots(true);
    try {
      const response = await fetch(
        `/api/bookings/available-slots?date=${date}`,
      );
      const data = await response.json();

      if (data.success) {
        setAvailableSlots(data.slots);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch available slots",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching available slots:", error);
    } finally {
      setLoadingSlots(false);
    }
  };

  // Watch booking date changes
  const watchedDate = bookingForm.watch("bookingDate");
  useEffect(() => {
    if (watchedDate) {
      fetchAvailableSlots(watchedDate);
    }
  }, [watchedDate]);

  // Handle user info submission
  const handleUserInfoSubmit = (data: UserInfo) => {
    const formData = {
      ...data,
      latitude: coordinates?.lat || 0,
      longitude: coordinates?.lng || 0,
    };

    setUserInfo(formData);

    if (serviceType === "faq") {
      setStep("questions");
    } else {
      setStep("booking");
    }
  };

  // Handle FAQ submission
  const handleFAQSubmit = async (data: QuestionForm) => {
    if (!userInfo) {
      toast({
        title: "Error",
        description: "User information is missing",
        variant: "destructive",
      });
      return;
    }

    try {
      const hasPaidQuestions = Boolean(
        data.additionalQuestion1 || data.additionalQuestion2,
      );

      const payload = {
        userInfo: {
          ...userInfo,
          latitude: coordinates?.lat || 0,
          longitude: coordinates?.lng || 0,
        },
        questions: {
          freeQuestion: data.freeQuestion,
          additionalQuestion1: data.additionalQuestion1 || "",
          additionalQuestion2: data.additionalQuestion2 || "",
          hasPaidQuestions,
        },
      };

      const response = await fetch("/api/faq/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        // Track FAQ submission
        analytics.trackEvent('faq_submitted', {
          event_category: 'engagement',
          has_paid_questions: hasPaidQuestions,
          user_location: userInfo.birthLocation
        });

        if (result.needsPayment) {
          // Track payment initiation
          analytics.trackEvent('faq_payment_initiated', {
            event_category: 'conversion',
            amount: 50,
            currency: 'INR'
          });

          // Initiate payment for additional questions
          const paymentResponse = await fetch("/api/faq/payment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ faqId: result.faqId }),
          });

          const paymentResult = await paymentResponse.json();

          if (paymentResult.success) {
            setPaymentData(paymentResult.paymentData);
            setPaymentUrl(paymentResult.paymentUrl);
            setStep("payment");
          } else {
            throw new Error("Payment initiation failed");
          }
        } else {
          // Show success on same page
          setSubmissionResult({
            success: true,
            message: "Your question has been submitted successfully. We'll send you an answer via email.",
            type: 'faq',
            hasPaidQuestions: false
          });
          setStep("success");
        }
      } else {
        throw new Error(result.message || "Submission failed");
      }
    } catch (error) {
      console.error("FAQ submission error:", error.message);
      toast({
        title: "Error",
        description: "Failed to submit your question. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle session booking
  const handleBookingSubmit = async (data: BookingForm) => {
    if (!userInfo) {
      toast({
        title: "Error",
        description: "User information is missing",
        variant: "destructive",
      });
      return;
    }

    try {
      const payload = {
        ...userInfo,
        latitude: coordinates?.lat || 0,
        longitude: coordinates?.lng || 0,
        bookingDate: data.bookingDate,
        bookingTime: data.bookingTime,
        sessionType: "consultation",
      };

      const response = await fetch("/api/bookings/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        // Initiate payment for session
        const paymentResponse = await fetch("/api/bookings/payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ bookingId: result.bookingId }),
        });

        const paymentResult = await paymentResponse.json();

        if (paymentResult.success) {
          setPaymentData(paymentResult.paymentData);
          setPaymentUrl(paymentResult.paymentUrl);
          setStep("payment");
        } else {
          throw new Error("Payment initiation failed");
        }
      } else {
        throw new Error(result.message || "Booking failed");
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast({
        title: "Error",
        description: "Failed to book your session. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Reset all forms
  const resetForms = () => {
    setStep("info");
    setServiceType("faq");
    setUserInfo(null);
    setCoordinates(null);
    userForm.reset();
    questionForm.reset();
    bookingForm.reset();
  };

  // Handle payment form submission
  const handlePayment = () => {
    if (paymentData && paymentUrl) {
      // Create a form and submit to PayU
      const form = document.createElement("form");
      form.method = "POST";
      form.action = paymentUrl;

      Object.keys(paymentData).forEach((key) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = String(paymentData[key]);
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    }
  };

  return (
    <div className="">
      <AstroTickHeader />
      <div>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-400 to-orange-600 text-white py-6">
            <div className="container mx-auto px-2 text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                🔮 AstroTick FAQ & Consultation
              </h1>
              <p className="text-xl text-orange-100">
                Get personalized astrological guidance from our expert
                astrologers
              </p>
            </div>
          </div>
          {/* Main Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-6xl mx-auto px-4 py-8 ">
            <div className="lg:col-span-2 space-y-4">
              {" "}
              <Card className="sticky top-6 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
                {" "}
                <CardHeader>
                  {" "}
                  <CardTitle className="flex items-center text-amber-800">
                    {" "}
                    <Star className="h-5 w-5 mr-2" /> What You Get{" "}
                  </CardTitle>{" "}
                </CardHeader>{" "}
                <CardContent className="space-y-4">
                  {" "}
                  <div className="flex items-start space-x-3">
                    {" "}
                    <Gift className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />{" "}
                    <div>
                      {" "}
                      <h4 className="font-semibold text-green-800">
                        Free Question
                      </h4>{" "}
                      <p className="text-sm text-gray-600">
                        One complimentary personalized answer included
                      </p>{" "}
                    </div>{" "}
                  </div>{" "}
                  <div className="flex items-start space-x-3">
                    {" "}
                    <Clock className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />{" "}
                    <div>
                      {" "}
                      <h4 className="font-semibold text-blue-800">
                        Quick Response
                      </h4>{" "}
                      <p className="text-sm text-gray-600">
                        Expert answers within 24-48 hours
                      </p>{" "}
                    </div>{" "}
                  </div>{" "}
                  <div className="flex items-start space-x-3">
                    {" "}
                    <Mail className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />{" "}
                    <div>
                      {" "}
                      <h4 className="font-semibold text-purple-800">
                        Email Delivery
                      </h4>{" "}
                      <p className="text-sm text-gray-600">
                        Detailed answers sent to your email
                      </p>{" "}
                    </div>{" "}
                  </div>{" "}
                  <div className="border-t pt-4">
                    {" "}
                    <h4 className="font-semibold text-amber-800 mb-2">
                      Additional Questions
                    </h4>{" "}
                    <p className="text-sm text-gray-600 mb-2">
                      {" "}
                      Add up to 2 more questions for comprehensive guidance{" "}
                    </p>{" "}
                    <div className="bg-amber-100 p-3 rounded-lg">
                      {" "}
                      <p className="text-amber-800 font-semibold">
                        ₹50 only
                      </p>{" "}
                      <p className="text-xs text-amber-700">
                        For 2 additional premium questions
                      </p>{" "}
                    </div>{" "}
                  </div>{" "}
                </CardContent>{" "}
              </Card>{" "}
            </div>
            <div className="container mx-auto px-4 py-2 lg:col-span-2 space-y-6 ">
              {/* Service Selection */}
              {step === "info" && (
                <Card className="max-w-2xl mx-auto mb-8 border-amber-300 ">
                  <CardHeader>
                    <CardTitle className="text-center">
                      Choose Your Service
                    </CardTitle>
                    <CardDescription className="text-center">
                      Select how you'd like to get astrological guidance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <Card
                        className={`cursor-pointer border-2 transition-all ${serviceType === "faq" ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:border-orange-300"}`}
                        onClick={() => setServiceType("faq")}
                      >
                        <CardContent className="p-6 text-center">
                          <h3 className="text-lg font-semibold mb-2">
                            📝 Ask Questions
                          </h3>
                          <p className="text-sm text-gray-600 mb-3">
                            Submit your astrological questions and get detailed
                            written responses
                          </p>
                          <div className="space-y-2">
                            <Badge variant="secondary">1 Free Question</Badge>
                            <Badge variant="outline">
                              Additional Questions: ₹50
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>

                      <Card
                        className={`cursor-pointer border-2 transition-all ${serviceType === "session" ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:border-orange-300"}`}
                        onClick={() => setServiceType("session")}
                      >
                        <CardContent className="p-6 text-center">
                          <h3 className="text-lg font-semibold mb-2">
                            🎯 Book Session
                          </h3>
                          <p className="text-sm text-gray-600 mb-3">
                            Schedule a personal consultation with our astrologer
                          </p>
                          <div className="space-y-2">
                            <Badge variant="secondary">
                              1-on-1 Consultation
                            </Badge>
                            <Badge variant="outline">Session Fee: ₹150</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* User Information Form */}
              {step === "info" && (
                <Card className="max-w-2xl mx-auto">
                  <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-t-lg text-center mb-5 border-amber-300">
                    <CardTitle>Your Information</CardTitle>
                    <CardDescription className="text-white">
                      Please provide your birth details for accurate
                      astrological analysis
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form
                      onSubmit={userForm.handleSubmit(handleUserInfoSubmit)}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Full Name *</Label>
                          <Input
                            id="name"
                            {...userForm.register("name")}
                            placeholder="Your full name"
                          />
                          {userForm.formState.errors.name && (
                            <p className="text-red-500 text-sm mt-1">
                              {userForm.formState.errors.name.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            {...userForm.register("email")}
                            placeholder="your.email@example.com"
                          />
                          {userForm.formState.errors.email && (
                            <p className="text-red-500 text-sm mt-1">
                              {userForm.formState.errors.email.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="phone">Phone Number *</Label>
                          <Input
                            id="phone"
                            {...userForm.register("phone")}
                            placeholder="+91 9876543210"
                          />
                          {userForm.formState.errors.phone && (
                            <p className="text-red-500 text-sm mt-1">
                              {userForm.formState.errors.phone.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="gender">Gender *</Label>
                          <Select
                            onValueChange={(value: any) =>
                              userForm.setValue("gender", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          {userForm.formState.errors.gender && (
                            <p className="text-red-500 text-sm mt-1">
                              {userForm.formState.errors.gender.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="birthDate">Birth Date *</Label>
                          <Input
                            id="birthDate"
                            type="date"
                            {...userForm.register("birthDate")}
                          />
                          {userForm.formState.errors.birthDate && (
                            <p className="text-red-500 text-sm mt-1">
                              {userForm.formState.errors.birthDate.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="birthTime">Birth Time *</Label>
                          <Input
                            id="birthTime"
                            type="time"
                            {...userForm.register("birthTime")}
                          />
                          {userForm.formState.errors.birthTime && (
                            <p className="text-red-500 text-sm mt-1">
                              {userForm.formState.errors.birthTime.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="birthPlace">Birth Place *</Label>
                        <LocationSearch
                          onLocationSelect={(location) => {
                            userForm.setValue(
                              "birthPlace",
                              location.place_name,
                            );
                            setCoordinates({
                              lat: location.latitude,
                              lng: location.longitude,
                            });
                          }}
                          placeholder="Enter your birth place (e.g., Mumbai, India)"
                        />
                        {userForm.formState.errors.birthPlace && (
                          <p className="text-red-500 text-sm mt-1">
                            {userForm.formState.errors.birthPlace.message}
                          </p>
                        )}
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                      >
                        Continue to{" "}
                        {serviceType === "faq" ? "Questions" : "Booking"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}

              {/* Questions Form (FAQ) */}
              {step === "questions" && serviceType === "faq" && (
                <Card className="max-w-2xl mx-auto">
                  <CardHeader>
                    <CardTitle>Your Questions</CardTitle>
                    <CardDescription>
                      Ask your astrological questions. First question is free,
                      additional questions cost ₹50.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form
                      onSubmit={questionForm.handleSubmit(handleFAQSubmit)}
                      className="space-y-6"
                    >
                      <div>
                        <Label htmlFor="freeQuestion">
                          Your Free Question *
                        </Label>
                        <Textarea
                          id="freeQuestion"
                          {...questionForm.register("freeQuestion")}
                          placeholder="Ask your main astrological question here..."
                          className="min-h-[100px]"
                        />
                        {questionForm.formState.errors.freeQuestion && (
                          <p className="text-red-500 text-sm mt-1">
                            {questionForm.formState.errors.freeQuestion.message}
                          </p>
                        )}
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="showPaidQuestions"
                            checked={showPaidQuestions}
                            onChange={(e) =>
                              setShowPaidQuestions(e.target.checked)
                            }
                            className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"
                          />
                          <Label
                            htmlFor="showPaidQuestions"
                            className="text-sm font-medium text-gray-700 cursor-pointer"
                          >
                            Add paid questions (₹25 each) - Get detailed answers
                          </Label>
                        </div>

                        {showPaidQuestions && (
                          <div className="space-y-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                            <div className="text-sm text-orange-800 font-medium">
                              ✨ Premium Questions (₹50 total for both
                              questions)
                            </div>

                            <div>
                              <Label htmlFor="additionalQuestion1">
                                Additional Question 1 (₹25)
                              </Label>
                              <Textarea
                                id="additionalQuestion1"
                                {...questionForm.register(
                                  "additionalQuestion1",
                                )}
                                placeholder="Ask your detailed question..."
                                className="min-h-[80px] mt-1"
                              />
                            </div>

                            <div>
                              <Label htmlFor="additionalQuestion2">
                                Additional Question 2 (₹25)
                              </Label>
                              <Textarea
                                id="additionalQuestion2"
                                {...questionForm.register(
                                  "additionalQuestion2",
                                )}
                                placeholder="Ask another detailed question..."
                                className="min-h-[80px] mt-1"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setStep("info")}
                        >
                          Back
                        </Button>
                        <Button type="submit" className="flex-1">
                          Submit Questions
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              {/* Booking Form (Session) */}
              {step === "booking" && serviceType === "session" && (
                <Card className="max-w-2xl mx-auto">
                  <CardHeader>
                    <CardTitle>Book Your Session</CardTitle>
                    <CardDescription>
                      Choose your preferred date and time for the consultation
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form
                      onSubmit={bookingForm.handleSubmit(handleBookingSubmit)}
                      className="space-y-6"
                    >
                      <div>
                        <Label htmlFor="bookingDate">Preferred Date *</Label>
                        <Input
                          id="bookingDate"
                          type="date"
                          {...bookingForm.register("bookingDate")}
                          min={format(new Date(), "yyyy-MM-dd")}
                        />
                        {bookingForm.formState.errors.bookingDate && (
                          <p className="text-red-500 text-sm mt-1">
                            {bookingForm.formState.errors.bookingDate.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="bookingTime">Preferred Time *</Label>
                        {loadingSlots ? (
                          <div className="py-4 text-center text-gray-500">
                            Loading available slots...
                          </div>
                        ) : (
                          <Select
                            onValueChange={(value) =>
                              bookingForm.setValue("bookingTime", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select time slot" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableSlots.map((time) => (
                                <SelectItem key={time} value={time}>
                                  {time} (Available)
                                </SelectItem>
                              ))}
                              {availableSlots.length === 0 && (
                                <div className="p-2 text-gray-500">
                                  No slots available for selected date
                                </div>
                              )}
                            </SelectContent>
                          </Select>
                        )}
                        {bookingForm.formState.errors.bookingTime && (
                          <p className="text-red-500 text-sm mt-1">
                            {bookingForm.formState.errors.bookingTime.message}
                          </p>
                        )}
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Session Details:</h4>
                        <ul className="space-y-1 text-sm">
                          <li>• Duration: 30-45 minutes</li>
                          <li>• Type: One-on-one consultation</li>
                          <li>• Fee: ₹150 (including all taxes)</li>
                          <li>
                            • Our astrologer will call you at the scheduled time
                          </li>
                        </ul>
                      </div>

                      <div className="flex gap-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setStep("info")}
                        >
                          Back
                        </Button>
                        <Button type="submit" className="flex-1">
                          Proceed to Payment
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              {/* Payment Form */}
              {step === "payment" && (
                <Card className="max-w-2xl mx-auto">
                  <CardHeader>
                    <CardTitle>Complete Payment</CardTitle>
                    <CardDescription>
                      You will be redirected to PayU for secure payment
                      processing
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircleIcon className="h-5 w-5 text-green-600" />
                          <h4 className="font-semibold text-green-800">
                            {serviceType === "faq"
                              ? "Questions Submitted"
                              : "Session Booked"}
                          </h4>
                        </div>
                        <p className="text-sm text-green-700">
                          {serviceType === "faq"
                            ? "Your questions have been submitted. Complete payment to receive priority responses."
                            : "Your session has been booked. Complete payment to confirm your slot."}
                        </p>
                      </div>

                      <div className="border rounded-lg p-4">
                        <h4 className="font-semibold mb-2">Payment Summary:</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Service</span>
                            <span>
                              {serviceType === "faq"
                                ? "Additional Questions"
                                : "Consultation Session"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Amount</span>
                            <span className="font-semibold">
                              ₹{serviceType === "faq" ? "50" : "150"}
                            </span>
                          </div>
                          <Separator />
                          <div className="flex justify-between font-semibold">
                            <span>Total</span>
                            <span>₹{serviceType === "faq" ? "50" : "150"}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={resetForms}
                        >
                          Cancel
                        </Button>
                        <Button onClick={handlePayment} className="flex-1">
                          <CreditCardIcon className="h-4 w-4 mr-2" />
                          Pay Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Success State */}
              {step === "success" && (
                <Card className="max-w-2xl mx-auto">
                  <CardContent className="p-8 text-center">
                    <div className="space-y-6">
                      <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircleIcon className="h-8 w-8 text-green-600" />
                      </div>
                      
                      <div>
                        <h3 className="text-2xl font-bold text-green-800 mb-2">
                          {submissionResult?.hasPaidQuestions ? 
                            "Payment Successful!" : 
                            "Question Submitted!"
                          }
                        </h3>
                        <p className="text-gray-600">
                          {submissionResult?.message}
                        </p>
                      </div>

                      {submissionResult?.hasPaidQuestions && (
                        <div className="bg-green-50 p-4 rounded-lg">
                          <p className="text-sm text-green-700">
                            <strong>✅ Payment Confirmed</strong><br/>
                            Your additional questions are now prioritized and will be answered by our expert astrologers.
                          </p>
                        </div>
                      )}

                      <div className="space-y-3">
                        <Button
                          onClick={resetForms}
                          className="w-full bg-gradient-to-r from-amber-500 to-orange-500"
                        >
                          Ask Another Question
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => window.location.href = '/'}
                          className="w-full"
                        >
                          Back to Home
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
