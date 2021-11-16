import React from "react";
import NiceModal, {useModal} from "@ebay/nice-modal-react";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText} from "@mui/material";
import {FormattedMessage} from "react-intl";
import {Player} from "@lottiefiles/react-lottie-player";
import happyStarLottie from "../../../data/lotties/happyStarLottie";
import DialogTitleEnhanced from "../../../components/dialogs/DialogTitleEnhanced";

export type WizardCompletedDialogProps = {
  wizardId: string;
};

const WizardCompletedDialog = NiceModal.create(({wizardId}: WizardCompletedDialogProps) => {
  const modal = useModal();

  return (
    <Dialog
      open={modal.visible}
      onClose={() => modal.hide()}
      TransitionProps={{
        onExited: () => modal.remove(),
      }}
    >
      <DialogTitleEnhanced onClose={modal.hide}>
        <FormattedMessage id="pages.congratulations" />
      </DialogTitleEnhanced>
      <DialogContent>
        <DialogContentText>
          <FormattedMessage id="pages.finished-wizard" />
        </DialogContentText>

        <Player
          autoplay
          loop
          src={happyStarLottie}
          style={{height: "200px", width: "200px"}}
          rendererSettings={{
            preserveAspectRatio: "xMidYMid slice",
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="primary" onClick={modal.hide}>
          <FormattedMessage id="pages.great" />
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default WizardCompletedDialog;
