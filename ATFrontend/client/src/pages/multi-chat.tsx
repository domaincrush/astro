import { useState, useRef, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Send, PhoneOff, Clock, Star, Users, MessageCircle, Plus, Minimize2, Maximize2 } from "lucide-react";
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import { Card, CardContent, CardHeader } from "src/components/ui/card";
import { Badge } from "src/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "src/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "src/components/ui/tabs";
import { ScrollArea } from "src/components/ui/scroll-area";
import ChatMessage from "src/components/chat/ChatMessage";
import { apiRequest } from "src/lib/queryClient";
import { ChatMessageWithSender, ConsultationWithAstrologer } from "@shared/schema";
import { formatTime } from "src/lib/utils";
import { useToast } from "src/hooks/use-toast";
import { useLocation } from "wouter";
import useSocket from "src/hooks/useSocket";
import AstroTickHeader from "src/components/layout/AstroTickHeader";

export default function MultiChat() {
  const [, setLocation] = useLocation();
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState<string>("");
  const [minimizedChats, setMinimizedChats] = useState<Set<string>>(new Set());
  const [sessionDurations, setSessionDurations] = useState<Record<string, number>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Get current user
  const { data: user } = useQuery<{ id: number; role: string; email: string; username: string }>({
    queryKey: ["/api/auth/me"],
  });

  // Get all active consultations for this astrologer
  const { data: activeConsultations = [] } = useQuery<ConsultationWithAstrologer[]>({
    queryKey: ["/api/astrologer/consultations/active"],
    refetchInterval: 5000, // Refresh every 5 seconds
    enabled: !!user?.id && user?.role === 'astrologer',
  });

  // Set the first consultation as active tab by default
  useEffect(() => {
    if (activeConsultations.length > 0 && !activeTab) {
      setActiveTab(activeConsultations[0].id.toString());
    }
  }, [activeConsultations, activeTab]);

  // Get messages for all active consultations
  const messagesQueries = activeConsultations.map(consultation => ({
    consultation,
    messages: useQuery<ChatMessageWithSender[]>({
      queryKey: ["/api/chat", consultation.id],
      enabled: !!consultation.id,
    })
  }));

  // Socket event handler for multi-chat
  const handleSocketEvent = (eventData: any) => {
    if (eventData.type === 'new-consultation') {
      // New consultation started
      queryClient.invalidateQueries({ queryKey: ["/api/astrologer/consultations/active"] });
      toast({
        title: "New Consultation",
        description: `New consultation started with ${eventData.data.userName}`,
      });
    } else if (eventData.type === 'consultation-ended') {
      // Consultation ended
      queryClient.invalidateQueries({ queryKey: ["/api/astrologer/consultations/active"] });

      // Remove from active tab if it was active
      if (activeTab === eventData.data.consultationId.toString()) {
        const remaining = activeConsultations.filter(c => c.id !== eventData.data.consultationId);
        setActiveTab(remaining.length > 0 ? remaining[0].id.toString() : "");
      }
    } else {
      // Regular message
      queryClient.invalidateQueries({ queryKey: ["/api/chat", eventData.consultationId] });
    }
  };

  // Use socket for all active consultations
  useSocket(null, handleSocketEvent);

  // Timer for tracking session durations
  useEffect(() => {
    const timers = activeConsultations.map(consultation => {
      const startTime = new Date(consultation.createdAt).getTime();
      return setInterval(() => {
        const now = Date.now();
        const elapsedSeconds = Math.floor((now - startTime) / 1000);
        setSessionDurations(prev => ({
          ...prev,
          [consultation.id]: elapsedSeconds
        }));
      }, 1000);
    });

    return () => timers.forEach(timer => clearInterval(timer));
  }, [activeConsultations]);

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ consultationId, messageText }: { consultationId: number; messageText: string }) => {
      const response = await apiRequest("POST", "/api/chat/message", {
        consultationId,
        senderId: user?.id || 0,
        senderType: "astrologer",
        message: messageText,
      });
      return response.json();
    },
    onSuccess: () => {
      setMessage("");
      queryClient.invalidateQueries({ queryKey: ["/api/chat"] });
    },
  });

  // End consultation mutation
  const endConsultationMutation = useMutation({
    mutationFn: async (consultationId: number) => {
      const response = await apiRequest("POST", `/api/consultations/${consultationId}/end`, {
        rating: 5,
        review: "Session completed",
      });
      return response.json();
    },
    onSuccess: (_, consultationId) => {
      toast({
        title: "Session Ended",
        description: "Consultation has been completed.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/astrologer/consultations/active"] });

      // Remove from active tab
      const remaining = activeConsultations.filter(c => c.id !== consultationId);
      setActiveTab(remaining.length > 0 ? remaining[0].id.toString() : "");
    },
  });

  // Astrologer extension mutation
  const astrologerExtendMutation = useMutation({
    mutationFn: async (consultationId: number) => {
      const response = await apiRequest("POST", `/api/consultations/${consultationId}/extend-astrologer`, {
        duration: 5,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Session Extended",
        description: "You have extended the session by 5 minutes.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/astrologer/consultations/active"] });
    },
    onError: (error: any) => {
      toast({
        title: "Extension Failed",
        description: error.message || "Failed to extend session.",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    if (!message.trim() || !activeTab) return;

    sendMessageMutation.mutate({
      consultationId: parseInt(activeTab),
      messageText: message.trim()
    });
  };

  const toggleMinimize = (consultationId: string) => {
    const newMinimized = new Set(minimizedChats);
    if (newMinimized.has(consultationId)) {
      newMinimized.delete(consultationId);
    } else {
      newMinimized.add(consultationId);
    }
    setMinimizedChats(newMinimized);
  };

  if (user?.role !== 'astrologer') {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
          <p>This page is only available for astrologers.</p>
          <Button onClick={() => setLocation("/")} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Home
          </Button>
        </Card>
      </div>
    );
  }

  if (activeConsultations.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="p-6 text-center">
          <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold mb-2">No Active Consultations</h2>
          <p className="text-muted-foreground mb-4">
            You don't have any active consultations at the moment.
          </p>
          <Button onClick={() => setLocation("/astrologer-dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <AstroTickHeader />

      <div className="flex h-[calc(100vh-80px)]">
        {/* Chat Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${activeConsultations.length}, 1fr)` }}>
            {activeConsultations.map((consultation) => {
              const sessionMinutes = (sessionDurations[consultation.id] || 0) / 60;
              const isMinimized = minimizedChats.has(consultation.id.toString());

              return (
                <TabsTrigger
                  key={consultation.id}
                  value={consultation.id.toString()}
                  className="flex items-center gap-2 relative"
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={consultation.user?.profileImage || undefined} />
                    <AvatarFallback>
                      {consultation.user?.username?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start">
                    <span className="text-xs">{consultation.user?.username || 'User'}</span>
                    <span className="text-xs text-muted-foreground">
                      {Math.floor(sessionMinutes)}min
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0 ml-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMinimize(consultation.id.toString());
                    }}
                  >
                    {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
                  </Button>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Chat Content */}
          {activeConsultations.map((consultation) => {
            const messagesQuery = messagesQueries.find(q => q.consultation.id === consultation.id);
            const messages = messagesQuery?.messages.data || [];
            const sessionMinutes = (sessionDurations[consultation.id] || 0) / 60;
            const remainingMinutes = Math.max(0, consultation.duration - sessionMinutes);
            const isMinimized = minimizedChats.has(consultation.id.toString());

            return (
              <TabsContent 
                key={consultation.id} 
                value={consultation.id.toString()} 
                className="flex-1 flex flex-col"
              >
                {!isMinimized && (
                  <>
                    {/* Chat Header */}
                    <div className="bg-white dark:bg-gray-800 border-b border-border p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={consultation.user?.profileImage || undefined} />
                            <AvatarFallback>
                              {consultation.user?.username?.charAt(0).toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{consultation.user?.username || 'User'}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>{formatTime(Math.floor(sessionMinutes * 60))}</span>
                              <span>•</span>
                              <span>{remainingMinutes.toFixed(1)} min remaining</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => astrologerExtendMutation.mutate(consultation.id)}
                            disabled={astrologerExtendMutation.isPending || (consultation.astrologerExtensions >= 2)}
                            title={
                              consultation.astrologerExtensions >= 2 
                                ? "Maximum extensions used (2/2)" 
                                : `Extend session by 5 minutes (${consultation.astrologerExtensions || 0}/2 used)`
                            }
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            +5min ({2 - (consultation.astrologerExtensions || 0)})
                          </Button>

                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => endConsultationMutation.mutate(consultation.id)}
                            disabled={endConsultationMutation.isPending}
                          >
                            <PhoneOff className="h-4 w-4 mr-1" />
                            End
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Messages */}
                    <ScrollArea className="flex-1 p-4">
                      <div className="space-y-4">
                        {messages.map((msg) => (
                          <ChatMessage 
                            key={msg.id} 
                            message={msg}
                            currentUserId={user?.id}
                            otherParticipant={{
                              name: consultation.user?.username || 'User',
                              image: consultation.user?.profileImage || undefined
                            }}
                          />
                        ))}
                        <div ref={messagesEndRef} />
                      </div>
                    </ScrollArea>

                    {/* Message Input */}
                    <div className="bg-white dark:bg-gray-800 border-t border-border p-4">
                      <div className="flex gap-2">
                        <Input
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Type your message..."
                          onKeyPress={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                          disabled={sendMessageMutation.isPending}
                        />
                        <Button 
                          onClick={handleSendMessage}
                          disabled={!message.trim() || sendMessageMutation.isPending}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                )}

                {isMinimized && (
                  <div className="flex-1 flex items-center justify-center">
                    <Card className="p-6 text-center">
                      <MessageCircle className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Chat with {consultation.user?.username || 'User'} is minimized
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2"
                        onClick={() => toggleMinimize(consultation.id.toString())}
                      >
                        Restore Chat
                      </Button>
                    </Card>
                  </div>
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </div>
  );
}