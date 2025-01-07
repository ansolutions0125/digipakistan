import FooterCopyRights from "@/components/Footer/FooterCopyRights";
import Navbar from "@/components/Navbar/Navbar";
import React from "react";

const FeeStructure = () => {
  return (
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen py-12 px-6 sm:px-16 lg:px-32">
        <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg flex flex-col lg:flex-row overflow-hidden">
          {/* Content Section */}
          <div className="lg:w-2/3 p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
              Fee Structure
            </h1>
            <p className="text-gray-600 mb-4">
              The <strong>DigiPAKISTAN Program</strong> is designed to be highly
              accessible for individuals from all walks of life, ensuring there
              are no barriers to gaining globally recognized IT skills. Our fee
              structure is simple and transparent, with no hidden charges.
            </p>

            <h2 className="text-2xl font-semibold text-gray-700 mt-6 mb-4">
              Admission Fee
            </h2>
            <p className="text-gray-600 mb-4">
              Participants are required to pay a one-time{" "}
              <strong>admission fee</strong> of <strong>5,000 PKR</strong>,
              which covers access to the program’s training resources and allows
              selection of up to
              <strong> three certifications</strong> from leading organizations
              such as Google, AWS, Microsoft, and more.
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-4">
              <li>
                <strong>Cost:</strong> 5,000 PKR (one-time fee).
              </li>
              <li>
                <strong>Certifications Included:</strong> Choose up to 3
                certifications as part of your package.
              </li>
              <li>
                <strong>No Tuition Fees:</strong> All training, resources, and
                support are provided at no additional cost.
              </li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-700 mt-6 mb-4">
              Key Benefits
            </h2>
            <ul className="list-disc list-inside text-gray-600 mb-4">
              <li>
                <strong>Globally Recognized Certifications:</strong> Gain
                certifications from top international organizations, enhancing
                your global employability.
              </li>
              <li>
                <strong>Government Support:</strong> The program is backed by
                the Government of Pakistan, ensuring credibility and alignment
                with national skill development goals.
              </li>
              <li>
                <strong>Cost-Effective:</strong> Only a minor admission fee is
                required; there are no additional tuition charges or hidden
                fees.
              </li>
              <li>
                <strong>World-Class Training:</strong> Access high-quality
                learning materials and resources to prepare for certification
                exams.
              </li>
              <li>
                <strong>Networking Opportunities:</strong> Connect with industry
                professionals and peers to expand your career opportunities.
              </li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-700 mt-6 mb-4">
              Why Choose DigiPAKISTAN Program?
            </h2>
            <p className="text-gray-600 mb-4">
              The DigiPAKISTAN Program not only provides training but also
              empowers participants with the tools to succeed in a competitive
              IT industry. Here’s what sets us apart:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-4">
              <li>Training sessions conducted by experienced professionals.</li>
              <li>
                A focus on in-demand certifications in domains like cloud
                computing, cybersecurity, and data analytics.
              </li>
              <li>
                Certification preparation to help participants pass
                international exams with confidence.
              </li>
            </ul>

           
          </div>
        </div>
      </div>
      <FooterCopyRights bg={"bg-primary py-4 text-white"} />
    </>
  );
};

export default FeeStructure;
