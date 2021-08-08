import React, {FunctionComponent, useCallback, useState} from "react";
import {Box, Typography} from "@material-ui/core";
import {FormattedMessage} from "react-intl";
import {IPropsFileViewerDriver} from "../../../models/props";

const VideoViewer: FunctionComponent<IPropsFileViewerDriver> = ({fileType, fileData}) => {
  const [loading, setLoading] = useState<boolean>(true);

  const onCanPlay = useCallback((): void => {
    setLoading(false);
  }, [setLoading]);

  return (
    <Box sx={{visibility: loading ? "hidden" : "visible"}}>
      {fileData && (
        <video controls onCanPlay={onCanPlay}>
          <source type={`video/${fileType}`} src={`data:video/${fileType};base64,${fileData.split(";base64,")[1]}`} />

          <Typography variant="body2" sx={{textAlign: "center"}}>
            <FormattedMessage id="error.video-playback-not-supported" />
          </Typography>
        </video>
      )}
    </Box>
  );
};

export default VideoViewer;
