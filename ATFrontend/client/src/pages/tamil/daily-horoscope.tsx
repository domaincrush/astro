import { useState, useEffect } from 'react';
import { tamilZodiacMapping } from 'src/data/tamil-zodiac-mapping';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import TamilHeader from 'src/components/layout/TamilHeader';
import Footer from 'src/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from 'src/components/ui/card';
import { Button } from 'src/components/ui/button';
import { Badge } from 'src/components/ui/badge';
import { 
  Star, Calendar, TrendingUp, Heart, Briefcase, 
  DollarSign, Activity, Crown, MessageCircle, ArrowRight
} from 'lucide-react';

// Tamil Zodiac Signs with predictions
const tamilZodiacSigns = [
  { 
    english: 'aries', 
    tamil: 'மேஷம்', 
    transliteration: 'Mesham',
    dates: 'மார்ச் 21 - ஏப்ரல் 19',
    color: 'from-red-500 to-orange-500',
    element: 'நெருப்பு',
    icon: '♈',
    prediction: 'இன்று உங்களுக்கு நல்ல நாள். வேலையில் புதிய வாய்ப்புகள் கிடைக்கும். காதல் விஷயங்களில் சாதகமான செய்திகள் உண்டு. நண்பர்கள் மூலம் நன்மை கிடைக்கும்.'
  },
  { 
    english: 'taurus', 
    tamil: 'ரிஷபம்', 
    transliteration: 'Rishabam',
    dates: 'ஏப்ரல் 20 - மே 20',
    color: 'from-green-500 to-emerald-500',
    element: 'பூமி',
    icon: '♉',
    prediction: 'பணம் மற்றும் சொத்து விஷயங்களில் லாபம் கிடைக்கும். குடும்பத்தில் மகிழ்ச்சியான சூழல் நிலவும். ஆரோக்கியம் நன்றாக இருக்கும். புதிய முதலீடுகள் சாதகம்.'
  },
  { 
    english: 'gemini', 
    tamil: 'மிதுனம்', 
    transliteration: 'Mithunam',
    dates: 'மே 21 - ஜூன் 20',
    color: 'from-yellow-500 to-amber-500',
    element: 'காற்று',
    icon: '♊',
    prediction: 'தொடர்பு மற்றும் பயணங்களில் நன்மை உண்டு. புதிய நட்பு கிடைக்கும். படிப்பு மற்றும் போட்டித் தேர்வுகளில் வெற்றி. தகவல் தொழில்நுட்பத்தில் முன்னேற்றம்.'
  },
  { 
    english: 'cancer', 
    tamil: 'கடகம்', 
    transliteration: 'Kadagam',
    dates: 'ஜூன் 21 - ஜூலை 22',
    color: 'from-blue-500 to-cyan-500',
    element: 'நீர்',
    icon: '♋',
    prediction: 'குடும்ப விஷயங்களில் மகிழ்ச்சி. தாய் வழி நன்மைகள் கிடைக்கும். வீடு, கார் போன்ற சொத்து வாங்கும் யோகம். உணவு தொழிலில் லாபம்.'
  },
  { 
    english: 'leo', 
    tamil: 'சிம்மம்', 
    transliteration: 'Simmam',
    dates: 'ஜூலை 23 - ஆகஸ்ட் 22',
    color: 'from-orange-500 to-red-500',
    element: 'நெருப்பு',
    icon: '♌',
    prediction: 'அரசு வேலை மற்றும் பதவி உயர்வு கிடைக்கும். கலை, கலாச்சார துறையில் சாதனை. குழந்தைகள் மூலம் மகிழ்ச்சி. தலைமைப் பண்புகள் வெளிப்படும்.'
  },
  { 
    english: 'virgo', 
    tamil: 'கன்னி', 
    transliteration: 'Kanni',
    dates: 'ஆகஸ்ட் 23 - செப்டம்பர் 22',
    color: 'from-green-500 to-teal-500',
    element: 'பூமி',
    icon: '♍',
    prediction: 'வேலையில் கூடுதல் பொறுப்புகள் கிடைக்கும். ஆரோக்கியம் சிறப்பாக இருக்கும். பங்காளிகள் மூலம் நன்மை. விவசாயத்தில் லாபம்.'
  },
  { 
    english: 'libra', 
    tamil: 'துலாம்', 
    transliteration: 'Thulam',
    dates: 'செப்டம்பர் 23 - அக்டோபர் 22',
    color: 'from-pink-500 to-rose-500',
    element: 'காற்று',
    icon: '♎',
    prediction: 'திருமண யோகம் உள்ளவர்களுக்கு நல்ல செய்தி. அழகு, ஆடை, ஆபரணங்களில் ஆர்வம் அதிகரிக்கும். கலை துறையில் வெற்றி. நீதிமன்ற வழக்குகளில் சாதகம்.'
  },
  { 
    english: 'scorpio', 
    tamil: 'விருச்சிகம்', 
    transliteration: 'Viruchigam',
    dates: 'அக்டோபர் 23 - நவம்பர் 21',
    color: 'from-purple-500 to-indigo-500',
    element: 'நீர்',
    icon: '♏',
    prediction: 'மறைவான பணம் கிடைக்கும். ஆன்மீக விஷயங்களில் ஆர்வம். ரகசிய எதிரிகளில் இருந்து விடுதலை. ஆராய்ச்சி துறையில் வெற்றி.'
  },
  { 
    english: 'sagittarius', 
    tamil: 'தனுசு', 
    transliteration: 'Dhanusu',
    dates: 'நவம்பர் 22 - டிசம்பர் 21',
    color: 'from-blue-500 to-purple-500',
    element: 'நெருப்பு',
    icon: '♐',
    prediction: 'படிப்பு, ஆசிரியர் பணி, வழக்கு விஷயங்களில் வெற்றி. பயணம் மூலம் லாபம். தர்ம காரியங்களில் ஈடுபாடு. வெளிநாட்டு தொடர்பு சாதகம்.'
  },
  { 
    english: 'capricorn', 
    tamil: 'மகரம்', 
    transliteration: 'Magaram',
    dates: 'டிசம்பர் 22 - ஜனவரி 19',
    color: 'from-gray-500 to-slate-500',
    element: 'பூமி',
    icon: '♑',
    prediction: 'கடின உழைப்பின் பலன் கிடைக்கும். வேலையில் நிலைத்த வெற்றி. பழைய கடன்கள் அடைக்கும் வாய்ப்பு. மூத்தோர் ஆசி கிடைக்கும்.'
  },
  { 
    english: 'aquarius', 
    tamil: 'கும்பம்', 
    transliteration: 'Kumbam',
    dates: 'ஜனவரி 20 - பிப்ரவரி 18',
    color: 'from-cyan-500 to-blue-500',
    element: 'காற்று',
    icon: '♒',
    prediction: 'நண்பர்கள் மூலம் நன்மை. குழு வேலைகளில் வெற்றி. தொழில்நுட்ப துறையில் முன்னேற்றம். லாட்டரி, சூதாட்டத்தில் அதிர்ஷ்டம். புதுமையான ஐடியாக்கள் வெற்றி.'
  },
  { 
    english: 'pisces', 
    tamil: 'மீனம்', 
    transliteration: 'Meenam',
    dates: 'பிப்ரவரி 19 - மார்ச் 20',
    color: 'from-teal-500 to-green-500',
    element: 'நீர்',
    icon: '♓',
    prediction: 'ஆன்மீக முன்னேற்றம். கலை, இசை, எழுத்து துறையில் சாதனை. நீர் சம்பந்தப்பட்ட தொழில்களில் லாபம். கனவுகள் நனவாகும்.'
  }
];

