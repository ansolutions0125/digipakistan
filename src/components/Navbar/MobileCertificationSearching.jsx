"use client";
import { getAllCourses } from "@/Backend/firebasefunctions";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { FaHistory } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { IoSearchOutline } from "react-icons/io5";

const MobileCertificationSearching = () => {
  const [coursesData, setCoursesData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [mobileCertificationSearching, setMobileCertificationSearching] =
    useState(false);

  const toggleMobileCertificationSearching = () => {
    setMobileCertificationSearching(!mobileCertificationSearching);
  };

  // Fetch courses on mount
  useEffect(() => {
    const fetchAllCourses = async () => {
      const data = await getAllCourses();
      setCoursesData(data.data);
    };
    fetchAllCourses();
  }, []);

  // Load recent searches from localStorage on mount
  useEffect(() => {
    const savedSearches =
      JSON.parse(localStorage.getItem("recentSearches")) || [];
    setRecentSearches(savedSearches);
  }, []);

  const fetchCourses = async () => {
    const filteredCourses = coursesData
      .filter((course) =>
       course.courseStatus === 'active' && course.courseTitle.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, 4);
    setSearchResults(filteredCourses);

    // Save search query to recent searches if it's not empty
    if (searchQuery.trim() !== "") {
      const updatedRecentSearches = [
        searchQuery,
        ...recentSearches.filter((q) => q !== searchQuery),
      ].slice(0, 5); // Keep max 5 searches
      setRecentSearches(updatedRecentSearches);
      localStorage.setItem(
        "recentSearches",
        JSON.stringify(updatedRecentSearches)
      );
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        fetchCourses();
      } else {
        setSearchResults([]);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  return (
    <div>
      <div className="lg:hidden cursor-pointer items-center gap-2 flex">
        <IoSearchOutline
          size={15}
          onClick={toggleMobileCertificationSearching}
          className="text-black"
        />
      </div>

      <div
        className={`fixed inset-0 bg-white h-full overflow-y-scroll custom-scrollbar pb-5 text-black z-50 transition-transform duration-300 ease-in-out transform ${
          mobileCertificationSearching ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="absolute top-6 left-6">
          <h1 className="text-2xl font-semibold text-center">DigiPAKISTAN</h1>
        </div>

        <button
          className="absolute top-6 right-6 font-thin text-black text-2xl"
          onClick={toggleMobileCertificationSearching}
        >
          <AiOutlineClose />
        </button>

        <div className="flex flex-col justify-between h-full">
          <div className="mt-20 gap-1 flex flex-col mx-5">
            <div className="border flex items-center gap-2 px-2 py-2 border-gray-400 rounded-md">
              <input
                type="text"
                placeholder="What you want to learn?"
                className="w-full outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="flex items-center gap-2">
                {searchResults.length > 0 && (
                  <button onClick={() => setSearchQuery("")}>
                    <IoMdClose />
                  </button>
                )}
                <IoSearchOutline />
              </div>
            </div>

            <div>
              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="bg-white rounded-md mt-4">
                  <div className="mt-4">
                    <span className="font-bold px-4 text-[13px]">
                      Showing results for "{searchQuery}"
                    </span>
                    <hr className="mt-4" />
                  </div>
                  {searchResults.map((course) => (
                    <Link
                      key={course.id}
                      href={`/course/${course.id}`}
                      className={`block px-4 py-4 hover:bg-gray-100`}
                    >
                      <div className="flex gap-3">
                        <Image
                          src={course.instructorBrandLogo}
                          alt={course.courseTitle}
                          className="w-[40px] h-[40px]  rounded"
                          width={300}
                          height={300}
                          priority
                        />
                        <div>
                          <h3 className="font-medium text-[14px]">
                            {course.courseTitle}
                          </h3>
                          <p className="text-gray-500 text-[13px]">
                            {course.courseShortDescription.slice(0, 40)}...
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Recent Searches */}
              <div className="mt-4">
                <span className="font-bold px-4 text-[13px]">
                  Recent Searches
                </span>
                <div className="mt-2 bg-white rounded-md">
                  {recentSearches.map((query, index) => (
                    <div
                      key={index}
                      className="flex text-gray-600 items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => setSearchQuery(query)}
                    >
                      <FaHistory /> <span>{query}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileCertificationSearching;
