import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "src/components/ui/card";
import { Badge } from "src/components/ui/badge";
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import { Label } from "src/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "src/components/ui/select";
import { CheckCircle, XCircle, Brain, Target, Users, Activity, AlertCircle, RefreshCw } from 'lucide-react';
import { toast } from "src/hooks/use-toast";

interface ValidationResult {
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
}

interface IntelligentMatch {
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
}

export const Phase3ValidationPage: React.FC = () => {
  const [testPreferences, setTestPreferences] = useState({
    languages: ['Hindi', 'English'],
    specializations: ['Vedic Astrology'],
    maxWaitTime: 300,
    priorityLevel: 'normal' as 'normal' | 'high' | 'urgent'
  });
  const [matchResult, setMatchResult] = useState<IntelligentMatch | null>(null);
  const [isTestingMatch, setIsTestingMatch] = useState(false);

  // Fetch Phase 3 system status
  const { data: validationData, isLoading, refetch } = useQuery({
    queryKey: ['phase3-validation'],
    queryFn: async () => {
      const response = await fetch('/api/phase3/status');
      if (!response.ok) throw new Error('Phase 3 validation failed');
      return response.json();
    },
    refetchInterval: 30000
  });

  const systemStatus: ValidationResult = validationData?.data || {
    phase: 3,
    status: 'unknown',
    systemMetrics: {
      totalAstrologers: 0,
      availableAstrologers: 0,
      overloadedAstrologers: 0,
      averageWorkload: 0,
      activeRules: 0
    },
    features: []
  };

  const testIntelligentMatching = async () => {
    setIsTestingMatch(true);
    try {
      const response = await fetch('/api/phase3/find-best-astrologer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testPreferences)
      });

      if (response.ok) {
        const result = await response.json();
        setMatchResult(result.data);
        toast({
          title: "Intelligent Matching Test Successful",
          description: `Found astrologer with ${result.data.matchScore.toFixed(1)}% match score`,
          variant: "default"
        });
      } else {
        const error = await response.json();
        toast({
          title: "Matching Test Failed",
          description: error.message || "No suitable astrologer found",
          variant: "destructive"
        });
        setMatchResult(null);
      }
    } catch (error) {
      console.error("Error testing intelligent matching:", error);
      toast({
        title: "Test Error",
        description: "Failed to test intelligent matching system",
        variant: "destructive"
      });
    } finally {
      setIsTestingMatch(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case 'degraded':
        return <AlertCircle className="h-6 w-6 text-yellow-600" />;
      default:
        return <XCircle className="h-6 w-6 text-red-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'text-green-600';
      case 'degraded': return 'text-yellow-600';
      default: return 'text-red-600';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Validating Phase 3 System...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Brain className="h-8 w-8 text-blue-600" />
            Phase 3 System Validation
          </h1>
          <p className="text-muted-foreground">
            Comprehensive validation of intelligent routing and load balancing features
          </p>
        </div>
        <Button onClick={() => refetch()} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Status
        </Button>
      </div>

      {/* System Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getStatusIcon(systemStatus.status)}
            Phase 3 System Status
          </CardTitle>
          <CardDescription>
            Current operational status of the intelligent routing system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium">Status:</span>
                <Badge variant={systemStatus.status === 'operational' ? 'default' : 'destructive'}>
                  {systemStatus.status.toUpperCase()}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                Phase {systemStatus.phase} intelligent routing system
              </div>
            </div>
            <div>
              <div className="space-y-1">
                <div className="text-sm">System Load: {systemStatus.systemMetrics.averageWorkload}%</div>
                <div className="text-sm">Available Astrologers: {systemStatus.systemMetrics.availableAstrologers}/{systemStatus.systemMetrics.totalAstrologers}</div>
                <div className="text-sm">Active Rules: {systemStatus.systemMetrics.activeRules}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Astrologers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStatus.systemMetrics.totalAstrologers}</div>
            <p className="text-xs text-muted-foreground">
              Managed by system
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Now</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{systemStatus.systemMetrics.availableAstrologers}</div>
            <p className="text-xs text-muted-foreground">
              Ready for consultations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overloaded</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{systemStatus.systemMetrics.overloadedAstrologers}</div>
            <p className="text-xs text-muted-foreground">
              Above 80% capacity
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Smart Rules</CardTitle>
            <Brain className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{systemStatus.systemMetrics.activeRules}</div>
            <p className="text-xs text-muted-foreground">
              Active routing rules
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Features Validation */}
      <Card>
        <CardHeader>
          <CardTitle>Phase 3 Features Validation</CardTitle>
          <CardDescription>
            All implemented intelligent routing capabilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2">
            {systemStatus.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Intelligent Matching Test */}
      <Card>
        <CardHeader>
          <CardTitle>Intelligent Matching Test</CardTitle>
          <CardDescription>
            Test the smart astrologer matching algorithm with custom preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <Label>Languages (comma-separated)</Label>
                <Input
                  value={testPreferences.languages.join(', ')}
                  onChange={(e) => setTestPreferences(prev => ({
                    ...prev,
                    languages: e.target.value.split(',').map(l => l.trim()).filter(l => l)
                  }))}
                  placeholder="Hindi, English, Tamil"
                />
              </div>
              <div>
                <Label>Specializations (comma-separated)</Label>
                <Input
                  value={testPreferences.specializations.join(', ')}
                  onChange={(e) => setTestPreferences(prev => ({
                    ...prev,
                    specializations: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                  }))}
                  placeholder="Vedic Astrology, KP Astrology"
                />
              </div>
              <div>
                <Label>Max Wait Time (seconds)</Label>
                <Input
                  type="number"
                  value={testPreferences.maxWaitTime}
                  onChange={(e) => setTestPreferences(prev => ({
                    ...prev,
                    maxWaitTime: parseInt(e.target.value) || 300
                  }))}
                />
              </div>
              <div>
                <Label>Priority Level</Label>
                <Select 
                  value={testPreferences.priorityLevel} 
                  onValueChange={(value: any) => setTestPreferences(prev => ({
                    ...prev,
                    priorityLevel: value
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={testIntelligentMatching} 
                disabled={isTestingMatch}
                className="w-full"
              >
                {isTestingMatch ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <Target className="h-4 w-4 mr-2" />
                    Test Intelligent Matching
                  </>
                )}
              </Button>
            </div>

            {matchResult && (
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-green-50">
                  <h4 className="font-medium text-green-800 mb-2">Match Found!</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Astrologer:</strong> {matchResult.astrologer.name}</div>
                    <div><strong>Match Score:</strong> {matchResult.matchScore.toFixed(1)}%</div>
                    <div><strong>Rating:</strong> {matchResult.astrologer.rating}/5</div>
                    <div><strong>Wait Time:</strong> {matchResult.estimatedWaitTime} seconds</div>
                    <div><strong>Current Load:</strong> {matchResult.workloadStatus.currentConsultations}/{matchResult.workloadStatus.maxConcurrent}</div>
                    <div><strong>Workload:</strong> {parseFloat(matchResult.workloadStatus.workloadPercentage.toString()).toFixed(1)}%</div>
                    <div><strong>Performance:</strong> {(parseFloat(matchResult.workloadStatus.performanceScore.toString()) * 100).toFixed(0)}%</div>
                    <div><strong>Languages:</strong> {matchResult.astrologer.languages.join(', ')}</div>
                    <div><strong>Specializations:</strong> {matchResult.astrologer.specializations.join(', ')}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};