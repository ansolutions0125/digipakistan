import Loader from "@/components/AppLoader/Loader";
import React from "react";

function loading() {
  return (
    <div className="h-screen w-full flex justify-center items-center">
      <Loader />
    </div>
  );
}

export default loading;
