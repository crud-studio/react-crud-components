import React, {FunctionComponent} from "react";
import TableFilterInput from "./TableFilterInput";
import {IPropsEntityColumnFilter} from "../../../../models/props";
import InputUtils from "../../../../helpers/InputUtils";
import {FLOAT_REGEX} from "../../../../constants/regex";

const TableFilterNumber: FunctionComponent<IPropsEntityColumnFilter> = ({column}) => {
  return (
    <TableFilterInput
      column={column}
      inputType="text"
      operation="Equal"
      onInput={InputUtils.inputRemoveNonFloatCharacters}
      isFilterValueValid={(filterValue) => FLOAT_REGEX.test(filterValue)}
      filterValueTransformer={(filterValue) => parseFloat(filterValue)}
    />
  );
};
export default TableFilterNumber;
