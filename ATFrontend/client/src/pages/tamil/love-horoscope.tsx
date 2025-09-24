import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'wouter';
import TamilHeader from 'src/components/layout/TamilHeader';
import Footer from 'src/components/layout/Footer';
import LoveHoroscope from "src/pages/love-horoscope";

const TamilLoveHoroscope = () => {
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
        <title>காதல் ராசி பலன்கள் | Tamil Love Horoscope</title>
        <meta name="description" content="காதல் வாழ்க்கைக்கான ராசி பலன்கள். காதல், திருமணம், உறவுகள் பற்றிய துல்லியமான பலன்கள் தமிழில்." />
        <meta property="og:title" content="காதல் ராசி பலன்கள் | Tamil Love Horoscope" />
        <meta property="og:description" content="காதல் வாழ்க்கைக்கான ராசி பலன்கள். காதல், திருமணம், உறவுகள் பற்றிய துல்லியமான பலன்கள் தமிழில்." />
        <meta property="og:url" content={`https://astrotick.com${location}`} />
        <meta name="keywords" content="தமிழ் ஜோதிடம், Tamil astrology, ராசி பலன், horoscope Tamil, AstroTick" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="Tamil" />
        <link rel="canonical" href={`https://astrotick.com${location}`} />
      </Helmet>
      
      <TamilHeader />
      
      {/* Wrap the English component with Tamil context */}
      <div className="tamil-content">
        <LoveHoroscope />
      </div>
      
      <Footer />
    </div>
  );
};

export default TamilLoveHoroscope;
