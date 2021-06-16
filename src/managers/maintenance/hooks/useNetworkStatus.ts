import {useState} from "react";
import {useNetworkState, useUpdateEffect} from "react-use";
import useGetNetworkStatus from "../api/useGetNetworkStatus";

const useNetworkStatus = (url: string) => {
  const [active, setActive] = useState<boolean | null>(null);

  const networkState = useNetworkState();
  const {result, error, executeRequest} = useGetNetworkStatus(url, {manual: true});

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
export default useNetworkStatus;
