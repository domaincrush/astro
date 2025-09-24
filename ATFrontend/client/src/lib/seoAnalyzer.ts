interface SEOAnalysis {
  score: number;
  checks: SEOCheck[];
  readabilityScore: number;
  readabilityChecks: ReadabilityCheck[];
}

interface SEOCheck {
  id: string;
  title: string;
  status: 'good' | 'ok' | 'bad';
  message: string;
  impact: 'high' | 'medium' | 'low';
}

interface ReadabilityCheck {
  id: string;
  title: string;
  status: 'good' | 'ok' | 'bad';
  message: string;
  value?: number;
}

export class SEOAnalyzer {
  private content: string;
  private title: string;
  private metaDescription: string;
  private focusKeyword: string;
  private slug: string;

  constructor(data: {
    content: string;
    title: string;
    metaDescription: string;
    focusKeyword: string;
    slug: string;
  }) {
    this.content = data.content;
    this.title = data.title;
    this.metaDescription = data.metaDescription;
    this.focusKeyword = data.focusKeyword.toLowerCase();
    this.slug = data.slug;
  }

  public analyze(): SEOAnalysis {
    const seoChecks = this.runSEOChecks();
    const readabilityChecks = this.runReadabilityChecks();
    
    const seoScore = this.calculateSEOScore(seoChecks);
    const readabilityScore = this.calculateReadabilityScore(readabilityChecks);

    return {
      score: Math.round((seoScore + readabilityScore) / 2),
      checks: seoChecks,
      readabilityScore,
      readabilityChecks
    };
  }

  private runSEOChecks(): SEOCheck[] {
    const checks: SEOCheck[] = [];

    // Focus keyword in title
    checks.push(this.checkKeywordInTitle());
    
    // Focus keyword in meta description
    checks.push(this.checkKeywordInMetaDescription());
    
    // Focus keyword in content
    checks.push(this.checkKeywordInContent());
    
    // Title length
    checks.push(this.checkTitleLength());
    
    // Meta description length
    checks.push(this.checkMetaDescriptionLength());
    
    // Content length
    checks.push(this.checkContentLength());
    
    // Keyword density
    checks.push(this.checkKeywordDensity());
    
    // URL slug
    checks.push(this.checkSlug());
    
    // Headings structure
    checks.push(this.checkHeadingsStructure());

    return checks;
  }

  private runReadabilityChecks(): ReadabilityCheck[] {
    const checks: ReadabilityCheck[] = [];

    // Sentence length
    checks.push(this.checkSentenceLength());
    
    // Paragraph length
    checks.push(this.checkParagraphLength());
    
    // Subheading distribution
    checks.push(this.checkSubheadingDistribution());
    
    // Passive voice
    checks.push(this.checkPassiveVoice());
    
    // Transition words
    checks.push(this.checkTransitionWords());

    return checks;
  }

  private checkKeywordInTitle(): SEOCheck {
    const hasKeyword = this.title.toLowerCase().includes(this.focusKeyword);
    const isAtBeginning = this.title.toLowerCase().startsWith(this.focusKeyword);

    if (isAtBeginning) {
      return {
        id: 'keyword-in-title',
        title: 'Focus keyword in title',
        status: 'good',
        message: 'Focus keyword appears at the beginning of the title.',
        impact: 'high'
      };
    } else if (hasKeyword) {
      return {
        id: 'keyword-in-title',
        title: 'Focus keyword in title',
        status: 'ok',
        message: 'Focus keyword appears in the title.',
        impact: 'high'
      };
    } else {
      return {
        id: 'keyword-in-title',
        title: 'Focus keyword in title',
        status: 'bad',
        message: 'Focus keyword does not appear in the title.',
        impact: 'high'
      };
    }
  }

  private checkKeywordInMetaDescription(): SEOCheck {
    const hasKeyword = this.metaDescription.toLowerCase().includes(this.focusKeyword);

    return {
      id: 'keyword-in-meta',
      title: 'Focus keyword in meta description',
      status: hasKeyword ? 'good' : 'bad',
      message: hasKeyword 
        ? 'Focus keyword appears in the meta description.'
        : 'Focus keyword does not appear in the meta description.',
      impact: 'medium'
    };
  }

