import {useContext} from "react";
import {EntityContext, IEntityContext} from "../EntityContext";

const useEntity = (): IEntityContext => {
  const context = useContext(EntityContext);

  if (!context) throw new Error("EntityContext must be used inside EntityManager");

  return context;
};
export default useEntity;