const TamilDailyHoroscope = () => {
  const [, setLocation] = useLocation();

  // Get current Tamil date
  const getCurrentTamilDate = () => {
    const date = new Date();
    const days = ['ஞாயிறு', 'திங்கள்', 'செவ்வாய்', 'புதன்', 'வியாழன்', 'வெள்ளி', 'சனி'];
    const months = ['ஜனவரி', 'பிப்ரவரி', 'மார்ச்', 'ஏப்ரல்', 'மே', 'ஜூன்', 
                   'ஜூலை', 'ஆகஸ்ட்', 'செப்டம்பர்', 'அக்டோபர்', 'நவம்பர்', 'டிசம்பர்'];
    
    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      <Helmet>
        <title>இன்றைய ராசி பலன்கள் | Tamil Daily Horoscope - AstroTick</title>
        <meta name="description" content="12 ராசிகளுக்கான இன்றைய பலன்கள். காதல், வேலை, பணம், ஆரோக்கியம் பற்றிய துல்லியமான தமிழ் ஜோதிட பலன்கள். AstroTick Tamil." />
        <meta property="og:title" content="இன்றைய ராசி பலன்கள் | Tamil Daily Horoscope - AstroTick" />
        <meta property="og:description" content="12 ராசிகளுக்கான இன்றைய பலன்கள். காதல், வேலை, பணம், ஆரோக்கியம் பற்றிய துல்லியமான தமிழ் ஜோதிட பலன்கள்." />
        <meta name="keywords" content="இன்றைய ராசி பலன், தமிழ் ஜோதிடம், Tamil horoscope, daily horoscope Tamil, ராசி கணிப்பு, AstroTick Tamil" />
        <link rel="canonical" href="https://astrotick.com/tamil/daily-horoscope" />
        <meta property="og:url" content="https://astrotick.com/tamil/daily-horoscope" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="ta_IN" />
      </Helmet>
      <TamilHeader />
      
      {/* Tamil Daily Horoscope Content */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 text-sm font-medium mb-4">
              <Calendar className="h-4 w-4 mr-2" />
              {getCurrentTamilDate()}
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent leading-tight">
              இன்றைய ராசி பலன்கள்
            </h1>
            
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
              உங்கள் ராசிக்கான இன்றைய நட்சத்திர கணிப்புகளை கண்டறியுங்கள். 
              வேத ஜோதிடத்தின் அடிப்படையில் தயாரிக்கப்பட்ட துல்லியமான பலன்கள்.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tamil Zodiac Signs Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tamilZodiacSigns.map((sign, index) => (
              <motion.div
                key={sign.english}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group cursor-pointer"
                onClick={() => setLocation(`/tamil/daily-horoscope/${tamilZodiacMapping[sign.english as keyof typeof tamilZodiacMapping]}`)}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-orange-100 hover:border-orange-200 overflow-hidden">
                  <CardHeader className={`bg-gradient-to-r ${sign.color} text-white text-center p-6`}>
                    <div className="text-4xl mb-2">{sign.icon}</div>
                    <CardTitle className="text-2xl font-bold mb-2">{sign.tamil}</CardTitle>
                    <p className="text-orange-100 text-sm">{sign.transliteration}</p>
                    <p className="text-orange-100 text-xs mt-1">{sign.dates}</p>
                    <Badge className="bg-white/20 text-white mt-2">
                      {sign.element} அம்சம்
                    </Badge>
                  </CardHeader>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-slate-800 mb-3">
                      இன்றைய பலன்
                    </h3>
                    <p className="text-slate-600 mb-4 line-clamp-4">
                      {sign.prediction}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Heart className="h-4 w-4 text-pink-500" />
                        <span className="text-slate-600">காதல்: நல்லது</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Briefcase className="h-4 w-4 text-blue-500" />
                        <span className="text-slate-600">வேலை: சிறப்பு</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="h-4 w-4 text-green-500" />
                        <span className="text-slate-600">பணம்: லாபம்</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Activity className="h-4 w-4 text-orange-500" />
                        <span className="text-slate-600">ஆரோக்கியம்: வலிமை</span>
                      </div>
                    </div>

                    <Button 
                      className={`w-full bg-gradient-to-r ${sign.color} hover:opacity-90 text-white group-hover:scale-105 transition-transform`}
                    >
                      முழு பலன் பார்க்கவும்
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tamil Call to Action */}
      <section className="py-16 px-4 bg-gradient-to-r from-orange-500 to-red-500">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              மேலும் துல்லியமான பலன்களுக்கு
            </h2>
            <p className="text-xl text-orange-100 mb-8">
              அனுபவமிக்க தமிழ் ஜோதிடர்களுடன் நேரடியாக பேசி உங்கள் எதிர்காலத்தை அறியுங்கள்
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-orange-600 hover:bg-orange-50 px-8 py-3"
                onClick={() => setLocation('/tamil/astrologers')}
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                ஜோதிடருடன் பேசுங்கள்
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-orange-600 px-8 py-3"
                onClick={() => setLocation('/tamil/kundli')}
              >
                <Star className="h-5 w-5 mr-2" />
                இலவச ஜாதகம்
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TamilDailyHoroscope;