import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'src/components/ui/card';
import { Button } from 'src/components/ui/button';
import { Input } from 'src/components/ui/input';
import { Label } from 'src/components/ui/label';
import { apiRequest } from 'src/lib/queryClient';
import { Loader2 } from 'lucide-react';
import AstroTickHeader from 'src/components/layout/AstroTickHeader';

interface JyotishyamResult {
  success: boolean;
  chart_data: {
    lagna_ascendant: any;
    birth_data: any;
    D1?: any;
    svg_chart?: string;
    svg_error?: string;
  };
  message?: string;
  error?: string;
}

export default function TestJyotishyam() {
  const [formData, setFormData] = useState({
    name: 'Mohan',
    date: '1980-09-09',
    time: '19:15:00',
    latitude: 13.0827,
    longitude: 80.2707,
    place: 'Chennai, India'
  });

  const jyotishyamMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch('/api/test/jyotishyam', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json() as JyotishyamResult;
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    jyotishyamMutation.mutate(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-indigo-900">
      <AstroTickHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                Jyotishyam Library Test
              </CardTitle>
              <CardDescription className="text-center">
                Test the integrated jyotishyam library for Vedic astrology calculations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="place">Place</Label>
                  <Input
                    id="place"
                    value={formData.place}
                    onChange={(e) => handleInputChange('place', e.target.value)}
                    placeholder="Enter place"
                  />
                </div>
                
                <div>
                  <Label htmlFor="date">Date of Birth</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="time">Time of Birth</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={(e) => handleInputChange('latitude', e.target.value)}
                    placeholder="Enter latitude"
                  />
                </div>
                
                <div>
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={(e) => handleInputChange('longitude', e.target.value)}
                    placeholder="Enter longitude"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={jyotishyamMutation.isPending}
                  >
                    {jyotishyamMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Testing Jyotishyam...
                      </>
                    ) : (
                      'Test Jyotishyam Library'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Results Section */}
          {jyotishyamMutation.data && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Jyotishyam Test Results
                  {jyotishyamMutation.data.success ? (
                    <span className="text-green-600">✓ Success</span>
                  ) : (
                    <span className="text-red-600">✗ Error</span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {jyotishyamMutation.data.success ? (
                  <div className="space-y-6">
                    {/* Birth Data */}
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Birth Data</h3>
                      <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
                        {JSON.stringify(jyotishyamMutation.data.chart_data.birth_data, null, 2)}
                      </pre>
                    </div>

                    {/* Lagna Ascendant */}
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Lagna/Ascendant</h3>
                      <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
                        {JSON.stringify(jyotishyamMutation.data.chart_data.lagna_ascendant, null, 2)}
                      </pre>
                    </div>

                    {/* D1 Chart Data */}
                    {jyotishyamMutation.data.chart_data.D1 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-2">D1 Chart Data</h3>
                        <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm max-h-64">
                          {JSON.stringify(jyotishyamMutation.data.chart_data.D1, null, 2)}
                        </pre>
                      </div>
                    )}

                    {/* Custom North Indian Chart */}
                    {jyotishyamMutation.data.chart_data.custom_north_indian_chart && (
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Custom North Indian Chart</h3>
                        <div className="border rounded-lg p-4 bg-white">
                          <div 
                            dangerouslySetInnerHTML={{ 
                              __html: jyotishyamMutation.data.chart_data.custom_north_indian_chart 
                            }}
                            className="flex justify-center"
                          />
                        </div>
                      </div>
                    )}

                    {/* Jyotishyam SVG Chart */}
                    {jyotishyamMutation.data.chart_data.jyotishyam_svg_chart && (
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Jyotishyam Generated Chart</h3>
                        <div className="border rounded-lg p-4 bg-white">
                          <img 
                            src={jyotishyamMutation.data.chart_data.jyotishyam_svg_chart}
                            alt="Jyotishyam Generated Chart"
                            className="max-w-full h-auto mx-auto"
                          />
                        </div>
                      </div>
                    )}

                    {/* Legacy SVG Chart */}
                    {jyotishyamMutation.data.chart_data.svg_chart && (
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Legacy Generated Chart</h3>
                        <div className="border rounded-lg p-4 bg-white">
                          <img 
                            src={jyotishyamMutation.data.chart_data.svg_chart}
                            alt="Legacy Chart"
                            className="max-w-full h-auto mx-auto"
                          />
                        </div>
                      </div>
                    )}

                    {/* SVG Error */}
                    {jyotishyamMutation.data.chart_data.svg_error && (
                      <div>
                        <h3 className="text-lg font-semibold mb-2 text-orange-600">SVG Generation Error</h3>
                        <pre className="bg-orange-100 p-4 rounded-lg overflow-auto text-sm">
                          {jyotishyamMutation.data.chart_data.svg_error}
                        </pre>
                      </div>
                    )}

                    {/* Success Message */}
                    {jyotishyamMutation.data.message && (
                      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                        {jyotishyamMutation.data.message}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <strong>Error:</strong> {jyotishyamMutation.data.error}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Error handling */}
          {jyotishyamMutation.error && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-red-600">Request Error</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-red-100 p-4 rounded-lg overflow-auto text-sm">
                  {jyotishyamMutation.error instanceof Error 
                    ? jyotishyamMutation.error.message 
                    : String(jyotishyamMutation.error)}
                </pre>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}