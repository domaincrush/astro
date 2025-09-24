import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import { Label } from "src/components/ui/label";
import { Badge } from "src/components/ui/badge";
import { Heart, Users, Calendar, MapPin, Clock, Star } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "src/lib/queryClient";

interface MatchingData {
  name1: string;
  birthDate1: string;
  birthTime1: string;
  birthPlace1: string;
  name2: string;
  birthDate2: string;
  birthTime2: string;
  birthPlace2: string;
}

interface CompatibilityResult {
  varna: { score: number; max: number; description: string };
  vashya: { score: number; max: number; description: string };
  tara: { score: number; max: number; description: string };
  yoni: { score: number; max: number; description: string };
  graha: { score: number; max: number; description: string };
  gana: { score: number; max: number; description: string };
  rashi: { score: number; max: number; description: string };
  nadi: { score: number; max: number; description: string };
  totalScore: number;
  maxScore: number;
  percentage: number;
  boyDetails: {
    name: string;
    moonSign: string;
    nakshatra: string;
    gana: string;
  };
  girlDetails: {
    name: string;
    moonSign: string;
    nakshatra: string;
    gana: string;
  };
  mangalDosha: {
    boy: boolean;
    girl: boolean;
    cancellation: boolean;
    severity: string;
    boyHouses: number[];
    girlHouses: number[];
  };
}

