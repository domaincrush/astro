import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'wouter';
import TamilHeader from 'src/components/layout/TamilHeader';
import Footer from 'src/components/layout/Footer';
import AstrologyBasics from "src/pages/learn-astrology/basics";

const TamilAstrologyBasics = () => {
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
        <title>ஜோதிட அடிப்படைகள் | Learn Astrology Basics in Tamil</title>
        <meta name="description" content="ஜோதிடத்தின் அடிப்படைகளை தமிழில் கற்றுக் கொள்ளுங்கள். கிரகங்கள், ராசிகள், பாவங்கள் பற்றிய முழுமையான விளக்கம்." />
        <meta property="og:title" content="ஜோதிட அடிப்படைகள் | Learn Astrology Basics in Tamil" />
        <meta property="og:description" content="ஜோதிடத்தின் அடிப்படைகளை தமிழில் கற்றுக் கொள்ளுங்கள். கிரகங்கள், ராசிகள், பாவங்கள் பற்றிய முழுமையான விளக்கம்." />
        <meta property="og:url" content={`https://astrotick.com${location}`} />
        <meta name="keywords" content="தமிழ் ஜோதிடம், Tamil astrology, ராசி பலன், horoscope Tamil, AstroTick" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="Tamil" />
        <link rel="canonical" href={`https://astrotick.com${location}`} />
      </Helmet>
      
      <TamilHeader />
      
      {/* Wrap the English component with Tamil context */}
      <div className="tamil-content">
        <AstrologyBasics />
      </div>
      
      <Footer />
    </div>
  );
};

export default TamilAstrologyBasics;
