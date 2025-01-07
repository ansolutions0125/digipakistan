import React from 'react'

const FAQ = () => {

  const faqs = [
    {
      question:"What is DigiPakistan Initiative?",
      answer:"DigiPakistan is the First Online National Initiative launched with the aim to provide Skill Development Training to empower youth of the nation. In order to bring this vision, a comprehensive DigiPAKISTAN National Skills Development Initaitive has been designed which provides contemporary online training across all provinces of Pakistan & for overseas Pakistanis. The vision is to become leader in building a highly skilled human resource in diversified IT domains and contribute in nation building towards a knowledge-based economy."
    },
    {
      question:"Which courses are being offered at this program?",
      answer:"There are three Modules offered by us:",
      list:["Technical Programs (3 Months)","Non-Technical Programs (3 Months)","Associate Certification Programs (6 Months)"],
      answer2:"We'll continuously update maximum high tech programs at DigiPAKISTAN Initiative with time. As we are searching for best Trainers in Pakistan to teach you."
    },
    {
      question:"After successfully completing the training, will I be given certificate?",
      answer:"Yes, All trainees who successfully complete training will be awarded a training certificate."
    },
    {
      question:"What are the eligibility criteria required to apply?",
      answer:"Minimum Matric can apply to this program for Digital & Prosperous Pakistan."
    },
    {
      question:"How to apply?",
      answer:"You can apply through these easy steps:",
      list:["Go to Apply Now page. Register yourself as a new applicant."," (Candidate Login): After successfully sign up. Go to candidate login page. Enter your login details (Type your email & password which you have enter during signing up). You will be successfully logged into the Candidate Portal.","(Candidate Undertaking Terms): First of all Terms & Conditions will appear, read carefully and click agree to continue further."," (Application Form): Fill the application form carefully and accurately. Select your domain and submit the application form. You can enrol up to three programs at the same time.","Your application will be examined against the eligibility criteria. The admission status will be updated through the portal within 24 hours of submitting the application on the candidate portal.","On admission confirmation, registration challan will be generated with nominal registration fee for seat confirmation. Applicants have to follow further instructions given in the portal.","Applicant will now be enrolled in DigiPAKISTAN program."]
    },
    {
      question:"Can I apply in more than 1 courses?",
      answer:"Yes Students can apply in maximum 3 programs at the same time."
    },
    {
      question:"Do I have to pay for this training?",
      answer:"All you have to pay is one time nominal registration charges for seat confirmation of each course."
    },
    {
      question:"What is duration of course?",
      answer:"Duration of Fast Track Technical & Non-Technical Programs are 3 months. And Associate Certification Program is 6 Months."
    },
    {
      question:"Will there be any test?",
      answer:"No, there will not be any entry test due to Covid19."
    },
    {
      question:"Can I change the course after registration or shortlisting?",
      answer:"No. You cannot change course after registration or shortlisting. Please choose your course carefully while registering online."
    },
    {
      question:"Are there limited Seats to Join DigiPAKISTAN?",
      answer:"Yes there will be limited seats in this program which will be on first come first serve bases. In the First Batch, DigiPAKISTAN have only 50,000 seats for Students across the country & Overseas Pakistanis."
    },
    {
      question:"What is the minimum educational qualification required for this program?",
      answer:"There is minimum Matric educational requirement to take the DigiPAKISTAN training and we encourage everyone who can read, write and understand English or know a little bit use of Computer to take the training to build their future as a freelancer. We need your time & passion for making you Expert in the Security Field."
    },
    {
      question:"Will I be offered any stipend?",
      answer:"No stipend will be given."
    },
    {
      question:"I am currently doing a job. Can I still apply for the training?",
      answer:"Yes, because we are training youth online."
    },
    {
      question:"Can Overseas Pakistanis can also apply?",
      answer:"Yes, Overseas can also apply for this National Program & can Secure there Seat."
    },
    {
      question:"In how many programs students can enroll at the same time?",
      answer:"A student can enrol up to three programs at the same time."
    },
    {
      question:"What is the completion criteria to get Certificate from DigiPAKISTAN?",
      answer:"According to course completion criteria, trainees will need to secure 70% score to become eligible for Certificate. Each component (Video, Quiz and Hands-on Exercise) carries a certain percentage of the total score of 100 as given below:",
      list:["Watching Topic Videos through LMS = 50%","Quizzes = 25%","Assignments = 15%","Hands on Excercise = 10%",],
      answer2:"Trainees will get Certificates after successful completion of course."
    },
    {
      question:"What are the technical requirements of this program?",
      answer:"To access the DigiPAKISTAN program, you need to have a good stable internet connection at home along with a desktop, laptop, or an android phone."
    },
    {
      question:"Where do I get this training?",
      answer:"This is an online training program, Once you get enrolled you will be able to access DigiPAKISTAN online learning management system."
    },
    {
      question:"How do I study?",
      answer:"All the videos and learning material for each module will be available on Online Learning Platform. You can self-pace the training or you can follow the announced time table which will be available on Portal."
    },
    {
      question:"Will this initiative offer jobs or is it just to train them?",
      answer:"It will not offer jobs to trainees, rather, it will offer skill-based trainings, which will enable them to get projects from freelance markets or will be enough to get jobs internationally."
    },
    {
      question:"Where to contact in case of queries?",
      answer:"In case of queries you can dial 042-35482528 / 042-35482529 and can email at support@digipakistan.org"
    }
  ]



  return (
   <div className='lg:p-10 p-3 '>

    {
      faqs.map((data,idx)=>{
      return  <div key={idx} className='flex flex-col gap-1'>
            <div className='bg-[#dedcdc] flex gap-2  lg:gap-3 text-xl lg:text-2xl font-semibold lg:p-5 p-2  rounded border-l-4 border-primary'  >
              <h1 className='text-[#02a39b]' >Q.  </h1>
              <h1><span className='text-slate-700' >{data.question} </span></h1>
            </div>
            <div className='bg-[#eeeeee] rounded p-2 text-sm lg:p-5 border-l-4 mb-8 border-gray-400 flex flex-col lg:gap-3'>
              <div className='flex gap-2  lg:gap-3 justify-start'>
                <h1 className='text-xl lg:text-2xl font-bold text-gray-600'>A. </h1>
                <p className='text-sm lg:text-base mt-1 text-justify'>{data.answer}</p>
              </div>
              {data.list && <ul className='list-disc px-10 leading-5 text-sm'>
              { data.list.map((data,idx)=>{
                 return <li key={idx}>
                    {data}
                  </li>
              })}
              </ul>}
             {data.answer2 &&  <p className='px-2'>{data.answer2} </p>}
            </div>
        </div>
      })
    }

   </div>
  )
}

export default FAQ