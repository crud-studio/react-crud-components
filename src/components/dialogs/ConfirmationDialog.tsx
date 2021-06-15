import {FormattedMessage} from "react-intl";
import React, {FunctionComponent, useContext} from "react";
import {Button, Dialog, DialogActions, DialogContent, Typography} from "@material-ui/core";
import {ModalsContext} from "../../managers/ModalManager";
import DialogTitleEnhanced from "./DialogTitleEnhanced";

interface IProps {
  modalId: string;
  modalTitleKey: string;
  modalTitleValues?: any;
  modalTextKey: string;
  modalTextValues?: any;
  continueTextKey?: string;
  onConfirm: () => void;
}

const ConfirmationDialog: FunctionComponent<IProps> = ({
  modalId,
  modalTitleKey,
  modalTitleValues = null,
  modalTextKey,
  modalTextValues = null,
  continueTextKey = null,
  onConfirm,
}) => {
  const {isModalOpen, hideModal, hideModalWrapper} = useContext(ModalsContext);

  const confirm = (): void => {
    hideModal(modalId);
    onConfirm();
  };

  return (
    <Dialog open={isModalOpen(modalId)} onClose={hideModalWrapper(modalId)}>
      <DialogTitleEnhanced onClose={hideModalWrapper(modalId)}>
        <FormattedMessage id={modalTitleKey} values={modalTitleValues || {}} />
      </DialogTitleEnhanced>
      <DialogContent>
        <Typography component="p" variant="body1">
          <FormattedMessage id={modalTextKey} values={modalTextValues || {}} />
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="primary" onClick={hideModalWrapper(modalId)}>
          <FormattedMessage id="pages.cancel" />
        </Button>{" "}
        <Button color="primary" onClick={confirm}>
          <FormattedMessage id={continueTextKey || "pages.continue"} />
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
