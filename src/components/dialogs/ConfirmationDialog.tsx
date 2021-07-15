import {FormattedMessage} from "react-intl";
import React, {FunctionComponent} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText} from "@material-ui/core";
import DialogTitleEnhanced from "./DialogTitleEnhanced";
import useModals from "../../managers/modals/hooks/useModals";

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
  const {isModalOpen, hideModal, hideModalWrapper} = useModals();

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
        <DialogContentText>
          <FormattedMessage id={modalTextKey} values={modalTextValues || {}} />
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="primary" onClick={hideModalWrapper(modalId)}>
          <FormattedMessage id="pages.cancel" />
        </Button>
        <Button variant="contained" color="primary" onClick={confirm}>
          <FormattedMessage id={continueTextKey || "pages.continue"} />
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
