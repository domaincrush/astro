import { useState, useEffect } from 'react';

interface OptimizedImageConfig {
  quality?: number;
  format?: 'webp' | 'avif' | 'jpeg' | 'png';
  width?: number;
  height?: number;
}

export const useOptimizedImages = () => {
  const [supportsWebP, setSupportsWebP] = useState<boolean | null>(null);
  const [supportsAVIF, setSupportsAVIF] = useState<boolean | null>(null);

  useEffect(() => {
    // Check WebP support
    const checkWebP = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    };

    // Check AVIF support
    const checkAVIF = async () => {
      if (!window.createImageBitmap) return false;
      
      const avifData = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';
      
      try {
        const img = new Image();
        img.src = avifData;
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });
        return true;
      } catch {
        return false;
      }
    };

    setSupportsWebP(checkWebP());
    
    checkAVIF().then(setSupportsAVIF);
  }, []);

  const getOptimizedImageUrl = (
    originalUrl: string,
    config: OptimizedImageConfig = {}
  ): string => {
    const {
      quality = 85,
      format = 'auto',
      width,
      height
    } = config;

    // Don't optimize external URLs or SVGs
    if (originalUrl.startsWith('http') && !originalUrl.includes(window.location.hostname)) {
      return originalUrl;
    }
    
    if (originalUrl.includes('.svg')) {
      return originalUrl;
    }

    // Determine best format based on browser support
    let targetFormat = format;
    if (format === 'auto') {
      if (supportsAVIF) {
        targetFormat = 'avif';
      } else if (supportsWebP) {
        targetFormat = 'webp';
      } else {
        targetFormat = 'jpeg';
      }
    }

    // For local images, try to use optimized versions
    if (originalUrl.includes('/astrologer-images/') || originalUrl.includes('/images/')) {
      const pathParts = originalUrl.split('.');
      const extension = pathParts.pop();
      const basePath = pathParts.join('.');
      
      // Try different optimization strategies
      if (targetFormat === 'webp' || targetFormat === 'avif') {
        const optimizedPath = `${basePath}.${targetFormat}`;
        
        // Add responsive sizing if specified
        if (width || height) {
          const sizeQuery = new URLSearchParams();
          if (width) sizeQuery.set('w', width.toString());
          if (height) sizeQuery.set('h', height.toString());
          sizeQuery.set('q', quality.toString());
          
          return `${optimizedPath}?${sizeQuery.toString()}`;
        }
        
        return optimizedPath;
      }
    }

    return originalUrl;
  };

  const preloadImage = (url: string, config?: OptimizedImageConfig) => {
    const optimizedUrl = getOptimizedImageUrl(url, config);
    
    // Create preload link
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = optimizedUrl;
    
    // Add to head if not already present
    if (!document.querySelector(`link[href="${optimizedUrl}"]`)) {
      document.head.appendChild(link);
    }
  };

  const getResponsiveSizes = (baseWidth: number) => {
    return {
      mobile: Math.round(baseWidth * 0.5),
      tablet: Math.round(baseWidth * 0.75),
      desktop: baseWidth
    };
  };

  return {
    supportsWebP,
    supportsAVIF,
    getOptimizedImageUrl,
    preloadImage,
    getResponsiveSizes
  };
};

export default useOptimizedImages;