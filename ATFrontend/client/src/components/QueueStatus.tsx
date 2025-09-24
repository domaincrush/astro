import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from 'src/components/ui/card';
import { Button } from 'src/components/ui/button';
import { Badge } from 'src/components/ui/badge';
import { Progress } from 'src/components/ui/progress';
import { Loader2, Clock, Users, CreditCard, Phone, MessageCircle, Video, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'src/hooks/use-toast';
import { apiRequest } from 'src/lib/queryClient';

interface QueueEntry {
  id: number;
  position: number;
  estimatedWaitTime: number;
  paymentStatus: string;
  status: string;
  joinTime: string;
}

interface QueueStatus {
  isOnline: boolean;
  isBusy: boolean;
  queueLength: number;
  estimatedWaitTime: number;
  currentConsultation?: any;
}

interface QueueStatusProps {
  astrologerId: number;
  consultationType: 'chat' | 'call' | 'video';
  duration: number;
  amount: number;
  onConsultationStart?: (consultationId: number) => void;
}

export default function QueueStatus({ 
  astrologerId, 
  consultationType, 
  duration, 
  amount,
  onConsultationStart 
}: QueueStatusProps) {
  const [isJoiningQueue, setIsJoiningQueue] = useState(false);
  const [userQueueEntry, setUserQueueEntry] = useState<QueueEntry | null>(null);
  const queryClient = useQueryClient();

  // Fetch astrologer availability
  const { data: availabilityData, isLoading: availabilityLoading } = useQuery<{ success: boolean; data: QueueStatus }>({
    queryKey: ['/api/astrologers', astrologerId, 'availability'],
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  // Fetch user's queue position if they're in queue
  const { data: queuePositionData, isLoading: queueLoading } = useQuery<{ success: boolean; queueEntry: QueueEntry }>({
    queryKey: ['/api/queue/position', astrologerId],
    enabled: !!userQueueEntry || (availabilityData?.data?.queueLength ?? 0) > 0,
    refetchInterval: 3000, // Refresh every 3 seconds
  });

  // Join queue mutation
  const joinQueueMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('/api/queue/join', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return response.json();
    },
    onSuccess: (data: any) => {
      if (data.requiresPayment) {
        // Redirect to payment page with queue information
        handlePaymentFlow(data.queueEntry, data.consultation);
      } else {
        // Start consultation immediately
        toast({
          title: "Consultation Started",
          description: "You can now chat with the astrologer!",
        });
        onConsultationStart?.(data.consultation.id);
      }
      queryClient.invalidateQueries({ queryKey: ['/api/astrologers', astrologerId, 'availability'] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Join Queue",
        description: error.message || "Unable to join queue. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Leave queue mutation
  const leaveQueueMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('/api/queue/leave', {
        method: 'POST',
        body: JSON.stringify({ astrologerId }),
      });
      return response.json();
    },
    onSuccess: () => {
      setUserQueueEntry(null);
      toast({
        title: "Left Queue",
        description: "You have been removed from the queue.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/astrologers', astrologerId, 'availability'] });
    },
  });

  // Handle payment flow for queue entry
  const handlePaymentFlow = (queueEntry: QueueEntry, consultation: any) => {
    // Store queue entry data
    setUserQueueEntry(queueEntry);
    
    // Redirect to payment page with queue parameters
    const paymentUrl = `/payment?type=queue&astrologer=${astrologerId}&consultation=${consultation.id}&queue=${queueEntry.id}&amount=${amount}&duration=${duration}&service=${consultationType}`;
    window.location.href = paymentUrl;
  };

  // Handle joining queue
  const handleJoinQueue = async () => {
    setIsJoiningQueue(true);
    try {
      await joinQueueMutation.mutateAsync({
        astrologerId,
        consultationType,
        duration,
        amount,
      });
    } finally {
      setIsJoiningQueue(false);
    }
  };

  // Update queue entry from position data
  useEffect(() => {
    if (queuePositionData?.queueEntry) {
      setUserQueueEntry(queuePositionData.queueEntry);
    } else {
      setUserQueueEntry(null);
    }
  }, [queuePositionData]);

  if (availabilityLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Checking availability...</span>
        </CardContent>
      </Card>
    );
  }

  const queueStatus: QueueStatus | undefined = availabilityData?.data;

  if (!queueStatus) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <AlertCircle className="h-8 w-8 mx-auto mb-2" />
            <p>Unable to check astrologer availability</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // User is in queue
  if (userQueueEntry) {
    const waitTimeMinutes = Math.ceil(userQueueEntry.estimatedWaitTime);
    const progress = Math.max(0, Math.min(100, ((queueStatus.queueLength - userQueueEntry.position + 1) / queueStatus.queueLength) * 100));

    return (
      <Card className="border-2 border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-600" />
            You're in Queue
            <Badge 
              variant={userQueueEntry.paymentStatus === 'success' ? 'default' : 'secondary'}
              className="ml-auto"
            >
              Position #{userQueueEntry.position}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Payment Status */}
          <div className="flex items-center gap-2">
            {userQueueEntry.paymentStatus === 'success' ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <CreditCard className="h-4 w-4 text-orange-600" />
            )}
            <span className="text-sm">
              Payment: {userQueueEntry.paymentStatus === 'success' ? 'Confirmed' : 'Pending'}
            </span>
          </div>

          {/* Queue Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Queue Progress</span>
              <span>{userQueueEntry.position} of {queueStatus.queueLength} in line</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Wait Time */}
          <div className="bg-white p-3 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Estimated Wait Time</p>
                <p className="text-2xl font-bold text-orange-600">
                  {waitTimeMinutes} min
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </div>

          {/* Service Details */}
          <div className="flex items-center gap-4 text-sm bg-white p-3 rounded-lg border">
            {consultationType === 'chat' && <MessageCircle className="h-4 w-4" />}
            {consultationType === 'call' && <Phone className="h-4 w-4" />}
            {consultationType === 'video' && <Video className="h-4 w-4" />}
            <span className="capitalize">{consultationType} consultation</span>
            <span>•</span>
            <span>{duration} minutes</span>
            <span>•</span>
            <span>₹{amount}</span>
          </div>

          {/* Leave Queue Button */}
          <Button 
            onClick={() => leaveQueueMutation.mutate()}
            disabled={leaveQueueMutation.isPending}
            variant="outline" 
            className="w-full border-red-200 text-red-600 hover:bg-red-50"
          >
            {leaveQueueMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Leave Queue
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Astrologer is offline
  if (!queueStatus.isOnline) {
    return (
      <Card className="border-2 border-gray-200">
        <CardContent className="p-6 text-center">
          <div className="text-gray-500">
            <AlertCircle className="h-8 w-8 mx-auto mb-2" />
            <p className="font-medium">Astrologer is currently offline</p>
            <p className="text-sm">Please try again later</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Astrologer is available
  if (!queueStatus.isBusy && queueStatus.queueLength === 0) {
    return (
      <Card className="border-2 border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <CheckCircle className="h-5 w-5" />
            Available Now
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-white p-3 rounded-lg border">
            <div className="flex items-center gap-4 text-sm">
              {consultationType === 'chat' && <MessageCircle className="h-4 w-4" />}
              {consultationType === 'call' && <Phone className="h-4 w-4" />}
              {consultationType === 'video' && <Video className="h-4 w-4" />}
              <span className="capitalize">{consultationType} consultation</span>
              <span>•</span>
              <span>{duration} minutes</span>
              <span>•</span>
              <span>₹{amount}</span>
            </div>
          </div>
          
          <Button 
            onClick={handleJoinQueue}
            disabled={isJoiningQueue}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {isJoiningQueue ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Start Consultation Now
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Astrologer is busy, show queue option
  return (
    <Card className="border-2 border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-700">
          <Users className="h-5 w-5" />
          Currently Busy
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Queue Status */}
        <div className="bg-white p-3 rounded-lg border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">People in queue</span>
            <Badge variant="secondary">{queueStatus.queueLength}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Estimated wait time</span>
            <span className="text-lg font-bold text-blue-600">
              {Math.ceil(queueStatus.estimatedWaitTime)} min
            </span>
          </div>
        </div>

        {/* Service Details */}
        <div className="bg-white p-3 rounded-lg border">
          <div className="flex items-center gap-4 text-sm">
            {consultationType === 'chat' && <MessageCircle className="h-4 w-4" />}
            {consultationType === 'call' && <Phone className="h-4 w-4" />}
            {consultationType === 'video' && <Video className="h-4 w-4" />}
            <span className="capitalize">{consultationType} consultation</span>
            <span>•</span>
            <span>{duration} minutes</span>
            <span>•</span>
            <span>₹{amount}</span>
          </div>
        </div>

        {/* Join Queue Button */}
        <Button 
          onClick={handleJoinQueue}
          disabled={isJoiningQueue}
          className="w-full"
        >
          {isJoiningQueue ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <CreditCard className="h-4 w-4 mr-2" />
          )}
          Join Queue (Payment Required)
        </Button>
        
        <p className="text-xs text-blue-600 text-center">
          Payment secures your position in queue
        </p>
      </CardContent>
    </Card>
  );
}