  private checkKeywordInContent(): SEOCheck {
    const contentLower = this.content.toLowerCase();
    const keywordCount = (contentLower.match(new RegExp(this.focusKeyword, 'g')) || []).length;

    if (keywordCount >= 1) {
      return {
        id: 'keyword-in-content',
        title: 'Focus keyword in content',
        status: 'good',
        message: `Focus keyword appears ${keywordCount} time(s) in the content.`,
        impact: 'high'
      };
    } else {
      return {
        id: 'keyword-in-content',
        title: 'Focus keyword in content',
        status: 'bad',
        message: 'Focus keyword does not appear in the content.',
        impact: 'high'
      };
    }
  }

  private checkTitleLength(): SEOCheck {
    const length = this.title.length;

    if (length >= 30 && length <= 60) {
      return {
        id: 'title-length',
        title: 'Title length',
        status: 'good',
        message: `Title length is ${length} characters. Good!`,
        impact: 'high'
      };
    } else if (length > 60) {
      return {
        id: 'title-length',
        title: 'Title length',
        status: 'bad',
        message: `Title is too long (${length} characters). Keep it under 60 characters.`,
        impact: 'high'
      };
    } else {
      return {
        id: 'title-length',
        title: 'Title length',
        status: 'ok',
        message: `Title is short (${length} characters). Consider making it longer.`,
        impact: 'medium'
      };
    }
  }

  private checkMetaDescriptionLength(): SEOCheck {
    const length = this.metaDescription.length;

    if (length >= 120 && length <= 160) {
      return {
        id: 'meta-length',
        title: 'Meta description length',
        status: 'good',
        message: `Meta description length is ${length} characters. Perfect!`,
        impact: 'high'
      };
    } else if (length > 160) {
      return {
        id: 'meta-length',
        title: 'Meta description length',
        status: 'bad',
        message: `Meta description is too long (${length} characters). Keep it under 160 characters.`,
        impact: 'high'
      };
    } else {
      return {
        id: 'meta-length',
        title: 'Meta description length',
        status: 'ok',
        message: `Meta description is short (${length} characters). Consider making it longer.`,
        impact: 'medium'
      };
    }
  }

  private checkContentLength(): SEOCheck {
    const wordCount = this.content.split(/\s+/).length;

    if (wordCount >= 300) {
      return {
        id: 'content-length',
        title: 'Content length',
        status: 'good',
        message: `Content has ${wordCount} words. Good length for SEO!`,
        impact: 'medium'
      };
    } else {
      return {
        id: 'content-length',
        title: 'Content length',
        status: 'bad',
        message: `Content is too short (${wordCount} words). Aim for at least 300 words.`,
        impact: 'medium'
      };
    }
  }

  private checkKeywordDensity(): SEOCheck {
    const words = this.content.toLowerCase().split(/\s+/);
    const keywordCount = (this.content.toLowerCase().match(new RegExp(this.focusKeyword, 'g')) || []).length;
    const density = (keywordCount / words.length) * 100;

    if (density >= 0.5 && density <= 2.5) {
      return {
        id: 'keyword-density',
        title: 'Keyword density',
        status: 'good',
        message: `Keyword density is ${density.toFixed(1)}%. Good balance!`,
        impact: 'medium'
      };
    } else if (density > 2.5) {
      return {
        id: 'keyword-density',
        title: 'Keyword density',
        status: 'bad',
        message: `Keyword density is too high (${density.toFixed(1)}%). Reduce keyword usage.`,
        impact: 'medium'
      };
    } else {
      return {
        id: 'keyword-density',
        title: 'Keyword density',
        status: 'ok',
        message: `Keyword density is low (${density.toFixed(1)}%). Consider using the keyword more.`,
        impact: 'low'
      };
    }
  }

