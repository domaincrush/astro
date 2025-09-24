import { useState, useEffect } from 'react';
import { Clock, Sun, Moon, MapPin, RefreshCw, Info } from 'lucide-react';
import { Button } from 'src/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'src/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'src/components/ui/select';
import AstroTickHeader from 'src/components/layout/AstroTickHeader';
import { Helmet } from 'react-helmet-async';

export default function Choghadiya() {
  const [selectedCity, setSelectedCity] = useState('Delhi');
  const [choghadiyaData, setChoghadiyaData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const cities = [
    { name: 'Delhi', coords: '28.6139,77.2090' },
    { name: 'Mumbai', coords: '19.0760,72.8777' },
    { name: 'Chennai', coords: '13.0827,80.2707' },
    { name: 'Kolkata', coords: '22.5726,88.3639' },
    { name: 'Bangalore', coords: '12.9716,77.5946' },
    { name: 'Varanasi', coords: '25.3176,82.9739' },
    { name: 'Haridwar', coords: '29.9457,78.1642' },
    { name: 'Tirupati', coords: '13.6288,79.4192' }
  ];

  const choghadiyaTypes = {
    'amrit': { name: 'Amrit', color: 'emerald', description: 'Excellent for all activities' },
    'shubh': { name: 'Shubh', color: 'green', description: 'Good for auspicious works' },
    'labh': { name: 'Labh', color: 'blue', description: 'Favorable for gains and profits' },
    'char': { name: 'Char', color: 'purple', description: 'Good for travel and movement' },
    'udveg': { name: 'Udveg', color: 'orange', description: 'Avoid important activities' },
    'kaal': { name: 'Kaal', color: 'red', description: 'Inauspicious, avoid new ventures' },
    'rog': { name: 'Rog', color: 'red', description: 'Avoid health-related activities' }
  };

  const getCurrentChoghadiya = () => {
    if (!choghadiyaData) return null;
    
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const allPeriods = [...(choghadiyaData.day || []), ...(choghadiyaData.night || [])];
    
    for (const period of allPeriods) {
      const [startHour, startMin] = period.start.split(':').map(Number);
      const [endHour, endMin] = period.end.split(':').map(Number);
      
      const startTime = startHour * 60 + startMin;
      let endTime = endHour * 60 + endMin;
      
      // Handle midnight crossing
      if (endTime < startTime) {
        endTime += 24 * 60;
      }
      
      if (currentTime >= startTime && currentTime < endTime) {
        return period;
      }
    }
    
    return null;
  };

  const fetchChoghadiyaData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/panchang/choghadiya', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: selectedCity,
          date: new Date().toISOString().split('T')[0]
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setChoghadiyaData(data.data);
      } else {
        // Fallback data for demo
        setChoghadiyaData({
          day: [
            { name: 'Amrit', start: '05:53', end: '07:21', type: 'amrit' },
            { name: 'Kaal', start: '07:21', end: '08:49', type: 'kaal' },
            { name: 'Shubh', start: '08:49', end: '10:17', type: 'shubh' },
            { name: 'Rog', start: '10:17', end: '11:45', type: 'rog' },
            { name: 'Udveg', start: '11:45', end: '13:13', type: 'udveg' },
            { name: 'Char', start: '13:13', end: '14:41', type: 'char' },
            { name: 'Labh', start: '14:41', end: '16:09', type: 'labh' },
            { name: 'Amrit', start: '16:09', end: '17:37', type: 'amrit' }
          ],
          night: [
            { name: 'Shubh', start: '18:35', end: '20:03', type: 'shubh' },
            { name: 'Amrit', start: '20:03', end: '21:31', type: 'amrit' },
            { name: 'Char', start: '21:31', end: '22:59', type: 'char' },
            { name: 'Rog', start: '22:59', end: '00:27', type: 'rog' },
            { name: 'Kaal', start: '00:27', end: '01:55', type: 'kaal' },
            { name: 'Labh', start: '01:55', end: '03:23', type: 'labh' },
            { name: 'Udveg', start: '03:23', end: '04:51', type: 'udveg' },
            { name: 'Shubh', start: '04:51', end: '06:19', type: 'shubh' }
          ]
        });
      }
    } catch (error) {
      console.error('Error fetching choghadiya:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChoghadiyaData();
  }, [selectedCity]);

  const currentChoghadiya = getCurrentChoghadiya();

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50">
      <Helmet>
        <title>Free Choghadiya Calculator | Traditional Time Divisions - AstroTick</title>
        <meta name="description" content="Free Choghadiya Calculator - Traditional 8 time divisions for daily activities including Amrit, Shubh, Labh, Char timings with authentic Vedic calculations. Auspicious timing guide." />
        <meta name="keywords" content="free choghadiya, choghadiya calculator, vedic time, amrit kaal, shubh muhurat, traditional timings, auspicious time, vedic astrology" />
        <link rel="canonical" href="https://astrotick.com/panchang/choghadiya" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Free Choghadiya Calculator - AstroTick" />
        <meta property="og:description" content="Free Choghadiya Calculator - Traditional 8 time divisions for daily activities with authentic Vedic calculations." />
        <meta property="og:url" content="https://astrotick.com/panchang/choghadiya" />
        <meta property="og:type" content="website" />
        
        {/* Twitter */}
        <meta name="twitter:title" content="Free Choghadiya Calculator - AstroTick" />
        <meta name="twitter:description" content="Free Choghadiya Calculator - Traditional 8 time divisions for daily activities with Vedic calculations." />
        
        {/* Schema.org structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Free Choghadiya Calculator",
            "description": "Traditional 8 time divisions for daily activities with authentic Vedic calculations",
            "url": "https://astrotick.com/panchang/choghadiya",
            "applicationCategory": "LifestyleApplication",
            "operatingSystem": "Web Browser",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          })}
        </script>
      </Helmet>
      
      <AstroTickHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center items-center gap-3 mb-4">
              <Clock className="h-8 w-8 text-blue-600" />
              <h1 className="text-4xl font-bold text-gray-900">Free Choghadiya Calculator</h1>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Traditional 8 time divisions for daily activities based on ancient Vedic wisdom
            </p>
          </div>

          {/* City Selector */}
          <div className="flex justify-center mb-8">
            <Card className="w-full max-w-md">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>Select your city</span>
                  </div>
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city.name} value={city.name}>
                          {city.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button 
                    onClick={fetchChoghadiyaData}
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Update Choghadiya
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Current Choghadiya */}
          {currentChoghadiya && (
            <Card className="mb-8 border-2 border-blue-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Current Choghadiya
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className={`inline-block px-6 py-3 rounded-full text-white font-semibold text-lg mb-4 bg-gradient-to-r ${
                    choghadiyaTypes[currentChoghadiya.type]?.color === 'emerald' ? 'from-emerald-500 to-green-500' :
                    choghadiyaTypes[currentChoghadiya.type]?.color === 'green' ? 'from-green-500 to-green-600' :
                    choghadiyaTypes[currentChoghadiya.type]?.color === 'blue' ? 'from-blue-500 to-blue-600' :
                    choghadiyaTypes[currentChoghadiya.type]?.color === 'purple' ? 'from-purple-500 to-purple-600' :
                    choghadiyaTypes[currentChoghadiya.type]?.color === 'orange' ? 'from-orange-500 to-orange-600' :
                    'from-red-500 to-red-600'
                  }`}>
                    {currentChoghadiya.name}
                  </div>
                  <p className="text-gray-600 mb-2">
                    {currentChoghadiya.start} - {currentChoghadiya.end}
                  </p>
                  <p className="text-sm text-gray-500">
                    {choghadiyaTypes[currentChoghadiya.type]?.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Day and Night Choghadiya */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Day Choghadiya */}
            <Card className="shadow-xl border-2 border-yellow-200">
              <CardHeader className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Sun className="h-5 w-5" />
                  Day Choghadiya
                </CardTitle>
                <CardDescription className="text-yellow-100">
                  From sunrise to sunset
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {choghadiyaData?.day?.map((period, index) => {
                  const typeInfo = choghadiyaTypes[period.type];
                  return (
                    <div key={index} className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full ${
                            typeInfo?.color === 'emerald' ? 'bg-emerald-500' :
                            typeInfo?.color === 'green' ? 'bg-green-500' :
                            typeInfo?.color === 'blue' ? 'bg-blue-500' :
                            typeInfo?.color === 'purple' ? 'bg-purple-500' :
                            typeInfo?.color === 'orange' ? 'bg-orange-500' :
                            'bg-red-500'
                          }`}></div>
                          <div>
                            <div className="font-semibold text-gray-900">{period.name}</div>
                            <div className="text-sm text-gray-500">{typeInfo?.description}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-gray-900">{period.start} - {period.end}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Night Choghadiya */}
            <Card className="shadow-xl border-2 border-indigo-200">
              <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Moon className="h-5 w-5" />
                  Night Choghadiya
                </CardTitle>
                <CardDescription className="text-indigo-100">
                  From sunset to sunrise
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {choghadiyaData?.night?.map((period, index) => {
                  const typeInfo = choghadiyaTypes[period.type];
                  return (
                    <div key={index} className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full ${
                            typeInfo?.color === 'emerald' ? 'bg-emerald-500' :
                            typeInfo?.color === 'green' ? 'bg-green-500' :
                            typeInfo?.color === 'blue' ? 'bg-blue-500' :
                            typeInfo?.color === 'purple' ? 'bg-purple-500' :
                            typeInfo?.color === 'orange' ? 'bg-orange-500' :
                            'bg-red-500'
                          }`}></div>
                          <div>
                            <div className="font-semibold text-gray-900">{period.name}</div>
                            <div className="text-sm text-gray-500">{typeInfo?.description}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-gray-900">{period.start} - {period.end}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Choghadiya Guide */}
          <Card className="mt-8 border-2 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-blue-600" />
                Choghadiya Guide
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(choghadiyaTypes).map(([key, info]) => (
                  <div key={key} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`w-6 h-6 rounded-full mt-1 ${
                      info.color === 'emerald' ? 'bg-emerald-500' :
                      info.color === 'green' ? 'bg-green-500' :
                      info.color === 'blue' ? 'bg-blue-500' :
                      info.color === 'purple' ? 'bg-purple-500' :
                      info.color === 'orange' ? 'bg-orange-500' :
                      'bg-red-500'
                    }`}></div>
                    <div>
                      <div className="font-semibold text-gray-900">{info.name}</div>
                      <div className="text-sm text-gray-600">{info.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}