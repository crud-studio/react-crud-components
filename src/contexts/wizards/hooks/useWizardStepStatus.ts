import {useMemo} from "react";
import useWizards from "./useWizards";
import {WizardStepStatus} from "../WizardsContext";

const useWizardStepStatus = (wizardStepId?: string): WizardStepStatus | undefined => {
  const {getWizardStepStatus} = useWizards();

  return useMemo<WizardStepStatus | undefined>(
    () => (wizardStepId ? getWizardStepStatus(wizardStepId) : undefined),
    [getWizardStepStatus, wizardStepId]
  );
};
export default useWizardStepStatus;
