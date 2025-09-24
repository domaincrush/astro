import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'wouter';
import TamilHeader from 'src/components/layout/TamilHeader';
import Footer from 'src/components/layout/Footer';
import CareerReport from "src/pages/reports/career-report";

const TamilCareerReport = () => {
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
        <title>தொழில் ஜோதிட அறிக்கை | Career Astrology Report in Tamil</title>
        <meta name="description" content="உங்கள் தொழில் வாழ்க்கைக்கான விரிவான ஜோதிட அறிக்கை. எந்த துறையில் வெற்றி பெறுவீர்கள் என்பதை அறியவும் தமிழில்." />
        <meta property="og:title" content="தொழில் ஜோதிட அறிக்கை | Career Astrology Report in Tamil" />
        <meta property="og:description" content="உங்கள் தொழில் வாழ்க்கைக்கான விரிவான ஜோதிட அறிக்கை. எந்த துறையில் வெற்றி பெறுவீர்கள் என்பதை அறியவும் தமிழில்." />
        <meta property="og:url" content={`https://astrotick.com${location}`} />
        <meta name="keywords" content="தமிழ் ஜோதிடம், Tamil astrology, ராசி பலன், horoscope Tamil, AstroTick" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="Tamil" />
        <link rel="canonical" href={`https://astrotick.com${location}`} />
      </Helmet>
      
      <TamilHeader />
      
      {/* Wrap the English component with Tamil context */}
      <div className="tamil-content">
        <CareerReport />
      </div>
      
      <Footer />
    </div>
  );
};

export default TamilCareerReport;
