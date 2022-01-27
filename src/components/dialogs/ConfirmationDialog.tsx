import {FormattedMessage} from "react-intl";
import React, {FunctionComponent} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText} from "@mui/material";
import DialogTitleEnhanced from "./DialogTitleEnhanced";
import NiceModal, {useModal} from "@ebay/nice-modal-react";

import {Theme} from "@mui/material/styles/createTheme";
import {alpha} from "@mui/system/colorManipulator";
import styled from "@mui/material/styles/styled";
import useTheme from "@mui/material/styles/useTheme";
import {SxProps} from "@mui/system/styleFunctionSx/styleFunctionSx";
import Box from "@mui/material/Box";
import ChildCare from "@mui/icons-material/ChildCare";

export type ConfirmationDialogProps = {
  modalTitleKey: string;
  modalTitleValues?: any;
  modalTextKey: string;
  modalTextValues?: any;
  continueTextKey?: string;
  onConfirm?: () => void;
};

const ConfirmationDialog: FunctionComponent<ConfirmationDialogProps> = NiceModal.create(
  ({
    modalTitleKey,
    modalTitleValues = null,
    modalTextKey,
    modalTextValues = null,
    continueTextKey = null,
    onConfirm,
  }) => {
    const modal = useModal();

    const confirm = (): void => {
      onConfirm?.();

      modal.resolve(true);
      modal.hide();
    };

    return (
      <Dialog
        open={modal.visible}
        onClose={() => modal.hide()}
        TransitionProps={{
          onExited: () => modal.remove(),
        }}
      >
        <DialogTitleEnhanced onClose={modal.hide}>
          <FormattedMessage id={modalTitleKey} values={modalTitleValues || {}} />
        </DialogTitleEnhanced>
        <DialogContent>
          <DialogContentText>
            <FormattedMessage id={modalTextKey} values={modalTextValues || {}} />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="primary" onClick={modal.hide}>
            <FormattedMessage id="pages.cancel" />
          </Button>
          <Button variant="contained" color="primary" onClick={confirm}>
            <FormattedMessage id={continueTextKey || "pages.continue"} />
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
);

export default ConfirmationDialog;
