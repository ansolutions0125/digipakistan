"use client";
import {
  getAllTemplate_for_editing,
  getTemplateByTitle,
  updateTemplateInFirestore,
} from "@/Backend/firebasefunctions";
import DashboardNavbar from "@/components/AdminDashboard/DashboardNavbar";
import DashboardPageInfo from "@/components/AdminDashboard/DashboardPageInfo";
import Sidebar from "@/components/AdminDashboard/Sidebar";
import React, { useEffect, useState, useRef } from "react";
import { FaUser } from "react-icons/fa";
import { html as beautifyHtml } from "js-beautify"; // Import js-beautify for formatting

const page = () => {
  const [htmlContent, setHtmlContent] = useState("<p>Edit this HTML</p>");
  const [lineCount, setLineCount] = useState(1); // State to track line count
  const textareaRef = useRef(null); // Ref for the textarea
  const lineNumberRef = useRef(null); // Ref for the line number container

  // Function to handle text area input
  const handleHtmlChange = (e) => {
    const content = e.target.value;
    setHtmlContent(content);

    // Dynamically update line count based on the number of lines in the content
    const lines = content.split("\n").length;
    setLineCount(lines);
  };

  // Synchronize scrolling of the textarea and the line numbers
  const handleScroll = () => {
    if (lineNumberRef.current && textareaRef.current) {
      lineNumberRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  // Generate line numbers dynamically based on the line count
  const generateLineNumbers = () => {
    return Array.from({ length: lineCount }, (_, index) => index + 1).join(
      "\n"
    );
  };

  const [toast, setToast] = useState({
    message: "",
    type: "",
    visible: false,
    duration: 5000,
  });

  const showToast = (message, type = "info", duration = 20000) => {
    setToast({ message, type, visible: true, duration });
  };

  const handleCloseToast = () => {
    setToast({ ...toast, visible: false });
  };
  const [template, setTemplate] = useState([]);

  const [selectedOptionCourse, setSelectedOptionCourse] = useState({
    templateName: "Select a template",
    template: "",
    id: "",
  });

  const [isOpenCourse, setIsOpenCourse] = useState(false);

  // When an email template is selected, update the state and set the content to the editor
  const handleEmailTemplate = (option) => {
    setSelectedOptionCourse({
      templateName: option.template_title,
      template: option.template,
      id: option.id,
    });

    // Format the HTML content before setting it in the editor
    const formattedHtml = beautifyHtml(option.template, {
      indent_size: 2,
      wrap_line_length: 80,
    });

    setHtmlContent(formattedHtml); // Set formatted template content to the editor

    // Update line count after formatting
    const lines = formattedHtml.split("\n").length;
    setLineCount(lines);

    setIsOpenCourse(false);
  };

  useEffect(() => {
    const fetchEmailTemplate = async () => {
      const data = await getAllTemplate_for_editing();
      setTemplate(data.data);
    };
    fetchEmailTemplate();
  }, []);

  const saveTemplate = async (templateId, htmlContent) => {
    console.log("templateId " + templateId, htmlContent);

    try {
      await updateTemplateInFirestore(templateId, htmlContent);
      alert("Template saved successfully!");
    } catch (error) {
      console.error("Error saving template:", error);
      alert("Failed to save the template.");
    }
  };

  return (
    <div className="flex w-full">
      <Sidebar />
      <div className="w-full">
        <DashboardNavbar />
        <div className="w-full py-10">
          <div className="max-w-5xl mx-auto">
            <DashboardPageInfo
              DashboardPageInfo={"Template Editor"}
              icons={<FaUser size={20} />}
            />
            <div className="flex flex-col gap-2 mt-10">
              <label
                htmlFor="email_to"
                className="text-[13px] font-semibold text-gray-600"
              >
                Select a template
              </label>
              <div className="relative w-[300px]">
                {/* Selected Option */}
                <div
                  id={"email_to"}
                  className="bg-gray-100 border border-gray-300 rounded-md py-2 px-4 flex justify-between items-center cursor-pointer"
                  onClick={() => setIsOpenCourse(!isOpenCourse)}
                >
                  <span className="text-[13px] truncate">
                    {selectedOptionCourse.templateName}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 transform ${
                      isOpenCourse ? "rotate-180" : ""
                    } transition-transform duration-200`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 9.707a1 1 0 001.414 0L10 6.414l3.293 3.293a1 1 0 001.414-1.414l-4-4a1 1 0 00-1.414 0l-4 4a1 1 0 000 1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>

                {/* Dropdown Options */}
                {isOpenCourse && (
                  <ul className="absolute z-10 max-h-[150px] overflow-y-scroll bg-white border border-gray-300 rounded-md mt-1 w-full shadow-lg">
                    {template.map((option, idx) => (
                      <li
                        key={option.template_title}
                        className="py-2 px-4 text-[13px] hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleEmailTemplate(option)}
                      >
                        {option.template_title}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div className="w-full flex ">
              {/* HTML Editor with Line Numbers */}
              <div className="flex-1 mt-10">
                <h2 className="text-lg font-semibold mb-2">
                  Edit {selectedOptionCourse.templateName}
                </h2>
                <div className="relative rounded">
                  <div
                    ref={lineNumberRef}
                    className="absolute top-0 rounded-tl-lg rounded-bl-lg left-0 h-full w-14 bg-gray-500 text-gray-100 border-r overflow-hidden text-right p-2"
                    style={{
                      fontFamily: "monospace",
                      fontSize: "14px",
                      lineHeight: "1.5",
                      overflowY: "scroll", // Allow scrolling for line numbers
                    }}
                  >
                    {generateLineNumbers()}
                  </div>
                  <textarea
                    ref={textareaRef}
                    value={htmlContent}
                    onChange={handleHtmlChange}
                    onScroll={handleScroll} // Sync scrolling
                    className="w-full bg-gray-300 rounded-lg h-[30rem] pl-16 p-2 border-none resize-none focus:outline-none"
                    style={{
                      fontFamily: "monospace",
                      fontSize: "14px",
                      lineHeight: "1.5",
                    }}
                    placeholder="<p>Your HTML here</p>"
                  />
                </div>
                <button
                  onClick={() =>
                    saveTemplate(selectedOptionCourse.id, htmlContent)
                  }
                  className="btn-primary text-white py-1 px-4 bg-primary mt-5"
                >
                  Save Chanages
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
