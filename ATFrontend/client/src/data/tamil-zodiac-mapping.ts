// Tamil Zodiac URL Mapping for SEO-friendly URLs
export const tamilZodiacMapping = {
  // English to Tamil URL mapping
  aries: 'mesham',
  taurus: 'rishabam', 
  gemini: 'mithunam',
  cancer: 'karkatakam',
  leo: 'simham',
  virgo: 'kanni',
  libra: 'thulam',
  scorpio: 'vrischikam',
  sagittarius: 'dhanusu',
  capricorn: 'makaram',
  aquarius: 'kumbham',
  pisces: 'meenam'
};

// Reverse mapping for URL resolution
export const tamilToEnglishMapping = Object.fromEntries(
  Object.entries(tamilZodiacMapping).map(([english, tamil]) => [tamil, english])
);

// Tamil zodiac data with SEO information
export const tamilZodiacSEO = {
  mesham: {
    tamil: 'மேஷம்',
    transliteration: 'Mesham',
    dates: 'மார்ச் 21 - ஏப்ரல் 19',
    seoTitle: 'மேஷம் ராசி இன்றைய பலன் | Mesham Horoscope Today in Tamil',
    seoDescription: 'மேஷம் ராசிக்காரர்களுக்கான இன்றைய பலன்கள். காதல், தொழில், பணம், ஆரோக்கியம் பற்றிய துல்லியமான ஜோதிட பலன்கள். AstroTick Tamil.',
    color: 'from-red-500 to-orange-500',
    element: 'நெருப்பு',
    icon: '♈',
    ruling_planet: 'செவ்வாய்'
  },
  rishabam: {
    tamil: 'ரிஷபம்',
    transliteration: 'Rishabam', 
    dates: 'ஏப்ரல் 20 - மே 20',
    seoTitle: 'ரிஷபம் ராசி இன்றைய பலன் | Rishabam Horoscope Today in Tamil',
    seoDescription: 'ரிஷபம் ராசிக்காரர்களுக்கான இன்றைய பலன்கள். பணம், சொத்து, காதல் விஷயங்களில் துல்லியமான ஜோதிட பலன்கள். AstroTick Tamil.',
    color: 'from-green-500 to-emerald-500',
    element: 'பூமி',
    icon: '♉',
    ruling_planet: 'சுக்கிரன்'
  },
  mithunam: {
    tamil: 'மிதுனம்',
    transliteration: 'Mithunam',
    dates: 'மே 21 - ஜூன் 20', 
    seoTitle: 'மிதுனம் ராசி இன்றைய பலன் | Mithunam Horoscope Today in Tamil',
    seoDescription: 'மிதுனம் ராசிக்காரர்களுக்கான இன்றைய பலன்கள். தொடர்பு, பயணம், கல்வி விஷயங்களில் துல்லியமான ஜோதிட பலன்கள். AstroTick Tamil.',
    color: 'from-yellow-500 to-amber-500',
    element: 'காற்று',
    icon: '♊',
    ruling_planet: 'புதன்'
  },
  karkatakam: {
    tamil: 'கடகம்',
    transliteration: 'Karkatakam',
    dates: 'ஜூன் 21 - ஜூலை 22',
    seoTitle: 'கடகம் ராசி இன்றைய பலன் | Karkatakam Horoscope Today in Tamil',
    seoDescription: 'கடகம் ராசிக்காரர்களுக்கான இன்றைய பலன்கள். குடும்பம், வீடு, தாய் வழி நன்மைகளில் துல்லியமான ஜோதிட பலன்கள். AstroTick Tamil.',
    color: 'from-blue-500 to-cyan-500',
    element: 'நீர்',
    icon: '♋',
    ruling_planet: 'சந்திரன்'
  },
  simham: {
    tamil: 'சிம்மம்',
    transliteration: 'Simham',
    dates: 'ஜூலை 23 - ஆகஸ்ட் 22',
    seoTitle: 'சிம்மம் ராசி இன்றைய பலன் | Simham Horoscope Today in Tamil',
    seoDescription: 'சிம்மம் ராசிக்காரர்களுக்கான இன்றைய பலன்கள். தலைமைத்துவம், அதிகாரம், கலை துறையில் துல்லியமான ஜோதிட பலன்கள். AstroTick Tamil.',
    color: 'from-orange-500 to-red-500',
    element: 'நெருப்பு',
    icon: '♌',
    ruling_planet: 'சூரியன்'
  },
  kanni: {
    tamil: 'கன்னி',
    transliteration: 'Kanni',
    dates: 'ஆகஸ்ட் 23 - செப்டம்பர் 22',
    seoTitle: 'கன்னி ராசி இன்றைய பலன் | Kanni Horoscope Today in Tamil',
    seoDescription: 'கன்னி ராசிக்காரர்களுக்கான இன்றைய பலன்கள். ஆரோக்கியம், சேவை, விவசாயம் துறையில் துல்லியமான ஜோதிட பலன்கள். AstroTick Tamil.',
    color: 'from-green-500 to-teal-500',
    element: 'பூமி',
    icon: '♍',
    ruling_planet: 'புதன்'
  },
  thulam: {
    tamil: 'துலாம்',
    transliteration: 'Thulam',
    dates: 'செப்டம்பர் 23 - அக்டோபர் 22',
    seoTitle: 'துலாம் ராசி இன்றைய பலன் | Thulam Horoscope Today in Tamil',
    seoDescription: 'துலாம் ராசிக்காரர்களுக்கான இன்றைய பலன்கள். திருமணம், கலை, அழகு துறையில் துல்லியமான ஜோதிட பலன்கள். AstroTick Tamil.',
    color: 'from-pink-500 to-rose-500', 
    element: 'காற்று',
    icon: '♎',
    ruling_planet: 'சுக்கிரன்'
  },
  vrischikam: {
    tamil: 'விருச்சிகம்',
    transliteration: 'Vrischikam',
    dates: 'அக்டோபர் 23 - நவம்பர் 21',
    seoTitle: 'விருச்சிகம் ராசி இன்றைய பலன் | Vrischikam Horoscope Today in Tamil',
    seoDescription: 'விருச்சிகம் ராசிக்காரர்களுக்கான இன்றைய பலன்கள். ஆராய்ச்சி, மறைவான விஷயங்களில் துல்லியமான ஜோதிட பலன்கள். AstroTick Tamil.',
    color: 'from-purple-500 to-indigo-500',
    element: 'நீர்',
    icon: '♏',
    ruling_planet: 'செவ்வாய்'
  },
  dhanusu: {
    tamil: 'தனுசு',
    transliteration: 'Dhanusu',
    dates: 'நவம்பர் 22 - டிசம்பர் 21',
    seoTitle: 'தனுசு ராசி இன்றைய பலன் | Dhanusu Horoscope Today in Tamil',
    seoDescription: 'தனுசு ராசிக்காரர்களுக்கான இன்றைய பலன்கள். கல்வி, தர்மம், வெளிநாட்டு தொடர்பில் துல்லியமான ஜோதிட பலன்கள். AstroTick Tamil.',
    color: 'from-blue-500 to-purple-500',
    element: 'நெருப்பு',
    icon: '♐',
    ruling_planet: 'குரு'
  },
  makaram: {
    tamil: 'மகரம்',
    transliteration: 'Makaram',
    dates: 'டிசம்பர் 22 - ஜனவரி 19',
    seoTitle: 'மகரம் ராசி இன்றைய பலன் | Makaram Horoscope Today in Tamil',
    seoDescription: 'மகரம் ராசிக்காரர்களுக்கான இன்றைய பலன்கள். கடின உழைப்பு, சொத்து, அதிகாரத்தில் துல்லியமான ஜோதிட பலன்கள். AstroTick Tamil.',
    color: 'from-gray-500 to-slate-500',
    element: 'பூமி',
    icon: '♑',
    ruling_planet: 'சனி'
  },
  kumbham: {
    tamil: 'கும்பம்',
    transliteration: 'Kumbham',
    dates: 'ஜனவரி 20 - பிப்ரவரி 18',
    seoTitle: 'கும்பம் ராசி இன்றைய பலன் | Kumbham Horoscope Today in Tamil',
    seoDescription: 'கும்பம் ராசிக்காரர்களுக்கான இன்றைய பலன்கள். நண்பர்கள், தொழில்நுட்பம், புதுமைகளில் துல்லியமான ஜோதிட பலன்கள். AstroTick Tamil.',
    color: 'from-cyan-500 to-blue-500',
    element: 'காற்று',
    icon: '♒',
    ruling_planet: 'சனி'
  },
  meenam: {
    tamil: 'மீனம்',
    transliteration: 'Meenam',
    dates: 'பிப்ரவரி 19 - மார்ச் 20',
    seoTitle: 'மீனம் ராசி இன்றைய பலன் | Meenam Horoscope Today in Tamil',
    seoDescription: 'மீனம் ராசிக்காரர்களுக்கான இன்றைய பலன்கள். ஆன்மீகம், கலை, இசை துறையில் துல்லியமான ஜோதிட பலன்கள். AstroTick Tamil.',
    color: 'from-teal-500 to-green-500',
    element: 'நீர்',
    icon: '♓',
    ruling_planet: 'குரு'
  }
};

