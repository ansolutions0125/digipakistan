import Cookies from "js-cookie";
import Link from "next/link";
import React from "react";
import { FaRegUserCircle } from "react-icons/fa";

const MobileProfileButton = ({
  userData,
  fetchedUser,
  fetchUserRegistrationDatae,
}) => {
  const HandleLogout = () => {
    Cookies.remove("user_data");
    window.location.href = "/";
  };
  return (
    <div>
      {userData ? (
        <div className="relative group hover:text-primary duration-300 text-black cursor-pointer">
          <div className="flex items-center gap-2">
            <div className="">
              <FaRegUserCircle size={26} />
            </div>
            <h2 className="w-full">{userData?.firstName}</h2>
          </div>
          <div className="absolute right-1 z-50 top-5 -mt-4 py-10">
            <ul className="py-2 bg-white w-[200px] rounded-md shadow-lg hidden group-hover:block">
              <Link
                 href={fetchUserRegistrationDatae?.registrationStatus === "pending"
                  ? `/registration-status/${userData?.uid}`
                  : fetchUserRegistrationDatae?.registrationStatus ===
                    "approved"
                  ? `/registration-status/${userData?.uid}`
                  : fetchUserRegistrationDatae?.registrationStatus ===
                    "completed"
                  ? `/registration-status/${userData?.uid}`
                  : fetchUserRegistrationDatae?.registrationStatus ===
                    undefined
                  ? "/registration"
                  : "/registration"}
              >
                <li className="px-4 py-2 text-black hover:translate-x-2 duration-500 hover:text-primary">
                  Admission Status
                </li>
              </Link>
              <button onClick={HandleLogout}>
                <li className="px-4 py-2 text-black hover:translate-x-2 duration-500 hover:text-primary">
                  Logout
                </li>
              </button>
            </ul>
          </div>
        </div>
      ) : (
        <div className="flex gap-1">
          {/* <Link
            href={"/registration"}
            className="w-full flex gap-1 text-[12px] text-center py-1 px-2 border border-primary font-semibold rounded-full text-primary"
          >
           <span className=""> Register </span>
          </Link> */}
          <Link
            href={"/signin"}
            className="w-full text-[12px] text-center py-2.5 px-4 border bg-primary rounded text-white"
          >
            Apply Now
          </Link>
        </div>
      )}
    </div>
  );
};

export default MobileProfileButton;
