import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X, Star, User, LogOut, ChevronDown, MessageCircle, Settings } from 'lucide-react';
import { Button } from 'src/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from 'src/components/ui/dropdown-menu';
import { useAuth } from 'src/hooks/useAuth';
import { cn } from 'src/lib/utils';

interface DomainConfig {
  domain: string;
  siteName: string;
  language: string;
  branding: {
    primaryColor: string;
    secondaryColor: string;
    logo: string;
    title: string;
    description: string;
  };
  navigation: {
    [key: string]: string;
  };
}

interface HeaderConfig {
  title: string;
  description: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
}

const DOMAIN_CONFIGS: { [key: string]: DomainConfig } = {
  'astrotelugu.com': {
    domain: 'astrotelugu.com',
    siteName: 'Astro Telugu',
    language: 'telugu',
    branding: {
      primaryColor: '#FF6B35',
      secondaryColor: '#004225',
      logo: '/assets/astrotelugu-logo.png',
      title: 'Astro Telugu - తెలుగు జ్యోతిష్యం',
      description: 'వైదిక జ్యోతిష్య సేవలు తెలుగులో'
    },
    navigation: {
      'Home': 'హోమ్',
      'Horoscope': 'రాశిఫలం',
      'Kundli': 'జాతకం',
      'Match Making': 'జాతక మిలన',
      'Panchang': 'పంచాంగం',
      'Astrologers': 'జ్యోతిష్కులు',
      'Tools': 'సాధనలు',
      'Blog': 'వార్తలు'
    }
  },
  'indiahoroscope.com': {
    domain: 'indiahoroscope.com',
    siteName: 'India Horoscope',
    language: 'english',
    branding: {
      primaryColor: '#FF6B00',
      secondaryColor: '#138808',
      logo: '/assets/indiahoroscope-logo.png',
      title: 'India Horoscope - Daily Predictions',
      description: 'Authentic Indian horoscope predictions'
    },
    navigation: {
      'Home': 'Home',
      'Horoscope': 'Horoscope',
      'Kundli': 'Birth Chart',
      'Match Making': 'Compatibility',
      'Panchang': 'Panchang',
      'Astrologers': 'Astrologers',
      'Tools': 'Tools',
      'Blog': 'Blog'
    }
  },
  'jaataka.com': {
    domain: 'jaataka.com',
    siteName: 'Jaataka',
    language: 'english',
    branding: {
      primaryColor: '#8B4513',
      secondaryColor: '#FFD700',
      logo: '/assets/jaataka-logo.png',
      title: 'Jaataka - Birth Chart Analysis',
      description: 'Comprehensive Jataka analysis'
    },
    navigation: {
      'Home': 'Home',
      'Horoscope': 'Horoscope',
      'Kundli': 'Jaataka',
      'Match Making': 'Compatibility',
      'Panchang': 'Panchang',
      'Astrologers': 'Consultants',
      'Tools': 'Tools',
      'Blog': 'Articles'
    }
  },
  'astroneram.com': {
    domain: 'astroneram.com',
    siteName: 'Astro Neram',
    language: 'tamil',
    branding: {
      primaryColor: '#DC143C',
      secondaryColor: '#FFD700',
      logo: '/assets/astroneram-logo.png',
      title: 'Astro Neram - ஜோதிட நேரம்',
      description: 'தமிழ் ஜோதிட சேவைகள்'
    },
    navigation: {
      'Home': 'முகப்பு',
      'Horoscope': 'ராசிபலன்',
      'Kundli': 'ஜாதகம்',
      'Match Making': 'திருமண பொருத்தம்',
      'Panchang': 'பஞ்சாங்கம்',
      'Astrologers': 'ஜோதிடர்கள்',
      'Tools': 'கருவிகள்',
      'Blog': 'கட்டுரைகள்'
    }
  },
  'astrojothidam.com': {
    domain: 'astrojothidam.com',
    siteName: 'Astro Jothidam',
    language: 'tamil',
    branding: {
      primaryColor: '#FF4500',
      secondaryColor: '#32CD32',
      logo: '/assets/astrojothidam-logo.png',
      title: 'Astro Jothidam - தமிழ் ஜோதிடம்',
      description: 'பாரம்பரிய தமிழ் ஜோதிட சேவைகள்'
    },
    navigation: {
      'Home': 'முகப்பு',
      'Horoscope': 'ராசிபலன்',
      'Kundli': 'ஜாதகம்',
      'Match Making': 'திருமண பொருத்தம்',
      'Panchang': 'பஞ்சாங்கம்',
      'Astrologers': 'ஜோதிடர்கள்',
      'Tools': 'கருவிகள்',
      'Blog': 'கட்டுரைகள்'
    }
  },
  'astroscroll.com': {
    domain: 'astroscroll.com',
    siteName: 'AstroScroll',
    language: 'english',
    branding: {
      primaryColor: '#6B46C1',
      secondaryColor: '#EC4899',
      logo: '/assets/astroscroll-logo.png',
      title: 'AstroScroll - Modern Astrology',
      description: 'Interactive astrology platform'
    },
    navigation: {
      'Home': 'Home',
      'Horoscope': 'Horoscope',
      'Kundli': 'Birth Chart',
      'Match Making': 'Compatibility',
      'Panchang': 'Panchang',
      'Astrologers': 'Astrologers',
      'Tools': 'Tools',
      'Blog': 'Blog'
    }
  }
};

