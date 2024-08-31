"use client"
import React, { createContext, useState, useContext, ReactNode, SetStateAction } from 'react';
interface PaginationContextProps {
  pgnumPost: number;
  setPgnumPost: React.Dispatch<SetStateAction<number>>;
  pgsizePost: number;
  setPgsizePost: React.Dispatch<SetStateAction<number>>;
  HandleIncresePost? : () => void
}

const PaginationContext = createContext<PaginationContextProps | undefined>(undefined);

export const PaginationProvider = ({ children } : {
  children : React.ReactNode
}) => {
  const [pgnumPost, setPgnumPost] = useState<number>(0);  // Default page number
  const [pgsizePost, setPgsizePost] = useState<number>(4); // Default page size
  const HandleIncresePost = ()=>{
    setPgnumPost(pgnumPost+1);
  }
  return (
    <PaginationContext.Provider value={{ pgnumPost,  setPgsizePost ,setPgnumPost, pgsizePost, HandleIncresePost }}>
      {children}
    </PaginationContext.Provider>
  );
};

export const usePagination = () => {
  const context = useContext(PaginationContext);
  if (!context) {
    throw new Error('usePagination must be used within a PaginationProvider');
  }
  return context;
};
