import React from "react";
import useAdmin from "../../Hooks/adminHooks";

const DashboardNavbar = () => {
  const { adminData } = useAdmin();
  return (
    <div className="bg-white py-3 top-0 sticky z-50 shadow-lg w-full">
      <div className="max-w-6xl lg:mx-auto mx-5">
        <div className="flex w-full px-10 justify-between items-center">
          <h2 className="text-lg font-bold">DigiPAKISTAN Dashboard</h2>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 border rounded-full border-black">
              <img
                src="https://static.vecteezy.com/system/resources/thumbnails/005/544/718/small_2x/profile-icon-design-free-vector.jpg"
                alt="userimage"
                className="rounded-full w-full h-full object-cover"
              />
            </div>
            <div className="flex">
              Logined as {adminData?.role}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardNavbar;
