"use client";
import React, { useState } from "react";

const TeamCard = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div className="flex-col flex items-center mb-3 justify-center text-center border bg-slate-100 p-2">
      <div>
        <img
          className="rounded-full p-5"
          src="/chairmain.jpg"
          alt="team-picture"
        />
      </div>
      <div>
        <h1 className="text-xl font-bold text-primary">Usman Khan</h1>
        <h1 className="text-sm">
          <span className="font-bold text-base text-justify">Course:</span> AWS Developer
          Associate, AWS SysOps Administrator
        </h1>
      </div>
      <hr className="h-px w-full bg-gray-400 mt-2 border-0" />
      <p className="mt-2">
        17+ Years of Experience in designing, deployment & implementation of
        Cloud & Noncloud technologies like AWS, GCP, Alibaba, Azure, VMware,
        Cisco, CWNP, SonicWALL, Dell infrastructure, Microsoft technologies like
        AD, Exchange.
      </p>

      <button
        onClick={openModal}
        className="bg-primary p-3 rounded-xl hover:bg-second duration-300 mt-5 text-white text-sm"
      >
        View Portfolio
      </button>

      {/* Modal Container */}
      <div
        className={`fixed inset-0 flex justify-center items-center text-left bg-black bg-opacity-50 z-50 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        } transition-opacity duration-300`}
        onClick={closeModal} // Close modal when clicking on overlay
      >
        {/* Modal Content */}
        <div
          className={`bg-white p-6 rounded shadow-xl max-h-96 overflow-y-scroll max-w-md w-full transform transition-transform duration-300 ${
            isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-10"
          }`}
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
        >
          <h2 className="text-lg font-bold mb-4 py-4 sticky bg-white -top-6 ">
            Umar Daraz
          </h2>
          <hr />
          <p className="mb-4 text-justify">
            I am Mazhar Javed Awan, Assistant Professor of the Software
            Engineering Department at the University of Management & Technology
            Lahore. I have 18 years of experience in various institutes. Besides
            these, I also taught data science course training in different
            academic and corporate sectors. I have been connecting with the Data
            Science field regarding research and hands-on work for the last six
            years. Now I am more interested in serving in the IT industry as a
            consultant/Chief Data Scientist. My topic of P.h.D is related to
            medical Image detection and segmentation of Knee bones from the
            University of Technology (UTM) in Malaysia. I published more than 20
            research papers in high-impact factor journals in the field of Data
            Sciences, Big Data Analytics, Deep learning in medical images,
            Natural language processing, and Machine learning. My H-index in
            google scholar is 15. I have been serving as a peer reviewer for
            international journals and conferences. I have been conducted many
            sessions and workshops (Hands-on sessions) as an Invited Speaker and
            trainer in the well-renowned institutes of Pakistan and Industry. I
            organized three national Data Hackathons at UMT Lahore. I am also a
            judge of Softtec (Fast University) Data Hackathon. I have invited
            the significant achievement as an International Keynote Speaker at
            the 4th International Conference on Learning Innovation (ICLI) held
            on 15 September 2020. It was arranged by Universitas Negeri Malang
            (UM) Indonesia. I am also a member of the curriculum of NAVTTC and
            TEVTA Pakistan. I am the focal person of Data Science at UMT and
            mentoring to promote data science and big data in Pakistan in front
            of the IT Industry, the Business Community, students, and faculties.
          </p>
          <hr />
          <button
            onClick={closeModal}
            className="bg-primary mt-3 w-28 p-3 rounded-xl hover:bg-second duration-300 text-white text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamCard;
