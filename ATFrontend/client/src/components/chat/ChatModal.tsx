import { useState, useRef, useEffect, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { X, Send, PhoneOff, CreditCard } from "lucide-react";
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import { Card } from "src/components/ui/card";
import { Badge } from "src/components/ui/badge";
import ChatMessage from "./ChatMessage";
import PayUPayment from "src/components/payment/PayUPayment";
import useSocket from "src/hooks/useSocket";
import { apiRequest } from "src/lib/queryClient";
import { Astrologer, ChatMessageWithSender, ConsultationWithAstrologer } from "@shared/schema";
import { formatTime, calculateSessionCost } from "src/lib/utils";
import { useToast } from "src/hooks/use-toast";
import { useAuth } from "src/hooks/useAuth";

interface ChatModalProps {
  astrologer: Astrologer;
  onClose: () => void;
}

export default function ChatModal({ astrologer, onClose }: ChatModalProps) {
  const [message, setMessage] = useState("");
  const [sessionDuration, setSessionDuration] = useState(0);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Always call hooks, but conditionally return early after all hooks are called
  const shouldRender = !!user;

  // Get or create active consultation
  const { data: activeConsultation, isLoading: loadingConsultation } = useQuery<ConsultationWithAstrologer>({
    queryKey: ["/api/consultations/active", user?.id],
    retry: false,
    enabled: !!user?.id,
  });

  // Create consultation if none exists
  const createConsultationMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error("User not authenticated");
      const response = await apiRequest("POST", "/api/consultations", {
        userId: user.id,
        astrologerId: astrologer.id,
        topic: "General Consultation",
        duration: 0,
        cost: 0,
        status: "active",
      });
      return response.json();
    },
    onSuccess: () => {
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: ["/api/consultations/active", user.id] });
      }
    },
  });

  const consultation = activeConsultation || createConsultationMutation.data;

  // Get chat messages
  const { data: messages = [], refetch: refetchMessages } = useQuery<ChatMessageWithSender[]>({
    queryKey: ["/api/chat", consultation?.id],
    enabled: !!consultation?.id,
  });

  // Socket.IO connection with stable callback
  const handleSocketMessage = useCallback((message: any) => {
    console.log('Received Socket.IO message:', message);
    queryClient.invalidateQueries({ queryKey: ["/api/chat", consultation?.id] });
  }, [queryClient, consultation?.id]);

  const socket = useSocket(consultation?.id || null, handleSocketMessage);

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (messageText: string) => {
      if (!consultation?.id) throw new Error("No active consultation");
      
      const response = await apiRequest("POST", "/api/chat/message", {
        consultationId: consultation.id,
        senderId: user?.id || 0,
        senderType: "user",
        message: messageText,
      });
      return response.json();
    },
    onSuccess: () => {
      refetchMessages();
    },
  });

  // End consultation mutation
  const endConsultationMutation = useMutation({
    mutationFn: async () => {
      if (!consultation?.id) throw new Error("No active consultation");
      
      const cost = calculateSessionCost(astrologer.ratePerMinute, sessionDuration);
      
      const response = await apiRequest("POST", `/api/consultations/${consultation.id}/end`, {
        rating: 5, // Default rating for demo
        review: "Great session!",
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Session Ended",
        description: `Your consultation with ${astrologer.name} has been completed.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/consultations"] });
      onClose();
    },
  });

  // Session timer
  useEffect(() => {
    if (!consultation) return;
    
    const timer = setInterval(() => {
      setSessionDuration(prev => prev + 1);
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [consultation]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Disabled auto-create consultation - now handled through packages flow
  // useEffect(() => {
  //   if (!loadingConsultation && !activeConsultation && !createConsultationMutation.data && !createConsultationMutation.isPending) {
  //     // Automatically create consultation - payment will be handled when session ends
  //     createConsultationMutation.mutate();
  //   }
  // }, [loadingConsultation, activeConsultation]);

  // Check payment status from URL params (after PayU redirect)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    const consultationId = urlParams.get('consultation');
    
    if (paymentStatus === 'success' && consultationId) {
      setPaymentCompleted(true);
      setShowPayment(false);
      toast({
        title: "Payment Successful",
        description: "Your consultation has been activated. You can now start chatting!",
      });
      // Clear URL params
      window.history.replaceState({}, '', window.location.pathname);
    } else if (paymentStatus === 'failed') {
      toast({
        title: "Payment Failed",
        description: "Payment was not successful. Please try again.",
        variant: "destructive",
      });
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // Initialize consultation after payment
  const handlePaymentSuccess = () => {
    setPaymentCompleted(true);
    setShowPayment(false);
    createConsultationMutation.mutate();
  };

  const handleSendMessage = async () => {
    if (!message.trim() || sendMessageMutation.isPending) return;
    
    const messageToSend = message;
    setMessage("");
    
    try {
      await sendMessageMutation.mutateAsync(messageToSend);
    } catch (error) {
      toast({
        title: "Failed to send message",
        description: "Please try again.",
        variant: "destructive",
      });
      setMessage(messageToSend);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEndSession = () => {
    endConsultationMutation.mutate();
  };

  // Early return if user is not authenticated (after all hooks are called)
  if (!shouldRender) {
    return null;
  }

  // Show payment modal only if explicitly needed (removed automatic payment requirement)
  if (false) { // Disabled automatic payment requirement
    const minimumSessionCost = calculateSessionCost(astrologer.ratePerMinute, 5); // 5 minute minimum
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="relative">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="absolute -top-2 -right-2 bg-white text-gray-600 hover:bg-gray-100 rounded-full z-10"
          >
            <X className="h-5 w-5" />
          </Button>
          <PayUPayment 
            consultationId={consultation?.id || 0}
            amount={minimumSessionCost}
            astrologerName={astrologer.name}
            onSuccess={handlePaymentSuccess}
            onCancel={onClose}
          />
        </div>
      </div>
    );
  }

  if (loadingConsultation && !createConsultationMutation.data) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4 p-6">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-mystical-blue border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Starting consultation...</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md h-96 flex flex-col">
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-mystical-blue to-mystical-purple text-white p-4 rounded-t-xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src={astrologer.image} 
              alt={astrologer.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h3 className="font-semibold">{astrologer.name}</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-200">
                <Badge className={socket?.connected ? "bg-green-600" : "bg-gray-600"}>
                  {socket?.connected ? "Connected" : "Connecting..."}
                </Badge>
                <span>{astrologer.specializations[0]}</span>
              </div>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 text-sm">
              <p>Welcome to your consultation with {astrologer.name}!</p>
              <p>Feel free to ask any questions about your spiritual journey.</p>
            </div>
          )}
          
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          
          {sendMessageMutation.isPending && (
            <ChatMessage 
              message={{
                id: 0,
                consultationId: consultation?.id || 0,
                senderId: 1,
                senderType: "user",
                message: message,
                timestamp: new Date(),
                senderName: "You"
              }}
              isPending
            />
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Chat Input */}
        <div className="p-4 border-t bg-white rounded-b-xl">
          <div className="flex space-x-2 mb-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1"
              disabled={sendMessageMutation.isPending}
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!message.trim() || sendMessageMutation.isPending}
              className="bg-mystical-gold text-mystical-blue hover:bg-yellow-400"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>₹{astrologer.ratePerMinute}/min • Session: {Math.floor(sessionDuration / 60)}:{(sessionDuration % 60).toString().padStart(2, '0')}</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleEndSession}
              disabled={endConsultationMutation.isPending}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <PhoneOff className="mr-1 h-3 w-3" />
              End Session
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
