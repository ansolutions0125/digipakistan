import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import EmailVerified from "@/components/RegistrationForm/EmailVerified";
import FooterCopyRights from "@/components/Footer/FooterCopyRights";
import ApplicationSubmitted from "@/components/RegistrationForm/ApplicationSubmitted";

const AppSubmitted = async () => {
  return (
    <>
      <Navbar />
      <ApplicationSubmitted />
      <FooterCopyRights/>
    </>
  );
};

export default AppSubmitted;
