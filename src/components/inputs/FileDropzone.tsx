import React, {FunctionComponent} from "react";
import {Box, Typography} from "@mui/material";
import {FormattedMessage} from "react-intl";
import {DropzoneProps} from "react-dropzone";
import Dropzone from "react-dropzone";

interface IProps extends DropzoneProps {}

const FileDropzone: FunctionComponent<IProps> = ({...dropzoneProps}) => {
  return (
    <Dropzone {...dropzoneProps}>
      {({getRootProps, getInputProps}) => (
        <Box className="file-dropzone" sx={{position: "relative"}}>
          <Box
            {...getRootProps({})}
            sx={{
              height: 100,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              cursor: "pointer",
              border: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            <input {...getInputProps()} />
            <Typography component="p" variant="body2">
              <FormattedMessage id="pages.drop-files-here-or-click" />
            </Typography>
          </Box>

          {dropzoneProps.disabled && (
            <Box
              sx={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                backgroundColor: (theme) => theme.palette.action.disabledBackground,
                opacity: (theme) => theme.palette.action.disabledOpacity,
              }}
            />
          )}
        </Box>
      )}
    </Dropzone>
  );
};

export default FileDropzone;
