"use client"

import { createContext, FC, ReactNode, useContext, useEffect, useState } from "react";

type Context = {
  currentAccount: string,
  connectWallet: () => void,
}

type Props ={
  children: ReactNode
}

export const AccountContext = createContext<Context>({
  currentAccount: "",
  connectWallet: () => {}
});

export const useAccountContext = () => {
  return useContext(AccountContext);
}

export const AccountProvider:FC<Props> = ({ children }) => {
  const [ currentAccount, setCurrentAccount ] = useState<string>("");

  const connectWallet = async() => {
    try{
      const { ethereum } = window;
      if(!ethereum){
        return;
      }
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x13881' }],
      });

      const accounts = await ethereum.request({method: "eth_requestAccounts"});
      if(accounts.length > 0){
        console.log('currentAccount: ', accounts[0]);
        setCurrentAccount(accounts[0]);
      }
      
    }catch(error){
      console.log(error);
    };
  }

  useEffect(() => {
    const checkIfWalletIsConnected = async() => {
      try{
        const { ethereum } = window;
        if(!ethereum){
          console.log('')
          return;
        }
        await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x13881' }],
        });
        
        const accounts = await ethereum.request({method: "eth_accounts"});
        if(accounts.length > 0){
          console.log('currentAccount: ', accounts[0]);
          setCurrentAccount(accounts[0]);
        }

      }catch(error){
        console.log(error);
      }
    };

    checkIfWalletIsConnected();
  }, [])

  return(
    <AccountContext.Provider value={{ currentAccount, connectWallet}}>
      {children}
    </AccountContext.Provider>
  )
}