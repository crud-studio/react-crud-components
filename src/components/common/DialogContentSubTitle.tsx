import React, {FunctionComponent, PropsWithChildren} from "react";
import {Typography} from "@material-ui/core";
import {SxProps} from "@material-ui/system";
import {Theme} from "@material-ui/core/styles";

interface IProps extends PropsWithChildren<any> {
  sx?: SxProps<Theme>;
}

const DialogContentSubTitle: FunctionComponent<IProps> = ({sx, children}) => {
  return (
    <Typography component="p" variant="body2" sx={{mb: 3, ...sx}}>
      {children}
    </Typography>
  );
};
export default DialogContentSubTitle;
