"use client";

import { firestore } from "@/Backend/Firebase";
import userHooks from "@/Hooks/userHooks";
import jsPDF from "jspdf";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import courses from "../Courses/Courses";
import { filter } from "lodash";

const GenerateChallan = () => {
  const [userInformation, setUserInformation] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userData } = userHooks();
  const [selectedGateway, setSelectedGateway] = useState("001");
  const [gatewayLoading, setGatewayLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("PayFast");
  const [filteredC,setFilteredCourses]=useState([]);
  useEffect(() => {
    const getUserData = async () => {
      const usersRef = collection(firestore, "user_information");
      const userQuery = query(usersRef, where("userId", "==", userData?.id));
      const querySnapshot = await getDocs(userQuery);
      if (!querySnapshot.empty) {
        try {
          const userDoc = querySnapshot.docs[0].data();
          setUserInformation(userDoc);
          const filteredCourses = courses.filter((data) =>
            userDoc?.selectedCourses?.includes(data.courseTitle)
          );
          setFilteredCourses(filteredCourses)
        } catch (error) {
          console.log(error);
        }
      }
      setLoading(false);
    };
    getUserData();
  }, [userData]);

console.log(filteredC); 
  const courseBundle = userInformation?.selectedCourses
    ?.map((data, idx) => data)
    .join(", ");
  // console.log(courseBundle);

  
  
 
  

  const [payfastLoading, setPayfastLoading] = useState(false);
  // async function PayFast() {
  //   setPayfastLoading(true);
  //   const res = await fetch("/api/payfast/payment-process", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       user_id: registrationData.userId,
  //       lmsuserid: registrationData.portalDetails.id,
  //       course: registrationData.selectedCourses,
  //       email: registrationData.email,
  //       phone: registrationData.phone,
  //     }),
  //   });

  //   const data = await res.json();
  //   console.log(data);
  //   if (data.checkout_url) {
  //     setPaymentData(data); // Store the data to be used in form submission
  //   }
  //   setPayfastLoading(false);
  // }

  // Generate challan
  const [challanData, setChallanData] = useState(null);

  console.log(challanData);
  const handleChallanGenerate = async () => {
    try {
      const res = await fetch("/api/generate-challan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userInformation.userId,
          name: userInformation.fullName,
          fatherName: userInformation.fatherName,
          email: userInformation.email,
          phone: userInformation.contactNo,
          amount: 1,
          dueDate: userInformation.dueDate,
          // courses: userInformation.selectedCourses,
        }),
      });
      const data = await res.json();
      setChallanData(data);
      ChallanGenerator(data);
    } catch (error) {
      console.log("Error while generating challan:", error);
    }
  };

  // Genreator

  const ChallanGenerator = (challanData) => {
    const doc = new jsPDF("landscape", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const sectionWidth = pageWidth / 3;

    const drawSection = (title, offsetX) => {
      const marginY = 40;

      doc.setFont("sans-serif", "bold");
      doc.setFontSize(20);
      doc.text("DigiPAKISTAN", offsetX + sectionWidth / 2, 15, {
        align: "center",
      });
      doc.setFontSize(16);
      doc.text("Course Fee Challan", offsetX + sectionWidth / 2, 25, {
        align: "center",
      });

      doc.setFontSize(14);
      doc.text(title, offsetX + 10, marginY);

      // Add challan details
      doc.setFont("sans-serif", "normal");
      doc.setFontSize(10);
      const maxTextWidth = sectionWidth; // Ensure text stays within the section

      doc.setFont("sans-serif", "bold"); // Set key to bold
      doc.text("Invoice ID:", offsetX + 10, marginY + 10);
      doc.setFont("sans-serif", "normal"); // Set value to normal
      doc.text(challanData.challanID, offsetX + 40, marginY + 10);

      doc.setFont("sans-serif", "bold");
      doc.text("Name:", offsetX + 10, marginY + 15);
      doc.setFont("sans-serif", "normal");
      doc.text(challanData.name, offsetX + 40, marginY + 15);

      doc.setFont("sans-serif", "bold");
      doc.text("Father Name:", offsetX + 10, marginY + 20);
      doc.setFont("sans-serif", "normal");
      doc.text(challanData.fatherName, offsetX + 40, marginY + 20);

      doc.setFont("sans-serif", "bold");
      doc.text("Email:", offsetX + 10, marginY + 25);
      doc.setFont("sans-serif", "normal");
      doc.text(challanData.email, offsetX + 40, marginY + 25);

      doc.setFont("sans-serif", "bold");
      doc.text("Phone:", offsetX + 10, marginY + 30);
      doc.setFont("sans-serif", "normal");
      doc.text(challanData.phone, offsetX + 40, marginY + 30);

      doc.setFont("sans-serif", "bold");
      doc.text("Amount (PKR):", offsetX + 10, marginY + 35);
      doc.setFont("sans-serif", "normal");
      doc.text(challanData.amount.toString(), offsetX + 40, marginY + 35);

      doc.setFont("sans-serif", "bold");
      doc.text("Due Date:", offsetX + 10, marginY + 40);
      doc.setFont("sans-serif", "normal");
      doc.text(challanData.dueDate, offsetX + 40, marginY + 40);

      // Add a dotted vertical line to separate sections (except the last one)
      if (offsetX + sectionWidth < pageWidth) {
        doc.setLineDash([2, 2], 0); // Set dotted line style
        doc.line(
          offsetX + sectionWidth,
          30,
          offsetX + sectionWidth,
          pageHeight - 20
        ); // Dotted line
      }
    };

    // Draw three sections
    drawSection("Student Copy", 10);
    drawSection("Bank Copy", 10 + sectionWidth);
    drawSection("Company Copy", 10 + 2 * sectionWidth);

    // Add a note at the bottom of the page
    doc.setFont("sans-serif", "italic", "bold");
    doc.setFontSize(10);
    doc.text(
      "Note:Please deposit the Fee challan in any Meezan Bank Branch and keep the receipt as a proof for the payment.",
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" }
    );

    doc.save(`DigiPAKISTAN_fee_challan_${challanData.name}.pdf`);
  };

  // Generate challan

  const handleGatewaySelection = (gatewayName) => {
    setSelectedGateway(gatewayName);
    console.log(`Selected Gateway: ${gatewayName}`);
  };

  if (!userData) return null;

  const payload = {
    websiteId: "3abbd8db-5e4d-4600-abb4-f569074e60a8",
    requestedPaymentGateway: selectedGateway,
    user: userInformation?.fullName,
    course: {
      courseTitle: "Test Gateway",
      price: 1,
    },
  };

  const handlePaymentRequest = async () => {
    try {
      setGatewayLoading(true);

      const response = await fetch(
        "https://eduportal.com.pk/api/payment-management/payment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-payment-validation-token":
              "bcd97901-0358-4730-a5cc-03e434e6c941",
          },
          body: JSON.stringify(payload),
        }
      );

      // Check for network or server errors
      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          "API Error:",
          response.status,
          response.statusText,
          errorText
        );
        return;
      }

      const data = await response.json();

      // Debugging: Log the response
      console.log("API Response:", data);


    } catch (err) {
      console.error("Payment Request Error:", err.message || err);
    } finally {
      setGatewayLoading(false);
    }
  };


  return (
    <div className="flex items-center max-w-7xl lg:mx-auto justify-center p-3 lg:p-5">
      <div className="w-full min-h-screen rounded-xl bg-white flex flex-col text-center">
        <h1 className="text-2xl lg:text-5xl font-bold rounded ">
          Follow Further Procedure for Seat Confirmation
        </h1>
        <p className="text-justify py-5">
          Students who are approved will now have to follow further instructions
          of Registration Charges submission for their seat confirmation. Late
          Registration charges Submission to the due date will result in
          cancellation of Admission. Students have to submit minor registration
          charges for admission into the selected program. The Registration
          charges for all programs including Technical, Non-Technical &
          Associate Certification Programs will be{" "}
        </p>
        <div className="flex flex-col">
          <h1 className="font-bold font-serif lg:text-2xl">
            Charges for Fast Track Courses
          </h1>
          <p className=""> Registration:---Rs.0/-</p>
          <p className="">Course Fee: Rs.3500/-</p>
        </div>
        <div className="flex flex-col mt-6">
          <h1 className="font-bold font-serif lg:text-2xl">
            Charges for Assoiciate Courses
          </h1>
          <p className=""> Registration:---Rs.0/-</p>
          <p className="">Course Fee: Rs.4500/-</p>
        </div>

        <p className="text-justify my-4 text-primary">
          Pakistani Students can Submit their Registration Fee Voucher at any
          HBL Branch in Pakistan or can pay their registration charges via
          Online Banking. Overseas Students can submit their registration
          charges via Online Banking for Overseas Method.
        </p>

        {/* <div className="flex gap-3 mt-4 flex-col lg:flex-row items-center justify-center">
          <button
            disabled={gatewayLoading}
            onClick={() => (
              handleGatewaySelection("001"), handlePaymentRequest()
            )}
            className="relative gap-3 w-32 disabled:bg-slate-500 justify-center items-center bg-primary hover:bg-second p-3 text-white rounded flex"
          >
            {gatewayLoading && selectedGateway === "001" ? (
              <div role="status">
                <svg
                  aria-hidden="true"
                  class="w-5 h-5 text-gray-200 dark:text-blue-200 animate-spin  fill-blue-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span class="sr-only">Loading...</span>
              </div>
            ) : (
              <div className="flex gap-3 items-center">
                <img src="/payfast.png" className="w-5 h-5 " alt="" /> PayFast
              </div>
            )}
          </button>
          <button
            onClick={() => (
              handleGatewaySelection("002"), handlePaymentRequest()
            )}
            className="relative gap-3 w-40 disabled:bg-slate-500 justify-center items-center bg-primary hover:bg-second p-3 text-white rounded flex"
          >
            {gatewayLoading && selectedGateway === "002" ? (
              <div role="status">
                <svg
                  aria-hidden="true"
                  class="w-5 h-5 text-gray-200 dark:text-blue-200 animate-spin fill-blue-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span class="sr-only">Loading...</span>
              </div>
            ) : (
              <div className="flex gap-3 items-center">Generate Challan</div>
            )}
          </button>
        </div> */}

        <div className=" mx-auto bg-gray-50 shadow-md p-5 rounded border border-primary">
          <h1 className="mb-10 text-lg font-bold font-serif">
            Please Select Payment Method
          </h1>

          <div className="flex items-center flex-col lg:flex-row justify-center gap-3">
            {" "}
            <button
              disabled={gatewayLoading}
              onClick={() => (
                handleGatewaySelection("001"), setSelectedMethod("PayFast")
              )}
              className={`relative gap-3 w-40 ${
                selectedGateway === "001" ? "bg-primary text-white" : ""
              } justify-center items-center p-3 border-2 border-primary bg-gray-50 shadow-xl rounded flex`}
            >
              <div className="flex gap-3 items-center">
                <img src="/payfast.png" className="w-5 h-5 " alt="" /> PayFast
              </div>
            </button>
            <button
              onClick={() => (
                handleGatewaySelection("invoice"), setSelectedMethod("PSID")
              )}
              className={`relative gap-3 w-40 ${
                selectedGateway === "invoice" ? "bg-primary text-white" : ""
              } justify-center items-center p-3 border-2 border-primary bg-gray-50 shadow-xl rounded flex`}
            >
              <div className="flex gap-3 items-center">Generate Challan</div>
            </button>
          </div>
          <div className="mt-4 max-w-60 mx-auto">
            <button
              onClick={() => handlePaymentRequest()}
              className="bg-yellow-600 w-full hover:bg-second flex items-center justify-center text-white p-3 rounded"
            >
              {gatewayLoading ? (
                <div role="status">
                  <svg
                    aria-hidden="true"
                    class="w-6 h-6  text-gray-200 dark:text-blue-200 animate-spin  fill-blue-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span class="sr-only">Loading...</span>
                </div>
              ) : (
                `Pay ${"Rs.1"} via ${selectedMethod}`
              )}{" "}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="animate-pulse py-10 space-y-4">
            <div className="h-7 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/4"></div>
            <div className="h-5 bg-gray-200 rounded w-2/4"></div>
            <div className="h-10 bg-gray-200 rounded w-3/4"></div>
          </div>
        ) : (
          <div className="text-left mt-10">
            <h1 className="text-2xl font-bold mt-2">
              Name :{" "}
              <span className=" font-normal">
                {" "}
                {userInformation?.fullName}{" "}
              </span>
            </h1>
            <h1 className="text-2xl font-bold mt-2">
              Father Name :{" "}
              <span className=" font-normal">
                {" "}
                {userInformation?.fatherName}{" "}
              </span>
            </h1>
            <h1 className="text-2xl font-bold mt-2">
              Roll # :{" "}
              <span className="font-normal"> {userInformation?.rollno} </span>
            </h1>
            <div>
              <h1 className="text-2xl font-bold mt-2">Selected Course :</h1>
              <span>
                <ul className="p-4  list-disc">
                  {userInformation?.selectedCourses.map((data, idx) => {
                    return <li key={idx}>{data} </li>;
                  })}
                </ul>
              </span>
            </div>
            <h1 className="text-2xl font-bold mt-2">
  Total Price:{" "}
  <span className="font-normal">
  PKR /- {filteredC.reduce((total, course) => total + (course.coursePrice || 0), 0)}
  </span>
</h1>



            <h1 className="text-2xl font-bold mt-2">
              Complete Further Procedure Before due date :{" "}
              <span className=" font-normal"> {userInformation?.dueDate} </span>
            </h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateChallan;
