import { useState, useEffect } from 'react';
import { AlertTriangle, Clock, MapPin, RefreshCw, Info, Calendar } from 'lucide-react';
import { Button } from 'src/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'src/components/ui/card';
import { Input } from 'src/components/ui/input';
import { Label } from 'src/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'src/components/ui/select';
import AstroTickHeader from 'src/components/layout/AstroTickHeader';
import { Helmet } from 'react-helmet-async';

export default function RahuKaal() {
  const [selectedCity, setSelectedCity] = useState('Delhi');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [rahuKaalData, setRahuKaalData] = useState<any>(null);
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

  const weeklyRahuKaal = {
    'Sunday': { start: '16:30', end: '18:00', period: 'Afternoon' },
    'Monday': { start: '07:30', end: '09:00', period: 'Morning' },
    'Tuesday': { start: '15:00', end: '16:30', period: 'Afternoon' },
    'Wednesday': { start: '12:00', end: '13:30', period: 'Midday' },
    'Thursday': { start: '13:30', end: '15:00', period: 'Afternoon' },
    'Friday': { start: '10:30', end: '12:00', period: 'Late Morning' },
    'Saturday': { start: '09:00', end: '10:30', period: 'Morning' }
  };

  const isRahuKaalActive = () => {
    if (!rahuKaalData) return false;
    
    const now = new Date();
    const [startHour, startMin] = rahuKaalData.start.split(':').map(Number);
    const [endHour, endMin] = rahuKaalData.end.split(':').map(Number);
    
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;
    
    return currentTime >= startTime && currentTime < endTime;
  };

  const fetchRahuKaalData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/panchang/rahu-kaal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city: selectedCity,
          date: selectedDate
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setRahuKaalData(data.data);
      } else {
        // Fallback data based on current day
        const dayName = new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long' });
        const defaultData = weeklyRahuKaal[dayName];
        setRahuKaalData({
          ...defaultData,
          day: dayName,
          date: selectedDate,
          city: selectedCity
        });
      }
    } catch (error) {
      console.error('Error fetching Rahu Kaal:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRahuKaalData();
  }, [selectedCity, selectedDate]);

  const isActive = isRahuKaalActive();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      <Helmet>
        <title>Free Rahu Kaal Calculator | Inauspicious Timing Checker - AstroTick</title>
        <meta name="description" content="Free Rahu Kaal Calculator - Daily inauspicious Rahu kaal timings to avoid for important work and travel with authentic Vedic calculations. Know when to avoid activities." />
        <meta name="keywords" content="free rahu kaal, rahu kaal calculator, inauspicious timing, avoid rahu kaal, vedic astrology, daily rahu kaal, timing checker" />
        <link rel="canonical" href="https://astrotick.com/panchang/rahu-kaal" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Free Rahu Kaal Calculator - AstroTick" />
        <meta property="og:description" content="Free Rahu Kaal Calculator - Daily inauspicious Rahu kaal timings to avoid for important work with Vedic calculations." />
        <meta property="og:url" content="https://astrotick.com/panchang/rahu-kaal" />
        <meta property="og:type" content="website" />
        
        {/* Twitter */}
        <meta name="twitter:title" content="Free Rahu Kaal Calculator - AstroTick" />
        <meta name="twitter:description" content="Free Rahu Kaal Calculator - Daily inauspicious timing to avoid for important activities." />
        
        {/* Schema.org structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Free Rahu Kaal Calculator",
            "description": "Daily inauspicious Rahu kaal timings to avoid for important work and travel",
            "url": "https://astrotick.com/panchang/rahu-kaal",
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
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <h1 className="text-2xl md:text-4xl font-bold text-gray-900">Free Rahu Kaal Calculator</h1>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <p className="md:text-xl text-gray-600 max-w-3xl mx-auto">
              Daily inauspicious timing ruled by Rahu - avoid important activities during this period
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Rahu Kaal Calculator */}
            <Card className="border-2 border-red-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-red-500 to-orange-500 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Rahu Kaal Calculator
                </CardTitle>
                <CardDescription className="text-red-100">
                  Find Rahu Kaal timings for any date and city
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-sm font-medium text-gray-700">
                    Select Date
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="date"
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                    Select City
                  </Label>
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger className="w-full">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <SelectValue placeholder="Choose your city" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city.name} value={city.name}>
                          {city.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={fetchRahuKaalData}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Calculating...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Get Rahu Kaal
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Rahu Kaal Results */}
            <Card className={`border-2 shadow-xl ${isActive ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}>
              <CardHeader className={`${isActive ? 'bg-gradient-to-r from-red-600 to-red-700' : 'bg-gradient-to-r from-gray-600 to-gray-700'} text-white`}>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  {isActive ? 'RAHU KAAL ACTIVE' : 'Rahu Kaal Timing'}
                </CardTitle>
                <CardDescription className={isActive ? 'text-red-100' : 'text-gray-100'}>
                  {isActive ? 'Avoid important activities now' : 'Inauspicious period for today'}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {rahuKaalData ? (
                  <div className="space-y-6">
                    <div className={`p-4 rounded-lg border-2 ${isActive ? 'border-red-300 bg-red-100' : 'border-yellow-300 bg-yellow-50'}`}>
                      <div className="text-center">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          {rahuKaalData.start} - {rahuKaalData.end}
                        </h3>
                        <p className="text-gray-600 mb-1">
                          {rahuKaalData.day} • {rahuKaalData.period}
                        </p>
                        <p className="text-sm text-gray-500">
                          Duration: {(() => {
                            const [startHour, startMin] = rahuKaalData.start.split(':').map(Number);
                            const [endHour, endMin] = rahuKaalData.end.split(':').map(Number);
                            const duration = (endHour * 60 + endMin) - (startHour * 60 + startMin);
                            const hours = Math.floor(duration / 60);
                            const minutes = duration % 60;
                            return `${hours}h ${minutes}m`;
                          })()}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                        <h4 className="font-semibold text-red-800 mb-2">Avoid During Rahu Kaal:</h4>
                        <ul className="text-sm text-red-700 space-y-1">
                          <li>• Starting new ventures or business</li>
                          <li>• Important meetings and negotiations</li>
                          <li>• Travel and journeys</li>
                          <li>• Financial transactions</li>
                          <li>• Religious ceremonies</li>
                        </ul>
                      </div>

                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <h4 className="font-semibold text-green-800 mb-2">Permitted Activities:</h4>
                        <ul className="text-sm text-green-700 space-y-1">
                          <li>• Routine work and daily activities</li>
                          <li>• Study and learning</li>
                          <li>• Emergency situations</li>
                          <li>• Continuing ongoing projects</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p>Select date and city to get Rahu Kaal timings</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Weekly Rahu Kaal Schedule */}
          <Card className="mt-8 border-2 border-orange-200">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Weekly Rahu Kaal Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(weeklyRahuKaal).map(([day, timing]) => (
                  <div key={day} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="font-semibold text-gray-900 mb-2">{day}</div>
                    <div className="text-sm text-gray-600 mb-1">
                      {timing.start} - {timing.end}
                    </div>
                    <div className="text-xs text-gray-500">
                      {timing.period}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Rahu Kaal Information */}
          <Card className="mt-8 border-2 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-blue-600" />
                About Rahu Kaal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">What is Rahu Kaal?</h3>
                  <p className="text-sm text-gray-600">
                    Rahu Kaal is an inauspicious period of approximately 90 minutes that occurs daily. 
                    It's ruled by the shadow planet Rahu and is considered unfavorable for starting 
                    new activities or important ventures.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Traditional Beliefs</h3>
                  <p className="text-sm text-gray-600">
                    According to Vedic astrology, activities begun during Rahu Kaal may face 
                    obstacles, delays, or unexpected challenges. It's traditionally avoided for 
                    ceremonies, travel, and business ventures.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Calculation Method</h3>
                  <p className="text-sm text-gray-600">
                    Rahu Kaal is calculated by dividing the daylight hours into 8 equal parts. 
                    The timing varies by day of the week and changes with sunrise/sunset times.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Modern Perspective</h3>
                  <p className="text-sm text-gray-600">
                    While rooted in tradition, many view Rahu Kaal as a reminder to be more 
                    mindful and deliberate in timing important decisions and activities.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}