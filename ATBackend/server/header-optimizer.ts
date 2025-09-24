import { Request, Response } from 'express';
import { TenantEngine } from './tenant-engine';

interface HeaderConfig {
  title: string;
  description: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterCard: string;
  canonical: string;
  hrefLang: Array<{ lang: string; href: string }>;
  structuredData: any;
}

interface DomainSpecificConfig {
  domain: string;
  siteName: string;
  language: string;
  region: string;
  specialization: string[];
  branding: {
    primaryColor: string;
    secondaryColor: string;
    logo: string;
    favicon: string;
    title: string;
    description: string;
  };
  seo: {
    keywords: string[];
    metaDescription: string;
    schema: any;
  };
}

export class HeaderOptimizer {
  private static readonly DOMAIN_CONFIGS: Map<string, DomainSpecificConfig> = new Map([
    // Neram Jothidam - Tamil Timing Astrology
    ['astroneram.com', {
      domain: 'astroneram.com',
      siteName: 'Neram Jothidam',
      language: 'tamil',
      region: 'tamil_nadu',
      specialization: ['timing', 'muhurta', 'tamil', 'panchang'],
      branding: {
        primaryColor: '#dc2626',
        secondaryColor: '#f59e0b',
        logo: '/logos/astroneram-logo.svg',
        favicon: '/favicons/astroneram-favicon.svg',
        title: 'Neram Jothidam - Tamil Astrological Timing',
        description: 'தமிழ் ஜோதிட நேரக் கணிப்பு - Tamil timing and muhurta calculations'
      },
      seo: {
        keywords: ['tamil astrology', 'tamil timing', 'muhurta', 'panchang', 'neram', 'தமிழ் ஜோதிடம்'],
        metaDescription: 'Tamil astrological timing services with authentic panchang calculations and muhurta selection',
        schema: {}
      }
    }],

    // Tamil Jothidam - Tamil Astrology
    ['astrojothidam.com', {
      domain: 'astrojothidam.com',
      siteName: 'Tamil Jothidam',
      language: 'tamil',
      region: 'tamil_nadu',
      specialization: ['jothidam', 'tamil', 'horoscope', 'predictions'],
      branding: {
        primaryColor: '#ea580c',
        secondaryColor: '#16a34a',
        logo: '/logos/astrojothidam-logo.svg',
        favicon: '/favicons/astrojothidam-favicon.svg',
        title: 'Tamil Jothidam - Tamil Astrology Services',
        description: 'தமிழ் ஜோதிடம் - Complete Tamil astrology with authentic predictions'
      },
      seo: {
        keywords: ['tamil astrology', 'jothidam', 'horoscope tamil', 'tamil predictions', 'தமிழ் ஜோதிடம்'],
        metaDescription: 'Authentic Tamil astrology services with traditional jothidam calculations and predictions',
        schema: {}
      }
    }],

    // IndiaHoroscope - Daily Predictions
    ['indiahoroscope.com', {
      domain: 'indiahoroscope.com',
      siteName: 'India Horoscope',
      language: 'english',
      region: 'pan_india',
      specialization: ['horoscope', 'daily', 'weekly', 'monthly', 'predictions'],
      branding: {
        primaryColor: '#ea580c',
        secondaryColor: '#16a34a',
        logo: '/logos/indiahoroscope-logo.svg',
        favicon: '/favicons/indiahoroscope-favicon.svg',
        title: 'India Horoscope - Daily Astrological Predictions',
        description: 'Daily horoscope predictions for all zodiac signs with authentic Indian astrology'
      },
      seo: {
        keywords: ['india horoscope', 'daily horoscope', 'astrology predictions', 'zodiac signs', 'indian astrology'],
        metaDescription: 'Daily horoscope predictions and astrological guidance based on authentic Indian Vedic astrology',
        schema: {}
      }
    }],

    // Jaataka - Traditional Analysis
    ['jaataka.com', {
      domain: 'jaataka.com',
      siteName: 'Jaataka',
      language: 'english',
      region: 'pan_india',
      specialization: ['jaataka', 'traditional', 'birth_chart', 'analysis'],
      branding: {
        primaryColor: '#92400e',
        secondaryColor: '#f59e0b',
        logo: '/logos/jaataka-logo.svg',
        favicon: '/favicons/jaataka-favicon.svg',
        title: 'Jaataka - Traditional Vedic Birth Chart Analysis',
        description: 'Traditional jaataka analysis with authentic Vedic astrology principles'
      },
      seo: {
        keywords: ['jaataka', 'birth chart', 'traditional astrology', 'vedic analysis', 'kundali'],
        metaDescription: 'Traditional jaataka birth chart analysis using authentic Vedic astrology methods',
        schema: {}
      }
    }],

    // Telugu Jyotishyam - Telugu Astrology
    ['astrotelugu.com', {
      domain: 'astrotelugu.com',
      siteName: 'Telugu Jyotishyam',
      language: 'telugu',
      region: 'andhra_pradesh',
      specialization: ['telugu', 'vedic', 'traditional', 'horoscope'],
      branding: {
        primaryColor: '#ea580c',
        secondaryColor: '#16a34a',
        logo: '/logos/astrotelugu-logo.svg',
        favicon: '/favicons/astrotelugu-favicon.svg',
        title: 'Telugu Jyotishyam - Telugu Astrology Services',
        description: 'తెలుగు జ్యోతిష్యం - Authentic Telugu astrology with traditional predictions'
      },
      seo: {
        keywords: ['telugu astrology', 'telugu jyotish', 'andhra pradesh', 'telugu horoscope', 'తెలుగు జ్యోతిష్యం'],
        metaDescription: 'Telugu astrology services with authentic Vedic calculations and traditional predictions',
        schema: {}
      }
    }],

    // Scroll Astrology - Modern Astrology Platform
    ['astroscroll.com', {
      domain: 'astroscroll.com',
      siteName: 'Scroll Astrology',
      language: 'english',
      region: 'global',
      specialization: ['modern', 'premium', 'reports', 'consultation'],
      branding: {
        primaryColor: '#8b5cf6',
        secondaryColor: '#ec4899',
        logo: '/logos/astroscroll-logo.svg',
        favicon: '/favicons/astroscroll-favicon.svg',
        title: 'Scroll Astrology - Modern Astrology Platform',
        description: 'Modern astrology platform with premium reports and expert consultations'
      },
      seo: {
        keywords: ['modern astrology', 'astrology platform', 'premium reports', 'astrology consultation', 'horoscope'],
        metaDescription: 'Modern astrology platform offering premium reports, expert consultations, and authentic predictions',
        schema: {}
      }
    }],

    // AstroTick - Original Platform
    ['astrotick.com', {
      domain: 'astrotick.com',
      siteName: 'AstroTick',
      language: 'english',
      region: 'global',
      specialization: ['comprehensive', 'professional', 'consultation', 'reports'],
      branding: {
        primaryColor: '#8b5cf6',
        secondaryColor: '#06b6d4',
        logo: '/logos/astrotick-logo.svg',
        favicon: '/favicons/astrotick-favicon.svg',
        title: 'AstroTick - Professional Astrology Platform',
        description: 'Professional astrology platform with comprehensive services and expert consultations'
      },
      seo: {
        keywords: ['professional astrology', 'astrology platform', 'astrology consultations', 'vedic astrology services'],
        metaDescription: 'Professional astrology platform with comprehensive services and expert consultations',
        schema: {}
      }
    }]
  ]);

