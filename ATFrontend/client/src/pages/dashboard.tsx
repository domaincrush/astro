import { useQuery } from "@tanstack/react-query";
import {
  MessageCircle,
  Clock,
  Star,
  Calendar,
  ArrowRight,
  Play,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { Button } from "src/components/ui/button";
import { Badge } from "src/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "src/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "src/components/ui/tabs";
import { Link } from "wouter";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";
import { useAuth } from "src/hooks/useAuth";

interface ConsultationData {
  id: number;
  astrologerId: number;
  status: string;
  topic: string;
  duration: number;
  cost: number;
  rating?: number;
  review?: string;
  createdAt: string;
  endedAt?: string;
  queuePosition?: number;
  estimatedWaitTime?: number;
  astrologer: {
    id: number;
    name: string;
    email: string;
    specializations: string[];
    experience: number;
    rating: number;
    image?: string;
    isOnline: boolean;
  };
}

export default function Dashboard() {
  const { user } = useAuth();

  // Queries
  const { data: consultations = [], isLoading: consultationsLoading } =
    useQuery<ConsultationData[]>({
      queryKey: ["/api/consultations/user"],
      enabled: !!user?.id,
    });

  const { data: userQuestions = [] } = useQuery<any[]>({
    queryKey: ["/api/questions/user"],
  });

  const { data: userAppointments = [] } = useQuery<any[]>({
    queryKey: ["/api/appointments/user"],
  });

  // Derived Data
  const activeConsultations = consultations.filter(
    (c) => c.status === "active" || c.status === "waiting",
  );
  const chatHistory = consultations.filter((c) => c.status === "completed");

  const answeredReports = userQuestions.filter((q: any) => q.answer).length;
  const upcomingSessions = userAppointments.filter(
    (a: any) => new Date(a.bookingDate) >= new Date(),
  ).length;
  const freeQuestionsLeft = Math.max(0, 3 - 0); // Free questions tracking removed

  const recentAnswered = userQuestions.filter((q: any) => q.answer).slice(0, 2);
  const upcomingAppointments = userAppointments
    .filter((a: any) => new Date(a.bookingDate) >= new Date())
    .slice(0, 2);

  // Utility functions
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "queued":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatWaitTime = (minutes?: number) => {
    if (!minutes) return "";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <AstroTickHeader />
      <div className="container mx-auto px-4 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h2
            className="text-3xl font-bold text-foreground mb-2"
            data-testid="text-welcome"
          >
            Welcome back, {user?.fullName || "User"}
          </h2>
          <p className="text-muted-foreground">
            Here's your cosmic overview and recent activity
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="relative star-pattern">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Questions Asked
                  </p>
                  <p
                    className="text-2xl font-bold text-foreground"
                    data-testid="text-questions-asked"
                  >
                    {userQuestions.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <i className="fas fa-question text-secondary text-xl"></i>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative star-pattern">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Answered Reports
                  </p>
                  <p
                    className="text-2xl font-bold text-foreground"
                    data-testid="text-answered-reports"
                  >
                    {answeredReports}
                  </p>
                </div>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <i className="fas fa-file-alt text-accent text-xl"></i>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative star-pattern">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Upcoming Sessions
                  </p>
                  <p
                    className="text-2xl font-bold text-foreground"
                    data-testid="text-upcoming-sessions"
                  >
                    {upcomingSessions}
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <i className="fas fa-calendar text-primary text-xl"></i>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative star-pattern">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Free Questions Left
                  </p>
                  <p
                    className="text-2xl font-bold text-foreground"
                    data-testid="text-free-questions-left"
                  >
                    {freeQuestionsLeft}
                  </p>
                </div>
                <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center">
                  <i className="fas fa-gift text-destructive text-xl"></i>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs: Active Consultations & Chat History */}
        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="active" className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" /> Active Chats
              {activeConsultations.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeConsultations.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Chat History
            </TabsTrigger>
          </TabsList>

          {/* Active Consultations */}
          <TabsContent value="active" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" /> Active Consultations
                </CardTitle>
              </CardHeader>
              <CardContent>
                {consultationsLoading ? (
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <div
                        key={i}
                        className="animate-pulse flex items-center space-x-4"
                      >
                        <div className="rounded-full bg-gray-200 h-12 w-12"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : activeConsultations.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No active consultations</p>
                    <Link href="/astrologers">
                      <Button className="mt-4">
                        Start New Consultation{" "}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                ) : (
                  activeConsultations.map((consultation) => (
                    <Card
                      key={consultation.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <Avatar className="h-12 w-12">
                              <AvatarImage
                                src={consultation.astrologer.image}
                                alt={consultation.astrologer.name}
                              />
                              <AvatarFallback>
                                {consultation.astrologer.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <h3 className="font-semibold">
                                {consultation.astrologer.name}
                              </h3>
                              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <div className="flex items-center">
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" />
                                  <span>
                                    {consultation.astrologer.rating?.toFixed(
                                      1,
                                    ) || "N/A"}
                                  </span>
                                </div>
                                <span>•</span>
                                <span>
                                  {consultation.astrologer.experience}+ years
                                </span>
                              </div>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge
                                  className={getStatusColor(
                                    consultation.status,
                                  )}
                                >
                                  {consultation.status === "active"
                                    ? "Chat Active"
                                    : `Queue ${consultation.queuePosition || "-"}`}
                                </Badge>
                                {consultation.status === "queued" &&
                                  consultation.estimatedWaitTime && (
                                    <Badge variant="outline">
                                      <Clock className="w-3 h-3 mr-1" />~
                                      {formatWaitTime(
                                        consultation.estimatedWaitTime,
                                      )}{" "}
                                      wait
                                    </Badge>
                                  )}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            <div className="text-sm text-muted-foreground">
                              {formatDate(consultation.createdAt)}
                            </div>
                            <Link
                              href={`/chat?consultation=${consultation.id}`}
                            >
                              <Button
                                size="sm"
                                variant={
                                  consultation.status === "active"
                                    ? "default"
                                    : "outline"
                                }
                              >
                                {consultation.status === "active" ? (
                                  <>
                                    <Play className="w-4 h-4 mr-1" />
                                    Continue Chat
                                  </>
                                ) : (
                                  <>
                                    <MessageCircle className="w-4 h-4 mr-1" />
                                    View Status
                                  </>
                                )}
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Chat History */}
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" /> Chat History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {consultationsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="animate-pulse flex items-center space-x-4"
                      >
                        <div className="rounded-full bg-gray-200 h-12 w-12"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : chatHistory.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No chat history yet</p>
                    <Link href="/astrologers">
                      <Button className="mt-4">
                        Start Your First Consultation{" "}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                ) : (
                  chatHistory.map((consultation) => (
                    <Card
                      key={consultation.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <Avatar className="h-12 w-12">
                              <AvatarImage
                                src={consultation.astrologer.image}
                                alt={consultation.astrologer.name}
                              />
                              <AvatarFallback>
                                {consultation.astrologer.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <h3 className="font-semibold">
                                {consultation.astrologer.name}
                              </h3>
                              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <span>{consultation.topic}</span>
                                <span>•</span>
                                <span>
                                  {formatDuration(consultation.duration)}
                                </span>
                                <span>•</span>
                                <span>
                                  ₹{(consultation.cost / 100).toFixed(0)}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge
                                  className={getStatusColor(
                                    consultation.status,
                                  )}
                                >
                                  {consultation.status}
                                </Badge>
                                {consultation.rating && (
                                  <div className="flex items-center">
                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" />
                                    <span className="text-sm">
                                      {consultation.rating}/5
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            <div className="text-sm text-muted-foreground">
                              {formatDate(consultation.createdAt)}
                            </div>
                            {consultation.endedAt && (
                              <div className="text-xs text-muted-foreground">
                                Ended: {formatDate(consultation.endedAt)}
                              </div>
                            )}
                            {consultation.status === "completed" &&
                              !consultation.rating && (
                                <Button size="sm" variant="outline">
                                  Rate Session
                                </Button>
                              )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Recent Reports & Upcoming Appointments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {/* Recent Reports */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <i className="fas fa-clock text-secondary mr-2"></i> Recent
                Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAnswered.length > 0 ? (
                  recentAnswered.map((q: any) => (
                    <div key={q.id} className="border-l-4 border-accent pl-4">
                      <h4
                        className="font-medium text-foreground"
                        data-testid={`text-recent-question-${q.id}`}
                      >
                        {q.questionText}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Answered {new Date(q.answeredAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-foreground mt-1">
                        {q.answer?.substring(0, 100)}...
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">
                    No reports yet. Ask your first question!
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Appointments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <i className="fas fa-calendar-check text-primary mr-2"></i>{" "}
                Upcoming Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingAppointments.length > 0 ? (
                  upcomingAppointments.map((a: any) => (
                    <div key={a.id} className="bg-muted/50 p-4 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4
                            className="font-medium text-foreground"
                            data-testid={`text-upcoming-appointment-${a.id}`}
                          >
                            {a.sessionType}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {new Date(a.bookingDate).toLocaleDateString()} at{" "}
                            {a.bookingTime}
                          </p>
                        </div>
                        <span className="bg-accent text-accent-foreground px-2 py-1 rounded text-xs font-medium">
                          {a.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">
                    No upcoming sessions. Book your first consultation!
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
