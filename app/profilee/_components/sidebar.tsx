// components/Sidebar.tsx
import Link from 'next/link';
import React from 'react';

const Sidebar = () => {
  return (
    <>
    

    <aside className=" justify-start items-start sticky rounded-md top-0 hidden lg:flex flex-col  border-1 w-1/6 shadow-md p-6">
      <ul className="space-y-6">
        <li className="hover:text-emerald-500 cursor-pointer">Home</li>
        <li className="hover:text-emerald-500 cursor-pointer">
          <Link href="/profilee/edit">
           Edit
          </Link>
          
          </li>
        <li className="hover:text-emerald-500 cursor-pointer">Notifications</li>
        <li className="hover:text-emerald-500 cursor-pointer">Messages</li>
        <li className="hover:text-emerald-500 cursor-pointer">Profile</li>
        <li className="hover:text-emerald-500 cursor-pointer">More Options</li>
      </ul>
    </aside>
    </>
  );
};

export default Sidebar;
