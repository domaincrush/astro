import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useAuth } from "src/hooks/useAuth";
import { Button } from "src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { Badge } from "src/components/ui/badge";
import { Input } from "src/components/ui/input";
import { Label } from "src/components/ui/label";
import { RadioGroup, RadioGroupItem } from "src/components/ui/radio-group";
import { Link, useLocation } from "wouter";
import LocationSearch from "src/components/LocationSearch";
import { useToast } from "src/hooks/use-toast";
import {
  Crown,
  Star,
  Clock,
  Heart,
  CheckCircle,
  Gift,
  Sparkles,
  Zap,
  Users,
  Eye,
  Moon,
  Sun,
  Calculator,
  User,
  Calendar,
  Globe,
} from "lucide-react";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";

export default function SuperHoroscope() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    gender: "male",
    date: "",
    time: "",
    location: "",
    latitude: null as number | null,
    longitude: null as number | null,
    timezone: "Asia/Kolkata",
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      window.location.href = `/login?redirect=${encodeURIComponent("/reports/super-horoscope")}`;
      return;
    }

    if (formData.latitude === null || formData.longitude === null) {
      toast({
        title: "Location Required",
        description: "Please select a valid birth location",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const token = localStorage.getItem("token");
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch("/api/premium-report/generate", {
        method: "POST",
        headers,
        credentials: "include",

        body: JSON.stringify({
          name: formData.name,
          gender: formData.gender,
          date: formData.date,
          time: formData.time,
          place: formData.location,
          latitude: formData.latitude,
          longitude: formData.longitude,
          timezone: formData.timezone,
          template: "super_horoscope",
        }),
      });
      console.log("Submitting report request:", {
        name: formData.name,
        gender: formData.gender,
        date: formData.date,
        time: formData.time,
        place: formData.location,
        latitude: formData.latitude,
        longitude: formData.longitude,
        timezone: formData.timezone,
      });

      const data = await response.json();

      if (data.success) {
        // Generate a unique report ID
        const reportId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // Store report data in localStorage for the results page
        localStorage.setItem(
          `super-horoscope-${reportId}`,
          JSON.stringify(data.report),
        );

        // Navigate to results page
        navigate(`/reports/super-horoscope/results/${reportId}`);

        toast({
          title: "Report Generated",
          description: "Redirecting to your Super Horoscope results...",
        });
      } else {
        throw new Error(data.error || "Report generation failed");
      }
    } catch (error) {
      console.error("Super Horoscope error:", error);
      toast({
        title: "Generation Failed",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLocationSelect = (location: any) => {
    setFormData((prev) => ({
      ...prev,
      location: location.display || location.name,
      latitude: parseFloat(location.latitude ?? location.lat),
      longitude: parseFloat(location.longitude ?? location.lng),
      timezone: location.timezone || "Asia/Kolkata",
    }));
  };

  return (
    <>
      <Helmet>
        <title>
          Super Horoscope - Comprehensive Vedic Astrology Report (₹499) |
          AstroTick
        </title>
        <meta
          name="description"
          content="Get your comprehensive Super Horoscope report for ₹499. 80-95 page premium analysis with detailed predictions, remedies, and authentic Jyotisha calculations."
        />
        <meta
          name="keywords"
          content="super horoscope, vedic astrology, comprehensive report, jyotisha, predictions, remedies"
        />
      </Helmet>

      <AstroTickHeader />

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <Crown className="h-12 w-12 text-yellow-300" />
              <h1 className="text-5xl font-bold">Super Horoscope</h1>
              <Star className="h-12 w-12 text-yellow-300" />
            </div>
            <p className="text-2xl mb-4 text-purple-100">
              80-95 Page Premium Vedic Astrology Report
            </p>
            <div className="flex items-center justify-center gap-6 text-lg">
              <Badge
                variant="secondary"
                className="bg-yellow-400 text-purple-900 px-4 py-2 text-lg font-bold"
              >
                ₹499 Only
              </Badge>
              <Badge
                variant="outline"
                className="border-white text-white px-4 py-2 text-lg"
              >
                Authentic Jyotisha
              </Badge>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Form Section */}
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-2xl border-2 border-purple-200">
              <CardHeader className="bg-gradient-to-r from-purple-100 to-indigo-100">
                <CardTitle className="text-2xl font-bold text-purple-800 flex items-center gap-2">
                  <User className="h-6 w-6" />
                  Generate Your Super Horoscope Report
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="username"
                      className="text-sm font-medium text-gray-700"
                    >
                      Full Name *
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      required
                      className="w-full"
                    />
                  </div>

                  {/* Gender Selection */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Gender *
                    </Label>
                    <RadioGroup
                      value={formData.gender}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, gender: value }))
                      }
                      className="flex gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="male" />
                        <Label htmlFor="male">Male</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="female" />
                        <Label htmlFor="female">Female</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Birth Date */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="date"
                      className="text-sm font-medium text-gray-700 flex items-center gap-2"
                    >
                      <Calendar className="h-4 w-4" />
                      Birth Date *
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          date: e.target.value,
                        }))
                      }
                      required
                      className="w-full"
                    />
                  </div>

                  {/* Birth Time */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="time"
                      className="text-sm font-medium text-gray-700 flex items-center gap-2"
                    >
                      <Clock className="h-4 w-4" />
                      Birth Time *
                    </Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          time: e.target.value,
                        }))
                      }
                      required
                      className="w-full"
                    />
                  </div>

                  {/* Location Search */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Birth Location *
                    </Label>
                    <LocationSearch
                      onLocationSelect={handleLocationSelect}
                      placeholder="Search for your birth city..."
                    />
                    {formData.location && (
                      <p className="text-sm text-green-600 mt-2">
                        Selected: {formData.location}
                      </p>
                    )}
                  </div>

                  {/* Generate Button */}
                  <Button
                    type="submit"
                    disabled={isGenerating}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 text-lg font-semibold"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                        Generating Your Super Horoscope...
                      </>
                    ) : (
                      <>
                        <Crown className="h-5 w-5 mr-2" />
                        Generate Super Horoscope Report (₹499)
                      </>
                    )}
                  </Button>

                  {/* Login Note */}
                  {!isAuthenticated && (
                    <div className="text-center text-sm text-gray-600 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <p>
                        You'll be redirected to login before generating the
                        report
                      </p>
                    </div>
                  )}
                </form>

                {!isGenerating && (
                  <div className="text-center py-8">
                    <div className="bg-gradient-to-r from-purple-100 to-indigo-100 p-8 rounded-xl border border-purple-200 mb-6">
                      <Crown className="h-16 w-16 text-purple-600 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-purple-800 mb-2">
                        Ready to Generate Your Super Horoscope?
                      </h3>
                      <p className="text-purple-700">
                        Complete the form above and click "Generate Report" to
                        reveal your comprehensive astrological analysis.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* What You Get Section */}
          <Card className="mt-12 border-2 border-indigo-200 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
              <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
                <Eye className="h-6 w-6" />
                What You Get in Super Horoscope
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  "Complete Personality Analysis",
                  "Career & Profession Guidance",
                  "Marriage & Relationship Timing",
                  "Health & Wellness Predictions",
                  "Wealth & Financial Prospects",
                  "Family & Children Analysis",
                  "Education & Learning Potential",
                  "Spiritual Growth Path",
                  "Yearly Predictions",
                  "Monthly Forecasts",
                  "Lucky Colors & Numbers",
                  "Gemstone Recommendations",
                  "Mantra & Remedies",
                  "Favorable Directions",
                  "Business Partnership Analysis",
                  "Property & Assets Timing",
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg"
                  >
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </>
  );
}
