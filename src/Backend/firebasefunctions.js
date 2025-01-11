import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { firestore } from "./Firebase";

const getFormattedDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`; // Format: "2023-10-21"
};

const todayDate = getFormattedDate(new Date());
const yesterdayDate = getFormattedDate(new Date(Date.now() - 86400000)); // 86400000 ms in a day

// Registrations
export const getLatestRegistrations = async () => {
  const q = query(collection(firestore, "course_registration_data"), limit(5));
  const querySnapshot = await getDocs(q);
  const temp = [];
  let todayCount = 0;
  let yesterdayCount = 0;

  querySnapshot.forEach((doc) => {
    const data = { id: doc.id, ...doc.data() };
    if (data.created_at && data.created_at.toDate) {
      const createdAtDate = data.created_at.toDate();
      const formattedDate = getFormattedDate(createdAtDate);

      if (formattedDate === todayDate) {
        todayCount++;
      } else if (formattedDate === yesterdayDate) {
        yesterdayCount++;
      }
    }

    temp.push(data);
  });

  return { data: temp, todayCount, yesterdayCount };
};

// Payments
export const getLatestPayments = async () => {
  const q = query(collection(firestore, "payments"), limit(5));
  const querySnapshot = await getDocs(q);
  const temp = [];
  let todayCount = 0;
  let yesterdayCount = 0;

  querySnapshot.forEach((doc) => {
    const data = { id: doc.id, ...doc.data() };
    if (data.createdAt && data.createdAt.toDate) {
      const createdAtDate = data.createdAt.toDate();
      const formattedDate = getFormattedDate(createdAtDate);

      if (formattedDate === todayDate) {
        todayCount++;
      } else if (formattedDate === yesterdayDate) {
        yesterdayCount++;
      }
    }

    temp.push(data);
  });

  return { data: temp, todayCount, yesterdayCount };
};

// Bundle Payments
export const getLatestBundlePayments = async () => {
  const q = query(collection(firestore, "courses_bundles_payments"), limit(5));
  const querySnapshot = await getDocs(q);
  const temp = [];
  let todayCount = 0;
  let yesterdayCount = 0;

  querySnapshot.forEach((doc) => {
    const data = { id: doc.id, ...doc.data() };
    if (data.createdAt && data.createdAt.toDate) {
      const createdAtDate = data.createdAt.toDate();
      const formattedDate = getFormattedDate(createdAtDate);

      if (formattedDate === todayDate) {
        todayCount++;
      } else if (formattedDate === yesterdayDate) {
        yesterdayCount++;
      }
    }

    temp.push(data);
  });

  return { data: temp, todayCount, yesterdayCount };
};

// get All bundle Payments
export const getAllBundle = async () => {
  const q = query(collection(firestore, "courses_bundle"), limit(5));
  const querySnapshot = await getDocs(q);
  const temp = [];
  let todayCount = 0;
  let yesterdayCount = 0;

  querySnapshot.forEach((doc) => {
    const data = { id: doc.id, ...doc.data() };
    if (data.createdAt && data.createdAt.toDate) {
      const createdAtDate = data.createdAt.toDate();
      const formattedDate = getFormattedDate(createdAtDate);

      if (formattedDate === todayDate) {
        todayCount++;
      } else if (formattedDate === yesterdayDate) {
        yesterdayCount++;
      }
    }

    temp.push(data);
  });

  return { data: temp, todayCount, yesterdayCount };
};

export const getAllBundleCourses = async () => {
  const q = query(collection(firestore, "courses_bundle"));
  const querySnapshot = await getDocs(q);
  const temp = [];
  let todayCount = 0;
  let yesterdayCount = 0;

  querySnapshot.forEach((doc) => {
    const data = { id: doc.id, ...doc.data() };
    if (data.createdAt && data.createdAt.toDate) {
      const createdAtDate = data.createdAt.toDate();
      const formattedDate = getFormattedDate(createdAtDate);

      if (formattedDate === todayDate) {
        todayCount++;
      } else if (formattedDate === yesterdayDate) {
        yesterdayCount++;
      }
    }

    temp.push(data);
  });

  return { data: temp, todayCount, yesterdayCount };
};

// Get All Certifications Categoryes
export const getAllCertificationCategoryes = async () => {
  const q = query(collection(firestore, "certification_courses_category"));
  const querySnapshot = await getDocs(q);
  const temp = [];
  let todayCount = 0;
  let yesterdayCount = 0;

  querySnapshot.forEach((doc) => {
    const data = { id: doc.id, ...doc.data() };
    if (data.created_at && data.created_at.toDate) {
      const created_atDate = data.created_at.toDate();
      const formattedDate = getFormattedDate(created_atDate);

      if (formattedDate === todayDate) {
        todayCount++;
      } else if (formattedDate === yesterdayDate) {
        yesterdayCount++;
      }
    }

    temp.push(data);
  });

  return { data: temp, todayCount, yesterdayCount };
};

export const getAllVideo = async () => {
  const q = query(collection(firestore, "site_videos"));
  const querySnapshot = await getDocs(q);
  const temp = [];
  let todayCount = 0;
  let yesterdayCount = 0;

  querySnapshot.forEach((doc) => {
    const data = { id: doc.id, ...doc.data() };
    if (data.created_at && data.created_at.toDate) {
      const created_atDate = data.created_at.toDate();
      const formattedDate = getFormattedDate(created_atDate);

      if (formattedDate === todayDate) {
        todayCount++;
      } else if (formattedDate === yesterdayDate) {
        yesterdayCount++;
      }
    }

    temp.push(data);
  });

  return { data: temp, todayCount, yesterdayCount };
};

export const getSingleVideo = async (id) => {
  const adminDocRef = doc(firestore, "site_videos", id);
  const adminDoc = await getDoc(adminDocRef);

  if (!adminDoc.exists) {
    return { data: null };
  }

  const courseData = adminDoc.data();

  // Convert any Firestore Timestamps to plain date strings or Unix timestamps
  return {
    data: {
      ...courseData,
    },
  };
};

export const getAllCaegorys = async () => {
  const q = query(collection(firestore, "courses_category"), limit(5));
  const querySnapshot = await getDocs(q);
  const temp = [];
  let todayCount = 0;
  let yesterdayCount = 0;

  querySnapshot.forEach((doc) => {
    const data = { id: doc.id, ...doc.data() };
    if (data.created_at && data.created_at.toDate) {
      const createdAtDate = data.created_at.toDate();
      const formattedDate = getFormattedDate(createdAtDate);

      if (formattedDate === todayDate) {
        todayCount++;
      } else if (formattedDate === yesterdayDate) {
        yesterdayCount++;
      }
    }

    temp.push(data);
  });

  return { data: temp, todayCount, yesterdayCount };
};

// Admins
export const getAllAdmins = async () => {
  const q = collection(firestore, "site_admins_details");
  const querySnapshot = await getDocs(q);
  const temp = [];
  let todayCount = 0;
  let yesterdayCount = 0;

  querySnapshot.forEach((doc) => {
    const data = { id: doc.id, ...doc.data() };
    if (data.created_at && data.created_at.toDate) {
      const createdAtDate = data.created_at.toDate();
      const formattedDate = getFormattedDate(createdAtDate);

      if (formattedDate === todayDate) {
        todayCount++;
      } else if (formattedDate === yesterdayDate) {
        yesterdayCount++;
      }
    }

    temp.push(data);
  });

  return { data: temp, todayCount, yesterdayCount };
};

// Payment Verifications
export const getLatestPaymentVerificationsRequests = async () => {
  const q = collection(firestore, "payment_verification_requests");
  const querySnapshot = await getDocs(q);
  const temp = [];
  let todayCount = 0;
  let yesterdayCount = 0;

  querySnapshot.forEach((doc) => {
    const data = { id: doc.id, ...doc.data() };
    if (data.created_at && data.created_at.toDate) {
      const createdAtDate = data.created_at.toDate();
      const formattedDate = getFormattedDate(createdAtDate);

      if (formattedDate === todayDate) {
        todayCount++;
      } else if (formattedDate === yesterdayDate) {
        yesterdayCount++;
      }
    }

    temp.push(data);
  });

  return { data: temp, todayCount, yesterdayCount };
};

// User Admission Tests
export const getUserAdmissionTestsResults = async () => {
  const q = collection(firestore, "onlineTest_results");
  const querySnapshot = await getDocs(q);
  const temp = [];
  let todayCount = 0;
  let yesterdayCount = 0;

  querySnapshot.forEach((doc) => {
    const data = { id: doc.id, ...doc.data() };
    if (data.created_at && data.created_at.toDate) {
      const createdAtDate = data.created_at.toDate();
      const formattedDate = getFormattedDate(createdAtDate);

      if (formattedDate === todayDate) {
        todayCount++;
      } else if (formattedDate === yesterdayDate) {
        yesterdayCount++;
      }
    }

    temp.push(data);
  });

  return { data: temp, todayCount, yesterdayCount };
};

// Get All users
export const getAllUsers = async () => {
  const q = collection(firestore, "users");
  const querySnapshot = await getDocs(q);
  const temp = [];
  let todayCount = 0;
  let yesterdayCount = 0;

  querySnapshot.forEach((doc) => {
    const data = { id: doc.id, ...doc.data() };
    if (data.created_at && data.created_at.toDate) {
      const createdAtDate = data.created_at.toDate();
      const formattedDate = getFormattedDate(createdAtDate);

      if (formattedDate === todayDate) {
        todayCount++;
      } else if (formattedDate === yesterdayDate) {
        yesterdayCount++;
      }
    }

    temp.push(data);
  });

  return { data: temp, todayCount, yesterdayCount };
};

// Get All Emails Settings
export const getAllEmailSettings = async () => {
  const q = collection(firestore, "email_notify_settings");
  const querySnapshot = await getDocs(q);
  const temp = [];

  querySnapshot.forEach((doc) => {
    const data = { id: doc.id, ...doc.data() };

    temp.push(data);
  });

  return { data: temp };
};

// Get All Email Template
export const getAllTemplate_for_editing = async () => {
  const q = collection(firestore, "email_templates");
  const querySnapshot = await getDocs(q);
  const temp = [];

  querySnapshot.forEach((doc) => {
    const data = { id: doc.id, ...doc.data() };

    temp.push(data);
  });

  return { data: temp };
};

export const updateEmailSettingStatus = async (id, status) => {
  try {
    console.log(
      `Searching for documents where 'backend_notify_message' == '${id}'`
    );

    // Query the collection where "backend_notify_message" matches the "id" value
    const q = query(
      collection(firestore, "email_settings"),
      where("backend_notify_message", "==", id)
    );

    const querySnapshot = await getDocs(q);

    console.log(`Query result size: ${querySnapshot.size}`);

    if (!querySnapshot.empty) {
      // Loop through the matching documents (if multiple are found)
      for (const docSnap of querySnapshot.docs) {
        const docRef = docSnap.ref; // Reference to the document
        console.log(`Updating document with ID: ${docSnap.id}`);
        await updateDoc(docRef, { email_status: status });
        console.log(`Email status updated for '${id}' to ${status}`);
      }
    } else {
      console.log(
        `No document found where 'backend_notify_message' == '${id}'`
      );
    }
  } catch (error) {
    console.error("Error updating email status:", error);
    throw new Error("Failed to update email status.");
  }
};

// Get All Failed User Tests
export const getAllFailedUsersTests = async () => {
  const q = query(
    collection(firestore, "onlineTest_results"),
    where("passFailStatus", "==", "Failed")
  );
  const querySnapshot = await getDocs(q);
  const temp = [];
  let todayCount = 0;
  let yesterdayCount = 0;

  querySnapshot.forEach((doc) => {
    const data = { id: doc.id, ...doc.data() };
    if (data.created_at && data.created_at.toDate) {
      const createdAtDate = data.created_at.toDate();
      const formattedDate = getFormattedDate(createdAtDate);

      if (formattedDate === todayDate) {
        todayCount++;
      } else if (formattedDate === yesterdayDate) {
        yesterdayCount++;
      }
    }

    temp.push(data);
  });

  return { data: temp, todayCount, yesterdayCount };
};

// Get All Passed User Tests
export const getAllPassedUsersTest = async () => {
  const q = query(
    collection(firestore, "onlineTest_results"),
    where("passFailStatus", "==", "Passed")
  );
  const querySnapshot = await getDocs(q);
  const temp = [];
  let todayCount = 0;
  let yesterdayCount = 0;

  querySnapshot.forEach((doc) => {
    const data = { id: doc.id, ...doc.data() };
    if (data.created_at && data.created_at.toDate) {
      const createdAtDate = data.created_at.toDate();
      const formattedDate = getFormattedDate(createdAtDate);

      if (formattedDate === todayDate) {
        todayCount++;
      } else if (formattedDate === yesterdayDate) {
        yesterdayCount++;
      }
    }

    temp.push(data);
  });

  return { data: temp, todayCount, yesterdayCount };
};

// Get All Passed User Tests
export const getAllCourses = async () => {
  const q = collection(firestore, "courses");
  const querySnapshot = await getDocs(q);
  const temp = [];

  let todayCount = 0;
  let yesterdayCount = 0;

  querySnapshot.forEach((doc) => {
    const data = { id: doc.id, ...doc.data() };

    // Convert Firestore timestamp fields to ISO strings if they exist
    if (data.created_at?.toDate) {
      const createdAtDate = data.created_at.toDate();
      data.created_at = createdAtDate.toISOString();

      const formattedDate = getFormattedDate(createdAtDate);
      if (formattedDate === todayDate) {
        todayCount++;
      } else if (formattedDate === yesterdayDate) {
        yesterdayCount++;
      }
    }

    if (data.updated_at?.toDate) {
      data.updated_at = data.updated_at.toDate().toISOString();
    }

    temp.push(data);
  });

  // Return the data array and counts as an object
  return { data: temp, todayCount, yesterdayCount };
};

export const getAllCoursesBundles = async () => {
  const q = collection(firestore, "courses_bundle");

  const querySnapshot = await getDocs(q);
  const temp = [];
  let todayCount = 0;
  let yesterdayCount = 0;

  querySnapshot.forEach((doc) => {
    const data = { id: doc.id, ...doc.data() };
    if (data.created_at && data.created_at.toDate) {
      const createdAtDate = data.created_at.toDate();
      const formattedDate = getFormattedDate(createdAtDate);

      if (formattedDate === todayDate) {
        todayCount++;
      } else if (formattedDate === yesterdayDate) {
        yesterdayCount++;
      }
    }

    temp.push(data);
  });

  return { data: temp, todayCount, yesterdayCount };
};

// Get All Passed User Tests
export const getAllApprovedAdmissions = async () => {
  const q = collection(firestore, "approved_payments_data");

  const querySnapshot = await getDocs(q);
  const temp = [];
  let todayCount = 0;
  let yesterdayCount = 0;

  querySnapshot.forEach((doc) => {
    const data = { id: doc.id, ...doc.data() };
    if (data.created_at && data.created_at.toDate) {
      const createdAtDate = data.created_at.toDate();
      const formattedDate = getFormattedDate(createdAtDate);

      if (formattedDate === todayDate) {
        todayCount++;
      } else if (formattedDate === yesterdayDate) {
        yesterdayCount++;
      }
    }

    temp.push(data);
  });

  return { data: temp, todayCount, yesterdayCount };
};

// Get All Passed User Tests
export const getAllHeaderBanner = async () => {
  const q = collection(firestore, "site_header_banners_data");

  const querySnapshot = await getDocs(q);
  const temp = [];
  let todayCount = 0;
  let yesterdayCount = 0;

  querySnapshot.forEach((doc) => {
    const data = { id: doc.id, ...doc.data() };
    if (data.created_at && data.created_at.toDate) {
      const createdAtDate = data.created_at.toDate();
      const formattedDate = getFormattedDate(createdAtDate);

      if (formattedDate === todayDate) {
        todayCount++;
      } else if (formattedDate === yesterdayDate) {
        yesterdayCount++;
      }
    }

    temp.push(data);
  });

  return { data: temp };
};

export const getAllMobileHeaderBanner = async () => {
  
  const q = collection(firestore, "site_header_mobile_banners_data");

  const querySnapshot = await getDocs(q);
  const temp = [];
  let todayCount = 0;
  let yesterdayCount = 0;

  querySnapshot.forEach((doc) => {
    const data = { id: doc.id, ...doc.data() };
    if (data.created_at && data.created_at.toDate) {
      const createdAtDate = data.created_at.toDate();
      const formattedDate = getFormattedDate(createdAtDate);

      if (formattedDate === todayDate) {
        todayCount++;
      } else if (formattedDate === yesterdayDate) {
        yesterdayCount++;
      }
    }

    temp.push(data);
  });

  return { data: temp };
};

// Get All Passed User Tests
export const getAllFAQ_Questions = async () => {
  const q = collection(firestore, "site_faq_questions_answers_data");
  const querySnapshot = await getDocs(q);
  const temp = [];
  let todayCount = 0;
  let yesterdayCount = 0;

  querySnapshot.forEach((doc) => {
    const data = { id: doc.id, ...doc.data() };

    // Convert Firestore timestamps to plain strings
    if (data.created_at && data.created_at.toDate) {
      const createdAtDate = data.created_at.toDate();
      data.created_at = createdAtDate.toISOString(); // Convert to ISO string
      const updatedAtDate = data.updated_at.toDate();
      data.updated_at = updatedAtDate.toISOString(); // Convert to ISO string
      const formattedDate = getFormattedDate(createdAtDate);

      if (formattedDate === todayDate) {
        todayCount++;
      } else if (formattedDate === yesterdayDate) {
        yesterdayCount++;
      }
    }

    // Repeat the conversion for other timestamp fields (if needed)

    temp.push(data);
  });

  return { data: temp };
};

export const getSingleCourseForUser = async (id) => {
  const adminDocRef = doc(firestore, "courses", id);
  const adminDoc = await getDoc(adminDocRef);

  if (!adminDoc.exists) {
    return { data: null };
  }

  let courseData = adminDoc.data();
  const createdAtDate = courseData.created_at.toDate();
  courseData.created_at = createdAtDate.toISOString();
  const updatedAt = courseData.updated_at.toDate();
  courseData.updated_at = updatedAt.toISOString();

  // Convert any Firestore Timestamps to plain date strings or Unix timestamps
  return {
    data: {
      ...courseData,
      seoKeywords: courseData.seoKeywords || [],
      whoisthecoursefor: courseData.whoisthecoursefor || [],
      whatyouwillLearn: courseData.whatyouwillLearn || [],
      courseEnrollments: courseData.courseEnrollments || [],
    },
  };
};

export const getSingleCourseForUpdation = async (id) => {
  const adminDocRef = doc(firestore, "courses", id);
  const adminDoc = await getDoc(adminDocRef);

  if (!adminDoc.exists) {
    return { data: null };
  }

  const courseData = adminDoc.data();

  // Convert any Firestore Timestamps to plain date strings or Unix timestamps
  return {
    data: {
      ...courseData,
      seoKeywords: courseData.seoKeywords || [],
      whoisthecoursefor: courseData.whoisthecoursefor || [],
      whatyouwillLearn: courseData.whatyouwillLearn || [],
      courseEnrollments: courseData.courseEnrollments || [],
    },
  };
};

export const getSingleCourseBundle = async (id) => {
  const adminDocRef = doc(firestore, "courses_bundle", id);
  const adminDoc = await getDoc(adminDocRef);

  if (!adminDoc.exists()) {
    return { data: null };
  }

  const bundleData = adminDoc.data();

  // Function to convert Firestore timestamps or non-plain objects
  const toPlainValue = (value) => {
    if (value?.toMillis) {
      return value.toMillis();  // Firestore Timestamp to milliseconds
    }
    return value;
  };

  return {
    data: {
      ...bundleData,
      // Convert all timestamps to plain values
      created_at: toPlainValue(bundleData.created_at),
      updated_at: toPlainValue(bundleData.updated_at),
      seoKeywords: Array.isArray(bundleData.seoKeywords)
        ? bundleData.seoKeywords
        : [],
      selectedCourses: Array.isArray(bundleData.selectedCourses)
        ? bundleData.selectedCourses.map((course) => ({
            ...course,
            id: course.id || "",
            created_at: toPlainValue(course.created_at),
            updated_at: toPlainValue(course.updated_at),
          }))
        : [],
      courseBundlePrice: bundleData.courseBundlePrice || 0,
      courseBundleThumbnail: bundleData.courseBundleThumbnail || "",
      courseBundleTitle: bundleData.courseBundleTitle || "",
      courseBundleShortDescription:
        bundleData.courseBundleShortDescription || "",
      courseBundleLongDescription: bundleData.courseBundleLongDescription || "",
      whoisthecoursefor: Array.isArray(bundleData.whoisthecoursefor)
        ? bundleData.whoisthecoursefor
        : [],
      whatyouwillLearn: Array.isArray(bundleData.whatyouwillLearn)
        ? bundleData.whatyouwillLearn
        : [],
      courseCategory: bundleData.courseCategory || "",
      videoMedium: bundleData.videoMedium || "",
      coursePrice: bundleData.coursePrice || 0,
      courseThumbnail: bundleData.courseThumbnail || "",
      courseEnrollments: Array.isArray(bundleData.courseEnrollments)
        ? bundleData.courseEnrollments
        : [],
    },
  };
};

// Get Single Admin
export const getSingleAdmin = async (id) => {
  const adminDocRef = doc(firestore, "site_admins_details", id);
  const adminDoc = await getDoc(adminDocRef);
  const temp = adminDoc.data();
  return { data: temp };
};

// Get Single User
export const getSingleUser = async (id) => {
  const adminDocRef = doc(firestore, "users", id);
  const adminDoc = await getDoc(adminDocRef, { source: "cache" });

  if (!adminDoc.exists()) {
    console.error("User not found");
    return { data: null }; // Return null if user not found
  }

  const temp = adminDoc.data();
  return { data: temp };
};

// Get Single Payment Verification Request
export const getSinglePaymentVerificationRequest = async (id) => {
  const adminDocRef = doc(firestore, "payment_verification_requests", id);
  const adminDoc = await getDoc(adminDocRef);
  const temp = adminDoc.data();
  return { data: temp };
};

export const getSingleRegistrationData = async (id) => {
  const adminDocRef = doc(firestore, "course_registration_data", id);
  const adminDoc = await getDoc(adminDocRef);
  const temp = adminDoc.data();
  return { data: temp };
};

export const updateUserAdmissonStatus = async (userId, admissionStatus) => {
  const data = await updateDoc(doc(firestore, "users", userId), {
    admissionStatus: admissionStatus,
  });
};

// Update Template in firebase
export const updateTemplateInFirestore = async (id, updatedTemplate) => {
  try {
    const templateRef = doc(firestore, "email_templates", id); // Adjust collection name if needed
    await updateDoc(templateRef, { template: updatedTemplate });
    console.log("Template updated successfully!");
    return true;
  } catch (error) {
    console.error("Error updating template:", error);
    throw new Error("Failed to update template.");
  }
};

// Fetch Templates by templateTitle
export const getTemplateByTitle = async (templateTitle) => {
  try {
    const templatesRef = collection(firestore, "email_templates"); // Replace with your collection name
    const q = query(templatesRef, where("template_title", "==", templateTitle));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Assuming only one document matches, return the first result
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    } else {
      console.log("No document found with the given templateTitle.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching template by title:", error);
    throw error;
  }
};

export const getRegistrationPendingStatus = async (userId) => {
  try {
    const templatesRef = collection(firestore, "registration_form_data"); // Replace with your collection name
    const q = query(templatesRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Assuming only one document matches, return the first result
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    } else {
      console.log("No document found with the given templateTitle.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching template by title:", error);
    throw error;
  }
};

export const getUserRegistrationD = async (id) => {
  try {
    const userDocRef = doc(firestore, "user_information", id);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const data = userDoc.data();
      return data;
    } else {
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};

export const getSiteDetails = async (id) => {
  try {
    const userDocRef = doc(firestore, "site_details", id);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const data = userDoc.data();
      return data;
    } else {
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};

export const getUserPayProId = async (id) => {
  try {
    const userDocRef = doc(firestore, "paypro_payments_data", id);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const data = userDoc.data();
      return data;
    } else {
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};
