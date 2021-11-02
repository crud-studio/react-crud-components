import {useContext} from "react";
import {GrantsContext, IGrantsContext} from "../GrantsContext";

const useGrants = (): IGrantsContext => {
  const context = useContext(GrantsContext);

  if (!context) throw new Error("GrantsContext must be used inside GrantsProvider");

  return context;
};
export default useGrants;
