import React from "react";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import SingleCourse from "@/components/SingleCourse/SingleCourse";
import courses from "@/components/Courses/Courses";
import CoursePageInfo from "@/components/PageInfo/CoursePageInfo";



export function generateMetadata({params}){

  const courseId = params.id;
  const course = courses.find((c)=>c.id === courseId);

  return {
    title: {
      default: `${course.courseTitle}`,
      template: "%s | DigiPAKISTAN National Skills Development Program",
    },
    description:
      "Learn about DigiPAKISTAN, a Government of Pakistan-backed initiative offering IT certification training. Discover how we empower individuals with globally recognized skills for a digital future, aligning with international certifications from Google, AWS, Microsoft, and more.",
    metadataBase: new URL("https://DigiPAKISTAN.com"),
    keywords: [
      "about DigiPAKISTAN",
      "DigiPAKISTAN IT certification",
      "government-backed IT training",
      "DigiPAKISTAN program information",
      "online IT education Pakistan",
      "learn IT online with DigiPAKISTAN",
      "international IT certifications Pakistan",
      "Google, AWS, Microsoft certifications",
      "free IT training Pakistan",
      "professional IT training in Pakistan",
      "DigiPAKISTAN training programs",
      "digital transformation with DigiPAKISTAN",
      "IT career advancement with DigiPAKISTAN",
      "comprehensive IT education programs",
      "high-quality IT training Pakistan",
      "government IT training programs",
      "affordable IT certifications Pakistan",
      "international certification preparation Pakistan",
      "DigiPAKISTAN digital skills",
      "Pakistan IT development programs",
      "DigiPAKISTAN global IT skills initiative",
      "career opportunities in IT Pakistan",
      "Government of Pakistan IT training",
      "DigiPAKISTAN certification value",
      "DigiPAKISTAN mission and vision",
      "DigiPAKISTAN program benefits",
      "IT skills development Pakistan",
      "expanding digital literacy in Pakistan",
      "empowering IT professionals Pakistan",
    ],
    openGraph: {
      title: "About DigiPAKISTAN | Empowering IT Professionals",
      description:
        "Discover DigiPAKISTAN, a pioneering IT certification program supported by the Government of Pakistan. Gain insight into our mission to enhance employability and foster digital transformation through world-class IT training.",
      url: "https://DigiPAKISTAN.com/about",
      type: "website",
      images: [
        {
          url: "/about-banner.jpg", // Change to an appropriate path for a banner image about the program
          width: 1200,
          height: 630,
          alt: "About DigiPAKISTAN Program Banner",
        },
      ],
      locale: "en_US",
    },
  };

}


const SCourse = ({params}) => {
   // Unwrap the params promise
  const courseId = params.id;

 

const selectedCourse = courses.find((c)=>c.id===courseId)
  return (
    <>
      {/* Navbar */}
      <Navbar/>

      {/* Page Info */}
      <CoursePageInfo duration={selectedCourse.batchDuration} enrolled={selectedCourse.enrolledStudents} totalReview={selectedCourse.totalReviews} reviews={selectedCourse.reviews}
      level={selectedCourse.level} PageName={selectedCourse.courseTitle} pageDescription={selectedCourse.courseShortDescription} />

      {/* All Courses */}
      <main className="p-4 lg:p-0">
        <SingleCourse data={selectedCourse} />
      </main>
      <Footer />
    </>
  );
};

export default SCourse;
