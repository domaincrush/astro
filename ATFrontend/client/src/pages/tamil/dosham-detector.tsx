import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'wouter';
import TamilHeader from 'src/components/layout/TamilHeader';
import Footer from 'src/components/layout/Footer';
import DoshamDetector from "src/pages/dosham-detector";

const TamilDoshamDetector = () => {
  const [location] = useLocation();

  useEffect(() => {
    // Track page view for analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID, {
        page_path: location
      });
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      <Helmet>
        <title>தோஷம் கண்டறிதல் | Tamil Dosham Detector</title>
        <meta name="description" content="மங்கள தோஷம், கால சர்ப்ப தோஷம், பித்ரு தோஷம் போன்ற தோஷங்கள் கண்டறியவும். பரிகாரங்களும் தமிழில்." />
        <meta property="og:title" content="தோஷம் கண்டறிதல் | Tamil Dosham Detector" />
        <meta property="og:description" content="மங்கள தோஷம், கால சர்ப்ப தோஷம், பித்ரு தோஷம் போன்ற தோஷங்கள் கண்டறியவும். பரிகாரங்களும் தமிழில்." />
        <meta property="og:url" content={`https://astrotick.com${location}`} />
        <meta name="keywords" content="தமிழ் ஜோதிடம், Tamil astrology, ராசி பலன், horoscope Tamil, AstroTick" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="Tamil" />
        <link rel="canonical" href={`https://astrotick.com${location}`} />
      </Helmet>
      
      <TamilHeader />
      
      {/* Wrap the English component with Tamil context */}
      <div className="tamil-content">
        <DoshamDetector />
      </div>
      
      <Footer />
    </div>
  );
};

export default TamilDoshamDetector;
