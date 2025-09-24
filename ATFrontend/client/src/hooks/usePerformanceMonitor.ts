import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  lcp?: number;
  fid?: number;
  cls?: number;
  fcp?: number;
  ttfb?: number;
}

export const usePerformanceMonitor = () => {
  const metricsRef = useRef<PerformanceMetrics>({});

  useEffect(() => {
    // Measure Core Web Vitals
    const measureLCP = () => {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          metricsRef.current.lcp = lastEntry.startTime;
        });
        
        try {
          observer.observe({ type: 'largest-contentful-paint', buffered: true });
        } catch (e) {
          console.warn('LCP measurement not supported');
        }
      }
    };

    const measureFID = () => {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            metricsRef.current.fid = entry.processingStart - entry.startTime;
          });
        });
        
        try {
          observer.observe({ type: 'first-input', buffered: true });
        } catch (e) {
          console.warn('FID measurement not supported');
        }
      }
    };

    const measureCLS = () => {
      if ('PerformanceObserver' in window) {
        let clsValue = 0;
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
              metricsRef.current.cls = clsValue;
            }
          });
        });
        
        try {
          observer.observe({ type: 'layout-shift', buffered: true });
        } catch (e) {
          console.warn('CLS measurement not supported');
        }
      }
    };

    const measureFCP = () => {
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (entry.name === 'first-contentful-paint') {
              metricsRef.current.fcp = entry.startTime;
            }
          });
        });
        
        try {
          observer.observe({ type: 'paint', buffered: true });
        } catch (e) {
          console.warn('FCP measurement not supported');
        }
      }
    };

    const measureTTFB = () => {
      if ('performance' in window && 'getEntriesByType' in window.performance) {
        const navigation = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigation) {
          metricsRef.current.ttfb = navigation.responseStart - navigation.requestStart;
        }
      }
    };

    // Start measurements
    measureLCP();
    measureFID();
    measureCLS();
    measureFCP();
    measureTTFB();

    // Log metrics after page load
    const logMetrics = () => {
      setTimeout(() => {
        const metrics = metricsRef.current;
        if (process.env.NODE_ENV === 'development') {
          console.log('Performance Metrics:', {
            LCP: metrics.lcp ? `${Math.round(metrics.lcp)}ms` : 'N/A',
            FID: metrics.fid ? `${Math.round(metrics.fid)}ms` : 'N/A',
            CLS: metrics.cls ? metrics.cls.toFixed(3) : 'N/A',
            FCP: metrics.fcp ? `${Math.round(metrics.fcp)}ms` : 'N/A',
            TTFB: metrics.ttfb ? `${Math.round(metrics.ttfb)}ms` : 'N/A',
          });
        }
      }, 3000);
    };

    if (document.readyState === 'complete') {
      logMetrics();
    } else {
      window.addEventListener('load', logMetrics);
    }

    return () => {
      window.removeEventListener('load', logMetrics);
    };
  }, []);

  const getMetrics = () => metricsRef.current;

  const reportToAnalytics = (metrics: PerformanceMetrics) => {
    // Report to Google Analytics if available
    if (typeof window !== 'undefined' && window.gtag) {
      Object.entries(metrics).forEach(([name, value]) => {
        if (value !== undefined) {
          window.gtag('event', 'performance_metric', {
            metric_name: name.toUpperCase(),
            metric_value: Math.round(typeof value === 'number' ? value : 0),
            custom_parameter: 'mobile_optimization'
          });
        }
      });
    }
  };

  return {
    getMetrics,
    reportToAnalytics
  };
};

export default usePerformanceMonitor;