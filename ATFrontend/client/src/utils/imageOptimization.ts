// Image optimization utilities
export const getOptimizedImageUrl = (originalUrl: string, size: number = 120): string => {
  // For astrologer images, serve optimized versions
  if (originalUrl.includes('/astrologer-images/')) {
    const filename = originalUrl.split('/').pop();
    return `/api/optimized-image/${filename}?size=${size}`;
  }
  
  // For zodiac images, use the same optimization
  if (originalUrl.includes('/api/zodiac-images/')) {
    return `${originalUrl}?size=${size}`;
  }
  
  return originalUrl;
};

export const preloadCriticalImages = () => {
  // Preload hero section images
  const criticalImages = [
    '/api/zodiac-images/aries',
    '/api/zodiac-images/leo', 
    '/api/zodiac-images/sagittarius'
  ];
  
  criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = getOptimizedImageUrl(src, 48);
    document.head.appendChild(link);
  });
};

export const lazyLoadImages = () => {
  const images = document.querySelectorAll('img[data-lazy]');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        img.src = img.dataset.lazy || '';
        img.removeAttribute('data-lazy');
        observer.unobserve(img);
      }
    });
  });
  
  images.forEach(img => imageObserver.observe(img));
};

// Initialize optimizations on load
export const initImageOptimizations = () => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      preloadCriticalImages();
      lazyLoadImages();
    });
  } else {
    preloadCriticalImages();
    lazyLoadImages();
  }
};