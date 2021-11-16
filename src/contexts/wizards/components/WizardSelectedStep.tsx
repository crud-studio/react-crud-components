import React, {FunctionComponent, useCallback, useMemo} from "react";
import useWizardStepConfig from "../hooks/useWizardStepConfig";
import useWizardStepStatus from "../hooks/useWizardStepStatus";
import useWizards from "../hooks/useWizards";
import {FormattedMessage} from "react-intl";
import {Box, Button, Typography} from "@mui/material";

interface IProps {
  wizardStepId: string;
  nextStep: () => void;
}

const WizardSelectedStep: FunctionComponent<IProps> = ({wizardStepId, nextStep}) => {
  const {skipWizardStep, startWizardStep} = useWizards();

  const wizardStepConfig = useWizardStepConfig(wizardStepId);
  const wizardStepStatus = useWizardStepStatus(wizardStepId);

  const startStep = useCallback((): void => {
    startWizardStep(wizardStepId);
  }, [wizardStepId, startWizardStep]);

  const skipStep = useCallback(() => {
    if (wizardStepStatus?.status === "New") {
      skipWizardStep(wizardStepId);
    } else {
      nextStep();
    }
  }, [wizardStepId, wizardStepStatus]);

  const isCompleted = useMemo<boolean>(() => wizardStepStatus?.status === "Completed", [wizardStepStatus]);

  return (
    <Box sx={{textAlign: "center"}}>
      <Typography variant="h4">
        <FormattedMessage id={wizardStepConfig?.titleKey || "pages.not-available"} />
      </Typography>
      <Typography
        variant="body2"
        sx={{mb: 1, color: (theme) => (isCompleted ? theme.palette.success.dark : theme.palette.text.secondary)}}
      >
        <FormattedMessage
          id={isCompleted ? "pages.completed-step" : "pages.number-of-minutes"}
          values={{minutes: wizardStepConfig?.minutes || 0}}
        />
      </Typography>
      <Box>
        <Typography
          variant="subtitle1"
          sx={{maxWidth: 325, display: "inline-block", mb: 2, color: (theme) => theme.palette.text.secondary}}
        >
          <FormattedMessage id={wizardStepConfig?.descriptionKey || "pages.not-available"} />
        </Typography>
      </Box>

      <Box
        component="img"
        sx={{
          maxHeight: 150,
          display: "inline-block",
          mb: 2,
        }}
        alt="Selected wizard step"
        src={wizardStepConfig?.imageUrl}
      />

      <Box sx={{mb: 1}}>
        <Button variant="contained" color="primary" onClick={isCompleted ? nextStep : startStep}>
          <FormattedMessage id={isCompleted ? "pages.next-step" : "pages.get-started"} />
        </Button>
      </Box>
      <Box>
        <Button variant="text" onClick={isCompleted ? startStep : skipStep}>
          <FormattedMessage id={isCompleted ? "pages.try-again" : "pages.skip"} />
        </Button>
      </Box>
    </Box>
  );
};
export default WizardSelectedStep;
