import {useContext} from "react";
import {ModalsContext} from "../ModalsContext";

const useModals = () => {
  const context = useContext(ModalsContext);

  if (!context) throw new Error("ModalsContext must be use inside ModalsProvider");

  return context;
};
export default useModals;
