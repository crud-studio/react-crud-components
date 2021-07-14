import {useContext} from "react";
import {EntityContext} from "../managers/EntityManager";

const useEntity = () => {
  const context = useContext(EntityContext);

  if (!context) throw new Error("Entity context must be use inside EntityManager");

  return context;
};
export default useEntity;
