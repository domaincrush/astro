import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Send, PhoneOff, Clock, Star, Search, Paperclip, Bookmark, BookmarkCheck, AlertTriangle, Plus } from "lucide-react";
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import { Card, CardContent, CardHeader } from "src/components/ui/card";
import { Badge } from "src/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "src/components/ui/avatar";
import ChatMessage from "src/components/chat/ChatMessage";
import ChatSettings from "src/components/chat/ChatSettings";
import FileUpload from "src/components/chat/FileUpload";
import MessageReactions from "src/components/chat/MessageReactions";
import VoiceRecorder from "src/components/chat/VoiceRecorder";
import MessageSearch from "src/components/chat/MessageSearch";
import SessionExtensionAlert from "src/components/chat/SessionExtensionAlert";
import QuickReplyButtons from "src/components/chat/QuickReplyButtons";
import TypingIndicator from "src/components/chat/TypingIndicator";
import BirthChart from "src/components/chat/BirthChart";
import UserDetailsModal from "src/components/modals/UserDetailsModal";
import QueueStatus from "src/components/chat/QueueStatus";
import AvailableAstrologers from "src/components/chat/AvailableAstrologers";
import useSocket from "src/hooks/useSocket";
import { apiRequest } from "src/lib/queryClient";
import { Astrologer, ChatMessageWithSender, ConsultationWithAstrologer } from "@shared/schema";
import { formatTime, calculateSessionCost } from "src/lib/utils";
import { useToast } from "src/hooks/use-toast";
import { useAuth } from "src/hooks/useAuth";
import { useLocation } from "wouter";


