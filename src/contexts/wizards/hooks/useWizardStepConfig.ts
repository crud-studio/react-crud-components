import {useMemo} from "react";
import useWizards from "./useWizards";
import {WizardStepConfig} from "../WizardsContext";

const useWizardStepConfig = (wizardStepId: string): WizardStepConfig | undefined => {
  const {getWizardStepConfig} = useWizards();

  return useMemo<WizardStepConfig | undefined>(
    () => getWizardStepConfig(wizardStepId),
    [getWizardStepConfig, wizardStepId]
  );
};
export default useWizardStepConfig;
