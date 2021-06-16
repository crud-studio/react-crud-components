import {FormattedMessage} from "react-intl";
import React, {FunctionComponent, useContext} from "react";
import {Button, Dialog, DialogActions, DialogContent, Typography} from "@material-ui/core";
import {ModalsContext} from "../../ModalManager";
import DialogTitleEnhanced from "../../../components/dialogs/DialogTitleEnhanced";

interface IProps {
  modalId: string;
  supportEmail: string;
}

const MaintenanceDialog: FunctionComponent<IProps> = ({modalId, supportEmail}) => {
  const {isModalOpen, hideModalWrapper} = useContext(ModalsContext);

  return (
    <>
      <Dialog open={isModalOpen(modalId)} onClose={hideModalWrapper(modalId)}>
        <DialogTitleEnhanced onClose={hideModalWrapper(modalId)}>
          <FormattedMessage id="pages.down-for-maintenance" />
        </DialogTitleEnhanced>
        <DialogContent>
          <Typography component="p" variant="body1">
            <FormattedMessage id="pages.down-for-maintenance-explanation" values={{supportEmail: supportEmail}} />
          </Typography>
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
