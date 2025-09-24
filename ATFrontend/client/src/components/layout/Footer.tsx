import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="flex flex-col items-center mb-12">
          <Link
            href="/"
            className="text-center mb-6 hover:opacity-80 transition-opacity"
          >
            {/* AstroTick Heading */}
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-red-500 to-purple-500">
              AstroTick
            </h1>
            <p className="text-gray-400 text-sm mt-1">Vedic Astrology</p>
          </Link>

          {/* Description */}
          <p className="text-gray-300 text-center max-w-2xl leading-relaxed mb-8">
            India's leading astrology platform connecting you with experienced
            Vedic astrologers for authentic guidance. Our platform offers
            real-time consultations, precise birth chart calculations, and
            comprehensive astrological services with certified professionals.
          </p>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-8">
            <div className="flex items-center space-x-2 bg-gray-800/50 backdrop-blur-sm px-3 py-1 rounded-full">
              <span className="text-yellow-400">⭐</span>
              <span className="text-sm text-gray-300">4.8/5 Rating</span>
            </div>
            <div className="flex items-center space-x-2 bg-gray-800/50 backdrop-blur-sm px-3 py-1 rounded-full">
              <span className="text-green-400">🔒</span>
              <span className="text-sm text-gray-300">SSL Secured</span>
            </div>
            <div className="flex items-center space-x-2 bg-gray-800/50 backdrop-blur-sm px-3 py-1 rounded-full">
              <span className="text-purple-400">🌟</span>
              <span className="text-sm text-gray-300">50K+ Users</span>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-10 sm:mb-12 text-center">
          {[
            { color: "green-400", text: "Available 24/7" },
            { color: "blue-400", text: "Secure Payments" },
            { color: "purple-400", text: "100+ Astrologers" },
            { color: "orange-400", text: "Swiss Ephemeris" },
          ].map((feature, i) => (
            <div
              key={i}
              className="p-3 sm:p-4 bg-gray-800/30 backdrop-blur-sm rounded-lg border border-gray-700/50 flex flex-col items-center"
            >
              <div
                className={`w-3 h-3 bg-gradient-to-r from-${feature.color} to-${feature.color}-500 rounded-full mb-2`}
              ></div>
              <span className="text-xs sm:text-sm text-gray-300">
                {feature.text}
              </span>
            </div>
          ))}
        </div>

        {/* Links Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-12 ">
          {/* Quick Links */}
          <div className="bg-gray-800/20 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-700/30">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <span className="w-2 h-2 bg-purple-500 hidden md:block rounded-full mr-3"></span>
              Quick Links
            </h3>
            <div className="grid grid-cols-2 pl-20 sm:grid-cols-2 gap-1 ">
              {[
                { href: "/", label: "Home" },
                { href: "/astrologers", label: "Astrologers" },
                { href: "/astro-tools", label: "Astro Tools" },
                { href: "/daily-horoscope", label: "Horoscope" },
                {
                  href: "/kundli-matching",
                  label: "Kundli Match",
                },
                { href: "/panchang", label: "Panchang" },
                { href: "/blog", label: "Blog" },
                { href: "/support", label: "Support" },
              ].map((link, i) => (
                <Link
                  key={i}
                  href={link.href}
                  className="flex items-center text-gray-300 hover:text-purple-400 transition-colors p-2 rounded hover:bg-gray-700/30 text-sm sm:text-base"
                >
                  {/* <span className="mr-2">{link.emoji}</span> */}
                  <span className="text-sm">{link.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Legal Links */}
          <div className="bg-gray-800/20 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-700/30">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <span className="w-2 h-2 bg-blue-500 hidden md:block rounded-full mr-3"></span>
              Legal & Policies
            </h3>
            <div className="grid grid-cols-2 gap-1 sm:gap-2">
              {[
                { href: "/privacy-policy", label: "Privacy" },
                { href: "/terms-of-service", label: "Terms" },
                { href: "/refund-policy", label: "Refunds" },
                { href: "/delivery-policy", label: "Delivery" },
                { href: "/disclaimer", label: "Disclaimer" },
                { href: "/cookie-policy", label: "Cookies" },
                { href: "/contact", label: "Contact" },
                { href: "/about", label: "About" },
              ].map((link, i) => (
                <Link
                  key={i}
                  href={link.href}
                  className="flex items-center text-gray-300 hover:text-purple-400 transition-colors p-2 rounded hover:bg-gray-700/30 text-sm sm:text-base"
                >
                  {/* <span className="mr-2">{link.emoji}</span> */}
                  <span className="text-sm">{link.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700/50 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4 text-center lg:text-left">
            <div className="text-gray-400 text-sm">
              <p>
                © {new Date().getFullYear()} AstroTick. All rights reserved.
              </p>
              <p className="mt-1">Authentic Vedic Astrology Platform</p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <span className="flex items-center space-x-2 text-gray-400">
                <span className="text-purple-400">🔮</span>
                <span>Swiss Ephemeris Powered</span>
              </span>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-6 pt-6 border-t border-gray-800">
            <p className="text-xs text-gray-500 text-center leading-relaxed max-w-4xl mx-auto">
              Astrology is for guidance purposes only. Results may vary based on
              individual circumstances. Always consult qualified professionals
              for important life decisions.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
