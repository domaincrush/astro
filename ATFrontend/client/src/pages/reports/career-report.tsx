import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'wouter';
import { useAuth } from 'src/hooks/useAuth';
import { Briefcase, TrendingUp, Target, Clock, Star, Users, Award, DollarSign, Building2, Lightbulb, Loader2, CheckCircle, MapPin, Calendar, User, FileText, Download, Mail, CreditCard, AlertCircle, Lock, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from 'src/components/ui/card';
import { Button } from 'src/components/ui/button';
import { Badge } from 'src/components/ui/badge';
import { Input } from 'src/components/ui/input';
import { Label } from 'src/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'src/components/ui/select';
import LocationSearch from 'src/components/LocationSearch';
import AstroTickHeader from 'src/components/layout/AstroTickHeader';
import { useToast } from 'src/hooks/use-toast';

const CareerReport: React.FC = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    gender: 'male',
    birthDate: '',
    birthTime: '',
    birthPlace: '',
    latitude: 0,
    longitude: 0,
    currentOccupation: '',
    experienceYears: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const { toast } = useToast();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
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
                <Lock className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-2xl font-bold text-gray-900">🎉 FREE Career Report!</CardTitle>
                <p className="text-gray-600">
                  <span className="font-semibold text-blue-600">Limited Time Offer:</span> Get your detailed career astrological analysis absolutely FREE! Simply create your account to claim this exclusive professional guidance.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={() => setLocation('/signup')}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                >
                  Claim FREE Career Report
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

  const handleLocationSelect = (location: any, coords?: any) => {
    const locationString = typeof location === 'string' ? location : location.display;
    const lat = coords?.latitude || location.latitude || 0;
    const lng = coords?.longitude || location.longitude || 0;
    
    setFormData(prev => ({
      ...prev,
      birthPlace: locationString,
      latitude: lat,
      longitude: lng
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.birthDate || !formData.birthTime || !formData.birthPlace) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/astrology-reports/career-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          birthDate: formData.birthDate,
          birthTime: formData.birthTime,
          birthPlace: formData.birthPlace,
          latitude: formData.latitude,
          longitude: formData.longitude,
          gender: formData.gender,
          currentOccupation: formData.currentOccupation,
          experienceYears: formData.experienceYears
        })
      });

      const data = await response.json();
      
      if (data.success) {
        // Debug: Log the complete data structure to understand the response
        console.log('🔍 Complete Career API Response:', JSON.stringify(data, null, 2));
        console.log('🔍 Data structure keys:', Object.keys(data));
        
        // Store the complete response data for comprehensive access
        setResult(data);
        toast({
          title: "Analysis Complete", 
          description: "Your enhanced career analysis is ready!"
        });
      } else {
        throw new Error(data.error || 'Analysis failed');
      }
    } catch (error) {
      console.error('Career analysis error:', error);
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
    if (!result) return;
    
    setIsGeneratingPDF(true);
    try {
      const response = await fetch('/api/reports/career-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          birthDate: formData.birthDate,
          birthTime: formData.birthTime,
          birthPlace: formData.birthPlace,
          analysisData: result
        })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${formData.name}-Career-Report.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        toast({
          title: "PDF Downloaded",
          description: "Your career report has been downloaded successfully"
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
    if (!result) return;
    
    setIsSendingEmail(true);
    try {
      const response = await fetch('/api/reports/career-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          birthDate: formData.birthDate,
          birthTime: formData.birthTime,
          birthPlace: formData.birthPlace,
          analysisData: result
        })
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Email Sent",
          description: "Your career report has been sent to your email"
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Helmet>
        <title>Career Report - Professional Growth Predictions | AstroTick</title>
        <meta name="description" content="Get detailed career guidance with professional growth predictions, suitable career paths, and success timing analysis." />
        <meta name="keywords" content="career astrology, professional growth, career prediction, job success, business astrology" />
      </Helmet>
      
      <AstroTickHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center items-center gap-3 mb-4">
              <Briefcase className="h-8 w-8 text-blue-600" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Career Report
              </h1>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional growth predictions with career guidance and success timing analysis
            </p>
          </div>

          {/* GET CAREER REPORT - Form Section Only */}
          <div className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="bg-white/90 backdrop-blur-sm border-blue-200 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-6 w-6" />
                    Get Your Career Analysis
                  </CardTitle>
                  <p className="text-blue-100 text-sm mt-2">Enter your birth details for comprehensive career guidance</p>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
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

                    <div>
                      <Label htmlFor="birthPlace">Birth Place</Label>
                      <LocationSearch
                        onLocationSelect={handleLocationSelect}
                        placeholder="Search for birth city..."
                        className="mt-1"
                      />
                      {formData.birthPlace && (
                        <p className="text-xs text-gray-500 mt-1">{formData.birthPlace}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="currentOccupation">Current Occupation (Optional)</Label>
                      <Input
                        id="currentOccupation"
                        type="text"
                        placeholder="e.g., Software Engineer, Teacher"
                        value={formData.currentOccupation}
                        onChange={(e) => setFormData({...formData, currentOccupation: e.target.value})}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="experienceYears">Years of Experience (Optional)</Label>
                      <Input
                        id="experienceYears"
                        type="number"
                        placeholder="e.g., 5"
                        value={formData.experienceYears}
                        onChange={(e) => setFormData({...formData, experienceYears: e.target.value})}
                        className="mt-1"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Analyzing Career...
                        </>
                      ) : (
                        <>
                          <Briefcase className="mr-2 h-4 w-4" />
                          Get Career Report - ₹250
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
                        <Star className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Detailed 30+ page career analysis report</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Target className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Most suitable career fields and industries</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <TrendingUp className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Job vs business suitability analysis</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Clock className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Promotion and career change timing</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Users className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Leadership potential and management skills</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Building2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Foreign opportunities and relocations</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
                  <CardHeader>
                    <CardTitle className="text-yellow-800">Career Analysis Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-yellow-600" />
                        <span>10th house analysis for career direction</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-600" />
                        <span>Planetary influences on professional success</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-yellow-600" />
                        <span>Dasha periods for career timing</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-yellow-600" />
                        <span>Financial success through career</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-yellow-600" />
                        <span>Career remedies and success strategies</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Analysis Results Section */}
          {result && (
            <div className="mt-12">
              <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
                <CardHeader>
                  <CardTitle className="text-3xl text-purple-800 text-center">
                    🎉 Your Career Analysis Report
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
                    {/* Display Enhanced Career Analysis Results from Enhanced Career Engine v4.0 */}
                    {result && (
                      <div className="space-y-6">
                        {/* Basic Info Section */}
                        {(result.basicInfo || result.data?.basicInfo) && (
                          <div className="bg-white p-6 rounded-lg border">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">📋 Basic Details</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                              <div><strong>Name:</strong> {(result.basicInfo || result.data?.basicInfo)?.name}</div>
                              <div><strong>Birth Date:</strong> {(result.basicInfo || result.data?.basicInfo)?.birthDate}</div>
                              <div><strong>Ascendant:</strong> {(result.basicInfo || result.data?.basicInfo)?.ascendant}</div>
                              <div><strong>Moon Sign:</strong> {(result.basicInfo || result.data?.basicInfo)?.moonSign}</div>
                              <div><strong>Sun Sign:</strong> {(result.basicInfo || result.data?.basicInfo)?.sunSign}</div>
                              <div><strong>Birth Place:</strong> {(result.basicInfo || result.data?.basicInfo)?.birthPlace}</div>
                            </div>
                          </div>
                        )}

                        {/* Enhanced Lagna Analysis - New Section from Enhanced Career Engine v4.0 */}
                        {(result.data?.comprehensive_career_analysis?.career_foundation || result.comprehensive_career_analysis?.career_foundation) && (
                          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border-l-4 border-blue-500">
                            <h3 className="text-xl font-bold text-blue-800 mb-4">🎯 Enhanced Lagna Analysis (Career Foundation)</h3>
                            <div className="space-y-4">
                              {(() => {
                                const foundation = result.data?.comprehensive_career_analysis?.career_foundation || result.comprehensive_career_analysis?.career_foundation;
                                return (
                                  <div className="grid gap-4">
                                    {foundation.foundation && (
                                      <div className="p-4 bg-white rounded-lg shadow-sm">
                                        <h4 className="font-semibold text-blue-700 mb-2">Foundation Strength:</h4>
                                        <p className="text-gray-700">{foundation.foundation}</p>
                                      </div>
                                    )}
                                    {foundation.work_style && (
                                      <div className="p-4 bg-white rounded-lg shadow-sm">
                                        <h4 className="font-semibold text-blue-700 mb-2">Work Style:</h4>
                                        <p className="text-gray-700">{foundation.work_style}</p>
                                      </div>
                                    )}
                                    {foundation.growth_pattern && (
                                      <div className="p-4 bg-white rounded-lg shadow-sm">
                                        <h4 className="font-semibold text-blue-700 mb-2">Growth Pattern:</h4>
                                        <p className="text-gray-700">{foundation.growth_pattern}</p>
                                      </div>
                                    )}
                                    {foundation.suitable_fields && Array.isArray(foundation.suitable_fields) && (
                                      <div className="p-4 bg-white rounded-lg shadow-sm">
                                        <h4 className="font-semibold text-blue-700 mb-2">Suitable Career Fields:</h4>
                                        <div className="flex flex-wrap gap-2">
                                          {foundation.suitable_fields.map((field: string, index: number) => (
                                            <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">{field}</Badge>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })()}
                            </div>
                          </div>
                        )}

                        {/* Enhanced 10th Lord Analysis - New Section */}
                        {(result.data?.tenth_lord_analysis || result.tenth_lord_analysis) && (
                          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border-l-4 border-green-500">
                            <h3 className="text-xl font-bold text-green-800 mb-4">👑 Enhanced 10th Lord Analysis (Classical)</h3>
                            <div className="space-y-4">
                              {(() => {
                                const tenthLord = result.data?.tenth_lord_analysis || result.tenth_lord_analysis;
                                return (
                                  <div className="grid gap-4">
                                    <div className="p-4 bg-white rounded-lg shadow-sm">
                                      <h4 className="font-semibold text-green-700 mb-2">Placement Analysis:</h4>
                                      <p className="text-gray-700 mb-2"><strong>House:</strong> {tenthLord.placement_house}</p>
                                      <p className="text-gray-700 mb-2"><strong>Direction:</strong> {tenthLord.direction}</p>
                                      <p className="text-gray-700">{tenthLord.analysis}</p>
                                    </div>
                                    
                                    {tenthLord.professions && Array.isArray(tenthLord.professions) && (
                                      <div className="p-4 bg-white rounded-lg shadow-sm">
                                        <h4 className="font-semibold text-green-700 mb-2">Recommended Professions:</h4>
                                        <div className="flex flex-wrap gap-2">
                                          {tenthLord.professions.map((profession: string, index: number) => (
                                            <Badge key={index} variant="outline" className="bg-green-50 text-green-700 border-green-300">{profession}</Badge>
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                    {tenthLord.ancient_quote && (
                                      <div className="p-4 bg-amber-50 rounded-lg shadow-sm border border-amber-200">
                                        <h4 className="font-semibold text-amber-800 mb-2">📜 Ancient Wisdom:</h4>
                                        <p className="text-amber-700 italic mb-2">"{tenthLord.ancient_quote}"</p>
                                        {tenthLord.quote_meaning && (
                                          <p className="text-amber-600 text-sm">{tenthLord.quote_meaning}</p>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                );
                              })()}
                            </div>
                          </div>
                        )}

                        {/* Enhanced Saturn Analysis - New Section */}
                        {(result.data?.saturn_analysis || result.saturn_analysis) && (
                          <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-6 rounded-lg border-l-4 border-purple-500">
                            <h3 className="text-xl font-bold text-purple-800 mb-4">⏳ Enhanced Saturn Analysis (Karma Karaka)</h3>
                            <div className="space-y-4">
                              {(() => {
                                const saturn = result.data?.saturn_analysis || result.saturn_analysis;
                                return (
                                  <div className="grid gap-4">
                                    <div className="p-4 bg-white rounded-lg shadow-sm">
                                      <h4 className="font-semibold text-purple-700 mb-2">Saturn's Role:</h4>
                                      <p className="text-gray-700">{saturn.role}</p>
                                    </div>
                                    <div className="p-4 bg-white rounded-lg shadow-sm">
                                      <h4 className="font-semibold text-purple-700 mb-2">Career Impact:</h4>
                                      <p className="text-gray-700 mb-2">{saturn.analysis}</p>
                                      <p className="text-gray-600 text-sm">{saturn.career_impact}</p>
                                    </div>
                                  </div>
                                );
                              })()}
                            </div>
                          </div>
                        )}

                        {/* Enhanced Career Phases Timeline - New Section */}
                        {(result.data?.career_phases || result.career_phases) && (
                          <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-lg border-l-4 border-orange-500">
                            <h3 className="text-xl font-bold text-orange-800 mb-4">⏰ Enhanced Career Timeline Phases</h3>
                            <div className="space-y-4">
                              {(() => {
                                const phases = result.data?.career_phases || result.career_phases;
                                return (
                                  <div className="grid gap-4">
                                    {phases.foundation && (
                                      <div className="p-4 bg-blue-100 rounded-lg border-l-4 border-blue-500">
                                        <h4 className="font-semibold text-blue-800 mb-2">Foundation Phase:</h4>
                                        <p className="text-blue-700">{phases.foundation}</p>
                                      </div>
                                    )}
                                    {phases.growth && (
                                      <div className="p-4 bg-green-100 rounded-lg border-l-4 border-green-500">
                                        <h4 className="font-semibold text-green-800 mb-2">Growth Phase:</h4>
                                        <p className="text-green-700">{phases.growth}</p>
                                      </div>
                                    )}
                                    {phases.peak && (
                                      <div className="p-4 bg-yellow-100 rounded-lg border-l-4 border-yellow-500">
                                        <h4 className="font-semibold text-yellow-800 mb-2">Peak Phase:</h4>
                                        <p className="text-yellow-700">{phases.peak}</p>
                                      </div>
                                    )}
                                  </div>
                                );
                              })()}
                            </div>
                          </div>
                        )}

                        {/* Enhanced Job vs Business Analysis - New Section */}
                        {(result.data?.job_vs_business_recommendation || result.job_vs_business_recommendation) && (
                          <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-6 rounded-lg border-l-4 border-teal-500">
                            <h3 className="text-xl font-bold text-teal-800 mb-4">⚖️ Enhanced Job vs Business Analysis</h3>
                            <div className="p-4 bg-white rounded-lg shadow-sm">
                              <div className="text-lg font-semibold text-teal-700 mb-3">
                                Recommendation: {((result.data?.job_vs_business_recommendation || result.job_vs_business_recommendation) || 'Mixed Approach').toUpperCase()}
                              </div>
                              {(result.data?.comprehensive_career_analysis?.career_foundation?.job_vs_business || result.comprehensive_career_analysis?.career_foundation?.job_vs_business) && (
                                <p className="text-gray-700">{result.data?.comprehensive_career_analysis?.career_foundation?.job_vs_business || result.comprehensive_career_analysis?.career_foundation?.job_vs_business}</p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Enhanced Top Career Options with Scoring - New Section */}
                        {(result.data?.top_career_options || result.top_career_options) && (
                          <div className="bg-gradient-to-r from-rose-50 to-pink-50 p-6 rounded-lg border-l-4 border-rose-500">
                            <h3 className="text-xl font-bold text-rose-800 mb-4">⭐ Enhanced Career Options with Scoring</h3>
                            <div className="grid gap-3">
                              {((result.data?.top_career_options || result.top_career_options) || []).map((option: any, index: number) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                                  <div className="font-semibold text-gray-800">{option.profession || option}</div>
                                  {option.score && (
                                    <div className="px-3 py-1 bg-rose-100 text-rose-800 rounded-full text-sm font-medium">
                                      {option.score}% Match
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Enhanced Core Analysis Section - Consolidated */}
                        {(result.coreAnalysis || result.data?.coreAnalysis) && (
                          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-lg border-l-4 border-indigo-500">
                            <h3 className="text-xl font-bold text-indigo-800 mb-4">🎯 Core Analysis</h3>
                            
                            {(() => {
                              const coreAnalysis = result.coreAnalysis || result.data?.coreAnalysis;
                              return (
                                <div className="grid gap-4">
                                  {/* Lagna Analysis */}
                                  {coreAnalysis?.lagnaAnalysis && (
                                    <div className="p-4 bg-white rounded-lg shadow-sm">
                                      <h4 className="font-semibold text-blue-700 mb-2">Lagna Analysis</h4>
                                      <div className="text-sm space-y-2">
                                        <div><strong>Strength:</strong> {coreAnalysis.lagnaAnalysis.strength}</div>
                                        <div><strong>Dignity:</strong> {coreAnalysis.lagnaAnalysis.dignity}</div>
                                        <div className="mt-2"><strong>Career Foundation:</strong> {coreAnalysis.lagnaAnalysis.careerFoundation}</div>
                                      </div>
                                    </div>
                                  )}

                                  {/* 10th Lord Analysis */}
                                  {coreAnalysis?.tenthLordAnalysis && (
                                    <div className="p-4 bg-white rounded-lg shadow-sm">
                                      <h4 className="font-semibold text-green-700 mb-2">10th Lord Analysis</h4>
                                      <div className="text-sm space-y-2">
                                        <div><strong>House:</strong> {coreAnalysis.tenthLordAnalysis.house}</div>
                                        <div><strong>Career Direction:</strong> {coreAnalysis.tenthLordAnalysis.careerDirection}</div>
                                        <div><strong>House Effect:</strong> {coreAnalysis.tenthLordAnalysis.houseEffect}</div>
                                        {coreAnalysis.tenthLordAnalysis.primaryProfessions && (
                                          <div className="mt-2">
                                            <strong>Primary Professions:</strong>
                                            <div className="flex flex-wrap gap-2 mt-1">
                                              {coreAnalysis.tenthLordAnalysis.primaryProfessions.map((prof: string, index: number) => (
                                                <Badge key={index} variant="outline" className="bg-green-50 text-green-700 border-green-300">{prof}</Badge>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}

                                  {/* Saturn Analysis */}
                                  {coreAnalysis?.saturnAnalysis && (
                                    <div className="p-4 bg-white rounded-lg shadow-sm">
                                      <h4 className="font-semibold text-purple-700 mb-2">Saturn Analysis (Karma Karaka)</h4>
                                      <div className="text-sm space-y-2">
                                        <div><strong>Role:</strong> {coreAnalysis.saturnAnalysis.role}</div>
                                        <div><strong>Career Impact:</strong> {coreAnalysis.saturnAnalysis.careerImpact}</div>
                                        <div><strong>Timing:</strong> {coreAnalysis.saturnAnalysis.timing}</div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })()}
                          </div>
                        )}

                        {/* Enhanced Job vs Business Analysis */}
                        {(result.careerSuitability || result.data?.careerSuitability) && (
                          <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-6 rounded-lg border-l-4 border-teal-500">
                            <h3 className="text-xl font-bold text-teal-800 mb-4">⚖️ Job vs Business Suitability</h3>
                            {(() => {
                              const suitability = result.careerSuitability || result.data?.careerSuitability;
                              return (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="p-4 bg-white rounded-lg shadow-sm">
                                    <div className="text-lg font-semibold text-teal-700 mb-2">
                                      Recommendation: {(suitability?.jobVsBusiness || 'Mixed')?.toUpperCase()}
                                    </div>
                                    <div className="text-sm text-gray-700 mb-2">
                                      {suitability?.preference || suitability?.reasoning}
                                    </div>
                                  </div>
                                  <div className="p-4 bg-teal-50 rounded-lg">
                                    <div className="text-sm text-gray-700">
                                      <strong>Analysis:</strong> {suitability?.analysis || suitability?.reasoning}
                                    </div>
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        )}
                        {/* Career Fields */}
                        {result.careerFields && (
                          <div className="bg-white p-6 rounded-lg border">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">💼 Suitable Career Fields</h3>
                            
                            {result.careerFields.primaryFields && result.careerFields.primaryFields.length > 0 && (
                              <div className="mb-6">
                                <h4 className="font-semibold text-green-700 mb-3">Primary Career Fields:</h4>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                  {result.careerFields.primaryFields.map((field: string, index: number) => (
                                    <div key={index} className="flex items-center gap-2 p-2 bg-green-50 rounded">
                                      <Star className="h-4 w-4 text-green-600" />
                                      <span className="text-xs text-gray-700">{field}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {result.careerFields.dominantPlanets && result.careerFields.dominantPlanets.length > 0 && (
                              <div className="mb-4">
                                <h4 className="font-semibold text-blue-700 mb-2">Dominant Planets:</h4>
                                <div className="flex flex-wrap gap-2">
                                  {result.careerFields.dominantPlanets.map((planet: string, index: number) => (
                                    <Badge key={index} variant="secondary" className="text-xs">{planet}</Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {result.careerFields.workStyle && (
                              <div className="mb-4">
                                <h4 className="font-semibold text-purple-700 mb-2">Work Style:</h4>
                                <p className="text-sm text-gray-700">{result.careerFields.workStyle}</p>
                              </div>
                            )}

                            {result.careerFields.professionalStrengths && result.careerFields.professionalStrengths.length > 0 && (
                              <div>
                                <h4 className="font-semibold text-orange-700 mb-2">Professional Strengths:</h4>
                                <div className="flex flex-wrap gap-2">
                                  {result.careerFields.professionalStrengths.map((strength: string, index: number) => (
                                    <Badge key={index} variant="outline" className="text-xs text-orange-600 border-orange-300">{strength}</Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* Foreign Opportunities */}
                        {result.foreignOpportunities && (
                          <div className="bg-white p-6 rounded-lg border">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">🌍 Foreign Opportunities</h3>
                            <div className="p-4 bg-green-50 rounded-lg mb-4">
                              <div className="text-lg font-semibold text-green-800 mb-2">
                                Potential: {result.foreignOpportunities.potential ? 'Yes' : 'Limited'}
                              </div>
                            </div>
                            
                            {result.foreignOpportunities.indicators && result.foreignOpportunities.indicators.length > 0 && (
                              <div className="mb-4">
                                <h4 className="font-semibold text-gray-800 mb-2">Indicators:</h4>
                                <ul className="space-y-1">
                                  {result.foreignOpportunities.indicators.map((indicator: string, index: number) => (
                                    <li key={index} className="flex items-start gap-2">
                                      <Star className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0" />
                                      <span className="text-gray-700 text-sm">{indicator}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {result.foreignOpportunities.timing && (
                              <div className="mb-4">
                                <h4 className="font-semibold text-gray-800 mb-2">Timing:</h4>
                                <p className="text-sm text-gray-700">{result.foreignOpportunities.timing}</p>
                              </div>
                            )}

                            {result.foreignOpportunities.recommendation && (
                              <div>
                                <h4 className="font-semibold text-gray-800 mb-2">Recommendation:</h4>
                                <p className="text-sm text-gray-700">{result.foreignOpportunities.recommendation}</p>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* Career Timeline */}
                        {result.careerTimeline && (
                          <div className="bg-white p-6 rounded-lg border">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">⏰ Career Timeline & Growth</h3>
                            
                            <div className="grid gap-4">
                              {result.careerTimeline.foundationPhase && (
                                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                                  <h4 className="font-semibold text-blue-800 mb-2">Foundation Phase (20-30):</h4>
                                  <p className="text-sm text-blue-700">{result.careerTimeline.foundationPhase}</p>
                                </div>
                              )}

                              {result.careerTimeline.growthPhase && (
                                <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                                  <h4 className="font-semibold text-green-800 mb-2">Growth Phase (30-40):</h4>
                                  <p className="text-sm text-green-700">{result.careerTimeline.growthPhase}</p>
                                </div>
                              )}

                              {result.careerTimeline.peakPhase && (
                                <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                                  <h4 className="font-semibold text-yellow-800 mb-2">Peak Phase (40-50):</h4>
                                  <p className="text-sm text-yellow-700">{result.careerTimeline.peakPhase}</p>
                                </div>
                              )}

                              {result.careerTimeline.currentPhase && (
                                <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                                  <h4 className="font-semibold text-purple-800 mb-2">Current Phase:</h4>
                                  <p className="text-sm text-purple-700">{result.careerTimeline.currentPhase}</p>
                                </div>
                              )}

                              {result.careerTimeline.keyTransitions && result.careerTimeline.keyTransitions.length > 0 && (
                                <div className="p-4 bg-gray-50 rounded-lg">
                                  <h4 className="font-semibold text-gray-800 mb-2">Key Transitions:</h4>
                                  <ul className="space-y-1">
                                    {result.careerTimeline.keyTransitions.map((transition: string, index: number) => (
                                      <li key={index} className="flex items-start gap-2">
                                        <Clock className="h-4 w-4 text-gray-500 mt-1 flex-shrink-0" />
                                        <span className="text-sm text-gray-700">{transition}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Career Yogas */}
                        {result.careerYogas && (
                          <div className="bg-white p-6 rounded-lg border">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">🌟 Career Yogas</h3>
                            
                            {result.careerYogas.careerSpecificYogas && result.careerYogas.careerSpecificYogas.length > 0 && (
                              <div className="mb-4">
                                <h4 className="font-semibold text-green-700 mb-2">Career Specific Yogas:</h4>
                                <div className="space-y-3">
                                  {result.careerYogas.careerSpecificYogas.map((yoga: any, index: number) => (
                                    <div key={index} className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                                      <div className="flex items-start gap-2">
                                        <Star className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                                        <div>
                                          <h5 className="font-semibold text-green-800 text-sm">{yoga.name || yoga}</h5>
                                          {yoga.description && (
                                            <p className="text-xs text-green-700 mt-1">{yoga.description}</p>
                                          )}
                                          {yoga.impact && (
                                            <p className="text-xs text-green-600 mt-1 font-medium">Impact: {yoga.impact}</p>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {result.careerYogas.rajaYogas && result.careerYogas.rajaYogas.length > 0 && (
                              <div className="mb-4">
                                <h4 className="font-semibold text-purple-700 mb-2">Raja Yogas:</h4>
                                <div className="space-y-3">
                                  {result.careerYogas.rajaYogas.map((yoga: any, index: number) => (
                                    <div key={index} className="p-3 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                                      <div className="flex items-start gap-2">
                                        <Award className="h-4 w-4 text-purple-500 mt-1 flex-shrink-0" />
                                        <div>
                                          <h5 className="font-semibold text-purple-800 text-sm">{yoga.name || yoga}</h5>
                                          {yoga.description && (
                                            <p className="text-xs text-purple-700 mt-1">{yoga.description}</p>
                                          )}
                                          {yoga.impact && (
                                            <p className="text-xs text-purple-600 mt-1 font-medium">Impact: {yoga.impact}</p>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {result.careerYogas.wealthYogas && result.careerYogas.wealthYogas.length > 0 && (
                              <div className="mb-4">
                                <h4 className="font-semibold text-yellow-700 mb-2">Wealth Yogas:</h4>
                                <div className="space-y-3">
                                  {result.careerYogas.wealthYogas.map((yoga: any, index: number) => (
                                    <div key={index} className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                                      <div className="flex items-start gap-2">
                                        <DollarSign className="h-4 w-4 text-yellow-500 mt-1 flex-shrink-0" />
                                        <div>
                                          <h5 className="font-semibold text-yellow-800 text-sm">{yoga.name || yoga}</h5>
                                          {yoga.description && (
                                            <p className="text-xs text-yellow-700 mt-1">{yoga.description}</p>
                                          )}
                                          {yoga.impact && (
                                            <p className="text-xs text-yellow-600 mt-1 font-medium">Impact: {yoga.impact}</p>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {result.careerYogas.challenges && result.careerYogas.challenges.length > 0 && (
                              <div>
                                <h4 className="font-semibold text-red-700 mb-2">Challenges & Remedies:</h4>
                                <div className="space-y-3">
                                  {result.careerYogas.challenges.map((challenge: any, index: number) => (
                                    <div key={index} className="p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                                      <div className="flex items-start gap-2">
                                        <AlertCircle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                                        <div>
                                          <h5 className="font-semibold text-red-800 text-sm">{challenge.name || challenge}</h5>
                                          {challenge.description && (
                                            <p className="text-xs text-red-700 mt-1">{challenge.description}</p>
                                          )}
                                          {challenge.remedy && (
                                            <p className="text-xs text-red-600 mt-1 font-medium">Remedy: {challenge.remedy}</p>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* Remedies */}
                        {result.remedies && (
                          <div className="bg-white p-6 rounded-lg border">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">🔮 Career Remedies</h3>
                            
                            {result.remedies.primaryRemedies && result.remedies.primaryRemedies.length > 0 && (
                              <div className="mb-4">
                                <h4 className="font-semibold text-purple-700 mb-2">Primary Remedies:</h4>
                                <ul className="space-y-1">
                                  {result.remedies.primaryRemedies.map((remedy: string, index: number) => (
                                    <li key={index} className="flex items-start gap-2">
                                      <Lightbulb className="h-4 w-4 text-purple-500 mt-1 flex-shrink-0" />
                                      <span className="text-sm text-gray-700">{remedy}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {result.remedies.mantras && result.remedies.mantras.length > 0 && (
                              <div className="mb-4">
                                <h4 className="font-semibold text-orange-700 mb-2">Mantras:</h4>
                                <div className="space-y-3">
                                  {result.remedies.mantras.map((mantra: any, index: number) => (
                                    <div key={index} className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                                      <div className="flex items-start gap-3">
                                        <span className="text-orange-500 mt-1 flex-shrink-0">🔱</span>
                                        <div className="flex-1">
                                          {mantra.planet && (
                                            <div className="font-semibold text-orange-800 text-sm mb-1">
                                              {mantra.planet} Mantra
                                            </div>
                                          )}
                                          <div className="text-sm text-gray-700 font-mono bg-orange-100 p-2 rounded mb-2">
                                            {mantra.mantra || mantra}
                                          </div>
                                          {mantra.duration && (
                                            <div className="text-xs text-orange-600">
                                              Duration: {mantra.duration}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {result.remedies.gemstones && result.remedies.gemstones.length > 0 && (
                              <div className="mb-4">
                                <h4 className="font-semibold text-blue-700 mb-2">Gemstones:</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {result.remedies.gemstones.map((gem: any, index: number) => (
                                    <div key={index} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                                      <div className="flex items-start gap-2">
                                        <span className="text-blue-500 mt-1">💎</span>
                                        <div className="flex-1">
                                          {gem.planet && (
                                            <div className="font-semibold text-blue-800 text-sm">
                                              {gem.planet} - {gem.stone || gem}
                                            </div>
                                          )}
                                          {!gem.planet && (
                                            <div className="font-semibold text-blue-800 text-sm">{gem}</div>
                                          )}
                                          {gem.benefit && (
                                            <div className="text-xs text-blue-600 mt-1">{gem.benefit}</div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {result.remedies.charity && result.remedies.charity.length > 0 && (
                              <div className="mb-4">
                                <h4 className="font-semibold text-green-700 mb-2">Charity/Donations:</h4>
                                <div className="space-y-3">
                                  {result.remedies.charity.map((charity: any, index: number) => (
                                    <div key={index} className="p-3 bg-green-50 rounded-lg border border-green-200">
                                      <div className="flex items-start gap-3">
                                        <span className="text-green-500 mt-1 flex-shrink-0">💝</span>
                                        <div className="flex-1">
                                          {charity.planet && (
                                            <div className="font-semibold text-green-800 text-sm mb-1">
                                              {charity.planet} Charity
                                            </div>
                                          )}
                                          <div className="text-sm text-gray-700 mb-1">
                                            {charity.donation || charity}
                                          </div>
                                          {charity.frequency && (
                                            <div className="text-xs text-green-600">
                                              Frequency: {charity.frequency}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {result.remedies.lifestyle && result.remedies.lifestyle.length > 0 && (
                              <div className="mb-4">
                                <h4 className="font-semibold text-indigo-700 mb-2">Lifestyle Practices:</h4>
                                <div className="space-y-2">
                                  {result.remedies.lifestyle.map((practice: string, index: number) => (
                                    <div key={index} className="flex items-start gap-2 p-2 bg-indigo-50 rounded">
                                      <Lightbulb className="h-4 w-4 text-indigo-500 mt-1 flex-shrink-0" />
                                      <span className="text-sm text-indigo-700">{practice}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {result.remedies.implementation && (
                              <div className="p-4 bg-yellow-50 rounded-lg">
                                <h4 className="font-semibold text-yellow-800 mb-2">Implementation:</h4>
                                <p className="text-sm text-yellow-700">{result.remedies.implementation}</p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Enhanced Lagna Analysis */}
                        {result.comprehensive_career_analysis?.career_foundation && (
                          <div className="bg-white p-6 rounded-lg border">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">🌟 Ascendant (Lagna) Analysis</h3>
                            
                            <div className="space-y-4">
                              {result.comprehensive_career_analysis.career_foundation.foundation && (
                                <div className="p-4 bg-purple-50 rounded-lg">
                                  <h4 className="font-semibold text-purple-800 mb-2">Career Foundation:</h4>
                                  <p className="text-sm text-purple-700">{result.comprehensive_career_analysis.career_foundation.foundation}</p>
                                </div>
                              )}

                              {result.comprehensive_career_analysis.career_foundation.work_style && (
                                <div className="p-4 bg-orange-50 rounded-lg">
                                  <h4 className="font-semibold text-orange-800 mb-2">Work Style:</h4>
                                  <p className="text-sm text-orange-700">{result.comprehensive_career_analysis.career_foundation.work_style}</p>
                                </div>
                              )}

                              {result.comprehensive_career_analysis.career_foundation.growth_pattern && (
                                <div className="p-4 bg-blue-50 rounded-lg">
                                  <h4 className="font-semibold text-blue-800 mb-2">Growth Pattern:</h4>
                                  <p className="text-sm text-blue-700">{result.comprehensive_career_analysis.career_foundation.growth_pattern}</p>
                                </div>
                              )}

                              {result.comprehensive_career_analysis.career_foundation.suitable_fields && result.comprehensive_career_analysis.career_foundation.suitable_fields.length > 0 && (
                                <div className="p-4 bg-green-50 rounded-lg">
                                  <h4 className="font-semibold text-green-800 mb-2">Suitable Career Fields:</h4>
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {result.comprehensive_career_analysis.career_foundation.suitable_fields.map((field: string, index: number) => (
                                      <Badge key={index} variant="outline" className="text-xs">{field}</Badge>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {result.comprehensive_career_analysis.career_foundation.job_vs_business && (
                                <div className="p-4 bg-yellow-50 rounded-lg">
                                  <h4 className="font-semibold text-yellow-800 mb-2">Job vs Business:</h4>
                                  <p className="text-sm text-yellow-700">{result.comprehensive_career_analysis.career_foundation.job_vs_business}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Enhanced 10th Lord Analysis */}
                        {result.comprehensive_career_analysis?.tenth_lord_analysis && (
                          <div className="bg-white p-6 rounded-lg border">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">🏛️ 10th Lord (Career Lord) Analysis</h3>
                            
                            <div className="space-y-4">
                              <div className="p-4 bg-green-50 rounded-lg">
                                <h4 className="font-semibold text-green-800 mb-2">Analysis:</h4>
                                <p className="text-sm text-green-700">{result.comprehensive_career_analysis.tenth_lord_analysis.analysis}</p>
                              </div>

                              {result.comprehensive_career_analysis.tenth_lord_analysis.career_impact && (
                                <div className="p-4 bg-purple-50 rounded-lg">
                                  <h4 className="font-semibold text-purple-800 mb-2">Career Impact:</h4>
                                  <p className="text-sm text-purple-700">{result.comprehensive_career_analysis.tenth_lord_analysis.career_impact}</p>
                                </div>
                              )}

                              {result.comprehensive_career_analysis.tenth_lord_analysis.ancient_reference && (
                                <div className="p-4 bg-amber-50 rounded-lg border-l-4 border-amber-400">
                                  <h4 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
                                    <Star className="h-4 w-4" />
                                    Classical Reference:
                                  </h4>
                                  <p className="text-sm text-amber-700 italic">"{result.comprehensive_career_analysis.tenth_lord_analysis.ancient_reference}"</p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Enhanced Saturn Analysis */}
                        {result.comprehensive_career_analysis?.saturn_analysis && (
                          <div className="bg-white p-6 rounded-lg border">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">🪐 Saturn (Karmakaraka) Analysis</h3>
                            
                            <div className="space-y-4">
                              <div className="p-4 bg-slate-50 rounded-lg">
                                <h4 className="font-semibold text-slate-800 mb-2">Role in Career:</h4>
                                <p className="text-sm text-slate-700">{result.comprehensive_career_analysis.saturn_analysis.role}</p>
                              </div>

                              {result.comprehensive_career_analysis.saturn_analysis.analysis && (
                                <div className="p-4 bg-blue-50 rounded-lg">
                                  <h4 className="font-semibold text-blue-800 mb-2">Analysis:</h4>
                                  <p className="text-sm text-blue-700">{result.comprehensive_career_analysis.saturn_analysis.analysis}</p>
                                </div>
                              )}

                              {result.comprehensive_career_analysis.saturn_analysis.career_impact && (
                                <div className="p-4 bg-green-50 rounded-lg">
                                  <h4 className="font-semibold text-green-800 mb-2">Career Impact:</h4>
                                  <p className="text-sm text-green-700">{result.comprehensive_career_analysis.saturn_analysis.career_impact}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Enhanced Career Timeline */}
                        {result.comprehensive_career_analysis?.career_phases && (
                          <div className="bg-white p-6 rounded-lg border">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">⏰ Enhanced Career Timeline</h3>
                            
                            <div className="space-y-4">
                              <div className="p-4 bg-orange-50 rounded-lg">
                                <h4 className="font-semibold text-orange-800 mb-2">Foundation Phase:</h4>
                                <p className="text-sm text-orange-700">{result.comprehensive_career_analysis.career_phases.foundation}</p>
                              </div>

                              <div className="p-4 bg-green-50 rounded-lg">
                                <h4 className="font-semibold text-green-800 mb-2">Growth Phase:</h4>
                                <p className="text-sm text-green-700">{result.comprehensive_career_analysis.career_phases.growth}</p>
                              </div>

                              <div className="p-4 bg-blue-50 rounded-lg">
                                <h4 className="font-semibold text-blue-800 mb-2">Peak Phase:</h4>
                                <p className="text-sm text-blue-700">{result.comprehensive_career_analysis.career_phases.peak}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Analysis Summary */}
                        {result.analysisSummary && (
                          <div className="bg-white p-6 rounded-lg border">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">📊 Analysis Summary</h3>
                            
                            {result.analysisSummary.overallCareerPotential && (
                              <div className="mb-4 p-4 bg-green-50 rounded-lg">
                                <h4 className="font-semibold text-green-800 mb-2">Overall Career Potential:</h4>
                                <p className="text-sm text-green-700">{result.analysisSummary.overallCareerPotential}</p>
                              </div>
                            )}

                            {result.analysisSummary.keyStrengths && result.analysisSummary.keyStrengths.length > 0 && (
                              <div className="mb-4">
                                <h4 className="font-semibold text-blue-700 mb-2">Key Strengths:</h4>
                                <ul className="space-y-1">
                                  {result.analysisSummary.keyStrengths.map((strength: string, index: number) => (
                                    <li key={index} className="flex items-start gap-2">
                                      <TrendingUp className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0" />
                                      <span className="text-sm text-gray-700">{strength}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {result.analysisSummary.areasOfFocus && result.analysisSummary.areasOfFocus.length > 0 && (
                              <div className="mb-4">
                                <h4 className="font-semibold text-orange-700 mb-2">Areas of Focus:</h4>
                                <ul className="space-y-1">
                                  {result.analysisSummary.areasOfFocus.map((focus: string, index: number) => (
                                    <li key={index} className="flex items-start gap-2">
                                      <Target className="h-4 w-4 text-orange-500 mt-1 flex-shrink-0" />
                                      <span className="text-sm text-gray-700">{focus}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {result.analysisSummary.successFactors && result.analysisSummary.successFactors.length > 0 && (
                              <div>
                                <h4 className="font-semibold text-purple-700 mb-2">Success Factors:</h4>
                                <ul className="space-y-1">
                                  {result.analysisSummary.successFactors.map((factor: string, index: number) => (
                                    <li key={index} className="flex items-start gap-2">
                                      <Star className="h-4 w-4 text-purple-500 mt-1 flex-shrink-0" />
                                      <span className="text-sm text-gray-700">{factor}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
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

export default CareerReport;