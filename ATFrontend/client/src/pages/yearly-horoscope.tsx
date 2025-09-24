import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "wouter";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import {
  Calendar,
  Star,
  TrendingUp,
  Heart,
  Shield,
  Coins,
  Crown,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { Badge } from "src/components/ui/badge";
import { Button } from "src/components/ui/button";
import { motion } from "framer-motion";

const YearlyHoroscope: React.FC = () => {
  const [selectedSign, setSelectedSign] = useState("aries");
  const [, setLocation] = useLocation();

  const zodiacSigns = [
    {
      id: "aries",
      name: "Aries",
      sanskrit: "मेष (Mesha)",
      dates: "Mar 21 - Apr 19",
      element: "Fire",
      ruling: "Mars",
      icon: "♈",
      color: "from-red-500 to-orange-500",
    },
    {
      id: "taurus",
      name: "Taurus",
      sanskrit: "वृषभ (Vrishabha)",
      dates: "Apr 20 - May 20",
      element: "Earth",
      ruling: "Venus",
      icon: "♉",
      color: "from-green-500 to-teal-500",
    },
    {
      id: "gemini",
      name: "Gemini",
      sanskrit: "मिथुन (Mithuna)",
      dates: "May 21 - Jun 20",
      element: "Air",
      ruling: "Mercury",
      icon: "♊",
      color: "from-yellow-500 to-orange-500",
    },
    {
      id: "cancer",
      name: "Cancer",
      sanskrit: "कर्क (Karka)",
      dates: "Jun 21 - Jul 22",
      element: "Water",
      ruling: "Moon",
      icon: "♋",
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "leo",
      name: "Leo",
      sanskrit: "सिंह (Simha)",
      dates: "Jul 23 - Aug 22",
      element: "Fire",
      ruling: "Sun",
      icon: "♌",
      color: "from-yellow-500 to-red-500",
    },
    {
      id: "virgo",
      name: "Virgo",
      sanskrit: "कन्या (Kanya)",
      dates: "Aug 23 - Sep 22",
      element: "Earth",
      ruling: "Mercury",
      icon: "♍",
      color: "from-green-500 to-blue-500",
    },
    {
      id: "libra",
      name: "Libra",
      sanskrit: "तुला (Tula)",
      dates: "Sep 23 - Oct 22",
      element: "Air",
      ruling: "Venus",
      icon: "♎",
      color: "from-pink-500 to-purple-500",
    },
    {
      id: "scorpio",
      name: "Scorpio",
      sanskrit: "वृश्चिक (Vrishchika)",
      dates: "Oct 23 - Nov 21",
      element: "Water",
      ruling: "Mars",
      icon: "♏",
      color: "from-red-500 to-purple-500",
    },
    {
      id: "sagittarius",
      name: "Sagittarius",
      sanskrit: "धनु (Dhanu)",
      dates: "Nov 22 - Dec 21",
      element: "Fire",
      ruling: "Jupiter",
      icon: "♐",
      color: "from-orange-500 to-red-500",
    },
    {
      id: "capricorn",
      name: "Capricorn",
      sanskrit: "मकर (Makara)",
      dates: "Dec 22 - Jan 19",
      element: "Earth",
      ruling: "Saturn",
      icon: "♑",
      color: "from-gray-500 to-blue-500",
    },
    {
      id: "aquarius",
      name: "Aquarius",
      sanskrit: "कुम्भ (Kumbha)",
      dates: "Jan 20 - Feb 18",
      element: "Air",
      ruling: "Saturn",
      icon: "♒",
      color: "from-blue-500 to-purple-500",
    },
    {
      id: "pisces",
      name: "Pisces",
      sanskrit: "मीन (Meena)",
      dates: "Feb 19 - Mar 20",
      element: "Water",
      ruling: "Jupiter",
      icon: "♓",
      color: "from-blue-500 to-green-500",
    },
  ];

  const yearlyPredictions = {
    aries: {
      overall:
        "2025 brings transformative energy with Jupiter's beneficial transit through your career sector. Mars, your ruling planet, energizes your ambitions while Saturn teaches valuable lessons about patience and perseverance.",
      career:
        "Jupiter in your 10th house from May onwards brings significant professional advancement. New leadership opportunities and recognition await. Avoid impulsive decisions during Mars retrograde periods.",
      love: "Venus transits favor committed relationships over casual encounters. Single Aries may find meaningful connections through professional networks. June-August period particularly favorable for engagements and marriages.",
      health:
        "Saturn's influence requires attention to bone health and joint care. Regular exercise and yoga practice essential. Avoid stress-related issues through meditation and proper sleep cycles.",
      finance:
        "Variable income patterns due to Jupiter's movement. First half of year favors investments in property or education. Second half brings unexpected gains through partnerships or business ventures.",
      challenges:
        "Mars retrograde periods may bring conflicts with authority figures. Practice patience and avoid ego clashes. Saturn's lessons focus on long-term planning over quick results.",
      opportunities:
        "Leadership roles, international collaborations, and skill development programs. Jupiter's blessings bring mentorship opportunities and spiritual growth.",
    },
    taurus: {
      overall:
        "Venus, your ruling planet, brings stability and growth in 2025. Jupiter's transit through your 9th house expands horizons through higher learning and spiritual pursuits. Saturn solidifies foundations.",
      career:
        "Steady progress through consistent effort. Creative fields particularly favored. Jupiter brings opportunities for international work or higher education that enhances career prospects.",
      love: "Venus retrograde periods require careful communication in relationships. Existing partnerships deepen with mutual understanding. Spring season brings romantic opportunities for singles.",
      health:
        "Earth element strength supports physical vitality. Focus on throat and neck care as these are Taurus-ruled areas. Ayurvedic treatments and natural remedies prove beneficial.",
      finance:
        "Jupiter's influence on 9th house brings gains through education, publishing, or foreign connections. Steady accumulation of wealth through patient investment strategies.",
      challenges:
        "Stubbornness may create relationship issues. Saturn demands flexibility in professional matters. Avoid overindulgence in comfort foods and luxury spending.",
      opportunities:
        "Educational advancement, spiritual growth, artistic expression, and building lasting partnerships. Property investments yield good returns.",
    },
    gemini: {
      overall:
        "Mercury's swift movements create a dynamic year with frequent changes and new learning opportunities. Jupiter's transit brings transformation and deeper understanding of life's mysteries.",
      career:
        "Communication skills and networking abilities bring multiple opportunities. Technology and media sectors particularly favorable. Adaptability is your greatest strength this year.",
      love: "Dual nature of Gemini explored through various romantic experiences. Intellectual compatibility takes precedence over physical attraction. Social connections lead to meaningful relationships.",
      health:
        "Nervous system requires attention due to Mercury's influence. Practice breathing exercises and maintain regular sleep patterns. Hand and arm care important for Gemini natives.",
      finance:
        "Multiple income sources through diverse skills and interests. Jupiter's 8th house transit may bring inheritance or partner's financial support. Avoid get-rich-quick schemes.",
      challenges:
        "Scattered energy and indecisiveness may create missed opportunities. Mercury retrograde periods require extra caution in communication and travel.",
      opportunities:
        "Writing, teaching, technology, social media, and communication-based businesses thrive. Short-distance travel brings profitable connections.",
    },
    cancer: {
      overall:
        "Moon's nurturing influence combined with Jupiter's wisdom creates emotional and material growth. Family relationships strengthen while new foundations are built for future security.",
      career:
        "People-oriented professions flourish. Healthcare, education, hospitality, and real estate bring success. Intuitive decision-making proves more valuable than analytical approaches.",
      love: "Deep emotional connections and family expansion featured. Moon's cycles bring varying romantic moods. Home-based partnerships or family-arranged meetings prove auspicious.",
      health:
        "Digestive system and chest area require attention. Moon's influence makes you sensitive to environmental changes. Maintain emotional balance through meditation and family support.",
      finance:
        "Real estate investments and family businesses bring steady returns. Jupiter's transit supports long-term wealth building through traditional investment methods.",
      challenges:
        "Emotional fluctuations may affect decision-making. Avoid mood-driven financial choices. Past emotional baggage needs healing for progress.",
      opportunities:
        "Family business expansion, real estate ventures, childcare services, and emotional healing practices. Maternal relationships bring unexpected benefits.",
    },
    leo: {
      overall:
        "Sun's royal influence reaches full potential in 2025. Jupiter brings international recognition while Saturn teaches humility and service. Creative expression and leadership skills highlighted.",
      career:
        "Entertainment, politics, luxury goods, and leadership positions favored. Sun's energy attracts attention and opportunities for public recognition. Government connections prove beneficial.",
      love: "Dramatic romantic phases with grand gestures and passionate expressions. Fire element attracts similarly energetic partners. Royal treatment expected and given in relationships.",
      health:
        "Heart health and spine care essential for Leo natives. Sun's influence requires protection from excessive heat. Regular cardiovascular exercise maintains vitality.",
      finance:
        "Luxury investments and status symbols attract your attention. Jupiter supports ventures in entertainment and speculative markets. Avoid ego-driven expensive purchases.",
      challenges:
        "Pride and ego may create conflicts. Saturn humbles excessive self-importance. Learning to work as team member rather than always being the leader.",
      opportunities:
        "Stage performances, brand endorsements, luxury retail, and motivational speaking. Sun's blessing brings fame and recognition in chosen fields.",
    },
    virgo: {
      overall:
        "Mercury's analytical gifts combined with Jupiter's wisdom create a year of practical spirituality and service. Health and daily routines undergo positive transformation.",
      career:
        "Service-oriented professions and detail-oriented work bring satisfaction. Healthcare, analysis, research, and quality control sectors particularly favored. Perfectionism is valued.",
      love: "Practical approach to relationships with focus on compatibility and shared values. Service to partner becomes expression of love. Late summer brings romantic opportunities.",
      health:
        "Digestive health and daily wellness routines emphasized. Virgo's natural health consciousness leads to beneficial lifestyle changes. Herbal remedies and natural healing methods effective.",
      finance:
        "Methodical saving and careful budgeting yield substantial results. Jupiter brings gains through health-related businesses or service industries. Avoid perfectionist spending on details.",
      challenges:
        "Over-analysis and criticism may harm relationships. Saturn demands letting go of perfectionist tendencies. Self-criticism needs to be balanced with self-compassion.",
      opportunities:
        "Healthcare services, organic products, quality consulting, and wellness coaching. Detail-oriented businesses and analytical services thrive.",
    },
    libra: {
      overall:
        "Venus brings harmony and balance while Jupiter's transit emphasizes relationships and partnerships. Artistic talents and diplomatic skills reach new heights.",
      career:
        "Partnership-based businesses and creative industries flourish. Law, design, beauty, and hospitality sectors bring success. Collaborative efforts yield better results than solo ventures.",
      love: "Marriage and serious partnerships highlighted throughout the year. Venus retrograde periods require patience in relationship matters. Aesthetic compatibility important.",
      health:
        "Kidney function and lower back care essential for Libra natives. Balance in all areas of life prevents health issues. Beauty treatments and aesthetic procedures favored.",
      finance:
        "Joint ventures and partnership investments bring prosperity. Venus influence attracts luxury goods and beauty-related expenses. Balanced approach to spending necessary.",
      challenges:
        "Indecisiveness and people-pleasing tendencies may delay important choices. Saturn teaches the value of saying no and setting boundaries.",
      opportunities:
        "Design businesses, legal partnerships, beauty industry, and diplomatic services. Artistic collaborations and luxury brand associations thrive.",
    },
    scorpio: {
      overall:
        "Mars energy combined with Pluto's transformative power creates intense personal evolution. Jupiter brings hidden knowledge and research abilities to the forefront.",
      career:
        "Investigation, research, psychology, and transformation-based work favored. Hidden talents emerge through challenging circumstances. Power and influence gradually accumulate.",
      love: "Intense and transformative relationships that change both partners fundamentally. Trust and loyalty are non-negotiable. Passionate connections with karmic significance.",
      health:
        "Reproductive system and elimination processes require attention. Scorpio's natural detoxification abilities help overcome health challenges. Alternative healing methods effective.",
      finance:
        "Investments in research, investigation, or transformation-based businesses bring substantial returns. Hidden assets or inheritance possible. Avoid get-rich-quick schemes.",
      challenges:
        "Tendency towards jealousy and possessiveness may harm relationships. Control issues need to be addressed. Learning to trust others' intentions.",
      opportunities:
        "Psychology services, investigation work, research projects, and transformation coaching. Investments in hidden or emerging markets yield profits.",
    },
    sagittarius: {
      overall:
        "Jupiter's homecoming brings expansion in all areas of life. Foreign connections, higher learning, and spiritual growth dominate the year. Adventure and exploration featured.",
      career:
        "International business, higher education, publishing, and travel-related industries bring success. Jupiter's wisdom attracts teaching and mentoring opportunities.",
      love: "Cross-cultural relationships and connections through travel or education. Freedom-loving nature attracts similarly adventurous partners. Long-distance relationships possible.",
      health:
        "Hip and thigh areas require attention as Sagittarius-ruled body parts. Regular physical activity and outdoor sports maintain vitality. Avoid overindulgence in food and drink.",
      finance:
        "Foreign investments and education-related expenses bring long-term benefits. Jupiter supports publishing, travel, and educational ventures. Avoid overoptimistic financial planning.",
      challenges:
        "Overconfidence and excessive optimism may lead to poor judgment. Saturn teaches the importance of practical planning. Restlessness needs constructive channeling.",
      opportunities:
        "International trade, educational services, publishing ventures, and spiritual teaching. Travel industry and adventure sports bring profitable opportunities.",
    },
    capricorn: {
      overall:
        "Saturn's lessons culminate in substantial achievements and recognition. Jupiter brings expansion through disciplined effort and practical wisdom. Authority and respect increase.",
      career:
        "Government positions, corporate leadership, and traditional businesses flourish. Saturn's influence brings earned recognition and permanent positions. Patience yields substantial results.",
      love: "Traditional approach to relationships with focus on long-term commitment and stability. Age differences in partnerships possible. Mature and responsible partners attracted.",
      health:
        "Bone health, joints, and teeth require regular care. Capricorn's natural longevity supported by disciplined lifestyle choices. Traditional medicine and structured exercise beneficial.",
      finance:
        "Conservative investments and traditional business models bring steady wealth accumulation. Real estate and established companies yield reliable returns. Avoid speculative ventures.",
      challenges:
        "Pessimism and excessive caution may limit opportunities. Saturn teaches balance between ambition and contentment. Workaholic tendencies need moderation.",
      opportunities:
        "Corporate positions, government contracts, traditional businesses, and long-term investment planning. Authority-based services and consulting thrive.",
    },
    aquarius: {
      overall:
        "Saturn's innovative influence combines with Jupiter's expansion to create unique opportunities. Technology, humanitarian causes, and unconventional approaches bring success.",
      career:
        "Technology, social causes, innovation, and group-oriented work favored. Saturn supports long-term projects with humanitarian benefits. Network connections prove valuable.",
      love: "Unusual or unconventional relationships with emphasis on friendship and intellectual compatibility. Group activities and social causes may introduce romantic partners.",
      health:
        "Circulatory system and ankles require attention as Aquarius-ruled areas. Alternative healing methods and technological health solutions effective. Group fitness activities beneficial.",
      finance:
        "Technology investments and innovative business models bring substantial returns. Group investments and crowdfunding ventures show promise. Avoid following crowd mentality.",
      challenges:
        "Rebellious nature and desire for complete independence may isolate you. Saturn teaches the value of cooperation and commitment. Avoid being too detached emotionally.",
      opportunities:
        "Technology startups, social enterprises, group consulting, and innovative services. Humanitarian projects and eco-friendly businesses thrive with Saturn's support.",
    },
    pisces: {
      overall:
        "Jupiter's mystical influence creates spiritual awakening and intuitive development. Creative talents and healing abilities reach their full potential through divine inspiration.",
      career:
        "Creative arts, healing professions, spiritual services, and charity work bring fulfillment. Intuitive abilities guide career decisions more than logical analysis.",
      love: "Spiritual and karmic connections with emphasis on unconditional love and sacrifice. Artistic or spiritual partners attracted. Compassionate service strengthens relationships.",
      health:
        "Feet and immune system require special attention as Pisces-ruled areas. Water therapy and meditation enhance healing. Emotional balance directly affects physical health.",
      finance:
        "Charitable giving and spiritual investments bring unexpected returns. Avoid financial decisions based on emotions or sympathy. Water-related businesses show potential.",
      challenges:
        "Tendency to escape reality through fantasy or substances needs addressing. Saturn teaches practical application of spiritual insights. Boundaries in relationships necessary.",
      opportunities:
        "Healing services, artistic expressions, spiritual teaching, and charitable organizations. Water-related businesses and meditation services flourish with cosmic support.",
    },
  };

  const currentSignData = zodiacSigns.find((sign) => sign.id === selectedSign);
  const currentPrediction =
    yearlyPredictions[selectedSign as keyof typeof yearlyPredictions];

  const planetaryHighlights = [
    {
      planet: "Jupiter",
      transit: "Through Career & Recognition Houses",
      effect: "Expansion in professional life and social status",
      timeframe: "May - December 2025",
      color: "from-yellow-500 to-orange-500",
    },
    {
      planet: "Saturn",
      transit: "Teaching Discipline & Patience",
      effect: "Long-term stability through persistent effort",
      timeframe: "All Year 2025",
      color: "from-purple-500 to-indigo-500",
    },
    {
      planet: "Mars",
      transit: "Activating Energy & Ambition",
      effect: "Increased drive and competitive spirit",
      timeframe: "Various Periods",
      color: "from-red-500 to-pink-500",
    },
    {
      planet: "Venus",
      transit: "Enhancing Love & Prosperity",
      effect: "Romance, creativity, and financial gains",
      timeframe: "Cyclical Throughout Year",
      color: "from-pink-500 to-rose-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <Helmet>
        <title>
          Yearly Horoscope 2025 - Annual Predictions for All Zodiac Signs |
          AstroTick
        </title>
        <meta
          name="description"
          content="Complete yearly horoscope 2025 with detailed predictions for love, career, health, and finance based on current planetary transits. Professional Vedic astrology insights."
        />
        <meta
          name="keywords"
          content="yearly horoscope 2025, annual predictions, zodiac forecast, planetary transits 2025, vedic astrology yearly"
        />
      </Helmet>

      <AstroTickHeader />

      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 via-purple-500/10 to-pink-500/10"></div>
        <div className="relative container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex justify-center items-center gap-3 mb-6"
            >
              <Calendar className="h-12 w-12 text-indigo-600" />
              <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Yearly Horoscope 2025
              </h1>
              <Sparkles className="h-12 w-12 text-indigo-600" />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-700 mb-8 leading-relaxed"
            >
              Discover what the stars hold for you in 2025 with comprehensive
              annual predictions based on current planetary transits and Vedic
              astrological principles.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Planetary Highlights */}
      <section className="py-16 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Key Planetary Transits of 2025
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Major planetary movements shaping the year ahead for all zodiac
              signs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {planetaryHighlights.map((highlight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <CardHeader className="text-center">
                    <div
                      className={`w-16 h-16 rounded-full bg-gradient-to-r ${highlight.color} flex items-center justify-center mx-auto mb-4`}
                    >
                      <Star className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-lg">
                      {highlight.planet}
                    </CardTitle>
                    <p className="text-sm text-gray-600">{highlight.transit}</p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-gray-600 text-center">
                      {highlight.effect}
                    </p>
                    <Badge variant="outline" className="w-full justify-center">
                      {highlight.timeframe}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Zodiac Sign Selection */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Select Your Zodiac Sign
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Choose your zodiac sign to view detailed yearly predictions for
              2025
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-12">
            {zodiacSigns.map((sign, index) => (
              <motion.button
                key={sign.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={() => setSelectedSign(sign.id)}
                className={`p-4 rounded-lg border-2 transition-all duration-300 hover:shadow-md ${
                  selectedSign === sign.id
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-200 hover:border-indigo-300"
                }`}
              >
                <div className="text-2xl mb-2">{sign.icon}</div>
                <div className="font-medium text-sm">{sign.name}</div>
                <div className="text-xs text-gray-500">{sign.dates}</div>
              </motion.button>
            ))}
          </div>

          {/* Selected Sign Details */}
          {currentSignData && currentPrediction && (
            <motion.div
              key={selectedSign}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-6xl mx-auto"
            >
              {/* Sign Header */}
              <Card className="mb-8">
                <CardHeader className="text-center">
                  <div
                    className={`w-20 h-20 rounded-full bg-gradient-to-r ${currentSignData.color} flex items-center justify-center mx-auto mb-4`}
                  >
                    <span className="text-3xl text-white">
                      {currentSignData.icon}
                    </span>
                  </div>
                  <CardTitle className="text-3xl">
                    {currentSignData.name} 2025
                  </CardTitle>
                  <p className="text-lg text-gray-600">
                    {currentSignData.sanskrit}
                  </p>
                  <div className="flex justify-center items-center gap-4 mt-4">
                    <Badge variant="outline">{currentSignData.dates}</Badge>
                    <Badge variant="outline">
                      {currentSignData.element} Sign
                    </Badge>
                    <Badge variant="outline">
                      Ruled by {currentSignData.ruling}
                    </Badge>
                  </div>
                </CardHeader>
              </Card>

              {/* Overall Prediction */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="h-6 w-6 text-purple-600" />
                    Overall Year Ahead
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {currentPrediction.overall}
                  </p>
                </CardContent>
              </Card>

              {/* Detailed Predictions Grid */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      Career & Professional Life
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{currentPrediction.career}</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-pink-600" />
                      Love & Relationships
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{currentPrediction.love}</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-blue-600" />
                      Health & Wellness
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{currentPrediction.health}</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Coins className="h-5 w-5 text-yellow-600" />
                      Finance & Money
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{currentPrediction.finance}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Challenges and Opportunities */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-orange-200 bg-orange-50">
                  <CardHeader>
                    <CardTitle className="text-orange-800">
                      Challenges to Navigate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-orange-700">
                      {currentPrediction.challenges}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="text-green-800">
                      Golden Opportunities
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-green-700">
                      {currentPrediction.opportunities}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Get Personalized Guidance for 2025
            </h2>
            <p className="text-xl text-indigo-100 mb-8">
              Consult with expert astrologers for detailed personal predictions
              and remedial guidance for the year ahead
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-indigo-600 hover:bg-gray-100"
                onClick={() => setLocation("/astrologers")}
              >
                <Calendar className="h-5 w-5 mr-2" />
                Book Consultation
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-indigo-600 hover:bg-white hover:text-indigo-600"
                onClick={() => setLocation("/premium-report")}
              >
                <Star className="h-5 w-5 mr-2" />
                Get Detailed Report
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default YearlyHoroscope;
