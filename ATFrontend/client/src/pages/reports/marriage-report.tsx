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
  const [analysisType, setAnalysisType] = useState<'individual' | 'matchmaking'>('individual');
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
    maritalStatus: 'single'
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
    
    // Validate person 1 information (always required)
    if (!formData.name || !formData.birthDate || !formData.birthTime || !formData.birthPlace) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields for your birth details",
        variant: "destructive"
      });
      return;
    }

    // Validate person 2 information only for matchmaking
    if (analysisType === 'matchmaking' && 
        (!formData.partnerName || !formData.partnerBirthDate || !formData.partnerBirthTime || !formData.partnerBirthPlace)) {
      toast({
        title: "Missing Information", 
        description: "Please fill in all required fields for your partner's birth details",
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
          // Analysis type flag
          analysisType: analysisType,
          isMatchmaking: analysisType === 'matchmaking',
          // Person 1 data
          name: formData.name,
          birthDate: formData.birthDate,
          birthTime: formData.birthTime,
          birthPlace: formData.birthPlace,
          latitude: formData.latitude,
          longitude: formData.longitude,
          gender: formData.gender,
          // Person 2 data (only for matchmaking)
          ...(analysisType === 'matchmaking' && {
            partnerName: formData.partnerName,
            partnerBirthDate: formData.partnerBirthDate,
            partnerBirthTime: formData.partnerBirthTime,
            partnerBirthPlace: formData.partnerBirthPlace,
            partnerLatitude: formData.partnerLatitude,
            partnerLongitude: formData.partnerLongitude,
            partnerGender: formData.partnerGender,
          }),
          // Additional data
          maritalStatus: formData.maritalStatus
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setAnalysisResult(data);
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
                    {analysisType === 'matchmaking' ? 'Marriage Compatibility Analysis' : 'Personal Marriage Analysis'}
                  </CardTitle>
                  <p className="text-pink-100 text-sm mt-2">
                    {analysisType === 'matchmaking' 
                      ? 'Enter details for both partners for complete compatibility analysis'
                      : 'Enter your birth details for personal marriage timing and characteristics analysis'
                    }
                  </p>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Analysis Type Selection */}
                    <div className="space-y-4 p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg border border-pink-200">
                      <h3 className="text-lg font-semibold text-pink-800 text-center">Choose Your Analysis Type</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div 
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            analysisType === 'individual' 
                              ? 'border-pink-500 bg-pink-100' 
                              : 'border-gray-200 bg-white hover:border-pink-300'
                          }`}
                          onClick={() => setAnalysisType('individual')}
                        >
                          <div className="flex items-start gap-3">
                            <input
                              type="radio"
                              name="analysisType"
                              value="individual"
                              checked={analysisType === 'individual'}
                              onChange={(e) => setAnalysisType(e.target.value as 'individual' | 'matchmaking')}
                              className="mt-1"
                            />
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-1">I don't have a partner</h4>
                              <p className="text-sm text-gray-600 mb-2">Personal marriage analysis based on your birth chart</p>
                              <div className="text-xs text-pink-700">
                                <p>• Marriage timing prediction (dashas + transits)</p>
                                <p>• Spouse characteristics</p>
                                <p>• Love vs arranged marriage tendencies</p>
                                <p>• Marriage house (7th house) strength & remedies</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div 
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            analysisType === 'matchmaking' 
                              ? 'border-pink-500 bg-pink-100' 
                              : 'border-gray-200 bg-white hover:border-pink-300'
                          }`}
                          onClick={() => setAnalysisType('matchmaking')}
                        >
                          <div className="flex items-start gap-3">
                            <input
                              type="radio"
                              name="analysisType"
                              value="matchmaking"
                              checked={analysisType === 'matchmaking'}
                              onChange={(e) => setAnalysisType(e.target.value as 'individual' | 'matchmaking')}
                              className="mt-1"
                            />
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-1">I have a partner</h4>
                              <p className="text-sm text-gray-600 mb-2">Matchmaking results + individual explanations for both charts</p>
                              <div className="text-xs text-pink-700">
                                <p>• Guna Milan score with explanation of each koota</p>
                                <p>• Dosha balancing (Manglik, Nadi, Bhakoot)</p>
                                <p>• Emotional & physical compatibility analysis</p>
                                <p>• Long-term relationship forecast & remedies</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

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

                    {/* Person 2 Section - Only show for matchmaking */}
                    {analysisType === 'matchmaking' && (
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
                    )}

                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          {analysisType === 'matchmaking' ? 'Analyzing Compatibility...' : 'Analyzing Marriage Details...'}
                        </>
                      ) : (
                        <>
                          <Heart className="mr-2 h-4 w-4" />
                          {analysisType === 'matchmaking' ? 'Get Matchmaking Report - ₹500' : 'Get Marriage Report - ₹300'}
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
                    {/* Personal Analysis */}
                    {analysisResult.person1Analysis && (
                      <Card className="bg-white/50">
                        <CardHeader>
                          <CardTitle className="text-xl text-purple-700">
                            Personal Marriage Analysis - {analysisResult.person1Analysis.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-purple-600 mb-2">Marriage Prospects</h4>
                            <p className="text-gray-700">{analysisResult.person1Analysis.marriageProspects}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-purple-600 mb-2">Spouse Characteristics</h4>
                            <p className="text-gray-700">{analysisResult.person1Analysis.spouseCharacteristics}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-purple-600 mb-2">Marriage House Analysis</h4>
                            <p className="text-gray-700">{analysisResult.person1Analysis.marriageHouse}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-purple-600 mb-2">Planetary Influences</h4>
                            <p className="text-gray-700">{analysisResult.person1Analysis.planetaryInfluences}</p>
                          </div>
                          {analysisResult.person1Analysis.doshaAnalysis && (
                            <div>
                              <h4 className="font-semibold text-purple-600 mb-2">Dosha Analysis</h4>
                              <p className="text-gray-700">{analysisResult.person1Analysis.doshaAnalysis}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )}

                    {/* Compatibility Analysis (if matchmaking) */}
                    {analysisResult.isMatchmaking && analysisResult.compatibilityAnalysis && (
                      <Card className="bg-white/50">
                        <CardHeader>
                          <CardTitle className="text-xl text-purple-700">Compatibility Analysis</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center p-4 bg-purple-50 rounded-lg">
                              <div className="text-2xl font-bold text-purple-600">{analysisResult.compatibilityAnalysis.overallCompatibility}</div>
                              <div className="text-sm text-purple-700">Overall</div>
                            </div>
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                              <div className="text-lg font-semibold text-blue-600">{analysisResult.compatibilityAnalysis.mentalCompatibility}</div>
                              <div className="text-sm text-blue-700">Mental</div>
                            </div>
                            <div className="text-center p-4 bg-green-50 rounded-lg">
                              <div className="text-lg font-semibold text-green-600">{analysisResult.compatibilityAnalysis.emotionalCompatibility}</div>
                              <div className="text-sm text-green-700">Emotional</div>
                            </div>
                            <div className="text-center p-4 bg-yellow-50 rounded-lg">
                              <div className="text-lg font-semibold text-yellow-600">{analysisResult.compatibilityAnalysis.spiritualCompatibility}</div>
                              <div className="text-sm text-yellow-700">Spiritual</div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-purple-600 mb-2">Compatibility Factors</h4>
                            <ul className="list-disc list-inside space-y-1 text-gray-700">
                              {analysisResult.compatibilityAnalysis.compatibilityFactors.map((factor: string, index: number) => (
                                <li key={index}>{factor}</li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="p-4 bg-green-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <span className="text-green-600 font-semibold">Marriage Recommendation:</span>
                              <span className={`font-bold ${analysisResult.compatibilityAnalysis.recommendedMarriage ? 'text-green-600' : 'text-red-600'}`}>
                                {analysisResult.compatibilityAnalysis.recommendedMarriage ? 'Highly Recommended' : 'Not Recommended'}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Partner Analysis (if matchmaking) */}
                    {analysisResult.isMatchmaking && analysisResult.person2Analysis && (
                      <Card className="bg-white/50">
                        <CardHeader>
                          <CardTitle className="text-xl text-purple-700">
                            Partner Marriage Analysis - {analysisResult.person2Analysis.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-purple-600 mb-2">Marriage Prospects</h4>
                            <p className="text-gray-700">{analysisResult.person2Analysis.marriageProspects}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-purple-600 mb-2">Spouse Characteristics</h4>
                            <p className="text-gray-700">{analysisResult.person2Analysis.spouseCharacteristics}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-purple-600 mb-2">Marriage House Analysis</h4>
                            <p className="text-gray-700">{analysisResult.person2Analysis.marriageHouse}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-purple-600 mb-2">Planetary Influences</h4>
                            <p className="text-gray-700">{analysisResult.person2Analysis.planetaryInfluences}</p>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Birth Chart Details */}
                    {analysisResult.birthChart && (
                      <Card className="bg-white/50">
                        <CardHeader>
                          <CardTitle className="text-xl text-purple-700">Birth Chart Analysis</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold text-purple-600 mb-2">Ascendant (Lagna)</h4>
                              <p className="text-gray-700">{analysisResult.birthChart.ascendant}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold text-purple-600 mb-2">Moon Sign</h4>
                              <p className="text-gray-700">{analysisResult.birthChart.moonSign}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold text-purple-600 mb-2">Nakshatra</h4>
                              <p className="text-gray-700">{analysisResult.birthChart.nakshatra}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold text-purple-600 mb-2">7th House Lord</h4>
                              <p className="text-gray-700">{analysisResult.birthChart.seventhHouseLord}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Personality Traits */}
                    {analysisResult.personalityTraits && (
                      <Card className="bg-white/50">
                        <CardHeader>
                          <CardTitle className="text-xl text-purple-700">Personality & Relationship Traits</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-purple-600 mb-2">Your Nature</h4>
                            <p className="text-gray-700">{analysisResult.personalityTraits.yourNature}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-purple-600 mb-2">Ideal Match</h4>
                            <p className="text-gray-700">{analysisResult.personalityTraits.idealMatch}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-purple-600 mb-2">Communication Style</h4>
                            <p className="text-gray-700">{analysisResult.personalityTraits.communicationStyle}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-purple-600 mb-2">Emotional Needs</h4>
                            <p className="text-gray-700">{analysisResult.personalityTraits.emotionalNeeds}</p>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Marriage Life Phases */}
                    {analysisResult.marriagePhases && (
                      <Card className="bg-white/50">
                        <CardHeader>
                          <CardTitle className="text-xl text-purple-700">Marriage Life Phases</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-purple-600 mb-2">Honeymoon Period (Years 1-3)</h4>
                            <p className="text-gray-700">{analysisResult.marriagePhases.honeymoonPeriod}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-purple-600 mb-2">Stabilization Phase (Years 4-10)</h4>
                            <p className="text-gray-700">{analysisResult.marriagePhases.stabilizationPhase}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-purple-600 mb-2">Maturity Phase (Years 11+)</h4>
                            <p className="text-gray-700">{analysisResult.marriagePhases.maturityPhase}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-purple-600 mb-2">Golden Years</h4>
                            <p className="text-gray-700">{analysisResult.marriagePhases.goldenYears}</p>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Astrological Details */}
                    {analysisResult.astrologicalDetails && (
                      <Card className="bg-white/50">
                        <CardHeader>
                          <CardTitle className="text-xl text-purple-700">Detailed Astrological Analysis</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-purple-600 mb-2">Significant Planets</h4>
                            <p className="text-gray-700">{analysisResult.astrologicalDetails.significantPlanets}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-purple-600 mb-2">Benefic Periods</h4>
                            <p className="text-gray-700">{analysisResult.astrologicalDetails.beneficPeriods}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-purple-600 mb-2">Nakshatra Analysis</h4>
                            <p className="text-gray-700">{analysisResult.astrologicalDetails.nakshatra}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-purple-600 mb-2">Dasha Analysis</h4>
                            <p className="text-gray-700">{analysisResult.astrologicalDetails.dashaAnalysis}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-purple-600 mb-2">Lunar Calendar</h4>
                            <p className="text-gray-700">{analysisResult.astrologicalDetails.lunarCalendar}</p>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Predictions */}
                    {analysisResult.predictions && (
                      <Card className="bg-white/50">
                        <CardHeader>
                          <CardTitle className="text-xl text-purple-700">Marriage Predictions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold text-purple-600 mb-2">Marriage Success</h4>
                              <p className="text-gray-700">{analysisResult.predictions.marriageSuccess}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold text-purple-600 mb-2">Relationship Harmony</h4>
                              <p className="text-gray-700">{analysisResult.predictions.relationshipHarmony}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold text-purple-600 mb-2">Family Life</h4>
                              <p className="text-gray-700">{analysisResult.predictions.familyLife}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold text-purple-600 mb-2">Children</h4>
                              <p className="text-gray-700">{analysisResult.predictions.children}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold text-purple-600 mb-2">Longevity</h4>
                              <p className="text-gray-700">{analysisResult.predictions.longevity}</p>
                            </div>
                            {analysisResult.predictions.financialProsperity && (
                              <div>
                                <h4 className="font-semibold text-purple-600 mb-2">Financial Prosperity</h4>
                                <p className="text-gray-700">{analysisResult.predictions.financialProsperity}</p>
                              </div>
                            )}
                            {analysisResult.predictions.socialStatus && (
                              <div>
                                <h4 className="font-semibold text-purple-600 mb-2">Social Status</h4>
                                <p className="text-gray-700">{analysisResult.predictions.socialStatus}</p>
                              </div>
                            )}
                            {analysisResult.predictions.spiritualGrowth && (
                              <div>
                                <h4 className="font-semibold text-purple-600 mb-2">Spiritual Growth</h4>
                                <p className="text-gray-700">{analysisResult.predictions.spiritualGrowth}</p>
                              </div>
                            )}
                            {analysisResult.predictions.healthAndWellbeing && (
                              <div>
                                <h4 className="font-semibold text-purple-600 mb-2">Health & Wellbeing</h4>
                                <p className="text-gray-700">{analysisResult.predictions.healthAndWellbeing}</p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Guidance Section */}
                    {analysisResult.guidance && (
                      <Card className="bg-white/50">
                        <CardHeader>
                          <CardTitle className="text-xl text-purple-700">Guidance & Recommendations</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-purple-600 mb-2">Best Approach</h4>
                            <p className="text-gray-700">{analysisResult.guidance.bestApproach}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-purple-600 mb-2">Relationship Advice</h4>
                            <p className="text-gray-700">{analysisResult.guidance.relationshipAdvice}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-purple-600 mb-2">Preparation Tips</h4>
                            <p className="text-gray-700">{analysisResult.guidance.preparationTips}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-red-600 mb-2">Red Flags to Avoid</h4>
                            <p className="text-gray-700">{analysisResult.guidance.redFlags}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-purple-600 mb-2">Parental Consent</h4>
                            <p className="text-gray-700">{analysisResult.guidance.parentalConsent}</p>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Marriage Timing */}
                    {analysisResult.timing && (
                      <Card className="bg-white/50">
                        <CardHeader>
                          <CardTitle className="text-xl text-purple-700">Marriage Timing</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {analysisResult.isMatchmaking ? (
                            <div className="space-y-3">
                              <div>
                                <h4 className="font-semibold text-purple-600 mb-2">Ideal Wedding Period</h4>
                                <p className="text-gray-700">{analysisResult.timing.idealWeddingPeriod}</p>
                              </div>
                              <div>
                                <h4 className="font-semibold text-purple-600 mb-2">Auspicious Months</h4>
                                <p className="text-gray-700">{analysisResult.timing.auspiciousMonths?.join(', ')}</p>
                              </div>
                              <div>
                                <h4 className="font-semibold text-purple-600 mb-2">Favorable Dates</h4>
                                <p className="text-gray-700">{analysisResult.timing.favorableDates}</p>
                              </div>
                              {analysisResult.timing.avoidPeriods && (
                                <div>
                                  <h4 className="font-semibold text-red-600 mb-2">Periods to Avoid</h4>
                                  <p className="text-gray-700">{analysisResult.timing.avoidPeriods}</p>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <div>
                                <h4 className="font-semibold text-purple-600 mb-2">Marriage Age</h4>
                                <p className="text-gray-700">{analysisResult.timing.marriageAge}</p>
                              </div>
                              <div>
                                <h4 className="font-semibold text-purple-600 mb-2">Favorable Periods</h4>
                                <p className="text-gray-700">{analysisResult.timing.favorablePeriods?.join(', ')}</p>
                              </div>
                              <div>
                                <h4 className="font-semibold text-purple-600 mb-2">Auspicious Transits</h4>
                                <p className="text-gray-700">{analysisResult.timing.auspiciousTransits}</p>
                              </div>
                              {analysisResult.timing.currentIndication && (
                                <div>
                                  <h4 className="font-semibold text-purple-600 mb-2">Current Indication</h4>
                                  <p className="text-gray-700">{analysisResult.timing.currentIndication}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )}

                    {/* Remedies */}
                    {analysisResult.remedies && (
                      <Card className="bg-white/50">
                        <CardHeader>
                          <CardTitle className="text-xl text-purple-700">Astrological Remedies</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <h4 className="font-semibold text-purple-600 mb-3">Recommended Practices</h4>
                            <ul className="list-disc list-inside space-y-2 text-gray-700">
                              {analysisResult.remedies.map((remedy: string, index: number) => (
                                <li key={index}>{remedy}</li>
                              ))}
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Analysis Engine Info */}
                    <div className="text-center text-sm text-gray-500 mt-6">
                      <p>Analysis generated using {analysisResult.calculationEngine || 'Authentic Jyotisha Engine'}</p>
                      <p>Response time: {analysisResult.responseTime}</p>
                    </div>
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