import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { DollarSign, TrendingUp, Home, Coins, Building, Banknote, Calculator, PiggyBank, CreditCard, Gem } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from 'src/components/ui/card';
import { Button } from 'src/components/ui/button';
import { Badge } from 'src/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'src/components/ui/tabs';
import { Input } from 'src/components/ui/input';
import { Label } from 'src/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'src/components/ui/select';
import AstroTickHeader from 'src/components/layout/AstroTickHeader';

const WealthReport: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    gender: 'male',
    date: '',
    time: '',
    place: '',
    currentIncome: '',
    financialGoals: ''
  });

  const wealthSources = [
    {
      icon: Building,
      title: "Business & Entrepreneurship",
      description: "Profit through business ventures, partnerships, and investments",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Coins,
      title: "Career & Profession",
      description: "Salary growth, promotions, and professional achievements",
      color: "from-green-500 to-teal-500"
    },
    {
      icon: Home,
      title: "Real Estate & Property",
      description: "Land, buildings, and property investments for wealth building",
      color: "from-purple-500 to-indigo-500"
    },
    {
      icon: TrendingUp,
      title: "Stock Market & Investments",
      description: "Shares, mutual funds, and financial market investments",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: Banknote,
      title: "Inheritance & Gifts",
      description: "Family wealth, inheritance, and unexpected financial gains",
      color: "from-pink-500 to-rose-500"
    },
    {
      icon: Gem,
      title: "Luxury & Precious Items",
      description: "Gold, jewelry, gems, and valuable collectibles",
      color: "from-yellow-500 to-amber-500"
    }
  ];

  const reportFeatures = [
    "Financial prosperity timing analysis",
    "Multiple income source identification",
    "Property and real estate opportunities",
    "Business success and investment guidance",
    "Debt management and financial stability",
    "Wealth accumulation periods and methods",
    "Lucky numbers and dates for financial decisions",
    "Gemstones and remedies for wealth enhancement",
    "Family wealth and inheritance predictions",
    "Money-related challenges and solutions"
  ];

  const wealthStories = [
    {
      name: "Suresh Modi",
      profession: "Business Owner",
      story: "Started my textile business during the favorable period mentioned in the report. Revenue grew by 300% in the predicted timeframe!",
      achievement: "₹50 Lakhs turnover",
      year: "2023"
    },
    {
      name: "Kavita Jain",
      profession: "Software Professional",
      story: "Invested in real estate during the property yoga period. The property value doubled within 18 months as predicted.",
      achievement: "Property investment success",
      year: "2024"
    },
    {
      name: "Rajesh Gupta",
      profession: "Trader",
      story: "The stock market timing was incredibly accurate. Made significant gains following the investment periods mentioned.",
      achievement: "40% portfolio growth",
      year: "2023"
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Wealth report form submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <Helmet>
        <title>Wealth Report - Financial Prosperity Predictions | AstroTick</title>
        <meta name="description" content="Get detailed wealth analysis with financial prosperity predictions, investment timing, and money-making opportunities." />
        <meta name="keywords" content="wealth astrology, financial predictions, money horoscope, investment timing, prosperity analysis" />
      </Helmet>
      
      <AstroTickHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center items-center gap-3 mb-4">
              <DollarSign className="h-8 w-8 text-green-600" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                Wealth Report
              </h1>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Financial prosperity predictions with wealth accumulation timing and investment guidance
            </p>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="wealth-sources">Wealth Sources</TabsTrigger>
              <TabsTrigger value="analysis">Get Analysis</TabsTrigger>
              <TabsTrigger value="success-stories">Success Stories</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              {/* What is Wealth Astrology */}
              <Card className="bg-gradient-to-r from-green-50 to-teal-50 border-green-200">
                <CardHeader>
                  <CardTitle className="text-2xl text-green-800">What is Wealth Astrology?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-gray-700">
                    <p>
                      Wealth astrology analyzes your birth chart to identify financial opportunities, wealth accumulation periods, and money-making potential. Our comprehensive analysis reveals the best times and methods for building prosperity and achieving financial success.
                    </p>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-green-800 mb-3">Wealth Analysis Includes</h3>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start gap-2">
                            <DollarSign className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>2nd house analysis for wealth accumulation</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <DollarSign className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>11th house for income and gains</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <DollarSign className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>Jupiter and Venus positions for prosperity</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <DollarSign className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>Dhan Yoga combinations for wealth</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-semibold text-green-800 mb-3">Key Predictions</h3>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start gap-2">
                            <TrendingUp className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>Multiple income sources and opportunities</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <TrendingUp className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>Investment timing and profitable ventures</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <TrendingUp className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>Property and real estate opportunities</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <TrendingUp className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>Financial stability and debt management</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Report Features */}
              <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
                <CardHeader>
                  <CardTitle className="text-2xl text-emerald-800">What You'll Get in Your Report</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {reportFeatures.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Wealth Timing Analysis */}
              <Card className="bg-gradient-to-r from-teal-50 to-cyan-50 border-teal-200">
                <CardHeader>
                  <CardTitle className="text-2xl text-teal-800">Wealth Timing Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <TrendingUp className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="font-semibold text-green-800 mb-2">Growth Periods</h3>
                      <p className="text-sm text-gray-600">Identify the best times for investments, business ventures, and financial growth</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Coins className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="font-semibold text-yellow-800 mb-2">Money Flow</h3>
                      <p className="text-sm text-gray-600">Understand when money will flow in and the best methods for accumulation</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Building className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="font-semibold text-blue-800 mb-2">Investment Timing</h3>
                      <p className="text-sm text-gray-600">Perfect timing for property, business, and financial investments</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="wealth-sources" className="space-y-8">
              <Card className="bg-gradient-to-r from-green-50 to-teal-50 border-green-200">
                <CardHeader>
                  <CardTitle className="text-2xl text-green-800">Wealth Sources Based on Planetary Positions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wealthSources.map((source, index) => (
                      <Card key={index} className="hover:shadow-lg transition-shadow group">
                        <CardContent className="p-6">
                          <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${source.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                            <source.icon className="h-6 w-6 text-white" />
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-2">{source.title}</h3>
                          <p className="text-sm text-gray-600">{source.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Dhan Yogas */}
              <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
                <CardHeader>
                  <CardTitle className="text-2xl text-emerald-800">Dhan Yogas for Wealth</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="p-4 bg-white rounded-lg shadow-sm">
                        <h3 className="font-semibold text-emerald-800 mb-2">Gaja Kesari Yoga</h3>
                        <p className="text-sm text-gray-600">Jupiter-Moon combination for wisdom and wealth</p>
                      </div>
                      <div className="p-4 bg-white rounded-lg shadow-sm">
                        <h3 className="font-semibold text-emerald-800 mb-2">Lakshmi Yoga</h3>
                        <p className="text-sm text-gray-600">Venus in favorable position for luxury and prosperity</p>
                      </div>
                      <div className="p-4 bg-white rounded-lg shadow-sm">
                        <h3 className="font-semibold text-emerald-800 mb-2">Kubera Yoga</h3>
                        <p className="text-sm text-gray-600">Specific planetary combinations for extreme wealth</p>
                      </div>
                      <div className="p-4 bg-white rounded-lg shadow-sm">
                        <h3 className="font-semibold text-emerald-800 mb-2">Raj Yoga</h3>
                        <p className="text-sm text-gray-600">Royal combinations for status and wealth</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="p-4 bg-white rounded-lg shadow-sm">
                        <h3 className="font-semibold text-emerald-800 mb-2">Chandra Mangal Yoga</h3>
                        <p className="text-sm text-gray-600">Moon-Mars combination for property and assets</p>
                      </div>
                      <div className="p-4 bg-white rounded-lg shadow-sm">
                        <h3 className="font-semibold text-emerald-800 mb-2">Viparita Raja Yoga</h3>
                        <p className="text-sm text-gray-600">Wealth through challenges and transformations</p>
                      </div>
                      <div className="p-4 bg-white rounded-lg shadow-sm">
                        <h3 className="font-semibold text-emerald-800 mb-2">Amala Yoga</h3>
                        <p className="text-sm text-gray-600">Pure prosperity through ethical means</p>
                      </div>
                      <div className="p-4 bg-white rounded-lg shadow-sm">
                        <h3 className="font-semibold text-emerald-800 mb-2">Dharma Karmadhipati Yoga</h3>
                        <p className="text-sm text-gray-600">Wealth through dharmic and righteous actions</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Houses for Wealth */}
              <Card className="bg-gradient-to-r from-teal-50 to-cyan-50 border-teal-200">
                <CardHeader>
                  <CardTitle className="text-2xl text-teal-800">Houses and Wealth Indicators</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-white rounded-lg">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-white font-bold">2</span>
                      </div>
                      <h3 className="font-semibold text-teal-800 mb-2">2nd House</h3>
                      <p className="text-sm text-gray-600">Wealth accumulation, family assets, and financial resources</p>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-white font-bold">11</span>
                      </div>
                      <h3 className="font-semibold text-blue-800 mb-2">11th House</h3>
                      <p className="text-sm text-gray-600">Income, gains, profits, and financial success</p>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg">
                      <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-white font-bold">5</span>
                      </div>
                      <h3 className="font-semibold text-yellow-800 mb-2">5th House</h3>
                      <p className="text-sm text-gray-600">Investments, speculation, and creative wealth</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analysis" className="space-y-8">
              <div className="grid lg:grid-cols-2 gap-8">
                <Card className="bg-white/90 backdrop-blur-sm border-green-200 shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-6 w-6" />
                      Get Your Wealth Analysis
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
                        <Label htmlFor="currentIncome">Current Income Range (Optional)</Label>
                        <Select value={formData.currentIncome} onValueChange={(value) => setFormData({...formData, currentIncome: value})}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select income range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="below-3-lakh">Below ₹3 Lakh</SelectItem>
                            <SelectItem value="3-10-lakh">₹3-10 Lakh</SelectItem>
                            <SelectItem value="10-25-lakh">₹10-25 Lakh</SelectItem>
                            <SelectItem value="25-50-lakh">₹25-50 Lakh</SelectItem>
                            <SelectItem value="above-50-lakh">Above ₹50 Lakh</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="financialGoals">Financial Goals (Optional)</Label>
                        <Input
                          id="financialGoals"
                          type="text"
                          placeholder="Your financial aspirations"
                          value={formData.financialGoals}
                          onChange={(e) => setFormData({...formData, financialGoals: e.target.value})}
                          className="mt-1"
                        />
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
                      >
                        Get Wealth Analysis - ₹999
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                <div className="space-y-6">
                  <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
                    <CardHeader>
                      <CardTitle className="text-blue-800">What You'll Receive</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3 text-sm">
                        <li className="flex items-start gap-2">
                          <TrendingUp className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span>Detailed 25+ page wealth analysis report</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Coins className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span>Multiple income sources identification</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Building className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span>Investment timing and opportunities</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Home className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span>Property and real estate guidance</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Gem className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span>Wealth-enhancing remedies and gemstones</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
                    <CardHeader>
                      <CardTitle className="text-yellow-800">Wealth Report Features</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Calculator className="h-4 w-4 text-yellow-600" />
                          <span>Detailed financial calculations</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <PiggyBank className="h-4 w-4 text-yellow-600" />
                          <span>Savings and investment strategies</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-yellow-600" />
                          <span>Debt management guidance</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Banknote className="h-4 w-4 text-yellow-600" />
                          <span>Lucky numbers and dates for money</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="success-stories" className="space-y-8">
              <Card className="bg-gradient-to-r from-green-50 to-teal-50 border-green-200">
                <CardHeader>
                  <CardTitle className="text-2xl text-green-800">Wealth Success Stories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    {wealthStories.map((story, index) => (
                      <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                        <div className="flex items-center gap-1 mb-3">
                          {[...Array(5)].map((_, i) => (
                            <DollarSign key={i} className="h-4 w-4 text-green-500" />
                          ))}
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">{story.name}</h3>
                        <Badge variant="secondary" className="mb-3">{story.profession}</Badge>
                        <p className="text-sm text-gray-700 mb-3 italic">"{story.story}"</p>
                        <div className="text-xs text-green-600 font-medium">{story.achievement}</div>
                        <div className="text-xs text-gray-500">Success in {story.year}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
                <CardHeader>
                  <CardTitle className="text-2xl text-emerald-800">Why Wealth Astrology Works</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="font-semibold text-emerald-800 mb-4">Cosmic Timing</h3>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li>• Planetary periods influence financial success</li>
                        <li>• Jupiter transits bring expansion and growth</li>
                        <li>• Venus periods enhance luxury and comfort</li>
                        <li>• Mercury supports business and trade</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-emerald-800 mb-4">Practical Application</h3>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li>• Optimal timing for investments and ventures</li>
                        <li>• Understanding of natural wealth-building abilities</li>
                        <li>• Recognition of opportunities and obstacles</li>
                        <li>• Alignment with cosmic energies for success</li>
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

export default WealthReport;