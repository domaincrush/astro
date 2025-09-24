import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { Badge } from "src/components/ui/badge";
import { Button } from "src/components/ui/button";
import {
  Crown,
  Zap,
  Star,
  Eye,
  Target,
  Calculator,
  BookOpen,
  Sparkles,
  Globe,
  TrendingUp,
  Clock,
  Heart,
  Shield,
  Gem,
  CheckCircle,
  Play,
  Search,
  ArrowRight,
} from "lucide-react";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";
import { Link } from "wouter";

export default function AdvancedTechniques() {
  const [activeTab, setActiveTab] = useState("systems");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const advancedSystems = [
    {
      name: "Krishnamurti Paddhati (KP)",
      icon: Target,
      description:
        "Stellar astrology system using 249 subdivisions for precise timing",
      features: [
        "Sub-lord analysis for accuracy",
        "Horary astrology applications",
        "Precise event timing",
        "Significator theory",
        "Ruling planet concept",
      ],
      difficulty: "Advanced",
      specialty: "Timing & Predictions",
      color: "from-purple-600 to-indigo-700",
    },
    {
      name: "Nadi Astrology",
      icon: BookOpen,
      description:
        "Ancient palm leaf predictions written by sages thousands of years ago",
      features: [
        "Thumb impression identification",
        "Detailed life predictions",
        "Karmic analysis",
        "Remedial measures",
        "Past life connections",
      ],
      difficulty: "Master Level",
      specialty: "Karma & Destiny",
      color: "from-amber-600 to-orange-700",
    },
    {
      name: "Prashna Shastra",
      icon: Eye,
      description:
        "Horary astrology answering specific questions using moment of inquiry",
      features: [
        "Question-based charts",
        "Immediate answers",
        "Event prediction",
        "Lost object finding",
        "Yes/No questions",
      ],
      difficulty: "Advanced",
      specialty: "Query Resolution",
      color: "from-green-600 to-emerald-700",
    },
    {
      name: "Tajik Astrology",
      icon: Globe,
      description:
        "Persian-Arabic system focusing on annual predictions and varshphal",
      features: [
        "Annual charts (Varshphal)",
        "Sahams (Arabic parts)",
        "Muntha calculations",
        "Tri-pataki chakra",
        "Planetary strength analysis",
      ],
      difficulty: "Advanced",
      specialty: "Annual Predictions",
      color: "from-blue-600 to-cyan-700",
    },
  ];

  const specializedTechniques = [
    {
      technique: "Divisional Charts (Vargas)",
      description: "16 specialized charts for different life areas",
      applications: [
        "D9 (Navamsa) - Marriage & spouse",
        "D10 (Dasamsa) - Career & profession",
        "D12 (Dwadasamsa) - Parents & family",
        "D16 (Shodasamsa) - Vehicles & luxuries",
        "D24 (Chaturvimshamsa) - Education",
        "D30 (Trimsamsa) - Misfortunes & obstacles",
      ],
      mastery: "Essential for detailed analysis",
    },
    {
      technique: "Yogas & Combinations",
      description: "Special planetary combinations creating unique effects",
      applications: [
        "Raj Yoga - Royal combinations",
        "Dhana Yoga - Wealth combinations",
        "Viparita Raj Yoga - Transformation",
        "Neecha Bhanga - Cancellation of debilitation",
        "Kemadruma - Isolation combinations",
        "Saraswati Yoga - Knowledge & wisdom",
      ],
      mastery: "Advanced pattern recognition",
    },
    {
      technique: "Ashtakavarga System",
      description: "Numerical strength calculation for planets and houses",
      applications: [
        "Planetary strength assessment",
        "House strength evaluation",
        "Transit predictions",
        "Benefic/malefic determination",
        "Timing of events",
        "Sarvashtakavarga total",
      ],
      mastery: "Quantitative analysis expertise",
    },
    {
      technique: "Dasha Progressions",
      description: "Advanced timing techniques beyond basic Vimshottari",
      applications: [
        "Ashtottari Dasha (108 years)",
        "Yogini Dasha (36 years)",
        "Chara Dasha (120 years)",
        "Kala Chakra Dasha",
        "Narayana Dasha",
        "Lagna Dasha systems",
      ],
      mastery: "Multi-system timing analysis",
    },
  ];

  const researchMethods = [
    {
      method: "Chart Rectification",
      description: "Correcting birth time using life events",
      steps: [
        "Analyze major life events",
        "Use divisional charts",
        "Apply dasha timing",
        "Verify with transits",
        "Fine-tune using minor events",
      ],
      importance: "Critical for accuracy",
    },
    {
      method: "Predictive Synthesis",
      description: "Combining multiple techniques for predictions",
      steps: [
        "Birth chart analysis",
        "Divisional chart study",
        "Dasha system application",
        "Transit evaluation",
        "Yoga identification",
      ],
      importance: "Comprehensive forecasting",
    },
    {
      method: "Remedial Astrology",
      description: "Prescribing effective solutions for planetary afflictions",
      steps: [
        "Identify root causes",
        "Assess planetary strength",
        "Determine appropriate remedies",
        "Time remedy implementation",
        "Monitor progress",
      ],
      importance: "Practical application",
    },
  ];

  const masterySources = [
    {
      category: "Classical Texts",
      sources: [
        "Brihat Parashara Hora Shastra",
        "Jataka Parijata",
        "Saravali",
        "Hora Ratna",
        "Phaladeepika",
        "Uttara Kalamrita",
      ],
      focus: "Foundational principles",
    },
    {
      category: "Modern Masters",
      sources: [
        "B.V. Raman's works",
        "K.S. Krishnamurti (KP System)",
        "Sanjay Rath teachings",
        "Hart deFouw studies",
        "Dennis Harness books",
        "Komilla Sutton guides",
      ],
      focus: "Contemporary interpretations",
    },
    {
      category: "Specialized Studies",
      sources: [
        "Medical Astrology",
        "Mundane Astrology",
        "Electional Astrology",
        "Relationship Astrology",
        "Financial Astrology",
        "Spiritual Astrology",
      ],
      focus: "Applied specializations",
    },
  ];

  const practiceGuidelines = [
    {
      level: "Intermediate to Advanced",
      requirements: [
        "Solid foundation in basic principles",
        "Experience with birth chart analysis",
        "Understanding of planetary periods",
        "Familiarity with house systems",
      ],
      recommendations: [
        "Study one system thoroughly",
        "Practice with known birth charts",
        "Document case studies",
        "Seek mentorship from experts",
      ],
    },
    {
      level: "Advanced to Master",
      requirements: [
        "Proficiency in multiple systems",
        "Ability to synthesize techniques",
        "Understanding of cultural contexts",
        "Experience with predictive work",
      ],
      recommendations: [
        "Research original texts",
        "Develop unique methodologies",
        "Teaching and sharing knowledge",
        "Contributing to astrological research",
      ],
    },
  ];

  return (
    <>
      <Helmet>
        <title>
          Advanced Techniques - Master Level Vedic Astrology | AstroTick
        </title>
        <meta
          name="description"
          content="Master advanced Vedic astrology techniques including KP System, Nadi Astrology, Prashna Shastra, divisional charts, yogas, and specialized prediction methods."
        />
        <meta
          name="keywords"
          content="advanced astrology, KP System, Nadi Astrology, Prashna Shastra, divisional charts, yogas, ashtakavarga, dasha systems, predictive astrology"
        />
        <meta
          property="og:title"
          content="Advanced Techniques - Master Level Vedic Astrology"
        />
        <meta
          property="og:description"
          content="Master advanced Vedic astrology techniques including specialized systems, prediction methods, and research approaches."
        />
        <meta property="og:type" content="article" />
        <link
          rel="canonical"
          href="https://astrotick.com/learn-astrology/advanced"
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
                    <Crown className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full animate-pulse">
                    <Sparkles className="h-3 w-3 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
                Advanced{" "}
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  Techniques
                </span>
              </h1>

              <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto animate-fade-in-delay">
                Master sophisticated Vedic astrology systems, specialized
                prediction methods, and research techniques for
                professional-level expertise.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white px-8 py-3 text-lg flex items-center gap-2 animate-bounce-subtle">
                  <Play className="h-5 w-5" />
                  Start Advanced Study
                </Button>
                <Button
                  variant="outline"
                  className="border-white text-orange-600 hover:bg-white hover:text-purple-900 px-8 py-3 text-lg"
                  onClick={() => setActiveTab("techniques")}
                >
                  <Target className="h-5 w-5 mr-2" />
                  Explore Techniques
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-lg p-2 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <Button
                  variant={activeTab === "systems" ? "default" : "ghost"}
                  onClick={() => setActiveTab("systems")}
                  className="flex items-center gap-2"
                >
                  <Crown className="h-4 w-4" />
                  Advanced Systems
                </Button>
                <Button
                  variant={activeTab === "techniques" ? "default" : "ghost"}
                  onClick={() => setActiveTab("techniques")}
                  className="flex items-center gap-2"
                >
                  <Target className="h-4 w-4" />
                  Specialized Techniques
                </Button>
                <Button
                  variant={activeTab === "research" ? "default" : "ghost"}
                  onClick={() => setActiveTab("research")}
                  className="flex items-center gap-2"
                >
                  <Search className="h-4 w-4" />
                  Research Methods
                </Button>
                <Button
                  variant={activeTab === "mastery" ? "default" : "ghost"}
                  onClick={() => setActiveTab("mastery")}
                  className="flex items-center gap-2"
                >
                  <BookOpen className="h-4 w-4" />
                  Path to Mastery
                </Button>
              </div>
            </div>
          </div>

          {/* Advanced Systems Tab */}
          {activeTab === "systems" && (
            <div className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Advanced Astrological Systems
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Sophisticated methodologies for precise predictions and deep
                  analysis
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {advancedSystems.map((system, index) => (
                  <Card
                    key={index}
                    className="bg-white/90 backdrop-blur-sm shadow-xl border-0 overflow-hidden group hover:shadow-2xl transition-all duration-300"
                  >
                    <CardHeader
                      className={`bg-gradient-to-r ${system.color} text-white`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                            <system.icon className="h-6 w-6" />
                          </div>
                          <div>
                            <CardTitle className="text-xl">
                              {system.name}
                            </CardTitle>
                            <p className="text-sm opacity-90">
                              {system.specialty}
                            </p>
                          </div>
                        </div>
                        <Badge className="bg-white/20 text-white border-white/30">
                          {system.difficulty}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <p className="text-gray-700 text-sm">
                        {system.description}
                      </p>

                      <div>
                        <h4 className="font-semibold text-indigo-700 mb-2">
                          Key Features
                        </h4>
                        <ul className="space-y-1">
                          {system.features.map((feature, i) => (
                            <li
                              key={i}
                              className="text-sm text-gray-600 flex items-center gap-2"
                            >
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Specialized Techniques Tab */}
          {activeTab === "techniques" && (
            <div className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Specialized Techniques
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Advanced methods for detailed analysis and precise predictions
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {specializedTechniques.map((technique, index) => (
                  <Card
                    key={index}
                    className="bg-white/90 backdrop-blur-sm shadow-xl border-0 overflow-hidden group hover:shadow-2xl transition-all duration-300"
                  >
                    <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                            <Target className="h-6 w-6" />
                          </div>
                          <div>
                            <CardTitle className="text-xl">
                              {technique.technique}
                            </CardTitle>
                            <p className="text-sm opacity-90">
                              {technique.mastery}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <p className="text-gray-700 text-sm">
                        {technique.description}
                      </p>

                      <div>
                        <h4 className="font-semibold text-purple-700 mb-2">
                          Applications
                        </h4>
                        <ul className="space-y-1">
                          {technique.applications.map((app, i) => (
                            <li key={i} className="text-sm text-gray-600">
                              • {app}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Research Methods Tab */}
          {activeTab === "research" && (
            <div className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Research Methods
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Scientific approaches to astrological analysis and validation
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {researchMethods.map((method, index) => (
                  <Card
                    key={index}
                    className="bg-white/90 backdrop-blur-sm shadow-xl border-0 overflow-hidden group hover:shadow-2xl transition-all duration-300"
                  >
                    <CardHeader className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                          <Search className="h-6 w-6" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {method.method}
                          </CardTitle>
                          <p className="text-sm opacity-90">
                            {method.importance}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <p className="text-gray-700 text-sm">
                        {method.description}
                      </p>

                      <div>
                        <h4 className="font-semibold text-teal-700 mb-2">
                          Process Steps
                        </h4>
                        <ol className="space-y-1">
                          {method.steps.map((step, i) => (
                            <li key={i} className="text-sm text-gray-600">
                              {i + 1}. {step}
                            </li>
                          ))}
                        </ol>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Mastery Path Tab */}
          {activeTab === "mastery" && (
            <div className="space-y-12">
              {/* Learning Sources */}
              <div>
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">
                    Path to Mastery
                  </h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Essential resources and progression guidelines for advanced
                    study
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {masterySources.map((source, index) => (
                    <Card
                      key={index}
                      className="bg-white/90 backdrop-blur-sm shadow-xl border-0 overflow-hidden group hover:shadow-2xl transition-all duration-300"
                    >
                      <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                            <BookOpen className="h-6 w-6" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">
                              {source.category}
                            </CardTitle>
                            <p className="text-sm opacity-90">{source.focus}</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        <ul className="space-y-2">
                          {source.sources.map((item, i) => (
                            <li
                              key={i}
                              className="text-sm text-gray-600 flex items-center gap-2"
                            >
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Practice Guidelines */}
              <div>
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">
                    Practice Guidelines
                  </h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Structured approach to developing advanced astrological
                    skills
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {practiceGuidelines.map((guideline, index) => (
                    <Card
                      key={index}
                      className="bg-white/90 backdrop-blur-sm shadow-xl border-0 overflow-hidden group hover:shadow-2xl transition-all duration-300"
                    >
                      <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                        <CardTitle className="text-xl">
                          {guideline.level}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6 space-y-4">
                        <div>
                          <h4 className="font-semibold text-indigo-700 mb-2">
                            Requirements
                          </h4>
                          <ul className="space-y-1">
                            {guideline.requirements.map((req, i) => (
                              <li
                                key={i}
                                className="text-sm text-gray-600 flex items-center gap-2"
                              >
                                <CheckCircle className="h-3 w-3 text-green-500" />
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold text-purple-700 mb-2">
                            Recommendations
                          </h4>
                          <ul className="space-y-1">
                            {guideline.recommendations.map((rec, i) => (
                              <li
                                key={i}
                                className="text-sm text-gray-600 flex items-center gap-2"
                              >
                                <ArrowRight className="h-3 w-3 text-purple-500" />
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Advanced Tools */}
          <div className="mt-20">
            <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl border-0">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4">
                    Advanced Analysis Tools
                  </h2>
                  <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
                    Apply advanced techniques with our professional-grade tools
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Link href="/premium-report">
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all cursor-pointer group">
                      <CardContent className="p-6 text-center">
                        <Crown className="h-12 w-12 text-yellow-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                        <h3 className="text-lg font-semibold mb-2">
                          Premium Analysis
                        </h3>
                        <p className="text-sm text-indigo-100">
                          Advanced chart interpretation
                        </p>
                      </CardContent>
                    </Card>
                  </Link>

                  <Link href="/kundli">
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all cursor-pointer group">
                      <CardContent className="p-6 text-center">
                        <Target className="h-12 w-12 text-purple-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                        <h3 className="text-lg font-semibold mb-2">
                          Divisional Charts
                        </h3>
                        <p className="text-sm text-indigo-100">
                          Specialized life area analysis
                        </p>
                      </CardContent>
                    </Card>
                  </Link>

                  <Link href="/dasha-calculator">
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all cursor-pointer group">
                      <CardContent className="p-6 text-center">
                        <Clock className="h-12 w-12 text-pink-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                        <h3 className="text-lg font-semibold mb-2">
                          Advanced Timing
                        </h3>
                        <p className="text-sm text-indigo-100">
                          Multi-dasha system analysis
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
