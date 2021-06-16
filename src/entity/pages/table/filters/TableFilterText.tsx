import React, {FunctionComponent} from "react";
import TableFilterInput from "./TableFilterInput";
import {IPropsEntityColumnFilter} from "../../../../models/props";

const TableFilterString: FunctionComponent<IPropsEntityColumnFilter> = ({column}) => {
  return <TableFilterInput fieldName={column.name} inputType="text" operation="Contains" />;
};
export default TableFilterString;
