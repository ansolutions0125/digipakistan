"use client";
import { firestore } from "@/Backend/Firebase";
import { getAllUsers } from "@/Backend/firebasefunctions";
import AdminProtectedRoutes from "@/ProtectedRoutes/AdminProtectedRoutes";
import { addDoc, collection, doc, limit, query } from "firebase/firestore";
import React from "react";

const page = () => {
  const handleSendEMails = async (e) => {
    e.preventDefault();

    const users = await getAllUsers();
    const data = await users.data;

    const setDataInQueueCollection = await addDoc(
      collection(firestore, "emails_queue_data"),
      {
        data,
      }
    );

    console.log(
      `%c Email Queue Data Has Been Created.`,
      "background: #222; color: #bada55; font-size: 16px; font-weight: bold;"
    );

    try {
      // Send a request to the backend to create a PaymentIntent
      const response = await fetch("http://localhost:5000/send-queued-emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const responseData = await response.json();

      console.log(responseData);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <AdminProtectedRoutes>
      <div>
        Testing
        <button
          onClick={handleSendEMails}
          className="mt-10 px-6 py-2 bg-primary rounded-md text-white"
        >
          Start Sending Email
        </button>
      </div>
    </AdminProtectedRoutes>
  );
};

export default page;
