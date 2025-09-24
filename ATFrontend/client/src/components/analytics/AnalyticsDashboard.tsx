import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "src/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "src/components/ui/select";
import { Badge } from "src/components/ui/badge";
import { Progress } from "src/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Eye, Clock, Star, BookOpen, Globe, Target } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface AnalyticsData {
  overview: {
    totalUsers: number;
    activeUsers: number;
    totalViews: number;
    avgSessionTime: number;
    bounceRate: number;
    conversionRate: number;
  };
  content: {
    topArticles: Array<{
      title: string;
      views: number;
      readTime: number;
      engagement: number;
      language: string;
    }>;
    categoryPerformance: Array<{
      category: string;
      articles: number;
      views: number;
      engagement: number;
    }>;
    languageDistribution: Array<{
      language: string;
      articles: number;
      views: number;
    }>;
  };
  user: {
    demographics: Array<{
      sign: string;
      users: number;
      engagement: number;
    }>;
    behavior: Array<{
      action: string;
      count: number;
      trend: number;
    }>;
    retention: Array<{
      day: number;
      retained: number;
    }>;
  };
  seo: {
    topKeywords: Array<{
      keyword: string;
      rank: number;
      traffic: number;
      trend: number;
    }>;
    pageSpeed: number;
    mobileScore: number;
    searchVisibility: number;
  };
}

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("7d");

  const { data: analytics, isLoading } = useQuery<AnalyticsData>({
    queryKey: ["/api/analytics", timeRange],
    retry: false,
  });

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatPercentage = (num: number): string => {
    return num.toFixed(1) + '%';
  };

  const getTrendIcon = (trend: number) => {
    return trend > 0 ? "↗️" : trend < 0 ? "↘️" : "→";
  };

  const COLORS = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#6366F1'];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">Analytics data not available</h3>
        <p className="text-gray-600">Please ensure analytics tracking is properly configured.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold">{formatNumber(analytics.overview.totalUsers)}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div className="mt-2 text-sm text-green-600">
              {getTrendIcon(12)} +12% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Page Views</p>
                <p className="text-2xl font-bold">{formatNumber(analytics.overview.totalViews)}</p>
              </div>
              <Eye className="h-8 w-8 text-purple-600" />
            </div>
            <div className="mt-2 text-sm text-green-600">
              {getTrendIcon(8)} +8% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Session Time</p>
                <p className="text-2xl font-bold">{Math.floor(analytics.overview.avgSessionTime / 60)}m {analytics.overview.avgSessionTime % 60}s</p>
              </div>
              <Clock className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-2 text-sm text-green-600">
              {getTrendIcon(15)} +15% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold">{formatPercentage(analytics.overview.conversionRate)}</p>
              </div>
              <Target className="h-8 w-8 text-orange-600" />
            </div>
            <div className="mt-2 text-sm text-red-600">
              {getTrendIcon(-2)} -2% from last period
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="content" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="astrology">Astrology</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Articles */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Top Performing Articles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.content.topArticles.map((article, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{article.title}</h4>
                        <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {formatNumber(article.views)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {article.readTime}m
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {article.language.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold">{formatPercentage(article.engagement)}</div>
                        <div className="text-xs text-gray-500">engagement</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Category Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Category Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.content.categoryPerformance.map((category, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{category.category}</span>
                        <span className="text-sm text-gray-500">{formatNumber(category.views)} views</span>
                      </div>
                      <Progress value={category.engagement} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Language Distribution */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Content by Language
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.content.languageDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="views"
                      label={({ language, views }) => `${language.toUpperCase()}: ${formatNumber(views)}`}
                    >
                      {analytics.content.languageDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Behavior */}
            <Card>
              <CardHeader>
                <CardTitle>User Behavior Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.user.behavior}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="action" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* User Retention */}
            <Card>
              <CardHeader>
                <CardTitle>User Retention</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics.user.retention}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="retained" stroke="#06B6D4" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="seo" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* SEO Scores */}
            <Card>
              <CardHeader>
                <CardTitle>SEO Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Page Speed</span>
                    <span>{analytics.seo.pageSpeed}/100</span>
                  </div>
                  <Progress value={analytics.seo.pageSpeed} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Mobile Score</span>
                    <span>{analytics.seo.mobileScore}/100</span>
                  </div>
                  <Progress value={analytics.seo.mobileScore} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Search Visibility</span>
                    <span>{formatPercentage(analytics.seo.searchVisibility)}</span>
                  </div>
                  <Progress value={analytics.seo.searchVisibility} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Top Keywords */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Top Keywords</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.seo.topKeywords.map((keyword, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <span className="font-medium">{keyword.keyword}</span>
                        <div className="text-xs text-gray-500 mt-1">
                          Rank #{keyword.rank} • {formatNumber(keyword.traffic)} clicks
                        </div>
                      </div>
                      <Badge variant={keyword.trend > 0 ? "default" : "secondary"}>
                        {getTrendIcon(keyword.trend)} {Math.abs(keyword.trend)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="astrology" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Zodiac Demographics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  User Demographics by Zodiac Sign
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.user.demographics.map((demo, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{demo.sign}</span>
                        <span className="text-sm text-gray-500">({formatNumber(demo.users)} users)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={demo.engagement} className="w-20 h-2" />
                        <span className="text-xs text-gray-500">{formatPercentage(demo.engagement)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Astrology Features Usage */}
            <Card>
              <CardHeader>
                <CardTitle>Feature Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span>Daily Horoscopes</span>
                    <div className="flex items-center gap-2">
                      <Progress value={85} className="w-20 h-2" />
                      <span className="text-sm font-medium">85%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span>Birth Chart Generator</span>
                    <div className="flex items-center gap-2">
                      <Progress value={67} className="w-20 h-2" />
                      <span className="text-sm font-medium">67%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span>Compatibility Calculator</span>
                    <div className="flex items-center gap-2">
                      <Progress value={73} className="w-20 h-2" />
                      <span className="text-sm font-medium">73%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span>Consultations</span>
                    <div className="flex items-center gap-2">
                      <Progress value={45} className="w-20 h-2" />
                      <span className="text-sm font-medium">45%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}