import Image from "next/image";
import Link from "next/link";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "./icons";
import { ExternalLink } from "lucide-react";
import Logo from "@/components/logo";

const Footer = () => {
  // Links ko properly categorize kar diya hai taaki columns ban sakein
  const footerSections = [
    {
      title: "Free Tools & Guides",
      links: [
        {
          text: "Password Security Insights",
          link: "/password-strength",
          isNew: true,
        },
        { text: "Master Password Guide", link: "/master-password" },
        { text: "Security Architecture", link: "/security", isNew: true },
      ],
    },
    {
      title: "Legal & Support",
      links: [
        { text: "Privacy Policy", link: "/privacy-policy" },
        { text: "Terms & Conditions", link: "/terms&conditions" },
        { text: "Blocked Account Help", link: "/blocked-accounts-help" },
        { text: "Contact the Developer", link: "mailto:princek772.dev@gmail.com?subject=PKey Support: Issue/Feedback" },
      ],
    },
  ];

  return (
    <footer className="bg-white border-3 dark:bg-gray-950 pt-16 pb-8 border-t border-gray-100 dark:border-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 pb-12 border-b border-gray-100 dark:border-gray-900 transition-colors duration-300">
          {/* Brand Info */}
          <div className="space-y-4 max-w-xs">
            <div className="flex items-center gap-2">
              <Logo />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed transition-colors duration-300">
              Securing your digital world with zero-knowledge encryption. Made
              for humans, built with logic.
            </p>

            {/* Social Icons (Moved under description for better layout) */}
            <div className="flex items-center gap-3 pt-2">
              {[
                {
                  icon: <TwitterIcon className="w-5 h-5" />,
                  link: "https://x.com/Prince_K772",
                },
                {
                  icon: <LinkedinIcon className="w-5 h-5" />,
                  link: "https://www.linkedin.com/in/prince-kushwaha-2834b6205/",
                },
                {
                  icon: <GithubIcon className="w-5 h-5" />,
                  link: "https://github.com/Prince-772/PKey",
                },
              ].map((soc, i) => (
                <a
                  key={i}
                  href={soc.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-black dark:text-white hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-800/50 transition-all duration-300"
                >
                  {soc.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="flex flex-col sm:flex-row gap-12 sm:gap-20 lg:gap-24">
            {footerSections.map((section, idx) => (
              <div key={idx} className="flex flex-col gap-4">
                {/* Column Heading */}
                <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-widest">
                  {section.title}
                </h4>

                {/* Column Links */}
                {/* Column Links */}
                <ul className="space-y-3">
                  {section.links.map((item, i) => (
                    <li key={i}>
                      <Link
                        href={item.link}
                        className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 flex items-center group w-fit relative"
                      > 
                        <div className="absolute left-0 w-3.5 h-3.5 opacity-0 -translate-x-3 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                          <ExternalLink className="w-full h-full" />
                        </div>

                        <div className="flex items-center gap-1.5 transform transition-transform duration-300 group-hover:translate-x-5">
                          <span>{item.text}</span>

                          {item.isNew && (
                            <div className="relative flex items-center justify-center">
                              <span className="absolute inset-0 rounded-md bg-blue-400/50 dark:bg-blue-500/50 animate-ping" />
                              <span className="relative px-1.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-wider border border-blue-200 dark:border-blue-800/50">
                                New
                              </span>
                            </div>
                          )}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 font-medium transition-colors duration-300">
            <span>&copy; {new Date().getFullYear()}</span>
            <span className="text-gray-900 dark:text-gray-200 font-bold transition-colors duration-300">
              PKey.
            </span>
            <span className="hidden sm:inline">| All rights reserved.</span>
          </div>

          <p className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 font-medium transition-colors duration-300">
            Made with ❤️ by{" "}
            <a
              href="https://github.com/Prince-772"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-900 dark:text-gray-200 font-bold hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
            >
              Prince Kushwaha
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
