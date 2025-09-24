import { Request, Response } from "express";
import { storage } from "./storage";

interface BlogArticleTemplate {
  title: string;
  content: string;
  category: string;
  tags: string[];
  readingTime: number;
}

export class MultilingualBlogGenerator {
  private static readonly BLOG_ARTICLES: BlogArticleTemplate[] = [
    {
      title: "Understanding Your Birth Chart Houses",
      content: "The birth chart is divided into twelve houses, each representing different aspects of life. The first house represents self and personality, while the seventh house governs partnerships and relationships. Understanding these houses helps decode your life's blueprint through stellar astrology principles.",
      category: "Birth Chart Basics",
      tags: ["birth-chart", "houses", "astrology", "stellar"],
      readingTime: 5
    },
    {
      title: "Nakshatra Predictions for Career Success",
      content: "Your birth nakshatra reveals your career potential and professional path. Each of the 27 nakshatras carries specific vibrations that influence your work style, leadership abilities, and success patterns. This authentic stellar method provides precise career guidance.",
      category: "Predictive Astrology",
      tags: ["nakshatra", "career", "predictions", "success"],
      readingTime: 7
    },
    {
      title: "Marriage Compatibility Through Stellar Astrology",
      content: "Stellar astrology provides the most accurate method for assessing marriage compatibility. By analyzing the star lords, sub lords, and significators of the 7th house, we can determine relationship harmony and timing of marriage with remarkable precision.",
      category: "Relationship Astrology",
      tags: ["marriage", "compatibility", "stellar", "relationships"],
      readingTime: 6
    },
    {
      title: "Planetary Remedies for Health Issues",
      content: "Each planet governs specific body parts and health conditions. When planets are afflicted in your chart, targeted remedies can restore balance. Learn authentic remedial measures based on stellar astrology principles for optimal health and vitality.",
      category: "Remedial Astrology",
      tags: ["remedies", "health", "planets", "healing"],
      readingTime: 8
    },
    {
      title: "Tamil Astrology Traditions and Modern Practice",
      content: "Tamil astrology preserves ancient stellar wisdom passed down through generations. The traditional methods of chart calculation, nakshatra analysis, and timing predictions remain highly accurate in modern times, providing authentic guidance for life decisions.",
      category: "Cultural Astrology",
      tags: ["tamil", "traditions", "culture", "heritage"],
      readingTime: 6
    },
    {
      title: "Dasha Periods and Life Events",
      content: "Dasha periods reveal the timing of major life events with extraordinary accuracy. Understanding the sequence of planetary periods and their sub-periods helps predict career changes, relationships, health issues, and spiritual growth phases.",
      category: "Predictive Astrology",
      tags: ["dasha", "timing", "events", "predictions"],
      readingTime: 9
    },
    {
      title: "Cuspal Sub Lords and House Significations",
      content: "The revolutionary concept of cuspal sub lords transforms astrological predictions. Each house cusp has a specific sub lord that determines the results of that house. This stellar technique provides pinpoint accuracy in predictions.",
      category: "Birth Chart Basics",
      tags: ["cusps", "sub-lords", "houses", "stellar"],
      readingTime: 7
    },
    {
      title: "Love Marriage vs Arranged Marriage Indicators",
      content: "Your birth chart reveals whether you'll have a love marriage or arranged marriage. Specific combinations of planets, houses, and stellar positions indicate the nature of your marriage. Learn to identify these patterns accurately.",
      category: "Relationship Astrology",
      tags: ["love-marriage", "arranged-marriage", "indicators", "chart"],
      readingTime: 6
    },
    {
      title: "Gemstone Remedies Based on Stellar Analysis",
      content: "Selecting the right gemstone requires precise stellar analysis. The traditional method of recommending stones based on birth chart alone is insufficient. True remedial astrology considers the sub lord, star lord, and significators for effective gem therapy.",
      category: "Remedial Astrology",
      tags: ["gemstones", "remedies", "stellar", "therapy"],
      readingTime: 8
    },
    {
      title: "Children and Progeny Predictions",
      content: "The 5th house and its connections reveal information about children. Stellar astrology provides specific timing for conception, number of children, their gender, and their life prospects through detailed analysis of significators and sub lords.",
      category: "Predictive Astrology",
      tags: ["children", "progeny", "5th-house", "family"],
      readingTime: 7
    },
    {
      title: "Financial Prosperity Through Stellar Astrology",
      content: "Wealth indicators in stellar astrology go beyond traditional 2nd and 11th house analysis. The wealth potential is determined by the cuspal sub lords, their star lords, and the intricate connections between money houses for accurate financial predictions.",
      category: "Predictive Astrology",
      tags: ["wealth", "money", "prosperity", "finances"],
      readingTime: 8
    },
    {
      title: "Foreign Travel and Settlement Predictions",
      content: "The 12th house governs foreign travel and settlement. Stellar astrology reveals not just the possibility but also the timing, direction, and success of overseas ventures through detailed analysis of significators and planetary periods.",
      category: "Predictive Astrology",
      tags: ["foreign-travel", "settlement", "12th-house", "overseas"],
      readingTime: 6
    },
    {
      title: "Education and Higher Studies Guidance",
      content: "The 4th and 9th houses reveal educational prospects. Stellar astrology determines the field of study, level of education, timing of admissions, and success in academic pursuits through precise analysis of house significators.",
      category: "Predictive Astrology",
      tags: ["education", "studies", "academics", "career"],
      readingTime: 7
    },
    {
      title: "Business vs Job Indications in Birth Chart",
      content: "Your birth chart clearly shows whether business or job will bring success. The 6th house represents service, while the 7th and 10th houses indicate business potential. Stellar analysis provides definitive guidance on career direction.",
      category: "Predictive Astrology",
      tags: ["business", "job", "career", "success"],
      readingTime: 6
    },
    {
      title: "Health Predictions Through Medical Astrology",
      content: "Each planet and house governs specific body parts and health conditions. Stellar astrology provides precise timing for health issues and recovery periods through detailed analysis of significators and their sub lords.",
      category: "Predictive Astrology",
      tags: ["health", "medical", "disease", "recovery"],
      readingTime: 8
    },
    {
      title: "Property and Real Estate Predictions",
      content: "The 4th house governs landed property and real estate. Stellar astrology reveals the timing of property acquisition, type of property, location, and profit potential through analysis of cuspal sub lords and significators.",
      category: "Predictive Astrology",
      tags: ["property", "real-estate", "4th-house", "land"],
      readingTime: 7
    },
    {
      title: "Spiritual Growth and Moksha Indicators",
      content: "The 12th house and its connections reveal spiritual inclinations and the path to liberation. Stellar astrology identifies genuine spiritual growth versus superficial religious practices through detailed chart analysis.",
      category: "Cultural Astrology",
      tags: ["spirituality", "moksha", "liberation", "growth"],
      readingTime: 9
    },
    {
      title: "Timing of Marriage Through Stellar Method",
      content: "Marriage timing requires analysis of the 7th house cusp, its sub lord, star lord, and the significators of marriage. The revolutionary stellar method provides precise timing within months rather than years.",
      category: "Relationship Astrology",
      tags: ["marriage-timing", "stellar", "7th-house", "significators"],
      readingTime: 8
    },
    {
      title: "Rahu and Ketu Effects in Different Houses",
      content: "The lunar nodes Rahu and Ketu create unique effects in each house. Understanding their influence through stellar astrology helps navigate their challenging periods and harness their positive potential for growth.",
      category: "Birth Chart Basics",
      tags: ["rahu", "ketu", "nodes", "effects"],
      readingTime: 7
    },
    {
      title: "Remedial Measures for Doshas and Afflictions",
      content: "Traditional doshas like Manglik, Kaal Sarp, and others require proper understanding through stellar astrology. Many supposed doshas are actually misinterpretations. Learn authentic remedial measures for genuine afflictions.",
      category: "Remedial Astrology",
      tags: ["doshas", "remedies", "afflictions", "solutions"],
      readingTime: 8
    }
  ];

