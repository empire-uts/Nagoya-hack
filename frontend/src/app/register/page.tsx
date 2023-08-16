"use client"

import { useState } from "react";
import { useHash } from "@/hooks/useHash";
import { ExcelInput } from "@/components/ExcelInput";
import { useReadExcel } from "@/hooks/useReadExcel";

export default function page() {
  const [ excelFile, setExcelFile ] = useState<File>();
  const [ excelDataHash, setExcelDataHash ] = useState("");
  const [ excelFileName, setExcelFileName ] = useState<string>("");

  const registerExcelData = async() => {
    if(excelFile){
      const excelDataJson = await useReadExcel(excelFile);
      const _excelDataHash = await useHash(excelDataJson);
      setExcelDataHash(_excelDataHash);
      
      const excelFileNameHash = await useHash(excelFileName);
    }
  }

  return (
    <div>
      <h1>register</h1>
      <ExcelInput setExcelFile={setExcelFile} setExcelFileName={setExcelFileName}/>
      <button onClick={registerExcelData}>登録</button>
    </div>
  )
}
