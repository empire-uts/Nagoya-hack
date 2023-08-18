"use client"

import Link  from "next/link";
import { useEffect, useState } from "react";

import { useAccountContext } from "@/context/AccountProvider";
import { usePageContext } from "@/context/PageProvider";


export const Header = () => {
  const { nowPage } = usePageContext();
  const { currentAccount, connectWallet } = useAccountContext();
  const [ shortAddr, setShortAddr ] = useState("");

  useEffect(() => {
    if(currentAccount === ""){
      return;
    }

    const stringLen = currentAccount.length;
    setShortAddr(currentAccount.substring(0, 5) + ".." + currentAccount.substring(stringLen-3, stringLen));
  }, [currentAccount]);

  return(
    <div className="flex justify-between p-4 items-center border-b border-zinc-200">
      <h1 className="ml-8 text-xl font-semibold text-gray-800">Title</h1>
      <ul className="flex gap-10 text-gray-400 font-light">
        <li>
          <Link href="/" className={`hover:text-gray-800 ${nowPage==="home"? "text-blue-500": ""}`} >Home</Link>
        </li>
        <li>
          <Link href="/register" className={`hover:text-gray-800 ${nowPage==="register"? "text-blue-500": ""}` }>Register</Link>
        </li>
      </ul>
      {shortAddr === "" ? (
        <button className="px-3 py-2 text-xs text-white bg-blue-500 rounded-xl hover:opacity-60" onClick={connectWallet}>connect</button>
      ) : (
        <button className="px-3 py-2 text-xs text-white bg-blue-500 rounded-xl hover:opacity-60">{shortAddr}</button>
      )}
    </div>
  )
}