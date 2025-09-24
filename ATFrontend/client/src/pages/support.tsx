import { HelpCircle, MessageCircle, Phone, Mail, Clock, Book } from "lucide-react";
import { motion } from "framer-motion";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";

export default function Support() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-orange-50">
      <AstroTickHeader />
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center space-x-3 mb-6"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-red-600 via-pink-500 to-orange-400 rounded-full flex items-center justify-center shadow-lg">
              <HelpCircle className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
              Support Center
            </h1>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed"
          >
            We're here to help you navigate your cosmic journey. Find answers to your questions or reach out to our dedicated support team.
          </motion.p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Get in Touch
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose the method that works best for you. Our support team is ready to assist.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: MessageCircle,
                title: "Live Chat",
                description: "Get instant help from our support team",
                details: "Available 24/7",
                action: "Start Chat",
                color: "from-blue-500 to-cyan-400"
              },
              {
                icon: Mail,
                title: "Email Support",
                description: "Send us your questions and concerns",
                details: "support@astrotick.com",
                action: "Send Email",
                color: "from-green-500 to-emerald-400"
              },
              {
                icon: Phone,
                title: "Phone Support",
                description: "Speak directly with our support team",
                details: "Mon-Fri: 9AM-6PM IST",
                action: "Call Now",
                color: "from-purple-500 to-pink-400"
              }
            ].map((method, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.2 }}
                className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${method.color} rounded-full flex items-center justify-center mb-6`}>
                  <method.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {method.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {method.description}
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  {method.details}
                </p>
                <button className={`w-full bg-gradient-to-r ${method.color} text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all`}>
                  {method.action}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Find quick answers to common questions about our services
            </p>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                question: "How accurate are the birth chart calculations?",
                answer: "Our calculations use the Swiss Ephemeris, the most accurate astronomical data available. This ensures precision comparable to professional astrological software used by experts worldwide."
              },
              {
                question: "Can I get a refund if I'm not satisfied?",
                answer: "Yes, we offer a 30-day money-back guarantee for all paid services. If you're not completely satisfied with your consultation or report, we'll provide a full refund."
              },
              {
                question: "How do I book a consultation with an astrologer?",
                answer: "Simply visit our Astrologers page, browse through available practitioners, and click 'Book Consultation' on your preferred astrologer's profile. You can choose from chat, audio, or video sessions."
              },
              {
                question: "Are my personal details and birth information secure?",
                answer: "Absolutely. We use bank-level encryption to protect all your personal information. Your birth details are stored securely and never shared with third parties without your explicit consent."
              },
              {
                question: "What's the difference between a free and premium report?",
                answer: "Free reports provide basic birth chart information and planetary positions. Premium reports offer detailed analysis, personalized predictions, remedial measures, and comprehensive insights across all life areas."
              },
              {
                question: "Can I reschedule or cancel my consultation?",
                answer: "Yes, you can reschedule or cancel your consultation up to 2 hours before the scheduled time. Cancellations made within 2 hours may incur a small fee."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 + index * 0.1 }}
                className="bg-gray-50 rounded-lg p-6"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Help Resources */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Help Resources
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our comprehensive resources to get the most out of AstroTick
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Book,
                title: "User Guide",
                description: "Step-by-step instructions for using all features",
                link: "/guide"
              },
              {
                icon: HelpCircle,
                title: "Video Tutorials",
                description: "Watch detailed tutorials for better understanding",
                link: "/tutorials"
              },
              {
                icon: MessageCircle,
                title: "Community Forum",
                description: "Connect with other users and share experiences",
                link: "/forum"
              },
              {
                icon: Clock,
                title: "Service Status",
                description: "Check the current status of our services",
                link: "/status"
              },
              {
                icon: Mail,
                title: "Submit Feedback",
                description: "Help us improve by sharing your suggestions",
                link: "/feedback"
              },
              {
                icon: Phone,
                title: "Report Issue",
                description: "Report technical problems or service issues",
                link: "/report"
              }
            ].map((resource, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.8 + index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-orange-400 rounded-full flex items-center justify-center mb-4">
                  <resource.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  {resource.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {resource.description}
                </p>
                <div className="text-red-600 font-medium hover:text-red-700 transition-colors">
                  Learn More →
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 px-4 bg-gradient-to-r from-red-600 via-pink-600 to-orange-600">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Still Need Help?
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Can't find what you're looking for? Send us a message and we'll get back to you as soon as possible.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.2 }}
            className="bg-white rounded-xl shadow-xl p-8"
          >
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="What can we help you with?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Please describe your issue or question in detail..."
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white py-4 px-8 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Send Message
              </button>
            </form>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
}