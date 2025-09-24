import { Request, Response, NextFunction } from 'express';

// Tenant Configuration Interface
export interface TenantConfig {
  id: string;
  domain: string;
  name: string;
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
  features: {
    engines: string[];
    consultationTypes: string[];
    reportTypes: string[];
    languages: string[];
  };
  paymentConfig: {
    payuMerchantKey: string;
    payuSalt: string;
    currency: string;
    pricing: {
      consultation: number;
      detailedReport: number;
      horoscope: number;
    };
  };
  seo: {
    keywords: string[];
    metaDescription: string;
    schema: object;
  };
}

// Comprehensive Tenant Configuration Database
export class TenantEngine {
  private static readonly TENANT_CONFIGS: Map<string, TenantConfig> = new Map([
    // Malayalam Astrology
    ['astrobhakthi.com', {
      id: 'astrobhakthi',
      domain: 'astrobhakthi.com',
      name: 'Astro Bhakthi',
      language: 'malayalam',
      region: 'kerala',
      specialization: ['vedic', 'traditional', 'temple'],
      branding: {
        primaryColor: '#FF6B35',
        secondaryColor: '#004225',
        logo: '/assets/astrobhakthi-logo.png',
        favicon: '/assets/astrobhakthi-favicon.ico',
        title: 'Astro Bhakthi - മലയാളം ജ്യോതിഷം',
        description: 'കേരളത്തിലെ പ്രമുख ജ്യോതിഷ സേവനം'
      },
      features: {
        engines: ['vedic', 'kerala_traditional', 'panchang', 'tamil'],
        consultationTypes: ['phone', 'chat', 'video'],
        reportTypes: ['detailed', 'marriage', 'career', 'health'],
        languages: ['malayalam', 'english']
      },
      paymentConfig: {
        payuMerchantKey: 'astrobhakthi_key',
        payuSalt: 'astrobhakthi_salt',
        currency: 'INR',
        pricing: { consultation: 500, detailedReport: 1200, horoscope: 300 }
      },
      seo: {
        keywords: ['malayalam astrology', 'kerala jyotish', 'vedic astrology kerala'],
        metaDescription: 'Kerala\'s premier Malayalam astrology platform',
        schema: {}
      }
    }],

    // Career Focused Astrology
    ['careersastro.com', {
      id: 'careersastro',
      domain: 'careersastro.com',
      name: 'Careers Astro',
      language: 'english',
      region: 'pan_india',
      specialization: ['career', 'business', 'job'],
      branding: {
        primaryColor: '#1E40AF',
        secondaryColor: '#F59E0B',
        logo: '/assets/careersastro-logo.png',
        favicon: '/assets/careersastro-favicon.ico',
        title: 'Careers Astro - Professional Astrology Guidance',
        description: 'Expert career and business astrology consultations'
      },
      features: {
        engines: ['professional', 'kp_system', 'business_astrology'],
        consultationTypes: ['phone', 'video', 'email'],
        reportTypes: ['career', 'business', 'promotion', 'job_change'],
        languages: ['english', 'hindi']
      },
      paymentConfig: {
        payuMerchantKey: 'careersastro_key',
        payuSalt: 'careersastro_salt',
        currency: 'INR',
        pricing: { consultation: 800, detailedReport: 1500, horoscope: 400 }
      },
      seo: {
        keywords: ['career astrology', 'business astrology', 'job predictions'],
        metaDescription: 'Professional career guidance through Vedic astrology',
        schema: {}
      }
    }],

    // General Astrology Call Service
    ['astrologycall.com', {
      id: 'astrologycall',
      domain: 'astrologycall.com',
      name: 'Astrology Call',
      language: 'english',
      region: 'pan_india',
      specialization: ['phone_consultation', 'immediate', 'general'],
      branding: {
        primaryColor: '#10B981',
        secondaryColor: '#374151',
        logo: '/assets/astrologycall-logo.png',
        favicon: '/assets/astrologycall-favicon.ico',
        title: 'Astrology Call - Instant Phone Consultations',
        description: 'Connect with expert astrologers instantly via phone'
      },
      features: {
        engines: ['comprehensive', 'quick_analysis', 'phone_optimized'],
        consultationTypes: ['phone', 'chat'],
        reportTypes: ['quick', 'detailed', 'emergency'],
        languages: ['english', 'hindi', 'tamil', 'telugu']
      },
      paymentConfig: {
        payuMerchantKey: 'astrologycall_key',
        payuSalt: 'astrologycall_salt',
        currency: 'INR',
        pricing: { consultation: 300, detailedReport: 800, horoscope: 200 }
      },
      seo: {
        keywords: ['phone astrology', 'instant consultation', 'call astrologer'],
        metaDescription: 'Instant astrology consultations over phone',
        schema: {}
      }
    }],

    // Tamil Astrology
    ['astrologytamil.com', {
      id: 'astrologytamil',
      domain: 'astrologytamil.com',
      name: 'Astrology Tamil',
      language: 'tamil',
      region: 'tamil_nadu',
      specialization: ['tamil_tradition', 'temple', 'cultural'],
      branding: {
        primaryColor: '#DC2626',
        secondaryColor: '#FCD34D',
        logo: '/assets/astrologytamil-logo.png',
        favicon: '/assets/astrologytamil-favicon.ico',
        title: 'Astrology Tamil - தமிழ் ஜோதிடம்',
        description: 'தமிழ் பாரம்பரிய ஜோதிட சேவைகள்'
      },
      features: {
        engines: ['tamil_astrology', 'traditional', 'temple_based'],
        consultationTypes: ['phone', 'chat', 'temple_visit'],
        reportTypes: ['detailed', 'marriage', 'naming', 'muhurta'],
        languages: ['tamil', 'english']
      },
      paymentConfig: {
        payuMerchantKey: 'astrologytamil_key',
        payuSalt: 'astrologytamil_salt',
        currency: 'INR',
        pricing: { consultation: 600, detailedReport: 1000, horoscope: 350 }
      },
      seo: {
        keywords: ['tamil astrology', 'tamil jyotish', 'tamil horoscope'],
        metaDescription: 'Traditional Tamil astrology services',
        schema: {}
      }
    }],

    // Porutham (Marriage Compatibility)
    ['astroporutham.com', {
      id: 'astroporutham',
      domain: 'astroporutham.com',
      name: 'Astro Porutham',
      language: 'tamil',
      region: 'south_india',
      specialization: ['marriage', 'compatibility', 'porutham'],
      branding: {
        primaryColor: '#EC4899',
        secondaryColor: '#7C3AED',
        logo: '/assets/astroporutham-logo.png',
        favicon: '/assets/astroporutham-favicon.ico',
        title: 'Astro Porutham - திருமண பொருத்தம்',
        description: 'திருமண பொருத்த சேவைகள்'
      },
      features: {
        engines: ['porutham_calculator', 'marriage_compatibility', 'guna_milan'],
        consultationTypes: ['family_consultation', 'detailed_analysis'],
        reportTypes: ['porutham', 'marriage_timing', 'compatibility'],
        languages: ['tamil', 'malayalam', 'english']
      },
      paymentConfig: {
        payuMerchantKey: 'astroporutham_key',
        payuSalt: 'astroporutham_salt',
        currency: 'INR',
        pricing: { consultation: 700, detailedReport: 1500, horoscope: 400 }
      },
      seo: {
        keywords: ['porutham', 'marriage compatibility', 'tamil marriage'],
        metaDescription: 'Expert marriage compatibility analysis',
        schema: {}
      }
    }],

    // Kannada Astrology
    ['kannadaastrology.com', {
      id: 'kannadaastrology',
      domain: 'kannadaastrology.com',
      name: 'Kannada Astrology',
      language: 'kannada',
      region: 'karnataka',
      specialization: ['kannada_tradition', 'cultural', 'regional'],
      branding: {
        primaryColor: '#F59E0B',
        secondaryColor: '#DC2626',
        logo: '/assets/kannadaastrology-logo.png',
        favicon: '/assets/kannadaastrology-favicon.ico',
        title: 'Kannada Astrology - ಕನ್ನಡ ಜ್ಯೋತಿಷ್ಯ',
        description: 'ಕರ್ನಾಟಕದ ಪಾರಂಪರಿಕ ಜ್ಯೋತಿಷ್ಯ ಸೇವೆಗಳು'
      },
      features: {
        engines: ['kannada_traditional', 'south_indian', 'regional'],
        consultationTypes: ['phone', 'chat', 'video'],
        reportTypes: ['detailed', 'naming', 'muhurta', 'career'],
        languages: ['kannada', 'english']
      },
      paymentConfig: {
        payuMerchantKey: 'kannadaastrology_key',
        payuSalt: 'kannadaastrology_salt',
        currency: 'INR',
        pricing: { consultation: 500, detailedReport: 900, horoscope: 300 }
      },
      seo: {
        keywords: ['kannada astrology', 'karnataka jyotish', 'kannada horoscope'],
        metaDescription: 'Traditional Kannada astrology services',
        schema: {}
      }
    }],

    // Kundali Services
    ['kundali.in', {
      id: 'kundali',
      domain: 'kundali.in',
      name: 'Kundali.in',
      language: 'hindi',
      region: 'north_india',
      specialization: ['kundali', 'detailed_charts', 'traditional'],
      branding: {
        primaryColor: '#7C2D12',
        secondaryColor: '#FCD34D',
        logo: '/assets/kundali-logo.png',
        favicon: '/assets/kundali-favicon.ico',
        title: 'Kundali.in - कुंडली सेवाएं',
        description: 'संपूर्ण कुंडली और ज्योतिष सेवाएं'
      },
      features: {
        engines: ['comprehensive', 'detailed_analysis', 'traditional_vedic'],
        consultationTypes: ['detailed_session', 'family_consultation'],
        reportTypes: ['complete_kundali', 'dasha_analysis', 'remedies'],
        languages: ['hindi', 'english', 'sanskrit']
      },
      paymentConfig: {
        payuMerchantKey: 'kundali_key',
        payuSalt: 'kundali_salt',
        currency: 'INR',
        pricing: { consultation: 1000, detailedReport: 2000, horoscope: 500 }
      },
      seo: {
        keywords: ['kundali', 'hindi astrology', 'vedic kundali'],
        metaDescription: 'Complete Kundali and astrology services in Hindi',
        schema: {}
      }
    }]
  ]);

