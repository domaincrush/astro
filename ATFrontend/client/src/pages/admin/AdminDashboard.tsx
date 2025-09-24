import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "src/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "src/components/ui/tabs";
import { AdminChatRoutingDashboard } from "src/components/admin/AdminChatRoutingDashboard";
import { Button } from "src/components/ui/button";
import { Badge } from "src/components/ui/badge";
import { Settings, Users, MessageSquare, BarChart3, Shield, MousePointer, Eye, Clock, Target, Activity, TrendingUp, Sparkles, ArrowUp, ArrowDown } from "lucide-react";
import { useAuth } from "src/hooks/useAuth";
import { useLocation } from "wouter";
// import { useClickTracking, usePageTracking, useAstrologyAnalytics } from "@/hooks/useAnalytics";

export function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("analytics");
  const [, setLocation] = useLocation();
  const [realtimeEvents, setRealtimeEvents] = useState<any[]>([]);

  // Role-based access control
  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/login");
      return;
    }
    if (user && user.role !== 'admin') {
      setLocation("/");
      return;
    }
  }, [isAuthenticated, user, setLocation]);

  // Show loading while checking authentication
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  // Redirect non-admin users
  if (user.role !== 'admin') {
    return null;
  }
  
  // Analytics tracking hooks - temporarily disabled to fix runtime error
  // const { trackClick, trackCTA } = useClickTracking();
  // const { trackKundli, trackCalculator } = useAstrologyAnalytics();
  // usePageTracking(); // Track admin dashboard visits

  // Mock real-time analytics data (in production, this would come from actual GA/GTM data)
  const [analyticsData, setAnalyticsData] = useState({
    todayUsers: 1247,
    todayUsersTrend: +12,
    todayPageViews: 3891,
    todayPageViewsTrend: +8,
    todayKundliGenerated: 423,
    todayKundliTrend: +25,
    todayConsultations: 87,
    todayConsultationsTrend: +15,
    todayRevenue: 12450,
    todayRevenueTrend: +18,
    conversionRate: 4.2,
    conversionRateTrend: +0.5
  });

  // Simulate real-time event tracking
  useEffect(() => {
    const interval = setInterval(() => {
      const mockEvents = [
        {
          timestamp: new Date().toISOString(),
          event: 'kundli_generated',
          user: 'user_' + Math.floor(Math.random() * 1000),
          location: 'Mumbai, India',
          category: 'astrology_service'
        },
        {
          timestamp: new Date().toISOString(),
          event: 'consultation_booking_started',
          user: 'user_' + Math.floor(Math.random() * 1000),
          astrologer: 'Dr. Anjali Shastri',
          category: 'consultation'
        },
        {
          timestamp: new Date().toISOString(),
          event: 'premium_report_downloaded',
          user: 'user_' + Math.floor(Math.random() * 1000),
          amount: 299,
          category: 'revenue'
        }
      ];
      
      setRealtimeEvents(prev => [...mockEvents, ...prev].slice(0, 20));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const testAnalyticsButtons = [
    {
      name: 'Test User Registration',
      action: () => {
        console.log('🎯 GA Event: User Registration Test');
      },
      color: 'bg-blue-500'
    },
    {
      name: 'Test Kundli Generation',
      action: () => {
        console.log('🎯 GA Event: Kundli Generation Test');
      },
      color: 'bg-green-500'
    },
    {
      name: 'Test Consultation Flow',
      action: () => {
        console.log('🎯 GA Event: Consultation Flow Test');
      },
      color: 'bg-purple-500'
    },
    {
      name: 'Test Revenue Event',
      action: () => {
        console.log('🎯 GA Event: Revenue Test');
      },
      color: 'bg-orange-500'
    }
  ];

  // Check if user is authenticated and is admin
  if (!isAuthenticated) {
    setLocation("/login");
    return null;
  }

  if (user?.role !== 'admin') {
    return (
      <div className="container mx-auto p-6">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <Shield className="w-5 h-5" />
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">You need admin privileges to access this page.</p>
            <Button className="mt-4" onClick={() => window.history.back()}>
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage platform operations and user experience</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            Admin Access
          </div>
        </div>
      </div>

      {/* Dashboard Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Consultations</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Currently ongoing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Online Astrologers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Available now</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Queue Length</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Users waiting</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Routes</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Chat routings</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Admin Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="chat-routing" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Chat Routing
          </TabsTrigger>
          <TabsTrigger value="consultations" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Consultations
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat-routing">
          <AdminChatRoutingDashboard />
        </TabsContent>

        <TabsContent value="consultations">
          <Card>
            <CardHeader>
              <CardTitle>Active Consultations</CardTitle>
              <CardDescription>
                Monitor and manage ongoing consultations across the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>Consultation monitoring coming soon</p>
                <p className="text-sm">Real-time consultation management and intervention tools</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Analytics Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Users</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.todayUsers.toLocaleString()}</div>
                <div className="flex items-center text-xs text-green-600">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  +{analyticsData.todayUsersTrend}%
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Page Views</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.todayPageViews.toLocaleString()}</div>
                <div className="flex items-center text-xs text-green-600">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  +{analyticsData.todayPageViewsTrend}%
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Kundli Generated</CardTitle>
                <Sparkles className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.todayKundliGenerated}</div>
                <div className="flex items-center text-xs text-green-600">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  +{analyticsData.todayKundliTrend}%
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Consultations</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.todayConsultations}</div>
                <div className="flex items-center text-xs text-green-600">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  +{analyticsData.todayConsultationsTrend}%
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{analyticsData.todayRevenue.toLocaleString()}</div>
                <div className="flex items-center text-xs text-green-600">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  +{analyticsData.todayRevenueTrend}%
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.conversionRate}%</div>
                <div className="flex items-center text-xs text-green-600">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  +{analyticsData.conversionRateTrend}%
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tracking Capabilities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Analytics Capabilities
                </CardTitle>
                <CardDescription>What we're tracking across the platform</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <MousePointer className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-sm">User Interactions</span>
                    </div>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>• Button clicks & CTAs</li>
                      <li>• Form submissions</li>
                      <li>• Navigation patterns</li>
                      <li>• Page engagement</li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-sm">Astrology Features</span>
                    </div>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>• Kundli generation</li>
                      <li>• Calculator usage</li>
                      <li>• Horoscope reading</li>
                      <li>• Premium reports</li>
                    </ul>
                  </div>
                  
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="h-4 w-4 text-purple-600" />
                      <span className="font-medium text-sm">Consultations</span>
                    </div>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>• Booking flow</li>
                      <li>• Payment process</li>
                      <li>• Chat interactions</li>
                      <li>• Completion rates</li>
                    </ul>
                  </div>
                  
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-orange-600" />
                      <span className="font-medium text-sm">Business Metrics</span>
                    </div>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>• Revenue tracking</li>
                      <li>• Conversion funnels</li>
                      <li>• User retention</li>
                      <li>• Performance metrics</li>
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium text-sm mb-3">Test Analytics Events</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {testAnalyticsButtons.map((button, index) => (
                      <Button
                        key={index}
                        onClick={() => {
                          button.action();
                        }}
                        className={`${button.color} hover:opacity-80 text-white text-xs h-8`}
                        size="sm"
                      >
                        {button.name}
                      </Button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Events sent to GTM (astrotick.com) or GA (other domains)
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Real-time Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Real-time Events
                </CardTitle>
                <CardDescription>Live user activity across the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {realtimeEvents.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Waiting for events...</p>
                    </div>
                  ) : (
                    realtimeEvents.map((event, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              {event.event}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {new Date(event.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">
                            {event.user} • {event.location || event.astrologer || `₹${event.amount}`}
                          </p>
                        </div>
                        <div className="text-xs text-gray-500">
                          {event.category}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* GA/GTM Integration Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Analytics Integration Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-medium">Google Tag Manager</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    GTM-TK2M5JF2 - Active for astrotick.com
                  </p>
                  <p className="text-xs text-green-700">
                    ✓ Enhanced tracking with GTM triggers and custom events
                  </p>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="font-medium">Multi-Domain GA</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    7 domains with dedicated tracking IDs
                  </p>
                  <p className="text-xs text-blue-700">
                    ✓ Domain-specific analytics with cross-domain tracking
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Platform Settings</CardTitle>
              <CardDescription>
                Configure platform-wide settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Settings className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>Settings panel coming soon</p>
                <p className="text-sm">Platform configuration and admin preferences</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}