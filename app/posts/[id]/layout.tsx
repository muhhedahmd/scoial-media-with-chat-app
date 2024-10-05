"use client";
import React, { createContext, useState, useContext, ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
// import Header from "./_conponents/Header";
// import { PaginationProvider } from "@/context/pagganition";

// // Define the shape of your context
// interface MessageContextType {
//   isMessageOpen: {
//     open: boolean ;
//     id: number | null
//   } | undefined;
//   toggleMessageOpen:(id: number, open: boolean) => void;
// }

// // Create the context with default values
// export const MessageOpenContext = createContext<MessageContextType | undefined>(undefined);

// // Custom hook for easy access to the context
// export const useMessageOpen = () => {
//   const context = useContext(MessageOpenContext);
//   if (!context) {
//     throw new Error("useMessageOpen must be used within a MessageOpenProvider");
//   }
//   return context;
// };

// // Context provider component
// const MessageOpenProvider = ({ children }: { children: ReactNode }) => {
//   const [isMessageOpen, setIsMessageOpen] = useState< {
//     open: boolean;
//     id: number
//   }>();

//   const toggleMessageOpen = (id : number , open: boolean) => {
    
//     setIsMessageOpen((prev ) => {
//       if(prev && prev.id === id) return {open :false, id :null};
//       return {open, id};
      
//     } );
//   };

//   return (
//     <MessageOpenContext.Provider value={{ isMessageOpen, toggleMessageOpen }}>
//       {children}
//     </MessageOpenContext.Provider>
//   );
// };

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="h-screen w-full">
      <SessionProvider>


        {/* <MessageOpenProvider> */}
          {children}
          
          {/* </MessageOpenProvider> */}
      </SessionProvider>
    </div>
  );
};

export default Layout;
