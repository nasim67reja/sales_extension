import React, { useCallback } from "react";
// import { utils, writeFileXLSX, WorkBook, WorkSheet } from "xlsx";

interface ExportToExcelProps {
  data: Array<{ [key: string]: any }>;
  fileName: string;
  text: string;
}

const ExportToExcel: React.FC<ExportToExcelProps> = ({
  data,
  fileName,
  text,
}) => {
  const exportFile = useCallback(() => {
    // const ws: WorkSheet = utils.json_to_sheet(data);
    // const wb: WorkBook = utils.book_new();
    // utils.book_append_sheet(wb, ws, "Data");
    // writeFileXLSX(wb, `${fileName}.xlsx`);
  }, [data, fileName]);

  return (
    <>
      <button className="bg-transparent border-none" onClick={exportFile}>
        {text}
      </button>
    </>
  );
};

export default ExportToExcel;
