import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from 'src/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'src/components/ui/tabs';
import { Badge } from 'src/components/ui/badge';
import { Calendar, MapPin, Clock, Star, Users } from 'lucide-react';

interface Planet {
  name: string;
  longitude: number;
  sign: string;
  degree: string;
  nakshatra: string;
  nakshatraLord: string;
  house: number;
}

interface JemicroData {
  success: boolean;
  planets: Planet[];
  ascendant: {
    longitude: number;
    sign: string;
  };
  dasha: {
    current: {
      lord: string;
      start_date: string;
      end_date: string;
      duration_years: number;
      status: string;
    };
    sequence: Array<{
      lord: string;
      start_date: string;
      end_date: string;
      duration_years: number;
      status: string;
    }>;
    moonNakshatra: {
      name: string;
      number: number;
      pada: number;
      lord: string;
    };
  };
  calculation_engine: string;
  engine_version: string;
}

interface BirthDetailsPanelProps {
  consultation: any;
  jemicroDetails: JemicroData | null;
  isLoading: boolean;
}

const BirthDetailsPanel: React.FC<BirthDetailsPanelProps> = ({
  consultation,
  jemicroDetails,
  isLoading
}) => {
  // North Indian Chart Layout (Diamond shape)
  const renderNorthIndianChart = () => {
    if (!jemicroDetails?.planets || !jemicroDetails?.ascendant) return null;

    // Create house mapping
    const houses = Array.from({ length: 12 }, () => [] as string[]);
    
    // Add planets to houses
    jemicroDetails.planets.forEach(planet => {
      if (planet.house >= 1 && planet.house <= 12) {
        houses[planet.house - 1].push(planet.name.substring(0, 2));
      }
    });

    // Add ascendant to 1st house
    houses[0].push('Asc');

    const housePositions = [
      { house: 1, top: '10%', left: '50%', transform: 'translate(-50%, -50%)' },
      { house: 2, top: '25%', left: '75%', transform: 'translate(-50%, -50%)' },
      { house: 3, top: '50%', left: '90%', transform: 'translate(-50%, -50%)' },
      { house: 4, top: '75%', left: '75%', transform: 'translate(-50%, -50%)' },
      { house: 5, top: '90%', left: '50%', transform: 'translate(-50%, -50%)' },
      { house: 6, top: '75%', left: '25%', transform: 'translate(-50%, -50%)' },
      { house: 7, top: '50%', left: '10%', transform: 'translate(-50%, -50%)' },
      { house: 8, top: '25%', left: '25%', transform: 'translate(-50%, -50%)' },
      { house: 9, top: '25%', left: '50%', transform: 'translate(-50%, -50%)' },
      { house: 10, top: '25%', left: '75%', transform: 'translate(-50%, -50%)' },
      { house: 11, top: '50%', left: '75%', transform: 'translate(-50%, -50%)' },
      { house: 12, top: '75%', left: '50%', transform: 'translate(-50%, -50%)' }
    ];

    return (
      <div className="relative w-full h-64 bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 rounded-lg">
        {/* Diamond shape outline */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
          <polygon
            points="100,20 160,60 160,140 100,180 40,140 40,60"
            fill="none"
            stroke="#f97316"
            strokeWidth="2"
          />
          {/* Inner divisions */}
          <line x1="100" y1="20" x2="100" y2="180" stroke="#f97316" strokeWidth="1" />
          <line x1="40" y1="60" x2="160" y2="140" stroke="#f97316" strokeWidth="1" />
          <line x1="40" y1="140" x2="160" y2="60" stroke="#f97316" strokeWidth="1" />
        </svg>
        
        {/* House numbers and planets */}
        {housePositions.map((pos, index) => (
          <div
            key={pos.house}
            className="absolute text-xs bg-white border border-orange-300 rounded px-1 py-0.5 min-w-8 text-center"
            style={{
              top: pos.top,
              left: pos.left,
              transform: pos.transform
            }}
          >
            <div className="font-bold text-orange-600">{pos.house}</div>
            <div className="text-blue-600 text-xs">
              {houses[index].join(', ')}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // South Indian Chart Layout (Square grid)
  const renderSouthIndianChart = () => {
    if (!jemicroDetails?.planets || !jemicroDetails?.ascendant) return null;

    // Create house mapping
    const houses = Array.from({ length: 12 }, () => [] as string[]);
    
    // Add planets to houses
    jemicroDetails.planets.forEach(planet => {
      if (planet.house >= 1 && planet.house <= 12) {
        houses[planet.house - 1].push(planet.name.substring(0, 2));
      }
    });

    // Add ascendant to 1st house
    houses[0].push('Asc');

    // South Indian layout mapping
    const southIndianLayout = [
      [11, 0, 1, 2],    // houses 12, 1, 2, 3
      [10, -1, -1, 3],  // houses 11, empty, empty, 4
      [9, -1, -1, 4],   // houses 10, empty, empty, 5
      [8, 7, 6, 5]      // houses 9, 8, 7, 6
    ];

    return (
      <div className="w-full bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg">
        <div className="grid grid-cols-4 gap-0">
          {southIndianLayout.map((row, rowIndex) =>
            row.map((houseIndex, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`
                  aspect-square border border-blue-300 flex flex-col items-center justify-center text-xs
                  ${houseIndex === -1 ? 'bg-blue-100' : 'bg-white hover:bg-blue-50'}
                  ${rowIndex === 0 || rowIndex === 3 ? 'border-t-2 border-b-2' : ''}
                  ${colIndex === 0 || colIndex === 3 ? 'border-l-2 border-r-2' : ''}
                `}
              >
                {houseIndex !== -1 && (
                  <>
                    <div className="font-bold text-blue-600">{houseIndex + 1}</div>
                    <div className="text-purple-600 text-xs text-center">
                      {houses[houseIndex].join(', ')}
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  const formatDashaDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const getDashaProgress = (startDate: string, endDate: string) => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const now = Date.now();
    
    if (now < start) return 0;
    if (now > end) return 100;
    
    const progress = ((now - start) / (end - start)) * 100;
    return Math.round(progress);
  };

  return (
    <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Star className="h-5 w-5 text-purple-600" />
          Birth Details
        </h2>

        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Basic Birth Information */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Birth Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <Calendar className="h-3 w-3 text-gray-500" />
                  <span>{consultation?.birthDetails?.date || 'Date not available'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Clock className="h-3 w-3 text-gray-500" />
                  <span>{consultation?.birthDetails?.time || 'Time not available'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <MapPin className="h-3 w-3 text-gray-500" />
                  <span>{consultation?.birthDetails?.place || 'Place not available'}</span>
                </div>
              </CardContent>
            </Card>

            {/* Astrological Summary */}
            {jemicroDetails?.success && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Astrological Summary</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Badge variant="outline" className="justify-center">
                      <span className="text-xs">Lagna: {jemicroDetails.ascendant?.sign}</span>
                    </Badge>
                    <Badge variant="outline" className="justify-center">
                      <span className="text-xs">Moon: {jemicroDetails.dasha?.moonNakshatra?.name}</span>
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 text-center">
                    Engine: {jemicroDetails.calculation_engine} v{jemicroDetails.engine_version}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Birth Charts */}
            {jemicroDetails?.success && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Birth Charts</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <Tabs defaultValue="north" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="north" className="text-xs">North Indian</TabsTrigger>
                      <TabsTrigger value="south" className="text-xs">South Indian</TabsTrigger>
                    </TabsList>
                    <TabsContent value="north" className="mt-4">
                      {renderNorthIndianChart()}
                    </TabsContent>
                    <TabsContent value="south" className="mt-4">
                      {renderSouthIndianChart()}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}

            {/* Current Dasha Details */}
            {jemicroDetails?.success && jemicroDetails.dasha && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Current Dasha Period
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-3 rounded border">
                    <div className="text-sm font-semibold text-purple-700">
                      {jemicroDetails.dasha.current.lord} Mahadasha
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {formatDashaDate(jemicroDetails.dasha.current.start_date)} - {formatDashaDate(jemicroDetails.dasha.current.end_date)}
                    </div>
                    <div className="text-xs text-gray-600">
                      Duration: {jemicroDetails.dasha.current.duration_years} years
                    </div>
                    
                    {/* Progress bar */}
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${getDashaProgress(
                              jemicroDetails.dasha.current.start_date, 
                              jemicroDetails.dasha.current.end_date
                            )}%` 
                          }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Progress: {getDashaProgress(
                          jemicroDetails.dasha.current.start_date, 
                          jemicroDetails.dasha.current.end_date
                        )}%
                      </div>
                    </div>
                  </div>

                  {/* Next Dasha */}
                  {jemicroDetails.dasha.sequence && (
                    <div className="border-t pt-2">
                      <div className="text-xs font-medium text-gray-700 mb-2">Upcoming Periods:</div>
                      {jemicroDetails.dasha.sequence
                        .filter(d => d.status === 'upcoming')
                        .slice(0, 3)
                        .map((dasha, index) => (
                          <div key={index} className="text-xs text-gray-600 py-1 border-l-2 border-gray-200 pl-2">
                            <span className="font-medium">{dasha.lord}</span> - {formatDashaDate(dasha.start_date)} ({dasha.duration_years}y)
                          </div>
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Moon Nakshatra Details */}
            {jemicroDetails?.success && jemicroDetails.dasha?.moonNakshatra && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Moon Nakshatra
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-3 rounded border">
                    <div className="text-sm font-semibold text-orange-700">
                      {jemicroDetails.dasha.moonNakshatra.name}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      Nakshatra #{jemicroDetails.dasha.moonNakshatra.number} • Pada {jemicroDetails.dasha.moonNakshatra.pada}
                    </div>
                    <div className="text-xs text-gray-600">
                      Ruler: {jemicroDetails.dasha.moonNakshatra.lord}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BirthDetailsPanel;