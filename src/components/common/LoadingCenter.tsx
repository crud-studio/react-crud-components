import React, {FunctionComponent, PropsWithChildren} from "react";
import {Box, CircularProgress} from "@mui/material";
import {SxProps} from "@mui/system";
import {Theme} from "@mui/material/styles";

interface LoadingCenterProps {
  position?: "fixed" | "absolute";
  size?: number | string;
  sx?: SxProps<Theme>;
}

const LoadingCenter: FunctionComponent<LoadingCenterProps> = ({position = "fixed", size, sx}) => {
  return (
    <Box
      sx={{
        position: position,
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        ...sx
      }}
    >
      <CircularProgress size={size} />
    </Box>
  );
};

export default LoadingCenter;
