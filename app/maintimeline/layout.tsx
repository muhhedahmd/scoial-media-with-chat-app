import React, { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="h-screen w-full">
    {children}
    </div>
  );
};

export default Layout;