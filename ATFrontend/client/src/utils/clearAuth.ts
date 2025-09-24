// Utility to clear authentication data and force fresh login
export function clearAuthData() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");
  
  // Clear any other auth-related data
  localStorage.removeItem("authUser");
  sessionStorage.removeItem("authUser");
  
  console.log("Authentication data cleared - please refresh and login again");
}

// Call this immediately to clear any existing auth data
clearAuthData();