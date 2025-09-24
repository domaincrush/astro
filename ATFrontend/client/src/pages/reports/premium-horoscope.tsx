import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Crown, User, Calendar, Clock, MapPin, Star, Zap, Heart, Briefcase, Activity, DollarSign, BookOpen, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from 'src/components/ui/card';
import { Button } from 'src/components/ui/button';
import { Badge } from 'src/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'src/components/ui/tabs';
import { Input } from 'src/components/ui/input';
import { Label } from 'src/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'src/components/ui/select';
import AstroTickHeader from 'src/components/layout/AstroTickHeader';

const PremiumHoroscope: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    gender: 'male',
    date: '',
    time: '',
    place: '',
    reportType: 'comprehensive'
  });

  const reportFeatures = [
    {
      icon: Star,
      title: "Birth Chart Analysis",
      description: "Complete planetary positions and house interpretations",
      color: "from-yellow-500 to-amber-500"
    },
    {
      icon: Zap,
      title: "Dasha Predictions",
      description: "120-year planetary period analysis with life events",
      color: "from-purple-500 to-indigo-500"
    },
    {
      icon: Heart,
      title: "Relationship Analysis",
      description: "Love life, marriage timing, and compatibility insights",
      color: "from-pink-500 to-rose-500"
    },
    {
      icon: Briefcase,
      title: "Career Guidance",
      description: "Professional path, business success, and timing",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Activity,
      title: "Health Insights",
      description: "Physical well-being, disease tendencies, and remedies",
      color: "from-red-500 to-orange-500"
    },
    {
      icon: DollarSign,
      title: "Wealth Predictions",
      description: "Financial gains, property, and prosperity timing",
      color: "from-green-500 to-teal-500"
    },
    {
      icon: BookOpen,
      title: "Education & Learning",
      description: "Academic success, higher studies, and skill development",
      color: "from-indigo-500 to-purple-500"
    },
    {
      icon: Shield,
      title: "Remedial Measures",
      description: "Gemstones, mantras, and rituals for life enhancement",
      color: "from-orange-500 to-red-500"
    }
  ];

  const sampleReports = [
    {
      title: "Comprehensive Life Report",
      pages: "66+ Pages",
      price: "₹2,499",
      features: ["Complete Birth Chart", "Dasha Analysis", "Yearly Predictions", "Remedial Measures"]
    },
    {
      title: "Career Success Report",
      pages: "35+ Pages",
      price: "₹1,299",
      features: ["Professional Analysis", "Business Timing", "Success Periods", "Career Remedies"]
    },
    {
      title: "Marriage & Love Report",
      pages: "40+ Pages",
      price: "₹1,599",
      features: ["Relationship Analysis", "Marriage Timing", "Partner Compatibility", "Love Remedies"]
    }
  ];

  const testimonials = [
    {
      name: "Rajesh Kumar",
      location: "Delhi",
      rating: 5,
      text: "The premium horoscope was incredibly accurate. It predicted my job change exactly when it happened!",
      reportType: "Career Report"
    },
    {
      name: "Priya Sharma",
      location: "Mumbai",
      rating: 5,
      text: "Amazing detailed analysis! The marriage timing was spot on. Highly recommend this service.",
      reportType: "Marriage Report"
    },
    {
      name: "Amit Patel",
      location: "Bangalore",
      rating: 5,
      text: "The remedial measures really worked. I've seen positive changes in my life after following them.",
      reportType: "Life Report"
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <Helmet>
        <title>Premium Horoscope Report - Detailed Astrology Analysis | AstroTick</title>
        <meta name="description" content="Get detailed premium horoscope analysis with 66+ pages covering life predictions, career, marriage, health, and remedial measures." />
        <meta name="keywords" content="premium horoscope, detailed astrology report, vedic predictions, life analysis, career horoscope" />
      </Helmet>
      
      <AstroTickHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center items-center gap-3 mb-4">
              <Crown className="h-8 w-8 text-purple-600" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Premium Horoscope
              </h1>
              <Star className="h-8 w-8 text-purple-600" />
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Detailed premium horoscope analysis with comprehensive life predictions and remedial guidance
            </p>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="order">Order Report</TabsTrigger>
              <TabsTrigger value="samples">Sample Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              {/* What is Premium Horoscope */}
              <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
                <CardHeader>
                  <CardTitle className="text-2xl text-purple-800">What is Premium Horoscope?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-gray-700">
                    <p>
                      A Premium Horoscope is a comprehensive astrological analysis that provides detailed insights into your entire life journey. Unlike basic horoscopes, our premium reports use advanced Vedic astrology techniques to deliver precise predictions and remedial guidance.
                    </p>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-purple-800 mb-3">What You Get</h3>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start gap-2">
                            <Star className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                            <span>Complete birth chart analysis with planetary positions</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Star className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                            <span>Detailed predictions for career, marriage, health, and wealth</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Star className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                            <span>Dasha analysis covering 120 years of life events</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Star className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                            <span>Remedial measures including gemstones and mantras</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-semibold text-purple-800 mb-3">Why Choose Premium?</h3>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start gap-2">
                            <Crown className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                            <span>Authentic Vedic calculations using Swiss Ephemeris</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Crown className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                            <span>Personalized analysis based on your unique birth chart</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Crown className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                            <span>Professional astrologer consultation included</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Crown className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                            <span>Lifetime access to your digital report</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Report Features Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {reportFeatures.map((feature, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow group">
                    <CardContent className="p-6">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <feature.icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Testimonials */}
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-2xl text-blue-800">What Our Customers Say</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    {testimonials.map((testimonial, index) => (
                      <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                        <div className="flex items-center gap-1 mb-3">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold text-gray-900">{testimonial.name}</p>
                            <p className="text-sm text-gray-600">{testimonial.location}</p>
                          </div>
                          <Badge variant="secondary">{testimonial.reportType}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="features" className="space-y-8">
              <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
                <CardHeader>
                  <CardTitle className="text-2xl text-purple-800">Premium Report Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                          <Star className="h-5 w-5" />
                          Birth Chart Analysis
                        </h3>
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li>• Complete planetary positions and house placements</li>
                          <li>• Ascendant and moon sign detailed analysis</li>
                          <li>• Planetary aspects and conjunctions</li>
                          <li>• Strength analysis of all planets</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                          <Zap className="h-5 w-5" />
                          Dasha Predictions
                        </h3>
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li>• Vimshottari Dasha system for 120 years</li>
                          <li>• Major and minor period analysis</li>
                          <li>• Life events timing predictions</li>
                          <li>• Favorable and challenging periods</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                          <Heart className="h-5 w-5" />
                          Relationship Analysis
                        </h3>
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li>• Marriage timing and compatibility</li>
                          <li>• Partner characteristics and preferences</li>
                          <li>• Love life and relationship patterns</li>
                          <li>• Family harmony and children predictions</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                          <Briefcase className="h-5 w-5" />
                          Career Guidance
                        </h3>
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li>• Suitable career paths and professions</li>
                          <li>• Business success and entrepreneurship</li>
                          <li>• Job changes and promotions timing</li>
                          <li>• Professional growth opportunities</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                          <Activity className="h-5 w-5" />
                          Health Insights
                        </h3>
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li>• Physical health tendencies and vulnerabilities</li>
                          <li>• Disease prevention and health maintenance</li>
                          <li>• Mental health and emotional patterns</li>
                          <li>• Longevity and life span analysis</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                          <DollarSign className="h-5 w-5" />
                          Wealth Predictions
                        </h3>
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li>• Financial gains and wealth accumulation</li>
                          <li>• Property and real estate opportunities</li>
                          <li>• Investment timing and strategies</li>
                          <li>• Debt management and financial stability</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                          <BookOpen className="h-5 w-5" />
                          Education & Learning
                        </h3>
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li>• Academic success and higher studies</li>
                          <li>• Skill development and learning abilities</li>
                          <li>• Research and intellectual pursuits</li>
                          <li>• Knowledge areas and specializations</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                          <Shield className="h-5 w-5" />
                          Remedial Measures
                        </h3>
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li>• Gemstone recommendations and wearing methods</li>
                          <li>• Powerful mantras and their recitation</li>
                          <li>• Charitable activities and donations</li>
                          <li>• Spiritual practices and rituals</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="order" className="space-y-8">
              <div className="grid lg:grid-cols-2 gap-8">
                <Card className="bg-white/90 backdrop-blur-sm border-purple-200 shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <Crown className="h-6 w-6" />
                      Order Premium Horoscope
                    </CardTitle>
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
                        <Label htmlFor="date">Date of Birth</Label>
                        <Input
                          id="date"
                          type="date"
                          value={formData.date}
                          onChange={(e) => setFormData({...formData, date: e.target.value})}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="time">Time of Birth</Label>
                        <Input
                          id="time"
                          type="time"
                          value={formData.time}
                          onChange={(e) => setFormData({...formData, time: e.target.value})}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="place">Place of Birth</Label>
                        <Input
                          id="place"
                          type="text"
                          placeholder="Enter birth place"
                          value={formData.place}
                          onChange={(e) => setFormData({...formData, place: e.target.value})}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="reportType">Report Type</Label>
                        <Select value={formData.reportType} onValueChange={(value) => setFormData({...formData, reportType: value})}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select report type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="comprehensive">Comprehensive Life Report (₹2,499)</SelectItem>
                            <SelectItem value="career">Career Success Report (₹1,299)</SelectItem>
                            <SelectItem value="marriage">Marriage & Love Report (₹1,599)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                      >
                        Order Premium Report
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                <div className="space-y-6">
                  <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
                    <CardHeader>
                      <CardTitle className="text-green-800">Why Choose Our Premium Reports?</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3 text-sm">
                        <li className="flex items-start gap-2">
                          <Shield className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>100% authentic Vedic calculations using Swiss Ephemeris</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Crown className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Reviewed by experienced Vedic astrologers</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Star className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Personalized analysis based on your unique birth chart</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Clock className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Delivered within 24-48 hours</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <BookOpen className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Lifetime access to your digital report</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
                    <CardHeader>
                      <CardTitle className="text-yellow-800">Report Delivery</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-yellow-600" />
                          <span>24-48 hours delivery time</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-yellow-600" />
                          <span>PDF format with detailed analysis</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-600" />
                          <span>66+ pages of comprehensive content</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-yellow-600" />
                          <span>Personalized consultation included</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="samples" className="space-y-8">
              <div className="grid md:grid-cols-3 gap-6">
                {sampleReports.map((report, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                      <CardTitle className="text-lg">{report.title}</CardTitle>
                      <div className="flex justify-between items-center">
                        <Badge variant="secondary" className="bg-white/20 text-white">
                          {report.pages}
                        </Badge>
                        <span className="text-xl font-bold">{report.price}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <ul className="space-y-2 text-sm">
                        {report.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-purple-600" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Button className="w-full mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                        View Sample
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default PremiumHoroscope;