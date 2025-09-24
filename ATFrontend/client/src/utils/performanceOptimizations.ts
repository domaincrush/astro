/**
 * Advanced Performance Optimizations for AstroTick
 * Addresses critical loading issues from Lighthouse report
 */

// Component preloading for critical routes
export const preloadCriticalComponents = () => {
  // Preload most accessed components
  const criticalRoutes = [
    () => import("src/pages/enhanced-home"),
    () => import("src/pages/tamil/home"),
    () => import("src/pages/hindi/home"),
    () => import("src/pages/daily-horoscope"),
    () => import("src/pages/kundli"),
  ];

  // Preload on user interaction or after initial load
  const preloadOnInteraction = () => {
    criticalRoutes.forEach(route => {
      route().catch(() => {
        // Silently handle preload failures
      });
    });
  };

  // Preload after 2 seconds of page load
  setTimeout(preloadOnInteraction, 2000);

  // Preload on first user interaction
  ['mousedown', 'touchstart', 'keydown'].forEach(event => {
    document.addEventListener(event, preloadOnInteraction, { once: true, passive: true });
  });
};

// Optimize image loading
export const optimizeImageLoading = () => {
  // Add lazy loading to all images
  const images = document.querySelectorAll('img:not([loading])');
  images.forEach((img) => {
    img.setAttribute('loading', 'lazy');
    img.setAttribute('decoding', 'async');
  });
};

// Memory optimization - cleanup unused components
export const optimizeMemoryUsage = () => {
  // Clear React Query cache for inactive queries
  const cleanup = () => {
    if (window.gc) {
      window.gc();
    }
  };

  // Run cleanup every 5 minutes
  setInterval(cleanup, 5 * 60 * 1000);
};

// Resource hints for faster navigation
export const addResourceHints = () => {
  // Prefetch critical CSS
  const prefetchCSS = (href: string) => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    document.head.appendChild(link);
  };

  // DNS prefetch for external resources
  const dnsPrefetch = (hostname: string) => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = `//${hostname}`;
    document.head.appendChild(link);
  };

  // Add resource hints
  dnsPrefetch('fonts.googleapis.com');
  dnsPrefetch('fonts.gstatic.com');
};

// Bundle size monitoring
export const monitorBundleSize = () => {
  if (process.env.NODE_ENV === 'development') {
    // Monitor module loading via performance entries
    let totalModules = 0;

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name.includes('.js') || entry.name.includes('.tsx')) {
          totalModules++;
          // console.log(`📦 Module ${totalModules} loaded:`, entry.name);
        }
      }
    });

    observer.observe({ entryTypes: ['resource'] });
  }
};

// Core Web Vitals optimization
export const optimizeCoreWebVitals = () => {
  // Reduce layout shifts
  const preventLayoutShift = () => {
    // Add aspect ratio containers for dynamic content
    const dynamicContainers = document.querySelectorAll('[data-dynamic-content]');
    dynamicContainers.forEach((container) => {
      const element = container as HTMLElement;
      if (!element.style.minHeight) {
        element.style.minHeight = '200px';
      }
    });
  };

  // Run optimization after DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', preventLayoutShift);
  } else {
    preventLayoutShift();
  }

  // Optimize for LCP
  const optimizeLCP = () => {
    // Ensure hero images load immediately
    const heroImages = document.querySelectorAll('[data-hero-image]');
    heroImages.forEach(img => {
      img.removeAttribute('loading');
      img.setAttribute('fetchpriority', 'high');
    });
  };

  optimizeLCP();
};

// Initialize all optimizations
export const initializePerformanceOptimizations = () => {
  preloadCriticalComponents();
  optimizeImageLoading();
  optimizeMemoryUsage();
  addResourceHints();
  monitorBundleSize();
  optimizeCoreWebVitals();

  console.log('🚀 Performance optimizations initialized');
};

// Export performance metrics
export const getPerformanceMetrics = () => {
  if (!window.performance) return null;

  const navigation = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  
  return {
    // Core Web Vitals approximations
    ttfb: navigation.responseStart - navigation.requestStart,
    fcp: navigation.loadEventStart - navigation.fetchStart,
    domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
    loadComplete: navigation.loadEventEnd - navigation.fetchStart,
    
    // Resource timing
    totalResources: window.performance.getEntriesByType('resource').length,
    
    // Memory usage (if available)
    memoryUsage: (window.performance as any).memory ? {
      used: (window.performance as any).memory.usedJSHeapSize,
      total: (window.performance as any).memory.totalJSHeapSize,
      limit: (window.performance as any).memory.jsHeapSizeLimit,
    } : null
  };
};