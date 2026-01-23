import { Link } from "wouter";
import { openAstroWhatsApp } from "../../utils/whatsapp";

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white mt-16">
      <div className="max-w-7xl mx-auto py-6">

        {/* TOP SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">

          {/* LEFT COLUMN */}
          <div className="flex flex-col mt-5 items-center lg:items-start text-center lg:text-left">
            <Link href="/" className="mb-6 hover:opacity-80 transition-opacity">
              <div className="flex items-end gap-2">
                <img src="/Logo.jpeg" alt="" className="w-20 h-20 rounded-lg object-cover" />
                <div className="flex flex-col">
                  <h1 className="text-4xl sm:text-5xl font-extrabold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-red-500 to-purple-500">
                  AstroTick
                </h1>
                <p className="text-orange-300 w-full text-center text-lg">Your Future. On Time</p>
                </div>
              </div>
            </Link>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
              <div className="flex items-center gap-2 bg-gray-800/50 px-3 py-1 rounded-full">
                <span className="text-yellow-400">⭐</span>
                <span className="text-sm text-gray-300">4.8/5 Rating</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-800/50 px-3 py-1 rounded-full">
                <span className="text-green-400">🔒</span>
                <span className="text-sm text-gray-300">SSL Secured</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-800/50 px-3 py-1 rounded-full">
                <span className="text-purple-400">🌟</span>
                <span className="text-sm text-gray-300">50K+ Users</span>
              </div>
            </div>

            {/* Description */}
            <p className="mt-6 text-gray-300 max-w-xl leading-relaxed">
              India's leading astrology platform connecting you with experienced
              Vedic astrologers for authentic guidance. Our platform offers
              real-time consultations, precise birth chart calculations, and
              comprehensive astrological services with certified professionals.
            </p>
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-4">

            {/* FEATURES */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { color: "bg-green-400", text: "Available 24/7" },
                { color: "bg-blue-400", text: "Secure Payments" },
                // { color: "bg-purple-400", text: "100+ Astrologers" },
                { color: "bg-orange-400", text: "Swiss Ephemeris" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 bg-gray-800/30 px-8 py-2 rounded-lg border border-gray-700/50"
                >
                  <span className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="text-sm text-gray-300">{item.text}</span>
                </div>
              ))}
            </div>

            {/* LINKS – SINGLE BACKGROUND WRAPPER */}
            <div className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm">

                {/* Explore */}
                <div>
                  <h3 className="font-semibold mb-2 px-2 text-white">Explore</h3>
                  <div className="flex flex-col">
                    <Link href="/" className="hover:text-purple-400 hover:bg-gray-700/30 p-2 rounded transition">Home</Link>
                    {/* <Link href="/astrologers" className="hover:text-purple-400 hover:bg-gray-700/30 p-2 rounded transition">Astrologers</Link> */}
                    <button type="button" onClick={openAstroWhatsApp} className="text-left hover:text-purple-400 hover:bg-gray-700/30 p-2 rounded transition">Astrologers</button>
                    <Link href="/daily-horoscope" className="hover:text-purple-400 hover:bg-gray-700/30 p-2 rounded transition">Horoscope</Link>
                    <Link href="/kundli-matching" className="hover:text-purple-400 hover:bg-gray-700/30 p-2 rounded transition">Kundli Matching</Link>
                    <Link href="/panchang" className="hover:text-purple-400 hover:bg-gray-700/30 p-2 rounded transition">Panchang</Link>
                  </div>
                </div>

                {/* Tools & Help */}
                <div>
                  <h3 className="font-semibold mb-2 px-2 text-white">Tools & Help</h3>
                  <div className="flex flex-col">
                    <Link href="/astro-tools" className="hover:text-purple-400 hover:bg-gray-700/30 p-2 rounded transition">Astro Tools</Link>
                    <Link href="/blog" className="hover:text-purple-400 hover:bg-gray-700/30 p-2 rounded transition">Blog</Link>
                    <Link href="/support" className="hover:text-purple-400 hover:bg-gray-700/30 p-2 rounded transition">Support</Link>
                  </div>
                </div>

                {/* About Us */}
                <div>
                  <h3 className="font-semibold mb-2 px-2 text-white">About Us</h3>
                  <div className="flex flex-col">
                    <Link href="/about" className="hover:text-purple-400 hover:bg-gray-700/30 p-2 rounded transition">About</Link>
                    <Link href="/contact" className="hover:text-purple-400 hover:bg-gray-700/30 p-2 rounded transition">Contact</Link>
                    <Link href="/delivery-policy" className="hover:text-purple-400 hover:bg-gray-700/30 p-2 rounded transition">Delivery</Link>
                  </div>
                </div>

                {/* Legal */}
                <div>
                  <h3 className="font-semibold mb-2 px-2 text-white">Legal</h3>
                  <div className="flex flex-col">
                    <Link href="/privacy-policy" className="hover:text-purple-400 hover:bg-gray-700/30 p-2 rounded transition">Privacy</Link>
                    <Link href="/terms-of-service" className="hover:text-purple-400 hover:bg-gray-700/30 p-2 rounded transition">Terms</Link>
                    <Link href="/disclaimer" className="hover:text-purple-400 hover:bg-gray-700/30 p-2 rounded transition">Disclaimer</Link>
                    <Link href="/cookie-policy" className="hover:text-purple-400 hover:bg-gray-700/30 p-2 rounded transition">Cookies</Link>
                    <Link href="/refund-policy" className="hover:text-purple-400 hover:bg-gray-700/30 p-2 rounded transition">Refund</Link>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* BOTTOM SECTION */}

        {/* Gradient TOP Border */}
        <div className="h-0.5 bg-gradient-to-r from-orange-400 via-red-500 to-purple-500" />

        <div
          className="flex flex-col py-3
          lg:flex-row justify-between items-center gap-4 text-center lg:text-left"
        >
          <div className="text-gray-400 text-sm">
            <p>© {new Date().getFullYear()} AstroTick. All rights reserved.</p>
          </div>

          <span className="flex items-center gap-2 text-gray-400 text-sm">
            <p className="mt-1">Authentic Vedic Astrology Platform</p>
          </span>
        </div>

        {/* Gradient BOTTOM Border */}
        <div className="h-0.5 bg-gradient-to-r from-orange-400 via-red-500 to-purple-500" />

        <div className="mt-4">
          <p className="text-xs text-gray-500 text-center max-w-4xl mx-auto">
            Astrology is for guidance purposes only. Results may vary based on
            individual circumstances. Always consult qualified professionals
            for important life decisions.
          </p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;