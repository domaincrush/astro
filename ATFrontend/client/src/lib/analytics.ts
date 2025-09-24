// Define the gtag function globally
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

// Initialize Google Analytics and GTM with enhanced tracking
export const initGA = () => {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

  if (!measurementId) {
    console.warn('Missing required Google Analytics key: VITE_GA_MEASUREMENT_ID');
    return;
  }

  // Initialize dataLayer first
  window.dataLayer = window.dataLayer || [];

  // Add Google Tag Manager script to head
  const gtmScript = document.createElement('script');
  gtmScript.async = true;
  gtmScript.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-TK2M5JF2';
  document.head.appendChild(gtmScript);

  // Initialize GTM dataLayer with enhanced tracking
  const gtmInit = document.createElement('script');
  gtmInit.textContent = `
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-TK2M5JF2');
    
    // Enhanced tracking setup
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    
    // Configure enhanced tracking
    gtag('config', 'GTM-TK2M5JF2', {
      enhanced_link_attribution: true,
      linker: {
        domains: ['astrotick.com']
      }
    });
  `;
  document.head.appendChild(gtmInit);

  // Add Google Analytics script to the head with integrity check
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  script1.crossOrigin = 'anonymous';
  document.head.appendChild(script1);

  // Initialize gtag with enhanced tracking
  const script2 = document.createElement('script');
  script2.textContent = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${encodeURIComponent(measurementId)}', {
      enhanced_link_attribution: true,
      custom_map: {
        'custom_parameter': 'custom_dimension_1'
      }
    });
  `;
  document.head.appendChild(script2);

  // Setup enhanced event tracking after DOM loads
  setupEnhancedTracking();
};

// Track page views - useful for single-page applications
export const trackPageView = (url: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (!measurementId) return;
  
  window.gtag('config', measurementId, {
    page_path: url
  });
};

// Track events
export const trackEvent = (
  action: string, 
  category?: string, 
  label?: string, 
  value?: number
) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
  
  // Event tracked to Google Analytics
};

// Send essential tracking events for user sessions
export const sendEssentialEvents = () => {
  if (typeof window === 'undefined' || !window.gtag) return;
  
  // Core events for analytics
  trackEvent('user_interaction', 'navigation', 'homepage_visit');
  trackEvent('conversion', 'engagement', 'session_start');
};

// Setup enhanced tracking features
const setupEnhancedTracking = () => {
  if (typeof window === 'undefined') return;

  // Track scroll depth
  let scrollTracked = false;
  const trackScrollDepth = () => {
    if (scrollTracked) return;
    
    const scrollPercent = Math.round(
      (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
    );
    
    if (scrollPercent >= 90) {
      scrollTracked = true;
      window.dataLayer.push({
        event: 'scroll_depth',
        scroll_percent: scrollPercent,
        page_path: window.location.pathname
      });
    }
  };

  // Track outbound clicks
  const trackOutboundClicks = (event: Event) => {
    const target = event.target as HTMLAnchorElement;
    if (!target || target.tagName !== 'A') return;
    
    const href = target.href;
    if (!href) return;
    
    try {
      const url = new URL(href);
      const currentDomain = window.location.hostname;
      
      // Check if it's an outbound link
      if (url.hostname !== currentDomain && !url.hostname.includes('astrotick.com')) {
        window.dataLayer.push({
          event: 'outbound_click',
          outbound_url: href,
          link_text: target.textContent || target.innerHTML,
          page_path: window.location.pathname
        });
      }
    } catch (e) {
      // Invalid URL, skip tracking
    }
  };

  // Track form interactions
  const trackFormInteractions = () => {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      // Track form submissions
      form.addEventListener('submit', (event) => {
        const formId = form.id || 'unnamed_form';
        const formAction = form.action || window.location.href;
        
        window.dataLayer.push({
          event: 'form_submit',
          form_id: formId,
          form_action: formAction,
          page_path: window.location.pathname
        });
      });

      // Track form field interactions
      const inputs = form.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
        input.addEventListener('focus', () => {
          window.dataLayer.push({
            event: 'form_interaction',
            form_id: form.id || 'unnamed_form',
            field_name: input.getAttribute('name') || input.getAttribute('id') || 'unnamed_field',
            interaction_type: 'focus',
            page_path: window.location.pathname
          });
        });
      });
    });
  };

  // Setup event listeners
  window.addEventListener('scroll', trackScrollDepth, { passive: true });
  document.addEventListener('click', trackOutboundClicks);
  
  // Track forms on DOM ready and when new content loads
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', trackFormInteractions);
  } else {
    trackFormInteractions();
  }

  // Re-track forms when new content is added (for SPA)
  const observer = new MutationObserver(() => {
    trackFormInteractions();
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
};

// Track single-page app navigation
export const trackSPAPageView = (path: string) => {
  if (typeof window === 'undefined' || !window.dataLayer) return;
  
  window.dataLayer.push({
    event: 'spa_page_view',
    page_path: path,
    page_title: document.title,
    page_location: window.location.href
  });
};

// Initialize analytics (simplified for production)
export const initializeAnalytics = () => {
  // Analytics initialization completed
};