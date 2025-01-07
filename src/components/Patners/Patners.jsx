"use client";
import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import VideoPlayer from "../CustomVideoPlayer/VideoPlayer";
import { getAllVideo } from "@/Backend/firebasefunctions";

const Partners = () => {
  const partners = [
    "/pat2.png",
    "/pat3.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1200px-Google_2015_logo.svg.png",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSx8-mS6P47PH3cUiXdxsjX_RPeA_rZC1_qYQ&s",
    "/pataner2.png",
    "/red-ptr1.svg",
    "/isc-ptr.png",
    "/aws-ptr-3.png",
    "/icaca-ptr-4.png",
    "/cisco-ptr5.png",
    "/comptia-ptr6.jpeg",
  ];

  const [videos, setVideos] = useState([]);
  const [mainVideo, setMainVideo] = useState("/DigiPAKISTAN.mp4"); // Default video
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetch_Video = async () => {
      setLoading(true);
      const data = await getAllVideo();
      setVideos(data.data);
      setMainVideo(data.data[0].video_vimeoId);
      setLoading(false);
    };
    fetch_Video();
  }, []);

  const [patner, setLoadingPantner] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoadingPantner(false);
    }, 1000); // Simulates a 3-second loading delay
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="relative w-full py-10 lg:py-0 items-center justify-center max-w-7xl bg-white flex flex-col mx-auto gap-2 lg:flex-row px-5">
     

      <div className=" w-full flex-auto lg:max-w-3xl text-justify">
        <h1 className="text-4xl mb-2 font-bold">Our Mission</h1>
        <p>To transform Pakistani Youth into productive workforce to contest the challenges of fourth industrial revolution through latest, demand driven and state of the art IT Skills with the increased access to high-quality education for everyone, anywhere and anytime.</p>
        <p className="mt-3"><b>DigiPAKISTAN</b>  Vision is to become leader in building a highly skilled human resource in diversified IT domains and contribute in nation building towards a knowledge-based economy. In order to bring this vision, a comprehensive <b>DigiPAKISTAN National Skills Development Initiative</b>   has been designed which provides contemporary online training of <b>Information Technology in Technical, Non-Technical & High Tech Domains</b> across all provinces of Pakistan & overseas Pakistanis to empower youth of the nation.</p>
      </div>


 <div className="relative flex-initial w-full ">
       
          <div
            className="p-4 lg:p-12 md:p-48 lg:mx-0 sm:p-6 rounded-lg w-full"
            style={{
              paddingTop: "20%",
              borderRadius: "20px",
              overflow: "hidden",
            }}
          >
            <iframe
              src={`https://www.youtube.com/embed/bMGzyml4HMY`}
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
              style={{
            position: "relative",
                top: "0",
                left: "0",
                width: "100%",
                height: "300px",
                border: "none",
                borderRadius: "20px",
              }}
              title="DigiPAKISTAN"
            ></iframe>
          </div>
      
      </div>

    </div>
  );
};

export default Partners;
