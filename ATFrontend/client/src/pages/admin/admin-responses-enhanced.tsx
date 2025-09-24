import { useState, useEffect, useMemo, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "src/lib/queryClient";
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
  UserPlus,
  Users,
  CreditCard,
  RefreshCw,
} from "lucide-react";

const responseFormSchema = z
  .object({
    freeQuestionResponse: z.string().optional(),
    paidQuestion1Response: z.string().optional(),
    paidQuestion2Response: z.string().optional(),
    pdfFile: z.any().optional(),
    respondedBy: z.string().min(2, "Responder name is required"),
  })
  .refine(
    (data) => {
      return (
        data.freeQuestionResponse ||
        data.paidQuestion1Response ||
        data.paidQuestion2Response
      );
    },
    {
      message: "At least one response is required",
      path: ["freeQuestionResponse"],
    },
  );

interface FAQQuestion {
  id: number;
  name: string;
  email: string;
  phone?: string;
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
  assignedAstrologerId?: number;
  assignedAstrologerName?: string;
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

export default function AdminResponsesEnhanced() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedItem, setSelectedItem] = useState<{
    type: string;
    item: any;
  } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<FAQQuestion | null>(
    null,
  );
  const [resendingPayment, setResendingPayment] = useState<number | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Local state for instant UI updates
  const [localPendingQuestions, setLocalPendingQuestions] = useState<
    FAQQuestion[]
  >([]);
  const [localAnsweredQuestions, setLocalAnsweredQuestions] = useState<
    FAQQuestion[]
  >([]);
  const [isLocalStateActive, setIsLocalStateActive] = useState(false);

  const form = useForm<z.infer<typeof responseFormSchema>>({
    resolver: zodResolver(responseFormSchema),
    defaultValues: {
      freeQuestionResponse: "",
      paidQuestion1Response: "",
      paidQuestion2Response: "",
      respondedBy: "",
    },
  });

  // Separate queries for pending and answered FAQ questions
  const {
    data: pendingFaqData,
    isLoading: isPendingFaqLoading,
    error: pendingFaqError,
    refetch: refetchPendingFaqData,
  } = useQuery<{ success: boolean; questions: FAQQuestion[] }>({
    queryKey: ["/api/admin/faq-questions?status=pending", refreshKey],
    staleTime: 0,
    gcTime: 0,
    retry: 2,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchInterval: 30000,
    refetchIntervalInBackground: true,
    networkMode: "online",
    notifyOnChangeProps: ["data", "error", "isLoading"],
  });

  const {
    data: answeredFaqData,
    isLoading: isAnsweredFaqLoading,
    error: answeredFaqError,
    refetch: refetchAnsweredFaqData,
  } = useQuery<{ success: boolean; questions: FAQQuestion[] }>({
    queryKey: ["/api/admin/faq-questions?status=answered", refreshKey],
    staleTime: 0,
    gcTime: 0,
    retry: 2,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchInterval: 30000,
    refetchIntervalInBackground: true,
    networkMode: "online",
    notifyOnChangeProps: ["data", "error", "isLoading"],
  });

  // Session bookings query
  const {
    data: sessionData,
    isLoading: isSessionLoading,
    error: sessionError,
  } = useQuery<{ success: boolean; bookings: SessionBooking[] }>({
    queryKey: ["/api/admin/session-bookings"],
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchInterval: false,
    refetchIntervalInBackground: false,
    networkMode: "online",
  });

  // Fetch astrologers
  const { data: astrologers = [] } = useQuery<any[]>({
    queryKey: ["/api/astrologers"],
    staleTime: 15 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // Fetch admin responses
  const { data: responsesData } = useQuery<{
    success: boolean;
    responses: any[];
  }>({
    queryKey: ["/api/admin/responses/all"],
    staleTime: 1 * 60 * 1000,
    gcTime: 8 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: 2,
    refetchInterval: false,
    networkMode: "online",
  });

  const loading =
    isPendingFaqLoading || isAnsweredFaqLoading || isSessionLoading;

  // Update local state when server data changes
  useEffect(() => {
    if (!isLocalStateActive) {
      if (pendingFaqData?.questions) {
        setLocalPendingQuestions(pendingFaqData.questions);
      }
      if (answeredFaqData?.questions) {
        setLocalAnsweredQuestions(answeredFaqData.questions);
      }
    }
  }, [pendingFaqData, answeredFaqData, isLocalStateActive]);

  // Enhanced data processing with local state support
  const processedData = useMemo(() => {
    const pendingFaqQuestions = pendingFaqData?.questions || [];
    const answeredFaqQuestions = answeredFaqData?.questions || [];
    const allSessionBookings = sessionData?.bookings || [];

    // Use local state for optimistic updates, otherwise use API data
    const finalPendingQuestions =
      isLocalStateActive && localPendingQuestions.length > 0
        ? localPendingQuestions
        : pendingFaqQuestions;

    const finalAnsweredQuestions =
      isLocalStateActive && localAnsweredQuestions.length > 0
        ? localAnsweredQuestions
        : answeredFaqQuestions;

    console.log("🔍 [PROCESSED DATA] FAQ Questions:", {
      pendingFromAPI: pendingFaqQuestions.length,
      answeredFromAPI: answeredFaqQuestions.length,
      finalPendingCount: finalPendingQuestions.length,
      finalAnsweredCount: finalAnsweredQuestions.length,
      isLocalStateActive,
      localPendingCount: localPendingQuestions.length,
      localAnsweredCount: localAnsweredQuestions.length,
    });

    return {
      pendingFaqQuestions: finalPendingQuestions,
      answeredFaqQuestions: finalAnsweredQuestions,
      pendingSessionBookings: allSessionBookings.filter(
        (s: SessionBooking) => s.status === "pending",
      ),
      answeredSessionBookings: allSessionBookings.filter(
        (s: SessionBooking) => s.status === "completed",
      ),
    };
  }, [
    pendingFaqData,
    answeredFaqData,
    localPendingQuestions,
    localAnsweredQuestions,
    isLocalStateActive,
    sessionData,
  ]);

  const {
    pendingFaqQuestions,
    answeredFaqQuestions,
    pendingSessionBookings,
    answeredSessionBookings,
  } = processedData;

  // Helper function to get response for a question
  const getResponseForQuestion = (questionId: number) => {
    const responses = responsesData?.responses || [];
    
    console.log("🔍 [GET RESPONSE] Looking for response for question ID:", questionId);
    console.log("🔍 [GET RESPONSE] Available responses:", responses.length);
    console.log("🔍 [GET RESPONSE] Response data structure:", responses.slice(0, 2));
    
    const foundResponse = responses.find(
      (response: any) =>
        response.responseType === "faq" && response.referenceId === questionId,
    );
    
    console.log("🔍 [GET RESPONSE] Found response:", foundResponse);
    
    return foundResponse;
  };

  // Optimistic update helper
  const updateQuestionStatusOptimistically = (
    questionId: number,
    newStatus: string,
  ) => {
    setIsLocalStateActive(true);

    setLocalPendingQuestions((prev) => {
      const questionToMove = prev.find((q) => q.id === questionId);
      const remainingPending = prev.filter((q) => q.id !== questionId);

      if (questionToMove && newStatus === "answered") {
        // Move to answered
        const updatedQuestion = {
          ...questionToMove,
          status: "answered",
          answeredAt: new Date().toISOString(),
          answeredBy: "Admin",
        };

        setLocalAnsweredQuestions((prevAnswered) => {
          // Remove any existing duplicate and add updated question
          const withoutDuplicate = prevAnswered.filter(
            (q) => q.id !== questionId,
          );
          return [updatedQuestion, ...withoutDuplicate];
        });
      }

      return remainingPending;
    });
  };

  // Refresh function
  const refreshData = useCallback(() => {
    console.log("🔄 Refreshing admin dashboard data...");
    setRefreshKey((prev) => prev + 1);
    setIsLocalStateActive(false);
    setLocalPendingQuestions([]);
    setLocalAnsweredQuestions([]);
    refetchPendingFaqData();
    refetchAnsweredFaqData();
    queryClient.invalidateQueries({
      queryKey: ["/api/admin/faq-questions?status=pending"],
    });
    queryClient.invalidateQueries({
      queryKey: ["/api/admin/faq-questions?status=answered"],
    });
  }, [refetchPendingFaqData, refetchAnsweredFaqData, queryClient]);

  // Mutation for submitting responses
  const submitResponseMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch("/api/admin/responses/create", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit response");
      }
      return response.json();
    },
    onSuccess: async (data, variables) => {
      const currentSelectedItem = selectedItem;

      toast({
        title: "Success!",
        description: "Response submitted and email sent successfully.",
      });

      // Apply optimistic update immediately
      if (currentSelectedItem?.type === "faq") {
        updateQuestionStatusOptimistically(
          currentSelectedItem.item.id,
          "answered",
        );
      }

      if (currentSelectedItem?.type === "session") {
        queryClient.setQueryData(
          ["/api/admin/session-bookings"],
          (old: any) => {
            if (!old?.bookings) return old;

            return {
              ...old,
              bookings: old.bookings.map((b: any) =>
                b.id === currentSelectedItem.item.id
                  ? { ...b, status: "completed" }
                  : b,
              ),
            };
          },
        );
      }

      // Invalidate both FAQ query caches
      queryClient.invalidateQueries({
        queryKey: ["/api/admin/faq-questions?status=pending"],
      });
      queryClient.invalidateQueries({
        queryKey: ["/api/admin/faq-questions?status=answered"],
      });

      // Add real response to responses cache using server data
      if (data.response) {
        queryClient.setQueryData(["/api/admin/responses/all"], (old: any) => {
          if (!old?.responses) return { success: true, responses: [] };

          return {
            ...old,
            responses: [data.response, ...old.responses],
          };
        });
      }

      // Also invalidate responses cache to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ["/api/admin/responses/all"] });

      // Close dialog
      form.reset();
      setDialogOpen(false);
      setSelectedItem(null);

      // Refresh data after server processing
      setTimeout(() => {
        refreshData();
      }, 1500);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description:
          error.message || "Failed to submit response. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Mutation for assigning questions to astrologers
  const assignAstrologerMutation = useMutation({
    mutationFn: async ({
      questionId,
      astrologerId,
    }: {
      questionId: number;
      astrologerId: number;
    }) => {
      const response = await apiRequest(
        "POST",
        "/api/admin/assign-astrologer",
        {
          questionId,
          astrologerId,
        },
      );
      return response;
    },
    onSuccess: async (data, variables) => {
      toast({
        title: "Success!",
        description: "Question assigned to astrologer successfully.",
      });

      const assignedAstrologer = astrologers.find(
        (a: any) => a.id === variables.astrologerId,
      );

      // Invalidate both pending and answered query caches
      queryClient.invalidateQueries({
        queryKey: ["/api/admin/faq-questions?status=pending"],
      });
      queryClient.invalidateQueries({
        queryKey: ["/api/admin/faq-questions?status=answered"],
      });

      setAssignDialogOpen(false);
      setSelectedQuestion(null);

      setTimeout(() => {
        refreshData();
      }, 500);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error.message || "Failed to assign question to astrologer.",
        variant: "destructive",
      });
    },
  });

  // Mutation for resending payment link
  const resendPaymentMutation = useMutation({
    mutationFn: async (faqId: number) => {
      const response = await apiRequest("POST", "/api/faq/resend-payment", {
        faqId,
      });
      return response;
    },
    onSuccess: (data, faqId) => {
      toast({
        title: "Payment Link Generated!",
        description: `Email sent to user. Payment URL: ${data.paymentUrl || "Check console for details"}`,
        duration: 8000,
      });

      if (data.paymentUrl) {
        const shouldOpenLink = window.confirm(
          `Payment link has been sent to the user via email.\n\nPayment URL: ${data.paymentUrl}\n\nWould you like to open this link for testing?`,
        );

        if (shouldOpenLink) {
          window.open(data.paymentUrl, "_blank");
        }
      }

      setResendingPayment(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description:
          error.message || "Failed to send payment link. Please try again.",
        variant: "destructive",
      });
      setResendingPayment(null);
    },
  });

  const handleResendPayment = useCallback(
    (faqId: number) => {
      setResendingPayment(faqId);
      resendPaymentMutation.mutate(faqId);
    },
    [resendPaymentMutation],
  );

  const testPaymentLink = useCallback(async (faqId: number) => {
    try {
      const response = await fetch(`/api/admin/faq-questions`);
      const data = await response.json();

      if (data.success) {
        const faq = data.questions.find((q: any) => q.id === faqId);
        if (faq && faq.paymentTxnId) {
          const testUrl = `/api/faq/payment-redirect?txnid=${faq.paymentTxnId}`;
          window.open(testUrl, "_blank");
        } else {
          alert(
            "No payment transaction ID found for this FAQ. Please resend the payment link first.",
          );
        }
      }
    } catch (error) {
      console.error("Error testing payment link:", error);
      alert("Error testing payment link. Check console for details.");
    }
  }, []);

  const handleResponse = useCallback(
    (type: string, item: any) => {
      setSelectedItem({ type, item });
      form.reset({
        freeQuestionResponse: "",
        paidQuestion1Response: "",
        paidQuestion2Response: "",
        respondedBy: "Admin",
      });
      setDialogOpen(true);
    },
    [form],
  );

  const handleAssign = useCallback((question: FAQQuestion) => {
    setSelectedQuestion(question);
    setAssignDialogOpen(true);
  }, []);

  const assignToAstrologer = (astrologerId: number) => {
    if (!selectedQuestion) return;
    assignAstrologerMutation.mutate({
      questionId: selectedQuestion.id,
      astrologerId,
    });
  };

  const onSubmit = async (data: z.infer<typeof responseFormSchema>) => {
    if (!selectedItem) return;

    const formData = new FormData();
    formData.append("responseType", selectedItem.type);
    formData.append("referenceId", selectedItem.item.id.toString());
    formData.append("respondedBy", data.respondedBy);

    if (data.freeQuestionResponse) {
      formData.append("freeQuestionResponse", data.freeQuestionResponse);
    }
    if (data.paidQuestion1Response) {
      formData.append("paidQuestion1Response", data.paidQuestion1Response);
    }
    if (data.paidQuestion2Response) {
      formData.append("paidQuestion2Response", data.paidQuestion2Response);
    }

    if (data.pdfFile && data.pdfFile[0]) {
      formData.append("pdfFile", data.pdfFile[0]);
    }

    setSubmitting(true);
    try {
      await submitResponseMutation.mutateAsync(formData);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
        <AstroTickHeader />
        <div className="flex justify-center items-center h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="ml-2">Loading admin data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      {/* <AstroTickHeader /> */}

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard - Enhanced Responses
            </h1>
            <Button
              onClick={refreshData}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh Data
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Pending FAQ
                    </p>
                    <p className="text-2xl font-bold">
                      {pendingFaqQuestions.length}
                    </p>
                  </div>
                  <MessageSquare className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Answered FAQ
                    </p>
                    <p className="text-2xl font-bold">
                      {answeredFaqQuestions.length}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Pending Sessions
                    </p>
                    <p className="text-2xl font-bold">
                      {pendingSessionBookings.length}
                    </p>
                  </div>
                  <Calendar className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Completed Sessions
                    </p>
                    <p className="text-2xl font-bold">
                      {answeredSessionBookings.length}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="pending-faq" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="pending-faq">
                Pending Questions ({pendingFaqQuestions.length})
              </TabsTrigger>
              <TabsTrigger value="answered-faq">
                Answered Questions ({answeredFaqQuestions.length})
              </TabsTrigger>
              <TabsTrigger value="pending-sessions">
                Pending Sessions ({pendingSessionBookings.length})
              </TabsTrigger>
              <TabsTrigger value="completed-sessions">
                Completed Sessions ({answeredSessionBookings.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending-faq" className="space-y-4">
              <div className="space-y-4">
                {pendingFaqQuestions.map((question) => (
                  <Card key={question.id} className="border border-orange-200">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <User className="w-5 h-5 text-orange-500" />
                            {question.name}
                            <Badge variant="secondary">{question.gender}</Badge>
                          </CardTitle>
                          <div className="text-sm text-muted-foreground mt-1">
                            <div className="flex items-center gap-4">
                              <span className="flex items-center gap-1">
                                <Mail className="w-4 h-4" />
                                {question.email}
                              </span>
                              {question.phone && (
                                <span className="flex items-center gap-1">
                                  <Phone className="w-4 h-4" />
                                  {question.phone}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {new Date(
                                  question.createdAt,
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleResponse("faq", question)}
                          >
                            <Send className="w-4 h-4 mr-2" />
                            Respond
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAssign(question)}
                          >
                            <UserPlus className="w-4 h-4 mr-2" />
                            Assign
                          </Button>
                          {question.paymentStatus === "pending" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleResendPayment(question.id)}
                                disabled={resendingPayment === question.id}
                              >
                                {resendingPayment === question.id ? (
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                  <CreditCard className="w-4 h-4 mr-2" />
                                )}
                                Send Payment Link
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => testPaymentLink(question.id)}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                Test Link
                              </Button>
                            </>
                          )}
                          {question.paymentStatus === "failed" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleResendPayment(question.id)}
                              disabled={resendingPayment === question.id}
                            >
                              {resendingPayment === question.id ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              ) : (
                                <CreditCard className="w-4 h-4 mr-2" />
                              )}
                              Send Payment Link
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium text-sm text-gray-600 mb-1">
                            Birth Details
                          </h4>
                          <p className="text-sm">
                            {question.birthDate} at {question.birthTime} in{" "}
                            {question.birthPlace}
                          </p>
                        </div>

                        <div>
                          <h4 className="font-medium text-sm text-gray-600 mb-1">
                            Free Question
                          </h4>
                          <p className="text-sm bg-gray-50 p-3 rounded-lg">
                            {question.freeQuestion}
                          </p>
                        </div>

                        {question.additionalQuestion1 && (
                          <div>
                            <h4 className="font-medium text-sm text-gray-600 mb-1">
                              Additional Question 1
                            </h4>
                            <p className="text-sm bg-blue-50 p-3 rounded-lg">
                              {question.additionalQuestion1}
                            </p>
                          </div>
                        )}

                        {question.additionalQuestion2 && (
                          <div>
                            <h4 className="font-medium text-sm text-gray-600 mb-1">
                              Additional Question 2
                            </h4>
                            <p className="text-sm bg-blue-50 p-3 rounded-lg">
                              {question.additionalQuestion2}
                            </p>
                          </div>
                        )}

                        {question.assignedAstrologerName && (
                          <div>
                            <Badge variant="outline" className="text-xs">
                              Assigned to: {question.assignedAstrologerName}
                            </Badge>
                          </div>
                        )}

                        {question.paymentStatus && (
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                question.paymentStatus === "success"
                                  ? "default"
                                  : question.paymentStatus === "pending"
                                    ? "secondary"
                                    : "destructive"
                              }
                            >
                              Payment: {question.paymentStatus}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {pendingFaqQuestions.length === 0 && (
                  <Card>
                    <CardContent className="py-8 text-center">
                      <AlertCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-500">No pending FAQ questions</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="answered-faq" className="space-y-4">
              <div className="space-y-4">
                {answeredFaqQuestions.map((question) => {
                  const response = getResponseForQuestion(question.id);
                  return (
                    <Card key={question.id} className="border border-green-200">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg flex items-center gap-2">
                              <CheckCircle className="w-5 h-5 text-green-500" />
                              {question.name}
                              <Badge variant="default">Answered</Badge>
                            </CardTitle>
                            <div className="text-sm text-muted-foreground mt-1">
                              <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1">
                                  <Mail className="w-4 h-4" />
                                  {question.email}
                                </span>
                                {question.phone && (
                                  <span className="flex items-center gap-1">
                                    <Phone className="w-4 h-4" />
                                    {question.phone}
                                  </span>
                                )}
                                <span className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  Answered:{" "}
                                  {new Date(
                                    question.createdAt,
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Badge variant="outline" className="bg-green-50">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Complete
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-medium text-sm text-gray-600 mb-1">
                              Free Question
                            </h4>
                            <p className="text-sm bg-gray-50 p-3 rounded-lg">
                              {question.freeQuestion}
                            </p>
                          </div>

                          {question.additionalQuestion1 && (
                            <div>
                              <h4 className="font-medium text-sm text-gray-600 mb-1">
                                Additional Question 1
                              </h4>
                              <p className="text-sm bg-blue-50 p-3 rounded-lg">
                                {question.additionalQuestion1}
                              </p>
                            </div>
                          )}

                          {question.additionalQuestion2 && (
                            <div>
                              <h4 className="font-medium text-sm text-gray-600 mb-1">
                                Additional Question 2
                              </h4>
                              <p className="text-sm bg-blue-50 p-3 rounded-lg">
                                {question.additionalQuestion2}
                              </p>
                            </div>
                          )}

                          {response && (
                            <div className="bg-green-50 p-4 rounded-lg">
                              <h4 className="font-medium text-sm text-green-800 mb-2">
                                Admin Response
                              </h4>

                              {response.freeQuestionResponse && (
                                <div className="mb-3">
                                  <h5 className="font-medium text-xs text-green-700 mb-1">
                                    Free Question Response:
                                  </h5>
                                  <p className="text-sm text-green-800 bg-white p-3 rounded border border-green-200">
                                    {response.freeQuestionResponse}
                                  </p>
                                </div>
                              )}

                              {response.paidQuestion1Response && (
                                <div className="mb-3">
                                  <h5 className="font-medium text-xs text-green-700 mb-1">
                                    Additional Question 1 Response:
                                  </h5>
                                  <p className="text-sm text-green-800 bg-white p-3 rounded border border-green-200">
                                    {response.paidQuestion1Response}
                                  </p>
                                </div>
                              )}

                              {response.paidQuestion2Response && (
                                <div className="mb-3">
                                  <h5 className="font-medium text-xs text-green-700 mb-1">
                                    Additional Question 2 Response:
                                  </h5>
                                  <p className="text-sm text-green-800 bg-white p-3 rounded border border-green-200">
                                    {response.paidQuestion2Response}
                                  </p>
                                </div>
                              )}

                              <div className="text-xs text-green-600 mt-3 pt-2 border-t border-green-200">
                                Responded by: {response.respondedBy} •{" "}
                                {new Date(response.createdAt).toLocaleString()}
                                {response.emailSent && " • Email sent ✅"}
                                {response.pdfAttached && " • PDF attached 📎"}
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}

                {answeredFaqQuestions.length === 0 && (
                  <Card>
                    <CardContent className="py-8 text-center">
                      <CheckCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-500">No answered questions yet</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="pending-sessions" className="space-y-4">
              <div className="space-y-4">
                {pendingSessionBookings.map((booking) => (
                  <Card key={booking.id} className="border border-blue-200">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-blue-500" />
                            {booking.name}
                            <Badge variant="secondary">Session</Badge>
                          </CardTitle>
                          <div className="text-sm text-muted-foreground mt-1">
                            <div className="flex items-center gap-4">
                              <span className="flex items-center gap-1">
                                <Mail className="w-4 h-4" />
                                {booking.email}
                              </span>
                              <span className="flex items-center gap-1">
                                <Phone className="w-4 h-4" />
                                {booking.phone}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {new Date(
                                  booking.createdAt,
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleResponse("session", booking)}
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Complete
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium text-sm text-gray-600 mb-1">
                            Session Details
                          </h4>
                          <div className="text-sm bg-blue-50 p-3 rounded-lg">
                            <p>
                              <strong>Date:</strong> {booking.bookingDate}
                            </p>
                            <p>
                              <strong>Time:</strong> {booking.bookingTime}
                            </p>
                            <p>
                              <strong>Birth:</strong> {booking.birthDate} at{" "}
                              {booking.birthTime}, {booking.birthPlace}
                            </p>
                          </div>
                        </div>

                        {booking.paymentStatus && (
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                booking.paymentStatus === "success"
                                  ? "default"
                                  : "destructive"
                              }
                            >
                              Payment: {booking.paymentStatus}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {pendingSessionBookings.length === 0 && (
                  <Card>
                    <CardContent className="py-8 text-center">
                      <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-500">
                        No pending session bookings
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="completed-sessions" className="space-y-4">
              <div className="space-y-4">
                {answeredSessionBookings.map((booking) => (
                  <Card key={booking.id} className="border border-purple-200">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-purple-500" />
                            {booking.name}
                            <Badge variant="default">Completed</Badge>
                          </CardTitle>
                          <div className="text-sm text-muted-foreground mt-1">
                            <div className="flex items-center gap-4">
                              <span className="flex items-center gap-1">
                                <Mail className="w-4 h-4" />
                                {booking.email}
                              </span>
                              <span className="flex items-center gap-1">
                                <Phone className="w-4 h-4" />
                                {booking.phone}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-purple-50">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Done
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <p className="text-sm">
                          <strong>Session Date:</strong> {booking.bookingDate}
                        </p>
                        <p className="text-sm">
                          <strong>Session Time:</strong> {booking.bookingTime}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {answeredSessionBookings.length === 0 && (
                  <Card>
                    <CardContent className="py-8 text-center">
                      <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-500">No completed sessions yet</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Response Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Send className="w-5 h-5" />
              Submit Response
            </DialogTitle>
            <DialogDescription>
              {selectedItem?.type === "faq"
                ? `Responding to ${selectedItem.item.name}'s question`
                : `Completing session for ${selectedItem?.item.name}`}
            </DialogDescription>
          </DialogHeader>

          {selectedItem && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {selectedItem.type === "faq" && (
                  <>
                    {selectedItem.item.freeQuestion && (
                      <FormField
                        control={form.control}
                        name="freeQuestionResponse"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <MessageSquare className="w-4 h-4" />
                              Free Question Response
                            </FormLabel>
                            <div className="bg-gray-50 p-3 rounded mb-2">
                              <p className="text-sm font-medium">Question:</p>
                              <p className="text-sm text-gray-600">
                                {selectedItem.item.freeQuestion}
                              </p>
                            </div>
                            <FormControl>
                              <Textarea
                                placeholder="Enter your response to the free question..."
                                {...field}
                                rows={4}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    {selectedItem.item.additionalQuestion1 && (
                      <FormField
                        control={form.control}
                        name="paidQuestion1Response"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <MessageSquare className="w-4 h-4" />
                              Additional Question 1 Response
                            </FormLabel>
                            <div className="bg-blue-50 p-3 rounded mb-2">
                              <p className="text-sm font-medium">Question:</p>
                              <p className="text-sm text-gray-600">
                                {selectedItem.item.additionalQuestion1}
                              </p>
                            </div>
                            <FormControl>
                              <Textarea
                                placeholder="Enter your response to additional question 1..."
                                {...field}
                                rows={4}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    {selectedItem.item.additionalQuestion2 && (
                      <FormField
                        control={form.control}
                        name="paidQuestion2Response"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <MessageSquare className="w-4 h-4" />
                              Additional Question 2 Response
                            </FormLabel>
                            <div className="bg-blue-50 p-3 rounded mb-2">
                              <p className="text-sm font-medium">Question:</p>
                              <p className="text-sm text-gray-600">
                                {selectedItem.item.additionalQuestion2}
                              </p>
                            </div>
                            <FormControl>
                              <Textarea
                                placeholder="Enter your response to additional question 2..."
                                {...field}
                                rows={4}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </>
                )}

                <FormField
                  control={form.control}
                  name="pdfFile"
                  render={({ field: { onChange, value, ...field } }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Attach PDF Report (Optional)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept=".pdf"
                          onChange={(e) => onChange(e.target.files)}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="respondedBy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Responded By</FormLabel>
                      <FormControl>
                        <Input placeholder="Your name or role" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Submit Response
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>

      {/* Assign Astrologer Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Question to Astrologer</DialogTitle>
            <DialogDescription>
              Select an astrologer to assign this question to.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {astrologers.map((astrologer) => (
              <div
                key={astrologer.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
              >
                <div>
                  <p className="font-medium">{astrologer.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {astrologer.specialization}
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => assignToAstrologer(astrologer.id)}
                  disabled={assignAstrologerMutation.isPending}
                >
                  {assignAstrologerMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Assign"
                  )}
                </Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
