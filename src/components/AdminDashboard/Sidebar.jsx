"use client";

import React, { useState, useEffect } from "react";
import {
  IoIosAdd,
  IoIosArrowDown,
  IoIosArrowForward,
  IoIosSettings,
  IoIosVideocam,
} from "react-icons/io";
import {
  MdAdminPanelSettings,
  MdAttachEmail,
  MdDashboard,
  MdManageAccounts,
  MdModeEdit,
  MdSettingsSuggest,
} from "react-icons/md";
import { TbLogout } from "react-icons/tb";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { RiArrowGoBackLine } from "react-icons/ri";
import { FaRegRegistered, FaUser } from "react-icons/fa";
import { CgWebsite } from "react-icons/cg";
import { SiCoursera, SiCoveralls } from "react-icons/si";
import { AiFillDollarCircle, AiOutlineIssuesClose } from "react-icons/ai";
import { FiSend } from "react-icons/fi";
import { PiPlugsConnectedFill } from "react-icons/pi";
import { IoSearch } from "react-icons/io5";
import useAdmin from "@/Hooks/adminHooks";

const Sidebar = () => {
  const router = useRouter();

  // Logout function
  const handleLogout = () => {
    Cookies.remove("admin_data"); // Remove the admin data from cookies
    router.push("/"); // Redirect to the login page
  };

  const { adminData } = useAdmin();

  // Sidebar toggle states, initialized after checking client-side
  const [courses, setCourses] = useState(false);
  const [admins, setAdmins] = useState(false);
  const [headerbanner, setHeaderbanner] = useState(false);
  const [faq, setFaq] = useState(false);
  const [registrations, setRegistrations] = useState(false);
  const [payments, setPayments] = useState(false);
  const [users, setUsers] = useState(false);
  const [onlineTests, setOnlineTests] = useState(false);
  const [email, setEmails] = useState(false);
  const [videos, setVideos] = useState(false);
  const [details, setDetails] = useState(false);
  const [mobileheaderbanner, setMobileHeaderbanner] = useState(false);
  const [thinkific, setThinkific] = useState(false);
  const [payfast, setPayfast] = useState(false);
  const [paypro, stePaypro] = useState(false);
  const [smtp, setSmtp] = useState(false);
  const [stripe, setStripe] = useState(false);

  const toggleSection = (stateSetter, sectionKey, currentValue) => {
    const newValue = !currentValue;
    stateSetter(newValue);
    if (typeof window !== "undefined") {
      localStorage.setItem(sectionKey, JSON.stringify(newValue));
    }
  };

  return (
    <div className="w-64 sticky top-0 left-0 h-screen custom-scrollbar overflow-x-hidden overflow-y-scroll bg-white">
      <div className="p-7 pb-1">
        <div className="flex flex-col">
          <Link href="/admin/dashboard">
            <h1 className="basefont font-bold text-2xl heading-text">
              DigiPAKISTAN
            </h1>
          </Link>
          <hr className="my-0 w-1/6 border-primary" />
          <hr className="my-0 w-1/4 mt-1 border-primary" />
        </div>
      </div>
      <hr className="my-3" />

      <div className="flex flex-col gap-2 px-7">
        {/* Main section */}
        <div>
          <span className="basefont text-sm font-medium">Main</span>
          <Link
            href="/admin/dashboard"
            className="my-2 gap-2 flex items-center ml-2 cursor-pointer secondfont"
          >
            <MdDashboard className="text-primary" size={25} />
            Dashboard
          </Link>
        </div>

        {/* Settings section */}
        <div className="mt-3">
          <Link
            href={"/admin/student/manage-issues"}
            className="my-3 flex items-center gap-2 bg-primary py-2 px-3 text-white rounded-md"
          >
            <AiOutlineIssuesClose />
            <span className="basefont text-sm font-medium text-center">
              Issues panel
            </span>
          </Link>

          <span className="basefont text-sm font-medium">Settings</span>
          <div className="flex flex-col">
            <SidebarItem
              title="Admins"
              icon={<MdAdminPanelSettings size={20} />}
              toggle={() => toggleSection(setAdmins, "admins", admins)}
              isOpen={admins}
              subItems={[
                { label: "Add Admins", href: "/admin/" },
                { label: "Manage Admin Permissions", href: "/admin/manage-admin-permissions" },
                {
                  label: "Manage Admins",
                  href: "/admin/manage-admins",
                  itemIcon: <IoIosSettings />, //manage-admin-permissions
                },
              ]}
            />

            <SidebarItem
              title="Courses"
              icon={<SiCoursera size={18} />}
              toggle={() => toggleSection(setCourses, "courses", courses)}
              isOpen={courses}
              subItems={[
                {
                  label: "Add Courses Category",
                  href: "/admin/addcertifications",
                },
                { label: "Add Course", href: "/admin/addcourse" },
                {
                  label: "Manage Courses",
                  href: "/admin/manage-course",
                  itemIcon: <IoIosSettings />,
                },
                {
                  label: "Manage Courses Cetagory",
                  href: "/admin/manage-courses-category",
                  itemIcon: <IoIosSettings />,
                },
              ]}
            />

            <SidebarItem
              title="Users"
              icon={<FaUser size={20} />}
              toggle={() => toggleSection(setUsers, "users", users)}
              isOpen={users}
              subItems={[
                {
                  label: "Manage Users",
                  href: "/admin/manage-users",
                  itemIcon: <IoIosSettings />,
                },
              ]}
            />

            <SidebarItem
              title="Payments"
              icon={<AiFillDollarCircle size={18} />}
              toggle={() => toggleSection(setPayments, "payments", payments)}
              isOpen={payments}
              subItems={[
                {
                  label: "M Courses PYMT",
                  href: "/admin/manage-payments",
                  itemIcon: <IoIosSettings />,
                },
                {
                  label: "M Bundle-Course PYMT",
                  href: "/admin/manage-bundle-payments",
                  itemIcon: <IoIosSettings />,
                },
              ]}
            />

            {/* <SidebarItem
              title="Configuration"
              icon={<MdSettingsSuggest size={18} />}
              toggle={() =>
                toggleSection(setOnlineTests, "onlineTests", onlineTests)
              }
              isOpen={onlineTests}
              subItems={[
                {
                  label: "Stripe Keys",
                  href: "",
                  itemIcon: <IoIosSettings />,
                },
                {
                  label: "SMTP Keys",
                  href: "/admin/manage-smtp-keys",
                  itemIcon: <IoIosSettings />,
                },
              ]}
            /> */}

            <SidebarItem
              title="Emails"
              icon={<MdAttachEmail size={18} />}
              toggle={() => toggleSection(setEmails, "email", email)}
              isOpen={email}
              subItems={[
                {
                  label: "Compose",
                  href: "/admin/compose",
                  itemIcon: <FiSend />,
                },
                {
                  label: "Template Editor",
                  href: "/admin/template-editor",
                  itemIcon: <MdModeEdit />,
                },
                {
                  label: "Settings",
                  href: "/admin/email-settings",
                  itemIcon: <IoIosSettings />,
                },
              ]}
            />

            {/* <SidebarItem
              title="Videos"
              icon={<IoIosVideocam size={18} />}
              toggle={() => toggleSection(setVideos, "videos", videos)}
              isOpen={videos}
              subItems={[
                {
                  label: "Upload Vidoes",
                  href: "/admin/upload_videos",
                  itemIcon: <FiSend />,
                },
                {
                  label: "Manage Videos",
                  href: "/admin/manage_videos",
                  itemIcon: <IoIosSettings />,
                },
              ]}
            /> */}

            {/* Site Settings */}
            {adminData?.role === "support" ? (
              ""
            ) : (
              <>
                <div className="flex flex-col mt-4">
                  <span className="basefont text-sm font-medium">
                    Gateway Integrations
                  </span>

                  <SidebarItem
                    title="Thinkific"
                    icon={<PiPlugsConnectedFill size={18} />}
                    toggle={() =>
                      toggleSection(setThinkific, "thinkific", thinkific)
                    }
                    isOpen={thinkific}
                    subItems={[
                      {
                        label: "Manage Thinkific Keys",
                        href: "/admin/manage-thinkific-keys",
                      },
                    ]}
                  />

                  <SidebarItem
                    title="PayFast"
                    icon={<MdSettingsSuggest size={18} />}
                    toggle={() => toggleSection(setPayfast, "payfast", payfast)}
                    isOpen={payfast}
                    subItems={[
                      {
                        label: "Manage Payfast Keys",
                        href: "/admin/manage-payfast-keys",
                      },
                    ]}
                  />

                  <SidebarItem
                    title="PayPro"
                    icon={<MdSettingsSuggest size={18} />}
                    toggle={() => toggleSection(stePaypro, "paypro", paypro)}
                    isOpen={paypro}
                    subItems={[
                      {
                        label: "Manage PayPro Keys",
                        href: "/admin/manage-paypro-keys",
                      },
                    ]}
                  />

                  <SidebarItem
                    title="Stripe"
                    icon={<MdSettingsSuggest size={16} />}
                    toggle={() => toggleSection(setStripe, "stripe", stripe)}
                    isOpen={stripe}
                    subItems={[
                      {
                        label: "Manage Stripe Keys",
                        itemIcon: <IoIosSettings />,
                        href: "/admin/manage-stripe-keys",
                      },
                    ]}
                  />

                  <SidebarItem
                    title="SMTP"
                    icon={<MdSettingsSuggest size={16} />}
                    toggle={() => toggleSection(setSmtp, "smtp", smtp)}
                    isOpen={smtp}
                    subItems={[
                      {
                        label: "Manage SMTP Keys",
                        itemIcon: <IoIosSettings />,
                        href: "/admin/manage-smtp-keys",
                      },
                    ]}
                  />
                </div>

                {/* Site Settings */}
                <div className="flex flex-col mt-4">
                  <span className="basefont text-sm font-medium">
                    Site Settings
                  </span>

                  <SidebarItem
                    title="Header Banners"
                    icon={<CgWebsite size={18} />}
                    toggle={() =>
                      toggleSection(
                        setHeaderbanner,
                        "headerbanner",
                        headerbanner
                      )
                    }
                    isOpen={headerbanner}
                    subItems={[
                      {
                        label: "Add Header Banners",
                        href: "/admin/site-setting/header-banner",
                      },
                      {
                        label: "Manage Banners",
                        href: "/admin/site-setting/manage-banner",
                      },
                    ]}
                  />

                  <SidebarItem
                    title="Mobile Banners"
                    icon={<CgWebsite size={18} />}
                    toggle={() =>
                      toggleSection(
                        setMobileHeaderbanner,
                        "mobileheaderbanner",
                        mobileheaderbanner
                      )
                    }
                    isOpen={mobileheaderbanner}
                    subItems={[
                      {
                        label: "Add Mobile Header Banners",
                        href: "/admin/site-setting/moblie-header-banner",
                      },
                      {
                        label: "Manage Mobile Banners",
                        href: "/admin/site-setting/manage-mobile-header-banner",
                      },
                    ]}
                  />

                  <SidebarItem
                    title="FAQ Questions"
                    icon={<CgWebsite size={18} />}
                    toggle={() => toggleSection(setFaq, "faq", faq)}
                    isOpen={faq}
                    subItems={[
                      {
                        label: "Add FAQS Questions",
                        href: "/admin/site-setting/faq-question",
                      },
                      {
                        label: "Manage FAQS",
                        href: "/admin/site-setting/manage-faq-question",
                      },
                    ]}
                  />

                  <SidebarItem
                    title="Site Details"
                    icon={<SiCoveralls size={16} />}
                    toggle={() => toggleSection(setDetails, "details", details)}
                    isOpen={details}
                    subItems={[
                      {
                        label: "Manage Site Details",
                        itemIcon: <IoIosSettings />,
                        href: "/admin/site-setting/site-details",
                      },
                    ]}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <hr className="mt-2" />
      <div className="flex flex-col px-7 py-3 gap-3">
        <span className="text-sm font-medium">Actions</span>
        <button
          onClick={handleLogout}
          className="my-2 gap-2 flex items-center p-1 cursor-pointer secondfont text-sm"
        >
          <TbLogout className="text-primary text-lg" />
          Logout
        </button>
        <Link href="/">
          <button className="my-2 gap-2 flex items-center p-1 cursor-pointer secondfont text-sm">
            <RiArrowGoBackLine className="text-primary text-base" />
            Back to site
          </button>
        </Link>
      </div>
    </div>
  );
};

const SidebarItem = ({ title, icon, toggle, isOpen, subItems }) => (
  <div>
    <button
      onClick={toggle}
      className={`my-2 w-full h-auto gap-2 flex justify-between items-center p-1 cursor-pointer secondfont ${
        isOpen && "bg-primary/30"
      }`}
    >
      <div className="flex items-center gap-1 text-xs">
        <span className="text-primary">{icon}</span>
        {title}
      </div>
      {isOpen ? <IoIosArrowDown size={10} /> : <IoIosArrowForward size={10} />}
    </button>
    <div
      className={`ml-3 transition-all duration-700 overflow-hidden ${
        isOpen ? "max-h-[200px] overflow-y-scroll custom-scrollbar" : "max-h-0"
      }`}
    >
      <ul className="flex flex-col text-[0.9rem] gap-2 mb-2">
        {subItems.map((item, index) => (
          <Link key={index} href={item.href}>
            <li className="flex gap-1 text-gray-700 text-xs">
              <span className="mt-[2px]">{item.itemIcon || <IoIosAdd />}</span>{" "}
              <span>{item.label}</span>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  </div>
);

export default Sidebar;
