import Register from "@/components/RegistrationForm/Register";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import EmailVerify from "@/components/RegistrationForm/EmailVerify";
import AuthenticateUser from "@/Hooks/AuthenticateUser";

const Registers = async () => {
  return (
    <>
    <AuthenticateUser>
      <Navbar />
      <EmailVerify />
      <Footer/>
    </AuthenticateUser>
    </>
  );
};

export default Registers;
