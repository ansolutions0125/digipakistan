import Navbar from "@/components/Navbar/Navbar";
import FooterCopyRights from "@/components/Footer/FooterCopyRights";
import PersonalInfo from "@/components/RegistrationForm/PersonalInfo";

const PersonalInformation = async () => {
  return (
    <>
      <Navbar />
      <PersonalInfo />
      <FooterCopyRights/>
    </>
  );
};

export default PersonalInformation;
