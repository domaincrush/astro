import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'src/components/ui/card';
import { Button } from 'src/components/ui/button';
import { Input } from 'src/components/ui/input';
import { Label } from 'src/components/ui/label';
import { Badge } from 'src/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'src/components/ui/tabs';
import { useToast } from 'src/hooks/use-toast';
import { Clock, Zap, Calculator, CheckCircle, XCircle, Users } from 'lucide-react';

interface TestResult {
  service: string;
  success: boolean;
  responseTime: number;
  data?: any;
  error?: string;
  endpoint?: string;
}

export default function TestDaemonKundli() {
  const [birthDetails, setBirthDetails] = useState({
    name: 'Test User',
    date: '1990-01-15',
    time: '10:30',
    place: 'Chennai',
    latitude: 13.0827,
    longitude: 80.2707
  });
  
  const [results, setResults] = useState<TestResult[]>([]);
  const [concurrentResults, setConcurrentResults] = useState<TestResult[]>([]);
  const { toast } = useToast();

  // Test current kundli generation system
  const testCurrentKundli = useMutation({
    mutationFn: async () => {
      const startTime = performance.now();
      const response = await fetch('/api/birth-chart/detailed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: birthDetails.name,
          date: birthDetails.date,
          time: birthDetails.time,
          place: birthDetails.place,
          latitude: birthDetails.latitude,
          longitude: birthDetails.longitude
        })
      });
      const endTime = performance.now();
      const data = await response.json();
      
      return {
        service: 'Current Kundli System',
        success: response.ok && data.success,
        responseTime: endTime - startTime,
        data: data.success ? data : null,
        error: data.success ? undefined : data.error || 'Unknown error',
        endpoint: '/api/birth-chart/detailed'
      };
    },
    onSuccess: (result) => {
      setResults(prev => [...prev, result]);
      toast({
        title: result.success ? "Current Kundli Success" : "Current Kundli Failed",
        description: `Response time: ${result.responseTime.toFixed(0)}ms`,
        variant: result.success ? "default" : "destructive"
      });
    }
  });

  // Test daemon birth chart service
  const testDaemonKundli = useMutation({
    mutationFn: async () => {
      const startTime = performance.now();
      const response = await fetch('http://localhost:8001/birth-chart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: birthDetails.name,
          year: parseInt(birthDetails.date.split('-')[0]),
          month: parseInt(birthDetails.date.split('-')[1]),
          day: parseInt(birthDetails.date.split('-')[2]),
          hour: parseInt(birthDetails.time.split(':')[0]),
          minute: parseInt(birthDetails.time.split(':')[1]),
          latitude: birthDetails.latitude,
          longitude: birthDetails.longitude
        })
      });
      const endTime = performance.now();
      const data = await response.json();
      
      return {
        service: 'Daemon Kundli Service',
        success: response.ok && data.success,
        responseTime: endTime - startTime,
        data: data.success ? data : null,
        error: data.success ? undefined : data.error || 'Service unavailable',
        endpoint: 'http://localhost:8001/birth-chart'
      };
    },
    onSuccess: (result) => {
      setResults(prev => [...prev, result]);
      toast({
        title: result.success ? "Daemon Kundli Success" : "Daemon Kundli Failed",
        description: `Response time: ${result.responseTime.toFixed(0)}ms`,
        variant: result.success ? "default" : "destructive"
      });
    }
  });

  // Test daemon panchang service
  const testDaemonPanchang = useMutation({
    mutationFn: async () => {
      const startTime = performance.now();
      const response = await fetch('http://localhost:8001/panchang', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          year: parseInt(birthDetails.date.split('-')[0]),
          month: parseInt(birthDetails.date.split('-')[1]),
          day: parseInt(birthDetails.date.split('-')[2]),
          latitude: birthDetails.latitude,
          longitude: birthDetails.longitude
        })
      });
      const endTime = performance.now();
      const data = await response.json();
      
      return {
        service: 'Daemon Panchang Service',
        success: response.ok && data.success,
        responseTime: endTime - startTime,
        data: data.success ? data : null,
        error: data.success ? undefined : data.error || 'Service unavailable',
        endpoint: 'http://localhost:8001/panchang'
      };
    },
    onSuccess: (result) => {
      setResults(prev => [...prev, result]);
      toast({
        title: result.success ? "Daemon Panchang Success" : "Daemon Panchang Failed",
        description: `Response time: ${result.responseTime.toFixed(0)}ms`,
        variant: result.success ? "default" : "destructive"
      });
    }
  });

  // Test concurrent requests
  const testConcurrentRequests = useMutation({
    mutationFn: async () => {
      const numRequests = 10;
      const requests = [];
      
      for (let i = 0; i < numRequests; i++) {
        const startTime = performance.now();
        const request = fetch('http://localhost:8001/birth-chart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: `Concurrent User ${i + 1}`,
            year: parseInt(birthDetails.date.split('-')[0]),
            month: parseInt(birthDetails.date.split('-')[1]),
            day: parseInt(birthDetails.date.split('-')[2]),
            hour: parseInt(birthDetails.time.split(':')[0]),
            minute: parseInt(birthDetails.time.split(':')[1]),
            latitude: birthDetails.latitude,
            longitude: birthDetails.longitude
          })
        }).then(async (response) => {
          const endTime = performance.now();
          const data = await response.json();
          return {
            service: `Concurrent Request ${i + 1}`,
            success: response.ok && data.success,
            responseTime: endTime - startTime,
            data: data.success ? data : null,
            error: data.success ? undefined : data.error || 'Request failed'
          };
        });
        requests.push(request);
      }
      
      const results = await Promise.all(requests);
      return results;
    },
    onSuccess: (results) => {
      setConcurrentResults(results);
      const successful = results.filter(r => r.success).length;
      const avgTime = results.reduce((sum, r) => sum + r.responseTime, 0) / results.length;
      
      toast({
        title: "Concurrent Test Complete",
        description: `${successful}/${results.length} successful, avg: ${avgTime.toFixed(0)}ms`,
        variant: successful === results.length ? "default" : "destructive"
      });
    }
  });

  const runBasicTests = () => {
    setResults([]);
    testCurrentKundli.mutate();
    testDaemonKundli.mutate();
    testDaemonPanchang.mutate();
  };

  const handleInputChange = (field: string, value: string) => {
    setBirthDetails(prev => ({ ...prev, [field]: value }));
  };

  const getPerformanceColor = (responseTime: number) => {
    if (responseTime < 200) return 'bg-green-100 text-green-800';
    if (responseTime < 1000) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const compareDataAccuracy = () => {
    const currentData = results.find(r => r.service === 'Current Kundli System')?.data;
    const daemonData = results.find(r => r.service === 'Daemon Kundli Service')?.data;
    
    if (!currentData || !daemonData) return null;
    
    const currentPositions = currentData.planetary_positions || {};
    const daemonPositions = daemonData.planetary_positions || {};
    
    const planets = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
    const comparisons = [];
    
    planets.forEach(planet => {
      const current = currentPositions[planet];
      const daemon = daemonPositions[planet];
      
      if (current && daemon) {
        const longitudeDiff = Math.abs(current.longitude - daemon.longitude);
        comparisons.push({
          planet,
          currentLongitude: current.longitude.toFixed(2),
          daemonLongitude: daemon.longitude.toFixed(2),
          difference: longitudeDiff.toFixed(4),
          currentSign: current.sign,
          daemonSign: daemon.sign,
          signsMatch: current.sign === daemon.sign
        });
      }
    });
    
    return comparisons;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Kundli Calculator Performance Test
        </h1>
        <p className="text-muted-foreground">
          Compare current kundli generation vs daemon service performance
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Test Configuration
          </CardTitle>
          <CardDescription>
            Configure birth details for kundli generation testing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={birthDetails.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={birthDetails.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={birthDetails.time}
                onChange={(e) => handleInputChange('time', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="place">Place</Label>
              <Input
                id="place"
                value={birthDetails.place}
                onChange={(e) => handleInputChange('place', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                type="number"
                step="0.0001"
                value={birthDetails.latitude}
                onChange={(e) => handleInputChange('latitude', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                type="number"
                step="0.0001"
                value={birthDetails.longitude}
                onChange={(e) => handleInputChange('longitude', e.target.value)}
              />
            </div>
          </div>
          <div className="mt-6 flex gap-4">
            <Button 
              onClick={runBasicTests}
              disabled={testCurrentKundli.isPending || testDaemonKundli.isPending}
              className="flex items-center gap-2"
            >
              <Zap className="h-4 w-4" />
              Run Basic Tests
            </Button>
            <Button 
              variant="outline"
              onClick={() => testConcurrentRequests.mutate()}
              disabled={testConcurrentRequests.isPending}
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Test Concurrent Load (10 requests)
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                setResults([]);
                setConcurrentResults([]);
              }}
            >
              Clear Results
            </Button>
          </div>
        </CardContent>
      </Card>

      {(results.length > 0 || concurrentResults.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Test Results
            </CardTitle>
            <CardDescription>
              Performance comparison and data accuracy validation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="performance">
              <TabsList>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="accuracy">Data Accuracy</TabsTrigger>
                <TabsTrigger value="concurrent">Concurrent Load</TabsTrigger>
                <TabsTrigger value="details">Raw Data</TabsTrigger>
              </TabsList>
              
              <TabsContent value="performance" className="space-y-4">
                {results.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {results.map((result, index) => (
                      <Card key={index}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-sm">{result.service}</CardTitle>
                            {result.success ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-600" />
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <Badge className={getPerformanceColor(result.responseTime)}>
                              {result.responseTime.toFixed(0)}ms
                            </Badge>
                            <p className="text-xs text-muted-foreground">{result.endpoint}</p>
                            {result.error && (
                              <p className="text-sm text-red-600">{result.error}</p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
                
                {results.length > 1 && (
                  <div className="mt-6 p-4 bg-muted rounded-lg">
                    <h3 className="font-semibold mb-2">Performance Summary</h3>
                    <div className="space-y-2">
                      {(() => {
                        const successful = results.filter(r => r.success);
                        if (successful.length < 2) return <p>Need at least 2 successful results for comparison</p>;
                        
                        const currentTime = successful.find(r => r.service === 'Current Kundli System')?.responseTime;
                        const daemonTime = successful.find(r => r.service === 'Daemon Kundli Service')?.responseTime;
                        
                        if (currentTime && daemonTime) {
                          const improvement = ((currentTime - daemonTime) / currentTime * 100);
                          return (
                            <>
                              <p>Current system: <Badge>{currentTime.toFixed(0)}ms</Badge></p>
                              <p>Daemon service: <Badge className="bg-green-100 text-green-800">{daemonTime.toFixed(0)}ms</Badge></p>
                              <p>Performance improvement: <Badge className="bg-blue-100 text-blue-800">
                                {improvement > 0 ? `${improvement.toFixed(1)}% faster` : `${Math.abs(improvement).toFixed(1)}% slower`}
                              </Badge></p>
                            </>
                          );
                        }
                        return <p>Comparing performance...</p>;
                      })()}
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="accuracy" className="space-y-4">
                {(() => {
                  const comparisons = compareDataAccuracy();
                  if (!comparisons) {
                    return <p>Need both current and daemon results for accuracy comparison</p>;
                  }
                  
                  return (
                    <div className="space-y-4">
                      <h3 className="font-semibold">Planetary Position Accuracy Comparison</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300">
                          <thead>
                            <tr className="bg-muted">
                              <th className="border border-gray-300 p-2">Planet</th>
                              <th className="border border-gray-300 p-2">Current Longitude</th>
                              <th className="border border-gray-300 p-2">Daemon Longitude</th>
                              <th className="border border-gray-300 p-2">Difference</th>
                              <th className="border border-gray-300 p-2">Signs Match</th>
                            </tr>
                          </thead>
                          <tbody>
                            {comparisons.map((comp, index) => (
                              <tr key={index}>
                                <td className="border border-gray-300 p-2 font-medium">{comp.planet}</td>
                                <td className="border border-gray-300 p-2">{comp.currentLongitude}° ({comp.currentSign})</td>
                                <td className="border border-gray-300 p-2">{comp.daemonLongitude}° ({comp.daemonSign})</td>
                                <td className="border border-gray-300 p-2">{comp.difference}°</td>
                                <td className="border border-gray-300 p-2">
                                  <Badge variant={comp.signsMatch ? "default" : "destructive"}>
                                    {comp.signsMatch ? "✓" : "✗"}
                                  </Badge>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm">
                          <strong>Accuracy Assessment:</strong> All planetary positions should match within 0.1° for astronomical accuracy.
                          Sign matches are critical for astrological interpretation.
                        </p>
                      </div>
                    </div>
                  );
                })()}
              </TabsContent>
              
              <TabsContent value="concurrent" className="space-y-4">
                {concurrentResults.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">Total Requests</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold">{concurrentResults.length}</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">Successful</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold text-green-600">
                            {concurrentResults.filter(r => r.success).length}
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">Average Time</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold">
                            {(concurrentResults.reduce((sum, r) => sum + r.responseTime, 0) / concurrentResults.length).toFixed(0)}ms
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">Success Rate</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold">
                            {((concurrentResults.filter(r => r.success).length / concurrentResults.length) * 100).toFixed(1)}%
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-semibold">Individual Request Results</h3>
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                        {concurrentResults.map((result, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Badge variant={result.success ? "default" : "destructive"} className="text-xs">
                              {index + 1}
                            </Badge>
                            <span className="text-sm">{result.responseTime.toFixed(0)}ms</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <p>Run concurrent test to see load handling performance</p>
                )}
              </TabsContent>
              
              <TabsContent value="details" className="space-y-4">
                {results.map((result, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        {result.service}
                        <Badge variant={result.success ? "default" : "destructive"}>
                          {result.success ? "Success" : "Failed"}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {result.data && (
                        <details className="space-y-2">
                          <summary className="cursor-pointer font-medium">View Response Data</summary>
                          <pre className="bg-muted p-3 rounded text-xs overflow-auto max-h-60">
                            {JSON.stringify(result.data, null, 2)}
                          </pre>
                        </details>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}