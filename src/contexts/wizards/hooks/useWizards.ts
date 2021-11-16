import {useContext} from "react";
import {WizardsContext, WizardsContextProps} from "../WizardsContext";

const useWizards = (): WizardsContextProps => {
  const context = useContext(WizardsContext);

  if (!context) throw new Error("WizardsContext must be used inside WizardsProvider");

  return context;
};
export default useWizards;
