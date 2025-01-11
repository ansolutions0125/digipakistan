"use client";
import React, { useState } from "react";
import {
  BsFacebook,
  BsInstagram,
  BsLinkedin,
  BsTwitter,
  BsWatch,
  BsYoutube,
} from "react-icons/bs";
import { FaFacebook } from "react-icons/fa";
import { MdEmail, MdMobileFriendly } from "react-icons/md";
import { SlCalender } from "react-icons/sl";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNo: "",
    subject: "",
    message: "",
  });

  const [error, setError] = useState({});
  const [focusState, setFocusState] = useState({});

  const handleFocus = (field) => {
    setFocusState({ ...focusState, [field]: true });
  };

  const handleBlur = (field) => {
    setFocusState({ ...focusState, [field]: false });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError({ ...error, [name]: "" });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const validateErrors = {};

    if (!formData.firstName) validateErrors.firstName = "First Name is required";
    if (!formData.lastName) validateErrors.lastName = "Last Name is required";
    if (!formData.email) {
      validateErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      validateErrors.email = "Invalid email format";
    }
    if (!formData.subject) validateErrors.subject = "Subject is required";
    if (!formData.message) validateErrors.message = "Message is required";

    setError(validateErrors);

    if (Object.keys(validateErrors).length === 0) {
      alert("Form submitted successfully!");
    }
  };

  return (
    // <div className="apply_now_bg min-h-screen">
    //   <div className="flex items-center justify-center lg:p-5">
      
    //   </div>
    // </div>

    <div className=" min-h-[80vh] rounded-xl bg-white flex flex-col lg:flex-row shadow-2xl">
    {/* Contact Info */}
    <div className="flex items-center text-center lg:w-[40%] bg-primary">
      <div className="px-10 w-full py-10 lg:w-[80%] lg:mx-auto flex flex-col gap-3 lg:gap-12">
        <h1 className="lg:text-5xl text-4xl text-left font-bold text-white">
          Get in Touch
        </h1>
        <p className="text-xl text-left text-white">Fill in the form to the right to get in touch with someone on our team, and we will reach out shortly.</p>
        <div className="flex gap-3 flex-col">
        <div className="flex items-center gap-3 text-sm text-white">
          <MdEmail className="lg:text-xl"/>
          <p className="lg:text-xl">Support@digiPakistan.org</p>
        </div>
        <div className="flex items-center gap-3 text-sm text-white">
          <MdMobileFriendly className="lg:text-xl" />
          <p className="lg:text-xl">042-35482528</p>
        </div>
        <div className="flex items-center gap-3 text-sm text-white">
          <BsWatch className="lg:text-xl"/>
          <p className="lg:text-xl">
            <b>Office Timing:</b> 10:00AM to 5:00PM
          </p>  
        </div>
        <div className="flex items-center gap-3 text-sm text-white">
          <SlCalender className="lg:text-xl"/>
          <p className="lg:text-xl">
            <b>Office Days:</b> Monday to Saturday
          </p>
        </div>
        </div>
        <div className="text-white flex gap-5 py-5 text-2xl lg:text-3xl">
          <FaFacebook className="hover:text-yellow-600 cursor-pointer duration-300" />
          <BsInstagram className="hover:text-yellow-600 cursor-pointer duration-300" />
          <BsTwitter className="hover:text-yellow-600 cursor-pointer duration-300" />
          <BsLinkedin className="hover:text-yellow-600 cursor-pointer duration-300" />
          <BsYoutube className="hover:text-yellow-600 cursor-pointer duration-300" />
        </div>
      </div>
    </div>

    {/* Contact Form */}
  <div className="lg:w-[40%] lg:mx-auto items-center justify-center flex">
  <div className="py-20 text-left p-5">
<h1 className="font-bold text-2xl lg:text-5xl">Got a Question?</h1>
<p className="text-base">
Is there something you can’t find an answer to or do you have something else you need help with? Let us know by filling out the form below!
</p>
<form className="py-10 " onSubmit={handleFormSubmit}>
<div className="flex flex-col gap-3 lg:flex-row lg:gap-5">
{/* First Name */}
<div className="relative w-full mb-4">
  <input
    type="text"
    name="firstName"
    value={formData.firstName}
    onChange={handleChange}
    onFocus={() => handleFocus("firstName")}
    onBlur={() => handleBlur("firstName")}
    className={`w-full border-0 border-b-2 px-2 py-2 text-sm focus:outline-none ${
      error.firstName ? "border-red-700" : "border-gray-300"
    }`}
    placeholder=""
  />
  <label
    className={`absolute left-1 text-gray-400 text-sm transition-all ${
      focusState.firstName || formData.firstName
        ? "top-[-14px] text-xs text-primary"
        : "top-2"
    }`}
  >
    First Name
  </label>
  {error.firstName && (
    <p className="text-right text-red-700">{error.firstName}</p>
  )}
</div>
{/* Last Name */}
<div className="relative w-full">
  <input
    type="text"
    name="lastName"
    value={formData.lastName}
    onChange={handleChange}
    onFocus={() => handleFocus("lastName")}
    onBlur={() => handleBlur("lastName")}
    className={`w-full border-0 border-b-2 px-2 py-2 text-sm focus:outline-none ${
      error.lastName ? "border-red-700" : "border-gray-300"
    }`}
    placeholder=""
  />
  <label
    className={`absolute left-1 text-gray-400 text-sm transition-all ${
      focusState.lastName || formData.lastName
        ? "top-[-14px] text-xs text-primary"
        : "top-2"
    }`}
  >
    Last Name
  </label>
  {error.lastName && (
    <p className="text-right text-red-700">{error.lastName}</p>
  )}
</div>
</div>

<div className="flex flex-col gap-3 lg:flex-row lg:gap-5">
{/* Email */}
<div className="relative w-full">
  <input
    type="email"
    name="email"
    value={formData.email}
    onChange={handleChange}
    onFocus={() => handleFocus("email")}
    onBlur={() => handleBlur("email")}
    className={`w-full border-0 border-b-2 px-2 py-2 text-sm focus:outline-none ${
      error.email ? "border-red-700" : "border-gray-300"
    }`}
    placeholder=""
  />
  <label
    className={`absolute left-1 text-gray-400 text-sm transition-all ${
      focusState.email || formData.email
        ? "top-[-14px] text-xs text-primary"
        : "top-2"
    }`}
  >
    Email
  </label>
  {error.email && (
    <p className="text-right text-red-700">{error.email}</p>
  )}
</div>
{/* Contact Number */}
<div className="relative w-full mb-4">
  <input
    type="number"
    name="contactNo"
    value={formData.contactNo}
    onChange={handleChange}
    onFocus={() => handleFocus("contactNo")}
    onBlur={() => handleBlur("contactNo")}
    className="w-full border-0 border-b-2 px-2 py-2 text-sm focus:outline-none border-gray-300"
    placeholder=""
  />
  <label
    className={`absolute left-1 text-gray-400 text-sm transition-all ${
      focusState.contactNo || formData.contactNo
        ? "top-[-14px] text-xs text-primary"
        : "top-2"
    }`}
  >
    Contact Number
  </label>
</div>
</div>

{/* Subject */}
<div className="relative mb-4">
<input
  type="text"
  name="subject"
  value={formData.subject}
  onChange={handleChange}
  onFocus={() => handleFocus("subject")}
  onBlur={() => handleBlur("subject")}
  className={`w-full border-0 border-b-2 px-2 py-2 text-sm focus:outline-none ${
    error.subject ? "border-red-700" : "border-gray-300"
  }`}
  placeholder=""
/>
<label
  className={`absolute left-1 text-gray-400 text-sm transition-all ${
    focusState.subject || formData.subject
      ? "top-[-14px] text-xs text-primary"
      : "top-2"
  }`}
>
  Subject
</label>
{error.subject && (
  <p className="text-right text-red-700">{error.subject}</p>
)}
</div>

{/* Message */}
<div className="relative mb-6">
<textarea
  name="message"
  rows={4}
  value={formData.message}
  onChange={handleChange}
  onFocus={() => handleFocus("message")}
  onBlur={() => handleBlur("message")}
  className={`w-full border-0 border-b-2 px-2 text-sm focus:outline-none ${
    error.message ? "border-red-700" : "border-gray-300"
  }`}
  placeholder=""
></textarea>
<label
  className={`absolute left-1 text-gray-400 text-sm transition-all ${
    focusState.message || formData.message
      ? "top-[-14px] text-xs text-primary"
      : "top-10"
  }`}
>
  Message
</label>
{error.message && (
  <p className="text-right text-red-700">{error.message}</p>
)}
</div>

<button
type="submit"
className="bg-primary p-3 text-white hover:bg-second rounded mt-5"
>
Send
</button>
</form>
</div>
  </div>

  </div>
  );
};

export default ContactUs;
