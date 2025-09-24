// Performance optimization utilities
export const preloadCriticalResources = () => {
  // Preload critical CSS
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'style';
  link.href = '/assets/index-DJdc6cyx.css';
  document.head.appendChild(link);

  // Preload critical JavaScript
  const scriptLink = document.createElement('link');
  scriptLink.rel = 'preload';
  scriptLink.as = 'script';
  scriptLink.href = '/assets/index-BwGxRJYJ.js';
  document.head.appendChild(scriptLink);
};

export const deferNonCriticalResources = () => {
  // Defer loading of non-critical scripts
  const scripts = document.querySelectorAll('script[src*="gtag"]');
  scripts.forEach(script => {
    script.setAttribute('defer', '');
  });
};

export const optimizeImages = () => {
  // Add loading="lazy" to all images
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    if (!img.hasAttribute('loading')) {
      img.setAttribute('loading', 'lazy');
    }
  });
};

export const initPerformanceOptimizations = () => {
  // Run optimizations after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      deferNonCriticalResources();
      optimizeImages();
    });
  } else {
    deferNonCriticalResources();
    optimizeImages();
  }
  
  // Preload critical resources immediately
  preloadCriticalResources();
};

// Critical path CSS inlining utility
export const inlineCriticalCSS = () => {
  const criticalStyles = `
    /* Critical path styles for initial render */
    .min-h-screen { min-height: 100vh; }
    .bg-gradient-to-br { background-image: linear-gradient(to bottom right, var(--tw-gradient-stops)); }
    .from-orange-50 { --tw-gradient-from: #fff7ed; --tw-gradient-to: rgb(255 247 237 / 0); --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to); }
    .via-amber-50 { --tw-gradient-to: rgb(255 251 235 / 0); --tw-gradient-stops: var(--tw-gradient-from), #fffbeb, var(--tw-gradient-to); }
    .to-yellow-50 { --tw-gradient-to: #fefce8; }
    .flex { display: flex; }
    .items-center { align-items: center; }
    .justify-center { justify-content: center; }
    .p-8 { padding: 2rem; }
    .animate-spin { animation: spin 1s linear infinite; }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  `;
  
  const style = document.createElement('style');
  style.innerHTML = criticalStyles;
  document.head.insertBefore(style, document.head.firstChild);
};