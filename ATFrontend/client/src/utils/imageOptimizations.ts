/**
 * Image Optimization Utilities
 * Ensures reliable zodiac image serving with cache-busting and fallbacks
 */

// Version identifier for zodiac images to force cache refresh
const ZODIAC_IMAGE_VERSION = '2025.08.20';

export interface ZodiacImageConfig {
  name: string;
  image: string;
  version?: string;
}

export const zodiacSigns: ZodiacImageConfig[] = [
  { name: "Aries", image: "Aries.jpg" },
  { name: "Taurus", image: "Taurus.jpg" },
  { name: "Gemini", image: "Gemini.jpg" },
  { name: "Cancer", image: "Cancer.jpg" },
  { name: "Leo", image: "Leo.jpg" },
  { name: "Virgo", image: "Virgo.jpg" },
  { name: "Libra", image: "Libra.jpg" },
  { name: "Scorpio", image: "Scorpio.jpg" },
  { name: "Sagittarius", image: "Sagittarius.jpg" },
  { name: "Capricorn", image: "Capricorn.jpg" },
  { name: "Aquarius", image: "Aquarius.jpg" },
  { name: "Pisces", image: "Pisces.jpg" },
];

/**
 * Get optimized zodiac image URL with cache-busting
 */
export const getZodiacImageUrl = (imageName: string): string => {
  // Use the API endpoint to serve zodiac images directly by filename
  return `/api/zodiac-image/${imageName}?v=${ZODIAC_IMAGE_VERSION}`;
};

/**
 * Preload zodiac images for better performance
 */
export const preloadZodiacImages = (): void => {
  zodiacSigns.forEach(sign => {
    const img = new Image();
    img.src = getZodiacImageUrl(sign.image);
  });
  console.log('Zodiac images preloaded successfully');
};

/**
 * Create fallback content for broken zodiac images
 */
export const createZodiacFallback = (signName: string, element: HTMLElement): void => {
  if (!element) return;

  // Clear existing content
  element.innerHTML = '';
  
  // Create fallback with first letter and gradient background
  const fallback = document.createElement('div');
  fallback.className = 'w-full h-full bg-gradient-to-br from-orange-400 to-purple-600 flex items-center justify-center text-white text-2xl font-bold rounded-full';
  fallback.textContent = signName.charAt(0);
  fallback.setAttribute('aria-label', `${signName} zodiac sign`);
  
  element.appendChild(fallback);
};

/**
 * Enhanced image loading with retry mechanism
 */
export const loadZodiacImageWithRetry = (
  img: HTMLImageElement, 
  signName: string, 
  maxRetries: number = 2
): Promise<void> => {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    
    const attemptLoad = () => {
      attempts++;
      
      img.onload = () => resolve();
      img.onerror = () => {
        if (attempts < maxRetries) {
          // Retry with cache-busting timestamp
          const timestamp = Date.now();
          img.src = `/api/zodiac-image/${signName}.jpg?v=${ZODIAC_IMAGE_VERSION}&t=${timestamp}`;
          setTimeout(attemptLoad, 1000); // Wait 1 second before retry
        } else {
          reject(new Error(`Failed to load zodiac image for ${signName} after ${maxRetries} attempts`));
        }
      };
      
      if (attempts === 1) {
        img.src = getZodiacImageUrl(`${signName}.jpg`);
      }
    };
    
    attemptLoad();
  });
};

/**
 * Check if zodiac images are available
 */
export const validateZodiacImages = async (): Promise<{ available: string[], missing: string[] }> => {
  const available: string[] = [];
  const missing: string[] = [];

  const checkPromises = zodiacSigns.map(async (sign) => {
    try {
      const response = await fetch(getZodiacImageUrl(sign.image), { method: 'HEAD' });
      if (response.ok) {
        available.push(sign.name);
      } else {
        missing.push(sign.name);
      }
    } catch (error) {
      missing.push(sign.name);
    }
  });

  await Promise.all(checkPromises);
  
  return { available, missing };
};

export default {
  zodiacSigns,
  getZodiacImageUrl,
  preloadZodiacImages,
  createZodiacFallback,
  loadZodiacImageWithRetry,
  validateZodiacImages,
  ZODIAC_IMAGE_VERSION
};