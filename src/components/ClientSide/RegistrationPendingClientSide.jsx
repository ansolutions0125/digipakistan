"use client";
import {
  MdContentCopy,
  MdOutlinePayment,
  MdPendingActions,
  MdPreview,
} from "react-icons/md";
import { GoDotFill } from "react-icons/go";
import { useEffect, useState } from "react";
import Image from "next/image";
import CustomToast from "../CoustomToast/CoustomToast";
import { useRouter } from "next/navigation";
import userHooks from "@/Hooks/userHooks";
import {
  IoIosArrowDown,
  IoIosCheckmarkCircle,
  IoMdCheckmarkCircleOutline,
  IoMdClose,
} from "react-icons/io";
import { CiCircleInfo } from "react-icons/ci";
import { firestore } from "@/Backend/Firebase";
import { doc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { TiEdit } from "react-icons/ti";
import { RiErrorWarningLine } from "react-icons/ri";
import { TbNotes } from "react-icons/tb";
import { GrNotes } from "react-icons/gr";
import Link from "next/link";

const RegistrationPendingClientSide = ({
  registrationData,
  payproData,
  courses,
  siteData,
}) => {
  const router = useRouter();
  const { userData } = userHooks();
  const [errors, setErrors] = useState({});

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

  const handleInputChange = (e) => {
    let value = e.target.value;

    // Allow only numbers and format as MM / YY
    value = value.replace(/[^\d]/g, "").slice(0, 4); // Remove non-digits and limit to 4 characters

    // Add the slash if there are 2 digits for the month
    if (value.length >= 3) {
      value = `${value.slice(0, 2)} / ${value.slice(2)}`;
    }
  };

  const handleStripe = async (e) => {
    e.preventDefault();
    let status = 1; //if 0 then fail. if 1 then success for now fail. now success its a mock function becasue i have to intrage payfast...

    if (status === 1) {
      if (!userData || !registrationData) {
        console.error("Missing userData or registrationData");
        return;
      }

      const requestBody = {
        fetchedUserData: userData,
        email_subject: "Your Payment Successful – Welcome to DigiPAKISTAN!",
        courseData: registrationData,
      };

      // Send request to backend
      const response = await fetch(
        "/api/emails/direct-emails/payment-successful",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody), // Convert to JSON string
        }
      );

      const responseData = await response.json();

      router.push("/payment-successful");
      console.log(responseData);
    } else if (status === 0) {
      const requestBody = {
        fetchedUserData: userData,
        email_subject: "Your Payment Failed – Unfortunately",
        courseData: registrationData,
      };

      // Send request to backend
      const response = await fetch("/api/emails/direct-emails/payment-failed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody), // Convert to JSON string
      });

      const responseData = await response.json();
      router.push("/payment-failed");
      console.log(responseData);
    }
  };

  const [paymentData, setPaymentData] = useState(null);

  // PayFast==========================================================
  const [payfastLoading, setPayfastLoading] = useState(false);
  async function PayFast() {
    setPayfastLoading(true);
    const res = await fetch("/api/payfast/payment-process", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: registrationData.userId,
        lmsuserid: registrationData.portalDetails.id,
        course: registrationData.selectedCourses,
        email: registrationData.email,
        phone: registrationData.phone,
      }),
    });

    const data = await res.json();
    console.log(data);
    if (data.checkout_url) {
      setPaymentData(data); // Store the data to be used in form submission
    }
    setPayfastLoading(false);
  }

  useEffect(
    (e) => {
      if (paymentData) {
        // Automatically submit the form once the payment data is set
        const form = document.getElementById("PayFast_payment_form");
        if (form) {
          // Populate form fields with payment data
          Object.keys(paymentData).forEach((key) => {
            const input = form.querySelector(`input[name="${key}"]`);
            if (input) {
              input.value = paymentData[key];
            }
          });

          // Submit the form
          form.submit();
        }
      }
    },
    [paymentData]
  );

  // PAYPRO=============================================================
  const [formData, setFormData] = useState({
    userId: registrationData.userId,
    fullName: registrationData.fullname,
    phone: registrationData.phone,
    email: registrationData.email,
    address: registrationData.permanentaddress,
    amount: registrationData.totalFee,
  });

  const [response, setResponse] = useState(null);

  const handleInputChangePayPro = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [payproloading, setPayproloading] = useState(false);
  const [payprodata, setPayProDATA] = useState(null);
  const PayProNEXT_API = async () => {
    try {
      setPayproloading(true);
      const res = await fetch("/api/paypro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setPayproloading(false);
      setPayProDATA(data);

      // Storing the paypro reponse in firestore
      const paypro = await setDoc(
        doc(firestore, "paypro_payments_data", registrationData.userId),
        {
          payProId: data.payProId,
          userId: registrationData.userId,
          formId: registrationData.formId,
          amount: formData.amount,
          payPro_status: data.status,
          certifications: registrationData.selectedCourses,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }
      );
      if (res.ok) {
        setResponse(data);
        showToast(
          "Your CDSI/ConsumerId is genrated now you are able to pay.!",
          "success",
          2000
        );
      } else {
      }
    } catch (error) {
      console.error("Error triggering API:", error);
    }
  };
  // PAYPRO=============================================================

  // Payments =========================================================
  const faqs = [
    {
      question:
        "Pay your admission processing fee from any bank app / online service, at any time, and from anywhere.",
      answer:
        "Next.js is a React framework for building server-rendered or statically-exported React applications.",
    },
    {
      question: "Pay Online",
      answer:
        "Next.js uses a file-based routing system. Files inside the `pages` directory map to routes in the application.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Paypro fee steps
  const steps = [
    "Generate Your CDSI/Consumer Number: Begin by generating your unique CDSI/Consumer Number, which will appear below once created.",
    "Copy Your Consumer Number: Locate the CDSI/Consumer Number displayed below and copy it.",
    "Select Your Bank: Choose your bank from the provided list. A video tutorial will guide you through the specific steps for paying via your chosen bank.",
    "Watch and Follow Instructions: Carefully watch the tutorial and follow the step-by-step guidelines provided.",
    "Enter Your CDSI/Consumer Number: Open your banking app and navigate to the '1 Bill Invoice/Voucher' section. Paste the CDSI/Consumer Number.",
    "Confirm and Pay: Your DigiPAKISTAN voucher details will be automatically retrieved. Verify the information and proceed to pay the admission fee.",
    "Application Submission: Once your payment is processed, your application will be sent to the DigiPAKISTAN team for review. You will receive an instant notification from the system.",
    "If Approved: You will receive your login credentials for the DigiPAKISTAN Learning Portal and can begin your journey toward IT excellence.",
    "If Not Approved: Your admission charges will be refunded to your account within 7 working days.",
  ];

  const paymentSteps = [
    "Click on 'Proceed Payment' to be redirected to the PayFast payment page.",
    "Choose your preferred payment method from options like Credit/Debit Cards, Bank Transfer, JazzCash, Easypaisa, or UPaisa.",
    "Enter the required payment details based on the selected payment method. This may include card information, bank details, or mobile wallet numbers.",
    "After reviewing the payment details, click 'Confirm' or 'Pay Now' to proceed with your payment.",
    "Upon successful payment, you will receive a confirmation notification from PayFast and be redirected to the DigiPAKISTAN with your LMS login credentials.",
    "A confirmation email will be sent to you, verifying your payment and successful registration with DigiPAKISTAN.",
  ];

  // Payment Video tutorial
  const videos = [
    {
      title: "How to Pay Your Admission Processing Fee via JazzCash.",
      description:
        "Learn how to generate your PSID/Consumer Number for paying the DigiPAKISTAN admission fee easily.",
      image: "/payment-jazzcash.png", // Replace with your image URL
      video: "https://www.youtube.com/embed/sample1", // Replace with your video URL
    },
    {
      title: "How to Pay Your Admission Processing Fee via Askari Bank.",
      description:
        "Step-by-step guide to paying your DigiPAKISTAN admission fee using a mobile banking application.",
      image: "/payment-askaribank.png", // Replace with your image URL
      video: "https://www.youtube.com/embed/sample2", // Replace with your video URL
    },
    {
      title: "How to Pay Your Admission Processing Fee via Allied Bank.",
      description:
        "Detailed instructions for paying via internet banking on supported platforms.",
      image: "/payment-alliedbank.png", // Replace with your image URL
      video: "https://www.youtube.com/embed/sample3", // Replace with your video URL
    },
    {
      title: "How to Pay Your Admission Processing Fee via Meezan Bank.",
      description:
        "A simple tutorial on how to use ATMs to pay your admission fee for DigiPAKISTAN.",
      image: "/payment-meezanbank.png", // Replace with your image URL
      video: "https://www.youtube.com/embed/sample4", // Replace with your video URL
    },
    {
      title: "How to Pay Your Admission Processing Fee via EasyPaisa.",
      description:
        "Troubleshooting common issues encountered during the payment process and how to resolve them.",
      image: "/payment-easypaisa.png", // Replace with your image URL
      video: "https://www.youtube.com/embed/sample5", // Replace with your video URL
    },
    {
      title: "How to Pay Your Admission Processing Fee via Bank Alfalah.",
      description:
        "Understand what happens after you’ve successfully paid your admission fee.",
      image: "/payment-alfalahbank.png", // Replace with your image URL
      video: "https://www.youtube.com/embed/sample6", // Replace with your video URL
    },
    {
      title: "How to Pay Your Admission Processing Fee via UBL Bank.",
      description:
        "Understand what happens after you’ve successfully paid your admission fee.",
      image: "/payment-ublbank.png", // Replace with your image URL
      video: "https://www.youtube.com/embed/sample6", // Replace with your video URL
    },
  ];

  const [isCopied, setIsCopied] = useState(false);
  const handleCopy = (payprodata) => {
    if (payproData?.payProId) {
      navigator.clipboard
        .writeText(payproData.payProId || payprodata.payProId)
        .then(() => {
          showToast("Copied to clipboard!", "success", 2000);
          setIsCopied(true);
        });
    }
  };

  const [updateCourse, setUpdateCourse] = useState(false);
  const toggleCourseUpdater = () => {
    setUpdateCourse(!updateCourse);
  };  

  useEffect(() => {
    if (updateCourse) {
      // Disable scrolling on the body
      document.body.style.overflow = "hidden";
    } else {
      // Enable scrolling on the body
      document.body.style.overflow = "auto";
    }

    // Cleanup function to ensure scrolling is enabled when the component unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [updateCourse]);

  const [updateFormData, setUpdateFormData] = useState({
    course1: "Select",
    course2: "Select",
    course3: "Select",
    selectedCourses: [],
  });

  // Mock function to filter courses, replace with real logic if available
  const getFilteredCourses = (excludeKeys) => {
    const selectedCourses = excludeKeys.map((key) => updateFormData[key]);
    return courses.filter(
      (course) => !selectedCourses.includes(course.courseTitle)
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("course")) {
      setUpdateFormData((prev) => {
        const selectedCourses = [...(prev.selectedCourses || [])]; // Ensure array is initialized

        // Determine the course index from the select name (e.g., course1 => 0, course2 => 1, etc.)
        const courseIndex = parseInt(name.replace("course", ""), 10) - 1;

        if (value === "Select") {
          // Remove course if "Select" is chosen
          selectedCourses[courseIndex] = null;
        } else {
          // Find the course object from the list of available courses
          const selectedCourse = getFilteredCourses([]).find(
            (course) => course.courseTitle === value
          );
          selectedCourses[courseIndex] = selectedCourse; // Replace or add selected course
        }

        return {
          ...prev,
          [name]: value, // Update the individual select field
          selectedCourses: selectedCourses.filter(Boolean), // Filter out null values
        };
      });
    } else {
      // Handle changes for other inputs
      setUpdateFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (updateFormData.course1 === "Select")
      newErrors.course1 = "Course 1 is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [updateCoursesLoading, setUpdateCoursesLoading] = useState(false);
  const updateCoursesHandler = async () => {
    if (!validateForm()) return;
    setUpdateCoursesLoading(true);
    try {
      // Extract the titles from selected courses for easier processing.
      const updatedCourseTitles = [
        updateFormData.course1 !== "Select" ? updateFormData.course1 : null,
        updateFormData.course2 !== "Select" ? updateFormData.course2 : null,
        updateFormData.course3 !== "Select" ? updateFormData.course3 : null,
      ].filter(Boolean); // Remove null entries to ensure no empty slots are saved.

      // Convert titles back into course objects from the original course list if necessary
      const updatedCourses = updatedCourseTitles
        .map((title) => courses.find((course) => course.courseTitle === title))
        .filter((course) => course !== undefined);

      // Reference to the Firestore document
      const docRef = doc(
        firestore,
        "registration_form_data",
        registrationData.userId
      );

      // Update Firestore with the new list of selected courses
      await updateDoc(docRef, {
        selectedCourses: updatedCourses, // Overwrite the array with the new selections
      });

      // Update local state to reflect changes immediately in the UI
      setUpdateFormData((prev) => ({
        ...prev,
        selectedCourses: updatedCourses,
        course1: updatedCourses[0]?.courseTitle || "Select",
        course2: updatedCourses[1]?.courseTitle || "Select",
        course3: updatedCourses[2]?.courseTitle || "Select",
      }));
      setUpdateCoursesLoading(false);

      // Close the update form and show a success message
      setUpdateCourse(false);
      showToast("Your certifications have been updated.", "success", 2000);
    } catch (error) {
      console.error("Error updating courses:", error);
      alert("Failed to update courses. Please try again.");
    }
  };

  console.log(updateFormData);

  useEffect(() => {
    if (
      registrationData.selectedCourses &&
      registrationData.selectedCourses.length
    ) {
      const courses = registrationData.selectedCourses.map(
        (course) => course.courseTitle
      );
      setUpdateFormData((prev) => ({
        ...prev,
        course1: courses[0] || "Select",
        course2: courses[1] || "Select",
        course3: courses[2] || "Select",
        selectedCourses: registrationData.selectedCourses,
      }));
    }
  }, [registrationData]);

  return (
    <div className="max-w-6xl lg:mx-auto">
      {toast.visible && (
        <CustomToast
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={handleCloseToast}
        />
      )}

      {registrationData.registrationStatus === "pending" ? (
        <div className="py-5 lg:py-20">
          <h1 className="text-center text-4xl text-gray-800 mb-5 font-bold">
            Application Under Review
          </h1>
          <div className="flex mx-5 flex-col gap-2 bg-yellow-200 text-gray-700 p-5 rounded-md">
            <MdPendingActions size={50} />
            <h3 className="font-bold lg:text-[16px] text-[13px]">
              Thank you for applying to the DigiPAKISTAN Program. We are pleased
              to inform you that your application has been approved and is
              currently under review by our admissions team.
            </h3>
            <div className="flex w-full justify-end">
              <p
                className="text-[12px] urdufont lg:text-[16px] font-medium w-full mt-4 text-start"
                dir="rtl"
              >
                آپ کی کوڈی اسکلز پروگرام کے لیے درخواست دینے کا شکریہ۔ ہم آپ کو
                یہ اطلاع دینے میں خوشی محسوس کر رہے ہیں کہ آپ کی درخواست کو
                منظور کیا گیا ہے اور اس وقت ہماری داخلہ ٹیم کے ذریعہ جائزہ لیا
                جا رہا ہے۔ یہ جائزہ عمل 24 گھنٹے تک کا وقت لے سکتا ہے۔ اس دوران
                آپ کے صبر کی قدر کی جاتی ہے۔ جیسے ہی آپ کی درخواست کو مکمل طور
                پر منظور کیا جائے گا، ہم آپ کو ایمیل کے ذریعے مطلع کریں گے۔
                متبادل طور پر، آپ 24 گھنٹے بعد ہماری ویب سائٹ پر واپس آ سکتے ہیں
                تاکہ آپ اپنی درخواست کی حالت چیک کر سکیں۔
              </p>
            </div>
            <p className="text-[12px] lg:text-[16px]">
              In the meantime, feel free to browse our platform, and we'll
              update you as soon as your registration is approved. If you have
              any questions, please reach out to our support team at (
              {siteData.email}).
            </p>
            <div className="flex w-full justify-end">
              <p
                className="text-[12px] urdufont lg:text-[16px] font-medium w-full mt-1 text-start"
                dir="rtl"
              >
                سی دوران، ہماری پلیٹ فارم کو دیکھنے کے لیے آزاد محسوس کریں، اور
                جیسے ہی آپ کی رجسٹریشن منظور ہوگی ہم آپ کو آگاہ کریں گے۔ اگر آپ
                کے کوئی سوالات ہوں، تو براہ کرم ہماری سپورٹ ٹیم سے (
                {siteData.email}) پر رابطہ کریں۔
              </p>
            </div>
          </div>
          <div className="mt-10 mx-5">
            <div className="overflow-x-auto">
              <div class=" bg-white shadow-md rounded-lg">
                <table class="min-w-full w-full">
                  <thead class="bg-yellow-500 border-yellow-500 border text-white rounded-t-md">
                    <tr>
                      <th class="px-4 py-2 text-left border-b">Form ID</th>
                      <th class="px-4 py-2 text-left border-b">Status</th>
                      <th class="px-4 py-2 text-left border-b">
                        Selected Certifications
                      </th>
                      <th class="px-4 py-2 text-left border-b border-r">
                        Total Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="hover:bg-gray-50 border">
                      <td class="px-4 py-4 border lowercase">
                        {registrationData.userId.slice(2, 6)}...
                      </td>
                      <td class="px-4 py-4 border capitalize">
                        {registrationData.registrationStatus}
                      </td>
                      <td class="px-4 py-4 border">
                        {registrationData.selectedCourses.map((data, index) => (
                          <div key={index} className="flex gap-1 items-center">
                            <GoDotFill size={12} />
                            {data.courseTitle}...
                          </div>
                        ))}
                      </td>
                      <td class="px-4 py-4 border">PKR. 5,000</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex mt-10 p-10 rounded-md border-[4px] shadow-lg">
              <div className="grid grid-cols-1 w-full md:grid-cols-2 lg:grid-cols-3">
                <div className="w-full relative items-center text-primary hover:scale-105 duration-500 gap-4 flex flex-col">
                  <TbNotes size={100} />
                  <h4 className="font-bold">Application Submitted</h4>
                  <div className="absolute right-[6.1rem] -top-3">
                    <IoIosCheckmarkCircle size={40} />
                  </div>
                </div>
                <div className="w-full items-center text-gray-600 hover:scale-105 duration-500 gap-4 flex flex-col">
                  <GrNotes size={100} />
                  <h4 className="font-bold">Application Status</h4>
                </div>
                <div className="w-full items-center gap-4 hover:scale-105 duration-500 text-gray-600 flex flex-col">
                  <IoMdCheckmarkCircleOutline size={100} />
                  <h4 className="font-bold">Complete Enrollment</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : registrationData.registrationStatus === "approved" ? (
        <>
          <h1 className="text-center  mt-10 text-2xl mx-5 lg:mx-auto lg:text-4xl font-bold text-gray-800">
            Pay Admission Fee -
            <span className="urdufont"> داخلہ فیس ادا کریں</span>
          </h1>
          <div className="py-5 lg:gap-5 flex lg:flex-row mx-5 flex-col lg:py-10">
            <div className="w-full">
              <div className="flex flex-col gap-2 border shadow-md text-gray-700 p-5 rounded-md">
                {/* <MdOutlinePayment  size={50} /> */}
                <h3 className="font-bold">
                  Congratulations, your application has been successfully
                  approved! We are delighted to welcome you to the DigiPAKISTAN
                  Program, To finalize your enrollment and access our Learning
                  Management System (LMS), a minimal admission fee of PKR 5,000
                  is required. This fee remains the same whether you choose one
                  or up to three certifications. It's an incredible
                  opportunity!.
                </h3>
                <h2 className="font-normal text-[13px]">
                  <span className="text-[15px] font-bold">
                    Please proceed with the payment to secure your place.
                  </span>{" "}
                  Once your payment is successfully processed, you will be able
                  to retrieve your LMS login credentials immediately. This
                  ensures you can start your training without delay.
                </h2>
                <p className="text-[13px]">
                  In the meantime, feel free to browse our platform, and we'll
                  update you as soon as your registration is approved. If you
                  have any questions, please reach out to our support team at (
                  {siteData.email}).
                </p>
              </div>
              <div className="flex flex-col gap-2 border shadow-md  p-5 rounded-md mt-5">
                <h1 className="font-semibold text-[1.2rem] text-gray-800">
                  Payment method
                </h1>
                <div>
                  {faqs.map((faq, index) => (
                    <div key={index} className="border-b border-gray-300 mb-4">
                      <button
                        onClick={() => toggleFaq(index)}
                        className={`w-full text-left py-3 rounded-t-md flex gap-2 px-4  font-semibold text-lg ${
                          openIndex === index
                            ? "bg-primary text-white"
                            : "bg-gray-100 hover:bg-gray-200"
                        }`}
                      >
                        <span
                          className={`float-right mt-[0.4rem] transform transition-transform duration-300 ${
                            openIndex === index ? "rotate-180" : ""
                          }`}
                        >
                          <IoIosArrowDown />
                        </span>
                        <span className="text-[1rem]"> {faq.question}</span>
                      </button>
                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          openIndex === index ? "max-h-full" : "max-h-0"
                        }`}
                      >
                        <div className=" bg-white">
                          {openIndex === 0 ? (
                            <div className="p-6 bg-gray-100 shadow-md">
                              <h1 className="text-xl font-bold text-primary mb-4">
                                Easily Pay Your DigiPAKISTAN Admission Fee
                              </h1>
                              <p className="text-gray-600 text-[13px] mb-4">
                                Pay your admission fee with any bank, anytime,
                                and anywhere using mobile apps, internet
                                banking, or ATMs. Follow these simple steps:
                              </p>
                              <div className="space-y-2">
                                {steps.map((step, index) => (
                                  <div
                                    key={index}
                                    className="flex items-start space-x-4 bg-white p-4 rounded-md shadow-sm"
                                  >
                                    <div className="text-primary font-bold text-lg">
                                      {index + 1}.
                                    </div>
                                    <p className="text-gray-800 text-[13px]">
                                      {step}
                                    </p>
                                  </div>
                                ))}
                              </div>
                              <div className="mt-4 bg-primary/20 p-4 rounded-md">
                                <h2 className="text-xl font-semibold text-primary">
                                  Important Note:
                                </h2>
                                <p className="text-gray-700 mt-2 text-[13px]">
                                  - The admission fee for DigiPAKISTAN is{" "}
                                  <strong>5,000 PKR</strong>, a one-time charge
                                  applicable regardless of the number of
                                  certifications or courses you enroll in.{" "}
                                  <br />-{" "}
                                  <strong>
                                    All training under the DigiPAKISTAN Program is
                                    completely free
                                  </strong>
                                  , with no additional charges for course
                                  materials or enrollment.
                                </p>
                              </div>
                              <div className="mt-6 text-center">
                                {payproData ? (
                                  <div className="w-full justify-center items-center flex">
                                    <div className="bg-primary text-[11px] md:text-[15px] py-[8px] px-1  md:py-2 md:px-2 rounded-tl-md rounded-bl-md text-white">
                                      CDSI/Consumer Number
                                    </div>
                                    <div
                                      className={`border flex items-center py-1 px-1  md:py-2 md:px-2 gap-2 ${
                                        isCopied && "border-primary"
                                      }`}
                                    >
                                      <h4>{payproData?.payProId}</h4>
                                      <MdContentCopy
                                        className="border cursor-pointer"
                                        onClick={handleCopy}
                                      />
                                    </div>
                                  </div>
                                ) : payprodata ? (
                                  <div className="w-full justify-center items-center flex">
                                    <div className="bg-primary text-[11px] md:text-[15px] py-[8px] px-1  md:py-2 md:px-2 rounded-tl-md rounded-bl-md text-white">
                                      CDSI/Consumer Number
                                    </div>
                                    <div
                                      className={`border flex items-center py-1 px-1  md:py-2 md:px-2 gap-2 ${
                                        isCopied && "border-primary"
                                      }`}
                                    >
                                      <h4>{payprodata?.payProId}</h4>
                                      <MdContentCopy
                                        className="border cursor-pointer"
                                        onClick={() => handleCopy(payprodata)}
                                      />
                                    </div>
                                  </div>
                                ) : (
                                  <button
                                    onClick={PayProNEXT_API}
                                    className="px-4 py-2 bg-primary text-[14px] text-white font-semibold rounded hover:bg-second hover:scale-105 duration-300"
                                  >
                                    {payproloading ? (
                                      <div className="flex items-center gap-2">
                                        <span>Processing...</span>
                                        <div className="animate-spin h-4 w-4 border border-t-transparent border-white rounded-full"></div>
                                      </div>
                                    ) : (
                                      "Genrate CDSI/Consumer Number"
                                    )}
                                  </button>
                                )}
                              </div>
                              <h1 className="mt-6 font-semibold text-primary bg-primary/10 p-5 rounded-md text-xl">
                                View a step-by-step tutorial on making payments
                                through banks and various platforms.
                              </h1>
                              <div className="grid grid-cols-2 md:grid-cols-3 mt-4 gap-y-10 gap-x-2 lg:grid-cols-5">
                                {videos.map((data, idx) => (
                                  <div
                                    key={idx}
                                    className="w-full md:h-[10rem] lg:h-[7.3rem] p-7 border-[3px] rounded-md shadow-lg hover:border-gray-700 cursor-pointer hover:scale-105 duration-300"
                                  >
                                    <Image
                                      src={data.image}
                                      width={200}
                                      height={200}
                                      alt="jazz-cash"
                                      className="w-full h-full "
                                    />
                                  </div>
                                ))}
                              </div>
                              <div className="mt-4 border text-[13px] p-3 rounded-md bg-primary/10 border-second">
                                <span className="text-gray-700">
                                  <CiCircleInfo
                                    size={16}
                                    className="inline-flex text-second"
                                  />
                                  <span className="text-second mx-1">
                                    Note:
                                  </span>
                                  After successfully paying your DigiPAKISTAN
                                  admission fee, no additional steps are
                                  required from your end. Please allow up to 30
                                  minutes for processing. During this time, you
                                  should receive a confirmation email. If the
                                  email is not received within 30 minutes, log
                                  in to your DigiPAKISTAN account to check your
                                  application status. If the confirmation is
                                  still unavailable, reach out to our support
                                  team at {siteData.email} for prompt
                                  assistance.
                                </span>
                              </div>
                            </div>
                          ) : (
                            openIndex === 1 && (
                              <div>
                                <div className="p-6 bg-gray-100 rounded-md shadow-md">
                                  <h1 className="text-xl font-bold text-primary mb-4">
                                    Easily Pay Your DigiPAKISTAN Admission Fee
                                  </h1>
                                  <p className="text-gray-600 text-[13px] mb-4">
                                    Pay your admission fee with any bank,
                                    anytime, and anywhere using mobile apps,
                                    internet banking, or ATMs. Follow these
                                    simple steps:
                                  </p>
                                  <div className="space-y-2">
                                    {paymentSteps.map((step, index) => (
                                      <div
                                        key={index}
                                        className="flex items-start space-x-4 bg-white p-4 rounded-md shadow-sm"
                                      >
                                        <div className="text-primary font-bold text-lg">
                                          {index + 1}.
                                        </div>
                                        <p className="text-gray-800 text-[13px]">
                                          {step}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                  <div className="mt-4 bg-primary/20 p-4 rounded-md">
                                    <h2 className="text-xl font-semibold text-primary">
                                      Important Note:
                                    </h2>
                                    <p className="text-gray-700 mt-2 text-[13px]">
                                      - The admission fee for DigiPAKISTAN is{" "}
                                      <strong>5,000 PKR</strong>, a one-time
                                      charge applicable regardless of the number
                                      of certifications or courses you enroll
                                      in. <br />-{" "}
                                      <strong>
                                        All training under the DigiPAKISTAN
                                        Program is completely free
                                      </strong>
                                      , with no additional charges for course
                                      materials or enrollment.
                                    </p>
                                  </div>

                                  <div className="mt-4 border text-[13px] p-3 rounded-md bg-primary/10 border-second">
                                    <span className="text-gray-700">
                                      <CiCircleInfo
                                        size={16}
                                        className="inline-flex text-second"
                                      />
                                      <span className="text-second mx-1">
                                        Note:
                                      </span>
                                      After successfully paying your DigiPAKISTAN
                                      admission fee, no additional steps are
                                      required from your end. Please allow up to
                                      30 minutes for processing. During this
                                      time, you should receive a confirmation
                                      email. If the email is not received within
                                      30 minutes, log in to your DigiPAKISTAN
                                      account to check your application status.
                                      If the confirmation is still unavailable,
                                      reach out to our support team at (
                                      {siteData.email}) for prompt assistance.
                                    </span>
                                  </div>
                                  <div className="flex justify-center">
                                    {payfastLoading ? (
                                      <button
                                        className="border mt-4 text-cen px-4 py-2 border-primary hover:text-white bg-gray-50 hover:bg-primary cursor-pointer duration-300 rounded-md"
                                        onClick={PayFast}
                                      >
                                        Procressing......
                                      </button>
                                    ) : (
                                      <button
                                        className="border mt-4 text-cen px-4 py-2 border-primary hover:text-white bg-gray-50 hover:bg-primary cursor-pointer duration-300 rounded-md"
                                        onClick={PayFast}
                                      >
                                        Proceed to Payment
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="w-full mt-5 lg:mt-0  lg:w-1/2 border-primary shadow-lg border max-h-[24rem] sticky top-[100px] lg:rounded-md ">
              <h1 className="text-2xl font-bold p-4 text-slate-800">Summary</h1>
              <hr />
              <div className="mt-5">
                <div className="overflow-x-auto">
                  <div className="min-w-full shadow-md rounded-lg">
                    <div className="flex flex-col text-slate-700">
                      <div className="px-4 pb-4 flex items-center justify-between">
                        <span className="font-bold">
                          Total: ({registrationData.selectedCourses.length}{" "}
                          certification)
                        </span>
                      </div>
                      <hr />
                      <div className="mt-4">
                        <div className="px-4 py-2 flex items-center justify-between">
                          <span className="font-bold">Form Id:</span>
                          <span className="text-[13px]">
                            2{registrationData.userId.slice(0, 3)}94...
                          </span>
                        </div>
                        <div className="px-4 py-2 flex items-center justify-between ">
                          <span className="font-bold">Admission Status:</span>
                          <span className="text-[13px] capitalize">
                            {registrationData.registrationStatus}
                          </span>
                        </div>
                        <div className="px-4 py-2">
                          <div className="flex justify-between">
                            <div className="flex flex-col">
                              <span className="font-bold">
                                Selected Certifications:
                              </span>
                              <span className="text-[12px] h-[3rem] mt-2">
                                {updateFormData.selectedCourses.map(
                                  (data, idxxx) => (
                                    <div
                                      key={idxxx}
                                      className="flex gap-1 items-center"
                                    >
                                      <GoDotFill size={12} />{" "}
                                      {data.courseTitle.slice(0, 40)}...
                                    </div>
                                  )
                                )}
                              </span>
                            </div>
                            {updateCourse && (
                              <div className="fixed inset-0 top-10 left-0 w-full h-screen bg-black/50 flex items-center justify-center z-50">
                                <div className="bg-white mx-5 z-50 lg:w-1/2 flex pb-5 flex-col rounded-lg shadow-lg text-center">
                                  <div className="w-full flex justify-between px-5 rounded-t-lg text-white py-3 bg-primary">
                                    <h6 className="font-medium">
                                      Edit Courses
                                    </h6>
                                    <button
                                      onClick={() => setUpdateCourse(false)}
                                      className="float-right bg-primary text-white rounded-lg"
                                    >
                                      <IoMdClose size={25} />
                                    </button>
                                  </div>
                                  <div>
                                    <div className="mb-4 py-6 mt-5 border p-5">
                                      <div className="flex flex-col gap-y-6">
                                        {/* First Course */}
                                        <div>
                                          <label className="block mb-1 font-medium">
                                            First Certification * (Please choose
                                            your certification carefully! Once
                                            submitted, changes cannot be made)
                                          </label>
                                          <div
                                            className={`w-full flex items-center focus-within:outline-primary text-gray-500 p-2 border rounded ${
                                              errors.course1
                                                ? "border-red-500"
                                                : "border-gray-300"
                                            }`}
                                          >
                                            <select
                                              name="course1"
                                              onChange={handleChange}
                                              value={updateFormData.course1}
                                              id="course1"
                                              className="w-full outline-none"
                                            >
                                              <option value="Select">
                                                Select
                                              </option>
                                              {getFilteredCourses([
                                                "course2",
                                                "course3",
                                              ]).map((data, idx) => (
                                                <option
                                                  value={data.courseTitle}
                                                  key={idx}
                                                >
                                                  {data.courseTitle}
                                                </option>
                                              ))}
                                            </select>
                                          </div>
                                        </div>

                                        {/* Second Course */}
                                        <div>
                                          <label className="mb-1 font-medium flex gap-1 items-center">
                                            <span>Second Certification *</span>
                                            <div className="text-[0.7rem] flex items-center gap-1">
                                              <span>(Optional)</span>
                                              <RiErrorWarningLine className="text-primary" />
                                            </div>
                                          </label>

                                          <div
                                            className={`w-full flex items-center focus-within:outline-primary text-gray-500 p-2 border rounded ${
                                              errors.course2
                                                ? "border-red-500"
                                                : "border-gray-300"
                                            }`}
                                          >
                                            <select
                                              name="course2"
                                              onChange={handleChange}
                                              value={updateFormData.course2}
                                              className="w-full outline-none"
                                              id="course2"
                                            >
                                              <option value="Select">
                                                Select
                                              </option>
                                              {getFilteredCourses([
                                                "course1",
                                                "course3",
                                              ]).map((data, idx) => (
                                                <option
                                                  value={data.courseTitle}
                                                  key={idx}
                                                >
                                                  {data.courseTitle}
                                                </option>
                                              ))}
                                            </select>
                                          </div>
                                        </div>

                                        {/* Third Course */}
                                        <div>
                                          <label className="mb-1 font-medium flex gap-1 items-center">
                                            <span>Third Certification *</span>
                                            <div className="text-[0.7rem] flex items-center gap-1">
                                              <span>(Optional)</span>
                                              <RiErrorWarningLine className="text-primary" />
                                            </div>
                                          </label>

                                          <div
                                            className={`w-full flex items-center focus-within:outline-primary text-gray-500 p-2 border rounded ${
                                              errors.course3
                                                ? "border-red-500"
                                                : "border-gray-300"
                                            }`}
                                          >
                                            <select
                                              name="course3"
                                              onChange={handleChange}
                                              value={updateFormData.course3}
                                              className="w-full outline-none"
                                              id="course3"
                                            >
                                              <option value="Select">
                                                Select
                                              </option>
                                              {getFilteredCourses([
                                                "course1",
                                                "course2",
                                              ]).map((data, idx) => (
                                                <option
                                                  value={data.courseTitle}
                                                  key={idx}
                                                >
                                                  {data.courseTitle}
                                                </option>
                                              ))}
                                            </select>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <button
                                      onClick={updateCoursesHandler}
                                      className="btn-primary mt-4 px-4 py-2 text-black rounded-lg"
                                    >
                                      {updateCoursesLoading
                                        ? "Saving...."
                                        : "Save Changes"}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                            <div className="flex flex-col">
                              <span onClick={toggleCourseUpdater}>
                                <div className="group relative cursor-pointer bg-zinc-300 p-2 rounded-full">
                                  {" "}
                                  <TiEdit className="" />
                                  <div className="bg-zinc-800 p-2 rounded-md group-hover:flex hidden absolute -top-2 -translate-y-full left-1/2 -translate-x-1/2">
                                    <span className="text-zinc-400 whitespace-nowrap">
                                      Edit
                                    </span>
                                    <div className="bg-inherit rotate-45 p-1 absolute bottom-0 translate-y-1/2 left-1/2 -translate-x-1/2"></div>
                                  </div>
                                </div>
                              </span>
                            </div>
                          </div>
                          <div className=" mt-6">
                            <hr className="border  my-3 border-gray-400" />
                            <div className="font-bold flex justify-between items-center">
                              <span>Admission Fee:</span> <span>PKR 5,000</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex my-10 p-10 rounded-md border-[4px] lg:mx-0 mx-5 shadow-lg">
            <div className="grid grid-cols-1 w-full md:grid-cols-2 lg:grid-cols-3 md:gap-0 gap-10">
              <div className="w-full relative z-10 items-center text-primary hover:scale-105 duration-500 gap-4 flex flex-col">
                <TbNotes size={100} />
                <h4 className="font-bold">Application Submitted</h4>
                <div className="absolute right-[6.1rem] hidden lg:block -top-3">
                  <IoIosCheckmarkCircle size={40} />
                </div>
              </div>
              <div className="w-full items-center text-primary z-10 relative hover:scale-105 duration-500 gap-4 flex flex-col">
                <MdPreview size={100} />
                <h4 className="font-bold">Application Status</h4>
                <div className="absolute right-[6.1rem] hidden lg:block -top-3">
                  <IoIosCheckmarkCircle size={40} />
                </div>
              </div>
              <div className="w-full items-center gap-4 hover:scale-105 duration-500 text-gray-600 flex flex-col">
                <IoMdCheckmarkCircleOutline size={100} />
                <h4 className="font-bold">Complete Enrollment</h4>
              </div>
            </div>
          </div>
        </>
      ) : registrationData.registrationStatus === "completed" ? (
        <div className="w-full py-10">
          <div className="max-w-6xl mx-5 lg:mx-auto">
            <div className="flex mb-5 animate-pulse justify-center">
              <Image
                src={"/email-verify.gif"}
                width={150}
                height={150}
                alt="gg"
              />
            </div>
            <div className="border-[3px] rounded-lg p-4 lg:p-10 shadow-lg">
              <div className="p-5 bg-primary/70 rounded-lg text-white">
                <p>
                  Congratulations on successfully completing the admission fee
                  payment for the DigiPAKISTAN Training Program. We are thrilled
                  to have you join our community of aspiring IT professionals.
                </p>
                <p className="mt-6 urdufont" dir="rtl">
                  کوڈی اسکلز ٹریننگ پروگرام کے لیے آپ کی داخلہ فیس کی کامیاب
                  ادائیگی پر ہم آپ کا خیرمقدم کرتے ہیں۔ ہمیں خوشی ہے کہ آپ ہماری
                  آئی ٹی پروفیشنلز کی خواہشمند برادری میں شمولیت اختیار کر رہے
                  ہیں۔
                </p>
                <br />
              </div>
              <div>
                <p className="mt-10">
                  {" "}
                  Your LMS (Learning Management System) account has been
                  activated, and you are just one step away from accessing a
                  world of learning. Your login credentials are as follows:
                </p>
                <br />
                <h1>
                  <span className="font-bold text-[20px]"> Email:</span>{" "}
                  {registrationData.portalDetails.email}
                </h1>
                <h1>
                  <span className="font-bold text-[20px]">Password:</span>{" "}
                  {registrationData.portalDetails.lms_password}
                </h1>
                <h1>
                  <span className="font-bold text-[20px]">Portal Link:</span>{" "}
                  <Link
                    href={"https://edu.DigiPAKISTAN.com"}
                    className="text-blue-500 font-medium underline"
                  >
                    https://edu.DigiPAKISTAN.com
                  </Link>
                </h1>
              </div>
              <br />
              <p>
                Please use these credentials to log in to the LMS portal and
                start exploring the available courses immediately. We encourage
                you to change your password upon your first login to ensure your
                account's security.
              </p>
              <br />
              <p>
                If you encounter any issues or have questions, please don't
                hesitate to reach out to our support team via{" "}
                {"support@DigiPAKISTAN.com"}.
              </p>
              <br />
              <p>
                Welcome aboard, and we look forward to supporting you through
                your learning journey!
              </p>
            </div>
            <div className="flex my-10 p-10 rounded-md border-[4px] shadow-lg">
              <div className="grid grid-cols-1 gap-10 w-full md:grid-cols-2 lg:grid-cols-3">
                <div className="w-full relative items-center text-primary hover:scale-105 duration-500 gap-4 flex flex-col">
                  <TbNotes size={100} />
                  <h4 className="font-bold">Application Submitted</h4>
                  <div className="absolute right-[6.1rem] hidden lg:block -top-3">
                    <IoIosCheckmarkCircle size={40} />
                  </div>
                </div>
                <div className="w-full items-center text-primary relative hover:scale-105 duration-500 gap-4 flex flex-col">
                  <GrNotes size={100} />
                  <h4 className="font-bold">Application Status</h4>
                  <div className="absolute right-[6.1rem] hidden lg:block -top-3">
                    <IoIosCheckmarkCircle size={40} />
                  </div>
                </div>
                <div className="w-full relative text-primary items-center gap-4 hover:scale-105 duration-500 flex flex-col">
                  <IoMdCheckmarkCircleOutline size={100} />
                  <h4 className="font-bold">Complete Enrollment</h4>
                  <div className="absolute right-[6.1rem] hidden lg:block -top-3">
                    <IoIosCheckmarkCircle size={40} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      <form
        id="PayFast_payment_form"
        name="PayFast-payment-form"
        method="POST"
        className="flex flex-col gap-2"
        action="https://ipg1.apps.net.pk/Ecommerce/api/Transaction/PostTransaction"
        style={{ display: "none" }}
      >
        <input
          type="text"
          name="CURRENCY_CODE"
          value={paymentData?.currency_code}
          readOnly
        />
        <input
          type="text"
          name="MERCHANT_ID"
          value={paymentData?.merchant_id}
          readOnly
        />
        <input type="text" name="TOKEN" value={paymentData?.token} readOnly />
        <input
          type="text"
          name="SUCCESS_URL"
          value={paymentData?.success_url}
          readOnly
        />
        <input
          type="text"
          name="FAILURE_URL"
          value={paymentData?.failed_url}
          readOnly
        />
        <input
          type="text"
          name="CHECKOUT_URL"
          value={paymentData?.checkout_url}
          readOnly
        />
        <input
          type="text"
          name="CUSTOMER_EMAIL_ADDRESS"
          value={paymentData?.email}
          readOnly
        />
        <input
          type="text"
          name="CUSTOMER_MOBILE_NO"
          value={paymentData?.phone}
          readOnly
        />
        <input
          type="text"
          name="TXNAMT"
          value={paymentData?.trans_amount}
          readOnly
        />
        <input
          type="text"
          name="BASKET_ID"
          value={paymentData?.basket_id}
          readOnly
        />
        <input
          type="text"
          name="ORDER_DATE"
          value={new Date().toISOString()}
          readOnly
        />
        <input
          type="text"
          name="SIGNATURE"
          value={"SOME-RANDOM-STRING"}
          readOnly
        />
        <input type="text" name="VERSION" value="MERCHANT-CART-0.1" readOnly />
        <input
          type="text"
          name="TXNDESC"
          value="Item Purchased from Cart"
          readOnly
        />
        <input type="text" name="PROCCODE" value="00" readOnly />
        <input type="text" name="TRAN_TYPE" value="ECOMM_PURCHASE" readOnly />
        <input type="text" name="STORE_ID" value={""} readOnly />
        <input type="text" name="RECURRING_TXN" value={"false"} readOnly />
      </form>
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            PayProNEXT_API();
          }}
          className="hidden"
        >
          <input
            type="text"
            name="userId"
            placeholder="User ID"
            value={formData.userId}
            onChange={handleInputChangePayPro}
            required
          />
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleInputChangePayPro}
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleInputChangePayPro}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChangePayPro}
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleInputChangePayPro}
            required
          />
          <button type="submit">Generate Consumer ID</button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationPendingClientSide;
