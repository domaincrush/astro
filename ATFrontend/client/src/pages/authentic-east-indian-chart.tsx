import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "src/lib/queryClient";
import { Button } from "src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { Input } from "src/components/ui/input";
import { Label } from "src/components/ui/label";
import AstroTickHeader from "src/components/layout/AstroTickHeader";

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

interface BirthData {
  name: string;
  date: string;
  time: string;
  latitude: number;
  longitude: number;
  place: string;
}

export default function AuthenticEastIndianChart() {
  const [birthData, setBirthData] = useState<BirthData>({
    name: "Mohan Kumar",
    date: "1980-09-09",
    time: "19:15",
    latitude: 13.0827,
    longitude: 80.2707,
    place: "Chennai, Tamil Nadu, India"
  });
  
  const [chartData, setChartData] = useState<EastIndianChartData | null>(null);

  // Planet name mapping for display
  const planetNames: Record<string, string> = {
    'Sun': 'Su',
    'Moon': 'Mo',
    'Mars': 'Ma',
    'Mercury': 'Me',
    'Jupiter': 'Ju',
    'Venus': 'Ve',
    'Saturn': 'Sa',
    'Rahu': 'Ra',
    'Ketu': 'Ke'
  };

  const calculateChart = useMutation({
    mutationFn: async (data: BirthData) => {
      const response = await apiRequest('/api/birth-chart/detailed', 'POST', data);
      return response;
    },
    onSuccess: (data: any) => {
      if (data.success) {
        setChartData(data);
      }
    },
  });

  const renderAuthenticEastIndianChart = (chartData: EastIndianChartData) => {
    const gridSize = 120;
    const startX = 50;
    const startY = 50;
    
    // Function to get planets for each house
    const getPlanetsForHouse = (houseNumber: number) => {
      const houseData = chartData.houses.find(h => h.house === houseNumber);
      return houseData ? houseData.planets : [];
    };

    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="text-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">Authentic East Indian Chart</h3>
          <p className="text-sm text-gray-600">Fixed Positions with Diagonal Lines in Specific House Pairs</p>
        </div>
        
        <svg width="450" height="450" viewBox="0 0 450 450" className="border bg-white mx-auto">
          {/* East Indian Chart - Authentic layout matching reference image */}
          
          {/* Render the 3x3 grid structure */}
          {[0, 1, 2].map(row => 
            [0, 1, 2].map(col => {
              return (
                <g key={`grid-${row}-${col}`}>
                  {/* Grid box */}
                  <rect
                    x={startX + col * gridSize}
                    y={startY + row * gridSize}
                    width={gridSize}
                    height={gridSize}
                    fill="white"
                    stroke="#2c5aa0"
                    strokeWidth="2"
                  />
                </g>
              );
            })
          )}
          
          {/* Red outer border */}
          <rect
            x={startX}
            y={startY}
            width={gridSize * 3}
            height={gridSize * 3}
            fill="none"
            stroke="#e74c3c"
            strokeWidth="3"
          />
          
          {/* Diagonal lines in specific house pairs only */}
          {/* Houses 2&3 - Top-left box */}
          <line 
            x1={startX} 
            y1={startY} 
            x2={startX + gridSize} 
            y2={startY + gridSize} 
            stroke="#2c5aa0" 
            strokeWidth="2"
          />
          <line 
            x1={startX + gridSize} 
            y1={startY} 
            x2={startX} 
            y2={startY + gridSize} 
            stroke="#2c5aa0" 
            strokeWidth="2"
          />
          
          {/* Houses 5&6 - Bottom-left box */}
          <line 
            x1={startX} 
            y1={startY + 2 * gridSize} 
            x2={startX + gridSize} 
            y2={startY + 3 * gridSize} 
            stroke="#2c5aa0" 
            strokeWidth="2"
          />
          <line 
            x1={startX + gridSize} 
            y1={startY + 2 * gridSize} 
            x2={startX} 
            y2={startY + 3 * gridSize} 
            stroke="#2c5aa0" 
            strokeWidth="2"
          />
          
          {/* Houses 8&9 - Bottom-right box */}
          <line 
            x1={startX + 2 * gridSize} 
            y1={startY + 2 * gridSize} 
            x2={startX + 3 * gridSize} 
            y2={startY + 3 * gridSize} 
            stroke="#2c5aa0" 
            strokeWidth="2"
          />
          <line 
            x1={startX + 3 * gridSize} 
            y1={startY + 2 * gridSize} 
            x2={startX + 2 * gridSize} 
            y2={startY + 3 * gridSize} 
            stroke="#2c5aa0" 
            strokeWidth="2"
          />
          
          {/* Houses 11&12 - Top-right box */}
          <line 
            x1={startX + 2 * gridSize} 
            y1={startY} 
            x2={startX + 3 * gridSize} 
            y2={startY + gridSize} 
            stroke="#2c5aa0" 
            strokeWidth="2"
          />
          <line 
            x1={startX + 3 * gridSize} 
            y1={startY} 
            x2={startX + 2 * gridSize} 
            y2={startY + gridSize} 
            stroke="#2c5aa0" 
            strokeWidth="2"
          />
          
          {/* House numbers in fixed positions */}
          {/* House 1 - Center */}
          <text
            x={startX + 1.5 * gridSize}
            y={startY + 1.5 * gridSize}
            textAnchor="middle"
            fontSize="16"
            fontWeight="bold"
            fill="#000"
          >
            1
          </text>
          
          {/* House 4 - Left-middle */}
          <text
            x={startX + 0.5 * gridSize}
            y={startY + 1.5 * gridSize}
            textAnchor="middle"
            fontSize="16"
            fontWeight="bold"
            fill="#000"
          >
            4
          </text>
          
          {/* House 7 - Bottom-center */}
          <text
            x={startX + 1.5 * gridSize}
            y={startY + 2.5 * gridSize}
            textAnchor="middle"
            fontSize="16"
            fontWeight="bold"
            fill="#000"
          >
            7
          </text>
          
          {/* House 10 - Right-middle */}
          <text
            x={startX + 2.5 * gridSize}
            y={startY + 1.5 * gridSize}
            textAnchor="middle"
            fontSize="16"
            fontWeight="bold"
            fill="#000"
          >
            10
          </text>
          
          {/* House pairs with diagonal divisions - positioned in triangular sections */}
          {/* Houses 2&3 - Top-left box triangular sections */}
          <text
            x={startX + 0.25 * gridSize}
            y={startY + 0.25 * gridSize}
            textAnchor="middle"
            fontSize="12"
            fontWeight="normal"
            fill="#666"
          >
            2
          </text>
          <text
            x={startX + 0.75 * gridSize}
            y={startY + 0.75 * gridSize}
            textAnchor="middle"
            fontSize="12"
            fontWeight="normal"
            fill="#666"
          >
            3
          </text>
          
          {/* Houses 5&6 - Bottom-left triangular sections */}
          <text
            x={startX + 0.25 * gridSize}
            y={startY + 2.75 * gridSize}
            textAnchor="middle"
            fontSize="12"
            fontWeight="normal"
            fill="#666"
          >
            5
          </text>
          <text
            x={startX + 0.75 * gridSize}
            y={startY + 2.25 * gridSize}
            textAnchor="middle"
            fontSize="12"
            fontWeight="normal"
            fill="#666"
          >
            6
          </text>
          
          {/* Houses 8&9 - Bottom-right triangular sections */}
          <text
            x={startX + 2.25 * gridSize}
            y={startY + 2.75 * gridSize}
            textAnchor="middle"
            fontSize="12"
            fontWeight="normal"
            fill="#666"
          >
            8
          </text>
          <text
            x={startX + 2.75 * gridSize}
            y={startY + 2.25 * gridSize}
            textAnchor="middle"
            fontSize="12"
            fontWeight="normal"
            fill="#666"
          >
            9
          </text>
          
          {/* Houses 11&12 - Top-right triangular sections */}
          <text
            x={startX + 2.25 * gridSize}
            y={startY + 0.25 * gridSize}
            textAnchor="middle"
            fontSize="12"
            fontWeight="normal"
            fill="#666"
          >
            11
          </text>
          <text
            x={startX + 2.75 * gridSize}
            y={startY + 0.75 * gridSize}
            textAnchor="middle"
            fontSize="12"
            fontWeight="normal"
            fill="#666"
          >
            12
          </text>

          {/* Display planets in their respective houses */}
          {chartData.houses.map((house) => {
            const planets = house.planets;
            if (planets.length === 0) return null;

            // Determine position based on house number
            let baseX, baseY;
            
            if (house.house === 1) {
              baseX = startX + 1.5 * gridSize;
              baseY = startY + 1.3 * gridSize;
            } else if (house.house === 4) {
              baseX = startX + 0.5 * gridSize;
              baseY = startY + 1.3 * gridSize;
            } else if (house.house === 7) {
              baseX = startX + 1.5 * gridSize;
              baseY = startY + 2.3 * gridSize;
            } else if (house.house === 10) {
              baseX = startX + 2.5 * gridSize;
              baseY = startY + 1.3 * gridSize;
            } else if (house.house === 2) {
              baseX = startX + 0.25 * gridSize;
              baseY = startY + 0.4 * gridSize;
            } else if (house.house === 3) {
              baseX = startX + 0.75 * gridSize;
              baseY = startY + 0.9 * gridSize;
            } else if (house.house === 5) {
              baseX = startX + 0.25 * gridSize;
              baseY = startY + 2.6 * gridSize;
            } else if (house.house === 6) {
              baseX = startX + 0.75 * gridSize;
              baseY = startY + 2.4 * gridSize;
            } else if (house.house === 8) {
              baseX = startX + 2.25 * gridSize;
              baseY = startY + 2.6 * gridSize;
            } else if (house.house === 9) {
              baseX = startX + 2.75 * gridSize;
              baseY = startY + 2.4 * gridSize;
            } else if (house.house === 11) {
              baseX = startX + 2.25 * gridSize;
              baseY = startY + 0.4 * gridSize;
            } else if (house.house === 12) {
              baseX = startX + 2.75 * gridSize;
              baseY = startY + 0.9 * gridSize;
            } else {
              return null;
            }

            return (
              <g key={`house-${house.house}-planets`}>
                {planets.map((planet, index) => (
                  <text
                    key={`${house.house}-${planet.name}`}
                    x={baseX}
                    y={baseY + (index * 15)}
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="normal"
                    fill="#000"
                  >
                    {planetNames[planet.name] || planet.name}
                  </text>
                ))}
              </g>
            );
          })}
        </svg>
        
        {/* Chart information */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-2">Chart Features:</h4>
            <div className="text-xs space-y-1">
              <p>✓ Fixed house positions (1, 4, 7, 10)</p>
              <p>✓ Diagonal lines in houses 2&3, 5&6, 8&9, 11&12</p>
              <p>✓ Triangular sections for planet placement</p>
              <p>✓ Authentic East Indian (Bengali/Oriya) style</p>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Planet Abbreviations:</h4>
            <div className="text-xs space-y-1">
              <p>Su=Sun, Mo=Moon, Ma=Mars, Me=Mercury</p>
              <p>Ju=Jupiter, Ve=Venus, Sa=Saturn</p>
              <p>Ra=Rahu, Ke=Ketu</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Generate chart on page load
  useEffect(() => {
    calculateChart.mutate(birthData);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <AstroTickHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                Authentic East Indian Chart Generator
              </CardTitle>
              <p className="text-center text-gray-600">
                Traditional Bengali/Oriya/Assamese style with diagonal lines in specific house pairs
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={birthData.name}
                    onChange={(e) => setBirthData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="date">Date of Birth</Label>
                  <Input
                    id="date"
                    type="date"
                    value={birthData.date}
                    onChange={(e) => setBirthData(prev => ({ ...prev, date: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="time">Time of Birth</Label>
                  <Input
                    id="time"
                    type="time"
                    value={birthData.time}
                    onChange={(e) => setBirthData(prev => ({ ...prev, time: e.target.value }))}
                  />
                </div>
              </div>
              
              <Button 
                onClick={() => calculateChart.mutate(birthData)}
                disabled={calculateChart.isPending}
                className="w-full mb-6"
              >
                {calculateChart.isPending ? 'Generating Chart...' : 'Generate Authentic East Indian Chart'}
              </Button>
            </CardContent>
          </Card>

          {chartData && renderAuthenticEastIndianChart(chartData)}
        </div>
      </div>
    </div>
  );
}