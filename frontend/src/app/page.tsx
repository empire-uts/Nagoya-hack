"use client"

import { ethers } from "ethers";
import { useState, useContext } from "react";
import Image from 'next/image'

import { CONTRACT_ADDRESS } from "@/utils/Contents";
import contractAbi from "@/utils/contractAbi.json";
import { useHash } from "@/hooks/useHash";
import { ExcelInput } from "@/components/ExcelInput";
import { useReadExcel } from "@/hooks/useReadExcel";


export default function Home() {
  const [ excelFile, setExcelFile ] = useState<File | undefined>();
  const [ excelFileName, setExcelFileName ] = useState<string>("");
  const [ targetAdminAddr, setTargetAdminAddr ] = useState("");

  const checkHashMatch = async()=> {
    if(excelFile){
      if(!ethers.utils.isAddress(targetAdminAddr)){
        console.log("存在しないアドレス");
        return;
      }
      const excelDataJson = await useReadExcel(excelFile);
      const excelDataHash = await useHash(excelDataJson);
      const excelFileNameHash = await useHash(excelFileName);

      const { ethereum } = window;
    if(!ethereum){
      return;
    }
    const provider = new ethers.providers.Web3Provider(ethereum);
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      contractAbi.abi,
      provider
    )

    const status:boolean = await contract.verifyFileHash(
        targetAdminAddr,
        excelFileNameHash,
        excelDataHash
      )
    console.log("status :", status);
    }
  }

  return (
    <div className="flex flex-col items-center">
      <ExcelInput setExcelFile={setExcelFile} setExcelFileName={setExcelFileName}/>
      <input className="mt-6 p-2 text-zinc-500 bg-zinc-100 rounded-lg outline-none" type="text" placeholder="address" value={targetAdminAddr} onChange={(e) => setTargetAdminAddr(e.target.value)}/>
      <button className="mt-16 p-3 text-white bg-zinc-900 rounded-lg hover:opacity-80 duration-200" onClick={checkHashMatch}>Check Excel Data</button>
    </div>
  )
}
