import {useContext} from "react";
import {GrantsContext} from "../GrantsContext";

const useGrants = () => {
  const context = useContext(GrantsContext);

  if (!context) throw new Error("GrantsContext must be use inside GrantsProvider");

  return context;
};
export default useGrants;
