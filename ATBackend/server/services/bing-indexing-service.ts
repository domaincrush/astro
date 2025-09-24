/**
 * Bing URL Submission API Integration Service
 * Automatically submits URLs to Bing for faster indexing and discovery
 * Supports up to 10,000 URLs per day submission
 */

import fetch from 'node-fetch';

interface BingSubmissionResponse {
  d: {
    quota: number;
    used: number;
    remaining: number;
  }
}

interface BingSubmissionRequest {
  siteUrl: string;
  urlList: string[];
}

interface BingApiConfig {
  apiKey: string;
  siteUrl: string;
  endpoint: string;
}

export class BingIndexingService {
  private config: BingApiConfig;
  private submissionHistory: Map<string, Date> = new Map();

  constructor() {
    this.config = {
      apiKey: process.env.BING_WEBMASTER_API_KEY || '',
      siteUrl: process.env.BING_SITE_URL || 'https://astrotick.com',
      endpoint: 'https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlbatch'
    };
  }

  /**
   * Submit URLs to Bing for indexing
   * @param urls Array of URLs to submit (max 10 per request)
   * @returns Promise with submission results
   */
  async submitUrls(urls: string[]): Promise<{ success: boolean; message: string; details?: any }> {
    if (!this.config.apiKey) {
      return {
        success: false,
        message: 'Bing Webmaster API key not configured. Please set BING_WEBMASTER_API_KEY environment variable.'
      };
    }

    if (!urls || urls.length === 0) {
      return {
        success: false,
        message: 'No URLs provided for submission.'
      };
    }

    // Bing API limit: max 10 URLs per request
    if (urls.length > 10) {
      return {
        success: false,
        message: 'Maximum 10 URLs allowed per submission. Please split into smaller batches.'
      };
    }

    // Filter out recently submitted URLs (avoid duplicate submissions within 24 hours)
    const filteredUrls = urls.filter(url => {
      const lastSubmitted = this.submissionHistory.get(url);
      if (lastSubmitted) {
        const hoursSinceSubmission = (Date.now() - lastSubmitted.getTime()) / (1000 * 60 * 60);
        return hoursSinceSubmission > 24;
      }
      return true;
    });

    if (filteredUrls.length === 0) {
      return {
        success: true,
        message: 'All URLs were recently submitted. Skipping duplicate submissions.'
      };
    }

    try {
      const requestBody: BingSubmissionRequest = {
        siteUrl: this.config.siteUrl,
        urlList: filteredUrls
      };

      const response = await fetch(`${this.config.endpoint}?apikey=${this.config.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'AstroTick-Bing-Indexing-Service/1.0'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Bing API request failed: ${response.status} - ${errorText}`);
      }

      const result = await response.json() as BingSubmissionResponse;

      // Update submission history
      filteredUrls.forEach(url => {
        this.submissionHistory.set(url, new Date());
      });

      console.log(`✅ Bing URL Submission successful: ${filteredUrls.length} URLs submitted`);
      console.log(`📊 Daily quota - Used: ${result.d?.used || 'N/A'}, Remaining: ${result.d?.remaining || 'N/A'}`);

      return {
        success: true,
        message: `Successfully submitted ${filteredUrls.length} URLs to Bing for indexing.`,
        details: {
          submittedUrls: filteredUrls,
          quota: result.d || {}
        }
      };

    } catch (error) {
      console.error('❌ Bing URL submission error:', error);
      return {
        success: false,
        message: `Bing URL submission failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Submit individual URL to Bing
   * @param url Single URL to submit
   * @returns Promise with submission result
   */
  async submitSingleUrl(url: string): Promise<{ success: boolean; message: string }> {
    return this.submitUrls([url]);
  }

  /**
   * Submit multiple URLs in batches (handles large arrays)
   * @param urls Array of URLs to submit
   * @param batchSize Number of URLs per batch (default 10)
   * @returns Promise with batch submission results
   */
  async submitUrlsInBatches(urls: string[], batchSize: number = 10): Promise<{ success: boolean; message: string; results: any[] }> {
    const results: any[] = [];
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < urls.length; i += batchSize) {
      const batch = urls.slice(i, i + batchSize);
      
      try {
        const result = await this.submitUrls(batch);
        results.push({
          batch: Math.floor(i / batchSize) + 1,
          urls: batch,
          ...result
        });

        if (result.success) {
          successCount++;
        } else {
          errorCount++;
        }

        // Add delay between batches to avoid rate limiting
        if (i + batchSize < urls.length) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      } catch (error) {
        errorCount++;
        results.push({
          batch: Math.floor(i / batchSize) + 1,
          urls: batch,
          success: false,
          message: `Batch submission failed: ${error instanceof Error ? error.message : 'Unknown error'}`
        });
      }
    }

    return {
      success: successCount > 0,
      message: `Batch submission completed: ${successCount} successful, ${errorCount} failed`,
      results
    };
  }

  /**
   * Check daily quota usage
   * @returns Promise with quota information
   */
  async getQuotaInfo(): Promise<{ success: boolean; quota?: any; message: string }> {
    if (!this.config.apiKey) {
      return {
        success: false,
        message: 'Bing Webmaster API key not configured.'
      };
    }

    try {
      // Submit empty batch to get quota info
      const response = await fetch(`${this.config.endpoint}?apikey=${this.config.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          siteUrl: this.config.siteUrl,
          urlList: []
        })
      });

      if (response.ok) {
        const result = await response.json() as BingSubmissionResponse;
        return {
          success: true,
          quota: result.d,
          message: 'Quota information retrieved successfully.'
        };
      } else {
        return {
          success: false,
          message: `Failed to retrieve quota information: ${response.status}`
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `Error retrieving quota: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Auto-submit new content URLs
   * Helper method for automatic content submission
   */
  async autoSubmitNewContent(contentType: 'horoscope' | 'article' | 'report', urls: string[]): Promise<void> {
    if (urls.length === 0) return;

    console.log(`🔄 Auto-submitting ${urls.length} ${contentType} URLs to Bing...`);
    
    const result = await this.submitUrlsInBatches(urls);
    
    if (result.success) {
      console.log(`✅ Auto-submission completed for ${contentType} content`);
    } else {
      console.log(`❌ Auto-submission partially failed for ${contentType} content`);
    }
  }

  /**
   * Generate site URLs for submission
   * Helper to create comprehensive URL lists for the astrology platform
   */
  generateSiteUrls(): string[] {
    const baseUrl = this.config.siteUrl;
    const urls: string[] = [];

    // Main pages
    urls.push(
      `${baseUrl}/`,
      `${baseUrl}/horoscope`,
      `${baseUrl}/reports`,
      `${baseUrl}/consultations`,
      `${baseUrl}/panchang`,
      `${baseUrl}/calculators`
    );

    // Calculator pages
    const calculators = [
      'birth-chart',
      'moon-sign',
      'lagna-calculator',
      'nakshatra-finder',
      'dasha-calculator',
      'dosham-check',
      'baby-names',
      'kundli-matching'
    ];

    calculators.forEach(calc => {
      urls.push(`${baseUrl}/calculators/${calc}`);
    });

    // Report pages
    const reports = ['career-report', 'marriage-report', 'health-report'];
    reports.forEach(report => {
      urls.push(`${baseUrl}/reports/${report}`);
    });

    // Horoscope pages
    const signs = [
      'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
      'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
    ];

    signs.forEach(sign => {
      urls.push(
        `${baseUrl}/horoscope/${sign}`,
        `${baseUrl}/horoscope/${sign}/daily`,
        `${baseUrl}/horoscope/${sign}/weekly`,
        `${baseUrl}/horoscope/${sign}/monthly`
      );
    });

    return urls;
  }
}

// Export singleton instance
export const bingIndexingService = new BingIndexingService();

// Export types for external use
export type { BingSubmissionResponse, BingSubmissionRequest };