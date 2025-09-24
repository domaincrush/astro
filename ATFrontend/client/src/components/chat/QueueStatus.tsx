import { Clock, Users, AlertCircle, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { Badge } from "src/components/ui/badge";
import { Alert, AlertDescription } from "src/components/ui/alert";
import { Button } from "src/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "src/components/ui/dialog";
import AvailableAstrologers from "./AvailableAstrologers";

interface QueueStatusProps {
  consultation?: {
    id?: number;
    status: string;
    queuePosition?: number;
    estimatedWaitTime?: number;
    astrologerId?: number;
  };
  isLoading?: boolean;
}

export default function QueueStatus({ consultation, isLoading }: QueueStatusProps) {
  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  if (!consultation || consultation.status === "active") {
    return null;
  }

  if (consultation.status === "queued") {
    const minutes = consultation.estimatedWaitTime || 0;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    const formatTime = () => {
      if (hours > 0) {
        return `${hours}h ${remainingMinutes}m`;
      }
      return `${remainingMinutes}m`;
    };

    return (
      <div className="space-y-4 mb-4">
        <Alert className="border-amber-200 bg-amber-50">
          <Clock className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <div className="font-semibold mb-2">You're in queue</div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>Position: {consultation.queuePosition}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Est. wait: {formatTime()}</span>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="text-xs text-amber-700">
                You'll be notified when your astrologer is available.
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-xs">
                    Switch Astrologer
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Available Astrologers</DialogTitle>
                  </DialogHeader>
                  <AvailableAstrologers 
                    currentAstrologerId={consultation.astrologerId}
                    currentConsultationId={consultation.id}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (consultation.status === "completed") {
    return (
      <Alert className="mb-4 border-green-200 bg-green-50">
        <AlertCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          Your consultation has been completed. Thank you for using AstroTick!
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}