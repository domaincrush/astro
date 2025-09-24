import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { Button } from "src/components/ui/button";
import { Badge } from "src/components/ui/badge";
import { Input } from "src/components/ui/input";
import { Label } from "src/components/ui/label";
import { Moon, Star, Sun, Clock, Calendar, Globe, AlertTriangle, Sunrise, MapPin } from "lucide-react";
import TamilHeader from 'src/components/layout/TamilHeader';
import Footer from 'src/components/layout/Footer';
import LocationSearch from 'src/components/LocationSearch';

// Tamil Panchang Data Interface
interface TamilPanchangData {
  success: boolean;
  calculation_engine: string;
  date: string;
  location: string;
  tithi: {
    name: string;
    number: number;
    percentage: number;
    end_time: string;
    paksha: string;
    description: string;
  };
  nakshatra: {
    name: string;
    number: number;
    percentage: number;
    end_time: string;
    lord: string;
    description: string;
  };
  yoga: {
    name: string;
    number: number;
    percentage: number;
    end_time: string;
    description: string;
  };
  karana: {
    name: string;
    number: number;
    percentage: number;
    end_time: string;
    description: string;
  };
  vara: {
    name: string;
    english: string;
    number: number;
    planet_lord: string;
  };
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
  auspicious_timings: {
    abhijit_muhurta: { start: string; end: string };
    brahma_muhurta: { start: string; end: string };
    amrit_kaal: { start: string; end: string };
  };
  inauspicious_timings: {
    rahu_kaal: { start: string; end: string };
    yamaganda: { start: string; end: string };
    gulikai: { start: string; end: string };
  };
}

