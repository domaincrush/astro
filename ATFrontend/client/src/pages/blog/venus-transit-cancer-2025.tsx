import { Button } from "src/components/ui/button";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";

export default function VenusTransitCancer2025() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <AstroTickHeader />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
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
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-pink-500 to-rose-600 text-white">
                Transit
              </span>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                August 15, 2025
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                8 min read
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 leading-tight mb-6">
              Venus Transit in Cancer 2025: What It Means for Your Love Life and Relationships
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              On August 2, 2025, Venus enters sensitive Cancer, bringing emotional depth, nurturing connections, and the desire for soulful bonds. Unlike fiery Venus in Aries, this transit prioritizes security, affection, and emotional intimacy.
            </p>
          </header>

          {/* Article Content */}
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">🌟 Introduction: Why Venus in Cancer Matters</h2>
              <p>
                On August 2, 2025, Venus — the planet of love, beauty, romance, and luxury — enters the sensitive water sign of Cancer. This planetary movement brings a wave of emotional depth, nurturing connections, and the desire for soulful bonds. Unlike the fiery passion of Venus in Aries or the social charm of Venus in Gemini, this transit prioritizes security, affection, and emotional intimacy.
              </p>
              <p>
                If you've been seeking stability in love or healing in your relationships, this transit could be the cosmic shift you've been waiting for. Let's dive into what this means for love, career, and overall well-being.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">💕 Venus in Cancer and Love Relationships</h2>
              <ul className="space-y-2">
                <li><strong>Romance takes a softer turn:</strong> Expect tenderness, sweet gestures, and deeper emotional sharing. Couples may feel the need to spend quality time at home, away from external chaos.</li>
                <li><strong>Singles feel drawn to stability:</strong> If you're single, you may attract partners who value loyalty and emotional depth over superficial charm.</li>
                <li><strong>Past connections resurface:</strong> Venus in Cancer has a karmic undertone, which may bring old lovers back into your life for closure or reconnection.</li>
              </ul>
              <div className="bg-purple-50 p-4 rounded-lg mt-4">
                <p className="font-semibold text-purple-800">Pro Tip: This is an excellent time for engagements, family introductions, or creating long-term commitments.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">💼 Career and Finances During Venus Transit</h2>
              <p>Though Venus is primarily a planet of love, it also governs wealth, luxuries, and social charm.</p>
              <ul className="space-y-2">
                <li><strong>Financial planning improves:</strong> You may feel motivated to save money for family security. Investments in real estate or home décor may benefit.</li>
                <li><strong>Career relationships soften:</strong> The workplace atmosphere becomes nurturing, and colleagues may feel more cooperative.</li>
                <li><strong>Creative professionals thrive:</strong> Artists, writers, and healers will find heightened intuition and creativity.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">🧘 Spiritual and Emotional Growth</h2>
              <p>Cancer is ruled by the Moon, which represents mind and emotions. Venus here makes people:</p>
              <ul className="space-y-2">
                <li>More empathetic toward others' struggles.</li>
                <li>Inclined towards spiritual practices like meditation, chanting, or connecting with divine feminine energy.</li>
                <li>Drawn to family traditions, rituals, and healing ancestral bonds.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">🌌 Remedies and Astrological Guidance</h2>
              <p>To make the most of this Venus transit in Cancer 2025, astrologers recommend:</p>
              <ul className="space-y-2">
                <li>Chanting "Om Shukraya Namaha" daily to strengthen Venus.</li>
                <li>Offering white flowers or sweets to Goddess Lakshmi on Fridays.</li>
                <li>Spending time near water bodies for emotional healing.</li>
                <li>Wearing a White Sapphire (if suitable per chart) to enhance Venus energy.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">♋ Effects on All 12 Zodiac Signs</h2>
              <p className="mb-4">Here's a quick look at how this transit influences each sign:</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900">Aries:</h4>
                    <p className="text-sm">Emotional bonding deepens with family. Take care of your mother's health.</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900">Taurus:</h4>
                    <p className="text-sm">Improved communication in love. Siblings may bring joy.</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900">Gemini:</h4>
                    <p className="text-sm">Focus shifts to financial growth and security.</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900">Cancer:</h4>
                    <p className="text-sm">Personal charm rises; love life blossoms.</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900">Leo:</h4>
                    <p className="text-sm">Introspection and past karma resurface. Be cautious in relationships.</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900">Virgo:</h4>
                    <p className="text-sm">Strong support from friends, possible new alliances.</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900">Libra:</h4>
                    <p className="text-sm">Career gains through supportive superiors.</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900">Scorpio:</h4>
                    <p className="text-sm">Opportunities for higher studies or travel with a partner.</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900">Sagittarius:</h4>
                    <p className="text-sm">Emotional transformation, inheritance or joint finances highlighted.</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900">Capricorn:</h4>
                    <p className="text-sm">Deep emotional bonding with spouse or business partner.</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900">Aquarius:</h4>
                    <p className="text-sm">Health improves, but focus on mental peace.</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900">Pisces:</h4>
                    <p className="text-sm">Romantic opportunities flourish; creativity soars.</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">🌟 Conclusion</h2>
              <p>
                The Venus transit in Cancer 2025 is a time to prioritize emotional connection over material pursuits. Whether it's through deepening family bonds, nurturing your partner, or reconnecting with your inner self, this transit helps you align love with security. Use this period to heal relationships, cultivate compassion, and embrace the divine feminine energy.
              </p>
            </section>
          </div>
        </article>

        {/* Related Articles / CTA */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Related Articles</h3>
          <Button 
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            onClick={() => setLocation('/')}
          >
            Explore More Astrology Topics
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
}