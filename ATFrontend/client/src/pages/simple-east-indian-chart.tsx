import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from 'src/components/ui/card';
import { Button } from 'src/components/ui/button';
import { Input } from 'src/components/ui/input';
import { Label } from 'src/components/ui/label';
import { LocationSearch } from 'src/components/LocationSearch';
import AstroTickHeader from 'src/components/AstroTickHeader';
import { toast } from 'src/hooks/use-toast';

interface EastIndianChartData {
  houses: Array<{
    house: number;
    sign: string;
    planets: Array<{
      name: string;
      symbol: string;
      longitude: number;
    }>;
  }>;
  ascendant: {
    sign: string;
    longitude: number;
  };
}

export default function SimpleEastIndianChart() {
  const [formData, setFormData] = useState({
    name: 'Mohan Kumar',
    date: '1980-09-09',
    time: '19:15',
    place: 'Chennai, Tamil Nadu, India',
    latitude: 13.0827,
    longitude: 80.2707
  });

  const generateChart = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch('/api/birth-chart/detailed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Chart Generated Successfully",
        description: "East Indian chart has been created with authentic calculations.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to generate chart. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateChart.mutate(formData);
  };

  const renderEastIndianChart = (chartData: EastIndianChartData) => {
    // East Indian house positions (clockwise from top-middle)
    const housePositions = [
      { house: 1, row: 0, col: 1, label: 'ASC' }, // Top-middle (Ascendant)
      { house: 2, row: 0, col: 2 }, // Top-right
      { house: 3, row: 1, col: 2 }, // Right-middle  
      { house: 4, row: 2, col: 2 }, // Bottom-right
      { house: 5, row: 2, col: 1 }, // Bottom-middle
      { house: 6, row: 2, col: 0 }, // Bottom-left
      { house: 7, row: 1, col: 0 }, // Left-middle
      { house: 8, row: 0, col: 0 }, // Top-left
    ];

    // Function to get planets for each house
    const getPlanetsForHouse = (houseNumber: number) => {
      const houseData = chartData.houses.find(h => h.house === houseNumber);
      return houseData?.planets || [];
    };

    const planetSymbols: { [key: string]: string } = {
      'Sun': '☉',
      'Moon': '☽', 
      'Mars': '♂',
      'Mercury': '☿',
      'Jupiter': '♃',
      'Venus': '♀',
      'Saturn': '♄',
      'Rahu': '☊',
      'Ketu': '☋'
    };

    return (
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">East Indian Chart</h3>
          <p className="text-sm text-gray-600">3×3 Grid Layout - Bengali/Oriya/Assamese Style</p>
        </div>
        
        <div className="flex justify-center">
          <div className="grid grid-cols-3 gap-0 border-2 border-orange-500" style={{ width: '300px', height: '300px' }}>
            {/* Top row */}
            <div className="border border-orange-500 bg-white p-2 relative h-24">
              <span className="text-xs font-bold text-orange-600 absolute top-1 left-1">8</span>
              <div className="mt-3 text-xs">
                {getPlanetsForHouse(8).map((planet, i) => (
                  <div key={i}>{planetSymbols[planet.name] || planet.name.substring(0,3)}</div>
                ))}
              </div>
            </div>
            
            <div className="border border-orange-500 bg-orange-50 p-2 relative h-24">
              <span className="text-xs font-bold text-orange-600 absolute top-1 left-1">1</span>
              <div className="text-center mt-1">
                <span className="text-sm font-bold text-orange-700">ASC</span>
              </div>
              <div className="mt-1 text-xs">
                {getPlanetsForHouse(1).map((planet, i) => (
                  <div key={i}>{planetSymbols[planet.name] || planet.name.substring(0,3)}</div>
                ))}
              </div>
            </div>
            
            <div className="border border-orange-500 bg-white p-2 relative h-24">
              <span className="text-xs font-bold text-orange-600 absolute top-1 left-1">2</span>
              <div className="mt-3 text-xs">
                {getPlanetsForHouse(2).map((planet, i) => (
                  <div key={i}>{planetSymbols[planet.name] || planet.name.substring(0,3)}</div>
                ))}
              </div>
            </div>

            {/* Middle row */}
            <div className="border border-orange-500 bg-white p-2 relative h-24">
              <span className="text-xs font-bold text-orange-600 absolute top-1 left-1">7</span>
              <div className="mt-3 text-xs">
                {getPlanetsForHouse(7).map((planet, i) => (
                  <div key={i}>{planetSymbols[planet.name] || planet.name.substring(0,3)}</div>
                ))}
              </div>
            </div>
            
            <div className="border border-orange-500 bg-gray-100 p-2 flex items-center justify-center h-24">
              <div className="text-center">
                <div className="text-sm font-bold text-gray-700">East</div>
                <div className="text-xs text-gray-600">Indian</div>
              </div>
            </div>
            
            <div className="border border-orange-500 bg-white p-2 relative h-24">
              <span className="text-xs font-bold text-orange-600 absolute top-1 left-1">3</span>
              <div className="mt-3 text-xs">
                {getPlanetsForHouse(3).map((planet, i) => (
                  <div key={i}>{planetSymbols[planet.name] || planet.name.substring(0,3)}</div>
                ))}
              </div>
            </div>

            {/* Bottom row */}
            <div className="border border-orange-500 bg-white p-2 relative h-24">
              <span className="text-xs font-bold text-orange-600 absolute top-1 left-1">6</span>
              <div className="mt-3 text-xs">
                {getPlanetsForHouse(6).map((planet, i) => (
                  <div key={i}>{planetSymbols[planet.name] || planet.name.substring(0,3)}</div>
                ))}
              </div>
            </div>
            
            <div className="border border-orange-500 bg-white p-2 relative h-24">
              <span className="text-xs font-bold text-orange-600 absolute top-1 left-1">5</span>
              <div className="mt-3 text-xs">
                {getPlanetsForHouse(5).map((planet, i) => (
                  <div key={i}>{planetSymbols[planet.name] || planet.name.substring(0,3)}</div>
                ))}
              </div>
            </div>
            
            <div className="border border-orange-500 bg-white p-2 relative h-24">
              <span className="text-xs font-bold text-orange-600 absolute top-1 left-1">4</span>
              <div className="mt-3 text-xs">
                {getPlanetsForHouse(4).map((planet, i) => (
                  <div key={i}>{planetSymbols[planet.name] || planet.name.substring(0,3)}</div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Chart Information */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h4 className="font-semibold mb-2 text-gray-700">Houses (Bhavas):</h4>
            <div className="text-xs space-y-1 text-gray-600">
              <p>H1: Self, Personality (ASC)</p>
              <p>H2: Wealth, Family</p>
              <p>H3: Siblings, Courage</p>
              <p>H4: Home, Mother</p>
              <p>H5: Children, Education</p>
              <p>H6: Health, Enemies</p>
              <p>H7: Partnership, Marriage</p>
              <p>H8: Transformation, Longevity</p>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2 text-gray-700">Planet Symbols:</h4>
            <div className="text-xs space-y-1 text-gray-600">
              <p>☉ Sun  ☽ Moon  ♂ Mars</p>
              <p>☿ Mercury  ♃ Jupiter  ♀ Venus</p>
              <p>♄ Saturn  ☊ Rahu  ☋ Ketu</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <AstroTickHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Simple East Indian Chart Generator</CardTitle>
              <p className="text-sm text-gray-600">
                Generate East Indian style Vedic astrology chart with authentic calculations
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="date">Date of Birth</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="time">Time of Birth</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="place">Place of Birth</Label>
                    <LocationSearch
                      onLocationSelect={(location) => {
                        setFormData({
                          ...formData,
                          place: location.display,
                          latitude: location.latitude,
                          longitude: location.longitude
                        });
                      }}
                      placeholder="Enter birth city"
                    />
                  </div>
                </div>
                
                <Button type="submit" disabled={generateChart.isPending} className="w-full">
                  {generateChart.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating Chart...
                    </>
                  ) : (
                    'Generate East Indian Chart'
                  )}
                </Button>
              </form>
              
              {generateChart.data && (
                <div className="mt-8">
                  {renderEastIndianChart(generateChart.data)}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}