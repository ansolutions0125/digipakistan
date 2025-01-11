import React from "react";

export const AdmissionProcess = () => {
  return (
    <div className="w-full">
      <div className="max-w-6xl mx-auto">
        <img src="/admission-process.jpg" alt="Admission Process" />
      </div>

      <div className="h-[400]">
        <div className="h-[200px] relative bg-primary ">
          <div className="absolute top-44 inset-0 flex items-center justify-center p-5 ">
            <iframe
              className="shadow-xl"
              width="500"
              height="250"
              src="https://www.youtube.com/embed/UnSzGC76OHQ"
              title="What is Freelancing? What is online work? How to start freelancing or online work?"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>
       
        </div>
      </div>
      <hr />
      <div className="lg:p-10 p-3">
          <h1 className="py-3 text-center font-semibold text-2xl">To Participate in DigiPakistan National Skills Development Initiative, students have to adopt the following process.</h1>
          <h1 className="font-bold text-center">Note: <span className="font-normal">Minimum of 10 years education is a prerequisite to apply for any DigiPAKISTAN training program. Computer know-how and basic proficiency in English will be desirable.</span></h1>
       
          <div className="flex flex-col md:flex-row flex-wrap gap-10 items-center justify-center mt-10" >
              <div className="bg-primary text-white rounded-3xl w-auto h-auto p-4 lg:p-0 lg:h-64 lg:w-96 flex flex-col items-center justify-center shadow-xl drop-shadow-2xl shadow-green-900">
                <h1 className="font-bold text-2xl">Step 1:</h1>
                <p className="text-center p-4">Go to Apply Now page. Register yourself as a new applicant.</p>
              </div>
              <div className="bg-primary text-white rounded-3xl w-auto h-auto p-4 lg:p-0 lg:h-64 lg:w-96 flex flex-col items-center justify-center shadow-xl drop-shadow-2xl shadow-green-900">
                <h1 className="font-bold text-2xl">Step 2:</h1>
                <p className="text-center p-4">(Candidate Login): After successfully sign up. Go to candidate login page. Enter your login details (Type your email & password which you have enter during signing up). You will be successfully logged into the Candidate Portal.</p>
              </div>
              <div className="bg-primary text-white rounded-3xl w-auto h-auto p-4 lg:p-0 lg:h-64 lg:w-96 flex flex-col items-center justify-center shadow-xl drop-shadow-2xl shadow-green-900">
                <h1 className="font-bold text-2xl">Step 3:</h1>
                <p className="text-center p-4">(Candidate Undertaking Terms): First of all Terms & Conditions will appear, read carefully and click agree to continue further.</p>
              </div>
              <div className="bg-primary text-white rounded-3xl w-auto h-auto p-4 lg:p-0 lg:h-64 lg:w-96 flex flex-col items-center justify-center shadow-xl drop-shadow-2xl shadow-green-900">
                <h1 className="font-bold text-2xl">Step 4:</h1>
                <p className="text-center p-4">(Application Form): Fill the application form carefully and accurately. Select your domain and submit the application form. You can enrol up to three programs at the same time.</p>
              </div>
              <div className="bg-primary text-white rounded-3xl w-auto h-auto p-4 lg:p-0 lg:h-64 lg:w-96 flex flex-col items-center justify-center shadow-xl drop-shadow-2xl shadow-green-900">
                <h1 className="font-bold text-2xl">Step 5:</h1>
                <p className="text-center p-4">Your application will be examined against the eligibility criteria. The admission status will be updated through the portal within 24 hours of submitting the application on the candidate portal.</p>
              </div>
              <div className="bg-primary text-white rounded-3xl w-auto h-auto p-4 lg:p-0 lg:h-64 lg:w-96 flex flex-col items-center justify-center shadow-xl drop-shadow-2xl shadow-green-900">
                <h1 className="font-bold text-2xl">Step 6:</h1>
                <p className="text-center p-4">On admission confirmation, registration challan will be generated with nominal registration fee for seat confirmation. Applicants have to follow further instructions given in the portal.</p>
              </div>
              <div className="bg-primary text-white rounded-3xl w-auto h-auto p-4 lg:p-0 lg:h-64 lg:w-96 flex flex-col items-center justify-center shadow-xl drop-shadow-2xl shadow-green-900">
                <h1 className="font-bold text-2xl">Step 7:</h1>
                <p className="text-center p-4"> Applicant will now be enrolled in DigiPAKISTAN program.</p>
              </div>
            </div>  
      </div>
<hr />
      <div className="max-w-6xl lg:mx-auto p-5">
      <h1 className="text-2xl font-bold">Limited Seats, <span className="text-primary">Apply now</span></h1>
      <p className="mt-3">
      There'll be limited seats in this program which will be on first come first serve basis. In the First Batch, DigiPAKISTAN have only 50,000 seats for students across all provinces of Pakistan & for Overseas Pakistanis. Student with late registration challan submission i.e. after 1000 seats of his selected program will be accomodate in next Batch. On LMS all modules, videos and content you're enrolled in will be available. You can access it from anywhere, like from your home or office.
      </p>
      </div>

      <hr />
      <div className="max-w-6xl lg:mx-auto p-5">
      <h1 className="text-2xl font-bold">Free Training Programs</h1>
      <p className="mt-3">
      This is a FREE Training Program to empower youth in IT Skills. There will be only nominal registration charges for seat confirmation in each program.
      </p>
      </div>


      <hr />
      <div className="max-w-6xl lg:mx-auto p-5">
      <h1 className="text-2xl font-bold">Free Training Programs</h1>
      <p className="mt-3">
   According to course completion criteria, trainees will need to secure 70% score to become eligible for a Certificate.
In case of queries you can dial <a className="text-primary font-bold" href="tel:042-35482528">042-35482528</a> | <a className="text-primary font-bold" href="tel:042-35482529">042-35482529s</a> and can email at <a className="text-primary font-bold" href="mailto:support@digipakistan.org">support@digipakistan.org</a>. For technical questions related to coursework, you may contact us via the Contact Form.
      </p>
      </div>
    </div>
  );
};
