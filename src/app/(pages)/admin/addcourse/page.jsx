"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "../../../../components/AdminDashboard/Sidebar";
import { MdDelete, MdReportGmailerrorred } from "react-icons/md";
import { IoCloudUploadOutline } from "react-icons/io5";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { firestore, storage } from "../../../../Backend/Firebase";
import { IoMdClose } from "react-icons/io";
import { arrayUnion, collection, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import CustomToast from "@/components/CoustomToast/CoustomToast";
import AdminProtectedRoutes from "@/ProtectedRoutes/AdminProtectedRoutes";

const AddCourse = () => {
  const [toast, setToast] = useState({
    message: "",
    type: "",
    visible: false,
    duration: 5000,
  });

  const showToast = (message, type = "info", duration = 2000) => {
    setToast({ message, type, visible: true, duration });
  };

  const handleCloseToast = () => {
    setToast({ ...toast, visible: false });
  };



  const [step, setStep] = useState(1);
  const [learningPoint, setLearningPoint] = useState("");
  const [whoisthecoursefor, setWhoisthecoursefor] = useState("");
  const [examinformation, setExaminformation] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [courseCategorys,setCourseCategorys] = useState([]);
const [curriculum,setCurriculum ] = useState({
  curriculumTitle:"",
  curriculumPoints:[],
})
const [curriculumPointss,setCurriculumPointss] = useState("");
  const [uploadProgressExamPicture, setUploadProgressExamPicture] = useState(0);
  const [
    uploadProgressExamCertificateLogo,
    setUploadProgressExamCertificateLogo,
  ] = useState(0);
  const [formData, setFormData] = useState({
    courseTitle: "",
    courseLongDescription: "",
    courseShortDescription: "",
    courseId: "",
    courseInstructor: "",
    courseCategory: "beginner",
    coursePrice: 0,
    whatyouwillLearn: [],
    whoisthecoursefor: [],
    courseThumbnail: "",
    courseEnrollments: 0,
    seoDescription: "",
    seoKeywords: [],
    videoMedium: "Urdu & English",
    batchDuration: "2 to 4 Months",
    examinformation: [],
    examCertificatePicture: "",
    examCertificateInPicture: "",
    descriptionPoints:[],
    requirements:[],
    certificate:"",
    coursePrice:"",
    curriculumData:[]
  });
  const [errors, setErrors] = useState({});
  const [showfileData, setShowfileData] = useState({
    courseThumbnail: "",
    examCertificateInPicture: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]:
        name === "coursePrice" || name === "courseEnrollments"
          ? Number(value)
          : value,
    }));
  };

 //Cloudinary Function to upload images and thunbnails etc for the 
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_UPLOAD_PRESET);
    formData.append("cloud_name", process.env.NEXT_PUBLIC_CLOUD_NAME);
  
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to upload image: ${response.statusText}`);
      }
  
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.log(error.message);
    }
  };

  // Validation for each step
  const validateStep = () => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.courseTitle)
        newErrors.courseTitle = "Course title is required.";
      if (!formData.courseLongDescription)
        newErrors.courseLongDescription = "Course description is required.";
      if (!formData.courseShortDescription)
        newErrors.courseShortDescription = "Course description is required.";
      if (!formData.courseId)
        newErrors.courseId = "Course description is required.";
      if (!formData.coursePrice)
        newErrors.coursePrice = "Course Price is required.";
      if (formData.whoisthecoursefor.length > 0) {
        newErrors.whoisthecoursefor = "Please add 1 point atleast";
      }
      if (formData.whatyouwillLearn.length > 0) {
        newErrors.whatyouwillLearn = "Please add 1 point atleast";
      }
    } else if (step === 2) {
      if (!formData.courseThumbnail)
        newErrors.courseThumbnail = "Course media is required.";
    } else if (step === 3) {
      if (!formData.seoKeywords)
        newErrors.seoKeywords = "Please add atleat 1 keyword";
      if (!formData.seoDescription)
        newErrors.seoDescription = "Please add a description for SEO";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handlePrevious = () => {
    setStep((prevStep) => prevStep - 1);
  };

const [descriptionPoint,setDescriptionPoint]=useState("");
const [requirement,setRequirement]=useState("");


const addDescriptionPoint=()=>{
  setFormData((prev)=>({
    ...formData,descriptionPoints:[...prev.descriptionPoints,descriptionPoint]
  }))

}

const addRquirement=()=>{
  setFormData((prev)=>({
    ...formData,requirements:[...prev.requirements,requirement]
  }))

}

const getCourseCategorys = async()=>{
  const query = collection(firestore,"certification_courses_category");
  const querySnapshot = await getDocs(query);
  const temp = [];
  querySnapshot.forEach((doc)=>{
    temp.push({id:doc.id, ...doc.data()});
  })
  setCourseCategorys(temp);
}
  useEffect(()=>{
    getCourseCategorys();
  },[]);

  const handleSubmit = async () => {
    if (validateStep()) {
      
      // Submit the form data to backend or database

      await setDoc(doc(firestore, "courses", formData.courseId), {
        ...formData,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      });

      //Update category Collection's field
      const categoryCollectionRef = collection(firestore, "certification_courses_category");

      // Query the collection to find the document where the `id` matches the selected category
      const q = query(categoryCollectionRef, where("certificationsTitle", "==", formData.courseCategory));
      const querySnapshot = await getDocs(q)
      const docToUpdate = querySnapshot.docs[0];
      const docRef = doc(firestore, "certification_courses_category", docToUpdate.id);
      const existingArray = docRef.coursesInThisCertifications || [];
      
      await updateDoc(docRef, {
        coursesInThisCertifications: [...existingArray, formData.courseTitle],
      });
      setFormData({
        courseTitle: "",
        courseLongDescription: "",
        courseShortDescription: "",
        courseId: "",
        courseCategory: "",
        coursePrice: 0,
        courseInstructor: "",
        courseEnrollments: 0,
        seoDescription: "",
        examinformation: [],
        examCertificatePicture: "",
        whatyouwillLearn: [],
        whoisthecoursefor: [],
        courseThumbnail: "",
        seoKeywords: [],
        videoMedium: "Urdu & English",
        batchDuration: "3",
        examCertificateInPicture: "",
        instructorBrandLogo: "",
        courseStatus: "active",
        coursePrice:"",
        courseLogo:""
      });
    
    showToast("Course Added Successfully","success",2000);
    }
  };


  // 
  const handleCurriculumPointChange = (e)=>{
   setCurriculumPointss(e.target.value);
  }
  // 
  const handleFileChangeExamPic = async (e) => {
    const file = e.target.files[0];

    if (file) {
      // Set file details in showfileData for preview
      setShowfileData((prev) => ({
        ...prev,
        examCertificatePicture: file,
      }));

      // Check if the file size exceeds 3MB
      if (file.size > 3 * 1024 * 1024) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          examCertificatePicture: "The file should be under 3MB",
        }));
        setFormData((prev) => ({
          ...prev,
          examCertificatePicture: "", // Clear the file if it's too large
        }));
        return;
      }

      // Clear previous errors if the file is valid
      setErrors((prevErrors) => ({
        ...prevErrors,
        examCertificatePicture: "",
      }));

      // Reference for Firebase storage
    const imageURL = await uploadToCloudinary(file);
      setFormData((prev)=>({
        ...prev,
        examCertificateInPicture:imageURL
      }))
    }
  };

  const handleFileChangeExamCertificateInPicture = async (e) => {
    const file = e.target.files[0];

    if (file) {
      // Set file details in showfileData for preview
      setShowfileData((prev) => ({
        ...prev,
        examCertificateInPicture: file,
      }));

      // Check if the file size exceeds 3MB
      if (file.size > 3 * 1024 * 1024) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          examCertificateInPicture: "The file should be under 3MB",
        }));
        setFormData((prev) => ({
          ...prev,
          examCertificateInPicture: "", // Clear the file if it's too large
        }));
        return;
      }

      // Clear previous errors if the file is valid
      setErrors((prevErrors) => ({
        ...prevErrors,
        examCertificateInPicture: "",
      }));

      // Reference for Firebase storage
      const storageRef = ref(storage, `examCertificateInPicture/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      // Track upload progress
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setUploadProgressExamCertificateLogo(progress); // Update progress in state
        },
        (error) => {
          console.error("Upload failed:", error);
        },
        async () => {
          // Upload complete
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setFormData((prev) => ({
            ...prev,
            examCertificateInPicture: downloadURL, // Set URL in formData after upload
          }));
        }
      );
    }
  };



  const handleFileInstructorBrandLogo = async (e) => {
    const file = e.target.files[0];

    if (file) {
      // Set file details in showfileData for preview
      setShowfileData((prev) => ({
        ...prev,
        instructorBrandLogo: file,
      }));

      // Check if the file size exceeds 3MB
      if (file.size > 3 * 1024 * 1024) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          instructorBrandLogo: "The file should be under 3MB",
        }));
        setFormData((prev) => ({
          ...prev,
          instructorBrandLogo: "", // Clear the file if it's too large
        }));
        return;
      }

      // Clear previous errors if the file is valid
      setErrors((prevErrors) => ({
        ...prevErrors,
        instructorBrandLogo: "",
      }));

      // Reference for Firebase storage
      const storageRef = ref(storage, `instructorBrandLogo/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      // Track upload progress
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setUploadProgressExamCertificateLogo(progress); // Update progress in state
        },
        (error) => {
          console.error("Upload failed:", error);
        },
        async () => {
          // Upload complete
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setFormData((prev) => ({
            ...prev,
            instructorBrandLogo: downloadURL, // Set URL in formData after upload
          }));
        }
      );
    }
  };

  const addexamInformation = () => {
    if (examinformation.trim()) {
      setFormData((prevData) => ({
        ...prevData,
        examinformation: [...prevData.examinformation, examinformation],
      }));
      setExaminformation(""); // Clear the input after adding
    }
  };

  const removeexamInformation = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      examinformation: prevData.examinformation.filter((_, i) => i !== index),
    }));
  };
  const removeCurriculunPoint = (index)=>{
    setCurriculum((prev)=>({
      ...prev,
      curriculumPoints:prev.curriculumPoints.filter((_,i)=>i!==index),
    }))
  }
  console.log(curriculum);
  console.log(formData);

  // Navbar step navigation
  const goToStep = (stepNumber) => {
    setStep(stepNumber);
  };

  const addLearningPoint = () => {
    if (learningPoint.trim()) {
      setFormData((prevData) => ({
        ...prevData,
        whatyouwillLearn: [...prevData.whatyouwillLearn, learningPoint],
      }));
      setLearningPoint(""); // Clear the input after adding
    }
  };

  const removeLearningPoint = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      whatyouwillLearn: prevData.whatyouwillLearn.filter((_, i) => i !== index),
    }));
  };
  const removeDescriptionPoint = (index)=>{
    setFormData((prev)=>({
      ...prev,
      descriptionPoints:prev.descriptionPoints.filter((_,i)=>i!==index)
    }))
  }

  const removeRequirements = (index)=>{
    setFormData((prev)=>({
      ...prev,
      requirements:prev.requirements.filter((_,i)=>i!==index)
    }))
  }


  // Curriculum
    const addCurriculumPoint =()=>{
      setCurriculum((prev)=>({
        ...prev,
        curriculumPoints: [...prev.curriculumPoints,curriculumPointss],
      }))
      setCurriculumPointss("")
    }

    const addCurriculum =()=>{
      setFormData((prev)=>({
        ...prev,
        curriculumData: [...prev.curriculumData,curriculum],
      })) 
      setCurriculum({
        curriculumTitle: "",
        curriculumPoints: [],
      });
    }

  const addWhoisThisCourseforPoint = () => {
    if (whoisthecoursefor.trim()) {
      setFormData((prevData) => ({
        ...prevData,
        whoisthecoursefor: [...prevData.whoisthecoursefor, whoisthecoursefor],
      }));
      setWhoisthecoursefor(""); // Clear the input after adding
    }
  };

  const removeWhoisThisCourseforPoint = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      whoisthecoursefor: prevData.whoisthecoursefor.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const addSEOKeyWords = () => {
    if (seoKeywords.trim()) {
      setFormData((prevData) => ({
        ...prevData,
        seoKeywords: [...prevData.seoKeywords, seoKeywords],
      }));
      setSeoKeywords(""); // Clear the input after adding
    }
  };

  const removeSEOKeyWords = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      seoKeywords: prevData.seoKeywords.filter((_, i) => i !== index),
    }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (file) {
      // Set file details in showfileData for preview
      setShowfileData((prev) => ({
        ...prev,
        courseThumbnail: file,
      }));

      // Check if the file size exceeds 3MB
      if (file.size > 3 * 1024 * 1024) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          courseThumbnail: "The file should be under 3MB",
        }));
        setFormData((prev) => ({
          ...prev,
          courseThumbnail: "", // Clear the file if it's too large
        }));
        return;
      }

      // Clear previous errors if the file is valid
      setErrors((prevErrors) => ({
        ...prevErrors,
        courseThumbnail: "",
      }));

      // Reference for Firebase storage
      const imageURL = await uploadToCloudinary(file);
      setFormData((prev)=>({
        ...prev,
        courseThumbnail:imageURL
      }))
    }
  };
  const handleFileLogoChange = async (e) => {
    const file = e.target.files[0];

    if (file) {
      // Set file details in showfileData for preview
      setShowfileData((prev) => ({
        ...prev,
        courseLogo: file,
      }));

      // Check if the file size exceeds 3MB
      if (file.size > 3 * 1024 * 1024) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          courseLogo: "The file should be under 3MB",
        }));
        setFormData((prev) => ({
          ...prev,
          courseLogo: "", // Clear the file if it's too large
        }));
        return;
      }

      // Clear previous errors if the file is valid
      setErrors((prevErrors) => ({
        ...prevErrors,
        courseLogo: "",
      }));

      // Reference for Firebase storage
      const imageURL = await uploadToCloudinary(file);
      setFormData((prev)=>({
        ...prev,
        courseLogo:imageURL
      }))
    }
  };

  const deletefromFORMDATA = () => {
    setFormData((prev) => ({
      ...prev,
      courseThumbnail: null, // Clear file if invalid
    }));
    setUploadProgress(0);
  };

  const deletefromFORMDATA2 = () => {
    setFormData((prev) => ({
      ...prev,
      examCertificatePicture: null, // Clear file if invalid
    }));
    setUploadProgressExamPicture(0);
  };
  const deletefromFORMDATA3 = () => {
    setFormData((prev) => ({
      ...prev,
      courseLogo: null, // Clear file if invalid
    }));
    setUploadProgressExamPicture(0);
  };

  return (
    <AdminProtectedRoutes>
      <div className="flex w-full">
        {toast.visible && (
          <CustomToast
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={handleCloseToast}
          />
        )}
        <ToastContainer />
        <Sidebar />
        <div className="w-full">
          <div className="p-10">
            <h2 className="text-2xl font-bold mb-4 heading-text">
              Add New Course
            </h2>

            {/* Navbar for Steps */}
            <div className="flex justify-evenly mb-5 border-b pb-2">
              {["Course Content", "Course Media", "Course SEO"].map(
                (title, index) => (
                  <button
                    key={index}
                    onClick={() => goToStep(index + 1)}
                    className={`pb-1 px-2 font-semibold ${
                      step === index + 1
                        ? "border-b-2 border-primary text-primary"
                        : "text-gray-500"
                    }`}
                  >
                    {title}
                  </button>
                )
              )}
            </div>

            {/* Step Content */}
            <div className="stepper-content px-10">
              {step === 1 && (
                <div className="flex flex-col gap-3">
                  <div>
                    <label>Course Title*</label>
                    <input
                      type="text"
                      name="courseTitle"
                      value={formData.courseTitle}
                      onChange={handleChange}
                      className="w-full p-2 border rounded mt-1 mb-3 outline-none"
                    />
                    {errors.courseTitle && (
                      <p className="text-red-500 text-sm">
                        {errors.courseTitle}
                      </p>
                    )}
                  </div>
                  <div>
                    <label>Course Id*</label>
                    <input
                      type="text"
                      name="courseId"
                      value={formData.courseId}
                      onChange={handleChange}
                      className="w-full p-2 border rounded mt-1 mb-3 outline-none"
                    />
                    {errors.courseId && (
                      <p className="text-red-500 text-sm">{errors.courseId}</p>
                    )}
                  </div>
                  <div>
                    <label>Course Category*</label>
                    <select
                      type="text"
                      name="courseCategory"
                      value={formData.courseCategory}
                      onChange={handleChange}
                      className="w-full p-2 border rounded mt-1 mb-3 outline-none"
                    >
                      <option value="#">Select Category</option>
                      {courseCategorys && courseCategorys?.map((data,idx)=>{
                       return <option className="text-black" value={data.certificationsTitle} key={idx}>
                          {data.certificationsTitle}
                        </option>
                      })}
                    </select>
                    {errors.courseCategory && (
                      <p className="text-red-500 text-sm">{errors.courseCategory}</p>
                    )}
                  </div>
                  <div>
                    <label>Course Instructor*</label>
                    <input
                      type="text"
                      name="courseInstructor"
                      value={formData.courseInstructor}
                      onChange={handleChange}
                      className="w-full p-2 border rounded mt-1 mb-3 outline-none"
                    />
                    {errors.courseInstructor && (
                      <p className="text-red-500 text-sm">
                        {errors.courseInstructor}
                      </p>
                    )}
                  </div>
                  

                  <div>
                    <label>Batch Duration*</label>
                    <input
                      className="block w-full p-2 border rounded mt-1 mb-3 outline-none"
                      name="batchDuration"
                      id="batchDuration"
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label>Video Medium*</label>
                    <input
                      className="block w-full p-2 border rounded mt-1 mb-3 outline-none"
                      name="videoMedium"
                      id="videoMedium"
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    {" "}
                    <label>Course Short Description*</label>
                    <textarea
                      name="courseShortDescription"
                      value={formData.courseShortDescription}
                      onChange={handleChange}
                      className="w-full p-2 border h-[100px] resize-none rounded mt-1 mb-3"
                    />
                    {errors.courseShortDescription && (
                      <p className="text-red-500 text-sm">
                        {errors.courseShortDescription}
                      </p>
                    )}
                  </div>

                  <div>
                    <label>Course Long Description*</label>
                    <textarea
                      name="courseLongDescription"
                      value={formData.courseLongDescription}
                      onChange={handleChange}
                      className="w-full p-2 border h-[200px] resize-none rounded mt-1 mb-3"
                    />
                    {errors.courseLongDescription && (
                      <p className="text-red-500 text-sm">
                        {errors.courseLongDescription}
                      </p>
                    )}
                  </div>

                  <div>
                    <label>Description Points (optional)</label>
                    <div className="flex mb-3">
                      <input
                        type="text"
                        value={descriptionPoint}
                        onChange={(e) => setDescriptionPoint(e.target.value)}
                        placeholder="Add Description Point"
                        className="w-full p-2 border rounded-l outline-none"
                      />
                      <button
                        onClick={addDescriptionPoint}
                        className="bg-primary text-white px-4 rounded-r"
                      >
                        Add
                      </button>
                    </div>
                    <ul className="list-disc ml-6">
                      {formData.descriptionPoints.map((point, index) => (
                        <li
                          key={index}
                          className="flex justify-between items-center mb-2"
                        >
                          <span>{point}</span>
                          <button
                            onClick={() => removeDescriptionPoint(index)}
                            className="text-red-500 text-sm"
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>


{/* Certificate */}

<div>
                    <label>Certificate*</label>
                    <input
                      className="block w-full p-2 border rounded mt-1 mb-3 outline-none"
                      name="certificate"
                      id="certificate"
                      placeholder="On successful completion of the course participants will be awarded participation certificate from DigiPAKISTAN. Also prepare for International Exam."
                      onChange={handleChange}
                    />
                  </div>


{/* Certificate */}

                                          {/* ************************ Requirements *********************** */}
                  <div>
                    <label>Course Requirements*</label>
                    <div className="flex mb-3">
                      <input
                        type="text"
                        value={requirement}
                        onChange={(e) => setRequirement(e.target.value)}
                        placeholder="Add Requirements"
                        className="w-full p-2 border rounded-l outline-none"
                      />
                      <button
                        onClick={addRquirement}
                        className="bg-primary text-white px-4 rounded-r"
                      >
                        Add
                      </button>
                    </div>
                    <ul className="list-disc ml-6">
                      {formData.requirements.map((point, index) => (
                        <li
                          key={index}
                          className="flex justify-between items-center mb-2"
                        >
                          <span>{point}</span>
                          <button
                            onClick={() => removeRequirements(index)}
                            className="text-red-500 text-sm"
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <label>Course Price*</label>
                    <input
                      name="coursePrice"
                      type="number"
                      onChange={handleChange}
                      className="w-full p-2 border rounded mt-1 mb-3 outline-none"
                    />
                    {errors.coursePrice && (
                      <p className="text-red-500 text-sm">
                        {errors.coursePrice}
                      </p>
                    )}
                  </div>

                  <div>
                    <label>What You Will Learn</label>
                    <div className="flex mb-3">
                      <input
                        type="text"
                        value={learningPoint}
                        onChange={(e) => setLearningPoint(e.target.value)}
                        placeholder="Add a learning point"
                        className="w-full p-2 border rounded-l outline-none"
                      />
                      <button
                        onClick={addLearningPoint}
                        className="bg-primary text-white px-4 rounded-r"
                      >
                        Add
                      </button>
                    </div>
                    <ul className="list-disc ml-6">
                      {formData.whatyouwillLearn.map((point, index) => (
                        <li
                          key={index}
                          className="flex justify-between items-center mb-2"
                        >
                          <span>{point}</span>
                          <button
                            onClick={() => removeLearningPoint(index)}
                            className="text-red-500 text-sm"
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <label>Who is this course for*</label>
                    <div className="flex mb-3">
                      <input
                        type="text"
                        value={whoisthecoursefor}
                        onChange={(e) => setWhoisthecoursefor(e.target.value)}
                        placeholder="Add a course point"
                        className="w-full p-2 border rounded-l outline-none"
                      />
                      <button
                        onClick={addWhoisThisCourseforPoint}
                        className="bg-primary text-white px-4 rounded-r"
                      >
                        Add
                      </button>
                    </div>
                    <ul className="list-disc ml-6">
                      {formData.whoisthecoursefor.map((point, index) => (
                        <li
                          key={index}
                          className="flex justify-between items-center mb-2"
                        >
                          <span>{point}</span>
                          <button
                            onClick={() => removeWhoisThisCourseforPoint(index)}
                            className="text-red-500 text-sm"
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* <div>
                    <label>Exam Information*</label>
                    <div className="flex mb-3">
                      <input
                        type="text"
                        value={examinformation}
                        onChange={(e) => setExaminformation(e.target.value)}
                        placeholder="Add a exam point"
                        className="w-full p-2 border rounded-l outline-none"
                      />
                      <button
                        onClick={addexamInformation}
                        className="bg-primary text-white px-4 rounded-r"
                      >
                        Add
                      </button>
                    </div>
                    <ul className="list-disc ml-6">
                      {formData.examinformation.map((point, index) => (
                        <li
                          key={index}
                          className="flex justify-between items-center mb-2"
                        >
                          <span>{point}</span>
                          <button
                            onClick={() => removeexamInformation(index)}
                            className="text-red-500 text-sm"
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div> */}


<div>
                    <label>Course Curriculum*</label>
                    <div className="flex flex-col mb-3">
                     
                      <div className="flex gap-3">
                      <input
                        type="text"
                        value={curriculum.curriculumTitle}
                        onChange={(e) => setCurriculum((prev)=>({...prev,curriculumTitle:e.target.value}))}
                        placeholder="Add Course Title"
                        className="w-full p-2 border rounded-l outline-none"
                      />
                     
                      <input
                        type="text"
                        value={curriculumPointss}
                        onChange={handleCurriculumPointChange}
                        placeholder="Curriculum Point"
                        className="w-full p-2 border rounded-l outline-none"
                      />
                      <button className="bg-primary text-white px-4 rounded-r" onClick={addCurriculumPoint}>
                            Add 
                          </button>
                      </div>
                    <ul>
                   {
                    curriculum.curriculumPoints && curriculum.curriculumPoints?.map((point,index)=>{
                    return  <li
                          key={index}
                          className="flex justify-between items-center mb-2"
                        >
                          <span>{point}</span>
                          <button
                            onClick={() => removeCurriculunPoint(index)}
                            className="text-red-500 text-sm"
                          >
                            Remove
                          </button>
                        </li>
                    })
                   }
                   </ul> 
                      <button
                        onClick={addCurriculum}
                        className="bg-primary text-white px-4 py-3 mt-4 w-44 rounded-r"
                      >
                        Add Curriculum
                      </button>
                    </div>
                    <ul className="list-disc ml-6">
                      {formData.examinformation.map((point, index) => (
                        <li
                          key={index}
                          className="flex justify-between items-center mb-2"
                        >
                          <span>{point}</span>
                          <button
                            onClick={() => removeexamInformation(index)}
                            className="text-red-500 text-sm"
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              {step === 2 && (
                <div>
                  <div>
                    <label className="block mb-1 font-medium">
                      Upload a course Thumbnail
                    </label>
                    <input
                      type="file"
                      accept=".jpg, .png, .pdf"
                      id="courseThumbnail"
                      name="courseThumbnail"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <label
                      htmlFor="courseThumbnail"
                      className="flex flex-col gap-2 items-center bg-primary/30 mt-5 rounded-md hover:bg-primary/20 cursor-pointer duration-500 justify-center py-10"
                    >
                      <IoCloudUploadOutline
                        size={40}
                        className="text-gray-500"
                      />
                      <h2 className="text-black text-center text-[1.1rem] font-medium">
                        Click to select or drag and drop your file here.
                      </h2>
                      <h6 className="text-[0.9rem]">
                        Accepted formats: jpg, png, pdf
                      </h6>
                      <p className="text-[0.8rem]">Max Size: 1MB</p>
                    </label>

                    {errors.courseThumbnail && (
                      <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <h6>
                          <MdReportGmailerrorred />
                        </h6>
                        <span>{errors.courseThumbnail}</span>
                      </div>
                    )}
                    {uploadProgress !== 0 && (
                      <h5 className="mt-4">Uploading {uploadProgress}%</h5>
                    )}
                    {formData.courseThumbnail && (
                      <div className="w-full border mt-5 rounded-md overflow-y-hidden lg:overflow-x-hidden overflow-x-scroll">
                        <table className="w-full table-auto ">
                          <thead>
                            <tr className="text-left border border-gray-200">
                              <th className="px-4 py-2">Preview Image</th>
                              <th className="px-4 py-2">Name</th>
                              <th className="px-4 py-2">Size</th>
                              <th className="px-4 py-2">Type</th>
                              <th className="px-4 py-2">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border px-4 py-2">
                                <img
                                  src={formData.courseThumbnail}
                                  alt="courseThumbnail"
                                  className="w-[50px] h-[50px] object-cover"
                                />
                              </td>
                              <td className="border px-4 py-2 truncate">
                                {showfileData.courseThumbnail.name}
                              </td>
                              <td className="border px-4 py-2 truncate">
                                {showfileData.courseThumbnail.size} bytes
                              </td>
                              <td className="border px-4 py-2 truncate">
                                {showfileData.courseThumbnail.type}
                              </td>
                              <td className="border px-4 py-2 text-center">
                                <button
                                  onClick={() => deletefromFORMDATA()}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <MdDelete />
                                </button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>


                  <div>
                    <label className="block mt-4 font-medium">
                      Upload a course Logo
                    </label>
                    <input
                      type="file"
                      accept=".jpg, .png, .pdf"
                      id="courseLogo"
                      name="courseLogo"
                      className="hidden"
                      onChange={handleFileLogoChange}
                    />
                    <label
                      htmlFor="courseLogo"
                      className="flex flex-col gap-2 items-center bg-primary/30 mt-5 rounded-md hover:bg-primary/20 cursor-pointer duration-500 justify-center py-10"
                    >
                      <IoCloudUploadOutline
                        size={40}
                        className="text-gray-500"
                      />
                      <h2 className="text-black text-center text-[1.1rem] font-medium">
                        Click to select or drag and drop your file here.
                      </h2>
                      <h6 className="text-[0.9rem]">
                        Accepted formats: jpg, png, pdf
                      </h6>
                      <p className="text-[0.8rem]">Max Size: 1MB</p>
                    </label>

                    {errors.courseLogo && (
                      <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <h6>
                          <MdReportGmailerrorred />
                        </h6>
                        <span>{errors.courseLogo}</span>
                      </div>
                    )}
                    {uploadProgress !== 0 && (
                      <h5 className="mt-4">Uploading {uploadProgress}%</h5>
                    )}
                    {formData.courseLogo && (
                      <div className="w-full border mt-5 rounded-md overflow-y-hidden lg:overflow-x-hidden overflow-x-scroll">
                        <table className="w-full table-auto ">
                          <thead>
                            <tr className="text-left border border-gray-200">
                              <th className="px-4 py-2">Preview Image</th>
                              <th className="px-4 py-2">Name</th>
                              <th className="px-4 py-2">Size</th>
                              <th className="px-4 py-2">Type</th>
                              <th className="px-4 py-2">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border px-4 py-2">
                                <img
                                  src={formData.courseLogo}
                                  alt="courseLogo"
                                  className="w-[50px] h-[50px] object-cover"
                                />
                              </td>
                              <td className="border px-4 py-2 truncate">
                                {showfileData.courseLogo.name}
                              </td>
                              <td className="border px-4 py-2 truncate">
                                {showfileData.courseLogo.size} bytes
                              </td>
                              <td className="border px-4 py-2 truncate">
                                {showfileData.courseLogo.type}
                              </td>
                              <td className="border px-4 py-2 text-center">
                                <button
                                  onClick={() => deletefromFORMDATA3()}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <MdDelete />
                                </button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>




                  {/* <div className="mt-5">
                    <label className="block mb-1 font-medium">
                      Upload a Exam Certificate Picture
                    </label>
                    <input
                      type="file"
                      accept=".jpg, .png, .pdf"
                      id="examCertificatePicture"
                      name="examCertificatePicture"
                      className="hidden"
                      onChange={handleFileChangeExamPic}
                    />
                    <label
                      htmlFor="examCertificatePicture"
                      className="flex flex-col gap-2 items-center bg-primary/30 mt-5 rounded-md hover:bg-primary/20 cursor-pointer duration-500 justify-center py-10"
                    >
                      <IoCloudUploadOutline
                        size={40}
                        className="text-gray-500"
                      />
                      <h2 className="text-black text-center text-[1.1rem] font-medium">
                        Click to select or drag and drop your file here.
                      </h2>
                      <h6 className="text-[0.9rem]">
                        Accepted formats: jpg, png, pdf
                      </h6>
                      <p className="text-[0.8rem]">Max Size: 1MB</p>
                    </label>

                    {errors.examCertificateInPicture && (
                      <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <h6>
                          <MdReportGmailerrorred />
                        </h6>
                        <span>{errors.courseBundleThumbnail}</span>
                      </div>
                    )}
                    {uploadProgressExamPicture !== 0 && (
                      <h5 className="mt-4">
                        Uploading {uploadProgressExamPicture}%
                      </h5>
                    )}
                    {formData.examCertificatePicture && (
                      <div className="w-full border mt-5 rounded-md overflow-y-hidden lg:overflow-x-hidden overflow-x-scroll">
                        <table className="w-full table-auto ">
                          <thead>
                            <tr className="text-left border border-gray-200">
                              <th className="px-4 py-2">Preview Image</th>
                              <th className="px-4 py-2">Name</th>
                              <th className="px-4 py-2">Size</th>
                              <th className="px-4 py-2">Type</th>
                              <th className="px-4 py-2">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border px-4 py-2">
                                <img
                                  src={formData.examCertificatePicture}
                                  alt="examCertificatePicture"
                                  className="w-[50px] h-[50px] object-cover"
                                />
                              </td>
                              <td className="border px-4 py-2 truncate">
                                {showfileData.examCertificatePicture.name}
                              </td>
                              <td className="border px-4 py-2 truncate">
                                {showfileData.examCertificatePicture.size} bytes
                              </td>
                              <td className="border px-4 py-2 truncate">
                                {showfileData.examCertificatePicture.type}
                              </td>
                              <td className="border px-4 py-2 text-center">
                                <button
                                  onClick={() => deletefromFORMDATA2()}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <MdDelete />
                                </button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                  <div className="mt-5">
                    <label className="block mb-1 font-medium">
                      Upload a Exam Certificate Logo
                    </label>
                    <input
                      type="file"
                      accept=".jpg, .png, .pdf"
                      id="examCertificateInPicture"
                      name="examCertificateInPicture"
                      className="hidden"
                      onChange={handleFileChangeExamCertificateInPicture}
                    />
                    <label
                      htmlFor="examCertificateInPicture"
                      className="flex flex-col gap-2 items-center bg-primary/30 mt-5 rounded-md hover:bg-primary/20 cursor-pointer duration-500 justify-center py-10"
                    >
                      <IoCloudUploadOutline
                        size={40}
                        className="text-gray-500"
                      />
                      <h2 className="text-black text-center text-[1.1rem] font-medium">
                        Click to select or drag and drop your file here.
                      </h2>
                      <h6 className="text-[0.9rem]">
                        Accepted formats: jpg, png, pdf
                      </h6>
                      <p className="text-[0.8rem]">Max Size: 1MB</p>
                    </label>

                    {errors.examCertificateInPicture && (
                      <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <h6>
                          <MdReportGmailerrorred />
                        </h6>
                        <span>{errors.examCertificateInPicture}</span>
                      </div>
                    )}
                    {uploadProgressExamCertificateLogo !== 0 && (
                      <h5 className="mt-4">
                        Uploading {uploadProgressExamCertificateLogo}%
                      </h5>
                    )}
                    {formData.examCertificateInPicture && (
                      <div className="w-full border mt-5 rounded-md overflow-y-hidden lg:overflow-x-hidden overflow-x-scroll">
                        <table className="w-full table-auto ">
                          <thead>
                            <tr className="text-left border border-gray-200">
                              <th className="px-4 py-2">Preview Image</th>
                              <th className="px-4 py-2">Name</th>
                              <th className="px-4 py-2">Size</th>
                              <th className="px-4 py-2">Type</th>
                              <th className="px-4 py-2">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border px-4 py-2">
                                <img
                                  src={formData.examCertificateInPicture}
                                  alt="examCertificateInPicture"
                                  className="w-[50px] h-[50px] object-cover"
                                />
                              </td>
                              <td className="border px-4 py-2 truncate">
                                {showfileData.examCertificateInPicture.name}
                              </td>
                              <td className="border px-4 py-2 truncate">
                                {showfileData.examCertificateInPicture.size}{" "}
                                bytes
                              </td>
                              <td className="border px-4 py-2 truncate">
                                {showfileData.examCertificateInPicture.type}
                              </td>
                              <td className="border px-4 py-2 text-center">
                                <button
                                  onClick={() => deletefromFORMDATA2()}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <MdDelete />
                                </button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                  <div className="mt-5">
                    <label className="block mb-1 font-medium">
                      Upload a Instructor Brand Logo
                    </label>
                    <input
                      type="file"
                      accept=".jpg, .png, .pdf"
                      id="instructorBrandLogo"
                      name="instructorBrandLogo"
                      className="hidden"
                      onChange={handleFileInstructorBrandLogo}
                    />
                    <label
                      htmlFor="instructorBrandLogo"
                      className="flex flex-col gap-2 items-center bg-primary/30 mt-5 rounded-md hover:bg-primary/20 cursor-pointer duration-500 justify-center py-10"
                    >
                      <IoCloudUploadOutline
                        size={40}
                        className="text-gray-500"
                      />
                      <h2 className="text-black text-center text-[1.1rem] font-medium">
                        Click to select or drag and drop your file here.
                      </h2>
                      <h6 className="text-[0.9rem]">
                        Accepted formats: jpg, png, pdf
                      </h6>
                      <p className="text-[0.8rem]">Max Size: 1MB</p>
                    </label>

                    {errors.instructorBrandLogo && (
                      <div className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <h6>
                          <MdReportGmailerrorred />
                        </h6>
                        <span>{errors.instructorBrandLogo}</span>
                      </div>
                    )}
                    {uploadProgressExamCertificateLogo !== 0 && (
                      <h5 className="mt-4">
                        Uploading {uploadProgressExamCertificateLogo}%
                      </h5>
                    )}
                    {formData.instructorBrandLogo && (
                      <div className="w-full border mt-5 rounded-md overflow-y-hidden lg:overflow-x-hidden overflow-x-scroll">
                        <table className="w-full table-auto ">
                          <thead>
                            <tr className="text-left border border-gray-200">
                              <th className="px-4 py-2">Preview Image</th>
                              <th className="px-4 py-2">Name</th>
                              <th className="px-4 py-2">Size</th>
                              <th className="px-4 py-2">Type</th>
                              <th className="px-4 py-2">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border px-4 py-2">
                                <img
                                  src={formData.instructorBrandLogo}
                                  alt="instructorBrandLogo"
                                  className="w-[50px] h-[50px] object-cover"
                                />
                              </td>
                              <td className="border px-4 py-2 truncate">
                                {showfileData.instructorBrandLogo.name}
                              </td>
                              <td className="border px-4 py-2 truncate">
                                {showfileData.instructorBrandLogo.size} bytes
                              </td>
                              <td className="border px-4 py-2 truncate">
                                {showfileData.instructorBrandLogo.type}
                              </td>
                              <td className="border px-4 py-2 text-center">
                                <button
                                  onClick={() => deletefromFORMDATA2()}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <MdDelete />
                                </button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div> */}
                </div>
              )}
              {step === 3 && (
                <div>
                  <div>
                    <label>Add SEO Description*</label>
                    <div className="flex mb-3">
                      <input
                        type="text"
                        value={formData.seoDescription}
                        onChange={handleChange}
                        name="seoDescription"
                        placeholder="Enter a SEO Description"
                        className="w-full p-2 border rounded-l outline-none"
                      />
                    </div>
                    <label>Add SEO Keywords*</label>
                    <div className="flex mb-3">
                      <input
                        type="text"
                        value={seoKeywords}
                        onChange={(e) => setSeoKeywords(e.target.value)}
                        placeholder="Add a SEO Keyword"
                        className="w-full p-2 border rounded-l outline-none"
                      />
                      <button
                        onClick={addSEOKeyWords}
                        className="bg-primary text-white px-4 rounded-r"
                      >
                        Add
                      </button>
                    </div>
                    {formData.seoKeywords.length > 0 && (
                      <ul className="list-disc p-5 rounded border grid grid-cols-6 gap-5">
                        {formData.seoKeywords.map((point, index) => (
                          <li
                            key={index}
                            className="flex w-full justify-between text-white items-center bg-red-500 p-2 rounded"
                          >
                            <span>{point}</span>
                            <button
                              onClick={() => removeSEOKeyWords(index)}
                              className="text-white text-sm"
                            >
                              <IoMdClose />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="stepper-buttons flex justify-center gap-3 mt-3">
              {step > 1 && (
                <button
                  onClick={handlePrevious}
                  className="bg-slate-300 hover:bg-primary/90 duration-200 text-white px-4 py-2 rounded"
                >
                  Previous
                </button>
              )}
              {step < 3 ? (
                <button
                  onClick={handleNext}
                  className="bg-primary/70 hover:bg-primary/90 duration-200 text-white px-4 py-2 rounded"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Submit
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminProtectedRoutes>
  );
};

export default AddCourse;
