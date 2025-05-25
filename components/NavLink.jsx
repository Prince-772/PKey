// components/NavLink.js
import Link from 'next/link'

const NavLink = ({ href, icon, label }) => (
  <Link
    href={href}
    className="flex items-center gap-1.5 px-3 py-2 rounded-md
               text-gray-700 dark:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-gray-700/50
               transition-colors duration-200 text-sm md:text-base font-medium border border-purple-600"
  >
    {icon}
    <span className='hidden sm:inline'>{label}</span>
  </Link>
);

export default NavLink;
