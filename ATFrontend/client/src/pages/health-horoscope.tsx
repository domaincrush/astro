import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "wouter";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import {
  Shield,
  Heart,
  Zap,
  Leaf,
  Brain,
  Activity,
  Sparkles,
  Sun,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { Badge } from "src/components/ui/badge";
import { Button } from "src/components/ui/button";
import { motion } from "framer-motion";

const HealthHoroscope: React.FC = () => {
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
      bodyParts: "Head, Face, Brain",
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
      bodyParts: "Neck, Throat, Thyroid",
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
      bodyParts: "Arms, Hands, Lungs",
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
      bodyParts: "Chest, Stomach, Breasts",
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
      bodyParts: "Heart, Spine, Upper Back",
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
      bodyParts: "Digestive System, Intestines",
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
      bodyParts: "Kidneys, Lower Back, Skin",
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
      bodyParts: "Reproductive System, Pelvis",
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
      bodyParts: "Hips, Thighs, Liver",
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
      bodyParts: "Bones, Joints, Knees",
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
      bodyParts: "Circulatory System, Ankles",
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
      bodyParts: "Feet, Immune System",
    },
  ];

  const healthPredictions = {
    aries: {
      current:
        "Mars energy intensifies your vitality but may lead to headaches and stress-related issues. Jupiter's protection strengthens your immune system and promotes healing from past injuries.",
      strengths:
        "Strong constitution, quick recovery from illness, high energy levels, robust immune system. Fire element provides natural detoxification and fast healing capabilities.",
      vulnerabilities:
        "Prone to head injuries, migraines, eye strain, and stress-related conditions. Mars influence may cause inflammation, fever, and accidents due to impulsive behavior.",
      prevention:
        "Regular exercise to channel excess energy, stress management through meditation, protective headgear during sports, adequate sleep to prevent burnout and nervous exhaustion.",
      ayurveda:
        "Pitta dosha dominance requires cooling foods like cucumber, coconut water, and green leafy vegetables. Avoid spicy and oily foods. Pranayama and yoga reduce mental stress.",
      remedies:
        "Wear red coral for Mars strength, perform Hanuman Chalisa for protection, donate red items on Tuesdays, use sandalwood paste on forehead for cooling effect.",
      timing:
        "Summer months require extra care for heat-related issues. Monsoon season favorable for detoxification. Winter supports overall vitality and energy levels.",
    },
    taurus: {
      current:
        "Venus supports overall health and beauty but watch for throat and thyroid issues. Saturn's influence teaches patience in health recovery and emphasizes preventive care.",
      strengths:
        "Strong endurance, stable health patterns, natural beauty, good metabolic rate. Earth element provides grounding and steady recovery from illnesses.",
      vulnerabilities:
        "Throat infections, thyroid disorders, weight gain, diabetes, and skin conditions. Tendency toward overindulgence in food and comfort leading to obesity.",
      prevention:
        "Balanced diet with natural foods, regular neck exercises, thyroid monitoring, moderate eating habits, adequate hydration, and consistent sleep schedule.",
      ayurveda:
        "Kapha dosha tendency requires light, warm foods and regular exercise. Include ginger, turmeric, and honey. Avoid dairy excess and cold drinks.",
      remedies:
        "Wear emerald for Mercury and Venus strength, chant Venus mantras, offer white flowers to Venus on Fridays, practice neck rolls and shoulder stretches daily.",
      timing:
        "Spring season ideal for detoxification programs. Throat care essential during seasonal changes. Venus retrograde periods require extra beauty and health attention.",
    },
    gemini: {
      current:
        "Mercury's swift energy affects nervous system and respiratory health. Multiple planetary aspects create need for mental health balance and breathing exercises.",
      strengths:
        "Adaptable immune system, quick mental processing, flexible health responses, good communication about health needs. Air element supports respiratory strength.",
      vulnerabilities:
        "Anxiety, insomnia, respiratory issues, hand and arm injuries, nervous disorders. Tendency toward scattered energy affecting consistent health routines.",
      prevention:
        "Deep breathing exercises, regular sleep schedule, hand and wrist care, nervous system support through B-vitamins, reduced caffeine intake, meditation practices.",
      ayurveda:
        "Vata dosha requires warm, grounding foods and stable routines. Include almonds, dates, and milk. Avoid excessive cold and raw foods.",
      remedies:
        "Wear emerald for Mercury strength, practice Pranayama daily, donate green items on Wednesdays, use lavender oil for nervous system calming.",
      timing:
        "Monsoon season supports respiratory health. Communication about health issues most effective during Mercury direct periods. Breathing exercises essential year-round.",
    },
    cancer: {
      current:
        "Moon's influence affects digestive system and emotional well-being. Water retention and stomach acidity possible during emotional stress periods and lunar phases.",
      strengths:
        "Intuitive health awareness, strong emotional connection to healing, nurturing approach to wellness, good response to natural and traditional remedies.",
      vulnerabilities:
        "Digestive disorders, stomach ulcers, water retention, breast health issues, emotional eating patterns, mood-related health fluctuations during lunar cycles.",
      prevention:
        "Emotional balance through counseling, regular meal times, digestive support, stress management, moon cycle awareness, family support for mental health.",
      ayurveda:
        "Kapha and Pitta balance required. Eat warm, cooked foods at regular times. Include ginger, cumin, and fennel. Avoid dairy during digestive issues.",
      remedies:
        "Wear moonstone for lunar strength, perform Chandra mantras, offer white rice to Moon on Mondays, practice gentle yoga and swimming for emotional balance.",
      timing:
        "Full moon periods require digestive care. New moon supports detoxification. Monsoon season favorable for overall health and immunity building.",
    },
    leo: {
      current:
        "Sun's powerful energy strengthens heart and spine but may cause heat-related issues. Royal constitution requires attention to cardiovascular health and pride-related stress.",
      strengths:
        "Strong heart constitution, natural vitality, leadership in health matters, quick response to sunshine therapy, robust cardiovascular system.",
      vulnerabilities:
        "Heart conditions, high blood pressure, back problems, heat stroke, ego-related stress affecting health, spine curvature issues from poor posture.",
      prevention:
        "Cardiovascular exercise, spine care through yoga, heat protection, ego management through humility practices, regular heart check-ups, stress management.",
      ayurveda:
        "Pitta dominance requires cooling foods and avoiding excessive heat. Include pomegranates, grapes, and coconut water. Practice Sheetali pranayama for cooling.",
      remedies:
        "Wear ruby for Sun strength, chant Surya mantras at sunrise, donate gold or yellow items on Sundays, practice heart-opening yoga poses daily.",
      timing:
        "Summer requires extra cardiovascular care. Winter supports overall vitality. Solar festivals enhance health and energy levels significantly.",
    },
    virgo: {
      current:
        "Mercury's analytical energy supports health consciousness but may lead to hypochondria. Earth element emphasizes digestive health and attention to daily wellness routines.",
      strengths:
        "Health-conscious nature, attention to symptoms, good response to natural treatments, systematic approach to wellness, strong analytical health assessment abilities.",
      vulnerabilities:
        "Digestive disorders, anxiety about health, excessive worry about symptoms, intestinal issues, food allergies, perfectionist stress affecting immunity.",
      prevention:
        "Balanced perspective on health, regular digestive support, probiotics, anxiety management, systematic but not obsessive health monitoring, natural food choices.",
      ayurveda:
        "Vata and Pitta balance needed. Regular meal times with warm, cooked foods. Include digestive spices like cumin, coriander, and fennel tea.",
      remedies:
        "Wear emerald for Mercury balance, practice gratitude for health, donate green vegetables on Wednesdays, use holy basil for digestive and mental balance.",
      timing:
        "Virgo season supports health improvements and new wellness routines. Digestive care essential during monsoon season and seasonal transitions.",
    },
    libra: {
      current:
        "Venus influence supports beauty and harmony but watch for kidney and lower back issues. Balance-seeking nature requires equilibrium in all health aspects.",
      strengths:
        "Natural beauty, harmonious health patterns, good social support for wellness, aesthetic appreciation for healthy living, balanced approach to treatment.",
      vulnerabilities:
        "Kidney problems, lower back pain, skin conditions, diabetes, indecisiveness about health choices, vanity affecting health decisions.",
      prevention:
        "Kidney health through adequate hydration, back strengthening exercises, balanced diet, decisive health choices, beauty routines supporting wellness.",
      ayurveda:
        "Vata and Pitta balance required. Sweet, cooling foods in moderation. Include cranberries for kidney health and avoid excessive sugar and salt.",
      remedies:
        "Wear diamond or white sapphire for Venus, chant Venus mantras for beauty and health, offer white flowers on Fridays, practice partner yoga.",
      timing:
        "Libra season supports health balance and beauty treatments. Kidney care essential during winter months. Partnership in health goals yields best results.",
    },
    scorpio: {
      current:
        "Mars and Pluto energy creates intense transformation in health patterns. Reproductive system and elimination processes require attention for optimal wellness.",
      strengths:
        "Powerful healing abilities, strong regenerative capacity, deep understanding of health mysteries, natural detoxification abilities, resilience against serious illness.",
      vulnerabilities:
        "Reproductive system disorders, elimination problems, autoimmune conditions, tendency toward self-destructive health behaviors, hidden health issues.",
      prevention:
        "Regular detoxification, reproductive health monitoring, elimination support, emotional therapy for trauma healing, avoiding addictive substances and behaviors.",
      ayurveda:
        "Strong constitution requires deep cleansing. Include turmeric, neem, and detoxifying herbs. Practice fasting and meditation for spiritual and physical purification.",
      remedies:
        "Wear red coral for Mars strength, practice Rudra mantras for transformation, donate dark red items on Tuesdays, use meditation for emotional healing.",
      timing:
        "Scorpio season supports major health transformations. Full moon periods ideal for detoxification. Reproductive health care essential during hormonal changes.",
    },
    sagittarius: {
      current:
        "Jupiter's expansive energy supports overall health and optimism but watch for overindulgence. Hip and thigh areas require attention along with liver health.",
      strengths:
        "Optimistic health outlook, strong liver function, good response to travel and outdoor activities, natural immunity, adventurous approach to healing.",
      vulnerabilities:
        "Hip problems, thigh injuries, liver issues from overindulgence, weight gain from excessive optimism about food, sports injuries from overconfidence.",
      prevention:
        "Moderate indulgence, hip flexibility exercises, liver support through proper diet, realistic assessment of physical capabilities, protective gear during adventures.",
      ayurveda:
        "Kapha and Pitta balance needed. Avoid excessive sweet and fatty foods. Include bitter herbs like neem and turmeric. Practice moderation in all aspects.",
      remedies:
        "Wear yellow sapphire for Jupiter, chant Guru mantras for wisdom in health, donate yellow items on Thursdays, practice outdoor yoga and adventure sports.",
      timing:
        "Sagittarius season supports health adventures and outdoor activities. Liver detox beneficial during spring. Hip care essential before sports activities.",
    },
    capricorn: {
      current:
        "Saturn's disciplined energy supports long-term health building but may cause bone and joint issues. Consistent health routines yield excellent results.",
      strengths:
        "Strong bones and teeth, disciplined health approach, longevity, persistence in health goals, good response to traditional and time-tested treatments.",
      vulnerabilities:
        "Arthritis, joint stiffness, dental problems, depression, skin dryness, tendency toward pessimism affecting immune system and healing.",
      prevention:
        "Calcium and vitamin D supplementation, joint mobility exercises, dental care, depression management, skin moisturizing, optimism cultivation practices.",
      ayurveda:
        "Vata dosha dominance requires warm, oily foods and regular oil massage. Include sesame oil, nuts, and warm milk. Avoid excessive cold and dry foods.",
      remedies:
        "Wear blue sapphire for Saturn, practice Saturn mantras for longevity, donate black items on Saturdays, use warm oil massage for joint health.",
      timing:
        "Capricorn season supports bone health initiatives. Joint care essential during winter months. Long-term health planning most effective during Saturn periods.",
    },
    aquarius: {
      current:
        "Saturn and Uranus energy affects circulatory system and nervous network. Innovative health approaches and group wellness activities prove beneficial.",
      strengths:
        "Unique health insights, good circulation when active, innovative treatment responses, benefit from group health activities, humanitarian approach to wellness.",
      vulnerabilities:
        "Circulatory problems, ankle injuries, nervous system disorders, irregular health patterns, tendency toward experimental treatments without proper research.",
      prevention:
        "Regular circulation exercises, ankle strengthening, nervous system support, consistent health routines despite innovative approaches, proper research before trying new treatments.",
      ayurveda:
        "Vata dosha requires warm, grounding foods and regular routines. Include warming spices and avoid excessive cold and raw foods. Practice grounding exercises.",
      remedies:
        "Wear blue sapphire for Saturn balance, practice group meditation, donate blue items on Saturdays, use technology wisely for health monitoring.",
      timing:
        "Aquarius season supports innovative health approaches. Circulatory care essential during winter. Group health activities most beneficial during social periods.",
    },
    pisces: {
      current:
        "Jupiter's mystical influence enhances healing abilities but watch for immune system fluctuations. Feet health and water balance require attention.",
      strengths:
        "Intuitive health awareness, strong healing abilities, compassionate self-care, good response to spiritual and alternative healing, psychic health insights.",
      vulnerabilities:
        "Weak immune system, foot problems, water retention, tendency toward escapism affecting health, absorption of others' health problems, emotional eating.",
      prevention:
        "Immune system support, foot care and comfortable shoes, emotional boundaries, realistic health perspectives, spiritual practices for emotional balance.",
      ayurveda:
        "Kapha and Vata balance needed. Warm, light foods with digestive spices. Include ginger, cinnamon, and cardamom. Avoid excessive dairy and sugar.",
      remedies:
        "Wear yellow sapphire for Jupiter, practice Jupiter mantras for wisdom and healing, donate yellow items on Thursdays, use water therapy and swimming.",
      timing:
        "Pisces season supports spiritual healing and immune system building. Foot care essential during monsoon. Emotional healing most effective during water element periods.",
    },
  };

  const currentSignData = zodiacSigns.find((sign) => sign.id === selectedSign);
  const currentPrediction =
    healthPredictions[selectedSign as keyof typeof healthPredictions];

  const healthAspects = [
    {
      aspect: "Physical Vitality",
      icon: Activity,
      description:
        "Current energy levels and physical strength based on planetary influences",
      color: "from-red-500 to-pink-500",
    },
    {
      aspect: "Mental Wellness",
      icon: Brain,
      description:
        "Emotional balance and stress management through cosmic guidance",
      color: "from-blue-500 to-cyan-500",
    },
    {
      aspect: "Immunity & Recovery",
      icon: Shield,
      description: "Body's natural defense system and healing capabilities",
      color: "from-green-500 to-teal-500",
    },
    {
      aspect: "Spiritual Health",
      icon: Sparkles,
      description:
        "Connection between spiritual practices and physical wellness",
      color: "from-purple-500 to-indigo-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <Helmet>
        <title>
          Health Horoscope - Wellness Predictions for All Zodiac Signs |
          AstroTick
        </title>
        <meta
          name="description"
          content="Get comprehensive health horoscope predictions based on Vedic astrology and planetary transits. Wellness guidance for all zodiac signs with Ayurvedic insights."
        />
        <meta
          name="keywords"
          content="health horoscope, wellness astrology, medical astrology, ayurvedic health, planetary health effects, zodiac health"
        />
      </Helmet>

      <AstroTickHeader />

      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 via-blue-500/10 to-purple-500/10"></div>
        <div className="relative container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex justify-center items-center gap-3 mb-6"
            >
              <Shield className="h-12 w-12 text-green-600" />
              <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Health Horoscope
              </h1>
              <Heart className="h-12 w-12 text-green-600" />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-700 mb-8 leading-relaxed"
            >
              Discover your wellness potential through ancient Vedic wisdom. Get
              personalized health guidance based on planetary influences and
              Ayurvedic principles.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Health Aspects */}
      <section className="py-16 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Holistic Health Dimensions
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Understanding wellness through the lens of Vedic astrology and
              traditional healing wisdom
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {healthAspects.map((aspect, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <CardHeader className="text-center">
                    <div
                      className={`w-16 h-16 rounded-full bg-gradient-to-r ${aspect.color} flex items-center justify-center mx-auto mb-4`}
                    >
                      <aspect.icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-lg">{aspect.aspect}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-center text-sm">
                      {aspect.description}
                    </p>
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
              Your Personal Health Horoscope
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Select your zodiac sign for personalized wellness predictions and
              Ayurvedic guidance
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
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-green-300"
                }`}
              >
                <div className="text-2xl mb-2">{sign.icon}</div>
                <div className="font-medium text-sm">{sign.name}</div>
                <div className="text-xs text-gray-500">{sign.bodyParts}</div>
              </motion.button>
            ))}
          </div>

          {/* Selected Sign Health Details */}
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
                    {currentSignData.name} Health Profile
                  </CardTitle>
                  <p className="text-lg text-gray-600">
                    {currentSignData.sanskrit}
                  </p>
                  <div className="flex justify-center items-center gap-4 mt-4">
                    <Badge variant="outline">
                      {currentSignData.element} Element
                    </Badge>
                    <Badge variant="outline">
                      Governs: {currentSignData.bodyParts}
                    </Badge>
                    <Badge variant="outline">
                      Ruled by {currentSignData.ruling}
                    </Badge>
                  </div>
                </CardHeader>
              </Card>

              {/* Current Health Status */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sun className="h-6 w-6 text-orange-600" />
                    Current Health Climate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {currentPrediction.current}
                  </p>
                </CardContent>
              </Card>

              {/* Health Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Card className="hover:shadow-lg transition-all duration-300 border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-800">
                      <Zap className="h-5 w-5" />
                      Natural Strengths
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-green-700">
                      {currentPrediction.strengths}
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300 border-orange-200 bg-orange-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-orange-800">
                      <Shield className="h-5 w-5" />
                      Areas of Attention
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-orange-700">
                      {currentPrediction.vulnerabilities}
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300 border-blue-200 bg-blue-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-800">
                      <Activity className="h-5 w-5" />
                      Prevention Guidelines
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-blue-700">
                      {currentPrediction.prevention}
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300 border-purple-200 bg-purple-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-purple-800">
                      <Leaf className="h-5 w-5" />
                      Ayurvedic Wisdom
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-purple-700">
                      {currentPrediction.ayurveda}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Remedies and Timing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-indigo-200 bg-indigo-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-indigo-800">
                      <Sparkles className="h-5 w-5" />
                      Vedic Remedies
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-indigo-700">
                      {currentPrediction.remedies}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-teal-200 bg-teal-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-teal-800">
                      <Heart className="h-5 w-5" />
                      Optimal Health Timing
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-teal-700">{currentPrediction.timing}</p>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Transform Your Health Journey
            </h2>
            <p className="text-xl text-green-100 mb-8">
              Get personalized wellness guidance from expert astrologers
              combining modern health insights with ancient wisdom
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-green-600 hover:bg-gray-100"
                onClick={() => setLocation("/astrologers")}
              >
                <Shield className="h-5 w-5 mr-2" />
                Health Consultation
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-green-600 hover:bg-white hover:text-green-300"
                onClick={() => setLocation("/premium-report")}
              >
                <Heart className="h-5 w-5 mr-2" />
                Wellness Report
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HealthHoroscope;
