import React, {FunctionComponent} from "react";
import TableFilterInput from "./TableFilterInput";
import {IPropsEntityColumnFilter} from "../../../../models/props";
import InputUtils from "../../../../helpers/InputUtils";
import {INTEGER_REGEX} from "../../../../constants/regex";

const TableFilterInteger: FunctionComponent<IPropsEntityColumnFilter> = ({column}) => {
  return (
    <TableFilterInput
      column={column}
      inputType="text"
      operation="Equal"
      onInput={InputUtils.inputRemoveNonIntegerCharacters}
      isFilterValueValid={(filterValue) => INTEGER_REGEX.test(filterValue)}
      filterValueTransformer={(filterValue) => parseInt(filterValue)}
    />
  );
};
export default TableFilterInteger;
