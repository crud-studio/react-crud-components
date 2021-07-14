import {useState} from "react";
import useGrants from "./useGrants";

const useHasGrant = (grant: string) => {
  const {hasGrant} = useGrants();

  const [hasGrantState] = useState<boolean>(hasGrant(grant));
  return hasGrantState;
};
export default useHasGrant;
