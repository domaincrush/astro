import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Calendar, Clock, Star } from "lucide-react";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import { Footer } from "src/components/layout/Footer";
import { useToast } from "src/hooks/use-toast";
import { LocationSearch } from "src/components/LocationSearch";
import { Helmet } from "react-helmet-async";
import { useRef } from "react";

const dashaSchema = z.object({
  name: z.string().min(1, "Name is required"),
  birthDate: z.string().min(1, "Birth date is required"),
  birthTime: z.string().min(1, "Birth time is required"),
  birthPlace: z.string().min(1, "Birth place is required"),
});

type DashaFormData = z.infer<typeof dashaSchema>;

export default function DashaCalculator() {
  const [dashaResult, setDashaResult] = useState<any>(null);
  const resultRef = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const { toast } = useToast();
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [birthDate, setBirthDate] = useState(""); // ✅ added
  const [birthDateError, setBirthDateError] = useState("");

  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [ampm, setAmPm] = useState("");
  const [birthTime, setBirthTime] = useState(""); // ✅ added
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
        setBirthDate(formatted);
        form.setValue("birthDate", formatted); // ✅ keep form in sync
      } else {
        setBirthDateError("Please select a valid date");
        setBirthDate("");
        form.setValue("birthDate", ""); // ✅ reset form value
      }
    }
  };

  const validateAndSetTime = (h: string, min: string, meridian: string) => {
    if (h && min && meridian) {
      const hh = parseInt(h, 10);
      const mm = parseInt(min, 10);

      if (hh >= 1 && hh <= 12 && mm >= 0 && mm <= 59) {
        setBirthTimeError("");
        const formatted = `${h.padStart(2, "0")}:${min.padStart(2, "0")}`;
        setBirthTime(formatted);
        form.setValue("birthTime", formatted); // ✅ keep form in sync
      } else {
        setBirthTimeError("Please select a valid time");
        setBirthTime("");
        form.setValue("birthTime", ""); // ✅ reset form value
      }
    }
  };

  const form = useForm<DashaFormData>({
    resolver: zodResolver(dashaSchema),
    defaultValues: {
      name: "",
      birthDate: "",
      birthTime: "",
      birthPlace: "",
    },
  });

  const onSubmit = async (data: DashaFormData) => {
    setIsLoading(true);

    // Check if we have location data, if not use fallback coordinates
    const locationData = selectedLocation || {
      name: data.birthPlace,
      latitude: 28.6139, // Delhi coordinates as fallback
      longitude: 77.209,
    };

    try {
      const response = await fetch("/api/birth-chart/dasha-predictions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          date: data.birthDate,
          time: data.birthTime,
          latitude: locationData.latitude,
          longitude: locationData.longitude,
          place: locationData.name || data.birthPlace,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Failed to calculate Dasha periods",
        );
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to calculate Dasha periods");
      }
      if (window.innerWidth < 768 && resultRef.current) {
        setTimeout(() => {
          resultRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 300);
      }

      setDashaResult(result);

      toast({
        title: "Dasha Calculated Successfully",
        description: "Your current planetary periods have been calculated",
      });
    } catch (error) {
      toast({
        title: "Calculation Error",
        description: "Failed to calculate Dasha periods. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>
          Free Dasha Calculator | Planetary Period Analysis - AstroTick
        </title>
        <meta
          name="description"
          content="Free Dasha Calculator - Calculate your current planetary periods (Mahadasha & Antardasha) with our authentic Vedic Dasha calculator. Get detailed timing and effects analysis."
        />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <AstroTickHeader />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-600 to-amber-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
              <Clock className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
              Dasha Calculator
            </h1>
            <p className="md:text-xl text-gray-600 max-w-3xl mx-auto">
              Calculate your current planetary periods (Mahadasha & Antardasha)
              and understand their timing and effects on your life
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Input Form */}
            <Card className="shadow-xl border-amber-500">
              <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Calculate Your Dasha Periods
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your full name"
                              data-testid="input-fullName"
                              className="h-12"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="birthDate"
                      render={() => (
                        <FormItem>
                          <FormLabel>Date of Birth</FormLabel>
                          <div className="flex gap-2">
                            <select
                              value={day}
                              onChange={(e) => {
                                setDay(e.target.value);
                                validateAndSetDate(e.target.value, month, year);
                              }}
                              className="border rounded p-2 flex-1"
                            >
                              <option value="">Day</option>
                              {[...Array(31)].map((_, i) => (
                                <option
                                  key={i + 1}
                                  value={(i + 1).toString().padStart(2, "0")}
                                >
                                  {i + 1}
                                </option>
                              ))}
                            </select>

                            <select
                              value={month}
                              onChange={(e) => {
                                setMonth(e.target.value);
                                validateAndSetDate(day, e.target.value, year);
                              }}
                              className="border rounded p-2 flex-1"
                            >
                              <option value="">Month</option>
                              {[...Array(12)].map((_, i) => (
                                <option
                                  key={i + 1}
                                  value={(i + 1).toString().padStart(2, "0")}
                                >
                                  {new Date(0, i).toLocaleString("default", {
                                    month: "long",
                                  })}
                                </option>
                              ))}
                            </select>

                            <select
                              value={year}
                              onChange={(e) => {
                                setYear(e.target.value);
                                validateAndSetDate(day, month, e.target.value);
                              }}
                              className="border rounded p-2 flex-1"
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
                          {birthDateError && (
                            <p className="text-red-500 text-sm mt-1">
                              {birthDateError}
                            </p>
                          )}
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="birthTime"
                      render={() => (
                        <FormItem>
                          <FormLabel>Time of Birth</FormLabel>
                          <div className="flex gap-2">
                            <select
                              value={hour}
                              onChange={(e) => {
                                setHour(e.target.value);
                                validateAndSetTime(
                                  e.target.value,
                                  minute,
                                  ampm,
                                );
                              }}
                              className="border rounded p-2 flex-1"
                            >
                              <option value="">HH</option>
                              {Array.from({ length: 12 }, (_, i) => (
                                <option key={i + 1} value={(i + 1).toString()}>
                                  {i + 1}
                                </option>
                              ))}
                            </select>

                            <select
                              value={minute}
                              onChange={(e) => {
                                setMinute(e.target.value);
                                validateAndSetTime(hour, e.target.value, ampm);
                              }}
                              className="border rounded p-2 flex-1"
                            >
                              <option value="">MM</option>
                              {Array.from({ length: 60 }, (_, i) => (
                                <option
                                  key={i}
                                  value={i.toString().padStart(2, "0")}
                                >
                                  {i.toString().padStart(2, "0")}
                                </option>
                              ))}
                            </select>

                            <select
                              value={ampm}
                              onChange={(e) => {
                                setAmPm(e.target.value);
                                validateAndSetTime(
                                  hour,
                                  minute,
                                  e.target.value,
                                );
                              }}
                              className="border rounded p-2 flex-1"
                            >
                              <option value="">AM/PM</option>
                              <option value="AM">AM</option>
                              <option value="PM">PM</option>
                            </select>
                          </div>
                          {birthTimeError && (
                            <p className="text-red-500 text-sm mt-1">
                              {birthTimeError}
                            </p>
                          )}
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="birthPlace"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Place of Birth</FormLabel>
                          <FormControl>
                            <LocationSearch
                              placeholder="Enter city name"
                              value={field.value}
                              data-testid="input-birthPlace"
                              onChange={(locationName) => {
                                field.onChange(locationName);
                              }}
                              onLocationSelect={(location) => {
                                console.log(
                                  "Dasha location selected:",
                                  location,
                                );

                                const locationName =
                                  location.display ||
                                  location.name ||
                                  location.place_name ||
                                  field.value;

                                field.onChange(locationName);

                                setSelectedLocation({
                                  name: locationName,
                                  latitude: location.latitude,
                                  longitude: location.longitude,
                                });
                              }}
                              className="h-12"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full h-12 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                      disabled={isLoading}
                    >
                      {isLoading ? "Calculating..." : "Calculate Dasha Periods"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Results */}
            <Card className="shadow-xl border-0" ref={resultRef}>
              <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Current Planetary Periods
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {dashaResult ? (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-800 mb-2">
                        Current Mahadasha
                      </h3>
                      <p className="text-lg font-medium text-purple-600">
                        {dashaResult.current_dasha?.lord} Mahadasha
                      </p>
                      <p className="text-sm text-gray-600">
                        Duration: {dashaResult.current_dasha?.duration_years}{" "}
                        years
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">Start Date</p>
                        <p className="font-medium">
                          {dashaResult.current_dasha?.start_date
                            ? new Date(
                                dashaResult.current_dasha.start_date,
                              ).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">End Date</p>
                        <p className="font-medium">
                          {dashaResult.current_dasha?.end_date
                            ? new Date(
                                dashaResult.current_dasha.end_date,
                              ).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>
                    </div>

                    {dashaResult.predictions &&
                      dashaResult.predictions.length > 0 && (
                        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                          <h3 className="font-semibold text-gray-800 mb-2">
                            Current Period Effects
                          </h3>
                          <ul className="list-disc list-inside space-y-1">
                            {dashaResult.predictions.map(
                              (prediction: string, index: number) => (
                                <li key={index} className="text-gray-700">
                                  {prediction}
                                </li>
                              ),
                            )}
                          </ul>
                        </div>
                      )}

                    {dashaResult.dasha_sequence &&
                      dashaResult.dasha_sequence.length > 0 && (
                        <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                          <h3 className="font-semibold text-gray-800 mb-3">
                            Complete Dasha Sequence
                          </h3>
                          <div className="space-y-2">
                            {dashaResult.dasha_sequence.map(
                              (dasha: any, index: number) => (
                                <div
                                  key={index}
                                  className={`p-2 rounded ${dasha.status === "current" ? "bg-purple-100 border border-purple-300" : dasha.status === "completed" ? "bg-gray-100" : "bg-blue-100"}`}
                                >
                                  <div className="flex justify-between items-center">
                                    <span className="font-medium">
                                      {dasha.lord} ({dasha.duration_years}y)
                                    </span>
                                    <span
                                      className={`text-xs px-2 py-1 rounded ${dasha.status === "current" ? "bg-purple-500 text-white" : dasha.status === "completed" ? "bg-gray-500 text-white" : "bg-blue-500 text-white"}`}
                                    >
                                      {dasha.status}
                                    </span>
                                  </div>
                                  <div className="text-xs text-gray-600 mt-1">
                                    {new Date(dasha.start_date).getFullYear()} -{" "}
                                    {new Date(dasha.end_date).getFullYear()}
                                  </div>
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      )}

                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-800 mb-2">
                        About Dasha Periods
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {dashaResult.description}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-500 mb-2">
                      Calculate Your Dasha
                    </h3>
                    <p className="text-gray-400">
                      Enter your birth details to see your current planetary
                      periods
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Information Section */}
          <div className="mt-12">
            <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  About Dasha System
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
                  <div>
                    <h4 className="font-semibold mb-2">What are Dashas?</h4>
                    <p className="text-sm leading-relaxed">
                      Dashas are planetary periods in Vedic astrology that show
                      which planet is most influential at any given time in your
                      life. The Vimshottari Dasha system spans 120 years.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">
                      Mahadasha vs Antardasha
                    </h4>
                    <p className="text-sm leading-relaxed">
                      Mahadasha is the main planetary period (lasting years),
                      while Antardasha is a sub-period within the Mahadasha
                      (lasting months) that modifies the main planet's
                      influence.
                    </p>
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
