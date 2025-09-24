/**
 * Automatic Bing URL Submission Hooks
 * Auto-submit new content URLs to Bing when content is created/updated
 */

import { bingIndexingService } from '../services/bing-indexing-service';

interface ContentSubmissionOptions {
  delay?: number; // Delay before submission in milliseconds
  batchSize?: number; // URLs per batch
}

/**
 * Auto-submit horoscope URLs when new horoscopes are generated
 */
export async function autoSubmitHoroscopeUrls(
  signs: string[],
  types: ('daily' | 'weekly' | 'monthly')[],
  baseUrl: string = process.env.SITE_URL || 'https://astrotick.com',
  options: ContentSubmissionOptions = {}
): Promise<void> {
  const { delay = 5000, batchSize = 10 } = options;
  
  // Generate horoscope URLs
  const urls: string[] = [];
  
  signs.forEach(sign => {
    types.forEach(type => {
      urls.push(`${baseUrl}/horoscope/${sign}/${type}`);
      urls.push(`${baseUrl}/horoscope/${sign}`);
    });
  });
  
  // Remove duplicates
  const uniqueUrls = [...new Set(urls)];
  
  if (uniqueUrls.length > 0) {
    // Add delay to avoid immediate submission after content creation
    setTimeout(async () => {
      console.log(`🔄 Auto-submitting ${uniqueUrls.length} horoscope URLs to Bing...`);
      await bingIndexingService.autoSubmitNewContent('horoscope', uniqueUrls);
    }, delay);
  }
}

/**
 * Auto-submit article URLs when new blog articles are created
 */
export async function autoSubmitArticleUrls(
  articleSlugs: string[],
  baseUrl: string = process.env.SITE_URL || 'https://astrotick.com',
  options: ContentSubmissionOptions = {}
): Promise<void> {
  const { delay = 5000 } = options;
  
  // Generate article URLs
  const urls = articleSlugs.map(slug => `${baseUrl}/articles/${slug}`);
  
  if (urls.length > 0) {
    setTimeout(async () => {
      console.log(`🔄 Auto-submitting ${urls.length} article URLs to Bing...`);
      await bingIndexingService.autoSubmitNewContent('article', urls);
    }, delay);
  }
}

/**
 * Auto-submit report URLs when new reports are accessed/generated
 */
export async function autoSubmitReportUrls(
  reportTypes: string[],
  baseUrl: string = process.env.SITE_URL || 'https://astrotick.com',
  options: ContentSubmissionOptions = {}
): Promise<void> {
  const { delay = 10000 } = options; // Longer delay for reports
  
  // Generate report URLs
  const urls = reportTypes.map(type => `${baseUrl}/reports/${type}`);
  
  if (urls.length > 0) {
    setTimeout(async () => {
      console.log(`🔄 Auto-submitting ${urls.length} report URLs to Bing...`);
      await bingIndexingService.autoSubmitNewContent('report', urls);
    }, delay);
  }
}

/**
 * Submit calculator URLs when new calculators are added
 */
export async function autoSubmitCalculatorUrls(
  calculatorTypes: string[],
  baseUrl: string = process.env.SITE_URL || 'https://astrotick.com',
  options: ContentSubmissionOptions = {}
): Promise<void> {
  const { delay = 3000 } = options;
  
  const urls = calculatorTypes.map(type => `${baseUrl}/calculators/${type}`);
  
  if (urls.length > 0) {
    setTimeout(async () => {
      console.log(`🔄 Auto-submitting ${urls.length} calculator URLs to Bing...`);
      await bingIndexingService.submitUrlsInBatches(urls);
    }, delay);
  }
}

/**
 * Bulk submit all main site URLs (use for initial setup)
 */
export async function submitAllSiteUrls(): Promise<{ success: boolean; message: string; details?: any }> {
  try {
    console.log('🚀 Starting bulk submission of all site URLs to Bing...');
    
    const siteUrls = bingIndexingService.generateSiteUrls();
    const result = await bingIndexingService.submitUrlsInBatches(siteUrls, 10);
    
    console.log(`✅ Bulk submission completed: ${result.results.length} batches processed`);
    
    return {
      success: result.success,
      message: `Bulk submission completed: ${siteUrls.length} total URLs processed`,
      details: {
        totalUrls: siteUrls.length,
        batchResults: result.results
      }
    };
  } catch (error) {
    console.error('❌ Bulk URL submission failed:', error);
    return {
      success: false,
      message: `Bulk submission failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

/**
 * Daily automated submission of dynamic content
 * This should be called by a cron job or scheduler
 */
export async function dailyContentSubmission(): Promise<void> {
  try {
    console.log('📅 Starting daily automated content submission to Bing...');
    
    const baseUrl = process.env.SITE_URL || 'https://astrotick.com';
    const today = new Date().toISOString().split('T')[0];
    
    // Submit today's horoscope URLs
    const zodiacSigns = [
      'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
      'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
    ];
    
    await autoSubmitHoroscopeUrls(zodiacSigns, ['daily'], baseUrl, { delay: 1000 });
    
    // Submit panchang URL
    setTimeout(async () => {
      await bingIndexingService.submitSingleUrl(`${baseUrl}/panchang`);
    }, 2000);
    
    console.log('✅ Daily automated content submission completed');
  } catch (error) {
    console.error('❌ Daily content submission failed:', error);
  }
}

/**
 * Integration hook for horoscope generation
 * Call this after generating new horoscopes
 */
export const onHoroscopeGenerated = (signs: string[], types: ('daily' | 'weekly' | 'monthly')[]) => {
  autoSubmitHoroscopeUrls(signs, types, undefined, { delay: 2000 });
};

/**
 * Integration hook for new article creation
 * Call this after publishing new articles
 */
export const onArticlePublished = (articleSlugs: string[]) => {
  autoSubmitArticleUrls(articleSlugs, undefined, { delay: 3000 });
};

/**
 * Integration hook for report generation
 * Call this when reports are accessed/generated
 */
export const onReportGenerated = (reportType: string) => {
  autoSubmitReportUrls([reportType], undefined, { delay: 5000 });
};