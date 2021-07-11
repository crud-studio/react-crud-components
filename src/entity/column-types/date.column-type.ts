import _ from "lodash";
import {FilterField} from "@crud-studio/react-crud-core";
import {EntityColumn, EntityColumnTypeConfig} from "../../models/entity";
import TableFilterDate from "../pages/table/filters/TableFilterDate";
import TableDataDate from "../pages/table/data/TableDataDate";
import {DIGITS_REGEX} from "../../constants/regex";
import EntityUtils from "../helpers/EntityUtils";
import EntityFieldInputDate from "../inputs/field/inputs/EntityFieldInputDate";

export const dateColumnType: EntityColumnTypeConfig = {
  type: "Date",
  inputComponent: EntityFieldInputDate,
  filterComponent: TableFilterDate,
  dataComponent: TableDataDate,
  getDefaultValue(column: EntityColumn): number {
    return new Date().getTime();
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
    return {fieldName: EntityUtils.getColumnFilterFieldName(column), operation: "GreaterEqual", values: [search]};
  },
  getGrant(column: EntityColumn): string | undefined {
    return undefined;
  },
};
