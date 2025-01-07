import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer/Footer";
import PageInfo from "../../../components/PageInfo/PageInfo";
import FAQ from "../../../components/Faq/FAQ";
import { getAllFAQ_Questions, getSiteDetails } from "@/Backend/firebasefunctions";

export function generateMetadata() {
  return {
    title: {
      default: "FAQ",
      template: "%s | DigiPAKISTAN",
    },
    description:
      "Find answers to frequently asked questions about the DigiPAKISTAN training programs. Get detailed insights on enrollment, certification, costs, and more to help you navigate our IT training with ease.",
    metadataBase: new URL("https://DigiPAKISTAN.com/faq"),
    keywords: [
      "DigiPAKISTAN FAQs",
      "frequently asked questions DigiPAKISTAN",
      "DigiPAKISTAN program questions",
      "IT training FAQs",
      "DigiPAKISTAN certification queries",
      "questions about IT training",
      "DigiPAKISTAN course details",
      "DigiPAKISTAN enrollment questions",
      "IT certification FAQs",
      "DigiPAKISTAN training support",
      "help with DigiPAKISTAN",
      "DigiPAKISTAN cost queries",
      "learning at DigiPAKISTAN",
      "manage DigiPAKISTAN account",
      "IT training assistance",
      "DigiPAKISTAN program help",
      "online IT training FAQs",
      "common questions IT certification",
      "DigiPAKISTAN class information",
      "access DigiPAKISTAN resources",
      "DigiPAKISTAN exam preparation help",
      "understanding DigiPAKISTAN policies",
      "technical support DigiPAKISTAN",
      "registration process DigiPAKISTAN",
      "DigiPAKISTAN payment questions"
    ],
    openGraph: {
      title: "FAQs about DigiPAKISTAN | Learn More",
      description:
        "Explore our FAQ page to find quick answers to common questions about our IT certification training programs, helping you make informed decisions.",
      url: "https://DigiPAKISTAN.com/faq",
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
        <PageInfo PageName="FAQ" />

        {/* FAQ General Questions */}
        <FAQ />

        {/* Footer */}
        <Footer />
      </>
    </>
  );
};

export default Faq;
