import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import { Label } from "src/components/ui/label";
import { useToast } from "src/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "src/lib/queryClient";
import LocationSearch from "src/components/LocationSearch";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";
import { Moon, Calendar, MapPin, Clock } from "lucide-react";
import { useRef } from "react";

interface MoonSignData {
  moonSign: string;
  moonDegree: number;
  nakshatra: string;
  description: string;
  characteristics: string[];
  calculationEngine: string;
}

export default function MoonSignChecker() {
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const resultRef = useRef<HTMLDivElement | null>(null);
  const [birthPlace, setBirthPlace] = useState<string | any>("");
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [result, setResult] = useState<MoonSignData | null>(null);
  const { toast } = useToast();
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [birthDateError, setBirthDateError] = useState("");
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [ampm, setAmPm] = useState("");
  const [birthTimeError, setBirthTimeError] = useState("");

  const validateAndSetDate = (d: string, m: string, y: string) => {
    if (d && m && y) {
      const formatted = `${y}-${m}-${d}`;
      const dateObj = new Date(formatted);

      if (
        dateObj &&
        dateObj.getFullYear().toString() === y &&
        (dateObj.getMonth() + 1).toString().padStart(2, "0") === m &&
        dateObj.getDate().toString().padStart(2, "0") === d
      ) {
        setBirthDateError("");
        setBirthDate(formatted); // final YYYY-MM-DD value
      } else {
        setBirthDateError("Please select a valid date");
        setBirthDate("");
      }
    }
  };
  const validateAndSetTime = (h: string, min: string, meridian: string) => {
    if (h && min && meridian) {
      const hh = parseInt(h, 10);
      const mm = parseInt(min, 10);

      if (hh >= 1 && hh <= 12 && mm >= 0 && mm <= 59) {
        setBirthTimeError("");
        setBirthTime(
          `${h.padStart(2, "0")}:${min.padStart(2, "0")} ${meridian}`,
        );
      } else {
        setBirthTimeError("Please select a valid time");
        setBirthTime("");
      }
    }
  };

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      console.log("Sending Moon Sign request:", data);
      const response = await apiRequest(
        "POST",
        "/api/calculate-moon-sign",
        data,
      );
      const result = await response;
      console.log("Moon Sign API response:", result);
      return result;
    },
    onSuccess: (data) => {
      console.log("Moon Sign calculation successful:", data);
      if (data.success) {
        setResult(data.data);
        toast({
          title: "Moon Sign Calculated",
          description:
            "Your lunar zodiac sign has been calculated successfully",
        });
        if (window.innerWidth < 768 && resultRef.current) {
          setTimeout(() => {
            resultRef.current?.scrollIntoView({ behavior: "smooth" });
          }, 300);
        }
      } else {
        console.error("Moon Sign calculation failed:", data.message);
        toast({
          title: "Calculation Failed",
          description: data.message || "Unable to calculate moon sign",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      console.error("Moon Sign calculation error:", error);
      toast({
        title: "Error",
        description: "Failed to calculate moon sign. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Moon Sign form submitted with data:", {
      birthDate,
      birthTime,
      birthPlace,
      coordinates,
    });

    // Basic field validation
    if (!birthDate || !birthTime || !birthPlace) {
      console.error("Missing basic required fields:", {
        birthDate: !!birthDate,
        birthTime: !!birthTime,
        birthPlace: !!birthPlace,
      });
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Get coordinates from coordinates state (LocationSearch sets this)
    if (!coordinates || !coordinates.lat || !coordinates.lng) {
      console.error("Missing coordinates:", coordinates);
      toast({
        title: "Location Required",
        description: "Please select a valid location from the dropdown",
        variant: "destructive",
      });
      return;
    }

    const requestData = {
      birthDate: birthDate,
      birthTime: birthTime,
      birthPlace:
        typeof birthPlace === "string"
          ? birthPlace
          : birthPlace.name || birthPlace,
      latitude: coordinates.lat,
      longitude: coordinates.lng,
    };

    console.log("Sending request data:", requestData);
    mutation.mutate(requestData);
  };

  return (
    <>
      <Helmet>
        <title>
          Free Moon Sign Calculator | Chandra Rashi Checker - AstroTick
        </title>
        <meta
          name="description"
          content="Free Moon Sign Calculator - Discover your Chandra Rashi and emotional nature with authentic Vedic astrology calculations. Get detailed moon sign analysis and characteristics."
        />
        <meta
          name="keywords"
          content="free moon sign calculator, free Chandra Rashi checker, Vedic moon sign, lunar zodiac calculator, free astrology calculator"
        />
        <link rel="canonical" href="https://astrotick.com/moon-sign-checker" />

        {/* Open Graph */}
        <meta
          property="og:title"
          content="Free Moon Sign Calculator - AstroTick"
        />
        <meta
          property="og:description"
          content="Free Moon Sign Calculator - Discover your Chandra Rashi and emotional nature with authentic Vedic astrology calculations."
        />
        <meta
          property="og:url"
          content="https://astrotick.com/moon-sign-checker"
        />
        <meta property="og:type" content="website" />

        {/* Twitter */}
        <meta
          name="twitter:title"
          content="Free Moon Sign Calculator - AstroTick"
        />
        <meta
          name="twitter:description"
          content="Free Moon Sign Calculator - Discover your Chandra Rashi and emotional nature with authentic Vedic astrology calculations."
        />

        {/* Schema.org structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Free Moon Sign Calculator",
            description:
              "Free authentic Vedic moon sign calculator for Chandra Rashi analysis",
            url: "https://astrotick.com/moon-sign-checker",
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
                <Moon className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
                Moon Sign Checker
              </h1>
              <p className="md:text-xl text-gray-600 max-w-2xl mx-auto">
                Discover your Moon sign (Chandra Rashi) and understand your
                emotional nature, mental tendencies, and subconscious patterns
                according to Vedic astrology.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <Card className="shadow-xl border-amber-500 bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 p-4 mb-5 rounded-t-lg">
                  <CardTitle className="text-2xl text-white text-center ">
                    Enter Birth Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2 text-xs ">
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
                    <div className="space-y-2 text-sm ">
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

                      <div className="flex gap-2 text-gray-400">
                        {/* Hour */}
                        <select
                          value={hour}
                          onChange={(e) => {
                            setHour(e.target.value);
                            validateAndSetTime(e.target.value, minute, ampm);
                          }}
                          className="border rounded p-2"
                        >
                          <option value="">Hour</option>
                          {Array.from({ length: 12 }, (_, i) => (
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
                            validateAndSetTime(hour, e.target.value, ampm);
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
                        <select
                          value={ampm}
                          onChange={(e) => {
                            setAmPm(e.target.value);
                            validateAndSetTime(hour, minute, e.target.value);
                          }}
                          className="border rounded p-2"
                        >
                          <option value="">AM/PM</option>
                          <option value="AM">AM</option>
                          <option value="PM">PM</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Birth Place
                      </Label>
                      <LocationSearch
                        onLocationSelect={(location: any) => {
                          console.log("Location selected:", location);

                          // normalize place name
                          const place =
                            location.display ||
                            location.place ||
                            location.place_name ||
                            "";
                          setBirthPlace(place);

                          // normalize coordinates
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
                        placeholder="Enter your birth city..."
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                      disabled={mutation.isPending}
                    >
                      {mutation.isPending
                        ? "Calculating..."
                        : "Check Moon Sign"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle
                    className="text-2xl text-center text-mystical-blue"
                    ref={resultRef}
                  >
                    Your Moon Sign
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {result ? (
                    <div className="space-y-6">
                      <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                        <h3 className="text-3xl font-bold text-mystical-blue mb-2">
                          {result.moonSign}
                        </h3>
                        <p className="text-lg text-gray-600">
                          Nakshatra: {result.nakshatra}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Degree: {result.moonDegree?.toFixed(2) || "N/A"}° |
                          Engine: {result.calculationEngine}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">
                          Description
                        </h4>
                        <p className="text-gray-700 leading-relaxed">
                          {result.description}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">
                          Characteristics
                        </h4>
                        <ul className="space-y-2">
                          {result.characteristics.map((trait, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <Moon className="h-4 w-4 text-mystical-gold mt-1 flex-shrink-0" />
                              <span className="text-gray-700">{trait}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Moon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">
                        Enter your birth details to discover your Moon sign
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card className="mt-12 shadow-xl border-0 bg-gradient-to-r from-purple-50 to-pink-50">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-mystical-blue mb-4 text-center">
                  About Moon Sign (Chandra Rashi)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
                  <div>
                    <h4 className="font-semibold mb-2">What is Moon Sign?</h4>
                    <p>
                      Your Moon sign represents the zodiac sign where the Moon
                      was positioned at your birth time. It governs your
                      emotions, instincts, and subconscious mind.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Why is it Important?</h4>
                    <p>
                      In Vedic astrology, the Moon sign is often considered more
                      significant than the Sun sign, as it influences your
                      mental state, emotional responses, and intuition.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
