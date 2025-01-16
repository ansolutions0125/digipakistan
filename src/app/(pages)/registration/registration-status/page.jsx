
import Navbar from "@/components/Navbar/Navbar";
// import Footer from "@/components/Footer/Footer";
// import EmailVerified from "@/components/RegistrationForm/EmailVerified";
import FooterCopyRights from "@/components/Footer/FooterCopyRights";
import ApplicationSubmitted from "@/components/RegistrationForm/ApplicationSubmitted";
import AuthenticateUser from "@/Hooks/AuthenticateUser";

const AppSubmitted = async () => {
  return (
    <>
      <AuthenticateUser>
        <Navbar/>
        {/*<Application>*/}
          <ApplicationSubmitted />
        {/* </Application> */}
        <FooterCopyRights />
      </AuthenticateUser>
    </>
  );
};

export default AppSubmitted;

// const Application = ({ children }) => {
//   const router = useRouter();
//   const { userData, loading } = userHooks(); // Assume userHooks provides a `loading` state

//   useEffect(() => {
//     if (!loading && !userData?.isApplicationSubmitted) {
//       router.back();
//     }else(
//       router.push("/registration/registration-status")
//     )
//   }, [loading, userData, router]);

//   if (loading) {
//     return <div>Loading...</div>; // Replace with a loading spinner or skeleton
//   }

//   if (!userData?.isApplicationSubmitted) {
//     return null;
//   }

//   return <>{children}</>;
// };
