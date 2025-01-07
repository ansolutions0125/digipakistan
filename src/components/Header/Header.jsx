"use client";
import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { MdNavigateNext } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";
import {
  getAllCourses,
  getAllHeaderBanner,
  getAllMobileHeaderBanner,
} from "../../Backend/firebasefunctions";
import AOS from "aos";
import Link from "next/link";
import Image from "next/image";

const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [matches, query]);

  return matches;
};

const Header = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [headerBanner, setHeaderBanner] = useState(null);
  const [mobilebanner, setMobilebanner] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bannerLoading,setBannerLoading]=useState(false);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setBannerLoading(true);
        const desktopBanners = await getAllHeaderBanner();
        const mobileBanners = await getAllMobileHeaderBanner();
        setHeaderBanner(desktopBanners.data);
        setMobilebanner(mobileBanners.data);
        setBannerLoading(false);
      } catch (error) {
        console.error("Error fetching banners:", error);
        setLoading(false);
      }
    };

    fetchBanners();
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 10000, stopOnInteraction: false }),
  ]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const [coursedata, setCoursesdata] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  useEffect(() => {
    setCoursesLoading(true);
    const fetchAllCourses = async () => {
      const data = await getAllCourses();
      setCoursesdata(data.data);
    };

    fetchAllCourses();
    setTimeout(() => {
      setCoursesLoading(false);
    }, 1000);
  }, []);

  return (
    <div id="home">
      {bannerLoading ?<div className="animate-pulse py-3 px-3 flex-col lg:flex-row flex gap-3 justify-center">
   <div className="h-[30vh] lg:h-[60vh] p-3 flex gap-3 bg-gray-200 rounded w-full">
      

      </div>   
   
   
 
  
 </div>:<div className="embla w-full relative">
        <button
          onClick={scrollPrev}
          className="embla__button embla__button--prev absolute left-4 top-1/2 transform -translate-y-1/2"
        >
          <GrFormPrevious />
        </button>

        <div className="embla__viewport w-full overflow-hidden h-[30vh] lg:h-[70vh] " ref={emblaRef}>
          <div className="embla__container flex">
          {loading ? (
              <div className="max-w-6xl lg:mx-auto flex justify-center items-center mx-5 w-full">
                <div className="animate-spin h-16 w-16 border-4 border-t-transparent border-primary rounded-full"></div>
              </div>
            ) : isMobile
              ? mobilebanner?.map(
                  (data, idx) =>
                    data.banner_status === "show" && (
                      <div
                        key={idx}
                        className="embla__slide_1 min-w-full relative h-[50vh]"
                      >
                        <Image
                          src={data.site_header_banners}
                          alt={`Mobile Banner ${idx + 1}`}
                          width={10}
                          height={10}
                           className="w-full h-[30vh] "  
                          priority={idx === 0}
                          loading="eager"
                          
                        />
                      </div>
                    )
                )
              : headerBanner?.map(
                  (data, idx) =>
                    data.banner_status === "show" && (
                      <div
                        key={idx}
                        className="embla__slide_1 min-w-full relative h-[100vh]"
                      >
                        <Image
                          src={data.site_header_banners}
                          alt={`Desktop Banner ${idx + 1}`}
                          className="w-full h-[70vh] "
                          priority={idx === 0}
                          loading="eager"
                            width={10}
                            height={10}
                    
                        />
                      </div>
                    )
                )}
          </div>
        </div>
        {(isMobile ? mobilebanner : headerBanner)?.length === 0 && (
  <div className="flex justify-center items-center h-full">
    <p>No banners available</p>
  </div>
)}

        <button
          onClick={scrollNext}
          className="embla__button embla__button--next rounded-full absolute right-4 top-1/2 transform -translate-y-1/2"
        >
          <MdNavigateNext />
        </button>
      </div>}
      
    </div>
  );
};

export default Header;
