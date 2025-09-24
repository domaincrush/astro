import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { Badge } from "src/components/ui/badge";
import { Button } from "src/components/ui/button";
import {
  Star,
  Zap,
  Crown,
  Heart,
  Shield,
  Target,
  Moon,
  Sun,
  Globe,
  Compass,
  Search,
  Play,
  CheckCircle,
  ArrowRight,
  Eye,
  Sparkles,
} from "lucide-react";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";
import { Link } from "wouter";

export default function NakshatrasGuide() {
  const [selectedNakshatra, setSelectedNakshatra] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const nakshatras = [
    {
      name: "Ashwini",
      symbol: "Horse's Head",
      deity: "Ashwini Kumaras",
      sounds: ["Chu", "Che", "Cho", "La"],
      element: "Earth",
      gana: "Deva",
      yoni: "Horse",
      characteristics: "Quick, energetic, healing abilities, pioneering spirit",
      career: "Medicine, healing, sports, transportation",
      lucky: { color: "Red", number: 1, day: "Sunday" },
      compatibility: ["Bharani", "Krittika", "Rohini"],
      slug: "ashwini",
    },
    {
      name: "Bharani",
      symbol: "Yoni (Vagina)",
      deity: "Yama",
      sounds: ["Li", "Lu", "Le", "Lo"],
      element: "Earth",
      gana: "Manushya",
      yoni: "Elephant",
      characteristics: "Creative, nurturing, transformative, strong will",
      career: "Arts, creativity, psychology, midwifery",
      lucky: { color: "Red", number: 2, day: "Friday" },
      compatibility: ["Ashwini", "Krittika", "Rohini"],
      slug: "bharani",
    },
    {
      name: "Krittika",
      symbol: "Knife/Razor",
      deity: "Agni",
      sounds: ["A", "I", "U", "E"],
      element: "Fire",
      gana: "Rakshasa",
      yoni: "Sheep",
      characteristics: "Sharp intellect, cutting through illusions, leadership",
      career: "Cooking, metallurgy, criticism, leadership",
      lucky: { color: "White", number: 3, day: "Sunday" },
      compatibility: ["Ashwini", "Bharani", "Rohini"],
      slug: "krittika",
    },
    {
      name: "Rohini",
      symbol: "Ox Cart",
      deity: "Brahma",
      sounds: ["O", "Va", "Vi", "Vu"],
      element: "Earth",
      gana: "Manushya",
      yoni: "Serpent",
      characteristics:
        "Beautiful, artistic, materialistic, magnetic personality",
      career: "Arts, beauty, agriculture, luxury goods",
      lucky: { color: "Red", number: 4, day: "Thursday" },
      compatibility: ["Ashwini", "Bharani", "Krittika"],
      slug: "rohini",
    },
    {
      name: "Mrigashira",
      symbol: "Deer's Head",
      deity: "Soma",
      sounds: ["Ve", "Vo", "Ka", "Ki"],
      element: "Earth",
      gana: "Deva",
      yoni: "Serpent",
      characteristics: "Searching nature, curious, gentle, restless",
      career: "Research, travel, writing, music",
      lucky: { color: "Silver", number: 5, day: "Tuesday" },
      compatibility: ["Ardra", "Punarvasu", "Pushya"],
      slug: "mrigashira",
    },
    {
      name: "Ardra",
      symbol: "Teardrop",
      deity: "Rudra",
      sounds: ["Ku", "Gha", "Nga", "Chha"],
      element: "Water",
      gana: "Manushya",
      yoni: "Dog",
      characteristics:
        "Intense emotions, transformative, destructive and creative",
      career: "Psychology, weather, chemicals, research",
      lucky: { color: "Green", number: 6, day: "Wednesday" },
      compatibility: ["Mrigashira", "Punarvasu", "Pushya"],
      slug: "ardra",
    },
    {
      name: "Punarvasu",
      symbol: "Bow and Quiver",
      deity: "Aditi",
      sounds: ["Ke", "Ko", "Ha", "Hi"],
      element: "Water",
      gana: "Deva",
      yoni: "Cat",
      characteristics: "Renewed hope, nurturing, philosophical, optimistic",
      career: "Teaching, philosophy, writing, social work",
      lucky: { color: "Yellow", number: 7, day: "Thursday" },
      compatibility: ["Mrigashira", "Ardra", "Pushya"],
      slug: "punarvasu",
    },
    {
      name: "Pushya",
      symbol: "Udder of Cow",
      deity: "Brihaspati",
      sounds: ["Hu", "He", "Ho", "Da"],
      element: "Water",
      gana: "Deva",
      yoni: "Sheep",
      characteristics: "Nourishing, spiritual, conservative, protective",
      career: "Counseling, teaching, agriculture, food industry",
      lucky: { color: "Yellow", number: 8, day: "Thursday" },
      compatibility: ["Mrigashira", "Ardra", "Punarvasu"],
      slug: "pushya",
    },
    {
      name: "Ashlesha",
      symbol: "Coiled Serpent",
      deity: "Nagas",
      sounds: ["Di", "Du", "De", "Do"],
      element: "Water",
      gana: "Rakshasa",
      yoni: "Cat",
      characteristics: "Mysterious, intuitive, hypnotic, transformative",
      career: "Psychology, occult sciences, medicine, politics",
      lucky: { color: "Black", number: 9, day: "Saturday" },
      compatibility: ["Jyeshtha", "Revati", "Anuradha"],
      slug: "ashlesha",
    },
    {
      name: "Magha",
      symbol: "Royal Throne",
      deity: "Pitris (Ancestors)",
      sounds: ["Ma", "Mi", "Mu", "Me"],
      element: "Water",
      gana: "Rakshasa",
      yoni: "Rat",
      characteristics: "Royal, noble, authoritative, traditional",
      career: "Government, administration, archaeology, genealogy",
      lucky: { color: "Gold", number: 10, day: "Sunday" },
      compatibility: ["Purva Phalguni", "Uttara Phalguni", "Hasta"],
      slug: "magha",
    },
    {
      name: "Purva Phalguni",
      symbol: "Front Legs of Bed",
      deity: "Bhaga",
      sounds: ["Mo", "Ta", "Ti", "Tu"],
      element: "Water",
      gana: "Manushya",
      yoni: "Rat",
      characteristics: "Creative, artistic, pleasure-seeking, generous",
      career: "Entertainment, arts, luxury goods, hospitality",
      lucky: { color: "Light Brown", number: 11, day: "Friday" },
      compatibility: ["Magha", "Uttara Phalguni", "Hasta"],
      slug: "purva-phalguni",
    },
    {
      name: "Uttara Phalguni",
      symbol: "Back Legs of Bed",
      deity: "Aryaman",
      sounds: ["Te", "To", "Pa", "Pi"],
      element: "Fire",
      gana: "Manushya",
      yoni: "Cow",
      characteristics: "Generous, helpful, leadership, stable relationships",
      career: "Social work, counseling, leadership, partnerships",
      lucky: { color: "Bright Blue", number: 12, day: "Monday" },
      compatibility: ["Magha", "Purva Phalguni", "Hasta"],
      slug: "uttara-phalguni",
    },
    {
      name: "Hasta",
      symbol: "Hand",
      deity: "Savitar",
      sounds: ["Pu", "Sha", "Na", "Tha"],
      element: "Earth",
      gana: "Deva",
      yoni: "Buffalo",
      characteristics: "Skillful, clever, crafty, good with hands",
      career: "Handicrafts, arts, healing, manual skills",
      lucky: { color: "Light Green", number: 13, day: "Wednesday" },
      compatibility: ["Magha", "Purva Phalguni", "Uttara Phalguni"],
      slug: "hasta",
    },
    {
      name: "Chitra",
      symbol: "Pearl/Gem",
      deity: "Tvashtar",
      sounds: ["Pe", "Po", "Ra", "Ri"],
      element: "Fire",
      gana: "Rakshasa",
      yoni: "Tiger",
      characteristics: "Artistic, beautiful, creative, attention to detail",
      career: "Architecture, jewelry, fashion, photography",
      lucky: { color: "Black", number: 14, day: "Tuesday" },
      compatibility: ["Swati", "Vishakha", "Anuradha"],
      slug: "chitra",
    },
    {
      name: "Swati",
      symbol: "Coral/Shoot of Plant",
      deity: "Vayu",
      sounds: ["Ru", "Re", "Ro", "Ta"],
      element: "Fire",
      gana: "Deva",
      yoni: "Buffalo",
      characteristics: "Independent, flexible, adaptable, freedom-loving",
      career: "Business, trade, travel, technology",
      lucky: { color: "Black", number: 15, day: "Saturday" },
      compatibility: ["Chitra", "Vishakha", "Anuradha"],
      slug: "swati",
    },
    {
      name: "Vishakha",
      symbol: "Triumphal Arch",
      deity: "Indra-Agni",
      sounds: ["Ti", "Tu", "Te", "To"],
      element: "Fire",
      gana: "Rakshasa",
      yoni: "Tiger",
      characteristics: "Ambitious, goal-oriented, determined, competitive",
      career: "Business, sports, politics, research",
      lucky: { color: "Gold", number: 16, day: "Thursday" },
      compatibility: ["Chitra", "Swati", "Anuradha"],
      slug: "vishakha",
    },
    {
      name: "Anuradha",
      symbol: "Triumphal Archway",
      deity: "Mitra",
      sounds: ["Na", "Ni", "Nu", "Ne"],
      element: "Fire",
      gana: "Deva",
      yoni: "Deer",
      characteristics: "Friendly, devoted, spiritual, good organizer",
      career: "Organization, counseling, spiritual work, diplomacy",
      lucky: { color: "Red", number: 17, day: "Tuesday" },
      compatibility: ["Chitra", "Swati", "Vishakha"],
      slug: "anuradha",
    },
    {
      name: "Jyeshtha",
      symbol: "Earring/Umbrella",
      deity: "Indra",
      sounds: ["No", "Ya", "Yi", "Yu"],
      element: "Air",
      gana: "Rakshasa",
      yoni: "Deer",
      characteristics: "Protective, authoritative, responsible, eldest",
      career: "Management, protection services, insurance, military",
      lucky: { color: "Cream", number: 18, day: "Wednesday" },
      compatibility: ["Ashlesha", "Moola", "Revati"],
      slug: "jyeshtha",
    },
    {
      name: "Moola",
      symbol: "Tied Roots",
      deity: "Nirriti",
      sounds: ["Ye", "Yo", "Bha", "Bhi"],
      element: "Air",
      gana: "Rakshasa",
      yoni: "Dog",
      characteristics: "Investigative, root-seeking, transformative, intense",
      career: "Research, medicine, occult, investigation",
      lucky: { color: "Brown", number: 19, day: "Thursday" },
      compatibility: ["Jyeshtha", "Purva Ashadha", "Uttara Ashadha"],
      slug: "moola",
    },
    {
      name: "Purva Ashadha",
      symbol: "Fan/Winnowing Basket",
      deity: "Apas",
      sounds: ["Bhu", "Dha", "Pha", "Dha"],
      element: "Air",
      gana: "Manushya",
      yoni: "Monkey",
      characteristics: "Invincible, proud, ambitious, influential",
      career: "Politics, debate, water sports, shipping",
      lucky: { color: "Black", number: 20, day: "Friday" },
      compatibility: ["Moola", "Uttara Ashadha", "Shravana"],
      slug: "purva-ashadha",
    },
    {
      name: "Uttara Ashadha",
      symbol: "Elephant Tusk",
      deity: "Vishvadevas",
      sounds: ["Bhe", "Bho", "Ja", "Ji"],
      element: "Air",
      gana: "Manushya",
      yoni: "Mongoose",
      characteristics: "Righteous, responsible, leadership, victory",
      career: "Leadership, government, social work, justice",
      lucky: { color: "Copper", number: 21, day: "Sunday" },
      compatibility: ["Moola", "Purva Ashadha", "Shravana"],
      slug: "uttara-ashadha",
    },
    {
      name: "Shravana",
      symbol: "Ear/Three Footprints",
      deity: "Vishnu",
      sounds: ["Ju", "Je", "Jo", "Gha"],
      element: "Air",
      gana: "Deva",
      yoni: "Monkey",
      characteristics: "Listening, learning, scholarly, traditional",
      career: "Education, counseling, media, communication",
      lucky: { color: "Light Blue", number: 22, day: "Monday" },
      compatibility: ["Purva Ashadha", "Uttara Ashadha", "Dhanishta"],
      slug: "shravana",
    },
    {
      name: "Dhanishta",
      symbol: "Drum/Flute",
      deity: "Eight Vasus",
      sounds: ["Ga", "Gi", "Gu", "Ge"],
      element: "Space",
      gana: "Rakshasa",
      yoni: "Lion",
      characteristics: "Wealthy, musical, rhythmic, generous",
      career: "Music, dance, real estate, finance",
      lucky: { color: "Silver Grey", number: 23, day: "Tuesday" },
      compatibility: ["Shravana", "Shatabhisha", "Purva Bhadrapada"],
      slug: "dhanishta",
    },
    {
      name: "Shatabhisha",
      symbol: "Empty Circle/100 Healers",
      deity: "Varuna",
      sounds: ["Go", "Sa", "Si", "Su"],
      element: "Space",
      gana: "Rakshasa",
      yoni: "Horse",
      characteristics: "Healing, mysterious, independent, research-oriented",
      career: "Medicine, research, astronomy, healing arts",
      lucky: { color: "Blue Green", number: 24, day: "Saturday" },
      compatibility: ["Dhanishta", "Purva Bhadrapada", "Uttara Bhadrapada"],
      slug: "shatabhisha",
    },
    {
      name: "Purva Bhadrapada",
      symbol: "Front Legs of Funeral Cot",
      deity: "Aja Ekapada",
      sounds: ["Se", "So", "Da", "Di"],
      element: "Space",
      gana: "Manushya",
      yoni: "Lion",
      characteristics: "Intense, passionate, transformative, spiritual",
      career: "Occult, spirituality, research, transformation",
      lucky: { color: "Silver Grey", number: 25, day: "Thursday" },
      compatibility: ["Dhanishta", "Shatabhisha", "Uttara Bhadrapada"],
      slug: "purva-bhadrapada",
    },
    {
      name: "Uttara Bhadrapada",
      symbol: "Back Legs of Funeral Cot",
      deity: "Ahir Budhnya",
      sounds: ["Du", "Tha", "Jha", "Na"],
      element: "Space",
      gana: "Manushya",
      yoni: "Cow",
      characteristics: "Wise, spiritual, introspective, mystical",
      career: "Spirituality, philosophy, counseling, mysticism",
      lucky: { color: "Purple", number: 26, day: "Saturday" },
      compatibility: ["Dhanishta", "Shatabhisha", "Purva Bhadrapada"],
      slug: "uttara-bhadrapada",
    },
    {
      name: "Revati",
      symbol: "Fish/Drum",
      deity: "Pushan",
      sounds: ["De", "Do", "Cha", "Chi"],
      element: "Space",
      gana: "Deva",
      yoni: "Elephant",
      characteristics: "Nurturing, protective, journey-oriented, completion",
      career: "Travel, guidance, protection, completion of projects",
      lucky: { color: "Brown", number: 27, day: "Wednesday" },
      compatibility: ["Ashlesha", "Jyeshtha", "Ashwini"],
      slug: "revati",
    },
  ];

  const nakshatraGroups = [
    {
      name: "Deva Gana (Divine)",
      nakshatras: [
        "Ashwini",
        "Mrigashira",
        "Punarvasu",
        "Pushya",
        "Hasta",
        "Swati",
        "Anuradha",
        "Shravana",
        "Revati",
      ],
      characteristics: "Spiritual, noble, divine qualities, helpful nature",
      color: "from-yellow-400 to-amber-500",
    },
    {
      name: "Manushya Gana (Human)",
      nakshatras: [
        "Bharani",
        "Rohini",
        "Ardra",
        "Purva Phalguni",
        "Uttara Phalguni",
        "Purva Ashadha",
        "Uttara Ashadha",
        "Purva Bhadrapada",
        "Uttara Bhadrapada",
      ],
      characteristics:
        "Balanced, practical, human-like qualities, social nature",
      color: "from-blue-400 to-indigo-500",
    },
    {
      name: "Rakshasa Gana (Demon)",
      nakshatras: [
        "Krittika",
        "Ashlesha",
        "Magha",
        "Chitra",
        "Vishakha",
        "Jyeshtha",
        "Moola",
        "Dhanishta",
        "Shatabhisha",
      ],
      characteristics: "Intense, powerful, transformative, materialistic",
      color: "from-red-400 to-pink-500",
    },
  ];

  const nakshatraElements = [
    {
      element: "Fire",
      nakshatras: [
        "Krittika",
        "Purva Phalguni",
        "Uttara Phalguni",
        "Purva Ashadha",
        "Uttara Ashadha",
      ],
      traits: "Energy, passion, leadership",
    },
    {
      element: "Earth",
      nakshatras: [
        "Ashwini",
        "Bharani",
        "Rohini",
        "Mrigashira",
        "Hasta",
        "Chitra",
        "Swati",
        "Anuradha",
        "Jyeshtha",
      ],
      traits: "Stability, material success, practical",
    },
    {
      element: "Air",
      nakshatras: [
        "Ardra",
        "Punarvasu",
        "Pushya",
        "Ashlesha",
        "Magha",
        "Vishakha",
        "Moola",
        "Shravana",
        "Dhanishta",
      ],
      traits: "Communication, intellect, movement",
    },
    {
      element: "Water",
      nakshatras: [
        "Shatabhisha",
        "Purva Bhadrapada",
        "Uttara Bhadrapada",
        "Revati",
      ],
      traits: "Emotions, intuition, healing",
    },
  ];

  return (
    <>
      <Helmet>
        <title>
          Nakshatras Guide - 27 Lunar Mansions in Vedic Astrology | AstroTick
        </title>
        <meta
          name="description"
          content="Master the 27 nakshatras (lunar mansions) in Vedic astrology. Learn their meanings, characteristics, compatibility, and influence on personality and destiny."
        />
        <meta
          name="keywords"
          content="nakshatras, lunar mansions, birth star, Vedic astrology, nakshatra compatibility, star signs, constellation astrology"
        />
        <meta
          property="og:title"
          content="Nakshatras Guide - 27 Lunar Mansions in Vedic Astrology"
        />
        <meta
          property="og:description"
          content="Master the 27 nakshatras (lunar mansions) in Vedic astrology. Learn their meanings, characteristics, and influence on personality."
        />
        <meta property="og:type" content="article" />
        <link
          rel="canonical"
          href="https://astrotick.com/learn-astrology/nakshatras"
        />
      </Helmet>

      <AstroTickHeader />

      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-2000"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <Zap className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full animate-pulse">
                    <Star className="h-3 w-3 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  Nakshatras
                </span>
              </h1>

              <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto animate-fade-in-delay">
                Explore the 27 lunar mansions that reveal your deepest
                personality traits, spiritual path, and cosmic purpose through
                ancient Vedic wisdom.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/nakshatra-finder">
                  <Button className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white px-8 py-3 text-lg flex items-center gap-2 animate-bounce-subtle">
                    <Search className="h-5 w-5" />
                    Find Your Nakshatra
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="border-white text-purple-500 hover:bg-white hover:text-purple-900 px-8 py-3 text-lg"
                >
                  <Play className="h-5 w-5 mr-2" />
                  Interactive Guide
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* What are Nakshatras */}
          <div className="mb-20">
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <CardTitle className="text-3xl font-bold text-center">
                  What are Nakshatras?
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div>
                    <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                      Nakshatras are the 27 lunar mansions or star
                      constellations that the Moon passes through during its
                      monthly orbit around Earth. Each nakshatra spans 13°20' of
                      the zodiac and represents a specific divine energy,
                      personality trait, and spiritual lesson.
                    </p>
                    <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                      Your birth nakshatra, determined by the Moon's position at
                      your birth time, reveals your emotional nature, instincts,
                      spiritual path, and karmic lessons. It's considered more
                      important than your sun sign in Vedic astrology for
                      understanding your core personality.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-gray-700">
                          27 star constellations covering 360° zodiac
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-gray-700">
                          Each has unique deity, symbol, and characteristics
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-gray-700">
                          Reveals emotional nature and spiritual path
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="w-full h-80 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                      {/* Animated Star Field */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-60 h-60 relative">
                          {/* Constellation pattern */}
                          <div className="absolute inset-0 animate-spin-slow">
                            {[...Array(27)].map((_, i) => (
                              <div
                                key={i}
                                className="absolute w-2 h-2 bg-purple-400 rounded-full animate-pulse"
                                style={{
                                  top: `${50 + 40 * Math.sin((i * 13.33 * Math.PI) / 180)}%`,
                                  left: `${50 + 40 * Math.cos((i * 13.33 * Math.PI) / 180)}%`,
                                  animationDelay: `${i * 100}ms`,
                                }}
                              />
                            ))}
                          </div>
                          {/* Central moon */}
                          <div className="absolute inset-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
                            <Moon className="h-8 w-8 text-white" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Nakshatra Groups */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Nakshatra Groups (Ganas)
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                The 27 nakshatras are classified into three groups based on
                their spiritual nature
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {nakshatraGroups.map((group, index) => (
                <Card
                  key={index}
                  className="bg-white/80 backdrop-blur-sm shadow-xl border-0 overflow-hidden group hover:shadow-2xl transition-all duration-300"
                >
                  <CardHeader
                    className={`bg-gradient-to-r ${group.color} text-white`}
                  >
                    <CardTitle className="text-xl text-center">
                      {group.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-gray-700 mb-4 text-center">
                      {group.characteristics}
                    </p>
                    <div className="text-center">
                      <Badge className="mb-3 bg-gray-100 text-gray-800">
                        {group.nakshatras.length} Nakshatras
                      </Badge>
                      <div className="text-sm text-gray-600 space-y-1">
                        {group.nakshatras.map((nak, i) => {
                          const nakshatraSlug = nakshatras.find(
                            (n) => n.name === nak,
                          )?.slug;
                          return (
                            <div key={i}>
                              {nakshatraSlug ? (
                                <Link href={`/nakshatras/${nakshatraSlug}`}>
                                  <span className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer transition-colors">
                                    {nak}
                                  </span>
                                </Link>
                              ) : (
                                <span>{nak}</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* All 27 Nakshatras Grid */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                All 27 Nakshatras
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Click on any nakshatra to learn detailed information about its
                characteristics, significance, and influence
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {nakshatras.map((nakshatra, index) => (
                <Link key={index} href={`/nakshatras/${nakshatra.slug}`}>
                  <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0 overflow-hidden group hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer">
                    <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                            <Star className="h-4 w-4" />
                          </div>
                          <div>
                            <CardTitle className="text-base font-semibold">
                              {nakshatra.name}
                            </CardTitle>
                            <p className="text-xs opacity-90">
                              {nakshatra.symbol}
                            </p>
                          </div>
                        </div>
                        <Badge className="bg-white/20 text-white border-white/30 text-xs">
                          {index + 1}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="font-semibold text-purple-700">
                            Deity:
                          </span>{" "}
                          {nakshatra.deity}
                        </div>
                        <div>
                          <span className="font-semibold text-pink-700">
                            Element:
                          </span>{" "}
                          {nakshatra.element}
                        </div>
                        <div>
                          <span className="font-semibold text-indigo-700">
                            Gana:
                          </span>{" "}
                          {nakshatra.gana}
                        </div>
                        <div>
                          <span className="font-semibold text-purple-700">
                            Lucky Day:
                          </span>{" "}
                          {nakshatra.lucky.day}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1 text-sm">
                          Characteristics
                        </h4>
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {nakshatra.characteristics}
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1 text-sm">
                          Syllables
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {nakshatra.sounds.map((sound, i) => (
                            <Badge
                              key={i}
                              variant="secondary"
                              className="text-xs px-1.5 py-0.5"
                            >
                              {sound}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <span className="text-xs text-gray-500">
                          Click to learn more
                        </span>
                        <ArrowRight className="h-4 w-4 text-purple-500 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Elemental Classification */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Elemental Classification
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Nakshatras are also classified by the four elements
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {nakshatraElements.map((element, index) => (
                <Card
                  key={index}
                  className="bg-white/80 backdrop-blur-sm shadow-lg border-0 overflow-hidden group hover:shadow-xl transition-all duration-300"
                >
                  <CardHeader className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white text-center">
                    <CardTitle className="text-lg">{element.element}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="text-center mb-3">
                      <Badge className="bg-teal-100 text-teal-800">
                        {element.nakshatras.length} Nakshatras
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 text-center mb-3">
                      {element.traits}
                    </p>
                    <div className="text-xs text-gray-500 space-y-1">
                      {element.nakshatras.map((nak, i) => {
                        const nakshatraSlug = nakshatras.find(
                          (n) => n.name === nak,
                        )?.slug;
                        return (
                          <div key={i} className="text-center">
                            {nakshatraSlug ? (
                              <Link href={`/nakshatras/${nakshatraSlug}`}>
                                <span className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer transition-colors">
                                  {nak}
                                </span>
                              </Link>
                            ) : (
                              <span>{nak}</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Interactive Tools */}
          <div className="mb-20">
            <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl border-0">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4">
                    Discover Your Nakshatra
                  </h2>
                  <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
                    Use our tools to find your birth nakshatra and explore its
                    significance
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Link href="/nakshatra-finder">
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all cursor-pointer group">
                      <CardContent className="p-6 text-center">
                        <Search className="h-12 w-12 text-yellow-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                        <h3 className="text-lg font-semibold mb-2">
                          Nakshatra Finder
                        </h3>
                        <p className="text-sm text-indigo-100">
                          Find your birth star constellation
                        </p>
                      </CardContent>
                    </Card>
                  </Link>

                  <Link href="/baby-naming">
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all cursor-pointer group">
                      <CardContent className="p-6 text-center">
                        <Heart className="h-12 w-12 text-pink-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                        <h3 className="text-lg font-semibold mb-2">
                          Baby Naming
                        </h3>
                        <p className="text-sm text-indigo-100">
                          Choose names based on nakshatra
                        </p>
                      </CardContent>
                    </Card>
                  </Link>

                  <Link href="/kundli">
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all cursor-pointer group">
                      <CardContent className="p-6 text-center">
                        <Sparkles className="h-12 w-12 text-purple-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                        <h3 className="text-lg font-semibold mb-2">
                          Complete Chart
                        </h3>
                        <p className="text-sm text-indigo-100">
                          See nakshatra in your birth chart
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
