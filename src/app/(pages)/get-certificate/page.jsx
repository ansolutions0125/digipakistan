import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";
import PageInfo from "../../../components/PageInfo/PageInfo";
import FAQ from "../../../components/Faq/FAQ";
import { getAllFAQ_Questions, getSiteDetails } from "@/Backend/firebasefunctions";
import GetCertificte from "@/components/GetCertificate/GetCertificte";

export function generateMetadata() {
  return {
    title: {
      default: "Get Certificate",
      template: "%s | digiPakistan",
    },
    description:
      "Find answers to frequently asked questions about the digiPakistan training programs. Get detailed insights on enrollment, certification, costs, and more to help you navigate our IT training with ease.",
    metadataBase: new URL("https://digiPakistan.org/get-certificate"),
    keywords: [
      "digiPakistan FAQs",
      "frequently asked questions digiPakistan",
      "digiPakistan program questions",
      "IT training FAQs",
      "digiPakistan certification queries",
      "questions about IT training",
      "digiPakistan course details",
      "digiPakistan enrollment questions",
      "IT certification FAQs",
      "digiPakistan training support",
      "help with digiPakistan",
      "digiPakistan cost queries",
      "learning at digiPakistan",
      "manage digiPakistan account",
      "IT training assistance",
      "digiPakistan program help",
      "online IT training FAQs",
      "common questions IT certification",
      "digiPakistan class information",
      "access digiPakistan resources",
      "digiPakistan exam preparation help",
      "understanding digiPakistan policies",
      "technical support digiPakistan",
      "registration process digiPakistan",
      "digiPakistan payment questions"
    ],
    openGraph: {
      title: "Get Certificate about digiPakistan | Learn More",
      description:
        "Explore our FAQ page to find quick answers to common questions about our IT certification training programs, helping you make informed decisions.",
      url: "https://digiPakistan.org/get-certificate",
    },
  };
}


const Faq = async () => {
  // const data = await getAllFAQ_Questions();
  // const site_details = await getSiteDetails("siteDetailsId");


  return (
    <>
      <>
        {/* Navbar */}
        <Navbar />

        {/* Page Info */}
        {/* <PageInfo PageName="Get Certificate" /> */}

        {/* FAQ General Questions */}
        <GetCertificte />

        {/* Footer */}
        <Footer />
      </>
    </>
  );
};

export default Faq;
