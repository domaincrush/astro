import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import TamilHeader from 'src/components/layout/TamilHeader';
import Footer from 'src/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from 'src/components/ui/card';
import { Button } from 'src/components/ui/button';
import { Badge } from 'src/components/ui/badge';
import { Calendar, Star, Heart, Briefcase, DollarSign, Activity, ArrowRight } from 'lucide-react';
import { tamilZodiacMapping } from 'src/data/tamil-zodiac-mapping';

// Tamil Weekly Zodiac Signs with predictions
const tamilWeeklyZodiacSigns = [
  { 
    english: 'aries', 
    tamil: 'மேஷம்', 
    transliteration: 'Mesham',
    dates: 'மார்ச் 21 - ஏப்ரல் 19',
    color: 'from-red-500 to-orange-500',
    element: 'நெருப்பு',
    icon: '♈',
    ruling_planet: 'செவ்வாய்',
    weekly_prediction: 'இந்த வாரம் உங்களுக்கு புதிய வாய்ப்புகள் காத்திருக்கின்றன. தொழில் அல்லது வியாபாரத்தில் முன்னேற்றம் இருக்கும். அவசர முடிவுகள் எடுப்பதை தவிர்க்கவும்.',
    love_weekly: 'காதல் வாழ்க்கையில் புரிதல் அதிகரிக்கும். திருமணமானவர்களுக்கு மகிழ்ச்சியான தருணங்கள்.',
    career_weekly: 'வேலையில் முக்கியமான திட்டங்கள் முடிவடையும். புதிய பொறுப்புகள் கிடைக்கலாம்.',
    health_weekly: 'ஆரோக்கியம் நல்ல நிலையில் இருக்கும். உடற்பயிற்சி தொடருங்கள்.',
    finance_weekly: 'வருமானம் அதிகரிக்கும். முதலீடுகளில் லாபம் பார்க்கலாம்.'
  },
  { 
    english: 'taurus', 
    tamil: 'ரிஷபம்', 
    transliteration: 'Rishabam',
    dates: 'ஏப்ரல் 20 - மே 20',
    color: 'from-green-500 to-teal-500',
    element: 'பூமி',
    icon: '♉',
    ruling_planet: 'சுக்கிரன்',
    weekly_prediction: 'பொறுமையுடன் செயல்படுங்கள். குடும்ப விஷயங்களில் முக்கியமான முடிவுகள் எடுக்க நேரிடும். பணம் சம்பந்தப்பட்ட விஷயங்களில் கவனம் தேவை.',
    love_weekly: 'உறவுகளில் நிலைத்த தன்மை வரும். குடும்பத்தாருடன் அதிக நேரம் செலவிடுங்கள்.',
    career_weekly: 'கடின உழைப்பின் பலன் கிடைக்கும். ஸ்திரமான முன்னேற்றம் எதிர்பார்க்கலாம்.',
    health_weekly: 'தொண்டை, கழுத்து பகுதியில் கவனம் தேவை. ஓய்வு எடுக்கவும்.',
    finance_weekly: 'நிலையான வருமானம். பெரிய செலவுகளை தள்ளிப்போடுங்கள்.'
  },
  { 
    english: 'gemini', 
    tamil: 'மிதுனம்', 
    transliteration: 'Mithunam',
    dates: 'மே 21 - ஜூன் 20',
    color: 'from-yellow-500 to-orange-500',
    element: 'காற்று',
    icon: '♊',
    ruling_planet: 'புதன்',
    weekly_prediction: 'தொடர்பு மற்றும் பயணங்கள் வாரம். புதிய நபர்களுடன் அறிமுகம். கல்வி சம்பந்தப்பட்ட விஷயங்களில் வெற்றி.',
    love_weekly: 'காதலில் பல நபர்களுடன் பேச்சு வார்த்தை. தெளிவான முடிவு எடுக்கவும்.',
    career_weekly: 'தொடர்பு சார்ந்த வேலைகளில் முன்னேற்றம். எழுத்து, ஊடகம் துறையில் வாய்ப்புகள்.',
    health_weekly: 'கை, தோள்பட்டை பகுதியில் கவனம். மனஅழுத்தம் குறைக்கவும்.',
    finance_weekly: 'பல வழிகளிலிருந்து வருமானம். குறுகிய கால முதலீடுகளில் லாபம்.'
  },
  { 
    english: 'cancer', 
    tamil: 'கடகம்', 
    transliteration: 'Kadagam',
    dates: 'ஜூன் 21 - ஜூலை 22',
    color: 'from-blue-500 to-purple-500',
    element: 'நீர்',
    icon: '♋',
    ruling_planet: 'சந்திரன்',
    weekly_prediction: 'குடும்பம் மற்றும் வீடு சம்பந்தப்பட்ட விஷயங்களில் மாற்றங்கள். உணர்ச்சிகளை கட்டுப்படுத்துங்கள். தாயாருடன் நல்ல நேரம்.',
    love_weekly: 'குடும்ப ஒப்புதலுடன் காதல் முன்னேறும். வீட்டில் மகிழ்ச்சியான சூழல்.',
    career_weekly: 'ரியல் எஸ்டேட், உணவு துறையில் வாய்ப்புகள். பெண்களிடமிருந்து உதவி.',
    health_weekly: 'வயிறு, ஜீரண சக்தி சம்பந்தப்பட்ட பிரச்சனைகள் கவனம். நீர் அதிகம் அருந்தவும்.',
    finance_weekly: 'சேமிப்பு அதிகரிக்கும். குடும்ப செலவுகள் அதிகரிக்கலாம்.'
  },
  { 
    english: 'leo', 
    tamil: 'சிம்மம்', 
    transliteration: 'Simmam',
    dates: 'ஜூலை 23 - ஆகஸ்ட் 22',
    color: 'from-orange-500 to-red-500',
    element: 'நெருப்பு',
    icon: '♌',
    ruling_planet: 'சூரியன்',
    weekly_prediction: 'தலைமைத்துவம் மற்றும் பிரபலம் அதிகரிக்கும். ஆக்கப்பூர்வமான வேலைகளில் வெற்றி. சமூக நிகழ்வுகளில் பங்கேற்பு.',
    love_weekly: 'காதலில் ரோமான்டிக் தருணங்கள். பொது இடங்களில் காதலர்களுடன் நேரம்.',
    career_weekly: 'தலைமை பொறுப்புகள் கிடைக்கும். கலை, பொழுதுபோக்கு துறையில் வாய்ப்புகள்.',
    health_weekly: 'இதயம், முதுகு பகுதியில் கவனம். அதிக வேலைப்பளு தவிர்க்கவும்.',
    finance_weekly: 'பிரமுகர்களிடமிருந்து நிதி உதவி. ஆடம்பர செலவுகள் கட்டுப்படுத்தவும்.'
  },
  { 
    english: 'virgo', 
    tamil: 'கன்னி', 
    transliteration: 'Kanni',
    dates: 'ஆகஸ்ட் 23 - செப்டம்பர் 22',
    color: 'from-green-600 to-blue-500',
    element: 'பூமி',
    icon: '♍',
    ruling_planet: 'புதன்',
    weekly_prediction: 'விவரங்களில் கவனம் செலுத்துங்கள். ஆரோக்கியம் மற்றும் சேவை சார்ந்த வேலைகளில் முன்னேற்றம். முறையான அணுகுமுறை வெற்றி தரும்.',
    love_weekly: 'உறவுகளில் நடைமுறை அணுகுமுறை. சிறிய சிறிய கவனிப்புகள் பலன் தரும்.',
    career_weekly: 'நுணுக்கமான வேலைகளில் வெற்றி. ஆரோக்கியம், தொழில்நுட்பம் துறையில் வாய்ப்புகள்.',
    health_weekly: 'ஜீரண பிரச்சனைகள் கவனம். உணவு முறையில் மாற்றம் செய்யுங்கள்.',
    finance_weekly: 'சிறு சிறு சேமிப்புகள் பெரிய தொகையாகும். முதலீடுகளை மறுபரிசீலனை செய்யுங்கள்.'
  },
  { 
    english: 'libra', 
    tamil: 'துலாம்', 
    transliteration: 'Thulam',
    dates: 'செப்டம்பர் 23 - அக்டோபர் 22',
    color: 'from-pink-500 to-rose-500',
    element: 'காற்று',
    icon: '♎',
    ruling_planet: 'சுக்கிரன்',
    weekly_prediction: 'சமநிலை மற்றும் நீதி விஷயங்களில் சிறப்பு. கலை, அழகு துறையில் வெற்றி. பார்ட்னர்ஷிப் விஷயங்கள் சாதகம்.',
    love_weekly: 'திருமண யோகம் வலுப்படும். அழகான உறவுகள் தொடங்கும்.',
    career_weekly: 'கூட்டுறவு திட்டங்களில் வெற்றி. சட்டம், கலை துறையில் முன்னேற்றம்.',
    health_weekly: 'சிறுநீரகம், இடுப்பு பகுதியில் கவனம். சர்க்கரை அளவு பார்க்கவும்.',
    finance_weekly: 'பங்காளியுடன் சேர்ந்து முதலீடுகள். அழகு சாதனங்களில் செலவு.'
  },
  { 
    english: 'scorpio', 
    tamil: 'விருச்சிகம்', 
    transliteration: 'Viruchigam',
    dates: 'அக்டோபர் 23 - நவம்பர் 21',
    color: 'from-purple-500 to-indigo-500',
    element: 'நீர்',
    icon: '♏',
    ruling_planet: 'செவ்வாய்',
    weekly_prediction: 'மறைவான விஷயங்கள் வெளிவரும். ஆழ்ந்த ஆராய்ச்சி மற்றும் படிப்பில் ஆர்வம். மாற்றங்களுக்கு தயாராகுங்கள்.',
    love_weekly: 'ரகசிய காதல் வெளிப்படும். ஆழ்ந்த உணர்வுபூர்வமான தொடர்புகள்.',
    career_weekly: 'ஆராய்ச்சி, புலனாய்வு துறையில் வெற்றி. மறைவான பணம் கிடைக்கும்.',
    health_weekly: 'இனப்பெருக்க உறுப்புகளில் கவனம். மன அழுத்தம் குறைக்கவும்.',
    finance_weekly: 'பிறரின் பணம், காப்பீடு, வரி திரும்பக் கிடைக்கும்.'
  },
  { 
    english: 'sagittarius', 
    tamil: 'தனுசு', 
    transliteration: 'Dhanusu',
    dates: 'நவம்பர் 22 - டிசம்பர் 21',
    color: 'from-blue-500 to-purple-500',
    element: 'நெருப்பு',
    icon: '♐',
    ruling_planet: 'குரு',
    weekly_prediction: 'அறிவு, படிப்பு, பயணம் சம்பந்தப்பட்ட வாரம். உயர் கல்வி மற்றும் ஆன்மீக விஷயங்களில் ஆர்வம் அதிகரிக்கும்.',
    love_weekly: 'தூர தேசத்து காதல். வெளிநாட்டவர்களுடன் தொடர்பு.',
    career_weekly: 'கல்வி, வெளிநாட்டு தொடர்பு, வெளியிடுதல் துறையில் வெற்றி.',
    health_weekly: 'தொடை, இடுப்பு பகுதியில் கவனம். அதிக பயணம் தவிர்க்கவும்.',
    finance_weekly: 'வெளிநாட்டிலிருந்து பணம். படிப்பு, பயணம் செலவுகள் அதிகரிக்கும்.'
  },
  { 
    english: 'capricorn', 
    tamil: 'மகரம்', 
    transliteration: 'Magaram',
    dates: 'டிசம்பர் 22 - ஜனவரி 19',
    color: 'from-gray-500 to-slate-500',
    element: 'பூமி',
    icon: '♑',
    ruling_planet: 'சனி',
    weekly_prediction: 'கடின உழைப்பின் பலன் கிடைக்கும். நிர்வாகம் மற்றும் அதிகாரம் சம்பந்தப்பட்ட விஷயங்களில் முன்னேற்றம்.',
    love_weekly: 'பாரம்பரிய முறையில் உறவுகள். வயதானவர்களின் ஆசீர்வாதம்.',
    career_weekly: 'மேலாளர் பொறுப்புகள் கிடைக்கும். அரசு தொடர்பு வேலைகளில் வாய்ப்பு.',
    health_weekly: 'முழங்கால், எலும்புகளில் கவனம். மூட்டு வலி தடுக்கவும்.',
    finance_weekly: 'நீண்ட கால முதலீடுகளில் லாபம். மெதுவான ஆனால் நிலையான வருமானம்.'
  },
  { 
    english: 'aquarius', 
    tamil: 'கும்பம்', 
    transliteration: 'Kumbam',
    dates: 'ஜனவரி 20 - பிப்ரவரி 18',
    color: 'from-cyan-500 to-blue-500',
    element: 'காற்று',
    icon: '♒',
    ruling_planet: 'சனி',
    weekly_prediction: 'நண்பர்கள் மற்றும் சமூக வலைப்பின்னல் மூலம் நன்மைகள். தொழில்நுட்பம் மற்றும் புதுமையான ஐடியாக்களில் வெற்றி.',
    love_weekly: 'நண்பர்களிடமிருந்து காதல். குழு நிகழ்வுகளில் அறிமுகம்.',
    career_weekly: 'தொழில்நுட்பம், சமூக வேலை துறையில் வாய்ப்புகள். நவீன முறைகளில் வெற்றி.',
    health_weekly: 'கணுக்கால், நரம்பு மண்டலத்தில் கவனம். ரத்த ஓட்டம் சிறப்பாக வைக்கவும்.',
    finance_weekly: 'குழு முதலீடுகளில் லாபம். தொழில்நுட்ப பங்குகளில் வெற்றி.'
  },
  { 
    english: 'pisces', 
    tamil: 'மீனம்', 
    transliteration: 'Meenam',
    dates: 'பிப்ரவரி 19 - மார்ச் 20',
    color: 'from-teal-500 to-green-500',
    element: 'நீர்',
    icon: '♓',
    ruling_planet: 'குரு',
    weekly_prediction: 'ஆன்மீக முன்னேற்றம் மற்றும் கனவுகள் நனவாகும் வாரம். கலை, இசை, எழுத்து துறையில் ஆர்வம் அதிகரிக்கும்.',
    love_weekly: 'ரொமான்டிக் மற்றும் கனவு நிறைந்த காதல். ஆன்மீக தொடர்பு.',
    career_weekly: 'கலை, இசை, வேதம் சம்பந்தப்பட்ட வேலைகளில் வெற்றி.',
    health_weekly: 'கால், கணுக்கால் பகுதியில் கவனம். தண்ணீர் அதிகம் குடிக்கவும்.',
    finance_weekly: 'ஆன்மீக, தானம் செலவுகள் அதிகரிக்கும். நீர் சம்பந்தப்பட்ட முதலீடுகளில் லாபம்.'
  }
];

