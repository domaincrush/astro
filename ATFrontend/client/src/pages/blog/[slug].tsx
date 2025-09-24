import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { Calendar, Clock, Tag, User, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";
import { Button } from "src/components/ui/button";
import { Badge } from "src/components/ui/badge";
import { Card, CardContent } from "src/components/ui/card";
import ReactMarkdown from "react-markdown";

interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  metaDescription: string;
  keywords: string[];
  category: string;
  publishedAt: string;
  readTime: string;
  author: string;
  language: string;
}

export default function BlogArticlePage() {
  const params = useParams();
  const slug = params.slug;

  const {
    data: articleResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: [`/api/blog-articles/${slug}`],
    queryFn: async () => {
      const res = await fetch(`/api/blog-articles/${slug}`);
      const data = await res.json();

      // Check if the API returned an error
      if (!data.success) {
        throw new Error(data.error || "Failed to fetch article");
      }

      return data;
    },
    enabled: !!slug, // Only run query if slug exists
  });

  const article: BlogArticle | null = articleResponse?.article || null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <AstroTickHeader />
        <div className="container mx-auto px-4 py-8 pt-24">
          <div className="animate-pulse max-w-4xl mx-auto">
            <div className="h-12 bg-gray-200 rounded-lg w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
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
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <AstroTickHeader />
        <div className="container mx-auto px-4 py-8 pt-24">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="text-center py-12">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Article Not Found
              </h1>
              <p className="text-gray-600 mb-6">
                The article you're looking for doesn't exist or has been
                removed.
              </p>
              <Link to="/blog">
                <Button>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Blog
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{article.title} | AstroTick Blog</title>
        <meta name="description" content={article.metaDescription} />
        <meta name="keywords" content={article.keywords.join(", ")} />
        <link
          rel="canonical"
          href={`https://astrotick.com/blog/${article.slug}`}
        />

        {/* Open Graph */}
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.metaDescription} />
        <meta
          property="og:url"
          content={`https://astrotick.com/blog/${article.slug}`}
        />
        <meta property="og:type" content="article" />
        <meta property="article:author" content={article.author} />
        <meta property="article:published_time" content={article.publishedAt} />
        <meta property="article:section" content={article.category} />

        {/* Twitter */}
        <meta name="twitter:title" content={article.title} />
        <meta name="twitter:description" content={article.metaDescription} />

        {/* Schema.org structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: article.title,
            description: article.metaDescription,
            author: {
              "@type": "Person",
              name: article.author,
            },
            datePublished: article.publishedAt,
            publisher: {
              "@type": "Organization",
              name: "AstroTick",
              url: "https://astrotick.com",
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `https://astrotick.com/blog/${article.slug}`,
            },
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <AstroTickHeader />

        <article className="container mx-auto px-4 py-8 pt-24">
          <div className="max-w-4xl mx-auto">
            {/* Navigation */}
            <div className="mb-8">
              <Link to="/blog">
                <Button variant="outline" className="mb-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Blog
                </Button>
              </Link>
            </div>

            {/* Article Header */}
            <header className="mb-8">
              <div className="mb-4">
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-800 border-blue-200"
                >
                  {article.category}
                </Badge>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
                {article.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-gray-600">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{article.author}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(article.publishedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{article.readTime} read</span>
                </div>
              </div>

              {article.keywords.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {article.keywords.map((keyword, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      <Tag className="h-3 w-3 mr-1" />
                      {keyword}
                    </Badge>
                  ))}
                </div>
              )}
            </header>

            {/* Article Content */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-lg">
              <div
                className="prose prose-lg prose-slate max-w-none leading-relaxed text-gray-800 
                             prose-headings:font-bold prose-headings:text-gray-900 
                             prose-h1:text-3xl prose-h1:mb-6 prose-h1:mt-8
                             prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-6 prose-h2:border-b prose-h2:border-orange-200 prose-h2:pb-2
                             prose-h3:text-xl prose-h3:mb-3 prose-h3:mt-5 prose-h3:text-orange-700
                             prose-h4:text-lg prose-h4:mb-2 prose-h4:mt-4 prose-h4:text-orange-600
                             prose-p:mb-4 prose-p:leading-relaxed prose-p:text-gray-700
                             prose-strong:font-semibold prose-strong:text-gray-900
                             prose-em:italic prose-em:text-gray-800
                             prose-ul:my-4 prose-ol:my-4
                             prose-li:mb-2 prose-li:text-gray-700
                             prose-blockquote:border-l-orange-500 prose-blockquote:bg-orange-50 prose-blockquote:p-4 prose-blockquote:my-4
                             prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
                             prose-pre:bg-gray-900 prose-pre:text-white prose-pre:p-4 prose-pre:rounded-lg
                             prose-a:text-orange-600 prose-a:no-underline hover:prose-a:text-orange-800 hover:prose-a:underline"
              >
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-3xl font-bold text-gray-900 mb-6 mt-8 border-b-2 border-orange-300 pb-3">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-6 border-b border-orange-200 pb-2">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-xl font-bold text-orange-700 mb-3 mt-5">
                        {children}
                      </h3>
                    ),
                    h4: ({ children }) => (
                      <h4 className="text-lg font-semibold text-orange-600 mb-2 mt-4">
                        {children}
                      </h4>
                    ),
                    p: ({ children, ...props }) => {
                      // Handle special emoji-based formatting
                      const content = children?.toString() || "";

                      // Handle emoji headers like "🌟 Introduction"
                      if (content.match(/^[🌟💰🔮🪐🕉❓🌑🌙🔹📍👉✅]/)) {
                        return (
                          <div className="mb-6 mt-8">
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-700 to-amber-700 bg-clip-text text-transparent flex items-center gap-2">
                              {children}
                            </h2>
                            <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full mt-2"></div>
                          </div>
                        );
                      }

                      // Handle Q&A format
                      if (content.match(/^Q\d*:/)) {
                        return (
                          <div className="mb-4 p-4 bg-gradient-to-r from-orange-50 to-amber-50 border-l-4 border-orange-500 rounded-lg">
                            <p className="font-semibold text-orange-800 mb-2">
                              {children}
                            </p>
                          </div>
                        );
                      }

                      if (content.match(/^A\d*:/)) {
                        return (
                          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-lg">
                            <p className="text-gray-700 leading-relaxed">
                              {children}
                            </p>
                          </div>
                        );
                      }

                      return (
                        <p className="mb-4 leading-relaxed text-gray-700 text-base">
                          {children}
                        </p>
                      );
                    },
                    strong: ({ children }) => (
                      <strong className="font-semibold text-gray-900 bg-amber-100/50 px-1 py-0.5 rounded">
                        {children}
                      </strong>
                    ),
                    em: ({ children }) => (
                      <em className="italic text-gray-800">{children}</em>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-none pl-0 my-4 space-y-3">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal pl-6 my-4 space-y-2">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => {
                      const content = children?.toString() || "";

                      // Handle emoji bullets
                      if (content.match(/^[✅🔹📍👉]/)) {
                        return (
                          <li className="flex text-sm items-start gap-3 text-gray-700 leading-relaxed mb-3 p-3 bg-gradient-to-r from-orange-50/50 to-amber-50/30 rounded-lg border-l-2 border-orange-300">
                            {children}
                          </li>
                        );
                      }

                      return (
                        <li className="text-gray-700 leading-relaxed flex items-start gap-2">
                          <span className="text-orange-500 font-bold mt-1">
                            •
                          </span>
                          <span>{children}</span>
                        </li>
                      );
                    },
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-orange-500 bg-gradient-to-r from-orange-50 to-amber-50 p-6 my-6 italic rounded-lg shadow-md">
                        <div className="text-lg text-gray-800 leading-relaxed">
                          {children}
                        </div>
                      </blockquote>
                    ),
                    code: ({ children, className }) =>
                      className ? (
                        <pre className="bg-gray-900 text-white p-4 rounded-lg overflow-x-auto my-4">
                          <code className={className}>{children}</code>
                        </pre>
                      ) : (
                        <code className="bg-orange-100 px-2 py-1 rounded text-sm font-mono text-orange-800">
                          {children}
                        </code>
                      ),
                    table: ({ children }) => (
                      <div className="overflow-x-auto text-sm my-6 grid ">
                        <table className="min-w-full bg-white border border-orange-200 rounded-lg overflow-hidden shadow-md">
                          {children}
                        </table>
                      </div>
                    ),
                    thead: ({ children }) => (
                      <thead className="bg-gradient-to-r from-orange-500 to-amber-500 text-white">
                        {children}
                      </thead>
                    ),
                    th: ({ children }) => (
                      <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                        {children}
                      </th>
                    ),
                    td: ({ children }) => (
                      <td className="px-6 py-4 text-sm text-gray-700 border-b border-orange-100">
                        {children}
                      </td>
                    ),
                    tr: ({ children }) => (
                      <tr className="hover:bg-orange-50 transition-colors">
                        {children}
                      </tr>
                    ),
                  }}
                >
                  {article.content}
                </ReactMarkdown>
              </div>
            </div>

            {/* Call-to-Action */}
            <div className="mt-12 p-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white text-center">
              <h3 className="text-2xl font-bold mb-4">
                Get Your Personalized Astrological Analysis
              </h3>
              <p className="text-blue-100 mb-6">
                Experience authentic Vedic calculations and personalized
                insights based on your birth chart
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/sade-sati-calculator">
                  <Button
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-gray-100"
                  >
                    Calculate Sade Sati Phase
                  </Button>
                </Link>
                <Link to="/premium-report">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-blue-600 hover:bg-white/10"
                  >
                    Get Premium Report
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </article>

        <Footer />
      </div>
    </>
  );
}
