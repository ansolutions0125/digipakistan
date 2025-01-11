"use client";

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Typed from "typed.js";
import Image from "next/image";
import StripeProtectedRoutes from "@/ProtectedRoutes/StripeProtectedRoutes";
import AuthenticateUser from "@/Hooks/AuthenticateUser";

const PaymentCancelled = () => {
  const typedElement = useRef(null);
  const typedInstance = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const options = {
      strings: ["Payment Failed", "Payment Failed"],
      typeSpeed: 100,
      backSpeed: 30,
      loop: true,
      showCursor: false,
    };

    typedInstance.current = new Typed(typedElement.current, options);

    return () => {
      if (typedInstance.current) {
        typedInstance.current.destroy();
      }
    };
  }, []);

  const goBack = () => {
    sessionStorage.removeItem("paymentInProgress");
    router.push("/");
  };

  return (
    <>
    <AuthenticateUser> 
        <div className="w-full h-screen py-10">
          <div className="flex justify-center">
            <div className="w-[90%] flex flex-col h-[500px] items-center md:w-1/2 lg:w-1/2">
              <div className="w-full h-full relative">
                <Image
                  src="/cancelPayment.gif"
                  layout="fill"
                  objectFit="cover"
                  alt="Payment Successful"
                  className="rounded"
                />
              </div>
              <h1
                className="text-center py-5 heading-text h-[30px]"
                ref={typedElement}
              ></h1>
              <p className="text-center mt-2 text-[14px]">
                Unfortunately, your payment could not be processed at this time.
                This might be due to an issue with your payment method or
                insufficient funds. Please check your payment details and try
                again. If the issue persists, contact your bank or try a
                different payment method.
              </p>

              <button
                onClick={goBack}
                className="mt-4 active:bg-second hover:bg-primary/80 px-4 bg-primary rounded-lg text-white py-2"
              >
                Back
              </button>
            </div>
          </div>
        </div>
    </AuthenticateUser>
    </>
  );
};

export default PaymentCancelled;
