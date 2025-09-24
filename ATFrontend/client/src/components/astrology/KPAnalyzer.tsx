import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "src/components/ui/card";
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import { Label } from "src/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "src/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "src/components/ui/tabs";
import { Badge } from "src/components/ui/badge";
import { Progress } from "src/components/ui/progress";
import { AlertCircle, Star, Target, Clock, TrendingUp } from "lucide-react";
import { Alert, AlertDescription } from "src/components/ui/alert";

interface KPAnalysisData {
  cusps: Array<{
    houseNumber: number;
    longitude: number;
    sign: string;
    signLord: string;
    nakshatra: string;
    nakshatraLord: string;
    subLord: string;
  }>;
  significators: Array<{
    planet: string;
    starLord: string;
    subLord: string;
    houses: number[];
    significance: string;
    strength: number;
    resultType: 'beneficial' | 'harmful' | 'mixed';
  }>;
  prediction: {
    eventType: string;
    timing: {
      dasha: string;
      bhukti: string;
      antardasha: string;
    };
    probability: number;
    description: string;
  };
  analysis: {
    primarySignificator: any;
    favorablePerods: any[];
    challengingPeriods: any[];
  };
}

export default function KPAnalyzer() {
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    location: "",
    latitude: "",
    longitude: "",
    questionType: "general"
  });
  const [kpData, setKpData] = useState<KPAnalysisData | null>(null);
  const [loading, setLoading] = useState(false);

  const questionTypes = [
    { value: "marriage", label: "Marriage & Relationships" },
    { value: "career", label: "Career & Profession" },
    { value: "children", label: "Children & Progeny" },
    { value: "health", label: "Health & Longevity" },
    { value: "wealth", label: "Wealth & Finance" },
    { value: "education", label: "Education & Learning" },
    { value: "travel", label: "Travel & Foreign Residence" },
    { value: "general", label: "General Life Analysis" }
  ];

  const handleAnalyze = async () => {
    if (!formData.date || !formData.time || !formData.latitude || !formData.longitude) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/kp-astrology', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: formData.date,
          time: formData.time,
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
          timezone: "UTC+05:30",
          questionType: formData.questionType
        })
      });

      if (response.ok) {
        const result = await response.json();
        setKpData(result.data);
      }
    } catch (error) {
      console.error('KP Analysis error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStrengthColor = (strength: number) => {
    if (strength >= 70) return "text-green-600";
    if (strength >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const getResultBadgeVariant = (resultType: string) => {
    switch (resultType) {
      case 'beneficial': return 'default';
      case 'harmful': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">KP Astrology Analyzer</h1>
        <p className="text-muted-foreground">
          Professional Krishnamurti Paddhati analysis with authentic sublord calculations
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            Birth Details & Question
          </CardTitle>
          <CardDescription>
            Enter accurate birth details for precise KP analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date of Birth</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time of Birth</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                placeholder="e.g., 28.6139"
                value={formData.latitude}
                onChange={(e) => setFormData(prev => ({ ...prev, latitude: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                placeholder="e.g., 77.2090"
                value={formData.longitude}
                onChange={(e) => setFormData(prev => ({ ...prev, longitude: e.target.value }))}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="questionType">Question Type</Label>
            <Select value={formData.questionType} onValueChange={(value) => setFormData(prev => ({ ...prev, questionType: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select question type" />
              </SelectTrigger>
              <SelectContent>
                {questionTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={handleAnalyze} 
            disabled={loading} 
            className="w-full"
          >
            {loading ? "Analyzing..." : "Analyze with KP System"}
          </Button>
        </CardContent>
      </Card>

      {kpData && (
        <Tabs defaultValue="cusps" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="cusps">House Cusps</TabsTrigger>
            <TabsTrigger value="significators">Significators</TabsTrigger>
            <TabsTrigger value="prediction">Prediction</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="cusps" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  KP House Cusps
                </CardTitle>
                <CardDescription>
                  Accurate cusp positions with sign, nakshatra, and sublord details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {kpData.cusps.map((cusp) => (
                    <Card key={cusp.houseNumber} className="p-4">
                      <div className="text-sm font-medium mb-2">
                        House {cusp.houseNumber}
                      </div>
                      <div className="space-y-1 text-sm">
                        <div><strong>Position:</strong> {cusp.longitude.toFixed(2)}°</div>
                        <div><strong>Sign:</strong> {cusp.sign}</div>
                        <div><strong>Nakshatra:</strong> {cusp.nakshatra}</div>
                        <div><strong>Sub-lord:</strong> 
                          <Badge variant="outline" className="ml-1">
                            {cusp.subLord}
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="significators" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Four-fold Significators
                </CardTitle>
                <CardDescription>
                  Planetary significators based on authentic KP principles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {kpData.significators.map((sig, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="font-medium">{sig.planet}</div>
                        <div className="flex items-center gap-2">
                          <Badge variant={getResultBadgeVariant(sig.resultType)}>
                            {sig.resultType}
                          </Badge>
                          <div className={`text-sm font-medium ${getStrengthColor(sig.strength)}`}>
                            {sig.strength}%
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Progress value={sig.strength} className="h-2" />
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <strong>Star Lord:</strong> {sig.starLord}
                          </div>
                          <div>
                            <strong>Sub Lord:</strong> {sig.subLord}
                          </div>
                        </div>
                        <div className="text-sm">
                          <strong>Houses:</strong> {sig.houses.join(", ")}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {sig.significance}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="prediction" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Event Prediction
                </CardTitle>
                <CardDescription>
                  Timing and probability based on KP significator analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {kpData.prediction.description}
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-4">
                    <div className="text-sm font-medium mb-2">Timing Indicators</div>
                    <div className="space-y-2 text-sm">
                      <div><strong>Main Dasha:</strong> {kpData.prediction.timing.dasha}</div>
                      <div><strong>Sub Period:</strong> {kpData.prediction.timing.bhukti}</div>
                      <div><strong>Sub-Sub:</strong> {kpData.prediction.timing.antardasha}</div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="text-sm font-medium mb-2">Probability</div>
                    <div className="space-y-2">
                      <Progress value={kpData.prediction.probability} className="h-3" />
                      <div className="text-sm text-center font-medium">
                        {kpData.prediction.probability}% favorable
                      </div>
                    </div>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Detailed Analysis
                </CardTitle>
                <CardDescription>
                  Comprehensive insights based on KP methodology
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {kpData.analysis.primarySignificator && (
                  <Card className="p-4 border-primary/20">
                    <div className="text-sm font-medium mb-2 text-primary">
                      Primary Significator
                    </div>
                    <div className="text-lg font-medium">
                      {kpData.analysis.primarySignificator.planet}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {kpData.analysis.primarySignificator.significance}
                    </div>
                  </Card>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-4 border-green-200 dark:border-green-800">
                    <div className="text-sm font-medium mb-2 text-green-700 dark:text-green-400">
                      Favorable Periods ({kpData.analysis.favorablePerods.length})
                    </div>
                    <div className="space-y-1">
                      {kpData.analysis.favorablePerods.map((period, index) => (
                        <div key={index} className="text-sm">
                          {period.planet} - {period.starLord}
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card className="p-4 border-red-200 dark:border-red-800">
                    <div className="text-sm font-medium mb-2 text-red-700 dark:text-red-400">
                      Challenging Periods ({kpData.analysis.challengingPeriods.length})
                    </div>
                    <div className="space-y-1">
                      {kpData.analysis.challengingPeriods.map((period, index) => (
                        <div key={index} className="text-sm">
                          {period.planet} - {period.starLord}
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}