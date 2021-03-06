import React, {FunctionComponent, useCallback, useEffect, useState} from "react";
import _ from "lodash";
import {FormattedMessage} from "react-intl";
import {Box, TableCell} from "@mui/material";
import {TableSortLabel} from "@mui/material";
import {tableCellWidth} from "../../../../constants/defaultValues";
import {EntityColumn} from "../../../../models/entity";
import useOrderBy from "../../../contexts/order-by/hooks/useOrderBy";
import EntityUtils from "../../../helpers/EntityUtils";

interface IProps {
  column: EntityColumn;
}

type OrderStatus = undefined | "asc" | "desc";

const TableHeaderColumnView: FunctionComponent<IProps> = ({column}) => {
  const {contextOrders, updateContextOrder, removeContextOrder} = useOrderBy();

  const [orderStatus, setOrderStatus] = useState<OrderStatus>(undefined);
  const [orderNumber, setOrderNumber] = useState<number>(0);

  useEffect(() => {
    const columnOrderFieldName = EntityUtils.getColumnOrderFieldName(column);
    const index = _.findIndex(contextOrders, (order) => order.by === columnOrderFieldName);
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

    const columnOrderFieldName = EntityUtils.getColumnOrderFieldName(column);
    switch (orderStatus) {
      case undefined:
        updateContextOrder({by: columnOrderFieldName, descending: false});
        break;
      case "asc":
        updateContextOrder({by: columnOrderFieldName, descending: true});
        break;
      case "desc":
        removeContextOrder(columnOrderFieldName);
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
