import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "src/hooks/useAuth";
import { useToast } from "src/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "src/components/ui/card";
import { CheckCircle, AlertCircle } from "lucide-react";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";

export default function AuthSuccess() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const error = urlParams.get('error');
    const redirect = urlParams.get('redirect') || localStorage.getItem('auth_redirect') || "/";

    if (error) {
      toast({
        title: "Authentication Failed",
        description: "There was an error during social login. Please try again.",
        variant: "destructive",
      });
      setLocation("/login");
      return;
    }

    if (token) {
      // Verify token and get user data
      fetch('/api/auth/social-callback?token=' + token)
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            login(data.user, data.token);
            toast({
              title: "Welcome!",
              description: "You have been logged in successfully via social media.",
            });
            // Clear stored redirect and navigate to intended page
            localStorage.removeItem('auth_redirect');
            const decodedRedirect = decodeURIComponent(redirect);
            console.log("🔄 Auth-success redirecting to:", decodedRedirect);
            
            // Use window.location.href for better reliability on premium routes
            if (decodedRedirect.includes('/premium-report') || decodedRedirect.includes('/consultation') || decodedRedirect !== '/') {
              setTimeout(() => {
                window.location.href = decodedRedirect;
              }, 300);
            } else {
              setLocation(decodedRedirect);
            }
          } else {
            throw new Error(data.message);
          }
        })
        .catch(error => {
          console.error('Social auth error:', error);
          toast({
            title: "Authentication Failed",
            description: "Failed to complete social login. Please try again.",
            variant: "destructive",
          });
          setLocation("/login");
        });
    } else {
      toast({
        title: "Authentication Failed",
        description: "No authentication token received. Please try again.",
        variant: "destructive",
      });
      setLocation("/login");
    }
  }, [login, setLocation, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Processing Login</CardTitle>
          <CardDescription>
            Completing your social media authentication...
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-sm text-gray-600">
            Please wait while we set up your account
          </p>
        </CardContent>
      </Card>
    </div>
  );
}