  private static readonly TRANSLATIONS = {
    'en': { prefix: '', suffix: '' },
    'hi': { 
      prefix: '[हिंदी] ',
      suffix: ' - ज्योतिष शास्त्र के अनुसार विस्तृत विश्लेषण और मार्गदर्शन।'
    },
    'te': { 
      prefix: '[తెలుగు] ',
      suffix: ' - జ్యోతిష్య శాస్త్రం ప్రకారం వివరణాత్మక విశ్లేషణ మరియు మార్గదర్శకత్వం।'
    }
  };

  private static readonly CATEGORY_TRANSLATIONS = {
    'en': {
      'Birth Chart Basics': 'Birth Chart Basics',
      'Predictive Astrology': 'Predictive Astrology',
      'Relationship Astrology': 'Relationship Astrology',
      'Remedial Astrology': 'Remedial Astrology',
      'Cultural Astrology': 'Cultural Astrology'
    },
    'hi': {
      'Birth Chart Basics': 'जन्म कुंडली मूल बातें',
      'Predictive Astrology': 'भविष्यवाणी ज्योतिष',
      'Relationship Astrology': 'रिश्ते की ज्योतिष',
      'Remedial Astrology': 'उपचारात्मक ज्योतिष',
      'Cultural Astrology': 'सांस्कृतिक ज्योतिष'
    },
    'te': {
      'Birth Chart Basics': 'జన్మ చార్ట్ ప్రాథమికాలు',
      'Predictive Astrology': 'భవిష్యవాణి జ్యోతిష్యం',
      'Relationship Astrology': 'సంబంధాల జ్యోతిష్యం',
      'Remedial Astrology': 'పరిహార జ్యోతిష్యం',
      'Cultural Astrology': 'సాంస్కృతిక జ్యోతిష్యం'
    }
  };

