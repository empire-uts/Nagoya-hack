"use client"

import { ethers } from "ethers";
import { useState } from "react";

import { CONTRACT_ADDRESS } from "@/utils/Contents";
import contractAbi from "@/utils/contractAbi.json";
import { useHash } from "@/hooks/useHash";
import { ExcelInput } from "@/components/ExcelInput";
import { useReadExcel } from "@/hooks/useReadExcel";
import Spinner from "@/components/Spinner";
import { useAccountContext } from "@/context/AccountProvider";
import { FileAddressDisplay } from "@/components/FileAddressDisplay";

export default function page() {
  const { currentAccount } = useAccountContext();
  const [ excelFile, setExcelFile ] = useState<File>();
  const [ excelNameHash, setExcelNameHash ] = useState<Uint8Array>(new Uint8Array());
  const [ excelFileName, setExcelFileName ] = useState<string>("");
  const [ isLoding, setIsLoding ] = useState<boolean>(false);

  const registerExcelData = async() => {
    if(excelFile){
      const excelDataJson = await useReadExcel(excelFile);
      const excelDataHash = await useHash(excelDataJson);
      
      const _excelNameHash = await useHash(excelFileName);
      
      const { ethereum } = window;
      if(!ethereum){
        return;
      }

      try{
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          contractAbi.abi,
          signer
        )

        const txn = await contract.addFile(_excelNameHash, excelDataHash);
        setIsLoding(true);
        await txn.wait();
        setExcelNameHash(_excelNameHash);
        setIsLoding(false);
      }catch(error){
        setIsLoding(false);
      }
    }
  }

  return (
    <div className="flex flex-col max-w-4xl mx-auto items-center">
      <ExcelInput setExcelFile={setExcelFile} setExcelFileName={setExcelFileName}/>
      <button className="mt-16 p-3 text-white bg-zinc-900 rounded-lg hover:opacity-80 duration-200" onClick={registerExcelData}>Register Excel Data</button>
      <FileAddressDisplay excelFileName={excelFileName} adminAddress={currentAccount}/>
      {isLoding && (
        <Spinner/>
      )}
    </div>
  )
}
