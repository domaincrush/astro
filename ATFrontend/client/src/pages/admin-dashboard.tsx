import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { Badge } from "src/components/ui/badge";
import { Button } from "src/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "src/components/ui/tabs";
import { useLocation, Link } from "wouter";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "src/components/ui/dialog";
import { ScrollArea } from "src/components/ui/scroll-area";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "src/components/ui/form";
import { Input } from "src/components/ui/input";
import { Textarea } from "src/components/ui/textarea";
import {
  Calendar,
  Users,
  FileText,
  Activity,
  RefreshCw,
  TrendingUp,
  BarChart3,
  Eye,
  Code,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageSquare,
  Settings,
  UserCheck,
  Shield,
  Clock,
  Star,
  Ban,
  UserPlus,
  ArrowRightLeft,
  Zap,
  Phone,
  Upload,
  Image,
  Edit,
  Trash2,
  Plus,
  Tag,
  Globe,
  User,
  Mail,
  Download,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "src/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "src/components/ui/select";
import { ArticleWithAuthor, Category } from "@shared/schema";
import { FAQTable } from "src/components/admin-faq-table";
import EmailDeliveryStatus from "src/components/admin/EmailDeliveryStatus";

interface TodaysReports {
  date: string;
  summary: {
    total_birth_charts: number;
    total_compatibility_reports: number;
    total_consultations: number;
    total_reports: number;
  };
  birth_charts: Array<{
    id: number;
    name: string;
    birth_date: string;
    birth_time: string;
    birth_location: string;
    created_at: string;
    user_id: number | null;
    is_anonymous: boolean;
    session_id: string | null;
  }>;
  compatibility_reports: Array<{
    id: number;
    compatibility_score: number;
    created_at: string;
    user_id: number | null;
    is_anonymous: boolean;
    session_id: string | null;
  }>;
  consultations: Array<{
    id: number;
    topic: string;
    duration: number;
    status: string;
    cost: number;
    created_at: string;
    user_id: number;
    astrologer_id: number;
  }>;
}

interface RangeReports {
  date_range: {
    start: string;
    end: string;
    days: number;
  };
  summary: {
    total_birth_charts: number;
    total_compatibility_reports: number;
    total_consultations: number;
    total_reports: number;
  };
  daily_stats: Array<{
    date: string;
    birth_charts: number;
    compatibility_reports: number;
    consultations: number;
    total: number;
  }>;
  birth_charts: Array<{
    id: number;
    name: string;
    birth_date: string;
    birth_time: string;
    birth_location: string;
    created_at: string;
    user_id: number | null;
    is_anonymous: boolean;
    session_id: string | null;
  }>;
  compatibility_reports: Array<{
    id: number;
    compatibility_score: number;
    created_at: string;
    user_id: number | null;
    is_anonymous: boolean;
    session_id: string | null;
  }>;
  consultations: Array<{
    id: number;
    topic: string;
    duration: number;
    status: string;
    cost: number;
    created_at: string;
    user_id: number;
    astrologer_id: number;
  }>;
}

// Form schema for astrologer editing
const astrologerEditSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  experience: z.number().min(0, "Experience must be positive"),
  specializations: z.string().min(1, "Specializations are required"),
  languages: z.string().min(1, "Languages are required"),
  description: z.string().min(1, "Description is required"),
  ratePerMinute: z.number().min(1, "Rate per minute must be positive"),
  image: z.string().optional(),
});

type AstrologerEditFormData = z.infer<typeof astrologerEditSchema>;

