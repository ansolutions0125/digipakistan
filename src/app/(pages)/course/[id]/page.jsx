import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import PageInfo from "@/components/PageInfo/PageInfo";

import { getSingleCourseForUser } from "../../../../Backend/firebasefunctions"; // Assume this is a utility to fetch data
import CourseClientSide from "@/components/ClientSide/CourseClientSide";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const { data } = await getSingleCourseForUser(id);

  return {
    title: `${data?.courseTitle} | ESkills Program`,
    description: data?.seoDescription,
    keywords: data?.seoKeywords?.join(", "), // Join keywords into a comma-separated string
    openGraph: {
      title: `${data?.courseTitle}`,
      description: data?.seoDescription,
      images: [{ url: data?.courseThumbnail }],
      type: "website",
    },
  };
}

export default async function CoursePage({ params }) {
  const id = await params.id; // Extract the id from params
  const { data } = await getSingleCourseForUser(id);
  return (
    <>
      <Navbar />
      <PageInfo PageName={data?.courseTitle} />
      <CourseClientSide course={data} />
      <Footer />
    </>
  );
}
