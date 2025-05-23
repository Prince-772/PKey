import React from 'react'
import Section1 from './section1'
import Section2 from './section2'
import Section3 from './section3'

const Home = () => {
  return (
    <div className='mt-15 md:mt-16'>
      <Section1 />
      <Section2 />
      <Section3 />
    </div>
  )
}

export default Home