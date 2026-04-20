import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Logo = () => {
  return (
    <Link
      href="/"
      className="flex items-center gap-1g group"
    >
      <div className='relative h-8 w-8 md:h-10 md:w-10 overflow-hidden shrink-0 group-hover:scale-103 transition-all duration-300'>
        <Image
          src="/logo.png"
          priority
          fill
          alt='PKey Logo'
          className='object-contain'
        />
      </div>
      <p className='text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-50'>
        <span className="bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">PKey</span>
      </p>
    </Link>
  )
}

export default Logo