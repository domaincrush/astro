import {
  Calculator,
  Target,
  User,
  Heart,
  Zap,
  Calendar,
  TrendingUp,
  Star,
  Gem,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import { Label } from "src/components/ui/label";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";

export default function Numerology() {
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [results, setResults] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateNumerology = () => {
    if (!name || !birthDate) return;

    setIsCalculating(true);

    // Calculate Life Path Number
    const date = new Date(birthDate);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const reduceToSingleDigit = (num: number): number => {
      while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
        num = num
          .toString()
          .split("")
          .reduce((sum, digit) => sum + parseInt(digit), 0);
      }
      return num;
    };

    const lifePathNumber = reduceToSingleDigit(day + month + year);

    // Calculate Expression Number (from full name)
    const letterValues: { [key: string]: number } = {
      A: 1,
      B: 2,
      C: 3,
      D: 4,
      E: 5,
      F: 6,
      G: 7,
      H: 8,
      I: 9,
      J: 1,
      K: 2,
      L: 3,
      M: 4,
      N: 5,
      O: 6,
      P: 7,
      Q: 8,
      R: 9,
      S: 1,
      T: 2,
      U: 3,
      V: 4,
      W: 5,
      X: 6,
      Y: 7,
      Z: 8,
    };

    const nameValue = name
      .toUpperCase()
      .replace(/[^A-Z]/g, "")
      .split("")
      .reduce((sum, letter) => {
        return sum + (letterValues[letter] || 0);
      }, 0);

    const expressionNumber = reduceToSingleDigit(nameValue);

    // Calculate Soul Urge Number (vowels only)
    const vowels = name
      .toUpperCase()
      .replace(/[^AEIOU]/g, "")
      .split("");
    const soulUrgeValue = vowels.reduce(
      (sum, vowel) => sum + (letterValues[vowel] || 0),
      0,
    );
    const soulUrgeNumber = reduceToSingleDigit(soulUrgeValue);

    // Calculate Personality Number (consonants only)
    const consonants = name
      .toUpperCase()
      .replace(/[AEIOU\s]/g, "")
      .split("");
    const personalityValue = consonants.reduce(
      (sum, consonant) => sum + (letterValues[consonant] || 0),
      0,
    );
    const personalityNumber = reduceToSingleDigit(personalityValue);

    // Calculate Personal Year
    const currentYear = new Date().getFullYear();
    const personalYear = reduceToSingleDigit(day + month + currentYear);

    const numberMeanings: {
      [key: number]: { title: string; description: string; traits: string[] };
    } = {
      1: {
        title: "The Leader",
        description:
          "You are a natural born leader with pioneering spirit and strong independence.",
        traits: ["Independent", "Ambitious", "Innovative", "Confident"],
      },
      2: {
        title: "The Diplomat",
        description:
          "You excel in cooperation and building harmonious relationships with others.",
        traits: ["Cooperative", "Sensitive", "Peaceful", "Intuitive"],
      },
      3: {
        title: "The Communicator",
        description:
          "You have natural artistic talents and excel in creative expression.",
        traits: ["Creative", "Expressive", "Optimistic", "Artistic"],
      },
      4: {
        title: "The Builder",
        description:
          "You are practical, reliable, and excel at creating solid foundations.",
        traits: ["Practical", "Reliable", "Disciplined", "Hardworking"],
      },
      5: {
        title: "The Adventurer",
        description:
          "You crave freedom and variety, always seeking new experiences.",
        traits: ["Freedom-loving", "Curious", "Dynamic", "Versatile"],
      },
      6: {
        title: "The Nurturer",
        description:
          "You are caring and responsible, drawn to helping and healing others.",
        traits: ["Caring", "Responsible", "Protective", "Harmonious"],
      },
      7: {
        title: "The Seeker",
        description:
          "You are drawn to spiritual matters and deep philosophical questions.",
        traits: ["Spiritual", "Analytical", "Introspective", "Mysterious"],
      },
      8: {
        title: "The Achiever",
        description:
          "You have strong business acumen and drive for material success.",
        traits: ["Ambitious", "Authoritative", "Organized", "Success-oriented"],
      },
      9: {
        title: "The Humanitarian",
        description:
          "You are compassionate and driven to serve humanity with universal love.",
        traits: ["Compassionate", "Generous", "Wise", "Humanitarian"],
      },
      11: {
        title: "Master Intuitive",
        description:
          "You possess heightened intuition and spiritual awareness.",
        traits: ["Intuitive", "Inspirational", "Spiritual", "Visionary"],
      },
      22: {
        title: "Master Builder",
        description: "You can turn dreams into reality with practical vision.",
        traits: ["Visionary", "Practical", "Ambitious", "Organized"],
      },
      33: {
        title: "Master Teacher",
        description:
          "You are here to uplift and heal humanity through compassion.",
        traits: ["Compassionate", "Healing", "Teaching", "Selfless"],
      },
    };

    setResults({
      lifePathNumber,
      expressionNumber,
      soulUrgeNumber,
      personalityNumber,
      personalYear,
      meanings: {
        lifePath: numberMeanings[lifePathNumber],
        expression: numberMeanings[expressionNumber],
        soulUrge: numberMeanings[soulUrgeNumber],
        personality: numberMeanings[personalityNumber],
        personalYear: numberMeanings[personalYear],
      },
    });

    setIsCalculating(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <AstroTickHeader />
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center space-x-3 mb-6"
          >
            <div className="md:w-12 md:h-12 w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
              <Calculator className="md:w-6 md:h-6 text-white" />
            </div>
            <h1 className="text-xl md:text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
              Numerology Calculator
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed"
          >
            Discover the mystical power of numbers and unlock insights into your
            personality, destiny, and life path through ancient numerological
            wisdom.
          </motion.p>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="text-xl md:text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Free Numerology Calculator
            </h2>
            <p className="md:text-lg text-gray-600 max-w-2xl mx-auto">
              Enter your full name and birth date to discover your core
              numerological numbers
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-8 shadow-lg border-2 border-amber-500"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700 mb-2 block"
                >
                  Full Name
                </Label>
                <Input
                  id="name"
                  data-testid="input-fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <Label
                  htmlFor="birthDate"
                  className="text-sm font-medium text-gray-700 mb-2 block"
                >
                  Birth Date
                </Label>
                <Input
                  id="birthDate"
                  data-testid="input-birthDate"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            <div className="text-center">
              <Button
                onClick={calculateNumerology}
                disabled={!name || !birthDate || isCalculating}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 px-8 py-3 text-white font-semibold rounded-lg transition-all"
              >
                {isCalculating ? "Calculating..." : "Calculate My Numbers"}
              </Button>
            </div>
          </motion.div>

          {/* Results Section */}
          {results && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mt-12"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">
                Your Numerology Results
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                      {results.lifePathNumber}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        Life Path Number
                      </h4>
                      <p className="text-sm text-gray-600">
                        {results.meanings.lifePath?.title}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-3">
                    {results.meanings.lifePath?.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {results.meanings.lifePath?.traits.map(
                      (trait: string, index: number) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                        >
                          {trait}
                        </span>
                      ),
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                      {results.expressionNumber}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        Expression Number
                      </h4>
                      <p className="text-sm text-gray-600">
                        {results.meanings.expression?.title}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-3">
                    {results.meanings.expression?.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {results.meanings.expression?.traits.map(
                      (trait: string, index: number) => (
                        <span
                          key={index}
                          className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
                        >
                          {trait}
                        </span>
                      ),
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-pink-500">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                      {results.soulUrgeNumber}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        Soul Urge Number
                      </h4>
                      <p className="text-sm text-gray-600">
                        {results.meanings.soulUrge?.title}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-3">
                    {results.meanings.soulUrge?.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {results.meanings.soulUrge?.traits.map(
                      (trait: string, index: number) => (
                        <span
                          key={index}
                          className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm"
                        >
                          {trait}
                        </span>
                      ),
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                      {results.personalityNumber}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        Personality Number
                      </h4>
                      <p className="text-sm text-gray-600">
                        {results.meanings.personality?.title}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-3">
                    {results.meanings.personality?.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {results.meanings.personality?.traits.map(
                      (trait: string, index: number) => (
                        <span
                          key={index}
                          className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm"
                        >
                          {trait}
                        </span>
                      ),
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                      {results.personalYear}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        Personal Year
                      </h4>
                      <p className="text-sm text-gray-600">
                        {results.meanings.personalYear?.title}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-3">
                    {results.meanings.personalYear?.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {results.meanings.personalYear?.traits.map(
                      (trait: string, index: number) => (
                        <span
                          key={index}
                          className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm"
                        >
                          {trait}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Complete Numerology Analysis
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore comprehensive numerological analysis tools to understand
              your life's blueprint through the power of numbers
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: "Life Path Number",
                description:
                  "Your primary life purpose and direction - the most important number in numerology representing your soul's journey",
                calculation: "Birth date reduced to single digit",
                color: "from-blue-500 to-purple-500",
              },
              {
                icon: User,
                title: "Personality Number",
                description:
                  "How others perceive you based on your consonants - your outer personality and first impression",
                calculation: "Consonants in full name",
                color: "from-purple-500 to-pink-500",
              },
              {
                icon: Heart,
                title: "Soul Urge Number",
                description:
                  "Your inner desires, motivations, and what your heart truly yearns for in life",
                calculation: "Vowels in full name",
                color: "from-pink-500 to-red-500",
              },
              {
                icon: Zap,
                title: "Expression Number",
                description:
                  "Your natural talents, abilities, and life's work - what you're meant to accomplish",
                calculation: "All letters in full name",
                color: "from-red-500 to-orange-500",
              },
              {
                icon: Calendar,
                title: "Personal Year Cycle",
                description:
                  "The energy theme for your current year - what to expect and how to navigate",
                calculation: "Birth date + current year",
                color: "from-orange-500 to-yellow-500",
              },
              {
                icon: TrendingUp,
                title: "Compatibility Analysis",
                description:
                  "Numerological compatibility with partners, friends, and business associates",
                calculation: "Life path comparison",
                color: "from-yellow-500 to-green-500",
              },
              {
                icon: Star,
                title: "Master Numbers",
                description:
                  "Special double-digit numbers (11, 22, 33) with heightened spiritual significance",
                calculation: "Unreduced power numbers",
                color: "from-green-500 to-teal-500",
              },
              {
                icon: Gem,
                title: "Karmic Debt Numbers",
                description:
                  "Numbers 13, 14, 16, 19 indicating lessons from past lives to overcome",
                calculation: "Special patterns in chart",
                color: "from-teal-500 to-cyan-500",
              },
              {
                icon: Clock,
                title: "Personal Day Number",
                description:
                  "Daily energy forecast based on your personal numerology for optimal timing",
                calculation: "Birth date + current date",
                color: "from-cyan-500 to-blue-500",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow"
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-full flex items-center justify-center mb-6`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-3">
                  {feature.description}
                </p>
                <div className="text-sm text-gray-500 italic">
                  {feature.calculation}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Number Meanings Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Number Meanings & Characteristics
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Each number from 1-9 carries unique vibrations and qualities that
              influence your life path
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                number: 1,
                title: "The Leader",
                traits: "Independent, pioneering, ambitious, innovative",
                element: "Fire",
                planet: "Sun",
              },
              {
                number: 2,
                title: "The Diplomat",
                traits: "Cooperative, sensitive, peaceful, intuitive",
                element: "Water",
                planet: "Moon",
              },
              {
                number: 3,
                title: "The Communicator",
                traits: "Creative, expressive, optimistic, artistic",
                element: "Air",
                planet: "Jupiter",
              },
              {
                number: 4,
                title: "The Builder",
                traits: "Practical, reliable, disciplined, hardworking",
                element: "Earth",
                planet: "Uranus",
              },
              {
                number: 5,
                title: "The Adventurer",
                traits: "Freedom-loving, curious, dynamic, versatile",
                element: "Fire",
                planet: "Mercury",
              },
              {
                number: 6,
                title: "The Nurturer",
                traits: "Caring, responsible, protective, harmonious",
                element: "Earth",
                planet: "Venus",
              },
              {
                number: 7,
                title: "The Seeker",
                traits: "Spiritual, analytical, introspective, mysterious",
                element: "Water",
                planet: "Neptune",
              },
              {
                number: 8,
                title: "The Achiever",
                traits: "Ambitious, material success, authoritative, organized",
                element: "Earth",
                planet: "Saturn",
              },
              {
                number: 9,
                title: "The Humanitarian",
                traits: "Compassionate, generous, wise, universal love",
                element: "Fire",
                planet: "Mars",
              },
            ].map((num, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.4 + index * 0.1 }}
                className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                    {num.number}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {num.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {num.element} • {num.planet}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">{num.traits}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Master Numbers Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-purple-100 to-pink-100">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Master Numbers & Special Significance
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover the powerful master numbers that carry heightened
              spiritual energy and life purpose
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                number: 11,
                title: "Master Intuitive",
                description:
                  "Spiritual messenger with heightened intuition and psychic abilities. Natural healers and inspirational leaders.",
                traits: "Visionary, intuitive, spiritual, inspiring",
              },
              {
                number: 22,
                title: "Master Builder",
                description:
                  "Practical visionary who can turn dreams into reality. Combines spiritual insight with material mastery.",
                traits: "Ambitious, practical, visionary, organized",
              },
              {
                number: 33,
                title: "Master Teacher",
                description:
                  "The highest level of spiritual expression. Natural healers and teachers who uplift humanity.",
                traits: "Compassionate, healing, teaching, selfless",
              },
            ].map((master, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 2.2 + index * 0.2 }}
                className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-6 mx-auto">
                  {master.number}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                  {master.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {master.description}
                </p>
                <div className="text-center">
                  <span className="inline-block bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full text-sm font-medium text-gray-700">
                    {master.traits}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Discover Your Numbers?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Unlock the secrets hidden in your name and birth date. Get your
              complete numerological analysis today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Calculate My Numbers
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors">
                Learn More
              </button>
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