  // Get domain configuration
  public static getDomainConfig(domain: string): DomainSpecificConfig | null {
    return this.DOMAIN_CONFIGS.get(domain.toLowerCase()) || null;
  }

  // Get header configuration for a specific domain
  public static getHeaderConfig(domain: string, path: string = '/'): HeaderConfig {
    const config = this.getDomainConfig(domain);
    if (!config) {
      // Default fallback configuration
      return {
        title: 'AstroTick - Professional Astrology Platform',
        description: 'Professional astrology platform with comprehensive services',
        keywords: ['astrology', 'horoscope', 'vedic astrology'],
        ogTitle: 'AstroTick - Professional Astrology Platform',
        ogDescription: 'Professional astrology platform with comprehensive services',
        ogImage: '/logos/astrotick-logo.svg',
        twitterCard: 'summary_large_image',
        canonical: `https://${domain}${path}`,
        hrefLang: [{ lang: 'en', href: `https://${domain}${path}` }],
        structuredData: {}
      };
    }

    return {
      title: config.branding.title,
      description: config.branding.description,
      keywords: config.seo.keywords,
      ogTitle: config.branding.title,
      ogDescription: config.branding.description,
      ogImage: config.branding.logo,
      twitterCard: 'summary_large_image',
      canonical: `https://${domain}${path}`,
      hrefLang: [{ lang: config.language, href: `https://${domain}${path}` }],
      structuredData: config.seo.schema
    };
  }

  // Get all supported domains
  public static getAllDomains(): string[] {
    return Array.from(this.DOMAIN_CONFIGS.keys());
  }

  // Get domain branding
  public static getDomainBranding(domain: string): DomainSpecificConfig['branding'] | null {
    const config = this.getDomainConfig(domain);
    return config ? config.branding : null;
  }

  // API endpoints
  public static getHeaderConfigAPI(req: Request, res: Response) {
    const domain = req.params.domain || req.get('host')?.split(':')[0] || 'astrotick.com';
    const path = req.query.path as string || '/';
    
    const headerConfig = HeaderOptimizer.getHeaderConfig(domain, path);
    const domainConfig = HeaderOptimizer.getDomainConfig(domain);
    
    res.json({
      success: true,
      data: {
        header: headerConfig,
        domain: domainConfig,
        timestamp: new Date().toISOString()
      }
    });
  }

  public static getDomainStatusAPI(req: Request, res: Response) {
    const allDomains = HeaderOptimizer.getAllDomains();
    const domainStatuses = allDomains.map(domain => {
      const config = HeaderOptimizer.getDomainConfig(domain);
      return {
        domain,
        active: true,
        language: config?.language || 'english',
        specialization: config?.specialization || [],
        branding: config?.branding || null
      };
    });

    res.json({
      success: true,
      data: {
        domains: domainStatuses,
        total: allDomains.length,
        timestamp: new Date().toISOString()
      }
    });
  }
}