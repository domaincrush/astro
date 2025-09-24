import { useState, useEffect, useRef } from "react";
import { useAuth } from "src/hooks/useAuth";
import { Button } from "src/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "src/components/ui/dropdown-menu";
import { Link, useLocation } from "wouter";
import { BookOpen, Calculator, ChevronDown, Clock, Crown, Heart, LogOut, Menu, MessageCircle, Settings, Star, User, X, Zap } from "lucide-react";
import { cn } from "src/lib/utils";

export default function Header() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAdmin, logout } = useAuth();
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Close mobile menu when clicking outside and handle body scroll
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent background scroll on mobile
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isMobileMenuOpen]);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/astrologers", label: "Astrologers" },
    { href: "/kundli", label: "Kundli" },
    { href: "/panchang", label: "Panchangam" },
    { href: "/horoscopes", label: "Horoscopes" },
    { href: "/blog", label: "Blog" },
  ];

  const learnAstrologyItems = [
    { href: "/learn-astrology/basics", label: "Astrology Basics", icon: BookOpen, description: "Learn fundamentals of Vedic astrology" },
    { href: "/learn-astrology/birth-chart", label: "Birth Chart Reading", icon: Star, description: "Understand your natal chart" },
    { href: "/learn-astrology/planets", label: "Planets & Houses", icon: Calculator, description: "Planetary influences and house meanings" },
    { href: "/learn-astrology/nakshatras", label: "Nakshatras", icon: Zap, description: "27 lunar mansions explained" },
    { href: "/learn-astrology/doshas", label: "Doshas & Remedies", icon: Heart, description: "Identify and remedy planetary doshas" },
    { href: "/learn-astrology/muhurta", label: "Muhurta (Timing)", icon: Clock, description: "Auspicious timing selection" },
    { href: "/learn-astrology/advanced", label: "Advanced Techniques", icon: Crown, description: "KP system, divisional charts" },
  ];

  if (isAdmin) {
    navItems.push({ href: "/admin", label: "Admin" });
  }

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 via-blue-500 to-cyan-400 rounded-full flex items-center justify-center shadow-lg">
              <Star className="w-5 h-5 text-white animate-pulse" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">AstroTick</span>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <span className={cn(
                  "hover:text-purple-600 transition duration-300 cursor-pointer text-gray-600",
                  location === item.href && "text-purple-600 font-medium"
                )}>
                  {item.label}
                </span>
              </Link>
            ))}
            
            {/* Free Premium Report Button */}
            <Link href="/reports/premium">
              <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-300 font-semibold">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🎁</span>
                  <span>Free Premium Report</span>
                </div>
              </Button>
            </Link>

            {/* Learn Astrology Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1 text-gray-600 hover:text-purple-600 transition duration-300">
                  <BookOpen className="h-4 w-4" />
                  Learn Astrology
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-80">
                {learnAstrologyItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link href={item.href} className="flex items-center gap-3 p-3 cursor-pointer">
                        <div className="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center">
                          <Icon className="h-4 w-4 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{item.label}</div>
                          <div className="text-sm text-gray-600">{item.description}</div>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 text-gray-600 hover:text-purple-600">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="hidden sm:inline">{user.username}</span>
                    <div className="hidden sm:block bg-emerald-green/10 text-emerald-green px-2 py-1 rounded text-sm">
                      ₹{((user as any).balance / 100).toFixed(2) || '0.00'}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
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
                  <DropdownMenuItem onClick={logout} className="cursor-pointer">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href={`/login?redirect=${encodeURIComponent(location)}`}>
                <Button variant="ghost" className="flex items-center gap-2 text-gray-600 hover:text-purple-600">
                  <User className="h-5 w-5" />
                  <span className="hidden sm:inline">Login</span>
                </Button>
              </Link>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-600"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div 
            ref={mobileMenuRef}
            className="md:hidden fixed top-16 left-0 right-0 bottom-0 z-50 bg-white shadow-xl border-l border-r border-gray-200"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {/* Scroll hint at the very top */}
            <div className="sticky top-0 z-10 bg-gradient-to-r from-purple-100 to-blue-100 border-b border-purple-200 p-3 text-center text-sm text-purple-800 font-medium shadow-sm">
              <div className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <span>Scroll within this menu</span>
                <svg className="w-4 h-4 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto overflow-x-hidden mobile-menu-scroll" 
                 style={{ 
                   WebkitOverflowScrolling: 'touch',
                   height: 'calc(100vh - 120px)',
                   maxHeight: 'calc(100vh - 120px)'
                 }}>
              <div className="flex flex-col space-y-2 p-4 pb-20">
                {/* Free Premium Report Button - Mobile */}
                <Link href="/reports/premium">
                  <div 
                    className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-4 px-4 rounded-lg shadow-lg transition-all duration-300 font-semibold text-center cursor-pointer mb-4"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-xl">🎁</span>
                      <span className="text-lg">Free Premium Report</span>
                    </div>
                  </div>
                </Link>

                {navItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <div 
                      className={cn(
                        "block py-3 px-2 rounded-lg hover:bg-purple-50 hover:text-purple-600 transition-all duration-200 cursor-pointer text-gray-700 text-lg",
                        location === item.href && "text-purple-600 font-medium bg-purple-50"
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </div>
                  </Link>
                ))}
                
                {/* Learn Astrology Mobile Section */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 mb-3 px-2">
                    <BookOpen className="h-5 w-5 text-purple-600" />
                    <span className="font-semibold text-gray-900 text-lg">Learn Astrology</span>
                  </div>
                  <div className="space-y-1 ml-2">
                    {learnAstrologyItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link key={item.href} href={item.href}>
                          <div 
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-50 transition-colors cursor-pointer active:bg-purple-100"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Icon className="h-4 w-4 text-purple-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-base font-medium text-gray-900">{item.label}</div>
                              <div className="text-sm text-gray-600 leading-tight">{item.description}</div>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  {user ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {user.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-purple-600 font-medium">{user.username}</span>
                        <div className="ml-auto bg-emerald-green/10 text-emerald-green px-2 py-1 rounded text-sm">
                          ₹{((user as any).balance / 100).toFixed(2) || '0.00'}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Link href="/profile">
                          <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-50 hover:text-purple-600 transition-colors cursor-pointer text-gray-700" onClick={() => setIsMobileMenuOpen(false)}>
                            <User className="h-5 w-5" />
                            <span className="text-base">Profile</span>
                          </div>
                        </Link>
                        <Link href="/consultations">
                          <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-50 hover:text-purple-600 transition-colors cursor-pointer text-gray-700" onClick={() => setIsMobileMenuOpen(false)}>
                            <MessageCircle className="h-5 w-5" />
                            <span className="text-base">My Consultations</span>
                          </div>
                        </Link>
                        {isAdmin && (
                          <Link href="/admin">
                            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-50 hover:text-purple-600 transition-colors cursor-pointer text-gray-700" onClick={() => setIsMobileMenuOpen(false)}>
                              <Settings className="h-5 w-5" />
                              <span className="text-base">Admin Dashboard</span>
                            </div>
                          </Link>
                        )}
                        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer text-gray-700" onClick={logout}>
                          <LogOut className="h-5 w-5" />
                          <span className="text-base">Logout</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Link href={`/login?redirect=${encodeURIComponent(location)}`}>
                      <div 
                        className="flex items-center gap-3 p-3 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors cursor-pointer text-white"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <User className="h-5 w-5" />
                        <span className="text-base font-medium">Login</span>
                      </div>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}