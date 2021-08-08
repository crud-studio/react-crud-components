import React, {FunctionComponent} from "react";
import {Box} from "@material-ui/core";
import {IPropsFileViewerDriver} from "../../../models/props";

const PhotoViewer: FunctionComponent<IPropsFileViewerDriver> = ({fileData}) => {
  return <Box>{fileData && <img src={fileData} alt="preview" />}</Box>;
};
export default PhotoViewer;
