import FooterCopyRights from "@/components/Footer/FooterCopyRights";
import Navbar from "@/components/Navbar/Navbar";
import React from "react";

export function generateMetadata() {
  return {
    title: {
      default: "Shipping Policy",
      template: "%s | DigiPAKISTAN",
    },
    description:
      "Find out how DigiPAKISTAN handles the shipping of any physical products related to our IT training courses, including books, hardware, and other materials.",
    metadataBase: new URL("https://DigiPAKISTAN.com/shipping-policy"),
    openGraph: {
      title: "Shipping Policy of DigiPAKISTAN",
      description:
        "Learn about our shipping methods, costs, and delivery times for educational materials and IT training equipment from DigiPAKISTAN.",
      url: "https://DigiPAKISTAN.com/shipping-policy",
    },
  };
}


const ShippingPolicy = () => {
  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen py-12 px-6 sm:px-16 lg:px-32">
        <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg flex flex-col lg:flex-row overflow-hidden">
          {/* Content Section */}
          <div className="lg:w-2/3 p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
              Shipping Policy
            </h1>
            <p className="text-gray-600 mb-4">
              At <strong>DigiPAKISTAN Program</strong>, we aim to deliver a
              seamless onboarding experience for our users. This shipping policy
              outlines the process of granting access to our Learning Management
              System (LMS) portal after successful payment.
            </p>

            <h2 className="text-2xl font-semibold text-gray-700 mt-6 mb-4">
              1. Access to LMS Portal
            </h2>
            <p className="text-gray-600 mb-4">
              Upon successful payment for the selected certifications, users
              will be granted access to the LMS portal. This includes:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-4">
              <li>
                Email delivery of LMS portal login credentials to the registered
                email address provided during registration.
              </li>
              <li>
                Access to the certification course materials and resources
                immediately upon receiving the credentials.
              </li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-700 mt-6 mb-4">
              2. Timeline for LMS Access
            </h2>
            <p className="text-gray-600 mb-4">
              Once payment is confirmed, users can expect the following timeline
              for LMS portal access:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-4">
              <li>
                Login credentials will be sent via email within{" "}
                <strong>24-48 hours</strong> of payment confirmation.
              </li>
              <li>
                In case of delays, users are encouraged to contact our support
                team for assistance.
              </li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-700 mt-6 mb-4">
              3. Responsibilities of the User
            </h2>
            <p className="text-gray-600 mb-4">
              Users are responsible for ensuring the accuracy of the information
              provided during registration, including:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-4">
              <li>
                Providing a valid and active email address for communication.
              </li>
              <li>
                Checking their spam or junk folder if credentials are not
                received.
              </li>
              <li>
                Contacting our support team immediately if login credentials are
                not received within the specified timeframe.
              </li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-700 mt-6 mb-4">
              4. Support for Access Issues
            </h2>
            <p className="text-gray-600 mb-4">
              If users experience issues accessing the LMS portal, they can
              reach out to our support team for assistance. Our team will ensure
              prompt resolution of the issue.
            </p>

            <h2 className="text-2xl font-semibold text-gray-700 mt-6 mb-4">
              5. Contact Information
            </h2>
            <p className="text-gray-600 mb-4">
              For inquiries related to LMS portal access, please contact us at{" "}
              <strong>support@DigiPAKISTAN.com</strong>.
            </p>
          </div>
        </div>
      </div>
      <FooterCopyRights bg={"bg-primary py-4 text-white"} />
    </>
  );
};

export default ShippingPolicy;
