import { ZODIAC_SIGNS, PLANETS } from "./astrology";

export interface ContentTemplate {
  type: 'horoscope' | 'guide' | 'compatibility' | 'planet-guide' | 'house-guide';
  title: string;
  outline: string[];
  variables: string[];
  sampleContent: string;
}

export interface GeneratedContent {
  title: string;
  content: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  tags: string[];
  category: string;
  readTime: number;
}

export class AIContentGenerator {
  private static templates: ContentTemplate[] = [
    {
      type: 'horoscope',
      title: 'Daily Horoscope for {sign} - {date}',
      outline: [
        'Introduction and sign overview',
        'General forecast for the day',
        'Love and relationships guidance',
        'Career and financial insights',
        'Health and wellness advice',
        'Lucky numbers and colors',
        'Planetary influences'
      ],
      variables: ['sign', 'date', 'ruling_planet', 'element'],
      sampleContent: 'Today brings powerful cosmic energies for {sign}...'
    },
    {
      type: 'guide',
      title: 'Understanding {sign}: Complete Personality Guide',
      outline: [
        'Introduction to {sign}',
        'Core personality traits',
        'Strengths and positive qualities',
        'Challenges and growth areas',
        'Love and relationship patterns',
        'Career and life path guidance',
        'Famous {sign} personalities',
        'Compatibility with other signs'
      ],
      variables: ['sign', 'element', 'quality', 'ruling_planet', 'symbol'],
      sampleContent: '{sign} individuals are known for their {key_trait}...'
    },
    {
      type: 'planet-guide',
      title: 'The Power of {planet}: Astrological Influence and Meaning',
      outline: [
        'Introduction to {planet}',
        'Mythological background',
        'Astrological significance',
        'Influence on personality',
        'Transit effects',
        'Retrograde periods',
        'How to work with {planet} energy'
      ],
      variables: ['planet', 'symbol', 'keywords', 'mythology'],
      sampleContent: '{planet} represents {primary_meaning} in astrology...'
    }
  ];

  static generateOutline(
    templateType: ContentTemplate['type'],
    focusKeyword: string,
    variables: Record<string, string> = {}
  ): string[] {
    const template = this.templates.find(t => t.type === templateType);
    if (!template) return [];

    return template.outline.map(item => 
      this.replaceVariables(item, { ...variables, keyword: focusKeyword })
    );
  }

  static generateContent(
    templateType: ContentTemplate['type'],
    focusKeyword: string,
    variables: Record<string, string> = {}
  ): GeneratedContent {
    const template = this.templates.find(t => t.type === templateType);
    if (!template) {
      throw new Error(`Template not found for type: ${templateType}`);
    }

    const title = this.replaceVariables(template.title, { ...variables, keyword: focusKeyword });
    const content = this.generateDetailedContent(template, focusKeyword, variables);
    const excerpt = this.generateExcerpt(content);
    const tags = this.generateTags(templateType, focusKeyword, variables);
    const category = this.getCategory(templateType);

    return {
      title,
      content,
      excerpt,
      metaTitle: this.generateMetaTitle(title, focusKeyword),
      metaDescription: this.generateMetaDescription(excerpt, focusKeyword),
      tags,
      category,
      readTime: this.calculateReadTime(content)
    };
  }

  private static replaceVariables(text: string, variables: Record<string, string>): string {
    let result = text;
    Object.entries(variables).forEach(([key, value]) => {
      result = result.replace(new RegExp(`{${key}}`, 'g'), value);
    });
    return result;
  }

  private static generateDetailedContent(
    template: ContentTemplate,
    focusKeyword: string,
    variables: Record<string, string>
  ): string {
    const sections = template.outline.map(outline => {
      const sectionTitle = this.replaceVariables(outline, variables);
      const sectionContent = this.generateSectionContent(outline, focusKeyword, variables, template.type);
      
      return `## ${sectionTitle}\n\n${sectionContent}\n`;
    });

    const introduction = this.generateIntroduction(focusKeyword, variables, template.type);
    const conclusion = this.generateConclusion(focusKeyword, variables, template.type);

    return `${introduction}\n\n${sections.join('\n')}\n${conclusion}`;
  }

  private static generateSectionContent(
    outline: string,
    focusKeyword: string,
    variables: Record<string, string>,
    type: ContentTemplate['type']
  ): string {
    const contentMap: Record<string, (keyword: string, vars: Record<string, string>) => string> = {
      'Introduction and sign overview': (keyword, vars) => 
        `${vars.sign || keyword} is one of the most fascinating signs in the zodiac. Ruled by ${vars.ruling_planet || 'their planetary ruler'}, ${vars.sign || keyword} individuals possess unique characteristics that set them apart. In this comprehensive guide, we'll explore everything you need to know about ${keyword}.`,
      
      'Core personality traits': (keyword, vars) =>
        `People born under ${vars.sign || keyword} are known for their distinctive personality traits. ${vars.sign || keyword} individuals typically display characteristics such as ${this.getRandomTraits().join(', ')}. These core traits shape how they interact with the world and form the foundation of their personality.`,
      
      'General forecast for the day': (keyword, vars) =>
        `Today's cosmic energy brings special opportunities for ${vars.sign || keyword}. The planetary alignments suggest a day filled with potential for growth and positive change. ${vars.sign || keyword} individuals should pay attention to their intuition and remain open to new possibilities.`,
      
      'Love and relationships guidance': (keyword, vars) =>
        `In matters of the heart, ${vars.sign || keyword} can expect meaningful developments today. Whether you're in a relationship or single, the stars encourage authentic communication and emotional honesty. This is an excellent time for ${vars.sign || keyword} to express their true feelings.`,
      
      'Career and financial insights': (keyword, vars) =>
        `Professional opportunities may present themselves to ${vars.sign || keyword} today. Your natural talents are highlighted, making this an ideal time to showcase your abilities. Financial decisions should be made with careful consideration and long-term planning in mind.`
    };

    const generator = contentMap[outline] || (() => 
      `This section explores the important aspects of ${focusKeyword}. Understanding these elements helps provide deeper insight into the astrological significance and practical applications in daily life.`
    );

    return generator(focusKeyword, variables);
  }

