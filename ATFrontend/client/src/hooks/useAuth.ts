import { useState, useEffect, useCallback } from "react";
import { isTokenExpired, clearExpiredToken } from "../utils/tokenValidation";

interface User {
  id: number;
  email: string;
  username: string;
  role: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser =
      localStorage.getItem("user") || sessionStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  console.log(user)
  const [loading, setLoading] = useState(true);

  const clearAllAuthData = () => {
    // Clear all possible authentication storage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("userData");
    setUser(null);
  };

  const checkAuth = async () => {
    try {
      // Check multiple token storage patterns
      let token =
        localStorage.getItem("token") ||
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("token") ||
        sessionStorage.getItem("authToken");

      if (!token) {
        setLoading(false);
        return;
      }

      // Check if token is expired
      if (isTokenExpired(token)) {
        clearExpiredToken();
        setUser(null);
        setLoading(false);
        return;
      }

      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache, must-revalidate",
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);

        // Ensure token is stored in the standard location
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        // Authentication successful - user data loaded
      } else {
        // Auth check failed - clearing stored data
        // Clear auth data on 401/403 errors - use direct function instead of callback
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("authToken");
        sessionStorage.removeItem("userData");
        setUser(null);
      }
    } catch (error) {
      // Auth check error - clearing stored data
      // Clear auth data directly - use direct function instead of callback
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("authToken");
      sessionStorage.removeItem("userData");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }; // Remove clearAllAuthData dependency to prevent circular dependency
console.log('render')
  useEffect(() => {
    checkAuth();
    console.log("🔄 Running initial auth check...");
  }, []);
  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);

        // Handle redirect after successful login - use client-side routing instead of full page reload
        const storedRedirect = localStorage.getItem("auth_redirect");
        const urlParams = new URLSearchParams(window.location.search);
        const urlRedirect = urlParams.get("redirect");
        const redirectUrl = storedRedirect || urlRedirect;

        if (redirectUrl && redirectUrl !== "/") {
          localStorage.removeItem("auth_redirect");
          console.log("🔄 Login successful, will redirect to:", redirectUrl);
          // Note: Let the calling component handle the redirect to avoid routing conflicts
        }

        return { success: true, user: data.user, redirectUrl };
      } else {
        const error = await response.json();
        return { success: false, error: error.message };
      }
    } catch (error) {
      return { success: false, error: "Login failed" };
    }
  };

  const logout = () => {
    clearAllAuthData();
    window.location.href = "/login";
  };

  const refreshAuth = async () => {
    console.log("🔄 Refreshing authentication state...");
    setLoading(true);
    await checkAuth();
    // Force a small delay to ensure state updates propagate
    await new Promise((resolve) => setTimeout(resolve, 200));
    console.log("✅ Auth refresh completed");
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin";

  return {
    user,
    loading,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    refreshAuth,
  };
}
