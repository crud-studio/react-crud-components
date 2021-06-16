import React from "react";
import TableData from "../data/TableData";
import {BaseJpaRO} from "@crud-studio/react-crud-core";
import {Checkbox, TableCell, TableRow} from "@material-ui/core";
import {tableCellWidth} from "../../../../constants/defaultValues";
import _ from "lodash";
import {EntityColumn} from "../../../../models/entity";

interface IProps<EntityRO extends BaseJpaRO> {
  columns: EntityColumn[];
  item: EntityRO;
  isSelect: boolean;
  onClickItem: (event: React.MouseEvent<HTMLElement>, item: any) => void; // We use any because of issue with typescript
  onCheckItem: (event: React.MouseEvent<HTMLElement>, item: any) => void; // We use any because of issue with typescript
  onContextMenuItem: (event: React.MouseEvent<HTMLElement>, item: any) => void; // We use any because of issue with typescript
}

const TableRowView = <EntityRO extends BaseJpaRO>({
  columns,
  item,
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
      sx={{cursor: "pointer"}}
    >
      <TableCell
        align="center"
        onClick={(event) => {
          onCheckItem(event, item);
          event.stopPropagation();
        }}
        sx={{width: "1px"}}
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
