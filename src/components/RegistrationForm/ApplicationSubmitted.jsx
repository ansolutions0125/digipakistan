"use client";
import { firestore } from "@/Backend/Firebase";
import userHooks from "@/Hooks/userHooks";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { GoVerified } from "react-icons/go";
import { MdApproval, MdOutlinePending, MdPending, MdPendingActions } from "react-icons/md";
import CustomToast from "../CoustomToast/CoustomToast";


const ApplicationSubmitted = () => {
  const [loading, setLoading] = useState(true);
  const [userInformation, setUserInformation] = useState(null);
  const { userData } = userHooks();
  const [userDataa, setUserDataa] = useState(null);
const router  = useRouter();
const [toast, setToast] = useState({
  message: "",
  type: "",
  visible: false,
  duration: 5000,
});


console.log(userDataa);
  const getUser = async () => {
    const docRef = doc(firestore, "users", userData?.id);
    const userRef = await getDoc(docRef);
    const userr = userRef.data();
    setUserDataa(userr);
  };

  const showToast = (message, type = "info", duration = 20000) => {
    setToast({ message, type, visible: true, duration });
};

useEffect(()=>{
  if(!userData ){
    router.back();
  }
},[userData]);


  useEffect(() => {
    const getUserData = async () => {
      setLoading(true);
      const usersRef = collection(firestore, "user_information");
      const userQuery = query(usersRef, where("userId", "==", userData?.id));
      const querySnapshot = await getDocs(userQuery);
      if (!querySnapshot.empty) {
        try {
          const userDoc = querySnapshot.docs[0].data();
          setUserInformation(userDoc);
        } catch (error) {
          console.log(error);
        }
      }
      setLoading(false);
    };

    getUserData();
    getUser();
  }, [userData]);
  
  const handleCloseToast = () => {
    setToast({ ...toast, visible: false });
};


  return (
    <div className="flex items-center max-w-6xl lg:mx-auto justify-center p-3 lg:p-5">
      <div className="w-full min-h-screen rounded-xl bg-white flex flex-col  text-center p-5 ">
        {userDataa?.registrationStatus === "pending" ? (
          <h1 className=" text-justify flex gap-5 bg-blue-100 rounded lg:p-10 p-3 font-normal ">
            <span>
              {" "}
              {/* <img src="/loading_gif.gif" className="w-20 " alt="Wait..." /> */}
              <MdPendingActions className="text-3xl text-red-700"/>   
            </span>
            Your application has been submitted successfully to the DigiPAKISTAN
            National Skills Development Program. You have to wait for 24hrs for
            the application status. Admission Department will evaluate your
            application & update the Applicant Admission Status within next
            24hrs to this portal. Login after 24hrs, in case your application
            approved you have to proceed further & if not eligible try next
            time.
          </h1>
        ) : (
          <h1 className=" text-justify flex gap-2 items-center bg-green-100 rounded lg:p-10 p-3 font-normal ">
            <span>
              {" "}
              {/* <img src="/tick_gif.gif" className="w-10 " alt="Wait..." />{" "} */}
              <GoVerified className="text-2xl text-primary"/>
            </span>
            Your application have approved successfully, Please complete the
            further process for start your new learning journey.
          </h1>
        )}

        {loading ? (
          <div className="animate-pulse py-10 space-y-4">
            <div className="h-7 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/4"></div>
            <div className="h-5 bg-gray-200 rounded w-2/4"></div>
            <div className="h-10 bg-gray-200 rounded w-3/4"></div>
          </div>
        ) : (
          <div className="text-left mt-10">
            <h1 className="lg:text-4xl text-xl flex gap-4 font-bold mt-2">
              Application Status :{" "}
              {userDataa?.registrationStatus === "pending" && (
                <span className=" font-normal text-sm lg:text-2xl">
                  {userDataa?.registrationStatus === "pending" ? (
                    <div className="flex gap-2 items-center">
                      <h1>Pending...</h1>
                      {/* <img className="h-9 w-9" src="/cross.png" alt="" /> */}
                    <MdPendingActions className="text-3xl text-red-700"/>   

                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <h1>Approved...</h1>
                      {/* <img className="h-9 w-9" src="/check.png" alt="" /> */}
                     <GoVerified className="text-2xl text-primary"/>
                    </div>
                  )}
                </span>
              )}
              {userDataa?.registrationStatus === "approved" && (
                <span className=" font-normal text-sm lg:text-2xl">
                  {userDataa?.registrationStatus === "approved" ? (
                    <div className="flex items-center gap-3" >
                      <h1>Approved</h1>
                      {/* <img className="h-9 w-9" src="/check.png" alt="" /> */}
              <GoVerified className="text-2xl text-primary"/>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <h1>Pending...</h1>
                      {/* <img className="h-9 w-9" src="/cross.png" alt="" /> */}
                    <MdPendingActions className="text-3xl text-red-700"/>   

                    </div>
                  )}
                </span>
              )}
              {userDataa?.registrationStatus === "completed" && (
                <span className=" font-normal text-sm lg:text-2xl">
                  {userDataa?.registrationStatus === "completed" ? (
                    <div className="flex items-center gap-2">
                      <h1>Completed...</h1>
                      {/* <img className="h-9 w-9" src="/check.png" alt="" /> */}
                      <GoVerified className="text-2xl text-primary"/>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <h1>Approved...</h1>
                      {/* <img className="h-9 w-9" src="/check.png" alt="" /> */}
                      <GoVerified className="text-2xl text-primary"/>
                    </div>
                  )}
                </span>
              )}
            </h1>
            <h1 className="lg:text-4xl text-xl font-bold mt-2">
              Name :{" "}
              <span className=" font-normal text-sm lg:text-2xl">
                {userInformation?.fullName}
              </span>
            </h1>
            <h1 className="lg:text-4xl text-xl font-bold mt-2">
              Father Name :{" "}
              <span className=" font-normal text-sm lg:text-2xl">
                {userInformation?.fatherName}{" "}
              </span>
            </h1>
            <h1 className="lg:text-4xl text-xl font-bold mt-2">
              Roll # :{" "}
              <span className=" font-normal text-sm lg:text-2xl">
                {userInformation?.rollno}{" "}
              </span>
            </h1>
            <h1 className="lg:text-4xl text-xl font-bold mt-2">
              Complete Further Procedure Before due date :{" "}
              <span className=" font-normal text-sm lg:text-2xl">
                {userInformation?.dueDate}{" "}
              </span>
            </h1>
          </div>
        )}

        <div className="mt-10">
          <Link
            className="bg-primary hover:bg-second p-3 text-white"
            href={"/registration/generate-challan"}
          >
            Next
          </Link>
        </div>
      </div>
      {toast.visible && (
          <CustomToast
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={handleCloseToast}
          />
        )}
    </div>
  );
};

export default ApplicationSubmitted;
