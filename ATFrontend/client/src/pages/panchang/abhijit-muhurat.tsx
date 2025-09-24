import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Star, Clock, MapPin, Sun, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from 'src/components/ui/card';
import { Badge } from 'src/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'src/components/ui/select';
import AstroTickHeader from 'src/components/layout/AstroTickHeader';

const AbhijitMuhurat: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState('Delhi');
  const [muhuratData, setMuhuratData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const cities = [
    'Delhi', 'Mumbai', 'Chennai', 'Kolkata', 'Bangalore', 'Hyderabad',
    'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Varanasi', 'Rishikesh'
  ];

  const fetchMuhuratData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/panchang/muhurat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: selectedCity,
          date: new Date().toISOString().split('T')[0]
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setMuhuratData(data.data);
      } else {
        // Fallback data
        setMuhuratData({
          abhijit_muhurat: {
            start: '11:48',
            end: '12:39',
            duration: '51 minutes'
          },
          significance: 'Most auspicious 48-minute window',
          activities: [
            'Starting new ventures',
            'Important meetings',
            'Signing contracts',
            'Making investments',
            'Beginning spiritual practices'
          ]
        });
      }
    } catch (error) {
      console.error('Error fetching muhurat data:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkIfActive = () => {
    if (!muhuratData?.abhijit_muhurat) return false;
    
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const [startHour, startMinute] = muhuratData.abhijit_muhurat.start.split(':').map(Number);
    const [endHour, endMinute] = muhuratData.abhijit_muhurat.end.split(':').map(Number);
    
    const startTime = startHour * 60 + startMinute;
    const endTime = endHour * 60 + endMinute;
    
    return currentTime >= startTime && currentTime <= endTime;
  };

  useEffect(() => {
    fetchMuhuratData();
  }, [selectedCity]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsActive(checkIfActive());
    }, 60000); // Update every minute

    setIsActive(checkIfActive());
    return () => clearInterval(interval);
  }, [muhuratData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
      <Helmet>
        <title>Free Abhijit Muhurat Calculator | Most Auspicious Time - AstroTick</title>
        <meta name="description" content="Free Abhijit Muhurat Calculator - Most auspicious 48-minute daily window for starting new ventures and important work with authentic Vedic calculations. Best time for success." />
        <meta name="keywords" content="free abhijit muhurat, abhijit muhurat calculator, auspicious time, vedic muhurat, best time, new ventures, auspicious timing" />
        <link rel="canonical" href="https://astrotick.com/panchang/abhijit-muhurat" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Free Abhijit Muhurat Calculator - AstroTick" />
        <meta property="og:description" content="Free Abhijit Muhurat Calculator - Most auspicious 48-minute daily window for starting new ventures with Vedic calculations." />
        <meta property="og:url" content="https://astrotick.com/panchang/abhijit-muhurat" />
        <meta property="og:type" content="website" />
        
        {/* Twitter */}
        <meta name="twitter:title" content="Free Abhijit Muhurat Calculator - AstroTick" />
        <meta name="twitter:description" content="Free Abhijit Muhurat Calculator - Most auspicious timing for starting new ventures." />
        
        {/* Schema.org structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Free Abhijit Muhurat Calculator",
            "description": "Most auspicious 48-minute daily window for starting new ventures",
            "url": "https://astrotick.com/panchang/abhijit-muhurat",
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
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center items-center gap-3 mb-4">
              <Star className="h-8 w-8 text-yellow-600" />
              <h1 className="text-4xl font-bold text-gray-900">Free Abhijit Muhurat</h1>
              <Sun className="h-8 w-8 text-yellow-600" />
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Most auspicious 48-minute daily window for starting new ventures and important work
            </p>
          </div>

          {/* City Selector */}
          <div className="flex justify-center mb-8">
            <Card className="w-full max-w-md">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>Select City</span>
                  </div>
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose city" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map(city => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Current Status */}
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-yellow-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Loading muhurat data...</p>
            </div>
          ) : muhuratData && (
            <>
              {/* Abhijit Muhurat Card */}
              <Card className={`mb-8 ${isActive ? 'ring-2 ring-yellow-500 bg-yellow-50' : ''}`}>
                <CardHeader>
                  <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
                    <Star className="h-6 w-6 text-yellow-600" />
                    Today's Abhijit Muhurat
                    {isActive && <Badge className="bg-green-100 text-green-800">ACTIVE NOW</Badge>}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <Clock className="h-5 w-5 text-gray-500" />
                          <span className="text-sm text-gray-600">Timing</span>
                        </div>
                        <div className="text-3xl font-bold text-yellow-600">
                          {muhuratData.abhijit_muhurat.start} - {muhuratData.abhijit_muhurat.end}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          Duration: {muhuratData.abhijit_muhurat.duration}
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-sm text-gray-600 mb-2">Location</div>
                        <div className="font-semibold text-gray-900">{selectedCity}</div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Significance</h3>
                        <p className="text-gray-700">{muhuratData.significance}</p>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Best Activities</h3>
                        <ul className="space-y-1 text-sm text-gray-700">
                          {muhuratData.activities.map((activity: string, index: number) => (
                            <li key={index} className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>
                              {activity}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Information Cards */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-yellow-800">What is Abhijit Muhurat?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 text-sm">
                      Abhijit Muhurat is the 8th muhurat of the day, occurring around midday. It's considered one of the most auspicious times in Vedic astrology, ideal for starting new ventures, making important decisions, and conducting significant activities.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-orange-800">Why is it Special?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 text-sm">
                      This muhurat is ruled by Lord Brahma and is considered self-auspicious, meaning it doesn't require additional planetary considerations. It's particularly powerful for overcoming obstacles and ensuring success in new endeavors.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Guidelines */}
              <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
                <CardHeader>
                  <CardTitle className="text-xl text-yellow-800">Abhijit Muhurat Guidelines</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-green-800 mb-3">Highly Recommended</h3>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></span>
                          <span>Starting new business ventures</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></span>
                          <span>Important meetings and negotiations</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></span>
                          <span>Signing important contracts</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></span>
                          <span>Making significant investments</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></span>
                          <span>Beginning spiritual practices</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-blue-800 mb-3">Additional Benefits</h3>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></span>
                          <span>Overrides most doshas and negative influences</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></span>
                          <span>Provides divine blessings and protection</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></span>
                          <span>Ensures success in undertaken activities</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></span>
                          <span>Removes obstacles and delays</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></span>
                          <span>Increases prosperity and good fortune</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AbhijitMuhurat;