  private checkSlug(): SEOCheck {
    const hasKeyword = this.slug.toLowerCase().includes(this.focusKeyword.replace(/\s+/g, '-'));
    const isClean = /^[a-z0-9-]+$/.test(this.slug);

    if (hasKeyword && isClean) {
      return {
        id: 'slug-check',
        title: 'URL slug',
        status: 'good',
        message: 'URL slug contains the focus keyword and is SEO-friendly.',
        impact: 'medium'
      };
    } else if (isClean) {
      return {
        id: 'slug-check',
        title: 'URL slug',
        status: 'ok',
        message: 'URL slug is clean but doesn\'t contain the focus keyword.',
        impact: 'medium'
      };
    } else {
      return {
        id: 'slug-check',
        title: 'URL slug',
        status: 'bad',
        message: 'URL slug should be clean and contain the focus keyword.',
        impact: 'medium'
      };
    }
  }

  private checkHeadingsStructure(): SEOCheck {
    const h1Count = (this.content.match(/<h1[^>]*>/gi) || []).length;
    const h2Count = (this.content.match(/<h2[^>]*>/gi) || []).length;
    const hasHeadings = h1Count > 0 || h2Count > 0;

    if (h1Count === 1 && h2Count > 0) {
      return {
        id: 'headings-structure',
        title: 'Headings structure',
        status: 'good',
        message: 'Good heading structure with H1 and H2 tags.',
        impact: 'medium'
      };
    } else if (hasHeadings) {
      return {
        id: 'headings-structure',
        title: 'Headings structure',
        status: 'ok',
        message: 'Some headings found. Consider improving structure.',
        impact: 'medium'
      };
    } else {
      return {
        id: 'headings-structure',
        title: 'Headings structure',
        status: 'bad',
        message: 'No headings found. Add H1 and H2 tags to structure content.',
        impact: 'medium'
      };
    }
  }

  private checkSentenceLength(): ReadabilityCheck {
    const sentences = this.content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgWordsPerSentence = sentences.reduce((sum, sentence) => {
      return sum + sentence.trim().split(/\s+/).length;
    }, 0) / sentences.length;

    if (avgWordsPerSentence <= 20) {
      return {
        id: 'sentence-length',
        title: 'Sentence length',
        status: 'good',
        message: `Average sentence length is ${avgWordsPerSentence.toFixed(1)} words. Great!`,
        value: avgWordsPerSentence
      };
    } else if (avgWordsPerSentence <= 25) {
      return {
        id: 'sentence-length',
        title: 'Sentence length',
        status: 'ok',
        message: `Average sentence length is ${avgWordsPerSentence.toFixed(1)} words. Consider shorter sentences.`,
        value: avgWordsPerSentence
      };
    } else {
      return {
        id: 'sentence-length',
        title: 'Sentence length',
        status: 'bad',
        message: `Average sentence length is ${avgWordsPerSentence.toFixed(1)} words. Too long!`,
        value: avgWordsPerSentence
      };
    }
  }

  private checkParagraphLength(): ReadabilityCheck {
    const paragraphs = this.content.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    const longParagraphs = paragraphs.filter(p => p.split(/\s+/).length > 150);

    if (longParagraphs.length === 0) {
      return {
        id: 'paragraph-length',
        title: 'Paragraph length',
        status: 'good',
        message: 'All paragraphs are a good length.',
      };
    } else if (longParagraphs.length <= 2) {
      return {
        id: 'paragraph-length',
        title: 'Paragraph length',
        status: 'ok',
        message: `${longParagraphs.length} paragraph(s) are quite long. Consider breaking them up.`,
      };
    } else {
      return {
        id: 'paragraph-length',
        title: 'Paragraph length',
        status: 'bad',
        message: `${longParagraphs.length} paragraphs are too long. Break them into shorter paragraphs.`,
      };
    }
  }

  private checkSubheadingDistribution(): ReadabilityCheck {
    const words = this.content.split(/\s+/).length;
    const headings = (this.content.match(/<h[2-6][^>]*>/gi) || []).length;
    const wordsPerHeading = headings > 0 ? words / headings : words;

    if (wordsPerHeading <= 300) {
      return {
        id: 'subheading-distribution',
        title: 'Subheading distribution',
        status: 'good',
        message: 'Good use of subheadings to break up content.',
      };
    } else if (wordsPerHeading <= 500) {
      return {
        id: 'subheading-distribution',
        title: 'Subheading distribution',
        status: 'ok',
        message: 'Consider adding more subheadings to improve readability.',
      };
    } else {
      return {
        id: 'subheading-distribution',
        title: 'Subheading distribution',
        status: 'bad',
        message: 'Add more subheadings to break up long sections of text.',
      };
    }
  }