// Tamil page titles and SEO data
export const tamilPageSEO = {
  // Core Pages
  '/tamil': {
    title: 'AstroTick Tamil - இலவச ஜோதிடம் | ஜாதகம் | ராசி பலன்கள்',
    description: 'இலவச தமிழ் ஜோதிடம். ஜாதகம், ராசி பலன்கள், பொருத்தம் பார்த்தல், ஜோதிடர் ஆலோசனை. துல்லியமான வேத ஜோதிட சேவைகள் தமிழில்.'
  },
  '/tamil/astrologers': {
    title: 'தமிழ் ஜோதிடர்கள் | Tamil Astrologers Online Consultation',
    description: 'அனுபவமிக்க தமிழ் ஜோதிடர்களுடன் ஆன்லைன் ஆலோசனை. காதல், திருமணம், தொழில், ஆரோக்கியம் பற்றிய துல்லியமான பலன்கள்.'
  },
  '/tamil/kundli': {
    title: 'இலவச ஜாதகம் | Free Tamil Kundli Online - AstroTick',
    description: 'இலவசமாக தமிழில் ஜாதகம் பார்க்கவும். கிரக நிலைகள், தசா காலங்கள், யோகங்கள் அனைத்தும் தமிழில். துல்லியமான வேத ஜோதிட கணிப்புகள்.'
  },
  '/tamil/daily-horoscope': {
    title: 'இன்றைய ராசி பலன்கள் தமிழில் | Daily Horoscope in Tamil',
    description: '12 ராசிகளுக்கான இன்றைய பலன்கள் தமிழில். காதல், தொழில், பணம், ஆரோக்கியம் பற்றிய துல்லியமான ஜோதிட பலன்கள்।'
  },
  '/tamil/panchang': {
    title: 'இன்றைய பஞ்சாங்கம் தமிழில் | Tamil Panchang Today',
    description: 'இன்றைய தமிழ் பஞ்சாங்கம். திதி, நட்சத்திரம், யோகம், கரணம், வாரம். சுப முகூர்த்த நேரங்கள் தமிழில்.'
  },
  '/tamil/match-making': {
    title: 'திருமண பொருத்தம் | Tamil Marriage Matching - Kundli Milan',
    description: 'இலவச திருமண பொருத்தம் பார்த்தல். 10 பொருத்தங்கள், குண மிலன், மங்கல தோஷம் எல்லாம் தமிழில். துல்லியமான பொருத்த கணிப்பு.'
  },

  // Horoscope Pages
  '/tamil/weekly-horoscope': {
    title: 'வார ராசி பலன்கள் தமிழில் | Weekly Horoscope in Tamil',
    description: '12 ராசிகளுக்கான இந்த வார பலன்கள். காதல், தொழில், பணம், ஆரோக்கியம் பற்றிய வார ஜோதிட பலன்கள் தமிழில்.'
  },
  '/tamil/monthly-horoscope': {
    title: 'மாத ராசி பலன்கள் தமிழில் | Monthly Horoscope in Tamil',
    description: '12 ராசிகளுக்கான இந்த மாத பலன்கள். விரிவான மாதாந்திர ஜோதிட பலன்கள் மற்றும் பரிகாரங்கள் தமிழில்.'
  },
  '/tamil/yearly-horoscope': {
    title: 'ஆண்டு ராசி பலன்கள் தமிழில் | Yearly Horoscope in Tamil',
    description: '2025 ஆம் ஆண்டு 12 ராசிகளுக்கான விரிவான பலன்கள். முழு ஆண்டின் ஜோதிட பலன்கள் மற்றும் பரிகாரங்கள் தமிழில்.'
  },

  // Tools Pages
  '/tamil/lagna-calculator': {
    title: 'லக்னம் கணிப்பு | Tamil Lagna Calculator Online',
    description: 'இலவச லக்னம் கணிப்பு கருவி. பிறந்த நேரம், இடம் கொடுத்து உங்கள் லக்னம் அறியவும். துல்லியமான வேத ஜோதிட கணிப்பு தமிழில்.'
  },
  '/tamil/moon-sign-checker': {
    title: 'சந்திர ராசி அறிய | Tamil Moon Sign Calculator',
    description: 'உங்கள் சந்திர ராசி அறிந்து கொள்ளுங்கள். பிறந்த விவரங்கள் கொடுத்து ராசி, நட்சத்திரம் அறியவும் தமிழில்.'
  },
  '/tamil/nakshatra-finder': {
    title: 'நட்சத்திர கண்டுபிடிப்பு | Tamil Nakshatra Finder',
    description: 'உங்கள் பிறந்த நட்சத்திரம் கண்டறியவும். 27 நட்சத்திரங்களின் விவரங்கள் மற்றும் சிறப்புகள் தமிழில்.'
  },

  // Educational Content
  '/tamil/learn-astrology/basics': {
    title: 'ஜோதிட அடிப்படைகள் | Learn Astrology Basics in Tamil',
    description: 'ஜோதிடத்தின் அடிப்படைகளை தமிழில் கற்றுக் கொள்ளுங்கள். கிரகங்கள், ராசிகள், பாவங்கள் பற்றிய முழுமையான விளக்கம்.'
  },
  '/tamil/nakshatras': {
    title: '27 நட்சத்திரங்கள் | Tamil Nakshatras Guide',
    description: '27 நட்சத்திரங்களின் விரிவான விவரங்கள். ஒவ்வொரு நட்சத்திரத்தின் சிறப்புகள், தெய்வம், குணங்கள் அனைத்தும் தமிழில்.'
  },

  // Report Pages  
  '/tamil/reports/career': {
    title: 'தொழில் ஜோதிட அறிக்கை | Career Astrology Report in Tamil',
    description: 'உங்கள் தொழில் வாழ்க்கைக்கான விரிவான ஜோதிட அறிக்கை. எந்த துறையில் வெற்றி பெறுவீர்கள் என்பதை அறியவும் தமிழில்.'
  },
  '/tamil/reports/marriage': {
    title: 'திருமண ஜோதிட அறிக்கை | Marriage Astrology Report in Tamil',
    description: 'திருமண வாழ்க்கைக்கான விரிவான ஜோதிட அறிக்கை. திருமண யோகம், துணையின் குணங்கள் அனைத்தும் தமிழில்.'
  }
};