// components/NavLink.js
import Link from 'next/link'

const NavLink = ({ href, icon, label }) => (
  <Link
    href={href}
    className="flex items-center gap-1.5 px-3 py-2 rounded-md
               text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700
               transition-colors duration-200 text-sm md:text-base font-medium"
  >
    {icon}
    <span>{label}</span>
  </Link>
);

export default NavLink;
