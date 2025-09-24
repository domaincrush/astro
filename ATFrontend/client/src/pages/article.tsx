import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Calendar, Clock, User, Tag, Eye, ArrowLeft, Share2 } from "lucide-react";
import { formatDate } from "src/lib/utils";
import { useEffect, useMemo } from "react";
import { ArticleWithAuthor } from "@/../../shared/schema";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";
import { findArticleBySlug, generatePlaceholderContent } from "src/data/blog-articles";

export default function Article() {
  const { slug } = useParams<{ slug: string }>();
  
  // Check for hardcoded blog articles first
  const hardcodedArticle = useMemo(() => {
    if (!slug) return null;
    const found = findArticleBySlug(slug);
    if (found) {
      return {
        ...found,
        content: found.content || generatePlaceholderContent(found),
        author: { name: "AstroTick Expert Team", email: "experts@astrotick.com" },
        metaTitle: `${found.title} | AstroTick`,
        metaDescription: found.excerpt,
        metaKeywords: [found.category, "astrology", "vedic astrology", "2025", "predictions"],
        excerpt: found.excerpt,
        publishedAt: found.date,
        updatedAt: found.date,
        viewCount: 0,
        featuredImage: null,
        tags: [found.category]
      };
    }
    return null;
  }, [slug]);
  
  // Only query API if no hardcoded article found
  const { data: apiArticle, isLoading, error } = useQuery<ArticleWithAuthor>({
    queryKey: [`/api/articles/${slug}`],
    enabled: !!slug && !hardcodedArticle,
  });
  
  // Use hardcoded article if available, otherwise use API article
  const article = hardcodedArticle || apiArticle;

  // Set page title and meta description for SEO
  useEffect(() => {
    if (article) {
      document.title = article.metaTitle || `${article.title} | AstroTick`;
      
      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', article.metaDescription || article.excerpt);
      } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = article.metaDescription || article.excerpt;
        document.head.appendChild(meta);
      }

      // Update meta keywords
      if (article.metaKeywords && article.metaKeywords.length > 0) {
        const metaKeywords = document.querySelector('meta[name="keywords"]');
        if (metaKeywords) {
          metaKeywords.setAttribute('content', article.metaKeywords.join(', '));
        } else {
          const meta = document.createElement('meta');
          meta.name = 'keywords';
          meta.content = article.metaKeywords.join(', ');
          document.head.appendChild(meta);
        }
      }
    }
  }, [article]);

  if (isLoading && !hardcodedArticle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 pt-20">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-32"></div>
            <div className="h-12 bg-gray-200 rounded w-3/4"></div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 pt-20">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Article Not Found</h1>
            <p className="text-gray-600 mb-8">The article you're looking for doesn't exist or has been removed.</p>
            <Link href="/blog">
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-md">
                Back to Blog
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href);
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-orange-100 to-yellow-100" style={{background: 'linear-gradient(135deg, #fef3c7 0%, #fed7aa 50%, #fef3c7 100%)'}}>
      <AstroTickHeader />
      <article className="container mx-auto px-4 py-8 max-w-4xl pt-24">
        {/* Back Button */}
        <div className="mb-8">
          <Link href="/blog">
            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft size={20} />
              Back to Blog
            </button>
          </Link>
        </div>

        {/* Article Header */}
        <header className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium">
              {article.category}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {article.title}
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            {article.excerpt}
          </p>
          
          <div className="flex flex-wrap items-center gap-6 text-gray-500 text-sm mb-8">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{article.publishedAt ? (typeof article.publishedAt === 'string' ? article.publishedAt : formatDate(new Date(article.publishedAt))) : (typeof article.updatedAt === 'string' ? article.updatedAt : formatDate(new Date(article.updatedAt || '')))}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>{article.readTime || 5} min read</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye size={16} />
              <span>{article.viewCount || 0} views</span>
            </div>
            <button 
              onClick={handleShare}
              className="flex items-center gap-2 hover:text-gray-700 transition-colors"
            >
              <Share2 size={16} />
              <span>Share</span>
            </button>
          </div>

          {/* Featured Image */}
          {article.featuredImage && (
            <div className="mb-12 -mx-4 md:-mx-8">
              <img 
                src={article.featuredImage} 
                alt={article.title}
                className="w-full h-auto object-contain rounded-xl shadow-2xl max-h-[500px] md:max-h-[600px]"
              />
            </div>
          )}
        </header>

        {/* Article Content */}
        <div className="bg-gradient-to-br from-white via-amber-50/40 to-orange-50/30 backdrop-blur-md rounded-3xl p-8 md:p-12 mb-12 shadow-2xl border border-amber-200/30" style={{background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(254,243,199,0.7) 50%, rgba(253,213,170,0.5) 100%)'}}>
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ 
              __html: (article.content || '')
                // First process the content to add proper paragraph structure
                .split('\n\n')
                .map(section => {
                  if (section.trim() === '') return '';
                  
                  // Handle emoji headers with elegant styling
                  if (section.match(/^💰 /)) {
                    return `
                      <div class="mb-8 mt-12">
                        <h1 class="text-4xl md:text-5xl font-black bg-gradient-to-r from-amber-700 via-orange-600 to-yellow-600 bg-clip-text text-transparent mb-4 leading-tight text-center">
                          ${section}
                        </h1>
                        <div class="flex justify-center">
                          <div class="w-24 h-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"></div>
                        </div>
                      </div>
                    `;
                  }
                  if (section.match(/^🌟 /)) {
                    return `
                      <div class="mb-6 mt-10 border-l-4 border-amber-500 pl-4">
                        <h2 class="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-800 via-orange-700 to-yellow-700 bg-clip-text text-transparent mb-2 leading-tight">
                          ${section}
                        </h2>
                        <div class="w-16 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"></div>
                      </div>
                    `;
                  }
                  if (section.match(/^🔹 |^❓ /)) {
                    return `
                      <div class="mb-4 mt-6">
                        <h3 class="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-800 via-orange-700 to-yellow-600 bg-clip-text text-transparent leading-tight">
                          ${section}
                        </h3>
                      </div>
                    `;
                  }
                  
                  // Handle numbered items with compact cards
                  if (section.match(/^\d+\.\s+/)) {
                    return `
                      <div class="mb-4 mt-4 p-4 bg-gradient-to-r from-amber-50/50 to-orange-50/30 rounded-lg border-l-3 border-amber-400 shadow-sm hover:shadow-md transition-all duration-200">
                        <h4 class="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-3">
                          <span class="flex-shrink-0 w-7 h-7 bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            ${section.match(/^(\d+)\./) ? section.match(/^(\d+)\./)![1] : '1'}
                          </span>
                          ${section.replace(/^\d+\.\s*/, '')}
                        </h4>
                      </div>
                    `;
                  }
                  
                  // Handle Q&A with stunning amber styling
                  if (section.match(/^Q\d+:/)) {
                    return `
                      <div class="mb-4 mt-6 bg-gradient-to-r from-amber-50/80 to-orange-50/60 border-l-4 border-amber-500 rounded-lg p-5 shadow-md hover:shadow-lg transition-all duration-300">
                        <h4 class="text-lg md:text-xl font-bold text-amber-800 flex items-center gap-2">
                          <span class="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold">Q</span>
                          ${section.replace(/^Q\d+:\s*/, '')}
                        </h4>
                      </div>
                    `;
                  }
                  if (section.match(/^A\d+:/)) {
                    return `
                      <div class="mb-6 bg-gradient-to-r from-amber-100/70 to-orange-100/50 border-l-4 border-orange-500 rounded-lg p-5 shadow-md">
                        <p class="text-lg leading-relaxed text-gray-800 font-medium flex items-start gap-2">
                          <span class="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-orange-500 to-amber-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">A</span>
                          <span>${section.replace(/^A\d+:\s*/, '')}</span>
                        </p>
                      </div>
                    `;
                  }
                  
                  // Handle quotes with luxury styling
                  if (section.match(/^"/)) {
                    return `
                      <div class="relative mb-10 mt-8 p-8 bg-gradient-to-br from-amber-100/80 via-orange-100/60 to-yellow-100/40 rounded-3xl border-2 border-amber-300/50 shadow-2xl">
                        <div class="absolute top-4 left-6 text-8xl text-amber-400/30 font-serif leading-none">"</div>
                        <div class="absolute bottom-4 right-6 text-8xl text-amber-400/30 font-serif leading-none rotate-180">"</div>
                        <blockquote class="relative z-10 px-12 py-4">
                          <p class="text-2xl md:text-3xl leading-relaxed text-gray-800 italic font-bold text-center" style="font-family: 'Georgia', serif;">
                            ${section.replace(/^"|"$/g, '')}
                          </p>
                        </blockquote>
                      </div>
                    `;
                  }
                  
                  // Regular paragraphs with premium typography
                  return `<p class="mb-6 text-xl leading-relaxed text-gray-800 font-medium tracking-wide" style="line-height: 1.8; font-family: 'Georgia', serif;">${section}</p>`;
                })
                .join('')
                
                // Handle strong text within content
                .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-black text-amber-800 bg-amber-100/70 px-2 py-1 rounded-lg shadow-sm">$1</strong>')
            }}
          />
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Tags</h3>
            <div className="flex flex-wrap gap-3">
              {article.tags.map((tag: string) => (
                <span 
                  key={tag}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200 transition-all duration-300"
                >
                  <Tag size={14} />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}



        {/* Call to Action */}
        <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl p-8 text-center shadow-lg" style={{background: 'linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%)'}}>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready for a Personal Reading?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Take your astrological journey to the next level with a personalized consultation from our expert astrologers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/astrologers">
              <button className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-3 rounded-full font-semibold hover:from-amber-500 hover:to-orange-500 transition-all duration-300 shadow-md">
                Browse Astrologers
              </button>
            </Link>
            <Link href="/blog">
              <button className="bg-white/80 backdrop-blur-md text-gray-700 px-8 py-3 rounded-full font-semibold hover:bg-white/90 transition-all duration-300 shadow-md">
                Read More Articles
              </button>
            </Link>
          </div>
        </div>
      </article>
      <Footer />
    </div>
  );
}