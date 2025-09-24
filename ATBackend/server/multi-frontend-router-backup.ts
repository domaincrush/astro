import { Express, Request, Response, NextFunction } from 'express';

interface RequestWithTenant extends Request {
  tenant?: string;
}

/**
 * Multi-Frontend Router
 * Serves different frontend applications based on domain/subdomain
 */
export function setupMultiFrontendRouter(app: Express) {
  // Tenant detection middleware
  app.use((req: RequestWithTenant, res: Response, next: NextFunction) => {
    const host = req.headers.host || '';
    
    // Extract domain without port
    const domain = host.split(':')[0];
    
    // Determine tenant based on domain
    if (domain.includes('kundali.in')) {
      req.tenant = 'kundali-in';
    } else if (domain.includes('astroporutham.com')) {
      req.tenant = 'astroporutham-com';
    } else if (domain.includes('careersastro.com')) {
      req.tenant = 'careersastro-com';
    } else if (domain.includes('astrovedika.com')) {
      req.tenant = 'astrovedika-com';
    } else {
      req.tenant = 'astrotick-com'; // Default tenant
    }
    
    next();
  });

  // Add a special route for Kundali.in before Vite takes over
  app.get('/kundali-home', (req: Request, res: Response) => {
    // Always serve Kundali.in homepage
    const kundaliHomepage = `<!DOCTYPE html>
<html lang="hi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kundali.in - आपकी कुंडली का सच्चा साथी</title>
    <meta name="description" content="कुंडली बनाएं, मैच कराएं और ज्योतिष सेवा पाएं - Kundali.in पर">
    <meta property="og:title" content="Kundali.in - आपकी कुंडली का सच्चा साथी">
    <meta property="og:description" content="फ्री कुंडली जेनरेशन और वैदिक ज्योतिष सेवाएं">
    <style>
        body {
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #fef3e2 0%, #fdf2f8 100%);
            margin: 0;
            padding: 0;
            color: #7c2d12;
        }
        .header {
            background: linear-gradient(90deg, #ea580c, #dc2626);
            color: white;
            padding: 1rem;
            text-align: center;
        }
        .hero {
            text-align: center;
            padding: 4rem 2rem;
            max-width: 800px;
            margin: 0 auto;
        }
        .hero h1 {
            font-size: 2.5rem;
            margin-bottom: 1rem;
            color: #ea580c;
        }
        .hero p {
            font-size: 1.2rem;
            margin-bottom: 2rem;
            color: #7c2d12;
        }
        .cta-button {
            display: inline-block;
            background: linear-gradient(90deg, #ea580c, #dc2626);
            color: white;
            padding: 1rem 2rem;
            text-decoration: none;
            border-radius: 8px;
            font-size: 1.1rem;
            font-weight: bold;
            margin: 0.5rem;
            transition: transform 0.2s;
        }
        .cta-button:hover {
            transform: translateY(-2px);
        }
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
            padding: 2rem;
            max-width: 1000px;
            margin: 0 auto;
        }
        .feature-card {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            text-align: center;
            border: 2px solid #fed7aa;
        }
        .footer {
            background: #7c2d12;
            color: white;
            text-align: center;
            padding: 2rem;
            margin-top: 4rem;
        }
        .om-symbol {
            font-size: 3rem;
            margin-bottom: 1rem;
            display: block;
        }
    </style>
</head>
<body>
    <header class="header">
        <h1>🕉️ Kundali.in</h1>
        <p>आपकी कुंडली का सच्चा साथी</p>
    </header>

    <section class="hero">
        <span class="om-symbol">🕉️</span>
        <h1>स्वागत है कुंडली.इन में</h1>
        <p>वैदिक ज्योतिष की प्राचीन विद्या से जानें अपना भविष्य</p>
        <p>फ्री कुंडली बनवाएं, मैच कराएं और विशेषज्ञ ज्योतिषियों से सलाह लें</p>
        
        <a href="https://astrotick.com" class="cta-button">🎯 कुंडली बनाएं</a>
        <a href="https://astrotick.com/kundli-matching" class="cta-button">💑 कुंडली मैच करें</a>
        <a href="https://astrotick.com/astrologers" class="cta-button">🔮 ज्योतिषी से बात करें</a>
    </section>

    <section class="features">
        <div class="feature-card">
            <h3>🎯 मुफ्त कुंडली</h3>
            <p>सटीक वैदिक गणना के साथ अपनी जन्म कुंडली तुरंत बनवाएं</p>
        </div>
        <div class="feature-card">
            <h3>💑 कुंडली मैच</h3>
            <p>गुण मिलान और मंगल दोष की जांच के साथ विवाह योग्यता देखें</p>
        </div>
        <div class="feature-card">
            <h3>📅 पंचांग</h3>
            <p>दैनिक तिथि, नक्षत्र, योग, करण और शुभ मुहूर्त की जानकारी</p>
        </div>
        <div class="feature-card">
            <h3>🔮 ज्योतिष सेवा</h3>
            <p>अनुभवी ज्योतिषियों से चैट, कॉल या वीडियो कॉल पर सलाह लें</p>
        </div>
    </section>

    <footer class="footer">
        <p>&copy; 2025 Kundali.in - सभी अधिकार सुरक्षित</p>
        <p>प्रामाणिक वैदिक ज्योतिष सेवाएं</p>
    </footer>
</body>
</html>`;
    
    res.status(200).set({ "Content-Type": "text/html" }).send(kundaliHomepage);
  });

  // Add custom domain-specific routing for Kundali.in
  app.get('/', (req: RequestWithTenant, res: Response, next: NextFunction) => {
    if (req.tenant === 'kundali-in') {
      // Redirect to the special Kundali.in homepage
      res.redirect('/kundali-home');
      return;
    }
    
    next();
  });

  // Health check endpoint for frontends
  app.get('/health/frontends', (req: RequestWithTenant, res: Response) => {
    const frontends = {
      'astrotick-com': {
        available: true,
        path: './client/index.html'
      },
      'kundali-in': {
        available: false, // Will be true when built
        path: './kundali-frontend/dist/index.html'
      }
    };

    res.json({
      success: true,
      frontends,
      deployment: {
        strategy: 'One Backend, Multiple Frontends',
        currentHost: req.headers.host,
        detectedTenant: req.tenant
      }
    });
  });
}

/**
 * Build configuration for multi-frontend deployment
 */
export function getBuildInstructions() {
  return {
    astrotick: {
      command: 'npm run build',
      directory: './client',
      output: './client/dist'
    },
    kundali: {
      command: 'npm run build',
      directory: './kundali-frontend', 
      output: './kundali-frontend/dist'
    }
  };
}