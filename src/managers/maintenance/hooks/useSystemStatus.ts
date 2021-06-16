import {useState} from "react";
import {useNetworkState, useUpdateEffect} from "react-use";
import useGetSystemStatus from "../api/useGetSystemStatus";

const useSystemStatus = () => {
  const [active, setActive] = useState<boolean | null>(null);

  const networkState = useNetworkState();
  const {result, error, executeRequest} = useGetSystemStatus({manual: true});

  useUpdateEffect(() => {
    if (error) {
      setActive(false);
    }
  }, [error]);

  useUpdateEffect(() => {
    if (result) {
      setActive(true);
    }
  }, [result]);

  useUpdateEffect(() => {
    if (networkState.online) {
      setActive(null);
      executeRequest();
    } else {
      setActive(false);
    }
  }, [networkState.online]);

  return active;
};
export default useSystemStatus;
