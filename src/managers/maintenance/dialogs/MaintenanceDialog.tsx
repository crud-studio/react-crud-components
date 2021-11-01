import {FormattedMessage} from "react-intl";
import React, {FunctionComponent} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText} from "@mui/material";
import DialogTitleEnhanced from "../../../components/dialogs/DialogTitleEnhanced";
import NiceModal, {muiDialog, useModal} from "@ebay/nice-modal-react";

export type MaintenanceDialogProps = {
  supportEmail: string;
};

const MaintenanceDialog: FunctionComponent<MaintenanceDialogProps> = NiceModal.create(({supportEmail}) => {
  const modal = useModal();

  return (
    <Dialog {...muiDialog(modal)}>
      <DialogTitleEnhanced onClose={modal.hide}>
        <FormattedMessage id="pages.down-for-maintenance" />
      </DialogTitleEnhanced>
      <DialogContent>
        <DialogContentText>
          <FormattedMessage id="pages.down-for-maintenance-explanation" values={{supportEmail: supportEmail}} />
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

export default MaintenanceDialog;
