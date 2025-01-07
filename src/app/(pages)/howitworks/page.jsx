import Navbar from "../../../components/Navbar/Navbar";
import PageInfo from "../../../components/PageInfo/PageInfo";
import Footer from "../../../components/Footer/Footer";
import HowitworksWholeProcess from "../../../components/HowItWorks/HowitworksWholeProcess";
import Head from "next/head";
import { getSiteDetails } from "@/Backend/firebasefunctions";
import { AdmissionProcess } from "@/components/AdmissionProcess/AdmissionProcess";

export function generateMetadata() {
  return {
    title: {
      default: "Admission Process",
      template: "%s | DigiPAKISTAN",
    },
    description:
      "Discover how the DigiPAKISTAN Program works. Learn about the steps involved in enrolling, participating, and earning certifications in our comprehensive IT training courses.",
    metadataBase: new URL("https://DigiPAKISTAN.com/how-it-works"),
    keywords: [
      "DigiPAKISTAN process",
      "how to join DigiPAKISTAN",
      "DigiPAKISTAN enrollment process",
      "IT training steps",
      "earn IT certifications",
      "DigiPAKISTAN training guide",
      "step-by-step IT training",
      "DigiPAKISTAN program steps",
      "learn IT online",
      "online IT certification process",
      "DigiPAKISTAN training sequence",
      "register for DigiPAKISTAN",
      "IT course workflow",
      "comprehensive IT training",
      "how DigiPAKISTAN works",
      "DigiPAKISTAN course registration",
      "online education steps",
      "IT training program guide",
      "enroll in IT courses",
      "IT certification roadmap",
      "online training procedure",
      "DigiPAKISTAN learning path"
    ],
    openGraph: {
      title: "How It Works at DigiPAKISTAN",
      description:
        "Understand the process of how our IT training programs are structured from registration to certification. Get familiar with the user-friendly journey at DigiPAKISTAN.",
      url: "https://DigiPAKISTAN.com/how-it-works",
    },
  };
}

const HowItWorks = async () => {
  const data = await getSiteDetails('siteDetailsId')
  return (
    <>
      {/* Main Content */}

      {/* Navbar */}
      <Navbar />

      {/* Page Info */}
      <PageInfo PageName={"Admission Process: A Complete Guide"} />

      {/* How It Works Process Section */}
      <AdmissionProcess detials={data} />

      {/* Footer */}
      <Footer />
    </>
  );
};

export default HowItWorks;
