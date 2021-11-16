import {useMemo} from "react";
import useWizards from "./useWizards";
import {WizardStatus} from "../WizardsContext";

const useWizardStatus = (wizardId: string): WizardStatus | undefined => {
  const {getWizardStatus} = useWizards();

  return useMemo<WizardStatus | undefined>(() => getWizardStatus(wizardId), [getWizardStatus, wizardId]);
};
export default useWizardStatus;
