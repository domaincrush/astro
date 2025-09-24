import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import {
  Calendar,
  Clock,
  Tag,
  Eye,
  Globe,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { formatDate } from "src/lib/utils";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "src/components/ui/select";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import DeferredSection from "src/components/DeferredSection";
import LazyImage from "src/components/LazyImage";

interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage?: string;
  category: string;
  tags: string[];
  readTime: number;
  viewCount: number;
  publishedAt: string;
  language: string;
  author: {
    username: string;
    profileImage?: string;
  };
}

interface Category {
  id: number;
  name: string;
  slug: string;
  color: string;
  icon: string;
  language?: string;
}

const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English" },
  { code: "hi", name: "Hindi (हिंदी)" },
  { code: "bn", name: "Bengali (বাংলা)" },
  { code: "te", name: "Telugu (తెలుగు)" },
  { code: "mr", name: "Marathi (मराठी)" },
  { code: "ta", name: "Tamil (தமிழ்)" },
  { code: "gu", name: "Gujarati (ગુજરાતી)" },
  { code: "kn", name: "Kannada (ಕನ್ನಡ)" },
  { code: "ml", name: "Malayalam (മലയാളം)" },
  { code: "or", name: "Odia (ଓଡ଼ିଆ)" },
  { code: "pa", name: "Punjabi (ਪੰਜਾਬੀ)" },
  { code: "as", name: "Assamese (অসমীয়া)" },
  { code: "ur", name: "Urdu (اردو)" },
  { code: "es", name: "Spanish (Español)" },
  { code: "fr", name: "French (Français)" },
  { code: "de", name: "German (Deutsch)" },
  { code: "pt", name: "Portuguese (Português)" },
  { code: "ja", name: "Japanese (日本語)" },
  { code: "zh", name: "Chinese (中文)" },
  { code: "ar", name: "Arabic (العربية)" },
  { code: "ru", name: "Russian (Русский)" },
];

const ARTICLES_PER_PAGE = 9; // 3x3 grid per page

