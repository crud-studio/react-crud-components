import React, {FunctionComponent, useMemo} from "react";
import XLSX from "xlsx";
import TableDataViewer from "../TableDataViewer";
import {IPropsFileViewerDriver} from "../../../models/props";

const CsvViewer: FunctionComponent<IPropsFileViewerDriver> = ({fileData}) => {
  const data = useMemo<any[][] | undefined>(() => (!!fileData ? parse(fileData) : undefined), [fileData]);

  const parse = (fileData: string): any[][] => {
    let cleanFileData = fileData.split(";base64,")[1];
    let workbook = XLSX.read(cleanFileData, {type: "base64"});
    let firstSheetName = workbook.SheetNames[0];
    let firstSheet = workbook.Sheets[firstSheetName];
    return XLSX.utils.sheet_to_json(firstSheet, {header: 1});
  };

  return <TableDataViewer data={data} />;
};

export default CsvViewer;
