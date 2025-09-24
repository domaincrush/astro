import { TwitterApi } from 'twitter-api-v2';
import { InstagramBasicDisplayApi } from 'instagram-basic-display-api';
import { indexNowService } from './indexnow-service';
import { storage } from '../storage';

export interface SocialMediaPost {
  platform: 'twitter' | 'instagram';
  content: string;
  mediaUrls?: string[];
  scheduledFor?: Date;
  hashtags?: string[];
  contentType: 'horoscope' | 'article' | 'panchang' | 'custom';
  relatedId?: number;
}

export interface SocialMediaResponse {
  success: boolean;
  postId?: string;
  platform: string;
  message?: string;
  error?: string;
}

export class SocialMediaService {
  private static instance: SocialMediaService;
  private twitterClient: TwitterApi | null = null;
  private instagramClient: any = null;

  private constructor() {}

  static getInstance(): SocialMediaService {
    if (!SocialMediaService.instance) {
      SocialMediaService.instance = new SocialMediaService();
    }
    return SocialMediaService.instance;
  }

  // Initialize Twitter API client
  async initializeTwitter(): Promise<boolean> {
    try {
      const twitterConfig = await storage.getSocialMediaConfig('twitter');
      if (!twitterConfig || !twitterConfig.apiKey || !twitterConfig.apiSecret) {
        console.log('Twitter configuration not found or incomplete');
        return false;
      }

      this.twitterClient = new TwitterApi({
        appKey: twitterConfig.apiKey,
        appSecret: twitterConfig.apiSecret,
        accessToken: twitterConfig.accessToken,
        accessSecret: twitterConfig.accessTokenSecret,
      });

      // Verify credentials
      const user = await this.twitterClient.v2.me();
      console.log(`✅ Twitter initialized for user: ${user.data.username}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Twitter:', error);
      return false;
    }
  }

  // Initialize Instagram API client
  async initializeInstagram(): Promise<boolean> {
    try {
      const instagramConfig = await storage.getSocialMediaConfig('instagram');
      if (!instagramConfig || !instagramConfig.accessToken) {
        console.log('Instagram configuration not found or incomplete');
        return false;
      }

      this.instagramClient = new InstagramBasicDisplayApi(instagramConfig.accessToken);
      
      // Verify credentials
      const user = await this.instagramClient.getUserProfile();
      console.log(`✅ Instagram initialized for user: ${user.username}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Instagram:', error);
      return false;
    }
  }

  // Generate horoscope content for social media
  generateHoroscopeContent(sign: string, period: 'daily' | 'weekly' | 'monthly', prediction: string): string {
    const emojis = {
      aries: '♈️',
      taurus: '♉️',
      gemini: '♊️',
      cancer: '♋️',
      leo: '♌️',
      virgo: '♍️',
      libra: '♎️',
      scorpio: '♏️',
      sagittarius: '♐️',
      capricorn: '♑️',
      aquarius: '♒️',
      pisces: '♓️'
    };

    const periodEmoji = {
      daily: '📅',
      weekly: '📆',
      monthly: '🗓️'
    };

    const signEmoji = emojis[sign.toLowerCase() as keyof typeof emojis] || '⭐';
    const timeEmoji = periodEmoji[period];
    
    // Truncate prediction for social media
    const shortPrediction = prediction.length > 120 
      ? prediction.substring(0, 120) + '...' 
      : prediction;

    return `${signEmoji} ${period.charAt(0).toUpperCase() + period.slice(1)} ${sign} Horoscope ${timeEmoji}

${shortPrediction}

Read full predictions at astrotick.com 🌟

#${sign}Horoscope #Astrology #VedicAstrology #${period.charAt(0).toUpperCase() + period.slice(1)}Horoscope #AstroTick #ZodiacPredictions`;
  }

  // Generate article content for social media
  generateArticleContent(title: string, summary: string, slug: string): string {
    const shortSummary = summary.length > 150 
      ? summary.substring(0, 150) + '...' 
      : summary;

    return `🌟 ${title}

${shortSummary}

Read the full article: astrotick.com/articles/${slug}

#Astrology #VedicAstrology #AstrologyArticle #Horoscope #SpiritualGuidance #AstroTick`;
  }

  // Post to Twitter
  async postToTwitter(content: string, mediaUrls?: string[]): Promise<SocialMediaResponse> {
    try {
      if (!this.twitterClient) {
        await this.initializeTwitter();
      }

      if (!this.twitterClient) {
        return {
          success: false,
          platform: 'twitter',
          error: 'Twitter client not initialized'
        };
      }

      let mediaIds: string[] = [];
      
      // Upload media if provided
      if (mediaUrls && mediaUrls.length > 0) {
        for (const mediaUrl of mediaUrls.slice(0, 4)) { // Twitter allows max 4 images
          try {
            const response = await fetch(mediaUrl);
            const buffer = Buffer.from(await response.arrayBuffer());
            const mediaId = await this.twitterClient.v1.uploadMedia(buffer, { mimeType: response.headers.get('content-type') || 'image/jpeg' });
            mediaIds.push(mediaId);
          } catch (mediaError) {
            console.error(`Failed to upload media ${mediaUrl}:`, mediaError);
          }
        }
      }

      const tweetOptions: any = { text: content };
      if (mediaIds.length > 0) {
        tweetOptions.media = { media_ids: mediaIds };
      }

      const tweet = await this.twitterClient.v2.tweet(tweetOptions);
      
      return {
        success: true,
        platform: 'twitter',
        postId: tweet.data.id,
        message: 'Tweet posted successfully'
      };
    } catch (error) {
      console.error('Failed to post to Twitter:', error);
      return {
        success: false,
        platform: 'twitter',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Post to Instagram
  async postToInstagram(content: string, imageUrl?: string): Promise<SocialMediaResponse> {
    try {
      if (!this.instagramClient) {
        await this.initializeInstagram();
      }

      if (!this.instagramClient) {
        return {
          success: false,
          platform: 'instagram',
          error: 'Instagram client not initialized'
        };
      }

      // Instagram requires an image
      if (!imageUrl) {
        return {
          success: false,
          platform: 'instagram',
          error: 'Instagram posts require an image'
        };
      }

      // Create media container
      const mediaContainer = await this.instagramClient.createMediaContainer({
        image_url: imageUrl,
        caption: content
      });

      // Publish the media
      const post = await this.instagramClient.publishMedia(mediaContainer.id);
      
      return {
        success: true,
        platform: 'instagram',
        postId: post.id,
        message: 'Instagram post published successfully'
      };
    } catch (error) {
      console.error('Failed to post to Instagram:', error);
      return {
        success: false,
        platform: 'instagram',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Post horoscope to all platforms
  async postHoroscope(sign: string, period: 'daily' | 'weekly' | 'monthly', prediction: string): Promise<SocialMediaResponse[]> {
    const content = this.generateHoroscopeContent(sign, period, prediction);
    const results: SocialMediaResponse[] = [];

    // Get zodiac image for Instagram
    const zodiacImage = `https://astrotick.com/zodiac-signs/${sign.toLowerCase()}.png`;

    // Post to Twitter
    const twitterResult = await this.postToTwitter(content, [zodiacImage]);
    results.push(twitterResult);

    // Post to Instagram
    const instagramResult = await this.postToInstagram(content, zodiacImage);
    results.push(instagramResult);

    // Store social media posts in database
    try {
      await storage.createSocialMediaPost({
        platform: 'twitter',
        content,
        contentType: 'horoscope',
        relatedId: null,
        postId: twitterResult.postId,
        status: twitterResult.success ? 'published' : 'failed',
        scheduledFor: new Date(),
        postedAt: twitterResult.success ? new Date() : undefined,
        errorMessage: twitterResult.error
      });

      await storage.createSocialMediaPost({
        platform: 'instagram',
        content,
        contentType: 'horoscope',
        relatedId: null,
        postId: instagramResult.postId,
        status: instagramResult.success ? 'published' : 'failed',
        scheduledFor: new Date(),
        postedAt: instagramResult.success ? new Date() : undefined,
        errorMessage: instagramResult.error
      });

      // Also submit to IndexNow for SEO
      const horoscopeUrl = `https://astrotick.com/horoscope/${sign.toLowerCase()}/${period}`;
      await indexNowService.submitUrl(horoscopeUrl, 'horoscope');
      
    } catch (dbError) {
      console.error('Failed to store social media posts in database:', dbError);
    }

    return results;
  }

  // Post article to all platforms
  async postArticle(title: string, summary: string, slug: string, imageUrl?: string): Promise<SocialMediaResponse[]> {
    const content = this.generateArticleContent(title, summary, slug);
    const results: SocialMediaResponse[] = [];

    // Post to Twitter
    const twitterResult = await this.postToTwitter(content, imageUrl ? [imageUrl] : undefined);
    results.push(twitterResult);

    // Post to Instagram (only if image is provided)
    if (imageUrl) {
      const instagramResult = await this.postToInstagram(content, imageUrl);
      results.push(instagramResult);
    }

    // Store social media posts in database
    try {
      await storage.createSocialMediaPost({
        platform: 'twitter',
        content,
        contentType: 'article',
        relatedId: null,
        postId: twitterResult.postId,
        status: twitterResult.success ? 'published' : 'failed',
        scheduledFor: new Date(),
        postedAt: twitterResult.success ? new Date() : undefined,
        errorMessage: twitterResult.error
      });

      if (imageUrl) {
        await storage.createSocialMediaPost({
          platform: 'instagram',
          content,
          contentType: 'article',
          relatedId: null,
          postId: results.find(r => r.platform === 'instagram')?.postId,
          status: results.find(r => r.platform === 'instagram')?.success ? 'published' : 'failed',
          scheduledFor: new Date(),
          postedAt: results.find(r => r.platform === 'instagram')?.success ? new Date() : undefined,
          errorMessage: results.find(r => r.platform === 'instagram')?.error
        });
      }

      // Also submit to IndexNow for SEO
      const articleUrl = `https://astrotick.com/articles/${slug}`;
      await indexNowService.submitUrl(articleUrl, 'article');
      
    } catch (dbError) {
      console.error('Failed to store social media posts in database:', dbError);
    }

    return results;
  }

  // Get posting statistics
  async getStats(): Promise<any> {
    try {
      const stats = await storage.getSocialMediaStats();
      return {
        success: true,
        data: stats
      };
    } catch (error) {
      console.error('Failed to get social media stats:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

export const socialMediaService = SocialMediaService.getInstance();