import { useState } from 'react';
import { Button } from 'src/components/ui/button';
import { trackEvent, sendEssentialEvents } from 'src/lib/analytics';

export default function GATestButton() {
  const [eventCount, setEventCount] = useState(0);
  const [isTracking, setIsTracking] = useState(false);

  const handleTestGA = () => {
    setIsTracking(true);
    
    // Send essential analytics events
    sendEssentialEvents();
    
    // Core tracking events
    trackEvent('manual_test', 'user_action', 'ga_test_button', eventCount + 1);
    trackEvent('platform_engagement', 'testing', 'dashboard_verification');
    
    // Custom GA events
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'purchase', {
        transaction_id: `test_${Date.now()}`,
        value: 0,
        currency: 'INR',
        items: [{
          item_id: 'test_service',
          item_name: 'GA Test Event',
          category: 'testing',
          quantity: 1,
          price: 0
        }]
      });
      
      window.gtag('event', 'search', {
        search_term: 'google analytics test'
      });
      
      window.gtag('event', 'view_item', {
        currency: 'INR',
        value: 0,
        items: [{
          item_id: 'ga_test',
          item_name: 'Analytics Test',
          category: 'testing'
        }]
      });
    }
    
    setEventCount(prev => prev + 1);
    
    setTimeout(() => {
      setIsTracking(false);
    }, 1000);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white border border-gray-200 rounded-lg p-4 shadow-lg">
      <div className="text-sm text-gray-600 mb-2">GA Debug Panel</div>
      <Button 
        onClick={handleTestGA} 
        disabled={isTracking}
        className="w-full mb-2"
        variant={eventCount > 0 ? "default" : "outline"}
      >
        {isTracking ? 'Sending Events...' : `Test GA Events${eventCount > 0 ? ` (${eventCount})` : ''}`}
      </Button>
      
      {eventCount > 0 && (
        <div className="text-xs text-green-600">
          ✅ {eventCount} test sessions sent
          <br />
          Check GA Real-time reports
        </div>
      )}
      
      <div className="text-xs text-gray-500 mt-2">
        ID: G-GY45PGDQT9
        <br />
        Domain: astrotick.com
      </div>
    </div>
  );
}