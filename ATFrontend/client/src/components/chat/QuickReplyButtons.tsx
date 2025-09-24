import { Button } from "src/components/ui/button";
import { Card, CardContent } from "src/components/ui/card";
import { Heart, Briefcase, Activity, Star, Clock, Users } from "lucide-react";

interface QuickReplyButtonsProps {
  onQuickReply: (message: string) => void;
  disabled?: boolean;
}

const quickReplies = [
  { text: "Career advice?", icon: Briefcase, category: "career" },
  { text: "Love life?", icon: Heart, category: "love" },
  { text: "Health concerns?", icon: Activity, category: "health" },
  { text: "Future predictions?", icon: Star, category: "future" },
  { text: "Marriage timing?", icon: Clock, category: "marriage" },
  { text: "Family matters?", icon: Users, category: "family" },
];

export default function QuickReplyButtons({ onQuickReply, disabled }: QuickReplyButtonsProps) {
  return (
    <Card className="mb-4">
      <CardContent className="p-3">
        <div className="text-sm text-muted-foreground mb-2">Quick Questions:</div>
        <div className="grid grid-cols-2 gap-2">
          {quickReplies.map((reply, index) => {
            const Icon = reply.icon;
            return (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => onQuickReply(reply.text)}
                disabled={disabled}
                className="justify-start text-xs h-8 px-2"
              >
                <Icon className="h-3 w-3 mr-1" />
                {reply.text}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}