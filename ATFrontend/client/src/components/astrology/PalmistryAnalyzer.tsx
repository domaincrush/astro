import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { Button } from "src/components/ui/button";
import { Badge } from "src/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "src/components/ui/tabs";
import { Hand, Camera, Upload, Eye, Heart, Brain, Star, TrendingUp, Shield } from "lucide-react";

interface PalmLine {
  name: string;
  description: string;
  reading: string;
  strength: 'weak' | 'moderate' | 'strong';
  significance: string[];
}

interface PalmMount {
  name: string;
  planet: string;
  characteristics: string[];
  development: 'underdeveloped' | 'normal' | 'overdeveloped';
}

interface PalmistryReading {
  dominantHand: 'left' | 'right';
  handShape: string;
  fingerTypes: string[];
  majorLines: PalmLine[];
  mounts: PalmMount[];
  specialMarks: string[];
  lifeGuidance: string[];
  careerInsights: string[];
  relationshipGuidance: string[];
  healthIndicators: string[];
}

export default function PalmistryAnalyzer() {
  const [palmImage, setPalmImage] = useState<string | null>(null);
  const [reading, setReading] = useState<PalmistryReading | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedHand, setSelectedHand] = useState<'left' | 'right'>('right');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPalmImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzePalm = async () => {
    if (!palmImage) return;
    
    setIsAnalyzing(true);
    
    // Simulate palmistry analysis
    setTimeout(() => {
      const mockReading: PalmistryReading = {
        dominantHand: selectedHand,
        handShape: "Earth Hand",
        fingerTypes: ["Square fingers", "Strong thumb", "Well-formed nails"],
        majorLines: [
          {
            name: "Life Line",
            description: "Curves around the thumb base, represents vitality and life energy",
            reading: "Deep and well-formed line indicates strong constitution and robust health. The curve suggests a balanced approach to life with good energy levels.",
            strength: "strong",
            significance: ["Strong vitality", "Good health prospects", "Balanced life approach"]
          },
          {
            name: "Head Line",
            description: "Runs across the palm horizontally, represents intellect and mental approach",
            reading: "Clear and straight line indicates practical thinking and good decision-making abilities. The length suggests thorough mental processing.",
            strength: "strong",
            significance: ["Practical mindset", "Good analytical skills", "Methodical approach"]
          },
          {
            name: "Heart Line",
            description: "Runs below the fingers, represents emotions and relationships",
            reading: "Well-curved line suggests emotional balance and capacity for deep relationships. The clarity indicates stability in emotional matters.",
            strength: "moderate",
            significance: ["Emotional stability", "Capacity for love", "Relationship harmony"]
          },
          {
            name: "Fate Line",
            description: "Vertical line in palm center, represents career and life direction",
            reading: "Present and clear line indicates strong sense of purpose and career focus. The straightness suggests determined path to success.",
            strength: "strong",
            significance: ["Clear life direction", "Career success potential", "Strong purpose"]
          }
        ],
        mounts: [
          {
            name: "Mount of Venus",
            planet: "Venus",
            characteristics: ["Love", "Passion", "Artistic abilities", "Sensuality"],
            development: "normal"
          },
          {
            name: "Mount of Jupiter",
            planet: "Jupiter",
            characteristics: ["Leadership", "Ambition", "Wisdom", "Authority"],
            development: "overdeveloped"
          },
          {
            name: "Mount of Saturn",
            planet: "Saturn",
            characteristics: ["Discipline", "Responsibility", "Seriousness", "Patience"],
            development: "normal"
          },
          {
            name: "Mount of Apollo",
            planet: "Sun",
            characteristics: ["Creativity", "Fame", "Success", "Artistic talents"],
            development: "normal"
          }
        ],
        specialMarks: [
          "Star on Mount of Jupiter (leadership success)",
          "Cross on Mount of Apollo (artistic recognition)",
          "Triangle on Head Line (exceptional intelligence)"
        ],
        lifeGuidance: [
          "Your strong life line indicates excellent health potential - maintain active lifestyle",
          "The prominent Jupiter mount suggests natural leadership abilities - pursue leadership roles",
          "Clear fate line shows strong career focus - trust your professional instincts"
        ],
        careerInsights: [
          "Natural leadership abilities make you suitable for management positions",
          "Strong analytical skills favor careers in planning, strategy, or analysis",
          "Disciplined nature suits long-term projects and responsibility-heavy roles",
          "Creative potential can be developed for artistic or innovative fields"
        ],
        relationshipGuidance: [
          "Your heart line indicates capacity for stable, long-term relationships",
          "Emotional balance helps in maintaining harmony in partnerships",
          "Venus mount development suggests appreciation for beauty and romance",
          "Leadership qualities may require balancing with partner's needs"
        ],
        healthIndicators: [
          "Strong life line suggests robust constitution and good recovery ability",
          "Clear head line indicates good mental health and stress management",
          "No major breaks in lines suggest consistent health patterns",
          "Recommendation: Regular exercise and balanced diet for optimal health"
        ]
      };
      
      setReading(mockReading);
      setIsAnalyzing(false);
    }, 3000);
  };

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'strong': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'weak': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDevelopmentColor = (development: string) => {
    switch (development) {
      case 'overdeveloped': return 'bg-blue-100 text-blue-800';
      case 'normal': return 'bg-green-100 text-green-800';
      case 'underdeveloped': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hand className="h-5 w-5" />
            Professional Palmistry Analysis
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Upload a clear image of your palm for detailed palmistry reading
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Hand Selection */}
          <div className="flex items-center gap-4">
            <label className="font-medium">Select Hand:</label>
            <div className="flex gap-2">
              <Button
                variant={selectedHand === 'right' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedHand('right')}
              >
                Right Hand (Dominant)
              </Button>
              <Button
                variant={selectedHand === 'left' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedHand('left')}
              >
                Left Hand (Passive)
              </Button>
            </div>
          </div>

          {/* Image Upload */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            {palmImage ? (
              <div className="space-y-4">
                <img
                  src={palmImage}
                  alt="Palm"
                  className="max-w-md mx-auto rounded-lg"
                />
                <div className="flex gap-2 justify-center">
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Change Image
                  </Button>
                  <Button
                    onClick={analyzePalm}
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full mr-2" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-2" />
                        Analyze Palm
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Camera className="h-12 w-12 text-gray-400 mx-auto" />
                <div>
                  <p className="text-lg font-medium">Upload Palm Image</p>
                  <p className="text-sm text-gray-600">
                    Take a clear photo of your palm in good lighting
                  </p>
                </div>
                <Button onClick={() => fileInputRef.current?.click()}>
                  <Upload className="h-4 w-4 mr-2" />
                  Choose Image
                </Button>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* Analysis Results */}
          {reading && (
            <Tabs defaultValue="lines" className="mt-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="lines">Lines</TabsTrigger>
                <TabsTrigger value="mounts">Mounts</TabsTrigger>
                <TabsTrigger value="guidance">Guidance</TabsTrigger>
                <TabsTrigger value="career">Career</TabsTrigger>
                <TabsTrigger value="health">Health</TabsTrigger>
              </TabsList>

              <TabsContent value="lines" className="space-y-4">
                <div className="grid gap-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="outline">{reading.handShape}</Badge>
                    <Badge variant="outline">{reading.dominantHand} hand</Badge>
                  </div>
                  
                  {reading.majorLines.map((line, index) => (
                    <Card key={index}>
                      <CardContent className="pt-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold">{line.name}</h4>
                            <Badge className={getStrengthColor(line.strength)}>
                              {line.strength}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{line.description}</p>
                          <p className="text-sm">{line.reading}</p>
                          <div className="flex flex-wrap gap-1">
                            {line.significance.map((sig, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {sig}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="mounts" className="space-y-4">
                <div className="grid gap-4">
                  {reading.mounts.map((mount, index) => (
                    <Card key={index}>
                      <CardContent className="pt-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold">{mount.name}</h4>
                            <div className="flex gap-2">
                              <Badge variant="outline">{mount.planet}</Badge>
                              <Badge className={getDevelopmentColor(mount.development)}>
                                {mount.development}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {mount.characteristics.map((char, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {char}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="guidance" className="space-y-4">
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Star className="h-5 w-5" />
                        Life Guidance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {reading.lifeGuidance.map((guidance, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-purple-600 mt-1">•</span>
                            <span className="text-sm">{guidance}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Heart className="h-5 w-5" />
                        Relationship Guidance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {reading.relationshipGuidance.map((guidance, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-pink-600 mt-1">•</span>
                            <span className="text-sm">{guidance}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {reading.specialMarks.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Special Marks</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1">
                          {reading.specialMarks.map((mark, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-yellow-600 mt-1">★</span>
                              <span className="text-sm">{mark}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="career" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Career Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {reading.careerInsights.map((insight, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-blue-600 mt-1">•</span>
                          <span className="text-sm">{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="health" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Health Indicators
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {reading.healthIndicators.map((indicator, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span className="text-sm">{indicator}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
}