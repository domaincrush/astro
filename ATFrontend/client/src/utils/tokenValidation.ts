export function isTokenExpired(token: string): boolean {
  if (!token) return true;
  
  try {
    // JWT tokens have 3 parts separated by dots
    const parts = token.split('.');
    if (parts.length !== 3) return true;
    
    // Decode the payload (second part)
    const payload = JSON.parse(atob(parts[1]));
    
    // Check if token has expiration
    if (!payload.exp) return false;
    
    // Check if token is expired (exp is in seconds, Date.now() is in milliseconds)
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch (error) {
    // If we can't decode the token, consider it expired
    return true;
  }
}

export function clearExpiredToken(): void {
  const token = localStorage.getItem('authToken');
  if (token && isTokenExpired(token)) {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }
}