import type { Express } from "express";
import { indexNowService } from '../services/indexnow-service';
import { z } from "zod";

const submitUrlsSchema = z.object({
  urls: z.array(z.string().url()),
  contentType: z.string().optional().default('custom'),
  relatedId: z.number().optional()
});

const submitSingleUrlSchema = z.object({
  url: z.string().url(),
  contentType: z.string().optional().default('custom'),
  relatedId: z.number().optional()
});

export function setupIndexNowRoutes(app: Express) {
  
  // Get IndexNow API key file content
  app.get('/api/indexnow/key', async (req, res) => {
    try {
      const keyContent = await indexNowService.getKeyFileContent();
      res.set('Content-Type', 'text/plain');
      res.send(keyContent);
    } catch (error) {
      console.error('Error getting IndexNow key:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to retrieve IndexNow key' 
      });
    }
  });

  // Submit multiple URLs to IndexNow
  app.post('/api/indexnow/submit-urls', async (req, res) => {
    try {
      const validation = submitUrlsSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({
          success: false,
          error: 'Invalid request data',
          details: validation.error.issues
        });
      }

      const { urls, contentType, relatedId } = validation.data;
      const result = await indexNowService.submitUrls(urls, contentType, relatedId);

      res.json(result);
    } catch (error) {
      console.error('Error submitting URLs to IndexNow:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to submit URLs to IndexNow' 
      });
    }
  });

  // Submit single URL to IndexNow
  app.post('/api/indexnow/submit-url', async (req, res) => {
    try {
      const validation = submitSingleUrlSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({
          success: false,
          error: 'Invalid request data',
          details: validation.error.issues
        });
      }

      const { url, contentType, relatedId } = validation.data;
      const result = await indexNowService.submitSingleUrl(url, contentType, relatedId);

      res.json(result);
    } catch (error) {
      console.error('Error submitting URL to IndexNow:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to submit URL to IndexNow' 
      });
    }
  });

  // Submit horoscope URLs
  app.post('/api/indexnow/submit-horoscopes', async (req, res) => {
    try {
      const { period = 'daily' } = req.body;
      
      if (!['daily', 'weekly', 'monthly'].includes(period)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid period. Must be daily, weekly, or monthly'
        });
      }

      const result = await indexNowService.submitHoroscopeUrls(period);
      res.json(result);
    } catch (error) {
      console.error('Error submitting horoscope URLs:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to submit horoscope URLs' 
      });
    }
  });

  // Submit article URL
  app.post('/api/indexnow/submit-article', async (req, res) => {
    try {
      const { slug, articleId } = req.body;
      
      if (!slug) {
        return res.status(400).json({
          success: false,
          error: 'Article slug is required'
        });
      }

      const result = await indexNowService.submitArticleUrl(slug, articleId);
      res.json(result);
    } catch (error) {
      console.error('Error submitting article URL:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to submit article URL' 
      });
    }
  });

  // Submit panchang URL
  app.post('/api/indexnow/submit-panchang', async (req, res) => {
    try {
      const { date } = req.body;
      const result = await indexNowService.submitPanchangUrl(date);
      res.json(result);
    } catch (error) {
      console.error('Error submitting panchang URL:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to submit panchang URL' 
      });
    }
  });

  // Get IndexNow statistics
  app.get('/api/indexnow/stats', async (req, res) => {
    try {
      const stats = await indexNowService.getSubmissionStats();
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error getting IndexNow stats:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to retrieve IndexNow statistics' 
      });
    }
  });

  // Retry failed submissions
  app.post('/api/indexnow/retry-failed', async (req, res) => {
    try {
      const { maxRetries = 3 } = req.body;
      await indexNowService.retryFailedSubmissions(maxRetries);
      
      res.json({
        success: true,
        message: 'Failed submissions retry process completed'
      });
    } catch (error) {
      console.error('Error retrying failed submissions:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to retry failed submissions' 
      });
    }
  });

  // Initialize IndexNow configuration
  app.post('/api/indexnow/initialize', async (req, res) => {
    try {
      const { domain = 'astrotick.com' } = req.body;
      await indexNowService.initializeConfig(domain);
      
      res.json({
        success: true,
        message: `IndexNow initialized for domain: ${domain}`
      });
    } catch (error) {
      console.error('Error initializing IndexNow:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to initialize IndexNow configuration' 
      });
    }
  });

  // Submit all site URLs (comprehensive crawl)
  app.post('/api/indexnow/submit-all-urls', async (req, res) => {
    try {
      const { sitemapCrawler } = await import('../services/sitemap-crawler');
      
      const result = await sitemapCrawler.submitAllUrls();
      
      res.json({
        success: true,
        message: `Comprehensive URL submission completed: ${result.submitted}/${result.totalUrls} URLs submitted`,
        data: result
      });
    } catch (error) {
      console.error('Error submitting all URLs:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get sitemap statistics
  app.get('/api/indexnow/sitemap-stats', async (req, res) => {
    try {
      const { sitemapCrawler } = await import('../services/sitemap-crawler');
      
      const stats = await sitemapCrawler.getUrlStatistics();
      const totalUrls = Object.values(stats).reduce((sum, count) => sum + count, 0);
      
      res.json({
        success: true,
        data: {
          totalUrls,
          byContentType: stats
        }
      });
    } catch (error) {
      console.error('Error getting sitemap stats:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
}