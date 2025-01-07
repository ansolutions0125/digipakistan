import {
  getAllCourses,
  getRegistrationPendingStatus,
  getSiteDetails,
  getUserPayProId,
} from "@/Backend/firebasefunctions";
import RegistrationPendingClientSide from "@/components/ClientSide/RegistrationPendingClientSide";
import FooterCopyRights from "@/components/Footer/FooterCopyRights";
import Navbar from "@/components/Navbar/Navbar";
import React from "react";

const page = async ({ params }) => {
  const {id} = await params;
  const data = await getRegistrationPendingStatus(id);
  const payproData = await getUserPayProId(id);
  const allcourses = await getAllCourses();
  const siteData = await getSiteDetails('siteDetailsId')

  return (
    <>
      <Navbar />
      <RegistrationPendingClientSide
        payproData={payproData}
        registrationData={data}
        courses={allcourses.data}
        siteData={siteData}
      />
      <FooterCopyRights bg={"bg-primary text-white py-4 text-center"} />
    </>
  );
};

export default page;
