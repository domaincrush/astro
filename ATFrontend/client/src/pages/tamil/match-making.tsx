import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'wouter';
import TamilHeader from 'src/components/layout/TamilHeader';
import Footer from 'src/components/layout/Footer';
import MatchMaking from "src/pages/match-making";

const TamilMatchMaking = () => {
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
        <title>திருமண பொருத்தம் | Tamil Marriage Matching - Kundli Milan</title>
        <meta name="description" content="இலவச திருமண பொருத்தம் பார்த்தல். 10 பொருத்தங்கள், குண மிலன், மங்கல தோஷம் எல்லாம் தமிழில். துல்லியமான பொருத்த கணிப்பு." />
        <meta property="og:title" content="திருமண பொருத்தம் | Tamil Marriage Matching - Kundli Milan" />
        <meta property="og:description" content="இலவச திருமண பொருத்தம் பார்த்தல். 10 பொருத்தங்கள், குண மிலன், மங்கல தோஷம் எல்லாம் தமிழில். துல்லியமான பொருத்த கணிப்பு." />
        <meta property="og:url" content={`https://astrotick.com${location}`} />
        <meta name="keywords" content="தமிழ் ஜோதிடம், Tamil astrology, ராசி பலன், horoscope Tamil, AstroTick" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="Tamil" />
        <link rel="canonical" href={`https://astrotick.com${location}`} />
      </Helmet>
      
      <TamilHeader />
      
      {/* Wrap the English component with Tamil context */}
      <div className="tamil-content">
        <MatchMaking />
      </div>
      
      <Footer />
    </div>
  );
};

export default TamilMatchMaking;
