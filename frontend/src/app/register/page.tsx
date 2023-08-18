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
  const [ targetAdminAddr, setTargetAdminAddr ] = useState("");
  const [ isAddress, setIsAddress ] = useState(true);
  const [ isLoding, setIsLoding ] = useState<boolean>(false);

  useEffect(() => {
    setNowPage("register");
  }, [])

  const registerExcelData = async() => {
    if(excelFile){
      if(!ethers.utils.isAddress(targetAdminAddr)){
        console.log("存在しないアドレス");
        setIsAddress(false);
        return;
      }

      const excelDataJson = await readExcel(excelFile);
      const excelDataHash = await createHash(excelDataJson);
      
      const _excelNameHash = await createHash(excelFileName);
      setExcelNameHash(_excelNameHash);
      
      const { ethereum } = window;
      if(!ethereum){
        alert("Please insall Metamask");
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

        const isApploved = await contract.isApproved(targetAdminAddr, _excelNameHash);
        if(!isApploved){
          console.log('is apploved: ', isApploved);
          alert("編集権限がありません");
          return;
        }

        const txn = await contract.addFile(_excelNameHash, excelDataHash, targetAdminAddr);
        setIsLoding(true);
        await txn.wait();
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
      <input
        className="mt-6 px-4 py-2 border border-gray200 text-zinc-500 rounded-xl"
        placeholder="address.."
        value={targetAdminAddr}
        onChange={(e) => setTargetAdminAddr(e.target.value)}
      />
      {(!isAddress)&& (
        <p className="text-sm text-red-500">存在しないアドレス</p>
      )}
      <button className="mt-16 p-3 text-white bg-zinc-900 rounded-lg hover:opacity-80 duration-200" onClick={registerExcelData}>Register Excel Data</button>
      <FileAddressDisplay excelFileName={excelFileName} adminAddress={currentAccount}/>
      {isLoding && (
        <Spinner/>
      )}
     </IsConnectWallet>
    </div>
  )
}