  private checkPassiveVoice(): ReadabilityCheck {
    const passivePatterns = [
      /\b(am|is|are|was|were|be|been|being)\s+\w*ed\b/gi,
      /\b(am|is|are|was|were|be|been|being)\s+\w*en\b/gi
    ];
    
    const sentences = this.content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const passiveSentences = sentences.filter(sentence => 
      passivePatterns.some(pattern => pattern.test(sentence))
    );
    
    const passivePercentage = (passiveSentences.length / sentences.length) * 100;

    if (passivePercentage <= 10) {
      return {
        id: 'passive-voice',
        title: 'Passive voice',
        status: 'good',
        message: `${passivePercentage.toFixed(1)}% passive voice. Great!`,
        value: passivePercentage
      };
    } else if (passivePercentage <= 20) {
      return {
        id: 'passive-voice',
        title: 'Passive voice',
        status: 'ok',
        message: `${passivePercentage.toFixed(1)}% passive voice. Try to use more active voice.`,
        value: passivePercentage
      };
    } else {
      return {
        id: 'passive-voice',
        title: 'Passive voice',
        status: 'bad',
        message: `${passivePercentage.toFixed(1)}% passive voice. Too much! Use more active voice.`,
        value: passivePercentage
      };
    }
  }

  private checkTransitionWords(): ReadabilityCheck {
    const transitionWords = [
      'however', 'therefore', 'furthermore', 'moreover', 'additionally',
      'consequently', 'meanwhile', 'nevertheless', 'nonetheless', 'similarly',
      'likewise', 'in contrast', 'on the other hand', 'for example', 'for instance',
      'in conclusion', 'finally', 'first', 'second', 'third', 'next', 'then'
    ];
    
    const sentences = this.content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const sentencesWithTransitions = sentences.filter(sentence =>
      transitionWords.some(word => 
        sentence.toLowerCase().includes(word.toLowerCase())
      )
    );
    
    const transitionPercentage = (sentencesWithTransitions.length / sentences.length) * 100;

    if (transitionPercentage >= 30) {
      return {
        id: 'transition-words',
        title: 'Transition words',
        status: 'good',
        message: `${transitionPercentage.toFixed(1)}% of sentences contain transition words. Excellent!`,
        value: transitionPercentage
      };
    } else if (transitionPercentage >= 20) {
      return {
        id: 'transition-words',
        title: 'Transition words',
        status: 'ok',
        message: `${transitionPercentage.toFixed(1)}% of sentences contain transition words. Good!`,
        value: transitionPercentage
      };
    } else {
      return {
        id: 'transition-words',
        title: 'Transition words',
        status: 'bad',
        message: `Only ${transitionPercentage.toFixed(1)}% of sentences contain transition words. Add more!`,
        value: transitionPercentage
      };
    }
  }

  private calculateSEOScore(checks: SEOCheck[]): number {
    const weights = { high: 3, medium: 2, low: 1 };
    const statusPoints = { good: 1, ok: 0.5, bad: 0 };
    
    let totalWeight = 0;
    let weightedScore = 0;
    
    checks.forEach(check => {
      const weight = weights[check.impact];
      const points = statusPoints[check.status];
      totalWeight += weight;
      weightedScore += points * weight;
    });
    
    return totalWeight > 0 ? (weightedScore / totalWeight) * 100 : 0;
  }

  private calculateReadabilityScore(checks: ReadabilityCheck[]): number {
    const statusPoints = { good: 1, ok: 0.6, bad: 0.2 };
    
    const totalPoints = checks.reduce((sum, check) => {
      return sum + statusPoints[check.status];
    }, 0);
    
    return checks.length > 0 ? (totalPoints / checks.length) * 100 : 0;
  }
}

export type { SEOAnalysis, SEOCheck, ReadabilityCheck };