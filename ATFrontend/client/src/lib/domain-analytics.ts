/**
 * Domain-Specific Analytics Library
 * Automatically detects domain and uses appropriate GA measurement ID
 */

// Define the gtag function globally
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

interface GAConfig {
  measurementId: string;
  domain: string;
  description: string;
}

/**
 * Fetch GA configuration for current domain
 */
async function fetchGAConfig(): Promise<GAConfig> {
  try {
    const response = await fetch('/api/analytics/ga-config');
    const result = await response.json();
    
    if (result.success) {
      return result.data;
    } else {
      throw new Error('Failed to fetch GA config');
    }
  } catch (error) {
    console.error('Error fetching GA config, using fallback:', error);
    
    // Fallback - detect domain client-side
    const hostname = window.location.hostname.toLowerCase();
    
    if (hostname.includes('astrotelugu.com')) {
      return { measurementId: 'G-4WEEFM6FMG', domain: 'astrotelugu.com', description: 'Telugu astrology' };
    } else if (hostname.includes('kundali.in')) {
      return { measurementId: 'G-5VR1MQVZT7', domain: 'kundali.in', description: 'Hindi kundali' };
    } else if (hostname.includes('astroscroll.com')) {
      return { measurementId: 'G-PC57P59368', domain: 'astroscroll.com', description: 'Modern astrology tech' };
    } else if (hostname.includes('indiahoroscope.com')) {
      return { measurementId: 'G-FNHNFC5THW', domain: 'indiahoroscope.com', description: 'Pan-Indian horoscope' };
    } else if (hostname.includes('jaataka.com')) {
      return { measurementId: 'G-6NGR8DYFJG', domain: 'jaataka.com', description: 'Classical Sanskrit' };
    } else if (hostname.includes('astroneram.com')) {
      return { measurementId: 'G-XD2QHSWYST', domain: 'astroneram.com', description: 'Tamil timing' };
    } else if (hostname.includes('astrojothidam.com')) {
      return { measurementId: 'G-6HQT8ZFD0Q', domain: 'astrojothidam.com', description: 'Tamil predictions' };
    } else {
      return { measurementId: 'G-GY45PGDQT9', domain: 'astrotick.com', description: 'Premium astrology platform' };
    }
  }
}

/**
 * Initialize Google Analytics with domain-specific configuration
 */
export const initDomainGA = async () => {
  try {
    const config = await fetchGAConfig();
    
    console.log(`🔍 Initializing GA for ${config.domain} with ID: ${config.measurementId}`);
    
    // Add Google Analytics script to the head with security enhancements
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(config.measurementId)}`;
    script1.crossOrigin = 'anonymous';
    document.head.appendChild(script1);

    // Initialize gtag with sanitized content
    const script2 = document.createElement('script');
    script2.textContent = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${encodeURIComponent(config.measurementId)}', {
        page_title: '${encodeURIComponent(config.description)}',
        custom_map: {
          'dimension1': 'domain'
        }
      });
      gtag('event', 'page_view', {
        'domain': '${encodeURIComponent(config.domain)}'
      });
    `;
    document.head.appendChild(script2);
    
    // Set global reference for tracking functions
    (window as any).currentGAConfig = config;
    
    return config;
  } catch (error) {
    console.error('Failed to initialize domain GA:', error);
    return null;
  }
};

/**
 * Track page views with domain context
 */
export const trackDomainPageView = (url: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  const config = (window as any).currentGAConfig;
  if (!config) return;
  
  window.gtag('config', config.measurementId, {
    page_path: url,
    page_title: `${config.description} - ${url}`,
    custom_map: {
      'dimension1': 'domain'
    }
  });
  
  window.gtag('event', 'page_view', {
    'domain': config.domain,
    'page_path': url
  });
};

/**
 * Track events with domain context
 */
export const trackDomainEvent = (
  action: string, 
  category?: string, 
  label?: string, 
  value?: number
) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  const config = (window as any).currentGAConfig;
  if (!config) return;
  
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
    domain: config.domain,
    site_description: config.description
  });
};

/**
 * Track consultation starts with domain context
 */
export const trackConsultationStart = (astrologerId: string, consultationType: string) => {
  trackDomainEvent('consultation_start', 'consultation', `${astrologerId}-${consultationType}`);
};

/**
 * Track form submissions with domain context
 */
export const trackFormSubmission = (formName: string, formData?: any) => {
  trackDomainEvent('form_submit', 'form', formName);
};

/**
 * Track payment completions with domain context
 */
export const trackPaymentComplete = (amount: number, service: string, paymentMethod: string) => {
  trackDomainEvent('purchase', 'payment', `${service}-${paymentMethod}`, amount);
};

/**
 * Track kundli/horoscope generations with domain context
 */
export const trackKundliGeneration = (birthDetails: any) => {
  const config = (window as any).currentGAConfig;
  trackDomainEvent('kundli_generate', 'calculation', config?.domain || 'unknown');
};

/**
 * Track panchang views with domain context
 */
export const trackPanchangView = (date: string, location: string) => {
  trackDomainEvent('panchang_view', 'calculation', `${date}-${location}`);
};

/**
 * Legacy compatibility - use domain-specific initialization
 */
export const initGA = initDomainGA;
export const trackPageView = trackDomainPageView;
export const trackEvent = trackDomainEvent;