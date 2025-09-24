import { useState, useEffect } from "react";
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { useToast } from "src/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "src/lib/queryClient";
import { useLocation } from "wouter";
import { useAuth } from "src/hooks/useAuth";

export default function AuthLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { refreshAuth } = useAuth();

  // Check if user is already authenticated
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/me"],
    retry: false,
  });

  useEffect(() => {
    // If user is already authenticated, redirect to intended destination or home
    if (user && !isLoading) {
      const urlParams = new URLSearchParams(window.location.search);
      const redirect = urlParams.get('redirect') || '/';
      setLocation(redirect);
    }

    // Handle Google OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const auth = urlParams.get('auth');
    const userParam = urlParams.get('user');

    if (token && auth === 'google' && userParam) {
      try {
        const userData = JSON.parse(decodeURIComponent(userParam));
        
        // Store token in localStorage
        localStorage.setItem('token', token);
        
        // Also store user data for immediate use
        localStorage.setItem('user', JSON.stringify(userData));
        
        toast({
          title: "Welcome!",
          description: `Successfully signed in with Google as ${userData.email}`,
          variant: "default",
        });

        // Refresh authentication state and redirect to intended destination
        refreshAuth().then(() => {
          const redirect = urlParams.get('redirect') || '/';
          console.log("🔄 Google OAuth redirecting to:", redirect);
          // Clean the URL by removing auth parameters before redirecting
          window.history.replaceState({}, '', window.location.pathname);
          
          // Use window.location.href for better reliability on premium routes
          if (redirect.includes('/premium-report') || redirect.includes('/consultation') || redirect !== '/') {
            setTimeout(() => {
              window.location.href = redirect;
            }, 300);
          } else {
            setLocation(redirect);
          }
        });
      } catch (error) {
        console.error('Error processing Google auth callback:', error);
        toast({
          title: "Authentication Error",
          description: "There was an issue with Google sign-in. Please try again.",
          variant: "destructive",
        });
      }
    }
  }, [user, isLoading, setLocation, toast]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login-pin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, pin: password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem('token', data.token);
        toast({
          title: "Success",
          description: "Successfully logged in!",
          variant: "default",
        });
        
        // Refresh authentication state first, then redirect
        await refreshAuth();
        
        // Redirect to intended destination after login
        const urlParams = new URLSearchParams(window.location.search);
        const redirect = urlParams.get('redirect') || '/';
        console.log("🔄 Auth-login PIN redirecting to:", redirect);
        
        // Use window.location.href for better reliability on premium routes
        if (redirect.includes('/premium-report') || redirect.includes('/consultation') || redirect !== '/') {
          setTimeout(() => {
            window.location.href = redirect;
          }, 300);
        } else {
          setLocation(redirect);
        }
      } else {
        throw new Error(data.message || "Login failed");
      }
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Redirect to Google OAuth endpoint with redirect parameter
    console.log('Initiating Google OAuth...');
    
    // Get redirect parameter from current URL
    const urlParams = new URLSearchParams(window.location.search);
    const redirect = urlParams.get('redirect');
    const googleAuthUrl = redirect ? `/auth/google?redirect=${encodeURIComponent(redirect)}` : '/auth/google';
    
    // Try to open in a new window first (this helps avoid popup blockers)
    const popup = window.open(googleAuthUrl, 'google-auth', 'width=600,height=600,scrollbars=yes,resizable=yes');
    
    // Fallback to regular redirect if popup is blocked
    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
      console.log('Popup blocked, using redirect method');
      window.location.href = googleAuthUrl;
    } else {
      console.log('Opened Google OAuth in popup');
      
      // Listen for the popup to close (user completed auth)
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          console.log('Google OAuth popup closed, refreshing page');
          // Refresh the current page to check for auth state
          window.location.reload();
        }
      }, 1000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-800">
            Welcome Back
          </CardTitle>
          <p className="text-gray-600">Sign in to your astrology account</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Google OAuth Button */}
          <Button
            onClick={handleGoogleLogin}
            variant="outline"
            className="w-full flex items-center justify-center space-x-2 border-gray-300 hover:bg-gray-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Continue with Google</span>
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or continue with email</span>
            </div>
          </div>

          {/* Traditional Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="6-Digit PIN"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                maxLength={6}
                className="w-full"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Button
              variant="link"
              className="p-0 h-auto text-purple-600 hover:text-purple-800"
              onClick={() => {
                const urlParams = new URLSearchParams(window.location.search);
                const redirect = urlParams.get('redirect');
                const signupUrl = redirect ? `/signup?redirect=${encodeURIComponent(redirect)}` : '/signup';
                setLocation(signupUrl);
              }}
            >
              Sign up here
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}