import React, {FunctionComponent, PropsWithChildren} from "react";
import {DialogTitle, IconButton} from "@material-ui/core";
import {SxProps} from "@material-ui/system";
import {Theme} from "@material-ui/core/styles";
import {CloseOutlined} from "@material-ui/icons";

interface IProps extends PropsWithChildren<any> {
  onClose?: () => void;
  sx?: SxProps<Theme>;
}

const DialogTitleEnhanced: FunctionComponent<IProps> = ({onClose, sx, children}) => {
  return (
    <>
      <DialogTitle sx={sx}>
        {onClose ? (
          <IconButton aria-label="close" size="small" onClick={onClose} sx={{float: "right"}}>
            <CloseOutlined />
          </IconButton>
        ) : null}

        {children}
      </DialogTitle>
      <div />
    </>
  );
};
export default DialogTitleEnhanced;
