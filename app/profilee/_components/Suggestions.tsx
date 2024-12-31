// components/RightSidebar.tsx
import React from 'react';

const RightSidebar = () => {
  return (
    <aside className=" sticky top-0  hidden lg:flex flex-col w-1/5 bg-gray-900 text-white p-6">
      {/* Who to Follow */}
      <div className="mb-6">
        <h3 className="font-bold text-lg">Who to follow</h3>
        <ul className="mt-4 space-y-4">
          <li className="flex justify-between items-center">
            <span>@User1</span>
            <button className="text-blue-400">Follow</button>
          </li>
          <li className="flex justify-between items-center">
            <span>@User2</span>
            <button className="text-blue-400">Follow</button>
          </li>
        </ul>
      </div>

      {/* Trending News */}
      <div>
        <h3 className="font-bold text-lg">Trending News</h3>
        <ul className="mt-4 space-y-4">
          <li>News Item 1: Some trending news...</li>
          <li>News Item 2: More news here...</li>
        </ul>
      </div>
    </aside>
  );
};

export default RightSidebar;