export default function UniversalHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();
  const [domainConfig, setDomainConfig] = useState<DomainConfig | null>(null);
  const [headerConfig, setHeaderConfig] = useState<HeaderConfig | null>(null);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  useEffect(() => {
    const currentDomain = window.location.hostname;
    const config = DOMAIN_CONFIGS[currentDomain] || DOMAIN_CONFIGS['astrotick.com'] || {
      domain: 'astrotick.com',
      siteName: 'AstroTick',
      language: 'english',
      branding: {
        primaryColor: '#FF6B00',
        secondaryColor: '#138808',
        logo: '/assets/astrotick-logo.png',
        title: 'AstroTick - Vedic Astrology',
        description: 'Authentic Vedic astrology services'
      },
      navigation: {
        'Home': 'Home',
        'Horoscope': 'Horoscope',
        'Kundli': 'Kundli',
        'Match Making': 'Match Making',
        'Panchang': 'Panchang',
        'Astrologers': 'Astrologers',
        'Tools': 'Tools',
        'Blog': 'Blog'
      }
    };
    
    setDomainConfig(config);

    // Fetch header configuration from API
    fetch(`/api/header-config?path=${location}`)
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setHeaderConfig(data.headerConfig);
          // Update document title
          document.title = data.headerConfig.title;
          
          // Update meta description
          const metaDescription = document.querySelector('meta[name="description"]');
          if (metaDescription) {
            metaDescription.setAttribute('content', data.headerConfig.description);
          }
        }
      })
      .catch(console.error);
  }, [location]);

  const isActiveRoute = (path: string) => {
    return location === path;
  };

  const handleLogout = () => {
    logout();
  };

  if (!domainConfig) {
    return null; // Loading state
  }

  const zodiacSigns = [
    { name: "MESHA", path: "/daily-horoscope", icon: "♈", symbol: "🐏" },
    { name: "VRISHABHA", path: "/daily-horoscope", icon: "♉", symbol: "🐂" },
    { name: "MITHUNA", path: "/daily-horoscope", icon: "♊", symbol: "👥" },
    { name: "KARKA", path: "/daily-horoscope", icon: "♋", symbol: "🦀" },
    { name: "SIMHA", path: "/daily-horoscope", icon: "♌", symbol: "🦁" },
    { name: "KANYA", path: "/daily-horoscope", icon: "♍", symbol: "👩" },
    { name: "TULA", path: "/daily-horoscope", icon: "♎", symbol: "⚖️" },
    { name: "VRISHCHIKA", path: "/daily-horoscope", icon: "♏", symbol: "🦂" },
    { name: "DHANU", path: "/daily-horoscope", icon: "♐", symbol: "🏹" },
    { name: "MAKARA", path: "/daily-horoscope", icon: "♑", symbol: "🐐" },
    { name: "KUMBHA", path: "/daily-horoscope", icon: "♒", symbol: "🏺" },
    { name: "MEENA", path: "/daily-horoscope", icon: "♓", symbol: "🐟" }
  ];

  const mainNavItems = [
    { href: "/", label: domainConfig.navigation['Home'] },
    { 
      label: domainConfig.navigation['Horoscope'],
      dropdown: [
        { href: "/daily-horoscope", label: "Daily Horoscope" },
        { href: "/weekly-horoscope", label: "Weekly Horoscope" },
        { href: "/monthly-horoscope", label: "Monthly Horoscope" },
        { href: "/horoscopes", label: "All Horoscopes" }
      ]
    },
    { 
      label: domainConfig.navigation['Kundli'],
      dropdown: [
        { href: "/kundli", label: domainConfig.navigation['Kundli'] },
        { href: "/match-making", label: domainConfig.navigation['Match Making'] },
        { href: "/panchang", label: domainConfig.navigation['Panchang'] },
        { href: "/birth-details", label: "Birth Chart" },
        { href: "/astrology-tools", label: "Astrology Tools" }
      ]
    },
    { href: "/astrologers", label: domainConfig.navigation['Astrologers'] },
    { 
      label: domainConfig.navigation['Tools'],
      dropdown: [
        { href: "/astrology-tools", label: "Astrology Tools" },
        { href: "/kundli-matching", label: "Kundli Matching" },
        { href: "/lucky-numbers", label: "Lucky Numbers" },
        { href: "/moon-sign-checker", label: "Moon Sign" },
        { href: "/nakshatra-finder", label: "Nakshatra Finder" },
        { href: "/lagna-calculator", label: "Lagna Calculator" }
      ]
    },
    { href: "/consultations", label: "Consultations" },
    { href: "/blog", label: domainConfig.navigation['Blog'] },
  ];

  if (isAdmin) {
    mainNavItems.push({ href: "/admin", label: "Admin" });
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
      {/* Top Bar with Domain-Specific Colors */}
      <div 
        className="text-white text-sm py-2"
        style={{ backgroundColor: domainConfig.branding.primaryColor }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs sm:text-sm animate-pulse">Chat with Astrologer</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {user && (
              <span className="text-xs sm:text-sm">₹{((user as any).balance / 100).toFixed(2) || '0.00'}</span>
            )}
            {!isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button className="bg-white hover:bg-gray-100 text-xs px-3 py-1 h-auto"
                    style={{ color: domainConfig.branding.primaryColor }}
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button 
                    className="text-white hover:opacity-90 text-xs px-3 py-1 h-auto"
                    style={{ backgroundColor: domainConfig.branding.secondaryColor }}
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 text-white hover:text-orange-100 text-xs">
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium"
                        style={{ color: domainConfig.branding.primaryColor }}
                      >
                        {user?.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="hidden sm:inline">{user?.username}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center w-full cursor-pointer">
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/consultations" className="flex items-center w-full cursor-pointer">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      My Consultations
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="flex items-center w-full cursor-pointer">
                        <Settings className="h-4 w-4 mr-2" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="relative w-14 h-14">
              <div 
                className="absolute inset-0 w-14 h-14 rounded-full shadow-2xl"
                style={{ 
                  background: `linear-gradient(45deg, ${domainConfig.branding.primaryColor}, ${domainConfig.branding.secondaryColor})` 
                }}
              ></div>
              <div className="absolute inset-2 w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-2xl">🕉️</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span 
                className="text-xl font-bold"
                style={{ color: domainConfig.branding.primaryColor }}
              >
                {domainConfig.siteName}
              </span>
              <span className="text-xs text-gray-500 -mt-1">
                {domainConfig.language === 'english' ? 'Vedic Astrology' : 
                 domainConfig.language === 'hindi' ? 'वैदिक ज्योतिष' :
                 domainConfig.language === 'tamil' ? 'வேத ஜோதிடம்' :
                 domainConfig.language === 'telugu' ? 'వేద జ్యోతిష్యం' : 'Vedic Astrology'}
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            {mainNavItems.map((item) => (
              item.dropdown ? (
                <DropdownMenu key={item.label}>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="flex items-center gap-1 text-gray-600 hover:text-gray-800 px-0 text-sm"
                    >
                      {item.label}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48">
                    {item.dropdown.map((dropdownItem) => (
                      <DropdownMenuItem key={dropdownItem.href} asChild>
                        <Link href={dropdownItem.href} className="flex items-center w-full cursor-pointer">
                          {dropdownItem.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link key={item.href} href={item.href}>
                  <span className={cn(
                    "transition duration-300 cursor-pointer text-gray-600 hover:text-gray-800 text-sm",
                    isActiveRoute(item.href) && "font-medium"
                  )}
                  style={{ 
                    ...(isActiveRoute(item.href) && { color: domainConfig.branding.primaryColor })
                  }}
                  >
                    {item.label}
                  </span>
                </Link>
              )
            ))}
          </div>

          {/* Action Buttons - Desktop */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Free Premium Report Button */}
            <Link href="/reports/premium">
              <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-300 font-semibold">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🎁</span>
                  <span>Free Premium Report</span>
                </div>
              </Button>
            </Link>
            
            {/* Chat with Astrologer Button */}
            <Link href="/astrologers">
              <Button 
                className="text-white px-6 py-2 flex items-center space-x-2"
                style={{ backgroundColor: domainConfig.branding.secondaryColor }}
              >
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Chat with Astrologer</span>
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-2 space-y-2">
            {/* Free Premium Report Button - Mobile */}
            <Link href="/reports/premium">
              <div 
                className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-4 rounded-lg shadow-lg transition-all duration-300 font-semibold text-center cursor-pointer mb-3"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center justify-center gap-2">
                  <span className="text-lg">🎁</span>
                  <span>Free Premium Report</span>
                </div>
              </div>
            </Link>
            
            {mainNavItems.map((item) => (
              item.dropdown ? (
                <details key={item.label} className="group">
                  <summary className="flex items-center justify-between py-2 text-gray-600 cursor-pointer list-none">
                    <span>{item.label}</span>
                    <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="pl-4 space-y-1">
                    {item.dropdown.map((dropdownItem) => (
                      <Link key={dropdownItem.href} href={dropdownItem.href}>
                        <div className="block py-2 text-sm text-gray-500 hover:text-gray-700">
                          {dropdownItem.label}
                        </div>
                      </Link>
                    ))}
                  </div>
                </details>
              ) : (
                <Link key={item.href} href={item.href}>
                  <div className="block py-2 text-gray-600 hover:text-gray-700">
                    {item.label}
                  </div>
                </Link>
              )
            ))}
          </div>
        </div>
      )}
    </header>
  );
}