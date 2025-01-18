"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
// import Typed from "typed.js";
import Image from "next/image";
// import StripeProtectedRoutes from "@/ProtectedRoutes/StripeProtectedRoutes";
import Navbar from "@/components/Navbar/Navbar";
import FooterCopyRights from "@/components/Footer/FooterCopyRights";
import Link from "next/link";
import AuthenticateUser from "@/Hooks/AuthenticateUser";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "@/Backend/Firebase";
import userHooks from "@/Hooks/userHooks";
import { BsCheck } from "react-icons/bs";

const PaymentSuccess = () => {
  const router = useRouter();
  const typedElement = useRef(null);
  const typedInstance = useRef(null);
  const {userData} = userHooks();

  // useEffect(() => {
  //   const options = {
  //     strings: ["Payment Successful", "Payment Successful"],
  //     typeSpeed: 50,
  //     backSpeed: 30,
  //     loop: true,
  //     showCursor: false,
  //   };

  //   typedInstance.current = new Typed(typedElement.current, options);

  //   const timeoutId = setTimeout(() => {
  //     router.push("/");
  //     // sessionStorage.removeItem("paymentInProgress");
  //   }, 20000);

  //   return () => {
  //     // typedInstance.current.destroy();
  //     clearTimeout(timeoutId);
  //   };
  // }, [router]);

  // console.log(userData);

//   useEffect(()=>{

//     const enrollUser = async()=>{
    
    



      

//     }
// enrollUser();
    
//   })

console.log(userData);

  return (
    <>
    <AuthenticateUser>
      <Navbar />

      <div className="w-full py-10">
        <div className="p-5 mx-auto">
          <div className="flex mb-5 justify-center">
            {/* <Image
              src={"/email-verify.gif"}
              width={150}
              height={150}
              alt="gg"
            /> */}
            <BsCheck className="text-7xl text-white bg-green-800 rounded-full"/>
          </div>
          <div className=" rounded-lg p-10">
            <div className="p-5 bg-green-200 rounded-lg ">
              <p>
                Congratulations on successfully completing the admission fee
                payment for the DigiPAKISTAN Training Program. We are thrilled to
                have you join our community of aspiring IT professionals.
              </p>
         
              <br />
            </div>
            <div>
              <p className="mt-10">
                {" "}
                Your LMS (Learning Management System) account has been
                activated, and you are just one step away from accessing a world
                of learning. Your login credentials are as follows:
              </p>
              <br />
              <h1>
  <span className="font-bold text-[20px]">Email:</span>{" "}
  {userData?.portalDetails?.email || "Email not available"}
</h1>
<h1>
  <span className="font-bold text-[20px]">Password:</span>{" "}
  {userData?.portalDetails?.lms_password || "Password not available"}
</h1>

              <h1>
                <span className="font-bold text-[20px]">Portal Link:</span>{" "}
                <Link
                  href={"https://edu.codiskills.com"}
                  className="text-blue-500 font-medium underline"
                >
                  Portal Link
                </Link>
              </h1>
            </div>
            <br />
            <p>
              Please use these credentials to log in to the LMS portal and start
              exploring the available courses immediately. We encourage you to
              change your password upon your first login to ensure your
              account's security.
            </p>
            <br />
            <p>
              If you encounter any issues or have questions, please don't
              hesitate to reach out to our support team via{" "}
            <a className="underline text-blue-700" href="mailto:support@digipakistan.org">support@digipakistan.org</a>
            </p>
            <br />
            <p>
              Welcome aboard, and we look forward to supporting you through your
              learning journey!
            </p>
          </div>
        
        </div>
      </div>
      <FooterCopyRights bg={"bg-primary py-3 text-white"} />
    </AuthenticateUser>
    </>
  );
};

export default PaymentSuccess;
