"use client"

import { ethers } from "ethers";
import { useEffect, useState } from "react";

import { ExcelInput } from "@/components/features/ExcelInput";
import { IsConnectWallet } from "@/components/features/IsConnextWallet";
import { useAccountContext } from "@/context/AccountProvider";
import { usePageContext } from "@/context/PageProvider";
import { createHash } from "@/utils/createHash";
import { CONTRACT_ADDRESS } from "@/utils/Contents";
import contractAbi from "@/utils/contractAbi.json";
import { FileAddressDisplay } from "@/components/features/FileAddressDisplay";
import Spinner from "@/components/ui/Spinner";

export default function Page(){
  const { setNowPage } = usePageContext();
   const { currentAccount} = useAccountContext();
  const [ excelFile, setExcelFile ] = useState<File>();
  const [ excelNameHash, setExcelNameHash ] = useState<Uint8Array>(new Uint8Array());
  const [ excelFileName, setExcelFileName ] = useState<string>("");
  const [ permissionGrantingAddr, setPermissionGrantingAddr] = useState("");
  const [ isAddress, setIsAddress ] = useState(true);
  const [ isLoding, setIsLoding ] = useState<boolean>(false);

  useEffect(() => {
    setNowPage("edit-permissions");
  },[])

  const editPermissions = async() => {
    if(excelFile){
      if(!ethers.utils.isAddress(permissionGrantingAddr)){
        console.log("存在しないアドレス");
        setIsAddress(false);
        return;
      }
      setIsAddress(true);
      const _excelNameHash = await createHash(excelFileName);

      const {ethereum} = window;
      if(!ethereum){
        alert("Please insall Metamask");
        return;
      }
      setIsAddress(true);


      try{
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          contractAbi.abi,
          signer
        )
        
        const txn = await contract.setApproval(
          permissionGrantingAddr,
          _excelNameHash,
          true
        )
        await txn.wait();
        setExcelNameHash(_excelNameHash);
        setIsLoding(false);
      }catch(error){
        setIsLoding(false);
      }
    }
  }

  return(
    <div className="flex flex-col max-w-4xl mx-auto items-center">
      <IsConnectWallet>
        <ExcelInput setExcelFile={setExcelFile} setExcelFileName={setExcelFileName}/>
        <p className="mt-10">編集権限を付与するアドレス</p>
        <input
          className="mt-2 px-4 py-2 border border-gray200 text-zinc-500 rounded-xl"
          placeholder="address.."
          value={permissionGrantingAddr}
          onChange={(e) => setPermissionGrantingAddr(e.target.value)}
        />
        {(!isAddress)&& (
            <p className="text-sm text-red-500">存在しないアドレス</p>
          )}
        <button className="mt-16 p-3.5 text-sm text-white bg-zinc-900 rounded-lg hover:opacity-80" onClick={editPermissions}>編集権限付与</button>
        <FileAddressDisplay
          excelFileName={excelFileName}
          adminAddress={currentAccount}
          permissionGrantingAddress={permissionGrantingAddr}
        />
        {isLoding && (
        <Spinner/>
        )}
      </IsConnectWallet>
    </div>
  )
}