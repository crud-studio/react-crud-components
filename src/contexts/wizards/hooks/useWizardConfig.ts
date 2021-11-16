import {useMemo} from "react";
import useWizards from "./useWizards";
import {WizardConfig} from "../WizardsContext";

const useWizardConfig = (wizardId: string): WizardConfig | undefined => {
  const {getWizardConfig} = useWizards();

  return useMemo<WizardConfig | undefined>(() => getWizardConfig(wizardId), [getWizardConfig, wizardId]);
};
export default useWizardConfig;
