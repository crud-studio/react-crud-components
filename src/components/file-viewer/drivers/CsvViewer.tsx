import React, {FunctionComponent, useCallback, useMemo} from "react";
import XLSX from "xlsx";
import TableDataViewer from "../TableDataViewer";
import {IPropsFileViewerDriver} from "../../../models/props";

const CsvViewer: FunctionComponent<IPropsFileViewerDriver> = ({fileData}) => {
  const parse = useCallback((fileData: string): any[][] => {
    let cleanFileData = fileData.split(";base64,")[1];
    let workbook = XLSX.read(cleanFileData, {type: "base64"});
    let firstSheetName = workbook.SheetNames[0];
    let firstSheet = workbook.Sheets[firstSheetName];
    return XLSX.utils.sheet_to_json(firstSheet, {header: 1});
  }, []);

  const data = useMemo<any[][] | undefined>(() => (!!fileData ? parse(fileData) : undefined), [fileData]);

  return <TableDataViewer data={data} />;
};

export default CsvViewer;
