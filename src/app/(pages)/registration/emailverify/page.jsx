import Register from "@/components/RegistrationForm/Register";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import EmailVerify from "@/components/RegistrationForm/EmailVerify";

const Registers = async () => {
  return (
    <>
      <Navbar />
      <EmailVerify />
      <Footer/>
    </>
  );
};

export default Registers;
