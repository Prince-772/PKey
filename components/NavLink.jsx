"use client";
import Link from "next/link";

const NavLink = ({ href, icon, label, openInNewTab }) => {
  const content = (
    <div
      className={`relative flex items-center gap-2 px-2 md:px-4 py-2 rounded-xl font-semibold text-sm
        transition-all duration-200 cursor-pointer select-none text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-500 border`}
    >
      <span className={`transition-transform duration-200 group-hover:scale-110`}>
        {icon}
      </span>

      <span className="hidden sm:inline">{label}</span>
    </div>
  );

  return (
    <div className="group">
      {openInNewTab ? (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {content}
        </a>
      ) : (
        <Link href={href}>{content}</Link>
      )}
    </div>
  );
};

export default NavLink;