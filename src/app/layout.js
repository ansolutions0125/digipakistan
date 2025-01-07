import localFont from "next/font/local";
import "./globals.css";
import { Albert_Sans } from "next/font/google";
import LoadingWrapper from "./LandingWarpper"; // Import the new component
import { cookies } from "next/headers";
import CryptoJS from "crypto-js";
import useAuthStore from "@/stores/authStore";
import Context from "../../context/context";

const font = Albert_Sans({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-albert-sans",
});

export const metadata = {
  title: {
    default: "DigiPAKISTAN Training Program",
    template: "%s | DigiPAKISTAN Training Program",
  },
  
  description:
    "The DigiPAKISTAN Program is a Government of Pakistan-supported IT training initiative that empowers individuals with globally recognized IT certifications. Offering free, high-quality training for certifications like Google, AWS, Microsoft, and Cisco, DigiPAKISTAN bridges the IT skills gap and enhances employability across Pakistan.",
  metadataBase: new URL("https://DigiPAKISTAN.com"),
  keywords: [
    "DigiPAKISTAN IT training",
    "free IT courses Pakistan",
    "international IT certifications",
    "AWS certification Pakistan",
    "Google IT training Pakistan",
    "Microsoft certification training",
    "Cisco certification program",
    "Red Hat certification training",
    "CompTIA IT training",
    "ISACA certification Pakistan",
    "ISC² cybersecurity training",
    "Pakistan government IT training",
    "free IT training programs",
    "digital skills Pakistan",
    "IT skill development Pakistan",
    "global IT certifications",
    "career in information technology",
    "online IT courses",
    "certification preparation courses",
    "free IT certifications Pakistan",
    "IT career Pakistan",
    "government-supported IT programs",
    "skill development Pakistan",
    "DigiPAKISTAN admission",
    "free tech training",
    "IT certifications Pakistan",
    "learn IT skills online",
    "professional IT training",
    "digital transformation Pakistan",
    "globally recognized IT skills",
    "AWS courses free",
    "Microsoft Azure training Pakistan",
    "Red Hat enterprise certification",
    "IT skills Pakistan",
    "IT sector jobs Pakistan",
    "DigiPAKISTAN certificate",
    "AWS cloud certification",
    "cybersecurity certification training",
    "IT training and development",
    "online IT courses free",
    "IT certification exams Pakistan",
    "DigiPAKISTAN government program",
    "advanced IT training",
    "professional certifications Pakistan",
    "free IT skills Pakistan",
    "IT education platform",
    "AWS IT skills training",
    "Google certifications free",
    "IT professional certifications Pakistan",
    "certification programs online",
    "global certification training",
    "digital IT skills Pakistan",
    "technology education Pakistan",
    "learn IT for free",
    "free tech certifications",
    "information technology courses",
    "IT education Pakistan",
    "certified IT professional",
    "AWS cloud skills training",
    "Google tech skills Pakistan",
    "Microsoft cloud certification",
    "cybersecurity education Pakistan",
    "government IT skills training",
    "career-ready IT training",
    "free IT skills development",
    "online IT skills Pakistan",
    "IT training initiative Pakistan",
    "government tech training Pakistan",
    "AWS free training Pakistan",
    "professional IT skills development",
    "international IT training Pakistan",
    "IT career advancement Pakistan",
    "DigiPAKISTAN",
    "DigiPAKISTAN training",
    "government free training Pakistan",
    "IT skill enhancement",
    "global IT certifications Pakistan",
    "digital certification Pakistan",
    "Google cloud training Pakistan",
    "AWS skill certification",
    "Microsoft office training",
    "coding skills Pakistan",
    "Python training Pakistan",
    "Java programming training",
    "data analytics certification",
    "AI and ML certification Pakistan",
    "AWS beginner training",
    "Google certification scholarships",
    "cybersecurity training free",
    "information technology career path",
    "cloud computing certifications",
    "Microsoft training for beginners",
    "free AWS certification resources",
    "AWS skills Pakistan free",
    "CompTIA certifications for beginners",
    "AWS training for jobs",
    "Google certification costs Pakistan",
    "Google career courses free",
    "AWS training resources Pakistan",
    "Microsoft IT skills Pakistan",
    "online Microsoft Azure training",
    "cloud training Pakistan free",
    "government-sponsored IT certifications",
    "government-sponsored IT initiatives",
    "learn Microsoft cloud free",
    "digital marketing certifications",
    "web development certifications",
    "IT training for graduates",
    "software development certifications",
    "IT job-ready skills",
    "learn cloud computing free",
    "certification program Pakistan",
    "certifications in demand 2024",
    "skills for IT sector Pakistan",
    "skills to become IT certified",
    "global IT certification roadmap",
    "Pakistani IT certification guide",
    "DigiPAKISTAN free training initiative",
    "DigiPAKISTAN free course list",
    "how to become IT certified",
    "AWS certification guide",
    "free coding certifications",
    "Google developer certifications",
    "certifications for IT professionals",
    "Red Hat learning platform",
    "Microsoft certification guide",
    "Google IT support certification",
    "CompTIA A+ certification Pakistan",
    "cybersecurity IT certifications",
    "certified IT technician",
    "certified network administrator",
    "cloud engineer certifications",
    "certified web developer",
    "certified software developer",
    "AWS Solutions Architect certification",
    "Python beginner courses",
    "SQL certification Pakistan",
    "Linux certifications free",
    "cybersecurity essentials training",
    "learn IT skills fast",
    "start IT career with certifications",
    "AWS skill program free Pakistan",
    "Google skill program certification",
    "AWS DevOps certification training",
    "how to apply for DigiPAKISTAN",
    "AWS fundamental skills training",
    "Red Hat technical certifications",
    "Red Hat beginner courses",
    "Google digital certifications",
    "IT support certifications free",
    "AWS sysops administrator training",
    "AWS cloud practitioner certification",
    "AWS advanced certifications Pakistan",
    "Microsoft certification pricing",
    "Red Hat enterprise certifications",
    "Microsoft Excel certification",
    "AWS IT career certification",
    "IT training roadmap Pakistan",
    "IT certifications roadmap 2024",
    "Pakistani IT certification programs",
    "get IT certified in Pakistan",
    "AWS certification levels",
    "CompTIA certification roadmap",
    "IT job-ready certifications",
    "AWS free training initiative Pakistan",
    "global IT skill roadmap",
    "AWS learning guide free",
    "Microsoft learning resources free",
    "AWS learning track",
    "learn CompTIA A+ Pakistan",
    "AWS global certification path",
    "IT industry growth Pakistan",
    "digital transformation roadmap",
    "cybersecurity learning platforms",
    "Microsoft IT career guide",
    "certified IT professional roadmap",
    "certifications for tech beginners",
    "AWS DevOps guide Pakistan",
    "Microsoft DevOps certification",
    "learn Google cloud Pakistan",
    "global IT trends 2024",
    "digital transformation career path",
    "AWS certification study guide",
    "online IT certifications roadmap",
    "top certifications for IT jobs",
    "AWS future certifications Pakistan",
    "AWS beginner learning guide",
    "learn IT skills for free Pakistan",
    "AWS Solutions Architect roadmap",
    "Microsoft technology guide",
    "CompTIA beginner certifications",
    "AWS global certification levels",
    "IT career resources Pakistan",
    "Microsoft learning portal guide",
    "Red Hat learning materials",
    "how to study for Google cloud",
    "certified IT cloud specialist",
    "career roadmap for AWS specialists",
    "certification steps for beginners",
    "AWS cloud practitioner exam guide",
    "Microsoft Azure certification list",
    "Red Hat beginner roadmap",
    "AWS training center Pakistan",
    "AWS career certification guide",
    "AWS certification free Pakistan",
    "AWS career training Pakistan",
    "Microsoft learning track 2024",
    "CompTIA career learning track",
    "career guide for cloud engineers",
    "AWS top certifications free",
    "Red Hat global learning path",
    "Microsoft training levels",
    "AWS learning program free",
    "digital transformation free guide",
    "AWS job-ready program free Pakistan",
    "AWS courses Pakistan free",
    "global IT career trends 2024",
    "DigiPAKISTAN",
    "DigiPAKISTAN",
    "codiskill",
    "codi skill",
  ],
  openGraph: {
    title: "DigiPAKISTAN Training Program",
    description:
      "The DigiPAKISTAN Program is a Government of Pakistan-supported IT training initiative that empowers individuals with globally recognized IT certifications. Offering free, high-quality training for certifications like Google, AWS, Microsoft, and Cisco, DigiPAKISTAN bridges the IT skills gap and enhances employability across Pakistan.",
    url: "https://DigiPAKISTAN.com",
    type: "website",
    images: [
      {
        url: "/favicon.ico",
        width: 800,
        height: 600,
        alt: "DigiPAKISTAN Logo",
      },
    ],
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    title: "DigiPAKISTAN - IT Certification Training Initiative",
    description:
      "Start your journey with DigiPAKISTAN, a government-supported IT training program in Pakistan offering free professional courses for global certifications.",
    images: ["/favicon.ico"],
  },
  canonical: "https://www.DigiPAKISTAN.com",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.png",
  },
};

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const userDataFromCookie = cookieStore.get("user_data");

  let serverUserData = null;

  if (userDataFromCookie) {
    try {
      const bytes = CryptoJS.AES.decrypt(
        userDataFromCookie.value,
        process.env.NEXT_PUBLIC_ENCRYPTION_KEY
      );
      serverUserData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (error) {
      console.error("Error decrypting user data:", error);
    }
  }

  // You can use Zustand or pass the data directly to the children
  if (serverUserData) {
    useAuthStore.getState().setUserData(serverUserData); // Update Zustand store with user data
  }

  return (
    <html lang="en">
      <body className={`${font.className} antialiased`}>
        <Context>
        <LoadingWrapper>{children}</LoadingWrapper>
        </Context>
      </body>
    </html>
  );
}