import {useContext} from "react";
import {ModalsContext} from "../ModalManager";

const useModals = () => {
  const context = useContext(ModalsContext);

  if (!context) throw new Error("Modals context must be use inside ModalManager");

  return context;
};
export default useModals;