// Extend window object for Socket.IO
declare global {
  interface Window {
    socket?: any;
  }
}

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [newMessages, setNewMessages] = useState<ChatMessageWithSender[]>([]);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [showMessageSearch, setShowMessageSearch] = useState(false);
  const [showExtensionAlert, setShowExtensionAlert] = useState(false);
  const [extensionAlertShown, setExtensionAlertShown] = useState(false);
  const [bookmarkedMessages, setBookmarkedMessages] = useState<number[]>([]);
  const [chatSettings, setChatSettings] = useState({
    fontSize: 14,
    language: 'en',
    theme: 'light' as 'light' | 'dark',
    soundEnabled: true
  });
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<{[userId: number]: {userName: string, timestamp: number}}>({});
  const [messageStatus, setMessageStatus] = useState<Record<number, 'sending' | 'sent' | 'delivered' | 'read' | 'failed'>>({});
  const [offlineMessages, setOfflineMessages] = useState<ChatMessageWithSender[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [readReceipts, setReadReceipts] = useState<Record<number, boolean>>({});
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);
  const [timerStarted, setTimerStarted] = useState(false);
  const [userDetailsCollected, setUserDetailsCollected] = useState(false);
  const [currentSessionDuration, setCurrentSessionDuration] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messageRetryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  // Get consultation ID from URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const consultationId = urlParams.get('consultation');
  console.log('🔍 Chat page consultation ID from URL:', consultationId);

  // Get consultation by ID from URL parameter - Phase 1: Enhanced with routing info
  const { data: consultationResponse, isLoading: loadingConsultation } = useQuery<any>({
    queryKey: ["/api/consultations", consultationId],
    queryFn: async () => {
      if (!consultationId) {
        throw new Error('No consultation ID provided');
      }
      console.log('📞 Fetching consultation data for ID:', consultationId);
      const response = await apiRequest("GET", `/api/consultations/${consultationId}`);
      const data = await response.json();
      console.log('💬 Enhanced consultation data loaded with routing:', data);
      return data;
    },
    retry: false,
    enabled: !!consultationId && !!user?.id,
  });

  // Extract consultation data and handle routing transparency
  const activeConsultation = consultationResponse?.consultation || consultationResponse;

  const { data: userProfile } = useQuery({
    queryKey: ["/api/auth/user"],
    enabled: !!user?.id && user?.role !== 'astrologer',
  });

  const consultation = activeConsultation;
  const astrologer = consultation?.astrologer;

  // Phase 1: Handle transparent routing display
  const displayAstrologerName = consultation?.displayAstrologerName || astrologer?.name;
  const isRoutedConsultation = consultation?.routing || consultation?.isRerouted;
  
  // For admin debugging: log routing info (remove in production)
  if (isRoutedConsultation && user?.role === 'admin') {
    console.log('🔄 Routed consultation detected:', {
      original: astrologer?.name,
      displayed: displayAstrologerName,
      routing: consultation?.routing
    });
  }

  // Calculate session cost and remaining time
  const sessionMinutes = sessionDuration / 60; // convert seconds to minutes
  const sessionCost = astrologer?.ratePerMinute ? 
    (astrologer.ratePerMinute * sessionMinutes).toFixed(2) : "0.00";

  // Package details and remaining time
  const currentDuration = consultation?.duration || 0; // Current total duration in minutes
  const packageCost = consultation?.cost || 0; // in paise
  const remainingMinutes = Math.max(0, currentDuration - sessionMinutes);
  const remainingBalance = Math.max(0, (packageCost / 100) - parseFloat(sessionCost));

  // Calculate original package duration (assuming 15min base packages)
  const originalPackageDuration = 15; // Base package duration
  const extensionMinutes = Math.max(0, currentDuration - originalPackageDuration);
  const packageDuration = originalPackageDuration;

  // Calculate astrologer rate for session extension
  const astrologerRate = packageDuration > 0 ? Math.round(packageCost / packageDuration) : 0;

  // For display purposes - show the other participant with transparent routing
  const otherParticipant = user?.role === 'astrologer' 
    ? { name: consultation?.user?.username || 'User', image: consultation?.user?.profileImage || undefined }
    : { 
        name: displayAstrologerName || astrologer?.name, 
        image: astrologer?.image || undefined,
        isRouted: isRoutedConsultation
      };

  // Get initial chat messages
  const { data: initialMessages = [], refetch: refetchMessages } = useQuery<ChatMessageWithSender[]>({
    queryKey: ["/api/chat", consultation?.id],
    queryFn: async () => {
      if (!consultation?.id) return [];
      const response = await apiRequest("GET", `/api/chat?consultationId=${consultation.id}`);
      return response.json();
    },
    enabled: !!consultation?.id,
  });

  // Poll queue status for queued consultations
  const { data: queueStatus } = useQuery({
    queryKey: ["/api/consultations", consultation?.id, "queue-status"],
    enabled: !!consultation?.id && consultation?.status === "queued",
    refetchInterval: 30000, // Poll every 30 seconds
  });

  // Combine initial messages with new messages from socket, avoiding duplicates
  const allMessages = useMemo(() => {
    const messageMap = new Map();
    
    // Add initial messages first
    initialMessages.forEach(msg => {
      messageMap.set(msg.id, msg);
    });
    
    // Add new messages, overwriting any duplicates
    newMessages.forEach(msg => {
      messageMap.set(msg.id, msg);
    });
    
    // Convert back to array and sort by timestamp
    return Array.from(messageMap.values()).sort((a, b) => 
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
  }, [initialMessages, newMessages]);

  // Socket.IO connection with message handler
  const handleSocketEvent = useCallback((eventData: any) => {
    if (eventData.type === 'consultation-ended') {
      // Handle consultation ended by astrologer
      toast({
        title: "Session Ended",
        description: "The consultation has been ended by the astrologer.",
        variant: "destructive",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/consultations"] });
      setTimeout(() => {
        setLocation("/");
      }, 2000);
    } else if (eventData.type === 'session-extended') {
      // Handle session extension
      const isExtendedByAstrologer = eventData.data.extendedBy === 'Astrologer';

      // Play notification sound
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // Pleasant notification tone for extension
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
      } catch (error) {
        console.log('Audio notification failed:', error);
      }

      toast({
        title: isExtendedByAstrologer ? "🎁 Free Extension!" : "Session Extended",
        description: isExtendedByAstrologer 
          ? `Your astrologer has extended the session by ${eventData.data.duration} minutes for free!`
          : `Session extended by ${eventData.data.duration} minutes`,
        className: isExtendedByAstrologer ? "border-green-500 bg-green-50 text-green-900" : "",
        duration: 8000,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/consultations/active"] });
    } else if (eventData.type === 'typing-start') {
      // Phase 2: Enhanced typing indicators with routing transparency
      const displayName = eventData.displayAstrologer || eventData.userName;
      setTypingUsers(prev => ({
        ...prev,
        [eventData.userId]: {
          userName: displayName,
          timestamp: eventData.timestamp,
          isRouted: !!eventData.displayAstrologer
        }
      }));

      // Auto-clear typing indicator after 3 seconds
      setTimeout(() => {
        setTypingUsers(prev => {
          const updated = { ...prev };
          delete updated[eventData.userId];
          return updated;
        });
      }, 3000);

    } else if (eventData.type === 'typing-stop') {
      setTypingUsers(prev => {
        const updated = { ...prev };
        delete updated[eventData.userId];
        return updated;
      });

    } else if (eventData.type === 'message-delivered') {
      // Update message delivery status
      setMessageStatus(prev => ({
        ...prev,
        [eventData.messageId]: 'delivered'
      }));

    } else if (eventData.type === 'message-received') {
      // Mark message as delivered to other user
      setMessageStatus(prev => ({
        ...prev,
        [eventData.messageId]: 'delivered'
      }));

    } else if (eventData.type === 'message-read') {
      // Update read receipts and message status
      setMessageStatus(prev => ({
        ...prev,
        [eventData.messageId]: 'read'
      }));
      setReadReceipts(prev => ({
        ...prev,
        [eventData.messageId]: true
      }));
    } else {
      // Phase 2: Enhanced message handling with routing transparency
      const messageData = eventData;
      
      // Apply routing transparency for user display
      if (messageData.routing?.isRouted && messageData.routing.displayAstrologer) {
        messageData.senderName = messageData.routing.displayAstrologer;
      }
      
      setNewMessages((prev: ChatMessageWithSender[]) => [...prev, messageData]);
      
      // Debug log for Phase 2 routing (remove in production)
      if (messageData.routing?.isRouted && user?.role === 'admin') {
        console.log('📨 Phase 2: Routed message received:', {
          senderName: messageData.senderName,
          displayAstrologer: messageData.routing?.displayAstrologer,
          isRouted: messageData.routing?.isRouted
        });
      }
    }
  }, [toast, queryClient, setLocation]);

  useSocket(consultation?.id || null, handleSocketEvent);

  // Handle popup payment messages
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin && !event.origin.includes('payu')) {
        return; // Only accept messages from same origin or PayU
      }

      if (event.data.type === 'EXTENSION_PAYMENT_SUCCESS') {
        toast({
          title: "Payment Successful!",
          description: `Your session has been extended by ${event.data.duration} minutes.`,
          className: "border-green-500 bg-green-50 text-green-900",
          duration: 8000,
        });
        queryClient.invalidateQueries({ queryKey: ["/api/consultations"] });
        setShowExtensionAlert(false);
      } else if (event.data.type === 'EXTENSION_PAYMENT_FAILED') {
        toast({
          title: "Payment Failed",
          description: `Payment failed: ${event.data.reason}`,
          variant: "destructive",
          duration: 8000,
        });
      } else if (event.data.type === 'EXTENSION_PAYMENT_CANCELLED') {
        toast({
          title: "Payment Cancelled",
          description: "You cancelled the payment process.",
          variant: "destructive",
          duration: 5000,
        });
      } else if (event.data.type === 'EXTENSION_PAYMENT_ERROR') {
        toast({
          title: "Payment Error",
          description: "There was an error processing your payment.",
          variant: "destructive",
          duration: 8000,
        });
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [toast, queryClient]);

  // Timer effect - count up in real time
  useEffect(() => {
    if (!timerStarted || !consultation) return;

    const startTime = consultation.timerStartTime 
      ? new Date(consultation.timerStartTime).getTime()
      : Date.now();

    const timer = setInterval(() => {
      const now = Date.now();
      const elapsedSeconds = Math.floor((now - startTime) / 1000);
      setCurrentSessionDuration(elapsedSeconds);
    }, 1000);

    return () => clearInterval(timer);
  }, [timerStarted, consultation?.timerStartTime, consultation?.id]);

  // Check if user details need to be collected when consultation loads
  useEffect(() => {
    if (consultation && user?.role !== 'astrologer') {
      // Check if consultation already has user details
      const hasUserDetails = consultation.userDetails && 
        (consultation.userDetails as any)?.name && 
        (consultation.userDetails as any)?.dateOfBirth;

      if (!hasUserDetails && !userDetailsCollected) {
        setShowUserDetailsModal(true);
      } else {
        setUserDetailsCollected(true);
        setTimerStarted(true);
      }
    } else if (consultation && user?.role === 'astrologer') {
      // For astrologers, start timer immediately
      setTimerStarted(true);
    }
  }, [consultation, user?.role, userDetailsCollected]);

  // Update consultation with user details mutation
  const updateUserDetailsMutation = useMutation({
    mutationFn: async (userDetails: any) => {
      if (!consultation?.id) throw new Error("No active consultation");

      const response = await apiRequest("PATCH", `/api/consultations/${consultation.id}`, {
        userDetails
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Details Updated",
        description: "Your details have been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/consultations/active"] });
      setUserDetailsCollected(true);
      setTimerStarted(true);
      setShowUserDetailsModal(false);
    },
  });

  // Handle user details submission
  const handleUserDetailsSubmit = (details: any) => {
    updateUserDetailsMutation.mutate(details);
  };

  // Handle user details skip
  const handleUserDetailsSkip = () => {
    setShowUserDetailsModal(false);
    setUserDetailsCollected(true);
    setTimerStarted(true);
  };

  // Enhanced message sending with delivery status and offline queuing
  const sendMessageMutation = useMutation({
    mutationFn: async (messageText: string) => {
      if (!consultation?.id) throw new Error("No active consultation");

      // Generate temporary message ID for status tracking
      const tempMessageId = Date.now();

      // Set initial status as sending
      setMessageStatus(prev => ({
        ...prev,
        [tempMessageId]: 'sending'
      }));

      // If offline, queue the message
      if (!isOnline) {
        const offlineMessage: ChatMessageWithSender = {
          id: tempMessageId,
          consultationId: consultation.id,
          senderId: user?.id || 0,
          senderType: user?.role === "astrologer" ? "astrologer" : "user",
          senderName: user?.username || 'User',
          message: messageText,
          timestamp: new Date()
        };

        setOfflineMessages(prev => [...prev, offlineMessage]);
        setMessageStatus(prev => ({
          ...prev,
          [tempMessageId]: 'failed'
        }));

        toast({
          title: "Message Queued",
          description: "Message will be sent when connection is restored",
          variant: "destructive",
        });

        return offlineMessage;
      }

      const response = await apiRequest("POST", "/api/chat/message", {
        consultationId: consultation.id,
        senderId: user?.id || 0,
        senderType: user?.role === "astrologer" ? "astrologer" : "user",
        message: messageText,
      });

      const result = await response.json();

      // Update status to sent
      setMessageStatus(prev => ({
        ...prev,
        [result.id]: 'sent'
      }));

      // Emit socket event for delivery confirmation
      if (window.socket) {
        window.socket.emit('message-sent', {
          consultationId: consultation.id,
          messageId: result.id,
          timestamp: Date.now()
        });
      }

      return result;
    },
    onSuccess: () => {
      refetchMessages();
    },
    onError: (error) => {
      toast({
        title: "Message Failed",
        description: "Failed to send message. Retrying...",
        variant: "destructive",
      });

      // Retry after 3 seconds
      setTimeout(() => {
        if (message.trim()) {
          sendMessageMutation.mutate(message);
        }
      }, 3000);
    },
  });

  // End consultation mutation
  const endConsultationMutation = useMutation({
    mutationFn: async () => {
      if (!consultation?.id) throw new Error("No active consultation");

      const response = await apiRequest("POST", `/api/consultations/${consultation.id}/end`, {
        rating: 5,
        review: "Great session!",
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
        const error = new Error(errorData.message || `HTTP ${response.status}`);
        (error as any).status = response.status;
        throw error;
      }
      
      return response.json();
    },
    onSuccess: () => {
      // Disconnect from socket room
      if (window.socket && consultation?.id) {
        window.socket.emit('leave-consultation', consultation.id);
      }

      // Clear all consultation-related cache
      queryClient.removeQueries({ queryKey: ["/api/consultations/active"] });
      queryClient.removeQueries({ queryKey: ["/api/chat"] });
      queryClient.invalidateQueries({ queryKey: ["/api/consultations"] });

      toast({
        title: "Session Ended",
        description: "Your consultation has been completed.",
      });

      // Force immediate redirect with proper routing
      if (user?.role === 'astrologer') {
        setLocation('/astrologer-dashboard');
      } else {
        setLocation('/dashboard');
      }
    },
    onError: (error: any) => {
      // Handle already ended consultation
      if (error.message?.includes("already") || error.status === 400) {
        toast({
          title: "Session Already Ended",
          description: "This consultation has already been completed.",
          variant: "default",
        });
        
        // Redirect to dashboard since consultation is already ended
        if (user?.role === 'astrologer') {
          setLocation('/astrologer-dashboard');
        } else {
          setLocation('/dashboard');
        }
      } else {
        toast({
          title: "Error Ending Session",
          description: error.message || "Failed to end session properly.",
          variant: "destructive",
        });
      }
    },
  });

  // Session extension mutation (for users)
  const extendSessionMutation = useMutation({
    mutationFn: async ({ duration, paymentMethod }: { duration: number; paymentMethod: 'wallet' | 'payment' }) => {
      if (!consultation?.id) throw new Error("No active consultation");

      const response = await apiRequest("POST", `/api/consultations/${consultation.id}/extend`, {
        duration,
        paymentMethod,
      });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.requiresPayment) {
        // Open payment popup for gateway payment
        openPaymentPopup(data);
      } else {
        // Wallet payment successful
        toast({
          title: "Session Extended",
          description: "Your consultation has been extended successfully.",
        });
        queryClient.invalidateQueries({ queryKey: ["/api/consultations"] });
        setShowExtensionAlert(false);
      }
    },
    onError: (error: any) => {
      toast({
        title: "Extension Failed",
        description: error.message || "Failed to extend session. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Function to open payment popup without disrupting chat
  const openPaymentPopup = (paymentData: any) => {
    const popup = window.open('', 'payuPayment', 'width=800,height=600,scrollbars=yes,resizable=yes,centerscreen=yes');
    
    if (!popup) {
      toast({
        title: "Popup Blocked",
        description: "Please allow popups for payment processing.",
        variant: "destructive",
      });
      return;
    }

    // Create PayU form in popup
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = paymentData.paymentUrl;
    form.target = 'payuPayment';

    // Add all PayU fields
    Object.entries(paymentData.paymentData).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = String(value);
      form.appendChild(input);
    });

    // Submit form to popup
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);

    // Show payment processing message
    toast({
      title: "Payment Processing",
      description: `Gateway payment of ₹${(paymentData.gatewayAmount / 100).toFixed(2)} initiated. Complete payment in the popup window.`,
      duration: 8000,
    });
  };

  // Astrologer extension mutation (5 minutes only)
  const astrologerExtendMutation = useMutation({
    mutationFn: async () => {
      if (!consultation?.id) throw new Error("No active consultation");

      const response = await apiRequest("POST", `/api/consultations/${consultation.id}/extend-astrologer`, {
        duration: 5, // Fixed 5 minutes for astrologers
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Session Extended",
        description: "You have extended the session by 5 minutes.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/consultations"] });
    },
    onError: (error: any) => {
      toast({
        title: "Extension Failed",
        description: error.message || "Failed to extend session.",
        variant: "destructive",
      });
    },
  });



  // Show extension alert when 5 minutes remaining (only for users, not astrologers)
  useEffect(() => {
    if (remainingMinutes <= 5 && remainingMinutes > 0 && !extensionAlertShown && consultation && user?.role !== 'astrologer') {
      setShowExtensionAlert(true);
      setExtensionAlertShown(true);

      // Play sound notification if enabled
      if (chatSettings.soundEnabled) {
        const audio = new Audio('/notification.mp3');
        audio.play().catch(() => {}); // Ignore audio play errors
      }
    }
  }, [remainingMinutes, extensionAlertShown, consultation, chatSettings.soundEnabled, user?.role]);

  // Auto-end session 2 minutes after consultation time expires
  useEffect(() => {
    if (consultation && remainingMinutes <= -2) {
      toast({
        title: "Session Ended",
        description: "Your consultation time has expired. The session has been automatically ended.",
        variant: "destructive",
      });

      // Automatically end the consultation with proper cleanup
      endConsultationMutation.mutate();
    }
  }, [remainingMinutes, consultation, endConsultationMutation, toast]);

  // Network status monitoring for offline message queuing
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);

      // Send queued offline messages when back online
      if (offlineMessages.length > 0) {
        toast({
          title: "Connection Restored",
          description: `Sending ${offlineMessages.length} queued messages...`,
        });

        offlineMessages.forEach((msg) => {
          sendMessageMutation.mutate(msg.message);
        });

        setOfflineMessages([]);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "Connection Lost",
        description: "Messages will be queued until connection is restored",
        variant: "destructive",
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [offlineMessages, sendMessageMutation, toast]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages]);

  // Session timer - track elapsed time in seconds, but only start when timer is enabled
  useEffect(() => {
    if (!consultation || !timerStarted) return;

    const startTime = new Date(consultation.createdAt).getTime();
    const timer = setInterval(() => {
      const now = Date.now();
      const elapsedSeconds = Math.floor((now - startTime) / 1000);
      setSessionDuration(elapsedSeconds);
    }, 1000);

    return () => clearInterval(timer);
  }, [consultation, timerStarted]);

  // Enhanced typing handler with user names and Socket.IO emission
  const handleTypingStart = () => {
    if (!consultation?.id || !user?.id) return;

    setIsTyping(true);

    // Emit enhanced typing start event with user name
    if (window.socket) {
      window.socket.emit('typing-start', {
        consultationId: consultation.id,
        userId: user.id,
        userName: user.username || user.email || 'User'
      });
    }

    // Clear existing typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to automatically stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      handleTypingStop();
    }, 3000);
  };

  const handleTypingStop = () => {
    if (!consultation?.id || !user?.id) return;

    setIsTyping(false);

    // Emit typing stop event
    if (window.socket) {
      window.socket.emit('typing-stop', {
        consultationId: consultation.id,
        userId: user.id
      });
    }

    // Clear timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    // Stop typing indicator when sending message
    handleTypingStop();

    sendMessageMutation.mutate(message);
    setMessage("");

    // Stop typing indicator
    setIsTyping(false);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  };

  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      // Note: WebSocket typing events would be handled by useSocket hook
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 2000);
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

  if (!consultation || !astrologer) {
    // Show available astrologers component when no active consultation
    return <AvailableAstrologers />;
  }



  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col max-w-4xl mx-auto">
      {/* Elegant Minimal Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-100 dark:border-gray-700 sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          {/* Left: Back + Participant Info */}
          <div className="flex items-center gap-3">
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

          {/* Center: Timer */}
          <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 px-3 py-1 rounded-full">
            <Clock className="h-3 w-3 text-gray-500" />
            <span className="font-mono text-sm text-gray-700 dark:text-gray-300">
              {Math.floor(currentSessionDuration / 60)}:{(currentSessionDuration % 60).toString().padStart(2, '0')}
            </span>
          </div>

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
              onClick={() => {
                if (consultation?.status === 'completed') {
                  toast({
                    title: "Session Already Ended",
                    description: "This consultation has already been completed.",
                    variant: "default",
                  });
                  return;
                }
                endConsultationMutation.mutate();
              }}
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
      </div>

      {/* Clean Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3">
        {allMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-3 py-2 rounded-2xl text-sm ${
                msg.senderId === user?.id
                  ? 'bg-blue-500 text-white rounded-br-md'
                  : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-bl-md'
              }`}
            >
              <p className="break-words">{msg.content}</p>
              <p className={`text-xs mt-1 ${
                msg.senderId === user?.id ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {formatTime(msg.created_at)}
              </p>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {Object.entries(typingUsers).length > 0 && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-2xl rounded-bl-md">
              <div className="flex items-center space-x-1">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                </div>
                <span className="text-xs text-gray-500 ml-2">typing...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Clean Message Input */}
      <div className="border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
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

        {/* Quick Reply Buttons for Users */}
        {user?.role !== 'astrologer' && (
          <div className="p-4 border-t border-border">
            <QuickReplyButtons
              onQuickReply={(quickMessage) => {
                setMessage(quickMessage);
                // Auto-send quick replies after a short delay
                setTimeout(() => {
                  if (quickMessage.trim()) {
                    sendMessageMutation.mutate(quickMessage.trim());
                    setMessage("");
                  }
                }, 100);
              }}
              disabled={sendMessageMutation.isPending}
            />
          </div>
        )}

        {/* Quick Reply Buttons for Astrologers */}
        {user?.role === 'astrologer' && (
          <div className="p-4 border-t border-border">
            <Card className="mb-4">
              <CardContent className="p-3">
                <div className="text-sm text-muted-foreground mb-2">Quick Responses:</div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { text: "Let me analyze your chart...", category: "analysis" },
                    { text: "Based on your birth details...", category: "prediction" },
                    { text: "I can see strong planetary influences...", category: "insight" },
                    { text: "Your current dasha period shows...", category: "timing" },
                    { text: "For career prospects...", category: "career" },
                    { text: "Regarding relationships...", category: "love" },
                  ].map((reply, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setMessage(reply.text);
                        setTimeout(() => {
                          if (reply.text.trim()) {
                            sendMessageMutation.mutate(reply.text.trim());
                            setMessage("");
                          }
                        }, 100);
                      }}
                      disabled={sendMessageMutation.isPending}
                      className="justify-start text-xs h-8 px-2"
                    >
                      {reply.text}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Legacy Typing Indicator - Hidden as enhanced version is used above */}

        {/* Message Input */}
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-border p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex space-x-2">
              <Input
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);

                  // Trigger enhanced typing indicator when user starts typing
                  if (e.target.value.length > 0 && !isTyping) {
                    handleTypingStart();
                  } else if (e.target.value.length === 0) {
                    handleTypingStop();
                  }
                }}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1"
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
        </div>

      {/* Message Search Modal */}
      <MessageSearch
        messages={allMessages}
        onMessageSelect={(messageId) => {
          // Scroll to message - in real implementation, you'd highlight the message
          toast({
            title: "Message found",
            description: "Located the requested message",
          });
        }}
        isOpen={showMessageSearch}
        onClose={() => setShowMessageSearch(false)}
      />

      {/* Session Extension Alert - Only for users, not astrologers */}
      {user?.role !== 'astrologer' && (
        <SessionExtensionAlert
          isOpen={showExtensionAlert}
          onClose={() => setShowExtensionAlert(false)}
          onExtend={(duration, paymentMethod) => {
            extendSessionMutation.mutate({ duration, paymentMethod });
          }}
          remainingMinutes={Math.floor(remainingMinutes)}
          astrologerRate={astrologerRate}
          walletBalance={(user as any)?.balance || 0}
          isLoading={extendSessionMutation.isPending}
        />
      )}

      {/* User Details Collection Modal */}
      <UserDetailsModal
        isOpen={showUserDetailsModal}
        onSubmit={handleUserDetailsSubmit}
        onSkip={handleUserDetailsSkip}
        isLoading={updateUserDetailsMutation.isPending}
      />
    </div>
  );
}