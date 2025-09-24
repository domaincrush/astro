import { useState } from 'react';
import { Button } from 'src/components/ui/button';
import { Input } from 'src/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from 'src/components/ui/card';
import { Badge } from 'src/components/ui/badge';
import { Clock, Zap, Database, Activity } from 'lucide-react';

export default function TestDaemonPremium() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [responseTime, setResponseTime] = useState<number>(0);

  const [formData, setFormData] = useState({
    name: 'Mohan Kumar',
    date: '1980-09-09',
    time: '19:15',
    location: 'Chennai, Tamil Nadu, India',
    latitude: '13.0827',
    longitude: '80.2707'
  });

  const handleDaemonTest = async () => {
    setIsLoading(true);
    setError('');
    setResult(null);
    
    const startTime = Date.now();
    
    try {
      const response = await fetch('/api/daemon/premium-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const endTime = Date.now();
      setResponseTime(endTime - startTime);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHealthCheck = async () => {
    try {
      const response = await fetch('/api/daemon/health');
      const data = await response.json();
      setResult({ health_check: true, ...data });
    } catch (err: any) {
      setError(`Health check failed: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🚀 Jyotisha Daemon Performance Test
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Test the high-performance Jyotisha daemon service with authentic astronomical calculations
          </p>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {responseTime > 0 ? `${responseTime}ms` : '—'}
              </div>
              <div className="text-sm text-gray-600">Response Time</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Zap className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {responseTime > 0 && responseTime < 3000 ? '⚡ Fast' : responseTime > 0 ? '⏱️ Normal' : '—'}
              </div>
              <div className="text-sm text-gray-600">Performance</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Database className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">Swiss</div>
              <div className="text-sm text-gray-600">Ephemeris</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Activity className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {result ? '✅ Active' : '⏸️ Ready'}
              </div>
              <div className="text-sm text-gray-600">Service Status</div>
            </CardContent>
          </Card>
        </div>

        {/* Test Form */}
        <Card>
          <CardHeader>
            <CardTitle>Test Parameters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Date</label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Time</label>
                <Input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Latitude</label>
                <Input
                  value={formData.latitude}
                  onChange={(e) => setFormData({...formData, latitude: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Longitude</label>
                <Input
                  value={formData.longitude}
                  onChange={(e) => setFormData({...formData, longitude: e.target.value})}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button 
                onClick={handleDaemonTest} 
                disabled={isLoading}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {isLoading ? 'Testing Daemon...' : '🚀 Test Premium Report'}
              </Button>
              <Button 
                onClick={handleHealthCheck} 
                variant="outline"
              >
                🏥 Health Check
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-700">❌ Error</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-red-600 text-sm">{error}</pre>
            </CardContent>
          </Card>
        )}

        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                ✅ Daemon Service Results
                <Badge variant="secondary">{responseTime}ms</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {result.birth_chart && (
                  <div>
                    <h3 className="font-semibold mb-2">🎯 Birth Chart Data</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <strong>Method:</strong> {result.birth_chart.calculation_method}
                        </div>
                        <div>
                          <strong>Date:</strong> {result.birth_chart.birth_details?.date}
                        </div>
                        <div>
                          <strong>Time:</strong> {result.birth_chart.birth_details?.time}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {result.birth_chart?.planetary_positions && (
                  <div>
                    <h3 className="font-semibold mb-2">🪐 Planetary Positions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {Object.entries(result.birth_chart.planetary_positions).map(([planet, data]: [string, any]) => (
                        <div key={planet} className="bg-purple-50 p-3 rounded-lg">
                          <div className="font-medium text-purple-900">{planet}</div>
                          <div className="text-sm text-purple-700">
                            <div>Sign: {data.sign}</div>
                            <div>House: {data.house}</div>
                            <div>Degree: {data.degree?.toFixed(2)}°</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {result.performance_metrics && (
                  <div>
                    <h3 className="font-semibold mb-2">⚡ Performance Metrics</h3>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <strong>Response Time:</strong> {result.performance_metrics.response_time_ms}ms
                        </div>
                        <div>
                          <strong>Method:</strong> {result.performance_metrics.calculation_method}
                        </div>
                        <div>
                          <strong>Memory Efficient:</strong> {result.performance_metrics.memory_efficient ? '✅ Yes' : '❌ No'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {result.daemon_available !== undefined && (
                  <div>
                    <h3 className="font-semibold mb-2">🏥 Health Status</h3>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-sm">
                        <div><strong>Status:</strong> {result.daemon_available ? '✅ Available' : '❌ Unavailable'}</div>
                        <div><strong>Message:</strong> {result.message}</div>
                        <div><strong>Timestamp:</strong> {result.timestamp}</div>
                      </div>
                    </div>
                  </div>
                )}

                <details className="mt-4">
                  <summary className="cursor-pointer font-medium text-gray-700 hover:text-gray-900">
                    🔍 View Raw Response
                  </summary>
                  <pre className="mt-2 p-4 bg-gray-50 rounded-lg text-xs overflow-auto">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </details>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}