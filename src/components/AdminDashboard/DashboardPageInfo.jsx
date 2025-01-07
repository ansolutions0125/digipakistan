import React from "react";

const DashboardPageInfo = ({ DashboardPageInfo, icons }) => {
  return (
    <div className="p-6 bg-primary/40 rounded-md">
      <div className="max-w-6xl lg:mx-auto mx-5">
        <div className="flex items-center gap-2">
          <div>{icons}</div>{" "}
          <h4 className="heading-text text-xl">{DashboardPageInfo}</h4>
        </div>
      </div>
    </div>
  );
};

export default DashboardPageInfo;
