import { Link } from "wouter";
import { openAstroWhatsApp } from "../../utils/whatsapp";

// ─── Mobile-only footer (shown below lg) ───────────────────────────────────
function FooterMobile() {
  const linkStyle: React.CSSProperties = {
    display: "block",
    textAlign: "center",
    fontSize: "12px",
    color: "#9ca3af",
    padding: "2px 0",
    textDecoration: "none",
    lineHeight: "1.4",
  };
  const btnStyle: React.CSSProperties = {
    ...linkStyle,
    background: "none",
    border: "none",
    cursor: "pointer",
    width: "100%",
  };
  const headingStyle: React.CSSProperties = {
    fontSize: "12px",
    fontWeight: 700,
    color: "#ffffff",
    textAlign: "center",
    margin: "0 0 4px 0",
    padding: 0,
  };

  return (
    <div style={{ background: "linear-gradient(to bottom, #111827, #000)", color: "#fff", padding: "14px 12px 10px" }}>

      {/* Logo */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <img src="/Logo.jpeg" alt="" style={{ width: "44px", height: "44px", borderRadius: "8px", objectFit: "cover" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
            <h1 style={{ margin: 0, padding: 0, fontSize: "22px", fontWeight: 800, lineHeight: 1.1, background: "linear-gradient(to right,#fb923c,#ef4444,#a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              AstroTick
            </h1>
            <p style={{ margin: 0, padding: 0, fontSize: "11px", color: "#fdba74", lineHeight: 1.1 }}>Your Future. On Time</p>
          </div>
        </div>

        {/* Badges */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "5px" }}>
          {[{ icon: "⭐", text: "4.8/5 Rating" }, { icon: "🔒", text: "SSL Secured" }, { icon: "🌟", text: "50K+ Users" }].map((b, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "4px", background: "rgba(255,255,255,0.08)", padding: "3px 8px", borderRadius: "6px" }}>
              <span style={{ fontSize: "11px" }}>{b.icon}</span>
              <span style={{ fontSize: "11px", color: "#d1d5db" }}>{b.text}</span>
            </div>
          ))}
        </div>

        {/* Description */}
        <p style={{ margin: 0, padding: 0, fontSize: "11px", color: "#9ca3af", lineHeight: 1.45, textAlign: "center", maxWidth: "320px" }}>
          India's leading astrology platform connecting you with experienced Vedic astrologers for authentic guidance. Real-time consultations, precise birth chart calculations, and certified professionals.
        </p>
      </div>

      {/* Feature Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5px", marginBottom: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", background: "rgba(255,255,255,0.05)", border: "0.5px solid rgba(255,255,255,0.1)", padding: "5px 6px", borderRadius: "7px" }}>
          <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#4ade80", display: "inline-block", flexShrink: 0 }} />
          <span style={{ fontSize: "11px", color: "#d1d5db" }}>Available 24/7</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", background: "rgba(255,255,255,0.05)", border: "0.5px solid rgba(255,255,255,0.1)", padding: "5px 6px", borderRadius: "7px" }}>
          <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#60a5fa", display: "inline-block", flexShrink: 0 }} />
          <span style={{ fontSize: "11px", color: "#d1d5db" }}>Secure Payments</span>
        </div>
        <div style={{ gridColumn: "1/-1", display: "flex", justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", background: "rgba(255,255,255,0.05)", border: "0.5px solid rgba(255,255,255,0.1)", padding: "5px 20px", borderRadius: "7px" }}>
            <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#fb923c", display: "inline-block", flexShrink: 0 }} />
            <span style={{ fontSize: "11px", color: "#d1d5db" }}>Swiss Ephemeris</span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: "1px", background: "linear-gradient(to right,#fb923c,#ef4444,#a855f7)", margin: "8px 0" }} />

      {/* Nav Links 2x2 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 6px", marginBottom: "8px" }}>

        <div>
          <h3 style={headingStyle}>Explore</h3>
          <Link href="/" style={linkStyle}>Home</Link>
          <button type="button" onClick={openAstroWhatsApp} style={btnStyle}>Astrologers</button>
          <Link href="/daily-horoscope" style={linkStyle}>Horoscope</Link>
          <Link href="/kundli-matching" style={linkStyle}>Kundli Matching</Link>
          <Link href="/panchang" style={linkStyle}>Panchang</Link>
        </div>

        <div>
          <h3 style={headingStyle}>Tools & Help</h3>
          <Link href="/astro-tools" style={linkStyle}>Astro Tools</Link>
          <Link href="/blog" style={linkStyle}>Blog</Link>
          <Link href="/support" style={linkStyle}>Support</Link>
        </div>

        <div>
          <h3 style={headingStyle}>About Us</h3>
          <Link href="/about" style={linkStyle}>About</Link>
          <Link href="/contact" style={linkStyle}>Contact</Link>
          <Link href="/delivery-policy" style={linkStyle}>Delivery</Link>
        </div>

        <div>
          <h3 style={headingStyle}>Legal</h3>
          <Link href="/privacy-policy" style={linkStyle}>Privacy</Link>
          <Link href="/terms-of-service" style={linkStyle}>Terms</Link>
          <Link href="/disclaimer" style={linkStyle}>Disclaimer</Link>
          <Link href="/cookie-policy" style={linkStyle}>Cookies</Link>
          <Link href="/refund-policy" style={linkStyle}>Refund</Link>
        </div>

      </div>

      {/* Divider */}
      <div style={{ height: "1px", background: "linear-gradient(to right,#fb923c,#ef4444,#a855f7)", margin: "6px 0" }} />

      {/* Bottom */}
      <div style={{ textAlign: "center", padding: "4px 0 2px" }}>
        <p style={{ margin: 0, padding: 0, fontSize: "11px", color: "#6b7280", lineHeight: 1.5 }}>Authentic Vedic Astrology Platform</p>
        <p style={{ margin: 0, padding: 0, fontSize: "11px", color: "#6b7280", lineHeight: 1.5 }}>© {new Date().getFullYear()} AstroTick. All rights reserved.</p>
      </div>

      {/* Disclaimer */}
      <p style={{ margin: "6px auto 0", padding: 0, fontSize: "10px", color: "#4b5563", textAlign: "center", lineHeight: 1.45 }}>
        Astrology is for guidance purposes only. Results may vary based on individual circumstances. Always consult qualified professionals for important life decisions.
      </p>
    </div>
  );
}

// ─── Desktop/Tablet footer (shown at lg and above) ─────────────────────────
function FooterDesktop() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white mt-16">
      <div className="max-w-7xl mx-auto py-6">
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

            <p className="mt-6 text-gray-300 max-w-xl leading-relaxed">
              India's leading astrology platform connecting you with experienced
              Vedic astrologers for authentic guidance. Our platform offers
              real-time consultations, precise birth chart calculations, and
              comprehensive astrological services with certified professionals.
            </p>
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { color: "bg-green-400", text: "Available 24/7" },
                { color: "bg-blue-400", text: "Secure Payments" },
                { color: "bg-orange-400", text: "Swiss Ephemeris" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 bg-gray-800/30 px-8 py-2 rounded-lg border border-gray-700/50">
                  <span className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="text-sm text-gray-300">{item.text}</span>
                </div>
              ))}
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm">
                <div>
                  <h3 className="font-semibold mb-2 px-2 text-white">Explore</h3>
                  <div className="flex flex-col">
                    <Link href="/" className="hover:text-purple-400 hover:bg-gray-700/30 p-2 rounded transition">Home</Link>
                    <button type="button" onClick={openAstroWhatsApp} className="text-left hover:text-purple-400 hover:bg-gray-700/30 p-2 rounded transition">Astrologers</button>
                    <Link href="/daily-horoscope" className="hover:text-purple-400 hover:bg-gray-700/30 p-2 rounded transition">Horoscope</Link>
                    <Link href="/kundli-matching" className="hover:text-purple-400 hover:bg-gray-700/30 p-2 rounded transition">Kundli Matching</Link>
                    <Link href="/panchang" className="hover:text-purple-400 hover:bg-gray-700/30 p-2 rounded transition">Panchang</Link>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 px-2 text-white">Tools & Help</h3>
                  <div className="flex flex-col">
                    <Link href="/astro-tools" className="hover:text-purple-400 hover:bg-gray-700/30 p-2 rounded transition">Astro Tools</Link>
                    <Link href="/blog" className="hover:text-purple-400 hover:bg-gray-700/30 p-2 rounded transition">Blog</Link>
                    <Link href="/support" className="hover:text-purple-400 hover:bg-gray-700/30 p-2 rounded transition">Support</Link>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 px-2 text-white">About Us</h3>
                  <div className="flex flex-col">
                    <Link href="/about" className="hover:text-purple-400 hover:bg-gray-700/30 p-2 rounded transition">About</Link>
                    <Link href="/contact" className="hover:text-purple-400 hover:bg-gray-700/30 p-2 rounded transition">Contact</Link>
                    <Link href="/delivery-policy" className="hover:text-purple-400 hover:bg-gray-700/30 p-2 rounded transition">Delivery</Link>
                  </div>
                </div>
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

        <div className="h-0.5 bg-gradient-to-r from-orange-400 via-red-500 to-purple-500" />
        <div className="flex flex-col py-3 lg:flex-row justify-between items-center gap-4 text-center lg:text-left">
          <div className="text-gray-400 text-sm">
            <p>© {new Date().getFullYear()} AstroTick. All rights reserved.</p>
          </div>
          <span className="flex items-center gap-2 text-gray-400 text-sm">
            <p className="mt-1">Authentic Vedic Astrology Platform</p>
          </span>
        </div>
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

// ─── Main export ────────────────────────────────────────────────────────────
export function Footer() {
  return (
    <>
      {/* Show ONLY on mobile (below 1024px) */}
      <div className="block lg:hidden mt-16">
        <FooterMobile />
      </div>
      {/* Show ONLY on tablet/desktop (1024px and above) */}
      <div className="hidden lg:block">
        <FooterDesktop />
      </div>
    </>
  );
}

export default Footer;