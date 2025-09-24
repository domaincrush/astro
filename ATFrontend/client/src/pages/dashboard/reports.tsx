import { useState, useEffect } from "react";
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
  MapPin, 
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react";

interface FAQResponse {
  id: number;
  faqQuestionId: number;
  responseText: string;
  pdfAttachment?: string;
  respondedBy: string;
  createdAt: string;
  faqQuestion: {
    name: string;
    email: string;
    freeQuestion: string;
    additionalQuestion1?: string;
    additionalQuestion2?: string;
    status: string;
  };
}

interface SessionResponse {
  id: number;
  sessionBookingId: number;
  responseText: string;
  pdfAttachment?: string;
  respondedBy: string;
  createdAt: string;
  sessionBooking: {
    name: string;
    email: string;
    phone: string;
    bookingDate: string;
    bookingTime: string;
    status: string;
  };
}

export default function DashboardReports() {
  const { toast } = useToast();
  const [faqResponses, setFaqResponses] = useState<FAQResponse[]>([]);
  const [sessionResponses, setSessionResponses] = useState<SessionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    fetchUserReports();
  }, []);

  const fetchUserReports = async () => {
    try {
      setLoading(true);
      
      // Check if user is authenticated
      const authResponse = await fetch('/api/auth/me');
      if (authResponse.ok) {
        const authData = await authResponse.json();
        setUserEmail(authData.email);
        
        // Fetch all responses (FAQ + sessions combined)
        const responsesResponse = await fetch(`/api/admin/responses/user?email=${encodeURIComponent(authData.email)}`);
        if (responsesResponse.ok) {
          const responsesData = await responsesResponse.json();
          const responses = responsesData.responses || [];
          
          // Separate FAQ and session responses
          setFaqResponses(responses.filter((r: any) => r.questionDetails !== null));
          setSessionResponses(responses.filter((r: any) => r.sessionDetails !== null));
        }
      }

    } catch (error) {
      console.error('Error fetching reports:', error);
      toast({
        title: "Error",
        description: "Failed to fetch your reports. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async (pdfPath: string, filename: string) => {
    try {
      // Check if we're on mobile device
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (isMobile) {
        // For mobile devices, open PDF in new tab/window for better compatibility
        const downloadUrl = `/api/admin/responses/download-pdf?file=${encodeURIComponent(pdfPath)}&inline=true`;
        window.open(downloadUrl, '_blank');
        
        toast({
          title: "Opening PDF",
          description: "PDF is opening in a new tab. You can save it from there.",
        });
        return;
      }
      
      // Desktop download approach
      const response = await fetch(`/api/admin/responses/download-pdf?file=${encodeURIComponent(pdfPath)}`);
      
      if (!response.ok) {
        throw new Error('Failed to download PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 100);

      toast({
        title: "Success",
        description: "PDF downloaded successfully.",
      });
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast({
        title: "Error",
        description: "Failed to download PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'answered':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <AstroTickHeader />
        <main className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading your reports...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <AstroTickHeader />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <FileText className="h-12 w-12 text-indigo-600 mr-3" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Your Reports & Responses
              </h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              View all your astrological consultations, responses, and reports in one place.
            </p>
            {userEmail && (
              <p className="text-sm text-gray-500 mt-2">
                <User className="h-4 w-4 inline mr-1" />
                Logged in as: {userEmail}
              </p>
            )}
          </div>

          {/* FAQ Responses Section */}
          {faqResponses.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Mail className="h-6 w-6 mr-2" />
                FAQ Question Responses
              </h2>
              
              <div className="space-y-6">
                {faqResponses.map((response) => (
                  <Card key={response.id} className="shadow-lg border-blue-200 bg-white/95">
                    <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center">
                          <FileText className="h-5 w-5 mr-2" />
                          FAQ Response #{response.id}
                        </CardTitle>
                        <Badge className={getStatusColor(response.faqQuestion.status)}>
                          {response.faqQuestion.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">Your Questions:</h4>
                          <div className="space-y-2 text-sm">
                            <p className="bg-gray-50 p-3 rounded">
                              <strong>Free Question:</strong> {response.faqQuestion.freeQuestion}
                            </p>
                            {response.faqQuestion.additionalQuestion1 && (
                              <p className="bg-gray-50 p-3 rounded">
                                <strong>Additional Question 1:</strong> {response.faqQuestion.additionalQuestion1}
                              </p>
                            )}
                            {response.faqQuestion.additionalQuestion2 && (
                              <p className="bg-gray-50 p-3 rounded">
                                <strong>Additional Question 2:</strong> {response.faqQuestion.additionalQuestion2}
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">Astrologer's Response:</h4>
                          <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                            <p className="text-gray-700 mb-2">{response.responseText}</p>
                            <div className="flex items-center text-sm text-gray-500">
                              <User className="h-4 w-4 mr-1" />
                              Responded by: {response.respondedBy}
                            </div>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <Clock className="h-4 w-4 mr-1" />
                              {formatDate(response.createdAt)}
                            </div>
                          </div>

                          {response.pdfAttachment && (
                            <Button
                              onClick={() => downloadPDF(response.pdfAttachment!, `FAQ-Response-${response.id}.pdf`)}
                              className="mt-3 w-full"
                              variant="outline"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download Detailed Report (PDF)
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Session Responses Section */}
          {sessionResponses.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Calendar className="h-6 w-6 mr-2" />
                Session Consultation Reports
              </h2>
              
              <div className="space-y-6">
                {sessionResponses.map((response) => (
                  <Card key={response.id} className="shadow-lg border-purple-200 bg-white/95">
                    <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center">
                          <Calendar className="h-5 w-5 mr-2" />
                          Session Report #{response.id}
                        </CardTitle>
                        <Badge className={getStatusColor(response.sessionBooking.status)}>
                          {response.sessionBooking.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-3">Session Details:</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                              <span>{new Date(response.sessionBooking.bookingDate).toLocaleDateString('en-IN')}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2 text-gray-500" />
                              <span>{response.sessionBooking.bookingTime}</span>
                            </div>
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 mr-2 text-gray-500" />
                              <span>{response.sessionBooking.phone}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">Consultation Summary:</h4>
                          <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400">
                            <p className="text-gray-700 mb-2">{response.responseText}</p>
                            <div className="flex items-center text-sm text-gray-500">
                              <User className="h-4 w-4 mr-1" />
                              Consultant: {response.respondedBy}
                            </div>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <Clock className="h-4 w-4 mr-1" />
                              {formatDate(response.createdAt)}
                            </div>
                          </div>

                          {response.pdfAttachment && (
                            <Button
                              onClick={() => downloadPDF(response.pdfAttachment!, `Session-Report-${response.id}.pdf`)}
                              className="mt-3 w-full"
                              variant="outline"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download Full Report (PDF)
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {faqResponses.length === 0 && sessionResponses.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <FileText className="h-24 w-24 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Reports Yet</h3>
                <p className="text-gray-500 mb-6">
                  You haven't received any consultation reports yet. Submit a question or book a session to get started!
                </p>
                <div className="space-x-4">
                  <Button onClick={() => window.location.href = '/faq'}>
                    Ask a Question
                  </Button>
                  <Button onClick={() => window.location.href = '/dashboard/bookings'} variant="outline">
                    Book a Session
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}