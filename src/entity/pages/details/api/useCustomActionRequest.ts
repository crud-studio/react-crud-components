import {GenericRequestState, useGenericRequest} from "@crud-studio/react-crud-core";
import {Entity, EntityGenericActionApiConfig} from "../../../../models/entity";
import _ from "lodash";
import {useCallback} from "react";

function useCustomActionRequest(
  entity: Entity<any>,
  actionApiConfig: EntityGenericActionApiConfig,
  itemIds: number | number[],
  data: object
): GenericRequestState<any> {
  const getUrl = useCallback((): string => {
    const ids: string = _.isArray(itemIds) ? itemIds.join(",") : _.toString(itemIds);
    let url = `${entity.api.path}${actionApiConfig.path.replace("{id}", ids).replace("{ids}", ids)}`;

    if (actionApiConfig.dataLocation === "URL") {
      const params = Object.keys(data)
        .filter((key) => data[key] !== null)
        .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
        .join("&");

      if (params) {
        url += (url.indexOf("?") > -1 ? "&" : "?") + params;
      }
    }
    return url;
  }, [entity, actionApiConfig, data]);

  const getData = useCallback((): any => {
    return actionApiConfig.dataLocation === "BODY" ? data : undefined;
  }, [actionApiConfig, data]);

  return useGenericRequest<any>(
    {
      url: getUrl(),
      method: actionApiConfig.method,
      data: getData(),
    },
    {
      manual: true,
      cache: false,
      cacheName: entity.api.cacheName,
      clearCache: actionApiConfig.clearCache,
      throttle: false,
    }
  );
}
export default useCustomActionRequest;
