import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { Button } from "src/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "src/components/ui/select";
import { Label } from "src/components/ui/label";
import { Badge } from "src/components/ui/badge";
import { Progress } from "src/components/ui/progress";
import { Heart, Users, Sparkles, Target } from "lucide-react";
import { AstrologyCalculator, ZODIAC_SIGNS } from "src/lib/astrology";

interface CompatibilityResult {
  score: number;
  overall: string;
  strengths: string[];
  challenges: string[];
  advice: string;
}

export default function CompatibilityCalculator() {
  const [person1Sign, setPerson1Sign] = useState("");
  const [person2Sign, setPerson2Sign] = useState("");
  const [result, setResult] = useState<CompatibilityResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculateCompatibility = async () => {
    if (!person1Sign || !person2Sign) return;
    
    setIsCalculating(true);
    
    // Simulate calculation delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const score = AstrologyCalculator.calculateCompatibility(person1Sign, person2Sign);
    const compatibility = generateCompatibilityReport(person1Sign, person2Sign, score);
    
    setResult(compatibility);
    setIsCalculating(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Excellent Match";
    if (score >= 80) return "Great Match";
    if (score >= 70) return "Good Match";
    if (score >= 60) return "Moderate Match";
    if (score >= 50) return "Challenging Match";
    return "Difficult Match";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Zodiac Compatibility Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Person 1 - Zodiac Sign
              </Label>
              <Select value={person1Sign} onValueChange={setPerson1Sign}>
                <SelectTrigger>
                  <SelectValue placeholder="Select zodiac sign" />
                </SelectTrigger>
                <SelectContent>
                  {ZODIAC_SIGNS.map((sign) => (
                    <SelectItem key={sign.name} value={sign.name}>
                      <div className="flex items-center gap-2">
                        <span>{sign.symbol}</span>
                        <span>{sign.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Person 2 - Zodiac Sign
              </Label>
              <Select value={person2Sign} onValueChange={setPerson2Sign}>
                <SelectTrigger>
                  <SelectValue placeholder="Select zodiac sign" />
                </SelectTrigger>
                <SelectContent>
                  {ZODIAC_SIGNS.map((sign) => (
                    <SelectItem key={sign.name} value={sign.name}>
                      <div className="flex items-center gap-2">
                        <span>{sign.symbol}</span>
                        <span>{sign.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={handleCalculateCompatibility}
            disabled={!person1Sign || !person2Sign || isCalculating}
            className="w-full"
          >
            {isCalculating ? "Calculating..." : "Calculate Compatibility"}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Compatibility Report
              </span>
              <div className="text-right">
                <div className={`text-3xl font-bold ${getScoreColor(result.score)}`}>
                  {result.score}%
                </div>
                <div className="text-sm text-gray-500">
                  {getScoreLabel(result.score)}
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Overall Compatibility */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Overall Compatibility</Label>
                <span className={`font-semibold ${getScoreColor(result.score)}`}>
                  {getScoreLabel(result.score)}
                </span>
              </div>
              <Progress value={result.score} className="h-3" />
              <p className="text-gray-700">{result.overall}</p>
            </div>

            {/* Strengths */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Target className="h-4 w-4 text-green-600" />
                Relationship Strengths
              </Label>
              <div className="space-y-2">
                {result.strengths.map((strength, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Badge variant="secondary" className="bg-green-100 text-green-800 mt-0.5">
                      ✓
                    </Badge>
                    <span className="text-sm">{strength}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Challenges */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Target className="h-4 w-4 text-yellow-600" />
                Potential Challenges
              </Label>
              <div className="space-y-2">
                {result.challenges.map((challenge, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 mt-0.5">
                      !
                    </Badge>
                    <span className="text-sm">{challenge}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Advice */}
            <div className="space-y-3">
              <Label>Relationship Advice</Label>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-800">{result.advice}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function generateCompatibilityReport(sign1: string, sign2: string, score: number): CompatibilityResult {
  const sign1Info = ZODIAC_SIGNS.find(s => s.name === sign1);
  const sign2Info = ZODIAC_SIGNS.find(s => s.name === sign2);
  
  const elementCompatibility = {
    Fire: { Fire: "high", Earth: "medium", Air: "high", Water: "low" },
    Earth: { Fire: "medium", Earth: "high", Air: "low", Water: "high" },
    Air: { Fire: "high", Earth: "low", Air: "high", Water: "medium" },
    Water: { Fire: "low", Earth: "high", Air: "medium", Water: "high" }
  };

  const compatibility = elementCompatibility[sign1Info?.element as keyof typeof elementCompatibility]?.[sign2Info?.element as keyof typeof elementCompatibility[keyof typeof elementCompatibility]] || "medium";

  const overallMessages = {
    high: `${sign1} and ${sign2} share a natural cosmic harmony. Your elements complement each other beautifully, creating a dynamic and supportive partnership.`,
    medium: `${sign1} and ${sign2} can build a strong relationship with understanding and effort. While you may have different approaches, these differences can actually strengthen your bond.`,
    low: `${sign1} and ${sign2} represent opposite energies that can either create explosive passion or challenging friction. Success requires patience, understanding, and compromise.`
  };

  const strengthsMap = {
    high: [
      "Natural understanding and communication",
      "Shared values and life perspectives",
      "Complementary strengths that support each other",
      "Strong emotional and intellectual connection",
      "Ability to inspire and motivate each other"
    ],
    medium: [
      "Opportunity for personal growth through differences",
      "Balanced perspectives that cover each other's blind spots",
      "Potential for deep learning and understanding",
      "Ability to create stability through complementary traits"
    ],
    low: [
      "Intense attraction and passionate connection",
      "Opportunity for significant personal transformation",
      "Balance through contrasting energies",
      "Potential for deep spiritual growth together"
    ]
  };

  const challengesMap = {
    high: [
      "Risk of becoming too comfortable and stagnant",
      "Potential for similar weaknesses to compound",
      "May lack the challenge needed for growth"
    ],
    medium: [
      "Different communication styles requiring patience",
      "Varying approaches to life goals and priorities",
      "Need for compromise and understanding"
    ],
    low: [
      "Fundamental differences in values and approaches",
      "Communication challenges requiring extra effort",
      "Potential for misunderstandings and conflict",
      "Need for significant patience and compromise"
    ]
  };

  const adviceMap = {
    high: "Embrace your natural connection while maintaining individual growth. Don't take your compatibility for granted - continue to nurture and appreciate each other's unique qualities.",
    medium: "Focus on open communication and finding common ground. Your differences are strengths when approached with patience and understanding. Celebrate what makes each of you unique.",
    low: "Success requires dedication, patience, and genuine effort from both partners. Focus on understanding rather than changing each other. Your differences can become your greatest strengths with proper communication and respect."
  };

  return {
    score,
    overall: overallMessages[compatibility as keyof typeof overallMessages],
    strengths: strengthsMap[compatibility as keyof typeof strengthsMap],
    challenges: challengesMap[compatibility as keyof typeof challengesMap],
    advice: adviceMap[compatibility as keyof typeof adviceMap]
  };
}