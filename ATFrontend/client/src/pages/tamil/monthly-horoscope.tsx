import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import TamilHeader from 'src/components/layout/TamilHeader';
import Footer from 'src/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from 'src/components/ui/card';
import { Button } from 'src/components/ui/button';
import { Badge } from 'src/components/ui/badge';
import { Calendar, Star, Heart, Briefcase, DollarSign, Activity, ArrowRight, TrendingUp } from 'lucide-react';
import { tamilZodiacMapping } from 'src/data/tamil-zodiac-mapping';

// Tamil Monthly Zodiac Signs with predictions
const tamilMonthlyZodiacSigns = [
  { 
    english: 'aries', 
    tamil: 'மேஷம்', 
    transliteration: 'Mesham',
    dates: 'மார்ச் 21 - ஏப்ரல் 19',
    color: 'from-red-500 to-orange-500',
    element: 'நெருப்பு',
    icon: '♈',
    ruling_planet: 'செவ்வாய்',
    monthly_prediction: 'இந்த மாதம் உங்களுக்கு அதிக ஆற்றல் மற்றும் உத்வேகம் இருக்கும். புதிய திட்டங்களை தொடங்குவதற்கு நல்ல நேரம். தலைமைத்துவ குணங்கள் வெளிப்படும். உணர்ச்சிவசப்பட்டு முடிவுகள் எடுப்பதை தவிர்க்கவும். உங்கள் குறிக்கோள்களில் கவனம் செலுத்துங்கள்.',
    key_themes: ['தலைமைத்துவம்', 'புதிய தொடக்கங்கள்', 'சாகசங்கள்', 'ஆற்றல்'],
    major_transits: 'செவ்வாய் உங்கள் ராசியில் பலம் பெறுவதால் தன்னம்பிக்கை அதிகரிக்கும்।',
    opportunities: 'புதிய வியாபாரம், தலைமை பொறுப்புகள், விளையாட்டு, போட்டிகளில் வெற்றி',
    challenges: 'அவசரம், கோபம், ஆணவம், விபத்து ஆபத்து',
    important_dates: ['மார்ச் 5', 'மார்ச் 15', 'மார்ச் 25']
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
    monthly_prediction: 'நிலைத்த தன்மை மற்றும் பாதுகாப்பு உணர்வு அதிகரிக்கும். பணம் மற்றும் சொத்து விஷயங்களில் கவனம் செலுத்துவீர்கள். இயற்கை மற்றும் கலை சார்ந்த விஷயங்களில் ஆர்வம் வளரும். பொறுமையுடன் செயல்படுவது வெற்றி தரும்.',
    key_themes: ['நிலைத்த தன்மை', 'பணம்', 'சொத்து', 'அழகு'],
    major_transits: 'சுக்கிரன் சாதகமாக இருப்பதால் ஆடம்பர வாழ்க்கை முறை அதிகரிக்கும்।',
    opportunities: 'ரியல் எஸ்டேட், அழகுசாதனம், உணவு, கலை துறையில் வாய்ப்புகள்',
    challenges: 'பிடிவாதம், மாற்றத்திற்கு எதிர்ப்பு, அதிக செலவு',
    important_dates: ['ஏப்ரல் 8', 'ஏப்ரல் 18', 'ஏப்ரல் 28']
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
    monthly_prediction: 'தொடர்பு மற்றும் கற்றல் அதிகரிக்கும் மாதம். பல புதிய நபர்களுடன் அறிமுகம். எழுத்து, பேச்சு, ஊடகம் சார்ந்த வேலைகளில் வெற்றி. பயணங்கள் அதிகரிக்கும். அறிவு தாகம் வளரும்.',
    key_themes: ['தொடர்பு', 'கற்றல்', 'பயணம்', 'பல்வேறுபட்ட தன்மை'],
    major_transits: 'புதன் சாதகமாக இருப்பதால் மனதிறன் மற்றும் பேச்சு சக்தி அதிகரிக்கும்।',
    opportunities: 'ஊடகம், எழுத்து, கற்பித்தல், வியாபாரம், குறுகிய பயணங்கள்',
    challenges: 'நிலையற்ற தன்மை, அதிக பேசுதல், மன அழுத்தம்',
    important_dates: ['மே 10', 'மே 20', 'மே 30']
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
    monthly_prediction: 'குடும்பம் மற்றும் வீடு மையமாக இருக்கும் மாதம். உணர்ச்சிகள் வலுவாக இருக்கும். தாயாருடன் நல்ல தொடர்பு. வீட்டு வசதிகளில் முன்னேற்றம். உணவு மற்றும் பாதுகாப்பு விஷயங்களில் அதிக கவனம்.',
    key_themes: ['குடும்பம்', 'வீடு', 'உணர்ச்சிகள்', 'பாதுகாப்பு'],
    major_transits: 'சந்திரன் வலுப்பெறுவதால் மன அமைதி மற்றும் குடும்ப ஒற்றுமை அதிகரிக்கும்।',
    opportunities: 'ரியல் எஸ்டேட், உணவு, சேமிப்பு, பெண்களுடன் வியாபாரம்',
    challenges: 'மூட் மாற்றங்கள், அதிக உணர்ச்சி, கடந்த கால நினைவுகள்',
    important_dates: ['ஜூன் 12', 'ஜூன் 22', 'ஜூலை 2']
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
    monthly_prediction: 'புகழ் மற்றும் அங்கீகாரம் பெறும் மாதம். ஆக்கப்பூர்வமான வேலைகளில் சிறப்பு. மேடை, கலை, பொழுதுபோக்கு துறையில் வாய்ப்புகள். தன்னம்பிக்கை உச்சத்தில் இருக்கும். தலைமைத்துவ குணங்கள் வெளிப்படும்.',
    key_themes: ['புகழ்', 'ஆக்கப்பூர்வம்', 'தலைமைத்துவம்', 'கலை'],
    major_transits: 'சூரியன் வலுப்பெறுவதால் தன்னம்பிக்கை மற்றும் தலைமைத்துவம் அதிகரிக்கும்।',
    opportunities: 'கலை, பொழுதுபோக்கு, விளையாட்டு, குழந்தைகள் சார்ந்த வேலைகள்',
    challenges: 'அகம்பாவம், ஆணவம், அதிக செலவு, இதய பிரச்சனைகள்',
    important_dates: ['ஜூலை 15', 'ஜூலை 25', 'ஆகஸ்ட் 5']
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
    monthly_prediction: 'சேவை மற்றும் ஆரோக்கியம் மையமாக இருக்கும் மாதம். விவரங்களில் கவனம் அதிகரிக்கும். வேலையில் திறமை வெளிப்படும். உணவு முறை மற்றும் உடற்பயிற்சியில் ஆர்வம். முறையான அணுகுமுறை வெற்றி தரும்.',
    key_themes: ['சேவை', 'ஆரோக்கியம்', 'திறமை', 'முறைமை'],
    major_transits: 'புதன் சாதகமாக இருப்பதால் பகுப்பாய்வு திறன் மற்றும் நுணுக்கம் அதிகரிக்கும்।',
    opportunities: 'ஆரோக்கியம், தொழில்நுட்பம், சேவை, பகுப்பாய்வு சார்ந்த வேலைகள்',
    challenges: 'அதிக விமர்சனம், கவலை, முடிவெடுக்க தாமதம்',
    important_dates: ['ஆகஸ்ட் 18', 'ஆகஸ்ட் 28', 'செப்டம்பர் 8']
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
    monthly_prediction: 'உறவுகள் மற்றும் கூட்டாண்மை அதிக முக்கியத்துவம் பெறும். அழகு மற்றும் கலை சார்ந்த விஷயங்களில் ஆர்வம். நீதி மற்றும் சமநிலையை தேடுவீர்கள். திருமண யோகம் அல்லது புதிய கூட்டாண்மை சாத்தியம்.',
    key_themes: ['உறவுகள்', 'கூட்டாண்மை', 'அழகு', 'சமநிலை'],
    major_transits: 'சுக்கிரன் சாதகமாக இருப்பதால் காதல் மற்றும் கலை விஷயங்களில் அதிர்ஷ்டம்।',
    opportunities: 'கலை, அழகுசாதனம், சட்டம், கூட்டாண்மை, திருமணம்',
    challenges: 'முடிவெடுக்க தயக்கம், மற்றவர்களை அதிகம் நம்புதல்',
    important_dates: ['செப்டம்பர் 20', 'செப்டம்பர் 30', 'அக்டோபர் 10']
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
    monthly_prediction: 'மாற்றம் மற்றும் புனர்ஜென்மம் அடையும் மாதம். ஆழ்ந்த ரகசியங்கள் வெளிப்படும். ஆராய்ச்சி மற்றும் புலனாய்வில் ஆர்வம். பிறரின் பணம் அல்லது வளங்கள் மூலம் நன்மை. ஆன்மீக சக்தி அதிகரிக்கும்.',
    key_themes: ['மாற்றம்', 'ரகசியம்', 'ஆராய்ச்சி', 'ஆன்மீகம்'],
    major_transits: 'செவ்வாய் வலுப்பெறுவதால் உளவியல் சக்தி மற்றும் துணிவு அதிகரிக்கும்।',
    opportunities: 'ஆராய்ச்சி, காப்பீடு, மறைவான பணம், ஆன்மீக வேலைகள்',
    challenges: 'வெறுப்பு, பழிவாங்கும் மனப்பான்மை, ஆபத்தான சூழ்நிலைகள்',
    important_dates: ['அக்டோபர் 25', 'நவம்பர் 5', 'நவம்பர் 15']
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
    monthly_prediction: 'கல்வி மற்றும் தத்துவம் அதிக முக்கியத்துவம் பெறும். தூர தேசங்களுடன் தொடர்பு. உயர் கல்வி அல்லது ஆசிரியர் பணியில் வாய்ப்பு. ஆன்மீக பயணம் மற்றும் அறிவு தேடல் அதிகரிக்கும்.',
    key_themes: ['கல்வி', 'தத்துவம்', 'பயணம்', 'வெளிநாடு'],
    major_transits: 'குரு சாதகமாக இருப்பதால் ஞானம் மற்றும் அதிர்ஷ்டம் அதிகரிக்கும்।',
    opportunities: 'கல்வி, வெளியிடுதல், பயணம், வெளிநாட்டு தொடர்பு',
    challenges: 'அதிக எதிர்பார்ப்பு, தத்துவ விவாதங்கள், பயண தாமதங்கள்',
    important_dates: ['நவம்பர் 28', 'டிசம்பர் 8', 'டிசம்பர் 18']
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
    monthly_prediction: 'தொழில் மற்றும் அந்தஸ்தில் முன்னேற்றம். கடின உழைப்பின் பலன் கிடைக்கும். அதிகாரம் மற்றும் பொறுப்புகள் அதிகரிக்கும். பாரம்பரிய மற்றும் நிர்வாக வேலைகளில் வெற்றி. மூத்தோர் ஆசீர்வாதம்.',
    key_themes: ['தொழில்', 'அதிகாரம்', 'பொறுப்பு', 'பாரம்பரியம்'],
    major_transits: 'சனி சாதகமாக இருப்பதால் கடின உழைப்பு மற்றும் ஒழுக்கம் வெற்றி தரும்।',
    opportunities: 'அரசு வேலை, நிர்வாகம், வயதானவர்களுடன் வியாபாரம்',
    challenges: 'மந்தமான முன்னேற்றம், அதிக பொறுப்பு, சோர்வு',
    important_dates: ['டிசம்பர் 30', 'ஜனவரி 10', 'ஜனவரி 20']
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
    monthly_prediction: 'நண்பர்கள் மற்றும் சமூக வலைப்பின்னல் மூலம் நன்மைகள். புதுமையான ஐடியாக்கள் மற்றும் தொழில்நுட்பம் சார்ந்த வேலைகளில் வெற்றி. குழு வேலைகளில் சிறப்பு. சமூக சேவையில் ஆர்வம் அதிகரிக்கும்.',
    key_themes: ['நண்பர்கள்', 'குழு', 'தொழில்நுட்பம்', 'புதுமை'],
    major_transits: 'சனி சாதகமாக இருப்பதால் தொழில்நுட்ப அறிவு மற்றும் சமூக தொடர்பு அதிகரிக்கும்।',
    opportunities: 'தொழில்நுட்பம், சமூக வேலை, குழு திட்டங்கள், ஆன்லைன் வியாபாரம்',
    challenges: 'அதிக கொள்கை, விரோதம், எதிர்பாராத மாற்றங்கள்',
    important_dates: ['ஜனவரி 25', 'பிப்ரவரி 5', 'பிப்ரவரி 15']
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
    monthly_prediction: 'ஆன்மீக முன்னேற்றம் மற்றும் அந்தர்முகமான சிந்தனை அதிகரிக்கும். கனவுகள் மற்றும் உள்ளுணர்வு வலுப்படும். கலை, இசை, எழுத்து துறையில் ஆக்கபூர்வமான வேலைகள். தானம் மற்றும் சேவையில் ஆர்வம்.',
    key_themes: ['ஆன்மீகம்', 'கனவுகள்', 'கலை', 'கருணை'],
    major_transits: 'குரு சாதகமாக இருப்பதால் ஆன்மீக ஞானம் மற்றும் கருணை அதிகரிக்கும்।',
    opportunities: 'கலை, இசை, ஆன்மீக வேலைகள், மருத்துவம், தானம்',
    challenges: 'குழப்பம், கற்பனை உலகம், மன அழுத்தம், ஏமாற்றம்',
    important_dates: ['பிப்ரவரி 25', 'மார்ச் 8', 'மார்ச் 18']
  }
];

