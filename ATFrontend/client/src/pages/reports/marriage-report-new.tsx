import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'wouter';
import { useAuth } from 'src/hooks/useAuth';
import { Heart, Calendar, Users, CircleDot, Clock, Star, Gift, Home, Baby, Shield, Download, Mail, Loader2, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from 'src/components/ui/card';
import { Button } from 'src/components/ui/button';
import { Badge } from 'src/components/ui/badge';
import { Input } from 'src/components/ui/input';
import { Label } from 'src/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'src/components/ui/select';
import AstroTickHeader from 'src/components/layout/AstroTickHeader';
import LocationSearch from 'src/components/LocationSearch';
import { useToast } from 'src/hooks/use-toast';

const MarriageReport: React.FC = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    // Person 1 details
    name: '',
    gender: 'male',
    birthDate: '',
    birthTime: '',
    birthPlace: '',
    latitude: 0,
    longitude: 0,
    // Person 2 details  
    partnerName: '',
    partnerGender: 'female',
    partnerBirthDate: '',
    partnerBirthTime: '',
    partnerBirthPlace: '',
    partnerLatitude: 0,
    partnerLongitude: 0,
    // Additional info
    maritalStatus: 'single',
    relationshipType: 'marriage'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const { toast } = useToast();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <AstroTickHeader />
        <div className="py-16">
          <div className="max-w-md mx-auto px-4">
            <Card className="text-center">
              <CardHeader>
                <Lock className="h-16 w-16 text-pink-600 mx-auto mb-4" />
                <CardTitle className="text-2xl font-bold text-gray-900">🎉 FREE Marriage Report!</CardTitle>
                <p className="text-gray-600">
                  <span className="font-semibold text-pink-600">Limited Time Offer:</span> Get your detailed marriage astrology analysis absolutely FREE! Simply create your account to claim this exclusive compatibility insight.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={() => setLocation('/signup')}
                  className="w-full bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800"
                >
                  Claim FREE Marriage Report
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setLocation('/login')}
                  className="w-full"
                >
                  Already have an account? Log In
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const handleLocationSelect = (location: any, coords?: any, isPerson2 = false) => {
    const locationString = typeof location === 'string' ? location : location.display;
    const lat = coords?.latitude || location.latitude || 0;
    const lng = coords?.longitude || location.longitude || 0;
    
    if (isPerson2) {
      setFormData(prev => ({
        ...prev,
        partnerBirthPlace: locationString,
        partnerLatitude: lat,
        partnerLongitude: lng
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        birthPlace: locationString,
        latitude: lat,
        longitude: lng
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate both people's information
    if (!formData.name || !formData.birthDate || !formData.birthTime || !formData.birthPlace ||
        !formData.partnerName || !formData.partnerBirthDate || !formData.partnerBirthTime || !formData.partnerBirthPlace) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields for both partners",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/astrology-reports/marriage-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          // Person 1 data
          name: formData.name,
          birthDate: formData.birthDate,
          birthTime: formData.birthTime,
          birthPlace: formData.birthPlace,
          latitude: formData.latitude,
          longitude: formData.longitude,
          gender: formData.gender,
          // Person 2 data
          partnerName: formData.partnerName,
          partnerBirthDate: formData.partnerBirthDate,
          partnerBirthTime: formData.partnerBirthTime,
          partnerBirthPlace: formData.partnerBirthPlace,
          partnerLatitude: formData.partnerLatitude,
          partnerLongitude: formData.partnerLongitude,
          partnerGender: formData.partnerGender,
          // Additional data
          maritalStatus: formData.maritalStatus,
          relationshipType: formData.relationshipType
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setAnalysisResult(data.data);
        toast({
          title: "Analysis Complete",
          description: "Your marriage compatibility analysis is ready!"
        });
      } else {
        throw new Error(data.error || 'Analysis failed');
      }
    } catch (error) {
      console.error('Marriage analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!analysisResult) return;
    
    setIsGeneratingPDF(true);
    try {
      const response = await fetch('/api/reports/marriage-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          birthDate: formData.birthDate,
          birthTime: formData.birthTime,
          birthPlace: formData.birthPlace,
          analysisData: analysisResult
        })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${formData.name}-Marriage-Report.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        toast({
          title: "PDF Downloaded",
          description: "Your marriage report has been downloaded successfully"
        });
      } else {
        throw new Error('PDF generation failed');
      }
    } catch (error) {
      console.error('PDF generation error:', error);
      toast({
        title: "Download Failed",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleEmailReport = async () => {
    if (!analysisResult) return;
    
    setIsSendingEmail(true);
    try {
      const response = await fetch('/api/reports/marriage-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          birthDate: formData.birthDate,
          birthTime: formData.birthTime,
          birthPlace: formData.birthPlace,
          analysisData: analysisResult
        })
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Email Sent",
          description: "Your marriage report has been sent to your email"
        });
      } else {
        throw new Error(data.error || 'Email sending failed');
      }
    } catch (error) {
      console.error('Email sending error:', error);
      toast({
        title: "Email Failed",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50">
      <Helmet>
        <title>Marriage Report - Marriage Timing & Compatibility | AstroTick</title>
        <meta name="description" content="Get detailed marriage timing analysis with compatibility insights, spouse characteristics, and remedial guidance for happy married life." />
        <meta name="keywords" content="marriage astrology, marriage timing, spouse prediction, compatibility analysis, wedding muhurat" />
      </Helmet>
      
      <AstroTickHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center items-center gap-3 mb-4">
              <Heart className="h-8 w-8 text-pink-600" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                Marriage Report
              </h1>
              <CircleDot className="h-8 w-8 text-pink-600" />
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Marriage timing and compatibility analysis with detailed spouse characteristics and remedial guidance
            </p>
          </div>

          {/* GET MARRIAGE REPORT - Form Section Only */}
          <div className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="bg-white/90 backdrop-blur-sm border-pink-200 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-6 w-6" />
                    Marriage Compatibility Analysis
                  </CardTitle>
                  <p className="text-pink-100 text-sm mt-2">Enter details for both partners for complete compatibility analysis</p>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Person 1 Section */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-pink-800 border-b border-pink-200 pb-2">Person 1 Details</h3>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            type="text"
                            placeholder="Enter full name"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label htmlFor="gender">Gender</Label>
                          <Select value={formData.gender} onValueChange={(value) => setFormData({...formData, gender: value})}>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="birthDate">Date of Birth</Label>
                          <Input
                            id="birthDate"
                            type="date"
                            value={formData.birthDate}
                            onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label htmlFor="birthTime">Time of Birth</Label>
                          <Input
                            id="birthTime"
                            type="time"
                            value={formData.birthTime}
                            onChange={(e) => setFormData({...formData, birthTime: e.target.value})}
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="birthPlace">Birth Place</Label>
                        <LocationSearch
                          onLocationSelect={(location, coords) => handleLocationSelect(location, coords, false)}
                          placeholder="Search for birth city..."
                          className="mt-1"
                        />
                        {formData.birthPlace && (
                          <p className="text-xs text-gray-500 mt-1">{formData.birthPlace}</p>
                        )}
                      </div>
                    </div>

                    {/* Person 2 Section */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-pink-800 border-b border-pink-200 pb-2">Person 2 Details</h3>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="partnerName">Full Name</Label>
                          <Input
                            id="partnerName"
                            type="text"
                            placeholder="Enter partner's full name"
                            value={formData.partnerName}
                            onChange={(e) => setFormData({...formData, partnerName: e.target.value})}
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label htmlFor="partnerGender">Gender</Label>
                          <Select value={formData.partnerGender} onValueChange={(value) => setFormData({...formData, partnerGender: value})}>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="partnerBirthDate">Date of Birth</Label>
                          <Input
                            id="partnerBirthDate"
                            type="date"
                            value={formData.partnerBirthDate}
                            onChange={(e) => setFormData({...formData, partnerBirthDate: e.target.value})}
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label htmlFor="partnerBirthTime">Time of Birth</Label>
                          <Input
                            id="partnerBirthTime"
                            type="time"
                            value={formData.partnerBirthTime}
                            onChange={(e) => setFormData({...formData, partnerBirthTime: e.target.value})}
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="partnerBirthPlace">Birth Place</Label>
                        <LocationSearch
                          onLocationSelect={(location, coords) => handleLocationSelect(location, coords, true)}
                          placeholder="Search for partner's birth city..."
                          className="mt-1"
                        />
                        {formData.partnerBirthPlace && (
                          <p className="text-xs text-gray-500 mt-1">{formData.partnerBirthPlace}</p>
                        )}
                      </div>
                    </div>

                    {/* Relationship Type */}
                    <div>
                      <Label htmlFor="relationshipType">Relationship Type</Label>
                      <Select value={formData.relationshipType} onValueChange={(value) => setFormData({...formData, relationshipType: value})}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select relationship type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="marriage">Marriage</SelectItem>
                          <SelectItem value="engagement">Engagement</SelectItem>
                          <SelectItem value="dating">Dating</SelectItem>
                          <SelectItem value="compatibility">General Compatibility</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Analyzing Compatibility...
                        </>
                      ) : (
                        <>
                          <Heart className="mr-2 h-4 w-4" />
                          Get Marriage Report - ₹300
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="bg-gradient-to-r from-green-50 to-teal-50 border-green-200">
                  <CardHeader>
                    <CardTitle className="text-green-800">What You'll Receive</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-start gap-2">
                        <Heart className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Detailed 40+ page marriage analysis report</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Calendar className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Precise marriage timing with favorable periods</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Users className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Complete spouse characteristics analysis</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Shield className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Dosha analysis and remedial measures</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CircleDot className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>20-minute consultation with marriage astrologer</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
                  <CardHeader>
                    <CardTitle className="text-yellow-800">Marriage Report Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-yellow-600" />
                        <span>Detailed timing analysis with exact periods</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-600" />
                        <span>Compatibility score and analysis</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Gift className="h-4 w-4 text-yellow-600" />
                        <span>Wedding muhurat suggestions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Baby className="h-4 w-4 text-yellow-600" />
                        <span>Children timing and family planning</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Analysis Results Section */}
          {analysisResult && (
            <div className="mt-12">
              <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                <CardHeader>
                  <CardTitle className="text-3xl text-purple-800 text-center">
                    🎉 Your Marriage Report Analysis
                  </CardTitle>
                  <div className="flex justify-center gap-4 mt-4">
                    <Button
                      onClick={handleDownloadPDF}
                      disabled={isGeneratingPDF}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      {isGeneratingPDF ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating PDF...</>
                      ) : (
                        <><Download className="mr-2 h-4 w-4" /> Download PDF Report</>
                      )}
                    </Button>
                    <Button
                      onClick={handleEmailReport}
                      disabled={isSendingEmail}
                      variant="outline"
                      className="border-purple-300 text-purple-700 hover:bg-purple-50"
                    >
                      {isSendingEmail ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending Email...</>
                      ) : (
                        <><Mail className="mr-2 h-4 w-4" /> Email Report</>
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    {/* Analysis results will be displayed here */}
                    <p className="text-center text-gray-600">Your detailed marriage analysis will appear here after generation.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarriageReport;