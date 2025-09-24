import { ChatMessageWithSender } from "@shared/schema";
import { formatTime } from "src/lib/utils";
import { cn } from "src/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "src/components/ui/avatar";
import { Check, CheckCheck, Clock, AlertCircle } from "lucide-react";

interface ChatMessageProps {
  message: ChatMessageWithSender;
  isPending?: boolean;
  currentUserId?: number;
  otherParticipant?: { name?: string; image?: string };
  deliveryStatus?: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
}

const getDeliveryStatusIcon = (status?: string) => {
  switch (status) {
    case 'sending':
      return <Clock className="h-3 w-3 text-gray-400" />;
    case 'sent':
      return <Check className="h-3 w-3 text-gray-400" />;
    case 'delivered':
      return <CheckCheck className="h-3 w-3 text-gray-400" />;
    case 'read':
      return <CheckCheck className="h-3 w-3 text-blue-400" />;
    case 'failed':
      return <AlertCircle className="h-3 w-3 text-red-400" />;
    default:
      return null;
  }
};

export default function ChatMessage({ message, isPending = false, currentUserId, otherParticipant, deliveryStatus }: ChatMessageProps) {
  const isCurrentUser = message.senderId === currentUserId;
  
  return (
    <div className={cn(
      "flex items-start space-x-3 mb-4",
      isCurrentUser ? "justify-end flex-row-reverse space-x-reverse" : "justify-start"
    )}>
      {!isCurrentUser && (
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarImage src={otherParticipant?.image || undefined} alt={otherParticipant?.name || 'User'} />
          <AvatarFallback className="text-xs">
            {(otherParticipant?.name || 'U').split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={cn(
        "p-3 rounded-lg max-w-xs",
        isCurrentUser 
          ? "bg-blue-600 text-white rounded-tr-none" 
          : "bg-gray-100 text-gray-900 rounded-tl-none",
        isPending && "opacity-70"
      )}>
        {!isCurrentUser && (
          <p className="text-xs font-medium mb-1 text-gray-600">
            {message.senderName}
          </p>
        )}
        <p className="text-sm">{message.message}</p>
        <div className={cn(
          "flex items-center justify-between mt-1",
          isCurrentUser ? "text-blue-100" : "text-gray-500"
        )}>
          <span className="text-xs">
            {formatTime(message.timestamp)}
            {isPending && " • Sending..."}
          </span>
          {isCurrentUser && deliveryStatus && (
            <div className="ml-2 flex items-center">
              {getDeliveryStatusIcon(deliveryStatus)}
            </div>
          )}
        </div>
      </div>
      
      {isCurrentUser && (
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarFallback className="text-xs bg-blue-600 text-white">
            You
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
