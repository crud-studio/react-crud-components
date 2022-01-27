import React, {FunctionComponent, useCallback, useEffect, useState} from "react";
import _ from "lodash";
import useWizardConfig from "../hooks/useWizardConfig";
import useWizardStatus from "../hooks/useWizardStatus";
import WizardSelectedStep from "./WizardSelectedStep";
import {FormattedMessage} from "react-intl";
import WizardSteps from "./WizardSteps";
import {Box, Grid, LinearProgress, Typography} from "@mui/material";
import {WizardConfig, WizardStepConfig} from "../WizardsContext";
import useWizards from "../hooks/useWizards";
import PerfectScrollbar from "react-perfect-scrollbar";

interface IProps {
  wizardId: string;
}

const WizardInfo: FunctionComponent<IProps> = ({wizardId}) => {
  const {updatedWizardStepStatus, getWizardStepStatus} = useWizards();

  const wizardConfig = useWizardConfig(wizardId);
  const wizardStatus = useWizardStatus(wizardId);

  const [selectedStepId, setSelectedStepId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (wizardConfig) {
      setSelectedStepId(getDefaultStepId(wizardConfig));
    }
  }, [wizardConfig]);

  useEffect(() => {
    if (
      updatedWizardStepStatus &&
      updatedWizardStepStatus.id === selectedStepId &&
      (updatedWizardStepStatus.status === "Completed" || updatedWizardStepStatus.status === "Skipped") &&
      wizardConfig
    ) {
      setSelectedStepId(getDefaultStepId(wizardConfig, updatedWizardStepStatus.id));
    }
  }, [updatedWizardStepStatus]);

  const getDefaultStepId = useCallback(
    (wizardConfig: WizardConfig, currentSelectedStepId?: string): string | undefined => {
      const currentSelectedStepIndex = _.findIndex(wizardConfig.steps, (step) => step.id === currentSelectedStepId);

      let defaultStep: WizardStepConfig | undefined = _.find(
        wizardConfig.steps,
        (stepConfig: WizardStepConfig) => {
          const stepStatus = getWizardStepStatus(stepConfig.id);
          return !!stepStatus && stepStatus.status === "New";
        },
        Math.max(currentSelectedStepIndex, 0)
      );

      if (!defaultStep) {
        defaultStep = _.last(wizardConfig.steps);
      }

      return defaultStep?.id;
    },
    [getWizardStepStatus]
  );

  const nextStep = useCallback((): void => {
    if (wizardConfig) {
      setSelectedStepId(getDefaultStepId(wizardConfig, selectedStepId));
    }
  }, [selectedStepId, wizardConfig]);

  if (!wizardConfig || !wizardStatus) {
    return null;
  }

  return (
    <Grid container>
      <Grid item xs={6}>
        <Typography variant="body1" sx={{mb: 2}}>
          <FormattedMessage id="pages.your-progress" />
          {`: ${wizardStatus.percentComplete}%`}
        </Typography>

        <LinearProgress variant="determinate" value={wizardStatus.percentComplete} sx={{mb: 2}} />

        <Box sx={{height: 380}}>
          <PerfectScrollbar options={{suppressScrollX: true, wheelPropagation: true}}>
            <WizardSteps
              steps={wizardConfig.steps}
              selectedStepId={selectedStepId}
              setSelectedStepId={setSelectedStepId}
            />
          </PerfectScrollbar>
        </Box>
      </Grid>
      <Grid item xs={6}>
        <div>{selectedStepId && <WizardSelectedStep wizardStepId={selectedStepId} nextStep={nextStep} />}</div>
      </Grid>
    </Grid>
  );
};
export default WizardInfo;
