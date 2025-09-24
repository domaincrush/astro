import { Button } from "src/components/ui/button";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { useLocation, useRoute } from "wouter";

export default function GeneralBlogPost() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute('/blog/:slug');
  const slug = params?.slug;

  // Convert slug back to readable title
  const title = slug?.split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ') || 'Article';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="mb-8 text-purple-600 hover:text-purple-800 hover:bg-purple-50"
          onClick={() => setLocation('/')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Latest Topics
        </Button>

        {/* Article Header */}
        <article className="prose prose-lg max-w-none">
          <header className="mb-8">
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                Astrology
              </span>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Coming Soon
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Stay Tuned
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 leading-tight mb-6">
              {title}
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              This comprehensive astrology article is currently being prepared by our expert team of Vedic astrologers.
            </p>
          </header>

          {/* Coming Soon Content */}
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <section className="bg-purple-50 p-8 rounded-lg border border-purple-200">
              <h2 className="text-2xl font-bold text-purple-900 mb-4">📖 Article In Development</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Our expert astrologers are currently crafting detailed, authentic content for this article. 
                  Each piece undergoes thorough research and validation to ensure accuracy and depth.
                </p>
                
                <h3 className="text-lg font-semibold text-purple-800 mb-2">What to expect:</h3>
                <ul className="space-y-2 list-disc list-inside">
                  <li>In-depth astrological analysis based on authentic Vedic principles</li>
                  <li>Practical guidance and remedies from experienced practitioners</li>
                  <li>Effects on all 12 zodiac signs with personalized insights</li>
                  <li>Traditional wisdom combined with modern interpretations</li>
                  <li>Easy-to-understand explanations for all levels of readers</li>
                </ul>

                <div className="bg-white p-4 rounded-lg border border-purple-100 mt-6">
                  <h4 className="font-semibold text-purple-800 mb-2">📧 Get Notified</h4>
                  <p className="text-sm text-gray-600">
                    Want to be notified when this article is published? 
                    Stay connected with our Latest Astrology Topics section for regular updates.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">🌟 Why Choose Our Astrology Content?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">✨ Authentic Sources</h3>
                  <p className="text-sm text-gray-600">
                    All our content is based on classical Vedic texts and verified by practicing astrologers.
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">🎯 Practical Application</h3>
                  <p className="text-sm text-gray-600">
                    Every article includes actionable insights and remedies you can implement immediately.
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">📅 Timely Updates</h3>
                  <p className="text-sm text-gray-600">
                    Current planetary transits and their effects are regularly updated and analyzed.
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">🎨 Easy Understanding</h3>
                  <p className="text-sm text-gray-600">
                    Complex astrological concepts explained in simple, accessible language.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </article>

        {/* Navigation */}
        <div className="mt-12 pt-8 border-t border-gray-200 space-y-4">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Explore Available Content</h3>
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="outline"
              onClick={() => setLocation('/blog/venus-transit-cancer-2025')}
              className="text-purple-600 border-purple-200 hover:bg-purple-50"
            >
              Venus Transit in Cancer 2025
            </Button>
            <Button 
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              onClick={() => setLocation('/')}
            >
              Browse All Topics
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}