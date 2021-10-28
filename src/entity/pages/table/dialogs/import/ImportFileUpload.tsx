import React, {FunctionComponent, useCallback} from "react";
import {FileRejection} from "react-dropzone";
import _ from "lodash";
import {DialogContent, Link} from "@mui/material";
import {FormattedMessage, useIntl} from "react-intl";
import NotificationManager from "../../../../../components/notifications/NotificationManager";
import DialogContentTitle from "../../../../../components/common/DialogContentTitle";
import DialogContentSubTitle from "../../../../../components/common/DialogContentSubTitle";
import FileDropzone from "../../../../../components/inputs/FileDropzone";
import {getFilesRejectedMessageKey} from "../../../../../helpers/FileUtils";
import XLSX, {WorkBook, WorkSheet} from "xlsx";

interface IProps {
  onFileSelected?: (data: any[]) => void;
}

const ImportFileUpload: FunctionComponent<IProps> = ({onFileSelected}) => {
  const intl = useIntl();

  const onFilesRejected = useCallback((fileRejections?: FileRejection[]): void => {
    NotificationManager.warning(<FormattedMessage id={getFilesRejectedMessageKey(fileRejections)} />);
  }, []);

  const onFilesAccepted = useCallback(
    (files: File[]): void => {
      if (_.isEmpty(files)) {
        return;
      }

      const file = files[0];

      const reader = new FileReader();
      reader.onabort = () => onFilesRejected();
      reader.onerror = () => onFilesRejected();
      reader.onload = (e) => {
        if (!e.target?.result) {
          onFilesRejected();
          return;
        }

        if (!(e.target.result instanceof ArrayBuffer)) {
          onFilesRejected();
          return;
        }

        const data: Uint8Array = new Uint8Array(e.target.result);
        const workbook: WorkBook = XLSX.read(data, {type: "array"});

        if (_.isEmpty(workbook.SheetNames)) {
          onFilesRejected();
          return;
        }

        const firstSheetName: string = workbook.SheetNames[0];
        const firstSheet: WorkSheet = workbook.Sheets[firstSheetName];
        const sheetJson = XLSX.utils.sheet_to_json(firstSheet, {
          header: 1,
        });

        if (onFileSelected) {
          onFileSelected(sheetJson);
        }
      };
      reader.readAsArrayBuffer(file);
    },
    [onFilesRejected]
  );

  return (
    <>
      <DialogContent sx={{textAlign: "center"}}>
        <DialogContentTitle sx={{mb: 0}}>
          <FormattedMessage id="pages.get-your-sheet-from-excel" />
        </DialogContentTitle>
        <DialogContentSubTitle>
          <FormattedMessage id="pages.you-can-use-any-template" />
          {" ("}
          <Link
            href={`/assets/templates/import-${intl.locale.toLowerCase()}.csv`}
            target="_blank"
            rel="noopener noreferrer"
            download="import.csv"
            underline="hover"
          >
            <FormattedMessage id="pages.example" />
          </Link>
          {")"}
        </DialogContentSubTitle>

        <FileDropzone
          accept=".csv, .xls, .xlsx"
          maxSize={5242880}
          multiple={false}
          onDropAccepted={onFilesAccepted}
          onDropRejected={onFilesRejected}
        />
      </DialogContent>
    </>
  );
};
export default ImportFileUpload;
