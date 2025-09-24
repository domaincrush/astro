import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { useAuth } from "./hooks/useAuth";
import { useEffect, lazy, Suspense, useState } from "react";
import { usePageTitle } from "./hooks/usePageTitle";
import { queryClient } from "./lib/queryClient";
import AuthHandler from "./components/AuthHandler";
import ErrorBoundary from "./components/ErrorBoundary";
import SuspenseWrapper from "./components/SuspenseWrapper";

// Essential components
import Home from "./pages/enhanced-home";

// Lazy load only used components
const FAQPage = lazy(() => import("./pages/faq-new"));
const Astrologers = lazy(() => import("./pages/astrologers"));
const AstrologerDetail = lazy(() => import("./pages/AstrologerDetail"));
const Consultations = lazy(() => import("./pages/consultations"));
const Checkout = lazy(() => import("./pages/checkout"));
const ChatPage = lazy(() => import("./pages/chat"));
const CleanChatPage = lazy(() => import("./pages/chat-clean"));
const MultiChat = lazy(() => import("./pages/multi-chat"));
const Dashboard = lazy(() => import("./pages/dashboard"));
const DashboardReportsEnhanced = lazy(() => import("./pages/dashboard/reports-enhanced"));
const AstrologerDashboard = lazy(() => import("./pages/astrologer-dashboard"));
const AstrologerProfile = lazy(() => import("./pages/astrologer-profile"));
const Profile = lazy(() => import("./pages/profile"));
const Packages = lazy(() => import("./pages/packages"));
const Payment = lazy(() => import("./pages/payment"));
const PaymentSuccess = lazy(() => import("./pages/payment-success"));
const PaymentFailure = lazy(() => import("./pages/payment-failure"));
const Kundli = lazy(() => import("./pages/kundli"));
const KundliMatching = lazy(() => import("./pages/kundli-matching"));
const MatchMaking = lazy(() => import("./pages/match-making"));
const Panchang = lazy(() => import("./pages/panchang"));
const ShubhMuhurat = lazy(() => import("./pages/shubh-muhurat"));
const Choghadiya = lazy(() => import("./pages/choghadiya"));
const RahuKaal = lazy(() => import("./pages/rahu-kaal"));
const HinduFestivals = lazy(() => import("./pages/hindu-festivals"));
const HoraTimings = lazy(() => import("./pages/hora-timings"));
const AbhijitMuhurat = lazy(() => import("./pages/abhijit-muhurat"));
const BrahmaMuhurat = lazy(() => import("./pages/brahma-muhurat"));
const LagnaCalculator = lazy(() => import("./pages/lagna-calculator"));
const MoonSignChecker = lazy(() => import("./pages/moon-sign-checker"));
const NakshatraFinder = lazy(() => import("./pages/nakshatra-finder"));
const DoshamDetector = lazy(() => import("./pages/dosham-detector"));
const LuckyNumbers = lazy(() => import("./pages/lucky-numbers"));
const BabyNaming = lazy(() => import("./pages/baby-naming"));
const DashaCalculator = lazy(() => import("./pages/dasha-calculator"));
const LalKitab = lazy(() => import("./pages/lal-kitab"));
const SadeSati = lazy(() => import("./pages/sade-sati"));
const SadeSatiCalculatorPage = lazy(() => import("./pages/sade-sati-calculator"));
const LoveHoroscope = lazy(() => import("./pages/love-horoscope"));
const LoveCompatibility = lazy(() => import("./pages/love-compatibility"));
const Numerology = lazy(() => import("./pages/numerology"));
const Palmistry = lazy(() => import("./pages/palmistry"));
const About = lazy(() => import("./pages/about"));
const Support = lazy(() => import("./pages/support"));
const Contact = lazy(() => import("./pages/contact"));
const MarriageAstrology = lazy(() => import("./pages/marriage-astrology"));
const Horoscopes = lazy(() => import("./pages/horoscopes"));
const DailyHoroscope = lazy(() => import("./pages/daily-horoscope"));
const WeeklyHoroscope = lazy(() => import("./pages/weekly-horoscope"));
const MonthlyHoroscope = lazy(() => import("./pages/monthly-horoscope"));
const YearlyHoroscope = lazy(() => import("./pages/yearly-horoscope"));
const CareerHoroscope = lazy(() => import("./pages/career-horoscope"));
const HealthHoroscope = lazy(() => import("./pages/health-horoscope"));
const Blog = lazy(() => import("./pages/blog"));
const BlogArticle = lazy(() => import("./pages/blog/[slug]"));
const BlogCategory = lazy(() => import("./pages/blog/category"));
const VenusTransitCancer2025 = lazy(() => import("./pages/blog/venus-transit-cancer-2025"));
const PrivacyPolicy = lazy(() => import("./pages/privacy-policy"));
const TermsOfService = lazy(() => import("./pages/terms-of-service"));
const RefundPolicy = lazy(() => import("./pages/refund-policy"));
const ShippingPolicy = lazy(() => import("./pages/shipping-policy"));
const Login = lazy(() => import("./pages/login"));
const AuthLogin = lazy(() => import("./pages/auth-login"));
const Signup = lazy(() => import("./pages/signup"));
const ResetPin = lazy(() => import("./pages/reset-pin"));
const ResetPassword = lazy(() => import("./pages/reset-password"));
const AuthSuccess = lazy(() => import("./pages/auth-success"));
const NotFound = lazy(() => import("./pages/not-found"));
const AdminDashboard = lazy(() => import("./pages/admin-dashboard"));
const AdminArticles = lazy(() => import("./pages/admin-articles"));
const AdminSettings = lazy(() => import("./pages/admin-settings"));
const AdminResponsesEnhanced = lazy(() => import("./pages/admin/admin-responses-enhanced"));
const DashboardBookings = lazy(() => import("./pages/dashboard/bookings"));
const AdminResponses = lazy(() => import("./pages/admin/admin-responses"));
const CareerReport = lazy(() => import("./pages/reports/career-report"));
const MarriageReport = lazy(() => import("./pages/reports/marriage-report"));
const ChildReport = lazy(() => import("./pages/reports/child-report"));
const SuperHoroscope = lazy(() => import("./pages/reports/super-horoscope"));
const SuperHoroscopeResults = lazy(() => import("./pages/reports/super-horoscope-results"));
const PremiumReport = lazy(() => import("./pages/premium-report"));
const LifeReport = lazy(() => import("./pages/life-report"));
const MarriageMuhurat = lazy(() => import("./pages/muhurat/marriage-muhurat"));
const GrihaPraveshMuhurat = lazy(() => import("./pages/muhurat/griha-pravesh-muhurat"));
const PropertyPurchaseMuhurat = lazy(() => import("./pages/muhurat/property-purchase-muhurat"));
const BusinessLaunchMuhurat = lazy(() => import("./pages/muhurat/business-launch-muhurat"));
const JourneyStartMuhurat = lazy(() => import("./pages/muhurat/journey-start-muhurat"));
const AstrologyBasics = lazy(() => import("./pages/learn-astrology/basics"));
const BirthChartReading = lazy(() => import("./pages/learn-astrology/birth-chart"));
const PlanetsAndHouses = lazy(() => import("./pages/learn-astrology/planets"));
const NakshatrasGuide = lazy(() => import("./pages/learn-astrology/nakshatras"));
const NakshatraDetail = lazy(() => import("./pages/nakshatras/nakshatra-detail"));
const DoshasAndRemedies = lazy(() => import("./pages/learn-astrology/doshas"));
const MuhurtaTiming = lazy(() => import("./pages/learn-astrology/muhurta"));
const AdvancedTechniques = lazy(() => import("./pages/learn-astrology/advanced"));
const DashaPeriodsGuide = lazy(() => import("./pages/articles/dasha-periods-guide"));
const DailyHoroscopeSign = lazy(() => import("./pages/daily-horoscope/[sign]"));
const WeeklyHoroscopeSign = lazy(() => import("./pages/weekly-horoscope/[sign]"));
const MonthlyHoroscopeSign = lazy(() => import("./pages/monthly-horoscope/[sign]"));
const Horoscope2025 = lazy(() => import("./pages/horoscope-2025"));
const Numerology2025 = lazy(() => import("./pages/numerology-2025"));
const Tarot2025 = lazy(() => import("./pages/tarot-2025"));
const Festivals2025 = lazy(() => import("./pages/festivals-2025"));
const PlanetTransit2025 = lazy(() => import("./pages/planet-transit-2025"));
const AstrologyFreeTools = lazy(() => import("./pages/Astrology-freeTools"));
const AstrologyTools = lazy(() => import("./pages/astrology-tools"));

