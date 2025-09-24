import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { setPageTitle } from 'src/utils/pageTitles';

/**
 * Hook to automatically set page title and scroll to top on route changes
 */
export const usePageTitle = () => {
  const [location] = useLocation();
  
  useEffect(() => {
    // Set the page title
    setPageTitle(location);
    
    // Scroll to top of page when route changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [location]);
};