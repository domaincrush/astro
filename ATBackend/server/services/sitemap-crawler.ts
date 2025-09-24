import { indexNowService } from './indexnow-service';
import { storage } from '../storage';

export interface CrawledUrl {
  url: string;
  contentType: string;
  priority: number;
  lastModified?: Date;
  changeFreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
}

export class SitemapCrawler {
  private static instance: SitemapCrawler;
  private baseUrl = 'https://astrotick.com';

  private constructor() {}

  static getInstance(): SitemapCrawler {
    if (!SitemapCrawler.instance) {
      SitemapCrawler.instance = new SitemapCrawler();
    }
    return SitemapCrawler.instance;
  }

  // Generate all possible URLs for the astrology platform
  async generateAllUrls(): Promise<CrawledUrl[]> {
    const urls: CrawledUrl[] = [];

    // Core pages - highest priority
    const corePages = [
      { path: '/', contentType: 'homepage', priority: 1.0 },
      { path: '/horoscope', contentType: 'horoscope', priority: 0.9 },
      { path: '/calculators', contentType: 'tools', priority: 0.9 },
      { path: '/premium-report', contentType: 'services', priority: 0.9 },
      { path: '/marriage-report', contentType: 'services', priority: 0.9 },
      { path: '/consultation', contentType: 'services', priority: 0.8 },
      { path: '/panchang', contentType: 'panchang', priority: 0.8 },
      { path: '/articles', contentType: 'content', priority: 0.8 }
    ];

    corePages.forEach(page => {
      urls.push({
        url: `${this.baseUrl}${page.path}`,
        contentType: page.contentType,
        priority: page.priority,
        changeFreq: 'daily'
      });
    });

    // Zodiac signs
    const zodiacSigns = [
      'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
      'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
    ];

    // Horoscope pages for all zodiac signs
    const periods = ['daily', 'weekly', 'monthly'];
    periods.forEach(period => {
      // Main period pages
      urls.push({
        url: `${this.baseUrl}/horoscope/${period}`,
        contentType: 'horoscope',
        priority: 0.8,
        changeFreq: period === 'daily' ? 'daily' : period === 'weekly' ? 'weekly' : 'monthly'
      });

      // Individual zodiac sign pages
      zodiacSigns.forEach(sign => {
        urls.push({
          url: `${this.baseUrl}/horoscope/${sign}/${period}`,
          contentType: 'horoscope',
          priority: 0.7,
          changeFreq: period === 'daily' ? 'daily' : period === 'weekly' ? 'weekly' : 'monthly'
        });
      });
    });

    // Calculator tools
    const calculators = [
      'moon-sign', 'lagna', 'nakshatra', 'dosham', 'baby-name', 
      'dasha', 'kundli-matching', 'birth-chart', 'compatibility'
    ];

    calculators.forEach(calc => {
      urls.push({
        url: `${this.baseUrl}/calculators/${calc}`,
        contentType: 'tools',
        priority: 0.7,
        changeFreq: 'weekly'
      });
    });

    // Panchang pages
    const panchangPages = [
      'today', 'tomorrow', 'yesterday', 'calendar',
      'festivals', 'ekadashi', 'purnima', 'amavasya'
    ];

    panchangPages.forEach(page => {
      urls.push({
        url: `${this.baseUrl}/panchang/${page}`,
        contentType: 'panchang',
        priority: 0.6,
        changeFreq: page === 'today' ? 'daily' : 'weekly'
      });
    });

    // Article categories and topics
    const articleCategories = [
      'vedic-astrology', 'western-astrology', 'chinese-astrology',
      'numerology', 'tarot', 'palmistry', 'face-reading',
      'vastu', 'feng-shui', 'meditation', 'chakras',
      'crystals', 'gemstones', 'mantras', 'remedies'
    ];

    articleCategories.forEach(category => {
      urls.push({
        url: `${this.baseUrl}/articles/${category}`,
        contentType: 'article',
        priority: 0.6,
        changeFreq: 'weekly'
      });
    });

    // Specific articles
    const specificArticles = [
      'venus-transit-august-2025',
      'sun-ketu-conjunction-leo',
      'saturn-uranus-sextile-2025',
      'ganesh-chaturthi-2025-astrological-significance',
      'new-moon-leo-august-2025',
      'venus-combust-leo-september-2025',
      'mercury-retrograde-effects',
      'mars-transit-predictions',
      'jupiter-blessings-2025',
      'saturn-lessons-2025',
      'rahu-ketu-transit-effects',
      'solar-eclipse-effects',
      'lunar-eclipse-predictions',
      'navratri-2025-significance',
      'diwali-2025-muhurat'
    ];

    specificArticles.forEach(article => {
      urls.push({
        url: `${this.baseUrl}/articles/${article}`,
        contentType: 'article',
        priority: 0.6,
        changeFreq: 'monthly'
      });
    });

    // Astrology specializations
    const specializations = [
      'career-astrology', 'health-astrology', 'finance-astrology',
      'love-astrology', 'marriage-astrology', 'education-astrology',
      'children-astrology', 'travel-astrology', 'property-astrology',
      'business-astrology', 'spiritual-guidance'
    ];

    specializations.forEach(spec => {
      urls.push({
        url: `${this.baseUrl}/${spec}`,
        contentType: 'specialization',
        priority: 0.6,
        changeFreq: 'weekly'
      });
    });

    // Language-specific pages
    const languages = ['tamil', 'hindi', 'telugu'];
    languages.forEach(lang => {
      urls.push({
        url: `${this.baseUrl}/${lang}`,
        contentType: 'language',
        priority: 0.7,
        changeFreq: 'daily'
      });

      // Language-specific horoscopes
      zodiacSigns.forEach(sign => {
        periods.forEach(period => {
          urls.push({
            url: `${this.baseUrl}/${lang}/horoscope/${sign}/${period}`,
            contentType: 'horoscope',
            priority: 0.6,
            changeFreq: period === 'daily' ? 'daily' : 'weekly'
          });
        });
      });
    });

    // Additional service pages
    const servicePages = [
      'astrologers', 'chat', 'video-consultation', 'phone-consultation',
      'email-consultation', 'pricing', 'packages', 'testimonials',
      'success-stories', 'case-studies'
    ];

    servicePages.forEach(service => {
      urls.push({
        url: `${this.baseUrl}/${service}`,
        contentType: 'services',
        priority: 0.5,
        changeFreq: 'weekly'
      });
    });

    // Legal and info pages
    const infoPages = [
      'about', 'contact', 'privacy-policy', 'terms-of-service',
      'refund-policy', 'faq', 'help', 'sitemap'
    ];

    infoPages.forEach(info => {
      urls.push({
        url: `${this.baseUrl}/${info}`,
        contentType: 'info',
        priority: 0.3,
        changeFreq: 'monthly'
      });
    });

    // Blog and educational content
    const educationalContent = [
      'blog', 'learn-astrology', 'astrology-basics', 'planet-meanings',
      'house-meanings', 'aspect-meanings', 'yoga-types', 'dosha-types',
      'nakshatra-guide', 'rashi-guide', 'dasha-systems', 'ayanamsa-systems'
    ];

    educationalContent.forEach(content => {
      urls.push({
        url: `${this.baseUrl}/${content}`,
        contentType: 'educational',
        priority: 0.5,
        changeFreq: 'weekly'
      });
    });

    // Lucky and guidance pages
    const guidancePages = [
      'lucky-numbers', 'lucky-colors', 'lucky-days', 'lucky-stones',
      'auspicious-times', 'muhurat', 'festival-dates', 'vratham-dates',
      'tithi-calculator', 'nakshatra-calculator', 'yoga-calculator'
    ];

    guidancePages.forEach(guidance => {
      urls.push({
        url: `${this.baseUrl}/${guidance}`,
        contentType: 'guidance',
        priority: 0.5,
        changeFreq: 'weekly'
      });
    });

    // Fetch dynamic content from database
    try {
      const { storage } = await import('../storage');
      
      // Get all astrologers
      const astrologers = await storage.getAllAstrologers();
      astrologers.forEach(astrologer => {
        urls.push({
          url: `${this.baseUrl}/astrologer/${astrologer.id}`,
          contentType: 'astrologer-profile',
          priority: 0.6,
          changeFreq: 'weekly'
        });
      });

      // Get all articles  
      const articles = await storage.getAllArticles();
      articles.forEach(article => {
        urls.push({
          url: `${this.baseUrl}/articles/${article.slug}`,
          contentType: 'article',
          priority: 0.7,
          changeFreq: 'monthly'
        });
      });

      console.log(`📊 Generated ${urls.length} URLs (${astrologers.length} astrologers, ${articles.length} articles) for IndexNow submission`);
    } catch (error) {
      console.error('Error fetching dynamic content for sitemap:', error);
      console.log(`📊 Generated ${urls.length} static URLs for IndexNow submission`);
    }

    return urls;
  }

