import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import EmailVerified from "@/components/RegistrationForm/EmailVerified";
import FooterCopyRights from "@/components/Footer/FooterCopyRights";
import ApplicationSubmitted from "@/components/RegistrationForm/ApplicationSubmitted";
import AuthenticateUser from "@/Hooks/AuthenticateUser";

const AppSubmitted = async () => {
  return (
    <>
    <AuthenticateUser>
      <Navbar />
      <ApplicationSubmitted />
      <FooterCopyRights/>
      </AuthenticateUser>
    </>
  );
};

export default AppSubmitted;
