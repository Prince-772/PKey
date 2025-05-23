import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useSession } from "next-auth/react";

const Section1 = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const isLoggedIn = !!user; // Check if user is logged in

  return (
    <section className="bg-gray-50 dark:bg-gray-950 py-16 relative overflow-hidden">
      {/* Abstract Gradient Background Overlay (Subtle) */}
      <div className="absolute inset-0 z-0 opacity-10 dark:opacity-5">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      {/* Main Content Container */}
      <div className="container mx-auto px-4 md:px-8 lg:px-12 flex flex-col lg:flex-row items-center gap-16 relative z-10">
        {/* Text Content */}
        <div className="w-full lg:w-1/2 text-center lg:text-left space-y-6">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-gray-900 dark:text-gray-50">
            <span className="block">Your Digital Keys,</span>
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              Secured with PKey
            </span>
          </h1>
          <p className="py-4 text-lg md:text-xl text-gray-700 dark:text-gray-300">
            PKey is an intuitive password manager designed to help you generate,
            securely store, and effortlessly access all your credentials.
            Experience peace of mind with robust encryption and seamless organization.
          </p>
          <div className="mt-8">
            <Link
              href={isLoggedIn ? "/dashboard" : "/signup"}
              className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-bold rounded-full shadow-lg
                         bg-gradient-to-r from-blue-600 to-purple-600 text-white
                         hover:from-blue-700 hover:to-purple-700
                         focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-75
                         dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600 dark:focus:ring-blue-700
                         transition transform hover:-translate-y-1 hover:scale-105 duration-300 ease-in-out"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.276a2.008 2.008 0 00-2.239-2.239 1.996 1.996 0 00-1.879 1.135L9 16.118l-4.707-4.707a1 1 0 00-1.414 1.414l5.414 5.414a1 1 0 001.414 0l6.707-6.707a1 1 0 000-1.414z" />
              </svg>
              Get Started Securely
            </Link>
          </div>
        </div>

        {/* Hero Image */}
        <div className="w-full lg:w-1/2 relative h-72 sm:h-96 lg:h-[400px] flex items-center justify-center">
          <Image
            src="/images/undraw_security_on_m7le.svg"
            alt="PKey Security Illustration"
            width={600}
            height={400}
            className="object-contain rounded-lg opacity-90 dark:opacity-90 shadow-2xl"
            priority
          />
        </div>
      </div>

      <div className="absolute inset-0 opacity-10 z-0">
        <Image
          src="/images/subtle-pattern-bg.png" // Replace with a subtle geometric pattern or texture
          alt="Background pattern"
          fill
          className="object-cover dark:invert-100"
          priority
        />
      </div>
    </section>
  );
};

export default Section1;