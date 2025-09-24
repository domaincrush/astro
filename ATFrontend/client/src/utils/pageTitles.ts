/**
 * Page Title Management System for AstroTick
 * Provides SEO-optimized, unique titles for all pages
 */

interface PageTitleConfig {
  title: string;
  description?: string;
  keywords?: string[];
}

export const PAGE_TITLES: Record<string, PageTitleConfig> = {
  // Main Pages
  '/': {
    title: 'AstroTick - Free Kundli, Horoscope, Astrology Predictions & Consultation',
    description: 'Get your free Kundli, daily horoscope, birth chart analysis, and authentic Vedic astrology predictions. Professional astrology consultation with expert astrologers.',
    keywords: ['kundli', 'horoscope', 'astrology', 'birth chart', 'vedic astrology', 'prediction']
  },
  
  // Kundli & Birth Chart Pages
  '/kundli': {
    title: 'Free Kundli Generator - Accurate Birth Chart & Horoscope Analysis | AstroTick',
    description: 'Generate your free Kundli online with accurate birth chart analysis, planetary positions, dasha details, and comprehensive horoscope predictions.',
    keywords: ['free kundli', 'birth chart generator', 'horoscope analysis', 'vedic chart']
  },
  '/brihat-kundli': {
    title: 'Brihat Kundli - Detailed Birth Chart Analysis & Predictions | AstroTick',
    description: 'Get comprehensive Brihat Kundli with detailed planetary analysis, dasha periods, yogas, and life predictions based on Vedic astrology.',
    keywords: ['brihat kundli', 'detailed birth chart', 'comprehensive horoscope']
  },
  '/hindi-kundli': {
    title: 'Hindi Kundli - हिंदी कुंडली जन्मपत्री विश्लेषण | AstroTick',
    description: 'मुफ्त हिंदी कुंडली बनाएं। जन्मकुंडली विश्लेषण, ग्रह स्थिति, दशा काल और भविष्यफल प्राप्त करें।',
    keywords: ['hindi kundli', 'हिंदी कुंडली', 'जन्मपत्री', 'ज्योतिष']
  },
  '/chart-test': {
    title: 'Birth Chart Testing & Validation Tools | AstroTick',
    description: 'Test and validate your birth chart calculations with our advanced astrological testing tools and accuracy verification system.',
    keywords: ['chart testing', 'birth chart validation', 'astrology tools']
  },

  // Kundli Matching & Compatibility
  '/kundli-matching': {
    title: 'Free Kundli Matching - Guna Milan & Marriage Compatibility | AstroTick',
    description: 'Check marriage compatibility with free Kundli matching. Get Guna Milan score, dosha analysis, and detailed compatibility report for marriage.',
    keywords: ['kundli matching', 'guna milan', 'marriage compatibility', 'horoscope matching']
  },
  '/match-making': {
    title: 'Horoscope Matching for Marriage - Compatibility Analysis | AstroTick',
    description: 'Professional horoscope matching service for marriage. Comprehensive compatibility analysis based on Vedic astrology principles.',
    keywords: ['horoscope matching', 'marriage astrology', 'compatibility check']
  },
  '/love-compatibility': {
    title: 'Love Compatibility Calculator - Relationship Astrology Analysis | AstroTick',
    description: 'Check love compatibility between partners using Vedic astrology. Get detailed relationship analysis and compatibility score.',
    keywords: ['love compatibility', 'relationship astrology', 'compatibility calculator']
  },

  // Horoscope Pages
  '/horoscope': {
    title: 'Daily Horoscope - Today\'s Astrology Predictions | AstroTick',
    description: 'Read your daily horoscope predictions for love, career, health, and finance. Get accurate astrology forecasts for all zodiac signs.',
    keywords: ['daily horoscope', 'horoscope today', 'astrology predictions', 'zodiac forecast']
  },
  '/daily-horoscope': {
    title: 'Daily Horoscope 2025 - Today\'s Predictions for All Zodiac Signs | AstroTick',
    description: 'Get today\'s horoscope predictions for all 12 zodiac signs. Daily astrology forecasts for love, career, health, and money.',
    keywords: ['daily horoscope 2025', 'today horoscope', 'zodiac predictions']
  },
  '/weekly-horoscope': {
    title: 'Weekly Horoscope - 7-Day Astrology Predictions | AstroTick',
    description: 'Read your weekly horoscope for detailed 7-day predictions covering love, career, health, and financial prospects.',
    keywords: ['weekly horoscope', 'weekly predictions', '7 day forecast']
  },
  '/monthly-horoscope': {
    title: 'Monthly Horoscope - Complete Month Astrology Predictions | AstroTick',
    description: 'Get comprehensive monthly horoscope predictions with detailed analysis for career, love, health, and financial opportunities.',
    keywords: ['monthly horoscope', 'monthly predictions', 'astrology forecast']
  },
  '/yearly-horoscope': {
    title: 'Yearly Horoscope 2025 - Annual Astrology Predictions | AstroTick',
    description: 'Complete yearly horoscope 2025 with annual predictions for career, love, health, and major life events for all zodiac signs.',
    keywords: ['yearly horoscope 2025', 'annual predictions', 'year forecast']
  },
  '/love-horoscope': {
    title: 'Love Horoscope - Romance & Relationship Predictions | AstroTick',
    description: 'Get love horoscope predictions for romance, relationships, marriage timing, and compatibility with your partner.',
    keywords: ['love horoscope', 'romance predictions', 'relationship astrology']
  },
  '/career-horoscope': {
    title: 'Career Horoscope - Job & Professional Growth Predictions | AstroTick',
    description: 'Career horoscope predictions for job prospects, professional growth, business opportunities, and career changes.',
    keywords: ['career horoscope', 'job predictions', 'professional astrology']
  },
  '/health-horoscope': {
    title: 'Health Horoscope - Wellness & Medical Astrology Predictions | AstroTick',
    description: 'Health horoscope with wellness predictions, medical astrology insights, and health-related guidance based on planetary influences.',
    keywords: ['health horoscope', 'medical astrology', 'wellness predictions']
  },

  // Panchang & Muhurat Pages
  '/panchang': {
    title: 'Today\'s Panchang - Daily Hindu Calendar & Muhurat Timings | AstroTick',
    description: 'Get today\'s Panchang with Tithi, Nakshatra, Yoga, Karana, sunrise, sunset, and auspicious muhurat timings for religious activities.',
    keywords: ['panchang', 'hindu calendar', 'muhurat timings', 'tithi nakshatra']
  },
  '/shubh-muhurat': {
    title: 'Shubh Muhurat - Auspicious Timing for Important Events | AstroTick',
    description: 'Find Shubh Muhurat for weddings, griha pravesh, vehicle purchase, and other important events based on Vedic astrology.',
    keywords: ['shubh muhurat', 'auspicious timing', 'wedding muhurat', 'griha pravesh']
  },
  '/choghadiya': {
    title: 'Choghadiya Today - Good & Bad Timings for Daily Activities | AstroTick',
    description: 'Today\'s Choghadiya chart with good and bad timings for travel, business, and important activities based on planetary influences.',
    keywords: ['choghadiya', 'choghadiya today', 'good bad timing', 'travel muhurat']
  },
  '/rahu-kaal': {
    title: 'Rahu Kaal Today - Inauspicious Timing to Avoid | AstroTick',
    description: 'Today\'s Rahu Kaal timings to avoid starting new work, travel, or important activities. Daily inauspicious period calculations.',
    keywords: ['rahu kaal', 'rahu kalam', 'inauspicious timing', 'avoid timing']
  },
  '/abhijit-muhurat': {
    title: 'Abhijit Muhurat - Most Auspicious 48-Minute Daily Window | AstroTick',
    description: 'Daily Abhijit Muhurat - the most auspicious 48-minute window perfect for starting any important work or spiritual practices.',
    keywords: ['abhijit muhurat', 'auspicious window', 'daily muhurat', '48 minute timing']
  },
  '/brahma-muhurat': {
    title: 'Brahma Muhurat - Sacred Pre-Dawn Time for Spiritual Practice | AstroTick',
    description: 'Daily Brahma Muhurat timings for meditation, yoga, and spiritual practices. The most sacred pre-dawn period for self-realization.',
    keywords: ['brahma muhurat', 'pre-dawn timing', 'spiritual practice', 'meditation time']
  },
  '/hora-timings': {
    title: 'Hora Timings Today - Planetary Hours for Daily Planning | AstroTick',
    description: 'Today\'s Hora timings showing planetary hours ruled by different planets. Plan your activities according to favorable planetary influences.',
    keywords: ['hora timings', 'planetary hours', 'hora chart', 'planetary periods']
  },

  // Festivals & Special Occasions
  '/hindu-festivals': {
    title: 'Hindu Festivals 2025 Calendar - Dates, Significance & Celebrations | AstroTick',
    description: 'Complete Hindu festivals 2025 calendar with dates, religious significance, rituals, and celebration details for all major festivals.',
    keywords: ['hindu festivals 2025', 'festival calendar', 'religious dates', 'hindu celebrations']
  },
  '/festivals-2025': {
    title: 'Festival Calendar 2025 - Complete List of Indian Festivals | AstroTick',
    description: 'Comprehensive festival calendar 2025 with dates and significance of all Indian festivals, fasts, and religious observances.',
    keywords: ['festivals 2025', 'indian festivals', 'festival dates', 'religious calendar']
  },

  // Astrology Tools & Calculators
  '/moon-sign-checker': {
    title: 'Moon Sign Calculator - Find Your Rashi & Emotional Nature | AstroTick',
    description: 'Calculate your Moon sign (Rashi) and discover your emotional nature, instincts, and subconscious patterns in Vedic astrology.',
    keywords: ['moon sign calculator', 'rashi calculator', 'lunar sign', 'emotional astrology']
  },
  '/nakshatra-finder': {
    title: 'Nakshatra Calculator - Find Your Birth Star & Characteristics | AstroTick',
    description: 'Find your Nakshatra (birth star) and discover your personality traits, compatible partners, and spiritual qualities.',
    keywords: ['nakshatra calculator', 'birth star finder', 'nakshatra characteristics', 'lunar mansion']
  },
  '/lagna-calculator': {
    title: 'Lagna Calculator - Ascendant Sign & Rising Sign Analysis | AstroTick',
    description: 'Calculate your Lagna (Ascendant/Rising sign) and understand your personality, appearance, and life approach in Vedic astrology.',
    keywords: ['lagna calculator', 'ascendant calculator', 'rising sign', 'vedic ascendant']
  },
  '/dosham-detector': {
    title: 'Dosha Detector - Mangal, Kaal Sarp, Shani Dosha Analysis | AstroTick',
    description: 'Detect major doshas in your horoscope including Mangal Dosha, Kaal Sarp Dosha, Shani Dosha with remedies and solutions.',
    keywords: ['dosha detector', 'mangal dosha', 'kaal sarp dosha', 'shani dosha', 'horoscope doshas']
  },
  '/lucky-numbers': {
    title: 'Lucky Numbers Calculator - Personalized Numerology Numbers | AstroTick',
    description: 'Generate your lucky numbers based on birth date and name numerology. Get personalized lucky numbers for lottery, games, and important decisions.',
    keywords: ['lucky numbers', 'numerology calculator', 'lucky number generator', 'personal numbers']
  },
  '/baby-naming': {
    title: 'Baby Name Generator - Nakshatra Based Hindu Baby Names | AstroTick',
    description: 'Generate auspicious baby names based on birth nakshatra and numerology. Find perfect Hindu baby names with meanings and significance.',
    keywords: ['baby name generator', 'nakshatra baby names', 'hindu baby names', 'auspicious names']
  },
  '/dasha-calculator': {
    title: 'Dasha Calculator - Vimshottari Dasha Periods & Timeline | AstroTick',
    description: 'Calculate your Vimshottari Dasha periods and planetary timelines. Understand current and future dasha effects on your life.',
    keywords: ['dasha calculator', 'vimshottari dasha', 'planetary periods', 'mahadasha antardasha']
  },
  '/lal-kitab': {
    title: 'Lal Kitab Astrology - Red Book Remedies & Predictions | AstroTick',
    description: 'Lal Kitab astrology analysis with unique remedies, planetary positions, and practical solutions based on the famous Red Book system.',
    keywords: ['lal kitab', 'red book astrology', 'lal kitab remedies', 'practical astrology']
  },
  '/sade-sati': {
    title: 'Sade Sati Calculator - Saturn Transit Effects & Remedies | AstroTick',
    description: 'Calculate your Sade Sati period and understand Saturn\'s 7.5-year transit effects. Get remedies and guidance for challenging phases.',
    keywords: ['sade sati calculator', 'saturn transit', 'shani sade sati', 'saturn effects']
  },
  '/numerology': {
    title: 'Numerology Calculator - Name & Birth Date Numerology Analysis | AstroTick',
    description: 'Free numerology calculator for life path number, destiny number, and personality analysis based on your name and birth date.',
    keywords: ['numerology calculator', 'life path number', 'numerology analysis', 'destiny number']
  },

  // Premium Reports
  '/life-report': {
    title: 'Life Report - Comprehensive Astrology Analysis & Predictions | AstroTick',
    description: 'Get detailed life report with career, marriage, health, and financial predictions. Comprehensive astrology analysis for life guidance.',
    keywords: ['life report', 'astrology report', 'life predictions', 'comprehensive horoscope']
  },
  '/marriage-astrology': {
    title: 'Marriage Astrology - Wedding Timing & Compatibility Analysis | AstroTick',
    description: 'Marriage astrology consultation for wedding timing, spouse characteristics, and marital compatibility based on Vedic principles.',
    keywords: ['marriage astrology', 'wedding timing', 'spouse prediction', 'marital compatibility']
  },

  // Additional Services
  '/divination': {
    title: 'Divination Services - Tarot, Palmistry & Spiritual Guidance | AstroTick',
    description: 'Professional divination services including tarot reading, palmistry, and spiritual guidance for life questions and decisions.',
    keywords: ['divination', 'tarot reading', 'palmistry', 'spiritual guidance']
  },
  '/palmistry': {
    title: 'Palmistry Reading - Hand Reading & Palm Analysis | AstroTick',
    description: 'Professional palmistry reading and hand analysis to understand your personality, career, love life, and destiny through palm lines.',
    keywords: ['palmistry', 'palm reading', 'hand analysis', 'palm lines']
  },
  '/gemstones': {
    title: 'Gemstone Recommendation - Astrological Gems & Remedies | AstroTick',
    description: 'Get personalized gemstone recommendations based on your horoscope. Authentic astrological gems for health, wealth, and success.',
    keywords: ['gemstone recommendation', 'astrological gems', 'birthstone', 'planetary gems']
  },
  '/vastu': {
    title: 'Vastu Shastra Consultation - Home & Office Vastu Tips | AstroTick',
    description: 'Vastu Shastra consultation for home and office. Get authentic Vastu tips for prosperity, peace, and positive energy flow.',
    keywords: ['vastu shastra', 'vastu tips', 'home vastu', 'office vastu']
  },

  // 2025 Special Pages
  '/horoscope-2025': {
    title: 'Horoscope 2025 - Complete Year Predictions for All Zodiac Signs | AstroTick',
    description: 'Comprehensive horoscope 2025 with detailed yearly predictions for love, career, health, and finance for all zodiac signs.',
    keywords: ['horoscope 2025', 'yearly predictions 2025', 'astrology 2025', 'zodiac forecast 2025']
  },
  '/numerology-2025': {
    title: 'Numerology 2025 - Year Number Analysis & Predictions | AstroTick',
    description: 'Numerology predictions for 2025 based on personal year numbers. Discover what year 2025 holds for you numerologically.',
    keywords: ['numerology 2025', 'personal year number 2025', 'numerology forecast']
  },
  '/tarot-2025': {
    title: 'Tarot Predictions 2025 - Annual Tarot Card Reading | AstroTick',
    description: 'Annual tarot predictions for 2025 covering love, career, and life changes. Comprehensive yearly tarot card reading.',
    keywords: ['tarot 2025', 'tarot predictions 2025', 'yearly tarot reading']
  },

  // Information & Support Pages
  '/about': {
    title: 'About AstroTick - Professional Vedic Astrology Platform | AstroTick',
    description: 'Learn about AstroTick\'s mission to provide authentic Vedic astrology services, accurate predictions, and professional astrological guidance.',
    keywords: ['about astrotick', 'vedic astrology platform', 'professional astrologers']
  },
  '/support': {
    title: 'Customer Support - Help & Contact Information | AstroTick',
    description: 'Get help and support for AstroTick services. Contact our customer service team for assistance with your astrology queries.',
    keywords: ['customer support', 'help center', 'contact astrotick', 'astrology help']
  },
  '/privacy-policy': {
    title: 'Privacy Policy - Data Protection & Privacy Guidelines | AstroTick',
    description: 'AstroTick privacy policy explaining how we collect, use, and protect your personal information and astrology data.',
    keywords: ['privacy policy', 'data protection', 'privacy guidelines']
  },
  '/terms-of-service': {
    title: 'Terms of Service - Usage Agreement & Guidelines | AstroTick',
    description: 'AstroTick terms of service and usage agreement for our astrology platform and consultation services.',
    keywords: ['terms of service', 'usage agreement', 'service terms']
  },
  '/refund-policy': {
    title: 'Refund Policy - Money Back Guarantee Terms | AstroTick',
    description: 'AstroTick refund policy and money-back guarantee terms for our paid astrology services and consultations.',
    keywords: ['refund policy', 'money back guarantee', 'refund terms']
  }
};

