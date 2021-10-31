import {FormattedMessage} from "react-intl";
import React, {FunctionComponent} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText} from "@mui/material";
import DialogTitleEnhanced from "../../../components/dialogs/DialogTitleEnhanced";
import useModals from "../../../contexts/modals/hooks/useModals";

interface IProps {
  modalId: string;
  supportEmail: string;
}

const MaintenanceDialog: FunctionComponent<IProps> = ({modalId, supportEmail}) => {
  const {isModalOpen, hideModalWrapper} = useModals();

  return (
    <>
      <Dialog open={isModalOpen(modalId)} onClose={hideModalWrapper(modalId)}>
        <DialogTitleEnhanced onClose={hideModalWrapper(modalId)}>
          <FormattedMessage id="pages.down-for-maintenance" />
        </DialogTitleEnhanced>
        <DialogContent>
          <DialogContentText>
            <FormattedMessage id="pages.down-for-maintenance-explanation" values={{supportEmail: supportEmail}} />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={hideModalWrapper(modalId)}>
            <FormattedMessage id="pages.continue" />
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MaintenanceDialog;
