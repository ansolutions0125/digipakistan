import React from "react";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import PageInfo from "@/components/PageInfo/PageInfo";
import {
  getAllCertificationCategoryes,
  getAllCourses,
} from "@/Backend/firebasefunctions";
import FastTrackNonTechnicalPrograms from "@/components/Courses/FastTrackNonTechnicalPrograms";
import AssociateCertificationPrograms from "@/components/Courses/AssociateCertificateProgram";
 
export function generateMetadata()
{
  return {
    title: {
      default: "Courses",
      template: "%s | DigiPAKISTAN",
    },
    description:
      "Browse DigiPAKISTAN' extensive range of IT certification courses. Learn in-demand skills, prepare for international certifications, and accelerate your career with globally recognized training programs from organizations like Google, AWS, Microsoft, Cisco, and more. Empower yourself for the future of IT.",
    metadataBase: new URL("https://DigiPAKISTAN.com"),
    keywords: [
      "DigiPAKISTAN courses",
      "DigiPAKISTAN program",
      "online IT courses Pakistan",
      "IT certification courses",
      "AWS training",
      "Microsoft certification courses",
      "Google IT courses",
      "Cisco IT training",
      "Red Hat certification training",
      "CompTIA courses",
      "ISACA certification Pakistan",
      "ISC² cybersecurity training",
      "free IT courses Pakistan",
      "learn IT online",
      "certification preparation programs",
      "professional IT training",
      "global IT certifications",
      "IT career advancement courses",
      "free tech training",
      "online education IT Pakistan",
      "technology courses online",
      "government IT training program",
      "DigiPAKISTAN IT education",
      "skill development IT Pakistan",
      "career in IT",
      "cybersecurity certification courses",
      "cloud computing training Pakistan",
      "digital skills education",
      "AWS courses Pakistan",
      "Red Hat enterprise certification",
      "IT professional certifications",
      "online training programs Pakistan",
      "IT certifications preparation",
      "certification courses Pakistan",
      "learn IT for free",
      "free online IT courses",
      "best IT courses Pakistan",
      "Google cloud training",
      "Microsoft Azure courses",
      "AWS certification courses",
      "cybersecurity training Pakistan",
      "IT training initiatives",
      "certifications for IT professionals",
      "Pakistan IT education platform",
      "DigiPAKISTAN platform benefits",
      "online IT career programs",
      "free DigiPAKISTAN courses",
      "digital economy skills",
      "machine learning training",
      "data analytics certification",
      "artificial intelligence training",
      "blockchain courses Pakistan",
      "IoT (Internet of Things) courses",
      "virtualization certifications",
      "Python programming training",
      "JavaScript developer courses",
      "ReactJS online courses",
      "Node.js developer courses",
      "software engineering certifications",
      "web development courses Pakistan",
      "freelancing skills courses",
      "E-commerce training programs",
      "SEO and digital marketing courses",
      "online career growth Pakistan",
      "database management courses",
      "DevOps engineer training",
      "ethical hacking certifications",
      "Linux server administration courses",
      "cloud engineering training",
      "Azure DevOps certification",
      "data science courses Pakistan",
      "big data certifications",
      "mobile app development training",
      "UX/UI design certifications",
      "creative design courses online",
      "video editing courses Pakistan",
      "content creation certifications",
      "Google Ads training Pakistan",
      "digital transformation programs",
      "business process automation courses",
      "DigiPAKISTAN advanced courses",
      "online job readiness Pakistan",
      "upskilling for IT professionals",
      "AI and ML training programs",
      "AI-based automation training",
      "power BI training Pakistan",
      "tech skills for beginners",
      "online project management courses",
      "Scrum master certifications",
      "Kanban methodology courses",
      "remote work skills training",
      "online IT workshops Pakistan",
      "free online skills programs",
      "online bootcamp Pakistan",
      "web developer certifications",
      "programming languages tutorials",
      "IT management training Pakistan",
      "cloud technology certifications",
      "Microsoft Teams training",
      "cybersecurity bootcamp Pakistan",
      "ethical hacking training online",
      "entry-level IT courses Pakistan",
      "network engineering certifications",
      "AWS cloud computing program",
      "hands-on IT training Pakistan",
      "online learning DigiPAKISTAN",
      "coding for kids programs",
      "advanced IT skill programs",
      "IT troubleshooting courses",
      "database administrator training",
      "SQL courses Pakistan",
      "project-based IT courses",
      "online tech education Pakistan",
      "next-gen IT skills",
      "IT certifications bootcamp",
      "video editing tools training",
      "content marketing skills",
      "machine learning fundamentals",
      "digital workspace tools training",
      "IT support specialist courses",
      "online coding challenges",
      "entrepreneurship IT programs",
      "DigiPAKISTAN certification value",
      "Pakistan's top IT courses",
      "top programming languages training",
      "coding bootcamp Pakistan",
      "learning management system training",
      "web application development",
      "advanced Python certification",
      "AWS cloud practitioner training",
      "full-stack development courses",
      "data security certifications",
      "financial tech skills training",
      "cyber defense programs",
      "online education benefits Pakistan",
      "tech-enabled career growth",
      "remote IT training Pakistan",
      "career guidance IT programs",
      "professional development IT",
      "software testing certifications",
      "SaaS business skills training",
      "emerging technologies training",
      "data visualization courses",
      "ethical technology skills",
      "open-source software skills",
      "blockchain and fintech programs",
      "cloud architect training",
      "online course benefits DigiPAKISTAN",
      "AWS DevOps engineering programs",
      "online software development",
      "IT education platform DigiPAKISTAN",
      "digital marketing expertise courses",
      "cybersecurity analyst training",
      "upcoming IT trends training",
      "programming bootcamp Pakistan",
      "AWS specialty certifications",
      "DigiPAKISTAN for professionals",
      "DigiPAKISTAN IT training program",
      "Government-supported IT courses",
      "Pakistan digital transformation initiative",
      "DigiPAKISTAN certification program",
      "Free IT training in Pakistan",
      "IT skills development Pakistan",
      "DigiPAKISTAN international certification preparation",
      "Comprehensive IT certification program",
      "Government-backed IT certifications",
      "DigiPAKISTAN employability enhancement",
      "Google certification training Pakistan",
      "AWS certification preparation DigiPAKISTAN",
      "Microsoft certification courses DigiPAKISTAN",
      "ISACA certification Pakistan free training",
      "ISC² cybersecurity training Pakistan",
      "CompTIA certification training initiative",
      "Cisco certification preparation DigiPAKISTAN",
      "Red Hat certification training Pakistan",
      "DigiPAKISTAN global IT skills",
      "IT skills bridging program Pakistan",
      "Digital transformation IT initiative Pakistan",
      "DigiPAKISTAN free IT training program",
      "Government of Pakistan IT training",
      "World-class IT training Pakistan",
      "Globally recognized IT certifications Pakistan",
      "DigiPAKISTAN certification of achievement",
      "High-quality IT training Pakistan",
      "Affordable IT certification courses Pakistan",
      "International certification exam preparation",
      "DigiPAKISTAN Google certification program",
      "AWS training initiative DigiPAKISTAN",
      "Microsoft training courses Pakistan",
      "Cybersecurity training by DigiPAKISTAN",
      "CompTIA free certification courses Pakistan",
      "Red Hat enterprise training Pakistan",
      "Google IT skills training Pakistan",
      "AWS cloud skills training Pakistan",
      "Microsoft Azure skills development",
      "ISC² cybersecurity skills training",
      "Professional IT certifications Pakistan",
      "DigiPAKISTAN job readiness program",
      "National IT skill-building program",
      "Free online IT certification Pakistan",
      "IT professional development Pakistan",
      "DigiPAKISTAN affiliate organizations",
      "DigiPAKISTAN digital economy skills",
      "Top IT certifications Pakistan",
      "Pakistan government skill initiative",
      "Skill gap bridging IT program Pakistan",
      "Career-ready IT certifications Pakistan",
    ],
    openGraph: {
      title: "Explore IT Certification Courses",
      description:
        "Browse DigiPAKISTAN' extensive range of IT certification courses. Learn in-demand skills, prepare for international certifications, and accelerate your career with globally recognized training programs from organizations like Google, AWS, Microsoft, Cisco, and more.",
      url: "https://DigiPAKISTAN.com/favicon.ico",
      type: "website",
      images: [
        {
          url: "/favicon.ico",
          width: 800,
          height: 600,
          alt: "DigiPAKISTAN Courses Banner",
        },
      ],
      locale: "en_US",
    },
  };
}

const FastTrackNonTechnicalProgram = async () => {
//   const data = await getAllCourses();
//   const certifications = await getAllCertificationCategoryes();
  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Page Info */}
      <PageInfo PageName="Associate Certification Programs (6 Months)" pageDescription="A continuously evolving stack of Information Technology Programs consoling the latest technologies are available at DigiPAKISTAN and all you have to do is to enrol yourself in your desired course." />
      {/* All Courses */}
      <main className="p-6 min-h-screen">
        {/* <AllCourses certifications={certifications} courses={data.data} /> */}
        <AssociateCertificationPrograms/>
      </main>
      <Footer />
    </>
  );
};

export default FastTrackNonTechnicalProgram;