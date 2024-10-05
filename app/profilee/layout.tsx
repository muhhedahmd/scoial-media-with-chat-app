import React from "react";

import { Bell, Home, MoreHorizontal, UserIcon } from "lucide-react";
import Sidebar from "./_comp/sidebar";
import RightSidebar from "./_comp/Suggestions";
import { wrapper } from "@/store/store";
import { apiProfile } from "@/store/api/apiProfile";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative flex overflow-hidden flex-col lg:flex-row ">
      <Sidebar />
      {children}
      <Sidebar />
      {/* <RightSidebar /> */}

      <div className="h-16  md:hidden block bg-gray-100" />
      {/* Mobile Navigation Header */}
      <div className="fixed bottom-0 left-0 w-full pt-4 bg-white shadow-md md:hidden flex justify-around items-center py-2 border-t border-gray-200">
        <button className="text-gray-600">
          <Home className="w-6 h-6" />
        </button>
        <button className="text-gray-600">
          <UserIcon className="w-6 h-6" />
        </button>
        <button className="text-gray-600">
          <Bell className="w-6 h-6" />
        </button>
        <button className="text-gray-600">
          <MoreHorizontal className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default layout;
