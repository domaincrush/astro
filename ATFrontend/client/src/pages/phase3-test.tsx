import { useState } from "react";
import { Button } from "src/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "src/components/ui/card";
import { Badge } from "src/components/ui/badge";

interface Phase3Status {
  success: boolean;
  data: {
    phase: number;
    status: string;
    systemMetrics: {
      totalAstrologers: number;
      availableAstrologers: number;
      overloadedAstrologers: number;
      averageWorkload: number;
      activeRules: number;
    };
    features: string[];
  };
}

interface AstrologerMatch {
  success: boolean;
  data: {
    astrologer: {
      id: number;
      name: string;
      specializations: string[];
      languages: string[];
      rating: number;
    };
    matchScore: number;
    estimatedWaitTime: number;
    workloadStatus: {
      currentConsultations: number;
      maxConcurrent: number;
      workloadPercentage: number;
      performanceScore: number;
    };
  };
}

export default function Phase3Test() {
  const [statusData, setStatusData] = useState<Phase3Status | null>(null);
  const [matchData, setMatchData] = useState<AstrologerMatch | null>(null);
  const [loading, setLoading] = useState(false);

  const testPhase3Status = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/phase3/status');
      const data = await response.json();
      setStatusData(data);
    } catch (error) {
      console.error('Error fetching Phase 3 status:', error);
    } finally {
      setLoading(false);
    }
  };

  const testAstrologerMatching = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/phase3/find-best-astrologer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          specialization: 'Vedic Astrology',
          language: 'English',
          urgency: 'high'
        }),
      });
      const data = await response.json();
      setMatchData(data);
    } catch (error) {
      console.error('Error testing astrologer matching:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Phase 3 System Testing
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Test the intelligent routing and load balancing features
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Status Test */}
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>
              Test the Phase 3 system status and metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={testPhase3Status} 
              disabled={loading}
              className="mb-4"
            >
              {loading ? 'Testing...' : 'Test System Status'}
            </Button>

            {statusData && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant={statusData.data.status === 'operational' ? 'default' : 'destructive'}>
                    Phase {statusData.data.phase}
                  </Badge>
                  <Badge variant="outline">
                    {statusData.data.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Total Astrologers</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {statusData.data.systemMetrics.totalAstrologers}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Available</p>
                    <p className="text-2xl font-bold text-green-600">
                      {statusData.data.systemMetrics.availableAstrologers}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Overloaded</p>
                    <p className="text-2xl font-bold text-red-600">
                      {statusData.data.systemMetrics.overloadedAstrologers}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Avg Workload</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {statusData.data.systemMetrics.averageWorkload}%
                    </p>
                  </div>
                </div>

                <div>
                  <p className="font-medium mb-2">Active Features:</p>
                  <div className="flex flex-wrap gap-2">
                    {statusData.data.features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Astrologer Matching Test */}
        <Card>
          <CardHeader>
            <CardTitle>Intelligent Matching</CardTitle>
            <CardDescription>
              Test the intelligent astrologer matching algorithm
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={testAstrologerMatching} 
              disabled={loading}
              className="mb-4"
            >
              {loading ? 'Finding...' : 'Find Best Astrologer'}
            </Button>

            {matchData && (
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{matchData.data.astrologer.name}</h4>
                    <Badge className="bg-green-100 text-green-800">
                      {matchData.data.matchScore}% Match
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Rating:</span> 
                      <span className="ml-2">{matchData.data.astrologer.rating}/5.0</span>
                    </div>
                    <div>
                      <span className="font-medium">Wait Time:</span> 
                      <span className="ml-2">{matchData.data.estimatedWaitTime} minutes</span>
                    </div>
                    <div>
                      <span className="font-medium">Specializations:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {matchData.data.astrologer.specializations.map((spec, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium">Languages:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {matchData.data.astrologer.languages.map((lang, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {lang}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Current Load</p>
                    <p className="text-lg font-bold text-blue-600">
                      {matchData.data.workloadStatus.currentConsultations}/{matchData.data.workloadStatus.maxConcurrent}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Performance</p>
                    <p className="text-lg font-bold text-green-600">
                      {(matchData.data.workloadStatus.performanceScore * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {(statusData || matchData) && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {statusData && (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>System Status API: Working</span>
                </div>
              )}
              {matchData && (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Astrologer Matching API: Working</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}