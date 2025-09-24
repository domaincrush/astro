import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import {
  Calendar,
  Clock,
  Tag,
  Eye,
  Globe,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import { formatDate } from "src/lib/utils";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";

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

const ARTICLES_PER_PAGE = 9;

export default function BlogCategory() {
  const params = useParams<{ category: string }>();
  const categorySlug = params.category;
  const [currentPage, setCurrentPage] = useState(1);

  const { data: categoryData, isLoading: categoryLoading } = useQuery({
    queryKey: ["blog-category", categorySlug],
    queryFn: async () => {
      const res = await fetch(`/api/blog-articles?category=${categorySlug}`);
      if (!res.ok) throw new Error("Failed to fetch category articles");
      return res.json();
    },
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  // Get articles and category info
  const articles = categoryData?.articles || [];
  const category = categories?.find((c) => c.slug === categorySlug);

  // Pagination calculations
  const totalArticles = articles.length;
  const totalPages = Math.ceil(totalArticles / ARTICLES_PER_PAGE);
  const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE;
  const endIndex = startIndex + ARTICLES_PER_PAGE;
  const currentArticles = articles.slice(startIndex, endIndex);

  // Reset current page when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [categorySlug]);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  if (categoryLoading) {
    return (
      <>
        <Helmet>
          <title>Loading Category - AstroTick Blog</title>
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

  const categoryName = category?.name || categorySlug;
  const categoryColor = category?.color || "#8B5CF6";

  return (
    <>
      <Helmet>
        <title>{categoryName} Articles - AstroTick Blog</title>
        <meta
          name="description"
          content={`Read ${categoryName} articles on AstroTick. Explore authentic Vedic astrology insights, predictions, and spiritual guidance in the ${categoryName} category.`}
        />
        <meta
          name="keywords"
          content={`${categoryName}, astrology articles, vedic astrology, horoscope, spiritual guidance, ${categorySlug}`}
        />
        <link rel="canonical" href={`https://astrotick.com/blog/category/${categorySlug}`} />

        <meta
          property="og:title"
          content={`${categoryName} Articles - AstroTick Blog`}
        />
        <meta
          property="og:description"
          content={`Read ${categoryName} articles on AstroTick. Explore authentic Vedic astrology insights and predictions.`}
        />
        <meta property="og:url" content={`https://astrotick.com/blog/category/${categorySlug}`} />
        <meta property="og:type" content="website" />

        <meta
          property="twitter:title"
          content={`${categoryName} Articles - AstroTick Blog`}
        />
        <meta
          property="twitter:description"
          content={`Read ${categoryName} articles on AstroTick. Explore authentic Vedic astrology insights and predictions.`}
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <AstroTickHeader />
        <div className="container mx-auto px-4 py-8 pt-24">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <Link href="/blog">
                <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Blog
                </button>
              </Link>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl shadow-lg"
                  style={{ backgroundColor: categoryColor }}
                >
                  {category?.icon || "📚"}
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {categoryName}
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Explore articles in the {categoryName} category
              </p>
              {totalArticles > 0 && (
                <p className="text-gray-500 mt-2">
                  {totalArticles} article{totalArticles > 1 ? 's' : ''} found
                </p>
              )}
            </div>
          </div>

          {/* Articles Grid */}
          <div className="mb-12">
            {articles.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  No Articles Found
                </h3>
                <p className="text-gray-600 mb-6">
                  No articles are currently available in the {categoryName} category.
                </p>
                <Link href="/blog">
                  <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:from-blue-500 hover:to-purple-500 transition-all duration-300">
                    Browse All Articles
                  </button>
                </Link>
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {currentArticles.map((article) => (
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
                            style={{ backgroundColor: categoryColor }}
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

                    <div className="flex gap-2 mx-4">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (pageNum) => {
                          const showPage =
                            pageNum === 1 ||
                            pageNum === totalPages ||
                            (pageNum >= currentPage - 1 &&
                              pageNum <= currentPage + 1);

                          if (!showPage) {
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
                                  ? "bg-blue-600 text-white shadow-lg"
                                  : "bg-white/90 backdrop-blur-md text-gray-700 hover:bg-white/95 shadow-md"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        }
                      )}
                    </div>

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
        </div>
        <Footer />
      </div>
    </>
  );
}