import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions - AllVisualizer",
  description: "Read AllVisualizer's Terms and Conditions to understand the rules and guidelines for using our educational visualization platform.",
  openGraph: {
    title: "Terms & Conditions - AllVisualizer",
    description: "Terms of use for AllVisualizer services",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Terms & Conditions</h1>
          <p className="text-xl text-gray-600 mb-12">
            Last updated: November 2, 2025
          </p>

          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Agreement to Terms</h2>
              <p className="text-gray-700 mb-6">
                By accessing or using AllVisualizer ("the Service"), you agree to be bound by these Terms and 
                Conditions ("Terms"). If you disagree with any part of these terms, you may not access the Service.
              </p>

            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Use License</h2>
              <p className="text-gray-700 mb-6">
                Permission is granted to temporarily access and use the materials on AllVisualizer for personal, 
                non-commercial educational purposes. This is the grant of a license, not a transfer of title, 
                and under this license you may not:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose</li>
                <li>Attempt to reverse engineer any software on the Service</li>
                <li>Remove any copyright or proprietary notations from the materials</li>
                <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
              </ul>

            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Educational Purpose</h2>
              <p className="text-gray-700 mb-6">
                AllVisualizer is provided as an educational tool. While we strive for accuracy, we make no 
                warranties or guarantees about the completeness, reliability, or accuracy of the visualizations 
                and educational content provided.
              </p>

            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">User Content and Conduct</h2>
              <p className="text-gray-700 mb-6">
                When using our Service, you agree to:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                <li>Not post content that is illegal, harmful, or offensive</li>
                <li>Not harass, abuse, or harm other users</li>
                <li>Not impersonate others or provide false information</li>
                <li>Not attempt to gain unauthorized access to the Service</li>
                <li>Not use the Service for any illegal or unauthorized purpose</li>
                <li>Respect intellectual property rights</li>
              </ul>

            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Intellectual Property</h2>
              <p className="text-gray-700 mb-6">
                The Service and its original content, features, and functionality are owned by AllVisualizer 
                and are protected by international copyright, trademark, patent, trade secret, and other 
                intellectual property laws.
              </p>

            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Links and Services</h2>
              <p className="text-gray-700 mb-6">
                Our Service may contain links to third-party websites or services that are 
                not owned or controlled by AllVisualizer. We have no control over, and assume no responsibility 
                for, the content, privacy policies, or practices of any third-party websites or services.
              </p>

            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Disclaimer</h2>
              <p className="text-gray-700 mb-6">
                The Service is provided on an "AS IS" and "AS AVAILABLE" basis. AllVisualizer makes no 
                warranties, expressed or implied, and hereby disclaims and negates all other warranties including, 
                without limitation, implied warranties or conditions of merchantability, fitness for a particular 
                purpose, or non-infringement of intellectual property.
              </p>

            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitation of Liability</h2>
              <p className="text-gray-700 mb-6">
                In no event shall AllVisualizer or its suppliers be liable for any damages (including, without 
                limitation, damages for loss of data or profit, or due to business interruption) arising out of 
                the use or inability to use the Service.
              </p>

            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Indemnification</h2>
              <p className="text-gray-700 mb-6">
                You agree to indemnify and hold AllVisualizer and its affiliates harmless from any claim or 
                demand, including reasonable attorneys' fees, made by any third party due to or arising out of 
                your use of the Service, your violation of these Terms, or your violation of any rights of another.
              </p>

            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Termination</h2>
              <p className="text-gray-700 mb-6">
                We may terminate or suspend your access to the Service immediately, without prior notice or 
                liability, for any reason whatsoever, including without limitation if you breach the Terms.
              </p>

            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to Terms</h2>
              <p className="text-gray-700 mb-6">
                We reserve the right to modify or replace these Terms at any time. If a revision is material, 
                we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes 
                a material change will be determined at our sole discretion.
              </p>

            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Governing Law</h2>
              <p className="text-gray-700 mb-6">
                These Terms shall be governed and construed in accordance with applicable laws, without regard 
                to its conflict of law provisions.
              </p>

            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-700 mb-6">
                If you have any questions about these Terms, please contact us at:
              </p>
              <p className="text-gray-700">
                Email: nkcoderz@gmail.com
              </p>

              <div className="border-l-4 border-gray-900 pl-6 mt-8">
                <p className="text-gray-700">
                  <strong>Note:</strong> By using AllVisualizer, you acknowledge that you have read and understood 
                  these Terms and Conditions and agree to be bound by them.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
