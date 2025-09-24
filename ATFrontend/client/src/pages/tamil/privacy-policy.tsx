import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'wouter';
import TamilHeader from 'src/components/layout/TamilHeader';
import Footer from 'src/components/layout/Footer';
import PrivacyPolicy from "src/pages/privacy-policy";

const TamilPrivacyPolicy = () => {
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
        <title>தனியுரிமை கொள்கை | Privacy Policy Tamil</title>
        <meta name="description" content="AstroTick Tamil தனியுரிமை கொள்கை. உங்கள் தனிப்பட்ட தகவல்களின் பாதுகாப்பு மற்றும் பயன்பாடு பற்றிய விவரங்கள்." />
        <meta property="og:title" content="தனியுரிமை கொள்கை | Privacy Policy Tamil" />
        <meta property="og:description" content="AstroTick Tamil தனியுரிமை கொள்கை. உங்கள் தனிப்பட்ட தகவல்களின் பாதுகாப்பு மற்றும் பயன்பாடு பற்றிய விவரங்கள்." />
        <meta property="og:url" content={`https://astrotick.com${location}`} />
        <meta name="keywords" content="தமிழ் ஜோதிடம், Tamil astrology, ராசி பலன், horoscope Tamil, AstroTick" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="Tamil" />
        <link rel="canonical" href={`https://astrotick.com${location}`} />
      </Helmet>
      
      <TamilHeader />
      
      {/* Wrap the English component with Tamil context */}
      <div className="tamil-content">
        <PrivacyPolicy />
      </div>
      
      <Footer />
    </div>
  );
};

export default TamilPrivacyPolicy;
