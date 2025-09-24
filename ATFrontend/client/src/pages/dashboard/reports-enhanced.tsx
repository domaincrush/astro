import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "src/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { Button } from "src/components/ui/button";
import { Badge } from "src/components/ui/badge";
import { Separator } from "src/components/ui/separator";
import { useToast } from "src/hooks/use-toast";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";
import {
  FileText,
  Download,
  Calendar,
  User,
  Mail,
  Phone,
  Clock,
  AlertCircle,
  Loader2,
  MessageSquare,
  Eye,
} from "lucide-react";

interface AdminResponse {
  id: number;
  responseType: string;
  referenceId: number;
  responseText: string;
  pdfAttachment?: string;
  respondedBy: string;
  emailSent: boolean;
  createdAt: string;
  questionDetails?: {
    freeQuestion: string;
    additionalQuestion1?: string;
    additionalQuestion2?: string;
    name: string;
    email: string;
    birthDate: string;
    birthTime: string;
    birthPlace: string;
  };
  sessionDetails?: {
    name: string;
    email: string;
    phone: string;
    bookingDate: string;
    bookingTime: string;
    birthDate: string;
    birthTime: string;
    birthPlace: string;
  };
}

export default function DashboardReportsEnhanced() {
  const { toast } = useToast();
  const [userEmail, setUserEmail] = useState<string>("");

  // Ultra-optimized auth check with extended caching
  const { data: authData, isLoading: isAuthLoading } = useQuery({
    queryKey: ["/api/auth/me"],
    staleTime: 30 * 60 * 1000, // 30 minutes cache (dramatically increased)
    gcTime: 60 * 60 * 1000, // 1 hour in memory
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false, // No auto-refresh for auth
  });

  // Ultra-optimized user responses query with smart caching
  const { data: responsesData, isLoading: isResponsesLoading, error: responsesError } = useQuery<{success: boolean, responses: AdminResponse[]}>({
    queryKey: ["/api/admin/responses/user", (authData as any)?.email],
    enabled: !!(authData as any)?.email,
    staleTime: 10 * 60 * 1000, // 10 minutes cache (doubled)
    gcTime: 20 * 60 * 1000, // 20 minutes in memory
    retry: 2, // Increased retry for network issues
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false, // No auto-refresh to reduce calls
    queryFn: () => {
      const email = (authData as any).email;
      return apiRequest("GET", `/api/admin/responses/user?email=${encodeURIComponent(email)}`);
    },
  });

  const loading = isAuthLoading || isResponsesLoading;
  
  // Memoized data processing to avoid recalculations
  const { responses, responseStats } = useMemo(() => {
    const responses = responsesData?.responses || [];
    const faqCount = responses.filter((r) => r.responseType === "faq").length;
    const sessionCount = responses.filter((r) => r.responseType === "session").length;
    const pdfCount = responses.filter((r) => r.pdfAttachment).length;
    
    return {
      responses,
      responseStats: { faqCount, sessionCount, pdfCount }
    };
  }, [responsesData]);

  useEffect(() => {
    console.log("🔍 [FRONTEND] Dashboard reports page loading...");

    const urlParams = new URLSearchParams(window.location.search);
    const fromAutoLogin = urlParams.get("auto_login");

    if (fromAutoLogin === "success") {
      console.log(
        "✅ [AUTO-LOGIN] Auto-login successful, showing welcome message",
      );
      toast({
        title: "Successfully logged in!",
        description: "Welcome! You can now view your astrological reports.",
        variant: "default",
      });
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Set user email when auth data is available
    if ((authData as any)?.email) {
      setUserEmail((authData as any).email);
    }
  }, [authData]);

  // Handle authentication errors
  useEffect(() => {
    if (!isAuthLoading && !authData) {
      toast({
        title: "Authentication Required",
        description: "Please log in to view your reports.",
        variant: "destructive",
      });
    }
  }, [isAuthLoading, authData]);

  // Handle response errors
  useEffect(() => {
    if (responsesError) {
      console.error("❌ [FRONTEND] Error fetching reports:", responsesError);
      toast({
        title: "Error",
        description: "Failed to fetch reports. Please try again.",
        variant: "destructive",
      });
    }
  }, [responsesError]);

  // Function to parse the combined response text and display separate responses
  const parseAndDisplayResponses = (responseText: string) => {
    // Split the response by the known patterns
    const freeQuestionMatch = responseText.match(/Free Question Response:\n([\s\S]*?)(?=\n\nPaid Question|$)/);
    const paidQuestion1Match = responseText.match(/Paid Question 1 Response:\n([\s\S]*?)(?=\n\nPaid Question 2|$)/);
    const paidQuestion2Match = responseText.match(/Paid Question 2 Response:\n([\s\S]*?)$/);

    const responses = [];

    if (freeQuestionMatch) {
      responses.push({
        type: "Free Question",
        content: freeQuestionMatch[1].trim(),
        bgColor: "from-green-50 to-emerald-50",
        borderColor: "border-green-400",
        icon: "📝"
      });
    }

    if (paidQuestion1Match) {
      responses.push({
        type: "Premium Question 1",
        content: paidQuestion1Match[1].trim(),
        bgColor: "from-orange-50 to-amber-50",
        borderColor: "border-orange-400",
        icon: "⭐"
      });
    }

    if (paidQuestion2Match) {
      responses.push({
        type: "Premium Question 2", 
        content: paidQuestion2Match[1].trim(),
        bgColor: "from-blue-50 to-indigo-50",
        borderColor: "border-blue-400",
        icon: "⭐"
      });
    }

    // If no matches found, display as single response (backward compatibility)
    if (responses.length === 0) {
      return (
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-5 rounded-lg border-l-4 border-orange-400 shadow-sm">
          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
            {responseText}
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {responses.map((resp, index) => (
          <div key={index} className={`bg-gradient-to-r ${resp.bgColor} p-5 rounded-lg border-l-4 ${resp.borderColor} shadow-sm`}>
            <h5 className="font-semibold text-gray-700 mb-2 flex items-center gap-1">
              <span className="text-lg">{resp.icon}</span>
              {resp.type} Response:
            </h5>
            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
              {resp.content}
            </p>
          </div>
        ))}
      </div>
    );
  };

  const downloadPDF = async (pdfPath: string) => {
    try {
      // Enhanced mobile/device detection
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      
      // Primary download URL
      const downloadUrl = `/api/admin/responses/download-pdf?file=${encodeURIComponent(pdfPath)}`;
      
      if (isMobile) {
        // Multi-fallback approach for mobile devices
        try {
          // Method 1: Try opening in new window (works best for iOS Safari)
          const newWindow = window.open(downloadUrl, '_blank', 'noopener,noreferrer');
          
          // Method 2: If popup blocked, try direct navigation
          if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
            // Create invisible link and click it
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.download = pdfPath.split('/').pop() || 'report.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
          
          toast({
            title: "PDF Opening",
            description: isIOS 
              ? "PDF is opening. You may need to tap 'Open in...' and select your preferred app."
              : "PDF is opening in a new tab or your default PDF viewer.",
          });
          return;
        } catch (mobileError) {
          console.warn('Mobile download method failed, trying fallback:', mobileError);
          // Fallback: direct URL navigation
          window.location.href = downloadUrl;
          return;
        }
      }
      
      // Desktop/laptop download approach with enhanced error handling
      try {
        const response = await fetch(downloadUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/pdf',
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const blob = await response.blob();
        
        // Verify blob is actually a PDF
        if (blob.type && !blob.type.includes('pdf')) {
          throw new Error('Invalid file type received');
        }
        
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = pdfPath.split('/').pop() || 'astrology_report.pdf';
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up
        setTimeout(() => window.URL.revokeObjectURL(url), 100);

        toast({
          title: "Success",
          description: "PDF downloaded successfully.",
        });
      } catch (fetchError) {
        console.warn('Fetch download failed, trying direct link:', fetchError);
        // Fallback: direct link approach
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = pdfPath.split('/').pop() || 'astrology_report.pdf';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast({
          title: "Download Started",
          description: "PDF download initiated. Check your downloads folder.",
        });
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
      
      // Ultimate fallback: direct navigation
      try {
        window.location.href = `/api/admin/responses/download-pdf?file=${encodeURIComponent(pdfPath)}`;
        toast({
          title: "Download Initiated",
          description: "If download doesn't start, please try again or contact support.",
        });
      } catch (finalError) {
        toast({
          title: "Error",
          description: "Failed to download PDF. Please contact support for assistance.",
          variant: "destructive",
        });
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getResponseTypeLabel = (type: string) => {
    return type === "faq" ? "FAQ Response" : "Session Response";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <AstroTickHeader />
        <main className="container mx-auto px-4 py-20">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center animate-fade-in">
              <Loader2 className="h-12 w-12 animate-spin text-orange-600 mx-auto mb-4" />
              <p className="text-gray-600 text-lg font-medium">
                Loading your reports...
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <AstroTickHeader />

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <FileText className="h-12 w-12 text-orange-600 mr-3 drop-shadow" />
              <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent tracking-tight">
                Your Astrology Reports
              </h1>
            </div>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
              Access all your personalized astrology responses and detailed
              reports from our expert astrologers.
            </p>
          </div>

          {/* Stats - Mobile Responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
            <Card className="shadow-lg hover:shadow-xl transition-all rounded-2xl">
              <CardContent className="p-4 sm:p-6 text-center">
                <MessageSquare className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600 mx-auto mb-2 sm:mb-3" />
                <p className="text-2xl sm:text-3xl font-bold text-blue-600">
                  {responseStats.faqCount}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 font-medium">
                  FAQ Responses
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-all rounded-2xl">
              <CardContent className="p-4 sm:p-6 text-center">
                <Calendar className="h-8 w-8 sm:h-10 sm:w-10 text-purple-600 mx-auto mb-2 sm:mb-3" />
                <p className="text-2xl sm:text-3xl font-bold text-purple-600">
                  {responseStats.sessionCount}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 font-medium">
                  Session Reports
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-all rounded-2xl sm:col-span-2 lg:col-span-1">
              <CardContent className="p-4 sm:p-6 text-center">
                <FileText className="h-8 w-8 sm:h-10 sm:w-10 text-green-600 mx-auto mb-2 sm:mb-3" />
                <p className="text-2xl sm:text-3xl font-bold text-green-600">
                  {responseStats.pdfCount}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 font-medium">PDF Reports</p>
              </CardContent>
            </Card>
          </div>

          {/* Reports List */}
          <div className="space-y-8">
            {responses.length === 0 ? (
              <Card className="shadow-md rounded-2xl">
                <CardContent className="p-14 text-center">
                  <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold mb-3">
                    No Reports Yet
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    You haven't received any astrology responses yet. Submit a
                    question or book a session to get started!
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Button
                      className="px-6 py-2 rounded-xl"
                      onClick={() => (window.location.href = "/ask-a-free-question")}
                    >
                      Ask a Question
                    </Button>
                    <Button
                      variant="outline"
                      className="px-6 py-2 rounded-xl"
                      onClick={() => (window.location.href = "/booking")}
                    >
                      Book a Session
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              responses.map((response) => (
                <Card
                  key={response.id}
                  className="hover:shadow-xl transition-all rounded-2xl"
                >
                  <CardHeader className="bg-gradient-to-r from-orange-100 to-amber-100 rounded-t-2xl p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-0">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2 text-base sm:text-lg font-semibold">
                          {response.responseType === "faq" ? (
                            <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                          ) : (
                            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                          )}
                          {getResponseTypeLabel(response.responseType)}
                        </CardTitle>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 mt-2">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="truncate">{response.respondedBy}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="text-xs sm:text-sm">{formatDate(response.createdAt)}</span>
                          </div>
                          {response.emailSent && (
                            <Badge
                              variant="secondary"
                              className="bg-green-100 text-green-800 px-2 py-0.5 text-xs w-fit"
                            >
                              <Mail className="h-3 w-3 mr-1" />
                              Email Sent
                            </Badge>
                          )}
                        </div>
                      </div>
                      {response.pdfAttachment && (
                        <Button
                          onClick={() =>
                            downloadPDF(response.pdfAttachment!)
                          }
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-300 hover:bg-red-50 rounded-lg px-2 py-1 text-xs sm:text-sm sm:px-3 sm:py-2"
                        >
                          <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                          <span className="hidden sm:inline">Download </span>PDF
                        </Button>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                    {response.responseType === "faq" &&
                      response.questionDetails && (
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-3">
                            Your Original Question:
                          </h4>
                          <div className="bg-blue-50 p-4 rounded-lg shadow-inner space-y-2">
                            <p className="text-gray-800">
                              {response.questionDetails.freeQuestion}
                            </p>
                            {response.questionDetails.additionalQuestion1 && (
                              <p className="text-gray-700 text-sm border-l-2 border-blue-300 pl-3">
                                <strong>Additional Q1:</strong>{" "}
                                {response.questionDetails.additionalQuestion1}
                              </p>
                            )}
                            {response.questionDetails.additionalQuestion2 && (
                              <p className="text-gray-700 text-sm border-l-2 border-blue-300 pl-3">
                                <strong>Additional Q2:</strong>{" "}
                                {response.questionDetails.additionalQuestion2}
                              </p>
                            )}
                            <div className="text-xs text-gray-600 mt-2 border-t pt-2">
                              Birth Details:{" "}
                              {response.questionDetails.birthDate} at{" "}
                              {response.questionDetails.birthTime},{" "}
                              {response.questionDetails.birthPlace}
                            </div>
                          </div>
                        </div>
                      )}

                    {response.responseType === "session" &&
                      response.sessionDetails && (
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-3">
                            Session Details:
                          </h4>
                          <div className="bg-purple-50 p-4 rounded-lg shadow-inner">
                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                              <div>
                                Session Date:{" "}
                                {response.sessionDetails.bookingDate}
                              </div>
                              <div>
                                Session Time:{" "}
                                {response.sessionDetails.bookingTime}
                              </div>
                              <div>
                                Contact: {response.sessionDetails.phone}
                              </div>
                              <div>Email: {response.sessionDetails.email}</div>
                            </div>
                            <div className="text-xs text-gray-600 mt-2 border-t pt-2">
                              Birth Details: {response.sessionDetails.birthDate}{" "}
                              at {response.sessionDetails.birthTime},{" "}
                              {response.sessionDetails.birthPlace}
                            </div>
                          </div>
                        </div>
                      )}

                    <Separator />

                    <div>
                      <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Expert Astrology Response:
                      </h4>
                      {response.responseText && response.responseText.trim() !== '' ? (
                        parseAndDisplayResponses(response.responseText)
                      ) : (
                        <div className="bg-yellow-50 border border-yellow-200 p-4 sm:p-6 rounded-lg shadow-sm text-center">
                          <div className="flex items-center justify-center gap-2 text-yellow-800 font-semibold mb-2">
                            <Clock className="h-5 w-5" />
                            Waiting for Admin Response
                          </div>
                          <p className="text-yellow-700 text-sm">
                            Your question has been received and is being reviewed by our expert astrologers. 
                            You will receive a detailed response within 24-48 hours.
                          </p>
                        </div>
                      )}
                    </div>

                    {response.pdfAttachment && (
                      <div className="bg-red-50 border border-red-200 p-4 rounded-lg shadow-sm">
                        <div className="flex items-center gap-2 text-red-800 font-semibold">
                          <FileText className="h-5 w-5" />
                          Additional PDF Report Available
                        </div>
                        <p className="text-red-700 text-sm mt-1">
                          A detailed PDF report has been attached to your
                          response. Click the "Download PDF" button above to
                          access it.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
