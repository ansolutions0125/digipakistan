"use client"
import Navbar from "@/components/Navbar/Navbar";
  import Footer from "@/components/Footer/Footer";
  import EmailVerified from "@/components/RegistrationForm/EmailVerified";
  import FooterCopyRights from "@/components/Footer/FooterCopyRights";
  import ApplicationSubmitted from "@/components/RegistrationForm/ApplicationSubmitted";
  import AuthenticateUser from "@/Hooks/AuthenticateUser";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "@/Backend/Firebase";
import userHooks from "@/Hooks/userHooks";
import { useRouter } from "next/navigation";

  const AppSubmitted = async () => {
    return (
      <>
      <AuthenticateUser>
        <Navbar />
        <Application>
        <ApplicationSubmitted />
        </Application>
        <FooterCopyRights/>
        </AuthenticateUser>
      </>
    );
  };

  export default AppSubmitted;


  const Application =({children})=>{
    const router = useRouter();
    const {userData} = userHooks();
    
return(
 <>
  {
    userData?.isApplicationSubmitted  ? (children): (router.back()
  )
  }</>
)
    
  }