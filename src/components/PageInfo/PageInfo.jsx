import React from "react";

const PageInfo = ({ PageName,pageDescription }) => {
  return (
    <div className="pageinfo-bg py-20">
      <div className="max-w-6xl lg:mx-auto mx-5">
        <h1 className="text-white font-bold text-center text-xl lg:text-4xl">
          {PageName}
        </h1>
        <h6 className="text-center text-white">{pageDescription} </h6>
      </div>
    </div>
  );
};

export default PageInfo;
