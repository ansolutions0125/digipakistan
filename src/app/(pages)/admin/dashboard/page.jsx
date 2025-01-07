"use client";

import React, { useEffect, useState } from "react";
import { RiAdminFill } from "react-icons/ri";
import { FaRegRegistered, FaUsers, FaWpforms } from "react-icons/fa";
import { MdOutlinePayments, MdSmsFailed } from "react-icons/md";
import Link from "next/link";
import {
  getAllAdmins,
  getAllUsers,
  getLatestPayments,
  getAllCourses,
  getLatestBundlePayments,
  getAllBundle,
} from "../../../../Backend/firebasefunctions";
import DashboardNavbar from "../../../../components/AdminDashboard/DashboardNavbar";
import Sidebar from "../../../../components/AdminDashboard/Sidebar";
import { ToastContainer } from "react-toastify";
import AdminProtectedRoutes from "@/ProtectedRoutes/AdminProtectedRoutes";

const Admindashboard = () => {
  const [adminsData, setAdminsData] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [todayregistrations, setTodayregistrations] = useState(0);
  const [yesterdayregistrations, setYesterdayregistrations] = useState(0);
  const [onlineTestsResults, setOnlineTestsResults] = useState([]);
  const [todayonlineTestsResults, setTodayOnlineTestsResults] = useState(0);
  const [yesterdayonlineTestsResults, setYesterdayonlineTestsResults] =
    useState(0);
  const [paymentVerificationRequest, setPaymentVerificationRequest] = useState(
    []
  );
  const [todaypaymentVerificationRequest, setTodaypaymentVerificationRequest] =
    useState(0);
  const [
    yesterdaypaymentVerificationRequest,
    setYesterdaypaymentVerificationRequest,
  ] = useState(0);
  const [allUsers, setAllUsers] = useState([]);
  const [todayAllUsers, setTodayAllUsers] = useState(0);
  const [yesterdayAllUsers, setYesterdayAllUsers] = useState(0);
  const [allUsersWhoFailedTheOnlineTest, setAllUsersWhoFailedTheOnlineTest] =
    useState([]);
  const [
    todayUsersWhoFailedTheOnlineTest,
    setTodayUsersWhoFailedTheOnlineTest,
  ] = useState(0);
  const [
    yesterdayUsersWhoFailedTheOnlineTest,
    setYesterdayUsersWhoFailedTheOnlineTest,
  ] = useState(0);
  const [isModalSellAllAdminsOpen, setSellAllAdmins] = useState(false);
  const [sellContacts, setSellContacts] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const regData = await getLatestPayments();
      setRegistrations(regData.data);
      setTodayregistrations(regData.todayCount);
      setYesterdayregistrations(regData.yesterdayCount);

      const adminData = await getAllAdmins();
      setAdminsData(adminData.data);

      const paymentData = await getLatestBundlePayments();
      setPaymentVerificationRequest(paymentData.data);
      setTodaypaymentVerificationRequest(paymentData.todayCount);
      setYesterdaypaymentVerificationRequest(paymentData.yesterdayCount);

      const testData = await getAllCourses();
      setOnlineTestsResults(testData.data);
      setTodayOnlineTestsResults(testData.todayCount);
      setYesterdayonlineTestsResults(testData.yesterdayCount);

      const usersData = await getAllUsers();
      setAllUsers(usersData.data);
      setTodayAllUsers(usersData.todayCount);
      setYesterdayAllUsers(usersData.yesterdayCount);

      const failedTestData = await getAllBundle();
      setAllUsersWhoFailedTheOnlineTest(failedTestData.data);
      setTodayUsersWhoFailedTheOnlineTest(failedTestData.todayCount);
      setYesterdayUsersWhoFailedTheOnlineTest(failedTestData.yesterdayCount);
    };

    fetchData();
  }, []);

  const openSellAllAdminsModal = () => {
    setSellAllAdmins(true);
  };

  const closeSellAllAdminsModal = () => {
    setSellAllAdmins(false);
  };

  const handleSellAllAdminsOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeSellAllAdminsModal();
    }
  };

  const openSellContactsModal = () => {
    setSellContacts(true);
  };

  const closeSellContactsModal = () => {
    setSellContacts(false);
  };

  const handleSellContactsOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeSellContactsModal();
    }
  };

  console.log(registrations);

  return (
    <AdminProtectedRoutes>
      <div className="flex">
        <Sidebar />
        <div className="w-full h-full">
          <DashboardNavbar />
          <div className="bg-primary py-10 mb-16 rounded-b-lg">
            <div className="flex lg:flex-row flex-col items-center justify-between mx-10 gap-4 translate-y-20 z-50">
              <DashboardCard
                title="Site Admins"
                value={`Total ${adminsData.length}`}
                link="/admin/manage-admins"
                icon={<RiAdminFill size={25} />}
              />
              <DashboardCard
                title="Latest Courses Payments"
                value={`Total ${registrations.length}`}
                today={todayregistrations}
                yesterday={yesterdayregistrations}
                link="/admin/manage-payments"
                icon={<FaRegRegistered size={25} />}
              />
              <DashboardCard
                title="Latest C-Bundle Payments"
                value={`Total ${paymentVerificationRequest.length}`}
                today={todaypaymentVerificationRequest}
                yesterday={yesterdaypaymentVerificationRequest}
                link="/admin/manage-bundle-payments"
                icon={<MdOutlinePayments size={25} />}
              />
              <DashboardCard
                title="Total Users"
                value={`Total ${allUsers.length}`}
                today={todayAllUsers}
                yesterday={yesterdayAllUsers}
                link="/admin/manage-users"
                icon={<FaUsers size={25} />}
              />
            </div>
          </div>
          <div className="flex lg:flex-row flex-col items-center justify-between lg:mx-auto mx-5 lg:px-10 gap-4 z-50">
            <DashboardCard
              title="Total Courses"
              value={`Total ${onlineTestsResults.length}`}
              today={todayonlineTestsResults}
              yesterday={yesterdayonlineTestsResults}
              link="/admin/manage-course"
              icon={<FaWpforms size={25} />}
            />
            <DashboardCard
              title="Total Bundle Courses"
              value={`Total ${allUsersWhoFailedTheOnlineTest.length}`}
              today={todayUsersWhoFailedTheOnlineTest}
              yesterday={yesterdayUsersWhoFailedTheOnlineTest}
              link="/admin/manage-course-bundle"
              icon={<MdSmsFailed size={25} />}
            />
          </div>
          {/* Modal Overlays */}
          {isModalSellAllAdminsOpen && (
            <ModalOverlay onClick={handleSellAllAdminsOverlayClick} />
          )}
          {sellContacts && (
            <ModalOverlay onClick={handleSellContactsOverlayClick} />
          )}
        </div>
      </div>
    </AdminProtectedRoutes>
  );
};

