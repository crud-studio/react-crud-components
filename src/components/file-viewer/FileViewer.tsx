import React, {ComponentType, FunctionComponent, useCallback, useMemo} from "react";
import CsvViewer from "./drivers/CsvViewer";
import XlsxViewer from "./drivers/XlsxViewer";
import PhotoViewer from "./drivers/PhotoViewer";
import AudioViewer from "./drivers/AudioViewer";
import VideoViewer from "./drivers/VideoViewer";
import UnsupportedViewer from "./drivers/UnsupportedViewer";
import PDFViewer from "./drivers/PdfViewer";
import {useMeasure} from "react-use";
import {IPropsFileViewerDriver} from "../../models/props";
import {Box} from "@mui/material";

interface IProps {
  fileType?: string;
  fileData?: string;
}

const FileViewer: FunctionComponent<IProps> = ({fileType, fileData}) => {
  const [ref, {width, height}] = useMeasure<HTMLDivElement>();

  const getDriver = useCallback((fileType?: string): ComponentType<IPropsFileViewerDriver> => {
    switch (fileType) {
      case "csv": {
        return CsvViewer;
      }
      case "xlsx": {
        return XlsxViewer;
      }
      case "jpg":
      case "jpeg":
      case "gif":
      case "bmp":
      case "png":
      case "webp":
      case "svg": {
        return PhotoViewer;
      }
      case "pdf": {
        return PDFViewer;
      }
      case "mp3":
      case "wav": {
        return AudioViewer;
      }
      case "webm":
      case "mp4": {
        return VideoViewer;
      }
      default: {
        return UnsupportedViewer;
      }
    }
  }, []);

  const Driver = useMemo<ComponentType<IPropsFileViewerDriver>>(() => getDriver(fileType), [fileType]);

  return (
    <Box ref={ref}>
      <Driver fileData={fileData} fileType={fileType} width={width} height={height} />
    </Box>
  );
};

export default FileViewer;