export default function KundliMatchingGenerator() {
  const [matchingData, setMatchingData] = useState<MatchingData>({
    name1: "",
    birthDate1: "",
    birthTime1: "",
    birthPlace1: "",
    name2: "",
    birthDate2: "",
    birthTime2: "",
    birthPlace2: ""
  });
  const [compatibilityResult, setCompatibilityResult] = useState<CompatibilityResult | null>(null);
  const [citySuggestions1, setCitySuggestions1] = useState<string[]>([]);
  const [citySuggestions2, setCitySuggestions2] = useState<string[]>([]);
  const [showSuggestions1, setShowSuggestions1] = useState(false);
  const [showSuggestions2, setShowSuggestions2] = useState(false);

  const compatibilityMutation = useMutation({
    mutationFn: async (data: MatchingData) => {
      const response = await apiRequest("POST", "/api/kundli-matching", {
        boyDetails: {
          name: data.name1,
          dateOfBirth: data.birthDate1,
          timeOfBirth: data.birthTime1,
          placeOfBirth: data.birthPlace1,
          latitude: 13.0827,
          longitude: 80.2707
        },
        girlDetails: {
          name: data.name2,
          dateOfBirth: data.birthDate2,
          timeOfBirth: data.birthTime2,
          placeOfBirth: data.birthPlace2,
          latitude: 13.0827,
          longitude: 80.2707
        }
      });
      return response.json();
    },
    onSuccess: (result) => {
      if (result.success && result.data) {
        setCompatibilityResult(result.data);
      }
    }
  });

  const handleInputChange = (field: keyof MatchingData, value: string) => {
    setMatchingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

    // City suggestions functionality
    const popularCities = [
      'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad',
      'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam',
      'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik', 'Faridabad', 'Meerut',
      'Rajkot', 'Kalyan-Dombivali', 'Vasai-Virar', 'Varanasi', 'Srinagar', 'Aurangabad',
      'Dhanbad', 'Amritsar', 'Navi Mumbai', 'Allahabad', 'Ranchi', 'Howrah', 'Coimbatore',
      'Jabalpur', 'Gwalior', 'Vijayawada', 'Jodhpur', 'Madurai', 'Raipur', 'Kota'
    ];
  
    const handleCityInput1 = (value: string) => {
      if (value.length > 1) {
        const filtered = popularCities.filter(city => 
          city.toLowerCase().includes(value.toLowerCase())
        ).slice(0, 5);
        setCitySuggestions1(filtered);
        setShowSuggestions1(true);
      } else {
        setCitySuggestions1([]);
        setShowSuggestions1(false);
      }
    };

    const handleCityInput2 = (value: string) => {
      if (value.length > 1) {
        const filtered = popularCities.filter(city => 
          city.toLowerCase().includes(value.toLowerCase())
        ).slice(0, 5);
        setCitySuggestions2(filtered);
        setShowSuggestions2(true);
      } else {
        setCitySuggestions2([]);
        setShowSuggestions2(false);
      }
    };
  
    const selectCity1 = (city: string) => {
      setMatchingData(prev => ({ ...prev, birthPlace1: city }));
      setCitySuggestions1([]);
      setShowSuggestions1(false);
    };

    const selectCity2 = (city: string) => {
      setMatchingData(prev => ({ ...prev, birthPlace2: city }));
      setCitySuggestions2([]);
      setShowSuggestions2(false);
    };

  const handleGenerateCompatibility = () => {
    compatibilityMutation.mutate(matchingData);
  };

  const isFormValid = () => {
    return Object.values(matchingData).every(value => value.trim() !== "");
  };

  const getCompatibilityColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600 bg-green-50 border-green-200";
    if (percentage >= 60) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getScoreColor = (score: number, max: number) => {
    const percentage = (score / max) * 100;
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const boyName = urlParams.get('boyName');
    const boyBirthDate = urlParams.get('boyBirthDate');
    const boyBirthTime = urlParams.get('boyBirthTime');
    const boyBirthPlace = urlParams.get('boyBirthPlace');
    const girlName = urlParams.get('girlName');
    const girlBirthDate = urlParams.get('girlBirthDate');
    const girlBirthTime = urlParams.get('girlBirthTime');
    const girlBirthPlace = urlParams.get('girlBirthPlace');

    console.log('URL Parameters extracted:', {
      boyName, boyBirthDate, boyBirthTime, boyBirthPlace,
      girlName, girlBirthDate, girlBirthTime, girlBirthPlace
    });

    // Always update the form state with extracted parameters (empty string if null)
    setMatchingData({
      name1: boyName || '',
      birthDate1: boyBirthDate || '',
      birthTime1: boyBirthTime ? decodeURIComponent(boyBirthTime) : '',
      birthPlace1: boyBirthPlace || '',
      name2: girlName || '',
      birthDate2: girlBirthDate || '',
      birthTime2: girlBirthTime ? decodeURIComponent(girlBirthTime) : '',
      birthPlace2: girlBirthPlace || ''
    });

    console.log('Form data populated:', {
      name1: boyName || '',
      birthDate1: boyBirthDate || '',
      birthTime1: boyBirthTime ? decodeURIComponent(boyBirthTime) : '',
      birthPlace1: boyBirthPlace || '',
      name2: girlName || '',
      birthDate2: girlBirthDate || '',
      birthTime2: girlBirthTime ? decodeURIComponent(girlBirthTime) : '',
      birthPlace2: girlBirthPlace || ''
    });
  }, []);

  return (
    <Card className="bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200 shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-pink-800 text-2xl">
          <Heart className="w-6 h-6" />
          Kundli Matching (Gun Milan)
        </CardTitle>
        <p className="text-sm text-purple-600 mt-2">
          Traditional compatibility analysis based on Ashtakoot Guna Milan
        </p>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Boy's Details */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2 text-gray-800">
            <Users className="w-5 h-5" />
            Boy's Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name1" className="text-sm font-medium text-gray-700">Full Name</Label>
              <Input
                id="name1"
                name="name1"
                value={matchingData.name1}
                onChange={(e) => handleInputChange("name1", e.target.value)}
                placeholder="Enter full name"
                className="mt-1 border-gray-300 focus:border-pink-500 focus:ring-pink-500 bg-white"
                autoComplete="off"
              />
            </div>
            <div className="relative">
              <Label htmlFor="birthPlace1" className="text-sm font-medium text-gray-700">POB (Place of Birth)</Label>
              <div className="relative">
                <Input
                  id="birthPlace1"
                  name="birthPlace1"
                  value={matchingData.birthPlace1}
                  onChange={(e) => {
                    handleInputChange("birthPlace1", e.target.value);
                    handleCityInput1(e.target.value);
                  }}
                  placeholder="City, State, Country"
                  className="border-pink-200 focus:border-pink-500 focus:ring-pink-500 bg-white"
                  autoComplete="off"
                />
                <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
              {showSuggestions1 && citySuggestions1.length > 0 && (
                <div className="absolute z-50 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1">
                  {citySuggestions1.map((city, index) => (
                    <div
                      key={index}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                      onClick={() => selectCity1(city)}
                    >
                      {city}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="birthDate1">Birth Date</Label>
              <Input
                id="birthDate1"
                name="birthDate1"
                type="date"
                value={matchingData.birthDate1}
                onChange={(e) => handleInputChange("birthDate1", e.target.value)}
                className="border-pink-200 focus:border-pink-500 focus:ring-pink-500 bg-white"
              />
            </div>
            <div>
              <Label htmlFor="birthTime1">Birth Time</Label>
              <Input
                id="birthTime1"
                name="birthTime1"
                type="time"
                value={matchingData.birthTime1}
                onChange={(e) => handleInputChange("birthTime1", e.target.value)}
                className="border-pink-200 focus:border-pink-500 focus:ring-pink-500 bg-white"
              />
            </div>
          </div>
        </div>

        {/* Partner 2 Details */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Users className="w-4 h-4" />
            Partner 2 Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name2">Full Name</Label>
              <Input
                id="name2"
                name="name2"
                value={matchingData.name2}
                onChange={(e) => handleInputChange("name2", e.target.value)}
                placeholder="Enter full name"
                className="border-pink-200 focus:border-pink-500 focus:ring-pink-500 bg-white"
                autoComplete="off"
              />
            </div>
            <div className="relative">
              <Label htmlFor="birthPlace2">Birth Place</Label>
              <div className="relative">
                <Input
                  id="birthPlace2"
                  name="birthPlace2"
                  value={matchingData.birthPlace2}
                  onChange={(e) => {
                    handleInputChange("birthPlace2", e.target.value);
                    handleCityInput2(e.target.value);
                  }}
                  placeholder="City, State, Country"
                  className="border-pink-200 focus:border-pink-500 focus:ring-pink-500 bg-white"
                  autoComplete="off"
                />
                <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
              {showSuggestions2 && citySuggestions2.length > 0 && (
                <div className="absolute z-50 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1">
                  {citySuggestions2.map((city, index) => (
                    <div
                      key={index}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                      onClick={() => selectCity2(city)}
                    >
                      {city}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="birthDate2">Birth Date</Label>
              <Input
                id="birthDate2"
                name="birthDate2"
                type="date"
                value={matchingData.birthDate2}
                onChange={(e) => handleInputChange("birthDate2", e.target.value)}
                className="border-pink-200 focus:border-pink-500 focus:ring-pink-500 bg-white"
              />
            </div>
            <div>
              <Label htmlFor="birthTime2">Birth Time</Label>
              <Input
                id="birthTime2"
                name="birthTime2"
                type="time"
                value={matchingData.birthTime2}
                onChange={(e) => handleInputChange("birthTime2", e.target.value)}
                className="border-pink-200 focus:border-pink-500 focus:ring-pink-500 bg-white"
              />
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <Button
          onClick={handleGenerateCompatibility}
          disabled={!isFormValid() || compatibilityMutation.isPending}
          className="w-full bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700 text-white font-semibold py-3"
        >
          {compatibilityMutation.isPending ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Analyzing Compatibility...
            </>
          ) : (
            <>
              <Heart className="w-5 h-5 mr-2" />
              Check Kundli Compatibility
            </>
          )}
        </Button>

        {/* Compatibility Results */}
        {compatibilityResult && (
          <div className="space-y-6 border-t pt-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-pink-800 mb-2">Compatibility Analysis</h3>
              <div className={`inline-block px-6 py-3 rounded-lg border-2 ${getCompatibilityColor(compatibilityResult.percentage)}`}>
                <div className="text-3xl font-bold">{compatibilityResult.percentage}%</div>
                <div className="text-sm font-medium">{compatibilityResult.totalScore}/{compatibilityResult.maxScore} Points</div>
              </div>
              <p className="mt-2 text-lg font-semibold text-gray-700">
                {compatibilityResult.percentage >= 80 ? "Excellent Match" : 
                 compatibilityResult.percentage >= 60 ? "Good Match" : 
                 compatibilityResult.percentage >= 40 ? "Average Match" : "Needs Careful Consideration"}
              </p>
            </div>

            {/* Partner Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">{compatibilityResult.boyDetails.name}</h4>
                <div className="text-sm space-y-1">
                  <p><span className="font-medium">Moon Sign:</span> {compatibilityResult.boyDetails.moonSign}</p>
                  <p><span className="font-medium">Nakshatra:</span> {compatibilityResult.boyDetails.nakshatra}</p>
                  <p><span className="font-medium">Gana:</span> {compatibilityResult.boyDetails.gana}</p>
                </div>
              </div>
              <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
                <h4 className="font-semibold text-pink-800 mb-2">{compatibilityResult.girlDetails.name}</h4>
                <div className="text-sm space-y-1">
                  <p><span className="font-medium">Moon Sign:</span> {compatibilityResult.girlDetails.moonSign}</p>
                  <p><span className="font-medium">Nakshatra:</span> {compatibilityResult.girlDetails.nakshatra}</p>
                  <p><span className="font-medium">Gana:</span> {compatibilityResult.girlDetails.gana}</p>
                </div>
              </div>
            </div>

            {/* Guna Milan Breakdown */}
            <div className="space-y-3">
              <h4 className="font-semibold text-lg">Ashtakoot Guna Milan</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { key: 'varna', label: 'Varna', data: compatibilityResult.varna },
                  { key: 'vashya', label: 'Vashya', data: compatibilityResult.vashya },
                  { key: 'tara', label: 'Tara', data: compatibilityResult.tara },
                  { key: 'yoni', label: 'Yoni', data: compatibilityResult.yoni },
                  { key: 'graha', label: 'Graha Maitri', data: compatibilityResult.graha },
                  { key: 'gana', label: 'Gana', data: compatibilityResult.gana },
                  { key: 'rashi', label: 'Rashi', data: compatibilityResult.rashi },
                  { key: 'nadi', label: 'Nadi', data: compatibilityResult.nadi }
                ].map(({ key, label, data }) => (
                  <div key={key} className="bg-white p-3 rounded-lg border border-pink-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{label}</span>
                      <Badge variant="outline">{data.score}/{data.max}</Badge>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div 
                        className={`h-2 rounded-full ${getScoreColor(data.score, data.max)}`}
                        style={{ width: `${(data.score / data.max) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600">{data.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Mangal Dosha Analysis */}
            {compatibilityResult.mangalDosha && (
              <div className="bg-white p-4 rounded-lg border border-pink-200">
                <h4 className="font-semibold text-lg mb-3">Mangal Dosha Analysis</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-gray-700">{matchingData.name1}</div>
                    <Badge variant={compatibilityResult.mangalDosha.boy ? "destructive" : "default"}>
                      {compatibilityResult.mangalDosha.boy ? 
                        `Manglik (${compatibilityResult.mangalDosha.severity})` : 
                        "No Mangal Dosha"
                      }
                    </Badge>
                    {compatibilityResult.mangalDosha.boyHouses.length > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        Mars in houses: {compatibilityResult.mangalDosha.boyHouses.join(', ')}
                      </p>
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700">{matchingData.name2}</div>
                    <Badge variant={compatibilityResult.mangalDosha.girl ? "destructive" : "default"}>
                      {compatibilityResult.mangalDosha.girl ? 
                        `Manglik (${compatibilityResult.mangalDosha.severity})` : 
                        "No Mangal Dosha"
                      }
                    </Badge>
                    {compatibilityResult.mangalDosha.girlHouses.length > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        Mars in houses: {compatibilityResult.mangalDosha.girlHouses.join(', ')}
                      </p>
                    )}
                  </div>
                </div>
                {compatibilityResult.mangalDosha.cancellation && (
                  <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-700 font-medium">
                      ✓ Mangal Dosha Cancellation: Both partners have Mangal Dosha, which cancels the negative effects.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Analysis Summary */}
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">Compatibility Summary</h4>
                <div className="text-sm text-green-700 space-y-2">
                  <p>
                    <strong>Overall Score:</strong> {compatibilityResult.totalScore} out of {compatibilityResult.maxScore} points ({compatibilityResult.percentage}%)
                  </p>
                  <p>
                    <strong>Recommendation:</strong> {
                      compatibilityResult.percentage >= 80 ? "This is an excellent match with high compatibility across most areas." :
                      compatibilityResult.percentage >= 60 ? "This is a good match with strong compatibility in key areas." :
                      compatibilityResult.percentage >= 40 ? "This match has moderate compatibility with some areas needing attention." :
                      "This match requires careful consideration and remedial measures for better harmony."
                    }
                  </p>
                  {compatibilityResult.mangalDosha.cancellation && (
                    <p><strong>Mangal Dosha:</strong> Cancelled due to both partners having the dosha, which neutralizes negative effects.</p>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">Key Points</h4>
                <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                  <li>Gana compatibility: {compatibilityResult.boyDetails.gana} and {compatibilityResult.girlDetails.gana}</li>
                  <li>Moon signs: {compatibilityResult.boyDetails.moonSign} and {compatibilityResult.girlDetails.moonSign}</li>
                  <li>Birth stars: {compatibilityResult.boyDetails.nakshatra} and {compatibilityResult.girlDetails.nakshatra}</li>
                  <li>This analysis is based on traditional Vedic astrology principles</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}