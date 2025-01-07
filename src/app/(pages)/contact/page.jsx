import Navbar from "../../../components/Navbar/Navbar";
import PageInfo from "../../../components/PageInfo/PageInfo";
import Footer from "../../../components/Footer/Footer";
import ContactUs from "../../../components/ContactUs/ContactUs";
import Map from "../../../components/Map/Map";
import { getSiteDetails } from "@/Backend/firebasefunctions";

export function generateMetadata() {
  return {
    title: {
      default: "Contact Us",
      template: "%s | digiPakistan",
    },
    description:
      "Reach out to digiPakistan for more information on our IT certification courses and training programs. Get in touch with our support team for assistance or inquiries related to your IT career development. We're here to help you succeed in the digital age.",
    metadataBase: new URL("https://digiPakistan.com"),
    keywords: [
      "contact digiPakistan",
      "digiPakistan support",
      "digiPakistan contact information",
      "get in touch with digiPakistan",
      "digiPakistan help desk",
      "digiPakistan customer service",
      "IT training support",
      "digiPakistan email address",
      "digiPakistan phone number",
      "IT certification queries",
      "professional IT help",
      "digiPakistan office locations",
      "digiPakistan IT guidance",
      "online IT course support",
      "Government IT training contact",
      "IT career assistance digiPakistan",
      "digiPakistan training program contact",
      "Pakistan IT education support",
      "IT training inquiries",
      "digital skills training contact",
      "reach digiPakistan support",
      "digiPakistan international certifications support",
      "communicate with digiPakistan",
      "digiPakistan program questions",
      "digiPakistan enrollment help",
      "Certification process assistance",
      "Tech training help Pakistan",
      "digiPakistan certification help",
      "Government-backed IT support",
      "contact IT training provider Pakistan",
      "digiPakistan technical support",
      "digiPakistan query resolution",
    ],
    openGraph: {
      title: "Contact digiPakistan | We're Here to Help",
      description:
        "Need assistance with your IT certification journey? Contact digiPakistan today for support and guidance on how to advance your IT career with our comprehensive training programs.",
      url: "https://digiPakistan.org/contact",
      type: "website",
      images: [
        {
          url: "/contact-banner.jpg", // Ensure you have a relevant banner for the contact page
          width: 1200,
          height: 630,
          alt: "Contact digiPakistan Team",
        },
      ],
      locale: "en_US",
    },
  };
}


const Contact = async () => {
  // const data = await getSiteDetails("siteDetailsId");
  return (
    <>
      <Navbar />
      <ContactUs/>
      <Footer />
    </>
  );
};

export default Contact;
