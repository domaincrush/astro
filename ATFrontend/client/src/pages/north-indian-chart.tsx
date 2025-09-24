import { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, Star, Sun, Moon, TrendingUp, Shield, Crown, Zap, Loader2 } from "lucide-react";
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import { Label } from "src/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";
import LocationSearch from "src/components/LocationSearch";
import { useQuery } from "@tanstack/react-query";
import { VedicBirthChart } from "src/lib/vedic-astrology";

export default function NorthIndianChart() {
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
    console.log('Form submitted with data:', formData);
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
      console.log('API Response:', data);
      console.log('Data success:', data.success);
      console.log('Data planets:', data.planets);
      
      if (data.success) {
        console.log('Setting chart data and showing results');
        console.log('Chart data to set:', data);
        setChartData(data);
        setShowResults(true);
        console.log('State after setting - showResults:', true, 'chartData set');
      } else {
        console.log('API failed:', data.error);
        alert('Failed to generate chart: ' + data.error);
      }
    } catch (error) {
      console.error('Error generating chart:', error);
      alert('Failed to generate chart. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
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
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <Calculator className="h-8 w-8 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
              North Indian Chart
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Generate your traditional North Indian style birth chart with diamond-shaped house layout and precise planetary positions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Chart Generator Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-50 to-purple-50">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold text-gray-800">
                  Generate North Indian Chart
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  Enter your birth details to create your personalized North Indian birth chart
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-3 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating Chart...
                        </>
                      ) : (
                        "Generate North Indian Chart"
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              North Indian Chart Features
            </h2>
            <p className="text-xl text-gray-600">
              Comprehensive analysis with traditional diamond-shaped layout
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Calculator,
                title: "Diamond Layout",
                description: "Traditional North Indian diamond-shaped chart format"
              },
              {
                icon: Star,
                title: "Planetary Positions",
                description: "Accurate planetary positions in all 12 houses"
              },
              {
                icon: Sun,
                title: "Ascendant Details",
                description: "Rising sign and lagna lord analysis"
              },
              {
                icon: Moon,
                title: "Nakshatra Info",
                description: "Birth star and lunar mansion details"
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
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
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

      {/* Results Section */}
      {console.log('Render state - showResults:', showResults, 'chartData:', chartData)}
      {showResults && chartData && (
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Your North Indian Chart
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                {formData.name}'s Vedic Birth Chart
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Chart Display */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-center">North Indian Chart</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-square bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Calculator className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                      <p className="text-lg font-semibold text-gray-700">Diamond Layout Chart</p>
                      <p className="text-sm text-gray-600 mt-2">
                        Lagna: {chartData.planets?.find(p => p.name === 'Ascendant')?.sign || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-600">
                        Rashi: {chartData.planets?.find(p => p.name === 'Moon')?.sign || 'N/A'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Basic Information */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Birth Date</p>
                      <p className="font-semibold">{formData.birthDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Birth Time</p>
                      <p className="font-semibold">{formData.birthTime}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Birth Place</p>
                      <p className="font-semibold">{formData.birthPlace}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Gender</p>
                      <p className="font-semibold capitalize">{formData.gender}</p>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Lagna (Ascendant)</p>
                        <p className="font-semibold text-blue-600">{chartData.planets?.find(p => p.name === 'Ascendant')?.sign || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Rashi (Moon Sign)</p>
                        <p className="font-semibold text-purple-600">{chartData.planets?.find(p => p.name === 'Moon')?.sign || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Nakshatra</p>
                        <p className="font-semibold text-green-600">{chartData.planets?.find(p => p.name === 'Moon')?.nakshatra || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Calculation Engine</p>
                        <p className="font-semibold text-orange-600">{chartData.calculationEngine || 'Jyotisha'}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Planetary Positions Table */}
            {chartData.planets && (
              <Card className="mt-8 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-center">Planetary Positions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gradient-to-r from-blue-100 to-purple-100">
                          <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Planet</th>
                          <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Sign</th>
                          <th className="border border-gray-300 px-4 py-2 text-left font-semibold">House</th>
                          <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Degree</th>
                          <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Nakshatra</th>
                        </tr>
                      </thead>
                      <tbody>
                        {chartData.planets.map((planet: any, index: number) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2 font-medium text-blue-800">
                              {planet.name}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">{planet.sign}</td>
                            <td className="border border-gray-300 px-4 py-2">{planet.house}</td>
                            <td className="border border-gray-300 px-4 py-2">{planet.degree ? (typeof planet.degree === 'number' ? planet.degree.toFixed(2) : planet.degree) : 'N/A'}°</td>
                            <td className="border border-gray-300 px-4 py-2">{planet.nakshatra}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* North Indian Chart Diagram */}
            <Card className="mt-8 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">North Indian Chart Diagram</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <div className="relative w-96 h-96">
                    {/* Diamond shaped chart */}
                    <div className="absolute inset-0">
                      <svg viewBox="0 0 400 400" className="w-full h-full">
                        {/* Diamond outline */}
                        <polygon
                          points="200,50 350,200 200,350 50,200"
                          fill="none"
                          stroke="#374151"
                          strokeWidth="2"
                        />
                        {/* Inner lines */}
                        <line x1="200" y1="50" x2="200" y2="350" stroke="#374151" strokeWidth="1" />
                        <line x1="50" y1="200" x2="350" y2="200" stroke="#374151" strokeWidth="1" />
                        <line x1="125" y1="125" x2="275" y2="275" stroke="#374151" strokeWidth="1" />
                        <line x1="275" y1="125" x2="125" y2="275" stroke="#374151" strokeWidth="1" />
                        
                        {/* House labels */}
                        <text x="200" y="30" textAnchor="middle" className="text-xs font-semibold">1</text>
                        <text x="290" y="110" textAnchor="middle" className="text-xs font-semibold">2</text>
                        <text x="330" y="160" textAnchor="middle" className="text-xs font-semibold">3</text>
                        <text x="330" y="240" textAnchor="middle" className="text-xs font-semibold">4</text>
                        <text x="290" y="290" textAnchor="middle" className="text-xs font-semibold">5</text>
                        <text x="200" y="370" textAnchor="middle" className="text-xs font-semibold">6</text>
                        <text x="110" y="290" textAnchor="middle" className="text-xs font-semibold">7</text>
                        <text x="70" y="240" textAnchor="middle" className="text-xs font-semibold">8</text>
                        <text x="70" y="160" textAnchor="middle" className="text-xs font-semibold">9</text>
                        <text x="110" y="110" textAnchor="middle" className="text-xs font-semibold">10</text>
                        <text x="160" y="85" textAnchor="middle" className="text-xs font-semibold">11</text>
                        <text x="240" y="85" textAnchor="middle" className="text-xs font-semibold">12</text>
                        
                        {/* Planets in houses */}
                        {chartData.planets?.map((planet: any, index: number) => {
                          const house = parseInt(planet.house);
                          const positions = [
                            { x: 200, y: 60 }, // House 1
                            { x: 280, y: 120 }, // House 2
                            { x: 320, y: 170 }, // House 3
                            { x: 320, y: 230 }, // House 4
                            { x: 280, y: 280 }, // House 5
                            { x: 200, y: 340 }, // House 6
                            { x: 120, y: 280 }, // House 7
                            { x: 80, y: 230 }, // House 8
                            { x: 80, y: 170 }, // House 9
                            { x: 120, y: 120 }, // House 10
                            { x: 170, y: 95 }, // House 11
                            { x: 230, y: 95 } // House 12
                          ];
                          
                          const pos = positions[house - 1];
                          if (!pos) return null;
                          
                          return (
                            <text
                              key={index}
                              x={pos.x}
                              y={pos.y + (index % 3) * 15}
                              textAnchor="middle"
                              className="text-xs font-bold fill-blue-600"
                            >
                              {planet.name.substring(0, 2)}
                            </text>
                          );
                        })}
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-center text-sm text-gray-600">
                  <p>Traditional North Indian Diamond Chart Layout</p>
                  <p className="mt-2">Planets are shown as abbreviations in their respective houses</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}