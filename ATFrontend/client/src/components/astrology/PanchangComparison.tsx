import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "src/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "src/components/ui/tabs";
import { Badge } from "src/components/ui/badge";
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import { Label } from "src/components/ui/label";
import { apiRequest } from "src/lib/queryClient";
import { useToast } from "src/hooks/use-toast";
import { Calendar, Clock, Sun, Moon, Star, Sunrise, Sunset, GitCompare } from "lucide-react";
import CitySelector from "./CitySelector";

interface PanchangComparisonProps {
  selectedDate: string;
  latitude: number;
  longitude: number;
  locationName: string;
}

export default function PanchangComparison({ 
  selectedDate, 
  latitude, 
  longitude, 
  locationName 
}: PanchangComparisonProps) {
  const { toast } = useToast();
  const [jyotishaData, setJyotishaData] = useState<any>(null);
  const [drikData, setDrikData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeEngine, setActiveEngine] = useState<'jyotisha' | 'drik' | 'both'>('both');

  const fetchJyotishaPanchang = async () => {
    try {
      setLoading(true);
      const response = await apiRequest('/api/panchang/comprehensive', {
        method: 'POST',
        body: {
          date: selectedDate,
          latitude: latitude,
          longitude: longitude,
          location: locationName
        }
      });
      setJyotishaData(response);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch Jyotisha Panchang data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDrikPanchang = async () => {
    try {
      setLoading(true);
      const response = await apiRequest('/api/panchang/drik', {
        method: 'POST',
        body: {
          date: selectedDate,
          latitude: latitude,
          longitude: longitude
        }
      });
      setDrikData(response);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch Drik Panchang data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchBothPanchang = async () => {
    try {
      setLoading(true);
      
      const [jyotishaResponse, drikResponse] = await Promise.all([
        apiRequest('/api/panchang/comprehensive', {
          method: 'POST',
          body: {
            date: selectedDate,
            latitude: latitude,
            longitude: longitude,
            location: locationName
          }
        }),
        apiRequest('/api/panchang/drik', {
          method: 'POST',
          body: {
            date: selectedDate,
            latitude: latitude,
            longitude: longitude
          }
        })
      ]);

      setJyotishaData(jyotishaResponse);
      setDrikData(drikResponse);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch Panchang data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const renderPanchangCard = (data: any, engine: string) => {
    if (!data) return null;

    const panchangData = engine === 'jyotisha' ? data.data : data;

    return (
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            {engine === 'jyotisha' ? 'Jyotisha Engine' : 'Drik Panchang Engine'}
          </CardTitle>
          <CardDescription>
            {panchangData.date} - {panchangData.location}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Tithi */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Moon className="h-4 w-4" />
                <span className="font-medium">Tithi</span>
              </div>
              <div className="text-sm">
                <p className="font-semibold">{panchangData.tithi?.name}</p>
                <p className="text-muted-foreground">
                  {panchangData.tithi?.percentage}% complete
                </p>
                <p className="text-xs">Ends: {panchangData.tithi?.end_time}</p>
              </div>
            </div>

            {/* Nakshatra */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                <span className="font-medium">Nakshatra</span>
              </div>
              <div className="text-sm">
                <p className="font-semibold">{panchangData.nakshatra?.name}</p>
                <p className="text-muted-foreground">
                  {panchangData.nakshatra?.percentage}% complete
                </p>
                <p className="text-xs">Ends: {panchangData.nakshatra?.end_time}</p>
              </div>
            </div>

            {/* Yoga */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Sun className="h-4 w-4" />
                <span className="font-medium">Yoga</span>
              </div>
              <div className="text-sm">
                <p className="font-semibold">{panchangData.yoga?.name}</p>
                <p className="text-muted-foreground">
                  {panchangData.yoga?.percentage}% complete
                </p>
                <p className="text-xs">Ends: {panchangData.yoga?.end_time}</p>
              </div>
            </div>

            {/* Karana */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span className="font-medium">Karana</span>
              </div>
              <div className="text-sm">
                <p className="font-semibold">{panchangData.karana?.name}</p>
                <p className="text-muted-foreground">
                  {panchangData.karana?.percentage}% complete
                </p>
                <p className="text-xs">Ends: {panchangData.karana?.end_time}</p>
              </div>
            </div>

            {/* Vara */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="font-medium">Vara</span>
              </div>
              <div className="text-sm">
                <p className="font-semibold">{panchangData.vara?.name || panchangData.vara?.english}</p>
                <p className="text-muted-foreground">
                  Lord: {panchangData.vara?.planet_lord || 'N/A'}
                </p>
              </div>
            </div>

            {/* Sunrise/Sunset */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Sunrise className="h-4 w-4" />
                <span className="font-medium">Sun Times</span>
              </div>
              <div className="text-sm">
                <p>Rise: {panchangData.sunrise}</p>
                <p>Set: {panchangData.sunset}</p>
              </div>
            </div>
          </div>

          {/* Timing Information */}
          {panchangData.auspicious_timings && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Auspicious Times</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                <div>
                  <span className="font-medium">Abhijit Muhurta:</span>
                  <br />
                  {panchangData.auspicious_timings.abhijit_muhurta?.start} - {panchangData.auspicious_timings.abhijit_muhurta?.end}
                </div>
                <div>
                  <span className="font-medium">Brahma Muhurta:</span>
                  <br />
                  {panchangData.auspicious_timings.brahma_muhurta?.start} - {panchangData.auspicious_timings.brahma_muhurta?.end}
                </div>
                <div>
                  <span className="font-medium">Amrit Kaal:</span>
                  <br />
                  {panchangData.auspicious_timings.amrit_kaal?.start} - {panchangData.auspicious_timings.amrit_kaal?.end}
                </div>
              </div>
            </div>
          )}

          {/* Planetary Positions */}
          {panchangData.planetary_positions && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Planetary Positions</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                {Object.entries(panchangData.planetary_positions).map(([planet, position]: [string, any]) => (
                  <div key={planet}>
                    <span className="font-medium capitalize">{planet}:</span>
                    <br />
                    {position.sign} {position.degrees?.toFixed(1)}°
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Calculation Details */}
          <div className="mt-4 p-2 bg-gray-50 rounded text-xs text-gray-600">
            <p>Engine: {panchangData.calculation_engine || 'Jyotisha'}</p>
            <p>Calculated: {panchangData.calculations?.calculated_at || panchangData.calculatedAt}</p>
            <p>Method: {panchangData.calculations?.calculation_method || 'Traditional Vedic'}</p>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2">
          <Button 
            onClick={fetchJyotishaPanchang} 
            disabled={loading}
            variant={activeEngine === 'jyotisha' ? 'default' : 'outline'}
          >
            Jyotisha Only
          </Button>
          <Button 
            onClick={fetchDrikPanchang} 
            disabled={loading}
            variant={activeEngine === 'drik' ? 'default' : 'outline'}
          >
            Drik Only
          </Button>
          <Button 
            onClick={fetchBothPanchang} 
            disabled={loading}
            variant={activeEngine === 'both' ? 'default' : 'outline'}
          >
            <GitCompare className="h-4 w-4 mr-2" />
            Compare Both
          </Button>
        </div>
        
        {loading && (
          <Badge variant="secondary">
            <Clock className="h-3 w-3 mr-1 animate-spin" />
            Calculating...
          </Badge>
        )}
      </div>

      {/* Results */}
      <div className="space-y-4">
        {jyotishaData && renderPanchangCard(jyotishaData, 'jyotisha')}
        {drikData && renderPanchangCard(drikData, 'drik')}
        
        {jyotishaData && drikData && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitCompare className="h-5 w-5" />
                Calculation Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Jyotisha Engine</h4>
                  <div className="text-sm space-y-1">
                    <p>Tithi: {jyotishaData.data?.tithi?.name} ({jyotishaData.data?.tithi?.percentage}%)</p>
                    <p>Nakshatra: {jyotishaData.data?.nakshatra?.name} ({jyotishaData.data?.nakshatra?.percentage}%)</p>
                    <p>Yoga: {jyotishaData.data?.yoga?.name}</p>
                    <p>Karana: {jyotishaData.data?.karana?.name}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Drik Panchang Engine</h4>
                  <div className="text-sm space-y-1">
                    <p>Tithi: {drikData?.tithi?.name} ({drikData?.tithi?.percentage}%)</p>
                    <p>Nakshatra: {drikData?.nakshatra?.name} ({drikData?.nakshatra?.percentage}%)</p>
                    <p>Yoga: {drikData?.yoga?.name}</p>
                    <p>Karana: {drikData?.karana?.name}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}