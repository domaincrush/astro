import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { Badge } from "src/components/ui/badge";
import { Button } from "src/components/ui/button";
import { Separator } from "src/components/ui/separator";
import { Calendar, Clock, MapPin, Star, Loader2, AlertCircle, ExternalLink } from "lucide-react";
import { apiRequest } from "src/lib/queryClient";

interface BirthChartProps {
  userDetails: {
    name: string;
    dateOfBirth: string;
    timeOfBirth: string;
    placeOfBirth: string;
    question?: string;
  };
  isAstrologerView?: boolean;
}

export default function BirthChart({ userDetails, isAstrologerView = false }: BirthChartProps) {
  // Debug userDetails to see what's being passed
  console.log('BirthChart userDetails:', userDetails);
  
  // Calculate basic information safely with additional null checks
  if (!userDetails) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-sm text-muted-foreground">No user details available</div>
        </CardContent>
      </Card>
    );
  }

  const birthDate = userDetails.dateOfBirth ? new Date(userDetails.dateOfBirth) : null;
  const currentDate = new Date();
  const age = birthDate && !isNaN(birthDate.getTime()) 
    ? currentDate.getFullYear() - birthDate.getFullYear() 
    : null;

  // Get authentic Jyotisha birth chart data
  const { data: jyotishaData, isLoading, error } = useQuery({
    queryKey: ["jyotisha-birth-chart", userDetails.dateOfBirth, userDetails.timeOfBirth, userDetails.placeOfBirth],
    queryFn: async () => {
      if (!userDetails.dateOfBirth || !userDetails.timeOfBirth || !userDetails.placeOfBirth) {
        return null;
      }

      const response = await apiRequest("POST", "/api/calculate-jyotisha", {
        name: userDetails.name || "User",
        date: userDetails.dateOfBirth,
        time: userDetails.timeOfBirth,
        place: userDetails.placeOfBirth,
        latitude: 13.0827, // Chennai coordinates
        longitude: 80.2707
      });

      if (!response.ok) {
        throw new Error("Failed to calculate birth chart");
      }

      const rawData = await response.json();
      
      // Extract the key fields from the API response
      const moonPlanet = rawData.planets?.find((p: any) => p.name === 'Moon');
      
      const extractedData = {
        ascendant: typeof rawData.ascendant === 'object' ? rawData.ascendant.sign : rawData.ascendant || 'N/A',
        moonSign: moonPlanet?.sign || 'N/A', 
        nakshatra: moonPlanet?.nakshatra || 'N/A',
        currentDasha: rawData.dasha?.current || rawData.currentDasha || null,
        planets: rawData.planets || []
      };
      
      return extractedData;
    },
    enabled: !!(userDetails.dateOfBirth && userDetails.timeOfBirth && userDetails.placeOfBirth),
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });

  // Debug jyotishaData structure  
  console.log('BirthChart jyotishaData:', jyotishaData);

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-lg">
          <Star className="h-5 w-5 text-yellow-500" />
          <span>Birth Chart</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-sm text-muted-foreground">Calculating chart...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="space-y-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-800 dark:text-red-200">Failed to load birth chart</span>
            </div>
            <div className="text-xs text-red-600 dark:text-red-400">
              {error instanceof Error ? error.message : 'Unknown error occurred'}
            </div>
          </div>
        )}

        {/* Personal Details */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="font-medium">{userDetails.dateOfBirth}</div>
              <div className="text-sm text-muted-foreground">
                Age: {age !== null ? `${age} years` : 'N/A'}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="font-medium">{userDetails.timeOfBirth}</div>
              <div className="text-sm text-muted-foreground">Birth time</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="font-medium">{userDetails.placeOfBirth}</div>
              <div className="text-sm text-muted-foreground">Birth place</div>
            </div>
          </div>
        </div>

        {/* Birth Chart Links for Astrologers */}
        {isAstrologerView && userDetails.dateOfBirth && userDetails.timeOfBirth && userDetails.placeOfBirth && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Birth Charts</div>
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => window.open(`/chart/north-indian?date=${userDetails.dateOfBirth}&time=${userDetails.timeOfBirth}&place=${userDetails.placeOfBirth}`, '_blank')}
                className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
              >
                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">North Indian Chart</span>
                <ExternalLink className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </button>
              <button
                onClick={() => window.open(`/chart/south-indian?date=${userDetails.dateOfBirth}&time=${userDetails.timeOfBirth}&place=${userDetails.placeOfBirth}`, '_blank')}
                className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
              >
                <span className="text-sm font-medium text-green-800 dark:text-green-200">South Indian Chart</span>
                <ExternalLink className="h-4 w-4 text-green-600 dark:text-green-400" />
              </button>
            </div>
          </div>
        )}

        <Separator />

        {/* Authentic Jyotisha Information */}
        {jyotishaData && (
          <div className="space-y-3">
            <div className="text-sm font-medium text-muted-foreground mb-2">Vedic Astrology</div>
            
            {/* Ascendant and Moon Sign */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 bg-muted rounded-md">
                <div className="text-xs text-muted-foreground">Ascendant</div>
                <div className="font-medium text-sm">
                  {jyotishaData.ascendant || 'N/A'}
                </div>
              </div>
              <div className="p-2 bg-muted rounded-md">
                <div className="text-xs text-muted-foreground">Moon Sign</div>
                <div className="font-medium text-sm">
                  {jyotishaData.moonSign || 'N/A'}
                </div>
              </div>
            </div>

            {/* Nakshatra */}
            {jyotishaData.nakshatra && (
              <div className="p-2 bg-muted rounded-md">
                <div className="text-xs text-muted-foreground">Nakshatra</div>
                <div className="font-medium text-sm">
                  {jyotishaData.nakshatra || 'N/A'}
                </div>
              </div>
            )}

            {/* Current Dasha */}
            {jyotishaData.currentDasha && (
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
                <div className="text-xs text-blue-600 dark:text-blue-400">Current Dasha</div>
                <div className="font-medium text-sm text-blue-800 dark:text-blue-200">
                  {typeof jyotishaData.currentDasha === 'string' 
                    ? jyotishaData.currentDasha 
                    : `${jyotishaData.currentDasha.lord || jyotishaData.currentDasha.mahadasha || 'N/A'} Mahadasha`
                  }
                </div>
                {jyotishaData.currentDasha.end_date && (
                  <div className="text-xs text-blue-600 dark:text-blue-400">
                    Until: {new Date(jyotishaData.currentDasha.end_date).toLocaleDateString()}
                  </div>
                )}
              </div>
            )}

            {/* Major Planetary Positions */}
            {jyotishaData.planets && Array.isArray(jyotishaData.planets) && (
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">Key Planets</div>
                <div className="grid grid-cols-1 gap-1">
                  {['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus'].map(planetName => {
                    const planet = jyotishaData.planets.find((p: any) => p.name === planetName);
                    if (!planet) return null;
                    
                    // Safely extract planet data - handle object or string formats
                    const planetSign = typeof planet.sign === 'object' ? planet.sign.sign || 'N/A' : planet.sign || 'N/A';
                    const planetHouse = typeof planet.house === 'object' ? planet.house.house || 'N/A' : planet.house || 'N/A';
                    
                    return (
                      <div key={planetName} className="flex justify-between text-xs">
                        <span className="text-muted-foreground">{planetName}:</span>
                        <span>{planetSign} ({planetHouse}H)</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Fallback for when no Jyotisha data */}
        {!jyotishaData && !isLoading && !error && (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="text-sm text-yellow-800 dark:text-yellow-200">
              Complete birth details needed for detailed astrological analysis
            </div>
          </div>
        )}

        {userDetails.question && (
          <>
            <Separator />
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-2">Question</div>
              <div className="text-sm bg-muted p-2 rounded-md">
                {userDetails.question}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}