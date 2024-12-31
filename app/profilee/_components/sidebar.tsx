// components/Sidebar.tsx
import React from 'react';

const Sidebar = () => {
  return (
    <>
    

    <aside className=" justify-start items-start sticky rounded-md top-0 hidden lg:flex flex-col text-black bg-white w-1/5  p-6">
      <ul className="space-y-6">
        <li className="hover:text-blue-500 cursor-pointer">Home</li>
        <li className="hover:text-blue-500 cursor-pointer">Explore</li>
        <li className="hover:text-blue-500 cursor-pointer">Notifications</li>
        <li className="hover:text-blue-500 cursor-pointer">Messages</li>
        <li className="hover:text-blue-500 cursor-pointer">Profile</li>
        <li className="hover:text-blue-500 cursor-pointer">More Options</li>
      </ul>
      <button className="mt-auto p-3 bg-blue-500 rounded-full text-white hover:bg-blue-600">Tweet</button>
    </aside>
    </>
  );
};

export default Sidebar;
