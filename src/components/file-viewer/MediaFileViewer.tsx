import React, {FunctionComponent, useCallback, useEffect, useState} from "react";
import FileViewer from "./FileViewer";
import _ from "lodash";
import {MinimalMediaFileRO, useMediaFileDownload} from "@crud-studio/react-crud-core";
import {FormattedMessage} from "react-intl";
import {Box, Typography} from "@material-ui/core";
import LoadingCenter from "../common/LoadingCenter";

interface IProps {
  mediaFile: MinimalMediaFileRO;
}

const MediaFileViewer: FunctionComponent<IProps> = ({mediaFile}) => {
  const [fileData, setFileData] = useState<string | undefined>(undefined);

  const {result, loading, error} = useMediaFileDownload(mediaFile.uuid || "");

  const readFileData = useCallback(
    (fileData): void => {
      let reader = new FileReader();
      reader.readAsDataURL(fileData);
      reader.addEventListener("loadend", function () {
        const result = reader.result;
        if (_.isString(result)) {
          setFileData(result);
        }
      });
    },
    [setFileData]
  );

  useEffect(() => {
    if (result) {
      readFileData(result);
    }
  }, [result]);

  return (
    <Box>
      {loading && (
        <Box sx={{textAlign: "center"}}>
          <LoadingCenter />
        </Box>
      )}

      {!loading && error && (
        <Typography
          variant="body2"
          component="div"
          sx={{
            textAlign: "center",
            color: "text.disabled",
            my: 1,
          }}
        >
          <FormattedMessage id="pages.error-retrieving-data" />
        </Typography>
      )}

      {fileData && <FileViewer fileData={fileData} fileType={mediaFile.extension} />}
    </Box>
  );
};
export default MediaFileViewer;
