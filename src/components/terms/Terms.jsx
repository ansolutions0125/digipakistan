import Link from 'next/link'
import React from 'react'

const Terms = () => {
  return (
    <div className=" min-h-screen py-5 lg:px-6 ">
   
      <div className="lg:p-8 p-4 text-justify items-center flex flex-col justify-center">
      <div>
      <h1 className="text-3xl text-center font-bold text-gray-800 mb-6">
          Terms & Conditions
        </h1>
        <p className=" mb-4">
        <b> {"1)"}</b> If any <b>forgery/discrepancy </b> with respect to any information if found otherwise at any stage will result in <b>cancellation of the application & the fee will be non-refundable.</b>
        </p>
        <p className=" mb-4">
        <b> {"2)"}</b> The <b>DigiPAKISTAN program</b> is not offering any employment and also not associated with any future employment opportunity. The program aims only to provide training to the students. 
        </p>

        <p className=" mb-4">
        <b> {"3)"}</b> Students at <b>DigiPAKISTAN </b> have to follow all the rules and the regulations otherwise the Organizaiton have the right to take actions against particular candidates.
        </p>

        <p className=" mb-4">
        <b> {"4)"}</b> According to course completion criteria, trainers will need to  <b>secure 70% score to become eligible for Certificate </b> Trainees will get <b>Certificates after Completion of Course.</b>
        </p>

         <p className=" mb-4">
        <b> {"5)"} </b> The candidate training duration can increase depend on the content delivered to the students. However the management reserves the right to terminate the training of a candidate at any stage without any reason.
        </p>

        <p className=" mb-4">
        <b> {"6)"} </b>The seleced candidate provided all information should be correct to the best of knowledge of the applicant and if found otherwise at any stage shall result in the <b>cancellation of the application.</b>
        </p>
        <p className=" mb-4">
        <b> {"7)"} </b> <b>Selection / Rejection </b> of a candidate is a purify decision by organization.
        </p>
        <p className=" mb-4">
        <b> {"8)"} </b> Registration charges will be <b>non refundable</b>. Students will have to pay only minor registration charges before the due date for confirmed seat into the program.
        </p>

       <p> <b> {"9)"} </b> Any decision by the management regarding training, posting, termination is <b>not challengable in any court / judiciary.</b>
        </p>

        <p> <b> {"10)"} </b> No stipent will be paid to the candidate
        </p>

        <p> <b> {"11)"} </b> You have to clear <b>Quizes, Assignments & Exams</b> for each course
        </p>
      </div>

        <Link href={"registration/personalinfo"} className='bg-primary p-2 mt-5 hover:bg-second text-white'>
            Agree with our terms & conditions
        </Link >
      </div>


      {/* Image Section */}
    {/* </div> */}
  </div>
  )
}

export default Terms