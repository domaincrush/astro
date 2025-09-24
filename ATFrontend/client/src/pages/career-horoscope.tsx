import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "wouter";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import {
  TrendingUp,
  Star,
  Briefcase,
  Target,
  Trophy,
  Lightbulb,
  Crown,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { Badge } from "src/components/ui/badge";
import { Button } from "src/components/ui/button";
import { motion } from "framer-motion";

const CareerHoroscope: React.FC = () => {
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

  const careerPredictions = {
    aries: {
      current:
        "Mars energy drives you toward leadership positions and entrepreneurial ventures. Jupiter's transit through your 10th house brings recognition for past efforts and new opportunities for advancement.",
      opportunities:
        "Executive roles, startup leadership, military or defense positions, sports management, and competitive industries. Your natural pioneering spirit opens doors in emerging markets.",
      challenges:
        "Impatience with slow processes and tendency to clash with authority. Mars retrograde periods require diplomatic approach and team collaboration over solo achievements.",
      timing:
        "August-September 2025 particularly favorable for career changes and new ventures. Avoid major decisions during Mars retrograde in November.",
      industries: [
        "Technology Startups",
        "Defense & Security",
        "Sports & Fitness",
        "Manufacturing",
        "Emergency Services",
      ],
      advice:
        "Channel your competitive spirit into team leadership. Practice patience and strategic planning over impulsive actions.",
    },
    taurus: {
      current:
        "Venus influence brings stability and growth in established fields. Saturn supports long-term career building through consistent effort and practical skills development.",
      opportunities:
        "Banking and finance, real estate, agriculture, luxury goods, and creative industries. Your reliability makes you ideal for positions requiring trust and consistency.",
      challenges:
        "Resistance to change and new technologies may limit growth. Venus retrograde periods require flexibility in professional relationships and adaptation to market shifts.",
      timing:
        "Spring 2025 brings property and finance-related opportunities. May-June favorable for artistic and creative career moves.",
      industries: [
        "Banking & Finance",
        "Real Estate",
        "Agriculture",
        "Luxury Retail",
        "Interior Design",
      ],
      advice:
        "Embrace gradual change and skill updates. Your stability is an asset, but adaptability ensures continued relevance.",
    },
    gemini: {
      current:
        "Mercury's swift energy creates multiple opportunities in communication and technology. Jupiter's influence brings expansion through networking and diverse skill sets.",
      opportunities:
        "Media, journalism, teaching, sales, technology, and consulting. Your versatility and communication skills open doors in rapidly changing industries.",
      challenges:
        "Scattered focus and difficulty completing long-term projects. Mercury retrograde periods require extra attention to details and contractual agreements.",
      timing:
        "Technology and communication sectors particularly active in July-August 2025. Multiple opportunities require careful selection and prioritization.",
      industries: [
        "Media & Journalism",
        "Technology",
        "Education",
        "Sales & Marketing",
        "Consulting",
      ],
      advice:
        "Focus on developing expertise in 2-3 areas rather than spreading too thin. Use your networking abilities to build strong professional relationships.",
    },
    cancer: {
      current:
        "Moon's nurturing influence favors people-oriented careers and family businesses. Jupiter supports growth in healthcare, education, and hospitality sectors.",
      opportunities:
        "Healthcare, childcare, education, hospitality, real estate, and food services. Your empathetic nature and intuitive understanding of needs create loyal client relationships.",
      challenges:
        "Emotional decision-making and sensitivity to workplace criticism. Mood fluctuations may affect professional relationships and performance consistency.",
      timing:
        "Full moon periods bring important career decisions and opportunities. Summer months particularly favorable for service-oriented career moves.",
      industries: [
        "Healthcare",
        "Education",
        "Hospitality",
        "Food Services",
        "Childcare",
      ],
      advice:
        "Trust your intuition but balance it with practical analysis. Create emotional boundaries to maintain professional objectivity.",
    },
    leo: {
      current:
        "Sun's royal influence attracts leadership roles and public recognition. Jupiter brings international opportunities and expansion in entertainment and luxury sectors.",
      opportunities:
        "Entertainment, politics, luxury brands, corporate leadership, and public speaking. Your natural charisma and confidence inspire others and attract high-profile positions.",
      challenges:
        "Ego conflicts with superiors and need for constant recognition. Saturn teaches humility and the importance of teamwork over individual glory.",
      timing:
        "Leo season (July-August) brings maximum opportunities for advancement and recognition. Government and entertainment sectors particularly active.",
      industries: [
        "Entertainment",
        "Politics",
        "Luxury Brands",
        "Corporate Leadership",
        "Event Management",
      ],
      advice:
        "Balance confidence with humility. Share credit with your team to build lasting professional relationships and support networks.",
    },
    virgo: {
      current:
        "Mercury's analytical precision brings opportunities in detail-oriented and service-based careers. Jupiter supports growth in healthcare, research, and quality-focused industries.",
      opportunities:
        "Healthcare, research, quality control, analysis, consulting, and service industries. Your perfectionist nature and attention to detail are highly valued in precision-required fields.",
      challenges:
        "Over-analysis leading to delayed decisions and perfectionist tendencies causing project delays. Self-criticism may undermine confidence in leadership roles.",
      timing:
        "September (Virgo season) brings clarity and opportunities in service sectors. Health and wellness industries particularly active throughout 2025.",
      industries: [
        "Healthcare",
        "Research",
        "Quality Control",
        "Consulting",
        "Analysis",
      ],
      advice:
        "Set realistic standards and deadlines. Your expertise is valuable, but timely delivery often outweighs perfect execution in competitive markets.",
    },
    libra: {
      current:
        "Venus brings harmony and partnership opportunities in collaborative industries. Jupiter supports growth in law, design, and relationship-based businesses.",
      opportunities:
        "Law, design, beauty, hospitality, diplomacy, and partnership-based businesses. Your natural sense of balance and aesthetics creates success in harmony-focused industries.",
      challenges:
        "Indecisiveness and people-pleasing may delay important career choices. Difficulty saying no to opportunities may lead to overcommitment and stress.",
      timing:
        "Libra season (September-October) brings partnership opportunities and aesthetic industry growth. Venus-ruled periods favor beauty and design careers.",
      industries: [
        "Law",
        "Design",
        "Beauty & Fashion",
        "Hospitality",
        "Diplomacy",
      ],
      advice:
        "Practice decisive decision-making and boundary setting. Your diplomatic skills are assets when balanced with firm professional boundaries.",
    },
    scorpio: {
      current:
        "Mars and Pluto's transformative energy brings opportunities in research, investigation, and transformation-based industries. Hidden talents emerge through challenging projects.",
      opportunities:
        "Psychology, research, investigation, finance, medicine, and transformation coaching. Your intensity and depth perception create success in fields requiring profound understanding.",
      challenges:
        "Trust issues and power struggles may create workplace conflicts. Secretive nature may limit collaborative opportunities and team integration.",
      timing:
        "Scorpio season (October-November) brings research and investigation opportunities. Financial and medical sectors particularly active.",
      industries: [
        "Psychology",
        "Research",
        "Investigation",
        "Finance",
        "Medicine",
      ],
      advice:
        "Channel intensity into productive research and analysis. Build trust through transparency and collaborative approach to complex projects.",
    },
    sagittarius: {
      current:
        "Jupiter's expansion brings international opportunities and higher education advantages. Your philosophical approach and global perspective attract diverse career options.",
      opportunities:
        "International business, education, publishing, travel, philosophy, and cultural exchange. Your optimism and broad perspective create success in expansion-focused industries.",
      challenges:
        "Overconfidence and excessive optimism may lead to poor planning. Restlessness and desire for constant change may prevent long-term career building.",
      timing:
        "Sagittarius season (November-December) brings international and educational opportunities. Publishing and travel industries particularly active.",
      industries: [
        "International Business",
        "Education",
        "Publishing",
        "Travel",
        "Cultural Exchange",
      ],
      advice:
        "Balance optimism with practical planning. Your global perspective is valuable when combined with detailed execution and follow-through.",
    },
    capricorn: {
      current:
        "Saturn's disciplined influence brings earned recognition and permanent positions in traditional industries. Your persistence and reliability attract corporate leadership roles.",
      opportunities:
        "Government, corporate leadership, traditional businesses, banking, and established industries. Your natural authority and organizational skills create success in hierarchical structures.",
      challenges:
        "Pessimism and excessive caution may limit opportunities. Workaholic tendencies may affect work-life balance and personal relationships.",
      timing:
        "Capricorn season (December-January) brings government and corporate opportunities. Traditional industries particularly active throughout 2025.",
      industries: [
        "Government",
        "Corporate Leadership",
        "Banking",
        "Construction",
        "Traditional Business",
      ],
      advice:
        "Balance ambition with contentment. Your leadership skills are most effective when combined with empathy and work-life balance.",
    },
    aquarius: {
      current:
        "Saturn's innovative influence brings opportunities in technology and humanitarian causes. Your unique perspective and group-oriented approach attract cutting-edge industries.",
      opportunities:
        "Technology, social causes, innovation, research, and group-oriented businesses. Your humanitarian approach and technological understanding create success in future-focused industries.",
      challenges:
        "Rebellious nature and desire for complete independence may limit collaborative opportunities. Unconventional approach may clash with traditional corporate structures.",
      timing:
        "Aquarius season (January-February) brings technology and innovation opportunities. Social enterprise and humanitarian sectors particularly active.",
      industries: [
        "Technology",
        "Social Enterprise",
        "Innovation",
        "Research",
        "Group Consulting",
      ],
      advice:
        "Channel innovative ideas into practical applications. Your unique perspective is valuable when presented in accessible and collaborative formats.",
    },
    pisces: {
      current:
        "Jupiter's mystical influence brings opportunities in creative and healing industries. Your intuitive abilities and compassionate nature attract service-oriented careers.",
      opportunities:
        "Creative arts, healing professions, spiritual services, charity work, and water-related industries. Your empathy and artistic talents create success in inspiration-focused fields.",
      challenges:
        "Lack of practical boundaries and tendency to take on others' problems. Emotional decision-making may lead to career instability and financial insecurity.",
      timing:
        "Pisces season (February-March) brings creative and healing opportunities. Spiritual and charitable sectors particularly active throughout 2025.",
      industries: [
        "Creative Arts",
        "Healing Professions",
        "Spiritual Services",
        "Charity Work",
        "Water Industries",
      ],
      advice:
        "Balance compassion with practical boundaries. Your intuitive gifts are valuable when combined with business acumen and self-care practices.",
    },
  };

  const currentSignData = zodiacSigns.find((sign) => sign.id === selectedSign);
  const currentPrediction =
    careerPredictions[selectedSign as keyof typeof careerPredictions];

  const planetaryInfluences = [
    {
      planet: "Jupiter",
      effect: "Career Expansion & Recognition",
      description:
        "Brings opportunities for advancement, higher positions, and recognition from authority figures",
      timeframe: "Strong until December 2025",
      color: "from-yellow-500 to-orange-500",
    },
    {
      planet: "Saturn",
      effect: "Discipline & Long-term Building",
      description:
        "Supports career stability through persistent effort and professional skill development",
      timeframe: "Ongoing influence",
      color: "from-purple-500 to-indigo-500",
    },
    {
      planet: "Mars",
      effect: "Initiative & Leadership",
      description:
        "Energizes ambition and provides drive for competitive career advancement",
      timeframe: "Variable periods",
      color: "from-red-500 to-pink-500",
    },
    {
      planet: "Mercury",
      effect: "Communication & Networking",
      description:
        "Enhances professional communication, negotiation skills, and business connections",
      timeframe: "Cyclical influence",
      color: "from-blue-500 to-cyan-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <Helmet>
        <title>
          Career Horoscope - Professional Predictions for All Zodiac Signs |
          AstroTick
        </title>
        <meta
          name="description"
          content="Get detailed career horoscope predictions based on current planetary transits. Professional guidance for all zodiac signs with Vedic astrology insights."
        />
        <meta
          name="keywords"
          content="career horoscope, professional predictions, job astrology, career guidance, planetary transits career, zodiac career"
        />
      </Helmet>

      <AstroTickHeader />

      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-indigo-500/10 to-purple-500/10"></div>
        <div className="relative container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex justify-center items-center gap-3 mb-6"
            >
              <Briefcase className="h-12 w-12 text-blue-600" />
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Career Horoscope
              </h1>
              <TrendingUp className="h-12 w-12 text-blue-600" />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-700 mb-8 leading-relaxed"
            >
              Navigate your professional journey with cosmic wisdom. Get
              personalized career guidance based on current planetary transits
              and your zodiac influence.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Planetary Career Influences */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Current Planetary Career Influences
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Major planetary transits affecting professional growth and career
              opportunities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {planetaryInfluences.map((influence, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <CardHeader className="text-center">
                    <div
                      className={`w-16 h-16 rounded-full bg-gradient-to-r ${influence.color} flex items-center justify-center mx-auto mb-4`}
                    >
                      <Star className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-lg">
                      {influence.planet}
                    </CardTitle>
                    <p className="text-sm font-medium text-gray-600">
                      {influence.effect}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-gray-600 text-center text-sm">
                      {influence.description}
                    </p>
                    <Badge variant="outline" className="w-full justify-center">
                      {influence.timeframe}
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
              Your Professional Horoscope
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Select your zodiac sign for personalized career predictions and
              professional guidance
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
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300"
                }`}
              >
                <div className="text-2xl mb-2">{sign.icon}</div>
                <div className="font-medium text-sm">{sign.name}</div>
                <div className="text-xs text-gray-500">{sign.dates}</div>
              </motion.button>
            ))}
          </div>

          {/* Selected Sign Career Details */}
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
                    {currentSignData.name} Career Outlook
                  </CardTitle>
                  <p className="text-lg text-gray-600">
                    {currentSignData.sanskrit}
                  </p>
                  <div className="flex justify-center items-center gap-4 mt-4">
                    <Badge variant="outline">
                      {currentSignData.element} Element
                    </Badge>
                    <Badge variant="outline">
                      Ruled by {currentSignData.ruling}
                    </Badge>
                  </div>
                </CardHeader>
              </Card>

              {/* Current Career Status */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-6 w-6 text-blue-600" />
                    Current Professional Climate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {currentPrediction.current}
                  </p>
                </CardContent>
              </Card>

              {/* Career Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Card className="hover:shadow-lg transition-all duration-300 border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-800">
                      <Trophy className="h-5 w-5" />
                      Career Opportunities
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-green-700 mb-4">
                      {currentPrediction.opportunities}
                    </p>
                    <div className="space-y-2">
                      <p className="font-medium text-green-800">
                        Favorable Industries:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {currentPrediction.industries.map((industry, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-green-700 border-green-300"
                          >
                            {industry}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300 border-orange-200 bg-orange-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-orange-800">
                      <Lightbulb className="h-5 w-5" />
                      Professional Challenges
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-orange-700">
                      {currentPrediction.challenges}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Timing and Advice */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-purple-200 bg-purple-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-purple-800">
                      <Crown className="h-5 w-5" />
                      Optimal Timing
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-purple-700">
                      {currentPrediction.timing}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-blue-200 bg-blue-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-800">
                      <Users className="h-5 w-5" />
                      Professional Advice
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-blue-700">{currentPrediction.advice}</p>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Accelerate Your Career Growth
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Get personalized career guidance from expert astrologers and
              unlock your professional potential
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-blue-600 hover:bg-gray-100"
                onClick={() => setLocation("/astrologers")}
              >
                <Briefcase className="h-5 w-5 mr-2" />
                Career Consultation
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-blue-500 hover:bg-white hover:text-black"
                onClick={() => setLocation("/reports/career")}
              >
                <TrendingUp className="h-5 w-5 mr-2" />
                Detailed Career Report
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default CareerHoroscope;
