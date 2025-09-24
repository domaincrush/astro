import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MessageCircle, Clock, Star, Users } from "lucide-react";
import { io, Socket } from "socket.io-client";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { Button } from "src/components/ui/button";
import { Badge } from "src/components/ui/badge";
import { Input } from "src/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "src/components/ui/tabs";
import { useAuth } from "src/hooks/useAuth";
import { apiRequest } from "src/lib/queryClient";
import { ConsultationWithAstrologer, Astrologer } from "@shared/schema";
import { formatTime, formatDuration, formatPrice } from "src/lib/utils";
import { useToast } from "src/hooks/use-toast";
import { useLocation } from "wouter";
import AstrologerHeader from "src/components/AstrologerHeader";
import QueueView from "src/components/astrologer/QueueView";

export default function AstrologerDashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS
  const previousActiveConsultations = useRef<number>(0);
  const notificationSound = useRef<HTMLAudioElement | null>(null);
  const socketRef = useRef<Socket | null>(null);

  // Get active consultations for this astrologer
  const { data: activeConsultations = [], isLoading } = useQuery<ConsultationWithAstrologer[]>({
    queryKey: ["/api/astrologer/consultations/active"],
    enabled: !!user,
  });

  // Get astrologer profile
  const { data: astrologerProfile } = useQuery<Astrologer>({
    queryKey: ["/api/astrologer/profile"],
    enabled: !!user,
    refetchInterval: 5000, // Refetch every 5 seconds to keep status updated
    onSuccess: (data) => {
      console.log(`🔍 Astrologer profile fetched - Online status: ${data?.isOnline}`);
    }
  });

  // Get consultation history
  const { data: consultationHistory = [] } = useQuery<ConsultationWithAstrologer[]>({
    queryKey: ["/api/astrologer/consultations/history"],
    enabled: !!user,
  });

  // ===============================================
  // ALL EFFECTS MUST BE CALLED BEFORE ANY RETURNS
  // ===============================================
  
  // Role-based access control - only redirect when auth loading is complete
  useEffect(() => {
    if (loading) return; // Don't redirect while auth is still loading
    
    if (!isAuthenticated) {
      console.log("🔄 Astrologer dashboard: Not authenticated, redirecting to login");
      setLocation("/login");
      return;
    }
    if (user && user.role !== 'astrologer' && user.role !== 'admin') {
      console.log("🔄 Astrologer dashboard: Wrong role, redirecting to home");
      setLocation("/");
      return;
    }
  }, [isAuthenticated, user, loading, setLocation]);

  // Initialize notification sound
  useEffect(() => {
    notificationSound.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjaQ2O7SeSkHJHfH==');
    notificationSound.current.volume = 0.5;
  }, []);

  // Notification effect when new consultations arrive
  useEffect(() => {
    if (activeConsultations.length > previousActiveConsultations.current && previousActiveConsultations.current >= 0) {
      // Play notification sound for new consultations
      if (notificationSound.current) {
        notificationSound.current.play().catch(() => {
          // Ignore audio play errors (browser might block autoplay)
        });
      }

      // Show toast notification
      toast({
        title: "New Consultation Request",
        description: "A user is requesting a consultation with you!",
        duration: 5000,
      });
    }
    previousActiveConsultations.current = activeConsultations.length;
  }, [activeConsultations.length, toast]);

  // Request notification permissions on component mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        console.log('Notification permission:', permission);
      });
    }
  }, []);

  // Socket.IO real-time updates for new consultation notifications
  useEffect(() => {
    if (!user?.role || user.role !== 'astrologer') return;

    // Initialize Socket.IO connection for real-time notifications
    socketRef.current = io('/', {
      transports: ['websocket', 'polling']
    });

    socketRef.current.on('connect', () => {
      console.log('Astrologer dashboard connected to Socket.IO for real-time updates');
    });

    socketRef.current.on('new-consultation-for-astrologer', (data) => {
      console.log('Real-time notification: New consultation received:', data);

      // Play notification sound using Web Audio API with user interaction check
      const playNotificationSound = async () => {
        try {
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

          // Resume audio context if suspended (required for Chrome autoplay policy)
          if (audioContext.state === 'suspended') {
            await audioContext.resume();
          }

          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();

          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);

          // Create bell-like notification sound with multiple tones
          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.1);
          oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.2);

          gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);

          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.4);

          console.log('Bell notification sound played successfully');
        } catch (error) {
          console.log('Audio notification failed, showing visual notification only:', error);
          // Fallback: Browser notification if permission granted
          if (Notification.permission === 'granted') {
            new Notification('New Consultation Request', {
              body: `${data.userName || 'A user'} is requesting a consultation!`,
              icon: '/favicon.ico'
            });
          }
        }
      };

      playNotificationSound();

      // Show toast notification
      toast({
        title: "🔔 New Consultation Request",
        description: `${data.userName || 'A user'} is requesting a consultation!`,
        duration: 8000,
        className: "border-green-500 bg-green-50 text-green-900"
      });

      // Refresh consultation data immediately
      queryClient.invalidateQueries({ queryKey: ["/api/astrologer/consultations/active"] });
    });

    socketRef.current.on('disconnect', () => {
      console.log('Astrologer dashboard disconnected from Socket.IO');
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [user?.role, toast, queryClient]);

  // Toggle online status
  const toggleOnlineMutation = useMutation({
    mutationFn: async (isOnline: boolean) => {
      console.log(`🔄 Toggling astrologer status to: ${isOnline ? 'online' : 'offline'}`);
      const response = await apiRequest("PATCH", "/api/astrologer/status", { isOnline });
      const result = await response.json();
      console.log(`✅ Status update API response:`, result);
      return result;
    },
    onSuccess: async (data, isOnline) => {
      console.log(`✅ Status successfully updated to: ${isOnline ? 'online' : 'offline'}`);
      
      // Immediately invalidate and refetch ALL related queries
      await queryClient.invalidateQueries({ queryKey: ["/api/astrologer/profile"] });
      await queryClient.refetchQueries({ queryKey: ["/api/astrologer/profile"] });
      
      // CRITICAL: Invalidate astrologers list to update homepage and /astrologers page
      await queryClient.invalidateQueries({ queryKey: ["/api/astrologers"] });
      await queryClient.refetchQueries({ queryKey: ["/api/astrologers"] });
      
      // Invalidate any specific astrologer queries that might be cached
      await queryClient.invalidateQueries({ queryKey: ["/api/astrologers/by-name"] });
      
      // Force complete cache invalidation for all astrologer-related data
      queryClient.removeQueries({ queryKey: ["/api/astrologers"], exact: false });
      
      console.log(`🔄 Invalidated all astrologer-related queries to ensure homepage/astrologers page updates`);
      
      // Force a second refetch with delay to ensure consistency
      setTimeout(async () => {
        await queryClient.refetchQueries({ queryKey: ["/api/astrologer/profile"] });
        await queryClient.refetchQueries({ queryKey: ["/api/astrologers"] });
        console.log(`🔄 Secondary refetch completed for all astrologer data`);
      }, 1000);
      
      toast({
        title: "Status Updated",
        description: `You are now ${isOnline ? 'online' : 'offline'}`,
        className: isOnline ? "border-green-500 bg-green-50 text-green-900" : "border-gray-500 bg-gray-50 text-gray-900"
      });
    },
    onError: (error) => {
      console.error("❌ Status update failed:", error);
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleChatOpen = (consultation: ConsultationWithAstrologer) => {
    setLocation(`/chat?consultation=${consultation.id}`);
  };

  // ===============================================
  // CONDITIONAL RETURNS MOVED TO AFTER ALL HOOKS
  // ===============================================
  
  // Show loading while checking authentication
  if (loading || (!isAuthenticated && !user)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  // Redirect non-astrologer users (but allow admins)
  if (user && user.role !== 'astrologer' && user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <AstrologerHeader />
      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Astrologer Dashboard</h1>
              <p className="text-gray-600">Welcome back, {astrologerProfile?.name || user.username}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant={astrologerProfile?.isOnline ? "default" : "secondary"}>
                {astrologerProfile?.isOnline ? "🟢 Online" : "🔴 Offline"}
              </Badge>
              {activeConsultations.length > 1 && (
                <Button
                  onClick={() => setLocation("/multi-chat")}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  Multi-Chat ({activeConsultations.length})
                </Button>
              )}
              <Button
                onClick={() => {
                  const newStatus = !astrologerProfile?.isOnline;
                  console.log(`🎯 Button clicked: Current status: ${astrologerProfile?.isOnline}, New status: ${newStatus}`);
                  toggleOnlineMutation.mutate(newStatus);
                }}
                disabled={toggleOnlineMutation.isPending}
                variant={astrologerProfile?.isOnline ? "outline" : "default"}
                className={astrologerProfile?.isOnline ? "border-red-500 text-red-600 hover:bg-red-50" : "bg-green-600 hover:bg-green-700 text-white"}
              >
                {toggleOnlineMutation.isPending 
                  ? "Updating..." 
                  : astrologerProfile?.isOnline 
                    ? "🔴 Go Offline" 
                    : "🟢 Go Online"
                }
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Consultations</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeConsultations.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Consultations</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{astrologerProfile?.totalConsultations || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{astrologerProfile?.rating || "N/A"}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatPrice(astrologerProfile?.totalEarnings || 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content with Tabs */}
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active">Active Consultations</TabsTrigger>
            <TabsTrigger value="queue">Queue</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Consultations</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading consultations...</p>
                  </div>
                ) : activeConsultations.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No active consultations</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {astrologerProfile?.isOnline ? "Waiting for users to start chat..." : "Go online to receive consultations"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeConsultations.map((consultation) => (
                      <div key={consultation.id} className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex-1">
                          <h3 className="font-semibold text-green-800">User #{consultation.userId}</h3>
                          <p className="text-sm text-green-600">{consultation.topic}</p>
                          <p className="text-xs text-green-500">
                            Started: {formatTime(new Date(consultation.createdAt))}
                          </p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-sm font-medium text-green-800">
                              {formatPrice(consultation.cost)}
                            </p>
                            <p className="text-xs text-green-600">
                              {formatDuration(consultation.duration)}
                            </p>
                          </div>
                          <Button
                            onClick={() => handleChatOpen(consultation)}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Continue Chat
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="queue" className="mt-6">
            <QueueView />
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Consultation History</CardTitle>
              </CardHeader>
              <CardContent>
                {consultationHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No consultation history</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {consultationHistory.slice(0, 10).map((consultation) => (
                      <div key={consultation.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">User #{consultation.userId}</h3>
                            <p className="text-sm text-gray-600">{consultation.topic}</p>
                            <p className="text-xs text-gray-500">
                              {formatTime(new Date(consultation.createdAt))}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge variant="secondary">
                              {consultation.status}
                            </Badge>
                            <p className="text-sm font-medium mt-1">
                              {formatPrice(consultation.cost)}
                            </p>
                            {consultation.duration && (
                              <p className="text-xs text-gray-500">
                                {formatDuration(consultation.duration)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}