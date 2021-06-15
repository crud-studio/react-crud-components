import React, {FunctionComponent, PropsWithChildren} from "react";
import {DialogTitle, IconButton, Typography} from "@material-ui/core";
import {SxProps} from "@material-ui/system";
import {Theme} from "@material-ui/core/styles";
import {CloseOutlined} from "@material-ui/icons";

interface IProps extends PropsWithChildren<any> {
  onClose?: () => void;
  sx?: SxProps<Theme>;
}

const DialogTitleEnhanced: FunctionComponent<IProps> = ({onClose, sx, children}) => {
  return (
    <DialogTitle sx={sx}>
      {onClose ? (
        <IconButton aria-label="close" size="small" onClick={onClose} sx={{float: "right"}}>
          <CloseOutlined />
        </IconButton>
      ) : null}
      <Typography component="h2" variant="h2">
        {children}
      </Typography>
    </DialogTitle>
  );
};
export default DialogTitleEnhanced;
