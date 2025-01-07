import React from "react";

const UpComingEvents = () => {
  return (
    <div className="py-20">
      <div className="max-w-6xl lg:mx-auto mx-5">
        <div className="flex items-center flex-col w-full justify-center gap-5">
          <div className="flex items-center gap-4">
            <hr className="border-black w-[20px]" />
            <h3 className="font-bold heading-text">Events</h3>
            <hr className="border-black w-[20px]" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-5xl heading-text font-medium  mt-4">
            Upcoming Events
          </h1>
        </div>
        <div className="flex mt-10 relative">
          <div className="w-full lg:w-[48rem] bg-primary px-10 lg:px-16 py-20 rounded-lg p-5 text-white">
            <div className="w-full lg:w-[85%]">
              <div className="pb-5 pt-4 border-b-gray-400 border-b-[1px]">
                <div className="flex gap-2 lg:gap-3 items-center">
                  <div className="w-1/2 lg:w-1/6">
                    <div className="bg-second flex items-center justify-center w-[70px] h-[70px] rounded-md">
                      <h6 className="w-[30px] text-center">Jan 20</h6>
                    </div>
                  </div>
                  <div className="w-full">
                    <h2 className="font-bold text-xl">
                      Lorem ipsum dolor sit amet consectetur.
                    </h2>
                  </div>
                </div>
              </div>
              <div className="pb-5 pt-4 border-b-gray-400 border-b-[1px]">
                <div className="flex gap-2 lg:gap-3 items-center">
                  <div className="w-1/2 lg:w-1/6">
                    <div className="bg-second flex items-center justify-center w-[70px] h-[70px] rounded-md">
                      <h6 className="w-[30px] text-center">Jan 20</h6>
                    </div>
                  </div>
                  <div className="w-full">
                    <h2 className="font-bold text-xl">
                      Lorem ipsum dolor sit amet consectetur.
                    </h2>
                  </div>
                </div>
              </div>
              <div className="pb-5 pt-4 border-b-gray-400 border-b-[1px]">
                <div className="flex gap-2 lg:gap-3 items-center">
                  <div className="w-1/2 lg:w-1/6">
                    <div className="bg-second flex items-center justify-center w-[70px] h-[70px] rounded-md">
                      <h6 className="w-[30px] text-center">Jan 20</h6>
                    </div>
                  </div>
                  <div className="w-full">
                    <h2 className="font-bold text-xl">
                      Lorem ipsum dolor sit amet consectetur.
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute lg:block hidden w-1/3 border top-20 right-[110px] bg-bgcolor rounded-lg shadow-md p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-y-4 lg:gap-y-0 gap-x-5">
              <div className="flex items-center bg-bgcolor gap-2 p-4 rounded-md">
                <div className="w-1/4">
                  <div className="w-[60px] h-[60px] bg-primary rounded-full p-4 flex items-center justify-center">
                    <img src="/contact-icon1.png" className="imgwhite" alt="" />
                  </div>
                </div>
                <div className="flex flex-col w-full">
                  <h3 className="text-xl font-bold heading-text">Our Phone</h3>
                  <p className="text-[0.9rem]">000 2324 39493</p>
                </div>
              </div>
              <div className="flex items-center bg-bgcolor gap-2 p-4 rounded-md">
                <div className="w-1/4">
                  <div className="w-[60px] h-[60px] bg-primary rounded-full p-4 flex items-center justify-center">
                    <img src="/contact-icon2.png" className="imgwhite" alt="" />
                  </div>
                </div>
                <div className="flex flex-col w-full">
                  <h3 className="text-xl font-bold heading-text">Our Email</h3>
                  <p className="text-[0.9rem]">name@website.com</p>
                </div>
              </div>
              <div className="flex items-center bg-bgcolor gap-2 p-4 rounded-md">
                <div className="w-1/4">
                  <div className="w-[60px] h-[60px] bg-primary rounded-full p-4 flex items-center justify-center">
                    <img src="/contact-icon3.png" className="imgwhite" alt="" />
                  </div>
                </div>
                <div className="flex flex-col w-full">
                  <h3 className="text-xl font-bold heading-text">
                    Our Address
                  </h3>
                  <p className="text-[0.9rem]">2 St, Loskia, amukara.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpComingEvents;
