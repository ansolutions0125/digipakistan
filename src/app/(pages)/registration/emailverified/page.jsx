import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import EmailVerified from "@/components/RegistrationForm/EmailVerified";
import AuthenticateUser from "@/Hooks/AuthenticateUser";

const Registers = async () => {
  return (
    <>
    <AuthenticateUser>
      <Navbar />
      <EmailVerified />
      <Footer/>
      </AuthenticateUser>
    </>
  );
};

export default Registers;
