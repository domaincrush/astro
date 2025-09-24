import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from 'src/components/ui/card';
import { Button } from 'src/components/ui/button';
import { Input } from 'src/components/ui/input';
import { Textarea } from 'src/components/ui/textarea';
import { Badge } from 'src/components/ui/badge';
import { useToast } from 'src/hooks/use-toast';
import { Search, Upload, Globe, BarChart3, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface BingSubmissionResult {
  success: boolean;
  message: string;
  details?: {
    submittedUrls?: string[];
    quota?: {
      used: number;
      remaining: number;
      quota: number;
    };
  };
}

const BingIndexingManager: React.FC = () => {
  const [singleUrl, setSingleUrl] = useState('');
  const [bulkUrls, setBulkUrls] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quotaInfo, setQuotaInfo] = useState<any>(null);
  const [submissionHistory, setSubmissionHistory] = useState<BingSubmissionResult[]>([]);
  const { toast } = useToast();

  const handleSingleSubmission = async () => {
    if (!singleUrl.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a URL to submit",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/bing-indexing/submit-single', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: singleUrl.trim() })
      });

      const result = await response.json();
      setSubmissionHistory(prev => [result, ...prev.slice(0, 9)]);

      if (result.success) {
        toast({
          title: "URL Submitted",
          description: "URL successfully submitted to Bing for indexing"
        });
        setSingleUrl('');
      } else {
        toast({
          title: "Submission Failed",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit URL",
        variant: "destructive"
      });
    }
    setIsSubmitting(false);
  };

  const handleBulkSubmission = async () => {
    const urls = bulkUrls
      .split('\n')
      .map(url => url.trim())
      .filter(url => url.length > 0);

    if (urls.length === 0) {
      toast({
        title: "URLs Required",
        description: "Please enter URLs to submit (one per line)",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/bing-indexing/submit-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls, batchSize: 10 })
      });

      const result = await response.json();
      setSubmissionHistory(prev => [result, ...prev.slice(0, 9)]);

      if (result.success) {
        toast({
          title: "Bulk Submission Complete",
          description: `${urls.length} URLs submitted in batches`
        });
        setBulkUrls('');
      } else {
        toast({
          title: "Submission Failed",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit URLs",
        variant: "destructive"
      });
    }
    setIsSubmitting(false);
  };

  const handleSiteUrlSubmission = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/bing-indexing/submit-site-urls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const result = await response.json();
      setSubmissionHistory(prev => [result, ...prev.slice(0, 9)]);

      if (result.success) {
        toast({
          title: "Site URLs Submitted",
          description: `${result.totalUrls} site URLs submitted to Bing`
        });
      } else {
        toast({
          title: "Submission Failed",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit site URLs",
        variant: "destructive"
      });
    }
    setIsSubmitting(false);
  };

  const checkQuota = async () => {
    try {
      const response = await fetch('/api/bing-indexing/quota');
      const result = await response.json();
      
      if (result.success) {
        setQuotaInfo(result.quota);
        toast({
          title: "Quota Retrieved",
          description: "Current Bing API quota information updated"
        });
      } else {
        toast({
          title: "Quota Check Failed",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to check quota",
        variant: "destructive"
      });
    }
  };

  const generateSiteUrls = async () => {
    try {
      const response = await fetch('/api/bing-indexing/generate-site-urls');
      const result = await response.json();
      
      if (result.success && result.urls) {
        setBulkUrls(result.urls.join('\n'));
        toast({
          title: "URLs Generated",
          description: `${result.totalUrls} site URLs generated and loaded`
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate site URLs",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-3 mb-4">
            <Search className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Bing URL Submission Manager
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Submit up to 10,000 URLs per day to Bing for faster indexing and discovery
          </p>
        </div>

        {/* Quota Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Bing API Quota Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                {quotaInfo ? (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Daily Quota:</span>
                      <Badge variant="outline">{quotaInfo.quota || 10000}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Used Today:</span>
                      <Badge variant="secondary">{quotaInfo.used || 0}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Remaining:</span>
                      <Badge variant="default">{quotaInfo.remaining || 10000}</Badge>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-600">Click "Check Quota" to view current usage</p>
                )}
              </div>
              <div className="flex justify-center">
                <Button onClick={checkQuota} variant="outline">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Check Quota
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Single URL Submission */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Submit Single URL
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                placeholder="https://astrotick.com/horoscope/aries"
                value={singleUrl}
                onChange={(e) => setSingleUrl(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={handleSingleSubmission}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</>
                ) : (
                  <><Upload className="mr-2 h-4 w-4" /> Submit</>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Bulk URL Submission */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Bulk URL Submission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Button onClick={generateSiteUrls} variant="outline" size="sm">
                  Generate Site URLs
                </Button>
                <Button onClick={handleSiteUrlSubmission} variant="outline" size="sm" disabled={isSubmitting}>
                  Submit All Site URLs
                </Button>
              </div>
              <Textarea
                placeholder="Enter URLs, one per line..."
                value={bulkUrls}
                onChange={(e) => setBulkUrls(e.target.value)}
                rows={10}
                className="font-mono text-sm"
              />
              <Button 
                onClick={handleBulkSubmission}
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting Batch...</>
                ) : (
                  <><Upload className="mr-2 h-4 w-4" /> Submit Bulk URLs</>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Submission History */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            {submissionHistory.length === 0 ? (
              <p className="text-gray-600 text-center py-4">No submissions yet</p>
            ) : (
              <div className="space-y-3">
                {submissionHistory.map((submission, index) => (
                  <div key={index} className="p-3 rounded-lg border bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {submission.success ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-600" />
                        )}
                        <span className="font-medium">
                          {submission.success ? 'Success' : 'Failed'}
                        </span>
                      </div>
                      <Badge variant={submission.success ? "default" : "destructive"}>
                        {submission.details?.submittedUrls?.length || 0} URLs
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{submission.message}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BingIndexingManager;