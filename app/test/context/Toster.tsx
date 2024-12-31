"use client"
import React, { createContext, useContext, useState } from "react";
type contenxtData = {
    msg: string;
    type: "warn" | "error" | "succes";
} | undefined
const context = createContext<{
    contenxtData: contenxtData | undefined;
    setContextData: React.Dispatch<React.SetStateAction<contenxtData | undefined>>;
  } | null>(null);

export const ProviderToastx = ({ children }: { children: React.ReactNode }) => {
  const [contenxtData, setContextData] = useState<{
    msg: string;
    type: "warn" | "error" | "succes";
  }>();
  return (
    <context.Provider
      value={{
        contenxtData,
        setContextData,
      }}
    >
      {children}
    </context.Provider>
  );
};

export const useToastx = () => {
    const contextx = useContext(context);
    if (!context) {
      throw new Error("useToastx must be used within a ProviderToastx");
    }
    return contextx;
  };