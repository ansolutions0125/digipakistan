import Navbar from "@/components/Navbar/Navbar";
import FooterCopyRights from "@/components/Footer/FooterCopyRights";
import GenerateChallan from "@/components/RegistrationForm/GenerateChallan";

const GenerateChallans = async () => {
  return (
    <>
      <Navbar />
      <GenerateChallan />
      <FooterCopyRights/>
    </>
  );
};

export default GenerateChallans;
