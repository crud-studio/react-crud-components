import _ from "lodash";
import {FilterField} from "@crud-studio/react-crud-core";
import {EntityColumn, EntityColumnTypeConfig} from "../../models/entity";
import EntityColumnInputNumber from "../pages/details/inputs/EntityColumnInputNumber";
import TableFilterNumber from "../pages/table/filters/TableFilterNumber";
import TableDataNumber from "../pages/table/data/TableDataNumber";
import {DIGITS_REGEX} from "../../constants/regex";
import EntityUtils from "../helpers/EntityUtils";

export const numberColumnType: EntityColumnTypeConfig = {
  type: "Number",
  inputComponent: EntityColumnInputNumber,
  filterComponent: TableFilterNumber,
  dataComponent: TableDataNumber,
  getDefaultValue(column: EntityColumn): number {
    return 0;
  },
  parseValue(column: EntityColumn, value: unknown): number | undefined {
    if (_.isNumber(value)) {
      return value;
    }
    if (_.isString(value) && !!value && DIGITS_REGEX.test(value)) {
      return _.parseInt(value);
    }
    return undefined;
  },
  isSearchable(column: EntityColumn, search: string): boolean {
    return !!search && DIGITS_REGEX.test(search);
  },
  getSearchFilterField(column: EntityColumn, search: string): FilterField {
    return {fieldName: EntityUtils.getColumnFilterFieldName(column), operation: "Equal", values: [search]};
  },
};
