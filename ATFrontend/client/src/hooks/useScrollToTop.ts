import { useEffect } from 'react';
import { useLocation } from 'wouter';

/**
 * Hook to automatically scroll to top when route changes
 * Can be used independently of page title management
 */
export const useScrollToTop = () => {
  const [location] = useLocation();
  
  useEffect(() => {
    // Scroll to top immediately when route changes
    window.scrollTo(0, 0);
  }, [location]);
};

/**
 * Hook for smooth scrolling to top when route changes
 */
export const useSmoothScrollToTop = () => {
  const [location] = useLocation();
  
  useEffect(() => {
    // Smooth scroll to top when route changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [location]);
};