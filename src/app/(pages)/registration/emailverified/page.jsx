import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import EmailVerified from "@/components/RegistrationForm/EmailVerified";

const Registers = async () => {
  return (
    <>
      <Navbar />
      <EmailVerified />
      <Footer/>
    </>
  );
};

export default Registers;
