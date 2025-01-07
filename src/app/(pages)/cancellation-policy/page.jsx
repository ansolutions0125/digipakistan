import FooterCopyRights from "@/components/Footer/FooterCopyRights";
import Navbar from "@/components/Navbar/Navbar";
import React from "react";

export function generateMetadata() {
  return {
    title: {
      default: "Cancellation Policy",
      template: "%s | DigiPakistan",
    },
    description:
      "Learn about the Cancellation Policy at DigiPakistan, including how to cancel your enrollment in any IT training program and any potential penalties.",
    metadataBase: new URL("https://DigiPakistan.com/cancellation-policy"),
    openGraph: {
      title: "Cancellation Policy of DigiPakistan",
      description:
        "Review the terms for canceling your IT course registrations and any fees involved. Ensure you understand your options and obligations with DigiPakistan.",
      url: "https://DigiPakistan.com/cancellation-policy",
    },
  };
}


const CancellationPolicy = () => {
  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen py-12 px-6 sm:px-16 lg:px-32">
        <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg flex flex-col lg:flex-row overflow-hidden">
          {/* Content Section */}
          <div className="lg:w-2/3 p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
              Cancellation Policy
            </h1>
            <p className="text-gray-600 mb-4">
              At <strong>DigiPakistan Program</strong>, we are committed to
              ensuring a fair and transparent registration process. This
              cancellation policy outlines the conditions under which
              registration applications may be rejected or restricted.
            </p>

            <h2 className="text-2xl font-semibold text-gray-700 mt-6 mb-4">
              1. Application Review Process
            </h2>
            <p className="text-gray-600 mb-4">
              After completing the registration process, all applications are
              reviewed by our staff team to ensure the accuracy and validity of
              the information provided. This includes verifying:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-4">
              <li>
                Full name, contact details, and other personal information.
              </li>
              <li>
                Correct selection of certifications and associated details.
              </li>
              <li>Compliance with our terms and conditions.</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-700 mt-6 mb-4">
              2. Grounds for Rejection
            </h2>
            <p className="text-gray-600 mb-4">
              A registration application may be rejected under the following
              circumstances:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-4">
              <li>
                Submission of invalid, incomplete, or misleading information.
              </li>
              <li>
                Use of random or inappropriate data that does not meet the
                registration requirements.
              </li>
            </ul>
            <p className="text-gray-600 mb-4">
              If your application is rejected, you will receive a notification
              detailing the reason for rejection via email.
            </p>

            <h2 className="text-2xl font-semibold text-gray-700 mt-6 mb-4">
              3. Restriction Period
            </h2>
            <p className="text-gray-600 mb-4">
              Following a rejected application, the user will be restricted from
              registering again for a period of <strong>2 months</strong>. This
              restriction is implemented to ensure a fair process for all users
              and to encourage the submission of accurate information.
            </p>

            <h2 className="text-2xl font-semibold text-gray-700 mt-6 mb-4">
              4. Re-application Guidelines
            </h2>
            <p className="text-gray-600 mb-4">
              After the restriction period ends, users may re-apply for
              registration by ensuring:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-4">
              <li>All information provided is accurate and complete.</li>
              <li>
                Compliance with any specific guidelines outlined in the
                rejection notification.
              </li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-700 mt-6 mb-4">
              5. Appeals and Support
            </h2>
            <p className="text-gray-600 mb-4">
              If you believe your application was rejected in error, you may
              contact our support team at <strong>support@DigiPakistan.com</strong>{" "}
              to request a review. Please include relevant evidence and details
              to support your appeal.
            </p>

            <p className="text-gray-600 mt-8">
              <em>Last Updated: 4 December 2024</em>
            </p>
          </div>
        </div>
      </div>
      <FooterCopyRights bg={"bg-primary py-4 text-white"} />
    </>
  );
};

export default CancellationPolicy;
