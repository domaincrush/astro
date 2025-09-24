/**
 * Advanced Analytics Tracking for User Journey and Business Events
 * Supports both Google Analytics (GA) and Google Tag Manager (GTM)
 */

// Enhanced event tracking interface
interface AnalyticsEvent {
  event_name: string;
  event_category?: string;
  event_label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

// User journey stages for astrology platform
export const USER_JOURNEY_STAGES = {
  AWARENESS: 'awareness',
  INTEREST: 'interest', 
  CONSIDERATION: 'consideration',
  CONSULTATION: 'consultation',
  RETENTION: 'retention'
} as const;

// Business event types
export const BUSINESS_EVENTS = {
  // User Registration & Authentication
  SIGNUP_STARTED: 'signup_started',
  SIGNUP_COMPLETED: 'signup_completed',
  LOGIN: 'login',
  
  // Astrology Services Usage
  KUNDLI_GENERATED: 'kundli_generated',
  HOROSCOPE_VIEWED: 'horoscope_viewed',
  PANCHANG_CHECKED: 'panchang_checked',
  CALCULATOR_USED: 'calculator_used',
  
  // Consultation Journey
  ASTROLOGER_VIEWED: 'astrologer_profile_viewed',
  CONSULTATION_STARTED: 'consultation_booking_started',
  PAYMENT_INITIATED: 'payment_initiated',
  PAYMENT_COMPLETED: 'payment_completed',
  CONSULTATION_COMPLETED: 'consultation_completed',
  
  // Engagement Events
  PREMIUM_REPORT_DOWNLOADED: 'premium_report_downloaded',
  CHAT_MESSAGE_SENT: 'chat_message_sent',
  PROMO_CODE_USED: 'promo_code_applied',
  
  // Retention Events
  REPEAT_CONSULTATION: 'repeat_consultation',
  ASTROLOGER_RATED: 'astrologer_rated',
  FEEDBACK_SUBMITTED: 'feedback_submitted'
} as const;

/**
 * Enhanced Analytics Tracker
 */
class AdvancedAnalytics {
  private isGTM: boolean = false;
  private measurementId: string = '';
  
  constructor() {
    this.detectTrackingType();
  }
  
  private detectTrackingType() {
    // Check if GTM is available (for astrotick.com)
    if (typeof window !== 'undefined' && window.location.hostname.includes('astrotick.com')) {
      this.isGTM = true;
      this.measurementId = 'GTM-TK2M5JF2';
    } else {
      this.isGTM = false;
      // Will use GA - measurement ID determined by domain
    }
  }
  
  /**
   * Track custom business events - ENHANCED FOR COMPREHENSIVE GA/GTM TRACKING
   */
  trackEvent(eventName: string, parameters: Record<string, any> = {}) {
    if (typeof window === 'undefined') return;
    
    const eventData = {
      event: eventName,
      ...parameters,
      timestamp: new Date().toISOString(),
      user_journey_stage: this.determineJourneyStage(eventName),
      platform: 'astrotick',
      page_url: window.location.href,
      page_title: document.title,
      session_id: this.getSessionId(),
      user_id: this.getUserId()
    };
    
    // ALWAYS send to both GTM and GA for maximum coverage
    if (this.isGTM && window.dataLayer) {
      // GTM tracking with enhanced data layer push
      window.dataLayer.push({
        ...eventData,
        event_category: parameters.event_category || 'general',
        event_label: parameters.event_label || eventName,
        value: parameters.value || parameters.amount || 0
      });
      if (import.meta.env.DEV && new URLSearchParams(window.location.search).get('debug') === 'true') {
        console.log(`🏷️ GTM Event: ${eventName}`, eventData);
      }
    }
    
    // ALWAYS also send to GA regardless of GTM presence
    if (window.gtag) {
      window.gtag('event', eventName, {
        event_category: parameters.event_category || 'interaction',
        event_label: parameters.event_label || 'general',
        value: parameters.value || parameters.amount || 0,
        custom_parameters: parameters,
        user_journey_stage: eventData.user_journey_stage,
        platform: 'astrotick'
      });
      if (import.meta.env.DEV && new URLSearchParams(window.location.search).get('debug') === 'true') {
        console.log(`📊 GA Event: ${eventName}`, parameters);
      }
    }
    
    // Microsoft Clarity tracking
    if (typeof window.clarity === 'function') {
      window.clarity('event', eventName, parameters);
      if (import.meta.env.DEV && new URLSearchParams(window.location.search).get('debug') === 'true') {
        console.log(`🔍 Clarity Event: ${eventName}`, parameters);
      }
    }
    
    // Send enhanced ecommerce events for revenue tracking
    if (parameters.amount || parameters.value) {
      this.trackRevenueEvent(eventName, parameters);
    }
  }

  /**
   * Enhanced revenue tracking with ecommerce events
   */
  private trackRevenueEvent(eventName: string, parameters: Record<string, any>) {
    const revenueData = {
      transaction_id: parameters.transaction_id || `txn_${Date.now()}`,
      value: parameters.amount || parameters.value,
      currency: parameters.currency || 'INR',
      items: [{
        item_id: parameters.item_id || eventName,
        item_name: parameters.item_name || 'Astrology Service',
        item_category: parameters.category || 'consultation',
        quantity: 1,
        price: parameters.amount || parameters.value
      }]
    };

    if (window.gtag) {
      window.gtag('event', 'purchase', revenueData);
      console.log(`💰 Revenue Event: ${eventName}`, revenueData);
    }
  }

