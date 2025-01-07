import FooterCopyRights from "@/components/Footer/FooterCopyRights";
import Navbar from "@/components/Navbar/Navbar";
import React from "react";

export function generateMetadata() {
  return {
    title: {
      default: "Service Policy",
      template: "%s | DigiPAKISTAN",
    },
    description:
      "Explore the Service Policy of DigiPAKISTAN to understand how we provide IT training services, support, and customer care.",
    metadataBase: new URL("https://DigiPAKISTAN.com/service-policy"),
    openGraph: {
      title: "Service Policy of DigiPAKISTAN",
      description:
        "Our Service Policy outlines the standards and procedures for delivering high-quality IT training and customer support.",
      url: "https://DigiPAKISTAN.com/service-policy",
    },
  };
}


const ServicePolicy = () => {
  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen py-12 px-6 sm:px-16 lg:px-32">
        <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg flex flex-col lg:flex-row overflow-hidden">
          {/* Content Section */}
          <div className="lg:w-2/3 p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
              Service Policy
            </h1>
            <p className="text-gray-600 mb-4">
              Welcome to the <strong>DigiPAKISTAN Program</strong>. By using our
              services, you agree to adhere to the policies outlined below.
              Please review them carefully before using our services.
            </p>

            <h2 className="text-2xl font-semibold text-gray-700 mt-6 mb-4">
              1. Service Availability
            </h2>
            <p className="text-gray-600 mb-4">
              The DigiPAKISTAN Program strives to provide continuous service.
              However, we cannot guarantee uninterrupted access to our services
              due to maintenance or unforeseen issues. We will make efforts to
              minimize downtime.
            </p>

            <h2 className="text-2xl font-semibold text-gray-700 mt-6 mb-4">
              2. Service Usage
            </h2>
            <p className="text-gray-600 mb-4">
              You agree to use the services in a lawful and respectful manner.
              Any misuse of the services, including but not limited to spamming,
              illegal activities, or harmful behavior, will result in immediate
              suspension or termination of access.
            </p>

            <h2 className="text-2xl font-semibold text-gray-700 mt-6 mb-4">
              3. Account Responsibility
            </h2>
            <p className="text-gray-600 mb-4">
              You are responsible for maintaining the security of your account
              information and for all activities conducted under your account.
              Please notify us immediately if you suspect any unauthorized use
              of your account.
            </p>

            <h2 className="text-2xl font-semibold text-gray-700 mt-6 mb-4">
              4. Service Modifications
            </h2>
            <p className="text-gray-600 mb-4">
              DigiPAKISTAN reserves the right to modify or discontinue any of its
              services at any time, with or without notice. We will make
              reasonable efforts to inform you of significant changes to the
              services.
            </p>

            <h2 className="text-2xl font-semibold text-gray-700 mt-6 mb-4">
              5. Refunds and Cancellations
            </h2>
            <p className="text-gray-600 mb-4">
              Services purchased from DigiPAKISTAN are non-refundable unless
              otherwise stated. If you wish to cancel any service, please refer
              to the cancellation policy provided during your transaction.
            </p>

            <h2 className="text-2xl font-semibold text-gray-700 mt-6 mb-4">
              6. User Content
            </h2>
            <p className="text-gray-600 mb-4">
              Any content you submit or upload as part of the DigiPAKISTAN Program
              must comply with our guidelines. You retain ownership of your
              content but grant DigiPAKISTAN a license to use it for the purposes
              of the service.
            </p>

            <h2 className="text-2xl font-semibold text-gray-700 mt-6 mb-4">
              7. Termination of Service
            </h2>
            <p className="text-gray-600 mb-4">
              We reserve the right to terminate or suspend your access to our
              services if you violate any part of this Service Policy. You will
              be notified of the termination and any outstanding obligations.
            </p>

            <h2 className="text-2xl font-semibold text-gray-700 mt-6 mb-4">
              8. Liability Limitation
            </h2>
            <p className="text-gray-600 mb-4">
              DigiPAKISTAN is not responsible for any direct or indirect damages
              resulting from the use or inability to use our services. You use
              our services at your own risk.
            </p>

            <h2 className="text-2xl font-semibold text-gray-700 mt-6 mb-4">
              9. Privacy and Data Protection
            </h2>
            <p className="text-gray-600 mb-4">
              Our Service Policy is subject to the Privacy Policy, which
              outlines how we collect, use, and protect your personal data while
              you use our services.
            </p>

            <h2 className="text-2xl font-semibold text-gray-700 mt-6 mb-4">
              10. Policy Updates
            </h2>
            <p className="text-gray-600 mb-4">
              DigiPAKISTAN reserves the right to update or change this Service
              Policy at any time. Any changes will be communicated, and your
              continued use of the services constitutes acceptance of those
              changes.
            </p>

          </div>

          {/* Image Section */}
          <div className="lg:w-1/2 sticky top-[120px] bg-gray-100 flex justify-center p-4">
            <img
              src="/service-policy.jpg"
              alt="Service Policy Illustration"
              className="rounded-lg shadow-lg w-full h-[27rem]"
            />
          </div>
        </div>
      </div>
      <FooterCopyRights bg={"bg-primary py-4 text-white"} />
    </>
  );
};

export default ServicePolicy;
