import React, {FunctionComponent} from "react";
import {IPropsFileViewerDriver} from "../../../models/props";
import {FormattedMessage} from "react-intl";
import {Box, Typography} from "@material-ui/core";

const UnsupportedViewer: FunctionComponent<IPropsFileViewerDriver> = ({fileType}) => (
  <Box sx={{textAlign: "center"}}>
    <Typography variant="body2">
      <FormattedMessage id="error.file-type-preview-not-available" values={{fileType: fileType}} />
    </Typography>
  </Box>
);

export default UnsupportedViewer;
