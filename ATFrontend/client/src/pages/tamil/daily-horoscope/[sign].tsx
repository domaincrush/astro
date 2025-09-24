import { useState, useEffect } from 'react';
import { useLocation, useRoute } from 'wouter';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import TamilHeader from 'src/components/layout/TamilHeader';
import Footer from 'src/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from 'src/components/ui/card';
import { Button } from 'src/components/ui/button';
import { Badge } from 'src/components/ui/badge';
import { 
  Star, Calendar, TrendingUp, Heart, Briefcase, 
  DollarSign, Activity, Crown, MessageCircle, ArrowRight,
  ArrowLeft, ChevronLeft, ChevronRight
} from 'lucide-react';
import { tamilToEnglishMapping, tamilZodiacSEO } from 'src/data/tamil-zodiac-mapping';

// Tamil Zodiac Signs data
const tamilZodiacData = {
  aries: { 
    tamil: 'மேஷம்', 
    transliteration: 'Mesham',
    dates: 'மார்ச் 21 - ஏப்ரல் 19',
    color: 'from-red-500 to-orange-500',
    element: 'நெருப்பு',
    icon: '♈',
    ruling_planet: 'செவ்வாய்',
    lucky_numbers: '1, 8, 17',
    lucky_colors: 'சிவப்பு, ஆரஞ்சு',
    detailed_prediction: {
      general: 'இன்று உங்களுக்கு ஒரு சிறப்பான நாள். உங்கள் ஆற்றல் மிக அதிகமாக இருக்கும். புதிய திட்டங்களைத் தொடங்க இது சிறந்த நாள். தலைமைத்துவ குணங்கள் வெளிப்படும்.',
      love: 'காதல் விஷயங்களில் நல்ல செய்திகள் கிடைக்கும். உங்கள் துணையுடன் புரிந்துணர்வு அதிகரிக்கும். திருமணமானவர்களுக்கு குடும்பத்தில் மகிழ்ச்சி நிலவும்.',
      career: 'வேலையில் புதிய பொறுப்புகள் கிடைக்கும். உங்கள் முயற்சிகள் வெற்றி பெறும். பதவி உயர்வுக்கான வாய்ப்புகள் உண்டு.',
      finance: 'பணம் விஷயத்தில் நல்ல நிலை. முதலீடுகளில் லாபம் கிடைக்கும். புதிய வருமான வழிகள் கிடைக்கும்.',
      health: 'ஆரோக்கியம் சிறப்பாக இருக்கும். உடற்பயிற்சி செய்வதால் நல்ல பலன் கிடைக்கும். ஆற்றல் நிறைந்த நாள்.'
    }
  },
  taurus: { 
    tamil: 'ரிஷபம்', 
    transliteration: 'Rishabam',
    dates: 'ஏப்ரல் 20 - மே 20',
    color: 'from-green-500 to-emerald-500',
    element: 'பூமி',
    icon: '♉',
    ruling_planet: 'சுக்கிரன்',
    lucky_numbers: '2, 7, 29',
    lucky_colors: 'பச்சை, இளஞ்சிவப்பு',
    detailed_prediction: {
      general: 'பணம் மற்றும் சொத்து விஷயங்களில் நல்ல முன்னேற்றம். நிலையான முதலீடுகள் சாதகம். குடும்பத்துடன் நல்ல நேரம் கழிக்க முடியும்.',
      love: 'காதல் வாழ்க்கையில் நிலைத்தன்மை. அழகான தருணங்கள் கிடைக்கும். பரஸ்பர மரியாதையில் அதிகரிப்பு.',
      career: 'தொழில் விஷயங்களில் நிலையான வளர்ச்சி. கலை, அழகு சம்பந்தப்பட்ட துறைகளில் வெற்றி.',
      finance: 'சொத்து வாங்கும் யோகம். வங்கி சம்பந்தப்பட்ட காரியங்கள் சாதகம். சேமிப்பு அதிகரிக்கும்.',
      health: 'ஆரோக்கியம் நல்ல நிலையில். உணவு விஷயத்தில் கவனம் தேவை. இயற்கை உணவுகள் நல்லது.'
    }
  },
  // Add more signs as needed...
  gemini: { 
    tamil: 'மிதுனம்', 
    transliteration: 'Mithunam',
    dates: 'மே 21 - ஜூன் 20',
    color: 'from-yellow-500 to-amber-500',
    element: 'காற்று',
    icon: '♊',
    ruling_planet: 'புதன்',
    lucky_numbers: '5, 14, 23',
    lucky_colors: 'மஞ்சள், வெள்ளை',
    detailed_prediction: {
      general: 'தொடர்பு மற்றும் பயணங்களில் நன்மை. புதிய நண்பர்கள் கிடைக்கும். தகவல் பரிமாற்றத்தில் சிறப்பு.',
      love: 'பேச்சு வார்த்தைகளால் காதல் வளரும். புதிய அறிமுகங்கள் கிடைக்கும். இரட்டைமனம் தவிர்க்கவும்.',
      career: 'படிப்பு, ஊடகம், தொடர்பு துறைகளில் வெற்றி. வாய்ப்புகள் பலவும் கிடைக்கும்.',
      finance: 'பல வழிகளில் வருமானம். சிறு தொழில்களில் லாபம். போட்டி பரிசில் வெற்றி வாய்ப்பு.',
      health: 'நரம்பு மண்டலம் சம்பந்தப்பட்ட பிரச்சனைகள் தவிர்க்கவும். போதுமான ஓய்வு எடுக்கவும்.'
    }
  },
  cancer: { 
    tamil: 'கடகம்', 
    transliteration: 'Kadagam',
    dates: 'ஜூன் 21 - ஜூலை 22',
    color: 'from-blue-500 to-cyan-500',
    element: 'நீர்',
    icon: '♋',
    ruling_planet: 'சந்திரன்',
    lucky_numbers: '2, 7, 11',
    lucky_colors: 'வெள்ளை, கடல் நீலம்',
    detailed_prediction: {
      general: 'குடும்ப விஷயங்களில் மகிழ்ச்சி. தாய் வழி நன்மைகள். வீடு சம்பந்தப்பட்ட காரியங்களில் முன்னேற்றம்.',
      love: 'உணர்ச்சிகரமான தருணங்கள். குடும்ப ஒப்புதலுடன் காதல் வளரும். பாரம்பரிய மதிப்புகள் முக்கியம்.',
      career: 'உணவு, கல்வி, குழந்தைகள் நலன் சம்பந்தப்பட்ட துறைகளில் வெற்றி.',
      finance: 'வீட்டு கடன், சொத்து வாங்கும் வாய்ப்பு. குடும்ப செல்வம் அதிகரிக்கும்.',
      health: 'வயிறு, மார்பகம் சம்பந்தப்பட்ட பிரச்சனைகள் கவனம் தேவை. மனநிலை மாற்றங்கள் இயல்பு.'
    }
  },
  leo: { 
    tamil: 'சிம்மம்', 
    transliteration: 'Simmam',
    dates: 'ஜூலை 23 - ஆகஸ்ட் 22',
    color: 'from-orange-500 to-red-500',
    element: 'நெருப்பு',
    icon: '♌',
    ruling_planet: 'சூரியன்',
    lucky_numbers: '1, 4, 10',
    lucky_colors: 'தங்கம், ஆரஞ்சு',
    detailed_prediction: {
      general: 'தலைமைத்துவ குணங்கள் வெளிப்படும். கலை, பொழுதுபோக்கு துறையில் சிறப்பு. குழந்தைகள் மூலம் மகிழ்ச்சி.',
      love: 'ரொமான்டிக் தருணங்கள். பரஸ்பர மதிப்பு அதிகரிக்கும். காதல் திருமணத்துக்கு வழிவகுக்கும்.',
      career: 'அரசு வேலை, பதவி உயர்வு வாய்ப்புகள். தலைமைப் பொறுப்புகள் கிடைக்கும்.',
      finance: 'அதிக வருமானம், ஆடம்பர வாங்கல்கள். பொன், வெள்ளி முதலீடு சாதகம்.',
      health: 'இதயம், முதுகு சம்பந்தப்பட்ட பிரச்சனைகள் கவனம். அதிக வேலைப்பளு தவிர்க்கவும்.'
    }
  },
  virgo: { 
    tamil: 'கன்னி', 
    transliteration: 'Kanni',
    dates: 'ஆகஸ்ட் 23 - செப்டம்பர் 22',
    color: 'from-green-500 to-teal-500',
    element: 'பூமி',
    icon: '♍',
    ruling_planet: 'புதன்',
    lucky_numbers: '3, 15, 27',
    lucky_colors: 'பச்சை, பழுப்பு',
    detailed_prediction: {
      general: 'கவனக்குறைவாக செய்யும் காரியங்களில் வெற்றி. ஆரோக்கியம் மற்றும் சேவை துறையில் சிறப்பு.',
      love: 'நடைமுறை அணுகுமுறையுடன் காதல். துணையின் உடல்நலத்தில் அக்கறை காட்டுவீர்கள்.',
      career: 'விவசாயம், மருத்துவம், சேவை துறைகளில் முன்னேற்றம். துல்லியமான வேலைகளில் வெற்றி.',
      finance: 'சிக்கனம், சேமிப்பு அதிகரிக்கும். சின்ன சின்ன முதலீடுகள் நல்ல பலன் தரும்.',
      health: 'ஜீரண சக்தி, குடல் சம்பந்தப்பட்ட பிரச்சனைகள் கவனம். உணவு பழக்கம் மாற்றவும்.'
    }
  },
  libra: { 
    tamil: 'துலாம்', 
    transliteration: 'Thulam',
    dates: 'செப்டம்பர் 23 - அக்டோபர் 22',
    color: 'from-pink-500 to-rose-500',
    element: 'காற்று',
    icon: '♎',
    ruling_planet: 'சுக்கிரன்',
    lucky_numbers: '6, 15, 24',
    lucky_colors: 'இளஞ்சிவப்பு, வானிலா',
    detailed_prediction: {
      general: 'சமநிலை மற்றும் நீதி விஷயங்களில் சிறப்பு. கலை, அழகு துறையில் வெற்றி.',
      love: 'திருமண யோகம் வலுப்படும். அழகான உறவுகள் உருவாகும். ரொமான்ஸ் நிறைந்த நாள்.',
      career: 'சட்டத்துறை, நீதிமன்றம், வழக்கறிஞர் தொழிலில் முன்னேற்றம். பங்காளித்தல் வெற்றிகரம்.',
      finance: 'பங்காளிகள் மூலம் நன்மை. அழகு சம்பந்தப்பட்ட முதலீடுகள் லாபம் தரும்.',
      health: 'கிட்னி, இடுப்பு சம்பந்தப்பட்ட பிரச்சனைகள் கவனம். சர்க்கரை நோய் தவிர்க்கவும்.'
    }
  },
  scorpio: { 
    tamil: 'விருச்சிகம்', 
    transliteration: 'Viruchigam',
    dates: 'அக்டோபர் 23 - நவம்பர் 21',
    color: 'from-purple-500 to-indigo-500',
    element: 'நீர்',
    icon: '♏',
    ruling_planet: 'செவ்வாய்',
    lucky_numbers: '4, 13, 27',
    lucky_colors: 'சிவப்பு, கருப்பு',
    detailed_prediction: {
      general: 'மறைவான விஷயங்களில் வெற்றி. ஆராய்ச்சி, தன்னம்பிக்கை துறைகளில் சிறப்பு.',
      love: 'ஆழமான, தீவிரமான காதல். ரகசிய உறவுகள். உணர்ச்சி வேக மாற்றங்கள்.',
      career: 'மருத்துவம், ஆராய்ச்சி, துப்பறியும் பணிகளில் வெற்றி. மறைவான தகவல்கள் கிடைக்கும்.',
      finance: 'மற்றவர்களின் பணம், காப்பீடு, முதலீடு மூலம் லாபம். ரகசிய வருமானம்.',
      health: 'இனப்பெருக்க உறுப்புகள், மூல நோய் கவனம். மனதளவில் வலிமை அதிகரிக்கும்.'
    }
  },
  sagittarius: { 
    tamil: 'தனுசு', 
    transliteration: 'Dhanusu',
    dates: 'நவம்பர் 22 - டிசம்பர் 21',
    color: 'from-blue-500 to-purple-500',
    element: 'நெருப்பு',
    icon: '♐',
    ruling_planet: 'குரு',
    lucky_numbers: '3, 9, 21',
    lucky_colors: 'நீலம், ஊதா',
    detailed_prediction: {
      general: 'கல்வி, தர்மம், வெளிநாட்டு தொடর்பு விஷயங்களில் நன்மை. பயணங்கள் லாபகரம்.',
      love: 'தூரத்து காதல், வெளிநாட்டுத் துணை கிடைக்கும் வாய்ப்பு. மத ரீதியான புரிந்துணர்வு.',
      career: 'ஆசிரியர், வழக்கறிஞர், மத சேவை துறைகளில் வெற்றி. உயர் கல்வியில் சிறப்பு.',
      finance: 'தூர தேசத்திலிருந்து பணம், வெளிநாட்டு முதலீடு. தர்ம காரியங்களில் செலவு.',
      health: 'தொடை, கல்லீரல் சம்பந்தப்பட்ட பிரச்சனைகள். அதிக பயணத்தால் சோர்வு.'
    }
  },
  capricorn: { 
    tamil: 'மகரம்', 
    transliteration: 'Magaram',
    dates: 'டிசம்பர் 22 - ஜனவரி 19',
    color: 'from-gray-500 to-slate-500',
    element: 'பூமி',
    icon: '♑',
    ruling_planet: 'சனி',
    lucky_numbers: '8, 17, 26',
    lucky_colors: 'கருப்பு, பழுப்பு',
    detailed_prediction: {
      general: 'கடின உழைப்பின் பலன். பொறுமையும் விடாமுயற்சியும் வெற்றி தரும். அதிகாரம் கிடைக்கும்.',
      love: 'நிலையான, நீண்ட கால உறவு. வயதான துணை அல்லது கடுமையான உறவு.',
      career: 'நிர்வாகம், கட்டுமானம், பாரம்பரிய தொழில்களில் வெற்றி. மெல்ல மெல்ல முன்னேற்றம்.',
      finance: 'மெதுவான ஆனால் நிலையான வருமானம். சொத்து, நிலம் முதலீடு நல்லது.',
      health: 'எலும்பு, மூட்டு, முழங்கால் சம்பந்தப்பட்ட பிரச்சனைகள். குளிர்ச்சியால் பாதிப்பு.'
    }
  },
  aquarius: { 
    tamil: 'கும்பம்', 
    transliteration: 'Kumbam',
    dates: 'ஜனவரி 20 - பிப்ரவரி 18',
    color: 'from-cyan-500 to-blue-500',
    element: 'காற்று',
    icon: '♒',
    ruling_planet: 'சனி',
    lucky_numbers: '4, 8, 13',
    lucky_colors: 'ஆகாய நீலம், மின்னல்',
    detailed_prediction: {
      general: 'நண்பர்கள், குழு வேலைகளில் வெற்றி. தொழில்நுட்பம், புதுமைகளில் சிறப்பு.',
      love: 'நட்பு வழியே காதல். வித்தியாசமான, சுதந்திரமான துணை கிடைக்கும்.',
      career: 'கணினி, விஞ்ஞானம், சமூக சேவை துறைகளில் முன்னேற்றம். குழு வேலைகளில் வெற்றி.',
      finance: 'நண்பர்கள் மூலம் பணம், லாட்டரி, சூதாட்ட வெற்றி. அதிர்ஷ்ட வாய்ப்புகள்.',
      health: 'இரத்த ஓட்டம், கால் சம்பந்தப்பட்ட பிரச்சனைகள். மனரீதியான சிக்கல்கள் தவிர்க்கவும்.'
    }
  },
  pisces: { 
    tamil: 'மீனம்', 
    transliteration: 'Meenam',
    dates: 'பிப்ரவரி 19 - மார்ச் 20',
    color: 'from-teal-500 to-green-500',
    element: 'நீர்',
    icon: '♓',
    ruling_planet: 'குரு',
    lucky_numbers: '7, 12, 29',
    lucky_colors: 'கடல் பச்சை, வெள்ளை',
    detailed_prediction: {
      general: 'ஆன்மீக முன்னேற்றம், கலை, இசை துறையில் சிறப்பு. கனவுகள் நனவாகும்.',
      love: 'காதல் கனவுகள், கற்பனை உலக உறவுகள். துணையின் பிரச்சனைகளில் உதவி.',
      career: 'மருத்துவம், கலை, இசை, ஆன்மீக துறைகளில் வெற்றி. பணி புரியும் இடம் மாற்றம்.',
      finance: 'நீர் சம்பந்தப்பட்ட தொழில்கள், மருத்துவம் மூலம் வருமானம். தானதர்மங்களில் செலவு.',
      health: 'கால், கணுக்கால், மனநலம் சம்பந்தப்பட்ட பிரச்சனைகள். போதை பழக்கம் தவிர்க்கவும்.'
    }
  }
};

