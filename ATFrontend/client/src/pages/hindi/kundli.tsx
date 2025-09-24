import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import BirthChartGenerator from "src/components/astrology/BirthChartGenerator";
import { VedicBirthChart } from "src/lib/vedic-astrology";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";
import { Helmet } from "react-helmet-async";

interface BirthData {
  name?: string;
  date?: string;
  time?: string;
  birthPlace?: string;
  gender?: string;
}

export default function HindiKundli() {
  const [generatedChart, setGeneratedChart] = useState<VedicBirthChart | null>(null);
  const [initialBirthData, setInitialBirthData] = useState<BirthData | null>(null);

  // Get initial birth data from URL params or localStorage
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const name = urlParams.get('name');
    const date = urlParams.get('date');
    const time = urlParams.get('time');
    const place = urlParams.get('place');
    const gender = urlParams.get('gender');

    if (name || date || time || place) {
      setInitialBirthData({
        name: name || '',
        date: date || '',
        time: time || '',
        birthPlace: place || '',
        gender: gender || 'male'
      });
    } else {
      // Try to get from localStorage
      const savedData = localStorage.getItem('kundli-birth-data');
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          setInitialBirthData(parsed);
        } catch (e) {
          console.log('Failed to parse saved birth data');
        }
      }
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>मुफ्त कुंडली जेनरेटर | वैदिक जन्म कुंडली - AstroTick</title>
        <meta name="description" content="मुफ्त में सटीक वैदिक जन्म कुंडली बनाएं। विस्तृत ज्योतिषीय विश्लेषण प्राप्त करें।" />
        <meta name="keywords" content="मुफ्त कुंडली, जन्म कुंडली जेनरेटर, वैदिक राशिफल, जनम कुंडली, ऑनलाइन जन्म कुंडली, मुफ्त राशिफल, ज्योतिष चार्ट, जन्म चार्ट" />
        <link rel="canonical" href="https://astrotick.com/hindi/kundli" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://astrotick.com/hindi/kundli" />
        <meta property="og:title" content="मुफ्त कुंडली जेनरेटर | वैदिक जन्म कुंडली - AstroTick" />
        <meta property="og:description" content="मुफ्त में सटीक वैदिक जन्म कुंडली बनाएं। विस्तृत ज्योतिषीय विश्लेषण प्राप्त करें।" />
        <meta property="og:image" content="https://astrotick.com/kundli-og-image.jpg" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://astrotick.com/hindi/kundli" />
        <meta property="twitter:title" content="मुफ्त कुंडली जेनरेटर | वैदिक जन्म कुंडली - AstroTick" />
        <meta property="twitter:description" content="मुफ्त में सटीक वैदिक जन्म कुंडली बनाएं। विस्तृत ज्योतिषीय विश्लेषण प्राप्त करें।" />
        <meta property="twitter:image" content="https://astrotick.com/kundli-og-image.jpg" />

        {/* Schema.org */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "मुफ्त कुंडली जेनरेटर",
            "description": "मुफ्त में सटीक वैदिक जन्म कुंडली बनाएं। विस्तृत ज्योतिषीय विश्लेषण प्राप्त करें।",
            "url": "https://astrotick.com/hindi/kundli",
            "applicationCategory": "Astrology",
            "operatingSystem": "Any",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "INR"
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-indigo-100">
        <AstroTickHeader />
        
        <div className="container mx-auto p-6 space-y-6">
          {/* Hero Section */}
          <div className="text-center space-y-4 py-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full mb-6 animate-pulse">
              <Star className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              मुफ्त कुंडली जेनरेटर
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              स्विस एफेमेरिस का उपयोग करके अपनी सटीक वैदिक जन्म कुंडली बनाएं और विस्तृत ज्योतिषीय विश्लेषण प्राप्त करें
            </p>
          </div>

          {/* Birth Chart Generator */}
          <BirthChartGenerator 
            onChartGenerated={setGeneratedChart}
            initialData={initialBirthData}
            showEnhancedFeatures={true}
          />
        </div>
        
        <Footer />
      </div>
    </>
  );
}