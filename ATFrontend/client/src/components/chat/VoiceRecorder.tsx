import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Square, Play, Pause, Send } from "lucide-react";
import { Button } from "src/components/ui/button";
import { Card, CardContent } from "src/components/ui/card";
import { Progress } from "src/components/ui/progress";

interface VoiceRecorderProps {
  onVoiceMessageSend: (audioBlob: Blob, duration: number) => void;
  maxDuration?: number; // in seconds
}

export default function VoiceRecorder({ 
  onVoiceMessageSend, 
  maxDuration = 120 
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);

      // Start duration timer
      intervalRef.current = setInterval(() => {
        setDuration(prev => {
          const newDuration = prev + 1;
          if (newDuration >= maxDuration) {
            stopRecording();
            return maxDuration;
          }
          return newDuration;
        });
      }, 1000);

    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        setIsPaused(false);
        
        intervalRef.current = setInterval(() => {
          setDuration(prev => {
            const newDuration = prev + 1;
            if (newDuration >= maxDuration) {
              stopRecording();
              return maxDuration;
            }
            return newDuration;
          });
        }, 1000);
      } else {
        mediaRecorderRef.current.pause();
        setIsPaused(true);
        
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    }
  };

  const playRecording = () => {
    if (audioBlob && !isPlaying) {
      const audioUrl = URL.createObjectURL(audioBlob);
      audioRef.current = new Audio(audioUrl);
      
      audioRef.current.onloadedmetadata = () => {
        setIsPlaying(true);
        audioRef.current?.play();
      };

      audioRef.current.ontimeupdate = () => {
        if (audioRef.current) {
          setPlaybackTime(audioRef.current.currentTime);
        }
      };

      audioRef.current.onended = () => {
        setIsPlaying(false);
        setPlaybackTime(0);
        URL.revokeObjectURL(audioUrl);
      };
    }
  };

  const pausePlayback = () => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const sendVoiceMessage = () => {
    if (audioBlob) {
      onVoiceMessageSend(audioBlob, duration);
      resetRecorder();
    }
  };

  const resetRecorder = () => {
    setAudioBlob(null);
    setDuration(0);
    setIsPlaying(false);
    setPlaybackTime(0);
    setIsRecording(false);
    setIsPaused(false);
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = (duration / maxDuration) * 100;

  if (audioBlob) {
    return (
      <Card className="w-full">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={isPlaying ? pausePlayback : playRecording}
              className="rounded-full"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            
            <div className="flex-1">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                <span>Voice Message</span>
                <span>{formatTime(duration)}</span>
              </div>
              <Progress 
                value={isPlaying ? (playbackTime / duration) * 100 : 100} 
                className="h-2"
              />
            </div>
            
            <Button
              variant="default"
              size="sm"
              onClick={sendVoiceMessage}
              className="rounded-full"
            >
              <Send className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={resetRecorder}
              className="rounded-full"
            >
              <Square className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isRecording) {
    return (
      <Card className="w-full">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={pauseRecording}
              className="rounded-full"
            >
              {isPaused ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </Button>
            
            <div className="flex-1">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse" />
                  {isPaused ? 'Paused' : 'Recording...'}
                </span>
                <span>{formatTime(duration)} / {formatTime(maxDuration)}</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
            
            <Button
              variant="default"
              size="sm"
              onClick={stopRecording}
              className="rounded-full"
            >
              <Square className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={startRecording}
      className="rounded-full"
      title="Record voice message"
    >
      <Mic className="w-4 h-4" />
    </Button>
  );
}