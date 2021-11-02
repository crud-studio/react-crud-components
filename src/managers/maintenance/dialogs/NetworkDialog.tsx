import {FormattedMessage} from "react-intl";
import React, {FunctionComponent} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText} from "@mui/material";
import DialogTitleEnhanced from "../../../components/dialogs/DialogTitleEnhanced";
import NiceModal, {useModal} from "@ebay/nice-modal-react";

export type NetworkDialogProps = {
  supportEmail: string;
};

const NetworkDialog: FunctionComponent<NetworkDialogProps> = NiceModal.create(({supportEmail}) => {
  const modal = useModal();

  return (
    <Dialog
      open={modal.visible}
      onClose={() => modal.hide()}
      TransitionProps={{
        onExited: () => modal.remove(),
      }}
    >
      <DialogTitleEnhanced toggle={modal.hide}>
        <FormattedMessage id="pages.network-connection-error" />
      </DialogTitleEnhanced>
      <DialogContent>
        <DialogContentText>
          <FormattedMessage id="pages.network-connection-error-explanation" values={{supportEmail: supportEmail}} />
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={modal.hide}>
          <FormattedMessage id="pages.continue" />
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default NetworkDialog;
