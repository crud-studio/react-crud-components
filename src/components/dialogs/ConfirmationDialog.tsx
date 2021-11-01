import {FormattedMessage} from "react-intl";
import React, {FunctionComponent} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText} from "@mui/material";
import DialogTitleEnhanced from "./DialogTitleEnhanced";
import NiceModal, {muiDialog, useModal} from "@ebay/nice-modal-react";

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
      <Dialog {...muiDialog(modal)}>
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
