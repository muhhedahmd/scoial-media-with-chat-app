
"use client"
import { createContext, useState, useContext } from "react";

interface MessageContextType {
  isMessageOpen:
    | {
        open: boolean;
        id: number | null;
      }
    | undefined;
  toggleMessageOpen: (id: number, open: boolean) => void;
}

const MessageOpenContext = createContext<MessageContextType | undefined>(undefined);

const useMessageOpen = () => {
  const context = useContext(MessageOpenContext);
  if (!context) {
    throw new Error("useMessageOpen must be used within a MessageOpenProvider");
  }
  return context;
};

const MessageOpenProvider = ({ children }: { children: React.ReactNode }) => {
  const [isMessageOpen, setIsMessageOpen] = useState<{
    open: boolean;
    id: number;
  }>();

  const toggleMessageOpen = (id: number, open: boolean) => {
    setIsMessageOpen((prev) => {
      if (prev && prev.id === id) return undefined;
      return { open, id } || undefined;
    });
  };

  return (
    <MessageOpenContext.Provider value={{ isMessageOpen, toggleMessageOpen }}>
      {children}
    </MessageOpenContext.Provider>
  );
};

export { MessageOpenContext, useMessageOpen, MessageOpenProvider };