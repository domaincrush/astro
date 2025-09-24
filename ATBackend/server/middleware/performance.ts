import { Request, Response, NextFunction } from 'express';

// Cache control middleware
export const cacheControlMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Static assets caching - 1 year for immutable assets
  if (req.url.match(/\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('Expires', new Date(Date.now() + 31536000000).toUTCString());
  }
  
  // API responses with intelligent caching
  if (req.url.startsWith('/api/')) {
    if (req.url.includes('/astrologers')) {
      // Cache astrologers for 1 hour with stale-while-revalidate
      res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
      res.setHeader('Vary', 'Accept-Encoding');
      res.setHeader('X-Cache-Strategy', 'astrologers-optimized');
    } else if (req.url.includes('/panchang/')) {
      // Cache panchang for 30 minutes with extended stale period
      res.setHeader('Cache-Control', 'public, max-age=1800, stale-while-revalidate=7200');
      res.setHeader('Vary', 'Accept-Encoding');
      res.setHeader('X-Cache-Strategy', 'panchang-optimized');
    } else if (req.url.includes('/horoscope/')) {
      // Cache horoscopes for 6 hours (daily content)
      res.setHeader('Cache-Control', 'public, max-age=21600, stale-while-revalidate=86400');
      res.setHeader('Vary', 'Accept-Encoding');
      res.setHeader('X-Cache-Strategy', 'horoscope-daily');
    } else if (req.url.includes('/analytics')) {
      // Cache analytics config for 2 hours
      res.setHeader('Cache-Control', 'public, max-age=7200, stale-while-revalidate=86400');
      res.setHeader('X-Cache-Strategy', 'analytics-config');
    } else if (req.url.includes('/astrologer-images/')) {
      // Cache astrologer images for 30 days
      res.setHeader('Cache-Control', 'public, max-age=2592000, immutable');
      res.setHeader('X-Cache-Strategy', 'image-immutable');
    } else {
      // Smart caching for other API endpoints - 15 minutes with revalidation
      res.setHeader('Cache-Control', 'public, max-age=900, stale-while-revalidate=3600');
      res.setHeader('Vary', 'Accept-Encoding');
      res.setHeader('X-Cache-Strategy', 'api-default');
    }
  }

  // HTML pages - short cache with revalidation
  if (req.headers['accept']?.includes('text/html')) {
    res.setHeader('Cache-Control', 'public, max-age=300, must-revalidate');
  }

  next();
};

// Image optimization middleware
export const imageOptimizationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Check if client supports WebP
  const acceptsWebP = req.headers.accept?.includes('image/webp') || 
                     req.headers['user-agent']?.includes('Chrome') ||
                     req.headers['user-agent']?.includes('Firefox');

  // For astrologer images, try to serve WebP if available
  if (req.url.includes('/astrologer-images/') && acceptsWebP) {
    const webpUrl = req.url.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    
    // Check if WebP version exists (in a real app, you'd check the filesystem)
    // For now, we'll just set a header to indicate WebP preference
    res.setHeader('Vary', 'Accept');
    
    // Set optimal image headers
    res.setHeader('Cache-Control', 'public, max-age=2592000, immutable'); // 30 days
    res.setHeader('Content-Type', 'image/webp');
  }

  // Set optimal headers for all images
  if (req.url.match(/\.(png|jpg|jpeg|gif|webp|svg)$/)) {
    res.setHeader('Cache-Control', 'public, max-age=2592000, immutable'); // 30 days
    res.setHeader('Vary', 'Accept, Accept-Encoding');
  }

  next();
};

// Resource hints middleware - OPTIMIZED TO FIX PRELOAD WARNINGS
export const resourceHintsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Only add critical preloads that are actually used immediately
  if (req.headers['accept']?.includes('text/html')) {
    // Only preload resources that are critical for First Contentful Paint
    // Remove unused preloads that were causing warnings
    const criticalResources = [];
    
    // Only preload fonts if this is a page that definitely uses them
    if (req.url === '/' || req.url.includes('/horoscope') || req.url.includes('/astrologers')) {
      criticalResources.push('<https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap>; rel=preload; as=style; crossorigin');
    }
    
    // Only add preload headers if we have critical resources
    if (criticalResources.length > 0) {
      res.setHeader('Link', criticalResources.join(', '));
    }
  }

  next();
};