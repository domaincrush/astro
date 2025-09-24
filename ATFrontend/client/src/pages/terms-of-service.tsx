import AstroTickHeader from "src/components/layout/AstroTickHeader";
import { ArrowLeft } from "lucide-react";
import { Button } from "src/components/ui/button";
import { useLocation } from "wouter";

export default function TermsOfService() {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Terms of Service
          </h1>

          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Acceptance of Terms
              </h2>
              <p>
                By accessing and using AstroTick's services, you agree to be
                bound by these Terms of Service. If you do not agree to these
                terms, please do not use our platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Service Description
              </h2>
              <p className="mb-4">
                AstroTick provides comprehensive online astrological
                consultation services connecting users with qualified,
                experienced astrologers. Our platform offers:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Real-time chat consultations with certified and verified
                  astrologers
                </li>
                <li>
                  Detailed personalized birth chart analysis and interpretations
                </li>
                <li>Astrological guidance, predictions, and life coaching</li>
                <li>
                  Secure wallet-based payment system with instant recharge
                </li>
                <li>24/7 customer support and technical assistance</li>
                <li>Consultation history and chat transcript access</li>
                <li>
                  Multiple language support (Hindi, English, regional languages)
                </li>
                <li>Various consultation packages and pricing options</li>
              </ul>
              <p className="mt-4 text-sm text-gray-600">
                Our astrologers are carefully vetted professionals with proven
                expertise in Vedic astrology, numerology, palmistry, and related
                spiritual sciences.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                User Responsibilities
              </h2>
              <p className="mb-4">As a user of our platform, you agree to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate and truthful information</li>
                <li>
                  Maintain the confidentiality of your account credentials
                </li>
                <li>Use the service for lawful purposes only</li>
                <li>Respect astrologers and other users</li>
                <li>Not misuse or abuse the platform</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Payment Terms
              </h2>
              <p className="mb-4">
                All payments are processed through secure payment gateways. By
                using our services, you agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Pay all applicable fees for consultations</li>
                <li>Provide valid payment information</li>
                <li>Accept that wallet credits are non-transferable</li>
                <li>
                  Understand that consultation charges are deducted per minute
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Consultation Guidelines
              </h2>
              <p className="mb-4">
                Astrological consultations are provided for entertainment and
                guidance purposes. Please note:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Consultations are based on astrological principles and
                  interpretations
                </li>
                <li>Results and predictions are not guaranteed</li>
                <li>
                  Consultations should not replace professional medical, legal,
                  or financial advice
                </li>
                <li>
                  Users are responsible for their own decisions and actions
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Intellectual Property
              </h2>
              <p>
                All content, trademarks, and intellectual property on AstroTick
                are owned by us or our licensors. Users may not copy, modify, or
                distribute our content without explicit permission.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Privacy and Data Protection
              </h2>
              <p>
                Your privacy is important to us. Our collection and use of
                personal information is governed by our Privacy Policy, which
                forms part of these Terms of Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Limitation of Liability
              </h2>
              <p>
                AstroTick and its astrologers shall not be liable for any
                direct, indirect, incidental, or consequential damages arising
                from the use of our services. Our total liability is limited to
                the amount paid for the specific consultation.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Account Termination
              </h2>
              <p>
                We reserve the right to suspend or terminate accounts that
                violate these terms or engage in inappropriate behavior. Users
                may also delete their accounts at any time.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Dispute Resolution
              </h2>
              <p>
                Any disputes arising from the use of our services shall be
                resolved through arbitration in accordance with Indian law. The
                courts of [Your City] shall have exclusive jurisdiction.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Changes to Terms
              </h2>
              <p>
                We may update these Terms of Service from time to time. Users
                will be notified of significant changes, and continued use of
                the service constitutes acceptance of the updated terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Contact Information
              </h2>
              <p>
                For questions about these Terms of Service, please contact us
                at:
              </p>
              <p className="mt-2">
                Email: Support@astrotick.com
                <br />
                Phone: +91- 88075 56886
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
