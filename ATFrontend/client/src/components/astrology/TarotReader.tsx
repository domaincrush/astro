import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import { Textarea } from "src/components/ui/textarea";
import { Label } from "src/components/ui/label";
import { Badge } from "src/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "src/components/ui/tabs";
import { Sparkles, Shuffle, Eye, Heart, Coins, Sword, Wand } from "lucide-react";

interface TarotCard {
  id: number;
  name: string;
  suit: string;
  arcana: 'Major' | 'Minor';
  upright: boolean;
  image: string;
  uprightMeaning: string;
  reversedMeaning: string;
  keywords: string[];
  element?: string;
  numerology?: number;
}

interface TarotSpread {
  name: string;
  positions: string[];
  description: string;
}

interface TarotReading {
  spread: TarotSpread;
  cards: TarotCard[];
  interpretation: string;
  advice: string[];
  timing: string;
  outcome: string;
}

export default function TarotReader() {
  const [question, setQuestion] = useState("");
  const [selectedSpread, setSelectedSpread] = useState("three-card");
  const [reading, setReading] = useState<TarotReading | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const spreads: { [key: string]: TarotSpread } = {
    "three-card": {
      name: "Past, Present, Future",
      positions: ["Past", "Present", "Future"],
      description: "A simple three-card spread revealing the timeline of your situation"
    },
    "celtic-cross": {
      name: "Celtic Cross",
      positions: [
        "Present Situation", "Challenge", "Distant Past", "Recent Past",
        "Possible Outcome", "Near Future", "Your Approach", "External Influences",
        "Inner Feelings", "Final Outcome"
      ],
      description: "The most comprehensive spread for deep insight into any situation"
    },
    "love": {
      name: "Love & Relationships",
      positions: ["You", "Your Partner", "Relationship Dynamic", "Challenges", "Advice"],
      description: "Focused spread for relationship questions and romantic guidance"
    },
    "career": {
      name: "Career Path",
      positions: ["Current Situation", "Hidden Influences", "Guidance", "Action to Take", "Outcome"],
      description: "Specialized spread for career and professional life questions"
    }
  };

  const majorArcana = [
    { id: 0, name: "The Fool", upright: "New beginnings, innocence, adventure", reversed: "Recklessness, naivety, poor judgment" },
    { id: 1, name: "The Magician", upright: "Manifestation, willpower, desire", reversed: "Manipulation, poor planning, untapped talents" },
    { id: 2, name: "The High Priestess", upright: "Intuition, sacred knowledge, divine feminine", reversed: "Secrets, disconnected from intuition, withdrawal" },
    { id: 3, name: "The Empress", upright: "Femininity, beauty, nature, abundance", reversed: "Creative block, dependence on others" },
    { id: 4, name: "The Emperor", upright: "Authority, establishment, structure, father figure", reversed: "Tyranny, rigidity, coldness" },
    { id: 5, name: "The Hierophant", upright: "Spiritual wisdom, religious beliefs, conformity", reversed: "Personal beliefs, freedom, challenging the status quo" },
    { id: 6, name: "The Lovers", upright: "Love, harmony, relationships, values alignment", reversed: "Disharmony, imbalance, misalignment of values" },
    { id: 7, name: "The Chariot", upright: "Control, willpower, success, determination", reversed: "Lack of control, lack of direction, aggression" },
    { id: 8, name: "Strength", upright: "Strength, courage, persuasion, influence", reversed: "Weakness, self-doubt, lack of confidence" },
    { id: 9, name: "The Hermit", upright: "Soul searching, introspection, seeking guidance", reversed: "Isolation, loneliness, withdrawal" },
    { id: 10, name: "Wheel of Fortune", upright: "Good luck, karma, life cycles, destiny", reversed: "Bad luck, lack of control, clinging to control" },
    { id: 11, name: "Justice", upright: "Justice, fairness, truth, cause and effect", reversed: "Unfairness, lack of accountability, dishonesty" },
    { id: 12, name: "The Hanged Man", upright: "Suspension, restriction, letting go", reversed: "Delays, resistance, stalling" },
    { id: 13, name: "Death", upright: "Endings, beginnings, change, transformation", reversed: "Resistance to change, personal transformation" },
    { id: 14, name: "Temperance", upright: "Balance, moderation, patience, purpose", reversed: "Imbalance, excess, self-healing, re-alignment" },
    { id: 15, name: "The Devil", upright: "Bondage, addiction, sexuality, materialism", reversed: "Release, freedom, breaking free" },
    { id: 16, name: "The Tower", upright: "Sudden change, upheaval, chaos, revelation", reversed: "Personal transformation, fear of change" },
    { id: 17, name: "The Star", upright: "Hope, faith, purpose, renewal, spirituality", reversed: "Lack of faith, despair, self-trust, disconnection" },
    { id: 18, name: "The Moon", upright: "Illusion, fear, anxiety, subconscious, intuition", reversed: "Release of fear, repressed emotion, inner confusion" },
    { id: 19, name: "The Sun", upright: "Positivity, fun, warmth, success, vitality", reversed: "Inner child, feeling down, overly optimistic" },
    { id: 20, name: "Judgement", upright: "Judgement, rebirth, inner calling, absolution", reversed: "Self-doubt, inner critic, ignoring the call" },
    { id: 21, name: "The World", upright: "Completion, integration, accomplishment, travel", reversed: "Seeking personal closure, short-cuts, delays" }
  ];

  const drawCards = async () => {
    if (!question.trim()) return;
    
    setIsDrawing(true);
    
    // Simulate card drawing with delay
    setTimeout(() => {
      const spread = spreads[selectedSpread];
      const numberOfCards = spread.positions.length;
      const drawnCards: TarotCard[] = [];
      
      // Randomly select cards
      const availableCards = [...majorArcana];
      for (let i = 0; i < numberOfCards; i++) {
        const randomIndex = Math.floor(Math.random() * availableCards.length);
        const selectedCard = availableCards.splice(randomIndex, 1)[0];
        const isUpright = Math.random() > 0.3; // 70% chance upright
        
        drawnCards.push({
          id: selectedCard.id,
          name: selectedCard.name,
          suit: "Major Arcana",
          arcana: "Major",
          upright: isUpright,
          image: `/tarot/${selectedCard.name.toLowerCase().replace(/\s+/g, '-')}.jpg`,
          uprightMeaning: selectedCard.upright,
          reversedMeaning: selectedCard.reversed,
          keywords: selectedCard.upright.split(', '),
          numerology: selectedCard.id
        });
      }
      
      // Generate interpretation
      const interpretation = generateInterpretation(question, spread, drawnCards);
      const advice = generateAdvice(drawnCards);
      const timing = generateTiming(drawnCards);
      const outcome = generateOutcome(drawnCards);
      
      setReading({
        spread,
        cards: drawnCards,
        interpretation,
        advice,
        timing,
        outcome
      });
      
      setIsDrawing(false);
    }, 2000);
  };

  const generateInterpretation = (question: string, spread: TarotSpread, cards: TarotCard[]): string => {
    const themes = cards.map(card => card.upright ? card.uprightMeaning : card.reversedMeaning);
    return `Regarding your question about "${question}", the cards reveal a complex narrative. ${themes.join('. ')}. This reading suggests a journey of personal growth and transformation.`;
  };

  const generateAdvice = (cards: TarotCard[]): string[] => {
    const advice = [
      "Trust your intuition as you navigate this situation",
      "Be open to unexpected opportunities that may arise",
      "Focus on what you can control rather than external circumstances",
      "Consider seeking guidance from trusted advisors",
      "Embrace change as a natural part of your growth"
    ];
    return advice.slice(0, 3);
  };

  const generateTiming = (cards: TarotCard[]): string => {
    const hasUrgentCards = cards.some(card => 
      card.name.includes("Tower") || card.name.includes("Death") || card.name.includes("Fool")
    );
    return hasUrgentCards ? "Within the next 1-3 months" : "Within the next 3-6 months";
  };

  const generateOutcome = (cards: TarotCard[]): string => {
    const positiveCards = cards.filter(card => 
      card.upright && (card.name.includes("Sun") || card.name.includes("Star") || card.name.includes("World"))
    ).length;
    
    if (positiveCards >= 2) {
      return "The overall energy suggests a positive outcome with personal growth and success.";
    } else if (positiveCards === 1) {
      return "Mixed energies indicate challenges that lead to eventual positive transformation.";
    } else {
      return "The cards suggest a period of learning and inner development before external success manifests.";
    }
  };

  const getCardOrientation = (upright: boolean) => upright ? "Upright" : "Reversed";
  
  const getSuitIcon = (suit: string) => {
    switch (suit.toLowerCase()) {
      case 'cups': return <Heart className="h-4 w-4" />;
      case 'pentacles': return <Coins className="h-4 w-4" />;
      case 'swords': return <Sword className="h-4 w-4" />;
      case 'wands': return <Wand className="h-4 w-4" />;
      default: return <Sparkles className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Professional Tarot Reading
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Ask a question and receive guidance through the ancient wisdom of the Tarot
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="question">Your Question</Label>
            <Textarea
              id="question"
              placeholder="What guidance do you seek? Be specific for the most accurate reading..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Choose Your Spread</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(spreads).map(([key, spread]) => (
                <div
                  key={key}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedSpread === key 
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedSpread(key)}
                >
                  <h4 className="font-medium">{spread.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{spread.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{spread.positions.length} cards</p>
                </div>
              ))}
            </div>
          </div>

          <Button
            onClick={drawCards}
            disabled={!question.trim() || isDrawing}
            className="w-full"
          >
            {isDrawing ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full mr-2" />
                Drawing Cards...
              </>
            ) : (
              <>
                <Shuffle className="h-4 w-4 mr-2" />
                Draw Cards
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {reading && (
        <Tabs defaultValue="cards" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="cards">Your Cards</TabsTrigger>
            <TabsTrigger value="interpretation">Interpretation</TabsTrigger>
            <TabsTrigger value="guidance">Guidance</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
          </TabsList>

          <TabsContent value="cards" className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold">{reading.spread.name}</h3>
              <p className="text-sm text-gray-600">{reading.spread.description}</p>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {reading.cards.map((card, index) => (
                <Card key={index} className="text-center">
                  <CardHeader className="pb-2">
                    <div className="text-sm font-medium text-purple-600">
                      {reading.spread.positions[index]}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="w-24 h-36 mx-auto bg-gradient-to-b from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        {getSuitIcon(card.suit)}
                        <div className="text-xs mt-1">{card.arcana}</div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold">{card.name}</h4>
                      <Badge 
                        variant={card.upright ? "default" : "outline"}
                        className="mt-1"
                      >
                        {getCardOrientation(card.upright)}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600">
                      {card.upright ? card.uprightMeaning : card.reversedMeaning}
                    </p>
                    
                    <div className="flex flex-wrap gap-1 justify-center">
                      {card.keywords.slice(0, 3).map((keyword, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="interpretation" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Reading Interpretation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{reading.interpretation}</p>
              </CardContent>
            </Card>
            
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Timing</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{reading.timing}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Overall Energy</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{reading.outcome}</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="guidance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Spiritual Guidance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {reading.advice.map((advice, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-purple-600 mt-1">•</span>
                      <span className="text-sm">{advice}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Meditation & Reflection</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm">Take time to meditate on the messages revealed in your cards:</p>
                <ul className="space-y-2 text-sm">
                  <li>• How do these themes relate to your current life situation?</li>
                  <li>• What actions can you take to align with the guidance offered?</li>
                  <li>• Which aspects of the reading resonate most strongly with you?</li>
                  <li>• What patterns or cycles do you notice in your life journey?</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="summary" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Reading Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Your Question:</h4>
                  <p className="text-sm italic">"{question}"</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Cards Drawn:</h4>
                  <div className="flex flex-wrap gap-2">
                    {reading.cards.map((card, index) => (
                      <Badge key={index} variant="outline">
                        {card.name} ({card.upright ? 'Upright' : 'Reversed'})
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Key Message:</h4>
                  <p className="text-sm">{reading.outcome}</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Next Steps:</h4>
                  <ul className="space-y-1">
                    {reading.advice.slice(0, 2).map((advice, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <span className="text-purple-600 mt-1">→</span>
                        {advice}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}