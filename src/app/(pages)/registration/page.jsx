import RegistrationForm from "@/components/RegistrationForm/RegistrationForm";
import FooterCopyRights from "../../../components/Footer/FooterCopyRights";
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";

const Registration = async () => {
  return (
    <>
      <Navbar />
      <RegistrationForm />
      <Footer/>
    </>
  );
};

export default Registration;
