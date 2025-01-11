"use client";
import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { MdNavigateNext } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";
import {
  getAllCourses,
} from "../../Backend/firebasefunctions";
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

  const headerBanner = [
    {
      banner_status:"show",
      site_header_banners:"/carousel1.png",
      alt:"alt"
    },
    {
      banner_status:"show",
      site_header_banners:"/carousel1.png",
      alt:"alt"
    },
    {
      banner_status:"show",
      site_header_banners:"/carousel1.png",
      alt:"alt"
    },
  ]

  const mobilebanner = [
    {
      banner_status:"show",
      site_header_banners:"/carousel1.png",
      alt:"alt"
    },
    {
      banner_status:"show",
      site_header_banners:"/carousel1.png",
      alt:"alt"
    },
    {
      banner_status:"show",
      site_header_banners:"/carousel1.png",
      alt:"alt"
    },
  ]


  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 10000, stopOnInteraction: false }),
  ]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);



  return (
    <div id="home">
    <div className="embla w-full relative">
        <button
          onClick={scrollPrev}
          className="embla__button embla__button--prev absolute left-4 top-1/2 transform -translate-y-1/2"
        >
          <GrFormPrevious />
        </button>

        <div className="embla__viewport w-full overflow-hidden h-[30vh] lg:h-[70vh] " ref={emblaRef}>
          <div className="embla__container flex">
          { isMobile ? mobilebanner.map(
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
              : headerBanner.map(
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

        <button
          onClick={scrollNext}
          className="embla__button embla__button--next rounded-full absolute right-4 top-1/2 transform -translate-y-1/2"
        >
          <MdNavigateNext />
        </button>
      </div>
      
    </div>
  );
};

export default Header;
