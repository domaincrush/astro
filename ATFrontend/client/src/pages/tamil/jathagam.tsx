import { useState, useEffect } from "react";
import { Star, MapPin, Calendar, Clock, User } from "lucide-react";
import { motion } from "framer-motion";
import TamilBirthChartGenerator from "src/components/astrology/TamilBirthChartGenerator";
import { VedicBirthChart } from "src/lib/vedic-astrology";
import TamilHeader from 'src/components/layout/TamilHeader';
import Footer from 'src/components/layout/Footer';
import { Helmet } from "react-helmet-async";
import { useLocation } from 'wouter';

interface BirthData {
  name?: string;
  birthDate?: string;
  birthTime?: string;
  birthPlace?: string;
  gender?: string;
}

const TamilJathagam = () => {
  const [location] = useLocation();
  const [generatedChart, setGeneratedChart] = useState<VedicBirthChart | null>(null);
  const [initialBirthData, setInitialBirthData] = useState<BirthData | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID, {
        page_path: location
      });
    }
  }, [location]);

  const handleChartGenerated = (chart: VedicBirthChart) => {
    setGeneratedChart(chart);
  };

  // Extract birth data from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const name = urlParams.get('name');
    const date = urlParams.get('date');
    const time = urlParams.get('time');
    const location = urlParams.get('location');
    const gender = urlParams.get('gender');
    const latitude = urlParams.get('latitude');
    const longitude = urlParams.get('longitude');

    if (name && date && time && location && latitude && longitude) {
      const birthData = {
        name,
        birthDate: date,
        birthTime: decodeURIComponent(time),
        birthPlace: decodeURIComponent(location),
        gender: gender || 'male',
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude)
      };
      
      setInitialBirthData(birthData);
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>இலவச ஜாதகம் | Free Tamil Kundli Online - AstroTick</title>
        <meta name="description" content="இலவசமாக தமிழில் ஜாதகம் பார்க்கவும். கிரக நிலைகள், தசா காலங்கள், யோகங்கள் அனைத்தும் தமிழில். துல்லியமான வேத ஜோதிட கணிப்புகள்." />
        <meta property="og:title" content="இலவச ஜாதகம் | Free Tamil Kundli Online - AstroTick" />
        <meta property="og:description" content="இலவசமாக தமிழில் ஜாதகம் பார்க்கவும். கிரக நிலைகள், தசா காலங்கள், யோகங்கள் அனைத்தும் தமிழில். துல்லியமான வேத ஜோதிட கணிப்புகள்." />
        <meta property="og:url" content={`https://astrotick.com${location}`} />
        <meta name="keywords" content="தமிழ் ஜாதகம், ஜாதக கட்டம், ராசி சக்கரம், கிரக நிலைகள், தசா புக்தி, வேத ஜோதிடம், Tamil kundli, horoscope" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="Tamil" />
        <link rel="canonical" href={`https://astrotick.com${location}`} />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        
        {/* Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Tamil Kundli Generator",
            "description": "Free Tamil Vedic birth chart generator with detailed astrological analysis in Tamil",
            "url": "https://astrotick.com/tamil/kundli",
            "applicationCategory": "Lifestyle",
            "inLanguage": "ta"
          })}
        </script>
      </Helmet>
      
      <TamilHeader />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-orange-200 to-amber-200 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-full animate-bounce"></div>
          <div className="absolute bottom-20 left-40 w-20 h-20 bg-gradient-to-r from-amber-200 to-yellow-200 rounded-full animate-pulse"></div>
          <div className="absolute bottom-40 right-40 w-28 h-28 bg-gradient-to-r from-orange-200 to-red-200 rounded-full animate-bounce"></div>
        </div>
        
        <div className="container mx-auto px-4 py-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-6"
          >
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-orange-200 shadow-sm">
                <span className="text-green-600 text-sm">●</span>
                <span className="text-orange-800 text-sm font-medium">உண்மையான வேத ஜோதிட கணிப்புகள்</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-orange-900 mb-6 leading-tight">
              உங்கள் இலவச
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent"> ஜாதகம்</span>
            </h1>
            <p className="text-xl text-orange-800 max-w-4xl mx-auto leading-relaxed">
              துல்லியமான கிரக நிலைகள், தசா காலங்கள் மற்றும் ஜோதிட பகுப்பாய்வுகளுடன் 
              உங்கள் உண்மையான வேத ஜாதகத்தை உருவாக்குங்கள். உங்கள் விண்மண்டல வரைபடத்தை கண்டறியுங்கள்.
            </p>
            
            {/* Trust Indicators in Tamil */}
            <div className="flex flex-wrap justify-center gap-8 mt-8">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex items-center gap-2 text-orange-700"
              >
                <span className="text-2xl">⭐</span>
                <span className="text-sm font-medium">50,000+ ஜாதகங்கள் தயாரிக்கப்பட்டுள்ளன</span>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: 0 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex items-center gap-2 text-orange-700"
              >
                <span className="text-2xl">🎯</span>
                <span className="text-sm font-medium">100% துல்லியமான கணிப்புகள்</span>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex items-center gap-2 text-orange-700"
              >
                <span className="text-2xl">🔮</span>
                <span className="text-sm font-medium">பாரம்பரிய வேத முறைகள்</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Tamil Features Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12 max-w-5xl mx-auto"
          >
            {[
              { icon: <User className="h-6 w-6" />, title: "தனிப்பட்ட விவரங்கள்", desc: "பெயர், பிறந்த தேதி மற்றும் நேரம்" },
              { icon: <MapPin className="h-6 w-6" />, title: "பிறந்த இடம்", desc: "துல்லியமான அட்சாங்சம் மற்றும் தீர்க்காங்சம்" },
              { icon: <Calendar className="h-6 w-6" />, title: "ராசி சக்கரம்", desc: "12 ராசிகளில் கிரக நிலைகள்" },
              { icon: <Clock className="h-6 w-6" />, title: "தசா புக்தி", desc: "வாழ்நாள் முழுவதும் கிரக காலங்கள்" }
            ].map((feature, index) => (
              <div key={index} className="bg-white/90 backdrop-blur-sm border border-orange-200 rounded-lg p-4 text-center shadow-md hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white mx-auto mb-3">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-orange-900 mb-1">{feature.title}</h3>
                <p className="text-sm text-orange-700">{feature.desc}</p>
              </div>
            ))}
          </motion.div>

          {/* Birth Chart Generator */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="max-w-6xl mx-auto"
          >
            <TamilBirthChartGenerator 
              onChartGenerated={handleChartGenerated} 
              initialData={initialBirthData}
            />
          </motion.div>
          
          {/* Tamil Testimonials Section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="max-w-4xl mx-auto mt-16 mb-12"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-orange-900 mb-4">எங்கள் பயனாளர்கள் கூறுவது</h2>
              <p className="text-orange-700">எங்கள் உண்மையான வேத ஜோதிடத்தை நம்பும் ஆயிரக்கணக்கான திருப்தியான பயனாளர்களுடன் சேருங்கள்</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  name: "ப்ரியா சர்மா",
                  rating: 5,
                  text: "அற்புதமான துல்லியம்! இலவச ஜாதகம் எனக்கு மிகவும் விரிவான நுண்ணறிவுகளை அளித்தது. உடனே பிரீமியம் ரிப்போர்ட் வாங்கினேன், அது ஒவ்வொரு காசுக்கும் மதிப்பு.",
                  location: "சென்னை"
                },
                {
                  name: "ராஜேஷ் குமார்",
                  rating: 5,
                  text: "நான் பல ஜோதிட தளங்களை முயற்சித்தேன் ஆனால் இது வேறுபட்டது. கணிப்புகள் உண்மையானவை மற்றும் பிரீமியம் ரிப்போர்ட் எனது தொழில் முடிவுகளுக்கு உதவியது.",
                  location: "கோயம்புத்தூர்"
                },
                {
                  name: "மீரா பட்டேல்",
                  rating: 5,
                  text: "திருமண பொருத்த பகுப்பாய்வு மிகவும் சரியாக இருந்தது. விரிவான ரிப்போர்ட் எங்கள் உறவில் நம்பிக்கையை அளித்தது. மிகவும் பரிந்துரைக்கிறேன்!",
                  location: "பெங்களூரு"
                }
              ].map((testimonial, index) => (
                <div key={index} className="bg-white/90 backdrop-blur-sm border border-orange-200 rounded-lg p-6 shadow-md">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-800 mb-4 italic">"{testimonial.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.location}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Tamil Benefits Section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="max-w-5xl mx-auto mt-16 mb-12"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-orange-900 mb-4">ஜாதகத்தின் நன்மைகள்</h2>
              <p className="text-orange-700">உங்கள் வேத ஜாதகம் உங்களுக்கு எவ்வாறு உதவும்</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "வாழ்க்கை நோக்கம்", desc: "உங்கள் வாழ்க்கையின் உண்மையான நோக்கத்தை கண்டறியுங்கள்", icon: "🎯" },
                { title: "தொழில் வழிகாட்டுதல்", desc: "சரியான தொழில் பாதையை தேர்ந்தெடுங்கள்", icon: "💼" },
                { title: "உறவுகள்", desc: "திருமணம் மற்றும் கூட்டாண்மை பொருத்தம்", icon: "💕" },
                { title: "ஆரோக்கியம்", desc: "ஆரோக்கிய பிரச்சனைகள் மற்றும் தீர்வுகள்", icon: "🏥" },
                { title: "செல்வம்", desc: "பணம் மற்றும் முதலீடு அறிவுரைகள்", icon: "💰" },
                { title: "கல்வி", desc: "படிப்பு மற்றும் அறிவு பெறுதல்", icon: "📚" },
                { title: "குடும்பம்", desc: "குடும்ப உறவுகள் மற்றும் பிள்ளைகள்", icon: "👨‍👩‍👧‍👦" },
                { title: "ஆன்மீகம்", desc: "ஆன்மீக வளர்ச்சி மற்றும் மோட்சம்", icon: "🕉️" }
              ].map((benefit, index) => (
                <div key={index} className="bg-white/90 backdrop-blur-sm border border-orange-200 rounded-lg p-4 text-center shadow-md hover:shadow-lg transition-shadow">
                  <div className="text-3xl mb-3">{benefit.icon}</div>
                  <h3 className="font-semibold text-orange-900 mb-2">{benefit.title}</h3>
                  <p className="text-sm text-orange-700">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TamilJathagam;