const TamilMonthlyHoroscope = () => {
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID, {
        page_path: location
      });
    }
  }, [location]);

  // Get current Tamil month
  const getCurrentMonth = () => {
    const now = new Date();
    const months = ['ஜனவரி', 'பிப்ரவரி', 'மார்ச்', 'ஏப்ரல்', 'மே', 'ஜூன்', 
                   'ஜூலை', 'ஆகஸ்ட்', 'செப்டம்பர்', 'அக்டோபர்', 'நவம்பர்', 'டிசம்பர்'];
    
    return `${months[now.getMonth()]} ${now.getFullYear()}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      <Helmet>
        <title>மாத ராசி பலன்கள் தமிழில் | Monthly Horoscope in Tamil</title>
        <meta name="description" content="12 ராசிகளுக்கான இந்த மாத பலன்கள். விரிவான மாதாந்திர ஜோதிட பலன்கள் மற்றும் பரிகாரங்கள் தமிழில்." />
        <meta property="og:title" content="மாத ராசி பலன்கள் தமிழில் | Monthly Horoscope in Tamil" />
        <meta property="og:description" content="12 ராசிகளுக்கான இந்த மாத பலன்கள். விரிவான மாதாந்திர ஜோதிட பலன்கள் மற்றும் பரிகாரங்கள் தமிழில்." />
        <meta property="og:url" content={`https://astrotick.com${location}`} />
        <meta name="keywords" content="தமிழ் ஜோதிடம், Tamil astrology, ராசி பலன், horoscope Tamil, AstroTick" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="Tamil" />
        <link rel="canonical" href={`https://astrotick.com${location}`} />
      </Helmet>
      
      <TamilHeader />
      
      {/* Tamil Monthly Horoscope Content */}
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
              {getCurrentMonth()}
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent leading-tight">
              மாத ராசி பலன்கள்
            </h1>
            
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
              உங்கள் ராசிக்கான இந்த மாத நட்சத்திர கணிப்புகளை கண்டறியுங்கள். 
              விரிவான மாதாந்திர ஜோதிட பலன்கள் மற்றும் முக்கியமான தேதிகள்.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tamil Monthly Zodiac Signs Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tamilMonthlyZodiacSigns.map((sign, index) => (
              <motion.div
                key={sign.english}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group cursor-pointer"
                onClick={() => setLocation(`/tamil/monthly-horoscope/${tamilZodiacMapping[sign.english as keyof typeof tamilZodiacMapping]}`)}
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
                      இந்த மாத பலன்
                    </h3>
                    <p className="text-slate-600 mb-4 line-clamp-4">
                      {sign.monthly_prediction}
                    </p>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-slate-700 mb-2">முக்கிய விஷயங்கள்:</h4>
                      <div className="flex flex-wrap gap-1">
                        {sign.key_themes.slice(0, 3).map(theme => (
                          <Badge key={theme} variant="secondary" className="text-xs bg-orange-100 text-orange-800">
                            {theme}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
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
                        <span className="text-slate-600">பணம்: நல்லது</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <TrendingUp className="h-4 w-4 text-purple-500" />
                        <span className="text-slate-600">வாய்ப்புகள்: அதிகம்</span>
                      </div>
                    </div>

                    <Button 
                      className={`w-full bg-gradient-to-r ${sign.color} hover:opacity-90 text-white group-hover:scale-105 transition-transform`}
                    >
                      விரிவான மாத பலன் பார்க்கவும்
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

export default TamilMonthlyHoroscope;