// Lightweight loading component
const QuickLoader = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
  </div>
);

function RouterComponent() {
  const {  isAdmin, loading, refreshAuth } = useAuth();
  const userData = (localStorage.getItem("user"))
  const [isAuthenticated, setIsAuthenticated] = useState(false);
useEffect(() => { 
  console.log(userData)
  if(userData){
    setIsAuthenticated(true)
  }else {
    setIsAuthenticated(false)
  }
},[userData])
  usePageTitle();

  // Refresh auth state on mount to ensure up-to-date user data
  // useEffect(() => {
  //   if (loading) {
  //     refreshAuth();
  //   }
  // }, [loading, refreshAuth]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/admin-dashboard">
        {isAdmin ? (
          <SuspenseWrapper><AdminDashboard /></SuspenseWrapper>
        ) : (
          <NotFound />
        )}
      </Route>
      <Route path="/admin/articles">
        {isAdmin ? (
          <SuspenseWrapper><AdminArticles /></SuspenseWrapper>
        ) : (
          <NotFound />
        )}
      </Route>
      <Route path="/admin-articles">
        {isAdmin ? (
          <SuspenseWrapper><AdminArticles /></SuspenseWrapper>
        ) : (
          <NotFound />
        )}
      </Route>
      <Route path="/admin-responses-enhanced">
        {isAdmin ? (
          <SuspenseWrapper><AdminResponsesEnhanced /></SuspenseWrapper>
        ) : (
          <NotFound />
        )}
      </Route>
      <Route path="/admin/settings">
        {isAdmin ? (
          <SuspenseWrapper><AdminSettings /></SuspenseWrapper>
        ) : (
          <NotFound />
        )}
      </Route>
      <Route path="/admin/responses">
        {isAdmin ? (
          <SuspenseWrapper><AdminResponses /></SuspenseWrapper>
        ) : (
          <NotFound />
        )}
      </Route>
      <Route path="/astrologer-dashboard">
        {isAuthenticated ? (
          <SuspenseWrapper><AstrologerDashboard /></SuspenseWrapper>
        ) : (
          <div className="min-h-screen flex items-center justify-center">
            <p>Authentication required</p>
          </div>
        )}
      </Route>
      <Route path="/astrologer-profile">
        {isAuthenticated ? (
          <SuspenseWrapper><AstrologerProfile /></SuspenseWrapper>
        ) : (
          <div className="min-h-screen flex items-center justify-center">
            <p>Authentication required</p>
          </div>
        )}
      </Route>
      <Route path="/consultations">
        {isAuthenticated ? (
          <SuspenseWrapper><Consultations /></SuspenseWrapper>
        ) : (
          <div className="min-h-screen flex items-center justify-center">
            <p>Authentication required</p>
          </div>
        )}
      </Route>
      <Route path="/checkout">
        {isAuthenticated ? (
          <SuspenseWrapper><Checkout /></SuspenseWrapper>
        ) : (
          <div className="min-h-screen flex items-center justify-center">
            <p>Authentication required</p>
          </div>
        )}
      </Route>
      <Route path="/chat/:id">
        {isAuthenticated ? (
          <SuspenseWrapper><ChatPage /></SuspenseWrapper>
        ) : (
          <div className="min-h-screen flex items-center justify-center">
            <p>Authentication required</p>
          </div>
        )}
      </Route>
      <Route path="/clean-chat/:id">
        {isAuthenticated ? (
          <SuspenseWrapper><CleanChatPage /></SuspenseWrapper>
        ) : (
          <div className="min-h-screen flex items-center justify-center">
            <p>Authentication required</p>
          </div>
        )}
      </Route>
      <Route path="/multi-chat">
        {isAuthenticated ? (
          <SuspenseWrapper><MultiChat /></SuspenseWrapper>
        ) : (
          <div className="min-h-screen flex items-center justify-center">
            <p>Authentication required</p>
          </div>
        )}
      </Route>
      <Route path="/dashboard">
        {isAuthenticated ? (
          <SuspenseWrapper><Dashboard /></SuspenseWrapper>
        ) : (
          <div className="min-h-screen flex items-center justify-center">
            <p>Authentication required</p>
          </div>
        )}
      </Route>
      <Route path="/dashboard/reports">
        {isAuthenticated ? (
          <SuspenseWrapper><DashboardReportsEnhanced /></SuspenseWrapper>
        ) : (
          <div className="min-h-screen flex items-center justify-center">
            <p>Authentication required</p>
          </div>
        )}
      </Route>
      <Route path="/dashboard/bookings">
        {isAuthenticated ? (
          <SuspenseWrapper><DashboardBookings /></SuspenseWrapper>
        ) : (
          <div className="min-h-screen flex items-center justify-center">
            <p>Authentication required</p>
          </div>
        )}
      </Route>
      <Route path="/profile">
        {isAuthenticated ? (
          <SuspenseWrapper><Profile /></SuspenseWrapper>
        ) : (
          <div className="min-h-screen flex items-center justify-center">
            <p>Authentication required</p>
          </div>
        )}
      </Route>
      <Route path="/packages">
        {isAuthenticated ? (
          <SuspenseWrapper><Packages /></SuspenseWrapper>
        ) : (
          <div className="min-h-screen flex items-center justify-center">
            <p>Authentication required</p>
          </div>
        )}
      </Route>
      <Route path="/payment">
        {isAuthenticated ? (
          <SuspenseWrapper><Payment /></SuspenseWrapper>
        ) : (
          <div className="min-h-screen flex items-center justify-center">
            <p>Authentication required</p>
          </div>
        )}
      </Route>
      <Route path="/payment-success">
        {isAuthenticated ? (
          <SuspenseWrapper><PaymentSuccess /></SuspenseWrapper>
        ) : (
          <div className="min-h-screen flex items-center justify-center">
            <p>Authentication required</p>
          </div>
        )}
      </Route>
      <Route path="/payment-failure">
        {isAuthenticated ? (
          <SuspenseWrapper><PaymentFailure /></SuspenseWrapper>
        ) : (
          <div className="min-h-screen flex items-center justify-center">
            <p>Authentication required</p>
          </div>
        )}
      </Route>
      <Route path="/ask-a-free-question" component={() => (
        <SuspenseWrapper><FAQPage /></SuspenseWrapper>
      )} />
      <Route path="/astrologers" component={() => (
        <SuspenseWrapper><Astrologers /></SuspenseWrapper>
      )} />
      <Route path="/astrologer/:id" component={() => (
        <SuspenseWrapper><AstrologerDetail /></SuspenseWrapper>
      )} />
      <Route path="/kundli" component={() => (
        <SuspenseWrapper><Kundli /></SuspenseWrapper>
      )} />
      <Route path="/kundli-matching" component={() => (
        <SuspenseWrapper><KundliMatching /></SuspenseWrapper>
      )} />
      <Route path="/match-making" component={() => (
        <SuspenseWrapper><MatchMaking /></SuspenseWrapper>
      )} />
      <Route path="/panchang" component={() => (
        <SuspenseWrapper><Panchang /></SuspenseWrapper>
      )} />
      <Route path="/lagna-calculator" component={() => (
        <SuspenseWrapper><LagnaCalculator /></SuspenseWrapper>
      )} />
      <Route path="/moon-sign-checker" component={() => (
        <SuspenseWrapper><MoonSignChecker /></SuspenseWrapper>
      )} />
      <Route path="/nakshatra-finder" component={() => (
        <SuspenseWrapper><NakshatraFinder /></SuspenseWrapper>
      )} />
      <Route path="/dasha-calculator" component={() => (
        <SuspenseWrapper><DashaCalculator /></SuspenseWrapper>
      )} />
      <Route path="/dosham-detector" component={() => (
        <SuspenseWrapper><DoshamDetector /></SuspenseWrapper>
      )} />
      <Route path="/sade-sati-calculator" component={() => (
        <SuspenseWrapper><SadeSatiCalculatorPage /></SuspenseWrapper>
      )} />
      <Route path="/love-horoscope" component={() => (
        <SuspenseWrapper><LoveHoroscope /></SuspenseWrapper>
      )} />
      <Route path="/planet-transits" component={() => (
        <SuspenseWrapper><AstrologyTools /></SuspenseWrapper>
      )} />
      <Route path="/zodiac-signs" component={() => (
        <SuspenseWrapper><AstrologyTools /></SuspenseWrapper>
      )} />
      <Route path="/astro-tools" component={() => (
        <SuspenseWrapper><AstrologyFreeTools /></SuspenseWrapper>
      )} />
      <Route path="/about" component={() => (
        <SuspenseWrapper><About /></SuspenseWrapper>
      )} />
      <Route path="/support" component={() => (
        <SuspenseWrapper><Support /></SuspenseWrapper>
      )} />
      <Route path="/festivals" component={() => (
        <SuspenseWrapper><AstrologyTools /></SuspenseWrapper>
      )} />
      <Route path="/horoscope" component={() => (
        <SuspenseWrapper><Horoscopes /></SuspenseWrapper>
      )} />
      <Route path="/horoscopes" component={() => (
        <SuspenseWrapper><Horoscopes /></SuspenseWrapper>
      )} />
      <Route path="/daily-horoscope" component={() => (
        <SuspenseWrapper><DailyHoroscope /></SuspenseWrapper>
      )} />
      <Route path="/daily-horoscope/:sign" component={() => (
        <SuspenseWrapper><DailyHoroscopeSign /></SuspenseWrapper>
      )} />
      <Route path="/weekly-horoscope" component={() => (
        <SuspenseWrapper><WeeklyHoroscope /></SuspenseWrapper>
      )} />
      <Route path="/weekly-horoscope/:sign" component={() => (
        <SuspenseWrapper><WeeklyHoroscopeSign /></SuspenseWrapper>
      )} />
      <Route path="/monthly-horoscope" component={() => (
        <SuspenseWrapper><MonthlyHoroscope /></SuspenseWrapper>
      )} />
      <Route path="/monthly-horoscope/:sign" component={() => (
        <SuspenseWrapper><MonthlyHoroscopeSign /></SuspenseWrapper>
      )} />
      <Route path="/yearly-horoscope" component={() => (
        <SuspenseWrapper><YearlyHoroscope /></SuspenseWrapper>
      )} />
      <Route path="/career-horoscope" component={() => (
        <SuspenseWrapper><CareerHoroscope /></SuspenseWrapper>
      )} />
      <Route path="/health-horoscope" component={() => (
        <SuspenseWrapper><HealthHoroscope /></SuspenseWrapper>
      )} />
      <Route path="/shubh-muhurat/marriage" component={() => (
        <SuspenseWrapper><MarriageMuhurat /></SuspenseWrapper>
      )} />
      <Route path="/shubh-muhurat/griha-pravesh" component={() => (
        <SuspenseWrapper><GrihaPraveshMuhurat /></SuspenseWrapper>
      )} />
      <Route path="/shubh-muhurat/property-purchase" component={() => (
        <SuspenseWrapper><PropertyPurchaseMuhurat /></SuspenseWrapper>
      )} />
      <Route path="/shubh-muhurat/business-launch" component={() => (
        <SuspenseWrapper><BusinessLaunchMuhurat /></SuspenseWrapper>
      )} />
      <Route path="/shubh-muhurat/journey-start" component={() => (
        <SuspenseWrapper><JourneyStartMuhurat /></SuspenseWrapper>
      )} />
      <Route path="/shubh-muhurat" component={() => (
        <SuspenseWrapper><ShubhMuhurat /></SuspenseWrapper>
      )} />
      <Route path="/choghadiya" component={() => (
        <SuspenseWrapper><Choghadiya /></SuspenseWrapper>
      )} />
      <Route path="/rahu-kaal" component={() => (
        <SuspenseWrapper><RahuKaal /></SuspenseWrapper>
      )} />
      <Route path="/hindu-festivals" component={() => (
        <SuspenseWrapper><HinduFestivals /></SuspenseWrapper>
      )} />
      <Route path="/hora-timings" component={() => (
        <SuspenseWrapper><HoraTimings /></SuspenseWrapper>
      )} />
      <Route path="/abhijit-muhurat" component={() => (
        <SuspenseWrapper><AbhijitMuhurat /></SuspenseWrapper>
      )} />
      <Route path="/brahma-muhurat" component={() => (
        <SuspenseWrapper><BrahmaMuhurat /></SuspenseWrapper>
      )} />
      <Route path="/learn-astrology/basics" component={() => (
        <SuspenseWrapper><AstrologyBasics /></SuspenseWrapper>
      )} />
      <Route path="/learn-astrology/birth-chart" component={() => (
        <SuspenseWrapper><BirthChartReading /></SuspenseWrapper>
      )} />
      <Route path="/learn-astrology/planets" component={() => (
        <SuspenseWrapper><PlanetsAndHouses /></SuspenseWrapper>
      )} />
      <Route path="/learn-astrology/nakshatras" component={() => (
        <SuspenseWrapper><NakshatrasGuide /></SuspenseWrapper>
      )} />
      <Route path="/nakshatras/:slug" component={() => (
        <SuspenseWrapper><NakshatraDetail /></SuspenseWrapper>
      )} />
      <Route path="/learn-astrology/doshas" component={() => (
        <SuspenseWrapper><DoshasAndRemedies /></SuspenseWrapper>
      )} />
      <Route path="/learn-astrology/muhurta" component={() => (
        <SuspenseWrapper><MuhurtaTiming /></SuspenseWrapper>
      )} />
      <Route path="/learn-astrology/advanced" component={() => (
        <SuspenseWrapper><AdvancedTechniques /></SuspenseWrapper>
      )} />
      <Route path="/marriage-astrology" component={() => (
        <SuspenseWrapper><MarriageAstrology /></SuspenseWrapper>
      )} />
      <Route path="/reports/career" component={() => (
        <SuspenseWrapper><CareerReport /></SuspenseWrapper>
      )} />
      <Route path="/reports/marriage" component={() => (
        <SuspenseWrapper><MarriageReport /></SuspenseWrapper>
      )} />
      <Route path="/reports/super-horoscope" component={() => (
        <SuspenseWrapper><SuperHoroscope /></SuspenseWrapper>
      )} />
      <Route path="/reports/premium" component={() => (
        <SuspenseWrapper><PremiumReport /></SuspenseWrapper>
      )} />
      <Route path="/reports/life" component={() => (
        <SuspenseWrapper><LifeReport /></SuspenseWrapper>
      )} />
      <Route path="/reports/super-horoscope/results/:reportId" component={() => (
        <SuspenseWrapper><SuperHoroscopeResults /></SuspenseWrapper>
      )} />
      <Route path="/premium-report" component={() => (
        <SuspenseWrapper><PremiumReport /></SuspenseWrapper>
      )} />
      <Route path="/premium-reports" component={() => (
        <SuspenseWrapper><PremiumReport /></SuspenseWrapper>
      )} />
      <Route path="/career-report" component={() => (
        <SuspenseWrapper><CareerReport /></SuspenseWrapper>
      )} />
      <Route path="/marriage-report" component={() => (
        <SuspenseWrapper><MarriageReport /></SuspenseWrapper>
      )} />
      <Route path="/child-report" component={() => (
        <SuspenseWrapper><ChildReport /></SuspenseWrapper>
      )} />
      <Route path="/planet-transit-2025" component={() => (
        <SuspenseWrapper><PlanetTransit2025 /></SuspenseWrapper>
      )} />
      <Route path="/year-2025/horoscope" component={() => (
        <SuspenseWrapper><Horoscope2025 /></SuspenseWrapper>
      )} />
      <Route path="/year-2025/numerology" component={() => (
        <SuspenseWrapper><Numerology2025 /></SuspenseWrapper>
      )} />
      <Route path="/year-2025/tarot" component={() => (
        <SuspenseWrapper><Tarot2025 /></SuspenseWrapper>
      )} />
      <Route path="/year-2025/festivals" component={() => (
        <SuspenseWrapper><Festivals2025 /></SuspenseWrapper>
      )} />
      <Route path="/year-2025/planet-transits" component={() => (
        <SuspenseWrapper><PlanetTransit2025 /></SuspenseWrapper>
      )} />
      <Route path="/lucky-numbers" component={() => (
        <SuspenseWrapper><LuckyNumbers /></SuspenseWrapper>
      )} />
      <Route path="/baby-naming" component={() => (
        <SuspenseWrapper><BabyNaming /></SuspenseWrapper>
      )} />
      <Route path="/lal-kitab" component={() => (
        <SuspenseWrapper><LalKitab /></SuspenseWrapper>
      )} />
      <Route path="/sade-sati" component={() => (
        <SuspenseWrapper><SadeSati /></SuspenseWrapper>
      )} />
      <Route path="/love-compatibility" component={() => (
        <SuspenseWrapper><LoveCompatibility /></SuspenseWrapper>
      )} />
      <Route path="/numerology" component={() => (
        <SuspenseWrapper><Numerology /></SuspenseWrapper>
      )} />
      <Route path="/palmistry" component={() => (
        <SuspenseWrapper><Palmistry /></SuspenseWrapper>
      )} />
      <Route path="/articles/dasha-periods-guide" component={() => (
        <SuspenseWrapper><DashaPeriodsGuide /></SuspenseWrapper>
      )} />
      <Route path="/blog" component={() => (
        <SuspenseWrapper><Blog /></SuspenseWrapper>
      )} />
      <Route path="/blog/category/:category" component={() => (
        <SuspenseWrapper><BlogCategory /></SuspenseWrapper>
      )} />
      <Route path="/blog/:slug" component={() => (
        <SuspenseWrapper><BlogArticle /></SuspenseWrapper>
      )} />
      <Route path="/blog/venus-transit-cancer-2025" component={() => (
        <SuspenseWrapper><VenusTransitCancer2025 /></SuspenseWrapper>
      )} />
      <Route path="/login" component={() => (
        <SuspenseWrapper><Login /></SuspenseWrapper>
      )} />
      <Route path="/auth-login" component={() => (
        <SuspenseWrapper><AuthLogin /></SuspenseWrapper>
      )} />
      <Route path="/signup" component={() => (
        <SuspenseWrapper><Signup /></SuspenseWrapper>
      )} />
      <Route path="/reset-pin" component={() => (
        <SuspenseWrapper><ResetPin /></SuspenseWrapper>
      )} />
      <Route path="/reset-password" component={() => (
        <SuspenseWrapper><ResetPassword /></SuspenseWrapper>
      )} />
      <Route path="/auth/success" component={() => (
        <SuspenseWrapper><AuthSuccess /></SuspenseWrapper>
      )} />
      <Route path="/privacy-policy" component={() => (
        <SuspenseWrapper><PrivacyPolicy /></SuspenseWrapper>
      )} />
      <Route path="/terms-of-service" component={() => (
        <SuspenseWrapper><TermsOfService /></SuspenseWrapper>
      )} />
      <Route path="/refund-policy" component={() => (
        <SuspenseWrapper><RefundPolicy /></SuspenseWrapper>
      )} />
      <Route path="/shipping-policy" component={() => (
        <SuspenseWrapper><ShippingPolicy /></SuspenseWrapper>
      )} />
      <Route path="/contact" component={() => (
        <SuspenseWrapper><Contact /></SuspenseWrapper>
      )} />
      <Route path="/disclaimer" component={() => (
        <SuspenseWrapper><TermsOfService /></SuspenseWrapper>
      )} />
      <Route path="/cookie-policy" component={() => (
        <SuspenseWrapper><PrivacyPolicy /></SuspenseWrapper>
      )} />
      <Route path="/delivery-policy" component={() => (
        <SuspenseWrapper><ShippingPolicy /></SuspenseWrapper>
      )} />
      <Route component={() => (
        <SuspenseWrapper><NotFound /></SuspenseWrapper>
      )} />
    </Switch>
  );
}

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <AuthHandler />
            <Toaster />
            <ErrorBoundary>
              <SuspenseWrapper>
                <RouterComponent />
              </SuspenseWrapper>
            </ErrorBoundary>
          </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
