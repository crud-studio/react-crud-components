import {useContext, useState} from "react";
import {GrantContext} from "../GrantsManager";

const useHasGrant = (grant: string) => {
  const {hasGrant} = useContext(GrantContext);

  const [hasGrantState] = useState<boolean>(hasGrant(grant));
  return hasGrantState;
};
export default useHasGrant;
