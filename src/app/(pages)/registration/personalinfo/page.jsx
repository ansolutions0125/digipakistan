import Navbar from "@/components/Navbar/Navbar";
import FooterCopyRights from "@/components/Footer/FooterCopyRights";
import PersonalInfo from "@/components/RegistrationForm/PersonalInfo";
import AuthenticateUser from "@/Hooks/AuthenticateUser";

const PersonalInformation = async () => {
  return (
    <>
    {/* <AuthenticateUser> */}
      <Navbar />
      <PersonalInfo />
      <FooterCopyRights/>
    {/* </AuthenticateUser> */}
    </>
  );
};

export default PersonalInformation;
