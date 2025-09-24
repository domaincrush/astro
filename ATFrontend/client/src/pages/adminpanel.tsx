import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { Button } from "src/components/ui/button";
import { Textarea } from "src/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "src/components/ui/select";
import { useToast } from "src/hooks/use-toast";
import { apiRequest } from "src/lib/queryClient";

export default function AdminPanel() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [assignedTo, setAssignedTo] = useState<Record<number, string>>({});

  const { data: stats } = useQuery({
    queryKey: ["/api/admin/stats"],
  });

  const { data: pendingQuestions = [] } = useQuery({
    queryKey: ["/api/questions/pending"],
  });

  const { data: todayAppointments = [] } = useQuery({
    queryKey: ["/api/admin/appointments/today"],
  });

  const submitAnswer = useMutation({
    mutationFn: async ({ questionId, answer, answeredBy }: { questionId: number; answer: string; answeredBy: string }) => {
      return await apiRequest("PUT", `/api/questions/${questionId}/answer`, { answer, answeredBy });
    },
    onSuccess: () => {
      toast({
        title: "Answer Submitted",
        description: "The answer has been submitted and the user will be notified.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/questions/pending"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      setAnswers({});
      setAssignedTo({});
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAnswerSubmit = (questionId: number) => {
    const answer = answers[questionId];
    const answeredBy = assignedTo[questionId] || "Admin";

    if (!answer) {
      toast({
        title: "Error",
        description: "Please provide an answer before submitting.",
        variant: "destructive",
      });
      return;
    }

    submitAnswer.mutate({ questionId, answer, answeredBy });
  };

  const astrologers = [
    "Maya Chen",
    "David Rodriguez", 
    "Sarah Williams",
    "Admin"
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Admin Panel</h2>
        <p className="text-muted-foreground">Manage questions, appointments, and user accounts</p>
      </div>

      {/* Admin Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Questions</p>
                <p className="text-2xl font-bold text-destructive" data-testid="text-pending-questions">
                  {stats?.pendingQuestions || 0}
                </p>
              </div>
              <i className="fas fa-question-circle text-destructive text-2xl"></i>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today's Appointments</p>
                <p className="text-2xl font-bold text-accent" data-testid="text-today-appointments">
                  {stats?.todayAppointments || 0}
                </p>
              </div>
              <i className="fas fa-calendar text-accent text-2xl"></i>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Questions</p>
                <p className="text-2xl font-bold text-secondary" data-testid="text-total-questions">
                  {stats?.totalQuestions || 0}
                </p>
              </div>
              <i className="fas fa-chart-bar text-secondary text-2xl"></i>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Answered Questions</p>
                <p className="text-2xl font-bold text-primary" data-testid="text-answered-questions">
                  {stats?.answeredQuestions || 0}
                </p>
              </div>
              <i className="fas fa-check-circle text-primary text-2xl"></i>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Questions */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Pending Questions</CardTitle>
            <Select defaultValue="all">
              <SelectTrigger className="w-[200px]" data-testid="select-category-filter">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Love & Relationships">Love & Relationships</SelectItem>
                <SelectItem value="Career & Finance">Career & Finance</SelectItem>
                <SelectItem value="Health & Wellness">Health & Wellness</SelectItem>
                <SelectItem value="Family & Friends">Family & Friends</SelectItem>
                <SelectItem value="Spiritual Growth">Spiritual Growth</SelectItem>
                <SelectItem value="General Life">General Life</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingQuestions.length > 0 ? (
              pendingQuestions.map((question: any) => (
                <div key={question.id} className="border border-border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="font-medium text-foreground" data-testid={`text-question-user-${question.id}`}>
                          User #{question.userId}
                        </span>
                        <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs">
                          {question.category}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(question.createdAt).toLocaleDateString()}
                        </span>
                        {question.isPriority && (
                          <span className="bg-accent text-accent-foreground px-2 py-1 rounded text-xs font-bold">
                            PRIORITY
                          </span>
                        )}
                      </div>
                      <p className="text-foreground mb-3" data-testid={`text-question-content-${question.id}`}>
                        {question.questionText}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-border pt-3">
                    <Textarea
                      className="mb-3"
                      rows={3}
                      placeholder="Write your astrological response..."
                      value={answers[question.id] || ""}
                      onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
                      data-testid={`input-answer-${question.id}`}
                    />
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <Select
                          value={assignedTo[question.id] || "Admin"}
                          onValueChange={(value) => setAssignedTo({ ...assignedTo, [question.id]: value })}
                        >
                          <SelectTrigger className="w-[200px]" data-testid={`select-astrologer-${question.id}`}>
                            <SelectValue placeholder="Assign to" />
                          </SelectTrigger>
                          <SelectContent>
                            {astrologers.map((astrologer) => (
                              <SelectItem key={astrologer} value={astrologer}>
                                {astrologer}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          onClick={() => handleAnswerSubmit(question.id)}
                          disabled={submitAnswer.isPending}
                          data-testid={`button-submit-answer-${question.id}`}
                        >
                          {submitAnswer.isPending ? "Submitting..." : "Submit Answer"}
                        </Button>
                        <Button variant="ghost" data-testid={`button-skip-question-${question.id}`}>
                          Skip
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <i className="fas fa-check-circle text-4xl text-accent mb-4"></i>
                <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
                <p className="text-muted-foreground">No pending questions at the moment.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Appointment Management */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {todayAppointments.length > 0 ? (
              todayAppointments.map((appointment: any) => (
                <div key={appointment.id} className="border border-border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <span className="font-medium text-foreground" data-testid={`text-appointment-user-${appointment.id}`}>
                          User #{appointment.userId}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {appointment.sessionType}
                        </span>
                        <span className="bg-accent text-accent-foreground px-2 py-1 rounded text-xs">
                          {appointment.duration} min
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>
                          <i className="fas fa-clock mr-1"></i> {appointment.bookingTime}
                        </span>
                        <span>
                          <i className="fas fa-user mr-1"></i> {appointment.astrologer}
                        </span>
                        <span>
                          <i className="fas fa-dollar-sign mr-1"></i> ${appointment.price}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" data-testid={`button-join-call-${appointment.id}`}>
                        Join Call
                      </Button>
                      <Button variant="ghost" size="sm" data-testid={`button-edit-appointment-${appointment.id}`}>
                        <i className="fas fa-edit"></i>
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <i className="fas fa-calendar-check text-4xl text-muted-foreground mb-4"></i>
                <h3 className="text-lg font-semibold mb-2">No appointments today</h3>
                <p className="text-muted-foreground">The schedule is clear for today.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
