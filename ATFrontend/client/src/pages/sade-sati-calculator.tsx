import { Helmet } from "react-helmet-async";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";
import SadeSatiCalculator from "src/components/SadeSatiCalculator";

export default function SadeSatiCalculatorPage() {
  return (
    <>
      <Helmet>
        <title>Free Sade Sati Calculator | Authentic Vedic Saturn Transit Analysis - AstroTick</title>
        <meta name="description" content="Free Sade Sati Calculator - Calculate your current Sade Sati phase with authentic Vedic algorithms. Get personalized Saturn transit analysis, remedies, and timing using Swiss Ephemeris data." />
        <meta name="keywords" content="free Sade Sati calculator, free Saturn transit calculator, Shani Sade Sati, free Vedic astrology calculator, Saturn phase calculator, authentic Sade Sati" />
        <link rel="canonical" href="https://astrotick.com/sade-sati-calculator" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Free Sade Sati Calculator - AstroTick" />
        <meta property="og:description" content="Free Sade Sati Calculator - Calculate your current Sade Sati phase with authentic Vedic algorithms and Swiss Ephemeris data." />
        <meta property="og:url" content="https://astrotick.com/sade-sati-calculator" />
        <meta property="og:type" content="website" />
        
        {/* Twitter */}
        <meta name="twitter:title" content="Free Sade Sati Calculator - AstroTick" />
        <meta name="twitter:description" content="Free Sade Sati Calculator - Calculate your current Sade Sati phase with authentic Vedic algorithms and Swiss Ephemeris data." />
        
        {/* Schema.org structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Free Sade Sati Calculator",
            "description": "Free authentic Vedic Sade Sati phase calculator using Swiss Ephemeris data",
            "url": "https://astrotick.com/sade-sati-calculator",
            "applicationCategory": "LifestyleApplication",
            "operatingSystem": "Web Browser",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <AstroTickHeader />
        
        <div className="container mx-auto px-4 py-8 pt-24">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Sade Sati <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Calculator</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Discover your current Saturn transit phase with authentic Vedic calculations. 
              Get personalized insights, timing, and remedies based on your birth chart.
            </p>
          </div>

          <SadeSatiCalculator />

          {/* Educational Content */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Understanding Your Sade Sati Results</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Phase Meanings</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li><strong>Rising Phase:</strong> Spiritual growth, release of old patterns</li>
                    <li><strong>Peak Phase:</strong> Maximum intensity, health and identity focus</li>
                    <li><strong>Setting Phase:</strong> Financial restructuring, family integration</li>
                    <li><strong>Small Panoti:</strong> Focused challenges in specific life areas</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Intensity Levels</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li><strong>Low:</strong> Gentle guidance and minor adjustments</li>
                    <li><strong>Moderate:</strong> Noticeable changes requiring attention</li>
                    <li><strong>High:</strong> Significant life transformations</li>
                    <li><strong>Maximum:</strong> Intensive character building period</li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">About Our Calculations</h3>
                <p className="text-blue-700 leading-relaxed">
                  Our Sade Sati calculator uses authentic Vedic algorithmic principles combined with Swiss Ephemeris 
                  astronomical data for maximum accuracy. The calculations include Ashtakavarga analysis, current 
                  Saturn position, and personalized recommendations based on your Moon sign and birth chart specifics.
                </p>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}