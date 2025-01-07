import FooterCopyRights from "@/components/Footer/FooterCopyRights";
import Navbar from "@/components/Navbar/Navbar";
import React from "react";

export function generateMetadata() {
  return {
    title: {
      default: "Privacy Policy",
      template: "%s | DigiPAKISTAN",
    },
    description:
      "Read our Privacy Policy to understand how DigiPAKISTAN collects, uses, and protects your personal information when you use our website and services.",
    metadataBase: new URL("https://DigiPAKISTAN.com/privacy-policy"),
    openGraph: {
      title: "Privacy Policy of DigiPAKISTAN",
      description:
        "Our Privacy Policy ensures your personal information is secure. Learn how we handle data privacy and protection at DigiPAKISTAN.",
      url: "https://DigiPAKISTAN.com/privacy-policy",
    },
  };
}


const PrivacyPolicy = () => {
  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen py-12 px-6 sm:px-16 lg:px-32">
        <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg flex flex-col lg:flex-row overflow-hidden">
          {/* Content Section */}
          <div className="lg:w-2/3 p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
              Privacy Policy
            </h1>
            <p className="text-gray-600 mb-4">
              Welcome to the <strong>DigiPAKISTAN Program</strong>. This privacy
              policy outlines how we collect, use, and protect your personal
              information in connection with your participation in our program.
            </p>

            <h2 className="text-2xl font-semibold text-gray-700 mt-6 mb-4">
              Information Collection
            </h2>
            <p className="text-gray-600 mb-4">
              As part of the registration process, we may collect personal
              information such as your name, email address, contact number, and
              other relevant details. This information is essential for
              enrollment and program facilitation.
            </p>

            <h2 className="text-2xl font-semibold text-gray-700 mt-6 mb-4">
              Usage of Information
            </h2>
            <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
              <li>
                Facilitate your training under the DigiPAKISTAN Program and track
                your progress.
              </li>
              <li>
                Enable communication regarding program updates, exam
                preparation, and certifications.
              </li>
              <li>
                Share insights about affiliated organizations (Google, AWS,
                Microsoft, etc.) and access their learning resources.
              </li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-700 mt-6 mb-4">
              Data Protection
            </h2>
            <p className="text-gray-600 mb-4">
              Your personal data is stored securely and is accessible only to
              authorized personnel. We follow strict measures to prevent
              unauthorized access, data breaches, or misuse of your information.
            </p>

            <h2 className="text-2xl font-semibold text-gray-700 mt-6 mb-4">
              Sharing of Information
            </h2>
            <p className="text-gray-600 mb-4">
              We may share your information with affiliated organizations (e.g.,
              Google, AWS) for certification purposes. We do not sell or
              disclose your personal data to third parties without your consent.
            </p>

            <h2 className="text-2xl font-semibold text-gray-700 mt-6 mb-4">
              Your Rights
            </h2>
            <p className="text-gray-600 mb-4">
              You have the right to access, update, or request deletion of your
              personal information. For any concerns or inquiries, please
              contact our support team.
            </p>

            <h2 className="text-2xl font-semibold text-gray-700 mt-6 mb-4">
              Program Affiliation
            </h2>
            <p className="text-gray-600 mb-4">
              The DigiPAKISTAN Program is supported by the Government of Pakistan
              and is aligned with its national skill development goals. By
              participating, you agree to the terms outlined in this policy.
            </p>

          </div>

          {/* Image Section */}
          <div className="lg:w-1/2 sticky top-[120px] bg-gray-100 flex justify-center p-4">
            <img
              src="/privacy-policy.png"
              alt="DigiPAKISTAN Program Illustration"
              className="rounded-lg shadow-lg w-full h-[25rem] md:h-[30rem]"
            />
          </div>
        </div>
      </div>
      <FooterCopyRights bg={"bg-primary py-4 text-white"} />
    </>
  );
};

export default PrivacyPolicy;
