import React from 'react';
// import {}
import { ArrowDownUp, LayoutDashboard, LockKeyhole, ShieldCheck } from 'lucide-react';
const features = [
  {
    icon: (
      <ShieldCheck className="h-8 w-8 text-blue-500 dark:text-blue-400" />
    ),
    title: 'Robust Security',
    shadowColor:"shadow-blue-500/20 dark:shadow-blue-400/20",
    description:
      'Utilize industry-leading encryption to keep your passwords secure from unauthorized access. Your data is always protected.',
  },
  {
    icon: (
      <LockKeyhole className='KeyIcon className="h-8 w-8 text-purple-500 dark:text-purple-400'/>
    ),
    shadowColor:"shadow-purple-500/20 dark:shadow-purple-400/20",
    title: 'Smart Password Generation',
    description:
      'Generate unique, complex, and unguessable passwords with a single click, tailored to your specific needs.',
  },
  {
    icon: (
      <ArrowDownUp className="text-teal-500 dark:text-teal-400 rotate-90" />
    ),
    shadowColor:"shadow-teal-500/20 dark:shadow-teal-400/20",
    title: 'Cross-Device Access',
    description:
      'Access your passwords securely from any device, anywhere. Your data is synchronized and always available.',
  },
  {
    icon: (
      <LayoutDashboard className="h-8 w-8 text-orange-500 dark:text-orange-400" />
    ),
    shadowColor:"shadow-orange-500/20 dark:shadow-orange-400/20",
    title: 'Intuitive Interface',
    description:
      'Effortlessly manage your digital life with a clean, user-friendly interface designed for simplicity and efficiency.',
  },
];

const Section2 = () => {
  return (
    <section className="bg-white rounded-2xl dark:bg-gray-900 py-16 sm:py-20">
      <div className="container  mx-auto px-4 md:px-8 lg:px-12">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-50 mb-4">
            Why Choose <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">PKey?</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover how PKey simplifies your online security with powerful, user-friendly features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`bg-gray-50 dark:bg-gray-800 p-8 rounded-xl shadow-md ${feature.shadowColor} hover:shadow-lg transform hover:-translate-y-2 transition-all duration-300 ease-in-out
                         border border-gray-100 dark:border-gray-700`}
            >
              <div className="flex justify-center mb-6">
                <div className="bg-blue-100/50 dark:bg-blue-900/50 p-3 rounded-full inline-flex items-center justify-center">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50 mb-3 text-center">
                {feature.title}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-center">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Section2;