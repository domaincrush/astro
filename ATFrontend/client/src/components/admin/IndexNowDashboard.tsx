import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'src/components/ui/card';
import { Button } from 'src/components/ui/button';
import { Input } from 'src/components/ui/input';
import { Badge } from 'src/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'src/components/ui/tabs';
import { useToast } from 'src/hooks/use-toast';
import { 
  Send, 
  Globe, 
  BarChart3, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  Zap,
  Calendar,
  TrendingUp,
  Search,
  Link2
} from 'lucide-react';

interface IndexNowStats {
  total: number;
  successful: number;
  failed: number;
  pending: number;
  recentSubmissions: Array<{
    id: number;
    urls: string[];
    contentType: string;
    status: string;
    submittedAt: string;
    responseCode?: number;
  }>;
}

interface IndexNowResponse {
  success: boolean;
  message?: string;
  statusCode?: number;
  submissionId?: number;
}

export function IndexNowDashboard() {
  const [stats, setStats] = useState<IndexNowStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [customContentType, setCustomContentType] = useState('custom');
  const { toast } = useToast();

  // Fetch statistics
  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/indexnow/stats');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch IndexNow statistics",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast({
        title: "Error",
        description: "Failed to connect to IndexNow service",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Initialize IndexNow
  const initializeIndexNow = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/indexnow/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: 'astrotick.com' })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Success",
          description: "IndexNow initialized successfully",
        });
        fetchStats();
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to initialize IndexNow",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error initializing IndexNow:', error);
      toast({
        title: "Error",
        description: "Failed to initialize IndexNow",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Submit custom URL
  const submitCustomUrl = async () => {
    if (!customUrl) {
      toast({
        title: "Error",
        description: "Please enter a URL to submit",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/indexnow/submit-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          url: customUrl, 
          contentType: customContentType 
        })
      });
      
      const data: IndexNowResponse = await response.json();
      
      if (data.success) {
        toast({
          title: "Success",
          description: `URL submitted successfully (ID: ${data.submissionId})`,
        });
        setCustomUrl('');
        fetchStats();
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to submit URL",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error submitting URL:', error);
      toast({
        title: "Error",
        description: "Failed to submit URL",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Submit horoscope URLs
  const submitHoroscopes = async (period: 'daily' | 'weekly' | 'monthly') => {
    try {
      setLoading(true);
      const response = await fetch('/api/indexnow/submit-horoscopes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ period })
      });
      
      const data: IndexNowResponse = await response.json();
      
      if (data.success) {
        toast({
          title: "Success",
          description: `${period.charAt(0).toUpperCase() + period.slice(1)} horoscopes submitted successfully`,
        });
        fetchStats();
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to submit horoscopes",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error submitting horoscopes:', error);
      toast({
        title: "Error",
        description: "Failed to submit horoscopes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Submit panchang
  const submitPanchang = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/indexnow/submit-panchang', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      
      const data: IndexNowResponse = await response.json();
      
      if (data.success) {
        toast({
          title: "Success",
          description: "Panchang URLs submitted successfully",
        });
        fetchStats();
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to submit panchang",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error submitting panchang:', error);
      toast({
        title: "Error",
        description: "Failed to submit panchang",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Retry failed submissions
  const retryFailed = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/indexnow/retry-failed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ maxRetries: 3 })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Success",
          description: "Failed submissions retry process initiated",
        });
        fetchStats();
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to retry submissions",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error retrying submissions:', error);
      toast({
        title: "Error",
        description: "Failed to retry submissions",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Success</Badge>;
      case 'failed':
        return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Failed</Badge>;
      case 'pending':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">IndexNow Dashboard</h1>
          <p className="text-muted-foreground">
            Manage search engine notifications and content indexing for AstroTick.com
          </p>
        </div>
        <Button onClick={fetchStats} disabled={loading} variant="outline">
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">All time submissions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Successful</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.successful}</div>
              <p className="text-xs text-muted-foreground">
                {stats.total > 0 ? Math.round((stats.successful / stats.total) * 100) : 0}% success rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Failed</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
              <p className="text-xs text-muted-foreground">
                {stats.failed > 0 && (
                  <Button onClick={retryFailed} size="sm" variant="outline" className="mt-1">
                    Retry Failed
                  </Button>
                )}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">In progress</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="submit" className="space-y-4">
        <TabsList>
          <TabsTrigger value="submit">Submit URLs</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
          <TabsTrigger value="history">Submission History</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="submit">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Custom URL Submission */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Link2 className="w-5 h-5 mr-2" />
                  Submit Custom URL
                </CardTitle>
                <CardDescription>
                  Submit a specific URL for immediate indexing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="https://astrotick.com/your-page"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                />
                <select
                  className="w-full px-3 py-2 border rounded-md"
                  value={customContentType}
                  onChange={(e) => setCustomContentType(e.target.value)}
                >
                  <option value="custom">Custom</option>
                  <option value="article">Article</option>
                  <option value="horoscope">Horoscope</option>
                  <option value="panchang">Panchang</option>
                </select>
                <Button onClick={submitCustomUrl} disabled={loading} className="w-full">
                  <Send className="w-4 h-4 mr-2" />
                  Submit URL
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Submit content categories immediately
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={() => submitHoroscopes('daily')} 
                  disabled={loading} 
                  className="w-full" 
                  variant="outline"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Submit Daily Horoscopes
                </Button>
                <Button 
                  onClick={() => submitHoroscopes('weekly')} 
                  disabled={loading} 
                  className="w-full" 
                  variant="outline"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Submit Weekly Horoscopes
                </Button>
                <Button 
                  onClick={() => submitHoroscopes('monthly')} 
                  disabled={loading} 
                  className="w-full" 
                  variant="outline"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Submit Monthly Horoscopes
                </Button>
                <Button 
                  onClick={submitPanchang} 
                  disabled={loading} 
                  className="w-full" 
                  variant="outline"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  Submit Panchang URLs
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="automation">
          <Card>
            <CardHeader>
              <CardTitle>Automated Scheduling</CardTitle>
              <CardDescription>
                IndexNow automation runs on the following schedule
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold flex items-center mb-2">
                    <Calendar className="w-4 h-4 mr-2" />
                    Daily Horoscopes
                  </h3>
                  <p className="text-sm text-muted-foreground">Every day at 6:00 AM IST</p>
                  <p className="text-xs mt-1">Submits all 12 zodiac sign daily horoscopes</p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold flex items-center mb-2">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Weekly Horoscopes
                  </h3>
                  <p className="text-sm text-muted-foreground">Every Monday at 7:00 AM IST</p>
                  <p className="text-xs mt-1">Submits weekly predictions for all signs</p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold flex items-center mb-2">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Monthly Horoscopes
                  </h3>
                  <p className="text-sm text-muted-foreground">1st of every month at 8:00 AM IST</p>
                  <p className="text-xs mt-1">Submits monthly astrology predictions</p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold flex items-center mb-2">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Failed Retries
                  </h3>
                  <p className="text-sm text-muted-foreground">Every 2 hours</p>
                  <p className="text-xs mt-1">Automatically retries failed submissions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Recent Submissions</CardTitle>
              <CardDescription>
                Latest IndexNow submission history
              </CardDescription>
            </CardHeader>
            <CardContent>
              {stats?.recentSubmissions.length ? (
                <div className="space-y-3">
                  {stats.recentSubmissions.map((submission) => (
                    <div key={submission.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <StatusBadge status={submission.status} />
                          <span className="text-sm font-medium capitalize">{submission.contentType}</span>
                          {submission.responseCode && (
                            <Badge variant="outline" className="text-xs">
                              {submission.responseCode}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {submission.urls.length} URL{submission.urls.length > 1 ? 's' : ''} submitted
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(submission.submittedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No submissions found. Submit some URLs to see history here.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>IndexNow Configuration</CardTitle>
              <CardDescription>
                Manage IndexNow settings and initialization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950">
                <h3 className="font-semibold mb-2">API Key Information</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  IndexNow requires an API key file to be hosted on your domain for verification.
                </p>
                <Button onClick={initializeIndexNow} disabled={loading}>
                  <Globe className="w-4 h-4 mr-2" />
                  {loading ? 'Initializing...' : 'Initialize IndexNow'}
                </Button>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Supported Search Engines</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center">
                    <Search className="w-4 h-4 mr-2" />
                    Microsoft Bing
                  </div>
                  <div className="flex items-center">
                    <Search className="w-4 h-4 mr-2" />
                    Yandex
                  </div>
                  <div className="flex items-center">
                    <Search className="w-4 h-4 mr-2" />
                    Naver
                  </div>
                  <div className="flex items-center">
                    <Search className="w-4 h-4 mr-2" />
                    Seznam
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}