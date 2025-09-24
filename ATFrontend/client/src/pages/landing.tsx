import { useState } from "react";
import { Star, MessageCircle, Users, ArrowRight, Sparkles, Clock, Shield } from "lucide-react";
import { Button } from "src/components/ui/button";
import { Card, CardContent } from "src/components/ui/card";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";
import { useLocation } from "wouter";

export default function Landing() {
  const [, setLocation] = useLocation();

  const handleLoginClick = () => {
    setLocation("/login");
  };

  const handleGetStartedClick = () => {
    setLocation("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AstroTickHeader />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-600 via-amber-600 to-yellow-700 text-white py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Discover Your
                <br />
                <span className="text-yellow-400">Cosmic Destiny</span>
              </h1>
              <p className="text-lg md:text-xl mb-8 text-purple-100 max-w-lg">
                Connect with India's most trusted astrologers for personalized guidance on love, career, health, and life decisions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={handleLoginClick}
                  className="bg-yellow-400 text-purple-900 px-8 py-4 text-lg font-semibold hover:bg-yellow-300 transition-all duration-300 rounded-full"
                  size="lg"
                >
                  Chat with Astrologers
                </Button>
                <Button 
                  onClick={handleGetStartedClick}
                  variant="outline" 
                  className="border-2 border-white text-white bg-white/10 backdrop-blur-sm px-8 py-4 text-lg hover:bg-white hover:text-purple-700 transition-all duration-300 rounded-full"
                  size="lg"
                >
                  Get Started Free
                </Button>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-4 mt-8">
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-white font-medium ml-2">4.9/5 Rating</span>
                </div>
                <div className="text-purple-200">50,000+ Consultations</div>
              </div>
            </div>

            {/* Right Content - Astrology Illustration */}
            <div className="flex justify-center lg:justify-end">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-sm w-full">
                <div className="flex justify-center mb-6">
                  <svg width="140" height="140" viewBox="0 0 140 140" className="drop-shadow-lg">
                    <circle cx="70" cy="70" r="65" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeDasharray="3,3">
                      <animateTransform attributeName="transform" type="rotate" dur="60s" repeatCount="indefinite" values="0 70 70;360 70 70"/>
                    </circle>
                    <circle cx="70" cy="70" r="50" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
                    <circle cx="70" cy="70" r="35" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.4)" strokeWidth="1"/>
                    <circle cx="70" cy="70" r="20" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.5)" strokeWidth="1"/>

                    {/* Zodiac symbols around the circle */}
                    <g className="text-white text-xs fill-current">
                      <text x="70" y="25" textAnchor="middle" className="text-sm">♈</text>
                      <text x="95" y="35" textAnchor="middle" className="text-sm">♉</text>
                      <text x="110" y="55" textAnchor="middle" className="text-sm">♊</text>
                      <text x="115" y="75" textAnchor="middle" className="text-sm">♋</text>
                      <text x="110" y="95" textAnchor="middle" className="text-sm">♌</text>
                      <text x="95" y="110" textAnchor="middle" className="text-sm">♍</text>
                      <text x="70" y="120" textAnchor="middle" className="text-sm">♎</text>
                      <text x="45" y="110" textAnchor="middle" className="text-sm">♏</text>
                      <text x="30" y="95" textAnchor="middle" className="text-sm">♐</text>
                      <text x="25" y="75" textAnchor="middle" className="text-sm">♑</text>
                      <text x="30" y="55" textAnchor="middle" className="text-sm">♒</text>
                      <text x="45" y="35" textAnchor="middle" className="text-sm">♓</text>
                    </g>

                    {/* Center star */}
                    <circle cx="70" cy="70" r="3" fill="rgba(255,212,102,1)"/>
                    <path d="M70,60 L72,66 L78,66 L73,70 L75,76 L70,72 L65,76 L67,70 L62,66 L68,66 Z" fill="rgba(255,212,102,0.8)"/>
                  </svg>
                </div>

                <h3 className="text-xl font-semibold mb-2 text-center">Your Cosmic Journey Awaits</h3>
                <p className="text-purple-100 text-center text-sm mb-4">
                  Join thousands who discovered their true path through ancient wisdom
                </p>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm">Personalized readings</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MessageCircle className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm">Real-time chat support</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm">100% confidential</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose AstroTick?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience the most advanced astrology platform with verified experts and instant consultations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Expert Astrologers</h3>
                <p className="text-gray-600">
                  Connect with verified astrologers with 10+ years of experience in Vedic astrology, tarot, and numerology
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">24/7 Available</h3>
                <p className="text-gray-600">
                  Get instant guidance anytime, anywhere. Our astrologers are available round the clock for your queries
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Secure & Private</h3>
                <p className="text-gray-600">
                  All consultations are completely confidential with secure payment processing and data protection
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-purple-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Unlock Your Destiny?
          </h2>
          <p className="text-lg text-purple-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied users who found clarity and direction through our expert astrologers
          </p>
          <Button 
            onClick={handleLoginClick}
            className="bg-yellow-400 text-purple-900 px-8 py-4 text-lg font-semibold hover:bg-yellow-300 transition-all duration-300 rounded-full"
            size="lg"
          >
            Start Your Journey Today
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}