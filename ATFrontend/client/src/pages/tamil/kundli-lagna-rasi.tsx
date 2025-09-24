import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'wouter';
import TamilHeader from 'src/components/layout/TamilHeader';
import Footer from 'src/components/layout/Footer';
import LagnaRasi from "src/pages/lagna-rasi";

const TamilLagnaRasi = () => {
  const [location] = useLocation();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID, {
        page_path: location
      });
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      <Helmet>
        <title>லக்ன மற்றும் ராசி | Lagna Rasi Tamil</title>
        <meta name="description" content="லக்ன மற்றும் ராசி பலன்கள்" />
        <meta property="og:title" content="லக்ன மற்றும் ராசி | Lagna Rasi Tamil" />
        <meta property="og:description" content="லக்ன மற்றும் ராசி பலன்கள்" />
        <meta property="og:url" content={`https://astrotick.com${location}`} />
        <meta name="keywords" content="தமிழ் ஜோதிடம், Tamil astrology, ராசி பலன், horoscope Tamil, AstroTick" />
        <link rel="canonical" href={`https://astrotick.com${location}`} />
      </Helmet>
      
      <TamilHeader />
      
      <div className="tamil-content">
        <LagnaRasi />
      </div>
      
      <Footer />
    </div>
  );
};

export default TamilLagnaRasi;