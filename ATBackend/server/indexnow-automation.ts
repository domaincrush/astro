import cron from 'node-cron';
import { indexNowService } from './services/indexnow-service';

export class IndexNowAutomationManager {
  private static instance: IndexNowAutomationManager;
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): IndexNowAutomationManager {
    if (!IndexNowAutomationManager.instance) {
      IndexNowAutomationManager.instance = new IndexNowAutomationManager();
    }
    return IndexNowAutomationManager.instance;
  }

  /**
   * Initialize IndexNow automation with cron jobs
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.log('🔄 IndexNow automation already initialized');
      return;
    }

    try {
      // Initialize IndexNow configuration
      await indexNowService.initializeConfig();
      
      // Schedule daily horoscope submissions
      this.scheduleDailyHoroscopes();
      
      // Schedule retry of failed submissions
      this.scheduleFailedRetries();
      
      // Schedule weekly horoscope submissions
      this.scheduleWeeklyHoroscopes();
      
      // Schedule monthly horoscope submissions
      this.scheduleMonthlyHoroscopes();

      this.isInitialized = true;
      console.log('✅ IndexNow automation initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize IndexNow automation:', error);
      throw error;
    }
  }

  /**
   * Schedule daily horoscope URL submissions
   * Runs every day at 6:00 AM IST
   */
  private scheduleDailyHoroscopes(): void {
    cron.schedule('0 6 * * *', async () => {
      try {
        console.log('📅 Running scheduled daily horoscope IndexNow submission...');
        const result = await indexNowService.submitHoroscopeUrls('daily');
        
        if (result.success) {
          console.log('✅ Daily horoscope URLs submitted to IndexNow successfully');
        } else {
          console.log('❌ Daily horoscope IndexNow submission failed:', result.message);
        }
      } catch (error) {
        console.error('Error in scheduled daily horoscope submission:', error);
      }
    }, {
      timezone: 'Asia/Kolkata'
    });
  }

  /**
   * Schedule weekly horoscope URL submissions
   * Runs every Monday at 7:00 AM IST
   */
  private scheduleWeeklyHoroscopes(): void {
    cron.schedule('0 7 * * 1', async () => {
      try {
        console.log('📅 Running scheduled weekly horoscope IndexNow submission...');
        const result = await indexNowService.submitHoroscopeUrls('weekly');
        
        if (result.success) {
          console.log('✅ Weekly horoscope URLs submitted to IndexNow successfully');
        } else {
          console.log('❌ Weekly horoscope IndexNow submission failed:', result.message);
        }
      } catch (error) {
        console.error('Error in scheduled weekly horoscope submission:', error);
      }
    }, {
      timezone: 'Asia/Kolkata'
    });
  }

  /**
   * Schedule monthly horoscope URL submissions
   * Runs on the 1st day of every month at 8:00 AM IST
   */
  private scheduleMonthlyHoroscopes(): void {
    cron.schedule('0 8 1 * *', async () => {
      try {
        console.log('📅 Running scheduled monthly horoscope IndexNow submission...');
        const result = await indexNowService.submitHoroscopeUrls('monthly');
        
        if (result.success) {
          console.log('✅ Monthly horoscope URLs submitted to IndexNow successfully');
        } else {
          console.log('❌ Monthly horoscope IndexNow submission failed:', result.message);
        }
      } catch (error) {
        console.error('Error in scheduled monthly horoscope submission:', error);
      }
    }, {
      timezone: 'Asia/Kolkata'
    });
  }

  /**
   * Schedule retry of failed IndexNow submissions
   * Runs every 2 hours
   */
  private scheduleFailedRetries(): void {
    cron.schedule('0 */2 * * *', async () => {
      try {
        console.log('🔄 Running scheduled IndexNow failed submission retries...');
        await indexNowService.retryFailedSubmissions();
      } catch (error) {
        console.error('Error in scheduled retry of failed submissions:', error);
      }
    }, {
      timezone: 'Asia/Kolkata'
    });
  }

  /**
   * Submit URL immediately when content is published
   */
  async submitContentImmediately(contentType: 'article' | 'horoscope' | 'panchang' | 'custom', data: {
    urls?: string[];
    articleSlug?: string;
    articleId?: number;
    horoscopePeriod?: 'daily' | 'weekly' | 'monthly';
    panchangDate?: string;
  }): Promise<void> {
    try {
      let result;

      switch (contentType) {
        case 'article':
          if (!data.articleSlug) throw new Error('Article slug required');
          result = await indexNowService.submitArticleUrl(data.articleSlug, data.articleId);
          break;
          
        case 'horoscope':
          result = await indexNowService.submitHoroscopeUrls(data.horoscopePeriod || 'daily');
          break;
          
        case 'panchang':
          result = await indexNowService.submitPanchangUrl(data.panchangDate);
          break;
          
        case 'custom':
          if (!data.urls) throw new Error('URLs required for custom submission');
          result = await indexNowService.submitUrls(data.urls, 'custom');
          break;
          
        default:
          throw new Error(`Unknown content type: ${contentType}`);
      }

      if (result.success) {
        console.log(`✅ Immediate IndexNow submission successful for ${contentType}`);
      } else {
        console.log(`❌ Immediate IndexNow submission failed for ${contentType}:`, result.message);
      }
    } catch (error) {
      console.error(`Error in immediate IndexNow submission for ${contentType}:`, error);
    }
  }

  /**
   * Get automation status and statistics
   */
  getStatus(): {
    initialized: boolean;
    nextDailyRun: string;
    nextWeeklyRun: string;
    nextMonthlyRun: string;
    nextRetryRun: string;
  } {
    return {
      initialized: this.isInitialized,
      nextDailyRun: 'Every day at 6:00 AM IST',
      nextWeeklyRun: 'Every Monday at 7:00 AM IST',
      nextMonthlyRun: '1st day of month at 8:00 AM IST',
      nextRetryRun: 'Every 2 hours'
    };
  }
}

// Export singleton instance
export const indexNowAutomation = IndexNowAutomationManager.getInstance();