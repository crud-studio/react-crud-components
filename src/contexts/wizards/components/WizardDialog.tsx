import React, {useCallback, useEffect} from "react";
import NiceModal, {useModal} from "@ebay/nice-modal-react";
import useWizards from "../hooks/useWizards";
import useWizardConfig from "../hooks/useWizardConfig";
import {Button, Dialog, DialogActions, DialogContent} from "@mui/material";
import {FormattedMessage} from "react-intl";
import WizardInfo from "./WizardInfo";
import DialogTitleEnhanced from "../../../components/dialogs/DialogTitleEnhanced";
import ConfirmationDialog from "../../../components/dialogs/ConfirmationDialog";

export type WizardDialogProps = {
  wizardId: string;
};

const WizardDialog = NiceModal.create(({wizardId}: WizardDialogProps) => {
  const modal = useModal();
  const {updatedWizardStatus, startedWizardStepId, dismissWizard} = useWizards();

  const wizardConfig = useWizardConfig(wizardId);

  useEffect(() => {
    if (updatedWizardStatus && updatedWizardStatus.id === wizardId && updatedWizardStatus.isCompleted) {
      modal.hide();
    }
  }, [updatedWizardStatus]);

  useEffect(() => {
    if (startedWizardStepId) {
      modal.hide();
    }
  }, [startedWizardStepId]);

  const hideForeverInternal = useCallback(() => {
    dismissWizard(wizardId);
    modal.hide();
  }, []);

  const hideForever = useCallback(() => {
    NiceModal.show(ConfirmationDialog, {
      modalTitleKey: "pages.hide",
      modalTextKey: "pages.confirm-hide-this-forever",
      onConfirm: hideForeverInternal,
    });
  }, [hideForeverInternal]);

  return (
    <>
      {wizardConfig && (
        <Dialog
          open={modal.visible}
          onClose={() => modal.hide()}
          TransitionProps={{
            onExited: () => modal.remove(),
          }}
          fullWidth
          maxWidth="lg"
        >
          <DialogTitleEnhanced onClose={modal.hide}>
            <FormattedMessage id={wizardConfig.titleKey} />
          </DialogTitleEnhanced>
          <DialogContent>
            <WizardInfo wizardId={wizardId} />
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" color="primary" onClick={hideForever}>
              <FormattedMessage id="pages.hide-this-forever" />
            </Button>
            <Button variant="outlined" color="primary" onClick={modal.hide}>
              <FormattedMessage id="pages.close" />
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
});

export default WizardDialog;
