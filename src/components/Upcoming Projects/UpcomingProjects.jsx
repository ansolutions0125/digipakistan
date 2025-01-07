import React, { useCallback } from 'react'
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { MdNavigateNext } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";
import Image from 'next/image';

const UpcomingProjects = () => {
    const slides = [
        { src: "/slide1.png", alt: "Slide 1 description" },
        { src: "/slide2.png", alt: "Slide 2 description" },
        { src: "/slide3.png", alt: "Slide 2 description" },
        { src: "/slide4.png", alt: "Slide 2 description" },
        { src: "/slide5.png", alt: "Slide 2 description" },
        { src: "/slide6.png", alt: "Slide 2 description" },
        { src: "/slide7.png", alt: "Slide 2 description" },
        { src: "/slide8.png", alt: "Slide 2 description" },
        // Add more slides here
    ];
    
    {slides.map((slide, index) => (
        <div className="embla__slide" key={index}>
            <Image
                src={slide.src}
                alt={slide.alt}
                width={20}
                height={20}
                className="w-[100%] h-[40%]"
            />
        </div>
    ))}
    



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
    <div className='max-h-[70vh] '>
         <h1 className="heading-text text-4xl lg:text-5xl font-bold bg-gray-50 text-center p-5  mb-3">
            Upcoming Programs
          </h1>
         <div className="embla w-full relative">
                <button
                  onClick={scrollPrev}
                  className="embla__button embla__button--prev absolute left-4 top-[20%] transform -translate-y-1/2"
                >
                  <GrFormPrevious />
                </button>
        
                <div className="embla__viewport w-full overflow-hidden " ref={emblaRef}>
                  <div className="embla__container flex gap-10">
        
             
                 
{slides.map((slide, index) => (
    <div className="embla__slide" key={index}>
        <Image
            src={slide.src}
            alt={slide.alt}
            width={20}
            height={20}
            className="w-[100%] h-[40%]"
        />
    </div>
))}
             
                   
                  </div>
                </div>
        
                <button
                  onClick={scrollNext}
                  className="embla__button embla__button--next rounded-full absolute right-4 top-[20%] transform -translate-y-1/2"
                >
                  <MdNavigateNext />
                </button>
              </div>
    </div>
  )
}

export default UpcomingProjects