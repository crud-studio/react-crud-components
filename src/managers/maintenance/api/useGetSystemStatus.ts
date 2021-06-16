import {GenericRequestState, useGenericRequest} from "@crud-studio/react-crud-core";

interface Options {
  manual?: boolean;
}

function useGetSystemStatus(
  options: Options = {
    manual: false,
  }
): GenericRequestState<boolean> {
  return useGenericRequest<boolean>(
    {
      url: `/system/status`,
      method: "GET",
    },
    {
      manual: options?.manual,
      cache: false,
      throttle: false,
      resultTransformer: (responseData) => responseData.success,
    }
  );
}
export default useGetSystemStatus;
