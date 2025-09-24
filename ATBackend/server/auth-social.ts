export interface SocialAuthProvider {
  name: string;
  clientId: string;
  clientSecret: string;
  redirectUrl: string;
}

export interface GoogleAuth extends SocialAuthProvider {
  scope: string[];
}

export interface FacebookAuth extends SocialAuthProvider {
  permissions: string[];
}

export class SocialAuthManager {
  private providers: Map<string, SocialAuthProvider> = new Map();

  constructor() {
    this.initializeProviders();
  }

  private initializeProviders() {
    // Google OAuth configuration
    if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
      this.providers.set('google', {
        name: 'Google',
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        redirectUrl: process.env.GOOGLE_REDIRECT_URL || '/auth/google/callback'
      });
    }

    // Facebook OAuth configuration
    if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
      this.providers.set('facebook', {
        name: 'Facebook',
        clientId: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        redirectUrl: process.env.FACEBOOK_REDIRECT_URL || '/auth/facebook/callback'
      });
    }
  }

  getProvider(name: string): SocialAuthProvider | undefined {
    return this.providers.get(name.toLowerCase());
  }

  getAllProviders(): SocialAuthProvider[] {
    return Array.from(this.providers.values());
  }

  generateAuthUrl(providerName: string, state?: string): string {
    const provider = this.getProvider(providerName);
    if (!provider) {
      throw new Error(`Provider ${providerName} not configured`);
    }

    // This would be expanded based on the specific OAuth provider requirements
    return `/auth/${providerName.toLowerCase()}/login`;
  }
}

export default new SocialAuthManager();