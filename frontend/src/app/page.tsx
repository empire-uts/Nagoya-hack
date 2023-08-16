"use client"

import { ethers } from "ethers";
import { useState } from "react";
import Image from 'next/image'

import { useHash } from "@/hooks/useHash";
import { ExcelInput } from "@/components/ExcelInput";

export default function Home() {
  const [ excelFile, setExcelFile ] = useState<File | undefined>();
  const [ excelFileName, setExcelFileName ] = useState<string>("");
  const [ targetAdminAddr, setTargetAdminAddr ] = useState("");

  const checkHashMatch = async()=> {
    if(!ethers.utils.isAddress(targetAdminAddr)){
      console.log("存在しないアドレス");
      return;
    }
    const excelFileNameHash = await useHash(excelFileName);
    const adminAddrExcelNameHash = targetAdminAddr + excelFileNameHash;
    console.log(adminAddrExcelNameHash);
  }

  return (
    <div>
      <h1>main</h1>
      <ExcelInput setExcelFile={setExcelFile} setExcelFileName={setExcelFileName}/>
      <input type="text" placeholder="address" value={targetAdminAddr} onChange={(e) => setTargetAdminAddr(e.target.value)}/>
      <button onClick={checkHashMatch}>確認</button>
    </div>
  )
}
