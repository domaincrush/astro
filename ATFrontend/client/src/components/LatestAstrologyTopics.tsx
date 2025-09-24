import { useState } from "react";
import { Card, CardContent } from "src/components/ui/card";
import { Button } from "src/components/ui/button";
import { Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { useLocation } from "wouter";
import {
  blogArticles,
  createSlugFromTitle,
  generatePlaceholderContent,
} from "src/data/blog-articles";

// Add placeholder content for articles without full content
const enhancedBlogArticles = blogArticles
  .map((article) => ({
    ...article,
    content: article.content || generatePlaceholderContent(article),
  }))
  .concat([
    {
      id: 4,
      title:
        "Mercury Retrograde in Virgo (August 2025): How to Navigate Miscommunication and Delays",
      date: "August 23, 2025",
      readTime: "6 min read",
      category: "Retrograde",
      gradient: "from-green-500 to-teal-600",
      excerpt:
        "Mercury retrograde in Virgo brings heightened attention to details, communication glitches, and the need for careful planning in practical matters.",
      content: "",
    },
    {
      id: 5,
      title:
        "Full Moon in Aquarius (August 10, 2025): Awakening Collective Wisdom",
      date: "August 10, 2025",
      readTime: "8 min read",
      category: "Lunar",
      gradient: "from-purple-500 to-violet-600",
      excerpt:
        "The Full Moon in Aquarius illuminates humanitarian ideals and collective consciousness, urging us to think beyond personal interests.",
      content: "",
    },
    {
      id: 6,
      title:
        "New Moon in Leo (August 25, 2025): A Fresh Start for Creativity and Confidence",
      date: "August 25, 2025",
      readTime: "7 min read",
      category: "Lunar",
      gradient: "from-yellow-500 to-orange-600",
      excerpt:
        "The New Moon in Leo offers a powerful opportunity to set intentions around creativity, self-expression, and personal leadership.",
      content: "",
    },
    {
      id: 7,
      title: "Mars in Libra (September 2025): Balancing Action and Harmony",
      date: "September 3, 2025",
      readTime: "8 min read",
      category: "Transit",
      gradient: "from-red-500 to-pink-600",
      excerpt:
        "Mars enters diplomatic Libra, emphasizing the need to balance assertiveness with cooperation in all areas of life.",
      content: "",
    },
    {
      id: 8,
      title:
        "Jupiter Direct in Gemini (September 2025): Expanding Knowledge and Networking",
      date: "September 7, 2025",
      readTime: "9 min read",
      category: "Direct Motion",
      gradient: "from-blue-500 to-cyan-600",
      excerpt:
        "Jupiter's direct motion in Gemini accelerates learning, communication, and opportunities for intellectual growth and networking.",
      content: "",
    },
    {
      id: 9,
      title:
        "Saturn Retrograde in Pisces: Lessons of Compassion and Discipline",
      date: "September 10, 2025",
      readTime: "10 min read",
      category: "Retrograde",
      gradient: "from-indigo-500 to-purple-600",
      excerpt:
        "Saturn's retrograde journey through Pisces invites deep reflection on spiritual responsibilities and compassionate leadership.",
      content: "",
    },
    {
      id: 10,
      title:
        "Rahu in Aries, Ketu in Libra Transit 2025: How the Nodes Shape Destiny",
      date: "September 12, 2025",
      readTime: "11 min read",
      category: "Nodes",
      gradient: "from-gray-600 to-gray-800",
      excerpt:
        "The nodal axis shift brings focus to individual initiative versus partnership balance, shaping karmic lessons for the next 18 months.",
      content: "",
    },
    {
      id: 11,
      title: "Ganesh Chaturthi 2025: Astrological Significance of Lord Ganesha",
      date: "September 15, 2025",
      readTime: "8 min read",
      category: "Festival",
      gradient: "from-orange-500 to-red-600",
      excerpt:
        "Explore the astrological significance of Lord Ganesha and how this sacred festival can remove obstacles and bring prosperity.",
      content: "",
    },
    {
      id: 12,
      title: "Pitru Paksha 2025: Honoring Ancestors with Astrological Remedies",
      date: "September 17, 2025",
      readTime: "9 min read",
      category: "Festival",
      gradient: "from-brown-500 to-amber-700",
      excerpt:
        "Discover powerful astrological remedies and rituals during Pitru Paksha to honor ancestors and resolve karmic debts.",
      content: "",
    },
    {
      id: 13,
      title:
        "Sharad Navratri 2025: Divine Feminine Energies and Planetary Alignments",
      date: "September 20, 2025",
      readTime: "10 min read",
      category: "Festival",
      gradient: "from-pink-500 to-purple-600",
      excerpt:
        "The nine nights of Navratri align with cosmic energies to awaken divine feminine power and spiritual transformation.",
      content: "",
    },
    {
      id: 14,
      title:
        "Solar Eclipse in Virgo (September 2025): Karmic Resets and New Beginnings",
      date: "September 22, 2025",
      readTime: "12 min read",
      category: "Eclipse",
      gradient: "from-black to-gray-700",
      excerpt:
        "The solar eclipse in Virgo brings powerful karmic resets, urging us to purify our intentions and embrace practical spirituality.",
      content: "",
    },
    {
      id: 15,
      title:
        "Lunar Eclipse in Pisces (September 2025): Emotional Cleansing and Spiritual Growth",
      date: "September 24, 2025",
      readTime: "11 min read",
      category: "Eclipse",
      gradient: "from-blue-700 to-indigo-800",
      excerpt:
        "The lunar eclipse in Pisces offers deep emotional healing and the opportunity to release old patterns that no longer serve.",
      content: "",
    },
    {
      id: 16,
      title:
        "Venus Combust in Leo (September 2025): Challenges in Relationships and Finance",
      date: "September 26, 2025",
      readTime: "8 min read",
      category: "Combust",
      gradient: "from-red-500 to-orange-600",
      excerpt:
        "When Venus becomes combust in Leo, relationships and finances may face challenges that require careful navigation and patience.",
      content: "",
    },
    {
      id: 17,
      title:
        "Sun Enters Virgo (September 2025): Practicality, Service, and Healing Energy",
      date: "September 28, 2025",
      readTime: "7 min read",
      category: "Transit",
      gradient: "from-green-500 to-emerald-600",
      excerpt:
        "The Sun's entry into Virgo emphasizes practical service, attention to detail, and the healing power of methodical approaches.",
      content: "",
    },
    {
      id: 18,
      title:
        "Mercury in Libra (September 2025): Diplomacy and Balanced Communication",
      date: "September 29, 2025",
      readTime: "6 min read",
      category: "Transit",
      gradient: "from-blue-500 to-teal-600",
      excerpt:
        "Mercury in Libra enhances diplomatic communication, artistic expression, and the ability to see multiple perspectives.",
      content: "",
    },
    {
      id: 19,
      title:
        "Astrology of Equinox 2025: Balance Between Day and Night, Spirit and Matter",
      date: "September 22, 2025",
      readTime: "9 min read",
      category: "Seasonal",
      gradient: "from-yellow-500 to-orange-600",
      excerpt:
        "The equinox represents perfect cosmic balance, offering insights into harmonizing spiritual and material aspects of life.",
      content: "",
    },
    {
      id: 20,
      title:
        "Dussehra 2025: Victory of Light over Darkness from an Astrological Lens",
      date: "October 2, 2025",
      readTime: "10 min read",
      category: "Festival",
      gradient: "from-amber-500 to-red-600",
      excerpt:
        "Dussehra's astrological significance reveals how cosmic forces support the triumph of righteousness over negative influences.",
      content: "",
    },
  ]);

const ARTICLES_PER_PAGE = 3;

export default function LatestAstrologyTopics() {
  const [currentPage, setCurrentPage] = useState(1);
  const [, setLocation] = useLocation();

  const totalPages = Math.ceil(enhancedBlogArticles.length / ARTICLES_PER_PAGE);
  const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE;
  const currentArticles = enhancedBlogArticles.slice(
    startIndex,
    startIndex + ARTICLES_PER_PAGE,
  );

  const handleArticleClick = (article: any) => {
    // Create SEO-friendly URL from article title using shared function
    const slug = createSlugFromTitle(article.title);

    // Navigate to the blog article page
    setLocation(`/blog/${slug}`);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Smooth scroll to top of section
      setTimeout(() => {
        document
          .getElementById("astrology-topics")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  return (
    <div id="astrology-topics" className="space-y-8 relative">
      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {currentArticles.map((article) => (
          <Card
            key={article.id}
            className="group hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] border-0 shadow-lg overflow-hidden cursor-pointer"
          >
            <div className={`h-2 bg-gradient-to-r ${article.gradient}`}></div>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r ${article.gradient} text-white`}
                >
                  {article.category}
                </span>
                <div className="flex items-center text-gray-500 text-sm">
                  <Clock className="h-4 w-4 mr-1" />
                  {article.readTime}
                </div>
              </div>

              <h3
                className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-purple-600 transition-colors"
                onClick={() => handleArticleClick(article)}
              >
                {article.title}
              </h3>

              {article.excerpt && (
                <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                  {article.excerpt}
                </p>
              )}

              <div className="flex items-center text-gray-600 text-sm">
                <Calendar className="h-4 w-4 mr-2" />
                {article.date}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <Button
                  variant="ghost"
                  className="text-purple-600 hover:text-purple-800 hover:bg-purple-50 p-0 h-auto font-semibold"
                  onClick={() => handleArticleClick(article)}
                >
                  Read More →
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center space-x-4 relative z-10 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="flex items-center space-x-2 cursor-pointer pointer-events-auto"
          style={{ pointerEvents: "auto" }}
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </Button>

        <div className="flex items-center space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(page)}
              className={`w-10 h-10 p-0 cursor-pointer pointer-events-auto ${
                currentPage === page
                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                  : "hover:bg-purple-50 hover:text-purple-600"
              }`}
              style={{ pointerEvents: "auto" }}
            >
              {page}
            </Button>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="flex items-center space-x-2 cursor-pointer pointer-events-auto"
          style={{ pointerEvents: "auto" }}
        >
          <span>Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Page Info */}
      <div className="text-center text-gray-600 text-sm">
        Showing {startIndex + 1}-
        {Math.min(startIndex + ARTICLES_PER_PAGE, enhancedBlogArticles.length)}{" "}
        of {enhancedBlogArticles.length} articles
      </div>
    </div>
  );
}
