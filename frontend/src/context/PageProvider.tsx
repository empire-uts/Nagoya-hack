"use client"

import { createContext, useState, ReactNode, FC, useContext } from "react";

type Props ={
  children: ReactNode
}

export const PageContext = createContext({} as {
  nowPage: string,
  setNowPage: React.Dispatch<React.SetStateAction<string>>
});

export const usePageContext = () => {
  return useContext(PageContext);
};

export const PageProvider:FC<Props> = ({children}) => {
  const [nowPage, setNowPage] = useState<string>("home");

  return(
    <PageContext.Provider value={{nowPage, setNowPage}}>
      {children}
    </PageContext.Provider>
  )
}