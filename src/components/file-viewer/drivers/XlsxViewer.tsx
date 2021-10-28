import React, {FunctionComponent, useEffect, useState} from "react";
import XLSX from "xlsx";
import TableDataViewer from "../TableDataViewer";
import {IPropsFileViewerDriver} from "../../../models/props";
import {Box, ToggleButton, ToggleButtonGroup} from "@mui/material";

const MAX_SHEETS = 3;

const XlsxViewer: FunctionComponent<IPropsFileViewerDriver> = ({fileData}) => {
  const [sheets, setSheets] = useState<any[]>([]);
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [currentSheetIndex, setCurrentSheetIndex] = useState<number>(0);
  const [data, setData] = useState<any[][] | undefined>(undefined);

  useEffect(() => {
    if (fileData) {
      let cleanFileData = fileData.split(";base64,")[1];
      let workbook = XLSX.read(cleanFileData, {type: "base64"});

      const sheetNames = Object.keys(workbook.Sheets);
      setSheetNames(sheetNames);

      const sheets = sheetNames.map((name) => XLSX.utils.sheet_to_json(workbook.Sheets[name], {header: 1}));
      setSheets(sheets);
    }
  }, [fileData]);

  useEffect(() => {
    if (sheets && sheets.length > currentSheetIndex) {
      setData(sheets[currentSheetIndex]);
    }
  }, [sheets, currentSheetIndex]);

  return (
    <Box>
      <Box sx={{textAlign: "center", mb: 3}}>
        <ToggleButtonGroup
          color="primary"
          exclusive
          value={currentSheetIndex}
          onChange={(e, value) => setCurrentSheetIndex(value)}
        >
          {sheetNames.slice(0, MAX_SHEETS).map((name, index) => (
            <ToggleButton value={index} key={index}>
              {name}
            </ToggleButton>
          ))}

          {sheetNames.length > MAX_SHEETS && (
            <ToggleButton value={MAX_SHEETS} disabled>
              {"..."}
            </ToggleButton>
          )}
        </ToggleButtonGroup>
      </Box>

      <TableDataViewer data={data} />
    </Box>
  );
};

export default XlsxViewer;
