import { useState, useEffect, useRef } from 'react';
import { useToast } from 'src/hooks/use-toast';
import { apiRequest } from 'src/lib/queryClient';

interface UseSessionTimerProps {
  consultation: any;
  onSessionEnd: () => void;
}

export const useSessionTimer = ({ consultation, onSessionEnd }: UseSessionTimerProps) => {
  const [sessionDuration, setSessionDuration] = useState(0);
  const [hasShownFiveMinuteWarning, setHasShownFiveMinuteWarning] = useState(false);
  const [hasShownOneMinuteWarning, setHasShownOneMinuteWarning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!consultation || consultation.status !== 'active') {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Calculate initial session duration based on consultation start time
    const startTime = new Date(consultation.createdAt).getTime();
    const currentTime = Date.now();
    const initialDuration = Math.floor((currentTime - startTime) / 1000);
    setSessionDuration(initialDuration);

    // Start the timer
    intervalRef.current = setInterval(() => {
      setSessionDuration(prev => {
        const newDuration = prev + 1;
        const totalAllowedSeconds = consultation.duration * 60;
        const remainingSeconds = totalAllowedSeconds - newDuration;
        const remainingMinutes = Math.floor(remainingSeconds / 60);

        // Show 5-minute warning
        if (remainingMinutes === 5 && remainingSeconds % 60 === 0 && !hasShownFiveMinuteWarning) {
          setHasShownFiveMinuteWarning(true);
          toast({
            title: "⏰ 5 Minutes Remaining",
            description: "Your consultation will end in 5 minutes. Consider extending if you need more time.",
            duration: 10000,
          });
        }

        // Show 1-minute warning
        if (remainingMinutes === 1 && remainingSeconds % 60 === 0 && !hasShownOneMinuteWarning) {
          setHasShownOneMinuteWarning(true);
          toast({
            title: "⚠️ 1 Minute Remaining",
            description: "Your consultation will end very soon. Extend now to continue.",
            duration: 8000,
          });
        }

        // Auto-end session when time expires
        if (remainingSeconds <= 0) {
          toast({
            title: "⏰ Session Ended",
            description: "Your consultation time has expired. Thank you for using AstroTick!",
            duration: 5000,
          });
          
          // End the consultation automatically
          endConsultationAutomatically();
          onSessionEnd();
          
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          
          return totalAllowedSeconds; // Cap at maximum duration
        }

        return newDuration;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [consultation, onSessionEnd, hasShownFiveMinuteWarning, hasShownOneMinuteWarning, toast]);

  const endConsultationAutomatically = async () => {
    try {
      await apiRequest(`/api/consultations/${consultation.id}/end`, {
        method: 'POST',
        body: JSON.stringify({ reason: 'Time expired' })
      });
    } catch (error) {
      console.error('Failed to end consultation automatically:', error);
    }
  };

  const getRemainingTime = () => {
    if (!consultation) return { minutes: 0, seconds: 0, total: 0 };
    
    const totalAllowedSeconds = consultation.duration * 60;
    const remainingSeconds = Math.max(0, totalAllowedSeconds - sessionDuration);
    
    return {
      minutes: Math.floor(remainingSeconds / 60),
      seconds: remainingSeconds % 60,
      total: remainingSeconds
    };
  };

  const isSessionExpired = () => {
    const remaining = getRemainingTime();
    return remaining.total <= 0;
  };

  const resetWarnings = () => {
    setHasShownFiveMinuteWarning(false);
    setHasShownOneMinuteWarning(false);
  };

  return {
    sessionDuration,
    getRemainingTime,
    isSessionExpired,
    resetWarnings
  };
};