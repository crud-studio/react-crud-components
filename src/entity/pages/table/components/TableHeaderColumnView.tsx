import React, {FunctionComponent, useCallback, useEffect, useState} from "react";
import _ from "lodash";
import {FormattedMessage} from "react-intl";
import {Box, TableCell} from "@material-ui/core";
import {TableSortLabel} from "@material-ui/core";
import {tableCellWidth} from "../../../../constants/defaultValues";
import {EntityColumn} from "../../../../models/entity";
import useOrderBy from "../../../hooks/useOrderBy";

interface IProps {
  column: EntityColumn;
}

type OrderStatus = undefined | "asc" | "desc";

const TableHeaderColumnView: FunctionComponent<IProps> = ({column}) => {
  const {contextOrders, updateContextOrder, removeContextOrder} = useOrderBy();

  const [orderStatus, setOrderStatus] = useState<OrderStatus>(undefined);
  const [orderNumber, setOrderNumber] = useState<number>(0);

  useEffect(() => {
    const index = _.findIndex(contextOrders, (order) => order.by === column.name);
    if (index >= 0) {
      const order = contextOrders[index];
      setOrderNumber(index + 1);
      setOrderStatus(order.descending ? "desc" : "asc");
    } else {
      setOrderStatus(undefined);
      setOrderNumber(0);
    }
  }, [contextOrders]);

  const onOrderClick = useCallback((): void => {
    if (!column.sortable) {
      return;
    }

    switch (orderStatus) {
      case undefined:
        updateContextOrder({by: column.name, descending: false});
        break;
      case "asc":
        updateContextOrder({by: column.name, descending: true});
        break;
      case "desc":
        removeContextOrder(column.name);
        break;
    }
  }, [column, orderStatus, updateContextOrder, removeContextOrder]);

  return (
    <TableCell sx={{minWidth: tableCellWidth, maxWidth: tableCellWidth}}>
      <TableSortLabel
        active={!!orderStatus}
        direction={orderStatus}
        disabled={!column.sortable}
        onClick={onOrderClick}
        sx={{display: "flex", flexDirection: "row", width: "100%"}}
      >
        <Box sx={{flexGrow: 1}}>
          <FormattedMessage id={column.titleKey} />
        </Box>
        {!!orderStatus && `${orderNumber}`}
      </TableSortLabel>
    </TableCell>
  );
};
export default TableHeaderColumnView;
