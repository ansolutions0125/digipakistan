import { MdArrowUpward } from "react-icons/md";
import React, { useEffect, useState } from "react";
import { Link as ScrollLink } from "react-scroll";

const BacktoHome = () => {
  const [showNavbar, setShowNavbar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowNavbar(window.scrollY >= 500);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div>
      {showNavbar && (
        <nav
          aria-label="Back to Top"
          className="fixed bottom-0 right-0 m-20 z-30 hidden lg:block"
        >
          <div
            className="group relative flex justify-center items-center text-white text-sm font-bold"
            role="navigation"
          >
            <div
              className="shadow-md flex items-center group-hover:gap-2 rounded-full cursor-pointer duration-300"
              title="Go back to the top of the page"
            >
              <ScrollLink
                to="home"
                smooth={true}
                duration={4000}
                aria-label="Scroll back to top"
              >
                <button
                  className="bg-white border-primary p-3 rounded-full border-[2px]"
                  aria-label="Back to Home"
                >
                  <MdArrowUpward
                    className="text-primary"
                    size={24}
                    alt="Upward arrow icon"
                  />
                </button>
              </ScrollLink>
            </div>
          </div>
        </nav>
      )}
    </div>
  );
};

export default BacktoHome;
