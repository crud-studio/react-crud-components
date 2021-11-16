import React, {FunctionComponent, useCallback} from "react";
import useWizardStatus from "../hooks/useWizardStatus";
import NiceModal from "@ebay/nice-modal-react";
import useWizards from "../hooks/useWizards";
import {Card, CardContent, CardHeader, IconButton} from "@mui/material";
import WizardInfo from "./WizardInfo";
import {FormattedMessage} from "react-intl";
import useWizardConfig from "../hooks/useWizardConfig";
import {Close as CloseIcon} from "@mui/icons-material";
import ConfirmationDialog from "../../../components/dialogs/ConfirmationDialog";

interface IProps {
  wizardId: string;
}

const WizardCard: FunctionComponent<IProps> = ({wizardId}) => {
  const {minimizeWizard} = useWizards();
  const wizardConfig = useWizardConfig(wizardId);
  const wizardStatus = useWizardStatus(wizardId);

  const minimizeHandlerInternal = useCallback(() => {
    minimizeWizard(wizardId);
  }, [wizardId, minimizeWizard]);

  const minimizeHandler = useCallback(() => {
    NiceModal.show(ConfirmationDialog, {
      modalTitleKey: "pages.minimize",
      modalTextKey: "pages.confirm-minimize-wizard",
      onConfirm: minimizeHandlerInternal,
    });
  }, [minimizeHandlerInternal]);

  if (
    !wizardConfig ||
    !wizardStatus ||
    wizardStatus.isDismissed ||
    wizardStatus.isCompleted ||
    wizardStatus.isMinimized
  ) {
    return null;
  }

  return (
    <Card id={`wizard-card-${wizardId}`}>
      <CardHeader
        action={
          <IconButton aria-label="minimize" onClick={minimizeHandler}>
            <CloseIcon />
          </IconButton>
        }
        title={<FormattedMessage id={wizardConfig.titleKey} />}
        subheader={<FormattedMessage id={wizardConfig.descriptionKey} />}
      />
      <CardContent>
        <WizardInfo wizardId={wizardId} />
      </CardContent>
    </Card>
  );
};

export default WizardCard;
