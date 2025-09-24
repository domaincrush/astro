import { useState } from "react";
import { Button } from "src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";
import { Heart, Star, Users, Calendar, CheckCircle, ArrowRight } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Link, useLocation } from "wouter";
import { useAuth } from "src/hooks/useAuth";

export default function MatchMaking() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  const benefits = [
    "36-Point Guna Milan Compatibility Analysis",
    "Planetary Position Harmony Assessment", 
    "Manglik Dosha Detection & Remedies",
    "Ashta Koota Matching for Perfect Union",
    "Personalized Marriage Timing Predictions",
    "Family Compatibility Analysis"
  ];

  const packages = [
    {
      name: "Basic Match Analysis",
      price: "₹299",
      amount: 299,
      features: ["Guna Milan Score", "Basic Compatibility Report", "15-min Astrologer Chat"]
    },
    {
      name: "Detailed Compatibility",
      price: "₹599", 
      amount: 599,
      popular: true,
      features: ["Complete Guna Milan", "Detailed Compatibility Report", "Remedies & Solutions", "30-min Expert Consultation"]
    },
    {
      name: "Premium Match Making",
      price: "₹999",
      amount: 999,
      features: ["Full Compatibility Analysis", "Marriage Timing Prediction", "Family Matching", "60-min Premium Consultation", "Lifetime Report Access"]
    }
  ];

  const handlePackageSelect = (packageData: any) => {
    if (!user) {
      const currentPath = encodeURIComponent(window.location.pathname + window.location.search);
      setLocation(`/login?redirect=${currentPath}`);
      return;
    }

    // Redirect to payment with package details
    const paymentUrl = `/payment?amount=${packageData.amount}&service=match-making&package=${encodeURIComponent(packageData.name)}`;
    setLocation(paymentUrl);
  };

  return (
    <>
      <Helmet>
        <title>Vedic Match Making - Find Your Perfect Life Partner | AstroTick</title>
        <meta name="description" content="Discover perfect marriage compatibility through authentic Vedic astrology. Expert match making with Guna Milan, planetary analysis, and personalized consultation." />
        <meta name="keywords" content="match making, vedic astrology, guna milan, marriage compatibility, kundli matching, marriage astrology" />
        <link rel="canonical" href="/match-making" />
      </Helmet>

      <AstroTickHeader />
      
      <main className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        {/* Hero Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-pink-600 to-rose-600 p-6 rounded-full">
                <Heart className="h-16 w-16 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-mystical-blue mb-6">
              Vedic Match Making
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Find your perfect life partner through authentic Vedic astrology compatibility analysis. 
              Get expert guidance from certified astrologers with 36-point Guna Milan assessment.
            </p>
            <Button 
              size="lg" 
              onClick={() => {
                if (!user) {
                  setLocation("/login");
                } else {
                  setLocation("/astrologers?category=marriage");
                }
              }}
              className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white px-8 py-4 text-lg"
            >
              Consult Match Making Expert Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>

        {/* Why Choose Our Match Making */}
        <section className="py-16 bg-white/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center text-mystical-blue mb-12">
              Why Choose Our Vedic Match Making?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <ul className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                      <span className="text-lg text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-pink-100 to-rose-100 p-8 rounded-2xl">
                <h3 className="text-2xl font-bold text-mystical-blue mb-4">Expert Astrologers</h3>
                <p className="text-gray-700 mb-6">
                  Our certified Vedic astrologers have decades of experience in traditional match making. 
                  They analyze birth charts using authentic ancient methods to ensure perfect compatibility.
                </p>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-3xl font-bold text-pink-600">500+</div>
                    <div className="text-sm text-gray-600">Successful Matches</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-pink-600">15+</div>
                    <div className="text-sm text-gray-600">Years Experience</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Consultation Packages */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center text-mystical-blue mb-12">
              Choose Your Match Making Package
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {packages.map((pkg, index) => (
                <Card key={index} className={`relative ${pkg.popular ? 'ring-4 ring-pink-600 scale-105' : ''} bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300`}>
                  {pkg.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-pink-600 text-white px-4 py-2 rounded-full text-sm font-semibold">Most Popular</span>
                    </div>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl text-mystical-blue">{pkg.name}</CardTitle>
                    <div className="text-3xl font-bold text-pink-600">{pkg.price}</div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {pkg.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      onClick={() => handlePackageSelect(pkg)}
                      className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white"
                    >
                      Select Package
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-white/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center text-mystical-blue mb-12">
              How Our Match Making Works
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-pink-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">1</div>
                <h3 className="text-lg font-semibold mb-2">Share Birth Details</h3>
                <p className="text-gray-600">Provide birth date, time, and place for both partners</p>
              </div>
              
              <div className="text-center">
                <div className="bg-pink-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">2</div>
                <h3 className="text-lg font-semibold mb-2">Expert Analysis</h3>
                <p className="text-gray-600">Our astrologers perform detailed Guna Milan compatibility analysis</p>
              </div>
              
              <div className="text-center">
                <div className="bg-pink-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">3</div>
                <h3 className="text-lg font-semibold mb-2">Live Consultation</h3>
                <p className="text-gray-600">Chat with expert astrologer to discuss results and get guidance</p>
              </div>
              
              <div className="text-center">
                <div className="bg-pink-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">4</div>
                <h3 className="text-lg font-semibold mb-2">Get Report & Remedies</h3>
                <p className="text-gray-600">Receive detailed compatibility report with personalized remedies</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center text-mystical-blue mb-12">
              Success Stories
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Priya & Rahul",
                  text: "The astrologer's guidance helped us understand our compatibility perfectly. We're happily married now!",
                  rating: 5
                },
                {
                  name: "Anjali & Vikash", 
                  text: "The detailed Guna Milan analysis gave us confidence in our relationship. Highly recommended!",
                  rating: 5
                },
                {
                  name: "Meera & Arun",
                  text: "Expert remedies helped resolve our Manglik dosha concerns. Thank you for the wonderful service!",
                  rating: 5
                }
              ].map((testimonial, index) => (
                <Card key={index} className="bg-white/90 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-4">"{testimonial.text}"</p>
                    <p className="font-semibold text-mystical-blue">- {testimonial.name}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-pink-600 to-rose-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Find Your Perfect Match?
            </h2>
            <p className="text-xl text-pink-100 mb-8">
              Start your journey to a harmonious marriage with expert Vedic astrology guidance
            </p>
            <Button 
              size="lg" 
              onClick={() => {
                if (!user) {
                  setLocation("/login");
                } else {
                  setLocation("/astrologers?category=marriage");
                }
              }}
              className="bg-white text-pink-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
            >
              Chat with Match Making Expert
              <Heart className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}