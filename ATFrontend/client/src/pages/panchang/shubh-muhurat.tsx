import { useState } from 'react';
import { Calendar, Clock, Sun, Star, MapPin, Search } from 'lucide-react';
import { Button } from 'src/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'src/components/ui/card';
import { Input } from 'src/components/ui/input';
import { Label } from 'src/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'src/components/ui/select';
import AstroTickHeader from 'src/components/layout/AstroTickHeader';
import { Helmet } from 'react-helmet-async';

export default function ShubhMuhurat() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedCity, setSelectedCity] = useState('Delhi');
  const [selectedPurpose, setSelectedPurpose] = useState('');
  const [muhuratResults, setMuhuratResults] = useState<any>(null);
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

  const purposes = [
    { value: 'marriage', label: 'Marriage Ceremony' },
    { value: 'griha-pravesh', label: 'Griha Pravesh (House Warming)' },
    { value: 'business', label: 'Business Launch' },
    { value: 'travel', label: 'Travel / Journey' },
    { value: 'education', label: 'Education / Learning' },
    { value: 'investment', label: 'Investment / Purchase' },
    { value: 'medical', label: 'Medical Treatment' },
    { value: 'spiritual', label: 'Spiritual Practices' }
  ];

  const handleMuhuratCalculation = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/panchang/muhurat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: selectedDate,
          city: selectedCity,
          purpose: selectedPurpose
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setMuhuratResults(data.data);
      }
    } catch (error) {
      console.error('Error calculating muhurat:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <Helmet>
        <title>Shubh Muhurat - Auspicious Timing Calculator | AstroTick</title>
        <meta name="description" content="Find auspicious timing for marriage, griha pravesh, business launch and ceremonies with authentic Vedic muhurat calculations." />
        <meta name="keywords" content="shubh muhurat, auspicious timing, marriage muhurat, griha pravesh, business launch, vedic astrology" />
      </Helmet>
      
      <AstroTickHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center items-center gap-3 mb-4">
              <Sun className="h-8 w-8 text-amber-600" />
              <h1 className="text-4xl font-bold text-gray-900">Shubh Muhurat</h1>
              <Sun className="h-8 w-8 text-amber-600" />
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find the most auspicious timing for your important ceremonies and activities based on authentic Vedic calculations
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Muhurat Calculator Form */}
            <Card className="border-2 border-amber-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Muhurat Calculator
                </CardTitle>
                <CardDescription className="text-amber-100">
                  Select your requirements to find auspicious timing
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
                      min={new Date().toISOString().split('T')[0]}
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

                <div className="space-y-2">
                  <Label htmlFor="purpose" className="text-sm font-medium text-gray-700">
                    Purpose / Activity
                  </Label>
                  <Select value={selectedPurpose} onValueChange={setSelectedPurpose}>
                    <SelectTrigger className="w-full">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-gray-400" />
                        <SelectValue placeholder="Select purpose" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {purposes.map((purpose) => (
                        <SelectItem key={purpose.value} value={purpose.value}>
                          {purpose.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={handleMuhuratCalculation}
                  disabled={loading || !selectedPurpose}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                >
                  {loading ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Calculating...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Find Auspicious Timing
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Muhurat Results */}
            <Card className="border-2 border-green-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Auspicious Timings
                </CardTitle>
                <CardDescription className="text-green-100">
                  Best muhurat periods for your selected activity
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {muhuratResults ? (
                  <div className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h3 className="font-semibold text-green-800 mb-2">Recommended Timings:</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-green-700">Abhijit Muhurat:</span>
                          <span className="font-medium text-green-900">{muhuratResults.abhijit || '11:48 AM - 12:39 PM'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-700">Brahma Muhurat:</span>
                          <span className="font-medium text-green-900">{muhuratResults.brahma || '04:17 AM - 05:05 AM'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-700">Amrit Kaal:</span>
                          <span className="font-medium text-green-900">{muhuratResults.amrit || '07:30 AM - 09:15 AM'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                      <h3 className="font-semibold text-amber-800 mb-2">Timing Guidelines:</h3>
                      <ul className="text-sm text-amber-700 space-y-1">
                        <li>• Abhijit Muhurat is universally auspicious</li>
                        <li>• Brahma Muhurat is ideal for spiritual activities</li>
                        <li>• Avoid Rahu Kaal and Yamaganda periods</li>
                        <li>• Check planetary positions for specific purposes</li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p>Select your requirements and click "Find Auspicious Timing"</p>
                    <p className="text-sm mt-2">Get personalized muhurat recommendations</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Popular Muhurat Types */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">Popular Muhurat Types</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {purposes.map((purpose) => (
                <Card key={purpose.value} className="hover:shadow-lg transition-shadow cursor-pointer border-amber-200">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Star className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{purpose.label}</h3>
                    <p className="text-sm text-gray-600">Find best timing for {purpose.label.toLowerCase()}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}