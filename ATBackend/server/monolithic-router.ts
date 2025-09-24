import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

export function setupMonolithicRouter(app: express.Application) {
  console.log('🧱 Setting up production-ready monolithic domain routing...');

  // Domain to frontend directory mapping (direct to source)
  const domainMap: Record<string, string> = {
    'jaataka.com': 'jaataka-frontend',
    'astroneram.com': 'astroneram-frontend', 
    'astrojothidam.com': 'astrojothidam-frontend',
    'astroscroll.com': 'astroscroll-frontend',
    'indiahoroscope.com': 'indiahoroscope-frontend',
    'kundali.in': 'kundali-frontend',
    'astrotelugu.com': 'astrotelugu-frontend'
  };

  // Extract domain from host header
  function getDomainFromHost(host: string): string {
    const cleanHost = host.replace(/^www\./, '').toLowerCase();
    return cleanHost;
  }

  // Production-ready monolithic routing
  app.use('/', (req: Request, res: Response, next) => {
    const host = req.get('host') || '';
    const domain = getDomainFromHost(host);
    
    // Only process specialized domains
    if (domainMap[domain]) {
      console.log(`🧱 PRODUCTION ROUTING: ${host} → ${domain}`);
      
      const frontendDir = domainMap[domain];
      
      // Try multiple possible paths for production compatibility
      const possiblePaths = [
        path.resolve(__dirname, `../public/${frontendDir}`),  // Server public
        path.resolve(__dirname, `../${frontendDir}`),         // Source directory
        path.resolve(__dirname, `../public/${domain.split('.')[0]}`),  // Subdirectory
        path.resolve(process.cwd(), frontendDir),             // Root level
        path.resolve(process.cwd(), `server/public/${frontendDir}`)    // Alternative
      ];
      
      for (const staticPath of possiblePaths) {
        if (fs.existsSync(staticPath)) {
          console.log(`📁 Found ${domain} assets at: ${staticPath}`);
          
          if (req.path === '/' || req.path === '') {
            const indexPath = path.join(staticPath, 'index.html');
            if (fs.existsSync(indexPath)) {
              console.log(`✅ SERVING ${domain} from: ${indexPath}`);
              return res.sendFile(indexPath);
            }
          }
          
          const requestedFile = path.join(staticPath, req.path);
          if (fs.existsSync(requestedFile) && fs.statSync(requestedFile).isFile()) {
            console.log(`📄 SERVING FILE: ${requestedFile}`);
            return res.sendFile(requestedFile);
          }
          
          break; // Found directory but file not available, try fallback
        }
      }
      
      console.log(`⚠️  No assets found for ${domain}, falling back to multi-frontend routing`);
    }

    // Continue to next middleware
    next();
  });

  console.log('🎯 Production-ready monolithic routing active');
  console.log('🌍 Production domains:', Object.keys(domainMap).join(', '));
}