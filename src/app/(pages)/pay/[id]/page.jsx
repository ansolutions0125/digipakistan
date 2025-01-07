import React from "react";
import WrappedCustomPaymentForm from "@/components/CoustomStripePaymentForm/WrappedCustomPaymentForm";
import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/Navbar/Navbar";
import { getSingleCourseForUser } from "@/Backend/firebasefunctions";
import StripeProtectedRoutes from "@/ProtectedRoutes/StripeProtectedRoutes";

export default async function Pay({ params }) {
  const id = await params.id;
  const { data } = await getSingleCourseForUser(id);
  if (!data) {
    return <Loader />;
  }
  return (
    <>
      <Navbar />
      <WrappedCustomPaymentForm data={data} />
      <Footer />
    </>
  );
}
