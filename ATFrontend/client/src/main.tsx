import React from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import "./setup/apiBase";
import "./index.css";
import { initializeAnalytics } from "./lib/analytics";
import { LanguageProvider } from "./contexts/LanguageContext";
import { initCSSOptimizations } from "./utils/cssOptimization";
import { initializePerformanceOptimizations } from "./utils/performanceOptimizations";

// Initialize performance optimizations immediately
initCSSOptimizations();

// Initialize analytics after DOM is ready
initializeAnalytics();

// Performance monitoring for Core Web Vitals
function measurePerformance() {
  if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
    // Measure First Contentful Paint (FCP)
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          console.log('🚀 FCP optimized:', Math.round(entry.startTime), 'ms');
        }
      }
    }).observe({ entryTypes: ['paint'] });

    // Measure Largest Contentful Paint (LCP) 
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('🚀 LCP optimized:', Math.round(lastEntry.startTime), 'ms');
    }).observe({ entryTypes: ['largest-contentful-paint'] });
  }
}

// Start performance monitoring
measurePerformance();

// Initialize advanced performance optimizations
initializePerformanceOptimizations();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime in v5)
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <App />
        </LanguageProvider>
        {process.env.NODE_ENV === 'development' && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </QueryClientProvider>
    </HelmetProvider>
  </React.StrictMode>
);
