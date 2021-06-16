import {GenericRequestState, useGenericRequest} from "@crud-studio/react-crud-core";

interface Options {
  manual?: boolean;
}

function useGetNetworkStatus(
  url: string,
  options: Options = {
    manual: false,
  }
): GenericRequestState<boolean> {
  return useGenericRequest<boolean>(
    {
      url: url,
      method: "GET",
    },
    {
      manual: options?.manual,
      cache: false,
      throttle: false,
      resultTransformer: (responseData) => !!responseData,
      successTransformer: (responseData) => !!responseData,
    }
  );
}
export default useGetNetworkStatus;
