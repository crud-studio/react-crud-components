import React, {FunctionComponent} from "react";
import {Box, CircularProgress} from "@mui/material";

const LoadingCenter: FunctionComponent = () => {
  return (
    <Box
      sx={{
        position: "fixed",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default LoadingCenter;
