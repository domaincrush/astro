import { useState } from 'react';
import { Button } from 'src/components/ui/button';
import { Input } from 'src/components/ui/input';
import { Label } from 'src/components/ui/label';
import { Textarea } from 'src/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'src/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'src/components/ui/tabs';
import { Badge } from 'src/components/ui/badge';
import { Separator } from 'src/components/ui/separator';

interface KPChartData {
  name: string;
  chart_type: string;
  calculation_method: string;
  kp_analysis: Record<string, {
    house: number;
    nakshatra: string;
    star_lord: string;
    sub_lord: string;
  }>;
  birth_details: {
    date: string;
    time: string;
    place: string;
  };
}

interface HoraryData {
  moon_position: {
    nakshatra: string;
    star_lord: string;
    sub_lord: string;
  };
  ruling_planets: {
    day_lord: string;
  };
  interpretation: string;
}

export default function KPTestPage() {
  const [kpChart, setKpChart] = useState<KPChartData | null>(null);
  const [horaryResult, setHoraryResult] = useState<HoraryData | null>(null);
  const [nakshatraData, setNakshatraData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [chartForm, setChartForm] = useState({
    name: 'KP Test Person',
    date: '1990-05-15',
    time: '14:30',
    place: 'Chennai, India'
  });

  const [horaryQuestion, setHoraryQuestion] = useState('Will I get the promotion this year?');

  const testKPChart = async () => {
    setLoading(true);
    setError('');
    try {
      // Parse birth details
      const [year, month, day] = chartForm.date.split('-').map(Number);
      const [hour, minute] = chartForm.time.split(':').map(Number);
      
      const response = await fetch('/api/kp/kp-chart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          birth_year: year,
          birth_month: month,
          birth_day: day,
          birth_hour: hour,
          birth_minute: minute,
          latitude: 13.0827, // Chennai coordinates
          longitude: 80.2707
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setKpChart(data.data || data);
    } catch (err: any) {
      setError(`KP Chart Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testHorary = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/kp/kp-horary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: horaryQuestion,
          query_time: new Date().toISOString(),
          latitude: 13.0827, // Chennai coordinates
          longitude: 80.2707
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setHoraryResult(data.data || data);
    } catch (err: any) {
      setError(`Horary Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testNakshatraData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/kp/kp-nakshatras');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setNakshatraData(data.data?.nakshatras || data.nakshatras || data);
    } catch (err: any) {
      setError(`Nakshatra Data Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testServerHealth = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/kp/health');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setError(`Server Status: ${data.status} - ${data.service}`);
    } catch (err: any) {
      setError(`Server Health Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">KP Astrology Engine Test Interface</h1>
        <p className="text-gray-600">
          Test the Krishnamurti Paddhati (KP) astrology system with 249 sub-divisions and advanced stellar analysis
        </p>
      </div>

      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      <div className="mb-6">
        <Button onClick={testServerHealth} variant="outline" disabled={loading}>
          {loading ? 'Testing...' : 'Test Server Health'}
        </Button>
      </div>

      <Tabs defaultValue="chart" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="chart">KP Birth Chart</TabsTrigger>
          <TabsTrigger value="horary">Horary Analysis</TabsTrigger>
          <TabsTrigger value="nakshatra">Nakshatra Data</TabsTrigger>
        </TabsList>

        <TabsContent value="chart" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>KP Birth Chart Generation</CardTitle>
              <CardDescription>
                Generate a birth chart using KP methodology with 249 sub-divisions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={chartForm.name}
                    onChange={(e) => setChartForm(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="place">Place</Label>
                  <Input
                    id="place"
                    value={chartForm.place}
                    onChange={(e) => setChartForm(prev => ({ ...prev, place: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="date">Date (YYYY-MM-DD)</Label>
                  <Input
                    id="date"
                    type="date"
                    value={chartForm.date}
                    onChange={(e) => setChartForm(prev => ({ ...prev, date: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="time">Time (HH:MM)</Label>
                  <Input
                    id="time"
                    type="time"
                    value={chartForm.time}
                    onChange={(e) => setChartForm(prev => ({ ...prev, time: e.target.value }))}
                  />
                </div>
              </div>
              <Button onClick={testKPChart} disabled={loading} className="w-full">
                {loading ? 'Generating Chart...' : 'Generate KP Chart'}
              </Button>
            </CardContent>
          </Card>

          {kpChart && (
            <Card>
              <CardHeader>
                <CardTitle>KP Chart Results</CardTitle>
                <div className="flex gap-2">
                  <Badge variant="secondary">{kpChart.chart_type}</Badge>
                  <Badge variant="outline">{kpChart.calculation_method}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Birth Details</h3>
                    <p>Name: {kpChart.name}</p>
                    <p>Date: {kpChart.birth_details?.date}</p>
                    <p>Time: {kpChart.birth_details?.time}</p>
                    <p>Place: {kpChart.birth_details?.place}</p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-semibold mb-3">KP Planetary Analysis</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">Planet</th>
                            <th className="text-left p-2">House</th>
                            <th className="text-left p-2">Nakshatra</th>
                            <th className="text-left p-2">Star Lord</th>
                            <th className="text-left p-2">Sub Lord</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(kpChart.kp_analysis || {}).map(([planet, data]) => (
                            <tr key={planet} className="border-b">
                              <td className="p-2 font-medium">{planet}</td>
                              <td className="p-2">{data.house}</td>
                              <td className="p-2">{data.nakshatra}</td>
                              <td className="p-2">{data.star_lord}</td>
                              <td className="p-2">{data.sub_lord}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="horary" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>KP Horary Analysis</CardTitle>
              <CardDescription>
                Ask specific yes/no questions using KP stellar methodology
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="question">Your Question</Label>
                <Textarea
                  id="question"
                  value={horaryQuestion}
                  onChange={(e) => setHoraryQuestion(e.target.value)}
                  placeholder="Enter your specific question..."
                  rows={3}
                />
              </div>
              <Button onClick={testHorary} disabled={loading} className="w-full">
                {loading ? 'Analyzing...' : 'Analyze Question'}
              </Button>
            </CardContent>
          </Card>

          {horaryResult && (
            <Card>
              <CardHeader>
                <CardTitle>Horary Analysis Results</CardTitle>
                <CardDescription>KP-based interpretation for your question</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Question</h3>
                  <p className="text-gray-700">{horaryQuestion}</p>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Moon Position</h4>
                    <p>Nakshatra: <span className="font-medium">{horaryResult.moon_position?.nakshatra}</span></p>
                    <p>Star Lord: <span className="font-medium">{horaryResult.moon_position?.star_lord}</span></p>
                    <p>Sub Lord: <span className="font-medium">{horaryResult.moon_position?.sub_lord}</span></p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Ruling Planets</h4>
                    <p>Day Lord: <span className="font-medium">{horaryResult.ruling_planets?.day_lord}</span></p>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-medium mb-2">KP Interpretation</h4>
                  <p className="text-gray-700">{horaryResult.interpretation}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="nakshatra" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Nakshatra Reference Data</CardTitle>
              <CardDescription>
                Complete nakshatra information with KP attributes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={testNakshatraData} disabled={loading} className="mb-4">
                {loading ? 'Loading...' : 'Load Nakshatra Data'}
              </Button>
              
              {nakshatraData.length > 0 && (
                <div className="grid gap-4">
                  {nakshatraData.slice(0, 6).map((nakshatra, index) => (
                    <Card key={index} className="p-4">
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p><strong>Name:</strong> {nakshatra.name}</p>
                          <p><strong>Pada:</strong> {nakshatra.pada}</p>
                        </div>
                        <div>
                          <p><strong>Star Lord:</strong> {nakshatra.star_lord}</p>
                          <p><strong>Deity:</strong> {nakshatra.deity}</p>
                        </div>
                        <div>
                          <p><strong>Symbol:</strong> {nakshatra.symbol}</p>
                          <p><strong>Nature:</strong> {nakshatra.nature}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                  {nakshatraData.length > 6 && (
                    <p className="text-sm text-gray-500">
                      Showing first 6 of {nakshatraData.length} nakshatras
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>KP System Advantages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Precision Features</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• 249 sub-divisions vs traditional 108</li>
                <li>• Minute/hour level timing accuracy</li>
                <li>• Sub-lord analysis for each planet</li>
                <li>• Stellar-based horary methodology</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Practical Benefits</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Specific yes/no answers</li>
                <li>• Enhanced event timing predictions</li>
                <li>• Reduced prediction ambiguity</li>
                <li>• Scientific stellar approach</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}