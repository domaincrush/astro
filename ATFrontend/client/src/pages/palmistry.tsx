import { Hand, Heart, Brain, Zap, Target, Clock, Star, Eye, Gem, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export default function Palmistry() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center space-x-3 mb-6"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-green-600 via-emerald-500 to-teal-400 rounded-full flex items-center justify-center shadow-lg">
              <Hand className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-teal-500 bg-clip-text text-transparent">
              Palmistry Reading
            </h1>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed"
          >
            Discover your life's story written in the lines of your hands. Ancient palmistry reveals insights about your personality, destiny, and future through the sacred art of hand reading.
          </motion.p>
        </div>
      </section>

      {/* Major Lines Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Major Palm Lines Analysis
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The four primary lines in your palm reveal the most important aspects of your life journey
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: Heart,
                title: "Heart Line",
                description: "Reveals your emotional nature, love life, and relationship patterns. Shows how you express and receive love.",
                details: "Located at the top of the palm, running horizontally below the fingers",
                meanings: [
                  "Deep line: Intense emotions and passionate love",
                  "Straight line: Practical approach to relationships",
                  "Curved line: Romantic and expressive nature",
                  "Broken line: Emotional trauma or relationship challenges"
                ],
                color: "from-red-500 to-pink-500"
              },
              {
                icon: Brain,
                title: "Head Line",
                description: "Indicates your intelligence, thinking patterns, and mental approach to life. Shows learning style and decision-making process.",
                details: "Runs horizontally across the middle of the palm",
                meanings: [
                  "Long line: Analytical and detailed thinking",
                  "Short line: Quick decisions and practical focus",
                  "Curved line: Creative and imaginative mind",
                  "Straight line: Logical and methodical approach"
                ],
                color: "from-blue-500 to-indigo-500"
              },
              {
                icon: Zap,
                title: "Life Line",
                description: "Represents your vitality, physical health, and major life changes. Contrary to myth, it doesn't predict lifespan.",
                details: "Curves around the thumb from wrist to index finger",
                meanings: [
                  "Deep line: Strong vitality and robust health",
                  "Faint line: Sensitive constitution, need for self-care",
                  "Wide curve: Adventurous and energetic nature",
                  "Narrow curve: Cautious and home-loving personality"
                ],
                color: "from-green-500 to-emerald-500"
              },
              {
                icon: Target,
                title: "Fate Line",
                description: "Shows your career path, life purpose, and how external forces influence your destiny. Not everyone has this line.",
                details: "Runs vertically from wrist toward middle finger",
                meanings: [
                  "Strong line: Clear life direction and purpose",
                  "Broken line: Career changes or life transitions",
                  "Absent line: Self-made success, forge your own path",
                  "Multiple lines: Multiple talents or career interests"
                ],
                color: "from-purple-500 to-violet-500"
              }
            ].map((line, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.2 }}
                className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${line.color} rounded-full flex items-center justify-center mb-6`}>
                  <line.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {line.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {line.description}
                </p>
                <div className="text-sm text-gray-500 italic mb-4">
                  {line.details}
                </div>
                <div className="space-y-2">
                  {line.meanings.map((meaning, idx) => (
                    <div key={idx} className="text-sm text-gray-700 flex items-start">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>{meaning}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Hand Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Hand Features & Characteristics
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Every aspect of your hand tells a unique story about your personality and potential
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Hand,
                title: "Hand Shape",
                description: "Basic temperament and elemental nature",
                types: [
                  "Earth (Square): Practical, reliable, grounded",
                  "Air (Rectangular): Intellectual, communicative, adaptable",
                  "Water (Oval): Emotional, intuitive, artistic",
                  "Fire (Elongated): Energetic, passionate, impulsive"
                ],
                color: "from-orange-500 to-red-500"
              },
              {
                icon: Eye,
                title: "Finger Length",
                description: "Communication style and personality traits",
                types: [
                  "Index (Jupiter): Leadership and ambition",
                  "Middle (Saturn): Responsibility and structure",
                  "Ring (Apollo): Creativity and self-expression",
                  "Little (Mercury): Communication and relationships"
                ],
                color: "from-blue-500 to-purple-500"
              },
              {
                icon: Gem,
                title: "Thumb Analysis",
                description: "Willpower, logic, and determination",
                types: [
                  "Large thumb: Strong willpower and leadership",
                  "Small thumb: Gentle nature, follows others",
                  "Flexible thumb: Adaptable and generous",
                  "Stiff thumb: Stubborn but reliable"
                ],
                color: "from-green-500 to-teal-500"
              },
              {
                icon: Star,
                title: "Mounts of Hand",
                description: "Planetary influences and energy centers",
                types: [
                  "Venus: Love, beauty, artistic nature",
                  "Mars: Courage, energy, determination",
                  "Jupiter: Leadership, wisdom, spirituality",
                  "Saturn: Discipline, responsibility, karma"
                ],
                color: "from-purple-500 to-pink-500"
              },
              {
                icon: Clock,
                title: "Skin Texture",
                description: "Sensitivity and refinement levels",
                types: [
                  "Smooth: Refined, sensitive, artistic",
                  "Medium: Balanced, practical approach",
                  "Coarse: Tough, resilient, straightforward",
                  "Soft: Gentle, luxury-loving, comfortable"
                ],
                color: "from-indigo-500 to-blue-500"
              },
              {
                icon: TrendingUp,
                title: "Flexibility",
                description: "Adaptability and openness to change",
                types: [
                  "Very flexible: Adaptable, generous, trusting",
                  "Moderately flexible: Balanced, reasonable",
                  "Stiff: Cautious, traditional, reliable",
                  "Rigid: Stubborn, set in ways, protective"
                ],
                color: "from-teal-500 to-green-500"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.4 + index * 0.1 }}
                className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-full flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {feature.description}
                </p>
                <div className="space-y-2">
                  {feature.types.map((type, idx) => (
                    <div key={idx} className="text-sm text-gray-700">
                      <span className="font-medium">{type}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Markings Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-emerald-100 to-teal-100">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Special Markings & Their Meanings
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover the significance of unique marks, symbols, and patterns found in your palms
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                symbol: "★",
                title: "Star",
                meaning: "Exceptional talent, fame, or significant achievement in the area where it appears",
                significance: "High"
              },
              {
                symbol: "△",
                title: "Triangle",
                meaning: "Harmony, balance, and successful integration of different life aspects",
                significance: "Positive"
              },
              {
                symbol: "◯",
                title: "Circle",
                meaning: "Protection, completion, and positive energy enhancement",
                significance: "Protective"
              },
              {
                symbol: "▢",
                title: "Square",
                meaning: "Preservation, protection from negative influences, and stability",
                significance: "Protective"
              },
              {
                symbol: "╱",
                title: "Cross",
                meaning: "Obstacles, challenges, or significant life changes requiring attention",
                significance: "Challenging"
              },
              {
                symbol: "~",
                title: "Chains",
                meaning: "Periods of restriction, health issues, or temporary setbacks",
                significance: "Temporary"
              },
              {
                symbol: "○",
                title: "Island",
                meaning: "Divided energy, confusion, or health concerns in that life area",
                significance: "Attention"
              },
              {
                symbol: "||",
                title: "Parallel Lines",
                meaning: "Support, strengthening influence, or dual paths in life",
                significance: "Supportive"
              }
            ].map((marking, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 2.2 + index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4 mx-auto">
                  {marking.symbol}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  {marking.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-3">
                  {marking.meaning}
                </p>
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  marking.significance === 'High' ? 'bg-yellow-100 text-yellow-800' :
                  marking.significance === 'Positive' ? 'bg-green-100 text-green-800' :
                  marking.significance === 'Protective' ? 'bg-blue-100 text-blue-800' :
                  marking.significance === 'Challenging' ? 'bg-red-100 text-red-800' :
                  marking.significance === 'Supportive' ? 'bg-purple-100 text-purple-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {marking.significance}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reading Process Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              How Palm Reading Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Understanding the ancient art and science behind palmistry analysis
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 3.0 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Which Hand to Read?</h3>
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">Dominant Hand (Active)</h4>
                  <p className="text-gray-700">Shows your current life, conscious decisions, and developed personality. Reveals what you've made of your potential.</p>
                </div>
                <div className="bg-gradient-to-r from-teal-100 to-cyan-100 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">Non-Dominant Hand (Passive)</h4>
                  <p className="text-gray-700">Reveals your natural tendencies, inherited traits, and subconscious patterns. Shows your inherent potential.</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 3.2 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Reading Process</h3>
              <div className="space-y-4">
                {[
                  { step: 1, title: "Hand Shape Analysis", desc: "Determine elemental type and basic temperament" },
                  { step: 2, title: "Major Lines Reading", desc: "Analyze heart, head, life, and fate lines" },
                  { step: 3, title: "Mount Examination", desc: "Study the seven mounts for planetary influences" },
                  { step: 4, title: "Special Markings", desc: "Identify unique symbols and their meanings" },
                  { step: 5, title: "Integration", desc: "Combine all elements for comprehensive reading" }
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{item.title}</h4>
                      <p className="text-gray-600 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 3.4 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Read Your Palms?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Discover the ancient wisdom written in your hands. Get your detailed palmistry reading from our expert palm readers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Get Palm Reading
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors">
                Learn More
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}