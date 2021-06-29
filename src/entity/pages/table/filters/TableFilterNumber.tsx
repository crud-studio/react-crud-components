import React, {FunctionComponent} from "react";
import TableFilterInput from "./TableFilterInput";
import {IPropsEntityColumnFilter} from "../../../../models/props";

const TableFilterNumber: FunctionComponent<IPropsEntityColumnFilter> = ({column}) => {
  return <TableFilterInput column={column} inputType="number" operation="Equal" />;
};
export default TableFilterNumber;
