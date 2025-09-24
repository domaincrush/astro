import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'wouter';
import TamilHeader from 'src/components/layout/TamilHeader';
import Footer from 'src/components/layout/Footer';
import TermsOfService from "src/pages/terms-of-service";

const TamilTermsOfService = () => {
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
        <title>சேவை விதிமுறைகள் | Terms of Service Tamil</title>
        <meta name="description" content="AstroTick Tamil சேவை விதிமுறைகள். எங்கள் சேவைகளை பயன்படுத்துவதற்கான நியமங்கள் மற்றும் நிபந்தனைகள்." />
        <meta property="og:title" content="சேவை விதிமுறைகள் | Terms of Service Tamil" />
        <meta property="og:description" content="AstroTick Tamil சேவை விதிமுறைகள். எங்கள் சேவைகளை பயன்படுத்துவதற்கான நியமங்கள் மற்றும் நிபந்தனைகள்." />
        <meta property="og:url" content={`https://astrotick.com${location}`} />
        <meta name="keywords" content="தமிழ் ஜோதிடம், Tamil astrology, ராசி பலன், horoscope Tamil, AstroTick" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="Tamil" />
        <link rel="canonical" href={`https://astrotick.com${location}`} />
      </Helmet>
      
      <TamilHeader />
      
      {/* Wrap the English component with Tamil context */}
      <div className="tamil-content">
        <TermsOfService />
      </div>
      
      <Footer />
    </div>
  );
};

export default TamilTermsOfService;
