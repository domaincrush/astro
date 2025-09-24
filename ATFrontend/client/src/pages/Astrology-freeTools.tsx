import { useLocation, Link } from "wouter";

import {
  Star,
  Users,
  Moon,
  Calendar,
  Heart,
  Clock,
  TrendingUp,
  Shield,
  Crown,
  Sparkles,
  ChevronRight,
  Award,
  MessageCircle,
  BookOpen,
  Gift,
  Target,
  Zap,
  Globe,
  CheckCircle,
  ArrowRight,
  Play,
  BarChart3,
  Compass,
  Sun,
  MapPin,
  Timer,
  PhoneCall,
  Video,
  Lightbulb,
  Gem,
  TrendingDown,
  AlertCircle,
  Info,
  Hand,
  Hash,
  Home,
  Calculator,
  Building,
  DollarSign,
  Plane,
  FileSpreadsheet,
} from "lucide-react";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";

function AstrologyFreeTools() {
  const [, setLocation] = useLocation();
  return (
    <div className="max-w-7xl group">
      <AstroTickHeader />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-orange-200 to-amber-200 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-full animate-bounce"></div>
          <div className="absolute bottom-20 left-40 w-20 h-20 bg-gradient-to-r from-amber-200 to-yellow-200 rounded-full animate-pulse"></div>
          <div className="absolute bottom-40 right-40 w-28 h-28 bg-gradient-to-r from-orange-200 to-red-200 rounded-full animate-bounce"></div>
        </div>
        <div className="flex rounded-t-lg mb-10 text-white max-w-full bg-gradient-to-r from-amber-500 to-orange-500 justify-center items-center flex-col ">
          <h3 className=" text-3xl font-bold pt-5 mb-2  md:text-6xl p-4 text-center  max-w-4xl">
            Free Astrology Tools
          </h3>
          <p className="md:text-xl p-4 text-center pb-5  font-semibold">
            Comprehensive collection of Vedic astrology tools and services for
            all your spiritual needs
          </p>
        </div>
        <div className="group flex justify-center items-center">
          <div className="grid grid-cols-2 md:grid-cols-7 gap-6">
            {/* Free Services Quicklinks */}
            <div className="group">
              <div className="text-center">
                <div
                  className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 cursor-pointer"
                  onClick={() => setLocation("/kundli")}
                >
                  <Star className="h-8 w-8 text-white" />
                </div>
                <h3
                  className="text-sm font-semibold text-orange-900 cursor-pointer"
                  onClick={() => setLocation("/kundli")}
                >
                  Free Kundli
                </h3>
              </div>
            </div>

            <div className="group">
              <div className="text-center">
                <div
                  className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 cursor-pointer"
                  onClick={() => setLocation("/kundli-matching")}
                >
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h3
                  className="text-sm font-semibold text-orange-900 cursor-pointer"
                  onClick={() => setLocation("/kundli-matching")}
                >
                  Kundli Matching
                </h3>
              </div>
            </div>

            <div className="group">
              <div className="text-center">
                <div
                  className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 cursor-pointer"
                  onClick={() => setLocation("/panchang")}
                >
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <h3
                  className="text-sm font-semibold text-orange-900 cursor-pointer"
                  onClick={() => setLocation("/panchang")}
                >
                  Daily Panchang
                </h3>
              </div>
            </div>

            <div className="group">
              <div className="text-center">
                <div
                  className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 cursor-pointer"
                  onClick={() => setLocation("/daily-horoscope")}
                >
                  <Sun className="h-8 w-8 text-white" />
                </div>
                <h3
                  className="text-sm font-semibold text-orange-900 cursor-pointer"
                  onClick={() => setLocation("/daily-horoscope")}
                >
                  Daily Horoscope
                </h3>
              </div>
            </div>

            <div className="group">
              <div className="text-center">
                <div
                  className="w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 cursor-pointer"
                  onClick={() => setLocation("/moon-sign-checker")}
                >
                  <Moon className="h-8 w-8 text-white" />
                </div>
                <h3
                  className="text-sm font-semibold text-orange-900 cursor-pointer"
                  onClick={() => setLocation("/moon-sign-checker")}
                >
                  Moon Sign
                </h3>
              </div>
            </div>

            <div className="group">
              <div className="text-center">
                <div
                  className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 cursor-pointer"
                  onClick={() => setLocation("/nakshatra-finder")}
                >
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h3
                  className="text-sm font-semibold text-orange-900 cursor-pointer"
                  onClick={() => setLocation("/nakshatra-finder")}
                >
                  Nakshatra Finder
                </h3>
              </div>
            </div>

            <div className="group">
              <div className="text-center">
                <div
                  className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 cursor-pointer"
                  onClick={() => setLocation("/dasha-calculator")}
                >
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <h3
                  className="text-sm font-semibold text-orange-900 cursor-pointer"
                  onClick={() => setLocation("/dasha-calculator")}
                >
                  Dasha Calculator
                </h3>
              </div>
            </div>

            <div className="group">
              <div className="text-center">
                <div
                  className="w-16 h-16 bg-gradient-to-r from-rose-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 cursor-pointer"
                  onClick={() => setLocation("/numerology")}
                >
                  <Hash className="h-8 w-8 text-white" />
                </div>
                <h3
                  className="text-sm font-semibold text-orange-900 cursor-pointer"
                  onClick={() => setLocation("/numerology")}
                >
                  Numerology
                </h3>
              </div>
            </div>

            <div className="group">
              <div className="text-center">
                <div
                  className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 cursor-pointer"
                  onClick={() => setLocation("/lagna-calculator")}
                >
                  <Star className="h-8 w-8 text-white" />
                </div>
                <h3
                  className="text-sm font-semibold text-orange-900 cursor-pointer"
                  onClick={() => setLocation("/lagna-calculator")}
                >
                  Lagna Calculator
                </h3>
              </div>
            </div>

            <div className="group">
              <div className="text-center">
                <div
                  className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 cursor-pointer"
                  onClick={() => setLocation("/dosham-detector")}
                >
                  <AlertCircle className="h-8 w-8 text-white" />
                </div>
                <h3
                  className="text-sm font-semibold text-orange-900 cursor-pointer"
                  onClick={() => setLocation("/dosham-detector")}
                >
                  Dosham Detector
                </h3>
              </div>
            </div>

            <div className="group">
              <div className="text-center">
                <div
                  className="w-16 h-16 bg-gradient-to-r from-gray-500 to-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 cursor-pointer"
                  onClick={() => setLocation("/sade-sati")}
                >
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <h3
                  className="text-sm font-semibold text-orange-900 cursor-pointer"
                  onClick={() => setLocation("/sade-sati")}
                >
                  Sade Sati Calculator
                </h3>
              </div>
            </div>

            <div className="group">
              <div className="text-center">
                <div
                  className="w-16 h-16 bg-gradient-to-r from-red-700 to-red-800 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 cursor-pointer"
                  onClick={() => setLocation("/lal-kitab")}
                >
                  <Lightbulb className="h-8 w-8 text-white" />
                </div>
                <h3
                  className="text-sm font-semibold text-orange-900 cursor-pointer"
                  onClick={() => setLocation("/lal-kitab")}
                >
                  Lal Kitab Status
                </h3>
              </div>
            </div>

            <div className="group">
              <div className="text-center">
                <div
                  className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 cursor-pointer"
                  onClick={() => setLocation("/baby-naming")}
                >
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3
                  className="text-sm font-semibold text-orange-900 cursor-pointer"
                  onClick={() => setLocation("/baby-naming")}
                >
                  Baby Name Generator
                </h3>
              </div>
            </div>

            <div className="group">
              <div className="text-center">
                <div
                  className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 cursor-pointer"
                  onClick={() => setLocation("/lucky-numbers")}
                >
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3
                  className="text-sm font-semibold text-orange-900 cursor-pointer"
                  onClick={() => setLocation("/lucky-numbers")}
                >
                  Lucky Numbers
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
export default AstrologyFreeTools;
