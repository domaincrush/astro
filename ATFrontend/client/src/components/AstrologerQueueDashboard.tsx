import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from 'src/components/ui/card';
import { Button } from 'src/components/ui/button';
import { Badge } from 'src/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from 'src/components/ui/avatar';
import { Separator } from 'src/components/ui/separator';
import { 
  Loader2, 
  Users, 
  Clock, 
  Phone, 
  MessageCircle, 
  Video, 
  CheckCircle, 
  PlayCircle,
  AlertCircle,
  CreditCard
} from 'lucide-react';
import { toast } from 'src/hooks/use-toast';
import { apiRequest } from 'src/lib/queryClient';

interface QueueEntry {
  id: number;
  userId: number;
  position: number;
  consultationType: string;
  duration: number;
  amount: number;
  joinTime: string;
  estimatedWaitTime: number;
  paymentStatus: string;
  user?: {
    username: string;
    profileImage?: string;
  };
}

interface QueueStatus {
  isOnline: boolean;
  isBusy: boolean;
  queueLength: number;
  estimatedWaitTime: number;
  currentConsultation?: any;
}

interface AstrologerQueueData {
  queue: QueueEntry[];
  status: QueueStatus;
}

export default function AstrologerQueueDashboard() {
  const [isStartingConsultation, setIsStartingConsultation] = useState(false);
  const queryClient = useQueryClient();

  // Fetch astrologer's queue data
  const { data: queueData, isLoading, error } = useQuery<{ success: boolean; queue: QueueEntry[]; status: QueueStatus }>({
    queryKey: ['/api/astrologer/queue/list'],
    refetchInterval: 3000, // Refresh every 3 seconds
  });

  // Start next consultation mutation
  const startNextConsultationMutation = useMutation({
    mutationFn: () => apiRequest('/api/astrologer/queue/next', {
      method: 'POST',
    }),
    onSuccess: (data) => {
      toast({
        title: "Consultation Started",
        description: "You are now connected with the next user in queue.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/astrologer/queue/list'] });
      // Redirect to chat interface
      window.location.href = `/chat/${data.consultation.consultationId}`;
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Start Consultation",
        description: error.message || "Unable to start consultation. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleStartNextConsultation = async () => {
    setIsStartingConsultation(true);
    try {
      await startNextConsultationMutation.mutateAsync();
    } finally {
      setIsStartingConsultation(false);
    }
  };

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'chat': return <MessageCircle className="h-4 w-4" />;
      case 'call': return <Phone className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      default: return <MessageCircle className="h-4 w-4" />;
    }
  };

  const getServiceColor = (type: string) => {
    switch (type) {
      case 'chat': return 'bg-blue-100 text-blue-800';
      case 'call': return 'bg-green-100 text-green-800';
      case 'video': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="flex items-center justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Loading queue status...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-8 w-8 mx-auto mb-2 text-red-600" />
          <p className="text-red-600 font-medium">Failed to load queue data</p>
          <p className="text-sm text-gray-600">Please refresh the page to try again</p>
        </CardContent>
      </Card>
    );
  }

  const { queue, status } = queueData?.data || { queue: [], status: null };

  if (!status) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-8 w-8 mx-auto mb-2 text-red-600" />
          <p className="text-red-600 font-medium">No queue status available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${status.isOnline ? 'bg-green-100' : 'bg-gray-100'}`}>
                <div className={`h-3 w-3 rounded-full ${status.isOnline ? 'bg-green-600' : 'bg-gray-400'}`} />
              </div>
              <div>
                <p className="text-sm font-medium">Status</p>
                <p className={`text-lg font-bold ${status.isOnline ? 'text-green-600' : 'text-gray-400'}`}>
                  {status.isOnline ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-blue-100">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Queue Length</p>
                <p className="text-lg font-bold text-blue-600">{status.queueLength}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-orange-100">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Current Status</p>
                <p className={`text-lg font-bold ${status.isBusy ? 'text-orange-600' : 'text-green-600'}`}>
                  {status.isBusy ? 'Busy' : 'Available'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Consultation */}
      {status.currentConsultation && (
        <Card className="border-2 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <PlayCircle className="h-5 w-5" />
              Active Consultation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={status.currentConsultation.user?.profileImage} />
                  <AvatarFallback>
                    {status.currentConsultation.user?.username?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{status.currentConsultation.user?.username}</p>
                  <p className="text-sm text-gray-600">
                    Started {new Date(status.currentConsultation.startTime).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <Button 
                onClick={() => window.location.href = `/chat/${status.currentConsultation.consultationId}`}
                className="bg-green-600 hover:bg-green-700"
              >
                Continue Chat
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Queue Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Queue ({queue.length})
            </CardTitle>
            {!status.isBusy && queue.length > 0 && (
              <Button
                onClick={handleStartNextConsultation}
                disabled={isStartingConsultation}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isStartingConsultation ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <PlayCircle className="h-4 w-4 mr-2" />
                )}
                Start Next
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {queue.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 font-medium">No one in queue</p>
              <p className="text-sm text-gray-500">Users will appear here when they join the queue</p>
            </div>
          ) : (
            <div className="space-y-4">
              {queue.map((entry, index) => (
                <div key={entry.id} className="flex items-center gap-4 p-4 border rounded-lg bg-white">
                  {/* Position Badge */}
                  <div className="flex-shrink-0">
                    <Badge variant={index === 0 ? "default" : "secondary"} className="text-xs">
                      #{entry.position}
                    </Badge>
                  </div>

                  {/* User Info */}
                  <div className="flex items-center gap-3 flex-1">
                    <Avatar>
                      <AvatarImage src={entry.user?.profileImage} />
                      <AvatarFallback>
                        {entry.user?.username?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{entry.user?.username || 'Anonymous User'}</p>
                      <p className="text-sm text-gray-600">
                        Joined {new Date(entry.joinTime).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>

                  {/* Service Details */}
                  <div className="flex items-center gap-2">
                    <Badge className={`${getServiceColor(entry.consultationType)} border-0`}>
                      {getServiceIcon(entry.consultationType)}
                      <span className="ml-1 capitalize">{entry.consultationType}</span>
                    </Badge>
                    <span className="text-sm text-gray-600">{entry.duration}min</span>
                    <span className="text-sm font-medium">₹{entry.amount}</span>
                  </div>

                  {/* Payment Status */}
                  <div className="flex items-center gap-2">
                    {entry.paymentStatus === 'success' ? (
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm">Paid</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-orange-600">
                        <CreditCard className="h-4 w-4" />
                        <span className="text-sm">Pending</span>
                      </div>
                    )}
                  </div>

                  {/* Wait Time */}
                  <div className="flex items-center gap-1 text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">{Math.ceil(entry.estimatedWaitTime)}min</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Help Information */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <h3 className="font-medium mb-2">Queue Management Tips</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Users must pay before joining the queue to secure their position</li>
            <li>• Queue positions are updated automatically when someone leaves</li>
            <li>• Start the next consultation when you're ready to help the next user</li>
            <li>• Users receive real-time updates about their queue position</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}