import React from "react";
import TableData from "../data/TableData";
import {BaseJpaRO} from "@crud-studio/react-crud-core";
import {Checkbox, TableCell, TableRow} from "@material-ui/core";
import {tableCellWidth, tableCheckboxCellWidth} from "../../../../constants/defaultValues";
import _ from "lodash";
import {EntityColumn} from "../../../../models/entity";
import {alpha} from "@material-ui/core/styles";

interface IProps<EntityRO extends BaseJpaRO> {
  columns: EntityColumn[];
  item: EntityRO;
  index: number;
  isSelect: boolean;
  onClickItem: (event: React.MouseEvent<HTMLElement>, item: any) => void; // We use any because of issue with typescript
  onCheckItem: (event: React.MouseEvent<HTMLElement>, item: any) => void; // We use any because of issue with typescript
  onContextMenuItem: (event: React.MouseEvent<HTMLElement>, item: any) => void; // We use any because of issue with typescript
}

const TableRowView = <EntityRO extends BaseJpaRO>({
  columns,
  item,
  index,
  isSelect,
  onClickItem,
  onCheckItem,
  onContextMenuItem,
}: IProps<EntityRO>) => {
  return (
    <TableRow
      hover
      selected={isSelect}
      onClick={(e) => onClickItem(e, item)}
      onContextMenu={(e) => onContextMenuItem(e, item)}
      sx={{
        cursor: "pointer",
        backgroundColor: (theme) =>
          index % 2 !== 0 ? alpha(theme.palette.action.hover, theme.palette.action.hoverOpacity * 0.5) : "transparent",
      }}
    >
      <TableCell
        align="center"
        onClick={(event) => {
          onCheckItem(event, item);
          event.stopPropagation();
        }}
        sx={{width: "1px", minWidth: tableCheckboxCellWidth, maxWidth: tableCheckboxCellWidth}}
      >
        <Checkbox checked={isSelect} />
      </TableCell>

      {columns.map((column) => {
        return (
          <TableCell sx={{minWidth: tableCellWidth, maxWidth: tableCellWidth}} key={column.name}>
            <TableData column={column} item={item} />
          </TableCell>
        );
      })}
    </TableRow>
  );
};
export default React.memo(TableRowView, (prevProps, nextProps) => {
  return _.isEqual(prevProps.item, nextProps.item) && _.isEqual(prevProps.isSelect, nextProps.isSelect);
});
