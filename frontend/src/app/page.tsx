"use client"

import { ethers } from "ethers";
import { useState, useContext, useEffect } from "react";
import Image from 'next/image'
import { AiFillCheckCircle, AiFillCloseCircle } from "react-icons/ai";

import { CONTRACT_ADDRESS } from "@/utils/Contents";
import contractAbi from "@/utils/contractAbi.json";
import { createHash } from "@/utils/createHash";
import { ExcelInput } from "@/components/features/ExcelInput";
import { readExcel } from "@/utils/readExcel";
import { FileAddressDisplay } from "@/components/features/FileAddressDisplay";
import { usePageContext } from "@/context/PageProvider";
import { IsConnectWallet } from "@/components/features/IsConnextWallet";


export default function Home() {
  const { setNowPage }  =usePageContext();
  const [ excelFile, setExcelFile ] = useState<File | undefined>();
  const [ excelFileName, setExcelFileName ] = useState<string>("");
  const [ targetAdminAddr, setTargetAdminAddr ] = useState("");
  const [ isAddress, setIsAddress ] = useState(false);
  const [ verifiedHashMatch, setVefiedHashMatch ] = useState<boolean>(false);
  const [ isCheckExcelData, setIsCheckExcelData ] = useState<boolean>(false);

  useEffect(() => {
    setNowPage("home");
  }, [])

  const checkHashMatch = async()=> {
    if(excelFile){
      if(!ethers.utils.isAddress(targetAdminAddr)){
        console.log("存在しないアドレス");
        setIsAddress(false);
        setIsCheckExcelData(true);
        return;
      }
      setIsAddress(true);
      const excelDataJson = await readExcel(excelFile);
      const excelDataHash = await createHash(excelDataJson);
      const excelFileNameHash = await createHash(excelFileName);

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

    const _verifiedHashMatch:boolean = await contract.verifyFileHash(
        targetAdminAddr,
        excelFileNameHash,
        excelDataHash
      )
    console.log("status :", _verifiedHashMatch);
    setVefiedHashMatch(_verifiedHashMatch);
    setIsCheckExcelData(true);
    }
  }

  return (
    <div className="flex flex-col max-w-4xl mx-auto items-center">
      <IsConnectWallet>
        <ExcelInput setExcelFile={setExcelFile} setExcelFileName={setExcelFileName}/>
        <div className="mt-6 mb-16">
          <input
            className="px-4 py-2 border border-gray-200 text-zinc-500 rounded-full outline-none"
            type="text"
            placeholder="address..."
            value={targetAdminAddr}
            onChange={(e) => setTargetAdminAddr(e.target.value)}
          />
          {(isCheckExcelData && !isAddress)&& (
            <p className="text-sm text-red-500">存在しないアドレス</p>
          )}
        </div>
        <div className="relative">
          <button className="p-3 text-white bg-zinc-900 rounded-lg hover:opacity-80 duration-200" onClick={checkHashMatch}>Check Excel Data</button>
          {isCheckExcelData && (
            verifiedHashMatch? (
              <AiFillCheckCircle className="absolute top-1 -left-10 mr-32 text-4xl text-green-500"/>
            ):(
              <>
                <AiFillCloseCircle className="absolute top-1 -left-10 mr-32 text-4xl text-red-500"/>
                <p className="mt-1 text-sm text-red-500">不一致</p>
              </>
            )
          )}
        </div>
        <FileAddressDisplay excelFileName={excelFileName} adminAddress={targetAdminAddr}/>
      </IsConnectWallet>
    </div>
  )
}
