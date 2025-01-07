import Image from 'next/image'
import React from 'react'

const SupportingInstitutions = () => {

    const Institutions = [
        {
        source:"/phec.png",
        alt:"PHEC"
        },
        {
        source:"/PEC.jpg",
        alt:"PEC"
        },
        {
        source:"PU.png",
        alt:"PU"
        },
        {
        source:"/BBW.png",
        alt:"BBW"
        },
        {
        source:"/IEEE.png",
        alt:"IEEE"
        },

    ]




  return (
    
    <div className='min-h-[70vh] '>
        <div className=''>
            <h1 className='heading-text text-3xl bg-gray-50 lg:text-5xl text-center font-bold py-5 mb-28'>Supporting Institutions</h1>
        </div>

        <div className='flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-20'>
            {Institutions.map((data,idx)=>{
                return <Image
                src={data.source}
                key={idx}
                alt={data.alt}
                width={10}
                height={10}
                className='w-28 lg:w-36 lg:h-36 h-28'
                />
            })}
        </div>
    </div>
  )
}

export default SupportingInstitutions