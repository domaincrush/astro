import AstroTickHeader from "src/components/layout/AstroTickHeader";
import { ArrowLeft } from "lucide-react";
import { Button } from "src/components/ui/button";
import { useLocation } from "wouter";

export default function RefundPolicy() {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Refund Policy</h1>
          
          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Refund Eligibility</h2>
              <p className="mb-4">
                At AstroTick, we strive to provide exceptional astrological consultation experiences. 
                Refunds may be considered under the following circumstances:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Technical issues preventing consultation completion due to platform failures</li>
                <li>Astrologer unavailability after payment confirmation and booking</li>
                <li>Significant service disruption lasting more than 30 minutes</li>
                <li>Billing errors, duplicate charges, or unauthorized transactions</li>
                <li>Consultation cancelled by astrologer within 2 hours of booking</li>
                <li>Platform maintenance issues affecting scheduled consultations</li>
                <li>Payment gateway errors resulting in double charging</li>
              </ul>
              <p className="mt-4 text-sm text-gray-600">
                All refund requests are reviewed within 24 hours and processed based on our fair use policy 
                and the specific circumstances of each case.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Non-Refundable Services</h2>
              <p className="mb-4">The following services are generally not eligible for refunds:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Completed consultations, regardless of satisfaction with predictions</li>
                <li>Partial consultations where service was provided</li>
                <li>Change of mind after consultation begins</li>
                <li>Disagreement with astrological advice or predictions</li>
                <li>Wallet credits older than 365 days</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Refund Process</h2>
              <p className="mb-4">To request a refund, please follow these steps:</p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Contact our support team within 24 hours of the issue</li>
                <li>Provide your consultation ID and detailed reason for refund</li>
                <li>Allow 3-5 business days for review and processing</li>
                <li>Approved refunds will be processed to your original payment method</li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Wallet Credits</h2>
              <p className="mb-4">
                Wallet credits purchased on AstroTick are subject to the following terms:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Credits are valid for 365 days from purchase date</li>
                <li>Unused credits expire and become non-refundable</li>
                <li>Credits are non-transferable between accounts</li>
                <li>Refunds for wallet credits are processed as platform credits, not cash</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Processing Time</h2>
              <p className="mb-4">Refund processing times vary by payment method:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Credit/Debit Cards: 5-7 business days</li>
                <li>Net Banking: 3-5 business days</li>
                <li>UPI/Digital Wallets: 1-3 business days</li>
                <li>Bank transfers may take additional time based on your bank's policy</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Dispute Resolution</h2>
              <p>
                If you're unsatisfied with our refund decision, you may escalate the matter through:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Our customer support escalation process</li>
                <li>Consumer protection forums as applicable</li>
                <li>Payment gateway dispute mechanisms</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Consultation Quality</h2>
              <p>
                While we cannot guarantee specific outcomes from astrological consultations, 
                we ensure that all our astrologers are qualified professionals. If you experience 
                unprofessional behavior or technical issues, please report immediately for 
                potential refund consideration.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Promotional Credits</h2>
              <p>
                Promotional credits, bonuses, and offers are non-refundable and cannot be 
                converted to cash. These credits are provided as courtesy and subject to 
                terms and conditions at the time of the offer.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Contact for Refunds</h2>
              <p>
                For refund requests or questions about this policy, contact us at:
              </p>
              <p className="mt-2">
                Email: refunds@astrotick.com<br />
                Phone: +91-XXXXXXXXXX<br />
                Support Hours: 9:00 AM - 6:00 PM (Monday to Saturday)
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