import React, {FunctionComponent, PropsWithChildren} from "react";
import {Typography} from "@mui/material";
import {SxProps} from "@mui/system";
import {Theme} from "@mui/material/styles";

interface IProps extends PropsWithChildren<any> {
  sx?: SxProps<Theme>;
}

const DialogContentTitle: FunctionComponent<IProps> = ({sx, children}) => {
  return (
    <Typography component="h3" variant="h6" sx={{mb: 3, ...sx}}>
      {children}
    </Typography>
  );
};
export default DialogContentTitle;
