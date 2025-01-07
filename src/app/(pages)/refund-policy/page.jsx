import FooterCopyRights from "@/components/Footer/FooterCopyRights";
import Navbar from "@/components/Navbar/Navbar";
import React from "react";

export function generateMetadata() {
  return {
    title: {
      default: "Refund Policy",
      template: "%s | DigiPAKISTAN",
    },
    description:
      "Understand the conditions under which refunds are possible with DigiPAKISTAN. This includes details on eligibility, procedures, and timelines for IT course refunds.",
    metadataBase: new URL("https://DigiPAKISTAN.com/refund-policy"),
    openGraph: {
      title: "Refund Policy of DigiPAKISTAN",
      description:
        "Check our refund guidelines to know how you can be eligible for a refund, and the process to claim it for our IT training programs.",
      url: "https://DigiPAKISTAN.com/refund-policy",
    },
  };
}


const RefundPolicy = () => {
  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen py-12 px-6 sm:px-16 lg:px-32">
        <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg flex flex-col lg:flex-row overflow-hidden">
          {/* Content Section */}
          <div className="lg:w-2/3 p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Refund Policy</h1>
            <p className="text-gray-600 mb-4">
              At <strong>DigiPAKISTAN Program</strong>, we strive to ensure a seamless experience
              for all our participants. This refund policy outlines the terms and conditions under
              which a refund can be requested.
            </p>

            <h2 className="text-2xl font-semibold text-gray-700 mt-6 mb-4">
              1. Eligibility for Refund
            </h2>
            <p className="text-gray-600 mb-4">
              A refund is applicable only under the following circumstances:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-4">
              <li>
                The user has paid for the selected certifications but has not
                received the login credentials for the LMS portal via email or on
                the site.
              </li>
              <li>
                A valid refund request has been submitted with proper evidence, such
                as a payment receipt or communication history.
              </li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-700 mt-6 mb-4">
              2. Refund Process
            </h2>
            <p className="text-gray-600 mb-4">
              If a user meets the refund eligibility criteria, the following steps
              will be taken:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-4">
              <li>
                The refund request, along with the provided evidence, will be
                reviewed by our staff team.
              </li>
              <li>
                Upon successful verification of the evidence, the refund will be
                processed back to the original payment method within 7-14 business
                days.
              </li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-700 mt-6 mb-4">
              3. Non-Refundable Cases
            </h2>
            <p className="text-gray-600 mb-4">
              Refunds will not be granted under the following conditions:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-4">
              <li>
                The user has successfully received the login credentials for the LMS
                portal after payment.
              </li>
              <li>
                The user decides to discontinue the certification after gaining
                access to the LMS portal.
              </li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-700 mt-6 mb-4">
              4. Evidence Requirements
            </h2>
            <p className="text-gray-600 mb-4">
              To request a refund, users must provide the following:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-4">
              <li>
                Proof of payment, such as a transaction receipt or bank statement.
              </li>
              <li>
                Screenshots or emails indicating the non-receipt of login credentials.
              </li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-700 mt-6 mb-4">
              5. Contact Information
            </h2>
            <p className="text-gray-600 mb-4">
              For any refund-related inquiries or to submit a refund request, please
              contact us at <strong>support@DigiPAKISTAN.com</strong>.
            </p>

            
          </div>

          {/* Image Section */}
          <div className="lg:w-1/2 sticky top-[120px] bg-gray-100 flex justify-center p-4">
            <img
              src="/refund.jpg"
              alt="Refund Policy Illustration"
              className="rounded-lg shadow-lg w-full h-[20rem] md:h-[23rem]"
            />
          </div>
        </div>
      </div>
      <FooterCopyRights bg={"bg-primary py-4 text-white"} />
    </>
  );
};

export default RefundPolicy;
