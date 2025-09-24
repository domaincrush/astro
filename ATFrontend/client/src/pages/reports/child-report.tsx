import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'wouter';
import { useAuth } from 'src/hooks/useAuth';
import { Baby, Heart, BookOpen, Star, Shield, Calendar, Users, Stethoscope, GraduationCap, Home, Loader2, Download, Mail, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from 'src/components/ui/card';
import { Button } from 'src/components/ui/button';
import { Badge } from 'src/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'src/components/ui/tabs';
import { Input } from 'src/components/ui/input';
import { Label } from 'src/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'src/components/ui/select';
import { useToast } from 'src/hooks/use-toast';
import AstroTickHeader from 'src/components/layout/AstroTickHeader';
import LocationSearch from 'src/components/LocationSearch';

const ChildReport: React.FC = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    gender: 'male',
    birthDate: '',
    birthTime: '',
    birthPlace: '',
    coordinates: { latitude: 0, longitude: 0 },
    parentConcerns: '',
    childAge: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-100">
        <AstroTickHeader />
        <div className="py-16">
          <div className="max-w-md mx-auto px-4">
            <Card className="text-center">
              <CardHeader>
                <Lock className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-2xl font-bold text-gray-900">🎉 FREE Child Report!</CardTitle>
                <p className="text-gray-600">
                  <span className="font-semibold text-blue-600">Limited Time Offer:</span> Get your comprehensive child astrology analysis absolutely FREE! Simply create your account to claim this exclusive prediction.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={() => setLocation('/signup')}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                >
                  Claim FREE Child Report
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

  const childAspects = [
    {
      icon: Calendar,
      title: "Child Birth Timing",
      description: "Auspicious periods for conception and child birth",
      color: "from-pink-500 to-rose-500"
    },
    {
      icon: Stethoscope,
      title: "Health & Development",
      description: "Physical health, mental development, and growth patterns",
      color: "from-green-500 to-teal-500"
    },
    {
      icon: GraduationCap,
      title: "Education & Learning",
      description: "Academic potential, learning abilities, and educational guidance",
      color: "from-blue-500 to-indigo-500"
    },
    {
      icon: Star,
      title: "Talents & Skills",
      description: "Natural talents, creative abilities, and skill development",
      color: "from-purple-500 to-violet-500"
    },
    {
      icon: Users,
      title: "Family Relationships",
      description: "Bonding with parents, siblings, and family dynamics",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: Shield,
      title: "Protection & Remedies",
      description: "Protective measures, health remedies, and spiritual guidance",
      color: "from-yellow-500 to-amber-500"
    }
  ];

  const reportFeatures = [
    "Child birth timing and auspicious periods",
    "Health analysis and developmental milestones",
    "Educational potential and learning abilities",
    "Natural talents and creative skills identification",
    "Personality traits and behavioral patterns",
    "Family relationships and sibling compatibility",
    "Parenting guidance and child-rearing tips",
    "Health remedies and protective measures",
    "Career guidance and future prospects",
    "Spiritual development and cultural values"
  ];

  const parentStories = [
    {
      name: "Sunita Sharma",
      childAge: "5 years",
      story: "The report accurately predicted my daughter's artistic talents. She's now excelling in dance classes as mentioned in the analysis!",
      outcome: "Artistic development",
      location: "Mumbai"
    },
    {
      name: "Rajesh Kumar",
      childAge: "8 years",
      story: "The educational guidance was spot-on. My son is performing excellently in mathematics, exactly as predicted in the report.",
      outcome: "Academic excellence",
      location: "Delhi"
    },
    {
      name: "Priya Patel",
      childAge: "3 years",
      story: "The health remedies mentioned in the report helped improve my child's immunity. Very grateful for the guidance.",
      outcome: "Health improvement",
      location: "Ahmedabad"
    }
  ];

  const handleLocationSelect = (locationObj: any, coords: any) => {
    console.log('Child report location select:', locationObj, coords);
    setFormData({
      ...formData,
      birthPlace: locationObj.display || locationObj.name || locationObj,
      coordinates: coords
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.birthDate || !formData.birthTime || !formData.birthPlace) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields for child analysis",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/astrology-reports/child-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          gender: formData.gender,
          birthDate: formData.birthDate,
          birthTime: formData.birthTime,
          birthPlace: formData.birthPlace,
          coordinates: formData.coordinates
        })
      });

      const data = await response.json();

      if (data.success) {
        console.log('Child Report Data:', data);
        setReportData(data);
        setActiveTab('results'); // Switch to results tab
        toast({
          title: "Child Analysis Complete!",
          description: `Generated comprehensive child analysis using ${data.calculationEngine}`,
        });
      } else {
        toast({
          title: "Analysis Failed",
          description: data.message || "Failed to generate child analysis",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "Unable to connect to astrological analysis service",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Helmet>
        <title>Child Report - Child Birth & Parenting Guidance | AstroTick</title>
        <meta name="description" content="Get detailed child analysis with birth timing, health guidance, educational potential, and parenting tips based on astrology." />
        <meta name="keywords" content="child astrology, child birth timing, parenting guidance, child development, educational astrology" />
      </Helmet>
      
      <AstroTickHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center items-center gap-3 mb-4">
              <Baby className="h-8 w-8 text-blue-600" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Child Report
              </h1>
              <Heart className="h-8 w-8 text-pink-600" />
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Child birth and parenting guidance with educational potential and development analysis
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="child-aspects">Child Aspects</TabsTrigger>
              <TabsTrigger value="analysis">Get Analysis</TabsTrigger>
              <TabsTrigger value="results" disabled={!reportData}>Analysis Results</TabsTrigger>
              <TabsTrigger value="parent-stories">Parent Stories</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              {/* What is Child Astrology */}
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-2xl text-blue-800">What is Child Astrology?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-gray-700">
                    <p>
                      Child astrology analyzes birth charts to understand a child's natural potential, health patterns, educational abilities, and personality traits. It provides valuable guidance for parents on nurturing their child's development and addressing challenges effectively.
                    </p>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-blue-800 mb-3">Child Analysis Includes</h3>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start gap-2">
                            <Baby className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span>5th house analysis for children and creativity</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Baby className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span>Moon position for emotional development</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Baby className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span>Mercury influence on learning abilities</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Baby className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span>Jupiter's role in wisdom and growth</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-semibold text-blue-800 mb-3">Key Insights</h3>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start gap-2">
                            <Star className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span>Natural talents and skill development areas</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Star className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span>Health patterns and preventive measures</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Star className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span>Educational potential and learning style</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Star className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span>Personality traits and behavioral guidance</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Report Features */}
              <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                <CardHeader>
                  <CardTitle className="text-2xl text-purple-800">What You'll Get in Your Report</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {reportFeatures.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Child Development Stages */}
              <Card className="bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200">
                <CardHeader>
                  <CardTitle className="text-2xl text-pink-800">Child Development Stages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Baby className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="font-semibold text-green-800 mb-2">0-3 Years</h3>
                      <p className="text-sm text-gray-600">Foundation period for health, bonding, and basic development</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BookOpen className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="font-semibold text-blue-800 mb-2">3-7 Years</h3>
                      <p className="text-sm text-gray-600">Learning phase with skill development and educational foundation</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <GraduationCap className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="font-semibold text-purple-800 mb-2">7-14 Years</h3>
                      <p className="text-sm text-gray-600">Academic focus with talent recognition and personality development</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Star className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="font-semibold text-pink-800 mb-2">14+ Years</h3>
                      <p className="text-sm text-gray-600">Career guidance and future planning with specialized development</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="child-aspects" className="space-y-8">
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-2xl text-blue-800">Child Development Aspects</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {childAspects.map((aspect, index) => (
                      <Card key={index} className="hover:shadow-lg transition-shadow group">
                        <CardContent className="p-6">
                          <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${aspect.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                            <aspect.icon className="h-6 w-6 text-white" />
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-2">{aspect.title}</h3>
                          <p className="text-sm text-gray-600">{aspect.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Educational Potential */}
              <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                <CardHeader>
                  <CardTitle className="text-2xl text-purple-800">Educational Potential Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="p-4 bg-white rounded-lg shadow-sm">
                        <h3 className="font-semibold text-purple-800 mb-2">Academic Subjects</h3>
                        <p className="text-sm text-gray-600">Mathematics, Science, Languages, Arts based on Mercury and Jupiter positions</p>
                      </div>
                      <div className="p-4 bg-white rounded-lg shadow-sm">
                        <h3 className="font-semibold text-purple-800 mb-2">Learning Style</h3>
                        <p className="text-sm text-gray-600">Visual, auditory, kinesthetic learning preferences from planetary analysis</p>
                      </div>
                      <div className="p-4 bg-white rounded-lg shadow-sm">
                        <h3 className="font-semibold text-purple-800 mb-2">Creative Abilities</h3>
                        <p className="text-sm text-gray-600">Art, music, dance, writing talents indicated by Venus and Moon</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="p-4 bg-white rounded-lg shadow-sm">
                        <h3 className="font-semibold text-purple-800 mb-2">Higher Education</h3>
                        <p className="text-sm text-gray-600">College prospects, research potential, and specialized fields</p>
                      </div>
                      <div className="p-4 bg-white rounded-lg shadow-sm">
                        <h3 className="font-semibold text-purple-800 mb-2">Skill Development</h3>
                        <p className="text-sm text-gray-600">Technical skills, sports, and extracurricular activities</p>
                      </div>
                      <div className="p-4 bg-white rounded-lg shadow-sm">
                        <h3 className="font-semibold text-purple-800 mb-2">Career Guidance</h3>
                        <p className="text-sm text-gray-600">Future career paths and professional development areas</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Health and Development */}
              <Card className="bg-gradient-to-r from-green-50 to-teal-50 border-green-200">
                <CardHeader>
                  <CardTitle className="text-2xl text-green-800">Health and Development Guidance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-white rounded-lg">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Stethoscope className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-green-800 mb-2">Physical Health</h3>
                      <p className="text-sm text-gray-600">Body constitution, immunity, and preventive health measures</p>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Heart className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-blue-800 mb-2">Mental Health</h3>
                      <p className="text-sm text-gray-600">Emotional balance, stress management, and psychological well-being</p>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Shield className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-purple-800 mb-2">Protective Measures</h3>
                      <p className="text-sm text-gray-600">Remedies, mantras, and spiritual practices for protection</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analysis" className="space-y-8">
              <div className="grid lg:grid-cols-2 gap-8">
                <Card className="bg-white/90 backdrop-blur-sm border-blue-200 shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <Baby className="h-6 w-6" />
                      Get Your Child Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="name">Child's Full Name</Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Enter child's full name"
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
                        <Label htmlFor="date">Date of Birth</Label>
                        <Input
                          id="date"
                          type="date"
                          value={formData.birthDate}
                          onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="time">Time of Birth</Label>
                        <Input
                          id="time"
                          type="time"
                          value={formData.birthTime}
                          onChange={(e) => setFormData({...formData, birthTime: e.target.value})}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="place">Place of Birth</Label>
                        <LocationSearch
                          onLocationSelect={handleLocationSelect}
                          placeholder="Enter birth city (e.g., Chennai, Mumbai, Delhi)"
                          className="mt-1"
                        />
                        {formData.birthPlace && (
                          <p className="text-sm text-green-600 mt-1">
                            📍 {formData.birthPlace}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="childAge">Current Age</Label>
                        <Select value={formData.childAge} onValueChange={(value) => setFormData({...formData, childAge: value})}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select age range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0-3">0-3 Years</SelectItem>
                            <SelectItem value="3-7">3-7 Years</SelectItem>
                            <SelectItem value="7-14">7-14 Years</SelectItem>
                            <SelectItem value="14+">14+ Years</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="parentConcerns">Parent's Concerns (Optional)</Label>
                        <Input
                          id="parentConcerns"
                          type="text"
                          placeholder="Any specific concerns about your child"
                          value={formData.parentConcerns}
                          onChange={(e) => setFormData({...formData, parentConcerns: e.target.value})}
                          className="mt-1"
                        />
                      </div>

                      <Button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating Analysis...
                          </>
                        ) : (
                          'Get Child Analysis - ₹300 (was ₹600)'
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
                          <BookOpen className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Detailed 20+ page child analysis report</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Star className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Natural talents and skill development guidance</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <GraduationCap className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Educational potential and learning style analysis</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Stethoscope className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Health guidance and preventive measures</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Heart className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Parenting tips and child development guidance</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
                    <CardHeader>
                      <CardTitle className="text-yellow-800">Child Report Features</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-yellow-600" />
                          <span>Age-appropriate development guidelines</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-yellow-600" />
                          <span>Family relationship dynamics</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Home className="h-4 w-4 text-yellow-600" />
                          <span>Home environment recommendations</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-yellow-600" />
                          <span>Protective remedies and mantras</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>


            </TabsContent>

            <TabsContent value="results" className="space-y-8">
              {reportData ? (
                <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-2xl text-blue-800 flex items-center gap-2">
                      <Baby className="h-6 w-6" />
                      Child Analysis Report
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h3 className="font-semibold text-blue-800 mb-3">Personal Details</h3>
                        <div className="space-y-2 text-sm">
                          <p><strong>Name:</strong> {formData.name}</p>
                          <p><strong>Gender:</strong> {formData.gender}</p>
                          <p><strong>Birth Date:</strong> {formData.birthDate}</p>
                          <p><strong>Birth Time:</strong> {formData.birthTime}</p>
                          <p><strong>Birth Place:</strong> {formData.birthPlace}</p>
                          <p><strong>Current Age:</strong> {formData.childAge}</p>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-blue-800 mb-3">Calculation Status</h3>
                        <div className="space-y-2 text-sm">
                          <p><strong>Calculation Engine:</strong> {reportData.calculationEngine || 'Authentic-Jyotisha-Engine'}</p>
                          <p><strong>Response Time:</strong> {reportData.responseTime || 'N/A'}</p>
                          <p><strong>Status:</strong> <span className="text-green-600">✓ Complete</span></p>
                        </div>
                      </div>
                    </div>

                    {/* Analysis Sections */}
                    <div className="space-y-6">
                      {reportData.childrenProspects && (
                        <div>
                          <h3 className="text-lg font-semibold text-green-800 mb-3 flex items-center gap-2">
                            <Heart className="h-5 w-5" />
                            Children & Family Prospects
                          </h3>
                          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Object.entries(reportData.childrenProspects).map(([key, value]) => {
                              // Handle complex nested objects
                              let displayValue = value;
                              if (typeof value === 'object' && value !== null) {
                                if (key === 'putraDosha') {
                                  displayValue = `${value.present ? 'Present' : 'Not Present'} - ${value.severity?.level || 'None'}`;
                                } else if (key === 'maleficInfluence') {
                                  displayValue = `${value.influence || 'Unknown'} - ${value.strength || 'None'}`;
                                } else if (key === 'jupiterAnalysis') {
                                  displayValue = `${value.strength || 'Unknown'} in House ${value.house || 'N/A'} - ${value.influence || ''}`;
                                } else if (key === 'moonVenusAnalysis') {
                                  displayValue = `Moon: ${value.moonStrength || 'Unknown'}, Venus: ${value.venusStrength || 'Unknown'}`;
                                } else if (key === 'timingFactors') {
                                  displayValue = value.idealAge || 'Analysis available';
                                } else if (key === 'bhavaStrength') {
                                  displayValue = `Strength: ${value.averageStrength || '0%'} - ${value.interpretation || 'Unknown'}`;
                                } else {
                                  displayValue = JSON.stringify(value).substring(0, 100) + '...';
                                }
                              }
                              
                              return (
                                <div key={key} className="bg-white rounded-lg p-4 shadow-sm border">
                                  <h4 className="font-medium text-green-700 mb-2 capitalize">
                                    {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                                  </h4>
                                  <p className="text-sm text-gray-700">{String(displayValue)}</p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {reportData.fertilityGuidance && (
                        <div>
                          <h3 className="text-lg font-semibold text-pink-800 mb-3 flex items-center gap-2">
                            <Star className="h-5 w-5" />
                            Fertility & Conception Guidance
                          </h3>
                          <div className="space-y-3">
                            {Object.entries(reportData.fertilityGuidance).map(([key, value]) => {
                              let displayValue = value;
                              if (Array.isArray(value)) {
                                displayValue = value.join(', ');
                              } else if (typeof value === 'object' && value !== null) {
                                displayValue = JSON.stringify(value).substring(0, 100) + '...';
                              }
                              
                              return (
                                <div key={key} className="bg-white rounded-lg p-4 shadow-sm border">
                                  <h4 className="font-medium text-pink-700 mb-2 capitalize">
                                    {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                                  </h4>
                                  <p className="text-sm text-gray-700">{String(displayValue)}</p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {reportData.childTiming && (
                        <div>
                          <h3 className="text-lg font-semibold text-yellow-800 mb-3 flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Child Birth Timing Analysis
                          </h3>
                          <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-4">
                            {Object.entries(reportData.childTiming).map(([key, value]) => {
                              let displayValue = value;
                              
                              if (typeof value === 'object' && value !== null) {
                                if (key === 'dashaAnalysis') {
                                  displayValue = `Current Effect: ${value.currentDashaEffect || 'Unknown'}, Favorability: ${value.favorability || 'Unknown'}`;
                                } else if (key === 'currentPeriodAnalysis') {
                                  displayValue = `Suitability: ${value.overallSuitability || 'Unknown'}, Next Period: ${value.nextFavorablePeriod || 'To be determined'}`;
                                } else if (key === 'transitAnalysis') {
                                  displayValue = value.generalGuidance || 'Analysis available';
                                } else if (key === 'ageAnalysis') {
                                  displayValue = `Best ages for children based on astrological periods`;
                                } else if (key === 'favorablePeriods' && Array.isArray(value)) {
                                  displayValue = value.map(period => period.period || 'Unknown period').join(', ');
                                } else if (key === 'jupiterTransits') {
                                  displayValue = value.guidance || `Current house: ${value.currentTransit?.house || 'Unknown'}`;
                                } else if (key === 'seasonalTiming') {
                                  displayValue = `Spring: ${value.springTime?.favorability || 'Unknown'}, Best season for conception attempts`;
                                } else if (Array.isArray(value)) {
                                  displayValue = value.join(', ');
                                } else {
                                  displayValue = JSON.stringify(value).substring(0, 150) + '...';
                                }
                              }
                              
                              return (
                                <div key={key} className="bg-white rounded-lg p-4 shadow-sm border">
                                  <h4 className="font-medium text-yellow-700 mb-2 capitalize">
                                    {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                                  </h4>
                                  <p className="text-sm text-gray-700">{String(displayValue)}</p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {reportData.childHealth && (
                        <div>
                          <h3 className="text-lg font-semibold text-purple-800 mb-3 flex items-center gap-2">
                            <Stethoscope className="h-5 w-5" />
                            Child Health & Development
                          </h3>
                          <div className="space-y-3">
                            {Object.entries(reportData.childHealth).map(([key, value]) => {
                              let displayValue = value;
                              if (Array.isArray(value)) {
                                displayValue = value.join(', ');
                              } else if (typeof value === 'object' && value !== null) {
                                displayValue = JSON.stringify(value).substring(0, 100) + '...';
                              }
                              
                              return (
                                <div key={key} className="bg-white rounded-lg p-4 shadow-sm border">
                                  <h4 className="font-medium text-purple-700 mb-2 capitalize">
                                    {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                                  </h4>
                                  <p className="text-sm text-gray-700">{String(displayValue)}</p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {reportData.remedies && (
                        <div>
                          <h3 className="text-lg font-semibold text-orange-800 mb-3 flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            Remedies & Spiritual Guidance
                          </h3>
                          <div className="space-y-3">
                            {Array.isArray(reportData.remedies) ? (
                              reportData.remedies.map((remedy, index) => (
                                <div key={index} className="bg-white rounded-lg p-4 shadow-sm border">
                                  <h4 className="font-medium text-orange-700 mb-2">
                                    {remedy.purpose || `Remedy ${index + 1}`}
                                  </h4>
                                  <p className="text-sm text-gray-700 mb-2">
                                    <strong>Practice:</strong> {remedy.remedy || 'Not specified'}
                                  </p>
                                  {remedy.timing && (
                                    <p className="text-sm text-gray-600">
                                      <strong>Timing:</strong> {remedy.timing}
                                    </p>
                                  )}
                                  {remedy.duration && (
                                    <p className="text-sm text-gray-600">
                                      <strong>Duration:</strong> {remedy.duration}
                                    </p>
                                  )}
                                </div>
                              ))
                            ) : (
                              <div className="bg-white rounded-lg p-4 shadow-sm border">
                                <p className="text-sm text-gray-700">{String(reportData.remedies)}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Download & Email Options */}
                    <div className="mt-6 pt-6 border-t">
                      <h3 className="text-lg font-semibold text-indigo-800 mb-3">Report Delivery Options</h3>
                      <div className="flex flex-wrap gap-4">
                        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                          <Download className="mr-2 h-4 w-4" />
                          Download PDF Report
                        </Button>
                        <Button variant="outline" className="border-blue-300 hover:bg-blue-50">
                          <Mail className="mr-2 h-4 w-4" />
                          Email Report
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-yellow-50 border-yellow-200">
                  <CardContent className="text-center py-12">
                    <Baby className="h-16 w-16 text-yellow-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-yellow-800 mb-2">No Analysis Available</h3>
                    <p className="text-yellow-700">Please fill out the form in the "Get Analysis" tab to generate your child report.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="parent-stories" className="space-y-8">
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-2xl text-blue-800">Parent Success Stories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    {parentStories.map((story, index) => (
                      <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                        <div className="flex items-center gap-1 mb-3">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">{story.name}</h3>
                        <div className="flex gap-2 mb-3">
                          <Badge variant="secondary">{story.childAge}</Badge>
                          <Badge variant="outline">{story.location}</Badge>
                        </div>
                        <p className="text-sm text-gray-700 mb-3 italic">"{story.story}"</p>
                        <div className="text-xs text-blue-600 font-medium">{story.outcome}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                <CardHeader>
                  <CardTitle className="text-2xl text-purple-800">Why Child Astrology Helps Parents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="font-semibold text-purple-800 mb-4">Understanding Your Child</h3>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li>• Reveals natural talents and abilities</li>
                        <li>• Explains behavioral patterns and tendencies</li>
                        <li>• Identifies learning styles and preferences</li>
                        <li>• Provides health and developmental insights</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-purple-800 mb-4">Practical Parenting Benefits</h3>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li>• Better communication with your child</li>
                        <li>• Appropriate educational and activity choices</li>
                        <li>• Proactive health and wellness approach</li>
                        <li>• Stronger parent-child bonding</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ChildReport;