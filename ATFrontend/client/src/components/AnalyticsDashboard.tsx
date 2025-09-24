/**
 * Analytics Dashboard - Shows what user journey and button clicks are being tracked
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from 'src/components/ui/card';
import { Button } from 'src/components/ui/button';
import { Badge } from 'src/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'src/components/ui/tabs';
import { 
  BarChart3, 
  MousePointer, 
  Users, 
  Eye, 
  Clock, 
  TrendingUp,
  Activity,
  Target,
  Sparkles,
  Settings
} from 'lucide-react';
import { useClickTracking, useAstrologyAnalytics } from 'src/hooks/useAnalytics';

interface AnalyticsEvent {
  timestamp: string;
  event: string;
  category: string;
  details: Record<string, any>;
}

export default function AnalyticsDashboard() {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const { trackClick, trackCTA } = useClickTracking();
  const { trackKundli, trackCalculator } = useAstrologyAnalytics();

  // Mock real-time events for demonstration
  useEffect(() => {
    const interval = setInterval(() => {
      const mockEvents = [
        {
          timestamp: new Date().toISOString(),
          event: 'page_view',
          category: 'navigation',
          details: { page: '/homepage', referrer: 'direct' }
        },
        {
          timestamp: new Date().toISOString(), 
          event: 'button_clicked',
          category: 'interaction',
          details: { button: 'Generate Kundli', location: 'form' }
        }
      ];
      
      if (events.length < 10) {
        setEvents(prev => [...prev, ...mockEvents].slice(-10));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [events.length]);

  const testButtons = [
    {
      name: 'Test Kundli Generation',
      action: () => {
        trackKundli({ location: 'Test City', date: '1990-01-01' });
        trackClick('test_kundli_button', 'testing');
      },
      color: 'bg-blue-500'
    },
    {
      name: 'Test Calculator Usage',
      action: () => {
        trackCalculator('moon_sign', { inputData: 'test data' });
        trackClick('test_calculator_button', 'testing');
      },
      color: 'bg-green-500'
    },
    {
      name: 'Test CTA Click',
      action: () => {
        trackCTA('Test CTA', 'analytics_dashboard', 'testing');
        trackClick('test_cta_button', 'testing');
      },
      color: 'bg-purple-500'
    },
    {
      name: 'Test Premium Report',
      action: () => {
        trackClick('premium_report_test', 'testing', { source: 'analytics_dashboard' });
      },
      color: 'bg-orange-500'
    }
  ];

  const trackingCapabilities = [
    {
      category: 'User Journey Tracking',
      icon: <Users className="h-5 w-5" />,
      features: [
        'User registration and login events',
        'Page navigation and flow analysis',
        'Feature discovery and usage patterns',
        'Conversion funnel optimization',
        'User engagement milestones'
      ]
    },
    {
      category: 'Button & Interaction Tracking',
      icon: <MousePointer className="h-5 w-5" />,
      features: [
        'All button clicks with context',
        'Form submissions and completions',
        'CTA performance analysis',
        'Navigation patterns',
        'Element interaction heatmaps'
      ]
    },
    {
      category: 'Astrology Feature Analytics',
      icon: <Sparkles className="h-5 w-5" />,
      features: [
        'Kundli generation tracking',
        'Calculator usage statistics',
        'Horoscope reading patterns',
        'Premium report downloads',
        'Consultation booking flow'
      ]
    },
    {
      category: 'Business Intelligence',
      icon: <TrendingUp className="h-5 w-5" />,
      features: [
        'Revenue tracking and analysis',
        'Conversion rate optimization',
        'Astrologer performance metrics',
        'Payment success/failure rates',
        'User retention analytics'
      ]
    },
    {
      category: 'Real-time Monitoring',
      icon: <Activity className="h-5 w-5" />,
      features: [
        'Live user activity tracking',
        'Real-time consultation metrics',
        'Performance monitoring',
        'Error tracking and reporting',
        'System health indicators'
      ]
    }
  ];

  return (
    <div className={`fixed bottom-4 left-4 z-50 transition-all duration-300 ${isVisible ? 'w-96' : 'w-auto'}`}>
      {!isVisible ? (
        <Button
          onClick={() => setIsVisible(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
        >
          <BarChart3 className="h-4 w-4 mr-2" />
          Analytics Dashboard
        </Button>
      ) : (
        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border border-gray-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold text-gray-800 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                Analytics Dashboard
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsVisible(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </Button>
            </div>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="capabilities" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="capabilities">Capabilities</TabsTrigger>
                <TabsTrigger value="testing">Test Tracking</TabsTrigger>
                <TabsTrigger value="events">Live Events</TabsTrigger>
              </TabsList>
              
              <TabsContent value="capabilities" className="space-y-3 max-h-96 overflow-y-auto">
                {trackingCapabilities.map((capability, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center mb-2">
                      <div className="text-blue-600 mr-2">{capability.icon}</div>
                      <h4 className="font-semibold text-sm text-gray-800">{capability.category}</h4>
                    </div>
                    <ul className="space-y-1">
                      {capability.features.map((feature, idx) => (
                        <li key={idx} className="text-xs text-gray-600 flex items-center">
                          <div className="w-1 h-1 bg-blue-400 rounded-full mr-2"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </TabsContent>
              
              <TabsContent value="testing" className="space-y-3">
                <div className="text-sm text-gray-600 mb-3">
                  Test button click tracking and see events in browser console:
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {testButtons.map((button, index) => (
                    <Button
                      key={index}
                      onClick={() => {
                        button.action();
                        console.log(`🎯 Analytics Event: ${button.name} clicked`);
                      }}
                      className={`${button.color} hover:opacity-80 text-white text-xs p-2 h-auto`}
                      size="sm"
                    >
                      {button.name}
                    </Button>
                  ))}
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Check browser console for tracking events. In production, these go to GTM/GA.
                </div>
              </TabsContent>
              
              <TabsContent value="events" className="space-y-2 max-h-80 overflow-y-auto">
                {events.length === 0 ? (
                  <div className="text-center text-gray-500 text-sm py-4">
                    <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    No events yet. Navigate or click buttons to see tracking.
                  </div>
                ) : (
                  events.map((event, index) => (
                    <div key={index} className="bg-gray-50 rounded p-2">
                      <div className="flex items-center justify-between mb-1">
                        <Badge variant="outline" className="text-xs">
                          {event.event}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600">
                        Category: {event.category}
                      </div>
                      {Object.keys(event.details).length > 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                          {JSON.stringify(event.details, null, 0)}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}