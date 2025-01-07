"use client";

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Typed from "typed.js";
import Image from "next/image";
import StripeProtectedRoutes from "@/ProtectedRoutes/StripeProtectedRoutes";
import Navbar from "@/components/Navbar/Navbar";
import FooterCopyRights from "@/components/Footer/FooterCopyRights";
import Link from "next/link";

const PaymentSuccess = () => {
  const router = useRouter();
  const typedElement = useRef(null);
  const typedInstance = useRef(null);

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

  return (
    <>
      <Navbar />

      <div className="w-full py-10">
        <div className="p-5 mx-auto">
          <div className="flex mb-5 animate-pulse justify-center">
            <Image
              src={"/email-verify.gif"}
              width={150}
              height={150}
              alt="gg"
            />
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
                <span className="font-bold text-[20px]"> Email:</span>{" "}
                dummyemail@dummy.com
              </h1>
              <h1>
                <span className="font-bold text-[20px]">Password:</span>{" "}
                test1234
              </h1>
              <h1>
                <span className="font-bold text-[20px]">Portal Link:</span>{" "}
                <Link
                  href={"https://edu.nitsep.pk"}
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
              {"support@DigiPAKISTAN.org"}.
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
    </>
  );
};

export default PaymentSuccess;