const TamilZodiacDetailPage = () => {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute('/tamil/daily-horoscope/:sign');
  const { sign } = params || {};

  // Convert Tamil URL to English for data lookup
  const englishSign = sign ? tamilToEnglishMapping[sign] : null;
  const zodiacData = englishSign ? tamilZodiacData[englishSign as keyof typeof tamilZodiacData] : null;
  const seoData = sign ? tamilZodiacSEO[sign as keyof typeof tamilZodiacSEO] : null;

  if (!zodiacData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
        <TamilHeader />
        <div className="container mx-auto max-w-4xl py-16 px-4 text-center">
          <h1 className="text-3xl font-bold text-slate-800 mb-4">ராசி கிடைக்கவில்லை</h1>
          <p className="text-slate-600 mb-8">தவறான ராசி பெயர். தயவுசெய்து சரியான ராசியைத் தேர்ந்தெடுக்கவும்.</p>
          <Button onClick={() => setLocation('/tamil/daily-horoscope')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            மீண்டும் செல்லவும்
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

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
        <title>{seoData?.seoTitle || `${zodiacData?.tamil} ராசி பலன் | AstroTick Tamil`}</title>
        <meta name="description" content={seoData?.seoDescription || `${zodiacData?.tamil} ராசிக்காரர்களுக்கான இன்றைய பலன்கள்`} />
        <meta property="og:title" content={seoData?.seoTitle} />
        <meta property="og:description" content={seoData?.seoDescription} />
        <meta name="keywords" content={`${zodiacData?.tamil}, ${seoData?.transliteration}, Tamil horoscope, ராசி பலன், தமிழ் ஜோதிடம், AstroTick`} />
      </Helmet>
      <TamilHeader />
      
      {/* Tamil Content */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setLocation('/tamil/daily-horoscope')}
                className="border-orange-200 text-orange-600 hover:bg-orange-50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                பின் செல்லவும்
              </Button>
              <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 text-sm">
                <Calendar className="h-4 w-4 mr-2" />
                {getCurrentTamilDate()}
              </Badge>
            </div>

            <Card className={`bg-gradient-to-r ${zodiacData.color} text-white overflow-hidden mb-8`}>
              <CardHeader className="text-center py-12">
                <div className="text-8xl mb-4">{zodiacData.icon}</div>
                <CardTitle className="text-4xl font-bold mb-2">{zodiacData.tamil}</CardTitle>
                <p className="text-xl opacity-90 mb-2">{zodiacData.transliteration}</p>
                <p className="text-lg opacity-80 mb-4">{zodiacData.dates}</p>
                <div className="flex justify-center gap-4">
                  <Badge className="bg-white/20 text-white">
                    {zodiacData.element} அம்சம்
                  </Badge>
                  <Badge className="bg-white/20 text-white">
                    அதிபதி: {zodiacData.ruling_planet}
                  </Badge>
                </div>
              </CardHeader>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Detailed Predictions */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Predictions */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Star className="h-5 w-5 text-orange-500" />
                    பொதுவான பலன்
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 leading-relaxed">
                    {zodiacData.detailed_prediction.general}
                  </p>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Heart className="h-5 w-5 text-pink-500" />
                      காதல் & திருமணம்
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-700 text-sm leading-relaxed">
                      {zodiacData.detailed_prediction.love}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Briefcase className="h-5 w-5 text-blue-500" />
                      தொழில் & வேலை
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-700 text-sm leading-relaxed">
                      {zodiacData.detailed_prediction.career}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <DollarSign className="h-5 w-5 text-green-500" />
                      பணம் & முதலீடு
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-700 text-sm leading-relaxed">
                      {zodiacData.detailed_prediction.finance}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Activity className="h-5 w-5 text-red-500" />
                      ஆரோக்கியம்
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-700 text-sm leading-relaxed">
                      {zodiacData.detailed_prediction.health}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Lucky Info Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">அதிர்ஷ்ட தகவல்கள்</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-slate-800 mb-1">அதிர்ஷ்ட எண்கள்</h4>
                    <p className="text-slate-600 text-sm">{zodiacData.lucky_numbers}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800 mb-1">அதிர்ஷ்ட நிறங்கள்</h4>
                    <p className="text-slate-600 text-sm">{zodiacData.lucky_colors}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800 mb-1">அதிபதி கிரகம்</h4>
                    <p className="text-slate-600 text-sm">{zodiacData.ruling_planet}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800 mb-1">அம்சம்</h4>
                    <p className="text-slate-600 text-sm">{zodiacData.element}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">
                    மேலும் துல்லியமான பலன்களுக்கு
                  </h3>
                  <Button 
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white mb-3"
                    onClick={() => setLocation('/tamil/astrologers')}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    ஜோதிடருடன் பேசுங்கள்
                  </Button>
                  <Button 
                    variant="outline"
                    className="w-full border-orange-200 text-orange-600 hover:bg-orange-50"
                    onClick={() => setLocation('/tamil/kundli')}
                  >
                    <Star className="h-4 w-4 mr-2" />
                    இலவச ஜாதகம்
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TamilZodiacDetailPage;