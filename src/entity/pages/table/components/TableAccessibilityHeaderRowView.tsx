import {FunctionComponent, memo} from "react";
import React from "react";
import {TableCell, TableHead, TableRow} from "@material-ui/core";
import {tableCellWidth, tableCheckboxCellWidth} from "../../../../constants/defaultValues";
import {EntityColumn} from "../../../../models/entity";
import {FormattedMessage} from "react-intl";

interface IProps {
  columns: EntityColumn[];
  itemCount: number;
}

const TableAccessibilityHeaderRowView: FunctionComponent<IProps> = ({columns, itemCount}) => {
  return (
    <TableHead sx={{height: itemCount ? "0px" : "1px", maxHeight: "0px", overflow: "hidden", visibility: "hidden"}}>
      <TableRow>
        <TableCell
          padding="none"
          sx={{width: "1px", minWidth: tableCheckboxCellWidth, maxWidth: tableCheckboxCellWidth, border: "none"}}
        />
        {columns.map((column) => {
          return (
            <TableCell
              padding="none"
              sx={{minWidth: tableCellWidth, maxWidth: tableCellWidth, fontSize: 0, lineHeight: 0, border: "none"}}
              key={column.name}
            >
              <FormattedMessage id={column.titleKey} />
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
};
export default memo(TableAccessibilityHeaderRowView);
