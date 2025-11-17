import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - AllVisualizer",
  description: "Read AllVisualizer's Privacy Policy to understand how we collect, use, and protect your personal information when you use our services.",
  openGraph: {
    title: "Privacy Policy - AllVisualizer",
    description: "How we protect your privacy and data",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-xl text-gray-600 mb-12">
            Last updated: November 2, 2025
          </p>

          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
              <p className="text-gray-700 mb-6">
                Welcome to AllVisualizer ("we," "our," or "us"). We are committed to protecting your privacy 
                and ensuring you have a positive experience on our website. This Privacy Policy explains how 
                we collect, use, disclose, and safeguard your information when you visit our website 
                allvisualizer.com.
              </p>

            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h3>
              <p className="text-gray-700 mb-6">
                We may collect personal information that you voluntarily provide to us when you:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                <li>Contact us through our contact form</li>
                <li>Join our Discord community</li>
                <li>Subscribe to our newsletter (if applicable)</li>
                <li>Participate in surveys or feedback forms</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">Automatically Collected Information</h3>
              <p className="text-gray-700 mb-6">
                When you visit our website, we may automatically collect certain information about your device, 
                including:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                <li>IP address</li>
                <li>Browser type and version</li>
                <li>Operating system</li>
                <li>Pages visited and time spent on pages</li>
                <li>Referring website addresses</li>
              </ul>

            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
              <p className="text-gray-700 mb-6">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                <li>Provide, operate, and maintain our website</li>
                <li>Improve, personalize, and expand our services</li>
                <li>Understand and analyze how you use our website</li>
                <li>Develop new features and functionality</li>
                <li>Communicate with you, including for customer service and support</li>
                <li>Send you updates and marketing communications (with your consent)</li>
                <li>Detect and prevent fraud and abuse</li>
              </ul>

            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Disclosure of Your Information</h2>
              <p className="text-gray-700 mb-6">
                We may share your information in the following situations:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                <li>With service providers who assist us in operating our website</li>
                <li>To comply with legal obligations</li>
                <li>To protect and defend our rights and property</li>
                <li>With your consent or at your direction</li>
              </ul>

            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Services</h2>
              <p className="text-gray-700 mb-6">
                Our website may contain links to third-party websites and services, including Discord. 
                Please note that we are not responsible for the privacy practices of these third parties. 
                We encourage you to read their privacy policies.
              </p>

            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
              <p className="text-gray-700 mb-6">
                We implement appropriate technical and organizational security measures to protect your 
                personal information. However, no method of transmission over the Internet or electronic 
                storage is 100% secure.
              </p>

            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
              <p className="text-gray-700 mb-6">
                Depending on your location, you may have certain rights regarding your personal information, 
                including:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                <li>The right to access your personal information</li>
                <li>The right to correct inaccurate information</li>
                <li>The right to delete your personal information</li>
                <li>The right to restrict or object to processing</li>
                <li>The right to data portability</li>
              </ul>

            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Children's Privacy</h2>
              <p className="text-gray-700 mb-6">
                Our services are not directed to children under the age of 13. We do not knowingly collect 
                personal information from children under 13. If you believe we have collected information 
                from a child under 13, please contact us.
              </p>

            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Privacy Policy</h2>
              <p className="text-gray-700 mb-6">
                We may update this Privacy Policy from time to time. We will notify you of any changes by 
                posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>

            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-700 mb-6">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <p className="text-gray-700">
                Email: nkcoderz@gmail.com
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
