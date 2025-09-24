import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'wouter';
import TamilHeader from 'src/components/layout/TamilHeader';
import Footer from 'src/components/layout/Footer';
import NakshatraFinder from "src/pages/nakshatra-finder";

const TamilNakshatraFinder = () => {
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
        <title>நட்சத்திர கண்டுபிடிப்பு | Tamil Nakshatra Finder</title>
        <meta name="description" content="உங்கள் பிறந்த நட்சத்திரம் கண்டறியவும். 27 நட்சத்திரங்களின் விவரங்கள் மற்றும் சிறப்புகள் தமிழில்." />
        <meta property="og:title" content="நட்சத்திர கண்டுபிடிப்பு | Tamil Nakshatra Finder" />
        <meta property="og:description" content="உங்கள் பிறந்த நட்சத்திரம் கண்டறியவும். 27 நட்சத்திரங்களின் விவரங்கள் மற்றும் சிறப்புகள் தமிழில்." />
        <meta property="og:url" content={`https://astrotick.com${location}`} />
        <meta name="keywords" content="தமிழ் ஜோதிடம், Tamil astrology, ராசி பலன், horoscope Tamil, AstroTick" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="Tamil" />
        <link rel="canonical" href={`https://astrotick.com${location}`} />
      </Helmet>
      
      <TamilHeader />
      
      {/* Wrap the English component with Tamil context */}
      <div className="tamil-content">
        <NakshatraFinder />
      </div>
      
      <Footer />
    </div>
  );
};

export default TamilNakshatraFinder;