const TamilPanchang = () => {
  const [location] = useLocation();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    city: "Chennai",
    timezone: "Asia/Kolkata"
  });
  const [panchangData, setPanchangData] = useState<TamilPanchangData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState({ latitude: 13.0827, longitude: 80.2707 }); // Chennai coordinates

  useEffect(() => {
    // Track page view for analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID, {
        page_path: location
      });
    }
  }, []);

  // Auto-calculate panchang for Chennai on component mount
  useEffect(() => {
    const autoCalculatePanchang = async () => {
      if (!formData.date || !formData.city) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch('/api/panchang', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            date: formData.date,
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
            timezone: formData.timezone
          })
        });
        
        const data = await response.json();
        
        if (data.success) {
          setPanchangData(data);
        } else {
          setError(data.message || 'கணக்கீடு தோல்வியடைந்தது');
        }
      } catch (err) {
        setError('நெட்வொர்க் பிழை. மீண்டும் முயற்சிக்கவும்.');
        console.error('Panchang calculation error:', err);
      } finally {
        setLoading(false);
      }
    };

    // Auto-calculate on mount
    const timer = setTimeout(autoCalculatePanchang, 1000);
    return () => clearTimeout(timer);
  }, [formData.city, formData.timezone, coordinates]);

  const handleCalculate = async () => {
    if (!formData.date || !formData.city) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/panchang', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: formData.date,
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
          timezone: formData.timezone
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setPanchangData(data);
      } else {
        setError(data.message || 'கணக்கீடு தோல்வியடைந்தது');
      }
    } catch (err) {
      setError('நெட்வொர்க் பிழை. மீண்டும் முயற்சிக்கவும்.');
      console.error('Panchang calculation error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Tamil translations for various elements
  const tamilTranslations = {
    months: ['ஜனவரி', 'பிப்ரவரி', 'மார்ச்', 'ஏப்ரல்', 'மே', 'ஜூன்', 'ஜூலை', 'ஆகஸ்ட்', 'செப்டம்பர்', 'அக்டோபர்', 'நவம்பர்', 'டிசம்பர்'],
    days: ['ஞாயிறு', 'திங்கள்', 'செவ்வாய்', 'புதன்', 'வியாழன்', 'வெள்ளி', 'சனி'],
    elements: {
      tithi: 'திதி',
      nakshatra: 'நட்சத்திரம்',
      yoga: 'யோகம்',
      karana: 'கரணம்',
      vara: 'வாரம்',
      sunrise: 'சூரிய உதயம்',
      sunset: 'சூரிய அஸ்தமனம்',
      moonrise: 'சந்திர உதயம்',
      moonset: 'சந்திர அஸ்தமனம்'
    },
    buttons: {
      calculate: 'கணக்கிடு',
      today: 'இன்று'
    },
    labels: {
      date: 'தேதி',
      city: 'நகரம்',
      timezone: 'நேர மண்டலம்'
    },
    auspicious: 'சுப முகூர்த்தங்கள்',
    inauspicious: 'அசுப காலங்கள்'
  };

  const formatDateTime = (datetimeStr: string) => {
    if (!datetimeStr || datetimeStr === "N/A") return datetimeStr;
    
    if (datetimeStr.includes('-')) {
      const [datePart, timePart] = datetimeStr.split(' ', 2);
      const timeWithPeriod = datetimeStr.substring(datePart.length + 1);
      const displayDate = new Date(datePart);
      
      const dateStr = displayDate.toLocaleDateString('ta-IN', {
        month: 'short',
        day: 'numeric'
      });
      
      return `${dateStr} ${timeWithPeriod}`;
    }
    
    return datetimeStr;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      <Helmet>
        <title>இன்றைய பஞ்சாங்கம் தமிழில் | Tamil Panchang Today</title>
        <meta name="description" content="இன்றைய தமிழ் பஞ்சாங்கம். திதி, நட்சத்திரம், யோகம், கரணம், வாரம். சுப முகூர்த்த நேரங்கள் தமிழில்." />
        <meta property="og:title" content="இன்றைய பஞ்சாங்கம் தமிழில் | Tamil Panchang Today" />
        <meta property="og:description" content="இன்றைய தமிழ் பஞ்சாங்கம். திதி, நட்சத்திரம், யோகம், கரணம், வாரம். சுப முகூர்த்த நேரங்கள் தமிழில்." />
        <meta property="og:url" content={`https://astrotick.com${location}`} />
        <meta name="keywords" content="தமிழ் பஞ்சாங்கம், Tamil panchang, திதி, நட்சத்திரம், யோகம், கரணம், AstroTick Tamil" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="Tamil" />
        <meta property="og:locale" content="ta_IN" />
        <link rel="canonical" href={`https://astrotick.com${location}`} />
      </Helmet>
      
      <TamilHeader />
      
      {/* Tamil-specific hero section */}
      <section className="relative py-16 px-4 overflow-hidden bg-gradient-to-br from-purple-100 via-blue-50 to-indigo-100">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mb-6">
            <Star className="h-8 w-8 text-white" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
            வேத பஞ்சாங்கம்
          </h1>
          
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            உண்மையான வானியல் கணக்கீடுகளின் மூலம் தினசரி பிரபஞ்ச சக்திகளை கண்டறியுங்கள் - திரிக் பஞ்சாங்கம் பயன்படுத்தி
          </p>
        </div>
      </section>

      {/* Tamil Panchang Calculator */}
      <div className="container mx-auto p-6 space-y-6">
        {/* Calculator Form */}
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <Calendar className="h-6 w-6 text-purple-600" />
              இன்றைய பஞ்சாங்கம் கணக்கிடுங்கள்
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="space-y-2">
                <Label htmlFor="date">{tamilTranslations.labels.date}</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="city">{tamilTranslations.labels.city}</Label>
                <LocationSearch
                  value={formData.city}
                  onChange={(city, latitude, longitude) => {
                    setFormData(prev => ({ ...prev, city }));
                    if (latitude && longitude) {
                      setCoordinates({ latitude, longitude });
                    }
                  }}
                  placeholder="உங்கள் நகரம்..."
                />
              </div>
              
              <div className="space-y-2">
                <Label>{tamilTranslations.labels.timezone}</Label>
                <Input
                  value={formData.timezone}
                  disabled
                  className="bg-gray-50"
                />
              </div>
            </div>
            
            <div className="flex gap-4 justify-center">
              <Button
                onClick={handleCalculate}
                disabled={loading}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              >
                {loading ? 'கணக்கிடுகிறது...' : tamilTranslations.buttons.calculate}
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setFormData(prev => ({ ...prev, date: new Date().toISOString().split('T')[0] }))}
              >
                {tamilTranslations.buttons.today}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Card className="max-w-4xl mx-auto border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Panchang Results */}
        {panchangData && !loading && (
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Main Panchang Elements */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Tithi */}
              <Card className="border-orange-200">
                <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <Moon className="h-5 w-5" />
                    {tamilTranslations.elements.tithi}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="font-semibold text-lg">{panchangData.tithi?.name || 'N/A'}</div>
                    <div className="text-sm text-gray-600">
                      முடிவு: {formatDateTime(panchangData.tithi?.end_time || 'N/A')}
                    </div>
                    <div className="text-sm">பக்ஷம்: {panchangData.tithi?.paksha || 'N/A'}</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-orange-500 h-2 rounded-full" 
                        style={{ width: `${panchangData.tithi?.percentage || 0}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500">{panchangData.tithi?.percentage || 0}% முடிந்துள்ளது</div>
                  </div>
                </CardContent>
              </Card>

              {/* Nakshatra */}
              <Card className="border-blue-200">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    {tamilTranslations.elements.nakshatra}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="font-semibold text-lg">{panchangData.nakshatra?.name || 'N/A'}</div>
                    <div className="text-sm text-gray-600">
                      முடிவு: {formatDateTime(panchangData.nakshatra?.end_time || 'N/A')}
                    </div>
                    <div className="text-sm">அதிபதி: {panchangData.nakshatra?.lord || 'N/A'}</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${panchangData.nakshatra?.percentage || 0}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500">{panchangData.nakshatra?.percentage || 0}% முடிந்துள்ளது</div>
                  </div>
                </CardContent>
              </Card>

              {/* Yoga */}
              <Card className="border-green-200">
                <CardHeader className="bg-gradient-to-r from-green-500 to-teal-500 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    {tamilTranslations.elements.yoga}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="font-semibold text-lg">{panchangData.yoga?.name || 'N/A'}</div>
                    <div className="text-sm text-gray-600">
                      முடிவு: {formatDateTime(panchangData.yoga?.end_time || 'N/A')}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${panchangData.yoga?.percentage || 0}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500">{panchangData.yoga?.percentage || 0}% முடிந்துள்ளது</div>
                  </div>
                </CardContent>
              </Card>

              {/* Karana */}
              <Card className="border-purple-200">
                <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    {tamilTranslations.elements.karana}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="font-semibold text-lg">{panchangData.karana?.name || 'N/A'}</div>
                    <div className="text-sm text-gray-600">
                      முடிவு: {formatDateTime(panchangData.karana?.end_time || 'N/A')}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full" 
                        style={{ width: `${panchangData.karana?.percentage || 0}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500">{panchangData.karana?.percentage || 0}% முடிந்துள்ளது</div>
                  </div>
                </CardContent>
              </Card>

              {/* Vara (Day) */}
              <Card className="border-yellow-200">
                <CardHeader className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {tamilTranslations.elements.vara}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="font-semibold text-lg">{panchangData.vara?.name || 'N/A'}</div>
                    <div className="text-sm">அதிபதி: {panchangData.vara?.planet_lord || 'N/A'}</div>
                  </div>
                </CardContent>
              </Card>

              {/* Sun & Moon Timings */}
              <Card className="border-amber-200">
                <CardHeader className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <Sunrise className="h-5 w-5" />
                    சூரிய சந்திர காலங்கள்
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">{tamilTranslations.elements.sunrise}:</span>
                      <span className="font-medium">{panchangData.sunrise || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">{tamilTranslations.elements.sunset}:</span>
                      <span className="font-medium">{panchangData.sunset || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">{tamilTranslations.elements.moonrise}:</span>
                      <span className="font-medium">{panchangData.moonrise || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">{tamilTranslations.elements.moonset}:</span>
                      <span className="font-medium">{panchangData.moonset || 'N/A'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Auspicious & Inauspicious Timings */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Auspicious Timings */}
              <Card className="border-green-200">
                <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <Sun className="h-5 w-5" />
                    {tamilTranslations.auspicious}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <div className="font-medium">அபிஜித் முகூர்த்தம்</div>
                      <div className="text-sm text-gray-600">
                        {panchangData.auspicious_timings?.abhijit_muhurta?.start || 'N/A'} - {panchangData.auspicious_timings?.abhijit_muhurta?.end || 'N/A'}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">பிரம்ம முகூர்த்தம்</div>
                      <div className="text-sm text-gray-600">
                        {panchangData.auspicious_timings?.brahma_muhurta?.start || 'N/A'} - {panchangData.auspicious_timings?.brahma_muhurta?.end || 'N/A'}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">அமிர்த காலம்</div>
                      <div className="text-sm text-gray-600">
                        {panchangData.auspicious_timings?.amrit_kaal?.start || 'N/A'} - {panchangData.auspicious_timings?.amrit_kaal?.end || 'N/A'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Inauspicious Timings */}
              <Card className="border-red-200">
                <CardHeader className="bg-gradient-to-r from-red-500 to-pink-500 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    {tamilTranslations.inauspicious}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <div className="font-medium">ராகு காலம்</div>
                      <div className="text-sm text-gray-600">
                        {panchangData.inauspicious_timings?.rahu_kaal?.start || 'N/A'} - {panchangData.inauspicious_timings?.rahu_kaal?.end || 'N/A'}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">யமகண்டம்</div>
                      <div className="text-sm text-gray-600">
                        {panchangData.inauspicious_timings?.yamaganda?.start || 'N/A'} - {panchangData.inauspicious_timings?.yamaganda?.end || 'N/A'}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">குளிகை</div>
                      <div className="text-sm text-gray-600">
                        {panchangData.inauspicious_timings?.gulikai?.start || 'N/A'} - {panchangData.inauspicious_timings?.gulikai?.end || 'N/A'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Calculation Info */}
            <Card className="border-slate-200">
              <CardContent className="p-4">
                <div className="text-center text-sm text-gray-600">
                  <Badge variant="outline" className="mb-2">
                    கணக்கீட்டு முறை: {panchangData.calculation_engine || 'N/A'}
                  </Badge>
                  <div>தேதி: {panchangData.date ? new Date(panchangData.date).toLocaleDateString('ta-IN') : 'N/A'} | இடம்: {panchangData.location || 'N/A'}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default TamilPanchang;