import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "src/components/ui/avatar";

interface TypingIndicatorProps {
  isTyping: boolean;
  userName: string;
  userImage?: string;
}

export default function TypingIndicator({ isTyping, userName, userImage }: TypingIndicatorProps) {
  const [dots, setDots] = useState("");

  useEffect(() => {
    if (!isTyping) {
      setDots("");
      return;
    }

    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === "...") return "";
        return prev + ".";
      });
    }, 500);

    return () => clearInterval(interval);
  }, [isTyping]);

  if (!isTyping) return null;

  return (
    <div className="flex items-center space-x-2 p-3 text-muted-foreground text-sm">
      <Avatar className="h-6 w-6">
        <AvatarImage src={userImage} alt={userName} />
        <AvatarFallback className="text-xs">
          {userName.split(' ').map(n => n[0]).join('')}
        </AvatarFallback>
      </Avatar>
      <div className="flex items-center space-x-1">
        <span>{userName} is typing</span>
        <span className="font-mono text-primary">{dots}</span>
      </div>
    </div>
  );
}