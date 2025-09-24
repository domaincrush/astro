import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from 'src/components/ui/button';
import { Input } from 'src/components/ui/input';
import { Label } from 'src/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from 'src/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useToast } from 'src/hooks/use-toast';
import AstroTickHeader from 'src/components/layout/AstroTickHeader';

// Helper function to convert birth chart data to East Indian format
const convertToEastIndianFormat = (planets: any[], ascendant: any) => {
  const zodiacSigns = [
    'Mesha', 'Vrishabha', 'Mithuna', 'Karka', 'Simha', 'Kanya',
    'Tula', 'Vrishchika', 'Dhanu', 'Makara', 'Kumbha', 'Meena'
  ];
  
  const signMapping: { [key: string]: string } = {
    'Aries': 'Mesha', 'Taurus': 'Vrishabha', 'Gemini': 'Mithuna',
    'Cancer': 'Karka', 'Leo': 'Simha', 'Virgo': 'Kanya',
    'Libra': 'Tula', 'Scorpio': 'Vrishchika', 'Sagittarius': 'Dhanu',
    'Capricorn': 'Makara', 'Aquarius': 'Kumbha', 'Pisces': 'Meena'
  };
  
  // Get ascendant sign index
  const ascendantSign = signMapping[ascendant.sign] || ascendant.sign;
  const ascendantIndex = zodiacSigns.indexOf(ascendantSign);
  
  // Create houses array
  const houses = Array.from({ length: 12 }, (_, i) => {
    const houseNum = i + 1;
    
    // Calculate which sign is in this house
    const signIndex = (ascendantIndex + i) % 12;
    const houseSign = zodiacSigns[signIndex];
    
    // Find planets in this house
    const planetsInHouse = planets.filter(planet => {
      const planetHouse = parseInt(planet.house);
      return planetHouse === houseNum;
    }).map(planet => ({
      name: planet.name,
      symbol: getSymbolForPlanet(planet.name),
      longitude: planet.longitude
    }));
    
    return {
      house: houseNum,
      sign: houseSign,
      planets: planetsInHouse
    };
  });
  
  return {
    houses,
    ascendant: {
      sign: ascendantSign,
      longitude: ascendant.longitude
    }
  };
};

