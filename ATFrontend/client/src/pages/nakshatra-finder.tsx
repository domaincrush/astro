import { useState } from "react";
import { useLocation } from "wouter";
import { Helmet } from "react-helmet-async";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "src/components/ui/card";
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import { Label } from "src/components/ui/label";
import { useToast } from "src/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "src/lib/queryClient";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";
import LocationSearch from "src/components/LocationSearch";
import { Sparkles, Calendar, Clock, MapPin } from "lucide-react";
import { useRef } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { openAstroWhatsApp } from "../utils/whatsapp";
import { Zap } from "lucide-react";

export default function NakshatraFinder() {
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const resultRef = useRef<HTMLDivElement | null>(null);
  const [, setLocation] = useLocation();
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [birthDateError, setBirthDateError] = useState("");
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [birthTimeError, setBirthTimeError] = useState("");

  const validateAndSetDate = (d: string, m: string, y: string) => {
    if (d && m && y) {
      const dayNum = parseInt(d);
      const monthNum = parseInt(m);
      const yearNum = parseInt(y);

      const isValidDate =
        dayNum >= 1 &&
        dayNum <= 31 &&
        monthNum >= 1 &&
        monthNum <= 12 &&
        yearNum >= 1900 &&
        yearNum <= new Date().getFullYear();

      if (isValidDate) {
        setBirthDateError("");
        setBirthDate(`${d}-${m}-${y}`); // ✅ DD-MM-YYYY
      } else {
        setBirthDateError("Please select a valid date");
        setBirthDate("");
      }
    }
  };
  const validateAndSetTime = (h: string, min: string) => {
    if (h && min) {
      const hh = parseInt(h, 10);
      const mm = parseInt(min, 10);

      if (hh >= 1 && hh <= 24 && mm >= 0 && mm <= 59) {
        setBirthTimeError("");
        setBirthTime(`${h.padStart(2, "0")}:${min.padStart(2, "0")}`);
      } else {
        setBirthTimeError("Please select a valid time");
        setBirthTime("");
      }
    }
  };

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest(
        "POST",
        "/api/calculate-nakshatra",
        data,
      );
      return response;
    },
    onSuccess: (data) => {
      if (data.success) {
        setResult(data.data);
        toast({
          title: "Nakshatra Found",
          description: "Your birth star has been calculated successfully",
        });
        if (window.innerWidth < 768 && resultRef.current) {
          setTimeout(() => {
            resultRef.current?.scrollIntoView({ behavior: "smooth" });
          }, 300);
        }
      } else {
        toast({
          title: "Calculation Failed",
          description: data.message || "Unable to find nakshatra",
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to find nakshatra. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Nakshatra form submission:", {
      birthDate,
      birthTime,
      birthPlace,
      coordinates,
    });

    // Basic field validation
    if (!birthDate || !birthTime || !birthPlace) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Coordinate validation (standardized to lat/lng format)
    if (!coordinates || !coordinates.lat || !coordinates.lng) {
      console.log("Missing coordinates in nakshatra:", coordinates);
      toast({
        title: "Location Required",
        description: "Please select a valid location from the dropdown",
        variant: "destructive",
      });
      return;
    }

    mutation.mutate({
      birthDate,
      birthTime,
      birthPlace,
      latitude: coordinates.lat,
      longitude: coordinates.lng,
    });
  };

  return (
    <>
      <Helmet>
        <title>Free Nakshatra Finder | Birth Star Calculator - AstroTick</title>
        <meta
          name="description"
          content="Free Nakshatra Finder - Discover your birth star (Nakshatra) with authentic Vedic astrology calculations. Get detailed cosmic characteristics and life path insights."
        />
        <meta
          name="keywords"
          content="free nakshatra finder, free birth star calculator, Vedic nakshatra, lunar mansion calculator, free astrology calculator"
        />
        <link rel="canonical" href="https://astrotick.com/nakshatra-finder" />

        {/* Open Graph */}
        <meta property="og:title" content="Free Nakshatra Finder - AstroTick" />
        <meta
          property="og:description"
          content="Free Nakshatra Finder - Discover your birth star (Nakshatra) with authentic Vedic astrology calculations."
        />
        <meta
          property="og:url"
          content="https://astrotick.com/nakshatra-finder"
        />
        <meta property="og:type" content="website" />

        {/* Twitter */}
        <meta
          name="twitter:title"
          content="Free Nakshatra Finder - AstroTick"
        />
        <meta
          name="twitter:description"
          content="Free Nakshatra Finder - Discover your birth star (Nakshatra) with authentic Vedic astrology calculations."
        />

        {/* Schema.org structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Free Nakshatra Finder",
            description:
              "Free authentic Vedic nakshatra calculator for birth star analysis",
            url: "https://astrotick.com/nakshatra-finder",
            applicationCategory: "LifestyleApplication",
            operatingSystem: "Web Browser",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <AstroTickHeader />
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-500 to-red-600 rounded-full mb-6">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
              <h1 className=" text-2xl md:text-4xl font-bold text-gray-900 mb-4">
                Nakshatra Finder
              </h1>
              <p className="md:text-xl text-gray-600 max-w-2xl mx-auto">
                Discover your birth star (Nakshatra) and understand your cosmic
                characteristics and life path.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="shadow-xl border-amber-500 bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 p-4 mb-5 rounded-t-lg">
                  <CardTitle className="text-2xl  text-center text-white ">
                    Enter Birth Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="birthDate"
                        className="flex items-center gap-2"
                      >
                        <Calendar className="h-4 w-4" />
                        Birth Date
                      </Label>

                      {birthDateError && (
                        <p className="text-red-500 text-sm">{birthDateError}</p>
                      )}

                      <div className="flex gap-2">
                        {/* Day */}
                        <select
                          value={day}
                          onChange={(e) => {
                            setDay(e.target.value);
                            validateAndSetDate(e.target.value, month, year);
                          }}
                          className="border rounded p-2"
                        >
                          <option value="">Day</option>
                          {Array.from({ length: 31 }, (_, i) => (
                            <option
                              key={i + 1}
                              value={String(i + 1).padStart(2, "0")}
                            >
                              {i + 1}
                            </option>
                          ))}
                        </select>

                        {/* Month */}
                        <select
                          value={month}
                          onChange={(e) => {
                            setMonth(e.target.value);
                            validateAndSetDate(day, e.target.value, year);
                          }}
                          className="border rounded p-2"
                        >
                          <option value="">Month</option>
                          {Array.from({ length: 12 }, (_, i) => (
                            <option
                              key={i + 1}
                              value={String(i + 1).padStart(2, "0")}
                            >
                              {new Date(0, i).toLocaleString("default", {
                                month: "long",
                              })}
                            </option>
                          ))}
                        </select>

                        {/* Year */}
                        <select
                          value={year}
                          onChange={(e) => {
                            setYear(e.target.value);
                            validateAndSetDate(day, month, e.target.value);
                          }}
                          className="border rounded p-2"
                        >
                          <option value="">Year</option>
                          {Array.from({ length: 120 }, (_, i) => {
                            const y = new Date().getFullYear() - i;
                            return (
                              <option key={y} value={y.toString()}>
                                {y}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                    {/* Birth Time */}
                    <div className="space-y-2">
                      <label
                        htmlFor="birthTime"
                        className="flex items-center gap-2 font-medium"
                      >
                        <Clock className="h-4 w-4" />
                        Birth Time
                      </label>

                      {birthTimeError && (
                        <p className="text-red-500 text-sm">{birthTimeError}</p>
                      )}

                      <div className="flex gap-2">
                        {/* Hour */}
                        <select
                          value={hour}
                          onChange={(e) => {
                            setHour(e.target.value);
                            validateAndSetTime(e.target.value, minute);
                          }}
                          className="border rounded p-2"
                        >
                          <option value="">Hour</option>
                          {Array.from({ length: 24 }, (_, i) => (
                            <option key={i + 1} value={String(i + 1)}>
                              {i + 1}
                            </option>
                          ))}
                        </select>

                        {/* Minute */}
                        <select
                          value={minute}
                          onChange={(e) => {
                            setMinute(e.target.value);
                            validateAndSetTime(hour, e.target.value);
                          }}
                          className="border rounded p-2"
                        >
                          <option value="">Minute</option>
                          {Array.from({ length: 60 }, (_, i) => (
                            <option key={i} value={String(i).padStart(2, "0")}>
                              {i.toString().padStart(2, "0")}
                            </option>
                          ))}
                        </select>

                        {/* AM/PM */}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="birthPlace"
                        className="flex items-center gap-2"
                      >
                        <MapPin className="h-4 w-4" />
                        Birth Place
                      </Label>
                      <LocationSearch
                        placeholder="Enter birth place (e.g., Chennai, Mumbai)"
                        onLocationSelect={(location: any) => {
                          console.log("Nakshatra location selected:", location);

                          // normalize shape safely
                          const place =
                            location.display ||
                            location.place ||
                            location.place_name ||
                            "";
                          setBirthPlace(place);

                          if (location.latitude && location.longitude) {
                            setCoordinates({
                              lat: location.latitude,
                              lng: location.longitude,
                            });
                          } else {
                            setCoordinates(null);
                          }
                        }}
                        data-testid="input-birthPlace"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                      disabled={mutation.isPending}
                    >
                      {mutation.isPending ? "Finding..." : "Find Nakshatra"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card
                className="shadow-xl border-0 bg-white/80 backdrop-blur-sm"
                ref={resultRef}
              >
                <CardHeader>
                  <CardTitle className="text-2xl text-center text-mystical-blue">
                    Your Nakshatra
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {result ? (
                    <div className="space-y-6">
                      <div className="text-center p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
                        <h3 className="text-3xl font-bold text-mystical-blue mb-2">
                          {result.nakshatra}
                        </h3>
                        <p className="text-lg text-gray-600">
                          Pada {result.pada || "N/A"} | Lord:{" "}
                          {result.nakshatraLord || result.lord || "N/A"}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">
                          Characteristics
                        </h4>
                        <p className="text-gray-700">{result.description}</p>
                        {result.characteristics && (
                          <div className="mt-4 space-y-2">
                            {result.characteristics.map(
                              (char: string, index: number) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-2 text-sm text-gray-600"
                                >
                                  <span className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></span>
                                  {char}
                                </div>
                              ),
                            )}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() =>
                          setLocation("/learn-astrology/nakshatras")
                        }
                        className="mt-4 w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
                      >
                        Explore more
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Sparkles className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">
                        Enter your birth details to find your Nakshatra
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold mb-6 text-white">
                Ready to Unlock Your Astrology Wisdom
              </h2>
              <p className="text-xl text-white mb-8 opacity-90">
                Get personalized Astrology readings and discover the mystical
                guidance awaiting you
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/learn-astrology/nakshatras">
                  <Button
                    size="lg"
                    className="bg-white text-purple-600 hover:bg-gray-100 font-bold px-8 py-4 text-lg"
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    Learn Nakshatra Basics
                  </Button>
                </Link>
                {/* <Link href="/astrologers"> */}
                <Button
                  type="button"
                  onClick={openAstroWhatsApp}
                  size="lg"
                  variant="outline"
                  className="border-white text-purple-600 hover:bg-white hover:text-purple-600 font-bold px-8 py-4 text-lg"
                >
                  Consult with Expert
                </Button>
                {/* </Link> */}
              </div>
            </motion.div>
          </div>
        </section>
        <Footer />
      </div>
    </>
  );
}