/**
 * Set page title and meta description
 */
export const setPageTitle = (pathname: string): void => {
  const config = PAGE_TITLES[pathname] || PAGE_TITLES['/'];
  
  // Set title
  document.title = config.title;
  
  // Set meta description
  let descriptionMeta = document.querySelector('meta[name="description"]');
  if (!descriptionMeta) {
    descriptionMeta = document.createElement('meta');
    descriptionMeta.setAttribute('name', 'description');
    document.head.appendChild(descriptionMeta);
  }
  descriptionMeta.setAttribute('content', config.description || '');
  
  // Set meta keywords
  if (config.keywords) {
    let keywordsMeta = document.querySelector('meta[name="keywords"]');
    if (!keywordsMeta) {
      keywordsMeta = document.createElement('meta');
      keywordsMeta.setAttribute('name', 'keywords');
      document.head.appendChild(keywordsMeta);
    }
    keywordsMeta.setAttribute('content', config.keywords.join(', '));
  }
  
  // Set Open Graph tags
  updateOpenGraphTags(config.title, config.description || '', pathname);
};

/**
 * Update Open Graph meta tags for social sharing
 */
const updateOpenGraphTags = (title: string, description: string, pathname: string): void => {
  const ogTags = [
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: `https://astrotick.com${pathname}` },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'AstroTick' },
    { property: 'og:image', content: 'https://astrotick.com/assets/astrotick-og-image.png' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description }
  ];
  
  ogTags.forEach(tag => {
    const property = tag.property || tag.name;
    let meta = document.querySelector(`meta[${property ? 'property' : 'name'}="${property || tag.name}"]`);
    
    if (!meta) {
      meta = document.createElement('meta');
      if (tag.property) {
        meta.setAttribute('property', tag.property);
      } else {
        meta.setAttribute('name', tag.name!);
      }
      document.head.appendChild(meta);
    }
    
    meta.setAttribute('content', tag.content);
  });
};

/**
 * Get page title for a specific route
 */
export const getPageTitle = (pathname: string): string => {
  return PAGE_TITLES[pathname]?.title || PAGE_TITLES['/'].title;
};

/**
 * Get page description for a specific route
 */
export const getPageDescription = (pathname: string): string => {
  return PAGE_TITLES[pathname]?.description || PAGE_TITLES['/'].description || '';
};