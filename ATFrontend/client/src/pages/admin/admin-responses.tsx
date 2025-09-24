import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import { Textarea } from "src/components/ui/textarea";
import { Badge } from "src/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "src/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "src/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "src/components/ui/dialog";
import { useToast } from "src/hooks/use-toast";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";
import {
  FileText,
  Send,
  Upload,
  Calendar,
  User,
  Mail,
  Phone,
  Clock,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Loader2,
  Download,
  Eye,
} from "lucide-react";

const responseFormSchema = z.object({
  responseText: z.string().min(10, "Response must be at least 10 characters"),
  pdfFile: z.any().optional(),
  respondedBy: z.string().min(2, "Responder name is required"),
});

interface FAQQuestion {
  id: number;
  name: string;
  email: string;
  gender: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  freeQuestion: string;
  additionalQuestion1?: string;
  additionalQuestion2?: string;
  status: string;
  createdAt: string;
  paymentStatus?: string;
}

interface SessionBooking {
  id: number;
  name: string;
  email: string;
  phone: string;
  gender: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  bookingDate: string;
  bookingTime: string;
  status: string;
  createdAt: string;
  paymentStatus?: string;
}

export default function AdminResponses() {
  const { toast } = useToast();
  const [faqQuestions, setFaqQuestions] = useState<FAQQuestion[]>([]);
  const [sessionBookings, setSessionBookings] = useState<SessionBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{
    type: string;
    item: any;
  } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof responseFormSchema>>({
    resolver: zodResolver(responseFormSchema),
    defaultValues: {
      responseText: "",
      respondedBy: "",
    },
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch FAQ questions
      const faqResponse = await fetch("/api/admin/faq-questions");
      if (faqResponse.ok) {
        const faqData = await faqResponse.json();
        setFaqQuestions(faqData.questions || []);
      }

      // Fetch session bookings
      const sessionResponse = await fetch("/api/admin/session-bookings");
      if (sessionResponse.ok) {
        const sessionData = await sessionResponse.json();
        setSessionBookings(sessionData.bookings || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResponse = (type: string, item: any) => {
    setSelectedItem({ type, item });
    form.reset({
      responseText: "",
      respondedBy: "Admin",
    });
    setDialogOpen(true);
  };

  const onSubmit = async (data: z.infer<typeof responseFormSchema>) => {
    if (!selectedItem) return;

    try {
      setSubmitting(true);

      const payload = {
        responseType: selectedItem.type,
        referenceId: selectedItem.item.id,
        responseText: data.responseText,
        respondedBy: data.respondedBy,
        // only include file name if you’re not actually uploading
        pdfFile: data.pdfFile?.[0]?.name || null,
      };

      const response = await fetch("/api/admin/responses/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok)
        throw new Error(result.message || "Failed to send response");

      toast({
        title: "Success!",
        description:
          "Response sent successfully. User has been notified via email.",
      });

      setDialogOpen(false);
      setSelectedItem(null);
      fetchData();
    } catch (error: any) {
      console.error("Error sending response:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to send response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "answered":
      case "completed":
        return "bg-green-100 text-green-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const pendingFAQs = faqQuestions.filter((q) => q.status === "pending");
  const pendingSessions = sessionBookings.filter(
    (s) => s.status === "pending" || s.status === "confirmed",
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <AstroTickHeader />
        <main className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-orange-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading admin panel...</p>
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

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <MessageSquare className="h-12 w-12 text-orange-600 mr-3" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                Admin Response Panel
              </h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Manage and respond to FAQ questions and session bookings. Send
              personalized responses with PDF attachments.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="text-center">
              <CardContent className="p-6">
                <MessageSquare className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600">
                  {pendingFAQs.length}
                </p>
                <p className="text-sm text-gray-600">Pending FAQs</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-600">
                  {pendingSessions.length}
                </p>
                <p className="text-sm text-gray-600">Pending Sessions</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">
                  {faqQuestions.filter((q) => q.status === "answered").length}
                </p>
                <p className="text-sm text-gray-600">Answered FAQs</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <Clock className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-amber-600">
                  {
                    sessionBookings.filter((s) => s.status === "completed")
                      .length
                  }
                </p>
                <p className="text-sm text-gray-600">Completed Sessions</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs for different sections */}
          <Tabs defaultValue="faq" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="faq">
                FAQ Questions ({pendingFAQs.length} pending)
              </TabsTrigger>
              <TabsTrigger value="sessions">
                Session Bookings ({pendingSessions.length} pending)
              </TabsTrigger>
            </TabsList>

            {/* FAQ Questions Tab */}
            <TabsContent value="faq" className="space-y-6">
              {pendingFAQs.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                      No Pending FAQ Questions
                    </h3>
                    <p className="text-gray-500">
                      All FAQ questions have been answered.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                pendingFAQs.map((faq) => (
                  <Card key={faq.id} className="shadow-lg border-blue-200">
                    <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center">
                          <MessageSquare className="h-5 w-5 mr-2" />
                          FAQ #{faq.id} - {faq.name}
                        </CardTitle>
                        <Badge className={getStatusColor(faq.status)}>
                          {faq.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-3">
                            User Information:
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center">
                              <Mail className="h-4 w-4 mr-2 text-gray-500" />
                              <span>{faq.email}</span>
                            </div>
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-2 text-gray-500" />
                              <span>
                                {faq.gender}, Born:{" "}
                                {new Date(faq.birthDate).toLocaleDateString(
                                  "en-IN",
                                )}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2 text-gray-500" />
                              <span>Birth Time: {faq.birthTime}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="ml-6 text-gray-600">
                                Place: {faq.birthPlace}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                              <span>
                                Submitted: {formatDate(faq.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-800 mb-3">
                            Questions:
                          </h4>
                          <div className="space-y-3">
                            <div className="bg-blue-50 p-3 rounded">
                              <p className="font-medium text-blue-800 mb-1">
                                Free Question:
                              </p>
                              <p className="text-gray-700 text-sm">
                                {faq.freeQuestion}
                              </p>
                            </div>

                            {faq.additionalQuestion1 && (
                              <div className="bg-purple-50 p-3 rounded">
                                <p className="font-medium text-purple-800 mb-1">
                                  Additional Question 1:
                                </p>
                                <p className="text-gray-700 text-sm">
                                  {faq.additionalQuestion1}
                                </p>
                              </div>
                            )}

                            {faq.additionalQuestion2 && (
                              <div className="bg-purple-50 p-3 rounded">
                                <p className="font-medium text-purple-800 mb-1">
                                  Additional Question 2:
                                </p>
                                <p className="text-gray-700 text-sm">
                                  {faq.additionalQuestion2}
                                </p>
                              </div>
                            )}
                          </div>

                          <Button
                            onClick={() => handleResponse("faq", faq)}
                            className="w-full mt-4 bg-gradient-to-r from-blue-500 to-indigo-500"
                          >
                            <Send className="h-4 w-4 mr-2" />
                            Send Response
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            {/* Session Bookings Tab */}
            <TabsContent value="sessions" className="space-y-6">
              {pendingSessions.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                      No Pending Sessions
                    </h3>
                    <p className="text-gray-500">
                      All sessions have been completed.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                pendingSessions.map((session) => (
                  <Card
                    key={session.id}
                    className="shadow-lg border-purple-200"
                  >
                    <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center">
                          <Calendar className="h-5 w-5 mr-2" />
                          Session #{session.id} - {session.name}
                        </CardTitle>
                        <Badge className={getStatusColor(session.status)}>
                          {session.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-3">
                            User Information:
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center">
                              <Mail className="h-4 w-4 mr-2 text-gray-500" />
                              <span>{session.email}</span>
                            </div>
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 mr-2 text-gray-500" />
                              <span>{session.phone}</span>
                            </div>
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-2 text-gray-500" />
                              <span>
                                {session.gender}, Born:{" "}
                                {new Date(session.birthDate).toLocaleDateString(
                                  "en-IN",
                                )}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2 text-gray-500" />
                              <span>Birth Time: {session.birthTime}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="ml-6 text-gray-600">
                                Place: {session.birthPlace}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-800 mb-3">
                            Session Details:
                          </h4>
                          <div className="space-y-3">
                            <div className="bg-purple-50 p-3 rounded">
                              <div className="flex items-center mb-2">
                                <Calendar className="h-4 w-4 mr-2 text-purple-600" />
                                <span className="font-medium text-purple-800">
                                  {new Date(
                                    session.bookingDate,
                                  ).toLocaleDateString("en-IN", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-2 text-purple-600" />
                                <span className="text-purple-700">
                                  {session.bookingTime}
                                </span>
                              </div>
                            </div>

                            <div className="text-sm text-gray-600">
                              <span>
                                Booked on: {formatDate(session.createdAt)}
                              </span>
                            </div>
                          </div>

                          <Button
                            onClick={() => handleResponse("session", session)}
                            className="w-full mt-4 bg-gradient-to-r from-purple-500 to-indigo-500"
                          >
                            <Send className="h-4 w-4 mr-2" />
                            Send Report
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>

          {/* Response Dialog */}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="sm:max-w-[800px]">
              <DialogHeader>
                <DialogTitle>
                  Send Response -{" "}
                  {selectedItem?.type === "faq" ? "FAQ" : "Session"} #
                  {selectedItem?.item?.id}
                </DialogTitle>
                <DialogDescription>
                  Send a personalized response to {selectedItem?.item?.name} (
                  {selectedItem?.item?.email}). You can also attach a PDF
                  report.
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="respondedBy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Responded By *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="responseText"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Response Text *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter your detailed response here..."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="pdfFile"
                    render={({ field: { onChange, ...field } }) => (
                      <FormItem>
                        <FormLabel>PDF Report (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => onChange(e.target.files)}
                            {...field}
                          />
                        </FormControl>
                        <p className="text-sm text-gray-500">
                          Upload a detailed PDF report for the user
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setDialogOpen(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="flex-1"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Response
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </main>

      <Footer />
    </div>
  );
}
