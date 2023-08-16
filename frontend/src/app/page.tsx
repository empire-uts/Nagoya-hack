"use client"

import { ethers } from "ethers";
import { useState, useContext } from "react";
import Image from 'next/image'

import { useHash } from "@/hooks/useHash";
import { ExcelInput } from "@/components/ExcelInput";
import { AccountContext } from "@/context/AccountProvider";

export default function Home() {
  const { currentAccount, connectWallet } = useContext(AccountContext);
  const [ excelFile, setExcelFile ] = useState<File | undefined>();
  const [ excelFileName, setExcelFileName ] = useState<string>("");
  const [ targetAdminAddr, setTargetAdminAddr ] = useState("");

  const checkHashMatch = async()=> {
    console.log(currentAccount);
    if(!ethers.utils.isAddress(targetAdminAddr)){
      console.log("存在しないアドレス");
      return;
    }
    const excelFileNameHash = await useHash(excelFileName);
    const adminAddrExcelNameHash = targetAdminAddr + excelFileNameHash;
    console.log(adminAddrExcelNameHash);
  }

  const checkHash = async() => {
    const { ethereum } = window;
    if(!ethereum){
      return;
    }
    const provider = new ethers.providers.Web3Provider(ethereum);
    const contract = new ethers.Contract(
      "contract abi",
      "contract address",
      provider
    )
  }

  return (
    <div className="flex flex-col items-center">
      <ExcelInput setExcelFile={setExcelFile} setExcelFileName={setExcelFileName}/>
      <input type="text" placeholder="address" value={targetAdminAddr} onChange={(e) => setTargetAdminAddr(e.target.value)}/>
      <button onClick={checkHashMatch}>確認</button>
    </div>
  )
}
