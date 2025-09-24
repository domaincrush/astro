import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'wouter';
import TamilHeader from 'src/components/layout/TamilHeader';
import Footer from 'src/components/layout/Footer';
import PlanetsAndHouses from "src/pages/learn-astrology/planets";

const TamilPlanetsAndHouses = () => {
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
        <title>கிரகங்கள் மற்றும் பாவங்கள் | Tamil Planets and Houses</title>
        <meta name="description" content="9 கிரகங்கள் மற்றும் 12 பாவங்களின் விரிவான விளக்கம். ஒவ்வொரு கிரகத்தின் தாக்கம் மற்றும் பாவ பலன்கள் தமிழில்." />
        <meta property="og:title" content="கிரகங்கள் மற்றும் பாவங்கள் | Tamil Planets and Houses" />
        <meta property="og:description" content="9 கிரகங்கள் மற்றும் 12 பாவங்களின் விரிவான விளக்கம். ஒவ்வொரு கிரகத்தின் தாக்கம் மற்றும் பாவ பலன்கள் தமிழில்." />
        <meta property="og:url" content={`https://astrotick.com${location}`} />
        <meta name="keywords" content="தமிழ் ஜோதிடம், Tamil astrology, ராசி பலன், horoscope Tamil, AstroTick" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="Tamil" />
        <link rel="canonical" href={`https://astrotick.com${location}`} />
      </Helmet>
      
      <TamilHeader />
      
      {/* Wrap the English component with Tamil context */}
      <div className="tamil-content">
        <PlanetsAndHouses />
      </div>
      
      <Footer />
    </div>
  );
};

export default TamilPlanetsAndHouses;
