import React, {FunctionComponent} from "react";
import {Box, Paper} from "@material-ui/core";
import {IPropsFileViewerDriver} from "../../../models/props";

const PhotoViewer: FunctionComponent<IPropsFileViewerDriver> = ({fileData}) => {
  return (
    <Box sx={{textAlign: "center"}}>
      {fileData && (
        <Paper variant="outlined" sx={{display: "inline-block", overflow: "hidden"}}>
          <img src={fileData} alt="preview" />
        </Paper>
      )}
    </Box>
  );
};
export default PhotoViewer;
