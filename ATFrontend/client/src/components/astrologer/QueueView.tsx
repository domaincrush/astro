import { useQuery } from "@tanstack/react-query";
import { Users, Clock, Star, MessageCircle, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { Badge } from "src/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "src/components/ui/avatar";
import { Button } from "src/components/ui/button";

interface QueuedConsultation {
  id: number;
  userId: number;
  status: string;
  topic: string;
  duration: number;
  cost: number;
  queuePosition: number;
  estimatedWaitTime: number;
  createdAt: string;
  user: {
    id: number;
    username: string;
    email: string;
    profileImage?: string;
  };
}

interface ActiveConsultation {
  id: number;
  userId: number;
  status: string;
  topic: string;
  duration: number;
  createdAt: string;
  user: {
    id: number;
    username: string;
    email: string;
    profileImage?: string;
  };
}

export default function QueueView() {
  // Get active consultations for this astrologer
  const { data: activeConsultations = [], isLoading: activeLoading } = useQuery<ActiveConsultation[]>({
    queryKey: ["/api/astrologer/consultations/active"],
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  // Get queue for this astrologer  
  const { data: queuedConsultations = [], isLoading: queueLoading } = useQuery<QueuedConsultation[]>({
    queryKey: ["/api/astrologer/consultations/queue"],
    refetchInterval: 3000, // Refresh every 3 seconds
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatWaitTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getTotalWaitingUsers = () => {
    return queuedConsultations.length;
  };

  if (activeLoading || queueLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Active Consultation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-green-600" />
            Active Consultation
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeConsultations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No active consultation</p>
              <p className="text-sm">Next user will be activated automatically</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeConsultations.map((consultation) => (
                <div key={consultation.id} className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={consultation.user.profileImage} alt={consultation.user.username} />
                      <AvatarFallback>
                        <User className="w-6 h-6" />
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-green-800">{consultation.user.username}</h3>
                      <div className="text-sm text-green-600">
                        {consultation.topic} • {consultation.duration} minutes
                      </div>
                      <div className="text-xs text-green-500">
                        Started at {formatDate(consultation.createdAt)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-green-100 text-green-800">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                      Active Chat
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Queue Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-600" />
              Queue Status
            </div>
            <Badge variant="secondary" className="bg-amber-100 text-amber-800">
              {getTotalWaitingUsers()} waiting
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {queuedConsultations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No users in queue</p>
              <p className="text-sm">You're all caught up!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {queuedConsultations.map((consultation, index) => (
                <div key={consultation.id} className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-800 font-semibold text-sm">
                        {consultation.queuePosition}
                      </div>
                    </div>
                    
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={consultation.user.profileImage} alt={consultation.user.username} />
                      <AvatarFallback>
                        <User className="w-5 h-5" />
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <h4 className="font-medium text-amber-900">{consultation.user.username}</h4>
                      <div className="text-sm text-amber-700">
                        {consultation.topic} • {consultation.duration} minutes
                      </div>
                      <div className="text-xs text-amber-600">
                        Joined queue at {formatDate(consultation.createdAt)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-1">
                    <Badge variant="outline" className="text-amber-700 border-amber-300">
                      <Clock className="w-3 h-3 mr-1" />
                      ~{formatWaitTime(consultation.estimatedWaitTime)}
                    </Badge>
                    <div className="text-xs text-amber-600">
                      ₹{(consultation.cost / 100).toFixed(0)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Queue Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-blue-600" />
            Queue Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{getTotalWaitingUsers()}</div>
              <div className="text-sm text-muted-foreground">Users Waiting</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{activeConsultations.length}</div>
              <div className="text-sm text-muted-foreground">Active Chats</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-600">
                {queuedConsultations.length > 0 ? formatWaitTime(queuedConsultations[queuedConsultations.length - 1]?.estimatedWaitTime || 0) : '0m'}
              </div>
              <div className="text-sm text-muted-foreground">Max Wait Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                ₹{Math.round(queuedConsultations.reduce((sum, c) => sum + c.cost, 0) / 100)}
              </div>
              <div className="text-sm text-muted-foreground">Queue Revenue</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}