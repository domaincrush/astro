import { useEffect } from "react";
import { useLocation } from "wouter";
import { useToast } from "src/hooks/use-toast";
import { useAuth } from "src/hooks/useAuth";

/**
 * AuthHandler - Handles Google OAuth redirects and authentication state
 * This component should be placed at the app level to handle auth redirects from any page
 */
export default function AuthHandler() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const { refreshAuth } = useAuth();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      const auth = urlParams.get('auth');
      const userParam = urlParams.get('user');
      const error = urlParams.get('error');

      // Handle authentication errors
      if (error) {
        let errorMessage = "Authentication failed. Please try again.";
        
        switch (error) {
          case 'google_auth_failed':
            errorMessage = "Google authentication failed. Please try again.";
            break;
          case 'no_user':
            errorMessage = "Authentication error: User data not found. Please try again.";
            break;
        }

        toast({
          title: "Authentication Error",
          description: errorMessage,
          variant: "destructive",
        });

        // Clean up URL parameters
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
        return;
      }

      // Handle successful Google OAuth callback
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

          // Refresh authentication state
          await refreshAuth();

          // Check if we need to redirect to the intended destination
          const currentPath = window.location.pathname;
          const urlParams = new URLSearchParams(window.location.search);
          const redirectParam = urlParams.get('redirect');
          
          // Clean up URL parameters
          const cleanUrl = window.location.pathname;
          window.history.replaceState({}, document.title, cleanUrl);

          // If there's a redirect parameter and we're not already there, redirect
          if (redirectParam && redirectParam !== currentPath && redirectParam !== '/') {
            console.log("🔄 Google Auth redirecting to:", redirectParam);
            // Ensure we have some delay for auth state to settle
            setTimeout(() => {
              // Use client-side navigation for internal routes
              if (redirectParam.startsWith('/')) {
                setLocation(redirectParam);
              } else {
                window.location.href = redirectParam;
              }
            }, 500);
          }
          
        } catch (error) {
          console.error('Error processing Google auth callback:', error);
          toast({
            title: "Authentication Error",
            description: "There was an issue processing the authentication. Please try again.",
            variant: "destructive",
          });

          // Clean up URL parameters
          const cleanUrl = window.location.pathname;
          window.history.replaceState({}, document.title, cleanUrl);
        }
      }
    };

    // Only run on mount and when location changes
    handleAuthCallback();
  }, [location, toast, refreshAuth]);

  // This component doesn't render anything
  return null;
}