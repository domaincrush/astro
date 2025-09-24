import React, { useEffect, useState } from 'react';
import { Button } from 'src/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from 'src/components/ui/dialog';
import { Progress } from 'src/components/ui/progress';
import { Clock, AlertTriangle } from 'lucide-react';
import { useLocation } from 'wouter';
import { apiRequest } from 'src/lib/queryClient';

interface SessionTimeoutManagerProps {
  consultation: any;
  sessionDuration: number;
  onSessionEnd: () => void;
}

const SessionTimeoutManager: React.FC<SessionTimeoutManagerProps> = ({
  consultation,
  sessionDuration,
  onSessionEnd
}) => {
  const [showWarningDialog, setShowWarningDialog] = useState(false);
  const [showFinalWarning, setShowFinalWarning] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!consultation || consultation.status !== 'active') return;

    const totalAllowedSeconds = consultation.duration * 60;
    const remainingSeconds = totalAllowedSeconds - sessionDuration;
    const remainingMinutes = Math.floor(remainingSeconds / 60);

    // Show 5-minute warning dialog
    if (remainingMinutes === 5 && remainingSeconds % 60 === 0 && !showWarningDialog) {
      setShowWarningDialog(true);
    }

    // Show final 1-minute warning
    if (remainingMinutes === 1 && remainingSeconds % 60 === 0 && !showFinalWarning) {
      setShowFinalWarning(true);
    }

    // Auto-end session when time expires
    if (remainingSeconds <= 0) {
      endSessionAutomatically();
    }
  }, [sessionDuration, consultation, showWarningDialog, showFinalWarning]);

  const endSessionAutomatically = async () => {
    try {
      await apiRequest(`/api/consultations/${consultation.id}/end`, {
        method: 'POST',
        body: JSON.stringify({ reason: 'Time expired automatically' })
      });
      
      onSessionEnd();
      setLocation('/consultations');
    } catch (error) {
      console.error('Failed to end session automatically:', error);
    }
  };

  const handleExtendSession = () => {
    // Trigger the extend time modal in parent component
    setShowWarningDialog(false);
    // This would be handled by the parent component's extend functionality
  };

  const getRemainingTime = () => {
    const totalAllowedSeconds = consultation.duration * 60;
    const remainingSeconds = Math.max(0, totalAllowedSeconds - sessionDuration);
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    return { minutes, seconds, total: remainingSeconds };
  };

  const getProgressPercentage = () => {
    const totalAllowedSeconds = consultation.duration * 60;
    const usedSeconds = sessionDuration;
    return Math.min(100, (usedSeconds / totalAllowedSeconds) * 100);
  };

  const remaining = getRemainingTime();

  return (
    <>
      {/* 5-Minute Warning Dialog */}
      <Dialog open={showWarningDialog} onOpenChange={setShowWarningDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              5 Minutes Remaining
            </DialogTitle>
            <DialogDescription>
              Your consultation will end in 5 minutes. Would you like to extend your session?
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span>Time Used:</span>
              <span className="font-mono">{Math.floor(sessionDuration / 60)}:{(sessionDuration % 60).toString().padStart(2, '0')}</span>
            </div>
            <Progress value={getProgressPercentage()} className="w-full" />
            <div className="text-center text-sm text-gray-600">
              Extend now to continue your consultation
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowWarningDialog(false)}
              className="flex-1"
            >
              Continue Without Extending
            </Button>
            <Button
              onClick={handleExtendSession}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Extend Session
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Final 1-Minute Warning Dialog */}
      <Dialog open={showFinalWarning} onOpenChange={setShowFinalWarning}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-red-600" />
              Final Warning: 1 Minute Left
            </DialogTitle>
            <DialogDescription>
              Your consultation will end in 1 minute. This is your last chance to extend.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-red-50 p-3 rounded-lg border border-red-200">
              <div className="text-center text-red-700 font-medium">
                {remaining.minutes}:{remaining.seconds.toString().padStart(2, '0')} remaining
              </div>
            </div>
            <Progress value={getProgressPercentage()} className="w-full" />
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowFinalWarning(false)}
              className="flex-1"
            >
              Let Session End
            </Button>
            <Button
              onClick={handleExtendSession}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              Extend Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SessionTimeoutManager;