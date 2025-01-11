import Navbar from "@/components/Navbar/Navbar";
import FooterCopyRights from "@/components/Footer/FooterCopyRights";
import GenerateChallan from "@/components/RegistrationForm/GenerateChallan";
import AuthenticateUser from "@/Hooks/AuthenticateUser";

const GenerateChallans = async () => {
  return (
    <>
    <AuthenticateUser>
      <Navbar />
      <GenerateChallan />
      <FooterCopyRights/>
    </AuthenticateUser>
    </>
  );
};

export default GenerateChallans;
