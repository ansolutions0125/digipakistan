import FooterCopyRights from "@/components/Footer/FooterCopyRights";
import Navbar from "@/components/Navbar/Navbar";
import Terms from "@/components/terms/Terms";
import React from "react";

export function generateMetadata() {
  return {
    title: {
      default: "Terms & Conditions",
      template: "%s | DigiPAKISTAN",
    },
    description:
      "Review the Terms and Conditions for DigiPAKISTAN to understand the rules and regulations that govern the use of our IT certification courses and services.",
    metadataBase: new URL("https://DigiPAKISTAN.com/terms-conditions"),
    openGraph: {
      title: "Terms & Conditions of DigiPAKISTAN",
      description:
        "Understand your rights and responsibilities when using the DigiPAKISTAN platform. Our Terms & Conditions cover legal agreements, user conduct, and more.",
      url: "https://DigiPAKISTAN.com/terms-conditions",
    },
  };
}

const TermsAndConditions = () => {
  return (
    <>
      <Navbar />
   <Terms/> 
      <FooterCopyRights bg={"bg-primary py-4 text-white"} />
    </>
  );
};

export default TermsAndConditions;
