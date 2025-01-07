"use client"
import { firestore } from "@/Backend/Firebase";
import { collection, getDocs } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";

export const Course_data = createContext();


function Context({ children }) {
    const [course, setCourse] = useState({});

    
  
    return (
      <Course_data.Provider value={{ course, setCourse }}>
        {children}
      </Course_data.Provider>
    );
  }


const useCourseContext = () => useContext(Course_data);

export {useCourseContext};
export default Context;