export default function Blog() {
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: blogResponse, isLoading: articlesLoading } = useQuery({
    queryKey: ["blog-articles", selectedLanguage],
    queryFn: async () => {
      const res = await fetch(
        `/api/blog-articles?language=${selectedLanguage}`,
      );
      if (!res.ok) throw new Error("Failed to fetch articles");
      return res.json();
    },
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery<
    Category[]
  >({
    queryKey: ["/api/categories"],
  });

  // Get articles from API response - handle both direct array and success wrapper
  const filteredArticles = Array.isArray(blogResponse)
    ? blogResponse
    : blogResponse?.success
      ? blogResponse?.articles || []
      : blogResponse?.articles || [];

  // Filter categories by selected language or show English categories
  const filteredCategories = Array.isArray(categories)
    ? categories.filter(
        (category: any) =>
          category.language === selectedLanguage ||
          (!category.language && selectedLanguage === "en"),
      )
    : [];

  // Pagination calculations
  const totalArticles = filteredArticles.length;
  const totalPages = Math.ceil(totalArticles / ARTICLES_PER_PAGE);
  const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE;
  const endIndex = startIndex + ARTICLES_PER_PAGE;
  const currentArticles = filteredArticles.slice(startIndex, endIndex);

  // Reset current page when language changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedLanguage]);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  if (articlesLoading || categoriesLoading) {
    return (
      <>
        <Helmet>
          <title>Astrology Blog & Articles | AstroTick Vedic Insights</title>
          <meta
            name="description"
            content="Read authentic Vedic astrology articles, horoscope predictions, and spiritual insights. Expert astrology content covering kundli, palmistry, and cosmic guidance."
          />
          <meta
            name="keywords"
            content="astrology blog, vedic astrology articles, horoscope predictions, kundli insights, palmistry, spiritual guidance, astrology news"
          />
          <link rel="canonical" href="https://astrotick.com/blog" />

          {/* Open Graph */}
          <meta
            property="og:title"
            content="Astrology Blog & Articles - AstroTick Vedic Insights"
          />
          <meta
            property="og:description"
            content="Read authentic Vedic astrology articles and horoscope predictions from expert astrologers."
          />
          <meta property="og:url" content="https://astrotick.com/blog" />
          <meta property="og:type" content="website" />

          {/* Twitter */}
          <meta
            property="twitter:title"
            content="Astrology Blog & Articles - AstroTick Vedic Insights"
          />
          <meta
            property="twitter:description"
            content="Read authentic Vedic astrology articles and horoscope predictions from expert astrologers."
          />

          {/* Schema */}
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Blog",
              name: "AstroTick Astrology Blog",
              description:
                "Authentic Vedic astrology articles and spiritual insights",
              url: "https://astrotick.com/blog",
            })}
          </script>
        </Helmet>

        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
          <AstroTickHeader />
          <div className="container mx-auto px-4 py-8 pt-24">
            <div className="animate-pulse space-y-8">
              <div className="h-12 bg-gray-200 rounded-lg w-1/3"></div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="bg-white shadow-lg rounded-lg p-6 space-y-4"
                  >
                    <div className="h-40 bg-gray-200 rounded-lg"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Astrology Blog & Articles | AstroTick Vedic Insights</title>
        <meta
          name="description"
          content="Read authentic Vedic astrology articles, horoscope predictions, and spiritual insights. Expert astrology content covering kundli, palmistry, and cosmic guidance."
        />
        <meta
          name="keywords"
          content="astrology blog, vedic astrology articles, horoscope predictions, kundli insights, palmistry, spiritual guidance, astrology news"
        />
        <link rel="canonical" href="https://astrotick.com/blog" />

        {/* Open Graph */}
        <meta
          property="og:title"
          content="Astrology Blog & Articles - AstroTick Vedic Insights"
        />
        <meta
          property="og:description"
          content="Read authentic Vedic astrology articles and horoscope predictions from expert astrologers."
        />
        <meta property="og:url" content="https://astrotick.com/blog" />
        <meta property="og:type" content="website" />

        {/* Twitter */}
        <meta
          property="twitter:title"
          content="Astrology Blog & Articles - AstroTick Vedic Insights"
        />
        <meta
          property="twitter:description"
          content="Read authentic Vedic astrology articles and horoscope predictions from expert astrologers."
        />

        {/* Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            name: "AstroTick Astrology Blog",
            description:
              "Authentic Vedic astrology articles and spiritual insights",
            url: "https://astrotick.com/blog",
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <AstroTickHeader />
        <div className="container mx-auto px-4 py-8 pt-24">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Astrology{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Insights
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Discover the wisdom of the stars through our comprehensive guides,
              daily insights, and ancient knowledge
            </p>

            {/* Language Selector */}
            <div className="flex justify-center mb-8">
              <div className="bg-white/80 backdrop-blur-md rounded-lg p-2 shadow-lg">
                <Select
                  value={selectedLanguage}
                  onValueChange={setSelectedLanguage}
                >
                  <SelectTrigger className="w-64 bg-transparent border-gray-200 text-gray-700">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <SelectItem
                        key={lang.code}
                        value={lang.code}
                        className="text-gray-700 hover:bg-gray-100 focus:bg-gray-100"
                      >
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Categories */}
          {filteredCategories && filteredCategories.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Explore Categories
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {filteredCategories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/blog/category/${category.slug}`}
                  >
                    <div className="bg-white/80 backdrop-blur-md rounded-lg p-4 text-center hover:bg-white/90 transition-all duration-300 cursor-pointer group shadow-md hover:shadow-lg">
                      <div className="text-2xl mb-2">{category.icon}</div>
                      <h3 className="text-gray-700 font-medium text-sm group-hover:text-blue-600 transition-colors">
                        {category.name}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Featured Article - Only show on first page */}
          {currentPage === 1 &&
            filteredArticles &&
            filteredArticles.length > 0 && (() => {
              // ✅ Pick article in selected language, else fallback to English
              const featuredArticle =
                filteredArticles.find((a) => a.language === selectedLanguage) ||
                filteredArticles.find((a) => a.language === "en");

              if (!featuredArticle) return null;

              return (
                <div className="mb-12">
                  <div className="bg-white/90 backdrop-blur-md rounded-2xl p-8 md:p-12 shadow-lg">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <span
                            className="px-3 py-1 rounded-full text-sm font-medium text-white"
                            style={{
                              backgroundColor:
                                filteredCategories?.find(
                                  (c) => c.name === featuredArticle.category,
                                )?.color || "#8B5CF6",
                            }}
                          >
                            {featuredArticle.category}
                          </span>
                          <span className="text-blue-600 text-sm font-medium">
                            Featured
                          </span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                          {featuredArticle.title}
                        </h2>
                        <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                          {featuredArticle.excerpt}
                        </p>
                        <div className="flex items-center gap-6 text-gray-500 text-sm mb-6">
                          <div className="flex items-center gap-2">
                            <Calendar size={16} />
                            <span>{formatDate(new Date(featuredArticle.publishedAt))}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock size={16} />
                            <span>{featuredArticle.readTime} min read</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Eye size={16} />
                            <span>{featuredArticle.viewCount} views</span>
                          </div>
                        </div>
                        <Link href={`/blog/${featuredArticle.slug}`}>
                          <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:from-blue-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-105 shadow-md">
                            Read Full Article
                          </button>
                        </Link>
                      </div>

                      {featuredArticle.featuredImage && (
                        <div className="order-first md:order-last">
                          <img
                            src={featuredArticle.featuredImage}
                            alt={featuredArticle.title}
                            className="w-full h-64 md:h-80 object-cover rounded-xl shadow-2xl"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}


          {/* Articles Grid */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  {currentPage === 1
                    ? "Latest Articles"
                    : `Articles - Page ${currentPage}`}
                </h2>
                {totalArticles > 0 && (
                  <p className="text-gray-600 text-sm mt-1">
                    Showing {startIndex + 1}-{Math.min(endIndex, totalArticles)}{" "}
                    of {totalArticles} articles
                  </p>
                )}
              </div>
            </div>

            {filteredArticles.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  No Articles Available
                </h3>
                <p className="text-gray-600 mb-6">
                  No articles are currently available in{" "}
                  {SUPPORTED_LANGUAGES.find(
                    (lang) => lang.code === selectedLanguage,
                  )?.name || selectedLanguage}
                  .
                </p>
                <button
                  onClick={() => setSelectedLanguage("en")}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:from-blue-500 hover:to-purple-500 transition-all duration-300"
                >
                  View English Articles
                </button>
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {(currentPage === 1
                    ? currentArticles.slice(1)
                    : currentArticles
                  ).map((article) => (
                    <article
                      key={article.id}
                      className="bg-white/90 backdrop-blur-md rounded-xl overflow-hidden hover:bg-white/95 transition-all duration-300 group shadow-lg hover:shadow-xl"
                    >
                      {article.featuredImage && (
                        <div className="h-48 overflow-hidden">
                          <img
                            src={article.featuredImage}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      )}

                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <span
                            className="px-2 py-1 rounded-full text-xs font-medium text-white"
                            style={{
                              backgroundColor:
                                filteredCategories?.find(
                                  (c) => c.name === article.category,
                                )?.color || "#8B5CF6",
                            }}
                          >
                            {article.category}
                          </span>
                        </div>

                        <Link href={`/blog/${article.slug}`}>
                          <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                            {article.title}
                          </h3>
                        </Link>

                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {article.excerpt}
                        </p>

                        <div className="flex items-center justify-between text-gray-500 text-xs mb-4">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Clock size={12} />
                              <span>{article.readTime} min</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye size={12} />
                              <span>{article.viewCount}</span>
                            </div>
                          </div>
                          <span>
                            {formatDate(new Date(article.publishedAt))}
                          </span>
                        </div>

                        {article.tags && article.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {article.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs text-gray-600"
                              >
                                <Tag size={10} />
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <Link href={`/blog/${article.slug}`}>
                          <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg font-medium hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-md">
                            Read More
                          </button>
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center mt-12 gap-2">
                    {/* Previous Button */}
                    <button
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      disabled={currentPage === 1}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/90 backdrop-blur-md shadow-md hover:bg-white/95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </button>

                    {/* Page Numbers */}
                    <div className="flex gap-2 mx-4">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (pageNum) => {
                          // Show first page, last page, current page, and pages around current
                          const showPage =
                            pageNum === 1 ||
                            pageNum === totalPages ||
                            (pageNum >= currentPage - 1 &&
                              pageNum <= currentPage + 1);

                          if (!showPage) {
                            // Show ellipsis if there's a gap
                            if (
                              pageNum === currentPage - 2 ||
                              pageNum === currentPage + 2
                            ) {
                              return (
                                <span
                                  key={pageNum}
                                  className="px-3 py-2 text-gray-500"
                                >
                                  ...
                                </span>
                              );
                            }
                            return null;
                          }

                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                                currentPage === pageNum
                                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                                  : "bg-white/90 backdrop-blur-md text-gray-700 hover:bg-white/95 shadow-md hover:shadow-lg"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        },
                      )}
                    </div>

                    {/* Next Button */}
                    <button
                      onClick={() =>
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/90 backdrop-blur-md shadow-md hover:bg-white/95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Newsletter Signup */}
          <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-8 text-center shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Stay Connected with the Cosmos
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Get weekly horoscopes, astrological insights, and exclusive
              content delivered to your inbox
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-white/80 backdrop-blur-md text-gray-700 placeholder-gray-400 border border-gray-200 focus:border-blue-500 focus:outline-none"
              />
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-md">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