  // Get tenant configuration by domain
  static getTenantByDomain(domain: string): TenantConfig | null {
    // Remove www prefix if present
    const cleanDomain = domain.replace(/^www\./, '');
    return this.TENANT_CONFIGS.get(cleanDomain) || null;
  }

  // Get all tenants
  static getAllTenants(): TenantConfig[] {
    return Array.from(this.TENANT_CONFIGS.values());
  }

  // Add new tenant
  static addTenant(config: TenantConfig): void {
    this.TENANT_CONFIGS.set(config.domain, config);
  }

  // Update tenant configuration
  static updateTenant(domain: string, updates: Partial<TenantConfig>): boolean {
    const existing = this.TENANT_CONFIGS.get(domain);
    if (!existing) return false;
    
    const updated = { ...existing, ...updates };
    this.TENANT_CONFIGS.set(domain, updated);
    return true;
  }

  // Tenant middleware for Express
  static middleware() {
    return (req: Request & { tenant?: TenantConfig }, res: Response, next: NextFunction) => {
      const tenant = this.getTenantByDomain(req.hostname);
      
      if (!tenant) {
        return res.status(404).json({
          error: 'Tenant not found',
          domain: req.hostname,
          message: 'This domain is not configured for astrology services'
        });
      }

      req.tenant = tenant;
      
      // Set tenant-specific headers
      res.setHeader('X-Tenant-ID', tenant.id);
      res.setHeader('X-Tenant-Language', tenant.language);
      
      next();
    };
  }

  // Get tenant-specific pricing
  static getTenantPricing(tenantId: string, serviceType: string): number {
    const tenant = Array.from(this.TENANT_CONFIGS.values())
      .find(t => t.id === tenantId);
    
    if (!tenant) return 0;
    
    return tenant.paymentConfig.pricing[serviceType as keyof typeof tenant.paymentConfig.pricing] || 0;
  }

  // Get tenant-specific branding
  static getTenantBranding(tenantId: string): any {
    const tenant = Array.from(this.TENANT_CONFIGS.values())
      .find(t => t.id === tenantId);
    
    return tenant?.branding || {};
  }

  // Get tenant-specific engines
  static getTenantEngines(tenantId: string): string[] {
    const tenant = Array.from(this.TENANT_CONFIGS.values())
      .find(t => t.id === tenantId);
    
    return tenant?.features.engines || [];
  }
}

// Enhanced Request interface
declare global {
  namespace Express {
    interface Request {
      tenant?: TenantConfig;
    }
  }
}

export default TenantEngine;