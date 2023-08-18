"use client"

import { ethers } from "ethers";
import { useEffect, useState } from "react";

import { CONTRACT_ADDRESS } from "@/utils/Contents";
import contractAbi from "@/utils/contractAbi.json";
import { createHash } from "@/utils/createHash";
import { ExcelInput } from "@/components/features/ExcelInput";
import { readExcel } from "@/utils/readExcel";
import Spinner from "@/components/ui/Spinner";
import { useAccountContext } from "@/context/AccountProvider";
import { FileAddressDisplay } from "@/components/features/FileAddressDisplay";
import { usePageContext } from "@/context/PageProvider";
import { IsConnectWallet } from "@/components/features/IsConnextWallet";

export default function Page() {
  const { setNowPage }  =usePageContext();
  const { currentAccount, connectWallet } = useAccountContext();
  const [ excelFile, setExcelFile ] = useState<File>();
  const [ excelNameHash, setExcelNameHash ] = useState<Uint8Array>(new Uint8Array());
  const [ excelFileName, setExcelFileName ] = useState<string>("");
  const [ isLoding, setIsLoding ] = useState<boolean>(false);

  useEffect(() => {
    setNowPage("register");
  }, [])

  const registerExcelData = async() => {
    if(excelFile){
      const excelDataJson = await readExcel(excelFile);
      const excelDataHash = await createHash(excelDataJson);
      
      const _excelNameHash = await createHash(excelFileName);
      
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
     <IsConnectWallet>
      <ExcelInput setExcelFile={setExcelFile} setExcelFileName={setExcelFileName}/>
      <button className="mt-16 p-3 text-white bg-zinc-900 rounded-lg hover:opacity-80 duration-200" onClick={registerExcelData}>Register Excel Data</button>
      <FileAddressDisplay excelFileName={excelFileName} adminAddress={currentAccount}/>
      {isLoding && (
        <Spinner/>
      )}
     </IsConnectWallet>
    </div>
  )
}
