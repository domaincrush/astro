import { useState } from "react";
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import { Label } from "src/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "src/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "src/components/ui/select";
import { Calendar, Clock, MapPin, Calculator, Star, TrendingUp, AlertCircle } from "lucide-react";
import { Badge } from "src/components/ui/badge";
import { Alert, AlertDescription } from "src/components/ui/alert";

interface SadeSatiData {
  moonSign: string;
  currentPhase: 'rising' | 'peak' | 'setting' | 'small-panoti-4th' | 'small-panoti-8th' | 'none';
  phaseName: string;
  startDate: string;
  endDate: string;
  duration: string;
  intensity: 'low' | 'moderate' | 'high' | 'maximum';
  keyThemes: string[];
  recommendations: string[];
  ashtakavargaStrength: number;
}

export default function SadeSatiCalculator() {
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);
  const [sadeSatiData, setSadeSatiData] = useState<SadeSatiData | null>(null);
  const [error, setError] = useState("");

  const calculateSadeSati = async () => {
    if (!birthDate || !birthTime || !birthPlace) {
      setError("Please fill in all birth details for accurate calculation");
      return;
    }

    setIsCalculating(true);
    setError("");

    try {
      const response = await fetch('/api/calculate-sade-sati', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: birthDate,
          time: birthTime,
          place: birthPlace
        })
      });

      if (!response.ok) {
        throw new Error('Calculation failed');
      }

      const data = await response.json();
      setSadeSatiData(data);
    } catch (err) {
      setError("Unable to calculate Sade Sati. Please check your birth details and try again.");
      console.error("Sade Sati calculation error:", err);
    } finally {
      setIsCalculating(false);
    }
  };

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'maximum': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPhaseIcon = (phase: string) => {
    switch (phase) {
      case 'rising': return <TrendingUp className="h-5 w-5" />;
      case 'peak': return <Star className="h-5 w-5" />;
      case 'setting': return <TrendingUp className="h-5 w-5 rotate-180" />;
      default: return <Calculator className="h-5 w-5" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="mb-6">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            <Star className="h-6 w-6 text-blue-600" />
            Authentic Sade Sati Calculator
          </CardTitle>
          <CardDescription>
            Calculate your current Sade Sati phase using authentic Vedic algorithms and Swiss Ephemeris data
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="birthDate">Birth Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="birthDate"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="birthTime">Birth Time</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="birthTime"
                  type="time"
                  value={birthTime}
                  onChange={(e) => setBirthTime(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="birthPlace">Birth Place</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="birthPlace"
                  type="text"
                  placeholder="City, Country"
                  value={birthPlace}
                  onChange={(e) => setBirthPlace(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>

          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <AlertDescription className="text-red-700">{error}</AlertDescription>
            </Alert>
          )}

          <Button 
            onClick={calculateSadeSati}
            disabled={isCalculating}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500"
            size="lg"
          >
            {isCalculating ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Calculating with Swiss Ephemeris...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Calculate Current Sade Sati Phase
              </div>
            )}
          </Button>
        </CardContent>
      </Card>

      {sadeSatiData && (
        <div className="space-y-6">
          {/* Current Phase Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getPhaseIcon(sadeSatiData.currentPhase)}
                Your Current Sade Sati Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Moon Sign</Label>
                    <p className="text-xl font-semibold">{sadeSatiData.moonSign}</p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Current Phase</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getIntensityColor(sadeSatiData.intensity)}>
                        {sadeSatiData.phaseName}
                      </Badge>
                      <span className="text-sm text-gray-500">({sadeSatiData.intensity} intensity)</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Duration</Label>
                    <p className="font-semibold">{sadeSatiData.startDate} to {sadeSatiData.endDate}</p>
                    <p className="text-sm text-gray-500">{sadeSatiData.duration}</p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Ashtakavarga Strength</Label>
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(sadeSatiData.ashtakavargaStrength / 8) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold">{sadeSatiData.ashtakavargaStrength}/8</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Themes */}
          <Card>
            <CardHeader>
              <CardTitle>Key Themes for This Phase</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {sadeSatiData.keyThemes.map((theme, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <Star className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{theme}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Personalized Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sadeSatiData.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 border-l-4 border-green-500 bg-green-50">
                    <div className="bg-green-100 rounded-full p-1">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    </div>
                    <span className="text-gray-700">{rec}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Alert className="border-blue-200 bg-blue-50">
            <Star className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Note:</strong> This calculation uses authentic Vedic algorithms with Swiss Ephemeris astronomical data. 
              For detailed remedies and personalized consultation, consider booking a session with our expert astrologers.
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
}