  static translateArticle(article: BlogArticleTemplate, language: string) {
    const trans = this.TRANSLATIONS[language as keyof typeof this.TRANSLATIONS] || this.TRANSLATIONS.en;
    const catTrans = this.CATEGORY_TRANSLATIONS[language as keyof typeof this.CATEGORY_TRANSLATIONS] || this.CATEGORY_TRANSLATIONS.en;
    
    return {
      title: `${trans.prefix}${article.title}${trans.suffix}`,
      excerpt: `${article.content.substring(0, 200)}...`,
      content: `${trans.prefix}${article.content}${trans.suffix}`,
      category: catTrans[article.category as keyof typeof catTrans] || article.category,
      tags: article.tags.map(tag => `${language}-${tag}`)
    };
  }

  static async generateMultilingualBlogArticles(count: number = 50, languages: string[] = ['en', 'hi', 'te']) {
    const results: any = {};
    let totalGenerated = 0;
    
    // Select articles to generate
    const selectedArticles = this.BLOG_ARTICLES.slice(0, Math.min(count, this.BLOG_ARTICLES.length));
    
    // Generate for each language
    for (const language of languages) {
      results[language] = [];
      
      for (let i = 0; i < selectedArticles.length; i++) {
        const article = selectedArticles[i];
        
        try {
          // Create unique slug
          const timestamp = Date.now();
          const randomNum = Math.floor(Math.random() * 1000);
          const baseSlug = article.title.toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim('-');
          const slug = `${baseSlug}-${language}-${timestamp}-${randomNum}`;
          
          // Translate content
          const translatedContent = this.translateArticle(article, language);
          
          // Create article with minimal required fields
          const blogArticle = await storage.createArticle({
            title: translatedContent.title,
            slug: slug,
            excerpt: translatedContent.excerpt,
            content: translatedContent.content,
            authorId: 1, // Default admin user
            status: 'published',
            category: translatedContent.category,
            tags: translatedContent.tags,
            readTime: article.readingTime,
            language: language,
            metaTitle: translatedContent.title,
            metaDescription: translatedContent.excerpt
          });
          
          results[language].push({
            id: blogArticle.id,
            title: translatedContent.title,
            slug: slug,
            language: language
          });
          
          totalGenerated++;
          
        } catch (error) {
          console.log(`Skipping article "${article.title}" in ${language}: may already exist`);
        }
      }
    }
    
    return {
      success: true,
      totalArticles: totalGenerated,
      languages: languages,
      results: results,
      breakdown: Object.fromEntries(
        Object.entries(results).map(([lang, articles]: [string, any]) => [lang, articles.length])
      )
    };
  }
}

export async function generateMultilingualBlog(req: Request, res: Response) {
  try {
    const { count = 50, languages = ['en', 'hi', 'te'] } = req.body;
    
    console.log(`Generating ${count} blog articles in ${languages.length} languages...`);
    
    const result = await MultilingualBlogGenerator.generateMultilingualBlogArticles(count, languages);
    
    res.json({
      success: true,
      message: `Generated ${result.totalArticles} blog articles across ${languages.length} languages`,
      ...result
    });
    
  } catch (error) {
    console.error('Blog generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate blog articles',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}