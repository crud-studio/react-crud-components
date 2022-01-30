import {FunctionComponent, memo, useCallback} from "react";
import React from "react";
import TableFilter from "../filters/TableFilter";
import TableHeaderColumnView from "./TableHeaderColumnView";
import {Checkbox, IconButton, TableCell, TableHead, TableRow, Tooltip} from "@mui/material";
import {CloseOutlined} from "@mui/icons-material";
import {tableCellWidth, tableCheckboxCellWidth} from "../../../../constants/defaultValues";
import {EntityColumn} from "../../../../models/entity";
import {FormattedMessage} from "react-intl";
import useFilters from "../../../contexts/filter/hooks/useFilters";
import useOrderBy from "../../../contexts/order-by/hooks/useOrderBy";

interface IProps {
  columns: EntityColumn[];
  itemsLength: number;
  selectedItemsLength: number;
  handleChangeSelectAll: (isToggle: boolean) => void;
}

const TableHeaderRowView: FunctionComponent<IProps> = ({
  columns,
  itemsLength,
  selectedItemsLength,
  handleChangeSelectAll,
}) => {
  const {clearContextFilterFields} = useFilters();
  const {clearContextOrders} = useOrderBy();

  const clearFiltersAndOrder = useCallback(() => {
    clearContextFilterFields();
    clearContextOrders();
  }, [clearContextFilterFields, clearContextOrders]);

  return (
    <TableHead>
      <TableRow>
        <TableCell
          align="center"
          onClick={(event) => {
            handleChangeSelectAll(true);
            event.stopPropagation();
          }}
          sx={{width: "1px", minWidth: tableCheckboxCellWidth, maxWidth: tableCheckboxCellWidth}}
        >
          <Checkbox
            checked={itemsLength > 0 && selectedItemsLength >= itemsLength}
            indeterminate={selectedItemsLength > 0 && selectedItemsLength < itemsLength}
          />
        </TableCell>
        {columns.map((column) => {
          return <TableHeaderColumnView column={column} key={column.name} />;
        })}
      </TableRow>
      <TableRow className="table-filters">
        <TableCell
          align="center"
          onClick={clearFiltersAndOrder}
          sx={{width: "1px", minWidth: tableCheckboxCellWidth, maxWidth: tableCheckboxCellWidth}}
        >
          <Tooltip title={<FormattedMessage id="pages.clear-filters" />}>
            <IconButton component="span" size="small" aria-label="clear filters">
              <CloseOutlined />
            </IconButton>
          </Tooltip>
        </TableCell>
        {columns.map((column) => {
          return (
            <TableCell sx={{minWidth: tableCellWidth, maxWidth: tableCellWidth}} key={column.name}>
              {column.filterable && <TableFilter column={column} />}
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
};
export default memo(TableHeaderRowView);
