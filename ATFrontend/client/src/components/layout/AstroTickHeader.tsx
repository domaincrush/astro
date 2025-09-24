import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import {
  Menu,
  X,
  Star,
  User,
  LogOut,
  ChevronDown,
  MessageCircle,
  Settings,
  BookOpen,
  Calculator,
  Clock,
  Heart,
  Zap,
  Crown,
  Users,
  Award,
  Newspaper,
  FileText,
  CreditCard,
  MessageSquare,
  Wallet,
  Globe,
  Phone,
  HelpCircle,
  Send,
  AlertTriangle,
  Calendar,
  Sun,
  Moon,
  Stars,
  Sunrise,
  Sparkles,
} from "lucide-react";
import { Button } from "src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "src/components/ui/dropdown-menu";
import { useAuth } from "src/hooks/useAuth";
import { cn } from "src/lib/utils";
import { useLanguage } from "src/contexts/LanguageContext";
import LanguageSelector from "src/components/layout/LanguageSelector";

export default function AstroTickHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();
  const [, setLocation] = useLocation();
const logout = () => {
  localStorage.clear();
  window.location.href = "/login";
 }  
 const userData = (localStorage.getItem("user"))
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState({});
useEffect(() => { 
  console.log(userData)
  if(userData){
    setIsAuthenticated(true)
    setIsAdmin(JSON.parse(userData).role === 'admin')
    setUser(userData)
  }else {
    setIsAdmin(false)
    setIsAuthenticated(false)
    setUser({})
  }
},[userData])
  const { t, currentLanguage } = useLanguage();

  const texts = [
    "🎉 Ask Free Question 🎉", // English
    "🎉 இலவச கேள்வி 🎉", // Tamil
    "🎉 मुफ्त में प्रश्न पूछें 🎉", // Hindi
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % texts.length);
    }, 2000); // change every 2 seconds
    return () => clearInterval(interval);
  }, []);

  // Removed excessive console logging for production performance

  // Force Hindi context when on Hindi pages
  const isHindiPage =
    typeof location === "string" && location.startsWith("/hindi");
  const displayLanguage = isHindiPage ? "hi" : currentLanguage;

  const isActiveRoute = (path: string) => {
    return typeof location === "string" && location === path;
  };

  const handleLogout = () => {
    logout();
  };

  const zodiacSigns = [
    { name: "HOME", path: "/", icon: "🏠", image: null },
    { name: "MESHA", path: "/daily-horoscope", icon: "♈", image: "aries" },
    {
      name: "VRISHABHA",
      path: "/daily-horoscope",
      icon: "♉",
      image: "taurus",
    },
    { name: "MITHUNA", path: "/daily-horoscope", icon: "♊", image: "gemini" },
    { name: "KARKA", path: "/daily-horoscope", icon: "♋", image: "cancer" },
    { name: "SIMHA", path: "/daily-horoscope", icon: "♌", image: "leo" },
    { name: "KANYA", path: "/daily-horoscope", icon: "♍", image: "virgo" },
    { name: "TULA", path: "/daily-horoscope", icon: "♎", image: "libra" },
    {
      name: "VRISHCHIKA",
      path: "/daily-horoscope",
      icon: "♏",
      image: "scorpio",
    },
    {
      name: "DHANU",
      path: "/daily-horoscope",
      icon: "♐",
      image: "sagittarius",
    },
    {
      name: "MAKARA",
      path: "/daily-horoscope",
      icon: "♑",
      image: "capricorn",
    },
    { name: "KUMBHA", path: "/daily-horoscope", icon: "♒", image: "aquarius" },
    { name: "MEENA", path: "/daily-horoscope", icon: "♓", image: "pisces" },
  ];

  const learnAstrologyItems = [
    {
      href: "/learn-astrology/basics",
      label: "Astrology Basics",
      icon: BookOpen,
      description: "Learn fundamentals of Vedic astrology",
    },
    {
      href: "/learn-astrology/birth-chart",
      label: "Birth Chart Reading",
      icon: Star,
      description: "Understand your natal chart",
    },
    {
      href: "/learn-astrology/planets",
      label: "Planets & Houses",
      icon: Calculator,
      description: "Planetary influences and house meanings",
    },
    {
      href: "/learn-astrology/nakshatras",
      label: "Nakshatras",
      icon: Zap,
      description: "27 lunar mansions explained",
    },
    {
      href: "/learn-astrology/doshas",
      label: "Doshas & Remedies",
      icon: Heart,
      description: "Identify and remedy planetary doshas",
    },
    {
      href: "/learn-astrology/muhurta",
      label: "Muhurta (Timing)",
      icon: Clock,
      description: "Auspicious timing selection",
    },
    {
      href: "/learn-astrology/advanced",
      label: "Advanced Techniques",
      icon: Crown,
      description: "KP system, divisional charts",
    },
  ];

  const aboutUsItems = [
    {
      href: "/about/story",
      label: "Our Story",
      icon: FileText,
      description: "Learn about our journey and mission",
    },
    {
      href: "/about/team",
      label: "Team of Astrologers",
      icon: Users,
      description: "Meet our expert astrologers",
    },
    {
      href: "/about/testimonials",
      label: "Testimonials",
      icon: Award,
      description: "What our clients say about us",
    },
    {
      href: "/about/media",
      label: "Media Coverage",
      icon: Newspaper,
      description: "Press releases and media mentions",
    },
  ];

  const dashboardItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: User,
      description: "Personal dashboard overview",
    },
    {
      href: "/dashboard/reports",
      label: "My Reports",
      icon: FileText,
      description: "View your astrology reports",
    },
    {
      href: "/dashboard/bookings",
      label: "Bookings",
      icon: Clock,
      description: "Manage your consultations",
    },
    // {
    //   href: "/dashboard/chat",
    //   label: "Chat History",
    //   icon: MessageSquare,
    //   description: "View chat conversations",
    // },
    // {
    //   href: "/dashboard/wallet",
    //   label: "Wallet",
    //   icon: Wallet,
    //   description: "Manage your balance and transactions",
    // },
  ];

  const languageItems = [
    {
      href: "?lang=en",
      label: "English",
      icon: Globe,
      description: "Switch to English",
    },
    {
      href: "?lang=hi",
      label: "हिंदी (Hindi)",
      icon: Globe,
      description: "हिंदी में बदलें",
    },
    {
      href: "?lang=ta",
      label: "தமிழ் (Tamil)",
      icon: Globe,
      description: "தமிழில் மாற்றவும்",
    },
    {
      href: "?lang=te",
      label: "తెలుగు (Telugu)",
      icon: Globe,
      description: "తెలుగులో మార్చండి",
    },
    {
      href: "?lang=bn",
      label: "বাংলা (Bengali)",
      icon: Globe,
      description: "বাংলায় পরিবর্তন করুন",
    },
    {
      href: "?lang=gu",
      label: "ગુજરાતી (Gujarati)",
      icon: Globe,
      description: "ગુજરાતીમાં બદલો",
    },
    {
      href: "?lang=mr",
      label: "मराठी (Marathi)",
      icon: Globe,
      description: "मराठीत बदला",
    },
    {
      href: "?lang=kn",
      label: "ಕನ್ನಡ (Kannada)",
      icon: Globe,
      description: "ಕನ್ನಡಕ್ಕೆ ಬದಲಾಯಿಸಿ",
    },
  ];

  const supportItems = [
    {
      href: "/support/contact",
      label: "Contact Us",
      icon: Phone,
      description: "Get in touch with our support team",
    },
    {
      href: "/support/faq",
      label: "FAQ",
      icon: HelpCircle,
      description: "Frequently asked questions",
    },
    {
      href: "/support/feedback",
      label: "Feedback",
      icon: Send,
      description: "Share your thoughts and suggestions",
    },
    {
      href: "/support/report",
      label: "Report an Issue",
      icon: AlertTriangle,
      description: "Report technical issues or concerns",
    },
  ];

  const horoscopeItems = [
    {
      href: "/horoscopes",
      label: "All Horoscopes",
      icon: Star,
      description: "Complete horoscope collection by zodiac sign",
    },
    {
      href: "/daily-horoscope",
      label: "Daily",
      icon: Star,
      description: "Daily horoscope predictions",
    },
    {
      href: "/weekly-horoscope",
      label: "Weekly",
      icon: Calendar,
      description: "Weekly horoscope forecasts",
    },
    {
      href: "/monthly-horoscope",
      label: "Monthly",
      icon: Calendar,
      description: "Monthly horoscope insights",
    },
    {
      href: "/yearly-horoscope",
      label: "Yearly",
      icon: Calendar,
      description: "Yearly horoscope overview",
    },
    {
      href: "/love-horoscope",
      label: "Love",
      icon: Heart,
      description: "Love and relationship predictions",
    },
    {
      href: "/career-horoscope",
      label: "Career",
      icon: CreditCard,
      description: "Career and professional guidance",
    },
    {
      href: "/health-horoscope",
      label: "Health",
      icon: Heart,
      description: "Health and wellness predictions",
    },
  ];

  const kundliItems = [
    {
      href: "/kundli",
      label: "Free Kundli",
      icon: FileText,
      description: "Generate your complete birth chart",
    },
    {
      href: "/kundli-matching",
      label: "Kundli Matching",
      icon: Heart,
      description: "Traditional gun milan matching",
    },
    {
      href: "/love-horoscope",
      label: "Love",
      icon: Heart,
      description: "Love and relationship predictions",
    },
    {
      href: "/marriage-astrology",
      label: "Marriage",
      icon: Heart,
      description: "Marriage astrology, traditions & compatibility guidance",
    },
  ];

  const year2025Items = [
    {
      href: "/year-2025/horoscope",
      label: "Horoscope 2025",
      icon: Star,
      description: "Complete yearly horoscope predictions for all zodiac signs",
    },
    {
      href: "/year-2025/numerology",
      label: "Numerology 2025",
      icon: Calculator,
      description: "Numerological predictions and insights for the year",
    },
    {
      href: "/year-2025/tarot",
      label: "Tarot 2025",
      icon: Zap,
      description: "Tarot predictions and guidance for the year ahead",
    },
    {
      href: "/year-2025/festivals",
      label: "Festivals 2025",
      icon: Calendar,
      description: "Complete calendar of Hindu festivals and auspicious dates",
    },
    {
      href: "/year-2025/planet-transits",
      label: "Planet Transit 2025",
      icon: Sun,
      description: "Planetary movements and their effects throughout the year",
    },
  ];

  const astrologyToolsItems = [
    {
      href: "/moon-sign-checker",
      label: "Moon Sign Calculator",
      icon: Moon,
      description: "Calculate your moon sign and nakshatra",
    },
    {
      href: "/nakshatra-finder",
      label: "Nakshatra Finder",
      icon: Star,
      description: "Find your birth star and characteristics",
    },
    {
      href: "/lagna-calculator",
      label: "Lagna Calculator",
      icon: Sun,
      description: "Calculate your ascendant and analysis",
    },
    {
      href: "/dosham-detector",
      label: "Dosham Detector",
      icon: AlertTriangle,
      description: "Detect and analyze planetary doshas",
    },
    {
      href: "/sade-sati",
      label: "Sade Sati Calculator",
      icon: Clock,
      description: "Calculate your Saturn transit period",
    },
    {
      href: "/lal-kitab",
      label: "Lal Kitab Status",
      icon: Calculator,
      description: "Planetary status in Lal Kitab system",
    },
    {
      href: "/baby-naming",
      label: "Baby Name Generator",
      icon: Users,
      description: "Generate names based on nakshatra",
    },
    {
      href: "/lucky-numbers",
      label: "Lucky Numbers",
      icon: Star,
      description: "Calculate your lucky numbers and colors",
    },
    {
      href: "/dasha-calculator",
      label: "Dasha Calculator",
      icon: Clock,
      description: "Calculate planetary periods and timings",
    },
    {
      href: "/numerology",
      label: "Numerology Calculator",
      icon: Calculator,
      description: "Calculate your life path number",
    },
  ];

  const astrologyReportsItems = [
    {
      href: "/reports/premium",
      label: "Premium Horoscope",
      icon: Crown,
      description: "Detailed premium horoscope analysis",
    },
    {
      href: "/reports/life",
      label: "Life Report",
      icon: User,
      description: "Complete life pattern analysis",
    },
    {
      href: "/reports/career",
      label: "Career Report",
      icon: CreditCard,
      description: "Professional growth predictions",
    },
    {
      href: "/reports/marriage",
      label: "Marriage Report",
      icon: Heart,
      description: "Marriage timing and compatibility",
    },
    {
      href: "/reports/super-horoscope",
      label: "Super Horoscope",
      icon: Sparkles,
      description: "Advanced comprehensive astrological analysis",
    },
  ];

  const panchangMuhuratItems = [
    {
      href: "/panchang",
      label: "Daily Panchang",
      icon: Calendar,
      description:
        "Complete daily panchang with tithi, nakshatra, yoga, karana and vara for auspicious timing",
    },
    {
      href: "/shubh-muhurat",
      label: "Shubh Muhurat",
      icon: Sun,
      description:
        "Find auspicious timing for marriage, griha pravesh, business launch and ceremonies",
    },
    {
      href: "/choghadiya",
      label: "Choghadiya",
      icon: Clock,
      description:
        "Traditional 8 time divisions for daily activities - Amrit, Shubh, Labh, Char timings",
    },
    {
      href: "/hindu-festivals",
      label: "Hindu Festivals",
      icon: Calendar,
      description:
        "Complete calendar of Hindu festivals, ekadashi, purnima, amavasya and vratham dates",
    },
    {
      href: "/rahu-kaal",
      label: "Rahu Kaal",
      icon: AlertTriangle,
      description:
        "Daily inauspicious Rahu kaal timings to avoid for important work and travel",
    },
    {
      href: "/hora-timings",
      label: "Hora Timings",
      icon: Clock,
      description:
        "Planetary hour calculations for Venus, Jupiter, Mercury effects on daily activities",
    },
    {
      href: "/abhijit-muhurat",
      label: "Abhijit Muhurat",
      icon: Star,
      description:
        "Most auspicious 48-minute daily window for starting new ventures and important work",
    },
  ];

  // Create translation function that works with display language
  const tt = (key: string, fallback: string) => {
    if (displayLanguage === "hi") {
      const hindiTranslations: Record<string, string> = {
        "horoscopes.daily": "राशिफल",
        "header.kundli": "कुंडली",
        "navigation.year2025": "वर्ष 2025",
        "navigation.freeAstrologyTools": "मुफ्त ज्योतिष उपकरण",
        "navigation.astrologyReports": "ज्योतिष रिपोर्ट",
        "navigation.panchangMuhurat": "पंचांग और मुहूर्त",
        "navigation.learnAstrology": "ज्योतिष सीखें",
        "navigation.blog": "ब्लॉग",
        "navigation.admin": "एडमिन",
        "header.talkToAstrologer": "ज्योतिषी से बात करें",
        "header.signIn": "साइन इन",
        "header.signUp": "साइन अप",
      };
      return hindiTranslations[key] || fallback;
    }
    return t(key, fallback);
  };

  const mainNavItems = [
    {
      label: tt("horoscopes.daily", "Horoscope"),
      dropdown: horoscopeItems,
    },
    {
      label: tt("header.kundli", "Kundli"),
      dropdown: kundliItems,
    },
    {
      label: tt("navigation.year2025", "Year 2025"),
      dropdown: year2025Items,
    },
    {
      label: tt("navigation.freeAstrologyTools", "Free Astrology Tools"),
      dropdown: astrologyToolsItems,
    },
    {
      label: tt("navigation.astrologyReports", "Astrology Reports"),
      dropdown: astrologyReportsItems,
    },
    {
      label: tt("navigation.panchangMuhurat", "Panchang & Muhurat"),
      dropdown: panchangMuhuratItems,
    },
    {
      label: tt("navigation.learnAstrology", "Learn Astrology"),
      icon: BookOpen,
      dropdown: learnAstrologyItems,
    },
    { href: "/blog", label: tt("navigation.blog", "Blog") },
  ];

  // if (isAdmin) {
  //   mainNavItems.push({
  //     href: "/admin",
  //     label: t("navigation.admin", "Admin"),
  //   });
  // }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Logo Section - Above Navigation like AstroYogi */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-2">
            {/* Logo - Left Side */}
            <Link
              href="/"
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              <div className="relative w-14 h-14">
                {/* Cosmic nebula background */}
                <div className="absolute inset-0 w-14 h-14 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-full shadow-2xl"></div>
                <div className="absolute inset-0.5 w-13 h-13 bg-gradient-to-tr from-orange-400 via-red-500 to-purple-700 rounded-full opacity-85"></div>

                {/* Cosmic Precision Symbol */}
                <svg
                  className="absolute inset-0 w-14 h-14"
                  viewBox="0 0 56 56"
                  fill="none"
                >
                  <defs>
                    {/* Cosmic energy gradient */}
                    <radialGradient id="cosmicEnergy" cx="50%" cy="50%" r="70%">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                      <stop
                        offset="30%"
                        stopColor="#fbbf24"
                        stopOpacity="0.9"
                      />
                      <stop
                        offset="70%"
                        stopColor="#ec4899"
                        stopOpacity="0.7"
                      />
                      <stop
                        offset="100%"
                        stopColor="#8b5cf6"
                        stopOpacity="0.5"
                      />
                    </radialGradient>

                    {/* Mystical glow filter */}
                    <filter id="mysticalGlow">
                      <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>

                    {/* Sacred geometry pattern */}
                    <pattern
                      id="sacredPattern"
                      x="0"
                      y="0"
                      width="8"
                      height="8"
                      patternUnits="userSpaceOnUse"
                    >
                      <circle
                        cx="4"
                        cy="4"
                        r="0.5"
                        fill="white"
                        opacity="0.1"
                      />
                    </pattern>
                  </defs>

                  {/* Sacred geometry base */}
                  <circle
                    cx="28"
                    cy="28"
                    r="26"
                    fill="url(#sacredPattern)"
                    opacity="0.3"
                  />

                  {/* Central cosmic mandala */}
                  <g transform="translate(28,28)">
                    {/* Outer cosmic ring */}
                    <circle
                      r="16"
                      stroke="white"
                      strokeWidth="0.5"
                      fill="none"
                      opacity="0.2"
                    />

                    {/* Sacred hexagon (wisdom symbol) */}
                    <path
                      d="M -8,-14 L 8,-14 L 16,0 L 8,14 L -8,14 L -16,0 Z"
                      stroke="white"
                      strokeWidth="0.8"
                      fill="none"
                      opacity="0.3"
                    />

                    {/* Central cosmic eye/consciousness */}
                    <circle
                      r="8"
                      fill="url(#cosmicEnergy)"
                      opacity="0.9"
                      filter="url(#mysticalGlow)"
                    />

                    {/* Precision tick mark integrated as cosmic needle */}
                    <g transform="rotate(-15)">
                      <path
                        d="M -3,0 L 0,-6 L 3,0 L 1,4 L -1,4 Z"
                        fill="white"
                        opacity="0.95"
                        filter="url(#mysticalGlow)"
                      />
                      {/* Cosmic alignment line */}
                      <line
                        x1="0"
                        y1="-6"
                        x2="0"
                        y2="-12"
                        stroke="white"
                        strokeWidth="1"
                        opacity="0.7"
                      />
                    </g>

                    {/* Inner energy vortex */}
                    <circle r="3" fill="white" opacity="0.8" />
                    <circle r="1.5" fill="url(#cosmicEnergy)" opacity="1" />
                  </g>

                  {/* Zodiac constellation points */}
                  <g fill="white" opacity="0.4">
                    {/* Primary constellation points */}
                    <circle cx="28" cy="6" r="1" opacity="0.6" />
                    <circle cx="50" cy="28" r="1" opacity="0.6" />
                    <circle cx="28" cy="50" r="1" opacity="0.6" />
                    <circle cx="6" cy="28" r="1" opacity="0.6" />

                    {/* Secondary constellation points */}
                    <circle cx="43" cy="13" r="0.7" opacity="0.4" />
                    <circle cx="43" cy="43" r="0.7" opacity="0.4" />
                    <circle cx="13" cy="43" r="0.7" opacity="0.4" />
                    <circle cx="13" cy="13" r="0.7" opacity="0.4" />

                    {/* Tertiary star field */}
                    <circle cx="35" cy="10" r="0.3" />
                    <circle cx="46" cy="21" r="0.3" />
                    <circle cx="46" cy="35" r="0.3" />
                    <circle cx="35" cy="46" r="0.3" />
                    <circle cx="21" cy="46" r="0.3" />
                    <circle cx="10" cy="35" r="0.3" />
                    <circle cx="10" cy="21" r="0.3" />
                    <circle cx="21" cy="10" r="0.3" />
                  </g>

                  {/* Mystic zodiac symbols - very subtle */}
                  <g
                    fill="white"
                    fontSize="6"
                    textAnchor="middle"
                    opacity="0.2"
                  >
                    <text x="28" y="10">
                      ♈
                    </text>
                    <text x="40" y="13">
                      ♉
                    </text>
                    <text x="46" y="21">
                      ♊
                    </text>
                    <text x="46" y="28">
                      ♋
                    </text>
                    <text x="46" y="35">
                      ♌
                    </text>
                    <text x="40" y="43">
                      ♍
                    </text>
                    <text x="28" y="46">
                      ♎
                    </text>
                    <text x="16" y="43">
                      ♏
                    </text>
                    <text x="10" y="35">
                      ♐
                    </text>
                    <text x="10" y="28">
                      ♑
                    </text>
                    <text x="10" y="21">
                      ♒
                    </text>
                    <text x="16" y="13">
                      ♓
                    </text>
                  </g>

                  {/* Cosmic energy rays */}
                  <g stroke="white" strokeWidth="0.3" opacity="0.15">
                    <line x1="28" y1="0" x2="28" y2="8" />
                    <line x1="56" y1="28" x2="48" y2="28" />
                    <line x1="28" y1="56" x2="28" y2="48" />
                    <line x1="0" y1="28" x2="8" y2="28" />
                  </g>
                </svg>

                {/* Cosmic aura effect */}
                <div className="absolute -inset-2 w-18 h-18 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-10 blur-md"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-purple-600 bg-clip-text text-transparent">
                  AstroTick
                </span>
                <span className="text-xs text-gray-500 -mt-1">
                  Vedic Astrology
                </span>
              </div>
            </Link>

            {/* Desktop: Language Selector, Sign In/Up Buttons and Chat Button | Mobile: Profile Icon and Menu */}
            <div className="flex items-center space-x-4">
              {/* Language Selector - Desktop Only */}
              <div className="hidden ">
                <LanguageSelector />
              </div>

              {/* User Authentication/Profile Section */}
              <div className="flex items-center space-x-3">
                {user && (
                  <span className="hidden text-sm text-gray-600 font-medium">
                    ₹{((user as any).balance / 100).toFixed(2) || "0.00"}
                  </span>
                )}
                {!isAuthenticated ? (
                  <>
                    {/* Desktop: Enhanced Two buttons */}
                    <div className="hidden md:flex items-center space-x-3">
                      <Link href="/login">
                        <Button
                          variant="outline"
                          className="relative overflow-hidden group bg-white/80 backdrop-blur-sm text-gray-700 hover:text-white border-2 border-purple-200 hover:border-purple-500 text-sm px-5 py-2.5 rounded-full font-medium transition-all duration-300 hover:shadow-lg hover:shadow-purple-200/50"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-600 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300"></div>
                          <div className="relative flex items-center gap-2">
                            <User className="h-4 w-4" />
                            {tt("header.signIn", "Sign In")}
                          </div>
                        </Button>
                      </Link>
                      <Link href="/signup">
                        <Button className="relative overflow-hidden group bg-gradient-to-r from-orange-500 via-red-500 to-purple-600 text-white hover:from-orange-600 hover:via-red-600 hover:to-purple-700 text-sm px-5 py-2.5 rounded-full font-medium shadow-lg hover:shadow-xl hover:shadow-orange-200/50 transition-all duration-300 transform hover:scale-105">
                          <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-red-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="relative flex items-center gap-2">
                            <Star className="h-4 w-4" />
                            {tt("header.signUp", "Sign Up")}
                          </div>
                        </Button>
                      </Link>
                    </div>
                    {/* Mobile: Enhanced profile icon */}
                    <div className="md:hidden">
                      <Link href="/login">
                        <Button
                          variant="ghost"
                          className="relative p-3 group bg-gradient-to-br from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 rounded-full border border-purple-100 hover:border-purple-300 transition-all duration-300 hover:shadow-lg hover:shadow-purple-200/50"
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="relative">
                            <User className="h-5 w-5 text-purple-600 group-hover:text-purple-700 transition-colors duration-300" />
                          </div>
                          {/* Subtle glow effect */}
                          <div className="absolute -inset-1 bg-gradient-to-br from-purple-400/20 to-indigo-400/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </Button>
                      </Link>
                    </div>
                  </>
                ) : (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="flex items-center gap-2 text-gray-600 hover:text-purple-600 text-sm border-0 focus:border-0 hover:border-0"
                      >
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {user?.email?.charAt(0).toUpperCase() || "U"}
                          </span>
                        </div>
                        <span className="hidden sm:inline">{user?.email}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64">
                      {dashboardItems.map((item) => (
                        <DropdownMenuItem key={item.href} asChild>
                          <Link
                            href={item.href}
                            className="flex items-center w-full cursor-pointer"
                          >
                            <div className="flex items-start gap-3 p-2">
                              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-green-100">
                                <item.icon className="h-4 w-4 text-green-600" />
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-gray-900">
                                  {item.label}
                                </div>
                                <div className="text-sm text-gray-600 mt-1">
                                  {item.description}
                                </div>
                              </div>
                            </div>
                          </Link>
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuItem asChild>
                        <Link
                          href="/profile"
                          className="flex items-center w-full cursor-pointer"
                        >
                          <User className="h-4 w-4 mr-2" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      {isAdmin && (
                        <DropdownMenuItem asChild>
                          <Link
                            href="/admin-dashboard"
                            className="flex items-center w-full cursor-pointer"
                          >
                            <Settings className="h-4 w-4 mr-2" />
                            Admin Dashboard
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="cursor-pointer"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>

              {/* Mobile Menu Button - Next to Profile Icon */}
              <div className="md:hidden">
                <button
                  className="text-gray-600 p-2 hover:text-purple-600 transition-colors"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {isMenuOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </button>
              </div>

              {/* Free Premium Report Button - Desktop */}
              <div className="hidden md:block">
                <Link href="/reports/premium">
                  <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-300 font-semibold">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🎁</span>
                      <span>Free Premium Report</span>
                    </div>
                  </Button>
                </Link>
              </div>

              {/* Chat with Astrologer Button - Desktop */}
              <div className="hidden md:block">
                <Link href="/astrologers">
                  <Button className="bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 hover:scale-105 px-6 py-3 flex items-center space-x-2 text-sm whitespace-nowrap transition-all duration-300 shadow-lg rounded-lg">
                    <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse shadow-sm"></div>
                    <span className="font-medium">
                      {tt("header.talkToAstrologer", "Chat with Astrologer")}
                    </span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex items-center justify-center py-4">
          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center justify-center space-x-1">
            {mainNavItems.map((item) => {
              // Skip Dashboard if user is not authenticated
              if (
                "requiresAuth" in item &&
                item.requiresAuth &&
                !isAuthenticated
              )
                return null;

              return item.dropdown ? (
                <DropdownMenu key={item.label}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-1.5 text-gray-600 hover:text-orange-600 px-3 py-2 text-base font-medium hover:bg-orange-50 rounded-lg transition-all duration-300"
                    >
                      {item.icon && <item.icon className="h-5 w-5" />}
                      {item.label}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className={cn(
                      "w-80",
                      (item.label === "Learn Astrology" ||
                        item.label === "Languages") &&
                        "w-80",
                      (item.label === "Horoscope" ||
                        item.label === "Free Kundli" ||
                        item.label === "Kundli Matching" ||
                        item.label === "Astrology Reports" ||
                        item.label === "Panchang & Muhurat") &&
                        "w-80",
                      (item.label === "About Us" ||
                        item.label === "Dashboard" ||
                        item.label === "Support") &&
                        "w-64",
                    )}
                  >
                    {item.dropdown.map((dropdownItem) => (
                      <DropdownMenuItem key={dropdownItem.href} asChild>
                        <Link
                          href={dropdownItem.href}
                          className="flex items-center w-full cursor-pointer"
                        >
                          {dropdownItem.icon ? (
                            <div className="flex items-start gap-3 p-2">
                              <div
                                className={cn(
                                  "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                                  item.label === "Learn Astrology" &&
                                    "bg-purple-100",
                                  item.label === "About Us" && "bg-blue-100",
                                  item.label === "Dashboard" && "bg-green-100",
                                  item.label === "Languages" && "bg-orange-100",
                                  item.label === "Support" && "bg-red-100",
                                  item.label === "Horoscope" && "bg-yellow-100",
                                  item.label === "Free Kundli" &&
                                    "bg-indigo-100",
                                  item.label === "Kundli Matching" &&
                                    "bg-pink-100",
                                  item.label === "Astrology Reports" &&
                                    "bg-teal-100",
                                  item.label === "Panchang & Muhurat" &&
                                    "bg-cyan-100",
                                )}
                              >
                                {React.createElement(dropdownItem.icon, {
                                  className: cn(
                                    "h-4 w-4",
                                    item.label === "Learn Astrology" &&
                                      "text-purple-600",
                                    item.label === "About Us" &&
                                      "text-blue-600",
                                    item.label === "Dashboard" &&
                                      "text-green-600",
                                    item.label === "Languages" &&
                                      "text-orange-600",
                                    item.label === "Support" && "text-red-600",
                                    item.label === "Horoscope" &&
                                      "text-yellow-600",
                                    item.label === "Free Kundli" &&
                                      "text-indigo-600",
                                    item.label === "Kundli Matching" &&
                                      "text-pink-600",
                                    item.label === "Astrology Reports" &&
                                      "text-teal-600",
                                    item.label === "Panchang & Muhurat" &&
                                      "text-cyan-600",
                                  ),
                                })}
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-gray-900">
                                  {dropdownItem.label}
                                </div>
                                <div className="text-sm text-gray-600 mt-1">
                                  {dropdownItem.description}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 p-2">
                              {dropdownItem.icon &&
                                React.createElement(dropdownItem.icon, {
                                  className: "h-4 w-4 text-gray-600",
                                })}
                              <span>{dropdownItem.label}</span>
                            </div>
                          )}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "flex items-center gap-1.5 text-gray-600 hover:text-orange-600 px-3 py-2 text-base font-medium hover:bg-orange-50 rounded-lg transition-all duration-300",
                      isActiveRoute(item.href) &&
                        "text-orange-600 font-semibold bg-orange-50",
                    )}
                  >
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Empty space for visual balance */}
          <div className="hidden lg:flex items-center justify-end flex-shrink-0">
            {/* Chat button is now in logo section above */}
          </div>
        </div>

        {/* Enhanced Scrollable Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-[70px] bg-white z-40">
            {/* Sticky Header for Mobile Menu */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Menu</span>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            {/* Scrollable Menu Content */}
            <div
              className="h-full overflow-y-auto px-4 pb-6"
              style={{
                scrollBehavior: "smooth",
                WebkitOverflowScrolling: "touch",
              }}
            >
              <div className="flex flex-col space-y-4 pt-4">
                {/* Free Premium Report Button - Mobile */}
                <Link href="/reports/premium">
                  <Button
                    className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-4 px-4 rounded-lg shadow-lg transition-all duration-300 font-semibold text-center cursor-pointer w-full flex items-center justify-center gap-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="text-xl">🎁</span>
                    <span className="text-lg">Free Premium Report</span>
                  </Button>
                </Link>

                {/* Chat with Astrologer Button - Top of Mobile Menu */}
                <Link href="/astrologers">
                  <Button
                    className="bg-purple-600 text-white hover:bg-purple-700 w-full py-3 rounded-lg flex items-center justify-center gap-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse shadow-sm"></div>
                    <MessageCircle className="h-5 w-5" />
                    Chat with Astrologer
                  </Button>
                </Link>

                {mainNavItems.map((item) => {
                  // Skip Dashboard if user is not authenticated
                  if (
                    "requiresAuth" in item &&
                    item.requiresAuth &&
                    !isAuthenticated
                  )
                    return null;

                  return item.dropdown ? (
                    <div key={item.label} className="space-y-2">
                      <span className="font-medium text-gray-700 flex items-center gap-2">
                        {item.icon && <item.icon className="h-4 w-4" />}
                        {item.label}
                      </span>
                      <div className="pl-4 space-y-2">
                        {item.dropdown.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.href}
                            href={dropdownItem.href}
                          >
                            <div
                              className="block text-sm text-gray-500 hover:text-orange-600 transition duration-300 cursor-pointer"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              {dropdownItem.icon ? (
                                <div className="flex items-start gap-3 p-2">
                                  <div
                                    className={cn(
                                      "w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0",
                                      item.label === "Learn Astrology" &&
                                        "bg-purple-100",
                                      item.label === "About Us" &&
                                        "bg-blue-100",
                                      item.label === "Dashboard" &&
                                        "bg-green-100",
                                      item.label === "Languages" &&
                                        "bg-orange-100",
                                      item.label === "Support" && "bg-red-100",
                                      item.label === "Horoscope" &&
                                        "bg-yellow-100",
                                      item.label === "Free Kundli" &&
                                        "bg-indigo-100",
                                      item.label === "Kundli Matching" &&
                                        "bg-pink-100",
                                      item.label === "Astrology Reports" &&
                                        "bg-teal-100",
                                      item.label === "Panchang & Muhurat" &&
                                        "bg-cyan-100",
                                    )}
                                  >
                                    {React.createElement(dropdownItem.icon, {
                                      className: cn(
                                        "h-3 w-3",
                                        item.label === "Learn Astrology" &&
                                          "text-purple-600",
                                        item.label === "About Us" &&
                                          "text-blue-600",
                                        item.label === "Dashboard" &&
                                          "text-green-600",
                                        item.label === "Languages" &&
                                          "text-orange-600",
                                        item.label === "Support" &&
                                          "text-red-600",
                                        item.label === "Horoscope" &&
                                          "text-yellow-600",
                                        item.label === "Free Kundli" &&
                                          "text-indigo-600",
                                        item.label === "Kundli Matching" &&
                                          "text-pink-600",
                                        item.label === "Astrology Reports" &&
                                          "text-teal-600",
                                        item.label === "Panchang & Muhurat" &&
                                          "text-cyan-600",
                                      ),
                                    })}
                                  </div>
                                  <div className="flex-1">
                                    <div className="font-medium text-gray-900 text-sm">
                                      {dropdownItem.label}
                                    </div>
                                    <div className="text-xs text-gray-600 mt-1">
                                      {dropdownItem.description}
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 p-2">
                                  {dropdownItem.icon &&
                                    React.createElement(dropdownItem.icon, {
                                      className: "h-4 w-4 text-gray-600",
                                    })}
                                  <span>{dropdownItem.label}</span>
                                </div>
                              )}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link key={item.href} href={item.href}>
                      <span
                        className={cn(
                          "block hover:text-orange-600 transition duration-300 cursor-pointer text-gray-600",
                          isActiveRoute(item.href) &&
                            "text-orange-600 font-medium",
                        )}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
      <section className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 py-3 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center flex-col gap-4 md:flex-row md:gap-4">
            {/* <Button
              onClick={() => {
                console.log("Free Premium Report button clicked");
                trackClick("free-premium-report-header");
                setLocation("/reports/premium");
              }}
              className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 text-lg font-bold rounded-full shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer relative "
              style={{ pointerEvents: "all" }}
            >
              <Crown className="h-5 w-5 mr-2" />
              🎉 Free Premium Report 🎉
            </Button> */}
            <Button
              onClick={() => {
                setLocation("/ask-a-free-question");
              }}
              className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-4 md:text-lg font-bold rounded-full shadow-lg transition-all duration-300 hover:scale-110 cursor-pointer relative flex items-center justify-center space-x-2"
              style={{ pointerEvents: "all" }}
            >
              <Crown className="h-5 w-5 sm:h-6 sm:w-6" />
              <span
                className="text-center font-bold leading-snug 
                  text-xl 
                 max-w-[200px] sm:max-w-[300px] animate-fade"
              >
                {texts[index]}
              </span>
            </Button>
          </div>
        </div>
      </section>
    </header>
  );
}
