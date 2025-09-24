import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { Badge } from "src/components/ui/badge";
import { Progress } from "src/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "src/components/ui/tabs";
import { Input } from "src/components/ui/input";
import { Label } from "src/components/ui/label";
import { CheckCircle, AlertCircle, XCircle, Target, BookOpen, Eye } from "lucide-react";
import { SEOAnalyzer as SEOAnalyzerLib, SEOAnalysis, SEOCheck, ReadabilityCheck } from "src/lib/seoAnalyzer";

interface SEOAnalyzerProps {
  title: string;
  content: string;
  metaDescription: string;
  slug: string;
  onFocusKeywordChange?: (keyword: string) => void;
}

export default function SEOAnalyzer({ 
  title, 
  content, 
  metaDescription, 
  slug,
  onFocusKeywordChange 
}: SEOAnalyzerProps) {
  const [focusKeyword, setFocusKeyword] = useState("");
  const [analysis, setAnalysis] = useState<SEOAnalysis | null>(null);

  useEffect(() => {
    if (title && content && focusKeyword) {
      const analyzer = new SEOAnalyzerLib({
        title,
        content,
        metaDescription,
        slug,
        focusKeyword
      });
      
      const result = analyzer.analyze();
      setAnalysis(result);
    }
  }, [title, content, metaDescription, slug, focusKeyword]);

  const handleFocusKeywordChange = (keyword: string) => {
    setFocusKeyword(keyword);
    onFocusKeywordChange?.(keyword);
  };

  const getStatusIcon = (status: 'good' | 'ok' | 'bad') => {
    switch (status) {
      case 'good':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'ok':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'bad':
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          SEO Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Focus Keyword Input */}
        <div className="space-y-2">
          <Label htmlFor="focus-keyword">Focus Keyword</Label>
          <Input
            id="focus-keyword"
            placeholder="Enter your focus keyword..."
            value={focusKeyword}
            onChange={(e) => handleFocusKeywordChange(e.target.value)}
          />
          <p className="text-sm text-gray-500">
            Enter the main keyword you want this article to rank for
          </p>
        </div>

        {analysis && (
          <>
            {/* Score Overview */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">SEO Score</span>
                  <span className={`text-2xl font-bold ${getScoreColor(analysis.score)}`}>
                    {analysis.score}/100
                  </span>
                </div>
                <Progress value={analysis.score} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Readability</span>
                  <span className={`text-2xl font-bold ${getScoreColor(analysis.readabilityScore)}`}>
                    {Math.round(analysis.readabilityScore)}/100
                  </span>
                </div>
                <Progress value={analysis.readabilityScore} className="h-2" />
              </div>
            </div>

            {/* Detailed Analysis */}
            <Tabs defaultValue="seo" className="w-full">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="seo" className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  SEO Analysis
                </TabsTrigger>
                <TabsTrigger value="readability" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Readability
                </TabsTrigger>
              </TabsList>

              <TabsContent value="seo" className="space-y-3 mt-4">
                {analysis.checks.map((check) => (
                  <SEOCheckItem key={check.id} check={check} />
                ))}
              </TabsContent>

              <TabsContent value="readability" className="space-y-3 mt-4">
                {analysis.readabilityChecks.map((check) => (
                  <ReadabilityCheckItem key={check.id} check={check} />
                ))}
              </TabsContent>
            </Tabs>
          </>
        )}

        {!focusKeyword && (
          <div className="text-center py-8 text-gray-500">
            <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Enter a focus keyword to start SEO analysis</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function SEOCheckItem({ check }: { check: SEOCheck }) {
  const getStatusIcon = (status: 'good' | 'ok' | 'bad') => {
    switch (status) {
      case 'good':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'ok':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'bad':
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getImpactBadge = (impact: 'high' | 'medium' | 'low') => {
    const colors = {
      high: "bg-red-100 text-red-800",
      medium: "bg-yellow-100 text-yellow-800", 
      low: "bg-gray-100 text-gray-800"
    };
    
    return (
      <Badge variant="secondary" className={colors[impact]}>
        {impact}
      </Badge>
    );
  };

  return (
    <div className="flex items-start gap-3 p-3 border rounded-lg">
      {getStatusIcon(check.status)}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-medium text-sm">{check.title}</h4>
          {getImpactBadge(check.impact)}
        </div>
        <p className="text-sm text-gray-600">{check.message}</p>
      </div>
    </div>
  );
}

function ReadabilityCheckItem({ check }: { check: ReadabilityCheck }) {
  const getStatusIcon = (status: 'good' | 'ok' | 'bad') => {
    switch (status) {
      case 'good':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'ok':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'bad':
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  return (
    <div className="flex items-start gap-3 p-3 border rounded-lg">
      {getStatusIcon(check.status)}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h4 className="font-medium text-sm">{check.title}</h4>
          {check.value && (
            <span className="text-xs text-gray-500">
              {check.value.toFixed(1)}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600">{check.message}</p>
      </div>
    </div>
  );
}