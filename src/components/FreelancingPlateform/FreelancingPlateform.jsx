import React from 'react'

const FreelancingPlateform = () => {
  return (
    <div className='flex flex-col'>
        <div>
            <img className='w-full' src="/freelancing-platforms.jpg" alt="Freelancing Plateforms" />
        </div>
        <div className='flex flex-col lg:flex-row p-10 gap-10 text-center'>
            <div className='flex flex-col gap-3 items-center justify-center'>
                <h1 className='font-bold text-3xl'>
                    Become an Instructor
                </h1>
                <p>
                You can apply as a trainer for our available programs or you have the opportunity to launch a new course & can earn profitable income.
                </p>
               <div className='relative'>
               <button className='bg-primary hover:bg-second duration-200 text-white font-bold p-3'>Start Teaching</button>
                    <p className='absolute text-sm w-full top-[-10px] bg-red-500 text-white font-bold  rounded-full left-28'>Coming Soon!</p>
               </div>
            </div>
            <div className='flex flex-col gap-3 items-center justify-center'>
                <h1 className='font-bold text-3xl'>
                Become a Marketing Partner
                </h1>
                <p>
                Promote DigiPakistan Programs on different social media platforms & earn profitable income and exciting incentives on achieving different targets.
                </p>
                <div className='relative'>
               <button className='bg-primary hover:bg-second duration-200 font-bold text-white p-3'>Start Earning</button>
                    <p className='absolute text-sm w-full top-[-10px] bg-red-500 text-white font-bold  rounded-full left-28'>Coming Soon!</p>
               </div>
            </div>
        </div>
    </div>
  )
}

export default FreelancingPlateform