
import React from 'react';
import { Quote } from 'lucide-react';

export default function LandingTestimonialsSection() {
  const testimonials = [
    {
      quote: "PKey has transformed how I manage my online accounts. It's incredibly secure and so intuitive!",
      author: "Arpit Kushwaha",
      title: "Marketing Manager"
    },
    {
      quote: "Finally, a password manager that's both powerful and easy to use. The sync feature is a lifesaver.",
      author: "Sreyash Pandey",
      title: "Software Engineer"
    },
    {
      quote: "I feel so much more secure knowing my data is protected with PKey's strong encryption. Highly recommended!",
      author: "Kishan Yadav",
      title: "Senior Security Engineer"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4
                       bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
          What Our Users Say
        </h2>
        <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-12">
          Hear directly from those who trust PKey for their digital security and peace of mind.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700
                         flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300"
            >
              <Quote className="w-10 h-10 text-blue-500 dark:text-blue-400 mb-4" />
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-4 italic">
                {`"${testimonial.quote}"`}
              </p>
              <p className="font-semibold text-gray-900 dark:text-gray-50">
                {testimonial.author}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {testimonial.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