  // Submit all URLs to IndexNow in batches
  async submitAllUrls(): Promise<{
    totalUrls: number;
    submitted: number;
    failed: number;
    results: Array<{
      batch: number;
      urls: number;
      status: string;
      submissionId?: number;
    }>;
  }> {
    const allUrls = await this.generateAllUrls();
    const batchSize = 50; // IndexNow recommended batch size
    const results = [];
    let submitted = 0;
    let failed = 0;

    console.log(`🚀 Starting comprehensive URL submission: ${allUrls.length} total URLs`);

    // Group URLs by content type for better organization
    const urlsByType = allUrls.reduce((acc, crawledUrl) => {
      if (!acc[crawledUrl.contentType]) {
        acc[crawledUrl.contentType] = [];
      }
      acc[crawledUrl.contentType].push(crawledUrl.url);
      return acc;
    }, {} as Record<string, string[]>);

    // Submit each content type in batches
    let batchNumber = 1;
    for (const [contentType, urls] of Object.entries(urlsByType)) {
      console.log(`📤 Processing ${contentType}: ${urls.length} URLs`);

      // Split into batches of 50
      for (let i = 0; i < urls.length; i += batchSize) {
        const batchUrls = urls.slice(i, i + batchSize);
        
        try {
          const result = await indexNowService.submitUrls(batchUrls, contentType);
          
          if (result.success) {
            submitted += batchUrls.length;
            results.push({
              batch: batchNumber,
              urls: batchUrls.length,
              status: 'success',
              submissionId: result.submissionId
            });
            console.log(`✅ Batch ${batchNumber}: ${batchUrls.length} URLs submitted successfully`);
          } else {
            failed += batchUrls.length;
            results.push({
              batch: batchNumber,
              urls: batchUrls.length,
              status: 'failed'
            });
            console.log(`❌ Batch ${batchNumber}: Failed to submit ${batchUrls.length} URLs`);
          }
        } catch (error) {
          failed += batchUrls.length;
          results.push({
            batch: batchNumber,
            urls: batchUrls.length,
            status: 'error'
          });
          console.error(`💥 Batch ${batchNumber} error:`, error);
        }

        batchNumber++;

        // Add delay between batches to avoid rate limiting
        if (i + batchSize < urls.length) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }

      // Add delay between content types
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    const summary = {
      totalUrls: allUrls.length,
      submitted,
      failed,
      results
    };

    console.log(`🎯 Submission complete: ${submitted}/${allUrls.length} URLs submitted successfully`);

    // Store submission summary
    try {
      await storage.createIndexNowSubmission({
        urls: allUrls.map(u => u.url),
        contentType: 'comprehensive-sitemap',
        status: submitted > 0 ? 'success' : 'failed',
        responseCode: 200,
        responseMessage: `Comprehensive submission: ${submitted} successful, ${failed} failed`
      });
    } catch (dbError) {
      console.error('Failed to store comprehensive submission record:', dbError);
    }

    return summary;
  }

  // Generate XML sitemap
  async generateXMLSitemap(): Promise<string> {
    const urls = await this.generateAllUrls();
    const currentDate = new Date().toISOString().split('T')[0];

    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    urls.forEach(crawledUrl => {
      sitemap += '  <url>\n';
      sitemap += `    <loc>${crawledUrl.url}</loc>\n`;
      sitemap += `    <lastmod>${currentDate}</lastmod>\n`;
      sitemap += `    <changefreq>${crawledUrl.changeFreq || 'weekly'}</changefreq>\n`;
      sitemap += `    <priority>${crawledUrl.priority}</priority>\n`;
      sitemap += '  </url>\n';
    });

    sitemap += '</urlset>';
    return sitemap;
  }

  // Get URL statistics by content type
  async getUrlStatistics(): Promise<Record<string, number>> {
    const urls = await this.generateAllUrls();
    const stats: Record<string, number> = {};

    urls.forEach(crawledUrl => {
      stats[crawledUrl.contentType] = (stats[crawledUrl.contentType] || 0) + 1;
    });

    return stats;
  }
}

export const sitemapCrawler = SitemapCrawler.getInstance();