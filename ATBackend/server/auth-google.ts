import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { storage } from './storage';
import crypto from 'crypto';
import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV || "development"}`)
})
// Configure Google OAuth Strategy
export function configureGoogleAuth() {
  const clientID = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  console.log('lsdkjflskdfjlskdfjsldkfj')
  if (!clientID || !clientSecret) {
    console.warn('Google OAuth credentials not configured');
    return;
  }

  const callbackURL = process.env.NODE_ENV === 'production' 
    ? `https://${process.env.REPL_SLUG || 'astrotick'}.com/auth/google/callback`
    : "/auth/google/callback";
    
  passport.use(new GoogleStrategy({
    clientID,
    clientSecret,
    callbackURL
  },
  async (accessToken: string, refreshToken: string, profile: any, done: any) => {
    try {
      console.log('Google OAuth profile received:', {
        id: profile.id,
        email: profile.emails?.[0]?.value,
        name: profile.displayName
      });

      // Check if user exists with this Google ID
      let user = await storage.getUserByGoogleId(profile.id);
      
      if (user) {
        console.log('Existing Google user found:', user.email);
        return done(null, user);
      }

      // Check if user exists with same email
      const email = profile.emails?.[0]?.value;
      if (email) {
        user = await storage.getUserByEmail(email);
        if (user) {
          // Link Google account to existing user
          await storage.updateUserGoogleId(user.id, profile.id);
          console.log('Linked Google account to existing user:', email);
          return done(null, user);
        }
      }

      // Create new user
      const newUserData = {
        username: email?.split('@')[0] || `user_${Date.now()}`,
        email: email || '',
        password: crypto.randomBytes(32).toString('hex'), // Random password since they use Google
        fullName: profile.displayName || '',
        googleId: profile.id,
        role: 'user' as const,
        isVerified: true, // Google accounts are pre-verified
        profileImage: profile.photos?.[0]?.value || null
      };

      user = await storage.createUser(newUserData);
      console.log('Created new Google user:', user.email);
      
      return done(null, user);
    } catch (error) {
      console.error('Google OAuth error:', error);
      return done(error, null);
    }
  }));

  console.log('Google OAuth strategy configured successfully');
}

export const googleAuthRoutes = {
  // Initiate Google OAuth
  login: '/auth/google',
  
  // Google OAuth callback
  callback: '/auth/google/callback'
};