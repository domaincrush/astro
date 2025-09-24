import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'src/components/ui/card';
import { Button } from 'src/components/ui/button';
import { Input } from 'src/components/ui/input';
import { Label } from 'src/components/ui/label';
import { Alert, AlertDescription } from 'src/components/ui/alert';
import { Mail, Send, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useToast } from 'src/hooks/use-toast';

export default function TestWelcomeMail() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    messageId?: string;
    accepted?: string[];
  } | null>(null);
  const { toast } = useToast();

  const sendTestEmail = async () => {
    if (!email.trim()) {
      toast({
        variant: "destructive",
        title: "Email Required",
        description: "Please enter an email address to test"
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        variant: "destructive",
        title: "Invalid Email",
        description: "Please enter a valid email address"
      });
      return;
    }

    setIsLoading(true);
    setTestResult(null);

    try {
      const response = await fetch('/api/test-welcome-mail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setTestResult({
          success: true,
          message: data.message,
          messageId: data.messageId,
          accepted: data.accepted
        });
        toast({
          title: "Email Sent Successfully! ✅",
          description: "Check your inbox (including spam folder) for the welcome email",
        });
      } else {
        setTestResult({
          success: false,
          message: data.message || 'Failed to send email'
        });
        toast({
          variant: "destructive",
          title: "Email Failed",
          description: data.message || 'Failed to send welcome email'
        });
      }
    } catch (error) {
      console.error('Email test error:', error);
      setTestResult({
        success: false,
        message: 'Network error or server unavailable'
      });
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: "Unable to connect to server. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendTestEmail();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 p-4">
      <div className="max-w-2xl mx-auto pt-20">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-orange-500 to-yellow-500 p-3 rounded-full">
              <Mail className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            SMTP Email Testing
          </h1>
          <p className="text-gray-600">
            Test the SMTP configuration to ensure emails are being delivered successfully
          </p>
        </div>

        {/* Main Test Card */}
        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Send className="h-5 w-5 text-orange-500" />
              Welcome Email Test
            </CardTitle>
            <CardDescription>
              Enter your email address to receive a test welcome email and verify SMTP configuration
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <div className="flex gap-3">
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button 
                  onClick={sendTestEmail}
                  disabled={isLoading || !email.trim()}
                  className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Get Mail
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Test Results */}
            {testResult && (
              <Alert className={`${testResult.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                <div className="flex items-start gap-3">
                  {testResult.success ? (
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <AlertDescription className={`${testResult.success ? 'text-green-800' : 'text-red-800'}`}>
                      <div className="font-medium mb-1">
                        {testResult.success ? 'Email Sent Successfully!' : 'Email Failed'}
                      </div>
                      <div>{testResult.message}</div>
                      {testResult.messageId && (
                        <div className="mt-2 text-sm opacity-75">
                          Message ID: {testResult.messageId}
                        </div>
                      )}
                      {testResult.accepted && testResult.accepted.length > 0 && (
                        <div className="mt-2 text-sm opacity-75">
                          Delivered to: {testResult.accepted.join(', ')}
                        </div>
                      )}
                    </AlertDescription>
                  </div>
                </div>
              </Alert>
            )}

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">📧 What this test does:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Verifies SMTP connection to smtp.dreamhost.com:587</li>
                <li>• Tests email authentication and delivery</li>
                <li>• Sends a welcome email with SMTP status confirmation</li>
                <li>• Confirms end-to-end email functionality</li>
              </ul>
            </div>

            {/* Instructions */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-medium text-yellow-900 mb-2">📝 Instructions:</h3>
              <ol className="text-sm text-yellow-800 space-y-1 list-decimal list-inside">
                <li>Enter your email address in the field above</li>
                <li>Click "Get Mail" to send the test email</li>
                <li>Check your inbox (and spam folder) for the welcome email</li>
                <li>If successful, SMTP configuration is working correctly</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}