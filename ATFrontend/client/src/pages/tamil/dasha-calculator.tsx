import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'wouter';
import TamilHeader from 'src/components/layout/TamilHeader';
import Footer from 'src/components/layout/Footer';
import DashaCalculator from "src/pages/dasha-calculator";

const TamilDashaCalculator = () => {
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
        <title>இலவச தசா கணிப்பு | Free Tamil Dasha Calculator Online - AstroTick</title>
        <meta name="description" content="இலவச தசா கணிப்பு - வேத ஜோதிடப்படி தசா காலங்கள் கணிப்பு. விம்சோத்தரி தசா, அந்தர் தசா காலங்கள் தமிழில். Free Tamil Dasha Calculator with authentic Vedic calculations." />
        <meta name="keywords" content="இலவச தசா கணிப்பு, free tamil dasha calculator, தமிழ் ஜோதிடம், Tamil astrology, விம்சோத்தரி தசா, ராசி பலன், horoscope Tamil, AstroTick" />
        <link rel="canonical" href={`https://astrotick.com${location}`} />
        
        {/* Open Graph */}
        <meta property="og:title" content="இலவச தசா கணிப்பு | Free Tamil Dasha Calculator - AstroTick" />
        <meta property="og:description" content="இலவச தசா கணிப்பு - வேத ஜோதிடப்படி தசா காலங்கள் கணிப்பு. விம்சோத்தரி தசா, அந்தர் தசா காலங்கள் தமிழில்." />
        <meta property="og:url" content={`https://astrotick.com${location}`} />
        <meta property="og:type" content="website" />
        
        {/* Twitter */}
        <meta name="twitter:title" content="இலவச தசா கணிப்பு | Free Tamil Dasha Calculator - AstroTick" />
        <meta name="twitter:description" content="இலவச தசா கணிப்பு - வேத ஜோதிடப்படி தசா காலங்கள் கணிப்பு தமிழில்." />
        
        <meta name="robots" content="index, follow" />
        <meta name="language" content="Tamil" />
        
        {/* Schema.org structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "இலவச தசா கணிப்பு | Free Tamil Dasha Calculator",
            "description": "வேத ஜோதிடப்படி தசா காலங்கள் கணிப்பு. விம்சோத்தரி தசா, அந்தர் தசா காலங்கள் தமிழில்",
            "url": `https://astrotick.com${location}`,
            "applicationCategory": "LifestyleApplication",
            "operatingSystem": "Web Browser",
            "inLanguage": "ta",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          })}
        </script>
      </Helmet>
      
      <TamilHeader />
      
      {/* Wrap the English component with Tamil context */}
      <div className="tamil-content">
        <DashaCalculator />
      </div>
      
      <Footer />
    </div>
  );
};

export default TamilDashaCalculator;
