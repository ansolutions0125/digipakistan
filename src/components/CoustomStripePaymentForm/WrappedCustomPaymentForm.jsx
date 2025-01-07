"use client";

import React, { useEffect, useState } from "react";
import {
  useElements,
  useStripe,
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/navigation";
import { getSingleCourseForUser } from "../../Backend/firebasefunctions";
import userHooks from "../../Hooks/userHooks";
import {
  FaCcAmex,
  FaCcDiscover,
  FaCcMastercard,
  FaCcVisa,
  FaCreditCard,
} from "react-icons/fa";
import { firestore } from "../../Backend/Firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import CustomToast from "../../components/CoustomToast/CoustomToast";
import axios from "axios";
import TickMarkAnimation from "../../components/CoustomToast/TickMarkAnimation";
import Image from "next/image";
import { trackCustomEvent } from "@/Facebook/PixelEvents";

const CustomPaymentForm = ({ course, stripeData }) => {
  const router = useRouter();
  const { userData } = userHooks();
  const stripe = useStripe();
  const elements = useElements();
  const [emailExists, setEmailExists] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardExpiryComplete, setCardExpiryComplete] = useState(false);
  const [cardNumberComplete, setCardNumberComplete] = useState(false);
  const [cardCvcComplete, setCardCvcComplete] = useState(false);
  const [error, setError] = useState(null);
  const [cardBrand, setCardBrand] = useState("");
  const [fetchedUserData, setFetchedUserData] = useState(null);
  const [toast, setToast] = useState({
    message: "",
    type: "",
    visible: false,
    duration: 5000,
  });

  const showToast = (message, type = "info", duration = 20000) => {
    setToast({ message, type, visible: true, duration });
  };

  const handleCloseToast = () => {
    setToast({ ...toast, visible: false });
  };

  useEffect(() => {
    if (userData) {
      setFormData({
        email: userData.email || "",
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
      });
    }
  }, [userData]);

  const handleExpiryChange = (event) => {
    setCardExpiryComplete(event.complete);
    setError(event.complete ? null : "Please enter a valid card expiry date.");
  };

  const handleCvcChange = (event) => {
    setCardCvcComplete(event.complete);
    setError(event.complete ? null : "Please enter a valid CVC.");
  };

  const handleNumberChange = (event) => {
    setCardBrand(event.brand || "");
    setCardNumberComplete(event.complete);
    setError(event.complete ? null : "Please enter a valid card number.");
  };

  const checkEmailExists = async (email) => {
    if (!email) return;
    try {
      const usersRef = collection(firestore, "users");
      const emailQuery = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(emailQuery);
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0].data();
        setFetchedUserData(userDoc);
      }
      setEmailExists(!querySnapshot.empty);
    } catch (error) {
      console.error("Error checking email:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cardNumberComplete || !cardExpiryComplete || !cardCvcComplete) {
      setError("Please complete all card details to proceed with the payment.");
      return;
    }
    if (!stripe || !elements) return;

    setIsProcessing(true);
    const sendUserData = userData || fetchedUserData;

    try {
      const response = await fetch(
        "https://digi-skills-back-end.vercel.app/create-payment-intent",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ course, userData: sendUserData, formData }),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        showToast(responseData.message, "error", 20000);
        setIsProcessing(false);
        return;
      }

      showToast(responseData.messageEmailSent, "success", 20000);
      setIsProcessing(false);

      const { clientSecret } = responseData;
      const cardNumberElement = elements.getElement(CardNumberElement);
      const { paymentIntent, error } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardNumberElement,
            billing_details: {
              email: formData.email,
              name: `${formData.firstName} ${formData.lastName}`,
            },
          },
        }
      );

      if (error) {
        console.error("Payment failed:", error.message);
        sessionStorage.setItem("paymentInProgress", "failed");
        router.push("/payment-failed");
      } else if (paymentIntent.status === "succeeded") {
        console.log(paymentIntent);
        sessionStorage.setItem("paymentInProgress", "success");
        trackCustomEvent("Purchase", {
          transaction_id: paymentIntent.id,
          value: paymentIntent.amount,
          currency: paymentIntent.currency,
          content_type: "course",
          contents: {
            courseName: paymentIntent.description,
            livemode: paymentIntent.livemode,
            status: paymentIntent.status,
          },
        });
        setTimeout(
          () => {
            router.push("/payment-successful");
          },
          responseData.messageEmailSent ? 20000 : 1000
        );
      }
    } catch (error) {
      console.error(error);
    }
    setIsProcessing(false);
  };

  const handleEmailChange = async (e) => {
    const email = e.target.value;
    setFormData({ ...formData, email });
    await checkEmailExists(email);
  };

  const renderCardIcon = () => {
    switch (cardBrand) {
      case "visa":
        return <FaCcVisa className="text-blue-600 fade-in" />;
      case "mastercard":
        return <FaCcMastercard className="text-red-600 fade-in" />;
      case "amex":
        return <FaCcAmex className="text-green-600 fade-in" />;
      case "discover":
        return <FaCcDiscover className="text-orange-600 fade-in" />;
      default:
        return (
          <div className="flex items-center gap-1">
            <FaCcVisa className="icon-default" />
            <FaCcMastercard className="icon-default" />
            <FaCcAmex className="icon-default" />
            <FaCcDiscover className="icon-default" />
            <FaCreditCard className="icon-default" />
          </div>
        );
    }
  };

  const [convertedPrice, setConvertedPrice] = useState(null);

  const convertToPKR = async (currency) => {
    try {
      const response = await axios.get(
        `https://api.exchangerate-api.com/v4/latest/${currency}`
      );
      const rateToPKR = response.data.rates.PKR;
      setConvertedPrice(course.coursePrice * rateToPKR);
    } catch (error) {
      console.error("Error fetching exchange rate:", error);
    }
  };

  convertToPKR(stripeData?.currency);

  return (
    <div className="bg-bgcolor">
      {toast.visible && (
        <CustomToast
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={handleCloseToast}
        />
      )}
      <div className="max-w-6xl flex lg:flex-row flex-col lg:mx-auto mx-5">
        <div className="w-full py-10 lg:py-20">
          <div className="w-full lg:w-[90%]">
            <div className="w-full h-[250px]">
              <Image
                src={course.courseThumbnail}
                width={500}
                height={300}
                className="w-full rounded-md h-full object-cover"
                alt="Course Thumbnail"
              />
            </div>
            <div className="flex flex-col my-5">
              <h3 className="heading-text text-xl">{course?.courseTitle}</h3>
              <p className="text-gray-600 text-[13px]">
                {course?.courseShortDescription}
              </p>
              <hr className="my-5 h-[2px] bg-gray-300 w-full" />
              <div className="flex mb-5 justify-between items-center px-2">
                <h3 className="text-gray-600">Total</h3>
                <span className="text-xl text-gray-600 font-bold">
                  PKR
                  <span className="text-primary">
                    {" "}
                    {Math.round(convertedPrice).toLocaleString()}
                  </span>
                </span>
              </div>
              <hr className="my-5 h-[2px] bg-gray-300 w-full" />
              <div className="text-gray-600 text-[13px] text-center">
                Need assistance with your order?{" "}
                <a
                  href="mailto:someone@example.com"
                  className="underline text-primary"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
        <hr className="h-auto hidden lg:block bg-gray-300 mx-20 w-[2px]" />
        <div className="lg:py-20 py-5 w-full lg:w-[90%]">
          <div className="bg-white top-[120px] sticky px-8 py-6 rounded">
            <form onSubmit={handleSubmit} className="flex flex-col">
              <label className="text-gray-600 font-bold mb-4">
                Account Information
              </label>
              <label className="text-gray-600 font-bold mb-1 text-[13px]">
                Email*
              </label>
              <div className="rounded flex justify-between items-center text-[14px] border py-1.5 outline-none px-3 font-normal mb-2">
                <input
                  type="email"
                  value={formData.email}
                  onChange={handleEmailChange}
                  required
                  placeholder="Enter your email."
                  disabled={userData?.email}
                  className="w-full bg-transparent outline-none"
                />
                {emailExists || userData?.email ? (
                  <div>
                    <TickMarkAnimation />
                  </div>
                ) : (
                  ""
                )}
              </div>
              {!userData?.email && (
                <>
                  {!emailExists && (
                    <>
                      <label className="text-gray-600 font-bold mb-2 text-[13px]">
                        First Name*
                      </label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            firstName: e.target.value,
                          })
                        }
                        placeholder="Enter your first name."
                        required
                        className="rounded text-[14px] border py-1 outline-none px-3 font-normal mb-2"
                      />
                      <label className="text-gray-600 font-bold mb-2 text-[13px]">
                        Last Name*
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                        placeholder="Enter your last name."
                        required
                        className="rounded text-[14px] border py-1 outline-none px-3 font-normal mb-2"
                      />
                    </>
                  )}
                </>
              )}
              <label className="text-gray-600 font-bold mb-3 mt-4">
                Card Information
              </label>
              <div className="border p-5 rounded-md">
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="text-gray-600 font-bold mb-2 mt-4 text-[13px]">
                      Card number
                    </label>
                    <div className="flex duration-500 border gap-1 mb-2">
                      <CardNumberElement
                        onChange={handleNumberChange}
                        className="bg-transparent w-full px-3 py-1.5 duration-500"
                      />
                      <div className="flex items-center h-full bg-gray-100 py-1.5 px-2 gap-1 duration-500">
                        {renderCardIcon()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center w-full gap-2">
                    <div className="w-full">
                      <label className="text-gray-600 font-bold mb-2 mt-4 text-[13px]">
                        Expiration date
                      </label>
                      <CardExpiryElement
                        onChange={handleExpiryChange}
                        className="border mb-2 py-2 px-3"
                      />
                    </div>
                    <div className="w-full">
                      <label className="text-gray-600 font-bold mb-2 mt-4 text-[13px]">
                        CVC Code
                      </label>
                      <CardCvcElement
                        onChange={handleCvcChange}
                        className="border mb-2 py-2 px-3"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="mt-4 bg-primary py-2 text-white rounded-sm"
                disabled={!stripe || isProcessing}
              >
                {isProcessing ? "Processing..." : "Pay"}
              </button>
              {error && (
                <p className="error-message text-red-500 mt-2">{error}</p>
              )}
              <div className="mt-5 text-[10px] text-gray-500 flex gap-6 justify-center items-center">
                <span>
                  Powered by{" "}
                  <span className="font-bold text-gray-800">DigiSkills</span>
                </span>
                <span>Terms</span>
                <span>Privacy</span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const WrappedCustomPaymentForm = ({ data }) => {
  const [stripePromise, setStripePromise] = useState(null);
  const [stripeData, setStripeData] = useState(null);

  const fetchPublishableKey = async () => {
    try {
      const q = query(
        collection(firestore, "config_stripe_keys"),
        where("environment", "==", "test")
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const keyDoc = querySnapshot.docs[0];
        const keyData = keyDoc.data();
        setStripePromise(loadStripe(keyData.stripe_Publishable_Key));
        setStripeData(keyData);
      } else {
        console.error("No publishable key found for the 'test' environment.");
      }
    } catch (error) {
      console.error("Error fetching publishable key:", error);
    }
  };

  useEffect(() => {
    fetchPublishableKey();
  }, []);

  return (
    <Elements stripe={stripePromise}>
      <CustomPaymentForm course={data} stripeData={stripeData} />
    </Elements>
  );
};

export default WrappedCustomPaymentForm;
