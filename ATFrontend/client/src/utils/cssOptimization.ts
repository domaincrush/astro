// CSS optimization utilities to address render-blocking CSS
export const inlineCriticalCSS = () => {
  const criticalCSS = `
    /* Critical path CSS - Inlined to prevent render blocking */
    .min-h-screen{min-height:100vh}
    .bg-gradient-to-br{background-image:linear-gradient(to bottom right,var(--tw-gradient-stops))}
    .from-orange-50{--tw-gradient-from:#fff7ed;--tw-gradient-to:rgb(255 247 237/0);--tw-gradient-stops:var(--tw-gradient-from),var(--tw-gradient-to)}
    .via-amber-50{--tw-gradient-to:rgb(255 251 235/0);--tw-gradient-stops:var(--tw-gradient-from),#fffbeb,var(--tw-gradient-to)}
    .to-yellow-50{--tw-gradient-to:#fefce8}
    .flex{display:flex}
    .items-center{align-items:center}
    .justify-center{justify-content:center}
    .p-8{padding:2rem}
    .animate-spin{animation:spin 1s linear infinite}
    @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
    .container{width:100%;max-width:1200px;margin:0 auto;padding:0 1rem}
    .text-center{text-align:center}
    .font-bold{font-weight:700}
    .text-2xl{font-size:1.5rem;line-height:2rem}
    .mb-8{margin-bottom:2rem}
    .mt-8{margin-top:2rem}
    .grid{display:grid}
    .gap-6{gap:1.5rem}
    .md\\:grid-cols-2{grid-template-columns:repeat(2,1fr)}
    .lg\\:grid-cols-3{grid-template-columns:repeat(3,1fr)}
    .rounded-lg{border-radius:0.5rem}
    .shadow-lg{box-shadow:0 10px 15px -3px rgb(0 0 0/0.1),0 4px 6px -4px rgb(0 0 0/0.1)}
    .bg-white{background-color:#fff}
    .p-6{padding:1.5rem}
    .text-gray-700{color:#374151}
    .text-amber-500{color:#f59e0b}
    .text-blue-500{color:#3b82f6}
    .hover\\:transform:hover{transform:translateY(-2px)}
    .transition-transform{transition-property:transform;transition-timing-function:cubic-bezier(0.4,0,0.2,1);transition-duration:150ms}
  `;
  
  // Only inject if not already present
  if (!document.querySelector('#critical-css')) {
    const style = document.createElement('style');
    style.id = 'critical-css';
    style.innerHTML = criticalCSS;
    document.head.insertBefore(style, document.head.firstChild);
  }
};

export const deferNonCriticalCSS = () => {
  // Find and defer non-critical stylesheets
  const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
  stylesheets.forEach((link) => {
    const linkElement = link as HTMLLinkElement;
    if (linkElement.href.includes('index-DJdc6cyx.css') || linkElement.href.includes('fonts.googleapis.com')) {
      // Make non-critical CSS load asynchronously
      linkElement.media = 'print';
      linkElement.addEventListener('load', () => {
        linkElement.media = 'all';
      });
    }
  });
};

export const preloadFonts = () => {
  // Preload critical fonts
  const fontPreload = document.createElement('link');
  fontPreload.rel = 'preload';
  fontPreload.as = 'font';
  fontPreload.type = 'font/woff2';
  fontPreload.href = 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2';
  fontPreload.crossOrigin = 'anonymous';
  document.head.appendChild(fontPreload);
};

export const optimizeGoogleAnalytics = () => {
  // Defer Google Analytics to prevent blocking
  const scripts = document.querySelectorAll('script[src*="gtag"]');
  scripts.forEach(script => {
    script.setAttribute('defer', '');
    script.setAttribute('data-optimize', 'true');
  });
};

export const initCSSOptimizations = () => {
  // Run optimizations in optimal order
  inlineCriticalCSS();
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      deferNonCriticalCSS();
      preloadFonts();
      optimizeGoogleAnalytics();
    });
  } else {
    deferNonCriticalCSS();
    preloadFonts();
    optimizeGoogleAnalytics();
  }
};