  private static generateIntroduction(
    focusKeyword: string,
    variables: Record<string, string>,
    type: ContentTemplate['type']
  ): string {
    const introductions = {
      horoscope: `Welcome to your daily horoscope reading for ${focusKeyword}. Today's cosmic alignments bring unique energies and opportunities specifically tailored for your zodiac sign.`,
      guide: `Discover the fascinating world of ${focusKeyword} in this comprehensive astrological guide. Whether you're a ${focusKeyword} yourself or seeking to understand someone special in your life, this guide provides deep insights into the cosmic influences that shape this remarkable sign.`,
      compatibility: `Explore the cosmic connection between different zodiac signs and discover how ${focusKeyword} influences romantic and platonic relationships in astrology.`,
      'planet-guide': `Journey into the mystical realm of ${focusKeyword} and uncover its profound influence on our lives, personalities, and spiritual growth.`,
      'house-guide': `Understanding ${focusKeyword} opens doorways to self-discovery and personal growth through the ancient wisdom of astrology.`
    };

    return introductions[type] || `Explore the fascinating world of ${focusKeyword} through the lens of astrology and cosmic wisdom.`;
  }

  private static generateConclusion(
    focusKeyword: string,
    variables: Record<string, string>,
    type: ContentTemplate['type']
  ): string {
    const conclusions = {
      horoscope: `Remember that astrology provides guidance, but your free will shapes your destiny. Use today's insights for ${focusKeyword} as a compass to navigate life's opportunities and challenges with wisdom and confidence.`,
      guide: `Understanding ${focusKeyword} through astrology offers valuable insights into personality, relationships, and life purpose. Embrace these cosmic gifts while remaining true to your authentic self.`,
      compatibility: `Astrological compatibility provides a framework for understanding relationships, but love, communication, and mutual respect remain the true foundations of any lasting partnership.`,
      'planet-guide': `${focusKeyword} continues to influence our lives in profound ways. By understanding its energy, we can better align ourselves with cosmic rhythms and embrace our highest potential.`,
      'house-guide': `The wisdom of ${focusKeyword} reminds us that we are all connected to the greater cosmic tapestry. Use these insights to enhance your spiritual journey and personal growth.`
    };

    return conclusions[type] || `May the wisdom of ${focusKeyword} guide you on your journey of self-discovery and cosmic understanding.`;
  }

  private static generateExcerpt(content: string): string {
    const firstParagraph = content.split('\n\n')[0];
    const words = firstParagraph.split(' ');
    return words.slice(0, 30).join(' ') + (words.length > 30 ? '...' : '');
  }

  private static generateTags(
    type: ContentTemplate['type'],
    focusKeyword: string,
    variables: Record<string, string>
  ): string[] {
    const baseTags = ['astrology', 'zodiac', 'horoscope'];
    const typeTags = {
      horoscope: ['daily horoscope', 'forecast', 'cosmic energy'],
      guide: ['personality', 'traits', 'sign guide'],
      compatibility: ['love', 'relationships', 'compatibility'],
      'planet-guide': ['planets', 'cosmic influence', 'astronomy'],
      'house-guide': ['astrological houses', 'birth chart', 'natal chart']
    };

    const specificTags = [focusKeyword.toLowerCase()];
    if (variables.sign) specificTags.push(variables.sign.toLowerCase());
    if (variables.element) specificTags.push(variables.element.toLowerCase());

    return [...baseTags, ...(typeTags[type] || []), ...specificTags];
  }

  private static getCategory(type: ContentTemplate['type']): string {
    const categories = {
      horoscope: 'Daily Horoscopes',
      guide: 'Zodiac Guides',
      compatibility: 'Love & Relationships',
      'planet-guide': 'Planetary Wisdom',
      'house-guide': 'Astrological Houses'
    };
    return categories[type] || 'Astrology';
  }

  private static generateMetaTitle(title: string, focusKeyword: string): string {
    if (title.length <= 60) return title;
    return `${focusKeyword} Guide | AstroTick`;
  }

  private static generateMetaDescription(excerpt: string, focusKeyword: string): string {
    const base = `Discover insights about ${focusKeyword} with expert astrological guidance.`;
    if (excerpt.length < 100) {
      return excerpt + ' ' + base;
    }
    return excerpt.substring(0, 130) + '...';
  }

  private static calculateReadTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }

  private static getRandomTraits(): string[] {
    const traits = [
      'determination', 'creativity', 'intuition', 'leadership', 'compassion',
      'analytical thinking', 'emotional depth', 'independence', 'loyalty',
      'adaptability', 'passion', 'wisdom', 'innovation', 'empathy'
    ];
    return traits.sort(() => 0.5 - Math.random()).slice(0, 3);
  }

  static getTemplateVariables(templateType: ContentTemplate['type']): string[] {
    const template = this.templates.find(t => t.type === templateType);
    return template?.variables || [];
  }

  static getAvailableTemplates(): ContentTemplate[] {
    return this.templates;
  }
}