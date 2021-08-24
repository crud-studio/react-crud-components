import React, {FunctionComponent} from "react";
import TableFilterInput from "./TableFilterInput";
import {IPropsEntityColumnFilter} from "../../../../models/props";

const TableFilterFile: FunctionComponent<IPropsEntityColumnFilter> = ({column}) => {
  return <TableFilterInput column={column} inputType="text" operation="Contains" />;
};
export default TableFilterFile;
