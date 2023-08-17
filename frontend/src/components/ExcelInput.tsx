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
    <input className="mt-16" type="file" accept=".xlsx" onChange={onChangeFile}/>
  )
}