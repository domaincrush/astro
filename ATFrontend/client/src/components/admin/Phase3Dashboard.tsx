import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "src/components/ui/card";
import { Badge } from "src/components/ui/badge";
import { Button } from "src/components/ui/button";
import { Progress } from "src/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "src/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "src/components/ui/table";
import { Brain, Activity, Target, Users, TrendingUp, Settings, RefreshCw, AlertTriangle } from 'lucide-react';
import { toast } from "src/hooks/use-toast";

interface Phase3SystemMetrics {
  totalAstrologers: number;
  availableAstrologers: number;
  overloadedAstrologers: number;
  averageWorkload: number;
  activeRules: number;
}

interface AstrologerWorkload {
  id: number;
  astrologerId: number;
  currentConsultations: number;
  maxConcurrent: number;
  averageResponseTime: number;
  performanceScore: number;
  workloadPercentage: number;
  lastActivity: string;
  isAcceptingNew: boolean;
  breakUntil: string | null;
}

interface SmartRoutingRule {
  id: number;
  ruleName: string;
  conditions: any;
  routingLogic: any;
  weight: number;
  isActive: boolean;
  successRate: number;
  totalApplications: number;
}

export const Phase3Dashboard: React.FC = () => {
  const [isRebalancing, setIsRebalancing] = useState(false);

  // Fetch Phase 3 system status
  const { data: systemStatus, isLoading: statusLoading, refetch: refetchStatus } = useQuery({
    queryKey: ['phase3-status'],
    queryFn: async () => {
      const response = await fetch('/api/phase3/status');
      if (!response.ok) throw new Error('Failed to fetch system status');
      return response.json();
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // Fetch workload data
  const { data: workloadsData, isLoading: workloadsLoading, refetch: refetchWorkloads } = useQuery({
    queryKey: ['phase3-workloads'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/phase3/workloads', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch workloads');
      return response.json();
    },
    refetchInterval: 15000 // Refresh every 15 seconds
  });

  // Fetch smart routing rules
  const { data: rulesData, isLoading: rulesLoading, refetch: refetchRules } = useQuery({
    queryKey: ['phase3-smart-rules'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/phase3/smart-rules', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch smart rules');
      return response.json();
    }
  });

  const systemMetrics: Phase3SystemMetrics = systemStatus?.data?.systemMetrics || {
    totalAstrologers: 0,
    availableAstrologers: 0,
    overloadedAstrologers: 0,
    averageWorkload: 0,
    activeRules: 0
  };

  const workloads: AstrologerWorkload[] = workloadsData?.data || [];
  const smartRules: SmartRoutingRule[] = rulesData?.data || [];

  const handleRebalance = async () => {
    setIsRebalancing(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/phase3/rebalance', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        toast({
          title: "Workload Rebalancing Completed",
          description: "System workload has been successfully rebalanced.",
          variant: "default"
        });
        refetchWorkloads();
        refetchStatus();
      } else {
        throw new Error('Rebalancing failed');
      }
    } catch (error) {
      toast({
        title: "Rebalancing Failed",
        description: "Failed to rebalance system workload. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsRebalancing(false);
    }
  };

  const getWorkloadStatusColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getPerformanceBadgeVariant = (score: number) => {
    if (score >= 0.9) return 'default';
    if (score >= 0.7) return 'secondary';
    return 'destructive';
  };

  if (statusLoading || workloadsLoading || rulesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading Phase 3 Dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Phase 3: Intelligent Routing</h1>
          <p className="text-muted-foreground">
            Advanced load balancing and smart astrologer matching system
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              refetchStatus();
              refetchWorkloads();
              refetchRules();
            }}
            variant="outline"
            size="sm"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button
            onClick={handleRebalance}
            disabled={isRebalancing}
            size="sm"
          >
            {isRebalancing ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Activity className="h-4 w-4 mr-2" />
            )}
            Rebalance
          </Button>
        </div>
      </div>

      {/* System Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Astrologers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.totalAstrologers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Now</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{systemMetrics.availableAstrologers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overloaded</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{systemMetrics.overloadedAstrologers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Workload</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.averageWorkload}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Rules</CardTitle>
            <Brain className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{systemMetrics.activeRules}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for detailed views */}
      <Tabs defaultValue="workloads" className="space-y-4">
        <TabsList>
          <TabsTrigger value="workloads">Workload Monitor</TabsTrigger>
          <TabsTrigger value="rules">Smart Rules</TabsTrigger>
          <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="workloads" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Astrologer Workload Distribution</CardTitle>
              <CardDescription>
                Real-time monitoring of astrologer capacity and performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Astrologer ID</TableHead>
                    <TableHead>Current Load</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Workload %</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Response Time</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workloads.map((workload) => (
                    <TableRow key={workload.id}>
                      <TableCell className="font-medium">#{workload.astrologerId}</TableCell>
                      <TableCell>
                        {workload.currentConsultations}/{workload.maxConcurrent}
                      </TableCell>
                      <TableCell>
                        <Progress 
                          value={(workload.currentConsultations / workload.maxConcurrent) * 100} 
                          className="w-16"
                        />
                      </TableCell>
                      <TableCell className={getWorkloadStatusColor(parseFloat(workload.workloadPercentage.toString()))}>
                        {parseFloat(workload.workloadPercentage.toString()).toFixed(1)}%
                      </TableCell>
                      <TableCell>
                        <Badge variant={getPerformanceBadgeVariant(parseFloat(workload.performanceScore.toString()))}>
                          {(parseFloat(workload.performanceScore.toString()) * 100).toFixed(0)}%
                        </Badge>
                      </TableCell>
                      <TableCell>{workload.averageResponseTime}s</TableCell>
                      <TableCell>
                        <Badge variant={workload.isAcceptingNew ? "default" : "secondary"}>
                          {workload.isAcceptingNew ? "Available" : "Busy"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Smart Routing Rules</CardTitle>
              <CardDescription>
                Intelligent matching rules for optimal astrologer assignment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rule Name</TableHead>
                    <TableHead>Weight</TableHead>
                    <TableHead>Success Rate</TableHead>
                    <TableHead>Applications</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {smartRules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell className="font-medium">{rule.ruleName}</TableCell>
                      <TableCell>{rule.weight}</TableCell>
                      <TableCell>{parseFloat(rule.successRate.toString()).toFixed(1)}%</TableCell>
                      <TableCell>{rule.totalApplications}</TableCell>
                      <TableCell>
                        <Badge variant={rule.isActive ? "default" : "secondary"}>
                          {rule.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Analytics</CardTitle>
              <CardDescription>
                System performance metrics and optimization insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">System Efficiency</h4>
                  <Progress value={((systemMetrics.availableAstrologers / systemMetrics.totalAstrologers) * 100)} />
                  <p className="text-xs text-muted-foreground">
                    {((systemMetrics.availableAstrologers / systemMetrics.totalAstrologers) * 100).toFixed(1)}% of astrologers available
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Load Distribution</h4>
                  <Progress value={systemMetrics.averageWorkload} />
                  <p className="text-xs text-muted-foreground">
                    Average system workload: {systemMetrics.averageWorkload}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};