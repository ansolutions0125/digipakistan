"use client";
import React, { useEffect, useState } from "react";
import { IoFilterOutline } from "react-icons/io5";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";

const AllCourses = ({ courses = [], certifications = { data: [] } }) => {
  const [selectedCertification, setSelectedCertification] =
    useState("All Certifications"); // Default selected
  const [selectedLevel, setSelectedLevel] = useState(null); // Single selection for levels
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [isFilterOpenModle, setIsFilterOpenModle] = useState(false);

  // Add "All Certifications" option
  const certificationCategories = [
    "All Certifications",
    ...Array.from(
      new Set(
        certifications.data.map(
          (cert) => cert.status === "active" && cert.certificationsTitle
        )
      )
    ).filter(Boolean),
  ];

  useEffect(() => {
    // Show all courses on initial load
    const allCourses = certifications.data.flatMap(
      (cert) => cert.coursesInThisCertifications || []
    );
    setFilteredCourses(allCourses);
  }, [certifications]);

  const [loadingForCertificationChanging, setLoadingForCertificationChanging] =
    useState(false);

  const handleCertificationClick = (certification) => {
    setLoadingForCertificationChanging(true);

    // Update selected certification
    setSelectedCertification(certification);

    // Clear the selected level when changing the certification
    setSelectedLevel(null);

    setTimeout(() => {
      setLoadingForCertificationChanging(false);
    }, 2000);
  };

  const handleLevelClick = (level) => {
    setLoadingForCertificationChanging(true);

    // Unselect if the same level is clicked again
    setSelectedLevel((prev) => (prev === level ? null : level));

    setTimeout(() => {
      setLoadingForCertificationChanging(false);
    }, 500);
  };

  useEffect(() => {
    // Filter courses based on selected certification and/or level
    let allCourses = certifications.data.flatMap(
      (cert) => cert.coursesInThisCertifications || []
    );

    if (
      selectedCertification &&
      selectedCertification !== "All Certifications"
    ) {
      // Narrow down to the selected certification
      const selectedCertCourses = certifications.data.find(
        (cert) => cert.certificationsTitle === selectedCertification
      )?.coursesInThisCertifications;

      allCourses = selectedCertCourses || [];
    }
    if (selectedLevel) {
      // Apply level filter within the current narrowed courses
      allCourses = allCourses.filter(
        (course) => course.courseCategory === selectedLevel
      );
    }

    setFilteredCourses(allCourses);
  }, [selectedCertification, selectedLevel, certifications]);

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const toggleFilterMobile = () => {
    setIsFilterOpenModle(!isFilterOpenModle);
  };

  const clearFilters = () => {
    setSelectedCertification("All Certifications");
    setSelectedLevel(null);
  };

  const formattedDate = (timestamp) => {
    try {
      return format(new Date(timestamp), "PP");
    } catch (err) {
      return "Invalid Date";
    }
  };

  return (
    <div className="py-10 lg:py-20">
      <div className="max-w-6xl lg:mx-auto">
        <div className="flex lg:flex-row justify-between lg:items-center">
          <h1 className="heading-text text-4xl lg:text-5xl font-bold">
            Certifications
          </h1>
          <Link href={"/howitworks"}>
            <button className="btn-primary py-2 px-4 flex items-center gap-2">
              <span>How It Works?</span>
            </button>
          </Link>
        </div>

        {/* Filter Button */}
        <div className="mt-8 lg:flex hidden items-center gap-4">
          <button
            onClick={toggleFilter}
            className={`border  lg:flex hidden items-center gap-2 border-gray-500 rounded py-2.5 duration-300 px-4 cursor-pointer ${
              isFilterOpen ? "bg-primary/10 " : ""
            }`}
          >
            <IoFilterOutline className="text-lg font-bold" />
            <span className="font-bold text-gray-800">Filter</span>
          </button>
          <button
            onClick={toggleFilterMobile}
            className={`border flex lg:hidden items-center gap-2 border-gray-500 rounded py-2.5 duration-300 px-4 cursor-pointer ${
              isFilterOpen ? "bg-primary/10 " : ""
            }`}
          >
            <IoFilterOutline className="text-lg font-bold" />
            <span className="font-bold text-gray-800">Filter</span>
          </button>
          {(selectedCertification !== "All Certifications" ||
            selectedLevel) && (
            <button
              onClick={clearFilters}
              className="ml-2 border border-gray-500 rounded py-2.5 px-4 text-gray-600 hover:bg-gray-100"
            >
              Clear Filters
            </button>
          )}
        </div>
        <div className="block lg:hidden relative w-full mt-8">
          <div className="grid grid-cols-4 lg:grid-cols-8 gap-2 text-gray-700">
            {certificationCategories.map((item, index) => (
              <div
                key={index}
                onClick={() => handleCertificationClick(item)}
                className={`cursor-pointer border-2 px-1 py-0.5 rounded-full md:px-4 duration-500 md:rounded-full flex justify-center md:py-1 transition-colors ${
                  selectedCertification === item
                    ? "font-bold bg-primary text-white"
                    : "bg-primary/10"
                }`}
              >
                <span className="p-2 text-[8px] md:text-[13px]">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex mt-5 w-full relative overflow-x-hidden">
          {/* Filter Sidebar */}
          <div
            className={`absolute w-full hidden lg:block left-0 top-0 bg-white border-r shadow-md transition-transform duration-500 ease-in-out z-20 ${
              isFilterOpen ? "translate-x-0 lg:w-1/4" : "-translate-x-full"
            }`}
          >
            <div className="p-5">
              <h3 className="text-xl font-semibold mb-4">Certifications</h3>
              <ul className="space-y-4">
                {certificationCategories.map((category, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => handleCertificationClick(category)}
                  >
                    <input
                      type="radio"
                      name="certifications"
                      checked={selectedCertification === category}
                      onChange={() => {}}
                      className="cursor-pointer h-4 w-4 accent-primary"
                    />
                    <span
                      className={`text-gray-700 font-medium ${
                        selectedCertification === category
                          ? "text-primary font-semibold"
                          : ""
                      }`}
                    >
                      {category}
                    </span>
                  </li>
                ))}
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-4">Levels</h3>
              <ul className="space-y-4">
                {["beginner", "intermediate", "expert"].map((level, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => handleLevelClick(level)}
                  >
                    <input
                      type="radio"
                      name="levels"
                      checked={selectedLevel === level}
                      onChange={() => {}}
                      className="cursor-pointer h-4 w-4 accent-primary"
                    />
                    <span
                      className={`text-gray-700 font-medium ${
                        selectedLevel === level
                          ? "text-primary font-semibold"
                          : ""
                      }`}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                onClick={toggleFilter}
                className="absolute top-4 right-4 text-2xl text-gray-600"
              >
                ×
              </button>
            </div>
          </div>

          {/* Certifications Content */}
          <div
            className={`transition-all w-full duration-500 ${
              isFilterOpen ? "lg:ml-[26%] lg:w-[75%]" : "w-full"
            }`}
          >
            {filteredCourses.length > 0 ? (
              <div
                className={`grid grid-cols-1 md:grid-cols-2 gap-5 ${
                  isFilterOpen ? "lg:grid-cols-3" : "lg:grid-cols-4"
                }`}
              >
                {filteredCourses.map(
                  (data, idx) =>
                    data.courseStatus === "active" && (
                      <div>
                        {loadingForCertificationChanging ? (
                          <div
                            key={idx}
                            className="relative rounded-lg bg-gray-100 w-full shadow-md animate-pulse"
                          >
                            {/* Course Thumbnail Skeleton */}
                            <div className="overflow-hidden rounded-t-lg relative bg-gray-300 h-[190px] w-full"></div>

                            {/* Course Details Skeleton */}
                            <div className="py-5 mt-3 px-4">
                              {/* Certificate Skeleton */}
                              <div className="px-3 mb-2 w-[40px] h-[40px] bg-gray-300 rounded-full"></div>

                              {/* Title Skeleton */}
                              <div className="px-3 w-3/4 h-5 bg-gray-300 rounded-lg mb-2"></div>

                              {/* Description Skeleton */}
                              <div className="px-3 w-full h-4 bg-gray-300 rounded-lg mb-2"></div>
                              <div className="px-3 w-5/6 h-4 bg-gray-300 rounded-lg mb-4"></div>

                              {/* Category & Date Skeleton */}
                              <div className="px-3 w-1/2 h-4 bg-gray-300 rounded-lg"></div>
                            </div>
                          </div>
                        ) : (
                          <div
                            key={idx}
                            className="relative rounded-lg bg-white w-full shadow-md"
                          >
                            <div className="overflow-hidden w-full rounded-t-lg relative">
                              <Link href={`/course/${data.siteCourseId}`}>
                                <Image
                                  src={data.courseThumbnail}
                                  className="rounded-t-lg h-[190px] w-full object-cover transition-transform duration-500 transform hover:scale-110"
                                  alt={data.courseTitle}
                                  width={500}
                                  height={500}
                                  loading="eager"
                                />
                              </Link>
                            </div>
                            <div className="py-5 mt-3">
                              {data?.examCertificateInPicture && (
                                <div className="px-3 mb-2 w-[50px]">
                                  <Image
                                    src={data?.examCertificateInPicture}
                                    width={70}
                                    height={70}
                                    alt="certificate"
                                    loading="lazy"
                                  />
                                </div>
                              )}
                              <h3 className="text-[1rem] truncate cursor-pointer px-3 font-medium">
                                {data.courseTitle}
                              </h3>
                              <p className="px-3 text-[13px] text-gray-600">
                                {data.courseShortDescription.slice(0, 70)}...
                              </p>
                              <p className="px-3 text-[13px] text-gray-600 capitalize mt-3">
                                {data?.courseCategory} • Professional
                                Certificate
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                )}
              </div>
            ) : (
              <p className="text-center text-gray-500">
                No courses found for the selected filters.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllCourses;