  /**
   * Get or create session ID
   */
  private getSessionId(): string {
    if (typeof window === 'undefined') return 'server';
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  }

  /**
   * Get user ID from local storage if available
   */
  private getUserId(): string | null {
    if (typeof window === 'undefined') return null;
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        return user.id || user.email || null;
      } catch {
        return null;
      }
    }
    return null;
  }
  
  /**
   * Track user journey progression
   */
  trackUserJourney(stage: string, details: Record<string, any> = {}) {
    this.trackEvent('user_journey_progression', {
      journey_stage: stage,
      ...details
    });
  }
  
  /**
   * Track consultation funnel
   */
  trackConsultationFunnel(step: string, astrologerId?: number, amount?: number) {
    this.trackEvent('consultation_funnel', {
      funnel_step: step,
      astrologer_id: astrologerId,
      consultation_amount: amount,
      currency: 'INR'
    });
  }
  
  /**
   * Track revenue events
   */
  trackRevenue(eventName: string, amount: number, currency: string = 'INR', details: Record<string, any> = {}) {
    this.trackEvent(eventName, {
      value: amount,
      currency,
      ...details
    });
  }
  
  /**
   * Track user engagement
   */
  trackEngagement(action: string, category: string = 'user_interaction', details: Record<string, any> = {}) {
    this.trackEvent('user_engagement', {
      engagement_action: action,
      engagement_category: category,
      ...details
    });
  }
  
  /**
   * Track astrology feature usage
   */
  trackAstrologyFeature(feature: string, inputData: Record<string, any> = {}) {
    this.trackEvent('astrology_feature_used', {
      feature_name: feature,
      input_data: inputData,
      feature_category: this.categorizeAstrologyFeature(feature)
    });
  }
  
  private determineJourneyStage(eventName: string): string {
    if (['signup_started', 'kundli_generated'].includes(eventName)) {
      return USER_JOURNEY_STAGES.AWARENESS;
    }
    if (['astrologer_profile_viewed', 'horoscope_viewed'].includes(eventName)) {
      return USER_JOURNEY_STAGES.INTEREST;
    }
    if (['consultation_booking_started', 'payment_initiated'].includes(eventName)) {
      return USER_JOURNEY_STAGES.CONSIDERATION;
    }
    if (['consultation_completed', 'payment_completed'].includes(eventName)) {
      return USER_JOURNEY_STAGES.CONSULTATION;
    }
    if (['repeat_consultation', 'astrologer_rated'].includes(eventName)) {
      return USER_JOURNEY_STAGES.RETENTION;
    }
    return 'unknown';
  }
  
  private categorizeAstrologyFeature(feature: string): string {
    const categories = {
      'kundli': ['kundli_generated', 'birth_chart'],
      'predictions': ['horoscope_viewed', 'daily_prediction'],
      'compatibility': ['love_compatibility', 'marriage_matching'],
      'timing': ['panchang_checked', 'muhurat'],
      'calculations': ['calculator_used', 'dasha_analysis']
    };
    
    for (const [category, features] of Object.entries(categories)) {
      if (features.some(f => feature.includes(f))) {
        return category;
      }
    }
    return 'general';
  }
}

// Create singleton instance
export const analytics = new AdvancedAnalytics();

// Convenience functions for common tracking scenarios
export const trackUserSignup = (method: string = 'email') => {
  analytics.trackEvent(BUSINESS_EVENTS.SIGNUP_COMPLETED, { signup_method: method });
  analytics.trackUserJourney(USER_JOURNEY_STAGES.AWARENESS, { action: 'account_created' });
};

export const trackKundliGeneration = (birthData: { location: string; date: string }) => {
  analytics.trackAstrologyFeature('kundli_generated', birthData);
  analytics.trackUserJourney(USER_JOURNEY_STAGES.INTEREST, { feature: 'birth_chart' });
};

export const trackConsultationBooking = (astrologerId: number, amount: number, consultationType: string) => {
  analytics.trackConsultationFunnel('booking_completed', astrologerId, amount);
  analytics.trackRevenue(BUSINESS_EVENTS.PAYMENT_COMPLETED, amount, 'INR', {
    astrologer_id: astrologerId,
    consultation_type: consultationType
  });
};

export const trackAstrologerView = (astrologerId: number, astrologerName: string) => {
  analytics.trackEvent(BUSINESS_EVENTS.ASTROLOGER_VIEWED, {
    astrologer_id: astrologerId,
    astrologer_name: astrologerName
  });
  analytics.trackUserJourney(USER_JOURNEY_STAGES.CONSIDERATION, { astrologer: astrologerName });
};

export const trackPremiumReport = (reportType: string, userId?: number) => {
  analytics.trackEvent(BUSINESS_EVENTS.PREMIUM_REPORT_DOWNLOADED, {
    report_type: reportType,
    user_id: userId
  });
  analytics.trackEngagement('premium_content_download', 'premium_features');
};

// Declare global types for TypeScript
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}