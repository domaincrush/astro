import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "src/components/ui/card";
import { Button } from "src/components/ui/button";
import { Badge } from "src/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "src/components/ui/avatar";
import {
  Star,
  MapPin,
  Globe,
  Clock,
  Award,
  Users,
  Heart,
  MessageCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";
import { Helmet } from "react-helmet-async";
import { useAuth } from "src/hooks/useAuth";
import { Input } from "src/components/ui/input";
import { Label } from "src/components/ui/label";
import LocationSearch from "src/components/LocationSearch";
import {
  getAstrologerPageTitle,
  getAstrologerMetaDescription,
  createAstrologerSlug,
} from "src/utils/seoUtils";
import AstrologerReviews from "src/components/astrologer/AstrologerReviews";
import AstrologerBreadcrumb from "src/components/astrologer/AstrologerBreadcrumb";
import RelatedAstrologers from "src/components/astrologer/RelatedAstrologers";

interface Astrologer {
  id: number;
  name: string;
  email: string;
  image?: string;
  profileImage?: string;
  bio: string;
  experience: number;
  rating: number;
  specializations: string[];
  languages: string[];
  ratePerMinute: number;
  totalConsultations: number;
  isOnline: boolean;
}

export default function AstrologerDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  const [selectedDuration, setSelectedDuration] = useState<number>(10);
  const [question, setQuestion] = useState<string>("");
  const [userDetails, setUserDetails] = useState({
    name: "",
    dateOfBirth: "",
    timeOfBirth: "",
    placeOfBirth: "",
    promoCode: "",
  });
  const [promoCodeDiscount, setPromoCodeDiscount] = useState<{
    type: "percentage" | "fixed" | null;
    value: number;
    discountAmount: number;
    isValid: boolean;
    message: string;
  }>({
    type: null,
    value: 0,
    discountAmount: 0,
    isValid: false,
    message: "",
  });
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);

  // Check if ID is numeric (use ID endpoint) or string (use name endpoint)
  const isNumericId = !isNaN(Number(id));

  // Query by ID if numeric, otherwise by name
  const { data: astrologer, isLoading } = useQuery<Astrologer>({
    queryKey: isNumericId
      ? [`/api/astrologers/${id}`]
      : [`/api/astrologers/by-name/${id}`],
    enabled: !!id,
  });

  const currentAstrologer = astrologer;

  // Validate promo code
  const validatePromoCode = async (code: string) => {
    if (!code.trim()) {
      setPromoCodeDiscount({
        type: null,
        value: 0,
        discountAmount: 0,
        isValid: false,
        message: "",
      });
      return;
    }

    setIsValidatingPromo(true);
    try {
      // Fixed price for 10-minute consultation (only charge for next 5 minutes)
      const originalPrice = (currentAstrologer?.ratePerMinute || 0) * 5;

      const response = await fetch(`/api/coupons/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: code.trim().toUpperCase(),
          consultationCost: originalPrice,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const discountAmount = data.discount || 0;
        setPromoCodeDiscount({
          type: data.type,
          value: data.value,
          discountAmount,
          isValid: true,
          message: `Promo code applied! Discount: ₹${discountAmount}`,
        });
      } else {
        setPromoCodeDiscount({
          type: null,
          value: 0,
          discountAmount: 0,
          isValid: false,
          message: data.message || "Invalid promo code",
        });
      }
    } catch (error) {
      setPromoCodeDiscount({
        type: null,
        value: 0,
        discountAmount: 0,
        isValid: false,
        message: "Error validating promo code",
      });
    }
    setIsValidatingPromo(false);
  };

  // Handle Chat Now button click
  const handleChatNow = async () => {
    // Check if astrologer exists and is online before proceeding
    if (!currentAstrologer?.isOnline) {
      return; // Do nothing if astrologer is offline or undefined
    }

    // Fixed 10-minute consultation with first 5 minutes free
    const originalPrice = currentAstrologer.ratePerMinute * 5; // Only charge for next 5 minutes
    const finalPrice = Math.max(
      0,
      originalPrice - promoCodeDiscount.discountAmount,
    );

    if (isAuthenticated) {
      // Check if promo code covers full amount (free chat)
      if (promoCodeDiscount.isValid && finalPrice <= 0) {
        try {
          // Create consultation first for free chat
          const response = await fetch("/api/consultations/create", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              astrologerId: currentAstrologer.id,
              duration: 10,
              cost: originalPrice, // Original cost before discount
              paymentMethod: "free",
              userDetails: userDetails,
              topic: question || "General Consultation",
              couponCode: userDetails.promoCode || null,
            }),
          });

          const data = await response.json();

          if (response.ok && data.consultation) {
            // Successfully created consultation, redirect to chat
            setLocation(`/chat?consultation=${data.consultation.id}`);
          } else {
            console.error("Failed to create free consultation:", data);
            // Fallback to payment page
            setLocation(
              `/payment?astrologer=${currentAstrologer?.id}&service=chat&duration=10&price=${finalPrice}&originalPrice=${originalPrice}&promoCode=${userDetails.promoCode}&userDetails=${encodeURIComponent(JSON.stringify(userDetails))}&question=${encodeURIComponent(question)}`,
            );
          }
        } catch (error) {
          console.error("Error creating free consultation:", error);
          // Fallback to payment page
          setLocation(
            `/payment?astrologer=${currentAstrologer?.id}&service=chat&duration=10&price=${finalPrice}&originalPrice=${originalPrice}&promoCode=${userDetails.promoCode}&userDetails=${encodeURIComponent(JSON.stringify(userDetails))}&question=${encodeURIComponent(question)}`,
          );
        }
      } else {
        // Paid chat - go to payment page
        setLocation(
          `/payment?astrologer=${currentAstrologer?.id}&service=chat&duration=10&price=${finalPrice}&originalPrice=${originalPrice}&promoCode=${userDetails.promoCode}&userDetails=${encodeURIComponent(JSON.stringify(userDetails))}&question=${encodeURIComponent(question)}`,
        );
      }
    } else {
      // User is not signed in, redirect to signup page
      setLocation(
        `/signup?redirect=${encodeURIComponent(window.location.pathname)}`,
      );
    }
  };

  // Pre-fill user details from authenticated user profile
  useEffect(() => {
    if (isAuthenticated) {
      // Fetch user profile to pre-fill details
      fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            console.log("User profile data:", data);
            setUserDetails((prev) => ({
              ...prev,
              name: data.user?.name,
              dateOfBirth: data.user?.dateOfBirth
                ? new Date(data.user.dateOfBirth).toISOString().split("T")[0]
                : "",
              timeOfBirth: data.user?.timeOfBirth || "",
              placeOfBirth: data.user?.placeOfBirth || "",
            }));
          }
        })
        .catch(console.error);
    }
  }, [isAuthenticated]);

  // Debounced promo code validation
  useEffect(() => {
    const timer = setTimeout(() => {
      validatePromoCode(userDetails.promoCode);
    }, 500);
    return () => clearTimeout(timer);
  }, [userDetails.promoCode]);

  // Set page title for SEO
  useEffect(() => {
    if (currentAstrologer) {
      document.title = `${currentAstrologer.name} - Expert Vedic Astrologer | Consultation & Guidance | AstroTick`;
    }
  }, [currentAstrologer]);

  if (isLoading) {
    return (
      <>
        <AstroTickHeader />
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading astrologer details...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!currentAstrologer) {
    return (
      <>
        <AstroTickHeader />
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Astrologer Not Found
            </h2>
            <p className="text-gray-600">
              The astrologer you're looking for doesn't exist.
            </p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // New pricing structure: First 5 minutes free + Next 5 minutes paid (minimum 10 minutes)
  const servicePackages = [
    {
      duration: 10,
      price: currentAstrologer.ratePerMinute * 5, // Only charge for the next 5 minutes
      originalPrice: currentAstrologer.ratePerMinute * 10,
      discount: 0,
      description: "First 5 min FREE + Next 5 min",
      isMinimum: true,
    },
  ];

  const astrologerSlug = createAstrologerSlug(currentAstrologer.name);
  const pageTitle = getAstrologerPageTitle(
    currentAstrologer.name,
    currentAstrologer.specializations,
  );
  const metaDescription = getAstrologerMetaDescription(
    currentAstrologer.name,
    currentAstrologer.experience,
    currentAstrologer.rating,
    currentAstrologer.specializations,
  );

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta
          name="keywords"
          content={`${currentAstrologer.name}, vedic astrology, astrologer consultation, ${currentAstrologer.specializations.join(", ")}, horoscope reading, birth chart analysis`}
        />
        <link
          rel="canonical"
          href={`https://astrotick.com/astrologer/${astrologerSlug}`}
        />

        {/* Open Graph tags for social media */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="profile" />
        <meta
          property="og:url"
          content={`https://astrotick.com/astrologer/${astrologerSlug}`}
        />
        {currentAstrologer.image && (
          <meta
            property="og:image"
            content={`https://astrotick.com${currentAstrologer.image}`}
          />
        )}
        <meta property="og:site_name" content="AstroTick" />

        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={metaDescription} />
        {currentAstrologer.image && (
          <meta
            name="twitter:image"
            content={`https://astrotick.com${currentAstrologer.image}`}
          />
        )}

        {/* Additional SEO tags */}
        <meta name="author" content={currentAstrologer.name} />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="en" />
      </Helmet>
      <AstroTickHeader />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Breadcrumb Navigation */}
          <AstrologerBreadcrumb
            astrologerName={currentAstrologer.name}
            specialization={currentAstrologer.specializations[0]}
          />
          {/* Header Section */}
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Profile Card */}
            <div className="md:col-span-1">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardContent className="p-6 text-center">
                  <div className="relative mb-6">
                    <Avatar className="h-32 w-32 mx-auto border-4 border-white shadow-lg">
                      <AvatarImage
                        src={
                          currentAstrologer.image ||
                          currentAstrologer.profileImage ||
                          ""
                        }
                        alt={currentAstrologer.name || "Astrologer"}
                      />
                      <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                        {currentAstrologer.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    {/* Status Badge */}
                    <div className="absolute bottom-2 right-1/2 transform translate-x-1/2 translate-y-full">
                      <Badge
                        className={`px-3 py-1 ${
                          currentAstrologer.isOnline
                            ? "bg-green-500 hover:bg-green-600 text-white"
                            : "bg-gray-500 hover:bg-gray-600 text-white"
                        }`}
                      >
                        {currentAstrologer.isOnline
                          ? "Available Now"
                          : "Currently Offline"}
                      </Badge>
                    </div>
                  </div>

                  <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    {currentAstrologer.name}
                  </h1>

                  <div className="flex items-center justify-center mb-4">
                    <div className="flex items-center text-yellow-500 mr-2">
                      <Star className="w-5 h-5 fill-current" />
                      <span className="ml-1 text-lg font-semibold">
                        {currentAstrologer.rating}
                      </span>
                    </div>
                    <span className="text-gray-600">
                      ({currentAstrologer.totalConsultations} consultations)
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 mb-6">
                    <div className="flex items-center justify-center">
                      <Award className="w-4 h-4 mr-2" />
                      <span>
                        {currentAstrologer.experience} years experience
                      </span>
                    </div>
                    <div className="flex items-center justify-center">
                      <Users className="w-4 h-4 mr-2" />
                      <span>₹{currentAstrologer.ratePerMinute}/min</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 justify-center mb-6">
                    {currentAstrologer.languages
                      .slice(0, 4)
                      .map((lang, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {lang}
                        </Badge>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Details Section */}
            <div className="md:col-span-2 space-y-6">
              {/* About Section */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">
                    About {currentAstrologer.name}
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {currentAstrologer.bio}
                  </p>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">
                        Specializations
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {currentAstrologer.specializations.map(
                          (spec, index) => (
                            <Badge
                              key={index}
                              className="bg-purple-100 text-purple-800 hover:bg-purple-200"
                            >
                              {spec}
                            </Badge>
                          ),
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">
                        Languages
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {currentAstrologer.languages.map((lang, index) => (
                          <Badge
                            key={index}
                            className="bg-blue-100 text-blue-800 hover:bg-blue-200"
                          >
                            {lang}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Chat Consultation */}
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">
                    Choose Your Consultation
                  </h2>

                  {/* Chat Service Display */}
                  <div className="flex items-center gap-3 mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border-2 border-purple-200">
                    <MessageCircle className="w-8 h-8 text-purple-600" />
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        Chat Consultation
                      </h3>
                      <p className="text-sm text-gray-600">
                        Get personalized guidance through text messaging
                      </p>
                    </div>
                  </div>

                  {/* New Consultation Pricing Structure */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-800 mb-3">
                      Consultation Pricing
                    </h3>

                    {/* Pricing Card */}
                    <div className="border-2 border-purple-500 bg-gradient-to-r from-green-50 to-purple-50 rounded-lg p-6 mb-4">
                      <div className="text-center mb-4">
                        <div className="text-2xl font-bold text-green-600 mb-2">
                          First 5 Minutes FREE
                        </div>
                        <div className="text-lg text-gray-700 mb-2">
                          Next 5 Minutes:{" "}
                          <span className="font-bold text-purple-600">
                            ₹{currentAstrologer.ratePerMinute * 5}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 font-medium">
                          Minimum 10 minutes chat required
                        </div>
                      </div>

                      <div className="bg-white/80 rounded-lg p-4 border border-purple-200">
                        <h4 className="font-semibold text-gray-800 mb-2">
                          💡 Why 10 Minutes is Important?
                        </h4>
                        <ul className="text-sm text-gray-700 space-y-1">
                          <li>
                            • Allows proper understanding of your birth chart
                            and planetary positions
                          </li>
                          <li>
                            • Gives time for accurate analysis of your specific
                            concerns
                          </li>
                          <li>
                            • Enables astrologer to provide meaningful remedies
                            and guidance
                          </li>
                          <li>
                            • Ensures you get comprehensive answers to your
                            questions
                          </li>
                          <li>
                            • Creates connection for personalized astrological
                            insights
                          </li>
                        </ul>
                      </div>

                      <div className="mt-4 text-center">
                        <div className="text-lg font-bold text-gray-800">
                          Total for 10 Minutes:{" "}
                          <span className="text-purple-600">
                            ₹{currentAstrologer.ratePerMinute * 5}
                          </span>
                        </div>
                        <div className="text-sm text-green-600">
                          (You save ₹{currentAstrologer.ratePerMinute * 5} with
                          free first 5 minutes!)
                        </div>
                      </div>
                    </div>

                    {/* Balance Requirement or Offline Notice */}
                    {currentAstrologer.isOnline ? (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-center gap-2">
                          <span className="text-yellow-600">⚠️</span>
                          <div>
                            <div className="font-semibold text-yellow-800">
                              Balance Requirement
                            </div>
                            <div className="text-sm text-yellow-700">
                              You need a balance of ₹
                              {currentAstrologer.ratePerMinute * 5} for the
                              minimum 10-minute consultation.
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-center gap-2">
                          <span className="text-red-600">🔴</span>
                          <div>
                            <div className="font-semibold text-red-800">
                              Astrologer Currently Offline
                            </div>
                            <div className="text-sm text-red-700">
                              {currentAstrologer.name} is not available right
                              now. Please check back later or choose another
                              available astrologer.
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* User Details Form */}
                  <div className="mb-6 space-y-4">
                    <h3 className="font-semibold text-gray-800 mb-3">
                      Your Details
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={userDetails.name}
                          onChange={(e) =>
                            setUserDetails((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          placeholder="Full Name"
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={userDetails.dateOfBirth}
                          onChange={(e) =>
                            setUserDetails((prev) => ({
                              ...prev,
                              dateOfBirth: e.target.value,
                            }))
                          }
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="timeOfBirth">Time of Birth</Label>
                        <Input
                          id="timeOfBirth"
                          type="time"
                          value={userDetails.timeOfBirth}
                          onChange={(e) =>
                            setUserDetails((prev) => ({
                              ...prev,
                              timeOfBirth: e.target.value,
                            }))
                          }
                          placeholder="HH:MM"
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="placeOfBirth">Place of Birth</Label>
                        <LocationSearch
                          value={userDetails.placeOfBirth}
                          onChange={(location) =>
                            setUserDetails((prev) => ({
                              ...prev,
                              placeOfBirth: location,
                            }))
                          }
                          placeholder="Enter birth place"
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Promo Code Section */}
                  <div className="mb-6">
                    <Label htmlFor="promoCode">Promo Code (Optional)</Label>
                    <div className="mt-1 relative">
                      <Input
                        id="promoCode"
                        value={userDetails.promoCode}
                        onChange={(e) =>
                          setUserDetails((prev) => ({
                            ...prev,
                            promoCode: e.target.value.toUpperCase(),
                          }))
                        }
                        placeholder="Enter promo code"
                        className={`pr-10 ${promoCodeDiscount.isValid ? "border-green-500 bg-green-50" : promoCodeDiscount.message && !promoCodeDiscount.isValid ? "border-red-500 bg-red-50" : ""}`}
                      />
                      {isValidatingPromo && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                        </div>
                      )}
                    </div>
                    {promoCodeDiscount.message && (
                      <div
                        className={`text-sm mt-1 ${promoCodeDiscount.isValid ? "text-green-600" : "text-red-600"}`}
                      >
                        {promoCodeDiscount.message}
                      </div>
                    )}
                  </div>

                  {/* Question Box */}
                  <div className="mb-6">
                    <Label htmlFor="question">Ask your Question</Label>
                    <textarea
                      id="question"
                      value={question}
                      onChange={(e) =>
                        setQuestion(e.target.value.slice(0, 300))
                      }
                      placeholder="Ask your Question"
                      className="w-full p-3 mt-1 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none resize-none"
                      rows={3}
                      maxLength={300}
                    />
                    <div className="text-sm text-gray-500 mt-1 text-right">
                      {question.length}/300 characters
                    </div>
                  </div>

                  {/* Pricing Summary */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700">
                        10-Minute Consultation
                      </span>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">
                          First 5 min: FREE
                        </div>
                        <div className="text-gray-900">
                          Next 5 min: ₹{currentAstrologer.ratePerMinute * 5}
                        </div>
                      </div>
                    </div>
                    {promoCodeDiscount.isValid && (
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-green-600">
                          Promo Discount ({userDetails.promoCode})
                        </span>
                        <span className="text-green-600">
                          -₹{promoCodeDiscount.discountAmount}
                        </span>
                      </div>
                    )}
                    <div className="border-t pt-2 flex justify-between items-center font-semibold">
                      <span className="text-gray-900">Total to Pay</span>
                      <span className="text-purple-600 text-lg">
                        ₹
                        {Math.max(
                          0,
                          currentAstrologer.ratePerMinute * 5 -
                            promoCodeDiscount.discountAmount,
                        )}
                        {promoCodeDiscount.isValid &&
                          Math.max(
                            0,
                            currentAstrologer.ratePerMinute * 5 -
                              promoCodeDiscount.discountAmount,
                          ) === 0 && (
                            <span className="ml-2 text-green-600 text-sm">
                              (FREE)
                            </span>
                          )}
                      </span>
                    </div>
                  </div>

                  {/* Chat Now Button */}
                  <Button
                    onClick={handleChatNow}
                    className={`w-full py-3 text-lg font-semibold transition-all ${
                      !currentAstrologer.isOnline
                        ? "bg-gray-400 hover:bg-gray-400 text-gray-600 cursor-not-allowed"
                        : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                    }`}
                    disabled={
                      !userDetails?.name?.trim() || !currentAstrologer.isOnline
                    }
                  >
                    {!currentAstrologer.isOnline
                      ? "Astrologer Currently Offline"
                      : promoCodeDiscount.isValid &&
                          Math.max(
                            0,
                            currentAstrologer.ratePerMinute * 5 -
                              promoCodeDiscount.discountAmount,
                          ) === 0
                        ? "Start Free 10-Min Chat"
                        : `Start 10-Min Chat - ₹${Math.max(0, currentAstrologer.ratePerMinute * 5 - promoCodeDiscount.discountAmount)}`}
                  </Button>
                </CardContent>
              </Card>

              {/* Enhanced Reviews Section */}
              <AstrologerReviews
                astrologerName={currentAstrologer.name}
                overallRating={currentAstrologer.rating}
                totalReviews={currentAstrologer.totalConsultations || 150}
              />
            </div>
          </div>

          {/* Related Astrologers Section */}
          {currentAstrologer && (
            <RelatedAstrologers currentAstrologer={currentAstrologer} />
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
