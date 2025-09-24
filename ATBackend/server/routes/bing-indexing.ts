/**
 * Bing URL Submission API Routes
 * RESTful endpoints for Bing indexing integration
 */

import { Router, Request, Response } from 'express';
import { bingIndexingService } from '../services/bing-indexing-service';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limiting for Bing API calls (respects daily quota limits)
const bingApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Max 50 requests per 15 minutes
  message: {
    success: false,
    message: 'Too many Bing indexing requests, please try again later.'
  }
});

/**
 * POST /api/bing-indexing/submit
 * Submit URLs to Bing for indexing
 */
router.post('/submit', bingApiLimiter, async (req: Request, res: Response) => {
  try {
    const { urls } = req.body;

    if (!urls || !Array.isArray(urls)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of URLs to submit.'
      });
    }

    if (urls.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'URL array cannot be empty.'
      });
    }

    if (urls.length > 10) {
      return res.status(400).json({
        success: false,
        message: 'Maximum 10 URLs allowed per request. Please use batch submission for larger lists.'
      });
    }

    // Validate URLs
    const validUrls = urls.filter((url: string) => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    });

    if (validUrls.length !== urls.length) {
      return res.status(400).json({
        success: false,
        message: `Invalid URLs detected. Please provide valid URLs only.`
      });
    }

    const result = await bingIndexingService.submitUrls(validUrls);

    res.json(result);
  } catch (error) {
    console.error('Bing URL submission API error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during URL submission.'
    });
  }
});

/**
 * POST /api/bing-indexing/submit-batch
 * Submit large batches of URLs to Bing
 */
router.post('/submit-batch', bingApiLimiter, async (req: Request, res: Response) => {
  try {
    const { urls, batchSize = 10 } = req.body;

    if (!urls || !Array.isArray(urls)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of URLs to submit.'
      });
    }

    if (urls.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'URL array cannot be empty.'
      });
    }

    if (batchSize < 1 || batchSize > 10) {
      return res.status(400).json({
        success: false,
        message: 'Batch size must be between 1 and 10.'
      });
    }

    // Validate URLs
    const validUrls = urls.filter((url: string) => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    });

    if (validUrls.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid URLs found in the provided list.'
      });
    }

    const result = await bingIndexingService.submitUrlsInBatches(validUrls, batchSize);

    res.json(result);
  } catch (error) {
    console.error('Bing batch submission API error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during batch submission.'
    });
  }
});

/**
 * POST /api/bing-indexing/submit-single
 * Submit a single URL to Bing
 */
router.post('/submit-single', bingApiLimiter, async (req: Request, res: Response) => {
  try {
    const { url } = req.body;

    if (!url || typeof url !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid URL to submit.'
      });
    }

    // Validate URL
    try {
      new URL(url);
    } catch {
      return res.status(400).json({
        success: false,
        message: 'Invalid URL format provided.'
      });
    }

    const result = await bingIndexingService.submitSingleUrl(url);

    res.json(result);
  } catch (error) {
    console.error('Bing single URL submission API error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during URL submission.'
    });
  }
});

/**
 * GET /api/bing-indexing/quota
 * Get current Bing API quota usage
 */
router.get('/quota', bingApiLimiter, async (req: Request, res: Response) => {
  try {
    const result = await bingIndexingService.getQuotaInfo();
    res.json(result);
  } catch (error) {
    console.error('Bing quota check API error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while checking quota.'
    });
  }
});

/**
 * POST /api/bing-indexing/auto-submit-content
 * Auto-submit new content for indexing
 */
router.post('/auto-submit-content', bingApiLimiter, async (req: Request, res: Response) => {
  try {
    const { contentType, urls } = req.body;

    if (!contentType || !['horoscope', 'article', 'report'].includes(contentType)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid content type: horoscope, article, or report.'
      });
    }

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of URLs to submit.'
      });
    }

    // Validate URLs
    const validUrls = urls.filter((url: string) => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    });

    if (validUrls.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid URLs found in the provided list.'
      });
    }

    await bingIndexingService.autoSubmitNewContent(contentType, validUrls);

    res.json({
      success: true,
      message: `Auto-submission initiated for ${validUrls.length} ${contentType} URLs.`,
      submittedUrls: validUrls.length
    });
  } catch (error) {
    console.error('Bing auto-submit API error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during auto-submission.'
    });
  }
});

/**
 * GET /api/bing-indexing/generate-site-urls
 * Generate comprehensive site URLs for submission
 */
router.get('/generate-site-urls', (req: Request, res: Response) => {
  try {
    const urls = bingIndexingService.generateSiteUrls();
    
    res.json({
      success: true,
      message: `Generated ${urls.length} site URLs for submission.`,
      urls,
      totalUrls: urls.length
    });
  } catch (error) {
    console.error('Site URL generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while generating site URLs.'
    });
  }
});

/**
 * POST /api/bing-indexing/submit-site-urls
 * Submit all generated site URLs to Bing in batches
 */
router.post('/submit-site-urls', bingApiLimiter, async (req: Request, res: Response) => {
  try {
    const urls = bingIndexingService.generateSiteUrls();
    
    if (urls.length === 0) {
      return res.json({
        success: false,
        message: 'No URLs generated for submission.'
      });
    }

    const result = await bingIndexingService.submitUrlsInBatches(urls, 10);

    res.json({
      success: result.success,
      message: `Site URL submission completed: ${result.results.length} batches processed.`,
      totalUrls: urls.length,
      batchResults: result.results
    });
  } catch (error) {
    console.error('Site URL submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during site URL submission.'
    });
  }
});

export default router;