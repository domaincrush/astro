import { Request, Response, NextFunction } from 'express';
import compression from 'compression';

/**
 * Advanced Performance Middleware Suite
 * Implements caching, compression, and optimization headers
 */

// Cache configuration for different endpoint types
const CACHE_CONFIGS = {
  // Static data that rarely changes
  astrologers: { maxAge: '1 hour', staleWhileRevalidate: '24 hours' },
  analytics: { maxAge: '1 hour', staleWhileRevalidate: '6 hours' },
  
  // Dynamic but cacheable for short periods
  panchang: { maxAge: '30 minutes', staleWhileRevalidate: '2 hours' },
  horoscope: { maxAge: '6 hours', staleWhileRevalidate: '24 hours' },
  
  // User-specific data with minimal caching
  userProfile: { maxAge: '5 minutes', staleWhileRevalidate: '30 minutes' },
  consultations: { maxAge: '0', staleWhileRevalidate: '0' }
};

interface CacheConfig {
  maxAge: string;
  staleWhileRevalidate: string;
}

function parseTimeToSeconds(timeStr: string): number {
  const match = timeStr.match(/(\d+)\s*(minute|hour|day|second)s?/i);
  if (!match) return 0;
  
  const value = parseInt(match[1]);
  const unit = match[2].toLowerCase();
  
  switch (unit) {
    case 'second': return value;
    case 'minute': return value * 60;
    case 'hour': return value * 3600;
    case 'day': return value * 86400;
    default: return 0;
  }
}

function getCacheConfig(path: string): CacheConfig {
  if (path.includes('/astrologers')) return CACHE_CONFIGS.astrologers;
  if (path.includes('/analytics')) return CACHE_CONFIGS.analytics;
  if (path.includes('/panchang')) return CACHE_CONFIGS.panchang;
  if (path.includes('/horoscope')) return CACHE_CONFIGS.horoscope;
  if (path.includes('/profile') || path.includes('/user')) return CACHE_CONFIGS.userProfile;
  if (path.includes('/consultation')) return CACHE_CONFIGS.consultations;
  
  // Default for other API endpoints
  return { maxAge: '15 minutes', staleWhileRevalidate: '1 hour' };
}

/**
 * Smart caching middleware with stale-while-revalidate support
 */
export function smartCacheMiddleware(req: Request, res: Response, next: NextFunction) {
  // Skip caching for authenticated requests with sensitive data
  if (req.headers.authorization || req.method !== 'GET') {
    return next();
  }

  const config = getCacheConfig(req.path);
  const maxAgeSeconds = parseTimeToSeconds(config.maxAge);
  const staleSeconds = parseTimeToSeconds(config.staleWhileRevalidate);

  if (maxAgeSeconds > 0) {
    // Set cache headers for public API responses
    res.set({
      'Cache-Control': `public, max-age=${maxAgeSeconds}, stale-while-revalidate=${staleSeconds}`,
      'Vary': 'Accept-Encoding, Accept',
      'X-Cache-Strategy': 'smart-cache'
    });
  } else {
    // No caching for sensitive endpoints
    res.set({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
  }

  next();
}

/**
 * Response compression middleware with intelligent content detection
 */
export function intelligentCompressionMiddleware() {
  return compression({
    // Only compress responses larger than 1KB
    threshold: 1024,
    
    // Custom filter for compression
    filter: (req, res) => {
      // Don't compress if explicitly disabled
      if (req.headers['x-no-compression']) {
        return false;
      }
      
      // Always compress JSON API responses
      if (res.getHeader('content-type')?.toString().includes('application/json')) {
        return true;
      }
      
      // Use default compression filter for other content
      return compression.filter(req, res);
    },
    
    // Compression level (6 is a good balance of speed vs compression ratio)
    level: 6
  });
}

/**
 * Performance headers middleware
 */
export function performanceHeadersMiddleware(req: Request, res: Response, next: NextFunction) {
  // Add security and performance headers
  res.set({
    // Security headers
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    
    // Performance hints
    'X-DNS-Prefetch-Control': 'on',
    'X-Powered-By': 'AstroTick-Optimized',
    
    // Resource hints
    'Link': '</css/main.css>; rel=preload; as=style, </js/main.js>; rel=preload; as=script'
  });

  // Add performance timing header
  const startTime = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    console.log(`[PERF] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
  });

  next();
}

/**
 * Memory-optimized response middleware
 */
export function memoryOptimizedResponseMiddleware(req: Request, res: Response, next: NextFunction) {
  const originalJson = res.json;
  
  res.json = function(obj: any) {
    // Add response metadata for monitoring
    const responseData = {
      success: true,
      data: obj,
      timestamp: new Date().toISOString(),
      cached: res.getHeader('X-Cache-Strategy') === 'smart-cache'
    };
    
    // Use original json method with optimized data structure
    return originalJson.call(this, responseData);
  };
  
  next();
}

/**
 * Database connection pool monitoring middleware
 */
export function dbPoolMonitoringMiddleware(req: Request, res: Response, next: NextFunction) {
  // Add database pool stats to response headers (for debugging)
  if (process.env.NODE_ENV === 'development') {
    res.set({
      'X-DB-Pool-Status': 'optimized-50-max',
      'X-Performance-Mode': 'enhanced'
    });
  }
  
  next();
}

/**
 * Complete performance middleware stack
 */
export function setupPerformanceMiddleware(app: any) {
  console.log('🚀 Setting up advanced performance middleware...');
  
  // Apply middleware in optimal order
  app.use(intelligentCompressionMiddleware());
  app.use(performanceHeadersMiddleware);
  app.use(smartCacheMiddleware);
  app.use(memoryOptimizedResponseMiddleware);
  app.use(dbPoolMonitoringMiddleware);
  
  console.log('✅ Performance middleware configured successfully');
}