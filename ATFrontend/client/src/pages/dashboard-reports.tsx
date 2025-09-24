import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "src/components/ui/card";
import { Button } from "src/components/ui/button";
import { Badge } from "src/components/ui/badge";
import { Link } from "wouter";
import {
  FileText,
  Heart,
  Briefcase,
  Baby,
  DollarSign,
  Star,
  Crown,
  TrendingUp,
  Calendar,
  ArrowRight,
  Gift
} from "lucide-react";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";
import { useAuth } from "src/hooks/useAuth";

interface ReportOption {
  id: string;
  title: string;
  description: string;
  icon: any;
  price: string;
  route: string;
  category: 'Premium' | 'Basic' | 'Advanced';
  features: string[];
  popular?: boolean;
}

const reportOptions: ReportOption[] = [
  {
    id: 'premium',
    title: 'Premium Life Report',
    description: 'Comprehensive analysis of your life path, career, relationships, and spiritual journey',
    icon: Crown,
    price: '₹999',
    route: '/premium-report',
    category: 'Premium',
    features: ['Complete Birth Chart', 'Planetary Analysis', 'Dasha Predictions', 'Remedies'],
    popular: true
  },
  {
    id: 'career',
    title: 'Career & Business Report',
    description: 'Detailed insights into your professional life, business prospects, and career growth',
    icon: Briefcase,
    price: '₹499',
    route: '/reports/career',
    category: 'Premium',
    features: ['Career Timeline', 'Business Potential', 'Success Periods', 'Professional Remedies']
  },
  {
    id: 'marriage',
    title: 'Marriage & Relationship Report',
    description: 'Complete marriage compatibility, timing predictions, and relationship guidance',
    icon: Heart,
    price: '₹699',
    route: '/reports/marriage',
    category: 'Premium',
    features: ['Marriage Timing', 'Partner Analysis', 'Compatibility Score', 'Relationship Remedies']
  },
  {
    id: 'child',
    title: 'Child & Pregnancy Report',
    description: 'Predictions about children, pregnancy timing, and parenting guidance',
    icon: Baby,
    price: '₹399',
    route: '/reports/child',
    category: 'Basic',
    features: ['Pregnancy Timing', 'Child Characteristics', 'Parenting Tips', 'Health Guidance']
  },
  {
    id: 'wealth',
    title: 'Wealth & Finance Report',
    description: 'Financial prospects, wealth accumulation periods, and investment guidance',
    icon: DollarSign,
    price: '₹599',
    route: '/reports/wealth',
    category: 'Premium',
    features: ['Wealth Periods', 'Investment Timing', 'Financial Remedies', 'Property Analysis']
  },
  {
    id: 'super-horoscope',
    title: 'Super Horoscope',
    description: 'Advanced predictive horoscope with detailed planetary transits and their effects',
    icon: Star,
    price: '₹1299',
    route: '/reports/super-horoscope',
    category: 'Advanced',
    features: ['Transit Analysis', 'Yearly Predictions', 'Monthly Forecasts', 'Personalized Remedies']
  }
];

export default function DashboardReports() {
  const { user } = useAuth();

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Premium':
        return 'bg-orange-100 text-orange-800';
      case 'Advanced':
        return 'bg-purple-100 text-purple-800';
      case 'Basic':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <AstroTickHeader />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-700 to-amber-700 bg-clip-text text-transparent">
                Astrological Reports
              </h1>
              <p className="text-gray-600 mt-2">
                Get detailed insights into your life with our comprehensive astrological reports
              </p>
            </div>
            <Link href="/dashboard">
              <Button variant="outline" className="flex items-center gap-2">
                ← Back to Dashboard
              </Button>
            </Link>
          </div>
          
          {user && (
            <div className="bg-white/80 backdrop-blur-md rounded-lg p-4 border border-orange-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">
                    {user.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Welcome, {user.email}</p>
                  <p className="text-sm text-gray-600">Choose a report to get personalized insights</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Reports Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportOptions.map((report) => (
            <Card 
              key={report.id} 
              className={`relative hover:shadow-lg transition-all duration-300 bg-white/90 backdrop-blur-md ${
                report.popular ? 'ring-2 ring-orange-300 shadow-lg' : ''
              }`}
            >
              {report.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-3 py-1">
                    <Gift className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-100 to-amber-100 rounded-lg flex items-center justify-center">
                      <report.icon className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-gray-900 leading-tight">
                        {report.title}
                      </CardTitle>
                      <Badge className={getCategoryColor(report.category)} variant="secondary">
                        {report.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-orange-600">{report.price}</p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <CardDescription className="text-gray-700 leading-relaxed">
                  {report.description}
                </CardDescription>
                
                <div className="space-y-2">
                  <p className="font-medium text-gray-900 text-sm">Key Features:</p>
                  <ul className="space-y-1">
                    {report.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Link href={report.route}>
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-md">
                    Get Report
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Free Options */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Star className="w-6 h-6 text-orange-500" />
            Free Astrology Tools
          </h2>
          
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
            <Link href="/kundli">
              <Card className="hover:shadow-md transition-shadow cursor-pointer bg-white/80 backdrop-blur-md">
                <CardContent className="p-4 text-center">
                  <FileText className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <h3 className="font-medium text-gray-900">Free Kundli</h3>
                  <p className="text-sm text-gray-600">Birth Chart Analysis</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/daily-horoscope">
              <Card className="hover:shadow-md transition-shadow cursor-pointer bg-white/80 backdrop-blur-md">
                <CardContent className="p-4 text-center">
                  <Calendar className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <h3 className="font-medium text-gray-900">Daily Horoscope</h3>
                  <p className="text-sm text-gray-600">Today's Predictions</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/kundli-matching">
              <Card className="hover:shadow-md transition-shadow cursor-pointer bg-white/80 backdrop-blur-md">
                <CardContent className="p-4 text-center">
                  <Heart className="w-8 h-8 text-pink-500 mx-auto mb-2" />
                  <h3 className="font-medium text-gray-900">Match Making</h3>
                  <p className="text-sm text-gray-600">Compatibility Check</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/panchang">
              <Card className="hover:shadow-md transition-shadow cursor-pointer bg-white/80 backdrop-blur-md">
                <CardContent className="p-4 text-center">
                  <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <h3 className="font-medium text-gray-900">Panchang</h3>
                  <p className="text-sm text-gray-600">Auspicious Timings</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}