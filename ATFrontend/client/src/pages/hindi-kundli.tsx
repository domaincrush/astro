import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import { Label } from "src/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "src/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "src/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "src/components/ui/dialog";
import { Loader2, Download, Mail } from "lucide-react";
import { useToast } from "src/hooks/use-toast";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import LocationSearch from "src/components/LocationSearch";
import { VedicDetailsDisplay } from "src/components/astrology/VedicDetailsDisplay";

interface KundliFormData {
  name: string;
  date: string;
  time: string;
  location: string;
  latitude: number;
  longitude: number;
  timezone: string;
  gender: 'male' | 'female';
}

interface Planet {
  name: string;
  longitude: number;
  sign: string;
  house: number;
  isRetrograde: boolean;
  nakshatra: string;
}

interface KundliResult {
  success: boolean;
  planets: Planet[];
  houses: any[];
  ascendant: string;
  moonSign: string;
  sunSign: string;
  nakshatra: string;
  nakshatraDetails: any;
  yogas: string[];
  doshas: string[];
  dasha: any;
  chartData: any;
  chartSvg?: string;
}

const HindiKundli = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<KundliFormData>({
    name: "",
    date: "",
    time: "",
    location: "",
    latitude: 0,
    longitude: 0,
    timezone: "",
    gender: 'male'
  });
  const [result, setResult] = useState<KundliResult | null>(null);
  
  // Email modal state for PDF reports
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailAddress, setEmailAddress] = useState('');

  const generateKundli = useMutation({
    mutationFn: async (data: KundliFormData) => {
      const response = await fetch('/api/generate-kundli', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to generate Kundli');
      return response.json();
    },
    onSuccess: (data) => {
      setResult(data);
      toast({
        title: "कुंडली तैयार हो गई / Kundli Generated",
        description: "आपकी कुंडली सफलतापूर्वक बन गई है / Your Kundli has been generated successfully"
      });
    },
    onError: (error) => {
      toast({
        title: "त्रुटि / Error",
        description: "कुंडली बनाने में समस्या आई है / Error generating Kundli",
        variant: "destructive"
      });
    }
  });

  // PDF download mutation
  const pdfDownloadMutation = useMutation({
    mutationFn: async (emailAddress?: string) => {
      if (!result) throw new Error('No kundli data available');
      
      const response = await fetch('/api/generate-pdf-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chartData: result,
          personalInfo: {
            name: formData.name,
            dateOfBirth: formData.date,
            timeOfBirth: formData.time,
            placeOfBirth: formData.location
          },
          reportType: 'hindi-kundli',
          emailAddress
        })
      });

      if (!response.ok) throw new Error('Failed to generate PDF');

      if (emailAddress) {
        return response.json();
      } else {
        return response.blob();
      }
    },
    onSuccess: (result, emailAddress) => {
      if (emailAddress) {
        toast({
          title: "ईमेल भेजा गया / Email Sent",
          description: "आपकी कुंडली रिपोर्ट ईमेल पर भेजी गई है / Your Kundli report has been sent to your email"
        });
      } else {
        // Download PDF
        const blob = result as Blob;
        const url = URL.createObjectURL(blob);
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = `${formData.name || 'kundli'}-hindi-report.pdf`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(url);
        
        toast({
          title: "PDF डाउनलोड / PDF Download",
          description: "आपकी कुंडली रिपोर्ट डाउनलोड हो गई है / Your Kundli report has been downloaded"
        });
      }
    },
    onError: (error) => {
      toast({
        title: "त्रुटि / Error",
        description: "PDF बनाने में समस्या आई है / Error generating PDF",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submission data:', formData); // Debug log
    if (!formData.name || !formData.date || !formData.time || !formData.location) {
      toast({
        title: "कृपया सभी फील्ड भरें / Please fill all fields",
        description: "सभी आवश्यक जानकारी भरना जरूरी है / All required information must be filled",
        variant: "destructive"
      });
      return;
    }
    if (formData.latitude === 0 || formData.longitude === 0) {
      toast({
        title: "कृपया स्थान चुनें / Please select location",
        description: "कृपया सुझावों से अपना शहर चुनें / Please select your city from suggestions",
        variant: "destructive"
      });
      return;
    }
    generateKundli.mutate(formData);
  };

  const handleLocationSelect = (location: string, coords: any) => {
    console.log('Location selected:', location, coords); // Debug log
    setFormData(prev => ({
      ...prev,
      location: location,
      latitude: coords?.latitude || 0,
      longitude: coords?.longitude || 0,
      timezone: 'Asia/Kolkata'
    }));
  };

  // Planet names in Hindi and English
  const planetNames = {
    'Sun': 'सूर्य',
    'Moon': 'चंद्र',
    'Mars': 'मंगल',
    'Mercury': 'बुध',
    'Jupiter': 'गुरु',
    'Venus': 'शुक्र',
    'Saturn': 'शनि',
    'Rahu': 'राहु',
    'Ketu': 'केतु'
  };

  // Zodiac signs in Hindi and English
  const zodiacSigns = {
    'Aries': 'मेष',
    'Taurus': 'वृषभ',
    'Gemini': 'मिथुन',
    'Cancer': 'कर्क',
    'Leo': 'सिंह',
    'Virgo': 'कन्या',
    'Libra': 'तुला',
    'Scorpio': 'वृश्चिक',
    'Sagittarius': 'धनु',
    'Capricorn': 'मकर',
    'Aquarius': 'कुम्भ',
    'Pisces': 'मीन'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <AstroTickHeader />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-4">
            हिंदी कुंडली जेनरेटर / Hindi Kundli Generator
          </h1>
          <p className="text-lg text-gray-600">
            पूर्ण वैदिक कुंडली हिंदी और अंग्रेजी दोनों भाषाओं में / Complete Vedic Kundli in Hindi and English
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <Card className="shadow-xl border-orange-200">
            <CardHeader className="bg-gradient-to-r from-orange-100 to-amber-100">
              <CardTitle className="text-center text-orange-800">
                जन्म विवरण भरें / Enter Birth Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    नाम / Name *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="अपना नाम लिखें / Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="border-orange-200 focus:border-orange-400"
                    required
                  />
                </div>

                {/* Gender Field */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    लिंग / Gender *
                  </Label>
                  <Select 
                    value={formData.gender} 
                    onValueChange={(value: 'male' | 'female') => 
                      setFormData(prev => ({ ...prev, gender: value }))
                    }
                  >
                    <SelectTrigger className="border-orange-200">
                      <SelectValue placeholder="लिंग चुनें / Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">पुरुष / Male</SelectItem>
                      <SelectItem value="female">महिला / Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Date Field */}
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-sm font-medium">
                    जन्म तिथि / Date of Birth *
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="border-orange-200 focus:border-orange-400"
                    required
                  />
                </div>

                {/* Time Field */}
                <div className="space-y-2">
                  <Label htmlFor="time" className="text-sm font-medium">
                    जन्म समय / Time of Birth *
                  </Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                    className="border-orange-200 focus:border-orange-400"
                    required
                  />
                </div>

                {/* Location Field */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    जन्म स्थान / Place of Birth *
                  </Label>
                  <LocationSearch
                    placeholder="शहर खोजें / Search city"
                    onLocationSelect={handleLocationSelect}
                    className="border-orange-200 focus:border-orange-400"
                  />
                  {formData.location && (
                    <p className="text-sm text-green-600">
                      चुना गया स्थान / Selected: {formData.location}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold py-3"
                  disabled={generateKundli.isPending}
                >
                  {generateKundli.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      कुंडली बन रही है / Generating...
                    </>
                  ) : (
                    "कुंडली बनाएं / Generate Kundli"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Results Section */}
          {result && (
            <Card className="shadow-xl border-orange-200">
              <CardHeader className="bg-gradient-to-r from-orange-100 to-amber-100">
                <CardTitle className="text-center text-orange-800">
                  कुंडली परिणाम / Kundli Results
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="basic">मूल जानकारी / Basic</TabsTrigger>
                    <TabsTrigger value="planets">ग्रह स्थिति / Planets</TabsTrigger>
                    <TabsTrigger value="chart">चार्ट / Chart</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="mt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-orange-50 rounded-lg">
                        <h3 className="font-semibold text-orange-800 mb-2">
                          लग्न / Ascendant
                        </h3>
                        <p className="text-gray-700">
                          {result.ascendant} / {zodiacSigns[result.ascendant as keyof typeof zodiacSigns] || result.ascendant}
                        </p>
                      </div>
                      <div className="p-4 bg-amber-50 rounded-lg">
                        <h3 className="font-semibold text-amber-800 mb-2">
                          चंद्र राशि / Moon Sign
                        </h3>
                        <p className="text-gray-700">
                          {result.moonSign} / {zodiacSigns[result.moonSign as keyof typeof zodiacSigns] || result.moonSign}
                        </p>
                      </div>
                      <div className="p-4 bg-yellow-50 rounded-lg">
                        <h3 className="font-semibold text-yellow-800 mb-2">
                          सूर्य राशि / Sun Sign
                        </h3>
                        <p className="text-gray-700">
                          {result.sunSign} / {zodiacSigns[result.sunSign as keyof typeof zodiacSigns] || result.sunSign}
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="planets" className="mt-6">
                    <div className="space-y-3">
                      <h3 className="font-semibold text-gray-800 mb-4">
                        ग्रह स्थिति / Planetary Positions
                      </h3>
                      {result.planets?.map((planet, index) => (
                        <div key={index} className="p-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-200">
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="font-medium text-orange-800">
                                {planetNames[planet.name as keyof typeof planetNames] || planet.name} / {planet.name}
                              </span>
                              {planet.isRetrograde && (
                                <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                                  वक्री / Retrograde
                                </span>
                              )}
                            </div>
                            <div className="text-right text-sm text-gray-600">
                              <div>
                                राशि / Sign: {zodiacSigns[planet.sign as keyof typeof zodiacSigns] || planet.sign} / {planet.sign}
                              </div>
                              <div>भाव / House: {planet.house}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="chart" className="mt-6">
                    <div className="text-center">
                      <h3 className="font-semibold text-gray-800 mb-4">
                        जन्म कुंडली चार्ट / Birth Chart
                      </h3>
                      
                      {/* North Indian Style SVG Chart */}
                      {result.chartSvg ? (
                        <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-6 rounded-lg border-2 border-orange-200">
                          <div 
                            className="mx-auto max-w-md"
                            dangerouslySetInnerHTML={{ __html: result.chartSvg }}
                          />
                          <p className="text-sm text-gray-600 mt-4">
                            उत्तर भारतीय शैली कुंडली / North Indian Style Chart
                          </p>
                        </div>
                      ) : (
                        /* Fallback basic chart if SVG not available */
                        <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-8 rounded-lg border-2 border-orange-200">
                          <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
                            {Array.from({ length: 12 }, (_, i) => i + 1).map(house => (
                              <div key={house} className="aspect-square border border-orange-300 bg-white rounded flex items-center justify-center text-sm font-medium">
                                <div className="text-center">
                                  <div className="text-xs text-gray-500 mb-1">भाव {house}</div>
                                  <div className="text-xs">
                                    {result.planets?.filter(p => p.house === house).map(p => 
                                      planetNames[p.name as keyof typeof planetNames] || p.name
                                    ).join(', ')}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <p className="text-sm text-gray-600 mt-4">
                            उत्तर भारतीय शैली कुंडली / North Indian Style Chart
                          </p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>

                {/* PDF Download Options */}
                <div className="mt-6 pt-6 border-t border-orange-200">
                  <div className="space-y-3">
                    <Label className="text-base font-medium">रिपोर्ट डाउनलोड करें / Download Report</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        onClick={() => pdfDownloadMutation.mutate()}
                        disabled={pdfDownloadMutation.isPending}
                        className="flex items-center gap-2"
                        variant="outline"
                      >
                        <Download className="h-4 w-4" />
                        {pdfDownloadMutation.isPending ? 'तैयार कर रहे हैं...' : 'PDF डाउनलोड करें'}
                      </Button>
                      <Button
                        onClick={() => setShowEmailModal(true)}
                        disabled={pdfDownloadMutation.isPending}
                        className="flex items-center gap-2"
                        variant="outline"
                      >
                        <Mail className="h-4 w-4" />
                        ईमेल भेजें
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Vedic Details Display */}
        {result && (
          <VedicDetailsDisplay 
            birthData={{
              name: formData.name,
              date: formData.date,
              time: formData.time,
              latitude: formData.latitude,
              longitude: formData.longitude,
              moonSign: result.moonSign || '',
              nakshatra: result.planets?.[1]?.nakshatra || 'Unknown'
            }}
          />
        )}

        {/* Additional Features */}
        {result && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Yogas */}
            {result.yogas && result.yogas.length > 0 && (
              <Card className="shadow-lg border-green-200">
                <CardHeader className="bg-green-50">
                  <CardTitle className="text-green-800">
                    योग / Yogas
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <ul className="space-y-2">
                    {result.yogas.map((yoga, index) => (
                      <li key={index} className="p-2 bg-green-50 rounded text-sm">
                        {yoga}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Doshas */}
            {result.doshas && result.doshas.length > 0 && (
              <Card className="shadow-lg border-red-200">
                <CardHeader className="bg-red-50">
                  <CardTitle className="text-red-800">
                    दोष / Doshas
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <ul className="space-y-2">
                    {result.doshas.map((dosha, index) => (
                      <li key={index} className="p-2 bg-red-50 rounded text-sm">
                        {dosha}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Email Modal */}
        <Dialog open={showEmailModal} onOpenChange={setShowEmailModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>ईमेल भेजें / Send via Email</DialogTitle>
              <DialogDescription>
                कुंडली रिपोर्ट को अपने ईमेल पर भेजें / Send the Kundli report to your email
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">ईमेल पता / Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="आपका ईमेल पता / Your email address"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => setShowEmailModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  रद्द करें / Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (emailAddress.trim()) {
                      pdfDownloadMutation.mutate(emailAddress);
                      setShowEmailModal(false);
                      setEmailAddress('');
                    }
                  }}
                  disabled={!emailAddress.trim() || pdfDownloadMutation.isPending}
                  className="flex-1"
                >
                  {pdfDownloadMutation.isPending ? 'भेज रहे हैं...' : 'भेजें / Send'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default HindiKundli;