const getSymbolForPlanet = (planetName: string): string => {
  const symbols: { [key: string]: string } = {
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
  return symbols[planetName] || planetName.charAt(0);
};

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

// Fixed zodiac signs layout for authentic East Indian chart
const FIXED_ZODIAC_LAYOUT = [
  { position: 1, sign: 'Aries', house: 1 },
  { position: 2, sign: 'Taurus', house: 2 },
  { position: 3, sign: 'Gemini', house: 3 },
  { position: 4, sign: 'Cancer', house: 4 },
  { position: 5, sign: 'Leo', house: 5 },
  { position: 6, sign: 'Virgo', house: 6 },
  { position: 7, sign: 'Libra', house: 7 },
  { position: 8, sign: 'Scorpio', house: 8 },
  { position: 9, sign: 'Sagittarius', house: 9 },
  { position: 10, sign: 'Capricorn', house: 10 },
  { position: 11, sign: 'Aquarius', house: 11 },
  { position: 12, sign: 'Pisces', house: 12 }
];

const EastIndianChartGenerator = () => {
  const [formData, setFormData] = useState({
    name: 'Mohan Kumar',
    date: '1980-09-09',
    time: '19:15',
    place: 'Chennai, Tamil Nadu, India',
    latitude: 13.0827,
    longitude: 80.2707
  });

  const { toast } = useToast();

  const generateChart = useMutation({
    mutationFn: async (data: typeof formData) => {
      // Use existing detailed birth chart API and transform the data for East Indian format
      const response = await fetch('/api/birth-chart/detailed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate chart');
      }
      
      const result = await response.json();
      
      // Transform the result to East Indian format
      const eastIndianChart = convertToEastIndianFormat(result.planets, result.ascendant);
      
      return {
        success: true,
        houses: eastIndianChart.houses,
        ascendant: eastIndianChart.ascendant,
        chartType: 'East Indian (North Indian)',
        description: 'Fixed houses with moving zodiac signs - traditional North Indian style'
      };
    },
    onSuccess: (data) => {
      toast({
        title: "Chart Generated Successfully",
        description: `East Indian chart created for ${formData.name}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateChart.mutate(formData);
  };

  const renderEastIndianChart = (chartData: EastIndianChartData) => {
    // Simplified East Indian chart - Clean 3x3 grid layout
    const cellSize = 100;
    const margin = 25;
    
    // Function to get planets for each house
    const getPlanetsForHouse = (houseNumber: number) => {
      const houseData = chartData.houses.find(h => h.house === houseNumber);
      return houseData?.planets || [];
    };

    // East Indian house positions in 3x3 grid (clockwise from top-middle)
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

    const planetNames: { [key: string]: string } = {
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
          <h3 className="text-lg font-bold">East Indian Chart</h3>
          <p className="text-sm text-gray-600">3×3 Grid Layout - Clockwise House Progression (Bengali/Oriya/Assamese Style)</p>
        </div>
        
        <svg width="100%" height="400" viewBox="0 0 400 400" className="border bg-white mx-auto" style={{ maxWidth: '400px' }}>
          {/* East Indian Chart - 3x3 Grid Layout (excluding center) */}
          
          {/* Draw 3x3 grid boxes */}
          {[0, 1, 2].map(row => 
            [0, 1, 2].map(col => {
              // Skip center box (1,1)
              if (row === 1 && col === 1) {
                return (
                  <g key={`center-${row}-${col}`}>
                    {/* Center box - simple white background */}
                    <rect
                      x={startX + col * gridSize}
                      y={startY + row * gridSize}
                      width={gridSize}
                      height={gridSize}
                      fill="white"
                      stroke="#ff6b35"
                      strokeWidth="2"
                    />
                    {/* Center diagonal lines */}
                    <line 
                      x1={startX + col * gridSize} 
                      y1={startY + row * gridSize} 
                      x2={startX + col * gridSize + gridSize} 
                      y2={startY + row * gridSize + gridSize} 
                      stroke="#ff6b35" 
                      strokeWidth="1"
                    />
                    <line 
                      x1={startX + col * gridSize + gridSize} 
                      y1={startY + row * gridSize} 
                      x2={startX + col * gridSize} 
                      y2={startY + row * gridSize + gridSize} 
                      stroke="#ff6b35" 
                      strokeWidth="1"
                    />
                  </g>
                );
              }
              
              // Find house for this grid position
              const houseData = eastIndianHouseLayout.find(h => h.row === row && h.col === col && h.house <= 8);
              if (!houseData) return null;
              
              const planets = getPlanetsForHouse(houseData.house);
              
              return (
                <g key={`house-${houseData.house}`}>
                  {/* House rectangle */}
                  <rect
                    x={startX + col * gridSize}
                    y={startY + row * gridSize}
                    width={gridSize}
                    height={gridSize}
                    fill="white"
                    stroke="#ff6b35"
                    strokeWidth="2"
                  />
                  

                  
                  {/* House number in corner - smaller like reference */}
                  <text
                    x={startX + col * gridSize + gridSize - 8}
                    y={startY + row * gridSize + 12}
                    textAnchor="middle"
                    fontSize="8"
                    fontWeight="normal"
                    fill="#666"
                  >
                    {houseData.house}
                  </text>
                  
                  {/* Special ascendant label */}
                  {houseData.house === 1 && (
                    <text
                      x={startX + col * gridSize + 10}
                      y={startY + row * gridSize + gridSize - 10}
                      textAnchor="start"
                      fontSize="10"
                      fontWeight="bold"
                      fill="#000"
                    >
                      Asc
                    </text>
                  )}
                  
                  {/* Planets positioned in house boxes */}
                  {planets.map((planet, index) => {
                    // Position planets in a clean grid within each house box
                    const planetsPerRow = 2;
                    const planetRow = Math.floor(index / planetsPerRow);
                    const planetCol = index % planetsPerRow;
                    
                    const position = {
                      x: startX + col * gridSize + 20 + (planetCol * 40),
                      y: startY + row * gridSize + 35 + (planetRow * 20)
                    };
                    
                    return (
                      <text
                        key={planet.name}
                        x={position.x}
                        y={position.y}
                        textAnchor="middle"
                        fontSize="10"
                        fontWeight="normal"
                        fill="#000"
                      >
                        {planetNames[planet.name] || planet.name}
                      </text>
                    );
                  })}
                </g>
              );
            })
          )}
          

        </svg>
        
        {/* Chart legend */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-2">House Meanings:</h4>
            <div className="text-xs space-y-1">
              <p>H1: Self, Personality</p>
              <p>H2: Wealth, Family</p>
              <p>H3: Siblings, Courage</p>
              <p>H4: Home, Mother</p>
              <p>H5: Children, Education</p>
              <p>H6: Health, Enemies</p>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Planet Symbols:</h4>
            <div className="text-xs space-y-1">
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
          <CardTitle>East Indian Chart Generator Test</CardTitle>
          <p className="text-sm text-gray-600">
            Generate East Indian (North Indian) style Vedic astrology chart with fixed houses
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
                <Input
                  id="place"
                  value={formData.place}
                  onChange={(e) => setFormData({ ...formData, place: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="0.0001"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="0.0001"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
                  required
                />
              </div>
            </div>
            
            <Button type="submit" disabled={generateChart.isPending} className="w-full">
              {generateChart.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
};

export default EastIndianChartGenerator;