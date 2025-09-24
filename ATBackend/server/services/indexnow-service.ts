import crypto from 'crypto';
import { storage } from '../storage';
import type { InsertIndexNowSubmission, IndexNowSubmission, IndexNowConfig } from '@shared/schema';

export interface IndexNowResponse {
  success: boolean;
  statusCode?: number;
  message?: string;
  submissionId?: number;
}

export class IndexNowService {
  private static instance: IndexNowService;
  private config: IndexNowConfig | null = null;
  
  private constructor() {}
  
  public static getInstance(): IndexNowService {
    if (!IndexNowService.instance) {
      IndexNowService.instance = new IndexNowService();
    }
    return IndexNowService.instance;
  }

  /**
   * Initialize IndexNow configuration for the domain
   */
  async initializeConfig(domain: string = 'astrotick.com'): Promise<void> {
    try {
      this.config = await storage.getIndexNowConfig(domain);
      
      if (!this.config) {
        // Generate new API key and create config
        const apiKey = this.generateApiKey();
        const keyLocation = `https://${domain}/${apiKey}.txt`;
        
        await storage.createIndexNowConfig({
          domain,
          apiKey,
          keyLocation,
          isActive: true
        });
        
        this.config = await storage.getIndexNowConfig(domain);
        console.log(`🔑 IndexNow initialized for ${domain} with key: ${apiKey}`);
      }
    } catch (error) {
      console.error('Failed to initialize IndexNow config:', error);
      throw error;
    }
  }

  /**
   * Generate a secure API key for IndexNow
   */
  private generateApiKey(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  /**
   * Submit URLs to IndexNow API
   */
  async submitUrls(
    urls: string[], 
    contentType: string = 'custom', 
    relatedId?: number
  ): Promise<IndexNowResponse> {
    try {
      if (!this.config) {
        await this.initializeConfig();
      }

      if (!this.config || !this.config.isActive) {
        throw new Error('IndexNow configuration not available or inactive');
      }

      // Filter and validate URLs
      const validUrls = urls.filter(url => this.isValidUrl(url));
      if (validUrls.length === 0) {
        return { success: false, message: 'No valid URLs provided' };
      }

      // Create submission record
      const submission = await storage.createIndexNowSubmission({
        urls: validUrls,
        contentType,
        relatedId,
        status: 'pending',
        retryCount: 0
      });

      // Prepare IndexNow payload
      const payload = {
        host: this.config.domain,
        key: this.config.apiKey,
        keyLocation: this.config.keyLocation,
        urlList: validUrls
      };

      console.log(`📤 Submitting ${validUrls.length} URLs to IndexNow:`, validUrls);

      // Submit to IndexNow API
      const response = await fetch('https://api.indexnow.org/IndexNow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'AstroTick-IndexNow/1.0'
        },
        body: JSON.stringify(payload)
      });

      // Update submission status
      await storage.updateIndexNowSubmission(submission.id, {
        status: response.ok ? 'success' : 'failed',
        responseCode: response.status,
        responseMessage: response.statusText
      });

      if (response.ok) {
        console.log(`✅ IndexNow submission successful: ${validUrls.length} URLs`);
        return { 
          success: true, 
          statusCode: response.status,
          message: `Successfully submitted ${validUrls.length} URLs`,
          submissionId: submission.id
        };
      } else {
        console.error(`❌ IndexNow submission failed: ${response.status} ${response.statusText}`);
        return { 
          success: false, 
          statusCode: response.status,
          message: `IndexNow API error: ${response.statusText}`,
          submissionId: submission.id
        };
      }

    } catch (error) {
      console.error('IndexNow submission error:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Submit single URL convenience method
   */
  async submitSingleUrl(url: string, contentType: string = 'custom', relatedId?: number): Promise<IndexNowResponse> {
    return this.submitUrls([url], contentType, relatedId);
  }

  /**
   * Submit horoscope URLs for all zodiac signs
   */
  async submitHoroscopeUrls(period: 'daily' | 'weekly' | 'monthly' = 'daily'): Promise<IndexNowResponse> {
    const zodiacSigns = [
      'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
      'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
    ];

    const horoscopeUrls = zodiacSigns.map(sign => 
      `https://astrotick.com/horoscope/${sign}/${period}`
    );

    // Add main horoscope pages
    horoscopeUrls.push(
      `https://astrotick.com/horoscope/${period}`,
      'https://astrotick.com/horoscope'
    );

    return this.submitUrls(horoscopeUrls, 'horoscope');
  }

  /**
   * Submit article URL when published
   */
  async submitArticleUrl(articleSlug: string, articleId?: number): Promise<IndexNowResponse> {
    const urls = [
      `https://astrotick.com/articles/${articleSlug}`,
      'https://astrotick.com/articles' // Updated articles page
    ];

    return this.submitUrls(urls, 'article', articleId);
  }

  /**
   * Submit panchang URL
   */
  async submitPanchangUrl(date?: string): Promise<IndexNowResponse> {
    const urls = ['https://astrotick.com/panchang'];
    
    if (date) {
      urls.push(`https://astrotick.com/panchang/${date}`);
    }

    return this.submitUrls(urls, 'panchang');
  }

  /**
   * Bulk submit multiple content types at once
   */
  async submitMultipleContent(submissions: Array<{
    urls: string[];
    contentType: string;
    relatedId?: number;
  }>): Promise<IndexNowResponse[]> {
    const results: IndexNowResponse[] = [];
    
    for (const submission of submissions) {
      const result = await this.submitUrls(
        submission.urls, 
        submission.contentType, 
        submission.relatedId
      );
      results.push(result);
      
      // Add small delay between submissions to avoid rate limiting
      if (submissions.length > 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    return results;
  }

  /**
   * Retry failed submissions
   */
  async retryFailedSubmissions(maxRetries: number = 3): Promise<void> {
    try {
      const failedSubmissions = await storage.getFailedIndexNowSubmissions(maxRetries);
      
      for (const submission of failedSubmissions) {
        console.log(`🔄 Retrying IndexNow submission ${submission.id}...`);
        
        const result = await this.submitUrls(
          submission.urls,
          submission.contentType,
          submission.relatedId || undefined
        );
        
        if (result.success) {
          console.log(`✅ Retry successful for submission ${submission.id}`);
        } else {
          console.log(`❌ Retry failed for submission ${submission.id}`);
          await storage.updateIndexNowSubmission(submission.id, {
            retryCount: submission.retryCount + 1,
            nextRetryAt: new Date(Date.now() + Math.pow(2, submission.retryCount) * 60000) // Exponential backoff
          });
        }
        
        // Delay between retries
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } catch (error) {
      console.error('Failed to retry IndexNow submissions:', error);
    }
  }

  /**
   * Get submission statistics
   */
  async getSubmissionStats(): Promise<{
    total: number;
    successful: number;
    failed: number;
    pending: number;
    recentSubmissions: IndexNowSubmission[];
  }> {
    return storage.getIndexNowStats();
  }

  /**
   * Get the API key file content for hosting
   */
  async getKeyFileContent(): Promise<string> {
    if (!this.config) {
      await this.initializeConfig();
    }
    
    return this.config?.apiKey || '';
  }

  /**
   * Validate URL format
   */
  private isValidUrl(url: string): boolean {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.protocol === 'https:' || parsedUrl.protocol === 'http:';
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const indexNowService = IndexNowService.getInstance();