import React, {FunctionComponent, PropsWithChildren, useCallback, useEffect, useState} from "react";
import _ from "lodash";
import {URL_PARAM_ORDER_BY, urlValuesSeparator} from "../../constants/urlKeys";
import {OrderDTO, useDebounceFn, useUrlState} from "@crud-studio/react-crud-core";
import {Entity} from "../../models/entity";
import EntityUtils from "../helpers/EntityUtils";

export interface IOrderByContext {
  contextOrders: OrderDTO[];
  updateContextOrder: (order: OrderDTO) => void;
  removeContextOrder: (orderBy: string) => void;
  clearContextOrders: () => void;
}

export const OrderByContext = React.createContext<IOrderByContext>(undefined!);

interface IProps extends PropsWithChildren<any> {
  entity: Entity<any>;
  onContextOrdersUpdated?: (contextOrders: OrderDTO[]) => void;
}

const OrderByManager: FunctionComponent<IProps> = ({entity, onContextOrdersUpdated, children}) => {
  const [contextOrders, setContextOrders] = useUrlState<OrderDTO[]>(
    URL_PARAM_ORDER_BY,
    [],
    (state) => !!state.length,
    (urlState) => {
      return urlState
        .split(urlValuesSeparator)
        .map<OrderDTO>((stringOrder) => {
          try {
            return JSON.parse(stringOrder);
          } catch (e) {
            return {};
          }
        })
        .filter((filterField) =>
          entity.columns.some((column) => EntityUtils.getColumnOrderFieldName(column) === filterField.by)
        );
    },
    (state) => {
      return state.map<string>((order) => JSON.stringify(order)).join(urlValuesSeparator);
    }
  );

  const [contextOrdersUpdated, setContextOrdersUpdated] = useState<number>(0);
  const setContextOrdersUpdatedDebounced = useDebounceFn(setContextOrdersUpdated, 250);

  const dispatchContextOrdersUpdated = useCallback(
    (debounced: boolean): void => {
      const now = new Date().getTime();
      if (debounced) {
        setContextOrdersUpdatedDebounced(now);
      } else {
        setContextOrdersUpdated(now);
        setContextOrdersUpdatedDebounced(now);
      }
    },
    [setContextOrdersUpdated, setContextOrdersUpdatedDebounced]
  );

  useEffect(() => {
    if (onContextOrdersUpdated) {
      onContextOrdersUpdated(contextOrders);
    }
  }, [contextOrdersUpdated]);

  const updateContextOrder = useCallback(
    (order: OrderDTO): void => {
      setContextOrders((contextOrders) => [...contextOrders.filter((x) => x.by !== order.by), order]);
      dispatchContextOrdersUpdated(true);
    },
    [setContextOrders, dispatchContextOrdersUpdated]
  );

  const removeContextOrder = useCallback(
    (orderBy: string): void => {
      setContextOrders((contextOrders) => contextOrders.filter((x) => x.by !== orderBy));
      dispatchContextOrdersUpdated(true);
    },
    [setContextOrders]
  );

  const clearContextOrders = useCallback((): void => {
    if (!_.isEmpty(contextOrders)) {
      setContextOrders([]);
      dispatchContextOrdersUpdated(false);
    }
  }, [contextOrders, setContextOrders]);

  return (
    <OrderByContext.Provider
      value={{
        contextOrders,
        updateContextOrder,
        removeContextOrder,
        clearContextOrders,
      }}
    >
      {children}
    </OrderByContext.Provider>
  );
};

export default OrderByManager;
