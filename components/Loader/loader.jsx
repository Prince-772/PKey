import { LoaderCircle } from 'lucide-react'
import React from 'react'
import { Hatch } from 'ldrs/react'
import 'ldrs/react/Hatch.css'

// const Loader = () => {
//   return (
//     <div className="fixed inset-0 bg-black/30 backdrop-blur-[3px] flex items-center justify-center z-50">
//       <LoaderCircle className='animate-spin w-8 h-8 md:h-12 md:w-12 text-red-600  absolute' />
//       <Hatch
//         size="28"
//         stroke="4"
//         speed="3.5"
//         color="black"
//       />
//     </div>
//   )
// }
const Loader = () => {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-[3px] flex items-center justify-center z-50">
      {/* <LoaderCircle className='animate-spin w-8 h-8 md:h-12 md:w-12 text-red-600  absolute' /> */}
      <Hatch
        size="32"
        stroke="4"
        speed="3.5"
        color="green"
      />
    </div>
  )
}

export default Loader



// Default values shown
