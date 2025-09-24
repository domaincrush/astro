import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from 'src/components/ui/button';
import { Badge } from 'src/components/ui/badge';
import { 
  Menu, X, Star, Calendar, Heart, Calculator, 
  MessageCircle, Book, Settings, User
} from 'lucide-react';

const TamilHeader = () => {
  const [, setLocation] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const tamilNavItems = [
    {
      label: 'முகப்பு',
      path: '/tamil',
      icon: <Star className="h-4 w-4" />
    },
    {
      label: 'இலவச ஜாதகம்',
      path: '/tamil/jathagam',
      icon: <Star className="h-4 w-4" />
    },
    {
      label: 'திருமண பொருத்தம்',
      path: '/tamil/kundli-matching',
      icon: <Heart className="h-4 w-4" />
    },
    {
      label: 'தமிழ் பஞ்சாங்கம்',
      path: '/tamil/panchang',
      icon: <Calendar className="h-4 w-4" />
    },
    {
      label: 'ராசி பலன்கள்',
      path: '/tamil/daily-horoscope',
      icon: <Book className="h-4 w-4" />
    },
    {
      label: 'ஜோதிட கருவிகள்',
      path: '/tamil/astrology-tools',
      icon: <Calculator className="h-4 w-4" />
    },
    {
      label: 'ஜோதிடர்களுடன் பேசுங்கள்',
      path: '/tamil/astrologers',
      icon: <MessageCircle className="h-4 w-4" />
    }
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm shadow-sm border-b border-orange-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Tamil Logo - Using exact same format as English version */}
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setLocation('/tamil')}
          >
            <div className="relative w-10 h-10">
              {/* Outer clock ring */}
              <div className="absolute inset-0 w-10 h-10 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-full shadow-lg"></div>
              {/* Clock marks */}
              <div className="absolute inset-1 w-8 h-8 rounded-full border-2 border-white/30 flex items-center justify-center">
                {/* Clock hands forming a tick */}
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none">
                  {/* 12 hour marks around the circle */}
                  <g stroke="currentColor" strokeWidth="1" opacity="0.6">
                    <line x1="12" y1="2" x2="12" y2="4" />
                    <line x1="12" y1="20" x2="12" y2="22" />
                    <line x1="22" y1="12" x2="20" y2="12" />
                    <line x1="4" y1="12" x2="2" y2="12" />
                    <line x1="19.07" y1="4.93" x2="17.66" y2="6.34" />
                    <line x1="6.34" y1="17.66" x2="4.93" y2="19.07" />
                    <line x1="19.07" y1="19.07" x2="17.66" y2="17.66" />
                    <line x1="6.34" y1="6.34" x2="4.93" y2="4.93" />
                  </g>
                  {/* Clock hands forming checkmark */}
                  <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
                        d="M9 12l2 2 4-4" fill="none"/>
                  {/* Center dot */}
                  <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
                </svg>
              </div>
              {/* Subtle glow */}
              <div className="absolute -inset-1 w-12 h-12 bg-gradient-to-br from-indigo-400 to-pink-500 rounded-full opacity-20 blur-sm"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">AstroTick</span>
              <span className="text-xs text-gray-500 -mt-1">தமிழ் ஜோதிடம்</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {tamilNavItems.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className="text-slate-700 hover:text-orange-600 hover:bg-orange-50"
                onClick={() => setLocation(item.path)}
              >
                {item.icon}
                <span className="ml-2">{item.label}</span>
              </Button>
            ))}
          </nav>

          {/* Free Premium Report Button - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-300 font-semibold"
              onClick={() => setLocation('/tamil/premium-report')}
            >
              <span className="text-lg mr-2">🎁</span>
              இலவச ப்ரீமியம் அறிக்கை
            </Button>
            
            <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
              தமிழ்
            </Badge>
            <Button
              variant="outline"
              size="sm"
              className="border-orange-200 text-orange-600 hover:bg-orange-50"
              onClick={() => setLocation('/tamil/profile')}
            >
              <User className="h-4 w-4 mr-2" />
              கணக்கு
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-orange-100">
            <nav className="flex flex-col gap-2">
              {/* Free Premium Report Button - Mobile */}
              <Button
                className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-4 px-4 rounded-lg shadow-lg transition-all duration-300 font-semibold text-center cursor-pointer w-full flex items-center justify-center gap-2"
                onClick={() => {
                  setLocation('/tamil/premium-report');
                  setIsMenuOpen(false);
                }}
              >
                <span className="text-xl">🎁</span>
                <span className="text-lg">இலவச ப்ரீமியம் அறிக்கை</span>
              </Button>
              
              {tamilNavItems.map((item, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className="justify-start text-slate-700 hover:text-orange-600 hover:bg-orange-50"
                  onClick={() => {
                    setLocation(item.path);
                    setIsMenuOpen(false);
                  }}
                >
                  {item.icon}
                  <span className="ml-2">{item.label}</span>
                </Button>
              ))}
              <div className="flex items-center gap-3 px-3 py-2">
                <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                  தமிழ்
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-orange-200 text-orange-600 hover:bg-orange-50"
                  onClick={() => {
                    setLocation('/tamil/profile');
                    setIsMenuOpen(false);
                  }}
                >
                  <User className="h-4 w-4 mr-2" />
                  கணக்கு
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default TamilHeader;