import AstroTickHeader from "src/components/layout/AstroTickHeader";
import { ArrowLeft } from "lucide-react";
import { Button } from "src/components/ui/button";
import { useLocation } from "wouter";

export default function ShippingPolicy() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      <AstroTickHeader />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => setLocation("/")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Shipping & Delivery Policy</h1>
          
          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Digital Services</h2>
              <p className="mb-4">
                AstroTick primarily provides digital astrological consultation services that are delivered online instantly. 
                Our comprehensive digital services include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Real-time chat consultations with certified astrologers (instant connection)</li>
                <li>Detailed digital birth chart analysis and interpretations</li>
                <li>Comprehensive astrological reports (available immediately post-consultation)</li>
                <li>Personalized predictions and remedies (provided during live sessions)</li>
                <li>Consultation history and chat transcripts (accessible 24/7)</li>
                <li>Digital certificates and reports in PDF format</li>
                <li>Multi-language consultation support</li>
                <li>Mobile and web platform accessibility</li>
              </ul>
              <p className="mt-4 text-sm text-gray-600">
                All digital services are delivered instantly through our secure platform with no shipping delays or geographical restrictions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Service Delivery Timeline</h2>
              <p className="mb-4">Our digital services are delivered as follows:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Live Consultations:</strong> Immediate upon astrologer availability</li>
                <li><strong>Consultation Reports:</strong> Available instantly in your account</li>
                <li><strong>Birth Chart Analysis:</strong> Generated in real-time during consultation</li>
                <li><strong>Follow-up Guidance:</strong> Provided during scheduled sessions</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Physical Products (If Applicable)</h2>
              <p className="mb-4">
                In case we offer physical products like gemstones, rudraksha, or astrological accessories:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Processing Time:</strong> 1-2 business days</li>
                <li><strong>Shipping Time:</strong> 3-7 business days within India</li>
                <li><strong>International Shipping:</strong> 7-15 business days</li>
                <li><strong>Expedited Shipping:</strong> Available for additional charges</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Delivery Locations</h2>
              <p className="mb-4">Our services are available:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Digital Services:</strong> Worldwide (internet connection required)</li>
                <li><strong>Physical Products:</strong> India and select international locations</li>
                <li><strong>Language Support:</strong> Hindi, English, and regional languages</li>
                <li><strong>Time Zone Compatibility:</strong> IST with flexible scheduling</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Consultation Scheduling</h2>
              <p className="mb-4">
                Our consultation delivery system works as follows:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Book consultations based on astrologer availability</li>
                <li>Receive instant confirmation with session details</li>
                <li>Join consultations at scheduled time through our platform</li>
                <li>Access consultation history anytime in your account</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Technical Requirements</h2>
              <p className="mb-4">To receive our services, ensure you have:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Stable internet connection</li>
                <li>Compatible device (smartphone, tablet, or computer)</li>
                <li>Updated web browser or mobile app</li>
                <li>Valid payment method for transactions</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Service Unavailability</h2>
              <p className="mb-4">
                In rare cases of service unavailability due to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Technical maintenance (scheduled notifications provided)</li>
                <li>Astrologer unavailability (alternative options offered)</li>
                <li>System downtime (compensation or rescheduling provided)</li>
                <li>Force majeure events (service restoration prioritized)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Quality Assurance</h2>
              <p>
                We ensure service quality through:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Verified and experienced astrologers</li>
                <li>24/7 technical support</li>
                <li>Service quality monitoring</li>
                <li>Customer feedback integration</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Contact for Delivery Issues</h2>
              <p>
                For questions about service delivery or scheduling, contact us at:
              </p>
              <p className="mt-2">
                Email: support@astrotick.com<br />
                Phone: +91-XXXXXXXXXX<br />
                Live Chat: Available 24/7 on our platform
              </p>
            </section>

            <section>
              <p className="text-sm text-gray-600 mt-8">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}