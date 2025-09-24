import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'wouter';
import TamilHeader from 'src/components/layout/TamilHeader';
import Footer from 'src/components/layout/Footer';
import YearlyHoroscope from "src/pages/yearly-horoscope";

const TamilYearlyHoroscope = () => {
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
        <title>ஆண்டு ராசி பலன்கள் தமிழில் | Yearly Horoscope in Tamil</title>
        <meta name="description" content="2025 ஆம் ஆண்டு 12 ராசிகளுக்கான விரிவான பலன்கள். முழு ஆண்டின் ஜோதிட பலன்கள் மற்றும் பரிகாரங்கள் தமிழில்." />
        <meta property="og:title" content="ஆண்டு ராசி பலன்கள் தமிழில் | Yearly Horoscope in Tamil" />
        <meta property="og:description" content="2025 ஆம் ஆண்டு 12 ராசிகளுக்கான விரிவான பலன்கள். முழு ஆண்டின் ஜோதிட பலன்கள் மற்றும் பரிகாரங்கள் தமிழில்." />
        <meta property="og:url" content={`https://astrotick.com${location}`} />
        <meta name="keywords" content="தமிழ் ஜோதிடம், Tamil astrology, ராசி பலன், horoscope Tamil, AstroTick" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="Tamil" />
        <link rel="canonical" href={`https://astrotick.com${location}`} />
      </Helmet>
      
      <TamilHeader />
      
      {/* Wrap the English component with Tamil context */}
      <div className="tamil-content">
        <YearlyHoroscope />
      </div>
      
      <Footer />
    </div>
  );
};

export default TamilYearlyHoroscope;
