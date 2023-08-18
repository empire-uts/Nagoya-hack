import ExeclJS from "exceljs";

export const readExcel = async(file:File):Promise<string> => {
  const data = await file.arrayBuffer();

  const workbook = new ExeclJS.Workbook();
  await workbook.xlsx.load(data);
  const worksheet = workbook.getWorksheet(1);

  const rows = worksheet.getSheetValues();
  const json = JSON.stringify(rows, null, 2);
  return json;
}