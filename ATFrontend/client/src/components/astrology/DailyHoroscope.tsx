import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { Button } from "src/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "src/components/ui/select";
import { Badge } from "src/components/ui/badge";
import { Calendar, Star, TrendingUp, Heart, Briefcase, Shield, Zap } from "lucide-react";
import { ZODIAC_SIGNS } from "src/lib/astrology";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "src/lib/queryClient";

interface HoroscopeReading {
  id: number;
  zodiacSign: string;
  date: string;
  generalReading: string;
  loveReading: string;
  careerReading: string;
  healthReading: string;
  luckyNumbers: number[];
  luckyColors: string[];
  compatibleSigns: string[];
  mood: string;
  energy: number;
  finance: number;
  creativity: number;
}

export default function DailyHoroscope() {
  const [selectedSign, setSelectedSign] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const { data: horoscope, isLoading, refetch } = useQuery({
    queryKey: ["/api/horoscope", selectedSign, selectedDate],
    queryFn: async () => {
      if (!selectedSign) return null;
      const result = await apiRequest(`/api/horoscope/${selectedSign}/${selectedDate}`, "GET");
      return result as HoroscopeReading;
    },
    enabled: !!selectedSign,
    retry: false,
  });

  const generateHoroscope = async () => {
    if (!selectedSign) return;
    
    try {
      await apiRequest("/api/horoscope/generate", "POST", {
        zodiacSign: selectedSign,
        date: selectedDate
      });
      refetch();
    } catch (error) {
      console.error("Failed to generate horoscope:", error);
    }
  };

  const getSignEmoji = (signName: string) => {
    const sign = ZODIAC_SIGNS.find(s => s.name === signName);
    return sign?.symbol || "⭐";
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 80) return "text-green-600";
    if (rating >= 60) return "text-yellow-600";
    if (rating >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const getRatingBars = (rating: number) => {
    const bars = Math.ceil(rating / 20);
    return Array(5).fill(0).map((_, i) => (
      <div 
        key={i} 
        className={`h-2 w-4 rounded ${i < bars ? 'bg-purple-500' : 'bg-gray-200'}`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Selection Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Your Zodiac Sign</label>
          <Select value={selectedSign} onValueChange={setSelectedSign}>
            <SelectTrigger>
              <SelectValue placeholder="Choose your sign" />
            </SelectTrigger>
            <SelectContent>
              {ZODIAC_SIGNS.map((sign) => (
                <SelectItem key={sign.name} value={sign.name}>
                  <div className="flex items-center gap-2">
                    <span>{sign.symbol}</span>
                    <span>{sign.name}</span>
                    <span className="text-xs text-gray-500">({sign.element})</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Select Date</label>
          <div className="relative">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      {selectedSign && !horoscope && !isLoading && (
        <div className="text-center py-8">
          <div className="mb-4">
            <span className="text-4xl">{getSignEmoji(selectedSign)}</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">Generate Your Horoscope</h3>
          <p className="text-gray-600 mb-4">
            Get personalized cosmic guidance for {selectedSign} on {new Date(selectedDate).toLocaleDateString()}
          </p>
          <Button onClick={generateHoroscope} className="bg-purple-600 hover:bg-purple-700">
            <Star className="h-4 w-4 mr-2" />
            Generate Reading
          </Button>
        </div>
      )}

      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {horoscope && (
        <div className="space-y-6">
          {/* Header */}
          <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <span className="text-3xl">{getSignEmoji(selectedSign)}</span>
                    {selectedSign} Horoscope
                  </h2>
                  <p className="text-purple-100">
                    {new Date(selectedDate).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-sm text-purple-200">Today's Mood</div>
                  <div className="text-xl font-semibold">{horoscope.mood}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Energy Ratings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Energy Levels
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Energy</span>
                    <span className={`text-sm font-bold ${getRatingColor(horoscope.energy)}`}>
                      {horoscope.energy}%
                    </span>
                  </div>
                  <div className="flex gap-1">{getRatingBars(horoscope.energy)}</div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Finance</span>
                    <span className={`text-sm font-bold ${getRatingColor(horoscope.finance)}`}>
                      {horoscope.finance}%
                    </span>
                  </div>
                  <div className="flex gap-1">{getRatingBars(horoscope.finance)}</div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Creativity</span>
                    <span className={`text-sm font-bold ${getRatingColor(horoscope.creativity)}`}>
                      {horoscope.creativity}%
                    </span>
                  </div>
                  <div className="flex gap-1">{getRatingBars(horoscope.creativity)}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Readings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  General Reading
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{horoscope.generalReading}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-pink-500" />
                  Love & Relationships
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{horoscope.loveReading}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-blue-500" />
                  Career & Finance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{horoscope.careerReading}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-500" />
                  Health & Wellness
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{horoscope.healthReading}</p>
              </CardContent>
            </Card>
          </div>

          {/* Lucky Elements */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Lucky Numbers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {horoscope.luckyNumbers.map((number, index) => (
                    <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-800">
                      {number}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Lucky Colors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {horoscope.luckyColors.map((color, index) => (
                    <Badge key={index} variant="outline" className="border-purple-300">
                      {color}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Compatible Signs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {horoscope.compatibleSigns.map((sign, index) => (
                    <Badge key={index} variant="outline" className="border-green-300 text-green-700">
                      {getSignEmoji(sign)} {sign}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}