export default function AdminDashboard() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState("today");
  const [, setLocation] = useLocation();
  const [editingAstrologer, setEditingAstrologer] = useState<any | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: todaysReports,
    isLoading: todayLoading,
    error: todayError,
    refetch: refetchToday,
  } = useQuery<{ success: boolean; data: TodaysReports }>({
    queryKey: ["/api/admin/reports/today", refreshKey],
    staleTime: 2 * 60 * 1000, // 2 minutes cache
    refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes instead of 30 seconds
    refetchOnWindowFocus: false,
    retry: 2,
  });

  const {
    data: rangeReports,
    isLoading: rangeLoading,
    error: rangeError,
    refetch: refetchRange,
  } = useQuery<{ success: boolean; data: RangeReports }>({
    queryKey: ["/api/admin/reports/range?days=10", refreshKey],
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    refetchInterval: 10 * 60 * 1000, // Refresh every 10 minutes instead of 1 minute
    refetchOnWindowFocus: false,
    retry: 2,
  });

  const {
    data: usersData,
    isLoading: usersLoading,
    error: usersError,
    refetch: refetchUsers,
  } = useQuery<{ success: boolean; data: any[] }>({
    queryKey: ["/api/admin/users", refreshKey],
    staleTime: 3 * 60 * 1000, // 3 minutes cache
    refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  });

  const {
    data: astrologersData,
    isLoading: astrologersLoading,
    error: astrologersError,
    refetch: refetchAstrologers,
  } = useQuery<any[]>({
    queryKey: ["/api/admin/astrologers", refreshKey],
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    refetchInterval: 10 * 60 * 1000, // Refresh every 10 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  });

  const {
    data: chatsData,
    isLoading: chatsLoading,
    error: chatsError,
    refetch: refetchChats,
  } = useQuery<{ success: boolean; data: any[] }>({
    queryKey: ["/api/admin/chats", refreshKey],
    staleTime: 1 * 60 * 1000, // 1 minute cache
    refetchInterval: 2 * 60 * 1000, // Refresh every 2 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  });

  // Query for FAQ questions and responses with optimized caching
  const {
    data: faqQuestionsData,
    isLoading: faqLoading,
    error: faqError,
    refetch: refetchFAQ,
  } = useQuery<{ success: boolean; questions: any[] }>({
    queryKey: ["/api/admin/faq-questions", refreshKey],
    staleTime: 1 * 60 * 1000, // 1 minute cache for fresh data
    gcTime: 5 * 60 * 1000, // 5 minutes in memory
    refetchInterval: false, // Disable auto-refresh to prevent conflicts
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: 2,
    networkMode: 'online',
  });

  const {
    data: responsesData,
    isLoading: responsesLoading,
    error: responsesError,
    refetch: refetchResponses,
  } = useQuery<{ success: boolean; responses: any[] }>({
    queryKey: ["/api/admin/responses/all", refreshKey],
    staleTime: 1 * 60 * 1000, // 1 minute cache for fresh data
    gcTime: 5 * 60 * 1000, // 5 minutes in memory
    refetchInterval: false, // Disable auto-refresh to prevent conflicts
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: 2,
    networkMode: 'online',
  });

  // Form for editing astrologers
  const editForm = useForm<AstrologerEditFormData>({
    resolver: zodResolver(astrologerEditSchema),
    defaultValues: {
      name: "",
      email: "",
      experience: 0,
      specializations: "",
      languages: "",
      description: "",
      ratePerMinute: 0,
      image: "",
    },
  });

  // Mutation for updating astrologer
  const updateAstrologerMutation = useMutation({
    mutationFn: async (data: {
      id: number;
      updates: AstrologerEditFormData;
    }) => {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/admin/astrologers/${data.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...data.updates,
          specializations: data.updates.specializations
            .split(",")
            .map((s) => s.trim()),
          languages: data.updates.languages.split(",").map((l) => l.trim()),
        }),
      });
      if (!response.ok) throw new Error("Failed to update astrologer");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/astrologers"] });
      toast({
        title: "Astrologer Updated",
        description: "Astrologer profile has been successfully updated.",
      });
      setEditingAstrologer(null);
      editForm.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update astrologer profile.",
        variant: "destructive",
      });
    },
  });

  const handleRefresh = async () => {
    // Show loading state
    const toastId = toast({
      title: "Refreshing...",
      description: "Updating dashboard data",
    });
    
    try {
      // Update refresh key first
      setRefreshKey((prev) => prev + 1);
      
      // Perform all refetches in parallel for better performance
      await Promise.allSettled([
        refetchToday(),
        refetchRange(),
        refetchUsers(),
        refetchAstrologers(),
        refetchChats(),
        refetchFAQ(),
        refetchResponses()
      ]);
      
      // Update toast to show success
      toast({
        title: "Refreshed!",
        description: "Dashboard data has been updated successfully",
      });
      
    } catch (error) {
      console.error('Refresh failed:', error);
      toast({
        title: "Refresh Failed",
        description: "Some data may not be up to date. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle editing astrologer
  const handleEditAstrologer = (astrologer: any) => {
    setEditingAstrologer(astrologer);
    editForm.reset({
      name: astrologer.name || "",
      email: astrologer.email || "",
      experience: astrologer.experience || 0,
      specializations: Array.isArray(astrologer.specializations)
        ? astrologer.specializations.join(", ")
        : astrologer.specializations || "",
      languages: Array.isArray(astrologer.languages)
        ? astrologer.languages.join(", ")
        : astrologer.languages || "",
      description: astrologer.description || "",
      ratePerMinute: astrologer.ratePerMinute || astrologer.pricePerMinute || 0,
      image: astrologer.image || "",
    });
  };

  // Handle form submission
  const onSubmitEdit = (data: AstrologerEditFormData) => {
    if (editingAstrologer) {
      updateAstrologerMutation.mutate({
        id: editingAstrologer.id,
        updates: data,
      });
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isLoading = todayLoading || rangeLoading || faqLoading || responsesLoading;
  const hasError = todayError || rangeError || faqError || responsesError;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-96 bg-gray-200 rounded-lg"></div>
              <div className="h-96 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-6">
        <div className="max-w-7xl mx-auto">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-red-600 mb-4">
                  <Activity className="h-12 w-12 mx-auto mb-2" />
                  <h3 className="text-lg font-semibold">
                    Error Loading Reports
                  </h3>
                  <p className="text-sm text-red-500">
                    Unable to fetch reports data
                  </p>
                </div>
                <Button
                  onClick={handleRefresh}
                  variant="outline"
                  className="mt-4"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const todayReports = todaysReports?.data;
  const rangeData = rangeReports?.data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-2">Reports Overview & Analytics</p>
          </div>
          <div>
            <Button onClick={handleRefresh} variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button
              onClick={() => setLocation("/admin-responses-enhanced")}
              variant="outline"
              className="gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              Astro Response
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="today" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Today's Reports
            </TabsTrigger>
            <TabsTrigger value="range" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Last 10 Days
            </TabsTrigger>
            <TabsTrigger value="articles" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Articles
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              User Management
            </TabsTrigger>
            <TabsTrigger
              value="astrologers"
              className="flex items-center gap-2"
            >
              <UserCheck className="h-4 w-4" />
              Astrologers
            </TabsTrigger>
            <TabsTrigger value="chats" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Chat Monitoring
            </TabsTrigger>
            <TabsTrigger value="faq" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              FAQ Management
            </TabsTrigger>
            <TabsTrigger value="emails" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Status
            </TabsTrigger>
          </TabsList>

          {/* Today's Reports Tab */}
          <TabsContent value="today" className="space-y-6">
            <TodayReportsView reports={todayReports} />
          </TabsContent>

          {/* Range Reports Tab */}
          <TabsContent value="range" className="space-y-6">
            <RangeReportsView rangeData={rangeData} />
          </TabsContent>

          {/* Articles Management Tab */}
          <TabsContent value="articles" className="space-y-6">
            <ArticleManagementView />
          </TabsContent>

          {/* User Management Tab */}
          <TabsContent value="users" className="space-y-6">
            <UserManagementView
              users={usersData?.data}
              isLoading={usersLoading}
              error={usersError}
            />
          </TabsContent>

          {/* Astrologer Management Tab */}
          <TabsContent value="astrologers" className="space-y-6">
            <AstrologerManagementView
              astrologers={astrologersData}
              isLoading={astrologersLoading}
              error={astrologersError}
            />
          </TabsContent>

          {/* Chat Monitoring Tab */}
          <TabsContent value="chats" className="space-y-6">
            <ChatMonitoringView
              chats={chatsData?.data}
              isLoading={chatsLoading}
              error={chatsError}
            />
          </TabsContent>

          {/* FAQ Management Tab */}
          <TabsContent value="faq" className="space-y-6">
            <FAQTable
              faqQuestions={faqQuestionsData?.questions || []}
              responses={responsesData?.responses || []}
              isLoading={faqLoading || responsesLoading}
              error={faqError || responsesError}
            />
          </TabsContent>

          {/* Email Delivery Status Tab */}
          <TabsContent value="emails" className="space-y-6">
            <EmailDeliveryStatus />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Component for detailed report view
function ReportDetailsDialog({
  reportId,
  reportType,
}: {
  reportId: number;
  reportType: "birth-chart" | "compatibility-report";
}) {
  const { data: reportDetails, isLoading } = useQuery({
    queryKey: [`/api/admin/${reportType}/${reportId}`],
    enabled: reportId > 0,
  });

  if (isLoading) {
    return <div className="p-4 text-center">Loading report details...</div>;
  }

  if (
    !reportDetails ||
    typeof reportDetails !== "object" ||
    !("success" in reportDetails) ||
    !reportDetails.success
  ) {
    return (
      <div className="p-4 text-center text-red-500">
        Failed to load report details
      </div>
    );
  }

  const report = "data" in reportDetails ? reportDetails.data as any : null;

  if (!report) {
    return (
      <div className="p-4 text-center text-red-500">
        No report data available
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Report Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Report Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Report ID</p>
              <p className="font-semibold">{report.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">User ID</p>
              <p className="font-semibold">{report.userId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Created At</p>
              <p className="font-semibold">
                {new Date(report.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Calculation Method</p>
              <div className="flex items-center gap-2">
                {report.jyotishaEngineUsed ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
                <Badge
                  variant={
                    report.jyotishaEngineUsed ? "default" : "destructive"
                  }
                >
                  {report.jyotishaEngineUsed
                    ? "Jyotisha Engine"
                    : "Fallback/Failed"}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Birth Chart Specific Details */}
      {reportType === "birth-chart" && (
        <Card>
          <CardHeader>
            <CardTitle>Birth Chart Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-semibold">{report.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Birth Date</p>
                <p className="font-semibold">
                  {new Date(report.birthDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Birth Time</p>
                <p className="font-semibold">{report.birthTime}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Birth Location</p>
                <p className="font-semibold">{report.birthLocation}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Coordinates</p>
                <p className="font-semibold">
                  {report.latitude}, {report.longitude}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Compatibility Report Specific Details */}
      {reportType === "compatibility-report" && (
        <Card>
          <CardHeader>
            <CardTitle>Compatibility Report Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Compatibility Score</p>
                <p className="font-semibold text-2xl">
                  {report.compatibilityScore}/36
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Percentage</p>
                <p className="font-semibold text-2xl">
                  {Math.round((report.compatibilityScore / 36) * 100)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Chart 1 ID</p>
                <p className="font-semibold">{report.chart1Id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Chart 2 ID</p>
                <p className="font-semibold">{report.chart2Id}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* API Response */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            API Response
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <pre className="text-xs bg-gray-100 p-4 rounded-lg overflow-x-auto">
              {JSON.stringify(report.apiResponse, null, 2)}
            </pre>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Full Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Full Calculation Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <pre className="text-xs bg-gray-100 p-4 rounded-lg overflow-x-auto">
              {JSON.stringify(report.fullLogs, null, 2)}
            </pre>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

// Component for Today's Reports View
function TodayReportsView({ reports }: { reports: TodaysReports | undefined }) {
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          {reports ? formatDate(reports.date) : "Loading..."}
        </h2>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">
                  Birth Charts
                </p>
                <p className="text-3xl font-bold">
                  {reports?.summary.total_birth_charts || 0}
                </p>
              </div>
              <FileText className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">
                  Compatibility Reports
                </p>
                <p className="text-3xl font-bold">
                  {reports?.summary.total_compatibility_reports || 0}
                </p>
              </div>
              <Users className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">
                  Consultations
                </p>
                <p className="text-3xl font-bold">
                  {reports?.summary.total_consultations || 0}
                </p>
              </div>
              <Activity className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">
                  Total Reports
                </p>
                <p className="text-3xl font-bold">
                  {reports?.summary.total_reports || 0}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-teal-500 to-teal-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-teal-100 text-sm font-medium">
                  Anonymous Reports
                </p>
                <p className="text-3xl font-bold">
                  {(reports?.birth_charts.filter((c) => c.is_anonymous)
                    .length || 0) +
                    (reports?.compatibility_reports.filter(
                      (r) => r.is_anonymous,
                    ).length || 0)}
                </p>
              </div>
              <Eye className="h-8 w-8 text-teal-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Birth Charts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Birth Charts Generated Today
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Badge variant="outline" className="text-teal-600">
                  {reports?.birth_charts.filter((c) => c.is_anonymous).length ||
                    0}{" "}
                  Anonymous
                </Badge>
                <Badge variant="outline">
                  {reports?.birth_charts.filter((c) => !c.is_anonymous)
                    .length || 0}{" "}
                  Registered
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {reports?.birth_charts.length ? (
                reports.birth_charts.map((chart) => (
                  <div
                    key={chart.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{chart.name}</p>
                      <p className="text-sm text-gray-600">
                        {formatDate(chart.birth_date)} at {chart.birth_time}
                      </p>
                      <p className="text-xs text-gray-500">
                        {chart.birth_location}
                      </p>
                    </div>
                    <div className="text-right space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">ID: {chart.id}</Badge>
                        {chart.is_anonymous && (
                          <Badge
                            variant="outline"
                            className="text-teal-600 border-teal-200"
                          >
                            Anonymous
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        {formatTime(chart.created_at)}
                      </p>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>
                              Birth Chart Details - {chart.name}
                            </DialogTitle>
                          </DialogHeader>
                          <ReportDetailsDialog
                            reportId={chart.id}
                            reportType="birth-chart"
                          />
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No birth charts generated today</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Consultations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Consultations Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {reports?.consultations.length ? (
                reports.consultations.map((consultation) => (
                  <div
                    key={consultation.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {consultation.topic}
                      </p>
                      <p className="text-sm text-gray-600">
                        Duration: {consultation.duration} minutes
                      </p>
                      <p className="text-xs text-gray-500">
                        Cost: ₹{(consultation.cost / 100).toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right space-y-2">
                      <Badge
                        variant={
                          consultation.status === "completed"
                            ? "default"
                            : "secondary"
                        }
                        className="mb-1"
                      >
                        {consultation.status}
                      </Badge>
                      <p className="text-xs text-gray-500">
                        {formatTime(consultation.created_at)}
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No consultations today</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compatibility Reports */}
      {reports?.compatibility_reports &&
        reports.compatibility_reports.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Compatibility Reports Today
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="outline" className="text-teal-600">
                    {reports?.compatibility_reports.filter(
                      (r) => r.is_anonymous,
                    ).length || 0}{" "}
                    Anonymous
                  </Badge>
                  <Badge variant="outline">
                    {reports?.compatibility_reports.filter(
                      (r) => !r.is_anonymous,
                    ).length || 0}{" "}
                    Registered
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reports.compatibility_reports.map((report) => (
                  <div
                    key={report.id}
                    className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-medium text-gray-900">
                          Report #{report.id}
                        </p>
                        <p className="text-sm text-gray-600">
                          Score: {report.compatibility_score}/36
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline">
                            {Math.round(
                              (report.compatibility_score / 36) * 100,
                            )}
                            %
                          </Badge>
                          {report.is_anonymous && (
                            <Badge
                              variant="outline"
                              className="text-teal-600 border-teal-200"
                            >
                              Anonymous
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">
                          {formatTime(report.created_at)}
                        </p>
                      </div>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="w-full">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>
                            Compatibility Report Details - #{report.id}
                          </DialogTitle>
                        </DialogHeader>
                        <ReportDetailsDialog
                          reportId={report.id}
                          reportType="compatibility-report"
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
    </>
  );
}

// Component for Range Reports View
function RangeReportsView({
  rangeData,
}: {
  rangeData: RangeReports | undefined;
}) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (!rangeData) {
    return (
      <div className="text-center py-8 text-gray-500">
        Loading range data...
      </div>
    );
  }

  return (
    <>
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          {formatDate(rangeData.date_range.start)} -{" "}
          {formatDate(rangeData.date_range.end)} ({rangeData.date_range.days}{" "}
          days)
        </h2>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">
                  Birth Charts
                </p>
                <p className="text-3xl font-bold">
                  {rangeData.summary.total_birth_charts}
                </p>
              </div>
              <FileText className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">
                  Compatibility Reports
                </p>
                <p className="text-3xl font-bold">
                  {rangeData.summary.total_compatibility_reports}
                </p>
              </div>
              <Users className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">
                  Consultations
                </p>
                <p className="text-3xl font-bold">
                  {rangeData.summary.total_consultations}
                </p>
              </div>
              <Activity className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">
                  Total Reports
                </p>
                <p className="text-3xl font-bold">
                  {rangeData.summary.total_reports}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Statistics Chart */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Daily Activity Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rangeData.daily_stats.map((day) => (
              <div
                key={day.date}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {formatDate(day.date)}
                  </p>
                  <p className="text-sm text-gray-600">
                    Birth Charts: {day.birth_charts} | Compatibility:{" "}
                    {day.compatibility_reports} | Consultations:{" "}
                    {day.consultations}
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="text-lg px-3 py-1">
                    {day.total}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">Total Reports</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Birth Charts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Recent Birth Charts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {rangeData.birth_charts.length ? (
                rangeData.birth_charts.slice(0, 10).map((chart) => (
                  <div
                    key={chart.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{chart.name}</p>
                      <p className="text-sm text-gray-600">
                        {formatDate(chart.birth_date)} at {chart.birth_time}
                      </p>
                      <p className="text-xs text-gray-500">
                        {chart.birth_location}
                      </p>
                    </div>
                    <div className="text-right space-y-2">
                      <Badge variant="secondary">ID: {chart.id}</Badge>
                      <p className="text-xs text-gray-500">
                        {formatDate(chart.created_at)}
                      </p>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>
                              Birth Chart Details - {chart.name}
                            </DialogTitle>
                          </DialogHeader>
                          <ReportDetailsDialog
                            reportId={chart.id}
                            reportType="birth-chart"
                          />
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No birth charts in this period</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Compatibility Reports */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Recent Compatibility Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {rangeData.compatibility_reports.length ? (
                rangeData.compatibility_reports.slice(0, 10).map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        Report #{report.id}
                      </p>
                      <p className="text-sm text-gray-600">
                        Score: {report.compatibility_score}/36
                      </p>
                    </div>
                    <div className="text-right space-y-2">
                      <Badge variant="outline">
                        {Math.round((report.compatibility_score / 36) * 100)}%
                      </Badge>
                      <p className="text-xs text-gray-500">
                        {formatDate(report.created_at)}
                      </p>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>
                              Compatibility Report Details - #{report.id}
                            </DialogTitle>
                          </DialogHeader>
                          <ReportDetailsDialog
                            reportId={report.id}
                            reportType="compatibility-report"
                          />
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No compatibility reports in this period</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

// User Management Component
function UserManagementView({
  users,
  isLoading,
  error,
}: {
  users: any[] | undefined;
  isLoading: boolean;
  error: any;
}) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <AlertCircle className="h-12 w-12 mx-auto mb-2" />
            <h3 className="text-lg font-semibold">Error Loading Users</h3>
            <p className="text-sm text-red-500">Unable to fetch user data</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">User Management</h2>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{users?.length || 0} Total Users</Badge>
          <Button size="sm" className="gap-2">
            <UserPlus className="h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      {/* User Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Users</p>
                <p className="text-2xl font-bold">{users?.length || 0}</p>
              </div>
              <Users className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Active Users</p>
                <p className="text-2xl font-bold">
                  {users?.filter((u) => u.isActive).length || 0}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">New This Week</p>
                <p className="text-2xl font-bold">
                  {users?.filter((u) => {
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return new Date(u.createdAt) > weekAgo;
                  }).length || 0}
                </p>
              </div>
              <UserPlus className="h-8 w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">Blocked Users</p>
                <p className="text-2xl font-bold">
                  {users?.filter((u) => u.isBlocked).length || 0}
                </p>
              </div>
              <Ban className="h-8 w-8 text-red-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            All Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {users?.length ? (
              users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {user.username?.charAt(0).toUpperCase() ||
                          user.email?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {user.username || "No username"}
                        </p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={user.isActive ? "default" : "secondary"}>
                        {user.isActive ? "Active" : "Inactive"}
                      </Badge>
                      {user.isBlocked && (
                        <Badge variant="destructive">Blocked</Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      Joined: {formatDate(user.createdAt)}
                    </p>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>No users found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

// Astrologer Management Component with Pagination and Bulk Actions
function AstrologerManagementView({
  astrologers,
  isLoading,
  error,
}: {
  astrologers: any[] | undefined;
  isLoading: boolean;
  error: any;
}) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingAstrologer, setEditingAstrologer] = useState<any>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Pagination and bulk action states
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAstrologers, setSelectedAstrologers] = useState<Set<number>>(
    new Set(),
  );
  const [selectAll, setSelectAll] = useState(false);
  const itemsPerPage = 50;

  // Calculate pagination
  const totalPages = Math.ceil((astrologers?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAstrologers = astrologers?.slice(startIndex, endIndex) || [];

  // Handle select all
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedAstrologers(new Set());
    } else {
      const allIds = new Set(currentAstrologers.map((a) => a.id));
      setSelectedAstrologers(allIds);
    }
    setSelectAll(!selectAll);
  };

  // Handle individual selection
  const handleSelectAstrologer = (id: number) => {
    const newSelected = new Set(selectedAstrologers);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedAstrologers(newSelected);
    setSelectAll(newSelected.size === currentAstrologers.length);
  };

  // Individual status toggle mutation
  const toggleStatusMutation = useMutation({
    mutationFn: async ({
      astrologerId,
      isOnline,
    }: {
      astrologerId: number;
      isOnline: boolean;
    }) => {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `/api/admin/astrologers/${astrologerId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ isOnline }),
        },
      );
      if (!response.ok) throw new Error("Failed to toggle online status");
      return response.json();
    },
    onSuccess: (_, variables) => {
      toast({
        title: "Status Updated",
        description: `Astrologer ${variables.isOnline ? "set online" : "set offline"}`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/astrologers"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update status",
        variant: "destructive",
      });
    },
  });

  // Bulk action mutations
  const bulkToggleOnlineMutation = useMutation({
    mutationFn: async ({
      astrologerIds,
      isOnline,
    }: {
      astrologerIds: number[];
      isOnline: boolean;
    }) => {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "/api/admin/astrologers/bulk-toggle-online",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ astrologerIds, isOnline }),
        },
      );
      if (!response.ok) throw new Error("Failed to toggle online status");
      return response.json();
    },
    onSuccess: (_, variables) => {
      toast({
        title: "Success",
        description: `${variables.astrologerIds.length} astrologers ${variables.isOnline ? "set online" : "set offline"}`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/astrologers"] });
      setSelectedAstrologers(new Set());
      setSelectAll(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update astrologers",
        variant: "destructive",
      });
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: async (astrologerIds: number[]) => {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/admin/astrologers/bulk-delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ astrologerIds }),
      });
      if (!response.ok) throw new Error("Failed to delete astrologers");
      return response.json();
    },
    onSuccess: (_, astrologerIds) => {
      toast({
        title: "Success",
        description: `${astrologerIds.length} astrologers deleted successfully`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/astrologers"] });
      setSelectedAstrologers(new Set());
      setSelectAll(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete astrologers",
        variant: "destructive",
      });
    },
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Form for editing astrologer
  const editForm = useForm<AstrologerEditFormData>({
    resolver: zodResolver(astrologerEditSchema),
    defaultValues: {
      name: "",
      email: "",
      experience: 0,
      specializations: "",
      languages: "",
      description: "",
      ratePerMinute: 0,
      image: "",
    },
  });

  // Handle image upload
  const handleImageUpload = async (file: File) => {
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const token = localStorage.getItem("token");
      const response = await fetch("/api/upload/astrologer-image", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const result = await response.json();
      setPreviewImage(result.imageUrl);
      editForm.setValue("image", result.imageUrl);

      toast({
        title: "Image Uploaded",
        description: "Astrologer image has been uploaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  // Handle edit astrologer
  const handleEditAstrologer = (astrologer: any) => {
    setEditingAstrologer(astrologer);
    setPreviewImage(astrologer.image || null);
    editForm.reset({
      name: astrologer.name || "",
      email: astrologer.email || "",
      experience: astrologer.experience || 0,
      specializations: Array.isArray(astrologer.specialization)
        ? astrologer.specialization.join(", ")
        : astrologer.specialization || "",
      languages: Array.isArray(astrologer.languages)
        ? astrologer.languages.join(", ")
        : astrologer.languages || "",
      description: astrologer.bio || astrologer.description || "",
      ratePerMinute: astrologer.pricePerMinute || astrologer.ratePerMinute || 0,
      image: astrologer.image || "",
    });
  };

  // Update astrologer mutation
  const updateAstrologerMutation = useMutation({
    mutationFn: async (data: AstrologerEditFormData & { id: number }) => {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/admin/astrologers/${data.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          experience: data.experience,
          specialization: data.specializations.split(",").map((s) => s.trim()),
          languages: data.languages.split(",").map((s) => s.trim()),
          bio: data.description,
          pricePerMinute: data.ratePerMinute,
          image: data.image,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update astrologer");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Astrologer updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/astrologers"] });
      setEditingAstrologer(null);
      editForm.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update astrologer",
        variant: "destructive",
      });
    },
  });

  // Submit edit form
  const onSubmitEdit = (data: AstrologerEditFormData) => {
    if (!editingAstrologer) return;
    updateAstrologerMutation.mutate({ ...data, id: editingAstrologer.id });
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <AlertCircle className="h-12 w-12 mx-auto mb-2" />
            <h3 className="text-lg font-semibold">Error Loading Astrologers</h3>
            <p className="text-sm text-red-500">
              Unable to fetch astrologer data
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Astrologer Management
        </h2>
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            {astrologers?.length || 0} Total Astrologers
          </Badge>
          <Button
            size="sm"
            variant="outline"
            className="gap-2 text-green-600 border-green-300 hover:bg-green-50"
            onClick={() => {
              const allIds = astrologers?.map((a) => a.id) || [];
              if (allIds.length > 0) {
                bulkToggleOnlineMutation.mutate({
                  astrologerIds: allIds,
                  isOnline: true,
                });
              }
            }}
            disabled={
              bulkToggleOnlineMutation.isPending || !astrologers?.length
            }
          >
            <CheckCircle className="h-4 w-4" />
            Set All Online
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="gap-2 text-red-600 border-red-300 hover:bg-red-50"
            onClick={() => {
              const allIds = astrologers?.map((a) => a.id) || [];
              if (allIds.length > 0) {
                bulkToggleOnlineMutation.mutate({
                  astrologerIds: allIds,
                  isOnline: false,
                });
              }
            }}
            disabled={
              bulkToggleOnlineMutation.isPending || !astrologers?.length
            }
          >
            <XCircle className="h-4 w-4" />
            Set All Offline
          </Button>
          <Button size="sm" className="gap-2">
            <UserPlus className="h-4 w-4" />
            Add Astrologer
          </Button>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedAstrologers.size > 0 && (
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-blue-800">
                  {selectedAstrologers.size} astrologer
                  {selectedAstrologers.size > 1 ? "s" : ""} selected
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      bulkToggleOnlineMutation.mutate({
                        astrologerIds: Array.from(selectedAstrologers),
                        isOnline: true,
                      })
                    }
                    disabled={bulkToggleOnlineMutation.isPending}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Set Online
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      bulkToggleOnlineMutation.mutate({
                        astrologerIds: Array.from(selectedAstrologers),
                        isOnline: false,
                      })
                    }
                    disabled={bulkToggleOnlineMutation.isPending}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Set Offline
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      if (
                        confirm(
                          `Are you sure you want to delete ${selectedAstrologers.size} astrologer${selectedAstrologers.size > 1 ? "s" : ""}?`,
                        )
                      ) {
                        bulkDeleteMutation.mutate(
                          Array.from(selectedAstrologers),
                        );
                      }
                    }}
                    disabled={bulkDeleteMutation.isPending}
                  >
                    <Ban className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      // TODO: Implement chat reroute for multiple astrologers
                      toast({
                        title: "Chat Reroute",
                        description:
                          "Bulk chat reroute functionality coming soon",
                      });
                    }}
                  >
                    <ArrowRightLeft className="h-4 w-4 mr-2" />
                    Chat Reroute
                  </Button>
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setSelectedAstrologers(new Set());
                  setSelectAll(false);
                }}
              >
                Clear Selection
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Astrologer Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Total Astrologers</p>
                <p className="text-2xl font-bold">{astrologers?.length || 0}</p>
              </div>
              <UserCheck className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Online Now</p>
                <p className="text-2xl font-bold">
                  {astrologers?.filter((a) => a.isOnline).length || 0}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm">Avg Rating</p>
                <p className="text-2xl font-bold">
                  {astrologers?.length
                    ? (
                        astrologers.reduce(
                          (sum, a) => sum + (a.rating || 0),
                          0,
                        ) / astrologers.length
                      ).toFixed(1)
                    : "0.0"}
                </p>
              </div>
              <Star className="h-8 w-8 text-yellow-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Active This Week</p>
                <p className="text-2xl font-bold">
                  {astrologers?.filter((a) => {
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return new Date(a.lastActive || a.createdAt) > weekAgo;
                  }).length || 0}
                </p>
              </div>
              <Activity className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Astrologers Table with Pagination */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Astrologer Profiles
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <span>•</span>
              <span>
                Showing {currentAstrologers.length} of{" "}
                {astrologers?.length || 0}
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Table Header with Select All */}
          <div className="bg-gray-50 p-3 rounded-t-lg border">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Select All
                </span>
              </label>
              <div className="flex items-center gap-8 text-sm text-gray-600 font-medium">
                <span className="w-32">Profile</span>
                <span className="w-24">Status</span>
                <span className="w-20">Rating</span>
                <span className="w-24">Rate/min</span>
                <span className="w-24">Quick Toggle</span>
                <span className="w-32">Actions</span>
              </div>
            </div>
          </div>

          {/* Table Body */}
          <div className="border border-t-0 rounded-b-lg">
            {currentAstrologers && currentAstrologers.length > 0 ? (
              currentAstrologers.map((astrologer, index) => (
                <div
                  key={astrologer.id}
                  className={`flex items-center gap-4 p-4 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50 transition-colors border-b last:border-b-0`}
                >
                  {/* Checkbox */}
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedAstrologers.has(astrologer.id)}
                      onChange={() => handleSelectAstrologer(astrologer.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </label>

                  {/* Profile */}
                  <div className="flex items-center gap-3 w-32">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                        <img
                          src={astrologer.image || "/api/placeholder/100/100"}
                          alt={astrologer.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                            target.nextElementSibling?.classList.remove(
                              "hidden",
                            );
                          }}
                        />
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold text-sm hidden">
                          {astrologer.name?.charAt(0).toUpperCase()}
                        </div>
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 text-sm truncate">
                        {astrologer.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {astrologer.email}
                      </p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="w-24">
                    <Badge
                      variant={astrologer.isOnline ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {astrologer.isOnline ? "Online" : "Offline"}
                    </Badge>
                  </div>

                  {/* Rating */}
                  <div className="w-20">
                    <Badge variant="outline" className="text-xs">
                      ⭐ {astrologer.rating || 0}
                    </Badge>
                  </div>

                  {/* Rate */}
                  <div className="w-24">
                    <span className="text-sm text-gray-900">
                      ₹{astrologer.pricePerMinute || 0}
                    </span>
                  </div>

                  {/* Quick Toggle */}
                  <div className="w-24">
                    <Button
                      variant={astrologer.isOnline ? "destructive" : "default"}
                      size="sm"
                      className="text-xs px-2 py-1 h-6"
                      onClick={() =>
                        toggleStatusMutation.mutate({
                          astrologerId: astrologer.id,
                          isOnline: !astrologer.isOnline,
                        })
                      }
                      disabled={toggleStatusMutation.isPending}
                    >
                      {astrologer.isOnline ? "Set Offline" : "Set Online"}
                    </Button>
                  </div>

                  {/* Actions */}
                  <div className="w-32 flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs px-2 py-1"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs px-2 py-1"
                          onClick={() => handleEditAstrologer(astrologer)}
                        >
                          <Settings className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Edit Astrologer Profile</DialogTitle>
                        </DialogHeader>
                        <AstrologerEditDialog
                          astrologer={editingAstrologer}
                          form={editForm}
                          onSubmit={onSubmitEdit}
                          isLoading={updateAstrologerMutation.isPending}
                          onImageUpload={handleImageUpload}
                          previewImage={previewImage}
                          uploadingImage={uploadingImage}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <UserCheck className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>No astrologers found</p>
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to{" "}
                {Math.min(endIndex, astrologers?.length || 0)} of{" "}
                {astrologers?.length || 0} astrologers
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page =
                    Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  );
                })}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}

// Chat Monitoring Component
function ChatMonitoringView({
  chats,
  isLoading,
  error,
}: {
  chats: any[] | undefined;
  isLoading: boolean;
  error: any;
}) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch available astrologers for rerouting
  const { data: availableAstrologers } = useQuery({
    queryKey: ["/api/astrologers"],
    queryFn: async () => {
      const response = await fetch("/api/astrologers");
      if (!response.ok) throw new Error("Failed to fetch astrologers");
      return response.json();
    },
  });

  // Chat rerouting mutation
  const rerouteChatMutation = useMutation({
    mutationFn: async ({
      consultationId,
      newAstrologerId,
    }: {
      consultationId: number;
      newAstrologerId: number;
    }) => {
      const response = await apiRequest(
        "POST",
        `/api/admin/consultations/${consultationId}/reroute`,
        {
          newAstrologerId,
        },
      );
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/chats"] });
      toast({
        title: "Chat Rerouted Successfully",
        description:
          "The consultation has been transferred to the new astrologer.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Rerouting Failed",
        description:
          error.message || "Failed to reroute chat. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Force end chat mutation
  const endChatMutation = useMutation({
    mutationFn: async (consultationId: number) => {
      const response = await apiRequest(
        "POST",
        `/api/admin/consultations/${consultationId}/end`,
      );
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/chats"] });
      toast({
        title: "Chat Ended",
        description: "The consultation has been ended successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to End Chat",
        description: error.message || "Failed to end chat. Please try again.",
        variant: "destructive",
      });
    },
  });
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <AlertCircle className="h-12 w-12 mx-auto mb-2" />
            <h3 className="text-lg font-semibold">Error Loading Chats</h3>
            <p className="text-sm text-red-500">Unable to fetch chat data</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Chat Monitoring</h2>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{chats?.length || 0} Total Chats</Badge>
          <Button size="sm" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Chat Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Chats</p>
                <p className="text-2xl font-bold">{chats?.length || 0}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Active Chats</p>
                <p className="text-2xl font-bold">
                  {chats?.filter((c) => c.status === "active").length || 0}
                </p>
              </div>
              <Activity className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm">Avg Duration</p>
                <p className="text-2xl font-bold">
                  {chats?.length
                    ? Math.round(
                        chats.reduce((sum, c) => sum + (c.duration || 0), 0) /
                          chats.length,
                      )
                    : 0}
                  m
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Today's Chats</p>
                <p className="text-2xl font-bold">
                  {chats?.filter((c) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return new Date(c.createdAt) >= today;
                  }).length || 0}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chat List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Recent Chats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {chats?.length ? (
              chats.map((chat) => (
                <div
                  key={chat.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                        #{chat.id}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {chat.userName || "Anonymous"} ↔{" "}
                          {chat.astrologerName || "Unknown"}
                        </p>
                        <p className="text-sm text-gray-600">
                          Topic: {chat.topic || "General consultation"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(chat.createdAt)} at{" "}
                          {formatTime(chat.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          chat.status === "active"
                            ? "default"
                            : chat.status === "completed"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {chat.status || "Unknown"}
                      </Badge>
                      <Badge variant="outline">{chat.duration || 0}min</Badge>
                    </div>
                    <p className="text-xs text-gray-500">
                      Cost: ₹{chat.cost || 0}
                    </p>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      {chat.status === "active" && (
                        <>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-blue-600"
                              >
                                <ArrowRightLeft className="h-4 w-4 mr-2" />
                                Reroute
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                              <DialogHeader>
                                <DialogTitle>
                                  Reroute Chat to Different Astrologer
                                </DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="text-sm text-gray-600">
                                  <p>
                                    <strong>Current:</strong>{" "}
                                    {chat.astrologerName || "Unknown"}
                                  </p>
                                  <p>
                                    <strong>User:</strong>{" "}
                                    {chat.userName || "Anonymous"}
                                  </p>
                                  <p>
                                    <strong>Topic:</strong>{" "}
                                    {chat.topic || "General consultation"}
                                  </p>
                                </div>
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">
                                    Select New Astrologer:
                                  </label>
                                  <div className="space-y-2 max-h-60 overflow-y-auto">
                                    {availableAstrologers
                                      ?.filter(
                                        (astrologer: any) =>
                                          astrologer.id !== chat.astrologerId &&
                                          astrologer.isOnline,
                                      )
                                      .map((astrologer: any) => (
                                        <Button
                                          key={astrologer.id}
                                          variant="outline"
                                          className="w-full justify-start"
                                          onClick={() =>
                                            rerouteChatMutation.mutate({
                                              consultationId: chat.id,
                                              newAstrologerId: astrologer.id,
                                            })
                                          }
                                          disabled={
                                            rerouteChatMutation.isPending
                                          }
                                        >
                                          <div className="flex items-center gap-3">
                                            <img
                                              src={astrologer.image}
                                              alt={astrologer.name}
                                              className="w-6 h-6 rounded-full"
                                            />
                                            <div className="text-left">
                                              <p className="font-medium">
                                                {astrologer.name}
                                              </p>
                                              <p className="text-xs text-gray-500">
                                                ⭐ {astrologer.rating} • ₹
                                                {astrologer.ratePerMinute}/min
                                              </p>
                                            </div>
                                          </div>
                                        </Button>
                                      ))}
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600"
                            onClick={() => endChatMutation.mutate(chat.id)}
                            disabled={endChatMutation.isPending}
                          >
                            <Zap className="h-4 w-4 mr-2" />
                            End Chat
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>No chats found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

// Astrologer Edit Dialog Component
function AstrologerEditDialog({
  astrologer,
  form,
  onSubmit,
  isLoading,
  onImageUpload,
  previewImage,
  uploadingImage,
}: {
  astrologer: any;
  form: any;
  onSubmit: (data: AstrologerEditFormData) => void;
  isLoading: boolean;
  onImageUpload: (file: File) => void;
  previewImage: string | null;
  uploadingImage: boolean;
}) {
  if (!astrologer) return null;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Profile Image Upload */}
        <div className="flex items-start gap-6">
          <div className="space-y-3">
            <label className="text-sm font-medium">
              Current Profile Picture
            </label>
            <div className="relative">
              <img
                src={
                  previewImage || astrologer.image || "/placeholder-avatar.png"
                }
                alt={astrologer.name}
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder-avatar.png";
                }}
              />
              {uploadingImage && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Upload New Image</label>
                <div className="mt-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        onImageUpload(file);
                      }
                    }}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100
                      disabled:opacity-50"
                    disabled={uploadingImage}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Supported formats: JPEG, PNG, GIF, WebP (Max 5MB)
                </p>
              </div>

              {previewImage && (
                <div>
                  <p className="text-xs text-gray-500 mb-2">
                    New Image Preview:
                  </p>
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-16 h-16 rounded-full object-cover border"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Astrologer name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="email@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="experience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Experience (years)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="10"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value) || 0)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ratePerMinute"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rate per Minute (₹)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="25"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value) || 0)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="specializations"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Specializations (comma-separated)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Vedic Astrology, Numerology, Palmistry"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="languages"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Languages (comma-separated)</FormLabel>
              <FormControl>
                <Input placeholder="Hindi, English, Sanskrit" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Brief description about the astrologers expertise and background"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            disabled={isLoading}
          >
            Reset
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Astrologer"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

// Article Management Schemas and Types
const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English" },
  { code: "hi", name: "Hindi (हिंदी)" },
  { code: "bn", name: "Bengali (বাংলা)" },
  { code: "te", name: "Telugu (తెలుగు)" },
  { code: "mr", name: "Marathi (मराठी)" },
  { code: "ta", name: "Tamil (தமிழ்)" },
  { code: "gu", name: "Gujarati (ગુજરાતી)" },
  { code: "kn", name: "Kannada (ಕನ್ನಡ)" },
  { code: "ml", name: "Malayalam (മലയാളം)" },
  { code: "or", name: "Odia (ଓଡ଼ିଆ)" },
  { code: "pa", name: "Punjabi (ਪੰਜਾਬੀ)" },
  { code: "as", name: "Assamese (অসমীয়া)" },
  { code: "ur", name: "Urdu (اردو)" },
  { code: "ne", name: "Nepali (नेपाली)" },
  { code: "si", name: "Sinhala (සිංහල)" },
  { code: "sa", name: "Sanskrit (संस्कृतम्)" },
  { code: "es", name: "Spanish (Español)" },
  { code: "fr", name: "French (Français)" },
  { code: "de", name: "German (Deutsch)" },
  { code: "pt", name: "Portuguese (Português)" },
  { code: "ja", name: "Japanese (日本語)" },
  { code: "zh", name: "Chinese (中文)" },
  { code: "ar", name: "Arabic (العربية)" },
  { code: "ru", name: "Russian (Русский)" },
];

const articleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  category: z.string().min(1, "Category is required"),
  tags: z.string().optional(),
  featuredImage: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  status: z.enum(["draft", "published"]),
  language: z.string().min(1, "Language is required"),
});

type ArticleFormData = z.infer<typeof articleSchema>;

// Article Management Component
function ArticleManagementView() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingArticle, setEditingArticle] =
    useState<ArticleWithAuthor | null>(null);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(["en"]);
  const [uploadedImage, setUploadedImage] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch articles
  const { data: articles = [], isLoading: articlesLoading } = useQuery<
    ArticleWithAuthor[]
  >({
    queryKey: ["/api/admin/articles"],
  });

  // Fetch categories
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const form = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: "",
      content: "",
      excerpt: "",
      category: "",
      tags: "",
      featuredImage: "",
      metaTitle: "",
      metaDescription: "",
      status: "draft",
      language: "en",
    },
  });

  // Auto-generate SEO meta fields
  const generateSEOMeta = async () => {
    const title = form.getValues("title");
    const content = form.getValues("content");
    const excerpt = form.getValues("excerpt");

    if (!title || !content) {
      toast({
        title: "Error",
        description: "Please fill in title and content first",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true); // Reuse loading state
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/admin/generate-seo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          content: content.substring(0, 1000), // Limit content for analysis
          excerpt,
        }),
      });

      if (!response.ok) throw new Error("Failed to generate SEO meta");

      const result = await response.json();

      if (result.success) {
        // Auto-fill the SEO fields
        form.setValue("metaTitle", result.metaTitle);
        form.setValue("metaDescription", result.metaDescription);

        toast({
          title: "Success",
          description: "SEO meta fields generated successfully",
        });
      } else {
        throw new Error(result.message || "Failed to generate SEO meta");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate SEO meta fields",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Image upload handler
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image size should be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const token = localStorage.getItem("token");
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const result = await response.json();
      setUploadedImage(result.url);
      form.setValue("featuredImage", result.url);

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Create article mutation
  const createMutation = useMutation({
    mutationFn: async (data: ArticleFormData) => {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/admin/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...data,
          tags: data.tags
            ? data.tags.split(",").map((tag: string) => tag.trim())
            : [],
        }),
      });
      if (!response.ok) throw new Error("Failed to create article");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/articles"] });
      setIsCreateOpen(false);
      form.reset();
      setUploadedImage("");
      toast({
        title: "Success",
        description: "Article created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update article mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: ArticleFormData }) => {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/admin/articles/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...data,
          tags: data.tags
            ? data.tags.split(",").map((tag: string) => tag.trim())
            : [],
        }),
      });
      if (!response.ok) throw new Error("Failed to update article");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/articles"] });
      setEditingArticle(null);
      form.reset();
      setUploadedImage("");
      toast({
        title: "Success",
        description: "Article updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete article mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/admin/articles/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to delete article");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/articles"] });
      toast({
        title: "Success",
        description: "Article deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ArticleFormData) => {
    if (editingArticle) {
      updateMutation.mutate({ id: editingArticle.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (article: ArticleWithAuthor) => {
    setEditingArticle(article);
    setUploadedImage(article.featuredImage || "");
    form.reset({
      title: article.title,
      content: article.content,
      excerpt: article.excerpt,
      category: article.category,
      tags: Array.isArray(article.tags) ? article.tags.join(", ") : "",
      featuredImage: article.featuredImage || "",
      metaTitle: article.metaTitle || "",
      metaDescription: article.metaDescription || "",
      status: article.status as "draft" | "published",
      language: (article as any).language || "en",
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this article?")) {
      deleteMutation.mutate(id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredArticles = articles.filter((article) => {
    if (selectedLanguages.includes("all") || selectedLanguages.length === 0) {
      return true;
    }
    return selectedLanguages.includes((article as any).language || "en");
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Article Management
          </h2>
          <p className="text-gray-600 mt-1">
            Create and manage multilingual blog articles
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Article
        </Button>
      </div>

      {/* Language Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filter by Language</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={selectedLanguages[0] || "en"}
            onValueChange={(value) => setSelectedLanguages([value])}
          >
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Languages</SelectItem>
              {SUPPORTED_LANGUAGES.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Articles Table */}
      <Card>
        <CardHeader>
          <CardTitle>Articles ({filteredArticles.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {articlesLoading ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p>Loading articles...</p>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">No articles found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Title</th>
                    <th className="text-left p-2">Category</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Language</th>
                    <th className="text-left p-2">Created</th>
                    <th className="text-left p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredArticles.map((article) => (
                    <tr key={article.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">
                        <div>
                          <p className="font-medium">{article.title}</p>
                          <p className="text-sm text-gray-500 truncate max-w-xs">
                            {article.excerpt}
                          </p>
                        </div>
                      </td>
                      <td className="p-2">
                        <Badge variant="outline">{article.category}</Badge>
                      </td>
                      <td className="p-2">
                        <Badge className={getStatusColor(article.status)}>
                          {article.status}
                        </Badge>
                      </td>
                      <td className="p-2">
                        <Badge variant="secondary">
                          {SUPPORTED_LANGUAGES.find(
                            (l) => l.code === (article as any).language,
                          )?.name || "English"}
                        </Badge>
                      </td>
                      <td className="p-2 text-sm text-gray-500">
                        {new Date(article.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-2">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(article)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(article.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Article Dialog */}
      <Dialog
        open={isCreateOpen || !!editingArticle}
        onOpenChange={() => {
          setIsCreateOpen(false);
          setEditingArticle(null);
          form.reset();
          setUploadedImage("");
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingArticle ? "Edit Article" : "Create New Article"}
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Article title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.name}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Language</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {SUPPORTED_LANGUAGES.map((lang) => (
                            <SelectItem key={lang.code} value={lang.code}>
                              {lang.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Excerpt</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief description of the article"
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Article content (supports Markdown)"
                        className="min-h-[200px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags (comma-separated)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="astrology, vedic, horoscope"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <label className="text-sm font-medium">Featured Image</label>
                  <div className="flex gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                    />
                    {isUploading && (
                      <RefreshCw className="h-5 w-5 animate-spin mt-2" />
                    )}
                  </div>
                  {uploadedImage && (
                    <div className="mt-2">
                      <img
                        src={uploadedImage}
                        alt="Preview"
                        className="w-20 h-20 object-cover rounded"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* SEO Section with Auto-Generation */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">SEO Settings</h3>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={generateSEOMeta}
                    disabled={isUploading}
                    className="gap-2"
                  >
                    {isUploading ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Zap className="h-4 w-4" />
                    )}
                    Auto-Generate SEO
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="metaTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meta Title (SEO)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Auto-generated or custom SEO title"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="metaDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meta Description (SEO)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Auto-generated or custom SEO description"
                            className="min-h-[60px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsCreateOpen(false);
                    setEditingArticle(null);
                    form.reset();
                    setUploadedImage("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? "Saving..."
                    : editingArticle
                      ? "Update Article"
                      : "Create Article"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

