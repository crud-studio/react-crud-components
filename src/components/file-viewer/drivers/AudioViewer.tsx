import React, {FunctionComponent, useCallback, useState} from "react";
import {FormattedMessage} from "react-intl";
import {Box, Typography} from "@mui/material";
import {IPropsFileViewerDriver} from "../../../models/props";

const AudioViewer: FunctionComponent<IPropsFileViewerDriver> = ({fileType, fileData}) => {
  const [loading, setLoading] = useState<boolean>(true);

  const onCanPlay = useCallback((): void => {
    setLoading(false);
  }, [setLoading]);

  return (
    <Box sx={{visibility: loading ? "hidden" : "visible"}}>
      {fileData && (
        <audio controls onCanPlay={onCanPlay} src={`data:audio/${fileType};base64,${fileData.split(";base64,")[1]}`}>
          <Typography variant="body2" sx={{textAlign: "center"}}>
            <FormattedMessage id="error.audio-playback-not-supported" />
          </Typography>
        </audio>
      )}
    </Box>
  );
};

export default AudioViewer;
