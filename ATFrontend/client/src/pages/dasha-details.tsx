import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Calendar, TrendingUp, Star, Crown, Shield, Target, Zap, Loader2 } from "lucide-react";
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import { Label } from "src/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";
import LocationSearch from "src/components/LocationSearch";
import { VedicBirthChart } from "src/lib/vedic-astrology";

export default function DashaDetails() {
  const [formData, setFormData] = useState({
    name: "",
    birthDate: "",
    birthTime: "",
    birthPlace: "",
    gender: "male",
    latitude: 0,
    longitude: 0
  });
  
  const [showResults, setShowResults] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [chartData, setChartData] = useState<VedicBirthChart | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLocationChange = (location: string, latitude?: number, longitude?: number) => {
    setFormData({
      ...formData,
      birthPlace: location,
      latitude: latitude || 0,
      longitude: longitude || 0
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/generate-kundli', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          date: formData.birthDate,
          time: formData.birthTime,
          location: formData.birthPlace,
          gender: formData.gender,
          latitude: formData.latitude,
          longitude: formData.longitude
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setChartData(data);
        setShowResults(true);
      } else {
        alert('Failed to generate dasha details: ' + data.error);
      }
    } catch (error) {
      console.error('Error generating dasha details:', error);
      alert('Failed to generate dasha details. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
      <AstroTickHeader />
      
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-full flex items-center justify-center">
                <Clock className="h-8 w-8 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
              Dasha Details
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Get comprehensive Vimshottari Dasha analysis with planetary periods, timings, and their effects on your life.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Analysis Generator Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="shadow-xl border-0 bg-gradient-to-br from-yellow-50 to-orange-50">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold text-gray-800">
                  Dasha Period Analysis
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  Enter your birth details to get detailed Dasha period calculations and predictions
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-2 block">
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="gender" className="text-sm font-medium text-gray-700 mb-2 block">
                        Gender
                      </Label>
                      <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        required
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="birthDate" className="text-sm font-medium text-gray-700 mb-2 block">
                        Birth Date
                      </Label>
                      <Input
                        id="birthDate"
                        name="birthDate"
                        type="date"
                        value={formData.birthDate}
                        onChange={handleInputChange}
                        className="w-full"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="birthTime" className="text-sm font-medium text-gray-700 mb-2 block">
                        Birth Time
                      </Label>
                      <Input
                        id="birthTime"
                        name="birthTime"
                        type="time"
                        value={formData.birthTime}
                        onChange={handleInputChange}
                        className="w-full"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="birthPlace" className="text-sm font-medium text-gray-700 mb-2 block">
                      Birth Place
                    </Label>
                    <LocationSearch
                      value={formData.birthPlace}
                      onChange={handleLocationChange}
                      placeholder="Enter your birth place"
                      className="w-full"
                    />
                  </div>

                  <div className="text-center pt-4">
                    <Button
                      type="submit"
                      disabled={isGenerating}
                      className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 px-8 py-3 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        "Calculate Dasha Periods"
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Results Section */}
      {showResults && chartData && (
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-orange-800 mb-4">
                  Dasha Period Analysis
                </h2>
                <p className="text-xl text-gray-600">
                  Detailed Vimshottari Dasha periods and planetary influences
                </p>
              </div>

              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
                  <CardContent className="p-6 text-center">
                    <h3 className="text-lg font-semibold text-orange-800 mb-2">Name</h3>
                    <p className="text-gray-700">{chartData.basicInfo?.name || formData.name}</p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
                  <CardContent className="p-6 text-center">
                    <h3 className="text-lg font-semibold text-orange-800 mb-2">Current Dasha</h3>
                    <p className="text-gray-700">{chartData.dasha?.currentMahaDasha || 'Calculating...'}</p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
                  <CardContent className="p-6 text-center">
                    <h3 className="text-lg font-semibold text-orange-800 mb-2">Current Antardasha</h3>
                    <p className="text-gray-700">{chartData.dasha?.currentAntarDasha || 'Calculating...'}</p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
                  <CardContent className="p-6 text-center">
                    <h3 className="text-lg font-semibold text-orange-800 mb-2">Birth Nakshatra</h3>
                    <p className="text-gray-700">{chartData.basicInfo?.nakshatra || chartData.planets?.moon?.nakshatra}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Dasha Timeline */}
              {chartData.dasha && (
                <Card className="mb-8 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-orange-800 text-center">
                      Vimshottari Dasha Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {chartData.dasha.periods?.map((period: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                          <div className="flex items-center space-x-4">
                            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                            <div>
                              <h4 className="font-semibold text-orange-800">{period.planet} Dasha</h4>
                              <p className="text-sm text-gray-600">{period.startDate} - {period.endDate}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-700">{period.years} years</p>
                            <p className="text-xs text-gray-500">{period.status}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Calculation Engine Info */}
              <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
                <CardContent className="p-6 text-center">
                  <h3 className="text-lg font-semibold text-orange-800 mb-2">Calculation Engine</h3>
                  <p className="text-gray-700">
                    {chartData.calculationEngine || 'Authentic Jyotisha Engine'} - 
                    Swiss Ephemeris astronomical calculations
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Dasha Analysis Features
            </h2>
            <p className="text-xl text-gray-600">
              Comprehensive Vimshottari Dasha system with detailed predictions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Clock,
                title: "Current Dasha",
                description: "Your current major and minor planetary periods"
              },
              {
                icon: Calendar,
                title: "Future Periods",
                description: "Upcoming dasha periods and their start dates"
              },
              {
                icon: TrendingUp,
                title: "Life Phases",
                description: "Major life events and timing predictions"
              },
              {
                icon: Star,
                title: "Planetary Effects",
                description: "How each planet influences your life phases"
              },
              {
                icon: Crown,
                title: "Mahadasha",
                description: "Major planetary periods lasting 6-20 years"
              },
              {
                icon: Shield,
                title: "Antardasha",
                description: "Sub-periods within major dasha cycles"
              },
              {
                icon: Target,
                title: "Opportunities",
                description: "Best times for career, marriage, and investments"
              },
              {
                icon: Zap,
                title: "Remedies",
                description: "Period-specific remedies and recommendations"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <Card className="h-full text-center hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="pt-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}