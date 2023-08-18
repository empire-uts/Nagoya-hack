import { useAccountContext } from "@/context/AccountProvider";
import { FC, ReactNode } from "react";

type Props = {
  children: ReactNode
}

export const IsConnectWallet:FC<Props> = ({children}) => {
  const { currentAccount, connectWallet }  = useAccountContext();
  return(
    <>
      {currentAccount ==""?(
        <button className="mt-16 p-3 text-white bg-blue-500 rounded-lg hover:opacity-80 duration-200" onClick={connectWallet}>Connect Wallet</button>
      ):(
        <>
          {children}
        </>
      )}
    </>
  )
}