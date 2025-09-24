import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'wouter';
import TamilHeader from 'src/components/layout/TamilHeader';
import Footer from 'src/components/layout/Footer';
import About from "src/pages/about";

const TamilAbout = () => {
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
        <title>எங்களைப் பற்றி | About AstroTick Tamil</title>
        <meta name="description" content="AstroTick Tamil பற்றிய விவரங்கள். எங்கள் பார்வை, நோக்கம், சேவைகள் பற்றிய முழுமையான தகவல்கள்." />
        <meta property="og:title" content="எங்களைப் பற்றி | About AstroTick Tamil" />
        <meta property="og:description" content="AstroTick Tamil பற்றிய விவரங்கள். எங்கள் பார்வை, நோக்கம், சேவைகள் பற்றிய முழுமையான தகவல்கள்." />
        <meta property="og:url" content={`https://astrotick.com${location}`} />
        <meta name="keywords" content="தமிழ் ஜோதிடம், Tamil astrology, ராசி பலன், horoscope Tamil, AstroTick" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="Tamil" />
        <link rel="canonical" href={`https://astrotick.com${location}`} />
      </Helmet>
      
      <TamilHeader />
      
      {/* Wrap the English component with Tamil context */}
      <div className="tamil-content">
        <About />
      </div>
      
      <Footer />
    </div>
  );
};

export default TamilAbout;
