import React, {FunctionComponent, useCallback, useEffect, useMemo, useRef, useState} from "react";
import useWizardConfig from "../hooks/useWizardConfig";
import useWizardStatus from "../hooks/useWizardStatus";
import {Badge, Button} from "@mui/material";
import {FormattedMessage} from "react-intl";
import NiceModal from "@ebay/nice-modal-react";
import WizardDialog from "./WizardDialog";
import useWizards from "../hooks/useWizards";
import {WizardStepConfig} from "../WizardsContext";
import WizardStepCompletedPopover from "./WizardStepCompletedPopover";
import WizardCompletedDialog from "./WizardCompletedDialog";

interface WizardStatusButtonProps {
  wizardId: string;
}

const WizardStatusButton: FunctionComponent<WizardStatusButtonProps> = ({wizardId}) => {
  const {updatedWizardStatus, updatedWizardStepStatus, getWizardStepConfig, getWizardId, getWizardStatus} =
    useWizards();

  const wizardConfig = useWizardConfig(wizardId);
  const wizardStatus = useWizardStatus(wizardId);

  const [completedWizardStepConfig, setCompletedWizardStepConfig] = useState<WizardStepConfig | undefined>(undefined);

  const popoverAnchor = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (updatedWizardStatus && updatedWizardStatus.id === wizardId && updatedWizardStatus.isCompleted) {
      NiceModal.show(WizardCompletedDialog, {
        wizardId: wizardId,
      });
    }
  }, [updatedWizardStatus]);

  useEffect(() => {
    if (
      updatedWizardStepStatus &&
      getWizardId(updatedWizardStepStatus) === wizardId &&
      updatedWizardStepStatus.status === "Completed"
    ) {
      const wizardStatus = getWizardStatus(wizardId);
      if (!wizardStatus?.isCompleted) {
        setCompletedWizardStepConfig(getWizardStepConfig(updatedWizardStepStatus.id));
      }
    }
  }, [updatedWizardStepStatus]);

  const isWizardHidden = useMemo<boolean>(
    () => !wizardConfig || !wizardStatus || wizardStatus.isCompleted || wizardStatus.isDismissed,
    [wizardConfig, wizardStatus]
  );

  const showWizardDialog = useCallback((): void => {
    NiceModal.show(WizardDialog, {
      wizardId: wizardId,
    });
  }, [wizardId]);

  if (isWizardHidden) {
    return null;
  }

  return (
    <>
      <Badge badgeContent={`${wizardStatus?.percentComplete}%`} color="primary">
        <Button
          variant="outlined"
          onClick={showWizardDialog}
          id={`wizard-status-button-${wizardId}`}
          ref={popoverAnchor}
        >
          <FormattedMessage id={wizardConfig?.titleKey} />
        </Button>
      </Badge>

      <WizardStepCompletedPopover wizardStepConfig={completedWizardStepConfig} anchorEl={popoverAnchor.current} />
    </>
  );
};

export default WizardStatusButton;