const DashboardCard = ({ title, value, today, yesterday, link, icon }) => (
  <div className="bg-white p-5 w-full rounded-lg shadow-lg">
    <h3 className="basefont heading-text text-[0.8rem]">{title}</h3>
    <div className="flex items-center my-1 justify-between">
      <h2 className="basefont text-xl">{value}</h2>
      <h6 className="text-[0.65rem] text-gray-600">
        {today !== undefined && `today ${today} / yesterday ${yesterday}`}
      </h6>
    </div>
    <div className="text-[0.9rem] flex justify-between items-center secondfont text-gray-600">
      <Link href={link}>
        <button className="underline">See All</button>
      </Link>
      {icon}
    </div>
  </div>
);

// const LatestRegistrations = ({ registrations }) => (
//   <div className="m-10 max-w-6xl lg:mx-auto mx-5 lg:px-10">
//     <h2 className="mb-5 heading-text basefont text-2xl">
//       Latest Courses Payments
//     </h2>
//     <div className="border-gray-300 border max-h-[400px] overflow-y-auto">
//       <table className="w-full text-left">
//         <thead className="bg-white">
//           <tr>
//             <th className="px-6 py-5 text-[1rem] heading-text">UserId</th>
//             <th className="px-6 py-5 text-[1rem] heading-text">Payment Id</th>
//             <th className="px-6 py-5 text-[1rem] heading-text">Payment Fee</th>
//             <th className="px-6 py-5 text-[1rem] heading-text">
//               Payment Status
//             </th>
//             <th className="px-6 py-5 text-[1rem] heading-text">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {registrations.length === 0 ? (
//             <tr>
//               <td
//                 colSpan="5"
//                 className="bg-white py-10 text-center text-[0.8rem]"
//               >
//                 No Data Yet.
//               </td>
//             </tr>
//           ) : (
//             registrations.map((data, idx) => (
//               <tr key={idx} className="bg-white border">
//                 <td className="px-6 py-3 text-[0.8rem]">{data.userData.uid}</td>
//                 <td className="px-6 py-3 text-[0.8rem]">{data.paymentId}</td>
//                 <td className="px-6 py-3 text-[0.8rem]">{data.amount}</td>
//                 <td className="px-6 py-3 text-[0.8rem]">
//                   {data.paymentStatus}
//                 </td>
//                 <td className="px-6 py-3 flex gap-2">
//                   <Link href={`/admin/manage-payments`}>
//                     <button className="text-primary border border-primary rounded-lg bg-blue-50 px-5 py-2">
//                       Manage
//                     </button>
//                   </Link>
//                 </td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>
//     </div>
//   </div>
// );

const ModalOverlay = ({ onClick }) => (
  <div
    className="fixed inset-0 w-full z-50 flex items-center justify-center bg-black bg-opacity-50"
    onClick={onClick}
  />
);

export default Admindashboard;
