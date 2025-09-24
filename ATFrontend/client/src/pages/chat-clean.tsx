import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Send, PhoneOff, Clock, Timer, Plus, ChevronDown, ChevronUp, User, Calendar, MapPin, Eye, CheckCheck } from "lucide-react";
import BirthDetailsPanel from 'src/components/BirthDetailsPanel';
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "src/components/ui/avatar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "src/components/ui/collapsible";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "src/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "src/components/ui/select";
import useSocket from "src/hooks/useSocket";
import { apiRequest } from "src/lib/queryClient";
import { ChatMessageWithSender, ConsultationWithAstrologer } from "@shared/schema";
import { formatTime } from "src/lib/utils";
import { useToast } from "src/hooks/use-toast";
import { useAuth } from "src/hooks/useAuth";
import { useLocation } from "wouter";
import { useClickTracking } from "src/hooks/useAnalytics";
import BirthChart from "src/components/chat/BirthChart";
import { useSessionTimer } from "src/hooks/useSessionTimer";
import SessionTimeoutManager from "src/components/SessionTimeoutManager";

export default function CleanChatPage() {
  const [message, setMessage] = useState("");
  const [newMessages, setNewMessages] = useState<ChatMessageWithSender[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<{[userId: number]: {userName: string, timestamp: number}}>({});
  const [showBirthDetails, setShowBirthDetails] = useState(false);
  const [showExtendTimeModal, setShowExtendTimeModal] = useState(false);
  const [selectedExtensionTime, setSelectedExtensionTime] = useState<number>(5);
  const [readMessages, setReadMessages] = useState<Set<number>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { trackClick } = useClickTracking();

  // Session timer hook for automatic session management
  const { sessionDuration, getRemainingTime, isSessionExpired, resetWarnings } = useSessionTimer({
    consultation,
    onSessionEnd: () => {
      // Navigate back to home page or astrologer page
      setLocation('/consultations');
    }
  });

  // Get consultation ID from URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const consultationId = urlParams.get('consultation');

  // Load consultation data
  const { data: consultation, isLoading: loadingConsultation } = useQuery({
    queryKey: ["/api/consultations", consultationId],
    queryFn: async () => {
      if (!consultationId) throw new Error('Consultation ID required');
      const response = await fetch(`/api/consultations/${consultationId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) {
        console.error('Consultation API error:', response.status, await response.text());
        throw new Error('Failed to fetch consultation');
      }
      return response.json();
    },
    enabled: !!consultationId
  });

  // Load astrologer data
  const astrologer = consultation?.astrologer;
  const otherParticipant = user?.role === 'astrologer' 
    ? { name: consultation?.user?.username || 'User', image: '/api/placeholder/40/40' }
    : astrologer;

  // Load chat messages
  const { data: initialMessages, refetch: refetchMessages } = useQuery({
    queryKey: ["/api/chat", consultationId],
    queryFn: async () => {
      if (!consultationId) throw new Error('Consultation ID required');
      const response = await fetch(`/api/chat/${consultationId}`);
      if (!response.ok) {
        console.error('Chat API error:', response.status, await response.text());
        throw new Error('Failed to fetch messages');
      }
      return response.json();
    },
    enabled: !!consultationId
  });

  // Load birth chart data
  const { data: birthChart } = useQuery({
    queryKey: ["/api/birth-chart", consultation?.user?.id],
    enabled: !!consultation?.user?.id && user?.role === 'astrologer'
  });

  // Load enhanced astrological details using JEMICRO Engine
  const { data: jemicroDetails, isLoading: jemicroLoading } = useQuery({
    queryKey: ["/api/jemicro/calculate", consultation?.userDetails],
    queryFn: async () => {
      if (!consultation?.userDetails?.dateOfBirth) return null;
      
      // Enhanced birth data with proper validation
      const birthData = {
        date: consultation.userDetails.dateOfBirth,
        time: consultation.userDetails.timeOfBirth || "12:00:00",
        place: consultation.userDetails.placeOfBirth || "Chennai, Tamil Nadu, India",
        latitude: consultation.userDetails.latitude || 13.0827,
        longitude: consultation.userDetails.longitude || 80.2707
      };
      
      console.log('🔬 [JEMICRO] Requesting calculation with data:', birthData);
      
      const response = await fetch('/api/jemicro/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(birthData)
      });
      
      const result = await response.json();
      console.log('🔬 [JEMICRO] API Response:', result);
      
      if (!response.ok || !result.success) {
        console.warn('🔬 [JEMICRO] Calculation failed:', result.error);
        return null;
      }
      
      return result;
    },
    enabled: !!consultation?.userDetails?.dateOfBirth,
    retry: 2
  });

  // Combine initial and new messages
  const allMessages = useMemo(() => {
    if (!initialMessages) return newMessages;
    
    const messageMap = new Map();
    [...initialMessages, ...newMessages].forEach(msg => {
      messageMap.set(msg.id, msg);
    });
    
    return Array.from(messageMap.values()).sort((a, b) => 
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
  }, [initialMessages, newMessages]);

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (messageText: string) => {
      console.log('Sending message:', {
        consultationId: consultation?.id,
        message: messageText,
        senderId: user?.id,
        senderType: user?.role || 'user',
        userRole: user?.role,
        token: localStorage.getItem("token") ? "present" : "missing"
      });
      
      const response = await apiRequest("POST", "/api/chat/message", {
        consultationId: consultation?.id,
        message: messageText,
        senderId: user?.id,
        senderType: user?.role || 'user'
      });
      
      const result = await response.json();
      console.log('Message sent successfully:', result);
      return result;
    },
    onSuccess: (data) => {
      console.log('onSuccess called with data:', data);
      setNewMessages((prev: ChatMessageWithSender[]) => [
        ...prev,
        {
          id: data.id,
          message: data.message,
          senderName: user?.username || user?.email || 'You',
          created_at: data.timestamp || data.created_at,
          timestamp: data.timestamp,
          senderId: user?.id || 0,
          consultationId: consultation?.id || 0,
          senderType: user?.role || 'user'
        }
      ]);
      
      // Track analytics
      trackClick('chat-message-sent', {
        consultationId: consultation?.id,
        messageLength: data.message?.length || 0
      });
    },
    onError: (error) => {
      console.error('Failed to send message - detailed error:', error);
      console.error('Error type:', typeof error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      toast({
        title: "Error",
        description: `Failed to send message: ${error.message || 'Please try again.'}`,
        variant: "destructive",
      });
    }
  });

  // Handle extend time payment with PayU popup
  const handleExtendTimePayment = () => {
    const amount = (astrologer?.pricePerMinute || 30) * selectedExtensionTime;
    
    // Show loading toast
    toast({
      title: "Opening Payment Gateway",
      description: `Processing ₹${amount} payment for ${selectedExtensionTime} minutes`,
    });
    
    const paymentWindow = window.open('', 'payment', 'width=800,height=600,scrollbars=yes,resizable=yes');
    
    if (paymentWindow) {
      // Create PayU form with proper submission handling
      const payuForm = `
        <html>
          <head>
            <title>Payment - Extend Consultation</title>
            <style>
              body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
              .loading { margin: 20px 0; }
              .spinner { border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; width: 30px; height: 30px; animation: spin 1s linear infinite; margin: 0 auto; }
              @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            </style>
          </head>
          <body>
            <h3>Extending Consultation Time</h3>
            <div class="loading">
              <div class="spinner"></div>
              <p>Redirecting to payment gateway...</p>
            </div>
            
            <form id="payuForm" action="https://secure.payu.in/_payment" method="post">
              <input type="hidden" name="key" value="gtKFFx" />
              <input type="hidden" name="txnid" value="extend_${consultation?.id}_${Date.now()}" />
              <input type="hidden" name="amount" value="${amount}" />
              <input type="hidden" name="productinfo" value="Consultation Extension - ${selectedExtensionTime} minutes" />
              <input type="hidden" name="firstname" value="${user?.username || 'User'}" />
              <input type="hidden" name="email" value="${user?.email}" />
              <input type="hidden" name="phone" value="9999999999" />
              <input type="hidden" name="surl" value="${window.location.origin}/api/payment/extension/success" />
              <input type="hidden" name="furl" value="${window.location.origin}/api/payment/extension/failure" />
              <input type="hidden" name="hash" value="dummy_hash" />
              <input type="hidden" name="udf1" value="extend_${consultation?.id}_${selectedExtensionTime}" />
            </form>
            
            <script>
              // Auto-submit form after 2 seconds
              setTimeout(function() {
                document.getElementById('payuForm').submit();
              }, 2000);
              
              // Fallback manual submission
              document.addEventListener('DOMContentLoaded', function() {
                setTimeout(function() {
                  if (document.getElementById('payuForm')) {
                    document.getElementById('payuForm').submit();
                  }
                }, 3000);
              });
            </script>
          </body>
        </html>
      `;
      
      paymentWindow.document.write(payuForm);
      
      // Listen for payment completion messages
      const handlePaymentMessage = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;
        
        if (event.data.type === 'PAYMENT_SUCCESS') {
          clearInterval(checkPaymentStatus);
          setShowExtendTimeModal(false);
          paymentWindow.close();
          
          // Update consultation data and notify user
          queryClient.invalidateQueries(["/api/consultations", consultationId]);
          toast({
            title: "Payment Successful!",
            description: `Consultation extended by ${event.data.extensionMinutes} minutes`,
          });
          
          // Emit Socket.IO event for real-time update
          if (socket) {
            socket.emit('consultation-extended', {
              consultationId: consultation?.id,
              extensionMinutes: event.data.extensionMinutes
            });
          }
          
        } else if (event.data.type === 'PAYMENT_FAILED') {
          clearInterval(checkPaymentStatus);
          setShowExtendTimeModal(false);
          paymentWindow.close();
          
          toast({
            title: "Payment Failed",
            description: event.data.error || "Payment could not be processed",
            variant: "destructive"
          });
        }
      };
      
      window.addEventListener('message', handlePaymentMessage);
      
      // Monitor payment window
      const checkPaymentStatus = setInterval(() => {
        try {
          if (paymentWindow.closed) {
            clearInterval(checkPaymentStatus);
            window.removeEventListener('message', handlePaymentMessage);
            setShowExtendTimeModal(false);
            toast({
              title: "Payment Window Closed",
              description: "Please check if your payment was successful",
            });
          }
        } catch (e) {
          // Payment window closed or cross-origin
        }
      }, 1000);
    } else {
      toast({
        title: "Popup Blocked", 
        description: "Please allow popups for payment processing and try again.",
        variant: "destructive"
      });
    }
  };

  // Astrologer extend mutation
  const astrologerExtendMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/consultations/${consultation?.id}/extend-astrologer`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Session Extended",
        description: "Consultation extended by 5 minutes",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/consultations", consultationId] });
    },
    onError: (error) => {
      console.error('Failed to extend session:', error);
      toast({
        title: "Error",
        description: "Failed to extend session. Please try again.",
        variant: "destructive",
      });
    }
  });

  // End consultation mutation
  const endConsultationMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/consultations/${consultation?.id}/end`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Session Ended",
        description: "Consultation has been ended successfully",
      });
      setLocation('/consultations');
    },
    onError: (error) => {
      console.error('Failed to end consultation:', error);
      toast({
        title: "Error",
        description: "Failed to end consultation. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Timer effect
  useEffect(() => {
    if (!consultation?.id || consultation?.status !== 'active') return;

    const interval = setInterval(() => {
      setSessionDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [consultation?.id, consultation?.status]);

  // Enhanced Socket.IO event handling
  const handleSocketEvent = useCallback((eventData: any) => {
    console.log('🔗 Socket event received:', eventData);
    switch (eventData.type) {
      case 'typing-start':
        setTypingUsers(prev => ({
          ...prev,
          [eventData.userId]: {
            userName: eventData.userName,
            timestamp: eventData.timestamp
          }
        }));
        setTimeout(() => {
          setTypingUsers(prev => {
            const updated = { ...prev };
            delete updated[eventData.userId];
            return updated;
          });
        }, 3000);
        break;
        
      case 'typing-stop':
        setTypingUsers(prev => {
          const updated = { ...prev };
          delete updated[eventData.userId];
          return updated;
        });
        break;
        
      case 'message':
        console.log('Adding new message from socket:', eventData);
        setNewMessages((prev: ChatMessageWithSender[]) => [...prev, eventData]);
        break;
        
      case 'consultation-extended':
        console.log('🔔 Consultation extended event received:', eventData);
        toast({
          title: "Session Extended",
          description: `Consultation extended by ${eventData.duration} minutes`,
        });
        // Refresh consultation data to update timer
        queryClient.invalidateQueries({ queryKey: ["/api/consultations", consultationId] });
        // Also reset session duration to sync with new consultation duration
        if (consultation && eventData.newTotalDuration) {
          const elapsed = Date.now() - new Date(consultation.created_at).getTime();
          setSessionDuration(Math.floor(elapsed / 1000));
        }
        break;
        
      case 'session-warning':
        console.log('⏰ Session warning received:', eventData.data);
        if (eventData.data.minutesRemaining === 5) {
          toast({
            title: "⏰ 5 Minutes Remaining",
            description: "Your consultation will end in 5 minutes. Consider extending if you need more time.",
            duration: 10000,
          });
        } else if (eventData.data.minutesRemaining === 1) {
          toast({
            title: "⚠️ 1 Minute Remaining",
            description: "Your consultation will end very soon. Extend now to continue.",
            duration: 8000,
          });
        }
        break;

      case 'session-expired':
        console.log('⏰ Session expired:', eventData.data);
        toast({
          title: "⏰ Session Ended",
          description: "Your consultation time has expired. Thank you for using AstroTick!",
          duration: 5000,
        });
        // Redirect to consultations page after delay
        setTimeout(() => {
          setLocation('/consultations');
        }, 2000);
        break;

      case 'session-extended':
        console.log('✅ Session extended:', eventData.data);
        toast({
          title: "✅ Session Extended",
          description: `Your session has been extended by ${eventData.data.duration || 5} minutes.`,
          duration: 3000,
        });
        // Refresh consultation data to update timer
        queryClient.invalidateQueries({ queryKey: ["/api/consultations", consultationId] });
        break;
        
      case 'consultation-ended':
        toast({
          title: "Session Ended",
          description: "The consultation has been completed",
        });
        // Redirect to consultations page
        setLocation('/consultations');
        break;
        
      case 'wallet-updated':
        toast({
          title: "Wallet Updated",
          description: `Your wallet balance has been updated`,
        });
        // Refresh user data
        queryClient.invalidateQueries(["/api/auth/me"]);
        break;
        
      default:
        // Handle other message types including direct new-message events
        console.log('🔗 Handling default socket event:', eventData);
        console.log('🔗 Event has message field:', !!eventData.message);
        console.log('🔗 Event has senderId field:', !!eventData.senderId);
        console.log('🔗 Event structure:', Object.keys(eventData));
        
        if (eventData.content && eventData.senderId) {
          console.log('🔗 Adding message via content field');
          setNewMessages((prev: ChatMessageWithSender[]) => [...prev, eventData]);
        } else if (eventData.message && eventData.senderId) {
          // Handle new-message events directly
          console.log('🔗 Adding message via message field');
          setNewMessages((prev: ChatMessageWithSender[]) => [...prev, eventData]);
        } else {
          console.log('🔗 Event does not match expected message format');
        }
    }
  }, [toast, queryClient, consultationId, setLocation]);

  useSocket(consultation?.id || null, handleSocketEvent);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages]);

  // Enhanced typing handlers with proper Socket.IO integration
  const handleTypingStart = () => {
    if (!consultation?.id || !user?.id) return;
    setIsTyping(true);
    
    if (window.socket) {
      window.socket.emit('typing-start', {
        consultationId: consultation.id,
        userId: user.id,
        userName: user.username || user.email || 'User',
        timestamp: Date.now()
      });
      console.log('🔵 Emitted typing-start event');
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      handleTypingStop();
    }, 3000);
  };

  const handleTypingStop = () => {
    if (!consultation?.id || !user?.id) return;
    setIsTyping(false);
    
    if (window.socket) {
      window.socket.emit('typing-stop', {
        consultationId: consultation.id,
        userId: user.id,
        timestamp: Date.now()
      });
      console.log('🔴 Emitted typing-stop event');
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    handleTypingStop();
    sendMessageMutation.mutate(message);
    setMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Please log in to access chat.</p>
      </div>
    );
  }

  if (loadingConsultation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!consultation || !otherParticipant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No active consultation found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Birth Details Panel - Left Side */}
      <BirthDetailsPanel 
        consultation={consultation}
        jemicroDetails={jemicroDetails}
        isLoading={jemicroLoading}
      />
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col max-w-4xl">
      {/* Clean Minimal Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-100 dark:border-gray-700 sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          {/* Left: AstroTick Logo + Back + Participant Info */}
          <div className="flex items-center gap-3">
            {/* AstroTick Logo */}
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-sm border-2 border-white">
              <span className="text-white font-bold text-xs">A</span>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation('/')}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarImage src={otherParticipant.image} />
              <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                {otherParticipant.name?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-sm text-gray-900 dark:text-gray-100">{otherParticipant.name}</h3>
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${consultation.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`} />
                <span className="text-xs text-gray-500">{consultation.status === 'active' ? 'Online' : 'Offline'}</span>
              </div>
            </div>
          </div>

          {/* Center: Enhanced Timer in Minutes with Warnings */}
          {(() => {
            const remaining = getRemainingTime();
            const isLowTime = remaining.total <= 300; // 5 minutes or less
            const isCriticalTime = remaining.total <= 60; // 1 minute or less
            
            return (
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${
                isCriticalTime 
                  ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' 
                  : isLowTime 
                    ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
                    : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
              }`}>
                <Timer className={`h-3 w-3 ${
                  isCriticalTime ? 'text-red-600' : isLowTime ? 'text-orange-600' : 'text-blue-600'
                }`} />
                <span className={`font-mono text-sm font-medium ${
                  isCriticalTime 
                    ? 'text-red-700 dark:text-red-300' 
                    : isLowTime 
                      ? 'text-orange-700 dark:text-orange-300'
                      : 'text-blue-700 dark:text-blue-300'
                }`}>
                  {remaining.minutes}:{remaining.seconds.toString().padStart(2, '0')} remaining
                </span>
                {isLowTime && (
                  <span className="text-xs animate-pulse">⚠️</span>
                )}
              </div>
            );
          })()}

          {/* Right: Action buttons */}
          <div className="flex items-center gap-2">
            {/* Astrologer extend button */}
            {user?.role === 'astrologer' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => astrologerExtendMutation.mutate()}
                disabled={astrologerExtendMutation.isPending || (consultation.astrologerExtensions >= 2)}
                className="text-xs border-gray-200 hover:border-gray-300"
              >
                <Plus className="h-3 w-3 mr-1" />
                +5min
              </Button>
            )}

            {/* End consultation button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => endConsultationMutation.mutate()}
              disabled={endConsultationMutation.isPending || consultation?.status === 'completed'}
              className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <PhoneOff className="h-3 w-3 mr-1" />
              End
            </Button>
          </div>
        </div>

        {/* Question Display - Only show if present */}
        {consultation.topic && (
          <div className="px-4 pb-3">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg border border-blue-100 dark:border-blue-800">
              <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">Question: </span>
              <span className="text-xs text-blue-800 dark:text-blue-200">{consultation.topic}</span>
            </div>
          </div>
        )}

        {/* Birth Details Section - Show for all users in chat */}
        {consultation?.userDetails && (
          <div className="px-4 pb-3">
            <Collapsible open={showBirthDetails} onOpenChange={setShowBirthDetails}>
              <CollapsibleTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="w-full justify-between p-2 h-auto text-left bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  onClick={() => trackClick('chat_birth_details_toggle', {
                    expanded: !showBirthDetails,
                    consultation_id: consultationId
                  })}
                >
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Birth Details</span>
                  </div>
                  {showBirthDetails ? 
                    <ChevronUp className="h-4 w-4 text-gray-500" /> : 
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  }
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2">
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 space-y-2">
                  {/* User Basic Info */}
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-700">
                    <User className="h-3 w-3 text-gray-500" />
                    <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                      {consultation.userDetails?.name || consultation.user?.username || 'User'}
                    </span>
                  </div>

                  {/* Birth Details from consultation userDetails */}
                  {consultation.userDetails && (
                    <>
                      {consultation.userDetails.dateOfBirth && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3 text-gray-500" />
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            Born: {consultation.userDetails.dateOfBirth}
                            {consultation.userDetails.timeOfBirth && ` at ${consultation.userDetails.timeOfBirth}`}
                          </span>
                        </div>
                      )}

                      {consultation.userDetails.placeOfBirth && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3 text-gray-500" />
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            {consultation.userDetails.placeOfBirth}
                          </span>
                        </div>
                      )}

                      {consultation.userDetails.name && (
                        <div className="flex items-center gap-2">
                          <User className="h-3 w-3 text-gray-500" />
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            Name: {consultation.userDetails.name}
                          </span>
                        </div>
                      )}
                    </>
                  )}

                  {/* Enhanced Birth Chart Component with JEMICRO data */}
                  {(birthChart || jemicroDetails) && (
                    <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                      <div className="text-xs text-gray-600 dark:text-gray-400 font-medium mb-2 flex items-center gap-1">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        Astrological Details (JEMICRO Engine):
                      </div>
                      
                      {/* Enhanced Moon Sign, Lagna, Nakshatra from JEMICRO */}
                      {jemicroLoading ? (
                        <div className="bg-blue-50 dark:bg-blue-800/20 p-3 rounded border border-blue-200 dark:border-blue-700">
                          <div className="text-xs text-blue-600 dark:text-blue-400 text-center animate-pulse">
                            🔄 JEMICRO Engine calculating...
                          </div>
                        </div>
                      ) : jemicroDetails?.success ? (
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded border border-purple-200 dark:border-purple-800">
                            <div className="text-xs font-medium text-purple-700 dark:text-purple-300">🌙 Moon Sign</div>
                            <div className="text-xs text-purple-600 dark:text-purple-400 font-semibold">
                              {jemicroDetails.dasha?.moonNakshatra?.name || jemicroDetails.data?.moon_sign || jemicroDetails.data?.rashi || jemicroDetails.ascendant?.sign || 'Calculating...'}
                            </div>
                          </div>
                          <div className="bg-orange-50 dark:bg-orange-900/20 p-2 rounded border border-orange-200 dark:border-orange-800">
                            <div className="text-xs font-medium text-orange-700 dark:text-orange-300">⬆️ Lagna</div>
                            <div className="text-xs text-orange-600 dark:text-orange-400 font-semibold">
                              {jemicroDetails.ascendant?.sign || jemicroDetails.data?.ascendant?.sign || jemicroDetails.data?.lagna || 'Calculating...'}
                            </div>
                          </div>
                          <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded col-span-2 border border-green-200 dark:border-green-800">
                            <div className="text-xs font-medium text-green-700 dark:text-green-300">⭐ Nakshatra</div>
                            <div className="text-xs text-green-600 dark:text-green-400 font-semibold">
                              {jemicroDetails.dasha?.moonNakshatra?.name || jemicroDetails.data?.moon_nakshatra || jemicroDetails.data?.nakshatra || 'Calculating...'}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-yellow-50 dark:bg-yellow-800/20 p-3 rounded border border-yellow-200 dark:border-yellow-700">
                          <div className="text-xs text-yellow-600 dark:text-yellow-400 text-center">
                            🔮 JEMICRO calculation in progress... Birth chart details will appear when calculation completes.
                          </div>
                        </div>
                      )}
                      
                      {birthChart && (
                        <BirthChart 
                          data={birthChart} 
                          compact={true}
                          className="text-xs"
                        />
                      )}
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        )}
      </div>

      {/* Clean Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3">
        {allMessages.map((msg) => {
          const isCurrentUser = msg.senderId === user?.id;
          const isAstrologer = msg.senderType === 'astrologer';
          
          // Get avatar source based on sender type
          const getAvatarSrc = () => {
            if (isCurrentUser) {
              return user?.image || `/api/placeholder/32/32?text=${user?.username?.charAt(0)?.toUpperCase() || 'U'}`;
            } else if (isAstrologer) {
              return otherParticipant?.image || `/api/placeholder/32/32?text=${otherParticipant?.name?.charAt(0)?.toUpperCase() || 'A'}`;
            }
            return `/api/placeholder/32/32?text=U`;
          };

          const getAvatarFallback = () => {
            if (isCurrentUser) {
              return user?.username?.charAt(0)?.toUpperCase() || 'U';
            } else if (isAstrologer) {
              return otherParticipant?.name?.charAt(0)?.toUpperCase() || 'A';
            }
            return 'U';
          };

          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
            >
              {/* Avatar for other user (left side) */}
              {!isCurrentUser && (
                <Avatar className="h-6 w-6 mb-1">
                  <AvatarImage src={getAvatarSrc()} />
                  <AvatarFallback className={`text-xs ${isAstrologer ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                    {getAvatarFallback()}
                  </AvatarFallback>
                </Avatar>
              )}

              {/* Message bubble */}
              <div
                className={`max-w-xs lg:max-w-md px-3 py-2 rounded-2xl text-sm ${
                  isCurrentUser
                    ? 'bg-blue-500 text-white rounded-br-md'
                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-bl-md'
                }`}
              >
                {/* Sender name for non-current users */}
                {!isCurrentUser && (
                  <p className={`text-xs font-medium mb-1 ${isAstrologer ? 'text-purple-600 dark:text-purple-400' : 'text-gray-600 dark:text-gray-400'}`}>
                    {msg.senderName || otherParticipant?.name || 'User'}
                  </p>
                )}
                <p className="break-words">{msg.message || msg.content}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className={`text-xs ${
                    isCurrentUser ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {formatTime(msg.timestamp || msg.created_at)}
                  </p>
                  {/* Read indicators */}
                  {isCurrentUser && (
                    <div className="flex items-center gap-1">
                      {readMessages.has(msg.id) ? (
                        <CheckCheck className="h-3 w-3 text-blue-200" />
                      ) : (
                        <Eye className="h-3 w-3 text-blue-300" />
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Avatar for current user (right side) */}
              {isCurrentUser && (
                <Avatar className="h-6 w-6 mb-1">
                  <AvatarImage src={getAvatarSrc()} />
                  <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                    {getAvatarFallback()}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          );
        })}

        {/* Typing indicator with avatar and emoji */}
        {Object.entries(typingUsers).length > 0 && (
          <div className="flex items-end gap-2 justify-start">
            <Avatar className="h-6 w-6 mb-1">
              <AvatarImage src={otherParticipant?.image} />
              <AvatarFallback className="text-xs bg-purple-100 text-purple-700">
                {otherParticipant?.name?.charAt(0)?.toUpperCase() || 'A'}
              </AvatarFallback>
            </Avatar>
            <div className="bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-2xl rounded-bl-md">
              <div className="flex items-center space-x-1">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                </div>
                <span className="text-xs text-gray-500 ml-2">✍️ typing...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Auto-Suggested Questions/Replies */}
      {consultation?.status === 'active' && (
        <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="text-xs text-gray-600 dark:text-gray-400 mb-2 font-medium">
            {user?.role === 'astrologer' ? 'Quick Replies:' : 'Suggested Questions:'}
          </div>
          <div className="flex flex-wrap gap-2">
            {user?.role === 'astrologer' ? (
              // Astrologer quick replies
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-7 px-2"
                  onClick={() => setMessage("I understand your concern. Let me analyze your birth chart for this.")}
                >
                  🔮 Analyze Chart
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-7 px-2"
                  onClick={() => setMessage("Based on your planetary positions, I can see...")}
                >
                  ⭐ Planetary Insight
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-7 px-2"
                  onClick={() => setMessage("I recommend these remedies for your situation:")}
                >
                  🙏 Suggest Remedies
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-7 px-2"
                  onClick={() => setMessage("Would you like me to explain your current dasha period?")}
                >
                  📅 Dasha Analysis
                </Button>
              </>
            ) : (
              // User suggested questions
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-7 px-2"
                  onClick={() => setMessage("What can you tell me about my career prospects?")}
                >
                  💼 Career
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-7 px-2"
                  onClick={() => setMessage("When will I get married? Any insights about my love life?")}
                >
                  💕 Marriage
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-7 px-2"
                  onClick={() => setMessage("What does my birth chart say about my health?")}
                >
                  🏥 Health
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-7 px-2"
                  onClick={() => setMessage("What are the auspicious periods for me this year?")}
                >
                  ✨ Auspicious Times
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-7 px-2"
                  onClick={() => setMessage("Can you suggest some remedies for my problems?")}
                >
                  🔮 Remedies
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Clean Message Input */}
      <div className="border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
        {/* Timer and Extend Time for Users */}
        {user?.role === 'user' && consultation?.status === 'active' && (
          <div className="flex items-center justify-between mb-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-700 dark:text-blue-300">
                Time Remaining: {getRemainingTime().minutes} minutes {getRemainingTime().seconds} seconds
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-xs border-blue-300 text-blue-700 hover:bg-blue-100"
              onClick={() => setShowExtendTimeModal(true)}
            >
              <Plus className="h-3 w-3 mr-1" />
              Extend Time
            </Button>
          </div>
        )}

        {/* Extend Time Modal */}
        <Dialog open={showExtendTimeModal} onOpenChange={setShowExtendTimeModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Extend Consultation Time</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Select Additional Time</label>
                <Select value={selectedExtensionTime.toString()} onValueChange={(value) => setSelectedExtensionTime(Number(value))}>
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 minutes (₹{(astrologer?.pricePerMinute || 30) * 5})</SelectItem>
                    <SelectItem value="10">10 minutes (₹{(astrologer?.pricePerMinute || 30) * 10})</SelectItem>
                    <SelectItem value="15">15 minutes (₹{(astrologer?.pricePerMinute || 30) * 15})</SelectItem>
                    <SelectItem value="30">30 minutes (₹{(astrologer?.pricePerMinute || 30) * 30})</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <div className="text-sm font-medium text-blue-700 dark:text-blue-300">Payment Summary</div>
                <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  {selectedExtensionTime} minutes × ₹{astrologer?.pricePerMinute || 30}/min = ₹{(astrologer?.pricePerMinute || 30) * selectedExtensionTime}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowExtendTimeModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleExtendTimePayment} className="flex-1">
                  Pay & Extend
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <div className="flex items-center gap-3">
          <Input
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              handleTypingStart();
            }}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 border-gray-200 dark:border-gray-600 rounded-full px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={sendMessageMutation.isPending}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim() || sendMessageMutation.isPending}
            size="sm"
            className="rounded-full px-4 bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Session timeout is now handled via Socket.IO events from the server */}
      </div>
    </div>
  );
}