import { FC } from "react";

type Props = {
  excelFileName: string,
  adminAddress: string
}

export const FileAddressDisplay:FC<Props> = ({excelFileName, adminAddress}) => {
  return(
    <div className="flex flex-col items-start w-2/4 mt-8">
      <h2 className="text-xl font-semibold">excel file name</h2>
      <p className="mt-1 ml-2">{excelFileName}</p>
      <h2 className="mt-2 text-xl font-semibold">admin address</h2>
      <p className="mt-1 ml-2">{adminAddress}</p>
    </div>
  )
}