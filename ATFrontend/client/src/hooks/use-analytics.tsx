import { useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { trackDomainPageView } from '../lib/domain-analytics';
import { trackSPAPageView } from '../lib/analytics';

export const useAnalytics = () => {
  const [location] = useLocation();
  const prevLocationRef = useRef<string>(location);
  
  useEffect(() => {
    if (location !== prevLocationRef.current) {
      // Track with domain-specific analytics
      trackDomainPageView(location);
      
      // Track with GTM for enhanced SPA navigation
      trackSPAPageView(location);
      
      prevLocationRef.current = location;
    }
  }, [location]);
};