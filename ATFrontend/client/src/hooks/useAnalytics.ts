/**
 * React Hook for Analytics Integration
 * Provides easy analytics tracking throughout the application
 */

import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { analytics, trackUserSignup, trackKundliGeneration, trackConsultationBooking, trackAstrologerView, trackPremiumReport } from 'src/lib/advanced-analytics';

/**
 * Hook for page view tracking
 */
export function usePageTracking() {
  const [location] = useLocation();
  
  useEffect(() => {
    // Track page views automatically
    analytics.trackEvent('page_view', {
      page_path: location,
      page_title: document.title,
      referrer: document.referrer
    });
  }, [location]);
}

/**
 * Hook for form tracking
 */
export function useFormTracking(formName: string) {
  const trackFormStart = () => {
    analytics.trackEvent('form_started', {
      form_name: formName,
      form_location: window.location.pathname
    });
  };
  
  const trackFormSubmit = (success: boolean, errorMessage?: string) => {
    analytics.trackEvent('form_submitted', {
      form_name: formName,
      success,
      error_message: errorMessage,
      form_location: window.location.pathname
    });
  };
  
  const trackFormField = (fieldName: string, action: 'focus' | 'blur' | 'change') => {
    analytics.trackEvent('form_field_interaction', {
      form_name: formName,
      field_name: fieldName,
      action,
      form_location: window.location.pathname
    });
  };
  
  return {
    trackFormStart,
    trackFormSubmit,
    trackFormField
  };
}

/**
 * Hook for button click tracking - ENHANCED FOR COMPREHENSIVE GA/GTM TRACKING
 */
export function useClickTracking() {
  const trackClick = (elementName: string, category: string = 'button', additionalData: Record<string, any> = {}) => {
    // Send to analytics system AND directly to GA/GTM
    analytics.trackEvent('element_clicked', {
      element_name: elementName,
      element_category: category,
      page_location: window.location.pathname,
      ...additionalData
    });
    
    // ALSO send with GA-specific event structure
    analytics.trackEvent('button_click', {
      event_category: category,
      event_label: elementName,
      button_name: elementName,
      click_location: window.location.pathname,
      ...additionalData
    });
  };
  
  const trackCTA = (ctaName: string, placement: string, targetAction: string) => {
    // Send CTA click to analytics system AND directly to GA/GTM
    analytics.trackEvent('cta_clicked', {
      cta_name: ctaName,
      cta_placement: placement,
      target_action: targetAction,
      page_location: window.location.pathname
    });
    
    // ALSO send with GA-specific CTA event structure
    analytics.trackEvent('cta_interaction', {
      event_category: 'cta',
      event_label: ctaName,
      cta_name: ctaName,
      cta_placement: placement,
      target_action: targetAction,
      interaction_type: 'click'
    });
  };
  
  return {
    trackClick,
    trackCTA
  };
}

/**
 * Hook for scroll tracking
 */
export function useScrollTracking(thresholds: number[] = [25, 50, 75, 90]) {
  useEffect(() => {
    const trackedThresholds = new Set<number>();
    
    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      
      thresholds.forEach(threshold => {
        if (scrollPercent >= threshold && !trackedThresholds.has(threshold)) {
          trackedThresholds.add(threshold);
          analytics.trackEvent('scroll_depth', {
            scroll_percentage: threshold,
            page_location: window.location.pathname,
            page_title: document.title
          });
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [thresholds]);
}

/**
 * Hook for time-based engagement tracking
 */
export function useEngagementTracking() {
  useEffect(() => {
    const startTime = Date.now();
    
    // Track engagement milestones
    const milestones = [
      { time: 10000, name: '10_second_engagement' },
      { time: 30000, name: '30_second_engagement' },
      { time: 60000, name: '1_minute_engagement' },
      { time: 300000, name: '5_minute_engagement' }
    ];
    
    const timeouts = milestones.map(milestone => 
      setTimeout(() => {
        analytics.trackEvent('engagement_milestone', {
          milestone: milestone.name,
          time_spent: milestone.time,
          page_location: window.location.pathname
        });
      }, milestone.time)
    );
    
    // Track session end
    const handleBeforeUnload = () => {
      const sessionDuration = Date.now() - startTime;
      analytics.trackEvent('session_end', {
        session_duration: sessionDuration,
        page_location: window.location.pathname,
        exit_page: true
      });
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
}

/**
 * Pre-configured analytics functions for common astrology platform actions
 */
export const useAstrologyAnalytics = () => {
  return {
    // User journey tracking
    trackSignup: trackUserSignup,
    trackLogin: (method: string = 'email') => {
      analytics.trackEvent('login', { login_method: method });
    },
    
    // Astrology feature tracking
    trackKundli: trackKundliGeneration,
    trackHoroscope: (zodiacSign: string) => {
      analytics.trackAstrologyFeature('horoscope_viewed', { zodiac_sign: zodiacSign });
    },
    trackPanchang: (location: string) => {
      analytics.trackAstrologyFeature('panchang_checked', { location });
    },
    trackCalculator: (calculatorType: string, inputData: Record<string, any>) => {
      analytics.trackAstrologyFeature('calculator_used', { calculator_type: calculatorType, ...inputData });
    },
    
    // Consultation tracking
    trackAstrologerProfile: trackAstrologerView,
    trackConsultationStart: (astrologerId: number, consultationType: string) => {
      analytics.trackConsultationFunnel('consultation_started', astrologerId);
      analytics.trackEvent('consultation_started', {
        astrologer_id: astrologerId,
        consultation_type: consultationType
      });
    },
    trackPayment: (amount: number, paymentMethod: string, success: boolean) => {
      analytics.trackEvent(success ? 'payment_completed' : 'payment_failed', {
        amount,
        payment_method: paymentMethod,
        currency: 'INR'
      });
    },
    trackConsultationEnd: (astrologerId: number, duration: number, rating?: number) => {
      analytics.trackEvent('consultation_completed', {
        astrologer_id: astrologerId,
        duration_minutes: duration,
        user_rating: rating
      });
    },
    
    // Premium features
    trackPremiumReport: trackPremiumReport,
    trackPromoCode: (promoCode: string, discountAmount: number) => {
      analytics.trackEvent('promo_code_applied', {
        promo_code: promoCode,
        discount_amount: discountAmount
      });
    }
  };
};