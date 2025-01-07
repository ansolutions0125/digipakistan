import React from 'react'
import TeamCard from './TeamCard'

const OurTeam = () => {
  return (
   <div className='grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-10 max-w-6xl mx-auto'>
     <TeamCard/>
     <TeamCard/>
     <TeamCard/>
     <TeamCard/>
     <TeamCard/>
     <TeamCard/>
     <TeamCard/>
   </div>
  )
}

export default OurTeam