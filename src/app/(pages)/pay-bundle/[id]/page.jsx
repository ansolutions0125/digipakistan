import React from "react";
import Footer from "../../../../components/Footer/Footer";
import Navbar from "../../../../components/Navbar/Navbar";
import BundleCoustomPaymentForm from "../../../../components/CoustomStripePaymentForm/BundleCoustomPaymentForm";
import { getSingleCourseBundle } from "@/Backend/firebasefunctions";
import StripeProtectedRoutes from "@/ProtectedRoutes/StripeProtectedRoutes";

export default async function PayBundle({ params }) {
  const id = params.id;
  const { data } = await getSingleCourseBundle(id);

  return (
    <>
      <Navbar />
      <BundleCoustomPaymentForm data={data} />
      <Footer />
    </>
  );
}
