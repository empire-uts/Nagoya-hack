import { Dispatch, FC, SetStateAction } from "react";

type Props= {
  setExcelFile: Dispatch<SetStateAction<File | undefined>>,
  setExcelFileName: Dispatch<SetStateAction<string>>
}

export const ExcelInput:FC<Props> = ({ setExcelFile, setExcelFileName }) => {
  const onChangeFile = async(e:React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(file){
      setExcelFile(file);
      setExcelFileName(file.name);
    }
  }

  return(
    <input className="mt-16 ml-12 text-sm cursor-pointer hover:opacity-80 file:p-3 file:border-none file:rounded-lg file:text-white file:bg-zinc-900" type="file" accept=".xlsx" onChange={onChangeFile}/>
  )
}