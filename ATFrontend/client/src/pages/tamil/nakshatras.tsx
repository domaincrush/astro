import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'wouter';
import TamilHeader from 'src/components/layout/TamilHeader';
import Footer from 'src/components/layout/Footer';
import NakshatrasGuide from "src/pages/learn-astrology/nakshatras";

const TamilNakshatrasGuide = () => {
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
        <title>27 நட்சத்திரங்கள் | Tamil Nakshatras Guide</title>
        <meta name="description" content="27 நட்சத்திரங்களின் விரிவான விவரங்கள். ஒவ்வொரு நட்சத்திரத்தின் சிறப்புகள், தெய்வம், குணங்கள் அனைத்தும் தமிழில்." />
        <meta property="og:title" content="27 நட்சத்திரங்கள் | Tamil Nakshatras Guide" />
        <meta property="og:description" content="27 நட்சத்திரங்களின் விரிவான விவரங்கள். ஒவ்வொரு நட்சத்திரத்தின் சிறப்புகள், தெய்வம், குணங்கள் அனைத்தும் தமிழில்." />
        <meta property="og:url" content={`https://astrotick.com${location}`} />
        <meta name="keywords" content="தமிழ் ஜோதிடம், Tamil astrology, ராசி பலன், horoscope Tamil, AstroTick" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="Tamil" />
        <link rel="canonical" href={`https://astrotick.com${location}`} />
      </Helmet>
      
      <TamilHeader />
      
      {/* Wrap the English component with Tamil context */}
      <div className="tamil-content">
        <NakshatrasGuide />
      </div>
      
      <Footer />
    </div>
  );
};

export default TamilNakshatrasGuide;
