import { Link } from 'wouter';

interface LogoProps {
  variant?: 'clock' | 'compass' | 'celestial-tick';
}

export default function LogoOptions({ variant = 'clock' }: LogoProps) {
  
  if (variant === 'compass') {
    return (
      <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
        {/* Option 2: Vedic Compass/Yantra */}
        <div className="relative w-10 h-10">
          {/* Outer compass ring */}
          <div className="absolute inset-0 w-10 h-10 bg-gradient-to-br from-amber-600 via-orange-600 to-red-600 rounded-full shadow-lg"></div>
          {/* Yantra/Compass design */}
          <div className="absolute inset-1 w-8 h-8 rounded-full border border-white/40 flex items-center justify-center">
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none">
              {/* Compass points with planetary symbols */}
              <g stroke="currentColor" strokeWidth="1.5" fill="none">
                {/* Main compass directions */}
                <line x1="12" y1="3" x2="12" y2="7" strokeWidth="2" />
                <line x1="12" y1="17" x2="12" y2="21" strokeWidth="2" />
                <line x1="21" y1="12" x2="17" y2="12" strokeWidth="2" />
                <line x1="7" y1="12" x2="3" y2="12" strokeWidth="2" />
                
                {/* Diagonal directions */}
                <line x1="18.36" y1="5.64" x2="15.54" y2="8.46" />
                <line x1="8.46" y1="15.54" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="18.36" x2="15.54" y2="15.54" />
                <line x1="8.46" y1="8.46" x2="5.64" y2="5.64" />
                
                {/* Central yantra pattern */}
                <circle cx="12" cy="12" r="4" opacity="0.6"/>
                <circle cx="12" cy="12" r="2" opacity="0.4"/>
              </g>
              {/* Planetary symbols at key points */}
              <g fill="currentColor" fontSize="6" textAnchor="middle">
                <text x="12" y="5" opacity="0.8">☉</text>
                <text x="19" y="12.5" opacity="0.8">☽</text>
                <text x="12" y="20" opacity="0.8">♂</text>
                <text x="5" y="12.5" opacity="0.8">☿</text>
              </g>
              {/* Center dot */}
              <circle cx="12" cy="12" r="1" fill="currentColor"/>
            </svg>
          </div>
          {/* Subtle glow */}
          <div className="absolute -inset-1 w-12 h-12 bg-gradient-to-br from-amber-400 to-red-500 rounded-full opacity-20 blur-sm"></div>
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent">AstroTick</span>
          <span className="text-xs text-gray-500 -mt-1">Vedic Astrology</span>
        </div>
      </Link>
    );
  }
  
  if (variant === 'celestial-tick') {
    return (
      <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
        {/* Option 3: Celestial Tick Mark */}
        <div className="relative w-10 h-10">
          {/* Planet/celestial body */}
          <div className="absolute inset-1 w-8 h-8 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-full shadow-lg"></div>
          
          {/* Orbital ring forming the tick */}
          <svg className="absolute inset-0 w-10 h-10" viewBox="0 0 40 40" fill="none">
            {/* Orbit path */}
            <path 
              d="M 20,5 A 15,15 0 0,1 35,20 A 15,15 0 0,1 20,35"
              stroke="url(#tickGradient)" 
              strokeWidth="2" 
              fill="none"
              strokeLinecap="round"
            />
            
            {/* Tick mark formed by orbit completion */}
            <path 
              d="M 12,20 L 18,26 L 28,14"
              stroke="url(#tickGradient)" 
              strokeWidth="2.5" 
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            
            {/* Gradient definition */}
            <defs>
              <linearGradient id="tickGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6"/>
                <stop offset="50%" stopColor="#8B5CF6"/>
                <stop offset="100%" stopColor="#4F46E5"/>
              </linearGradient>
            </defs>
          </svg>
          
          {/* Inner planet glow */}
          <div className="absolute inset-2 w-6 h-6 bg-gradient-to-br from-cyan-300 to-blue-400 rounded-full opacity-70"></div>
          
          {/* Outer glow effect */}
          <div className="absolute -inset-1 w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full opacity-15 blur-sm"></div>
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">AstroTick</span>
          <span className="text-xs text-gray-500 -mt-1">Vedic Astrology</span>
        </div>
      </Link>
    );
  }
  
  // Default: Astrological Clock (current implementation)
  return (
    <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
      {/* Option 1: Astrological Clock/Timing Symbol */}
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
        <span className="text-xs text-gray-500 -mt-1">Vedic Astrology</span>
      </div>
    </Link>
  );
}