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
  setDoc,
  where,
} from "firebase/firestore";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import courses from "../Courses/Courses";
import { filter } from "lodash";
import { BsCopy } from "react-icons/bs";
import { MdLibraryAddCheck } from "react-icons/md";

const GenerateChallan = () => {
  const [userInformation, setUserInformation] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userData } = userHooks();
  const [selectedGateway, setSelectedGateway] = useState("101");
  const [gatewayLoading, setGatewayLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("PayFast");
  const [filteredC,setFilteredCourses]=useState([]);
  const [payproId,setPayproId] =useState("");
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
  const [payfastLoading, setPayfastLoading] = useState(false);
  const [challanData, setChallanData] = useState({
    challanId:payproId,
    name: userInformation?.fullName,
          fatherName: userInformation?.fatherName,
          email: userInformation?.email,
          phone: userInformation?.contactNo,
          amount: 100,
          dueDate: userInformation?.dueDate,
          userId: userInformation?.userId,
          
  });
  console.log(challanData);
  // const handleChallanGenerate = async () => {
  //   try {
  //     const res = await fetch("/api/generate-challan", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         userId: userInformation.userId,
  //         name: userInformation.fullName,
  //         fatherName: userInformation.fatherName,
  //         email: userInformation.email,
  //         phone: userInformation.contactNo,
  //         amount: 100,
  //         dueDate: userInformation.dueDate,
  //       }),
  //     });
  //     const data = await res.json();
  //     setChallanData(data);
  //     ChallanGenerator(data);
  //   } catch (error) {
  //     console.log("Error while generating challan:", error);
  //   }
  // };

  // Genreator
console.log(userInformation)
const ChallanGenerator = () => {
  if (!userInformation) {
    console.error("User information is missing.");
    return;
  }

  const doc = new jsPDF("landscape", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20; // 2-inch margins on both sides
  const sectionWidth = (pageWidth - margin * 2) / 3;

  const drawSection = (title, offsetX) => {
    const marginY = 80; // Starting Y position for content

    // Add logo
    const logoUrl = "https://res.cloudinary.com/doregjvid/image/upload/v1736933713/iav1i5iqm4zbgn8katxg.jpg"; // Replace with your logo URL
    doc.addImage(logoUrl, "PNG", offsetX + sectionWidth / 2 - 15, 15, 30, 30);

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("DigiPAKISTAN", offsetX + sectionWidth / 2, 50, { align: "center" });
    doc.text("Course Fee Challan", offsetX + sectionWidth / 2, 60, { align: "center" });

    // Subtitle
    doc.setFontSize(12);
    doc.text(title, offsetX + 20, marginY);
    doc.setFont("helvetica", "normal");

    // Details
    const details = [
      { key: "Invoice ID:", value: payproId },
      { key: "Name:", value: userInformation?.fullName },
      { key: "Father Name:", value: userInformation?.fatherName },
      { key: "Email:", value: userInformation?.email },
      { key: "Phone:", value: userInformation?.contactNo },
      { key: "Amount (PKR):", value: "3500" },
      { key: "Due Date:", value: userInformation?.dueDate },
    ];

    details.forEach((detail, index) => {
      const keyX = offsetX + 1; // Position for key
      const valueX = offsetX + 30; // Position for value
      const yPos = marginY +10 + index * 10;

      // Truncate or wrap value if it exceeds the width
      const wrappedValue = doc.splitTextToSize(detail.value || "N/A", sectionWidth - 10);

      doc.text(detail.key, keyX, yPos); // Key
      doc.text(wrappedValue, valueX, yPos); // Wrapped value
    });

    // Draw a vertical line between sections
    if (offsetX + sectionWidth < pageWidth - margin) {
      doc.setLineDash([2, 2], 0);
      doc.line(offsetX + sectionWidth, 30, offsetX + sectionWidth, pageHeight - margin);
    }
  };

  // Draw sections
  drawSection("Student Copy", margin);
  drawSection("Bank Copy", margin + sectionWidth);
  drawSection("Company Copy", margin + 2 * sectionWidth);

  // Footer Note
  doc.setFont("helvetica", "italic");
  doc.setFontSize(10);
  doc.text(
    "Note: You can Pay this invoice via on biller from any acoount.",
    pageWidth / 2,
    pageHeight - 10,
    { align: "center" }
  );

  // Save the PDF
  doc.save(`DigiPAKISTAN_fee_challan_${userInformation.fullName}.pdf`);
};




  // Generate challan

  const handleGatewaySelection = (gatewayName) => {
    setSelectedGateway(gatewayName);
    console.log(`Selected Gateway: ${gatewayName}`);
  };
  if (!userData) return null;






//
const totalPrice = filteredC.reduce((total, course) => total + (course.coursePrice || 0), 0);


//


const payload={
  websiteId: "911", 
  requestedPaymentGateway:"101",
  course: {
    title: "Microsoft 365 Fundamentals (MS-900)", 
    price: 2000, 
    courseId: "2980056",
    id:"machine_learning",
    thumbnailUrl:"https://firebasestorage.googleapis.com/v0/b/eskills-program-ansolutions.appspot.com/o/courseThumbnail%2FThumbnail%20-%20Microsoft%20Certifications%20-%2010.jpg?alt=media&token=8a91fa62-6aee-4b51-9208-05174e647d84"
    },
    user: {
      userId : userData?.portalDetails?.id,
      fullName:`${userData?.firstName}  ${userData?.lastName}` ,
      email:userData?.email,
      address:"Wow Streen lahore",
      phone:"2020445324"
    }
  }

  const handlePaymentRequest = async () => {
    try {
      setGatewayLoading(true);
      const response = await fetch(
        "https://eduportal.com.pk/api/payment-management/payment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
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

      
     
      setPayproId(data.payProId);
      
      const payProData = doc(firestore,"payprodata",data.payproId);
      const snapshot =await setDoc(payProData,{
        payproId : data.payProId,
        name:userInformation?.fullName,
        fatherName:userInformation?.fatherName,
        email:userData?.email,
        userId:userData?.id,
        status:"pending",
        amount:totalPrice,
      });
      console.log("new collection added",snapshot)
    } catch (err) {
      console.error("Payment Request Error:", err.message || err);
    } finally {
      setGatewayLoading(false);
    }
  };

  const psidRef = useRef();
  const [isCopied,setIsCopied] = useState(false);
const copyToClipboard =(e)=>{

  if(psidRef.current){
    const textToCopy = psidRef.current.innerText || psidRef.current.value;
    navigator.clipboard.writeText(textToCopy)
    .then(() => {
      setIsCopied(true); // Show the copied message
      setTimeout(() => setIsCopied(false), 2000); // Hide the message after 2 seconds
    })
    .catch((err) => {
      console.error("Failed to copy text: ", err);
    });
  }
  

}


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


        <div className=" mx-auto bg-gray-50 shadow-md p-5 rounded border border-primary">
          <h1 className="mb-10 text-lg font-bold font-serif">
            Please Select Payment Method
          </h1>

          <div className="flex items-center flex-col lg:flex-row justify-center gap-3">
            {" "}
           
            <button
              onClick={() => (handlePaymentRequest(), handleGatewaySelection("101"), setSelectedMethod("PayPro")
              )}
              disabled = {payproId}
              className={`relative gap-3 w-40 ${
                selectedGateway === "101" ? "bg-primary text-white" : ""
              } justify-center disabled:bg-gray-700 items-center p-3 border-2 border-primary bg-gray-50 shadow-xl rounded flex`}
            >
               {gatewayLoading ? (
                <div role="status">
                  <svg
                    aria-hidden="true"
                    className="w-6 h-6  text-gray-200 dark:text-blue-200 animate-spin  fill-blue-600"
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
                </div>
              ) : (
                `Generate PSID`
              )}{" "}
            </button>
          </div>
          {payproId && <div className="flex items-center justify-center border rounded p-3 mt-5">
            <input type="text" value={payproId} ref={psidRef} className=" rounded bg-transparent outline-none border-0"/>
           {isCopied ? <MdLibraryAddCheck className="text-green-700"/> :  <BsCopy onClick={()=>copyToClipboard()} className="cursor-pointer hover:text-green-600 duration-600"/>}
            </div>}
            {payproId && <button className="bg-primary text-white p-3 mt-5" onClick={ChallanGenerator}>
              Download Challan
              </button>}
       
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
  PKR /- {totalPrice}
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
