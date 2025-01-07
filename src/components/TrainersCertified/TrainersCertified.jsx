import Image from 'next/image'
import React from 'react'

const TrainersCertified = () => {
  const brands =[
    {
      source:"/microsoft.png",
      alt:"brand"
    },
    {
      source:"/google.png",
      alt:"brand"
    },
    {
      source:"/aws-ptr-3.png",
      alt:"brand"
    },
    {
      source:"/oracle.png",
      alt:"brand"
    },
    {
      source:"/eccouncil.png",
      alt:"brand"
    },
  ]

  return (
   <div>
     <h1 className="heading-text text-center bg-gray-50 text-4xl lg:text-5xl p-6 ">
            Our Trainers Certified From
          </h1>
      
      
    <div className='flex flex-wrap justify-center items-center gap-5 lg:gap-10' >
    {brands.map((data,idx)=>{
      return  <Image
      key={idx}
         src={data.source}
         alt={data.alt}
         width={10}
         height={10}
         className='w-20 lg:w-52'
         />

    })}

        </div>

        <div className='p-3 text-justify'>
            <p>
            <b>DigiPAKISTAN National Skills Development Program</b> is an <b>IT initiative</b> launched with the vision of <b>Pakistan’s digital ambition</b> and to work towards a digitally progressive and inclusive Pakistan. It will unleash the potential of the youth. Pakistan has the second biggest population of youth and it can be turned into strength through digital work. <b>Women</b> can also contribute to the sector as well, aimed at <b>helping young career seekers</b> understand the basic information technology functioning of the sector and the job role they aspire to take on. Today's highly <b>competitive and demanding employment market is looking for only talented and skilled manpower with enough command on the information technology industry essentials.</b>
            </p>

            <p className='mt-3'>
            There are so many <b>Information Technology Programs available</b> at <b>DigiPAKISTAN</b> and all you have to do is to <b>enroll yourself in your desired course.</b>
            </p>
        </div>


   </div>
  )
}

export default TrainersCertified