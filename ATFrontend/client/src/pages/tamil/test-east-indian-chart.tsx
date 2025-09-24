import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'wouter';
import TamilHeader from 'src/components/layout/TamilHeader';
import Footer from 'src/components/layout/Footer';

const TamilTestEastIndianChart = () => {
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
        <title>கிழக்கு இந்திய ஜாதக சோதனை | East Indian Chart Test</title>
        <meta name="description" content="கிழக்கு இந்திய ஜாதக சோதனை" />
        <meta property="og:title" content="கிழக்கு இந்திய ஜாதக சோதனை | East Indian Chart Test" />
        <meta property="og:description" content="கிழக்கு இந்திய ஜாதக சோதனை" />
        <meta property="og:url" content={`https://astrotick.com${location}`} />
        <meta name="keywords" content="தமிழ் ஜோதிடம், Tamil astrology, ராசி பலன், horoscope Tamil, AstroTick" />
        <link rel="canonical" href={`https://astrotick.com${location}`} />
      </Helmet>
      
      <TamilHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-orange-800 mb-4">
            கிழக்கு இந்திய ஜாதக சோதனை
          </h1>
          <p className="text-gray-600 text-lg">
            தமிழில் முழுமையான ஜோதிட சேவைகள்
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <p className="text-gray-700 mb-4">
              இந்த பக்கம் விரைவில் கிடைக்கும். முழுமையான தமிழ் ஜோதிட சேவைகளுக்காக காத்திருங்கள்.
            </p>
            <p className="text-sm text-gray-500">
              This page will be available soon with complete Tamil astrology services.
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default TamilTestEastIndianChart;