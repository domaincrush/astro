import { useState } from "react";
import { Heart, ThumbsUp, Star, Lightbulb, CheckCircle, Plus } from "lucide-react";
import { Button } from "src/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "src/components/ui/popover";
import { cn } from "src/lib/utils";

interface Reaction {
  type: string;
  icon: React.ReactNode;
  label: string;
  count: number;
  hasReacted: boolean;
}

interface MessageReactionsProps {
  messageId: number;
  reactions?: Reaction[];
  onReactionAdd: (messageId: number, reactionType: string) => void;
  onReactionRemove: (messageId: number, reactionType: string) => void;
}

const availableReactions = [
  { type: 'like', icon: <ThumbsUp className="w-4 h-4" />, label: 'Like' },
  { type: 'love', icon: <Heart className="w-4 h-4" />, label: 'Love' },
  { type: 'helpful', icon: <Lightbulb className="w-4 h-4" />, label: 'Helpful' },
  { type: 'accurate', icon: <CheckCircle className="w-4 h-4" />, label: 'Accurate' },
  { type: 'insightful', icon: <Star className="w-4 h-4" />, label: 'Insightful' }
];

export default function MessageReactions({
  messageId,
  reactions = [],
  onReactionAdd,
  onReactionRemove
}: MessageReactionsProps) {
  const [showReactionPicker, setShowReactionPicker] = useState(false);

  const handleReactionClick = (reactionType: string) => {
    const existingReaction = reactions.find(r => r.type === reactionType);
    
    if (existingReaction?.hasReacted) {
      onReactionRemove(messageId, reactionType);
    } else {
      onReactionAdd(messageId, reactionType);
    }
    setShowReactionPicker(false);
  };

  const displayedReactions = reactions.filter(r => r.count > 0);

  return (
    <div className="flex items-center gap-1 mt-1">
      {/* Display existing reactions */}
      {displayedReactions.map((reaction) => (
        <Button
          key={reaction.type}
          variant="ghost"
          size="sm"
          className={cn(
            "h-6 px-2 text-xs rounded-full border",
            reaction.hasReacted 
              ? "bg-primary/10 border-primary text-primary" 
              : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
          )}
          onClick={() => handleReactionClick(reaction.type)}
        >
          {reaction.icon}
          <span className="ml-1">{reaction.count}</span>
        </Button>
      ))}

      {/* Add reaction button */}
      <Popover open={showReactionPicker} onOpenChange={setShowReactionPicker}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <Plus className="w-3 h-3" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2" align="start">
          <div className="grid grid-cols-5 gap-1">
            {availableReactions.map((reaction) => {
              const existingReaction = reactions.find(r => r.type === reaction.type);
              const hasReacted = existingReaction?.hasReacted || false;
              
              return (
                <Button
                  key={reaction.type}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-8 w-8 p-0 rounded-full",
                    hasReacted 
                      ? "bg-primary/10 text-primary" 
                      : "text-gray-600 hover:bg-gray-100"
                  )}
                  onClick={() => handleReactionClick(reaction.type)}
                  title={reaction.label}
                >
                  {reaction.icon}
                </Button>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}