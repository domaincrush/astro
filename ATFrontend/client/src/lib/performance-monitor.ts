// Performance monitoring utilities for measuring LCP, TTFB, and API response times

interface PerformanceMetrics {
  lcp?: number;
  ttfb?: number;
  apiResponseTimes: { [key: string]: number };
  cacheHitRate: number;
  totalQueries: number;
  cachedQueries: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    apiResponseTimes: {},
    cacheHitRate: 0,
    totalQueries: 0,
    cachedQueries: 0,
  };

  // Measure Largest Contentful Paint (LCP)
  measureLCP(): Promise<number> {
    return new Promise((resolve) => {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lcpEntry = entries[entries.length - 1];
        const lcp = lcpEntry.startTime;
        this.metrics.lcp = lcp;
        observer.disconnect();
        resolve(lcp);
      });
      
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
      
      // Fallback timeout after 10 seconds
      setTimeout(() => {
        observer.disconnect();
        resolve(0);
      }, 10000);
    });
  }

  // Measure Time to First Byte (TTFB)
  measureTTFB(): number {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      const ttfb = navigation.responseStart - navigation.requestStart;
      this.metrics.ttfb = ttfb;
      return ttfb;
    }
    return 0;
  }

  // Track API response times
  trackAPICall(endpoint: string, startTime: number, fromCache: boolean = false): void {
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    this.metrics.apiResponseTimes[endpoint] = duration;
    this.metrics.totalQueries++;
    
    if (fromCache) {
      this.metrics.cachedQueries++;
    }
    
    this.metrics.cacheHitRate = (this.metrics.cachedQueries / this.metrics.totalQueries) * 100;
    
    console.log(`📊 API Call: ${endpoint} - ${duration.toFixed(2)}ms ${fromCache ? '(cached)' : '(fresh)'}`);
  }

  // Get performance summary
  getSummary(): PerformanceMetrics {
    return { ...this.metrics };
  }

  // Log performance report
  logReport(): void {
    console.group('🚀 Performance Report');
    console.log(`✅ LCP: ${this.metrics.lcp?.toFixed(2)}ms`);
    console.log(`✅ TTFB: ${this.metrics.ttfb?.toFixed(2)}ms`);
    console.log(`✅ Cache Hit Rate: ${this.metrics.cacheHitRate.toFixed(1)}%`);
    console.log(`✅ Total Queries: ${this.metrics.totalQueries}`);
    console.log('✅ API Response Times:', this.metrics.apiResponseTimes);
    console.groupEnd();
  }

  // Enhanced API request wrapper that tracks performance
  async trackAPIRequest<T>(
    endpoint: string,
    fetchFn: () => Promise<T>,
    fromCache: boolean = false
  ): Promise<T> {
    const startTime = performance.now();
    
    try {
      const result = await fetchFn();
      this.trackAPICall(endpoint, startTime, fromCache);
      return result;
    } catch (error) {
      this.trackAPICall(endpoint, startTime, fromCache);
      throw error;
    }
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// Hook for measuring component performance
export function usePerformanceTracking(componentName: string) {
  const startTime = performance.now();
  
  return {
    markComplete: () => {
      const duration = performance.now() - startTime;
      console.log(`⚡ ${componentName} render time: ${duration.toFixed(2)}ms`);
    }
  };
}

// Initialize performance monitoring
export function initPerformanceMonitoring() {
  // Measure core web vitals
  performanceMonitor.measureLCP();
  performanceMonitor.measureTTFB();
  
  // Log report after 5 seconds
  setTimeout(() => {
    performanceMonitor.logReport();
  }, 5000);
}