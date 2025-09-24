import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import BirthChartGenerator from "src/components/astrology/BirthChartGenerator";
import { VedicBirthChart } from "src/lib/vedic-astrology";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";
import { Helmet } from "react-helmet-async";
import { useLanguage } from "src/contexts/LanguageContext";
import DeferredSection from "src/components/DeferredSection";
import LazyImage from "src/components/LazyImage";

interface BirthData {
  name?: string;
  birthDate?: string;
  birthTime?: string;
  birthPlace?: string;
  gender?: string;
}

export default function Kundli() {
  const [generatedChart, setGeneratedChart] = useState<VedicBirthChart | null>(
    null,
  );
  const [initialBirthData, setInitialBirthData] = useState<BirthData | null>(
    null,
  );
  const { t } = useLanguage();

  const handleChartGenerated = (chart: VedicBirthChart) => {
    setGeneratedChart(chart);
  };

  // Extract birth data from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const name = urlParams.get("name");
    const date = urlParams.get("date");
    const time = urlParams.get("time");
    const location = urlParams.get("location");
    const gender = urlParams.get("gender");
    const latitude = urlParams.get("latitude");
    const longitude = urlParams.get("longitude");

    console.log("URL Parameters:", {
      name,
      date,
      time,
      location,
      gender,
      latitude,
      longitude,
    });

    if (name && date && time && location && latitude && longitude) {
      const birthData = {
        name,
        birthDate: date,
        birthTime: decodeURIComponent(time),
        birthPlace: decodeURIComponent(location),
        gender: gender || "male",
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      };

      console.log("Setting initial birth data:", birthData);
      setInitialBirthData(birthData);
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>
          {t(
            "pages.kundli.pageTitle",
            "Free Kundli Generator | Vedic Birth Chart Online - AstroTick",
          )}
        </title>
        <meta
          name="description"
          content={t(
            "pages.kundli.description",
            "Generate accurate Vedic birth chart (Kundli) online for free. Get detailed astrological analysis, planetary positions, and house interpretations using authentic calculations.",
          )}
        />
        <meta
          name="keywords"
          content="free kundli, birth chart generator, vedic horoscope, janam kundali, online birth chart, free horoscope, astrology chart, natal chart"
        />
        <link rel="canonical" href="https://astrotick.com/kundli" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />

        {/* Open Graph */}
        <meta
          property="og:title"
          content="Free Kundli Generator - Vedic Birth Chart | AstroTick"
        />
        <meta
          property="og:description"
          content="Create accurate Vedic birth charts instantly. Professional astrological analysis with detailed planetary positions and predictions."
        />
        <meta property="og:url" content="https://astrotick.com/kundli" />
        <meta property="og:type" content="website" />

        {/* Twitter */}
        <meta
          property="twitter:title"
          content="Free Kundli Generator - Vedic Birth Chart | AstroTick"
        />
        <meta
          property="twitter:description"
          content="Create accurate Vedic birth charts instantly. Professional astrological analysis with detailed planetary positions and predictions."
        />

        {/* Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Kundli Generator",
            description:
              "Free Vedic birth chart generator with detailed astrological analysis",
            url: "https://astrotick.com/kundli",
            applicationCategory: "Lifestyle",
          })}
        </script>
      </Helmet>

      <AstroTickHeader />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-orange-200 to-amber-200 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-full animate-bounce"></div>
          <div className="absolute bottom-20 left-40 w-20 h-20 bg-gradient-to-r from-amber-200 to-yellow-200 rounded-full animate-pulse"></div>
          <div className="absolute bottom-40 right-40 w-28 h-28 bg-gradient-to-r from-orange-200 to-red-200 rounded-full animate-bounce"></div>
        </div>

        <div className="container mx-auto px-4 py-4 relative z-10">
          <div className="text-center mb-6">
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-orange-200 shadow-sm">
                <span className="text-green-600 text-sm">●</span>
                <span className="text-orange-800 text-sm font-medium">
                  authentic vedic astrology calculations
                </span>
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-orange-900 mb-6 leading-tight">
              Generate Your Free
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                {" "}
                Kundli
              </span>
            </h1>
            <p className="text-xl text-orange-800 max-w-4xl mx-auto leading-relaxed">
              Create your authentic Vedic birth chart with precise planetary
              positions, Dasha periods, and astrological insights. Discover your
              cosmic blueprint with our advanced calculations.
            </p>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-8 mt-8">
              <div className="flex items-center gap-2 text-orange-700">
                <span className="text-2xl">⭐</span>
                <span className="text-sm font-medium">
                  50,000+ Charts Generated
                </span>
              </div>
              <div className="flex items-center gap-2 text-orange-700">
                <span className="text-2xl">🎯</span>
                <span className="text-sm font-medium">
                  100% Accurate Calculations
                </span>
              </div>
              <div className="flex items-center gap-2 text-orange-700">
                <span className="text-2xl">🔮</span>
                <span className="text-sm font-medium">
                  Traditional Vedic Methods
                </span>
              </div>
            </div>
          </div>

          {/* Birth Chart Generator */}
          <div className="max-w-3xl mx-auto">
            <BirthChartGenerator
              onChartGenerated={handleChartGenerated}
              initialData={initialBirthData}
            />
          </div>

          {/* Testimonials Section */}
          <div className="max-w-4xl mx-auto mt-16 mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-orange-900 mb-4">
                What Our Users Say
              </h2>
              <p className="text-orange-700">
                Join thousands of satisfied users who trust our authentic Vedic
                astrology
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  name: "Priya Sharma",
                  rating: 5,
                  text: "Amazing accuracy! The free kundli gave me such detailed insights. I immediately got the premium report and it was worth every penny.",
                  location: "Mumbai",
                },
                {
                  name: "Rajesh Kumar",
                  rating: 5,
                  text: "I've tried many astrology sites but this one is different. The calculations are authentic and the premium report helped me with my career decisions.",
                  location: "Delhi",
                },
                {
                  name: "Meera Patel",
                  rating: 5,
                  text: "The marriage compatibility analysis was spot-on. The detailed report gave us confidence in our relationship. Highly recommended!",
                  location: "Bangalore",
                },
              ].map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-white/90 backdrop-blur-sm border border-orange-200 rounded-lg p-6 shadow-md"
                >
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 text-yellow-500 fill-current"
                      />
                    ))}
                  </div>
                  <p className="text-gray-800 mb-4 italic">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {testimonial.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {testimonial.location}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
