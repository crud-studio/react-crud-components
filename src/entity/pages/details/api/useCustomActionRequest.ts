import {GenericRequestState, useGenericRequest} from "@crud-studio/react-crud-core";
import {Entity, EntityGenericActionConfig} from "../../../../models/entity";
import _ from "lodash";
import {useCallback} from "react";

function useCustomActionRequest(
  entity: Entity<any>,
  customAction: EntityGenericActionConfig<any>,
  itemId: number,
  data: object
): GenericRequestState<any> {
  const getUrl = useCallback((): string => {
    let url = `${entity.api.path}${customAction.api.path.replace("{id}", _.toString(itemId))}`;
    if (customAction.api.dataLocation === "URL") {
      const params = Object.keys(data)
        .filter((key) => data[key] !== null)
        .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
        .join("&");

      if (params) {
        url += (url.indexOf("?") > -1 ? "&" : "?") + params;
      }
    }
    return url;
  }, [entity, customAction, data]);

  const getData = useCallback((): any => {
    return customAction.api.dataLocation === "BODY" ? data : undefined;
  }, [customAction, data]);

  return useGenericRequest<any>(
    {
      url: getUrl(),
      method: customAction.api.method,
      data: getData(),
    },
    {
      manual: true,
      cache: false,
      cacheName: entity.api.cacheName,
      clearCache: customAction.resultBehavior !== "None",
      throttle: false,
    }
  );
}
export default useCustomActionRequest;
