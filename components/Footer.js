import Image from "next/image";
import Link from "next/link"; // Ensure Link is imported if you want to use it for internal navigation

const Footer = () => {
  return (
    <footer className="bg-gray-100 font-roboto dark:bg-gray-900 py-8 mt-12 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 flex flex-col lg:flex-row items-center lg:justify-between gap-4">
        {/* Copyright and Brand Name */}
        <div className="flex flex-col md:flex-row items-center gap-2 text-center md:text-left">
          <p className="text-nowrap text-sm text-gray-600 dark:text-gray-400">
            &copy; {new Date().getFullYear()}
          </p>
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            PKey.
          </span>
          <p className="text-nowrap text-sm text-gray-600 dark:text-gray-400">
            All rights reserved.
          </p>
        </div>

        <div className="flex flex-col flex-wrap lg:flex-row items-center justify-center gap-x-2 lg:gap-x-6 gap-y-6 lg:gap-y-2 mt-4 lg:mt-0">
          {[
            { text: "Privacy Policy", link: "/privacy-policy" },
            { text: "Terms & Conditions", link: "/terms&conditions" },
            { text: "What is master password?", link: "/how-it-works" },
            { text: "Account blocked?", link: "/blocked-accounts-help" },
          ].map((e,i) => (
            <Link
              key={i}
              href={e.link}
              className="text-nowrap hover:underline text-sm text-blue-500 dark:text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
            >
              {e.text}
            </Link>
          ))}
        </div>
        {/* Made By */}
        <p className="text-nowrap text-sm text-gray-600 dark:text-gray-400 order-last md:order-none mt-4 md:mt-0">
          Made with <span className="text-red-500">❤️</span> by{" "}
          <a
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors duration-200"
            href="https://github.com/Prince-772"
            target="_blank"
            rel="noopener noreferrer"
          >
            Prince Kushwaha
          </a>
        </p>

        {/* Social Media Icons */}
        <div className="flex justify-center gap-5 md:gap-6 mt-4 md:mt-0">
          <a
            href="https://www.instagram.com/pk_addon"
            target="_blank"
            rel="noopener noreferrer"
            className="relative h-7 w-7 transition-transform duration-200 hover:scale-110"
          >
            <Image
              src="/images/instagram.svg"
              alt="Instagram"
              fill
              className="object-contain dark:invert"
            />
          </a>
          <a
            href="https://x.com/Prince_K772"
            target="_blank"
            rel="noopener noreferrer"
            className="relative h-7 w-7 transition-transform duration-200 hover:scale-110"
          >
            <Image
              src="/images/twitter.svg"
              alt="Twitter (X)"
              fill
              className="object-contain dark:invert"
            />
          </a>
          <a
            href="https://www.linkedin.com/in/prince-kushwaha-2834b6205/"
            target="_blank"
            rel="noopener noreferrer"
            className="relative h-7 w-7 transition-transform duration-200 hover:scale-110"
          >
            <Image
              src="/images/linkedin.svg"
              alt="LinkedIn"
              fill
              className="object-contain dark:invert"
            />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
