import {useContext} from "react";
import {GrantContext} from "../GrantsManager";

const useGrants = () => {
  const context = useContext(GrantContext);

  if (!context) throw new Error("Grants context must be use inside GrantsManager");

  return context;
};
export default useGrants;