const TamilWeeklyHoroscope = () => {
  const [location] = useLocation();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID, {
        page_path: location
      });
    }
  }, [location]);

  // Get current Tamil week dates
  const getCurrentWeekRange = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - dayOfWeek);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const months = ['ஜனவரி', 'பிப்ரவரி', 'மார்ச்', 'ஏப்ரல்', 'மே', 'ஜூன்', 
                   'ஜூலை', 'ஆகஸ்ட்', 'செப்டம்பர்', 'அக்டோபர்', 'நவம்பர்', 'டிசம்பர்'];
    
    return `${months[startOfWeek.getMonth()]} ${startOfWeek.getDate()} - ${months[endOfWeek.getMonth()]} ${endOfWeek.getDate()}, ${endOfWeek.getFullYear()}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <Helmet>
        <title>வார ராசி பலன்கள் தமிழில் | Weekly Horoscope in Tamil</title>
        <meta name="description" content="12 ராசிகளுக்கான இந்த வார பலன்கள். காதல், தொழில், பணம், ஆரோக்கியம் பற்றிய வார ஜோதிட பலன்கள் தமிழில்." />
        <meta property="og:title" content="வார ராசி பலன்கள் தமிழில் | Weekly Horoscope in Tamil" />
        <meta property="og:description" content="12 ராசிகளுக்கான இந்த வார பலன்கள். காதல், தொழில், பணம், ஆரோக்கியம் பற்றிய வார ஜோதிட பலன்கள் தமிழில்." />
        <meta property="og:url" content={`https://astrotick.com${location}`} />
        <meta name="keywords" content="தமிழ் ஜோதிடம், Tamil astrology, ராசி பலன், horoscope Tamil, AstroTick" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="Tamil" />
        <link rel="canonical" href={`https://astrotick.com${location}`} />
      </Helmet>
      
      <TamilHeader />
      
      {/* Tamil Weekly Horoscope Content */}
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
              {getCurrentWeekRange()}
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent leading-tight">
              வார ராசி பலன்கள்
            </h1>
            
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
              உங்கள் ராசிக்கான இந்த வார நட்சத்திர கணிப்புகளை கண்டறியுங்கள். 
              வேத ஜோதிடத்தின் அடிப்படையில் தயாரிக்கப்பட்ட துல்லியமான வார பலன்கள்.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tamil Weekly Zodiac Signs Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tamilWeeklyZodiacSigns.map((sign, index) => (
              <motion.div
                key={sign.english}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group cursor-pointer"
                onClick={() => setLocation(`/tamil/weekly-horoscope/${tamilZodiacMapping[sign.english as keyof typeof tamilZodiacMapping]}`)}
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
                      இந்த வார பலன்
                    </h3>
                    <p className="text-slate-600 mb-4 line-clamp-4">
                      {sign.weekly_prediction}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Heart className="h-4 w-4 text-pink-500" />
                        <span className="text-slate-600">காதல்: சிறப்பு</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Briefcase className="h-4 w-4 text-blue-500" />
                        <span className="text-slate-600">வேலை: முன்னேற்றம்</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="h-4 w-4 text-green-500" />
                        <span className="text-slate-600">பணம்: லாபம்</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Activity className="h-4 w-4 text-orange-500" />
                        <span className="text-slate-600">ஆரோக்கியம்: நல்லது</span>
                      </div>
                    </div>

                    <Button 
                      className={`w-full bg-gradient-to-r ${sign.color} hover:opacity-90 text-white group-hover:scale-105 transition-transform`}
                    >
                      விரிவான வார பலன் பார்க்கவும்
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TamilWeeklyHoroscope;
