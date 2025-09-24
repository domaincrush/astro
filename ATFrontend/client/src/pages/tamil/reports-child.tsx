import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'wouter';
import TamilHeader from 'src/components/layout/TamilHeader';
import Footer from 'src/components/layout/Footer';
import ChildReport from "src/pages/reports/child-report";

const TamilChildReport = () => {
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
        <title>குழந்தை ஜோதிட அறிக்கை | Child Astrology Report in Tamil</title>
        <meta name="description" content="குழந்தை வாழ்க்கைக்கான விரிவான ஜோதிட அறிக்கை. குழந்தையின் எதிர்காலம், கல்வி, தொழில் பற்றிய பலன்கள் தமிழில்." />
        <meta property="og:title" content="குழந்தை ஜோதிட அறிக்கை | Child Astrology Report in Tamil" />
        <meta property="og:description" content="குழந்தை வாழ்க்கைக்கான விரிவான ஜோதிட அறிக்கை. குழந்தையின் எதிர்காலம், கல்வி, தொழில் பற்றிய பலன்கள் தமிழில்." />
        <meta property="og:url" content={`https://astrotick.com${location}`} />
        <meta name="keywords" content="தமிழ் ஜோதிடம், Tamil astrology, ராசி பலன், horoscope Tamil, AstroTick" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="Tamil" />
        <link rel="canonical" href={`https://astrotick.com${location}`} />
      </Helmet>
      
      <TamilHeader />
      
      {/* Wrap the English component with Tamil context */}
      <div className="tamil-content">
        <ChildReport />
      </div>
      
      <Footer />
    </div>
  );
};

export default TamilChildReport;
