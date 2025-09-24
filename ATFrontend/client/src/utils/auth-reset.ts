/**
 * Authentication Reset Utility
 * Use this to clear stored authentication data and reset login state
 */

export function clearAuthenticationData() {
  // Clear all authentication-related localStorage items
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("authToken");
  localStorage.removeItem("userData");
  
  // Clear any session storage as well
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");
  sessionStorage.removeItem("authToken");
  sessionStorage.removeItem("userData");
  
  // Clear any cookies (if using cookie-based auth)
  document.cookie.split(";").forEach((c) => {
    const eqPos = c.indexOf("=");
    const name = eqPos > -1 ? c.substr(0, eqPos) : c;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
  });
  
  console.log("Authentication data cleared successfully");
}

export function forceLogout() {
  clearAuthenticationData();
  window.location.href = "/login";
}

// Development helper - only available in development mode
export function resetToCleanState() {
  if (process.env.NODE_ENV === "development") {
    clearAuthenticationData();
    
    // Clear any other app-specific data
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes("astro") || key.includes("user") || key.includes("auth"))) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    console.log("Application reset to clean state");
    window.location.reload();
  }
}

// Add to window for debugging in development
if (process.env.NODE_ENV === "development") {
  (window as any).clearAuth = clearAuthenticationData;
  (window as any).forceLogout = forceLogout;
  (window as any).resetApp = resetToCleanState;
}