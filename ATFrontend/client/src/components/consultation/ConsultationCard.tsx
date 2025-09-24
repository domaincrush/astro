import { Star, MessageCircle, Calendar, Clock } from "lucide-react";
import { Card, CardContent } from "src/components/ui/card";
import { Button } from "src/components/ui/button";
import { Badge } from "src/components/ui/badge";
import { ConsultationWithAstrologer } from "@shared/schema";
import { formatDate, formatDuration, formatPrice } from "src/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "src/lib/queryClient";
import { useLocation } from "wouter";
import { useToast } from "src/hooks/use-toast";

interface ConsultationCardProps {
  consultation: ConsultationWithAstrologer;
  showActions?: boolean;
}

export default function ConsultationCard({ consultation, showActions = false }: ConsultationCardProps) {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const endSessionMutation = useMutation({
    mutationFn: async (consultationId: number) => {
      const response = await apiRequest("POST", `/api/consultations/${consultationId}/end`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Session ended",
        description: "Your consultation has been ended successfully.",
      });
      // Invalidate consultations query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["/api/consultations/user"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to end session. Please try again.",
        variant: "destructive",
      });
      console.error("Failed to end session:", error);
    },
  });

  const handleResumeChat = () => {
    // Navigate to chat page with consultation ID
    setLocation(`/chat?consultation=${consultation.id}`);
  };

  const handleEndSession = () => {
    if (confirm("Are you sure you want to end this session? This action cannot be undone.")) {
      endSessionMutation.mutate(consultation.id);
    }
  };

  const handleRebook = () => {
    // Navigate to astrologer detail page for rebooking
    const astrologerSlug = consultation.astrologer.name.toLowerCase().replace(/\s+/g, '-');
    setLocation(`/astrologer/${astrologerSlug}`);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex text-mystical-gold">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`h-4 w-4 ${i < rating ? 'fill-current' : ''}`} 
          />
        ))}
      </div>
    );
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src={consultation.astrologer.image} 
              alt={consultation.astrologer.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1">
              <h4 className="font-semibold text-mystical-blue">{consultation.astrologer.name}</h4>
              <p className="text-gray-600 text-sm">{consultation.topic}</p>
              <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {formatDate(consultation.createdAt)}
                </div>
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatDuration(consultation.duration)}
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center space-x-2 mb-2">
              <Badge 
                variant={consultation.status === "active" ? "default" : "secondary"}
                className={consultation.status === "active" ? "bg-green-600" : ""}
              >
                {consultation.status}
              </Badge>
              <span className="text-sm font-semibold text-mystical-blue">
                {formatPrice(consultation.cost)}
              </span>
            </div>
            
            {consultation.rating && (
              <div className="flex items-center justify-end mb-2">
                {renderStars(consultation.rating)}
              </div>
            )}
            
            {showActions && (
              <div className="flex space-x-2">
                {consultation.status === "active" ? (
                  <>
                    <Button 
                      size="sm" 
                      className="bg-mystical-gold text-mystical-blue hover:bg-yellow-400"
                      onClick={handleResumeChat}
                    >
                      <MessageCircle className="h-3 w-3 mr-1" />
                      Resume
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={handleEndSession}
                      disabled={endSessionMutation.isPending}
                    >
                      {endSessionMutation.isPending ? "Ending..." : "End Session"}
                    </Button>
                  </>
                ) : consultation.status === "completed" ? (
                  <Button 
                    size="sm" 
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={handleRebook}
                  >
                    <MessageCircle className="h-3 w-3 mr-1" />
                    Book Again
                  </Button>
                ) : null}
              </div>
            )}
            
            {!showActions && consultation.status === "completed" && (
              <Button 
                size="sm" 
                variant="ghost" 
                className="text-mystical-blue hover:text-blue-800"
                onClick={handleRebook}
              >
                Book Again
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
