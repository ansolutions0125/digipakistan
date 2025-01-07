import Head from "next/head";
import Navbar from "../../../components/Navbar/Navbar";
import PageInfo from "../../../components/PageInfo/PageInfo";
import Footer from "../../../components/Footer/Footer";
import AboutUs from "../../../components/About/AboutUs";
import { getAllVideo } from "@/Backend/firebasefunctions";

export function generateMetadata() {
  return {
    title: {
      default: "About Us",
      template: "%s | DigiPAKISTAN",
    },
    description:
      "Learn about DigiPAKISTAN, a Government of Pakistan-backed initiative offering IT certification training. Discover how we empower individuals with globally recognized skills for a digital future, aligning with international certifications from Google, AWS, Microsoft, and more.",
    metadataBase: new URL("https://DigiPAKISTAN.com"),
    keywords: [
      "about DigiPAKISTAN",
      "DigiPAKISTAN IT certification",
      "government-backed IT training",
      "DigiPAKISTAN program information",
      "online IT education Pakistan",
      "learn IT online with DigiPAKISTAN",
      "international IT certifications Pakistan",
      "Google, AWS, Microsoft certifications",
      "free IT training Pakistan",
      "professional IT training in Pakistan",
      "DigiPAKISTAN training programs",
      "digital transformation with DigiPAKISTAN",
      "IT career advancement with DigiPAKISTAN",
      "comprehensive IT education programs",
      "high-quality IT training Pakistan",
      "government IT training programs",
      "affordable IT certifications Pakistan",
      "international certification preparation Pakistan",
      "DigiPAKISTAN digital skills",
      "Pakistan IT development programs",
      "DigiPAKISTAN global IT skills initiative",
      "career opportunities in IT Pakistan",
      "Government of Pakistan IT training",
      "DigiPAKISTAN certification value",
      "DigiPAKISTAN mission and vision",
      "DigiPAKISTAN program benefits",
      "IT skills development Pakistan",
      "expanding digital literacy in Pakistan",
      "empowering IT professionals Pakistan",
    ],
    openGraph: {
      title: "About DigiPAKISTAN | Empowering IT Professionals",
      description:
        "Discover DigiPAKISTAN, a pioneering IT certification program supported by the Government of Pakistan. Gain insight into our mission to enhance employability and foster digital transformation through world-class IT training.",
      url: "https://DigiPAKISTAN.com/about",
      type: "website",
      images: [
        {
          url: "/about-banner.jpg", // Change to an appropriate path for a banner image about the program
          width: 1200,
          height: 630,
          alt: "About DigiPAKISTAN Program Banner",
        },
      ],
      locale: "en_US",
    },
  };
}


const About = async () => {
  // const { data } = await getAllVideo();
  // const aboutShowingVideo = data[0];

  return (
    <>

      {/* Navbar */}
      <Navbar />

      {/* Page Info */}
      <PageInfo PageName="About" />

      {/* About Us Section */}
      <AboutUs />

      {/* Courses Bundle Section */}
      {/* <CoursesBundle /> */}

      {/* Upcoming Events Section */}
      {/* <UpComingEvents /> */}

      {/* Footer */}
      <Footer />
    </>
  );
};

export default About;
