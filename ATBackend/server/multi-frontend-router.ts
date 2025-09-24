import express, { Express, Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';

// Simplified domain configuration - map hostnames to frontend folders
const domainConfig: { [key: string]: string } = {
  'astroneram.com': 'astroneram-frontend',
  'www.astroneram.com': 'astroneram-frontend',
  'astrojothidam.com': 'astrojothidam-frontend',
  'www.astrojothidam.com': 'astrojothidam-frontend',
  'astroscroll.com': 'astroscroll-frontend',
  'www.astroscroll.com': 'astroscroll-frontend',
  'indiahoroscope.com': 'indiahoroscope-frontend',
  'www.indiahoroscope.com': 'indiahoroscope-frontend',
  'kundali.in': 'kundali-frontend',
  'www.kundali.in': 'kundali-frontend',
  'astrotelugu.com': 'astrotelugu-frontend',
  'www.astrotelugu.com': 'astrotelugu-frontend',
  'astrotick.com': 'client',
  'www.astrotick.com': 'client'
};

/**
 * Helper to get the requested host from headers (no port)
 * Follows the recommended approach from the edge routing guidance
 */
function getRequestHost(req: Request): string {
  // Replit/Cloudflare usually set x-forwarded-host; browsers set host
  const xForwardedHost = req.headers['x-forwarded-host'] as string || '';
  const xfHost = xForwardedHost.split(',')[0].trim();
  const raw = xfHost || req.headers.host || '';
  return raw.replace(/:\d+$/, '').toLowerCase();
}

const getFrontendFromRequest = (req: Request) => {
  const fallback = 'client'; // Main AstroTick frontend
  const forcedDomain = process.env.FORCED_DOMAIN; // fallback for testing
  
  // Get the actual host from headers
  const detected = forcedDomain || getRequestHost(req);
  
  if (!detected) return fallback;
  
  // Production Mode: In production, we should handle all real domains
  // Development Mode: Skip local development domains unless forced
  const isProduction = process.env.NODE_ENV === 'production';
  const isLocalDomain = detected.includes('localhost') || 
                       detected.includes('replit.dev') || 
                       detected.includes('spock') ||
                       detected.includes('127.0.0.1');
  
  // In production, always check the domain mapping regardless of local status
  // This ensures that even if accessed through a proxy, the correct frontend is served
  if (!forcedDomain && !isProduction && isLocalDomain) {
    // In development, only skip if it's a local domain without forcing
    return fallback;
  }
  
  // Check domain config for exact match first
  if (domainConfig[detected]) {
    // Always log domain detection for debugging
    console.log(`🎯 Domain detected: ${detected} → ${domainConfig[detected]} (production: ${isProduction})`);
    console.log(`🔍 Request headers - Host: ${req.headers.host}, X-Forwarded-Host: ${req.headers['x-forwarded-host']}, X-Real-Domain: ${req.headers['x-real-domain']}`);
    return domainConfig[detected];
  }
  
  // If no exact match, check if any configured domain is contained in the detected host
  // This helps with subdomain or path-based routing
  for (const [domain, frontend] of Object.entries(domainConfig)) {
    if (detected.includes(domain)) {
      console.log(`🎯 Domain matched by inclusion: ${detected} contains ${domain} → ${frontend}`);
      return frontend;
    }
  }
  
  // Log unmatched domains for debugging
  if (!isLocalDomain || isProduction) {
    console.log(`⚠️ Domain not mapped: ${detected} (production: ${isProduction}, local: ${isLocalDomain})`);
  }
  
  return fallback;
};

// Performance optimization: Cache domain detection results
const domainCache = new Map<string, string>();

/**
 * Multi-Frontend Router
 * Serves different frontend applications based on domain/subdomain
 */
export function setupMultiFrontendRouter(app: Express) {
  // Debug route to check production domain routing
  app.get('/debug-production-routing', (req: Request, res: Response) => {
    const detectedHost = getRequestHost(req);
    const frontend = getFrontendFromRequest(req);
    const frontendPath = path.join(process.cwd(), 'server', 'public', frontend, 'index.html');
    const exists = fs.existsSync(frontendPath);
    
    res.json({
      production: process.env.NODE_ENV === 'production',
      detectedHost,
      reqHostname: req.hostname, // uses trust proxy if enabled
      frontend,
      frontendPath,
      exists,
      headers: {
        host: req.headers.host,
        'x-forwarded-host': req.headers['x-forwarded-host'],
        'x-forwarded-proto': req.headers['x-forwarded-proto'],
        'x-real-ip': req.headers['x-real-ip'],
        'cf-visitor': req.headers['cf-visitor']
      },
      availableDomains: Object.keys(domainConfig).filter(d => !d.startsWith('www.')),
      availableFrontends: fs.readdirSync(path.join(process.cwd(), 'server', 'public')).filter(dir => 
        fs.statSync(path.join(process.cwd(), 'server', 'public', dir)).isDirectory() && 
        fs.existsSync(path.join(process.cwd(), 'server', 'public', dir, 'index.html'))
      )
    });
  });

  // Test route to force domain detection for development
  app.get('/force-domain/:domain/*', (req: Request, res: Response, next: NextFunction) => {
    // Set a temporary forced domain for this request
    process.env.FORCED_DOMAIN = req.params.domain;
    
    // Redirect to the path without the force-domain prefix
    const originalPath = req.params[0] || '/';
    req.url = '/' + originalPath;
    
    console.log(`🔧 Force-loading domain: ${req.params.domain} for path: ${originalPath}`);
    next();
  });

  // Test route to verify multi-frontend routing
  app.get('/test-frontend/:domain', (req: Request, res: Response) => {
    const testDomain = req.params.domain;
    const frontend = domainConfig[testDomain as keyof typeof domainConfig];
    
    if (!frontend) {
      return res.json({
        error: 'Domain not found',
        availableDomains: Object.keys(domainConfig),
        testDomain
      });
    }
    
    // Check if frontend exists
    const frontendPath = path.join(process.cwd(), 'server', 'public', frontend, 'index.html');
    const exists = fs.existsSync(frontendPath);
    
    res.json({
      domain: testDomain,
      frontend,
      frontendPath,
      exists,
      status: exists ? 'Frontend available' : 'Frontend missing',
      availableDomains: Object.keys(domainConfig)
    });
  });

  // Serve static assets for React frontends
  app.use('/astrotelugu-assets', express.static(path.join(process.cwd(), 'astrotelugu-frontend', 'src')));

  // Handle static assets for specialized frontends with proper MIME types
  app.use(['/assets/*', '/src/*'], (req: Request, res: Response, next: NextFunction) => {
    const frontend = getFrontendFromRequest(req);
    
    if (frontend !== 'client') {
      // Try to serve static assets from specialized frontend directory
      const assetPath = path.join(process.cwd(), 'server', 'public', frontend, req.path);
      if (fs.existsSync(assetPath)) {
        // Set proper MIME type for JavaScript modules
        if (req.path.endsWith('.js')) {
          res.type('application/javascript');
        } else if (req.path.endsWith('.css')) {
          res.type('text/css');
        } else if (req.path.endsWith('.tsx') || req.path.endsWith('.ts')) {
          res.type('application/javascript');
        }
        res.sendFile(assetPath);
        return;
      }
    }
    
    next();
  });

  // Handle robots.txt and sitemap.xml for specialized frontends
  app.use(['/robots.txt', '/sitemap.xml'], (req: Request, res: Response, next: NextFunction) => {
    const frontend = getFrontendFromRequest(req);
    
    if (frontend !== 'client') {
      // Try to serve from specialized frontend directory
      const filePath = path.join(process.cwd(), 'server', 'public', frontend, req.path);
      if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
        return;
      }
    }
    
    next();
  });

  // Skip multi-frontend routing for API requests and static assets
  app.use('*', (req: Request, res: Response, next: NextFunction) => {
    // Skip multi-frontend routing for API requests and static assets
    if (req.path?.startsWith('/api/') || 
        req.path?.startsWith('/astrologer-images/') ||
        req.path?.startsWith('/site.webmanifest') ||
        req.path?.startsWith('/favicon') ||
        req.path?.startsWith('/logos/') ||
        req.path?.startsWith('/test-frontend/') ||
        req.path?.startsWith('/debug-production-routing') ||
        req.path?.startsWith('/force-domain/') ||
        req.path?.startsWith('/src/') ||
        req.path?.startsWith('/assets/') ||
        req.path?.endsWith('.css') ||
        req.path?.endsWith('.js') ||
        req.path?.endsWith('.tsx') ||
        req.path?.endsWith('.ts') ||
        req.path?.endsWith('.png') ||
        req.path?.endsWith('.jpg') ||
        req.path?.endsWith('.ico')) {
      return next();
    }
    
    // Only handle GET requests for frontend routing
    if (req.method !== 'GET') {
      return next();
    }
    
    // Continue with frontend routing for GET requests
    next();
  });

  // CRITICAL: Override middleware with early termination for specialized frontends
  app.use('*', (req: Request, res: Response, next: NextFunction) => {
    const detectedHost = getRequestHost(req);
    const frontend = getFrontendFromRequest(req);
    
    console.log(`🔍 MIDDLEWARE DEBUG: host=${detectedHost}, frontend=${frontend}, path=${req.path}`);
    
    // Early termination for specialized frontends to prevent Vite interference
    if (frontend !== 'client') {
      console.log(`🚀 EARLY OVERRIDE: ${detectedHost} -> ${frontend} (bypassing Vite)`);
      
      const possiblePaths = [
        path.join(process.cwd(), 'server', 'public', frontend, 'index.html'),
        path.join(process.cwd(), frontend, 'dist', 'index.html'),
        path.join(process.cwd(), 'dist', frontend, 'index.html'),
        path.join(process.cwd(), frontend, 'index.html')
      ];
      
      console.log(`🔍 EARLY PATHS: ${possiblePaths.map(p => `${fs.existsSync(p) ? '✅' : '❌'} ${p}`).join(', ')}`);
      
      for (const filePath of possiblePaths) {
        if (fs.existsSync(filePath)) {
          console.log(`✅ EARLY SERVE: ${frontend} from: ${filePath}`);
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
          res.setHeader('Pragma', 'no-cache');
          res.setHeader('Expires', '0');
          res.setHeader('ETag', `"${frontend}-early-${Date.now()}"`);
          return res.sendFile(filePath);
        }
      }
      
      console.log(`❌ EARLY SERVE FAILED: No valid paths found for ${frontend}`);
    }
    
    next();
  });

  // Main domain-specific routing for GET requests (fallback)
  app.get('*', (req: Request, res: Response, next: NextFunction) => {
    // Get the actual detected host using our helper function
    const detectedHost = getRequestHost(req);
    
    // Check cache first for better performance using the detected host
    let frontend = domainCache.get(detectedHost);
    if (!frontend) {
      frontend = getFrontendFromRequest(req);
      domainCache.set(detectedHost, frontend);
    }
    
    // Only log domain detection for non-default frontends or in production with special domains
    if (frontend !== 'client' && (process.env.NODE_ENV === 'production' || process.env.FORCED_DOMAIN)) {
      console.log(`🔍 Domain detection: detectedHost=${detectedHost}, frontend=${frontend}, headers:`, {
        'x-forwarded-host': req.headers['x-forwarded-host'],
        'x-real-domain': req.headers['x-real-domain'],
        'forced-domain': process.env.FORCED_DOMAIN
      });
    }
    
    // If it's the main frontend, continue to regular routing without logging
    if (frontend === 'client') {
      return next();
    }
    
    // Only log when we actually find a specialized frontend
    console.log(`✅ Specialized frontend detected: ${frontend} for domain: ${detectedHost}`);
    
    // Try to serve specialized frontend - check multiple locations for dev/prod compatibility
    const possiblePaths = [
      // Server public directory (production - primary)
      path.join(process.cwd(), 'server', 'public', frontend, 'index.html'),
      // Development path in root (secondary)
      path.join(process.cwd(), frontend, 'index.html'),
      // Production path in dist directory
      path.join(process.cwd(), 'dist', frontend, 'index.html'),
      // Alternative production path
      path.join(process.cwd(), frontend, 'dist', 'index.html'),
      // Alternative root directory structure for production
      path.join(process.cwd(), '..', frontend, 'index.html')
    ];
    
    for (const filePath of possiblePaths) {
      if (fs.existsSync(filePath)) {
        console.log(`✅ Serving frontend ${frontend} from: ${filePath}`);
        console.log(`🔍 File content preview:`, fs.readFileSync(filePath, 'utf8').substring(0, 200));
        // Set aggressive cache-busting headers for HTML to prevent stale content
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.setHeader('Last-Modified', new Date().toUTCString());
        res.setHeader('ETag', `"${frontend}-${Date.now()}"`);
        res.sendFile(filePath);
        return;
      }
    }
    
    console.log(`❌ No frontend found for ${frontend}. Checked paths: ${possiblePaths.join(', ')}`);
    // Fallback to main client
    next();
  });
}